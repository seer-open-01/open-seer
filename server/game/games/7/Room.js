let Enum            = require("./Enum.js");
let Player          = require("./Player.js").Player;
let CSProto         = require("../../../net/CSProto.js");
let CommFuc         = require("../../../util/CommonFuc.js");
let Room            = require("../../base/room");
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../../net/CSProto.js").ProtoState;
let eventType   = require("../../../net/CSProto.js").eveIdType;
let ActionType  = require("../../../net/CSProto.js").ActionType;
let resEvent    = require("../../../net/CSProto.js").resEvent;
let AI              = require("./AI.js").AI;
///////////////////////////////////////////////////////////////////////////////
//>>房间

class PDKRoom extends Room{
    constructor(data){
        super(data);
        this.dealer = 0;                        // 当前庄家
        this.gameType = 7;                      // 游戏类型
        this.status = Enum.GameState.READY;     // 房间状态
        this.preShape = null;
        this.ai = new AI(this);                 // 初始化AI
        this.prePlayer = 0;                     // 上一个出牌玩家
        this.details = {};                      // 详情
        this.actionTimer = {};
        this.roomCardsed = [];                  // 已经走过的牌
        this.setMut = this.opts.setMut || 1          // 1246还是2468
    }


    init(cArgs) {
        super.init(cArgs);
        this.state = Enum.GameState.READY;
        this.playNum = this.getMaxPlayerNum();
        for (let idx = 1; idx <= this.playNum; ++idx) {
            this.players[idx] = new Player(this, idx);
        }
        this.dealer = 1;
        this.reset();
        return true;
    }

    getMaxPlayerNum(){
        return this.subType === 1 ? 3 : 4;
    }


    onPlayerQuit(player){
        this.players[player.index] = new Player(this, player.index);
    }

    onPlayerEnter(uid){
        let player = this.getPlayerByUid(uid);
        if(!this.playing && player.uid !== this.creator) {
            ERROR(player.name + "设置了准备事件");
            this.setReadyEvent(player.index, Enum.READY_SECOND[this.mode]);
        }
    }

    setReadyEvent(playerIndex, time) {
        let player = this.getPlayerByIndex(playerIndex);
        if (!player.isRobot()) {
            player.scheJob = setTimeout(function () {
                this.quitRoom(player.uid);
            }.bind(this, player),time * 1000);
        }
        player.setActionTimer(ActionType.READY, time);
    }

    reset(){
        this.preShape = null;
        this.prePlayer = 0;
        // this.roomBet = 0;       // 房间的倍率 一炸4倍 2炸8倍 3炸12倍
        this.nextPlayer = 0;
        this.gameOver = false;                                   // 是否结束游戏
        this.resetDestory();                                     // 重置解散房间数据
        this.survivalZD = this.initSurvivalInfo();               // 存活的炸弹信息
    }

    initSurvivalInfo(){
        let data = {};
        for(let idx in this.players){
            data[idx] = 0;
        }
        return data;
    }

    endReset() {
        this.playing = false;
        this.state = Enum.GameState.READY;
        this.curRound += 1;
        if(this.curRound > this.round){
            this.curRound = this.round;
        }
    }
    /**
     * 重置解散信息
     */
    resetDestory() {
        this.isReqDestroy = false;
        this.destroyIndex = 0;
        this.destroyPlayers = 0;
        this.respDestroyOKs = {};
        this.selectDestroyNum = 0;
        this.destroyTime = 0;
        this.enumRealPlayers((eIndex, ePlayer)=>{
            ePlayer.setDestroyState(Enum.DestroyState.NONE);
        });
    }

    /**
     * 获取房间信息
     *
     */
    getRoomInfo() {
        let data = super.getRoomInfo();
        data.gPlaying = this.gPlaying;
        data.roundStatus = this.state;
        data.curPlayIndex = this.nextPlayer;
        data.actionTimer = this.actionTimer;
        data.roomBet = this.roomBet;
        data.survivalInfo = this.survivalZD;
        data.destroyInfo = {
            playerIndex:this.destroyIndex,
            destroyTime:this.destroyTime,
            duration:Enum.ROOM_VOID_TIME * 1000
        };
        return data
    }

    onRoomPlayerReady(player){
        player.clearAutoPlayer();
    }

    isCanStart(){
        if(this.playing === false && this.getReadyPlayerNum() >= this.getMaxPlayerNum()){
            return true;
        }else{
            return false;
        }
    }
    // onPlayerReconnect(uid, wsConn){
    //     let player = this.getPlayerByUid(uid);
    //     player.setNewConn(wsConn);
    //     let roomInfo = this.getRoomInfo();
    //     roomInfo.players = this.getPlayerInfo(uid);
    //     player.sendMsg(CSProto.ProtoID.CLIENT_GAME_JOIN_ROOM,{roomInfo : roomInfo, reconnect:true});
    //     return true;
    // }

    /**
     * 测试发牌
     * @returns {{playerCards: number[][], bCard: Array}}
     */
    testGenCard () {
        let playerCards = [
            [103,203,303,403,104,204,304,404,105,205,305,405,106,206,306,406],
            [201,301,413,111,310,109,209,409,407,106,406,108,308,408,104,204],
            [113,213,313,312,412,211,311,210,410,309,207,205,305,405,304,203]
        ];
        let bCard = [];
        return {playerCards: playerCards, bCard: bCard};
    }

    genCard(){
        let originCards = [];
        // 黑红梅方
        for (let iType = 1; iType <= 4; ++iType) {
            for(let iNumber = 3; iNumber <= 13; iNumber++){
                originCards.push(iType * 100 + iNumber);
            }
        }
        let cLen = 0;
        if(this.subType == 1){
            originCards.push(102);          // 黑桃2
            originCards.push(201);          // 红桃A
            originCards.push(301);          // 梅花A
            originCards.push(401);          // 方块A
            cLen = 16;
        }else if(this.subType == 2){        // 黑红梅方 A和2全部加上
            for (let iType = 1; iType <= 4; ++iType) {
                for(let iNumber = 1; iNumber <= 2; iNumber++){
                    originCards.push(iType * 100 + iNumber);
                }
            }
            cLen = 13;
        }
        let playerCards = [];
        for(let playerIndex = 0; playerIndex < this.playNum; playerIndex++){
            playerCards[playerIndex] = [];
            for(let cardIdx = 0; cardIdx < cLen; cardIdx++){
                let iRandom = Math.floor(Math.random() * originCards.length);
                let card = originCards[iRandom];
                originCards.splice(iRandom, 1);
                playerCards[playerIndex].push(card);
            }
        }
        return {playerCards};
    }

    getMaxDiff(){
        let maxDiff = 0;
        let fina = null;
        let loopNum = Math.min(this.robotLv, 100);
        for(let loop = 0; loop < loopNum; loop++){
            let tempData = this.genCard();
            let array = [];
            for(let i = 0; i < 3; i++) {
                let data = this.ai.getPaiScore(tempData.playerCards[i]);
                let score = Enum.shouPaiValue[data.shou] + data.value;
                array.push(score);
            }
            array.sort();
            let diff = Math.abs(array[2] - array[0]);
            if(diff > maxDiff){
                maxDiff = diff;
                fina = tempData;
            }
        }
        return fina;
    }

