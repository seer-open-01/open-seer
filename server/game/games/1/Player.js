let util            = require("util");
let Enum            = require("./Enum.js");
let ProtoID         = require("../../../net/CSProto.js").ProtoID;
let Func            = require("./Func.js");
let CommFuc         = require("../../../util/CommonFuc.js");
let Player          = require("../../base/player");

///////////////////////////////////////////////////////////////////////////////
//>> 玩家手牌
function HandCards(owner) {
    this.owner = owner;
    this.anNumAll = 0;
    this.mingNumAll = 0;
    this.dianNum = 0;
    this.jieNum = 0;
    this.zimoNum = 0;
    this.reset();
}

HandCards.prototype = {
    /**
     * 初始化
     * @param cards
     */
    init: function (cards) {
        for (let i = 0; i < cards.length; i++) {
            if(i == 13){
                this.drawMj(cards[i]);
            }else {
                this.addMjs(cards[i]);
            }
        }
    },
    /**
     * 重置
     */
    reset: function () {
        this.num = 0;
        this.mjs_TDW = CommFuc.twoDimensionalArray(3, 9, 0);                    // 手牌信息
        this.mjs_DNXB = CommFuc.oneDimensionalArray(4,0);                       // 风牌信息
        this.mjs_ZFB  = CommFuc.oneDimensionalArray(3,0);                       // 中发白
        this.mjs_flower = CommFuc.oneDimensionalArray(8,0);                     // 花牌数量
        this.peng_mjs = {};                                                     // 碰牌信息
        this.gang_mjs = {};                                                     // 杠牌信息
        this.chi_mjs = [];                                                      // 吃牌信息
        this.mjTDWCounts = CommFuc.oneDimensionalArray(3,0);                    // TDW牌张数
        this.flowered = [];                                                     // 打下去的花牌
        this.mingNum = 0;                                                       // 明杠数量
        this.anNum = 0;                                                         // 暗杠数量
        this.menQing = true;                                                    // 门清
        this.played = [];                                                       // 打过的牌
        this.lastMj = 0;                                                        // 最后摸过的牌
        this.huMj = null;                                                       // 最后胡的牌
        this.JP = null;                                                         // 将牌
        this.zmHu = true;                                                       // 是否为自摸胡牌
        this.tings = {};                                                        // 听牌集合
    },

    /**
     * 增加麻将, 第二个参数是 是否是玩家摸的
     * @param mjId
     * @param isMo
     */
    addMjs: function (mjId,isMo) {
        let typeFlag = Math.floor(mjId / 10);
        let number = mjId % 10;
        if(typeFlag <= 3) {
            this.mjs_TDW[typeFlag - 1][number - 1]++;
            this.mjTDWCounts[typeFlag - 1]++;
        }else if(typeFlag == 4){
            this.mjs_DNXB[number - 1]++;
        }else if(typeFlag == 5){
            this.mjs_ZFB[number - 1]++;
        }else if(typeFlag == 6){
            this.mjs_flower[number - 1]++;
        }
        if(isMo){
            this.lastMj = mjId;
        }
    },
    /**
     * 计算胡牌
     * @param card
     * @returns {*}
     */
    calcHuMjs:function (card) {
        this.addMjs(card);
        this.zmHu = false;
        let huType = Func.huPai(this);
        this.removeMjs(card);
        return huType;
    },
    /**
     * 计算听牌
     * @param card
     * @returns {*}
     */
    calcTingMjs:function (card) {
        this.addMjs(card);
        this.zmHu = true;
        let huType = Func.huPai(this);
        this.removeMjs(card);
        return huType;
    },
    /**
     * 计算听牌
     */
    calTingMjs:function () {
        let data = {};
        this.tings = {};
        for(let idx in Enum.AllMj){
            let mj = Enum.AllMj[idx];
            if(mj < 60 && this.contains(mj)){
                this.removeMjs(mj);
                for(let i in Enum.AllMj){
                    let addMj = Enum.AllMj[i];
                    if(addMj < 60){
                        let huType = this.calcTingMjs(addMj);
                        if(huType){
                            let plusNum = this.owner.owner.publicCards.plusNumMjId(addMj);
                            if(mj == addMj){
                                plusNum--;
                            }
                            plusNum -= this.getMjNum(addMj);
                            if(plusNum < 0){
                                ERROR("出现了大相公或者小相公");
                            }
                            let temp = {card:addMj, num: plusNum};
                            if(!data[mj]) {
                                data[mj] = [];
                            }
                            data[mj].push(temp);
                        }
                    }
                }
                this.addMjs(mj);
            }
        }
        this.tings = clone(data);
        return data;
    },
    /**
     * 获取总个数
     * @returns {number}
     */
    getTotalCount:function () {
        let sum = 0;
        for(let idx = 0; idx < 3; idx++){
            sum += this.mjTDWCounts[idx];
        }
        for(let idx = 0; idx < 4; idx++) {
            sum += this.mjs_DNXB[idx];
        }
        for(let idx = 0; idx < 3; idx++){
            sum += this.mjs_ZFB[idx];
        }
        for(let idx = 0; idx < 8; idx++){
            sum += this.mjs_flower[idx];
        }
        return sum;
    },
    /**
     * 增加花牌
     * @param cards
     */
    addFlower:function (cards) {
        for(let idx = 0; idx < cards.length; idx++){
            this.flowered.push(cards[idx]);
        }
    },
    /**
     * 获取总花色
     * @returns {number}
     */
    getHS:function () {
        let sum = 0;
        for(let idx = 0; idx < 3; idx++){
            if(this.mjTDWCounts[idx] > 0){
                sum++;
            }
        }
        return sum;
    },
    /**
     * 获取最小花色
     */
    getHSArr:function () {
        let data = CommFuc.copyArray(this.mjTDWCounts);
        data.sort();
        let arr = [];
        for(let hs = 0; hs < 3;hs++){
            let hsCount = data[hs];
            for(let idx = 0; idx < 3; idx++){
                if(hsCount == this.mjTDWCounts[idx] && arr.indexOf(idx) == -1){
                    arr[hs] = idx;
                }
            }
        }
        return arr;
    },
    /**
     * 获取最佳的听牌
     */
    getBestTings:function () {
        if(Object.keys(this.tings).length == 0){
            return null;
        }
        let maxNum = 0;
        let playMj = 0;
        for(let mj in this.tings){
            let len = this.tings[mj].length;
            for(let idx = 0; idx < len; idx++){
                let huNum = this.tings[mj][idx].num;
                if(huNum > maxNum){
                    playMj = +mj;
                    maxNum = huNum;
                }
            }
        }
        if(playMj != 0){
            return playMj;
        }else{
            return null;
        }
    },
    /**
     * 通过简单的AI算法获取出牌的card
     * @returns {*}
     */
    getBestCard:function(){
        let tingCard = this.getBestTings();
        if(tingCard){
            return tingCard;
        }
        let list = [];
        let CZFB = CommFuc.copyArray(this.mjs_ZFB);
        for(let idx = 0; idx < 3 ; idx++){
            Func.removeKe(CZFB, idx)
        }
        for(let idx = 0; idx < 3;idx++){
            let count = CZFB[idx];
            for(let i = 0; i< count; i++){
                list.push(51 + idx);
            }
        }
        if(list.length != 0){
            let rIdx = Math.floor(Math.random() * list.length);
            return list[rIdx];
        }
        let CDNXB = CommFuc.copyArray(this.mjs_DNXB);
        for(let idx = 0; idx < 4 ; idx++){
            Func.removeKe(CDNXB, idx)
        }
        for(let idx = 0; idx < 4;idx++){
            let count = CDNXB[idx];
            for(let i = 0; i< count; i++){
                list.push(41 + idx);
            }
        }
        if(list.length != 0){
            let rIdx = Math.floor(Math.random() * list.length);
            return list[rIdx];
        }
        let hss = this.getHSArr();
        for(let loop = 0; loop < 3; loop++){
            let hs = hss[loop];
            let mjTypes = this.mjs_TDW[hs];
            let cMjTypes = CommFuc.copyArray(mjTypes);
            for(let idx = 0; idx < 9; idx++){
                Func.removeShun(cMjTypes,idx);
            }
            for(let idx = 0; idx < 9;idx++){
                Func.removeKe(cMjTypes,idx);
            }
            for(let idx = 0; idx < 9;idx++){
                let count = cMjTypes[idx];
                for(let i = 0; i < count; i++){
                    list.push((hs + 1) * 10 + idx + 1);
                }
            }
            if(list.length > 0){
                let rIdx = Math.floor(Math.random() * list.length);
                return list[rIdx];
            }
        }
        return null;
    },
    /**
     * 计算倍数
     * @param huType
     * @returns {{score: number, msg: string}}
     */
    getBaseTypeScore:function(huType, isZM) {
        let msg = "";
        let score = 0;
        if(huType == Enum.HuType.PING){
            if(this.isPengPengHu()){
                this.owner.taskParams.pp_hu = true;
                msg = "对对胡";
                score = 2;
            }
        }
        if(huType == Enum.HuType.QI_XIAO_DUI){
            this.owner.taskParams.dui_hu = true;
            msg = "七对 ";
            score = 2;
            let count = this.getDuiGang();
            if(count != 0) {
                score += count;
                if(count == 1){
                    msg = "豪华七对";
                }else if(count == 2){
                    msg = "豪华双七对";
                }else if(count == 3){
                    msg = "豪华三七对";
                }
            }
        }
        if(this.isQingYiSe()){
            score = score === 0 ? 1 : score;
            score *= 2;
            if(msg != ""){
                msg += " ";
            }
            msg += "清一色"
            this.owner.taskParams.qys_hu = true;
        }
        if(huType == Enum.HuType.SHI_SAN_YAO){
            score = 13;
            msg = "十三幺";
            this.owner.taskParams.ssy_hu = true;
        }
        if(score == 0){
            score = 1;
            msg = "平胡";
        }
        if(this.owner.gangFlag){            // 杠上花
            score *= 3;
            msg += " 杠上花";
        }else if(this.owner.huaFlag && isZM){    // 补花胡牌
            score *= 3;
            msg += " 补花胡牌";
        }else if(this.owner.owner.TH){            // 天胡
            score *= 3;
            msg += " 天胡";
            this.owner.taskParams.hu_TH = true;
        }else if(this.owner.owner.DH){            // 地胡
            score *= 3;
            msg += " 地胡";
            this.owner.taskParams.hu_DH = true;
        }else if(isZM){
            score *= 2;
            msg += " 自摸";
        }else if(this.owner.owner.grabPassRoad){  // 抢杠胡
            //score += 1;
            msg += " 抢杠胡";
            this.owner.taskParams.qgh_hu = true;
        }
        if(!isZM) {
            if (this.owner.owner.playNum == 4) {
                if (this.owner.owner.publicCards.num <= 19){
                    this.owner.owner.hdb = true;
                }
            }else if (this.owner.owner.playNum == 2) {
                if(this.owner.owner.publicCards.num <= 15){
                    this.owner.owner.hdb = true;
                }
            }
        }
        if(this.owner.owner.hdb){
            msg += " 海底包牌";
        }
        return {score:score, msg:msg};
    },
    /**
     * 计算胡牌的倍数
     * @param huType
     * @param isZM
     */
    getMultType2:function(huType,isZM) {
        let mult = 1;                       // 点炮
        let msg = "";
        if(isZM){                           // 自摸
            mult = 2;
        }
        if(this.owner.gangFlag){            // 杠上花
            mult = 3;
            msg = "杠上花";
        }
        if(this.owner.huaFlag){             // 补花胡牌
            mult = 3;
            msg = "补花胡牌";
        }
        if(this.owner.owner.TH){            // 天胡
            mult = 3;
            msg = "天胡";
        }
        if(this.owner.owner.DH){            // 地胡
            mult = 3;
            msg = "地胡";
        }
        if(this.owner.owner.grabPassRoad){  // 抢杠胡
            mult = 1;
            msg = "抢杠胡";
        }
        return {mult:mult, msg:msg};
    },
    /**
     * 移除麻将, 麻将id 是否临时移除标志
     * @param mjId
     */
    removeMjs: function (mjId) {
        let type = Math.floor(mjId / 10);
        let number = Math.floor(mjId % 10);
        if(type <= 3 && type >= 1){
            this.mjs_TDW[type - 1][number - 1]--;
            this.mjTDWCounts[type - 1]--;
        }else if(type == 4){
            this.mjs_DNXB[number - 1]--;
        }else if(type == 5){
            this.mjs_ZFB[number - 1]--;
        }else if(type == 6){
            this.mjs_flower[number - 1]--;
        }else{
            ERROR("移除麻将失败，不存在此麻将" + mjId);
        }
    },
    /**
     * 是否有该麻将
     * @param mjId
     * @returns {boolean}
     */
    contains: function (mjId) {
        let count = this.getMjNum(mjId);
        return count > 0 ? true : false;
    },
    /**
     * 出牌
     * @param mjId
     */
    playMj: function (mjId) {
        this.removeMjs(mjId);
        this.played.push(mjId);
        this.owner.owner.publicCards.played.push(mjId);
    },

    /**
     * 删除出过的麻将
     */
    delPlayedMj:function() {
        if(this.played.length > 0) {
            this.played.pop();
        }
    },
    /**
     * 摸牌
     */
    drawMj: function (mjId) {
        this.addMjs(mjId,true);
    },
    /**
     * 吃的类型
     * @param card
     * @returns {Array}
     */
    chiAble:function (card) {
        let chiType = [];
        if(card > 40){
            return chiType;
        }
        let typeIndex = Math.floor(card / 10) - 1;
        let numIndex = (card % 10) - 1;
        let typeMj = this.mjs_TDW[typeIndex];
        if(this.getTotalCount() % 3 != 2){
            if((typeMj[numIndex-2] > 0 && typeMj[numIndex-1] > 0)){
                let tt = [card - 2,card - 1,card];
                chiType.push(tt);
            }
            if((typeMj[numIndex-1] > 0 && typeMj[numIndex+1] > 0)){
                let tt = [card - 1,card,card + 1];
                chiType.push(tt);
            }
            if((typeMj[numIndex+1] > 0 && typeMj[numIndex+2] > 0)){
                let tt = [card, card + 1,card + 2];
                chiType.push(tt);
            }
        }
        return chiType;
    },
    /**
     * 吃牌+
     * @param mjs
     * @param chiMj
     */
    chi:function (mjs,chiMj) {
        for(let i in mjs){
            let mjId = mjs[i];
            if(mjId != chiMj) {
                this.removeMjs(mjId);
                this.owner.owner.publicCards.played.push(mjId);
            }
        }
        let arr = this.chiPosChange(mjs, chiMj);
        this.chi_mjs.push({"card":chiMj, "cards":arr, "target":this.owner.owner.prePlayer});
    },
    /**
     * 吃牌位置调整
     */
    chiPosChange:function(mjs, chiMj) {
        let max = 0, min = 0;
        for(let loop = 0; loop < 3; loop++){
            if(mjs[loop] != chiMj) {
                if (mjs[loop] > max) {
                    max = mjs[loop];
                }
            }
        }
        for(let loop = 0; loop < 3; loop++){
            if(mjs[loop] != chiMj && mjs[loop] != max) {
                min = mjs[loop];
                break;
            }
        }
        return [min,chiMj,max];
    },
    /**
     * 获取碰的麻将
     */
    getPengMj: function (client) {
        let arr = [];
        if(client){
            for(let mjId in this.peng_mjs){
                let data = {};
                data.target = this.peng_mjs[mjId];
                data.cards = [+mjId, +mjId, +mjId];
                arr.push(data);
            }
            return arr;
        }else {
            return this.peng_mjs;
        }
    },
    /**
     * 获取杠的麻将
     * @return {Array}
     */
    getGangMj: function (client) {
        let arr = [];
        if(client){
            for(let mjId in this.gang_mjs){
                let data = {};
                data.target = this.gang_mjs[mjId].source;
                data.type = this.gang_mjs[mjId].type;
                data.cards = [+mjId, +mjId, +mjId, +mjId];
                arr.push(data);
            }
            return arr;
        }else {
            return this.gang_mjs;
        }
    },
    /**
     * 获取吃牌麻将
     */
    getChiMj:function () {
        return this.chi_mjs;
    },
    /**
     * 获取随机一张花牌
     */
    getRandomFlowerMj:function () {
        let list = [];
        for(let idx = 0; idx < 8; idx++){
            let count = this.mjs_flower[idx];
            if(count >= 1){
                list.push(60 + idx + 1);
            }
        }
        if(list.length > 0){
            let pos = Math.floor(Math.random() * list.length);
            return list[pos];
        }else{
            return 0;
        }
    },
    /**
     * 是否可以碰
     * @param mjId
     * @returns {boolean}
     */
    pengAble: function (mjId) {
        // ERROR("pengAble mjId: " + mjId);
        if(this.getTotalCount() % 3 != 2) {
            let type = Math.floor(mjId / 10);
            let number = (mjId  % 10);
            if (type <= 3) {
                return this.mjs_TDW[type - 1][number - 1] >= 2;
            } else if (type == 4) {
                return this.mjs_DNXB[number - 1] >= 2;
            } else if (type == 5) {
                return this.mjs_ZFB[number - 1] >= 2;
            }
        }
        return false;
    },
    /**
     * 碰
     * @param mjId
     * @param sourceIdx
     */
    peng: function (mjId, sourceIdx) {
        this.removeMjs(mjId);
        this.removeMjs(mjId);
        this.owner.owner.publicCards.played.push(mjId);
        this.owner.owner.publicCards.played.push(mjId);
        this.peng_mjs[mjId] = sourceIdx;
    },
    /**翻译在线
     * 杠
     * @param mjId
     * @param gangType
     */
    gang: function (mjId, gangType) {
        switch (gangType) {
            case Enum.GangType.MING_GANG:
                this.removeMjs(mjId);
                this.removeMjs(mjId);
                this.removeMjs(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.gang_mjs[mjId] = {type: Enum.GangType.MING_GANG, source:this.owner.owner.prePlayer};
                this.mingNum++;
                this.mingNumAll++;
                break;
            case  Enum.GangType.PASSROAD:
                let source = this.peng_mjs[mjId];
                delete this.peng_mjs[mjId];
                this.gang_mjs[mjId] = {type:Enum.GangType.PASSROAD, source:source};
                this.removeMjs(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.mingNum++;
                this.mingNumAll++;
                break;
            case Enum.GangType.AN_GANG:
                this.removeMjs(mjId);
                this.removeMjs(mjId);
                this.removeMjs(mjId);
                this.removeMjs(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.owner.owner.publicCards.played.push(mjId);
                this.gang_mjs[mjId] = {type:Enum.GangType.AN_GANG, source:this.owner.index};
                this.anNum++;
                this.anNumAll++;
                break;
        }

    },
    /**
     * 获取麻将数量
     * @param mjId
     * @returns {*}
     */
    getMjNum: function (mjId) {
        let type = Math.floor(mjId / 10);
        let number = Math.floor(mjId % 10);
        if(type <= 3){
            return this.mjs_TDW[type - 1][number - 1];
        }else if(type == 4){
            return this.mjs_DNXB[number - 1];
        }else if(type == 5){
            return this.mjs_ZFB[number - 1];
        }else if(type == 6){
            return this.mjs_flower[number - 1];
        }
        return 0;
    },
    /**
     * 获取杠牌类型
     * @param mjId
     * @returns {*}
     */
    gangType:function(mjId) {
        let count = this.getMjNum(mjId);
        if (this.getTotalCount() % 3 == 2) {
            if (count == 4) {
                return Enum.GangType.AN_GANG;
            }
            if(this.isPassLoad(mjId)){
                return Enum.GangType.PASSROAD;
            }
        } else if (count == 3) {
            return Enum.GangType.MING_GANG;
        }
        return null;
    },
    /**
     * 是否有过路杠
     * @param mjId
     * @returns {*}
     */
    isPassLoad:function (mjId) {
        return this.peng_mjs[mjId];
    },
    /**
     * 麻将转换
     * @returns {Array}
     */
    mjList: function () {
        let data = {};
        for(let iType = 0; iType < 3; iType++){
            for(let iNumber = 0; iNumber < 9; iNumber++){
                let count = this.mjs_TDW[iType][iNumber];
                if(count > 0){
                    data[(iType + 1) * 10 + iNumber + 1] = count;
                }
            }
        }
        for(let iNumber = 0; iNumber < 4; iNumber++){
            let count = this.mjs_DNXB[iNumber];
            if(count > 0){
                data[40 + iNumber + 1] = count;
            }
        }
        for(let iNumber = 0; iNumber < 3; iNumber++){
            let count = this.mjs_ZFB[iNumber];
            if(count > 0){
                data[50 + iNumber + 1] = count;
            }
        }
        for(let iNumber = 0; iNumber < 8; iNumber++){
            let count = this.mjs_flower[iNumber];
            if(count > 0){
                data[60 + iNumber + 1] = count;
            }
        }
        return data;
    },
    /**
     * 获取随机的麻将
     */
    getRandomMjNoHua:function(){
        let data = this.mjList();
        let array = [];
        for(let mjId in data){
            let count = data[mjId];
            if(mjId < 60) {
                for (let i = 0; i < count; i++) {
                    array.push(+mjId);
                }
            }
        }
        let r = Math.floor(Math.random() * array.length);
        return array[r];
    },
    /**
     * 获取log日志的信息
     */
    getLogCard:function () {
        let str = "";
        str += util.format("姓名:%s ",this.owner.name);
        str += util.format("UID:%d ",this.owner.uid);
        for(let idx in this.chi_mjs){
            let cards = this.chi_mjs[idx].cards;
            str += util.format("吃:(%d, %d, %d)", cards[0],cards[1],cards[2]);
        }
        for (let mjId in this.peng_mjs) {
            str += util.format("碰:(%d, %d, %d)",mjId, mjId, mjId);
        }
        for(let mjId in this.gang_mjs){
            str += util.format("杠:(%d, %d, %d, %d)",mjId, mjId, mjId, mjId);
        }
        let mjs = this.mjList();
        let temp = [];
        for(let mjId in mjs){
            let count = mjs[mjId];
            for(let idx = 0; idx < count;idx++){
                temp.push(mjId);
            }
        }
        str += "手:(";
        let len = temp.length;
        for(let idx in temp){
            if(len == +idx + 1){
                str += util.format("%d",temp[idx]);
            }else{
                str += util.format("%d, ",temp[idx]);
            }
        }
        str += ")";
        len = this.flowered.length;
        if(this.flowered.length > 0) {
            str += "花:(";
            for (let idx in this.flowered) {
                if(len == +idx + 1) {
                    str += util.format("%d",this.flowered[idx]);
                }else{
                    str += util.format("%d, ",this.flowered[idx]);
                }
            }
            str += ")";
        }
        if(this.huMj){
            str += util.format("胡:(%d)",this.huMj);
        }
        return str;
    },
    /**
     * 是否混一色
     * @returns {boolean}
     */
    isHunYiSe:function () {
        if(this.getHS() != 1){
            return false;
        }
        let hs = 0;
        for(let type = 0; type < 3; type++){
            if(this.mjTDWCounts[type] > 0){
                hs = type + 1;
                break;
            }
        }
        for(let idx in this.chi_mjs){
            let card = this.chi_mjs[idx].card;
            if (Math.floor(card / 10) != hs){
                return false;
            }
        }
        for(let card in this.peng_mjs){
            if (card < 40 && Math.floor(card / 10) != hs){
                return false;
            }
        }
        for(let card in this.gang_mjs){
            if (card < 40 && Math.floor(card / 10) != hs){
                return false;
            }
        }
        return true;
    },
    /**
     * 清一色
     * @returns {boolean}
     */
    isQingYiSe: function () {
        for(let iType = 0; iType < 4; iType++){
            if(this.mjs_DNXB[iType] > 0){
                return false;
            }
        }
        for(let iType = 0; iType < 3; iType++){
            if(this.mjs_ZFB[iType] > 0){
                return false;
            }
        }
        if(this.getHS() != 1){
            return false;
        }
        let shouType = Math.floor(this.huMj / 10);
        for(let card in this.peng_mjs){
            if(Math.floor(card  / 10) != shouType){
                return false;
            }
        }
        for(let card in this.gang_mjs){
            if(Math.floor(card  / 10) != shouType){
                return false;
            }
        }
        for(let idx in this.chi_mjs){
            let card = this.chi_mjs[idx].card;
            if(Math.floor(card  / 10) != shouType){
                return false;
            }
        }
        return true;
    },
    /**
     * 是否碰碰胡
     */
    isPengPengHu:function () {
        let sum = 0;
        for(let type = 0; type < 3; type++){
            for(let numberIdx = 0; numberIdx < 9; numberIdx++){
                let mjId = (type + 1) * 10 + numberIdx + 1;
                if(mjId != this.JP) {
                    let count = this.mjs_TDW[type][numberIdx];
                    if (count == 3) {
                        sum++;
                    }
                }
            }
        }
        for(let numberIdx = 0; numberIdx < 4; numberIdx++){
            let mjId = 40 + numberIdx + 1;
            if(mjId != this.JP) {
                let count = this.mjs_DNXB[numberIdx];
                if (count == 3) {
                    sum++;
                }
            }
        }
        for(let numberIdx = 0; numberIdx < 3; numberIdx++){
            let mjId = 50 + numberIdx + 1;
            if(mjId != this.JP) {
                let count = this.mjs_ZFB[numberIdx];
                if (count == 3) {
                    sum++;
                }
            }
        }
        sum += Object.keys(this.peng_mjs).length;
        sum += Object.keys(this.gang_mjs).length;
        if(sum == 4){
            return true;
        }
        return false;
    },
    /**
     * 豪华七小对有多少杠牌
     */
    getDuiGang:function() {
        let sum = 0;
        for(let type = 0; type < 3; type++){
            for(let numberIdx = 0; numberIdx < 9; numberIdx++){
                let count = this.mjs_TDW[type][numberIdx];
                if(count == 4){
                    sum++;
                }
            }
        }
        for(let idx = 0; idx < 4; idx++){
            let count = this.mjs_DNXB[idx];
            if(count == 4){
                sum++;
            }
        }
        for(let idx = 0; idx < 3; idx++){
            let count = this.mjs_ZFB[idx];
            if(count == 4){
                sum++;
            }
        }
        return sum;
    }
};

///////////////////////////////////////////////////////////////////////////////
//>> 游戏玩家
class HNPlayer extends Player {
    constructor(owner, index, windDesc) {
        super(owner, index);
        this.huNum = 0;                             // 胡牌的次数
        this.handCards = new HandCards(this);       // 手牌信息
        this.windDesc = windDesc;                   // 方位说明
        this.preGaScore = 0;                        // 上一盘的嘎分
        this.curGaScore = -1;                       // 这盘噶分
        this.packInfo = {};                         // 包牌信息
        this.startReset();
    }
    /**
     * 重置
     */
    startReset() {
        this.roundScore = 0;                    // 当前盘积分
        this.ready = false;                     // 玩家是否就绪
        this.chiState = null;                   // 吃的状态
        this.gangState = null;                  // 杠的状态
        this.pengState = null;                  // 碰的状态
        this.huState = null;                    // 胡的状态
        this.handCards.reset();                 // 重置卡牌数据

        this.queuedPackets = [];                // 数据包
        this.reqExit = false;                   // 客户端主动退出
        this.scheJob = null;                    // 限时任务
        this.autoFun = null;                    // 自动函数
        this.aotuParam = [];                    // 自动参数
        this.isAnimation = false;               // 动画结束
        this.gangFlag = false;                  // 当前动作是否为杠牌标记，用于判断杠上花
        this.huaFlag = false;                   // 当前摸的牌是花牌则为true，不是为false,用于判断补花胡牌
        this.passHuIndex = 0;                   // 抢杠胡哪一家的牌标记 为0没有抢杠胡
        this.packInfo = {};                     // 玩家的包赔信息 包括三道包、四道包
        this.task = {};                         // 玩家身上的挂起任务
        this.firstCard = 0;                     // 玩家本局出的第一张牌
        this.chiIdx = 0;                        // 吃牌的数组
        this.gangCard = 0;                      // 杠的牌
        this.autoNum = 0;                       // 自动出牌次数
        this.isT = false;                       // 是否托管
        this.destroyState = Enum.DestroyState.NONE; // 解散房间选择的状态
    }
    /**
     * 结束一盘重置
     */
    endReset () {
        this.ready = false;
        this.playing = false;
        this.preGaScore = this.curGaScore;
        this.curGaScore = -1;
        this.isT = false;
    }
    /**
     * 初始化
     * @param data
     * @param wsConn
     */
    init(data, wsConn) {
        super.init(data, wsConn);
        this.luck = data.luck.mj || 80;
    }
    /**
     * 获取数据
     * @returns {{uid: *, name, headIcon: string, bean: (*|number), ip: null, ready: *, score: *, roundScore: *, index: *}}
     */
    getInfo() {
        let data = super.getInfo();
        data.multiple  = this.curGaScore;
        data.handCards = this.handCards.mjList();
        data.handCardsNumber = this.handCards.getTotalCount();
        data.cardNum   = Object.keys(data.handCards).length;
        data.playedCards = this.handCards.played;
        data.flowerCards = this.handCards.flowered;
        data.chiCards  = this.handCards.getChiMj();
        data.pengCards = this.handCards.getPengMj(true);
        data.gangCards = this.handCards.getGangMj(true);
        data.existOtherHangup = false;
        data.lastCard  = this.handCards.lastMj;
        data.huCard    = this.handCards.huMj;
        data.hangupTasks = this.task;
        data.isT = this.isT;
        return data;
    }
    /**
     * 获取结算信息
     * @param final
     */
    getSettementInfo(final) {
        let data = {};
        data.name = this.name;
        data.headPic = this.headPic;
        data.index= this.index;
        data.uid = this.uid;
        if (!final) {
            data.handCards = this.handCards.mjList();           // 牌组信息
            data.pengMj = this.handCards.getPengMj(true);       // 碰牌信息
            data.gangMj = this.handCards.getGangMj(true);       // 杠牌信息
            data.chiMj = this.handCards.getChiMj();             // 吃牌信息
            data.flowerCards = this.handCards.flowered.sort();  // 花牌信息
            data.words = this.genWords();
            data.gangScore = this.owner.gangScoreInfo[this.index] * this.owner.baseBean;
            data.huaScore = this.owner.huaScoreInfo[this.index] * this.owner.baseBean;
            data.huScore = this.owner.huScoreInfo[this.index] * this.owner.baseBean;
            data.realScore = this.owner.realScoreInfo[this.index];
        } else {
            data.score = this.score;                            // 积分
            data.mingGangCount = this.handCards.mingNumAll;     // 明杠
            data.anGangCount  = this.handCards.anNumAll;        // 暗杠
            data.dpCount = this.handCards.dianNum;              // 点炮次数
            data.dhCount  = this.handCards.jieNum;              // 接炮次数
            data.zmCount = this.handCards.zimoNum;              // 自摸次数
        }
        return data;
    }
    /**
     * 生成文字描述
     */
    genWords() {
        let str = "";
        if(this.owner.huIdx == this.index){
            if(this.owner.huType2Msg != ""){
                str += " " + this.owner.huType2Msg;
            }
            if(!this.owner.paoIdx == 0){
                str += " " + "接炮";
            }
        }
        if(this.owner.paoIdx == this.index){
            str += "点炮";
        }
        let mingNum = 0, anNum = 0, lzNum = 0;
        for(let mjId in this.handCards.gang_mjs){
           if(this.handCards.gang_mjs[mjId].type != Enum.GangType.AN_GANG){
               mingNum++;
           }else{
               anNum++;
           }
        }
        if(mingNum != 0){
            str += " " + "明杠x" + mingNum;
        }
        if(anNum != 0){
            str += " " + "暗杠x" + anNum;
        }
        if(this.index == this.owner.dealer){
            if(this.owner.opts.isZX){
                str += " " + "庄闲";
            }
            if(this.owner.opts.isLZ){
                lzNum = this.owner.calcLz();
            }
        }
        if(lzNum != 0){
            str += " " + "连庄x" + lzNum;
        }
        if(this.index == this.owner.dealer) {
            if (this.owner.firstGang) {
                str += " 首张被杠";
            }
            if(this.owner.firstGen){
                str += " 首张被跟";
            }
        }
        str += " " + Math.max(this.curGaScore, 0) + "噶";
        return str;
    }
    /**
     * 设置手牌
     * @param cards
     */
    setHandCards(cards) {
        this.startReset();
        this.handCards.init(cards);
        this.sendMsg(ProtoID.GAME_CLIENT_INIT_CARD_MJ, {playStatus: this.owner.state, handCards : this.handCards.mjList()});
    }

    /**
     * 清楚吃杠参数
     */
    clearCGParam() {
        this.chiIdx = 0;
        this.gangCard = 0;
    }
    /**
     * 设置自动函数
     * @param fun
     * @param param
     */
    setAutoFun(fun,param) {
        this.autoFun = fun;
        this.autoParam = param;
    }
    /**
     * 设置抢牌状态为抢过<参数1吃2碰3杠4胡>
     * @param type
     */
    setGRabState(type){
        this.resetGrabState();
        switch (type){
            case 1:
                this.chiState = Enum.GrabState.GRABED;
                break;
            case 2:
                this.pengState = Enum.GrabState.GRABED;
                break;
            case 3:
                this.gangState = Enum.GrabState.GRABED;
                break;
            case 4:
                this.huState = Enum.GrabState.GRABED;
                break;
        }
    }
    /**
     * 重置抢牌状态
     */
    resetGrabState() {
        this.chiState = null;
        this.pengState = null;
        this.gangState = null;
        this.huState = null;
    }
    /**
     * 更新包赔信息
     * @param num
     * @param playerIndex
     */
    updatePackInfo(num, playerIndex) {
        this.packInfo.num = num;
        this.packInfo.playerIndex = playerIndex;
    }
    /**
     * 计算花牌倍率
     * @returns {number}
     */
    calcHuaRate () {
        let huaCards = this.handCards.flowered;
        let rate = 0;
        let isMLZJ = true, isCXQD = true;
        let sum = 0;
        for(let idx = 0; idx < 8; idx++){
            if(huaCards.indexOf(60 + idx + 1) == -1){
                sum++;
            }
        }
        for(let idx = 0; idx < 4; idx++){
            if(huaCards.indexOf(60 + idx + 1) == -1){
                isMLZJ = false;
                break;
            }
        }
        for(let idx = 0; idx < 4; idx++){
            if(huaCards.indexOf(64 + idx + 1) == -1){
                isCXQD = false;
                break;
            }
        }
        if(this.owner.opts.isHH) {
            if (isMLZJ || isCXQD) {
                rate = 1;
            }
        }else{
            if(sum == 1){
                rate = 1;
            }
        }
        if(sum == 0){
            rate = 2;
        }
        return rate;
    }
    /**
     * 玩家战绩
     * @returns {{}}
     */
    getPlayerReportInfo(){
        let data = {};
        data.roundBean = this.owner.realScoreInfo[this.index];
        data.name = this.name;
        data.uid = this.uid;
        return data
    }
};

exports.Player = HNPlayer;
