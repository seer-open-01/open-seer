///////////////////////////////////////////////////////////////////////////////
//>> 游戏变量
// 房间局数
exports.RoomRound = [4, 8, 16];
// 房卡和房间
exports.DelCard = {"4": 0,"8": 0, "16" : 0};
// 11-19筒 21-29 条 31-39 万  41-44东南西北 51-53中发白  61-68 春夏秋冬 梅兰竹菊
exports.AllMj = [11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,41,42,43,44,51,52,53,61,62,63,64,65,66,67,68];
// 方位对应风位
exports.Id2Winds = {2:{"1":41, "2": 43},4:{"1":41, "2":42, "3":43, "4": 44}};
// 方位对应花位
exports.Id2Huas = {2:{"1":[61,65], "2": [63,67]},4:{"1":[61,65], "2":[62,66], "3":[63,67], "4": [64,68]}};
// 人数对应风位置
exports.Num2Winds = {"2":["东","西"], "3":["东","南","西"],"4":["东","南","西","北"]};
// 抢牌状态
exports.GrabState = {'GRABING': 1,'GRABED': 2};
// 状态
exports.TimerAction = {"NONE": 0, "DO_PLAY": 1, "DO_CHI": 2, "DO_PENG": 3, "DO_GANG" : 4, "DO_HU": 5};
// 游戏状态
exports.GameState = { 'READY': 1,'GA': 2,'PLAY': 3, 'END':4};
// 胡牌类型
exports.HuType = {"QI_XIAO_DUI": 1 ,"PING": 2, "SHI_SAN_YAO": 3};
// 杠牌类型
exports.GangType = {"AN_GANG": 1, "MING_GANG" : 2, "PASSROAD" : 3};
// 房间销毁倒计时
exports.ROOM_VOID_TIME = 120;
// 出牌倒计时
exports.PLAY_CARD_TIME = {"FK":15, "JB":10};
// 机器人走牌时间
exports.ROBOT_PLAY_CARD_TIME = 2;
// 金币场玩家掉线自动出牌时间
exports.OFF_LINE_TIME = 5;
// 托管玩家自动出牌时间 请不要配置成0 客户端播放动画需要时间
exports.HOSTED = 5;
// 取消托管计时
exports.CANCELHOSTED = {"FK":15, "JB":10};
// 上噶倒计时
exports.UPGA = {"FK":10,"JB":10};
// 机器人上噶时间
exports.RoBotUPGA = 2;
// 没有准备踢出玩家
exports.READY_SECOND = {"FK":2000, "JB":10};
// 玩家没有点击离开
exports.LEVEL_ROOM = 30;
// 销毁房间的状态
exports.DestroyState = {NONE:0, YES:1, NO:2, FQ:3};
// 房卡假的倒计时显示的时间
exports.FKShowTime = {READY: 0, GA : 10,  PLAY : 15};


