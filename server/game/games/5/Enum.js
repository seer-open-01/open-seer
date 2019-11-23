let Enum = {
    SubType:{
        KPQZ: 1, //看牌抢庄
        ZYQZ: 2, //自由抢庄
    },
    GameMod: {
        NORMAL: 1, //普通模式
        TEXAS: 2    //德州模式
    },

    GameState : {
        READY: 1,   //发牌
        ROB: 2,     //抢庄
        BET: 3,     //下注
        PLAY: 4     //亮牌
    },

    //玩家状态
    PlayerStat: {
        NONE: 0,    //没有
        ROB: 1,     //等待抢庄
        ROB_ED: 2,  //已抢庄
        BET: 3,     //等待下注
        BET_ED: 4,  //已下注
        PLAY: 5,    //等待亮牌
        PLAYED: 6,  //已亮牌
    },

    ActionTime:{
        READY: {"FK": 2000 * 1000, "JB": 20 * 1000},
        ROB: 13 * 1000,
        BET: 8 * 1000,
        PLAY: 8 * 1000,
    },

    //牌型
    CardType : {
        P0: 0,  //散牌
        P1: 1,  //1点
        P2: 2,  //2点
        P3: 3,  //3点
        P4: 4,  //4点
        P5: 5,  //5点
        P6: 6,  //6点
        P7: 7,  //7点
        P8: 8,  //8点
        P9: 9,  //9点
        PN: 10, //双十
        WH: 11, //五花
        SZ: 12, //顺子
        TH: 13, //同花
        HL: 14, //葫芦
        ZD: 15, //炸弹
        WX: 16, //五小
        THS: 17 //同花顺
    },

    //倍数
    TypeMultiple: {},
    //达到通知的最大倍数
    NOTICE_MAX_BET:50
};

Enum.TypeMultiple[Enum.CardType.P0] = 1;
Enum.TypeMultiple[Enum.CardType.P1] = 1;
Enum.TypeMultiple[Enum.CardType.P2] = 1;
Enum.TypeMultiple[Enum.CardType.P3] = 1;
Enum.TypeMultiple[Enum.CardType.P4] = 1;
Enum.TypeMultiple[Enum.CardType.P5] = 1;
Enum.TypeMultiple[Enum.CardType.P6] = 1;
Enum.TypeMultiple[Enum.CardType.P7] = 2;
Enum.TypeMultiple[Enum.CardType.P8] = 2;
Enum.TypeMultiple[Enum.CardType.P9] = 3;
Enum.TypeMultiple[Enum.CardType.PN] = 4;
Enum.TypeMultiple[Enum.CardType.SZ] = 5;
Enum.TypeMultiple[Enum.CardType.TH] = 5;
Enum.TypeMultiple[Enum.CardType.HL] = 5;
Enum.TypeMultiple[Enum.CardType.WH] = 5;
Enum.TypeMultiple[Enum.CardType.ZD] = 6;
Enum.TypeMultiple[Enum.CardType.WX] = 8;
Enum.TypeMultiple[Enum.CardType.THS] = 8;

module.exports = Enum;
