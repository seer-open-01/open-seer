let util        = require("util");
let Enum        = require("./Enum.js");
let Player      = require("./Player.js").Player;
let ProtoID     = require("../../../net/CSProto.js").ProtoID;
let ProtoState  = require("../../../net/CSProto.js").ProtoState;
let CommFuc     = require("../../../util/CommonFuc.js");
let eventType   = require("../../../net/CSProto.js").eveIdType;
let ActionType  = require("../../../net/CSProto.js").ActionType;
let resEvent    = require("../../../net/CSProto.js").resEvent;
let AI          = require("./AI.js").AI;
let Room        = require("../../base/room");
///////////////////////////////////////////////////////////////////////////////
//>> 游戏房间
class DDZRoom extends Room {
    constructor(data){
        super(data);
        this.gameType = 2;                      // 游戏类型
        this.turns = 0;                         // 轮数
        this.curTurns = 0;                      // 当前轮
        this.state = Enum.GameState.READY;      // 状态
        this.publicCards = null;                // 公牌信息
        this.dealer = 0;                        // 当前庄家
        this.actionTimer = {action: ProtoState.READY}; // 当前动作信息
        this.firstGrabDZ = true;                // 第一次抢牌
        this.nextPlayer = 0;                    // 下一个玩家
        this.ai = new AI(this);                 // 初始化AI
        this.robotUid = 10;                     // 机器人开始uid
        this.gPlaying = false;                  // 是否开局
        this.waitEnd = false;                   // 等待点击总结算
        this.waitEndNum = 0;                    // 等待点击结束玩家数量
        this.recordZZJ = false;                 // 记录总战绩
        this.details = {};                      // 详情
        this.robotQ = 0;                        // 抢地主的机器人
    }
    /**
     * 初始化
     * @param data
     * @returns {boolean}
     */
    init(data) {
        super.init(data);
        for (let iPlayer = 1; iPlayer <= 3; ++iPlayer) {
            this.players[iPlayer] = new Player(this, iPlayer);
        }
        this.dealer = Math.floor(Math.random() * 3) + 1;
        return true;
    }


    /**
     * 获取房间的基本信息
     */
    getRoomBaseInfo() {
        let data = super.getRoomBaseInfo();

        data.gPlaying = this.gPlaying,
        data.lordIndex = this.farmer,
        data.curPlayIndex = this.nextPlayer,
        data.actionTimer = this.actionTimer,
        data.bCards = (this.state == Enum.GameState.DOUBLE || this.state == Enum.GameState.PLAY) ? this.bCard : [],
        data.roomBet= this.roomBet,
        data.isBomb = this.isBomb,
        data.robType = this.firstGrabDZ ? 1 : 2,
        data.actionTimer=this.actionTimer,
        data.destroyInfo={
            playerIndex:this.destroyIndex,
            destroyTime:this.destroyTime,
            duration:Enum.ROOM_VOID_TIME * 1000
        }
        return data;
    }

