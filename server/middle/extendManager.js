///////////////////////////////////////////////////////////////////////////////
//>> 推广员管理模块
let util        = require("util");
let CSProto     = require("../net/CSProto.js");
let ProtoState  = require("../net/CSProto.js").ProtoState;
let ProtoID     = require("../net/CSProto.js").ProtoID;
let moment      = require("moment");
let async       = require('async');
let CommFuc     = require("../util/CommonFuc.js");
let PFCMgr      = require("../util/PFC.js");

function ExtendManager() {
    this.user_list = {};                 // 玩家列表
    this.profitInfo = {};                // 每个获取到的详细信息<写入内存 避免每次获取都从数据库读取>
    this.oneDayRed = {};                 // 每日分红的玩家uid
    this.oneDayUseProfit = 0;            // 每日公司已经分掉的节点收益
    this.weekRed = {};                   // 每周分红的玩家uid
    this.weekUsePorfit = 0;              // 每周公司已经分掉的节点收益
}

ExtendManager.prototype = {
    /**
     * 读取数据库内容
     * @param callback
     */
    loadData:function (callback) {
        async.series([
            function(cb){
                let sql = util.format("SELECT * FROM %s", 'profit_log');
                SQL.query(sql,function (err, results) {
                    if(err){
                        ERROR("查询推广数据失败 " + err.message);
                        cb(err);
                    }else{
                        let res = JSON.parse(JSON.stringify(results));
                        if(res.length != 0){
                            for(let idx in res){
                                let uid = res[idx].uid;
                                let time = res[idx].time;
                                if(!this.profitInfo[time]){
                                    this.profitInfo[time] = {};
                                }
                                if(!this.profitInfo[time][uid]){
                                    this.profitInfo[time][uid] = {};
                                }
                                let genUid = res[idx].gen_uid;
                                if(!this.profitInfo[time][uid][genUid]){
                                    this.profitInfo[time][uid][genUid] = {};
                                }
                                this.profitInfo[time][uid][genUid].uid = uid;
                                this.profitInfo[time][uid][genUid].wx_name = res[idx].wx_name;
                                this.profitInfo[time][uid][genUid].gen_uid = res[idx].gen_uid;
                                this.profitInfo[time][uid][genUid].gen_lv = res[idx].gen_lv;
                                this.profitInfo[time][uid][genUid].time = time;
                                this.profitInfo[time][uid][genUid].profit = res[idx].profit;
                            }
                        }
                        cb();
                    }
                }.bind(this));
            }.bind(this),
            function(cb) {
                let sql = util.format("SELECT * FROM %s", 'user_list');
                SQL.query(sql, function (err, results) {
                    if (err) {
                        ERROR("查询推广员数据失败 " + err.message);
                        cb(err);
                    } else {
                        let res = JSON.parse(JSON.stringify(results));
                        if (res.length != 0) {
                            for (let idx in res) {
                                let uid = res[idx].uid;
                                this.user_list[uid] = {};
                                this.user_list[uid].uid = uid;
                                this.user_list[uid].pre_uid = res[idx].pre_uid;
                                this.user_list[uid].next_uids = JSON.parse(res[idx].next_uids);
                                this.user_list[uid].profit = res[idx].profit;
                                this.user_list[uid].pre_profit = res[idx].pre_profit;
                                this.user_list[uid].pre_pre_profit = res[idx].pre_pre_profit;
                                this.user_list[uid].oneday_profit = res[idx].oneday_profit;
                                this.user_list[uid].week_profit = res[idx].week_profit;
                                this.user_list[uid].all_profit = res[idx].all_profit;
                                this.user_list[uid].node_profit = res[idx].node_profit;
                                this.user_list[uid].plusplus = res[idx].plusplus;
                                this.user_list[uid].today_withdraw = res[idx].today_withdraw;


                                this.user_list[uid].head_pic = res[idx].head_pic;
                                this.user_list[uid].wx_name = res[idx].wx_name;

                                this.user_list[uid].history_profit = res[idx].history_profit;
                                this.user_list[uid].history_pre_profit = res[idx].history_pre_profit;
                                this.user_list[uid].history_pre_pre_profit = res[idx].history_pre_pre_profit;
                                this.user_list[uid].history_node_profit = res[idx].history_node_profit;
                            }
                            cb(null);
                        }
                    }
                }.bind(this));
            }.bind(this)
        ],function (err,res) {
            if(err) {
                callback(err);
                return;
            }else{
                callback(null);
            }
        }.bind(this));
    },
    /**
     * 获取玩家数据
     */
    getUserList:function () {
        let data = {};
        for(let uid in this.user_list) {
            data[uid] = {};
            data[uid].pre_uid = this.user_list[uid].pre_uid;
            data[uid].wx_name = this.user_list[uid].wx_name;
            data[uid].uid = +uid;
        }
        return data;
    },
    /**
     * 检测玩家数据
     * @param player
     */
    checkUserData:function(player,callback) {
        let sql = "";
        let uid = player.uid;
        if(!this.user_list[uid]){
            sql = `INSERT INTO user_list(uid, pre_uid, next_uids, profit, pre_profit, pre_pre_profit,oneday_profit,week_profit,all_profit,node_profit,head_pic,wx_name,
                room_cards,diamonds,beans,band_beans,regisder_time,regisder_ip,last_login_ip,last_login_time,cur_fixing,is_control,last_login_city,last_login_region,pfc_address,
                history_profit,history_pre_profit,history_pre_pre_profit,history_node_profit,plusplus,today_withdraw) values (
                ${uid},
                ${player.user.extend_info.pre_extend_uid},
                ${SQL.escape("[]")},
                0.00,
                0.00,
                0.00,
                0.00,
                0.00,
                0.00,
                0.00,
                ${SQL.escape(player.user.info.headPic)},
                ${SQL.escape(player.user.info.name)},
                ${player.user.status.card},
                ${player.user.status.diamond},
                ${gSeer.getPlayerBean(player)},
                ${player.user.storageBox.bean},
                ${SQL.escape((new Date(player.user.info.createTime * 1000)).stdFormatedString())},
                ${SQL.escape(player.user.info.createIP)},
                ${SQL.escape(player.user.marks.loginIP)},
                ${SQL.escape(Date.stdFormatedString())},
                ${SQL.escape("")},
                0,
                ${SQL.escape("")},
                ${SQL.escape("")},
                ${SQL.escape("")},
                0.00,
                0.00,
                0.00,
                0.00,
                0.00,
                0.00
            )`;
            SQL.query(sql,function (err,results){
                if(err){
                    ERROR("sql: " + sql);
                    callback(err);
                }else{
                    this.user_list[uid] = {};
                    this.user_list[uid] = {
                        uid : uid,
                        pre_uid : player.user.extend_info.pre_extend_uid,
                        next_uids : [],
                        profit : 0.00,
                        pre_profit : 0.00,
                        pre_pre_profit : 0.00,
                        oneday_profit:0.00,
                        week_profit:0.00,
                        all_profit:0.00,
                        node_profit:0.00,
                        head_pic : player.user.info.headPic,
                        wx_name : player.user.info.name,
                        history_profit : 0.00,
                        history_pre_profit : 0.00,
                        history_pre_pre_profit : 0.00,
                        history_node_profit : 0.00,
                        plusplus:0.00,
                        today_withdraw:0.00
                    };
                    GSMgr.broadcastMsg(ProtoID.MIDDLE_GAME_UPDATE_USER_LIST,{data:{
                        pre_uid : this.user_list[uid].pre_uid,
                        wx_name : this.user_list[uid].wx_name,
                        uid : uid
                    }});
                    callback(null);
                }
            }.bind(this));
        }else{
            callback(null);
        }
    },
    /**
     * 获取推广员数据
     * @param uid
     */
    getExtendData:function (uid) {
        let data = {};
        let today = Date.stdFormatedByIV(0);
        let Front1 = Date.stdFormatedByIV(-1);
        data.today = this.getRecordByTime(uid, today);
        data.todayFront1 = this.getRecordByTime(uid, Front1);
        data.allExtendP = this.getAllExtendP(uid);
        data.lsTReward = this.getLSAllProfit(uid);
        data.lsZReward = this.getLSNodeProfitPlayer(uid);
        data.curAgentProfit = this.getAllProfit(uid);
        return data;
    },
    /**
     * 设置下一级推广员
     * @param uid
     * @param nextUid
     */
    setNextUid:function (uid, nextUid) {
        if(uid == 0){
            return;
        }
        let user = this.user_list[uid];
        if(user){
            let pos = user.next_uids.indexOf(nextUid);
            if(pos === -1) {
                ERROR(JSON.stringify(user.next_uids));
                user.next_uids.push(nextUid);
                this.updateSql("next_uids", JSON.stringify(user.next_uids), uid);
            }
        }
    },
    /**
     * 更新
     * @param uid
     * @param callback
     */
    updateSql:function(key, value, uid) {
        let sqlValue = value;
        if(typeof(value) == "string")
            sqlValue = SQL.escape(value);
        let user = this.user_list[uid];
        if(user) {
            if(key != "next_uids") {
                user[key] = value;
            }
            let sql = `UPDATE user_list SET ${key} = ${sqlValue} WHERE uid=${uid}`;
            SQL.query(sql, function (err) {
                if (err) {
                    ERROR(`updateSql extend error sql: ${sql}`);
                }
            })
        }
    },
    /**
     * 通知游戏服
     */
    noticeGameSevChange:function(uid) {
        let user = this.user_list[uid];
        if(user) {
            let data = {};
            data[uid] = {};
            data[uid].pre_uid = user.pre_uid;
            data[uid].wx_name = user.wx_name;
            data[uid].uid = uid;
            GSMgr.broadcastMsg(ProtoID.MIDDLE_GAME_PROXY_LV_CHANGE, {data : data});
        }
    },
    /**
     * 获取某个玩家的总收益
     */
    getAllProfit:function (uid) {
        let sum = 0;
        let user = this.user_list[uid];
        if(user){
            sum = CommFuc.accAdd(sum, user.profit);
            let nextUsers = user.next_uids;
            for(let nIdx in nextUsers){
                let nUser =  this.user_list[nextUsers[nIdx]];
                if(nUser){
                    sum = CommFuc.accAdd(sum, nUser.pre_profit);
                    let nextNextUsers = nUser.next_uids;
                    for(let nnIdx in nextNextUsers){
                        let nnUser = this.user_list[nextNextUsers[nnIdx]];
                        if(nnUser){
                            sum = CommFuc.accAdd(sum, nnUser.pre_pre_profit);
                        }
                    }
                }
            }
        }
        return Math.floor(sum);
    },
    /**
     * 获取历史总收益(针对推广收益 没有节点收益)
     * @returns {number}
     */
    getLSAllProfit(uid){
        let sum = 0;
        let user = this.user_list[uid];
        if(user){
            sum = CommFuc.accAdd(sum, user.history_profit);
            let nextUsers = user.next_uids;
            for(let nIdx in nextUsers){
                let nUser =  this.user_list[nextUsers[nIdx]];
                if(nUser){
                    sum = CommFuc.accAdd(sum, nUser.history_pre_profit);
                    let nextNextUsers = nUser.next_uids;
                    for(let nnIdx in nextNextUsers){
                        let nnUser = this.user_list[nextNextUsers[nnIdx]];
                        if(nnUser){
                            sum = CommFuc.accAdd(sum, nnUser.history_pre_pre_profit);
                        }
                    }
                }
            }
        }
        return sum;
    },
    /**
     * 获取个人的节点收益()
     * @param uid
     */
    getNodeProfitPlayer(uid){
        let sum = 0;
        let user = this.user_list[uid];
        if(user){
            sum = user.node_profit;
        }
        return sum;
    },
    /**
     * 获取未提现的收益
     * @param uid
     */
    getPlusProfit(uid){
        let user = this.user_list[uid];
        if(user){
            return user.plusplus;
        }
        return 0;
    },

    /**
     * 获取个人历史节点收益()
     * @param uid
     */
    getLSNodeProfitPlayer(uid){
        let sum = 0;
        let user = this.user_list[uid];
        if(user){
            sum = user.history_node_profit;
        }
        return sum;
    },
    /**
     * 获取所有的推广玩家数量<层级2>
     * @param uid
     */
    getAllExtendP(uid){
        let num = 0;
        let user = this.user_list[uid];
        if(user){
            let len = user.next_uids.length;
            num += len;
            for(let i = 0; i < len; i++){
                let nUser = this.user_list[user.next_uids[i]];
                if(nUser) {
                    num += nUser.next_uids.length;
                }
            }
        }
        return num;
    },

    /**
     * 获取历史推广和整点的收益
     * @param uid
     */
    getLSTGprofit(uid){
        let sum = this.getLSAllProfit(uid);
        sum += this.getLSNodeProfitPlayer(uid);
        return sum;
    },
    /**
     * 获取剩余所有没有提现的收益(包括代理收益和节点收益和未提现的收益)
     * @param uid
     */
    getTGPrifit(uid){
        let sum = this.getAllProfit(uid);              // 代理收益
        sum += this.getNodeProfitPlayer(uid);          // 节点收益
        sum += this.getPlusProfit(uid);                // 获取剩余未提现的金豆
        return sum;
    },
    /**
     * 获得
     * @param uid
     * @returns {number}
     */
    getCanProfit(uid){
        let sum = this.getTGPrifit(uid);                            // 提现前推广的金豆数量
        let maxWithdraw = gSeer.todayMaxWith;
        let todayWithdraw = this.getTodayWithdraw(uid);             // 获取今日已提
        if(todayWithdraw >= maxWithdraw){
            return 0;
        }
        return Math.min(maxWithdraw - todayWithdraw, sum);   // 提币金额
    },
    /**
     * 获取整线奖励和提现奖励
     * @param uid
     * @returns {*|number}
     */
    getAgentAndLinePrifit(uid) {
        let sum = this.getAllProfit(uid);              // 代理收益
        sum += this.getNodeProfitPlayer(uid);          // 节点收益
        return sum;
    },
    /**
     * 获取手续费
     */
    getBrokerage(sum){
        let brokerage = GlobalInfo.globalData.extendCfg.brokerage;
        sum = CommFuc.accMul(sum, brokerage);
        return sum;
    },
    /**
     * 重置数据
     */
    reset(uid){
        let user = this.user_list[uid];
        if(user){
            this.updateSql("today_withdraw", 0, uid);
        }
    },
    /**
     * 更新收益数据
     * @param beans
     * @param gameType
     */
    updateProfit:function (uData, cost) {
        let cfg = GlobalInfo.globalData.rebate;
        for(let uid in uData){
            let user = this.user_list[uid];
            if(!user)continue;
            let temp = {profit:0, pre_profit:0, pre_pre_profit: 0, uid};
            let company = {uid:uid, num:0};
            if(user){
                temp.profit = +CommFuc.accMul(cost, cfg.self).toFixed(2);
                let logData = {uid:+uid, wx_name:user.wx_name, genUid:+uid, gen_wx_name: user.wx_name, profit:temp.profit, gen_lv:1}
                this.updateProfitLog(clone(logData));
                if(user.pre_uid != 0){
                    let preUser = this.user_list[user.pre_uid];
                    if(preUser) {
                        temp.pre_profit = +CommFuc.accMul(cost, cfg.pre).toFixed(2);
                        logData.uid = preUser.uid, logData.gen_lv = 2, logData.wx_name = preUser.wx_name, logData.profit = temp.pre_profit;
                        this.updateProfitLog(clone(logData));
                        if (preUser.pre_uid != 0) {
                            temp.pre_pre_profit = +CommFuc.accMul(cost, cfg.pre_pre).toFixed(2);
                            let prepreUser = this.user_list[preUser.pre_uid];
                            if(prepreUser) {
                                logData.uid = prepreUser.uid, logData.gen_lv = 3, logData.wx_name = prepreUser.wx_name, logData.profit = temp.pre_pre_profit;
                                this.updateProfitLog(clone(logData));
                            }
                        }
                    }
                }
                company.num = +CommFuc.accSub(cost, temp.profit + temp.pre_profit + temp.pre_pre_profit).toFixed(2);
                this.updateSelf_Pre_PrePre(clone(temp));
                this.updateHistoryProfit(clone(temp));
                this.updateDayWeekAll(clone(company));
                // 更新财务
                let data = clone(company);
                data.financeType = CSProto.financeType.SERVER_COST;
                this.updateFinance(data);
            }
        }
    },
    /**
     * 更新代理收益
     */
    updateSelf_Pre_PrePre(data){
        let uid = data.uid;
        let user = this.user_list[uid];
        if(user){
            this.updateSql("profit",user.profit + data.profit, uid);
            this.updateSql("pre_profit",user.pre_profit + data.pre_profit, uid);
            this.updateSql("pre_pre_profit",user.pre_pre_profit + data.pre_pre_profit, uid);
        }
    },
    /**
     * 更新历史记录
     * @param data
     */
    updateHistoryProfit(data){
        let uid = data.uid;
        let user = this.user_list[uid];
        if(user){
            this.updateSql("history_profit",user.history_profit + data.profit, uid);
            this.updateSql("history_pre_profit",user.history_pre_profit + data.pre_profit, uid);
            this.updateSql("history_pre_pre_profit",user.history_pre_pre_profit + data.pre_pre_profit, uid);
        }
    },
    /**
     * 更新每天收益 每周收益 总收益
     * @param data
     */
    updateDayWeekAll(data){
        return;                 // todo 临时屏蔽
        let uid = data.uid;
        let num = data.num;
        let user = this.user_list[uid];
        if(user){
            this.updateSql("oneday_profit",user.oneday_profit + num, uid);
            this.updateSql("week_profit",user.week_profit + num, uid);
            this.updateSql("all_profit",user.all_profit + num, uid);
        }
    },
    /**
     * 财务更新
     * @param data
     */
    updateFinance(data){
        data.uid = +data.uid;
        data.profit_time = Date.stdFormatedByIV(0);
        data.time = Date.stdFormatedString();
        data.params = data.params || "";
        if(data.financeType === CSProto.financeType.SERVER_COST){
            let sql = `SELECT * FROM company_profit WHERE finance_type = ${CSProto.financeType.SERVER_COST} AND uid = ${data.uid} AND profit_time = ${SQL.escape(data.profit_time)}`;
            SQL.query(sql, (err, results)=>{
                if(err){
                    ERROR("updateFinance error please check: " + JSON.stringify(data));
                }else{
                    if(results.length === 0){
                        this.realInsertFinance(data);
                    }else{
                        data.num += results[0].num;
                        this.realUpdateFinance(data);
                    }
                }
            });
        }else{
            this.realInsertFinance(data);
        }
    },
    /**
     * 真正的插入公司财务数据
     * @param data
     */
    realInsertFinance(data){
        let sql = `INSERT INTO company_profit (uid, num, profit_time, time, finance_type, params) VALUES
        (${data.uid}, ${data.num},${SQL.escape(data.profit_time)},${SQL.escape(data.time)}, ${data.financeType},${SQL.escape(data.params)})`;
        SQL.query(sql,(err)=>{
            if(err){
                ERROR("realInsertFinance fail " + sql);
            }
        })
    },
    /**
     * 更新公司财务数据
     * @param data
     */
    realUpdateFinance(data){
        let sql = `UPDATE company_profit SET num = ${data.num} WHERE uid = ${data.uid} AND profit_time = ${SQL.escape(data.profit_time)} AND finance_type = ${data.financeType}`;
        ERROR(sql);
        SQL.query(sql, (err)=>{
            if(err){
                ERROR("realUpdateFinance fail " + sql);
            }
        })
    },
    /**
     * 更新收益 日志
     * @param data
     */
    updateProfitLog(data){
        let tab = 'profit_log';
        data.time = Date.stdFormatedByIV(0);
        let sql = `SELECT * FROM ${tab} WHERE time = ${SQL.escape(data.time)} AND uid = ${data.uid} AND gen_uid = ${data.genUid}; `
        SQL.query(sql, function (err, results) {
            if(err){
                ERROR('updateProfitLog find error sql :' + sql);
                return;
            }
            if(results.length > 0){
                let res = results[0];
                data.profit = CommFuc.accAdd(data.profit, res.profit);
                this.updateProfitData(tab, data);
            }else{
                this.insertProfitData(tab, data);
            }
        }.bind(this));
    },
    /**
     * 更新收益日志
     * @param tab
     * @param data
     * @param timeStr
     */
    updateProfitData(tab, data){
        let sql = `UPDATE ${tab} SET profit=${data.profit} WHERE uid = ${data.uid} AND gen_uid = ${data.genUid};`;
        SQL.query(sql,function (err) {
            if(err){
                ERROR("updateProfitData 更新收益信息失败: " + sql);
            }else{
                this.profitInfo[data.time][data.uid][data.genUid].profit = data.profit;
            }
        }.bind(this));
    },
    /**
     * 保存收益数据
     * @param tab
     * @param data
     * @param timeStr
     */
    insertProfitData(tab, data) {
        let sql = `INSERT INTO ${tab}(uid, wx_name, gen_uid, gen_wx_name, gen_lv,time, profit, zero_time) values (${data.uid}, ${SQL.escape(data.wx_name)}, ${data.genUid}, ${SQL.escape(data.gen_wx_name)}, ${data.gen_lv}, ${SQL.escape(data.time)}, ${data.profit}, ${(new Date()).zeroTime().getStamp()})`;
        SQL.query(sql,function (err) {
            if(err){
                ERROR("insertProfitData 插入信息失败: " + sql);
            }else{
                let uid = data.uid;
                let time = data.time;
                if(!this.profitInfo[time]){
                    this.profitInfo[time] = {};
                }
                if(!this.profitInfo[time][uid]){
                    this.profitInfo[time][uid] = {};
                }

                let genUid = data.genUid;
                if(!this.profitInfo[time][uid][genUid]){
                    this.profitInfo[time][uid][genUid] = {};
                }
                this.profitInfo[time][uid][genUid].uid = uid;
                this.profitInfo[time][uid][genUid].wx_name = data.wx_name;
                this.profitInfo[time][uid][genUid].gen_uid = genUid;
                this.profitInfo[time][uid][genUid].gen_lv = data.gen_lv;
                this.profitInfo[time][uid][genUid].time = time;
                this.profitInfo[time][uid][genUid].profit = data.profit;
            }
        }.bind(this));
    },
    /**
     * 通过时间获取当前的数据
     */
    getRecordByTime(uid,time){
        let tab = {num:0, profit:0};
        if(!this.profitInfo[time]){
            this.profitInfo[time] = {};
        }
        if(!this.profitInfo[time][uid]){
            this.profitInfo[time][uid] = {};
        }
        tab.num = Object.keys(this.profitInfo[time][uid]).length;
        if(this.profitInfo[time][uid][uid] && this.profitInfo[time][uid][uid].profit > 0){
            tab.num = Math.max(tab.num - 1, 0);
        }
        let sum = 0;
        for(let genUid in this.profitInfo[time][uid]){
            sum += this.profitInfo[time][uid][genUid].profit;
        }
        tab.profit = Math.floor(sum);
        return tab;
    },

    getNodeCfgAndIndex(uid){
        let user = this.user_list[uid];
        let nodeCfg = GlobalInfo.globalData.extendCfg.nodeCfg;
        if(user) {
            let nNum = this.getNodeNumber(uid);
            for (let idx = nodeCfg.length - 1; idx >= 0; idx--) {
                if (nNum >= nodeCfg[idx].numP) {
                    return {cfg:nodeCfg[idx], idx};
                }
            }
        }
        return null;
    },
    /**
     * 仅仅使用人数判断达到了哪个段位
     * @param uid
     * @returns {*}
     */
    getProxyLvByNum(uid){
        let data = this.getNodeCfgAndIndex(uid);
        if(data && data.cfg){
            return +data.idx + 1;
        }else{
            return 0;
        }
    },
    /**
     * 获取达到了哪个段位
     * @param uid
     * @returns {*}
     */
    getProxyLv(uid, type){
        let data = this.getNodeCfgAndIndex(uid);
        if(data && data.cfg){
            let sum = this.getNodeProfit(uid, type);
            if(sum >= data.cfg.needProfit){
                return +data.idx + 1;
            }
        }else{
            return 0;
        }
    },
    /**
     * 获取整个推广的消息
     * @param player
     * @param data
     */
    allMsg(player){
        let data = {};
        let lineMsg = this.getIntactLine(player);
        data.curOneDayNodeSum = lineMsg.curOneDayNodeSum;
        data.nodeInfo = lineMsg.nodeInfo;
        data.curLevel = lineMsg.curLevel;
        let extData = this.getExtendData(player.uid);
        data.today = extData.today;
        data.todayFront1 = extData.todayFront1;
        data.allExtendP = extData.allExtendP;
        data.lsTReward = extData.lsTReward;
        data.lsZReward = extData.lsZReward;
        data.curAgentProfit = Math.floor(extData.curAgentProfit);
        data.plus = Math.floor(this.getPlusProfit(player.uid));
        return data;
    },
    /**
     * 判断是否能设置总代
     * @param uid
     */
    isCanSetGM(uid){
        let user = this.user_list[uid];
        if(user){
            if(user.pre_uid != 0){
                return false;
            }else{
                return true;
            }
        }
        return false;
    },
    /**
     * 获取整线数据
     * @param player
     * @param data
     */
    getIntactLine(player){
        let curOneDayNodeSum = this.getNodeProfitPlayer(player.uid);
        let nodeInfo = [];
        let nodeCfg = GlobalInfo.globalData.extendCfg.nodeCfg;
        for(let i = 0; i < nodeCfg.length; i++){
            nodeInfo[i] = {};
            nodeInfo[i].name = nodeCfg[i].name;
            nodeInfo[i].needNum = nodeCfg[i].numP;
            nodeInfo[i].needProfit = nodeCfg[i].needProfit;
        }
        let curLevel = this.getProxyLvByNum(player.uid);
        return {curOneDayNodeSum, nodeInfo, curLevel}
    },
    /**
     * 判断是否能够绑定
     */
    isCanBind(user, superUid){
        if(user.next_uids.indexOf(superUid) >= 0){
            return false;
        }
        for(let idx in user.next_uids){
            let nUid = user.next_uids[idx];
            let nUser = this.user_list[nUid];
            if(nUser){
                return this.isCanBind(nUser,superUid);
            }
        }
        return true;
    },
    /**
     * 检测绑定
     * @param uid
     * @param superUid
     */
    checkBind(player, superUid){
        let uid = player.uid;
        let user = this.user_list[uid];
        let superUser = this.user_list[superUid];
        if(user && superUser) {
            if(player.user.extend_info.isGM){
                return ProtoState.STATE_PLAYER_IS_GM;
            }
            if (user.pre_uid !== 0) {
                return ProtoState.STATE_EXTEND_READY_BIND;
            }
            if(superUid == uid){
                return ProtoState.STATE_EXTEND_BIND_SELF;
            }
            if(!this.isCanBind(user,superUid)){
                return ProtoState.STATE_EXTEND_BIND_NEXT;
            }
            return ProtoState.STATE_OK;
        }else{
            return ProtoState.STATE_PLAYER_NO_EXIST;
        }
    },
    /**
     * 绑定上级代理
     */
    bindPreAgent(player, data){
        let superUid = +data.superUid;
        let uid = player.uid;
        let ret = this.checkBind(player, superUid);
        if(ret === ProtoState.STATE_OK){
            this.updateSql("pre_uid", superUid, uid);
            this.setNextUid(superUid, uid);
            this.noticeGameSevChange(uid);
            player.user.extend_info.pre_extend_uid = superUid;
            setTimeout(function(){
                player.boonTodayTip();
            }, 1000);
        }else{
            ERROR("bind fail---------- ret : " + ret);
        }
        return ret;
    },
    /**
     * 获取自己的贡献
     * @param uid
     */
    getSelfDevote(uid, type){
        let user = this.user_list[uid];
        if(user){
            if(type === 1){
                return user.oneday_profit;
            }else if(type === 2){
                return user.week_profit;
            }
        }
        return 0;
    },
    /**
     * 获取节点人数
     * @param uid
     */
    getNodeNumber(uid){
        let data = {sum:0};
        this.realGetNodeNumber(uid, data);
        return data.sum;
    },
    /**
     * 递归获取节点的人数
     * @param uid
     * @param data
     */
    realGetNodeNumber(uid, data){
        let user = this.user_list[uid];
        if(user){
            data.sum += user.next_uids.length;
            for(let idx in user.next_uids){
                let nUid = user.next_uids[idx];
                this.realGetNodeNumber(nUid, data);
            }
        }
    },
    /**
     *  是否出现上帝循环
     */
    isSnake(uid, tab){
        uid = +uid;
        if(tab.indexOf(uid) >= 0){
            return true;
        }
        tab.push(uid);
        let user = this.user_list[uid];
        if(user){
            for(let idx in user.next_uids){
                let nUid = user.next_uids[idx];
                return this.isSnake(nUid, tab);
            }
        }
        return false;
    },
    /**
     * 获取节点收益
     * @param uid
     * @param type
     * @returns {number}
     */
    getNodeProfit(uid, type){
        let data = {sum:0};
        this.realGetNodeProfit(uid, type, data);
        return data.sum;
    },
    /**
     * 通过类型获取节点收益
     * @param uid
     * @param type
     */
    realGetNodeProfit(uid, type, data){
        let user = this.user_list[uid];
        if(user){
            let value = 0;
            if(type === 1){
                value = user.oneday_profit;
            }else if(type === 2){
                value = user.week_profit;
            }
            data.sum  = CommFuc.accAdd(data.sum, value);
            let nArray = user.next_uids;
            for(let nidx in nArray){
                this.realGetNodeProfit(nArray[nidx], type, data);
            }
        }
    },
    /**
     * 获取节点配置
     * @param uid
     */
    getNodeCfg(uid){
        let user = this.user_list[uid];
        let nodeCfg = GlobalInfo.globalData.extendCfg.nodeCfg;
        if(user) {
            let nNum = this.getNodeNumber(uid);
            for (let idx = nodeCfg.length - 1; idx >= 0; idx--) {
                if (nNum >= nodeCfg[idx].numP) {
                    return nodeCfg[idx];
                }
            }
        }
        return null;
    },
    /**
     * 获取今日已提的金额
     * @param uid
     */
    getTodayWithdraw(uid){
        let user = this.user_list[uid];
        if(user){
            return user.today_withdraw;
        }
    },
    /**
     * 给玩家节点奖励
     * @param uid
     */
    giveNodeProfit(uid, type){
        let user = this.user_list[uid];
        if(user){
            let cfg = this.getNodeCfg(uid);
            if(cfg){
                let sum = this.getNodeProfit(uid, type);
                if(sum >= cfg.needProfit){
                    let realProfit = 0;
                    if(cfg.redType === 1) {                // 节点分红
                        for (let nIdx in user.next_uids) {
                            let prop = cfg.maxProp;
                            let nUid = user.next_uids[nIdx];
                            let nCfg = this.getNodeCfg(+nUid);
                            let nSum = this.getNodeProfit(+nUid, type);
                            if (nCfg) {
                                if (nSum >= nCfg.needProfit) {
                                    prop = Math.max(CommFuc.accSub(prop, nCfg.maxProp), 0);
                                }
                            }
                            if (prop > 0) {
                                realProfit += CommFuc.accMul(nSum, prop);
                            }
                        }
                        let sSum = this.getSelfDevote(uid, type);
                        realProfit += +CommFuc.accMul(sSum, cfg.maxProp).toFixed(2);
                        this.recordNodeProfit(type, realProfit);
                        this.updateNodePropAndHistoryNodeProfitAndFinace(realProfit, uid);
                    }else{
                        let maxProp = cfg.maxProp;
                        if(type === 1){
                            if(!this.oneDayRed[maxProp]) {
                                this.oneDayRed[maxProp] = [];
                            }
                            this.oneDayRed[maxProp].push(uid);
                        }else{
                            if(!this.weekRed[maxProp]) {
                                this.weekRed[maxProp] = [];
                            }
                            this.weekRed[maxProp].push(uid);
                        }
                    }
                }
            }
        }
    },
    /**
     * 公司分红
     */
    companyRed(type){
        let sum = this.getCompanyProfit(type);
        if(type === 1){
            for(let prop in this.oneDayRed){
                prop = +prop;
                let oneSum = CommFuc.accMul(sum, prop);     // 哪个段位公司分红
                let pNum = this.oneDayRed[prop].length;     // 这个段位有多少人
                let finaSum = CommFuc.accDiv(oneSum, pNum); // 相除取得平均值
                if(finaSum > 0) {
                    for (let idx in this.oneDayRed[prop]) {
                        let uid = this.oneDayRed[prop][idx];
                        this.updateNodePropAndHistoryNodeProfitAndFinace(finaSum, uid);
                    }
                }
            }
        }else if(type === 2){           // 周分红 预留接口
            for(let prop in this.weekRed){
                prop = +prop;
                let oneSum = CommFuc.accMul(sum, prop);     // 哪个段位公司分红
                let pNum = this.weekRed[prop].length;       // 这个段位有多少人
                let finaSum = CommFuc.accDiv(oneSum, pNum); // 相除取得平均值
                for(let idx in this.weekRed[prop]){
                    let uid = this.weekRed[prop][idx];
                    this.updateNodePropAndHistoryNodeProfitAndFinace(finaSum, uid);
                }
            }
        }
    },
    /**
     * 更新节点收益，历史节点收益，公司财务
     */
    updateNodePropAndHistoryNodeProfitAndFinace(realProfit, uid){
        let user = this.user_list[uid];
        if(user) {
            let finaProfit = CommFuc.accAdd(user.node_profit, realProfit);
            finaProfit = +finaProfit.toFixed(2);
            this.updateSql("node_profit", finaProfit, uid);

            let historyNodeProfit = CommFuc.accAdd(user.history_node_profit, realProfit);
            historyNodeProfit = +historyNodeProfit.toFixed(2);
            this.updateSql("history_node_profit", historyNodeProfit, uid);

            this.updateFinance({uid, num: -realProfit, financeType: CSProto.financeType.NODE_REWARD});
        }
    },
    /**
     * 记录每日、或者每周已经分掉的红利
     * @param type
     * @param value
     */
    recordNodeProfit(type, value){
        if(type === 1){
            this.oneDayUseProfit += value;
        }else if(type === 2){
            this.weekUsePorfit += value;
        }
    },
    /**
     * 获取公司总盈利
     * @param type 1:当日 2:这个星期
     */
    getCompanyProfit(type){
        let sum = 0;
        for(let uid in this.user_list){
            let user = this.user_list[uid];
            let value = 0;
            if(user){
                if(type === 1){
                    value += user.oneday_profit;
                }else if(type === 2){
                    value += user.week_profit;
                }
            }
            sum += value;
        }
        // 要减掉已经被节点分去的红利
        if(type === 1){
            sum = CommFuc.accSub(sum, this.oneDayUseProfit);
        }else if(type === 2){
            sum = CommFuc.accSub(sum, this.weekUsePorfit);
        }
        return sum;
    },
    /**
     * 重置每日
     * @param type
     */
    resetUseProfit(type){
        if(type === 1){
            this.oneDayUseProfit = 0;
        }else if(type === 2){
            this.weekUsePorfit = 0;
        }
    },
    /**
     * 所有玩家充值今日提现
     */
    resetAllPlayer(){
        for(let uid in this.user_list){
            (function (uid) {
                this.reset(uid);
            }.bind(this))(+uid)
        }
    },
    /**
     * 每天更新
     */
    oneDayUpdate(){
        this.resetAllPlayer();
        if(this.judgeSnake()){
            return;
        }
        for(let uid in this.user_list){
            (function (uid) {
                this.giveNodeProfit(uid, 1);
            }.bind(this)(+uid));
        }

        // 延迟10秒每日清理数据
        setTimeout(function () {
            this.companyRed(1);
            for(let uid in this.user_list){
                this.updateSql("oneday_profit",0, uid);
            }
            this.resetUseProfit(1);
        }.bind(this), 10 * 1000);
    },
    /**
     * 全局判断数据是否出现了上帝循环
     */
    judgeSnake(){
        let find = false;
        for(let uid in this.user_list){
            if(this.isSnake(uid, [])){
                ERROR("出现了上帝循环，不能继续更新数据 uid:" + uid);
                find = true;
            }
        }
        return find;
    },
    /**
     * 每周更新
     */
    weekUpdate(){
        if(this.judgeSnake()){
            return;
        }

        for(let uid in this.user_list){
            (function (uid) {
                // this.giveNodeProfit(uid,2);                      // 每周更新奖励 暂时所有的奖励都是日结
            }(+uid));
        }
        // 延迟10秒每星期数据
        setTimeout(function () {
            // this.companyRed(2);                                  // 暂时没有周分红
            for(let uid in this.user_list){
                this.updateSql("week_profit",0, uid);
            }
            this.resetUseProfit(2);
        }.bind(this), 10000);
    },
    /**
     * 提现
     * @param data
     * @param player
     */
    withdraw(num, player){
        let uid = player.uid;
        let agrenAndLineProfit = this.getAgentAndLinePrifit(uid);
        let plusplus = this.getPlusProfit(uid);
        let sum = agrenAndLineProfit - num;
        if(sum > 0){       // 够提,从剩余的加上
            this.updateSql("plusplus", Math.max(plusplus + sum, 0), uid);
        }else{             // 不够提
            this.updateSql("plusplus", Math.max(plusplus - Math.abs(sum), 0), uid);
        }
        this.clearAgentProfit(uid);
        this.clearNodeProfit(uid);
        let todayWithdraw = this.getTodayWithdraw(uid) + num;
        this.updateSql("today_withdraw", todayWithdraw, uid);
    },
    /**
     * 清理代理收益
     */
    clearAgentProfit(uid){
        let user = this.user_list[uid];
        if(user){
            this.updateSql("profit",0,uid);
            let ns = user.next_uids;
            for(let idx in ns){
                let nUser = this.user_list[ns[idx]];
                if(nUser){
                    (function () {
                        this.updateSql("pre_profit",0,nUser.uid);
                        for(let i in nUser.next_uids){
                            let nnUid = nUser.next_uids[i];
                            (function (nnUid) {
                                this.updateSql("pre_pre_profit",0,nnUid);
                            }.bind(this))(nnUid);
                        }
                    }.bind(this))(nUser);
                }
            }
        }
    },
    /**
     * 清理节点收益
     * @param uid
     */
    clearNodeProfit(uid){
        let user = this.user_list[uid];
        if(user){
            this.updateSql("node_profit",0,uid);
        }
    }
};
exports.ExtendManager = ExtendManager;
