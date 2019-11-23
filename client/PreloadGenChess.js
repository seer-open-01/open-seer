/**
 * 象棋资源表生成
 */
var fs = require("fs");

var RES_PATH = "res/Games/Chess";
var LOADING_FILE = "res/Games/Chess/loading.json";

(function main(){
    console.log("象棋 正在预加载生成生成脚本");

    var files = [];
    genPreLoadingRes(RES_PATH, files);
    fs.writeFileSync(LOADING_FILE, JSON.stringify(files), "utf8");
    console.log("共 " + files.length + " 个预加载项");

    process.exit(0);
})();

function genPreLoadingRes(path, files) {
    var dir = fs.readdirSync(path);
    dir.forEach(function(fileName){
        if (fileName[0] == ".") {
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