    /**
     * 获取数据
     * @param needCards
     */
    getBigSmallArr(needCards){
        let obj = [];
        for(let idx in needCards){
            let cards = needCards[idx];
            let data = this.ai.getPaiScore(cards);
            let score = Enum.shouPaiValue[data.shou] + data.value;
            obj.push({paiIndex:+idx, score:score});
        }
        obj.sort(CommFuc.compare('score'));
        let newArr = [];
        for(let idx in obj){
            newArr.push(obj[idx].paiIndex);
        }
        return newArr;
    }
    /**
     * 根据幸运值计算牌型
     * @param playerCards
     */
    calcLuck(playerCards) {
        let pais = this.getBigSmallArr(playerCards);
        let temps = [];
        for(let idx in this.players){
            let player = this.players[idx];
            let luck = player.luck;
            temps.push({luck:luck, playerIndex: +idx});
        }
        temps.sort(CommFuc.compare('luck'));
        let lucks = [];
        let ps = [];
        for(let idx in temps){
            lucks.push(temps[idx].luck);
            ps.push(temps[idx].playerIndex);
        }
        let newArray = [];
        let finaCards = CommFuc.allotByLuck(pais, lucks);
        let maxScore = 0;
        for(let idx in ps){
            let playerIndex = ps[idx];
            newArray[playerIndex - 1] = playerCards[finaCards[idx]];
            let data = this.ai.getPaiScore(newArray[playerIndex - 1]);
            let score = Enum.shouPaiValue[data.shou] + data.value;
            if(score > maxScore){
                maxScore = score;
                this.robotQ = playerIndex;
            }
        }
        return newArray;
    }

    setNextPlayer(playerIndex) {
        return playerIndex % this.playNum + 1;
    }

    /**
     *  计算庄
     */
    calcDealer(cardsArray) {
        for(let i = 0; i < cardsArray.length; i++){
            let cards = cardsArray[i];
            if(cards.indexOf(103) >= 0){
                this.dealer = i + 1;
            }
        }
    }

    /**
     * 结算时间
     * @param player
     */
    autoTime(player){
        if(player.isT){
            return Enum.CANCELHOSTED * 1000;
        }
        if(player.isRobot()){
            return Enum.rebotAutoGrabTime * 1000;
        }
        if(player.cueTbl.length == 0){
            return Enum.noRise[this.mode] * 1000;
        }else {
            if(this.prePlayer == 0){
                return Enum.firstPlayTime[this.mode] * 1000;
            }else{
                return Enum.autoPlayTime[this.mode] * 1000;
            }
        }
    }

    // 玩家提示
    onPlayerCue(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(this.nextPlayer != playerIndex){
            return;
        }
        if(player.cueTbl.length == 0){
            player.cueTbl = this.genCue(playerIndex);
            player.curCueIdx = 0;
        }
        if(player.cueTbl.length > 0){
            let sub = player.cueTbl[player.curCueIdx % player.cueTbl.length];
            player.curCueIdx++;
            player.sendMsg(ProtoID.CLIENT_GAME_CUE_PDK,sub);
        }
    }
    /**
     * 开始新一轮
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        let tempData = this.genCard();
        this.state = Enum.GameState.PLAY;
        if(this.hasRoboot()){
            let fina = this.getMaxDiff();
            if(fina){
                tempData = fina;
            }
        }
        // tempData.playerCards = this.calcLuck(tempData.playerCards);
        // tempData = this.testGenCard();  // 测试发牌
        CommFuc.cardSort(tempData.playerCards);


        this.calcDealer(tempData.playerCards);
        this.reset();
        this.enumPlayingPlayers((eIndex, ePlayer)=>{
            ePlayer.reset();
            let consume = -1;
            if(!ePlayer.serverCostTip[this.matchId] && !ePlayer.isRobot()){
                consume = this.serverCost;
                ePlayer.serverCostTip[this.matchId] = 1;
                GameMgr.playInfo[ePlayer.uid].serverCostTip[this.matchId] = 1;
            }
            ePlayer.clearAutoPlayer();
            ePlayer.sendMsg(ProtoID.GAME_CLIENT_NEW_ROUND_PDK, {curRound:this.curRound,gPlaying:this.gPlaying, roundId: this.roundId,consume});
            let cards = tempData.playerCards[+eIndex - 1];
            ePlayer.handCards.addCards(cards);
            ePlayer.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_PDK, {playerIndex: +eIndex, cards: cards});
        })

        this.nextPlayer = this.dealer;
        let player = this.getPlayerByIndex(this.dealer);
        let doShape = this.setNextShape(player);
        this.broadcastMsg(ProtoID.GAME_CLIENT_DEALER, {dealer:this.dealer});
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_POS_CHANGE_PDK, {playerIndex: this.dealer, isCan : true});
        if(doShape) {
            let time = this.autoTime(player);
            this.setActionTimer(ActionType.PDK_PLAY,Enum.ActionTime.PLAY,[this.dealer]);
            player.setAutoFun(this.doPlay, [this.dealer, doShape]);
            player.scheJob = setTimeout(() => {
                this.doPlay(this.dealer, doShape, false);
            }, time);
        }
    }
    /**
     * 玩家出牌
     */
    onPlayerReqPlay(uid,cards) {
        let playerIndex = this.getPlayerIndex(uid);
        if(this.nextPlayer != playerIndex){
            ERROR("没有轮到该玩家出牌.. " + playerIndex);
            return;
        }
        let player = this.players[playerIndex];
        for(let idx in cards){
            let card = cards[idx];
            if(!player.handCards.contains(card)){
                ERROR("找不到指定牌" + card + "玩家手里的牌: " + JSON.stringify(player.handCards.cards));
                return;
            }
        }
        let ret = this.judgeCards(cards, player);
        if(typeof(ret) == "number"){
            ERROR("请求出牌错误:" + "上家牌型:" + JSON.stringify(this.preShape) + "本次牌型: " + JSON.stringify(cards));
            player.sendMsg(ProtoID.CLIENT_GAME_DO_PLAY_PDK,{playerIndex,result:ret});
            return;
        }

        this.doPlay(playerIndex, ret, true);
    }

    /**
     * 玩家出牌
     * doShape = {type:xx, subType: xx, num:xx, power:xx, cards:[x,x,x]}
     */
    doPlay(playerIndex, doShape, req) {
        let curShape = clone(doShape);
        let isFollow = true;
        if(this.preShape == null){
            isFollow = false;
        }
        curShape.isFollow = isFollow;
        let player = this.players[playerIndex];
        let cards = curShape.cards;
        player.doCard = Enum.doCard.PLAY;
        if (curShape.type == Enum.shape.ZD) {
            if(curShape.power === 15){
                player.zdRate += Enum.ZD_MUIT[this.setMut].spe2;
            }else{
                player.zdRate += Enum.ZD_MUIT[this.setMut].normal;
            }
            player.taskParams.boomNum++;
            this.isBomb = true;
            player.zdCount++;
            this.broadcastMsg(ProtoID.GAME_CLIENT_ZD_COUNT_CHANGE,{zdCount:player.zdCount, playerIndex:player.index});
            if(this.preShape && this.preShape.type === Enum.shape.ZD && this.preShape != 0){
                let prePlayer = this.getPlayerByIndex(this.prePlayer);
                if(this.preShape.power === 15) {
                    prePlayer.zdRate -= Enum.ZD_MUIT[this.setMut].spe2;
                }else{
                    prePlayer.zdRate -= Enum.ZD_MUIT[this.setMut].normal;
                }
                prePlayer.zdCount--;
                this.broadcastMsg(ProtoID.GAME_CLIENT_ZD_COUNT_CHANGE,{zdCount:prePlayer.zdCount,playerIndex:this.prePlayer});
            }
        }

        this.prePlayer = playerIndex;
        player.clearAutoPlayer();
        player.handCards.delCards(cards);
        this.preShape = clone(curShape);
        curShape.playerIndex = playerIndex;
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PLAY_PDK,curShape);
        if (player.handCards.isEmpty()) {
            player.taskParams.win = true;
            this.onSettement(playerIndex);
            return;
        }