    /**
     * 生产炸弹数量
     */
    getBoomCount() {
        let num = 0;
        let value = Math.floor(Math.random() * 100) + 1;
        let cfg = Enum.boomConfig;
        for(let num in cfg){
            if(value <= cfg[num]){
                return +num;
            }
        }
        return 0;
    }
    /**
     * 生成牌
     * @returns {{playerCards: [*,*,*], bCard: [*,*,*]}}
     */
    genCard() {
        let originCards = [];
        for (let iType = 1; iType <= 4; ++iType) {
            for(let iNumber = 1; iNumber <= 13; iNumber++){
                originCards.push(iType * 100 + iNumber);
            }
        }
        originCards.push(514);
        originCards.push(614);
        if(this.subType == 1){
            let cards = [];
            while (originCards.length > 0) {
                let iRamdom = Math.floor(Math.random() * originCards.length);
                cards.push(originCards[iRamdom]);
                originCards.splice(iRamdom, 1);
            }
            let playerCards = CommFuc.twoDimensionalArray(3, 17, null);
            let getIndex = 0;
            for (let playIdx = 0; playIdx < 3; ++playIdx) {
                for (let numIdx = 0; numIdx < 17; ++numIdx) {
                    playerCards[playIdx][numIdx] = cards[getIndex++];
                }
            }
            let bCard = [cards[getIndex++], cards[getIndex++], cards[getIndex++]];
            return {playerCards: playerCards, bCard: bCard};
        }else if(this.subType == 2){
            let boomNum = this.getBoomCount();
            let boomValues = [];
            let normalBoomNum = boomNum;
            let rNum = Math.floor(Math.random() * 100);
            if (boomNum > 0) {
                if (rNum < 30) {
                    boomValues.push(14);
                    normalBoomNum--;
                }
            }
            while (normalBoomNum > 0) {
                let value = Math.floor(Math.random() * 13 + 1);
                if (boomValues.indexOf(value) == -1) {
                    boomValues.push(value);
                    normalBoomNum--;
                }
            }
            let playerCards = [[], [], []];
            let playerBooms = [[], [], []];
            let playerSwaps = [[], [], []];
            for (let idx in boomValues) {
                let boom = boomValues[idx];
                let rNum = Math.floor(Math.random() * 99) + 1;
                let cNum = 4;
                if(boom == 14){
                    cNum = 2;
                }
                let prob = this.getRandomNum(playerCards, cNum) == 2 ? 50 : 33;
                for (let playIdx = 0; playIdx < 3; playIdx++) {
                    if(playerCards[playIdx].length + cNum <=  17) {
                        if (rNum <= ((playIdx + 1) * prob)) {
                            if (boom != 14) {
                                for (let iType = 1; iType <= 4; iType++) {
                                    let card = boom + iType * 100;
                                    playerCards[playIdx].push(card);
                                    let pos = originCards.indexOf(card);
                                    originCards.splice(pos, 1);
                                }
                            } else {
                                for (let iType = 5; iType <= 6; iType++) {
                                    let card = boom + iType * 100;
                                    playerCards[playIdx].push(card);
                                    let pos = originCards.indexOf(card);
                                    originCards.splice(pos, 1);
                                }
                            }
                            playerBooms[playIdx].push(boom);
                            break;
                        }
                    }
                }
            }
            for (let playIdx = 0; playIdx < 3; playIdx++) {
                while (originCards.length > 3) {
                    let iRandom = Math.floor(Math.random() * originCards.length);
                    let card = originCards[iRandom];
                    playerCards[playIdx].push(card);
                    originCards.splice(iRandom, 1);
                    if (playerCards[playIdx].length == 17) {
                        break;
                    }
                }
            }
            for (let playIdx = 0; playIdx < 3; playIdx++) {
                let list = this.genPoints(playerCards[playIdx]);
                list.sort();
                for (let card = 1; card <= 13; card++) {
                    let num = CommFuc.numAtArrayCount(list, card);
                    if (num == 4 && playerBooms[playIdx].indexOf(card) == -1) {
                        playerSwaps[playIdx].push(card);
                    }
                }
                let num = CommFuc.numAtArrayCount(list, 14);
                if (num == 2 && playerBooms[playIdx].indexOf(14) == -1) {
                    playerSwaps[playIdx].push(14);
                }
            }
            for (let playIdx = 0; playIdx < 3; playIdx++) {
                let swapLen = playerSwaps[playIdx].length;
                for (let len = 0; len < swapLen; len++) {
                    let cardNum = playerSwaps[playIdx][len];
                    let card1 = this.getCardByPoint(playerCards[playIdx], cardNum);
                    let targetPlayer = this.getSwapPlayerIndex(playIdx);
                    let cards2 = this.removeBoomCard(playerCards[targetPlayer], playerBooms[targetPlayer]);
                    let card2 = this.getRandomCard(cards2, playerCards[playIdx]);
                    if(card2) {
                        this.swapCard(playerCards[playIdx], playerCards[targetPlayer], card1, card2);
                    }else{
                        targetPlayer = this.getSwapPlayerIndex(targetPlayer);
                        cards2 = this.removeBoomCard(playerCards[targetPlayer], playerBooms[targetPlayer]);
                        card2 = this.getRandomCard(cards2, playerCards[playIdx]);
                        this.swapCard(playerCards[playIdx], playerCards[targetPlayer], card1, card2);
                    }
                }
            }
            let bCard = [originCards[0], originCards[1], originCards[2]];
            return {playerCards: playerCards, bCard: bCard};
        }
    }
    /**
     * 牌型转化成点数
     * @param cards
     * @returns {Array}
     */
    genPoints(cards) {
        let list = [];
        for(let idx in cards){
            let point = cards[idx] % 100;
            list.push(point);
        }
        return list;
    }
    /**
     * 获取随机值
     * @returns {number}
     */
    getRandomNum(playerCards,cNum) {
        let count = 0;
        for(let idx in playerCards){
            if(playerCards[idx].length + cNum <= 17){
                count++;
            }
        }
        return count;
    }
    /**
     * 根据点数获取随机牌
     * @param point
     * @returns {*}
     */
    getCardByPoint(cards, cardNum) {
        for(let idx in cards){
            let tt = cards[idx];
            if(tt % 100 == cardNum){
                return tt;
            }
        }
    }
    /**
     * 获取要交换的玩家
     * @param playerIndex
     * @returns {number}
     */
    getSwapPlayerIndex(playerIndex) {
        if(playerIndex == 0){
            return 1;
        }else if(playerIndex == 1){
            return 2;
        }else if(playerIndex == 2){
            return 0;
        }
    }
    /**
     * 交换牌
     * @param cards1
     * @param cards2
     * @param pai1
     * @param pai2
     */
    swapCard(cards1, cards2, pai1, pai2) {
        let pos1 = cards1.indexOf(pai1);
        let pos2 = cards2.indexOf(pai2);
        cards1.splice(pos1, 1);
        cards2.splice(pos2, 1);
        cards1.push(pai2);
        cards2.push(pai1);
    }
    /**
     * 移除炸弹牌
     * @param cards
     * @param excludes
     * @returns {*|Array}
     */
    removeBoomCard(cards, excludes){
        let pCards = CommFuc.copyArray(cards);
        for(let idx in cards){
            let point = cards[idx] % 100;
            let pos = excludes.indexOf(point);
            if(pos >= 0){
                let pos1 = pCards.indexOf(cards[idx]);
                pCards.splice(pos1, 1);
            }
        }
        return pCards;
    }
    /**
     * 随机获取一张牌
     * @param cards
     * @param excludes
     * @returns {*}
     */
    getRandomCard(cards2, cards1) {
        let loopNum = 200;
        let list1 = this.genPoints(cards1);
        list1.sort();
        while(loopNum > 0){
            let iRandom = Math.floor(Math.random() * cards2.length);
            let pai2 = cards2[iRandom];
            let point2 = pai2 % 100;
            let count = CommFuc.numAtArrayCount(list1, point2);
            if(loopNum == 1){
                return pai2;
            }
            loopNum--;
            if(point2 == 14){
                if(count == 1){
                    if(cards2.length == 1){
                        return null;
                    }else{
                        cards2.splice(iRandom, 1)
                    }
                    continue;
                }
            }else{
                if(count == 3){
                    if(cards2.length == 1){
                        return null;
                    }else{
                        cards2.splice(iRandom, 1)
                    }
                    continue;
                }
            }
            return pai2;
        }
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
     * 测试发牌
     * @returns {{playerCards: [*,*,*], bCard: [number,number,number]}}
     */
    testGenCard() {
        // let playerCards = [
        //     [101,113,313,212,412,110,210,310,410,309,409,108,208,407,206,306,406],
        //     [514,201,301,213,413,112,111,211,311,411,109,209,308,107,207,407,106],
        //     [614,102,202,302,402,105,205,305,405,104,204,304,404,103,203,303,403,312,401,408],
        // ];
        let playerCards = [
                [514],
                [103,104,105,106,107,108,109,205,305],
                [614,102,202,302,402,105,205,514,405,104,204,304,404,103,203,303,403,312,401,408],
            ];
        let bCard = [];
        return {playerCards: playerCards, bCard: bCard};
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

    getMaxPlayerNum(){
        return 3;
    }
    /**
     * 游戏开始重置
     */
    startReset () {
        this.preShape = null;
        this.farmer = -1;
        this.playing = true;
        this.isSpring = true;
        this.isFSpring = true;
        this.FarmerNum = 0;
        this.grabInfo = [];           // 抢牌情况
        this.roomBet = 0;             // 房间倍数
        this.isBomb = false;          // 是否出过炸弹
        this.actionTimer = {action:ProtoState.READY};
        this.againGenCard = 0;        // 重新生成牌的次数
        this.gameOver = false;
        this.prePlayer = 0;            // 上一个出牌玩家
        this.resetDestory();           // 重置解散房间数据
        this.roomCardsed = [];         // 已经走过的牌
    }
    /**
     * 游戏结束重置的消息
     */
    endReset() {
        this.playing = false;
        this.state = Enum.GameState.READY;
        this.curRound += 1;
        if(this.curRound > this.round){
            this.curRound = this.round;
        }
    }
    /**
     * 判断是否存在机器人
     */
    hasRoboot(){
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.isRobot()){
                return true;
            }
        }
        return false;
    }
    /**
     * 获取最大的差异牌型
     */
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
     * 开始新一轮游戏
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        if(this.curRound == 1 && this.mode === "FK"){
            this.startTime = Date.getStamp();
        }
        this.gPlaying = true;
        let tempData = this.genCard();
        if(this.hasRoboot()){
            let fina = this.getMaxDiff();
            if(fina){
                tempData = fina;
            }
        }
        // tempData = this.testGenCard();
        CommFuc.cardSort(tempData.playerCards);
        this.bCard = tempData.bCard;
        // tempData.playerCards = this.calcLuck(tempData.playerCards);
        this.startReset();
        this.state = Enum.GameState.QIANG;

