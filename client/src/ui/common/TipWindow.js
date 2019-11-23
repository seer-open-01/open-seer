// ==== 通用提示窗口 =========================================

game.ui.TipWindow = game.ui.PopupWindow.extend({

    _node           : null,         // 本节点

    _args           : null,         // 外部参数
    _callback       : null,         // 确定回调
    _clsCallback    : null,         // 取消回调
    /**
     * 构造函数
     * @param args  { uiFile, tipStr}
     * @param callback
     * @param clsCallback
     * @returns {boolean}
     */
    ctor : function (args, callback, clsCallback) {
        this._super();

        this._args = args || {};
        this._callback = callback;
        this._clsCallback = clsCallback;

        // 加载UI控件
        this._node= ccs.load("res/Tip/Tip.json").node;
        this.addChild(this._node);

        this._init();

        return true;
    },

    _init : function () {
        var tipLabel = game.findUI(this._node, "ND_Tip");
        if (this._args.tipStr)
            tipLabel && tipLabel.setString(this._args.tipStr);
        if (this._args.fontSize)
            tipLabel.setFontSize(this._args.fontSize);

        var singleYes = game.findUI(this._node, "ND_Single_Yes");
        singleYes.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                this._callback && this._callback(this);
            }
        }, this);

        var closeBtn = game.findUI(this._node, "ND_Close");
        closeBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                this._clsCallback && this._clsCallback(this);
            }
        }, this);

        closeBtn.setVisible(this._args.showClose);

        var okBtn = game.findUI(this._node, "ND_Yes");
        okBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                this._callback && this._callback(this);
            }
        }, this);

        var no = game.findUI(this._node, "ND_No");
        no.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                this._clsCallback && this._clsCallback(this);
            }
        }, this);

        if(this._args.showNo) {
            okBtn.setVisible(true);
            okBtn.setTouchEnabled(true);
            no.setVisible(true);
            no.setTouchEnabled(true);
            singleYes.setVisible(false);
            singleYes.setTouchEnabled(false);
        } else {
            okBtn.setVisible(false);
            okBtn.setTouchEnabled(false);
            no.setVisible(false);
            no.setTouchEnabled(false);
            singleYes.setVisible(true);
            singleYes.setTouchEnabled(true);
        }
    }
});

/**
 *
 * @param opts          json参数 showNo : 是否显示取消按钮， showClose : 是否显示关闭按钮, tipStr : 需要显示的提示文字字符串
 * @param callback      确定按钮回调
 * @param clsCallback   取消关闭按钮回调
 */
game.ui.TipWindow.popup = function(opts, callback, clsCallback) {
    var tipWin = new game.ui.TipWindow(opts, callback, clsCallback);
    game.ui.TipWindow.inst = tipWin;
    game.UISystem.popupWindow(tipWin);
};
game.ui.TipWindow.inst = null;