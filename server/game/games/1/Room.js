let util            = require("util");
let Enum            = require("./Enum.js");
let Func            = require("./Func.js");
let Player          = require("./Player.js").Player;
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../../net/CSProto.js").ProtoState;
let ActionType      = require("../../../net/CSProto.js").ActionType;
let CommFuc         = require("../../../util/CommonFuc.js");
let eventType       = require("../../../net/CSProto.js").eveIdType;
let resEvent        = require("../../../net/CSProto.js").resEvent;
let Room            = require("../../base/room");


///////////////////////////////////////////////////////////////////////////////
//>> 公牌

class PublicCards {
    constructor(owner){
        this.owner = owner;
        this.cards = [];                                    // 牌
        this.getIndex = 0;                                  // 取牌位置
        this.num = owner.opts.isWFP ? 128: 144;          // 剩余张数
        this.maxNum = owner.opts.isWFP ? 128: 144;       // 总张数
        this.played = [];                                   // 已经打出去的牌
    }
    /**
     * 生成牌组
     * @param owner
     * @returns {*}
     */
    gen(owner) {
        this.reset();
        let originCards = [];
        for (let idx = 0; idx < Enum.AllMj.length; idx++) {
            if(Enum.AllMj[idx] > 60){
                originCards.push(Enum.AllMj[idx]);
            }else {
                if(owner.opts.isWFP){
                    if(Enum.AllMj[idx] >= 41 && Enum.AllMj[idx] <= 44){
                        continue;
                    }
                }
                for (let num = 0; num < 4; num++) {
                    originCards.push(Enum.AllMj[idx]);
                }
            }
        }
        while (originCards.length > 0) {
            let rIdx = Math.floor(Math.random() * originCards.length);
            this.cards.push(originCards[rIdx]);
            originCards.splice(rIdx, 1);
        }
        let playerCards = CommFuc.twoDimensionalArray(owner.playNum, 13, 0);
        for (let i = 0; i < owner.playNum; i++) {
            for(let j = 0; j < 13; j++ ) {
                playerCards[i][j] = this.getCard();
            }
        }
        return playerCards;
    }
    /**
     * 添加测试牌
     * @param id
     */
    tempAddCard(id) {
        this.cards.push(id);
    }
    /**
     * 添加吃牌
     */
    tempChiCard(playerIndex, mjs, mjId, target) {
        let player = this.owner.players[playerIndex];
        player.handCards.chi_mjs.push({card :mjId, cards:mjs, target:target});
        this.owner.prePlayer = target;
        let packNum = this.owner.calcPackCardNum(playerIndex);
        if(packNum >= 3){
            player.updatePackInfo(packNum, target);
        }
    }
    /**
     * 添加碰
     * @param playerIndex
     * @param mjId
     * @param target
     */
    tempPengCard(playerIndex,mjId, target) {
        let player = this.owner.players[playerIndex];
        player.handCards.peng_mjs[mjId] = target;
        this.owner.prePlayer = target;
        let packNum = this.owner.calcPackCardNum(playerIndex);
        if(packNum >= 3){
            player.updatePackInfo(packNum, target);
        }
    }
    /**
     * 添加杠牌
     */
    tempGangCard(playerIndex,mjId,type, target) {
        let player = this.owner.players[playerIndex];
        player.handCards.gang_mjs[mjId] = {type:type, source:target};
        this.owner.prePlayer = target;
        let packNum = this.owner.calcPackCardNum(playerIndex);
        if(packNum >= 3){
            player.updatePackInfo(packNum, target);
        }
    }
    /**
     * 生产测试牌
     * @param owner
     * @returns {[*,*,*,*]}
     */
    genTemp1(owner) {
        this.reset();
        this.num = 144;
        let originCards = [];
        for (let idx = 0; idx < Enum.AllMj.length; idx++) {
            if(Enum.AllMj[idx] >= 60){
                originCards.push(Enum.AllMj[idx]);
            }else {
                if(owner.opts.isWFP){
                    if(Enum.AllMj[idx] >= 51 && Enum.AllMj[idx] <= 53){
                        continue;
                    }
                }
                for (let num = 0; num < 4; num++) {
                    originCards.push(Enum.AllMj[idx]);
                }
            }
        }
         // 测试牌型 3 TDW
         let player1Cards = [11, 11, 15, 13, 13, 13, 14, 14, 14, 16, 16, 16, 61];
         let player2Cards = [11, 11, 11, 13, 13, 13, 14, 14, 14, 16, 16, 16, 44];
         let player3Cards = [11, 11, 41, 12, 12, 42, 14, 14, 15, 15, 16, 16, 44];
         let player4Cards = [11, 12, 42, 21, 22, 23, 15, 16, 17, 25, 26, 27, 44];
        // 测试牌型 4
        //  let player1Cards = [53];
        //  let player2Cards = [51];
        //  let player3Cards = [52];
        //  let player4Cards = [11, 11, 12, 12, 12, 12, 13, 14, 52, 52, 52, 44, 16];
        //
        //  this.tempChiCard(2,[31,32,33],33,1);
        //  this.tempChiCard(2,[11,12,13],13,1);
        //  this.tempChiCard(2,[21,22,23],23,1);
        //  this.tempChiCard(2,[35,36,37],37,1);
        //
        //  this.tempPengCard(3,11,1);
        //  this.tempPengCard(3,12,1);
        //  this.tempPengCard(3,13,1);
        //  this.tempPengCard(3,14,1);
        //
        // this.tempChiCard(1,[31,32,33],33,4);
        // this.tempChiCard(1,[11,12,13],13,4);
        // this.tempChiCard(1,[21,22,23],23,4);`
        // this.tempChiCard(1,[35,36,37],37,4);

        // this.tempGangCard(3,11,1, 2);
        // this.tempGangCard(3,12,1, 2);

         for(let idx = 0; idx < 3; idx++){
             this.tempAddCard(61);
         }
         this.tempAddCard(31);
         let num = this.num;
         this.num = this.num - 13 * this.owner.playNum;
         let loop = num - 13 * 4 - 10;
         while (originCards.length > 0 && loop > 0) {
            let rIdx = Math.floor(Math.random() * originCards.length);
            this.cards.push(originCards[rIdx]);
            originCards.splice(rIdx, 1);
            loop--;
         }
         return [player1Cards, player2Cards, player3Cards, player4Cards];
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
     * 公牌是否已经摸完
     * @returns {boolean}
     */
    isEmpty() {
        let point = 0;
        if(this.owner.playNum == 2){
            point = 13;
        }else if(this.owner.playNum == 4){
            point = 15;
        }
        return this.num <= point;
    }
    /**
     * 获取剩余牌数量
     * @returns {number|*}
     */
    getRemain() {
        return this.num;
    }
    /**
     * 重置公牌
     */
    reset() {
        this.played = [];
        this.cards = [];
        this.getIndex = 0;
        this.num = this.owner.opts.isWFP ? 128: 144;
        this.maxNum = this.owner.opts.isWFP ? 128: 144;
    }
    /**
     * 剩余某一张麻将的张数
     * @param mjId
     * @returns {number}
     */
    plusNumMjId(mjId) {
        let count = 0;
        for(let idx in this.played){
            let card = this.played[idx];
            if(card == mjId){
                count++;
            }
        }
        return 4 - count;
    }
};
// 服务器选项配置相关
// this.options.isYF = JSON.parse(cArgs.options.isYF) || false;        // 是否有番
// this.options.isZX = JSON.parse(cArgs.options.isZX) || false;        // 是否闲庄
// this.options.isLZ = JSON.parse(cArgs.options.isLZ) || false;        // 是否连庄
// this.options.isSG = JSON.parse(cArgs.options.isSG) || false;        // 是否上噶
// this.options.isZYSG = JSON.parse(cArgs.options.isZYSG) || false;    // 是否自由上嘎
// this.options.isLJSF = JSON.parse(cArgs.options.isLJSF) || false;    // 是否流局算分
// this.options.isHH = JSON.parse(cArgs.options.isHH) || false;        // 是否花胡
// this.options.isFGJ = JSON.parse(cArgs.options.isFGJ) || false;      // 是否防勾脚
// this.options.isHYS = JSON.parse(cArgs.options.isHYS) || false;      // 是否混一色
// this.options.isWFP = JSON.parse(cArgs.options.isWFP) || false;      // 是否无风牌
// this.options.isBKC = JSON.parse(cArgs.options.isBKC) || false;      // 是否不可吃
// this.options.isHDBP = JSON.parse(cArgs.options.isHDBP) || false;    // 是否海底包牌
// this.options.isJL  = JSON.parse(cArgs.options.isJL) || false;       // 是否叫令
///////////////////////////////////////////////////////////////////////////////
//>> 游戏房间
/**
 * @param data
 * @constructor
 */
class HNMj extends Room{
    constructor(data){
        super(data);
        this.gameType = 1;                      // 游戏类型
        this.turns = 0;                         // 轮数
        this.curTurns = 0;                      // 当前轮
        // room property
        this.actionTimer = {};                  // 挂起事件
        // game property
        this.publicCards = null;                // 公牌信息
        this.dealer = 0;                        // 当前庄家
        this.preDealer = 0;                     // 上一盘的
        this.dealered = [];                     // 每一局的庄家idx
        this.season = -1;                       // 时令 0,1,2,3 对应东南西北
        this.prePlayer = 0;                     // 上一个玩家
        this.prePlayMj = 0;                     // 上一个出牌麻将
        this.nextPlayer = 0;                    // 下一个玩家
        this.isGRAB = false;                    // 是否正在抢牌
        this.robotUid = 10;                     // 机器人uid
        this.gPlaying = false;                  // 是否开局
        this.waitEnd = false;                   // 等待点击总结算
        this.waitEndNum = 0;                    // 等待点击结束玩家数量
        this.details = {};                      // 详情
        this.hus = [];                          // 胡牌的玩家
        this.recordZZJ = false;                 // 记录总战绩
    }

