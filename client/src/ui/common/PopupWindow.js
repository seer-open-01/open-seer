/**
 * 弹框基础类
 */

game.ui.PopupWindow = cc.Layer.extend({
    ctor:function () {
        this._super();

        cc.eventManager.addListener({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            onTouchBegan : this.onTouchBegan,
            onTouchMoved : this.onTouchMoved,
            onTouchEnded : this.onTouchEnded
        }, this);

        return true;
    },

    onTouchBegan:function (touch, event) {
        return true;
    },

    onTouchMoved:function (touch, event) {},

    onTouchEnded:function (touch, event) {},

    /**
     * 重连跟新窗口
     */
    upPopupWindowData: function () {}
});
