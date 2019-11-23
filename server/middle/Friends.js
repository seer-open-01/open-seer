/**
 * Created by wl on 2018/11/9. 好友系统
 */
let CommFuc         = require("../util/CommonFuc.js");
let CSProto         = require("../net/CSProto");

class Friends {
    constructor(){
        this.users = {};                                        // 保存在mongdo的数据
        this.msgMaxRecord = 30;                                 // 消息最大记录
        this.giveBeanMax = 200;                                 // 每日最大的赠送金豆数
        this.giveBeanCount = 3;                                 // 每天赠送的最大金豆次数
        this.saveTime = 60 * 2;                                 // 保存好友系统的时间
        this.onlineState = {online:1, offline: 2, gameIng:3};   // 在线状态
        this.refreshTimeOpt = 60;                               // 刷新最优一批的时间间隔
        this.activeLv = {1:24 * 3600, 2: 72 * 3600};            // 玩家活跃等级配置 一天前上线 或者正在上线的是最活跃 3天前上线的是一般活跃  之后为不活跃
        this.noticeMax = 30;                                    // 通知保留的最大条数

        this.noticeType = {TEXT:1, APPLY:2, GIVE:3};            // 消息类型     1文本     2好友申请类 3送金豆
        this.applyState = {NONE:0, AGREE:1, REJECT:2};          // 申请类回执   0没有操作 1已同意     2已拒绝
        this.giveState =  {WAIT_RECEIVE:0, AGREE:1, REJECT:2};  // 送金豆回执   0等待领取 1已领取     2已拒绝
    }

    init(cb){
        MongoFriends.findOne({_id: "friends"}, {}, function (err, res) {
            if (!err) {
                if(!res || !res.values){
                    this.loadPlatData();
                    setTimeout(function () {
                        this.save();
                    }.bind(this), 3000);
                    this.todayGive = [];
                }else{
                    this.loadPlatData();
                    this.users = res.values;
                    this.todayGive = res.giveBeanInfo || [];                                    // 今日赠送
                    this.initState();
                }
                setInterval(function () {
                    this.save();
                }.bind(this), this.saveTime * 1000);
                cb(true);
            }else{
                cb(false);
            }
        }.bind(this));
    }

    loadPlatData(){
        for(let openid in PlayerMgr.plats){
            let uid = PlayerMgr.plats[openid];
            (function (uid, sys) {
                PlayerMgr.getPlayerNoCreate(uid, function (player) {
                    if(player) {
                        sys.updateUserLoginInfo(player, true);
                    }else{
                        if(sys.users[uid]){
                            delete sys.users[uid];
                        }
                    }
                }.bind(this));
            })(uid, this)
        }
    }

    save(cb){
        MongoFriends.update({_id:"friends"}, {$set:{values:this.users, giveBeanInfo:this.todayGive}}, function(err){
            if(err){
                ERROR("save friends fail" + err.message);
                cb && cb(false);
            }else{
                DEBUG('friends save Complete');
                cb && cb(true);
            }
        }.bind(this));
    }

    initState(){
        for(let uid in this.users){
            let user = this.users[uid];
            if(user){
                if(user) {
                    user.state = this.onlineState.offline;
                }
                if(user.refresh && user.info){
                    user.refresh.findList = [];
                    user.refresh.pastList = this.initPastList(user);
                }
            }
        }
    }

    initPastList(user){
        let array = [];
        for(let uid in user.friendList){
            array.push(+uid);
        }
        array.push(user.info.uid);
        return array;
    }


    updateUserLoginInfo(player, isDB){
        let uid = player.uid;
        let state = this.onlineState.online;
        if(isDB){
            state = this.onlineState.offline;
        }
        let pUser = player.user;
        let info = {name:pUser.info.name, headPic:pUser.info.headPic, offTime:pUser.marks.loginTime, uid:uid, sex:pUser.info.sex, ip:pUser.marks.loginIP, bean:gSeer.getPlayerBean(player), weChat:pUser.info.signature};
        if(!this.users[uid]){
            this.users[uid] = {};
        }
        let user = this.users[uid];
        user.info = info;
        user.state = state;
        user.curChatTarget = 0;
        user.bigTag = 0;
        this.checkFullData(user);
    }

