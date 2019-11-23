/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1-root
Source Server Version : 50553
Source Host           : 127.0.0.1:3306
Source Database       : seer_back

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2019-11-23 14:15:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for account_closure
-- ----------------------------
DROP TABLE IF EXISTS `account_closure`;
CREATE TABLE `account_closure` (
  `uid` int(20) NOT NULL COMMENT '玩家uid',
  `prohibit_log` int(1) DEFAULT '0' COMMENT '禁止登陆 \r\n0:表示不要禁止登陆 \r\n1:表示要禁止登陆',
  `prohibit_game` int(1) DEFAULT '0' COMMENT '禁止游戏\r\n0:表示不要禁止游戏\r\n1:表示要禁止游戏',
  `prohibit_equipment` int(1) DEFAULT '0' COMMENT '禁止当前设备登录\r\n0:表示不要禁止当前设备登录\r\n1:表示要禁止当前设备登录',
  `kick_line` int(1) DEFAULT '0' COMMENT '立即踢下线\r\n0:表示不要立即踢下线\r\n1:表示要立即踢下线',
  `create_time` datetime DEFAULT NULL COMMENT '创建状态的时间',
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of account_closure
-- ----------------------------

-- ----------------------------
-- Table structure for authtell_log
-- ----------------------------
DROP TABLE IF EXISTS `authtell_log`;
CREATE TABLE `authtell_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '玩家UID',
  `user_name` varchar(255) NOT NULL COMMENT '玩家微信昵称',
  `tell` varchar(255) NOT NULL COMMENT '验证的电话',
  `add_time` datetime NOT NULL COMMENT '日志添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of authtell_log
-- ----------------------------
INSERT INTO `authtell_log` VALUES ('1', '100005', 'das', '13200235201', '2018-07-02 09:46:00');

-- ----------------------------
-- Table structure for binding_bank_card
-- ----------------------------
DROP TABLE IF EXISTS `binding_bank_card`;
CREATE TABLE `binding_bank_card` (
  `uid` int(20) NOT NULL COMMENT '玩家uid',
  `account_name` varchar(60) NOT NULL COMMENT '开户姓名',
  `bank_card_number` varchar(60) NOT NULL COMMENT '银行卡号',
  `opening_bank` varchar(60) NOT NULL COMMENT '开户行类型:',
  `cipher` varchar(60) NOT NULL COMMENT '提现密码',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of binding_bank_card
-- ----------------------------

-- ----------------------------
-- Table structure for company_profit
-- ----------------------------
DROP TABLE IF EXISTS `company_profit`;
CREATE TABLE `company_profit` (
  `uid` int(11) DEFAULT NULL COMMENT '玩家uid',
  `num` float(20,4) DEFAULT '0.0000' COMMENT '收支数量 +入账 -出账',
  `profit_time` varchar(255) DEFAULT NULL COMMENT '进行游戏产生的服务费明细时间',
  `time` datetime DEFAULT NULL COMMENT '公司其他收支费用的时间',
  `finance_type` int(11) DEFAULT NULL COMMENT '财务类型:\r\n1: 玩家比赛 公司从中获取的服务费(已扣除玩家返利)\r\n2: 公司充值入账',
  `params` varchar(255) DEFAULT NULL COMMENT '其他相关参数'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of company_profit
-- ----------------------------

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `uid` int(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of feedback
-- ----------------------------
INSERT INTO `feedback` VALUES ('100475', 'Los', 'cdfg', '2018-12-09 05:45:46');
INSERT INTO `feedback` VALUES ('100484', '叶丹儿', '你好', '2018-12-10 17:42:19');
INSERT INTO `feedback` VALUES ('100484', '叶丹儿', '你好', '2018-12-10 17:42:35');

-- ----------------------------
-- Table structure for game_card
-- ----------------------------
DROP TABLE IF EXISTS `game_card`;
CREATE TABLE `game_card` (
  `id` varchar(255) NOT NULL DEFAULT '0000000000' COMMENT '游戏卡卡号',
  `uid` int(20) unsigned DEFAULT '0' COMMENT '玩家uid',
  `card_number` varchar(255) NOT NULL DEFAULT '' COMMENT '游戏卡序列号(12位)',
  `batch` int(20) DEFAULT '1' COMMENT '批次',
  `generation_time` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '游戏卡生成时间',
  `status` int(1) DEFAULT '0' COMMENT '是否使用:0:未使用,1:已使用',
  `use_time` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '使用时间',
  `card_number1` varchar(255) NOT NULL COMMENT '改变后每隔4位带有空格卡号(12位)',
  `type` tinyint(10) DEFAULT '1' COMMENT '卡类型:1日卡 2周卡 3月卡 10礼品码（1号物品）',
  `send_out` tinyint(10) DEFAULT '0' COMMENT '是否已经送出 0已经送出 1未送出',
  PRIMARY KEY (`id`,`card_number`),
  UNIQUE KEY `card_number_2` (`card_number`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE,
  UNIQUE KEY `card_number` (`card_number1`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE,
  KEY `id_2` (`id`,`card_number`,`card_number1`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of game_card
-- ----------------------------

-- ----------------------------
-- Table structure for game_config
-- ----------------------------
DROP TABLE IF EXISTS `game_config`;
CREATE TABLE `game_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) DEFAULT NULL COMMENT '变量名',
  `value` varchar(255) DEFAULT NULL COMMENT '变量值',
  `doc` varchar(255) DEFAULT NULL COMMENT '变量注释',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of game_config
