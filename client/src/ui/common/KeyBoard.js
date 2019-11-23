/**
 * Created by lyndon on 2018/06/04.
 *  数字键盘
 */
game.ui.Keyboard = cc.Class.extend({

    _node               : null,

    _keys               : [],       // 按键数组
    _callback           : null,     // 按钮点击事件

    ctor: function (node) {
        this._node = node;
        this._init();

        return true;
    },

    _init: function () {

        this._keys = [];
        var temp = null;
        for (var i = 0; i <= 9; ++i) {
            temp = game.findUI(this._node, "" + i);
            temp.id = i;
            this._keys.push(temp);
        }

        var del = game.findUI(this._node, "Del");
        del.id = -1;this._keys.push(del);
        var reset = game.findUI(this._node, "Reset");
        reset.id = -2;this._keys.push(reset);

        for (var j = 0; j < this._keys.length; ++j) {
            this._keys[j].addTouchEventListener(this._onKeyDown, this);
        }

    },

    _onKeyDown: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            game.Audio.playBtnClickEffect();
            this._callback && this._callback(sender.id);
            cc.log("键盘按钮 " + sender.id);
        }
    },

    setKeyDownCallback: function (callback) {
        this._callback = callback;
    }
});