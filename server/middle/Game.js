let util        = require("util");
let ProtoID     = require("../net/CSProto.js").ProtoID;
let ProtoState  = require("../net/CSProto.js").ProtoState;
let ProxyLv     = require("../net/CSProto.js").proxyLv;
let eveIdType   = require("../net/CSProto.js").eveIdType;
let MailStatus  = require("../net/CSProto.js").MailStatus;
let CSProto     = require("../net/CSProto.js");
let HttpReq     = require("../HttpRequest.js");
let BSProto     = require("../net/BSProto.js");
let DX          = require("../net/DXManager.js");
let CommFuc     = require("../util/CommonFuc.js");
let schedule    = require('node-schedule');
let Http        = require("../HttpRequest.js");
let AliPay      = require("../util/Alipay.js");
let PFCMgr      = require("../util/PFC.js");
let GMLogic     = require("./GM.js");
let Enum1       = require("../game/games/1/Enum.js");
let Enum2       = require("../game/games/2/Enum.js");
let useGood     = require("./useGood.js");

/**
 * 检测创建房间
 * @param data
 */
function checkCreateRoom(data, player){
    let uid = player.uid;
    let list = SqlLoader.getTable("account_closure");
    let info = list[uid];
    if(info){
        if(info["prohibit_game"] === 1){
            return ProtoState.STATE_LOGIN_BLACK;
        }
    }
    if(data.baseBean < 300 || (data.baseBean % 300 !== 0 && data.gameType != 3)){
        return ProtoState.STATE_GAME_BASE_BEAN_ERROR;
    }
    let enterBean = getFKEnterBean(data);
    if(gSeer.getPlayerBean(player) < enterBean && data.gameType != 3){
        return ProtoState.STATE_GAME_BEAN_LESS;
    }
    if(player.hasOwnedRoom()){
        return ProtoState.STATE_GAME_ONLY_ONE;
    }
    data.enterBean = enterBean;
    data.maxBean = data.maxBean || enterBean;
    if (player.hasJoinedRoom()) {
        let roomId = player.user.room.roomId;
        let room = GSMgr.getRoomData(roomId);
        if(!room){
            GSMgr.clearPlayerRoom(player, roomId);
        }else {
            if(GSMgr.roomExistUid(roomId, player.uid)) {
                return ProtoID.CLIENT_MIDDLE_CREATE_ROOM;
            }else{
                GSMgr.clearPlayerRoom(player, roomId);
            }
        }
    }
    if(data.gameType === 5){
        data.opts.maxNum = data.opts.maxNum || 6;
    }
    return ProtoState.STATE_OK;
}

/**
 * 创建房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_createRoom = function (wsConn, rState, reqArgs, player) {
    reqArgs.opts.canVoice = reqArgs.opts.canVoice || false;
    reqArgs.round = 999999;                                   // 新的房卡模式保证可以无限打
    let ret = checkCreateRoom(reqArgs, player);
    if(ret !== ProtoState.STATE_OK){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_CREATE_ROOM, args:{result:ret}});
        return;
    }
    let data = clone(reqArgs);
    data.mode = "FK";
    if(data.gameType === 1){
        data.opts.isZYSG = data.opts.isSG ? true: false;
    }
    data.round = +reqArgs.round;
    data.uid = player.uid;
    let gameServ = GSMgr.choiceMinServer(+reqArgs.gameType);
    if (!gameServ) {
        wsConn.sendMsg({cod: ProtoID.CLIENT_MIDDLE_CREATE_ROOM, args: {result: ProtoState.STATE_GAME_NOT_SUPPORT}});
        return;
    }
    createRoom(wsConn, data);
};

/**
 * 获取房卡模式最大底分
 * @param data
 */
function getFKEnterBean(data){
    let gameType = data.gameType;
    let subType = data.subType || 1;
    let baseBean = data.baseBean;
    let enterBean = 0;
    switch (gameType) {
        case 1:
            let max = data.opts.max || 40;
            if(data.opts.isZYSG){
                data.opts.isSG = true;
            }
            data.maxBean = max * baseBean;
            enterBean = subType === 1 ? baseBean * 40 : baseBean * 40;
            break;
        case 2:
            data.opts.max = data.opts.max || 64;
            enterBean = 64 * baseBean;
            break;
        case 4:
            enterBean = subType === 1 ? baseBean * 40 : baseBean * 40;
            break;
        case 5:
            enterBean = subType === 1 ? baseBean * 30 : baseBean * 30;
            break;
        case 7:
            data.opts.setMut = data.opts.setMut || 1;
            let setMut = data.opts.setMut;
            switch (setMut) {
                case 1: enterBean = baseBean * 28; break;
                case 2: enterBean = baseBean * 28; break;
                default:enterBean = baseBean * 28; break;
            }
            break;
        case 8:
            enterBean = baseBean * 48;
            break;
        default:
            enterBean = baseBean * 30;
    }
    return enterBean;
};
/**
 * 请求方法列表
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqFKList = function(wsConn, rState, reqArgs, player){
    let uid = player.uid;
    let gameType = reqArgs.gameType || 2;
    let gameServers = GSMgr.getServersByGameType(gameType);
    let len = gameServers.length;
    player.setFKReq(len);
    if(len > 0){
        for(let i = 0; i < len; i++){
            let gameServer = gameServers[i];
            gameServer.sendMsg({code:ProtoID.MIDDLE_GAME_REQ_FK_LIST, args:{gameType, uid}});
        }
    }else{
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_FK_LIST, args:{list:[]}});
    }
}
/**
 * 请求房卡列表上一页
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqFKListPre = function(wsConn, rState, reqArgs, player){
    player.tmp.listIdx = Math.max(player.tmp.listIdx - Config.FKMaxShow, 0);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_FK_LIST_PRE,args:{list:player.getFKListToClient()}})
}

/**
 * 请求房卡列表下一页
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqFKListNext = function(wsConn, rState, reqArgs, player){
    if(!player.tmp.FKList) {
        player.tmp.FKList = [];
        player.tmp.listIdx = 0;
    }
    let len = player.tmp.FKList.length;
    let offset = len % Config.FKMaxShow;
    let min = offset == 0 ? 4 : offset;
    player.tmp.listIdx = Math.min(player.tmp.listIdx + Config.FKMaxShow, len - min);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_FK_LIST_NEXT, args:{list:player.getFKListToClient()}});
}

/**
 * 检测是否能加入房间
 * @param player
 * @param roomId
 * @returns {number}
 */
function checkJoinRoom(player, roomId){
    let roomData = GSMgr.getRoomData(roomId);
    if (!roomData)
        return ProtoState.STATE_GAME_JOIN_ROOM_IDERROR;
    if(Config.enoughRooms.indexOf(roomData.gameType) >= 0 && roomData.mode == "JB"){
        if(roomData.status != 0){
            if(roomData.players.indexOf(player.uid) === -1) {
                return ProtoState.STATE_GAME_JOIN_ROOM_IDERROR;
            }
        }
    }
    if (GSMgr.isRoomFull(roomId, player.uid)) {
        return ProtoState.STATE_GAME_ROOMFUll;
    }
    let gameSev = GSMgr.getServerBySid(roomData.sid);
    if (!gameSev) {
        return ProtoState.STATE_GAME_NOT_SUPPORT;
    }
    return ProtoState.STATE_OK;
}
/**
 * 获取游戏服地址
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_getGameAddr = function (wsConn, rState, reqArgs, player) {
    let roomId = reqArgs.rid;
    let roomData = GSMgr.getRoomData(roomId);
    let result = checkJoinRoom(player, roomId);
    if(result != ProtoState.STATE_OK){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, args:{result}})
    }else {
        let gameSev = GSMgr.getServerBySid(roomData.sid);
        gameSev.sendMsg({
            code: ProtoID.MIDDLE_GAME_PLAYER_DATA,
            args: {
                pData: player.getGameServerData(roomId),
                gameType: roomData.gameType,
                isChangeRoom: reqArgs.isChangeRoom
            }
        });
    }
};

/**
 * 请求匹配列表
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_req_match_list = function (wsConn, rState, reqArgs, player) {
     let gameType = +reqArgs.gameType || 2;
     let list = csConfig.gameTypeToList[gameType];
     let data = {};
     let matchConfig = csConfig.matchConfig;
     for(let idx = 0; idx < list.length; idx++){
        let matchId = list[idx];
        let cfg = matchConfig[matchId];
        let matchCount = GSMgr.getMatchNum(matchId);
        let temp = {};
        temp.baseBean = cfg.baseBean;
        temp.enterBean = cfg.enterBean;
        temp.maxBean = cfg.maxBean;
        temp.isOpen = cfg.isOpen;
        temp.opts = cfg.opts;
        temp.gameType = cfg.gameType;
        temp.subType = cfg.subType;
        temp.matchId = cfg.matchId;
        temp.matchName = cfg.matchName;
        temp.headCount = matchCount;
        data[matchId] = temp;
     }
    wsConn.sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REQ_MATCH_LIST,
        args: {list:data, gameType}
    })
};
/**
 * 新设计模式(玩家请求服务器)
 */
