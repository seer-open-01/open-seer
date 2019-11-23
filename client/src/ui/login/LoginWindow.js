// ===== 登陆界面UI ========================================================================================

game.ui.LoginWindow = cc.Layer.extend({

    _node                       : null,         // 本节点

    _agreementChkBox            : null,         // 协议复选框
    _loginBtn                   : null,         // 登录按钮
    _anonymousLoginBtn          : null,         // 游客登录按钮
    _agreementBtn               : null,         // 用户协议

    _loginTextBtn               : null,

    _loginHandler               : null,         // 登录处理程序
    _anonymousLoginHandler      : null,         // 登录处理程序
    _agreementClickedHandler    : null,         // 同意用户协议

    ctor : function () {
        this._super();

        // 加载UI控件
        this._node = ccs.load("res/Login/Login.json").node;
        this.addChild(this._node);

        this._init();

        return true;
    },

    _init : function () {

        // 用户协议复选框
        this._agreementChkBox = game.findUI(this._node, "ND_Agreement");

        // 登陆按钮
        this._loginBtn = game.findUI(this._node, "ND_Login");
        this._loginBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("==> 点击登录按钮");
                this._loginHandler && this._loginHandler();
            }
        }, this);

        // 游客登陆按钮
        this._anonymousLoginBtn = game.findUI(this._node, "ND_AnonymousLogin");
        this._anonymousLoginBtn.addTouchEventListener(function(sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._anonymousLoginHandler && this._anonymousLoginHandler();
            }
        }, this);

        // 用户协议
        this._agreementBtn = game.findUI(this._node, "ND_AgreementContent");
        this._agreementBtn.addTouchEventListener(function(sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("==>点击用户协议");
                this._agreementClickedHandler && this._agreementClickedHandler();
            }
        }, this);

        if (Utils.isCurrentVersionIOS(game.config.APP_VERSION)) {
            this._loginBtn.setVisible(true);
            this._loginBtn.setTouchEnabled(true);
            this._anonymousLoginBtn.setVisible(false);
            this._anonymousLoginBtn.setTouchEnabled(false);
        } else {
            this._loginBtn.setVisible(false);
            this._loginBtn.setTouchEnabled(false);
            this._anonymousLoginBtn.setVisible(true);
            this._anonymousLoginBtn.setTouchEnabled(true);
        }

        // 显示游戏版本号
        var verLabel = game.findUI(this._node, "ND_Version");
        var verString = "V" + game.config.MAJOR_VER;
        verString += ".";
        verString += game.config.SUB_VER;
        verString += ".";
        verString += game.config.MINOR_VER;
        verLabel.setString("版本号：" + verString);
        verLabel.setVisible(true);

        if (! Utils.isCurrentVersionIOS(game.config.APP_VERSION) ) {
            verLabel.setVisible(false);
        }

        // OPENID输入框（在非移动设备上使用）
        var textField = game.findUI(this._node, "ND_Input");
        if (!game.config.USE_WX) {
            cc.log(textField);
            textField.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            textField.addEventListener(function (sender, type) {
                var textField = sender;
                switch (type) {
                    case ccui.TextField.EVENT_ATTACH_WITH_IME:
                        cc.log("attach with IME max length:" + textField.getMaxLength());
                        break;
                    case ccui.TextField.EVENT_DETACH_WITH_IME:
                        cc.log("detach with IME max length:" + textField.getMaxLength());
                        cc.log("输入的OPENID：" + textField.getString());
                        game.DataKernel.openid = textField.getString();
                        game.DataKernel.name = game.DataKernel.openid.substr(0, 6);
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
        } else {
            textField.setEnabled(false);
            textField.setVisible(false);
        }
    },

    stopAllActions: function () {

    },

    /**
     * 用户协议是否同意
     * @returns {*|Boolean|boolean}
     */
    isAgreementOk: function() {
        return this._agreementChkBox.isSelected();
    },

    /**
     * 登陆按钮被点击
     * @param callback
     */
    onLoginBtnClick: function(callback) {
        this._loginHandler = callback;
    },

    /**
     * 游客登录按钮被点击
     */
    onAnonymousLoginBtnClick: function(callback) {
        this._anonimousLoginHandler = callback;
    },

    /**
     * 设置登录按钮状态
     * @param yes
     */
    setBtnEnabled: function(yes) {
        this._loginBtn.setEnabled(yes);
    },
    /**
     * 同意用户协议处理程序
     */
    onAgreeUserPolicyClicked: function (handler) {
        this._agreementClickedHandler = handler;
    }
});