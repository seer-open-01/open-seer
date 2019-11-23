let util            = require("util");
let Enum            = require("./Enum.js");
let CSProto         = require("../../../net/CSProto.js");
let CommFuc         = require("../../../util/CommonFuc.js");
let Player          = require("../../base/player");
let Func            = require("./Func.js");
///////////////////////////////////////////////////////////////////////
//>> 玩家信息

class HandCards  {
    constructor(owner){
        this.owner = owner;
        this.anNumAll = 0;
        this.mingNumAll = 0;
        this.dianNum = 0;
        this.jieNum = 0;
        this.zimoNum = 0;
        this.reset();
    }

    /**
     * 重置
     */
    reset() {
        this.num = 0;
        this.mjs = CommFuc.twoDimensionalArray(3, 9, 0);       // 手牌信息
        this.peng_mjs = {};                                                     // 碰牌信息
        this.gang_mjs = {};                                                     // 杠牌信息
        this.chi_mjs = [];                                                      // 吃牌信息
        this.menQing = true;                                                    // 门清
        this.played = [];                                                       // 打过的牌
        this.lastMj = 0;                                                        // 最后摸过的牌
        this.huMj = null;                                                       // 最后胡的牌
        this.JP = null;                                                         // 将牌
        this.zmHu = true;                                                       // 是否为自摸胡牌
        this.tings = {};                                                        // 听牌集合(走哪些牌胡哪些)
        this.cJtings = {};                                                      // 查叫集合(直接给牌判断哪些牌胡)
        this.hszInfo = {self:[],swap:[],swapIdx:0,status:0};                    // 换三张信息
        this.huMult = -1;                                                        // 胡牌的番薯
        this.lastPlay = 0;                                                      // 最后走过的牌
    }

    init(cards) {
        for (let i = 0; i < cards.length; i++) {
            if(i == 13){
                this.drawMj(cards[i]);
            }else {
                this.addMjs(cards[i]);
            }
        }
    }
    /**
     * 增加麻将, 第二个参数是 是否是玩家摸的
     * @param mjId
     * @param isMo
     */
    addMjs(mjId,isMo) {
        let type = Math.floor(mjId / 10);
        let number = mjId % 10;
        this.mjs[type - 1][number - 1]++;
        if(isMo){
            this.lastMj = mjId;
        }
    }

    /**
     * 胡牌的文字描述
     * @param huType
     */
    huWord(isZM){
        let msg = isZM ? "自摸" : "接炮";
        if(msg === "自摸"){
            if(this.owner.dghFlag){
                if(!this.owner.owner.opts.DGHZM) {
                    msg = "点杠花当点炮";
                }
            }
        }
        msg += "(";
        let huType = Func.huPai(this);
        let word = "";
        if(huType === Enum.HuType.PING){
            let temp = "";
            if(this.isPengPengHu()){
                temp = "对对胡";
                if(this.isQingYiSe()){
                    temp = "清对";
                }
                if(this.isQ258_PPH()){
                    temp = "将对";
                }
            }
            word += temp;
        }else if(huType === Enum.HuType.QI_XIAO_DUI){
            let count = this.getDuiGang();
            let temp = "";
            switch (count) {
                case 0: temp = "七对";break;
                case 1: temp = "龙七对";break;
                case 2: temp = "双龙七对";break;
                case 3: temp = "三龙七对";break;
            }
            if(this.isQingYiSe()){
                switch (count) {
                    case 0: temp = "清七对";break;
                    case 1: temp = "清龙七对";break;
                    case 2: temp = "清龙双七对";break;
                    case 3: temp = "清龙三七对";break;
                }
            }
            if(this.isQ258()){
                temp += ",将七对";
            }
            word += temp;
        }


        if(word === "") {
            if (this.isQingYiSe()) {
                word = "清一色";
            }

            if(this.isGGD()){
                word = "金钩钓";
            }

            if (this.isQ19()) {
                word = "全幺九";
            }

            if (this.isQingYiSe() && this.isGGD()) {
                word = "清一色,金钩钓";
            }

            if(word === ""){
                word = "平胡";
            }
        }else{
            if (this.isQ19()) {
                word += ",全幺九";
            }
        }
        if(this.isMenQing()){
            word += ",门清";
        }
        if(this.isMiddle()){
            word += ",中张";
        }

        let root = this.calcRoot(huType);
        if(root > 0) {
            word += `,${root}根`;
        }

        if(this.isGSH()){
            word += ",杠上花";
        }

        if(this.isGSS()){
            word += ",杠上炮";
        }

        if(this.isQGH()){      // 抢杠胡
            word += ",抢杠胡";
        }


        if(this.isHDL()){       // 是否海底捞
            word += ",海底捞";
        }

        if(this.isHDP()){
            word += ",海底炮";
        }

        if(this.isTH()){
            word += ",天胡";
        }

        if(this.isDH()){
            word += ",地胡";
        }

        if(this.isJXW()){
            word += ",夹心五";
        }
        msg += word;
        msg += ")";
        return msg;
    }
    /**
     * 计算胡牌的番数
     * @param huType
     */
    calcHuFan(huType){
        let fan = 0;
        if(this.isQingYiSe()){
            fan += 2;
        }
        if(huType === Enum.HuType.QI_XIAO_DUI){
            fan += 2;
            let count = this.getDuiGang();
            fan += count;
            if(this.isQ258()){
                fan += 2;
            }
        }
        if(this.isPengPengHu()){
            fan += 1;
            if(this.isQ258_PPH()){
                fan += 1;
            }
        }

        if(this.isQ19()){
            fan += 3;
        }
        if(this.isMenQing()){
            fan += 1;
        }
        if(this.isMiddle()){
            fan += 1;
        }

        let root = this.calcRoot(huType);
        fan += root;

        if(this.isGSH()){
            fan += 1;
        }

        if(this.isGSS()){
            fan += 1;
        }

        if(this.isQGH()){      // 抢杠胡
            fan += 1;
        }

        if(this.isGGD()){      // 金钩钓
            fan += 2;
        }

        if(this.isHDL()){       // 是否海底捞
            fan += 1;
        }

        if(this.isHDP()){
            fan += 1;
        }

        if(this.isTH()){
            fan += 3;
        }

        if(this.isDH()){
            fan += 2;
        }


        this.isDGHZM();

        if(this.isJXW()){
            fan += 1;
        }
        // 自摸加番
        if(this.zmHu){
            if(this.owner.owner.opts.ZMJF) {
                fan += 1;
            }
        }
        let huMult = this.owner.owner.calcMaxRate(fan);
        // 自摸加胡
        if(this.zmHu){
            if(!this.owner.owner.opts.ZMJF) {
                huMult += 1;
            }
        }


        if(huMult > this.owner.owner.opts.maxMult){
            huMult = this.owner.owner.opts.maxMult;
        }



        return huMult;
    }

