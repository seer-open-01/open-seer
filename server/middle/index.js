let ProtoID         = require("../net/CSProto.js").ProtoID;
///////////////////////////////////////////////////////////////////////////////
//>> 中央服务器逻辑处理

function ProtoMap() {
    this.protoMap = {};
    this.init();
}

ProtoMap.prototype = {
    /**
     * 初始化
     */
    init: function () {
        // 游戏服相关通信
        let GSLogic = require("./GS.js");
        this.addProto(ProtoID.GAME_MIDDLE_REGISTER, GSLogic.game_middle_register);                           // 注册服务器
        this.addProto(ProtoID.GAME_MIDDLE_UNREGISTER, GSLogic.game_middle_unregister);                       // 注销服务器
        this.addProto(ProtoID.GAME_MIDDLE_DEC_USAGE, GSLogic.game_middle_decUsage);                          // 减少服务器用量
        this.addProto(ProtoID.GAME_MIDDLE_SAVE_REPORTS, GSLogic.game_middle_save_reports);                   // 服务器请求保存战报
        this.addProto(ProtoID.GAME_MIDDLE_REMOVE_PLAYER, GSLogic.game_middle_remove_player);                 // 移除玩家
        this.addProto(ProtoID.GAME_MIDDLE_JOINED_ROOM, GSLogic.game_middle_joinroom);                        // 服务器请求加入房间
        this.addProto(ProtoID.GAME_MIDDLE_CREATE_ROOM, GSLogic.game_middle_createRoom);                      // 服务器响应创建房间
        this.addProto(ProtoID.GAME_MIDDLE_PLAYER_DATA, GSLogic.game_middle_player_data);                     // 服务器响应保存玩家数据
        this.addProto(ProtoID.GAME_MIDDLE_USER_LIST_REQ, GSLogic.game_middle_user_list_req);                 // 请求user_list数据

        this.addProto(ProtoID.GAME_MIDDLE_CLIENT_UPDATE_MONEY, GSLogic.game_middle_update_money);            // 更新货币
        this.addProto(ProtoID.GAME_MIDDLE_PLAY_LEVAL_ROOM, GSLogic.game_middle_player_level_roomId);         // 玩家离开房间
        this.addProto(ProtoID.GAME_MIDDLE_REMOVE_COPY_PLAYER,GSLogic.game_middle_remove_copy);               // 移除复制人
        this.addProto(ProtoID.CLIENT_GAME_MIDDLE_CHENG_ROOM, GSLogic.game_middle_change_room);               // 换桌
        this.addProto(ProtoID.GAME_MIDDLE_UPDATE_PLAYER_COUNTS, GSLogic.game_middle_update_player_counts);   // 更新统计
        this.addProto(ProtoID.GAME_MIDDLE_UPDATE_PROFIT, GSLogic.game_middle_update_profit);                 // 更新收益
        this.addProto(ProtoID.GAME_MIDDLE_CHECK_TASK, GSLogic.game_middle_check_task);                       // 检测任务
        this.addProto(ProtoID.GAME_MIDDLE_UPDATE_SCORE, GSLogic.updateWatchScore);                           // 更新比赛场积分
        this.addProto(ProtoID.GAME_MIDDLE_RESP_FK_LIST, GSLogic.FKListResp);                                 // 请求房卡列表回执
        this.addProto(ProtoID.GAME_FORCE_RESTORY_ROOMID, GSLogic.froceRestroyRoom);                          // 强制销毁房间
        this.addProto(ProtoID.GAME_MIDDLE_PLAYER_KICK, GSLogic.noticeKickPlayer);                            // 通知强制离开的玩家



        // 游戏和客户端相关通信
        let GameLogic = require("./Game.js");
        this.addProto(ProtoID.CLIENT_MIDDLE_LOGIN, GameLogic.client_middle_login);                           // 登录
        this.addProto(ProtoID.CLIENT_MIDDLE_CREATE_ROOM, GameLogic.client_middle_createRoom);                // 创建房间
        this.addProto(ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, GameLogic.client_middle_getGameAddr);             // 请求游戏服地址
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_MATCH_LIST,GameLogic.client_middle_req_match_list);          // 请求匹配池列表信息
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH, GameLogic.client_middle_req_add_match);           // 客户端请求金币场
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_SHOP, GameLogic.client_middle_req_shop);                     // 客户端请求商城
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_REPORTS, GameLogic.client_middle_req_reposts);               // 客户端请求战绩
        // rigSeerAccount  transferSC returnSC updateBeanBySC
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_GET_MAIL, GameLogic.client_middle_req_get_mail);             // 申请邮件列表
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_DEL_MAIL, GameLogic.client_middlle_req_del_mail);            // 删除邮件
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_LOOK_MAIL, GameLogic.client_middle_req_look_mail);           // 查看邮件
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_GET_GOODS, GameLogic.client_middle_req_get_mail_goods);      // 获取邮件物品
        this.addProto(ProtoID.CLIENT_HEARTBEAT, GameLogic.heartbeat);                                        // 心跳
        this.addProto(ProtoID.CLIENT_GAME_CHANGE_SIGN, GameLogic.changeSignReq);                             // 修改签名请求
        this.addProto(ProtoID.CLIENT_MIDDLE_PLAYERS_RANK, GameLogic.playerRankReq);                          // 排行榜
        this.addProto(ProtoID.CLEAR_ID, GameLogic.clearClientRoomId);                                        // 清理客户端roomId
        this.addProto(ProtoID.CLIENT_MIDDLE_LEAVE, GameLogic.playerLeaveReq);                                // 玩家离开请求

        // 推广系统
        this.addProto(ProtoID.CLIENT_MIDDLE_BIND_PRE,GameLogic.bindPreAgent);                                // 绑定上级
        this.addProto(ProtoID.CLIENT_MIDDLE_BIND_ALL, GameLogic.getAllExtendMsg);                            // 整合消息

        this.addProto(ProtoID.CLIENT_MIDDLE_QUERY_BANK, GameLogic.queryBank);                                // 存取钱操作
        this.addProto(ProtoID.CLIENT_MIDDLE_QUERY_BANK_BSC, GameLogic.queryBankBsc);                         // 存取钱操作BSC
        this.addProto(ProtoID.CLIENT_MIDDLE_INPUT_PASSWORD_BANK, GameLogic.inputBankPassword);               // 输入银行密码
        this.addProto(ProtoID.CLIENT_MIDDLE_LEAVE_BANK, GameLogic.leaveBank);                                // 关闭银行
        this.addProto(ProtoID.CLIENT_MIDDLE_REMEMBER_PASSWORD_BANK, GameLogic.rememberPasswordBank);         // 记住密码
        this.addProto(ProtoID.CLIENT_MIDDLE_QUERY_PLAYER_REPORTS, GameLogic.queryPlayerReports);             // 查询战绩
        this.addProto(ProtoID.CLIENT_MIDDLE_QUERY_PLAYER_REPORTS_DEALER, GameLogic.queryPlayerReportsDetails);      // 查询战绩详情
        this.addProto(ProtoID.CLIENT_MIDDLE_QUERY_SHOP_CONFIG, GameLogic.queryShopConfig);                   // 查询商城配置
        this.addProto(ProtoID.CLIENT_MIDDLE_CHANGE_PASSWORD_BANK, GameLogic.changeBankPassword);             // 修改银行密码
        this.addProto(ProtoID.CLIENT_MIDDLE_EXCHANGE_DIAMOND, GameLogic.exchangeDiamond);                    // 兑换钻石
        this.addProto(ProtoID.CLIENT_MIDDLE_SEND_SIGN, GameLogic.sendSingCode);                              // 请求短信验证


        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_BONUS_CONFIG,GameLogic.bonusCfgReq);                         // 请求奖池配置
        this.addProto(ProtoID.CLIENT_MIDDLE_SHARE_NOTICE,GameLogic.onShare);                                 // 分享
        this.addProto(ProtoID.CLIENT_MIDDLE_FEEDBACK, GameLogic.feedback);                                   // 反馈
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_ALIPAY, GameLogic.reqAlipay);                                // 请求支付宝付款
        this.addProto(ProtoID.GAME_MIDDLE_START_GAME,GameLogic.startGame);                                   // 游戏已经开始
        this.addProto(ProtoID.GAME_MIDDLE_UPDATE_LUCK,GameLogic.updateLuck);                                 // 更新幸运值
        this.addProto(ProtoID.GAME_MIDDLE_UPDATE_INSERT_NOTICE,GameLogic.insertNotice);                      // 插播消息
        this.addProto(ProtoID.CLIENT_MIDDLE_CHANGE_HEAD, GameLogic.changeHead);                              // 设置头像标号
        this.addProto(ProtoID.CLIENT_BIND_PHONE, GameLogic.bindPhone);                                       // 绑定手机号
        this.addProto(ProtoID.CLIENT_MIDDLE_CHANGE_PASSWORD, GameLogic.modifyPasswd);                        // 修改登录密码
        this.addProto(ProtoID.CLIENT_BIND_BANK, GameLogic.bindBank);                                         // 绑定银行卡
        this.addProto(ProtoID.CLIENT_MIDDLE_BIND_ALIPAY, GameLogic.bindAlipay);                              // 绑定支付宝
        this.addProto(ProtoID.CLIENT_MIDDLE_DRAWING, GameLogic.reqDrawing);                                  // 请求提现
        this.addProto(ProtoID.CLIENT_MIDDLE_BANK_LOG, GameLogic.reqBankRecord);                              // 请求银行记录
        this.addProto(ProtoID.CLIENT_MIDDLE_ALIPAY_RECORD, GameLogic.reqAlipayRecord);                       // 请求支付宝记录
        this.addProto(ProtoID.CLIENT_MIDDLE_GET_SHOP_CONFIG,GameLogic.reqShopConfig);                        // 请求人民币商城配置
        this.addProto(ProtoID.CLIENT_MIDDLE_TASK_REQ, GameLogic.reqTaskData);                                // 请求任务数据
        this.addProto(ProtoID.CLIENT_MIDDLE_GET_TASK, GameLogic.reqTaskReward);                              // 领取任务奖励

        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_BAG, GameLogic.reqBagData);                                  // 请求背包数据
        this.addProto(ProtoID.CLIENT_MIDDLE_USE_ITEM, GameLogic.useItem);                                    // 使用物品

        this.addProto(ProtoID.CLIENT_MIDDLE_UPDATE_MATCH, GameLogic.updateMatchCard);                        // 刷新参赛卡
        this.addProto(ProtoID.CLIENT_MIDDLE_BOON_DATA, GameLogic.reqBoonALL);                                // 请求福利总数据
        this.addProto(ProtoID.CLIENT_MIDDLE_BOON_REQ, GameLogic.reqBoon);                                    // 请求福利数据
        this.addProto(ProtoID.CLIENT_MIDDLE_BOON_GET, GameLogic.getBoon);                                    // 抽取福利奖励
        this.addProto(ProtoID.CLIENT_MIDDLE_MATCH_REQ_ENROOL, GameLogic.reqEnroll);                          // 请求报名
        this.addProto(ProtoID.CLIENT_MIDDLE_MATCH_REQ_RANKS, GameLogic.reqMatchRanks);                       // 请求排行榜
        this.addProto(ProtoID.CLIENT_MIDDLE_MATCH_RECORD, GameLogic.reqMatchLog);                            // 请求广电杯日志
        this.addProto(ProtoID.CLIENT_MIDDLE_BIND_TV_NET, GameLogic.bindParam);                               // 绑定参数
        this.addProto(ProtoID.CLIENT_MIDDLE_NAME_AUTH, GameLogic.nameAuth);                                  // 实名认证
        this.addProto(ProtoID.CLIENT_MIDDLE_GEN_INVITE, GameLogic.genInvite);                                // 生成邀请码
        this.addProto(ProtoID.CLIENT_MIDDLE_FILL_INVITE, GameLogic.fillInvite);                              // 填写邀请码
        this.addProto(ProtoID.CLIENT_MIDDLE_REWARD_EXPLAIN, GameLogic.explain);                              // 奖励说明

        // 好友系统
        this.addProto(ProtoID.CLIENT_MIDDLE_OPEN_FRIEND, GameLogic.openFriends);                             // 请求好友数据
        this.addProto(ProtoID.CLIENT_MIDDLE_ADD_FRIEND_REQ, GameLogic.applyFriend);                          // 请求加好友
        this.addProto(ProtoID.CLIENT_MIDDLE_ADD_FRIEND_RESULT, GameLogic.applyResult);                       // 申请好友结果
        this.addProto(ProtoID.CLIENT_MIDDLE_FRIEND_LIST, GameLogic.friendListReq);                           // 请求好友列表
        this.addProto(ProtoID.CLIENT_MIDDLE_REMOVE_FRIEND, GameLogic.removeFriends);                         // 删除好友
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_NOTICE, GameLogic.reqNotice);                                // 请求通知
        this.addProto(ProtoID.CLIENT_MIDDLE_CHECK_CHAT_RECORD, GameLogic.checkChatRecord);                   // 查看聊天记录
        this.addProto(ProtoID.CLIENT_MIDDLE_CHAT, GameLogic.onPlayerChat);                                   // 聊天
        this.addProto(ProtoID.CLIENT_MIDDLE_GIVE_BEAN, GameLogic.giveBean);                                  // 赠送金豆
        this.addProto(ProtoID.CLIENT_MIDDLE_GIVE_RESULT, GameLogic.giveBeanResult);                          // 赠送金豆结果
        this.addProto(ProtoID.CLIENT_MIDDLE_BATCH, GameLogic.changeBatch);                                   // 换一批
        this.addProto(ProtoID.CLIENT_MIDDLE_SEARCH, GameLogic.search);                                       // 搜索
        this.addProto(ProtoID.CLIENT_MIDDLE_CLOSE_CHAT_WINDOW, GameLogic.closeChat);                         // 关闭聊天窗口
        this.addProto(ProtoID.CLIENT_MIDDLE_CLOSE_FRIENDS_WINDOW, GameLogic.closeFriend);                    // 关闭整个好友窗口

        // 大喇叭
        this.addProto(ProtoID.CLIENT_MIDDLE_GET_BIG_HORN, GameLogic.getHornMsg);                             // 获取大喇叭消息
        this.addProto(ProtoID.CLIENT_MIDDLE_SEND_HORN_MSG, GameLogic.sendHornMsg);                           // 获取大喇叭消息

        // 破产补助
        this.addProto(ProtoID.CLIENT_MIDDLE_APPLY_SUBSIDY, GameLogic.getSubsidy);                            // 申请破产补助
        // 签到
        this.addProto(ProtoID.CLIENT_MIDDLE_GET_SIGN_DATA, GameLogic.getSignReq);                            // 获取签到数据
        this.addProto(ProtoID.CLIENT_MIDDLE_REWARD_SIGN_DATA, GameLogic.getSignReward);                      // 获取签到数据

        // 商城
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_NEW_SHOP, GameLogic.getShopData);                            // 获取商城数据
        this.addProto(ProtoID.CLIENT_MIDDLE_BUY_GOODS, GameLogic.buyShopData);                               // 购买商城数据

        // 兑换码
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_CONVERT, GameLogic.reqConvert);                              // 请求兑换
        this.addProto(ProtoID.CLIENT_MIDDLE_GIVE_GOODS, GameLogic.giveItems);                                // 赠送物品
        this.addProto(ProtoID.CLIENT_MIDDLE_GET_BAG_RECORD, GameLogic.getBagRecords);                        // 获取背包记录

        // PFC
        this.addProto(ProtoID.CLIENT_MIDDLE_QUERY_PFC, GameLogic.queryPFC);                                  // 查询PFC(网关方向)
        this.addProto(ProtoID.CLIENT_MIDDLE_REBIND_PFC,GameLogic.reBindPFC);                                 // 再次绑定PFC
        this.addProto(ProtoID.CLIENT_MIDDLE_WITHDRAW_PFC, GameLogic.withdrawPFC);                            // 提现PFC
        this.addProto(ProtoID.CLIENT_MIDDLE_PFC_RECHARGE_RECORDS, GameLogic.GetPFCRechargeRecords);          // 获取PFC充值记录
        this.addProto(ProtoID.CLIENT_MIDDLE_PFC_WITHDRAW_RECORDS, GameLogic.getPFCWithdrawRecords);          // 获取PFC提现记录
        this.addProto(ProtoID.CLIENT_MIDDLE_SWITCH_ADDRESS, GameLogic.swithAddress);                         // 切换PFC提现地址
        this.addProto(ProtoID.CLIENT_MIDDLE_PFC_PASSWORD, GameLogic.setPFCPassword);                         // 设置提现PFC密码
        this.addProto(ProtoID.CLIENT_MIDDLE_PFC_GET_WITHDRAW_NUM, GameLogic.getWithdrawNum);                 // 获取提币数量
        // 房卡场
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_FK_LIST, GameLogic.reqFKList);                               // 请求(刷新)房卡列表
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_FK_LIST_PRE, GameLogic.reqFKListPre);                        // 房卡列表上一页
        this.addProto(ProtoID.CLIENT_MIDDLE_REQ_FK_LIST_NEXT, GameLogic.reqFKListNext);                      // 房卡列表下一页

        // SEER CLIENT_MIDDLE_RETURN_SC
        this.addProto(ProtoID.CLIENT_MIDDLE_Rig_SEER_ACCOUNT, GameLogic.rigSeerAccount);                      // 注册SEER账号
        this.addProto(ProtoID.CLIENT_MIDDLE_TRANSFER_SC, GameLogic.transferSC);                               // 资金划转到SC 取
        this.addProto(ProtoID.CLIENT_MIDDLE_RETURN_SC, GameLogic.returnSC);                                   // 资金从SC转出到账户 存
        this.addProto(ProtoID.CLIENT_MIDDLE_UPDATE_SC, GameLogic.updateBeanBySC);                             // SC内部更新资产
        this.addProto(ProtoID.CLIENT_MIDDLE_ASYNC_SEER, GameLogic.reqSeerNum);                                // 请求两个seer数值
        this.addProto(ProtoID.CLIENT_MIDDLE_WITHDRAW_SEER, GameLogic.withdrawSEER);                           // 提现SEER
    },
    /**
     * 添加消息处理
     * @param protoId
     * @param handler
     */
    addProto: function (protoId, handler) {
        this.protoMap[protoId] = handler;
    },
    /**
     * 查找消息处理器
     * @param protoId
     * @returns {*}
     */
    findProtoHandler: function (protoId) {
        return this.protoMap[protoId];
    }
};

exports = module.exports = new ProtoMap();