exports.client_middle_req_add_match = function (wsConn, rState, reqArgs, player) {

    let uid = wsConn.getUid();
    let list = SqlLoader.getTable("account_closure");
    let info = list[uid];
    if(info){
        if(info["prohibit_game"] === 1){
            player.getConn().sendMsg({
                code: ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH,
                args: {result: ProtoState.STATE_LOGIN_BLACK}
            });
            return;
        }
    }

    if (player.hasJoinedRoom()) {
        let roomId = player.user.room.roomId;
        let room = GSMgr.getRoomData(roomId);
        if(!room){
            GSMgr.clearPlayerRoom(player, roomId);
        }else {
            if(GSMgr.roomExistUid(roomId, player.uid)) {
                player.getConn().sendMsg({
                    code: ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH,
                    args: {result: ProtoState.STATE_GAME_JOIN_A_ROOM}
                });
                return;
            }else{
                GSMgr.clearPlayerRoom(player, roomId);
            }
        }
    }
    let matchId = reqArgs.matchId;    // todo 测试血战麻将
    let sourceSid = reqArgs.sourceSid;
    let cfg = csConfig.matchConfig[matchId];
    if (gSeer.getPlayerBean(player) < cfg.enterBean) {
        player.getConn().sendMsg({code: ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH, args:{result: ProtoState.STATE_GAME_BEAN_LESS}});
        return;
    }
    let data = GSMgr.getPriorRoomId(matchId, sourceSid);
    if(data){
        let gameSev = GSMgr.getServerBySid(data.sid);
        if(!gameSev){
            ERROR("请求加入金币场，游戏服务器信息无法获取");
            return;
        }
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH ,
            args:{
                result : ProtoState.STATE_OK,
                roomId: data.roomId,
                isChangeRoom:reqArgs.isChangeRoom
            }
        })
    }else{
        let data = {}
        data.opts = cfg.opts;
        data.gameType = cfg.gameType;
        data.subType = cfg.subType;
        data.baseBean = cfg.baseBean;
        data.maxBean = cfg.maxBean;
        data.enterBean = cfg.enterBean;
        data.mode = "JB";
        data.uid = uid;
        data.round = 1;
        data.matchId = matchId;
        data.matchName = cfg.matchName;
        data.isChangeRoom = reqArgs.isChangeRoom;
        createRoom(wsConn, data);
    }
};
/**
 * 创建房间
 * @param uids
 * @param matchId
 * @param gameRule
 * @constructor
 */
function createRoom(wsConn, data) {
    let gameServ = GSMgr.choiceMinServer(data.gameType);
    if (!gameServ) {
        wsConn.sendMsg({cod: ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH, args: {result: ProtoState.STATE_GAME_NOT_SUPPORT}});
        return;
    }
    allocRoomId(data.gameType,data.mode,function (err, roomId) {
        if (err) {
            wsConn.sendMsg({
                code: ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH,
                args: {result: ProtoState.STATE_GAME_CREATE_ROOM_FAILED}
            });
        } else {
            data["roomId"] = roomId;
            data["roundId"] = GlobalInfo.globalData.roundId++;
            GlobalInfo.markDirty();
            gameServ.sendMsg({
                code: ProtoID.MIDDLE_GAME_CREATE_ROOM,
                args: data
            });
        }
    });
}
/**
 * 客户端请求商城数据
 * @param wsConn
 * @param rSate
 * @param reqArgs
 * @param player
 */
exports.client_middle_req_shop = function (wsConn, rSate, reqArgs, player) {
    let data = Config.shopData;
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REQ_SHOP,
        args: {
            shopData: data
        }
    })
};
/**
 * 客户端请求战绩
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_req_reposts = function (wsConn, rState, reqArgs, player) {
    let reports = player.user.exReports;
    let temp = [];
    for (let i = reports.length - 1; i >= 0; i--){
        temp.push(reports[i]);
    }
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REQ_REPORTS,
        args: {
            reports: temp
        }
    });

    // gMatch.updateRank();     // 这里是测试比赛场发奖励
    // for(let type = 1; type <= 3; type++) {
    //     setTimeout(function () {
    //         gMatch.sendReward(type);
    //         setTimeout(function () {
    //             gMatch.reset(type);
    //         }.bind(this), 1000);
    //
    //         setTimeout(function () {
    //             gMatch.sendBoBao();
    //         }, 5 * 1000);
    //     }.bind(this), 1000);
    // }
};

/**
 * 申请邮件列表
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_req_get_mail = function (wsConn, rState, reqArgs, player) {
    let mails = player.getMails();
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REQ_GET_MAIL,
        args: {
            mails: mails
        }
    })
};
/**
 * 删除邮件
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middlle_req_del_mail = function (wsConn, rState, reqArgs, player) {
    let ids = reqArgs.ids;
    let sub = player.getSubById(ids);
    if (sub.length == 0 && ids.length != sub.length) {
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_REQ_DEL_MAIL,
            args: {result: ProtoState.STATE_GAME_MAIL_NOEXIST}
        });
        return;
    }
    let mails = player.getMails();
    for(let mIdx = mails.length - 1; mIdx >= 0; mIdx--){
        for(let dIdx in ids){
            if(mails[mIdx] && mails[mIdx].id == ids[dIdx]){
                mails.splice(mIdx, 1);
            }
        }
    }
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REQ_DEL_MAIL,
        args: {result: ProtoState.STATE_OK, ids: reqArgs.ids}
    })
};
/**
 * 查看邮件
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_req_look_mail = function (wsConn, rState, reqArgs, player) {
    let idx = reqArgs.id;
    let sub = player.getSubById([idx]);
    if (sub.length != 1) {
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_REQ_LOOK_MAIL,
            args: {result: ProtoState.STATE_GAME_MAIL_NOEXIST}
        });
        return;
    }
    player.setReadMailFlag(sub[0]);
    player.getConn().sendMsg({code: ProtoID.CLIENT_MIDDLE_REQ_LOOK_MAIL, args: {result: ProtoState.STATE_OK, id:idx}});
};
/**
 * 获取邮件内的物品
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.client_middle_req_get_mail_goods = function (wsConn, rState, reqArgs, player) {
    let idx = reqArgs.id;
    let sub = player.getSubById([idx]);
    if (sub.length != 1) {
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_REQ_GET_GOODS,
            args: {result: ProtoState.STATE_GAME_MAIL_NOEXIST}
        });
        return;
    }
    let mails = player.getMails();
    if(!mails[sub[0]].goods){
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_REQ_GET_GOODS,
            args: {result: ProtoState.STATE_GAME_MAIL_TYPE_ERROR}
        });
        return;
    }
    if(mails[sub[0]].status == MailStatus.READ_GET){
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_REQ_GET_GOODS,
            args: {result: ProtoState.STATE_GAME_MAIL_READY_GET}
        });
        return;
    }
    let flag = player.getMailGoods(sub[0]);
    if(!flag){
        ERROR("增加邮件物品遇到了未知错误");
        return;
    }
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REQ_GET_GOODS,
        args: {id:idx, goods:mails[sub[0]].goods, type:mails[sub[0]].type}
    });
    player.isHaveMatchMail();
};
///////////////////////////////////////////////////////////////////////////////
//>> 用户登录逻辑
/**
 * 用户请求登录
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.client_middle_login = function (wsConn, rState, reqArgs) {
    // reqArgs.headPic = "http://thirdwx.qlogo.cn/mmopen/vi_32/QYFwwqTee7ZPAEoRDcUctbzNQCMa4wibv65Em4RzFYjVPQvaiaKtx1JVdhGqK5waiaW3UmmRvaic1ZGj2pExsDMkmw/132";
    let openid = reqArgs.openId;
    if (!reqArgs.name) {
        reqArgs.name = reqArgs.openId;
    }
    // CommFuc.isEmojiCharacter(reqArgs.name);     // 过滤表情符号
    reqArgs.name = unescape(escape(reqArgs.name).replace(/\%uD.{3}/g, ''));
    let wx_name = reqArgs.name;
    do {
        if (!openid) {
            break;
        }
        PlayerMgr.addPlat(openid, wx_name, function (err, uid) {
            if (!err) {
                let list = SqlLoader.getTable("account_closure");
                let info = list[uid];
                if (info) {
                    if(info["prohibit_log"] === 1){
                        sendPlayerBlack();
                        return;
                    }
                }
                PlayerMgr.getPlayer(+uid, function (player) {
                    if (player) {
                        webGenHeadPic(wsConn, reqArgs, player, function (headUrl) {
                            reqArgs.headPic = headUrl;
                            doLogin(wsConn, reqArgs, player);
                        });
                    } else {
                        sendStateFailed();
                        ERROR(util.format("Get player %d failed", uid));
                    }
                });
            } else {
                sendStateFailed();
            }
        });
        return;
    } while (false);

    function sendStateFailed() {
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_LOGIN, result: ProtoState.STATE_LOGIN_FAILED,});
    }


    function sendPlayerBlack() {
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_LOGIN,
            args:{
                result: ProtoState.STATE_LOGIN_BLACK
            }
        });
    }
};
/**
 * 登录检测
 * @param reqArgs
 * @param player
 */
function loginCheck(reqArgs, player) {
    let gData = GlobalInfo.globalData;
    if(gData.serverState == 2){
        if(gData.whiteList.indexOf(player.uid) ===  -1){
            return ProtoState.STATE_LOGIN_MAINTAIN;
        }
    }
    return ProtoState.STATE_OK;
}

