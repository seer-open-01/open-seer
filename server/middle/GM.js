let http            = require('http');
let util            = require("util");
let CSProto         = require("../net/CSProto.js");
let eveIdType       = require("../net/CSProto.js").eveIdType;
let CommFuc         = require("../util/CommonFuc.js");
let ProtoID         = require("../net/CSProto.js").ProtoID;
let ProtoState      = require("../net/CSProto.js").ProtoState;
let Http            = require("../HttpRequest.js");
let BSProto         = require("../net/BSProto.js");
let crypto          = require('crypto');
let TaskLoader      = require("../util/Task.js").TaskLoader;
let useGood         = require("./useGood.js");
let PFCMgr          = require("../util/PFC.js");
///////////////////////////////////////////////////////////////////////////////
//>> GM模块
/**
 * 是否有玩家
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.hasUser = function (query, httpReq, httpRes) {
    let uid = query.uid;
    PlayerMgr.getRegisterPlayerData(uid, function (user) {
        if(user){
            endReq({ok: 0}, httpRes);
        }else{
            endReq({ok: 1}, httpRes);
        }
    })
};


/**
 * 删除玩家账号
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.delPlayer = function(query, httpReq, httpRes) {
    let uid = +query.uid;
    // PlayerMgr.delPlat(uid);
    PlayerMgr.delUser(uid, function (player) {
        if (player) {
            let user = player.user;
            endReq({
                name: user.info.name,
                uid: uid,
                ok: true,

            }, httpRes);
            delete PlayerMgr.players[uid];
        } else {
            endReq({
                ok: false,
            }, httpRes);
        }
    });
};

/**
 * 查询玩家房卡
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.queryCard = function(query, httpReq, httpRes) {
    let uid = +query.uid;
    PlayerMgr.getPlayerNoCreate(uid, function(player){
        if (player) {
            endReq({
                card   : player.user.status.card
            }, httpRes);
        } else {
            endReq({
                ok      : false
            }, httpRes);
        }
    });
};
/**
 * 更新通知公告
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.updateNotice = function (query, httpReq, httpRes) {
    endReq({ok: 0},httpRes);
    //重新加载mysql notice_config
    SqlLoader.loadTable("notice_config", "id", () => {
        let config = SqlLoader.getTable("notice_config");
        let data = [];
        for (let id in config){
            let info = config[+id];
            if(info.status === 1){
                continue;
            }
            let notice = {};
            notice.content = info.content;
            notice.order = info.playback_sequence;
            notice.interval = info.playback_interval;
            notice.count = info.playback_count;
            notice.startTime = CommFuc.getSecondsByTimeString(info.start_time);
            notice.endTime = CommFuc.getSecondsByTimeString(info.end_time);
            data.push(notice)
        }

        //排序
        data.sort((a, b) => {
            return a.order - b.order;
        });
        GlobalInfo.notice = data;
        //广播改变后的notice
        PlayerMgr.broadcastToAll({
            code: ProtoID.MIDDLE_CLIENT_NOTICE_UPDATE,
            args:{
                type: 1,
                data: data,
            }
        });
    });

};

/**
 * 发送插播通知公告
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.sendInsertNotice = function (query, httpReq, httpRes) {
    endReq({ok: 0},httpRes);
    let data = [];
    let notice = {};
    notice.content = query.content;
    notice.order = query.playback_sequence;
    notice.interval = query.playback_interval;
    notice.count = query.playback_count;
    notice.startTime = CommFuc.getSecondsByTimeString(query.start_time);
    notice.endTime = CommFuc.getSecondsByTimeString(query.end_time);
    data.push(notice);
    PlayerMgr.broadcastToAll({
        code: ProtoID.MIDDLE_CLIENT_NOTICE_UPDATE,
        args:{
            type: 2,
            data: data,
        }
    });
};


/**
 * 解冻拉黑
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.sendBlackList = function (query, httpReq, httpRes) {
    endReq({ok: 0}, httpRes);
    let tableName = "account_closure";
    //更新表
    SqlLoader.loadTable(tableName, "uid", ()=>{
        // let uid = 0;
        let list = SqlLoader.getTable(tableName);
        for (let uid in list){
            let info = list[+uid];
            if(info["kick_line"] === 1){
                if(PlayerMgr.isOnLine(+uid)){
                    PlayerMgr.getPlayer(+uid, (player)=>{
                        if(player){
                            player.wsConn.sendMsg(ProtoID.MIDDLE_CLIENT_KICK_OFF,{});
                        }
                    })
                }
            }
        }

    });
};


/**
 * 获取在线人数
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getCurOnlineNum = function (query, httpReq, httpRes) {
    let tt = query;
    let num = Object.keys(PlayerMgr.players).length;
    endReq({ok: 0, num:num},httpRes);
};
/**
 * 微信支付回调
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.wx_pay = function (query,httpReq,httpRes) {

};

/**
 * 获取金豆数量
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getBeans = function (query, httpReq, httpRes) {
    let uid = query.uid;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player){
            endReqAddKey({code:200, msg:"success",bean:gSeer.getPlayerBean(player) + player.user.storageBox.bean}, httpRes);
        }else{
            endReqAddKey({code:400, msg:"fail"}, httpRes);
        }
    });
};
/**
 * bsc货币改变
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.bscChange = function (query, httpReq, httpRes) {
    let uid = +query.uid;
    let bscScore = +query.amount;
    let msgId = +query.msgId;
    let type = query.type;
    ERROR("bsc积分改变: " + JSON.stringify(query));
    let bscMsgIDs = GlobalInfo.globalData.bscMsgIDs;
    endReqAddKey({code:200, msg:"success", msgId : msgId}, httpRes);
    if(bscMsgIDs.indexOf(msgId) >= 0){
        ERROR("已处理过该bsc积分变化消息");
        return;
    }
    bscMsgIDs.push(msgId);
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player){
            if(bscScore > 0 && type == "charge"){
                ERROR(`充值了${bscScore / 10000}个积分: 开始充值`);
                CommFuc.bscRecharge(player);
            }
            player.updateBscScore(bscScore / 10000);
            player.save();
        }
    });
};
/**
 * 邮件测试
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.mainTest = function (query, httpReq, httpRes) {
    let type = query.type;
    let uid = query.uid;
    let addBean = 100;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player) {
            if (type == 1) {
                let title = "普通邮件";
                let content = `我是普通邮件\n我是普通邮件\n我是普通邮件`;
                player.addMail(title, content, null, [{id:1, num:100}]);
                player.save();
                endReq({msg: "normal mail add success", code: 200}, httpRes);
            } else if (type == 2) {
                let beanData = {num: addBean, eventId: eveIdType.BSC_RECHARGE};
                let preBean = gSeer.getPlayerBean(player);
                let dataStr = Date.stdFormatedString();
                let title = "【bsc充值信息】";
                let curBean = gSeer.getPlayerBean(player);
                let content = `您与${dataStr}申请的充值已经成功到账\n充值金豆:${beanData.num}\n充值前金豆:${preBean}\n充值后金豆:${curBean}`;
                player.addMail(title, content, true);
                player.save();
                endReq({msg: "bsc mail add success", code: 200}, httpRes);
            }
        }else{
            endReq({msg: "输入uid错误", code: 201}, httpRes);
        }
    });
};


//--------------------------------------------------------gm工具--------------------------------------------------------
/**
 * 手动保存玩家数据
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.save = function (query, httpReq, httpRes) {
    let loader = new TaskLoader(function () {
        endReqAddKey({code:200, msg:"保存成功"},httpRes);
    });
    loader.addLoad("empty");
    loader.addLoad("Player");
    PlayerMgr.saveAll(function () {
        LOG("Player saved");
        loader.onLoad("Player");
    });

    loader.addLoad("GlobalInfo");
    GlobalInfo.save(function () {
        LOG("GlobalInfo saved");
        loader.onLoad("GlobalInfo");
    });

    loader.onLoad("empty");
};
/**
 * 获取各个服务器状态
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getServerInfo = function (query, httpReq, httpRes) {
    let data = {"all":Object.keys(PlayerMgr.players).length};
    for(let roomId in GSMgr.roomData){
        let room = GSMgr.roomData[roomId];
        let sid = room.sid;
        if(!data.rooms){
            data.rooms = [];
        }
        data.rooms.push(roomId);
        if(!data[sid]){
            data[sid] = 0;
        }
        uids = room.players;
        for(let idx in uids){
            let uid = uids[idx];
            if(uid > 100000){
                data[sid]++;
            }
        }
    }
    endReqAddKey(data, httpRes);
};
/**
 * 增加金豆
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.gmAddBean = function (query, httpReq, httpRes) {
    return;
    let uid = +query.uid;
    let num = +query.num;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player) {
            let data = {num: num, eventId: CSProto.eveIdType.GM};
            player.updateBean(data);
            player.addMail("金豆更新", `GM更改了您的金豆数额，请您查看，金豆数额更新了: ${num}`, 0, null,{sender:"GM",senderUid: 0});
            player.save();
            endReqAddKey({code:200, msg:"success"}, httpRes);
        }else{
            endReqAddKey({code:401, msg:"uid 不存在"}, httpRes);
        }
    })
};
/**
 * 生成卡片
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.genShopCards = function(query, httpReq, httpRes){
    let goodIds = query.goodIds;
    let num = query.num;
    let batch = query.batch;
    let table = "shop_cards";
    for(let i = 0; i < goodIds.length; i++){
        for(let j = 0; j < num; j++) {
            let number = Math.floor(Math.random() * 999999999999);
            number = CommFuc.pad(number, 12);
            let sql = `INSERT INTO ${table} (number, good_id, batch, gen_time) VALUES (${SQL.escape(number)}, ${goodIds[i]}, ${batch}, ${SQL.escape(Date.stdFormatedString())})`;
            SQL.query(sql, null);
        }
    }
    endReqAddKey({code:200, msg:"success"}, httpRes);
};

/**
 * 手动商店周更（GM工具）
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.weekShopUpdate = function (query, httpReq, httpRes) {
    GlobalInfo.updateShopWeek();
    endReqAddKey({"code": 200, msg: "success"}, httpRes);
}
/**
 * 手动更新任务(GM工具)
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.updateTask = function (query, httpReq, httpRes) {
    gTask.updateTask();
    endReqAddKey({"code": 200, msg: "success"}, httpRes);
}

exports.oneDayUpdate = function(query, httpReq, httpRes){
    ExtendMgr.oneDayUpdate();
    endReqAddKey({"code": 200, msg: "success"}, httpRes);
}
//-------------------------------------------gm_end---------------------------------------------------------------------
/**
 * 获取所有玩家的金豆总数量
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getAllBean = function (query, httpReq, httpRes) {
    let beans = 0;
    let costs = 0;
    let num = 0;
    MongoUser.find({}, function (err, cursor) {
        if(err){
            ERROR("get player error ..1");
        }else{
            cursor.each(function(error,user){
                if(error){
                    ERROR("get player error ..2");
                }else{
                    if(user) {
                        let uid = user._id;
                        let player = PlayerMgr.players[uid];
                        if(player){
                            beans += gSeer.getPlayerBean(player);
                            beans += gSeer.getPlayerBoxBean(player);
                            costs += player.user.consume.serverCost;
                        }else{
                            beans += gSeer.getPlayerBean(player);
                            beans += gSeer.getPlayerBoxBean(player);
                            costs += user.consume.serverCost;
                        }
                        num++;
                    }else{
                        endReqAddKey({beans:beans, costs:costs, num:num}, httpRes);
                    }
                }
            });
        }
    })
};

/**
 * 发送邮件
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.sendMails = function (query, httpReq, httpRes) {
    let uids = JSON.parse(JSON.parse(query.uids));
    let goods = JSON.parse(JSON.parse(query.goods));
    for(let idx in uids) {
        let uid = uids[idx];
        (function (uid) {
            PlayerMgr.getPlayerNoCreate(uid, function (player) {
                if (player && goods) {
                    player.addMail("GM邮件", "收到来自GM的邮件，请您查收", 0, goods);
                    player.save();
                }
            })
        })(uid);
    }
    endReqAddKey({code: 200, msg: "success"}, httpRes);
};
/**
 * 查询白名单
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.checkWhilteList = function (query, httpReq, httpRes) {
    let data = GlobalInfo.globalData;
    endReqAddKey({code: 200, msg: "success", list: data.whiteList, serverState: data.serverState}, httpRes);
};
/**
 * 添加白名单
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.addWhiteList = function (query, httpReq, httpRes) {
    let uids = JSON.parse(JSON.parse(query.uids));
    for(let idx in uids) {
        let uid = uids[idx];
        if(GlobalInfo.globalData.whiteList.indexOf(uid) == -1){
            GlobalInfo.globalData.whiteList.push(uid);
        }
    }
    endReqAddKey({code: 200, msg: "success"}, httpRes);
};
/**
 * 修改服务器状态
 */
