let util            = require("util");
let ProtoID         = require("../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../net/CSProto.js").ProtoState;
let ActionType      = require("../../net/CSProto.js").ActionType;
let CommFuc         = require("../../util/CommonFuc.js");
let AI              = require("./ai").AI;
let eventType       = require("../../net/CSProto.js").eveIdType;
let Enum            = require("./Enum.js");

class Player{
    constructor(owner, index){
        this.owner = owner;                         // 房间对象
        this.index = index;                         // 玩家位置
        this.uid = 0;                               // 玩家ID
        this.name = "";                             // 名称
        this.sex = "";                              // 性别
        this.headPic = "";                          // 头像地址
        this.online = false;                        // 是否在线
        this.ip = "";                               // ip地址
        this.bean = 0;                              // 金豆数量
        this.card = 0;                              // 卡片数量
        this.diamond = 0;                            //钻石数量
        this.gps = null;                            // gps数据
        this.wsConn = null;                         // WebSocket连接对象
        this.queuedPackets = [];                    // 数据包
        this.score = 0;                             // 积分
        this.readyExit = false;                     // 游戏未开始钱掉线的标记
        this.isInit = false;                        // 是否初始化

        this.ai = null;                             //ai
        this.ready = false;                         // 玩家是否
        this.playing = false;                       // 是否在游戏
        this.maxScore = 0;                          // 游戏最高分

        this.serverCostTip = {};
    }

    /**
     * 初始化
     * @param data
     * @param wsConn
     */
    init (data, wsConn) {
        this.uid = data.uid;
        this.name = data.info.name || "";
        this.headPic = data.info.headPic|| "";
        this.sex = data.info.sex || 0;
        this.bean = data.status.bean || 0;
        this.card = data.status.card || 0;
        this.diamond = data.status.diamond || 0;
        this.score = data.status.score || 0;
        this.diamond = data.status.diamond || 0;
        this.serverCostTip = data.serverCostTip || {};
        this.actionTimer = {};
        this.wsConn = wsConn;
        this.online = true;
        this.matchIng = data.matchIng;
        this.ai = new AI(this, {});
        if(wsConn){
            this.ip = wsConn.getAddrString();
            this.wsConn.pushCloseHandler(function () {
                this.onConnClosed();
            }.bind(this));
        }
        this.isInit = true;
    }


    /**
     * 销毁
     */
    destroy() {
        this.online = false;
        if(this.isInit) {
            setTimeout(function () {
                if(this.wsConn && !this.wsConn.isClose) {
                    this.wsConn.close();
                }
            }.bind(this), 3000);
        }
    }

    /**
     * 关闭连接
     */
    onConnClosed() {
        if (this.online) {
            this.online = false;
            this.owner.onPlayerOffline(this);
        }
    }

    /**
     * 设置新连接
     * @param wsConn
     */
    setNewConn(wsConn) {
        let oldWsConn = this.wsConn;
        if(oldWsConn)oldWsConn.emptyCloseHander();
        this.wsConn = wsConn;
        this.online = true;
        if(wsConn) {
            this.ip = wsConn.getAddrString();
            this.wsConn.emptyCloseHander();
            this.wsConn.pushCloseHandler(function () {
                this.onConnClosed();
            }.bind(this));
        }
    }

    /**
     * 获取数据
     * @returns {{uid: *, name, headIcon: string, bean: (*|number), ip: null, ready: *, score: *, roundScore: *, index: *}}
     */
    getInfo() {
        // 基础信息
        let data = {};
        data.uid    = this.uid;
        data.name   = this.name;
        data.sex    = this.sex;
        data.headPic= this.headPic;
        data.online = this.online;
        data.ready  = this.ready;
        data.ip     = this.ip;
        data.index  = this.index;
        data.score  = this.score;
        data.bean   = this.bean;
        data.card   = this.card;
        data.diamond = this.diamond;
        data.playing= this.playing;
        data.gps    = this.gps;
        data.actionTimer = this.actionTimer;
        data.matchIng = this.matchIng;
        data.destroyState = this.destroyState;

        return data;
    }
    /**
     * 是否有人
     * @param uid
     * @returns {boolean}
     */
    isPlayer(uid) {
        return this.uid === +uid;
    }

    /**
     * 获取结算信息
     */
    getSettlementInfo() {
        let data = {};
        data.playerIndex = this.index;
        data.name = this.name;
        data.headPic = this.headPic;
        return data;
    }

    /**
     * 玩家的牌局信息
     */
    getRoundIdInfo() {
        let data = {};
        data.bean   = this.bean;
        data.ip = this.ip;
        data.index = this.index;
        data.uid = this.uid;
        data.name = this.name;
        return data;
    }

    /**
     * 是否是机器人
     */
    isRobot() {
        return this.uid < 100000 && this.uid !== 0 && this.uid > 0;
    }

    /**
     * 发送消息
     * @param code
     * @param msg
     */
    sendMsg(code,msg) {
        msg = msg || {};
        let tempResult = msg.result || ProtoID.STATE_OK;
        let tempMsg = msg || {};
        if(msg.log){
            delete msg.log
        }
        if(this.isRobot()){
            this.onAutoPlay(code, msg);
        }
        tempMsg.result = tempResult;
        if(this.wsConn) {
            if (this.online) {
                this.wsConn.sendMsg({
                    code: code,
                    args: tempMsg
                });
            } else {
                this.queuedPackets.push({
                    code: code,
                    args: tempMsg
                });
            }
        }
    }

    onAutoPlay(code, msg){
        if(this.owner.gameType === 5) {
            this.ai.doAction(code, msg);
        }
    }

    updateStatus(data){

        this.bean = data.status.bean ? data.status.bean : 0;
        this.card = data.status.card ? data.status.card : 0;
        this.score = data.status.score ? data.status.score : 0;
        this.diamond = data.status.diamond ? data.status.diamond : 0;
    }

    /**
     * 更新货币
     */
    updateCoin(id, num, eventId = eventType.MATCH) {
        if(num === 0){
            return;
        }
        if(id === 1){
            this.bean += num;
        }else if(id === 2){
            this.card += num;
        }
        this.bean = Math.max(this.bean, 0);
        this.card = Math.max(this.card, 0);
        let data = {roomId:this.owner.roomId, mode:this.owner.mode, uid:this.uid, id, num, roundId: this.owner.roundId, curRound: this.owner.curRound, matchId:this.owner.matchId || this.owner.gameType, eventId:eventId};
        GameMgr.updateCoin(data);
    }

    setActionTimer(action, duration){
        this.actionTimer.duration = duration;
        this.actionTimer.action = action;
        this.actionTimer.stamp = new Date().getTime();
    }

    /**
     * 设置状态
     * @param state
     */
    setDestroyState(state){
        this.destroyState = state;
    }

    /**
     * 更新最高分
     * @param score
     */
    updateMaxScore(score){
        if(score > this.maxScore){
            this.maxScore = score;
        }
    }
    /**
     * 更新幸运值
     * @param value
     */
    updateLuck(value){
        this.luck += value;
        GameMgr.updateLuck(this.uid, value, this.owner.gameType);
    }

    updateWatchScore(){
        if(this.owner.mode === "FK"){
            return;
        }
        let score = Math.max(Math.floor(this.owner.baseBean * 0.5 / 25), 1);
        GameMgr.updateWatchScore(this.uid, score);
    }

    /**
     * 清除定时任务
     */
    clearAutoPlayer() {
        clearTimeout(this.scheJob);
        this.scheJob = null;
        this.autoFun = null;
        this.autoParam = [];
    }
}

module.exports = Player;
