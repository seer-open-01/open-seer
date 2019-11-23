let util            = require("util");
let Enum            = require("./Enum.js");
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let Player          = require("../../base/player");

//>> 玩家手牌
class HandCards {
    constructor(owner){
        this.owner = owner;
        this.cards = [];
    }
    /**
     * 增加牌
     * @param cards
     */
    addCards(cards) {
        for(let k in cards){
            this.cards.push(cards[k]);
        }
        this.owner.playing = true;
        this.owner.cardState = Enum.CARD_STATE.NOT_TO_SEE;
    }
    /**
     * 减少牌
     * @param cards
     */
    delCards(cards) {
        for(let k in cards){
            let pos = this.cards.indexOf(cards[k]);
            if(pos != -1){
                this.cards.splice(pos,1);
                this.num--;
            }else{
                ERROR("斗地主指定删除牌不存在" + cards[k]);
            }
        }
    }
    /**
     * 是否存在这张牌
     * @param id
     * @returns {boolean}
     */
    contains(id) {
        return this.cards.indexOf(id) >= 0;
    }
    /**
     * 重置牌
     */
    reset() {
        this.cards = [];
    }
    /**
     * 日志信息
     */
    getLogCard() {
        let str = "";
        str += util.format("姓名:%s ",this.owner.name);
        str += util.format("UID:%d ",this.owner.uid);
        str += util.format("手:(%d, %d, %d)", this.cards[0],this.cards[1],this.cards[2]);
        return str;
    }
}
///////////////////////////////////////////////////////////////////////
//>> 玩家信息
class PSZPlayer extends Player {
    constructor(owner, index){
        super(owner, index);
        this.actionTimer = {};                      // 动作计时{action: stamp: duration: users:}
        this.winNum = 0;                            // 赢的次数
        this.handCards = new HandCards(this);       // 牌局信息
        this.cardState = Enum.CARD_STATE.NONE;      // 玩家状态信息
        this.reduceBean = 0;                        // 当前减少了多少金豆
        this.addBean = 0;                           // 当前增加了多少金豆
        this.giveUpExit = false;                    // 棋牌抛弃该局
        this.startReset();
    }

    startReset () {
        this.reduceBean = 0;                    // 当前减少了多少金豆
        this.addBean = 0;                       // 当前增加了多少金豆
        this.reqExit = false;                   // 客户端主动退出
        this.scheJob = null;                    // 限时任务
        this.handCards.reset();                 // 手牌信息
        this.seeList = [this.index];            // 能看哪些玩家的牌
        this.autoAddStake = false;              // 自动跟注
        this.chips = [];                        // 玩家出牌的筹码组
        this.anteState = Enum.ANTE_STATE.NONE;  // 玩家上一步操作
        this.cardState = Enum.CARD_STATE.NONE;  // 牌状态
        this.giveUpExit = false;                // 棋牌抛弃该局
        this.oldUid = this.uid;                 // 记录中途退出的uid
    }
    /**
     * 结束重置消息
     */
    endReset() {
        this.playing = false;
        this.ready = false;
        this.reduceBean = 0;                    // 当前减少了多少金豆
        this.addBean = 0;                       // 当前增加了多少金豆
        this.handCards.reset();                 // 手牌信息
        this.cardState = Enum.CARD_STATE.NONE;
        this.anteState = Enum.ANTE_STATE.NONE;  // 玩家上一步操作
    }
    /**
     * 初始化
     * @param data
     * @param wsConn
     */
    init(data, wsConn) {
        super.init(data, wsConn);
        this.luck = data.luck.psz;
    }

    /**
     * 获取数据
     * @returns {{uid: *, name, headIcon: string, bean: (*|number), ip: null, ready: *, score: *, roundScore: *, index: *}}
     */
    getInfo() {
        let data = super.getInfo();
        // 游戏内信息
        data.chips  = this.chips;
        data.ante   = this.reduceBean;
        data.handCards = this.handCards.cards;
        data.autoCall = this.autoAddStake;
        data.cardState  = this.cardState;
        data.cardPattern = this.owner.getType(this.handCards.cards);
        data.anteState = this.anteState;
        return data;
    }
    /**
     * 获取结算信息
     */
    getSettementInfo() {
        let data = {};
        data.playerIndex = this.index;
        data.name = this.name;
        data.headPic = this.headPic;
        data.handCards = this.handCards.cards;
        data.cardsPattern = this.owner.getType(this.handCards.cards);
        data.addBean = this.addBean - this.reduceBean;
        data.lookOtherCards  = this.seeList;
        data.actionTimer = this.actionTimer;
        data.uid = this.uid;
        return data;
    }
    /**
     * 生成战报
     * @returns {{uid: *, reduceBean: *, addBean: *, name: *, headPic: *, index: *, seeList: *}}
     */
    getPlayerReportInfo () {
        let data = {};
        data.handCards = this.handCards.cards;
        data.roundBean = this.addBean - this.reduceBean;
        data.name = this.name;
        data.uid = this.oldUid;
        data.type = this.owner.getType(this.handCards.cards);
        return data
    }
    /**
     * 是否有人
     * @param uid
     * @returns {boolean}
     */
    isPlayer(uid) {
        return this.uid == uid;
    }
    /**
     * 设置当前回合的押注
     * @param value
     */
    addReduceBet (bet) {
        this.reduceBean += bet * this.owner.baseBean;
    }
    /**
     * 获取玩家的临时Bean数量
     */
    getTempBean() {
        return this.bean - this.reduceBean + this.addBean;
    }
    /**
     * 添加查牌列表
     * @param playerIndex
     */
    addSeeList(playerIndex) {
        playerIndex = +playerIndex;
        if(this.seeList.indexOf(playerIndex) == -1) {
            this.seeList.push(+playerIndex);
        }
        if(this.seeList.indexOf(this.index) == -1){
            this.seeList.push(+this.index);
        }
    }
};

exports.Player = PSZPlayer;
