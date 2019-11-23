// ==== 公用提示信息 =====================================================
game.ui.HintMsg = cc.Class.extend({

    _node               : null,         // 本节点
    _labelContent       : null,         // 服务费文本
    _imgBg              : null,         // 背景

    ctor : function () {
        this._node = ccs.load("res/Common/Hint/Hint.json").node;
        this._node.retain();
        this._init();
        return true;
    },

    /**
     * 初始化界面
     * @private
     */
    _init : function () {
        this._labelContent = game.findUI(this._node, "TXT_Content");
        this._imgBg = game.findUI(this._node, "IMG_Bg");

        this._removeFromParent();
    },

    /**
     * 停止该节点的所有Actions
     * @private
     */
    _stopNodeAction: function () {
        this._node.stopAllActions();
        this._removeFromParent();
    },

    /**
     * 从节点移除
     * @private
     */
    _removeFromParent: function () {
        var parent = this._node.getParent();
        if (parent) {
            this._node.removeFromParent();
        }
    },

    /**
     * 隐藏窗口
     */
    hideWindow: function () {
        this._stopNodeAction();
    },

    /**
     * 显示提示文字
     * @param node          需要用于显示的节点 (信息显示的父节点)
     * @param str           显示信息的内容   不能为空的字符串
     * @param pos           显示信息所在节点的位置 (本地坐标)
     * @param time          显示信息持续的时间  默认3秒
     * @param scale         显示信息需要放大的倍数  默认1倍
     */
    showTipText : function (node, str, pos, time, scale) {
        this._stopNodeAction();
        node.addChild(this._node, 50000);
        this._node.setPosition(pos);
        scale = scale || 1;
        this._node.setScale(scale);
        time = time || 3;
        this._labelContent.setString(str);
        var textSize = this._labelContent.getAutoRenderSize();
        this._labelContent.setContentSize(textSize);
        var size = cc.size(textSize.width + 80, textSize.height + 20);
        this._imgBg.setContentSize(size);
        this._node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function () {
            this._removeFromParent();
        }, this)));
    }
});

game.ui.HintMsg._instance = null;

/**
 * 显示提示的文字
 * @param str       显示信息的内容   不能为空的字符串
 * @param pos       显示信息所在节点的位置 (本地坐标)
 * @param time      显示信息持续的时间  默认3秒
 * @param scale     显示信息需要放大的倍数  默认1倍
 */
game.ui.HintMsg.showTipText = function (str, pos, time, scale) {
    if (!this._instance) {
        this._instance = new game.ui.HintMsg();
    }
    this._instance.showTipText(game.UISystem.getTxtHintLayer(), str, pos, time, scale);
};

/**
 * 立即隐藏提示信息
 */
game.ui.HintMsg.hideNode = function () {
    if (this._instance) {
        this._instance.hideWindow();
    }
};