    checkFullData(user){
        let now = Date.getStamp();
        if(!user.refresh){              // 刷新相关数据
            user.refresh = {};
            user.refresh.time = now;
            user.refresh.pastList = this.initPastList(user);
            user.refresh.findList = [];
        }
        if(!user.friendList){
            user.friendList = {};
        }
        if(!user.notice){
            user.notice = {};
            user.notice.noticeContent = {};
            user.notice.noticeId = 1000;
            user.notice.newMsg = false;
        }
    }

    setLogoutTime(player){
        let uid = player.uid;
        let user = this.users[uid];
        if(user && user.info){
            user.info.offTime = player.user.marks.logoutTime;
            user.state = this.onlineState.offline;
        }
    }

    openFriends(player){
        let uid = player.uid;
        let now = Date.getStamp();
        if(!this.users[uid]){
            this.updateUserLoginInfo(player);
        }
        let user = this.users[uid];
        let refresh = user.refresh;
        if(now - refresh.time >= this.refreshTimeOpt){
            refresh.pastList = this.initPastList(user);
            refresh.time = now;
        }
        if(refresh.findList.length === 0) {
            refresh.findList = this.getOptUser(user.refresh.pastList);
        }
        this.setCurChatTarget(user, 0);
        let list = this.combinationList(refresh.findList, user);
        let friendRed = this.checkFriendRed(user);
        let noticeRed = user.notice.newMsg;
        if(user.bigTag === 0) {
            this.sendTagRed(uid, 1, friendRed);
            this.sendTagRed(uid, 2, noticeRed);
        }
        this.setTag(user, 1);
        return {list:list};
    }

    setTag(user, tag){
        user.bigTag = tag;
    }

    combinationList(findList, user){
        let len = findList.length;
        let list = [];
        for(let idx = 0; idx < len; idx++){
            let aUid = findList[idx];
            let info = this.users[aUid].info;
            info.isFriend = user.friendList[aUid] ? true : false;
            if(info){
                list.push(info);
            }
        }
        return list;
    }

    sendWorldRed(uid){
        let red = false;
        let user = this.users[uid];
        if(user){
            if(this.checkFriendRed(user)){
                red = true;
            }
            if(!red) {
                red = user.notice.newMsg;
            }
        }
        PlayerMgr.getPlayerNoCreate(uid, function (player) {
            if(player){
                let conn = player.getConn();
                if(conn) {
                    conn.sendMsg({code: CSProto.ProtoID.MIDDLE_CLIENT_WORLD_RED, args: {red: red}})
                }
            }
        }.bind(this));
    }

    checkFriendRed(user){
        let red = false;
        for(let uid in user.friendList){
            let newMsg = user.friendList[uid].newMsg;
            if(newMsg){
                red = true;
                break;
            }
        }
        return red;
    }

    getOptUser(exUser){
        let now = Date.getStamp();
        let lv1 = [], lv2 = [], lv3 = [];
        for(let idx in this.users){
            let user = this.users[idx];
            let info = user.info;
            if(user.state == this.onlineState.online){
                lv1.push(info);
            }else{
                let offTime = info.offTime;
                if(now - offTime <= this.activeLv[1]){
                    lv1.push(info);
                }else if(now - offTime <= this.activeLv[2]){
                    lv2.push(info);
                }else{
                    lv3.push(info);
                }
            }
        }
        let results = [];
        this.getUserByLv(lv1,6,exUser,results);
        this.getUserByLv(lv2,6,exUser,results);
        this.getUserByLv(lv3,6,exUser,results);
        for(let idx in results){
            let rUid = results[idx];
            if(exUser.indexOf(rUid) === -1) {
                exUser.push(rUid);
            }
        }
        return results;
    }