exports.ModifyServerState = function (query, httpReq, httpRes) {
    let serverState = query.serverState;
    if(serverState) {
        GlobalInfo.globalData.serverState = serverState;
    }
    endReqAddKey({code: 200, msg: "success"}, httpRes);
};
/**
 * 删除白名单
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.deleteWhiteList = function (query, httpReq, httpRes) {
    let uids = JSON.parse(JSON.parse(query.uids));
    for(let idx in uids) {
        let uid = uids[idx];
        let pos = GlobalInfo.globalData.whiteList.indexOf(uid);
        if(pos >= 0){
            GlobalInfo.globalData.whiteList.splice(pos, 1);
        }
    }
    endReqAddKey({code: 200, msg: "success"}, httpRes);
};
/**
 * 查询玩家的幸运值
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.queryLuck = function (query, httpReq, httpRes) {
    let uid = +query.uid;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player){
            player.fullData();
            let luck = player.user.luck;
            endReqAddKey({code: 200, msg: "success", uid:uid, name:player.user.name, ddz:luck.ddz, psz:luck.psz, ps:luck.ps}, httpRes);
        }else{
            endReqAddKey({code: 401, msg: "uid not find"}, httpRes);
        }
    })
};

/**
 * 查询玩家的幸运值
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.modifyLuck = function (query, httpReq, httpRes) {
    let data = {ddz:+query.ddz, psz:+query.psz, ps:+query.ps};
    let uid = +query.uid;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player){
            player.setLuck(data);
            player.save();
            endReqAddKey({code: 200, msg: "success"}, httpRes);
        }else{
            endReqAddKey({code: 401, msg: "uid not find"}, httpRes);
        }
    })
};
/**
 * 用户扫码
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.qrScan = function (query, httpReq, httpRes) {
    let unionId = query.unionId;
    let uid = +query.uid;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player){
            getPlayerByunionId(unionId, function(err) {                         // 找到了unniId就不保存 保证是新号
                if(!err) {
                    GlobalInfo.globalData.unionIdToUid[unionId] = uid;          // 扫码人的unionId对应提供二维码的uid
                    DEBUG("unionId: " + unionId + "的上级代理是: " + uid);
                }
            });
        }
    });
    endReqAddKey({"code:":200, "msg":"success"}, httpRes);
};

exports.subPub = function (query, httpReq, httpRes) {
    let unionId = query.unionId;
    let gData = GlobalInfo.globalData;
    if(unionId && !gData.subPubUnionId[unionId]){
        gData.subPubUnionId[unionId] = {status:0, uid:0};
    }
    endReqAddKey({"code:":200, "msg":"success"}, httpRes);
};

/**
 * 通过unionId获取玩家
 */
