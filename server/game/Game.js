let ProtoID         = require("../net/CSProto.js").ProtoID;
let ProtoState      = require("../net/CSProto.js").ProtoState;

///////////////////////////////////////////////////////////////////////////////
//>> 游戏相关逻辑
/**
 * 客户端请求加入房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_join_room = function(wsConn, rState, reqArgs) {
    let roomId = +reqArgs.roomId;       // 房间号
    let uid = +reqArgs.uid;
    wsConn.setUid(uid);
    wsConn.setRoomId(roomId);
    WssServer.removeConn(uid, wsConn.id);
    // WssServer.removeNoEffectConn();
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    let success = false;
    if(SubGameLogic){
        success = joinRoom(SubGameLogic,reqArgs,wsConn);
    }
    if (!success) {
        GameMgr.sendMgrMsg({
            code    : ProtoID.GAME_MIDDLE_JOINED_ROOM,
            result  : ProtoState.STATE_GAME_JOIN_ROOM_FAILED,
            args:{
                joinUid : reqArgs.uid
            }
        });
        wsConn.sendMsg({code:ProtoID.CLIENT_GAME_JOIN_ROOM,args:{result:ProtoState.STATE_ROOM_ERROR}});
    } else {
        GameMgr.sendMgrMsg({
            code    : ProtoID.GAME_MIDDLE_JOINED_ROOM,
            result  : ProtoState.STATE_OK,
            args    : {
                joinUid  : reqArgs.uid,
                roomId   : roomId,
                gameType : gameType
            }
        });
    }
};

function joinRoom(SubGameLogic, reqArgs,wsConn){
    let roomId = reqArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        DEBUG(`${roomId} %d not exists`);
        wsConn.sendMsg({code:ProtoID.CLIENT_GAME_LEAVE_ROOM});
        GameMgr.forceDestroyRoom(roomId);
        return false;
    }
    return wantRoom.addPlayer(reqArgs, wsConn);
}

/**
 * 准备消息
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_ready = function (wsConn,rState,reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        gameReady(SubGameLogic, reqArgs);
    }
}

function gameReady(SubGameLogic, reqArgs) {
    let uid = +reqArgs.uid;
    let roomId = +reqArgs.roomId;
    let ready = reqArgs.ready;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        ERROR(`${roomId} not exists`);
        return;
    }
    wantRoom.onPlayerReqContinue(uid, ready);
}


/**
 * 客户端请求解散房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_destory_room = function (wsConn,rState,reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    SubGameLogic.client_game_destory_room(wsConn,rState,reqArgs);
}
/**
 * 客户端发起解散房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_launch_restory_room = function (wsConn,rState,reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    SubGameLogic.client_game_launch_restory_room(wsConn,rState,reqArgs);
}
/**
 * 客户端投票解散房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_vote_room = function (wsConn,rState,reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    SubGameLogic.client_game_vote_room(wsConn,rState,reqArgs);
};
/**
 * 请求踢人
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @constructor
 */
exports.ReqKick = function(wsConn, rState, reqArgs){
    let uid = +reqArgs.uid;
    let target = +reqArgs.target || 100002;
    let gameType = GameMgr.getPlayerGameType(uid);
    if(gameType === 0) return;
    let SubGameLogic = GameMgr.getSubGame(gameType);
    let room = SubGameLogic.rooms[reqArgs.roomId];
    GameMgr.kickPlayer(room,uid,target);
}
/**
 * 取消匹配
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_cancel_match = function (wsConn, rState, reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        cancelMatch(wsConn, reqArgs,SubGameLogic);
    }
};

function cancelMatch(wsConn, reqArgs,SubGameLogic) {
    let uid = reqArgs.uid;
    let roomId = reqArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        ERROR(`${roomId} not exists`);
        wsConn.sendMsg({code:ProtoID.CLIENT_GAME_LEAVE_ROOM});
        GameMgr.forceDestroyRoom(roomId);
        return false;
    }else {
        let flag = wantRoom.cancelMatch(uid);
        if (flag === -1) {
            wsConn.sendMsg({code: ProtoID.CLIENT_GAME_LEAVE_ROOM});
            GameMgr.forceDestroyRoom(roomId);
            return false;
        }
    }
}
/**
 * 换桌
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_change_room = function (wsConn, rState, reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        changeRoom(SubGameLogic, reqArgs);
    }
};

function changeRoom(SubGameLogic,reqArgs,wsConn){
    let uid = reqArgs.uid;
    let roomId = reqArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        ERROR(`${roomId}Room %d not exists`);
        wsConn.sendMsg({code:ProtoID.CLIENT_GAME_LEAVE_ROOM});
        GameMgr.forceDestroyRoom(roomId);
        return false;
    }else {
        let now = Date.getStamp();
        if(wantRoom.curChangeTime && now - wantRoom.curChangeTime < 1){
            cancelMatch(wsConn,reqArgs,SubGameLogic);
            return false;
        }
        wantRoom.curChangeTime = now;
        wantRoom.changeRoom(uid);
    }
}
/**
 * 玩家聊天请求
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_chat = function (wsConn, rState, reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        onPlayerChatReq(SubGameLogic, wsConn, reqArgs);
    }
}

function onPlayerChatReq(SubGameLogic, wsConn, reqArgs){
    let uid = +reqArgs.uid;
    let roomId = +reqArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if(!wantRoom){
        ERROR(`${roomId} not exists`);
        return;
    }
    wantRoom.onPlayerChatReq(uid,reqArgs);
}
/**
 * 请求互动表情
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_gift = function (wsConn, rState, reqArgs){
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        onPlayerGiftReq(SubGameLogic, wsConn, reqArgs);
    }
}

function onPlayerGiftReq (SubGameLogic, wsConn, rArgs) {
    let uid = +rArgs.uid;
    let roomId = +rArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if(!wantRoom){
        DEBUG(`${roomId} not exists`);
        return;
    }
    wantRoom.onPlayerGiftReq(uid,rArgs);
}

/**
 * 客户端请求丫丫语音
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_game_yaya = function (wsConn, rState, reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        client_game_yaya(SubGameLogic,wsConn,reqArgs);
    }
}

function client_game_yaya(SubGameLogic,wsConn,rArgs) {
    let uid = +rArgs.uid;
    let roomId = +rArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        ERROR(`${roomId} not exists`);
        return;
    }
    wantRoom.client_game_yaya(uid,rArgs);
}

/**
 * 游戏结束
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.gameEnd = function (wsConn, rState, reqArgs) {
    let uid = +reqArgs.uid;
    let gameType = GameMgr.getPlayerGameType(uid);
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        gameEnd(SubGameLogic,wsConn, rState, reqArgs);
    }
}

function gameEnd(SubGameLogic,wsConn,rState,reqArgs){
    let uid = reqArgs.uid;
    let roomId = reqArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        ERROR(`Room ${roomId} not exists`);
        return;
    }
    wantRoom.gameEnd(uid);
}
