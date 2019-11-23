///////////////////////////////////////////////////////////////////////////////
//>> 推广员管理模块
let util        = require("util");
let CSProto     = require("../net/CSProto.js");
let moment      = require("moment");
let async       = require('async');
let CommFuc     = require("../util/CommonFuc.js");
let schedule    = require('node-schedule');

class Match {

    constructor(){
        this.card_list = {};                            // 参赛号码列表
        this.statusCfg = {none:0, playing: 1, rest:2};  // 正在玩，休息
        this.initMsg = "广电杯排名赛 ";                  // 出事赛配置
        this.status = {1:this.statusCfg.none, 2:this.statusCfg.none, 3:this.statusCfg.none};
        this.updateTime = 3 * 1000;                     // 更新排行榜时间
        this.maxRankNum = 50;                           // 显示的最大排行个数
        this.ranks = {1:[], 2:[], 3:[]};                // 排行分别是日周年
        this.initBean = 0;                              // 比赛模式给玩家的初始金豆
        this.rewardMax = {1:50, 2:50, 3:50};            // 奖励发送最大数
        this.scheJob = null;                            // 定时任务
        this.pMaxRecord = 20;                           // 玩家的最大记录
        this.gMaxRecord = 20;                           // 世界服记录的最大记录
        this.boMsg = this.initMsg;                      // 播报头
        this.sendBo = false;                            // 是否已经播报了
        this.defaultCfg = {                             // 默认奖励
            1: {
                1: [{id: 7, num: 1}, {id: 8, num: 1}, {id: 9, num: 10000}],
                2: [{id: 7, num: 1}, {id: 9, num: 6000}],
                3: [{id: 8, num: 1}, {id: 9, num: 3000}],
                9: [{id: 9, num: 2000}],
                50: [{id: 9, num: 1000}]
            },
            2:{
                1:[{id:10, num:1}]
            },
            3:{
                1:[{id:11, num:1}]
            }
        }
        //------------------------------------------礼品码配置---------------------------//
        this.convertCfg = {
            10:[{id:1, num:10000},{id:2, num:10}],
            11:[{id:1, num:100000},{id:2, num:100}],
            12:[{id:1, num:1000000},{id:2, num:1000}]
        }
    }
    /**
     * 读取数据库内容
     * @param callback
     */
    loadData (callback) {
        async.series([
            function(cb) {
                let sql = util.format("SELECT * FROM %s", 'game_card');
                SQL.query(sql, function (err, results) {
                    if (err) {
                        ERROR("查询推广员数据失败 " + err.message);
                        cb(err);
                    } else {
                        let res = JSON.parse(JSON.stringify(results));
                        if (res.length != 0) {
                            for (let idx in res) {
                                let card = res[idx].card_number;
                                card = card.toString();
                                this.card_list[card] = {};
                                let info = this.card_list[card];
                                info.uid = res[idx].uid;
                                info.batch = res[idx].batch;
                                info.status = res[idx].status;
                                info.type = res[idx].type;
                                info.sendCard = res[idx].send_out;
                                info.card = card;
                            }
                            this.reward = this.defaultCfg;
                            cb(null);
                        }
                    }
                }.bind(this));
            }.bind(this)
        ],function (err) {
            if(err) {
                callback(err);
                return;
            }else{
                this.setMatchData();
                callback(null);
            }
        }.bind(this));
    }
    /**
     * 检测报名号码
     */
    checkCard(card, player){
        let info = this.card_list[card];
        if(!info){
            return CSProto.ProtoState.STATE_MATCH_NO_EXIST;
        }
        if(info.status == 1){
            return CSProto.ProtoState.STATE_MATCH_READY_USE;
        }
        if(info.type >= 1 && info.type <= 3) {                  // 参赛卡检测
            let classInfo = player.user.rankMatch.classInfo;
            if (CommFuc.getMatchIng(classInfo)) {
                return CSProto.ProtoState.STATE_MATCH_MATCHING;
            }
        }else if(info.type === 10){                             // 兑换卡检测

        }
        return CSProto.ProtoState.STATE_OK;
    }

