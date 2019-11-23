let util            = require("util");
let ProtoID         = require("../net/CSProto.js").ProtoID;
let gameEveId       = require("../net/CSProto.js").GameEveId;

///////////////////////////////////////////////////////////////////////////////
//>> 游戏服务器管理器

// 游戏服务器描述符
function GameServerDesc(id) {
    this.id         = id;
    this.ip         = null;
    this.port       = 0;
    this.gameType   = 0;
    this.capacity   = 0;
    this.usage      = 0;
    this.wsConn     = null;
}

GameServerDesc.prototype = {
    // 初始化
    init: function(ip, port, game, capacity, wsConn) {
        this.ip = ip;
        this.port = port;
        this.gameType = game;
        this.capacity = capacity;
        this.wsConn = wsConn;
    },

    // 获取服务器编号
    getSid: function() {
        return this.id;
    },

    // 获取连接
    getConn: function() {
        return this.wsConn;
    },

    // 增加用量
    addUsage: function() {
        ++this.usage;
        this.updateMongo();
        DEBUG(util.format("游戏sid: %d 用量增加到 %d", this.id, this.usage));
    },

    // 减少用量
    delUsage: function() {
        --this.usage;
        this.updateMongo();
        DEBUG(util.format("游戏sid: %d 用量减少到 %d", this.id, this.usage));
    },
    // 更新数据库
    updateMongo:function () {
        let _id = "gameServerRoomNum_" + this.id;
        MongoGameInfo.findOne({_id:_id},{},function (err,res) {
            if(err){
                ERROR("更新服务器用量,数据库出错");
            }else{
                if(res){
                    MongoGameInfo.updateOne({_id:_id},{$set:{usage:this.usage}},null);
                }else{
                    DEBUG("this.id: " + this.id + "usage: " + this.usage);
                    MongoGameInfo.insertOne({_id: _id,"eveId":gameEveId.GAME_CAPACITY,"sid":this.id,"usage":this.usage},null);
                }
            }
        }.bind(this))
    },
    // 服务器是否繁忙
    isBusy: function() {
        return this.usage >= this.capacity;
    },

    // 判断服务器支持的是不是这个游戏
    isGame: function(game) {
        return this.game == game;
    },

    isConn: function(wsConn) {
        return this.wsConn == wsConn;
    },

    // 发送消息
    sendMsg: function(msg) {
        this.wsConn.sendMsg(msg);
    },

    // 获取服务器地址
    getAddress: function() {
        return util.format("ws://%s:%d/", this.ip, this.port);
    },
    /**
     * 获取ip地址
     * @returns {null|*}
     */
    getIp:function () {
        return this.ip;
    },
    /**
     * 获取端口
     * @returns {*|number}
     */
    getPort:function () {
        return this.port;
    }
};

///////////////////////////////////////////////////////////////////////////////

function GameServerManager() {
    this.gameServs = {};
    this.roomData = {};
}

