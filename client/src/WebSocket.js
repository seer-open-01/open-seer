/**
 * Created by Jiyou Mo on 2018/4/8.
 */
// WebSocket 网络机制
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

var NetClientCls = cc.Class.extend({
    _webSocket              : null,         // WebSocket 客户端

    _isConnected            : false,        // 是否已经连接上了

    _isDisconnect           : false,        // 是否是主动断开

    _reconnectCb            : null,         // 重连回调函数
    _reconnectTimerId       : null,         // 重连计时器ID
    _isReconnectSucceed     : false,        // 是否是重连成功
    _isReconnecting         : false,        // 是否正在重连

    _reconnectTryTimes      : 0,            // 发起重连的没连上的次数

    _connectIp              : "",           // 连接服务器的IP地址
    _connectPort            : "",           // 连接服务器的端口号

    _messages               : [],           // 大厅消息缓存
    _msgDisposeHandler      : null,         // 大厅消息处理的函数

    _isBackground           : false,        // 是否在后台

    _heartbeatTimerId       : 0,            // 心跳包计时器ID
    _heartbeatInterval      : 5000,         // 心跳包时间间隔(毫秒)
    _isReceiveHeartbeat     : true,         // 是否收到心跳包

    ctor : function () {
        return true;
    },

    /**
     * 初始化
     */
    init : function () {
        if (this._webSocket) {
            if (this._isConnected) {
                this._webSocket.close();
            }
            this._webSocket = null;
        }

        this._isConnected = false;

        // this._reconnectCb = null;
        // this._connectIp = "";
        // this._connectPort = "";

        this._messages = [];
        this._msgDisposeHandler = null;

        // this._isBackground = false;
    },

    /**
     * 连接服务器
     * @param ip
     * @param port
     * @param callback
     */
    connect : function (ip, port, callback) {
        cc.log("==> 正在连接服务器...");

        this._connectIp = ip;
        this._connectPort = port;

        this._doConnect(ip, port, callback);
    },

    /**
     * 执行连接服务器
     * @param ip
     * @param port
     * @param callback
     * @private
     */
    _doConnect : function (ip, port, callback) {
        if (this._webSocket) {
            // 释放旧客户端
            if (this._isConnected) {
                this._webSocket.close();
            }
            this._webSocket = null;
        }

        // 使用新客户端
        this.init();
        cc.log("==> 连接登录服务器:");
        game.UISystem.showLoading();

        this._webSocket = new WebSocket("ws://" + ip + ":" + port);

        this._webSocket.onopen = function (evt) {
            cc.log("==> 连接登录服务器成功:" + evt);
            this._isConnected = true;
            callback && callback(true);
            this._initEnterBackgroundEvent();
            // 启动心跳包
            // this._startHeartBeat();
        }.bind(this);

        this._webSocket.onerror = function(evt) {
            cc.log("大厅网络控制：网络错误:" + evt);
            callback && callback(false);
        };

        this._webSocket.onmessage = this._onMessage.bind(this);

        this._webSocket.onclose = function (evt) {
            cc.log("大厅网络控制：连接关闭：" + evt);
            this._isConnected = false;
            if (!this._isDisconnect && !this._isReconnecting) {
                // 不是主动断开并且没有在重连
                this._stopHeartBeat();
                // setTimeout(this._doReconnect.bind(this), 100);
                this._doReconnect();
            }
            this._isDisconnect = false;
        }.bind(this);
    },

    /**
     * 消息处理
     * @param evt
     * @private
     */
    _onMessage : function (evt) {
        // cc.log("大厅网络控制：收到来自服务器的消息：" + evt.data);
        var data = evt.data;
        // 如果data不含code字串 则进行解密
        if (data.indexOf("code") == -1) {
            data = JSON.parse(this.decode(evt.data));
        } else {
            data = JSON.parse(evt.data);
        }
        var code = data.code;
        var msg = data.args;
        // 处理心跳包
        if (code == protocol.ProtoID.CLIENT_HEARTBEAT) {
            // cc.log("==> heart beating!");
            this._isReceiveHeartbeat = true;
            return;
        }

        // 处理重连数据解析
        if (this._isReconnectSucceed) {
            this._isReconnectSucceed = false;
            game.DataKernel.parse(msg);
            this._reconnectCb && this._reconnectCb(msg);
            // game.UISystem.hideLoading();
            return;
        }

        // 处理消息
        if (this._msgDisposeHandler) {
            // 有消息处理回调
            this._msgDisposeHandler(code, msg);
        } else {
            // 没消息处理回调
            cc.log("大厅网络控制：没有绑定大厅处理函数，将消息放入消息队列");
            this._messages.push({k : code, v : msg});
        }
    },

    /**
     * 断开连接
     */
    disconnect : function () {
        cc.log("主动调用了客户端连接");
        if (this._webSocket) {
            if (this._isConnected) {
                this._webSocket.close();
            }
            this._webSocket = null;
            this._isDisconnect = true;
        }
    },

    /**
     * 发送消息到服务器
     * @param routerCode
     * @param message
     */
    sendMessage : function (routerCode, message) {
        cc.log("向服务器发送数据 code:" + routerCode + "  args:" + JSON.stringify(message));
        // if (this._webSocket.readyState == WebSocket.OPEN)
        if (this._isConnected) {
            var json = {};
            json.code = routerCode;
            json.args = message || {};
            this._webSocket.send(this.encryption(JSON.stringify(json)));
        } else {
            cc.log("大厅 webSocket 未连接或启动，请启动连接后再尝试发送数据");
            // 触发重连
            if (!this._isReconnecting) {
                this._doReconnect();
            }
        }
    },

    /**
     * 绑定消息处理函数(用于绑定大厅消息处理函数)
     * @param handler
     */
    onMsgDispatchHandler : function (handler) {
        this._msgDisposeHandler = handler;
    },

    onReconnectCallback : function (callback) {
        this._reconnectCb = callback;
    },

    /**
     * 获取一个消息数据
     * @returns {*}
     * @constructor
     */
    popMessages : function () {
        if (this._messages.length > 0) {
            return this._messages.shift();
        }

        return null;
    },

    /**
     * 是否已经连接上了
     * @returns {boolean}
     */
    isConnected : function () {
        return this._isConnected;
    },

    /**
     * 后台切换事件回调
     * @private
     */
    _initEnterBackgroundEvent : function () {

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() {
            cc.log("==>游戏进入后台");
            if (this._isBackgroud) {
                // 如果已经在后台了。则不执行后台的操作
                return;
            }

            this._isBackgroud = true;

            var curProcedure = game.Procedure.getProcedure();
            curProcedure.enterBackground && curProcedure.enterBackground();

            // 不延时下麦
            // VoiceSDK.micDown(true);
            // 关背景音乐
            var musVol = game.Audio.getMusicVolume();
            game.LocalDB.set("CUR_MUS_VOL", musVol);
            game.Audio.setMusicVolume(0);
        }.bind(this));

        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function() {
            cc.log("==>重新返回游戏");
            if (!this._isBackgroud) {
                return;
            }

            this._isBackgroud = false;

            // 恢复背景音乐
            var musVol = game.LocalDB.get("CUR_MUS_VOL") || 0;
            game.Audio.setMusicVolume(musVol);

            // 执行重连
            this._doReconnect();
        }.bind(this));
    },

    /**
     * 启动心跳包
     * @private
     */
    _startHeartBeat : function () {
        cc.log("===> 启动心跳包");
        this._stopHeartBeat();
        this._isReceiveHeartbeat = true;
        this._heartbeatTimerId = setInterval(function (_this) {
            _this._doSendHeartBeat();
        }, this._heartbeatInterval, this);
    },

    _doSendHeartBeat : function () {
        // cc.log("===> 发送心跳包");
        if (this._isReceiveHeartbeat) {
            this._isReceiveHeartbeat = false;
            this.sendMessage(protocol.ProtoID.CLIENT_HEARTBEAT, {});
        } else {
            // 执行重连机制
            if (!this._isReconnecting)
                this._doReconnect();
        }
    },

    /**
     * 停止心跳包
     * @private
     */
    _stopHeartBeat : function () {
        cc.log("关闭发送心跳包");
        if (this._heartbeatTimerId) {
            clearInterval(this._heartbeatTimerId);
            this._heartbeatTimerId = 0;
        }
    },

    /**
     * 执行重连
     * @private
     */
    _doReconnect : function () {
        cc.log("==>  开始执行重连 ==============================");
        this._isReconnecting = true;
        this._stopHeartBeat();
        game.UISystem.showLoading();
        this._reconnectTimerId = setTimeout(function (_this) {
            _this._doConnect(_this._connectIp, _this._connectPort, function (connected) {
                clearTimeout(_this._reconnectTimerId);
                if (connected) {
                    _this._reconnectTryTimes = 0;
                    _this._isReconnectSucceed = true;
                    _this._isReconnecting = false;
                    // 重连上了
                    var msg = {};
                    msg.openId = game.DataKernel.openid;
                    // msg.uid = game.DataKernel.uid;
                    msg.name = game.DataKernel.name;
                    msg.headPic = game.DataKernel.headPic;
                    msg.sex = game.DataKernel.sex;
                    // 发送登录消息
                    _this.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_LOGIN, msg);
                } else {
                    _this._reconnectTryTimes++;
                    if (_this._reconnectTryTimes < 3) {
                        // 没重连上 继续执行重连
                        _this._doReconnect();
                    } else {
                        // 没重连上，做提示
                        game.ui.TipWindow.popup({
                            tipStr: "连接错误，确定网络连接后点击登录重试。"
                        }, function (win) {
                            game.UISystem.closePopupWindow(win);
                            game.Procedure.switch(game.procedure.Login);
                            game.hallNet._isReconnecting = false;
                        });
                        game.UISystem.hideLoading();
                        _this._reconnectTryTimes = 0;
                        // _this._isReconnecting = false;      // 重连结束
                    }
                }
            });
        }, 1000, this);
    },

    /**
     * 发送进入后台的消息
     */
    sendEnterBackground : function () {},

    /**
     * 发送进入前台的消息
     */
    sendEnterForeground : function () {},

    /**
     * 加密
     */
    encryption : function (str) {
        var c = String.fromCharCode(str.charCodeAt(0) + str.length);
        for (var i = 1; i < str.length; i++) {
            c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
        }
        return this.stringToHex(c);
    },

    /**
     * 解密
     */
    decode : function (str) {
        str = this.hexToString(str);
        var c = String.fromCharCode(str.charCodeAt(0) - str.length);
        for (var i = 1; i < str.length; i++) {
            c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    },

    strToBinary : function(str){
        var result = [];
        var list = str.split("");
        for (var i = 0; i < list.length; i++) {
            if(i != 0) {
                result.push(" ");
            }
            var item = list[i];
            var binaryStr = item.charCodeAt().toString(2);
            result.push(binaryStr);
        }
        return result.join("");
    },

    binaryToStr : function (str) {
        var result = [];
        var list = str.split(" ");
        for(var i = 0; i < list.length; i++) {
            var item = list[i];
            var asciiCode = parseInt(item, 2);
            var charValue = String.fromCharCode(asciiCode);
            result.push(charValue);
        }
        return result.join("");
    },

    /**
     * 字符串转化为十六进制
     * @param str
     * @returns {string}
     */
    stringToHex : function(str) {
        var val = "";
        for (var i = 0; i < str.length; i++) {
            if (val == "")
                val = str.charCodeAt(i).toString(16);
            else
                val += "," + str.charCodeAt(i).toString(16);
        }
        return val;
    },

    /**
     * 十六进制转化为字符串
     * @param str
     * @returns {string}
     */
    hexToString : function (str) {
        var val = "";
        var arr = str.split(",");
        for (var i = 0; i < arr.length; i++) {
            val += String.fromCharCode(parseInt(arr[i], 16));
        }
        return val;
    }

});

/**
 * 大厅的WebSocket
 */
game.hallNet = new NetClientCls();
