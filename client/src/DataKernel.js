/**
 * 玩家核心数据
 */
game.DataKernel = {
    openid: "671643387",          // 平台编号
    uid: 0,                    // 用户ID

    name: "671643387",          // 玩家的昵称
    headPic: "",                   // 玩家微信头像链接地址
    unionid: "",                   // UnionID
    sex: 1,                    // 玩家的微信注册性别 1 男  2 女
    signature: "",                   // 玩家个性签名

    card: 0,                    // 玩家身上的房卡数量
    bean: 0,                    // 玩家身上的金豆数量
    diamond: 0,                    // 玩家身上的钻石数量
    score: 0,                    // 玩家身上的积分数量

    storageBox: {},                   // 保险箱数据结构
    boxCard: 0,                    // 保险箱房卡数量
    boxBean: 0,                    // 保险箱金豆数量
    boxDiamond: 0,                    // 保险箱钻石数量
    boxScore: 0,                    // 保险箱积分数量

    // promoter            : {},                   // 推广员
    // qrUrl               : "",                   // 二维码网址
    // qrCode              : "",                   // 二维码编号

    payCard: 0,                    // 玩家消费的房卡数量
    payBean: 0,                    // 玩家消费的金豆数量
    payDiamond: 0,                    // 玩家消费的钻石数量
    payMoney: 0,                    // 玩家冲的人民币数量

    province: "",                   // 玩家所在省份
    address: "",                   // 玩家当前所在的地址

    ip: "",                   // 登录的IP地址
    isGM: false,                // 是否是GM (GM等级权限达到99级才是GM)
    gmLevel: 3,                    // GM权限等级

    identity: "",                   // identity:身份证号
    fillInvitation: "",                   // 已经填写过的邀请码

    matchId: 0,                    // 当前所在的比赛场ID
    roomId: 0,                    // 当前所在的房间
    ownRoomId: 0,                    // 自己创建的房间

    notice: "",                   // 公告
    message: "",                   // 消息

    publicWechat: "",                   // 微信公众号
    telephone: "",                   // 电话
    kfWechat: "",                   // 客服微信
    zsWechat: "",                   // 招商微信

    // curContestEndTime   : 0,                    // 比赛场结束时间

    noticeInfo: {},                   // 跑马灯公告

    // rewardPool          : null,                 // 奖池信息
    tasksData: null,                 // 任务数据

    haveNewMail: false,                // 是否有新邮件
    haveTaskReward: false,                // 是否还有任务没有领取完
    // haveRewardMail      : false,                // 是否有获奖邮件未领取
    // haveNewChat         : false,                // 是否有新的聊天
    // newGiveRecord       : false,                // 是否有新的赠送记录

    // rankMatch           : null,                 // 排名赛相关数据
    // matchIng            : false,                // 是否在比赛中
    // matchCard           : "",                   // 匹配卡号
    // matchScore          : 0,                    // 比赛分数

    // netAccount          : "",                   // 宽带账号
    // tvAccount           : "",                   // 有线电视账号
    // phone               : "",                   // 电话号码
    // weChat              : "",                   // 微信账号
    // addressInfo         : {},                   // 实物领取地址信息

    pfcAdd: "",                    // PFC地址
    pfcQR: "",                     // PFC二维码
    preUid: 0,                     // 上级推广员

    seer_account: "",
    seer_id: "",
    chain_coin: 0,

    //============================================================================================================

    /**
     * 解析登陆数据
     * @param json
     */
    parse: function (json) {

        this.haveNewMail = json.haveNewMail;
        this.haveTaskReward = json.haveTaskReward || false;
        // 用户信息
        var user = json.user;
        var content = json.content;

        this.openid = user.info.openId;
        this.uid = user._id;
        this.fillInvitation = user.fillInvitation;

        this.name = user.info.name;
        this.headPic = user.info.headPic;
        this.sex = user.info.sex;
        this.signature = user.info.signature;
        this.identity = user.info.identity;

        this.card = user.status.card || 0;
        this.bean = user.status.bean || 0;
        this.diamond = user.status.diamond || 0;
        this.score = user.status.score || 0;


        this.storageBox = user.storageBox || {};
        if (user.storageBox) {
            this.boxCard = this.storageBox.card || 0;
            this.boxBean = this.storageBox.bean || 0;
            this.boxDiamond = this.storageBox.diamond || 0;
            this.boxScore = this.storageBox.score || 0;
        }

        // this.promoter = user.extend_info;
        if (user.extend_info) {
            this.preUid = user.extend_info['pre_extend_uid'];
            this.isGM = user.extend_info['isGM'];
        }

        this.pfcAdd = "";
        this.pfcQR = "";

        // SEER
        var seer = user['SEER'];
        if (seer) {
            this.seer_account = seer['account'];
            this.seer_id = seer['id'];
            this.chain_coin = 0;
        }

        // 排名赛相关
        // this.rankMatch = user.rankMatch;
        // if (user.rankMatch) {
        //     this.matchIng = this.rankMatch.matchIng;
        //     this.matchCard = this.rankMatch.curCard;
        //     this.matchScore = this.rankMatch.curScore;
        //     //TV 宽带账号
        //     this.netAccount = this.rankMatch.netAccount;
        //     this.tvAccount  = this.rankMatch.tvAccount;
        //
        //     this.addressInfo = this.rankMatch.addressInfo;
        // }

        // 兑换相关
        // this.bindInfo = user.bindInfo;
        // if (this.bindInfo) {
        //     this.phone = this.bindInfo.phone;
        //     this.weChat = this.bindInfo.wxAccount;
        //
        //     this.netAccount = this.bindInfo.netAccount;
        //     this.tvAccount  = this.bindInfo.tvAccount;
        // }

        this.payCard = user.consume.payCard || 0;
        this.payBean = user.consume.payBean || 0;
        this.payDiamond = user.consume.payDiamond || 0;
        this.payMoney = user.consume.payMoney || 0;

        this.ip = user.marks.loginIP;
        this.gmLevel = user.gmLevel;

        // if (user.gmLevel) {
        //     cc.log("==> GM账号");
        //     this.isGM = user.gmLevel == 99;
        // }

        this.matchId = user.room.matchId;
        this.ownRoomId = user.room.ownRoomId;
        this.roomId = user.room.roomId;

        this.notice = content.notice || "";
        this.message = content.message || "";

        // 联系方式
        this.publicWechat = content.publicWechat || "公众号";
        this.telephone = content.telephone || "联系电话";
        this.kfWechat = content.kfWechat || "客服微信";
        this.zsWechat = content.zsWechat || "招商微信";

        // 跑马灯
        cc.log("跑马灯 ===>>>" + JSON.stringify(json.noticeInfo));
        this.noticeInfo = json.noticeInfo || null;

        // 奖池
        // cc.log("奖池 ===>>>" + JSON.stringify(json.rewardPool));
        // this.rewardPool = json.rewardPool || null;

        // 设置服务器时间
        ServerDate.setOffsetTime(json.serverTime || new Date());
    },

    /**
     * 获取玩家房间号
     * @returns {number}
     */
    getRoomId: function () {
        if (this.ownRoomId) {
            // 有自己创建的房间就返回自己创建的房间号
            return this.ownRoomId;
        }
        return this.roomId;
    },

    /**
     * 清除房间号
     */
    clearRoomId: function () {
        this.ownRoomId = this.roomId = 0;
    },

    /**
     * 是否需要绑定
     */
    needBind: function () {
        return (this.preUid == 0 && !this.isGM);
    },

    needSeer: function () {
        return (this.seer_account == "" || this.seer_id == "");
    }
};
