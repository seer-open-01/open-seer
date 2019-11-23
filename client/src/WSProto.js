/******************************************************************************
 * Author:      671643387
 * Created:     2016/10/25
 *****************************************************************************/

var protocol = {};

// 消息定义
protocol.ProtoID = {
    "GAME_MIDDLE_REGISTER"          : 1001,     // 请求注册服务器
    "MIDDLE_GAME_REGISTER"          : 1002,     // 响应服务器注册请求
    "GAME_MIDDLE_UNREGISTER"        : 1003,     // 请求取消注册服务器
    "MIDDLE_GAME_UNREGISTER"        : 1004,     // 响应取消注册服务器
    "GAME_MIDDLE_INC_USAGE"         : 1005,     // 增加服务器用量
    "MIDDLE_GAME_INC_USAGE"         : 1006,     // 响应增加服务器用量
    "GAME_MIDDLE_DEC_USAGE"         : 1007,     // 减少服务器用量
    "MIDDLE_GAME_DEC_USAGE"         : 1008,     // 响应减少服务器用量
    "MIDDLE_GAME_CREATE_FKROOM"     : 1009,     // 服务器请求创建房卡房间
    "GAME_MIDDLE_CREATE_FKROOM"     : 1010,     // 服务器响应创建房卡房间
    "GAME_MIDDLE_JOINED_ROOM"       : 1011,     // 服务器请求加入房间
    "MIDDLE_GAME_CREATE_JBROOM"     : 1012,     // 服务器请求创建金币房间
    "GAME_MIDDLE_CREATE_JBROOM"     : 1013,     // 服务器响应创建金币房间
    "GAME_MIDDLE_SAVE_REPORTS"      : 1014,     // 服务器请求保存战报
    "GAME_MIDDLE_DESTROY_ROOM"      : 1015,     // 服务器请求房间解散
    "MIDDLE_GAME_DX"                : 1016,     // 中央服判断玩家断线
    "MIDDLE_GAME_PLAYER_DATA"       : 1017,     // 中央服推送玩家数据到游戏服

    "CLIENT_HEARTBEAT"              : 1100,     // 客户端发送给服务器的心跳包

    "CLIENT_MIDDLE_LOGIN"           : 1200,     // 服务器响应的登录消息
    "CLIENT_MIDDLE_CREATE_ROOM"     : 1201,     // 创建房间
    "CLIENT_MIDDLE_GET_ROOM_ADDR"   : 1202,     // 获取房间地址
    "CLIENT_GAME_JOIN_ROOM"         : 1203,     // 客户端请求房间数据

    "CLIENT_MIDDLE_REQ_MATCH_LIST"  : 1204,     // 客户端请求匹配服务器列表
    "CLIENT_MIDDLE_REQ_ROOM_LIST"   : 1900,     // 客户端请求自建匹配场
    "CLIENT_MIDDLE_REQ_ADD_MATCH"   : 1205,     // 客户端请求金币场
    "CLIENT_ROOM_LIST_NEXT"         : 1904,     // 自建金币场下一页
    "CLIENT_ROOM_LIST_BEFORE"       : 1903,     // 自建金币场上一页
    // 游戏公共消息Id
    "GAME_CLIENT_QUIT_ROOM"         : 1206,     // 客户端主动请求离开游戏(取消匹配) 服务器返回离开的处理结果
    "GAME_CLIENT_PLAYER_ADD"        : 1207,     // 服务器发送的新玩家加入的消息
    "GAME_CLIENT_PLAYER_LEAVE"      : 1211,     // 服务器广播某个玩家退出房间
    "GAME_CLIENT_PLAYER_ONLINE"     : 1303,     // 服务器广播某个玩家上线
    "GAME_CLIENT_PLAYER_OFFLINE"    : 1213,     // 服务器广播某个玩家断线
    "GAME_CLIENT_PLAYER_READY"      : 1208,     // 客户端准备
    "GAME_CLIENT_FINISH_ROOM"       : 1209,     // 房间解散
    "GAME_CLIENT_ROOM_CHAT"         : 1304,     // 房间聊天消息
    "GAME_CLIENT_SEND_GIFT"         : 1305,     // 表情消息
    "CLIENT_FORCE_QUIT"             : 1314,     // 表情消息
    "CLIENT_MIDDLE_SIGNATURE"       : 1350,     // 请求修改签名的的消息
    "CLIENT_MIDDLE_RANK_LIST"       : 1351,     // 请求排行榜数据
    "CLIENT_MIDDLE_REQ_SHOP"        : 1359,     // 客户端请求商城数据
    "CLIENT_MIDDLE_SHOP_CONVERT"    : 1361,     // 客户端请求在商城用钻石兑换金贝
    "CLIENT_MIDDLE_REQ_SIGN_DATA"   : 1215,     // 客户端请求签到
    "CLIENT_MIDDLE_REQ_SIGN"        : 1216,     // 客户端请求签到
    "CLIENT_MIDDLE_REQ_REPORTS"     : 1217,     // 客户端请求战绩
    "CLIENT_MIDDLE_REQ_DETAILS"     : 1556,     // 客户端请求战绩详情
    "CLIENT_GAME_YAYA"              : 1223,     // 客户端请求丫丫语音
    "CLIENT_MIDDLE_SHOP_CHONGZHI"   : 1516,     // 商城请求充值

