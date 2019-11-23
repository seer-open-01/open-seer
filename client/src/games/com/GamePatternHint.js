/**
 * 游戏中的牌型提示
 */
game.ui.GamePatternHint = game.ui.PopupWindow.extend({

    _node               : null,         // 本节点

    _btnClose           : null,         // 关闭按钮

    _imgContent         : null,         // 牌型显示框
    _titleNode          : null,         // 牌型标题
    _svContent          : null,         // 滚动区域控件

    _lastTime           : 0,            // 上次关闭按钮点击时间

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Games/ComWindow/PatternHintWindow/GamePatternHint.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._btnClose = game.findUI(this._node, "ND_Close");

        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                var now = new Date();
                if (now - this._lastTime < 500) {
                    // 两次的间隔小于500毫秒则不做处理
                    return;
                }
                this._lastTime = now;

                this._runHideAction();
            }
        }, this);

        this._imgContent = game.findUI(this._node, "IMG_Content");
        this._svContent = game.findUI(this._imgContent, "SV_Content");
        this._titleNode = game.findUI(this._node, "ND_Tittle");
    },

    reset : function () {
        this._imgContent.setPosition(cc.p(-240, 360));
        this._titleNode.setPosition(cc.p(-240, 672));
    },

    /**
     * 设置牌型提示内容
     * @param contentPath
     * @param titlePath
     */
    setInfo : function (contentPath, titlePath) {
        this._runShowAction();
        this._svContent.removeAllChildren();
        this._titleNode.removeAllChildren();
        var sp = new cc.Sprite(contentPath);
        var sp2 = new cc.Sprite(titlePath);

        var height = sp.getContentSize().height;

        if (height < 620) {
            height = 620;
        }

        this._svContent.setInnerContainerSize(cc.size(248, height));

        sp.setAnchorPoint(cc.p(0, 1.0));
        sp.setPosition(cc.p(12, height));

        this._svContent.addChild(sp);
        this._titleNode.addChild(sp2);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    _runShowAction : function () {
        this._imgContent.stopAllActions();
        this._imgContent.runAction(cc.moveTo(0.3, cc.p(130, 360)));

        this._titleNode.stopAllActions();
        this._titleNode.runAction(cc.moveTo(0.3, cc.p(115, 672)));
    },

    _runHideAction : function () {
        var move = cc.moveTo(0.3, cc.p(-140, 360));
        var fun = cc.CallFunc(function () {
            this.close();
        }, this);
        this._imgContent.stopAllActions();
        this._imgContent.runAction(cc.sequence(move, fun));

        this._titleNode.stopAllActions();
        this._titleNode.runAction(cc.moveTo(0.3, cc.p(-115, 672)));
    },

    /**
     * 关闭窗口
     */
    close : function () {
        game.UISystem.closeWindow(this);
    }
});

game.ui.GamePatternHint._instance = null;

/**
 * 关闭窗口函数
 */
game.ui.GamePatternHint.close = function () {
    if (this._instance) {
        this._instance.close();
    }
};

/**
 * 弹出
 * @param contentPath 牌型图片的路径
 * @param titlePath  牌型标题图片路径
 */
game.ui.GamePatternHint.popup = function (contentPath, titlePath) {
    if (this._instance == null) {
        this._instance = new game.ui.GamePatternHint();
        this._instance.retain();
    }

    this._instance.reset();

    this._instance.setInfo(contentPath, titlePath);

    game.UISystem.showWindow(this._instance);
};