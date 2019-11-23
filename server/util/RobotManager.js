/*
 *
 * 机器人逻辑
 *
 * */
let  CommFuc = require("./CommonFuc.js");
let  CSProto = require("../net/CSProto.js");
class RobotManager{
    constructor(gameType){
        this.id = 10;
        this.free = {};
        this.work = {};
        this.gameType = gameType;
    }

    start(){
        setInterval(this.update.bind(this), 5000);
    }

    update(){
        if(Object.keys(this.free).length < 10){
            for (let i = 0; i < 15; i++){
                this.addRobot();
            }
        }
        let rooms = GameMgr.getSubGame(this.gameType).rooms;
        for (let roomId in rooms){
            let room = rooms[roomId];
            if(room.mode !== "JB")
                continue;
            let now = Date.getStamp();
            let cfg = csConfig.matchConfig[room.matchId];
            if(cfg && cfg.opts && cfg.opts.isRobot && cfg.opts.robotOpts.waitTime){
                if(now - room.createTime < cfg.opts.robotOpts.waitTime){
                    return;
                }
            }
            if(room.getRealPlayerNum() <= 0){
                continue;
            }
            if(room.getPlayerNum() >= room.getMaxPlayerNum()){
                continue;
            }
            let isAdd = this.getAddCondition(room);
            if(isAdd){
                let uid = this.getFreeId();
                if(uid !== 0){
                    this.setRobotProp(cfg,uid);
                    if(room.addPlayer({uid: uid}, null)){
                        delete this.free[uid];
                        this.work[uid] = 1;
                        ERROR("加入的机器人uid: " + uid);
                        if(this.gameType != 5){
                            let time  = this.getReadyTime();
                            setTimeout(function () {
                                room.onPlayerReqContinue(uid, true);
                            }.bind(room), time);
                        }
                        GameMgr.sendMgrMsg({
                            code    : CSProto.ProtoID.GAME_MIDDLE_JOINED_ROOM,
                            result  : CSProto.ProtoState.STATE_OK,
                            args    : {
                                joinUid  : uid,
                                roomId   : room.roomId,
                                gameType : room.gameType
                            }
                        });
                    }
                } else {
                    break;
                }
            }
        }
    }

    getAddCondition(room){
        let add = false;
        if(!room.opts.isRobot)return false;
        if(this.gameType === 1){
            if(room.playing === false && room.gameOver === false){
                add = true;
            }
        }else if(this.gameType === 2){
            if(room.playing === false && room.gameOver === false){
                add = true;
            }
        }else if(this.gameType === 4){
            if(room.playing === false){
                add = true;
            }
        }else if(this.gameType === 5){
            if(room.playing === false){
                add = true;
            }
        }else if(this.gameType === 7){
            if(room.playing === false && room.gameOver === false){
                add = true;
            }
        }else if(this.gameType === 8){
            if(room.playing === false && room.gameOver === false){
                add = true;
            }
        }
        return add;
    }
    /**
     * 获取准备时间
     */
    getReadyTime(){
        let time = 0;
        if(this.gameType === 1){
            time = 2000;
        }else if(this.gameType === 2){
            time = 2000;
        }else if(this.gameType === 4){
            time = Math.floor(Math.random() * 8000 + 1000);
        }
        return time;
    }

    getFreeId(){
        let ids = Object.keys(this.free);
        if(ids.length > 0){
            return +ids[0]
        } else {
            return 0
        }
    }

    onQuitRoom(uid){
        delete this.work[uid];
        this.free[uid] = 1;
    }

    addRobot(){
        this.free[this.id] = 1;
        this.id++;
    }

    setRobotProp(cfg, uid){
        let player = {};
        player.uid = uid;
        player.info = {};
        player.info.name = CommFuc.getRandomName();
        let headNum = CommFuc.rand(1, 60);
        player.info.headPic = `http://${addrConfig.BackHost}/header/Public/upload/robot_header/robot${headNum}.png`;
        player.info.sex = Math.random() > 0.5 ? 0 : 1;
        player.status = {};
        player.status.bean = cfg.enterBean + Math.floor(Math.random() * (cfg.enterBean * 10)) + cfg.enterBean * 5;
        player.status.card = 0;
        player.status.diamond = 0;
        player.luck = {};
        player.luck.mj = 100;
        player.luck.psz = 100;
        player.luck.ps = 100;
        player.luck.ddz = 10000;
        player.luck.pdk = 100;
        player.robot = 9527;
        GameMgr.addPlayerAndRoomInfo({pData: player, gameType: this.gameType});
    }
}

module.exports.RobotManager = RobotManager;