    //任务接口
    "CLIENT_MIDDLE_GET_TASK_INFO"   : 1525,      // 客服端请求任务数据
    "CLIENT_MIDDLE_FETCH_TASK"      : 1529,      // 客户端请求领取任务物品
    "CLIENT_MIDDLE_HAVE_TASK"       : 1530,      // 客户端请求领取任务物品

    //背包
    "CLIENT_MIDDLE_BAG_INFO"        : 1531,     // 背包信息
    "CLIENT_MIDDLE_USE_BAG_ITEM"    : 1532,     // 使用物品
    "CLIENT_MATCH_CARD_REFRESH"     : 1533,     // 刷新卡号
    "CLIENT_MIDDLE_BIND_ACCOUNT"    : 1577,     // 背包绑定宽带 有线电视账号
    "CLIENT_GIVE_TO"                : 1721,     // 赠送物品
    "CLIENT_GIVE_RECORD"            : 1722,     // 赠送记录
    "CLIENT_GIVE_DOT"               : 1723,     // 赠送记录红点

    //兑换
    "CLIENT_SHOP_INFO"              : 1715,     // 背包信息
    "CLIENT_DO_CHANGE"              : 1716,     // 兑换

    // 好友
    "FRIEND_INFO"                   : 1640,     // 好友信息获取
    "FRIEND_APPLY"                  : 1641,     // 申请好友
    "FRIEND_APPLY_RESP"             : 1642,     // 申请返回的结果
    "FRIEND_LIST"                   : 1643,     // 好友列表
    "FRIEND_DELETE"                 : 1644,     // 删除好友
    "FRIEND_NOTICE"                 : 1645,     // 通知信息
    "FRIEND_CHAT_RECORD"            : 1646,     // 聊天记录
    "FRIEND_CHAT_SEND"              : 1647,     // 发送消息
    "FRIEND_GIVE_GIFT"              : 1648,     // 赠送礼物
    "FRIEND_GET_GIFT"               : 1649,     // 领取礼物
    "FRIEND_REFRESH"                : 1650,     // 刷新推荐好友
    "FRIEND_SEARCH"                 : 1651,     // 查找好友
    "FRIEND_CHAT_END"               : 1652,     // 关闭当前聊天
    "FRIEND_MSG_RED"                : 1653,     // 新的聊天消息红点
    "FRIEND_WINDOW_RED"             : 1654,     // 好友界面红点
    "FRIEND_WINDOW_END"             : 1655,     // 关闭好友界面
    "FRIEND_CHAT_NEW"               : 1656,     // 有新的消息

    // 大喇叭
    "HORN_SEND"                     : 1701,     // 发送大喇叭
    "HORN_UPDATE"                   : 1702,     // 大喇叭大厅消息更新
    "HORN_RECORD"                   : 1700,     // 大喇叭消息记录

