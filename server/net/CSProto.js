// 消息定义
exports.ProtoID = {
    'GAME_MIDDLE_REGISTER': 1001,                       // 请求注册服务器
    'MIDDLE_GAME_REGISTER': 1002,                       // 响应服务器注册请求
    'GAME_MIDDLE_UNREGISTER': 1003,                     // 请求取消注册服务器
    'MIDDLE_GAME_UNREGISTER': 1004,                     // 响应取消注册服务器
    'GAME_MIDDLE_INC_USAGE': 1005,                      // 增加服务器用量
    'MIDDLE_GAME_INC_USAGE': 1006,                      // 响应增加服务器用量
    'GAME_MIDDLE_DEC_USAGE': 1007,                      // 减少服务器用量
    'MIDDLE_GAME_DEC_USAGE': 1008,                      // 响应减少服务器用量
    'GAME_MIDDLE_JOINED_ROOM': 1011,                    // 服务器请求加入房间
    'MIDDLE_GAME_CREATE_ROOM': 1012,                    // 服务器请求创建金币房间
    'GAME_MIDDLE_CREATE_ROOM': 1013,                    // 服务器响应创建金币房间
    'GAME_MIDDLE_SAVE_REPORTS': 1014,                   // 服务器请求保存战报
    'GAME_MIDDLE_REMOVE_PLAYER': 1015,                  // 服务器请求房间解散
    'MIDDLE_GAME_DX': 1016,                             // 中央服判断玩家断线
    'MIDDLE_GAME_PLAYER_DATA': 1017,                    // 中央服推送玩家房间数据到游戏服
    'GAME_MIDDLE_PLAYER_DATA':1018,                     // 游戏服回复保存玩家数据
    'GAME_MIDDLE_USER_LIST_REQ':1019,                   // 请求user_list数据
    'MIDDLE_GAME_USER_LIST_RESP':1020,                  // 请求user_list应答
    "MIDDLE_GAME_UPDATE_USER_LIST":1021,                // 更新user_list


    'SMSG_PING': 1100,                                  // 服务器发送PING消息
    'SMSG_PONG': 1101,                                  // 服务器响应PONG消息
    'CMSG_PONG': 1102,                                  // 客户端响应PONG消息 已作废线客户端主动发送心跳
    'CLIENT_HEARTBEAT': 1100,                           // 客户端发送给服务器的心跳包

    'CLIENT_MIDDLE_LOGIN': 1200,                        // 服务器响应的登录消息
    'CLIENT_MIDDLE_CREATE_ROOM': 1201,                  // 创建房间
    'CLIENT_MIDDLE_GET_ROOM_ADDR': 1202,                // 获取房间地址
    'CLIENT_GAME_JOIN_ROOM': 1203,                      // 客户端请求加入房间

    'CLIENT_MIDDLE_REQ_MATCH_LIST': 1204,               // 客户端请求匹配服务器列表
    'CLIENT_MIDDLE_REQ_ADD_MATCH': 1205,                // 客户端请求金币场
    'CLIENT_GAME_LEAVE_ROOM':1206,                      // 客户端请求离开(取消匹配)
    'GAME_CLIENT_ADD_ROOM':1207,                        // 广播玩家有加入房间

    'CLIENT_GAME_READY': 1208,                          // 客户端准备
    'CLEAR_ID':1209,                                    // 清楚客户端roomID

    'CLIENT_MIDDLE_LEAVE':1210,                         // 离开房间


    'GAME_CLIENT_LEVEL_ROOM': 1211,                     // 广播某个玩家退出房间
    'GAME_CLIENT_VOTE_RESUIT': 1212,                    // 广播投票结果
    'GAME_CLIENT_DX': 1213,                             // 广播某个玩家断线
    'CLIENT_MIDDLE_REQ_SHOP': 1214,                     // 客户端请求商城数据
    'CLIENT_MIDDLE_REQ_SIGN_DATA': 1215,                // 客户端请求签到
    'CLIENT_MIDDLE_REQ_SIGN': 1216,                     // 客户端请求签到
    'CLIENT_MIDDLE_REQ_REPORTS': 1217,                  // 客户端请求战绩
    'GAME_FORCE_RESTORY_ROOMID':1218,                   // 游戏服强制销毁房间

    'CLIENT_MIDDLE_REQ_GET_MAIL': 1220,                 // 客户端申请获取邮件
    'CLIENT_MIDDLE_REQ_DEL_MAIL': 1221,                 // 客户端请求删除邮件
    'CLIENT_MIDDLE_REQ_LOOK_MAIL': 1222,                // 客户端请求查看邮件
    'CLIENT_MIDDLE_REQ_GET_GOODS': 1223,                // 客户端请求获取物品

    'MIDDLE_CLIENT_RECONNECTION': 1224,                 // 玩家重连
    'GAME_MIDDLE_PLAY_LEVAL_ROOM': 1225,                // 服务器通知金币场的玩家离开房间
    'GAME_MIDDLE_CLIENT_UPDATE_MONEY': 1226,            // 更新房卡(金豆)
    'MIDDLE_CLIENT_UPDATE_SEER_MONEY': 1227,            // 更新玩家的SEER账户上的钱(没有包含SC平台的)
    'MIDDLE_CLIENT_ROLL_NOTICE': 1229,                  // 服务器推送送滚动消息
    'GAME_CLIENT_IP_SAME': 1300,                        // ip地址相同提示
    'GAME_CLIENT_TR': 1301,                             // 给客户端推送踢人的消息

    'GAME_CLIENT_ON_LINE':1303,                         // 通知玩家上线(玩家重连上线，广播给其他玩家)
    'CLIENT_GAME_DO_CHAT':1304,                         // 玩家聊天
    'CLIENT_GAME_GIFT':1305,                            // 玩家发送表情
    "CLIENT_GAME_MIDDLE_CHENG_ROOM":1306,               // 换桌
    "GAME_CLIENT_RES_CHANGE":1307,                      // 资源变化=
    "GAME_MIDDLE_REMOVE_COPY_PLAYER":1308,              // 移除复制人
    "GAME_MIDDLE_UPDATE_PLAYER_COUNTS":1309,            // 更新玩家统计数据
    "MIDDLE_CLIENT_NOTICE_MAIL":1310,                   // 新邮件通知

    "CLIENT_GAME_INPUT_CHEAT" : 1311,                   // 输入测试代码
    "MIDDLE_GAME_UPDATE_STATUS" : 1312,                 // 中央服更新金币


    "MIDDLE_CLIENT_NOTICE_UPDATE":1313,                   // 更新跑马灯
    "GAME_MIDDLE_PLAYER_KICK":1314,                      // 游戏服通知中央服某个玩家被离开游戏


    'CLIENT_GAME_CHANGE_SIGN' : 1350,                   // 修改签名
    'CLIENT_MIDDLE_PLAYERS_RANK' : 1351,                // 排行榜
    'CLIENT_MIDDLE_QUERY_BANK' : 1352,                  // 银行存取钱
    'CLIENT_MIDDLE_INPUT_PASSWORD_BANK' : 1353,         // 输入银行密码
    'CLIENT_MIDDLE_SEND_SIGN' : 1354,                   // 发送验证码
    'CLIENT_MIDDLE_CHANGE_PASSWORD_BANK' : 1355,        // 修改银行密码
    'CLIENT_MIDDLE_LEAVE_BANK' : 1356,                  // 关闭/离开银行
    'CLIENT_MIDDLE_REMEMBER_PASSWORD_BANK' : 1357,      // 记住密码
    'CLIENT_MIDDLE_QUERY_PLAYER_REPORTS' : 1358,        // 查询玩家战绩
    'CLIENT_MIDDLE_QUERY_SHOP_CONFIG' : 1359,           // 查询商城配置
    'GAME_CLIENT_ACTION_TIME' : 1360,                   // 游戏服推送动作计时消息
    'CLIENT_MIDDLE_EXCHANGE_DIAMOND' : 1361,            // 兑换钻石
    'CLIENT_MIDDLE_QUERY_BANK_BSC' : 1362,              // 银行存取钱BSC(不需要密码)
    'CLIENT_MIDDLE_DRAWING':1363,                       // 请求提款
    'CLIENT_MIDDLE_BIND_ALIPAY':1364,                   // 请求绑定支付宝
    'CLIENT_BIND_BANK':1365,                            // 绑定银行卡
    'CLIENT_MIDDLE_BANK_LOG':1366,                      // 银行卡提款记录
    'CLIENT_MIDDLE_ALIPAY_RECORD':1367,                 // 支付宝提款记录

    'GAME_MIDDLE_UPDATE_PROFIT' :1372,                  // 更新收益
    'CLIENT_MIDDLE_BIND_PRE':1376,                      // 绑定上级代理
    'MIDDLE_GAME_PROXY_LV_CHANGE':1377,                 // 通知游戏服等级改变
    'CLIENT_MIDDLE_BIND_ALL':1378,                      // 整合推广数据、整线数据、二维码信息


    'CLIENT_GAME_YAYA':1380,                            // 丫丫语音
    'CMSG_NET_WAVE': 1400,                              // 网络波动特殊接口
    'CLIENT_GAME_BIND_BSC' : 1500,                      // 绑定BSC
    'CLIENT_GAME_CHECK_BSC': 1501,                      // 查询BSC货币
    'CAME_CLIENT_WITHDRAW': 1502,                       // 提现
    'CAME_CLIENT_RECHARGE': 1503,                       // 充值
    'MIDDLE_CLIENT_BONUS' : 1510,                       // 发送奖池数量
    'CLIENT_MIDDLE_REQ_BONUS_CONFIG':1511,              // 请求奖池配置
    'CLIENT_MIDDLE_SHARE_NOTICE':1512,                  // 分享通知
    'MIDDLE_CLIENT_BONUS_HIGHT_LIGHT':1513,             // 通知客户端高亮显示
    'MIDDLE_CLIENT_BONUS_HAVE_MAIL':1514,               // 通知客户端有奖池邮件
    'CLIENT_MIDDLE_FEEDBACK':1515,                      // 客服反馈
    'CLIENT_MIDDLE_REQ_ALIPAY':1516,                    // 请求支付宝付款
    'MIDDLE_CLIENT_TIPS_ROOMID':1517,                   // 提示玩家进入哪个房间
    'GAME_MIDDLE_START_GAME':1518,                      // 通知客户端已经开始游戏
    'GAME_MIDDLE_UPDATE_LUCK':1519,                     // 更新幸运值
    'GAME_MIDDLE_UPDATE_INSERT_NOTICE':1520,            // 更新插播消息
    'CLIENT_MIDDLE_CHANGE_HEAD':1521,                   // 更改头像
    'CLIENT_BIND_PHONE':1522,                           // 绑定手机号
    'CLIENT_MIDDLE_CHANGE_PASSWORD':1523,               // 修改密码
    'CLIENT_MIDDLE_GET_SHOP_CONFIG':1524,               // 获取商城信息
    'CLIENT_MIDDLE_TASK_REQ':1525,                      // 请求任务数据
    'GAME_MIDDLE_CHECK_TASK':1526,                      // 检测任务
    'CLIENT_MIDDLE_BOON_DATA':1540,                     // 请求福利总数据
    'CLIENT_MIDDLE_BOON_REQ':1527,                      // 请求福利数据
    'CLIENT_MIDDLE_BOON_GET':1528,                      // 请求抽奖
    'CLIENT_MIDDLE_GET_TASK':1529,                      // 领取任务奖励
    'MIDDLE_CLIENT_TASK_RED':1530,                      // 任务红点

    'CLIENT_MIDDLE_REQ_BAG':1531,                       // 请求背包数据
    'CLIENT_MIDDLE_USE_ITEM':1532,                      // 使用物品
    'CLIENT_MIDDLE_UPDATE_MATCH':1533,                  // 刷新比赛卡
    'CLIENT_MIDDLE_PHONE_ENTER':1534,                   // 用户填写手机号
    'CLIENT_MIDDLE_BIND_NET':1535,                      // 用户绑定宽带
    'CLIENT_MIDDLE_BIND_TV':1536,                       // 用户绑定有线电视
    'CLIENT_MIDDLE_RECHARGE':1537,                      // 给某个用户充值话费

    'CLIENT_GAME_DESTORY_ROOM': 1549,                   // 客户端请求销毁房间<房主有效>
    'CLIENT_GAME_VOTE_ROOM': 1550,                      // 客户端请求解散房间
    'CLIENT_GAME_VOTE_AGREE': 1551,                     // 客户端请求投票解散房间
    'GAME_CLIENT_VOTE_RESULT':1552,                     // 投票结果
    'CLIENT_GAME_GAME_END':1555,                        // 游戏结束
    'CLIENT_MIDDLE_QUERY_PLAYER_REPORTS_DEALER' : 1556, // 查询玩家战绩详情
    'CLIENT_GAME_KICK_PLAYER':1557,                     // 踢人


    'GAME_MIDDLE_UPDATE_SCORE' :1571,                   // 更新比赛场积分
    'MIDDLE_CLIENT_MATCH_HAVE_MAIL':1572,               // 比赛场有宝箱
    'CLIENT_MIDDLE_MATCH_REQ_ENROOL':1573,              // 比赛场报名
    'CLIENT_MIDDLE_MATCH_REQ_RANKS':1574,               // 请求排行榜列表
    'GAME_CLIENT_MATCH_INFO':1575,                      // 更新参赛信息
    'CLIENT_MIDDLE_MATCH_RECORD':1576,                  // 获取log日志
    'CLIENT_MIDDLE_BIND_TV_NET':1577,                   // 绑宽带有线电视
    'CLIENT_MIDDLE_NAME_AUTH':1578,                     // 实名认证
    'CLIENT_MIDDLE_GEN_INVITE':1579,                    // 生成邀请码
    'CLIENT_MIDDLE_FILL_INVITE':1580,                   // 填写邀请码
    'CLIENT_MIDDLE_REWARD_EXPLAIN':1581,                // 奖励说明



    // 好友系统
    'CLIENT_MIDDLE_OPEN_FRIEND':1640,                  // 打开好友界面
    'CLIENT_MIDDLE_ADD_FRIEND_REQ':1641,               // 请求加好友
    'CLIENT_MIDDLE_ADD_FRIEND_RESULT':1642,            // 申请好友结果
    'CLIENT_MIDDLE_FRIEND_LIST':1643,                  // 请求好友列表
    'CLIENT_MIDDLE_REMOVE_FRIEND':1644,                // 移除好友
    'CLIENT_MIDDLE_REQ_NOTICE':1645,                   // 请求通知
    'CLIENT_MIDDLE_CHECK_CHAT_RECORD':1646,            // 点击和某人聊天了 红点用
    'CLIENT_MIDDLE_CHAT':1647,                         // 聊天
    'CLIENT_MIDDLE_GIVE_BEAN':1648,                    // 赠送金豆
    'CLIENT_MIDDLE_GIVE_RESULT':1649,                  // 赠送结果
    'CLIENT_MIDDLE_BATCH':1650,                        // 换一批
    'CLIENT_MIDDLE_SEARCH':1651,                       // 搜索
    'CLIENT_MIDDLE_CLOSE_CHAT_WINDOW':1652,            // 关闭聊天窗口
    'MIDDLE_CLIENT_CHAT_RED':1653,                     // 聊天红点
    'MIDDLE_CLIENT_TAG_RED':1654,                      // 大标签红点
    'CLIENT_MIDDLE_CLOSE_FRIENDS_WINDOW':1655,         // 关闭整个好友窗口
    'MIDDLE_CLIENT_WORLD_RED':1656,                    // 最外层红点判断


    'CLIENT_MIDDLE_GET_BIG_HORN':1700,                 // 获取大喇叭消息
    'CLIENT_MIDDLE_SEND_HORN_MSG':1701,                // 发送喇叭消息
    'MIDDLE_CLIENT_SEND_HORN_MSG':1702,                // 广播增加了一条喇叭消息

    'CLIENT_MIDDLE_APPLY_SUBSIDY':1705,                // 申请领取破产补助
    'MIDDLE_CLIENT_POP_MESSAGE':1706,                  // 弹出消息
    'MIDDLE_CLIENT_BOON_RED':1707,                     // 红点检测

    'CLIENT_MIDDLE_GET_SIGN_DATA':1710,                // 获取签到数据
    'CLIENT_MIDDLE_REWARD_SIGN_DATA':1711,             // 领取签到奖励

    'CLIENT_MIDDLE_REQ_NEW_SHOP':1715,                 // 请求商城数据2号
    'CLIENT_MIDDLE_BUY_GOODS':1716,                    // 请求购买商品2号

    'CLIENT_MIDDLE_REQ_CONVERT':1720,                  // 兑换物品
    'CLIENT_MIDDLE_GIVE_GOODS':1721,                   // 赠送物品
    'CLIENT_MIDDLE_GET_BAG_RECORD':1722,               // 背包记录详情
    'MIDDLE_CLIENT_BAG_RED':1723,                      // 背包详情红点
    'MIDDLE_CLIENT_EXIT_GAME':1724,                    // 强制玩家退出当前游戏

    'CLIENT_MIDDLE_BIND_PFC':1801,                     // 绑定PFC
    'CLIENT_MIDDLE_QUERY_PFC':1802,                    // 查询PFC
    'CLIENT_MIDDLE_REBIND_PFC':1803,                   // 再次绑定PFC
    'CLIENT_MIDDLE_RECHARE_PFC':1804,                  // 充值PFC
    'CLIENT_MIDDLE_WITHDRAW_PFC':1805,                 // 提现PFC
    'CLIENT_MIDDLE_PFC_IN':1806,                       // 点击PFC商城入口
    'CLIENT_MIDDLE_PFC_RECHARGE_RECORDS':1807,         // 获取PFC充值记录
    'CLIENT_MIDDLE_SWITCH_ADDRESS':1808,               // 切换PFC提现地址
    'CLIENT_MIDDLE_PFC_WITHDRAW_RECORDS':1809,         // 获取PFC提下记录
    'CLIENT_MIDDLE_PFC_PASSWORD':1810,                 // 设置PFC密码
    'CLIENT_MIDDLE_PFC_GET_WITHDRAW_NUM':1811,         // 获取提币数量

    'CLIENT_MIDDLE_REQ_FK_LIST':1900,                  // 请求房卡场列表
    'MIDDLE_GAME_REQ_FK_LIST':1901,                    // 中央服像游戏服请求列表
    'GAME_MIDDLE_RESP_FK_LIST':1902,                   // 游戏服返回房卡列表
    'CLIENT_MIDDLE_REQ_FK_LIST_PRE':1903,              // 请求房卡列表上一页
    'CLIENT_MIDDLE_REQ_FK_LIST_NEXT':1904,             // 请求房卡列表下一页

    'CLIENT_MIDDLE_Rig_SEER_ACCOUNT':2000,             // 请求注册SEER账号
    'CLIENT_MIDDLE_TRANSFER_SC':2001,                  // 请求划转资金到平台
    'CLIENT_MIDDLE_RETURN_SC': 2002,                   // 请求赎回资金
    'CLIENT_MIDDLE_UPDATE_SC': 2003,                   // 内部划转(测试用)
    'CLIENT_MIDDLE_ASYNC_SEER':2004,                   // 请求账户上的seer和平台划转的seer数量
    'CLIENT_MIDDLE_WITHDRAW_SEER':2005,                // 提现SEER
    /*------------------------------麻将--------------------------------*/
    //客户端主动请求消息
    "CLIENT_GAME_DO_PLAY_MJ": 11003,                    // 请求出牌
    "CLIENT_GAME_DO_PENG": 11004,                       // 玩家请求碰牌
    "CLIENT_GAME_DO_GANG": 11005,                       // 请求杠牌
    "CLIENT_GAME_DO_CHI": 11006,                        // 请求吃牌
    "CLIENT_GAME_DO_HU": 11007,                         // 请求胡
    "CLIENT_GAME_DO_PASS_MJ": 11008,                    // 请求过
    "CLIENT_GAME_TG": 11009,                            // 客户端向服务器请求托管
    "CLIENT_GAME_AGAINGAME": 11010,                     // 客户端请求再来一局
    "CLIENT_GAME_START_GA": 11012,                      // 上嘎请求
    "CLIENT_GAME_PLUS_CARDS": 11013,                    // 请求剩余牌
    "CLIENT_GAME_MODIFY_CARDS":11014,                   // 修改底牌
    // 服务器主动推送消息
    "GAME_CLIENT_START_ANIMATION": 11101,               // 推送动画开始消息
    "GAME_CLIENT_START_NEW_ROUND": 11102,               // 广播新一轮开始
    "GAME_CLIENT_OUT_CARD_PLAYER_MJ": 11103,            // 哪个玩家出牌
    "GAME_CLIENT_INIT_CARD_MJ": 11104,                  // 推送初始牌

    "GAME_CLIENT_DRAW_CARD": 11106,                     // 广播玩家摸牌
    "GAME_CLIENT_DJJS": 11109,                          // 单局决算
    "GAME_CLIENT_ZJS": 11110,                           // 总结算
    "GAME_CLIENT_EXIT_ROOM": 11111,                     // 退出房间消息
    "GAME_CLIENT_HUA_CARD": 11113,                      // 广播某个玩家摸到了花牌
    "GAME_CLIENT_START_GA": 11114,                      // 通知玩家开始上嘎

    "GAME_CLIENT_PGTH_INFO": 11115,                     // 推送碰杠听胡消息
    "GAME_CLIENT_UP_GA_END": 11116,                     // 上噶结束
    "CAME_CLIENT_PLUS_CARD": 11117,                     // 剩余的牌
    "GAME_CLIENT_TASK_END" : 11118,                     // 服务器挂起的任务结束
    "GAME_CLIENT_TINGS": 11119,                         // 听牌消息
    /*------------------------------斗地主--------------------------------*/
    //客户端主动请求消息
    "CLIENT_GAME_GRAB": 12001,                          // 玩家抢牌
    "CLIENT_GAME_CUE": 12002,                           // 玩家提示
    "CLIENT_GAME_DO_PLAY_DDZ": 12003,                   // 玩家出牌
    "CLIENT_GAME_DO_PASS_DDZ": 12004,                   // 玩家过牌
    "CLIENT_GAME_SELECT_CARDS": 12005,                  // 筛选牌
    "CLIENT_GAME_TG_DDZ": 12006,                        // 客户端请求托管
    "CLIENT_GAME_DOUBLE_DDZ": 12007,                    // 请求加倍
    //服务器主动推送消息
    "GAME_CLIENT_PLAYER_ADD": 12100,                    // 广播哪个玩家加入
    "GAME_CLIENT_ROOM_INIT_INFO": 12101,                // 有玩家加入返回房间信息
    "GAME_CLIENT_NEW_ROUND_DDZ": 12102,                 // 新一局开始
    "GAME_CLIENT_INIT_CARD_DDZ": 12103,                 // 给玩家发初始的牌
    "GAME_CLIENT_START_ROB_LORD":12104,                 // 开始叫地主 <此消息暂定>
    "GAME_CLIENT_START_GRAB":12105,                     // 抢地主
    "GAME_CLIENT_CONFIRM_FARM":12106,                   // 确定地主
    "GAME_CLIENT_START_OUT_CARD":12107,                 // 开始出牌
    "GAME_CLIENT_BET_CHANG_DDZ":12108,                  // 斗地主房间倍数变化
    "GAME_CLIENT_OUT_POS_CHANGE":12109,                 // 出牌位置改变
    "GAME_CLIENT_SETTLEMENT_INFO": 12110,               // 发送结算消息
    "GAME_CLIENT_POLICE": 12111,                        // 发送报警消息
    "GAME_CLIENT_START_DOUBLE":12112,                   // 开始双倍

    /*-----------------------------象棋------------------------------------*/

    // 客户端主动请求
    "GAME_CLIENT_GIVE_UP_XQ": 13000,                    // 认输
    "GAME_CLIENT_SELECT_CHESS_XQ": 13001,               // 选择棋子
    "GAME_CLIENT_MOVE_CHESS_XQ": 13002,                 // 走棋
    "GAME_CLIENT_REGRET_CHESS_XQ": 13003,               // 悔棋
    "GAME_CLIENT_CHANGE_BASE_BEAN_XQ": 13004,            // 修改底分
    // 服务器主动推送消息
    "GAME_CLIENT_ADD_ROOM_XQ": 13100,                   // 玩家加入房间
    "GAME_CLIENT_OTHER_ADD_XQ": 13101,                  // 有其他玩家加入
    "GAME_CLIENT_START_NEW_ROUND_XQ": 13102,            // 开始新的一轮
    "GAME_CLIENT_CUR_PLAYER_XQ": 13103,                 // 当前玩家
    "GAME_CLIENT_CHECKMATE_CHESS_XQ": 13104,            // 将军
    "GAME_CLIENT_CHI_CHESS_XQ": 13105,                  // 吃
    "GAME_CLIENT_SETTLEMENT_XQ": 13106,                 // 结算
    // "GAME_CLIENT_SETTLEMENT_XQ": 13104,                 // 结算
    // "GAME_CLIENT_SETTLEMENT_XQ": 13104,                 // 结算

    /*-----------------------------拼三张----------------------------------*/
    // 客户端主动请求
    "CLIENT_GAME_SEE_CARD" : 14000,                     // 看牌
    "CLIENT_GAME_DO_PASS_PSZ":14001,                    // 弃牌
    "CLIENT_GAME_ADD_STAKE":14002,                      // 加注
    "CLIENT_GAME_FOLLOW_STAKE":14003,                   // 跟注
    "CLIENT_GAME_AUTO_FOLLOW_STAKE":14004,              // 自动跟注
    "CLIENT_GAME_DO_CHECK":14005,                       // 查牌
    "CLIENT_GAME_CHECK_COMPLETE":14006,                 // 查牌完成(用于动画显示)
    // 服务器主动推送消息
    "GAME_CLIENT_ADD_ROOM_PSZ": 14100,                  // 玩家加入房间
    "GAME_CLIENT_OTHER_ADD_PSZ": 14101,                 // 有其他玩家加入
    "GAME_CLIENT_START_NEW_ROUND__PSZ": 14102,          // 开始新的一轮
    "GAME_CLIENT_INIT_CARD_PSZ": 14103,                 // 初始牌信息
    "GAME_CLIENT_OUT_CARD_PLAYER_PSZ": 14104,           // 自动出牌
    "GAME_CLIENT_SETTLEMENT_PSZ" : 14105,               // 结算消息
    "GAME_CLIENT_SEE_CARD": 14106,                      // 广播有人看牌
    "GAME_CLIENT_SET_BEAN_INFO":14107,                  // 设置广播内金豆加注等信息
    "GAME_CLIENT_NEW_ROUND_STAKE":14108,                // 开始游戏玩家扔底注
    "GAME_CLIENT_ALL_ROUND_CHECK":14109,                // 全桌查牌

    /*-----------------------------拼十----------------------------------*/
    // 客户端主动请求

    "CLIENT_GAME_ROB_PS" : 15000,                     // 抢庄
    "CLIENT_GAME_BET_PS" : 15001,                     // 下注
    "CLIENT_GAME_PLAY_PS" : 15002,                     // 亮牌

    // 服务器主动推送消息
    "GAME_CLIENT_ADD_ROOM_PS": 15100,                   // 玩家加入房间
    "GAME_CLIENT_OTHER_ADD_PS": 15101,                  // 有其他玩家加入
    "GAME_CLIENT_START_NEW_ROUND_PS": 15102,            // 开始新的一轮
    "GAME_CLIENT_INIT_CARD_PS": 15103,                  // 初始牌信息
    "GAME_CLIENT_OUT_CARD_PLAYER_PS": 15104,            // 自动出牌
    "GAME_CLIENT_SETTLEMENT_PS" : 15105,                // 结算消息
    "GAME_CLIENT_PLAYER_CARD_PS": 15106,                // 给玩家发牌
    "GAME_CLIENT_START_ROB": 15107,                     // 开始抢庄
    "GAME_CLIENT_PLAYER_NEW_CARD": 15108,               // 下注后发牌
    "GAME_CLIENT_END_ROB": 15109,                       // 抢庄结束
    "GAME_CLIENT_START_BET": 15110,                     // 开始下注
    "GAME_CLIENT_PLAYER_BET": 15111,                    // 玩家下注
    "GAME_CLIENT_END_BET": 15112,                       // 结束下注
    "GAME_CLIENT_START_PLAY": 15113,                    // 开始亮牌
    "GAME_CLIENT_DEALER_PLAY": 15114,                   // 庄家亮牌
    "GAME_CLIENT_END_PLAY": 15115,                      // 结束亮牌
    "GAME_CLIENT_CHANGE_DEALER": 15116,                 // 庄家改变

    /*-----------------------------虎棒虫鸡令----------------------------------*/

    // 客户端主动请求
    "CLIENT_GAME_SELECT_TYPE_HBC" : 16000,                     // 选择类型
    "CLIENT_GAME_CHANGE_BASE_BEAN_HBC" : 16001,                // 底分改变

    // 服务器主动推送消息

    "GAME_CLIENT_ADD_ROOM_HBC": 16100,                   // 玩家加入房间
    "GAME_CLIENT_OTHER_ADD_HBC": 16101,                  // 有其他玩家加入
    "GAME_CLIENT_START_NEW_ROUND_HBC": 16102,            // 开始新的一轮

    "GAME_CLIENT_SETTLEMENT_HBC": 16105,                // 结算消息

    /*----------------------------跑得快--------------------------------------*/
    "GAME_CLIENT_NEW_ROUND_PDK":17000,                  // 跑得快开局
    "CLIENT_GAME_CUE_PDK": 17002,                       // 玩家提示
    "CLIENT_GAME_DO_PLAY_PDK": 17003,                   // 跑得快玩家出牌
    "CLIENT_GAME_DO_PASS_PDK": 17004,                   // 跑得快玩家过牌
    "CLIENT_GAME_SELECT_CARDS_PDK":17005,               // 跑得快选牌
    "CLIENT_GAME_TG_PDK": 17006,                        // 客户端请求托管


    "GAME_CLIENT_INIT_CARD_PDK": 17101,                 // 给玩家发初始的牌
    "GAME_CLIENT_OUT_POS_CHANGE_PDK":17102,             // 跑得快出牌通知客户端该哪个玩家出牌
    "GAME_CLIENT_BET_CHANG_PDK":17103,                  // 跑得快房间倍率变化
    "GAME_CLIENT_ZD_COUNT_CHANGE":17104,                // 玩家身上的炸弹数量改变
    "GAME_CLIENT_ZD_SUV":17105,                         // 存活炸弹的信息
    "GAME_CLIENT_DEALER":17106,                         // 存活炸弹的信息

    "GAME_CLIENT_SETTLEMENT_INFO_PDK": 17110,           // 发送结算消息

    /*---------------------------血战麻将---------------------------------------*/
    "GAME_CLIENT_START_NEW_ROUND_XZ":18000,             // 血战麻将开局
    "CLIENT_GAME_REQ_HSZ": 18001,                       // 请求换三张
    "CLIENT_GAME_REQ_DQ": 18002,                        // 请求定缺
    "CLIENT_GAME_DO_PLAY_XZMJ": 18003,                  // 请求出牌
    "CLIENT_GAME_DO_CHI_XZMJ": 18004,                   // 请求吃牌
    "CLIENT_GAME_DO_PENG_XZMJ":18005,                   // 请求碰牌
    "CLIENT_GAME_DO_GANG_XZMJ": 18006,                  // 请求杠牌
    "CLIENT_GAME_DO_PASS_XZMJ":18007,                   // 请求过牌
    "CLIENT_GAME_DO_HU_XZMJ":18008,                     // 请求胡牌
    "CLIENT_GAME_TG_XZMJ":18009,                        // 请求托管
    "CLIENT_GAME_GET_MISS":18010,                       // 获取换牌的信息
    "CLIENT_GAME_REQ_TING":18011,                       // 请求听牌
    "CLIENT_GAME_PVP_DATA":18012,                       // 请求PVP数据


    "GAME_CLIENT_START_HSZ":18100,                      // 通知客户端开始换三张操作
    "GAME_CLIENT_HSZ_OVER":18101,                       // 通知客户端结束换三张操作
    "GAME_CLIENT_START_DQ":18102,                       // 通知客户端开始定缺
    "GAME_CLIENT_INIT_CARD_XZMJ":18103,                 // 初始化玩家手里的牌
    "CAME_CLIENT_PLUS_CARD_XZMJ":18104,                 // 剩余x张牌
    "GAME_CLIENT_OUT_CARD_PLAYER_XZMJ": 18105,          // 通知出牌玩家
    "GAME_CLIENT_PGTH_INFO_XZMJ": 18106,                // 推送碰杠听胡消息
    "GAME_CLIENT_DRAW_CARD_XZMJ":18107,                 // 血战摸牌
    "GAME_CLIENT_TASK_END_XZMJ" :18108,                 // 服务器挂起的任务结束
    "GAME_CLIENT_DJJS_XZMJ": 18109,                     // 单局决算
    "GAME_CLIENT_TINGS_XZMJ": 18110,                    // 听牌消息
    "GAME_CLIENT_DQ_END":18111,                         // 定缺结束
    "GAME_CLIENT_TING_INFO":18112,                      // 听牌变化的消息
    "GAME_CLIENT_POP_BTN":18113,                        // 强制弹出下一局
    "GAME_CLIENT_SETT_DATA":18114,                      // 18114结算数据
    "GAME_CLIENT_BOUT":18115,                           // 广播出局
    "GAME_CLIENT_SCORE":18116,                          // 事实不播报玩家的分数增减情况
    "GAME_CLIENT_SYNC_CARD_MJ": 18117,                  // 推送初始牌
    "GAME_CLIENT_DELETE_QGH":18118,                     // 删除抢杠胡的那张牌
    "GAME_CLIENT_ADD_HU_MJ":18119,                      // 增加胡牌麻将
};
/**
 * log事件类型
 */
