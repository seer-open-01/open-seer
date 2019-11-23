/**
 * 定缺选择按钮
 */
GameWindowMahjong.DQSelect = cc.Class.extend({
    _parentNode: null,         // 父节点
    _node: null,         // 本节点

    _tong: null,
    _tiao: null,
    _wan: null,

    ctor: function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Ding/DQSelect.json").node;
        this._init();
        this._node.setPositionX(-460);
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {

        var action1 = ccs.load("res/Animations/EffMaJiang/EffLight/Tong.json").action;
        this._tong = game.findUI(this._node, "BTN_Tong");
        this._tong.effect = game.findUI(this._tong, "effect");
        this._tong.effect.runAction(action1);
        action1.play("animation0", true);

        var action2 = ccs.load("res/Animations/EffMaJiang/EffLight/Tiao.json").action;
        this._tiao = game.findUI(this._node, "BTN_Tiao");
        this._tiao.effect = game.findUI(this._tiao, "effect");
        this._tiao.effect.runAction(action2);
        action2.play("animation0", true);

        var action3 = ccs.load("res/Animations/EffMaJiang/EffLight/Wan.json").action;
        this._wan = game.findUI(this._node, "BTN_Wan");
        this._wan.effect = game.findUI(this._wan, "effect");
        this._wan.effect.runAction(action3);
        action3.play("animation0", true);
    },

    reset: function () {
        this.show(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    // 显示推荐
    showBestType: function (type) {
        this._tong.effect.setVisible(type == 1);
        this._tiao.effect.setVisible(type == 2);
        this._wan.effect.setVisible(type == 3);
        this.show(true);
    },

    // 点击筒
    clickTong: function (callback) {
        this._tong.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback (1);
                this.show(false);
            }
        }, this);
    },
    // 点击条
    clickTiao: function (callback) {
        this._tiao.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback (2);
                this.show(false);
            }
        }, this);
    },
    // 点击万
    clickWan: function (callback) {
        this._wan.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback (3);
                this.show(false);
            }
        }, this);
    }
});