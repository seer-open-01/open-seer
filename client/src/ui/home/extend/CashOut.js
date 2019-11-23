/**
 * Author       : lyndon
 * Date         : 2019-07-18
 * Description  : 提现窗口
 */

game.ui.CashOut = game.ui.PopupWindow.extend({
    _node           : null,
    _bean           : null,
    _can_out        : null,// 可以提币的数量
    _data           : null,// 可以提的数额

    ctor: function (data) {
        this._super();
        this._node = ccs.load("res/Home/Extend/TiBi2.json").node;
        this._data = data;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {
        this._can_out = game.findUI(this._node, "ND_Bean");
        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.close();
            }
        }, this);

        var btnTi = game.findUI(this._node, "BTN_Confirm");
        btnTi.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("提币!");
                this._commit();
            }
        }, this);

        this._bean = game.findUI(this._node, "Fnt_Bean");

        this.setInfo();
        this.updateInfo();
    },

    setInfo: function () {
        this._can_out.setString(Utils.formatCoin2(this._data));
    },

    updateInfo: function () {
        var bean = Utils.formatCoin(game.DataKernel.bean);
        this._bean.setString(bean);
    },

    _commit: function () {
        game.ui.TipWindow.popup({
            tipStr: "确定提奖励到当前用户吗？"
        },function (win) {
            game.UISystem.closeWindow(win);
            game.hallNet.sendMessage(protocol.ProtoID.SEER_CASH_OUT, {});
        }.bind(this));
    },

    // 关闭该窗口
    close: function () {
        game.ui.CashOut.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});

game.ui.CashOut.inst = null;

game.ui.CashOut.popup = function (data) {
    var win = new game.ui.CashOut(data);
    game.ui.CashOut.inst = win;
    game.UISystem.popupWindow(win);
};