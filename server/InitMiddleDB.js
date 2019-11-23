let mongodb     = require("mongodb");
let TaskLoader  = require("./util/Task.js").TaskLoader;
let LoggerDef   = require("./util/Logger.js").Logger;

/**
 * 主函数
 */
function main() {
    loadConf();
    setupLogger();
    let username = addrConfig.MongoCfg.username;
    let password = addrConfig.MongoCfg.password;
    let host = addrConfig.MongoCfg.host;
    let port = addrConfig.MongoCfg.port;
    let dbName = addrConfig.MongoCfg.dbName;
    let authType = "authMechanism=SCRAM-SHA-1";
    // let connectStr = "mongodb://" + username + ":" + password + "@" + host + ":" + port + "/" + dbName + "?" + authType;
    // connectStr = "mongodb://192.168.9.252:27017/ZQMJ";

    // let MongoClient = require('mongodb').MongoClient;
    // let url = "mongodb://localhost:27017/runoob";
    // MongoClient.connect(connectStr, {},function(err, db) {
    //     //     if (err) throw err;
    //     //     console.log("数据库已创建!");
    //     //     db.close();
    //     //     let cdb = db.db("ZQMJ");
    //     //     cdb.open(function(err, db) {
    //     //         if (err) {
    //     //             ERROR('db open err!');
    //     //             process.exit(-1);
    //     //         }else{
    //     //             console.log("已经建立");
    //     //         }
    //     //     });
    //     // });
    // return;
    let connectStr = "mongodb://127.0.0.1:26800";
    mongodb.MongoClient.connect(connectStr,{
        db:{w:1,native_parser:false},
        server:{
            poolSize:10,
            socketOptions:{connectTimeoutMS:500},
            auto_reconnect:true
        },
    },function(err, db){
        if (err) {
            ERROR(err);
            process.exit(-1);
        }else{
            let dbName = addrConfig.MongoCfg.dbName;
            if(!db){
                return
            }
            let cdb = db.db(dbName);
            cdb.open(function(err, db) {
                if( err ) {
                    ERROR('db open err!');
                    process.exit(-1);
                }

                let loader = new TaskLoader(function() {
                    DEBUG('Middle database created');
                    process.exit(0);
                });
                loader.addLoad('empty');

                loader.addLoad('plat');
                db.createCollection('plat', {}, function(err, result){
                    let gDBPlat = db.collection('plat');
                    gDBPlat.insertOne({_id:'_userid', 'ai': 100000}, function(err, result){
                        loader.onLoad('plat');
                    });
                });

                loader.addLoad('user');
                db.createCollection('user', {}, function(err, result){
                    loader.onLoad('user');
                });

                loader.addLoad('world');
                db.createCollection('world', {}, function(err, result){
                    let gDBWorld = db.collection("world");
                    // 保存已经使用的房间号
                    gDBWorld.insertOne({_id:'_usedRoomIds', 'ids': {}}, function(err, result){
                        loader.onLoad('world');
                    });
                });

                loader.addLoad('global');
                db.createCollection('global',{},function (err,result) {
                    let globalDB = db.collection("global");
                    globalDB.insertOne({_id:"_global", 'values':{}},function (err, result) {
                        loader.onLoad('global');
                    })
                });

                loader.addLoad('friends');
                db.createCollection('friends',{},function (err,result) {
                    var friendsDB = db.collection("friends");
                    friendsDB.insertOne({_id:"friends", 'values':{}},function (err, result) {
                        loader.onLoad('friends');
                    })
                })

                loader.addLoad("log");
                db.createCollection('log',{},function (err,result) {
                    let logDB = db.collection("log");
                    logDB.insertOne({_id:"_logId",'ai':100000},function (err,result) {
                        loader.onLoad("log");
                    })
                });

                loader.addLoad("gameinfo");
                db.createCollection('gameInfo',{},function (err,result) {
                    loader.onLoad("gameinfo");
                });

                loader.onLoad('empty');
            });
        }
    });
}
main();
/**
 * 日志初始化
 */
function setupLogger() {
    global.Logger = new LoggerDef();
    Logger.init({
        servName    : "InitDB",
    });
    global.DEBUG = function(msg) { Logger.debug(msg); };
    global.LOG = function(msg) { Logger.info(msg); };
    global.ERROR = function(msg) { Logger.error(msg); };
    LOG("Logger inited");
}
/**
 * 加载配置
 */
function loadConf() {
    global.addrConfig = require('./config/ServerAddrConfig.js');
    global.Config = require('./config/ServerConfig.js');
    global.csConfig = require('./config/CSBaseConfig.js');
}
