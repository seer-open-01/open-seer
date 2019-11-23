var fs      = require("fs");

/**
 * 预加载 主界面 相关资源
 * @type {string}
 */

var RES_PATH = "res";
var LOADING_FILE = "res/Home/loading.json";

(function main(){
    console.log("大厅 正在预加载生成生成脚本");

    var files = [];
    genPreLoadingRes(RES_PATH, files);
    fs.writeFileSync(LOADING_FILE, JSON.stringify(files), "utf8");
    console.log("共 " + files.length + " 个预加载项");

    process.exit(0);
})();

function genPreLoadingRes(path, files) {
    var dir = fs.readdirSync(path);
    dir.forEach(function(fileName){
        if (fileName[0] == '.' || fileName == "Games" || fileName == "Home" || fileName == "Animations"
            || fileName == "Audio" || fileName == "RoomList") {
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