        this.enumPlayers(function (ePlayerIdx, ePlayer) {
            if (ePlayer.uid != 0) {
                if(!ePlayer.isRobot()) {
                    let consume = this.calcConsume(ePlayer);
                    ePlayer.clearAutoPlayer();
                    ePlayer.sendMsg(ProtoID.GAME_CLIENT_NEW_ROUND_DDZ, {curRound:this.curRound,gPlaying:this.gPlaying, roundId: this.roundId, consume:consume});
                }
            }
        }.bind(this));

        for(let idx in this.players){
            let player = this.players[idx];
            player.startReset();
            let cards = tempData.playerCards[+idx - 1];
            player.handCards.addCards(cards);
            player.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_DDZ, {playerIndex: +idx, cards: cards});
        }
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_ROB_LORD,{playerIndex:this.dealer});
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_GRAB,{playerIndex:this.dealer, type:this.firstGrabDZ ? 1 : 2});
        let player = this.players[this.dealer];
        this.nextPlayer = this.dealer;
        let time = this.autoTime(player);
        this.setActionTimer(ActionType.DDZ_QIANG,time,[this.dealer]);
        let grab = false;
        if(player.isRobot()){
            grab = this.calcRobotIsGrab(player);
        }
        player.setAutoFun(this.startGrab, [this.dealer, false]);
        player.scheJob = setTimeout(function () {
            this.startGrab(this.dealer, grab);
        }.bind(this),time);
    }
    /**
     * 计算机器人是否抢牌
     * @param player
     */
    calcRobotIsGrab(player) {
        let data = this.ai.getPaiScore(player.handCards.cards);
        if(this.robotQ === player.index){
            return true;
        }else{
            return Math.random() > 0.9;
        }
        // 这个是以前的 现在要保证 总是拿最好牌的机器人抢地主
        if(this.subType == 1){
            if(data.shou <= 7){
                return true;
            }
        }else if(this.subType == 2){
            if(data.shou <= 7){
                return true;
            }
        }
        return false;
    }

    /**
     * 结算
     */
    onSettement(playerIndex) {
        this.dealer = playerIndex;
        let player = this.players[playerIndex];
        let data = {};
        data.isSpring = this.isSpring || this.isFSpring;
        if(data.isSpring){
            this.roomBet *= 2;
            this.roomBet = Math.min(this.roomBet, this.opts.max);
            this.isBomb = true;
            player.taskParams.spring = true;
            this.broadcastMsg(ProtoID.GAME_CLIENT_BET_CHANG_DDZ,{multiple:this.roomBet});
        }
        data.multiple = this.roomBet;
        data.baseBean = this.baseBean;
        data.lordIndex = this.farmer;
        data.curRound = this.curRound;
        data.round = this.round;
        data.roundId = this.roundId;
        data.creator = this.creator;
        data.endTime = Date.getStamp();
        let beanInfo = this.billBean(playerIndex);
        super.onSettlement();
        data.players = {};
        for(let idx in this.players){
            let player = this.players[idx];
            let settlement = player.getSettementInfo();
            data.players[idx] = settlement;
            player.updateWatchScore();
            player.endReset();
            if(!player.isRobot() && this.mode === "FK") {
                ERROR("结束设置了准备事件");
                this.setReadyEvent(player.index, Enum.READY_SECOND[this.mode] * 1000);
            }
        }
        let finalRound = false;
        data.finalRound = finalRound;
        this.broadcastMsg(ProtoID.GAME_CLIENT_SETTLEMENT_INFO, data);
        this.saveRoundIdToMySql(beanInfo);
        this.saveReportsToMiddle();
        if (this.getRealPlayerNum() === 0) {
            this.destroyRoomImmd();
        }
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
            data[idx].dealer = this.players[this.farmer] ? this.players[this.farmer].uid : 0;
        }
        this.details[this.curRound] = data;
    }
    /**
     * 等待游戏结束
     * @param uid
     */
    gameEnd(uid) {
        if(!this.waitEnd){
            return;
        }
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player){
            this.onGameOver(player);
        }
    }

    /**
     * 游戏结束
     */
    onGameOver(player) {
        return;
        // 下面是以前的设计 暂时不用
        if(this.mode == "JB"){
            return;
        }
        this.gPlaying = false;
        this.gameOver = true;
        if(!this.recordZZJ) {
            this.saveReportsToMiddle();
            this.recordZZJ = true;
        }
        GameMgr.noticeStart(this.roomId, 2);
        // 总结算
        let playerInfo = {};
        this.enumPlayers(function (ePlayerIndex, ePlayer) {
            playerInfo[ePlayerIndex] = ePlayer.getSettementInfo(true);
        }.bind(this));
        // 广播结算信息
        if(player){
            player.sendMsg(ProtoID.CLIENT_GAME_GAME_END, {gameType:this.gameType,endTime:Date.getStamp(),curRound:this.curRound, playerInfo: playerInfo});
            this.waitEndNum++;
        }else {
            this.broadcastMsg(ProtoID.CLIENT_GAME_GAME_END, {gameType:this.gameType,endTime:Date.getStamp(),curRound: this.curRound, playerInfo: playerInfo});
            this.waitEndNum = 3;
        }
        if(this.waitEndNum >= 3) {
            // 销毁房间
            setTimeout(function () {
                this.enumPlayers(function (eNotUse, ePlayer) {
                    ePlayer.destroy();
                });
                this.removeAllPlayers();
                GameMgr.getSubGame(this.gameType).destroyRoom(this);
            }.bind(this), 300 * 1000);
        }
    }
    /**
     * 设置下一个出牌玩家
     * @param playerIndex
     * @returns {number}
     */
    setNextPlayer (playerIndex) {
        return playerIndex % 3 + 1;
    }
    /**
     * 设置下一个抢地主的玩家
     * @param playerIndex
     */
    setNextGrabPlayer(playerIndex) {
        let nextIndex = this.setNextPlayer(playerIndex);
        let player = this.players[nextIndex];
        if(player.firstGrab == 0){
            return nextIndex;
        }else if(player.firstGrab == 1 && player.secondGrab == 0){
            return nextIndex;
        }else if(player.firstGrab == 2){
            return this.setNextGrabPlayer(nextIndex);
        }
    }


    /**
     * 关闭服务器
     */
    shutdown() {
        if (this.curRound > 1) {
            this.onGameOver();
        } else {
            this.destroyRoomImmd();
        }
    }
    /**
     * 开始抢牌
     * @param playerIndex
     * @param ok
     */
    startGrab(playerIndex, ok) {
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        this.broadcastMsg(ProtoID.CLIENT_GAME_GRAB, {playerIndex: playerIndex, ok: ok, type:this.firstGrabDZ ? 1 : 2});
        if(this.firstGrabDZ) {
            player.callRob = Enum.callRob.CALL;
        }else{
            player.callRob = Enum.callRob.ROB;
        }
        if(ok){
            this.firstGrabDZ = false;
            this.roomBet++;
            this.broadcastMsg(ProtoID.GAME_CLIENT_BET_CHANG_DDZ,{multiple:this.roomBet});
        }
        this.grabInfo.push(ok);
        player.setGrab(ok);
        let farm = this.getFarmer();
        if(farm == 0){
            this.nextPlayer = this.setNextGrabPlayer(playerIndex);
            // ERROR("nextPlayerIndex :" + this.nextPlayer);
            let nextPlayer = this.players[this.nextPlayer];
            this.broadcastMsg(ProtoID.GAME_CLIENT_START_GRAB,{playerIndex:this.nextPlayer, type:this.firstGrabDZ ? 1 : 2});

            let time = this.autoTime(nextPlayer);
            this.setActionTimer(ActionType.DDZ_QIANG,time,[this.nextPlayer]);
            let grab = false;
            if(nextPlayer.isRobot()){
                grab = this.calcRobotIsGrab(nextPlayer);
            }
            nextPlayer.setAutoFun(this.startGrab, [this.nextPlayer, false]);
            nextPlayer.scheJob = setTimeout(function () {
                this.startGrab(this.nextPlayer, grab);
            }.bind(this),time);
        }else if(farm == -1){
            this.againGiveCard();
        }else{
            this.farmer = farm;
            this.startDouble();
        }
    }
    /**
     * 是否能抢牌
     * @returns {boolean}
     */
    getFarmer() {
        let len = this.grabInfo.length;
        if(len < 3){
            return 0;
        }
        let tempIndex = this.dealer;
        let noAgree = 0,agreeIndex = 0;
        for(let loop = 0; loop < 3; loop++){
            let player = this.players[tempIndex];
            if(player){
                if(player.firstGrab == 0){
                    return 0;
                }
                if(player.firstGrab == 1){
                    if(player.secondGrab == 1){
                        return tempIndex;
                    }else if(player.secondGrab == 2){
                        noAgree++;
                    }else{
                        agreeIndex = tempIndex;
                    }
                }else{
                    noAgree++;
                }
            }
            tempIndex = this.getNextPlayerIndex(tempIndex);
        }
        if(noAgree == 2){
            return agreeIndex;
        }else if(noAgree == 3){
            return -1;
        }
        return 0;
    }
    /**
     * 没人抢牌重新发牌
     */
    againGiveCard() {
        this.dealer = Math.floor(Math.random() * 3) + 1;
        this.nextPlayer = this.dealer;
        let tempData = this.genCard();
        CommFuc.cardSort(tempData.playerCards);
        this.bCard = tempData.bCard;
        this.state = Enum.GameState.QIANG;
        this.againGenCard++;
        for(let idx in this.players){
            let player = this.players[idx];
            player.startReset();
            let cards = tempData.playerCards[+idx - 1];
            player.handCards.addCards(cards);
            player.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_DDZ, {playerIndex: +idx, cards: cards});
            // if(player.isT){
            //     player.isT = false;
            //     this.broadcastMsg(ProtoID.CLIENT_GAME_TG_DDZ,{playerIndex:playerIndex,isT:false})
            // }
        }
        if(this.againGenCard < 2) {
            this.broadcastMsg(ProtoID.GAME_CLIENT_START_ROB_LORD, {playerIndex: this.dealer});
            this.broadcastMsg(ProtoID.GAME_CLIENT_START_GRAB, {
                playerIndex: this.dealer,
                type: this.firstGrabDZ ? 1 : 2
            });
            let player = this.players[this.dealer];
            this.roomBet = 0;
            let time = this.autoTime(player);
            this.setActionTimer(ActionType.DDZ_QIANG, time, [this.dealer]);
            player.setAutoFun(this.startGrab, [this.dealer, false]);
            player.scheJob = setTimeout(function () {
                this.startGrab(this.dealer, false);
            }.bind(this), time);
        }else{
            this.farmer = Math.floor(Math.random() * 3) + 1;
            this.startDouble();
            this.roomBet = 1;
            this.broadcastMsg(ProtoID.GAME_CLIENT_BET_CHANG_DDZ,{multiple:this.roomBet});
        }
    }
    /**
     *  开始加倍
     */
    startDouble(){
        let fp = this.players[this.farmer];
        fp.handCards.addCards(this.bCard);
        this.broadcastMsg(ProtoID.GAME_CLIENT_CONFIRM_FARM,{LordIndex:this.farmer, cards:this.bCard},[this.farmer]);
        fp.sendMsg(ProtoID.GAME_CLIENT_CONFIRM_FARM,{LordIndex:this.farmer, cards:this.bCard, handCards: fp.handCards.cards});
        this.state = Enum.GameState.DOUBLE;
        for(let idx in this.players){
            let player = this.players[idx];
            (function (player, room) {
                player.clearAutoPlayer();
                let time = room.autoTime(player);
                player.setAutoFun(room.onPlayerDouble, [player.index, false]);
                room.setActionTimer(ActionType.DDZ_DOUBLE, time, []);
                let double = false;
                if(player.isRobot()){
                    double = Math.random() > 0.5 ? true : false;
                }
                player.scheJob = setTimeout(function () {
                    room.onPlayerDouble(player.index, double);
                }.bind(room), time);
            })(player, this)
        }
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_DOUBLE, {});
    }
    /**
     * 加倍选择
     * @param index
     * @param double
     */
    onPlayerDouble(index, double){
        if(this.state != Enum.GameState.DOUBLE){
            return;
        }
        let player = this.players[index];
        if(player){
            if(double == 1){
                this.roomBet++;
                this.broadcastMsg(ProtoID.GAME_CLIENT_BET_CHANG_DDZ,{multiple:this.roomBet});
            }
            this.broadcastMsg(ProtoID.CLIENT_GAME_DOUBLE_DDZ,{playerIndex:index, double:double});
            player.setDouble(double);
            if(this.allPlayerDouble()){
                this.startGame();
            }
        }
    }
    /**
     * 所有人都加倍了
     */
    allPlayerDouble () {
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.doubleFlag == -1){
                return false;
            }
        }
        return true;
    }
    /**
     * 获取自动出牌
     * @param player
     * @returns {*}
     */
    getShape(player){
        let doShape = null;
        doShape = this.ai.selectPai(player.index);
        player.cueTbl = this.genCue(player.index);
        player.curCueIdx = 0;
        return doShape;
    }
    /**
     * 开始游戏
     */
    startGame() {
        ERROR("startGame : " + this.farmer);
        this.state = Enum.GameState.PLAY;
        this.nextPlayer = this.farmer;
        let player = this.players[this.farmer];
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_OUT_CARD,{});
        let doShape = null;
        player.taskParams.farmer = true;

        doShape = this.getShape(player);
        let isCan = true;
        let isForce = true;
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_POS_CHANGE, {playerIndex: this.nextPlayer, isForce:isForce, isCan : isCan});
        if(doShape) {
            let time = this.autoTime(player);
            this.setActionTimer(ActionType.DDZ_PLAY,time,[this.farmer]);
            player.doCard = Enum.doCard.PLAY;
            player.setAutoFun(this.doPlay, [this.farmer, doShape]);
            player.scheJob = setTimeout(function () {
                this.doPlay(this.farmer, doShape);
            }.bind(this), time);
        }
    }
    /**
     * 设置挂起任务
     * @param time
     * @param users
     */
    setActionTimer(action, time, users) {
        let data = {action: action, stamp: Date.getStamp() * 1000, duration: time, users: users};
        this.actionTimer = data;
        let tempT = data.duration;
        //if(this.mode === "JB") {
            if (this.state == Enum.GameState.PLAY && this.prePlayer != 0) {
                for (let idx in this.players) {
                    let player = this.players[idx];
                    if (tempT == Enum.noRise * 1000 && users.indexOf(+idx) >= 0) {
                        data.duration = tempT;
                        player.sendMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
                    } else {
                        data.duration = Enum.autoPlayTime[this.mode] * 1000;
                        player.sendMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
                    }
                }
            } else {
                this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
            }
        // }else if(this.mode === "FK"){
        //     if (this.mode === "FK" && time != Enum.HOSTED * 1000) {
        //         if (this.state === Enum.GameState.QIANG) {
        //             data.duration = Enum.FKShowTime.QIANG * 1000;
        //         } else if (this.state === Enum.GameState.PLAY) {
        //             data.duration = Enum.FKShowTime.PLAY * 1000;
        //         } else if (this.state === Enum.GameState.READY) {
        //             data.duration = Enum.FKShowTime.READY * 1000;
        //         } else if(this.state === Enum.GameState.DOUBLE){
        //             data.duration = Enum.FKShowTime.DOUBLE * 1000;
        //         }
        //     }
        //     this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
        // }
    }
    //抢牌结束
    grabEnd() {
        for (let k in this.players) {
            if (this.players[k].grabScore == null) {
                return false;
            }
        }
        return true
    }
    /**
     * 是否所有玩家都准备好
     * @returns {boolean}
     */
    isCanStart() {
        for(let idx in this.players){
            let player = this.players[idx];
            if(!player.ready){
                return false;
            }
        }
        return true;
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
        if(CommFuc.isRepeat(cards)){
            ERROR("传入参数错误" + playerIndex);
            return;
        }
        let player = this.players[playerIndex];
        for(let idx in cards){
            let card = cards[idx];
            if(!player.handCards.contains(card)){
                ERROR("找不到指定牌" + card + "玩家手里的牌: " + JSON.stringify(player.handCards.cards));
                CommFuc.cardSort(player.handCards.cards);       // 特殊情况 找不到要出的牌 同步下客户端数据
                player.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_DDZ, {playerIndex: player.index, cards: player.handCards.cards});
                return;
            }
        }
        let ret = this.judgeCards(cards);
        if(typeof(ret) == "number"){
            ERROR("请求出牌错误:" + "上家牌型:" + JSON.stringify(this.preShape) + "本次牌型: " + JSON.stringify(cards));
            player.sendMsg(ProtoID.CLIENT_GAME_DO_PLAY_DDZ,{playerIndex, result:ret});
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
        this.preShape = clone(curShape);
        this.prePlayer = playerIndex;
        curShape.isFollow = isFollow;
        let player = this.players[playerIndex];
        let cards = curShape.cards;
        player.doCard = Enum.doCard.PLAY;
        if (curShape.type == Enum.shape.ZD) {
            this.roomBet *= 2;
            this.isBomb = true;
            this.roomBet = Math.min(this.opts.max, this.roomBet)
            player.zdCount++;
            this.broadcastMsg(ProtoID.GAME_CLIENT_BET_CHANG_DDZ,{multiple:this.roomBet});
            if(curShape.power === 17) {
                player.taskParams.kingBoom = true;
            }
            player.taskParams.boomNum++;
        }
        player.clearAutoPlayer();
        if(playerIndex != this.farmer){
            this.isSpring = false;
        }else{
            this.FarmerNum++;
            if(this.FarmerNum > 1){
                this.isFSpring = false;
            }
        }
        player.handCards.delCards(cards);
        curShape.playerIndex = playerIndex;
        player.sendMsg(ProtoID.CLIENT_GAME_DO_PLAY_DDZ,{curShape,handCards:player.handCards.cards});
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PLAY_DDZ,{curShape},[playerIndex]);
        if (player.handCards.isEmpty()) {
            player.taskParams.win = true;
            this.onSettement(playerIndex);
            return;
        }

        if (player.handCards.isPolice()) {
            this.broadcastMsg(ProtoID.GAME_CLIENT_POLICE,{num:player.handCards.num,playerIndex:playerIndex});
        }

        player.cueTbl = [];
        player.curCueIdx = 0;
        this.nextPlayer = this.setNextPlayer(playerIndex);
        let nextPlayer = this.players[this.nextPlayer];

        let nextDoShape = this.getShape(nextPlayer);
        let isCan = nextPlayer.cueTbl.length > 0 ? true : false;
        let isForce = this.preShape == null ? true : false;
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_POS_CHANGE, {playerIndex: this.nextPlayer, isForce:isForce, isCan : isCan});
        let time = this.autoTime(nextPlayer);
        this.setActionTimer(ActionType.DDZ_PLAY,time,[this.nextPlayer]);
        nextPlayer.doCard = Enum.doCard.PLAY;
        if(nextDoShape){
            let doCards = nextDoShape.cards;
            if(nextDoShape.type == Enum.shape.ZD && doCards.length != nextPlayer.handCards.cards.length && !nextPlayer.isRobot()){
                nextPlayer.setAutoFun(this.doPass, [nextPlayer.index]);
                nextPlayer.scheJob = setTimeout(function () {
                    this.doPass(nextPlayer.index)
                }.bind(this), time);
            }else {
                nextPlayer.setAutoFun(this.doPlay, [nextPlayer.index, nextDoShape]);
                nextPlayer.scheJob = setTimeout(function () {
                    this.doPlay(nextPlayer.index, nextDoShape)
                }.bind(this), time);
            }
        }else{
            nextPlayer.setAutoFun(this.doPass, [nextPlayer.index]);
            nextPlayer.scheJob = setTimeout(function () {
                this.doPass(nextPlayer.index)
            }.bind(this), time);
        }
        this.setAutoT(player, req);
    }
    /**
     * 玩家过牌
     * @param uid
     */
    onPlayerReqPass(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        if(this.nextPlayer != playerIndex){
            DEBUG("没有轮到该玩家出牌.. " + playerIndex);
            return;
        }
        if(this.prePlayer == playerIndex || this.prePlayer == 0){
            DEBUG("不允许不走牌");
            return;
        }
        this.doPass(playerIndex, true);
    }
    /**
     * 玩家过牌
     * @param playerIndex
     */
    doPass(playerIndex, req) {
        let player = this.players[playerIndex];
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PASS_DDZ, {playerIndex: playerIndex});
        player.clearAutoPlayer();
        player.cueTbl = [];
        player.doCard = Enum.doCard.PASS;
        player.handCards.outCards = [];
        this.nextPlayer = this.setNextPlayer(playerIndex);
        let nextPlayer = this.players[this.nextPlayer];
        if(this.nextPlayer == this.prePlayer){
            this.preShape = null;
        }
        let doShape = this.getShape(nextPlayer);

        let isCan = nextPlayer.cueTbl.length > 0 ? true : false;
        let isForce = this.preShape == null ? true : false;
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_POS_CHANGE, {playerIndex: this.nextPlayer, isForce:isForce, isCan:isCan});
        let time = this.autoTime(nextPlayer);
        this.setActionTimer(ActionType.DDZ_PLAY,time,[this.nextPlayer]);
        nextPlayer.doCard = Enum.doCard.PLAY;
        if(doShape){
            let doCards = doShape.cards;
            if(doShape.type == Enum.shape.ZD && doCards.length != nextPlayer.handCards.cards.length && !nextPlayer.isRobot()){
                nextPlayer.setAutoFun(this.doPass, [nextPlayer.index]);
                nextPlayer.scheJob = setTimeout(function () {
                    this.doPass(nextPlayer.index)
                }.bind(this), time);
            }else {
                nextPlayer.setAutoFun(this.doPlay, [nextPlayer.index, doShape]);
                if((doShape.type == Enum.shape.DAN || doShape.type == Enum.shape.DUI || doShape.type == Enum.shape.ZD) && doCards.length == nextPlayer.handCards.cards.length && isForce){
                    time = 0;
                }
                nextPlayer.scheJob = setTimeout(function () {
                    this.doPlay(nextPlayer.index, doShape)
                }.bind(this), time);
            }
        }else{
            nextPlayer.setAutoFun(this.doPass, [nextPlayer.index]);
            nextPlayer.scheJob = setTimeout(function () {
                this.doPass(nextPlayer.index)
            }.bind(this), time);
        }
        this.setAutoT(player, req);
    }
    // 玩家提示
    onPlayerCue(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(this.nextPlayer != playerIndex){
            DEBUG("没有轮到该玩家出牌.. " + playerIndex);
            return;
        }
        if(player.cueTbl.length == 0){
            player.cueTbl = this.genCue(playerIndex);
            player.curCueIdx = 0;
        }
        if(player.cueTbl.length > 0){
            let sub = player.cueTbl[player.curCueIdx % player.cueTbl.length];
            player.curCueIdx++;
            player.sendMsg(ProtoID.CLIENT_GAME_CUE,sub);
        }
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
            player.sendMsg(ProtoID.CLIENT_GAME_SELECT_CARDS, {cards: selects});
        }else{
            player.sendMsg(ProtoID.CLIENT_GAME_SELECT_CARDS, {cards: cards});
        }
    }
    //牌型转换成数量
    cardsConv(cards) {
        let cpCards = CommFuc.copyArray(cards);
        this.removeKing(cpCards);
        let cardList = CommFuc.oneDimensionalArray(13, 0);
        for (let idx in cpCards) {
            let cardNum = cpCards[idx] % 100 - 1;
            cardList[cardNum]++;
        }
        return cardList;
    }
    /**
     * 移除大小王
     * @param cards
     */
    removeKing(cards) {
        let pos = cards.indexOf(514);
        if (pos != -1) {
            cards.splice(pos, 1);
        }
        pos = cards.indexOf(614);
        if (pos != -1) {
            cards.splice(pos, 1);
        }
    }
    /**
     * 获取牌的张数
     * @param cards
     * @param num
     * @returns {*}
     */
    get_card_Num (cards, num) {
        let cpCards = CommFuc.copyArray(cards);
        let list = this.cardsConv(cpCards);
        return list[num - 1];
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
        let fourInfo = this.getFourInfo(cards);
        if(fourInfo){return fourInfo;}
        return null;
    }
    /**
     * 是否是炸弹
     * @param cards
     * @returns {*}
     */
    getZDInfo (cards) {
        if(!(cards.length == 4 || cards.length == 2)){
            return null;
        }
        let list = this.cardsConv(cards);
        if(cards.length == 2) {
            if(cards.indexOf(514) >= 0 && cards.indexOf(614) >= 0){
                return {type:Enum.shape.ZD,subType:Enum.subShape.NONE, num:1, power:17,cards:[514,614]}
            }
        }
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
            let number = 0;
            if(cards[0] != 514 && cards[0] != 614) {
                number = cards[0] % 100 - 1;
            }else{
                number = cards[0];
            }
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
        if(dui_num == 2){
            return null;
        }
        if (cards.indexOf(514) != -1 || cards.indexOf(614) != -1) {
            return null;
        }
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
        let set = [];
        list[13] = list[0];
        for (let i = 2; i < 14; i++) {
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
                dan += 2;
            }else if(count == 1){
                dan++;
            }else if(count == 4){
                san++;
                dan++;
            }
        }
        if(cards.indexOf(514) >= 0){dan++;}
        if(cards.indexOf(614) >= 0){dan++;}
        if(san == 0){
            return null;
        }
        if(!(dan == san * 0 || dan == san * 1 || dan == san * 2)){
            return null;
        }
        let subType = Enum.subShape.NONE;
        if(dan != 0){
            subType = dan == san ? Enum.subShape.DAN : Enum.subShape.DUI;
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
        let connectNum = 0;
        let list = this.cardsConv(cards);
        let set = [];
        list[13] = list[0];
        for (let i = 2; i < 14; i++) {
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
        if (list[1] > 0) {
            return null;
        }
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
        let set = [];
        list[13] = list[0];
        for (let i = 2; i < 14; i++) {
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
     * 是否四带2
     * @param cards
     * @returns {*}
     */
    getFourInfo(cards) {
        if (cards.length != 6) {
            return null;
        }
        if(cards.indexOf(514) >= 0 && cards.indexOf(614) >= 0){
            return null;
        }
        let max = -1;
        let subType = Enum.subShape.DUI;
        let list = this.cardsConv(cards);
        for(let i = 0; i < 13; i++){
            if(list[i] == 4){
                max = i;
            }
            if(list[i] == 2){
                subType = Enum.subShape.DUI;
            }
        }
        if(max == -1){return null}
        let power = this.getPower(max);
        return {type: Enum.shape.SI_ER,subType:subType, num: 1, power: power,cards:cards};
    }


    /**
     * 分数结算
     * @param winIdx
     */
    billBean(winIdx) {
        let roomBean = this.roomBet * this.baseBean;
        let beanInfo = {};
        let farmPlayer = this.players[this.farmer];
        let fBean = 0;
        if(winIdx == this.farmer) {             // 地主赢
            for(let idx in this.players){
                let player = this.players[idx];
                if(idx != winIdx){
                    let bean = Math.min(player.bean, roomBean);
                    player.updateCoin(1, -bean, eventType.MATCH);
                    player.taskParams.winLoseBean = -bean;
                    this.checkTask(player);
                    player.updateLuck(1);
                    player.roundBean = -bean;
                    beanInfo[idx] = -bean;
                    player.failCount++;
                    fBean += bean;
                }
            }
            farmPlayer.updateCoin(1, fBean, eventType.MATCH);
            farmPlayer.updateMaxScore(fBean);
            farmPlayer.taskParams.winLoseBean = fBean;
            this.checkTask(farmPlayer);
            farmPlayer.updateLuck(-2);
            farmPlayer.roundBean = fBean;
            beanInfo[this.farmer] = fBean;
            farmPlayer.winCount++;
            if(this.roomBet >= this.opts.max){
                let data = GameMgr.getInsertMsg(this.gameType, this.subType);
                let wBean = CommFuc.wBean(fBean);
                GameMgr.noticeInsertNotice(`恭喜玩家${farmPlayer.name}在【${data.gameTypeMsg}】【${data.subTypeMsg}】中赢得了${wBean}万SEER`);
            }
        }else{
            let bean = Math.min(farmPlayer.bean, roomBean * 2);
            farmPlayer.updateCoin(1, -bean, eventType.MATCH);
            farmPlayer.taskParams.winLoseBean = -bean;
            this.checkTask(farmPlayer);
            farmPlayer.updateLuck(2);
            farmPlayer.roundBean = -bean;
            beanInfo[this.farmer] = -bean;
            farmPlayer.failCount++;
            fBean = bean;
            for(let idx in this.players){
                let player = this.players[idx];
                if(idx != this.farmer){
                    let nBean = Math.floor(fBean / 2);
                    player.updateCoin(1, nBean, eventType.MATCH);
                    player.taskParams.winLoseBean = nBean;
                    this.checkTask(player);
                    player.updateMaxScore(nBean);
                    player.updateLuck(-1);
                    player.roundBean = nBean;
                    beanInfo[idx] = nBean;
                    player.winCount++;
                    if(this.roomBet >= this.opts.max){
                        let data = GameMgr.getInsertMsg(this.gameType, this.subType);
                        let wBean = CommFuc.wBean(nBean);
                        GameMgr.noticeInsertNotice(`恭喜玩家${player.name}在【${data.gameTypeMsg}】【${data.subTypeMsg}】中赢得了${wBean}万SEER`);
                    }
                }
            }
        }
        return beanInfo;
    }

    /**
     * 退出游戏
     * @param player
     */
    onPlayerQuit(player){
        this.players[player.index] = new Player(this, player.index);
    }
    /**
     * 保存战报
     */
    saveReportsToMiddle() {
        let data = super.saveReportsToMiddle();
        for(let idx in this.players){
            let player = this.players[idx];
            data.players.push(player.getPlayerReportInfo())
        }
        data.dealer = this.players[this.farmer] ? this.players[this.farmer].uid : 0;
        GameMgr.savePlayerReport(data);
    }
    // ***************************************************************************** AI *************************************************************
    // 对玩家出过来的牌进行判断
    judgeCards(cards) {
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
    // 生成提示牌
    genCue(playerIndex) {
        let player = this.players[playerIndex];
        let cards = player.handCards.cards;
        let cue = [];
        if (this.preShape == null) {
            let paiInfo = this.getCombination(cards);               // 一次性能出完的情况
            if(paiInfo){cue.push(paiInfo)}
            let danSet = this.getDanSet(cards);                                 // 单张出牌
            for(let idx in danSet){
                cue.push(danSet[idx]);
            }
        }else{
            let AllBomb = this.getAllBomb(cards);                               // 获取所有同类型的炸弹
            let allSameType = this.getAllSameTypeCard(cards);                   // 获取可以打的牌
            for(let idx in allSameType){
                cue.push(allSameType[idx]);
            }
            for(let idx in AllBomb){
                cue.push(AllBomb[idx]);
            }
        }
        return cue;
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
        if (cards.indexOf(514) != -1 && cards.indexOf(614) != -1) {
            bomd.push({type: Enum.shape.ZD, subType: Enum.subShape.NONE, num: 1, power: 17, cards: [514, 614]});
        }
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
     * 获取牌
     * @param cards
     * @param pai
     * @param count
     * @returns {*}
     */
    getPaiCount(cards,pai,count) {
        let array = [];
        let num = 0;
        if(pai == 514){
            return [514];
        }else if(pai == 614){
            return [614];
        }
        for(let idx in cards){
            if(cards[idx] % 100 == pai && cards[idx] < 500){
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
    arraySort(tbl) {
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
        }else if(number == 514){
            return 16;
        }else if(number == 614){
            return 17;
        }
        return number + 1;
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
     * 获取单牌集合
     * @param cards
     * @returns {Array}
     */
    getDanSet(cards) {
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
            if(zs == 1){
                if(cards.indexOf(514) >= 0 && cards.indexOf(614) == -1){
                    let power = this.getPower(514);
                    if (power > prePower) {
                        tempArray.push({
                            type: Enum.shape.DAN,
                            subType: Enum.subShape.NONE,
                            num: 1,
                            power: power,
                            cards: [514]
                        });
                    }
                }
                if(cards.indexOf(614) >= 0 && cards.indexOf(514) == -1){
                    let power = this.getPower(614);
                    if (power > prePower) {
                        tempArray.push({
                            type: Enum.shape.DAN,
                            subType: Enum.subShape.NONE,
                            num: 1,
                            power: power,
                            cards: [614]
                        });
                    }
                }
                this.arraySort(tempArray);
                array.push.apply(array,tempArray);
            }
        }
        return array;
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
     * 删除特殊牌型
     * @param group
     * @returns {Array}
     */
    delSpeCards(group) {
        let newGroup = [];
        for(let idx in group){
            let shape = group[idx];
            let type = shape.type;
            if(type == Enum.shape.DUI){         // 44 55 这种不能打出
                if(shape.num == 2){
                    continue;
                }
            }
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
     * 筛选牌
     * @param cards
     */
    getSelectSet (cards) {
        let sets = {};
        let arr = this.getSelectArr(cards, 1, 5);
        let typeSets = this.getSLS(cards, arr, 1);
        if(typeSets.length != 0){
            sets.shun = typeSets;
        }
        arr = this.getSelectArr(cards, 2, 3);
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
        let arr = [];
        let list = this.cardsConv(cards);
        list[13] = list[0];
        let endI = 14;
        if(paiCount == 3){
            endI = 15;
            list[14] = list[1];
        }
        for(let i = 2; i < endI; i++){
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
        let needNum = subType * num;
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
                return [backCards];
            }
        }
        let paiList = this.cardsConv(pai);
        let finaCards = [];
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
            if(zs == 1 && subType == Enum.subShape.DAN){
                if(backCards.indexOf(514) > -1 && backCards.indexOf(614) == -1){
                    array.push({power: 16,cards: [514]});
                }else if(backCards.indexOf(514) == -1 && backCards.indexOf(614) > -1){
                    array.push({power: 17,cards: [614]});
                }
            }
            let len = array.length;
            this.arraySort(array);
            for (let idx = 0; idx < len; idx++) {
                finaCards.push(array[idx].cards);
                if (finaCards.length == num) {
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
    removeCards (cards, pai) {
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
     * 获取牌面中最大的单牌
     */
    getPaiMaxDan(){
        if(this.roomCardsed.indexOf(614) === -1){       // 没有出大王
            return 614;
        }
        if(this.roomCardsed.indexOf(514) === -1){       // 没有出小王
            return 514;
        }
        let list = this.cardsConv(this.roomCardsed);
        if(list[1] !== 4){                              // 2没有出完
            return 15;
        }
        if(list[0] !== 4){                              // A没有出完
            return 14;
        }
        if(list[12] !== 4){                             // K没有出完
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
        if(list[1] <= 2){                              // 出的2少于或者等于2张
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
            let action = this.state == Enum.GameState.QIANG ? ActionType.DDZ_QIANG : ActionType.DDZ_PLAY;
            this.setActionTimer(action,time,[player.index]);
        }
        function sameCall(sTime,player) {
            if(player.autoFun == player.owner.startGrab) {
                if (player.autoParam[0] != null) {
                    player.scheJob = setTimeout(function () {
                        player.owner.startGrab(player.autoParam[0], player.autoParam[1]);
                    }.bind(player), sTime*1000)
                }
            }else if(player.autoFun == player.owner.doPlay){
                if (player.autoParam[0] != null && player.autoParam[1] != null) {
                    player.scheJob = setTimeout(function () {
                        player.owner.doPlay(player.autoParam[0], player.autoParam[1]);
                    }.bind(player), sTime * 1000)
                }
            }else if(player.autoFun == player.owner.doPass){
                player.scheJob = setTimeout(function () {
                    player.owner.doPass(player.autoParam[0]);
                }.bind(player), sTime*1000)
            }else if(player.autoFun == player.owner.onPlayerDouble){
                player.scheJob = setTimeout(function () {
                    player.owner.onPlayerDouble(player.autoParam[0], player.autoParam[1]);
                }.bind(player), sTime*1000)
            }
        }
        this.broadcastMsg(ProtoID.CLIENT_GAME_TG_DDZ,{playerIndex:playerIndex,isT:isT})
    }
    /**
     * 设置自动托管
     * @param player
     */
    setAutoT(player, req) {
        if(player.isRobot()){
            return;
        }
        if(req){
            player.autoNum = 0;
        }else {
            player.autoNum++;
            if (player.autoNum >= 2 && player.isT == false) {
                this.onPlayerHosted(player.uid, true);
            }
        }
    }
    /**
     * 获取出牌时间
     * @param player
     */
    autoTime(player) {
        if(player.isT){
            return Enum.CANCELHOSTED * 1000;
        }
        if(this.state == Enum.GameState.QIANG){
            if(player.isRobot()){
                return Enum.rebotGrabTime * 1000;
            }else{
                return Enum.autoGrabTime[this.mode] * 1000;
            }
        }else if(this.state == Enum.GameState.DOUBLE){
            if(player.isRobot()) {
                return ((Math.random() * Enum.rebotDoubleTime[1] - Enum.rebotDoubleTime[0])  + Enum.rebotDoubleTime[0]) * 1000;
            }else{
                return Enum.doubleTime[this.mode] * 1000;
            }
        }else if(this.state == Enum.GameState.PLAY){
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
    }
    /**
     * 设置准备倒计时
     * @param playerIndex
     */
    setReadyEvent(playerIndex, time) {
        let player = this.players[playerIndex];
        if (!player.isRobot()) {
            player.scheJob = setTimeout(function () {
                this.cancelMatch(player.uid, true);
            }.bind(this, player),time);
        }
        player.setActionTimer(ActionType.READY, time);
    }
    /**
     * 获取关联玩家
     * @returns {*}
     */
    getRelationPlayer() {
        return [1,2,3];
    }
};

exports.Room = DDZRoom;
