/**
 * Created by lyndon on 2018.05.18.
 *  牌型展示显示
 */

GameWindowPinShi.CardPattern = cc.Class.extend({

    _node       : null,

    _patterns   : [],

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;

    },

    _init: function () {
        this._patterns = [];
        var tipTemp = null;
        for (var i = 0; i <= 18; ++i) {
            tipTemp = game.findUI(this._node, "ND_Pattern_" + i);
            this._patterns.push(tipTemp);
        }
    },

    reset: function () {
        for (var i = 0; i < this._patterns.length; ++i) {
            this._patterns[i].setVisible(false);
        }
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 显示牌型
     * @param pattern
     */
    showCardPattern: function (pattern) {
        this.show(true);
        for (var i = 0; i < this._patterns.length; ++i) {
            this._patterns[i].setVisible(pattern == i);
        }
    },
    /**
     * 显示牌型添加缩放动画
     * @param pattern
     */
    showCardPatternWithAction: function (pattern) {
        this.show(true);
        for (var i = 0; i < this._patterns.length; ++i) {
            this._patterns[i].setVisible(pattern == i);
            this._patterns[i].stopAllActions();
            this._patterns[i].setScale(1.0);
        }
        if (pattern == PinShiHelper.cardPattern.Done) {
            return;
        }
        this._patterns[pattern].setScale(2.0);
        this._patterns[pattern].runAction(cc.Sequence(cc.DelayTime(0.2),
            cc.ScaleTo(0.3, 1.0).easing(cc.easeIn(0.3))));
    }
});