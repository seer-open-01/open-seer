/**
 * Created by lyndon on 2018/4/19.
 */
game.procedure.RoomList = {
    _ui             : null,         // 主界面UI
    _gameType       : 8,            // 当前游戏类型的值
    _lastJoinTime   : 0,           // 上次发送进入房间消息的时间

    // ==== 流程处理 =========================================================================
    enter: function () {
        cc.log("==> 进入房间列表流程");

        // 绑定安卓返回按键函数
        game.Procedure.onAndroidReturnClicked(this._BTN_AndroidReturnCallback.bind(this));

        game.UISystem.hideLoading();

        game.Audio.playHomeBGMusic();

        if (this._ui == null) {
            this._ui = new game.ui.RoomListWindow();
        }
        game.UISystem.switchUI(this._ui);

        // 注册按钮点击
        this._ui.onSelectClick(this._BTN_Select.bind(this));
        this._ui.onJoinClick(this._BTN_Join.bind(this));
        this._ui.onBackClick(this._BTN_Exit.bind(this));
        this._ui.onAddClick(this._BTN_Shop.bind(this));
        this._ui.onHelpClick(this._BTN_Help.bind(this));
        this._ui.onEnterClick(this._BTN_Enter.bind(this));
        this._ui.onCreateClick(this._BTN_Create.bind(this));
        this._ui.onRefreshClick(this._BTN_Refresh.bind(this));

        this._ui.playEnterAnimation(null);

        // 在游戏流程重连 切回房间列表要重新拉一次数据
        this._requestRoomListData();
    },

    leave: function () {
        cc.log("==> 离开房间列表流程");
    },

    update: function (dt) {
    },

    // 安卓返回按钮
    _BTN_AndroidReturnCallback: function () {
        if (game.UISystem.isHavePopupWindow()) {
            game.UISystem.closeAnyonePopupWindow();
        } else {
            this._BTN_Exit();
        }
    },

    // 购买按钮
    _BTN_Shop: function () {
        cc.log("购买按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.MallWin.popup();
    },
    // 帮助按钮
    _BTN_Help: function () {
        cc.log("帮助按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.HelpWin.popup(this._gameType);
    },
    // 加入房间按钮
    _BTN_Enter: function () {
        cc.log("加入按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.HallJoinWin.popup();
    },
    // 创建房间按钮
    _BTN_Create: function () {
        cc.log("创建按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.HallCreateWin.popup(this._gameType);
    },
    // 刷新按钮
    _BTN_Refresh: function () {
        cc.log("刷新按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_ROOM_LIST, {gameType: this._gameType});
    },
    // 退出按钮
    _BTN_Exit: function () {
        cc.log("退出按钮被点击!");
        game.Audio.playBtnClickEffect();
        this.__exitRoomList();
    },
    // 选择游戏类型
    _BTN_Select: function (gameType) {
        cc.log("gameType被点击 " + gameType);
        this._gameType = gameType || 1;
        this._ui.hideItems();
        this._ui.playChangeMenuAnimation();
        this._requestRoomListData();

    },
    // 进入游戏
    _BTN_Join: function (matchId) {
        cc.log("进入游戏被点击 " + matchId);
        var now = new Date();
        if (now - this._lastJoinTime < 500) {
            return;
        }
        this._lastJoinTime = now;
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH, {matchId: matchId});
    },
    // 获取UI
    getUIWindow: function () {
        return this._ui;
    },
    // 设置游戏类型
    setSelectGame: function (gameType) {
        this._gameType = gameType;
    },
    // 请求房间列表数据
    _requestRoomListData: function () {
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_MATCH_LIST, {gameType: this._gameType});
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_ROOM_LIST, {gameType: this._gameType});
    },
    // 退出房间列表
    __exitRoomList: function () {
        game.Procedure.switch(game.procedure.Home);
    }

};