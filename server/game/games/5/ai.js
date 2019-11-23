/*
*
* 机器人逻辑
*
* */
let AI              = require("../../base/ai").AI;
let CommFuc         = require("../../../util/CommonFuc.js");
let ProtoID         = require("../../../net/CSProto.js").ProtoID;

class PsAI extends AI {
    constructor(owner, data){
        super(owner, data);
    }
    // 初始化协议表
    initProtoMap() {
        super.initProtoMap();
        this.aiProtoMap[ProtoID.GAME_CLIENT_START_ROB] = this.onPlayerStartRob;
        this.aiProtoMap[ProtoID.GAME_CLIENT_START_BET] = this.onPlayerStartBet;
        this.aiProtoMap[ProtoID.GAME_CLIENT_START_PLAY] = this.onPlayerStartPlay;
    }

    onPlayerStartRob(msg){

        let num = Math.floor(Math.random() * Math.min(msg.maxRob[this.player.index], 4));
        let time = CommFuc.rand(4000, 7000);
        setTimeout(() => {
            if(!this.room.destory) {
                this.room.onPlayerRob(this.player.index, num)
            }
        }, time);
    }

   onPlayerStartBet(msg){
        let num = Math.floor(Math.random() * Math.min(msg.maxBet[this.player.index], 3));
        let time = CommFuc.rand(1500, 5000);
        setTimeout(() => {
            if(!this.room.destory) {
                this.room.onPlayerBet(this.player.index, num)
            }
        }, time);
    }

    onPlayerStartPlay(msg){
        let time = CommFuc.rand(1500, 5000);
        setTimeout(() => {
            if(!this.room.destory) {
                this.room.onPlayerPlay(this.player.index)
            }
        }, time);
    }

}


module.exports.AI = PsAI;