function getPlayerByunionId(unionId, cb) {
    MongoUser.find({}).toArray((err, result) => {
        if(!result){
            cb && cb(1);
            return
        }
        result.forEach((data)=>{
            if(data.info.unionId === unionId){
                cb && cb(2);
                return;
            }
        });
        cb && cb(null);
    });
}

/**
 * 有氧通知
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.yy_notice = function (query, httpReq, httpRes) {
    ERROR("收到有氧通知的回调");
    httpRes.end("SUCCESS");
    let bussOrderNum = query.buss_order_num;
    let remark = JSON.parse(query.remark);
    let tableName = "pay_order_list";
    let sql = `SELECT * FROM ${tableName} WHERE buss_order_num = ${bussOrderNum}`;
    SQL.query(sql, (err, results) => {
        if(err){
            return;
        }
        if(results.length > 0){
            let data = results[0];
            let status = data["status"];
            if(status !== 0){
                return;
            }
            let uid = remark.uid;
            let itemId = remark.itemId;
            let selected = remark.selected;

            let shopConfig = SqlLoader.getTable("shop_config");
            let goods = shopConfig[itemId];

            let card = goods.card || 0;
            let diamond = goods.giveDiamond || 0;
            let bean = goods.giveBean || 0;

            if(selected){
                diamond = 0;
            }else{
                bean = 0;
            }
            PlayerMgr.getPlayerNoCreate(uid, function(player){
                if(player){
                    let goods = [{id:1,num:bean},{id: 2,num:card}, {id: 3,num:diamond}];
                    player.addGoods(goods, eveIdType.RECHARGE);
                    let content = `恭喜，您的充值已成功到账\n充值房卡:${card}\n充值SEER:${bean}\n充值砖石:${diamond}`;
                    player.addMail("【充值信息】", content);
                    player.save();
                }
            });
            sql = util.format("UPDATE pay_order_list SET status = %d, pay_money = %d, pay_time=%s, pay_discount_money=%d, order_num=%s,bean=%d, uid=%d,card=%d, diamond=%d,where buss_order_num = %s",
                1,
                +query.pay_money,
                SQL.escape(Date.stdFormatedString()),
                +query.pay_discount_money,
                SQL.escape(query.order_num),
                bean,
                +uid,
                card,
                diamond,
                SQL.escape(bussOrderNum)
            );
            SQL.query(sql,function (err) {
                if(err){
                    ERROR("更新充值信息失败" + sql);
                }
            })
        }
        ERROR("order not find");
    });
};
/**
 * 提现结果
 * @param query
 * @param httpReq
 * @param http
 */
