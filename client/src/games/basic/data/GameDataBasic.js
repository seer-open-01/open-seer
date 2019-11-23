/**
 * Created by Jiyou Mo on 2017/10/16.
 */
// 游戏数据基础类
game.GameDataBasic = cc.Class.extend({

    // === 属性 ============================================================
    roomId          : 0,        // 房间号
    round           : 0,        // 局数
    roundId         : 0,        // 牌局号
    turns           : 0,        // 轮数
    gameType        : 0,        // 游戏类型
    subType         : 0,        // 游戏子类型
    curRound        : 0,        // 当前局数
    curTurns        : 0,        // 当前轮数
    options         : {},       // 选项
    playing         : false,    // 是否正在游戏
    playerIndex     : 0,        // 本玩家索引;
    players         : {},       // 玩家数据
    destroyInfo     : null,     // 解散房间信息
    reconnect       : false,    // 是否重连
    creator         : 0,        // 房间创建者的uid
    matchId         : -1,       // 匹配场标识
    actionTimer     : null,     // 房间的定时器对象
    voiceStatus     : 2,        // 是否开启了语音    1表示开 2表示关

    // === 函数 ==============================================================
    ctor : function () {
        return true;
    },

    /**
     * 重置数据(需要重写，子类必须调用父类的本函数)
     * @private
     */
    _reset : function() {
        this.roomId = 0;
        this.round = 0;
        this.roundId = 0;
        this.turns = 0;
        this.gameType = 0;
        this.subType = 0;
        this.curRound = 0;
        this.curTurns = 0;
        this.options = {};
        this.playing = false;
        this.playerIndex = 0;
        this.players = {};
        this.reconnect = false;
        this.destroyInfo = null;
        this.creator = 0;
        this.matchId = -1;
        this.actionTimer = null;
        this.voiceStatus = 1;
    },

    reset : function () {
        this._reset();
    },

    /**
     * 解析加入房间信息 (子类重写)
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
        this.destroyInfo = null;                        // 销毁房间信息
        this.matchId = roomInfo.matchId;                // 匹配场标识
        this.actionTimer = roomInfo.actionTimer;        // 定时器
        this.voiceStatus = roomInfo.voiceStatus || 1;   // 房间的状态
        this.sceneMode = roomInfo.sceneMode;            // "FK" "JB" 区分房卡场和金币场

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
                this.players[index].destroyState = player.destroyState;
                this.players[index].matchIng = players.matchIng;

            }
        }

        // 玩家信息
        this.playerIndex = +json.playerIndex;
    },

    /**
     * 解析有人加入房间消息
     * @param json
     */
    parseNewPlayerEnterRoom : function(json) {
        var index = +json.playerIndex;
        var player = json.playerInfo;
        this.players[index] = {};
        this.players[index].uid = +player.uid;
        this.players[index].name = player.name;
        this.players[index].sex = +player.sex;
        this.players[index].headPic = player.headPic;
        this.players[index].online = player.online;
        this.players[index].ready = player.ready;
        this.players[index].ip = player.ip;
        this.players[index].index = index;
        this.players[index].score = player.score || 0;
        this.players[index].bean = player.bean || 0;
        this.players[index].card = player.card || 0;
        this.players[index].diamond = player.diamond || 0;
        this.players[index].playing = player.playing;
        this.players[index].gps = player.gps;
        this.players[index].matchIng = player.matchIng;
        this.players[index].actionTimer = player.actionTimer;
        this.players[index].destroyState = player.destroyState;

        return index;
    },

    /**
     * 获取游戏最大人数 (必须重写)
     * @returns {number}
     */
    getPlayerNum : function() {
        return 0;
    },

    /**
     * 获取本玩家
     * @returns {*}
     */
    getMainPlayer : function() {
        return this.players[this.playerIndex];
    },

    /**
     * 获取所有玩家索引
     * @returns {Array}
     */
    getAllPlayerIndex : function () {
        var indexArray = [];
        for (var key in this.players) {
            if (this.players.hasOwnProperty(key)) {
                if (this.players[key].index) {
                    indexArray.push(this.players[key].index)
                }
            }
        }

        indexArray.sort(function (a, b) { return a - b; });

        return indexArray;
    },

    /**
     * 通过UID获取index
     * @param uid
     */
    getIndexByUid: function (uid) {
        for (var key in this.players) {
            if (this.players.hasOwnProperty(key)) {
                if (this.players[key].uid == uid) {
                    return this.players[key].index;
                }
            }
        }

        return -1;
    },

    /**
     * 开始新的一局更新状态(如果更新的数据不同就重写)
     */
    updateStartNewRound : function() {
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = true;
            }
        }
    },

    /**
     * 结束一局更新状态(如果更新的数据不同就重写)
     */
    updateEndRound : function () {
        this.playing = false;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = false;
                player.ready = false;
            }
        }
    }
});