    /**
     * 使用比赛卡
     * @param player
     * @param data
     * @returns {*}
     */
    userCard(player, data){
        if(!data.card)return;
        let card= data.card.toString();
        let ret = this.checkCard(card, player);
        if(ret !== CSProto.ProtoState.STATE_OK){
            return ret;
        }
        let type = this.card_list[card].type;
        player.setMatchCard(card, type);
        switch (type) {
            case 1:
            case 2:
            case 3:
                this.sendMathInfo(player);
                break;
            case 10:
            case 11:
            case 12:
                let goods = this.convertCfg[type];
                if(goods) {
                    player.addMail("SEER兑换成功", "恭喜您，道具已兑换成功，请您及时领取", 0, goods);
                }
                break;
            default:
                break;
        }
        this.updateSql("status",1,card);
        this.updateSql("use_time",Date.stdFormatedString(), card);
        this.updateSql("uid", player.uid, card);
        return ret;
    }

    /**
     * 更新参赛信息
     * @param player
     */
    sendMathInfo(player){
        if(player.getConn()){
            let matchInfo = clone(player.user.rankMatch);
            matchInfo.matchIng = CommFuc.getMatchIng(matchInfo.classInfo);
            delete matchInfo.record;
            player.getConn().sendMsg({code:CSProto.ProtoID.GAME_CLIENT_MATCH_INFO,args: {rankMatch:matchInfo}});
        }
    }
    /**
     * 更新
     * @param uid
     * @param callback
     */
    updateSql(key, value, number) {
        if(typeof(value) == "string") value = SQL.escape(value);
        let info = this.card_list[number];
        if(info) {
            info[key] = value;
            let sql = `UPDATE game_card SET ${key} = ${value} WHERE card_number=${number}`;
            SQL.query(sql, function (err) {
                if (err) {
                    ERROR(`updateSql extend error sql: ${sql}`);
                }
            })
        }
    }

    getGoodByRank(rank, type){
        let goods = null;
        let cfg = this.reward[type] || {};
        for(let cRank in cfg){
            if(+cRank >= rank){
                goods = cfg[cRank];
                break;
            }
        }
        return goods;
    }

    getMatchWord(type){
        let msg = "";
        if(type === 1){
            msg = "日";
        }else if(type === 2){
            msg = "周";
        }else if(type === 3){
            msg = "月";
        }
        return msg;
    }


    sendReward(type){
        return;                             // 不在发送奖励(老宋单独做的功能，此功能不在处理)
        let ranks = this.ranks[type];
        let len = Math.min(this.rewardMax[type], ranks.length);
        let descWord = this.getMatchWord(type);
        let commonMsg = this.getBoMsg(type);
        for(let idx = 0; idx < len; idx++){
            let info = ranks[idx];
            if(info) {
                let uid = info.uid;
                (function (uid, idx) {
                    PlayerMgr.getPlayerNoCreate(uid, (player) => {
                        if (player) {
                            let rank = +idx + 1;
                            let goods = this.getGoodByRank(rank, type);
                            if(goods) {
                                player.addMail(`广电杯${descWord}赛`, `恭喜你在${commonMsg}${descWord}赛中获得第${rank}名`, 1, goods);
                                player.isHaveMatchMail();
                            }
                            let recordMsg = `你在${commonMsg} ${descWord}赛中获得第${rank}名`;
                            this.recordMsg(player, recordMsg, 1);
                            recordMsg = `【${player.user.info.name}】在${commonMsg}${descWord}赛中获得第${rank}名`;
                            this.recordMsg(player, recordMsg, 2);
                        }
                    })
                }.bind(this))(uid, idx);
            }
        }
        this.genBoMsg(type);
    }