        player.cueTbl = [];
        player.curCueIdx = 0;
        this.nextPlayer = this.setNextPlayer(playerIndex);
        let nextPlayer = this.players[this.nextPlayer];


        let nextDoShape = this.setNextShape(nextPlayer);

        let isCan = nextDoShape ? true : false;
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_POS_CHANGE_PDK, {playerIndex: this.nextPlayer, isCan});
        let time = this.autoTime(nextPlayer);
        this.setActionTimer(ActionType.PDK_PLAY,time,[this.nextPlayer]);
        nextPlayer.doCard = Enum.doCard.PLAY;
        if(nextDoShape){
            nextPlayer.setAutoFun(this.doPlay, [nextPlayer.index, nextDoShape]);
            nextPlayer.scheJob = setTimeout(function () {
                this.doPlay(nextPlayer.index, nextDoShape)
            }.bind(this), time);
        }else{
            nextPlayer.setAutoFun(this.doPass, [nextPlayer.index]);
            nextPlayer.scheJob = setTimeout(function () {
                this.doPass(nextPlayer.index)
            }.bind(this), time);
        }
        this.setAutoT(player, req);
    }

    /**
     * 设置下一个玩家的出牌
     */
    setNextShape(nextPlayer){
        let doShape = this.ai.selectPai(nextPlayer.handCards.cards);
        nextPlayer.cueTbl = this.genCue(this.nextPlayer);
        nextPlayer.curCueIdx = 0;
        let useCue = false;
        if(doShape){
            if(this.checkNextIsOne(nextPlayer) && doShape.type === Enum.shape.DAN){
                useCue = true;
            }
        }else{
            useCue = true;
        }
        if(useCue) {
            doShape = nextPlayer.cueTbl[nextPlayer.curCueIdx];
        }
        return doShape;
    }

    /**
     * 玩家过牌
     * @param uid
     */
    onPlayerReqPass(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        if(this.nextPlayer != playerIndex){
            ERROR("没有轮到该玩家出牌.. " + playerIndex);
            return;
        }
        if(this.prePlayer == playerIndex || this.prePlayer == 0){
            ERROR("不允许不走牌");
            return;
        }
        this.doPass(playerIndex, true);
    }
    /**
     * 弃牌
     * @param playerIndex
     */
    doPass(playerIndex,req){
        let player = this.players[playerIndex];
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PASS_PDK, {playerIndex});
        player.clearAutoPlayer();
        player.cueTbl = [];
        player.doCard = Enum.doCard.PASS;
        player.handCards.outCards = [];
        this.nextPlayer = this.setNextPlayer(playerIndex);
        let nextPlayer = this.players[this.nextPlayer];
        if(this.nextPlayer == this.prePlayer){
            if(this.preShape.type === Enum.shape.ZD){
                this.getSurvival();
                this.broadcastMsg(ProtoID.GAME_CLIENT_ZD_SUV, {survivalInfo: this.survivalZD});
            }
            this.preShape = null;
        }


        let nextDoShape = this.setNextShape(nextPlayer);

        let isCan = nextDoShape ? true : false;
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_POS_CHANGE_PDK, {playerIndex: this.nextPlayer, isCan});
        let time = this.autoTime(nextPlayer);
        this.setActionTimer(ActionType.PDK_PLAY,time,[this.nextPlayer]);
        nextPlayer.doCard = Enum.doCard.PLAY;
        if(nextDoShape){
            let doCards = nextDoShape.cards;
            nextPlayer.setAutoFun(this.doPlay, [nextPlayer.index, nextDoShape]);
            if((nextDoShape.type == Enum.shape.DAN || nextDoShape.type == Enum.shape.DUI || nextDoShape.type == Enum.shape.ZD) && doCards.length == nextPlayer.handCards.cards.length){
                time = 0;
            }
            nextPlayer.scheJob = setTimeout(function () {
                this.doPlay(nextPlayer.index, nextDoShape)
            }.bind(this), time);
        }else{
            nextPlayer.setAutoFun(this.doPass, [nextPlayer.index]);
            nextPlayer.scheJob = setTimeout(function () {
                this.doPass(nextPlayer.index)
            }.bind(this), time);
        }
        this.setAutoT(player, req);
    }

    /**
     * 获取存活炸弹
     */
    getSurvival(){
        let rate = 4;
        let power = this.preShape.power;
        if(power === 15) rate = 6;
        let sum = 0;
        for(let idx in this.players){
            if(this.prePlayer != idx){
                this.survivalZD[idx] -= rate * this.baseBean;
                sum += rate * this.baseBean;
            }
        }
        this.survivalZD[this.prePlayer] += sum;
    }
    /**
     * 选牌
     * @param uid
     * @param cards
     */
    selectCard(uid, cards) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        for(let idx in cards){
            let card = cards[idx];
            if(!player.handCards.contains(card)){
                ERROR("card is no exist");
                return;
            }
        }
        let selects = this.getSelectSet(cards);
        if(selects.length > 0){
            player.sendMsg(ProtoID.CLIENT_GAME_SELECT_CARDS_PDK, {cards: selects});
        }else{
            player.sendMsg(ProtoID.CLIENT_GAME_SELECT_CARDS_PDK, {cards: cards});
        }
    }

    /**
     * 筛选牌
     * @param cards
     */
    getSelectSet(cards) {
        let sets = {};
        let arr = this.getSelectArr(cards, 1, 5);
        let typeSets = this.getSLS(cards, arr, 1);
        if(typeSets.length != 0){
            sets.shun = typeSets;
        }
        arr = this.getSelectArr(cards, 2, 2);
        typeSets = this.getSLS(cards, arr, 2);
        if(typeSets.length != 0){
            sets.lianDui = typeSets;
        }
        arr = this.getSelectArr(cards, 3, 1);
        typeSets = this.getSLS(cards, arr, 3);
        if(typeSets.length != 0){
            let danDui = this.calcDanDui(cards, typeSets);
            let num = Math.floor(typeSets.length / 3);
            if(danDui == Enum.subShape.NONE){
                sets.san = typeSets;
            }else {
                let genCards = this.getBestCards(cards, typeSets, num, danDui);
                if (genCards) {
                    typeSets.push.apply(typeSets, genCards);
                    sets.san = typeSets;
                }
            }
        }
        if(Object.keys(sets).length > 0) {
            let max = 0;
            let rType = "";
            for (let type in sets) {
                let len = sets[type].length;
                if (len > max) {
                    max = len;
                    rType = type;
                }
            }
            return sets[rType];
        }else{
            return [];
        }
    }

    /**
     * 选牌的公共函数(获取满足条件的选牌集合)
     * @returns {*}
     */
    getSelectArr(cards, paiCount, loopNum) {
        let list = this.cardsConv(cards);
        list[13] = list[0];
        let value1 = this.getSelectArr_sub(list, paiCount, loopNum, true);
        let value2 = this.getSelectArr_sub(list, paiCount, loopNum, false);
        return value1.length != 0 ? value1 : value2;
    }

    getSelectArr_sub(list,paiCount, loopNum, self){
        let arr = [];
        let start = 0;
        let end = 13;
        if(!self){
            start = 1;
            end = 14;
        }

        if(paiCount == 3){
            end = 15;
            list[14] = list[1];
        }
        for(let i = start; i < end; i++){
            let loop = 0;
            let startIdx = 0;
            if(list[i] >= paiCount){
                startIdx = i;
                let k = i;
                while(list[k + loop] >= paiCount){
                    loop++;
                }
            }
            if(paiCount == 3 && loop == 1){
                if(list[i] == 4){
                    continue;
                }
            }
            if(loop >= loopNum){
                arr.push({startCard: startIdx + 1, num: loop});
            }
        }
        return arr;
    }

    /**
     * 获取 顺 连 三代
     */
    getSLS(cards, arr, type) {
        let data = [];
        if(arr.length == 0){
            return data;
        }
        let nArr = this.getMaxLoop(arr);
        let startCard = nArr.startCard;
        let loopNum = nArr.num;
        for(let loop = 0; loop < loopNum; loop++){
            let pai = startCard + loop;
            if(pai == 14){
                pai = 1;
            }else if(pai == 15){
                pai = 2;
            }
            pai = this.getPaiCount(cards, pai, type);
            let len = pai.length;
            for(let idx = 0; idx < len; idx++){
                data.push(pai[idx]);
            }
        }
        return data;
    }

    /**
     * 计算使用单牌 还是 对牌
     */
    calcDanDui(cards, sets){
        let backCards = this.removeCards(cards, sets);
        let backList = this.cardsConv(backCards);
        let danNum = 0, duiNum = 0;
        let sLen = sets.length;
        let cLen = cards.length;
        let minNum = Math.floor(sLen / 3);
        for(let idx = 0; idx < 13; idx++){
            let count = backList[idx];
            if(count > 0) {
                if (count == 1) {
                    danNum++;
                } else {
                    duiNum++;
                }
            }
        }
        if(cLen - sLen < minNum){
            return Enum.subShape.NONE;
        }
        if(danNum >= minNum){
            return Enum.subShape.DAN;
        }
        if(duiNum > danNum && duiNum >= minNum){
            return Enum.subShape.DUI;
        }else{
            return Enum.subShape.DAN;
        }
    }

    /**
     * 获取最大集合
     */
    getMaxLoop(arr) {
        if(arr.length == 1){
            return arr[0];
        }else{
            let max = 0;
            let tt = 0;
            for(let idx in arr){
                let num = arr[idx].num;
                if(num > max){
                    tt = idx;
                    max = num;
                }
            }
            return arr[tt];
        }
    }

    /**
     * 根据剩余牌计算要扣的金豆
     * @param player
     * @param winIdx
     * @returns {number}
     */
    plusCardDeleteBean(player, winIdx){
        let len = player.handCards.cards.length;
        if(len === 1){
            player.only = true;
        }
        let cfg = Enum.ROOM_BILL_BEAN[this.setMut] ? Enum.ROOM_BILL_BEAN[this.setMut][this.subType] : Enum.ROOM_BILL_BEAN[1][this.subType];
        let winPlayer = this.getPlayerByIndex(winIdx);
        if(cfg){
            let keys = Object.keys(cfg);
            for(let i = 0; i < keys.length; i++){
                let maxCard = +keys[i];
                let rate = cfg[maxCard];
                if(len <= maxCard){
                    if(i === keys.length - 1){                  // 大关
                        winPlayer.taskParams.bigShut++;
                        player.bigShut = true;
                    }else if(i === keys.length - 2){            // 小关
                        winPlayer.taskParams.smallShut++;
                        player.smallShut = true;
                    }

                    return this.baseBean * rate;
                }
            }
        }
        return 0;
    }

    /**
     * 结算炸弹
     */
    billBoom(){
        let zdBean = {};
        for(let idx in this.players){
            zdBean[idx] = 0;
        }

        for(let idx in this.players){
            let player = this.players[idx];
            if(player.zdRate > 0){
                let allAdd = 0;
                for(let oIdx in this.players){
                    if(idx != oIdx) {
                        let bean = player.zdRate * this.baseBean;;
                        zdBean[oIdx] -= bean;
                        allAdd += bean;
                    }
                }
                zdBean[idx] += allAdd;
            }
        }
        return zdBean;
    }
    /**
     * 分数结算
     */
    billBean(winIdx) {
        let zdBean = this.billBoom();
        let settBeans = clone(zdBean);
        let allBean = 0;
        for(let idx in this.players){
            let player = this.players[idx];
            if(idx != winIdx){
                let delbean = this.plusCardDeleteBean(player, winIdx);
                settBeans[idx] -= delbean;
                player.failCount++;
                allBean += delbean;
            }
        }
        settBeans[winIdx] += allBean;
        this.calcOverflow(settBeans);
        let winPlayer = this.players[winIdx];
        winPlayer.winCount++;


        for(let idx in this.players){
            let player = this.players[idx];
            let bean = settBeans[idx];
            player.updateCoin(1, bean, eventType.MATCH);
            player.taskParams.winLoseBean = bean;
            if(bean > 0){
                this.displayNotice(player, bean);
            }
            this.checkTask(player);
            let luck = bean > 0 ? -2 : 1;
            player.updateLuck(luck);
            player.roundBean = bean;
        }
        return settBeans;
    }

    /**
     * 计算溢出
     * @param data
     */
    calcOverflow(data){
        let addIdx = 0;
        let delNum = 0;
        let roomMaxBean = this.maxBean - this.serverCost;
        for(let idx in data){
            let sum = Math.abs(data[idx]);
            let player = this.getPlayerByIndex(idx);
            let maxBean = Math.min(player.bean, roomMaxBean);
            if(data[idx] < 0 && sum > maxBean){
                data[idx] = -maxBean;
                delNum += sum - maxBean;
            }
            if(data[idx] > 0) addIdx = +idx;
        }
        if(data[addIdx] && delNum != 0){
            data[addIdx] = data[addIdx] - delNum;
        }
    }
    /**
     * 插播消息
     */
    displayNotice(player, bean) {
        if(bean >= this.baseBean * Enum.NOTICE_MAX_BET){
            let data = GameMgr.getInsertMsg(this.gameType, this.subType);
            let wBean = CommFuc.wBean(bean);
            GameMgr.noticeInsertNotice(`恭喜玩家${player.name}在【${data.gameTypeMsg}】【${data.subTypeMsg}】中赢得了${wBean}万SEER`);
        }
    }

    /**
     * 结算
     * @param playerIndex
     */
    onSettement(playerIndex){
        let data = {};
        data.multiple = this.roomBet;
        data.baseBean = this.baseBean;
        data.lordIndex = this.farmer;
        data.curRound = this.curRound;
        data.round = this.round;
        data.subType = this.subType;
        data.creator = this.creator;
        data.roundId = this.roundId;
        data.endTime = Date.getStamp();
        let beanInfo = this.billBean(playerIndex);
        this.updateResources();
        data.players = {};
        for(let idx in this.players){
            let player = this.players[idx];
            let settlement = player.getSettementInfo();
            data.players[idx] = settlement;
            player.updateWatchScore();
            player.endReset();
            if(!player.isRobot() && this.mode === "FK") {
                ERROR("结束设置了准备事件");
                this.setReadyEvent(player.index, Enum.READY_SECOND[this.mode]);
            }
        }
        let finalRound = false;
        // if(this.mode === "FK")this.recordDetails(beanInfo);
        if(this.mode === "FK" && this.curRound >= this.round){
            this.waitEnd = true;
            this.gPlaying = false;
            this.gameOver = true;
            finalRound = true;
            this.saveReportsToMiddle();
            this.recordZZJ = true;
        }
        data.finalRound = finalRound;
        this.broadcastMsg(ProtoID.GAME_CLIENT_SETTLEMENT_INFO_PDK, data);
        //if(this.mode == "JB") {
            this.saveRoundIdToMySql(beanInfo);
            this.saveReportsToMiddle();
            this.gameOver = true;
        //}
        // if(this.curRound === 1 && this.mode === "FK"){
        //     this.DelFK();
        // }
        this.endReset();
    }

    /**
     * 记录详情
     */
    recordDetails(beanInfo){
        let data = {};
        data.dealer = this.players[this.dealer].uid;
        for(let idx in this.players){
            let player = this.players[idx];
            data[idx] = {};
            data[idx].score = beanInfo[idx];
            data[idx].name = player.name;
            data[idx].uid = player.uid;
        }
        this.details[this.curRound] = data;
    }

    /**
     * 保存战报
     */
    saveReportsToMiddle() {
        let data = {};
        data.roundId = this.roundId;
        data.gameType = this.gameType;
        data.players = [];
        data.mode = this.mode;
        data.dealer = this.dealer;
        data.creator = this.creator;
        data.curRound = this.curRound;
        data.roomId = this.roomId;
        for(let idx in this.players){
            let player = this.players[idx];
            data.players.push(player.getPlayerReportInfo())
        }
        data.time = new Date().getTime();
        data.dealer = this.dealer;
        GameMgr.savePlayerReport(data);
    }

    /**
     * 托管
     * @param uid
     * @param isT
     */
    onPlayerHosted(uid, isT) {
        if(!this.playing) return false;
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        player.isT = isT;
        clearTimeout(player.scheJob);
        player.scheJob = null;
        let sTime = isT ? 0 : Enum.CANCELHOSTED;
        if(player.autoFun){
            sameCall(sTime,player);
        }
        if(!isT && playerIndex == this.nextPlayer) {
            let time = this.autoTime(player);
            let action = ActionType.PDK_PLAY;
            this.setActionTimer(action,time,[player.index]);
        }
        function sameCall(sTime,player) {
            if(player.autoFun == player.owner.doPlay){
                if (player.autoParam[0] != null && player.autoParam[1] != null) {
                    player.scheJob = setTimeout(function () {
                        player.owner.doPlay(player.autoParam[0], player.autoParam[1]);
                    }.bind(player), sTime * 1000)
                }
            }else if(player.autoFun == player.owner.doPass){
                player.scheJob = setTimeout(function () {
                    player.owner.doPass(player.autoParam[0]);
                }.bind(player), sTime*1000)
            }
        }
        this.broadcastMsg(ProtoID.CLIENT_GAME_TG_PDK,{playerIndex,isT})
    }


    // 对玩家出过来的牌进行判断
    judgeCards(cards, player) {
        let selfCards = player.handCards.cards;
        if(selfCards.indexOf(103) >= 0 && cards.indexOf(103) === -1){
            return ProtoState.STATE_GAME_TYPE_ERROR;
        }
        if(this.outCardCheckNextPlayer(player,cards) === false){
            return ProtoState.STATE_GAME_TYPE_ERROR;
        }
        let pai = this.getCombination(cards);
        // console.log(pai)
        if(!pai){
            ERROR("不能组成合适的牌型" + JSON.stringify(cards));
            return ProtoState.STATE_GAME_TYPE_ERROR;
        }
        if(!this.preShape){return pai}
        let preType = this.preShape.type;
        let preSubType = this.preShape.subType;
        let preNum = this.preShape.num;
        let prePower = this.preShape.power;
        let preLen = this.preShape.cards.length;

        let curType = pai.type;
        let curSubType = pai.subType;
        let curNum = pai.num;
        let curPower = pai.power;
        let curLen = pai.cards.length;

        if(preType == Enum.shape.ZD){
            if(curType != Enum.shape.ZD){
                return ProtoState.STATE_GAME_TYPE_ERROR;                // 牌型不对
            }else{
                if(prePower >= curPower){
                    return ProtoState.STATE_GAME_CARD_SMALL;            // 比上家牌小
                }else{
                    return pai;
                }
            }
        }else{
            if(curType == Enum.shape.ZD){
                return pai;
            }else{
                if(preNum != curNum || preSubType != curSubType || preLen !== curLen){
                    return ProtoState.STATE_GAME_TYPE_ERROR;
                }else{
                    if(prePower >= curPower){
                        return ProtoState.STATE_GAME_CARD_SMALL;
                    }else{
                        return pai;
                    }
                }
            }
        }
    }
    /**
     * 玩家选牌出牌 入口函数
     * @param cards
     * @returns {Array}
     */
    genCue(playerIndex) {
        let player = this.players[playerIndex];
        let cards = player.handCards.cards;
        let cue = [];
        if (this.preShape == null) {
            if (cards.indexOf(103) >= 0) {
                return this.Out103(cards);
            }
            let paiInfo = this.getCombination(cards);
            if (paiInfo) {
                cue.push(paiInfo)
            }
            let danSet = this.getDanSet(cards);
            for (let idx in danSet) {
                cue.push(danSet[idx]);
            }
        } else {
            let AllBomb = this.getAllBomb(cards);
            let allSameType = this.getAllSameTypeCard(cards);
            for (let idx in allSameType) {
                cue.push(allSameType[idx]);
            }
            for (let idx in AllBomb) {
                cue.push(AllBomb[idx]);
            }
        }
        this.checkNextPlayer(playerIndex, cue);
        return cue;
    }

    /**
     * 检测当前玩家的下一个玩家是否只有一张牌， 只有一张牌单牌只能从最大的牌开始出
     * @param playerIndex
     * @param cue
     */
    checkNextPlayer(playerIndex, cue){
        let nIndex = this.setNextPlayer(playerIndex);
        let nPlayer = this.players[nIndex];
        if(nPlayer.handCards.cards.length === 1){
            // let plusPower = this.getPower(nPlayer.handCards.cards[0] % 100 - 1);
            // let cLen = cue.length;
            // for(let i = cLen - 1; i >= 0; i--){
            //     let doShape = cue[i];
            //     if(doShape.type === Enum.shape.DAN){
            //         if(doShape.power < plusPower && this.preShape != null){
            //             cue.splice(i, 1);
            //         }
            //     }
            // }
            // 能提示的牌就一定能打得起 所以不需要判断剩余那张牌 只取最大即可
            let max = 0;
            let cLen = cue.length;
            for(let i = cLen - 1; i >= 0; i--){
                let doShape = cue[i];
                if(doShape.type === Enum.shape.DAN){
                    if(doShape.power > max){
                        max = doShape.power;
                    }
                }
            }
            if(max != 0){
                for(let i = cLen - 1; i >= 0; i--){
                    let doShape = cue[i];
                    if(doShape.type === Enum.shape.DAN){
                        if(doShape.power < max){
                            cue.splice(i, 1);
                        }
                    }
                }
            }
        }
    }
    /**
     * 自己出牌检测下一个玩家
     * @param player
     */
    outCardCheckNextPlayer(player, cards){
        if(this.checkNextIsOne(player)){
            if(cards.length === 1){
                let maxPower = this.getMaxPowerByCards(player.handCards.cards);
                let curPower = this.getPower(cards[0] % 100 - 1);
                if(maxPower != curPower){
                    return false;
                }
            }
        }
        return true;
    }
    // -----------辅助函数---------------------//
    /**
     * 获取最大的牌
     * @param cards
     */
    getMaxPowerByCards(cards){
        let len = cards.length;
        let maxPower = 0;
        for(let  i = 0; i < len; i++){
            let card = cards[i];
            let power = this.getPower(card % 100 - 1);
            if(power > maxPower){
                maxPower = power;
            }
        }
        return maxPower
    }
    /**
     * 转化为tab字典
     * @param cards
     * @returns {Array}
     */
    cardsConv(cards){
        let cpCards = CommFuc.copyArray(cards);
        let cardList = CommFuc.oneDimensionalArray(13, 0);
        for (let idx in cpCards) {
            let cardNum = cpCards[idx] % 100 - 1;
            cardList[cardNum]++;
        }
        return cardList;
    }
    /**
     * 获取牌的张数
     * @param cards
     * @param num
     * @returns {*}
     */
    get_card_Num(cards, num) {
        let cpCards = CommFuc.copyArray(cards);
        let list = this.cardsConv(cpCards);
        return list[num - 1];
    }

    /**
     * 获取威力
     * @param number
     * @returns {*}
     */
    getPower(number) {
        number = +number;
        if(number == 0){
            return 14;
        }else if(number == 1){
            return 15;
        }
        return number + 1;
    }

    /**
     * 获取牌
     * @param cards
     * @param pai
     * @param count
     * @returns {*}
     */
    getPaiCount(cards,pai,count) {
        let array = [];
        let num = 0;
        for(let idx in cards){
            if(cards[idx] % 100 == pai){
                array.push(cards[idx]);
                num++;
                if(num == count){
                    return array;
                }
            }
        }
        return null;
    }

    /**
     * 数组排序
     * @param tbl
     */
    arraySort (tbl) {
        for(let i = 0; i < tbl.length; i++){
            let k = i;
            for(let j = i + 1; j < tbl.length; ++j){
                if(tbl[k].power > tbl[j].power)
                    k = j;
            }
            if(k != i){
                let iTmp = tbl[k];
                tbl[k] = tbl[i];
                tbl[i] = iTmp;
            }
        }
    }

    /**
     * 获取对子组
     * @param cards
     * @param list
     * @param num
     * @param needMin
     * @param loopNum
     * @param subType
     * @returns {Array}
     */
    getFunTbl(cards,list,num,needMin,loopNum, subType) {
        let group = [];
        for (let i = needMin; i < 14; i++) {
            let data = this.addFun(cards, list, i, num, loopNum, subType);
            if (data) {
                let power = this.getPower(i + num - 1);
                group.push({type:this.preShape.type,subType:this.preShape.subType, num:num, power:power,cards:data});
            }
        }
        return group;
    }

    /**
     * 增加牌的公共函数
     * @param cards
     * @param list
     * @param starIdx
     * @param count
     * @param loopNum
     * @param subType
     * @returns {*}
     */
    addFun(cards,list, starIdx, count, loopNum, subType) {
        let pai = [];
        let tt = count;
        while (count > 0) {
            if(starIdx > 13){
                return null;
            }
            if(tt == 1 && list[starIdx] == 4){
                return null;
            }
            if (list[starIdx] < loopNum) {
                return null;
            } else {
                let temp = this.getPaiCount(cards, starIdx % 13 + 1, loopNum);
                for(let idx in temp){
                    pai.push(temp[idx]);
                }
            }
            starIdx++;
            count--;
        }
        if(subType != Enum.subShape.NONE){
            let genCards = this.getBestCards(cards,pai,tt,subType);
            if(!genCards){
                return null;
            }else{
                pai.push.apply(pai,genCards);
            }
        }
        return pai;
    }

    /**
     * 获取最优的跟牌
     */
    getBestCards(cards,pai,num,subType) {
        cards = this.getBestGen(cards,pai,num,subType);
        let array = [];
        if(cards){
            for(let i in cards){
                for(let j in cards[i]){
                    array.push(cards[i][j]);
                }
            }
            return array;
        }
        return null
    }

    /**
     * 获取最优牌 <这个一定是别人打过来的牌>
     * @param cards
     * @param pai
     * @param num
     * @param subType
     * @returns {*}
     */
    getBestGen(cards,pai,num,subType) {
        if(subType == Enum.subShape.NONE){
            return null;
        }
        let needNum = 2 * num;
        let backCards = this.removeCards(cards, pai);

        let backList = this.cardsConv(backCards);
        if(backCards.length < needNum){
            return null;
        }else if(backCards.length == needNum){
            if(subType == Enum.subShape.DUI){
                if(backList.length == 1){
                    return [backCards]
                }
            }else {
                if(subType == Enum.subShape.DUI) {
                    return [backCards];
                }
            }
        }
        let paiList = this.cardsConv(pai);
        let finaCards = [];
        let returnNum = subType === Enum.subShape.DUI ? num : num * 2;
        for(let zs = 1; zs <= 3; zs++) {
            let array = [];
            for (let idx in backList) {
                let count = backList[idx];
                let paiCount = paiList[idx];
                if(count + paiCount == 4){
                    continue;
                }
                if (count == zs && zs >= subType) {
                    let power = this.getPower(idx);
                    let brands = this.getPaiCount(backCards, +idx + 1, subType);
                    array.push({
                        power: power,
                        cards: brands
                    });
                }
            }
            let len = array.length;
            this.arraySort(array);
            for (let idx = 0; idx < len; idx++) {
                finaCards.push(array[idx].cards);
                if (finaCards.length == returnNum) {
                    return finaCards;
                }
            }
        }
        return null;
    }
    /**
     * 挑选牌
     * @param cards
     * @param pai
     */
    removeCards(cards, pai) {
        let pCards = CommFuc.copyArray(cards);
        let len = pai.length;
        for(let idx = 0; idx < len; idx++){
            let card = pai[idx];
            let pos = pCards.indexOf(card);
            if(pos > -1){
                pCards.splice(pos, 1);
            }else{
                return null;
            }
        }
        return pCards;
    }

    /**
     * 添加2的的牌型
     * @param cards
     * @param loopNum
     * @returns {*}
     */
    addTwoToGroup(cards,loopNum) {
        let list = this.cardsConv(cards);
        let loopC = list[1];
        let pai = [];
        if(loopC > 0){
            if(loopC - loopNum < 0){return null};
            // 添加卡牌
            let temp = this.getPaiCount(cards, 2,loopNum);
            if(this.preShape.subType != Enum.subShape.NONE) {
                let num = this.preShape.type == Enum.shape.SI_ER ? 2 : 1;
                let genCards = this.getBestCards(cards, temp, num, this.preShape.subType);
                if (!genCards) {
                    return null;
                } else {
                    temp.push.apply(temp, genCards);
                }
            }
            return {type:this.preShape.type, subType:this.preShape.subType, num:1, power:15, cards:temp};
        }
        return null;
    }

    /**
     * 删除特殊牌型
     * @param group
     * @returns {Array}
     */
    delSpeCards(group) {
        let newGroup = [];
        for(let idx in group){
            newGroup.push(group[idx])
        }
        return newGroup;
    }

    /**
     * 重新对对子进行整理
     * @param cards
     * @param group
     * @returns {Array}
     */
    againDui(cards, group) {
        let len = group.length;
        let array = [];
        if(len == 0){
            return array;
        }
        let list = this.cardsConv(cards);
        list[13] = list[0];
        list[14] = list[1];
        for(let zs = 2; zs < 4; zs++) {
            let tempArray = [];
            for (let idx = 0; idx < len; idx++) {
                let cardIdx = group[idx].power - 1;
                if(list[cardIdx] == zs){
                    tempArray.push(group[idx]);
                }
            }
            this.arraySort(tempArray);
            array.push.apply(array,tempArray);
        }
        return array;
    }
    //-----------------------------辅助函数end-----------------------

    /**
     * 将103替换上来
     * @param cards
     * @param paiInfo
     */
    replace103(paiInfo){
        if(paiInfo.indexOf(103) >= 0){
            return;
        }
        paiInfo.splice(0, 1);
        paiInfo.push(103);
    }
    /**
     * 第一次出牌必出带有黑桃三 提示只提示单牌和对牌
     * @param cards
     * @constructor
     */
    Out103(cards){
        let set = [];
        let list = this.cardsConv(cards);
        if(list[2] >= 1){
            set.push({type:Enum.shape.DAN,subType:Enum.subShape.NONE,num:1, power : 3,cards:[103]});
        }
        if(list[2] >= 2){
            let paiInfo = this.getPaiCount(cards, 3, 2);
            this.replace103(paiInfo);
            set.push({type:Enum.shape.DUI,subType:Enum.subShape.NONE,num:1, power : 3,cards:paiInfo});
        }
        if(list[2] >= 3){
            let paiInfo = this.getPaiCount(cards, 3, 3);
            this.replace103(paiInfo);
            set.push({type:Enum.shape.SAN_YI,subType:Enum.subShape.NONE,num:1, power : 3,cards:paiInfo});
        }
        if(list[2] === 4){
            let paiInfo = this.getPaiCount(cards, 3, 4);
            set.push({type:Enum.shape.ZD,subType:Enum.subShape.NONE,num:1, power : 3,cards:paiInfo});
        }
        return set;
    }
    /**
     * 获取牌型所有有可能的组合
     * @param playerIndex
     * @param cards
     * @returns {*}
     */
    getCombination(cards) {
        let zdInfo = this.getZDInfo(cards);
        if(zdInfo){return zdInfo};
        let oneInfo = this.getOneInfo(cards);
        if(oneInfo){return oneInfo;}
        let twoInfo = this.getTwoInfo(cards);
        if(twoInfo){return twoInfo;}
        let threeInfo = this.getThreeInfo(cards);
        if(threeInfo){return threeInfo;}
        let shunInfo = this.getShunInfo(cards);
        if(shunInfo){return shunInfo;}
        return null;
    }

    /**
     * 是否是炸弹
     * @param cards
     * @returns {*}
     */
    getZDInfo(cards) {
        if(cards.length != 4){
            return null;
        }
        let list = this.cardsConv(cards);
        if(cards.length == 4){
            for(let i = 0; i < 13; i++){
                if(list[i] == 4){
                    let power = this.getPower(i);
                    return {type:Enum.shape.ZD,subType:Enum.subShape.NONE,num:1, power : power,cards:[100+i+1,200+i+1,300+i+1,400+i+1]}
                }
            }
        }
        return null;
    }

    /**
     * 单牌组合
     * @param cards
     * @returns {*}
     */
    getOneInfo(cards) {
        if (cards.length == 1) {
            let number = cards[0] % 100 - 1;
            let power = this.getPower(number);
            return {type:Enum.shape.DAN,subType:Enum.subShape.NONE, num: 1, power: power, cards:cards}
        }
        return null;
    }

    /**
     * 对牌组合
     * @param cards
     * @returns {*}
     */
    getTwoInfo(cards) {
        if (cards.length % 2 != 0) {
            return null;
        }
        let dui_num = cards.length / 2;
        // 对2 组合
        if (cards.length == 2 && cards[0] % 100 == 2 && cards[1] % 100 == 2) {
            return {type:Enum.shape.DUI,subType:Enum.subShape.NONE, num: 1, power: 15, cards: cards}
        }
        // 其他组合
        let max = this.is_dui(cards);
        if (max > 0) {
            return {type: Enum.shape.DUI,subType:Enum.subShape.NONE, num:dui_num, power: max,cards:cards};
        } else {
            return null;
        }
    }

    /**
     * 是否对牌
     * @param cards
     * @returns {*}
     */
    is_dui(cards) {
        if (cards.length % 2 != 0) {
            return 0;
        }
        let list = this.cardsConv(cards);
        list[13] = list[0];
        let value1 = this.is_dui_sub(list, cards, true);
        let value2 = this.is_dui_sub(list, cards, false);
        if(value1 === 0 && value2 === 0){
            return 0;
        }else{
            return value1 != 0 ? value1 : value2;
        }
    }

    is_dui_sub(list, cards, self){
        if(cards.length === 2){
            self = false;
        }
        let start = 0;
        let end = 13;
        if(!self){
            start = 1;
            end = 14;
        }
        let set = [];
        for (let i = start; i < end; i++) {
            if (!(list[i] == 2 || list[i] == 0)) {
                return 0;
            }
            if (list[i] == 2) {
                set.push(i);
            }
        }
        let temp = set[0];
        let need = cards.length / 2;
        for (let idx = 0; idx < need; idx++) {
            if (set[idx] != temp++) {
                return 0;
            }
        }
        return temp;
    }

    /**
     * 获取三张牌信息
     * @param playerIndex
     * @param cards
     * @returns {*}
     */
    getThreeInfo(cards) {
        let list = this.cardsConv(cards);
        let san = 0,dui = 0,dan = 0;
        for(let idx = 0; idx < 13; idx++){
            let count = list[idx];
            if(count == 3){
                san++;
            }else if(count == 2){
                dui++;
            }else if(count == 1){
                dan++;
            }else if(count == 4){
                san++;
                dan++;
            }
        }
        if(san == 0){
            return null;
        }
        if(dan > 0 || dui > 0) {
            if (dan + dui * 2 !== san * 2) {
                return null;
            }
        }
        let subType = Enum.subShape.NONE;
        if(dan != 0 || dui != 0){
            subType = dan == san * 2 ? Enum.subShape.DAN : Enum.subShape.DUI;
        }
        if(subType == Enum.subShape.DUI){
            if(dui != san){
                return null;
            }
        }
        if (san == 1) {
            let _2Num = this.get_card_Num(cards, 2);
            if (_2Num == 3) {
                return {type: Enum.shape.SAN_YI,subType:subType, num: 1, power: 15, cards: cards};
            }
        }
        let power = this.isThree(cards, san);
        if (power > 0) {
            return {type: Enum.shape.SAN_YI,subType:subType,num: san, power: power,cards:cards};
        } else {
            return null;
        }
    }
    /**
     * 牌型判断是否能三连
     * @param cards
     * @returns {*}
     */
    isThree(cards, san) {
        let list = this.cardsConv(cards);
        list[13] = list[0];
        let value1 = this.isThree_sub(list, san, true);
        let value2 = this.isThree_sub(list, san, false);
        if(value1 === 0 && value2 === 0){
            return 0;
        }else{
            return value1 === 0 ? value2 : value1;
        }
    }

    /**
     * A当什么来使用
     * @param self
     */
    isThree_sub(list, san, self){
        if(san === 1){
            self = false;
        }
        let start = null;
        let end = null;
        let connectNum = 0;
        let set = [];
        if(self){
            start = 0;
            end = 13;
        }else{
            start = 1;
            end = 14;
        }
        for (let i = start; i < end; i++) {
            if (list[i] == 3) {
                set.push(i);
                connectNum++;
            }
        }
        if(connectNum != san){
            return 0;
        }
        let temp = set[0];
        for (let idx = 0; idx < connectNum; idx++) {
            if (set[idx] != temp++) {
                return 0;
            }
        }
        return temp;
    }
    /**
     * 顺牌判定
     * @param cards
     * @returns {*}
     */
    getShunInfo(cards) {
        let list = this.cardsConv(cards);
        for (let i = 0; i < 13; i++) {
            if (list[i] > 1) {            // 必须是单个的
                return null;
            }
        }
        let max = this.isShun(cards);
        if (max > 0) {
            return {type: Enum.shape.SHUN, subType:Enum.subShape.NONE, num: cards.length, power: max,cards:cards};
        } else {
            return null;
        }

    }
    /**
     * 是否顺
     * @param cards
     * @returns {*}
     */
    isShun(cards) {
        if (cards.length < 5) {
            return 0;
        }
        let list = this.cardsConv(cards);
        list[13] = list[0];
        let value1 = this.isShun_sub(list, cards,true);
        let value2 = this.isShun_sub(list, cards,false);
        if(value1 === 0 && value2 === 0){
            return 0;
        }else{
            return value1 != 0 ? value1 : value2;
        }
    }

    isShun_sub(list, cards, self){
        let start = 0;
        let end = 13;
        if(!self){
            start = 1;
            end = 14;
        }
        let set = [];
        for (let i = start; i < end; i++) {
            if (list[i] == 1) {
                set.push(i);
            }
        }
        let temp = set[0];
        for (let idx = 0; idx < cards.length; idx++) {
            if (set[idx] != temp++) {
                return 0;
            }
        }
        return temp;
    }
    /**
     * 获取单牌集合
     * @param cards
     * @returns {Array}
     */
    getDanSet (cards) {
        let prePower = this.preShape ? this.preShape.power : 0;
        let array = [];
        let list = this.cardsConv(cards);
        for(let zs = 1; zs <= 3; zs++) {
            let tempArray = [];
            for(let idx = 0; idx < 13; idx++) {
                if (list[idx] == zs) {
                    let power = this.getPower(idx);
                    let paiInfo = this.getPaiCount(cards, idx + 1, 1);
                    if (power > prePower) {
                        tempArray.push({
                            type: Enum.shape.DAN,
                            subType: Enum.subShape.NONE,
                            num: 1,
                            power: power,
                            cards: paiInfo
                        });
                    }
                }
            }
            this.arraySort(tempArray);
            array.push.apply(array,tempArray);
        }
        return array;
    }

    /**
     * 获取相同类型的炸弹
     * @param cards
     * @returns {Array}
     */
    getAllBomb(cards) {
        let prePower = 0;
        if(this.preShape && this.preShape.type == Enum.shape.ZD){
            prePower = this.preShape.power;
        }
        let bomd = [];
        let list = this.cardsConv(cards);
        for (let i = 0; i < 13; i++) {
            if (list[i] == 4) {
                let power = this.getPower(i);
                if(power > prePower) {
                    bomd.push({type: Enum.shape.ZD,subType:Enum.subShape.NONE, num: 1, power : power,cards: [100+i+1, 200+i+1, 300+i+1, 400+i+1]});
                }
            }
        }
        this.arraySort(bomd);
        return bomd;
    }

    /**
     * 获取所有同类型的牌
     * @param cards
     * @returns {*}
     */
    getAllSameTypeCard(cards) {
        let preType = this.preShape.type;
        if (preType == Enum.shape.DAN) {
            return this.getDanSet(cards);
        } else if (preType == Enum.shape.DUI) {
            return this.getSetByType(cards, 2);
        } else if (preType == Enum.shape.SAN_YI) {
            return this.getSetByType(cards, 3);
        } else if (preType == Enum.shape.SHUN) {
            return this.getSetByType(cards, 1);
        } else if(preType == Enum.shape.SI_ER){
            return this.getSetByType(cards, 4);
        }
        return [];
    }

    /**
     * 获取集合
     * @param cards
     * @param loopNum
     * @returns {*}
     */
    getSetByType(cards, loopNum) {
        let preType = this.preShape.type;
        let preSubType = this.preShape.subType;
        let prePower = this.preShape.power;
        let preNum = this.preShape.num;
        let needMin = (prePower - preNum + 1);
        let array = [];
        if(preType == Enum.shape.SI_ER){
            if(preNum != 1){return array;}
        }
        if(preNum == 1){
            if (prePower == 15){return array}
        }else{
            if(prePower == 14){return array}
        }
        let list = this.cardsConv(cards);
        list[13] = list[0];
        let group = this.getFunTbl(cards,list, preNum, needMin,loopNum, preSubType);
        if(preNum == 1){
            let tt = this.addTwoToGroup(cards,loopNum);
            if(tt){group.push(tt)}
        }
        let newGroup = this.delSpeCards(group);
        if(loopNum == 2 && preNum == 1){
            newGroup = this.againDui(cards, newGroup);
        }
        return newGroup;
    }

    /**
     * 获取牌面中最大的单牌
     */
    getPaiMaxDan(){
        let list = this.cardsConv(this.roomCardsed);
        let twoNum = this.subType === 1 ? 1 : 4;
        if(list[1] !== twoNum){                              // 2没有出完
            return 15;
        }
        if(list[0] !== 4){                                   // A没有出完
            return 14;
        }
        if(list[12] !== 4){                                  // K没有出完
            return 13;
        }
        // 剩下的按照经验不用判断了
        return 10000;
    }
    /**
     * 获取最大的对子牌
     */
    getPaiMaxDui(){
        let list = this.cardsConv(this.roomCardsed);
        if(list[1] <= 2 && this.subType === 2){        // 出的2少于或者等于2张
            return 15;
        }
        if(list[0] <= 2){                              // 出的A少于或者等于2张
            return 14;
        }
        if(list[12] <= 2){                             // 出的K少于或者等于2张
            return 13;
        }
        if(list[11] <= 2){                             // 出的Q少于或者等于2张
            return 12;
        }
        if(list[10] <= 2){                             // 出的J少于或者等于2张
            return 11;
        }
        // 剩下的按照经验不用判断了
        return 10000;
    }

    /**
     * 检测是否只剩一张牌
     * @param doShape
     * @param cards
     */
    checkNextIsOne(player){
        let nIndex = this.setNextPlayer(player.index);
        let nPlayer = this.players[nIndex];
        return nPlayer.handCards.cards.length <= 1;
    }
}

exports.Room = PDKRoom;
