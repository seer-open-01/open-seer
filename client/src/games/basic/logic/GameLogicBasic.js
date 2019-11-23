/**
 * Created by Jiyou Mo on 2017/10/16.
 */
// 游戏逻辑基础
var GameLogicBasic = cc.Class.extend({

    // === 属性 =================================================================
    _window         : null,             // 窗口对象的类
    _ui             : null,             // ui面板
    isFinalRound    : false,            // 是否是最终局结算

    // === 函数 =================================================================
    /**
     * 构造 (不能重写)
     * @param window        需要创建的游戏界面对象
     */
    ctor : function (window) {
        this._window = window;
        this.enter(window);
        return true;
    },
    
    // 语言登入
    voiceLogin : function () {
        var gameData = game.Procedure.getProcedure().getGameData();
        cc.log("==> login roomId = " + gameData.roomId + " uid = " + game.DataKernel.uid + " name = " + game.DataKernel.name);
        // 登录语音
        // VoiceSDK.logout();

        // setTimeout(function () {
        //     VoiceSDK.loginRoom("" + gameData.roomId, "" + game.DataKernel.uid, game.DataKernel.name);
        // }, 1500);

        // 设置语音开始说话回调
        // VoiceSDK.setOtherMicUpCallback(function (uid) {
        //    this.onPlayerSpeakBegin(+uid);
        // }.bind(this));

        // 设置语音完毕说话回调
        // VoiceSDK.setOtherMicDownCallback(function (uid) {
        //     this.onPlayerSpeakEnd(+uid);
        // }.bind(this));
    },

    // 语言登出
    voiceLogout : function () {
        // VoiceSDK.logout();
    },

    /**
     * 进入函数 (不能重写)
     * @param window  需要创建的游戏界面对象
     */
    enter : function(window) {
        cc.log("enter GameBasic");

        this.voiceLogin();

        // 绑定安卓返回按键函数
        game.Procedure.onAndroidReturnClicked(this._BTN_AndroidReturnCallback.bind(this));

        // 创建窗口回调
        this._ui = new window();
        game.UISystem.switchUI(this._ui);

        // 初始化界面
        this._ui.initUI();

        this._ui.onChatBtnClicked(this._BTN_Chat);

        this._afterUIInit();

        // 开启系统信息更新(必须在initUI函数后调用 否则会发送位置错误)
        this._ui.openUpdateSystem();
        /**
         * 重置更新房间里的信息
         */
        this.resetUpdateRoomInfo();

        // 恢复网络消息处理
        // game.Procedure.resumeNetMessageDispatch();
        this.isFinalRound = false;

        //更新房间宝箱状态
        this._ui.getTaskBox().updateTaskBox(game.DataKernel.haveTaskReward);

        //为了避免在进入游戏以后，再次受到邀请界面，这里在基类做个判断
        if(game.procedure.Home!=game.Procedure.getProcedure() && game.procedure.RoomList!=game.Procedure.getProcedure()){
            if(game.ui.InvitationWindow.inst != null){
                cc.log("在刚进入游戏界面的时候，关闭邀请弹窗");
               game.ui.InvitationWindow.inst._close();
            }
        }
    },

    //更新任务状态
    initCustomListener:function(){
            cc.eventManager.addCustomListener("taskStatus",function(event){
            cc.log("==> 游戏房间收到任务更新");
            this._ui.getTaskBox().updateTaskBox(game.DataKernel.haveTaskReward);
        }.bind(this));
    },
    /**
     * 被重写必须调用父类的函数
     */
    leave : function() {
        // 登出语音
        this.voiceLogout();
        // 关闭系统信息自动更新
        this._ui.closeUpdateSystem();
        // 关闭防作弊窗口
        // game.ui.GameAntiCheating.close();
        // 关闭解散房间窗口
        // game.ui.GameDissolve.close();
        // 强制关闭其他窗口
        game.UISystem.closeAllPopupWindow();
        // 服务费控件被移除
        GameWindowBasic.ConsumeTip.inst = null;

        //移除
        cc.eventManager.removeCustomListeners("taskStatus");
    },

    update : function (dt) {},

    // ============================================================================
    /**
     * UI初始化完毕之后调用
     * @private
     */
    _afterUIInit : function () {},

    /**
     * 根据当前的 gameData 重置房间信息函数(用于重写)
     */
    resetUpdateRoomInfo : function () {

        this.initCustomListener();
    },

    /**
     * 玩家开始说话回调 (必须重写)
     * @param uid   玩家的id号 string
     */
    onPlayerSpeakBegin : function (uid) {
        cc.log("玩家开始说话重写的函数" + uid);
    },

    /**
     * 玩家停止说话回调 (必须重写)
     * @param uid 玩家的id号 string
     */
    onPlayerSpeakEnd : function (uid) {
        cc.log("玩家停止说话重写的函数" + uid);
    },

    /**
     * 获取UI界面
     */
    getUIWindow: function () {
        return this._ui;
    },

    // ==== 逻辑处理 ======================================================================
    /**
     * 准备操作 用于准备按钮点击回调
     */
    __sendReady : function () {
        game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_PLAYER_READY, {ready : true, uid : game.DataKernel.uid, roomId : game.DataKernel.roomId});
    },

    /**
     * 离开房间处理
     */
    __exitGame : function () {
        game.DataKernel.clearRoomId();
        game.Procedure.switch(game.procedure.RoomList);
    },

    /**
     * 玩家头像被点击 (必须重写)
     * @param index
     * @private
     */
    __HeadPicClicked : function (index) {
        cc.log("用于重写的玩家头像被点击函数" + index);
    },

    /**
     * 安卓返回按钮点击回调
     * @private
     */
    _BTN_AndroidReturnCallback : function () {
        if (game.UISystem.isHavePopupWindow()) {
            game.UISystem.closeAnyonePopupWindow();
        } else {
            this._BTN_Exit();
        }
    },

    /**
     * 退出按钮点击处理
     */
    _BTN_Exit : function () {
        cc.log("==> 退出按钮被点击");

        // 如果游戏服断掉 直接退出房间
        if (!game.gameNet.isConnected()) {
            game.Procedure.switch(game.procedure.Home);
            return;
        }

        game.ui.TipWindow.popup({
            tipStr:  "确认退出房间吗？",
            showNo:  true
        }, function (win) {
            game.UISystem.closePopupWindow(win);
            game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {uid : game.DataKernel.uid, roomId : game.DataKernel.roomId});
        }.bind(this));
        game.Audio.playBtnClickEffect();
    },

    /**
     * 聊天按钮处理
     * @private
     */
    _BTN_Chat : function() {
        cc.log("==> 点击了聊天按钮");
        game.Audio.playBtnClickEffect();
        ChatWindow.popup();
    },

    /**
     * 设置按钮处理
     */
    _BTN_Setting : function() {
        cc.log("==> 点击了设置按钮");
        game.Audio.playBtnClickEffect();
        game.ui.GameSetting.popup();
    },
    
    // =========================================================================
    /**
     * 绑定消息函数 子类重写必须调用父类的该函数
     */
    bindNetMessageHandler : function () {
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_PLAYER_ADD, this.__NET_onPlayerAdd.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, this.__NET_onRoomFinished.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_PLAYER_LEAVE, this.__NET_onPlayerLeave.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_PLAYER_ONLINE, this.__NET_onPlayerOnline.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_PLAYER_OFFLINE, this.__NET_onPlayerOffline.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_PLAYER_READY, this.__NET_onPlayerReady.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_ROOM_CHAT, this.__NET_onRoomChat.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_SEND_GIFT, this.__NET_onPlayerSendGift.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_REQ_CHANGE_TABLE, this.__NET_onChangeTable.bind(this));
    },

    // == 具体消息处理 =========================================

    /**
     * 加入玩家消息
     * @param msg
     * @private
     */
    __NET_onPlayerAdd : function(msg) {
        cc.log("==> 新玩家加入消息：" + JSON.stringify(msg));
        // 更新游戏数据
        var gameData = game.Procedure.getProcedure().getGameData();
        var playerIndex = gameData.parseNewPlayerEnterRoom(msg);
        var playerData = gameData.players[playerIndex];

        // 显示玩家信息
        var uiPlayer = this._ui.getPlayer(playerIndex);
        uiPlayer && uiPlayer.setInfo(playerIndex, playerData);
        uiPlayer && uiPlayer.onHeadPicClicked(this.__HeadPicClicked.bind(this));
    },

    /**
     * 玩家离开房间消息
     * @param msg
     * @private
     */
    __NET_onPlayerLeave : function(msg) {
        cc.log("==> 玩家离开房间消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var gameData = game.Procedure.getProcedure().getGameData();
        if (index == gameData.playerIndex) {
            this.__exitGame();
            return;
        }
        // 删除玩家
        delete gameData.players[index];
        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer && uiPlayer.setInfo(-1);
    },

    /**
     * 玩家离线消息
     * @param msg
     * @private
     */
    __NET_onPlayerOffline : function (msg) {
        cc.log("==> 玩家离线消息：" + JSON.stringify(msg));
        var playerIndex = msg.playerIndex;
        game.Procedure.getProcedure().getGameData().players[playerIndex].online = false;
        var uiPlayer = this._ui.getPlayer(playerIndex);
        uiPlayer && uiPlayer.setOnline(false);
    },

    /**
     * 玩家上线消息
     * @param msg
     * @private
     */
    __NET_onPlayerOnline : function (msg) {
        cc.log("==> 玩家重连上线消息：" + JSON.stringify(msg));
        var playerIndex = msg.playerIndex;
        game.Procedure.getProcedure().getGameData().players[playerIndex].online = true;
        var uiPlayer = this._ui.getPlayer(playerIndex);
        uiPlayer && uiPlayer.setOnline(true);
    },

    /**
     * 玩家准备消息
     * @param msg
     * @private
     */
    __NET_onPlayerReady : function(msg) {
        cc.log("==> 玩家准备消息：" + JSON.stringify(msg));
        if (msg.result != protocol.ProtoStatus.STATUS_OK) {
            game.ui.TipWindow.popup({
                tipStr : "Seer不足，请充值！\n您所携带的Seer数量必须符合准入限制"
            }, function (win) {
                game.UISystem.closePopupWindow(win);
                game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {uid : game.DataKernel.uid, roomId : game.DataKernel.roomId});
            });
            return;
        }
        var playerIndex = msg.playerIndex;
        game.Procedure.getProcedure().getGameData().players[playerIndex].ready = msg.isReady;
        var uiPlayer = this._ui.getPlayer(playerIndex);
        uiPlayer && uiPlayer.showReady(true);
    },

    /**
     * 房间结束 (本玩家离开游戏)
     * @param msg
     * @private
     */
    __NET_onRoomFinished : function(msg) {
        cc.log("房间结束消息：" + JSON.stringify(msg));
        if (msg.result == protocol.ProtoStatus.STATUS_OK) {
            game.Procedure.pauseNetMessageDispatch();
            // 不是最终局直接退出游戏界面
            if (!this.isFinalRound)
                this.__exitGame();


        } else if (msg.result == protocol.ProtoStatus.STATUS_GAME_CANNOT_QUIT) {
            game.ui.TipWindow.popup({
                tipStr  : "游戏已经在进行中，不能退出"
            }, function (win) {
                game.UISystem.closePopupWindow(win);
            });
        }
    },

    /**
     * 房间聊天处理
     * @param msg
     * @private
     */
    __NET_onRoomChat : function(msg) {
        cc.log("==> 玩家聊天消息：" + JSON.stringify(msg));
        var index = +msg.playerIndex;
        var type = msg.type;
        var content = msg.content;
        var uiPlayer = this._ui.getPlayer(index);
        var player = game.Procedure.getProcedure().getGameData().players[index];
        if (!uiPlayer) {
            cc.log("未找到玩家的UI显示信息:  index:" + index);
            return;
        }
        if (type == ChatWindow.ChatType.FACE) {
            // 表情
            uiPlayer.showChatFace(content);
        } else if (type == ChatWindow.ChatType.NORMAL) {
            // 普通文字
            uiPlayer.showChatMsg(content);
        } else if (type == ChatWindow.ChatType.PHRASE) {
            // 聊天短语
            var text = GameString.ChatString[content];
            uiPlayer.showChatMsg(text);
            game.Audio.playGamePhrase(content, player.sex);
        }
    },

    /**
     * 玩家礼品 (互动表情)
     * @param msg
     * @private
     */
    __NET_onPlayerSendGift : function (msg) {
        cc.log("==> 玩家互动表情消息:" + JSON.stringify(msg));
        if (msg.result == protocol.ProtoStatus.STATUS_OK) {
            var sourceIndex = msg.sourceIndex;      // 送礼物的玩家索引
            var targetIndex = msg.targetIndex;      // 目标玩家礼物索引
            var giftId = msg.giftId;                // 礼物类别

            var beginPos = this._ui.getPlayer(sourceIndex).getGiftWorldPos();
            var endPos = this._ui.getPlayer(targetIndex).getGiftWorldPos();
            GameGift.playGiftEffect(this._ui, beginPos, endPos, giftId);
        }

    },

    /**
     * 换桌
     * @param msg
     */
    __NET_onChangeTable : function (msg) {
        cc.log("游戏换桌消息 " + JSON.stringify(msg));
        if (msg.result != protocol.ProtoStatus.STATUS_OK) {
            game.ui.TipWindow.popup({
                tipStr : "Seer不足，请充值！\n您所携带的Seer数量必须符合准入限制"
            }, function (win) {
                game.UISystem.closePopupWindow(win);
                game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {uid : game.DataKernel.uid, roomId : game.DataKernel.roomId});
            });
        }
    }
});
