let ProtoID         = require("../net/CSProto.js").ProtoID;
///////////////////////////////////////////////////////////////////////////////
//>> 游戏服务器逻辑处理

function ProtoMap() {
    this.protoMap   = {};
    this.init();
}

ProtoMap.prototype = {
    /**
     * 初始化
     */
    init: function() {
        // 初始化与中央服务器通信逻辑
        let MiddleLogic = require("./Middle.js");
        this.addProto(ProtoID.MIDDLE_GAME_REGISTER, MiddleLogic.middle_game_RegServ);
        this.addProto(ProtoID.MIDDLE_GAME_UNREGISTER, MiddleLogic.middle_game_UnregServ);
        this.addProto(ProtoID.MIDDLE_GAME_CREATE_ROOM, MiddleLogic.middle_game_create_Room);
        this.addProto(ProtoID.MIDDLE_GAME_DX, MiddleLogic.middle_game_playerDX);
        this.addProto(ProtoID.MIDDLE_GAME_PLAYER_DATA,MiddleLogic.middle_game_player_room_data);
        this.addProto(ProtoID.MIDDLE_GAME_USER_LIST_RESP,MiddleLogic.middle_game_user_list_resp);
        this.addProto(ProtoID.MIDDLE_GAME_UPDATE_USER_LIST,MiddleLogic.middle_game_user_list_update);
        this.addProto(ProtoID.MIDDLE_GAME_PROXY_LV_CHANGE,MiddleLogic.onPlayerExtendChange);
        this.addProto(ProtoID.MIDDLE_GAME_UPDATE_STATUS,MiddleLogic.middle_game_update_user_status);
        this.addProto(ProtoID.MIDDLE_GAME_REQ_FK_LIST,MiddleLogic.middle_game_req_FK_list);
        // 游戏逻辑消息表
        let GameLogic = require("./Game.js");
        this.addProto(ProtoID.CLIENT_GAME_JOIN_ROOM, GameLogic.client_game_join_room);
        // 退出，销毁，投票房间相关
        this.addProto(ProtoID.CLIENT_GAME_READY, GameLogic.client_game_ready);

        this.addProto(ProtoID.CLIENT_GAME_DESTORY_ROOM,GameLogic.client_game_destory_room);                 // 销毁房间
        this.addProto(ProtoID.CLIENT_GAME_VOTE_ROOM,GameLogic.client_game_launch_restory_room);             // 发起解散房间
        this.addProto(ProtoID.CLIENT_GAME_VOTE_AGREE,GameLogic.client_game_vote_room);                      // 选择解散房间
        this.addProto(ProtoID.CLIENT_GAME_KICK_PLAYER,GameLogic.ReqKick);                                   // 请求踢人

        this.addProto(ProtoID.CLIENT_GAME_LEAVE_ROOM, GameLogic.client_game_cancel_match);
        this.addProto(ProtoID.CLIENT_GAME_MIDDLE_CHENG_ROOM, GameLogic.client_game_change_room);
        // 请求丫丫语音
        this.addProto(ProtoID.CLIENT_GAME_DO_CHAT, GameLogic.client_game_chat);
        this.addProto(ProtoID.CLIENT_GAME_GIFT, GameLogic.client_game_gift);
        this.addProto(ProtoID.CLIENT_GAME_YAYA,GameLogic.client_game_yaya);
        this.addProto(ProtoID.CLIENT_GAME_GAME_END, GameLogic.gameEnd);                                     // 游戏结束
    },

    /**
     * 添加消息处理
     * @param protoId
     * @param handler
     */
    addProto: function(protoId, handler) {
        this.protoMap[protoId] = handler;
    },

    /**
     * 查找消息处理器
     * @param protoId
     * @returns {*}
     */
    findProtoHandler: function(protoId) {
        return this.protoMap[protoId];
    },
};

exports = module.exports = new ProtoMap();
