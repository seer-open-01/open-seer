// ==== 系统公告弹窗 =======================================================
game.ui.NoticeWindow = game.ui.PopupWindow.extend({
    _node           : null,

    _btnClose       : null,         // 关闭按钮
    _noticeScView   : null,         // 滑动区域

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Common/Notice/NoticeWindow.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {

        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        this._noticeScView = game.findUI(this._node, "ND_CScrollView");

        this._showNoticeList();
    },

    _showNoticeList : function () {
        var list = game.ui.NoticeWindow.list;
        cc.log("==> list size = " + list.length);
        this._noticeScView.removeAllChildren();
        // init scrollView.
        var itemHeight = 80;
        this._noticeScView.innerHeight = Math.max(460, list.length * itemHeight + 10);
        var canvasHeight = this._noticeScView.innerHeight;

        var loadItemCount = 0;
        for (var i = list.length - 1; i >= 0; --i) {
            var item = list[i];
            loadItemCount++;
            var notice = item.notice;
            var time = Date.createFromStamp(item.stamp).format("hh:mm");
            var itemView = this._loadOneNotice("" + time, "                         " + notice.content);
            itemView.setPosition(cc.p(0, canvasHeight - itemHeight * loadItemCount));
            this._noticeScView.addChild(itemView);
        }

        // scroll to top.
        // this._noticeScView.scrollToTop(0.1, true);
    },

    _loadOneNotice : function (time, notice) {
        var ui = ccs.load("res/Common/Notice/NoticeWindowItem.json").node;
        game.findUI(ui, "ND_Time").setString(time);
        game.findUI(ui, "ND_Text").setString(notice);
        return ui;
    }
});

game.ui.NoticeWindow.list = [];

/**
 * 添加历史系统消息
 * @param notice
 */
game.ui.NoticeWindow.saveNotice = function (notice) {
    var stamp = Date.getStamp();
    var list = game.ui.NoticeWindow.list;

    if (notice) {
        var info = {stamp: "" + stamp, notice: notice};
        list.push(info);
        while (list.length > 10) {
            list.shift();
        }
    }
};

/**
 * 弹窗
 */
game.ui.NoticeWindow.popup = function () {
    var win = new game.ui.NoticeWindow();
    game.UISystem.popupWindow(win);
};
