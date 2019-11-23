let util            = require("util");
let Player          = require("./player.js");
let ProtoID         = require("../../net/CSProto.js").ProtoID;
let ProtoState      = require("../../net/CSProto.js").ProtoState;
let ActionType      = require("../../net/CSProto.js").ActionType;
let resEvent        = require("../../net/CSProto.js").resEvent;
let CommFuc         = require("../../util/CommonFuc.js");
let eventType       = require("../../net/CSProto.js").eveIdType;
let Enum            = require("./Enum.js");



class Room {
    constructor(data){
        // base property
        this.roomId = data.roomId;              // 房间号
        this.roundId = data.roundId;            // 牌局号

        this.baseBean = data.baseBean;          // 基础底注
        this.maxBean = data.maxBean;            // 封顶
        this.enterBean = data.enterBean;        // 进入需要的金豆
        this.subType = data.subType;            // 游戏子类型
        this.round = +data.round  || 99999;     // 总局数
        this.opts = data.opts || {};            // 选项配置
        this.playing = false;                   // 游戏进行中
        this.mode = data.mode;                  // 模式
        this.creator = this.getCreator(data.uid);   // 创建房间的人
        this.matchId = data.matchId || data.gameType;            // 匹配场id
        this.matchName = data.matchName || 99;   // 房间大小 99表示房卡场
        this.voiceStatus = 1;                   // 语音开关
        this.players = {};                      // 玩家信息
        this.gameOver = false;                  // 游戏结束
        this.serverCost = 0;                    // 服务费

        // room property
        this.costMode = 1;                      // 默认房主支付
        this.curRound = 1;                      // 轮数
        this.createTime = Date.getStamp();      // 创建时间
        this.robotLv = data.opts.robotOpts && data.opts.robotOpts.lv ? data.opts.robotOpts.lv : 100; // 电脑AI等级
        this.isPub = data.isPub;
    }

    /**
     * 房间初始化
     * @param cArgs
     * @returns {boolean}
     */
    init(cArgs) {
        this.serverCost = GameMgr.getServerCost(this.matchId, this.baseBean);
        GameMgr.createRoomCutDown(this);
        this.resetDestory();
        this.playNum = this.getMaxPlayerNum();
        return true;
    }

    /**
     * 获取最大玩家人数
     * @returns {number}
     */
    getMaxPlayerNum() {
        return 6;
    }


     /**
     * 获取创建房间者
     * @param uid
     * @returns {*}
     */
    getCreator(uid) {
         if(this.mode === "FK"){
             return uid;
         }else{
             return -100;
         }
    }
    /**
     * 获取房间号
     * @returns {*}
     */
    getId() {
        return this.roomId;
    }

    /**
     * 枚举玩家
     * @param callback
     */
    enumPlayers(callback) {
        for (let playerIdx in this.players) {
            if (callback(+playerIdx, this.players[playerIdx]) === false) {
                break;
            }
        }
    }
    /**
     * 枚举真实玩家
     * @param callback
     */
    enumRealPlayers(callback) {
        for (let playerIdx in this.players) {
            if(this.players[playerIdx].uid){
                if (callback(+playerIdx, this.players[playerIdx]) === false) {
                    break;
                }
            }
        }
    }

    /**
     * 枚举真实玩家
     * @param callback
     */
    enumPlayingPlayers(callback) {
        this.enumRealPlayers((eIndex, ePlayer)=>{
            if(ePlayer.playing){
                if (callback(eIndex, ePlayer) === false) {
                    return false
                }
            }
        })
    }

    /**
     * 获取房间玩家人数
     * @returns {number}
     */
    getPlayerNum() {
        let num = 0;
        this.enumPlayers((eIndex, ePlayer) => {
            if(ePlayer.uid){
                num++
            }
        });
        return num
    }

    /**
     * 获取房间玩家人数
     * @returns {number}
     */
    getRealPlayerNum() {
        let num = 0;
        this.enumPlayers((eIndex, ePlayer) => {
            if(!ePlayer.isRobot()){
                num++
            }
        });
        return num
    }


    /**
     * 获取房间已准备玩家人数
     * @returns {number}
     */
    getReadyPlayerNum() {
        let num = 0;
        this.enumPlayers((eIndex, ePlayer) => {
            if(ePlayer.uid && ePlayer.ready){
                num++;
            }
        });
        return num
    }

