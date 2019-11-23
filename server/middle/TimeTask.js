let schedule            = require('node-schedule');
let util                = require("util");
///////////////////////////////////////////////////////////////////////////////
//>>定时任务管理器
function TimeTask() {
    this.timingList = {};           // 定时任务列表
    this.num = 0;                   // 定时任务号
}

TimeTask.prototype = {
    /**
     * 增加一个定时任务
     * @param timeStamp
     * @param data
     */
    addTask: function (timeStamp, data) {
        let num = data.num;
        let msg = data.msg;
        let date = Date.formatDate(timeStamp);
        let strTime = util.format("%s %s %s %s %s *",date.second,date.minute,date.hour,date.day,date.month);
        this.timingList[this.num] = schedule.scheduleJob(strTime, function () {
                for(let idx in PlayerMgr.players){
                    let player = PlayerMgr.players[idx];
                    player.getConn().sendMsg({code: ProtoID.MIDDLE_CLIENT_ROLL_NOTICE,args:{
                        mes:msg,
                        num:num
                    }});
                }
                DEBUG("定时任务执行");
            }.bind(this)
        );
        this.num++;
    }
}

exports = module.exports = new TimeTask();