    changeBatch(player, isFirst){
        let uid = player.uid;
        let user = this.users[uid];
        let list = [];
        let refresh = user.refresh;
        if(user){
            let pastList = refresh.pastList;
            let friendList = user.friendList;
            for(let uid in friendList){
                if(pastList.indexOf(+uid) === -1){
                    pastList.push(+uid);
                }
            }
            refresh.findList = this.getOptUser(pastList);
            if(refresh.findList.length === 0 && isFirst){
                refresh.pastList = this.initPastList(user);
                refresh.time = Date.getStamp();
                return this.changeBatch(player, false);
            }
            list = this.combinationList(refresh.findList, user);
        }
        return list;
    }

    search(player, data){
        let uid = player.uid;
        let user = this.users[uid];
        if(!user){
            return CSProto.ProtoID.STATE_FAILED;
        }
        let target = data.target;
        let targetUser = this.users[target];
        if(!targetUser){
            return CSProto.ProtoID.PLAYER_NOT_FIND;
        }
        let info = clone(targetUser.info);
        info.isFriend = user.friendList[target] ? true : false;
        return info;
    }

    getUserByLv(lv, num, exUser, results){
        if(results.length >= num){
            return;
        }
        let randomIds = CommFuc.getRandomIdx(lv);
        let len = randomIds.length;
        for(let idx = 0; idx < len; idx++){
            let xb = randomIds[idx];
            let user = lv[xb];
            if(exUser.indexOf(user.uid) === -1){
                results.push(user.uid);
            }
            if(results.length >= num){
                break;
            }
        }
    }

    checkApplyFriend(user, targetUser){
        let target = targetUser.info.uid;
        let uid = user.info.uid;
        if(user.friendList[target]){
            return CSProto.ProtoState.ALREADY_FRIENDS;
        }
        let noticeContent = targetUser.notice.noticeContent;
        for(let nId in noticeContent){
            let notice = noticeContent[nId];
            if(notice){
                if(notice.type === this.noticeType.APPLY){
                    if(notice.subType === this.applyState.NONE){
                        if(notice.param.reqUid == uid){
                            return CSProto.ProtoState.ALREADY_ADD_FRIENDS;
                        }
                    }
                }
            }
        }
        return CSProto.ProtoState.STATE_OK;
    }

    applyFriend(player,data){
        let uid = player.uid;
        let target = data.target;
        let user = this.users[uid];
        let targetUser = this.users[target];
        if(!user || !targetUser){
            return CSProto.ProtoState.STATE_FAILED;
        }
        if(uid === target){
            return CSProto.ProtoState.STATE_NO_ADD_SELF;
        }
        let ret = this.checkApplyFriend(user, targetUser);
        if(ret != CSProto.ProtoState.STATE_OK){
            return ret;
        }
        this.addNotice(targetUser,this.noticeType.APPLY,this.applyState.NONE, `请求加你为好友`,user.info.name, {reqUid:uid});
        return ret;
    }

    checkApplyResult(user, reqUid, agree){
        if(user.friendList[reqUid] && agree){
            return CSProto.ProtoState.ALREADY_FRIENDS;
        }
        return CSProto.ProtoState.STATE_OK;
    }

