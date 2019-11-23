let util            = require("util");
let http            = require("http");
let url             = require("url");
let querystring     = require("querystring");
let WebSocketServer = require('websocket').server;
let ProtoID         = require("./CSProto.js").ProtoID;
let ProtoState      = require("./CSProto.js").ProtoState;
let BSProto         = require("./BSProto.js");
let iconv           = require('iconv-lite');
let CommFuc         = require("../util/CommonFuc.js");
let crypto          = require('crypto');
let fs              = require('fs');
let https           = require('https');
let path            = require("path");
let PFC             = require("../util/PFC.js");

///////////////////////////////////////////////////////////////////////////////
//>> WebSocket 服务器
/**
 * WebSocket 连接
 * @constructor
 */
function WssConn() {
    this.id                 = 0;
    this.uid                = 0;
    this.roomId             = 0;

    this.conn               = null;
    this.time               = 0;
    this.lastActTime        = 0;

    this.msgHandler         = null;
    this.closeHandler       = [];

    this.recvCompHandler    = null;
    this.sendCompHandler    = null;

    this.isClose            = false;
    this.sid                = 0;
}

WssConn.create = function(id, conn){
    let wsConn = new WssConn();
    wsConn.init(id, conn);
    return wsConn;
};

WssConn.prototype = {

    /**
     * 初始化
     * @param id
     * @param conn
     */
    init: function(id, conn) {
        this.id = id;
        this.conn = conn;
        this.time = Date.getStamp();

        this.conn.on("message", function(message){
            if (message.type === 'utf8') {

                // 统计接收数据长度
                this.recvCompHandler && this.recvCompHandler(message.utf8Data.length);
                let msg = message.utf8Data;
                msg = CommFuc.dec(msg);
                // 解码消息
                let query = null;
                try {
                    query = JSON.parse(msg);
                } catch(error) {
                    query = {};
                }

                if (typeof(query) != 'object') {
                    return;
                }

                if (!query.args) {
                    query.args = {};
                }

                //DEBUG(util.format("%d recv Proto > %d", this.id, query.code));

                this.msgHandler && this.msgHandler(query);
            }
        }.bind(this));

        // 依次调用关闭处理程序
        this.conn.on("close", function(){
            this.closeHandler.forEach(function(handler){
                handler(this);
            }.bind(this));
            this.isClose = true;
        }.bind(this));

        this.conn.on("error",function (date) {
            if(date){
                if(date.code != "ECONNRESET") {
                    ERROR("conn错误" + JSON.stringify(date));
                }
            }
        })
    },

    /**
     * 设置消息处理程序
     * @param handler
     */
    setMessageHandler: function(handler) {
        this.msgHandler = handler;
    },

    /**
     * 设置连接关闭处理程序
     * @param handler
     */
    pushCloseHandler: function(handler) {
        this.closeHandler.push(handler);
    },
    /**
     * 清空关闭连接函数
     */
    emptyCloseHander:function () {
        this.closeHandler = [];
    },

    /**
     * 设置接收数据回调
     * @param handler
     */
    setRecvCompHandler: function(handler) {
        this.recvCompHandler = handler;
    },

    /**
     * 设置发送数据回调
     * @param handler
     */
    setSendCompHandler: function(handler) {
        this.sendCompHandler = handler;
    },

    /**
     * 获取连接ID
     * @returns {number|*}
     */
    getId: function() {
        return this.id;
    },

    /**
     * 设置uid
     * @param uid
     */
    setUid:function (uid) {
        this.uid = uid;
    },
    /**
     * 获取uid
     * @returns {number|*}
     */
    getUid:function () {
        return this.uid;
    },
    /**
     * 设置roomid
     */
    setRoomId:function (roomId) {
        this.roomId = roomId;
    },
    /**
     * 获取房间id
     */
    getRoomId:function () {
        return this.roomId;
    },
    /**
     * 设置最后活动时间
     * @param time
     */
    setLastActTime: function (time) {
        this.lastActTime = time;
    },

    /**
     * 获取最后活动时间
     * @returns {*|number}
     */
    getLastActTime: function() {
        return this.lastActTime;
    },

    /**
     * 发送消息
     * @param sMsg
     */
    sendMsg: function(sMsg) {
        if (this.isClose) {
            return;
        }
        if(!sMsg.args){
            sMsg.args = {};
        }
        if(!sMsg.args.result){
            sMsg.args.result = ProtoState.STATE_OK;
        }
        let strMsg = JSON.stringify(sMsg);
        if(sMsg.code != ProtoID.CLIENT_HEARTBEAT) {
            DEBUG("send msg: " + strMsg + "to" + this.uid);
        }
        if(Config.noEncryID.indexOf(sMsg.code) === -1){
            strMsg = CommFuc.enc(strMsg);
        }
        // if(sMsg.code === ProtoID.CLIENT_MIDDLE_QUERY_PLAYER_REPORTS){ // 测试极限发送
        //     GSMgr.broadcastMsg(strMsg);
        // }
        this.conn.sendUTF(strMsg, function(){
            // 统计发送数据长度
            this.sendCompHandler && this.sendCompHandler(strMsg.length);
        }.bind(this));
    },

    /**
     * 关闭连接
     */
    close: function() {
        DEBUG(util.format("Close conn %d", this.id));
        this.isClose = true;
        this.conn.close();
    },

    /**
     * 获取地址字符串
     * @returns {string|*}
     */
    getAddrString: function() {
        return this.conn.remoteAddress;
    },
};

