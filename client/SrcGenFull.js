/**
 * Created by mr.luo on 2017/3/14.
 */
var exec    = require("child_process").exec;

function main() {
    console.log("正在加密脚本...");

    var cmdStr = "";
    // 加密 main.js
    cmdStr += "rm -f main.jsc && mkdir main.js.dir && cp main.js main.js.dir && cocos jscompile -s main.js.dir -d ./ && rm -rf main.js.dir";
    // 加密 src 目录
    cmdStr += " && rm -rf src_sign && cocos jscompile -s src -d src_sign";

    exec(cmdStr, function(err, stdout, stderr){
        if (err) {
            console.log("Exec: " + stderr);
            process.exit(-1);
        } else {
            console.log("脚本加密完成");
            process.exit(0);
        }
    });
}
main();