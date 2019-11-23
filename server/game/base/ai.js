/*
*
* 机器人逻辑
*
* */
let CommFuc         = require("../../util/CommonFuc.js");
let ProtoID         = require("../../net/CSProto.js").ProtoID;

class Ai{
    constructor(owner, data){
        this.player = owner;
        this.room = this.player.owner;
        this.aiProtoMap = {};
        this.init();
    }

    /**
     *
     */
    init() {
        this.initProtoMap();
    }

    // 初始化协议表
    initProtoMap() {
        this.aiProtoMap[ProtoID.CLIENT_GAME_JOIN_ROOM] = this.onPlayerJoin;
        this.aiProtoMap[ProtoID.GAME_CLIENT_LEVEL_ROOM] = this.onPlayerQuitRoom;
        this.aiProtoMap[ProtoID.CLIENT_GAME_READY] = this.onPlayerReady;

    }

    doAction(code, msg){
        let handler = this.aiProtoMap[code];
        handler && handler.call(this, msg);
    }

    onPlayerJoin(msg){
        let time = CommFuc.rand(1500, 5000);
        setTimeout(() => {
            this.room.onPlayerReady(this.player.uid, true)
        }, time)
    }

    onPlayerQuitRoom(msg){
        return;
        let player = this.room.getPlayerByIndex(msg.playerIndex);
        if(player){
            if(player.uid === 0 || player.uid < 100000){
                return
            }
        }
        ERROR("onPlayerQuitRoom" + player.uid);
        if(this.room.getRealPlayerNum()){
            RobotMgr.onQuitRoom(this.player.uid);
            this.room.quitRoom(this.player.uid);
        }
    }

    onPlayerReady(msg){
        let player = this.room.getPlayerByIndex(msg.playerIndex);
        if(player){
            if(player.uid === 0 || player.uid < 100000){
                return
            }
        }
        let random = Math.floor(Math.random() * 10);
        if(random > 6){
            RobotMgr.onQuitRoom(this.player.uid);
            this.room.quitRoom(this.player.uid);
        }else {
            let time = CommFuc.rand(1000, 3000);
            setTimeout(() => {
                this.room.onPlayerReady(this.player.uid, true)
            }, time)
        }

    }
}

module.exports.AI = Ai;