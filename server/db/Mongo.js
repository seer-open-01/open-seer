let mongodb         = require("mongodb");
///////////////////////////////////////////////////////////////////////////////
//>> MongoDB数据库

// 加载数据库
function loadDB(callback) {
    // url说明 mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
    let username = addrConfig.MongoCfg.username;
    let password = addrConfig.MongoCfg.password;
    let host = addrConfig.MongoCfg.host;
    let port = addrConfig.MongoCfg.port;
    let dbName = addrConfig.MongoCfg.dbName;
    let authType = "authMechanism=SCRAM-SHA-1";
    let connectStr = "mongodb://" + username + ":" + password + "@" + host + ":" + port + "/" + dbName + "?" + authType;
    mongodb.MongoClient.connect(connectStr,{
        db:{w:1,native_parser:false},
        server:{
            poolSize:10,
            socketOptions:{connectTimeoutMS : 500},
            auto_reconnect:true
        },
    },function(err,db){
        if (err) {
            ERROR(err);
            process.exit(-1);
        }else{
            db = db.db(dbName);
            callback && callback(db);
        }
    });
}

exports.loadDB = loadDB;