GameServerManager.prototype = {
    /**
     * 增加服务器
     */
    addServ: function(sid, ip, port, gameType, capacity, wsConn) {
        let newServDesc = new GameServerDesc(sid);
        newServDesc.init(ip, port, gameType, capacity, wsConn);
        this.gameServs[sid] = newServDesc;
        return newServDesc;
    },
    /**
     * 清理房间信息
     * @param sid
     */
    clearGameDataBySid:function (sid) {
        let uids = [];
        ERROR("开始清理sid是" + sid + "的游戏服数据");
        for(let roomId in this.roomData){
            if(this.roomData[roomId].sid == sid){
                let players = this.roomData[roomId].players;
                for(let idx in players){
                    uids.push(players[idx]);
                }
                ERROR("清理房间: " + roomId);
                delete this.roomData[roomId];
                delete GlobalInfo.usedRoomIds[roomId];
            }
        }
        for(let idx = 0; idx < uids.length; idx++){
            let uid = uids[idx];
            (function (uid) {
                PlayerMgr.getPlayerNoCreate(uid, function (player) {
                    if(player){
                        player.setOwnedRoomId(0);
                        player.setJoinedRoomId(0);
                        ERROR("游戏服关闭 清理玩家数据");
                    }
                })
            })(uid);
        }
    },
    /**
     * 移除服务器
     */
    rmServ: function(sid, wsConn) {
        let servDesc = this.gameServs[sid];
        if (servDesc && (servDesc.getConn() == wsConn)) {
            delete this.gameServs[sid];
            DEBUG(util.format("server %d remove", sid));
        }
    },

    /**
     * 增加服务器用量
     */
    incUsage: function(sid) {
        let servDesc = this.gameServs[sid];
        if (servDesc) {
            servDesc.addUsage();
        }
    },

    /**
     * 减少服务器用量
     */
    decUsage: function(roomId) {
        let roomData = this.getRoomData(roomId);
        if(roomData) {
            let servDesc = this.gameServs[roomData.sid];
            if (servDesc) {
                servDesc.delUsage();
            }
            ERROR("减少房间 roomData.. " + roomId);
            delete this.roomData[roomId];
            delete GlobalInfo.usedRoomIds[roomId];
        }
    },
    /**
     * 获取最优取服务器
     */
    choiceMinServer: function(gameType) {
        let min = 999999999;
        let tempSid = null;
        for(let sid in this.gameServs){
            DEBUG("服务器" + sid + "用量" + this.gameServs[sid].usage);
            if(this.gameServs[sid].gameType == gameType){
                if(this.gameServs[sid].usage < min) {
                    min = this.gameServs[sid].usage;
                    tempSid = sid;
                }
            }
        }
        if(tempSid){
            return this.gameServs[tempSid];
        }
       return null;
    },

    /**
     * 通过wsConn获取服务器
     */
    getServerByConn: function(wsConn) {
        for (let sid in this.gameServs) {
            let serv = this.gameServs[sid];
            if (serv.isConn(wsConn)) {
                return serv;
            }
        }
        return null;
    },
    /**
     * 通过sid获取服务器
     */
    getServerBySid: function(sid) {
        return this.gameServs[sid];
    },
    /**
     * 通过gameType获取游戏服务器
     * @param gameType
     */
    getServersByGameType(gameType){
        let servers = [];
        for(let sid in this.gameServs){
            let server = this.gameServs[sid];
            if(server.gameType === gameType){
                servers.push(server);
            }
        }
        return servers;
    },

    test(gameType){
        ERROR(gameType);
    },

    /**
     * 增加房间信息
     */
    addRoomInfo: function (roomId, sid, gameType, subType, mode, matchId, roundId) {
        let maxNum = this.getNumByGameType(gameType, subType);
        this.roomData[roomId] = {};
        this.roomData[roomId].sid = sid;
        this.roomData[roomId].gameType = gameType;
        this.roomData[roomId].subType = subType;
        this.roomData[roomId].mode = mode;
        this.roomData[roomId].matchId = matchId || gameType;
        this.roomData[roomId].curNum = 0;
        this.roomData[roomId].copyNum = 0;
        this.roomData[roomId].maxNum = maxNum;
        this.roomData[roomId].roundId = roundId;
        this.roomData[roomId].players = [];
        this.roomData[roomId].copys = [];
        this.roomData[roomId].status = 0;               // 0未开始 1开始 2结束
        this.incUsage(sid);
    },

    /**
     * 金币场获取最优的房间号
     * @param matchId
     * @returns {*|number}
     */
    getPriorRoomId:function(matchId, sourceSid) {
        for(let compare = 1; compare < 6; compare++) {
            for (let rId in this.roomData) {
                let info = this.roomData[rId];
                if (info.matchId == matchId && sourceSid != rId && !this.roomIsRobot(info)) {
                    if (info.maxNum - info.curNum - info.copyNum == compare) {
                        if (info.status != 0 && (Config.enoughRooms.indexOf(info.gameType) >= 0)) {
                            continue;
                        }
                        return {sid: info.sid, roomId: rId};
                    }
                }
            }
        }
        return null;
    },
    /**
     * 获取房间数据
     */
    getRoomData:function (roomId) {
        return this.roomData[roomId];
    },
    /**
     * 房间满
     */
    isRoomFull:function (roomId, uid) {
        let room = this.roomData[roomId];
        if(room.players.indexOf(uid) >= 0){
            return false;
        }else {
            return room.curNum >= room.maxNum ? true : false;
        }

    },
    /**
     * 游戏结束清除copy的玩家信息
     */
    clearCopyNum(rid, status){
        let roomData = GSMgr.getRoomData(rid);
        if(roomData){
            if(status === 2){
                roomData.copys = [];
                roomData.copyNum = 0;
            }
        }
    },
    /**
     * 根据游戏类型获取最大玩家数量
     * @param gameType
     * @param subType
     * @returns {number}
     */
    getNumByGameType:function(gameType, subType) {
        let num = 0;
        switch (gameType) {
            case  1:
                if(subType == 1){
                    num = 2;
                }else if(subType == 2){
                    num = 4;
                }
                break;
            case 2:
                num = 3;
                break;
            case 3:
                num = 3;
                break;
            case 4:
                num = 6;
                break;
            case 5:
                num = 6;
                break;
            case 7:
                if(subType == 1){
                    num = 3;
                }else if(subType == 2){
                    num = 4;
                }
                break;
            case 8:
                if(subType == 1){
                    num = 2;
                }else if(subType == 2){
                    num = 4;
                }
        }
        return num;
    },
    /**
     * 检测房间是否正确
     */
    checkRoomId:function(player) {
        let roomId = player.getJoinedRoomId();
        if(roomId != 0 && !this.roomData[roomId]){
            ERROR("doLogin 清理玩家数据");
            GSMgr.clearPlayerRoom(player, roomId);
            delete GlobalInfo.usedRoomIds[roomId];
        }
    },
    /**
     * 增加房间人数
     */
    addRoomNum:function (roomId, player) {
        let uid = player.uid;
        let roomData = this.getRoomData(roomId);
        if(roomData.players.indexOf(uid) == -1) {
            roomData.players.push(uid);
            roomData.curNum++;
            player.setJoinedRoomId(roomId);
            ERROR("addRoomNum()房间" + roomId + "有 " + roomData.curNum + "人");
        }
    },
    /**
     * 添加机器人
     */
    addRobotNum:function (roomId, uid) {
        let roomData = this.getRoomData(roomId);
        if(roomData && roomData.players.indexOf(uid) == -1) {
            roomData.players.push(uid);
            roomData.curNum++;
            ERROR("addRobotNum()房间" + roomId + "有 " + roomData.curNum + "人");
        }
    },
    /**
     * 是否为机器人房间
     */
    roomIsRobot:function (room) {
        return false;                       // 需求更改现在机器人可以和玩家一起玩 所以可以一起匹配到
        for(let idx in room.players) {
            let uid = room.players[idx];
            if(uid < 100000){
                return true;
            }
        }
        let matchId = room.matchId;
        if(csConfig.matchConfig[matchId] && csConfig.matchConfig[matchId].opts.isRobot){
            return true;
        }
        return false;
    },
    /**
     * 减少房间人数
     */
    reduceRoomNum:function (roomId, uid, giveUpExit){
        let roomData = this.getRoomData(roomId);
        if(roomData){
            let pos = roomData.players.indexOf(uid);
            if(pos > -1){
                roomData.players.splice(pos, 1);
                roomData.curNum--;
                if(giveUpExit){
                    if(roomData.copys.indexOf(uid) == -1){
                        roomData.copys.push(uid);
                        roomData.copyNum++;
                    }
                }
                ERROR("reduceRoomNum() 房间" + roomId + "有 " + roomData.curNum + "人");
                if (roomData.curNum <= 0) {
                    this.decUsage(roomId);
                }
                PlayerMgr.getPlayerNoCreate(uid, function (player) {
                    if(player) {
                        if(player.getJoinedRoomId() === roomId) {
                            player.setOwnedRoomId(0);
                            player.setJoinedRoomId(0);
                        }
                        player.checkBeanLess();
                    }
                });
            }
        }else{
            ERROR("reduceRoomNum param error uid: " + uid);
        }
    },
    /**
     * 移除复制人
     */
    reduceCopyNum:function (roomId, uid) {
        let roomData = this.getRoomData(roomId);
        if(roomData){
            let pos = roomData.copys.indexOf(uid);
            if(pos > -1) {
                roomData.copys.splice(pos, 1);
                roomData.copyNum--;
            }
            if(roomData.copyNum < 0){
                roomData.copyNum = 0;
            }
        }
    },
    /**
     * 强制解散房间
     * @param roomId
     */
    froceJSRoom(roomId){
        let roomData = this.getRoomData(roomId);
        if(roomData){
            for(let idx in roomData.players){
                let uid = roomData.players[idx];
                (function (uid) {
                    PlayerMgr.getPlayerNoCreate(uid, (player)=>{
                        if(player && player.getJoinedRoomId() === roomId){
                            player.setOwnedRoomId(0);
                            player.setJoinedRoomId(0);
                        }
                    })
                })(uid);
            }
            this.decUsage(roomId);
        }
    },
    /**
     * 判断房间是否存在此人
     * @param roomId
     * @param uid
     */
    roomExistUid:function (roomId, uid) {
        let roomData = this.getRoomData(roomId);
        if(roomData){
            if(roomData.players.indexOf(uid) >= 0){
                return true;
            }
        }
        return false;
    },
    /**
     * 清理玩家在房间内的数据
     */
    clearPlayerRoom:function(player, roomId) {
        let uid = player.uid;
        let room = this.roomData[roomId];
        if(room) {
            let pos = room.players.indexOf(uid);
            if (pos >= 0) {
                room.players.splice(pos, 1);
                room.curNum--;
                if (room.curNum <= 0 || this.isHavePlayer(room) == false) {
                    this.decUsage(roomId);
                }
                player.setOwnedRoomId(0);
                player.setJoinedRoomId(0);
                player.checkBeanLess();
            }
        }
    },
    /**
     * 是否有自然人
     * @param room
     */
    isHavePlayer:function (room) {
        for(let idx in room.players){
            let uid = room.players[idx];
            if(uid > 100000){
                return true;
            }
        }
        return false;
    },
    /**
     * 通过wsConn获取服务器
     */
    getServerByWsConn:function (wsConn) {
        for(let sid in this.gameServs){
            if(this.gameServs[sid].wsConn == wsConn){
                return sid;
            }
        }
        return null;
    },
    /**
     *  发送断线给其他玩家
     */
    sendDX2Room:function (uid,roomId) {
        let roomData = this.roomData[roomId];
        if(roomData) {
            let sid = roomData.sid;
            let reqArgs = {};
            reqArgs["dxUid"] = uid;
            reqArgs["roomId"] = roomId;
            reqArgs["gameType"] = roomData.gameType;
            let sev = this.gameServs[sid];
            if (sev) {
                sev.sendMsg({
                    code: ProtoID.MIDDLE_GAME_DX,
                    args: reqArgs
                })
            }
        }
    },
    /**
     * 广播消息
     */
    broadcastMsg: function (code, args, excludes) {
        excludes = excludes || [];
        for(let sid in this.gameServs){
            if(excludes.indexOf(sid) == -1) {
                let gServer = this.gameServs[sid];
                gServer.sendMsg({code:code, args:args})
            }
        }
    },
    /**
     * @param matchId
     */
    getMatchNum:function (matchId) {
        let num = 0;
        for(let rId in this.roomData){
            let room = this.roomData[rId];
            if(room.matchId == matchId){
                num += room.curNum;
            }
        }
        return num;
    }

};

exports.GameServerManager = GameServerManager;
