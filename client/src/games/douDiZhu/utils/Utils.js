/**
 * Created by Jiyou Mo on 2017/10/17.
 */
// 斗地主游戏帮助类
DouDiZhuHelper.Utils = {

    /**
     * 克隆对象
     * @param obj
     */
    clone : function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 将牌对象转换成数组
     * @param obj           牌的数据对象(json)
     * @return {Array}
     */
    cardsObjToArray : function (obj) {
        // obj = this.clone(obj);
        var array = [];
        for (var value in obj) {
            if (obj.hasOwnProperty(value)) {
                for (var i = 0; i < obj[value]; ++i) {
                    array.push(value);
                }
            }
        }

        return array;
    },

    /**
     * 将牌数组转换成对象
     * @param array
     * @return {{}}
     */
    cardsArrayToObj : function (array) {
        array = this.clone(array);
        var object = {};
        while (array.length > 0) {
            var value = array.shift();
            if (object.hasOwnProperty(value)) {
                object[value] += 1;
            } else {
                object[value] = 1;
            }
        }

        return object;
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
            case DouDiZhuHelper.PokerColor.NONE : return 100; break;
            case DouDiZhuHelper.PokerColor.FANGPIAN : return 0; break;
            case DouDiZhuHelper.PokerColor.MEIHUA : return 1; break;
            case DouDiZhuHelper.PokerColor.HONGXIN : return 2; break;
            case DouDiZhuHelper.PokerColor.HEITAO : return 3; break;
            default : return 0; break;
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
        if (colorA == DouDiZhuHelper.PokerColor.NONE) {
            if (colorB == DouDiZhuHelper.PokerColor.NONE) {
                return b - a;
            } else {
                return -1;
            }
        }

        if (colorB == DouDiZhuHelper.PokerColor.NONE) {
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
    }
};
