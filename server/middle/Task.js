// 任务
let CSProto         = require("../net/CSProto.js");
let CommFuc         = require("../util/CommonFuc.js");
class TaskManager {
    /**
     *  添加任务
     */
    testAddTask () {
        let taskInfo = GlobalInfo.globalData.taskInfo;
        let startId = taskInfo.startId;
        let task = {
            type: CSProto.TASK.countType.repeat,
            reward: {type: CSProto.TASK.reward.bean, num: 1500},
            order: 1,
            game:{type: CSProto.TASK.gameLimit.all, matchName : 0},
            condition: {type: CSProto.TASK.contentType.match, num: 10},
            id:startId,
            players:{}
        };
        taskInfo.tasks.push(task);
        taskInfo.startId++;
    }

    /**
     * 增加任务
     */
    addTask(data){
        let taskInfo = GlobalInfo.globalData.taskInfo;
        let startId = taskInfo.startId;
        let startTime = data.startTime;
        let endTime = data.endTime;
        if(data.repeatType === CSProto.TASK.countType.repeat) {
            startTime = CommFuc.getTodayDataByTime(data.startTime);
            endTime = CommFuc.getTodayDataByTime(data.endTime);
        }
        let task = {
            type: data.repeatType,
            reward: {type: data.rewardType, num: data.rewardNum},
            order: data.order,
            game:{type: data.gameTypeLimit, subType:data.gameSubType, matchName : data.matchNameLimit},
            condition: {type: data.conditionType, num: data.conditionNum},
            startTime:startTime,
            endTime:endTime,
            id:startId,
            deleteIng:false,
            players:{}
        };
        taskInfo.tasks.push(task);
        taskInfo.startId++;
    }

    /**
     * 修改任务
     * @param data
     */
    modifyTask(data){
        let taskInfo = GlobalInfo.globalData.taskInfo;
        if(!taskInfo.modifyTasks){
            taskInfo.modifyTasks = {};
        }
        let modifyTasks = taskInfo.modifyTasks;
        let id = data.id;
        modifyTasks[id] = data;
        this.updateTask();
    }

    /**
     * 删除任务
     */
    deleteTask(id, value=true){
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let now = Date.getStamp();
        for(let idx in tasks){
            let task = tasks[idx]
            if(task) {
                if (task.id === id) {
                    if (task.type === CSProto.TASK.countType.once) {
                        //if(now < task.startTime || now > task.endTime){
                        tasks.splice(idx, 1);
                        this.updateTask();
                        return 200;
                        //}
                    } else if (task.type === CSProto.TASK.countType.repeat) {
                        task.deleteIng = value;
                        this.updateTask();
                        return 200;
                    }
                }
            }
        }
        return 400;
    }
    /**
     * 获取数据
     */
    getTask(player) {
        let uid = player.uid;
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let array = [];
        let now = Date.getStamp();
        for(let idx in tasks) {
            let task = tasks[idx];
            if(task) {
                if (task.startTime <= now && now <= task.endTime) {
                    if (!task.players[uid]) {
                        task.players[uid] = this.initTaskPlayer();
                    }
                    let oneData = clone(task);
                    delete oneData.players;
                    oneData.curProg = task.players[uid].curProg;
                    oneData.status = task.players[uid].status;
                    oneData.startTimeStr = task.type === CSProto.TASK.countType.once ? Date.getMysqlDate(task.startTime) : CommFuc.getTodayStrByData(task.startTime);
                    oneData.endTimeStr = task.type === CSProto.TASK.countType.once ? Date.getMysqlDate(task.endTime) : CommFuc.getTodayStrByData(task.endTime);
                    array.push(oneData);
                }
            }
        }
        let newArray = this.sortTask(array);
        return newArray;
    }

    /**
     * 任务排序
     */
    sortTask(tasks){
        this.orderStatus(tasks);
        return this.subGroup(tasks);
    }

