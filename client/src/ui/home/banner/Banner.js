/**
 * Created by Jiyou Mo on 2018/4/27.
 */
// ==== 广告版 ==========================
game.ui.Banner = cc.Class.extend({
    _node               : null,         // 本节点

    _pageView           : null,         // 分页容器
    _indices            : null,         // 分页索引
    _pageIndicesGroup   : [],           // 分页索引群对象

    ctor : function (parentNode) {
        this._node = ccs.load("res/Home/Banner/Banner.json").node;
        parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._pageView =  game.findUI(this._node, "ND_Pages");
        var page2 = game.findUI(this._pageView, "Panel_2");
        var btnCopy = game.findUI(game.findUI(page2, "FileNode"), "Btn_Copy");
        btnCopy.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                // game.ui.HintMsg.showTipText( "复制链接成功！\n您可以通过粘贴来分享游戏下载地址哦~", cc.p(640, 360), 3);
                // Platform.setClipStr("WWW.RQQ.CN");
            }
        }, this);


        this._indices = game.findUI(this._node, "ND_PageIndices");

        var pageIndexBtn = [];
        pageIndexBtn[0] = { ctrl: game.findUI(this._indices, "ND_1"), value : 0 };
        pageIndexBtn[1] = { ctrl: game.findUI(this._indices, "ND_2"), value : 1 };
        pageIndexBtn[2] = { ctrl: game.findUI(this._indices, "ND_3"), value : 2 };
        this._pageIndicesGroup = new game.ui.RadioGroup("PageIndicesGroup", pageIndexBtn, 0);
        pageIndexBtn.forEach(function (btn) {
            btn.ctrl.setTouchEnabled(false);
        });

        this._pageView.addEventListener(this.pageViewEvent, this);

        this._pageIndicesGroup.onSelectChanged(function (radio) {
            // cc.log("轮播图片可以被点击");
            var selIndex = radio.value;
            this._pageView.scrollToPage(selIndex);
        }.bind(this));

        setInterval(function (_this) {
            var selIndex = _this._pageView.getCurrentPageIndex();
            selIndex += 1;
            if (selIndex > 2) {
                selIndex = 0;
            }
            if (selIndex < 0) {
                selIndex = 0;
            }
            _this._pageView.scrollToPage(selIndex);
            _this._pageIndicesGroup.setSelected(selIndex);
        }.bind(this), 10000, this);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    pageViewEvent : function(sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                var selIndex = sender.getCurrentPageIndex();
                if (selIndex > 2) {
                    selIndex = 2;
                }
                this._pageIndicesGroup.setSelected(selIndex);
                break;
            default:
                break;
        }
    }
});