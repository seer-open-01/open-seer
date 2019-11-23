//排行榜
let CommFuc     = require("../util/CommonFuc.js");
class RankManager {

    constructor(){
        this.beanRank = {};
        this.playRank = {};
        this.beanRankArray = [];
        this.playRankArray = [];
        this.time = 1000 * 180;
        this.max = 100;
        this.display = 50;
    }
    start(){
        this.update();
        setInterval(this.update.bind(this), this.time)
    }

    /**
     * 更新排行榜
     */
    update(){
        this.beanRankArray = [];
        this.playRankArray = [];
        this.getAllPlayerInfo((data)=>{
            data.sort((a, b) => {
                return b.bean - a.bean
            });
            for (let i = 0; i < data.length && i < this.max;){
                let info = clone(data[i++]);
                if(info.bean > 0){
                    info.rank = i;
                    this.beanRank[info.uid] = info;
                    this.beanRankArray.push(info);
                }
            }

            data.sort((a, b) => {
                return b.play - a.play
            });
            for (let i = 0; i < data.length && i < this.max;){
                let info = clone(data[i++]);
                if(info.play > 0){
                    info.rank = i;
                    this.playRank[info.uid] = info;
                    this.playRankArray.push(info);

                }
            }
        })
    }


    /**
     * 获取所有玩家信息
     * @param cb
     */
    getAllPlayerInfo(cb){
        PlayerMgr.saveAll(function () {
            MongoUser.find({}).toArray((err, result) => {
                let tInfo = [];
                if(!result){
                    cb && cb(tInfo);
                    return
                }
                result.forEach((data)=>{
                    let info = {};
                    info.ip = data.marks.loginIP;
                    info.name = data.info.name;
                    info.weChat = data.info.signature;
                    info.headPic = data.info.headPic;
                    info.sex = data.info.sex;

                    // let status = parseInt(data.status.bean);
                    let storageBox = parseInt(data.storageBox.bean);
                    info.bean = data.SEER.tempBean + data.SEER.scBean;
                    info.card = data.status.card;
                    info.diamond = data.status.diamond + data.storageBox.diamond;
                    info.rank = 0;
                    info.uid = data._id;
                    info.matchIng = CommFuc.getMatchIng(data.rankMatch.classInfo);
                    if(data.counts){
                        info.play = data.counts.play;
                    }else {
                        info.play = 0;
                    }
                    tInfo.push(info)
                });
                cb && cb(tInfo)
            });
        });
    }

    /**
     * 获取金豆榜
     */
    getBeanRank(uid){
        let info = this.beanRank[uid];
        let data = {
            ranks: this.sliceRank(1, this.display),
            bean: 0,
            rank: 0
        };
        if(info){
            data.rank = info.rank;
            data.bean = info.bean;
        }
        return data
    }

    /**
     * 获取战神榜
     */
    getPlayRank(uid){
        let info = this.playRank[uid];
        let data = {
            ranks: this.sliceRank(2, this.display),
            rank: 0,
            bean: 0
        };
        if(info){
            data.rank = info.rank;
            data.bean = info.bean;
        }
        return data
    }

    /**
     * 截取排行榜
     */
    sliceRank(mode, display){
        if(display > this.max){
            return;
        }
        let array = [];
        if(mode == 1){
            array = clone(this.beanRankArray);
        }else if(mode == 2){
            array = clone(this.playRankArray);
        }
        if(array.length <= this.display){
            return array;
        }
        let sliceLen = this.max - display;
        let tbl = array.splice(0, sliceLen);
        return tbl;
    }

}

module.exports = new RankManager();
