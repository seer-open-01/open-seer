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
        this.onProto(ProtoID.CLIENT_GAME_SEE_CARD, this.onPlayerSeeCard);                                          // 看牌
        this.onProto(ProtoID.CLIENT_GAME_DO_PASS_PSZ, this.onPlayerReqPass);                                       // 弃牌
        this.onProto(ProtoID.CLIENT_GAME_ADD_STAKE, this.onPlayerAddStake);                                        // 加注
        this.onProto(ProtoID.CLIENT_GAME_FOLLOW_STAKE, this.onPlayerMeToStake);                                    // 跟注
        this.onProto(ProtoID.CLIENT_GAME_AUTO_FOLLOW_STAKE,this.onPlayerAutoFollowReq);                            // 自动跟注
        this.onProto(ProtoID.CLIENT_GAME_DO_CHECK, this.onPlayerCheck);                                            // 查牌
        this.onProto(ProtoID.CLIENT_GAME_CHECK_COMPLETE, this.onPlayerCheckComplete);                              // 查牌完成
    },

    onProto: function(opCode, handler) {
        this.protoMap[opCode] = handler;
    },
    /**
     * 创建房间
     * @param roomId
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
        ERROR("销毁了 房间: " + room.roomId);
        delete this.rooms[room.roomId];
        this.roomCnt -= 1;
        room = null;
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
     * 看牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerSeeCard:function (wsConn, rState, rArgs) {
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request see card", uid));
        wantRoom.doSee(uid);
    },
    /**
     * 弃牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqPass:function (wsConn, rState, rArgs) {
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request pass", uid));
        wantRoom.doPass(uid);
    },
    /**
     * 加注
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerAddStake:function (wsConn, rState, rArgs) {
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        let roundBet = +rArgs.roundBet;
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request addStake", uid));
        wantRoom.doStake(uid, roundBet, ProtoID.CLIENT_GAME_ADD_STAKE);
    },
    /**
     * 跟注
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerMeToStake:function (wsConn, rState, rArgs) {
        DEBUG(wsConn.getUid());
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        let roundBet = +rArgs.roundBet;
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request follow", uid));
        wantRoom.doStake(uid, roundBet, ProtoID.CLIENT_GAME_FOLLOW_STAKE);
    },
    /**
     * 请求自动跟注
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerAutoFollowReq:function (wsConn, rState, rArgs) {
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        let ok = rArgs.ok;
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request auto follow", uid));
        wantRoom.onPlayerAutoFollowReq(uid, ok);
    },
    /**
     * 查牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerCheck:function (wsConn, rState, rArgs) {
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        let target = +rArgs.index;
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request check", uid));
        wantRoom.doCheck(uid, target);
    },
    /**
     * 查牌完成
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerCheckComplete:function (wsConn, rState, rArgs) {
        let uid = rArgs.uid;
        let roomId = rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if(!wantRoom){
            ERROR(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request check complete", uid));
        let playerIndex = wantRoom.getPlayerIndex(uid);
        wantRoom.onPlayerCheckComplete(playerIndex);
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

exports = module.exports = new SubGame();