    applyResult(uid, data){
        let nId = data.noticeId;
        let agree = data.agree;
        let user = this.users[uid];
        if(!user){
            return CSProto.ProtoState.STATE_FAILED;
        }
        let notice = user.notice.noticeContent[nId];
        if(!notice){
            return CSProto.ProtoState.STATE_FAILED;
        }
        if(notice.type !== this.noticeType.APPLY){
            return CSProto.ProtoState.STATE_FAILED;
        }
        if(notice.subType !== this.applyState.NONE){
            return CSProto.ProtoState.STATE_FAILED;
        }
        let reqUid = notice.param.reqUid;
        let reqUser = this.users[reqUid];
        if(!reqUser){
            return CSProto.ProtoState.STATE_GAME_PARAM_ERROR;
        }
        let ret = this.checkApplyResult(user, reqUid, agree);
        if(ret != CSProto.ProtoState.STATE_OK){
            return ret;
        }

        if(agree){
            this.addFriend(uid, reqUid);
            notice.subType = this.applyState.AGREE;
            this.addNotice(reqUser, this.noticeType.TEXT, 0, `同意了你的好友申请`,user.info.name, null);
        }else{
            this.addNotice(reqUser, this.noticeType.TEXT, 0, `拒绝了你的好友申请`,user.info.name, null);
        }
        this.clearApplyNotice(uid, reqUid);
        this.clearApplyNotice(reqUid, uid);
        return ret;
    }

    addFriend(uid, target){
        let user = this.users[uid];
        let targetUser = this.users[target];
        if(!user || !targetUser){
            return;
        }
        this.realAddFriend(user, targetUser);
        this.realAddFriend(targetUser, user);
    }

    realAddFriend(user, targetUser){
        let info = clone(targetUser.info);
        let target = info.uid;
        user.friendList[target] = {};
        user.friendList[target].chatRecord = [];
        user.friendList[target].newMsg = false;
        user.friendList[target].curGiveCount = this.getTodayGiveCount(user.info.uid, +target);
    }

    clearApplyNotice(uid, reqUid){
        let user = this.users[uid];
        let noticeContent = user.notice.noticeContent;
        for(let nId in noticeContent){
            let notice = noticeContent[nId];
            if(notice.type === this.noticeType.APPLY){
                if(notice.subType === this.applyState.NONE){
                    if(notice.param.reqUid == reqUid) {
                        delete noticeContent[nId];
                        break;
                    }
                }
            }
        }
    }

    removeFriend(uid, data){
        let target = data.target;
        let user = this.users[uid];
        let targetUser = this.users[target];
        if(!user || !targetUser){
            return CSProto.ProtoState.STATE_FAILED;
        }
        if(!user.friendList[target]){
            return CSProto.ProtoState.STATE_FRIEND_NO_EXIST;
        }
        this.realRemoveFriend(user, target);
        this.realRemoveFriend(targetUser, uid);
        // this.addNotice(user,this.noticeType.TEXT,0,`您已成功将${targetUser.info.name}从好友列表删除`,null);
        // this.addNotice(targetUser,this.noticeType.TEXT,0,`${user.info.name}已将您从好友列表移除`,null);
        return CSProto.ProtoState.STATE_OK;
    }

    realRemoveFriend(user, target){
        if(user.friendList[target]){
            delete user.friendList[target];
        }
    }


    reqMyFriend(player){
        let uid = player.uid;
        let user = this.users[uid];
        if(!user){
            return false;
        }
        let data = {};
        for(let target in user.friendList){
            let targetUser = this.users[target];
            if(!targetUser)continue;
            let info = clone(targetUser.info);
            info.onlineState = targetUser.state;
            info.isFriend = true;
            let uf = user.friendList[target];
            info.plusCount = Math.max(this.giveBeanCount - uf.curGiveCount, 0);
            info.newMsg = uf.newMsg;
            data[target] = {};
            data[target].info = info;
        }
        this.setTag(user, 2);
        this.setCurChatTarget(user, 0);
        return data;
    }


    reqNotice(player){
        let uid = player.uid;
        let user = this.users[uid];
        if(user){
            this.setCurChatTarget(user, 0);
            this.setNoticeNewMsg(user, false);
            let notices = user.notice.noticeContent;
            let sortArray = this.sortNotice(notices);
            this.setTag(user, 3);
            return {notices: notices, sortArray:sortArray};
        }
    }

