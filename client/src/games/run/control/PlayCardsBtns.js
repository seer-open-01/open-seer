/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快出牌按钮
 */
WindowRun.PlayCardsBtns = cc.Class.extend({

    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _btnNode_1          : null,         // 包含不出 提示 出牌按钮
    _btnNode_2          : null,         // 只包含要不起按钮
    _btnNode_3          : null,         // 只包含出牌按钮
    _hintBtn            : null,         // 提示按钮
    _noPlayBtn          : null,         // 不出按钮
    _playBtn            : null,         // 出牌按钮
    _passBtn            : null,         // 要不起按钮

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Run/PlayCardsBtns/PlayCardsBtns.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {

        this._btnNode_1 = game.findUI(this._node, "ND_Normal");
        this._hintBtn = game.findUI(this._btnNode_1, "Btn_Tip");
        this._noPlayBtn = game.findUI(this._btnNode_1, "Btn_NoPlay");
        this._playBtn = game.findUI(this._btnNode_1, "Btn_Play");

        this._btnNode_2 = game.findUI(this._node, "ND_Pass");
        this._btnNode_3 = game.findUI(this._node, "ND_Play");
    },

    reset : function () {
        this.showBtn(-1);
    },

    show : function (show) {
        this._node.setVisible(show);
    },
    /**
     * 是否显示该控件
     * @param type 1显示三个按钮 2只显示要不起按钮 3只显示出牌按钮
     */
    showBtn : function (type) {
        this._btnNode_1.setVisible(1 == type);
        this._btnNode_2.setVisible(2 == type);
        this._btnNode_3.setVisible(3 == type);
    },

    /**
     * 提示按钮点击回调
     * @param callback
     */
    onHintClicked : function (callback) {
        this._hintBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 不出按钮点击回调
     * @param callback
     */
    onNoPlayClicked : function (callback) {
        this._noPlayBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
        this._btnNode_2.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 出牌按钮点击回调
     * @param callback
     */
    onPlayClicked : function (callback) {
        this._playBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
        this._btnNode_3.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    }
});