    // 比赛场接口
    "CLIENT_MIDDLE_MATCH_MAIL"      : 1572,      // 是否有比赛场奖励邮件
    "CLIENT_MIDDLE_JOIN_MATCH"      : 1573,      // 报名参赛
    "CLIENT_MIDDLE_MATCH_RANK"      : 1574,      // 比赛排名
    "CLIENT_UPDATE_MATCH_INFO"      : 1575,      // 更新排名赛信息
    "CLIENT_GET_MATCH_RECORD"       : 1576,      // 排名赛获奖记录
    "CLIENT_MATCH_REWARD"           : 1581,      // 排名赛奖品配置

    // 邮件接口
    "CLIENT_MIDDLE_GET_MAIL"        : 1220,     // 客户端申请获取邮件
    "CLIENT_MIDDLE_DEL_MAIL"        : 1221,     // 客户端请求删除邮件
    "CLIENT_MIDDLE_LOOK_MAIL"       : 1222,     // 客户端请求查看邮件
    "CLIENT_MIDDLE_FETCH_MAIL"      : 1223,     // 客户端请求领取物品
    "CLIENT_MIDDLE_NEW_MAIL"        : 1310,     // 服务器主动推有新邮件
    "CLIENT_MIDDLE_NOTICE"          : 1313,     // 通知消息(跑马灯)

    // 银行接口
    "CLIENT_MIDDLE_TAKE_CASH"       : 1352,     // 客户端请求取钱
    "CLIENT_TAKE_CASH_NO_VERIFY"    : 1362,     // 客户端请求取钱不需要密码
    "CLIENT_MIDDLE_BANK_PASSWORD"   : 1353,     // 客户端验证银行密码
    "CLIENT_MIDDLE_PHONE_VERIFY"    : 1354,     // 验证手机
    "CLIENT_MIDDLE_BANK_MODIFY"     : 1355,     // 银行修改密码
    "CLIENT_MIDDLE_CLOSE_BANK"      : 1356,     // 客户端关闭银行
    "CLIENT_MIDDLE_BANK_REMEMBER"   : 1357,     // 银行设置记住密码

    "CLIENT_MIDDLE_GET_REPORT"      : 1358,     // 战绩接口
    "CLIENT_MIDDLE_SHARE"           : 1512,     // 分享接口
    "CLIENT_FEEDBACK"               : 1515,     // 客服端请求发送反馈信息
    "CLIENT_MIDDLE_PROMOTER_INFO"   : 1370,     // 获取推广员状态
    "CLIENT_MIDDLE_APPLY_PROMOTER"  : 1371,     // 申请成为推广员
    "INVITATION_ENTER_GAME_ROOM"    : 1517,     // 服务器邀请不在游戏的玩家进入房间游戏
    "CLIENT_MIDDLE_CHESS_REPORT"    : 1217,     // 象棋战绩

    // 福利
    "CLIENT_WHEEL_CONFIG"           : 1527,     // 幸运转盘配置
    "CLIENT_GO_WHEEL"               : 1528,     // 摇动幸运转盘
    "CLIENT_REAL_NAME"              : 1578,     // 实名认证
    "CLIENT_INVITATION_CODE"        : 1580,     // 填写邀请码
    "WEAL_DAILY"                    : 1540,     // 福利日常
    "WEAL_SUBSIDY"                  : 1705,     // 福利补助
    "WEAL_SIGN_CONFIG"              : 1710,     // 七天签到信息
    "WEAL_SIGN_GET"                 : 1711,     // 领取签到奖励
    "WEAL_CHARGE"                   : 1720,     // 充值卡

    // PFC相关
    "PFC_BIND"                      : 1806,     // 绑定PFC地址和钱包
    "PFC_CHARGE_INFO"               : 1807,     // PFC充值记录
    "TG_BIND"                       : 1376,     // 绑定推广员
    "TG_INFO"                       : 1378,     // 推广信息
    "TG_TI"                         : 1805,     // 提币请求
    "TG_TI_RECORD"                  : 1809,     // 提币记录
    "TG_CAN_TI"                     : 1811,     // 能够提多少币
    "TG_GET_ADDRESS"                : 1808,     // 获取地址记录