    sortNotice(notices){
        let sortArray = [];
        let keys = Object.keys(notices);
        keys = keys.sort();
        let len = keys.length;
        let exIds = [];
        for(let idx = len - 1; idx >= 0; idx--){
            let nIdx = keys[idx];
            let notice = notices[nIdx];
            if((notice.type === this.noticeType.APPLY && notice.subType === this.applyState.NONE) ||
                (notice.type === this.noticeType.GIVE && notice.subType === this.giveState.WAIT_RECEIVE)){
                sortArray.push(nIdx);
                exIds.push(nIdx);
            }
        }
        for(let idx = len - 1; idx >= 0; idx--){
            let nIdx = keys[idx];
            let notice = notices[nIdx];
            if(exIds.indexOf(nIdx) === -1){
                sortArray.push(nIdx);
            }
        }
        return sortArray;
    }


    checkChatRecord(player, data){
        let uid = player.uid;
        let target = +data.target;
        let user = this.users[uid];
        let records = [];
        if(user) {
            this.setCurChatTarget(user, target);
            let ft = user.friendList[target];
            if(ft){
                records = ft.chatRecord;
                ft.newMsg = false;
            }

            this.sendFriendRed(player, target, false);
            let selfRed = this.checkFriendRed(user);
            this.sendTagRed(uid, 1, selfRed);
            this.sendWorldRed(uid);
        }
        return records;
    }



    setCurChatTarget(user, target){
        user.curChatTarget = target;
    }

    checkChat(user, target, targetUser, uid, msg){
        if(!msg || msg === ""){
            return CSProto.ProtoState.STATE_FRIEND_MSG_IS_NULL;
        }
        if(!user.friendList[target]){
            return CSProto.ProtoState.STATE_FRIEND_NO_EACH_FRIEND;
        }
        if(!targetUser.friendList[uid]){
            return CSProto.ProtoState.STATE_FRIEND_NO_EACH_FRIEND;
        }
        return CSProto.ProtoState.STATE_OK;
    }

    chat(player,data) {
        let uid = player.uid;
        let user = this.users[uid];
        let target = +data.target;
        let msg = data.msg;
        let targetUser = this.users[target];
        if (!user || !targetUser) {
            return CSProto.ProtoState.STATE_FAILED;
        }
        let ret = this.checkChat(user, target, targetUser, uid, msg);
        if(ret != CSProto.ProtoState.STATE_OK) {
            return ret;
        }
        user.friendList[target].newMsg = false;
        this.addMsg(user, target, msg, uid);
        this.addMsg(targetUser, uid, msg, uid);
        let selfRed = this.checkFriendRed(user);
        let targetRed = this.checkFriendRed(targetUser);
        this.sendTagRed(uid, 1, selfRed);
        this.sendTagRed(target, 1, targetRed);
        this.sendWorldRed(uid);
        this.sendWorldRed(target);
    }

    addMsg(user, target, msg, sender){
        let records = user.friendList[target].chatRecord;
        records.push({msg:msg, sender:sender});
        if(records.length >= this.msgMaxRecord){
            records.splice(0 , 1);
        }
        this.sendMsgToClient(user, target, msg, sender);
    }

    sendMsgToClient(user, target, msg, sender){
        let uid = user.info.uid;
        if(user.curChatTarget === target){
            PlayerMgr.getPlayerNoCreate(uid, (player)=>{
                if(player && player.getConn()){
                    player.getConn().sendMsg({
                        code:CSProto.ProtoID.CLIENT_MIDDLE_CHAT,
                        args:{
                            sender:sender,
                            msg:msg
                        }
                    })
                }
            });
            return;
        }
        if(user.bigTag === 2 && user.curChatTarget === 0){
            PlayerMgr.getPlayerNoCreate(uid, function (player) {
                if(player) {
                    this.sendFriendRed(player, target, true);
                }
            }.bind(this));
        }
        user.friendList[target].newMsg = true;
    }

