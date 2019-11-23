let util            = require("util");
let Enum            = require("./Enum.js");
let Player          = require("./Player.js").Player;
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../../net/CSProto.js").ProtoState;
let ActionType      = require("../../../net/CSProto.js").ActionType;
let resEvent        = require("../../../net/CSProto.js").resEvent;
let eventType       = require("../../../net/CSProto.js").eveIdType;
let CommFuc         = require("../../../util/CommonFuc.js");
let Room        = require("../../base/room");
///////////////////////////////////////////////////////////////////////////////
//>> 赢三张公牌

class PublicCards {
    constructor(owner) {
        this.owner = owner;
        this.cards = [];                                    // 牌
        this.getIndex = 0;                                  // 取牌位置
        this.num = 52;                                      // 剩余牌
    }
    /**
     * 生成牌组
     * @param owner
     * @returns {*}
     */
    gen(owner) {
        this.reset();
        let originCards = [];
        if(this.owner.subType == 1) {
            for (let type = 1; type <= 4; type++) {
                for (let num = 1; num <= 13; num++) {
                    originCards.push(type * 100 + num);
                }
            }
        }else if(this.owner.subType == 2){
            for (let type = 1; type <= 4; type++) {
                for (let num = 9; num <= 13; num++) {
                    originCards.push(type * 100 + num);
                }
            }
        }
        this.num = originCards.length;
        while (originCards.length > 0) {
            let rIdx = Math.floor(Math.random() * originCards.length);
            this.cards.push(originCards[rIdx]);
            originCards.splice(rIdx, 1);
        }
        let playerCards = CommFuc.twoDimensionalArray(owner.playNum, 3, 0);
        for (let i = 0; i < owner.playNum; i++) {
            for(let j = 0; j < 3; j++ ) {
                playerCards[i][j] = this.getCard();
            }
        }
        // playerCards = [[112,203,202],[309,408,107],[410,209,106],[0,0,0],[0,0,0],[0,0,0]];
        this.cardSort(playerCards);
        return playerCards;
    }
    /**
     * 摸牌
     * @returns {*}
     */
    getCard() {
        let rtnCard = this.cards[this.getIndex];
        this.num--;
        this.getIndex++;
        return rtnCard;
    }
    /**
     * 重置牌
     */
    reset() {
        this.cards = [];                                    // 牌
        this.getIndex = 0;                                  // 取牌位置
        this.num = 52;                                      // 剩余牌 <红桃、黑桃、方块、梅花>
    }
    /**
     * 排序
     */
    cardSort(playerCards) {
        for(let idx = 0; idx < playerCards.length; idx++){
            let cards = playerCards[idx];
            cards.sort(this.hsOrder);
            cards.sort(this.powerOrder);
            this.check123(cards);
        }
    }
    /**
     * 使用威力排序
     * @param a
     * @param b
     * @returns {boolean}
     */
    powerOrder(a, b) {
        function getPower(card){
            if(card % 100 == 1){
                return 14;
            }else{
                return card % 100;
            }
        }
        return getPower(a) < getPower(b);
    }
    /**
     * 使用花色排序
     * @param a
     * @param b
     * @returns {boolean}
     */
    hsOrder(a, b) {
        function getHS(card) {
            return Math.floor(card / 100);
        }
        return getHS(a) > getHS(b);
    }
    /**
     * 特殊牌型检测
     * @param cards
     */
    check123(cards) {
         let point0 = this.getPower(cards[0]);
         let point1 = this.getPower(cards[1]);
         let point2 = this.getPower(cards[2]);
         if(point0 == 14 && point1 == 3 && point2 == 2){
             let temp = cards[1];
             cards[1] = cards[2];
             cards[2] = temp;
         }
    }
    /**
     * 获取威力
     * @param card
     * @returns {number}
     */
    getPower(card) {
        if (card % 100 == 1) {
            return 14;
        } else {
            return card % 100;
        }
    }
};
///////////////////////////////////////////////////////////////////////////////
//>> 游戏房间
/**
 * @param data
 * @constructor
 */
class PSZRoom extends Room {
    constructor(data) {
        super(data);
        this.gameType = 4;                      // 游戏类型
        this.turns = data.opts.round || 20;     // 轮数
        this.curTurns = 0;                      // 当前轮
        // game property
        this.publicCards = null;                // 公牌信息
        this.dealer = 0;                        // 当前庄家
        this.dealered = [];                     // 每一局的庄家idx
        this.allBet = 0;                        // 牌桌上的底注
        this.roomBet = 1;                       // 房间倍数
        this.actionInfo = null;                 // 当前动作信息
        this.scheJob = null;                    // 房间定时任务
        this.compareIng = false;                // 比牌动画中
        this.roundBets = [];                    // 已丢出筹码
        this.indexArray = [];                   // 参与的玩家index
        this.centreBean = {};                   // 中途退出
    }
    /**
     * 房间初始化
     * @param cArgs
     * @returns {boolean}
     */
    init(cArgs) {
        super.init(cArgs);
        this.state = Enum.GameState.READY;
        for (let idx = 1; idx <= this.playNum; ++idx) {
            this.players[idx] = new Player(this, idx);
        }
        this.publicCards = new PublicCards(this);
        this.dealer = 1;
        return true;
    }
    /**
     * 开始房间重置
     */
    startReset() {
        this.state = Enum.GameState.PLAY;                           // 游戏状态
        this.curTurns = 1;                                          // 当前轮
        this.roomBet = 1;                                           // 当前房间的倍数
        this.allBet = 0;                                            // 牌桌上的底注倍数
        this.actionInfo = null;                                     // 动作信息
        this.roundBets = [];                                        // 已丢出筹码
        this.isOne = true;                                          // 是否第一轮
        this.gameOver = false;
    }
    /**
     * 房间结束重置消息
     */
    endReset () {
        this.indexArray = [];
        this.state = Enum.GameState.READY;
        this.playing = false;
        this.roundBets = [];
        this.centreBean = {};
        this.curRound += 1;
        this.curTurns = 0;
        this.gameOver = true;
        for(let idx in this.players){
            let player = this.players[idx];
            player.endReset();
        }
    }

