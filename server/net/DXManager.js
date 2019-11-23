/**
 * 断线掉线
 * @param own
 * @param wsConn
 * @constructor
 */
function DX(own,wsConn) {
    this.own = own;
    this.scheJob = null;
    this.wsConn = wsConn;
    this.id = wsConn.getId();
}

DX.prototype = {
    /**
     * 监听玩家掉线
     */
    createListen:function () {
        this.scheJob = setTimeout(function () {
            let uid = this.wsConn.uid;
            PlayerMgr.getOnlinePlayer(uid,function (player) {
                if(player){
                    let roomId = player.user.marks.roomId;
                    // GSMgr.clearPlayerRoom(player);
                    player.save();
                    // GSMgr.sendDX2Room(uid,roomId);
                    delete PlayerMgr.players[uid];
                }
            });
            delete this.own.wsConnMap[this.id];
            this.own.wsLen--;
            DEBUG(uid + "玩家断开，清除玩家数据");
        }.bind(this),Config.DXMaxTime * 1000);
    }
}

/**
 * 断线管理器
 * @constructor
 */
function DXManager() {
    this.wsConnMap = {};
    this.wsLen = 0;
}

DXManager.prototype = {
    /**
     * 增加一个连接
     * @param wsConn
     */
    addWsConn:function (wsConn) {
        let need = true;
        let wsId = wsConn.getId();
        if(wsConn.uid == 0){
            return;
        }
        for(let idx in this.wsConnMap){
            if(this.wsConnMap[idx].wsConn.uid == wsConn.uid){
                need = false;
                break;
            }
        }
        if(need){
            let dxConn = new DX(this, wsConn);
            dxConn.createListen();
            this.wsConnMap[wsId] = dxConn;
            this.wsLen++;

        }
    },
    /**
     * 减少一个连接
     * @param uid
     */
    plusWsConn:function (uid) {
        for(let idx in this.wsConnMap){
            if(this.wsConnMap[idx].wsConn.uid == uid){
                clearTimeout(this.wsConnMap[idx].scheJob);
                delete this.wsConnMap[idx];
                this.wsLen--;
                DEBUG(uid + "玩家已经连接，清除断线列表");
            }
        }
    }
};

exports.DXManager = DXManager;