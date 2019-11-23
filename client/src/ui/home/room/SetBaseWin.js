/**
 * @author       : lyndon
 * @date         : 2019-08-02
 * @description  : 设置底分弹窗
 */
game.ui.SetBaseWin = game.ui.PopupWindow.extend({

    _node               : null,

    _btnAdd             : null,         // 增加按钮
    _btnMinus           : null,         // 减少按钮
    _slider             : null,         // 滑动条
    _txtBase            : null,
    _callback           : null,
    _value              : 0,           // 输入框的值

    ctor: function (callback) {
        this._super();
        this._node = ccs.load("res/Home/RoomCard/SetBase.json").node;
        this._callback = callback;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {

        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closeWindow(this);
            }
        }, this);

        var confirmBtn = game.findUI(this._node, "Btn_Confirm");
        confirmBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.setBase();
            }
        }, this);

        this._txtBase = game.findUI(this._node, "ND_Value");
        this._btnAdd = game.findUI(this._node, "Btn_Add");
        this._btnMinus = game.findUI(this._node, "Btn_Minus");
        this._slider = game.findUI(this._node, "ND_Slider");
        
        this._value = 0;

        this.registerEvent();
    },

    // 设置底分
    setBase: function () {
        this._callback && this._callback(this._value);
        game.UISystem.closeWindow(this);
    },
    
    // 注册控件事件
    registerEvent: function () {
        this._btnAdd.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (this._value < 4800) {
                    this._value += 300;
                    this._slider.setPercent(Math.round(this._value / 4800 * 100));
                    this._txtBase.setString(this._value);
                }
            }
        }, this);

        this._btnMinus.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (this._value >= 300) {
                    this._value -= 300;
                    this._slider.setPercent(Math.round(this._value / 4800 * 100));
                    this._txtBase.setString(this._value);
                }
            }
        }, this);

        this._slider.addEventListener(function (sender, type) {
            if (type == ccui.Slider.EVENT_PERCENT_CHANGED) {
                var percent = Math.round(sender.getPercent() / 6.25);// 0~16
                // cc.log("==> percent: " + percent);
                this._value = 4800 * (percent / 16);
                this._txtBase.setString(this._value);
            }
        }, this)
    }

});
// 窗口弹出
game.ui.SetBaseWin.popup = function (callback) {
    var win = new game.ui.SetBaseWin(callback);
    game.ui.SetBaseWin.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.SetBaseWin.inst = null;
