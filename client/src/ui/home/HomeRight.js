/**
 * Created by lyndon on 2018.04.16.
 *
 * 大厅右边UI控件
 * 1.滚动容器
 * 2.五个游戏按钮
 */
game.ui.HomeRight = cc.Class.extend({

    _node               : null,

    _svGames            : null,         // 游戏滚动容器
    _btnMaJiang         : null,         // 麻将按钮
    _btnPinShi          : null,         // 拼十按钮
    _btnPinSan          : null,         // 拼三按钮
    _btnDouDiZhu        : null,         // 斗地主按钮
    _btnRun             : null,         // 跑的快按钮
    _btnMoreGame        : null,         // 更多游戏按钮
    _btnChess           : null,         // 象棋按钮

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init: function () {

        this._svGames = game.findUI(this._node, "SV_Games");
        this._svGames.setScrollBarEnabled(false);

        this._btnMaJiang = game.findUI(this._node, "Game_1");
        this._btnPinShi = game.findUI(this._node, "Game_2");
        this._btnPinSan = game.findUI(this._node, "Game_3");
        this._btnDouDiZhu = game.findUI(this._node, "Game_4");
        this._btnRun = game.findUI(this._node, "Game_5");
        this._btnMoreGame = game.findUI(this._node, "Game_6");
        this._btnChess = game.findUI(this._node, "BTN_Chess");
    },

    /**
     * 播放按钮特效
     */
    playButtonEffect : function () {

        var json = ccs.load("res/Animations/EffHall/MaJiang.json");
        var node = game.findUI(this._btnMaJiang, "eff");
        var action = json.action;
        node.runAction(action);
        action.play("animation0", true);

        json = ccs.load("res/Animations/EffHall/NiuNiu.json");
        node = game.findUI(this._btnPinShi, "eff");
        action = json.action;
        node.runAction(action);
        action.play("animation0", true);

        json = ccs.load("res/Animations/EffHall/PinSanZhang.json");
        node = game.findUI(this._btnPinSan, "eff");
        action = json.action;
        node.runAction(action);
        action.play("animation0", true);

        json = ccs.load("res/Animations/EffHall/DouDiZhu.json");
        node = game.findUI(this._btnDouDiZhu, "eff");
        action = json.action;
        node.runAction(action);
        action.play("animation0", true);

        json = ccs.load("res/Animations/EffHall/Run.json");
        node = game.findUI(this._btnRun, "eff");
        action = json.action;
        node.runAction(action);
        action.play("animation0", true);

        json = ccs.load("res/Animations/EffHall/XZMJ.json");
        node = game.findUI(this._btnMoreGame, "eff");
        action = json.action;
        node.runAction(action);
        action.play("animation0", true);
    },

    // 麻将点击
    onMaJiangClicked: function (callback) {
        this._btnMaJiang.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
                callback && callback(GameTypeConfig.type.HNMJ);
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 拼十点击
    onPinShiClicked: function (callback) {
        this._btnPinShi.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
                callback && callback(GameTypeConfig.type.NN);
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 拼三点击
    onPinSanClicked: function (callback) {
        this._btnPinSan.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
                callback && callback(GameTypeConfig.type.PSZ);
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 斗地主点击
    onDouDiZhuClicked: function (callback) {
        this._btnDouDiZhu.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
                callback && callback(GameTypeConfig.type.DDZ);
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 跑得快点击
    onRunClicked: function (callback) {
        this._btnRun.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
                callback && callback(GameTypeConfig.type.RUN);
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 更多游戏点击
    onMoreGameClicked: function (callback) {
        this._btnMoreGame.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
                callback && callback(GameTypeConfig.type.CDMJ);
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 象棋点击
    onChessClicked: function (callback) {
        this._btnChess.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback(GameTypeConfig.type.XQ);
            }
        }, this);
    }
});