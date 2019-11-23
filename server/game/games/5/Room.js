let Enum            = require("./Enum.js");
let Func            = require("./Func");
let Player          = require("./Player.js").Player;
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let ActionType      = require("../../../net/CSProto.js").ActionType;
let CommFuc         = require("../../../util/CommonFuc.js");
let Room = require("../../base/room");
let eventType       = require("../../../net/CSProto.js").eveIdType;
///////////////////////////////////////////////////////////////////////////////
//>>房间
class ActionTimer{
    constructor(){
        this.action = ActionType.NONE;      //动作ID
        this.timer = null;       //计时器
        this.users = {};         //有效玩家
        this.handler = null;    //出来函数
        this.stamp = 0;         //开始时间
        this.duration = 0;      //持续时间
    }

    start(action, duration){

    }


}

class PsRoom extends Room{
    constructor(data){
        super(data);
        this.dealer = 0;                        // 当前庄家
        this.dealered = [];                     // 每一局的庄家idx
        this.roomBet = 1;                       // 房间倍数
        this.gameType = 5;                      // 游戏类型
        this.dealerRob = 0;                     // 庄家抢庄倍数
        this.carryBean = 0;                     // 携带豆子
        this.status = 0;                        // 房间状态
        this.actionTimer = {};
    }

    /**
     * 房间初始化
     * @param cArgs
     * @returns {boolean}
     */
    init(cArgs) {
        super.init(cArgs);
        this.state = Enum.GameState.READY;
        this.playNum = this.getMaxPlayerNum();
        for (let idx = 1; idx <= this.playNum; ++idx) {
            this.players[idx] = new Player(this, idx);
        }
        this.dealer = 1;
        this.initActionTimer();
        return true;
    }

    reset(){

        this.dealerRob = 0;
        this.playing = false;
        this.status = 0;                        //房间状态

    }

    /**
     * 获取房间信息
     *
     */
    getRoomInfo() {
        let data = super.getRoomInfo();
        data.roundStatus = this.status;
        data.actionTimer = this.getActionTimerInfo();
        return data
    }

    /**
     *  初始计时器
     */
    initActionTimer(){
        if(!this.actionTimer){
            this.actionTimer = {}
        }
        this.actionTimer.duration = 0;
        this.actionTimer.action = 0;
        this.actionTimer.stamp = 0;
        this.actionTimer.timer = 0;
        this.actionTimer.users = {};
    }

    getActionTimerInfo(){
        let data = {
            duration : this.actionTimer.duration,
            action: this.actionTimer.action,
            stamp: this.actionTimer.stamp,
            users: []
        };

        let users = this.actionTimer.users;
        for (let index in users){
            data.users.push(+index)
        }

        return data;
    }

    /**
     * 开始计时器
     * @param action
     * @param users
     */
    startActionTimer(action, users){
        this.finishActionTimer();
        let stamp = new Date().getTime();
        let duration = this.getActionConfig(action);
        this.actionTimer.duration = duration;
        this.actionTimer.action = action;
        this.actionTimer.stamp = stamp;
        this.actionTimer.users = users;
        this.actionTimer.timer = setTimeout(()=>{
            this.doActionHandler(action, this.actionTimer.users);
            DEBUG("action timeout " + action)
        }, duration)
    }

    /**
     * 结束房间计时器
     */
    finishActionTimer(){
        clearTimeout(this.actionTimer.timer);
        this.actionTimer.duration = 0;
        this.actionTimer.action = 0;
        this.actionTimer.stamp = 0;
        this.actionTimer.timer = 0;
        this.actionTimer.users = {};

    }

    /**
     * 创建动作玩家对象
     * @param exIndex
     * @returns {{}}
     */
    makeActionUsers(exIndex){
        let users = {};
        this.enumPlayingPlayers((eIndex, ePlayer)=>{
            if(exIndex.indexOf(eIndex) === -1){
                users[eIndex] = 1;
            }
        });
        return users
    }

    /**
     * 玩家完成动作
     * @param index
     */
    playerFinishAction(index){
        if(this.actionTimer.users[index]){
            delete this.actionTimer.users[index]
        }
    }

    getActionConfig(action){
        switch (action) {
            case ActionType.READY:
                return Enum.ActionTime.READY;
            case ActionType.PS_ROB:
                return Enum.ActionTime.ROB;
            case ActionType.PS_BET:
                return Enum.ActionTime.BET;
            case ActionType.PS_PLAY:
                return Enum.ActionTime.PLAY;
            default:
                return 40000;
        }
    }

