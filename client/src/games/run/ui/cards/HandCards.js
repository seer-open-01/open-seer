/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快打出的牌-多张
 */
WindowRun.HandCards = cc.Class.extend({

    _parentNode             : null,         // 父节点
    _node                   : null,         // 本节点

    _cards                  : [],           // 牌对象数组

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Run/Cards/HandCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i <= 20; ++i) {
            this._cards.push(new WindowRun.Card(game.findUI(this._node, "Card_" + i)));
        }
    },

    /**
     * 重置手牌函数
     */
    reset : function () {
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].reset();
        }
    },

    /**
     * 设置当前牌的值
     */
    setCardsValues : function (cards) {
        var index = this._cards.length - cards.length;
        index = Math.floor(index * 0.5);
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < index || i >= index + cards.length) {
                this._cards[i].setValue(-1);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            } else {
                this._cards[i].setValue(cards[i - index]);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            }
        }
    },

    /**
     * 设置当前牌的值，带发牌特效
     */
    setCardsValuesWithEffect : function (cards, callback) {
        this.setCardsValues([]);

        this.addCardsValuesWithEffect(cards, callback);
    },

    /**
     * 添加当前的牌，带发牌特效
     */
    addCardsValuesWithEffect : function (cards, callback) {
        if (cards.length < 1) {
            callback && callback();
            return;
        }
        cards = RunHelper.clone(cards);
        this.addCardsValue([cards.pop()]);
        if (cards.length > 0) {
            setTimeout(function () {
                this.addCardsValuesWithEffect(cards, callback);
            }.bind(this), 100);
        } else {
            callback && callback();
        }
    },

    /**
     * 获取当前手牌的值
     * @return {Array}      返回值是数组
     */
    getCardsValues : function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var value = this._cards[i].getValue();
            if (value != -1) {
                values.push(value);
            }
        }

        return values;
    },

    /**
     * 添加指定的牌
     * @param cards     牌值数组
     */
    addCardsValue : function (cards) {
        cards = RunHelper.clone(cards);
        var values = this.getCardsValues();
        while (cards.length > 0) {
            values.push(cards.shift());
        }

        // 对牌的值排序
        values = RunHelper.handCardsSort(values);

        // 将拍好序列的值设置回去
        this.setCardsValues(values);
    },

    /**
     * 删除指定值的牌
     * @param cards     牌值的数组
     */
    removeCardsValues : function (cards) {
        cards = RunHelper.clone(cards);
        var values = this.getCardsValues();
        while (cards.length > 0) {
            var card = cards.shift();
            for (var i = 0; i < values.length; ++i) {
                if (values[i] == card) {
                    values.splice(i, 1);
                    break;
                }
            }
        }

        // 对牌的值排序
        values = RunHelper.handCardsSort(values);

        // 将拍好序列的值设置回去
        this.setCardsValues(values);
    },

    /**
     * 设置指定值的牌为已选择状态
     * @param cards     牌的值的数组
     */
    setSelectedCardsValues : function (cards) {
        cards = RunHelper.clone(cards);
        while (cards.length > 0) {
            var card = cards.shift();
            for (var i = 0; i < this._cards.length; ++i) {
                if (this._cards[i].getValue() == card) {
                    this._cards[i].setSelected(true);
                }
            }
        }
    },

    /**
     * 获取已经被选择牌的值
     * @return {Array}
     */
    getSelectedCardsValues : function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var cardObj = this._cards[i];
            if (cardObj.getValue() != -1 && cardObj.isSelected()) {
                values.push(cardObj.getValue());
            }
        }

        return values;
    },

    /**
     * 设置指定牌的值为不选择状态
     * @param cards
     */
    setUnselectedCardsValues : function (cards) {
        cards = RunHelper.clone(cards);
        while (cards.length > 0) {
            var card = cards.shift();
            for (var i = 0; i < this._cards.length; ++i) {
                if (this._cards[i].getValue() == card) {
                    this._cards[i].setSelected(false);
                }
            }
        }
    },

    /**
     * 改变指定牌的选择状态
     * @param cards
     */
    changeSelectedCardsValues : function (cards) {
        cards = RunHelper.clone(cards);
        while (cards.length > 0) {
            var card = cards.shift();
            for (var i = 0; i < this._cards.length; ++i) {
                if (this._cards[i].getValue() == card) {
                    this._cards[i].changeSelected();
                }
            }
        }
    },

    /**
     * 设置指定值的牌为变色状态
     * @param cards
     */
    setColouredCardsValues : function (cards) {
        cards = RunHelper.clone(cards);
        while (cards.length > 0) {
            var card = cards.shift();
            for (var i = 0; i < this._cards.length; ++i) {
                if (this._cards[i].getValue() == card) {
                    this._cards[i].setColoured(true);
                }
            }
        }
    },

    /**
     * 获取已变色状态牌的值
     * @return {Array}
     */
    getColouredCardsValues : function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var cardObj = this._cards[i];
            if (cardObj.getValue() != -1 && cardObj.isColoured()) {
                values.push(cardObj.getValue());
            }
        }

        return values;
    },

    /**
     * 设置指定牌的值为非变色状态
     * @param cards
     */
    setUncolouredCardsValues : function (cards) {
        cards = RunHelper.clone(cards);
        while (cards.length > 0) {
            var card = cards.shift();
            for (var i = 0; i < this._cards.length; ++i) {
                if (this._cards[i].getValue() == card) {
                    this._cards[i].setColoured(false);
                }
            }
        }
    },

    /**
     * 取消选择
     */
    allUnselected: function () {
        for (var i = 0; i < this._cards.length; ++i) {
            var cardObj = this._cards[i];
            if (cardObj.getValue() != -1) {
                cardObj.setSelected(false);
            }
        }
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    }
});