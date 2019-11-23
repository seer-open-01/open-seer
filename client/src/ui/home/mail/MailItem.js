/**
 * Created by lyndon on 2017.12.21.
 */
// 一条邮件信息
game.ui.MailItem = cc.Class.extend({
    _parentNode: null,
    _node: null,

    _titleLabel: null, // 内容Label

    _checkBtn: null, // 查看按钮
    _itemBtn: null, // 整个条目响应的按钮

    _mailPic_1: null, // 邮件图标关闭状态
    _mailPic_2: null, // 邮件图标开启状态
    _dotPic: null, // 未领取红点

    _pin_1: null, // 红色曲别针
    _pin_2: null, // 灰色曲别针

    _mailInfo: null, // 邮件信息
    _labelTime: null,     // 时间显示

    ctor: function (mail) {
        this._parentNode = ccs.load("res/Home/Mail/MailItem.json").node;
        this._node = game.findUI(this._parentNode, "Btn_Item");

        this._node.removeFromParent(false);
        this._mailInfo = mail;
        this._init();

        return true;
    },

    _init: function () {
        this._titleLabel = game.findUI(this._node, "Label_Title");

        this._checkBtn = game.findUI(this._node, "Btn_Check");

        this._checkBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.__onCheck(sender, type);
            }
        }, this);

        this._node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.__onCheck(sender, type);
            }
        }, this);

        this._mailPic_1 = game.findUI(this._node, "ND_Mail_1");
        this._mailPic_2 = game.findUI(this._node, "ND_Mail_2");
        this._dotPic = game.findUI(this._node, "ND_Dot");

        this._pin_1 = game.findUI(this._node, "ND_Pin_1");
        this._pin_2 = game.findUI(this._node, "ND_Pin_2");

        this._labelTime = game.findUI(this._node, "ND_Time");

        this._mailInfo && this._setInfo();
    },
    /**
     * 设置邮件信息
     * @private
     */
    _setInfo: function () {
        //cc.log("MailItem-_mailInfo " + JSON.stringify(this._mailInfo));
        this._setContentStr();
        this._setMailStatus();
    },
    /**
     * 设置文本内容
     * @private
     */
    _setContentStr: function () {
        var str = "";
        if (this._mailInfo.title) {
            str += this._mailInfo.title;
        }
        this._titleLabel.setString(str);

        var now = new Date();
        var time = Math.round(now * 0.001 - this._mailInfo.stamp);
        // cc.log("======================== " + time);
        if (time > 86400) {// 显示天
            var day = Math.round(time / 86400);
            this._labelTime.setString("" + day + "天前");
        } else if (time > 3600 && time <= 86400) { // 显示小时
            var hour = Math.round(time / 3600);
            this._labelTime.setString("" + hour + "小时前");
        }else {// 显示刚刚
            this._labelTime.setString("刚刚");
        }

    },
    /**
     * 设置邮件状态
     * @private
     */
    _setMailStatus: function () {
        this.__setMailOpen(false);
        this.__showDot(false);
        this.__setPin(MailConfig.Pin.NON);
        switch (this._mailInfo.status) {
            case 1:
                this.__showDot(true);
                this.__setPin(MailConfig.Pin.RED);
                break;
            case 2:
                this.__showDot(true);
                break;
            case 3:
                this.__setMailOpen(true);
                if (this._mailInfo.goods != null) {
                    this.__setPin(MailConfig.Pin.RED);
                }
                break;
            case 4:
                this.__setMailOpen(true);
                if (this._mailInfo.goods != null) {
                    this.__setPin(MailConfig.Pin.GREY);
                }
                break;
        }
    },
    /**
     * 显示红点
     * @param bool
     * @private
     */
    __showDot: function (bool) {
        this._dotPic.setVisible(bool);
    },
    /**
     * 设置信封的打开状态
     * @param bool
     * @private
     */
    __setMailOpen: function (bool) {
        this._mailPic_2.setVisible(bool);
        this._mailPic_1.setVisible(!bool);
    },
    /**
     * 设置回形针状态
     * @private
     */
    __setPin: function (type) {
        this._pin_1.setVisible(false);
        this._pin_2.setVisible(false);
        if (type == MailConfig.Pin.RED) {
            this._pin_1.setVisible(true);
        } else if (type == MailConfig.Pin.GREY) {
            this._pin_2.setVisible(true);
        }
    },
    /**
     * 外部调用阅读邮件后更新状态
     */
    updateAfterRead: function () {
        this.__setMailOpen(true);
        this.__showDot(false);
    },
    /**
     * 外部调用领取奖励和更新状态
     */
    updateAfterFetch: function () {
        // 领取回调设置曲别针的状态
        this.__setPin(MailConfig.Pin.GREY);
    },
    /**
     * 本节点点击回调
     * @param sender
     * @param type
     * @private
     */
    __onCheck: function (sender, type) {
        cc.log("查看按钮被点击！" + this._mailInfo.id);
        // 如果邮件状态未被查看 则请求read接口
        if (this._mailInfo.status < 3) {
            game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_LOOK_MAIL,{id: this._mailInfo.id});
        } else {
            //cc.log("邮件已读 不用请求read接口！");
        }

        if (this._mailInfo.goods != null) {
            // 邮件详情弹窗 分有附件和没附件两种
            game.ui.MailContentWin2.popup(this._mailInfo);
        } else {
            game.ui.MailContentWin.popup(this._mailInfo);
        }
    },
    /**
     * 获取本节点
     * @returns {null}
     */
    getNode: function () {
        return this._node;
    }
});