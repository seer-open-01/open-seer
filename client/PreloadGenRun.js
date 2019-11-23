var fs = require("fs");

/**
 * 预加载 跑得快 游戏
 * @type {string}
 */

var RES_PATH = "res/Games/Run";
var LOADING_FILE = "res/Games/Run/loading.json";

(function main() {
    console.log("跑得快 正在预加载生成生成脚本");

    var files = [];
    genPreLoadingRes(RES_PATH, files);
    fs.writeFileSync(LOADING_FILE, JSON.stringify(files), "utf8");
    console.log("共 " + files.length + " 个预加载项");

    process.exit(0);
})();

function genPreLoadingRes(path, files) {
    var dir = fs.readdirSync(path);
    dir.forEach(function (fileName) {
        if (fileName[0] == '.') {
            return;
        }

        fileName = path + "/" + fileName;
        var statInfo = fs.statSync(fileName);
        if (statInfo.isFile()) {
            if (fileName.endsWith(".png")
                || fileName.endsWith(".jpg")
                || fileName.endsWith(".json")
                || fileName.endsWith(".plist")) {
                files.push(fileName);
            }
        } else {
            genPreLoadingRes(fileName, files);
        }
    });
}