    // SEER相关
    "SEER_NEW_ACCOUNT"              : 2000,     // 创建seer账户
    "SEER_BANK_GET"                 : 2001,     // 链上取币
    "SEER_BANK_SAVE"                : 2002,     // 链上存币
    "SEER_REQ_COIN"                 : 2004,     // 请求更新货币
    "SEER_CASH_OUT"                 : 2005,     // 提币
    "SEER_CHAIN_COIN"               : 1227,     // 更新链上货币

    // 服务器主动推送的消息
    "MIDDLE_CLIENT_RECONNECTION"    : 1224,     // 玩家重连
    "GAME_MIDDLE_PLAYER_LEAVE_ROOM" : 1225,     // 服务器通知金币场的玩家离开房间
    "GAME_MIDDLE_CHANGE_RESOURCE"   : 1226,     // 改变玩家身上的资源
    "MIDDLE_CLIENT_ROLL_NOTICE"     : 1229,     // 服务器推送送滚动消息
    "GAME_CLIENT_IP_SAME"           : 1300,     // ip地址相同提示
    "GAME_CLIENT_TR"                : 1301,     // 给客户端推送踢人的消息
    "GAME_ROOM_RESOURCE_UPDATE"     : 1307,     // 房间内玩家资源发生变动

    // 特殊接口
    "CMSG_NET_WAVE"                 : 1400,     // 网络波动特殊接口
    "CLEAR_ROOM_ID"                 : 1209,     // 清除房间号
    "RETURN_HALL"                   : 1724,     // 强制返回大厅
    // "UPDATE_HEAD_PIC"               : 1725,     // 更新头像

    // ==== 游戏公用请求 ====================
    "GAME_REQ_CHANGE_TABLE"         : 1306,     // 游戏内请求换桌
    "GAME_ACTION_TIMER"             : 1360,     // 游戏倒计时消息
    "GAME_END_ROUND_DATA"           : 1555,     // 房卡场请求最终局数据

    "GAME_ON_RESP_DESTROYROOM"      : 1551,     // 响应解散房间
    "GAME_ON_REQ_DESTROYROOM"       : 1550,     // 发起解散房间
    "GAME_ON_DESTROYROOM"           : 1549,     // 解散房间（房主在游戏没有开始的时候直接解散房间）
    "GAME_ON_DESTROYROOM_RESULT"    : 1552,     // 解散房间的最后投票结果
    "GAME_KICK_PEOPLE"              : 1557,     // 踢出房间

    // ==== 拼三张消息 ======================
    "PSZ_START_NEW_ROUND"           : 14102,    // 拼三张开始游戏
    "PSZ_INIT_CARD"                 : 14103,    // 初始化手牌消息
    "PSZ_CURRENT_PLAY"              : 14104,    // 初始化手牌消息
    "PSZ_BEAN_CHANGE"               : 14107,    // 金贝数目改变消息 真的加注 跟注
    "PSZ_SETTLEMENT"                : 14105,    // 拼三张游戏结算消息
    "PSZ_SEE_CARDS"                 : 14106,    // 拼三张有人看牌
    "PSZ_ALL_ADD_BASE"              : 14108,    // 拼三张所有人开始加低注
    "PSZ_ALL_COMPARE_CARD"          : 14109,    // 拼三张全桌比牌

    "PSZ_REQ_SEE_CARDS"             : 14000,    // 看牌请求
    "PSZ_REQ_DIS_CARDS"             : 14001,    // 弃牌请求
    "PSZ_REQ_ADD_ANTE"              : 14002,    // 加注请求
    "PSZ_REQ_FOLLOW_ANTE"           : 14003,    // 跟注请求
    "PSZ_REQ_AUTO_FOLLOW"           : 14004,    // 自动跟注请求
    "PSZ_REQ_COMPARE_CARD"          : 14005,    // 比牌请求
    "PSZ_REQ_END_COMPARE"           : 14006,    // 比牌结束请求

