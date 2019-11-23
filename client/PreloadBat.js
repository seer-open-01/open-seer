/**
 * Author       : dlt
 * Date         : 2018-12-18
 * Description  : 预加载批处理
 */
var exec = require("child_process").exec;
(function main() {
    var files = [
        "PreloadGenFull.js",
        "PreloadGenHome.js",
        "PreloadGenDouDiZhu.js",
        "PreloadGenMahjong.js",
        "PreloadGenPinSan.js",
        "PreloadGenPinShi.js",
        "PreloadGenChess.js",
        "PreloadGenRun.js"
    ];
    console.log("批处理 preload 执行中... ");
    preloadJsFile(files);
})();

function preloadJsFile(jsFiles) {
    if (jsFiles.length <= 0) {
        console.log("批处理 preload 执行完毕！");
        process.exit(0);
    }
    var oneJs = jsFiles.shift();
    var cmdStr = "node " + oneJs;
    // console.log("cmd ==> " + cmdStr);
    exec(cmdStr, function (err, stdout, stderr) {
        if (!err) {
            console.log("" + oneJs + " 执行成功！");
            console.log("child_process " + stdout);
            preloadJsFile(jsFiles);
        } else {
            console.log("" + oneJs + " 执行出错！");
            process.exit(-1);
        }
    });
}
