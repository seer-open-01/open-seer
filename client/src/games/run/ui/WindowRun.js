/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快UI
 */

var WindowRun = GameWindowBasic.extend({

    _clockNode                  : null,         // 倒计时时间节点
    _clock                      : null,         // 倒计时时间

    _playBtnNode                : null,         // 出牌按钮控件节点
    _playBtn                    : null,         // 出牌按钮控件 提示 不出 出牌

    _tableTipNode               : null,         // 桌面消息提示节点
    _tableTip                   : null,         // 桌面消息提示

    _roomInfoNode               : null,         // 房间信息控件节点
    _roomInfo                   : null,         // 房间信息

    _roomMenuNode               : null,
    _roomMenu                   : null,

    _sysInfoNode                : null,
    _sysInfo                    : null,

    _playersNode                : null,
    _players                    : [],           //玩家

    _matchWindowNode            : null,         // 匹配窗口节点
    _matchWindow                : null,         // 匹配窗口

    _dealCardsNode              : null,         // 发牌动画节点
    _dealCardsCtrl              : null,         // 发牌动画控件

    _roundId                    : null,
    _enter                      : null,
    _imgWait                    : null,         // 等待其他玩家
    _btnExit                    : null,         // 退出按钮
    _btnTuo                     : null,         // 托管按钮

    _round                      : null,         // 当前对局 房卡场用

    ctor : function (parame) {
        this._super("res/Games/Run/RunWindow.json");
        return true;
    },

    initUI: function () {
        this._super();

        // 倒计时
        this._clockNode = game.findUI(this._node, "ND_Clock");
        this._clock = null;

        // 出牌控件
        this._playBtnNode = game.findUI(this._node, "ND_PlayBtn");
        this._playBtn = null;

        // 桌面消息控件
        this._tableTipNode = game.findUI(this._node, "ND_TableTip");
        this._tableTip = null;

        // 房间信息
        this._roomInfoNode = game.findUI(this._node, "ND_RoomInfo");
        this._roomInfo = null;

        // 房间信息
        this._matchWindowNode = game.findUI(this._node, "ND_Match");
        this._matchWindow = null;

        // 房间开始前按钮
        this._preBeginNode = game.findUI(this._node, "ND_PreBegin");
        this._preBegin = null;

        // 房间按钮控件
        this._roomMenuNode = game.findUI(this._node, "ND_RoomMenu");
        this._roomMenu = GameRoomBtnCtrl.getController();
        this._roomMenu.addToNodeWithLocalPosition(this._roomMenuNode);
        this._roomMenu.hideBank();

        // 系统信息
        this._sysInfoNode = game.findUI(this._node, "ND_SysInfo");
        this._sysInfo = GameWindowBasic.GameSystemInfo.getController();
        this._sysInfo.addToNode(this._node, this._sysInfoNode.getPosition());

        // 玩家信息加载
        this._players = [];
        this._playersNode = [];
        var gameData = game.procedure.Run.getGameData();
        if (gameData.subType == 1) {
            this._playersNode.push(game.findUI(this._node, "ND_Player_1"));
            this._playersNode.push(game.findUI(this._node, "ND_Player_2"));
            this._playersNode.push(game.findUI(this._node, "ND_Player_4"));
            // this._playersNode.push(game.findUI(this._node, "ND_Player_3")); // 3和4交换位置
        }else {
            for (var i = 1; i <= 4; ++i) {
                this._playersNode.push(game.findUI(this._node, "ND_Player_" + i));
            }
        }

        // 发牌动画节点
        this._dealCardsNode = game.findUI(this._node, "ND_DealCards");

        this._imgWait = game.findUI(this._node, "ND_WaitOther");
        this._imgWait.setVisible(false);

        this._btnExit = game.findUI(this._node, "Btn_ExitGame");
        this._btnTuo = game.findUI(this._node, "ND_Tuo");

        this._roundId = game.findUI(this._node, "Label_RoundID");
        this._round = game.findUI(this._node,"Label_Round");
        this._enter = game.findUI(this._node, "Label_Enter");
    },

    getPlayer: function (index) {
        if (index < 1 || index > 4) {
            return null;
        }

        var gameData = game.procedure.Run.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        if (!this._players[diff]) {
            this._players[diff] = new WindowRun.Player(this._playersNode[diff], diff + 1);
            this._players[diff].reset();
        }

        return this._players[diff];
    },

    /**
     * 设置头像点击回调
     * @param callback
     */
    onHeadPicClicked : function (callback) {
        this._players && this._players.forEach(function(uiPlayer){
            uiPlayer.onHeadPicClicked(callback);
        });
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
     * 托管按钮
     * @param callback
     */
    onTuoClicked: function (callback) {
        this._btnTuo.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    /**
     * 获取发牌动画
     * @returns {null}
     */
    getDealCards: function () {
        return this._dealCardsCtrl;
    },
    /**
     * 获取时间控件
     * @return {null}
     */
    getClock: function () {
        if (this._clock == null) {
            this._clock = new WindowRun.Clock(this._clockNode);
        }
        return this._clock;
    },
    /**
     * 获取出牌按钮控件
     * @return {null}
     */
    getPlayBtn: function () {
        if (this._playBtn == null) {
            this._playBtn = new WindowRun.PlayCardsBtns(this._playBtnNode);
            this._playBtn.reset();
        }
        return this._playBtn;
    },
    /**
     * 获取出牌按钮控件
     * @return {null}
     */
    getTableTip: function () {
        if (this._tableTip == null) {
            this._tableTip = new WindowRun.TableTip(this._tableTipNode);
            this._tableTip.reset();
        }
        return this._tableTip;
    },
    /**
     * 获取房间按钮
     * @return {null}
     */
    getRoomMenu: function () {
        return this._roomMenu;
    },

    /**
     * 获取房间信息控件
     * @return {null}
     */
    getRoomInfo: function () {
        if (this._roomInfo == null) {
            this._roomInfo = new WindowRun.RoomInfo(this._roomInfoNode);
            this._roomInfo.reset();
        }

        return this._roomInfo;
    },
    /**
     * 获取匹配界面窗口
     * @returns {null}
     */
    getMatchWindow : function () {
        if (this._matchWindow == null) {
            this._matchWindow = new WindowRun.MatchWindow(this._node);
            this._matchWindow.reset();
        }
        return this._matchWindow;
    },
    /**
     * 显示等待其他玩家的文字
     * @param bool
     */
    showWait : function (bool) {
        this._imgWait.setVisible(bool);
    },
    /**
     * 隐藏玩家准备状态
     */
    hideReady: function () {
        this._players && this._players.forEach(function (uiPlayer) {
            uiPlayer.showReady(false);
        });
    },
    /**
     * 隐藏所有玩家的操作提示
     */
    hidePlayerTip: function () {
        this._players && this._players.forEach(function (uiPlayer) {
            uiPlayer.showTip(-1);
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
    },
    /**
     * 设置房间的牌局号
     * @param roundID
     */
    setRoomRoundID : function (roundID) {
        if (roundID == -1) {
            this._roundId.setVisible(false);
            return;
        }
        this._roundId.setString(roundID);
        this._roundId.setVisible(true);
    },
    /**
     * 设置当前对局数 仅房卡场用
     */
    setCurRound: function (str) {
        // this._round.setString("局数: " + curRound + "/" + totalRound);
        this._round.setString(str);
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
     * 显示当前对局信息
     * @param show
     */
    showCurRound: function (show) {
        this._round.setVisible(show);
    },
    /**
     * 显示托管按钮
     * @param show
     */
    showBtnTuo: function (show) {
        this._btnTuo.setVisible(show);
    },
    /**
     * 获取游戏开始前按钮
     * @return {null}
     */
    getPreBegin: function () {
        if (this._preBegin == null) {
            this._preBegin = new WindowRun.PreBegin(this._preBeginNode);
            this._preBegin.reset();
        }
        return this._preBegin;
    },
});