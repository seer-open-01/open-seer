/**
 * Created by wl on 2018/12/5.   使用物品固定脚本存放点
 */

let util            = require("util");
let CSProto         = require("../net/CSProto.js");

class useItem {
    // 一个月宽带
    userBroadband(player, num, cb) {
        let uid = player.uid;
        let order = this.genOrder(7, uid);
        let desc = `一个月宽带使用了${num}次，请为该账户充值${num}个月宽带`;
        if (player.user.rankMatch.netAccount === "") {
            cb(false);
            return;
        }
        this.insertSql(order, uid, 7, num, JSON.stringify({account: player.user.rankMatch.netAccount}), desc, cb);
    }

    // 一个月电视
    userTV(player, num, cb) {
        let uid = player.uid;
        let order = this.genOrder(8, uid);
        let desc = `一个月电视使用了${num}次，请为该账户充值${num}个月电视`;
        if (player.user.rankMatch.tvAccount === "") {
            cb(false);
            return;
        }
        this.insertSql(order, uid, 8, num, JSON.stringify({account: player.user.rankMatch.tvAccount}), desc, cb);
    }

    giveTV(player, num, cb) {
        let uid = player.uid;
        let order = this.genOrder(10, uid);
        let desc = `赠送大型液晶电视${num}台`;
        let addressInfo = player.user.rankMatch.addressInfo;
        if (addressInfo.address === "" || addressInfo.tell === "" || addressInfo.name === "") {
            cb(false);
            return;
        }
        this.insertSql(order, uid, 10, num, JSON.stringify(addressInfo), desc, cb);
    }

    giveSuitcase(player, num, cb) {
        let uid = player.uid;
        let order = this.genOrder(11, uid);
        let desc = `赠送超大型液晶电视${num}台`;
        let addressInfo = player.user.rankMatch.addressInfo;
        if (addressInfo.address === "" || addressInfo.tell === "" || addressInfo.name === "") {
            cb(false);
            return;
        }
        this.insertSql(order, uid, 11, num, JSON.stringify(addressInfo), desc, cb);
    }

    useMatchCard(player, param, cb) {
        let ret = gMatch.userCard(player, param);
        if (ret === CSProto.ProtoState.STATE_OK) {
            cb(true);
        } else {
            cb(false, ret);
        }
    }

    /**
     * 使用电话卡
     * @param player
     * @param num
     * @param cb
     */
    useNewBag(player, num, goodId, opts = {}, cb) {
        let uid = player.uid;
        let order = this.genOrder(goodId, uid);
        let desc = this.getDesc(goodId);
        let param = this.getParam(goodId, player, opts);
        if (Object.keys(param).length === 0) {
            cb(false);
            return;
        }
        this.insertSql(order, uid, goodId, num, JSON.stringify(param), desc, cb);
    }

    getGoodNum(player, id){
        let items = player.user.bag.items;
        let num = 0;
        for(let pos in items){
            let item = items[pos];
            if(item.id === id){
                num += item.num;
            }
        }
        return num;
    }

    insertSql(order, uid, goodId, goodNum, param, desc, cb) {
        let strTime = SQL.escape(Date.stdFormatedString());
        let sql = `INSERT INTO use_goods(order_id, uid, good_id, good_num, use_time, param, descript) value(${SQL.escape(order)},${uid},${goodId},${goodNum},${strTime},${SQL.escape(param)},${SQL.escape(desc)})`;
        SQL.query(sql, function (err) {
            if (err) {
                ERROR(`insertSql use_goods error sql: ${sql}`);
                cb(false);
            } else {
                cb(true, order, param);
            }
        })
    }

    genOrder(goodId, uid) {
        let msg = "";
        switch (goodId) {
            case 7:
                msg += "NET";
                break;
            case 8:
                msg += "TV";
                break;
            case 10:
                msg += "LCTV";
                break;
            case 11:
                msg += "SLCTV";
                break;
            case 15:
                msg += "HF1";
                break;
            case 16:
                msg += "HF5";
                break;
            case 17:
                msg += "HF10";
                break;
            case 18:
                msg += "HF20";
                break;
            case 19:
                msg += "HF50";
                break;
            case 20:
                msg += "HF100";
                break;
            case 21:
                msg += "MTV";
                break;
            case 22:
                msg += "YTV";
                break;
            case 23:
                msg += "50MNET";
                break;
            case 24:
                msg += "50YNET";
                break;
            case 25:
                msg += "100MNET";
                break;
            case 26:
                msg += "100YNET";
                break;
            case 27:
                msg += "FOOD5";
                break;
            case 28:
                msg += "FOOD10";
                break;
            case 29:
                msg += "YACHT";
                break;
            case 30:
            case 31:
            case 32:
            case 33:
                msg += "JDE";
        }
        let nowStr = Date.getStamp().toString();
        msg += nowStr;
        msg += uid;
        return msg;
    }

