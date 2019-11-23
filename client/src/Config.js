/**
 * 配置模块
 */

game.config = game.config || {};

// 热更开关
game.config.HOT_UPDATE = true;
if (cc.sys.os == "Windows") {
    game.config.HOT_UPDATE = false;
} else {
    game.config.HOT_UPDATE = true;
}
// 内网
// game.config.CONNECT_IP = "192.168.1.36";
// 外网测试
game.config.CONNECT_IP = "39.98.241.250";
// 外网正式
// game.config.CONNECT_IP = "103.37.234.171";

// 连接端口
game.config.CONNECT_PORT = 7006;

// 主版本号
game.config.MAJOR_VER = 1;

// 子版本号
game.config.SUB_VER = 1;

// 小版本号
game.config.MINOR_VER = 0;

// 程序版本 (注意：这个是在上架的时候，由上架的人员改动的)
game.config.APP_VERSION = "1.0.0";

// 是否使用微信登陆
game.config.USE_WX = Platform.useWechat();

// 微信APPID
game.config.WECHAT_APPID = "wx7731e26c1a869506";

// 微信APP安全码
game.config.WECHAT_APPSECRET = "a14f52f2d9ce9b09290b2b7721b07f52";

// 微信分享URL
game.config.WECHAT_SHARE_URL = "http://download.rqq.cn/index.html?uid=";

// 网页下载地址
game.config.DOWNLOAD_URL = "http://download.rqq.cn";

// 聊天软件下载地址
game.config.CHAT_URL = "http://www.updrips.com";

// 金币单位转换
game.config.FORMAT_COIN = true;

game.config.BGM_ON = true;
game.config.GM_ON = false;