/**
 * 请求web端生成头像
 */
function webGenHeadPic(wsConn, reqArgs, player, cb){
    if(reqArgs.headPic === ""){
        cb("");
        return;
    };
    HttpReq.requestGame(BSProto.ReqArgs.GET_HEAD, {uid:player.uid, headUrl:reqArgs.headPic},3,"/header/index.php/home/index/", function (result) {
        ERROR(result);
        try {
            result = JSON.parse(result);
        }catch (e) {
            result = {};
        }
        if(!result.headUrl) result = reqArgs.headPic;
        let headUrl  = result.headUrl ? result.headUrl : reqArgs.headPic;
        cb(headUrl);
    });
}
/**
 * 登录
 * @param wsConn
 * @param reqArgs
 * @param player
 */
function doLogin(wsConn, reqArgs, player) {
    let ret = loginCheck(reqArgs, player);
    if(ret != ProtoState.STATE_OK){
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_LOGIN,args:{result:ret}});
        return;
    }
    player.setLoginInfo(reqArgs, wsConn);
    wsConn.setUid(player.uid);
    player.checkDayVers();
    DXMgr.plusWsConn(player.uid);
    WssServer.removeConn(player.uid, wsConn.id);
    player.setConn(wsConn);
    if(player.hasJoinedRoom()){
        GSMgr.checkRoomId(player);
    }
    //发送跑马灯数据
    ExtendMgr.checkUserData(player, function (err) {
        if(err){
            ERROR("写入数据库失败" + err.message);
        }else{
            setExtendInfo(player);
            let uData = clone(player.user);
            reComUData(uData, player);
            let content = Config.wechat;
            wsConn.sendMsg({
                code: ProtoID.CLIENT_MIDDLE_LOGIN,
                args: {
                    uid: player.uid,
                    user: uData,
                    content: content,
                    haveNewMail : player.isExistMail(),
                    serverTime:Date.getStamp() * 1000
                }
            });
            setTimeout(function () {
                loginAfter(player, wsConn);
            }.bind(player),2000);
            let table = "user_list";
            let sql = `UPDATE ${table} SET last_login_ip = ${SQL.escape(uData.marks.loginIP)}, last_login_time = ${SQL.escape(Date.stdFormatedString())} WHERE uid = ${player.uid}`;
            SQL.query(sql, (err)=>{
                if(err){
                    ERROR("LOGIN UPDATE SQL ERROR");
                    ERROR(err);
                }
            })
        }
    });
}

function reComUData(uData, player) {
    delete uData.reports;
    delete uData.mails;
    delete uData.exReports;
    delete uData.rankMatch.record;
    delete uData.luck;
    delete uData.subsidy;
    delete uData.PFC;
    let bag = clone(uData.bag);
    delete uData.bag;
    uData.bindInfo = {phone: bag.phone, netAccount:bag.netAccount, tvAccount: bag.tvAccount,wxAccount:bag.wxAccount};
    uData.rankMatch.matchIng = CommFuc.getMatchIng(uData.rankMatch.classInfo);
    let bankPassword = uData.storageBox.password;
    uData.storageBox.password = !!bankPassword;
    uData.storageBox.remember = false;
}
/**
 * 登录后进行的处理
 * @constructor
 */
function loginAfter(player) {
    player.sendNotice();
    player.isHaveMatchMail();
    // player.boonTodayTip();
    // player.checkPub();       // 比赛场是否关注了微信公众号
    player.checkSign();         // 检测连续登陆
    player.checkBoonRed();      // 检测福利红点
    player.sendBagRecordRed();  // 检测背包红点
    player.ForceExitGame();     // 检测本次登陆是否是切换后台强制登陆的
    // player.sendPFCInfo();       // 获取PFC地址
    gSeer.TempBeanToSc(player);   // 更新玩家身上的数据
    gSeer.AsyncBoxBean(player); // 更新玩家盒子里面的数据
    gSeer.asyncSCBean(player);
    //player.checkBeanLess();
    gTask.checkRed(player);     // 检测任务红点
    ExtendMgr.updateSql("wx_name", player.user.info.name, player.uid);
    GlobalInfo.broadHorn(player);   // 发送大喇叭消息
    gFriendMgr.updateUserLoginInfo(player); // 登陆后的操作
    Http.requestGame(null,{ip:player.user.marks.loginIP},1, null, function (result) {
        if(result){
            if(result.data) {
                if(result.data.region)ExtendMgr.updateSql("last_login_region", result.data.region, player.uid);
                if(result.data.city)ExtendMgr.updateSql("last_login_city", result.data.city, player.uid);
            }
        }
    });
}

/**
 * 设置代理信息
 */
