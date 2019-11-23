/**
 * Author       : lyndon
 * Date         : 2018-09-03
 * Description  : 金豆不足弹窗
 */
game.ui.NoBeanTip = game.ui.PopupWindow.extend({
    _node               : null,

    _labelTip           : null,
    _btnCharge          : null,
    _btnBank            : null,

    _tipStr             : "",

    ctor: function (tip) {
        this._super();
        this._node = ccs.load("res/Home/NoBeanTip/NoBeanTip.json").node;
        this._tipStr = tip;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {

        this._btnCharge = game.findUI(this._node, "ND_Charge");
        this._btnBank = game.findUI(this._node, "ND_Bank");
        this._labelTip = game.findUI(this._node, "ND_Tip");

        this._labelTip.setString("" + this._tipStr);

        var closeBtn = game.findUI(this._node, "ND_Close");
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.UISystem.closePopupWindow(this);
                game.ui.NoBeanTip.inst = null;
            }
        }, this);

        this._btnCharge.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.ui.MallWin.popup();
                game.UISystem.closePopupWindow(this);
                game.ui.NoBeanTip.inst = null;
            }
        }, this);

        this._btnBank.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.ui.BankWin.popup();
                // var bank = game.DataKernel.storageBox;
                // if(bank.remember) {
                //     game.ui.BankWin.popup();
                // } else {
                //     if (bank.password) {
                //         game.ui.VerifyWin.popup();
                //     }else {
                //         // 验证弹框
                //         game.ui.TipWindow.popup({
                //             tipStr: "为了您的游戏财产安全\n使用银行功能请设置操作密码。"
                //         }, function (win) {
                //             game.UISystem.closeWindow(win);
                //             game.ui.BankSettingWin.popup();
                //         });
                //     }
                // }
                game.UISystem.closePopupWindow(this);
                game.ui.NoBeanTip.inst = null;
            }
        }, this);

    }
});

// 弹出方法
game.ui.NoBeanTip.popup = function (tip) {
    var win = new game.ui.NoBeanTip(tip);
    game.ui.NoBeanTip.inst = win;
    game.UISystem.popupWindow(win);
};
game.ui.NoBeanTip.inst = null;