    /**
     * 状态排序
     * @param a
     * @param b
     * @returns {boolean}
     */
    orderStatus(arr) {
        function statusValue(status) {
            if(status === CSProto.TASK.status.noComplete)return 1;
            if(status === CSProto.TASK.status.complete)return 2;
            if(status === CSProto.TASK.status.receive)return 0;
        }
        arr.sort(function (a, b) {
            return statusValue(a.status) > statusValue(b.status) ? -1 : 1;
        })
    }
    /**
     * 分组
     */
    subGroup(tasks) {
        let set = {};
        let keys = [];
        for(let idx in tasks){
            let task = tasks[idx];
            let status = task.status.toString();
            if(!set[status]){
                keys.push(status);
                set[status] = [];
            }
            set[status].push(task);
        }
        let newTasks = [];
        for(let idx in keys){
            let key = keys[idx];
            let group = set[key];
            group.sort(function(a ,b){
                return a.order > b.order;
            });
            newTasks.push.apply(newTasks, group);
        }
        return newTasks;
    }

    /**
     * web端获取任务数据
     */
    getTaskBack(id){
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let array = [];
        for(let idx in tasks) {
            let task = clone(tasks[idx]);
            if(task) {
                if (task.type === CSProto.TASK.countType.once) {
                    task.startTimeStr = Date.getMysqlDate(task.startTime);
                    task.endTimeStr = Date.getMysqlDate(task.endTime);
                } else if (task.type === CSProto.TASK.countType.repeat) {
                    task.startTimeStr = CommFuc.getTodayStrByData(task.startTime);
                    task.endTimeStr = CommFuc.getTodayStrByData(task.endTime);
                }
                task.deleteIng = task.deleteIng || false;
                delete task.players;
                if (id) {
                    if (task.id == id) {
                        array.push(task);
                        break;
                    }
                } else {
                    array.push(task);
                }
            }
        }
        return array;
    }
    /**
     * 初始化玩家的任务数值
     */
    initTaskPlayer(){
        let data = {};
        data.curProg = 0;
        data.status = CSProto.TASK.status.noComplete;
        data.noStopwinNum = 0;              // 不简断赢的次数
        return data;
    }

