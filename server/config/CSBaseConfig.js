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
    101 : {"gameType": 1, "subType": 1, "serverCost":0.40, "baseBean" : 300, "enterBean":  7800,  "maxBean" : 7800, "matchName": 1, "isOpen" : 1, "matchId" : 101, "headCount" : 0, "opts":{"isYF":true,"canVoice":false, "isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isBKC":true, "isFGJ":false, isRobot:false, robotOpts:{waitTime:5,lv:1}}},
    112: {"gameType": 1, "subType": 2, "serverCost":0.40, "baseBean" : 1000, "enterBean": 40000, "maxBean" : 40000, "matchName": 2, "isOpen" : 1, "matchId" : 112, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true, "isFGJ":false,isRobot:false,robotOpts:{waitTime:5,lv:1}}},
    113: {"gameType": 1, "subType": 2, "serverCost":0.45, "baseBean" : 2000, "enterBean": 80000, "maxBean" : 80000, "matchName": 3, "isOpen" : 1, "matchId" : 113, "headCount" : 0, "opts":{"isYF":true,"canVoice":false,"isZX":true,"isLZ":true,"isZYSG":true,"isSG":true,"isHH":true,"isJL":true,"isLJSF":true,"isHDBP":true, "isFGJ":false,isRobot:false,robotOpts:{waitTime:5,lv:5}}},

    // 斗地主 subType 1:普通斗地主 2:不洗牌模式
    201 : {"gameType": 2, "subType": 1, "serverCost":0.40, "baseBean" : 300, "enterBean":  9600, "maxBean" : 32, "matchName": 1, "isOpen" : 1, "matchId" : 201, "headCount" : 0, "opts":{"canVoice":false,max:32,isRobot:false,robotOpts:{waitTime:5,lv:5}}},
    212 : {"gameType": 2, "subType": 2, "serverCost":0.40,"baseBean" : 1000, "enterBean": 64000, "maxBean" : 64, "matchName": 2, "isOpen" : 1, "matchId" : 212, "headCount" : 0, "opts":{"canVoice":false,max:64,isRobot:false,robotOpts:{waitTime:5,lv:10}}},
    213 : {"gameType": 2, "subType": 2, "serverCost":0.45,"baseBean" : 2000, "enterBean": 128000, "maxBean" : 64, "matchName": 3, "isOpen" : 1, "matchId" : 213, "headCount" : 0, "opts":{"canVoice":false,max:64,isRobot:false,robotOpts:{waitTime:5,lv:20}}},

    // 拼三张 =====================================
    401 : {"gameType": 4, "subType": 1, "serverCost":0.40, "baseBean" : 1000,  "enterBean": 30000, "maxBean" : 30000, "matchName": 1, "isOpen" : 1, "matchId" : 401, "headCount" : 0, "opts":{"canVoice":false,isRobot:false,robotOpts:{waitTime:5}}},
    412 : {"gameType": 4, "subType": 2, "serverCost":0.40, "baseBean" : 2000, "enterBean": 80000, "maxBean" : 80000, "matchName": 2, "isOpen" : 1, "matchId" : 412, "headCount" : 0, "opts":{BMSL:true,"canVoice":false,isRobot:false,robotOpts:{waitTime:5}}},
    413 : {"gameType": 4, "subType": 2, "serverCost":0.45, "baseBean" : 4000, "enterBean": 160000, "maxBean" : 160000, "matchName": 3, "isOpen" : 1, "matchId" : 413, "headCount" : 0, "opts":{BMSL:true, "canVoice":false,isRobot:false,robotOpts:{waitTime:5}}},

    // 拼十 =====================================
    501 : {"gameType": 5, "subType": 1, "serverCost":0.40,"baseBean" : 1000,  "enterBean": 30000, "maxBean" : 30000, "matchName": 1, "isOpen" : 1, "matchId" : 501, "headCount" : 0, "opts":{TEXAS:false,"canVoice":false,isRobot: false,robotOpts:{waitTime:5}}},
    512 : {"gameType": 5, "subType": 2, "serverCost":0.40,"baseBean" : 2000, "enterBean": 60000, "maxBean" : 60000, "matchName": 2, "isOpen" : 1, "matchId" : 512, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false,isRobot: false,robotOpts:{waitTime:5}}},
    513 : {"gameType": 5, "subType": 2, "serverCost":0.45,"baseBean" : 4000, "enterBean": 120000, "maxBean" : 120000, "matchName": 3, "isOpen" : 1, "matchId" : 513, "headCount" : 0, "opts":{TEXAS:true,"canVoice":false,isRobot: false,robotOpts:{waitTime:5}}},

	// 跑得快 subType  1: 三人模式 2 四人模式
	701 : {"gameType": 7, "subType": 1, "serverCost":0.40,"baseBean" : 300, "enterBean":  7200, "maxBean" : 7200, "matchName": 1, "isOpen" : 1, "matchId" : 701, "headCount" : 0, "opts":{"canVoice":false,setMut:1,isRobot:false,robotOpts:{waitTime:1,lv:1}}},
    712 : {"gameType": 7, "subType": 2, "serverCost":0.40,"baseBean" : 1000, "enterBean": 28000, "maxBean" : 28000, "matchName": 2, "isOpen" : 1, "matchId" : 712, "headCount" : 0, "opts":{"canVoice":false,setMut:1,isRobot:false,robotOpts:{waitTime:5,lv:10}}},
    713 : {"gameType": 7, "subType": 2, "serverCost":0.45,"baseBean" : 2000, "enterBean": 56000, "maxBean" : 56000, "matchName": 3, "isOpen" : 1, "matchId" : 713, "headCount" : 0, "opts":{"canVoice":false,setMut:1,isRobot:false,robotOpts:{waitTime:5,lv:20}}},

    // 血战麻将
    801 :{"gameType": 8, "subType": 1, "serverCost":0.40, "baseBean" : 300, "enterBean":  9600,  "maxBean" : 9600, "matchName": 1, "isOpen" : 1, "matchId" : 801, "headCount" : 0, "opts":{isRobot:false,robotOpts:{waitTime:5,lv:1},HSZ:true,MQZZ:true,JD19:true,HDL:true,maxMult:32,DGHZM:true,ZMJF:true}},
    812: {"gameType": 8, "subType": 2, "serverCost":0.40, "baseBean" : 1000, "enterBean": 48000, "maxBean" : 48000, "matchName": 2, "isOpen" : 1, "matchId" : 812, "headCount" : 0, "opts":{isRobot:false, robotOpts:{waitTime:1,lv:1},HSZ:true,MQZZ:true,JD19:true,HDL:true,maxMult:32,DGHZM:true,ZMJF:true}},
    813: {"gameType": 8, "subType": 2, "serverCost":0.45, "baseBean" : 2000, "enterBean": 96000, "maxBean" : 96000, "matchName": 3, "isOpen" : 1, "matchId" : 813, "headCount" : 0, "opts":{isRobot:false,robotOpts:{waitTime:5,lv:5},HSZ:true,MQZZ:true,JD19:true,HDL:true,maxMult:32,DGHZM:true,ZMJF:true}},
};