    sendFriendRed(player, target, value){
        if(player.getConn()) {
            player.getConn().sendMsg({
                code: CSProto.ProtoID.MIDDLE_CLIENT_CHAT_RED,
                args: {
                    target: target,
                    newMsg: value
                }
            })
        }
    }

    sendTagRed(uid, type, value){
        PlayerMgr.getPlayerNoCreate(uid, function (player) {
            if(player.getConn()) {
                player.getConn().sendMsg({
                    code: CSProto.ProtoID.MIDDLE_CLIENT_TAG_RED,
                    args: {
                        type: type,
                        red: value
                    }
                })
            }
        })

    }

    closeChat(player){
        let uid = player.uid;
        let user = this.users[uid];
        if(user){
            this.setCurChatTarget(user, 0);
        }
    }

    closeFriend(player){
        let uid = player.uid;
        let user = this.users[uid];
        if(user){
            this.setCurChatTarget(user, 0);
            this.setTag(user, 0);
        }
    }


    checkGive(user, target, num, player){
        if(num > this.giveBeanMax){
            return CSProto.ProtoState.BEAN_PASS_MAX;
        }
        if(num <= 0){
            return CSProto.ProtoState.STATE_FAILED;
        }
        let info = user.friendList[target];
        if(!info){
            return CSProto.ProtoState.STATE_FAILED;
        }
        if(info.curGiveCount >= this.giveBeanCount){
            return CSProto.ProtoState.GIVE_NUM_PASS_MAX;
        }
        if(gSeer.getPlayerBean(player) < num){
            return CSProto.ProtoState.STATE_GAME_BEAN_LESS;
        }
        return CSProto.ProtoState.STATE_OK;
    }

    giveBean(player, data, cb){
        let uid = player.uid;
        let target = +data.target;
        let num = +data.num;
        let user = this.users[uid];
        let targetUser = this.users[target];
        if(!user || !targetUser)return;
        let ret = this.checkGive(user, target, num, player);
        if(ret != CSProto.ProtoState.STATE_OK){
            cb(ret);
            return;
        }
        PlayerMgr.getPlayerNoCreate(target, (tp)=>{
            if(tp){
                let data = {id: 1, num: -num, eventId: CSProto.eveIdType.FRIEND_GIVE};
                player.updateBean(data);
                let msg = `赠送给你${num}金豆`;
                let ft = user.friendList[target];
                ft.curGiveCount++;
                this.addNotice(targetUser, this.noticeType.GIVE, this.giveState.WAIT_RECEIVE,msg,user.info.name,{giveUid:uid, num:num});
                cb(CSProto.ProtoState.STATE_OK,  {plusCount: Math.max(this.giveBeanCount - ft.curGiveCount, 0), target:target});
                this.addGiveCount(uid, target);
            }else{
                cb(CSProto.ProtoState.STATE_FAILED)
            }
        });
    }

    getTodayGiveCount(giveUid, recvUid){
        let len = this.todayGive.length;
        for(let idx = 0; idx < len; idx++){
            let info = this.todayGive[idx];
            if(info.giveUid === giveUid && info.recvUid === recvUid){
                return info.count;
            }
        }
        return 0;
    }

    addGiveCount(giveUid, recvUid){
        let len = this.todayGive.length;
        for(let idx = 0; idx < len; idx++){
            let info = this.todayGive[idx];
            if(info.giveUid === giveUid && info.recvUid === recvUid){
                info.count++;
                return;
            }
        }
        let data = {giveUid: giveUid, recvUid:recvUid, count: 1};
        this.todayGive.push(data);
    }

    resetGiveCount(giveUid, recvUid){
        let len = this.todayGive.length;
        for(let idx = 0; idx < len; idx++){
            let info = this.todayGive[idx];
            if(info.giveUid === giveUid && info.recvUid === recvUid){
                info.count = 0;
            }
        }
    }

