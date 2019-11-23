//>> 游戏变量
// 房间人数
exports.ROOM_PLAYER_NUM = 3;
// 房间局数
exports.RoomRound = [4, 8, 16];
// 局数对应的房卡
exports.DelCard = {"6": 0,"12": 0};
// 房间销毁倒计时
exports.ROOM_DESTROY_TIME = 60;
// 游戏状态
exports.GameState = {READY:1,QIANG:2,DOUBLE:3,PLAY:4};
// 自动抢牌时间
exports.autoGrabTime = {"FK": 15, "JB": 15};
// 机器人抢牌时间
exports.rebotGrabTime = 1;
// 双倍时间定时
exports.doubleTime = {"FK":15, "JB":12};
// 机器人双倍定时
exports.rebotDoubleTime = [2, 10];
// 自动走牌时间
exports.autoPlayTime= {"FK":15,"JB":15};
// 第一次出牌时间
exports.firstPlayTime = {"FK":18, "JB":18};
// 机器人自动走牌时间
exports.rebotAutoGrabTime = 1;
// 要不起倒计时
exports.noRise = {"FK":5,"JB":5};
// 托管走牌时间
exports.CANCELHOSTED = 5;
// 叫地主或者抢地主
exports.callRob = {"CALL":1, "ROB":2};
// 走牌状态
exports.doCard = {"NONE": 0, "PLAY":1, "PASS": 2};
// 牌型定义
exports.shape = {"DAN": 1,"DUI":2,"SAN_YI":3,"SHUN":4,"SI_ER":5,"ZD":6};
// 带牌定义
exports.subShape = {"NONE":0, "DAN": 1,"DUI": 2};
// 牌型炸弹配置
exports.boomConfig = {"0": 5, "1": 15, "2": 50, "3": 70, "4": 85, "5": 95, "6": 100};
// 没有准备踢出游戏(最大匹配时间)
exports.READY_SECOND = {"FK":2000, "JB":5};
// 游戏结束没有离开的玩家
exports.LEVEL_ROOM = 30;
// (牌分) 备注: 这里的14也是A
exports.paiValue = {
    3: 1, 4:2, 5:3, 6:4, 7:5, 8:6, 9:7, 10:8, 11:9, 12:10, 13:11, 14: 12, 1:20, 2: 25, 514: 30, 614: 40
};
// 牌型分
exports.typeValue = {
    dan:0,
    dui:{1 : 3, 2: 10, 3: 60, 4: 100, 5 : 150, 6 : 200, 7: 300, 8: 400, 9 : 600, 10: 800},
    san:{1 : 60,2: 150, 3: 200, 4 : 300, 5 : 400, 6: 800},
    four: 150,
    shun:{"5":60, "6": 70, "7": 85, "8":100, "9": 120, "10":150, "11": 200, "12":250}
};
// 拆出来的几组牌对应的手牌分值
exports.shouPaiValue = {
    1: 1200,
    2: 600,
    3: 470,
    4: 370,
    5: 300,
    6: 250,
    7: 225,
    8: 220,
    9: 180,
    10: 130,
    11: 80,
    12: 50,
    13: 20,
    14: 10,
    15: 5,
    16: 2,
    17: 1
};
// 房间销毁倒计时
exports.ROOM_VOID_TIME = 120;
// 销毁房间的状态
exports.DestroyState = {NONE:0, YES:1, NO:2, FQ:3};
// 房卡假的倒计时显示的时间
exports.FKShowTime = {READY: 0, QIANG : 10,  PLAY : 15, DOUBLE:10};
