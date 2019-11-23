/**
 * 平台类
 * 适配桌面平台（桌面平台不包含以下函数的本地实现，所以用JS函数替代）
 */
var Platform = Platform || {
        /**
         * 是否使用微信登陆。
         * @returns {boolean}
         */
        useWechat : function () {
            return false;
        },

        /**
         * 复制文件。
         * @param src
         * @param dst
         */
        copyFile : function (src, dst) {},

        /**
         * 获取电池电量。
         * @returns {number}
         */
        getBatteryLevel: function () {
            return 1;
        },

        /**
         * 获取WIFI信号强度。
         * @returns {number}
         */
        getWifiLevel: function () {
            return 1;
        },

        /**
         * 截屏。
         */
        captureScreen: function () {},

        /**
         * 设置剪切板字符串
         */
        setClipStr: function () {},

        /**
         * 震动手机3次。
         */
        vibrate: function () {},

        /**
         * 游戏版本号
         */
        getVersion : function () {
            return 1;
        },

        /**
         * 编译日期
         */
        getBuildDate : function () {
            return 20170824;
        },

        /**
         * 获取本地游戏状态
         */
        getGamesList : function () {}

    };
