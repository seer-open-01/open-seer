/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋游戏界面
 */
WindowChess.Prepare = cc.Class.extend({

    _node           : null,

    _btnReady       : null,     // 准备按钮
    _btnBegin       : null,     // 开始按钮

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._btnReady = game.findUI(this._node, "Btn_Ready");
        this._btnBegin = game.findUI(this._node, "Btn_Begin");
    },

    reset: function () {
        this.show(false);
    },

    show: function (show) {
        this._node.setVisible(show);
    },

    /**
     * 显示准备或开始按钮
     * @param type 1 为开始按钮 2 为准备按钮
     */
    showBtnByType: function (type) {
        this._btnBegin.setVisible(1 == type);
        this._btnBegin.setEnabled(1 == type);
        this._btnReady.setVisible(2 == type);
        this._btnReady.setEnabled(2 == type);
    },
    /**
     * 开始按钮置灰接口
     * @param bool
     */
    setBeginEnabled: function (bool) {
        this._btnBegin.setEnabled(bool);
    },

    /**
     * 准备按钮回调
     * @param callback
     */
    onReadyClicked: function (callback) {
        this._btnReady.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
                this.show(false);
            }
        }, this);

        this._btnBegin.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
                this.show(false);
            }
        }, this);
    }
});