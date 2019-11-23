let util              = require("util");
let WebSocketClient   = require("websocket").client;
let WssConnDef        = require("../net/WssServer.js").WssConn;
let ProtoID           = require("../net/CSProto.js").ProtoID;
let ProtoState        = require("../net/CSProto.js").ProtoState;
let GameLogic         = require("./index.js");
///////////////////////////////////////////////////////////////////////////////
//>> WebSocket客户端

function WssClient() {
    this.id = 0;
    this.client = null;
    this.conn = null;

    this.onConnected = null;
    this.onConnectedFailed = null;
    this.onConnClosed = null;
    this.onConnMsg = null;

    this.init();
}

WssClient.prototype = {

    /**
     * 初始化
     */
    init: function () {
        this.client = new WebSocketClient();

        this.client.on('connectFailed', function (error) {
            this.onConnectedFailed && this.onConnectedFailed();
        }.bind(this));

        this.client.on("connect", function (connection) {

            this.conn = WssConnDef.create(0, connection);
            this.conn.setLastActTime(Date.getStamp());
            // 设置连接关闭处理程序
            this.conn.pushCloseHandler(function () {
                this.onConnClosed && this.onConnClosed();
            }.bind(this));
            // 设置消息处理程序
            this.conn.setMessageHandler(function (wsMsg) {
                this.onConnMsg && this.onConnMsg(wsMsg);
            }.bind(this));
            // 设置接受消息完成处理程序
            this.conn.setRecvCompHandler(function (byteSize) {
                WssServer && WssServer.incBytesRecv(byteSize);
            }.bind(this));
            // 设置发送消息完成处理程序
            this.conn.setSendCompHandler(function (byteSize) {
                WssServer && WssServer.incBytesSend(byteSize);
            }.bind(this));

            this.onConnected && this.onConnected();
        }.bind(this));
    },

    /**
     * 连接服务器
     * @param address
     */
    connect: function (address) {
        this.client.connect(address, "default-protocol");
    },
    /**
     * 设置连接函数
     * @param handler
     */
    setOnConnectedHandler: function (handler) {
        this.onConnected = handler;
    },

    /**
     * 连接失败
     * @param handler
     */
    setOnConnectFailedHandler: function (handler) {
        this.onConnectedFailed = handler;
    },

    /**
     * 设置关闭函数
     * @param handler
     */
    setOnCloseHandler: function (handler) {
        this.onConnClosed = handler;
    },

    /**
     * 设置消息处理程序
     * @param handler
     */
    setOnMsgHandelr: function (handler) {
        this.onConnMsg = handler;
    },

    /**
     * 获取连接
     * @returns {*|null}
     */
    getConn: function () {
        return this.conn;
    },

    /**
     * 发送消息
     * @param msg
     */
    sendMsg: function (msg) {
        this.conn.sendMsg(msg);
    },
};

///////////////////////////////////////////////////////////////////////////////
//>> 游戏管理器

function GameManager(sid) {
    this.sid = sid;             // 服务器编号
    this.mgrClient = null;      // 管理连接客户端

    this.middleOk = false;      // 是否连接到中央服务器
    this.subGame = null;        // 游戏逻辑
    this.playInfo = {};         // 玩家信息
    this.roomInfo = {};         // 房间信息
}

