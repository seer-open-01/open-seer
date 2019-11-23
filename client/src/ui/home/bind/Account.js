/**
 * Author       : lyndon
 * Date         : 2019-09-25
 * Description  : 账户窗口
 */
game.ui.Account = game.ui.PopupWindow.extend({

    _node       : null,

    _tfName     : null,
    _strName    : "",

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Bind/Account.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init: function () {

        var btnSure = game.findUI(this._node, "Btn_Sure");
        btnSure.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (game.DataKernel.needSeer()) {
                    this._commit();
                }else {
                    this.close();
                }
            }
        }, this);

        this._tfName = game.findUI(this._node, "TF_Account");
        this._tfName.setPlaceHolderColor(cc.color(255, 255, 255, 180));
        this._tfName.setString("");

        this._tfName.addEventListener(function (sender, type) {
            var textField = sender;
            switch (type) {
                case ccui.TextField.EVENT_ATTACH_WITH_IME:
                    cc.log("attach with IME max length:" + textField.getMaxLength());
                    break;
                case ccui.TextField.EVENT_DETACH_WITH_IME:
                    this._strName = textField.getString();
                    break;
                case ccui.TextField.EVENT_INSERT_TEXT:
                    cc.log("insert with IME max length:" + textField.getMaxLength());
                    this._strName = textField.getString();
                    break;
                case ccui.TextField.EVENT_DELETE_BACKWARD:
                    cc.log("delete with IME max length:" + textField.getMaxLength());
                    this._strName = textField.getString();
                    break;
                default:
                    break;
            }
        }, this);
    },

    _commit: function () {
        if (this._strName.length > 8) {
            game.ui.HintMsg.showTipText("必须小于8位字符长度！", cc.p(640, 360), 3);
            return;
        }

        if (this._strName == "") {
            game.ui.HintMsg.showTipText("账户不能为空！", cc.p(640, 360), 3);
            game.UISystem.hideLoading();
            return;
        }

        game.UISystem.showLoading("正在注册SEER账户！");
        game.hallNet.sendMessage(protocol.ProtoID.SEER_NEW_ACCOUNT, {
            account: this._strName
        });
    },
    close: function () {
        game.ui.Account.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});
game.ui.Account.inst = null;

game.ui.Account.popup = function () {
    var win = new game.ui.Account();
    game.ui.Account.inst = win;
    game.UISystem.popupWindow(win);
};