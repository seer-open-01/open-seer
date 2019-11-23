require("./util/Date.js");
let util            = require("util");
let fs              = require("fs");
let LoggerDef       = require("./util/Logger.js").Logger;
let Mongo           = require("./db/Mongo.js");
let ProcessDef      = require("./sys/Process.js").Process;
let WssServerDef    = require("./net/WssServer.js").WssServer;
let GameLogic       = require("./game/index.js");
let ProtoState      = require("./net/CSProto.js").ProtoState;
let GameMgrDef      = require("./game/GameMgr.js").GameManager;

global.SQL          = require("./db/Mysql.js");
global.Log          = require("./game/Log.js");
global.Assert       = require("assert");
global.clone        = require("clone");
let MAX_PUBLIC_GAME = require("./net/CSProto.js").MAX_PUBLIC_GAME;

DEBUGMOD = false;
///////////////////////////////////////////////////////////////////////////////
//>> 游戏服务器
global.Process      = new ProcessDef();
global.WssServer    = null;
global.GameMgr      = null;
global.Logger       = null;
global.BaseInfoMgr  = null;
let PidFilename     = "";
let gamePos         = [3, 0];   // [游戏类型、第n个服务器]
/**
 * 入口函数
 */
function main() {
    Process.setUncaughtExceptionHandler(onUncaughtException);
    Process.setExitHandler(onProcessExit);
    loadConf();
    setupLogger();
    let gConfig = addrConfig.GameConfig[gamePos[0]].gameServCfg[gamePos[1]];
    GameMgr = new GameMgrDef(gConfig.sid);
    GameMgr.init(gamePos, function (suss) {
        if (suss) {
            global.WssServer = WssServerDef.create(gConfig.host, gConfig.port);
            WssServer.setHttpRequestHandler(onHttpRequest);
            WssServer.setWsOriginChecker(wsOriginChecker);
            WssServer.setWsConnMsgHandler(wsConnMsgHandler);
            WssServer.setWsConnCloseHandler(wsConnCloseHandler);
            WssServer.setServerStartupHandler(function () {
                onServerStartup(getSidbyGamePos(gamePos));
            });
            WssServer.setPing(Config.SetPing);
            WssServer.start();
        } else {
            ERROR("Connect to middle server failed");
            process.exit(-1);
        }
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
 * 初始化日志
 */
function setupLogger() {
    global.Logger = new LoggerDef();
    Logger.init({
        servName: getSidbyGamePos(gamePos),
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
 * 获取sid
 * @param gamePos
 * @returns {number|*}
 */
function getSidbyGamePos(gamePos) {
    return addrConfig.GameConfig[gamePos[0]].gameServCfg[gamePos[1]].sid;
}
/**
 * http请求
 * @param query
 * @param httpReq
 * @param httpRes
 */
function onHttpRequest(query, httpReq, httpRes) {
    ERROR("Received HTTP request");
    httpReq.connection.destroy();
}
/**
 * Origin检测
 * @param origin
 * @returns {boolean}
 */
function wsOriginChecker(origin) {
    return true;
}
/**
 * 消息处理
 * @param wsConn
 * @param wsMsg
 */
function wsConnMsgHandler(wsConn, wsMsg) {
    if(!wsConn.isClose) {
        let rCode = wsMsg.code;
        let rState = wsMsg.result || ProtoState.STATE_OK;
        let rArgs = wsMsg.args;
        let gameType = gamePos[0];
        DEBUG("收到消息:" + JSON.stringify(wsMsg));
        let protoHandler = null;
        let caller = global;
        if (rCode >= MAX_PUBLIC_GAME) {
            let SubGame = GameMgr.getSubGame(gameType);
            protoHandler = SubGame.findProtoHandler(rCode);
            caller = SubGame;
        } else {
            protoHandler = GameLogic.findProtoHandler(rCode);
        }
        if (!protoHandler) {
            ERROR(util.format("Received unknown opcode %d", rCode));
            return;
        }
        protoHandler.call(caller, wsConn, rState, rArgs);
    }
}
/**
 * 关闭连接
 * @param wsConn
 */
function wsConnCloseHandler(wsConn) {
    //GameMgr.p
    DEBUG(util.format("Conn %d disconnected", wsConn.getId()));
}

/**
 * 启动服务器
 * @param sid
 */
function onServerStartup(sid) {
    // 写PID文件
    PidFilename = sid + ".pid";
    fs.writeFileSync(PidFilename, process.pid, 'utf8');

    LOG("Server startup");
}
/**
 * 异常处理
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
 * 进程退出
 */
function onProcessExit() {
    GameMgr.shutdown();
    LOG("Server shutdown");
    fs.existsSync(PidFilename) && fs.unlinkSync(PidFilename);
    process.exit(0);
}