    getDesc(goodId) {
        let msg = "";
        switch (goodId) {
            case 15:
                msg += "手机话费1元";
                break;
            case 16:
                msg += "手机话费5元";
                break;
            case 17:
                msg += "手机话费10元";
                break;
            case 18:
                msg += "手机话费20元";
                break;
            case 19:
                msg += "手机话费50元";
                break;
            case 20:
                msg += "手机话费100元";
                break;
            case 21:
                msg += "包月有线电视";
                break;
            case 22:
                msg += "包年有线电视";
                break;
            case 23:
                msg += "50M包月有线宽带";
                break;
            case 24:
                msg += "50M包年有线宽带";
                break;
            case 25:
                msg += "100M包月有线电视";
                break;
            case 26:
                msg += "100M包年有线电视";
                break;
            case 27:
                msg += "价值5元餐饮劵";
                break;
            case 28:
                msg += "价值10元餐饮劵";
                break;
            case 29:
                msg += "游艇劵";
                break;
            case 30:
                msg += "价值1000元的京东E卡";
                break;
            case 31:
                msg += "价值2000元的京东E卡";
                break;
            case 32:
                msg += "价值3000元的京东E卡";
                break;
            case 33:
                msg += "价值4000元的京东E卡";
                break;
        }
        return msg;
    }


    getParam(goodId, player, opts = {}) {
        let data = {};
        switch (goodId) {
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20: {
                setCommContact(data, player);
                if (opts.phone && opts.phone.toString() !== "") {
                    data.phone = opts.phone.toString();
                    break;
                }
            }
            case 21:
            case 22: {
                setCommContact(data, player);
                if (player.user.bag.tvAccount !== "") {
                    data.tvAccount = player.user.bag.tvAccount;
                    break;
                }
            }
            case 23:
            case 24:
            case 25:
            case 26: {
                setCommContact(data, player);
                if (player.user.bag.netAccount !== "") {
                    data.netAccount = player.user.bag.netAccount;
                    break;
                }
            }
            case 27:
                data.desc = "5元餐饮卷";
                data.storeName = Config.GoodIDOpts[27].name;
                break;
            case 28:
                data.desc = "10元餐饮劵";
                data.storeName = Config.GoodIDOpts[28].name;
                break;
            case 29:
                data.desc = "游艇劵";
                data.storeName = Config.GoodIDOpts[29].name;
                break;
            case 30:
            case 31:
            case 32:
            case 33:
                if(!opts.phone || !opts.address || !opts.name){
                    break;
                }
                setCommContact(data, player);
                data.JDEPhone = opts.phone.toString();
                data.JDEAddress = opts.address.toString();
                data.JDEName = opts.name.toString();
                break;
        }

        // 设置公共联系人
        function setCommContact(data = {}, player) {
            if (player.user.bag.wxAccount !== "") {
                data.wxAccount = player.user.bag.wxAccount;
            }
            if (player.user.bag.phone !== "") {
                data.contactPhone = player.user.bag.phone;
            }
        }

        return data;
    }