    /**
     * 广播消息
     * @param code
     * @param args
     * @param excludes
     */
    broadcastMsg(code, args, excludes) {
        excludes = excludes || [];
        this.enumPlayers(function (ePlayerIdx, ePlayer) {
            if ((excludes.indexOf(ePlayerIdx) === -1) && ePlayer.isInit && ePlayer.uid !== 0) {
                ePlayer.sendMsg(code, args);
            }
        });
    }

    /**
     * 获取房间基础信息
     *
     */
    getRoomBaseInfo() {
        return {
            roomId   : this.roomId,
            round    : this.round,
            roundId  : this.roundId,
            gameType : this.gameType,
            subType  : this.subType,
            options  : this.opts,
            playing  : this.playing,
            creator  : this.creator,
            matchId  : this.matchId,
            matchName: this.matchName,
            baseBean : this.baseBean,
            enterBean:this.enterBean,
            voiceStatus : this.voiceStatus,
            sceneMode:this.mode || "JB",
            players  : {},
            curRound : this.curRound,
            gameOver : this.gameOver,
            dealerIndex : this.dealer,
            roundStatus : this.state,
            turns    : this.turns,
            curTurns : this.curTurns
        };
    }

    /**
     * 获取玩家信息 uid 0表示没有玩家
     */
    getPlayerInfo() {
        let data = {};
        for(let idx in this.players){
            let oPlayer = this.players[idx];
            if(oPlayer.uid !== 0) {
                data[idx] = oPlayer.getInfo();
            }
        }
        return data;
    }

    getRoomInfo(){
        return this.getRoomBaseInfo();
    }


    /**
     * 添加一个玩家
     * @param rArgs
     * @param wsConn
     * @returns {*}
     */
    addPlayer(rArgs, wsConn) {
        // 检查房间是否已满
        ERROR(`${rArgs.uid}加入游戏`);
        let uid = rArgs.uid;
        let playerIndex = this.getPlayerIndex(uid);
        if(this.getPlayerNum() >= this.getMaxPlayerNum() && playerIndex === 0){
            console.log("room full");
            return false
        }
        if (playerIndex !== 0) {
            if(this.gameType == 3) {                        // 完结可以不必强制退出的游戏
                return this.onPlayerReconnect(playerIndex, wsConn);
            }else {
                this.onPlayerReconnect(playerIndex, wsConn);
                if (this.gameOver && uid !== this.creator && this.mode === "JB") {                        // JB场完结必须退出的游戏
                    this.quitRoom(uid);
                    return false;
                } else {
                    return true;
                }
            }
        }else{
            playerIndex = this.getEmptyIndex();
        }
        let player = this.players[playerIndex];
        let middleData = GameMgr.getPlayerMiddleInfo(uid) || {};
        player.init(middleData, wsConn);
        let roomInfo = this.getRoomInfo();
        this.onPlayerEnter(player.uid);
        roomInfo.players = this.getPlayerInfo();
        player.sendMsg(ProtoID.CLIENT_GAME_JOIN_ROOM,{roomInfo : roomInfo, playerIndex : playerIndex, reconnect:true});
        this.broadcastMsg(ProtoID.GAME_CLIENT_ADD_ROOM, {playerIndex: playerIndex, playerInfo: player.getInfo()}, [+playerIndex]);
        return true;
    }

    /**
     * 玩家进入
     * @param uid
     */
    onPlayerEnter(uid){
        let player = this.getPlayerByUid(uid);
        if(!this.playing && player.uid !== this.creator) {
            ERROR(player.name + "设置了准备事件");
            this.setReadyEvent(player.index, Enum.READY_SECOND[this.mode] * 1000);
        }
    }

    onPlayingCanQuit(player){
        return false;
    }

    isCanQuit(player){
        if(player.playing){
            return this.onPlayingCanQuit(player);
        }else{
            return true;
        }
    }



