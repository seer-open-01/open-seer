//>> 游戏变量
// 房间局数
exports.RoomRound = [4, 8, 16];
// 房卡和房间
exports.DelCard = {"4": 2,"8": 4, "16" : 8};
// 抢牌状态
exports.GrabState = {'GRABING': 1,'GRABED': 2};
// 游戏状态
exports.GameState = { 'READY': 1, 'PLAY': 15};
// 金币场玩家掉线自动弃牌倒计时
exports.OFF_LINE_TIME = 60;
// 准备倒计时
exports.READY_SECOND = {"FK":2000, "JB":20};
// 自动出牌时跟牌计时
exports.HOSTED = 1;
// 机器人第一次走牌
exports.First_PLAY = 7;
// 机器人走牌
exports.ROBOT_PLAY = 2;
// 取消自动跟牌计时
exports.CANCELHOSTED = 60;
// 玩家自动弃牌倒计时
exports.PLAY_CARD_TIME = {"FK": 60, "JB" : 60};
// 牌型
exports.CARD_TYPE = {"DAN":1, "DUI": 2, "SHUN":3, "HS":4, "THS":5, "BZ": 6};
// 玩家牌状态
exports.CARD_STATE = {"NONE": 0, "NOT_TO_SEE": 1, "HAVE_TO_SEE": 2, "FOLD" : 3, "COMPARE_LOST": 4};
// 玩家上一步的操作
exports.ANTE_STATE = {"NONE": 0, "ADD_STAKE": 1, "FLOWER_STAKE": 2};
// 查牌完成倒计时
exports.CHECK_COMPLETE = 5;
// 插播广告最大倍数
exports.NOTICE_MAX_BET = 100;