exports.withResult = function (query, httpReq, httpRes) {
    let result = query.result;
    let uid = query.uid;
    let withAmount = query.withAmount;
    let failReason = query.failReason;
    let startTime = query.startTime;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player){
            if(result == 3){
                let goods = [{id:1, num:withAmount}];
                let content = `很抱歉的通知您，您与${startTime}申请的提现未能通过,提现金额将如数返还\n失败原因:  ${failReason}`;
                player.addMail("【提现信息回执】", content, 0, goods);
                player.save();
            }
        }
    });
    endReqAddKey({"code":200, "msg":"success"},httpRes);
};
/**
 * 查询任务
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.checkTask = function (query, httpReq, httpRes) {
    let data = gTask.getTaskBack();
    endReqAddKey({"code":200, "msg":"success", data:data},httpRes);
};
/**
 * 查询某一条数据
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.checkOneTask = function (query, httpReq, httpRes) {
    let id = +query.id;
    let data = gTask.getTaskBack(id);
    endReqAddKey({"code":200, "msg":"success", data:data},httpRes);
}
/**
 * 添加任务
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.addTask = function (query, httpReq, httpRes) {
    let data = {};
    data.repeatType = +query.repeatType || 2;      // 重复类型 1一次性任务 2重复任务
    data.rewardType = +query.rewardType || 1;      // 奖励类型 1金豆 2彩票积分
    data.rewardNum = +query.rewardNum || 1500;        // 奖励的数量
    data.order = +query.order || 1;                // 顺序(客户端显示的顺序)
    data.gameTypeLimit = +query.gameTypeLimit || 0;   // 游戏类型限制 0所有的游戏 1麻将 2斗地主 3平三张 4拼十 5
    data.gameSubType = +query.gameSubType || 0;       // 游戏子类型
    data.matchNameLimit = +query.matchNameLimit || 0; // 游戏规模限制 0无规模限制 1虾兵场....6龙王场
    data.conditionType = +query.conditionType || 1;   // 条件类型 1对战多少局 2单局达到多少分
    data.conditionNum = +query.conditionNum || 3;     // 对应条件对应的数量
    data.startTime = query.startTime || "00:00:00";
    data.endTime = query.endTime || "23:59:59";
    gTask.addTask(data);
    endReqAddKey({"code":200, "msg":"success"},httpRes);
};

/**
 * 修改任务
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.modifyTask = function (query, httpReq, httpRes) {
    let data = {};
    data.id = +query.id;
    data.rewardType = +query.rewardType;
    data.rewardNum = +query.rewardNum;
    data.order = +query.order;
    data.gameTypeLimit = +query.gameTypeLimit;
    data.gameSubType = +query.gameSubType;
    data.matchNameLimit = +query.matchNameLimit;
    data.conditionType = +query.conditionType;
    data.conditionNum = +query.conditionNum;
    data.startTime = query.startTime;
    data.endTime = query.endTime;
    gTask.modifyTask(data);
    endReqAddKey({"code":200, "msg":"success"},httpRes);
};

exports.useGoodNotice = function (query, httpReq, httpRes) {
    let order = query.order;
    let param = JSON.parse(query.param);
    useGood.gmNotice(order, param, function (success) {
        if(success){
            endReqAddKey({"code":200, "msg":"notice success"},httpRes);
        }else{
            endReqAddKey({"code":400, "msg":"notice faile"},httpRes);
        }
    });

};
/**
 * 删除任务  目前只支持删除 到期的一次性任务
 */
