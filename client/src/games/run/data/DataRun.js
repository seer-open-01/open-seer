/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快数据
 */
var DataRun = game.GameDataBasic.extend({
    dealer              : -1,               // 地主
    roundStatus         : 0,                // 游戏状态
    curPlay             : -1,               // 当前出牌的玩家下标
    actionTimer         : null,             // 倒计时

    ctor : function () {
        this._super();
        return true;
    },

    reset : function () {
        this._reset();
    },

    _reset : function() {
        this._super();
        this.dealer = -1;
        this.actionTimer = null;
    },

    /**
     * 解析重连数据
     */
    parseRoomEnter : function(json) {
        this._reset();
        // 房间信息
        var roomInfo = json['roomInfo'];
        this.roomId = roomInfo.roomId;
        this.roundId = roomInfo.roundId || 0;
        this.round = +roomInfo.round;
        this.curRound = roomInfo.curRound;
        this.baseScore = roomInfo.baseScore || 1;
        this.baseBean = roomInfo.baseBean;
        this.enterBean = roomInfo.enterBean;
        this.gameType = roomInfo.gameType;
        this.subType = roomInfo.subType;
        this.playing = roomInfo.playing;
        this.creator = roomInfo.creator;                    // 房间创建者的uid
        this.destroyInfo = roomInfo.destroyInfo;            // 解散房间信息
        this.matchId = roomInfo.matchId;                    // 匹配场标识
        this.options = roomInfo.options;                    // 匹配场配置
        this.voiceStatus = roomInfo.voiceStatus || 1;       // 房间的状态
        this.matchName = roomInfo.matchName;
        // -- 重连部分房间信息 --------------------------
        this.roundStatus = roomInfo.roundStatus;            // 当前游戏进度状态
        this.curPlay = roomInfo.curPlayIndex;               // 当前应该出牌的玩家
        this.actionTimer = roomInfo.actionTimer;            // 倒计时
        this.multiple = roomInfo.roomBet || 0;
        this.sceneMode = roomInfo.sceneMode;                // "FK" "JB" 区分房卡场和金币场

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
                this.players[index].score = player.score || 0;
                this.players[index].bean = player.bean || 0;
                this.players[index].card = player.card || 0;
                this.players[index].diamond = player.diamond || 0;
                this.players[index].playing = player.playing;
                this.players[index].gps = player.gps;
                this.players[index].matchIng = player.matchIng;

                // 重连部分处理数据
                this.players[index].handCards = player.handCards;           // 玩家的手牌数组
                this.players[index].handCardsNum = player.handCardsNum;     // 玩家的手牌数量
                this.players[index].outCards = player.outCards;             // 玩家出的牌
                this.players[index].zdCount = player.zdCount || 0;          // 炸弹个数
                this.players[index].isCan = player.isCan;                   // 玩家是否可以出牌
                this.players[index].isTrusting = player.isT;                // 玩家是否在托管状态
                this.players[index].actionTimer = player.actionTimer || null;
                this.players[index].destroyState = player.destroyState;
            }
        }

        // 本玩家
        this.playerIndex = json.playerIndex;
    },

    /**
     * 获取人数
     */
    getPlayerNum : function() {
        return this.subType == 1 ? 3 : 4;
    },

    /**
     * 开始新的一局更新状态
     */
    updateStartNewRound : function() {
        this.playing = true;
        this.dealer = -1;
        this.curPlay = -1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = true;
            }
        }
    },

    /**
     * 结束一局更新状态
     */
    updateEndRound : function () {
        this.playing = false;
        this.dealer = -1;
        this.curPlay = -1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = false;
                player.isCan = false;
                player.isForce = false;
                player.ready = false;
                player.isTrusting = false;
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