let util            = require("util");
let Room            = require("./Room.js").Room;
let ProtoID         = require("../../../net/CSProto.js").ProtoID;

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
        this.onProto(ProtoID.GAME_CLIENT_GIVE_UP_XQ, this.onPlayerReqGiveUp);
        this.onProto(ProtoID.GAME_CLIENT_SELECT_CHESS_XQ, this.onPlayerSelectChess);
        this.onProto(ProtoID.GAME_CLIENT_MOVE_CHESS_XQ, this.onPlayerMoveChess);
        // this.onProto(ProtoID.GAME_CLIENT_REGRET_CHESS_XQ, this.onPlayerSelectType);
        this.onProto(ProtoID.GAME_CLIENT_CHANGE_BASE_BEAN_XQ, this.onPlayerReqChangeBaseBean);
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


    // 销毁房间
    destroyRoom: function(room) {
        delete this.rooms[room.id];
    },

    // 关闭
    shutdown: function() {
        for (let rId in this.rooms) {
            if (!this.rooms.hasOwnProperty(rId)) {
                continue;
            }
            this.rooms[rId].shutdown();
        }
    },
    // 客户端请求销毁房间
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
    // 客户端发起解散房间
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
    // 客户端发起投票解散房间
    client_game_vote_room:function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let agree = rArgs.isAgree;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request SelectDestroyRoom", uid));
        wantRoom.client_game_vote_room(uid, agree);
    },
    // 查找协议处理程序
    findProtoHandler: function(rCode) {
        return this.protoMap[rCode];
    },
    //----------------------------------------游戏服消息:start--------------------------------------------------------//
    // 玩家走棋
    onPlayerMoveChess: function(wsConn, rState, rArgs){
        let uid = wsConn.getUid();
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        let temp1 = wantRoom.transformXY(rArgs.x, rArgs.y);
        let x = temp1.x;
        let y = temp1.y;
        let temp2 = wantRoom.transformXY(rArgs.cx, rArgs.cy);
        let cx = temp2.x;
        let cy = temp2.y;
        let pos = wantRoom.getPos(x, y);
        let selectPos = wantRoom.getPos(cx, cy);
        wantRoom.selectAndMoveChess(uid, selectPos, pos, rArgs);
    },

    /**
     * 选择棋子
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerSelectChess: function(wsConn, rState, rArgs){
        let uid = wsConn.getUid();
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        let temp1 = wantRoom.transformXY(rArgs.x, rArgs.y);
        let x = temp1.x;
        let y = temp1.y;
        // let x = rArgs.x;
        // let y = rArgs.y;
        // let pos = wantRoom.getPos(x, y);
        let re = wantRoom.playerSelectChess(uid, x, y, rArgs);
        DEBUG(re)
    },


    /**
     * 投降
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqGiveUp: function(wsConn, rState, rArgs){
        let uid = wsConn.getUid();
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        let index = wantRoom.getPlayerIndex(uid);
        wantRoom.onPlayerGiveUp(index);
    },

     /**
     * 悔棋
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqRegret: function(wsConn, rState, rArgs){
        let uid = wsConn.getUid();
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        let x = rArgs.x;
        let y = rArgs.y;
        // let pos = wantRoom.getPos(x, y);
        wantRoom.retractChess();

    },

    /**
     * 修改底分
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqChangeBaseBean: function(wsConn, rState, rArgs){
        let uid = wsConn.getUid();
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        let num = rArgs.baseBean;
        wantRoom.onPlayerChangeBaseBean(uid, num);
    },

    //玩家请求播放开场动画
    onPlayerReqAnimationOver:function (wsConn,rState,rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request animation", uid));
        wantRoom.onPlayerReqAnimationOver(uid);
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
