// ==== 玩家信息头像 ==========================================
game.ui.InfoWin = game.ui.PopupWindow.extend({

    _node               : null,

    _btnClose           : null,         // 关闭按钮
    _spHeadPic          : null,         // 头像图片

    _imgMale            : null,         // 男标识图片
    _imgFemale          : null,         // 女标识图片
    _labelName          : null,         // 玩家的名字
    _labelId            : null,         // 玩家的ID
    _labelIp            : null,         // 玩家的IP

    _fntCard            : null,         // 房卡数量
    _fntBean            : null,         // 金贝数量

    _tfWx               : null,         // 微信号输入框

    _imgAuthentication  : null,         // 实名认证标志
    _imgBound           : null,         // 绑定手机图片

    _btnConfirm         : null,         // 确定按钮
    _btnAuthentication  : null,         // 认证按钮

    _lastClickTime      : 0,            // 上次点击的时间

    _seerAccount        : null,
    _seerID             : null,

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Home/UserInfo/UserInfo.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        var uiNode = game.findUI(this._node, "ND_PopWin");

        this._btnClose = game.findUI(uiNode, "BTN_Close");
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                var now = new Date();
                if (now - this._lastClickTime < 500)
                    return;
                this._lastClickTime = now;
                this.close();
            }
        }, this);

        this._spHeadPic = game.findUI(uiNode, "SP_HeadPic");
        this._imgMale = game.findUI(uiNode, "IMG_Male");
        this._imgFemale = game.findUI(uiNode, "IMG_Female");

        this._labelName = game.findUI(uiNode, "TXT_Name");
        this._labelId = game.findUI(uiNode, "TXT_Id");
        this._labelIp = game.findUI(uiNode, "TXT_Ip");
        this._seerAccount = game.findUI(uiNode, "TXT_SeerAccount");
        this._seerID = game.findUI(uiNode, "TXT_SeerID");

        this._fntCard = game.findUI(uiNode, "FNT_Card");
        this._fntBean = game.findUI(uiNode, "FNT_Bean");

        this._tfWx = game.findUI(uiNode, "TF_WX");

        this._imgAuthentication = game.findUI(uiNode, "IMG_Authentication");
        this._imgBound = game.findUI(uiNode, "IMG_Bound");

        this._btnAuthentication = game.findUI(uiNode, "BTN_Authentication");
        this._btnAuthentication.addTouchEventListener(this._btnAuthenticationClick, this);

        this._btnConfirm = game.findUI(uiNode, "BTN_Confirm");
        this._btnConfirm.addTouchEventListener(this._btnConfirmClick, this);

        //TextField.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this._tfWx.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this._tfWx.setPlaceHolderColor(cc.color(168, 92, 40, 90));
        this._tfWx.setColor(cc.color(168, 92, 40));
        this._tfWx.setEnabled(false);
        this._tfWx.addEventListener(function (sender, type) {
            var textField = sender;
            switch (type) {
                case ccui.TextField.EVENT_ATTACH_WITH_IME:
                    cc.log("attach with IME max length:" + textField.getMaxLength());
                    break;
                case ccui.TextField.EVENT_DETACH_WITH_IME:
                    cc.log("detach with IME max length:" + textField.getMaxLength());
                    cc.log("输入的微信" + textField.getString());
                    break;
                case ccui.TextField.EVENT_INSERT_TEXT:
                    cc.log("insert with IME max length:" + textField.getMaxLength());
                    break;
                case ccui.TextField.EVENT_DELETE_BACKWARD:
                    cc.log("delete with IME max length:" + textField.getMaxLength());
                    break;
                default:
                    break;
            }
        }, this);
    },

    updateInfo : function () {
        var name = game.DataKernel.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._labelName.setString(name);
        
        this._labelId.setString("ID:" + game.DataKernel.uid);
        this._labelIp.setString("IP:" + game.DataKernel.ip);
        this._labelIp.setVisible(false);

        this._fntCard.setString("" + game.DataKernel.card);

        var bean = Utils.formatCoin(game.DataKernel.bean);
        this._fntBean.setString("" + bean);

        this._imgMale.setVisible(game.DataKernel.sex == 1);
        this._imgFemale.setVisible(game.DataKernel.sex == 2);

        // if (game.DataKernel.identity != "") {
        //     this._imgAuthentication.setVisible(true);
        //     this._btnAuthentication.setVisible(false);
        // } else {
        //     this._imgAuthentication.setVisible(false);
        //     this._btnAuthentication.setVisible(true);
        // }

        this._imgBound.setVisible(false);
        this._tfWx.setString(game.DataKernel.signature);
        this._setHeadPic(game.DataKernel.headPic);

        if (game.DataKernel.seer_account == "") {
            this._seerAccount.setString("");
            this._seerID.setString("");
        }else {
            this._seerAccount.setString("SEER账户: " + game.DataKernel.seer_account);
            this._seerID.setString("SEER_ID: " + game.DataKernel.seer_id);
        }
    },

    _setHeadPic : function(headPic) {
        if (headPic) {
            if (headPic != "") {
                cc.textureCache.addImageAsync(headPic, function(tex) {
                    this._spHeadPic.setTexture(tex);
                }.bind(this), this);
            }
        }
    },

    /**
     * 点击了去认证按钮
     * @param sender
     * @param type
     * @private
     */
    _btnAuthenticationClick : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            game.Audio.playBtnClickEffect();
            var now = new Date();
            if (now - this._lastClickTime < 500)
                return;
            this._lastClickTime = now;
            this.close();
            game.ui.RealNameWindow.popup();
        }
    },

    /**
     * 点击了确定按钮
     * @param sender
     * @param type
     * @private
     */
    _btnConfirmClick : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            game.Audio.playBtnClickEffect();
            // var now = new Date();
            // if (now - this._lastClickTime < 500) {
            //     return;
            // }
            // this._lastClickTime = now;
            // var textString = this._tfWx.getString();
            // if(game.DataKernel.signature !== textString){
            //     var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");// 包含汉字的正则表达式
            //     if(reg.test(textString)){
            //         game.ui.HintMsg.showTipText( "交友微信号不能包含汉字！", cc.p(640, 360), 2);
            //         return;
            //     }
            //     // 发送修改微信号信息
            //     game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_SIGNATURE, {
            //         signature : textString
            //     });
            //
            // }
            this.close();
        }
    },

    close : function () {
        game.UISystem.closePopupWindow(this);
    }

});

game.ui.InfoWin._instance = null;

/**
 * 关闭弹窗
 */
game.ui.InfoWin.close = function () {
    if (this._instance) {
        this._instance.close();
    }
};

/**
 * 刷新弹窗
 */
game.ui.InfoWin.updateInfo = function () {
    if (this._instance) {
        this._instance.updateInfo();
    }
};

/**
 * 弹出弹窗
 */
game.ui.InfoWin.popup = function () {
    if (!this._instance) {
        this._instance = new game.ui.InfoWin();
        this._instance.retain();
    }
    game.UISystem.popupWindow(this._instance);
    this._instance.updateInfo();
};