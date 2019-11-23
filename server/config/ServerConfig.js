let ProtoID = require("../net/CSProto.js").ProtoID;
let SerVerAddr = require("./ServerAddrConfig.js");
// 初始货币信息
exports.initStatus = {"score": 0, "bean": 0, "card": 0};
// 邮件最大保存时间
exports.mailDeath = 3600 * 24 * 7;
// 登录相关信息
exports.wechat = {
    "publicWechat"  : "",                   // 公众号
    "telephone"     : "",                   // 客服号码
    "kfWechat"      : "qqg19940616",        // 客服微信
    "zsWechat"      : "",                   // 招商微信
    "message"       : "通知",
    "notice"        : "天气凉手气热,bsc娱乐平台祝大家财源滚滚！",
    "contact"       : "",
    "wechat"        : "",
}
// 日志级别(1-E, 2-L, 3-D)
exports.LogLevel = 3;
// 开启PING检查
exports.SetPing = false;
// 定时保存玩家数据时间<秒>
exports.SavePlayerDataTime = 2;
// 定时保存全局服时间
exports.SaveGlobalDataTime = 60 * 2;
// 断线服务器保存玩家数据时间
exports.DXMaxTime = 60 * 60 + 10;
// 服务器心跳最大时间
exports.heartbeatMax = 15;
// 游戏服配置 [游戏类型 对应服务器配置]
exports.modeToRoomId = {
	"1" : {"FK": [100000, 110000], "JB": [110001, 200000]},
	"2" : {"FK": [200001, 210000], "JB": [210001, 300000]},
    "3" : {"FK": [300001, 310000], "JB": [310001, 400000]},
    "4" : {"FK": [400001, 410000], "JB": [410001, 500000]},
    "5" : {"FK": [500001, 510000], "JB": [510001, 600000]},
    "7" : {"FK": [600001, 610000], "JB": [610001, 700000]},
    "8" : {"FK": [700001, 710000], "JB": [710001, 800000]},
};
// 商城配置
exports.shopConfig = {
    1:{rmb: 10, bean:1000},
    2:{rmb: 30, bean:3000},
    3:{rmb: 50,   bean: 5000},
    4:{rmb: 100,  bean: 10000},
    5:{rmb: 300,   bean: 30000},
    6:{rmb: 500,  bean: 50000}
};
// 私有秘钥
exports.privateKey = "nyn123";
// 和php交互的秘钥
exports.phpIv = "1234567890000000"; // 1234567890000000
exports.phpKey = "__tazai_wolf__key";
// 不加密的接口
exports.noEncryID = [ProtoID.CLIENT_MIDDLE_PLAYERS_RANK, ProtoID.CLIENT_MIDDLE_REQ_GET_MAIL, ProtoID.CLIENT_MIDDLE_QUERY_PLAYER_REPORTS, ProtoID.CLIENT_MIDDLE_REQ_REPORTS,ProtoID.CLIENT_MIDDLE_GET_BAG_RECORD];
// 游戏版本
exports.gameSession = "1.0.0";
// 每天提现的最大金豆数
exports.maxWith = 100000;
// 提现请求超时时间(毫秒)
exports.bscMaxTime = 5 * 1000;
// 奖池刷新时间(毫秒)
exports.bonusTime = 10 * 1000;
// 每天做多反馈次数
exports.maxFeedBack = 3;
// get允许访问的方法
exports.allowHandle = ["save","getServerInfo","gmAddBean","mainTest", "addTask", "checkTask", "genShopCards"];
// 提示玩家刷新时间
exports.tipsTime = 30 * 1000;
// 微信二维码地址
exports.qrUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";
// 微信二维码路劲
exports.qrPath = "/tp3.2/index.php/admin/wx/";
exports.addresPath = "/pfcwallet/index.php/admin/Pfcwallet/";
// 提现比例
exports.withdrawProp = 0.02;
// 提现最小金额
exports.withMinAmount = 1000;
// 提现最少保留
exports.withMinRetain = 1000;
// 提现最小手续费
exports.withdrawMin = 300;
// 验证码最大保存时间
exports.smsMax = 3 * 60;
// 最大背包容量
exports.maxBagCount = 50;
// 最大的背包记录数量
exports.maxBagRecordCount = 50;
// 货币类型对应id
exports.coinId = [1,2,3];
// 不可叠加的物品id
exports.noNverlying = [];
// 大喇叭最大消息数
exports.hornCfg = {max:7, cost:400};
// 破产补助配置
exports.subsidyCfg = {min: 1500, count:2, num:3000};
// 签到奖励
exports.signCfg = {
                    1:[{id:3, num:1}],
                    2:[{id:3, num:1}],
                    3:[{id:3, num:1}],
                    4:[{id:3, num:1}],
                    5:[{id:3, num:1}],
                    6:[{id:3, num:1}],
                    7:[{id:3, num:2}]
                  };

