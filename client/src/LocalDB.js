/**
 * 本地数据库
 */
game.LocalDB = {
    //>> 数据
    _data               :           {},

    // ==== 函数 ================================================================================
    /**
     * 加载数据
     */
    load : function () {
        var localStr = cc.sys.localStorage.getItem("APP_LOCAL_DB");
        cc.log("==> 加载本地数据：" + localStr);
        if (localStr) {
            this._data = JSON.parse(localStr);
        }
    },

    /**
     * 保存数据
     */
    save : function () {
        var localStr = JSON.stringify(this._data);
        // cc.log("==> 保存本地数据：" + localStr);
        cc.sys.localStorage.setItem("APP_LOCAL_DB", localStr);
    },

    /**
     * 获取值
     * @param key
     * @param ignoreUid
     * @returns {*}
     */
    get : function (key, ignoreUid) {
        var localKey = key;
        if(ignoreUid === false || ignoreUid === undefined) {
            localKey = key + game.DataKernel.uid;
        }

        return this._data[localKey];
    },

    /**
     * 设置值
     * @param key
     * @param value
     * @param ignoreUid
     */
    set : function (key, value, ignoreUid) {
        var localKey = key;
        if(ignoreUid === false || ignoreUid === undefined) {
            localKey = key + game.DataKernel.uid;
        }

        if (value === undefined || value === null) {
            delete this._data[localKey];
            return;
        }

        this._data[localKey] = value;
    }
};
