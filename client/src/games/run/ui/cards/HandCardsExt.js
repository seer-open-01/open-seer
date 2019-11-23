/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快打出的牌-其他玩家
 */
// 从右到左赋值
WindowRun.HandCards2 = WindowRun.HandCards.extend({
    setCardsValues : function (cards) {
        var index = this._cards.length - cards.length;
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
    }
});

// 从左到右赋值
WindowRun.HandCards3 = WindowRun.HandCards.extend({
    setCardsValues : function (cards) {
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cards.length) {
                this._cards[i].setValue(cards[i]);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            } else {
                this._cards[i].setValue(-1);
                this._cards[i].setSelected(false);
                this._cards[i].setColoured(false);
            }
        }
    }
});
