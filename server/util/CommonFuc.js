let fs      = require("fs");
let crypto  = require('crypto');
let Http    = require("../HttpRequest.js");
let BSProto = require("../net/BSProto.js");
let ProtoID = require("../net/CSProto.js").ProtoID;
let ProtoState = require("../net/CSProto.js").ProtoState;
let eveIdType = require("../net/CSProto.js").eveIdType;
let util = require("util");
let os = require('os');
/*
公共函数类
 */
/**
 * 截取字符串
 * @param str
 * @returns {*|string|String}
 * @constructor
 */
function Substring(str){
    let end = str.indexOf('\r');
    if(end != -1) {
        str = str.substring(0, end); // 取子字符串。
    }
    return str.trim();
}
/**
 * 读取行数据
 * @param path
 * @param title
 * @param callback
 */
function readLines(path, title, callback) {
    let str = '';
    let flag = true;
    let input = fs.createReadStream(path,{encodeing :"utf8"});
    input.on('data', function(data) {
        str += data;
        let first = str.indexOf('\n') + 1;
        str = str.substring(first, str.length);
        let index = str.indexOf('\n');
        while (index > -1) {
            let line = str.substring(0, index);
            str = str.substring(index + 1);
            let cells = line.split('\t');
            let row = {};
            for(let i = 0; i < title.length; i++){
                let tt = Substring(title[i][0]);
                let rr = Substring(cells[i]);
                row[tt] = rr;
            }
            callback(row);
            index = str.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (str.length > 0) {
            console.log(str);
        }
    });
}

function getSpStr() {
    let platform = os.platform();
    let spStr = "";
    if(platform === "win32" || platform === "win64") {
        spStr = "\r\n";
    }else if(platform === "linux"){
        spStr = "\n";
    }
    return spStr;
}
/**
 * 读取屏蔽字
 */
exports.readTxt = function () {
    fs.readFile('config/dirty.txt','utf-8',function(err,data){
        if(err){
            console.error(err);
        }
        else{
            let sensitive = [];
            let spStr = getSpStr();
            let cells = data.split(spStr);
            for(let idx in cells){
                let cell = cells[idx];
                let line = cell.split("|");
                for(let j in line){
                    let word = line[j];
                    if(word != ""){
                        sensitive.push(word);
                    }
                }
            }
            GlobalInfo.genWords = sensitive;
            ERROR("GlobalInfo.genWords: " + GlobalInfo.genWords.length);
        }
    });
};

/**
 * 读取机器人名字字库
 */
exports.getRandomName = function () {
    let data = fs.readFileSync('config/robotname.txt','utf-8');
    let spStr = getSpStr();
    let names = data.split(spStr);
    let r = Math.floor(Math.random() * names.length);
    let name = names[r].replace("\n","");
    name.replace("\r","");
    return name;
};
/**
 * 除法
 */
exports.accDiv = function(arg1,arg2){
    let t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""));
        r2=Number(arg2.toString().replace(".",""));
        return +(r1/r2)*pow(10,t2-t1);
    }
};
/**
 * 乘法
 */
exports.accMul = function(arg1,arg2)
{
    let m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
};
/**
 * 加法
 */
exports.accAdd = function(arg1,arg2){
    let r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return +(arg1*m+arg2*m)/m;
}
/**
 * 减法
 */
exports.accSub = function(arg1,arg2){
    let r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    //last modify by deeka
    //动态控制精度长度
    n=(r1>=r2)?r1:r2;
    return +((arg1*m-arg2*m)/m).toFixed(n);
};
/**
 * 是否为整数
 * @param args
 */
exports.isInteger = function(num) {
    return num % 1 === 0;
};
/**
 * 统计数组中某个元素的个数
 * @param arr
 * @param num
 * @returns {number}
 */
exports.numAtArrayCount = function(arr, num) {
    if(arr.lastIndexOf(num) == -1 && arr.indexOf(num) == -1){
        return 0;
    }
    return arr.lastIndexOf(num) - arr.indexOf(num) + 1;
};
/**
 * 减少玩家
 */
exports.reduceArray = function(array, uid) {
    let pos = array.indexOf(uid);
    if(pos > -1){
        array.splice(pos, 1);
    }
}
/**
 * 数组中添加
 */
exports.addArray = function(array, uid) {
    let pos = array.indexOf(uid);
    if(pos == -1){
        array.push(uid);
    }
}
/**
 * 创建一维数组
 * @param xMax
 * @return {Array}
 */
function oneDimensionalArray(xMax,value) {
    let arr = new Array();
    for (let i = 0; i < xMax; i++) {
        arr[i] = value;
    }
    return arr;
}
/**
 * 创建二维数组
 */
