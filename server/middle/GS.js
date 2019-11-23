let util            = require("util");
let ProtoID         = require("../net/CSProto.js").ProtoID;
let ProtoState      = require("../net/CSProto.js").ProtoState;
let HttpReq         = require("../HttpRequest.js");
let BSProto         = require("../net/BSProto.js");
let eveIdType       = require("../net/CSProto.js").eveIdType;
let GameLogic       = require("./Game.js");

///////////////////////////////////////////////////////////////////////////////
//>> 游戏服务器处理逻辑
/**
 * 注册服务器
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_register = function(wsConn, rState, reqArgs){
    let servIp = reqArgs.ip;                            // 服务器地址
    let servPort = reqArgs.port;                        // 服务器端口
    let gameType = +reqArgs.gameType;                   // 服务器支持的游戏类型
    let servCapacity = +reqArgs.capacity;               // 服务器容量
    let sid = +reqArgs.sid;                             // 服务器编号
    wsConn.sid = sid;                                   // 是否为服务器

    let newServ = GSMgr.addServ(sid, servIp, servPort, gameType, servCapacity, wsConn);
    // 发送响应
    wsConn.sendMsg({
        code    : ProtoID.MIDDLE_GAME_REGISTER,
        result  : ProtoState.STATE_OK,
        args    : {
            sid : newServ.getSid(),
        }
    })
    LOG(util.format("%d server register with g: %d, c: %d", newServ.getSid(), gameType, servCapacity));
};
/**
 * 取消注册服务器
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_unregister = function(wsConn, rState, reqArgs){
    let sid = +reqArgs.sid; // 服务器编号
    // 取消服务器注册
    GSMgr.rmServ(sid, wsConn);
    GSMgr.clearGameDataBySid(sid);
    LOG(util.format("%d server unregistered", sid));
};
/**
 * 减少用量
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_decUsage = function(wsConn, rState, reqArgs){
    let roomId = +reqArgs.roomId;
    GSMgr.decUsage(roomId);
};

/**
 * 保存战报
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_save_reports = function (wsConn, rState, reqArgs) {
    let info = reqArgs.reports;
    let exMod = !!info.exMod;
    if(exMod){
        PlayerMgr.getPlayerNoCreate(info.uid, function (player) {
            if (player) {
                player.saveExReport(info);
            }
        })
    } else {
        let players = info.players;
        for(let i = 0; i < players.length; i++){
            let uid = players[i].uid;
            PlayerMgr.getPlayerNoCreate(uid, function (player) {
                if (player) {
                    player.saveReport(info);
                }
            })
        }
    }

};

/**
 * 房间销毁
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_remove_player = function(wsConn, rState, reqArgs) {
    let uids = reqArgs.uids || [];
    let roomId = reqArgs.roomId;
    let room = GSMgr.getRoomData(roomId);
    if(room) {
        for (let idx in uids) {
            let uid = +uids[idx];
            if (room.players.indexOf(uid) === -1) {
                continue;
            }
            PlayerMgr.getPlayerNoCreate(uid, function (player) {
                if (player) {
                    GSMgr.clearPlayerRoom(player, roomId);
                    player.save();
                    DEBUG(util.format("Player %d exit room", uid));
                }
            });
        }
    }
};
/**
 * 加入房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_joinroom = function(wsConn, rState, reqArgs){
    let uid = +reqArgs.joinUid;
    let roomId = +reqArgs.roomId;
    let gameServer = GSMgr.getServerByConn(wsConn);
    if (!gameServer) {
        return;
    }
    if(uid < 100000){
        GSMgr.addRobotNum(roomId, uid);
        return;
    }
    PlayerMgr.getOnlinePlayer(uid, function(player){
        if (player) {
            if (rState == ProtoState.STATE_OK) {
                GSMgr.addRoomNum(roomId, player);
                DEBUG(util.format("Player %d joined room %d", player.uid, roomId));
            } else {
               GSMgr.clearPlayerRoom(player, roomId);
            }
        } else {
            ERROR(util.format("Player %d not found", uid));
        }
    });
};

/**
 * 服务器响应创建金币房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_createRoom = function (wsConn,rState,reqArgs) {
    let gameServ = GSMgr.getServerByConn(wsConn);
    if (!gameServ) {
        ERROR("Game::game_middle_createJBRoom Get Server Failed - NEVER HAPPEN");
        return;
    }
    let matchId = reqArgs.matchId;
    let roomId = reqArgs.roomId;
    let mode = reqArgs.mode;
    let gameType = reqArgs.gameType;
    let subType = reqArgs.subType;
    let roundId = reqArgs.roundId;
    let uid = reqArgs.uid;
    GSMgr.addRoomInfo(roomId, gameServ.getSid(), gameType, subType, mode, matchId, roundId);
    let code = mode == "FK" ? ProtoID.CLIENT_MIDDLE_CREATE_ROOM : ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH;
    PlayerMgr.getOnlinePlayer(uid, function (player) {
        if (player) {
            player.getConn().sendMsg({
                code: code,
                args: {
                    result : ProtoState.STATE_OK,
                    roomId : roomId,
                    isChangeRoom:reqArgs.isChangeRoom
                }
            });
            if(mode == "FK") {
                player.setOwnedRoomId(roomId);
            }
        }
    });
};
/**
 * 中央服响应保存玩家数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_player_data = function (wsConn,rState,reqArgs) {
    let uid = reqArgs.sUid;
    let roomId = reqArgs.roomId;
    let playerIndex = reqArgs.playerIndex;
    let roomData = GSMgr.getRoomData(roomId);
    if (!roomData) {
        ERROR("game_middle_player_data: error, roomId unExist");
        return;
    }
    if (GSMgr.isRoomFull(roomId, uid)) {
        ERROR("game_middle_player_data: error, room Full");
        return;
    }
    let gameSev = GSMgr.getServerBySid(roomData.sid);
    if (!gameSev) {
        ERROR("game_middle_player_data: gameSev not exist");
        return;
    }
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player) {
            if(gSeer.getPlayerBean(player) < reqArgs.enterBean && playerIndex === 0){
                player.sendMsgToClient(ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR,{result:ProtoState.STATE_GAME_BEAN_LESS});
            }else {
                player.sendMsgToClient(ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR,{
                        ip: gameSev.getIp(),
                        port: gameSev.getPort(),
                        gameType: roomData.gameType,
                        subType: roomData.subType,
                        roomId: roomId,
                        isChangeRoom: reqArgs.isChangeRoom
                });
            };
        }
    })
};
/**
 * 请求数据
 * @param wsConn
 * @param rState
 * @param reqARgs
 */
