/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋结算
 */
WindowChess.SettlementWindow = game.ui.PopupWindow.extend({

    _node               : null,             // 本节点

    _imgVictory         : null,             // 胜利
    _imgFail            : null,             // 失败
    _imgDraw            : null,             // 平局

    _players            : [],               // 本局玩家
    _info               : null,             // 玩家数据
    _callback           : null,             // 弹窗关闭回调

    ctor: function (info, callback) {
        this._super();
        this._node = ccs.load("res/Games/Chess/Settlement/SettlementWin.json").node;
        this._info = info;
        this._callback = callback;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {
        this._imgVictory = game.findUI(this._node, "Tittle_Win");
        this._imgFail = game.findUI(this._node, "Tittle_Lose");
        this._imgDraw = game.findUI(this._node, "Tittle_Draw");

        this._imgVictory.setVisible(false);
        this._imgFail.setVisible(false);
        this._imgDraw.setVisible(false);


        this._players = [];
        for (var i = 1; i <= 2; ++i) {
            var player = new WindowChess.SettlementPlayer(game.findUI(this._node, "Player" + i));
            player.reset();
            this._players.push(player);
        }
        var btnNext = game.findUI(this._node, "Btn_Next");
        btnNext.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._doNext();
            }
        }, this);

        this.showResult();
        this.setInfo();
    },

    /**
     * 设置玩家信息
     */
    setInfo: function () {
        var gameData = game.procedure.Chess.getGameData();
        var players = gameData.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                players[index].roundBean = this._info.players[index].roundBean;
                players[index].win = this._info.winner == index ;
                players[index].self = gameData.playerIndex == index;
                this._players[index - 1].setInfo(players[index]);
            }
        }
    },

    /**
     * 显示对局结果
     */
    showResult: function () {
        var gameData = game.procedure.Chess.getGameData();
        var winIndex = this._info.winner;
        this._imgVictory.setVisible(false);
        this._imgFail.setVisible(false);
        this._imgDraw.setVisible(false);
        // 弹窗标题
        if (winIndex == 0) {
            this._imgDraw.setVisible(true);
        }else {
            // cc.log("=============aaa " + winIndex);
            // cc.log("=============bbb " + gameData.playerIndex);
            this._imgVictory.setVisible(winIndex == gameData.playerIndex);
            this._imgFail.setVisible(winIndex != gameData.playerIndex);
        }
        // 音效处理
        var audio = 0;
        if (winIndex == 0) {
            audio = 3;
        }else {
            audio = winIndex == gameData.playerIndex ? 1 : 2;
        }
        game.Audio.chessPlaySettle(audio);

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
/**
 * 结算玩家
 */
WindowChess.SettlementPlayer = cc.Class.extend({

    _node               : null,

    _name               : null,         // 玩家名字
    _head               : null,         // 玩家头像
    _win                : null,         // 胜利的图片
    _self               : null,         // 玩家本人标注
    _fntAdd             : null,         // 加分
    _fntMinus           : null,         // 减分

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._name = game.findUI(this._node, "ND_Name");
        this._win = game.findUI(this._node, "ND_Win");
        this._win.setVisible(false);
        this._self = game.findUI(this._node, "ND_Self");
        this._self.setVisible(false);
        this._fntAdd = game.findUI(this._node, "Fnt_AddScore");
        this._fntMinus = game.findUI(this._node, "Fnt_MinusScore");

        this._head = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_Head"));
    },

    reset: function () {
        this._name.setString("");
        this._head.setHeadPic("");
        this._win.setVisible(false);
        this._self.setVisible(false);
        this.setScore("");
    },
    /**
     * 设置玩家信息
     * @param info
     */
    setInfo: function (info) {
        this._name.setString(info.name);
        this._head.setHeadPic(info.headPic);
        this._head._headImg.setScale(2.04);
        this._win.setVisible(info.win);
        this._self.setVisible(info.self);
        this.setScore(info.roundBean);
    },
    /**
     * 显示分数
     * @param score
     */
    setScore: function (score) {
        this._fntAdd.setVisible(score >= 0);
        this._fntMinus.setVisible(score < 0);
        var ss = Utils.formatCoin(Math.abs(score));
        this._fntAdd.setString("J" + ss);
        this._fntMinus.setString("J" + ss);
    }

});
/**
 * 结算弹窗方法
 * @param info
 * @param nextCallback
 */
WindowChess.SettlementWindow.popup = function (info, nextCallback) {
    var win = new WindowChess.SettlementWindow(info, nextCallback);
    game.UISystem.showWindow(win);
};