    /**
     * 设置任务参数
     * @param huType
     */
    setTaskParams(huType){
        let task = this.owner.taskParams;
        if(this.isQingYiSe()){
            task.qys_hu = true;
        }
        if(this.zmHu){
            task.selfStroke = true;
        }
        if(huType === Enum.HuType.QI_XIAO_DUI){
            task.dui_hu = true;
        }
        if(this.isPengPengHu()){
            if(this.isQ258_PPH()){
                task.hu_JD = true;
            }
            task.pp_hu = true;
        }
        if(this.isQ19()){
            task.hu_19 = true;
        }
        if(this.isMenQing()){
            task.hu_MQ = true;
        }
        if(this.isMiddle()){
            task.hu_ZZ = true;
        }
        if(this.isQGH()){      // 抢杠胡
            task.qgh_hu = true;
        }
        if(this.isGGD()){      // 金钩钓
            task.hu_GGD = true;
        }
        if(this.isTH()){
            task.hu_TH = true;
        }

        if(this.isDH()){
            task.hu_DH = true;
        }
    }
    /**
     * 计算胡牌
     * @param card
     * @returns {*}
     */
    calcHuMjs(card) {
        this.addMjs(card);
        this.zmHu = false;
        let huType = Func.huPai(this);
        if(huType) {
            this.huMj = card;
            this.huMult = this.calcHuFan(huType);
            this.cjWord = this.huWord(false);
            this.huMj = null;
        }
        this.removeMjs(card);
        return huType;
    }

    getMaxHuMult(){
        let len = Object.keys(this.tings).length;
        if(len === 0){
            return 0;
        }
        let max = 0;
        for(let idx = 0; idx < len; idx++){
            let ting = this.tings[idx];
            if(ting.huMult > max){
                max = ting.huMult;
            }
        }
        return max;
    }

    /**
     * 计算查叫牌 而不是走哪一张胡哪一张
     */
    calcCJ(){
        this.cJtings = {};
        for(let idx in Enum.AllMj) {
            let addMj = Enum.AllMj[idx];
            let huType = this.calcHuMjs(addMj);
            if(huType){
                this.cJtings[addMj] = {huMult:this.huMult,cjWord:this.cjWord};
            }
        }
    }

