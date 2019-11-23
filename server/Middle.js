require("./util/Date.js");
let util            = require("util");
let fs              = require("fs");
let LoggerDef       = require("./util/Logger.js").Logger;
let Mongo           = require("./db/Mongo.js");
let ProcessDef      = require("./sys/Process.js").Process;
let WssServerDef    = require("./net/WssServer.js").WssServer;
let MiddleLogic     = require("./middle/index.js");
let BSProto         = require("./net/BSProto.js");
let ProtoID         = require("./net/CSProto.js").ProtoID;
let ProtoState      = require("./net/CSProto.js").ProtoState;
let PlayerMgrDef    = require("./middle/Player").PlayerManager;
let GSMgrDef        = require("./middle/GSMgr.js").GameServerManager;
let TaskLoader      = require("./util/Task.js").TaskLoader;
let DXManager       = require("./net/DXManager.js").DXManager;
let ExtendManager   = require("./middle/extendManager.js").ExtendManager;
let GMLogic         = require("./middle/GM.js");
let PidFilename     = "";
let CommFuc         = require("./util/CommonFuc.js");
let PFC             = require("./util/PFC.js");

global.timeMgr      = require("./middle/TimeTask.js");
global.GlobalInfo   = require("./middle/GlobalInfo.js");
global.Assert       = require("assert");
global.Process      = new ProcessDef();
global.ExtendMgr    = new ExtendManager();
global.MongoPlat    = null;
global.MongoUser    = null;
global.MongoWorld   = null;
global.MongoLog     = null;
global.MongoGameInfo = null;
global.MongoGlobal  = null;
global.PlayerMgr    = null;
global.WssServer    = null;
global.GSMgr        = null;
global.Logger       = null;
global.DXMgr        = null;
global.MongoFriends = null;
global.clone        = require("clone");
global.gRankManager = require("./middle/rankManager");
global.gFriendMgr   = require("./middle/Friends");
global.gTask        = require("./middle/Task.js");
global.gMatch       = require("./middle/Match");
global.SQL          = require("./db/Mysql.js");
global.GameSqlConfig = {};
global.SqlLoader = require("./util/SqlLoad");
global.gSeer        = require("./middle/Seer.js");
/**
 * 主函数
 */
function main() {
    Process.setUncaughtExceptionHandler(onUncaughtException);
    Process.setExitHandler(onProcessExit);
    loadConf();
    setupLogger();
    PFC.initCfg();
    SQL.init(function (err) {
        if(err){
            ERROR("init mysql fail");
            process.exit(-1);
        }else{
            ExtendMgr.loadData(function (err) {
                if(err){
                    ERROR("load extend data fail");
                    process.exit(-1);
                }
            });
            // gMatch.loadData(function () {
            //     if(err){
            //         ERROR("load match data fail");
            //         process.exit(-1);
            //     }
            // });


            SqlLoader.loadTable("shop_config", "itemId");
            SqlLoader.loadTable("account_closure", "uid");
            SqlLoader.loadTable("notice_config", "id", ()=>{
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
            });

            loadSqlSettings();
        }
    });
    Mongo.loadDB(function (mDB) {
        MongoPlat = mDB.collection("plat");
        MongoUser = mDB.collection("user");
        MongoWorld = mDB.collection("world");
        MongoLog = mDB.collection("log");
        MongoGameInfo = mDB.collection("gameInfo");
        MongoGlobal = mDB.collection("global");
        MongoFriends = mDB.collection("friends");
        LOG("MongoDB connected");
        GlobalInfo.init(function (suss) {
            if(suss) {
                global.DXMgr = new DXManager();
                global.PlayerMgr = new PlayerMgrDef();
                gRankManager.start();
                PlayerMgr.init(function () {
                    global.GSMgr = new GSMgrDef();
                    global.WssServer = WssServerDef.create(addrConfig.MiddleHost, addrConfig.MiddlePort);
                    WssServer.setHttpRequestHandler(onHttpRequest);
                    WssServer.setWsOriginChecker(wsOriginChecker);
                    WssServer.setWsConnMsgHandler(wsConnMsgHandler);
                    WssServer.setWsConnCloseHandler(wsConnCloseHandler);
                    WssServer.setServerStartupHandler(function () {
                        onServerStartup();
                    });
                    WssServer.setPing(Config.SetPing);
                    WssServer.start();
                    WssServer.startHttps();
                    PlayerMgr.reStartServer();
                    GlobalInfo.setTimerTask();
                    // gTask.updateTask();
                    gTask.correctTime();
                    gMatch.updateRank();
                    gFriendMgr.init((success)=>{
                        if(!success){
                            process.exit(-1);
                        }
                    });
                    gSeer.open();
                });
            }else{
                ERROR("GlobalInfo fail");
                process.exit(-1);
            }
        });
    });
}
main();
/**
 * 加载配置
 */
function loadConf() {
    global.addrConfig = require('./config/ServerAddrConfig.js');
    global.Config = require('./config/ServerConfig.js');
    global.csConfig = require('./config/CSBaseConfig.js');
}
/**
 * 加载mysql配置
 */
