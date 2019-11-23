// 同步服务器时间

ServerTime = {};

//服务器与客户端偏移时间
ServerTime.subClientTime = 0;

// 设置时间戳偏移量
ServerTime.setOffsetTime = function (serverTime) {
    var cTime = new Date().getTime();
    cc.log("本地时间 ==> [" + cTime + "]");
    var offTime = Math.floor(cTime - serverTime);
    cc.log("服务器时间戳偏移量 ==> [" + offTime + "]");
    ServerTime.subClientTime = offTime;
};

// 获取服务器时间
ServerTime.getServerTime = function () {
    var cTime = new Date().getTime();
    var sTime = cTime - ServerTime.subClientTime;
    cc.log("服务器时间" + sTime);
    return sTime;
};

// 格式化服务器时间
ServerTime.format = function (str) {
    var sTime = ServerTime.getServerTime();
    var date = Date.createFromStamp(sTime);
    return date.format(str);
};

// 获取服务器时间对象
ServerTime.getServerDataObject = function () {
    var sTime = ServerTime.getServerTime();
    return Date.createFromStamp(sTime);
};

// 获取时间差值
ServerTime.getOffsetTime = function (time) {
    var sTime = ServerTime.getServerTime();
    return time - sTime;
};