function twoDimensionalArray(xMax, yMax, flag) {
    let arr = new Array()
    for (let i = 0; i < xMax; i++) {
        arr[i] = new Array();
        for (let j = 0; j < yMax; j++) {
            if (flag == null) {
                arr[i][j] = 0;
            } else {
                arr[i][j] = flag;
            }
        }
    }
    return arr;
}
/**
 * 数组复制
 * @param source
 * @return {Array}
 */
function copyArray(source) {
    let array = oneDimensionalArray(source.length);
    for (let i = 0; i < source.length; i++) {
        array[i] = source[i];
    }
    return array;
}
/**
 * 创建表
 */
function createTbl(Arr,value) {
    let tbl = {};
    for(let idx = 0; idx < Arr; idx++){
        tbl[Arr[idx]] = value;
    }
    return tbl;
}
/**
 * 数组复制
 * @param source
 * @return {Array}
 */
function copyArray(source) {
    let array = oneDimensionalArray(source.length);
    for (let i = 0; i < source.length; i++) {
        array[i] = source[i];
    }
    return array;
}
/**
 *整体拷贝数组
 */
function copyArrayFrom(source,target) {
    if (source.length != target.length) {
        return null;
    }
    for (let i = 0; i < source.length; i++) {
        target[i] = source[i];
    }
}

/**
 * 数组复制
 * @param source
 */
function copyArrays(source, spos, target, tpos) {
    if (source.length != target.length) {
        return null;
    }
    for (let i = spos; i < source.length; i++) {
        tpos[i] = source[i];
    }
    return tpos;
}

/**
 * 复制麻将数组
 */
function cpMj(mjs) {
    let cp = twoDimensionalArray(3, 9, null);
    for (let typeIndex = 0; typeIndex < 3; typeIndex++) {
        cp[typeIndex] = copyArray(mjs[typeIndex]);
    }
    return cp;
}
/**
 * 加密
 */
function enc(str) {
    let c = String.fromCharCode(str.charCodeAt(0) + str.length);
    for(let i = 1; i < str.length; i++){
        c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
    }
    return stringToHex(c);
}
/**
 * 字符串转化为十六进制
 * @param str
 * @returns {string}
 */
function stringToHex(str){
    let val = "";
    for(let i = 0; i < str.length; i++){
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += "," + str.charCodeAt(i).toString(16);
    }
    return val;
}
/**
 * 解密
 */
function dec(hex) {
    let str = hexToString(hex);
    let c = String.fromCharCode(str.charCodeAt(0) - str.length);
    for(let i = 1; i < str.length;i++){
        c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}
/**
 * 十六进制转化为字符串
 * @param str
 * @returns {string}
 */
function hexToString(str){
    let val="";
    let arr = str.split(",");
    for(let i = 0; i < arr.length; i++){
        val += String.fromCharCode(parseInt(arr[i],16));
    }
    return val;
}
/**
 * php加密
 * @param cleardata
 */
function phpEncode(cleardata) {
    let cryptkey = crypto.createHash('sha256').update(Config.phpKey).digest();
    let encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, Config.phpIv);
    let encoded  = encipher.update(cleardata, 'utf8', 'base64');
    encoded += encipher.final( 'base64' );
    return encoded;
}
/**
 * php解密
 * @param secretdata
 */
function phpDecode(secretdata) {
    let cryptkey = crypto.createHash('sha256').update(Config.phpKey).digest();
    let decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, Config.phpIv);
    let decoded  = decipher.update(secretdata, 'base64', 'utf8');
    decoded += decipher.final( 'utf8' );
    return decoded;
}
/**
 * 克隆数组
 */
