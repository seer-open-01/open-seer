let util = require("util");
let Enum = require("./Enum.js");
let ProtoID = require("../../../net/CSProto.js").ProtoID;
let CommFuc     = require("../../../util/CommonFuc.js");
let Player          = require("../../base/player");
///////////////////////////////////////////////////////////////////////////////
//>> 玩家手牌

class HandCards {
    constructor(owner) {
        this.owner = owner;
        this.num = 0;
        this.cards = [];                                       // <黑、红、梅、方>
        this.played = [];                                      // 走掉的牌
        this.originalCards = [];                               // 原始的牌
        this.outCards = [];                                    // 当前走的牌
    }
    /**
     * 增加牌
     * @param cards
     */
    addCards(cards) {
        for(let k in cards){
            this.cards.push(cards[k]);
            this.originalCards.push(cards[k]);
            this.num++;
        }
        this.owner.playing = true;
    }
    /**
     * 减少牌
     * @param cards
     */
    delCards (cards) {
        this.outCards = [];
        for(let k in cards){
            let card = cards[k];
            let pos = this.cards.indexOf(card);
            if(pos != -1){
                this.played.push(card);
                this.outCards.push(card);
                this.cards.splice(pos,1);
                this.num--;
                this.owner.owner.roomCardsed.push(card);
            }else{
                ERROR("delete card not existence" + card + "preShape: " + JSON.stringify(this.owner.owner.preShape) + "curCards: " + this.cards);
            }
        }
    }
    /**
     * 是否存在某张牌
     * @param id
     * @returns {boolean}
     */
    contains(card) {
        return this.cards.indexOf(card) >= 0;
    }
    /**
     * 重置牌
     */
    reset() {
        this.num = 0;
        this.cards = [];
        this.played = [];
        this.originalCards = [];
        this.outCards = [];
    }
    /**
     * 判断是否为空
     * @returns {boolean}
     */
    isEmpty() {
        return this.cards.length <= 0 ? true : false;
    }
    /**
     * 报警
     * @returns {boolean}
     */
    isPolice() {
        return this.num <= 2 ? true : false;
    }
    /**
     * 日志信息
     */
    getLogCard() {
        let str = "";
        str += util.format("姓名:%s ",this.owner.name);
        str += util.format("UID:%d ",this.owner.uid);
        str += "手(";
        let len = this.originalCards.length;
        for(let idx in this.originalCards){
            let card = this.originalCards[idx];
            str += card;
            if(idx != len - 1){
                str += ", ";
            }
        }
        str += ")";
        return str;
    }
};

///////////////////////////////////////////////////////////////////////////////
class DDZPlayer extends Player {
    constructor(owner, index) {
        super(owner,index);
        this.actionTimer = {};                      // 动作计时{action: stamp: duration: users:}
        this.handCards = new HandCards(this);       // 手牌
        this.isT = false;                           // 托管
        this.zdCount = 0;                           // 炸弹次数
        this.winCount = 0;                          // 胜利次数
        this.failCount = 0;                         // 失败次数
        this.startReset();
    }
    // 新一轮游戏重置数据
    startReset() {
        this.handCards.reset();
        this.queuedPackets = [];        // 数据包
        this.ready = false;             // 玩家是否已经准备
        this.cueTbl = [];               // 提示数组
        this.curCueIdx = 0;             // 当前提示数组下标
        this.scheJob = null;            // 自动任务
        this.firstGrab = 0;             // 第一次抢
        this.secondGrab = 0;            // 第二次抢
        this.callRob = Enum.callRob.CALL;// 叫地主，抢地主
        this.doCard = Enum.doCard.NONE; // 出牌状态
        this.playing = false;           // 是否在玩
        this.roundBean = 0;             // 本局输赢多少金豆
        this.autoNum = 0;               // 自动出牌的次数
        this.autoFun = null;            // 函数
        this.autoParam = [];            // 托管函数参数
        this.doubleFlag = -1;           // -1没有选择 0没有加倍 1加倍
        this.destroyState = Enum.DestroyState.NONE; // 解散房间选择的状态
    }
    /**
     * 结束重置
     */
    endReset () {
        this.playing = false;
        this.clearAutoPlayer();
        this.ready = false;
        this.isT = false;               // 托管
    }