/**
 * WebSocket 服务器
 * @constructor
 */
function WssServer() {
    this.ip                     = null;     // 服务器监听地址
    this.port                   = 0;        // 服务器监听端口

    this.httpServ               = null;     // HTTP服务器
    this.options                = {};       // SSL证书
    this.httpsServ              = null;     // HTTPS服务器
    this.wsServ                 = null;     // WebSocket服务器

    this.wsConnIdGen            = 0;        // 连接数量
    this.wsConnMap              = {};       // WebSocket连接表
    this.wsConnSize             = 0;        // WebSocket连接计数

    this.httpReqHandler         = null;     // HTTP请求处理程序
    this.wsOriginChecker        = null;     // 检测回调
    this.wsConnMsgHandler       = null;     // WebSocket消息处理程序
    this.wsConnCloseHandler     = null;     // WebSocket连接关闭处理程序

    this.onServerStartupHandler = null;     // 服务器启动完成处理程序

    this.sendPing               = false;    // 连接保活
    this.dieConnTime            = 60;       // 连接多长时间没响应就认为挂了

    this.recvBytes              = 0;        // 接收到的数据长度
    this.sendBytes              = 0;        // 发送的数据长度
}

WssServer.create = function(ip, port){
    let wssServ = new WssServer();
    wssServ.init(ip, port);
    return wssServ;
};