    // ==== 海南麻将消息 ========================
    "MAHJONG_START_NEW_ROUND"       : 11102,    // 麻将开始新的一局游戏
    "MAHJONG_START_MULTIPLE"        : 11114,    // 麻将开始上噶
    "MAHJONG_END_MULTIPLE"          : 11116,    // 麻将结束上噶
    "MAHJONG_INIT_CARDS"            : 11104,    // 麻将发初始牌消息
    "MAHJONG_PUBLIC_CARDS_UPDATE"   : 11117,    // 麻将公共牌更新消息(未摸的牌)
    "MAHJONG_CUR_PLAYER"            : 11103,    // 麻将设置当前操作玩家
    "MAHJONG_NEW_CARD"              : 11106,    // 麻将玩家摸新牌消息
    "MAHJONG_FLOWER_CARD"           : 11113,    // 麻将玩家补花消息
    "MAHJONG_PLAYER_HANGUP"         : 11115,    // 麻将挂起任务
    "MAHJONG_PLAYER_HANGUP_END"     : 11118,    // 麻将挂起任务结束
    "MAHJONG_ROUND_SETTLEMENT"      : 11109,    // 麻将单局结算
    "MAHJONG_TOTAL_SETTLEMENT"      : 11110,    // 麻将总结算

    "MAHJONG_PLAYER_MULTIPLE"       : 11012,    // 玩家上噶
    "MAHJONG_PLAY_CARD"             : 11003,    // 玩家出牌消息
    "MAHJONG_PLAYER_PENG"           : 11004,    // 玩家碰牌
    "MAHJONG_PLAYER_GANG"           : 11005,    // 玩家杠牌
    "MAHJONG_PLAYER_CHI"            : 11006,    // 玩家吃牌
    "MAHJONG_PLAYER_HU"             : 11007,    // 玩家胡牌
    "MAHJONG_PLAYER_PASS"           : 11008,    // 玩家选择过
    "MAHJONG_PLAYER_TRUSTEESHIP"    : 11009,    // 玩家托管
    "MAHJONG_ON_TING"               : 11119,    // 报听提示

    "MAHJONG_START_SELECT"          : 18100,    // 开始换三张
    "MAHJONG_REQ_SELECT"            : 18001,    // 请求换三张
    "MAHJONG_END_SELECT"            : 18101,    // 选牌完毕
    "MAHJONG_START_DQ"              : 18102,    // 开始定缺
    "MAHJONG_REQ_DQ"                : 18002,    // 申请定缺
    "MAHJONG_END_DQ"                : 18111,    // 结束定缺
    "MAHJONG_HAVE_TING"             : 18112,    // 是否已经听
    "MAHJONG_SHOW_NEXT"             : 18113,    // 是否已经听
    "MAHJONG_TUI_SHUI"              : 18114,    // 退税消息
    "MAHJONG_PLAYER_OUT"            : 18115,    // 玩家出局消息
    "MAHJONG_SHOW_SCORE"            : 18116,    // 实时扣分
    "MAHJONG_DELETE_CARD"           : 18118,    // 删除胡牌
    "MAHJONG_ADD_CARD"              : 18119,    // 添加胡牌
    "MAHJONG_CHECK_TING"            : 18011,    // 请求听牌提示
    "MAHJONG_HP_INFO"               : 18010,    // 换牌信息
    "MAHJONG_BILL_INFO"             : 18012,    // 对局流水

    "CHEAT_GET_CARDS"               : 11013,    // 作弊获取当前牌组
    "CHEAT_UPDATE_CARDS"            : 11014,    // 作弊修改当前牌组

    // ==== 拼十消息 ========================
    "NN_START_NEW_ROUND"            : 15102,    // 拼十开始新一局消息
    "NN_INIT_CARDS"                 : 15103,    // 拼十开始发牌消息
    "NN_TO_PLAYER_CARDS"            : 15106,    // 拼十给玩家手牌
    "NN_START_ROB"                  : 15107,    // 拼十开始抢庄
    "NN_PLAYER_ROB"                 : 15000,    // 拼十玩家抢庄
    "NN_START_ANTE"                 : 15110,    // 拼十开始加注
    "NN_PLAYER_ANTE"                : 15001,    // 拼十玩家加注
    "NN_NEW_CARD"                   : 15108,    // 拼十新发一张牌
    "NN_START_SHOW_CARDS"           : 15113,    // 拼十开始亮牌
    "NN_PLAYER_SHOW_CARDS"          : 15002,    // 拼十玩家亮牌
    "NN_DEALER_SHOW_CARDS"          : 15114,    // 拼十庄家亮牌
    "NN_DEALER_CHANGE"              : 15116,    // 拼十换庄消息
    "NN_SETTLEMENT"                 : 15105,    // 拼十结算消息