    updateMaxScore(score){
        if(score > this.maxScore){
            this.maxScore = score;
        }
    }
    /**
     * 初始化
     * @param data
     * @param wsConn
     */
    init(data, wsConn) {
        super.init(data,wsConn);
        if(this.isRobot()){
            this.luck = Math.max(this.owner.robotLv * 50, 100);
        }else{
            this.luck = data.luck.ddz;
        }
    }
    /**
     * 设置抢分
     * @param ok
     */
    setGrab(ok) {
        if(this.firstGrab == 0){
            this.firstGrab = ok ? 1 : 2;
        }else{
            this.secondGrab = ok ? 1 : 2;
        }
    }


    /**
     * 获取玩家信息
     * @returns {{}}
     */
    getInfo () {
        // 基础信息
        let data = super.getInfo();
        CommFuc.powerAndHsOrder(this.handCards.cards);
        data.handCards = this.handCards.cards;
        CommFuc.powerAndHsOrder(this.handCards.outCards);
        data.outCards = this.handCards.outCards;
        data.handCardsNum = this.handCards.cards.length;
        data.playStatus = this.getRobStatus();
        data.isCan = this.cueTbl.length > 0;
        data.isForce = this.getForceState();
        data.isT = this.isT;
        data.doubleFlag = this.doubleFlag;
        return data;
    }
    /**
     * 获取状态
     */
    getRobStatus() {
        if(this.owner.state == Enum.GameState.QIANG) {
            if (this.firstGrab == 0) {    // 没有操作
                return -1;
            }
            if (this.firstGrab == 1) {
                if (this.secondGrab == 1) {
                    return 3;
                } else if (this.secondGrab == 0) {
                    if (this.callRob == Enum.callRob.CALL) {
                        return 1;
                    } else {
                        return 3;
                    }
                } else if (this.secondGrab == 2) {
                    return 4;
                }
            }
            if (this.firstGrab == 2) {
                if (this.secondGrab == 0) {
                    if (this.callRob == Enum.callRob.CALL) {
                        return 2;
                    } else {
                        return 4;
                    }
                } else if (this.secondGrab == 1) {
                    return 3;
                }
            }
        }else if(this.owner.state == Enum.GameState.PLAY){
            if(this.doCard == Enum.doCard.PASS && this.handCards.outCards.length == 0){
                return 5;
            }
        }
        return 0;
    }
    /**
     * 获取强制状态
     */
    getForceState () {
        if(this.owner.preShape == null){
            if(this.owner.nextPlayer == this.index){
                return true;
            }
        }
        return false;
    }

    // 获取结算信息
    getSettementInfo(fina) {
        let data = {};
        data.uid = this.uid;
        data.name = this.name;
        data.headPic = this.headPic;
        data.index= this.index;
        if(fina){
            data.score = this.score;                            // 总积分
            data.zdCount = this.zdCount;                        // 炸弹次数
            data.winCount = this.winCount;                      // 胜利次数
            data.failCount  = this.failCount;                   // 失败次数
            data.maxScore = this.maxScore;                      // 单局最高
        }else{
            data.handCards = this.handCards.originalCards;
            data.outCards = this.handCards.played;
            data.roundBean = this.roundBean;
        }
        return data;
    }
    /**
     * 玩家战绩
     * @returns {{}}
     */
    getPlayerReportInfo(){
        let data = {};
        data.handCards = this.handCards.cards;
        data.roundBean = this.roundBean;
        data.name = this.name;
        data.uid = this.uid;
        return data
    }
    /**
     * 设置托管参数
     * @param handler
     * @param params
     */
    setAutoFun(handler, params) {
        this.autoFun = handler;
        this.autoParam = params;
    }
    /**
     * 设置加倍值
     * @param double
     */
    setDouble(double) {
        this.doubleFlag = double;
    }
};
exports.Player = DDZPlayer;
