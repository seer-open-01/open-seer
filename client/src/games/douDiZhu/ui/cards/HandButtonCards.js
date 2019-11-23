/**
 * Created by Jiyou Mo on 2017/10/18.
 */
// 按钮牌的手牌
GameWindowDouDiZhu.HandButtonCards = GameWindowDouDiZhu.HandCards.extend({

    _unselectedBtn          : null,         // 清除选择牌按钮

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/Cards/HandButtonCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i <= 20; ++i) {
            this._cards.push(new GameWindowDouDiZhu.HandButtonCard(game.findUI(this._node, "Card_" + i), this));
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
     * @param lordCard      是否显示地主牌 参数是bool
     */
    setCardsValues : function (cards, lordCard) {
        this._isLordCards = lordCard;
        var index = this._cards.length - cards.length;
        index = Math.round(index * 0.5);
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < index || i >= index + cards.length) {
                this._cards[i].setValue(-1, false);
                this._cards[i].setTouch(false);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            } else {
                var bool = lordCard && (i - index) == (cards.length - 1);
                this._cards[i].setValue(cards[i - index], bool);
                this._cards[i].setTouch(true);
                if(cards[i-index]==100){
                    this._cards[i].setTouch(false);
                }
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            }
        }
    },

    /**
     * 设置当前牌的值
     * @param cards         牌的值 参数是数组
     * @param lordCard      是否显示地主牌 参数是bool
     */
    // setCardsValuesFromLeft : function (cards, lordCard) {
    //     this._isLordCards = lordCard;
    //     for (var i = 0; i < this._cards.length; ++i) {
    //         this._cards[i].setTouch(true);
    //         if (i < cards.length) {
    //             var bool = lordCard && (i == (cards.length - 1));
    //             this._cards[i].setValue(cards[i], bool);
    //             this._cards[i].setSelected(false);
    //             this._cards[i].setColoured(false);
    //             if (cards[i] == 100)
    //                 this._cards[i].setTouch(false);
    //         } else {
    //             this._cards[i].setValue(-1, false);
    //             this._cards[i].setSelected(false);
    //             this._cards[i].setColoured(false);
    //         }
    //     }
    // },
    /**
     * 设置当前牌的值 发牌动画专用！！！！
     * @param cards         牌的值 参数是数组
     * @param lordCard      是否显示地主牌 参数是bool
     */
    setCardsValuesFromLeft : function (cards, lordCard) {
        this._isLordCards = lordCard;
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].setValue(-1);
            this._cards[i].setSelected(false);
            this._cards[i].setColoured(false);
        }

        for (var j = 0; j < cards.length; ++j) {
            var bool = lordCard && (j == (cards.length - 1));
            this._cards[j+2].setValue(cards[j], bool);
            this._cards[j+2].setTouch(true);
        }
    },

    /**
     * 添加指定的牌
     * @param cards     牌值数组
     */
    addCardsValuesFromLeft : function (cards) {
        cards = DouDiZhuHelper.Utils.clone(cards);
        var values = this.getCardsValues();
        while (cards.length > 0) {
            values.push(cards.shift());
        }
        values = DouDiZhuHelper.Utils.handCardsSort(values);
        this.setCardsValuesFromLeft(values, this._isLordCards);
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
            game.gameNet.sendMessage(protocol.ProtoID.DDZ_HINT_SHUN, {
                uid : game.DataKernel.uid,
                roomId:game.DataKernel.roomId,
                cards: cards
            });
            return;
        }
        // 改变指定牌的选择状态
        this.changeSelectedCardsValues(cards);
    },
    /**
     * 设置手牌是否显示地主标志
     * @param bool
     */
    setLordCard: function (bool) {
        this._isLordCards = bool;
    }
});