    resultReceive(uid, data){
        let noticeId = data.noticeId;
        let agree = true;
        let user = this.users[uid];
        if(user){
            let noticeContent = user.notice.noticeContent;
            let notice = noticeContent[noticeId];
            if(!notice){
                return CSProto.ProtoState.STATE_GAME_PARAM_ERROR;
            }
            if(notice.subType != this.giveState.WAIT_RECEIVE){
                return CSProto.ProtoState.ALREADY_GIVE_GET;
            }
            let num = notice.param.num;
            let giveUid = notice.param.giveUid;
            if(!num || !giveUid){
                return CSProto.ProtoState.STATE_FAILED;
            }
            let giveUser = this.users[giveUid];
            if(!giveUser){
                return CSProto.ProtoState.STATE_FRIEND_NO_EXIST;
            }
            if(agree) {
                PlayerMgr.getPlayerNoCreate(uid, (rp) => {
                    if (rp) {
                        let data = {id: 1, num: num, eventId: CSProto.eveIdType.FRIEND_GIVE};
                        rp.updateBean(data);
                        rp.save();
                        // this.addNotice(giveUser, this.noticeType.TEXT, 0, `已收到你赠送的${num}金豆`, user.info.name, null);
                        notice.subType = this.giveState.AGREE;
                    }
                })
            }else{
                PlayerMgr.getPlayerNoCreate(giveUid, (gp)=>{
                    if(gp){
                        let data = {id:1, num:num, eventId:CSProto.eveIdType.REJECT_GIVE};
                        gp.updateBean(data);
                        gp.save();
                        this.addNotice(giveUser, this.noticeType.TEXT, 0, `拒绝了你赠送的${num}金豆`,user.info.name,null);
                        notice.subType = this.giveState.REJECT;
                    }
                });
            }
            return CSProto.ProtoState.STATE_OK;
        }
    }

    setNoticeNewMsg(user, value){
        user.notice.newMsg = value;
        let uid = user.info.uid;
        if((user.bigTag === 1 || user.bigTag === 2)) {
            this.sendTagRed(uid, 2, value);
        }
        if(user.bigTag !== 3){
            this.sendWorldRed(uid);
        }
    }

    addNotice(user, type, subType, msg, name, param){
        let uid = user.info.uid;
        let noticeId = user.notice.noticeId++;
        let noticeContent = user.notice.noticeContent;
        noticeContent[noticeId] = {type:type, subType:subType, msg:msg, param:param, id:noticeId, name:name};
        this.setNoticeNewMsg(user, true);
        if(Object.keys(noticeContent).length > this.noticeMax){
            let sortArray = this.sortNotice(noticeContent);
            let removeId = sortArray[sortArray.length - 1];
            let removeNotice = noticeContent[removeId];
            if(removeNotice.type === this.noticeType.GIVE){     // 等待接收金豆
                this.resultReceive(uid, {noticeId:removeId, agree:true});
            }else if(removeNotice.type === this.noticeType.APPLY){
                let data = {noticeId:removeId, agree:false};
                this.applyResult(uid, data);
            }
        }

    }

    judgeFriend(ranks, uid){
        let user = this.users[uid];
        if(!user){
            return;
        }
        let len = ranks.length;
        for(let idx = 0; idx < len; idx++){
            let data = ranks[idx];
            let target = data.uid;
            data.isFriend = user.friendList[target] ? true : false;
        }
    }

    zeroReset(){
        for(let uid in this.users){
            let user = this.users[uid];
            if(user){
                for(let fUid in user.friendList){
                    let fInfo = user.friendList[fUid];
                    fInfo.curGiveCount = 0;
                }
            }
        }
        this.todayGive = [];
    }

    oneReset(player){
        let uid = player.uid;
        let user = this.users[uid];
        if(user){
            for(let fUid in user.friendList){
                let fInfo = user.friendList[fUid];
                fInfo.curGiveCount = 0;
                this.resetGiveCount(uid, +fUid);
            }
        }
    }
}

module.exports = new Friends();
