/*
Navicat MySQL Data Transfer

Source Server         : 192.168.1.167
Source Server Version : 50644
Source Host           : 192.168.1.167:28706
Source Database       : seer_gm

Target Server Type    : MYSQL
Target Server Version : 50644
File Encoding         : 65001

Date: 2019-11-23 15:02:25
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `fa_admin`
-- ----------------------------
DROP TABLE IF EXISTS `fa_admin`;
CREATE TABLE `fa_admin` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(20) NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(50) NOT NULL DEFAULT '' COMMENT '昵称',
  `password` varchar(32) NOT NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(30) NOT NULL DEFAULT '' COMMENT '密码盐',
  `avatar` varchar(100) NOT NULL DEFAULT '' COMMENT '头像',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT '电子邮箱',
  `loginfailure` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '失败次数',
  `logintime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '登录时间',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `token` varchar(59) NOT NULL DEFAULT '' COMMENT 'Session标识',
  `status` varchar(30) NOT NULL DEFAULT 'normal' COMMENT '状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='管理员表';

-- ----------------------------
-- Records of fa_admin
-- ----------------------------
INSERT INTO `fa_admin` VALUES ('1', 'admin', 'Admin', '8fdb69ba9b273c43128c86528879ea12', 'aa7432', '/assets/img/avatar.png', 'admin@admin.com', '0', '1574491899', '1492186163', '1574491899', '12823246-529a-4e48-b4f5-8cd7fcee0e41', 'normal');

-- ----------------------------
-- Table structure for `fa_admin_log`
-- ----------------------------
DROP TABLE IF EXISTS `fa_admin_log`;
CREATE TABLE `fa_admin_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '管理员ID',
  `username` varchar(30) NOT NULL DEFAULT '' COMMENT '管理员名字',
  `url` varchar(1500) NOT NULL DEFAULT '' COMMENT '操作页面',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '日志标题',
  `content` text NOT NULL COMMENT '内容',
  `ip` varchar(50) NOT NULL DEFAULT '' COMMENT 'IP',
  `useragent` varchar(255) NOT NULL DEFAULT '' COMMENT 'User-Agent',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `name` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员日志表';

-- ----------------------------
-- Records of fa_admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for `fa_attachment`
-- ----------------------------
DROP TABLE IF EXISTS `fa_attachment`;
CREATE TABLE `fa_attachment` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '管理员ID',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '会员ID',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '物理路径',
  `imagewidth` varchar(30) NOT NULL DEFAULT '' COMMENT '宽度',
  `imageheight` varchar(30) NOT NULL DEFAULT '' COMMENT '高度',
  `imagetype` varchar(30) NOT NULL DEFAULT '' COMMENT '图片类型',
  `imageframes` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '图片帧数',
  `filesize` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '文件大小',
  `mimetype` varchar(100) NOT NULL DEFAULT '' COMMENT 'mime类型',
  `extparam` varchar(255) NOT NULL DEFAULT '' COMMENT '透传数据',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建日期',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `uploadtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上传时间',
  `storage` varchar(100) NOT NULL DEFAULT 'local' COMMENT '存储位置',
  `sha1` varchar(40) NOT NULL DEFAULT '' COMMENT '文件 sha1编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='附件表';

-- ----------------------------
-- Records of fa_attachment
-- ----------------------------
INSERT INTO `fa_attachment` VALUES ('1', '1', '0', '/assets/img/qrcode.png', '150', '150', 'png', '0', '21859', 'image/png', '', '1499681848', '1499681848', '1499681848', 'local', '17163603d0263e4838b9387ff2cd4877e8b018f6');

-- ----------------------------
-- Table structure for `fa_auth_group`
-- ----------------------------
DROP TABLE IF EXISTS `fa_auth_group`;
CREATE TABLE `fa_auth_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父组别',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '组名',
  `rules` text NOT NULL COMMENT '规则ID',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `status` varchar(30) NOT NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='分组表';

-- ----------------------------
-- Records of fa_auth_group
-- ----------------------------
INSERT INTO `fa_auth_group` VALUES ('1', '0', 'Admin group', '*', '1490883540', '149088354', 'normal');
INSERT INTO `fa_auth_group` VALUES ('2', '1', '二级管理组', '1,2,4,6,7,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,40,41,42,43,44,45,46,47,48,49,50,55,56,57,58,59,60,61,62,63,64,65,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,121,122,124,127,129,130,131,132,133,134,135,136,137,138,139,140,147,150,151,152,153,154,155,160,163,164,165,5,85,102,120,123,126,125,128,159', '1490883540', '1534904561', 'normal');
INSERT INTO `fa_auth_group` VALUES ('3', '2', '三级管理组', '1,4,9,10,11,13,14,15,16,17,40,41,42,43,44,45,46,47,48,49,50,55,56,57,58,59,60,61,62,63,64,65,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,103,104,105,128,129,130,131,132,133,134,135,136,137,138,139,140,5,85,102', '1490883540', '1534314884', 'normal');
INSERT INTO `fa_auth_group` VALUES ('4', '1', 'Second group 2', '1,4,13,14,15,16,17,55,56,57,58,59,60,61,62,63,64,65', '1490883540', '1502205350', 'normal');
INSERT INTO `fa_auth_group` VALUES ('5', '2', 'Third group 2', '1,2,6,7,8,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34', '1490883540', '1502205344', 'normal');
INSERT INTO `fa_auth_group` VALUES ('6', '1', '二级管理组3', '1,8,9,10,11,13,14,15,16,17,29,30,31,32,33,34,40,41,42,43,44,45,46,47,48,49,50,156,157,158,162,2,5', '1534490702', '1535528748', 'normal');
INSERT INTO `fa_auth_group` VALUES ('7', '1', '测试', '1,8,9,10,11,13,14,15,16,17,29,30,31,32,33,34,40,41,42,43,44,45,46,47,48,49,50,86,87,89,90,91,92,93,94,95,98,99,101,103,104,105,121,122,124,129,130,131,132,133,134,135,150,151,152,153,154,155,160,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,213,214,215,216,217,218,219,220,221,222,2,5,85,88,100,102,120,123,128,159', '1535420715', '1566806772', 'normal');
INSERT INTO `fa_auth_group` VALUES ('8', '1', '运营', '13,44,87,89,90,91,92,93,94,95,96,97,98,99,101,103,104,105,121,122,124,127,129,130,131,132,133,134,150,151,152,153,154,155,160,167,168,169,171,179,182,183,185,194,196,204,205,206,213,214,215,216,217,218,219,220,221,222,1,10,5,86,85,88,100,102,120,123,126,125,128,159,170,178,184,193,195', '1537955951', '1566806779', 'normal');

-- ----------------------------
-- Table structure for `fa_auth_group_access`
-- ----------------------------
DROP TABLE IF EXISTS `fa_auth_group_access`;
CREATE TABLE `fa_auth_group_access` (
  `uid` int(10) unsigned NOT NULL COMMENT '会员ID',
  `group_id` int(10) unsigned NOT NULL COMMENT '级别ID',
  UNIQUE KEY `uid_group_id` (`uid`,`group_id`) USING BTREE,
  KEY `uid` (`uid`) USING BTREE,
  KEY `group_id` (`group_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='权限分组表';

-- ----------------------------
-- Records of fa_auth_group_access
-- ----------------------------
INSERT INTO `fa_auth_group_access` VALUES ('1', '1');
INSERT INTO `fa_auth_group_access` VALUES ('2', '2');
INSERT INTO `fa_auth_group_access` VALUES ('3', '3');
INSERT INTO `fa_auth_group_access` VALUES ('4', '5');
INSERT INTO `fa_auth_group_access` VALUES ('5', '5');
INSERT INTO `fa_auth_group_access` VALUES ('6', '6');
INSERT INTO `fa_auth_group_access` VALUES ('7', '7');
INSERT INTO `fa_auth_group_access` VALUES ('8', '8');
INSERT INTO `fa_auth_group_access` VALUES ('9', '7');

-- ----------------------------
-- Table structure for `fa_auth_rule`
-- ----------------------------
DROP TABLE IF EXISTS `fa_auth_rule`;
CREATE TABLE `fa_auth_rule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('menu','file') NOT NULL DEFAULT 'file' COMMENT 'menu为菜单,file为权限节点',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父ID',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '规则名称',
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '规则名称',
  `icon` varchar(50) NOT NULL DEFAULT '' COMMENT '图标',
  `condition` varchar(255) NOT NULL DEFAULT '' COMMENT '条件',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `ismenu` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否为菜单',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `weigh` int(10) NOT NULL DEFAULT '0' COMMENT '权重',
  `status` varchar(30) NOT NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`) USING BTREE,
  KEY `pid` (`pid`) USING BTREE,
  KEY `weigh` (`weigh`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=239 DEFAULT CHARSET=utf8 COMMENT='节点表';

-- ----------------------------
-- Records of fa_auth_rule
-- ----------------------------
INSERT INTO `fa_auth_rule` VALUES ('1', 'file', '0', 'dashboard', 'Dashboard', 'fa fa-dashboard', '', 'Dashboard tips', '1', '1497429920', '1497429920', '143', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('2', 'file', '0', 'general', 'General', 'fa fa-cogs', '', '', '1', '1497429920', '1497430169', '137', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('3', 'file', '0', 'category', '分类管理', 'fa fa-list', '', 'Category tips', '1', '1497429920', '1534747742', '119', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('4', 'file', '0', 'addon', '插件管理', 'fa fa-rocket', '', 'Addon tips', '1', '1502035509', '1534747844', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('5', 'file', '0', 'auth', 'Auth', 'fa fa-group', '', '', '1', '1497429920', '1497430092', '99', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('6', 'file', '2', 'general/config', '系统配置', 'fa fa-cog', '', 'Config tips', '1', '1497429920', '1534747680', '60', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('7', 'file', '2', 'general/attachment', '附件管理', 'fa fa-file-image-o', '', 'Attachment tips', '1', '1497429920', '1534747709', '53', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('8', 'file', '2', 'general/profile', 'Profile', 'fa fa-user', '', '', '1', '1497429920', '1497429920', '34', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('9', 'file', '5', 'auth/admin', 'Admin', 'fa fa-user', '', 'Admin tips', '1', '1497429920', '1497430320', '118', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('10', 'file', '5', 'auth/adminlog', 'Admin log', 'fa fa-list-alt', '', 'Admin log tips', '1', '1497429920', '1497430307', '113', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('11', 'file', '5', 'auth/group', 'Group', 'fa fa-group', '', 'Group tips', '1', '1497429920', '1497429920', '109', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('12', 'file', '5', 'auth/rule', 'Rule', 'fa fa-bars', '', 'Rule tips', '1', '1497429920', '1497430581', '104', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('13', 'file', '1', 'dashboard/index', 'View', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '136', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('14', 'file', '1', 'dashboard/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '135', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('15', 'file', '1', 'dashboard/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '133', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('16', 'file', '1', 'dashboard/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '134', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('17', 'file', '1', 'dashboard/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '132', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('18', 'file', '6', 'general/config/index', 'View', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '52', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('19', 'file', '6', 'general/config/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '51', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('20', 'file', '6', 'general/config/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '50', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('21', 'file', '6', 'general/config/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '49', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('22', 'file', '6', 'general/config/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '48', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('23', 'file', '7', 'general/attachment/index', 'View', 'fa fa-circle-o', '', 'Attachment tips', '0', '1497429920', '1497429920', '59', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('24', 'file', '7', 'general/attachment/select', 'Select attachment', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '58', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('25', 'file', '7', 'general/attachment/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '57', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('26', 'file', '7', 'general/attachment/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '56', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('27', 'file', '7', 'general/attachment/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '55', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('28', 'file', '7', 'general/attachment/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '54', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('29', 'file', '8', 'general/profile/index', 'View', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '33', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('30', 'file', '8', 'general/profile/update', 'Update profile', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '32', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('31', 'file', '8', 'general/profile/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '31', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('32', 'file', '8', 'general/profile/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '30', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('33', 'file', '8', 'general/profile/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '29', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('34', 'file', '8', 'general/profile/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '28', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('35', 'file', '3', 'category/index', 'View', 'fa fa-circle-o', '', 'Category tips', '0', '1497429920', '1497429920', '142', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('36', 'file', '3', 'category/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '141', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('37', 'file', '3', 'category/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '140', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('38', 'file', '3', 'category/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '139', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('39', 'file', '3', 'category/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '138', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('40', 'file', '9', 'auth/admin/index', 'View', 'fa fa-circle-o', '', 'Admin tips', '0', '1497429920', '1497429920', '117', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('41', 'file', '9', 'auth/admin/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '116', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('42', 'file', '9', 'auth/admin/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '115', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('43', 'file', '9', 'auth/admin/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '114', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('44', 'file', '10', 'auth/adminlog/index', 'View', 'fa fa-circle-o', '', 'Admin log tips', '0', '1497429920', '1497429920', '112', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('45', 'file', '10', 'auth/adminlog/detail', 'Detail', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '111', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('46', 'file', '10', 'auth/adminlog/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '110', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('47', 'file', '11', 'auth/group/index', 'View', 'fa fa-circle-o', '', 'Group tips', '0', '1497429920', '1497429920', '108', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('48', 'file', '11', 'auth/group/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '107', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('49', 'file', '11', 'auth/group/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '106', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('50', 'file', '11', 'auth/group/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '105', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('51', 'file', '12', 'auth/rule/index', 'View', 'fa fa-circle-o', '', 'Rule tips', '0', '1497429920', '1497429920', '103', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('52', 'file', '12', 'auth/rule/add', 'Add', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '102', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('53', 'file', '12', 'auth/rule/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '101', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('54', 'file', '12', 'auth/rule/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1497429920', '1497429920', '100', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('55', 'file', '4', 'addon/index', 'View', 'fa fa-circle-o', '', 'Addon tips', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('56', 'file', '4', 'addon/add', 'Add', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('57', 'file', '4', 'addon/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('58', 'file', '4', 'addon/del', 'Delete', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('59', 'file', '4', 'addon/local', 'Local install', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('60', 'file', '4', 'addon/state', 'Update state', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('61', 'file', '4', 'addon/install', 'Install', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('62', 'file', '4', 'addon/uninstall', 'Uninstall', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('63', 'file', '4', 'addon/config', 'Setting', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('64', 'file', '4', 'addon/refresh', 'Refresh', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('65', 'file', '4', 'addon/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1502035509', '1502035509', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('66', 'file', '0', 'user', '会员管理', 'fa fa-list', '', '', '1', '1516374729', '1563161693', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('67', 'file', '66', 'user/user', 'User', 'fa fa-user', '', '', '1', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('68', 'file', '67', 'user/user/index', 'View', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('69', 'file', '67', 'user/user/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('70', 'file', '67', 'user/user/add', 'Add', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('71', 'file', '67', 'user/user/del', 'Del', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('72', 'file', '67', 'user/user/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('73', 'file', '66', 'user/group', 'User group', 'fa fa-users', '', '', '1', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('74', 'file', '73', 'user/group/add', 'Add', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('75', 'file', '73', 'user/group/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('76', 'file', '73', 'user/group/index', 'View', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('77', 'file', '73', 'user/group/del', 'Del', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('78', 'file', '73', 'user/group/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('79', 'file', '66', 'user/rule', 'User rule', 'fa fa-circle-o', '', '', '1', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('80', 'file', '79', 'user/rule/index', 'View', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('81', 'file', '79', 'user/rule/del', 'Del', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('82', 'file', '79', 'user/rule/add', 'Add', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('83', 'file', '79', 'user/rule/edit', 'Edit', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('84', 'file', '79', 'user/rule/multi', 'Multi', 'fa fa-circle-o', '', '', '0', '1516374729', '1516374729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('85', 'file', '0', 'player', '玩家模块', 'fa fa-arrows-alt', '', '', '1', '1534235716', '1534237293', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('86', 'file', '85', 'player/player', '玩家列表', 'fa fa-bar-chart', '', '', '1', '1534235748', '1534744971', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('87', 'file', '86', 'player/player/index', 'View', 'fa fa-circle-o', '', '', '0', '1534235777', '1534235777', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('88', 'file', '85', 'player/monitor', '监控列表', 'fa fa-book', '', '', '1', '1534235808', '1534745056', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('89', 'file', '88', 'player/monitor/index', 'View', 'fa fa-circle-o', '', '', '0', '1534235829', '1534235829', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('90', 'file', '85', 'player/diamond', '钻石消耗', 'fa fa-circle-o', '', '', '1', '1534237167', '1534745078', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('91', 'file', '90', 'player/diamond/index', 'View', 'fa fa-circle-o', '', '', '0', '1534237221', '1534237221', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('92', 'file', '85', 'player/room', '房卡消耗', 'fa fa-circle-o', '', '', '1', '1534237426', '1534237426', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('93', 'file', '92', 'player/room/index', '查看', 'fa fa-circle-o', '', '', '0', '1534237446', '1534237446', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('94', 'file', '85', 'player/gold', '金豆消耗', 'fa fa-circle-o', '', '', '1', '1534237578', '1534237679', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('95', 'file', '94', 'player/gold/index', '查看', 'fa fa-circle-o', '', '', '0', '1534237700', '1534237700', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('96', 'file', '85', 'player/gamerecord', '游戏记录', 'fa fa-circle-o', '', '', '1', '1534237886', '1534237886', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('97', 'file', '96', 'player/gamerecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1534237907', '1534237907', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('98', 'file', '85', 'player/servicerecord', '服务费记录', 'fa fa-circle-o', '', '', '1', '1534237941', '1534237941', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('99', 'file', '98', 'player/servicerecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1534237966', '1534237966', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('100', 'file', '85', 'player/resourcesid', '资源增减', 'fa fa-circle-o', '', '', '1', '1534238233', '1534238233', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('101', 'file', '100', 'player/resourcesid/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238253', '1534238253', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('102', 'file', '85', 'player/accountclosure', '账号封禁', 'fa fa-circle-o', '', '', '1', '1534238281', '1534238303', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('103', 'file', '102', 'player/accountclosure/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238320', '1534238320', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('104', 'file', '85', 'player/bindphone', '绑定手机记录', 'fa fa-circle-o', '', '', '1', '1534238353', '1564041910', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('105', 'file', '104', 'player/bindphone/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238368', '1534238368', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('106', 'file', '0', 'datamodule', '数据模块', 'fa fa-circle-o', '', '', '1', '1534238486', '1562739529', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('107', 'file', '106', 'datamodule/rechargerecord', '充值记录', 'fa fa-circle-o', '', '', '1', '1534238523', '1534238523', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('108', 'file', '107', 'datamodule/rechargerecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238541', '1534238541', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('109', 'file', '106', 'datamodule/librarylist', '馆主列表', 'fa fa-circle-o', '', '', '1', '1534238575', '1534238575', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('110', 'file', '109', 'datamodule/librarylist/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238589', '1534238589', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('111', 'file', '106', 'datamodule/rebatestatistics', '返利统计', 'fa fa-circle-o', '', '', '1', '1534238619', '1534238619', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('112', 'file', '111', 'datamodule/rebatestatistics/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238631', '1534238631', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('113', 'file', '0', 'finance', '财务模块', 'fa fa-circle-o', '', '', '1', '1534238698', '1562739511', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('114', 'file', '113', 'finance/presentexamine', '提现审核', 'fa fa-circle-o', '', '', '1', '1534238729', '1534238729', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('115', 'file', '114', 'finance/presentexamine/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238741', '1534238741', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('116', 'file', '113', 'finance/putforwardlist', '提现列表', 'fa fa-circle-o', '', '', '1', '1534238770', '1534238770', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('117', 'file', '116', 'finance/putforwardlist/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238784', '1534238784', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('118', 'file', '113', 'finance/financiallist', '财务审核列表', 'fa fa-circle-o', '', '', '1', '1534238811', '1534238811', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('119', 'file', '118', 'finance/financiallist/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238824', '1534238824', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('120', 'file', '0', 'gamemodule', '游戏模块', 'fa fa-audio-description', '', '', '1', '1534238893', '1534316803', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('121', 'file', '120', 'gamemodule/horseset', '跑马灯设置', 'fa fa-bitbucket', '', '', '1', '1534238916', '1534316825', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('122', 'file', '121', 'gamemodule/horseset/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238929', '1534238929', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('123', 'file', '120', 'gamemodule/shopset', '商城设置', 'fa fa-circle-o', '', '', '1', '1534238960', '1534238976', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('124', 'file', '123', 'gamemodule/shopset/index', '查看', 'fa fa-circle-o', '', '', '0', '1534238996', '1534238996', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('125', 'file', '0', 'operate', '运营管理', 'fa fa-circle-o', '', '', '1', '1534239092', '1534239092', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('126', 'file', '125', 'operate/log', '运营日志', 'fa fa-circle-o', '', '', '1', '1534239197', '1534239197', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('127', 'file', '126', 'operate/log/index', '查看', 'fa fa-circle-o', '', '', '0', '1534239211', '1534239211', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('128', 'file', '0', 'bscpurse', 'BSC钱包', 'fa fa-circle-o', '', '', '1', '1534239321', '1562739565', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('129', 'file', '128', 'bscpurse/servicerecord', '服务费记录', 'fa fa-circle-o', '', '', '1', '1534239350', '1534239368', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('130', 'file', '129', 'bscpurse/servicerecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1534239397', '1534239397', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('131', 'file', '128', 'bscpurse/rechargerecord', '充值记录', 'fa fa-circle-o', '', '', '1', '1534239433', '1534239433', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('132', 'file', '131', 'bscpurse/rechargerecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1534239446', '1534239446', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('133', 'file', '128', 'bscpurse/exchangerecord', '兑换记录', 'fa fa-circle-o', '', '', '1', '1534239477', '1534239477', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('134', 'file', '133', 'bscpurse/exchangerecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1534239491', '1534239491', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('135', 'file', '86', 'player/player/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1534298230', '1534298230', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('136', 'file', '88', 'player/monitor/add', '添加', 'fa fa-circle-o', '', '', '0', '1534298704', '1534299037', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('137', 'file', '88', 'player/monitor/del', '删除', 'fa fa-circle-o', '', '', '0', '1534298724', '1534298724', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('138', 'file', '100', 'player/resourcesid/tiao', '编辑', 'fa fa-circle-o', '', '', '0', '1534301141', '1534301141', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('139', 'file', '102', 'player/accountclosure/tiao', '添加', 'fa fa-circle-o', '', '', '0', '1534301841', '1534301841', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('140', 'file', '102', 'player/accountclosure/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1534301872', '1534301872', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('141', 'file', '102', 'player/accountclosure/del', '移除', 'fa fa-circle-o', '', '', '0', '1534301893', '1534301893', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('147', 'file', '123', 'gamemodule/shopset/batchedit', '批量更新', 'fa fa-circle-o', '', '', '0', '1534312536', '1534312536', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('148', 'file', '123', 'gamemodule/shopset/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1534312557', '1534312557', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('149', 'file', '126', 'operate/log/exportorderexcel', 'Excel导出', 'fa fa-circle-o', '', '', '0', '1534314100', '1534314100', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('150', 'file', '121', 'gamemodule/horseset/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1534316992', '1534317148', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('151', 'file', '121', 'gamemodule/horseset/add', '新增条目', 'fa fa-circle-o', '', '', '0', '1534318040', '1534318040', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('152', 'file', '121', 'gamemodule/horseset/timeset', '时间设置', 'fa fa-circle-o', '', '', '0', '1534318073', '1534318073', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('153', 'file', '121', 'gamemodule/horseset/temporaryinserting', '临时插播', 'fa fa-circle-o', '', '', '0', '1534318102', '1534318102', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('154', 'file', '121', 'temporaryrecording/index', '插播记录', 'fa fa-circle-o', '', '', '0', '1534318132', '1534318132', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('155', 'file', '121', 'gamemodule/horseset/editsave', '编辑保存', 'fa fa-circle-o', '', '', '0', '1534324681', '1534324971', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('156', 'file', '0', 'upload', '上传管理', 'fa fa-circle-o', '', '', '1', '1534486898', '1534486898', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('157', 'file', '156', 'upload/upload', '上传工具', 'fa fa-circle-o', '', '', '1', '1534486960', '1534486960', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('158', 'file', '157', 'upload/upload/index', '查看', 'fa fa-circle-o', '', '', '0', '1534487004', '1534487004', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('159', 'file', '128', 'bscpurse/jackpot', '奖池设置', 'fa fa-circle-o', '', '', '1', '1534488234', '1534488234', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('160', 'file', '159', 'bscpurse/jackpot/index', '查看', 'fa fa-circle-o', '', '', '0', '1534488272', '1534488272', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('161', 'file', '159', 'bscpurse/jackpot/set', '奖池设置', 'fa fa-circle-o', '', '', '0', '1534489636', '1534489636', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('162', 'file', '157', 'upload/upload/upload', '上传保存', 'fa fa-circle-o', '', '', '0', '1534747244', '1534747244', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('163', 'file', '0', 'mail', '邮件管理', 'fa fa-circle-o', '', '', '1', '1534904437', '1534904437', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('164', 'file', '163', 'mail/sendmail', '发送邮件', 'fa fa-circle-o', '', '', '1', '1534904470', '1534904489', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('165', 'file', '164', 'mail/sendmail/index', '查看', 'fa fa-circle-o', '', '', '0', '1534904521', '1534904521', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('166', 'file', '164', 'mail/sendmail/set', '发送', 'fa fa-circle-o', '', '', '0', '1535419919', '1535419919', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('167', 'file', '121', 'gamemodule/horseset/addsave', '新增条目保存', 'fa fa-circle-o', '', '', '0', '1535420320', '1535420353', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('168', 'file', '121', 'gamemodule/horseset/timesetsave', '时间设置保存', 'fa fa-circle-o', '', '', '0', '1535420423', '1535420423', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('169', 'file', '121', 'gamemodule/horseset/temporaryinsertingsave1', '临时插播保存', 'fa fa-circle-o', '', '', '0', '1535420544', '1535420544', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('170', 'file', '120', 'gamemodule/whitelist', '白名单', 'fa fa-circle-o', '', '', '1', '1536134196', '1536134196', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('171', 'file', '170', 'gamemodule/whitelist/index', '查看', 'fa fa-circle-o', '', '', '0', '1536134226', '1536134226', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('172', 'file', '170', 'gamemodule/whitelist/add', '添加', 'fa fa-circle-o', '', '', '0', '1536134245', '1536134245', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('173', 'file', '170', 'gamemodule/whitelist/del', '删除', 'fa fa-circle-o', '', '', '0', '1536134267', '1536134267', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('174', 'file', '170', 'gamemodule/whitelist/delbatch', '批量删除', 'fa fa-circle-o', '', '', '0', '1536134286', '1536134286', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('175', 'file', '170', 'gamemodule/whitelist/addsave', '添加保存', 'fa fa-circle-o', '', '', '0', '1536134308', '1536134308', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('176', 'file', '170', 'gamemodule/whitelist/modify', '修改服务器状态', 'fa fa-circle-o', '', '', '0', '1536134329', '1536134329', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('177', 'file', '170', 'gamemodule/whitelist/modifymodifysave', '修改服务器状态保存', 'fa fa-circle-o', '', '', '0', '1536134348', '1536134348', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('178', 'file', '120', 'gamemodule/lucky', '幸运值', 'fa fa-circle-o', '', '', '1', '1537406716', '1537406716', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('179', 'file', '178', 'gamemodule/lucky/index', '查看', 'fa fa-circle-o', '', '', '0', '1537406739', '1537406739', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('180', 'file', '178', 'gamemodule/lucky/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1537406762', '1537406762', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('181', 'file', '178', 'gamemodule/lucky/editsave', '编辑保存', 'fa fa-circle-o', '', '', '0', '1537406788', '1537406788', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('182', 'file', '120', 'gamemodule/xiangqi', '象棋', 'fa fa-circle-o', '', '', '1', '1537406809', '1537406809', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('183', 'file', '182', 'gamemodule/xiangqi/index', '查看', 'fa fa-circle-o', '', '', '0', '1537406831', '1537406831', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('184', 'file', '120', 'gamemodule/online', '在线人数', 'fa fa-circle-o', '', '', '1', '1537406852', '1537406852', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('185', 'file', '184', 'gamemodule/online/index', '查看', 'fa fa-circle-o', '', '', '0', '1537406874', '1537406874', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('186', 'file', '184', 'gamemodule/online/refresh', '刷新', 'fa fa-circle-o', '', '', '0', '1537406894', '1537406894', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('187', 'file', '178', 'gamemodule/lucky/index1', '查看1', 'fa fa-circle-o', '', '', '0', '1537415614', '1537415614', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('188', 'file', '0', 'task', '任务管理', 'fa fa-circle-o', '', '', '1', '1539397934', '1541989486', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('189', 'file', '188', 'task/system', '系统设置', 'fa fa-circle-o', '', '', '1', '1539397985', '1539397985', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('190', 'file', '189', 'task/system/index', '查看', 'fa fa-circle-o', '', '', '0', '1539398004', '1539398004', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('191', 'file', '189', 'task/system/add', '添加', 'fa fa-circle-o', '', '', '0', '1539398103', '1539398103', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('192', 'file', '189', 'task/system/addsave', '添加保存', 'fa fa-circle-o', '', '', '0', '1539398136', '1539398136', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('193', 'file', '120', 'gamemodule/prop', '道具设置', 'fa fa-circle-o', '', '', '1', '1541489168', '1541489168', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('194', 'file', '193', 'gamemodule/prop/index', '查看', 'fa fa-circle-o', '', '', '0', '1541489195', '1541489195', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('195', 'file', '120', 'gamemodule/phone', '电话卡充值', 'fa fa-circle-o', '', '', '1', '1541649350', '1566353864', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('196', 'file', '195', 'gamemodule/phone/index', '查看', 'fa fa-circle-o', '', '', '0', '1541649366', '1541650177', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('197', 'file', '195', 'gamemodule/phone/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1541656392', '1541656392', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('198', 'file', '195', 'gamemodule/phone/editsave', '编辑保存', 'fa fa-circle-o', '', '', '0', '1541656412', '1541656412', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('199', 'file', '193', 'gamemodule/prop/edit', '编辑', 'fa fa-circle-o', '', '', '0', '1541988175', '1541988175', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('200', 'file', '193', 'gamemodule/prop/editsave', '编辑保存', 'fa fa-circle-o', '', '', '0', '1541988201', '1541988201', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('201', 'file', '156', 'upload/package', '包上传', 'fa fa-circle-o', '', '', '1', '1562739698', '1562739698', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('202', 'file', '201', 'upload/package/index', '查看', 'fa fa-circle-o', '', '', '0', '1562739720', '1562739720', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('203', 'file', '201', 'upload/package/upload', '上传', 'fa fa-circle-o', '', '', '0', '1562739785', '1562739785', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('204', 'file', '120', 'gamemodule/agentconfig', '代理配置', 'fa fa-circle-o', '', '', '1', '1562828625', '1562828625', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('205', 'file', '204', 'gamemodule/agentconfig/index', '查看', 'fa fa-circle-o', '', '', '0', '1562828780', '1562828780', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('206', 'file', '204', 'gamemodule/agentconfig/set', '设置', 'fa fa-circle-o', '', '', '0', '1562828801', '1562828801', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('207', 'file', '120', 'gamemodule/recharge', '虚拟充值', 'fa fa-circle-o', '', '', '1', '1562919854', '1562919854', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('208', 'file', '207', 'gamemodule/recharge/index', '查看', 'fa fa-circle-o', '', '', '0', '1562919892', '1562919892', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('209', 'file', '120', 'gamemodule/promotingrebate', '推广返利', 'fa fa-circle-o', '', '', '1', '1563161224', '1563161224', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('210', 'file', '120', 'gamemodule/setgm', '设置总代', 'fa fa-circle-o', '', '', '1', '1563849695', '1563849695', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('211', 'file', '210', 'gamemodule/setgm/index', '查看', 'fa fa-circle-o', '', '', '0', '1563849726', '1563849726', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('212', 'file', '210', 'gamemodule/setgm/set', '设置', 'fa fa-circle-o', '', '', '0', '1563849747', '1563849747', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('213', 'file', '85', 'player/companyprofit', '公司获利', 'fa fa-circle-o', '', '', '1', '1566454000', '1566465541', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('214', 'file', '213', 'player/companyprofit/index', '查看', 'fa fa-circle-o', '', '', '0', '1566454022', '1566454035', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('215', 'file', '213', 'player/companyprofit/companyprofitsum', '合计', 'fa fa-circle-o', '', '', '0', '1566525512', '1566525512', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('216', 'file', '85', 'player/pfcrecharge', 'pfc充值记录', 'fa fa-circle-o', '', '', '1', '1566788902', '1574491980', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('217', 'file', '85', 'player/pfcwithdraw', 'pfc提现记录', 'fa fa-circle-o', '', '', '1', '1566790565', '1574491990', '0', 'hidden');
INSERT INTO `fa_auth_rule` VALUES ('218', 'file', '216', 'player/pfcrecharge/index', '查看', 'fa fa-circle-o', '', '', '0', '1566800112', '1566800112', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('219', 'file', '216', 'player/pfcrecharge/sum', '计和', 'fa fa-circle-o', '', '', '0', '1566800147', '1566800147', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('220', 'file', '217', 'player/pfcwithdraw/index', '查看', 'fa fa-circle-o', '', '', '0', '1566800202', '1566800202', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('221', 'file', '217', 'player/pfcwithdraw/sum', '计和', 'fa fa-circle-o', '', '', '0', '1566800226', '1566800226', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('222', 'file', '216', 'player/pfcrecharge/sumpeople', '总人数', 'fa fa-circle-o', '', '', '0', '1566806758', '1566806758', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('223', 'file', '120', 'gamemodule/seer', 'seer账户余额查询', 'fa fa-circle-o', '', '', '1', '1568704526', '1568704526', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('224', 'file', '223', 'gamemodule/seer/index', '查看', 'fa fa-circle-o', '', '', '0', '1568704545', '1568704590', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('225', 'file', '223', 'gamemodule/seer/cha', '查询', 'fa fa-circle-o', '', '', '0', '1568704620', '1568704620', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('226', 'file', '120', 'gamemodule/transfer', 'seer转账交易', 'fa fa-circle-o', '', '', '1', '1568705075', '1568705111', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('227', 'file', '226', 'gamemodule/transfer/index', '查看', 'fa fa-circle-o', '', '', '0', '1568705129', '1568705129', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('228', 'file', '226', 'gamemodule/transfer/set', '设置', 'fa fa-circle-o', '', '', '0', '1568705402', '1568705402', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('229', 'file', '120', 'gamemodule/createsc', 'seer创建平台', 'fa fa-circle-o', '', '', '1', '1568707021', '1568707021', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('230', 'file', '229', 'gamemodule/createsc/index', '查看', 'fa fa-circle-o', '', '', '0', '1568707036', '1568707036', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('231', 'file', '229', 'gamemodule/createsc/createsave', '创建平台', 'fa fa-circle-o', '', '', '0', '1568709017', '1568709466', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('232', 'file', '120', 'gamemodule/operatesc', 'seer操作平台', 'fa fa-circle-o', '', '', '1', '1568774994', '1568774994', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('233', 'file', '232', 'gamemodule/operatesc/index', '查看', 'fa fa-circle-o', '', '', '0', '1568775016', '1568775016', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('234', 'file', '232', 'gamemodule/operatesc/set', '设置', 'fa fa-circle-o', '', '', '0', '1568775036', '1568775036', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('235', 'file', '120', 'gamemodule/getsctransferrecords', '获取平台划转情况', 'fa fa-circle-o', '', '', '1', '1568791252', '1568791252', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('236', 'file', '235', 'gamemodule/getsctransferrecords/index', '查看', 'fa fa-circle-o', '', '', '0', '1568791277', '1568791277', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('237', 'file', '120', 'gamemodule/gethistoryrecord', '获取历史记录', 'fa fa-circle-o', '', '', '1', '1571034810', '1571034810', '0', 'normal');
INSERT INTO `fa_auth_rule` VALUES ('238', 'file', '237', 'gamemodule/gethistoryrecord/index', '查看', 'fa fa-circle-o', '', '', '0', '1571034849', '1571034849', '0', 'normal');

-- ----------------------------
-- Table structure for `fa_category`
-- ----------------------------
DROP TABLE IF EXISTS `fa_category`;
CREATE TABLE `fa_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '父ID',
  `type` varchar(30) NOT NULL DEFAULT '' COMMENT '栏目类型',
  `name` varchar(30) NOT NULL DEFAULT '',
  `nickname` varchar(50) NOT NULL DEFAULT '',
  `flag` set('hot','index','recommend') NOT NULL DEFAULT '',
  `image` varchar(100) NOT NULL DEFAULT '' COMMENT '图片',
  `keywords` varchar(255) NOT NULL DEFAULT '' COMMENT '关键字',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `diyname` varchar(30) NOT NULL DEFAULT '' COMMENT '自定义名称',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `weigh` int(10) NOT NULL DEFAULT '0' COMMENT '权重',
  `status` varchar(30) NOT NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `weigh` (`weigh`,`id`) USING BTREE,
  KEY `pid` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='分类表';

-- ----------------------------
-- Records of fa_category
-- ----------------------------
INSERT INTO `fa_category` VALUES ('1', '0', 'page', '官方新闻', 'news', 'recommend', '/assets/img/qrcode.png', '', '', 'news', '1495262190', '1495262190', '1', 'normal');
INSERT INTO `fa_category` VALUES ('2', '0', 'page', '移动应用', 'mobileapp', 'hot', '/assets/img/qrcode.png', '', '', 'mobileapp', '1495262244', '1495262244', '2', 'normal');
INSERT INTO `fa_category` VALUES ('3', '2', 'page', '微信公众号', 'wechatpublic', 'index', '/assets/img/qrcode.png', '', '', 'wechatpublic', '1495262288', '1495262288', '3', 'normal');
INSERT INTO `fa_category` VALUES ('4', '2', 'page', 'Android开发', 'android', 'recommend', '/assets/img/qrcode.png', '', '', 'android', '1495262317', '1495262317', '4', 'normal');
INSERT INTO `fa_category` VALUES ('5', '0', 'page', '软件产品', 'software', 'recommend', '/assets/img/qrcode.png', '', '', 'software', '1495262336', '1499681850', '5', 'normal');
INSERT INTO `fa_category` VALUES ('6', '5', 'page', '网站建站', 'website', 'recommend', '/assets/img/qrcode.png', '', '', 'website', '1495262357', '1495262357', '6', 'normal');
INSERT INTO `fa_category` VALUES ('7', '5', 'page', '企业管理软件', 'company', 'index', '/assets/img/qrcode.png', '', '', 'company', '1495262391', '1495262391', '7', 'normal');
INSERT INTO `fa_category` VALUES ('8', '6', 'page', 'PC端', 'website-pc', 'recommend', '/assets/img/qrcode.png', '', '', 'website-pc', '1495262424', '1495262424', '8', 'normal');
INSERT INTO `fa_category` VALUES ('9', '6', 'page', '移动端', 'website-mobile', 'recommend', '/assets/img/qrcode.png', '', '', 'website-mobile', '1495262456', '1495262456', '9', 'normal');
INSERT INTO `fa_category` VALUES ('10', '7', 'page', 'CRM系统 ', 'company-crm', 'recommend', '/assets/img/qrcode.png', '', '', 'company-crm', '1495262487', '1495262487', '10', 'normal');
INSERT INTO `fa_category` VALUES ('11', '7', 'page', 'SASS平台软件', 'company-sass', 'recommend', '/assets/img/qrcode.png', '', '', 'company-sass', '1495262515', '1495262515', '11', 'normal');
INSERT INTO `fa_category` VALUES ('12', '0', 'test', '测试1', 'test1', 'recommend', '/assets/img/qrcode.png', '', '', 'test1', '1497015727', '1497015727', '12', 'normal');
INSERT INTO `fa_category` VALUES ('13', '0', 'test', '测试2', 'test2', 'recommend', '/assets/img/qrcode.png', '', '', 'test2', '1497015738', '1497015738', '13', 'normal');

-- ----------------------------
-- Table structure for `fa_config`
-- ----------------------------
DROP TABLE IF EXISTS `fa_config`;
CREATE TABLE `fa_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '变量名',
  `group` varchar(30) NOT NULL DEFAULT '' COMMENT '分组',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '变量标题',
  `tip` varchar(100) NOT NULL DEFAULT '' COMMENT '变量描述',
  `type` varchar(30) NOT NULL DEFAULT '' COMMENT '类型:string,text,int,bool,array,datetime,date,file',
  `value` text NOT NULL COMMENT '变量值',
  `content` text NOT NULL COMMENT '变量字典数据',
  `rule` varchar(100) NOT NULL DEFAULT '' COMMENT '验证规则',
  `extend` varchar(255) NOT NULL DEFAULT '' COMMENT '扩展属性',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COMMENT='系统配置';

-- ----------------------------
-- Records of fa_config
-- ----------------------------
INSERT INTO `fa_config` VALUES ('1', 'name', 'basic', 'Site name', '请填写站点名称', 'string', 'FastAdmin', '', 'required', '');
INSERT INTO `fa_config` VALUES ('2', 'beian', 'basic', 'Beian', '粤ICP备15054802号-4', 'string', '', '', '', '');
INSERT INTO `fa_config` VALUES ('3', 'cdnurl', 'basic', 'Cdn url', '如果静态资源使用第三方云储存请配置该值', 'string', '', '', '', '');
INSERT INTO `fa_config` VALUES ('4', 'version', 'basic', 'Version', '如果静态资源有变动请重新配置该值', 'string', '1.0.1', '', 'required', '');
INSERT INTO `fa_config` VALUES ('5', 'timezone', 'basic', 'Timezone', '', 'string', 'Asia/Shanghai', '', 'required', '');
INSERT INTO `fa_config` VALUES ('6', 'forbiddenip', 'basic', 'Forbidden ip', '一行一条记录', 'text', '', '', '', '');
INSERT INTO `fa_config` VALUES ('7', 'languages', 'basic', 'Languages', '', 'array', '{\"backend\":\"zh-cn\",\"frontend\":\"zh-cn\"}', '', 'required', '');
INSERT INTO `fa_config` VALUES ('8', 'fixedpage', 'basic', 'Fixed page', '请尽量输入左侧菜单栏存在的链接', 'string', 'dashboard', '', 'required', '');
INSERT INTO `fa_config` VALUES ('9', 'categorytype', 'dictionary', 'Category type', '', 'array', '{\"default\":\"Default\",\"page\":\"Page\",\"article\":\"Article\",\"test\":\"Test\"}', '', '', '');
INSERT INTO `fa_config` VALUES ('10', 'configgroup', 'dictionary', 'Config group', '', 'array', '{\"basic\":\"Basic\",\"email\":\"Email\",\"dictionary\":\"Dictionary\",\"user\":\"User\",\"example\":\"Example\"}', '', '', '');
INSERT INTO `fa_config` VALUES ('11', 'mail_type', 'email', 'Mail type', '选择邮件发送方式', 'select', '1', '[\"Please select\",\"SMTP\",\"Mail\"]', '', '');
INSERT INTO `fa_config` VALUES ('12', 'mail_smtp_host', 'email', 'Mail smtp host', '错误的配置发送邮件会导致服务器超时', 'string', 'smtp.qq.com', '', '', '');
INSERT INTO `fa_config` VALUES ('13', 'mail_smtp_port', 'email', 'Mail smtp port', '(不加密默认25,SSL默认465,TLS默认587)', 'string', '465', '', '', '');
INSERT INTO `fa_config` VALUES ('14', 'mail_smtp_user', 'email', 'Mail smtp user', '（填写完整用户名）', 'string', '10000', '', '', '');
INSERT INTO `fa_config` VALUES ('15', 'mail_smtp_pass', 'email', 'Mail smtp password', '（填写您的密码）', 'string', 'password', '', '', '');
INSERT INTO `fa_config` VALUES ('16', 'mail_verify_type', 'email', 'Mail vertify type', '（SMTP验证方式[推荐SSL]）', 'select', '2', '[\"None\",\"TLS\",\"SSL\"]', '', '');
INSERT INTO `fa_config` VALUES ('17', 'mail_from', 'email', 'Mail from', '', 'string', '10000@qq.com', '', '', '');

-- ----------------------------
-- Table structure for `fa_ems`
-- ----------------------------
DROP TABLE IF EXISTS `fa_ems`;
CREATE TABLE `fa_ems` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `event` varchar(30) NOT NULL DEFAULT '' COMMENT '事件',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT '邮箱',
  `code` varchar(10) NOT NULL DEFAULT '' COMMENT '验证码',
  `times` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '验证次数',
  `ip` varchar(30) NOT NULL DEFAULT '' COMMENT 'IP',
  `createtime` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='邮箱验证码表';

-- ----------------------------
-- Records of fa_ems
-- ----------------------------

-- ----------------------------
-- Table structure for `fa_sms`
-- ----------------------------
DROP TABLE IF EXISTS `fa_sms`;
CREATE TABLE `fa_sms` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `event` varchar(30) NOT NULL DEFAULT '' COMMENT '事件',
  `mobile` varchar(20) NOT NULL DEFAULT '' COMMENT '手机号',
  `code` varchar(10) NOT NULL DEFAULT '' COMMENT '验证码',
  `times` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '验证次数',
  `ip` varchar(30) NOT NULL DEFAULT '' COMMENT 'IP',
  `createtime` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='短信验证码表';

-- ----------------------------
-- Records of fa_sms
-- ----------------------------

-- ----------------------------
-- Table structure for `fa_test`
-- ----------------------------
DROP TABLE IF EXISTS `fa_test`;
CREATE TABLE `fa_test` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int(10) NOT NULL DEFAULT '0' COMMENT '管理员ID',
  `category_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '分类ID(单选)',
  `category_ids` varchar(100) NOT NULL COMMENT '分类ID(多选)',
  `week` enum('monday','tuesday','wednesday') NOT NULL COMMENT '星期(单选):monday=星期一,tuesday=星期二,wednesday=星期三',
  `flag` set('hot','index','recommend') NOT NULL DEFAULT '' COMMENT '标志(多选):hot=热门,index=首页,recommend=推荐',
  `genderdata` enum('male','female') NOT NULL DEFAULT 'male' COMMENT '性别(单选):male=男,female=女',
  `hobbydata` set('music','reading','swimming') NOT NULL COMMENT '爱好(多选):music=音乐,reading=读书,swimming=游泳',
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `image` varchar(100) NOT NULL DEFAULT '' COMMENT '图片',
  `images` varchar(1500) NOT NULL DEFAULT '' COMMENT '图片组',
  `attachfile` varchar(100) NOT NULL DEFAULT '' COMMENT '附件',
  `keywords` varchar(100) NOT NULL DEFAULT '' COMMENT '关键字',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `city` varchar(100) NOT NULL DEFAULT '' COMMENT '省市',
  `price` float(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '价格',
  `views` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '点击',
  `startdate` date DEFAULT NULL COMMENT '开始日期',
  `activitytime` datetime DEFAULT NULL COMMENT '活动时间(datetime)',
  `year` year(4) DEFAULT NULL COMMENT '年',
  `times` time DEFAULT NULL COMMENT '时间',
  `refreshtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '刷新时间(int)',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `weigh` int(10) NOT NULL DEFAULT '0' COMMENT '权重',
  `switch` tinyint(1) NOT NULL DEFAULT '0' COMMENT '开关',
  `status` enum('normal','hidden') NOT NULL DEFAULT 'normal' COMMENT '状态',
  `state` enum('0','1','2') NOT NULL DEFAULT '1' COMMENT '状态值:0=禁用,1=正常,2=推荐',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='测试表';

-- ----------------------------
-- Records of fa_test
-- ----------------------------
INSERT INTO `fa_test` VALUES ('1', '0', '12', '12,13', 'monday', 'hot,index', 'male', 'music,reading', '我是一篇测试文章', '<p>我是测试内容</p>', '/assets/img/avatar.png', '/assets/img/avatar.png,/assets/img/qrcode.png', '/assets/img/avatar.png', '关键字', '描述', '广西壮族自治区/百色市/平果县', '0.00', '0', '2017-07-10', '2017-07-10 18:24:45', '2017', '18:24:45', '1499682285', '1499682526', '1499682526', '0', '1', 'normal', '1');

-- ----------------------------
-- Table structure for `fa_user`
-- ----------------------------
DROP TABLE IF EXISTS `fa_user`;
CREATE TABLE `fa_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `group_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '组别ID',
  `username` varchar(32) NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(50) NOT NULL DEFAULT '' COMMENT '昵称',
  `password` varchar(32) NOT NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(30) NOT NULL DEFAULT '' COMMENT '密码盐',
  `email` varchar(100) NOT NULL DEFAULT '' COMMENT '电子邮箱',
  `mobile` varchar(11) NOT NULL DEFAULT '' COMMENT '手机号',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '头像',
  `level` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '等级',
  `gender` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `bio` varchar(100) NOT NULL DEFAULT '' COMMENT '格言',
  `score` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '积分',
  `successions` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '连续登录天数',
  `maxsuccessions` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '最大连续登录天数',
  `prevtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上次登录时间',
  `logintime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '登录时间',
  `loginip` varchar(50) NOT NULL DEFAULT '' COMMENT '登录IP',
  `loginfailure` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '失败次数',
  `joinip` varchar(50) NOT NULL DEFAULT '' COMMENT '加入IP',
  `jointime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '加入时间',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `token` varchar(50) NOT NULL DEFAULT '' COMMENT 'Token',
  `status` varchar(30) NOT NULL DEFAULT '' COMMENT '状态',
  `verification` varchar(255) NOT NULL DEFAULT '' COMMENT '验证',
  PRIMARY KEY (`id`),
  KEY `username` (`username`) USING BTREE,
  KEY `email` (`email`) USING BTREE,
  KEY `mobile` (`mobile`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='会员表';

-- ----------------------------
-- Records of fa_user
-- ----------------------------
INSERT INTO `fa_user` VALUES ('1', '1', 'admin', 'admin', 'c13f62012fd6a8fdf06b3452a94430e5', 'rpR6Bv', 'admin@163.com', '13888888888', '/assets/img/avatar.png', '0', '0', '2017-04-15', '', '0', '1', '1', '1516170492', '1516171614', '127.0.0.1', '0', '127.0.0.1', '1491461418', '0', '1516171614', '', 'normal', '');

-- ----------------------------
-- Table structure for `fa_user_group`
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_group`;
CREATE TABLE `fa_user_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT '' COMMENT '组名',
  `rules` text COMMENT '权限节点',
  `createtime` int(10) DEFAULT NULL COMMENT '添加时间',
  `updatetime` int(10) DEFAULT NULL COMMENT '更新时间',
  `status` enum('normal','hidden') DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='会员组表';

-- ----------------------------
-- Records of fa_user_group
-- ----------------------------
INSERT INTO `fa_user_group` VALUES ('1', '默认组', '1,2,3,4,5,6,7,8,9,10,11,12', '1515386468', '1516168298', 'normal');

-- ----------------------------
-- Table structure for `fa_user_rule`
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_rule`;
CREATE TABLE `fa_user_rule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(10) DEFAULT NULL COMMENT '父ID',
  `name` varchar(50) DEFAULT NULL COMMENT '名称',
  `title` varchar(50) DEFAULT '' COMMENT '标题',
  `remark` varchar(100) DEFAULT NULL COMMENT '备注',
  `ismenu` tinyint(1) DEFAULT NULL COMMENT '是否菜单',
  `createtime` int(10) DEFAULT NULL COMMENT '创建时间',
  `updatetime` int(10) DEFAULT NULL COMMENT '更新时间',
  `weigh` int(10) DEFAULT '0' COMMENT '权重',
  `status` enum('normal','hidden') DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='会员规则表';

-- ----------------------------
-- Records of fa_user_rule
-- ----------------------------
INSERT INTO `fa_user_rule` VALUES ('1', '0', 'index', '前台', '', '1', '1516168079', '1516168079', '1', 'normal');
INSERT INTO `fa_user_rule` VALUES ('2', '0', 'api', 'API接口', '', '1', '1516168062', '1516168062', '2', 'normal');
INSERT INTO `fa_user_rule` VALUES ('3', '1', 'user', '会员模块', '', '1', '1515386221', '1516168103', '12', 'normal');
INSERT INTO `fa_user_rule` VALUES ('4', '2', 'user', '会员模块', '', '1', '1515386221', '1516168092', '11', 'normal');
INSERT INTO `fa_user_rule` VALUES ('5', '3', 'index/user/login', '登录', '', '0', '1515386247', '1515386247', '5', 'normal');
INSERT INTO `fa_user_rule` VALUES ('6', '3', 'index/user/register', '注册', '', '0', '1515386262', '1516015236', '7', 'normal');
INSERT INTO `fa_user_rule` VALUES ('7', '3', 'index/user/index', '会员中心', '', '0', '1516015012', '1516015012', '9', 'normal');
INSERT INTO `fa_user_rule` VALUES ('8', '3', 'index/user/profile', '个人资料', '', '0', '1516015012', '1516015012', '4', 'normal');
INSERT INTO `fa_user_rule` VALUES ('9', '4', 'api/user/login', '登录', '', '0', '1515386247', '1515386247', '6', 'normal');
INSERT INTO `fa_user_rule` VALUES ('10', '4', 'api/user/register', '注册', '', '0', '1515386262', '1516015236', '8', 'normal');
INSERT INTO `fa_user_rule` VALUES ('11', '4', 'api/user/index', '会员中心', '', '0', '1516015012', '1516015012', '10', 'normal');
INSERT INTO `fa_user_rule` VALUES ('12', '4', 'api/user/profile', '个人资料', '', '0', '1516015012', '1516015012', '3', 'normal');

-- ----------------------------
-- Table structure for `fa_user_score_log`
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_score_log`;
CREATE TABLE `fa_user_score_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '会员ID',
  `score` int(10) NOT NULL DEFAULT '0' COMMENT '变更积分',
  `before` int(10) NOT NULL DEFAULT '0' COMMENT '变更前积分',
  `after` int(10) NOT NULL DEFAULT '0' COMMENT '变更后积分',
  `memo` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='会员积分变动表';

-- ----------------------------
-- Records of fa_user_score_log
-- ----------------------------

-- ----------------------------
-- Table structure for `fa_user_token`
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_token`;
CREATE TABLE `fa_user_token` (
  `token` varchar(50) NOT NULL COMMENT 'Token',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '会员ID',
  `createtime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `expiretime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '过期时间',
  PRIMARY KEY (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='会员Token表';

-- ----------------------------
-- Records of fa_user_token
-- ----------------------------

-- ----------------------------
-- Table structure for `fa_version`
-- ----------------------------
DROP TABLE IF EXISTS `fa_version`;
CREATE TABLE `fa_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `oldversion` varchar(30) NOT NULL DEFAULT '' COMMENT '旧版本号',
  `newversion` varchar(30) NOT NULL DEFAULT '' COMMENT '新版本号',
  `packagesize` varchar(30) NOT NULL DEFAULT '' COMMENT '包大小',
  `content` varchar(500) NOT NULL DEFAULT '' COMMENT '升级内容',
  `downloadurl` varchar(255) NOT NULL DEFAULT '' COMMENT '下载地址',
  `enforce` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '强制更新',
  `createtime` int(10) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updatetime` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `weigh` int(10) NOT NULL DEFAULT '0' COMMENT '权重',
  `status` varchar(30) NOT NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='版本表';

-- ----------------------------
-- Records of fa_version
-- ----------------------------
INSERT INTO `fa_version` VALUES ('1', '1.1.1,2', '1.2.1', '20M', '更新内容', 'https://www.fastadmin.net/download.html', '1', '1520425318', '0', '0', 'normal');