exports.eveIdType = {
    "CREATE_ROOM": 1,                                   // 开房消耗
    "MATCH": 2,                                         // 比赛输赢
    "MAIL_GET": 3,                                      // 邮件获取
    "RECHARGE": 4,                                      // 充值获取
    "SERVER_COST":6,                                    // 服务费
    "BANK_UPDATE": 7,                                   // 银行更新
    "BSC_RECHARGE":8,                                   // BSC充值获取
    "BSC_WITH":9,                                       // BSC提现
    "GM":10,                                            // GM增加或者减少
    "WITH":11,                                          // 提现
    "WITH_RETURN":12,                                   // 提现失败返还
    "TASK":13,                                          // 任务获取
    "BoonConsume":14,                                   // 抽奖消耗
    "BoonGet":15,                                       // 抽奖获得
    "RESET_MATCH":16,                                   // 重置比赛场
    "Horn":17,                                          // 大喇叭消耗
    "SUBSIDY":18,                                       // 破产补助
    "FRIEND_GIVE":19,                                   // 好友赠送
    "BUY_SHOP":20,                                      // 商城购买
    "SIGN":21,                                          // 新手签到获得
    "CONVERT":22,                                       // 礼品码兑换
    "BAG_GIVE":23,                                      // 背包赠送
    "PFC_RECHARGE":24,                                  // PFC充值获得
    "PFC_WITHDRAW":25,                                  // PFC提现(主要针对金豆提现)
    "EXIT_SHUI":26,                                     // 退税
    "SEER_WITHDRAW":27                                  // SEER提币
};
/**
 * 公司财务出入账单类型
 * @type {{}}
 */
