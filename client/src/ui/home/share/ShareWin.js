/**
 * 分享弹窗
 */
game.ui.ShareWin = game.ui.PopupWindow.extend({

    _node           : null,

    _btnClose       : null,             // 关闭按钮
    _btnHaoYou      : null,             // 好友
    _btnWeiXin      : null,             // 朋友圈
    _labelTip       : null,             // 提示
    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Share/Share.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },
    _init: function () {
        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnHaoYou = game.findUI(this._node, "BTN_HaoYou");
        this._btnWeiXin = game.findUI(this._node, "BTN_WeiXin");
        this._labelTip = game.findUI(this._node, "ND_Tip");
        var str = "分享游戏，邀请好友填写您的邀请码";
        str += "（" + game.DataKernel.uid + "）" + "您将免费\n获得电子参赛卡。";
        this._labelTip.setString(str);
        this._labelTip.setVisible(false);
        this.registerBtnClick();
    },
    // 注册监听按钮
    registerBtnClick: function () {

        //关闭按钮
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        // 分享好友
        this._btnHaoYou.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("好友分享被点击！");
                this.doShare(false);
            }
        }, this);

        // 分享朋友圈
        this._btnWeiXin.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("朋友圈分享被点击！");
                this.doShare(true);
            }
        }, this);
    },

    //分享
    doShare: function (isCircle) {
        cc.log("==> 分享给朋友");
        if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
            if (isCircle) {
                var shareTitle = "《赛亚麻将》 拿云体育唯一指定官方益智类游戏。";
                var shareMsg = "快和我一起来玩吧！";
            } else {
                shareTitle = "《赛亚麻将》拿云体育唯一指定官方益智类游戏。";
                shareMsg = "玩游戏，赢Seer，获积分。兑换丰厚礼品！";
            }
            WeChat.share(isCircle, game.config.WECHAT_SHARE_URL + game.DataKernel.uid, shareTitle, shareMsg, function (ok) {});
            game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_SHARE, {
                uid: game.DataKernel.uid,
                isCircle: isCircle
            });
        } else {
            cc.log("==> 没有安装微信");
        }
    }
});
game.ui.ShareWin.popup = function () {
    var win = new game.ui.ShareWin();
    game.UISystem.popupWindow(win);
};