    recordMsg(player, msg, type){
        if(type === 1){
            let pRecord = player.user.rankMatch.record;
            pRecord.push(msg);
            if(pRecord.length >= this.pMaxRecord){
                pRecord.splice(0, 1);
            }
        }else if(type == 2) {
            let gRecord = GlobalInfo.globalData.matchRecord;
            gRecord.push(msg);
            if (gRecord.length >= this.gMaxRecord) {
                gRecord.splice(0, 1);
            }
        }
    }

    reqRecordMsg(player){
        let gRecord = GlobalInfo.globalData.matchRecord;
        let pRecord = player.user.rankMatch.record;
        return {gRecord:gRecord, pRecord:pRecord}
    }

    getBoMsg(type){
        let now = Date.getStamp();
        let msg = "";
        let endTime = 0;
        if(type === 1) {
            endTime = CommFuc.getTodayDataByTime("11:55:00");
            let ef = Date.formatDate(endTime);
            msg = `${ef.year}年${ef.month}月${ef.day}日`;
        }else if(type === 2){
            endTime = CommFuc.getWeekDayTime(7, "11:55:00");
            if(now > endTime){
                endTime = CommFuc.getWeekDayTime(7, "11:55:00", true);
            }
            let originDate = Date.formatDate(endTime);
            let data = {num: 0};
            CommFuc.getWeekNumberByTime(endTime, originDate.month, data);
            msg = `${originDate.year}年${originDate.month}月第${data.num}周`;
        }else if(type === 3){
            let startTime = CommFuc.getCurMonthTime(1,"12:00:00");
            let data = Date.formatDate(startTime);
            let rYear = data.year;
            let rMonth = data.month;
            if(now < startTime){
                rMonth -= 1;
                if(rMonth <= 0){
                    rMonth = 12;
                    rYear -= 1;
                }
            }
            msg = `${rYear}年${rMonth}月`
        }
        return msg;
    }

    genBoMsg(type){
        let commonMsg = this.getBoMsg(type);
        let descWord = this.getMatchWord(type);
        let msg = `${commonMsg}${descWord}赛获奖名单出炉了!!!`;
        let ranks = this.ranks[type];
        let len = Math.min(3, ranks.length);
        for(let idx  = 0; idx < len; idx++){
            let name = ranks[idx].name;
            msg += `玩家${name}获得第${idx+1}名`;
            if(idx == len - 1){
                msg += "。";
            }else{
                msg += "、";
            }
        }
        this.boMsg += msg;
    }

    sendBoBao(){
        if(!this.sendBo){
            this.clearScheJob();
            let GameLogic = require("./Game.js");
            let msg = this.boMsg;
            GameLogic.insertNotice(null, null, {msg:msg});
            this.scheJob = setInterval(function () {
                GameLogic.insertNotice(null, null, {msg:msg});
            }, 40 * 1000);

            setTimeout(function () {
                this.clearScheJob();
            }.bind(this), 5 * 60 * 1000);

            this.sendBo = true;
        }
    }

    clearScheJob(){
        clearInterval(this.scheJob);
        this.scheJob = null;
    }

    setMatchStatus(){
        let dayEndTime = CommFuc.getTodayDataByTime("11:55:00");
        let dayStartTime = CommFuc.getTodayDataByTime("12:00:00");
        let now = Date.getStamp();
        if(now > dayEndTime && now < dayStartTime){
            this.status[1] = this.statusCfg.rest;
        }else{
            this.status[1] = this.statusCfg.playing;
        }
        let weekEndTime = CommFuc.getWeekDayTime(7,"11:55:00",false);
        let weekStartTime = CommFuc.getWeekDayTime(7,"12:00:00",false);
        let test = Date.formatDate(weekStartTime);
        ERROR(JSON.stringify(test));
        if(now > weekEndTime && now < weekStartTime){
            this.status[2] = this.statusCfg.rest;
        }else{
            this.status[2] = this.statusCfg.playing;
        }
        let monthEndTime = CommFuc.getCurMonthTime(1,"11:55:00");
        let monthStartTime = CommFuc.getCurMonthTime(1, "12:00:00");
        test = Date.formatDate(monthStartTime);
        ERROR(JSON.stringify(test));
        if(now > monthEndTime && now < monthStartTime){
            this.status[3] = this.statusCfg.rest;
        }else{
            this.status[3] = this.statusCfg.playing;
        }
    }

