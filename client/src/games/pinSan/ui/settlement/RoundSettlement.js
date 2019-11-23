/**
 * Created by Jiyou Mo on 2017/12/4.
 */
// 拼三张单局结算面板
GameWindowPinSan.RoundSettlement = cc.Layer.extend({

    _node               : null,         // 本节点

    _nextCallback       : null,         // 下一局按钮点击回调
    _shareCallback      : null,         // 分享按钮点击回调

    _uiPlayers          : [],           // 玩家的UI信息

    _imgTitleWin        : null,         // 胜利标记图
    _imgTitleLose       : null,         // 失败标记图
    _labelRoundInfo     : null,         // 对局详情
    _btnShare           : null,         // 分享按钮
    _btnNext            : null,         // 下一局按钮
    _labelCountDown     : null,         // 倒计时按钮
    _timerID            : null,         // 倒计时ID
    _countDown          : 0,            // 当前倒计时的时间

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Games/PinSan/Settlement/RoundSettlement.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._uiPlayers = [];
        for (var i = 1; i <= 6; ++i) {
            var uiPlayer = new GameWindowPinSan.RoundSettlementPlayer(game.findUI(this._node, "ND_Player" + i));
            uiPlayer.reset();
            this._uiPlayers.push(uiPlayer);
        }

        this._imgTitleWin = game.findUI(this._node, "IMG_WinTitle");
        this._imgTitleLose = game.findUI(this._node, "IMG_LoseTitle");

        this._btnShare = game.findUI(this._node, "BTN_Share");
        this._btnShare.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._shareCallback && this._shareCallback();
            }
        }, this);

        this._btnNext = game.findUI(this._node, "BTN_NextRound");
        this._btnNext.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._onBtnNextClick();
            }
        }, this);

        this._labelCountDown = game.findUI(this._node, "TXT_CountDown");
        this._labelRoundInfo = game.findUI(this._node, "Label_RoundInfo");

    },

    reset : function () {
        this._nextCallback = null;
        this._shareCallback = null;
        this._countDown = 0;
        this.stopCountDown();
        this._uiPlayers.forEach(function (uiPlayer) {
            uiPlayer.reset();
            uiPlayer.show(false);
        });

        this._showTitleWin(true);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置信息
     * @param info
     */
    setInfo : function (info) {
        var gameData = game.procedure.PinSan.getGameData();
        var playerInfo = [];
        for (var key in info.players) {
            if (info.players.hasOwnProperty(key)) {
                playerInfo.push(info.players[key]);
            }
        }

        this._showTitleWin(gameData.playerIndex == info.winnerIndex);

        if(!info.players.hasOwnProperty(gameData.playerIndex)) {
            this._imgTitleLose.setVisible(false);
            this._imgTitleWin.setVisible(false);
        }

        var startIndex = Math.floor((gameData.getPlayerNum() - playerInfo.length) * 0.5);
        for (var i = 0; i < gameData.getPlayerNum(); ++i) {
            if (i < startIndex || i >= startIndex + playerInfo.length) {
                this._uiPlayers[i].show(false);
            } else {
                this._uiPlayers[i].setInfo(playerInfo[i - startIndex]);
                this._uiPlayers[i].show(true);
            }
        }

        if (gameData.sceneMode == "FK") {
            var date = new Date(info.endTime * 1000);
            var time = date.format("yyyy-MM-dd hh:mm");
            var str = "" + time + "\n";
            str += "牌局号: " + info.roundId + "\n";
            str += "房间: " + gameData.roomId;
            this._labelRoundInfo.setString(str);
        }else {
            this._labelRoundInfo.setVisible(false);
        }

    },

    /**
     * 更新准备倒计时的值
     * @private
     */
    _updateReadyCountDown : function () {
        this._countDown -= 1;
        if (this._countDown < 1) {
            this._countDown = 0;
            this.stopCountDown();
            this._onBtnNextClick();
        }

        this._labelCountDown.setString("" + this._countDown);
    },

    /**
     * 开启倒计时
     */
    startCountDown : function () {
        this.stopCountDown();
        this._countDown = 11;
        this._updateReadyCountDown();
        this._timerID = setInterval(this._updateReadyCountDown.bind(this), 1000);
    },

    /**
     * 停止倒计时
     */
    stopCountDown : function () {
        if (this._timerID) {
            clearInterval(this._timerID);
            this._timerID = null;
        }
    },

    /**
     * 下一局按钮点击调用函数
     * @private
     */
    _onBtnNextClick : function () {
        this.close();
        this._nextCallback && this._nextCallback();
        this._nextCallback = null;
    },

    /**
     * 关闭操作
     */
    close : function () {
        this.stopCountDown();
        game.UISystem.closePopupWindow(this);
    },

    /**
     * 设定下一局按钮点击回调
     * @param callback
     */
    onNextClicked : function (callback) {
        this._nextCallback = callback;
    },

    /**
     * 设定分享按钮点击回调
     * @param callback
     */
    onShareClicked : function (callback) {
        this._shareCallback = callback;
    },

    /**
     * 显示胜利标题
     * @param bool
     * @private
     */
    _showTitleWin : function (bool) {
        this._imgTitleWin.setVisible(bool);
        this._imgTitleLose.setVisible(!bool);
    }
});

GameWindowPinSan.RoundSettlement._instance = null;

/**
 * 关闭
 */
GameWindowPinSan.RoundSettlement.close = function () {
    if (this._instance) {
        this._instance.close();
    }
};

/**
 *
 * @param info                  单局结算信息
 * @param nextRoundCallback     下一局按钮回调
 * @param shareCallback         分享按钮回调
 */
GameWindowPinSan.RoundSettlement.popup = function(info, nextRoundCallback, shareCallback) {
    if (!this._instance) {
        this._instance = new GameWindowPinSan.RoundSettlement();
        this._instance.retain();
    }
    this._instance.reset();
    this._instance.setInfo(info);
    this._instance.onNextClicked(nextRoundCallback);
    this._instance.onShareClicked(shareCallback);
    this._instance.startCountDown();
    game.UISystem.popupWindow(this._instance);
};