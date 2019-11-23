let util            = require("util");
let ProtoID         = require("../net/CSProto.js").ProtoID;
let ProtoState      = require("../net/CSProto.js").ProtoState;

///////////////////////////////////////////////////////////////////////////////
//>> 与中央服务器通信逻辑

/**
 * 服务器注册响应
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_RegServ = function(wsConn, rState, reqArgs){
    if (rState == ProtoState.STATE_OK) {
        GameMgr.setSid(+reqArgs.sid);
        GameMgr.setMiddleOk(true);
        LOG("Register server ok");
        Log.userListReq();
    } else {
        ERROR("Register server failed");
        setTimeout(function(){
            GameMgr.tryRegServ();
        }, 5000);                      //等待5秒在册重新注册
    }
};

/**
 * 服务器响应取消注册
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_UnregServ = function(wsConn, rState, reqArgs){
    if (rState == ProtoState.STATE_OK) {
        LOG("Unregister server ok");
    }
};

/**
 * 中央服创建房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_create_Room = function (wsConn, rState, reqArgs) {
    let gameType = reqArgs.gameType;
    let SubGameLogic = GameMgr.getSubGame(gameType);
    let newRoom = SubGameLogic.createRoom(reqArgs);
    if (newRoom) {
        wsConn.sendMsg({
            code    : ProtoID.GAME_MIDDLE_CREATE_ROOM,
            result  : ProtoState.STATE_OK,
            args    : reqArgs
        });
    }
    /**下面是测试机器人建立房间,修复已知bug**/
    /*
    let data = clone(reqArgs);
    for(let roomId = 1; roomId < 0; roomId++){
        data.roomId = roomId;
        data.test = true;
        data.uid = roomId + 100;
        data.opts.isRobot = true;
        SubGameLogic.createRoom(data);
    }
    */

};
/**
 * 玩家断线
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_playerDX = function(wsConn, rState, reqArgs) {
    let uid = reqArgs.dxUid;
    let roomId = reqArgs.roomId;
    let gameType = reqArgs.gameType;
    let SubGameLogic = GameMgr.getSubGame(gameType);
    SubGameLogic.playerDX(uid,roomId);
};
/**
 * 从中央服发送过来的玩家数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_player_room_data = function (wsConn, rState, reqArgs) {
    let success = GameMgr.addPlayerAndRoomInfo(reqArgs);
    let gameType = reqArgs.pData.gameType;
    let subGame = GameMgr.getSubGame(gameType);
    let room = subGame.rooms[reqArgs.pData.roomId];
    if(!room){
        GameMgr.forceDestroyRoom(reqArgs.pData.roomId);
    }
    if(success && room){
        let playerIndex = room.getPlayerIndex(reqArgs.pData.uid);
        wsConn.sendMsg({
            code    : ProtoID.GAME_MIDDLE_PLAYER_DATA,
            result  : ProtoState.STATE_OK,
            args    :{
                sUid : reqArgs.pData.uid,
                roomId:reqArgs.pData.roomId,
                isChangeRoom:reqArgs.isChangeRoom,
                enterBean:room.enterBean,
                playerIndex:playerIndex
            }
        });
    }
};
/**
 * 初始化推广员数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_user_list_resp = function (wsConn, rState, reqArgs) {
    let data = reqArgs.data;
    Log.userListResp(data);
};
/**
 * 更新玩家列表
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_user_list_update = function (wsConn, rState, reqArgs) {
     let data = reqArgs.data;
     Log.userListUpdate(data);
};

/**
 * 更新玩家log信息
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.onPlayerExtendChange = function (wsConn, rState, reqArgs) {
    let data = reqArgs.data;
    Log.userChange(data);
}

/**
 * 更新房间玩家资源
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_update_user_status = function (wsConn, rState, reqArgs) {
    let gameType = reqArgs.gameType;
    let uid = reqArgs.uid;
    let roomId = reqArgs.roomId;
    //更新数据
    GameMgr.playInfo[uid].status = reqArgs.status;
    let SubGameLogic = GameMgr.getSubGame(gameType);
    if(SubGameLogic){
        updatePlayerStatus(SubGameLogic,wsConn, rState, reqArgs);
    }
};

/**
 * 更新资源
 */
function updatePlayerStatus(SubGameLogic,wsConn, rState, reqArgs){
    let roomId = reqArgs.roomId;
    let wantRoom = SubGameLogic.rooms[roomId];
    if (!wantRoom) {
        ERROR(`Room ${roomId} not exists`);
        return;
    }
    wantRoom.updatePlayerStatus(reqArgs)
}

/**
 * 请求房卡场列表
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.middle_game_req_FK_list = function (wsConn, rState, reqArgs) {
    let gameType = reqArgs.gameType;
    let SubGameLogic = GameMgr.getSubGame(gameType);
    let rooms = SubGameLogic.rooms;
    let list = reqFKList(rooms);
    wsConn.sendMsg({code:ProtoID.GAME_MIDDLE_RESP_FK_LIST, args:{list, uid:reqArgs.uid}})
};

/**
 * 请求房卡列表
 */
function reqFKList(rooms){
    let list = [];
    for(let roomId in rooms){
        let room = rooms[roomId];
        let data = {};
        if(room.mode === "FK") {
            data.baseBean = room.baseBean;
            data.opts = room.opts;
            data.roomId = room.roomId;
            data.curNum = getCurNum(room);
            data.maxNum = room.getMaxPlayerNum();
            data.enterBean = room.enterBean;
            data.maxBean = room.maxBean;
            data.gameType = room.gameType;
            data.subType = room.subType;
            data.isPub = room.isPub;
            list.push(data);
        }
    }
    return list;
}

function getCurNum(room) {
    return room.getPlayerNum();
}