    /**
     * 房间初始化
     * @param cArgs
     * @returns {boolean}
     */
    init(cArgs) {
        super.init(cArgs);
        this.state = Enum.GameState.READY;
        if(this.playNum == 2){
            this.opts.isBKC = true;
        }
        let directions = Enum.Num2Winds[this.playNum];
        for (let idx = 1; idx <= this.playNum; ++idx) {
            let windsDesc = directions[idx - 1];
            this.players[idx] = new Player(this, idx, windsDesc);
        }
        this.publicCards = new PublicCards(this);
        this.dealer = 1;
        return true;
    }
    /**
     * 房间重置
     */
    startReset() {
        this.nextPlayer = this.dealer;                  // 设置出牌的玩家
        this.gangRecord = [];                           // 杠牌记录
        this.gangScoreInfo = this.iniScoreInfo();       // n个玩家这把分值情况，暂存在此处，玩家金豆不足会根据比例进行扣除，金豆不能为负
        this.huaScoreInfo = this.iniScoreInfo();        // 花牌得分信息
        this.huScoreInfo = this.iniScoreInfo();         // 胡分信息
        this.realScoreInfo = this.iniScoreInfo();       // 真实减分
        this.grabPassRoad = false;                      // 抢的牌是否是过路杠
        this.prePlayer = 0;                             // 上一个玩家
        this.prePlayMj = 0;                             // 上一个出牌麻将
        this.passGangPlay = 0;                          // 过路杠的玩家idx
        this.passGangMj = 0;                            // 过路杠的麻将
        this.paoIdx = 0;                                // 点炮玩家
        this.huIdx = 0;                                 // 胡牌玩家
        this.huType2Msg = "";                           // 胡牌类型
        this.TH = false;                                // 天胡标记
        this.DH = false;                                // 地胡标记
        this.cpgFlag = false;                           // 吃过、碰过、杠过的标记
        this.playing = true;                            // 开始新一轮的标志
        this.isGRAB = false;                            // 是否正在抢牌
        this.grabHus = {};                              // 抢胡的玩家信息
        this.firstGang = false;                         // 首张被杠
        this.firstGen = false;                          // 首张被跟
        this.hdb = false;                               // 海底包牌
        this.calcGangHuing = false;                     // 计算抢杠胡中
        this.resetDestory();                            // 重置解散房间数据
    }
    /**
     * 结束一局重置
     */
    endReset() {
        this.dealered.push(this.preDealer);
        this.playing = false;                           // 开始新一轮的标志
        this.curRound += 1;
        this.curRound = Math.min(this.curRound, this.round);
    }
    /**
     * 初始化得分情况
     * @returns {{}}
     */
    iniScoreInfo(){
        let data = {};
        for(let idx in this.players){
            data[idx] = 0;
        }
        return data;
    }

    /**
     * 获取玩家人数
     * @param subType
     * @returns {number}
     */
    getMaxPlayerNum() {
        let num = 0;
        if(this.subType == 1){
            num = 2;
        }else if(this.subType == 2){
            num = 4;
        }
        return num;
    }

    /**
     * 获取房间基础信息
     * @returns {{roomId: *, round: *, roundId: *, gameType: *, subType: *, turns: *, curRound: *, curTurns: *, options: *, playing: *, creator: *, matchId: *, matchName: *, voiceStatus: *}}
     */
    getRoomBaseInfo() {
        let data = super.getRoomBaseInfo();
        data.options=this.getSettementOpt();
        data.gPlaying= this.gPlaying;
        data.season= this.season;

        data.publicCardsNum = this.publicCards.getRemain();
        data.curPlayIndex = this.nextPlayer;
        data.lastPlayIndex = this.prePlayer;
        data.lastPlayCard = this.prePlayMj;
        data.isPlayedCard = false;
        data.isExistHangupTasks = this.isGRAB;

        data.actionTimer=this.actionTimer;
        data.destroyInfo={
            playerIndex:this.destroyIndex,
            destroyTime:this.destroyTime,
            duration:Enum.ROOM_VOID_TIME * 1000
        }
        return data;
    }