    getStrFormat(type, subType){
        let msg = "";
        if(type === 1){
            if(subType === 1) {
                msg = util.format("%s %s %s %s %s %s", "0", "55", "11", "*", "*", "*");
            }else if(subType === 2){
                msg = util.format("%s %s %s %s %s %s", "0", "0", "12", "*", "*", "*");
            }
        }else if(type === 2){
            if(subType === 1) {
                msg = util.format("%s %s %s %s %s %s", "0", "55", "11", "*", "*", "0");
            }else if(subType === 2){
                msg = util.format("%s %s %s %s %s %s", "0", "0", "12", "*", "*", "0");
            }
        }else if(type === 3){
            if(subType === 1) {
                msg = util.format("%s %s %s %s %s %s", "0", "55", "11", "1", "*", "*");
            }else if(subType === 2){
                msg = util.format("%s %s %s %s %s %s", "0", "0", "12", "1", "*", "*");
            }
        }
        return msg;
    }


    setTimIng(){
        return;                 // 已经屏蔽
        for(let type = 3; type >= 1; type--) {
            let strTime = this.getStrFormat(type, 1);
            schedule.scheduleJob(strTime, function () {
                this.status[type] = this.statusCfg.rest;
                this.updateRank();
                setTimeout(function () {
                    this.sendReward(type);
                    setTimeout(function () {
                        this.reset(type);
                    }.bind(this), 1000)
                }.bind(this), 1000);

                setTimeout(function () {
                    this.sendBoBao();
                }.bind(this), 5 * 1000);

            }.bind(this));

            strTime = this.getStrFormat(type, 2);
            schedule.scheduleJob(strTime, function () {
                this.status[type] = this.statusCfg.playing;
                this.boMsg = this.initMsg;
                this.sendBo = false;
            }.bind(this));
        }

    }

    setMatchData(){
        this.setMatchStatus();
        this.setTimIng();
        setInterval(function () {
            this.updateRank();
        }.bind(this),this.updateTime)
    }

    /**
     * 重置
     * @param type
     */
    reset(type){
        for(let openId in PlayerMgr.plats){
            let uid = PlayerMgr.plats[openId];
            (function (uid) {
                PlayerMgr.getPlayerNoCreate(uid,(player)=>{
                    if(player){
                        player.resetMatch(type);
                        player.save();
                        this.sendMathInfo(player);
                    }
                })
            }.bind(this))(uid)
        }
        this.ranks = [];
        // GlobalInfo.globalData.matchRecord = [];  // 是否清理日志 再议
    }

    /**
     * 更新积分
     * @param uid
     * @param score
     */
    updateScore(uid, score){
        PlayerMgr.getPlayerNoCreate(uid,(player)=>{
            if(player){
                player.addMatchScore(score);
            }
        })
    }
    /**
     * 获取所有玩家信息
     * @param cb
     */
    getAllPlayerInfo(cb){
        PlayerMgr.saveAll(function () {
            MongoUser.find({}).toArray((err, result) => {
                let tInfo = [];
                if(!result){
                    cb && cb(tInfo);
                    return
                }
                result.forEach((data)=>{
                    let info = {};
                    info.name = data.info.name;
                    info.headPic = data.info.headPic;
                    info.uid = data._id;
                    let classInfo = data.rankMatch.classInfo;
                    info.dayScore = classInfo.day.curScore;
                    info.weekScore = classInfo.week.curScore;
                    info.monthScore = classInfo.month.curScore;
                    info.MatchIng = CommFuc.getMatchIng(classInfo);
                    tInfo.push(info)
                });
                cb && cb(tInfo)
            });
        });
    }