function clone(obj) {
    let o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (let i = 0, len = obj.length; i < len; i++) {
                    o.push(clone(obj[i]));
                }
            } else {
                o = {};
                for (let j in obj) {
                    o[j] = clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

function getSecondsByTimeString (sTime) {
    let timeArr = sTime.split(":");
    let minute = (parseInt(timeArr[0]) * 60) + parseInt(timeArr[1]);
    let seconds = (minute * 60);
    seconds += parseInt(timeArr[2]);
    return seconds;
}

function getTodayDataByTime (sTime) {
    let date = new Date();
    let str1 = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;
    let str2 = sTime;
    let str = str1 + " " + str2;
    let pointDate = new Date(str);
    return Math.floor(pointDate.getTime() / 1000);
}

function getTodayStrByData(stamp){
    let time = new Date(stamp * 1000);
    let hour=time.getHours();
    let minute=time.getMinutes();
    let second=time.getSeconds();
    let str = (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute) + ":" + (second < 10 ? '0' + second : second);
    return str;
}

function getOneTime(oneDay, timeFormat) {
    let date = new Date(oneDay * 1000);
    let str1 = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;
    let str2 = timeFormat;
    let str = str1 + " " + str2;
    let pointDate = new Date(str);
    return Math.floor(pointDate.getTime() / 1000);
}


function getWeekDayTime(it, format, isNext) {
    let now = Date.getStamp();
    let week = new Date().getDay();
    if(week === 0)week = 7;
    let intervalDay = now + (it - week) * 3600 * 24;
    if(isNext){
        intervalDay += 7 * 3600 * 24;
    }
    return getOneTime(intervalDay, format);
}

function getWeekNumberByTime(endTime, originMonth, data) {
    let date = Date.formatDate(endTime);
    let month = date.month;
    if(month !== originMonth){
        return true;
    }else{
        data.num++;
        endTime = endTime - 7 * 3600 * 24;
        getWeekNumberByTime(endTime, originMonth, data)
    }
}

function getCurMonthTime(it, format, isNext) {
    let now = Date.getStamp();
    let date = Date.formatDate(now);
    let month = date.month;
    let year = date.year;
    if(isNext){
        month++;
        if(month > 12){
            month = 1;
            year++;
        }
    }
    let str = `${year}-${month}-${it} ${format}`;
    let pointTime = new Date(str);
    return Math.floor(pointTime.getTime() / 1000);
}
/**
 * 获取上一个月的时间
 * @param format
 */
function getPreMonthTime(format) {
    let now = Date.getStamp();
    let date = Date.formatDate(now);
    let month = date.month;
    let year = date.year;
    let day = date.day;
    month--;
    if(month <= 0){
        month = 12;
        year--;
    }
    let str = `${year}-${month}-${day} ${format}`;
    let pointTime = new Date(str);
    return Math.floor(pointTime.getTime() / 1000);
}

function getMatchIng(classInfo) {
    return classInfo.month.curCard !== "" || classInfo.week.curCard !== "" || classInfo.day.curCard !== ""
}
/**
 * 获取随机数区间
 * @param from 最小
 * @param to 最大
 * @returns {*}
 */
function rand(from, to) {
    let num = Math.abs(to - from);
    let random = Math.floor(Math.random() * num);
    return random + from
}

/**
 * 根据幸运值分配
 * @param sortArr [1,2,0]       牌由大到小排序 (从大到小)
 * @param luckArr [100,80,60]   幸运值依次的值（必须从大到小）（跟着牌型走）
 * @param return 返回最终的牌型
 */
function allotByLuck(sortArr, luckArr) {
    let pLen = sortArr.length;
    let newArr = [];
    let exArr = [];
    for(let pIdx = 0; pIdx < pLen; pIdx++){
        let total = getLuckTotal(luckArr, exArr);
        let randomLuck = Math.floor(Math.random() * total);
        let sIdx = 0;
        for(let lIdx = 0; lIdx < luckArr.length; lIdx++){
            let luck = luckArr[lIdx];
            if(exArr.indexOf(lIdx) === -1){
                if(randomLuck <= luck){
                    sIdx = lIdx;
                    exArr.push(lIdx);
                    break;
                }else{
                    randomLuck -= luck;
                }
            }
        }
        newArr[pIdx] = sortArr[sIdx];
    }
    return newArr;
}
/**
 * 获取总幸运
 */
function getLuckTotal(luckArr, exArr) {
    let total = 0;
    for(let idx in luckArr){
        let value = luckArr[idx];
        if(exArr.indexOf(+idx) == -1){
            total += value;
        }
    }
    return total;
}

/**
 * 排序
 * @param property
 * @returns {Function}
 */
function compare(property){
    return function(a,b){
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    }
}

/**
 * 过滤表情
 * @param substring
 * @returns {boolean}
 */
function isEmojiCharacter(substring) {
    for ( let i = 0; i < substring.length; i++) {
        let hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                let ls = substring.charCodeAt(i + 1);
                let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            let ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                || hs == 0x2b50) {
                return true;
            }
        }
    }
}
/**
 * md5加密
 * @param str
 * @returns {*}
 */
function md5(str) {
    let md5sum = crypto.createHash("md5");
    md5sum.update(str, "utf-8");
    let sign = md5sum.digest('hex');
    return sign;
}
/**
 * 下载二维码图片
 * @param url
 * @param name
 */
