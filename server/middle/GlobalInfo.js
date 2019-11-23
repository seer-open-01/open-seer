///////////////////////////////////////////////////////////////////////////////
//>> 服务器全局数据
let Taskloader  = require("../util/Task.js").TaskLoader;
let schedule    = require('node-schedule');
let HttpReq     = require("../HttpRequest.js");
let BSProto     = require("../net/BSProto.js");
let CSProto     = require("../net/CSProto.js");
let util        = require("util");
let CommFuc     = require("../util/CommonFuc.js");
function GlobalInfo() {
    this.usedRoomIds        = null;     // 已经使用的房间号
    this.notice             = [];       // 公告
    this.blackList          = [];       // 封号列表
    this.globalData         = {};       // 全球数据
    this.isDirty            = false;    // 数据是否被修改
    this.senWords           = [];       // 敏感字库
}

GlobalInfo.prototype = {
    /**
     * 初始化
     * @param callback
     */
    init: function(callback) {

        let loader = new Taskloader(function () {
            DEBUG('GlobalInit Complete');
            callback(true);
        }.bind(this));

        loader.addLoad("userRoom");
        MongoWorld.findOne({_id: "_usedRoomIds"}, {}, function (err, res) {
            if (!err) {
                console.log(res);
                // this.usedRoomIds = res.ids;
                this.usedRoomIds = {};
                loader.onLoad("userRoom");
            }
        }.bind(this));

        loader.addLoad("globalInfo");
        MongoGlobal.findOne({_id:"_global"}, {}, function (err, res) {
            if(!err){
                this.globalData = res.values;
                this.setInitGlobalData();
            }
            loader.onLoad("globalInfo");
        }.bind(this));
        setInterval(function () {
            this.save();
        }.bind(this), Config.SaveGlobalDataTime * 1000)
    },

    /**
     * 保存数据
     * @param callback
     */
    save: function(callback) {
        let loader = new Taskloader(function () {
            DEBUG('GlobalSave Complete');
            this.isDirty = false;
            callback && callback();
        })
        loader.addLoad("save_globalData");
        MongoGlobal.update({_id:"_global"}, {$set:{values:this.globalData}}, function(err){
            loader.onLoad("save_globalData");
        }.bind(this));
    },
    /**
     * 打上标记
     */
    markDirty: function () {
        this.isDirty = true;
    },
    /**
     * 申请一个房间号
     * @param gameType
     * @param mode
     * @param callback
     */
    allocRoomId: function(gameType,mode,callback) {
        let str = "";
        if(!Config.modeToRoomId[gameType] || !Config.modeToRoomId[gameType][mode]){
            callback(1,0);
        }
        let min = Config.modeToRoomId[gameType][mode][0];
        let max = Config.modeToRoomId[gameType][mode][1];
        let loopNum = 0;
        while (true) {
            let roomId = Math.floor(Math.random() * (max - min) + min);
            if (!this.usedRoomIds.hasOwnProperty(roomId)) {
                this.usedRoomIds[roomId] = 1;
                callback && callback(null, roomId);
                break;
            }
            loopNum++;
            if(loopNum >= 1000){
                callback &&  callback(true);
            }
        }
    },
    /**
     * 设置全球数据
     */
    setInitGlobalData:function () {
        let gData = this.globalData;
        if(!gData.roundId) {
            gData.roundId = 1;
        }
        if(!gData.allBonus){
            gData.allBonus = 0;
        }
        if(!gData.whiteList){
            gData.whiteList = [];
        }
        if(!gData.serverState){
            gData.serverState = 1;
        }
        if(!gData.unionIdToUid){
            gData.unionIdToUid = {};
        }
        if(!gData.taskInfo){
            gData.taskInfo = {};
            gData.taskInfo.tasks = [];
            gData.taskInfo.modifyTasks = {};
            gData.taskInfo.startId = 1000;
        }
        if(!gData.matchRecord){
            gData.matchRecord = [];
        }
        if(!gData.subPubUnionId){                   // 关注公众号 领取奖励
            gData.subPubUnionId = {};
        }
        if(!gData.matchCfg){
            gData.matchCfg = {};
        }
        if(!gData.hornMsgs){
            gData.hornMsgs = [];
        }
        if(!gData.weekShop){
            gData.weekShop = {};
        }
        for(let i in Config.NewShopConfig){
            let goodId = Config.NewShopConfig[i].id;
            if(!gData.weekShop[goodId]){
                gData.weekShop[goodId] = {curNum:0}
            }
        }
        if(!gData.extendCfg){
            gData.extendCfg = {};
            gData.extendCfg.brokerage = 0.01;
            gData.extendCfg.baseMaxWithDraw = 10000;
            gData.extendCfg.nodeCfg = [
                {numP: 5,   needProfit:4,   maxProp:0.01,  name:"青铜段位", redType:1, maxWithDraw:20000},
                {numP: 15,  needProfit:5,   maxProp:0.02,  name:"白银段位", redType:1, maxWithDraw:30000},
                {numP: 100, needProfit:30,  maxProp:0.03,  name:"黄金段位", redType:1, maxWithDraw:40000},
                {numP: 200, needProfit:40,  maxProp:0.05,  name:"教皇段位", redType:2, maxWithDraw:50000},
            ];
        }
        if(!gData.rebate){
            gData.rebate = {};
            gData.rebate.self = 0.2;
            gData.rebate.pre = 0.07;
            gData.rebate.pre_pre = 0.03;
        }
        if(!gData.smsData){
            gData.smsData = {};
        }
        CommFuc.readTxt();
    },
    /**
     * 设置全局事件
     */
    setTimerTask:function () {
        // 在线玩家更新当前提现
        this.zeroUpdate();          // 0点更新
        // this.elevenHalfUpdate();    // 11点半更新
        // this.twelveUpdate();        // 12点更新
        this.weekUpdate();          // 每周更新
        this.tipsEnterGame();       // 提示玩家进入游戏
    },
    /**
     * 零点更新
     */
    zeroUpdate:function () {
        let strTime = util.format("%s %s %s %s %s *","0","0","0","*","*");
        schedule.scheduleJob(strTime, function () {
            ERROR("0点更新提现");
            for(let idx in PlayerMgr.players){
                let player = PlayerMgr.players[idx];
                player.onNewDay();
            }
            gTask.updateTask();
            ExtendMgr.oneDayUpdate();
        }.bind(this));
    },

    /**
     * 每周更新
     */
    weekUpdate:function(){
        let rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = 1;
        rule.hour = 0;
        rule.minute = 0;
        rule.second = 0;
        schedule.scheduleJob(rule, function () {
            DEBUG("开始周更");
            this.updateShopWeek();
            ExtendMgr.weekUpdate();
        }.bind(this));
    },

    /**
     * 周更商店
     */
    updateShopWeek(){
        let weekShop = this.globalData.weekShop;
        let cfg = Config.NewShopConfig;
        for(let i in cfg){
            let goodId = cfg[i].id;
            if(!weekShop[goodId]){
                weekShop[goodId] = {};
            }
            weekShop[goodId].curNum = 0;
        }
    },
    /**
     * 11点半更新
     */
    elevenHalfUpdate:function () {
        let strTime = util.format("%s %s %s %s %s *","0","30","11","*","*");
        schedule.scheduleJob(strTime, function () {
            ERROR("11点半更新");
            this.noticeHighLight(true);
        }.bind(this));
    },
    /**
     * 12点更新
     */
    twelveUpdate:function () {
        let strTime = util.format("%s %s %s %s %s *","0","0","12","*","*");
        schedule.scheduleJob(strTime, function () {
            ERROR("12点更新提现");
        }.bind(this));
    },
    /**
     *  提示玩家进入游戏
     */
    tipsEnterGame:function () {
        setInterval(function () {
            let tipPlays = [];
            for(let uid in PlayerMgr.players){
                let player = PlayerMgr.players[uid];
                if(PlayerMgr.isOnLine(uid)){
                    if(!player.hasJoinedRoom()){
                        tipPlays.push(uid);
                    }
                }
            }
            let tipRooms = [];
            for(let rId in GSMgr.roomData){
                let room = GSMgr.roomData[rId];
                if(!GSMgr.roomIsRobot(room)){
                    let count = room.maxNum - room.curNum - room.copyNum;
                    if(room.status != 0 && Config.enoughRooms.indexOf(room.gameType) >= 0){
                        continue;
                    }
                    if(room.mode == "JB") {
                        for (let idx = 0; idx < count; idx++) {
                            tipRooms.push(rId);
                        }
                    }
                }
            }
            for(let uIdx in tipPlays){
                let uid = tipPlays[uIdx];
                let player = PlayerMgr.players[uid];
                let randomIdx = Math.floor(Math.random() * tipRooms.length);
                let roomId = tipRooms[randomIdx];
                let room = GSMgr.roomData[roomId];
                if(room) {
                    let cfg = csConfig.matchConfig[room.matchId];
                    if(gSeer.getPlayerBean(player) < cfg.enterBean){
                        continue;
                    }
                    player.getConn().sendMsg({
                        code: CSProto.ProtoID.MIDDLE_CLIENT_TIPS_ROOMID,
                        args: {
                            roomId: roomId,
                            gameType: cfg.gameType,
                            subType: cfg.subType,
                            matchName: cfg.matchName,
                            baseBean: cfg.baseBean,
                            enterBean: cfg.enterBean,
                            matchId:room.matchId
                        }
                    });
                    tipRooms.splice(randomIdx, 1);
                }
            }
        }.bind(this), Config.tipsTime);
    },
    /**
     * 向玩家发送验证码
     * @param uid  玩家ID
     * @param tell   电话号码
     */
    sendSmsCode: function (tell, callback) {
        let sms = require("../util/Sms");
        if(!tell){return}
        if(typeof tell !== "number"){tell = parseInt(tell)}
        sms.sendSms(tell,callback);
    },
    /**
     * 保存短信验证码
     * @param tell
     * @param sms
     */
    saveSms:function (phone, sms) {
        let sData = this.globalData.smsData;
        if(!sData[phone]){
            sData[phone] = {};
            sData[phone].sms = sms;
            sData[phone].time = Date.getStamp();
        }else{
            sData[phone].sms = sms;
            sData[phone].time = Date.getStamp();
        }
    },
    /**
     * 获取短信验证码
     * @param phone
     * @returns {*}
     */
    getSms:function(phone) {
        let sData = this.globalData.smsData;
        let nowTime = Date.getStamp();
        if(!sData[phone]){
            return 0;
        }else{
            let startTime = sData[phone].time;
            if(nowTime - startTime >= Config.smsMax){
                return 0;
            }else{
                return sData[phone].sms;
            }
        }
    },

    // 获取大喇叭的消息
    getHornMsg(){
        let msgs = this.globalData.hornMsgs;
        return msgs;
    },
    // 广播大喇叭消息
    broadHorn(player){
        let msgs = this.globalData.hornMsgs;
        let latelyMsg = [];
        let len = msgs.length;
        for(let idx = 2; idx >= 0; idx--){
            let index = len - 1 - idx;
            if(index >= 0 && msgs[index]){
                latelyMsg.push(msgs[index]);
            }
        }
        if(player){
            if(player.getConn()) {
                player.getConn().sendMsg({code: CSProto.ProtoID.MIDDLE_CLIENT_SEND_HORN_MSG, args: {latelyMsg}});
            }
        }else{
            PlayerMgr.broadcastToAll({code:CSProto.ProtoID.MIDDLE_CLIENT_SEND_HORN_MSG,args:{latelyMsg}});
        }
    },
    // 增加一条大喇叭消息
    addHornMsg(player, data){
        let msg = data.msg;
        if(!msg)return;
        if(gSeer.getPlayerBean(player) < Config.hornCfg.cost){
            return CSProto.ProtoState.STATE_GAME_BEAN_LESS;
        }
        if (msg.replace(/[\u4e00-\u9fa5]/gi, "aa").length > 80) {
            return CSProto.ProtoState.STATE_EXTEND_NOTICE_TOO_LONG;
        }
        let one = {msg:msg, name:player.user.info.name};
        let msgs = this.globalData.hornMsgs;
        msgs.push(one);
        player.updateBean({num:-Config.hornCfg.cost, eventId:CSProto.eveIdType.Horn});
        ExtendMgr.updateFinance({uid:player.uid, num:Config.hornCfg.cost,financeType:CSProto.financeType.BIG_HORN});
        if(msgs.length > Config.hornCfg.max){
            msgs.splice(0, 1);
        }
        this.broadHorn();
        return CSProto.ProtoState.STATE_OK;
    }
};

exports = module.exports = new GlobalInfo();
