/**
 * Created by lyndon on 2018/05/17.
 *  抢庄按钮控件
 */
GameWindowPinShi.RobDealer = cc.Class.extend({

    _parentNode             : null,         // 父节点
    _node                   : null,         // 本节点

    _btns                   : [],           // 按钮控件数组

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinShi/RobDealer/RobDealer.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    
    _init: function () {

        this._btns = [];
        var temp = null;
        for (var i = 0; i <= 4; ++i) {
            temp = game.findUI(this._node, "BTN_Rob_" + i);
            temp.rob = i;
            this._btns.push(temp);
        }
    },
    reset: function () {
        this.updateRobBtn(4);
        this.show(false);
    },
    /**
     * 显示隐藏该控件
     * @param bool
     */
    show: function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 更新按钮状态 当按钮的倍数大于rob时不可点击
     * @param rob
     */
    updateRobBtn: function (rob) {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].setEnabled(i <= rob);
        }
    },
    /**
     * 注册抢庄事件
     * @param callback
     */
    onRobClick: function (callback) {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    callback && callback(sender.rob);
                    this.show(false);
                }
            }, this)
        }
    }
});