    getMaxPlayerNum(){
        return 6;
    }

    /**
     * 获取房间基础信息
     * @returns {{roomId: *, round: *, roundId: *, gameType: *, subType: *, turns: *, curRound: *, curTurns: *, options: *, playing: *, creator: *, matchId: *, matchName: *, voiceStatus: *}}
     */
    getRoomBaseInfo() {
        let data = super.getRoomBaseInfo();
        data.roundBets = this.roundBets,
        data.roomBean   = this.allBet * this.baseBean,
        data.multiple    = this.roomBet,
        data.curPlay     = this.nextPlayer,
        data.actionTimer = this.actionTimer
        return data;
    }
    /**
     * 获取玩家信息 uid 0表示没有玩家 -10表示玩家中途离开
     */
    getPlayerInfo () {
        let data = {};
        for(let idx in this.players){
            let oPlayer = this.players[idx];
            if(oPlayer.uid != 0) {
                if(oPlayer.uid != -10){
                    data[idx] = oPlayer.getInfo();
                }
            }
        }
        return data;
    }
    /**
     * 设置准备倒计时
     * @param playerIndex
     */
    setReadyEvent(playerIndex){
        let player = this.players[playerIndex];
        if(!(player.uid == 0 || player.uid == -10)){
            if(!player.isRobot()) {
                player.scheJob = setTimeout(function () {
                    this.cancelMatch(player.uid);
                }.bind(this, player), Enum.READY_SECOND[this.mode] * 1000);
            }
            player.setActionTimer(ActionType.READY, Enum.READY_SECOND[this.mode] * 1000);
        }
    }

    /**
     * 中途退出
     */
    onPlayingCanQuit(player){
        if (this.creator !== player.uid && (player.cardState === Enum.CARD_STATE.FOLD || player.cardState === Enum.CARD_STATE.COMPARE_LOST || player.cardState === Enum.CARD_STATE.NONE)) {
            this.centreExit(player.index);
            if(player.cardState !== Enum.CARD_STATE.NONE) {
                player.giveUpExit = true;
            }
            return true;
        }else{
            return false;
        }
    }
    /**
     * 机器人离开房间
     * @param player
     */
    robotEixt(player){
        if(this.playing){
            return;
        }
        ERROR(`机器人: ${player.uid} 退出`);
        let playerIndex = player.index;
        this.broadcastMsg(ProtoID.GAME_CLIENT_LEVEL_ROOM, {playerIndex: playerIndex,gameType: this.gameType});
        let pos = this.indexArray.indexOf(player.index);
        if(pos >= 0){
            this.indexArray.splice(pos, 1);
        }
        player.online = false;
        GameMgr.mgrClient.sendMsg({code: ProtoID.GAME_MIDDLE_PLAY_LEVAL_ROOM,args: {roomId: this.roomId, gameType: this.gameType, guid: player.uid, giveUpExit: false}});
        RobotMgr.onQuitRoom(player.uid);
        this.players[playerIndex] = new Player(this, playerIndex);
        if (this.isCanStart() && !this.playing) {
            this.state = Enum.GameState.PLAY;
            this.playing = true;
            this.onRoomStartNewRound();
        }
    }
    /**
     * 中途退出
     * @param playerIndex
     */
    centreExit(playerIndex) {
        let player = this.players[playerIndex];
        if(player && player.reduceBean != 0){
            player.updateCoin(1, -player.reduceBean, eventType.MATCH);
            player.taskParams.winLoseBean = -player.reduceBean;
            this.checkTask(player);
            this.centreBean[playerIndex] = player.reduceBean;
        }
    }

    onPlayerQuit(player){
        this.removeIndexArray(player);
        let playerIndex = player.index;
        if (!player.giveUpExit || player.cardState === Enum.CARD_STATE.NONE || player.playing === false) {
            this.players[playerIndex] = new Player(this, playerIndex);
        } else {
            player.uid = -10;
        }

        if (this.isCanStart() && !this.playing) {
            DEBUG("开始游戏");
            this.state = Enum.GameState.PLAY;
            this.playing = true;
            this.onRoomStartNewRound();
        }
        if (this.roundOver() && this.playing) {
            this.onSettement();
        }
    }

    removeIndexArray(player){
        let pos = this.indexArray.indexOf(player.index);
        if(pos >= 0){
            this.indexArray.splice(pos, 1);
        }
    }

    subGameChange(player){
        if(this.playing){
            if (player.playing) {
                if (player.cardState === Enum.CARD_STATE.FOLD || player.cardState === Enum.CARD_STATE.COMPARE_LOST || player.cardState === Enum.CARD_STATE.NONE) {
                    return true;
                }else{
                    return false;
                }
            }
        }
        return true;
    }

    onPlayerChange(player){
        if (player.playing) {
            if (player.cardState === Enum.CARD_STATE.FOLD || player.cardState === Enum.CARD_STATE.COMPARE_LOST) {
                this.centreExit(player.index);
                player.giveUpExit = true;
                this.removeIndexArray(player);
            }
        }
    }

