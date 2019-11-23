let Enum            = require("./Enum.js");
let Player          = require("./Player.js").Player;
let CommFuc         = require("../../../util/CommonFuc.js");
let Room            = require("../../base/room");
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../../net/CSProto.js").ProtoState;
let ActionType      = require("../../../net/CSProto.js").ActionType;
let eveIdType       = require("../../../net/CSProto.js").eveIdType;
let Func            = require("./Func.js");
let util            = require("util");


class PublicCards {
    constructor(owner){
        this.owner = owner;
        this.reset();
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
            let mjId = Enum.AllMj[idx];
            if(this.owner.subType === 1 && mjId >= 30){
                continue;
            }
            for (let num = 0; num < 4; num++) {
                originCards.push(mjId);
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
        this.num = 108;
        let originCards = [];
        for (let idx = 0; idx < Enum.AllMj.length; idx++) {
            for (let num = 0; num < 4; num++) {
                originCards.push(Enum.AllMj[idx]);
            }
        }
        // 测试牌型 3 TDW
        let player1Cards = [12, 13, 18, 18, 18, 19, 19, 21, 21, 21, 24, 25, 26];
        let player2Cards = [14, 14, 14, 18, 19, 17, 15, 15, 15, 16, 16, 16, 11];
        let player3Cards = [14, 14, 14, 36, 22, 17, 15, 15, 15, 16, 16, 16, 11];
        let player4Cards = [14, 14, 14, 31, 22, 17, 15, 15, 15, 16, 16, 16, 11];
        // 测试牌型 4
        // let player1Cards = [11, 11, 17, 17, 13, 13, 14, 14, 16, 16, 16, 16, 12];
        // let player2Cards = [11, 11, 17, 17, 13, 13, 14, 14, 16, 16, 16, 16, 12];
        // let player3Cards = [11, 11, 17, 17, 13, 13, 14, 14, 16, 16, 16, 16, 12];
        // let player4Cards = [11, 11, 17, 17, 13, 13, 14, 14, 16, 16, 16, 16, 12];

        // let player1Cards = [11, 11, 17, 17, 13, 13, 14, 14, 16, 16, 16, 16, 12];
        // let player2Cards = [12, 13, 17, 17, 17, 14, 14, 14, 16, 16, 16, 19, 19];
        // let player3Cards = [12, 13, 17, 17, 17, 14, 14, 14, 16, 16, 16, 19, 19];
        // let player4Cards = [12, 13, 17, 17, 17, 14, 14, 14, 16, 16, 16, 19, 19];
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
        // this.tempChiCard(1,[21,22,23],23,4);
        // this.tempChiCard(1,[35,36,37],37,4);

        // this.tempGangCard(3,11,1, 2);
        // this.tempGangCard(3,12,1, 2);

        for(let idx = 0; idx < 20; idx++){
            this.tempAddCard(11);
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
        return this.num <= 0;
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
        this.num = this.getMaxNum();
        this.maxNum = this.getMaxNum();
    }
    /**
     * 得到最大牌数
     */
    getMaxNum(){
        if(this.owner.subType === 1){
            return 72;
        }else if(this.owner.subType === 2){
            return 108;
        }
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
///////////////////////////////////////////////////////////////////////////////
//>>房间

class XZRoom extends Room{
    constructor(data){
        super(data);
        this.gameType = 8;                      // 游戏类型
        this.actionTimer = {};                  // 挂起事件
        // game property
        this.publicCards = null;                // 公牌信息
        this.dealer = 0;                        // 当前庄家
        this.preDealer = 0;                     // 上一盘的

        this.prePlayer = 0;                     // 上一个玩家
        this.prePlayMj = 0;                     // 上一个出牌麻将
        this.nextPlayer = 0;                    // 下一个玩家

        this.isGRAB = false;                    // 是否正在抢牌
    }


    init(cArgs) {
        super.init(cArgs);
        this.state = Enum.GameState.READY;
        this.playNum = this.getMaxPlayerNum();
        for (let idx = 1; idx <= this.playNum; ++idx) {
            this.players[idx] = new Player(this, idx);
        }
        this.publicCards = new PublicCards(this);
        this.dealer = 1;
        this.opts.maxMult = this.opts.maxMut || 32;
        this.opts.isBKC = true;
        this.pvpInfo = [];
        return true;
    }

    getMaxPlayerNum(){
        return this.subType === 1 ? 2 : 4;
    }

    isCanStart(){
        if(this.playing === false && this.getReadyPlayerNum() >= this.getMaxPlayerNum()){
            return true;
        }else{
            return false;
        }
    }



    onPlayerEnter(uid){
        let player = this.getPlayerByUid(uid);
        if(!this.playing && player.uid !== this.creator) {
            ERROR(player.name + "设置了准备事件");
            this.setReadyEvent(player.index, Enum.READY_SECOND[this.mode] * 1000);
        }
    }

    setReadyEvent(playerIndex, time) {
        let player = this.getPlayerByIndex(playerIndex);
        if (!player.isRobot()) {
            player.scheJob = setTimeout(function () {
                this.quitRoom(player.uid);
            }.bind(this, player),time);
        }
        player.setActionTimer(ActionType.READY, time);
    }

    subGameChange(player){
        if(this.playing) {
            if (player.playing) {
                if (!player.isHu && !player.isGoOut()) {
                    return false;
                }
            }
        }
        return true;
    }

    onPlayerChange(player){
        if (player.playing) {
            player.giveUpExit = true;
        }
    }

    endReset() {
        this.playing = false;
        this.gameOver = true;
        this.state = Enum.GameState.READY;
        this.curRound += 1;
        if(this.curRound > this.round){
            this.curRound = this.round;
        }
    }

    /**
     * 获取房间信息
     *
     */
    getRoomInfo() {
        let data = super.getRoomInfo();
        data.playStatus = this.state;
        data.publicCardsNum = this.publicCards.getRemain();
        data.curPlayIndex = this.nextPlayer;
        data.lastPlayIndex = this.prePlayer;
        data.lastPlayCard = this.prePlayMj;
        data.isPlayedCard = false;
        data.isExistHangupTasks = this.isGRAB;
        data.actionTimer = this.actionTimer;
        data. destroyInfo = {
            playerIndex:this.destroyIndex,
            destroyTime:this.destroyTime,
            duration:Enum.ROOM_VOID_TIME * 1000
        }
        return data;
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

    startReset(){
        this.nextPlayer = this.dealer;                  // 设置出牌的玩家
        this.grabPassRoad = false;                      // 抢的牌是否是过路杠
        this.prePlayer = 0;                             // 上一个玩家
        this.prePlayMj = 0;                             // 上一个出牌麻将
        this.passGangPlay = 0;                          // 过路杠的玩家idx
        this.passGangMj = 0;                            // 过路杠的麻将
        this.huType2Msg = "";                           // 胡牌类型
        this.TH = false;                                // 天胡标记
        this.DH = false;                                // 地胡标记
        this.cpgFlag = false;                           // 吃过、碰过、杠过的标记
        this.playing = true;                            // 开始新一轮的标志
        this.isGRAB = false;                            // 是否正在抢牌
        this.hdb = false;                               // 海底包牌
        this.resetDestory();                            // 重置解散房间数据
        this.missCards = {};                            // 换牌信息
        this.getCards = {};                             // 换牌信息
        this.pvpInfo = [];                              // 对局信息
        this.huOrder = 0;                               // 胡牌的顺序
        this.nextDealer = 0;                            // 下一盘的庄家
        this.nextTempDealer = 0;                        // 临时记录的下盘庄家
        this.GSSPlayers = [];                           // 一炮多响杠上花要平分杠钱
        this.CJFlag = false;                            // 是否查叫的标志
    }
    /**
     * 重写准备消息
     * @param uid
     * @param isReady
     */
    onPlayerReady(uid, isReady) {
        if(this.playing && this.mode === "JB"){
            ERROR("已经开始游戏了");
            return;
        }
        let playerIndex = this.getPlayerIndex(uid);
        if(playerIndex === 0){
            ERROR("玩家不存在此房间");
            return;
        }
        let player = this.players[playerIndex];
        if(player.bean < this.enterBean){
            player.sendMsg(ProtoID.CLIENT_GAME_READY,{playerIndex: playerIndex,isReady:false,result: ProtoState.STATE_GAME_BEAN_LESS});
            return
        }
        this.broadcastMsg(ProtoID.CLIENT_GAME_READY,{playerIndex,isReady});
        player.ready = isReady;
        this.onRoomPlayerReady(player);
        if (this.isCanStart()) {
            //DEBUG("开始游戏");
            this.playing = true;
            this.onRoomStartNewRound();
        }
    }

    /**
     * 开始新一轮
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        // 初始化游戏数据
        this.startReset();
        let tempCard = this.publicCards.gen(this);
        let lastCard  = this.publicCards.getCard();
        this.enumPlayers(function (ePlayerIdx, ePlayer) {
            if (ePlayer.uid != 0) {
                if(!ePlayer.isRobot()) {
                    let consume = this.calcConsume(ePlayer);
                    ePlayer.sendMsg(ProtoID.GAME_CLIENT_START_NEW_ROUND,{curRound:this.curRound, dealerIndex : this.dealer, roundId: this.roundId, playStatus: this.state, consume});
                }
                if (ePlayerIdx == this.dealer) {
                    let cards = tempCard[ePlayerIdx - 1];
                    cards.push(lastCard);
                    ePlayer.setHandCards(cards);
                } else {
                    ePlayer.setHandCards(tempCard[ePlayerIdx - 1]);
                }
            }
        }.bind(this));

        if(this.subType === 1){
            this.startTruns();
            return;
        }
        DEBUG("开始换三张");
        if(this.opts.HSZ) {
            this.state = Enum.GameState.HSZ;
            this.setActionTimer(ActionType.XZ_HSZ, Enum.HSZ[this.mode] * 1000, this.getRelevant());
            for (let idx in this.players) {
                let player = this.players[idx];
                player.handCards.randomHSZCards();
                player.sendMsg(ProtoID.GAME_CLIENT_START_HSZ, {cards: player.handCards.hszInfo.self})
            }
            this.scheJob = setTimeout(function () {
                this.startHSZ();
            }.bind(this), Enum.HSZ[this.mode] * 1000);
        }else{
            this.noticeStartDQ();
        }
    }

    /**
     * 换三张请求是否结束
     * @returns {boolean}
     */
    hszRequestComplete(){
        let sum = 0;
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.handCards.hszInfo.status === 1){
                sum++;
            }
        }
        if(sum >= this.playNum){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 客户端请求换三张
     */
    onPlayerReqHSZ(uid, cards){
        let player = this.getPlayerByUid(uid);
        for(let idx in cards){
            let card = cards[idx];
            if(!player.handCards.contains(card)){
                return player.sendMsg(ProtoID.CLIENT_GAME_REQ_HSZ, {result:ProtoState.STATE_GAME_XZ_HSZ_MJID_ERROR});
            }
        }
        let iType = Math.floor(cards[0] / 10);
        for(let idx in cards){
            let jType = Math.floor(cards[idx] / 10);
            if(iType !== jType){
                return player.sendMsg(ProtoID.CLIENT_GAME_REQ_HSZ, {result:ProtoState.STATE_GAME_XZ_HSZ_ERROR});
            }
        }
        if(player){
            player.handCards.hszInfo.self = cards;
            player.handCards.hszInfo.status = 1;

            // 这里直接删除
            for(let delIdx = 0; delIdx < cards.length; delIdx++){
                 player.handCards.removeMjs(cards[delIdx]);
            }

            player.sendMsg(ProtoID.CLIENT_GAME_REQ_HSZ, {cards,playerIndex:player.index, handCards:player.handCards.mjList()});
            this.broadcastMsg(ProtoID.CLIENT_GAME_REQ_HSZ,{playerIndex:player.index},[player.index]);
            if(this.hszRequestComplete()){
                this.startHSZ();
            }
        }
    }

    /**
     * 交换牌
     * @constructor
     */
    swapCards(){
        if(this.subType === 1) return;
        let swapType = Math.floor(Math.random() * 3);
        switch (swapType) {
            case 0:
                this.players[1].handCards.hszInfo.swapIdx = 4;
                this.players[4].handCards.hszInfo.swapIdx = 3;
                this.players[3].handCards.hszInfo.swapIdx = 2;
                this.players[2].handCards.hszInfo.swapIdx = 1;
                break;
            case 1:
            default:
                this.players[1].handCards.hszInfo.swapIdx = 2;
                this.players[2].handCards.hszInfo.swapIdx = 3;
                this.players[3].handCards.hszInfo.swapIdx = 4;
                this.players[4].handCards.hszInfo.swapIdx = 1;
                break;
            case 2:
                this.players[1].handCards.hszInfo.swapIdx = 3;
                this.players[2].handCards.hszInfo.swapIdx = 4;
                this.players[3].handCards.hszInfo.swapIdx = 1;
                this.players[4].handCards.hszInfo.swapIdx = 2;
                break;
        }
        let missCards = {};
        let getCards = {};
        for(let idx in this.players){
            let player = this.players[idx];
            let removeCards = player.handCards.hszInfo.self;
            let swapIdx = player.handCards.hszInfo.swapIdx;
            player.handCards.hszInfo.swap = this.players[swapIdx].handCards.hszInfo.self;
            let addCards = player.handCards.hszInfo.swap;
            missCards[idx] = [];
            for(let delIdx = 0; delIdx < removeCards.length; delIdx++){
                // player.handCards.removeMjs(removeCards[delIdx]);  消息改到选牌的时候就删除了 所以这里屏蔽掉
                missCards[idx].push(removeCards[delIdx]);
            }
            getCards[idx] = [];
            for(let addIdx = 0; addIdx < addCards.length; addIdx++){
                player.handCards.addMjs(addCards[addIdx]);
                getCards[idx].push(addCards[addIdx]);
            }
        }
        this.missCards = missCards;
        this.getCards = getCards;
        return {swapType, missCards, getCards};
    }

    /**
     * 获取换牌信息
     */
    onPlayerGetHszInfo(uid){
        let player = this.getPlayerByUid(uid);
        if(player.handCards.hszInfo.swapIdx);
        if(player){
            if(this.state === Enum.GameState.READY || this.state === Enum.GameState.HSZ){
                return null;
            }
            let info = player.handCards.hszInfo;
            let inIdx = null;
            let inInfo = null;
            for(let idx in this.players){
                let oPlayer = this.players[idx];
                if(oPlayer.handCards.hszInfo.swapIdx === player.index){
                    inIdx = +idx;
                    inInfo = oPlayer.handCards.hszInfo;
                    break;
                }
            }
            let outName = this.getDir(info.swapIdx, player.index);
            let inName = this.getDir(inIdx, player.index);

            player.sendMsg(ProtoID.CLIENT_GAME_GET_MISS, {
                out: {cards: info.self, name:outName},
                in: {cards: info.swap, name:inName},
            });
        }
    }

    onPlayingCanQuit(player){
        if((player.isHu || player.isGoOut()) && player.uid !== this.creator && this.mode === "JB"){
            return true;
        }else{
            return false;
        }
    }

    onPlayerQuit(player) {
        if (player.playing === false) {
            this.players[player.index] = new Player(this, player.index);
        } else {
            if (player.isHu || player.isGoOut()) {
                player.giveUpExit = true;
            } else {
                this.players[player.index] = new Player(this, player.index);
            }
        }
    }

    /**
     * 请求听牌数据
     * @param uid
     */
    onPlayerTing(uid){
        let player = this.getPlayerByUid(uid);
        if(player){
            if(player.isHu){
                player.sendMsg(ProtoID.CLIENT_GAME_REQ_TING,{data:-1});
                return;
            }
            let lastPlay = player.handCards.lastPlay;
            let data = player.handCards.tings[lastPlay] || -1;
            player.sendMsg(ProtoID.CLIENT_GAME_REQ_TING,{data});
        }
    }
    /**
     * 设置换三张状态
     */
    setHszInfo(value){
        for(let idx in this.players){
            let ePlayer = this.players[idx];
            if(ePlayer.handCards.hszInfo.status === 0){
                let cards = ePlayer.handCards.hszInfo.self;

                for(let delIdx = 0; delIdx < cards.length; delIdx++){
                    ePlayer.handCards.removeMjs(cards[delIdx]);
                }

                ePlayer.sendMsg(ProtoID.CLIENT_GAME_REQ_HSZ, {cards,playerIndex:+idx, handCards:ePlayer.handCards.mjList()});
                this.broadcastMsg(ProtoID.CLIENT_GAME_REQ_HSZ,{playerIndex:+idx},[+idx]);
                ePlayer.handCards.hszInfo.status = value;
            }
        }
    }
    /**
     * 开始换三张 (每次随机三张方式换 0逆时针方向换 1顺时针方向换 2对家互换)
     */
    startHSZ(){
        clearTimeout(this.scheJob);
        this.scheJob = null;
        this.setHszInfo(1);
        setTimeout(function(){
            let data = this.swapCards();
            data.dealerIndex = this.dealer;
            for(let idx in this.players){
                let player = this.players[idx];
                data.handCards = player.handCards.mjList();
                player.sendMsg(ProtoID.GAME_CLIENT_HSZ_OVER, data);
            }
            this.noticeStartDQ();
        }.bind(this), 200);
    }

    /**
     * 同步下牌
     */
    syncCards(){
        this.enumPlayers(function (eIndex, ePlayer) {
            ePlayer.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_MJ, {playStatus: this.state, handCards : ePlayer.handCards.mjList()});
        }.bind(this));
    }
    /**
     * 通知开始定缺
     */
    noticeStartDQ(){
        // 结束了上三张 开始定缺
        this.state = Enum.GameState.DQ;
        this.setActionTimer(ActionType.XZ_DQ,Enum.DQ[this.mode] * 1000,this.getRelevant());
        for(let idx in this.players){
            (function (idx) {
                let player = this.players[idx];
                let BestInfo = player.handCards.getBestHS(0);
                let bsetType = BestInfo.type + 1;
                player.dqRecommend = bsetType;
                player.setAutoFun(this.startDQ, [player.uid, bsetType]);
                player.scheJob = setTimeout(function () {
                    this.startDQ(player.uid, bsetType);
                }.bind(this), Enum.DQ[this.mode] * 1000);
                player.sendMsg(ProtoID.GAME_CLIENT_START_DQ, {bestType:bsetType})
            }.bind(this))(idx);
        }
    }

    /**
     * 请求定缺
     * @param uid
     * @param type
     * @returns {boolean}
     */
    onPlayerDQ(uid, type){
        if(type < 1 || type > 3){
            return false;
        }
        if(this.state !== Enum.GameState.DQ){
            return false;
        }
        this.startDQ(uid, type);
    }
    /**
     * 开始定缺
     */
    startDQ(uid, type){
        let player = this.getPlayerByUid(uid);
        player.dqType = type;
        player.clearAutoPlayer();
        this.broadcastMsg(ProtoID.CLIENT_GAME_REQ_DQ,{playerIndex:player.index});
        if(this.checkDQComplete()){
            this.startTruns();
        }
    }

    /**
     * 检测定缺是否完成
     */
    checkDQComplete(){
        let data = {};
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.dqType === -1){
                return false;
            }
            data[idx] = player.dqType;
        }
        this.broadcastMsg(ProtoID.GAME_CLIENT_DQ_END,{data});
        return true;
    }

    /**
     * 开始新的一轮
     */
    startTruns() {
        this.state = Enum.GameState.PLAY;
        this.broadcastMsg(ProtoID.CAME_CLIENT_PLUS_CARD, {publicCardsNum: this.publicCards.num});
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ, {
            curPlayIndex: this.nextPlayer,
            lastPlayIndex: this.prePlayer,
            isPlayedCard: false
        });
        let card = this.setAutoMj(this.dealer);            // 因为换三张的原因 这里就不能拿 最后的摸牌走
        this.isGrab(this.dealer, card);
        let time = this.getAutoCardTime(this.dealer);
        this.AutoSetAct(time);
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
        if(this.state == Enum.GameState.HSZ){
            time = Enum.HSZ[this.mode];
        }else if(this.state === Enum.GameState.DQ){
            time = Enum.DQ[this.mode];
        } else {
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
     * 是否能抢定缺
     * @param player
     */
    isCanQDQ(player, cardType, pengInfo, gangInfo, huInfo){

        if(pengInfo.isSuccess){
            let card = pengInfo.card;
            let tmpType =  Math.floor(card / 10);
            if(tmpType === player.dqType){
                pengInfo.isSuccess = false;
            }
        }

        if(gangInfo.isSuccess){
            for(let idx in gangInfo.info){
                let one = gangInfo.info[idx];
                let card = one.card;
                let tmpType =  Math.floor(card / 10);
                if(tmpType === player.dqType){
                    gangInfo.isSuccess = false;
                }
            }
        }

        if(huInfo.isSuccess){
            let card = huInfo.card;
            let tmpType =  Math.floor(card / 10);
            if(tmpType === player.dqType){
                huInfo.isSuccess = false;
            }
        }

        if(pengInfo.isSuccess){
            let card = pengInfo.card;
            let tmpType =  Math.floor(card / 10);
            if(tmpType === player.dqType){
                pengInfo.isSuccess = false;
            }
        }

        if(player.handCards.getTotalCount() % 3 !== 2){
            if(cardType === player.dqType){ // 对方出的牌正好是你定缺的牌 不能吃碰杠过
                return false;
            }else{
                return true;
            }
        }else{
            return true;
        }
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
        let cardType = Math.floor(card / 10);
        if(player.isHu || player.isGoOut()){
            return;
        }
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
        if(player.handCards.getTotalCount() % 3 === 2) {     // 自摸
            let mjs = Enum.AllMj;
            for(let idx in mjs) {
                let gangType = player.handCards.gangType(mjs[idx]);
                if (player.handCards.contains(mjs[idx]) && (gangType === Enum.GangType.AN_GANG || gangType === Enum.GangType.PASSROAD)) {
                    gangMjs.push({type:gangType, card:mjs[idx]});
                }
            }
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
        if(this.roundOver()){
            gangInfo.isSuccess = false;
        }
        // 胡牌
        if(!player.passHu) {
            if (player.handCards.getTotalCount() % 3 === 2) {
                player.handCards.zmHu = true;
                let huType = Func.huPai(player.handCards);
                if (huType != null) {
                    huInfo.isSuccess = true;
                    huInfo.card = 0;
                }
            } else {
                let huType = player.handCards.calcHuMjs(card);
                if (huType != null) {
                    huInfo.isSuccess = true;
                    huInfo.card = card;
                    huInfo.type = huType;
                }
            }
        }
        if(onlyHu){
            chiInfo.isSuccess = false;
            pengInfo.isSuccess = false;
            gangInfo.isSuccess = false;
        }
        let time = this.getAutoCardTime(playerIdx);
        let can = this.isCanQDQ(player, cardType, pengInfo, gangInfo, huInfo);
        if(can && (chiInfo.isSuccess || pengInfo.isSuccess || gangInfo.isSuccess || huInfo.isSuccess)){
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
            player.resetGrabState();
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
    calcTingMsg(player) {
        if(player.isHu){
            player.sendMsg(ProtoID.GAME_CLIENT_TINGS, {tings : {}});
        }else {
            let tings = player.handCards.calTingMjs();
            if (Object.keys(tings).length > 0) {
                player.sendMsg(ProtoID.GAME_CLIENT_TINGS, {tings: tings});
            }
        }
    }
    /**
     * 设置玩家自动出的牌
     * @param playerIndex
     * @returns {number|*}
     */
    setAutoMj(playerIndex) {
        let player = this.players[playerIndex];
        let card = player.handCards.getBestCard();
        if(card === null || !player.handCards.contains(card)){
            card = player.handCards.getRandomMj();
        }
        return card;
    }

    /**
     * 下一个出牌玩家
     * @param starIndex
     * @returns {number}
     */
    getNextPlayerIndex(starIndex) {
        let start = starIndex;
        for(let i = 0; i < this.playNum; i++){
            let playerIndex = start % this.playNum + 1;
            let player = this.getPlayerByIndex(playerIndex);
            if(player.isHu || player.isGoOut()){
                start = playerIndex;
            }else{
                return playerIndex;
            }
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
     * 回合是否结束
     * @return {boolean|*}
     */
    roundOver() {
        if (this.publicCards.isEmpty()) {
            return true;
        }
        let num = 0;
        this.enumPlayers(function(ePlayerIdx, ePlayer){
            if(ePlayer.isHu || ePlayer.isGoOut()){
                num++;
            }
        });
        if(num + 1 >= this.playNum){
            return true;
        }
        return false;
    }
    /**
     * 摸牌
     * @param playerIndex
     * @returns {boolean}
     */
    doDraw(playerIndex) {
        if (this.roundOver()) {
            this.onSettement();
            return false;
        }
        let player = this.players[playerIndex];
        let card = this.publicCards.getCard();
        player.sendMsg(ProtoID.GAME_CLIENT_DRAW_CARD, {playerIndex: playerIndex, card : card, handCards:player.handCards.mjList()});
        this.broadcastMsg(ProtoID.GAME_CLIENT_DRAW_CARD, {playerIndex: playerIndex, card : card},[playerIndex]);
        player.handCards.drawMj(card);
        player.passHu = false;
        if(this.prePlayer !== playerIndex && this.prePlayer !== 0){
            let prePlayer = this.getPlayerByIndex(this.prePlayer);
            prePlayer.gangFlag = false;
        }
        this.broadcastMsg(ProtoID.CAME_CLIENT_PLUS_CARD, {publicCardsNum: this.publicCards.num});
        this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ,{curPlayIndex:playerIndex, lastPlayIndex:this.prePlayer,isPlayedCard : false});
        player.clearAutoPlayer();
        this.isGrab(playerIndex,card);
        let time = this.getAutoCardTime(playerIndex);
        this.AutoSetAct(time);
    }

    AutoSetAct(time){
        if(this.isGRAB) {
            this.setActionTimer(ActionType.XZ_GRAB, time, this.getRelevant());
        }else{
            this.setActionTimer(ActionType.XZ_PLAY, time, this.getRelevant());
        }
    }
    /**
     * 检测是否能出牌
     * @param player
     * @param card
     * @returns {number}
     */
    checkReqPlayCard(player, card){
        let playerIndex = player.index;
        if (playerIndex != this.nextPlayer) {
            ERROR(util.format("Not player %d's round", playerIndex));
            return ProtoState.STATE_FAILED;
        }
        if (this.isGRAB) {
            ERROR(util.format("正在抢牌不能出牌", playerIndex));
            return ProtoState.STATE_FAILED;
        }
        if(this.state !== Enum.GameState.PLAY){
            ERROR("不是出牌阶段");
            return ProtoState.STATE_FAILED;
        }
        if (!player.handCards.contains(card)) {
            ERROR(util.format("玩家手里没有这张牌", card));
            this.syncCards();           // 发现了bug同步下 所有玩家的牌
            return ProtoState.STATE_FAILED;
        }
        if(player.handCards.isHaveDQCard()){
            let outType = Math.floor(card / 10);
            if(outType !== player.dqType && this.subType === 2){
                ERROR("手里有没有打完的定缺牌");
                return ProtoState.STATE_GAME_XZ_DQ_MJID_ERROR;
            }
        }
        return ProtoState.STATE_OK;
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
     * 发送是否有听
     * @param player
     */
    sendHaveTing(player){
        if(player.handCards.tings[player.handCards.lastPlay] && player.isHu === false){
            player.haveTing = true;
            player.sendMsg(ProtoID.GAME_CLIENT_TING_INFO, {haveTing:true});
        }else{
            player.haveTing = false;
            player.sendMsg(ProtoID.GAME_CLIENT_TING_INFO, {haveTing:false});
        }
    }

    /**
     * 重置多胡信息
     */
    resetDuoHuInfo(){
        this.curhuNum = 0;
    }
    /**
     * 玩家出牌
     * doShape = {type:xx, subType: xx, num:xx, power:xx, cards:[x,x,x]}
     */
    doPlay(playerIndex, card, req) {
        let player = this.players[playerIndex];
        player.handCards.playMj(card);
        this.sendHaveTing(player);
        this.testPai(player);
        this.prePlayMj = card;
        this.prePlayer = playerIndex;
        this.nextPlayer = this.getNextPlayerIndex(playerIndex);
        player.clearAutoPlayer();
        // 广播玩家出牌
        player.sendMsg(ProtoID.CLIENT_GAME_DO_PLAY_MJ, {playerIndex,card,handCards:player.handCards.mjList()});
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PLAY_MJ, {playerIndex,card},[playerIndex]);
        this.resetDuoHuInfo();
        for(let idx in this.players){
            if(+idx === playerIndex){
                continue;
            }
            this.isGrab(+idx,card);
        }
        this.huIngNum = this.calcHuIngNum();
        if (!this.isGRAB) {
            this.doDraw(this.nextPlayer);
        }else{
            this.recordGSS(playerIndex);
            let time = this.getAutoCardTime(this.nextPlayer);
            this.setActionTimer(ActionType.XZ_GRAB, time, this.getRelevant());
        }
        this.setAutoT(player, req);
    }

    /**
     * 记录杠上炮的人数
     */
    recordGSS(playerIndex){
        this.GSSPlayers = [];
        for(let idx in this.players){
            if(+idx === playerIndex){
                continue;
            }
            let player = this.players[idx];
            if(player.task.hu) {
                player.handCards.huMj = this.prePlayMj;
                player.handCards.isGSS();
                player.handCards.huMj = null;
                if(player.GSSFlag){
                    this.GSSPlayers.push(+player.index);
                }
            }
        }
    }

    /**
     * 移除杠上跑的玩家
     * @param playerIndex
     */
    removeGSS(playerIndex){
        playerIndex = +playerIndex;
        let pos = this.GSSPlayers.indexOf(playerIndex);
        if(pos >= 0){
            this.GSSPlayers.splice(pos, 1);
        }
    }

    getPreGang(){
        let len = this.pvpInfo.length;
        for(let i = len - 1; i >= 0; i--){
            if(this.pvpInfo[i].type === Enum.PVP_TYPE.GANG){
                return this.pvpInfo[i];
            }
        }
        return null;
    }

    returnGSP(){
        if(!this.grabOver()){
            return false;
        }
        let len = this.GSSPlayers.length;
        let paoIdx = this.prePlayer;
        let paoPlayer = this.getPlayerByIndex(paoIdx);
        if(len === 0){
            return;
        }
        if (paoPlayer && !paoPlayer.isHu && !paoPlayer.isGoOut()) {
            let last = this.getPreGang();
            if (last) {
                let clast = clone(last);
                clast.gets = clone(this.GSSPlayers);
                let sum = 0;
                let realScore = {};
                for (let idx in clast.realScore) {
                    let num = clast.realScore[idx];
                    if (+idx === paoIdx) {
                        num = Math.min(paoPlayer.bean, num);
                        paoPlayer.updateCoin(1, -num);
                        realScore[idx] = -num;
                        clast.gangPlayer =  paoIdx;
                        sum += num;
                    }
                }
                let aver = Math.floor(sum / len);
                for(let i in this.GSSPlayers) {
                    let idx = this.GSSPlayers[i];
                    let huPlayer = this.getPlayerByIndex(idx);
                    huPlayer.updateCoin(1, aver);
                    realScore[huPlayer.index] = aver;
                }
                clast.realScore = realScore;
                clast.word = "转雨";
                this.pvpInfo.push(clast);
                this.broadcastAddDel(realScore);
            }
        }
        this.GSSPlayers = [];
    }

    /**
     * 托管
     * @param uid
     * @param isT
     */
    onPlayerHosted (uid, isT) {
        if(!this.playing) return false;
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player.isHu || player.isGoOut()){
            return false;
        }
        player.isT = isT;
        clearTimeout(player.scheJob);
        player.scheJob = null;
        let sTime = isT ? 0 : Enum.CANCELHOSTED[this.mode];
        if(player.autoFun){
            sameCall(sTime,player);
        }
        if(!isT) {
            let time = this.getAutoCardTime(playerIndex);
            this.AutoSetAct(time);
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
            }else if(player.autoFun == player.owner.startDQ){
                player.scheJob = setTimeout(function () {
                    player.owner.startDQ(player.autoParam[0], player.autoParam[1]);
                }.bind(player), sTime*1000)
            }
        }
        this.broadcastMsg(ProtoID.CLIENT_GAME_TG,{playerIndex,isT})
    }
    /**
     * 获取相关的人数
     */
    getRelevant(value){
        if(value){
            return value
        }else {
            if (this.subType === 2) {
                return [1, 2, 3, 4];
            } else {
                return [1, 2];
            }
        }
    }

    /**
     * 玩家请求吃牌
     * @param uid
     * @param card
     */
    onPlayerReqChiCard(uid,arrayIndex) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if (player.chiState !== Enum.GrabState.GRABING){
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
            this.AutoSetAct(time);
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_CHI,{playerIndex, targetIndex:this.prePlayer,card:card,cards:mjs,handCards:player.handCards.mjList()});
            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            if(player.handCards.getTotalCount() % 3 === 2) {
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
     * 正在抢胡的玩家数量
     */
    calcHuIngNum(){
        let sum = 0;
        for(let idx in this.players){
            let player = this.players[idx];
            if (player.huState === Enum.GrabState.GRABING){
                sum++;
            }
        }
        return sum;
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
    hued () {
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
            if(!p.isHu) {
                if (p.pengState === Enum.GrabState.GRABING || p.gangState === Enum.GrabState.GRABING || p.chiState === Enum.GrabState.GRABING || p.huState === Enum.GrabState.GRABING) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 玩家请求碰牌
     * @param uid
     */
    onPlayerReqPengCard(uid,card) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player.pengState !== Enum.GrabState.GRABING){
            DEBUG("玩家不能碰牌,可能已经过牌" + player.pengState);
            return;
        }
        if(card !== this.prePlayMj){
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

            let info = {playerIndex, targetIndex:this.prePlayer,card:pengMj};
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PENG,info,[playerIndex]);
            info.handCards = player.handCards.mjList();
            player.sendMsg(ProtoID.CLIENT_GAME_DO_PENG,info);

            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});

            let time = this.getAutoCardTime(playerIndex);
            this.AutoSetAct(time);
            if(player.handCards.getTotalCount() % 3 === 2) {
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
        if (this.roundOver()) {
            this.onSettement();
            return false;
        }
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        player.setGRabState(3);
        if (!this.huIng() && !this.hued()) {
            let gangType = player.handCards.gangType(gangMj);
            if(gangType === Enum.GangType.PASSROAD && this.grabPassRoad === false){
                let haveHu = this.calcGangHu(playerIndex, gangMj);
                if(haveHu){
                    this.addPassRoadTask(playerIndex, gangMj);
                    return;
                }
            }
            this.clearPassRoadTask();
            this.cpgFlag = true;
            player.handCards.gang(gangMj, gangType);
            if (gangType !== Enum.GangType.AN_GANG) {
                player.handCards.menQing = false;
            }
            this.nextPlayer = playerIndex;
            if (gangType === Enum.GangType.MING_GANG) {
                let prePlay = this.players[this.prePlayer];
                prePlay.handCards.delPlayedMj();
            }
            player.gangFlag = true;
            player.preGangType = gangType;
            DEBUG("杠牌成功");
            if(gangType === Enum.GangType.PASSROAD && player.handCards.lastMj !== gangMj){
                // 这种情况排除 不计算杠钱
            }else {
                let realScore = this.billGang(playerIndex, gangType);
                this.saveGangPVPInfoByGang(gangType, playerIndex, realScore);
            }
            this.resetGrabState();

            let info = {type :gangType,playerIndex, targetIndex : this.prePlayer,card:gangMj};
            this.broadcastMsg(ProtoID.CLIENT_GAME_DO_GANG, info,[playerIndex]);
            info.handCards = player.handCards.mjList();
            player.sendMsg(ProtoID.CLIENT_GAME_DO_GANG, info);

            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            this.isGRAB = false;
            if (this.roundOver()) {
                this.onSettement();
                return;
            } else {
                this.doDraw(playerIndex);   //摸牌
            }
        }
        this.setAutoT(player, req);
    }

    /**
     * 保存杠牌的pvp信息
     * @param gangType
     * @param playerIndex
     */
    saveGangPVPInfoByGang(gangType, playerIndex, realScore){
        let lose = this.getOtherLose(realScore);
        let multiple = 2;
        let word = "刮风";
        if(gangType === Enum.GangType.PASSROAD){
            multiple = 1;
        }
        if(gangType === Enum.GangType.AN_GANG){
            word = "下雨";
        }
        this.pvpInfo.push({type: Enum.PVP_TYPE.GANG, get:playerIndex, lose, multiple, realScore, word});
        this.broadcastAddDel(realScore);
    }

    /**
     * 实时播报玩家的分数情况
     * @param realScore
     */
    broadcastAddDel(realScore){
        this.broadcastMsg(ProtoID.GAME_CLIENT_SCORE,{realScore});
        this.updateResources();
    }

    /**
     *
     * @param huType
     * @param playerIndex
     */
    saveGangPVPInfoByHu(playerIndex, realScore, word){
        let huPlayer = this.getPlayerByIndex(playerIndex);
        let lose = this.getOtherLose(realScore);
        this.pvpInfo.push({type: Enum.PVP_TYPE.HU, get:playerIndex, lose, multiple:huPlayer.huMult, word, realScore});
        this.broadcastAddDel(realScore);
    }

    /**
     * 保存查叫信息
     * @param realScore
     */
    saveGangPVPInfoByCJ(realScore,mults,huWords){
        let loses = this.getOtherLose(realScore);
        let wins = this.getOtherWin(realScore);
        let word = "查叫";
        this.pvpInfo.push({type: Enum.PVP_TYPE.CJ, wins, loses, mults, word, realScore, huWords});
        this.broadcastAddDel(realScore);
    }
    /**
     * 获取pvp数据
     */
    onPlayerPVP(uid){
        let player = this.getPlayerByUid(uid);
        let list = [];
        let num = 0;
        if(player){
            for(let idx = 0; idx < this.pvpInfo.length; idx++){
                let one = this.pvpInfo[idx];
                if(typeof(one.realScore[player.index]) === "number"){
                    let msg = "";
                    let data = {};
                    let playerIndex = player.index;
                    if(one.type === Enum.PVP_TYPE.CJ){
                        if(one.loses.indexOf(playerIndex) >= 0){
                            msg += "被";
                            msg += one.word;
                        }else{
                            msg += one.word;
                            if(one.huWords && one.huWords[playerIndex]) {
                                let str = one.huWords[playerIndex].replace("接炮", "");
                                msg += str;
                            }
                        }
                        data.type = msg;
                        data.multiple = Math.abs(one.mults[playerIndex] || 0) + "倍";
                        data.winLose = one.realScore[playerIndex];
                        num += data.winLose;
                        data.dirInfo = this.getDirPByCJ(one.loses, playerIndex, one.wins);
                        list.push(data);
                    }else if(one.type === Enum.PVP_TYPE.TS){
                        if(one.gets.indexOf(playerIndex) >= 0){
                            msg += "被";
                        }
                        data.type = msg + one.word;
                        data.multiple = one.multiple + "倍";
                        if(data.type.indexOf("转雨") >= 0){
                            data.multiple = "";
                        }
                        data.winLose = one.realScore[playerIndex];
                        num += data.winLose;
                        data.dirInfo = this.getDirP(one.gets, playerIndex, one.loses[0]);
                        list.push(data);
                    }else {
                        let str = one.word;
                        if(str.indexOf("接炮") >= 0 && one.lose.indexOf(playerIndex) >= 0){
                            str = str.replace("接炮","点炮");
                        }else {
                            if (one.get !== player.index) {
                                msg += "被";
                            }
                        }
                        data.type = msg + str;
                        data.multiple = one.multiple + "倍";
                        data.winLose = one.realScore[playerIndex];
                        num += one.realScore[playerIndex];
                        data.dirInfo = this.getDirP(one.lose, playerIndex, one.get);
                        if(str.indexOf("转雨") >= 0){
                            data.multiple = "";
                            let zeroIndex = one.gangPlayer;
                            if(zeroIndex){
                                if(playerIndex === zeroIndex){
                                    data.dirInfo = this.yuDir(playerIndex, one.gets);
                                    data.type = "转雨";
                                }else if(one.gets.indexOf(playerIndex) >= 0){
                                    data.dirInfo = this.getDir(playerIndex, zeroIndex);
                                    data.type = "被转雨";
                                }else{
                                    data.dirInfo = this.yuDir(playerIndex, one.gets);
                                    data.type = "被下雨,被转雨";
                                }
                            }
                        }
                        list.push(data);
                    }
                }
            }
        }
        player.sendMsg(ProtoID.CLIENT_GAME_PVP_DATA,{list,num});
        return list;
    }

    /**
     * 获取转雨方向
     * @param playerIndex
     * @param one
     */
    yuDir(playerIndex, gets){
        let msg = "";
        let len = gets.length;
        switch (len) {
            case 3:msg = "三家";break;
            case 2:msg = "两家";break;
            case 1:msg = this.getDir(playerIndex, gets[0]);break;
        }
        return msg;
    }

    /**
     * 获取0值玩家
     * @param realScore
     */
    getZhuanYuZero(realScore){
        for(let idx in realScore){
            let value = realScore[idx];
            if(value === 0){
                return +idx;
            }
        }
        return null;
    }
    /**
     * 获取查叫方位信息
     */
    getDirPByCJ(loses, index, wins){
        let win = null;
        let msg = "";
        if(wins.indexOf(index) >= 0){
            win = true;
        }else if(loses.indexOf(index) >= 0){
            win = false;
        }
        if(win === null){
            return "";
        }
        let len = win ? loses.length : wins.length;
        switch (len) {
            case 1:{
                if(win){
                    msg = this.getDir(index, loses[0]);
                }else{
                    msg = this.getDir(index, wins[0]);
                }
            }
            break;
            case 2:msg = "两家";break;
            case 3:msg = "三家";break;
        }
        return msg;
    }
    /**
     * 获取方位信息
     */
    getDirP(lose, index, get){
        let len = lose.length;
        if(lose.indexOf(index) >= 0){
            len = 1;
        }
        let msg = "";
        switch (len) {
            case 1:{
                if(lose.indexOf(index) >= 0){
                    msg = this.getDir(index, get);
                }else if(get === index){
                    msg = this.getDir(index, lose[0]);
                }
            }
            break;
            case 2:msg = "两家";break;
            case 3:msg = "三家";break;
        }
        return msg;
    }

    /**
     * 获取方位
     */
    getDir(origin, target){
        if(this.playNum === 2){
            return "对家";
        }else{
            let ids = [1,2,3,4,1,2,3,4];
            let start = ids.indexOf(origin);
            let offset = 0;
            for(let loop = 0; loop < 8; loop++){
                let nIdx = (start + loop) % 8;
                if(ids[nIdx] === target){
                    offset = loop;
                    break;
                }
            }
            let msg = "";
            switch (offset) {
                case 1: msg = "下家";break;
                case 2: msg = "对家";break;
                case 3: msg = "上家";break;
            }
            return msg;
        }
    }

    /**
     * 获取除自己以外的其他玩家索引
     * @param playerIndex
     * @returns {Array}
     */
    getOtherLose(realScore){
        let array = [];
        for(let idx in realScore){
            let score = realScore[idx];
            if(score < 0) {
                array.push(+idx);
            }
        }
        return array;
    }

    /**
     * 查叫专用
     * @param realScore
     * @returns {Array}
     */
    getOtherWin(realScore){
        let array = [];
        for(let idx in realScore){
            let score = realScore[idx];
            if(score > 0) {
                array.push(+idx);
            }
        }
        return array;
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
     * 过牌
     * @param playerIndex
     */
    doPass(playerIndex, req) {
        let player = this.players[playerIndex];
        player.clearAutoPlayer();
        if(player.huState === Enum.GrabState.GRABING && this.playNum === 4 && player.handCards.getTotalCount() % 3 !== 2){
            player.passHu = true;
            if(this.nextTempDealer) {
                if(this.nextDealer === 0) {
                    this.nextDealer = this.nextTempDealer;
                }
            }
        }
        player.resetGrabState();
        if(player.handCards.getTotalCount() % 3 !== 2){
            player.gangFlag = false;
        }
        this.removeGSS(playerIndex);
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_PASS_MJ,{playerIndex});
        if(this.grabOver()){
            if(this.grabPassRoad){
                this.doGang(this.passGangPlay, this.passGangMj);
                return;
            }
            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            this.returnGSP();
            let time = this.getAutoCardTime(playerIndex);
            this.isGRAB = false;
            this.AutoSetAct(time);
            if(player.handCards.getTotalCount() % 3 === 2) {
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
                if(this.clearGangFlagByHu){
                    this.clearGangFlag();
                }
                this.clearGangFlagByHu = false;
                for (let index in this.players) {
                    let p = this.players[index];
                    if (p.pengState === Enum.GrabState.GRABED) {
                        this.doPeng(p.index, this.prePlayMj);
                        pengFlag = true;
                        break;
                    } else if (p.gangState === Enum.GrabState.GRABED) {
                        this.doGang(p.index, p.gangCard);
                        gangFlag = true;
                        break;
                    }
                }
                if(!pengFlag && !gangFlag){
                    for (let index in this.players) {
                        let p = this.players[index];
                        if (p.chiState === Enum.GrabState.GRABED) {
                            this.doChi(p.index, p.chiIdx);
                            chiFlag = true;
                            break;
                        }
                    }
                }
                if(!chiFlag && !pengFlag && !gangFlag){
                    this.isGRAB = false;
                    this.resetGrabState();
                    let nPlayer = this.getPlayerByIndex(this.nextPlayer);
                    if(nPlayer.isHu){
                        this.nextPlayer = this.getNextPlayerIndex(this.nextPlayer);
                    }
                    this.broadcastMsg(ProtoID.GAME_CLIENT_OUT_CARD_PLAYER_MJ,{curPlayIndex:this.nextPlayer, lastPlayIndex:this.prePlayer,isPlayedCard : false});
                    this.doDraw(this.nextPlayer);
                }
            }
        }
        this.setAutoT(player, req);
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
        if(player.huState !== Enum.GrabState.GRABING){
            ERROR(util.format("玩家[%d]不能胡牌,不在抢牌阶段"), uid);
        }
        player.huState = Enum.GrabState.GRABED;
        this.doHu(playerIndex);
    }
    /**
     * 计算杠胡
     * @param gangIdx
     * @param card
     * @returns {boolean}
     */
    calcGangHu(gangIdx, card) {
        let haveHu = false;
        for(let idx in this.players){
            if(+idx !== gangIdx){
                let isHu = this.isGrab(+idx, card, true, true);
                if(isHu){
                    haveHu = true;
                }
            }
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
     * 听牌消息
     * @param playerIndex
     * @param wsConn
     * @returns {boolean}
     */
    onPlayerReconnect(playerIndex, wsConn) {
        super.onPlayerReconnect(playerIndex, wsConn);
        let player = this.getPlayerByIndex(playerIndex);
        if(!this.isGRAB) {
            if (player.handCards.getTotalCount() % 3 === 2) {
                let tings = player.handCards.tings;
                if(Object.keys(tings).length > 0){
                    player.sendMsg(ProtoID.GAME_CLIENT_TINGS, {tings : tings});
                }
            }
        }
        this.sendHaveTing(player);
        return true;
    }

    /**
     * 清理其他玩家的杠、碰信息
     */
    setOtherGRABStatus(){
        this.enumPlayers(function(eIndex, ePlayer){
            if((ePlayer.pengState === Enum.GrabState.GRABING || ePlayer.gangState === Enum.GrabState.GRABING || ePlayer.chiState === Enum.GrabState.GRABING) && ePlayer.huState !== Enum.GrabState.GRABING){
                ePlayer.resetGrabState();
                ePlayer.clearAutoPlayer();
                ePlayer.sendMsg(ProtoID.GAME_CLIENT_TASK_END,{});
            }
        })
    }

    clearGangFlag(){
        this.enumPlayers(function (eIndex, ePlayer) {
            if(ePlayer.huState === null){
                ePlayer.gangFlag = false;
            }
        })
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
        if(player.isHu){
            return false;
        }
        player.clearAutoPlayer();
        player.resetGrabState();
        let huMj = 0, huType = null;
        if(!this.huIng()){
            this.broadcastMsg(ProtoID.GAME_CLIENT_TASK_END,{});
        }
        player.task = {};
        if(player.handCards.getTotalCount() % 3 === 2) {
            huType = Func.huPai(player.handCards);
            if(huType == null){
                ERROR("玩家不能胡牌，检查是否作弊");
                return;
            }
            player.handCards.zmHu = true;
            huMj = player.handCards.lastMj;
            player.taskParams.selfStroke = true;
            player.paoIdx = playerIndex;
        }else{
            player.handCards.zmHu = false;
            huMj = this.prePlayMj;
            if(this.grabPassRoad){
                huMj = this.passGangMj;
            }
            huType = player.handCards.calcHuMjs(huMj);
            if(huType == null){
                ERROR("玩家不能胡牌，检查是否作弊");
                return;
            }
            player.handCards.addMjs(huMj);
            player.paoIdx = this.prePlayer;
            this.curhuNum++;
            if(this.curhuNum >= 2 && this.huIngNum >= 2){         // 一炮多响有人2人以上胡牌
                this.setNextDealer(player.paoIdx, true);
            }
            if(!this.grabPassRoad){
                let paoPlayer = this.getPlayerByIndex(player.paoIdx);
                paoPlayer.handCards.delPlayedMj();
            }
        }
        this.clearGangFlagByHu = true;
        player.handCards.huMj = huMj;
        if(this.curhuNum === 1 || player.handCards.zmHu) {
            this.broadcastMsg(ProtoID.GAME_CLIENT_ADD_HU_MJ, {playerIndex:player.index, handCards:player.clientCalcHandCardDelHuMJ(), huCard:huMj});
        }
        this.setOtherGRABStatus();
        this.setNextDealer(player.index);
        player.taskParams.win = true;
        DEBUG("胡牌成功");
        if(this.grabPassRoad){
            player.passHuIndex = this.passGangPlay;
            let passP = this.players[this.passGangPlay];
            passP.handCards.removeMjs(huMj);
            this.broadcastMsg(ProtoID.GAME_CLIENT_DELETE_QGH, {handCards:passP.handCards.mjList(),  playerIndex:passP.index});
            player.paoIdx = this.passGangPlay;
        }
        player.handCards.huMj = huMj;
        let huMult = player.handCards.calcHuFan(huType);
        player.huNum += 1;
        player.isHu = true;
        player.huMult = huMult;
        let realScore = this.billHu(playerIndex);
        //计算基础牌型分
        this.calcTingMsg(player);
        this.sendHaveTing(player);
        this.huOrder++;
        player.huOrder = this.huOrder;
        this.setOnTG(player);
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_HU, {playerIndex, targetIndex:player.paoIdx, card: huMj, type: huType, huOrder:this.huOrder});
        let word = player.handCards.huWord(player.handCards.zmHu);
        player.handCards.setTaskParams(huType);
        this.saveGangPVPInfoByHu(playerIndex, realScore, word);
        this.nextPlayer = this.getNextPlayerIndex(playerIndex);
        if(this.mode === "JB") {
            this.popNextBtn(player.index);
        }
        if (this.roundOver()) {
            this.returnGSP();
            this.onSettement();
        } else {
            if(this.grabOver()) {
                this.returnGSP();
                this.nextPlayer = this.getNextPlayerIndex(playerIndex);
                this.isGRAB = false;
                this.doDraw(this.nextPlayer);
                this.clearGangFlag();
            }
        }
        this.onPlayerPVP(player.uid);
    }

    /**
     * 强制弹出pvp界面
     */
    forcePVP(){
        for(let idx in this.players){
            let otherPlayer = this.players[idx];
            if(!otherPlayer.isHu){
                this.onPlayerPVP(otherPlayer.uid);
            }
        }
    }

    /**
     * 结算任务
     */
    onSettTask(){
        this.enumPlayers(function(eIndex, ePlayer){
            let roundBean = ePlayer.roundBean;
            ePlayer.taskParams.winLoseBean = ePlayer.roundBean;
            if(roundBean > 0){
                ePlayer.taskParams.win = true;
            }
            this.checkTask(ePlayer);
        }.bind(this));
    }

    /**
     * 弹出下一句按钮
     */
    popNextBtn(playerIndex){
        let readyBtn = false;
        if(this.mode === "FK" && this.playing === false){
            readyBtn = true;
        }
        if(playerIndex){
            let player = this.getPlayerByIndex(playerIndex);
            player.sendMsg(ProtoID.GAME_CLIENT_POP_BTN,{readyBtn});
        }else {
            this.enumPlayers(function (eIndex, ePlayer) {
                ePlayer.sendMsg(ProtoID.GAME_CLIENT_POP_BTN,{readyBtn});
            })
        }
    }
    /**
     * 获取胡牌的玩家
     * @returns {number}
     */
    getHuNum(){
        let sum = 0;
        this.enumPlayers(function(ePlayerIndex, ePlayer){
            if(ePlayer.isHu){
                sum++;
            }
        })
        return sum;
    }

    settlementCJ(){
        if(!this.roundOver()){
            return null;
        }
        let settBean = {};
        let mults = {};
        let huNum = this.getHuNum();
        let nHuNum = 0;
        let J = [];
        let NJ = [];
        if(this.playNum - huNum >= 2){
            this.CJFlag = true;
            for(let idx in this.players){
                let player = this.players[idx];
                if(!player.isHu && !player.isGoOut()) {
                    nHuNum++;
                    player.handCards.calcCJ();
                    if(Object.keys(player.handCards.cJtings).length > 0){
                        let data = player.handCards.getMaxCJ();
                        J.push({playerIndex:+idx, maxHuMult:data.maxMult, word:data.word})
                    }else{
                        NJ.push(+idx);
                    }
                }
            }
        }
        let words = {};
        for(let i in NJ){
            let nIndex = NJ[i];
            for(let j in J){
                let playerIndex= J[j].playerIndex;
                let maxHuMult = J[j].maxHuMult;
                let maxBean = maxHuMult * this.baseBean;
                if(!settBean[playerIndex]){
                    settBean[playerIndex] = 0;
                }
                settBean[playerIndex] += maxBean;
                if(!mults[playerIndex]){
                    mults[playerIndex] = 0;
                }
                mults[playerIndex] += maxHuMult;
                if(!settBean[nIndex]){
                    settBean[nIndex] = 0;
                }
                settBean[nIndex] -= maxBean;

                if(!mults[nIndex]){
                    mults[nIndex] = 0;
                }
                mults[nIndex] -= maxHuMult;
                words[playerIndex] = J[j].word;
            }
        }
        return {settBean,mults,NJ,words};
    }

    /**
     * 结算未听牌的玩家要退水
     */
    quitWater(NJ){
        let len = NJ.length;
        if(len === 0){
            return null;
        }
        let tmpPvp = [];
        for(let idx in this.pvpInfo){
            let one = this.pvpInfo[idx];
            let settBean = {};
            if(one.type === Enum.PVP_TYPE.GANG && NJ.indexOf(one.get) >= 0){
                let cone = clone(one);
                let player = this.getPlayerByIndex(one.get);
                player.returnMoney = true;
                cone.word = `退税(${one.word})`;
                let gets = [];
                let loses = [];
                for(let j in cone.realScore){
                    let num = cone.realScore[j];
                    if(num > 0){
                        loses.push(+j);
                    }else{
                        gets.push(+j);
                    }
                    if(!settBean[j]){
                        settBean[j] = 0;
                    }
                    settBean[j] -= num;
                }
                cone.type = Enum.PVP_TYPE.TS;
                cone.gets = gets;
                cone.loses = loses;
                delete cone.lose;
                delete cone.get;
                let realScore = this.calcActualBean(settBean, eveIdType.EXIT_SHUI);
                cone.realScore = realScore;
                tmpPvp.push(cone);
            }
        }
        for(let i = 0; i < tmpPvp.length; i++){
            this.pvpInfo.push(tmpPvp[i]);
            this.broadcastAddDel(tmpPvp[i].realScore);
        }
    }

    calcMaxRate(fan){
        return Math.pow(2, fan);
    }

    settlementHu(playerIndex){
        let settBean = {};
        let huPlayer = this.players[playerIndex];
        let bean = huPlayer.huMult* this.baseBean;
        if(!huPlayer.handCards.zmHu){
            let paoPlayer = this.getPlayerByIndex(huPlayer.paoIdx);
            if(!paoPlayer.isHu && !paoPlayer.isGoOut()) {
                settBean[huPlayer.paoIdx] = -bean;
                settBean[playerIndex] = bean;
            }
        }else{
            if(huPlayer.dghFlag === true && this.opts.DGHZM === false){
                let prePlayer = this.getPlayerByIndex(this.prePlayer);
                if(!prePlayer.isHu && !prePlayer.isGoOut()) {
                    settBean[this.prePlayer] = -bean;
                    settBean[playerIndex] = bean;
                }
            }else {
                let temp = 0;
                for (let id = 1; id <= this.playNum; id++) {
                    if (id !== playerIndex) {
                        let otherPlayer = this.getPlayerByIndex(id);
                        if(!otherPlayer.isHu && !otherPlayer.isGoOut()) {
                            settBean[id] = -bean;
                            temp += bean;
                        }
                    }
                }
                settBean[playerIndex] = temp;
            }
        }
        return settBean;
    }

    settlementGang(playerIndex, gangType){
        let rate = 2;
        if(gangType === Enum.GangType.PASSROAD){
            rate = 1;
        }
        let bean = this.baseBean * rate;
        let settBean = {};
        if(gangType === Enum.GangType.MING_GANG) {
            let prePlayer = this.getPlayerByIndex(this.prePlayer);
            if(!prePlayer.isHu && !prePlayer.isGoOut()) {
                settBean[this.prePlayer] = -bean;
                settBean[playerIndex] = bean;
            }
        }else{
            let temp = 0;
            for(let idx in this.players){
                if(+idx !== playerIndex){
                    let player = this.getPlayerByIndex(idx);
                    if(!player.isHu && !player.isGoOut()) {
                        settBean[+idx] = -bean;
                        temp += bean;
                    }
                }
            }
            settBean[playerIndex] = temp;
        }
        return settBean;
    }
    /**
     * 广播出局
     */
    broadOut(player){
        this.broadcastMsg(ProtoID.GAME_CLIENT_BOUT,{playerIndex:player.index});
        this.setOnTG(player);
    }

    setOnTG(player){
        if(player.isT) {
            player.isT = false;
            this.broadcastMsg(ProtoID.CLIENT_GAME_TG, {playerIndex:player.index, isT:false})
        }
    }
    /**
     * 结算杠(刮风下雨)
     */
    billGang(playerIndex, gangType){
        let settBean = this.settlementGang(playerIndex, gangType);
        let realScore = this.calcActualBean(settBean);              // 计算溢出
        return realScore;
    }
    /**
     * 结算金豆
     */
    billHu(playerIndex){
        let settBean =  this.settlementHu(playerIndex);             // 计算胡
        let realScore = this.calcActualBean(settBean);              // 计算溢出
        return realScore;
    }

    /**
     * 结算查叫
     */
    billCJ(){
        let data = this.settlementCJ();                                  // 计算查叫
        this.quitWater(data.NJ);                                         // 退税
        if(data && Object.keys(data.settBean).length > 0) {
            let realScore = this.calcActualBean(data.settBean);          // 计算溢出
            this.saveGangPVPInfoByCJ(realScore, data.mults, data.words);
        }
    }

    /**
     * 计算溢出
     */
    calcActualBean(settBean, eveId = eveIdType.MATCH){
        let realScore = {};
        if(!settBean) return realScore;
        let addBean = 0;
        for(let idx in settBean) {
            let num = settBean[idx];
            if(num >= 0){
                addBean += num;
            }
        }
        // let maxBean = this.maxBean - this.serverCost;

        let delBean = 0;
        for(let idx in settBean) {
            let player = this.players[idx];
            let bean = player.bean;
            let num = settBean[idx];
            if(num < 0){
                let realBean = Math.abs(num) > bean ? bean : Math.abs(num);
                delBean += realBean;
                player.updateCoin(1, -realBean, eveId);
                realScore[idx] = -realBean;
                player.roundBean -= realBean;
            }
        }
        for(let idx in settBean) {
            let player = this.players[idx];
            let needBean = settBean[idx];
            if(needBean >= 0){
                if(addBean === delBean){
                    player.updateCoin(1, needBean);
                    realScore[idx] = needBean;
                    player.roundBean += needBean;
                }else{
                    let temp = Math.floor(delBean * (needBean / addBean));
                    player.updateCoin(1, temp, eveId);
                    realScore[idx] = temp;
                    player.roundBean += temp;
                }
            }
        }

        return realScore;
    }
    /**
     * 设置下一盘庄家
     * @param playerIndex
     */
    setNextDealer(playerIndex, paoHu) {
        if (this.mode === "JB") {
            this.nextDealer = 1;
            return;
        }
        if(this.nextDealer !== 0){
            return;
        }
        if(this.huIng()) {
            if(paoHu){
                this.nextDealer = playerIndex;
            }else {
                this.nextTempDealer = playerIndex;
            }
        }else{
            this.nextDealer = playerIndex;
        }
    }

    genRealScoreInfo(){
        let scoreInfo = {};
        for(let idx in this.players){
            let player = this.players[idx];
            scoreInfo[idx] = player.roundBean;
        }
        return scoreInfo;
    }
    /**
     * 结算
     * @param playerIndex
     */
    onSettement() {
        this.billCJ();
        this.forcePVP();
        this.onSettTask();
        super.onSettlement();
        for(let idx in this.players){
            let player = this.players[idx];
            player.clearAutoPlayer();
            player.updateWatchScore();
            player.endReset();
        }
        let realScoreInfo = this.genRealScoreInfo();
        this.saveRoundIdToMySql(realScoreInfo);
        this.saveReportsToMiddle();
        this.preDealer = this.dealer;
        this.dealer = this.nextDealer === 0 ? this.dealer : this.nextDealer;
        this.endReset();
        this.sendSettMsg();
        if(this.getPlayerNum() === 0) {
            this.destroyRoomImmd();
        }
        this.popNextBtn();
    }

    /**
     * 发送结算消息
     */
    sendSettMsg(){
        let playerInfo = {};
        let hz = true;
        let overNum = 0;
        for(let idx in this.players){
            let player = this.players[idx];
            playerInfo[idx] = player.getOverInfo();
            if(player.isHu || player.isGoOut()){
                overNum++;
            }
        }
        if(this.playNum - overNum <= 1){
            hz = false;
        }
        this.enumPlayers(function(eIndex, ePlayer){
            if(!ePlayer.giveUpExit){
                ePlayer.sendMsg(ProtoID.GAME_CLIENT_SETT_DATA, {playerInfo, hz});
            }
        });
    }

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
}

exports.Room = XZRoom;