exports.gameTypeToList =
    {
        1:[101,112,113],
        2:[201,212,213],
        4:[401,412,413],
        5:[501,512,513],
        7:[701,712,713],
        8:[801,812,813]
    }
// 奖池发放比例
exports.bonusCfg = {
    1:8, 2:6, 3:5,4:4, 5:3.7, 6:3.6, 7:3.5, 8:3.4, 9:3.3, 10:3.2, 11:3.1, 12:3, 13:2.9, 14:2.8, 15:2.7, 16:2.6, 17:2.5, 18:2.4,19:2.3, 20:2.2, 21:2.1, 22:2,
    23:1.9, 24:1.8, 25:1.7, 26:1.6, 27:1.5, 28:1.4, 29:1.3, 30:1.2, 31:1.1, 32:1, 33:0.9, 34:0.8, 35:0.7, 36:0.6, 37:0.5, 38:0.4, 39:0.3, 40:0.2, 41:0.1, 42:0.09,
    43:0.08, 44:0.07, 45:0.06, 46:0.05, 47:0.04, 48:0.03, 49:0.02, 50:0.01
};

// 福利数据
exports.boonCfg = {
    reward : {                      // 奖品
        "1" : {id: 1, num: 1700},
        "2" : {id: 1, num: 600},
        "3" : {id: 1, num: 93},
        "4" : {id: 1, num: 30},
        "5" : {id: 1, num: 330},
        "6" : {id: 1, num: 130},
        "7" : {id: 1, num: 160},
        "8" : {id: 1, num: 1300},
        "9" : {id: 1, num: 360},
        "10" : {id: 1, num: 260},
        "11" : {id: 1, num: 720},
        "12" : {id: 1, num: 390}
    },
    props:{"1":100, "2":1300, "3": 1200, "4": 700, "5": 600, "6": 1500, "7": 1400, "8": 100, "9": 500, "10": 1000, "11": 600, "12": 1000}, // 概率
    freeCount:0,                // 每天免费次数
    consume : 500,              // 每次消耗
    maxCount : 3,               // 最大次数
    speReward:-1,               // 特殊奖励的id
    speCount:0                  // 特殊奖励获得次数
};
