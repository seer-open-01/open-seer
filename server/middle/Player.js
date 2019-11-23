let util            = require("util");
let HttpReq         = require("../HttpRequest.js");
let BSProto         = require("../net/BSProto.js");
let eveIdType       = require("../net/CSProto.js").eveIdType;
let ProtoID         = require("../net/CSProto.js").ProtoID;
let ProxyLv         = require("../net/CSProto.js").proxyLv;
let MailStatus      = require("../net/CSProto.js").MailStatus;
let CSProto         = require("../net/CSProto.js");
let CommFuc         = require("../util/CommonFuc.js");
let PFCMgr          = require("../util/PFC.js");
let Http            = require("../HttpRequest.js");

///////////////////////////////////////////////////////////////////////////////
//>> 玩家数据

// 玩家数据
function Player(uid) {
    this.uid            = uid;                  // 玩家编号
    this.user           = {};                   // 玩家数据
    this.wsConn         = null;                 // WebSocket连接
    this.isDirty        = false;                // 数据是否被修改
    this.matchId        = 0;                    // 匹配信息
    this.preHeartbeat   = 0;                    // 上一次心跳时间
    this.scheJob        = null;                 // 限时任务
    this.tmp = {};                              // 临时数据
}

Player.create = function (uid) {
    // 玩家基础数据
    let base = {
        "_id": uid,
        "robot": 0,
        "block": 0,
        "gmLevel": 0,
        "initComplete": false,
        "invitation":"",                                          //邀请码
        "fillInvitation":"",                                      //已经填写的邀请码
        "info": {
            "name": "",
            "headPic": "",
            "sex": 1,
            "createTime": Date.getStamp(),
            "createIP": "",
            "signature": "",                                       //游戏内的微信签名
            "openId": "",
            "unionId":"",                                          //微信公众号 微信开放平台公用的唯一识别用户的id
            "realName":"",                                         //真实姓名
            "identity":"",                                         //身份证号码
        },
        "dayVars": {
            "day": 0,
            "month": 0,
            "loginTimes": 0,
            "inviteCount": 0,
            "dayMoney": 0,          // 每日充值金额
            "monthMoney": 0,        // 没月充值金额
            "serverCostTip":{       // 服务费提示
            },
            "feedbackCount":0       // 每日反馈次数
        },

        "marks": {
            "loginTime": 0,
            "loginIP": "",
            "logoutTime": 0,
            "blockTime": 0,
        },
        "consume": {
            "payCard": 0,
            "payMoney": 0,
            "payBean": 0,
            "payDiamond":0,
            "serverCost":0,             // 服务器费
        },
        "status": {
            "card": 0,
            "bean": 0,
            "diamond" : 0,
            "score": 0,
        },
        "reports": [],
        "exReports": [],
        "storageBox": {
            "card": 0,
            "remember": false,
            "bean": 0,
            "score": 0,
            "diamond" :0,
            "password": "",
        },
        "room": {
            "matchId": 0,
            "ownRoomId": 0,
            "roomId": 0
        },
        "authentication":{
            "identity" :0,
            "authTell": 0,
            "bound":0
        },
        "mails":{
            "onlyId": 1,
            "mails" :[]
        },
        "counts": {
            "play": 0, //总完了多少局 不分游戏
        },
        "extend_info":{
            "pre_extend_uid" : 0,   // 上级推广员id
            "qrId":"",              // 二维码在微信中的编号客户端不需要
            "url":"",               // 二维码最终访问地址
            "isGM":false,           // 是否为GM
        },
        "luck":{
            "mj":100,               // 麻将幸运值
            "ddz":100,              // 斗地主幸运值
            "psz":100,              // 拼三张幸运值
            "ps":100,               // 拼十幸运值
            "pdk":100,              // 跑得快幸运值
            "xzmj":100,             // 血战麻将幸运值
        },
        "bind":{
            "bank":{
                "realName":"",
                "bankNumber":"",
                "bankName":""
            },
            "alipay":{
                "realName":"",
                "account":""
            }
        },
        "boon":{
            curCount:0,
            curFreeCount:0,
            todayTip:true,
            speCount:0
        },
        "rankMatch":{           // 广电杯
            "classInfo":{"day":{curCard:"", curScore:0}, "week":{curCard:"", curScore:0}, "month":{curCard:"", curScore:0}},      //分类信息
            "tvAccount":"",
            "netAccount":"",
            "addressInfo":{name:"", address:"", tell:""},
            "records":[]
        },
        "bag":{
            items:{},               // 背包系统
            preDDZTime:0,           // 上次斗地主使用时间
            phone: "",              // 电话号码
            tvAccount:"",           // 有线电视账号
            netAccount:"",          // 有线宽带
            wxAccount:"",           // 微信账户
            record:[],              // 背包记录
            recordRed:false         // 背包记录红点
        },
        subsidy:{
            curCount:0              // 当前补助次数
        },
        sign:{                      // 连续签到
            status:{},              // 领取状态
            zpreTime:0,             // 上次登陆的时间
            continuityDay:1         // 连续的天数
        },
        shopData: {
            bugCount:{}             // 已购买的次数
        },
        convertCards:[],            // 兑换的卡片集合

        PFC:{                       // PFC信息相关
            address:"",             // PFC绑定的地址
            url:"",                 // 二维码图片地址
            address_type : "",      // PFC地址类型
            withdrawIng : false,    // PFC提现进行中
            rechargeRecords:[],     // 充值记录
            withdrawRecords:[],     // 提现记录
            withdrawAddress:[],     // 用户提现地址记录
            addressIndex:0,         // 地址Index
            password:"",            // PFC提币密码
        },

        SEER:{
            account:"",             // SEER账号
            publicKey:"",           // 公钥
            privateKey:"",          // 私钥
            brain:"",               // 助记词
            id:"",                  // SEER平台分配的id
            enable:false,           // SEER划转功能开关
            scBean : 0,             // 平台金豆
            boxBean : 0,            // seer账户余额(显示在)
            tempBean:0,             // 临时存放的bean 防止每次都去访问数据后台更新导致的扣除平台服务费过多
            withdrawRecords:[],     // 提币记录
        }

    };
    return base;
};


