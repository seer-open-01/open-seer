/**
 * Created by lyndon on 2017.12.21.
 */
// 邮件配置信息
var MailConfig = {};
MailConfig.Font = {
    SIZE: 26,
    COLOR: cc.color(150, 117, 80),
    RES: "res/Fonts/YaHei.ttf"
};
MailConfig.Reward = {
    BEAN: 1, // 金贝奖励
    CARD: 2  // 钻石奖励
};
MailConfig.Pin = {
    NON: 0,
    RED: 1,
    GREY: 2
};
// 邮件一级弹窗
game.ui.MailWindow = game.ui.PopupWindow.extend({
    _uiNode: null,

    _tip: null, // 温馨提示文字
    _sv: null, // 邮件列表滚动容器
    _noMail: null, // 没有邮件文字提示

    _items: [],   // 邮件Item数组
    _mails: [],   // 排序后的邮件

    _loading            : null,         // 加载节点
    _circle             : null,         // 特效光圈
    _peach              : null,         // 特效图案

    _height: 104,  // 邮件Item高度

    _callback: null, // 邮箱关闭回调

    _haveUnreadMail: false, // 有未读邮件

    ctor: function (callback) {
        this._super();
        this._uiNode = ccs.load("res/Home/Mail/MailWindow.json").node;
        this._callback = callback;
        this._init();
        this.addChild(this._uiNode);

        return true;
    },

    _init: function () {
        this._tip = game.findUI(this._uiNode, "Text_Tip");
        this._sv = game.findUI(this._uiNode, "SV_List");
        this._noMail = game.findUI(this._uiNode, "Text_NoMail");
        this._tip.setVisible(false);
        this._noMail.setVisible(false);

        this._loading = game.findUI(this._uiNode, "ND_Loading");
        this._circle = game.findUI(this._loading, "Loading_1");
        this._peach = game.findUI(this._loading, "Loading_2");

        var closeBtn = game.findUI(this._uiNode, "Btn_Close");
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._checkAllRead();
                this._callback && this._callback(this._haveUnreadMail);
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        setTimeout(function () {
            this._requireMail();
        }.bind(this), 300);

    },
    /**
     * 请求服务器数据
     * @private
     */
    _requireMail: function () {
        this.showLoading();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_MAIL,{});
    },
    /**
     * 邮件排序并存入数组
     * @param mails
     */
    loadMail: function (mails) {
        var mails_1 = []; // 未读邮件
        var mails_2 = []; // 已读未领取邮件
        var mails_3 = []; // 已读已领取邮件

        for (var i = 0; i < mails.length; ++i) {
            mails[i].isRead = true;
            if (mails[i].status == 1 || mails[i].status == 2) {
                mails[i].isRead = false;
                mails_1.push(mails[i]);
            } else if (mails[i].status == 3) {
                mails_2.push(mails[i]);
            } else {
                mails_3.push(mails[i]);
            }
        }

        mails_1 = mails_1.sort(this.__compare);
        mails_2 = mails_2.sort(this.__compare);
        mails_3 = mails_3.sort(this.__compare);

        this._mails = mails_1.concat(mails_2, mails_3);

        if (this._mails) {
            // cc.log("排序后的 邮件 " + JSON.stringify(this._mails));
            this._loadScrollView();
        }
    },

    __compare: function (a, b) {
        var x = a["stamp"];
        var y = b["stamp"];

        return x < y ? 1 : -1;
    },
    /**
     * 加载滚动容器
     * @private
     */
    _loadScrollView: function () {
        this._sv.removeAllChildren();
        this._items = [];

        if (this._mails.length < 1) {
            this.showNoMail(true);
            this._sv.setInnerContainerSize(cc.size(944.0, 440.0));
            this.hideLoading();
            return;
        }

        cc.log("=== mailWin loadScrollView ===");
        for (var i = 0; i < this._mails.length; ++i) {
            var temp = new game.ui.MailItem(this._mails[i]);
            this._items.push(temp);
        }

        this._layOut();
    },
    /**
     * 邮件列表的排序
     * @private
     */
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 440.00);
        this._sv.setInnerContainerSize(cc.size(944, contentHeight));
        this._sv.scrollToTop(0.2, true);
        var posY = contentHeight;
        for (var i = 0; i < this._items.length; ++i) {
            posY -= this._height;
            this._items[i].getNode().setPositionY(posY);
            this._sv.addChild(this._items[i].getNode());
        }

        this.hideLoading();
    },
    /**
     * 删除指定邮件并更新列表
     * @param mailIds
     */
    deleteMail: function (mailIds) {
        for (var j = 0; j < mailIds.length; ++j) {
            for (var i = 0; i < this._mails.length; ++i){
                if (this._mails[i].id == mailIds[j]) {
                    this._mails.splice(i, 1);
                }
            }
        }
        if(this._mails.length == 0){
            this.showNoMail(true);
        }
        this._loadScrollView();
        // 删除文字提示
        game.ui.HintMsg.showTipText("  删除成功！ ", cc.p(640, 360), 2.0);
    },
    /**
     * 读邮件回调
     * @param mailId
     */
    readMail: function (mailId) {
        cc.log("=====阅读的邮件是 " + mailId);
        for (var i = 0; i < this._mails.length; ++i) {
            if (this._mails[i].id == mailId) {
                this._mails[i].isRead = true;
                this._items[i].updateAfterRead();
                break;
            }
        }
    },
    /**
     * 拉取奖励
     * @param mailId
     */
    fetchMail: function (mailId) {
        cc.log("=====领取的邮件是 " + mailId);
        for (var i = 0; i < this._mails.length; ++i) {
            if (this._mails[i].id == mailId) {
                this._mails[i].status = 4;
                this._items[i].updateAfterFetch();
                break;
            }
        }
    },
    /**
     * 检查所有邮件是否未读
     * @private
     */
    _checkAllRead: function () {
        var haveUnread = false;
        for (var i = 0; i < this._mails.length; ++i) {
            if (this._mails[i].isRead == false) {
                haveUnread = true;
                break;
            }
        }
        this._haveUnreadMail = haveUnread;
    },
    /**
     * 显示没有邮件提示
     * @param show
     * @private
     */
    showNoMail: function (show) {
        this._noMail.setVisible(show);
        this._tip.setVisible(!show);
    },

    /**
     * 显示loading动画
     */
    showLoading: function () {
        this._loading.setVisible(true);
        this._circle.stopAllActions();
        this._circle.runAction(cc.RotateBy(1.0, 360).repeatForever());

        this._peach.stopAllActions();
        this._peach.runAction(cc.Sequence(cc.scaleTo(1.0, -1, 1), cc.scaleTo(1.0, 1, 1)).repeatForever());
    },
    /**
     * 隐藏loading动画
     */
    hideLoading: function () {
        this._circle.stopAllActions();
        this._peach.stopAllActions();
        this._loading.setVisible(false);
    }
});
// 邮件列表弹出方法
game.ui.MailWindow.popup = function (callback) {
    var win = new game.ui.MailWindow(callback);
    game.ui.MailWindow.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.MailWindow.inst = null;