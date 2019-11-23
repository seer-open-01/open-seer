/**
 * Created by Jiyou Mo on 2017/10/16.
 */
// 拼十游戏数据
var GameDataPinShi = game.GameDataBasic.extend({

    // == 游戏属性 ============================
    dealer              : -1,               // 庄
    curPlayer           : -1,               // 当前操作的玩家座位索引
    actionTimer         : null,             // 倒计时
    roundStatus         : null,                // 游戏局进行的阶段状态


    // == 函    数 ===========================
    ctor : function () {
        this._super();
        return true;
    },

    /**
     * 重置数据
     */
    _reset : function() {
        this._super();

        this.dealer = -1;
        this.curPlayer = -1;
        this.actionTimer = null;
        this.roundStatus = null;
    },
    /**
     * 解析进入房间数据
     * @param json
     */
    parseRoomEnter : function(json){
        cc.log("==> 解析 拼十 加入房间数据：" + JSON.stringify(json));
        this._reset();
        this.reconnect = json.reconnect;

        // 房间信息
        var roomInfo = json.roomInfo;
        this.roomId = roomInfo.roomId;
        game.DataKernel.roomId = roomInfo.roomId;
        this.scene = roomInfo.scene;
        this.round = roomInfo.round;
        this.roundId = roomInfo.roundId || 0;
        this.curRound = roomInfo.curRound;
        this.turns = roomInfo.turns;
        this.curTurns = roomInfo.curTurns;
        this.options = roomInfo.options;
        this.sceneOptions = roomInfo.sceneOptions;
        this.playing = roomInfo.playing;
        this.creator = roomInfo.creator;                // 房间创建者的uid
        this.destroyInfo = roomInfo.destroyInfo;        // 解散房间信息
        this.matchId = roomInfo.matchId;                // 匹配场标识
        this.matchName = roomInfo.matchName;            // 匹配场名称代号
        this.matchModeName = roomInfo.matchModeName;    // 匹配场模式名称代号
        this.voiceStatus = roomInfo.voiceStatus || 1;        // 房间的状态
        this.rewardPattern = roomInfo.rewardPattern || {};    // 奖池获奖牌型数据
        this.gameType = roomInfo.gameType;
        this.subType = roomInfo.subType;
        this.sceneMode = roomInfo.sceneMode;            // "FK" "JB" 区分房卡场和金币场

        // ==== 重连数据相 ===================================================================
        this.dealer = roomInfo.dealerIndex || -1;             // 庄索引
        this.curPlayer = roomInfo.curPlay || -1;        // 当前操作的玩家
        this.actionTimer = roomInfo.actionTimer;        // 倒计时情况
        this.roundStatus = roomInfo.roundStatus;        // 游戏进行的状态
        this.baseBean = roomInfo.baseBean;
        this.enterBean = roomInfo.enterBean;
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
                this.players[index].score = player.score;
                this.players[index].bean = player.bean;
                this.players[index].card = player.card;
                this.players[index].diamond = player.diamond || 0;
                this.players[index].playing = player.playing;
                this.players[index].gps = player.gps;
                this.players[index].actionTimer = player.actionTimer;
                this.players[index].matchIng = player.matchIng;
                this.voiceStatus = roomInfo.voiceStatus || 1;        // 房间的状态
                // ==== 玩家游戏相关属性 ===================================================================
                this.players[index].rob = player.rob || 0;                              // 抢庄倍数
                this.players[index].maxRob = player.maxRob || 0;                           // 最大抢庄倍数
                this.players[index].ante = player.bet || 0;                                          // 下注
                this.players[index].maxAnte = player.maxBet;                                         // 下注
                this.players[index].pattern = player.type;                              // 当前牌型
                this.players[index].patternMultiple = player.roundPatternBS || 0;               // 当前牌型
                this.players[index].handCards = player.handCards || [];                         // 玩家手牌
                this.players[index].isShowCard = player.play;                                   // 玩家有没有亮牌
            }
        }

        // 玩家信息
        this.playerIndex = json.playerIndex;
    },
    /**
     * 获取人数
     * @returns {number}
     */
    getPlayerNum : function() {
        return 6;
    },
    // 获取游戏房间号
    getRoomId: function () {
        return this.roomId;
    },
    getPlayerChairID : function(index){
        var diff = index - this.playerIndex;
        if (diff < 0) {
            diff += this.getPlayerNum();
        }
        return diff;
    },
    /**
     * 开始新的一局更新状态
     */
    updateStartNewRound : function() {
        this.playing = true;
        this.curPlayer = -1;
        this.dealer = -1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = true;
                player.maxRob = 0;                   // 玩家最大抢庄倍数
                player.rob = 0;                      // 玩家抢庄倍数
                player.maxAnte = 0;                  // 玩家最大下注数量
                player.ante = 0;                     // 玩家出过的金贝数量
                player.handCards = [];               // 玩家手牌数组
            }
        }
    },

    /**
     * 结束一局更新状态
     */
    updateEndRound : function () {
        this.playing = false;
        this.curPlayer = -1;
        this.dealer = -1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = false;
                player.ready = false;
                player.maxRob = 0;                   // 玩家最大抢庄倍数
                player.rob = 0;                      // 玩家抢庄倍数
                player.maxAnte = 0;                  // 玩家最大下注数量
                player.ante = 0;                     // 玩家出过的金贝数量
                player.handCards = [];               // 玩家手牌数组
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
     * 检测除了房主之外是否有人准备
     * @returns {boolean}
     */
    checkReady: function () {
        if (Object.keys(this.players).length < 2) {
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