    /**
     * 取消匹配/退出房间
     */
    quitRoom(uid) {
        let player = this.getPlayerByUid(uid);
        if(player) {
            if(player.giveUpExit){
                return;
            }
            let quit = this.isCanQuit(player);
            if (!quit) {
                player.sendMsg(ProtoID.CLIENT_GAME_LEAVE_ROOM, {result: ProtoState.STATE_GAME_ALREADY_START});
            } else {
                player.sendMsg(ProtoID.CLIENT_GAME_LEAVE_ROOM, {});
                this.leaveRoomCommon(player);
            }
        }else{
            return -1;
        }
    }

    onPlayerChange(player){

    }

    /**
     * 换桌
     * @param uid
     */
    changeRoom(uid) {
        if(this.mode === "FK"){
            return;
        }
        let player = this.getPlayerByUid(uid);
        let ok = this.onPlayerChangeRoom(player);
        if(!ok){
            return;
        }
        this.onPlayerChange(player);
        this.leaveRoomCommon(player);
        GameMgr.sendMgrMsg({
            code: ProtoID.CLIENT_GAME_MIDDLE_CHENG_ROOM,
            args: {
                guid: uid,
                matchId: this.matchId,
                sourceSid: this.roomId
            }
        });
    }

    /**
     * 退出游戏
     * @param uid
     */
    cancelMatch(uid){
        let flag = this.quitRoom(uid);
        if(flag === -1){
            return -1;
        }else{
            return null;
        }
    }
    /**
     * 更新资源
     * @param data
     */
    updatePlayerStatus(data){
        let player = this.getPlayerByUid(data.uid);
        if(player){
            player.updateStatus(data);
            //广播更新资源
            this.updateResources();
        }
    }

    onPlayerChangeRoom(player){
        if(player.bean < this.enterBean){
            ERROR("金豆不足");
            player.sendMsg(ProtoID.CLIENT_GAME_MIDDLE_CHENG_ROOM,{result: ProtoState.STATE_GAME_BEAN_LESS});
            return false;
        }
        return this.subGameChange(player);
    }

    subGameChange(player){
        if(this.playing){
            return false;
        }else {
            return true;
        }
    }

    /**
     * 离开房间发的共有消息
     * @param player
     */
    leaveRoomCommon(player) {

        player.ready = false;
        //通知中央服玩家退出
        GameMgr.mgrClient.sendMsg({code: ProtoID.GAME_MIDDLE_PLAY_LEVAL_ROOM,args: {
                roomId: this.roomId,
                gameType: this.gameType,
                guid: player.uid,
                giveUpExit: player.giveUpExit
            }});

        this.broadcastMsg(ProtoID.GAME_CLIENT_LEVEL_ROOM, {playerIndex: player.index,gameType:this.gameType}, [player.index]);
        player.destroy();
        this.onPlayerQuit(player);

        if(this.mode === "FK"){
            if(player.uid === this.creator){
                GameMgr.noticeJS(this);
                this.destroyRoomNow();
                return;
            }
        }

        if(this.getRealPlayerNum() <= 0) {
            this.destroyRoomNow();
        }
    }

    /**
     * 销毁的另一个方法
     */
    destroyRoomImmd(){
        this.destroyRoomNow();
    }

    /**
     * 解散房间
     */
    tryDestroy() {
        let flag = true;

        this.enumRealPlayers((eIndex, ePlayer) => {
            flag = false
        });

        if(this.opts.isRobot && this.getRealPlayerNum() <= 0){
            flag = true;
        }
        if(flag){
            this.destroyRoomNow();
        }
    }


    /**
     * 玩家离线
     * @param player
     */
    onPlayerOffline(player) {
        if(player){
            let playerIndex = this.getPlayerIndex(player.uid);
            if(player.uid && !player.giveUpExit){
                this.broadcastMsg(ProtoID.GAME_CLIENT_DX,{playerIndex: playerIndex}, [playerIndex]);
            } else {
                if(this.getPlayerNum() <= 0){
                    this.destroyRoomNow();
                }
            }
        }else {
            if(this.getPlayerNum() <= 0){
                this.destroyRoomNow();
            }
        }
    }

