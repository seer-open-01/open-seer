var fs      = require("fs");
var crypto  = require("crypto");
var exec    = require("child_process").exec;

///////////////////////////////////////////////////////////////////////////////
/// 版本生成器

// 当前版本
var CURRENT_VER = 12;
// 引擎版本
var ENGINE_VER = "3.10";
// 更新文件路径
// var PACKAGE_URL = "http://caiyunyigou.com/publish/";
var PACKAGE_URL = "http://powerfans.org/publish/";
var REMOTE_MANIFEST_URL = PACKAGE_URL + "project.manifest";
var REMOTE_VERSION_URL = PACKAGE_URL + "version.manifest";
// 补丁文件夹
var NEW_MANIFEST_FILE = "publish/project.manifest";
var NEW_VERSION_FILE = "publish/version.manifest";
var RES_MANIFEST_FILE = "res/project.manifest";
var PUBLISH_DIR = "publish";

(function main () {
    console.log("Begin Build New Resource");

    if (fs.existsSync(PUBLISH_DIR)) {
        console.error("Please Delete public folder !!!");
        process.exit(-1);
    }

    signSRC (function(err) {
        // 生成版本文件
        genNewVersion();
        process.exit(0);
    });
})();

function genNewVersion() {
    var newAssetsMap = genAssetsMap();

    var fileObj = {
        "version" : "",
        "assets" : {}
    };

    fileObj.version = genVerStr(CURRENT_VER, true);
    fileObj.packageUrl = PACKAGE_URL;
    fileObj.remoteManifestUrl = REMOTE_MANIFEST_URL;
    fileObj.remoteVersionUrl = REMOTE_VERSION_URL;
    fileObj.engineVersion = ENGINE_VER;
    fileObj.searchPaths = [];

	console.log("Version = " + fileObj.version);
	
    fileObj.assets = newAssetsMap;

    fs.mkdirSync(PUBLISH_DIR);

    fs.writeFileSync(NEW_MANIFEST_FILE, JSON.stringify(fileObj), "utf8");
    fs.writeFileSync(RES_MANIFEST_FILE, JSON.stringify(fileObj), "utf8");

    delete fileObj.assets; delete fileObj.searchPaths;
    fs.writeFileSync(NEW_VERSION_FILE, JSON.stringify(fileObj), "utf8");

    // 拷贝文件
    for (var name in newAssetsMap) {
        if (newAssetsMap.hasOwnProperty(name)) {
            copy(name, "publish/" + name);
        }
    }

    console.log("Build New Version Succeed");
	
}

function copy(src, dst) {
    // 创建中间目录
    var files = dst.split("/");
    var filename = "";
    for (var i = 0; i < files.length - 1; ++i) {
        var newFile = filename;
        if (i == 0) {
            newFile = files[i];
        } else {
            newFile +=  "/" + files[i];
        }
        if (!fs.existsSync(newFile)) {
            fs.mkdirSync(newFile);
        }

        filename = newFile;
    }

    // 复制文件
    fs.writeFileSync(dst, fs.readFileSync(src));
}

function getVerValue(cur) {
    var ints = cur.split(".");
    return (+ints[0]) * 100 + (+ints[1]) * 10  + (+ints[2]);
}

function genVerStr(cur, inc) {
    var maxV = Math.floor(cur / 100);
    var midV = Math.floor((cur % 100) / 10);
    var minV = cur % 10;

    if (inc) {
        minV += 1;
        if (minV >= 10) {
            minV = 0;
            midV += 1;
            if (midV >= 10) {
                midV = 0;
                maxV += 1;
            }
        }
    }

    return maxV + "." + midV + "." + minV;
}

function genAssetsMap () {
    var assetsMap = {};

    var assetsMapOfSrc = {};
    genAssetsMapOfDir("src_sign", assetsMapOfSrc);

    var assetsMapOfRes = {};
    genAssetsMapOfDir("res", assetsMapOfRes);

    for (var name in assetsMapOfSrc) {
        if (assetsMapOfSrc.hasOwnProperty(name)) {
            assetsMap[name] = {
                "md5" : assetsMapOfSrc[name]
            };
        }
    }

    for (name in assetsMapOfRes) {
        if (assetsMapOfRes.hasOwnProperty(name)) {
            assetsMap[name] = {
                "md5" : assetsMapOfRes[name]
            };
        }
    }

    return assetsMap;
}

function genAssetsMapOfDir (path, map) {
    var dir = fs.readdirSync(path);
    dir.forEach(function(fileName){
        if (fileName[0] == '.') {
            return;
        }

        fileName = path + "/" + fileName;
        var statInfo = fs.statSync(fileName);
        if (statInfo.isFile()) {
            if (fileName != "res/project.manifest") {
                map[fileName] = md5(fs.readFileSync(fileName));
            }
        } else {
            genAssetsMapOfDir(fileName, map);
        }
    });
}

function md5(str){
    var decipher = crypto.createHash("md5");
    return decipher.update(str).digest("hex");
}

function signSRC(callback) {
    var cmdStr = "node SrcGenFull.js && node PreLoadGenFull.js";
    exec(cmdStr, function(err, stdout, stderr){
        callback && callback(err);
    });
}