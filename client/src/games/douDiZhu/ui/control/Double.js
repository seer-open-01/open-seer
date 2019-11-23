/**
 * Created by lyndon on 2017/11/20.
 */
// 加倍主按钮控件
GameWindowDouDiZhu.Double = cc.Class.extend({

    _parentNode                 : null,         // 父节点
    _node                       : null,         // 本节点

    _btns                       : [],           // 按钮数组

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/Double/Double.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    // value = 1 代表加倍    0 代表不加倍
    _init: function () {
        this._btns = [];
        var btn1 = game.findUI(this._node, "Btn_Yes");
        btn1.value = 1;
        var btn2 = game.findUI(this._node, "Btn_No");
        btn2.value = 0;
        this._btns.push(btn1);
        this._btns.push(btn2);
    },

    reset: function () {
        this.show(false);
    },

    show : function (show) {
        this._node.setVisible(show);
    },

    onCallClick: function (callback) {
        this._btns.forEach(function (btn) { btn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback(sender.value);
                this.show(false);
            }
        }, this)}.bind(this))
    }
});
