let util            = require("util");
let Enum            = require("./Enum.js");
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../../net/CSProto.js").ProtoState;
let ActionType      = require("../../../net/CSProto.js").ActionType;
let CommFuc         = require("../../../util/CommonFuc.js");
let Player          = require("../../base/player");
let AI              = require("./ai").AI;
///////////////////////////////////////////////////////////////////////
//>> 玩家信息

class PsPlayer extends Player{
    constructor(owner, index){
        super(owner, index);

        this.initCards = [];                        //初始牌
        this.rob = -1;                               //抢庄状态 -1未抢 0不抢 1234抢庄倍数
        this.bet = 0;                               //下注状态 0未下注 123下注倍数
        this.play = false;                          //亮牌状态
        this.cardInfo = {};                           //牌型
        this.maxRob = 0;                            //最大抢庄倍数
        this.maxBet = 0;                           //最大下注倍数
        this.roundWin = 0;
        this.roundLose = 0;
        this.roundBean = 0;                         //本局豆子
        this.status = Enum.PlayerStat.NONE;             //玩家状态
        this.type = 0;
        this.actionTimer = {};
        this.timer = 0;
    }

    init(data, wsConn){
        super.init(data, wsConn);
        this.uid = data.uid;
        this.luck = data.luck.ps;
        this.ai = new AI(this, {})
    }

    /**
     * 重置数据
     */
    reset(){
        this.initCards = [];                        //初始牌
        this.rob = -1;                               //抢庄状态 -1未抢 0不抢 1234抢庄倍数
        this.bet = 0;                               //下注状态 0未下注 123下注倍数
        this.play = false;                          //亮牌状态
        this.cardInfo = {};                           //牌型
        this.maxRob = 0;                            //最大抢庄倍数
        this.maxBet = 0;                           //最大下注倍数
        this.roundWin = 0;
        this.roundLose = 0;
        this.roundBean = 0;                         //本局豆子

        this.ready = false;
        this.playing = false;
        this.status = Enum.PlayerStat.NONE;             //玩家状态
        this.timer = 0;
    }

    destroy(){
        super.destroy();
        clearTimeout(this.timer);
    }

    /**
     * 获取数据
     * @returns {{uid: *, name, headIcon: string, bean: (*|number), ip: null, ready: *, score: *, roundScore: *, index: *}}
     */
    getInfo() {
        // 基础信息
        let data = super.getInfo();

        // 游戏内信息
        data.handCards = this.handCards;
        data.rob = this.rob;
        data.bet = this.bet * this.owner.baseBean;
        data.play = this.play;
        data.maxBet = this.maxBet;
        data.maxRob = this.maxRob;
        data.type = this.cardInfo.pattern;
        return data;
    }

    /**
     * 获取结算信息
     * @returns {{}}
     */
    getSettlementInfo(){
        // let data = super.getSettlementInfo();
        //data.bean = this.bean;
        let data = {};
        data.roundBean = this.roundBean;
        data.playerIndex = this.index;
        data.actionTimer = this.actionTimer;
        return data
    }

    //设置倒计时
    setActionTimer(action, duration){
        this.actionTimer.duration = duration;
        this.actionTimer.action = action;
        this.actionTimer.stamp = new Date().getTime();
    }


    getPlayerReportInfo(){
        let data = {};
        data.roundBean = this.roundBean;
        data.handCards = this.handCards;
        data.name = this.name;
        data.uid = this.uid;
        data.type = this.cardInfo.pattern;
        return data
    }

}


exports.Player = PsPlayer;