    doActionHandler(action, users){
        for (let index in users){
            let player = this.getPlayerByIndex(+index);
            if(player){
                switch (action) {
                    case ActionType.READY :
                        this.quitRoom(player.uid);
                        break;
                    case ActionType.PS_ROB:
                        this.onPlayerRob(player.index, 0);
                        break;
                    case ActionType.PS_BET :
                        this.onPlayerBet(player.index, 1);
                        break;
                    case ActionType.PS_PLAY:
                        this.onPlayerPlay(player.index);
                        break;
                    default:
                        DEBUG("not find action " + action);
                }
            }
        }
    }

    onPlayerEnter(uid){
        let player = this.getPlayerByUid(uid);
        player.setActionTimer(ActionType.READY,Enum.ActionTime.READY[this.mode]);
        if(this.playing === false){
            player.timer = setTimeout(()=>{
                if(player.ready){
                    return;
                }
                this.quitRoom(uid)
            }, Enum.ActionTime.READY[this.mode])
        }

    }

    onPlayerChangeRoom(player){
        if(this.playing){
            if(player.playing){
                return false
            }
        }
        return true
    }

    onPlayerQuit(player){
        this.players[player.index] = new Player(this, player.index);
        if (this.isCanStart()) {
            DEBUG("开始游戏");
            this.playing = true;
            this.onRoomStartNewRound();
        }
    }

    onRoomPlayerReady(player){
        clearTimeout(player.timer)
    }

    /**
     * 开始新一轮
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        this.enumRealPlayers((eIndex, ePlayer)=>{
            // let consume = this.serverCost;
            let consume = -1;
            if(!ePlayer.serverCostTip[this.matchId] && !ePlayer.isRobot()){
                consume = this.serverCost;
                ePlayer.serverCostTip[this.matchId] = 1;
                GameMgr.playInfo[ePlayer.uid].serverCostTip[this.matchId] = 1;
            }
            ePlayer.sendMsg(ProtoID.GAME_CLIENT_START_NEW_ROUND_PS, {roundId: this.roundId, consume: consume})
        });
        this.gameOver = true;
        this.start();
    }


    /**
     * 开始游戏
     */
    start() {

        this.initPlayerHandCards();
        this.calcCardsInfo();

        //根据模式发牌
        if(this.subType === Enum.SubType.KPQZ){
            this.broadcastMsg(ProtoID.GAME_CLIENT_INIT_CARD_PS,{num: 4});
            this.enumPlayingPlayers((eIndex, ePlayer)=>{
                if(ePlayer.playing){

                    let cards = ePlayer.initCards.slice(0, 4);
                    ePlayer.handCards = cards;
                    ePlayer.handCards.sort((a, b) => {
                        return Func.cardNumSort(a, b)
                    });
                    DEBUG(ePlayer.handCards);
                    ePlayer.sendMsg(ProtoID.GAME_CLIENT_PLAYER_CARD_PS, {cards: cards})
                }
            })
        }else if(this.subType === Enum.SubType.ZYQZ){
            this.broadcastMsg(ProtoID.GAME_CLIENT_INIT_CARD_PS,{num: 5});
            this.enumPlayingPlayers((eIndex, ePlayer)=>{
                if(ePlayer.playing){
                    let cards = [];
                    cards.push(100);
                    cards.push(100);
                    cards.push(100);
                    cards.push(100);
                    cards.push(100);

                    ePlayer.handCards = cards;
                    // ePlayer.handCards.sort((a, b) => {
                    //     return Func.cardNumSort(a, b)
                    // });
                    // ePlayer.sendMsg(ProtoID.GAME_CLIENT_PLAYER_CARD_PS, {cards: cards})
                }
            })
        }
        this.status = Enum.GameState.READY;
        //开始抢庄
        this.doStartRob()
    }