    /**
     * 获取最大查叫
     */
    getMaxCJ(){
        if(Object.keys(this.cJtings).length === 0){
            return null;
        }else{
            let maxMult = 0;
            let maxMJ = 0;
            let word = "";
            for(let mjId in this.cJtings){
                let curMult = this.cJtings[mjId].huMult;
                if(curMult > maxMult){
                    maxMJ = +mjId;
                    maxMult = curMult;
                    word = this.cJtings[mjId].cjWord || "";
                }
            }
            return {maxMult, word};
        }
    }
    /**
     * 计算听牌
     */
    calTingMjs() {
        let data = {};
        this.tings = {};
        for(let idx in Enum.AllMj){
            let mj = Enum.AllMj[idx];
            if(this.contains(mj)){
                this.removeMjs(mj);
                for(let i in Enum.AllMj){
                    let addMj = Enum.AllMj[i];
                    let huType = this.calcHuMjs(addMj);
                    if(huType){
                        let plusNum = this.owner.owner.publicCards.plusNumMjId(addMj);
                        if(mj == addMj){
                            plusNum--;
                        }
                        plusNum -= this.getMjNum(addMj);
                        if(plusNum < 0){
                            ERROR("出现了大相公或者小相公");
                        }
                        let temp = {card:addMj, num: plusNum, huMult:this.huMult};
                        if(!data[mj]) {
                            data[mj] = [];
                        }
                        data[mj].push(temp);
                    }
                }
                this.addMjs(mj);
            }
        }
        this.tings = clone(data);
        return data;
    }
    /**
     * 获取总个数
     * @returns {number}
     */
    getTotalCount() {
        let sum = 0;
        for(let iType = 0; iType < 3; iType++){
            for(let iNumber = 0; iNumber < 9; iNumber++){
                sum += this.mjs[iType][iNumber];
            }
        }
        return sum;
    }

    /**
     * 获取随机的麻将
     */
    getRandomMj(){
        let data = this.mjList();
        let array = [];
        for(let mjId in data){
            let count = data[mjId];
            for (let i = 0; i < count; i++) {
                array.push(+mjId);
            }
        }
        return CommFuc.getRandomValue(array);
    }

    /**
     * 移除麻将, 麻将id 是否临时移除标志
     * @param mjId
     */
    removeMjs(mjId) {
        let type = Math.floor(mjId / 10);
        let number = Math.floor(mjId % 10);
        if(type <= 3 && type >= 1){
            this.mjs[type - 1][number - 1]--;
        }else{
            ERROR("移除麻将失败，不存在此麻将" + mjId);
        }
    }
    /**
     * 是否有该麻将
     * @param mjId
     * @returns {boolean}
     */
    contains(mjId) {
        let count = this.getMjNum(mjId);
        return count > 0 ? true : false;
    }
    /**
     * 获取麻将数量
     * @param mjId
     * @returns {*}
     */
    getMjNum(mjId) {
        let type = Math.floor(mjId / 10);
        let number = Math.floor(mjId % 10);
        if(this.mjs[type - 1][number - 1] != null) {
            return this.mjs[type - 1][number - 1];
        }else{
            return 0;
        }
    }

    /**
     * 出牌
     * @param mjId
     */
    playMj(mjId) {
        this.removeMjs(mjId);
        this.played.push(mjId);
        this.lastPlay = mjId;
        this.owner.owner.publicCards.played.push(mjId);
    }

    /**
     * 删除出过的麻将
     */
    delPlayedMj() {
        if(this.played.length > 0) {
            this.played.pop();
        }
    }

    /**
     * 摸牌
     */
    drawMj(mjId) {
        this.addMjs(mjId,true);
    }

    /**
     * 吃的类型
     * @param card
     * @returns {Array}
     */
    chiAble(card) {
        let chiType = [];
        let typeIndex = Math.floor(card / 10) - 1;
        let numIndex = (card % 10) - 1;
        let typeMj = this.mjs[typeIndex];
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
    }
    /**
     * 吃牌+
     * @param mjs
     * @param chiMj
     */
    chi(mjs,chiMj) {
        for(let i in mjs){
            let mjId = mjs[i];
            if(mjId != chiMj) {
                this.removeMjs(mjId);
                this.owner.owner.publicCards.played.push(mjId);
            }
        }
        let arr = this.chiPosChange(mjs, chiMj);
        this.chi_mjs.push({"card":chiMj, "cards":arr, "target":this.owner.owner.prePlayer});
    }
    /**
     * 吃牌位置调整
     */
    chiPosChange(mjs, chiMj) {
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
    }

    /**
     * 获取碰的麻将
     */
    getPengMj(client) {
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
    }
    /**
     * 获取杠的麻将
     * @return {Array}
     */
    getGangMj(client) {
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
    }
    /**
     * 获取吃牌麻将
     */
    getChiMj() {
        return this.chi_mjs;
    }

    /**
     * 是否可以碰
     * @param mjId
     * @returns {boolean}
     */
    pengAble(mjId) {
        if(this.getTotalCount() % 3 != 2) {
            let type = Math.floor(mjId / 10);
            let number = (mjId  % 10);
            return this.mjs[type - 1][number - 1] >= 2;
        }
        return false;
    }
    /**
     * 碰
     * @param mjId
     * @param sourceIdx
     */
    peng(mjId, sourceIdx) {
        this.removeMjs(mjId);
        this.removeMjs(mjId);
        this.owner.owner.publicCards.played.push(mjId);
        this.owner.owner.publicCards.played.push(mjId);
        this.peng_mjs[mjId] = sourceIdx;
    }
    /**
     * 杠
     * @param mjId
     * @param gangType
     */
    gang(mjId, gangType) {
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

    }
    /**
     * 获取杠牌类型
     * @param mjId
     * @returns {*}
     */
    gangType(mjId) {
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
    }
    /**
     * 是否有过路杠
     * @param mjId
     * @returns {*}
     */
    isPassLoad(mjId) {
        return this.peng_mjs[mjId];
    }

