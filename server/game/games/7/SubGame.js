let util        = require("util");
let Room        = require("./Room.js").Room;
let ProtoID     = require("../../../net/CSProto.js").ProtoID;

function SubGame() {
    this.protoMap       = {};   // 协议表
    this.roomCnt        = 0;
    this.rooms          = {};
    this.init();
}

SubGame.prototype = {
    // 初始化
    init: function() {
        this.initProtoMap();
    },

    // 初始化协议表
    initProtoMap: function() {
        this.onProto(ProtoID.CLIENT_GAME_CUE_PDK, this.onPlayerCue);                    // 提示
        this.onProto(ProtoID.CLIENT_GAME_DO_PLAY_PDK, this.onPlayerReqPlay);            // 走牌
        this.onProto(ProtoID.CLIENT_GAME_DO_PASS_PDK, this.onPlayerReqPass);            // 过牌
        this.onProto(ProtoID.CLIENT_GAME_SELECT_CARDS_PDK, this.onPlayerSelectCardReq); // 选牌
        this.onProto(ProtoID.CLIENT_GAME_TG_PDK, this.onPlayerHosted);                  // 托管
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

    // 客户端请求提示
    onPlayerCue: function (wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request onPlayerCue", uid));
        wantRoom.onPlayerCue(uid);
    },

    //请求出牌
    onPlayerReqPlay: function (wsConn, rState, rArgs) {
        let roomId = rArgs.roomId;
        let uid = rArgs.uid;
        let cards = rArgs.cards;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        wantRoom.onPlayerReqPlay(uid, cards);
    },

    /**
     * 玩家过牌
     * @param wsConn
     * @param rState
     * @param rArgs
     * @returns {boolean}
     */
    onPlayerReqPass: function (wsConn, rState, rArgs) {
        let roomId = rArgs.roomId;
        let uid = rArgs.uid;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        wantRoom.onPlayerReqPass(uid);
    },

    /**
     * 选牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerSelectCardReq:function (wsConn, rState, rArgs) {
        let roomId = rArgs.roomId;
        let uid = rArgs.uid;
        let wantRoom = this.rooms[roomId];
        let cards = rArgs.cards;
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        wantRoom.selectCard(uid, cards);
    },

    /**
     * 请求托管
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerHosted:function (wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        let isT = JSON.parse(rArgs.isT);
        if(!wantRoom){
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        wantRoom.onPlayerHosted(uid,isT);
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
