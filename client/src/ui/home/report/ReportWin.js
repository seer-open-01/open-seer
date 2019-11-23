/**
 * Created by lyndon on 2018/06/11.
 *  战绩弹窗
 */
// 邮件一级弹窗
game.ui.ReportWindow = game.ui.PopupWindow.extend({
    _node             : null,

    _sv                 : null,          // 列表滚动容器
    _noReport           : null,          // 没有文字提示

    _items              : [],            // Item数组
    _reports            : null,          // 数据
    _checks             : [],            // CheckBox数组

    _loading            : null,         // 加载节点
    _circle             : null,         // 特效光圈
    _peach              : null,         // 特效图案

    _height             : 208,           // Item高度


    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Report/ReportWin.json").node;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {

        this._sv = game.findUI(this._node, "ND_SV");
        this._noReport = game.findUI(this._node, "TXT_NoReport");
        this._loading = game.findUI(this._node, "ND_Loading");
        this._circle = game.findUI(this._loading, "Loading_1");
        this._peach = game.findUI(this._loading, "Loading_2");
        this.showNoReport(false);
        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        this._checks = [];
        var beanSel = game.findUI(this._node, "CheckBox_1");
        beanSel.id = 1;

        var cardSel = game.findUI(this._node, "CheckBox_2");
        cardSel.id = 2;

        this._checks.push(beanSel);
        this._checks.push(cardSel);

        this._checks.forEach(function (sel) {sel.addEventListener(this.updateSelectSate, this)}.bind(this));

        setTimeout(function () {
            this.updateSelectSate(this._checks[0], ccui.CheckBox.EVENT_SELECTED);
        }.bind(this), 300);
    },

    /**
     * 更新按钮状态
     * @param sender
     * @param type
     */
    updateSelectSate: function (sender, type) {
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            game.Audio.playBtnClickEffect();
            for (var i = 0; i < this._checks.length; ++i) {
                if(sender.id == i + 1){
                    this._checks[i].setEnabled(false);
                } else {
                    this._checks[i].setEnabled(true);
                    this._checks[i].setSelected(false);
                }
            }
            this._requireReport(sender.id);
        }
    },
    /**
     * 请求服务器数据
     * @param mod // 1金币场 2房卡场
     * @private
     */
    _requireReport: function (mod) {
        this.showLoading();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_REPORT,{
            uid: game.DataKernel.uid,
            mod: mod
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
            this._sv.setInnerContainerSize(cc.size(960.0, 510.0));
            this.hideLoading();
            return;
        }

        cc.log("=== reportWin loadScrollView ===");
        this.showNoReport(false);
        for (var i = 0; i < reports.length; ++i) {
            var temp = null;
            var gameType = reports[i].gameType;
            // cc.log("============================== " + gameType);
            // 1麻将 2斗地主  4拼三 5拼十 (象棋单独统计)
            if (gameType == 1) {
                temp = new game.ui.ReportItem(reports[i]);
            }else if (gameType == 2) {
                temp = new game.ui.ReportItem2(reports[i]);
            }else if (gameType == 4) {
                temp = new game.ui.ReportItem3(reports[i]);
            }else if (gameType == 5) {
                temp = new game.ui.ReportItem4(reports[i]);
            }else if (gameType == 7) {
                temp = new game.ui.ReportItem5(reports[i]);
            }else if (gameType == 8) {
                temp = new game.ui.ReportItem6(reports[i]);
            }
            if (temp) {
                this._items.push(temp);
            }
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
        contentHeight = Math.max(contentHeight, 510.00);
        this._sv.setInnerContainerSize(cc.size(960, contentHeight));
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
game.ui.ReportWindow.popup = function () {
    var win = new game.ui.ReportWindow();
    game.ui.ReportWindow.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.ReportWindow.inst = null;