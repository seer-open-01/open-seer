/**
 * Created by lyndon on 2018/05/15.
 */
// 拼十游戏UI
var GameWindowPinShi = GameWindowBasic.extend({

    _roomMenuNode           : null,             // 房间功能控件节点
    _roomMenu               : null,             // 房间功能控件

    _sysInfoNode            : null,             // 系统信息控件节点
    _sysInfo                : null,             // 系统信息控件

    _dealCardsAniNode       : null,             // 发牌动画节点
    _dealCardsAnimation     : null,             // 发牌动画

    _btnPattern             : null,             // 牌型按钮
    _imgWait                : null,             // 等待其他玩家

    _playersNode            : [],               // 玩家节点
    _players                : [],               // 玩家

    _preBeginNode           : null,             // 准备控件节点
    _preBegin               : null,             // 准备控件

    _roomInfoNode           : null,             // 房间信息控件节点
    _roomInfo               : null,             // 房间信息

    _robDealerNode          : null,             // 抢庄按钮控件节点
    _robDealer              : null,             // 抢庄按钮控件

    _robEffectNode          : null,             // 抢庄动画节点
    _robEffect              : null,             // 抢庄动画控件

    _addAnteNode            : null,             // 下注按钮控件节点
    _addAnte                : null,             // 下注按钮控件

    _tableTipNode           : null,             // 桌面消息提示节点
    _tableTip               : null,             // 桌面提示控件

    _clockNode              : null,             // 倒计时闹钟节点
    _clock                  : null,             // 闹钟

    _btnShowCards           : null,             // 亮牌按钮
    _btnExit                : null,             // 退出按钮
    _roundId                : null,             // 牌局号
    _roomId                 : null,             // 房间号
    _enter                  : null,             // 准入
    // _ndTest1            : null,
    // _ndTest2            : null,


    ctor: function (param) {
        this._super("res/Games/PinShi/PinShiWindow.json");
        return true;
    },

    initUI: function () {
        this._super();

        // 房间功能菜单
        this._roomMenuNode = game.findUI(this._node, "ND_RoomMenu");
        this._roomMenu = GameRoomBtnCtrl.getController();
        this._roomMenu.hideTrust();
        this._roomMenu.hideBank();
        this._roomMenu.addToNode(this._node, this._roomMenuNode.getPosition());

        this._btnPattern = game.findUI(this._node, "BTN_Pattern");
        this._imgWait = game.findUI(this._node, "ND_WaitOther");
        this._imgWait.setVisible(false);

        this._sysInfoNode = game.findUI(this._node, "ND_SysInfo");
        this._sysInfo = GameWindowBasic.GameSystemInfo.getController();
        this._sysInfo.addToNode(this._node, this._sysInfoNode.getPosition());
        this._sysInfo.show(true);

        this._dealCardsAniNode = game.findUI(this._node, "ND_DealCardsAni");
        this._dealCardsAnimation = null;

        // 玩家UI信息
        this._playersNode = [];
        this._players = [];
        for (var i = 1; i <= 6; ++i) {
            this._playersNode.push(game.findUI(this._node, "ND_Player_" + i));
        }

        this._preBeginNode = game.findUI(this._node, "ND_PreBegin");
        this._preBegin = null;
        this._roomInfoNode = game.findUI(this._node, "ND_RoomInfo");
        this._roomInfo = null;
        this._robDealerNode = game.findUI(this._node, "ND_RobDealer");
        this._robDealer = null;
        this._addAnteNode = game.findUI(this._node, "ND_AddAnte");
        this._addAnte = null;
        this._robEffectNode = game.findUI(this._node, "ND_RobEffect");
        this._robEffect = null;
        this._tableTipNode = game.findUI(this._node, "ND_TableTip");
        this._tableTip = null;
        this._clockNode = game.findUI(this._node, "ND_Clock");
        this._clock = null;
        this._btnShowCards = game.findUI(this._node, "BTN_ShowCards");
        this._btnShowCards.setVisible(false);

        this._roundId = game.findUI(this._node, "Label_RoundID");
        this._roomId = game.findUI(this._node, "Label_RoomID");
        this._enter = game.findUI(this._node, "Label_Enter");
        this._btnExit = game.findUI(this._node, "Btn_ExitGame");

        // var handCards = new GameWindowPinShi.HandCards(game.findUI(this._node, "ND_CardTest"));
        // handCards.setCardsValue([101, 206, 111, 212, 213]);

        // var handCards = new GameWindowPinShi.OtherCards(game.findUI(this._node, "ND_CardTest"));
        // handCards.setCardsValue([101, 206, 111, 212, 213]);

        // this._ndTest1 = game.findUI(this._node, "ND_Player_1");
        // this._ndTest2 = game.findUI(this._node, "ND_Player_2");
        // this._btnShowCards.setVisible(true);

    },
    /**
     * 获取玩家信息
     * @param index
     * @return {null}
     */
    getPlayer: function (index) {
        if (index < 1 || index > 6) {
            return null;
        }
        var gameData = game.procedure.PinShi.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        if (!this._players[diff]) {
            if (diff < 1) {
                this._players[diff] = new GameWindowPinShi.Player(diff + 1, this._playersNode[diff]);
            } else {
                this._players[diff] = new GameWindowPinShi.PlayerOther(diff + 1, this._playersNode[diff]);
            }
            this._players[diff].reset();
        }

        return this._players[diff];
    },
    /**
     * 获取游戏开始前按钮控制对象
     * @return {null}
     */
    getPreBegin: function () {
        if (this._preBegin == null) {
            this._preBegin = new GameWindowPinShi.PreBegin(this._preBeginNode);
            this._preBegin.reset();
        }
        return this._preBegin;
    },
    /**
     * 获取房间信息对象
     * @return {null}
     */
    getRoomInfo: function () {
        if (this._roomInfo == null) {
            this._roomInfo = new GameWindowPinShi.RoomInfo(this._roomInfoNode);
            this._roomInfo.reset();
        }
        return this._roomInfo;
    },
    /**
     * 获取倒计时时钟
     * @returns {null}
     */
    getClock: function () {
        if (this._clock == null) {
            this._clock = new GameWindowPinShi.Clock(this._clockNode);
            this._clock.reset();
        }

        return this._clock;
    },
    /**
     * 获取抢庄控件
     * @return {null}
     */
    getRobDealer: function () {
        if (this._robDealer == null) {
            this._robDealer = new GameWindowPinShi.RobDealer(this._robDealerNode);
            this._robDealer.reset();
        }
        return this._robDealer;
    },
    /**
     * 获取抢庄动画面板
     * @returns {null}
     */
    getRobEffect: function () {
        if (this._robEffect == null) {
            this._robEffect = new GameWindowPinShi.RobEffectPanel(this._robEffectNode);
            this._robEffect.reset();
        }
        return this._robEffect;
    },
    /**
     * 获取下注控件
     * @return {null}
     */
    getAddAnte: function () {
        if (this._addAnte == null) {
            this._addAnte = new GameWindowPinShi.AddAnte(this._addAnteNode);
            this._addAnte.reset();
        }
        return this._addAnte;
    },
    /**
     * 获取桌面消息提示控件
     * @returns {null}
     */
    getTableTip: function () {
        if (this._tableTip == null) {
            this._tableTip = new GameWindowPinShi.TableTip(this._tableTipNode);
            this._tableTip.reset();
        }

        return this._tableTip;
    },
    /**
     * 获取发牌动画控件
     * @return {null}
     */
    getPlayCardsAnimation: function () {
        if (this._dealCardsAnimation == null) {
            this._dealCardsAnimation = new GameWindowPinShi.PlayCardsAnimation(this._dealCardsAniNode);
            this._dealCardsAnimation.reset();
        }
        return this._dealCardsAnimation;
    },
    /**
     * 获取房间按钮控件
     * @return {null}
     */
    getRoomBtnCtrl: function () {
        return this._roomMenu;
    },
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
     * 房间牌型按钮被点击
     * @param callback
     */
    onGamePattenClick: function (callback) {
        this._btnPattern.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    /**
     * 亮牌按钮被点击
     * @param callback
     */
    onShowCardsClick: function (callback) {
        this._btnShowCards.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
                sender.setVisible(false);
                // PinShiAnimation.playFlyShell(this._ndTest1, this._ndTest1.getPosition(),
                // this._ndTest2.getPosition());
            }
        }, this);
    },
    /**
     * 显示亮牌按钮
     * @param bool
     */
    showBtnShowCards: function (bool) {
        this._btnShowCards.setVisible(bool);
    },
    /**
     * 显示等待其他玩家的文字
     * @param bool
     */
    showWait: function (bool) {
        this._imgWait.setVisible(bool);
    },
    /**
     * 设置庄家图标
     * @param index
     */
    setDealer: function (index) {
        this._players.forEach(function (uiPlayer) {
            uiPlayer.setDealer(index);
        });
    },
    /**
     * 隐藏所有玩家抢庄倍数提示
     */
    hideRobTip: function () {
        this._players.forEach(function (player) {
            player.showRobTip(-1);
        })
    },
    /**
     * 隐藏所有玩家的已准备图标
     */
    hideReady: function () {
        this._players.forEach(function (uiPlayer) {
            uiPlayer.showReady(false);
        });
    },
    /**
     * 开启系统信息更新
     */
    openUpdateSystem: function () {
        this._sysInfo && this._sysInfo.openUpdate();
    },

    /**
     * 关闭系统信息更新
     */
    closeUpdateSystem: function () {
        this._sysInfo && this._sysInfo.closeUpdate();
    },
    /**
     * 设置房间的牌局号 (用于子类重写,有牌局号的一定要重写，没有则不管)
     * @param roundID
     */
    setRoomRoundID: function (roundID) {
        cc.log("牌局号是:" + roundID);
        if (roundID == -1) {
            this._roundId.setVisible(false);
            return;
        }
        this._roundId.setString("牌局号：" + roundID);
        this._roundId.setVisible(true);
    },
    /**
     * 设置房间号
     * @param roomId
     */
    setRoomID: function (roomId) {
        if (roomId == -1) {
            this._roomId.setVisible(false);
            return;
        }
        this._roomId.setString("房间号：" + roomId);
        this._roomId.setVisible(true);
    },
    /**
     * 设置准入
     */
    setEnter : function (enterBean) {
        cc.log("准入:" + enterBean);
        if (enterBean == -1) {
            this._enter.setVisible(false);
            return;
        }
        var enter = Utils.formatCoin2(enterBean);
        this._enter.setString("准入:" + enter);
        this._enter.setVisible(true);
    },
});