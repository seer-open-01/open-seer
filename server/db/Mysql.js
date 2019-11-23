let mysql = require("mysql");
module.exports = {
    pool: null,
    format: mysql.format,
    escape: mysql.escape,

    init: function(callback) {
        let options = {
            host : addrConfig.MySqlCfg.host,
            port : addrConfig.MySqlCfg.port,
            user : addrConfig.MySqlCfg.user,
            password : addrConfig.MySqlCfg.password,
            charset: addrConfig.MySqlCfg.charset,
            database : addrConfig.MySqlCfg.database,
            insecureAuth: true
        };
        this.pool = mysql.createPool(options);
        this.pool.getConnection(function(err, connection) {
            if (connection) {
                connection.release();
            }
            callback(err);
        });
    },

    /**
     * 执行SQL语句
     * @param sql
     * @param callback (err, results)
     */
    query: function(sql, callback) {
        if (!this.pool) {
            callback("error", []); return;
        }
        this.pool.query(sql, callback);
    }
};
/*
 // 测试用例
 let sql = util.format("INSERT INTO %s(id, name) VALUES (%d, %s)",'user', 1, SQL.escape("小王"));
 SQL.query(sql, function (err, results) {
 if(err){
    ERROR(err.message);
 }
 })
 */