    // ==== 斗地主消息 ========================
    "DDZ_START_NEW_ROUND"           : 12102,    // 斗地主开始新一局消息
    "DDZ_INIT_CARDS"                : 12103,    // 斗地主发牌消息
    "DDZ_START_ROB"                 : 12104,    // 斗地主开始叫地主消息
    "DDZ_NEXT_ROB"                  : 12105,    // 斗地主叫地主位置改变消息
    "DDZ_DEALER_CHANGE"             : 12106,    // 斗地主地主确定消息
    "DDZ_START_PLAY"                : 12107,    // 斗地主开始出牌消息
    "DDZ_MULTIPLE_CHANGE"           : 12108,    // 斗地主倍数变化消息
    "DDZ_NEXT_PLAY"                 : 12109,    // 斗地主出牌位置改变消息
    "DDZ_SETTLEMENT"                : 12110,    // 斗地主结算消息
    "DDZ_PLAYER_ROB"                : 12001,    // 斗地主抢地主请求
    "DDZ_PLAYER_HINT"               : 12002,    // 斗地主提示出牌请求
    "DDZ_PLAYER_PLAY"               : 12003,    // 斗地主出牌请求
    "DDZ_PLAYER_NO_PLAY"            : 12004,    // 斗地主不出请求
    "DDZ_HINT_SHUN"                 : 12005,    // 斗地主提示顺子请求
    "DDZ_PLAYER_TRUST"              : 12006,    // 斗地主托管请求
    "DDZ_START_DOUBLE"              : 12112,    // 斗地主通知加倍
    "DDZ_PLAYER_DOUBLE"             : 12007,    // 斗地主玩家加倍

    // ==== 象棋消息 ========================
    "XQ_SELECT_CHESS"               : 13001,    // 象棋选棋消息
    "XQ_MOVE_CHESS"                 : 13002,    // 象棋走棋消息
    "XQ_RETRACT_CHESS"              : 13003,    // 象棋悔棋消息
    "XQ_GIVE_UP"                    : 13000,    // 象棋认输消息
    "XQ_SET_BASE"                   : 13004,    // 象棋改变底分消息
    "XQ_NEW_ROUND"                  : 13102,    // 象棋开始新一局消息
    "XQ_NEXT_PLAY"                  : 13103,    // 象棋下一个玩家消息
    "XQ_JIANG"                      : 13104,    // 象棋将消息
    "XQ_CHI"                        : 13105,    // 象棋吃消息
    "XQ_SETTLEMENT"                 : 13106,    // 象棋结算消息

    // ==== 跑得快消息 ========================
    "RUN_NEW_ROUND"                 : 17000,    // 开始新一局
    "RUN_INIT_CARDS"                : 17101,    // 初始化手牌
    "RUN_NEXT_INDEX"                : 17102,    // 出牌位置改变
    "RUN_ZD_COUNT"                  : 17104,    // 跑得快炸弹更新
    "RUN_ZD_SCORE"                  : 17105,    // 跑得快炸弹存活消息
    "RUN_DEALER"                    : 17106,    // 跑得快定庄消息
    "RUN_SETTLEMENT"                : 17110,    // 跑得快单局结算
    "RUN_HINT"                      : 17002,    // 跑得快提示
    "RUN_PLAY_CARD"                 : 17003,    // 跑得快出牌
    "RUN_NO_PLAY"                   : 17004,    // 跑得快过牌
    "RUN_SELECT"                    : 17005,    // 跑得快选牌
    "RUN_TRUST"                     : 17006,    // 跑得快选牌

};

/**
 * 事件类型
 */
protocol.eveidType = {
    "CREATE_ROOM"           : 1,            // 开房间
    "JBC_SETTLEMENT"        : 2,            // 金币场结算
    "RECHARGE"              : 3             // 充值
};

/**
 * 错误码
 */
