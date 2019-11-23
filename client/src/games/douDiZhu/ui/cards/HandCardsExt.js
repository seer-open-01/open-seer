/**
 * Created by Jiyou Mo on 2017/10/23.
 */
// 斗地主手牌扩展 从右到左赋值
GameWindowDouDiZhu.HandCards2 = GameWindowDouDiZhu.HandCards.extend({
    /**
     * 设置当前牌的值
     * @param cards         牌的值 参数是数组
     * @param lordCard      是否显示地主牌 参数是bool
     */
    setCardsValues : function (cards, lordCard) {
        this._isLordCards = lordCard;
        var index = this._cards.length - cards.length;
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < index || i >= index + cards.length) {
                this._cards[i].setValue(-1, false);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            } else {
                var bool = lordCard && (i - index) == (cards.length - 1);
                this._cards[i].setValue(cards[i - index], bool);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            }
        }
    }
});

// 从左到右赋值
GameWindowDouDiZhu.HandCards3 = GameWindowDouDiZhu.HandCards.extend({
    /**
     * 设置当前牌的值
     * @param cards         牌的值 参数是数组
     * @param lordCard      是否显示地主牌 参数是bool
     */
    setCardsValues : function (cards, lordCard) {
        this._isLordCards = lordCard;
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cards.length) {
                var bool = lordCard && (i == (cards.length - 1));
                this._cards[i].setValue(cards[i], bool);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            } else {
                this._cards[i].setValue(-1, false);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            }
        }
    }
});