    updateRank(){
        this.getAllPlayerInfo((data)=>{
            let dayData = clone(data);
            let weekData = clone(data);
            let monthData = clone(data);

            dayData.sort((a, b)=>{
                return b.dayScore - a.dayScore;
            });
            weekData.sort((a, b)=>{
                return b.weekScore - a.weekScore;
            });
            monthData.sort((a, b)=>{
                return b.monthScore - a.monthScore;
            });

            let tempRanks = {1:[], 2:[], 3:[]};
            let len = dayData.length;
            for(let i = 0; i < len; i++) {
                let one = dayData[i];
                if(one.dayScore > 0) {
                    tempRanks[1].push(one);
                }
            }
            len = weekData.length;
            for(let i = 0; i < len; i++) {
                let one = weekData[i];
                if(one.weekScore > 0) {
                    tempRanks[2].push(one);
                }
            }
            len = monthData.length;
            for(let i = 0; i < len; i++) {
                let one = monthData[i];
                if(one.monthScore > 0) {
                    tempRanks[3].push(one);
                }
            }
            this.ranks = tempRanks;
        })
    }


    reqRanks(player, data){
        let uid = player.uid;
        let list = [];
        let type = data.type;
        if(!type)type = 1;
        let len = Math.min(this.ranks[type].length, this.maxRankNum);
        let self = {rank:0, score: 0, name:player.user.info.name, headPic:player.user.info.headPic};
        let ranks = this.ranks[type];
        for(let idx = 0; idx < len; idx++){
            let one = clone(ranks[idx]);
            this.conScore(one, type);
            if(one.uid === uid){
                self.rank = +idx + 1;
                self.score = one.score;
            }
            one.index = +idx + 1;
            list.push(one);
        }
        return {ranks:list, self:self, type:type,status:this.status[type], time:this.getSecond(type), describe:this.getDescribe(type)};
    }


    conScore(one, type){
        let dayScore = one.dayScore , weekScore = one.weekScore, monthScore = one.monthScore;
        delete one.dayScore; delete one.weekScore; delete one.monthScore;
        if(type === 1){
            one.score = dayScore;
        }
        switch (type){
            case 1:
                one.score = dayScore;
                break;
            case 2:
                one.score = weekScore;
                break;
            case 3:
                one.score = monthScore;
                break;
            default:
                one.score = 0;
        }
    }

    /**
     * 获取到结束时间的秒数
     * @param type
     * @returns {number}
     */
    getSecond(type){
        let second = 0;
        let now = Date.getStamp();
        if(this.status[type] === this.statusCfg.rest){
            let temp = CommFuc.getTodayDataByTime("12:00:00");
            second = Math.abs(temp - now);
        }else if(this.status[type] === this.statusCfg.playing){
            if(type === 1) {
                let temp = CommFuc.getTodayDataByTime("11:55:00");
                if (now > temp) {
                    second = temp + 24 * 3600 - now;
                } else {
                    second = temp - now;
                }
            }else if(type === 2){
                let temp = CommFuc.getWeekDayTime(7, "11:55:00");
                if(now > temp){
                    second = CommFuc.getWeekDayTime(7, "11:55:00", true) - now;
                }else{
                    second = temp - now;
                }
            }else if(type === 3){
                let temp = CommFuc.getCurMonthTime(1, "11:55:00");
                if(now > temp){
                    second = CommFuc.getCurMonthTime(1, "11:55:00", true) - now;
                }else{
                    second = temp - now;
                }
            }

        }
        return second;
    }

