/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋数据
 */

var DataChess = game.GameDataBasic.extend({

    curPlayer           : -1,         // 当前玩家
    dealer              : -1,         // 庄家
    baseBean            : 0,          // 底分
    chessMap            : [],         // 重连棋子数据

    ctor: function () {
        this._super();
        return true;
    },

    _reset: function () {
        this._super();

        this.dealer = -1;
        this.curPlayer = -1;
    },
    /**
     * 解析进入房间数据
     * @param json
     */
    parseRoomEnter: function (json) {
        cc.log("==> 解析 象棋 加入房间数据：" + JSON.stringify(json));
        this._reset();
        this.reconnect = json.reconnect;
        var roomInfo = json["roomInfo"];
        this.roomId = roomInfo.roomId;
        game.DataKernel.roomId = roomInfo.roomId;
        this.round = roomInfo.round;
        this.roundId = roomInfo.roundId || 0;
        this.curRound = roomInfo.curRound;
        this.options = roomInfo.options;
        this.playing = roomInfo.playing;
        this.creator = roomInfo.creator;                // 房间创建者的uid
        this.matchId = roomInfo.matchId;                // 匹配场标识
        this.voiceStatus = roomInfo.voiceStatus || 1;   // 房间的状态
        this.gameType = roomInfo.gameType;

        this.curPlayer = roomInfo.curPlay || -1;        // 当前操作的玩家
        this.chessMap = roomInfo.chesses;               // 棋盘布局
        this.baseBean = roomInfo.baseBean || 0;
        this.sceneMode = roomInfo.sceneMode;            // "FK" "JB" 区分房卡场和金币场

        // 游戏玩家
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
                this.players[index].playing = player.playing;
                this.players[index].gps = player.gps;
                this.players[index].actionTimer = player.actionTimer;
            }
        }
        // 本玩家索引
        this.playerIndex = json.playerIndex;
    },
    /**
     * 获取游戏人数
     * @returns {number}
     */
    getPlayerNum: function () {
        return 2;
    },
    /**
     * 更新新一局游戏数据
     */
    updateStartNewRound: function () {
        this.playing = true;
        this.curPlayer = -1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = true;
            }
        }
    },
    /**
     * 更新结束游戏数据
     */
    updateEndRound: function () {
        this.playing = false;
        this.curPlayer = -1;
        for (var index in this.players) {
            if (this.players.hasOwnProperty(index)) {
                var player = this.players[index];
                player.playing = false;
                player.ready = false;
            }
        }
    },
    /**
     * 是不是房主
     * @returns {boolean}
     */
    isCreator: function () {
        return this.playerIndex == 1;
    },
    /**
     * 判断对方玩家是否进行准备
     * 只能房主玩家使用的接口！！！！
     */
    otherIsReady : function () {
        if (this.players[2]) {
            return this.players[2].ready;
        }
    },
    /**
     * 判断房间里有几个玩家
     */
    isOne: function () {
        return Object.keys(this.players).length <= 1;
    }
});