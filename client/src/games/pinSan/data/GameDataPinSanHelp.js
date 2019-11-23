/**
 * Created by Jiyou Mo on 2017/11/30.
 */
// 拼三张游戏辅助数据类
var GameDataPinSanHelp = {};

/**
 * 牌的操作状态
 * @type {{None: number, NotToSee: number, HaveToSee: number, Fold: number, CompareLost: number}}
 */
GameDataPinSanHelp.CardsStatus = {
    None            : 0,        // 没牌
    NotToSee        : 1,        // 未看牌
    HaveToSee       : 2,        // 已看牌
    Fold            : 3,        // 弃牌
    CompareLost     : 4         // 比牌输
};

/**
 * 牌型状态
 * @type {{None: number, Single: number, Pair: number, Straight: number, GoldenFlower: number, StraightFlush: number, BaoZi: number, Diff235: number}}
 */
GameDataPinSanHelp.CardsPattern = {
    None            : 0,        // 无
    Single          : 1,        // 散牌
    Pair            : 2,        // 一对
    Straight        : 3,        // 顺子
    GoldenFlower    : 4,        // 金花
    StraightFlush   : 5,        // 同花顺
    BaoZi           : 6,        // 豹子
    Diff235         : 7         // 其他牌 235 小牌
};