    /**
     * 获取满足条件的最小花色牌
     * @param limit
     * @returns {Array}
     */
    getBestHS(limit){
        let typeToNum = [];
        for(let iType = 0; iType < 3;iType++){
            let array = [];
            for(let iNumber = 0; iNumber < 9;iNumber++){
                let num = this.mjs[iType][iNumber];
                for(let i = 0; i < num; i++) {
                    array.push((iType + 1) * 10 + iNumber + 1);
                }
            }
            typeToNum.push({type:iType, num:array.length,cards:array});
        }
        typeToNum.sort(function (a, b) {
            return a.num > b.num ? 1 : -1;
        })
        for(let i = 0; i < 3; i++){
            if(typeToNum[i].num >= limit){
                return typeToNum[i];
            }
        }
        return null;
    }
    /**
     * 随机三张换三张牌
     */
    randomHSZCards(){
        let BestInfo = this.getBestHS(3);
        if(BestInfo) {
            let out = this.getOptsOut(BestInfo.type);
            this.hszInfo.self = out;
            return out;
        }else{
            ERROR("无法拿到三张？请检查相关代码");
        }
    }

    /**
     * 获取最优的换三张牌
     * @param cards
     */
    getOptsOut(type){
        let out = [];
        let list = clone(this.mjs[type]);
        let clist = clone(list);
        for(let idx = 0; idx < 9; idx++){
            Func.removeShun(list,idx);
        }
        for(let idx = 0; idx < 9;idx++){
            Func.removeKe(list,idx);
        }

        for(let idx = 0; idx < 9; idx++){
            Func.removeDui(list, idx);
        }

        let wgCards = this.tabToList(list, type);
        let max = wgCards.length;
        if(max === 0){
            this.OptsShunKe(clist, type, out);
        }else if(max === 1){
            this.OptsDui(clist, wgCards, type, out, 2);
        }else if(max === 2){
            this.OptsDui(clist, wgCards, type, out, 1);
        }else if(max >= 3){
            this.randomCards(wgCards, 3, out);
        }
        let loop = 3 - out.length;
        let plusCards = this.tabToList(clist, type);
        this.randomCards(plusCards, loop, out);
        for(let idx = 0; idx < out.length; idx++){
            let card = out[idx];
            if(!this.contains(card)){
                ERROR("换三张出现了错误,请检查相关代码,调用方法 getOptsOut");
            }
        }
        return out;
    }

    /**
     * 获取顺客
     * @param list
     * @param type
     * @returns {*}
     */
    OptsShunKe(list, type, out){
        for(let idx = 0; idx < 9; idx++){
            if (idx <= 6 && list[idx] !== 0 && list[idx + 1] !== 0 && list[idx + 2] !== 0) {
                let card = (type + 1) * 10 + idx + 1;
                list[idx]--;
                list[idx + 1]--;
                list[idx + 2]--;
                out.push(card);
                out.push(card + 1);
                out.push(card + 2);
                return;
            }
        }
        for(let idx = 0; idx < 9; idx++){
            if (list[idx] >= 3) {
                let card = (type + 1) * 10 + idx + 1;
                list[idx] -= 3;
                out.push(card);
                out.push(card);
                out.push(card);
                return;
            }
        }
    }

    /**
     * 优先选择对牌
     */
    OptsDui(list, wgCards, type, out, num){
        for(let idx = 0; idx < wgCards.length; idx++) {
            let wgCard = wgCards[idx];
            out.push(wgCard);
            let number = wgCard % 10 - 1;
            list[number]--;
        }
        for(let idx = 0; idx < 9; idx++){
            if (list[idx] === 2) {
                let card = (type + 1) * 10 + idx + 1;
                for(let i = 0; i < num; i++) {
                    list[idx]--;
                    out.push(card);
                }
                return;
            }
        }
    }

    /**
     * 随机剩余的牌
     * @param list
     * @param out
     */
    randomCards(cards, loop, out){
        for(let idx = 0; idx < loop; idx++){
            let rIdx = Math.floor(Math.random() * cards.length);
            let card = cards[rIdx];
            out.push(card);
            cards.splice(rIdx, 1);
        }
    }
    /**
     * 麻将转换
     * @returns {Array}
     */
    mjList() {
        let data = {};
        for(let iType = 0; iType < 3; iType++){
            for(let iNumber = 0; iNumber < 9; iNumber++){
                let count = this.mjs[iType][iNumber];
                if(count > 0){
                    data[(iType + 1) * 10 + iNumber + 1] = count;
                }
            }
        }
        return data;
    }