WssServer.prototype = {

    /**
     * 初始化
     * @param ip
     * @param port
     */
    init: function(ip, port) {
        this.ip = ip;
        this.port = port;

        // 创建HTTP服务器
        this.httpServ = http.createServer(function (httpReq, httpRes) {
            this.onHttpRequest(httpReq, httpRes, "http");
        }.bind(this));

        // 中央服HTTPS服务器
        if(this.ip === addrConfig.MiddleHost) {
            this.options = {
                key: fs.readFileSync(path.join(__dirname, '../key/nginx.key')),
                cert: fs.readFileSync(path.join(__dirname, '../key/nginx.pem'))
            };
            this.httpsServ = https.createServer(this.options,function (httpReq, httpRes) {
                this.onHttpRequest(httpReq, httpRes, "https");
            }.bind(this));
        }

        // 创建WebSocket服务器
        this.wsServ = new WebSocketServer({
            httpServer: this.httpServ,
            closeTimeout:1000,
        });

        this.wsServ.on("request", function (wsReq) {
            this.onWsRequest(wsReq);
        }.bind(this));

        // 启动定时任务
        setInterval(function(){
            this.onTimeTick();
        }.bind(this), 10000);
    },

    /**
     * 设置HTTP请求处理程序
     * @param handler
     */
    setHttpRequestHandler: function(handler) {
        this.httpReqHandler = handler;
    },

    /**
     * 设置WebSocket连接Origin检查器
     * @param checker
     */
    setWsOriginChecker: function(checker) {
        this.wsOriginChecker = checker;
    },

    /**
     * 设置WebSocket连接消息处理程序
     * @param handler
     */
    setWsConnMsgHandler: function(handler) {
        this.wsConnMsgHandler = handler;
    },

    /**
     * 设置WebSocket连接关闭处理程序
     * @param handler
     */
    setWsConnCloseHandler: function(handler) {
        this.wsConnCloseHandler = handler;
    },

    /**
     * 设置服务器启动成功处理程序
     * @param handler
     */
    setServerStartupHandler: function(handler) {
        this.onServerStartupHandler = handler;
    },

    /**
     * 设置开启/关闭连接保活
     * @param open
     * @param time
     */
    setPing: function(open, time) {
        this.sendPing = open;
        if (time) this.dieConnTime = time;
    },

    /**
     * 获取服务器状态数据
     * @returns {{connSize: number, recvBytes: *, sendBytes: *}}
     */
    getStatics: function() {
        return {
            connSize:   this.wsConnSize,
            recvBytes:  this.recvBytes,
            sendBytes:  this.sendBytes,
        };
    },

    /**
     * 启动服务器
     */
    start: function() {
        this.httpServ.listen(this.port, this.ip, function () {
            this.onServerStartup();
        }.bind(this));
    },
    /**
     * 启动https服务器
     */
    startHttps(){
        if(this.httpsServ) {         // 本地ip地址必须和证书ip地址一样 否则https服务器无法启动
            this.httpsServ.listen(addrConfig.HTTPSPort);
            ERROR("https server start ......");
        }
    },
    /**
     * 停止服务器
     * @param callback
     */
    stop: function(callback){

    },

    /**
     * 增加发送数据
     * @param byteSize
     */
    incBytesSend: function(byteSize) {
        this.sendBytes += byteSize;
    },

    /**
     * 增加接收数据
     * @param byteSize
     */
    incBytesRecv: function(byteSize) {
        this.recvBytes += byteSize;
    },

    /**
     * http请求
     * @param httpReq
     * @param httpRes
     */
    onHttpRequest: function(httpReq, httpRes, reqType) {
        // 服务器正在关闭，直接关闭连接
        if (Process.isExiting()) {
            httpReq.connection.destroy();
            return;
        }
        // 接收数据
        let reqBody = "";
        httpReq.on("data", function (chunk) {
            reqBody += chunk.toString('utf8');
        });
        // 处理接收到的数据
        httpReq.on("end", function(){
            let reqStr = "";
            let pathname = "";
            let query = {};
            let host = this.getClientIp(httpReq);
            host = this.removeFFFF(host);
            if(httpReq.url != "/favicon.ico") {
                let inIps = Config.PFCAddress[addrConfig.MiddleHost] ? Config.PFCAddress[addrConfig.MiddleHost].inIPs : null;
                ERROR("req ip" + host);
                if(inIps){
                    if(inIps.indexOf(host) === -1) {
                        return;
                    }
                }
                let pathname = url.parse(httpReq.url).pathname;
                pathname = pathname.replace(/\//,"");
                if (httpReq.method == "POST") {
                    ERROR("reqBody" + reqBody);
                    if(pathname == ""){
                        let deStr = CommFuc.phpDecode(reqBody);
                        query = JSON.parse(deStr);
                    }else{
                        query = querystring.parse(reqBody);
                    }
                } else {
                    if(host !== addrConfig.MiddleHost){      //测试阶段临时屏蔽 todo
                        return;
                    }
                    let temp = url.parse(httpReq.url).query;
                    if (temp) {
                        reqStr = iconv.decode(temp, 'utf8');
                    }
                    query = querystring.parse(reqStr);
                }
                if(pathname != ""){
                    query.pathname = pathname;
                }
                httpRes._query = query;
                httpRes._time = Date.getStamp();
                httpRes._ip = httpReq.connection.remoteAddress;
                // 调用客户请求处理程序
                this.httpReqHandler && this.httpReqHandler(query, httpReq, httpRes);
            }
        }.bind(this));
    },
    /**
     * 获取访问者的ip地址
     * @param req
     * @returns {*|string}
     */
    getClientIp(req) {
        let add2 = req.connection.remoteAddress;
        let add3 = req.socket.remoteAddress;
        return add2 || add3;
    },

    removeFFFF(ip){
        if (ip.indexOf('::ffff:') !== -1) {
            ip = ip.substring(7);
        }
        return ip;
    },
    /**
     * ws请求
     * @param wsReq
     */
    onWsRequest: function(wsReq) {
        if ((this.wsOriginChecker ? this.wsOriginChecker(wsReq.origin) : true)) {
            // 接受连接
            let wsConn = WssConn.create(++this.wsConnIdGen,
                wsReq.accept("default-protocol", wsReq.origin));
            wsConn.setLastActTime(Date.getStamp());
            // 设置连接关闭处理程序
            wsConn.pushCloseHandler(function () {
                this.onWsConnClose(wsConn);
            }.bind(this));
            // 设置消息处理程序
            wsConn.setMessageHandler(function(wsMsg){
                this.onWsConnMsg(wsConn, wsMsg);
            }.bind(this));
            // 设置统计处理程序
            wsConn.setRecvCompHandler(function(byteSize){
                this.recvBytes += byteSize;
            }.bind(this));
            wsConn.setSendCompHandler(function(byteSize){
                this.sendBytes += byteSize;
            }.bind(this));
            // 加入连接表
            this.wsConnMap[wsConn.getId()] = wsConn;
            this.wsConnSize += 1;
            DEBUG(util.format("Conn %d connected from %s", wsConn.getId(), wsConn.getAddrString()));
        } else {
            // 拒绝连接
            wsReq.reject();
        }
    },
    /**
     * 执行消息处理函数
     * @param wsConn
     * @param wsMsg
     */
    onWsConnMsg: function(wsConn, wsMsg) {
        if (this.sendPing &&
            (wsMsg.code == ProtoID.CMSG_PONG || wsMsg.code == ProtoID.SMSG_PONG)) {
            wsConn.setLastActTime(Date.getStamp());
            return;
        }
        this.wsConnMsgHandler && this.wsConnMsgHandler(wsConn, wsMsg);
    },
    /**
     * 关闭连接函数
     * @param wsConn
     */
    onWsConnClose: function(wsConn) {
        this.wsConnCloseHandler && this.wsConnCloseHandler(wsConn);
        delete this.wsConnMap[wsConn.getId()];
        this.wsConnSize -= 1;
    },
    /**
     * 启动服务器
     */
    onServerStartup: function() {
        this.onServerStartupHandler && this.onServerStartupHandler();
    },
    /**
     * 定时任务
     */
    onTimeTick: function() {
        this.sendPing && this.doKeepAlive();
    },
    /**
     * 保持连活
     */
    doKeepAlive: function() {
        let now = Date.getStamp();
        let needCloseCIds = [];
        for (let cId in this.wsConnMap) {
            let wsConn = this.wsConnMap[cId];
            if ((now - wsConn.getLastActTime()) >= this.dieConnTime) {
                needCloseCIds.push(+cId);
            }
        }
        needCloseCIds.forEach(function(cId){
            this.wsConnMap[cId].close();
        }.bind(this));

        let pingPkt = { code: ProtoID.SMSG_PING };
        for (let cId in this.wsConnMap) {
            this.wsConnMap[cId].sendMsg(pingPkt);
        }
    },
    /**
     * 移除不必要的连接
     */
    removeConn:function (uid, connId) {
        for(let idx in this.wsConnMap){
            let wsConn = this.wsConnMap[idx];
            if(wsConn.uid == uid && connId != +idx){
                ERROR("玩家" + uid + "连接进来，删除以前的conn, id: " + idx);
                delete this.wsConnMap[idx];
                this.wsConnSize -= 1;
                wsConn.isClose = true;
                wsConn = null;
            }
        }
    },
    /**
     * 移除无作用的连接
     */
    removeNoEffectConn:function() {
        for(let idx in this.wsConnMap){
            let wsConn = this.wsConnMap[idx];
            if(wsConn.uid == 0 && wsConn.sid == 0){
                ERROR("删除无意义的连接id: " + idx);
                delete this.wsConnMap[idx];
                this.wsConnSize -= 1;
                wsConn.isClose = true;
                wsConn = null;
            }
        }
    }
};

exports.WssConn = WssConn;
exports.WssServer = WssServer;
