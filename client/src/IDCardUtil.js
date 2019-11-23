game.Utils = game.Utils || {};
game.Utils.IDCard = game.Utils.IDCard || {};

/**
 * 身份证号验证
 * @param cardid
 * @returns {boolean}
 */
game.Utils.IDCard.isValidIdentityCard = function (cardid) {
    //身份证正则表达式(18位)
    var isIdCard2 = /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/i;
    var sCard = "10X98765432"; //最后一位身份证的号码
    var first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //1-17系数
    var sum = 0;
    if (!isIdCard2.test(cardid)) {
        return false;
    }
    var year = cardid.substr(6, 4);
    var month = cardid.substr(10, 2);
    var day = cardid.substr(12, 2);
    var birthday = cardid.substr(6, 8);
    if (birthday != this.dateToString(new Date(year + '/' + month + '/' + day))) { //校验日期是否合法
        return false;
    }
    for (var i = 0; i < cardid.length - 1; i++) {
        sum += cardid[i] * first[i];
    }
    var result = sum % 11;
    var last = sCard[result]; //计算出来的最后一位身份证号码

    return cardid[cardid.length - 1].toUpperCase() == last;
};
/**
 * 日期转字符串
 * @param date
 * @returns {*} 返回日期格式20080808
 */
game.Utils.IDCard.dateToString = function (date) {
    if (date instanceof Date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = date.getDate();
        day = day < 10 ? "0" + day : day;
        return "" + year + month + day;
    }
    return "";
};