/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快手牌按钮
 */

WindowRun.HandButtonCards = WindowRun.HandCards.extend({

    _unselectedBtn          : null,         // 清除选择牌按钮

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Run/Cards/HandButtonCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i <= 20; ++i) {
            this._cards.push(new WindowRun.HandButtonCard(game.findUI(this._node, "Card_" + i), this));
        }

        this._unselectedBtn = game.findUI(this._node, "BTN_Unselected");
        this._unselectedBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._unselectedCards();
            }
        }, this);
    },

    /**
     * 设置当前牌的值
     * @param cards         牌的值 参数是数组
     */
    setCardsValues : function (cards) {
        var index = this._cards.length - cards.length;
        index = Math.round(index * 0.5);
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < index || i >= index + cards.length) {
                this._cards[i].setValue(-1);
                this._cards[i].setTouch(false);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            } else {
                this._cards[i].setTouch(true);
                this._cards[i].setValue(cards[i - index]);
                if(cards[i-index]==100){
                    this._cards[i].setTouch(false);
                }
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            }
        }
    },

    /**
     * 设置当前牌的值 发牌动画专用！！！！
     * @param cards 牌的值 参数是数组
     */
    setCardsValuesFromLeft : function (cards) {

        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].setValue(-1);
            this._cards[i].setSelected(false);
            this._cards[i].setColoured(false);
        }

        for (var j = 0; j < cards.length; ++j) {
            this._cards[j+2].setValue(cards[j]);
            this._cards[j+2].setTouch(true);
        }
    },

    /**
     * 添加指定的牌
     * @param cards     牌值数组
     */
    addCardsValuesFromLeft : function (cards) {
        cards = RunHelper.clone(cards);
        var values = this.getCardsValues();
        while (cards.length > 0) {
            values.push(cards.shift());
        }
        this.setCardsValuesFromLeft(values);
    },

    /**
     * 将选中的牌设置为未选中状态
     * @private
     */
    _unselectedCards : function () {
        this.setUnselectedCardsValues(this.getSelectedCardsValues());
    },

    /**
     * 设置子类滑动调用回调
     * @param beginPos
     * @param endPos
     */
    setRectMoveTouch : function (beginPos, endPos) {
        var pos1 = this._node.convertToNodeSpace(beginPos);
        var pos2 = this._node.convertToNodeSpace(endPos);
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].onRectMoveTouch(pos1, pos2);
        }
    },

    /**
     * 设置子类滑动结束调用回调
     */
    setEndRectMoveTouch : function () {
        // 结束操作
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].onEndRectMoveTouch();
        }
        // 获取变色的值
        var cards = this.getColouredCardsValues();
        this.setUncolouredCardsValues(cards);

        if (cards.length > 4) {
            game.gameNet.sendMessage(protocol.ProtoID.RUN_SELECT, {
                uid : game.DataKernel.uid,
                roomId:game.DataKernel.roomId,
                cards: cards
            });
            return;
        }
        // 改变指定牌的选择状态
        this.changeSelectedCardsValues(cards);
    }
});
