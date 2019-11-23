/**
 * Created by pander on 2018/5/7.
 */
// ==== 麻将游戏数据 =========================================================
var GameDataMahjong = game.GameDataBasic.extend({

    playStatus          : 0,            // 当前的游戏状态
    dealerIndex         : -1,           // 庄家索引
    ling                : -1,           // 当前房间的令 0 1 2 3东南西北
    publicCardsNum      : -1,           // 剩余的公牌数量      -1表示没有公牌
    curPlayIndex        : -1,           // 当前出牌的玩家座位索引
    lastPlayIndex       : -1,           // 上次出牌的玩家座位索引
    isPlayedCard        : false,        // 当前玩家是否已经出过牌了
    isExistHangupTasks  : false,        // 是否存在挂起任务

    lastPlayedCard      : -1,           // 上次出的牌的值
    tings               : [],           // 胡牌提示数组

    _reset : function () {
        this._super();

        this.playStatus = 0;
        this.dealerIndex = -1;
        this.publicCardsNum = -1;
        this.curPlayIndex = -1;
        this.lastPlayIndex = -1;
        this.isPlayedCard = false;
        this.isExistHangupTasks = false;

        this.lastPlayedCard = -1;
        this.tings = [];
    },

    /**
     * 解析游戏房间数据
     * @param json
     */
    parseRoomEnter : function(json) {
        cc.log("解析加入房间数据");

        this._reset();
        this.reconnect = json.reconnect;
        // 房间信息
        var roomInfo = json.roomInfo;

        this.roomId = +roomInfo.roomId;
        game.DataKernel.roomId = this.roomId;
        this.round = +roomInfo.round;
        this.roundId = roomInfo.roundId || 0;
        this.gameType = roomInfo.gameType;
        this.subType = roomInfo.subType;
        this.turns = roomInfo.turns;
        this.curRound = roomInfo.curRound;
        this.curTurns = roomInfo.curTurns;
        this.options = roomInfo.options;
        this.playing = roomInfo.playing;
        this.creator = roomInfo.creator;                // 房间创建者的uid
        this.destroyInfo = roomInfo.destroyInfo;        // 销毁房间信息
        this.matchId = roomInfo.matchId;                // 匹配场标识
        this.actionTimer = roomInfo.actionTimer;        // 定时器
        this.voiceStatus = roomInfo.voiceStatus || 1;   // 房间的状态
        this.baseBean = roomInfo.baseBean;
        this.enterBean = roomInfo.enterBean;
        this.playStatus = roomInfo.playStatus;          // 当前游戏的状态
        this.dealerIndex = roomInfo.dealerIndex;        // 庄
        this.ling = roomInfo.season;              // 叫令0 1 2 3东南西北
        this.publicCardsNum = roomInfo.publicCardsNum;  // 公牌数量
        this.curPlayIndex = roomInfo.curPlayIndex;      // 当前出牌的玩家
        this.lastPlayIndex = roomInfo.lastPlayIndex;    // 上次出牌的玩家
        this.isPlayedCard = roomInfo.isPlayedCard;      // 玩家是否已经出过了牌
        this.isExistHangupTasks = roomInfo.isExistHangupTasks;  // 是否存在挂起任务
        this.matchName = roomInfo.matchName;
        // 房卡场字段
        this.sceneMode = roomInfo.sceneMode;            // "FK" "JB" 区分房卡场和金币场

        //麻将房卡场判断游戏是不是开始了的新增加字段
        this.gPlaying = roomInfo.gPlaying;

        var players = roomInfo.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var player = players[index];
                this.players[index] = {};
                this.players[index].uid = +player.uid;
                this.players[index].name = player.name;
                this.players[index].sex = +player.sex;
                this.players[index].headPic = player.headPic;
                this.players[index].online = player.online;
                this.players[index].ready = player.ready;
                this.players[index].ip = player.ip;
                this.players[index].index = +index;
                this.players[index].bean = player.bean || 0;
                this.players[index].card = player.card || 0;
                this.players[index].diamond = player.diamond || 0;
                this.players[index].playing = player.playing;
                this.players[index].gps = player.gps;
                this.players[index].actionTimer = player.actionTimer;
                this.players[index].matchIng = player.matchIng;

                //玩家销毁房间的状态
                this.players[index].destroyState = player.destroyState;

                this.players[index].multiple = player.multiple || -1;       // 上噶倍数 (-1 未上  0 不上  1 1倍 2 2倍)
                this.players[index].handCards = player.handCards || {};     // 玩家的手牌
                this.players[index].handCardsNumber = player.handCardsNumber || 0;      // 玩家的手牌数量
                this.players[index].playedCards = player.playedCards || []; // 玩家已经出了的牌
                this.players[index].flowerCards = player.flowerCards || []; // 补花的牌
                this.players[index].pengCards = player.pengCards || [];     // 玩家碰的牌
                this.players[index].gangCards = player.gangCards || [];     // 杠的牌
                this.players[index].chiCards = player.chiCards || [];       // 吃的牌
                this.players[index].hszCards = player.hszOutCards || [];       // 吃的牌
                this.players[index].hangupTasks = player.hangupTasks || {}; // 挂起任务
                this.players[index].existOtherHangup = player.existOtherHangup || false;// 是否存在其他人挂起事件
                this.players[index].huCard = player.huCard || 0;            // 胡的牌
                this.players[index].isTrusteeship = player.isT || false;    // 玩家托管
                this.players[index].haveTing = player.haveTing || false;           // 玩家是否听牌
                this.players[index].dqType = player.dqType || -1;                  // 定缺
                this.players[index].hszStatus = player.hszStatus || 0;             // 选牌状态
                this.players[index].hszRecommend = player.hszRecommend || [];      // 换三张推荐
                this.players[index].dqRecommend = player.dqRecommend || -1;        // 定缺推荐
                this.players[index].huOrder = player.huOrder || 0;        // 胡的顺序
                this.players[index].paoIdx = player.paoIdx || 0;         // 点炮的玩家
            }
        }

        // 玩家信息
        this.playerIndex = +json.playerIndex;
    },

    /**
     * 获取游戏最大人数
     * @returns {number}
     */
    getPlayerNum : function() {
        // subType 1 两人模式   2 四人模式
        return this.subType == 1 ? 2 : 4;
    },

    /**
     * 开始新的一局更新状态
     */
    updateStartNewRound : function() {
        this.playStatus = 1;
        this.dealerIndex = -1;
        this.publicCardsNum = -1;
        this.curPlayIndex = -1;
        this.lastPlayIndex = -1;
        this.isPlayedCard = false;
        this.isExistHangupTasks = false;
        this.lastPlayedCard = -1;
        this.tings = [];
        this.playing = true;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = true;

                player.multiple = -1;           // 上噶倍数 (-1 未上  0 不上  1 1倍 2 2倍)
                player.handCards = {};          // 玩家的手牌
                player.handCardsNumber = 0;     // 玩家的手牌数量
                player.playedCards = [];        // 玩家已经出了的牌
                player.flowerCards = [];        // 补花的牌
                player.pengCards = [];          // 玩家碰的牌
                player.gangCards = [];          // 杠的牌
                player.chiCards = [];           // 吃的牌
                player.hangupTasks = {};        // 挂起任务
                player.existOtherHangup = false;    // 是否存在其他人挂起事件
                player.huCard = 0;              // 胡的牌
                player.isTrusteeship = false;

                player.dqType = -1;
                player.hszRecommend = [];
                player.dqRecommend = -1;
                player.paoIdx = 0;
                player.huOrder = 0;
            }
        }
    },

    /**
     * 获取方位字符串
     * @param uiIndex
     * @returns {*}
     */
    getDirectionString : function (uiIndex) {
        switch (uiIndex) {
            case 2 : return "East";
            case 3 : return "North";
            case 4 : return "West";
            default : return "South";
        }
    },

    /**
     * 结束一局更新状态
     */
    updateEndRound : function () {
        this.playStatus = 0;
        this.dealerIndex = -1;
        this.publicCardsNum = -1;
        this.curPlayIndex = -1;
        this.lastPlayIndex = -1;
        this.isPlayedCard = false;
        this.isExistHangupTasks = false;
        this.lastPlayedCard = -1;
        this.tings = [];
        this.playing = false;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = false;
                player.ready = false;

                player.multiple = -1;           // 上噶倍数 (-1 未上  0 不上  1 1倍 2 2倍)
                player.handCards = {};          // 玩家的手牌
                player.handCardsNumber = 0;     // 玩家的手牌数量
                player.playedCards = [];        // 玩家已经出了的牌
                player.flowerCards = [];        // 补花的牌
                player.pengCards = [];          // 玩家碰的牌
                player.gangCards = [];          // 杠的牌
                player.chiCards = [];           // 吃的牌
                player.hangupTasks = {};        // 挂起任务
                player.existOtherHangup = false;    // 是否存在其他人挂起事件
                player.huCard = 0;              // 胡的牌
                player.isTrusteeship = false;

                player.dqType = -1;
                player.hszRecommend = [];
                player.dqRecommend = -1;
                player.paoIdx = 0;
                player.huOrder = 0;
            }
        }
    },

    /**
     * 本玩家是否是房主 房卡场专用
     */
    isCreator: function () {
        return this.creator == this.getMainPlayer().uid;
    },

    /**
     * 检测除了房主之外的其他玩家是否准备
     * @returns {boolean}
     */
    checkReady: function () {
        if (Object.keys(this.players).length < this.getPlayerNum()) {
            return false;
        }
        var allReady = true;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                if (index == this.playerIndex) {
                    continue;
                }
                if (!this.players[index].ready) {
                    allReady = false;
                    break;
                }
            }
        }
        return allReady;
    }
});