    /**
     * 设置任务的公共函数(只适用于bool类型)
     */
    setTaskCommonByBool(pInfo, task){
        pInfo.curProg = Math.min(task.condition.num, pInfo.curProg + 1);
        if (pInfo.curProg >= task.condition.num && pInfo.status === CSProto.TASK.status.noComplete) {
            pInfo.status = CSProto.TASK.status.complete;
        }
    }
    /**
     * 检测任务是否完成
     */
    checkComplete(data){
        let uid = data.uid;
        let gameType = data.gameType;
        let subType = data.subType;
        let matchName = data.matchName;
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let now = Date.getStamp();
        for(let idx in tasks){
            let task = tasks[idx];
            if(task) {
                if (now >= task.startTime && now <= task.endTime) {
                    if (!task.players[uid]) {
                        task.players[uid] = this.initTaskPlayer();
                    }
                    let pInfo = task.players[uid];
                    if (gameType == task.game.type || task.game.type === 0) {
                        if (subType == task.game.subType || task.game.subType === 0) {
                            if (matchName == task.game.matchName || task.game.matchName === 0) {
                                if (task.condition.type === CSProto.TASK.contentType.match) {               // 比赛了xx局
                                    this.setTaskCommonByBool(pInfo, task);
                                } else if (task.condition.type === CSProto.TASK.contentType.maxBean) {      // 最大得分
                                    let maxBean = task.condition.num;
                                    if (data.winLoseBean >= maxBean && pInfo.status === CSProto.TASK.status.noComplete) {
                                        pInfo.status = CSProto.TASK.status.complete;
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.dui_hu) {          // 对胡
                                    if (data.dui_hu) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.selfStroke) {      // 自摸
                                    if (data.selfStroke) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.pp_hu) {           // 碰碰胡
                                    if (data.pp_hu) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.ssy_hu) {          // 十三幺
                                    if (data.ssy_hu) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.qys_hu) {          // 清一色
                                    if (data.qys_hu) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.qgh_hu) {          // 抢杠胡
                                    if (data.qgh_hu) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                }else if(task.condition.type === CSProto.TASK.contentType.HU_19){             // 19胡
                                    if (data.hu_19) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }

                                } else if(task.condition.type === CSProto.TASK.contentType.HU_JD){             // 将对
                                    if (data.hu_JD) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }

                                }else if(task.condition.type === CSProto.TASK.contentType.HU_MQ){             // 门清
                                    if (data.hu_MQ) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                }else if(task.condition.type === CSProto.TASK.contentType.HU_ZZ){             // 中张
                                    if (data.hu_ZZ) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if(task.condition.type === CSProto.TASK.contentType.HU_JGD){           // 金钩钓
                                    if(data.hu_GGD){
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                }else if(task.condition.type === CSProto.TASK.contentType.HU_TH){              // 天胡
                                    if(data.hu_TH){
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                }else if(task.condition.type === CSProto.TASK.contentType.HU_DH){               // 地胡
                                    if(data.hu_DH){
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                }else if(task.condition.type === CSProto.TASK.contentType.notStopWin) {      // 不间断赢得比赛
                                    if (data.win) {
                                        pInfo.noStopwinNum++;
                                        pInfo.curProg = Math.min(task.condition.num, pInfo.noStopwinNum);
                                        if (pInfo.curProg >= task.condition.num && pInfo.status === CSProto.TASK.status.noComplete) {
                                            pInfo.status = CSProto.TASK.status.complete;
                                        }
                                    } else {
                                        if (pInfo.curProg < task.condition.num) {
                                            pInfo.noStopwinNum = 0;
                                            pInfo.curProg = 0;
                                        }
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.zdNum) {           // 炸弹xxx把
                                    if (data.boomNum > 0) {
                                        pInfo.curProg = Math.min(task.condition.num, pInfo.curProg + data.boomNum);
                                        if (pInfo.curProg >= task.condition.num && pInfo.status === CSProto.TASK.status.noComplete) {
                                            pInfo.status = CSProto.TASK.status.complete;
                                        }
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.kingBoomNum) {    // 王炸
                                    if (data.kingBoom) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.bigShut) {       // 大关
                                    if (data.bigShut > 0) {
                                        pInfo.curProg = Math.min(task.condition.num, pInfo.curProg + data.bigShut);
                                        if (pInfo.curProg >= task.condition.num && pInfo.status === CSProto.TASK.status.noComplete) {
                                            pInfo.status = CSProto.TASK.status.complete;
                                        }
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.smallShut) {     // 小关
                                    if (data.smallShut > 0) {
                                        pInfo.curProg = Math.min(task.condition.num, pInfo.curProg + data.smallShut);
                                        if (pInfo.curProg >= task.condition.num && pInfo.status === CSProto.TASK.status.noComplete) {
                                            pInfo.status = CSProto.TASK.status.complete;
                                        }
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.spring) {        // 春天
                                    if (data.spring) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                } else if (task.condition.type === CSProto.TASK.contentType.farmer) {       // 当了xx把地主
                                    if (data.farmer) {
                                        this.setTaskCommonByBool(pInfo, task);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        PlayerMgr.getPlayerNoCreate(uid, function (player) {
            if(player) {
                this.checkRed(player);
            }
        }.bind(this));
    }
    /**
     * 领取奖励
     */
    getReward(player, id){
        let uid = player.uid;
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        for(let idx in tasks){
            let task = tasks[idx];
            if(task && task.id === id){
                let pInfo = task.players[uid];
                if(pInfo.status != CSProto.TASK.status.complete){
                    return CSProto.ProtoState.STATE_TASK_STATUS_ERROR;
                }
                let coinType = 0;
                let num = task.reward.num;
                let data = {num: num, eventId: CSProto.eveIdType.TASK};
                if(task.reward.type === CSProto.TASK.reward.bean) {                 // 奖励金豆
                    player.updateBean(data);
                    ExtendMgr.updateFinance({uid, num:-num, financeType:CSProto.financeType.TASK_GET});
                    coinType = 1;
                }else if(task.reward.type === CSProto.TASK.reward.lottery){         // 奖励彩票积分
                    return;
                }else if(task.reward.type === CSProto.TASK.reward.diamond){         // 奖励钻石
                    player.updateDiamond(data);
                    coinType = 3;
                }
                pInfo.status = CSProto.TASK.status.receive;
                player.updateGameStatus();
                return [{"type": coinType, "num": num}];
            }
        }
        return CSProto.ProtoState.STATE_TASK_ID_ERROR;
    }
    /**
     * 更新奖励
     */
    updateTask(){
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let modifyTasks = GlobalInfo.globalData.taskInfo.modifyTasks;
        let len = tasks.length;
        for(let idx = len - 1; idx >= 0; idx--){
            let task = tasks[idx];
            if(task && task.deleteIng){
                delete tasks[idx];
            }
        }
        for(let idx in tasks){
            let task = tasks[idx];
            if(task) {
                let id = task.id;
                let mData = modifyTasks[id];
                if (mData) {
                    if (mData.startTime) {
                        if (task.type === CSProto.TASK.countType.repeat) {
                            task.startTime = CommFuc.getTodayDataByTime(mData.startTime);
                        }
                    }
                    if (mData.endTime) {
                        if (task.type === CSProto.TASK.countType.repeat) {
                            task.endTime = CommFuc.getTodayDataByTime(mData.endTime);
                        }
                    }
                    if (mData.rewardType) task.reward.type = mData.rewardType;
                    if (mData.rewardNum) task.reward.num = mData.rewardNum;
                    if (mData.order) task.order = mData.order;
                    if (typeof (mData.gameTypeLimit) === "number") task.game.type = mData.gameTypeLimit;
                    if (typeof (mData.gameSubType) === "number") task.game.subType = mData.gameSubType;
                    if (typeof (mData.matchNameLimit) === "number") task.game.matchName = mData.matchNameLimit;
                    //if(mData.conditionType) task.condition.type = mData.conditionType;
                    if (mData.conditionNum) task.condition.num = mData.conditionNum;
                }
                if (task.type === CSProto.TASK.countType.repeat) {
                    let start = CommFuc.getTodayStrByData(task.startTime);
                    let end = CommFuc.getTodayStrByData(task.endTime);
                    let startTime = CommFuc.getTodayDataByTime(start);
                    let endTime = CommFuc.getTodayDataByTime(end);
                    task.startTime = startTime;
                    task.endTime = endTime;
                    task.players = {};
                }
            }
        }
        GlobalInfo.globalData.taskInfo.modifyTasks = {};
    }

    /**
     * 重复任务修正时间
     */
    correctTime(){
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let now = new Date();
        let today = now.getDate();
        for(let idx in tasks){
            let task = tasks[idx];
            if(task) {
                if (task.type === CSProto.TASK.countType.repeat) {
                    let start = CommFuc.getTodayStrByData(task.startTime);
                    let end = CommFuc.getTodayStrByData(task.endTime);
                    let preEndTime = new Date(task.endTime * 1000);
                    let endDay = preEndTime.getDate();
                    let startTime = CommFuc.getTodayDataByTime(start);
                    let endTime = CommFuc.getTodayDataByTime(end);
                    task.startTime = startTime;
                    task.endTime = endTime;
                    if (endDay != today) {
                        task.players = {};
                    }
                }
            }
        }
    }
    /**
     * 红点检测
     */
    checkRed(player){
        let uid = player.uid;
        let tasks = GlobalInfo.globalData.taskInfo.tasks;
        let red = false;
        for(let idx in tasks){
            let task = tasks[idx];
            if(task) {
                let pInfo = task.players[uid];
                if (pInfo && pInfo.status === CSProto.TASK.status.complete) {
                    red = true;
                    break;
                }
            }
        }
        if(player.getConn()){
            player.getConn().sendMsg({
                code:CSProto.ProtoID.MIDDLE_CLIENT_TASK_RED,
                args:{
                    red:red
                }
            })
        }
    }
}

module.exports = new TaskManager();