exports.financeType = {
    "SERVER_COST":1,                                    // 比赛服务费(入账)
    "RECHARGE":2,                                       // 公司内部充值(入账)
    "NODE_REWARD":3,                                    // 节点奖励(出账)
    "WITHDRAW_COST":4,                                  // 提现服务费(入账)
    "BOON_CONSUME":5,                                   // 抽奖消耗(入账)
    "BOON_GET":6,                                       // 抽奖获得(出账)
    "TASK_GET":7,                                       // 任务奖励(出账)
    "BIG_HORN":8,                                       // 大喇叭(入账)
};
/**
 * 资源改变事件 用于客户端显示
 * @type {{}}
 */
exports.resEvent = {
    "PSZ_CHANGE" : 1,                                   // 拼三张改变
    "DDZ_CHANGE" : 2,
    "PS_CHANGE" : 3,
    "MJ_CHANGE" :4,
    "PDK_CHANGR":5
};
/**
 * 服务器事件类型
 * @type {{}}
 */
exports.GameEveId = {
    "GAME_CAPACITY":1,                                   // 各个游戏服务器的房间数量
};
/**
 * 服务器事件类型
 * @type {{}}
 */
exports.GameEveId = {
    "GAME_CAPACITY":1,                                   // 各个游戏服务器的房间数量
};
/**
 * 动作分类
 * @type {{NONE: number, READY: number, PSZ_PLAY: number}}
 */
