/**
 * Author       : lyndon
 * Date         : 2018-07-26
 * Description  : 房卡场流程
 */
game.procedure.RoomCard = {
    _ui             : null,         // 主界面UI

    _gameType       : 3,            // 当前游戏类型的值
    _lastJoinTime   : 0,            // 上次发送进入房间消息的时间

    // ==== 流程处理 =========================================================================
    enter : function () {
        cc.log("==> 进入房卡模式流程");

        // 绑定安卓返回按键函数
        game.Procedure.onAndroidReturnClicked(this._BTN_AndroidReturnCallback.bind(this));

        game.UISystem.hideLoading();

        game.Audio.playHomeBGMusic();

        if (this._ui == null) {
            this._ui = new game.ui.RoomCardWindow();
        }

        game.UISystem.switchUI(this._ui);


        this._ui.onBackBtnClick(this._BTN_Exit.bind(this));
        this._ui.onJoinBtnClick(this._BTN_Join.bind(this));
        this._ui.onCreateBtnClick(this._BTN_Create.bind(this));
        this._ui.onRankBtnClick(this._BTN_Rank.bind(this));
        this._ui.onMallBtnClick(this._BTN_Mall.bind(this));
        this._ui.onHelpBtnClick(this._BTN_Help.bind(this));

        this._ui.playEnterAnimation();
        this.updateInfo();
    },

    leave : function () {
        cc.log("==> 离开房间列表流程");
    },

    update : function (dt) {

    },


    // ==== 按钮点击回调函数 =======================================================================

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
     * 加入房间按钮
     * @private
     */
    _BTN_Join: function () {
        cc.log("加入按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.JoinWindow.popup();
    },
    /**
     * 创建房间按钮
     * @private
     */
    _BTN_Create: function () {
        cc.log("创建房间按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_CREATE_ROOM, {
                gameType: GameTypeConfig.type.XQ,
                subType: 1,
                opts: {},
                round: 0
        });
    },
    /**
     * 帮助按钮
     * @private
     */
    _BTN_Help: function () {
        cc.log("帮助按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.HelpWin.popup(this._gameType);
    },
    /**
     * 战绩按钮
     * @private
     */
    _BTN_Rank: function () {
        cc.log("战绩按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.ChessReportWin.popup();
    },
    /**
     * 退出按钮
     * @private
     */
    _BTN_Exit: function () {
        cc.log("退出按钮被点击!");
        game.Audio.playBtnClickEffect();
        this.__exitRoomCard();
    },
    /**
     * 商城按钮
     * @private
     */
    _BTN_Mall: function () {
        cc.log("商城按钮被点击!");
        game.Audio.playBtnClickEffect();
        game.ui.MallWin.popup();
    },

    // ==== 逻辑函数 ==========================================================================

    /**
     * 获取UI界面
     */
    getUIWindow: function () {
        return this._ui;
    },
    /**
     * 刷新界面信息
     */
    updateInfo: function () {
        this._ui.setBean(game.DataKernel.bean);
    },
    /**
     * 退出房间列表
     * @private
     */
    __exitRoomCard: function () {
        game.Procedure.switch(game.procedure.Home);
    }

};