/**
 * Created by lyndon on 2017/06/28.
 */
// 斗地主单局结算
GameWindowDouDiZhu.SettlementRoundWindow = cc.Layer.extend({

    _node               : null,        // 本节点
    _info               : null,        // 信息

    _players            : null,
    _nextCallback       : null,        // 下一局回调
    _exitCallback       : null,        // 离开回调
    _victoryTitle       : null,        // 胜利标题
    _failTitle          : null,        // 失败标题

    _timeLabel          : null,        // 时间文字控件
    _timeNum            : 0,           // 时间

    _btnExit            : null,        // 离开按钮
    _btnNext            : null,        // 下一局按钮

    _labelRoundInfo     : null,        // 房卡场用，房间对局信息文本

    ctor : function() {
        this._super();
        this._node = ccs.load("res/Games/DouDiZhu/Settlement/SettlementRound.json").node;
        this.addChild(this._node);
        this._init();

        return true;
    },

    _init : function () {

        this._victoryTitle = game.findUI(this._node, "Title_Victory");
        this._failTitle = game.findUI(this._node, "Title_Fail");
        this._timeLabel = game.findUI(this._node,"Label_Time");
        this._labelRoundInfo = game.findUI(this._node,"TXT_RoundInfo");


        // 信息
        var ndPlayers = game.findUI(this._node, "ND_Players");
        this._players = [];
        for (var i = 1; i <= 3; ++i) {
            this._players.push(new GameWindowDouDiZhu.SettlementRoundPlayerInfo(game.findUI(ndPlayers, "Player_" + i)));
        }

        // 分享按钮
        var shareBtn = game.findUI(this._node, "BTN_Share");
        shareBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.__doShare();
            }
        }.bind(this), this);

        // 下一局按钮
         this._btnNext = game.findUI(this._node, "BTN_Next");
         this._btnNext.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.__doNext();
            }
        }.bind(this), this);

        // 离开按钮
       this._btnExit = game.findUI(this._node, "BTN_Leave");
       this._btnExit.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.__doExit();
            }
        }.bind(this), this);
    },

    setInfo : function(info) {
        var gameData = game.procedure.DouDiZhu.getGameData();
        this._info = info;
        var players = this._info.players;
        var baseBean = this._info.baseBean;
        var multiple = this._info.multiple;
        for (var i = 0; i < 3; ++i) {
            var playerInfo = players[i + 1];
            if (playerInfo) {
                playerInfo.index = i + 1;
                playerInfo.baseBean = baseBean;
                playerInfo.multiple = multiple;
                this._players[i].setPlayerInfo(gameData.players[i + 1]);
                this._players[i].setGameInfo(playerInfo);
                this._players[i].show(true);
            }
        }
        this.showVictory(players[gameData.playerIndex].roundBean >= 0);
        game.Audio.ddzPlaySettlementBGM(players[gameData.playerIndex].roundBean >= 0);

        if (gameData.sceneMode == "JB") {
            this._timeNum = 15;
            this.startTimer();
            this._timeLabel.stopAllActions();
            this._timeLabel.runAction(cc.sequence(cc.delayTime(1.0), cc.CallFunc(this.startTimer, this)).repeatForever());
            this.showBtnLeave(true);
        }else if (gameData.sceneMode == "FK") {
            var date = new Date(this._info.endTime * 1000);
            var time = date.format("yyyy-MM-dd hh:mm");
            var str = "" + time + "\n";
            str += "牌局号: " + this._info.roundId + "\n";
            str += "房间: " + gameData.roomId;
            this._labelRoundInfo.setString(str);
            this.showBtnLeave(false);
        }
    },

    /**
     * 显示离开按钮
     * @param show
     */
    showBtnLeave: function (show) {
        this._btnExit.setEnabled(show);
        this._btnExit.setVisible(show);
        this._timeLabel.setVisible(show);
        this._labelRoundInfo.setVisible(!show);
    },

    /**
     * 显示胜利标题
     * @param bool
     * @private
     */
    showVictory: function (bool) {
        this._victoryTitle.setVisible(bool);
        this._failTitle.setVisible(!bool);
    },
    /**
     * 设置倒计时
     * @private
     */
    startTimer: function () {
        if (this._timeNum < 0) {
            this._timeNum = 0;
            this.close();
            this._timeLabel.stopAllActions();
            this.__doExit();
        }
        var str = "(";
        if (this._currentTime < 10) {
            str = "(0";
        }
        this._timeLabel.setString(str + this._timeNum + ")");
        this._timeNum--;
    },

    __doShare: function() {
        cc.log("分享");
        game.UISystem.captureScreen("screenShot.jpg", function() {
            WeChat.shareImage(false, jsb.fileUtils.getWritablePath() + "screenShot.jpg", function() {});
        });
    },

    __doNext: function() {
        this._nextCallback && this._nextCallback();
        game.UISystem.closePopupWindow(this);
    },

    __doExit: function() {
        game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {
            uid : game.DataKernel.uid,
            roomId : game.DataKernel.roomId
        });
    },

    _setNextBtnCallback:function(callback){
        this._nextCallback = callback;
    },

    _setExitBtnCallback:function(callback){
        this._exitCallback = callback;
    },

    /**
     * 关闭窗口
     */
    close : function () {
        game.UISystem.closePopupWindow(this);
    }
});

GameWindowDouDiZhu.SettlementRoundWindow._instance = null;

GameWindowDouDiZhu.SettlementRoundWindow.close = function () {
    if (this._instance) {
        this._instance.close();
    }
};
/**
 *
 * @param info          单局结算信息
 * @param next_cb      继续游戏按钮回调
 * @param exit_cb      继续游戏按钮回调
 */
GameWindowDouDiZhu.SettlementRoundWindow.popup = function(info, next_cb, exit_cb) {
    if (this._instance == null) {
        this._instance = new GameWindowDouDiZhu.SettlementRoundWindow();
        this._instance.retain();
    }
    this._instance.setInfo(info);
    this._instance._setNextBtnCallback(next_cb);
    this._instance._setExitBtnCallback(exit_cb);
    game.UISystem.popupWindow(this._instance);
};