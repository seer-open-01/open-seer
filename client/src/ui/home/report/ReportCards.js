/**
 * Created by lyndon on 2018/06/11.
 *  战绩牌型
 */
game.ui.ReportCards = cc.Class.extend({

    _node               : null,
    _type               : 1,                // 1为三张牌型 2为拼十牌型
    _cards              : [],               // 手牌对象数组
    _pattern            : null,             // 显示牌型

    ctor: function (node, type) {
        this._node = node;
        this._type = type;
        this._init();
        return true;
    },

    _init: function () {

        var num = 3;
        if (this._type == 2) {
            num = 5;
        }

        this._cards = [];
        var temp = null;
        for (var i = 1; i <= num; ++i) {
            temp = game.findUI(this._node, "Card_" + i);
            this._cards.push(temp);
        }

        this._pattern = new game.ui.ReportPattern(game.findUI(this._node, "ND_Pattern"));
    },

    reset: function () {
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].setVisible(false);
        }
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置手牌
     * @param cards 数组
     */
    setCardsValue: function (cards) {
        // cc.log("========================= " + JSON.stringify(cards));
        for (var i = 0; i < this._cards.length; ++i) {
            if(i >= cards.length){
                this._cards[i].setVisible(false);
            }else {
                this._cards[i].setTexture(game.ui.ReportCards.Path + cards[i] + ".png");
                this._cards[i].setVisible(true);
            }
        }
    },
    /**
     * 结果牌设置牌型显示
     * @param pattern
     */
    setCardPattern: function (pattern) {
        if (pattern == -1) {
            this._pattern.reset();
            this._pattern.show(false);
            return;
        }

        var format = pattern;

        // 如果游戏类型为拼三 牌型对应数字不同 需格式化一次
        if (this._type == 1 ) {
            if (format == 1) {
                format = 0;
            }else if (format == 2) {
                format = 19;
            }else if (format == 3) {
                format = 12;
            }else if (format == 4) {
                format = 13;
            }else if (format == 5) {
                format = 17;
            }else if (format == 6) {
                format = 18;
            }
        }

        this._pattern.showCardPattern(format);
    }
});

game.ui.ReportCards.Path = "res/Home/Report/Image/poker/";