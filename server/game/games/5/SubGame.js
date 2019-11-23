let util        = require("util");
let Room        = require("./Room.js").Room;
let ProtoID     = require("../../../net/CSProto.js").ProtoID;

function SubGame() {
    this.protoMap       = {};   // 协议表
    this.roomCnt        = 0;
    this.rooms          = {};
    this.robots         = {};   //机器人
    this.init();
}

SubGame.prototype = {
    // 初始化
    init: function() {
        this.initProtoMap();
    },

    // 初始化协议表
    initProtoMap: function() {
        this.onProto(ProtoID.CLIENT_GAME_ROB_PS, this.onPlayerRob);
        this.onProto(ProtoID.CLIENT_GAME_BET_PS, this.onPlayerBet);
        this.onProto(ProtoID.CLIENT_GAME_PLAY_PS, this.onPlayerPlay);
        this.onProto(ProtoID.CLIENT_GAME_INPUT_CHEAT, this.onCheat);
    },

    onProto: function(opCode, handler) {
        this.protoMap[opCode] = handler;
    },



    /**
     * 创建房间
     * @param cArgs
     * @returns {*}
     */
    createRoom: function(cArgs) {
        let newRoom = new Room(cArgs);
        if (newRoom.init(cArgs)) {
            this.roomCnt += 1;
            this.rooms[cArgs.roomId] = newRoom;
            return newRoom;
        }
        return null;
    },

    /**
     * 销毁房间
     * @param room
     */
    destroyRoom: function(room) {
        delete this.rooms[room.roomId];
    },

    /**
     * 关闭
     */
    shutdown: function() {
        for (let rId in this.rooms) {
            if (!this.rooms.hasOwnProperty(rId)) {
                continue;
            }
            this.rooms[rId].shutdown();
        }
    },
    /**
     * 查找协议处理程序
     * @param rCode
     * @returns {*}
     */
    findProtoHandler: function(rCode) {
        return this.protoMap[rCode];
    },
    //----------------------------------------游戏服消息:start--------------------------------------------------------//

    /**
     * 玩家抢庄
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerRob: function (wsConn, rState, rArgs) {
        let uid = wsConn.getUid();
        let roomId = rArgs.roomId;
        DEBUG(`uid = ${uid}`);
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request Continue", uid));
        let num = rArgs.rob;
        let index = wantRoom.getPlayerIndex(uid);
        wantRoom.onPlayerRob(index, num)
    },
    /**
     * 玩家下注
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerBet: function (wsConn, rState, rArgs) {
        let uid = wsConn.getUid();
        let roomId = rArgs.roomId;
        DEBUG(`uid = ${uid}`);
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request Continue", uid));
        let num = rArgs.bet;
        let index = wantRoom.getPlayerIndex(uid);
        wantRoom.onPlayerBet(index, num)
    },

    /**
     * 玩家亮牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerPlay: function (wsConn, rState, rArgs) {
        let uid = wsConn.getUid();
        let roomId = rArgs.roomId;
        DEBUG(`uid = ${uid}`);
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request Continue", uid));
        let index = wantRoom.getPlayerIndex(uid);
        wantRoom.onPlayerPlay(index)
    },

    /**
     * 测试代码
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onCheat: function (wsConn, rState, rArgs) {
        let uid = wsConn.getUid();
        let roomId = rArgs.roomId;
        DEBUG(`uid = ${uid}`);
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request Continue", uid));
        wantRoom.cheat(rArgs)
    },
    /**
     * 白盒测试用
     * @param room
     */
    startRoom(room){
        let count = Object.keys(this.rooms).length;
        ERROR("正在进行的总局数" + count);
    },
    /**
     * 白盒测试用
     * @param room
     */
    endRoom(room){
        let count = Object.keys(this.rooms).length;
        ERROR("剩余总局数" + count);
    },
};

module.exports = new SubGame();
