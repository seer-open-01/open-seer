/**
 * Created by lyndon on 2018/05/17.
 *  加注按钮控件
 */
GameWindowPinShi.AddAnte = cc.Class.extend({
    _parentNode             : null,         // 父节点
    _node                   : null,         // 本节点

    _btns                   : [],           // 按钮控件数组
    _fnts                   : [],           // 按钮对应的底注文字控件

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinShi/AddAnte/AddAnte.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {

        this._btns = [];
        this._fnts = [];
        var temp = null;
        for (var i = 1; i <= 3; ++i) {
            temp = game.findUI(this._node, "BTN_Ante_" + i);
            temp.ante = i;
            this._fnts.push(game.findUI(temp, "ante"));
            this._btns.push(temp);
        }

        this._initValue();
    },
    reset: function () {
        this.show(false);
    },
    /**
     * 显示隐藏该控件
     * @param bool
     */
    show: function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 初始化按钮上的注数
     * @private
     */
    _initValue: function () {
        var gameData = game.procedure.PinShi.getGameData();
        var base = gameData.baseBean;
        for (var i = 0; i < this._fnts.length; ++i) {
            var aa = Utils.formatCoin(base * this._btns[i].ante);
            this._fnts[i].setString(aa);
        }

    },
    /**
     * 更新按钮状态 当按钮的注数大于ante时不可点击
     * @param ante
     */
    updateAnteBtn: function (ante) {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].setEnabled(i <= ante);
        }
    },
    /**
     * 注册抢庄事件
     * @param callback
     */
    onAnteClick: function (callback) {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    callback && callback(sender.ante);
                    this.show(false);
                }
            }, this)
        }
    }
});