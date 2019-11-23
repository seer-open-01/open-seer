////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 支付宝请求付款
require("./Date.js");
let https        = require('https');
let http         = require('http');
let crypto       = require('crypto');
let CryptoJS     = require("crypto-js");
let qs           = require('querystring');
let CSProto      = require('../net/CSProto.js');
let CommFuc      = require("../util/CommonFuc.js");
let utf8         = require('utf8');

function PFCMgr() {
    this.timeOut = 60;                                                     // 超时时间
    this.reqPost = 9000;                                                   // 请求端口
    this.beanToPFC = 10000;                                                // 金豆到PFC比例
    this.minWithdraw = 100;                                                // 最小提币(PFC)
    this.reqType = {
                query:"/api/v1/saiya/query",                               // 查询
                bind:"/api/v1/saiya/bind",                                 // 绑定
                rebind_account:"/api/v1/saiya/rebind_account",             // 重新绑定
                recharge:"/saiya/recharge",                                // 充值
                withdraw:"/api/v1/saiya/withdraw"                          // 提现
             };
}

PFCMgr.prototype = {
    /**
     *
     */
    initCfg(){
        this.key = "ke4Ff1KVLg6KvM2vb7ksVvcys+ocfZBTqG9No8vg7aI=";
        this.reqHost = "139.198.12.20";
        this.encoding_key_d = Buffer.from(this.key, 'base64');                 // 重组key
        this.iv = this.encoding_key_d.slice(0, 16);                            // 获取iv
    },
    /**
     * 测试PFC
     */
    testPFC(callback){
        let data = {ts:1534521749, nonce:"092713", address:"0xD10fbC84D1884015fd67255ED6446F45747DE520"};
        let sign = this.genSign(data, this.reqType.query);
        data.sig = sign;
        let formData = this.jsonToFormData(data);
        this.getUrl(formData,this.reqType.query, callback);
    },
    /**
     * 绑定PFC
     * @param openID
     */
    bindPFC(openID,callback){
        let data = {saiya_account_id:openID, address_type:"erc20", ts:Date.getStamp()}
        let sign = this.genSign(data, this.reqType.bind);
        data.sig = sign;
        let formData = this.jsonToFormData(data);
        this.getUrl(formData,this.reqType.bind, callback);
    },
    /**
     * 查询PFC绑定情况 http://139.198.5.241:9000/api/v1/saiya/query?saiya_account_id=w1&address_type=erc20
     * @param openID
     * @param address
     */
    queryPFC(openID, callback){
        let data = {saiya_account_id:openID, address_type:"erc20", ts:Date.getStamp()};
        let sign = this.genSign(data, this.reqType.query);
        data.sig = sign;
        console.log(data);

        this.getReq(this.reqType.query, data, callback);
    },
    /**
     * 重新绑定(目前我们的游戏没有这个功能)
     * @param oldOpenID
     * @param newOpenID
     * @param callback
     */
    reBindPFC(oldOpenID, newOpenID, callback){
        let data = {saiya_account_id:newOpenID, saiya_account_id_old:oldOpenID, address_type:"erc20", ts:Date.getStamp()};
        let sign = this.genSign(data, this.reqType.rebind_account);
        data.sig = sign;
        let formData = this.jsonToFormData(data);
        this.getUrl(formData, this.reqType.rebind_account, callback);
    },
    /**
     * 是否是唯一的seq
     * @param seq
     */
    isOneSeq(seq, type, callback){
        let sql = "";
        if(type === "recharge"){
            sql = `SELECT seq FROM pfc_recharge_log`;
        }else if(type === "withdraw"){
            sql = `SELECT seq FROM pfc_withdraw_log`;
        }
        SQL.query(sql, (err, results)=>{
            if(err){
                ERROR("isOneReq error sql: " + sql);
                callback && callback(false);
            }else{
                let res = JSON.parse(JSON.stringify(results));
                let len = res.length;
                for(let i = 0; i < len; i++){
                    if(seq === res[i].seq){
                        callback && callback(false);
                    }
                }
                callback && callback(true);
            }
        })
    },
    /**
     * 充值
     * @param OpenId
     * @param amount
     * @param callback
     */
    rechargePFC(query,httpRes){
        let account = query.saiya_account_id;
        let amount = query.amount;
        let sig = query.sig;
        let pathname = "/" + query.pathname;
        delete query.sig;
        delete query.pathname;
        let localSig = this.genSign(query, pathname);
        if(sig != localSig && pathname === "/api/saiya/v1/assets/recharge"){
            this.endReq({code: 9001, msg: "sig error"}, httpRes);
            return;
        }
        let uid = PlayerMgr.getUidByAccount(account);
        if(uid){
            PlayerMgr.getPlayerNoCreate(uid,(player)=>{
                if(player){
                    let beanAmount = Math.floor(CommFuc.accMul(amount, this.beanToPFC));
                    let record = {num:beanAmount, eventId:CSProto.eveIdType.PFC_RECHARGE};
                    player.updateBean(record);
                    player.addPFCRechargeRecord(query, beanAmount);
                    query.uid = uid;
                    this.insertRechargeLogToMysql(query);
                    player.save();
                    // todo 邮件通知
                    this.endReq({code: 0, msg: "ok", data:{account_id:account, address:player.user.PFC.address}}, httpRes);
                }else{
                    this.endReq({code: 9001, msg: "invalid access"}, httpRes);
                }
            })
        }else{
            this.endReq({code: 9001, msg: "invalid access"}, httpRes);
        }
    },
    /**
     * 插入日志到mysql
     * @param query
     */
    insertRechargeLogToMysql(query){
        let data = clone(query);
        let sql = `INSERT INTO  pfc_recharge_log (uid, account_id, asset_name, address_type, amount, seq, tx_from, tx_to, tx_hash, ts,
         time) VALUES (${data.uid}, ${SQL.escape(data.saiya_account_id)}, ${SQL.escape(data.asset_name)}, 
         ${SQL.escape(data.address_type)},${SQL.escape(data.amount)},${SQL.escape(data.seq)},${SQL.escape(data.tx_from)},
         ${SQL.escape(data.tx_to)}, ${SQL.escape(data.tx_hash)}, ${data.ts}, ${SQL.escape(Date.stdFormatedString())})`;
        SQL.query(sql,(err)=>{
            if(err){
                if(err){
                    ERROR("Insert sql fail sql: " + sql);
                }
            }
        })
    },
    /**
     * 插入记录
     * @param params
     * @param player
     */
    insertWithdrawLog(params, player, cb){
        params.afterBeans = gSeer.getPlayerBean(player);
        params.afterExtendBeans = ExtendMgr.getTGPrifit();
        let sql = `INSERT INTO  pfc_withdraw_log (uid, to_chain, in_asset_name, in_amount, out_asset_name, out_amount, seq, txid, process_status,
         type, before_beans, before_extend_beans, with_amount, brokerage, after_beans, after_extend_beans,status,time,address) VALUES (
         ${player.uid},
         ${SQL.escape("")},
         ${SQL.escape("")},
         ${SQL.escape("")},
         ${SQL.escape("")},
         ${SQL.escape("")},
         ${SQL.escape(params.seq)},
         ${SQL.escape("")},
         ${SQL.escape("")},
         ${params.type},
         ${params.beforeBeans},
         ${params.beforeExtendBeans},
         ${params.withdrawAmount},
         ${params.brokerage},
         0,
         0,
         0,
         ${SQL.escape(Date.stdFormatedString())},
         ${SQL.escape(params.address)}
         )`;
        SQL.query(sql,(err)=>{
            if(err){
                ERROR("Insert sql fail sql: " + sql);
                cb(false);
            }else{
                cb(true);
            }
        })
    },
    /**
     * 增加提现记录
     * {"to_account":"0x7E0ACafaa1FFF99F0Bbe1B32CcA0B6fd1E10BdE2","to_chain":"erc20","in_asset_name":"pfc","in_amount":"0.01","out_asset_name":"0x65999a03ed1abfc1ab97fcafdf77fa477aeae272","out_amount":"0.01","seq":0,"txid":"0x856f8df6a679b4bd4b1196a0fead5207195317f7240a872b8ec9c82556f5bd5c","process_status":"auto_out_processed"}
     * {"seq":"1562738726767100042","type":2}
     * @param data
     * @param params
     * @param uid
     */
    UpdateWithdrawLog(data, params, player){
        params.afterBeans = gSeer.getPlayerBean(player);
        params.afterExtendBeans = ExtendMgr.getTGPrifit();
        let sql = `UPDATE pfc_withdraw_log SET 
                    to_chain = ${SQL.escape(data.to_chain)}, 
                    in_asset_name = ${SQL.escape(data.in_asset_name)},
                    in_amount = ${SQL.escape(data.in_amount)},
                    out_asset_name = ${SQL.escape(data.out_asset_name)},
                    out_amount = ${SQL.escape(data.out_amount)},
                    txid = ${SQL.escape(data.txid)},
                    process_status = ${SQL.escape(data.process_status)},
                    after_beans = ${params.afterBeans},
                    after_extend_beans = ${params.afterExtendBeans},
                    status = 1
                    WHERE seq=${SQL.escape(params.seq)}`;
        SQL.query(sql,(err)=>{
            if(err){
                ERROR("UpdateWithdrawLog sql fail sql: " + sql);
            }
        })
    },
    /**
     * 切换PFC提现地址
     * @param player
     */
    swithAddress(player){
        let PFC = player.user.PFC;
        let address = PFC.withdrawAddress[PFC.addressIndex]
        if(address){
            PFC.addressIndex = ++PFC.addressIndex % PFC.withdrawAddress.length;
            return address;
        }else{
            return "";
        }
    },
    /**
     * 获取最大可提金额
     * @param uid
     * @returns {*}
     */
    getMaxWithdraw(uid){
        let value = 0;
        let lv = ExtendMgr.getProxyLv(uid, 1);
        let cfg = GlobalInfo.globalData.extendCfg.nodeCfg[lv - 1];
        if(!cfg){
            value = GlobalInfo.globalData.extendCfg.baseMaxWithDraw;
        }else{
            value = cfg.maxWithDraw;
        }

        value = value * this.beanToPFC;
        return value;
    },
    /**
     * 检测是否能币
     * @param player
     * @param data
     */
    checkIsCanWithdraw(player, reqArgs){
        if(player.user.PFC.withdrawIng){
            return "正在提现中！";
        }
        if(!reqArgs.address){
            return "提现地址为空";
        }
        reqArgs.beforeBeans = gSeer.getPlayerBean(player);
        reqArgs.beforeExtendBeans = ExtendMgr.getTGPrifit(player.uid);                // 提现前推广的金豆数量
        reqArgs.withdrawAmount = +reqArgs.amount || 0;                                // 提现的金豆数量
        let maxWithdraw = this.getMaxWithdraw(player.uid);
        let todayWithdraw = ExtendMgr.getTodayWithdraw(player.uid);                          // 获取今日已提
        if(todayWithdraw >= maxWithdraw){
            return "今日提币已达上线";
        }
        if(reqArgs.type === 2){
            if(reqArgs.beforeExtendBeans <= 0){
                return "暂无推广金豆！";
            }
            reqArgs.withdrawAmount = Math.min(maxWithdraw - todayWithdraw, reqArgs.beforeExtendBeans); // 提币金额
        }else if(reqArgs.type === 1){
            if(reqArgs.beforeBeans < reqArgs.withdrawAmount){
                return "金豆不足";
            }
        }
        if(reqArgs.withdrawAmount < CommFuc.accMul(this.minWithdraw, this.beanToPFC)){
            return `每次提币不能少于${this.minWithdraw}PFC！`;
        }
        /*  // todo 功能做好在加上
        if(player.user.PFC.password === "" || reqArgs.password != player.user.PFC.password){
            return `提币密码错误！`;
        }
        */
        reqArgs.brokerage = ExtendMgr.getBrokerage(reqArgs.withdrawAmount);                 // 手续费
        reqArgs.beanAmount = CommFuc.accSub(reqArgs.withdrawAmount, reqArgs.brokerage);     // 实际提了多少金豆
        return "success";
    },
    /**
     * 提现
     * @param openId
     * @param amount
     * @param memo
     * @param callback
     */
    withdrawPFC(player,args, callback){
        args.pfcAmount = CommFuc.accDiv(args.beanAmount, this.beanToPFC);
        let data = {
                        saiya_account_id:player.user.info.openId,
                        address_type:"erc20",
                        asset_name:"pfc",
                        amount:args.pfcAmount,
                        memo:this.genMemo(args.address),
                        ts:Date.getStamp(),
                        seq:this.genOrder(player.uid)
                    };
        let sign = this.genSign(data, this.reqType.withdraw);
        data.sig = sign;
        let formData = this.jsonToFormData(data);
        args.seq = data.seq;
        this.insertWithdrawLog(args, player,function (success) {
            if(success){
                player.addPFCWithdraw(0,args);
                // this.analogWithdraw(args, callback);                              // 模拟提现
                this.getUrl(formData, this.reqType.withdraw, callback, args);        // todo 上线了再打开
            }
        }.bind(this));
    },
    /**
     * 设置密码
     * @param player
     * @param data
     */
    setPassword(player, data){
        let sms = data.sms;
        let tell = data.tell;
        let password = data.password;
        let verfiy = GlobalInfo.getSms(tell);
        if(tell.length != 11){
            return CSProto.ProtoState.STATE_PHONE_ERROR;
        }
        if(password.length != 6){
            return CSProto.ProtoState.STATE_PHONE_PASSWORD_LIMITE;
        }
        if(verfiy != tell){
            return CSProto.ProtoState.STATE_SMS_ERROR;
        }
        player.setPFCPassword(password);
        return CSProto.ProtoState.STATE_OK;
    },
    /**
     * 模拟提现
     * @param args
     * @param callback
     */
    analogWithdraw(args, callback){
        let data = {
                "to_account":"地址",
                "to_chain":"模拟",
                "in_asset_name":"pfc",
                "in_amount":args.pfcAmount,
                "out_asset_name":"模拟",
                "out_amount":args.pfcAmount,
                "seq":args.seq,
                "txid":"模拟",
                "process_status":"模拟"
        }
        callback(JSON.stringify({code:0, msg:"模拟提现", data}), args);
    },
    /**
     * 拼接memo
     * @param address
     * @returns {string}
     */
    genMemo(address){
        return "erc20" + "#" + address;
    },
    /**
     * 生成订单
     * @returns {string}
     */
    genOrder(uid){
        let str = "";
        let now = Date.now();
        let order = str + now + uid;
        return order;
    },
    /**
     * Json数据转FormData表单
     * @param data
     * @returns {FormData}
     */
    jsonToFormData(data){
        let content = qs.stringify(data);
        return content;
    },

    /**
     * 生成签名
     * @param data
     */
    genSign(tab, reqPath){
        tab = this.sortByCollections(tab);
        let str = "";
        for (let key in tab) {
            let value = tab[key];
            str += key + value;
        }
        str = reqPath + str;
        let sign = this.ase(str);
        return sign;
    },
    /**
     * ase加密
     * @param str
     * @returns {*}
     */
    ase:function (plaintext) {
        // 方法1（有些不行）
        // let encoding_key_d64 = CryptoJS.enc.Base64.parse(this.key).toString();
        // let aes_key = CryptoJS.enc.Hex.parse(encoding_key_d64);
        // let aes_iv = CryptoJS.enc.Hex.parse(encoding_key_d64.substring(0,32));
        // let srcs = CryptoJS.enc.Utf8.parse(plaintext);
        // let encrypted = CryptoJS.AES.encrypt(srcs, aes_key, { iv: aes_iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
        // let sign = CryptoJS.SHA1(encrypted.ciphertext).toString();
        // return sign;
        // 方法2
        plaintext = utf8.encode(plaintext);
        let padding_size  = 32 - plaintext.length % 32;
        let padding_str   = Buffer.alloc(padding_size, padding_size);
        let str_to_sign   = plaintext + padding_str;
        let cipher      = crypto.createCipheriv("aes-256-cbc", this.encoding_key_d, this.iv);
        let encrypted   = cipher.update(str_to_sign, 'binary');
        let sha1        = crypto.createHash('sha1');
        let str_digest  = sha1.update(encrypted).digest('hex');
        return str_digest;
    },


    stringToBase64(str){
        let base64Str = new Buffer(str).toString('base64');
        return base64Str;
    },

    base64ToString(base64Str){
        let str = new Buffer(base64Str,'base64').toString();
        return str;
    },
    /**
     * 根据键值排序
     */
    sortByCollections(tbl) {
        let oT = Object.keys(tbl).sort();
        let nT = {};
        for (let i = 0; i < oT.length; i++) {
            nT[oT[i]] = tbl[oT[i]];
        }
        return nT;
    },
    /**
     * 获取 qr_code
     * @param callback
     * @constructor
     */
    getUrl: function (formData, reqPath, callback, params) {
        let options = {
            host: this.reqHost,
            port: this.reqPost,
            path: reqPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': formData.length
            }
        };

        // 请求超时
        let requestTimer = setTimeout(function () {
            req.abort();
            callback && callback(JSON.stringify({code: 401, msg: "请求超时"}));
            ERROR('......请求超时......');
        }, this.timeOut * 1000);

        let req = http.request(options, function (res) {
            clearTimeout(requestTimer);
            // 响应超时
            let responseTimer = setTimeout(function () {
                res.destroy();
                callback && callback(JSON.stringify({code:401, msg:"......响应超时......"}));
                console.log('......Response Timeout......');
            },this.timeOut * 1000);

            let _data = '';
            res.on('data', function (chunk) {
                _data += chunk;
            });
            res.on('end', function () {
                clearTimeout(responseTimer);
                callback && callback(_data, params);
            });
        }.bind(this));
        req.write(formData);
        req.on('error', function (e) {
            clearTimeout(requestTimer);
            if (callback) {
                callback(JSON.stringify({code:400, msg:"未知错误"}));
            }
        });
        req.end();
    },
    /**
     * 查询接口
     * @param data
     * @constructor
     */
    getReq(reqPath, args, callback){
        let url = "";
        let formData = "";
        if(args != null){
            args.address_type = "erc20";
            formData = this.jsonToFormData(args);
        }
        url = `http://${this.reqHost}:${this.reqPost}${reqPath}?${formData}`;
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
        });
    },

    endReq(json, httpRes) {
        if(httpRes) {
            httpRes.end(JSON.stringify(json));
        }
    }
};

PFCM = new PFCMgr();
PFCM.initCfg();
PFCM.queryPFC("w1", function(obj){
	if(obj){
		console.log(JSON.stringify(obj));
	}
})