GameManager.prototype = {

    /**
     * 初始化
     * @param gamePos
     * @param callback
     */
    init: function (gamePos, callback) {

        // 初始化管理连接
        this.mgrClient = new WssClient();
        this.mgrClient.setOnConnectedHandler(function () {
            this.onMgrConnOpen(gamePos);
            callback && callback(true);
        }.bind(this));
        this.mgrClient.setOnConnectFailedHandler(function () {
            callback && callback(false);
        });
        this.mgrClient.setOnCloseHandler(function () {
            this.onMgrConnClose(gamePos);
        }.bind(this));
        this.mgrClient.setOnMsgHandelr(function (wsMsg) {
            this.onMgrConnMsg(wsMsg);
        }.bind(this));

        // 连接中央服务器
        LOG("Try connect to middle server");
        this.mgrClient.connect(util.format("ws://%s:%d/", addrConfig.MiddleHost, addrConfig.MiddlePort));
    },
    /**
     * 设置中央服链接状态
     * @param ok
     */
    setMiddleOk: function (ok) {
        this.middleOk = ok;
    },
    /**
     * 是否链接中央服
     * @returns {boolean|*}
     */
    isMiddleOk: function () {
        return this.middleOk;
    },
    /**
     * 注册服务器
     * @param gamePos
     */
    onMgrConnOpen: function (gamePos) {
        this.tryRegServ(gamePos);
    },
    /**
     * 重试注册服务器
     * @param gamePos
     */
    tryRegServ: function (gamePos) {
        DEBUG("Try register server" + this.sid);
        let gConfig = addrConfig.GameConfig[gamePos[0]].gameServCfg[gamePos[1]];
        // 注册服务器
        this.mgrClient.sendMsg({
            code: ProtoID.GAME_MIDDLE_REGISTER,
            args: {
                ip: gConfig.host,
                port: gConfig.port,
                gameType: gamePos[0],
                capacity: gConfig.capacity,
                sid: gConfig.sid,
            }
        });
    },

    /**
     * 清除房间信息
     * @param gameType
     */
    clearRooms(gameType){
        let SubGameLogic = this.getSubGame(gameType);
        SubGameLogic.roomCnt = 0;
        SubGameLogic.rooms = {};
    },

    /**
     * 连接关闭
     * @param gamePos
     */
    onMgrConnClose: function (gamePos) {
        LOG("Middle connection closed");
        this.middleOk = false;

        this.mgrClient.setOnConnectedHandler(function () {
            this.onMgrConnOpen(gamePos);
        }.bind(this));
        this.mgrClient.setOnConnectFailedHandler(null);
        let gameType = gamePos[0];
        this.clearRooms(gameType);
        setInterval(function () {
            if (!this.middleOk) {
                // 连接中央服务器
                LOG("Try connect to middle server");
                this.mgrClient.connect(util.format("ws://%s:%d/", addrConfig.MiddleHost, addrConfig.MiddlePort));
            }
        }.bind(this), 5000);
    },
    /**
     * 设置sid
     * @param sid
     */
    setSid: function (sid) {
        DEBUG("服务器id是" + sid);
        this.sid = sid;
    },

    /**
     * 消息处理
     * @param wsMsg
     */
    onMgrConnMsg: function (wsMsg) {
        if (wsMsg.code == ProtoID.SMSG_PING) {
            this.mgrClient.getConn().setLastActTime(Date.getStamp());
            this.mgrClient.sendMsg({
                code: ProtoID.SMSG_PONG,
                result: ProtoState.STATE_OK,
            });
            return;
        }

        let rCode = wsMsg.code;
        let rState = wsMsg.result || ProtoState.STATE_OK;
        let rArgs = wsMsg.args;

        let protoHandler = GameLogic.findProtoHandler(rCode);
        if (!protoHandler) {
            ERROR("游戏服和中央服的通信没有定义该消息" + rCode);
            return;
        }
        DEBUG("收到<Middle>消息" + JSON.stringify(wsMsg));
        protoHandler(this.mgrClient.getConn(), rState, rArgs);
    },

    /**
     * 获取游戏逻辑
     * @param gameType
     * @returns {*|null}
     */
    getSubGame: function (gameType) {
        this.subGame = require(util.format("./games/%d/SubGame.js", gameType));
        return this.subGame;
    },

    /**
     * 更新玩家玩的局数
     * @param players
     */
    updatePlayerCount: function (players) {
        this.mgrClient.sendMsg({
            code: ProtoID.GAME_MIDDLE_UPDATE_PLAYER_COUNTS,
            args: {
                players: players
            }
        });
    },
    /**
     * 发送管理消息
     * @param msg
     */
    sendMgrMsg: function (msg) {
        this.mgrClient.sendMsg(msg);
    },

    /**
     * 关闭游戏服务器
     */
    shutdown: function () {
        let gameType = this.getGameBySid();
        DEBUG("获得的游戏类型是" + gameType);
        this.getSubGame(gameType).shutdown();
        DEBUG("Do unregister server");
        if(this.mgrClient) {
            this.mgrClient.sendMsg({
                code: ProtoID.GAME_MIDDLE_UNREGISTER,
                args: {
                    sid: this.sid,
                }
            });
        }
    },
    /**
     * 通过游戏sid获取游戏类型
     * @returns {*}
     */
    getGameBySid: function () {
        let games = addrConfig.GameConfig;
        for (let gametype in games) {
            for (let sevGroup in games[gametype].gameServCfg) {
                if (games[gametype].gameServCfg[sevGroup].sid == this.sid) {
                    return gametype;
                }
            }
        }
        return null;
    },
    /**
     * 增加玩家信息
     * @param data
     */
    addPlayerAndRoomInfo: function (data) {
        let uid = data.pData.uid;
        let ok = false;
        if(uid) {
            this.playInfo[uid] = data.pData;
            this.playInfo[uid].gameType = data.gameType;
            ok = true;
        }
        return ok;
    },
    /**
     * 减少玩家信息
     * @param uid
     */
    delPlayerInfo: function (uid) {
        delete this.playInfo[uid]
    },
    /**
     * 获取玩家信息
     * @param uid
     * @returns {*}
     */
    getPlayerMiddleInfo: function (uid) {
        return this.playInfo[uid];
    },
    /**
     * 获取玩家游戏类型
     * @param uid
     * @returns {number}
     */
    getPlayerGameType:function (uid) {
        if(this.playInfo[uid] && this.playInfo[uid].gameType){
            return this.playInfo[uid].gameType;
        }else{
            ERROR("gameType Error");
            return 0;
        }
    },
    /**
     * 计算收益
     * @param gameType
     */
    costProfit:function (cost, uData) {
        this.mgrClient.sendMsg({
            code: ProtoID.GAME_MIDDLE_UPDATE_PROFIT,
            args: {
                uData: uData,
                cost: cost
            }
        });
    },
    /**
     * 更新货币
     * @param data
     */
    updateCoin:function (data) {
        this.mgrClient.sendMsg({
            code: ProtoID.GAME_MIDDLE_CLIENT_UPDATE_MONEY,
            args: {
               data : data
            }
        });
        if(data.id == 1){
            this.playInfo[data.uid].status.bean += data.num;
        }else if(data.id == 2){
            this.playInfo[data.uid].status.card += data.num;
        }
    },
    /**
     * 更新幸运值
     * @param uid
     * @param value
     */
    updateLuck:function (uid, value, gameType) {
        if(this.playInfo[uid]) {
            this.mgrClient.sendMsg({
                code: ProtoID.GAME_MIDDLE_UPDATE_LUCK,
                args: {
                    guid : uid,
                    value: value,
                    gameType:gameType
                }
            });
            if (gameType == 1) {
                this.playInfo[uid].luck.mj += value;
            } else if (gameType == 2) {
                this.playInfo[uid].luck.ddz += value;
            } else if (gameType == 4) {
                this.playInfo[uid].luck.psz += value;
            } else if (gameType == 5) {
                this.playInfo[uid].luck.ps += value;
            }else if(gameType == 7){
                this.playInfo[uid].luck.pdk += value;
            }else if(gameType == 8){
                this.playInfo[uid].luck.xzmj += value;
            }
        }
    },

    //保存战绩
    savePlayerReport: function (data) {
        this.mgrClient.sendMsg({
            code: ProtoID.GAME_MIDDLE_SAVE_REPORTS,
            args: {
                reports: data
            }
        });
    },
    /**
     * 移除玩家
     */
    removePlayer:function (uids, roomId) {
        this.sendMgrMsg({
            code: ProtoID.GAME_MIDDLE_REMOVE_PLAYER,
            args: {
                uids: uids,
                roomId:roomId
            },
        })
    },
    /**
     * 清理客户端roomID
     */
    clearRoomId:function(uid, roomId){
        this.sendMgrMsg({
            code: ProtoID.CLEAR_ID,
            args: {
                gUid: uid,
                roomId:roomId
            },
        })
    },
    /**
     * 计算服务费(后面看用不用这个函数)
     */
    calcSerCost:function (matchId) {
        let num = 0;
        let cfg = csConfig.matchConfig[matchId];
        if(cfg) {
            num = Math.ceil(cfg.serverCost * cfg.baseBean);
        }
        return num;
    },

    /**
     * 通知world服已经开始游戏了
     */
    noticeStart:function (rid, value) {
        this.sendMgrMsg({
            code: ProtoID.GAME_MIDDLE_START_GAME,
            args: {
                rid: rid,
                status:value
            },
        })
    },
    /**
     * 通知插播消息
     */
    noticeInsertNotice:function (msg) {
        this.sendMgrMsg({
            code:ProtoID.GAME_MIDDLE_UPDATE_INSERT_NOTICE,
            args:{
                msg:msg
            }
        })
    },
    /**
     * 获取插播字段
     */
    getInsertMsg:function (gameType, subType) {
        let data = {gameTypeMsg:"", subTypeMsg:""};
        if(gameType == 1){
            data.gameTypeMsg = "海南麻将";
            if(subType == 1){
                data.subTypeMsg = "两人模式";
            }else if(subType == 2){
                data.subTypeMsg = "四人模式";
            }
        }else if(gameType == 2){
            data.gameTypeMsg = "斗地主";
            if(subType == 1){
                data.subTypeMsg = "普通模式";
            }else if(subType == 2){
                data.subTypeMsg = "不洗牌模式";
            }
        }else if(gameType == 4){
            data.gameTypeMsg = "拼三张";
            if(subType == 1){
                data.subTypeMsg = "普通模式";
            }else if(subType == 2){
                data.subTypeMsg = "激情模式";
            }
        }else if(gameType == 5){
            data.gameTypeMsg = "拼十";
            if(subType == 1){
                data.subTypeMsg = "看牌抢庄";
            }else if(subType == 2){
                data.subTypeMsg = "自由抢庄";
            }
        }else if(gameType == 7){
            data.gameTypeMsg = "跑得快";
            if(subType == 1){
                data.subTypeMsg = "三人模式";
            }else if(subType == 2){
                data.subTypeMsg = "四人模式";
            }
        }else if(gameType === 8){
            data.gameTypeMsg = "血战麻将";
            if(subType == 1){
                data.subTypeMsg = "二人模式";
            }else if(subType == 2){
                data.subTypeMsg = "四人模式";
            }
        }
        return data
    },
    /**
     * 检测任务
     * @param data
     */
    checkTask:function (data) {
        if(data.uid < 100000){
            return;
        }
        this.sendMgrMsg({
            code:ProtoID.GAME_MIDDLE_CHECK_TASK,
            args:{
                data:data
            }
        })
    },

    /**
     * 更新比赛场数据
     * @param uid
     */
    updateWatchScore(uid, score){
        this.sendMgrMsg({
            code:ProtoID.GAME_MIDDLE_UPDATE_SCORE,
            args:{
                guid:uid,
                score:score
            }
        })
    },
    /**
     * 获取服务费
     * @param matchId
     */
    getServerCost(matchId, baseBean){
        let costBean = 0;
        let cfg = csConfig.matchConfig[matchId];
        if(cfg){
            costBean = Math.ceil(cfg.serverCost * baseBean);
        }else{
            costBean = Math.ceil(Config.FKserverCost * baseBean);
        }

        return costBean;
    },

    /**
     * 初始化任务需要的参数
     */
    initTaskParams(players){
        let data = {};

        data.win = false;           // 赢得比赛(所有游戏有效)
        data.winLoseBean = 0;       // 输赢金豆(所有游戏有效)
        data.boomNum = 0;           // 打出炸弹数量(斗地主、跑得快)
        data.spring = false;        // 打出春天(斗地主)
        data.farmer = false;        // 当地主(斗地主)
        data.kingBoom = false;      // 是否打出王炸(斗地主)

        data.bigShut = 0;           // 大关(跑得快)
        data.smallShut = 0;         // 小关(跑得快)

        data.selfStroke = false;    // 自摸(麻将)
        data.qys_hu = false;        // 清一色胡(麻将)
        data.dui_hu = false;        // 对和(麻将)
        data.qgh_hu = false;        // 抢杠胡(麻将)
        data.ssy_hu = false;        // 十三幺(海南)
        data.pp_hu = false;         // 碰碰胡(麻将)
        data.hu_19 = false;         // 胡19(血战)
        data.hu_JD = false;         // 将对胡
        data.hu_MQ = false;         // 胡门清
        data.hu_ZZ = false;         // 胡中张
        data.hu_GGD = false;        // 胡金钩钓
        data.hu_TH = false;         // 天胡
        data.hu_DH = false;         // 地胡

        for(let playerIndex in players){
            players[playerIndex].taskParams = clone(data);
        }
    },
    /**
     * 强制销毁房间
     * @param roomId
     */
    forceDestroyRoom(roomId){
        this.sendMgrMsg({
            code:ProtoID.GAME_FORCE_RESTORY_ROOMID,
            args:{
                roomId
            }
        })
    },

    clearRoomCutDown(room){
        if(room.cut) {
            clearTimeout(room.cut);
            room.cut = null;
        }
    },

    createRoomCutDown(room){
        if(room.cut){
            this.clearRoomCutDown(room);
        }
        room.cut = setTimeout(function () {
            room.destroyRoomImmd();
            GameMgr.forceDestroyRoom(room.roomId);
        }.bind(room), 3600 * 1000);
    },
    /**
     * 检测踢人
     * @param room
     * @param uid
     * @param target
     */
    checkKick(room, uid, target){
        if(room.mode === "JB"){
            return ProtoState.STATE_KICK_JB_NOT_KICK;
        }
        if(room.playing){
            return ProtoState.STATE_KICK_PLAYING;
        }
        if(uid === target){
            return ProtoState.STATE_KICK_SELF;
        }
        if(uid !== room.creator){
            return ProtoState.STATE_KICK_NO_CREATOR;
        }
        return ProtoState.STATE_OK;
    },
    /**
     * 踢人
     * @param room
     */
    kickPlayer(room, uid, target){
        let ret = this.checkKick(room, uid, target);
        if(ret != ProtoState.STATE_OK){
            let player = room.getPlayerByUid(uid);
            player.sendMsg(ProtoID.CLIENT_GAME_KICK_PLAYER, {result:ret}, ret);
            return;
        }
        room.cancelMatch(target);
        this.noticeMiddlePlayerLevel(target, 2);
    },
    /**
     * 通知中央服某个玩家离开了游戏
     * @param uid
     * @param type
     */
    noticeMiddlePlayerLevel(uid, type){
        this.sendMgrMsg({code:ProtoID.GAME_MIDDLE_PLAYER_KICK, args:{guid:uid, type}});
    },
    /**
     * 通知解散
     * @param room
     */
    noticeJS(room){
        for(let idx in room.players){
            let player = room.players[idx];
            if(player.uid !== room.creator && player.uid > 100000){
                this.noticeMiddlePlayerLevel(player.uid, 1);
            }
        }
    }
};

exports.GameManager = GameManager;