protocol.ProtoStatus = {
    "STATUS_OK"                         : 0,        // 处理成功
    "STATUS_FAILED"                     : 1,        // 处理失败
    // 登录
    "STATUS_LOGIN_FAILED"               : 2,        // 登录失败
    "STATUS_LOGIN_ONLINE"               : 3,        // 玩家在线
    "STATUS_LOGIN_BLACK"                : 4,        // 该账号以被冻结
    "STATUS_LOGIN_OFFLINE"              : 5,        // 玩家不在线
    // 游戏
    "STATUS_GAME_NOT_SUPPORT"           : 20,       // 游戏类型不支持
    "STATUS_GAME_JOIN_A_ROOM"           : 21,       // 已经加入了一个房间
    "STATUS_GAME_CREATE_ROOM_FAILED"    : 22,       // 服务器繁忙
    "STATUS_GAME_JOIN_ROOM_FAILED"      : 23,       // 加入房间失败
    "STATUS_GAME_JOIN_ROOM_ID_ERROR"    : 24,       // 输入房间号不正确
    "STATUS_GAME_ID_ERROR"              : 25,       // 用户id不存在
    "STATUS_GAME_BEAN_LESS"             : 26,       // 金币不足
    "STATUS_GAME_CARD_LESS"             : 27,       // 房卡不足
    "STATUS_GAME_MAIL_NOT_EXIST"        : 28,       // 邮件不存在
    "STATUS_GAME_ROOM_FUll"             : 29,       // 房间人已满
    "STATUS_GAME_PARAM_ERROR"           : 30,       // 传递参数错误
    "STATUS_GAME_TYPE_ERROR"            : 31,       // 牌型不对
    "STATUS_GAME_CARD_SMALL"            : 32,       // 比上家牌小
    "STATUS_GAME_CANNOT_QUIT"           : 33        // 正在游戏不能退出
};

/**
 * 获取网络消息错误码对应提示信息
 * @param errorCode
 * @returns {*}
 */
protocol.getErrorString = function (errorCode) {
    switch (errorCode) {
        case this.ProtoStatus.STATUS_FAILED : return "网络数据错误"; break;
        case this.ProtoStatus.STATUS_LOGIN_FAILED : return "登录失败"; break;
        case this.ProtoStatus.STATUS_LOGIN_ONLINE : return "玩家已经登录"; break;
        case this.ProtoStatus.STATUS_LOGIN_BLACK : return "该账号已被冻结"; break;
        case this.ProtoStatus.STATUS_LOGIN_OFFLINE : return "玩家不在线"; break;
        case this.ProtoStatus.STATUS_GAME_NOT_SUPPORT : return "游戏类型错误，不支持该类型"; break;
        case this.ProtoStatus.STATUS_GAME_JOIN_A_ROOM : return "已经加入了一个游戏，请退出游戏后再加入"; break;
        case this.ProtoStatus.STATUS_GAME_CREATE_ROOM_FAILED : return "服务器繁忙"; break;
        case this.ProtoStatus.STATUS_GAME_JOIN_ROOM_FAILED : return "加入房间失败"; break;
        case this.ProtoStatus.STATUS_GAME_JOIN_ROOM_ID_ERROR : return "加入房间失败或房间已解散"; break;
        case this.ProtoStatus.STATUS_GAME_ID_ERROR : return "用户ID不存在"; break;
        case this.ProtoStatus.STATUS_GAME_BEAN_LESS : return "Seer不足"; break;
        case this.ProtoStatus.STATUS_GAME_CARD_LESS : return "房卡不足"; break;
        case this.ProtoStatus.STATUS_GAME_MAIL_NOT_EXIST : return "邮件不存在"; break;
        case this.ProtoStatus.STATUS_GAME_ROOM_FUll : return "房间人数已达上限"; break;
        case this.ProtoStatus.STATUS_GAME_PARAM_ERROR : return "参数错误"; break;
        case this.ProtoStatus.STATUS_GAME_TYPE_ERROR : return "牌型错误"; break;
        case this.ProtoStatus.STATUS_GAME_CARD_SMALL : return "牌的值小于上家"; break;
        case this.ProtoStatus.STATUS_GAME_CANNOT_QUIT : return "正在游戏中，不能退出"; break;
        default : return "未知错误"; break;
    }
};


protocol.MAX_PUBLIC_GAME = 11000;  // 最大游戏码