function downImage(url, uid, callback) {
    // 测试url
    // let url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGx8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAySGJCS2htOFJkTmgxMDAwME0wM2cAAgTct9JbAwQAAAAA";
    let fs = require('fs');
    let request = require("request");

    if (!fs.existsSync("ticket")) {
        fs.mkdirSync("ticket");
    }
    let writeStream = fs.createWriteStream('ticket/' + uid + '.png');
    let readStream = request(url);
    readStream.pipe(writeStream);
    readStream.on('end', function() {
        console.log('文件下载成功');
    });
    readStream.on('error', function() {
        console.log("错误信息:" + err);
        callback(false);
    });
    writeStream.on("finish", function() {
        console.log("文件写入成功");
        writeStream.end();
        callback(true);
    });
}

function cardSort(playerCards){
    let len = playerCards.length;
    for (let i = 0; i < len; i++) {
        let cards = playerCards[i];
        powerAndHsOrder(cards);
    }
}

/**
 * 使用威力和花色排序
 * @param arr
 * @returns {boolean}
 */
function powerAndHsOrder(arr) {
    function getPower(card){
        if(card % 100 == 1) {
            return 14;
        }else if(card % 100 == 2){
            return 15;
        }else if(card == 514){
            return 16;
        }else if(card == 614){
            return 17;
        }else{
            return card % 100;
        }
    }
    let len = arr.length;
    for(let i = 0; i < len; i++){
        let k = i;
        let pow1 = getPower(arr[k]);
        let hs1 = Math.floor(arr[k] / 100);
        for(let j = i + 1; j < len; ++j){
            let pow2 = getPower(arr[j]);
            let hs2 = Math.floor(arr[j] / 100);
            if(pow1 < pow2) {
                k = j;
                pow1 = getPower(arr[k]);
                hs1 = Math.floor(arr[k] / 100);
            }else if(pow1 == pow2){
                if(hs1 > hs2){
                    k = j;
                    hs1 = hs2;
                }
            }
        }
        if(k != i){
            let iTmp = arr[k];
            arr[k] = arr[i];
            arr[i] = iTmp;
        }
    }
}

/**
 * 获取随机的顺序
 * @param array
 */
function getRandomIdx(array){
    let len = array.length;
    let suffix = [];
    for(let i = 0; i < len; i++){
        suffix.push(i);
    }
    let randIdx = [];
    for(let i = len - 1; i >= 0; i--){
        let r = Math.floor(Math.random() * suffix.length);
        let value = suffix[r];
        randIdx[i] = value;
        suffix.splice(r , 1);
    }
    return randIdx;
}

/**
 * 补0
 * @param num
 * @param n
 * @returns {*}
 */
function pad(num, n) {
    let len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}

/**
 * 一般数字转化成万
 * @param bean
 */
function wBean(num){
    let wNum = (num / 10000).toFixed(2);
    return parseFloat(wNum);
}

/**
 * 获取数组中的随机值
 * @param array
 */
function getRandomValue(array){
    if(array.length === 0){
        return null
    }else {
        let r = Math.floor(Math.random() * array.length);
        return array[r];
    }
}

/**
 * 是否有重复
 * @param array
 * @returns {boolean}
 */
function isRepeat(array){
    let carray = clone(array);
    carray.sort();
    for(let i = 0;i< carray.length; i++){
        if (array[i] === array[i+1]){
            return true;
        }
    }
    return false;
}



exports.oneDimensionalArray = oneDimensionalArray;
exports.rand = rand;
exports.getSecondsByTimeString = getSecondsByTimeString;
exports.twoDimensionalArray = twoDimensionalArray;
exports.createTbl = createTbl;
exports.copyArray = copyArray;
exports.cpMj = cpMj;
exports.phpDecode = phpDecode;
exports.phpEncode = phpEncode;
exports.enc = enc;
exports.dec = dec;
exports.getTodayDataByTime = getTodayDataByTime;
exports.allotByLuck = allotByLuck;
exports.compare = compare;
exports.md5 = md5;
exports.getTodayStrByData = getTodayStrByData;
exports.getWeekDayTime = getWeekDayTime;
exports.getCurMonthTime = getCurMonthTime;
exports.getWeekNumberByTime = getWeekNumberByTime;
exports.getPreMonthTime = getPreMonthTime;
exports.getMatchIng = getMatchIng;
exports.cardSort = cardSort;
exports.powerAndHsOrder = powerAndHsOrder;
exports.getRandomIdx = getRandomIdx;
exports.pad = pad;
exports.isEmojiCharacter = isEmojiCharacter;
exports.wBean = wBean;
exports.getRandomValue = getRandomValue;
exports.isRepeat = isRepeat;
