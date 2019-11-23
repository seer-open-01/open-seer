// 中央服务器端口
let ipAddr = "192.168.1.36";
// 游戏服务器地址配置表
exports.MiddleHost  = ipAddr;
// web端服务器地址
exports.BackHost = "192.168.1.35";
// 服务器端口
exports.MiddlePort = 7006;
// Https服务器端口地址
exports.HTTPSPort = 450;
//游戏服配置 //游戏类型 对应服务器配置
exports.GameConfig = {
    //麻将
    "1": {
        "modeToRoomId": {"FK": [100000, 200000], "JB": [200001, 300000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 8200, "capacity": 100, "sid": 101}
        ]
    },
    //斗地主
    "2": {
        "modeToRoomId": {"FK": [300001, 400000], "JB": [400001, 500000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 9200, "capacity": 100, "sid": 201}
        ]
    },
    //象棋
    "3": {
        "modeToRoomId": {"FK": [300001, 400000], "JB": [400001, 500000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 10200, "capacity": 100, "sid": 301}
        ]
    },
    //拼三张
    "4": {
        "modeToRoomId": {"FK": [300001, 400000], "JB": [400001, 500000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 11200, "capacity": 100, "sid": 401}
        ]
    },
    //拼十
    "5": {
        "modeToRoomId": {"FK": [500001, 600000], "JB": [600001, 700000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 12200, "capacity": 100, "sid":501}
        ]
    },
    //跑得快
    "7": {
        "modeToRoomId": {"FK": [700001, 800000], "JB": [800001, 900000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 13200, "capacity": 100, "sid":701}
        ]
    },
    //血战麻将
    "8": {
        "modeToRoomId": {"FK": [900001, 950000], "JB": [950001, 990000]},
        "gameServCfg": [
            {"host": ipAddr, "port": 14200, "capacity": 100, "sid":801}
        ]
    }
};
// mongodb数据库配置
exports.MongoCfg = {
    "host": "127.0.0.1",
    "port": 27017,
    "dbName": "SEER",
    "username":"seer",
    "password":"seer123456"
};
// mysql数据库配置
exports.MySqlCfg = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "admin",
    "password": "admin123456",
    "charset": "utf8",
    "database": "seer_back"
};


// mongodb数据库配置
// exports.MongoCfg = {
//     "host": "103.37.234.171",
//     "port": 26800,
//     "dbName": "ZQMJ",
//     "username":"admin",
//     "password":"esaq9exaqs2rnmkilaqgnhjop"
// };
// // mysql数据库配置
// exports.MySqlCfg = {
//     "host": "103.37.234.171",
//     "port": 28706,
//     "user": "root",
//     "password": "cdnyqp123456",
//     "charset": "utf8",
//     "database": "back"
// };

