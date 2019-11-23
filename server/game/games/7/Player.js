let util            = require("util");
let Enum            = require("./Enum.js");
let CSProto         = require("../../../net/CSProto.js");
let CommFuc         = require("../../../util/CommonFuc.js");
let Player          = require("../../base/player");
///////////////////////////////////////////////////////////////////////
//>> 玩家信息

class HandCards  {
    constructor(owner){
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
    addCards (cards) {
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
    contains (card) {
        return this.cards.indexOf(card) >= 0;
    }
    /**
     * 重置牌
     */
    reset () {
        this.num = 0;
        this.cards = [];
        this.played = [];
        this.originalCards = [];
        this.outCards = [];
    }
    /**
     * 日志信息
     */
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

    isEmpty() {
        return this.cards.length <= 0 ? true : false;
    }

}

class PDKPlayer extends Player{
    constructor(owner, index){
        super(owner, index);
        this.handCards = new HandCards(this);
    }

    init(data, wsConn){
        super.init(data, wsConn);
        this.uid = data.uid;
        this.luck = data.luck.pdk;
        this.zdCount = 0;
        this.reset();
    }

    /**
     * 重置数据
     */
    reset(){
        this.clearAutoPlayer();
        this.ready = false;             // 玩家是否已经准备
        this.cueTbl = [];
        this.curCueIdx = 0;
        this.playing = false;           // 是否在玩
        this.roundBean = 0;             // 本局输赢多少金豆
        this.autoNum = 0;               // 自动出牌次数
        this.autoFun = null;            // 函数
        this.autoParam = [];            // 托管函数参数
        this.isT = false;               // 是否托管
        this.destroyState = Enum.DestroyState.NONE; // 解散房间选择的状态
        this.zdCount = 0;
        this.zdRate = 0;
        this.bigShut = false;
        this.smallShut = false;
        this.only = false;
        this.actionTimer = {};
        this.handCards.reset();
    }

    /**
     * 结束重置
     */
    endReset() {
        this.playing = false;
        this.clearAutoPlayer();
        this.isT = false;               // 托管
    }

    // 清除定时任务
    clearAutoPlayer () {
        clearTimeout(this.scheJob);
        this.scheJob = null;
        this.autoFun = null;
        this.autoParam = [];
    }
    // 设置托管参数
    setAutoFun(handler, params) {
        this.autoFun = handler;
        this.autoParam = params;
    }

    destroy(){
        super.destroy();
    }

    getInfo() {
        let data = super.getInfo();
        CommFuc.powerAndHsOrder(this.handCards.cards);
        data.handCards = this.handCards.cards;
        CommFuc.powerAndHsOrder(this.handCards.outCards);
        data.outCards = this.handCards.outCards;
        data.handCardsNum = this.handCards.cards.length;
        data.playStatus = 5;
        data.isCan = this.cueTbl.length > 0 ? true : false;
        data.isT = this.isT;
        data.zdCount = this.zdCount;
        return data;
    }

    getForceState() {
        if(this.owner.preShape == null){
            if(this.owner.nextPlayer == this.index){
                return true;
            }
        }
        return false;
    }
    /**
     * 获取结算信息
     * @returns {{}}
     */
    getSettlementInfo(){

    }


    getPlayerReportInfo(){
        let data = {};
        data.handCards = this.handCards.cards;
        data.roundBean = this.roundBean;
        data.name = this.name;
        data.uid = this.uid;
        return data
    }

    /**
     * 计算信息
     * @param fina
     */
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
            data.zdCount = this.zdCount;
            data.zdRate = this.zdRate;                          // todo炸弹倍数
            data.words = this.getWords();                       // 获取描述
        }
        return data;
    }

    /**
     * 获取描述
     */
    getWords(){
        let msg = "";
        if(this.only){
            msg = "单张";
        }else if(this.bigShut){
            msg = "大关";
        }else if(this.smallShut){
            msg = "小关";
        }
        return msg;
    }

}


exports.Player = PDKPlayer;
