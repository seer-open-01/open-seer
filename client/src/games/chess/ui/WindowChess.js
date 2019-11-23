/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋游戏界面
 */
var WindowChess = GameWindowBasic.extend({

    _chessBoard         : null,             // 棋盘对象
    _players            : null,             // 玩家
    _prepare            : null,             // 准备按钮

    _roomMenuNode       : null,             // 房间菜单节点
    _roomMenu           : null,             // 房间菜单

    _tableTipNode       : null,             // 桌面消息提示节点
    _tableTip           : null,             // 桌面消息控件

    _baseNode           : null,             // 设置学费控件节点
    _fntBase            : null,             // 学费
    _btnSetBase         : null,             // 设置底分
    _btnGiveUp          : null,             // 认输

    _labelRid           : null,             // 房间号
    _btnExit            : null,             // 退出按钮
    _btnInvite          : null,             // 邀请按钮

    ctor : function (parame) {
        this._super("res/Games/Chess/ChessWindow.json");
        return true;
    },

    initUI: function () {
        this._super();

        this._chessBoard = new WindowChess.ChessBoard(game.findUI(this._node, "Bg_Chess"));
        this._prepare = new WindowChess.Prepare(game.findUI(this._node, "ND_Prepare"));

        this._players = [];
        for (var i = 1; i <= 2; ++i) {
            var player = new WindowChess.Player(game.findUI(this._node, "Player_" + i), i);
            player.reset();
            this._players.push(player);
        }

        this._labelRid = game.findUI(this._node, "Label_Rid");
        this._btnExit = game.findUI(this._node, "Btn_Exit");
        this._btnGiveUp = game.findUI(this._node, "Btn_GiveUp");
        this._btnInvite = game.findUI(this._node, "Btn_Invite");

        this._baseNode = game.findUI(this._node, "ND_SetBase");
        this._fntBase = game.findUI(this._baseNode, "Fnt_Base");
        this._fntBase.setString("0");
        this._btnSetBase = game.findUI(this._baseNode, "Btn_SetBase");
        var btnHelp = game.findUI(this._baseNode, "Btn_Help");
        btnHelp.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.ui.TipWindow.popup({
                    tipStr: " 学费设置范围必须为账户Seer数额减去20000的部分才能生效 "
                },function (win) {
                    game.UISystem.closePopupWindow(win);
                });
            }
        }, this);

        this._tableTipNode = game.findUI(this._node, "ND_TableTip");

        // 房间按钮控件
        this._roomMenuNode = game.findUI(this._node, "ND_RoomMenu");
        this._roomMenu = GameRoomBtnCtrl.getController();
        this._roomMenu.addToNodeWithLocalPosition(this._roomMenuNode);
        this._roomMenu.hideTrust();

        // 系统信息
        this._sysInfoNode = game.findUI(this._node, "ND_SysInfo");
        this._sysInfo = GameWindowBasic.GameSystemInfo.getController();
        this._sysInfo.addToNode(this._node, this._sysInfoNode.getPosition());

        this.showSetBase(false);
        // this._baseNode.setVisible(false);
    },

    /**
     * 获取玩家
     * @param index
     */
    getPlayer: function (index) {
        var gameData = game.procedure.Chess.getGameData();
        var diff = index == gameData.playerIndex ? 0 : 1;
        return this._players[diff];
    },

    /**
     * 获取棋盘
     * @returns {null}
     */
    getBoard: function () {
        return this._chessBoard;
    },

    /**
     * 获取准备节点
     * @returns {null}
     */
    getPrepare: function () {
        return this._prepare;
    },

    /**
     * 桌面提示消息控件
     * @returns {null}
     */
    getTableTip: function () {

        if (!this._tableTip) {
            this._tableTip = new WindowChess.TableTip(this._tableTipNode);
            this._tableTip.reset();
        }

        return this._tableTip;
    },

    /**
     * 获取房间按钮控件
     * @return {null}
     */
    getRoomBtnCtrl : function () {
        return this._roomMenu;
    },
    //==== 按钮点击 ==================================================
    /**
     * 退出游戏按钮
     * @param callback
     */
    onExitGameClicked: function (callback) {
        this._btnExit.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 认输按钮
     * @param callback
     */
    onGiveUpClicked: function (callback) {
        this._btnGiveUp.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 设置底分按钮
     * @param callback
     */
    onSetBaseClicked: function (callback) {
        this._btnSetBase.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 邀请按钮
     * @param callback
     */
    onInviteClicked: function (callback) {
        this._btnInvite.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    //==== 逻辑函数 ==================================================
    /**
     * 设置房间Id
     * @param rid
     */
    setRoomId: function (rid) {
        cc.log("设置房间号==> " + rid);
        this._labelRid.setString("房号:" + rid);
    },

    /**
     * 隐藏准备
     */
    hideReady: function () {
        this._players.forEach(function (player) {
            player.showReady(false);
        })
    },

    /**
     * 隐藏阵营标签
     */
    hideCamp: function () {
        this._players.forEach(function (player) {
            player.setCamp(-1);
        })
    },
    /**
     * 显示设置底分按钮
     * @param show
     */
    showSetBase: function (show) {
        this._btnSetBase.setVisible(show);
        this._btnSetBase.setEnabled(show);
    },

    /**
     * 显示认输按钮
     * @param show
     */
    showGiveUp: function (show) {
        this._btnGiveUp.setEnabled(show);
        this._btnGiveUp.setVisible(show);
    },

    /**
     * 显示邀请按钮
     * @param show
     */
    showInvite: function (show) {
        this._btnInvite.setVisible(show);
        this._btnInvite.setEnabled(show);
    },
    /**
     * 设置底分
     * @param value
     */
    setBase: function (value) {
        value = Utils.formatCoin(value);
        this._fntBase.setString("" + value);
    },

    /**
     * 开启更新系统信息 (必须重写)
     */
    openUpdateSystem: function () {
        if (this._sysInfo) {
            this._sysInfo.openUpdate();
            this._sysInfo.show(true)
        }
    },

    /**
     * 关闭更新系统信息 (必须重写)
     */
    closeUpdateSystem: function () {
        this._sysInfo && this._sysInfo.closeUpdate();
    }
});