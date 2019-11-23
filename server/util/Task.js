///////////////////////////////////////////////////////////////////////////////
//>> 通用类

// 加载器
function TaskLoader(onAllLoad){
    this.tasks = [];
    this.onAllLoad = onAllLoad;
}

TaskLoader.prototype = {
    // 添加任务
    addLoad : function(task){
        this.tasks.push(task);
    },
    // 完成任务
    onLoad : function(task){
        let index = this.tasks.indexOf(task);
        if( index >= 0 ) {
            this.tasks.splice(index, 1);
            if( this.tasks.length == 0 ) {
                this.onAllLoad && this.onAllLoad();
            }
        }
    },
};

exports.TaskLoader = TaskLoader;