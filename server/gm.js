let http        = require('http');
let qs          = require('querystring');
let util		= require('util');
let gmAddr		= "192.168.1.36";
let port 		= 7001;
let Config		= {"phpKey":"__tazai_wolf__key", "phpIv":"1234567890000000"};
let crypto  	= require('crypto');
requestGame = function (action, args) {
	let argsContent = '';
	if (args != null) {
		argsContent = qs.stringify(args)
	}

	let url = util.format('http://%s:%d?mode=gm&act=%s&%s', gmAddr, port,action,argsContent);
	http.get(url, function(res) {
		let resData = "";
		res.on("data", function (data) {
			resData += data;
		});
		res.on("end", function () {
            let data = phpDecode(resData);
			console.log(JSON.stringify(data));
		});
	}).on('error', function (e) {
	});
};

let args = {
	'save':save,
	'si'  :getServerInfo,
	'ab'  :addBean,					    // 增加金豆
	// 'genShopCards':genShopCards,	    // 生成商店卡
	'weekshopupdate':weekShopUpdate,	// 强制商店周更
	'updatetask':updateTask,			// 更新任务
	'oneDayUpdate':oneDayUpdate,		// 强制更新推广整线奖励
};

function save() {
    requestGame("save");
}
function getServerInfo() {
    requestGame("getServerInfo");
}
function addBean(uid, num) {
    requestGame("gmAddBean", {uid:uid,num:num});
}
function weekShopUpdate() {
	requestGame("weekShopUpdate");
}
function updateTask() {
	requestGame("updateTask");
}
function oneDayUpdate() {
	requestGame("oneDayUpdate");
}

function phpDecode(secretdata) {
    let cryptkey = crypto.createHash('sha256').update(Config.phpKey).digest();
    let decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, Config.phpIv);
    let decoded  = decipher.update(secretdata, 'base64', 'utf8');
    decoded += decipher.final( 'utf8' );
    return decoded;
}


if (process.argv.length > 0) {
    process.argv.forEach(function (arg, index) {
        if (args[arg]) {
            console.log(process.argv.slice(index + 1));
            args[arg].apply(this, process.argv.slice(index + 1));
        }
    });
}