class SqlLoader{

    constructor(){
        this.data = {};

    }

    loadTable(tableName, key, cb){
        let sql = "SELECT * FROM " + tableName;
        GameSqlConfig[tableName] = {};
        SQL.query(sql, (err, results) => {
            if(err){
                return;
            }
            let res = {};
            results.forEach((data)=>{
                res[data[key]] = data;
            });
            this.data[tableName] = res;
            cb && cb()
        })
    }

    loadTables(tables){
        for (let i = 0; i < tables.length; i++){
            let tableName = tables[i].tableName;
            let key = tables[i].key;
            this.loadTable(tableName, key);
        }
    }

    getTable(tableName){
        return this.data[tableName];
    }

}

module.exports = new SqlLoader();