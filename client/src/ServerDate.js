/**
 * 服务器时间
 * @type {{}}
 */

ServerDate = {};

//服务器与客户端偏移时间
ServerDate.subClientTime = 0;

// 设置时间戳偏移量
ServerDate.setOffsetTime = function (serverTime) {
    var cTime = new Date().getTime();
    cc.log("本地时间 ==> [" + cTime + "]");
    var offTime = Math.floor(cTime - serverTime);
    cc.log("服务器时间戳偏移量 ==> [" + offTime + "]");
    ServerDate.subClientTime = offTime;
};

// 获取服务器时间
ServerDate.getServerTime = function () {
    var cTime = new Date().getTime();
    var sTime = cTime - ServerDate.subClientTime;
    cc.log("服务器时间" + sTime);
    return sTime;
};

// 格式化服务器时间
ServerDate.format = function (str) {
    var sTime = ServerDate.getServerTime();
    var date = Date.createFromStamp(sTime);
    return date.format(str);
};

// 获取服务器时间对象
ServerDate.getServerDataObject = function () {
    var sTime = ServerDate.getServerTime();
    return Date.createFromStamp(sTime);
};

// 获取时间差值
ServerDate.getOffsetTime = function (time) {
    var sTime = ServerDate.getServerTime();
    return time - sTime;
};

/**
 * 根据秒数获取24小时制时间
 * @param seconds
 * @return string (00:00);
 */
ServerDate.getTimeBySeconds = function (seconds) {
    var time = "";
    var totalMinutes = seconds;
    var hour = Math.floor(totalMinutes / 3600);
    totalMinutes = totalMinutes % 3600;
    var minute = Math.floor(totalMinutes / 60);
    if (hour < 10) {
        time += "0";
    }
    time += hour + ":";
    if (minute < 10) {
        time += "0";
    }
    time += minute;
    return time;
};

/**
 * 根据时间获取秒数
 * @param hour
 * @param minute
 * @param second
 */
ServerDate.getSecondsByTime = function (hour, minute, second) {
    return Math.ceil(hour * 3600 + minute * 60 + second);
};