Player.prototype = {
    /**
     * 角色初始化
     * @param fields
     * @param callback
     */
    init: function (fields, callback) {
        let player = this;
        MongoUser.findOne({_id: player.uid}, fields, function (err, doc) {
            if (doc) {
                player.user = doc;
                this.fullData();
                callback && callback(true);
            } else {
                if (err) {
                    callback && callback(false);
                } else {
                    player.user = Player.create(player.uid);
                    MongoUser.insertOne(player.user, function (err, res) {
                        if (err) {
                            callback && callback(false);
                        } else {
                            callback && callback(true);
                        }
                    });
                }
            }
        }.bind(this));
    },
    /**
     * 保证玩家数据没有缺失
     * @param player
     */
    fullData:function(){
        let status = this.user.sign.status;
        for(let i in Config.signCfg){
            if(!status[i]){
                status[i] = 1;
            }
        }
        let bugCount = this.user.shopData.bugCount;
        for(let i = 0; i < Config.NewShopConfig.length; i++){
            let goodId = Config.NewShopConfig[i].id;
            if(!bugCount[goodId]){
                bugCount[goodId] = 0;
            }
        }
        let user = this.user;
        if(isNaN(user.extend_info.isGM)){
            user.extend_info.isGM = false;
        }
        if(!user.PFC.withdrawAddress){
            user.PFC.withdrawAddress = [];
        }
        if(!user.luck.xzmj){
            user.luck.xzmj = 100;
        }
        if(!user.SEER.withdrawRecords){
            user.SEER.withdrawRecords = [];
        }
    },
    /**
     * 保存数据
     */
    save: function () {
        if (this.isDirty) {
            MongoUser.save(this.user, function (err) {              //默认使用 _id 作为索引
                if (!err) {
                    this.isDirty = false;
                }
            }.bind(this));
        }
    },
    /**
     * 打上标记
     */
    markDirty: function () {
        this.isDirty = true;
    },
    /**
     * 设置连接对象
     * @param conn
     */
    setConn: function (conn) {
        this.wsConn = conn;
    },
    /**
     * 获取连接对象
     * @returns {*|null}
     */
    getConn: function () {
        return this.wsConn;
    },
    /**
     * 获取玩家货币信息
     * @returns {{}}
     */
    getStatus:function () {
        let data = {};
        let status = clone(this.user.status);
        data.bean = gSeer.getPlayerBean(this);
        data.card = status.card;
        return data;
    },

    /**
     * 获取银行信息
     * @returns {{}}
     */
    getBank: function () {
        let data = {};
        let bank = clone(this.user.storageBox);
        data.bean = gSeer.getPlayerBoxBean(this);
        data.card = bank.card;
        data.remember = bank.remember;
        return data
    },

    /**
     * 获取游戏服需要的玩家信息
     * @returns {{}}
     */
    getGameServerData: function (roomId) {
        let data = {};
        data.uid = this.uid;
        data.info = this.user.info;
        data.status = clone(this.user.status);
        data.roomId = roomId;

        data.status.bean = gSeer.getPlayerBean(this);
        let room = GSMgr.getRoomData(roomId);
        data.matchId = room.matchId;
        data.gameType = room.gameType;
        data.serverCostTip = this.user.dayVars.serverCostTip;
        data.extend_info = this.user.extend_info;
        data.luck = this.user.luck;
        data.matchIng = CommFuc.getMatchIng(this.user.rankMatch.classInfo);
        return data;
    },
    /**
     * 设置玩家创建的id
     * @param roomId
     */
    setOwnedRoomId: function (roomId) {
        this.user.room.ownRoomId = roomId;
        this.markDirty();
    },
    /**
     * 获取玩家拥有的房间号
     * @returns {number}
     */
    getOwnedRoomId:function () {
        return this.user.room.ownRoomId;
    },
    /**
     * 判断是否已经创建了房间
     * @returns {boolean}
     */
    hasOwnedRoom: function () {
        return this.user.room.ownRoomId != 0;
    },
    /**
     * 设置加入房间
     * @param roomId
     */
    setJoinedRoomId: function (roomId) {
        this.user.room.roomId = roomId;
        // ERROR("uid:" + this.uid + "设置了房间号: " + roomId);
        this.markDirty();
    },
    /**
     * 获取加入房间的id
     * @returns {number}
     */
    getJoinedRoomId:function () {
        return this.user.room.roomId;
    },
    /**
     * 是否加入了房间
     * @returns {boolean}
     */
    hasJoinedRoom: function () {
        return this.user.room.roomId != 0;
    },
    /**
     * 设置登录信息
     * @param data
     * @param wsConn
     */
    setLoginInfo: function (data, wsConn) {
        let user = this.user;
        user.info.name = data.name;
        user.info.headPic = data.headPic;
        user.info.sex = data.sex;
        user.info.openId = data.openId;
        user.info.unionId = data.unionid || "";
        user.marks.loginIP = wsConn.getAddrString();
        user.marks.loginTime = Date.getStamp();
        user.dayVars.loginTimes += 1;
        this.markDirty();
        this.save()
    },

    setLogOutInfo:function () {
        let user = this.user;
        user.marks.logoutTime = Date.getStamp();
    },

    /**
     * 检查更新每天变量
     */
    checkDayVers: function(){
        let time = new Date();
        let today = time.getDate();
        let month = time.getMonth();
        let user = this.user;
        if(user.dayVars.day !== today){
            this.onNewDay();
            if(month !== user.dayVars.month){
                this.onNewMonth();
            }
            this.user.dayVars.day = today;
        }
    },

    onNewDay: function () {
        this.user.dayVars.dayMoney = 0;
        this.user.dayVars.serverCostTip ={};
        this.user.dayVars.feedbackCount = 0;
        this.user.boon.curCount = 0;
        this.user.boon.curFreeCount = 0;
        this.user.boon.todayTip = true;
        this.user.subsidy.curCount = 0;
        this.user.sign.continuityDay++;
        this.updateSignStatus();
        this.checkBoonRed();
        this.markDirty();
        ExtendMgr.reset(this.uid);
    },

    onNewMonth: function () {
        this.user.dayVars.monthMoney = 0;
    },
    /**
     * 发送消息
     */
    sendMsgToClient(code, args){
        if(this.wsConn){
            this.wsConn.sendMsg({code, args});
        }
    },

    /**
     * 保存战报
     * @param report
     */
    saveReport: function (report) {
        let reports = this.user.reports || [];
        const max = 20
        let counts = {
            "JB": 0,
            "FK": 0
        }

        reports.push(report);
        for (let i = 0; i < reports.length; i++){
            let tempReport = reports[i];
            counts[tempReport.mode] += 1;
        }

        for(let mode in counts){
            if(counts[mode] > max){
                for(let j = 0; j < reports.length; j++){
                    let eReport = reports[j];
                    if(eReport.mode === mode){
                        reports.splice(j, 1)
                        break;
                    }
                }
            }
        }

        this.user.reports = reports;
        this.markDirty();
    },


    /**
     *  战绩
     * @param report
     */
    saveExReport: function (report) {
        let reports = this.user.exReports || [];
        const max = 20
        reports.push(report);
        if(reports.length > max){
            reports.splice(0, 1);
        }
        this.user.exReports = reports;
        this.markDirty();
    },

    /**
     * 增加物品
     */
    addGoods:function (goods, eventType) {
        for(let idx in goods){
            let good = goods[idx];
            if(eventType)good.eventId = eventType;
            if(Config.coinId.indexOf(good.id) >= 0) {
                this.updateMoney(good);
            }else{
                this.updateItem(good);
            }
        }
    },
    /**
     * 一些特殊事件的更新数据
     */
    speUpdateMoney(data){
        let eveId = data.eventId;
        if(eveId === eveIdType.EXIT_SHUI){
            if(data.roomId !== this.getJoinedRoomId()){
                this.updateGameStatus();
            }
        }
    },
    /**
     * 更新货币
     * @param value
     * @param gameType
     */
    updateMoney:function(data) {
        if(data.id == 1) {
            if (data.num && typeof(data.num) == "number") {
                this.updateBean(data);
            }
        }else if(data.id == 2){
            if (data.num && typeof(data.num) == "number") {
                this.updateCard(data);
            }
        }else if(data.id === 3){
            if (data.num && typeof(data.num) == "number") {
                this.updateDiamond(data);
            }
        }
    },

    /**
     *  增加物品
     */
    updateItem:function (good) {
        let id = +good.id;
        let num = +good.num;
        let param = good.param;
        if(Config.coinId.indexOf(id) >= 0){
            return false;
        }
        let bagItems = this.user.bag.items;
        let fPos = 0;
        for(let pos = 1; pos <= Config.maxBagCount; pos++){
            let item = bagItems[pos];
            if(item){
                if(item.id == id && Config.noNverlying.indexOf(id) === -1) {
                    if(good.id === 12){         // 参赛卡只能一张一张增加
                        item.num += 1;
                        let card = param.card;
                        item.cards.push(card);
                    }else{
                        item.num += num;
                    }
                    if(item.num <= 0){
                        delete bagItems[pos];
                    }
                    break;
                }
            }else {
                if(fPos === 0) {
                    fPos = pos;
                }
            }
        }

        if(fPos != 0 && num > 0){
            let good = {id:id, num:num, pos:fPos};
            if(good.id === 12){             // 参赛卡
                good.cards = [];
                good.cards.push(param.card);
            }
            bagItems[fPos] = good;
        }else{
            return false;
        }

        let sql = util.format("INSERT INTO %s(uid, wx_name, mode, match_id,round_id,cur_round,id,num,plus_cards,plus_beans,plus_diamonds,event_id,time) values (%d, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s)",
            'goods_log',
            this.uid,
            SQL.escape(this.user.info.name),
            SQL.escape("物品相关"),
            0,
            0,
            0,
            id,
            num,
            this.user.status.card,
            gSeer.getPlayerBean(this),
            this.user.status.diamond,
            good.eventId || 0,
            SQL.escape(Date.stdFormatedString())
        );
        SQL.query(sql, function (err) {
            if (err) {
                ERROR("保存物品失败: " + sql);
            }
        });
        return true;
    },
    /**
     * 更新金豆
     * @param values
     * @param eveid
     * @param gameType
     */
    updateBean: function (data) {
        if (data.num && typeof(data.num) == "number") {
            // this.user.status.bean += Math.floor(data.num);
            // if(this.user.status.bean < 0){
            //     this.user.status.bean = 0;
            // }
            this.updateTempSCBean(data.num);
            let sql = util.format("INSERT INTO %s(uid, wx_name, mode, match_id, round_id,cur_round,id,num,plus_cards,plus_beans,plus_diamonds,event_id,time) values (%d, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s)",
                'goods_log',
                this.uid,
                SQL.escape(this.user.info.name),
                SQL.escape(data.mode || "非比赛"),
                data.matchId || 0,
                data.roundId || 0,
                data.curRound || 0,
                1,
                data.num,
                this.user.status.card,
                gSeer.getPlayerBean(this),
                this.user.status.diamond,
                data.eventId || 0,
                SQL.escape(Date.stdFormatedString())
            );
            SQL.query(sql, function (err) {
                if (err) {
                    ERROR("保存金豆失败: " + sql);
                }
            });
            // 奖池
            // if(data.eventId == eveIdType.SERVER_COST){
            //     this.user.consume.serverCost += data.num;
            //     GlobalInfo.globalData.allBonus += Math.floor(Math.abs(data.num) * GlobalInfo.globalData.bonusProp);
            // }
            ExtendMgr.updateSql("beans", gSeer.getPlayerBean(this), this.uid);
            gSeer.sendSCNum(this.uid);
            this.checkBoonRed();
            this.markDirty();
        }
    },
    /**
     * 更新钻石
     * @param values
     * @param eveid
     * @param gameType
     */
    updateDiamond: function (data) {
        if (data.num && typeof(data.num) == "number") {
            this.user.status.diamond += Math.floor(data.num);
            if(this.user.status.diamond < 0){
                this.user.status.diamond = 0;
            }
            let sql = util.format("INSERT INTO %s(uid, wx_name, mode, match_id,round_id,cur_round,id,num,plus_cards,plus_beans,plus_diamonds,event_id,time) values (%d, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s)",
                'goods_log',
                this.uid,
                SQL.escape(this.user.info.name),
                SQL.escape(data.mode || "非比赛"),
                data.matchId || 0,
                data.roundId || 0,
                data.curRound || 0,
                1,
                data.num,
                this.user.status.card,
                gSeer.getPlayerBean(this),
                this.user.status.diamond,
                data.eventId || 0,
                SQL.escape(Date.stdFormatedString())
            );
            SQL.query(sql, function (err, results) {
                if (err) {
                    ERROR("保存钻石失败: " + sql);
                }
            });
            ExtendMgr.updateSql("diamonds", this.user.status.diamond, this.uid);
            this.wsConn.sendMsg({
                code: ProtoID.GAME_MIDDLE_CLIENT_UPDATE_MONEY,
                args: {
                    bean: gSeer.getPlayerBean(this),
                    card: this.user.status.card,
                    diamond: this.user.status.diamond
                }
            });
            this.markDirty();
        }
    },

    /**
     * 更新房卡
     * @param data
     */
    updateCard: function (data) {
        if (data.num && typeof(data.num) == "number") {
            this.user.status.card += Math.floor(data.num);
            if(this.user.status.card < 0){
                this.user.status.card = 0;
            }
            let sql = util.format("INSERT INTO %s(uid, wx_name, mode, match_id,round_id,cur_round,id,num,plus_cards,plus_beans,plus_diamonds,event_id,time) values (%d, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d, %d, %s)",
                'goods_log',
                this.uid,
                SQL.escape(this.user.info.name),
                SQL.escape(data.mode || "非比赛"),
                data.matchId || 0,
                data.roundId || 0,
                data.curRound || 0,
                2,
                data.num,
                this.user.status.card,
                gSeer.getPlayerBean(this),
                this.user.status.diamond,
                data.eventId || 0,
                SQL.escape(Date.stdFormatedString())
            );
            SQL.query(sql, function (err, results) {
                if (err) {
                    ERROR("保存房卡失败: " + sql);
                }
            });
            ExtendMgr.updateSql("room_cards", this.user.status.card, this.uid);
            this.wsConn.sendMsg({
                code: ProtoID.GAME_MIDDLE_CLIENT_UPDATE_MONEY,
                args: {
                    bean: gSeer.getPlayerBean(this),
                    card: this.user.status.card,
                    diamond: this.user.status.diamond
                }
            });
            this.markDirty();
        }
    },

    /**
     * 更新统计
     * @param name
     * @param num
     */
    updateCounts: function (name, num){
        if(this.user.counts){

        }else {
            this.user.counts = {};
            this.markDirty();
        }
        let counts = this.user.counts;
        if(num && typeof(num) === "number"){
            if(counts[name]){
                counts[name] += num
            } else {
                counts[name] = num
            }
        }else{
            return
        }
        let roomId = this.user.room.roomId;
        let room = GSMgr.getRoomData(roomId);
        if(room){
            let matchId = room.matchId;
            this.user.dayVars.serverCostTip[matchId] = 1;
        }
        this.markDirty();
    },

    updateBank: function (name, num) {
        return;
        if(num && typeof(num) === "number"){
            if(this.user.storageBox[name] !== undefined){
                this.user.storageBox[name] += Math.floor(num);
            }
        }else{
            return
        }

        this.markDirty();
    },

    updateGameStatus: function () {
        let roomId = this.user.room.roomId;
        if(roomId === 0){
            return
        }

        let room = GSMgr.getRoomData(roomId);
        if(!room){
            this.setJoinedRoomId(0);
            return;
        }
        let server = GSMgr.getServerBySid(room.sid);
        let status = clone(this.user.status);
        status.bean = gSeer.getPlayerBean(this);
        server.sendMsg({
            code: ProtoID.MIDDLE_GAME_UPDATE_STATUS,
            args: {
                roomId: roomId,
                uid: this.uid,
                status: status,
                gameType: room.gameType
                //bank: this.getBank()
            }
        })

    },

    setBankStat: function (stat) {
        this.user.storageBox.remember = stat
    },

    /**
     * 添加匹配池
     * @param gameType
     * @param scale
     */
    setMatchId: function (matchId) {
        this.matchId = matchId
    },
    /**
     * 获取匹配池
     */
    getMatchId: function () {
      return this.matchId;
    },
    /**
     * 清理匹配池
     */
    clearMatchId: function () {
        this.matchId = 0
    },
    /**
     * 设置上一次心跳时间
     */
    setPreHeartbeat:function () {
        this.preHeartbeat = Date.getStamp();
        if(this.scheJob) {
            clearTimeout(this.scheJob);
            this.scheJob = null;
        }
        this.scheJob = setTimeout(function () {
            this.close();
        }.bind(this), Config.heartbeatMax * 1000);
    },
    /**
     * 保存邮件
     * @param title
     * @param content
     * @param sendPeople
     */
    addMail: function (title, content,type, goods,sendInfo) {
        if (!sendInfo) {
            sendInfo = {};
            sendInfo.sender = "系统";
            sendInfo.senderUid = 0;
        }
        let mails = this.user.mails.mails;
        let onlyId = this.user.mails.onlyId;
        let baseMail = {
            title: title,
            content: content,
            status: goods ? MailStatus.NO_READ_NO_GET : MailStatus.NO_READ_GET,
            sender: sendInfo.sender,
            senderUid: sendInfo.senderUid,
            stamp: Date.getStamp(),
            type:type || 0,
            goods:goods,
            id: onlyId
        };
        mails.push(baseMail);
        this.user.mails.onlyId++;

        let count = mails.length - 20;
        function timeOrder(a, b) {
            return a.stamp - b.stamp;
        }
        if (count > 0) {
            let noRead_noGetMail = [];
            let noRead_GetMail = [];
            let read_noGetMail = [];
            let read_GetMail = [];
            for (let idx = 0; idx < mails.length; idx++) {
                let mail = mails[idx];
                if(mail.status == MailStatus.NO_READ_NO_GET) {
                    noRead_noGetMail.push(mail);
                }else if(mail.status == MailStatus.NO_READ_GET){
                    noRead_GetMail.push(mail);
                }else if(mail.status == MailStatus.READ_NO_GET){
                    read_noGetMail.push(mail);
                }else if(mail.status == MailStatus.READ_GET){
                    read_GetMail.push(mail);
                }
            }
            for (let i = 0; i < count; i++) {
                if (read_GetMail.length > 0) {
                    read_GetMail.sort(timeOrder);
                    read_GetMail.splice(0, 1);
                }else if(noRead_GetMail.length > 0){
                    noRead_GetMail.sort(timeOrder);
                    noRead_GetMail.splice(0, 1);
                }else if(read_noGetMail.length > 0){
                    read_noGetMail.sort(timeOrder);
                    read_noGetMail.splice(0, 1);
                }else if(noRead_noGetMail.length > 0){
                    noRead_noGetMail.sort(timeOrder);
                    noRead_noGetMail.splice(0, 1);
                }
            }

            let tempMails = [];
            for (let idx = 0; idx < noRead_noGetMail.length; idx++) {
                tempMails.push(noRead_noGetMail[idx]);
            }
            for (let idx = 0; idx < noRead_GetMail.length; idx++) {
                tempMails.push(noRead_GetMail[idx]);
            }
            for (let idx = 0; idx < read_noGetMail.length; idx++) {
                tempMails.push(read_noGetMail[idx]);
            }
            for (let idx = 0; idx < read_GetMail.length; idx++) {
                tempMails.push(read_GetMail[idx]);
            }
            this.user.mails.mails = tempMails;
        } else {
            this.user.mails.mails = mails;
        }
        if(this.wsConn) {
            this.wsConn.sendMsg({
                code: ProtoID.MIDDLE_CLIENT_NOTICE_MAIL,
                args: {
                    haveNewMail: true
                }
            });
        }
        this.markDirty();
    },
    /**
     * 获取邮件
     * @returns {mails|{}|*|Array}
     */
    getMails: function () {
        return this.user.mails.mails;
    },
    /**
     * 获取邮件key值
     * @param ids
     * @returns {Array}
     */
    getSubById: function (ids) {
        let mails = this.user.mails.mails;
        let sub = []
        for (let idx in ids) {
            for (let mIdx in mails) {
                if (ids[idx] == mails[mIdx].id) {
                    if (sub.indexOf(mIdx) == -1) {
                        sub.push(+mIdx);
                    }
                }
            }
        }
        return sub;
    },
    /**
     * 邮件打标记
     * @param idx
     */
    setReadMailFlag: function (idx) {
        let mails = this.user.mails.mails;
        if(mails[idx].status == MailStatus.NO_READ_NO_GET) {
            this.user.mails.mails[idx].status = MailStatus.READ_NO_GET;
            this.markDirty();
        }
        if(mails[idx].status == MailStatus.NO_READ_GET){
            this.user.mails.mails[idx].status = MailStatus.READ_GET;
            this.markDirty();
        }
        let flag = this.isExistMail();
        if(flag == false){
            this.wsConn.sendMsg({
                code : ProtoID.MIDDLE_CLIENT_NOTICE_MAIL,
                args:{
                    haveNewMail : false
                }
            });
        }
    }
    ,
    /**
     * 获取邮件内物品
     * @param idx
     */
    getMailGoods:function (idx) {
        let mail = this.user.mails.mails[idx];
        let goods = mail.goods;
        if(!goods){
            ERROR("goods is null");
            return false;
        }
        this.addGoods(goods, eveIdType.MAIL_GET);
        mail.status = MailStatus.READ_GET;
        let flag = this.isExistMail();
        if(flag == false){
            this.wsConn.sendMsg({
                code : ProtoID.MIDDLE_CLIENT_NOTICE_MAIL,
                args:{
                    haveNewMail : false
                }
            });
        }
        return true;
    },
    /**
     * 是否存在有物品没有获取或者未读的邮件
     */
    isExistMail:function () {
        let mails = this.getMails();
        for(let idx in mails){
            let mail = mails[idx];
            if(mail.status == MailStatus.NO_READ_GET || mail.status == MailStatus.NO_READ_NO_GET || mail.status == MailStatus.READ_NO_GET){
                return true
            }
        }
        return false;
    },
    /**
     * 关闭
     */
    close:function () {
        this.save();
        this.wsConn.close();
    },
    /**
     * 设置签名
     * @param sign
     */
    setSignature:function (sign) {
        sign = sign.toString();
        this.user.info.signature = sign;
        this.markDirty();
    },
    /**
     * 设置上级推广员uid
     * @param uid
     */
    setPreExtendUid:function(uid){
        if(typeof(uid) == "number"){
            this.user.extend_info.pre_extend_uid = uid;
        }
    },
    /**
     * 获取上级推官员id
     */
    getPreExtendUid:function () {
        return this.user.extend_info.pre_extend_uid;
    },

    //修改电话号码日志
    authenticationTell: function (tell) {
        this.user.authentication.authTell = tell;
        let uid = this.user.uid;
        let time = Math.floor(new Date().getTime() / 1000);
        let name = this.user.name;
        let table = "authtell_log"
        let sql = `INSERT INTO ${table} (uid, user_name, tell, add_time) VALUES (${uid}, ${name}, ${tell}, ${time})`
        DEBUG(sql);
        SQL.query(sql, (err, results) => {
            if(err){
                ERROR("authtell mysql error" + err);
            }
        })
    },
    /**
     * 通知跑马灯
     */
    sendNotice:function () {
        if (this.wsConn) {
            this.wsConn.sendMsg({
                code: ProtoID.MIDDLE_CLIENT_NOTICE_UPDATE,
                args: {
                    type: 1,
                    data: GlobalInfo.notice
                }
            });
        }
    },
    /**
     * 增加每日
     */
    addFeedBackNum:function () {
        this.user.dayVars.feedbackCount++;
        this.markDirty();
    },
    /**
     * 清理反馈
     */
    clearFeedBackNum:function () {
        this.user.dayVars.feedbackCount = 0;
        this.markDirty();
    },
    /**
     * 设置幸运值
     * @param data
     */
    setLuck:function (data) {
        if(data.mj){
            this.user.luck.mj = data.mj;
            this.user.luck.mj = this.user.luck.mj < 10 ? 10 : this.user.luck.mj;
        }
        if(data.ddz){
            this.user.luck.ddz = data.ddz;
            this.user.luck.ddz = this.user.luck.ddz < 10 ? 10 : this.user.luck.ddz;
        }
        if(data.psz){
            this.user.luck.psz = data.psz;
            this.user.luck.psz = this.user.luck.psz < 10 ? 10 : this.user.luck.psz;
        }
        if(data.ps){
            this.user.luck.ps = data.ps;
            this.user.luck.ps = this.user.luck.ps < 10 ? 10 : this.user.luck.ps;
        }
        if(data.pdk){
            this.user.luck.pdk = data.pdk;
            this.user.luck.pdk = this.user.luck.pdk < 10 ? 10 : this.user.luck.pdk;
        }
        if(data.xzmj){
            this.user.luck.xzmj = data.xzmj;
            this.user.luck.xzmj = this.user.luck.xzmj < 10 ? 10 : this.user.luck.xzmj;
        }
        this.markDirty();
    },
    /**
     * 更新幸运值的公共函数
     * @param key
     * @param value
     */
    updateLuckCommonFun(key,value){
        this.user.luck[key] += value;
        this.user.luck[key] = this.user.luck[key] < 10 ? 10 : this.user.luck[key];
        if(this.user.luck[key] < 120) {
            this.user.luck[key] = this.user.luck[key] > 100 ? 100 : this.user.luck[key];
        }
    },
    /**
     * 更新幸运值
     */
    updateLuck:function (gameType, value) {
        if(gameType === 1) {
           this.updateLuckCommonFun("mj", value);
        }else if(gameType === 2){
            this.updateLuckCommonFun("ddz", value);
        }else if(gameType === 4){
            this.updateLuckCommonFun("psz", value);
        }else if(gameType === 5){
            this.updateLuckCommonFun("ps", value);
        }else if(gameType === 7){
            this.updateLuckCommonFun("pdk", value);
        }else if(gameType === 8){
            this.updateLuckCommonFun("xzmj", value);
        }
        ERROR(this.uid + " luck is: " + JSON.stringify(this.user.luck));
        this.markDirty();
    },
    /**
     * 设置二维码的访问地址
     */
    setTicket: function(data){
        this.user.extend_info.url = data.url;
        this.markDirty();
    },
    /**
     * 获取二维码
     * @param data
     */
    getQrUrl:function () {
        return this.user.extend_info.url;
    },
    /**
     * 绑定银行卡
     * @param data
     */
    setBindBank:function (data) {
        let user = this.user;
        user.bind.bank.bankName = data.bankName;
        user.bind.bank.bankNumber = data.bankNumber;
        user.bind.bank.realName = data.realName;
        this.markDirty();
    },
    /**
     * 绑定支付宝
     * @param data
     */
    setBindAlipay:function (data) {
        let user = this.user;
        user.bind.alipay.realName = data.realName;
        user.bind.alipay.account = data.account;
        this.markDirty();
    },
    /**
     * 获取绑定信息
     * @param type
     */
    getBindInfo:function (type) {
        let user = this.user;
        let data = {};
        if(type == 1){
            data.bankName = user.bind.bank.bankName;
            data.paperId = user.bind.bank.bankNumber;
            data.realName = user.bind.bank.realName;
        }else if(type == 2){
            data.bankName = "";
            data.paperId = user.bind.alipay.account;
            data.realName = user.bind.alipay.realName;
        }
        return data;
    },
    /**
     * 增加福利免费次数
     */
    addBoonFreeCount:function () {
        this.user.boon.curFreeCount++;
        this.markDirty();
    },
    /**
     * 增加福利当前次数
     */
    addBoonCount:function () {
        this.user.boon.curCount++;
        this.markDirty();
    },
    /**
     * 每日提示一次
     */
    boonTodayTip:function () {
        let flag = this.hasJoinedRoom();
        if(this.user.boon.todayTip && !flag && this.user.extend_info.pre_extend_uid !== 0){
            let GameLogic = require("./Game.js");
            GameLogic.reqBoon(this.wsConn, null, null, this);
            this.user.boon.todayTip = false;
            this.markDirty();
        }
    },

    /**
     * 检测是否关注了微信公众号
     */
    checkPub(){
        let unionId = this.user.info.unionId;
        if(unionId !== ""){
            gMatch.giveCard(CSProto.GIVECARD.subPub, this);
        }
    },
    /**
     * 检测金豆不足
     */
    checkBeanLess(){
        return;
        let cfg = Config.subsidyCfg;
        if(gSeer.getPlayerBean(this) < cfg.min){
            if(this.user.subsidy.curCount < cfg.count){
                if(this.getConn()){
                    let data = {curCount:this.user.subsidy.curCount, maxCount:cfg.count, less:cfg.min, give:cfg.num};
                    setTimeout(function () {
                        this.getConn().sendMsg({code:ProtoID.MIDDLE_CLIENT_POP_MESSAGE, args:{data}});
                    }.bind(this), 1000);
                }
            }
        }
    },

    /**
     * 检测福利红点
     */
    checkBoonRed(){
        let user = this.user;
        let boomRed = false;
        let subsidyRed = false;
        let turnRed = false;
        let signRed = false;
        let subCfg = Config.subsidyCfg;
        let boonCfg = csConfig.boonCfg;
        if(gSeer.getPlayerBean(this) < subCfg.min){
            if(user.subsidy.curCount < subCfg.count){
                subsidyRed = true;
            }
        }
        if(user.boon.curFreeCount < boonCfg.freeCount){
            turnRed = true;
        }
        if(user.boon.curCount < boonCfg.maxCount && gSeer.getPlayerBean(this) >= boonCfg.consume){
            turnRed = true;
        }
        let status = user.sign.status;
        for(let day in status){
            if(status[day] === 2){
                signRed = true;
            }
        }
        boomRed = turnRed || subsidyRed || signRed;
        if(this.getConn()){
            this.getConn().sendMsg({code:ProtoID.MIDDLE_CLIENT_BOON_RED, args:{boomRed,turnRed,subsidyRed,signRed}});
        }
    },

    /**
     * 检测连续登陆
     */
    checkSign(){
        let sign = this.user.sign;
        let zpreTime = sign.zpreTime;
        let znow = (new Date()).zeroTime().getStamp();
        if(znow - zpreTime > 24 * 3600){            // 大于一天就要重头开始计时
            sign.continuityDay = 1;
        }
        this.updateSignStatus();
        sign.zpreTime = znow;
    },
    /**
     * 更新连续签到状态
     */
    updateSignStatus(){
        let sign = this.user.sign;
        for(let day in sign.status){
            if( +day <= sign.continuityDay && sign.status[day] === 1){
                sign.status[day] = 2;
            }
            if(sign.status[day] === 2 && +day > sign.continuityDay){
                sign.status[day] = 1;
            }
        }
        this.markDirty();
    },

    /**
     * 是否需要显示连续签到结果
     * @returns {boolean}
     */
    getIsSign(){
        let sign = this.user.sign;
        for(let day in sign.status){
            if(sign.status[day] !== 3){
                return true;
            }
        }
        return false;
    },

    setMatchCard:function (card, type) {
        let rankMatch = this.user.rankMatch;
        if(type === 1){
            rankMatch.classInfo.day.curCard = card.toString();
        }else if(type === 2){
            rankMatch.classInfo.week.curCard = card.toString();
        }else if(type === 3){
            rankMatch.classInfo.month.curCard = card.toString();
        }else if(type === 10){
            this.user.convertCards.push(card);
        }
        this.markDirty();
    },


    addMatchScore:function (score) {
        score = +score;
        let classInfo = this.user.rankMatch.classInfo;
        if(classInfo.month.curCard !== "" || classInfo.week.curCard !== "" || classInfo.day.curCard !== ""){
            classInfo.month.curScore += score;
            classInfo.week.curScore += score;
            classInfo.day.curScore += score;
        }
        this.markDirty();
    },

    resetMatch:function (type) {
        let rankMatch = this.user.rankMatch;
        if(type === 3){
            rankMatch.classInfo.month.curScore = 0;
            rankMatch.classInfo.month.curCard = "";
        }else if(type === 2){
            rankMatch.classInfo.week.curScore = 0;
            rankMatch.classInfo.week.curCard = "";
        }else if(type === 1){
            rankMatch.classInfo.day.curScore = 0;
            rankMatch.classInfo.day.curCard = "";
        }
        // 方案已改 现在不送金豆
        // let diff = gMatch.initBean - this.user.status.bean;
        // let data = {num:diff,eventId:eveIdType.RESET_MATCH};
        // this.updateBean(data);
        this.updateGameStatus();
        // this.user.storageBox.bean = 0;
        this.markDirty();
    },

    isHaveMatchMail() {
        if(this.wsConn){
            let mails = this.user.mails.mails;
            let find = false;
            for(let idx in mails){
                let mail = mails[idx];
                if(mails[idx].type == 1){
                    if(mail.status == MailStatus.NO_READ_NO_GET){
                        find = true;
                        break;
                    }
                }
            }
            this.wsConn.sendMsg({
                code : ProtoID.MIDDLE_CLIENT_MATCH_HAVE_MAIL,
                args:{
                    display:find
                }
            })
        }
    },

    setNetAccount(account){
        account = account.toString();
        this.user.rankMatch.netAccount = account;
        this.markDirty();
    },

    setTvAccount(account){
        account = account.toString();
        this.user.rankMatch.tvAccount = account;
        this.markDirty();
    },

    setAddress(phone, address, name){
        let addressInfo = this.user.rankMatch.addressInfo;
        if(addressInfo){
            addressInfo.tell = phone;
            addressInfo.address = address;
            addressInfo.name = name;
        }
        this.markDirty();
    },

    setNameAndId(data){
        this.user.info.identity = data.identity;
        this.user.info.realName = data.name;
        this.markDirty();
    },

    setFillInvite(value=""){
        this.user.fillInvitation = value;
        this.markDirty();
    },

    setInvitation(value=""){
        this.user.invitation = value;
        this.markDirty();
    },

    /**
     * 设置背包中的电话号码
     * @param value
     */
    setBagPhone(value = ""){
        this.user.bag.phone = value;
        this.markDirty();
    },
    /**
     * 绑定宽带账户
     * @param value
     */
    setBagNet(value = ""){
        this.user.bag.netAccount = value;
        this.markDirty();
    },
    /**
     * 绑定有线电视
     * @param value
     */
    setBagTV(value=""){
        this.user.bag.tvAccount = value;
        this.markDirty();
    },
    /**
     * 绑定手机
     * @param value
     */
    setBagWX(value = ""){
        this.user.bag.wxAccount = value;
        this.markDirty();
    },
    /**
     * 增加背包日志
     * @param msg
     * @param plusNum
     */
    addBagLog(msg, num){
        if(!this.user.bag.records){
            this.user.bag.records = [];
        }
        let records = this.user.bag.records;
        records.push({msg,num});
        if(records.length > Config.maxBagRecordCount){
            records.splice(0, 1);
        }
        this.user.bag.recordRed = true;
        this.sendBagRecordRed();
        this.markDirty();
    },
    /**
     * 发送背包红点
     */
    sendBagRecordRed(){
        if(this.wsConn){
            this.wsConn.sendMsg({code:ProtoID.MIDDLE_CLIENT_BAG_RED, args:{red:this.user.bag.recordRed || false}});
        }
    },
    /**
     * 玩家切后台，游戏已经解散 在切回来就强制玩家退出当前游戏
     * @constructor
     */
    ForceExitGame(){
        if(!this.hasOwnedRoom()){
            if(this.wsConn){
                this.wsConn.sendMsg({code:ProtoID.MIDDLE_CLIENT_EXIT_GAME});
            }
        }
    },
    /**
     * 服务器重启，重置某些数据
     */
    resertData(){
        let user = this.user;
        user.PFC.withdrawIng = false;
        user.PFC.addressIndex = 0;
        this.setOwnedRoomId(0);
        this.setJoinedRoomId(0);
        this.markDirty();
    },
    /**
     * 设置PFC数据
     * @param data
     */
    setPFCInfo(data){
        this.user.PFC.address = data.address || "";
        this.user.PFC.address_type = data.address_type || "";
        ExtendMgr.updateSql("pfc_address",this.user.PFC.address,this.uid);
        this.markDirty();
    },
    /**
     * 想客户端发送PFC消息
     */
    sendPFCInfo(){
        this.getPFCAddress(function(address){
            if(address != ""){
                Http.requestGame(BSProto.ReqArgs.GET_PFC_ADDRES_URL, {uid: this.uid, address}, 3, Config.addresPath,function (data) {
                    if(data) {
                        let res = {};
                        try {
                            res = JSON.parse(data);
                        }catch(e){
                            ERROR("解析PFC地址信息错误，请联系相关工作人员");
                            this.sendMsgToClient(ProtoID.CLIENT_MIDDLE_PFC_IN, {address, url:"", result:CSProto.ProtoState.STATE_FAILED});
                            return;
                        }
                        // 连续发送三遍 防止有些机型加载过慢导致的数据不能同步
                        this.sendMsgToClient(ProtoID.CLIENT_MIDDLE_PFC_IN, {address, url:res.url, count:1});
                        setTimeout(function(){
                            this.sendMsgToClient(ProtoID.CLIENT_MIDDLE_PFC_IN, {address, url:res.url, count:2});
                        }.bind(this), 1500);
                        setTimeout(function(){
                            this.sendMsgToClient(ProtoID.CLIENT_MIDDLE_PFC_IN, {address, url:res.url, count:3});
                        }.bind(this), 3000);
                    }
                }.bind(this))
            }else{
                this.sendMsgToClient(ProtoID.CLIENT_MIDDLE_PFC_IN, {address, url:"", result:CSProto.ProtoState.STATE_FAILED});
            }
        }.bind(this))
    },
    /**
     * 玩家没有钱包地址登录就绑定一个给他
     */
    getPFCAddress(callback){
        let user = this.user;
        if(user.PFC.address === "") {
            PFCMgr.bindPFC(user.info.openId, function (res) {
                if(res) {
                    let obj = JSON.parse(res);
                    if(obj.code === 0){
                        this.setPFCInfo(obj.data);
                        callback(user.PFC.address);
                    }else{
                        ERROR("getPFCAddress fail: " + obj.msg);
                        callback("");
                    }
                }
            }.bind(this));
        }else{
            callback(user.PFC.address);
        }
    },
    /**
     * 增加PFC充值记录
     */
    addPFCRechargeRecord(data, num){
        let record = {time:Date.stdFormatedString(), num};
        let records = this.user.PFC.rechargeRecords;
        records.push(record);
        if(records.length > 30){
            records.splice(0, records.length - 30);
        }
        this.markDirty();
    },
    /**
     * 玩家提现记录
     */
    addPFCWithdraw(status, data = {}){
        let records = this.user.PFC.withdrawRecords;
        if(status === 0) {                              // 新加明细
            let num = CommFuc.accDiv(data.withdrawAmount, PFCMgr.beanToPFC);
            let brokerage = CommFuc.accDiv(data.brokerage, PFCMgr.beanToPFC);             // 手续费
            let address = data.address;
            let record = {time: Date.stdFormatedString(), seq:data.seq, status, brokerage, num, address};
            records.push(record);
            if(records.length > 20){
                records.splice(0, records.length - 20);
            }
        }else if(status === 1){                         // 更改订单状态
            for(let idx in records){
                let record = records[idx];
                if(data.seq === record.seq){
                    record.status = status;
                }
            }
        }
    },
    /**
     * 增加PFC提现地址记录
     * @param address
     */
    addAddressRecord(address){
        let withdrawAddress = this.user.PFC.withdrawAddress;
        let pos = withdrawAddress.indexOf(address);
        if(pos === -1){
            withdrawAddress.push(address);
        }
        this.markDirty();
    },
    /**
     * 设置PFC密码
     */
    setPFCPassword(password){
        this.user.PFC.password = password;
        this.markDirty();
    },
    /**
     * 设置该账号为总代
     */
    setGM(){
        this.user.extend_info.isGM = true;
        this.markDirty();
    },
    /**
     * 设置房卡请求
     */
    setFKReq(len){
        let tmp = this.tmp;
        tmp.recvServerMax = len;
        tmp.recvServerCur = 0;
        tmp.FKList = [];
        tmp.listIdx = 0;
    },
    /**
     * 获取房卡场列表到客户端
     */
    getFKListToClient(){
        let tmp = this.tmp;
        if(!tmp.FKList){
            tmp.FKList = [];
            tmp.listIdx = 0;
        }
        let FKList = tmp.FKList;
        let maxNum = FKList.length;
        let end = Math.min(tmp.listIdx + Config.FKMaxShow, maxNum);
        return FKList.slice(tmp.listIdx, end);
    },
    /**
     * 玩家频繁点击刷新 导致的房间重复 ，这里优化下
     */
    removeSameRoom(){
        let FkList = this.tmp.FKList;
        let list = [];
        for(let idx in FkList){
            let room = FkList[idx];
            let add = true;
            for(let j in list){
                let curRoom = list[j];
                if(curRoom.roomId === room.roomId){
                    add = false;
                    break;
                }
            }
            if(add) {
                list.push(room);
            }
        }
        this.tmp.FKList = list;
    },
    /**
     * 房卡排序
     * @constructor
     */
    FKListSort()
    {
        let FkList = this.tmp.FKList;
        function sortByNum(data){
            return data.maxNum - data.curNum;
        }
        FkList.sort(function (a, b) {
            return sortByNum(a) > sortByNum(b) ? 1 : -1;
        })
    },

    setSeerInfo(data){
        let SEER = this.user.SEER;
        SEER.account = data.account;
        SEER.privateKey = data.wif_priv_key;
        SEER.publicKey = data.pub_key;
        SEER.id = data.id;
        SEER.brain = data.brain_priv_key;
        this.markDirty();
    },

    setSCBean(value){
        let SEER = this.user.SEER;
        SEER.scBean = value;
        this.markDirty();
    },

    setTempBean(value){
        if (typeof(value) === "number") {
            let SEER = this.user.SEER;
            SEER.tempBean = value;
            this.markDirty();
        }
    },
    /**
     * 不允许小于0的存在
     * @param value
     */
    updateTempSCBean(value){
        if (typeof(value) === "number") {
            let SEER = this.user.SEER;
            SEER.tempBean += value;
            if(SEER.tempBean + SEER.scBean < 0){
                SEER.tempBean = -SEER.scBean;
            }
            gSeer.TempBeanToSc(this);       // todo 每次都会刷新
            this.markDirty();
        }
    },
    /**
     * 激活seer划转功能
     * @param value
     */
    activateSeer(value){
        let SEER = this.user.SEER;
        if(SEER && SEER.account !== ""){
            SEER.enable = value;
        }
        this.markDirty();
    },
    /**
     * 每个xx时间更新一次数据
     */
    setSeerUpdate(){
        setInterval(function () {
            // gSeer.TempBeanToSc(this);            // 这里将不再将临时seer放到文体平台上， 只有当用户登录 或者 自动存入他自己的账号才进行操作，以减少文体平台扣除的保证金
            gSeer.AsyncBoxBean(this);
        }.bind(this), gSeer.SCTime);
    },
    /**
     * 增加SEER提币记录
     * @param num
     */
    addSeerWithdraw(num){
        let records = this.user.SEER.withdrawRecords;
        let data = {num, time:Date.stdFormatedString()};
        records.push(data);
        if(records.length > 20){
            records.splice(0, records.length - 20);
        }
        this.markDirty();
    }
};