function loadSqlSettings() {
    let tableName = "game_config";
    let sql = "SELECT * FROM " + tableName;
    GameSqlConfig[tableName] = {};
    SQL.query(sql, (err, results) => {
        if(err){
            return;
        }
        let res = {};
        results.forEach((data)=>{
            res[data.name] = data;
        });
        GameSqlConfig[tableName] = res
    })
}

/**
 * 日志初始化
 */
function setupLogger() {
    global.Logger = new LoggerDef();
    Logger.init({
        servName: "Middle"
    });
    global.DEBUG = function (msg) {
        Logger.debug(msg);
    };
    global.LOG = function (msg) {
        Logger.info(msg);
    };
    global.ERROR = function (msg) {
        Logger.error(msg);
    };
    LOG("Logger inited");
}
/**
 * http请求
 * @param query
 * @param httpReq
 * @param httpRes
 */
function onHttpRequest(query, httpReq, httpRes) {
    // http://zqmj.ngrok.cc/mmy_1/index.php
    // http://zqmj.free.idcfengye.com/test01/index.php/Admin/WxPublic/wxPubMsg
    // http://192.168.9.252/test01/
    // http://192.168.9.252:7001?mode=gm&act=mainTest&uid=100042&type=2
    // http://192.168.9.252:7001?mode=gm&act=getAllBean
    // http://192.168.9.252:7001?mode=gm&act=checkTask
    // http://192.168.9.252:7001/?mode=gm&act=mainTest&uid=100042&type=1
    // http://zqmj02.free.idcfengye.com/yy_notice
    // http://192.168.9.252:7001?mode=gm&act=weekShopUpdate
    // http://192.168.1.181/pfc/recharge
    // https://103.37.234.171?mode=gm&act=getAllBean
    // http://103.37.234.171:7001/?mode=gm&act=save
    // https:103.37.234.171/?mode=gm&act=save
    let mode = query.mode;
    ERROR(JSON.stringify(query));
    if (mode == 'gm') {
        let act = query.act;
        let handler = GMLogic[act];
        if (handler) {
            handler(query, httpReq, httpRes);
            return;
        }
    }
    // PFC及其他接口文档
    let pathname = query.pathname;
    if (pathname && pathname != "") {
        let act = BSProto.pathnameToact[pathname];
        let handler = GMLogic[act];
        if (handler) {
            handler(query, httpReq, httpRes);
            return;
        }
    }
    ERROR("Received HTTP request");
    httpReq.connection.destroy();
}
/**
 * origin验证
 * @param origin
 * @returns {boolean}
 */
function wsOriginChecker(origin) {
    return true;
}
/**
 * @param wsConn
 * @param wsMsg
 */
function wsConnMsgHandler(wsConn, wsMsg) {
    if(!wsConn.isClose) {
        let rCode = wsMsg.code;
        let rState = wsMsg.result || ProtoState.STATE_OK;
        let rArgs = wsMsg.args;
        let sid = GSMgr.getServerByWsConn(wsConn);
        if (sid) {
            DEBUG("收到服务器消息: " + sid + ":  " + JSON.stringify(wsMsg));
        } else {
            if(rCode != ProtoID.CLIENT_HEARTBEAT) {
                DEBUG("收到玩家消息:" + JSON.stringify(wsMsg));
            }
        }
        let protoHandler = MiddleLogic.findProtoHandler(rCode);
        if (!protoHandler) {
            ERROR(util.format("Received unknown opcode %d", rCode));
            return;
        }
        let uid = wsConn.getUid();
        PlayerMgr.getPlayerNoCreate(uid, function (player) {
            if (player) {
                // player.setConn(wsConn);
                protoHandler(wsConn, rState, rArgs, player);
            } else {
                protoHandler(wsConn, rState, rArgs);
            }
        });
    }
}
/**
 * 链接关闭
 * @param wsConn
 */
function wsConnCloseHandler(wsConn) {
    let uid = wsConn.uid;
    if (uid != 0) {
        DXMgr.addWsConn(wsConn);
        PlayerMgr.getPlayerNoCreate(uid,(player)=>{
            if(player){
                player.setLogOutInfo();
                gFriendMgr.setLogoutTime(player);
            }
        })
    }
    let sid = wsConn.sid;
    if(sid != 0){
        GSMgr.rmServ(sid, wsConn);
        GSMgr.clearGameDataBySid(sid);
    }
    DEBUG(util.format("Conn %d disconnected", wsConn.getId()));
}
/**
 * 启动游戏服
 */
function onServerStartup() {
    PidFilename = "Middle" + ".pid";
    fs.writeFileSync(PidFilename, process.pid, 'utf8');
    LOG("Server startup");
}
/**
 * 信号处理
 * @param err
 * @returns {boolean}
 */
function onUncaughtException(err) {
    if (err.code == "EADDRINUSE") {
        return false;
    }
    return true;
}
/**
 * 退出进程
 */
function onProcessExit() {
    let loader = new TaskLoader(function () {
        LOG("Server shutdown");
        fs.existsSync(PidFilename) && fs.unlinkSync(PidFilename);
        process.exit(0);
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

    loader.addLoad("friend");
    gFriendMgr.save(()=>{
        LOG("friend saved");
        loader.onLoad("friend");
    });

    loader.onLoad("empty");
}
