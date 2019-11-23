let util            = require("util");
let Room            = require("./Room.js").Room;
let ProtoID = require("../../../net/CSProto.js").ProtoID;

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
        this.onProto(ProtoID.CLIENT_GAME_DO_PLAY_MJ, this.onPlayerReqPlayCard);                                    //  玩家请求出牌
        this.onProto(ProtoID.CLIENT_GAME_DO_PENG, this.onPlayerReqPengCard);                                       //  玩家请求碰牌
        this.onProto(ProtoID.CLIENT_GAME_DO_GANG, this.onPlayerReqGangCard);                                       //  玩家请求杠牌
        this.onProto(ProtoID.CLIENT_GAME_DO_CHI, this.onPlayerReqChiCard);                                         //  玩家请求吃牌
        this.onProto(ProtoID.CLIENT_GAME_DO_HU, this.onPlayerReqHuCard);                                           //  玩家请求胡牌<发送结算面板信息>
        this.onProto(ProtoID.CLIENT_GAME_DO_PASS_MJ, this.onPlayerReqPass);                                        //  玩家请求过牌
        this.onProto(ProtoID.CLIENT_GAME_TG, this.onPlayerHosted);                                                 //  玩家托管
        this.onProto(ProtoID.CLIENT_GAME_START_GA, this.startGaReq);                                               //  玩家请求上噶
        this.onProto(ProtoID.CLIENT_GAME_PLUS_CARDS, this.onPlayerPlusCards);                                      //  请求剩余牌
        this.onProto(ProtoID.CLIENT_GAME_MODIFY_CARDS, this.onPlayerModifyCards);                                  //  修改底牌
    },

    onProto: function(opCode, handler) {
        this.protoMap[opCode] = handler;
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
     * 玩家出牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqPlayCard: function(wsConn, rState, rArgs){
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let card = +rArgs.card;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request chu_pai, %d", uid, card));
        wantRoom.onPlayerReqPlayCard(uid, card);
    },

    /**
     * 玩家杠牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqGangCard: function(wsConn, rState, rArgs){
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let card = +rArgs.card;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request Gang, %d", uid, card));
        wantRoom.onPlayerReqGangCard(uid,card);
    },
    /**
     * 玩家请求吃牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqChiCard:function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let arrayIndex = +rArgs.arrayIndex;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request chi: %d", uid, arrayIndex));
        wantRoom.onPlayerReqChiCard(uid,arrayIndex);
    },
    /**
     * 玩家请求碰牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqPengCard: function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let card = +rArgs.card;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request PENG", uid));
        wantRoom.onPlayerReqPengCard(uid, card);
    },
    /**
     * 玩家请求胡牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqHuCard: function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        DEBUG(util.format("Player %d request HU", uid));
        wantRoom.onPlayerReqHuCard(uid);
    },
    /**
     * 玩家请求过
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerReqPass: function(wsConn, rState, rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if (!wantRoom) {
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }

        DEBUG(util.format("Player %d request PASS", uid));
        wantRoom.onPlayerReqPass(uid);
    },
    /**
     * 玩家托管
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerHosted : function (wsConn,rState, rArgs) {
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
     * 上嘎请求
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    startGaReq:function (wsConn, rState,rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let gaScore = +rArgs.multiple;
        let wantRoom = this.rooms[roomId];
        if(!wantRoom){
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        wantRoom.startGaReq(uid, gaScore);
    },
    /**
     * 请求剩余牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerPlusCards:function (wsConn, rState,rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let wantRoom = this.rooms[roomId];
        if(!wantRoom){
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        wantRoom.onPlayerPlusCards(uid);
    },
    /**
     * 修改底牌
     * @param wsConn
     * @param rState
     * @param rArgs
     */
    onPlayerModifyCards:function (wsConn, rState,rArgs) {
        let uid = +rArgs.uid;
        let roomId = +rArgs.roomId;
        let cards = rArgs.cards;
        let wantRoom = this.rooms[roomId];
        if(!wantRoom){
            DEBUG(util.format("Room %d not exists", roomId));
            return;
        }
        wantRoom.onPlayerModifyCards(uid, cards);
    },
};

exports = module.exports = new SubGame();