// 商城数据版本2号
exports.NewShopConfig = [
    {id:15, bean:10000,  diamond:1, maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 手机话费:面值1元
    //{id:16, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值5元
    {id:17, bean:100000,  diamond:10, maxNum:1, weekMax:100, desc:"该物品由海南有线\n提供"}, // 手机话费:面值10元
    //{id:18, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值20元
    //{id:19, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值50元
    {id:20, bean:1000000,  diamond:100, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值100元
    {id:21, bean:260000,  diamond:26,  maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 包月有线电视
    //{id:22, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 包年有线电视
    {id:23, bean:360000,  diamond:36, maxNum:1, weekMax:5, desc:"该物品由海南有线\n提供"}, // 50M包月有线电视
    {id:24, bean:4320000, diamond:432, maxNum:1, weekMax:1, desc:"该物品由海南有线\n提供"}, // 50M包年有线电视
    //{id:25, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 100M包月有线电视
    //{id:26, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 100M包年有线电视
    {id:27, bean:50000,  diamond:5, maxNum:1, weekMax:100, desc:"该物品由xxx餐饮\n提供"},  // 5元餐饮卷
    {id:28, bean:100000,  diamond:10, maxNum:1, weekMax:50, desc:"该物品由xxx餐饮\n提供"},  // 10元餐饮卷
    {id:29, bean:49990000,  diamond:4999, maxNum:1, weekMax:10, desc:"该物品海南三亚木头人游艇会\n提供"},  // 游艇劵
    {id:30, bean:10000000,  diamond:1000, maxNum:1, weekMax:100, desc:"该物品由海南拿云科技有限公司\n提供"},
    {id:31, bean:20000000,  diamond:2000, maxNum:1, weekMax:100, desc:"该物品由海南拿云科技有限公司\n提供"},
    {id:32, bean:30000000,  diamond:3000, maxNum:1, weekMax:100, desc:"该物品由海南拿云科技有限公司\n提供"},
    {id:33, bean:40000000,  diamond:4000, maxNum:1, weekMax:100, desc:"该物品由海南拿云科技有限公司\n提供"}
];
// 商城数据版本测试配置
/**
exports.NewShopConfig = [
    {id:15, bean:10000,  diamond:1, maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 手机话费:面值1元
    //{id:16, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值5元
    {id:17, bean:50000,  diamond:5, maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 手机话费:面值10元
    //{id:18, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值20元
    //{id:19, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 手机话费:面值50元
    {id:20, bean:400000,  diamond:20, maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 手机话费:面值100元
    {id:21, bean:100000,  diamond:6,  maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 包月有线电视
    //{id:22, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 包年有线电视
    {id:23, bean:150000,  diamond:8, maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 50M包月有线电视
    {id:24, bean:1600000, diamond:80, maxNum:1, weekMax:1000, desc:"该物品由海南有线\n提供"}, // 50M包年有线电视
    //{id:25, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 100M包月有线电视
    //{id:26, bean:1000,  diamond:120, maxNum:1, weekMax:10, desc:"该物品由海南有线\n提供"}, // 100M包年有线电视
    {id:27, bean:30000,  diamond:3, maxNum:1, weekMax:1000, desc:"该物品由xxx餐饮\n提供"},  // 5元餐饮卷
    {id:28, bean:50000,  diamond:5, maxNum:1, weekMax:1000, desc:"该物品由xxx餐饮\n提供"},  // 10元餐饮卷
    {id:29, bean:17000000,  diamond:800, maxNum:1, weekMax:1000, desc:"该物品海南三亚木头人游艇会\n提供"}  // 游艇劵
];
 **/
// 物品id对应饭店的配置
exports.GoodIDOpts = {
    15:{logShow:"1元手机话费"},
    16:{logShow:"5元手机话费"},
    17:{logShow:"10元手机话费"},
    18:{logShow:"20元手机话费"},
    19:{logShow:"50元手机话费"},
    20:{logShow:"100元手机话费"},
    21:{logShow:"包月有线电视"},
    22:{logShow:"包年有线电视"},
    23:{logShow:"50M包月有线电视"},
    24:{logShow:"50M包年有线电视"},
    25:{logShow:"100M包月有线电视"},
    26:{logShow:"100M包年有线电视"},
    27:{name: "xxx餐饮",logShow:"5元餐饮卷"},
    28:{name: "xxx餐饮",logShow:"10元餐饮卷"},
    29:{name: "海南三亚木头人游艇会",logShow:"海南三亚木头人游艇劵"},
    30:{logShow:"面值1000元的京东E卡"},
    31:{logShow:"面值2000元的京东E卡"},
    32:{logShow:"面值3000元的京东E卡"},
    33:{logShow:"面值4000元的京东E卡"}
};

exports.FKMaxShow = 4;
// 房卡场扣除服务费比例
exports.FKserverCost = 0.45;
// 不能中途退出房间的游戏
exports.enoughRooms = [1,2,7,8];
// PFC
exports.PFCAddress = {
    test:{
        key:"XhUylgFwcKqtTB6DNY8GN+316DE2xWq/cBR1Y7LjVww=",
        reqHost:"139.198.5.241",
    },
    // test:{
    //     key:"ke4Ff1KVLg6KvM2vb7ksVvcys+ocfZBTqG9No8vg7aI=",
    //     reqHost:"139.198.12.20",
    // },

    "103.37.234.171":{
        key:"ke4Ff1KVLg6KvM2vb7ksVvcys+ocfZBTqG9No8vg7aI=",
        reqHost:"139.198.12.20",
        inIPs : ["139.198.5.241", "127.0.0.1","103.37.234.171","139.198.12.20","39.98.241.250"]
    }
}
// 是否开启seer
exports.isOpenSEER = true;
exports.SEER = {
    createSCPlayer:{seerAccount: "sy04", seerAccountId: "1.2.26", gameAccount: ""},
    GMUID : 100001,                  // GM的uid必须是注册过的
    referrer_percent:20,             // 推荐人返还比例
    // 默认注册人 测试服 cute 5Kb1PcVBpKWPacsgPwZ8KdesmBbvqnmAdYYKQtYVEpBJVF5GRci
    //           正式服 game-seer 5K1kDnpzbDirE5Y4EpLv9RHSpDtp91y2k87gEfR5WVaGR9g6BL9
    RegisterInfo : {
        account: "cute",
        privateKey: "5Kb1PcVBpKWPacsgPwZ8KdesmBbvqnmAdYYKQtYVEpBJVF5GRci"
    },
    // 默认推荐人
    ReferrerInfo : {
        account: "cute",
        privateKey: "5Kb1PcVBpKWPacsgPwZ8KdesmBbvqnmAdYYKQtYVEpBJVF5GRci"
    }
}
