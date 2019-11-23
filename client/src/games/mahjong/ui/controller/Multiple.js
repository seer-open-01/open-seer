/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 上噶 控件 ==============================================================
GameWindowMahjong.Multiple = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _imgGa              : null,         // 上噶图片
    _imgWait            : null,         // 等待上噶图片

    _btnGa              : [],           // 上噶按钮
    _handlerGa          : null,         // 上噶点击回调

    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Multiple/Multiple.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._imgGa = game.findUI(this._node, "IMG_Ga");
        this._imgWait = game.findUI(this._node, "IMG_Wait");

        this._btnGa = [];
        for (var i = 0; i < 6; ++i) {
            var btn = game.findUI(this._node, "BTN_Ga" + i);
            btn.ga = i;
            btn.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    this._handlerGa && this._handlerGa(sender.ga);
                }
            }, this);
            this._btnGa[i] = btn;
        }
    },

    reset : function () {
        this.setCurrentMultiple(-1);
        this.show(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置噶的值 用于显示是否选择噶
     * @param ga  -1 标识未上噶   其他大于或等于0的值表示已经选择了噶
     */
    setCurrentMultiple : function (ga) {
        this._imgWait.setVisible(ga != -1);
        this._imgGa.setVisible(ga == -1);
        this._btnGa.forEach(function (btn) {
            btn.setVisible(ga == -1);
        });
    },

    /**
     * 绑定噶按钮点击回调
     * @param callback  噶按钮点击触发的函数 回传噶的值
     */
    onGaClicked : function (callback) {
        this._handlerGa = callback;
    }
});
