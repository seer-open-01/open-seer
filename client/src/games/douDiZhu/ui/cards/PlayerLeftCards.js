/**
 * Created by lyndon on 2017/11/23.
 */
// 玩家剩余牌数量
GameWindowDouDiZhu.PlayerLeftCards = cc.Class.extend({

    _parentNode         : null,             // 父节点
    _node               : null,             // 本节点

    _num                : 0,                // 数量
    _leftNum            : null,             // 剩余牌数量文本

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/Cards/LeftHandCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._leftNum = game.findUI(this._node, "ND_Num");
    },

    reset : function () {
        this.setCardsNum(-1);
        this.show(false);
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置剩余牌数量
     * @param num       数量
     */
    setCardsNum : function (num) {
        if(num==-1){
            this._leftNum.setVisible(false);
            return;
        }
        this._leftNum.setVisible(true);
        this._num = num;
        this._leftNum && this._leftNum.setString("" + this._num);
    },

    /**
     * 获取剩余牌数量
     * @return {number}
     */
    getCardsNum : function () {
        return this._num;
    },

    /**
     * 添加牌数量
     * @param num
     */
    addCardsNum : function (num) {
        if (num == -1) {
            this._leftNum.setVisible(false);
            return;
        }
        this._leftNum.setVisible(true);
        this._num += num;
        this._leftNum && this._leftNum.setString("" + this._num);
    },

    /**
     * 减去牌的数量
     * @param num
     */
    minusCardsNum : function (num) {
        this._num -= num;
        this._num = this._num < 0 ? 0 : this._num;
        this._leftNum && this._leftNum.setString("" + this._num);
    }
});