    /**
     * 麻将转化成list数组
     */
    tabToList(list, type){
        let array = [];
        for(let idx = 0; idx < 9; idx++){
            let num = list[idx];
            for(let j = 0; j < num; j++){
                array.push((type + 1) * 10 + idx + 1);
            }
        }
        return array;
    }

    /**
     * 数组到tab表
     * @param array
     * @returns {Array}
     */
    listToTab(array){
        let data = CommFuc.oneDimensionalArray(9, 0);
        let len = array.length;
        for(let idx = 0; idx < len; idx++){
            let card = array[idx];
            let number = card % 10 - 1;
            data[number]++;
        }
        return data;
    }

    /**
     * 获取log日志的信息
     */
    getLogCard() {
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
        if(this.huMj){
            str += util.format("胡:(%d)",this.huMj);
        }
        return str;
    }


    /**
     * 获取总花色
     * @returns {number}
     */
    getHS () {
        let types = [];
        for(let iType = 0; iType < 3; iType++){
            for(let iNumber = 0; iNumber < 9; iNumber++){
                if(this.mjs[iType][iNumber] > 0){
                    types.push(iType);
                    break;
                }
            }
        }
        return types;
    }

    /**
     * 全是 2 5 8 组成的对子
     * @returns {boolean}
     */
    isQ258(){
        if(!this.owner.owner.opts.JD19){
            return false;
        }
        let list = this.mjList();
        for(let mjId in list){
            if(!this.is258(mjId)){
                return false;
            }
        }
        return true;
    }
    /**
     * 是否是 258将牌
     * @param mjID
     * @returns {boolean}
     */
    is258(mjID){
        mjID = +mjID;
        if(mjID % 10 === 2 || mjID % 10 === 5 || mjID % 10 === 8){
            return true;
        }
        return false;
    }
    /**
     * 全19
     */
    isQ19(){
        if(!this.owner.owner.opts.JD19){
            return false;
        }
        if(!this.is19(this.JP)) return false;
        for(let mjId in this.peng_mjs){
            if(!this.is19(mjId)){
                return false;
            }
        }
        for(let mjId in this.gang_mjs){
            if(!this.is19(mjId)){
                return false;
            }
        }
        let cmjs = clone(this.mjs);
        for(let iType = 0; iType < 3; iType++){
            for(let iNumber = 0; iNumber < 9; iNumber++){
                let mjId = ((iType + 1) * 10) + iNumber + 1;
                if(mjId === this.JP){
                    cmjs[iType][iNumber] -= 2;
                }
                let loop = 0;
                while(iNumber <= 6 && cmjs[iType][iNumber] !== 0 && cmjs[iType][iNumber + 1] !== 0 && cmjs[iType][iNumber + 2] !== 0){
                    cmjs[iType][iNumber]--;
                    cmjs[iType][iNumber + 1]--;
                    cmjs[iType][iNumber + 2]--;
                    if(!this.is19(mjId) && !this.is19(mjId + 1) && !this.is19(mjId + 2)){
                        return false;
                    }
                    loop++;
                    if(loop > 5){           // 防止意外卡死
                        break;
                    }
                }
                let count = cmjs[iType][iNumber];
                if(count > 0){
                    if(!this.is19(mjId)){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * 该牌是不是19
     * @param mjID
     * @returns {boolean}
     */
    is19(mjID){
        mjID = +mjID;
        if(mjID % 10 === 1 || mjID % 10 === 9){
            return true;
        }
        return false;
    }

    /**
     * 计算有几个根
     */
    calcRoot(huType){
        let sum = 0;
        sum += Object.keys(this.gang_mjs).length;
        let mjList = this.mjList();

        if(huType === Enum.HuType.PING) {
            for(let smj in mjList){
                let count = mjList[smj];
                if(count === 4){
                    sum += 1;
                }
                if(count === 1){
                    for(let pmj in this.peng_mjs){
                        if(pmj == smj){
                            sum += 1;
                        }
                    }
                }
            }
        }
        // sum += Object.keys(this.peng_mjs).length;  // todo 这个应该没有 不然太多了

        return sum;
    }

    /**
     * 是否杠上花
     */
    isGSH(){
        if(this.zmHu) {
            return this.owner.gangFlag
        }
        return false;
    }

    /**
     * 点杠花自摸
     * @returns {boolean}
     */
    isDGHZM(){
        if(this.isGSH()){
            if(this.owner.preGangType === Enum.GangType.MING_GANG) {
                this.owner.dghFlag = true;
            }
        }else{
            this.owner.dghFlag = false;
        }
    }

    /**
     * 是否杠上炮
     */
    isGSS(){
        if(!this.zmHu) {
            let preIndex = this.owner.owner.prePlayer;
            let prePlayer = this.owner.owner.getPlayerByIndex(preIndex);
            if (prePlayer && prePlayer.gangFlag) {
                if (this.owner.owner.prePlayMj === this.huMj) {
                    this.owner.GSSFlag = true;
                    return true;
                }
            }
        }
        this.owner.GSSFlag = false;
        return false;
    }

    /**
     * 是否抢杠胡
     * @returns {boolean}
     */
    isQGH(){
        return this.owner.owner.grabPassRoad
    }
    /**
     * 是否是金钩钓
     */
    isGGD(){
        return this.getTotalCount() === 2;
    }
    /**
     * 是否海底捞
     * @returns {boolean}
     */
    isHDL(){
        let plusNum = this.owner.owner.publicCards.num;
        if(plusNum === 0 && this.owner.owner.opts.HDL && this.owner.owner.CJFlag === false){
            return this.zmHu;
        }
        return false;
    }

    /**
     * 是否海底炮
     */
    isHDP(){
        let plusNum = this.owner.owner.publicCards.num;
        if(plusNum === 0 && this.owner.owner.opts.HDL && this.owner.owner.CJFlag === false){
            return this.zmHu === false;
        }
        return false;
    }

    isTH(){
        let room = this.owner.owner;
        if(room.dealer === this.owner.index) {
            if (room.publicCards.played.length === 0) {
                return true;
            }
        }
    }

    isDH(){
        let room = this.owner.owner;
        let dealerPlayer = room.getPlayerByIndex(room.dealer);
        if(dealerPlayer) {
            if (dealerPlayer.handCards.played.length === 0 && room.publicCards.played.length === 1 && this.played.length === 0 && room.cpgFlag === false) {
                return true;
            }
        }
        return false;
    }

    /**
     * 是否中张
     */
    isMiddle(){
        let list = this.mjList();
        if(!this.owner.owner.opts.MQZZ){
            return false;
        }
        for(let mjId in list){
            if((+mjId % 10) === 1 || (+mjId % 10) === 9){
                return false;
            }
        }
        for(let mjId in this.peng_mjs){
            if((+mjId % 10) === 1 || (+mjId % 10) === 9){
                return false;
            }
        }
        for(let mjId in this.gang_mjs){
            if((+mjId % 10) === 1 || (+mjId % 10) === 9){
                return false;
            }
        }
        return true;
    }

    /**
     * 是否门清
     */
    isMenQing(){
        if(this.menQing && this.owner.owner.opts.MQZZ){
            return true;
        }else{
            return false;
        }
    }
    /**
     * 是否夹心五
     */
    isJXW(){
        if((this.huMj % 10 !== 5)){
            return false;
        }
        let pre = this.getMjNum(this.huMj - 1);
        let next = this.getMjNum(this.huMj + 1);
        if(pre > 0 && next > 0){
            let tmpMj = this.huMj;
            this.removeMjs(tmpMj - 1);
            this.removeMjs(tmpMj);
            this.removeMjs(tmpMj + 1);
            let flag = false;
            if(Func.huPai(this)){
                flag = true;
            }
            this.addMjs(tmpMj - 1);
            this.addMjs(tmpMj);
            this.addMjs(tmpMj + 1);
            return flag;
        }
        return false;
    }
    /**
     * 清一色
     * @returns {boolean}
     */
    isQingYiSe() {
        let types = this.getHS();
        if(types.length !== 1){
            return false;
        }
        let shouType = types[0] + 1;
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
    }
    /**
     * 是否碰碰胡
     */
    isPengPengHu() {
        if(this.isGGD()){
            return false;
        }
        let sum = 0;
        for(let type = 0; type < 3; type++){
            for(let numberIdx = 0; numberIdx < 9; numberIdx++){
                let mjId = (type + 1) * 10 + numberIdx + 1;
                if(mjId != this.JP) {
                    let count = this.mjs[type][numberIdx];
                    if (count == 3) {
                        sum++;
                    }
                }
            }
        }
        sum += Object.keys(this.peng_mjs).length;
        sum += Object.keys(this.gang_mjs).length;
        if(sum == 4){
            return true;
        }
        return false;
    }

    /**
     * 碰碰胡是否全是 258
     * @returns {boolean}
     */
    isQ258_PPH(){
        if(!this.owner.owner.opts.JD19){
            return false;
        }
        let list = this.mjList();
        for(let mjId in list){
            if(!this.is258(mjId)){
                return false;
            }
        }
        for(let mjId in this.peng_mjs){
            if(!this.is258(mjId)){
                return false;
            }
        }
        for(let mjId in this.gang_mjs){
            if(!this.is258(mjId)){
                return false;
            }
        }
        return true;
    }
    /**
     * 豪华七小对有多少杠牌
     */
    getDuiGang() {
        let sum = 0;
        for(let type = 0; type < 3; type++){
            for(let numberIdx = 0; numberIdx < 9; numberIdx++){
                let count = this.mjs[type][numberIdx];
                if(count == 4){
                    sum++;
                }
            }
        }
        return sum;
    }

    /**
     * 获取最佳的听牌
     */
    getBestTings() {
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
    }

    /**
     * 优先出定缺的牌
     */
    getDQCards(){
        if(this.owner.dqType === -1){
            return null;
        }
        let cards = [];
        let iType = this.owner.dqType - 1;
        for(let iNumber = 0; iNumber < 9; iNumber++){
            let len = this.mjs[iType][iNumber];
            for(let i = 0; i < len; i++){
                cards.push((iType + 1) * 10 + iNumber + 1);
            }
        }
        return CommFuc.getRandomValue(cards);
    }
    /**
     * 通过简单的AI算法获取出牌的card
     * @returns {*}
     */
    getBestCard(){
        let dqCard = this.getDQCards();
        if(dqCard){
            return dqCard;
        }
        let tingCard = this.getBestTings();
        if(tingCard){
            return tingCard;
        }
        let list = [];
        let info = this.getBestHS(1);
        let hs = info.type;
        let mjTypes = this.mjs[hs];
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
        return CommFuc.getRandomValue(list);
    }

    /**
     * 是否有定缺的牌
     */
    isHaveDQCard(){
        if(this.owner.dqType === -1) return false;
        let dqMjs = this.mjs[this.owner.dqType - 1];
        for(let iNumber = 0; iNumber < 9; iNumber++){
            let count = dqMjs[iNumber];
            if(count > 0)
                return true;
        }
        return false;
    }


}

class XZPlayer extends Player{
    constructor(owner, index){
        super(owner, index);
        this.actionTimer = {};                      // 动作计时{action: stamp: duration: users:}
        this.huNum = 0;                             // 胡牌的次数
        this.handCards = new HandCards(this);       // 手牌信息
        this.startReset();
    }

    startReset() {
        this.ready = false;                         // 玩家是否就绪
        this.chiState = null;                       // 吃的状态
        this.gangState = null;                      // 杠的状态
        this.pengState = null;                      // 碰的状态
        this.huState = null;                        // 胡的状态
        this.handCards.reset();                     // 重置卡牌数据

        this.queuedPackets = [];                // 数据包
        this.reqExit = false;                   // 客户端主动退出
        this.scheJob = null;                    // 限时任务
        this.autoFun = null;                    // 自动函数
        this.aotuParam = [];                    // 自动参数
        this.gangFlag = false;                  // 当前动作是否为杠牌标记，用于判断杠上花
        this.passHuIndex = 0;                   // 抢杠胡哪一家的牌标记 为0没有抢杠胡

        this.task = {};                         // 玩家身上的挂起任务
        this.chiIdx = 0;                        // 吃牌的数组
        this.gangCard = 0;                      // 杠的牌
        this.autoNum = 0;                       // 自动出牌次数
        this.isT = false;                       // 是否托管
        this.destroyState = Enum.DestroyState.NONE; // 解散房间选择的状态

        this.dqType = -1;                       // 定缺类型 -1表示没有定缺 012分别表示筒条万
        this.isHu = false;                      // 是否胡牌
        this.passHu = false;                    // 过手胡标记
        this.huMult = 0;                        // 胡牌的番数
        this.roundBean = 0;
        this.windAndRain = 0;                   // 刮风下雨产生的金豆输赢
        this.giveUpExit = false;                // 玩家是否中途离开
        this.dqRecommend = -1;                  // 推荐定缺
        this.haveTing = false;                  // 是否有听
        this.preGangType = 0;                   // 上一个杠牌类型 0表示什么都没有
        this.dghFlag = false;                   // 点杠花标记
        this.GSSFlag = true;                    // 杠上炮标记
        this.huOrder = 0;                       // 1胡 2胡 3胡 0表示没胡
        this.paoIdx = 0;                        // 点炮的玩家
        this.returnMoney = false;               // 是否退税
        this.isOut = false;                     // 是否出局
    }

    /**
     * 结束一盘重置
     */
    endReset() {
        this.ready = false;
        this.playing = false;
        this.isT = false;

        this.huOrder = 0;                       // 1胡 2胡 3胡 0表示没胡
        this.paoIdx = 0;                        // 点炮的玩家
        this.returnMoney = false;               // 是否退税
        this.isOut = false;                     // 是否出局
        this.dqType = -1;                       // 定缺类型 -1表示没有定缺 012分别表示筒条万
        this.handCards.hszInfo = {self:[],swap:[],swapIdx:0,status:0};                      // 换三张
    }

    /**
     * 初始化
     * @param data
     * @param wsConn
     */
    init(data, wsConn){
        super.init(data, wsConn);
        this.luck = data.luck.xzmj || 50;
    }

    /**
     * 获取数据
     * @returns {{uid: *, name, headIcon: string, bean: (*|number), ip: null, ready: *, score: *, roundScore: *, index: *}}
     */
    getInfo() {
        let data = super.getInfo();
        // 游戏内信息
        data.handCards = this.clientCalcHandCardDelHuMJ();
        data.handCardsNumber = this.handCards.getTotalCount();
        data.cardNum   = Object.keys(data.handCards).length;
        data.playedCards = this.handCards.played;
        data.chiCards  = this.handCards.getChiMj();
        data.pengCards = this.handCards.getPengMj(true);
        data.gangCards = this.handCards.getGangMj(true);
        data.existOtherHangup = false;
        data.lastCard  = this.handCards.lastMj;
        data.huCard    = this.handCards.huMj;
        data.hangupTasks = this.task;
        data.isT = this.isT;
        data.hszStatus = this.handCards.hszInfo.status;      // 换三张状态请求状态 0还未请求 换哪张张 1已经请求了换哪三张牌
        data.hszOutCards = data.hszStatus === 0 ? [] : this.handCards.hszInfo.self;      // 换三张即将被换出去的牌 没换出去[]
        data.dqType = this.dqType;
        data.hszRecommend = this.handCards.hszInfo.self;    // 推荐的牌
        data.dqRecommend = this.dqRecommend;                // 推荐定缺
        data.haveTing = this.haveTing;
        data.huOrder = this.huOrder;
        data.paoIdx = this.paoIdx;
        data.goOut = this.isGoOut();
        return data;
    }

    /**
     * 计算是够出局
     * @returns {boolean}
     */
    isGoOut(){
        return this.isOut;
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
            data.handCards = this.handCards.mjList();                   // 牌组信息
            data.pengMj = this.handCards.getPengMj(true);         // 碰牌信息
            data.gangMj = this.handCards.getGangMj(true);         // 杠牌信息
            data.chiMj = this.handCards.getChiMj();                     // 吃牌信息
            data.words = this.genWords();
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
     * 更新货币
     */
    updateCoin(id, num, eventId) {
        super.updateCoin(id, num, eventId);
        if(id === 1 && this.bean <= 0){
            this.owner.broadOut(this);
            this.isOut = true;
            ERROR("this.isOut true");
        }
    }

    /**
     * 获取结算界面的信息(在游戏里面)
     */
    getOverInfo(){
        let data = {};
        data.handCards = this.clientCalcHandCardDelHuMJ();           // 牌组信息
        data.showStatus = this.clientShowStatus();                   // 没有胡牌的情况下显示的记录
        data.huCard = this.handCards.huMj;                           // 胡牌的麻将
        data.huOrder = this.huOrder;                                 // 1胡 2胡 3胡 0表示没胡
        data.paoIdx = this.paoIdx;                                   // 点炮的玩家
        return data;
    }

    /**
     * 删除huMJ后
     * @returns {Array}
     */
    clientCalcHandCardDelHuMJ(){
        let list = this.handCards.mjList();
        let huMj = this.handCards.huMj;
        if(list[huMj] > 0){
            list[huMj]--;
        }
        return list;
    }

    /**
     * 计算客户端显示的状态
     * @returns {number}
     */
    clientShowStatus(){
        if(this.isHu){
            return Enum.SHOWSTATUS.HU;
        }
        this.handCards.calcCJ();
        if(Object.keys(this.handCards.cJtings).length === 0){
            if(this.returnMoney){
                return Enum.SHOWSTATUS.TUI_SHUI;
            }else{
                if(!this.isGoOut()){
                    return Enum.SHOWSTATUS.NO_TING;
                }else {
                    return Enum.SHOWSTATUS.OUT;
                }
            }
        }else{
            return Enum.SHOWSTATUS.TING;
        }
    }
    /**
     * 生成文字描述
     */
    genWords () {
        let str = "";
        return str;
    }
    /**
     * 设置手牌
     * @param cards
     */
    setHandCards(cards) {
        this.startReset();
        this.handCards.init(cards);
        this.sendMsg(CSProto.ProtoID.GAME_CLIENT_INIT_CARD_MJ, {playStatus: this.owner.state, handCards : this.handCards.mjList()});
    }
    /**
     * 生成战报
     * @param roomId
     * @param time
     * @returns {{uid: *, score: *, name, headIcon: (string|*), index: *}}
     */
    buildReport(roomId) {
        return {
            uid:this.uid,
            name:this.name,
            headPic:this.headPic,
            index:this.index
        };
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
     * 玩家战绩
     * @returns {{}}
     */
    getPlayerReportInfo(){
        let data = {};
        data.roundBean = this.roundBean;
        data.name = this.name;
        data.uid = this.uid;
        return data
    }
}


exports.Player = XZPlayer;