    getDescribe(type){
        let now = Date.getStamp();
        let msg = "";
        let endTime = 0;
        if(this.status[type] === this.statusCfg.rest){
            endTime = CommFuc.getTodayDataByTime("12:00:00");
            let ef = Date.formatDate(endTime);
            msg = `${ef.month}月${ef.day}日赛季即将开始`;
        }else if(this.status[type] === this.statusCfg.playing){
            if(type === 1) {
                endTime = CommFuc.getTodayDataByTime("11:55:00");
                if (now > endTime) {
                    endTime = endTime + 24 * 3600;
                }
                let ef = Date.formatDate(endTime);
                msg = `玩游戏，夺排名。${ef.month}月${ef.day}日11:55分截止，排名前${this.rewardMax[type]}名的玩家将获得奖励`;
            }else if(type === 2){
                endTime = CommFuc.getWeekDayTime(7, "11:55:00");
                if(now > endTime){
                    endTime = CommFuc.getWeekDayTime(7, "11:55:00", true);
                }
                let originDate = Date.formatDate(endTime);
                let data = {num: 0};
                CommFuc.getWeekNumberByTime(endTime, originDate.month, data);
                msg = `${originDate.year}年${originDate.month}月第${data.num}周排名榜将于${originDate.year}年${originDate.month}月${originDate.day}日11:55截止`;
            }else if(type === 3){
                let startTime = CommFuc.getCurMonthTime(1,"12:00:00");
                let data = Date.formatDate(startTime);
                let rYear = data.year;
                let rMonth = data.month;
                if(now < startTime){
                    rMonth -= 1;
                    if(rMonth <= 0){
                        rMonth = 12;
                        rYear -= 1;
                    }
                }
                let isNext = true;
                let minTime = CommFuc.getCurMonthTime(1,"00:00:00");
                let maxTime = CommFuc.getCurMonthTime(1,"12:00:00");
                if(now >= minTime && now <= maxTime){
                    isNext = false;
                }
                let endTime = CommFuc.getCurMonthTime(1,"11:55:00", isNext);
                let eDate = Date.formatDate(endTime);
                msg = `${rYear}年${rMonth}月排名榜将于${eDate.year}年${eDate.month}月${eDate.day}日11:55截止`;
            }
        }
        return msg;
    }

    bindParam(player, data) {
        let account = data.account;
        let type = data.type;
        if(type === 1){
            if (account === "")return CSProto.ProtoState.STATE_FAILED;
            player.setNetAccount(account);
        }else if(type === 2){
            if (account === "")return CSProto.ProtoState.STATE_FAILED;
            player.setTvAccount(account);
        }else if(type === 3){
            let tell = data.tell.toString();
            let address = data.address.toString();
            let name = data.name.toString();
            if (tell === "" || address === "" || name === "")return CSProto.ProtoState.STATE_FAILED;
            player.setAddress(tell, address, name);
        }else if(type === 4){
            let phone = data.phone.toString();
            let wx = data.wx.toString();
            if(phone.length  != 11){
                return CSProto.ProtoState.STATE_FAILED;
            }
            if(wx !== ""){
                player.setBagWX(wx);
            }
            player.setBagPhone(phone);
        }else if(type === 5){
            if(account  === "") return CSProto.ProtoState.STATE_FAILED;
            player.setBagNet(account);
        }else if(type === 6){
            if(account  === "")return CSProto.ProtoState.STATE_FAILED;
            player.setBagTV(account);
        }
        return CSProto.ProtoState.STATE_OK;
    }

    /**
     * 给玩家卡片
     * @param type
     * @param player
     */
    giveCard(type, player, shareName=""){
        if(type === CSProto.GIVECARD.subPub){
            let gData = GlobalInfo.globalData;
            let unionId = player.user.info.unionId;
            if(unionId === "")return;
            let info = gData.subPubUnionId[unionId];
            if(!info)return;
            if(info.status !== 0)return;
            this.getNotUsedCard(type, 3, 1, player);
            info.status = 1;
            info.uid = player.uid;
        }else if(type === CSProto.GIVECARD.realName){
            this.getNotUsedCard(type, 3, 3, player);
        }else if(type === CSProto.GIVECARD.invite){
            this.getNotUsedCard(type, 3, 1, player,shareName);
        }
        player.save();
    }

