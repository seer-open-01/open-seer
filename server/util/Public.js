////////////////////////////////////////////////////////////////////////////////////////////////
// 发起微信公众号请求测试消息（测试用）
let http        = require('http');
let https       = require('https');
let qs          = require('querystring');
let util        = require('util');
/* 大便机器人
let appID       = "wx6c03af58752fa086";
let appsecret   = "be3903b4a216779132db6513f9af7df0";
let EncodingAeSkey = "be3903b4a216779132db6513f9af7df0";
let token = "10_LviIGcFoVzkhiv_ewR9HXcgYsdME2tcjizcHutEsL_7xL6Fh8rb0SG2JYdx3695ew5f0kQ-WPDNAbXlifQNjRp6fXgjHU6974WfHac5jHWqinIIMl-V3JClBWOliD7WcT5fPECmKwzLT3SINHALhADAXQB"; // 2小时过期
*/
// 测试公众号
let appID      = "wx8c5ab7dd6f487e0a";
let secret     = "2dbd69165120713a5db54475c6b9097c";
let token      = "10_0vpqq5-Y-xqckCK2n0IhGaq0rAdVehdhuqVQX1jO22dTT2NnoGPlmAadXDsV8uXqO9BCQpP82YZtD6Ng0n8GWFHBZo_xt3a4tC7UOR77VL8oOryPBK3fL2IRcYP5idGSO-7BnehBSOqoXMU5MMWbABACCM";
let media_id = "03TxiNEO2YujVlh8bQ9K9H5WcKe27hXFwxcymld3dpSnBLkWl9AbmV4ZtAb49PAl";
requestWx = function (access_token, params, type, callback) {
    // get方式请求
    let resp = {};
    if(type == 1) {
        let argsContent = null;
        if (params != null) {
            argsContent = qs.stringify(params)
        }
        //let url = util.format("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s", appID,appsecret);   //获取 token
        //let url = util.format("https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=%s", access_token);   // 删除菜单
        // let url = util.format("https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=%s", access_token); // 获取微信ip地址列表
        https.get(url, function (res) {
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
                if (!gameResp) {
                    console.log("消息格式错误");
                } else {
                    if(gameResp.errmsg != "ok"){
                        console.log(gameResp.errmsg);
                    }else{
                        console.log("操作成功");
                    }
                }
                callback && callback(resp);
            });
        }).on('error', function (e) {
            resp.code = 1;
            callback && callback(resp);
        });
    }else if(type == 2){                                            // post方式获取
        // 添加客服账号
        // let body = {"kf_account" : "w18011434130","nickname" : "客服1","password" : "pswmd5"};
        let body = {"action_name": "QR_LIMIT_SCENE", "action_info":{"uid" : 100000}};
        let bodyString = JSON.stringify(body);
        let headers = {
            'Content-Type': 'application/json',
            'Content-Length': bodyString.length
        };
        let options = {
            host: 'api.weixin.qq.com',
            path: '/cgi-bin/qrcode/create?access_token=' + access_token,
            post:443,
            method: 'POST',
            headers:headers
        };
        let req = https.request(options, function(res) {
            res.setEncoding('utf-8');
            let responseString = '';
            res.on('data', function(data) {
                responseString += data;
            });
            res.on('end', function() {
                //这里接收的参数是字符串形式,需要格式化成json格式使用
                let resultObject = JSON.parse(responseString);
                console.log('-----resBody-----',resultObject);
            });
            req.on('error', function(e) {
                console.log('-----error-------',e);
            });
        });
        req.write(bodyString);
        req.end();
    }
};
// 获取token、菜单删除、微信服务器列表
// requestWx(token, null, 1, null);
// 添加客服
// 获取二维码ticket
//requestWx(token, null, 2, null);
// 根据ticket 获取二维码图片
requestWx(token, null, 1, null);

/*
 -----resBody----- { ticket: 'gQGw8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyR1RDalFTYV9lNmoxMDAwMDAwMzcAAgTrtxBbAwQAAAAA',
 url: 'http://weixin.qq.com/q/02GTCjQSa_e6j100000037' }
 */