    /**
     * 玩家重连
     * @param playerIndex
     * @param wsConn
     * @returns {boolean}
     */
    onPlayerReconnect(playerIndex, wsConn) {
        super.onPlayerReconnect(playerIndex, wsConn);
        let player = this.getPlayerByIndex(playerIndex);
        if(!this.isGRAB) {
            if (player.handCards.getTotalCount() % 3 == 2) {
                let tings = player.handCards.tings;
                if(Object.keys(tings).length > 0){
                    player.sendMsg(ProtoID.GAME_CLIENT_TINGS, {tings : tings});
                }
            }
        }
        return true;
    }
    /**
     * 是否都准备好了
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
     * 是否所有玩家都上噶结束
     * @returns {boolean}
     */
    isAllPlayerGaOver() {
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.curGaScore == -1){
                return false;
            }
        }
        return true;
    }
    /**
     * 请求上嘎
     * @param uid
     * @param gaScore
     */
    startGaReq(uid, gaScore) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(!this.opts.isSG){
            ERROR("not up ga");
            return;
        }
        if(!this.opts.isZYSG){
            if(gaScore < player.preGaScore){
                ERROR("gaScore too small");
                return;
            }
        }
        player.clearAutoPlayer();
        player.curGaScore = gaScore;
        this.broadcastMsg(ProtoID.CLIENT_GAME_START_GA,{playerIndex: playerIndex, multiple: gaScore});
        if(this.isAllPlayerGaOver()){
            let data = this.getGaResult();
            this.broadcastMsg(ProtoID.GAME_CLIENT_UP_GA_END, {gaResult: data});
            this.startTruns();
        }
    }
    /**
     * 获取上噶结果
     * @returns {{}}
     */
    getGaResult() {
        let data = {};
        for(let idx in this.players){
            let player = this.players[idx];
            data[idx] = player.curGaScore;
        }
        return data;
    }
    /**
     * 退出游戏
     * @param player
     */
    onPlayerQuit(player){
        this.players[player.index] = new Player(this, player.index);
    }

    /**
     * 开始新游戏
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        if(this.opts.isJL){
            if(this.season == -1){
                this.season = 0;
            }
        }
        this.gPlaying = true;
        // 初始化游戏数据
        this.startReset();
        this.enumPlayers(function (ePlayerIdx, ePlayer) {
            if (ePlayer.uid != 0) {
                if(!ePlayer.isRobot()) {
                    let consume = this.calcConsume(ePlayer);
                    ePlayer.sendMsg(ProtoID.GAME_CLIENT_START_NEW_ROUND,{curRound:this.curRound, gPlaying:this.gPlaying, dealerIndex : this.dealer, season:this.season, roundId: this.roundId, playStatus: this.state, consume:consume});
                }
            }
        }.bind(this));
        if(this.opts.isSG){
            DEBUG("开始上噶");
            this.state = Enum.GameState.GA;
            this.broadcastMsg(ProtoID.GAME_CLIENT_START_GA, {playStatus: this.state, season : this.season});
            this.sendActionTimer(Enum.UPGA[this.mode] * 1000);
            for(let idx in this.players){
                let player = this.players[idx];
                player.setAutoFun(this.startGaReq, [player.uid, player.preGaScore]);
                (function (player, room) {
                    if(player.isRobot()){
                        // 机器人上噶
                        player.scheJob = setTimeout(function () {
                            room.startGaReq(player.uid, Math.floor(Math.random() * 6));
                        }.bind(room), Enum.RoBotUPGA * 1000);
                    }else {
                        player.scheJob = setTimeout(function () {
                            room.startGaReq(player.uid, player.preGaScore);
                        }.bind(room), Enum.UPGA[room.mode] * 1000);
                    }
                })(player, this);
            }
        }else{
            this.startTruns();
        }
    }
    /**
     * 获取关联玩家
     * @returns {*}
     */
    getRelationPlayer() {
        if(this.playNum == 2){
            return [1,2];
        }else if(this.playNum == 3){
            return [1,2,3];
        }else if(this.playNum == 4){
            return [1,2,3,4];
        }
    }
    /**
     * 开始新的一轮
     */
    startTruns() {
        let tempCard = this.publicCards.gen(this);
        let lastCard  = this.publicCards.getCard();
        this.state = Enum.GameState.PLAY;
        for(let playerIdx in this.players){
            let player = this.players[playerIdx];
            if (playerIdx == this.dealer) {
                let cards = tempCard[playerIdx - 1];
                cards.push(lastCard);
                player.setHandCards(cards);
            } else {
                player.setHandCards(tempCard[playerIdx - 1]);
            }
        }
        let player = this.players[this.dealer];
        let huaCard = player.handCards.getRandomFlowerMj();
        if(huaCard != 0){
            player.handCards.flowered.push(huaCard);
            player.handCards.removeMjs(huaCard);
            player.huaFlag = true;
            this.broadcastMsg(ProtoID.GAME_CLIENT_HUA_CARD,{playerIndex:player.index,card:huaCard},[player.index]);
            player.sendMsg(ProtoID.GAME_CLIENT_HUA_CARD,{playerIndex:player.index,card:huaCard, handCards:player.handCards.mjList()});
            setTimeout(function () {
                this.doDraw(this.dealer);
            }.bind(this), 1000);
        }else {
            this.broadcastMsg(ProtoID.CAME_CLIENT_PLUS_CARD, {publicCardsNum: this.publicCards.num});
            this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ, {
                curPlayIndex: this.nextPlayer,
                lastPlayIndex: this.prePlayer,
                isPlayedCard: false
            });
            this.isGrab(this.dealer, lastCard);
            let time = this.getAutoCardTime(this.dealer);
            this.sendActionTimer(time);
        }
    }
    /**
     * 游戏结束
     */
    onGameOver(player) {
        return;
        // 下面是以前设计的
        if(this.mode == "JB"){
            return;
        }
        this.gPlaying = false;
        this.gameOver = true;
        if(!this.recordZZJ) {
            this.saveReportsToMiddle();
            this.recordZZJ = true;
        }
        // 总结算
        let playerInfo = {};
        this.enumPlayers(function (ePlayerIndex, ePlayer) {
            playerInfo[ePlayerIndex] = ePlayer.getSettementInfo(true);
        }.bind(this));
        GameMgr.noticeStart(this.roomId, 2);
        // 广播结算信息
        if(player){
            player.sendMsg(ProtoID.CLIENT_GAME_GAME_END, {gameType:this.gameType,endTime:Date.getStamp(),curRound:this.curRound, playerInfo: playerInfo});
            this.waitEndNum++;
        }else {
            this.broadcastMsg(ProtoID.CLIENT_GAME_GAME_END, {gameType:this.gameType,endTime:Date.getStamp(),curRound: this.curRound, playerInfo: playerInfo});
            this.waitEndNum = this.playNum;
        }
        if(this.waitEndNum >= this.playNum) {
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
     * 保存战报
     */
    saveReportsToMiddle() {
        let data = super.saveReportsToMiddle();
        let dealer = this.preDealer != 0 ? this.preDealer : this.dealer;
        data.dealer = this.players[dealer].uid;
        for(let idx in this.players){
            let player = this.players[idx];
            data.players.push(player.getPlayerReportInfo())
        }
        GameMgr.savePlayerReport(data);
    }
    /**
     * 设置玩家自动出的牌
     * @param playerIndex
     * @returns {number|*}
     */
    setAutoMj(playerIndex) {
        let player = this.players[playerIndex];
        let card = player.handCards.lastMj;
        if(player.isRobot()) {
            let bestCard = player.handCards.getBestCard();
            if(bestCard && player.handCards.contains(bestCard)){
                card = bestCard;
            }
            for(let idx in this.players){
                let oplayer = this.players[idx];
                if(!oplayer.isRobot() && this.robotLv >= 100) {
                    let huType = oplayer.handCards.calcHuMjs(card);         // 这里大概率保证机器人不会打胡牌给玩家，
                    if (huType) {
                        card = 0;
                    }
                }
            }
        }
        if(card === 0 || !card || card >= 60){
            card = player.handCards.getRandomMjNoHua();
        }
        if(!player.handCards.contains(card)){
            ERROR("this is error" + card);
        }
        return card;
    }

    checkReqPlayCard(player, card){
        let playerIndex = player.index;
        if (playerIndex != this.nextPlayer) {
            ERROR(util.format("Not player %d's round", playerIndex));
            return ProtoState.STATE_FAILED;
        }
        if(card >= 60){
            ERROR("不能走花牌");
            return ProtoState.STATE_GAME_NOT_HUA_CARD;
        }
        if (this.isGRAB) {
            ERROR(util.format("正在抢牌不能出牌", playerIndex));
            return ProtoState.STATE_FAILED;
        }
        if (!player.handCards.contains(card)) {
            ERROR(util.format("玩家手里没有这张牌", card));
            return ProtoState.STATE_FAILED;
        }
        return ProtoState.STATE_OK;
    }
    /**
     * 玩家出牌
     * @param uid
     * @param card
     */
    onPlayerReqPlayCard(uid, card) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        let ret = this.checkReqPlayCard(player, card);
        if(ret !== ProtoState.STATE_OK){
            player.sendMsg(ProtoID.CLIENT_GAME_DO_PLAY_MJ, {result:ret});
            return;
        }
        this.doPlay(playerIndex, card, true);
    }
    /**
     * 测试bug用
     */
    testPai(player) {
        let num = 0;
        let chi = player.handCards.chi_mjs.length;
        let peng = Object.keys(player.handCards.peng_mjs).length;
        let gang = Object.keys(player.handCards.gang_mjs).length;
        num += (chi + peng + gang) * 3;
        num += player.handCards.getTotalCount();
        if(num != 13){
            ERROR("error big or small xg" + this.roomId);
            // process.exit(-1);
        }
    }
    /**
     * 玩家出牌
     * @param playerIndex
     * @param card
     */
    doPlay(playerIndex, card, req) {
        let player = this.players[playerIndex];
        player.handCards.playMj(card);
        this.testPai(player);
        if(player.firstCard == 0){
            player.firstCard = card;
        }
        this.prePlayMj = card;
        this.prePlayer = playerIndex;
        this.nextPlayer = this.getNextPlayerIndex(playerIndex);
        player.clearAutoPlayer();
        // 广播玩家出牌
        player.sendMsg(ProtoID.CLIENT_GAME_DO_PLAY_MJ, {playerIndex,card,handCards:player.handCards.mjList()});
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PLAY_MJ, {playerIndex,card},[playerIndex]);
        // 检测胡牌数量
        this.grabHus = {};
        let startIdx = playerIndex;
        for(let loop = 1; loop < this.playNum; loop++){
            let grabIdx = this.getNextPlayerIndex(startIdx);
            let isHu = this.isGrab(grabIdx,card,true);
            this.grabHus[loop] = {playerIndex : grabIdx, isHu : isHu};
            startIdx = grabIdx;
        }
        if (!this.isGRAB) {
            this.doDraw(this.nextPlayer);
        }else{
            let time = this.getAutoCardTime(this.nextPlayer);
            this.sendActionTimer(time);
        }
        this.setAutoT(player, req);
    }
    /**
     * 摸牌
     * @param playerIndex
     * @returns {boolean}
     */
    doDraw(playerIndex) {
        let player = this.players[playerIndex];
        let card = this.publicCards.getCard();
        if (this.roundOver() || !card) {
            if(this.opts.isLJSF){
                this.billGang();
            }
            this.billHua();
            this.onSettement();
            return false;
        }
        player.sendMsg(ProtoID.GAME_CLIENT_DRAW_CARD, {playerIndex: playerIndex, card : card, handCards:player.handCards.mjList()});
        this.broadcastMsg(ProtoID.GAME_CLIENT_DRAW_CARD, {playerIndex: playerIndex, card : card},[playerIndex]);
        player.handCards.drawMj(card);
        let huaCard = player.handCards.getRandomFlowerMj();
        this.broadcastMsg(ProtoID.CAME_CLIENT_PLUS_CARD, {publicCardsNum: this.publicCards.num});
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ,{curPlayIndex:playerIndex, lastPlayIndex:this.prePlayer,isPlayedCard : false});
        player.clearAutoPlayer();
        this.grabHus = {};
        // 摸到花牌
        if(huaCard != 0){
            player.handCards.flowered.push(huaCard);
            player.handCards.removeMjs(huaCard);
            player.huaFlag = true;
            player.gangFlag = false;
            this.broadcastMsg(ProtoID.GAME_CLIENT_HUA_CARD,{playerIndex:playerIndex,card:huaCard},[playerIndex]);
            player.sendMsg(ProtoID.GAME_CLIENT_HUA_CARD,{playerIndex:playerIndex,card:huaCard, handCards:player.handCards.mjList()});
            setTimeout(function () {
                this.doDraw(playerIndex);
            }.bind(this, playerIndex), 1200);
        }else {
            this.isGrab(playerIndex,card);
            let time = this.getAutoCardTime(playerIndex);
            this.sendActionTimer(time);
        }
    }

    /**
     * 玩家请求碰牌
     * @param uid
     */
    onPlayerReqPengCard(uid,card) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player.pengState != Enum.GrabState.GRABING){
            DEBUG("玩家不能碰牌,可能已经过牌" + player.pengState);
            return;
        }
        if(card != this.prePlayMj){
            ERROR("peng card param error");
            return;
        }
        if (!player.handCards.pengAble(card)) {
            DEBUG(util.format("玩家[%s]碰牌[%d]失败,未能满足碰牌条件", uid, card));
            return;
        }
        this.doPeng(playerIndex, card, true);
    }

    /**
     * 碰牌
     * @param playerIndex
     * @param card
     */
    doPeng(playerIndex, pengMj, req) {
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        player.setGRabState(2);
        this.clearHusByIndex(playerIndex);
        if (!this.huIng(playerIndex) && !this.hued(playerIndex)) {
            player.handCards.peng(pengMj, this.prePlayer);
            let prePlay = this.players[this.prePlayer];
            prePlay.handCards.delPlayedMj();
            DEBUG(util.format("玩家[%s]碰牌[%d]成功", player.uid, pengMj));
            this.cpgFlag = true;
            this.resetGrabState();
            player.handCards.menQing = false;
            this.nextPlayer = playerIndex;
            this.isGRAB = false;
            let packNum = this.calcPackCardNum(playerIndex);
            if(packNum >= 3){
                player.updatePackInfo(packNum, this.prePlayer);
            }

            let info = {playerIndex, targetIndex:this.prePlayer,card:pengMj};
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PENG,info,[playerIndex]);
            info.handCards = player.handCards.mjList();
            player.sendMsg(ProtoID.CLIENT_GAME_DO_PENG,info);

            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});

            let time = this.getAutoCardTime(playerIndex);
            this.sendActionTimer(time);
            if(player.handCards.getTotalCount() % 3 == 2) {
                this.calcTingMsg(player);
                player.handCards.lastMj = 0;
                let card = this.setAutoMj(playerIndex);
                this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ,{curPlayIndex:playerIndex, lastPlayIndex:this.prePlayer,isPlayedCard : false});
                player.setAutoFun(this.doPlay, [playerIndex, card]);
                player.scheJob = setTimeout(function () {
                    this.doPlay(playerIndex, card);
                }.bind(this), time);
            }else{
                ERROR("碰完牌后，玩家手里牌的数量不正确");
            }
        }
        this.setAutoT(player, req);
    }
    /**
     * 玩家请求杠牌
     * @param uid
     * @param card
     * @returns {boolean}
     */
    onPlayerReqGangCard(uid, card) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player.gangState != Enum.GrabState.GRABING){
            ERROR("玩家不能杠牌,可能已经过牌" + player.gangState);
            return false;
        }
        let gangType = player.handCards.gangType(card);
        if(!this.isGRAB){
            ERROR("不是抢牌阶段不能杠");
            return false;
        }
        if(gangType == null){
            ERROR(util.format("玩家[%d]不能杠牌,传递卡牌[%d]参数错误", uid, card));
            return false;
        }
        player.gangCard = card;
        this.doGang(playerIndex, card, true);
    }
    /**
     *杠牌
     */
    doGang(playerIndex, gangMj, req) {
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        player.setGRabState(3);
        this.clearHusByIndex(playerIndex);
        if (!this.huIng() && !this.hued()) {
            let gangType = player.handCards.gangType(gangMj);
            if(gangType == Enum.GangType.PASSROAD && this.grabPassRoad == false){
                let haveHu = this.calcGangHu(playerIndex, gangMj);
                if(haveHu){
                    this.addPassRoadTask(playerIndex, gangMj);
                    return;
                }
            }
            this.clearPassRoadTask();
            this.cpgFlag = true;
            player.handCards.gang(gangMj, gangType);
            if (gangType != Enum.GangType.AN_GANG) {
                player.handCards.menQing = false;
            }
            if(gangType == Enum.GangType.PASSROAD){
                let packNum = this.calcPackCardNum(playerIndex);
                if(packNum >= 3){
                    player.updatePackInfo(packNum, this.prePlayer);
                }
            }
            let isFirst = this.isFirstGang(gangType);
            let data = {
                index: playerIndex,
                type:gangType,
                card:gangMj,
                source:gangType == Enum.GangType.MING_GANG ? this.prePlayer : playerIndex,
                isFirst:isFirst
            };
            this.gangRecord.push(data);
            this.nextPlayer = playerIndex;
            if (gangType == Enum.GangType.MING_GANG) {
                let prePlay = this.players[this.prePlayer];
                prePlay.handCards.delPlayedMj();
            }
            player.gangFlag = true;
            DEBUG("杠牌成功");
            this.resetGrabState();
            let info = {type :gangType,playerIndex, targetIndex : this.prePlayer,card:gangMj};
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_GANG, info,[playerIndex]);
            info.handCards = player.handCards.mjList();
            player.sendMsg(ProtoID.CLIENT_GAME_DO_GANG, info);
            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            this.isGRAB = false;
            if (this.roundOver()) {
                if(this.opts.isLJSF){
                    this.billGang();
                }
                this.billHua();
                this.onSettement();
                return;
            } else {
                this.doDraw(playerIndex);   //摸牌
            }
        }
        this.setAutoT(player, req);
    }
    /**
     * 是否首张被杠
     */
    isFirstGang(gangType) {
        if(this.playNum == 2){
            return false;
        }
        if(gangType != Enum.GangType.MING_GANG){
            return false;
        }
        if(this.prePlayMj == 0){
            return false;
        }
        if(this.prePlayer != this.dealer){
            return false;
        }
        let dealerPlayer = this.players[this.dealer];
        if(dealerPlayer.firstCard != this.prePlayMj){
            return false;
        }
        this.firstGang = true;
        return true;
    }
    /**
     * 玩家请求吃牌
     * @param uid
     * @param card
     */
    onPlayerReqChiCard(uid,arrayIndex) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if (player.chiState != Enum.GrabState.GRABING){
            DEBUG(player.name + "game not chi status");
            return false;
        }
        if(!this.isGRAB){
            ERROR("不是抢牌阶段 不能吃牌");
            return false;
        }
        let chiTbl = player.handCards.chiAble(this.prePlayMj);
        if (chiTbl.length <= 0 || !chiTbl[arrayIndex]){
            DEBUG("no can chi cards");
            return false;
        }
        player.chiIdx = arrayIndex;
        this.doChi(playerIndex, arrayIndex, true);
    }
    /**
     * 吃牌
     * @param playerIndex
     * @param card
     * @param chiIdx
     */
    doChi(playerIndex, chiIdx, req) {
        let card = this.prePlayMj;
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        player.setGRabState(1);
        this.clearHusByIndex(playerIndex);
        if (!this.huIng() && !this.huIng() && !this.pengGangIng() && !this.pengGanged()){
            let chiTbl = player.handCards.chiAble(card);
            let mjs = chiTbl[chiIdx];
            player.handCards.chi(mjs, card);
            player.handCards.menQing = false;
            let prePlay = this.players[this.prePlayer];
            prePlay.handCards.delPlayedMj();
            this.nextPlayer = playerIndex;
            this.resetGrabState();
            this.cpgFlag = true;
            this.isGRAB = false;
            let time = this.getAutoCardTime(playerIndex);
            this.sendActionTimer(time);
            let packNum = this.calcPackCardNum(playerIndex);
            if(packNum >= 3){
                player.updatePackInfo(packNum, this.prePlayer);
            }
            player.sendMsg(ProtoID.CLIENT_GAME_DO_CHI,{playerIndex, targetIndex:this.prePlayer,card:card,cards:mjs, handCards:player.handCards.mjList()});
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_CHI,{playerIndex, targetIndex:this.prePlayer,card:card,cards:mjs},[playerIndex]);
            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            if(player.handCards.getTotalCount() % 3 == 2) {
                this.calcTingMsg(player);
                player.handCards.lastMj = 0;
                let card = this.setAutoMj(playerIndex);
                this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ,{curPlayIndex:playerIndex, lastPlayIndex:this.prePlayer,isPlayedCard : false});
                player.setAutoFun(this.doPlay, [playerIndex, card]);
                player.scheJob = setTimeout(function () {
                    this.doPlay(playerIndex, card);
                }.bind(this), time);
            }else{
                ERROR("吃完牌后, 玩家手里牌的数量不正确");
            }
        }
        this.setAutoT(player, req);
    }
    /**
     * 重置抢牌状态
     */
    resetGrabState() {
        for (let index in this.players) {
            let p = this.players[index];
            p.resetGrabState();
            p.clearAutoPlayer();
        }
    }
    /**
     * 正在抢胡
     */
    huIng() {
        for(let idx in this.players){
            let player = this.players[idx];
            if (player.huState == Enum.GrabState.GRABING){
                return true;
            }
        }
        return false;
    }
    /**
     * 抢过胡
     */
    hued() {
       for(let idx in this.players){
           let player = this.players[idx];
           if(player.huState == Enum.GrabState.GRABED){
               return true;
           }
       }
       return false;
    }
    /**
     * 碰杠正在进行
     * @param index
     * @returns {boolean}
     */
    pengGangIng(index) {
        for (let idx in this.players) {
            let player = this.players[idx];
            if(player.pengState == Enum.GrabState.GRABING || player.gangState == Enum.GrabState.GRABING) {
                return true;
            }
        }
        return false;
    }
    /**
     * 抢牌有人正在碰、杠或者正在碰杠
     */
    pengGanged() {
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.pengState == Enum.GrabState.GRABED || player.gangState == Enum.GrabState.GRABED) {
                return true;
            }
        }
        return false;
    }
    /**
     * 抢牌是否结束
     * @return {boolean}
     */
    grabOver() {
        for (let index in this.players) {
            let p = this.players[index];
            if (p.pengState == Enum.GrabState.GRABING || p.gangState == Enum.GrabState.GRABING || p.chiState == Enum.GrabState.GRABING || p.huState == Enum.GrabState.GRABING) {
                return false;
            }
        }
        return true;
    }
    /**
     * 天胡地胡
     */
    isTDH(playerIndex) {
        if(this.dealer === playerIndex) {
            if (this.publicCards.played.length === 0) {
                this.TH = true;
            }
        }
        let dealerPlayer = this.getPlayerByIndex(this.dealer);
        let player = this.getPlayerByIndex(playerIndex);
        if(dealerPlayer.handCards.played.length === 0 && this.publicCards.played.length === 1 && player.handCards.played.length === 0 && this.cpgFlag === false){
            this.DH = true;
        }
        // 以前方法
        // let plusNum = this.publicCards.num;
        // let maxNum = this.publicCards.maxNum;
        // if(plusNum + this.playNum * 13 + 1 == maxNum && this.cpgFlag == false){
        //     if(playerIndex == this.dealer) {
        //         this.TH = true;
        //     }else{
        //         this.DH = true;
        //     }
        // }
    }
    /**
     * 计算连庄数量
     * @returns {number}
     */
    calcLz() {
        let sum = 0;
        for(let idx = this.dealered.length - 1; idx >= 0; idx--){
            if(this.dealered[idx] == this.dealer){
                sum++;
            }else{
                break;
            }
        }
        return sum;
    }
    /**
     * 玩家抢牌并发送结果给玩家
     * @param playerIdx
     * @param card
     * @param returnHuFlag
     * @returns {*}
     */
    isGrab(playerIdx,card, returnHuFlag, onlyHu) {
        let player = this.players[playerIdx];
        let chiInfo = {isSuccess:false},pengInfo = {isSuccess:false},gangInfo = {isSuccess:false},huInfo = {isSuccess:false};
        if ((this.prePlayer % this.playNum) + 1 == playerIdx && this.prePlayMj != 0 && !this.opts.isBKC && player.handCards.getTotalCount() % 3 != 2){
            let chiTbl = player.handCards.chiAble(card);
            if(chiTbl.length > 0){
                chiInfo.isSuccess = true;
                chiInfo.info = chiTbl;
            }
        }
        if(player.handCards.getTotalCount() % 3 != 2) {
            if(player.handCards.pengAble(card)) {
                pengInfo.info = card;
                pengInfo.isSuccess = true;
            }
        }
        let gangMjs = [];
        if(player.handCards.getTotalCount() % 3 == 2) {     // 自摸
            let mjs = Enum.AllMj;
            for(let idx in mjs) {
                let gangType = player.handCards.gangType(mjs[idx]);
                if (player.handCards.contains(mjs[idx]) && (gangType == Enum.GangType.AN_GANG || gangType == Enum.GangType.PASSROAD)) {
                    gangMjs.push({type:gangType, card:mjs[idx]});
                }
            }
            /*
            if(player.handCards.gangType(card) == Enum.GangType.PASSROAD) {
                gangMjs.push({type: Enum.GangType.PASSROAD, card: card})
            }
            */
        }else{
            let gangType = player.handCards.gangType(card);
            if(gangType){
                gangMjs.push({type:gangType, card:card});
            }
        }
        if(gangMjs.length > 0){
            gangInfo.isSuccess = true;
            gangInfo.info = gangMjs;
        }
        // 胡牌
        if(player.handCards.getTotalCount() % 3 == 2) {
            player.handCards.zmHu = true;
            let huType = Func.huPai(player.handCards);
            if(huType != null) {
                huInfo.isSuccess = true;
                huInfo.card = 0;
            }
        }else{
            let huType = player.handCards.calcHuMjs(card);
            if(huType != null){
                huInfo.isSuccess = true;
                huInfo.card = card;
                huInfo.type = huType;
            }
        }
        if(!huInfo.isSuccess){
            player.gangFlag = false;
            player.huaFlag = false;
        }
        if(onlyHu){
            chiInfo.isSuccess = false;
            pengInfo.isSuccess = false;
            gangInfo.isSuccess = false;
        }
        let time = this.getAutoCardTime(playerIdx);
        if(chiInfo.isSuccess || pengInfo.isSuccess || gangInfo.isSuccess || huInfo.isSuccess){
            this.isGRAB = true;
            DEBUG("进入抢牌阶段" + JSON.stringify(pengInfo) + "\n\r杠: " + JSON.stringify(gangInfo) + "\n\r胡: " + JSON.stringify(huInfo));
            player.chiState = chiInfo.isSuccess ? Enum.GrabState.GRABING: null;
            player.pengState = pengInfo.isSuccess ? Enum.GrabState.GRABING: null;
            player.gangState = gangInfo.isSuccess ? Enum.GrabState.GRABING: null;
            player.huState = huInfo.isSuccess ? Enum.GrabState.GRABING: null;
            let data = this.makeGrabClientMsg(chiInfo, pengInfo, gangInfo, huInfo);
            player.task = data;
            if(this.prePlayMj == 0){
                setTimeout(function () {
                    player.sendMsg(ProtoID.GAME_CLIENT_PGTH_INFO, {tasks:data,playerIndex:playerIdx});
                }, 1000)
            }else{
                player.sendMsg(ProtoID.GAME_CLIENT_PGTH_INFO, {tasks:data,playerIndex:playerIdx});
            }
            if(huInfo.isSuccess){
                player.setAutoFun(this.doHu,[playerIdx,card]);
                player.scheJob = setTimeout(function () {
                    this.doHu(player.index,card);
                }.bind(this),time)
            }else {
                if(player.isRobot()) {
                    if (gangInfo.isSuccess) {
                        let idx = Math.floor(Math.random() * gangInfo.info.length);
                        let mjId = gangInfo.info[idx].card;
                        player.setAutoFun(this.doGang, [playerIdx, mjId]);
                        player.scheJob = setTimeout(function () {
                            this.doGang(player.index, mjId);
                        }.bind(this), time)
                    } else if (pengInfo.isSuccess) {
                        player.setAutoFun(this.doPeng, [playerIdx, card]);
                        player.scheJob = setTimeout(function () {
                            this.doPeng(player.index, card);
                        }.bind(this), time)
                    } else if (chiInfo.isSuccess) {
                        player.setAutoFun(this.doChi, [playerIdx, 0]);
                        player.scheJob = setTimeout(function () {
                            this.doChi(player.index, 0);
                        }.bind(this), time)
                    } else {
                        player.setAutoFun(this.doPass, [playerIdx]);
                        player.scheJob = setTimeout(function () {
                            this.doPass(player.index);
                        }.bind(this), time);
                    }
                }else{
                    player.setAutoFun(this.doPass, [playerIdx]);
                    player.scheJob = setTimeout(function () {
                        this.doPass(player.index);
                    }.bind(this), time);
                }
            }
        }else{
            player.task = {};
            if(player.handCards.getTotalCount() % 3 == 2) {
                this.calcTingMsg(player);
                let mjID = this.setAutoMj(playerIdx);
                player.setAutoFun(this.doPlay, [playerIdx, mjID]);
                player.scheJob = setTimeout(function () {
                    this.doPlay(player.index, mjID);
                }.bind(this), time);
            }
        }
        if(returnHuFlag){
            return huInfo.isSuccess;
        }
    }
    /**
     * 计算听牌消息
     */
    calcTingMsg (player) {
        let tings = player.handCards.calTingMjs();
        if(Object.keys(tings).length > 0){
            player.sendMsg(ProtoID.GAME_CLIENT_TINGS, {tings : tings});
        }
    }
    /**
     * 生成抢牌结果信息
     * @param chiInfo
     * @param pengInfo
     * @param gangInfo
     * @param huInfo
     * @returns {{}}
     */
    makeGrabClientMsg(chiInfo, pengInfo, gangInfo, huInfo) {
        let data = {};
        if(chiInfo.isSuccess){
            data.chi = chiInfo.info;
        }
        if(pengInfo.isSuccess){
            data.peng = pengInfo.info;
        }
        if(gangInfo.isSuccess){
            data.gang = [];
            for(let idx in gangInfo.info){
                data.gang.push(gangInfo.info[idx].card);
            }
        }
        if(huInfo.isSuccess){
            data.hu = huInfo.card
        }
        return data;
    }
    /**
     * 玩家请求胡牌
     * @param uid
     */
    onPlayerReqHuCard(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if (!this.isGRAB) {
            ERROR(util.format("玩家[%d]不再抢牌阶段，不能胡牌"), uid);
            return;
        }
        if(player.huState != Enum.GrabState.GRABING){
            ERROR(util.format("玩家[%d]不能胡牌,不在抢牌阶段"), uid);
        }
        player.huState = Enum.GrabState.GRABED;
        if(this.isNowHu(playerIndex)){
            this.doHu(playerIndex);
        }
    }
    /**
     * 判断是够现在就胡
     */
    isNowHu(huIdx){
        if(Object.keys(this.grabHus).length == 0){
            return true;
        }
        for(let loop = 1; loop < this.playNum; loop++){
            if(this.grabHus[loop].isHu){
                if(this.grabHus[loop].playerIndex == huIdx){
                    return true;
                }else{
                    return false;
                }
            }
        }
        return false;
    }
    /**
     * 计算第一个胡牌的玩家
     * @returns {number}
     */
    calcHuIndex() {
        if(Object.keys(this.grabHus).length == 0){
            return 0;
        }
        for(let loop = 1; loop < this.playNum; loop++){
            if(this.grabHus[loop].isHu){
                return this.grabHus[loop].playerIndex;
            }
        }
        return 0;
    }
    /**
     * 清除胡牌信息
     * @param huIndex
     * @returns {boolean}
     */
    clearHusByIndex(huIndex) {
        if(Object.keys(this.grabHus).length == 0){
            return;
        }
        for(let loop = 1; loop < this.playNum; loop++){
            if(this.grabHus[loop].playerIndex == huIndex){
                return this.grabHus[loop].isHu = false;
            }
        }
    }
    /**
     * 计算杠胡
     * @param gangIdx
     * @param card
     * @returns {boolean}
     */
    calcGangHu(gangIdx, card) {
        let startIdx = gangIdx, huIdx = 0;
        this.grabHus = {};
        let haveHu = false;
        for(let loop = 1; loop < this.playNum; loop++){
            huIdx = this.getNextPlayerIndex(startIdx);
            this.calcGangHuing = true;
            let isHu = this.isGrab(huIdx, card, true, true);
            this.calcGangHuing = false;
            this.grabHus[loop] = {isHu:isHu, playerIndex : huIdx};
            if(isHu){
                haveHu = true;
            }
            startIdx = huIdx;
        }
        return haveHu;
    }
    /**
     * 增加过路杠的挂起信息
     * @param playerIndex
     * @param card
     */
    addPassRoadTask(playerIndex, card) {
        this.grabPassRoad = true;
        this.passGangPlay = playerIndex;
        this.passGangMj = card;
    }
    /**
     * 清理过路杠索引信息
     */
    clearPassRoadTask () {
        this.grabPassRoad = false;
        this.passGangPlay = 0;
        this.passGangMj = 0;
    }
    /**
     * 胡牌
     * @param playerIndex
     * @param huType
     * @param huMj
     * @param isZM
     */
    doHu(playerIndex) {
        let player = this.players[playerIndex];
        this.hus.push(playerIndex);
        let huMj = 0, isZM = false, huType = null;
        this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
        if(player.handCards.getTotalCount() % 3 == 2) {
            player.handCards.zmHu = true;
            huType = Func.huPai(player.handCards);
            huMj = player.handCards.lastMj;
            isZM = true;
            player.taskParams.selfStroke = true;
        }else{
            huMj = this.prePlayMj;
            if(this.grabPassRoad){
                huMj = this.passGangMj
            }
            huType = player.handCards.calcHuMjs(huMj);
            player.handCards.addMjs(huMj);
            isZM = false;
        }
        player.taskParams.win = true;
        if(huType == null){
            ERROR("玩家不能胡牌，检查是否作弊");
            return;
        }
        DEBUG("胡牌成功");
        this.isGRAB = false;
        this.resetGrabState();
        if(this.grabPassRoad){
            player.passHuIndex = this.passGangPlay;
            let passP = this.players[this.passGangPlay];
            passP.handCards.removeMjs(huMj);
        }
        player.clearAutoPlayer();
        player.handCards.huMj = huMj;
        player.huNum += 1;
        //计算基础牌型分
        this.isTDH(playerIndex);
        let data = player.handCards.getBaseTypeScore(huType, isZM);
        this.huType2Msg = data.msg;
        //结算杠
        this.billGang();
        this.billHu(playerIndex,data.score, isZM);
        this.billHua(data.score);
        let targetIndex = this.paoIdx == 0 ? playerIndex : this.paoIdx;
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_HU, {playerIndex:playerIndex, targetIndex: targetIndex, card: huMj, type: huType});
        this.onSettement(playerIndex);
    }
    /**
     * 是否首张被跟
     */
    isFirstGen() {
        if(this.playNum != 2){
            let card = -1;
            for(let idx in this.players){
                let player = this.players[idx];
                if(player.firstCard == 0){
                    return false;
                }else{
                    if(card == -1){
                        card = player.firstCard;
                    }else{
                        if(player.firstCard != card){
                            return false;
                        }
                    }
                }
            }
            return true;
        }else{
            return false;
        }
    }
    /**
     * 计算杠分
     */
    billGang() {
        // 是否有首张被跟
        if(this.isFirstGen()){
            let data = {
                index: this.dealer,
                type:Enum.GangType.MING_GANG,
                card:0,
                source:0,
                isFirst:false,
                gen:true
            };
            this.firstGen = true;
            this.gangRecord.push(data);
        }
        for(let idx = 0; idx < this.gangRecord.length; idx++){
            let index = this.gangRecord[idx].index;
            let type = this.gangRecord[idx].type;
            let source = this.gangRecord[idx].source;
            let isFirst = this.gangRecord[idx].isFirst;
            let gen = this.gangRecord[idx].gen;
            let player = this.players[index];
            let isBao = false;
            if(this.opts.isFGJ && type == Enum.GangType.MING_GANG){
                isBao = true;
            }
            if(isFirst){
                isBao = true;
            }
            let allScore = 0;
            for(let playerIndex = 1; playerIndex <= this.playNum; playerIndex++){
                if(index == playerIndex){
                    continue;
                }
                let otherPlayer = this.players[playerIndex];
                let finaScore = Math.max(otherPlayer.curGaScore, 0) + Math.max(player.curGaScore, 0) +  1;                    // 计算嘎
                if(this.opts.isZX && (this.dealer == playerIndex || index == this.dealer)){      // 庄闲
                    finaScore += 1;
                }
                if(this.opts.isLZ && (this.dealer == playerIndex || index == this.dealer)){      // 连庄
                    finaScore += this.calcLz();
                }
                if(type == Enum.GangType.AN_GANG){
                    finaScore = finaScore *  2;
                }

                if(gen){
                    allScore -= finaScore;
                    this.huScoreInfo[playerIndex] += finaScore;
                }else {
                    allScore += finaScore;
                    if (isBao) {
                        this.gangScoreInfo[source] -= finaScore;
                    } else {
                        this.gangScoreInfo[playerIndex] -= finaScore;
                    }
                }
            }
            if(gen){
                this.huScoreInfo[index] += allScore;
            }else {
                this.gangScoreInfo[index] += allScore;
            }
        }
    }
    /**
     * 结算花胡
     * @param baseScore
     */
    billHua() {
        for(let index in this.players){
            let player = this.players[index];
            let huaRate = player.calcHuaRate();
            let allScore = 0;
            if(huaRate != 0) {
                for (let playerIndex = 1; playerIndex <= this.playNum; playerIndex++) {
                    if (index == playerIndex) {
                        continue;
                    }
                    let otherPlayer = this.players[playerIndex];
                    let finaScore = Math.max(otherPlayer.curGaScore, 0) + Math.max(player.curGaScore, 0) +  1;           // 计算嘎
                    if (this.opts.isZX && (this.dealer == playerIndex || index == this.dealer)) {      // 庄闲
                        finaScore += 1;
                    }
                    if (this.opts.isLZ && (this.dealer == playerIndex || index == this.dealer)) {      // 连庄
                        finaScore += this.calcLz();
                    }
                    finaScore = finaScore * huaRate;
                    allScore += finaScore;
                    this.huaScoreInfo[playerIndex] -= finaScore;
                }
            }
            this.huaScoreInfo[index] += allScore;
        }
    }
    /**
     * 计算胡分
     * @param index
     * @param isZM
     * @param mult
     */
    billHu(index, baseScore,isZM) {
        let isBao = false;
        let bao = [];
        if(this.opts.isFGJ && isZM == false){
            isBao = true;
        }
        let isYF = this.opts.isYF;
        let player = this.players[index];
        let passHuIndex = player.passHuIndex;
        // 是抢杠胡 有番选项要剔除有番 算包牌
        if(passHuIndex != 0){
            if(!Func.isCanHu(player.handCards)){
                isBao = true;
            }
        }
        this.paoIdx = 0;
        if(!isZM){
            this.paoIdx = this.prePlayer;
            if(this.grabPassRoad){
                this.paoIdx = this.passGangPlay;
            }
        }
        if(passHuIndex != 0){
            this.paoIdx = passHuIndex;
        }
        // 最后一圈包牌
        if(this.hdb) {
            isBao = true;
        }
        if(isBao){
            bao.push(this.paoIdx);
        }
        // 计算包赔信息
        let packBao = this.calcPack(index, isZM, isBao);
        if(packBao.length != 0){
            bao = packBao;
        }
        // 记录点炮
        if(this.paoIdx === 0){
            player.handCards.zimoNum++;
        }else{
            let paoPlayer = this.players[this.paoIdx];
            player.handCards.jieNum++;
            paoPlayer.handCards.dianNum++;
        }
        let allScore = 0;
        for(let playerIndex = 1; playerIndex <= this.playNum; playerIndex++){
            if(index == playerIndex){
                continue;
            }
            let otherPlayer = this.players[playerIndex];
            let finaScore = Math.max(otherPlayer.curGaScore, 0) + Math.max(player.curGaScore, 0) +  1;
            if(this.opts.isZX && (this.dealer == playerIndex || index == this.dealer)){
                finaScore += 1;
            }
            if(this.opts.isLZ && (this.dealer == playerIndex || index == this.dealer)){
                finaScore += this.calcLz();
            }
            finaScore = finaScore * baseScore;
            if(playerIndex == this.paoIdx){
                finaScore += 1;
            }
            allScore += finaScore;
            let baoLen = bao.length;
            if(baoLen == 1 || baoLen == 2){
                for(let idx in bao){
                    let baoIndex = bao[idx];
                    this.huScoreInfo[baoIndex] -= Math.floor(finaScore / baoLen);
                }
            }else{
                this.huScoreInfo[playerIndex] -= Math.floor(finaScore);
            }
        }
        this.huScoreInfo[index] += Math.floor(allScore);
    }
    /**
     * 计算包赔
     */
    calcPack(huIndex, isZM, isBao) {
        let bao = [];
        let msg = "";
        let huPlayer = this.players[huIndex];
        if(this.playNum == 2){
            return bao;
        }
        if(!isZM) {
            let isRelation = false;
            if (huPlayer.packInfo.num >= 3) {
                if (huPlayer.packInfo.playerIndex == this.paoIdx) {
                    msg = huPlayer.packInfo.num == 3 ? "三道包" : "四道包";
                    isRelation = true;
                }
            }
            let paoPlayer = this.players[this.paoIdx];
            if (paoPlayer.packInfo.num >= 3) {
                if (paoPlayer.packInfo.playerIndex == huIndex) {
                    msg = paoPlayer.packInfo.num == 3 ? "三道包" : "四道包";
                    isRelation = true;
                }
            }
            if(isRelation){
                this.huType2Msg += " " + msg;
                bao.push(this.paoIdx);
            }
        }else{
            if (huPlayer.packInfo.num == 4) {
                bao.push(huPlayer.packInfo.playerIndex);
            }
            for(let idx in this.players){
                if(idx != huIndex){
                    let player = this.players[idx];
                    if(player.packInfo.num == 4){
                        if(player.packInfo.playerIndex == huIndex){
                            bao.push(+idx);
                        }
                    }
                }
            }
            if(bao.length > 0){
                this.huType2Msg += " 四道包";
            }
        }
        if(isBao){
            return [];
        }else {
            return bao;
        }
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
     * 结算最终的结果
     * @returns {{}}
     */
    billFinaResult () {
        // 金币场结算金豆
        let totalScore = {};
        let realScore = {};
        let addBean = 0;
        for(let idx in this.players) {
            totalScore[idx] = (this.gangScoreInfo[idx] + this.huScoreInfo[idx] + this.huaScoreInfo[idx]) * this.baseBean;
            if(totalScore[idx] >= 0){                    // 拉取正数
                addBean += totalScore[idx];
            }
        }
        let maxBean = this.maxBean - this.serverCost;
        let delBean = 0;
        for(let idx in this.players) {
            let player = this.players[idx];
            let bean = player.bean;
            let needBean = totalScore[idx];
            if(needBean < 0){
                let realBean = Math.abs(needBean) > bean ? bean : Math.abs(needBean);
                realBean = Math.min(maxBean, realBean);
                delBean += realBean;
                player.updateCoin(1, -realBean, eventType.MATCH);
                player.taskParams.winLoseBean = -realBean;
                this.checkTask(player);
                realScore[idx] = -realBean;
            }
        }
        for(let idx in this.players) {
            let player = this.players[idx];
            let needBean = totalScore[idx];
            if(needBean >= 0){
                if(addBean == delBean){
                    player.updateCoin(1, needBean, eventType.MATCH);
                    this.displayNotice(player, needBean);
                    player.taskParams.winLoseBean = needBean;
                    this.checkTask(player);
                    realScore[idx] = needBean;
                }else{
                    let temp = Math.floor(delBean * (needBean / addBean));
                    player.updateCoin(1, temp, eventType.MATCH);
                    this.displayNotice(player, temp);
                    player.taskParams.winLoseBean = temp;
                    this.checkTask(player);
                    realScore[idx] = temp;
                }
            }
        }
        return realScore;
    }

    displayNotice(player, bean) {
        if(bean >= this.maxBean){
            let data = GameMgr.getInsertMsg(this.gameType, this.subType);
            let wBean = CommFuc.wBean(bean);
            GameMgr.noticeInsertNotice(`恭喜玩家${player.name}在【${data.gameTypeMsg}】【${data.subTypeMsg}】中赢得了${wBean}万SEER`);
        }
    }
    /**
     * 获取结算配置
     */
    getSettementOpt() {
        let showOpts = clone(this.opts);
        if(this.mode == "JB") {
            let opts = {isZX:true, isLZ:true, isSG:true, isHH:true, isJL:true};
            if (this.playNum == 2) {
                opts.isBKC = true;
            }
            return opts;
        }else{
            return showOpts
        }
    }
    /**
     * 结算
     * @param playerIndex
     */
    onSettement(playerIndex) {
        let nextDealer = this.setNextDealer(playerIndex);
        this.realScoreInfo = this.billFinaResult();
        super.onSettlement();
        let settementOpt = this.getSettementOpt();
        let curSeason = this.season;
        this.setNextSeason();
        let roomInfo = {
            isHZ: playerIndex ? false : true,
            nextDealer:nextDealer,
            curRound:this.curRound,
            roundId : this.roundId,
            creator : this.creator,
            round:this.round,
            roomId:this.roomId,
            endTime:Date.getStamp(),
            huIdx:playerIndex ? playerIndex : 0,
            paoIdx:this.paoIdx,
            huMj:playerIndex ? this.players[playerIndex].handCards.huMj : 0,
            season:curSeason,
            nextSeason:this.season,
            options:settementOpt
        };
        let playerInfo = {};
        this.huIdx = playerIndex;
        for(let idx in this.players){
            let player = this.players[idx];
            playerInfo[idx] = player.getSettementInfo();
            player.clearAutoPlayer();
            player.updateWatchScore();
            player.endReset();
        }
        let finalRound = false;
        this.broadcastMsg(ProtoID.GAME_CLIENT_DJJS, {finalRound:finalRound,roomInfo:roomInfo, playerInfo: playerInfo});
        this.saveRoundIdToMySql(this.realScoreInfo);
        this.saveReportsToMiddle();
        if(this.getRealPlayerNum() === 0) {
            this.destroyRoomImmd();
        }
        this.preDealer = this.dealer;
        this.dealer = nextDealer;
        this.endReset();
    }
    /**
     * 记录详情
     */
    recordDetails(){
        let data = {};
        data.dealer = this.players[this.dealer].uid;
        for(let idx in this.players){
            let player = this.players[idx];
            data[idx] = {};
            data[idx].score = this.realScoreInfo[idx];
            data[idx].name = player.name;
            data[idx].uid = player.uid;
        }
        this.details[this.curRound] = data;
    }
    /**
     * 设置下一盘庄家
     * @param playerIndex
     */
    setNextDealer(playerIndex) {
        if(this.mode == "JB"){
            this.dealer = 1;
        }else {
            if (playerIndex == this.dealer || !playerIndex) {         // 庄家赢或者黄庄 庄家继续坐庄
                return this.dealer;
            } else {                                                  // 闲家赢
                return +playerIndex;
            }
        }
    }
    /**
     * 设置下一句时令
     */
    setNextSeason() {
        if(this.playNum == 4) {
            if (this.hus.indexOf(1) >= 0 && this.hus.indexOf(2) >= 0 && this.hus.indexOf(3) >= 0 && this.hus.indexOf(4) >= 0) {
                this.season = (this.season + 1) % 4;
                this.hus = [];
            }
        }else if(this.playNum == 2){
            if (this.hus.indexOf(1) >= 0 && this.hus.indexOf(2) >= 0) {
                this.season = (this.season + 1) % 4;
                this.hus = [];
            }
        }
    }
    /**
     * 过牌
     * @param playerIndex
     */
    doPass(playerIndex, req) {
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        player.gangFlag = false;
        if(player.huState === Enum.GrabState.GRABING){
            player.passHu = true;
        }
        player.resetGrabState();
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PASS_MJ,{playerIndex: playerIndex});
        this.clearHusByIndex(playerIndex);
        if(this.grabOver()){
            let huIndex = this.calcHuIndex();
            if(huIndex != 0){
                this.doHu(huIndex);
                return;
            }
            if(this.grabPassRoad){
                this.doGang(this.passGangPlay, this.passGangMj);
                return;
            }
            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            let time = this.getAutoCardTime(playerIndex);
            this.sendActionTimer(time);
            this.isGRAB = false;
            if(player.handCards.getTotalCount() % 3 == 2) {
                this.calcTingMsg(player);
                let card = this.setAutoMj(playerIndex);
                player.setAutoFun(this.doPlay, [playerIndex,card]);
                player.scheJob = setTimeout(function () {
                    this.doPlay(playerIndex,card);
                }.bind(this),time);
            }else{
                let pengFlag = false;
                let gangFlag = false;
                let chiFlag = false;
                for (let index in this.players) {
                    let p = this.players[index];
                    if (p.pengState == Enum.GrabState.GRABED) {
                        this.doPeng(p.index, this.prePlayMj);
                        pengFlag = true;
                        break;
                    } else if (p.gangState == Enum.GrabState.GRABED) {
                        this.doGang(p.index, p.gangCard);
                        gangFlag = true;
                        break;
                    }
                }
                if(!pengFlag && !gangFlag){
                    for (let index in this.players) {
                        let p = this.players[index];
                        if (p.chiState == Enum.GrabState.GRABED) {
                            this.doChi(p.index, p.chiIdx);
                            chiFlag = true;
                            break;
                        }
                    }
                }
                if(!chiFlag && !pengFlag && !gangFlag){
                    this.isGRAB = false;
                    this.resetGrabState();
                    this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ,{curPlayIndex:this.nextPlayer, lastPlayIndex:this.prePlayer,isPlayedCard : false});
                    this.doDraw(this.nextPlayer);
                }
            }
        }
        this.setAutoT(player, req);
    }
    /**
     * 回合是否结束
     * @return {boolean|*}
     */
    roundOver() {
        if (this.publicCards.isEmpty()) {
            return true;
        }
        return false;
    }
    /**
     * 玩家请求过
     * @param uid
     */
    onPlayerReqPass(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        if (!this.isGRAB) {
            DEBUG(util.format("玩家不在抢牌阶段，不能过", uid, this.state));
            return;
        }
        this.doPass(playerIndex, true);
    }

    /**
     * 计算自动出牌时间
     * @param playerIndex
     * @returns {number}
     */
    getAutoCardTime(playerIndex) {
        let player = this.players[playerIndex];
        let time = Enum.PLAY_CARD_TIME[this.mode];
        if(player.isRobot()){
            time = Enum.ROBOT_PLAY_CARD_TIME;
        }
        if(this.state == Enum.GameState.GA){
            time = Enum.UPGA[this.mode];
        }else {
            if (this.mode == "JB") {
                if (!player.online) {
                    time = Enum.OFF_LINE_TIME;
                }
            }
        }
        if (player.isT) {
            time = Enum.HOSTED;
        }
        return time * 1000;
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
        let sTime = isT ? 0 : Enum.CANCELHOSTED[this.mode];
        if(player.autoFun){
            sameCall(sTime,player);
        }
        if(!isT) {
            let time = this.getAutoCardTime(playerIndex);
            this.sendActionTimer(time);
        }
        function sameCall(sTime,player) {
            if(player.autoFun == player.owner.doPlay) {
                if (player.autoParam[1] != null) {
                    player.scheJob = setTimeout(function () {
                        player.owner.doPlay(player.autoParam[0], player.autoParam[1]);
                    }.bind(player), sTime*1000)
                }
            }else if(player.autoFun == player.owner.doPass){
                player.scheJob = setTimeout(function () {
                    player.owner.doPass(player.autoParam[0]);
                }.bind(player), sTime*1000)
            }else if(player.autoFun == player.owner.doHu){
                player.scheJob = setTimeout(function () {
                    player.owner.doHu(player.autoParam[0],player.autoParam[1]);
                }.bind(player), sTime*1000)
            }else if(player.autoFun == player.owner.doPeng) {
                player.scheJob = setTimeout(function () {
                    player.owner.doPeng(player.autoParam[0], player.autoParam[1]);
                }.bind(player), sTime*1000)
            }else if(player.autoFun == player.owner.doGang){
                player.scheJob = setTimeout(function () {
                    player.owner.doGang(player.autoParam[0], player.autoParam[1]);
                }.bind(player), sTime*1000)
            }else if(player.autoFun == player.owner.doChi){
                player.scheJob = setTimeout(function () {
                    player.owner.doChi(player.autoParam[0], player.autoParam[1]);
                }.bind(player), sTime*1000)
            }else if(player.autoFun == player.owner.startGaReq){
                player.scheJob = setTimeout(function () {
                    player.owner.startGaReq(player.autoParam[0], player.autoParam[1]);
                }.bind(player), sTime*1000)
            }
        }
        this.broadcastMsg(ProtoID.CLIENT_GAME_TG,{playerIndex:playerIndex,isT:isT})
    }
    /**
     * 计算包牌次数
     * @param playerIndex
     * @returns {number}
     */
    calcPackCardNum(playerIndex) {
        let player = this.players[playerIndex];
        let prePlayerIndex = this.prePlayer;
        let num = 0;
        for(let idx in player.handCards.chi_mjs){
            if(player.handCards.chi_mjs[idx].target == prePlayerIndex){
                num++;
            }
        }
        for(let idx in player.handCards.peng_mjs){
            if(player.handCards.peng_mjs[idx] == prePlayerIndex){
                num++;
            }
        }
        for(let idx in player.handCards.gang_mjs){
            if(player.handCards.gang_mjs[idx].type == Enum.GangType.PASSROAD){
                if(player.handCards.gang_mjs[idx].source == prePlayerIndex){
                    num++;
                }
            }
        }
        return num;
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
     * 设置准备倒计时
     * @param playerIndex
     */
    setReadyEvent(playerIndex, time) {
        let player = this.players[playerIndex];
        if (!player.isRobot()) {
            player.scheJob = setTimeout(function () {
                this.cancelMatch(player.uid, true);
            }.bind(this, player),time );
        }
        player.setActionTimer(ActionType.READY, time);
    }

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
};

exports.Room = HNMj;