function setExtendInfo(player){
    let user = player.user;
    if (!user.initComplete) {
        user.info.createIP = player.getConn().getAddrString();
        let preUid = GlobalInfo.globalData.unionIdToUid[user.info.unionId];
        if(preUid){
            ExtendMgr.bindPreAgent(player, {superUid:preUid});
        }
        user.initComplete = true;
    }
    user.extend_info.pre_extend_uid = ExtendMgr.user_list[player.uid].pre_uid;
}
/**
 * 心跳包
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.heartbeat = function (wsConn, rState, reqArgs) {
    let uid = wsConn.getUid();
    PlayerMgr.getOnlinePlayer(uid, function (player) {
        if(player) {
            player.setPreHeartbeat();
            player.getConn().sendMsg({
                code: ProtoID.CLIENT_HEARTBEAT,
                args: {}
            })
        }
    });
};
/**
 * 修改签名请求
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.changeSignReq = function (wsConn, rState, reqArgs, player) {
    let sign = reqArgs.signature;
    player.setSignature(sign);
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_GAME_CHANGE_SIGN,
        args: {
            signature:sign
        }
    })
};

/**
 * 请求排行榜
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.playerRankReq = function (wsConn, rState, reqArgs, player) {
    let uid = wsConn.getUid();
    if(reqArgs.mod === 1){
        let data = gRankManager.getBeanRank(uid);
        if(data.bean === 0){
            data.bean = gSeer.getPlayerBean(player);
        }
        data.mode = reqArgs.mod;
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_PLAYERS_RANK,
            args: data
        })
    }else {
        let data = gRankManager.getPlayRank(uid);
        data.mode = reqArgs.mod;
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_PLAYERS_RANK,
            args: data
        })
    }

};
/**
 * 清理客户端roomId
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.clearClientRoomId = function(wsConn, rState, reqArgs, player){
    let uid = reqArgs.gUid;
    if(uid < 100000){
        return;
    }
    let roomId = reqArgs.roomId;
    PlayerMgr.getPlayerNoCreate(uid, (player)=>{
        if(player){
            if(player.getConn()){
                player.getConn().sendMsg({code:ProtoID.CLEAR_ID, args:{roomId}});
            }
        }
    })
};

/**
 * 请求离开房间
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.playerLeaveReq = function(wsConn, rState, reqArgs, player){
    setTimeout(function () {
        let leave = false;
        if(!player.hasJoinedRoom()){
            leave = true;
        }
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_LEAVE, args:{leave}});
    }, 500);
};
/**
 * 绑定上级代理
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.bindPreAgent = function (wsConn, rState, reqArgs, player) {
    let ret = ExtendMgr.bindPreAgent(player, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BIND_PRE, args : {result:ret, superUid:reqArgs.superUid}})
};
/**
 * 获取所有推广的数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
getAllExtendMsg = function(wsConn, rState, reqArgs, player){
    let uid = player.uid;
    Http.requestGame(BSProto.ReqArgs.GET_TICKET, {uid: uid, header_url:player.user.info.headPic}, 3, Config.qrPath,function (result) {
        if(result) {
            let res = {url:""}
            try {
                res = JSON.parse(result);
            }catch(e){
                ERROR("error");
            }
            let data = ExtendMgr.allMsg(player);
            data.url = res.url;
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BIND_ALL, args:{data}});
            player.setTicket(res);
        }
    })
}
/**
 * 银行存取金贝
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.queryBank = function (wsConn, rState, reqArgs, player) {
    // let uid = wsConn.getUid();
    let result = ProtoState.STATE_OK;
    let user = player.getStatus();
    let bank = player.getBank();
    let num = reqArgs.bean;
    if(!bank.remember && !player.tempRememberPassword){
        result = ProtoState.STATE_FAILED;
        player.getConn().sendMsg({
            code: ProtoID.CLIENT_MIDDLE_QUERY_BANK,
            args: {
                user:user,
                bank:bank,
                result: result
            },
        });
        return;
    }

    if(reqArgs.isSave){
        //游戏中不能存钱
        if(player.user.room.roomId !== 0){
            result = ProtoState.STATE_FAILED;
            player.getConn().sendMsg({
                code: ProtoID.CLIENT_MIDDLE_QUERY_BANK,
                args: {
                    user:user,
                    bank:bank,
                    result: result
                },
            });
            return;
        }
        if(num > user.bean){
            result = ProtoState.STATE_FAILED
        }else {
            player.updateBank("bean", num);
            player.updateBean({num: -num, eventId: eveIdType.BANK_UPDATE});
        }
    }else{
        if(num > bank.bean){
            result = ProtoState.STATE_FAILED
        }else {
            player.updateBank("bean", -num);
            player.updateBean({num: num, eventId: eveIdType.BANK_UPDATE});
        }
    }

    user = player.getStatus();
    bank = player.getBank();
    //更新mysql表
    let table = "user_list";
    let sql = `UPDATE ${table} SET beans = ${user.bean}, band_beans = ${bank.bean} WHERE uid = ${player.uid}`;
    SQL.query(sql, (err, results) => {
        if(err){
            ERROR("BANK SQL UPDATE ERROR")
        }
    });
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_QUERY_BANK,
        args: {
            isSave: reqArgs.isSave,
            user:user,
            bank:bank,
            bean: reqArgs.bean,
            result: result
        },
    });

    //通知游戏服
    player.updateGameStatus()
};



/**
 * 银行存取金贝(SEER放到内部划转和退还SC数据那里了)
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.queryBankBsc = function (wsConn, rState, reqArgs, player) {
    // let uid = wsConn.getUid();
    return; // SEER版本不需要保险箱
    // TODO 不需要密码的BSC版本
    let result = ProtoState.STATE_OK;
    let user = player.getStatus();
    let bank = player.getBank();
    let num = reqArgs.bean;
    // if(!bank.remember && !player.tempRememberPassword){
    //     result = ProtoState.STATE_FAILED;
    //     player.getConn().sendMsg({
    //         code: ProtoID.CLIENT_MIDDLE_QUERY_BANK,
    //         args: {
    //             user:user,
    //             bank:bank,
    //             result: result
    //         },
    //     });
    //     return;
    // }
    // 必须是100的整数倍取消
    // if(!(num >= 100 && num % 100 === 0)){
    //     return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_QUERY_BANK_BSC, args:{result:ProtoState.STATE_GAME_BANK_ERROR}})
    //     return;
    // }
    if(reqArgs.isSave){
        //游戏中不能存钱
        if(player.user.room.roomId !== 0){
            result = ProtoState.STATE_FAILED;
            player.getConn().sendMsg({
                code: ProtoID.CLIENT_MIDDLE_QUERY_BANK_BSC,
                args: {
                    user:user,
                    bank:bank,
                    result: result
                },
            });
            return;
        }
        if(num > user.bean){
            result = ProtoState.STATE_FAILED
        }else {
            player.updateBank("bean", num);
            player.updateBean({num: -num, eventId: eveIdType.BANK_UPDATE});

        }
    }else{
        if(num > bank.bean){
            result = ProtoState.STATE_FAILED
        }else {
            player.updateBank("bean", -num);
            player.updateBean({num: num, eventId: eveIdType.BANK_UPDATE});
        }
    }

    user = player.getStatus();
    bank = player.getBank();
    //更新mysql表
    let table = "user_list";
    let sql = `UPDATE ${table} SET beans = ${user.bean}, band_beans = ${bank.bean} WHERE uid = ${player.uid}`;
    SQL.query(sql, (err, results) => {
        if(err){
            ERROR("BANK SQL UPDATE ERROR")
        }
    });
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_QUERY_BANK_BSC,
        args: {
            isSave: reqArgs.isSave,
            user:user,
            bank:bank,
            bean: reqArgs.bean,
            result: result
        },
    });

    //通知游戏服
    player.updateGameStatus()
};



/**
 * 关闭银行
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.leaveBank = function (wsConn, rState, reqArgs, player) {
    // let uid = wsConn.getUid();
    player.tempRememberPassword = false;
    // player.getConn().sendMsg({
    //     code: ProtoID.CLIENT_MIDDLE_LEAVE_BANK,
    //     args: {},
    // })
};

/**
 * 输入银行密码
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.inputBankPassword = function (wsConn, rState, reqArgs, player) {
    // let uid = wsConn.getUid();
    let password = player.user.storageBox.password;
    let result = ProtoState.STATE_OK;
    if(reqArgs.password === password){
        player.tempRememberPassword = true;
    }else {
        result = ProtoState.STATE_FAILED;
    }
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_INPUT_PASSWORD_BANK,
        args: {
            result: result
        }
    })
};


/**
 * 是否记住银行密码
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.rememberPasswordBank = function (wsConn, rState, reqArgs, player) {
    // let uid = wsConn.getUid();
    player.setBankStat(!!reqArgs.remember);
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_REMEMBER_PASSWORD_BANK,
        args: {
            remember: !!reqArgs.remember
        },
    })
};

/**
 * 发送验证码
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.sendSingCode = function (wsConn, rState, reqArgs) {
    let tell = reqArgs.phone;
    GlobalInfo.sendSmsCode(tell, function (return_code,code) {
        if(return_code == "0"){
            wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_SEND_SIGN});
            GlobalInfo.saveSms(tell, code);
        }else{
            wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_SEND_SIGN, args:{result:ProtoState.STATE_FAILED}});
        }
    });
};
/**
 * 查询战绩
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.queryPlayerReports = function (wsConn, rState, reqArgs, player) {
    let uid = wsConn.getUid();
    if(reqArgs.uid !== uid){
        return
    }
    //let modes = {1: "JB", 2: "FK"};

    let reports = [];
    let allReports = player.user.reports;

    for (let i = allReports.length - 1; i >= 0; i--){
        let report = clone(allReports[i]);
        delete report.details;
        report.id = i;
        //if(report.mode === modes[reqArgs.mod]){
            reports.push(report);
        //}
        if(reports.length >= 20){break}
    }
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_QUERY_PLAYER_REPORTS,
        args: {
            reports: reports
        },
    })
};

/**
 * 查询战绩详情
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.queryPlayerReportsDetails = function (wsConn, rState, reqArgs, player) {
    let id = +reqArgs.id;
    let allReports = player.user.reports;
    let report = null;
    for (let i = allReports.length - 1; i >= 0; i--){
        if(i === id){
            report = allReports[i];
            break;
        }
    }
    if(report) {
        wsConn.sendMsg({
            code: ProtoID.CLIENT_MIDDLE_QUERY_PLAYER_REPORTS_DEALER,
            args: {
                details: report.details,
                time: report.time,
                roomId: report.roomId,
                roundId: report.roundId,
                mode: report.mode,
                gameType: report.gameType
            },
        })
    }
};


/**
 * 修改银行密码
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.changeBankPassword = function (wsConn, rState, reqArgs, player) {
    let playerSign = "";
    let playerTell = "";
    let sign = reqArgs.sign;
    let tell = reqArgs.tell;
    let password = reqArgs.password;
    player.user.storageBox.password = password;
    if(playerSign === sign && playerTell === tell){
        player.password = password;
    }
};


/**
 * 请求商城配置
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.queryShopConfig = function (wsConn, rState, reqArgs, player) {
    let config = GameSqlConfig;
    let shopConfig = SqlLoader.getTable("shop_config");
    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_QUERY_SHOP_CONFIG,
        args: {
            itemCfg: shopConfig,
            rechargeDayLimit: {
                currentPrice: player.user.dayVars.dayMoney,
                limitPrice: config["game_config"].dayBuyLimit.value
            },
            rechargeMonthLimit: {
                currentPrice: player.user.dayVars.monthMoney,
                limitPrice: config["game_config"].monthBuyLimit.value
            }
        },
    })
};

/**
 * 兑换钻石
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.exchangeDiamond = function (wsConn, rState, reqArgs, player) {
    let num = Math.floor(reqArgs.num);
    let user = player.getStatus();
    if(!num){
        return;
    }
    if(num > user.diamond){
        return;
    }
    let diamond = {
        id: 3,
        num: -num,
        eventId: eveIdType.CONVERT
    };

    let bean = {
        id: 1,
        num: num * 10,
        eventId: eveIdType.CONVERT
    };

    player.getConn().sendMsg({
        code: ProtoID.CLIENT_MIDDLE_EXCHANGE_DIAMOND,
        args: {
            result: 0
        }
    });

    player.updateMoney(diamond);
    player.updateMoney(bean);
     //通知游戏服
    player.updateGameStatus()

};
/**
 * 请求奖池配置
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.bonusCfgReq = function (wsConn, rState, reqArgs, player) {
    player.getConn().sendMsg({
        code:ProtoID.CLIENT_MIDDLE_REQ_BONUS_CONFIG,
        args:{
            ranks:csConfig.bonusCfg
        }
    })
};
/**
 * 分享
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.onShare = function (wsConn, rState, reqArgs, player) {
    let uid = player.uid;
    let isCircle = reqArgs.isCircle;
    if(GlobalInfo.globalData.todayShare.indexOf(uid) == -1) {
        GlobalInfo.globalData.todayShare.push(uid);
    }
    if(player.user.invitation === "") {
        gMatch.genInvite(player);
    }
    player.getConn().sendMsg({code:ProtoID.CLIENT_MIDDLE_SHARE_NOTICE})
};
/**
 * 玩家反馈
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.feedback = function (wsConn, rState, reqArgs, player) {
    if(player.user.dayVars.feedbackCount >= Config.maxFeedBack){
        player.getConn().sendMsg({
            code : ProtoID.CLIENT_MIDDLE_FEEDBACK,
            args :{
                result:ProtoState.STATE_GAME_FEED_LIMITE
            }
        });
        return;
    }
    let content = reqArgs.content;
    let table = "feedback";
    let sql = `INSERT INTO ${table} (uid, name, content, time) VALUES (${player.uid},${SQL.escape(player.user.info.name)},${SQL.escape(content)}, ${SQL.escape(Date.stdFormatedString())})`;
    ERROR(sql);
    SQL.query(sql, (err) => {
        if(err){
            ERROR("authtell mysql error" + err);
            player.getConn().sendMsg({
                code : ProtoID.CLIENT_MIDDLE_FEEDBACK,
                args :{
                    result:ProtoState.STATE_APPLY_SQL_ERROR
                }
            });
        }else{
            player.getConn().sendMsg({
                code : ProtoID.CLIENT_MIDDLE_FEEDBACK
            });
            player.addFeedBackNum();
        }
    });
};
/**
 * 请求支付宝付款
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqAlipay = function (wsConn, rState, reqArgs, player) {
    let idx = +reqArgs.idx;
    let selected = reqArgs.selected;
    let shopConfig = SqlLoader.getTable("shop_config");
    let info = shopConfig[idx];
    if(!info)return;
    let data = {uid:player.uid, payMoney:info.rmbPrice, itemId:idx, selected:selected};
    AliPay.getQRcode(data,function (res, bussOrderNum) {
        res = JSON.parse(res);
        let resultCode = res.resultCode;
        ERROR("-----" + JSON.stringify(res)+"-------------");
        if(resultCode == 200){
            AliPay.saveBussOrderNum(bussOrderNum, function (success) {
                if(success){
                    player.getConn().sendMsg({
                        code:ProtoID.CLIENT_MIDDLE_REQ_ALIPAY,
                        args:{
                            qrCode :res.Data.qr_code,
                            orderNum:res.Data.order_num
                        }
                    })
                }
            });
        }else{
            player.getConn().sendMsg({
                code:ProtoID.CLIENT_MIDDLE_REQ_ALIPAY,
                args:{
                    result:ProtoState.STATE_FAILED
                }
            })
        }
    });
};

/**
 * 通知middle开始游戏
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.startGame = function (wsConn, rState, reqArgs){
    let rid = reqArgs.rid;
    if( GSMgr.roomData[rid]) {
        GSMgr.roomData[rid].status = reqArgs.status;
        GSMgr.clearCopyNum(rid, reqArgs.status);
    }
};
/**
 * 更新幸运值
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.updateLuck = function (wsConn, rState, reqArgs) {
    let gameType = reqArgs.gameType;
    let uid = reqArgs.guid;
    let value = reqArgs.value;
    PlayerMgr.getPlayerNoCreate(uid, function (player) {
        if(player) {
            player.updateLuck(gameType, value);
            player.save();
        }
    });
};
/**
 * 插播消息
 * @param wsConn
 * @param rState
 * @param reqArgs
 */
