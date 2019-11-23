let http              = require('http');
let CommFuc           = require("../util/CommonFuc.js");
let CSProto           = require("../net/CSProto.js");

class SeerManager {

    constructor() {
        this.seerHost = "127.0.0.1";   // SEER 服务器地址
        this.seerPort = 5698;          // seer 服务器端口
        this.timeOut = 500;            // 超时请求
        this.SCTime = 300 * 1000;      // 每隔xx时间更新下平台数据
        this.todayMaxWith = 400 * 10000;// 每日提取最大SEER
        this.minWithdraw = 4 * 10000;   // 每次最小的提币数量

        // 以下是配置数据
        this.default = {};
        this.default.RegisterInfo = {};      // 默认注册人
        this.default.ReferrerInfo = {};      // 默认推荐人
        this.default.referrer_percent = 20;  // 默认推荐人返还的比例
        this.default.coinType = "SEER";      // 默认货币类型
        this.default.assetId = "1.3.0";      // 默认资产ID 也就是SEER

        this.precision = 5;                  // 精度值(这个值只有SEER服务器改了才会改 否则永远别去改)
        this.minGuaranty = 100 * 10000;      // 创建文体平台最小保证金

        this.createSCPlayer = {seerAccount: "", seerAccountId: "", gameAccount: ""};    // 创建文体平台的玩家账号信息:注意 游戏账号必须和seer 对应
        this.keys = {};                      // 秘钥数组
        this.users = {};                     // 玩家数组
        this.scData = null;                  // 文体平台数据
        this.GMUID = null;                   // GM的uid必须是注册过的
        this.curBlock = 0;                   // 当前活动块
        this.updateBlocktime = 3;            // 活动间隔
        this.BlockSche = null;               // 活动间隔函数
    }

    /**
     * 初始化配置
     */
    intCfg(){
        this.createSCPlayer = Config.SEER.createSCPlayer;
        this.GMUID = Config.SEER.GMUID;
        this.default.referrer_percent = Config.SEER.referrer_percent;  // 默认推荐人返还的比例
        this.default.RegisterInfo = Config.SEER.RegisterInfo;
        this.default.ReferrerInfo = Config.SEER.ReferrerInfo;
    }
    /**
     * http请求
     * @param data
     * @param callback
     */
    getUrl(data,callback){
        let post_data = JSON.stringify(data);
        let options = {
            host: this.seerHost,
            port: this.seerPort,
            path: "/",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': post_data.length
            }
        };
        // 请求超时
        let requestTimer = setTimeout(function () {
            req.abort();
            callback && callback(JSON.stringify({error:{message:"请求超时"}}));
            ERROR('......请求超时......');
        }, this.timeOut * 1000);