exports.deleteTask = function (query, httpReq, httpRes) {
    let id = +query.id;
    let value = query.value;
    let res = gTask.deleteTask(id, value);
    if(res === 200){
        endReqAddKey({"code":200, "msg":"success"},httpRes);
    }else {
        endReqAddKey({"code":400, "msg":"fail"},httpRes);
    }
};

exports.getMatchReward = function (query, httpReq, httpRes) {
    let gData = GlobalInfo.globalData;
    if(gData.matchCfg) {
        endReqAddKey({"code": 200, msg:"success", cfg: JSON.stringify(gData.matchCfg)}, httpRes);
    }else{
        endReqAddKey({"code": 400, msg:"fail"}, httpRes);
    }
};

exports.setMatchReward = function (query, httpReq, httpRes) {
    ERROR(query.cfg);
    let matchCfg = JSON.parse(query.cfg);
    let gData = GlobalInfo.globalData;
    if(typeof matchCfg === "object"){
        gData.matchCfg = matchCfg;
        endReqAddKey({"code": 200, msg:"success"}, httpRes);
    }else{
        endReqAddKey({"code": 400, msg:"fail"}, httpRes);
    }
};

// 商店购买物品
exports.shopBuyGood = function (query, httpReq, httpRes) {
    let num = Math.floor(query.num);
    let uid = query.uid;
    PlayerMgr.getPlayerNoCreate(uid,(player)=>{
        if(player){
            if(gSeer.getPlayerBean(player) >= num) {
                player.updateBean({num: -num, eventId: eveIdType.BUY_SHOP});
                endReqAddKey({"code": 200, msg: "success"}, httpRes);
                return;
            }
        }
        endReqAddKey({"code": 400, msg: "fail"}, httpRes);
    })
};