    mailRemind(player, goodId, num = 1, order = "", param = {}) {
        let title = "礼品使用";
        let content = `您于${Date.stdFormatedString()}使用了${num}`;
        switch (goodId) {
            case 7:
                content += `张宽带卡，\n\r订单号: ${order}\n\r宽带账户: ${param.account}`;
                break;
            case 8:
                content += `张有线电视卡，\n\r订单号: ${order}\n\r电视账户: ${param.account}`;
                break;
            case 10:
                content += `张大型液晶电视券。\n\r订单号: ${order}\n\r收件人 姓名: ${param.name}， 电话:${param.tell}。\n\r地址:${param.address}`;
                break;
            case 11:
                content += `张超大型液晶电视券。\n\r订单号: ${order}\n\r收件人 姓名: ${param.name}， 电话:${param.tell}。\n\r地址:${param.address}`;
                break;
            case 15:
                content += `张1元电话费卡券，\n\r订单号: ${order}\n\r手机充值账号: ${param.phone}`;
                break;
            case 16:
                content += `张5元电话费卡券，\n\r订单号: ${order}\n\r手机充值账号: ${param.phone}`;
                break;
            case 17:
                content += `张10元电话费卡券，\n\r订单号: ${order}\n\r手机充值账号: ${param.phone}`;
                break;
            case 18:
                content += `张20元电话费卡券，\n\r订单号: ${order}\n\r手机充值账号: ${param.phone}`;
                break;
            case 19:
                content += `张50元电话费卡券，\n\r订单号: ${order}\n\r手机充值账号: ${param.phone}`;
                break;
            case 20:
                content += `张100元电话费卡券，\n\r订单号: ${order}\n\r手机充值账号: ${param.phone}`;
                break;
            case 21:
                content += `张包月有线电视券，\n\r订单号:${order}\n\r有线电视账号:${param.tvAccount}`;
                break;
            case 22:
                content += `张包年有线电视券，\n\r订单号:${order}\n\r有线电视账号:${param.tvAccount}`;
                break;
            case 23:
                content += `张50M包月有线宽带券，\n\r订单号:${order}\n\r有线宽带账号:${param.netAccount}`;
                break;
            case 24:
                content += `张50M包年有线宽带券，\n\r订单号:${order}\n\r有线宽带账号:${param.netAccount}`;
                break;
            case 25:
                content += `张100M包月有线宽带券，\n\r订单号:${order}\n\r有线宽带账号:${param.netAccount}`;
                break;
            case 26:
                content += `张100M包年有线宽带券，\n\r订单号:${order}\n\r有线宽带账号:${param.netAccount}`;
                break;
            case 27:
                content += `张价值5元的餐饮券，\n\r使用码:${order}\n\r饭店名称:${param.storeName}`;
                break;
            case 28:
                content += `张价值10元的餐饮券，\n\r使用码:${order}\n\r饭店名称:${param.storeName}`;
                break;
            case 29:
                content += `张价值4999元的豪华游艇出海观光券，使用码:${order}\n\r请前往${param.storeName}使用`;
                break;
            case 30:
                content += `张价值1000元的京东E卡，使用码:${order}\n，收件人 姓名: ${param.JDEName}， 电话:${param.JDEPhone}。\n地址:${param.JDEAddress}`;
                break;
            case 31:
                content += `张价值2000元的京东E卡，使用码:${order}\n，收件人 姓名: ${param.JDEName}， 电话:${param.JDEPhone}。\n地址:${param.JDEAddress}`;
                break;
            case 32:
                content += `张价值3000元的京东E卡，使用码:${order}\n，收件人 姓名: ${param.JDEName}， 电话:${param.JDEPhone}。\n地址:${param.JDEAddress}`;
                break;
            case 33:
                content += `张价值4000元的京东E卡，使用码:${order}\n，收件人 姓名: ${param.JDEName}， 电话:${param.JDEPhone}。\n地址:${param.JDEAddress}`;
                break;
        }
        if (goodId === 27 || goodId === 28) {
            content += `\n请前往指定餐饮吧使用！`;
        } else if (goodId === 29) {
            content += `\n请牢记您的使用码，如有疑问请咨询相关客服人员！`;
        } else {
            content += `\n请牢记您的订单号，如有疑问请咨询相关客服人员！`;
        }
        player.addMail(title, content);
    }


    gmNotice(order, result, cb) {
        let sql = util.format("SELECT * FROM %s where order_id = %s", 'use_goods', SQL.escape(order));
        SQL.query(sql, function (err, results) {
            if (err) {
                ERROR("数据库出错" + sql);
                cb(false);
            } else {
                let res = JSON.parse(JSON.stringify(results));
                if (res.length === 0) {
                    cb(false);
                }
                let info = res[0];
                let uid = info.uid;
                let goodId = info.good_id;
                let params = JSON.parse(info.param);
                PlayerMgr.getPlayerNoCreate(uid, function (player) {
                    if (player) {
                        this.noticePlayer(goodId, result, params, order, player);
                        cb(true);
                    }
                }.bind(this));
            }
        }.bind(this))
    }