exports.insertNotice = function (wsConn, rState, reqArgs) {
    let data = {};
    data.content = reqArgs.msg;
    data.playback_sequence = 1;
    data.playback_interval = 6;
    data.playback_count = 1;
    let dStr = Date.formatDate(Date.getStamp());
    data.start_time = dStr.hour + ":" + dStr.minute + ":" + dStr.second;
    data.end_time = "23:59:59";
    GMLogic.sendInsertNotice(data);
};
/**
 * 绑定银行卡
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.bindBank = function (wsConn, rState, reqArgs, player) {
    player.setBindBank(reqArgs);
    wsConn.sendMsg({
        code:ProtoID.CLIENT_BIND_BANK,
        args:{
            bankNumber:reqArgs.bankNumber
        }
    })
};
/**
 * 绑定支付宝
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.bindAlipay = function (wsConn, rState, reqArgs, player) {
    player.setBindAlipay(reqArgs);
    wsConn.sendMsg({
        code:ProtoID.CLIENT_MIDDLE_BIND_ALIPAY,
        args:{
            account:reqArgs.account
        }
    })
};
/**
 * 提现申请
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqDrawing = function (wsConn, rState, reqArgs, player) {
    let amount = reqArgs.num;
    let type = reqArgs.type;
    if(amount < Config.withMinAmount){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_DRAWING, args:{result:ProtoState.STATE_FAILED}});
        return;
    }
    let plusBean = gSeer.getPlayerBean(player) - amount;
    if(plusBean < Config.withMinRetain){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_DRAWING, args:{result:ProtoState.STATE_WITH_MIN_BL}});
        return;
    }
    let data = {num:-amount, eventId:eveIdType.WITH};
    player.updateBean(data);
    let cost = Math.ceil(amount * Config.withdrawProp);
    if(cost < Config.withdrawMin){
        cost = Config.withdrawMin;
    }
    let bindInfo = player.getBindInfo(type);
    let fina = amount - cost;
    let sql = util.format("INSERT INTO %s(uid, type, real_name, bank_name, bank_or_apliay, start_time, end_time, result, with_amount, cost_amount, fina_amount)" +
        " values (%d, %d, %s, %s, %s, %s, %s, %d, %d, %d, %d)",
        'withdraw_list',
        player.uid,
        type,
        SQL.escape(bindInfo.realName),
        SQL.escape(bindInfo.bankName),
        SQL.escape(bindInfo.paperId),
        SQL.escape(Date.stdFormatedString()),
        SQL.escape(""),
        1,
        amount,cost,fina
    );
    SQL.query(sql,function (err) {
        if(err){
            ERROR("record with info fail:" + sql);
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_DRAWING, args:{result:ProtoState.STATE_FAILED}})
        }else {
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_DRAWING, args:{bean:gSeer.getPlayerBean(player)}});
        }
    });
};
/**
 * 请求银行记录
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqBankRecord = function (wsConn, rState, reqArgs, player) {
    let sql = `SELECT * FROM withdraw_list WHERE uid = ${player.uid} and type = 1`;
    SQL.query(sql, (err, results) => {
        if(err){
            return;
        }
        let record = [];
        let len = results.length;
        for(let idx = 0; idx < len; idx++){
            let data = {};
            data.startTime = Date.getStampBySql(results[idx].start_time);
            data.endTime = Date.getStampBySql(results[idx].end_time);
            data.realName = results[idx].real_name;
            data.bankName = results[idx].bank_name;
            data.bankNumber = results[idx].bank_or_apliay;
            data.result = results[idx].result;
            data.withAmount = results[idx].with_amount / 100;
            data.costAmount = results[idx].cost_amount / 100;
            data.finaAmount = results[idx].fina_amount / 100;
            record.push(data);
        }
        wsConn.sendMsg({
            code:ProtoID.CLIENT_MIDDLE_BANK_LOG,
            args:{list:record}
        })
    });
};
/**
 * 查询支付宝记录
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqAlipayRecord = function (wsConn, rState, reqArgs, player) {
    let sql = `SELECT * FROM withdraw_list WHERE uid = ${player.uid} and type = 2`;
    SQL.query(sql, (err, results) => {
        if(err){
            return;
        }
        let record = [];
        let len = results.length;
        for(let idx = 0; idx < len; idx++){
            let data = {};
            data.startTime = Date.getStampBySql(results[idx].start_time);
            data.endTime = Date.getStampBySql(results[idx].end_time);
            data.realName = results[idx].real_name;
            data.apliayAccount = results[idx].bank_or_apliay;
            data.result = results[idx].result;
            data.withAmount = results[idx].with_amount / 100;
            data.costAmount = results[idx].cost_amount / 100;
            data.finaAmount = results[idx].fina_amount / 100;
            record.push(data);
        }
        wsConn.sendMsg({
            code:ProtoID.CLIENT_MIDDLE_ALIPAY_RECORD,
            args:{list:record}
        })
    });
}
/**
 * 请求商城配置
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqShopConfig = function (wsConn, rState, reqArgs, player) {
    let config = Config.shopConfig;
    wsConn.sendMsg({
        code:ProtoID.CLIENT_MIDDLE_GET_SHOP_CONFIG,
        args:{
            config:config
        }
    })
};
/**
 * 请求任务数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqTaskData = function (wsConn, rState, reqArgs, player) {
    let res = gTask.getTask(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_TASK_REQ,args:{data:res}});
};

/**
 * 领取奖励
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqTaskReward = function (wsConn, rState, reqArgs, player) {
    let id = +reqArgs.id;
    let res = gTask.getReward(player, id);
    if(typeof res === "number") {
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_GET_TASK, args: {result: res}});
    }else{
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_GET_TASK, args: {id:id, task:res}});
    }
    gTask.checkRed(player);
};
/**
 * 请求背包数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
function reqBagData (wsConn, rState, reqArgs, player) {
    let bagItems = player.user.bag.items;
    let newBag = {};
    let nPos = 1;
    for(let pos  = 1; pos <= Config.maxBagCount; pos++){
        if(bagItems[pos]){
            newBag[nPos] = bagItems[pos];
            newBag[nPos].pos = nPos;
            nPos++;
        }
    }
    player.user.bag.items = newBag;
    let tempBag = clone(newBag);
    for(let pos in tempBag){
        let item = tempBag[pos];
        if(item.id === 12 && item.cards.length > 0 && item.num > 0){
            let cards = item.cards;
            item.param = {};
            item.param.card = cards[0];
            delete item.cards;
        }
    }
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_BAG, args:{bag: tempBag}});
};

/**
 * 使用背包数据
 */
