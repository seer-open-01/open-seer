/**
 * 匹配场参数配置
 */
// 麻将匹配字段
// this.options.isYF = JSON.parse(cArgs.options.isYF) || false;        // 是否有番
// this.options.isZX = JSON.parse(cArgs.options.isZX) || false;        // 是否闲庄
// this.options.isLZ = JSON.parse(cArgs.options.isLZ) || false;        // 是否连庄
// this.options.isSG = JSON.parse(cArgs.options.isSG) || false;        // 是否上噶
// this.options.isZYSG = JSON.parse(cArgs.options.isZYSG) || false;    // 是否自由上嘎
// this.options.isLJSF = JSON.parse(cArgs.options.isLJSF) || false;    // 是否流局算分
// this.options.isHH = JSON.parse(cArgs.options.isHH) || false;        // 是否花胡
// this.options.isFGJ = JSON.parse(cArgs.options.isFGJ) || false;      // 是否防勾脚
// this.options.isHYS = JSON.parse(cArgs.options.isHYS) || false;      // 是否混一色
// this.options.isWFP = JSON.parse(cArgs.options.isWFP) || false;      // 是否无风牌
// this.options.isBKC = JSON.parse(cArgs.options.isBKC) || false;      // 是否不可吃
// this.options.isHDBP = JSON.parse(cArgs.options.isHDBP) || false;    // 是否海底包牌
// this.options.isJL  = JSON.parse(cArgs.options.isJL) || false;       // 是否叫令
exports.matchConfig = {
    // 麻将 subType 1: 2人麻将 2:4人麻将 电脑等级大于或者等于100 不会出牌让玩家胡
    101 : {"gameType": 1, "subType": 1, "serverCost":0.5, "baseBean" : 10, "enterBean":  260,  "maxBean" : 260, "matchName": 0, "isOpen" : 1, "matchId" : 101, "headCount" : 0, "opts":{"isYF":true,"canVoice":true, "isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true, "isFGJ":false, isRobot:false, robotOpts:{waitTime:1000,lv:1}}},
    102 : {"gameType": 1, "subType": 1, "serverCost":0.5, "baseBean" : 200, "enterBean":  5200,  "maxBean" : 5200, "matchName": 1, "isOpen" : 1, "matchId" : 102, "headCount" : 0, "opts":{"isYF":true,"canVoice":true, "isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true, "isFGJ":false,isRobot:true, robotOpts:{waitTime:2,lv:1}}},
    103 : {"gameType": 1, "subType": 1, "serverCost":0.5, "baseBean" : 500, "enterBean":  13000, "maxBean" : 13000, "matchName": 2, "isOpen" : 1, "matchId" : 103, "headCount" : 0, "opts":{"isYF":true,"canVoice":true,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true, "isFGJ":false,isRobot:true, robotOpts:{waitTime:5,lv:100}}},
    104 : {"gameType": 1, "subType": 1, "serverCost":0.5, "baseBean" : 1000, "enterBean": 26000, "maxBean" : 26000, "matchName": 3, "isOpen" : 1, "matchId" : 104, "headCount" : 0, "opts":{"isYF":true,"canVoice":true,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true,isRobot:true, robotOpts:{waitTime:5,lv:100}}},
    105 : {"gameType": 1, "subType": 1, "serverCost":0.5, "baseBean" : 3000, "enterBean": 78000, "maxBean" : 78000, "matchName": 4, "isOpen" : 1, "matchId" : 105, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true,isRobot:true, robotOpts:{waitTime:5,lv:100}}},
    106 : {"gameType": 1, "subType": 1, "serverCost":0.5, "baseBean" : 50000, "enterBean": 1300000, "maxBean": 1300000, "matchName": 6, "isOpen" : 1, "matchId" : 106, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true}},
    //107 : {"gameType": 1, "subType": 1, "serverCost":0.28,"baseBean" : 800, "enterBean": 20800, "maxBean": 20800, "matchName": 6, "isOpen" : 0, "matchId" : 107, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true}},

    111: {"gameType": 1, "subType": 2, "serverCost":0.5,  "baseBean" : 10, "enterBean": 400, "maxBean" : 400, "matchName": 0, "isOpen" : 1, "matchId" : 111, "headCount" : 0, "opts":{"isYF":true,"canVoice":true,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true, "isFGJ":false, isRobot:false,robotOpts:{waitTime:1000,lv:1}}},
    112: {"gameType": 1, "subType": 2, "serverCost":0.5, "baseBean" : 200, "enterBean": 8000, "maxBean" : 8000, "matchName": 1, "isOpen" : 1, "matchId" : 112, "headCount" : 0, "opts":{"isYF":true,"canVoice":true,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true, "isFGJ":false,isRobot:true,robotOpts:{waitTime:2,lv:1}}},
    113: {"gameType": 1, "subType": 2, "serverCost":0.5, "baseBean" : 500, "enterBean": 20000, "maxBean" : 20000, "matchName": 2, "isOpen" : 1, "matchId" : 113, "headCount" : 0, "opts":{"isYF":true,"canVoice":true,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true, "isFGJ":false,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    114: {"gameType": 1, "subType": 2, "serverCost":0.5, "baseBean" : 1000, "enterBean": 40000, "maxBean" : 40000, "matchName": 3, "isOpen" : 1, "matchId" : 114, "headCount" : 0, "opts":{"isYF":true,"canVoice":true,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    115: {"gameType": 1,"subType": 2,  "serverCost":0.5, "baseBean" : 3000, "enterBean": 120000, "maxBean" : 120000, "matchName": 4, "isOpen" : 1, "matchId" : 115, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true,isRobot:true,robotOpts:{waitTime:5, lv:100}}},
    116: {"gameType": 1, "subType": 2, "serverCost":0.5, "baseBean" : 50000, "enterBean": 2000000, "maxBean" : 2000000, "matchName": 6, "isOpen" : 1, "matchId" : 116, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true}},
    //117: {"gameType": 1, "subType": 2, "serverCost":0.28, "baseBean" : 800, "enterBean": 32000, "maxBean" : 32000, "matchName": 6, "isOpen" : 0, "matchId" : 117, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true, isRobot:false}},

    // 斗地主 subType 1:普通斗地主 2:不洗牌模式
    201 : {"gameType": 2, "subType": 1, "serverCost":0.5, "baseBean" : 10, "enterBean":  640, "maxBean" : 32, "matchName": 0, "isOpen" : 1, "matchId" : 201, "headCount" : 0, "opts":{"canVoice":true,max:32,isRobot:false,robotOpts:{waitTime:1,lv:1}}},
    202 : {"gameType": 2, "subType": 1, "serverCost":0.5,"baseBean" : 200, "enterBean": 12800, "maxBean" : 32, "matchName": 1, "isOpen" : 1, "matchId" : 202, "headCount" : 0, "opts":{"canVoice":true,max:32,isRobot:true,robotOpts:{waitTime:2,lv:1}}},
    203 : {"gameType": 2, "subType": 1, "serverCost":0.5,"baseBean" : 500, "enterBean": 32000, "maxBean" : 32, "matchName": 2, "isOpen" : 1, "matchId" : 203, "headCount" : 0, "opts":{"canVoice":true,max:32,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    204 : {"gameType": 2, "subType": 1, "serverCost":0.5,"baseBean" : 1000, "enterBean": 64000, "maxBean" : 32, "matchName": 3, "isOpen" : 1, "matchId" : 204, "headCount" : 0, "opts":{"canVoice":true,max:32,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    205 : {"gameType": 2, "subType": 1, "serverCost":0.5,"baseBean" : 3000, "enterBean": 192000, "maxBean" : 32, "matchName": 4, "isOpen" : 1, "matchId" : 205, "headCount" : 0, "opts":{"canVoice":false,max:32,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    206 : {"gameType": 2, "subType": 1, "serverCost":0.5,"baseBean" : 50000, "enterBean": 3200000, "maxBean" : 32, "matchName": 6, "isOpen" : 1, "matchId" : 206, "headCount" : 0, "opts":{"canVoice":false,max:32}},
    //207 : {"gameType": 2, "subType": 1, "serverCost":0.28,"baseBean" : 800, "enterBean": 51200, "maxBean" : 32, "matchName": 6, "isOpen" : 0, "matchId" : 207, "headCount" : 0, "opts":{"canVoice":false,max:32}},

    211 : {"gameType": 2, "subType": 2, "serverCost":0.5, "baseBean" : 10, "enterBean": 1280, "maxBean" : 64, "matchName": 0, "isOpen" :   1, "matchId" : 211, "headCount" : 0, "opts":{"canVoice":true,max:64,isRobot:false,robotOpts:{waitTime:1000,lv:1}}},
    212 : {"gameType": 2, "subType": 2, "serverCost":0.5,"baseBean" : 200, "enterBean": 25600, "maxBean" : 64, "matchName": 1, "isOpen" : 1, "matchId" : 212, "headCount" : 0, "opts":{"canVoice":true,max:64,isRobot:true,robotOpts:{waitTime:2,lv:1}}},
    213 : {"gameType": 2, "subType": 2, "serverCost":0.5,"baseBean" : 500, "enterBean": 64000, "maxBean" : 64, "matchName": 2, "isOpen" : 1, "matchId" : 213, "headCount" : 0, "opts":{"canVoice":true,max:64,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    214 : {"gameType": 2, "subType": 2, "serverCost":0.5,"baseBean" : 1000, "enterBean": 128000, "maxBean" : 64, "matchName": 3, "isOpen" : 1, "matchId" : 214, "headCount" : 0, "opts":{"canVoice":true,max:64,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    215 : {"gameType": 2, "subType": 2, "serverCost":0.5,"baseBean" : 3000, "enterBean": 384000, "maxBean" : 64, "matchName": 4, "isOpen" : 1, "matchId" : 215, "headCount" : 0, "opts":{"canVoice":false,max:64,isRobot:true,robotOpts:{waitTime:5,lv:100}}},
    216 : {"gameType": 2, "subType": 2, "serverCost":0.5,"baseBean" : 50000, "enterBean": 6400000, "maxBean" : 64, "matchName": 6, "isOpen" : 1, "matchId" : 216, "headCount" : 0, "opts":{"canVoice":false,max:64}},
    //217 : {"gameType": 2, "subType": 2, "serverCost":0.28,"baseBean" : 800, "enterBean": 102400, "maxBean" : 64, "matchName": 6, "isOpen" : 0, "matchId" : 217, "headCount" : 0, "opts":{"canVoice":false,max:64, isRobot:false}},

    // 拼三张 =====================================
    401 : {"gameType": 4, "subType": 1, "serverCost":0.5, "baseBean" : 10,  "enterBean": 400,   "maxBean" : 0, "matchName": 0, "isOpen" : 1, "matchId" : 401, "headCount" : 0, "opts":{"canVoice":true,isRobot:true,robotOpts:{waitTime:1}}},
    402 : {"gameType": 4, "subType": 1, "serverCost":0.5, "baseBean" : 500, "enterBean": 15000, "maxBean" : 0, "matchName": 1, "isOpen" : 1, "matchId" : 402, "headCount" : 0, "opts":{"canVoice":true,isRobot:false,robotOpts:{waitTime:2}}},
    403 : {"gameType": 4, "subType": 1, "serverCost":0.5, "baseBean" : 1000, "enterBean": 40000, "maxBean" : 0, "matchName": 2, "isOpen" : 1, "matchId" : 403, "headCount" : 0, "opts":{"canVoice":true,isRobot:false,robotOpts:{waitTime:5}}},
    404 : {"gameType": 4, "subType": 1, "serverCost":0.5, "baseBean" : 2000, "enterBean": 80000, "maxBean" : 0, "matchName": 3, "isOpen" : 1, "matchId" : 404, "headCount" : 0, "opts":{BMSL:true,"canVoice":true,isRobot:true,robotOpts:{waitTime:5}}},
    405 : {"gameType": 4, "subType": 1, "serverCost":0.5, "baseBean" : 4000, "enterBean": 160000, "maxBean" : 0, "matchName": 4, "isOpen" : 1, "matchId" : 405, "headCount" : 0, "opts":{BMSL:true,"canVoice":false,isRobot:true,robotOpts:{waitTime:5}}},
    406 : {"gameType": 4, "subType": 1, "serverCost":0.5, "baseBean" : 50000, "enterBean": 2000000, "maxBean" : 0, "matchName": 6, "isOpen" : 1, "matchId" : 406, "headCount" : 0, "opts":{BMSL:true,"canVoice":false}},
    //407 : {"gameType": 4, "subType": 1, "serverCost":0.50, "baseBean" : 1000, "enterBean":40000, "maxBean" : 0, "matchName": 6, "isOpen" : 0, "matchId" : 407, "headCount" : 0, "opts":{BMSL:true,"canVoice":false}},

    411 : {"gameType": 4, "subType": 2, "serverCost":0.5, "baseBean" : 10, "enterBean":  400, "maxBean" : 0, "matchName": 0, "isOpen" : 1, "matchId" : 411, "headCount" : 0, "opts":{"canVoice":true,isRobot:false,robotOpts:{waitTime:1}}},
    412 : {"gameType": 4, "subType": 2, "serverCost":0.5, "baseBean" : 500, "enterBean": 15000, "maxBean" : 0, "matchName": 1, "isOpen" : 1, "matchId" : 412, "headCount" : 0, "opts":{"canVoice":true,isRobot:true,robotOpts:{waitTime:2}}},
    413 : {"gameType": 4, "subType": 2, "serverCost":0.5, "baseBean" : 1000, "enterBean": 40000, "maxBean" : 0, "matchName": 2, "isOpen" : 1, "matchId" : 413, "headCount" : 0, "opts":{"canVoice":true,isRobot:true,robotOpts:{waitTime:5}}},
    414 : {"gameType": 4, "subType": 2, "serverCost":0.5, "baseBean" : 2000, "enterBean": 80000, "maxBean" : 0, "matchName": 3, "isOpen" : 1, "matchId" : 414, "headCount" : 0, "opts":{BMSL:true,"canVoice":true,isRobot:true,robotOpts:{waitTime:5}}},
    415 : {"gameType": 4, "subType": 2, "serverCost":0.5, "baseBean" : 4000, "enterBean": 160000, "maxBean" : 0, "matchName": 4, "isOpen" : 1, "matchId" : 415, "headCount" : 0, "opts":{BMSL:true,"canVoice":false,isRobot:true,robotOpts:{waitTime:5}}},
    416 : {"gameType": 4, "subType": 2, "serverCost":0.5, "baseBean" : 50000, "enterBean": 2000000, "maxBean" : 0, "matchName": 6, "isOpen" : 1, "matchId" : 416, "headCount" : 0, "opts":{BMSL:true,"canVoice":false}},
    //417 : {"gameType": 4, "subType": 2, "serverCost":0.50, "baseBean" : 1000, "enterBean": 40000, "maxBean" : 0, "matchName": 6, "isOpen" : 0, "matchId" : 417, "headCount" : 0, "opts":{BMSL:true,"canVoice":false}},

    // 拼十 =====================================
    501 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 10,  "enterBean": 300, "maxBean" : 0,    "matchName": 0, "isOpen" : 1, "matchId" : 501, "headCount" : 0, "opts":{TEXAS:false,"canVoice":true,isRobot: false,robotOpts:{waitTime:1}}},
    502 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 500,  "enterBean": 15000, "maxBean" : 0, "matchName": 1, "isOpen" : 1, "matchId" : 502, "headCount" : 0, "opts":{TEXAS:false,"canVoice":true,isRobot: true,robotOpts:{waitTime:2}}},
    503 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 1000, "enterBean": 30000, "maxBean" : 0, "matchName": 2, "isOpen" : 1, "matchId" : 503, "headCount" : 0, "opts":{TEXAS:true,"canVoice":true,isRobot: true,robotOpts:{waitTime:5}}},
    504 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 2000, "enterBean": 60000, "maxBean" : 0, "matchName": 3, "isOpen" : 1, "matchId" : 504, "headCount" : 0, "opts":{TEXAS:true,"canVoice":true,isRobot:true,robotOpts:{waitTime:5}}},
    505 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 4000, "enterBean": 120000, "maxBean" : 0, "matchName": 4, "isOpen" : 1, "matchId" : 505, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false,isRobot:true,robotOpts:{waitTime:5}}},
    506 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 50000, "enterBean": 1500000, "maxBean" : 0, "matchName": 6, "isOpen" : 1, "matchId" : 506, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false}},
    //506 : {"gameType": 5, "subType": 1, "serverCost":0.50,"baseBean" : 1000, "enterBean": 30000, "maxBean" : 0, "matchName": 6, "isOpen" : 0, "matchId" : 507, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false}},

    511 : {"gameType": 5, "subType": 2, "serverCost":0.5,"baseBean" : 10,  "enterBean": 300,   "maxBean" : 0, "matchName": 0, "isOpen" : 1, "matchId" : 511, "headCount" : 0, "opts":{TEXAS:false,"canVoice":true,isRobot:false,robotOpts:{waitTime:1}}},
    512 : {"gameType": 5, "subType": 2, "serverCost":0.5,"baseBean" : 500, "enterBean": 15000, "maxBean" : 0, "matchName": 1, "isOpen" : 1, "matchId" : 512, "headCount" : 0, "opts":{TEXAS:false,"canVoice":true,isRobot: true,robotOpts:{waitTime:2}}},
    513 : {"gameType": 5, "subType": 2, "serverCost":0.5,"baseBean" : 1000, "enterBean": 30000, "maxBean" : 0, "matchName": 2, "isOpen" : 1, "matchId" : 513, "headCount" : 0, "opts":{TEXAS:true,"canVoice":true,isRobot: true,robotOpts:{waitTime:5}}},
    514 : {"gameType": 5, "subType": 2, "serverCost":0.5,"baseBean" : 2000, "enterBean": 60000, "maxBean" : 0, "matchName": 3, "isOpen" : 1, "matchId" : 514, "headCount" : 0, "opts":{TEXAS:true,"canVoice":true,isRobot:true,robotOpts:{waitTime:5}}},
    515 : {"gameType": 5, "subType": 2, "serverCost":0.5,"baseBean" : 4000, "enterBean": 120000, "maxBean" : 0, "matchName": 4, "isOpen" : 1, "matchId" : 515, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false,isRobot:true,robotOpts:{waitTime:5}}},
    516 : {"gameType": 5, "subType": 2, "serverCost":0.5,"baseBean" : 50000, "enterBean": 1500000, "maxBean" : 0, "matchName": 6, "isOpen" : 1, "matchId" : 516, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false}},
    //517 : {"gameType": 5, "subType": 2, "serverCost":0.50,"baseBean" : 1000, "enterBean": 30000, "maxBean" : 0, "matchName": 6, "isOpen" : 0, "matchId" : 517, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false}},



    // 虎鸡 =====================================
    601 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 50, "enterBean": 1500, "maxBean" : 40000, "matchName": 1, "isOpen" : 1, "matchId" : 601, "headCount" : 0, "opts":{mod:1,"canVoice":true}},
    602 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 100, "enterBean": 3000, "maxBean" : 40000, "matchName": 2, "isOpen" : 1, "matchId" : 602, "headCount" : 0, "opts":{mod:2,"canVoice":true}},
    603 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 200, "enterBean": 6000, "maxBean" : 40000, "matchName": 3, "isOpen" : 1, "matchId" : 603, "headCount" : 0, "opts":{mod:2,"canVoice":true}},
    604 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 400, "enterBean": 12000, "maxBean" : 40000, "matchName": 4, "isOpen" : 1, "matchId" : 604, "headCount" : 0, "opts":{mod:2,"canVoice":true}},
    605 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 700, "enterBean": 21000, "maxBean" : 40000, "matchName": 5, "isOpen" : 1, "matchId" : 605, "headCount" : 0, "opts":{mod:2,"canVoice":true}},
    606 : {"gameType": 5, "subType": 1, "serverCost":0.5,"baseBean" : 1000, "enterBean": 30000, "maxBean" : 40000, "matchName": 6, "isOpen" : 1, "matchId" : 606, "headCount" : 0, "opts":{mod:2,"canVoice":true}},

	// 跑得快 subType  1: 三人模式 2 四人模式
	701 : {"gameType": 7, "subType": 1, "serverCost":0.25,"baseBean" : 10, "enterBean":  240, "maxBean" : 240, "matchName": 0, "isOpen" : 1, "matchId" : 701, "headCount" : 0, "opts":{"canVoice":true,max:32,wildCard:false,isRobot:false,robotOpts:{waitTime:1,lv:1}}},
    702 : {"gameType": 7, "subType": 1, "serverCost":0.26,"baseBean" : 200, "enterBean": 4800, "maxBean" : 4800, "matchName": 1, "isOpen" : 1, "matchId" : 702, "headCount" : 0, "opts":{"canVoice":true,max:32,wildCard:false,isRobot:true,robotOpts:{waitTime:1,lv:1}}},
    703 : {"gameType": 7, "subType": 1, "serverCost":0.27,"baseBean" : 500, "enterBean": 12000, "maxBean" : 12000, "matchName": 2, "isOpen" : 1, "matchId" : 703, "headCount" : 0, "opts":{"canVoice":true,max:32,wildCard:false}},
    704 : {"gameType": 7, "subType": 1, "serverCost":0.28,"baseBean" : 1000, "enterBean": 24000, "maxBean" : 24000, "matchName": 3, "isOpen" : 1, "matchId" : 704, "headCount" : 0, "opts":{"canVoice":true,max:32,wildCard:true}},
    705 : {"gameType": 7, "subType": 1, "serverCost":0.30,"baseBean" : 3000, "enterBean": 72000, "maxBean" : 72000, "matchName": 4, "isOpen" : 1, "matchId" : 705, "headCount" : 0, "opts":{"canVoice":false,max:32,wildCard:true}},
    706 : {"gameType": 7, "subType": 1, "serverCost":0.29,"baseBean" : 5000, "enterBean": 120000, "maxBean" : 1200000, "matchName": 6, "isOpen" : 1, "matchId" : 706, "headCount" : 0, "opts":{"canVoice":false,max:32,wildCard:true}},
    //207 : {"gameType": 7, "subType": 1, "serverCost":0.28,"baseBean" : 800, "enterBean": 51200, "maxBean" : 32, "matchName": 6, "isOpen" : 0, "matchId" : 207, "headCount" : 0, "opts":{"canVoice":false,wildCard:32}},

    711 : {"gameType": 7, "subType": 2, "serverCost":0.25,"baseBean" : 10, "enterBean": 240, "maxBean" : 32, "matchName": 0, "isOpen" :   1, "matchId" : 711, "headCount" : 0, "opts":{"canVoice":true,wildCard:false,max:32,isRobot:false,robotOpts:{waitTime:1,lv:1}}},
    712 : {"gameType": 7, "subType": 2, "serverCost":0.26,"baseBean" : 200, "enterBean": 4800, "maxBean" : 64, "matchName": 1, "isOpen" : 1, "matchId" : 712, "headCount" : 0, "opts":{"canVoice":true,wildCard:false,max:32,isRobot:true,robotOpts:{waitTime:1,lv:1}}},
    713 : {"gameType": 7, "subType": 2, "serverCost":0.27,"baseBean" : 500, "enterBean": 12000, "maxBean" : 64, "matchName": 2, "isOpen" : 1, "matchId" : 713, "headCount" : 0, "opts":{"canVoice":true,wildCard:false,max:32}},
    714 : {"gameType": 7, "subType": 2, "serverCost":0.28,"baseBean" : 1000, "enterBean": 24000, "maxBean" : 64, "matchName": 3, "isOpen" : 1, "matchId" : 714, "headCount" : 0, "opts":{"canVoice":true,wildCard:true,max:32}},
    715 : {"gameType": 7, "subType": 2, "serverCost":0.30,"baseBean" : 3000, "enterBean": 72000, "maxBean" : 64, "matchName": 4, "isOpen" : 1, "matchId" : 715, "headCount" : 0, "opts":{"canVoice":false,wildCard:true,max:32}},
    716 : {"gameType": 7, "subType": 2, "serverCost":0.29,"baseBean" : 5000, "enterBean": 120000, "maxBean" : 64, "matchName": 6, "isOpen" : 1, "matchId" : 716, "headCount" : 0, "opts":{"canVoice":false,wildCard:true,max:32}},
};
// 代理返利比例
exports.rebate = {
    "self" : 0.35,
    "pre"  : 0.07,
    "pre_pre" : 0.03
};
// 奖池发放比例
exports.bonusCfg = {
    1:8, 2:6, 3:5,4:4, 5:3.7, 6:3.6, 7:3.5, 8:3.4, 9:3.3, 10:3.2, 11:3.1, 12:3, 13:2.9, 14:2.8, 15:2.7, 16:2.6, 17:2.5, 18:2.4,19:2.3, 20:2.2, 21:2.1, 22:2,
    23:1.9, 24:1.8, 25:1.7, 26:1.6, 27:1.5, 28:1.4, 29:1.3, 30:1.2, 31:1.1, 32:1, 33:0.9, 34:0.8, 35:0.7, 36:0.6, 37:0.5, 38:0.4, 39:0.3, 40:0.2, 41:0.1, 42:0.09,
    43:0.08, 44:0.07, 45:0.06, 46:0.05, 47:0.04, 48:0.03, 49:0.02, 50:0.01
};

// 福利数据
exports.boonCfg = {
    reward : {                      // 奖品
        "1" : {id: 1, num: 5180},
        "2" : {id: 1, num: 1800},
        "3" : {id: 1, num: 2800},
        "4" : {id: 1, num: 8900},
        "5" : {id: 1, num: 9800},
        "6" : {id: 1, num: 3800},
        "7" : {id: 1, num: 4800},
        "8" : {id: 1, num: 38800},
        "9" : {id: 1, num: 10800},
        "10" : {id: 1, num: 7800},
        "11" : {id: 1, num: 21800},
        "12" : {id: 1, num: 11800}
    },
    props:{"1":200, "2":1000, "3": 1000, "4": 700, "5": 600, "6": 1500, "7": 1500, "8": 300, "9": 500, "10": 1000, "11": 400, "12": 1500}, // 概率
    freeCount:1,                // 每天免费次数
    consume : 6000,             // 每次消耗
    maxCount : 3,               // 最大次数
    speReward:2,                // 特殊奖励的id
    speCount:0                  // 特殊奖励获得次数
};