    /**
     * 玩家重连
     * @param playerIndex
     * @param wsConn
     * @returns {boolean}
     */
    onPlayerReconnect(playerIndex, wsConn) {
        let player = this.players[playerIndex];
        player.setNewConn(wsConn);
        let roomInfo = this.getRoomInfo();
        roomInfo.players = this.getPlayerInfo();
        player.sendMsg(ProtoID.CLIENT_GAME_JOIN_ROOM,{roomInfo : roomInfo, playerIndex : playerIndex, reconnect:true});
        // this.broadcastMsg(ProtoID.GAME_CLIENT_ON_LINE,{playerIndex: playerIndex}, [playerIndex]);
        if(!this.playing) {
            this.broadcastMsg(ProtoID.GAME_CLIENT_ADD_ROOM,{playerIndex: playerIndex,playerInfo: player.getInfo()}, [+playerIndex]);
        }else{
            this.broadcastMsg(ProtoID.GAME_CLIENT_ON_LINE,{playerIndex: playerIndex}, [playerIndex]);
        }
        return true;
    }


    /**
     * 获取玩家索引
     * @param uid
     * @returns {number}
     */
    getPlayerIndex(uid) {
        let player = this.getPlayerByUid(uid);
        if(player){
            return player.index
        }
        return 0;
    }

    /**
     * 获取玩家
     * @param uid
     * @returns {*}
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
     * 设置玩家索引
     * @returns {*}
     */
    getEmptyIndex() {
        for (let playerIdx in this.players) {
            if (this.players[playerIdx].uid === 0) {
                return +playerIdx;
            }
        }
        return null;
    }

    /**
     * 继续
     * @param uid
     * @param isReady
     */
    onPlayerReqContinue(uid, isReady){
        this.onPlayerReady(uid, isReady)
    }
    /**
     * 玩家准备
     * @param uid
     * @param isReady
     */
    onPlayerReady(uid, isReady) {
        if(this.playing){
            ERROR("已经开始游戏了");
            return;
        }
        let playerIndex = this.getPlayerIndex(uid);
        if(playerIndex === 0){
            ERROR("玩家不存在此房间");
            return;
        }
        let player = this.players[playerIndex];
        //if(this.mode === "JB"){
            if(player.bean < this.enterBean){
                player.sendMsg(ProtoID.CLIENT_GAME_READY,{playerIndex: playerIndex,isReady:false,result: ProtoState.STATE_GAME_BEAN_LESS});
                return
            }
        // }else {
        //
        // }

        this.broadcastMsg(ProtoID.CLIENT_GAME_READY,{playerIndex,isReady});
        player.ready = isReady;
        this.onRoomPlayerReady(player);
        if (this.isCanStart()) {
            //DEBUG("开始游戏");
            this.playing = true;
            this.onRoomStartNewRound();
        }
    }

    onRoomPlayerReady(player){
        player.clearAutoPlayer();
    }