exports.useItem = function (wsConn, rState, reqArgs, player) {
    let pos = reqArgs.pos;
    let num = reqArgs.num || 1;
    let opts = reqArgs.opts || {};
    let item = player.user.bag.items[pos];
    if(!item || item.pos != pos){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{result:ProtoState.GOOD_NO_EXIT}});
    }
    if(item && item.num <= 0)return;
    if(item.num - num < 0)return;
    if(item){
        if(item.id === 7){
            useGood.userBroadband(player,num,(success,order)=>{
                if(success){
                    item.num -= num;
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{pos:pos, num: item.num, id:7, useNum:num}});
                    useGood.mailRemind(player, 7, num,order,{account:player.user.rankMatch.netAccount});
                    useGoodAfterCommon(wsConn, item, player, pos);
                }else{
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{result:ProtoState.STATE_FAILED}});
                }
            })
        }else if(item.id === 8){
            useGood.userTV(player, num, (success, order)=>{
                if(success){
                    item.num -= num;
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{pos:pos, num: item.num,id:8, useNum:num}});
                    useGood.mailRemind(player, 8, num,order,{account:player.user.rankMatch.tvAccount});
                    useGoodAfterCommon(wsConn, item, player, pos);
                }else{
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{result:ProtoState.STATE_FAILED}});
                }
            })
        }else if(item.id === 10){
            useGood.giveTV(player, num, (success, order)=>{
                if(success){
                    let id = item.id;
                    let addressInfo = player.user.rankMatch.addressInfo;
                    item.num -= num;
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{pos:pos, num: item.num,id:id, useNum:num}});
                    useGood.mailRemind(player, id, num,order,addressInfo);
                    useGoodAfterCommon(wsConn, item, player, pos);
                }else{
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{result:ProtoState.STATE_FAILED}});
                }
            })
        }else if(item.id === 11){
            useGood.giveSuitcase(player, num, (success, order)=>{
                if(success){
                    let id = item.id;
                    let addressInfo = player.user.rankMatch.addressInfo;
                    item.num -= num;
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{pos:pos, num: item.num,id:id, useNum:num}});
                    useGood.mailRemind(player, id, num,order,addressInfo);
                    useGoodAfterCommon(wsConn, item, player, pos);
                }else{
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{result:ProtoState.STATE_FAILED}});
                }
            })
        }else if(item.id === 12){       // 必须只能一张一张使用
            num = 1;
            let cards = item.cards;
            let param = {card:cards[0]};
            useGood.useMatchCard(player, param, (success, code)=>{
                if(success){
                    let id = item.id;
                    item.num -= 1;
                    cards.splice(0, 1);
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{pos:pos, num: item.num,id:id, useNum:num}});
                    useGoodAfterCommon(wsConn, item, player, pos);
                }else{
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{id:item.id, result:code}});
                }
            })
        }else if(item.id>=15 && item.id <= 33){
            useGood.useNewBag(player, num, item.id,opts,(success, order,param)=>{
                if(success){
                    param = JSON.parse(param);
                    item.num -= num;
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{pos:pos, num: item.num,id:item.id, useNum:num}});
                    useGood.mailRemind(player, item.id, num, order,param);
                    useGoodsLog(player,{id:item.id, num});
                    useGoodAfterCommon(wsConn, item, player, pos);
                }else{
                    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_USE_ITEM, args:{result:ProtoState.STATE_FAILED}});
                }
            })
        }
    }
};

/**
 * 背包记录
 * @param player
 * @param good
 */
function useGoodsLog(player, good) {
    let now = Date.stdFormatedString();
    let times = now.split(":");
    let logShow = Config.GoodIDOpts[good.id].logShow;
    let msg1 = `您于${times[0]}:${times[1]}兑换了${logShow}`;
    let plus1 = useGood.getGoodNum(player, good.id);
    player.addBagLog(msg1, plus1);
}


function useGoodAfterCommon(wsConn, item, player, pos) {
    if(item.num <= 0){
        delete player.user.bag.items[pos];
    }
    reqBagData(wsConn, null, null, player);
}



function reqBoonALL(wsConn, rState, reqArgs, player){
    let data = {
        signin:player.user.boon.curFreeCount >= csConfig.boonCfg.freeCount,                 // 每日抽奖
        subsidy:{cur:player.user.subsidy.curCount, max:Config.subsidyCfg.count},            // 破产补助
        sign:player.getIsSign()                                                             // 连续签到
        };
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BOON_DATA, args:{data}});
}
/**
 * 请求福利
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqBoon = function (wsConn, rState, reqArgs, player) {
    let cfg = csConfig.boonCfg.reward;
    let data = {};
    for(let idx in cfg){
        data[idx] = {};
        data[idx].type = cfg[idx].id;
        data[idx].num = cfg[idx].num;
    }
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BOON_REQ,args:{data:data,
        curFreeCount: player.user.boon.curFreeCount,
        curCount:player.user.boon.curCount,
        maxFree:csConfig.boonCfg.freeCount,
        maxCount:csConfig.boonCfg.maxCount
    }});
};
/**
 * 抽奖
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.getBoon = function (wsConn, rState, reqArgs, player) {
    let res = checkBoon(player);
    if(typeof res === "number"){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BOON_GET,args:{result : res}});
        return;
    }
    let props = csConfig.boonCfg.props;
    let rewards = csConfig.boonCfg.reward;
    let sum = 0;
    for(let idx in props){
        sum += props[idx];
    }
    let tally = 0;
    let goodIdx = checkSpeBoon(player, res.type);
    let loopNum = 0;
    if(goodIdx === 0) {
        do {
            let r = Math.floor(Math.random() * sum);
            loopNum++;
            if(loopNum > 1000)break;
            for (let idx in props) {
                tally += props[idx];
                if (r < tally) {
                    goodIdx = +idx;
                    break;
                }
            }
        }while (goodIdx === csConfig.boonCfg.speReward);
    }
    let good = rewards[goodIdx];
    if(goodIdx === 0){
        ERROR("系统出错..");
    }else{
        if(res.type == 2){
            player.addBoonCount();
            let data = {num: -csConfig.boonCfg.consume, eventId: eveIdType.BoonConsume};
            player.updateBean(data);
            ExtendMgr.updateFinance({uid:player.uid, num:csConfig.boonCfg.consume,financeType:CSProto.financeType.BOON_CONSUME});
        }else if(res.type == 1){
            player.addBoonFreeCount();
        }
        if(goodIdx === csConfig.boonCfg.speReward){
            player.user.boon.speCount++;
        }
        good.eventId = eveIdType.BoonGet;
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BOON_GET,args:{
                id:+goodIdx,
                type: good.id,
                num : good.num,
                curFreeCount: player.user.boon.curFreeCount,
                curCount:player.user.boon.curCount,
                maxFree:csConfig.boonCfg.freeCount,
                maxCount:csConfig.boonCfg.maxCount
            }});
        setTimeout(function () {
            player.updateMoney(good);
            player.checkBoonRed();
            if(good.id === 1){
                ExtendMgr.updateFinance({uid:player.uid, num:-good.num,financeType:CSProto.financeType.BOON_GET});
            }
        }.bind(player), 3000);
        return;
    }
};

/**
 * 检测特殊奖品
 */
function checkSpeBoon(player, type) {
    if(player.user.boon.speCount < csConfig.boonCfg.speCount && type === 1){
        return csConfig.boonCfg.speReward;
    }
    return 0;
};
/**
 * 检测福利
 */