    getNotUsedCard(giveType, cardType, num, player,shareName){
        let cards = [];
        for(let card in this.card_list){
            let info = this.card_list[card];
            if(!info){
                ERROR("card: " + card);
            }
            if(info && info.sendCard === 0 && info.type === cardType && info.status === 0){
                cards.push(card);
                num--;
                if(num <= 0)break;
            }
        }
        let len = cards.length;
        if(len > 0){
            for(let idx = 0; idx < len; idx++){
                let card = cards[idx];
                (function (card) {
                    this.updateSql("send_out", 1, card);
                    let content = this.getSendCardWord(giveType,shareName);
                    let goods = [{id:12, num:1, param: {card}}];        // 这里num 必须固定是1张 因为卡号是唯一的
                    player.addMail("电子参赛卡获得通知",content,2, goods);
                }.bind(this))(card);
            }
        }
    }

    getSendCardWord(giveType, shareName){
        let msg = "";
        if(giveType === CSProto.GIVECARD.subPub){
            msg = `您关注了「紫琼麻将」微信公众号,系统奖励您电子参赛卡一张`;
        }else if(giveType === CSProto.GIVECARD.realName){
            msg = `您的实名认证成功,系统奖励您电子参赛卡一张`;
        }else if(giveType === CSProto.GIVECARD.invite){
            msg = `玩家「${shareName}」填写了您分享的邀请码,系统奖励您电子参赛卡一张`;
        }
        return msg;
    }


    nameAuth(player, data={}){
        if(!data.identity || !data.name || data.identity === "" || data.name === ""){
            return CSProto.ProtoID.CLIENT_MIDDLE_NAME_AUTH;
        }
        let info = player.user.info;
        if(info.realName === "" && info.identity === ""){
            this.giveCard(CSProto.GIVECARD.realName, player);
        }
        player.setNameAndId(data);
    }

    genInvite(player){
        let invitation  = player.uid.toString();
        player.setInvitation(invitation);
        return invitation;
    }

    checkInvite(player, data={}, cb){
        let invitation = data.invitation;
        if(player.user.fillInvitation !== ""){
            cb(CSProto.ProtoState.STATE_INVITE_READY_INVITE);
            return;
        }
        if(invitation == player.user.invitation){
            cb(CSProto.ProtoState.STATE_INVITE_INVITE_ERROR);
            return;
        }
        let find = false;
        PlayerMgr.saveAll(function () {
            MongoUser.find({}).toArray((err, result) => {
                if(!result){
                    cb && cb(CSProto.ProtoState.STATE_FAILED);
                    return;
                }
                result.forEach((data)=>{
                    if(data.invitation === invitation){
                        cb && cb(CSProto.ProtoState.STATE_OK, data._id);
                        find = true;
                    }
                });
                if(!find)cb && cb(CSProto.ProtoState.STATE_INVITE_INVITE_ERROR);
            });
        });
    }

    getExplain(){
        let msgs = {};
        msgs[2] = `${this.getBoMsg(2)}${this.getMatchWord(2)}冠军将获得19寸液晶电视1台`;
        msgs[3] = `${this.getBoMsg(3)}${this.getMatchWord(3)}冠军将获得22寸液晶电视1台`;
        return msgs;
    }

    updateMatchCard(player){
        let bagItems = player.user.bag.items;
        let newCard = 0;
        for(let pos  = 1; pos <= Config.maxBagCount; pos++){
            let item = bagItems[pos];
            if(item){
                if(item.id === 12){
                    let cards = item.cards;
                    if(item.num > 0 && item.cards.length > 0) {
                        let card = cards[0];
                        let ret = this.checkCard(card, player);
                        if (ret === CSProto.ProtoState.STATE_MATCH_NO_EXIST || ret === CSProto.ProtoState.STATE_MATCH_READY_USE) {
                            item.num -= 1;
                            cards.splice(0, 1);
                            if(cards[0]){
                                newCard = cards[0];
                            }else{
                                newCard = -1;
                            }
                            let GameLogic = require("./Game.js");
                            let conn = player.getConn();
                            GameLogic.useGoodAfterCommon(conn, item, player, pos);
                        }
                    }
                }
            }
        }
        return newCard;
    }
}

module.exports = new Match();