///////////////////////////////////////////////////////////////////////////////
// 玩家管理器
function PlayerManager() {
    this.plats = {};
    this.players = {};
}

PlayerManager.prototype = {
    /**
     * 初始化
     * @param callback
     */
    init: function (callback) {
        let cursor = MongoPlat.find();
        cursor.each(function (err, item) {
            if (err) {
                ERROR(err);
                process.exit(-1);
            }

            if (item) {
                this.plats[item._id] = +item.uid;
            }

            if (cursor.isClosed()) {
                callback && callback();
            }
        }.bind(this));

        setInterval(function () {
            for (let uid in this.players) {
                if (!this.players.hasOwnProperty(uid)) {
                    continue;
                }
                this.players[uid].save();
            }
        }.bind(this), Config.SavePlayerDataTime * 1000);
    },
    /**
     * 每次重启服务器需要做的操作
     */
    reStartServer(){
        for(let openId in this.plats){
            let uid = this.plats[openId];
            (function (uid) {
                this.getPlayerNoCreate(uid, (player)=>{
                    if(player){
                        player.fullData();
                        player.resertData();
                        player.save();
                    }
                });
            }.bind(this))(uid);
        }
    },
    /**
     * 通过openId获取Uid
     * @param openId
     */
    getUidByAccount(openId){
        return this.plats[openId];
    },
    /**
     * 检查平台编号是否已经存在
     * @param openid
     * @returns {boolean}
     */
    hasOpenid: function (openid) {
        return this.plats.hasOwnProperty(openid);
    },

    /**
     * 获取用户编号
     * @param openid
     * @returns {number}
     */
    getUid: function (openid) {
        return +(this.plats[openid]);
    },
    /**
     * 注册一个新平台帐号
     * @param openid
     * @param wx_name
     * @param callback
     */
    addPlat: function (openid, wx_name, callback) {
        if (this.plats.hasOwnProperty(openid)) {
            callback(null, +(this.plats[openid]));
        } else {
            MongoPlat.findOneAndUpdate({_id: '_userid'}, {$inc: {'ai': 1}}, {'returnOriginal': false}, function (err, result) {
                if (!err) {
                    let newUid = +(result.value.ai);   //这里的ai就是玩家的uid
                    // 后台增加记录相关
                    /*
                     let tbl = {uid:newUID, nickname:wx_name, init_card:Config.InitPlayerDiamond, init_gold: Config.InitPlayerCoin};
                     HttpReq.requestGame(BSProto.ReqArgs.ADD_USER, tbl,1,null)
                     */
                    MongoPlat.insertOne({_id: openid, uid: newUid, time: Date.getStamp()}, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            this.plats[openid] = newUid;
                            callback(null, newUid);
                            LOG(util.format("OpenID %s registerd as %d", openid, newUid));
                        }
                    }.bind(this));
                } else {
                    callback(err);
                }
            }.bind(this));
        }
    },
    /**
     * 删除一个玩家账号
     * @param uid
     * @param callback
     */
    delUser: function (uid, callback) {
        if (!this.players.hasOwnProperty(uid)) {
            callback(null);
        } else {
            MongoUser.findOneAndDelete({_id: uid}, function (err, result) {
                if (!err) {
                    callback(this.players[uid])
                    LOG(util.format("OpenID %s Removed", uid));
                } else {
                    callback(err);
                }
            }.bind(this));
        }
    },

    /**
     * 获取玩家数据
     * @param uid
     * @param callback
     */
    getPlayer: function (uid, callback) {
        uid = +uid;
        if(uid < 100000){
            callback(null);
            return;
        }
        if (this.players.hasOwnProperty(uid)) {
            callback(this.players[uid]);
        } else {
            this.loadPlayer(uid, function (player) {
                player.fullData();
                this.players[uid] = player;
                callback(player);
            }.bind(this));
        }
    },
    /**
     * 获取玩家数据不新建
     */
    getPlayerNoCreate:function (uid, callback) {
        uid = +uid;
        if(uid < 100000){
            callback(null);
            return;
        }
        if (this.players.hasOwnProperty(uid)) {
            callback(this.players[uid]);
        } else {
            MongoUser.findOne({_id: uid}, {}, function (err, doc) {
                if(doc){
                    let player = new Player(uid);
                    player.user = doc;
                    player.fullData();
                    callback && callback(player);
                }else{
                    callback(null);
                }
            })
        }
    },
    /**
     * 获取玩家是否在线
     * @param uid
     * @returns {boolean}
     */
    isOnLine: function (uid) {
        if (this.players.hasOwnProperty(uid)) {
            let disconnection = false;
            for (let idx in DXMgr.wsConnMap) {
                if (DXMgr.wsConnMap[idx].wsConn.uid == uid) {
                    disconnection = true;
                    break;
                }
            }
            if (!disconnection) {
                return true;
            }
        }
        return false;
    },
    /**
     * 是否有玩家
     */
    getRegisterPlayerData:function (uid, callback) {
        if(this.players.hasOwnProperty(uid)){
            callback(this.players[uid].user);
        }
        MongoUser.findOne({_id: +uid}, {}, function (err, res) {
            if (!err) {
                callback(res);
            } else {
                callback(null);
            }
        }.bind(this));
    },
    /**
     * 获取在线玩家列表
     * @param uid
     * @param callback
     */
    getOnlinePlayer: function (uid, callback) {
        if(uid < 100000){
            callback(null);
            return;
        }
        if (this.players.hasOwnProperty(uid)) {
            callback(this.players[uid]);
        } else {
            callback(null);
        }
    },

    /**
     * 加载玩家数据
     * @param uid
     * @param callback
     */
    loadPlayer: function (uid, callback) {
        let player = new Player(uid);
        player.init({}, function (suss) {
            if (suss) {
                this.players[uid] = player;
                callback && callback(player);
            } else {
                callback && callback();
            }
        }.bind(this));
        player.save();
    },
    /**
     * 保存所有数据
     * @param callback
     */
    saveAll: function (callback) {
        for (let uid in this.players) {
            if (!this.players.hasOwnProperty(uid)) {
                continue;
            }
            this.players[uid].save();
        }
        callback && callback();
    },
    /**
     * 获取注册过账号的玩家信息
     * @param targetUid
     * @param callback
     */
    getplayerInfo: function (targetUid, callback) {
        PlayerMgr.getOnlinePlayer(targetUid, function (player) {
            if (player) {
                let wsConn = player.getConn();
                if (WssServer.wsConnMap[wsConn.getId()]) {
                    callback(null, player);
                } else {
                    DEBUG("玩家断线,发送邮件");
                    callback(null, false);
                }
            } else {
                MongoUser.findOne({_id: +targetUid}, {}, function (err, res) {
                    if (res) {
                        callback(null, false);
                    } else {
                        ERROR("没有找到改玩家");
                        callback(true);
                    }
                }.bind(this));
            }
        })
    },

    /**
     * 全服广播
     * @param code
     * @param msg
     */
    broadcastToAll: function (msg) {
        for (let uid in this.players){
            let player = this.players[uid];
            if(player){
                player.wsConn.sendMsg(msg)
            }
        }
    },
	/**
     * 向玩家发送验证码
     * @param uid  玩家ID
     * @param tell   电话号码
     */
    sendSmsCode: function (uid, tell) {

        let sms = require("../util/Sms");

        if(this.isOnLine(uid)){
            this.getPlayerNoCreate(uid, (player)=>{
                if(!player){
                    return
                }

                if(!tell){
                    return
                }

                if(typeof tell !== "number"){
                    tell = parseInt(tell);
                }
                //判断玩家是否有有效验证码
                //处理玩家逻辑
                //玩家保存验证码
                //发送验证码
                sms.sendSms(tell);
            })
        }
    },
    /**
     * 发送富豪榜跑马灯
     * @param ranks 名称数组
     * @param cfg 奖励配置
     */
    sendBeanRankNotice(ranks,cfg, num){

        let str = `恭喜【${ranks[0].name}玩家】夺得今日富豪榜第一名同时将获得${Math.floor(cfg[ranks[0].rank] * num / 100)}金豆。恭喜【${ranks[1].name}玩家】夺得今日富豪榜第二名同时将获得${Math.floor(cfg[ranks[1].rank] * num / 100)}金豆。恭喜【${ranks[2].name}玩家】夺得今日富豪榜第三名同时将获得${Math.floor(cfg[ranks[2].rank] * num / 100)}金豆`
        let data = [];
        let notice = {};
        notice.content = str;
        notice.order = 1;
        notice.interval = 15;
        notice.count = 1;
        notice.startTime = CommFuc.getSecondsByTimeString("12:00:00");
        notice.endTime = CommFuc.getSecondsByTimeString("13:00:00");
        data.push(notice);
        this.broadcastToAll({
            code: ProtoID.MIDDLE_CLIENT_NOTICE_UPDATE,
            args:{
                type: 2,
                data: data,
            }
        });
    }

};

exports.PlayerManager = PlayerManager;
