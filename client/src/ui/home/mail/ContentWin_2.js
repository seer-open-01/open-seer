/**
 * Created by lyndon on 2017.12.23.
 */
// 带奖励附件的二级弹窗
game.ui.MailContentWin2 = game.ui.PopupWindow.extend({

    _uiNode: null,

    _contentLabel: null, // 邮件文字内容控件
    _titleLabel: null, // 邮件标题控件
    _timeLabel: null, // 时间戳
    _senderLabel: null, // 发件人

    _textSV: null, // 文字滚动容器
    _rewardSV: null, // 奖励滚动容器
    _items: [],   // 奖励Item数组

    _getBtn: null, // 领取奖励按钮
    _width: 100,  // 奖励Item宽度

    _info: null, // 二级弹窗信息

    ctor: function (info) {
        this._super();
        this._uiNode = ccs.load("res/Home/Mail/MailContent_2.json").node;
        this._info = info;
        this._init();
        this.addChild(this._uiNode);

        return true;
    },

    _init: function () {
        this._titleLabel = game.findUI(this._uiNode, "Label_Title");
        this._timeLabel = game.findUI(this._uiNode, "Label_Time");
        this._senderLabel = game.findUI(this._uiNode, "Label_Sender");

        this._contentLabel = new cc.Label("邮件内容", MailConfig.Font.RES);
        this._contentLabel.setSystemFontSize(MailConfig.Font.SIZE);
        this._contentLabel.setColor(MailConfig.Font.COLOR);

        this._textSV = game.findUI(this._uiNode, "SV_Content");
        this._rewardSV = game.findUI(this._uiNode, "SV_Reward");


        this._getBtn = game.findUI(this._uiNode, "Btn_Get");

        this._getBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._onGetClick(sender, type);
            }
        }, this);

        if (this._info.status == 4) {
            this._getBtn.setEnabled(false);
        }

        var confirmBtn = game.findUI(this._uiNode, "Btn_Confirm");
        confirmBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        var delBtn = game.findUI(this._uiNode, "Btn_Del");
        delBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._onDeleteClick();
            }
        }, this);

        this._info && this._setInfo();
    },

    _setInfo: function () {
        //cc.log("附件邮件详细信息 " + JSON.stringify(this._info));
        // 标题
        this._titleLabel.setString(this._info.title);
        // 时间戳
        var date = new Date(this._info["stamp"] * 1000);
        var str = date.format("yyyy-MM-dd");
        //cc.log("======== 时间 "+str);
        this._timeLabel.setString("时间："+str);
        // 寄件人
        this._senderLabel.setString("发件人："+this._info["sender"]);
        // 内容
        this._contentLabel.setString(this._info.content);
        this._contentLabel.setWidth(768.0);

        var contentHeight = this._contentLabel.getContentSize().height;
        contentHeight = Math.max(contentHeight, 100);
        this._textSV.setInnerContainerSize(cc.size(770, contentHeight));

        this._contentLabel.setPositionY(contentHeight);
        this._contentLabel.setAnchorPoint(0, 1.0);

        this._textSV.addChild(this._contentLabel);

        this._loadRewardView();
    },
    /**
     * 加载奖品附件的滚动容器
     * @private
     */
    _loadRewardView: function () {
        var goods = this._info.goods;
        this._rewardSV.removeAllChildren();
        this._items = [];
        for (var i = 0; i < goods.length; ++i) {
            var temp = new game.ui.MailWindow.RewardItme(this._rewardSV, goods[i]);
            this._items.push(temp);
        }
        this._layOut();
    },
    /**
     * 奖品列表的排序
     * @private
     */
    _layOut: function () {
        var contentWidth = this._items.length * this._width;
        contentWidth = Math.max(770.00, contentWidth);
        this._rewardSV.setInnerContainerSize(cc.size(contentWidth, 90));
        this._rewardSV.setScrollBarEnabled(false);
        this._rewardSV.scrollToLeft(0.2, true);
        var posX = 0;
        for (var i = 0; i < this._items.length; ++i) {
            this._items[i].getNode().setPosition(posX, -2);
            posX += this._width;
        }
    },

    _onGetClick: function () {
        cc.log("领取按钮被点击！" + this._info.id);
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_FETCH_MAIL, {id: this._info.id});
        this._getBtn.setEnabled(false);
    },

    _onDeleteClick: function () {
        cc.log("删除按钮被点击！" + JSON.stringify(this._info));
        if (this._info.goods && this._info.status <= 3) {
            game.ui.HintMsg.showTipText( "请先领取附件!", cc.p(640, 360), 1.0);
            return;
        }
        game.ui.TipWindow.popup({tipStr: "是否要删除该邮件？", showNo: true}, function () {
            game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_DEL_MAIL, {ids:[this._info.id]});
            game.UISystem.closeWindow(this);
        }.bind(this));
    }
});
game.ui.MailContentWin2.popup = function (info) {
    var win = new game.ui.MailContentWin2(info);
    game.UISystem.popupWindow(win);
};
