////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 支付宝请求付款
let http        = require('http');
let qs          = require('querystring');
let crypto      = require('crypto');
let util        = require('util');

function AliPay() {
    this.appKey = "a5860939e130fe3d962fe118e5d6b42a";                   // 商户appKey
    this.keyValue = "PCuW01uXuRKBFi9M1TMau8Xh315IFeR0sCc0Eeqw";         // 商户秘钥
    // this.notifyUrl = "http://zqmj05.vipgz1.idcfengye.com/yy_notice";    // 回调地址
    this.notifyUrl = "http://42.51.64.43:7003/yy_notice";               // 回调地址
    this.timeOut = 60;                                                  // 超时时间
}

AliPay.prototype = {
    /**
     * md5加密
     * @param str
     * @returns {*}
     */
    md5:function (str) {
        let md5sum = crypto.createHash("md5");
        md5sum.update(str, "utf-8");
        let sign = md5sum.digest('hex');
        return sign;
    },
    /**
     * 根据键值排序
     */
    sortByCollections: function (tbl) {
        let oT = Object.keys(tbl).sort();
        let nT = {};
        for (let i = 0; i < oT.length; i++) {
            nT[oT[i]] = tbl[oT[i]];
        }
        return nT;
    },
    /**
     * 生成订单
     * @returns {string}
     */
    genOrderNum: function (uid) {
        let str = "";
        let now = Date.now();
        let order = str + now + uid;
        return order;
    },
    /**
     * 生成签名
     * @param data
     * @returns {*}
     */
    genSign: function (data) {
        let str = "keyValue=" + this.keyValue;
        for (let idx in data) {
            let oneStr = "&" + idx + "=" + data[idx];
            console.log(oneStr);
            str += oneStr;
        }
        str = str.toUpperCase();
        let sign = this.md5(str);
        return sign;
    },
    /**
     * 获取必要的参数
     * @returns {{paramStr: string}}
     */
    getParamStr: function (args) {
        let uid = args.uid;
        let data = {};
        data.appKey = this.appKey;
        data.bussOrderNum = this.genOrderNum(uid);                        // 商户网站唯一订单号
        data.orderName = uid + "pay";                                     // 订单备注 sign
        data.payPlatform = 1;                                             // 支付平台
        data.payMoney = args.payMoney;                                    // 充值金额
        data.notifyUrl = this.notifyUrl;                                  // 回调地址
        data = this.sortByCollections(data);
        data.remark = JSON.stringify({uid: uid, bussOrderNum: data.bussOrderNum, itemId:args.itemId, selected:args.selected});
        let sign = this.genSign(data);
        data.sign = sign;
        let sStr = "";
        for (let idx in data) {
            let oneStr = "";
            if (idx == "appKey") {
                oneStr = idx + "=" + data[idx];
            } else {
                oneStr = "&" + idx + "=" + data[idx];
            }
            sStr += oneStr;
        }
        return {bussOrderNum:data.bussOrderNum, qs:{paramStr: sStr}}
    },
    /**
     * 获取 qr_code
     * @param callback
     * @constructor
     */
    getQRcode: function (data, callback) {
        // let data = {uid:player.uid, payMoney:info.rmbPrice, itemId:idx};
        let args = this.getParamStr(data);
        let bussOrderNum = args.bussOrderNum;
        let content = qs.stringify(args.qs);
        console.log(content);
        let requestTimer = setTimeout(function () {
            req.abort();
            callback && callback(JSON.stringify({code: 401, msg: "请求超时"}));
            console.log('......Request Timeout......');
        }, this.timeOut * 1000);

        let options = {
            host: "103.72.146.163",
            port: 80,
            path: '/AliPayH5/AlipayZZ.do',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': content.length
            }
        };

        let req = http.request(options, function (res) {
            clearTimeout(requestTimer);
            let responseTimer = setTimeout(function () {
                res.destroy();
                callback && callback(JSON.stringify({code: 401, msg: "请求超时"}));
                console.log('......Response Timeout......');
            }, this.timeOut * 1000);
            let _data = '';
            res.on('data', function (chunk) {
                _data += chunk;
            });
            res.on('end', function () {
                clearTimeout(responseTimer);
                callback && callback(_data, bussOrderNum);
            });
        });
        req.write(content);
        req.on('error', function (e) {
            if (callback) {
                // callback(JSON.stringify({code:400, msg:"未知错误"}));
            }
        });
        req.end();
    },
    /**
     * 保存订单
     */
    saveBussOrderNum(bussOrderNum, callback){
        let sql = util.format("INSERT INTO %s(buss_order_num) values(%s)",'pay_order_list',SQL.escape(bussOrderNum));
        SQL.query(sql,function (err) {
            if(err){
                ERROR("订单保存失败" + sql);
                callback(false);
            }else{
                callback(true);
            }
        });
    }
};

exports = module.exports = new AliPay();