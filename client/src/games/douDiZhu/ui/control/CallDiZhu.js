/**
 * Created by lyndon on 2017/11/20.
 */
// 叫地主按钮控件
GameWindowDouDiZhu.CallDiZhu = cc.Class.extend({

    _parentNode                 : null,         // 父节点
    _node                       : null,         // 本节点

    _callNode                   : null,         // 叫地主节点
    _robNode                    : null,         // 抢地主节点

    _btns                       : [],           // 按钮数组

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/CallDiZhuBtn/CallDiZhu.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._callNode = game.findUI(this._node, "ND_Call");
        this._robNode = game.findUI(this._node, "ND_Rob");

        this._btns = [];
        var btn1 = game.findUI(this._callNode, "Btn_Yes");
        btn1.value = true;
        var btn2 = game.findUI(this._callNode, "Btn_No");
        btn2.value = false;
        var btn3 = game.findUI(this._robNode, "Btn_Yes");
        btn3.value = true;
        var btn4 = game.findUI(this._robNode, "Btn_No");
        btn4.value = false;

        this._btns.push(btn1);
        this._btns.push(btn2);
        this._btns.push(btn3);
        this._btns.push(btn4);
    },

    reset: function () {
        this.showBtn(-1);
    },
    show : function (show) {
        this._node.setVisible(show);
    },
    /**
     * 根据按钮状态显示不同的按钮
     */
    showBtn: function (type) {
        cc.log("叫地主 显示按钮==> " + type);
        this._callNode.setVisible(1 == type);
        this._robNode.setVisible(2 == type);
    },
    /**
     *注册按钮点击事件
     * @param callback
     */
    onCallClick: function (callback) {
        this._btns.forEach(function (btn) { btn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback(sender.value);
                this.showBtn(-1);
            }
        }, this)}.bind(this))
    }

});
