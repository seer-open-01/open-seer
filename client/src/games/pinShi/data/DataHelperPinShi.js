/**
 * Created by lyndon on 2018.05.18.
 *  桌面消息显示
 */

var PinShiHelper = PinShiHelper || {};
// 牌型
PinShiHelper.cardPattern = {
    P0     : 0,  // 散牌
    P1     : 1,  // 1点
    P2     : 2,  // 2点
    P3     : 3,  // 3点
    P4     : 4,  // 4点
    P5     : 5,  // 5点
    P6     : 6,  // 6点
    P7     : 7,  // 7点
    P8     : 8,  // 8点
    P9     : 9,  // 9点
    NN     : 10, // 双十
    SZ     : 11, // 顺子
    TH     : 12, // 同花
    HL     : 13, // 葫芦
    WH     : 14, // 五花
    WX     : 15, // 五小
    ZD     : 16, // 炸弹
    THS    : 17, // 同花顺
    Done   : 18  // 已完成
};
// 桌面提示消息
PinShiHelper.tableTip = {
    RobDealer     : 1,  // 请抢庄
    AddAnte       : 2,  // 请下注
    ShowCards     : 3,  // 请亮牌
    WaitOtherRob  : 4,  // 等待他人抢庄
    WaitOtherAnte : 5,  // 等待他人下注
    WaitOtherShow : 6   // 等待他人亮牌
};

PinShiHelper.roomStatus = {
    initCards     : 1,  // 发牌
    robDealer     : 2,  // 抢庄
    addAnte       : 3,  // 加注
    showCards     : 4   // 亮牌
};