-- ----------------------------
INSERT INTO `game_config` VALUES ('1', 'dayBuyLimit', '500', '每天限制充值数量');
INSERT INTO `game_config` VALUES ('2', 'monthBuyLimit', '2000', '每月限制充值数量');

-- ----------------------------
-- Table structure for give_config
-- ----------------------------
DROP TABLE IF EXISTS `give_config`;
CREATE TABLE `give_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '配置赠送自增表id',
  `orders` int(11) DEFAULT NULL COMMENT '序号',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `status` int(1) DEFAULT NULL COMMENT '是否显示:0不显示，1显示',
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders` (`orders`,`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of give_config
-- ----------------------------
INSERT INTO `give_config` VALUES ('3', '7', '网络宽带一个月', '1');
INSERT INTO `give_config` VALUES ('4', '8', '网络电视一个月', '1');
INSERT INTO `give_config` VALUES ('5', '9', '约宝金豆', '1');
INSERT INTO `give_config` VALUES ('6', '10', '电视机', '1');
INSERT INTO `give_config` VALUES ('7', '11', '载人登机旅行箱', '1');

-- ----------------------------
-- Table structure for goods_log
-- ----------------------------
DROP TABLE IF EXISTS `goods_log`;
CREATE TABLE `goods_log` (
  `uid` int(20) NOT NULL DEFAULT '0' COMMENT '玩家uid',
  `wx_name` varchar(255) DEFAULT '' COMMENT '微信昵称',
  `mode` varchar(255) DEFAULT NULL COMMENT '比赛模式: FK(房卡) JB(金币场) 物品相关(物品类使用) 非比赛(指任务、银行存取金豆等)  ',
  `match_id` int(20) DEFAULT '0' COMMENT '场次id:\r\n0:是自建房 \r\n其他:为服务器配置的金币场信息',
  `round_id` int(20) DEFAULT '0' COMMENT '牌局号',
  `cur_round` int(20) DEFAULT '0' COMMENT '当前局',
  `id` int(20) DEFAULT '0' COMMENT '本次关联物品的id\r\n1: 金豆\r\n2: 房卡\r\n3: 钻石',
  `num` int(20) DEFAULT '0' COMMENT '本次关联物品的数量 正数增加 负数减少',
  `plus_cards` int(20) DEFAULT NULL COMMENT '剩余房卡',
  `plus_beans` int(20) DEFAULT '0' COMMENT '剩余金豆',
  `plus_diamonds` int(20) DEFAULT '0' COMMENT '剩余钻石',
  `event_id` int(20) DEFAULT NULL COMMENT '事件id:\r\n1、开房消耗\r\n2、比赛输赢\r\n3、邮件获取\r\n4、充值获取\r\n5、兑换\r\n6、服务费\r\n7、银行更新\r\n8、BSC充值获取\r\n9、BSC提现',
  `time` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods_log
-- ----------------------------

-- ----------------------------
-- Table structure for level_config
-- ----------------------------
DROP TABLE IF EXISTS `level_config`;
CREATE TABLE `level_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '配置表id序列号',
  `status` int(1) unsigned DEFAULT '0' COMMENT '0:金贝玩家;1:收益;2:推广员或馆主',
  `num` int(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of level_config
-- ----------------------------
INSERT INTO `level_config` VALUES ('1', '0', '10');
INSERT INTO `level_config` VALUES ('2', '1', '30');
INSERT INTO `level_config` VALUES ('3', '2', '50');

-- ----------------------------
-- Table structure for mt_game_card
-- ----------------------------
DROP TABLE IF EXISTS `mt_game_card`;
CREATE TABLE `mt_game_card` (
  `card_number` varchar(255) NOT NULL DEFAULT '' COMMENT '正常的卡号(12位)',
  `card_number1` varchar(255) NOT NULL COMMENT '改变后每隔4位带有空格卡号(12位)',
  PRIMARY KEY (`card_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mt_game_card
-- ----------------------------

-- ----------------------------
-- Table structure for notice_config
-- ----------------------------
DROP TABLE IF EXISTS `notice_config`;
CREATE TABLE `notice_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id  id为1 为插播消息',
  `playback_sequence` int(11) NOT NULL COMMENT '播放顺序',
  `content` varchar(255) NOT NULL COMMENT '播放内容',
  `status` int(11) NOT NULL COMMENT '1禁用 2启用',
  `playback_interval` int(11) NOT NULL DEFAULT '6' COMMENT '播放间隔(秒)',
  `start_time` varchar(255) NOT NULL DEFAULT '00:00:00' COMMENT '开始时间(每天的秒数)',
  `end_time` varchar(255) NOT NULL DEFAULT '23:59:59' COMMENT '结束时间(每天的秒数)',
  `playback_count` int(11) NOT NULL DEFAULT '99999' COMMENT '播放次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of notice_config
-- ----------------------------
INSERT INTO `notice_config` VALUES ('1', '1', 'sadsad', '1', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('2', '2', '11sas', '1', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('3', '4', 'adsad', '2', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('4', '5', 'dasdas', '2', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('5', '6', '242134', '2', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('6', '8', 'sadasd', '2', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('7', '9', 'sdasda', '2', '6', '00:00:00', '23:59:59', '99999');
INSERT INTO `notice_config` VALUES ('8', '9', '返回上房间后覅卡萨就佛杀实时监控房卡就返回付款举案说法看见', '2', '6', '00:00:00', '23:59:59', '99999');

-- ----------------------------
-- Table structure for operation_log
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '详情操作日志表的自增ID',
  `username` varchar(30) DEFAULT NULL COMMENT '管理员名称',
  `operation_time` datetime DEFAULT NULL COMMENT '运营操作模块时间',
  `tname` varchar(60) DEFAULT NULL COMMENT '操作主题',
  `content` text COMMENT '操作内容',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=99 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of operation_log
-- ----------------------------
INSERT INTO `operation_log` VALUES ('70', 'admin', '2018-09-03 15:05:20', '玩家模块-玩家列表-修改玩家信息', '修改手机号码');
INSERT INTO `operation_log` VALUES ('71', 'admin', '2018-09-03 15:07:09', '玩家模块-玩家列表-修改玩家信息', '哈哈');
INSERT INTO `operation_log` VALUES ('72', 'admin', '2018-09-03 15:43:49', '玩家模块-资源增减-批量修改', '加1数量');
INSERT INTO `operation_log` VALUES ('73', 'admin', '2018-09-03 15:44:50', '玩家模块-资源增减-批量修改', '3');
INSERT INTO `operation_log` VALUES ('74', 'admin', '2018-09-03 15:45:10', '玩家模块-资源增减-批量修改', '2');
INSERT INTO `operation_log` VALUES ('75', 'admin', '2018-09-03 17:56:51', '玩家模块-资源增减-批量修改', '是打发士大夫');
INSERT INTO `operation_log` VALUES ('76', 'admin', '2018-09-03 17:57:18', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('77', 'admin', '2018-09-04 11:01:51', '玩家模块-资源增减-批量修改', '+2');
INSERT INTO `operation_log` VALUES ('78', 'admin', '2018-09-04 11:31:48', '玩家模块-资源增减-批量修改', '+1');
INSERT INTO `operation_log` VALUES ('79', 'admin', '2018-09-04 11:36:21', '玩家模块-资源增减-批量修改', '+1');
INSERT INTO `operation_log` VALUES ('80', 'admin', '2018-09-04 11:36:36', '玩家模块-资源增减-批量修改', '-2');
INSERT INTO `operation_log` VALUES ('81', 'admin', '2018-09-04 11:36:50', '玩家模块-资源增减-批量修改', '-2');
INSERT INTO `operation_log` VALUES ('82', 'admin', '2018-09-04 11:38:01', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('83', 'admin', '2018-09-04 11:42:54', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('84', 'admin', '2018-09-04 11:46:02', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('85', 'admin', '2018-09-04 11:51:02', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('86', 'admin', '2018-09-04 12:06:35', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('87', 'admin', '2018-09-04 12:09:15', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('88', 'admin', '2018-09-05 17:00:56', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('89', 'admin', '2018-09-05 17:01:56', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('90', 'admin', '2018-09-05 17:02:41', '玩家模块-资源增减-批量修改', '-2');
INSERT INTO `operation_log` VALUES ('91', 'admin', '2018-09-05 17:03:33', '玩家模块-资源增减-批量修改', '-8');
INSERT INTO `operation_log` VALUES ('92', 'admin', '2018-09-14 16:24:47', '玩家模块-资源增减-批量修改', '-1');
INSERT INTO `operation_log` VALUES ('93', 'admin', '2018-09-14 16:25:09', '玩家模块-资源增减-批量修改', '+1+1+22');
INSERT INTO `operation_log` VALUES ('94', 'admin', '2018-09-14 16:25:34', '玩家模块-资源增减-批量修改', '-1-1-20');
INSERT INTO `operation_log` VALUES ('95', 'admin', '2018-09-14 16:26:15', '玩家模块-资源增减-批量修改', '-0-0-2');
INSERT INTO `operation_log` VALUES ('96', 'admin', '2018-09-14 16:38:13', '新增', '禁止');
INSERT INTO `operation_log` VALUES ('97', 'admin', '2018-09-14 16:40:59', '新增', '两个');
INSERT INTO `operation_log` VALUES ('98', 'admin', '2018-09-21 15:39:54', '玩家模块-资源增减-批量修改', '+1+2+1');

-- ----------------------------
-- Table structure for pay_order_list
-- ----------------------------
DROP TABLE IF EXISTS `pay_order_list`;
CREATE TABLE `pay_order_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buss_order_num` varchar(255) NOT NULL COMMENT '订单号',
  `pay_money` float(11,2) NOT NULL COMMENT '支付金额',
  `pay_time` datetime NOT NULL COMMENT '支付时间',
  `pay_discount_money` float(11,2) NOT NULL COMMENT '实际支付金额',
  `status` int(11) NOT NULL COMMENT '订单状态 0已支付 1充值成功',
  `order_num` varchar(30) NOT NULL COMMENT '支付集订单号',
  `uid` int(11) NOT NULL COMMENT '玩家ID',
  `bean` int(20) DEFAULT '0' COMMENT '充值获得的金币',
  `card` int(20) DEFAULT '0' COMMENT '充值获取的房卡',
  `diamond` int(20) DEFAULT '0' COMMENT '充值获取的砖石',
  PRIMARY KEY (`id`,`buss_order_num`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pay_order_list
-- ----------------------------

-- ----------------------------
-- Table structure for pfc_recharge_log
-- ----------------------------
DROP TABLE IF EXISTS `pfc_recharge_log`;
CREATE TABLE `pfc_recharge_log` (
  `uid` int(11) DEFAULT NULL COMMENT '玩家uid',
  `account_id` varchar(255) DEFAULT NULL COMMENT '玩家账户',
  `asset_name` varchar(255) DEFAULT NULL COMMENT '资产名称',
  `address_type` varchar(255) DEFAULT NULL COMMENT '地址类型',
  `amount` varchar(255) DEFAULT NULL COMMENT '充值数量',
  `seq` varchar(255) NOT NULL DEFAULT '' COMMENT '订单号(唯一)',
  `tx_from` varchar(255) DEFAULT NULL COMMENT '交易中的源地址',
  `tx_to` varchar(255) DEFAULT NULL COMMENT '交易中的目的地址',
  `tx_hash` varchar(255) DEFAULT NULL COMMENT '交易的hash',
  `ts` varchar(255) DEFAULT NULL COMMENT '交易时的时间戳',
  `time` datetime DEFAULT NULL COMMENT '本条记录存储的时间',
  PRIMARY KEY (`seq`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pfc_recharge_log
-- ----------------------------

-- ----------------------------
-- Table structure for pfc_withdraw_log
-- ----------------------------
DROP TABLE IF EXISTS `pfc_withdraw_log`;
CREATE TABLE `pfc_withdraw_log` (
  `uid` int(11) DEFAULT NULL COMMENT '玩家uid',
  `to_chain` varchar(255) DEFAULT NULL COMMENT '资产提现到的区块链',
  `in_asset_name` varchar(255) DEFAULT NULL COMMENT '进区块链名称',
  `in_amount` varchar(20) DEFAULT NULL COMMENT '提现金额',
  `out_asset_name` varchar(255) DEFAULT NULL COMMENT '转出资产名称',
  `out_amount` varchar(20) DEFAULT NULL COMMENT '网关实际转出金额',
  `seq` varchar(255) DEFAULT NULL COMMENT '提现编号（唯一）',
  `txid` varchar(255) DEFAULT NULL COMMENT '转账（网关向提现到地址的转账）交易ID',
  `process_status` varchar(255) DEFAULT NULL COMMENT '提现状态\r\n\n\n- auto_out_processing   网关正在处理提现请求\r\n\n- auto_out_processed    网关已经将<转账交易>广播到网络，需要等待矿工将其打包进区块\r\n\n- auto_out_confirmed    网关已经确认<转账交易>成功打包进区块（基本可以认为用户提现成功）\r\n\n- auto_out_err_bad_address 提现地址非法（memo中提供的地址非法）\r\n\n- auto_out_err_out_to_gw 禁止提现到用于给用户充值的地址\n- auto_out_err_insufficient_balance 网关余额不足',
  `type` tinyint(4) DEFAULT NULL COMMENT '提现类型:1 金豆提现 2推广提现',
  `before_beans` float(20,2) DEFAULT NULL COMMENT '提现前玩家身上的金豆数量',
  `before_extend_beans` float(20,2) DEFAULT NULL COMMENT '提现前玩家身上推广金豆数量',
  `with_amount` float(20,2) DEFAULT NULL COMMENT '本次提现了多少金豆(由于存在推广服务费，所以金豆精确到小数点后2位)',
  `brokerage` float(20,2) DEFAULT NULL COMMENT '手续费',
  `after_beans` float(20,2) DEFAULT NULL COMMENT '提现后身上金豆数量',
  `after_extend_beans` float(20,2) DEFAULT NULL COMMENT '提现后推广剩余金豆数量',
  `time` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL COMMENT '订单状态:0未完成 1已完成',
  `address` varchar(255) DEFAULT '' COMMENT '提现地址'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pfc_withdraw_log
-- ----------------------------

-- ----------------------------
-- Table structure for phone_card
-- ----------------------------
DROP TABLE IF EXISTS `phone_card`;
CREATE TABLE `phone_card` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `order_id` varchar(255) DEFAULT '' COMMENT '订单号',
  `uid` int(20) DEFAULT '0' COMMENT '玩家uid',
  `wx_name` varchar(255) DEFAULT '' COMMENT '玩家微信名称',
  `phone` varchar(11) DEFAULT '' COMMENT '充值电话号码',
  `rmb` double(20,2) DEFAULT '0.00' COMMENT '充值的金额',
  `start_time` datetime DEFAULT NULL COMMENT '订单开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '订单结束时间',
  `state` smallint(4) DEFAULT '0' COMMENT '充值状态 0没有处理 1充值成功',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of phone_card
-- ----------------------------

-- ----------------------------
-- Table structure for profit_log
-- ----------------------------
DROP TABLE IF EXISTS `profit_log`;
CREATE TABLE `profit_log` (
  `uid` int(11) unsigned DEFAULT '0' COMMENT '受益人的uid',
  `wx_name` varchar(255) DEFAULT '' COMMENT '收益人的微信名字',
  `gen_uid` int(11) DEFAULT NULL COMMENT '产生受益的uid',
  `gen_wx_name` varchar(255) DEFAULT NULL COMMENT '产生收益id的微信名',
  `gen_lv` int(11) DEFAULT NULL COMMENT '获取等级(1:表示只有自己;2表示有上级;3表示有上上级)',
  `time` varchar(255) DEFAULT NULL COMMENT '日期(精确到天)',
  `profit` float(20,2) DEFAULT '0.00' COMMENT '金币收益',
  `zero_time` int(20) DEFAULT '0' COMMENT '当前时间的0点(时间戳)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of profit_log
-- ----------------------------

-- ----------------------------
-- Table structure for put_forward
-- ----------------------------
DROP TABLE IF EXISTS `put_forward`;
CREATE TABLE `put_forward` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '提现表中的自增ID',
  `uid` int(20) NOT NULL COMMENT '玩家uid',
  `cash_amount` decimal(16,2) DEFAULT '0.00' COMMENT '提现金额',
  `present_status` int(1) DEFAULT '0' COMMENT '提现状态:0表示已提交,银行处理中;1表示已到账',
  `total` decimal(16,2) DEFAULT '0.00' COMMENT '总额',
  `balance` decimal(16,2) DEFAULT '0.00' COMMENT '余额',
  PRIMARY KEY (`id`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of put_forward
-- ----------------------------

-- ----------------------------
-- Table structure for robot_header
-- ----------------------------
DROP TABLE IF EXISTS `robot_header`;
CREATE TABLE `robot_header` (
  `id` int(11) NOT NULL DEFAULT '0' COMMENT '自增id',
  `header_url` varchar(255) DEFAULT NULL COMMENT '机器人头像地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of robot_header
-- ----------------------------

-- ----------------------------
-- Table structure for round_log
-- ----------------------------
DROP TABLE IF EXISTS `round_log`;
CREATE TABLE `round_log` (
  `round_id` int(20) NOT NULL DEFAULT '0' COMMENT '唯一牌局号',
  `cur_round` int(20) DEFAULT '0' COMMENT '当前轮',
  `match_id` int(20) DEFAULT '0' COMMENT '金币场的matchId',
  `player_info` varchar(1000) DEFAULT NULL,
  `score` varchar(255) DEFAULT '0' COMMENT '输赢分',
  `end_time` datetime DEFAULT NULL,
  `uid1` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid2` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid3` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid4` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid5` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid6` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid7` int(20) DEFAULT NULL COMMENT '关联uid',
  `uid8` int(20) DEFAULT NULL COMMENT '关联uid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of round_log
-- ----------------------------

-- ----------------------------
-- Table structure for send_bonus
-- ----------------------------
DROP TABLE IF EXISTS `send_bonus`;
CREATE TABLE `send_bonus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `good_num` int(20) DEFAULT NULL,
  `good_type` int(20) DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of send_bonus
-- ----------------------------

-- ----------------------------
-- Table structure for shop_config
-- ----------------------------
DROP TABLE IF EXISTS `shop_config`;
CREATE TABLE `shop_config` (
  `itemId` int(11) NOT NULL COMMENT '商品编号',
  `status` int(11) NOT NULL COMMENT '当前商品状态 0 无状态 1热卖 2推荐',
  `cards` int(11) NOT NULL COMMENT '房卡数量 0不显示 大于0显示对应数量房卡',
  `giveBean` int(11) NOT NULL COMMENT '赠送金贝 0 不显示 大于0 显示对应金贝数量',
  `rmbPrice` float(11,2) NOT NULL COMMENT '人民币价格',
  `giveDiamond` int(11) NOT NULL COMMENT '赠送钻石 0不显示 大于0 显示对应数量',
  PRIMARY KEY (`itemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_config
-- ----------------------------
INSERT INTO `shop_config` VALUES ('1', '0', '10', '201', '10.00', '100');
INSERT INTO `shop_config` VALUES ('2', '0', '30', '202', '30.00', '301');
INSERT INTO `shop_config` VALUES ('3', '0', '50', '203', '50.00', '502');
INSERT INTO `shop_config` VALUES ('4', '0', '100', '204', '100.00', '1004');
INSERT INTO `shop_config` VALUES ('5', '0', '300', '205', '300.00', '3010');
INSERT INTO `shop_config` VALUES ('6', '0', '500', '206', '500.00', '5020');

-- ----------------------------
-- Table structure for shop_order
-- ----------------------------
DROP TABLE IF EXISTS `shop_order`;
CREATE TABLE `shop_order` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT COMMENT '卡片id',
  `order` varchar(255) NOT NULL COMMENT '订单号',
  `good_id` int(20) DEFAULT NULL COMMENT '对应游戏中的物品类型',
  `use_uid` int(20) DEFAULT '0' COMMENT '使用的玩家id，没有使用默认0',
  `use_time` datetime DEFAULT NULL,
  `status` tinyint(2) DEFAULT '0',
  PRIMARY KEY (`id`,`order`)
) ENGINE=MyISAM AUTO_INCREMENT=24002 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shop_order
-- ----------------------------

-- ----------------------------
-- Table structure for status
-- ----------------------------
DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `ids` int(11) NOT NULL AUTO_INCREMENT COMMENT '状态表的id',
  `name` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`ids`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of status
-- ----------------------------
INSERT INTO `status` VALUES ('1', '开房消耗');
INSERT INTO `status` VALUES ('2', '比赛输赢');
INSERT INTO `status` VALUES ('3', '邮件获取');
INSERT INTO `status` VALUES ('4', '充值获取');
INSERT INTO `status` VALUES ('5', '兑换');
INSERT INTO `status` VALUES ('6', '服务费');
INSERT INTO `status` VALUES ('7', '银行更新');
INSERT INTO `status` VALUES ('8', 'BSC充值获取');
INSERT INTO `status` VALUES ('9', 'BSC提现');

-- ----------------------------
-- Table structure for temporary_recording
-- ----------------------------
DROP TABLE IF EXISTS `temporary_recording`;
CREATE TABLE `temporary_recording` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '临时插播表自增ID',
  `time` datetime DEFAULT NULL COMMENT '临时插播消息的日期',
  `content` text COMMENT '文本内容',
  `playback_number` int(11) DEFAULT '1' COMMENT '播放次数',
  `username` varchar(60) DEFAULT NULL COMMENT '操作人',
  `log` text COMMENT '操作日志',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of temporary_recording
-- ----------------------------

-- ----------------------------
-- Table structure for user_list
-- ----------------------------
DROP TABLE IF EXISTS `user_list`;
CREATE TABLE `user_list` (
  `uid` int(20) NOT NULL DEFAULT '0' COMMENT '推广员在游戏中的uid',
  `wx_name` varchar(255) DEFAULT '' COMMENT '微信名',
  `pre_uid` int(20) DEFAULT '0' COMMENT '0表示没有上级代理',
  `next_uids` text COMMENT '下级代理的玩家集合',
  `profit` float(20,2) DEFAULT '0.00' COMMENT '自己玩游戏产生的收益',
  `pre_profit` float(20,2) DEFAULT '0.00' COMMENT '上级代理的收益',
  `pre_pre_profit` float(20,2) DEFAULT '0.00' COMMENT '上上级代理收益',
  `oneday_profit` float(20,2) DEFAULT '0.00' COMMENT '每天给公司产生的收益(第二天0点会做清0处理)',
  `week_profit` float(20,2) DEFAULT '0.00' COMMENT '每周产生的收益(每周星期1晚上0点重置)',
  `all_profit` float(20,2) DEFAULT '0.00' COMMENT '给公司产生的总收益',
  `node_profit` float(20,2) DEFAULT '0.00' COMMENT '节点奖励',
  `head_pic` varchar(255) DEFAULT '' COMMENT '微信的头像地址',
  `room_cards` int(20) DEFAULT '0' COMMENT '房卡数量',
  `diamonds` int(20) DEFAULT '0' COMMENT '钻石数量',
  `beans` bigint(20) DEFAULT '0' COMMENT '金贝数量',
  `band_beans` bigint(20) DEFAULT '0' COMMENT '银行金贝数量',
  `regisder_time` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '注册时间',
  `regisder_ip` varchar(30) DEFAULT '' COMMENT '注册ip地址',
  `last_login_ip` varchar(30) DEFAULT '' COMMENT '最后登录IP地址',
  `last_login_time` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '最后登录时间',
  `cur_fixing` varchar(255) DEFAULT '' COMMENT '当前设备',
  `is_control` tinyint(4) DEFAULT '0' COMMENT '是否存在监控列表中\r\n0:不存在监控列表中\r\n1:存在监控列表\r\n',
  `last_login_city` varchar(255) DEFAULT '' COMMENT '最后登录城市',
  `last_login_region` varchar(255) DEFAULT '' COMMENT '最后登录的省份',
  `pfc_address` varchar(255) DEFAULT '' COMMENT 'PFC充值地址',
  `history_profit` float(20,2) DEFAULT '0.00' COMMENT '历史-自己给自己产生的收益',
  `history_pre_profit` float(20,2) DEFAULT '0.00' COMMENT '历史记录-给上级产生的收益',
  `history_pre_pre_profit` float(20,2) DEFAULT '0.00' COMMENT '历史记录--给上级的上级产生的收益',
  `history_node_profit` float(20,2) DEFAULT '0.00' COMMENT '历史节点收益记录',
  `plusplus` float(20,2) DEFAULT '0.00' COMMENT '剩余未提的收益',
  `today_withdraw` float(20,2) DEFAULT '0.00' COMMENT '今日已经提了xxx金豆',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_list
-- ----------------------------

-- ----------------------------
-- Table structure for use_goods
-- ----------------------------
DROP TABLE IF EXISTS `use_goods`;
CREATE TABLE `use_goods` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '表自增索引',
  `order_id` varchar(255) NOT NULL DEFAULT '0' COMMENT '订单号 不能重复',
  `uid` int(20) DEFAULT '0' COMMENT '使用者的uid',
  `good_id` int(20) DEFAULT '0' COMMENT '使用的物品id\r\n7: 宽带账户 param:account 就是宽带账号\r\n8: 电视账户 param:account 就是电视账户',
  `good_num` int(20) DEFAULT '0' COMMENT '使用的物品数量',
  `use_time` datetime DEFAULT NULL COMMENT '使用时间',
  `param` mediumtext COMMENT '其他关联的参数(json数组)',
  `descript` varchar(255) DEFAULT NULL COMMENT '商品使用描述',
  `status` tinyint(1) DEFAULT '0' COMMENT '审核状态:  0提交未审核 1操作成功 2操作失败',
  `complete_time` datetime DEFAULT NULL COMMENT '审核完成时间',
  `faile_reason` varchar(255) DEFAULT NULL COMMENT '失败原因',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of use_goods
-- ----------------------------
