let http        = require('http');
let https       = require('https');
let util        = require("util");
let qs          = require('querystring');
let crypto      = require('crypto');
let xml2js      = require('xml2js');
let builder     = new xml2js.Builder();
let parser      = new xml2js.Parser();
let url         = require("url");
let CommFuc     = require("./util/CommonFuc.js");

/**
 * 请求函数
 * @param action
 * @param args
 * @param type
 * @param callback
 */
exports.requestGame = function (action, args, type, path, callback) {
    if(type == 1){
        let resp = {};
        let url =  `http://ip.taobao.com/service/getIpInfo.php?ip=${args.ip}`;
        http.get(url, function(res) {
            let resData = "";
            res.on("data", function (data) {
                resData += data;
            });
            res.on("end", function () {
                let gameResp = null;
                try {
                    gameResp = JSON.parse(resData);
                } catch (error) {
                    gameResp = null;
                }
                callback && callback(gameResp);
            });
        }).on('error', function (e) {
            resp.code = 1;
            callback && callback(resp);
        });
    }else if(type == 2){
        let appid = "wx8206107c32b11915";
        let mch_id = "1482797432";
        let body = "游戏充值";
        let nonce_str = randomString();
        let sign = genSign(appid,body,mch_id,nonce_str);

        let xml = builder.buildObject({
            appid : appid,                                             // appid
            mch_id : mch_id,                                           // 商户号
            nonce_str: nonce_str,                                      // 随机字符串
            sign : sign,                                               // 签名
            body : body,                                               // 商品描述
            out_trade_no:gen_out_trade_no(),                           // 商户订单号
            total_fee: 0.01,                                           // 总金额
            spbill_create_ip:'192.168.3.22',                           // 用户终端ip wsconn 上获取的ip地址
            notify_url:'http://esmj.ngrok.cc/wx_pay',                  // 通知url地址
            trade_type:'APP',                                          // 交易类型
        });
        let options = {
            host: 'api.mch.weixin.qq.com',
            path: '/pay/unifiedorder',
            post:443,
            method: 'POST',
        };
        let req = https.request(options, function(res) {
            res.setEncoding('utf8');
            let str = "";
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                parser.parseString(chunk,function (err,result) {
                    let return_code = result.xml.return_code[0];
                    let return_msg = result.xml.return_msg[0];
                    let int = 10;
                })
            });
            let y = 10;
        });
        req.write(xml);
        req.end()
    }else if(type == 3){
        if(typeof(path) === "function"){
            callback = path;
            path = '/wallet/index.php/home/Callback/';
        }
        ERROR("----------------" + JSON.stringify(args));
        let enStr = CommFuc.phpEncode(JSON.stringify(args));
        args = {enStr: enStr};
        let content=qs.stringify(args);
        let requestTimer = setTimeout(function () {
            req.abort();
            callback && callback(JSON.stringify({code:401, msg:"请求超时"}));
            console.log('......Request Timeout......');
        },Config.bscMaxTime);
        let options = {
            host: addrConfig.BackHost,
            port: 80,
            path: path + action,
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Content-Length':content.length
            }
        };

        let req = http.request(options, function(res) {
            clearTimeout(requestTimer);
            let responseTimer = setTimeout(function () {
                res.destroy();
                callback && callback(JSON.stringify({code:401, msg:"请求超时"}));
                console.log('......Response Timeout......');
            },Config.bscMaxTime);
            let _data = '';
            res.on('data', function(chunk){
                _data += chunk;
            });
            res.on('end', function(){
                clearTimeout(responseTimer);
                callback && callback(_data);
            });
        });
        req.write(content);
        req.on('error', function (e) {
            if (callback) {
                // callback(JSON.stringify({code:400, msg:"未知错误"}));
            }
        });
        req.end();
    }
};
/**
 * 生成随机字符
 * @returns {string}
 */
function randomString() {
    let len = Math.floor(Math.random() * 22) + 10;
    let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    let maxPos = $chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
}
/**
 * md5加密
 * @param str
 * @returns {*}
 */
function md5(str) {
    let md5sum = crypto.createHash("md5");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}
/**
 * 生成商户订单号
 * @param uid
 * @returns {string}
 */
function gen_out_trade_no(uid) {
    let stamp = (new Date()).getTime();
    let str = "";
    return str+stamp+uid;
}
/**
 * 生成微信签名
 * @param appid
 * @param body
 * @param mch_id
 * @param nonce_str
 * @returns {string}
 */
function genSign(appid,body,mch_id,nonce_str) {
    let stringA="appid="+appid+"&body="+body+"&mch_id="+mch_id+"&nonce_str="+nonce_str;
    let stringSignTemp=stringA+"&key=VJMy38Pj6UIP83YJblJ1HL12VstRCcM1";
    let sign=md5(stringSignTemp).toUpperCase();
    return sign;
}


