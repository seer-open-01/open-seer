/**
 * Created by Jiyou Mo on 2017/10/17.
 */

// 都地主游戏 辅助功能
var DouDiZhuHelper = DouDiZhuHelper || {};

// 游戏牌型
DouDiZhuHelper.CardsPattern = {
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
};

// 斗地主牌的花色
DouDiZhuHelper.PokerColor = {
    NONE            : 0,        // 无花色
    HONGXIN         : 2,        // 红心
    HEITAO          : 1,        // 黑桃
    FANGPIAN        : 4,        // 方片
    MEIHUA          : 3         // 梅花
};
/**
 * 格式化牌型
 * @param type 主体牌型
 * @param sub 带牌类型
 * @param num
 * @param power
 * @returns {number}
 */
DouDiZhuHelper.formatPattern = function (type, sub, num, power) {
    var pattern = 0;

    if (type == 1) {
        pattern = this.CardsPattern.SINGLE;
    }else if (type == 2) {
        pattern = this.CardsPattern.PAIR;
        if (num >= 3) {
            pattern = this.CardsPattern.PAIRS;
        }
    } else if (type == 3) {
        if (num <= 1) {
            if (sub == 0) {
                pattern = this.CardsPattern.TRIPLE;
            }else if (sub == 1) {
                pattern = this.CardsPattern.TRIPLE_ONE;
            }else if (sub == 2) {
                pattern = this.CardsPattern.TRIPLE_PAIR;
            }
        }else {
            pattern = this.CardsPattern.AIRPLANE;
        }

    }else if (type == 4) {
        pattern = this.CardsPattern.STRAIGHT;
    } else if (type == 5) {
        pattern = this.CardsPattern.FOUR_TWO;
    }else if (type == 6) {
        pattern = this.CardsPattern.BOMB;
        if (power == 17) {
            pattern = this.CardsPattern.KING_BOMB;
        }
    }

    return pattern;
};
/**
 * 不洗牌模式发牌需要将手牌转换
 * @param cards
 * @returns {Array}
 */
DouDiZhuHelper.modifyCards = function (cards) {
    var newCards = [];
    newCards.push(cards.splice(0, 5), cards.splice(0, 6), cards);

    return newCards;
};