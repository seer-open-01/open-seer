/**
 * 换三张确认面板
 */
GameWindowMahjong.ConfirmPanel = cc.Class.extend({
    _parentNode: null,         // 父节点
    _node: null,         // 本节点

    _btn: null,         // 确定按钮
    _label: null,         // 时间
    _numTime: 0,
    _cards: [],           // 当前选中的牌
    ctor: function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Change/Change.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._btn = game.findUI(this._node, "ND_Sure");

        this._label = game.findUI(this._node, "ND_Time");
    },

    reset: function () {
        this.show(false);
        this.startTimer(0);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    onConfirmClicked: function (callback) {
        this._btn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    
    startTimer: function (time) {
        this._numTime = time < 0 ? 0 : time;
        var doDelay = cc.DelayTime(1.0);
        var doCall = cc.CallFunc(function () {
            this._numTime--;
            this._label.setString("" + this._numTime + "秒");
            if (this._numTime < 1) {
                this._label.stopAllActions();
                this.show(false);
            }
        }, this);

        this._label.stopAllActions();
        this._label.runAction(cc.sequence(doCall, doDelay).repeatForever());
    }
});
/**
 * 换牌提示面板
 */
GameWindowMahjong.HuanPanel = cc.Class.extend({
    _parentNode: null,
    _node: null,

    _type: null, // 换牌信息图片
    _effs: null, // 箭头特效
    ctor: function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Change/Huan.json").node;
        this._init();
        this._node.setPositionY(-10);
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._type = game.findUI(this._node, "ND_Type");
        this._effs = [];
        for (var i = 0; i <= 2; ++i) {
            var temp = game.findUI(this._node, "Eff_" + i);
            this._effs.push(temp);
        }
    },

    reset: function () {
        this.show(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 显示动画特效
     */
    showEff: function (type, callback) {
        this.show(true);
        // 显示文字
        var path = "res/Games/Mahjong/Images/Change_Type_" + type + ".png";
        this._type.setTexture(path);
        // 显示特效
        for (var i = 0; i < this._effs.length; ++i) {
            this._effs[i].setVisible(false);
            this._effs[i].stopAllActions();
        }
        if (type == 0) {
            var action = ccs.load("res/Animations/EffMaJiang/EffTurn/Ni.json").action;
            action.play("animation0", true);
            this._effs[0].stopAllActions();
            this._effs[0].runAction(action);
            this._effs[0].setVisible(true);
        }else if (type == 1) {
            action = ccs.load("res/Animations/EffMaJiang/EffTurn/Shun.json").action;
            action.play("animation0", true);
            this._effs[1].stopAllActions();
            this._effs[1].runAction(action);
            this._effs[1].setVisible(true);
        }else if (type == 2) {
            action = ccs.load("res/Animations/EffMaJiang/EffTurn/Dui.json").action;
            action.play("animation0", true);
            this._effs[2].stopAllActions();
            this._effs[2].runAction(action);
            this._effs[2].setVisible(true);
        }
        // 3s后关闭该界面
        this._node.runAction(cc.Sequence(cc.DelayTime(2.0), cc.CallFunc(function () {
            callback && callback();
            this.show(false);
        }, this)));
    }


});

GameWindowMahjong.HuanInfo = cc.Class.extend({
    _parentNode: null,
    _node: null,

    _btn: null,
    _name1: null,
    _name2: null,
    _cards1: [],
    _cards2: [],
    _isShow: false,

    ctor: function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Change/Info.json").node;
        this._init();
        this._node.setPositionY(350);
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._cards1 = [];
        this._cards2 = [];
        for (var i = 1; i <= 3; ++i) {
            var temp1 = game.findUI(this._node, "Up_" + i);
            var temp2 = game.findUI(this._node, "Down_" + i);
            this._cards1.push(temp1);
            this._cards2.push(temp2);
        }

        this._name1 = game.findUI(this._node, "Player_1");
        this._name2 = game.findUI(this._node, "Player_2");
        this._btn = game.findUI(this._node, "BTN_Close");
        this._btn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.show(false);
            }
        }, this);
    },

    reset: function () {

    },

    setInfo: function (data) {
        var cards1 = data['in'].cards;
        var cards2 = data['out'].cards;
        var name1 = data['in'].name;
        var name2 = data['out'].name;
        var path = "res/Games/Mahjong/CardsImages/TableCards/North/";
        for (var i = 0; i < this._cards1.length; ++i) {
            this._cards1[i].setTexture(path + cards1[i] + ".png");
            this._cards2[i].setTexture(path + cards2[i] + ".png");
        }

        this._name1.setString("" + name1);
        this._name2.setString("" + name2);
    },

    show: function (bool) {
        this._isShow = bool;
        this._node.setVisible(bool);
    }
});