        let req = http.request(options, function (res) {
            clearTimeout(requestTimer);
            // 响应超时
            let responseTimer = setTimeout(function () {
                res.destroy();
                callback && callback(JSON.stringify({error:{message:"响应超时"}}));
                console.log('......Response Timeout......');
            },this.timeOut * 1000);

            let _data = '';
            res.on('data', function (chunk) {
                _data += chunk;
            });
            res.on('end', function () {
                clearTimeout(responseTimer);
                callback && callback(_data);
            });
        }.bind(this));
        req.write(post_data);
        req.on('error', function (e) {
            clearTimeout(requestTimer);
            if (callback) {
                callback(JSON.stringify({error:{message:"请求出现错误"}}));
            }
        });
        req.end();
    }

    /**
     * 发送消息
     * @param data
     * @param callback
     */
    sendMsg(data, callback){
        if(typeof(data) !== "object"){
            return;
        }
        data.jsonrpc = "2.0";
        data.id = 1;
        this.getUrl(data, callback);
    }

    /**
     * 移除精度发往客户端
     * @param num(传入的值是 没有小数点的)
     */
    removePrecision(num){
        num = +num;
        let divNum = Math.pow(10, this.precision);
        let result = CommFuc.accDiv(num, divNum);
        return result;
    }

    /**
     * 增加精度
     */
    addPrecision(num){
        num = +num;
        let mulNum = Math.pow(10, this.precision);
        let result = num * mulNum;
        return +result.toFixed(0);
    }

    /**
     * 增加私钥
     */
    addKey(privateKey, publicKey){
        this.keys[privateKey] = publicKey;
    }
    /**
     * 获取钱包里面已经导入的key
     */
    getBagKeys(callback){
        let args = {
            method:"dump_private_keys",
            params:[]
        }
        this.sendMsg(args, (data)=>{
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback();
                return;
            }
            if(res.result){
                let len = res.result.length;
                for(let i = 0; i < len; i++){
                    this.addKey(res.result[i][1], res.result[i][0]);
                }
            }
            callback && callback();
        })
    }
    /**
     * 钱包导入默认的秘钥
     * @constructor
     */
    ImportDefalutKey(){
        if(!this.keys[this.default.RegisterInfo.privateKey]) {
            this.importKey(this.default.RegisterInfo.account, this.default.RegisterInfo.privateKey, null);
        }
        if(!this.keys[this.default.ReferrerInfo.privateKey]) {
            this.importKey(this.default.ReferrerInfo.account, this.default.ReferrerInfo.privateKey, null);
        }
    }

    /**
     * 每次重启服务器同步玩家的信息
     * @constructor
     */
    restartServerSyncPlayerSeerInfo(){
        for(let openId in PlayerMgr.plats){
            let uid = PlayerMgr.plats[openId];
            (function (uid) {
                PlayerMgr.getPlayerNoCreate(uid, (player)=>{
                    if(player){
                        this.ImportPlayerKey(player);
                        this.addUserInfo(player);
                    }
                });
            }.bind(this))(uid);
        }
    }

    /**
     * 导入玩家的key
     * @param player
     * @constructor
     */
    ImportPlayerKey(player){
        let SEER = player.user.SEER;
        if(SEER && SEER.privateKey !== "" && SEER.account !== "" && !this.keys[SEER.privateKey]){
            this.importKey(SEER.account, SEER.privateKey, null);
        }
    }

    addUserInfo(player){
        let SEER = player.user.SEER;
        if(SEER.account !== "" && SEER.id !== ""){
            this.users[player.uid] = {seerId: SEER.id, seerAccount: SEER.account};
            this.setActivateSeer(player);
            player.setSeerUpdate();
        }
    }

    /**
     * 通过SEER ID 获取玩家的uid
     */
    getUidByAccountId(seerId){
        for(let uid in this.users){
            let one = this.users[uid];
            if(seerId === one.seerId){
                return +uid;
            }
        }
        return null;
    }

    getSeerAccountBySeerId(seerId){
        for(let uid in this.users){
            let one = this.users[uid];
            if(seerId === one.seerId){
                return one.seerAccount;
            }
        }
        return null;
    }

    /**
     * 通过uid 获取seerId
     * @param uid
     * @returns {string|*}
     */
    getSeerIdByUid(uid){
        let user = this.getUser(uid);
        if(user){
            return user.seerId;
        }
    }

    getScData(callback){
        this.getSCByAccount((data)=>{
            if(data){
                this.scData = data;
                callback && callback(true);
            }else{
                this.scData = null;
                callback && callback(false);
            }
        })
    }
    /**
     * 初始化平台数据
     */
    initSCData(){
        this.getBagKeys(()=>{
            this.ImportDefalutKey();
            this.getScData((success)=>{
                if(success){
                    this.restartServerSyncPlayerSeerInfo();
                }else{
                    ERROR("未创建文体平台，请先创建文体平台");
                }
            });
        })
    }

    setActivateSeer(player){
        this.getSCBeanByUid(player.uid, (success, num) => {
            if(success){
                player.activateSeer(true);
            }else{
                player.activateSeer(false);
            }
            player.save();
        })
    }

    /**
     * 升级为终身会员
     * @param accountName
     */
    upgradeAccount(accountName, callback){
        let args = {
            method:"upgrade_account",
            params:[accountName, true]
        }
        this.sendMsg(args, function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false, "升级到终身会员失败");
                return;
            }
            if(res.error){
                ERROR("升级到终身会员失败: " + res.error.message);
                callback && callback(false, res.error.message);
            }else{
                let fee = res.result.operations[0][1]["fee"].amount;
                fee = this.removePrecision(fee);
                let msg = `${accountName} 升级到终身会员成功: 手续费 ${fee}, 第二天早上8点生效`;
                ERROR(msg);
                callback && callback(true, msg);
            }
        })
    }

    /**
     * 生成密钥对
     */
    genKey(callback) {
        let data = {method: "suggest_brain_key", params: []}
        this.sendMsg(data,function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                let msg = "生成秘钥错误";
                callback && callback(false, msg);
                return;
            }
            if(res.error) {
                let msg = "生成秘钥错误: " + res.error.message;
                callback && callback(false, msg);
            }else{
                callback && callback(true, res.result);
            }
        }.bind(this))
    }
    /**
     * 真正的注册账号
     * @param accountName
     * @param pub_key
     * @param callback
     */
    realRegisAccount(accountName, pub_key, callback){
        let args = {
            method: "register_account",
            params: [accountName, pub_key, pub_key, this.default.RegisterInfo.account, this.default.ReferrerInfo.account, this.default.referrer_percent, true]
        };
        this.sendMsg(args, function(data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false, "账户中含有非法字符");
                return;
            }
            if(res.error) {
                ERROR("注册账号错误 " + res.error.message);
                callback && callback(false, res.error.message);
            }else{
                callback && callback(true);
            }
        }.bind(this));
    }


    /**
     * 导入私钥
     */
    importKey(accountName,wif_priv_key,callback){
        let args = {
            method:"import_key",
            params:[accountName, wif_priv_key]
        }
        this.sendMsg(args,function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false, "导入私钥错误");
                return;
            }
            if(res.error) {
                let msg = "导入私钥错误" + res.error.message;
                ERROR(msg);
                callback && callback(false, msg);
            }else{
                callback && callback(true);
            }
        }.bind(this))
    }

    /**
     * 获取账户ID
     * @param accountName
     */
    getAccountId(accountName, callback){
        let args = {
            method:"get_account_id",
            params:[accountName]
        }
        this.sendMsg(args,function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch(e){
                callback && callback(false, "账户中含有非法字符");
                return;
            }
            if(res.result) {
                callback && callback(true, res.result);
            }else{
                let msg = res.error ? res.error.message : "";
                callback && callback(false, "获取账号id失败 账号: " + msg);
            }
        }.bind(this))
    }

    /**
     * 注册账户
     */
    registerAccount(accountName, callback) {
        this.getAccountId(accountName,function (success, result) {
            if(success && result){
                callback(false,"账号已存在");
            }else{
                this.genKey(function (success, result) {
                    if (success) {
                        let brain_priv_key = result.brain_priv_key;
                        let pub_key = result.pub_key;
                        let wif_priv_key = result.wif_priv_key;
                        this.realRegisAccount(accountName, pub_key, function (success, result) {
                            if(success){
                                this.importKey(accountName,wif_priv_key,function (success, result) {
                                    if(success){
                                        this.getAccountId(accountName, function (success, result) {
                                            if(success){
                                                callback && callback(true,{brain_priv_key,pub_key,wif_priv_key,id:result});
                                            }else{
                                                callback && callback(false, result);
                                            }
                                        }.bind(this));
                                    }else{
                                        callback && callback(false, result);
                                    }
                                }.bind(this))
                            }else{
                                callback && callback(false, result);
                            }
                        }.bind(this))
                    } else {
                        callback && callback(false, result);
                    }
                }.bind(this));
            }
        }.bind(this));
    }
    /**
     * 获取账户余额
     */
    getAccountBalances(accountName, callback){
        let args = {
            method:"list_account_balances",
            params:[accountName]
        }
        this.sendMsg(args,function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false,"账号不存在");
                return;
            }
            if(res.result){
                if(res.result.length === 0){
                    callback(true, 0);
                }else{
                    for(let idx in res.result){
                        let info = res.result[idx];
                        if(info.asset_id === this.default.assetId){
                            let num = this.removePrecision(info.amount);
                            callback(true, num);
                        }
                    }
                }
            }else{
                callback(false,"账号不存在");
            }
        }.bind(this));
    }

    /**
     * 转账
     * @param form
     * @param to
     * @param num
     * @param callback
     */
    transfer(form, to, num, callback){
        let args = {
            method:"transfer",
            params:[form, to, num, this.default.coinType,`${form} to ${to} ${num} SEER`, true]
        }
        this.sendMsg(args,function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false, "转账失败: ");
                return;
            }
            if(res.result) {
                let serverCost = res.result.operations[0][1]["fee"].amount;
                serverCost = this.removePrecision(serverCost);
                callback && callback(true, serverCost);
                if(serverCost){
                    ERROR(`转账成功收取${form} ${serverCost} 手续费`);
                }
            }else{
                callback && callback(false, "转账失败: " + res.error.message);
            }
        }.bind(this));
    }

    /**
     * 创建文体平台
     * @param desc          说明
     * @param guaranty      保证金
     */

    createSC(desc, guaranty, callback){
        if(guaranty < this.minGuaranty){
            callback && callback(false, `最小保证金不能少于${this.minGuaranty}`);
            return;
        }
        if(this.scData){
            callback && callback(false, "平台已经创建 无需再次创建");
            return false;
        }
        this.getAccountBalances(this.createSCPlayer.seerAccount, (success, result)=> {
            if(success){
                if(result < guaranty){
                    callback && callback(false, "资金不足");
                }else{
                    guaranty = this.addPrecision(guaranty);
                    let args = {
                        method:"sc_platform_create",
                        params:[this.createSCPlayer.seerAccount, desc, guaranty, [this.default.coinType], true]
                    }
                    this.sendMsg(args, (data)=> {
                        let res = null;
                        try{
                            res = JSON.parse(data);
                        }catch (e) {
                            callback(false, "创建文体平台失败: 描述不能有汉字");
                            return;
                        }
                        if(res.result){
                            let serverCost = res.result.operations[0][1]["fee"].amount;
                            serverCost = this.removePrecision(serverCost);
                            callback(true, "平台创建成功", serverCost);
                            this.getScData();
                        }
                    });
                }
            }else{
                callback && callback(false, result);
            }
        });
    }

    /**
     * 更新文体平台
     * @param callback
     */
    updateSC(finaData, callback){
        if(finaData.guaranty < this.minGuaranty){
            callback(false, `平台更新失败,保证金必须大于 ${this.minGuaranty}`);
            return false;
        }
        this.getScData((success)=>{
            if(success){
                let offset = finaData.guaranty - this.scData.guaranty;
                offset = +this.addPrecision(offset);
                let args = {
                    method:"sc_platform_update",
                    params:[this.createSCPlayer.seerAccount, this.scData.scId, finaData.description, offset, null, true]
                }
                this.sendMsg(args, (ret)=> {
                    let res = null;
                    try {
                        res = JSON.parse(ret);
                    }catch (e) {
                        callback(false, "平台更新失败");
                        return;
                    }
                    if(res.error){
                        callback(false, "平台更新失败" + res.error.message);
                    }else{
                        let serverCost = res.result.operations[0][1]["fee"].amount;
                        serverCost = this.removePrecision(serverCost);
                        callback(true, serverCost);
                    }
                });
            }else{
                if(!this.scData){
                    callback && callback(false, "无法获取平台数据");
                    return false;
                }
            }
        })

    }

    /**
     * 检测操作
     */
    checkOperate(command){
        let msg = "成功";
        let status = this.scData.status;
        switch (command) {
            case 0:
                if(status === 0){
                    msg = "平台当前状态为停止新用户划转，无需再次操作";
                }
                break;
            case 1:
                if(status === 1){
                    msg = "平台当前状态已开启新用户划转，无需再次操作";
                }
                break;
        }
        return msg;
    }
    /**
     * 操作平台
     */
    OperateSC(command, callback){
        if(!this.scData){
            callback && callback(false, "无法获取平台数据");
            return false;
        }
        let args = {
            method : "sc_platform_deal",
            params : [this.scData.owner, this.scData.scId, command, [], true]
        }
        let msg = this.checkOperate(command);
        if(msg !== "成功"){
            callback && callback(false, msg);
            return;
        }
        this.sendMsg(args, (ret)=> {
            let res = null;
            try {
                res = JSON.parse(ret);
            }catch (e) {
                callback && callback(false, "平台操作失败");
                return;
            }
            if(res.error){
                callback && callback(false, "平台操作失败" + res.error.message);
            }else{
                let serverCost = res.result.operations[0][1]["fee"].amount;
                serverCost = this.removePrecision(serverCost);
                callback && callback(true, "操作成功", serverCost);
                this.scData.status = command;
            }
        });
    }
    /**
     * 玩家划转资金到平台
     * @param seerAccount
     * @param num
     */
    transferSC(player, num, callback){
        let seerAccount = player.user.SEER.account;
        if(!this.scData){
            callback && callback(false, "无法获取平台数据");
            return false;
        }
        this.getAccountBalances(seerAccount, (success, curNum)=> {
            if(success){
                if(curNum < num){
                    callback && callback(false, "余额不足");
                }else{
                    num = this.addPrecision(num);
                    let args = {
                        method: "sc_platform_participate",
                        params: [seerAccount, this.scData.scId, {amount:num, "asset_id":this.default.assetId}, true]
                    }
                    this.sendMsg(args, (data)=> {
                        let res = null;
                        try {
                            res = JSON.parse(data);
                        }catch (e) {
                            callback && callback(false, "资金划转失败: ");
                            return;
                        }
                        if(res.result){
                            let serverCost = res.result.operations[0][1]["fee"].amount;
                            serverCost = this.removePrecision(serverCost);
                            this.AsyncBoxBean(player);
                            this.asyncSCBean(player);
                            player.activateSeer(true);
                            callback && callback(true, "划转成功", {serverCost});
                        }else {
                            ERROR(res.error.message);
                            callback && callback(false, "资金划转失败: " + res.error.message);
                        }
                    });
                }
            }else{
                callback && callback(false, "无法获取账户余额信息");
            }
        })
    }

    /**
     * 资金从SC平台划转给用户
     * @param player
     * @param callback
     */
    returnSC(player, callback){
        let seerAccount = player.user.SEER.account;
        let seerAccountId = player.user.SEER.id;
        if(seerAccountId === "" || seerAccount === ""){
            callback && callback(false, "该账号未绑定SEER账号");
            return false;
        }
        if(!this.scData){
            callback && callback(false, "无法获取平台数据");
            return false;
        }
        this.TempBeanToSc(player, false, (success, msg)=>{
            if(success){
                let args = {
                    method: "sc_platform_deal",
                    params: [this.createSCPlayer.seerAccount, this.scData.scId, 2,[[seerAccountId,[this.default.assetId]]], true]
                }
                this.sendMsg(args, (data)=> {
                    let res = null;
                    try {
                        res = JSON.parse(data);
                    }catch (e) {
                        callback && callback(false, "未知错误");
                        return;
                    }
                    if(res.error){
                        ERROR("赎回资产发生了错误 : " + res.error.message);
                        callback && callback(false, "账户没有余额、未授权账户或其他错误");
                    }else{
                        let serverCost = res.result.operations[0][1]["fee"].amount;
                        serverCost = this.removePrecision(serverCost);
                        player.setSCBean(0);
                        player.setTempBean(0);
                        this.asyncSCBean(player);
                        this.AsyncBoxBean(player);
                        this.asyncSCBean(this.GMUID);
                        this.AsyncBoxBean(this.GMUID);
                        callback && callback(true, "赎回成功", serverCost);
                    }
                })
            }else{
                callback && callback(false, "未授权账户,或GM账户余额不足");
            }
        });
    }

    /**
     * 平台内部划转
     * @param player
     * @param target
     * @param callback
     */
    updateBeanBySC(origin, target, num, callback){
        this.checkTransferSC(origin, target, (success, num1, num2, scId)=>{
            if(success){
                if(num > num1){
                    callback && callback(false, "划转失败,划转方平台金额不足");
                    return;
                }
                let id1 = this.getSeerIdByUid(origin);
                let id2 = this.getSeerIdByUid(target);
                num = this.addPrecision(num);
                let args = {
                    method:"sc_platform_divide",
                    params:[this.createSCPlayer.seerAccount, this.scData.scId,
                        [
                            {
                                payer:this.getSeerIdByUid(origin),
                                asset_id:this.default.assetId,
                                divide_amount:num,
                                comment:`${id1} give ${id2}: ${num} seer by ${scId}`,
                                receivers:[
                                    [id2, num]
                                ]
                            }
                        ],
                        true
                    ]
                }
                this.sendMsg(args, (data)=>{
                    let res = null;
                    try {
                        res = JSON.parse(data);
                    }catch (e) {
                        callback && callback(false, "未知错误");
                        return;
                    }
                    if(res.result){
                        this.sendSCNum(origin);
                        this.sendSCNum(target);
                        callback && callback(true);
                    }
                })
            }else{
                callback && callback(false, "划转失败,请确保转入方和转出方都授权了平台划转");
            }
        })
    }

    getUser(uid){
        return this.users[uid];
    }

    /**
     * 检测是够能内部划转
     * @param uid
     * @param target
     */
    checkTransferSC(uid, target, callback) {
        this.getSCBeanByUid(uid, (success1, num1) => {
            if(success1){
                this.getSCBeanByUid(target, (success2, num2)=>{
                    if(success2){
                        callback(true, num1, num2);
                    }else{
                        callback(false);
                    }
                })
            }else{
                callback(false);
            }
        })
    }
    /**
     * 通过uid获取平台划转情况
     * @param uid
     */
    getSCBeanByUid(uid, callback){
        if(!this.scData){
            callback && callback(false, "无法获取平台数据");
            return false;
        }

        let user = this.getUser(uid);
        if(user){
            let seerId = user.seerId;
            let args = {
                method:"list_sc_records_by_account",
                params:[seerId]
            }
            this.sendMsg(args, (data)=>{
                let res = null;
                try {
                    res = JSON.parse(data);
                }catch (e) {
                    callback && callback(false);
                    return;
                }
                if(res.error){
                    callback && callback(false);
                }else{
                    if(res.result.length === 0){
                        callback && callback(false);
                        return;
                    }
                    let yes =  this.isSameSC(this.scData.scId, res.result[0]);
                    if(!yes){
                        callback && callback(false);
                        return;
                    }
                    let num = this.getSCDefaultAssetIdNum(res.result[0].balance);
                    num = this.removePrecision(num);
                    callback && callback(true, num);
                }
            })
        }else{
            callback && callback(false);
        }
    }

    /**
     * 检测是否是相同的平台
     * @param scId
     * @param data
     */
    isSameSC(scId, data){
        return data.sc_platform === scId;
    }

    /**
     * 发送平台余额给客户端
     */
    sendSCNum(uid){
        PlayerMgr.getPlayerNoCreate(uid, (player)=>{
            if(player){
                player.sendMsgToClient(CSProto.ProtoID.GAME_MIDDLE_CLIENT_UPDATE_MONEY,{
                    bean: this.getPlayerBean(player),
                    card: player.user.status.card,
                    diamond: player.user.status.diamond
                })
            }
        })
    }
    /**
     * 发送账户余额给客户端
     * @param seerAccount
     */
    sendBoxNum(uid){
        PlayerMgr.getPlayerNoCreate(uid, (player)=>{
            if(player){
                player.sendMsgToClient(CSProto.ProtoID.MIDDLE_CLIENT_UPDATE_SEER_MONEY,{
                    boxBean: this.getPlayerBoxBean(player)
                })
            }
        })
    }
    /**
     * 获取文体平台数据
     * @param accountName
     */
    getSCByAccount(callback){
        let args = {
            method:"get_sc_platform_by_account",
            params:[this.createSCPlayer.seerAccountId]
        }
        this.sendMsg(args, function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false);
                return;
            }
            if(!res.result){
                callback && callback(false);
            }else{
                let backInfo = this.getBackInfo(res.result);
                callback && callback(backInfo);
            }
        }.bind(this));
    }

    /**
     * 获取平台记录
     */
    getSCTransferRecords(startId, callback){
        if(!this.scData){
            callback && callback(false, "无法获取平台数据");
            return false;
        }
        let args = {
            method:"list_sc_records_by_platform",
            params:[this.scData.scId, startId, 1000]
        }
        this.sendMsg(args,(data) =>{
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false, "出现了未知错误");
                return;
            }
            if(res.error){
                let msg = res.error.message;
                ERROR(msg);
                callback && callback(false, msg);
            }else{
                let records = this.reRecords(res.result);
                callback && callback(true, "成功", records);
            }
        })
    }

    /**
     * 整合划转信息
     */
    reRecords(data){
        let records = [];
        let len = data.length;
        for(let i = 0; i < len; i++){
            let one = data[i];
            let uid = this.getUidByAccountId(one.player);
            // let account = this.getSeerAccountBySeerId(one.player);
            let num = this.getSCDefaultAssetIdNum(one.balance);
            num = this.removePrecision(num);
            if(uid) {
                records.push({uid, num});
            }
        }
        return records;
    }

    getSCDefaultAssetIdNum(balance){
        for(let idx in balance){
            let one = balance[idx];
            if(one[0] === this.default.assetId){
                return one[1];
            }
        }
        return 0;
    }
    /**
     * 信息重组传给客户端
     */
    getBackInfo(result){
        let data = {};
        if(result){
            data.scId = result.id;                              // 平台id
            data.owner = this.createSCPlayer.seerAccount;       // 平台创建者
            data.description = result.description;  // 平台描述
            data.guaranty = this.removePrecision(result.guaranty);        // 保证金
            data.status = result.status;    // 平台状态 0停止新用户划转 1启动新用户划转
            data.users = result.users;      // 平台划转的用户数量
        }
        return data;
    }

    /**
     * 设置GM的bean数量
     */
    setGMSC(){
        this.getSCBeanByUid(this.GMUID, (success, num)=>{
            if(success){
                PlayerMgr.getPlayerNoCreate(this.GMUID,(player)=>{
                    player.setSCBean(num);
                })
            }
        })
    }

    /**
     * 获取玩家身上的bean
     * @param player
     * @returns {number}
     */
    getPlayerBean(player){
        let SEER = player.user.SEER;
        if(SEER){
            if(player.uid === this.GMUID){
                return SEER.scBean;
            }else {
                return SEER.tempBean + SEER.scBean;
            }
        }
        return 0;
    }


    /**
     * 更新玩家身上的bean 这里面玩家的真实货币其实应该是没有加也没有减
     */
    TempBeanToSc(player, send = true, callback = null){
        let SEER = player.user.SEER;
        let origin = this.GMUID;
        let target = player.uid;
        if(SEER.tempBean === 0){
            callback && callback(true);
            return;
        }
        if(SEER.tempBean < 0){
            origin = player.uid;
            target = this.GMUID;
        }
        // GM自己不能给自己转  所以临时值直接忽略
        if(origin === target){
            callback && callback(true);
            return;
        }
        this.updateBeanBySC(origin, target, Math.abs(SEER.tempBean), (success)=>{
            if(success){
                player.setTempBean(0);
                this.setGMSC();
                this.getSCBeanByUid(player.uid, (success, num)=> {
                    if (success) {
                        player.setSCBean(num);
                        callback && callback(true);
                    }
                });
            }else{
                callback && callback(false);
            }
        })
        if(send) {
            this.sendSCNum(player.uid);
        }
    }
    /**
     * 相当于保险箱(这个 可以每次进游戏去更新数据，因为没有涉及到费率问题)
     * @param player
     * @returns {number}
     */
    getPlayerBoxBean(player){
        let SEER = player.user.SEER;
        if(SEER){
            return SEER.boxBean;
        }
        return 0;
    }

    /**
     *  同步保险箱里面的seer
     */
    AsyncBoxBean(player){
        let account = player.user.SEER.account;
        if(account !== "") {
            this.getAccountBalances(account,(success, num)=>{
                if(success){
                    player.user.SEER.boxBean = num;
                    this.sendBoxNum(player.uid);
                }
            })
        }
    }

    /**
     * 同步sc里面的数据
     * @param player
     */
    asyncSCBean(player){
        this.getSCBeanByUid(player.uid, (success, num) => {
            if(success) {
                player.setSCBean(num);
                this.sendSCNum(player.uid);
            }
        })
    }

    /**
     * 判断是否能提币
     * @param player
     * @param reqArgs
     * @returns {string}
     */
    checkIsCanWithdraw(player, reqArgs){
        reqArgs.beforeExtendBeans = ExtendMgr.getTGPrifit(player.uid);                // 提现前推广的金豆数量
        let maxWithdraw = this.todayMaxWith;                                          // 每日提取的最大seer
        let todayWithdraw = ExtendMgr.getTodayWithdraw(player.uid);                   // 获取今日已提
        if(todayWithdraw >= maxWithdraw){
            return "今日提币已达上线";
        }
        if(reqArgs.beforeExtendBeans <= 0){
            return "暂无推广金豆！";
        }
        reqArgs.num = Math.min(maxWithdraw - todayWithdraw, reqArgs.beforeExtendBeans); // 提币金额

        if(reqArgs.num < this.minWithdraw){
            let wSeer = CommFuc.wBean(this.minWithdraw)
            return `每次提币不能少于${wSeer}万SEER！`;
        }
        return "success";
    }

    withdrawSEER(player, num){
        let data = {id:1, num, eventId: CSProto.eveIdType.SEER_WITHDRAW};
        player.updateBean(data);
        player.addSeerWithdraw(num);


        // wsConn.sendMsg({code: ProtoID.CLIENT_MIDDLE_WITHDRAW_PFC, args: {address: data.to_account, pfcAmount:data.out_amount}});
        ExtendMgr.withdraw(num, player);
    }

    /**
     * 获取历史记录
     * @param account
     */
    getHistoryRecord(account, callback){
        let args = {
            method:"get_account_history",
            params:[account, 50]
        }
        this.sendMsg(args, function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false, "获取失败");
                return;
            }
            if(!res.result){
                callback && callback(false, "获取失败");
            }else{
                let words = "";
                for(let i in res.result){
                    words += res.result[i].description + "\n\r";
                }
                callback && callback(true, words);
            }
        }.bind(this));
    }

    getCurBlock(callback){
        let args = {
            method:"info",
            params:[]
        }
        this.sendMsg(args, function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                callback && callback(false);
                return;
            }
            if(!res.result){
                callback && callback(false);
            }else{
                callback && callback(true,res.result.head_block_num);
            }
        }.bind(this));
    }

    /**
     * 获取当前块信息
     */
    getBlockInfo(){
        let args = {
            method:"get_block",
            params:[this.curBlock]
        }
        this.sendMsg(args, function (data) {
            let res = null;
            try {
                res = JSON.parse(data);
            }catch (e) {
                return;
            }
            if(res.result && res.result.transactions){
                let transactions = res.result.transactions;
                let len = transactions.length;
                for(let i = 0; i < len; i++){
                    let info = transactions[i];
                    if(info.operations){
                        let operLen = info.operations.length;
                        for(let j = 0; j < operLen; j++){
                            let operInfo = info.operations[j];
                            if(operInfo){
                                let code = operInfo[0];
                                let content = operInfo[1];
                                this.parseOper(code, content);
                            }
                        }
                    }
                }
                this.curBlock++;
            }else{
                if(this.BlockSche) {
                    clearInterval(this.BlockSche);
                    this.BlockSche = null;
                    this.updateCurblock();
                }
            }
        }.bind(this));
    }

    /**
     * 解析块上的code
     * @param code
     * @param info
     */
    parseOper(code, info){
        if(code === 0){
            if(info.amount && info.amount.asset_id === this.default.assetId){
                let fromUid = this.getUidByAccountId(info.from);
                let toUid = this.getUidByAccountId(info.to);
                if(fromUid){
                    PlayerMgr.getPlayerNoCreate(fromUid,(player)=>{
                        if(player){
                            this.AsyncBoxBean(player);
                        }
                    })
                }
                if(toUid){
                    PlayerMgr.getPlayerNoCreate(toUid,(player)=>{
                        if(player){
                            this.AsyncBoxBean(player);
                        }
                    })
                }
            }
        }
    }
    /**
     * 每隔N监控当前块高
     */
    updateCurblock(){
        this.getCurBlock((success, curBlock)=>{
            if(success){
                this.curBlock = curBlock;
                this.BlockSche = setInterval(this.getBlockInfo.bind(this), this.updateBlocktime * 1000);
            }
        })
    }

    open(){
        if(Config.isOpenSEER) {
            this.intCfg();
            this.initSCData();
            this.updateCurblock();
        }
    }
};

module.exports = new SeerManager();
