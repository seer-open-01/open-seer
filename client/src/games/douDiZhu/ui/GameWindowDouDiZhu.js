/**
 * Created by lyndon on 2017/11/24.
 */
var GameWindowDouDiZhu = GameWindowBasic.extend({

    _preBeginNode               : null,         // 游戏开始前按钮节点
    _preBegin                   : null,         // 游戏开始前按钮  邀请好友 复制房间 解散房间

    _topCardsNode               : null,         // 地主的三张底牌节点
    _topCards                   : null,         // 地主的三张底牌

    _callBtnNode                : null,         // 叫地主按钮控件节点
    _callBtn                    : null,         // 叫地主按钮控件
    _doubleBtnNode              : null,         // 加倍按钮
    _doubleBtn                  : null,         // 加倍按钮控件

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
    _enter                      : null,         // 准入
    _imgWait                    : null,         // 等待其他玩家
    _btnExit                    : null,         // 退出按钮
    _btnTuo                     : null,         //

    _round                      : null,         // 当前对局 房卡场用

    ctor: function (parame) {
        this._super("res/Games/DouDiZhu/DouDiZhuWindow.json");
        return true;
    },

    /**
     * 重写的父类初始化函数
     */
    initUI: function () {
        this._super();


        // 玩家信息加载
        this._players = [];
        this._playersNode = [];
        for (var i = 1; i <= 3; ++i) {
            this._playersNode.push(game.findUI(this._node, "ND_Player_" + i));
        }

        // 房间开始前按钮
        this._preBeginNode = game.findUI(this._node, "ND_PreBegin");
        this._preBegin = null;

        // 地主的三张底牌
        this._topCardsNode = game.findUI(this._node, "ND_DiZhuCards");
        this._topCards = null;

        // 叫地主按钮
        this._callBtnNode = game.findUI(this._node, "ND_CallDiZhu");
        this._callBtn = null;

        // 加倍按钮
        this._doubleBtnNode = game.findUI(this._node, "ND_Double");
        this._doubleBtn = null;

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

        // 房间按钮控件
        this._roomMenuNode = game.findUI(this._node, "ND_RoomMenu");
        this._roomMenu = GameRoomBtnCtrl.getController();
        this._roomMenu.addToNodeWithLocalPosition(this._roomMenuNode);
        this._roomMenu.hideBank();

        // 系统信息
        this._sysInfoNode = game.findUI(this._node, "ND_SysInfo");
        this._sysInfo = GameWindowBasic.GameSystemInfo.getController();
        this._sysInfo.addToNode(this._node, this._sysInfoNode.getPosition());

        // 发牌动画节点
        var gameData = game.procedure.DouDiZhu.getGameData();
        this._dealCardsNode = game.findUI(this._node, "ND_DealCards");
        this._dealCardsCtrl = gameData.subType == 1
            ? new GameWindowDouDiZhu.DealCards(this._dealCardsNode)
            : new GameWindowDouDiZhu.DealCardsSub(this._dealCardsNode);
        this._dealCardsCtrl.reset();

        this._imgWait = game.findUI(this._node, "ND_WaitOther");
        this._imgWait.setVisible(false);

        this._btnExit = game.findUI(this._node, "Btn_ExitGame");
        this._btnTuo = game.findUI(this._node, "ND_Tuo");

        this._roundId = game.findUI(this._node, "Label_RoundID");
        this._round = game.findUI(this._node,"Label_Round");
        this._enter = game.findUI(this._node, "Label_Enter");
        this._round.setVisible(false);
    },
    /**
     * 获取玩家自己的UI (必须重写的函数)
     * @param index
     * @returns {*}
     */
    getPlayer: function (index) {

        if (index < 1 || index > 3) {
            return null;
        }

        var gameData = game.procedure.DouDiZhu.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        if (!this._players[diff]) {
            this._players[diff] = new GameWindowDouDiZhu.GamePlayerDouDiZhu(this._playersNode[diff], diff + 1);
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
     * 获取游戏开始前按钮
     * @return {null}
     */
    getPreBegin: function () {
        if (this._preBegin == null) {
            this._preBegin = new GameWindowDouDiZhu.PreBegin(this._preBeginNode);
            this._preBegin.reset();
        }
        return this._preBegin;
    },
    /**
     * 获取叫地主按钮对象
     * @return {null}
     */
    getCallBtn: function () {
        if (this._callBtn == null) {
            this._callBtn = new GameWindowDouDiZhu.CallDiZhu(this._callBtnNode);
            this._callBtn.reset();
        }
        return this._callBtn;
    },
    /**
     * 获取加倍按钮对象
     * @return {null}
     */
    getDoubleBtn: function () {
        if (this._doubleBtn == null) {
            this._doubleBtn = new GameWindowDouDiZhu.Double(this._doubleBtnNode);
            this._doubleBtn.reset();
        }
        return this._doubleBtn;
    },
    /**
     * 获取三张地主牌管理对象
     * @return {null}
     */
    getDiZhuCards: function () {
        if (this._topCards == null) {
            this._topCards = new GameWindowDouDiZhu.DiZhuCards(this._topCardsNode);
            this._topCards.reset();
            this._topCards.show(false);
        }
        return this._topCards;
    },
    /**
     * 获取时间控件
     * @return {null}
     */
    getClock: function () {
        if (this._clock == null) {
            this._clock = new GameWindowDouDiZhu.Clock(this._clockNode);
        }
        return this._clock;
    },
    /**
     * 获取出牌按钮控件
     * @return {null}
     */
    getPlayBtn: function () {
        if (this._playBtn == null) {
            this._playBtn = new GameWindowDouDiZhu.PlayCardsBtns(this._playBtnNode);
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
            this._tableTip = new GameWindowDouDiZhu.TableTip(this._tableTipNode);
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
            this._roomInfo = new GameWindowDouDiZhu.RoomInfo(this._roomInfoNode);
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
            this._matchWindow = new GameWindowDouDiZhu.MatchWindow(this._node);
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
     * 设置房间的牌局号 (用于子类重写,有牌局号的一定要重写，没有则不管)
     */
    setRoomRoundID : function (idString) {
        if (idString == -1) {
            this._roundId.setVisible(false);
            return;
        }
        this._roundId.setString(idString);
        this._roundId.setVisible(true);
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
     * 设置当前对局数 仅房卡场用
     */
    setCurRound: function (str) {
        // this._round.setString("局数: " + curRound + "/" + totalRound);
        // 这个版本,局数信息改为牌局号
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
     * 显示托管按钮
     * @param show
     */
    showBtnTuo: function (show) {
        this._btnTuo.setVisible(show);
    },
});
