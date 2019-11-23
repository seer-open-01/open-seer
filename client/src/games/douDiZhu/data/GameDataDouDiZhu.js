/**
 * Created by Jiyou Mo on 2017/10/16.
 */
// 斗地主游戏数据
var GameDataDouDiZhu = game.GameDataBasic.extend({

    dealer              : -1,               // 地主
    diZhuCards          : [],               // 三张地主牌
    roundStatus         : 0,                // 游戏状态
    curPlay             : -1,               // 当前出牌的玩家下标
    actionTimer         : null,             // 倒计时
    isBomb              : false,            // 是否用过炸弹 用于背景音乐判断
    multiple            : 0,                // 房间倍数
    robType             : 1,                // 抢地主还是叫地主 1 叫地主 2 抢地主


    // == 函    数 ===========================
    ctor : function () {
        this._super();
        return true;
    },

    reset : function () {
        this._reset();
    },
    /**
     * 重置数据
     */
    _reset : function() {
        this._super();

        this.dealer = -1;
        this.diZhuCards = [];
        this.actionTimer = null;
        this.multiple = 0;
        this.isBomb = false;
        this.robType = 1;
    },

    /**
     * 解析重连数据
     * @param json
     */
    parseRoomEnter : function(json) {
        // cc.log("==> 解析 斗地主 重新加入房间数据：" + JSON.stringify(json));
        this._reset();
        // 房间信息
        var roomInfo = json.roomInfo;
        this.roomId = roomInfo.roomId;
        this.roundId = roomInfo.roundId || 0;
        this.round = +roomInfo.round;
        this.curRound = roomInfo.curRound;
        this.baseScore = roomInfo.baseScore || 1;
        this.baseBean = roomInfo.baseBean;
        this.enterBean = roomInfo.enterBean;
        this.playing = roomInfo.playing;
        this.dealer = roomInfo.lordIndex;
        this.creator = roomInfo.creator;                    // 房间创建者的uid
        this.destroyInfo = roomInfo.destroyInfo;            // 解散房间信息
        this.matchId = roomInfo.matchId;                    // 匹配场标识
        this.options = roomInfo.options;                    // 匹配场配置
        this.voiceStatus = roomInfo.voiceStatus || 1;       // 房间的状态
        this.matchName = roomInfo.matchName;
        // -- 重连部分房间信息 --------------------------
        this.roundStatus = roomInfo.roundStatus;     // 当前游戏进度状态
        this.diZhuCards = roomInfo.bCards;          // 地主的三张牌
        this.curPlay = roomInfo.curPlayIndex;       // 当前应该出牌的玩家
        this.actionTimer = roomInfo.actionTimer;    // 倒计时
        this.isBomb = roomInfo.isBomb;
        this.multiple = roomInfo.roomBet || 0;
        this.robType = roomInfo.robType;
        this.subType = roomInfo.subType;
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
                this.players[index].playStatus = player.playStatus;         // 抢地主状态 -1 没有操作 1叫2不叫3抢4不抢
                this.players[index].isCan = player.isCan;                   // 玩家是否可以出牌
                this.players[index].isForce = player.isForce;               // 玩家是否被强制出牌
                this.players[index].isTrusting = player.isT;                // 玩家是否在托管状态
                this.players[index].actionTimer = player.actionTimer;
                this.players[index].doubleFlag = player.doubleFlag;         // 加倍状态， -1没有操作 0选择了不加倍，1选择了加倍

                this.players[index].destroyState = player.destroyState;

            }
        }

        // 本玩家
        this.playerIndex = json.playerIndex;
    },

    /**
     * 获取人数
     * @returns {number}
     */
    getPlayerNum : function() {
        return 3;
    },

    /**
     * 开始新的一局更新状态
     */
    updateStartNewRound : function() {
        this.playing = true;
        this.diZhuCards = [];
        this.isBomb = false;
        this.dealer = -1;
        this.curPlay = -1;
        this.multiple = 0;
        this.robType = 1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = true;
                // player.playStatus = -1;
                // player.isCan = false;
                // player.isForce = false;
                // player.isTrusting = false;
            }
        }
    },

    /**
     * 结束一局更新状态
     */
    updateEndRound : function () {
        this.playing = false;
        this.diZhuCards = [];
        this.isBomb = false;
        this.dealer = -1;
        this.curPlay = -1;
        this.multiple = 0;
        this.robType = 1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = false;
                player.playStatus = -1;
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