    /**
     * 计算出牌玩家
     * @param starIndex
     * @returns {number}
     */
    getNextPlayerIndex(starIndex, isGlobal) {
        let idx = starIndex % this.playNum + 1;
        if(idx == this.dealer % this.playNum + 1 && !isGlobal) {
            if(this.isOne) {
                this.isOne = false;
            }else{
                this.curTurns++;
            }
        }
        for(let loop = 0; loop < this.playNum + 1; loop++){
            let player = this.players[idx];
            if(player && player.playing){
                if(player.cardState == Enum.CARD_STATE.NOT_TO_SEE || player.cardState == Enum.CARD_STATE.HAVE_TO_SEE) {
                    return idx;
                }
            }
            idx = idx % this.playNum + 1;
            if(idx == this.dealer % this.playNum + 1 && !isGlobal) {
                if(this.isOne) {
                    this.isOne = false;
                }else{
                    this.curTurns++;
                }
            }
        }
    }

    onRoomPlayerReady(player){
        player.clearAutoPlayer();
        if(this.indexArray.indexOf(player.index) === -1) {
            this.indexArray.push(player.index);
        }
    }
    /**
     * 是否能开始游戏
     * @returns {boolean}
     */
    isCanStart() {
        if(this.playing){
            return false;
        }
        let num = 0;
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.uid != 0 && player.uid != -10){
                if(!player.ready) {
                    return false;
                }else{
                    num++;
                }
            }
        }
        if(num>= 2) {
            return true;
        }
    }

    /**
     * 计算总押注
     */
    calcAllBet() {
        let sum = this.indexArray.length;
        return sum;
    }
    /**
     *  计算庄
     */
    calcDealer() {
        let iRandom = Math.floor(Math.random() * this.indexArray.length);
        return this.indexArray[iRandom];
    }

    /**
     * 从大到小排列选择的牌
     * @param arr
     */
    getBigSmallArr(arr) {
        let obj = [];
        for(let idx in arr){
            obj.push({cards:arr[idx], paiIndex:+idx});
        }
        obj.sort(this.compareLuckCard());
        let newArr = [];
        for(let idx in obj){
            newArr.push(obj[idx].paiIndex);
        }
        return newArr;
    }
    /**
     * 根据牌排序
     * @param property
     * @returns {Function}
     */
    compareLuckCard(){
        return function(a,b){
            let value1 = a["cards"];
            let value2 = b["cards"];
            return this.compareArr(value1, value2);
        }.bind(this);
    }
    /**
     * 比较两组牌的大小
     * @param card1
     * @param card2
     */
    compareArr(cards1, cards2) {
        let type1 = this.getType(cards1);
        let type2 = this.getType(cards2);
        if(type1 > type2){
            return -1;
        }else if(type1 == type2) {
            if (type1 == Enum.CARD_TYPE.DUI) {
                let dui1 = this.getDuiPower(cards1);
                let dui2 = this.getDuiPower(cards2);
                if (dui1 > dui2) {
                    return -1;
                } else if (dui1 < dui2) {
                    return 1;
                } else {
                    let dan1 = this.getDuiDanPower(cards1);
                    let dan2 = this.getDuiDanPower(cards2);
                    if (dan1 > dan2) {
                        return -1;
                    } else if (dan1 < dan2) {
                        return 1;
                    }
                }
            } else {
                for (let lv = 1; lv <= 3; lv++) {
                    let pow1 = this.getPower(cards1, lv);
                    let pow2 = this.getPower(cards2, lv);
                    if (pow1 > pow2) {
                        return -1;
                        break;
                    } else if (pow2 > pow1) {
                        return 1;
                        break;
                    }
                }
            }
        }else{
            return 1;
        }
    }
    /**
     * 根据幸运值计算牌型
     * @param playerCards
     */
    calcLuck(playerCards) {
        ERROR(JSON.stringify(playerCards));
        let newArray = clone(playerCards);
        let needCards = [];
        for(let idx in playerCards){
            let cards = playerCards[idx];
            let player = this.players[+idx + 1];
            if(player && player.playing) {
                needCards.push(cards);
            }
        }
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
            newArray[playerIndex - 1] = needCards[finaPais[idx]];
        }
        ERROR(JSON.stringify(newArray));
        return newArray;
    }
    /**
     * 开始新一轮
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        this.startReset();
        this.allBet = this.calcAllBet();
        this.dealer = this.calcDealer();
        for(let i = 0; i < this.indexArray.length; i++){
            let idx = this.indexArray[i];
            let player = this.players[idx];
            player.playing = true;
        }
        this.state = Enum.GameState.PLAY;
        let tempCard = this.publicCards.gen(this);
        // tempCard = this.calcLuck(tempCard);      // todo 不在计算幸运值
        this.enumPlayers(function (ePlayerIdx, ePlayer) {
            if (ePlayer.uid != 0) {
                if(!ePlayer.isRobot()) {
                    let consume = this.calcConsume(ePlayer);
                    ePlayer.sendMsg(ProtoID.GAME_CLIENT_START_NEW_ROUND__PSZ,{curTurns:this.curTurns,turns:this.turns, dealerIndex: this.dealer, roundId: this.roundId, consume:consume});
                }
            }
        }.bind(this));

        for(let idx in this.players){
            let player = this.players[idx];
            if(player.playing) {
                let cards = tempCard[idx - 1];
                player.startReset();
                player.handCards.addCards(cards);
                player.addReduceBet(1);
                this.roundBets.push(1);
                let tempBean = player.getTempBean();
                player.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_PSZ, {});
                player.sendMsg(ProtoID.GAME_CLIENT_NEW_ROUND_STAKE,{indexArray: this.indexArray});
                player.sendMsg(ProtoID.GAME_CLIENT_SET_BEAN_INFO, {
                    playerIndex:player.index,
                    bean:tempBean,
                    ante:player.reduceBean,
                    roomBean: this.allBet * this.baseBean,
                    roomBet: this.roomBet
                });
            }
        }
        this.updateResources();
        this.nextPlayer = this.getNextPlayerIndex(this.dealer);
        this.noticeNextPlayer(true);
    }
    /**
     * 保存战报
     */
    saveReportsToMiddle() {
        let data = super.saveReportsToMiddle();
        data.dealer = this.players[this.dealer].uid;
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.cardState != Enum.CARD_STATE.NONE || player.giveUpExit) {
                data.players.push(player.getPlayerReportInfo())
            }
        }
        GameMgr.savePlayerReport(data);
    }
    /**
     * 根据保存牌局号保存数据到数据库
     */
    saveRoundIdToMySql () {
        let playerInfo = this.getPlayerRoundIdInfo();
        let data = {};
        let uids = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0};
        for (let idx in this.players) {
            let player = this.players[idx];
            if(player.playing){
                data[idx] = player.addBean - player.reduceBean;
                uids[idx] = player.oldUid;
            }
        }
        Log.gameResult(this.roundId,this.curRound, this.matchId, playerInfo, data, uids);
    }


    /**
     * 关闭进程
     */
    shutdown() {
        this.destroyRoomImmd();
    }
    /**
     * 看牌
     */
    doSee(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(this.opts.BMSL){
            if(this.curTurns <= 3){
                ERROR("必蒙三轮 不能看牌");
                return;
            }
        }
        if(player) {
            if (player.cardState == Enum.CARD_STATE.NOT_TO_SEE) {
                player.cardState = Enum.CARD_STATE.HAVE_TO_SEE;
                let cards = player.handCards.cards;
                let pattern = this.getType(cards);
                player.sendMsg(ProtoID.CLIENT_GAME_SEE_CARD,{cards:cards, playerIndex:playerIndex, pattern: pattern});
                this.broadcastMsg(ProtoID.GAME_CLIENT_SEE_CARD,{playerIndex: playerIndex}, [playerIndex]);
            }
        }
    }
    /**
     * 弃牌
     * @param uid
     */
    doPass(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player) {
            //ERROR("清理定时任务: " + player.name);
            player.clearAutoPlayer();
            player.cardState = Enum.CARD_STATE.FOLD;
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PASS_PSZ, {playerIndex: playerIndex});
            if (this.roundOver()) {
                this.onSettement();
                return;
            }
            if(this.nextPlayer == playerIndex) {
                this.nextPlayer = this.getNextPlayerIndex(playerIndex);
                this.setTurns(playerIndex);
                this.noticeNextPlayer();
            }
        }
    }
    /**
     * 押注
     * @param uid
     * @param roundBet
     */
    doStake (uid, roundBet, code, isAuto) {
        let playerIndex = this.getPlayerIndex(uid);
        if(playerIndex != this.nextPlayer){
            ERROR(util.format("Not player %d's round", playerIndex));
            return;
        }
        if(this.compareIng){
            ERROR("compare animation not over");
            return;
        }
        let player = this.players[playerIndex];
        if(isAuto){
            if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE){
                roundBet = this.roomBet * 2;
            }
        }
        let needBean = roundBet * this.baseBean + player.reduceBean;
        if(player.bean < needBean){
            player.sendMsg(code, {result:ProtoState.STATE_GAME_BEAN_LESS});
            ERROR("bean lost");
            return;
        }
        let tempRoomBet = roundBet;
        if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE){
            tempRoomBet = Math.floor(roundBet / 2);
        }
        if(tempRoomBet < this.roomBet){
            ERROR("bet too small");
            return;
        }
        // ERROR("清理定时任务: " + player.name);
        player.clearAutoPlayer();
        player.addReduceBet(roundBet);
        this.roomBet = tempRoomBet;
        this.allBet = this.allBet + roundBet;
        let tempBean = player.getTempBean();
        this.roundBets.push(roundBet);
        this.broadcastMsg(code,{
            playerIndex: playerIndex,
            roundBet: roundBet
        });
        this.updateResources();
        this.broadcastMsg(ProtoID.GAME_CLIENT_SET_BEAN_INFO, {
            playerIndex:playerIndex,
            bean:tempBean,
            ante:player.reduceBean,
            roomBean: this.allBet * this.baseBean,
            roomBet: this.roomBet
        });
        if(code == ProtoID.CLIENT_GAME_FOLLOW_STAKE){
            player.anteState = Enum.ANTE_STATE.FLOWER_STAKE;
        }else if(code == ProtoID.CLIENT_GAME_ADD_STAKE){
            player.anteState = Enum.ANTE_STATE.ADD_STAKE;
        }
        this.nextPlayer = this.getNextPlayerIndex(playerIndex);
        this.setTurns(playerIndex);
        this.noticeNextPlayer();
    }

    /**
     * 从写的资源更新
     */
    updateResources() {
        let res = {};
        for(let idx in this.indexArray){
            let playerIndex = this.indexArray[idx];
            let player = this.players[playerIndex];
            if(player) {
                let tempBean = player.getTempBean();
                res[playerIndex] = {};
                res[playerIndex].bean = tempBean;
                res[playerIndex].card = player.card;
                res[playerIndex].diamond = player.diamond;
            }
        }
        this.broadcastMsg(ProtoID.GAME_CLIENT_RES_CHANGE,{players : res, reason: resEvent.PS_CHANGE});
    }
    /**
     * 自动跟注
     * @param uid
     * @param ok
     */
    onPlayerAutoFollowReq (uid, ok) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(!player.playing){
            ERROR("player playing error: " + player.playing);
            return false
        }
        if(player.autoAddStake && ok){
            ERROR("auto follow param error ");
            return false;
        }
        if(!player.autoAddStake && !ok){
            ERROR("auto follow param error ");
            return false;
        }
        if(this.nextPlayer == player.index){
            let time = this.getAutoCardTime(player.index);
            let roundBet = player.cardState == Enum.CARD_STATE.HAVE_TO_SEE ? this.roomBet * 2 : this.roomBet;
            let needBean = roundBet * this.baseBean;
            player.autoAddStake = ok;
            player.clearAutoPlayer();
            if(!ok) {
                // ERROR("玩家<" + player.name + ">设置自动pass事件");
                player.scheJob = setTimeout(function () {
                    this.doPass(uid);
                }.bind(this, uid), time - 2000);
            }else{
                if(player.bean + player.addBean - player.reduceBean < needBean){
                    player.sendMsg(ProtoID.CLIENT_GAME_AUTO_FOLLOW_STAKE,{ok: false});
                    player.autoAddStake = false;
                    player.scheJob = setTimeout(function () {
                        this.doPass(uid);
                    }.bind(this, uid), time - 2000);
                    return;
                }else {
                    // ERROR("玩家<" + player.name + ">设置自动跟注事件");
                    player.scheJob = setTimeout(function () {
                        this.doStake(uid, roundBet, ProtoID.CLIENT_GAME_FOLLOW_STAKE, true);
                    }.bind(this, uid, roundBet), Enum.HOSTED * 1000);
                }
            }
        }else{
            player.autoAddStake = ok;
        }
        player.sendMsg(ProtoID.CLIENT_GAME_AUTO_FOLLOW_STAKE,{ok: ok});
    }
    /**
     * 是否能查牌
     * @param uid
     * @param target
     */
    isCanCheck(uid, target){
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(playerIndex != this.nextPlayer){
            ERROR(util.format("Not player %d's round", playerIndex));
            return false;
        }
        if(playerIndex == target){
            ERROR("not check self");
            return false;
        }
        let roundBet = this.roomBet;
        if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE){
            roundBet = roundBet * 2;
        }
        let needBean = roundBet * this.baseBean + player.reduceBean;
        if(player.bean < needBean){
            ERROR("no check bean lose");
            player.sendMsg(ProtoID.CLIENT_GAME_DO_CHECK, {result:ProtoState.STATE_GAME_BEAN_LESS});
            return false;
        }
        if(this.opts.BMSL){
            if(this.curTurns <= 3){
                ERROR("no check Turn lose 1");
                return false;
            }
        }else{
            if(this.curTurns <= 1){
                ERROR("no check Turn lose 2");
                return false;
            }
        }
        let targetPlayer = this.players[target];
        if(!targetPlayer){
            ERROR("param target error");
            return false;
        }
        return true;
    }
    /**
     * 查牌
     * @param uid
     * @param target
     */
    doCheck (uid, target) {
        if(this.isCanCheck(uid, target) === false){
            ERROR("不满足查牌条件");
            return false;
        }

        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];

        let roundBet = this.roomBet;
        if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE){
            roundBet = roundBet * 2;
        }

        let targetPlayer = this.players[target];

        player.clearAutoPlayer();
        player.addReduceBet(roundBet);
        this.allBet = this.allBet + roundBet;
        this.roundBets.push(roundBet);
        let tempBean = player.getTempBean();

        this.broadcastMsg(ProtoID.GAME_CLIENT_SET_BEAN_INFO, {
            playerIndex:playerIndex,
            bean:tempBean,
            ante:player.reduceBean,
            roomBean: this.allBet * this.baseBean,
            roomBet: this.roomBet
        });
        this.updateResources();
        player.addSeeList(target);
        targetPlayer.addSeeList(playerIndex);
        this.compareCards(player, targetPlayer);
        this.compareIng = true;
        this.scheJob = setTimeout(function () {
            this.onPlayerCheckComplete(playerIndex);
        }.bind(this, playerIndex), Enum.CHECK_COMPLETE * 1000);
    }
    /**
     * 比较牌
     * @param player1
     * @param player2
     */
    compareCards(player1, player2, isGlobal) {
        let win = null, lose = null;
        let cards1 = player1.handCards.cards;
        let cards2 = player2.handCards.cards;
        let type1 = this.getType(cards1);
        let type2 = this.getType(cards2);
        if(type1 > type2){
            win = player1;
        }else if(type1 == type2){
            if(type1 == Enum.CARD_TYPE.DUI) {
                let dui1 = this.getDuiPower(cards1);
                let dui2 = this.getDuiPower(cards2);
                if(dui1 > dui2){
                    win = player1;
                }else if(dui1 < dui2){
                    win = player2;
                }else{
                    let dan1 = this.getDuiDanPower(cards1);
                    let dan2 = this.getDuiDanPower(cards2);
                    if(dan1 > dan2){
                        win = player1;
                    }else if(dan1 < dan2){
                        win = player2;
                    }
                }
            }else{
                for (let lv = 1; lv <= 3; lv++) {
                    let pow1 = this.getPower(cards1, lv);
                    let pow2 = this.getPower(cards2, lv);
                    if (pow1 > pow2) {
                        win = player1;
                        break;
                    } else if (pow2 > pow1) {
                        win = player2;
                        break;
                    }
                }
            }
            if(!win){
                win = player2;
            }
        }else{
            win = player2;
        }
        lose = win == player1 ? player2 : player1;
        lose.cardState = Enum.CARD_STATE.COMPARE_LOST;
        if(!isGlobal) {
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_CHECK, {
                winnerIndex: win.index,
                loserIndex: lose.index,
                sourceIndex: player1.index,
                targetIndex: player2.index
            });
        }
        return win.index;
    }
    /**
     * 获取牌类型
     * @param cards
     * @returns {number}
     */
    getType (cards) {
        let bz = this.isBZ(cards);
        let hs = this.isHS(cards);
        let shun = this.isShun(cards);
        let dui = this.isDui(cards);
        if(bz){
            return Enum.CARD_TYPE.BZ;
        }else if(hs && shun){
            return Enum.CARD_TYPE.THS;
        }else if(hs){
            return Enum.CARD_TYPE.HS;
        }else if(shun){
            return Enum.CARD_TYPE.SHUN;
        }else if(dui){
            return Enum.CARD_TYPE.DUI;
        }else{
            return Enum.CARD_TYPE.DAN;
        }
    }
    /**
     * 豹子
     * @param cards
     * @returns {boolean}
     */
    isBZ (cards) {
        let points = this.genPoints(cards);
        return CommFuc.numAtArrayCount(points, points[0]) == 3;
    }
    /**
     * 同花色
     * @param cards
     * @returns {boolean}
     */
    isHS (cards) {
        let hs1 = Math.floor(cards[0] / 100);
        for(let idx = 1; idx < 3; idx++){
            let hs2 = Math.floor(cards[idx] / 100);
            if(hs1 != hs2){
                return false;
            }
        }
        return true;
    }
    /**
     * 顺牌
     * @param cards
     * @returns {boolean}
     */
    isShun (cards) {
        let points = this.genPoints(cards);
        if(points[0] == 1 && points[1] == 12 && points[2] == 13){
            return true;
        }
        if(points[0] + 1 == points[1] && points[0] + 2 == points[2]){
            return true;
        }
        return false;
    }
    /**
     * 对子
     * @param cards
     * @returns {boolean}
     */
    isDui (cards) {
        let points = this.genPoints(cards);
        return (CommFuc.numAtArrayCount(points, points[0]) == 2 || CommFuc.numAtArrayCount(points, points[1]) == 2 || CommFuc.numAtArrayCount(points, points[2]) == 2);
    }
    /**
     * 获取对子
     * @param cards
     * @returns {*}
     */
    getDuiPower (cards) {
        let points = this.genPoints(cards);
        for(let idx = 0; idx < 3; idx++){
            if(CommFuc.numAtArrayCount(points, points[idx]) == 2){
                if(points[idx] == 1){
                    return 14;
                }else {
                    return points[idx];
                }
            }
        }
    }
    /**
     * 获取对子的单牌
     * @param cards
     * @returns {*}
     */
    getDuiDanPower (cards) {
        let points = this.genPoints(cards);
        let point = 0;
        if(points[0] == points[1]){point = points[2]}
        if(points[0] == points[2]){point = points[1]}
        if(points[1] == points[2]){point = points[0]}
        if(point == 1){
            return 14;
        }else{
            return point;
        }
    }
    /**
     * 查牌完成
     */
    onPlayerCheckComplete(playerIndex) {
        if(this.compareIng) {
            this.nextPlayer = this.getNextPlayerIndex(playerIndex);
            clearTimeout(this.scheJob);
            this.scheJob = null;
            this.compareIng = false;
            this.broadcastMsg(ProtoID.CLIENT_GAME_CHECK_COMPLETE, {});
            if (this.roundOver()) {
                ERROR("结算3");
                this.onSettement();
                return;
            }
            this.setTurns(playerIndex);
            this.noticeNextPlayer();
        }
    }
    /**
     * 获取威力
     * @param cards
     * @param lv
     * @returns {*}
     */
    getPower (cards, lv) {
        let points = this.genPoints(cards);
        let powers = this.genPowers(points);
        if(lv == 1) {
            return powers[2]
        }else if(lv == 2){
            return powers[1];
        }else if(lv == 3){
            return powers[0]
        }
    }
    /**
     * 获取威力值
     * @param points
     */
    genPowers (points) {
        let powers = [];
        for(let idx in points){
            if(points[idx] == 1){
                powers[idx] = 14;
            }else{
                powers[idx] = points[idx];
            }
        }
        powers.sort(function (a, b) {
            return a > b;
        });
        return powers;
    }
    /**
     * 生成牌点
     * @param cards
     * @returns {Array}
     */
    genPoints (cards) {
        let points = [];
        points.push(cards[0] % 100);
        points.push(cards[1] % 100);
        points.push(cards[2] % 100);
        points.sort(function (a, b) {
            return a > b;
        });
        return points;
    }
    /**
     * 广播通知下一个出牌玩家
     */
    noticeNextPlayer(first = false) {
        if(!this.gameOver) {
            let player = this.players[this.nextPlayer];
            let time = this.getAutoCardTime(player.index);
            let uid = player.uid;
            player.clearAutoPlayer();
            this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_PSZ, {
                playerIndex: this.nextPlayer,
                curTurns: this.curTurns
            });
            let data = {action: ActionType.PSZ_PLAY, stamp: Date.getStamp() * 1000, duration: time, users: [player.index]};
            this.actionTimer = data;
            this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
            let roundBet = player.cardState == Enum.CARD_STATE.HAVE_TO_SEE ? this.roomBet * 2 : this.roomBet;
            let needBean = roundBet * this.baseBean;
            if(player.isRobot()){
                let seeNum = Math.floor(Math.random() * 100);
                if(seeNum > 20){
                    this.doSee(player.uid);
                }
                let scheTime = first ? Enum.First_PLAY : Enum.ROBOT_PLAY;
                if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE){
                    let addNum = Math.floor(Math.random() * 100);
                    let code = ProtoID.CLIENT_GAME_FOLLOW_STAKE;
                    if(addNum > 80){
                        this.roomBet++;
                        code = ProtoID.CLIENT_GAME_ADD_STAKE;
                        if(this.roomBet > 5){
                            this.roomBet = 5;
                            code = ProtoID.CLIENT_GAME_FOLLOW_STAKE;
                        }
                    }
                    roundBet = this.roomBet * 2;
                    let type = this.getType(player.handCards.cards);
                    let compNum = Math.floor(Math.random() * 100);
                    let prop = this.getProp(type);
                    let index = this.getCompIndex(player.index);
                    if(!this.isCanCheck(uid, index)) prop = -1;
                    if(compNum > prop){
                        ERROR("机器人玩家 <" + player.name + "> 设置自动跟注事件" + "当前轮: " + this.curTurns);
                        player.scheJob = setTimeout(function () {
                            this.doStake(uid, roundBet, code, true);
                        }.bind(this, uid, roundBet), scheTime * 1000);
                    }else{
                        ERROR("机器人玩家 <" + player.name + "> 设置比牌事件" + "当前轮: " + this.curTurns);
                        if(index) {
                            player.scheJob = setTimeout(function () {
                                this.doCheck(uid, index);
                            }.bind(this,index), scheTime * 1000);
                        }
                    }
                }else{
                    let addNum = Math.floor(Math.random() * 100);
                    let code = ProtoID.CLIENT_GAME_FOLLOW_STAKE;
                    if(addNum > 80){
                        this.roomBet++;
                        code = ProtoID.CLIENT_GAME_ADD_STAKE;
                        if(this.roomBet > 5){
                            this.roomBet = 5;
                            code = ProtoID.CLIENT_GAME_FOLLOW_STAKE;
                        }
                    }
                    roundBet = this.roomBet;
                    player.scheJob = setTimeout(function () {
                        this.doStake(uid, roundBet, code, true);
                    }.bind(this, uid, roundBet), scheTime * 1000);
                }
            }else {
                if (!player.autoAddStake) {
                    ERROR("玩家<" + player.name + ">设置自动pass事件");
                    player.scheJob = setTimeout(function () {
                        this.doPass(uid);
                    }.bind(this, uid), time - 2000);
                } else {
                    if (player.bean + player.addBean - player.reduceBean < needBean) {
                        player.sendMsg(ProtoID.CLIENT_GAME_AUTO_FOLLOW_STAKE, {ok: false});
                        player.autoAddStake = false;
                        player.scheJob = setTimeout(function () {
                            this.doPass(uid);
                        }.bind(this, uid), time - 2000);
                    } else {
                        ERROR("玩家<" + player.name + ">设置自动跟注事件");
                        player.scheJob = setTimeout(function () {
                            this.doStake(uid, roundBet, ProtoID.CLIENT_GAME_FOLLOW_STAKE, true);
                        }.bind(this, uid, roundBet), Enum.HOSTED * 1000);
                    }
                }
            }
        }
    }
    /**
     * 机器人获取比牌概率
     * @param type
     * @returns {number}
     */
    getProp (type) {
        let prop = 100;
        if(type == Enum.CARD_TYPE.DAN){
            prop = this.curTurns * 2 * 8;
        }else if(type == Enum.CARD_TYPE.DUI){
            prop = this.curTurns * 1 * 6;
        }else if(type == Enum.CARD_TYPE.SHUN){
            prop = this.curTurns * 1 * 5;
        }else if(type == Enum.CARD_TYPE.HS){
            prop = this.curTurns * 1 * 1;
        }else if(type == Enum.CARD_TYPE.THS){
            prop = this.curTurns * 1 * 0;
        }else if(type == Enum.CARD_TYPE.BZ){
            prop = this.curTurns * 1 * 0;
        }
        if(prop > 90){
            prop = 90;
        }
        return prop;
    }
    /**
     * 机器人获取比牌对象
     * @param playerIndex
     */
    getCompIndex (playerIndex) {
        let compArray = [];
        for(let idx in this.players){
            if(idx == playerIndex){
                continue;
            }
            let player = this.players[idx];
            if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE || player.cardState == Enum.CARD_STATE.NOT_TO_SEE){
                compArray.push(+idx);
            }
        }
        if(compArray.length == 0){
            ERROR("比牌系统出错");
        }
        let rIdx = Math.floor(Math.random() * compArray.length);
        return compArray[rIdx];
    }
    /**
     * 设置轮
     * @param playerIndex
     */
    setTurns (playerIndex) {
        if(this.curTurns > this.turns && !this.gameOver){
            let compares = [];
            let startIdx = this.getNextPlayerIndex(this.dealer, true);
            let tempIdx = startIdx;
            compares.push(startIdx);
            for(let loop = 0; loop < this.playNum; loop++){
                let idx = this.getNextPlayerIndex(tempIdx, true);
                if(idx == startIdx){
                    break;
                }
                compares.push(idx);
                tempIdx = idx;
            }
            let player1 = this.players[compares[0]], player2 = null, winIdx = null;
            let len = compares.length;
            for(let i = 1; i < len; i++){
                let idx2 = compares[i];
                player2 = this.players[idx2];
                winIdx = this.compareCards(player1, player2, true);
                player1 = this.players[winIdx];
            }
            this.broadcastMsg(ProtoID.GAME_CLIENT_ALL_ROUND_CHECK, {});
            this.setListToAll();
            this.onSettement(winIdx);
        }
    }
    /**
     * 全桌比牌可以看到所有牌
     */
    setListToAll () {
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.playing) {
                for (let i = 0; i < this.indexArray.length; i++) {
                    player.addSeeList(this.indexArray[i]);
                }
            }
        }
    }
    /**
     * 回合结束
     * @returns {boolean}
     */
    roundOver () {
        let count = 0;
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.cardState == Enum.CARD_STATE.NOT_TO_SEE || player.cardState == Enum.CARD_STATE.HAVE_TO_SEE){
                count++;
            }
        }
        if(count == 1){
            return true;
        }
        return false;
    }
    /**
     * 结算
     * @param playerIndex
     */
    onSettement(playerIndex) {
        if(!playerIndex){
            playerIndex = this.calcWinPlayerIndex();
        }
        if(!playerIndex){
            ERROR("error -- onSettement not playerIndex");
            return;
        }
        let winP = this.players[playerIndex];
        if(winP) {
            winP.addBean = this.allBet * this.baseBean;
            this.updateResources();
        }
        this.billBean(playerIndex);
        let playerInfo = {};
        let users = [];
        this.saveRoundIdToMySql();
        this.saveReportsToMiddle();
        for(let idx in this.players){
            let player = this.players[idx];
            player.clearAutoPlayer();
            this.setReadyEvent(player.index);
            if(player.playing) {
                playerInfo[idx] = player.getSettementInfo();
                player.updateWatchScore();
            }
            if(player.uid > 0) {
                users.push(idx);
            }
            player.endReset();
        }
        super.onSettlement();
        this.broadcastMsg(ProtoID.GAME_CLIENT_SETTLEMENT_PSZ, {winnerIndex : playerIndex, players : playerInfo, endTime:Date.getStamp(), roundId:this.roundId});
        let data = {action: ActionType.READY, stamp: Date.getStamp() * 1000, duration: Enum.READY_SECOND[this.mode] * 1000, users: users};
        this.actionTimer = data;
        this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
        for(let idx in this.centreBean){
            let player = this.players[idx];
            GameMgr.mgrClient.sendMsg({code: ProtoID.GAME_MIDDLE_REMOVE_COPY_PLAYER,args: {roomId: this.roomId,gameType: 4, guid: player.uid}});
            this.players[idx] = new Player(this, idx);
        }
        this.endReset();
        if(this.getRealPlayerNum() === 0) {
            this.destroyRoomImmd();
            return;
        }
        this.removeOffUser();
        this.setRobotReady();
    }
    /**
     * 设置机器人玩家准备事件
     */
    setRobotReady(){
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.isRobot()){
                let go = Math.random() > 0.5 ? true : false;
                let time = Math.floor(Math.random() * 10 + 2) * 1000;
                if(player.bean < this.baseBean * 10 * 20 + this.baseBean){
                    go = true;
                }
                if(!go) {
                    setTimeout(function () {
                        this.onPlayerReqContinue(player.uid, true);
                    }.bind(this), time);
                }else {
                    setTimeout(function () {
                        this.cancelMatch(player.uid);
                    }.bind(this), time);
                }
            }
        }
    }
    /**
     * 计算赢家
     * @returns {*}
     */
    calcWinPlayerIndex () {
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.cardState == Enum.CARD_STATE.HAVE_TO_SEE || player.cardState == Enum.CARD_STATE.NOT_TO_SEE){
                return idx;
            }
        }
        return null;
    }
    /**
     * 获取player
     * @param uid
     */
    getPlayerByUid(uid) {
        for (let playerIdx in this.players) {
            if (this.players[playerIdx].uid === uid) {
                return this.players[playerIdx];
            }
        }
        return null;
    }
    /**
     * 结算金豆
     * @param playerIndex
     */
    billBean (playerIndex) {
        let loseNum = 0;
        for (let idx in this.players) {
            let player = this.players[idx];
            if(player.playing){
                if (idx == playerIndex) {
                    let winBean = +this.allBet * this.baseBean - player.reduceBean;
                    player.updateCoin(1, winBean, eventType.MATCH);
                    player.taskParams.winLoseBean = winBean;
                    player.taskParams.win = true;
                    this.checkTask(player);
                    if(this.allBet >= Enum.NOTICE_MAX_BET){
                        let data = GameMgr.getInsertMsg(this.gameType, this.subType);
                        let wBean = CommFuc.wBean(this.allBet * this.baseBean);
                        GameMgr.noticeInsertNotice(`恭喜玩家${player.name}在【${data.gameTypeMsg}】【${data.subTypeMsg}】中赢得了${wBean}万SEER`);
                    }
                }else{
                    if(!this.centreBean[idx]){
                        player.updateCoin(1, -player.reduceBean, eventType.MATCH);
                        player.taskParams.winLoseBean = -player.reduceBean;
                        this.checkTask(player);
                        loseNum++;
                    }
                }
            }
        }
        for (let idx in this.players) {
            let player = this.players[idx];
            if(player.playing){
                if (idx == playerIndex) {
                    player.updateLuck(-loseNum);
                }else{
                    player.updateLuck(1);
                }
            }
        }
    }
    /**
     * 计算自动弃牌时间
     * @param playerIndex
     * @returns {number}
     */
    getAutoCardTime(playerIndex) {
        let player = this.players[playerIndex];
        let time = Enum.PLAY_CARD_TIME[this.mode];
        if(this.mode == "JB"){
            if(!player.online){
                time = Enum.OFF_LINE_TIME;
            }
        }
        return time * 1000;
    }
};

exports.Room = PSZRoom;
