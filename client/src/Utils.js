/**
 * 工具
 */

var Utils = {
    /**
     * 克隆数据
     * @param obj
     * @returns {*}
     */
    clone: function (obj) {
        return this._clone(obj);
    },

    _clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 判断对象是否为空
     * @param obj
     * @returns {boolean}
     */
    isObjectEmpty: function (obj) {
        return Object.keys(obj).length == 0;
    },

    /**
     * [isEqualIPAddress 判断两个IP地址是否在同一个网段]
     * @param  {[String]}  addr1 [地址一]
     * @param  {[String]}  addr2 [地址二]
     * @param  {[String]}  mask  [子网掩码]
     * @return {Boolean}         [true or false]
     */
    isEqualIPAddress: function (addr1, addr2, mask) {
        if (!addr1 || !addr2 || !mask) {
            console.log("各参数不能为空");
            return false;
        }
        var res1 = [], res2 = [];
        addr1 = addr1.split(".");
        addr2 = addr2.split(".");
        mask = mask.split(".");
        for (var i = 0, ilen = addr1.length; i < ilen; i += 1) {
            res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
            res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
        }
        if (res1.join(".") == res2.join(".")) {
            console.log("在同一个网段");
            return true;
        } else {
            console.log("不在同一个网段");
            return false;
        }
    },

    /**
     * @Abstract 调用默认浏览器打开网络链接
     * @param  {String}  url -- 欲打开的网络地址, .参数url必须以http://或https://开头
     */
    openBrowserWithUrl: function (url) {
        if (cc.sys.ANDROID === cc.sys.platform) {
            jsb.reflection.callStaticMethod("com/nayun/saiyaseer/AppActivity", "openUrl", "(Ljava/lang/String;)V", url);
        } else if (cc.sys.IPHONE === cc.sys.platform || cc.sys.IPAD === cc.sys.platform) {
            jsb.reflection.callStaticMethod("AppController", "openUrl:", url);
        }
    },

    /**
     * @Abstract 判断ios app store中是否等于当前版本号。以用于客户端判断连那个服务器。
     * @param  {String}  version -- 应用程序当前版本号。
     * @Return {Boolean} true -- 相等； false -- 不相等。如果app store中没有上架，也返回false
     */
    isCurrentVersionIOS: function (version) {
        // if (cc.sys.IPAD === cc.sys.platform || cc.sys.IPHONE === cc.sys.platform) {
        //     var localVersionKey = "Local_Version_key";
        //     var localVersion = cc.sys.localStorage.getItem(localVersionKey);
        //     cc.log("==> localVersion = " + localVersion);
        //     cc.log("==> version = " + version);
        //     if (localVersion === version) {
        //         return true;
        //     }
        //
        //     if (0 === jsb.reflection.callStaticMethod("AppController", "isCurrentVersion:", version)) {
        //         cc.sys.localStorage.setItem(localVersionKey, version);
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
        return true;
    },

    // 金币转换成以万为单位
    formatCoin: function (coin) {

        if (!game.config.FORMAT_COIN) {
            return coin;
        }
        // cc.log("==> 转换单位：" + coin);
        var result = +coin;
        if (result >= 10000) {
            if (result % 10000 != 0) {// 整倍数不保留小数
                if (result % 1000 == 0) {
                    result = (result / 10000).toFloor(1) + "w";
                }else{
                    result = (result / 10000).toFloor(2) + "w";
                }
            } else {
                result = (result / 10000) + "w";
            }
        }

        return result;
    },

    formatCoin2: function (coin) {

        if (!game.config.FORMAT_COIN) {
            return coin;
        }
        // cc.log("==> 转换单位：" + coin);
        var result = +coin;
        if (result >= 10000) {
            if (result % 10000 != 0) {// 整倍数不保留小数
                if (result % 1000 == 0) {
                    result = (result / 10000).toFloor(1) + "万";
                }else{
                    result = (result / 10000).toFloor(2) + "万";
                }
            } else {
                result = (result / 10000) + "万";
            }
        }

        return result;
    },

    labelLinefeed: function (str, length) {
        var beginPos = 0;        //字符串的初始位置
        var resultStr = "";      //返回的字符串
        var str_vec = [];
        if (str == "" || length < 1) {
            return;
        }
        do {
            //substr函数的作用类似剪刀，将str中从beginPos到length之间的字符串剪下来，单独放入容器中
            str_vec.push(str.substr(beginPos, length));
            if (beginPos + length > str.length) {
                break;  //当要裁剪的长度超出str的长度，则退出循环
            } else {
                beginPos += length;
            }
        } while (true);
        for (var i = 0; i < str_vec.length; ++i) {
            //从容器逐一取出之前裁剪好的一段段字符串，分别在字符串后面加上换行符,将\n粘到字符串后面
            resultStr = resultStr.concat(str_vec[i]).concat("\n");
        }
        // 这一句是将最后一个多余的\n给删掉
        // resultStr.pop_back();
        return resultStr;
    }
};

// 补充去尾法
Number.prototype.toFloor = function(num) {
    return Math.floor(this * Math.pow(10, num)) / Math.pow(10, num);
};
