/**
 * 麻将游戏  四人麻将UI
 */
var GameWindowMahjong = GameWindowBasic.extend({

    _playersNode        : [],           // 玩家信息节点
    _players            : [],           // 玩家信息UI

    _roomMenuNode       : null,         // 房间按钮节点
    _roomMenu           : null,         // 房间按钮控件

    _publicCardsNode    : null,         // 公牌控件节点
    _publicCards        : null,         // 公牌控件

    _directionNode      : null,         // 出牌玩家计时器节点
    _direction          : null,         // 出牌玩家计时器控件

    _hangupTasksNode    : null,         // 挂起任务节点
    _hangupTasks        : null,         // 挂起任务控件

    _multipleNode       : null,         // 上噶控件节点
    _multiple           : null,         // 上噶控件

    _baseScoreNode      : null,         // 底分控件节点
    _baseScore          : null,         // 底分控件

    _directionOrderNode : null,         // 风令节点
    _directionOrder     : null,         // 风令控件

    _confirmPanelNode   : null,
    _confirmPanel       : null,         // 确定换三张界面
    _huanPanelNode      : null,
    _huanPanel          : null,         // 换牌提示界面
    _dqSelect           : null,         // 定缺按钮
    _hpInfo             : null,         // 换牌信息面板

    _matchWindow        : null,         // 匹配窗口控件

    _huTipNode          : null,         // 胡牌提示窗口节点
    _huTip              : null,         // 胡牌提示

    _btnTrusteeshipCancel : null,       // 取消托管按钮

    _btnExit            : null,         // 退出按钮

    _roundId            : null,         // 牌局号
    _round              : null,         // 当前对局 房卡场用

    _preBegin           : null,         // 准备控件
    _btnBill            : null,         // 对局流水按钮
    _btnTip             : null,         // 胡牌提示按钮
    _btnInfo            : null,         // 换牌信息
    _btnNext            : null,         // 下一局按钮

    _imgEnd             : null,         // 牌局结束提示

    ctor : function () {
        this._super("res/Games/Mahjong/MahjongWindow.json");
        return true;
    },
    
    initUI : function () {
        this._super();
        var gameData = game.procedure.Mahjong.getGameData();
        var winSize = cc.director.getWinSize();

        // 玩家个人信息UI节点
        this._playersNode = [];
        this._players = [];
        for (var i = 1; i <= 4; ++i) {
            this._playersNode.push(game.findUI(this._node, "ND_Player_" + i));
        }

        // 游戏中的系统信息
        var nd_systemInfo = game.findUI(this._node, "ND_SystemInfo");
        this._systemInfo = GameWindowBasic.GameSystemInfo.getController();
        this._systemInfo.addToNode(this._node,
            nd_systemInfo ? game.UIHelper.getWorldPosition(nd_systemInfo) : cc.p(winSize.width - 80, winSize.height - 20));
        this._systemInfo.show(true);

        // 房间按钮
        this._roomMenuNode = game.findUI(this._node, "ND_RoomMenu");
        this._roomMenu = GameRoomBtnCtrl.getController();
        this._roomMenu.hideBank();
        // this._roomMenu.addToNode(this._node, this._roomMenuNode.getPosition());
        this._roomMenu.addToNodeWithLocalPosition(this._roomMenuNode);

        // 公牌控件
        this._publicCardsNode = game.findUI(this._node, "ND_PublicCards");
        this._publicCards = null;

        // 出牌玩家计时器
        this._directionNode = game.findUI(this._node, "ND_Direction");
        this._direction = new GameWindowMahjong.Direction(this._directionNode);
        this._direction.setMainPlayerIndex(gameData.playerIndex);
        this._direction.reset();

        // 挂起任务
        this._hangupTasksNode = game.findUI(this._node, "ND_HangupTasks");
        this._hangupTasks = null;

        // 上噶控件
        this._multipleNode = game.findUI(this._node, "ND_Multiple");
        this._multiple = null;

        // 底分控件
        this._baseScoreNode = game.findUI(this._node, "ND_BaseScore");
        this._baseScore = null;

        // 风令显示控件
        this._directionOrderNode = game.findUI(this._node, "ND_DirectionOrder");
        this._directionOrder = null;

        // 胡牌提示
        this._huTipNode = game.findUI(this._node, "ND_HuTipNode");
        if (this._huTip == null) {
            this._huTip = new GameWindowMahjong.HuTipWindow(this._huTipNode);
            this._huTip.reset();
        }

        this._btnTrusteeshipCancel = game.findUI(this._node, "ND_TrusteeshipCancel");
        this._btnExit = game.findUI(this._node, "Btn_ExitGame");
        this._btnBill = game.findUI(this._node, "Btn_Bill");
        this._btnTip = game.findUI(this._node, "Btn_Tip");
        this._btnInfo = game.findUI(this._node, "Btn_Info");
        this._btnNext = game.findUI(this._node, "BTN_Next");
        this._btnBill.setVisible(gameData.gameType == 8);// 成都麻将显示对局流水按钮
        this._btnTip.setVisible(gameData.gameType == 8);// 成都麻将显示胡牌提示按钮
        this._btnInfo.setVisible(gameData.gameType == 8);
        this.showNext(false);
        this._roundId = game.findUI(this._node, "Label_RoundID");
        this._round = game.findUI(this._node, "Label_Round");
        this._round.setVisible(false);
        this._imgEnd = game.findUI(this._node, "IMG_End");

        this._preBegin = null;

        this._confirmPanelNode = game.findUI(this._node, "ND_Change");
        this._confirmPanel = null;
        this._huanPanelNode = game.findUI(this._node, "ND_Huan");
        this._huanPanel = null;
        this._dqSelect = null;
        this._hpInfo = null;

        var btnCheat = game.findUI(this._node, "Btn_Cheat");
        btnCheat.setVisible(game.config.GM_ON);
        btnCheat.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.gameNet.sendMessage(protocol.ProtoID.CHEAT_GET_CARDS, {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId
                });
            }
        }, this);
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
    // 对局流水点击
    onBillClicked: function (callback) {
        this._btnBill.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    // 胡牌提示点击
    onTipClicked: function (callback) {
        this._btnTip.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                callback && callback();
            }
        }, this);
    },
    // 换牌提示点击
    onHPClicked: function (callback) {
        this._btnInfo.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    // 下一局
    onNextClicked: function (callback) {
        this._btnNext.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    /**
     * 获取玩家UI
     * @param index
     * @returns {*}
     */
    getPlayer : function (index) {
        if (index < 1 || index > 4) {
            return null;
        }
        var gameData = game.procedure.Mahjong.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        if (!this._players[diff]) {
            this._players[diff] = new GameWindowMahjong.Player(diff + 1, this._playersNode[diff]);
            this._players[diff].reset();
        }

        return this._players[diff];
    },
    /**
     * 隐藏选牌状态
     */
    hideStatus: function () {
        this._players && this._players.forEach(function (uiPlayer) {
            uiPlayer.setStatus(-1);
        });
    },
    /**
     * 开启更新系统信息
     */
    openUpdateSystem : function () {
        this._systemInfo.openUpdate();
    },

    /**
     * 关闭更新系统信息
     */
    closeUpdateSystem : function () {
        this._systemInfo.closeUpdate();
    },

    /**
     * 设置牌局号 或 房间号
     */
    setRoomRoundID : function (idString) {
        cc.log("牌局号是:" + idString);
        if (idString == -1) {
            this._roundId.setVisible(false);
            return;
        }
        this._roundId.setString(idString);
        this._roundId.setVisible(true);
    },

    /**
     * 设置当前对局数 仅房卡场用
     */
    setCurRound: function (str) {
        this._round.setString(str);
    },

    /**
     * 显示当前对局信息
     * @param show
     */
    showCurRound: function (show) {
        this._round.setVisible(show);
    },

    /**
     * 获取房间操作菜单控件
     * @returns {null}
     */
    getRoomMenu : function () {
        return this._roomMenu;
    },

    /**
     * 获取公牌控件
     * @returns {null}
     */
    getPublicCards : function () {
        if (this._publicCards == null) {
            this._publicCards = new GameWindowMahjong.PublicCards(this._publicCardsNode);
            this._publicCards.reset();
        }
        return this._publicCards;
    },

    /**
     * 获取玩家操作指示器
     * @returns {null}
     */
    getDirection : function () {
        return this._direction;
    },

    /**
     * 获取挂起任务事件操作控件
     * @returns {null}
     */
    getHangupTasks : function () {
        if (this._hangupTasks == null) {
            this._hangupTasks = new GameWindowMahjong.HangupTasks(this._hangupTasksNode);
            this._hangupTasks.reset();
        }
        return this._hangupTasks;
    },

    /**
     * 获取挂起任务事件操作控件
     * @returns {null}
     */
    getDQSelect : function () {
        if (this._dqSelect == null) {
            this._dqSelect = new GameWindowMahjong.DQSelect(this._hangupTasksNode);
            this._dqSelect.reset();
        }
        return this._dqSelect;
    },
    /**
     * 获取换牌信息面板控件
     */
    getHPInfo: function () {
        if (this._hpInfo == null) {
            this._hpInfo = new GameWindowMahjong.HuanInfo(this._confirmPanelNode)
            this._hpInfo.reset();
        }
        return this._hpInfo;
    },

    /**
     * 获取上噶控件
     * @returns {null}
     */
    getMultiple : function () {
        if (this._multiple == null) {
            this._multiple = new GameWindowMahjong.Multiple(this._multipleNode);
            this._multiple.reset();
        }
        return this._multiple;
    },
    /**
     * 获取确定换三张的面板
     */
    getConfirmPanel: function () {
        if (this._confirmPanel == null) {
            this._confirmPanel = new GameWindowMahjong.ConfirmPanel(this._confirmPanelNode);
            // this._confirmPanel.reset();
        }
        return this._confirmPanel;
    },
    /**
     * 获取换牌提示的面板
     */
    getHuanPanel: function () {
        if (this._huanPanel == null) {
            this._huanPanel = new GameWindowMahjong.HuanPanel(this._huanPanelNode);
            this._huanPanel.reset();
        }
        return this._huanPanel;
    },
    /**
     * 获取准备按钮控件
     * @returns {null}
     */
    getPreBegin : function () {
        if (this._preBegin == null) {
            this._preBegin = new GameWindowMahjong.PreBegin(this._multipleNode);
            this._preBegin.reset();
        }
        return this._preBegin;
    },

    /**
     * 获取底分控件
     * @returns {null}
     */
    getBaseScore : function () {
        if (this._baseScore == null) {
            this._baseScore = new GameWindowMahjong.BaseScore(this._baseScoreNode);
            this._baseScore.reset();
        }
        return this._baseScore;
    },

    /**
     * 获取风令控件
     * @returns {null}
     */
    getDirectionOrder : function () {
        if (this._directionOrder == null) {
            this._directionOrder = new GameWindowMahjong.DirectionOrder(this._directionOrderNode);
            this._directionOrder.reset();
        }
        return this._directionOrder;
    },

    /**
     * 获取匹配界面窗口
     * @returns {null}
     */
    getMatchWindow : function () {
        if (this._matchWindow == null) {
            this._matchWindow = new GameWindowMahjong.MatchWindow(this._node);
            this._matchWindow.reset();
        }
        return this._matchWindow;
    },
    /**
     * 获取胡牌提示窗口
     * @returns {null}
     */
    getHuTipWindow : function () {
        return this._huTip;
    },

    /**
     * 显示或隐藏取消托管按钮
     * @param bool
     */
    showTrusteeshipCancelBtn : function (bool) {
        this._btnTrusteeshipCancel.setVisible(bool);
    },

    /**
     * 绑定取消托管按钮回调
     * @param callback
     */
    onTrusteeshipCancelBtn : function (callback) {
        this._btnTrusteeshipCancel.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    showBtnTip: function (show) {
        this._btnTip.setVisible(show);
        this._btnTip.setEnabled(show);
    },
    
    showBtnHP: function (show) {
        this._btnInfo.setVisible(show);
        this._btnInfo.setEnabled(show);
    },

    showNext: function (show) {
        this._btnNext.setVisible(show);
        this._btnNext.setEnabled(show);
    },
    
    showEnd:function (type) {
        if (type == -1) {
            this._imgEnd.setVisible(false);
            return;
        }

        var path = "res/Games/Mahjong/Images/IMG_End_" + type + ".png";
        this._imgEnd.setTexture(path);
        this._imgEnd.setVisible(true);
    }
});