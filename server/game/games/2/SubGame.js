let util    = require("util");
let Room    = require("./Room.js").Room;
let ProtoID = require("../../../net/CSProto.js").ProtoID;
let CommFuc     = require("../../../util/CommonFuc.js");
///////////////////////////////////////////////////////////////////////////////
//>> 斗地主

function SubGame() {
    this.protoMap = {};     // 协议表

    this.roomCnt = 0;
    this.rooms = {};

    this.init();
}

SubGame.prototype = {

    // 初始化
    init: function () {
        this.initProtoMap();
    },

    // 初始化协议表
    initProtoMap: function () {
        this.onProto(ProtoID.CLIENT_GAME_GRAB, this.onPlayerReqGrab);
        this.onProto(ProtoID.CLIENT_GAME_CUE, this.onPlayerCue);
        this.onProto(ProtoID.CLIENT_GAME_DO_PLAY_DDZ, this.onPlayerReqPlay);
        this.onProto(ProtoID.CLIENT_GAME_DO_PASS_DDZ, this.onPlayerReqPass);
        this.onProto(ProtoID.CLIENT_GAME_SELECT_CARDS, this.onPlayerSelectCardReq);
        this.onProto(ProtoID.CLIENT_GAME_TG_DDZ, this.onPlayerHosted);
        this.onProto(ProtoID.CLIENT_GAME_DOUBLE_DDZ, this.onPlayerDouble);
    },
    onProto: function (opCode, handler) {
        this.protoMap[opCode] = handler;
    },
    /**
     * 创建房间
     * @param cArgs
     * @returns {*}
     */
    createRoom: function (cArgs) {
        let newRoom = new Room(cArgs);
        if (newRoom.init(cArgs)) {
            this.roomCnt += 1;
            this.rooms[cArgs.roomId] = newRoom;
            return newRoom;
        }
        return null;
    },
    // 销毁房间
    destroyRoom: function (room) {
        ERROR("销毁了 房间: " + room.roomId);
        delete this.rooms[room.roomId];
        this.roomCnt -= 1;
        room = null;
    },

    // 关闭
    shutdown: function () {
        for (let rId in this.rooms) {
            if (!this.rooms.hasOwnProperty(rId)) {
                continue;
            }
            this.rooms[rId].shutdown();
        }
    },

    /**
     * 请求销毁房间
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    client_game_destory_room:function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request DestroyRoom", uid));
        wantRoom.client_game_destory_room(uid);
    },
    /**
     * 发起解散房间
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    client_game_launch_restory_room:function (wsConn,rState,rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request DestroyRoom", uid));
        wantRoom.client_game_launch_restory_room(uid);
    },
    /**
     * 发起投票解散房间
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    client_game_vote_room:function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let agree = rArgs.ok;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request SelectDestroyRoom", uid));
        wantRoom.onPlayerJSRoom(uid, agree);
    },

    // 查找协议处理程序
    findProtoHandler: function (rCode) {
        return this.protoMap[rCode];
    },

    //游戏逻辑部分-------------------------------------------------------------------------------
    //抢地主
    onPlayerReqGrab: function (wsConn, rState, rArgs) {
        let roomId = +rArgs.roomId;
        let uid = +rArgs.uid;
        let ok = rArgs.ok;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        let playerIndex = wantRoom.getPlayerIndex(uid);
        wantRoom.startGrab(playerIndex, ok);
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
    //玩家出牌
    onPlayerDoPlay: function (wsConn, rState, rArgs) {
        let roomId = rArgs.roomId;
        let uid = rArgs.uid;
        let doShape = {isBomb: rArgs.isBomb, finaType: rArgs.finaType, cards: rArgs.cards, conCard: rArgs.conCard}
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        wantRoom.onPlayerDoPlay(uid, doShape);
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
    //房主申请解散房间
    onPlayerFZDestroyRoom: function (wsConn, rState, rArgs) {
        let roomId = rArgs.roomId;
        let uid = rArgs.uid;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        wantRoom.client_game_destory_room(uid);
    },
    //非房主申请解散房间
    onPlayerWJDestroyRoom: function (wsConn, rState, rArgs) {
        let roomId = rArgs.roomId;
        let uid = rArgs.uid;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return false;
        }
        wantRoom.client_game_launch_restory_room(uid);
    },
    //客户端选择解散房间
    onPlayerDestoryYesNo: function (wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let agree = JSON.parse(rArgs.agree);
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request SelectDestroyRoom", uid));
        wantRoom.onPlayerJSRoom(uid, agree);
    },
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
    /**
     * 请求加倍
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerDouble:function (wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let double = +rArgs.double;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request double", uid));
        let index = wantRoom.getPlayerIndex(uid);
        wantRoom.onPlayerDouble(index, double);
    },
    //聊天
    onPlayerReqSay: function (wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        wantRoom.onPlayerReqSay(uid, rArgs);
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
}


exports = module.exports = new SubGame();