    /**
     * 初始手牌
     */
    initPlayerHandCards() {
        let playerCards = this.genOnce();
        // playerCards = this.calcLuck(playerCards);
        // 测试发牌
        // let pais = [
        //     [101, 102, 103, 104, 105],         // 同花顺
        //     [201, 101, 302, 302, 401],         // 5小牛
        //     [101, 201, 301, 401, 410],         // 炸弹牛
        //     [101, 102, 203, 104, 205],         // 顺子牛
        //     [112, 212, 312, 101, 201],         // 葫芦牛
        //     [111, 105, 106, 108, 103],         // 同花牛
        //     [111, 211, 313, 412, 312]          // 5花牛
        // ];
        // for(let idx in playerCards){
        //     // let r = Math.floor(Math.random() * pais.length);
        //     playerCards[idx] = pais[+idx - 1];
        // }
        // ERROR(`playerCards-----${JSON.stringify(playerCards)}`);
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            // if(ePlayer.initCards.length > 0){
            //     return
            // }
            ePlayer.initCards = playerCards[eIndex];
        })
    }

    /**
     * 生成一次牌
     * @returns {Array}
     */
    genOnce() {
        let originCards = [];
        let cards = [];

        if(this.carryBean){
            this.carryBean = 0
        }

        for (let type = 1; type <= 4; type++) {
            for (let num = 1; num <= 13; num++) {
                originCards.push(type * 100 + num);
            }
        }

        while (originCards.length > 0) {
            let rIdx = Math.floor(Math.random() * originCards.length);
            cards.push(originCards[rIdx]);
            originCards.splice(rIdx, 1);
        }
        let playerCards = {};
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            playerCards[eIndex] = cards.slice(eIndex * 5 - 5, eIndex * 5);
        });
        return playerCards;
    }
    // 计算幸运值
    calcLuck(playerCards){
        let newPlayerCards = clone(playerCards);
        let needCards = [];
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            let cards = playerCards[eIndex];
            let cardInfo = null;
            if (this.opts.TEXAS) {
                cardInfo = Func.calcCow(Func.cardsArrToObj(cards), {TEXAS:true,ZD: true,WH: true,WX: true,})
            } else {
                cardInfo = Func.calcCow(Func.cardsArrToObj(cards), {ZD: true, WH: true, WX: true,})
            }
            cardInfo.origin = clone(cards);
            needCards.push(cardInfo);
        });
        let pais = this.getBigSmallArr(needCards);
        let temps = [];
        for(let idx in this.players){
            let player = this.players[idx];
            if(player && player.playing) {
                let luck = player.luck;
                temps.push({luck: luck, playerIndex: +idx});
            }
        }
        temps.sort(CommFuc.compare('luck'));
        let lucks = [];
        let ps = [];
        for(let idx in temps){
            lucks.push(temps[idx].luck);
            ps.push(temps[idx].playerIndex);
        }
        let finaPais = CommFuc.allotByLuck(pais, lucks);
        for(let idx in ps){
            let playerIndex = ps[idx];
            newPlayerCards[playerIndex] = needCards[finaPais[idx]].origin;
        }
        //ERROR(JSON.stringify(newPlayerCards));
        return newPlayerCards;
    }

    /**
     * 从大到小排序
     */
    getBigSmallArr(arr){
        let obj = [];
        for(let idx in arr){
            obj.push({cardInfo:arr[idx], paiIndex:+idx});
        }
        obj.sort(this.compareLuckCardInfo());
        let newArr = [];
        for(let idx in obj){
            newArr.push(obj[idx].paiIndex);
        }
        return newArr;
    }

    /**
     * 计算牛牛大小
     */
    compareLuckCardInfo(){
        return function(a,b){
            let cardInfo1 = a["cardInfo"];
            let cardInfo2 = b["cardInfo"];
            return this.compareArr(cardInfo1, cardInfo2);
        }.bind(this);
    }
    /**
     * 比较大小
     */
    compareArr(cardInfo1,cardInfo2){
        if(Func.compareCow(cardInfo1, cardInfo2)){
            return -1;
        }else{
            return 1;
        }
    }
    /**
     *  测试代码
     * @param data
     */
    cheat(data){
        let index = data.index;
        let cards = data.cards;
        let player = this.getPlayerByIndex(index);
        player.initCards = cards;
    }

    /**
     * 计算玩家牌型
     */
    calcCardsInfo() {
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            let cards = ePlayer.initCards;
            if(this.opts.TEXAS){

                ePlayer.cardInfo = Func.calcCow(Func.cardsArrToObj(cards), {
                    TEXAS: true,
                    ZD: true,
                    WH: true,
                    WX: true,
                })
            }else {

                ePlayer.cardInfo = Func.calcCow(Func.cardsArrToObj(cards),{
                    ZD: true,
                    WH: true,
                    WX: true,
                })
            }
            DEBUG(ePlayer.cardInfo)
        })
    }

    /**
     * 开始抢庄
     */
    doStartRob() {
        let maxRob = {};
        let playerNum = this.getPlayingPlayerNum();
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            if(ePlayer.playing){
                let bean = ePlayer.bean;
                let numA = bean / playerNum - 1;
                let numB = this.baseBean / 3.5;
                let num = Math.floor(numA / numB);
                ePlayer.maxRob = num;
                maxRob[eIndex] = num;
            }
        });
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_ROB,{maxRob: maxRob});
        this.status = Enum.GameState.ROB;
        this.startActionTimer(ActionType.PS_ROB,this.makeActionUsers([]));

        this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, this.getActionTimerInfo());
    }

    /**
     * 开始下注
     */
    doStartBet() {
        let maxBet = {};
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            if(ePlayer.playing){
                let bean = ePlayer.bean;
                let numA = this.dealerRob * this.baseBean * Enum.TypeMultiple[Enum.CardType.PN];
                let num = Math.floor(bean / numA);
                ePlayer.maxBet = num;
                maxBet[eIndex] = num;
            }
        });
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_BET,{maxBet: maxBet});

        this.status = Enum.GameState.BET;

        this.startActionTimer(ActionType.PS_BET,this.makeActionUsers([this.dealer]));

        this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, this.getActionTimerInfo());
    }

    /**
     * 开始亮牌
     */
    doStartPlay() {
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_PLAY,{});
        this.status = Enum.GameState.PLAY;

        this.startActionTimer(ActionType.PS_PLAY,this.makeActionUsers([]));

        this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, this.getActionTimerInfo());
    }


    /**
     * 玩家抢庄
     * @param index
     * @param num
     */
    onPlayerRob(index, num) {

        num = parseInt(num);
        if(typeof num !== "number"){
            return;
        }
        num = Math.floor(num);
        if(num < 0 || num > 4){
            return;
        }
        let player = this.getPlayerByIndex(index);
        if(player.rob >= 0){
            return
        }
        if(this.status !== Enum.GameState.ROB){
            return;
        }
        player.rob = num;
        this.broadcastMsg(ProtoID.CLIENT_GAME_ROB_PS,{index: index, rob: num});
        this.playerFinishAction(player.index);
        this.checkRob();
    }

    /**
     * 玩家下注
     * @param index
     * @param num
     */
    onPlayerBet(index, num) {
        num = parseInt(num);
        if(typeof num !== "number"){
            return;
        }
        num = Math.floor(num);
        if(num < 1 || num > 3){
            return
        }
        let player = this.getPlayerByIndex(index);
        if(player.bet > 0){
            return;
        }
        if(this.status !== Enum.GameState.BET){
            return;
        }
        player.bet = num;
        this.broadcastMsg(ProtoID.CLIENT_GAME_BET_PS,{index: index, bet: num * this.baseBean});

        this.playerFinishAction(player.index);
        this.checkBet();
    }

    /**
     *  玩家亮牌
     * @param index
     */
    onPlayerPlay(index) {

        let player = this.getPlayerByIndex(index);
        if(player.play){
            return
        }
        if(this.status !== Enum.GameState.PLAY){
            return;
        }
        player.play = true;
        let info = {
            index: index,
            cards: player.handCards,
            type: player.cardInfo.pattern
        };
        let flag = true;

        this.enumPlayingPlayers((eIndex, ePlayer) => {
            if(ePlayer.playing && ePlayer.play === false){
                flag = false
            }
        });

        if(player.index === this.dealer){
            info.played = false;

            this.broadcastMsg(ProtoID.GAME_CLIENT_DEALER_PLAY,info);
        }else {

            this.broadcastMsg(ProtoID.CLIENT_GAME_PLAY_PS,info);
        }
        this.playerFinishAction(player.index);
        if(flag){
            //结算
            let dealer = this.getPlayerByIndex(this.dealer);
            let dealerInfo = {
                index: this.dealer,
                cards: dealer.handCards,
                type: dealer.cardInfo.pattern,
                played: true
            };
            this.broadcastMsg(ProtoID.GAME_CLIENT_DEALER_PLAY, dealerInfo);
            this.onSettlement()

        }
    }

    /**
     * 抢庄
     */
    checkRob() {
        let flag = true;
        this.enumPlayingPlayers((eIndex, ePlayer) =>{
            if(ePlayer.playing){
                if(ePlayer.rob === -1){
                    flag = false;
                    return false
                }
            }

        });
        if(flag){
            this.dealer = this.calcDealer();
            let dealPlayer = this.getPlayerByIndex(this.dealer);
            this.dealerRob = Math.max(dealPlayer.rob, 1);
            dealPlayer.rob = this.dealerRob;

            //广播换庄消息
            this.broadcastMsg(ProtoID.GAME_CLIENT_CHANGE_DEALER, {dealerIndex: this.dealer, rob: this.dealerRob});

            this.doStartBet()

        }
    }


    checkBet() {
        let flag = true;
        this.enumPlayingPlayers((eIndex, ePlayer) =>{
            if(eIndex === this.dealer){
                return
            }
            if(ePlayer.bet === 0 && ePlayer.playing){
                flag = false;
                return false
            }
        });
        if(flag){
            //发牌
            if(this.subType === Enum.SubType.KPQZ){
                this.enumPlayingPlayers((eIndex, ePlayer)=>{
                    if(ePlayer.playing){
                        let card = ePlayer.initCards[4];
                        ePlayer.handCards = ePlayer.initCards;
                        ePlayer.handCards = Func.typeSort(ePlayer.handCards, ePlayer.cardInfo);

                        DEBUG(ePlayer.handCards);
                        ePlayer.sendMsg(ProtoID.GAME_CLIENT_PLAYER_NEW_CARD, {card: card})
                    }
                })
            }else if(this.subType === Enum.SubType.ZYQZ){
                this.enumPlayingPlayers((eIndex, ePlayer)=>{
                    if(ePlayer.playing){
                        let cards = ePlayer.initCards;
                        ePlayer.handCards = Func.typeSort(cards, ePlayer.cardInfo);
                        ePlayer.sendMsg(ProtoID.GAME_CLIENT_PLAYER_CARD_PS, {cards: ePlayer.handCards})
                    }
                })
            }
            this.doStartPlay()
        }
    }


    /**
     * 计算庄家
     * @returns {*}
     */
    calcDealer() {
        let rob = [];
        let max = 0;
        this.enumPlayingPlayers((eIndex, ePlayer) =>{
            if(ePlayer.rob === max){
                rob.push(eIndex)
            }else if(ePlayer.rob > max){
                rob = [];
                rob.push(eIndex);
                max = ePlayer.rob
            }
        });
        let iRandom = Math.floor(Math.random() * rob.length);
        return rob[iRandom]
    }


    getReportInfo(){
        let data = {};
        let dealPlayer = this.getPlayerByIndex(this.dealer);
        data.roundId = this.roundId;
        data.gameType = this.gameType;
        data.players = [];
        data.dealer = 0;
        data.mode = this.mode;
        data.creator = this.creator;
        data.curRound = this.curRound;
        if(dealPlayer){
            data.dealer = dealPlayer.uid
        }
        data.roomId = this.roomId;
        data.time = new Date().getTime();
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            data.players.push(ePlayer.getPlayerReportInfo())
        });
        return data
    }


    /**
     * 结算
     */
    onSettlement() {
        this.gameOver = true;
        DEBUG("settlement...");
        super.onSettlement();
        let playerInfo = {};
        let report = this.getReportInfo();
        GameMgr.savePlayerReport(report);
        this.enumPlayingPlayers((eIndex, ePlayer) =>{
            ePlayer.setActionTimer(ActionType.READY,Enum.ActionTime.READY[this.mode]);
            playerInfo[eIndex] = ePlayer.getSettlementInfo();
            ePlayer.updateWatchScore();
        });
        this.broadcastMsg(ProtoID.GAME_CLIENT_SETTLEMENT_PS, {players : playerInfo});
        this.onRoundFinish();
    }


    /**
     * 本轮结束
     */
    onRoundFinish(){
        this.reset();
        this.curRound += 1;
        let timeFlag = true;
        this.enumRealPlayers((eIndex, ePlayer)=>{
            ePlayer.reset();
            if(timeFlag){
                timeFlag = false;
                this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, ePlayer.actionTimer);
            }
            ePlayer.timer = setTimeout(()=>{
                if(ePlayer.ready){
                    return;
                }
                this.quitRoom(ePlayer.uid)
            }, Enum.ActionTime.READY[this.mode]);
        })
    }

    /**
     * 结算
     */
    settlement() {
        let dealer = this.getPlayerByIndex(this.dealer);
        let dealerCardInfo = dealer.cardInfo;
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            if(eIndex === this.dealer){
                return
            }
            let cardInfo = ePlayer.cardInfo;
            let temp = this.dealerRob * ePlayer.bet * this.baseBean;
            if(Func.compareCow(dealerCardInfo, cardInfo)){
                //庄家赢
                let bean = temp * Enum.TypeMultiple[dealerCardInfo.pattern];
                bean = Math.min(bean, ePlayer.bean);
                dealer.roundWin += bean;
                ePlayer.roundLose += bean;
                ePlayer.updateLuck(1, 5);
                dealer.updateLuck(-1, 5);
            } else {
                //闲家赢
                let bean = temp * Enum.TypeMultiple[cardInfo.pattern];
                bean = Math.min(bean, ePlayer.bean);
                dealer.roundLose += bean;
                ePlayer.roundWin += bean;
                ePlayer.updateLuck(-1, 5);
                dealer.updateLuck(1, 5);
            }
        });

        this.calcActualBean();
        this.enumPlayingPlayers((eIndex, ePlayer)=>{
            ePlayer.roundBean = Math.floor(ePlayer.roundWin - ePlayer.roundLose);
            ePlayer.updateCoin(1, ePlayer.roundBean, eventType.MATCH);
            ePlayer.taskParams.winLoseBean = ePlayer.roundBean;
            if(ePlayer.roundBean > 0){
                ePlayer.taskParams.win = true;
            }
            this.checkTask(ePlayer);
            let multiple = Math.floor(ePlayer.roundWin / this.baseBean);
            if(multiple >= Enum.NOTICE_MAX_BET){
                let data = GameMgr.getInsertMsg(this.gameType, this.subType);
                let wBean = CommFuc.wBean(ePlayer.roundWin);
                GameMgr.noticeInsertNotice(`恭喜玩家${ePlayer.name}在【${data.gameTypeMsg}】【${data.subTypeMsg}】中赢得了${wBean}万SEER`);
            }
        })
    }

    /**
     * 计算实际输赢
     */
    calcActualBean() {
        let dealer = this.getPlayerByIndex(this.dealer);
        let roomMaxBean = this.maxBean - this.serverCost;
        if(dealer.roundWin > dealer.roundLose){
            // let dealerWin = dealer.roundWin - dealer.roundLose;
            // //庄家赢溢出 -- 暂时不计算庄赢的溢出
            // if(dealerWin > dealer.bean){
            //     let temp = 0;
            //     let superfluous = dealerWin - dealer.bean;
            //     this.enumPlayingPlayers((eIndex, ePlayer) => {
            //         if (eIndex === this.dealer) {
            //             return
            //         }
            //         let numA = ePlayer.roundLose / dealer.roundWin;
            //         let numB = superfluous * numA;
            //         ePlayer.roundLose -= numB;
            //         temp += numB;
            //     });
            //     dealer.roundWin -= temp
            // }
        }else{
            //庄家输超出
            let dealerLost = dealer.roundLose - dealer.roundWin;
            let maxBean = Math.min(dealer.bean, roomMaxBean);
            if(dealerLost > maxBean){
                let temp = 0;
                this.enumPlayingPlayers((eIndex, ePlayer) => {
                    if (eIndex === this.dealer) {
                        return
                    }
                    let numA = ePlayer.roundWin / dealer.roundLose;
                    let numB = Math.floor(maxBean * numA);
                    let numC = ePlayer.roundWin - numB;
                    ePlayer.roundWin -= numC;

                    temp += numC;
                });
                dealer.roundLose -= temp
            }
        }
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            if (eIndex === this.dealer) {
                return
            }
            let maxBean = Math.min(ePlayer.bean, roomMaxBean);
            //闲家输
            if(ePlayer.roundLose > maxBean){
                let numA = ePlayer.roundLose - maxBean;
                ePlayer.roundLose = maxBean;
                dealer.roundWin -= numA;
            }
            //闲家赢 牛牛比较特殊闲家赢也只能赢15万 不然会出现问题
            if(ePlayer.roundWin > maxBean){
                let numA = ePlayer.roundWin - maxBean;
                ePlayer.roundWin = maxBean;
                dealer.roundLose -= numA;
            }
        });
    }


}



exports.Room = PsRoom;
