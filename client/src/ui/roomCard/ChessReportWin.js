/**
 * Author       : lyndon
 * Date         : 2018-08-08
 * Description  : 象棋战绩弹窗
 */
game.ui.ChessReportWin = game.ui.PopupWindow.extend({
    _node               : null,

    _sv                 : null,         // 列表滚动容器
    _noReport           : null,         // 没有文字提示
    _items              : [],           // Item数组
    _reports            : null,         // 数据
    _loading            : null,         // 加载节点
    _circle             : null,         // 特效光圈
    _peach              : null,         // 特效图案

    _height             : 208,          // Item高度

    ctor: function () {
        this._super();
        this._node = ccs.load("res/RoomCard/Report/ReportWin.json").node;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {

        this._sv = game.findUI(this._node, "ND_SV");
        this._noReport = game.findUI(this._node, "ND_Tip");
        this._loading = game.findUI(this._node, "ND_Loading");
        this._circle = game.findUI(this._loading, "Loading_1");
        this._peach = game.findUI(this._loading, "Loading_2");
        this._noReport.setVisible(false);

        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        setTimeout(function () {
           this._requireReport();
        }.bind(this), 300);
    },
    /**
     * 请求服务器数据
     * @private
     */
    _requireReport: function () {
        this.showLoading();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_CHESS_REPORT,{
            uid: game.DataKernel.uid
        });
    },
    /**
     * 加载战绩数据
     * @param reports
     * @private
     */
    loadReports: function (reports) {
        this._reports = reports;
        if (this._reports) {
            // cc.log("战绩数据 " + JSON.stringify(this._reports));
            this._loadScrollView();
        }
    },
    /**
     * 加载滚动容器
     * @private
     */
    _loadScrollView: function () {
        this._sv.removeAllChildren();
        this._items = [];
        var reports = this._reports;
        if (reports.length < 1) {
            this.showNoReport(true);
            this._sv.setInnerContainerSize(cc.size(962.0, 486.0));
            this.hideLoading();
            return;
        }
        cc.log("=== reportWin loadScrollView ===");
        this.showNoReport(false);
        for (var i = 0; i < reports.length; ++i) {
            var temp = new game.ui.ChessReportItem(reports[i]);
            this._items.push(temp);
        }
        // cc.log("============================== " + this._items.length);
        this._layOut();
    },
    /**
     * 邮件列表的排序
     * @private
     */
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 486.00);
        this._sv.setInnerContainerSize(cc.size(962, contentHeight));
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
     * 显示没有战报提示
     * @param show
     * @private
     */
    showNoReport: function (show) {
        this._noReport.setVisible(show);
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

// 弹出方法
game.ui.ChessReportWin.popup = function () {
    var win = new game.ui.ChessReportWin();
    game.ui.ChessReportWin.inst = win;
    game.UISystem.popupWindow(win);
};
game.ui.ChessReportWin.inst = null;