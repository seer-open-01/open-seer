///////////////////////////////////////////////////////////////////////////////
//>> 日志相关逻辑
let util       = require("util");
let ProtoID    = require("../net/CSProto.js").ProtoID;
let ProxyLv    = require("../net/CSProto.js").proxyLv;

function Log() {
    this.user_list = {};
}

Log.prototype = {
    /**
     * user_list请求
     */
    userListReq:function () {
        GameMgr.mgrClient.sendMsg({
            code: ProtoID.GAME_MIDDLE_USER_LIST_REQ,
            args:{}
        });
    },
    /**
     * user_list应答
     * @param data
     */
    userListResp:function(data) {
        if(data) {
            this.user_list = data;
            console.log("get user_list success");
        }
    },
    /**
     * user_list更新
     */
    userListUpdate:function (data) {
        if(data) {
            this.user_list[data.uid] = data;
            console.log("update user_list success " + JSON.stringify(data));
        }
    },
    /**
     * 玩家信息改变
     * @param data
     */
    userChange:function (data) {
        for(let uid in data){
            this.user_list[uid] = data[uid];
        }
    },
    /**
     * 保存游戏结果数据
     * @param playerInfo
     * @param scoreInfo
     * @param uids
     */
    gameResult:function (roundId, curRound, matchId,playerInfo, scoreInfo, uids) {
        let sql = util.format("INSERT INTO %s(round_id, cur_round, match_id, player_info, score,end_time,uid1,uid2,uid3,uid4,uid5,uid6,uid7,uid8) values (%d, %d, %d, %s, %s, %s, %d, %d, %d, %d, %d, %d, %d, %d)",
            'round_log',
            roundId,
            curRound,
            matchId,
            SQL.escape(playerInfo),
            SQL.escape(JSON.stringify(scoreInfo)),
            SQL.escape(Date.stdFormatedString()),
            uids[1], uids[2], uids[3],uids[4],uids[5],uids[6],uids[7],uids[8]
        );
        SQL.query(sql,function (err, results) {
            if(err){
                ERROR("保存游戏结果失败:" + sql);
            }
        });
    },
    /**
     * 保存消耗信息
     * @param data
     */
    profitResult:function (data) {
        return;                         // 已改到中央服处理
        // let user = this.user_list[data.uid];
        // if(!user){
        //     return;
        // }
        // let cost = data.bean;
        // let cfg = csConfig.rebate;
        // let logData = {uid: user.uid, wx_name:user.wx_name, match_id:data.match_id, round_id:data.round_id, cur_round:data.cur_round, self_profit:0.00, pre_profit:0.00, pre_pre_profit:0.00, gen_uid:data.uid,gen_wx_name:user.wx_name, gen_lv:1};
        // logData.self_profit = cost * cfg.self;
        // this.savaProfit(logData);
        // if(user.pre_uid != 0){
        //     let preUser = this.user_list[user.pre_uid];
        //     logData.self_profit = 0.00;
        //     logData.pre_profit = cost * cfg.pre;
        //     logData.uid = preUser.uid;
        //     logData.wx_name = preUser.wx_name;
        //     logData.gen_lv = 2;
        //     this.savaProfit(logData);
        //     if(preUser.pre_uid != 0){
        //         let prePreUser = this.user_list[preUser.pre_uid];
        //         logData.pre_pre_profit = cost * cfg.pre_pre;
        //         logData.self_profit = 0.00;
        //         logData.pre_profit = 0.00;
        //         logData.uid = prePreUser.uid;
        //         logData.wx_name = prePreUser.wx_name;
        //         logData.gen_lv = 3;
        //         this.savaProfit(logData);
        //     }
        // }
    },
    /**
     * 保存收益数据
     */
    savaProfit:function(data) {
        let sql = util.format("INSERT INTO %s(uid, wx_name, match_id, round_id, cur_round, self_profit, pre_profit,pre_pre_profit,gen_uid,gen_wx_name, gen_lv,time) values (%d, %s, %d, %d, %d, %d, %d, %d, %d, %s,%d, %s)",
            'profit_log',
            data.uid,
            SQL.escape(data.wx_name),
            data.match_id,
            data.round_id,
            data.cur_round,
            data.self_profit,
            data.pre_profit,
            data.pre_pre_profit,
            data.gen_uid,
            SQL.escape(data.gen_wx_name),
            data.gen_lv,
            SQL.escape(Date.stdFormatedString())
        );
        SQL.query(sql,function (err) {
            if(err){
                ERROR("保存收益信息失败: " + sql);
            }
        });
    }
};

exports = module.exports = new Log();
