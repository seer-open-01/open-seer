/**
 * Author       : lyndon
 * Date         : 2018-05-23
 * Description  : 实名认证
 */
game.ui.RealNameWindow = game.ui.PopupWindow.extend({
    _node           : null,

    _tfName         : null,         // 姓名控件
    _tfId           : null,         // 身份证号控件
    _btnConfirm     : null,         // 确定按钮
    _btnClose       : null,         // 关闭按钮
    _btnCancel      : null,         // 取消按钮

    _strName        : "",           // 名字字符串
    _strId          : "",           // 身份证号字符串

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Home/RealName/RealNameWindow.json").node;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init : function () {
        var uiNode = game.findUI(this._node, "ND_PopWin");

        this._tfName = game.findUI(uiNode, "TF_Name");
        this._tfName.setPlaceHolderColor(cc.color(255, 255, 255, 180));
        this._tfName.setString("");

        this._tfId = game.findUI(uiNode, "TF_ID");
        this._tfId.setPlaceHolderColor(cc.color(255,255,255,180));
        this._tfId.setString("");

        this._btnConfirm = game.findUI(this._node, "BTN_Confirm");
        this._btnCancel = game.findUI(this._node, "BTN_Cancel");

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


        this._tfId.addEventListener(function (sender, type) {
            var textField = sender;
            switch (type) {
                case ccui.TextField.EVENT_ATTACH_WITH_IME:
                    cc.log("attach with IME max length:" + textField.getMaxLength());
                    break;
                case ccui.TextField.EVENT_DETACH_WITH_IME:
                    this._strId = textField.getString();
                    break;
                case ccui.TextField.EVENT_INSERT_TEXT:
                    cc.log("insert with IME max length:" + textField.getMaxLength());
                    this._strId = textField.getString();
                    break;
                case ccui.TextField.EVENT_DELETE_BACKWARD:
                    cc.log("delete with IME max length:" + textField.getMaxLength());
                    this._strId = textField.getString();
                    break;
                default:
                    break;
            }
        }, this);

        this._btnConfirm.addTouchEventListener(this._onConfirmClick, this);

        this._btnCancel.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);
    },

    /**
     * 确定按钮点击回调
     * @param sender
     * @param type
     * @private
     */
    _onConfirmClick: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {

            game.Audio.playBtnClickEffect();

            cc.log("姓名长度： "+ this._strName.length);
            cc.log("ID长度： "+ this._strId.length);

            if (this._strName.length < 1) {
                game.ui.HintMsg.showTipText("姓名不能为空！", cc.p(640, 360), 2);
                return;
            }

            var reg=/^[\u4E00-\u9FA5]+$/;
            if (!reg.test(this._strName) || this._strName.length < 2 || this._strName.length > 6) {
                game.ui.HintMsg.showTipText("请输入真实姓名！", cc.p(640, 360), 2);
                return;
            }

            if (this._strId == "") {
                game.ui.HintMsg.showTipText("身份证ID不能为空！", cc.p(640, 360), 2);
                return;
            }

            if(!game.Utils.IDCard.isValidIdentityCard(this._strId)){
                game.ui.HintMsg.showTipText("请输入有效的身份证ID！", cc.p(640, 360), 2);
                return;
            }

            // 发送实名认证消息给服务器
            cc.log("==> 发送实名认证消息给服务器");
            game.hallNet.sendMessage(protocol.ProtoID.CLIENT_REAL_NAME, {identity: this._strId, name: this._strName});
        }
    }
});

// 实名认证弹窗
game.ui.RealNameWindow.popup = function () {
    var wnd = new game.ui.RealNameWindow();
    game.UISystem.popupWindow(wnd);
};