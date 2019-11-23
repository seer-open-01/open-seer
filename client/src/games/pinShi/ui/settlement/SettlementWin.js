/**
 * Created by lyndon on 2018/05/28.
 *  拼十结算
 */
GameWindowPinShi.SettlementWindow = game.ui.PopupWindow.extend({

    _node               : null,             // 本节点

    _imgVictory         : null,             // 胜利
    _imgFail            : null,             // 失败
    _imgDraw            : null,             // 平局

    _btnNext            : null,             // 下一句按钮
    _btnShare           : null,             // 分享按钮
    _txtTime            : null,             // 倒计时文字
    _numTime            : 0,                // 倒计时

    _players            : [],               // 本局玩家
    _info               : null,             // 玩家数据
    _callback           : null,             // 弹窗关闭回调

    ctor: function (info, callback) {
        this._super();
        this._node = ccs.load("res/Games/PinShi/Settlement/Settlement.json").node;
        this._info = info;
        this._callback = callback;
        this._init();
        this.addChild(this._node);
        return true;
    },
    
    _init: function () {
        this._imgVictory = game.findUI(this._node, "ND_Victory");
        this._imgFail = game.findUI(this._node, "ND_Fail");
        this._imgDraw = game.findUI(this._node, "ND_Draw");

        this._imgVictory.setVisible(false);
        this._imgFail.setVisible(false);
        this._imgDraw.setVisible(false);

        this._btnNext = game.findUI(this._node, "BTN_Next");
        this._btnShare = game.findUI(this._node, "BTN_Share");
        this._txtTime = game.findUI(this._btnNext, "Time");

        this._players = [];
        for (var i = 1; i <= 6; ++i) {
            var player = new GameWindowPinShi.SettlementWindow.Player(game.findUI(this._node, "Player" + i));
            player.reset();
            this._players.push(player);
        }

        this._btnNext.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._doNext();
            }
        }, this);

        this._btnShare.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._doShare();
            }
        }, this);

        this.openCountDown(15);
        this.showResult();
        this.setInfo();
    },

    setInfo: function () {

        for (var key in this._info) {
            if (this._info.hasOwnProperty(key)) {
                this.getPlayer(key).setScoreWithAction(this._info[key].roundBean);
            }
        }
    },

    getPlayer: function (index) {
        var gameData = game.procedure.PinShi.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        return this._players[diff];
    },
    /**
     * 打开倒计时
     * @param time
     */
    openCountDown: function (time) {
        this._numTime = time;
        this._txtTime.setString("" + this._numTime);
        this._txtTime.stopAllActions();
        this._txtTime.runAction(cc.Sequence(cc.DelayTime(1.0), cc.CallFunc(function () {
            this.updateTime();
        }, this)).repeatForever());
    },
    /**
     * 更新时间显示
     */
    updateTime: function () {
        this._numTime --;
        if (this._numTime < 1) {
            this._numTime = 0;
            this._txtTime.stopAllActions();
            this._doNext();
        }
        this._txtTime.setString("" + this._numTime);
    },
    /**
     * 显示对局结果
     */
    showResult: function () {
        var gameData = game.procedure.PinShi.getGameData();
        var score = this._info[gameData.playerIndex].roundBean;
        this._imgVictory.setVisible(score > 0);
        this._imgFail.setVisible(score < 0);
        this._imgDraw.setVisible(score == 0);
    },
    /**
     * 分享
     * @private
     */
    _doShare: function () {
        cc.log("分享！");
        game.UISystem.captureScreen("screenShot.jpg", function () {
            WeChat.shareImage(false, jsb.fileUtils.getWritablePath() + "screenShot.jpg", function (ok) {});
        });
    },
    /**
     * 下一局
     * @private
     */
    _doNext: function () {
        this._callback && this._callback();
        game.UISystem.closeWindow(this);
    }
});

GameWindowPinShi.SettlementWindow.Player = cc.Class.extend({

    _node               : null,

    _ndAdd              : null,
    _ndMinus            : null,
    _fntAdd             : null,
    _fntMinus           : null,

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._ndAdd = game.findUI(this._node, "ND_Add");
        this._fntAdd = game.findUI(this._ndAdd, "FNT_Add");

        this._ndMinus = game.findUI(this._node, "ND_Minus");
        this._fntMinus = game.findUI(this._ndMinus, "FNT_Minus");
    },

    reset: function () {
        this._ndAdd.setVisible(false);
        this._ndMinus.setVisible(false);
    },

    /**
     * 显示分数
     * @param score
     */
    setScore: function (score) {
        this._ndMinus.setVisible(score < 0);
        this._ndAdd.setVisible(score >= 0);
        var ss = Utils.formatCoin(Math.abs(score));
        this._fntAdd.setString("J" + ss);
        this._fntMinus.setString("J" + ss);
    },

    /**
     * 单局结算分数显示两秒后隐藏
     * @param score
     */
    setScoreWithAction: function (score) {
        this._ndMinus.setVisible(score < 0);
        this._ndAdd.setVisible(score >= 0);
        var ss = Utils.formatCoin(Math.abs(score));
        this._fntAdd.setString("J" + ss);
        this._fntMinus.setString("J" + ss);
        if (score >= 0) {
            this._ndAdd.runAction(cc.Sequence(cc.DelayTime(3.0),cc.Hide()));
        } else {
            this._ndMinus.runAction(cc.Sequence(cc.DelayTime(3.0),cc.Hide()));
        }
    }

});

GameWindowPinShi.SettlementWindow.popup = function (score, nextCallback) {
    var win = new GameWindowPinShi.SettlementWindow(score, nextCallback);
    game.UISystem.showWindow(win);
};