
var RunHelper = RunHelper || {};

RunHelper = {

    CardsPattern: {
        NONE            : 0,        // 没有出牌
        SINGLE          : 1,        // 单牌
        PAIR            : 2,        // 对子
        STRAIGHT        : 3,        // 顺子
        PAIRS           : 4,        // 连对
        TRIPLE          : 5,        // 三条
        TRIPLE_ONE      : 6,        // 三带一
        TRIPLE_PAIR     : 7,        // 三带二
        RUN_TRIPLE      : 8,        // 三顺
        AIRPLANE        : 9,        // 飞机
        AIRPLANE_TWO    : 10,       // 飞机(带对)
        FOUR_TWO        : 11,       // 四带二
        FOUR_TWO_PAIR   : 12,       // 四带二对
        BOMB            : 14,       // 炸弹
        KING_BOMB       : 15        // 鬼炸
    },

    PokerColor: {
        NONE            : 0,        // 无花色
        HONGXIN         : 2,        // 红心
        HEITAO          : 1,        // 黑桃
        FANGPIAN        : 4,        // 方片
        MEIHUA          : 3         // 梅花
    },

    /**
     * 克隆对象
     * @param obj
     */
    clone : function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 获取扑克的花色
     * @param cardValue
     * @return {number}
     */
    getPokerColor : function (cardValue) {
        return Math.floor(cardValue * 0.01);
    },

    /**
     * 获取扑克的值
     * @param cardValue
     */
    getPokerValue : function (cardValue) {
        return Math.floor(cardValue % 100);
    },

    /**
     * 获取扑克花色大小
     * @param color
     * @return {number}
     * @private
     */
    getPokerColorValueSwap : function (color) {
        switch (color) {
            case this.PokerColor.NONE : return 100;
            case this.PokerColor.FANGPIAN : return 0;
            case this.PokerColor.MEIHUA : return 1;
            case this.PokerColor.HONGXIN : return 2;
            case this.PokerColor.HEITAO : return 3;
            default : return 0;
        }
    },

    /**
     * 获取扑克值的比较
     * @param value
     * @return {*}
     * @private
     */
    getPokerValueValueSwap : function (value) {
        if (value == 1) {
            return 14;
        } else if (value == 2) {
            return 200;
        } else if (value == 14) {
            return 300;
        }
        else {
            return value;
        }
    },

    /**
     * 扑克排序比较函数， (排序的时候调用)
     * @param a
     * @param b
     * @return {number}
     * @private
     */
    pokerSwap : function (a, b) {
        var valueA = this.getPokerValue(a);
        var colorA = this.getPokerColor(a);
        var valueB = this.getPokerValue(b);
        var colorB = this.getPokerColor(b);

        // 首先判断是否是鬼牌---------------------------------------
        if (colorA == this.PokerColor.NONE) {
            if (colorB == this.PokerColor.NONE) {
                return b - a;
            } else {
                return -1;
            }
        }

        if (colorB == this.PokerColor.NONE) {
            return 1;
        }

        // 值和话色的比较
        if (valueA != valueB) {
            // 值不相同就比值
            return this.getPokerValueValueSwap(valueB) - this.getPokerValueValueSwap(valueA);
        } else {
            // 值相同就比花色
            return this.getPokerColorValueSwap(colorB) - this.getPokerColorValueSwap(colorA);
        }
    },

    /**
     * 手牌排序
     * @param cards  值的数组
     */
    handCardsSort : function (cards) {
        cards = this.clone(cards);
        cards.sort(this.pokerSwap.bind(this));
        return cards;
    },

    /**
     * 格式化牌型
     * @param type 主体牌型
     * @param sub 带牌类型
     * @param num
     * @param power
     * @returns {number}
     */
    formatPattern: function (type, sub, num, power) {
        var pattern = 0;

        if (type == 1) {
            pattern = this.CardsPattern.SINGLE;
        } else if (type == 2) {
            pattern = this.CardsPattern.PAIR;
            if (num >= 2) {
                pattern = this.CardsPattern.PAIRS;
            }
        } else if (type == 3) {
            if (num <= 1) {
                if (sub == 0) {
                    pattern = this.CardsPattern.TRIPLE;
                } else if (sub == 1) {
                    pattern = this.CardsPattern.TRIPLE_PAIR;
                } else if (sub == 2) {
                    pattern = this.CardsPattern.TRIPLE_PAIR;
                }
            } else {
                pattern = this.CardsPattern.AIRPLANE;
            }

        } else if (type == 4) {
            pattern = this.CardsPattern.STRAIGHT;
        } else if (type == 5) {
            pattern = this.CardsPattern.FOUR_TWO;
        } else if (type == 6) {
            pattern = this.CardsPattern.BOMB;
            if (power == 17) {
                pattern = this.CardsPattern.KING_BOMB;
            }
        }

        return pattern;
    }
};