    /**
     * 是否能开始游戏
     * @returns {boolean}
     */
    isCanStart() {
        if(this.getRealPlayerNum() >= 1){
            return (this.getPlayerNum() >= 2 && this.getPlayerNum() === this.getReadyPlayerNum()) && this.playing === false
        } else {
            return false
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
            ePlayer.setDestroyState(0);
        });
    }

    /**
     * 开始新一轮
     */
    onRoomStartNewRound() {
        GameMgr.getSubGame(this.gameType).startRoom(this);
        GameMgr.clearRoomCutDown(this);
        GameMgr.initTaskParams(this.players);           // 任务参数
        this.enumRealPlayers((eIndex, ePlayer) => {
            ePlayer.playing = true;
        });
        this.playing = true;
        GameMgr.noticeStart(this.roomId, 1);
        this.removeServerCost();
        this.updateResources();
        this.playerCount();
    }

    /**
     * 计算消耗
     * @param ePlayer
     * @returns {number}
     */
    calcConsume(ePlayer){
        let consume = -1;
        if(!ePlayer.serverCostTip[this.matchId]) {
            consume = this.serverCost;
            ePlayer.serverCostTip[this.matchId] = 1;
            GameMgr.playInfo[ePlayer.uid].serverCostTip[this.matchId] = 1;
        }
        return consume;
    }

    /**
     * 是否有机器人
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
     * 获取玩家
     * @param index
     * @returns {*}
     */
    getPlayerByIndex(index) {
        return this.players[index]
    }


    /**
     * 获取参与游戏玩家人数
     * @returns {number}
     */
    getPlayingPlayerNum() {
        let num = 0;
        this.enumRealPlayers((eIndex, ePlayer) => {
            if(ePlayer.playing){
                num++
            }
        });
        return num
    }


    /**
     * 摧毁房间
     */
    destroyRoomNow() {
        this.onRoomDestroy();
        this.destory = true;
        this.broadcastMsg(ProtoID.CLIENT_GAME_DESTORY_ROOM, {gameType: this.gameType});
        GameMgr.getSubGame(this.gameType).destroyRoom(this);
        GameMgr.getSubGame(this.gameType).endRoom(this);
    }
    /**
     * 摧毁房间
     */
    onRoomDestroy() {
        let uids = [];
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.uid !== 0){
                uids.push(player.uid);
                player.playing = false;
                if(player.isRobot()){
                    RobotMgr.onQuitRoom(player.uid);
                }
                this.quitRoom(player.uid);
            }
        }
        GameMgr.removePlayer(uids, this.roomId);
    }

    /**
     * 关闭进程
     */
    shutdown() {
        this.destroyRoomNow();
    }

    //
    // /**
    //  * 资源改变
    //  */
    // resourcesChange() {
    //     let res = {};
    //     this.enumRealPlayers((eIndex, ePlayer) => {
    //         if(ePlayer) {
    //             res[eIndex] = {};
    //             res[eIndex].bean = ePlayer.bean;
    //             res[eIndex].card = ePlayer.card;
    //         }
    //     });
    // }

    /**
     * 扣除服务费
     */
    removeServerCost() {
        let uData = {};
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.uid){
                uData[player.uid] = true;
                player.updateCoin(1,-this.serverCost,eventType.SERVER_COST);
                let logData = {uid: player.uid, match_id:this.matchId, round_id:this.roundId, cur_round:this.curRound, bean:this.serverCost};
                Log.profitResult(logData);
            }
        }
        GameMgr.costProfit(this.serverCost, uData);
    }

    /**
     * 设置挂起任务
     * @param time
     * @param users
     */
    setActionTimer (action, time, users) {
        let data = {action: action, stamp: Date.getStamp() * 1000, duration: time, users: users};
        this.actionTimer = data;
        this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME, data);
    }

    /**
     * 下一个出牌玩家
     * @param starIndex
     * @returns {number}
     */
    getNextPlayerIndex(starIndex) {
        return starIndex % this.playNum + 1;
    }

    /**
     * 结算
     */
    onSettlement() {
        this.settlement();
        this.updateResources();
        GameMgr.createRoomCutDown(this);
        this.createTime = Date.getStamp();
        GameMgr.noticeStart(this.roomId, 2);
        this.gameOver = true;
        this.enumPlayers(function (eIndex, ePlayer) {
            ePlayer.sendMsg(ProtoID.CLIENT_GAME_TG,{playerIndex:ePlayer.index, isT:false})
        })
    }

    /**
     * 移除不在线的玩家
     */
    removeOffUser () {
        if(this.mode === "FK") return;
        for(let idx in this.players){
            let player = this.players[idx];
            if(player.uid > 0){
                if(!player.online){
                    this.quitRoom(player.uid);
                }
            }
        }
    }

    /**
     * 统计
     */
    playerCount() {
        let players = {};
        this.enumPlayingPlayers((eIndex, ePlayer) => {
            if(ePlayer.playing){
                players[ePlayer.uid] = {
                    name: "play",
                    num: 1
                }
            }
        });
        GameMgr.updatePlayerCount(players);
    }

    /**
     * 检测任务
     */
    checkTask(player) {
        // if(this.mode === "FK"){
        //     return;
        // }
        player.taskParams.uid = player.uid;
        player.taskParams.gameType = this.gameType;
        player.taskParams.subType = this.subType;
        player.taskParams.matchName = this.matchName;
        GameMgr.checkTask(player.taskParams);
    }

    /**
     * 设置自动托管
     * @param player
     */
    setAutoT(player, req) {
        return;
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
     * 请求剩余牌 本接口用于GM测试(麻将专用)
     * @param uid
     */
    onPlayerPlusCards(uid) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        if(player){
            let cards = clone(this.publicCards.cards);
            let len = cards.length;
            let pCards = [];
            for(let i = this.publicCards.getIndex; i < len; i++){
                pCards.push(cards[i]);
            }
            player.sendMsg(ProtoID.CLIENT_GAME_PLUS_CARDS, {cards:pCards});
        }
    }

    /**
     * 修改底牌(麻将专用)
     * @param uid
     * @param mCards
     */
    onPlayerModifyCards (uid, mCards) {
        let playerIndex = this.getPlayerIndex(uid);
        let player = this.players[playerIndex];
        let cards = this.publicCards.cards;
        if(player){
            let mLen = mCards.length;
            let pLen = cards.length - this.publicCards.getIndex;
            let sumLen = cards.length;
            if(mLen === pLen) {
                let pos = 0;
                for (let i = this.publicCards.getIndex; i < sumLen; i++) {
                    cards[i] = mCards[pos];
                    pos++;
                }
                player.sendMsg(ProtoID.CLIENT_GAME_MODIFY_CARDS);
            }
        }
    }
    /**
     * 根据保存牌局号保存数据到中央服
     */
    saveRoundIdToMySql(realScoreInfo) {
        let playerInfo = this.getPlayerRoundIdInfo();
        let uids = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0};
        for(let idx in this.players){
            uids[idx] = this.players[idx].uid;
        }
        Log.gameResult(this.roundId, this.curRound, this.matchId, playerInfo, realScoreInfo, uids);
    }

    /**
     * 获取玩家的牌局信息 保存到服务器
     */
    getPlayerRoundIdInfo() {
        let data = {};
        for(let idx in this.players){
            let player = this.players[idx];
            data[idx] = player.handCards.getLogCard();
        }
        return JSON.stringify(data);
    }

    saveReportsToMiddle(){
        let data = {};
        data.roundId = this.roundId;
        data.gameType = this.gameType;
        data.mode = this.mode;
        data.roomId = this.roomId;
        data.creator = this.creator;
        data.curRound = this.curRound;
        data.players = [];
        data.time = new Date().getTime();
        return data;
    }

    /**
     * 游戏结束获取房间的基本信息
     */
    getEndRoomInfo(){
        let data = {};
        data.curRound = this.curRound;
        data.roundId = this.roundId;
        data.creator = this.creator;
        data.round = this.round;
        data.roomId = this.roomId;
        data.endTime = Date.getStamp();
        data.options = this.opts;
        return data;
    }
    /**
     * 结算
     */
    settlement() {
        DEBUG("empty....settlement")
    }

    /**
     * 更新资源
     */
    updateResources() {
        let data = {};
        this.enumRealPlayers((eIndex, ePlayer) => {
            data[ePlayer.index] = {};
            if(ePlayer.bean>=0){
                data[ePlayer.index].bean = ePlayer.bean;
            }
            if(ePlayer.card>=0){
                data[ePlayer.index].card = ePlayer.card;
            }
            if(ePlayer.diamond>=0){
                data[ePlayer.index].diamond = ePlayer.diamond;
            }
        });
        this.broadcastMsg(ProtoID.GAME_CLIENT_RES_CHANGE, {players: data, reason: resEvent.MJ_CHANGE})
    }


    /**
     * 丫丫语音
     * @param uid
     * @param rArgs
     */
    client_game_yaya(uid,rArgs) {
        let url = rArgs.url;
        let path = rArgs.path;
        let str = rArgs.str;
        let playerIndex = this.getPlayerIndex(uid);
        this.broadcastMsg(ProtoID.CLIENT_GAME_YAYA,{url:url,path: path,str:str, playerIndex:playerIndex},[playerIndex]);
    }

    /**
     * 聊天
     * @param uid
     * @param rArgs
     */
    onPlayerChatReq(uid,rArgs) {
        let playerIndex = this.getPlayerIndex(uid);
        this.broadcastMsg(ProtoID.CLIENT_GAME_DO_CHAT,{content:rArgs.message.text,playerIndex:playerIndex, type:rArgs.message.type});
    }

    /**
     * 互动表情
     * @param uid
     * @param rArgs
     */
    onPlayerGiftReq(uid, rArgs) {
        let playerIndex = this.getPlayerIndex(uid);
        this.broadcastMsg(ProtoID.CLIENT_GAME_GIFT,{giftId:rArgs.giftId,sourceIndex:playerIndex, targetIndex:rArgs.targetIndex});
    }
    /**
     * 房主解散房间
     * @param uid
     * @returns {boolean}
     */

    client_game_destory_room(uid) {
        if(uid != this.creator){
            return false;
        }
        if(this.mode === "FK"){
            if(this.state === 1) {
                this.broadcastMsg(ProtoID.CLIENT_GAME_DESTORY_ROOM, {});
                this.destroyRoomImmd();
            }
        }
    }

    /**
     * 用户申请解散房间
     * @param uid
     */
    client_game_launch_restory_room(uid) {
        if(this.mode === "JB"){
            return;
        }
        let playerIndex = this.getPlayerIndex(uid);
        if(!this.playing && this.curRound === 1){
            this.cancelMatch(uid);
            return;
        }
        if (!this.isReqDestroy) {
            this.isReqDestroy = true;
            this.destroyIndex = playerIndex;
            this.destroyTime = Date.getStamp() * 1000;
            this.destroyPlayers = this.getPlayerNum();
            let player = this.players[playerIndex];
            player.setDestroyState(1);
            // 广播通知
            this.broadcastMsg(ProtoID.CLIENT_GAME_VOTE_ROOM, {playerIndex: playerIndex, destroyTime: this.destroyTime, duration:Enum.ROOM_VOID_TIME * 1000});
            this.onPlayerJSRoom(uid, true);
            this.sendActionTimer(Enum.ROOM_VOID_TIME * 1000, ActionType.JS_ROOM);
            for(let index in this.players){
                let op = this.players[index];
                if(op.uid != uid) {
                    (function (op, room) {
                        op.scheJob = setTimeout(function () {
                            room.onPlayerJSRoom(op.uid, true);
                        }.bind(room), Enum.ROOM_VOID_TIME * 1000)
                    })(op, this);
                }
            }
        }
    }
    /**
     * 玩家选择解散房间
     * @param uid
     * @param isAgree
     */
    onPlayerJSRoom(uid, isAgree) {
        let playerIndex = this.getPlayerIndex(uid);
        if(this.mode === "JB"){
            return;
        }
        if (this.respDestroyOKs.hasOwnProperty(playerIndex)) {
            return;
        }
        // 广播消息
        let player = this.players[playerIndex];
        if(player) {
            this.broadcastMsg(ProtoID.CLIENT_GAME_VOTE_AGREE, {gameType: 1, playerIndex: playerIndex, ok: isAgree});
            this.respDestroyOKs[playerIndex] = isAgree;
            this.selectDestroyNum++;
            player.clearAutoPlayer();
            let state = isAgree ? 1 : 2;
            player.setDestroyState(state);
            let needNum = this.subType === 1 ? 0 : 1;
            if ((this.selectDestroyNum >= this.destroyPlayers) || (this.selectDestroyNum >= this.getRealPlayerNum())) {
                let nAgree = 0;
                for (let idx in this.respDestroyOKs) {
                    if (!this.respDestroyOKs[idx]) {
                        nAgree++;
                    }
                }
                let success = nAgree <= needNum ? true : false;
                this.broadcastMsg(ProtoID.GAME_CLIENT_VOTE_RESULT, {success: success, gameType: this.gameType});
                this.resetDestory();
                if (success) {
                    this.onGameOver();
                }
            }
        }
    }

    /**
     * 每个游戏单独写
     */
    onGameOver(){

    }

    getAgreeNum() {
        let agree = 0;
        for (let idx in this.respDestroyOKs) {
            if (this.respDestroyOKs[idx]) {
                agree++;
            }
        }
        return agree;
    }

    sendActionTimer(time, action=ActionType.MJ_GA) {
        if(action === ActionType.JS_ROOM){
            time = 0;
        }
        let data = {action: action, stamp: Date.getStamp() * 1000, duration: time, users: this.getRelationPlayer()};
        this.actionTimer = data;
        this.broadcastMsg(ProtoID.GAME_CLIENT_ACTION_TIME,data);
    }

    /**
     * 请在每个游戏单独写
     */
    getRelationPlayer(){

    }
}

module.exports = Room;