exports.ActionType = {
    "NONE":0,
    "READY":1,
    "JS_ROOM":2,        // 发起解散房间
    "MJ_GA" : 101,      // 选择噶分
    "MJ_CPGH":102,      // 麻将有吃碰杠过的行为
    "DDZ_QIANG":201,    // 斗地主抢地主
    "DDZ_PLAY":202,     // 斗地主走牌
    "DDZ_DOUBLE":203,   // 斗地主加倍
    "PSZ_PLAY":401,
    "PS_ROB": 501,      //拼十抢庄
    "PS_BET": 502,      //拼十下注
    "PS_PLAY": 503,     //拼十亮牌
    "PDK_PLAY":701,     //跑得快开始出牌

    "XZ_HSZ":801,       //血战开始换三张
    "XZ_DQ":802,        //血战定缺
    "XZ_PLAY":803,      //血战开始游戏
    "XZ_GRAB":804,      //血战抢牌
};

exports.MailStatus = {
    "NO_READ_NO_GET" : 1,       // 未读未领
    "NO_READ_GET"    : 2,       // 未读已领取<泛指没有物品的邮件>
    "READ_NO_GET"    : 3,       // 已读未领
    "READ_GET"       : 4        // 已读已领
};
/**
 * 错误码
 */
exports.ProtoState = {
    'STATE_OK': 0,                                      // 处理成功
    'STATE_FAILED': 1,                                  // 处理失败
    // 登录
    'STATE_LOGIN_FAILED': 2,                            // 登录失败
    'STATE_LOGIN_ON_LINE': 3,                           // 玩家在线
    'STATE_LOGIN_BLACK': 4,                             // 该账号以被冻结
    'STATE_LOGIN_OFFLINE': 5,                           // 玩家不在线
    "STATE_LOGIN_MAINTAIN":6,                           // 服务器维护中
    'STATE_ROOM_ERROR':7,                               // 房间异常，请稍后再试
    'STATE_PLAYER_NO_EXIST':8,                          // 玩家不存在
    'STATE_PLAYER_IS_GM':9,                             // 该玩家已经是总代了
    // 游戏
    'STATE_GAME_NOT_SUPPORT': 20,                       // 游戏类型不支持
    'STATE_GAME_JOIN_A_ROOM': 21,                       // 已经加入了一个房间
    'STATE_GAME_CREATE_ROOM_FAILED': 22,                // 服务器繁忙
    'STATE_GAME_JOIN_ROOM_FAILED': 23,                  // 加入房间失败
    'STATE_GAME_JOIN_ROOM_IDERROR': 24,                 // 输入房间号不正确
    'STATE_GAME_ID_ERROR': 25,                          // 用户id不存在
    'STATE_GAME_BEAN_LESS': 26,                         // 金币不足
    'STATE_GAME_CARD_LESS': 27,                         // 房卡不足
    'STATE_GAME_MAIL_NOEXIST': 28,                      // 邮件不存在
    'STATE_GAME_ROOMFUll': 29,                          // 房间人已满
    'STATE_GAME_PARAM_ERROR': 30,                       // 传递参数错误
    "STATE_GAME_TYPE_ERROR": 31,                        // 牌型不对
    "STATE_GAME_CARD_SMALL": 32,                        // 比上家牌小
    "STATE_GAME_ALREADY_START":33,                      // 游戏已经开始
    "STATE_GAME_MAIL_TYPE_ERROR":34,                    // 邮件内没有物品
    "STATE_GAME_MAIL_READY_GET":35,                     // 物品已领取
    "STATE_GAME_NOT_HUA_CARD":36,                       // 不能出花牌
    "STATE_GAME_CHESS_MOVE_ERROR":37,                   // 棋子移动错误
    "STATE_GAME_CHESS_CHECKMATE":38,                    // 被将军中
    "STATE_GAME_BANK_ERROR":39,                         // 提取银行必须是整百
    // "STATE_GAME_CHESS_MOVE_ERROR":39,                       // 不能出花牌

    "STATE_BSC_BIND_FAIL":40,                           // 绑定bsc失败
    "STATE_BSC_CHECK_FAIL":41,                          // 查询bsc余额失败
    "STATE_BSC_WITH_FAIL":42,                           // bsc提现失败
    "STATE_BSC_RECHARGE":43,                            // bsc积分充值失败
    "STATE_GAME_FEED_LIMITE":44,                        // 反馈次数已达到最大
    "STATE_PHONE_PASSWORD_LOSE":45,                     // 密码太短
    "STATE_PHONE_ERROR":46,                             // 手机号不合法
    "STATE_PHONE_READY_REG":47,                         // 已经注册过
    "STATE_SMS_ERROR":48,                               // 验证码错误
    "STATE_WITH_MIN_BL":49,                             // 提现小于最小保留
    "STATE_TASK_STATUS_ERROR":50,                       // 任务未完成或已领取
    "STATE_TASK_ID_ERROR":51,                           // 任务id错误
    "STATE_BOON_COUNT_LESS":52,                         // 抽奖次数不足
    "STATE_PHONE_PASSWORD_LIMITE":53,                   // 密码长度限制
    "STATE_GAME_ONLY_ONE":54,                           // 只能创建一个房间

    "STATE_MATCH_NO_EXIST":60,                          // 比赛号码不存在
    "STATE_MATCH_READY_USE":61,                         // 比赛卡已使用
    "STATE_MATCH_MATCHING":62,                          // 玩家已经参加了比赛
    "STATE_MATCH_DAY_EFFECT":63,                        // 日卡生效中
    "STATE_MATCH_WEEK_EFFECT":64,                       // 周卡生效中
    "STATE_MATCH_MONTH_EFFECT":65,                      // 月卡生效中
    "STATE_INVITE_READY_INVITE":66,                     // 邀请码已经填写
    "STATE_INVITE_INVITE_ERROR":67,                     // 邀请码错误

    "STATE_GAME_BASE_BEAN_ERROR":70,                    // 创建房间底分输入错误(必须是5000的整数倍)

    "STATE_KICK_JB_NOT_KICK":80,                        // 金币场不能踢人
    "STATE_KICK_PLAYING":81,                            // 游戏已经开始了
    "STATE_KICK_SELF":82,                               // 不能踢自己
    "STATE_KICK_NO_CREATOR":83,                         // 不是房主没有权限踢人

    "STATE_GAME_XZ_HSZ_ERROR":90,                       // 换三张传递错误的牌型
    "STATE_GAME_XZ_HSZ_MJID_ERROR":91,                  // 换三张传递了不存在的麻将
    "STATE_GAME_XZ_DQ_MJID_ERROR":92,                   // 定缺的牌没走完


    // 推广员
    "STATE_APPLAY_EXTEND_FINISH": 200,                  // 已经成为推广员
    "STATE_EXTEND_PHONE_REPEAT": 201,                   // 手机号重复
    "STATE_APPLY_SQL_ERROR": 202,                       // 数据库出错
    "STATE_EXTEND_HOUSE_NAME_LEGAL":203,                // 包含敏感词
    "STATE_EXTEND_PROXY_MAX":204,                       // 代理等级已达到最大
    "STATE_EXTEND_PROXY_LV_LESS":205,                   // 代理等级不足
    "STATE_EXTEND_NEXT_LESS":206,                       // 下级玩家不足
    "STATE_EXTEND_NEXT_PROFIT_LESS":207,                // 下级产生的收益不足
    "STATE_EXTEND_HOUSE_NAME_REPEAT":208,               // 茶馆名字重复
    "STATE_EXTEND_HOUSE_NAME_TOO_LONG":209,             // 茶馆名字太长
    "STATE_EXTEND_TICKET_IS_EXIST":210,                 // 二维码已经存在
    "STATE_EXTEND_TICKET_FAIL":211,                     // 申请二维码失败
    "STATE_EXTEND_NOTICE_TOO_LONG":212,                 // 公告太长
    "STATE_EXTEND_READY_BIND":213,                      // 已经绑定了推广员
    "STATE_EXTEND_BIND_NEXT":214,                       // 不能绑定您的下级uid
    "STATE_EXTEND_BIND_SELF":215,                       // 不能绑定自己

    // 好友系统
    "STATE_FRIEND_NO_EXIST":360,                         // 好友不存在
    "STATE_FRIEND_APPLY_NO_EXIST":361,                   // 申请列表的好友不存在
    "STATE_FRIEND_NO_EACH_FRIEND":362,                   // 不是互为好友
    "BEAN_PASS_MAX":363,                                 // 赠送的金豆超过最大值
    "GIVE_NUM_PASS_MAX":364,                             // 赠送的次数超过最大
    "ALREADY_FRIENDS":365,                               // 已经是好友了
    "ALREADY_ADD_FRIENDS":366,                           // 已经请求添加对方为好友，请等待对方同意
    "ALREADY_GIVE_GET":367,                              // 已领取或者已经拒绝领取了礼物
    "PLAYER_NOT_FIND":368,                               // 玩家未发现
    "STATE_NO_ADD_SELF":369,                             // 不能加自己为好友
    "STATE_FRIEND_MSG_IS_NULL":370,                      // 消息不能为空

    // 破产补助
    "STATE_BEAN_TOO_LONG":380,                           // 金币太多
    "STATE_COUNT_LIMITE":381,                            // 破产申请已打上限

    // 物品类
    "GOOD_NO_EXIT":390,                                  // 物品不存在
    "GOOD_COUNT_LESS":391,                               // 购买次数不足
    "GOOD_WEEK_LESS":392,                                // 可购买的总数不足
    "DIAMOND_LESS":393,                                  // 砖石不足
    "NOT_GIVE_SELF":394,                                 // 不能赠送给自己

};

