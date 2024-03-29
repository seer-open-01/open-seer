var fs      = require("fs");

/**
 * 预加载所有资源文件
 * @type {string}
 */

var RES_PATH = "res";
var LOADING_FILE = "res/loading.json";

(function main(){
    console.log("总资源 正在预加载生成生成脚本");

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
                || fileName.endsWith(".json")) {
                files.push(fileName);
            }
        } else {
            genPreLoadingRes(fileName, files);
        }
    });
}