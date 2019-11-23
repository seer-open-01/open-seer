/**
 * Author       : lyndon
 * Date         : 2019-07-10
 * Description  : 绑定窗口
 */
game.ui.BindWindow = game.ui.PopupWindow.extend({

    _node       : null,
    _editBox    : null,
    _bg         : null,
    _preUid     : null,

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Bind/BindWin.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init: function () {

        var btnSure = game.findUI(this._node, "Btn_Sure");
        btnSure.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (game.DataKernel.needBind()) {
                    this._commit();
                }else {
                    this.close();
                }
            }
        }, this);
        this._preUid = game.findUI(this._node, "ND_PreUid");
        this._preUid.setVisible(false);
        var popNode = game.findUI(this._node, "ND_PopWin");
        this._bg = game.findUI(this._node, "ND_Bg");
        this._editBox = new cc.EditBox(this._bg.getContentSize(),
            new cc.Scale9Sprite("res/Home/Bind/IMG_2.png"));
        this._editBox.setAnchorPoint(0, 0.5);
        this._editBox.setPosition(this._bg.getPosition());
        this._editBox.setMaxLength(6);
        this._editBox.setPlaceHolder("请输入代理ID进行绑定");
        this._editBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this._editBox.setFontColor(cc.color(168, 92, 40));
        this._editBox.setPlaceholderFontSize(24);
        this._editBox.setPlaceholderFontColor(cc.color(168, 92, 40));
        this._editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this._editBox.setDelegate(this);
        popNode.addChild(this._editBox);

        if (!game.DataKernel.needBind()) {
            this._editBox.setVisible(false);
            this._editBox.setEnabled(false);
            this._bg.setVisible(true);
            this._preUid.setString("您的上级ID：" + game.DataKernel.preUid);
            this._preUid.setVisible(true);
        }
    },

    editBoxEditingDidBegin: function (editBox) {
        cc.log("editBox " + editBox.getName() + " DidBegin !");
    },

    editBoxEditingDidEnd: function (editBox) {
        cc.log("editBox " + editBox.getName() + " DidEnd !");
    },

    editBoxTextChanged: function (editBox, text) {
        cc.log("editBox " + editBox.getName() + ", TextChanged, text: " + text);
    },

    editBoxReturn: function (editBox) {
        cc.log("editBox " + editBox.getName() + " was returned !");
    },

    _commit: function () {
        var superUid = this._editBox.getString();
        if (!this.testNum(superUid)) {
            game.ui.HintMsg.showTipText("请输入六位纯数字ID！", cc.p(640, 360), 3);
            return;
        }
        game.hallNet.sendMessage(protocol.ProtoID.TG_BIND, {
            superUid: superUid
        });
    },
    /**
     * 验证6位纯数字
     * @param num
     * @returns {boolean}
     */
    testNum: function (num) {
        var reg = /^[0-9]{6}$/;
        return reg.test(num);
    },

    close: function () {
        game.ui.BindWindow.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});
game.ui.BindWindow.inst = null;

game.ui.BindWindow.popup = function () {
    var win = new game.ui.BindWindow();
    game.ui.BindWindow.inst = win;
    game.UISystem.popupWindow(win);
};