exports.game_middle_user_list_req = function (wsConn, rState, reqARgs) {
    let data = ExtendMgr.getUserList();
    wsConn.sendMsg({
        code    : ProtoID.MIDDLE_GAME_USER_LIST_RESP,
        args    : {
            data : data
        }
    });
    DEBUG(wsConn.sid + " req user_list");
};

/**
 * 更新货币
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_update_money = function (wsConn, rState, reqArgs) {
    let data = reqArgs.data;
    let uid = data.uid;
    PlayerMgr.getPlayerNoCreate(+uid, function (player) {
        if (player) {
            player.updateMoney(data);
            player.speUpdateMoney(data);
        }
    });
};

/**
 * 离开房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_player_level_roomId = function (wsConn, rState, reqArgs) {
    let roomId = reqArgs.roomId;
    let uid = reqArgs.guid;
    let giveUpExit = reqArgs.giveUpExit;
    let roomData = GSMgr.getRoomData(roomId);
    if (roomData) {
        GSMgr.reduceRoomNum(roomId, uid, giveUpExit);
    }
};
/**
 * 移除复制人
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_remove_copy = function (wsConn, rState, reqArgs) {
    let roomId = reqArgs.roomId;
    let uid = reqArgs.guid;
    let roomData = GSMgr.getRoomData(roomId);
    if (roomData) {
        GSMgr.reduceCopyNum(roomId, uid);
    }
}
/**
 * 换桌
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_change_room = function (wsConn, rState, reqArgs) {
    let uid = reqArgs.guid;
    reqArgs.isChangeRoom = true;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player) {
            GSMgr.clearPlayerRoom(player, reqArgs.sourceSid);
            let wsConn = player.getConn();
            GameLogic.client_middle_req_add_match(wsConn, ProtoState.STATE_OK, reqArgs, player);
        }
    });
};

/**
 * 更新玩家统计数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_update_player_counts = function (wsConn, rState, reqArgs) {
    let players = reqArgs.players;
    for (let uid in players){
        let data = players[+uid];
        PlayerMgr.getPlayerNoCreate(+uid, (player) => {
            if(player) {
                player.updateCounts(data.name, data.num);
            }
        });
    }
};
/**
 * 更新收益
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.game_middle_update_profit = function (wsConn, rState, reqArgs) {
    let uData = reqArgs.uData;
    let cost = reqArgs.cost;
    ExtendMgr.updateProfit(uData, cost);
};
/**
 * 更新比赛场积分
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.updateWatchScore = function (wsConn, rState, reqArgs) {
    let uid = reqArgs.guid;
    let score = reqArgs.score;
    gMatch.updateScore(uid, score);
};
/**
 * 检测
 * @param wsConn
 */
exports.game_middle_check_task = function (wsConn, rState, reqArgs) {
    let data = reqArgs.data;
    gTask.checkComplete(data);
};
/**
 * 请求房卡场列表回执
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @constructor
 */
exports.FKListResp = function (wsConn, rState, reqArgs) {
    let uid = reqArgs.uid;
    let list = reqArgs.list;
    PlayerMgr.getPlayerNoCreate(uid, (player)=>{
        if(player){
            player.tmp.recvServerCur++;
            player.tmp.FKList.push.apply(player.tmp.FKList, list);
            player.removeSameRoom();
            player.FKListSort();
            if(player.tmp.recvServerCur >= player.tmp.recvServerCur){
                let list = player.getFKListToClient();
                player.sendMsgToClient(ProtoID.CLIENT_MIDDLE_REQ_FK_LIST, {list})
            }
        }
    })
}

/**
 * 强制销毁房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.froceRestroyRoom = function (wsConn, rState, reqArgs) {
    let roomId = reqArgs.roomId;
    let roomData = GSMgr.getRoomData(roomId);
    if (roomData) {
        GSMgr.froceJSRoom(roomId);
    }
}
/**
 * 通知玩家强行离开了某个游戏
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.noticeKickPlayer = function(wsConn, rState, reqArgs){
    let uid = reqArgs.guid;
    let type = reqArgs.type;
    PlayerMgr.getPlayerNoCreate(uid, (player)=>{
        if(player){
            player.sendMsgToClient(ProtoID.GAME_MIDDLE_PLAYER_KICK,{type})
        }
    })
}
