/**
 * 微信
 */

var WeChat = WeChat || {};

WeChat._accessCode = "";
WeChat._openid = "";
WeChat._unionid = "";
WeChat._accessToken = "";

WeChat._nickname = "";
WeChat._sex = 0;
WeChat._city = "";
WeChat._headpic = "";
WeChat._timerOutTimer = null;

WeChat.clear = function () {
    cc.log("删除微信登陆缓存");
    game.LocalDB.set("AppAccessTokenExpire2", true, true);
    game.LocalDB.save();
};

WeChat.isWechatInstalled = function () {
    return false;
};

WeChat.weLogin = function (callback) {
    var needAuth = true;
    var expireTime = +game.LocalDB.get("AppAccessTokenExpire2", true);
    var userInfo = game.LocalDB.get("WechatUserInfo", true);
    if (!isNaN(expireTime) && (expireTime > Date.getStamp()) && userInfo && !isNaN(userInfo._sex)) {
        needAuth = false;
        WeChat._accessToken = game.LocalDB.get("AppAccessToken", true);
        WeChat._openid = game.LocalDB.get("AppOpenid", true);

        cc.log("从缓存读取到用户id和访问令牌：" + WeChat._openid + ", " + WeChat._accessToken);
        cc.log("访问令牌过期时间：" + Date.createFromStamp(expireTime).stdFormatedString());
    }

    cc.async.series([
        // 请求访问码
        function (cb) {
            if (needAuth) {
                cc.log("==> 微信登录 001");
                WeChat.login(function (code) {
                    cc.log("==> 微信登录 002");
                    WeChat._accessCode = code;
                    if (code == null || code == "") {
                        /*game.ui.TipWindow.popup({
                            tipStr: "微信登陆失败！"
                        }, function (win) {
                            game.UISystem.closePopupWindow(win);
                            cc.game.restart();
                        });*/
                        cc.log("==> 登录失败。。。 004");
                        callback && callback(false);
                        return;
                    }
                    cb();
                }.bind(this));
            } else {
                cb();
            }
        },
        // 请求访问令牌
        function (cb) {
            if (needAuth) {
                cc.log("==> 微信登录 003");
                clearInterval(WeChat._timerOutTimer);
                WeChat._timerOutTimer = setTimeout(function () {
                    cc.log("==> 登录失败。。。 007");
                    callback && callback(false);
                }, 5000);
                var url = "https://api.weixin.qq.com/sns/oauth2/access_token?"
                    + "appid=" + game.config.WECHAT_APPID
                    + "&secret=" + game.config.WECHAT_APPSECRET
                    + "&code=" + WeChat._accessCode
                    + "&grant_type=authorization_code";
                httpsReq(url, function (jsonStr) {
                    clearInterval(WeChat._timerOutTimer);
                    WeChat._timerOutTimer = null;
                    if (jsonStr) {
                        cc.log("==> WeChat jsonStr = " + jsonStr);
                        var json = JSON.parse(jsonStr);
                        WeChat._accessToken = json.access_token;
                        WeChat._openid = json.openid;

                        var expireTime = Date.getStamp() + (+json.expires_in) + 5 * 86400;
                        game.LocalDB.set("AppAccessToken", WeChat._accessToken, true);
                        game.LocalDB.set("AppOpenid", WeChat._openid, true);
                        game.LocalDB.set("AppAccessTokenExpire2", expireTime + "", true);
                        game.LocalDB.save();
                        cb();
                    } else {
                        cc.log("==> 登录失败。。。 001");
                        callback && callback(false);
                    }
                }.bind(this));
            } else {
                cb();
            }
        },
        // 请求用户信息
        function(cb) {
            cc.log("==> 微信登录 004");
            if(needAuth) {
                clearInterval(WeChat._timerOutTimer);
                WeChat._timerOutTimer = setTimeout(function () {
                    cc.log("==> 登录失败。。。 008");
                    callback && callback(false);
                }, 5000);

                var url = "https://api.weixin.qq.com/sns/userinfo?"
                    + "access_token=" + WeChat._accessToken
                    + "&openid=" + WeChat._openid;
                httpsReq(url, function (jsonStr) {
                    clearInterval(WeChat._timerOutTimer);
                    WeChat._timerOutTimer = null;
                    if (jsonStr) {
                        cc.log(jsonStr);
                        var json = JSON.parse(jsonStr);
                        WeChat._nickname = json.nickname;
                        WeChat._unionid = json.unionid;
                        WeChat._sex = +json.sex;
                        WeChat._city = json.city;
                        WeChat._headpic = json.headimgurl;
                        cc.log("======================================");
                        cc.log("==> WeChat._unionid = " + json.unionid);
                        cc.log("======================================");

                        var wechatUserInfo = {};
                        wechatUserInfo._nickname = json.nickname;
                        wechatUserInfo._sex = +json.sex;
                        wechatUserInfo._city = json.city;
                        wechatUserInfo._headPic = json.headimgurl;
                        wechatUserInfo._unionid = json.unionid;

                        game.LocalDB.set("WechatUserInfo", wechatUserInfo, true);
                        game.LocalDB.save();
                        cb();
                    } else {
                        cc.log("==> 登录失败。。。 002");
                        callback && callback(false);
                    }
                }.bind(this));
            } else {
                clearInterval(WeChat._timerOutTimer);
                WeChat._timerOutTimer = null;

                var userInfo = game.LocalDB.get("WechatUserInfo", true);

                WeChat._nickname = userInfo._nickname;
                WeChat._sex =  userInfo._sex;
                WeChat._unionid = userInfo._unionid;
                WeChat._city = userInfo._city;
                WeChat._headpic = userInfo._headPic;

                cb();
            }
        }
    ], function (err) {
        game.DataKernel.openid = WeChat._openid;
        game.DataKernel.unionid = WeChat._unionid;
        game.DataKernel.name = WeChat._nickname.substr(0, 6);
        game.DataKernel.sex = WeChat._sex;
        game.DataKernel.headPic = WeChat._headpic;

        cc.log("===================================");
        cc.log("openid: " + game.DataKernel.openid);
        cc.log("unionid: " + game.DataKernel.unionid);
        cc.log("name: " + game.DataKernel.name);
        cc.log("sex: " + game.DataKernel.sex);
        cc.log("headPic: " + game.DataKernel.headPic);
        cc.log("===================================");
        callback && callback(true);
    });
};

WeChat.logout = function () {
    cc.log("删除微信登陆缓存");
    game.LocalDB.set("AppAccessTokenExpire2", true, true);
    game.LocalDB.save();
};

function httpsReq(url, callback) {
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            callback && callback(xhr.responseText);
        }else {
            callback && callback(null);
        }
    };
    xhr.timeout = 5000;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
    xhr.send();
}