function checkBoon(player) {
    if(player.user.boon.curFreeCount < csConfig.boonCfg.freeCount){
        return {type : 1};
    }
    if(gSeer.getPlayerBean(player) < csConfig.boonCfg.consume){
        return ProtoState.STATE_GAME_BEAN_LESS
    }
    if(player.user.boon.curCount >= csConfig.boonCfg.maxCount){
        return ProtoState.STATE_BOON_COUNT_LESS
    }
    return {type : 2}
}
/**
 * 报名请求
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqEnroll = function (wsConn, rState, reqArgs, player) {
    let ret = gMatch.userCard(player, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_MATCH_REQ_ENROOL, args:{result:ret}})
};

exports.reqMatchRanks = function (wsConn, rState, reqArgs, player) {
    let data = gMatch.reqRanks(player, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_MATCH_REQ_RANKS, args:data})
};

exports.reqMatchLog = function (wsConn, rState, reqArgs, player) {
    let data = gMatch.reqRecordMsg(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_MATCH_RECORD, args:data})
};

exports.bindParam = function (wsConn, rState, reqArgs, player) {
    let ret = gMatch.bindParam(player, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BIND_TV_NET, args:{result:ret, data : reqArgs}});
};

exports.nameAuth = function (wsConn, rState, reqArgs, player) {
    let ret = gMatch.nameAuth(player, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_NAME_AUTH, args:{result:ret, data : reqArgs}});
};

exports.genInvite = function (wsConn, rState, reqArgs, player) {
    let invitation = gMatch.genInvite(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GEN_INVITE, args:{invitation}});
};

exports.fillInvite = function (wsConn, rState, reqArgs, player) {
    gMatch.checkInvite(player, reqArgs,(code, mUid)=>{
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_FILL_INVITE, args:{result:code, invitation:reqArgs.invitation}});
        if(code === ProtoState.STATE_OK){
            player.setFillInvite(reqArgs.invitation);
            PlayerMgr.getPlayerNoCreate(mUid, (mPlayer)=>{
                if(mPlayer) {
                    gMatch.giveCard(CSProto.GIVECARD.invite, mPlayer, player.user.info.name);
                }
            })
        }
    });
};

exports.explain = function (wsConn, rState, reqArgs, player) {
    let msgs = gMatch.getExplain(reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REWARD_EXPLAIN, args:{msgs}});
};

exports.updateMatchCard = function (wsConn, rState, reqArgs, player) {
    let newCard = gMatch.updateMatchCard(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_UPDATE_MATCH, args:{newCard}});
}


// 好友系统
exports.openFriends = function (wsConn, rState, reqArgs, player) {
    let data = gFriendMgr.openFriends(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_OPEN_FRIEND, args:data});
};

exports.applyFriend = function (wsConn, rState, reqArgs, player) {
    let ret = gFriendMgr.applyFriend(player,reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_ADD_FRIEND_REQ, args:{result:ret}});
};

exports.applyResult = function (wsConn, rState, reqArgs, player) {
    let ret = gFriendMgr.applyResult(player.uid, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_ADD_FRIEND_RESULT, args:{result:ret, agree:reqArgs.agree, id:reqArgs.noticeId, type:2}});
};

function friendListReq(wsConn, rState, reqArgs, player) {
    let list = gFriendMgr.reqMyFriend(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_FRIEND_LIST, args:{list:list}});
};

exports.removeFriends = function (wsConn, rState, reqArgs, player) {
    let ret = gFriendMgr.removeFriend(player.uid, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REMOVE_FRIEND, args:{result:ret}});
    friendListReq(wsConn, null, null, player);
};

exports.reqNotice = function (wsConn, rState, reqArgs, player) {
    let res = gFriendMgr.reqNotice(player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_NOTICE, args:res});
};

exports.checkChatRecord = function (wsConn, rState, reqArgs, player) {
    let records = gFriendMgr.checkChatRecord(player, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_CHECK_CHAT_RECORD, args:{records:records}});
};

exports.onPlayerChat = function (wsConn, rState, reqArgs, player) {
    gFriendMgr.chat(player, reqArgs);
};

exports.giveBean = function (wsConn, rState, reqArgs, player) {
    gFriendMgr.giveBean(player, reqArgs, function (errCode, res) {
        if(errCode !== 0 ) {
            wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_GIVE_BEAN, args: {result: errCode}});
        }else{
            wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_GIVE_BEAN, args: res});
        }
    });
};

exports.giveBeanResult = function (wsConn, rState, reqArgs, player) {
    let ret = gFriendMgr.resultReceive(player.uid, reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GIVE_RESULT, args:{result:ret, id:reqArgs.noticeId, type:3}});
};

exports.changeBatch = function (wsConn, rState, reqArgs, player) {
    let list = gFriendMgr.changeBatch(player, true);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BATCH, args:{list:list}});
};

exports.search = function (wsConn, rState, reqArgs, player) {
    let data = gFriendMgr.search(player, reqArgs);
    if(typeof(data) === "number"){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_SEARCH, args:{result:data}});
    }else{
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_SEARCH, args:{data}});
    }
};

exports.closeChat = function (wsConn, rState, reqArgs, player) {
    gFriendMgr.closeChat(player);
};

exports.closeFriend = function (wsConn, rState, reqArgs, player) {
    gFriendMgr.closeFriend(player);
};

// 获取大喇叭消息
exports.getHornMsg = function(wsConn, rState, reqArgs, player){
    let msgs = GlobalInfo.getHornMsg();
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GET_BIG_HORN, args:{msgs}});
};

exports.sendHornMsg = function (wsConn, rState, reqArgs, player) {
    let ret = GlobalInfo.addHornMsg(player, reqArgs);
    let msgs = GlobalInfo.globalData.hornMsgs;
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_SEND_HORN_MSG,args:{result:ret}});
    if(ret === ProtoState.STATE_OK) {
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_GET_BIG_HORN, args: {msgs}});
    }
};

/**
 * 申请破产补助
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.getSubsidy = function (wsConn, rState, reqArgs, player) {
    let bean = gSeer.getPlayerBean(player) + gSeer.getPlayerBoxBean(player);
    if(bean >= Config.subsidyCfg.min){
        return wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_APPLY_SUBSIDY, args: {result:ProtoState.STATE_BEAN_TOO_LONG}});
    }
    if(player.user.subsidy.curCount >= Config.subsidyCfg.count){
        return wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_APPLY_SUBSIDY, args: {result:ProtoState.STATE_COUNT_LIMITE}});
    }
    player.user.subsidy.curCount++;
    player.updateBean({num:Config.subsidyCfg.num, eventId:CSProto.eveIdType.SUBSIDY});
    reqBoonALL(wsConn, rState, reqArgs, player);
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_APPLY_SUBSIDY, args: {result:ProtoState.STATE_OK, num:Config.subsidyCfg.num}});
};

/**
 * 获取签到数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
getSignReq = function (wsConn, rState, reqArgs, player) {
    let status = player.user.sign.status;
    let data = {};
    for(let day in Config.signCfg){
        data[day] = {goods:Config.signCfg[day], status:status[day] || 1};
    }
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GET_SIGN_DATA,args:{data}});
};

/**
 * 获取签到奖励
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.getSignReward = function (wsConn, rState, reqArgs, player) {
    let sign = player.user.sign;
    let goods = [];
    for(let day in sign.status){
        let dayGoods = Config.signCfg[day];
        if(sign.status[day] === 2 && dayGoods){
            for(let i = 0; i < dayGoods.length; i++){
                let dGood = dayGoods[i];
                let find = false;
                for(let j = 0; j < goods.length; j++){
                    let good = goods[j];
                    if(good.id === dGood.id){
                        find = true;
                        good.num += dGood.num;
                        sign.status[day] = 3;
                    }
                }
                if(!find){
                    goods.push(clone(dGood));
                    sign.status[day] = 3;
                }
            }
        }
    }
    player.addGoods(goods, eveIdType.SIGN);
    player.checkBoonRed();
    getSignReq(wsConn, rState, reqArgs, player);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REWARD_SIGN_DATA,args:{goods}});
};

/**
 * 请求商城数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
function getShopData(wsConn, rState, reqArgs, player) {
    let data = clone(Config.NewShopConfig);
    let bugCount = player.user.shopData.bugCount;
    for(let i = 0;i < data.length; i++){
        let goodId = data[i].id;
        data[i].plusNum = data[i].maxNum - bugCount[goodId];
        data[i].weekCur = GlobalInfo.globalData.weekShop[goodId].curNum;
        data[i].weekCur = data[i].weekCur <= data[i].weekMax ? data[i].weekCur : data[i].weekMax;
        delete data[i].maxNum;
    }
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_NEW_SHOP, args:{data}});
};
/**
 * 购买物品
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.buyShopData = function (wsConn, rState, reqArgs, player) {
    let shopIndex = reqArgs.index;
    let num = reqArgs.num || 1;
    let cfg = Config.NewShopConfig[shopIndex];
    if(!cfg){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BUY_GOODS,args:{result:CSProto.ProtoState.GOOD_NO_EXIT}});
    }
    let id = cfg.id;
    if(player.user.shopData.bugCount[id] >= cfg.maxNum) {
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BUY_GOODS,args:{result:CSProto.ProtoState.GOOD_COUNT_LESS}});
    }
    if(gSeer.getPlayerBean(player) < cfg.bean){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BUY_GOODS,args:{result:CSProto.ProtoState.STATE_GAME_BEAN_LESS}});
    }
    if(player.user.status.diamond < cfg.diamond){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BUY_GOODS,args:{result:CSProto.ProtoState.DIAMOND_LESS}});
    }
    if(GlobalInfo.globalData.weekShop[id].curNum >= cfg.weekMax){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BUY_GOODS,args:{result:CSProto.ProtoState.GOOD_WEEK_LESS}});
    }
    let goods = [{id:id, num:num}];
    GlobalInfo.globalData.weekShop[id].curNum++;
    let bugCount = player.user.shopData.bugCount;
    bugCount[id]++;
    if(cfg.bean > 0)player.updateBean({num:-cfg.bean, eventId:eveIdType.BUY_SHOP});
    if(cfg.diamond > 0)player.updateDiamond({num:-cfg.diamond, eventId:eveIdType.BUY_SHOP});
    player.addGoods(goods, eveIdType.BUY_SHOP);         // 商城购买的物品
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_BUY_GOODS});
    getShopData(wsConn, rState, reqArgs, player);
};

/**
 * 请求兑换码
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqConvert = function(wsConn, rState, reqArgs, player){
    let ret = gMatch.userCard(player,reqArgs);
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_REQ_CONVERT,args:{result:ret}})
}
/**
 * 赠送物品
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 * @returns {*|void}
 */
