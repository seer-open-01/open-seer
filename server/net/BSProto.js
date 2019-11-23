
//后台请求参数
exports.ReqArgs = {
    ADD_USER:"addUser",                         // 增加用户
    MODIFYNICKNAME: "modifyNickname",           // 用户x昵称
    CONSUME_FK_COIN:"consume",                  // 消费房卡金币
    RECORD : "record",                          // 战绩
    NOTICE:"bulletin",                          // 获取公告
    GIVE : "give",                              // 玩家互赠金币
    REQFHLB:"blackList",                        // 请求封号列表
    UP_DATE_FK_JB: "modifyAccount",             // 玩家更新房卡金币
    GET_TICKET:"getTicket",                     // 获取二维码
    GET_PFC_ADDRES_URL:"code",                  // 获取pfc二维码地址
    GET_HEAD:"index",                           // 请求web端下载头像
};

// 路径和方法之间的转换
exports.pathnameToact = {
    "api/saiya/v1/assets/recharge":"PFCRecharge"
};