/**
 * 获取推广员节点配置
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getExtendCfg = function(query, httpReq, httpRes){
    let data = GlobalInfo.globalData.extendCfg;
    endReqAddKey({"code": 200, msg: "success", data}, httpRes);
};
/**
 * 设置推广节点配置
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.setExtendCfg = function(query, httpReq, httpRes){
    let data = query.data;
    data = JSON.parse(data);
    if(!data.brokerage || data.brokerage < 0 || data.brokerage > 1){
        endReqAddKey({"code": 200, msg: "fail brokerage error"}, httpRes);
        return;
    }
    if(!data.nodeCfg || data.nodeCfg.length < 0){
        endReqAddKey({"code": 200, msg: "fail nodeCfg error"}, httpRes);
        return;
    }
    GlobalInfo.globalData.extendCfg = data;
    endReqAddKey({"code": 200, msg: "success", data}, httpRes);
};

/**
 * 获取推广员节点配置
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getRebate = function(query, httpReq, httpRes){
    let data = GlobalInfo.globalData.rebate;
    endReqAddKey({"code": 200, msg: "success", self:data.self, pre:data.pre, pre_pre:data.pre_pre}, httpRes);
};
/**
 * 设置推广节点配置
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.setRebate = function(query, httpReq, httpRes){
    let self = query.self;
    let pre = query.pre;
    let pre_pre = query.pre_pre;
    if(!self || !pre || !pre_pre){
        endReqAddKey({"code": 400, msg: "fail params no exist"}, httpRes);
        return;
    }
    if(self + pre + pre_pre > 1){
        endReqAddKey({"code": 400, msg: "fail params san_ge he > 1"}, httpRes);
        return;
    }
    if((self < 0 || self > 1) || (pre < 0 || pre > 1)|| (pre_pre < 0 || pre_pre > 1)){
        endReqAddKey({"code": 400, msg: "fail params error"}, httpRes);
        return;
    }
    GlobalInfo.globalData.rebate = {self, pre, pre_pre};
    endReqAddKey({"code": 200, msg: "success"}, httpRes);
};

/**
 * PFC充值
 * @param query
 * @param httpReq
 * @param httpRes
 * @constructor
 */