exports.TASK = {
    "countType" : {"once": 1, "repeat": 2},                                 // 任务类型
    "reward":{"bean":1, "lottery":2, "diamond":3},                          // 奖励 1:金豆 2:彩票积分 3:砖石
    "gameLimit":{"all":0, "mj":1, "ddz":2, "xq":3, "psz":4, "ps": 5},       // 游戏类型限制
    "contentType":{
                    "match":  1,                                            // 对战多少局
                    "maxBean": 2,                                           // 单局达到多少分
                    "zdNum":3,                                              // 打出多少炸弹(仅对斗地主、跑得快有效)
                    "spring":4,                                             // 打出多少春天(仅对斗地主生效)
                    "notStopWin":5,                                         // 连续赢得xx把
                    "farmer":6,                                             // 当地主xx把(仅对斗地主生效)
                    "kingBoomNum":7,                                        // 一天内打出xx王炸(仅对斗地主生效)

                    "bigShut":8,                                            // 一天赢得xx次大关(仅对跑得快生效)
                    "smallShut":9,                                          // 一天赢得xx次小关(仅对跑得快生效)

                    "selfStroke":10,                                         // 自摸xx次(仅对麻将生效)
                    "qys_hu":11,                                            // 清一色胡xx次(仅对麻将生效)
                    "dui_hu":12,                                            // 对胡x次(仅对麻将生效)
                    "qgh_hu":13,                                            // 抢杠胡x次(仅对麻将生效)
                    "ssy_hu":14,                                            // 十三幺胡x次(仅对麻将生效)
                    "pp_hu":15,                                             // 碰碰胡x次(仅对麻将生效)

                    "HU_19":16,                                             // 胡19
                    "HU_JD":17,                                             // 将对
                    "HU_MQ":18,                                             // 胡门清
                    "HU_ZZ":19,                                             // 中张
                    "HU_JGD":20,                                            // 金钩钓
                    "HU_TH":21,                                             // 天胡
                    "HU_DH":22,                                             // 地胡
                  },
    "status":{"noComplete":0, "complete":1,"receive": 2}                    // 未完成、完成、领取
};

exports.GIVECARD = {subPub:1, realName:2, invite:3};


exports.MAX_PUBLIC_GAME = 11000;                        // 最大游戏码
