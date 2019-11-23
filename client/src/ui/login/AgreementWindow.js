// ==== 登录协议界面 ==================================================

game.ui.AgreementWindow = game.ui.PopupWindow.extend({

    _node               : null,         // 本节点
    _scrollView         : null,         // 滚动去

    ctor :function () {
        this._super();

        // 加载UI控件
        this._node = ccs.load("res/Login/Agreement.json").node;
        this.addChild(this._node);
        this._init();

        return true;
    },

    _init : function () {
        // 初始化控件
        var uiNode = game.findUI(this._node, "ND_PopWin");
        var closeBtn = game.UIHelper.findChildByName(uiNode, "ND_Close");
        closeBtn.addTouchEventListener(function(sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        var contentHeight = 10 * 2048;
        this._scrollView = game.findUI(uiNode, "ND_ScrollView");
        this._scrollView.setInnerContainerSize(cc.size(916, contentHeight));
        for (var i = 1; i <= 10; i++) {
            var spr = cc.Sprite("res/Login/Agreement/" + i + ".png");
            spr.setAnchorPoint(cc.p(0, 0));
            spr.x = 0;
            spr.y = contentHeight - i * spr.getContentSize().height;
            this._scrollView.addChild(spr);
        }
    }
});

game.ui.AgreementWindow.popupWindow = function () {
    var win = new game.ui.AgreementWindow();
    game.UISystem.popupWindow(win);
};