exports.giveItems = function (wsConn, rState, reqArgs, player) {
    let pos = +reqArgs.pos;
    let num = +reqArgs.num || 1;
    let target = +reqArgs.target;
    let item = player.user.bag.items[pos];
    if(!item || item.pos != pos){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GIVE_GOODS, args:{result:ProtoState.GOOD_NO_EXIT}});
    }
    if(player.uid === target){
        return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GIVE_GOODS, args:{result:ProtoState.NOT_GIVE_SELF}});
    }
    if(item && item.num <= 0)return;
    if(item.num - num < 0)return;
    PlayerMgr.getPlayerNoCreate(target,(targetPlayer)=>{
        if(targetPlayer){
            item.num -= num;
            let good = {id:item.id, num:num};
            targetPlayer.addGoods([good], eveIdType.BAG_GIVE);
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GIVE_GOODS});
            useGoodAfterCommon(wsConn, item, player, pos);
            logRecord(player, targetPlayer, good);
        }else{
            return wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GIVE_GOODS, args:{result:ProtoState.PLAYER_NOT_FIND}});
        }
    })
}

function logRecord(player, targetPlayer, good) {
    let now = Date.stdFormatedString();
    let times = now.split(":");
    let logShow = Config.GoodIDOpts[good.id].logShow;
    let msg1 = `您于${times[0]}:${times[1]}向ID${targetPlayer.uid}的玩家赠送了${logShow}`;
    let plus1 = useGood.getGoodNum(player, good.id);
    let msg2 = `ID${player.uid}的玩家于${times[0]}:${times[1]}向您赠送了${logShow}`;
    let plus2 = useGood.getGoodNum(targetPlayer, good.id);
    player.addBagLog(msg1, plus1);
    targetPlayer.addBagLog(msg2, plus2);
}

/**
 * 获取背包记录
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.getBagRecords = function (wsConn, rState, reqArgs, player) {
    let data = player.user.bag.records || [];
    if(player.user.bag.recordRed){
        player.user.bag.recordRed = false;
        player.sendBagRecordRed();
    }
    wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_GET_BAG_RECORD, args:{data}});
}

exports.testPFC = function(wsConn, rState, reqArgs, player){
    PFCMgr.testPFC(null);
}
/**
 * 查询PFC
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.queryPFC = function(wsConn, rState, reqArgs, player){
    PFCMgr.queryPFC(player.user.info.openId, function(obj){
        if(obj){
            ERROR(JSON.stringify(obj));
            if(obj.code === 0) {
                wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_QUERY_PFC, args: {address: obj.data.address}});
            }else{
                wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_QUERY_PFC, args: {result:ProtoState.STATE_FAILED, msg:obj.msg}});
            }
        }
    })
}
/**
 * 重新绑定PFC(目前我们是无法通过改变账户实现绑定的)
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reBindPFC = function (wsConn, rState, reqArgs, player) {
    PFCMgr.reBindPFC();
}
/**
 * 提现 // 类型1: 金豆直接提现  类型2: 推广收益(包括节点收益、代理收益);
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.withdrawPFC = function(wsConn, rState, reqArgs, player){
    reqArgs.type = reqArgs.type || 2;
    let msg = PFCMgr.checkIsCanWithdraw(player, reqArgs);
    if(msg !== "success"){
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_WITHDRAW_PFC, args: {result:ProtoState.STATE_FAILED,msg}});
        return;
    }
    player.user.PFC.withdrawIng = true;
    PFCMgr.withdrawPFC(player, reqArgs, function (res, params) {
        player.user.PFC.withdrawIng = false;
        if(res){
            let obj = JSON.parse(res);
            if(obj.code === 0) {
                let data = obj.data;
                wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_WITHDRAW_PFC, args: {address: data.to_account, pfcAmount:data.out_amount}});
                ExtendMgr.withdraw(params, player);
                PFCMgr.UpdateWithdrawLog(data, params, player);
                player.addAddressRecord(params.address);
                player.addPFCWithdraw(1, params);
                getAllExtendMsg(wsConn,rState, reqArgs, player);
            }else{
                wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_WITHDRAW_PFC, args: {result:ProtoState.STATE_FAILED, msg:obj.msg}});
            }
        }
    })
}
/**
 * 获取PFC充值记录
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 * @constructor
 */
exports.GetPFCRechargeRecords = function (wsConn, rState, reqArgs, player) {
    let records = player.user.PFC.rechargeRecords;
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_PFC_RECHARGE_RECORDS, args: {records}});
}
/**
 * 获取PFC提现记录
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.getPFCWithdrawRecords = function(wsConn, rState, reqArgs, player){
    let records = player.user.SEER.withdrawRecords;
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_PFC_WITHDRAW_RECORDS, args: {records}});
}
/**
 * 切换地址
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.swithAddress = function (wsConn, rState, reqArgs, player) {
    let address = PFCMgr.swithAddress(player);
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_SWITCH_ADDRESS, args: {address}});
}
/**
 * 设置PFC密码
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.setPFCPassword = function(wsConn, rState, reqArgs, player){
    let ret = PFCMgr.setPassword(player, reqArgs);
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_SWITCH_ADDRESS, args: {result:ret}});
}
/**
 * 获取能提现的金额
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.getWithdrawNum = function(wsConn, rState, reqArgs, player){
    let sum = ExtendMgr.getCanProfit(player.uid);
    sum = Math.floor(sum);
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_PFC_GET_WITHDRAW_NUM, args: {sum}});
}
/**
 * 请求注册SEER账号
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.rigSeerAccount = function(wsConn, rState, reqArgs, player){
    if(player.user.SEER.account !== ""){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"已经注册了SEER账号，无需再次注册"}});
        return;
    }
    let account = reqArgs.account;
    account = account.replace(/\s*/g,"");
    if(!account || account === ""){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"账户不能为空"}});
        return;
    }
    let reg = /^[0-9a-z-]+$/;
    if(!reg.test(account)){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"账户必须包含数字、小写字母、-划线"}});
        return;
    }

    reg = /^[0-9]+$/;
    if(reg.test(account)){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"账户不能由纯数字组成"}});
        return;
    }
    reg = /^[a-z]+$/;
    if(reg.test(account)){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"账户不能由纯字母组成"}});
        return;
    }
    if(account.length > 8){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"账户位数不符"}});
        return;
    }
    let b = /[a,e,i,o,u,y]$/i;
    if(b.test(account)){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:"不能包含元音字母a、e、i、o、u、y"}});
        return;
    }
    gSeer.registerAccount(account,(success, data)=>{
        if(success){
            data.account = account;
            player.setSeerInfo(data);
            gSeer.addUserInfo(player);
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{id:data.id, account}});
            player.save();
        }else{
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, args:{result:ProtoState.STATE_FAILED, msg:data}});
        }
    });
}
/**
 * 划转资金到平台
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.transferSC = function(wsConn, rState, reqArgs, player){
    let account = player.user.SEER.account;
    let num = +reqArgs.num;
    if(!num || !account){
        wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_TRANSFER_SC, args:{result:ProtoState.STATE_FAILED, msg:"取出数量不能为空"}});
        return;
    }
    gSeer.transferSC(player, num,(success, msg, serverCost)=>{
        if(success){
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_TRANSFER_SC,args: {serverCost}});
        }else{
            if(msg.indexOf("less") >= 0){
                msg = "提取会扣除一定手续费，请保证链上剩余seer足够支付所需手续费";
            }
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_TRANSFER_SC, args:{result:ProtoState.STATE_FAILED, msg}});
        }
    });
}
/**
 * 资金从SC平台返还给玩家
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.returnSC =  function(wsConn, rState, reqArgs, player){
    gSeer.returnSC(player, (success, msg, serverCost)=>{
        if(success){
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_RETURN_SC,args: {serverCost} });
        }else{
            wsConn.sendMsg({code:ProtoID.CLIENT_MIDDLE_RETURN_SC, args:{result:ProtoState.STATE_FAILED, msg}});
        }
    });
}
/**
 * 资金内部划转
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.updateBeanBySC = function (wsConn, rState, reqArgs, player) {
    let target = reqArgs.target || 100003;
    let num = reqArgs.num || 10;
    gSeer.updateBeanBySC(player, target, num, (success, msg)=>{
        if(success){
            ERROR("划转成功");
        }else{
            ERROR("划转失败" + msg);
        }
    });
}
/**
 * 请求seer数据
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.reqSeerNum = function(wsConn, rState, reqArgs, player){
    gSeer.sendSCNum(player.uid);
    gSeer.sendBoxNum(player.uid);
}
/**
 * SEER提现
 * @param wsConn
 * @param rState
 * @param reqArgs
 * @param player
 */
exports.withdrawSEER = function(wsConn, rState, reqArgs, player){
    let msg = gSeer.checkIsCanWithdraw(player, reqArgs);
    if(msg !== "success"){
        wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_WITHDRAW_SEER, args: {result:ProtoState.STATE_FAILED,msg}});
        return;
    }
    gSeer.withdrawSEER(player, reqArgs.num);
    getAllExtendMsg(wsConn,rState, reqArgs, player);
    wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_WITHDRAW_SEER, args: {num:reqArgs.num}});
}
/**
 * 申请房间号
 * @param gameType
 * @param mode
 * @param callback
 */
function allocRoomId(gameType,mode,callback) {
    GlobalInfo.allocRoomId(gameType,mode,callback);
}

exports.reqBagData = reqBagData;
exports.useGoodAfterCommon = useGoodAfterCommon;
exports.friendListReq = friendListReq;
exports.reqBoonALL = reqBoonALL;
exports.getSignReq = getSignReq;
exports.getShopData = getShopData;
exports.getAllExtendMsg =getAllExtendMsg;