    noticePlayer(goodId, res, params, order, player) {
        let title = "后台通知";
        let failMsg = res.msg;
        let result = +res.result;
        let msg = this.genNoticeMsg(result, goodId, failMsg, order);
        if(msg === "")return;
        msg += result === 1 ? `` : `\n失败原因: ${failMsg}。`;
        msg += `\n业务订单号: ${order}，如有问题请联系客服。`;
        player.addMail(title, msg);
        player.save();
    }

    // 生成消息
    genNoticeMsg(result, goodId, failMsg, order) {
        let msg = "";
        switch (goodId) {
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                msg = this.phoneWord(goodId, order, failMsg,result);
                break;
            case 21:
            case 22:
                msg = this.tvWord(goodId, order, failMsg,result);
                break;
            case 23:
            case 24:
            case 25:
            case 26:
                msg = this.netWord(goodId, order, failMsg,result);
                break;
            case 27:
            case 28:
                msg = this.foodWord(goodId, order, failMsg,result);
                break;
            case 29:
                msg = this.yachtWord(goodId, order, failMsg, result);
                break;
            case 30:
            case 31:
            case 32:
            case 33:
                msg = this.JDEWord(goodId, order, failMsg, result);
            default:
                break;
        }
        return msg;
    }

    /**
     * 电话公用词
     * @param goodID
     * @param order
     * @param failMsg
     * @returns {string}
     */
    phoneWord(goodID, order, failMsg,result) {
        let goodIdvalue = {15: 1, 16: 5, 17: 10, 18: 20, 19: 50, 20: 100};
        let msg = "";
        if (goodIdvalue[goodID]) {
            msg += `价值${goodIdvalue[goodID]}元的手机话费于${Date.stdFormatedString()}`;
        }
        msg += result === 1 ? `\n处理成功。\n请查看您的对应手机到账短信。` : `\n处理失败。`;
        return msg;
    }

    /**
     * 电视词
     * @param goodID
     * @param order
     * @param failMsg
     * @returns {string}
     */
    tvWord(goodID, order, failMsg,result) {
        let goodIdvalue = {21: 26, 22: 312};
        let goodIdTime = {21: "(1月)", 22: "(1年)"};
        let msg = "";
        if (goodIdvalue[goodID]) {
            msg += `价值${goodIdvalue[goodID]}元的有线电视收视费${goodIdTime[goodID]}于${Date.stdFormatedString()}`;
        }
        msg += result === 1 ? `\n使用审核完毕,请查看您的有线电视到账信息。` : `\n使用审核失败。`;
        return msg;
    }

    /**
     * 使用网络电视
     * @param goodID
     * @param order
     * @param failMsg
     */
    netWord(goodID, order, failMsg,result) {
        let goodIdvalue = {23: "36元的50M宽带使用费(1月)", 24: "432元的50M宽带使用费(1年)", 25: "50元的100M宽带使用费(1月)", 26:"600元的100M宽带使用费(1年)"};
        let msg = "";
        if (goodIdvalue[goodID]) {
            msg += `价值${goodIdvalue[goodID]}于${Date.stdFormatedString()}`;
        }
        msg += result === 1 ? `\n使用审核完毕，请查看您的有线宽带到账信息。` : `\n使用审核失败。`;
        return msg;
    }

    /**
     * 餐饮卷
     * @param goodID
     * @param order
     * @param failMsg
     * @param result
     */
    foodWord(goodID, order, failMsg,result){
        return "";
    }

    /**
     * 游艇
     * @param goodID
     * @param order
     * @param failMsg
     * @param result
     */
    yachtWord(goodID, order, failMsg,result){
        let msg = result === 1 ? `价值4999元的豪华游艇出海观光券于${Date.stdFormatedString()}\n使用审核完毕` : `价值4999元的豪华游艇出海观光券于${Date.stdFormatedString()}\n使用审核失败。`;
        return msg;
    }

    /**
     * 京东E卡
     * @param goodID
     * @param order
     * @param failMsg
     * @param result
     * @constructor
     */
    JDEWord(goodID, order, failMsg,result){
        let goodIdvalue = {30: "1000元的京东E卡", 31: "2000元的京东E卡(1年)", 32: "3000元的京东E卡", 33:"4000元的京东E卡"};
        let msg = "";
        if (goodIdvalue[goodID]) {
            msg += `价值${goodIdvalue[goodID]}于${Date.stdFormatedString()}`;
        }
        msg += result === 1 ? `\n使用审核完毕，请您及时关注京东E卡的相关到账信息。` : `\n使用审核失败。`;
        return msg;
    }
}
module.exports = new useItem();