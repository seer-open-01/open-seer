let Enum = {
    // 筒条万对应ID
    AllMj:[11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39],
    // 游戏状态
    GameState:{'READY': 1,'HSZ': 2,'DQ':3, 'PLAY': 4,'END':5},
    // 换三张时间
    HSZ:{"JB":20, "FK":20},
    // 定缺时间
    DQ:{"JB":10,"FK":10},
    // 胡牌类型
    HuType:{"QI_XIAO_DUI": 1 ,"PING": 2,},
    // 杠牌类型
    GangType:{"AN_GANG": 1, "MING_GANG" : 2, "PASSROAD" : 3},
    // 销毁房间状态 NONE 的值不能变成0以外的
    DestroyState:{NONE:0, YES:1, NO:2, FQ:3},
    // 抢牌状态
    GrabState:{'GRABING': 1,'GRABED': 2},
    // 准备倒计时
    READY_SECOND:{"FK":2000, "JB":20},
    // 出牌倒计时
    PLAY_CARD_TIME:{"FK":12, "JB":12},
    // 机器人出牌时间
    ROBOT_PLAY_CARD_TIME:2,
    // 掉线玩家出牌时间
    OFF_LINE_TIME:5,
    // 托管玩家走牌时间
    HOSTED:1,
    // 销毁房间倒计时
    ROOM_VOID_TIME:120,
    // 取消托管时间
    CANCELHOSTED:{"FK":10, "JB":10},
    // pvp信息
    PVP_TYPE:{"GANG":1,"HU":2,"CJ":3,"TS":4},
    // 显示状态
    SHOWSTATUS:{"TING":1, "TUI_SHUI":2, "NO_TING":3, "NO_TUI_SHUI": 4, "OUT":5, "HU":6}
};

module.exports = Enum;
