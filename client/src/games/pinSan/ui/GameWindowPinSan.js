/**
 * Created by Jiyou Mo on 2017/11/24.
 */
// 拼三张游戏窗口
var GameWindowPinSan = GameWindowBasic.extend({


    _playersNode        : [],               // 玩家节点
    _players            : [],               // 玩家

    _roomMenuNode       : null,             // 房间功能控件节点
    _roomMenu           : null,             // 房间功能控件

    _sysInfoNode        : null,             // 系统信息控件节点
    _sysInfo            : null,             // 系统信息控件

    _preBeginNode       : null,             // 准备控件节点
    _preBegin           : null,             // 准备控件

    _dealCardsAniNode   : null,             // 发牌动画节点
    _dealCardsAnimation : null,             // 发牌动画

    _playBtnNode        : null,             // 操作按钮节点
    _playBtn            : null,             // 操作按钮

    _fillPanelNode      : null,             // 加注面板节点
    _fillPanel          : null,             // 加注面板

    _chipsPanelNode     : null,             // 筹码节点
    _chipsPanel         : null,             // 筹码界面控件

    _comparePanelNode   : null,             // 比牌选择界面节点
    _comparePanel       : null,             // 比牌选择界面

    _roomInfoNode       : null,             // 房间信息节点控件
    _roomInfo           : null,             // 房间信息

    _btnPattern         : null,             // 牌型按钮
    _imgWait            : null,             // 等待其他玩家


    _imgWaring          : null,             // 倒计时警告
    _isWaring           : false,            // 是否在播放警告动画

    _btnExit            : null,             // 退出按钮
    _roundId            : null,             // 牌局号
    _roomId             : null,             // 房间号
    _enter              : null,             // 准入

    _biMen              : null,             // 必闷三轮的提示
    _menTurn            : null,             // 当前闷的轮数



    ctor : function (parame) {
        this._super("res/Games/PinSan/PinSanWindow.json");
        return true;
    },

    initUI : function () {
        this._super();

        // 玩家UI信息
        this._playersNode = [];
        this._players = [];
        for (var i = 1; i <= 6; ++i) {
            this._playersNode.push(game.findUI(this._node, "ND_Player_" + i));
        }
        // 房间功能菜单
        this._roomMenuNode = game.findUI(this._node, "ND_RoomMenu");
        this._roomMenu = GameRoomBtnCtrl.getController();
        this._roomMenu.hideTrust();
        this._roomMenu.addToNode(this._node, this._roomMenuNode.getPosition());

        this._sysInfoNode = game.findUI(this._node, "ND_SysInfo");
        this._sysInfo = GameWindowBasic.GameSystemInfo.getController();
        this._sysInfo.addToNode(this._node, this._sysInfoNode.getPosition());
        this._sysInfo.show(true);

        this._preBeginNode = game.findUI(this._node, "ND_PreBegin");
        this._preBegin = null;
        this._dealCardsAniNode = game.findUI(this._node, "ND_DealCardsAni");
        this._dealCardsAnimation = null;
        this._playBtnNode = game.findUI(this._node, "ND_PlayBtn");
        this._playBtn = null;
        this._fillPanelNode = game.findUI(this._node, "ND_AddAntePanel");
        this._fillPanel = null;
        this._chipsPanelNode = game.findUI(this._node, "ND_ChipsPanel");
        this._chipsPanel = null;
        this._comparePanelNode = game.findUI(this._node, "ND_ComparePanel");
        this._comparePanel = null;
        this._roomInfoNode = game.findUI(this._node, "ND_RoomInfo");
        this._roomInfo = null;

        this._btnPattern = game.findUI(this._node, "BTN_Pattern");

        this._roundId = game.findUI(this._node, "Label_RoundID");
        this._roomId = game.findUI(this._node, "Label_RoomID");
        this._enter = game.findUI(this._node, "Label_Enter");
        this._imgWait = game.findUI(this._node, "ND_WaitOther");
        this._imgWait.setVisible(false);

        this._imgWaring = game.findUI(this._node, "ND_Waring");
        this._imgWaring.setVisible(false);
        this._isWaring = false;

        this._btnExit = game.findUI(this._node, "Btn_ExitGame");

        this._biMen = game.findUI(this._node, "ND_BiMen");
        this._menTurn = game.findUI(this._biMen, "turn");
        this._biMen.setVisible(false);
    },

    /**
     * 获取玩家信息
     * @param index
     * @return {null}
     */
    getPlayer : function (index) {
        if (index < 1 || index > 6) {
            return null;
        }
        var gameData = game.procedure.PinSan.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        if (!this._players[diff]) {
            if (diff < 1) {
                this._players[diff] = new GameWindowPinSan.Player(diff + 1, this._playersNode[diff]);
            } else {
                this._players[diff] = new GameWindowPinSan.PlayerOther(diff + 1, this._playersNode[diff]);
            }
            this._players[diff].reset();
        }

        return this._players[diff];
    },

    /**
     * 隐藏所有玩家的已准备图标
     */
    hideReady : function () {
        this._players.forEach(function (uiPlayer) {
            uiPlayer.showReady(false);
        });
    },

    /**
     * 设置庄家图标
     * @param index
     */
    setDealer : function (index) {
        this._players.forEach(function (uiPlayer) {
            uiPlayer.setDealer(index);
        });
    },
    /**
     * 获取房间按钮控件
     * @return {null}
     */
    getRoomBtnCtrl : function () {
        return this._roomMenu;
    },

    /**
     * 获取房间信息对象
     * @return {null}
     */
    getRoomInfo : function () {
        if (this._roomInfo == null) {
            this._roomInfo = new GameWindowPinSan.RoomInfo(this._roomInfoNode);
        }
        return this._roomInfo;
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
     * 获取游戏开始前按钮控制对象
     * @return {null}
     */
    getPreBegin : function () {
        if (this._preBegin == null) {
            this._preBegin = new GameWindowPinSan.PreBegin(this._preBeginNode);
            this._preBegin.reset();
        }
        return this._preBegin;
    },

    /**
     * 获取操作按钮
     * @return {null}
     */
    getPlayBtn : function () {
        if (this._playBtn == null) {
            this._playBtn = new GameWindowPinSan.PlayBtn(this._playBtnNode);
            this._playBtn.reset();
        }
        return this._playBtn;
    },

    /**
     * 获取加注操作面板
     * @return {null}
     */
    getFillPanel : function () {
        if (this._fillPanel == null) {
            this._fillPanel = new GameWindowPinSan.FillPanel(this._fillPanelNode);
            this._fillPanel.reset();
        }
        return this._fillPanel;
    },

    /**
     * 获取比牌面板
     * @return {null}
     */
    getComparePanel : function () {
        if (this._comparePanel == null) {
            this._comparePanel = new GameWindowPinSan.ComparePanel(this._comparePanelNode);
            this._comparePanel.reset();
        }
        return this._comparePanel;
    },

    /**
     * 获取筹码面板
     * @return {null}
     */
    getChipsPanel : function () {
        if (this._chipsPanel == null) {
            this._chipsPanel = new GameWindowPinSan.ChipsPanel(this._chipsPanelNode);
            this._chipsPanel.reset();
        }
        return this._chipsPanel;
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
     * 房间规则按钮被点击
     * @param callback
     */
    onGameRuleClick : function (callback) {
        this._btnRule.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 房间牌型按钮被点击
     * @param callback
     */
    onGamePattenClick : function (callback) {
        this._btnPattern.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 房间保险箱按钮被点击
     * @param callback
     */
    onGameStrongboxClick : function (callback) {
        this._btnStrongbox.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },
    /**
     * 获取发牌动画控件
     * @return {null}
     */
    getPlayCardsAnimation : function () {
        if (this._dealCardsAnimation == null) {
            this._dealCardsAnimation = new GameWindowPinSan.PlayCardsAnimation(this._dealCardsAniNode);
            this._dealCardsAnimation.reset();
        }
        return this._dealCardsAnimation;
    },

    /**
     * 显示等待其他玩家的文字
     * @param bool
     */
    showWait : function (bool) {
        this._imgWait.setVisible(bool);
    },
    /**
     * 开始警告动画
     */
    startWaring: function () {
        if (!this._isWaring) {
            this._isWaring = true;
            this._imgWaring.setVisible(true);
            var doFade1 = cc.FadeOut(1.0).easing(cc.easeOut(1.0));
            var doFade2 = cc.FadeIn(0.5).easing(cc.easeIn(0.5));
            this._imgWaring.runAction(cc.Sequence(doFade2, doFade1).repeatForever());
        }
    },
    /**
     * 结束警告动画
     */
    stopWaring: function () {
        if (this._isWaring) {
            this._isWaring = false;
            this._imgWaring.setVisible(false);
            this._imgWaring.stopAllActions();
        }
    },
    /**
     * 开启系统信息更新
     */
    openUpdateSystem : function () {
        this._sysInfo && this._sysInfo.openUpdate();
    },

    /**
     * 关闭系统信息更新
     */
    closeUpdateSystem : function () {
        this._sysInfo && this._sysInfo.closeUpdate();
    },
    /**
     * 设置房间的牌局号 (用于子类重写,有牌局号的一定要重写，没有则不管)
     * @param roundID
     */
    setRoomRoundID : function (roundID) {
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
     * @param roomID
     */
    setRoomID : function (roomID) {
        cc.log("房间号是:" + roomID);
        if (roomID == -1) {
            this._roomId.setVisible(false);
            return;
        }
        this._roomId.setString("房间号：" + roomID);
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
    /**
     * 更新必闷轮数
     * @param turn
     */
    updateMenTurn: function (turn) {
        if (turn > 3 || turn <= 0) {
            cc.log("非法参数！！");
            return;
        }
        var path = "res/Games/PinSan/Image/BiMen_" + turn + ".png";
        this._menTurn.setTexture(path);
        this._biMen.setVisible(true);
    },
    /**
     * 显示必闷三轮提示
     */
    showBiMen: function (show) {
        this._biMen.setVisible(show);
    }
});
