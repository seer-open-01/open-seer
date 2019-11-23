let http        = require('http');
let qs          = require('querystring');
let Common      = require("../util/CommonFuc");
let xml2js      = require('xml2js');
let parser      = new xml2js.Parser();


function sendSms(tell, callback) {
    let code = getCodeByNum(4);
    let timeOut = 60;
    let data = {
        sname: 'dlczycs0',
        spwd:"dlczycs0123",
        scorpid:'',
        sprdid:1012818,
        sdst:tell,
        smsg:`尊敬的用户，您的验证码是：${code} 【紫琼麻将】`
    };

    let content = qs.stringify(data);

    let options = {
        hostname: 'cf.51welink.com',
        port: 80,
        path: '/submitdata/Service.asmx/g_Submit',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };

    let requestTimer = setTimeout(function () {
        req.abort();
        callback && callback(JSON.stringify({code: 401, msg: "请求超时"}));
        console.log('......Request Timeout......');
    }, timeOut * 1000);

    let req = http.request(options, function (res) {
        clearTimeout(requestTimer);
        let responseTimer = setTimeout(function () {
            res.destroy();
            callback && callback(JSON.stringify({code: 401, msg: "请求超时"}));
            console.log('......Response Timeout......');
        }, timeOut * 1000);
        let _data = '';
        res.on('data', function (chunk) {
            _data += chunk;
        });
        res.on('end', function () {
            clearTimeout(responseTimer);
            parser.parseString(_data,function (err,result) {
                let return_code = result.CSubmitState.State[0];
                callback && callback(return_code, code);
            });
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


function getCodeByNum(num) {
    num = Math.max(0, num);
    let min = Math.pow(10, num - 1);
    let max = (min * 10) - 1;
    return Common.rand(min, max);
}

module.exports.sendSms = sendSms;