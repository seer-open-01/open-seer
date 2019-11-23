/**
 * Created by Jiyou Mo on 2017/10/19.
 */
// 地主牌控件
GameWindowDouDiZhu.DiZhuCards = GameWindowDouDiZhu.HandCards.extend({

    _fntMultiple        : null,         // 倍数
    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/Cards/DiZhuCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i <= 3; ++i) {
            this._cards.push(new GameWindowDouDiZhu.Card(game.findUI(this._node, "Card_" + i)));
        }
        this._fntMultiple = game.findUI(this._node, "Fnt_Multiple");
    },

    reset: function () {
        this._super();
        this.setMultiple(-1);
    },
    /**
     * 设置倍数
     * @param num
     */
    setMultiple: function (num) {
          if (num <= 0) {
              this._fntMultiple.setVisible(false);
              return;
          }
          this._fntMultiple.setString("x" + num + "b");
          this._fntMultiple.setVisible(true);
    },
    /**
     * 设置当前牌的值
     * @param cards         牌的值 参数是数组
     */
    setCardsValue : function (cards) {
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cards.length) {
                this._cards[i].setValue(cards[i], false);
            } else {
                this._cards[i].setValue(-1, false);
            }
            this._cards[i].setTouch(false);
            this._cards[i].setSelected(false);
            this._cards[i].setColoured(false);
        }
    }
});