exports.PFCRecharge = function (query, httpReq, httpRes) {
    let seq = query.seq;
    if(!seq || seq === ""){
        endReq({code: 9001, msg: "req no exist"}, httpRes);
        return;
    }
    PFCMgr.isOneSeq(seq, "recharge", function(oneSeq){
        if(!oneSeq){
            endReq({code: 9001, msg: "req not one"}, httpRes);
            return;
        }else{
            PFCMgr.rechargePFC(query, httpRes);
        }
    });
};
/**
 * 设置GM
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.setGM = function (query, httpReq, httpRes) {
    let uid = +query.uid;
    PlayerMgr.getPlayerNoCreate(uid, (player)=>{
        if(player){
            if(!ExtendMgr.isCanSetGM(uid)){
                endReqAddKey({"code": 400, msg: "已经绑定了上级不能成为总代"}, httpRes);
                return;
            }
            if(player.user.extend_info.isGM === true){
                endReqAddKey({"code": 400, msg: "已经是总代了,无需再次设置"}, httpRes);
                return;
            }
            player.setGM();
            player.save();
            endReqAddKey({"code": 200, msg: "设置成功"}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg: "账户不存在"}, httpRes);
        }
    })
};

//------------------------------------------------------------SEER------------------------------------------------------
/**
 * 查询某个账户的余额
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getAccountBalances = function (query, httpReq, httpRes) {
    let account = query.account;
    gSeer.getAccountBalances(account, (success, ret)=>{
        if(success){
            endReqAddKey({"code": 200, num:ret, msg:"success"}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:ret}, httpRes);
        }
    });
};
/**
 * 转账
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.transfer = function (query, httpReq, httpRes) {
    let from = query.from;          // 从哪个账户
    let to = query.to;              // 到哪个账户
    let num = +query.num;           // 转出金额
    gSeer.transfer(from, to,num, (success, ret)=>{
        if(success){
            endReqAddKey({"code": 200, serverCost:ret}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:ret}, httpRes);
        }
    });
}
/**
 * 创建文体平台
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.createSC = function(query, httpReq, httpRes){
    let desc = query.desc;                       // 创建的平台描述
    let guaranty = +query.guaranty;              // 创建平台是的保证金 最低不小于100万
    gSeer.createSC(desc, guaranty,(success, ret, serverCost)=>{
        if(success){
            endReqAddKey({"code": 200, data:ret, serverCost}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:ret}, httpRes);
        }
    });
}
/**
 * 获取文体平台信息
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getSCInfo = function(query, httpReq, httpRes){
    gSeer.getSCByAccount((data)=>{
        if(data){
            endReqAddKey({"code": 200, data}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:"获取平台信息失败"}, httpRes);
        }
    });
}
/**
 * 更新文体平台
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.updateSC = function(query, httpReq, httpRes){
    let data = {};
    data.guaranty = +query.guaranty;
    data.description = query.description;
    gSeer.updateSC(data,(success, ret)=>{
        if(success){
            endReqAddKey({"code": 200, msg:"平台更新成功", serverCost:ret}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:ret}, httpRes);
        }
    })
}
/**
 * 操作平台(包括 禁止新用户划转  开启新用户划转  解散平台 用户间的划转转到其他接口)
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.OperateSC = function(query, httpReq, httpRes){
    let command = +query.command;
    let commands = [0,1,3,4];
    if(command === 3){          // 清理无余额的用户 暂时屏蔽 除非特殊需要
        return;
    }
    if(commands.indexOf(command) === -1){
        endReqAddKey({"code": 400, msg:"参数传递错误"}, httpRes);
        return;
    }
    gSeer.OperateSC(command, (success, ret, serverCost)=>{
        if(success){
            endReqAddKey({"code": 200, msg:ret, serverCost}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:ret}, httpRes);
        }
    });
}
/**
 * 获取平台划转情况
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getSCTransferRecords = function(query, httpReq, httpRes){
    let startId = query.startId || "1.2.0";
    gSeer.getSCTransferRecords(startId, (success, msg, records)=>{
        if(success){
            endReqAddKey({"code": 200, msg, records}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg}, httpRes);
        }
    });
}
/**
 * 获取账户对应的id
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getAccountId = function (query, httpReq, httpRes) {
    let account = query.account;       // 账户
    gSeer.getAccountId(account, (success, ret)=>{
        if(success){
            endReqAddKey({"code": 200, id:ret}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg:ret}, httpRes);
        }
    });
}
/**
 * 获取SEER的历史记录
 * @param query
 * @param httpReq
 * @param httpRes
 */
exports.getHistoryRecord = function(query, httpReq, httpRes){
    let account = query.account;       // 账户
    gSeer.getHistoryRecord(account, (success, msg)=>{
        if(success){
            endReqAddKey({"code": 200, msg}, httpRes);
        }else{
            endReqAddKey({"code": 400, msg}, httpRes);
        }
    });
}

/**
 * 回复函数
 * @param json
 * @param httpRes
 */
function endReq(json, httpRes) {
    if(httpRes) {
        httpRes.end(JSON.stringify(json));
    }
}
/**
 * 回复函数加密
 */
function endReqAddKey(json, httpRes) {
    let str = JSON.stringify(json);
    ERROR(str);
    let enStr   = CommFuc.phpEncode(str);
    httpRes.end(enStr);
}
