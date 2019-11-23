// 房间环境配置
// subType = 2;
// opts = {wildCard:true};

// function genCard(){
//     let originCards = [];
//     // 黑红梅方
//     for (let iType = 1; iType <= 4; ++iType) {
//         for(let iNumber = 3; iNumber <= 13; iNumber++){
//             originCards.push(iType * 100 + iNumber);
//         }
//     }
//     // if(opts.wildCard) {
//     //     originCards.push(514);
//     //     originCards.push(614);
//     // }
//     let cLen = 0;
//     let playNum = 3;
//     if(subType == 1){
//         originCards.push(102);          // 黑桃2
//         originCards.push(201);          // 红桃A
//         originCards.push(301);          // 梅花A
//         originCards.push(401);          // 方块A
//         cLen = 16;
//     }else if(subType == 2){             // 黑红梅方 A和2全部加上
//         for (let iType = 1; iType <= 4; ++iType) {
//             for(let iNumber = 1; iNumber <= 2; iNumber++){
//                 originCards.push(iType * 100 + iNumber);
//             }
//         }
//         cLen = 13;
//         playNum = 4;
//     }
//     let playerCards = [];
//     for(let playerIndex = 0; playerIndex < playNum; playerIndex++){
//         playerCards[playerIndex] = [];
//         for(let cardIdx = 0; cardIdx < cLen; cardIdx++){
//             let iRandom = Math.floor(Math.random() * originCards.length);
//             let card = originCards[iRandom];
//             originCards.splice(iRandom, 1);
//             playerCards[playerIndex].push(card);
//         }
//     }
//     return {playerCards, originCards};
// }

/* --------------------------------------------------- AI 机器人走牌-----------------------------------------------*/
// AI入口
let CommFuc     = require("../../../util/CommonFuc.js");
let Enum        = require("./Enum.js");


class AI {
    /**
     * 构造函数
     * @param owner
     */
    constructor(owner){
        this.owner = owner;
    }

    cardsConv(cards) {
        let cpCards = CommFuc.copyArray(cards);
        let cardList = CommFuc.oneDimensionalArray(13, 0);
        for (let idx in cpCards) {
            let cardNum = cpCards[idx] % 100 - 1;
            cardList[cardNum]++;
        }
        return cardList;
    }

    /**
     * 获取所有组合
     * @param set
     * @returns {Array}
     */
    getAllGroup(set) {
        let t = [];
        let four = set.four;
        let three = set.three;
        let two = set.two;
        let bigSet = [];
        for (let idx in four) {
            let data = {card: four[idx], num: 4};
            bigSet.push(data);
        }
        for (let idx in three) {
            let data = {card: three[idx], num: 3};
            bigSet.push(data);
        }
        for (let idx in two) {
            let data = {card: two[idx], num: 2};
            bigSet.push(data);
        }
        for (let idx in bigSet) {
            t.push([+idx]);
        }
        let bigLen = bigSet.length;
        for (let loop = 0; loop < bigLen; loop++) {
            for (let fAdd = 0; fAdd < bigLen - loop - 1; fAdd++) {
                let cont = [], subStart = loop;
                cont.push(loop);
                for (let i = loop + 1; i < loop + 1 + fAdd; i++) {
                    cont.push(i);
                }
                for (let j = subStart + fAdd + 1; j < bigLen; j++) {
                    let tt = CommFuc.copyArray(cont);
                    tt.push(j);
                    t.push(tt);
                }
            }
        }
        // 去掉重复牌的数组
        let newT = [];
        let tLen = t.length;
        for (let idx = 0; idx < tLen; idx++) {
            let arr = t[idx];
            let len = arr.length;
            if (len == 1) {
                newT.push(arr);
            } else {
                let con = [];
                let join = true;
                for (let i in arr) {
                    let index = arr[i];
                    let card = bigSet[index].card;
                    if (con.indexOf(card) == -1) {
                        con.push(card);
                    } else {
                        join = false;
                    }
                }
                if (join) {
                    newT.push(arr)
                }
            }
        }
        let ss = [];
        for (let idx in newT) {
            let arr = newT[idx];
            ss[idx] = [];
            for (let i in arr) {
                let iSet = arr[i];
                ss[idx].push(bigSet[iSet]);
            }
        }
        ss.push([]);
        return ss;
    }

    /**
     * 单牌集合增加
     * @param danSet
     * @param CurTypes
     */
    addDanSet(danSet, CurTypes){
        for(let danIdx = 0; danIdx < danSet.length; danIdx++){
            CurTypes.dan.push({start: danSet[danIdx] == 14 ? 1 : danSet[danIdx], num: 1});
        }
    }
    // 全部拆除
    totalChai(curTypes, allTypes){
        let CCurTypes = clone(curTypes);
        for(let sIdx = curTypes.shun.length - 1; sIdx >= 0; sIdx--){
            let shunNum = CCurTypes.shun[sIdx].num;
            let start = CCurTypes.shun[sIdx].start;
            let danSet = [];
            for(let i = 0; i < shunNum; i++){
                danSet.push(start + i);
            }
            CCurTypes.shun.splice(sIdx, 1);                          // 情况一全拆
            this.addDanSet(danSet, CCurTypes);
        }
        CCurTypes.shun = [];
        allTypes.push(CCurTypes);
    }

    /**
     * 部分拆除
     * @param curTypes
     * @param allTypes
     */
    partChai(curTypes, allTypes, chaiIdx){
        let CCurTypes = clone(curTypes);
        let chaiShun =  CCurTypes.shun[chaiIdx];
        if(!chaiShun) return;
        let start = chaiShun.start;
        let shunNum = chaiShun.num;
        if(shunNum <= 5) return;
        let chaiNum = shunNum - 5 + 1;          // 拆解次数
        if(chaiNum <= 0)return;

        let danSet = [];
        for(let i = 0; i < shunNum; i++){
            danSet.push(start + i);
        }

        for(let chai = 0; chai < chaiNum; chai++){
            let CCCurTypes = clone(curTypes);
            let cDanSet = clone(danSet);
            let tempShun = {start:chai + start, num:5};  // 加入的顺 固定
            CCCurTypes.shun[chaiIdx]  = tempShun;
            for(let minShun = 0; minShun < 5; minShun++){
                let shunCard = chai + start + minShun;
                let pos = cDanSet.indexOf(shunCard);
                if(pos >= 0){
                    cDanSet.splice(pos, 1);
                }else{
                    console.log("拆牌过程中出错了-------------");
                }
            }
            this.addDanSet(cDanSet, CCCurTypes);
            allTypes.push(CCCurTypes);
        }
    }



    // 拆解牌 如: 3,4,5,6,7,8,9,10 拆解成 顺:3,4,5,6,7 单:8,9,10  顺:4,5,6,7,8 单:3,8,9 依次类推
    DissCards(curTypes, allTypes){
        // 情况一: 全拆
        if(curTypes.shun.length > 2){           // 不拆三个顺子以上的牌
                                                // console.log("卧槽");
            return;
        }
        if(curTypes.shun.length >= 0 && this.owner.preShape != null){
            this.totalChai(curTypes, allTypes);             //  情况一全部拆除
            this.partChai(curTypes, allTypes, 0);   //  拆除第一种
            this.partChai(curTypes, allTypes, 1);   //  拆除第二个顺子
        }
        // 情况2  留一个 拆一个 这样拆 如: 3,4,5,6,7,8,9,10 拆解成 顺:3,4,5,6,7 单:8,9,10  顺:4,5,6,7,8 单:3,8,9 依次类推


    }
    /**
     * 计算权值
     * @param tPai
     * @param cards
     * @returns {Array}
     */
    calcValue(tPai, cards) {
        let allTypes = [];
        for (let tIdx in tPai) {
            let curTypes = {dan: [], dui: [], san: [], four: [], shun: []};
            if (tIdx == 0) {
                let tt = 0;
            }
            let cpCards = CommFuc.copyArray(cards);
            let list = this.cardsConv(cpCards);
            for (let i in tPai[tIdx]) {
                let card = tPai[tIdx][i].card;
                let num = tPai[tIdx][i].num;
                if (num == 4) {
                    curTypes.four.push({start: card == 14 ? 1 : card, num: 1});
                } else if (num == 3) {
                    curTypes.san.push({start: card == 14 ? 1 : card, num: 1});
                } else if (num == 2) {
                    curTypes.dui.push({start: card == 14 ? 1 : card, num: 1});
                } else {
                    //console.log("错误，不能提单牌？");
                }
                list[card - 1] -= num;
                if (list[card - 1] < 0) {
                    //console.log("error ... calcValue");
                }
            }
            list[13] = list[0];
            let shun = [];
            for (let idx = 0; idx < 14; idx++) {      // A到A 判断顺子
                let startIdx = 0;
                if (list[idx] > 0) {
                    startIdx = idx;
                    let loop = 0;
                    while (list[startIdx + loop] > 0) {
                        loop++;
                        if (loop == 5) {
                            shun.push({start: startIdx + 1, num: 5});
                            for (let i = 0; i < 5; i++) {
                                list[startIdx + i]--;
                                if(startIdx + i == 0){
                                    list[13]--;
                                    list[0]--;
                                }else if(startIdx + i == 13){
                                    list[0]--;
                                    list[13]--;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            let sLen = shun.length;
            if (sLen > 0) {
                for (let idx = 0; idx < 14; idx++) {
                    if (list[idx] > 0) {
                        for (let sIdx in shun) {
                            let start = shun[sIdx].start;
                            let num = shun[sIdx].num;
                            if (idx + 1 == start + num && list[idx] > 0) {
                                shun[sIdx].num++;
                                list[idx]--;
                                if(idx == 0){
                                    list[13]--;
                                    list[0]--;
                                }else if(idx == 13){
                                    list[0]--;
                                    list[13]--;
                                }
                            }
                        }
                    }
                }
                if (shun.length == 2) {
                    if (shun[0].start + shun[0].num == shun[1].start) {
                        if(shun[0].start === 1 && shun[0].num + shun[1].num === 14){            // 特殊牌型判断 蛇尾互咬了
                            shun[1].num = 8;
                        }
                        let data = {start: shun[0].start, num: shun[0].num + shun[1].num}
                        shun = [];
                        shun.push(data);
                    }
                }
                for (let sIdx2 in shun) {
                    curTypes.shun.push(shun[sIdx2]);
                }
            }
            for (let idx = 1; idx < 14; idx++) {
                if (list[idx] == 1) {
                    curTypes.dan.push({start: idx + 1 == 14 ? 1 : idx + 1, num: 1});
                } else if (list[idx] == 2) {
                    curTypes.dui.push({start: idx + 1 == 14 ? 1 : idx + 1, num: 1});
                } else if (list[idx] == 3) {
                    curTypes.san.push({start: idx + 1 == 14 ? 1 : idx + 1, num: 1});
                } else if (list[idx] == 4) {
                    curTypes.four.push({start: idx + 1 == 14 ? 1 : idx + 1, num: 1});
                }
            }
            allTypes.push(curTypes);
            // 拆解顺子 使他可以被带出来
            this.DissCards(curTypes, allTypes);
        }
        return allTypes;
    }



    subGroup(cards) {
        let list = this.cardsConv(cards);
        let set = {four: [], three: [], two: []};
        for (let idx = 0; idx < 13; idx++) {
            if (list[idx] == 4) {
                set.four.push(idx + 1);
                set.three.push(idx + 1);
                set.two.push(idx + 1);
            } else if (list[idx] == 3) {
                set.three.push(idx + 1);
                set.two.push(idx + 1);
            } else if (list[idx] == 2) {
                set.two.push(idx + 1);
            }
        }
        let tPai = this.getAllGroup(set);
        let allType = this.calcValue(tPai, cards);
        return allType;
    }


    /**
     * 验证函数
     */
    calcNum(oneType) {
        let num = 0;
        for (let idx in oneType.dan) {
            num += oneType.dan[idx].num * 1;
        }
        for (let idx in oneType.dui) {
            num += oneType.dui[idx].num * 2;
        }
        for (let idx in oneType.san) {
            num += oneType.san[idx].num * 3;
        }
        for (let idx in oneType.four) {
            if (oneType.four[idx].start < 500) {
                num += oneType.four[idx].num * 4;
            } else {
                num += oneType.four[idx].num * 2;
            }
        }
        for (let idx in oneType.shun) {
            num += oneType.shun[idx].num * 1;
        }
        return num;
    }

    typeSort(tbl) {
        for (let i = 0; i < tbl.length; i++) {
            let k = i;
            for (let j = i + 1; j < tbl.length; ++j) {
                if (tbl[k].start > tbl[j].start)
                    k = j;
            }
            if (k != i) {
                let iTmp = tbl[k];
                tbl[k] = tbl[i];
                tbl[i] = iTmp;
            }
        }
    }

    reLian(originArray, type) {
        let array = clone(originArray);
        let newArray = [];
        this.typeSort(array);
        if (type == 2) {
            if (array.length < 2) {
                return clone(array);
            }
        } else if (type == 3) {
            if (array.length < 2) {
                return clone(array);
            }
        } else {
            return;
        }

        if(array.length === 2 && array[1].start === 2 && array[0].start === 1){
            newArray.push({start:1, num:2});
            return newArray;
        }

        let minL = 2;
        let maxI = 13;
        if (array[0].start == 1) {
            array.splice(0, 1);
            array.push({start: 14, num: 1});
        }
        let aLen = array.length;
        for (let idx = 0; idx < aLen;) {
            let oneType = array[idx];
            let count = 1;
            if (oneType.start >= 1 && oneType.start <= maxI) {
                let find = true;
                for (let loop = 1; loop < aLen; loop++) {
                    if (array[idx + loop]) {
                        if (array[idx + loop].start != oneType.start + loop) {
                            find = false;
                            break;
                        } else {
                            count++;
                        }
                    } else {
                        break;
                    }
                }
                if (count >= minL) {
                    oneType.num = count;
                } else {
                    count = 1;
                }
            }
            newArray.push(clone(oneType));
            idx += count;
        }
        this.typeSort(newArray);
        return newArray;
    }


    /**
     * 权值排序
     * @param array
     */
    valueSort(tbl) {
        for (let i = 0; i < tbl.length; i++) {
            let k = i;
            for (let j = i + 1; j < tbl.length; ++j) {
                if (tbl[k].value > tbl[j].value)
                    k = j;
            }
            if (k != i) {
                let iTmp = tbl[k];
                tbl[k] = tbl[i];
                tbl[i] = iTmp;
            }
        }
    }

    getDaiSet(oneType) {
        let daiSet = [];
        let danNum = oneType.dan.length;
        let duiNum = oneType.dui.length;
        for (let danIdx = 0; danIdx < danNum; danIdx++) {
            let value = 0;
            let card = oneType.dan[danIdx].start;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.dan;
            value += typeScore;
            daiSet.push({type: 1, card: card, value: value, use: false, ld: 1});
        }
        for (let duiIdx = 0; duiIdx < duiNum; duiIdx++) {
            let LD = oneType.dui[duiIdx].num;
            let value = 0;
            let card = oneType.dui[duiIdx].start;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.dui[LD];
            value += typeScore;
            daiSet.push({type: 2, card: card, value: value, use: false, ld: LD});
        }
        this.valueSort(daiSet);
        return daiSet;
    }

    /**
     * 重组三代1 连
     * @param daiSet
     * @param finaCards
     * @param card
     * @param LD
     * @param type
     */
    compSan(daiSet, finaCards, card, LD, type) {
        let daiArray = [];
        let uses = [];
        let dai = false;
        let daiCount = type === 1 ? LD * 2 : LD;
        for (let sIdx = 0; sIdx < daiCount; sIdx++) {
            dai = false;
            for (let daiIdx in daiSet) {
                if (daiSet[daiIdx].type == type && daiSet[daiIdx].ld == 1) {
                    if (daiSet[daiIdx].use == false && uses.indexOf(daiIdx) == -1) {
                        let daiCard = daiSet[daiIdx].card;
                        if (daiCard != card) {
                            dai = true;
                            if (type == 1) {
                                daiArray.push(daiCard);
                            } else if (type == 2) {
                                daiArray.push(daiCard);
                                daiArray.push(daiCard);
                            }
                            uses.push(daiIdx);
                            break;
                        }
                    }
                }
            }
        }
        if (!dai) {
            finaCards.san.push({start: card, ld: LD, dai: []});
        } else {
            finaCards.san.push({start: card, ld: LD, dai: daiArray});
            for (let dd in uses) {
                let index = uses[dd];
                daiSet[index].use = true;
            }
        }
    }

    compSanOne(daiSet, finaCards, card) {
        let daiFlag = false;
        let daiArray = [];
        if (daiSet.length > 0) {
            for (let idx in daiSet) {
                let use = daiSet[idx].use;
                let ld = daiSet[idx].ld;
                if (use == false && ld == 1) {
                    let type = daiSet[idx].type;
                    let daiCard = daiSet[idx].card;
                    if(daiCard == card){
                        continue;
                    }
                    if (type == 2) {
                        daiArray = [];
                        daiArray.push(daiCard);
                        daiArray.push(daiCard);
                        daiSet[idx].use = true;
                        daiFlag = true;
                    } else {
                        daiArray.push(daiCard);
                        daiSet[idx].zbUse = true;   // 准备使用
                    }
                    if (daiArray.length >= 2) {
                        finaCards.san.push({start: card, ld: 1, dai: daiArray});
                        if(!daiFlag) {
                            for (let idx in daiSet) {   // 将准备使用的牌设置为已经使用
                                if (daiSet[idx].zbUse) {
                                    daiSet[idx].use = true;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            if (!daiFlag) {
                finaCards.san.push({start: card, ld: 1, dai: []});
            }
        } else {
            finaCards.san.push({start: card, ld: 1, dai: []});
        }
    }

    getFinaType(oneType) {
        let danNum = oneType.dan.length;
        let duiNum = oneType.dui.length;
        let sanNum = oneType.san.length;
        let fourNum = oneType.four.length;
        let shunNum = oneType.shun.length;
        let finaCards = {dan: [], dui: [], san: [], four: [], shun: [], value: 0, shou: 0};             // 最终的牌型
        let daiSet = this.getDaiSet(oneType);
        if (sanNum > 0) {                 // 根据权职 计算到底是三代一 还是三代2 三代哪一张等信息
            for (let sanIdx = 0; sanIdx < sanNum; sanIdx++) {
                let LD = oneType.san[sanIdx].num;
                let card = oneType.san[sanIdx].start;
                if (LD == 1) {
                    this.compSanOne(daiSet, finaCards, card);
                } else {
                    if (LD * 2 <= danNum) {
                        this.compSan(daiSet, finaCards, card, LD, 1);
                    } else if (LD <= duiNum) {
                        this.compSan(daiSet, finaCards, card, LD, 2);
                    } else {
                        finaCards.san.push({start: card, ld: LD, dai: []});
                    }
                }
            }
        }
        for (let idx in daiSet) {
            if (daiSet[idx].use == false) {
                if (daiSet[idx].type == 1) {
                    let card = daiSet[idx].card;
                    finaCards.dan.push(card);
                } else if (daiSet[idx].type == 2) {
                    let card = daiSet[idx].card;
                    let ld = daiSet[idx].ld;
                    finaCards.dui.push({start: card, ld: ld});
                }
            }
        }
        for (let fIdx = 0; fIdx < fourNum; fIdx++) {
            let start = oneType.four[fIdx].start;
            let num = oneType.four[fIdx].num;
            finaCards.four.push({start: start, ld: num});
        }
        for (let sIdx = 0; sIdx < shunNum; sIdx++) {
            let start = oneType.shun[sIdx].start;
            let num = oneType.shun[sIdx].num;
            finaCards.shun.push({start: start, ld: num});
        }
        return finaCards;
    }

    /**
     * 验证函数
     * @param fina
     * @returns {number}
     */
    calcFinaNum(fina) {
        let num = 0;
        num += fina.dan.length;
        for (let idx in fina.dui) {
            num += fina.dui[idx].ld * 2;
        }
        for (let idx in fina.san) {
            num += fina.san[idx].ld * 3;
            num += fina.san[idx].dai.length;
        }
        for (let idx in fina.four) {
            if (fina.four[idx].start < 500) {
                num += fina.four[idx].ld * 4;
            } else {
                num += fina.four[idx].ld * 2;
            }
        }
        for (let idx in fina.shun) {
            num += fina.shun[idx].ld * 1;
        }
        return num;
    }


    /**
     * 计算最终的分值
     * @param fina
     */
    calcFinaScore(fina) {
        let shou = 0, value = 0;
        for (let idx in fina.dan) {
            let card = fina.dan[idx];
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.dan;
            value += typeScore;
            shou++;
        }
        for (let idx in fina.dui) {
            let start = fina.dui[idx].start;
            let ld = fina.dui[idx].ld;
            let card = start + ld - 1;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.dui[ld];
            value += typeScore;
            shou++;
        }
        for (let idx in fina.san) {
            let start = fina.san[idx].start;
            let ld = fina.san[idx].ld;
            let card = start + ld - 1;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.san[ld];
            value += typeScore;
            shou++;
        }
        for (let idx in fina.four) {
            let card = fina.four[idx].start;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.four;
            value += typeScore;
            shou++;
        }
        for (let idx in fina.shun) {
            let start = fina.shun[idx].start;
            let ld = fina.shun[idx].ld;
            let card = start + ld - 1;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.shun[ld];
            value += typeScore;
            shou++;
        }
        if(shou === 2){
            let i = 10;
        }
        fina.shou = shou;
        fina.value = value;
    }


    getFinaAllType(allTypes, cards) {
        let allFina = [];
        for (let idx in allTypes) {
            let oneType = allTypes[idx];
            // 检测函数
            // let maxNum = calcNum(oneType);
            // if (maxNum !== cards.length) {
            //     console.log("errror -- 1-- " + idx);
            //     console.log(JSON.stringify(cards));
            //     console.log(JSON.stringify(oneType));
            // }
            oneType.dui = this.reLian(oneType.dui, 2);
            oneType.san = this.reLian(oneType.san, 3);
            // console.log(JSON.stringify(oneType));
            // 检测函数
            // let maxNum = calcNum(oneType);
            // if (maxNum !== cards.length) {
            //     console.log("errror -- 2-- " + idx);
            //     console.log(JSON.stringify(cards));
            //     console.log(JSON.stringify(oneType));
            // }
            let fina = this.getFinaType(oneType);
            // // 检测函数
            // let maxNum = this.calcFinaNum(fina);
            // if (maxNum !== cards.length) {
            //     console.log("error ---3--" + idx);
            //     console.log(JSON.stringify(cards));
            //     console.log(JSON.stringify(fina));
            // }
            // console.log(JSON.stringify(fina));
            this.calcFinaScore(fina);
            allFina.push(fina);
        }
        return allFina;
    }

    /**
     * 获取最优方案 1069 0691 0365 788 219724
     */
    getOptType(allTypes, cards) {
        let minShou = 999;
        let maxValue = 0;
        let optSets = [];
        for (let idx in allTypes) {
            let oneType = allTypes[idx];
            if (oneType.shou < minShou) {
                minShou = oneType.shou;
                optSets = [];
                optSets.push(idx);
            } else if (oneType.shou == minShou) {
                optSets.push(idx);
            }
        }
        let finaSets = [];
        for (let idx in optSets) {
            let index = optSets[idx];
            let oneType = allTypes[index];
            if (oneType.value > maxValue) {
                maxValue = oneType.value;
                finaSets = [];
                finaSets.push(index);
            } else if (oneType.value == maxValue) {
                finaSets.push(index);
            }
        }
        let allMaxValue = 0;
        let allMaxIdx = 0;
        for (let idx in allTypes) {
            let oneType = allTypes[idx];
            if (oneType.value > allMaxValue) {
                allMaxValue = oneType.value;
                allMaxIdx = idx;
            }
        }
        if (finaSets.length == 0) {
            console.log("error ---4----" + JSON.stringify(cards));
        }
        let rIdx = Math.floor(Math.random() * finaSets.length);
        let tt = finaSets[rIdx];
        // let maxNum = calcFinaNum(allTypes[rIdx]);
        // if(maxNum !== cards.length){
        //     console.log("------error----- 5");
        // }
        if (allTypes[tt].value + Enum.typeValue.four > allTypes[allMaxIdx].value) {
            return allTypes[tt];
        } else {
            return allTypes[allMaxIdx];
        }
    }

    /**
     * 上一次家的出牌转化为通用牌型
     * @param cards
     * @param outInfo
     * @returns {{type: string, subType: (number|*), num: number, power: number, cards: Array}}
     */
    outToShape(cards, outInfo) {
        let mainArray = outInfo.mainArray;
        let daiArray = outInfo.daiArray;
        let realCards = [];
        let mNum = 0;
        let realPower = 0;
        let subType = outInfo.subType || Enum.subShape.NONE;
        let type = mainArray.type;
        if (mainArray) {
            mNum = mainArray.num;
            let start = mainArray.start;
            if (type == "dan") {
                type = Enum.shape.DAN;
                realPower = this.getPowerByRealPai(start);
                let paiInfo = this.getPaiCount(cards, start, 1);
                realCards = paiInfo;
            } else if (type == "dui") {
                type = Enum.shape.DUI;
                for (let loop = 0; loop < mNum; loop++) {
                    let card = start + loop;
                    if (card == 14) {
                        card = 1
                    }
                    if (card == 15) {
                        card = 2
                    }
                    let paiInfo = this.getPaiCount(cards, card, 2);
                    realCards.push.apply(realCards, paiInfo);
                }
                let maxStart = start + mNum - 1;
                if (maxStart == 14) {
                    maxStart = 1;
                } else if (maxStart == 15) {
                    maxStart = 2;
                }
                realPower = this.getPowerByRealPai(maxStart);
            } else if (type == "san") {
                type = Enum.shape.SAN_YI;
                for (let loop = 0; loop < mNum; loop++) {
                    let card = start + loop;
                    if (card == 14) {
                        card = 1
                    }
                    if (card == 15) {
                        card = 2
                    }
                    let paiInfo = this.getPaiCount(cards, card, 3);
                    realCards.push.apply(realCards, paiInfo);
                }
                let maxStart = start + mNum - 1;
                if (maxStart == 14) {
                    maxStart = 1;
                } else if (maxStart == 15) {
                    maxStart = 2;
                }
                realPower = this.getPowerByRealPai(maxStart);
                if (daiArray) {
                    for (let dIdx = 0; dIdx < daiArray.length; dIdx++) {
                        let dStart = daiArray[dIdx].start;
                        let dType = daiArray[dIdx].type;
                        if (dType == "dan") {
                            let paiInfo = this.getPaiCount(cards, dStart, 1);
                            realCards.push.apply(realCards, paiInfo);
                        } else if (dType == "dui") {
                            let paiInfo = this.getPaiCount(cards, dStart, 2);
                            realCards.push.apply(realCards, paiInfo);
                        }
                    }
                }
            } else if (type == "four") {
                type = Enum.shape.ZD;
                realPower = this.getPowerByRealPai(start);
                if (start > 500) {
                    realCards = [514, 614];
                    realPower = this.getPowerByRealPai(614);
                } else {
                    let paiInfo = this.getPaiCount(cards, start, 4);
                    realCards.push.apply(realCards, paiInfo);
                }
            } else if (type == "shun") {
                type = Enum.shape.SHUN;
                for (let loop = 0; loop < mNum; loop++) {
                    let card = start + loop;
                    if (card == 14) {
                        card = 1
                    }
                    if (card == 15) {
                        card = 2
                    }
                    let paiInfo = this.getPaiCount(cards, card, 1);
                    realCards.push.apply(realCards, paiInfo);
                }
                let maxStart = start + mNum - 1;
                if (maxStart == 14) {
                    maxStart = 1
                }
                if (maxStart == 15) {
                    maxStart = 2
                }
                realPower = this.getPowerByRealPai(maxStart);
            }
        } else {
            //console.log("没有主体牌");
        }
        let data = {type: type, subType: subType, num: mNum, power: realPower, cards: realCards};
        return data;
    }

    /**
     * 出最优的单排和对牌
     * @param oneType
     * @returns {*}
     */
    getOptDanDui(oneType) {
        let danNum = oneType.dan.length;
        let duiNum = oneType.dui.length;
        let min = 999;
        let minCards = [];
        let type = null;
        let maxDanPower = this.owner.getPaiMaxDan();
        let maxDuiPower = this.owner.getPaiMaxDui();
        let outDan = false;
        let outDui = false;
        if (danNum > 0) {
            for (let idx = 0; idx < danNum; idx++) {
                let start = oneType.dan[idx];
                let startPower = this.getPowerByRealPai(start);
                if (startPower < min) {
                    min = startPower;
                    minCards.push(start);
                    type = Enum.shape.DAN;
                }
                if (startPower >= maxDanPower && danNum !== 1) {          // 一定要出单牌
                    outDan = true;
                }
            }
        }
        if (outDan === false) {                          // 不一定要出单牌
            if (duiNum > 0) {
                for (let idx = 0; idx < duiNum; idx++) {
                    let start = oneType.dui[idx].start;
                    let ld = oneType.dui[idx].ld;
                    if (ld == 1) {
                        let startPower = this.getPowerByRealPai(start);
                        if (startPower < min) {
                            min = startPower;
                            minCards = [];
                            minCards.push(start, start);
                            type = Enum.shape.DUI;
                        }
                        if (startPower >= maxDuiPower && duiNum !== 1) {
                            outDui = true;
                        }
                    }
                }
                if (outDui) {
                    min = 999;
                    for (let idx = 0; idx < duiNum; idx++) {
                        let start = oneType.dui[idx].start;
                        let ld = oneType.dui[idx].ld;
                        if (ld == 1) {
                            let startPower = this.getPowerByRealPai(start);
                            if (startPower < min) {
                                min = startPower;
                                minCards = [];
                                minCards.push(start, start);
                                type = Enum.shape.DUI;
                            }
                        }
                    }
                }
            }
        }
        if (minCards.length > 0) {
            return {minCards: minCards, power: min, type: type, num: 1};
        } else {
            return null;
        }
    }


    /**
     * 最优出黑桃3
     * @param cards
     */
    out103(oneType, cards){
        if(cards.indexOf(103) >= 0){
            let powerCard = 0;
            let minCards = [];


            for (let idx in oneType.shun) {
                let ld = oneType.shun[idx].ld;
                let start = oneType.shun[idx].start;
                let find = false;
                for (let loop = 0; loop < ld; loop++) {
                    let card = start + loop;
                    if(card === 3){
                        find = true;
                        break;
                    }
                }
                if(find) {
                    for (let loop = 0; loop < ld; loop++) {
                        let card = start + loop;
                        if (card == 14) {
                            card = 1;
                        }
                        minCards.push(card);
                        if(loop === ld - 1){
                            powerCard = card;
                        }
                    }
                    return {minCards: minCards, power: this.getPowerByRealPai(powerCard), type: Enum.shape.SHUN, num: ld};
                }
            }

            for (let idx in oneType.san) {
                let ld = oneType.san[idx].ld;
                let start = oneType.san[idx].start;
                let dai = oneType.san[idx].dai;
                for (let loop = 0; loop < ld; loop++) {
                    let card = start + loop === 14 ? 1 : start + loop;
                    if (card === 3) {
                        for (let loop = 0; loop < ld; loop++) {
                            let card1 = start + loop === 14 ? 1 : start + loop;
                            minCards.push(card1);
                            minCards.push(card1);
                            minCards.push(card1);
                            if(loop === ld - 1){
                                powerCard = card1;
                            }
                        }
                        return {minCards: minCards, power: this.getPowerByRealPai(powerCard), type: Enum.shape.SAN_YI, num: ld, dai:dai};
                    }
                }
            }

            // 代牌含有 3
            for (let idx in oneType.san) {
                let ld = oneType.san[idx].ld;
                let start = oneType.san[idx].start;
                let dai = oneType.san[idx].dai;
                if(dai.indexOf(3) >= 0){
                    for (let loop = 0; loop < ld; loop++) {
                        let card1 = start + loop === 14 ? 1 : start + loop;
                        minCards.push(card1);
                        minCards.push(card1);
                        minCards.push(card1);
                        if(loop === ld - 1){
                            powerCard = card1;
                        }
                    }
                    return {minCards: minCards, power: this.getPowerByRealPai(powerCard), type: Enum.shape.SAN_YI, num: ld, dai:dai};
                }
            }


            for (let idx in oneType.dui) {
                let ld = oneType.dui[idx].ld;
                let start = oneType.dui[idx].start;
                for (let loop = 0; loop < ld; loop++) {
                    let card = start + loop === 14 ? 1 : start + loop;
                    if (card === 3) {
                        for (let loop = 0; loop < ld; loop++) {
                            let card1 = start + loop === 14 ? 1 : start + loop;
                            minCards.push(card1);
                            minCards.push(card1);
                            if(loop === ld - 1){
                                powerCard = card1;
                            }
                        }
                        return {minCards: minCards, power: this.getPowerByRealPai(powerCard), type: Enum.shape.DUI, num: ld};
                    }
                }
            }

            for (let idx in oneType.dan) {
                let card = oneType.dan[idx];
                if (card === 3) {
                    minCards.push(card);
                    return {minCards: minCards, power: this.getPowerByRealPai(3), type: Enum.shape.DAN, num: 1};
                }
            }

            // 炸弹103
            let boomNum = oneType.four.length;
            if (boomNum > 0) {
                for (let idx = 0; idx < boomNum; idx++) {
                    let card = oneType.four[idx].start;
                    if(card === 3){
                        minCards.push(card);
                        minCards.push(card);
                        minCards.push(card);
                        minCards.push(card);
                        return {minCards: minCards, power: this.getPowerByRealPai(3), num: 1, type: Enum.shape.ZD};
                    }
                }
            }
        }
        return null;
    }

    getOptDuiSanShun(oneType) {
        let min = 999;
        let minCards = [];
        let type = null;
        let ldNum = 0;
        let dai = null;
        for (let idx in oneType.dui) {
            let ld = oneType.dui[idx].ld;
            let start = oneType.dui[idx].start;
            let self = false;
            if(ld >= 2 && start === 1){
                self = true;
            }
            let startPower = this.getPowerByRealPai(start,self);
            if (ld >= 2) {
                if (startPower < min) {
                    min = startPower;
                    minCards = [];
                    for (let loop = 0; loop < ld; loop++) {
                        let card = start + loop;
                        if (card == 14) {
                            card = 1;
                        }
                        minCards.push(card);
                        minCards.push(card);
                    }
                    type = Enum.shape.DUI;
                    ldNum = ld;
                }
            }
        }
        for (let idx in oneType.san) {
            let ld = oneType.san[idx].ld;
            let start = oneType.san[idx].start;
            let self = false;
            if(ld >= 2 && start === 1){
                self = true;
            }
            let startPower = this.getPowerByRealPai(start,self);
            if (startPower < min) {
                min = startPower;
                minCards = [];
                for (let loop = 0; loop < ld; loop++) {
                    let card = start + loop;
                    if (card == 14) {
                        card = 1;
                    }
                    minCards.push(card);
                    minCards.push(card);
                    minCards.push(card);
                }
                dai = oneType.san[idx].dai;
                type = Enum.shape.SAN_YI;
                ldNum = ld;
                // minCards.push.apply(minCards, dai);
            }
        }
        for (let idx in oneType.shun) {
            let ld = oneType.shun[idx].ld;
            let start = oneType.shun[idx].start;
            if (start - 2 <= min) {
                min = start - 2;
                minCards = [];
                for (let loop = 0; loop < ld; loop++) {
                    let card = start + loop;
                    if (card == 14) {
                        card = 1;
                    }
                    minCards.push(card);
                }
                type = Enum.shape.SHUN;
                ldNum = ld;
            }
        }
        if (minCards.length > 0) {
            if (dai && type == Enum.shape.SAN_YI) {
                return {minCards: minCards, power: min, type: type, num: ldNum, dai: dai};
            } else {
                return {minCards: minCards, power: min, type: type, num: ldNum};
            }
        } else {
            return null;
        }
    }


    getOptBoom (oneType) {
        let boomNum = oneType.four.length;
        let min = 999;
        let minCards = [];
        if (boomNum > 0) {
            for (let idx = 0; idx < boomNum; idx++) {
                let start = oneType.four[idx].start;
                let startPower = this.getPowerByRealPai(start);
                if (startPower < min) {
                    min = startPower;
                    minCards = [];
                    if (start < 500) {
                        minCards.push(start);
                        minCards.push(start);
                        minCards.push(start);
                        minCards.push(start);
                    } else {
                        minCards.push(514);
                        minCards.push(614);
                    }
                }
            }
        }
        if (minCards.length > 0) {
            return {minCards: minCards, power: min, num: 1, type: Enum.shape.ZD};
        } else {
            return null;
        }
    }

    /**
     * 获取最优的出牌
     * @param oneType
     * @returns {*}
     */
    getOptCards (oneType,cards) {
        let out103 = this.out103(oneType, cards);
        let outDSS = this.getOptDuiSanShun(oneType);
        let outDD = this.getOptDanDui(oneType);
        if(out103){
            return out103;
        }
        if (outDSS && !outDD) {
            return outDSS;
        } else if (!outDSS && outDD) {
            return outDD;
        }else if(outDSS && outDD){
            if (outDD.power + 30 < outDSS.power) {
                return outDD;
            } else {
                return outDSS;
            }
        }
        let outBoom = this.getOptBoom(oneType);
        if (outBoom) {
            return outBoom;
        }
        console.log("error，请检查代码 是否错误");
    }

    /**
     * 获取真实的炸弹
     * @param pai
     * @returns {number}
     */
    getPowerByRealPai(pai, self = false) {
        let number = +pai;
        if (number == 1 && !self) {
            return 14;
        } else if (number == 2 && !self) {
            return 15;
        } else if (number == 514) {
            return 16;
        } else if (number == 614) {
            return 17;
        }
        return number;
    }


    /**
     * 获取牌
     * @param cards
     * @param pai
     * @param count
     * @returns {*}
     */
    getPaiCount (cards,pai,count) {
        let array = [];
        let num = 0;
        if(pai == 514){
            return [514];
        }else if(pai == 614){
            return [614];
        }
        for(let idx in cards){
            if(cards[idx] % 100 == pai && cards[idx] < 500){
                array.push(cards[idx]);
                num++;
                if(num == count){
                    return array;
                }
            }
        }
        return null;
    }

    /**
     * 获取代牌类型
     */
    getDaiType(dai){
        let len = dai.length;
        if(len === 0){
            return 0;
        }
        if(len === 1){
            return 1;
        }
        for(let i = 0; i < len; i++){
            let card1 = dai[i];
            for(let j = i+1; j < len; j++){
                let card2 = dai[j];
                if(card1 === card2){
                    return 2;
                }
            }
        }
        return 1;
    }

    /**
     * 重新计算power
     * @constructor
     */
    ReCalcPower(opts){
        let type = opts.type;
        let realPower = 0;
        let simCards = opts.minCards;
        if(type === Enum.shape.DAN || type === Enum.shape.ZD){
            realPower = this.getPowerByRealPai(simCards[0]);
        }else if(type === Enum.shape.SHUN){
            realPower = this.getPowerByRealPai(simCards[simCards.length - 1]);
        }else if(type === Enum.shape.DUI || type === Enum.shape.SAN_YI){
            if(simCards[0] === 1){
                realPower = this.getPowerByRealPai(simCards[simCards.length - 1], true);
            }else{
                realPower = this.getPowerByRealPai(simCards[simCards.length - 1]);
            }
        }
        return realPower;
    }
    /**
     * 转化为客户端需要的牌型
     * @param cards
     * @param opts
     * @returns {{type, subType: number, num, power: number, cards: Array}}
     */
    optToShape (cards, opts) {
        let realCards = [];
        let num = opts.num;
        let type = opts.type;
        let simCards = opts.minCards;
        let simLen = simCards.length;
        let subType = Enum.subShape.NONE;
        if (type == Enum.shape.DAN) {
            let simCard = simCards[0];
            let paiInfo = this.getPaiCount(cards, simCard, 1);
            realCards.push(paiInfo[0]);
        } else if (type == Enum.shape.DUI) {
            for (let idx = 0; idx < simLen; idx++) {
                let simCard = simCards[idx];
                let paiInfo = this.getPaiCount(cards, simCard, 2);
                for (let paiIdx = 0; paiIdx < paiInfo.length; paiIdx++) {
                    let pai = paiInfo[paiIdx];
                    if (realCards.indexOf(pai) == -1) {
                        realCards.push(pai);
                    }
                }
            }
        } else if (type == Enum.shape.SAN_YI) {
            for (let idx = 0; idx < simLen; idx++) {
                let simCard = simCards[idx];
                let paiInfo = this.getPaiCount(cards, simCard, 3);
                for (let pIdx in paiInfo) {
                    let pai = paiInfo[pIdx];
                    if (realCards.indexOf(pai) == -1) {
                        realCards.push(pai);
                    }
                }
            }
            let dai = opts.dai;
            if (dai.length > 0) {
                let daiLen = dai.length;
                subType = this.getDaiType(dai);
                for (let idx in cards) {
                    let card = cards[idx];
                    let value = card > 500 ? card : card % 100;
                    for (let dIdx = daiLen - 1; dIdx >= 0; dIdx--) {
                        if (dai[dIdx] == value) {
                            realCards.push(card);
                            dai.splice(dIdx, 1);
                            daiLen--;
                            break;
                        }
                    }
                }
            }
        } else if (type == Enum.shape.SHUN) {
            for (let idx = 0; idx < simLen; idx++) {
                let simCard = simCards[idx];
                let paiInfo = this.getPaiCount(cards, simCard, 1);
                realCards.push.apply(realCards, paiInfo);
            }
        } else if (type == Enum.shape.SI_ER) {
            //console.log("AI没有四代二");
        } else if (type == Enum.shape.ZD) {
            let simCard = simCards[0];
            let paiInfo = this.getPaiCount(cards, simCard, 4);
            realCards = paiInfo;
        }
        let data = {type: type, subType: subType, num: num, power: this.ReCalcPower(opts), cards: realCards};
        return data;
    }

    /**
     * @param cards
     * @returns {Array}
     */
    genPoints (cards) {
        let points = [];
        points.push(cards[0] % 100);
        points.push(cards[1] % 100);
        points.push(cards[2] % 100);
        points.sort(function (a, b) {
            return a > b;
        });
        return points;
    }

    /**
     * 必出103
     * @constructor
     */
    Check103(doShape, cards){
        if(cards.indexOf(103) >= 0){
            let outCards = doShape.cards;
            let replace = false;
            if(outCards.indexOf(103) === -1){
                for(let i = 2; i <= 4; i++){
                    let pos = outCards.indexOf(100 * i + 3);
                    if(pos >= 0){
                        outCards.splice(pos, 1);
                        outCards.push(103);
                        replace = true;
                        return true;
                    }
                }
            }else{
                return true;
            }
            if(replace === false) return false;
        }else{
            return true;
        }
    }

    /**
     * 移除出牌
     * @param types
     */
    removeOutCards(types) {
        let len = types.length;
        for (let idx = 0; idx < len; idx++) {
            let oneType = types[idx];
            let outInfo = oneType.outInfo;
            let mainArray = outInfo.mainArray;
            let daiArray = outInfo.daiArray;
            if (mainArray) {
                let paiType = mainArray.type;
                let mStart = mainArray.start;
                let mNum = mainArray.num;
                let mMax = mStart + mNum - 1;
                if (paiType != "shun") {
                    for (let loop = 0; loop < mNum; loop++) {
                        let removeCard = mStart + loop;
                        if (removeCard == 14) {
                            removeCard = 1;
                        } else if (removeCard == 15) {
                            removeCard = 2;
                        }
                        let paiInfo = oneType[paiType];
                        let paiLen = paiInfo.length;
                        for (let i = paiLen - 1; i >= 0; i--) {
                            let paiInfoArr = oneType[paiType][i];
                            if (paiInfoArr.start == removeCard) {
                                paiInfo.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    let shunInfo = oneType.shun;
                    let shunLen = shunInfo.length;
                    let tempShunArray = [];
                    for (let sIdx = shunLen - 1; sIdx >= 0; sIdx--) {
                        let shunStart = shunInfo[sIdx].start;
                        let shunNum = shunInfo[sIdx].num;
                        let shunMax = shunStart + shunNum - 1;
                        if (mStart >= shunStart && mNum <= shunNum && shunMax >= mMax) {
                            let plusNum = shunNum - mNum;
                            if (plusNum == 0) {
                                shunInfo.splice(sIdx, 1);
                            } else {
                                let beforeNum = mStart - shunStart;
                                if (beforeNum != 0) {
                                    let data = {start: shunStart, num: beforeNum};
                                    tempShunArray.push(data);
                                }
                                if (beforeNum != plusNum) {
                                    let nextNum = plusNum - beforeNum;
                                    let nStart = shunStart + beforeNum + mNum;
                                    if (nStart == 14) {
                                        nStart = 1;
                                    }
                                    let data = {start: nStart, num: nextNum};
                                    tempShunArray.push(data);
                                }
                                shunInfo.splice(sIdx, 1);
                            }
                            break;
                        }
                    }
                    for (let tIdx in tempShunArray) {
                        shunInfo.push(tempShunArray[tIdx]);
                    }
                    let sLen = shunInfo.length;
                    for (let s = sLen - 1; s >= 0; s--) {
                        let oneShun = shunInfo[s];
                        let num = oneShun.num;
                        if (num < 5) {
                            for (let loop = 0; loop < num; loop++) {
                                let card = oneShun.start + loop;
                                if (card == 14) {
                                    card = 1;
                                } else if (card == 15) {
                                    card = 2;
                                }
                                let cardNum = 1;
                                for (let type in oneType) {
                                    if (type != "outInfo" && type != "shun") {
                                        let typeArray = oneType[type];
                                        let typeLen = typeArray.length;
                                        for (let iType = typeLen - 1; iType >= 0; iType--) {
                                            if (typeArray[iType].start == card) {
                                                if (type == "dan") {
                                                    cardNum++;
                                                    typeArray.splice(iType, 1);
                                                } else if (type == "dui") {
                                                    cardNum += 2;
                                                    typeArray.splice(iType, 1);
                                                } else if (type == "san") {
                                                    cardNum += 3;
                                                    typeArray.splice(iType, 1);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (cardNum == 1) {
                                    oneType.dan.push({start: card, num: 1});
                                } else if (cardNum == 2) {
                                    oneType.dui.push({start: card, num: 1});
                                } else if (cardNum == 3) {
                                    oneType.san.push({start: card, num: 1});
                                } else if (cardNum == 4) {
                                    oneType.four.push({start: card, num: 1});
                                }
                            }
                            shunInfo.splice(s, 1);
                        }
                    }
                }
            } else {
                //console.log("牌型错误，没有主体牌");
            }
            if (daiArray) {
                for (let iDai in daiArray) {
                    let daiType = daiArray[iDai].type;
                    let daiStart = daiArray[iDai].start;
                    let onLen = oneType[daiType].length;
                    let formType = daiArray[iDai].form || daiType;
                    // 代牌类型和来自哪里的类型相同 全部扣除
                    if(formType === daiType) {
                        for (let i = onLen - 1; i >= 0; i--) {
                            if (oneType[daiType][i].start == daiStart) {
                                oneType[daiType].splice(i, 1);
                                break;
                            }
                        }
                    }else{              // 部分带部分扣除 目前只有这一种 从对牌里面扣除单张代牌
                        if(formType === "dui" && daiType === "dan"){
                            onLen = oneType[formType].length;
                            for (let i = onLen - 1; i >= 0; i--) {
                                if (oneType[formType][i].start == daiStart) {
                                    oneType[formType].splice(i, 1);
                                    oneType[daiType].push({start:daiStart, num:1});
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            //console.log("去除要出的牌后 牌型为: " + JSON.stringify(oneType));
        }
    }
    /**
     * 获取能炸上一家的最好牌
     * @param oneType
     * @param prePower
     * @returns {*}
     */
    getBoomByPre(oneType, prePower) {
        if (!prePower) {
            prePower = 0;
        }
        let boomLen = oneType.four.length;
        if (boomLen == 0) {
            return null;
        }
        let minBoom = 999;
        let outCards = null;
        for (let idx = 0; idx < boomLen; idx++) {
            let start = oneType.four[idx].start;
            let curPower = 0;
            if (start > 500) {
                curPower = this.getPowerByRealPai(614);
            } else {
                curPower = this.getPowerByRealPai(start);
            }
            if (curPower > prePower) {
                if (curPower < minBoom) {
                    minBoom = curPower;
                    outCards = {mainArray: {start: start, num: 1, type: "four"}};
                }
            }
        }
        return outCards;
    }
    /**
     * 出单牌
     * @param oneType
     */
    outDan(oneType, preShape) {
        let oneLen = oneType.dan.length;
        let prePower = preShape.power;
        let newTbl = clone(oneType);
        let danArray = oneType.dan;
        let outInfo = null;
        if (oneLen > 0) {
            let minPower = 999;
            for (let oneIdx = 0; oneIdx < oneLen; oneIdx++) {
                let card = danArray[oneIdx].start;
                let onePower = this.getPowerByRealPai(card);
                if (onePower > prePower) {
                    if (onePower < minPower) {
                        minPower = onePower;
                        outInfo = {mainArray: {start: card, num: 1, type: "dan"}};
                    }
                }
            }
        }
        if (!outInfo) {
            outInfo = this.getBoomByPre(oneType);
            if (outInfo) {
                newTbl.outInfo = outInfo;
            }
        } else {
            newTbl.outInfo = outInfo;
        }
        if (outInfo) {
            return [newTbl];
        } else {
            return null;
        }
    }
    /**
     * 走对子
     */
    outDui(oneType, preShape) {
        let duiLen = oneType.dui.length;
        let prePower = preShape.power;
        let preLd = preShape.num;
        let newTbls = [];
        if (duiLen > 0) {
            let reDui = this.reLian(oneType.dui, 2);
            for (let idx = 0; idx < reDui.length; idx++) {
                if (reDui[idx].num >= preLd) {
                    let startCard = reDui[idx].start;
                    let duiNum = reDui[idx].num;
                    // 从没有连队的牌开始选
                    if (preLd == 1) {
                        for (let i = 0; i < duiNum; i++) {
                            let card = reDui[idx].start + i;
                            if (card == 14) card = 1;
                            if (card == 15) card = 2;
                            let Power = this.getPowerByRealPai(card);
                            if(Power > prePower){
                                let newTbl = clone(oneType);
                                let outInfo = {mainArray: {start: card, num: 1, type: "dui"}};
                                newTbl.outInfo = outInfo;
                                newTbls.push(newTbl);
                            }
                        }
                    }else {
                        let self = false;
                        if(startCard <= 2) self = true; // 以前不能 1122 2233 的时候可以下面判断 现在不行了
                        if(preLd == 1) self = false;
                        let maxCard = startCard + duiNum - 1;
                        if (maxCard == 14) maxCard = 1;
                        if (maxCard == 15) maxCard = 2;
                        let realMaxPower = this.getPowerByRealPai(maxCard, self);
                        if (preLd >= 1) {
                            while (realMaxPower > prePower && duiNum >= preLd) {
                                let newTbl = clone(oneType);
                                let start = realMaxPower - preLd + 1;
                                if (start == 14) {
                                    start = 1;
                                } else if (start == 15) {
                                    start = 2;
                                }
                                let outInfo = {mainArray: {start: start, num: preLd, type: "dui"}};
                                newTbl.outInfo = outInfo;
                                realMaxPower--;
                                duiNum--;
                                newTbls.push(newTbl);
                            }
                        }
                    }
                }
            }
        }
        if (newTbls.length == 0) {
            let outInfo = this.getBoomByPre(oneType);
            if (outInfo) {
                let newTbl = clone(oneType);
                newTbl.outInfo = outInfo;
                newTbls.push(newTbl);
            }
        } else {
            if (preLd == 1) {
                let minPower = 999;
                let baoLiu = 0;
                for (let idx in newTbls) {
                    let mainArray = newTbls[idx].outInfo.mainArray;
                    let curPower = this.getPowerByRealPai(mainArray.start);
                    if (curPower < minPower) {
                        minPower = curPower;
                        baoLiu = idx;
                    }
                }
                let data = clone(newTbls[baoLiu]);
                newTbls = [];
                newTbls.push(data);
            }
        }
        if (newTbls.length > 0) {
            return newTbls;
        } else {
            return null;
        }
    }

    /**
     * 获取带牌
     * @param type
     * @param ld
     * @param oneType
     * @returns {Array}
     */
    getDaiByPre(type, ld, oneType) {
        let duiArray = oneType.dui;
        let danArray = oneType.dan;
        let duiLen = duiArray.length;
        let danLen = danArray.length;
        let sanCards = [];
        for(let idx in oneType.san){
            sanCards.push(oneType.san[idx].start);
        }
        let dai = [];
        if (type == Enum.subShape.DUI) {
            if (duiLen < ld) {
                return dai;
            } else {
                let reDui = this.reLian(duiArray, 2);
                if (ld == 1) {
                    for (let idx = 0; idx < reDui.length; idx++) {
                        if (reDui[idx].num == 1) {
                            dai.push({start: reDui[idx].start, num: 1, type: "dui", form:"dui"});
                            break;
                        }
                    }
                } else {
                    for (let idx = 0; idx < ld; idx++) {
                        dai.push({start: duiArray[idx].start, num: 1, type: "dui",form:"dui"});
                    }
                }
            }
        } else if (type == Enum.subShape.DAN) {
            // 优先带单牌 但是不带王(从经验判断很少有人带王, 如果三连和单牌一起冲突了，不能三代他自己)
            let count = ld * 2;
            for (let idx = 0; idx < danLen; idx++) {
                let card = danArray[idx].start;
                if (card > 500) {
                    continue;
                }
                if(sanCards.indexOf(card) >= 0){
                    continue;
                }
                dai.push({start: card, num: 1, type: "dan", form:"dan"});
                count--;
                if (count == 0) {
                    break;
                }
            }
            // 优先使用单牌再拆不连的对子 在拆姊妹对
            if (count > 0 && duiLen > 0) {
                let reDui = this.reLian(duiArray, 2);

                if (duiLen  >= count) {
                    // 优先使用 不能连成姊妹对的牌
                    for (let idx = 0; idx < reDui.length; idx++) {
                        if (reDui[idx].num == 1) {
                            dai.push({start: reDui[idx].start === 14 ? 1 : reDui[idx].start, num: 1, type: "dan", form:"dui"});
                            count -= 1;
                            if(count <= 0)break;
                        }
                    }
                    // 在使用可以练成姊妹对的牌型
                    if (count  > 0) {
                        for (let idx = 0; idx < reDui.length; idx++) {
                            if (reDui[idx].num != 1) {
                                for(let j = 0; j < reDui[idx].num; j++){
                                    let card = reDui[idx].start + j == 14 ? 1 : reDui[idx].start + j;
                                    dai.push({start: card, num: 1, type: "dan", form:"dui"});
                                    count -= 1;
                                    if(count <= 0)break;
                                }
                            }
                        }
                    }
                }
            }
            if (count != 0) {
                dai = []
            }
        }
        return dai;
    }
    /**
     * 走三带
     */
    outSan(oneType, preShape) {
        let reSan = this.reLian(oneType.san, 3);
        let sanLen = reSan.length;
        let prePower = preShape.power;
        let preLd = preShape.num;
        let preSubType = preShape.subType;
        let newTbl = clone(oneType);
        let outInfo = null;
        if (sanLen > 0) {
            let minPower = 999;
            for (let sanIdx = 0; sanIdx < sanLen; sanIdx++) {
                let startCard = reSan[sanIdx].start;
                let ld = reSan[sanIdx].num;
                if (ld >= preLd) {
                    let maxCard = startCard + ld - 1;
                    if (maxCard == 14) {
                        maxCard = 1;
                    } else if (maxCard == 15) {
                        maxCard = 2;
                    }
                    let curPower = this.getPowerByRealPai(maxCard);
                    if (curPower > prePower) {
                        if (curPower < minPower) {
                            if (preSubType != Enum.subShape.NONE) {
                                let daiArray = this.getDaiByPre(preSubType, preLd, oneType);
                                if (daiArray.length > 0) {
                                    minPower = curPower;
                                    outInfo = {
                                        mainArray: {start: startCard, num: preLd, type: "san"},
                                        subType: preSubType,
                                        daiArray: daiArray
                                    };
                                }
                            } else {
                                minPower = curPower;
                                outInfo = {mainArray: {start: startCard, num: preLd, type: "san"}, subType: preSubType};
                            }
                        }
                    }
                }
            }
        }
        if (!outInfo) {
            outInfo = this.getBoomByPre(oneType);
            if (outInfo) {
                newTbl.outInfo = outInfo;
            }
        } else {
            newTbl.outInfo = outInfo;
        }
        if (outInfo) {
            return [newTbl];
        } else {
            return null;
        }
    }
    /**
     * 出顺牌
     * @param oneType
     * @param preShape
     * @returns {*}
     */
    outShun(oneType, preShape) {
        let shunArray = oneType.shun;
        let shunLen = shunArray.length;
        let prePower = preShape.power;
        let preNum = preShape.num;
        let newTbls = [];
        for (let idx = 0; idx < shunLen; idx++) {
            let oneShun = shunArray[idx];
            let maxNum = oneShun.num;
            let maxPower = oneShun.start + maxNum - 1;
            if (preNum >= 5) {
                while (maxPower > prePower && maxNum >= preNum) {
                    let newTbl = clone(oneType);
                    let start = maxPower - preNum + 1;
                    let outInfo = {mainArray: {start: start, num: preNum, type: "shun"}};
                    newTbl.outInfo = outInfo;
                    maxPower--;
                    maxNum--;
                    newTbls.push(newTbl);
                }
            }
        }
        if (newTbls.length == 0) {
            let outInfo = this.getBoomByPre(oneType);
            if (outInfo) {
                let newTbl = clone(oneType);
                newTbl.outInfo = outInfo;
                newTbls.push(newTbl);
            }
        }
        if (newTbls.length > 0) {
            return newTbls;
        } else {
            return null;
        }
    }


    /**
     * 对方出炸弹
     * @param oneType
     * @param preShape
     */
    outZD(oneType, preShape) {
        let newTbl = clone(oneType);
        let prePower = preShape.power;
        let outInfo = this.getBoomByPre(oneType, prePower);
        if (outInfo) {
            newTbl.outInfo = outInfo;
            return [newTbl];
        } else {
            return null;
        }
    }

    /**
     * 计算最终的分值(有上家牌)
     * @param fina
     */
    calcFinaScorePre(fina) {
        let shou = 0, value = 0;
        for (let idx in fina.dan) {
            let card = fina.dan[idx].start;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.dan;
            value += typeScore;
            shou++;
        }
        for (let idx in fina.dui) {
            let start = fina.dui[idx].start;
            let num = fina.dui[idx].num;
            let card = start + num - 1;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.dui[num];
            value += typeScore;
            shou++;
        }
        for (let idx in fina.san) {
            let start = fina.san[idx].start;
            let num = fina.san[idx].num;
            let card = start + num - 1;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.san[num];
            value += typeScore;
            shou++;
        }
        for (let idx in fina.four) {
            let card = fina.four[idx].start;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.four;
            value += typeScore;
            shou++;
        }
        for (let idx in fina.shun) {
            let start = fina.shun[idx].start;
            let num = fina.shun[idx].num;
            let card = start + num - 1;
            value += Enum.paiValue[card];
            let typeScore = Enum.typeValue.shun[num];
            value += typeScore;
            shou++;
        }
        if(fina.outInfo){                           // 优化本次出牌如果是炸弹的话 牌型分加上一个炸弹 这样保证剩余手牌相同的情况下 优先选择出炸弹
            if(fina.outInfo.mainArray.type == "four"){
                value += Enum.typeValue.four;
            }
        }
        fina.shou = shou;
        fina.value = value;
    }
    /**
     * 上家有牌的情况出牌
     * @param allTypes
     * @param preShape
     * @param cards
     * @returns {Array}
     */
    getFinaAllTypeByPre(allTypes, preShape, cards) {
        let reAllTypes = [];
        let newTypes;
        for (let idx in allTypes) {
            let oneType = allTypes[idx];
            //console.log("原始类型" + JSON.stringify(oneType) + "---> " + idx);
            if (preShape.type == Enum.shape.DAN) {                // 对方走的单牌 则默认自己走最小单牌
                newTypes = this.outDan(oneType, preShape);
            } else if (preShape.type == Enum.shape.DUI) {
                newTypes = this.outDui(oneType, preShape);
            } else if (preShape.type == Enum.shape.SAN_YI) {
                newTypes = this.outSan(oneType, preShape);
            } else if (preShape.type == Enum.shape.SHUN) {
                newTypes = this.outShun(oneType, preShape);
            } else if (preShape.type == Enum.shape.SI_ER) {     // 跑得快 没有四代二
                // newTypes = this.outSI(oneType, preShape);
            } else if (preShape.type == Enum.shape.ZD) {
                newTypes = this.outZD(oneType, preShape);
            }
            if (newTypes) {
                let len = newTypes.length;
                for (let l = 0; l < len; l++) {
                    //console.log("出牌后类型" + JSON.stringify(newTypes[l].outInfo));
                    reAllTypes.push(newTypes[l]);
                }
            } else {
                //console.log("要不起");
            }
        }
        this.removeOutCards(reAllTypes);
        //  下面是检验函数
        // for (let idx in reAllTypes) {
        //     //console.log(JSON.stringify(cards));
        //     let oneType = reAllTypes[idx];
        //     // 检测函数
        //     // let num = this.calcPreTypeNum(oneType);
        //     // if (num != cards.length) {
        //     //     console.log("----error-----6---" + idx);
        //     //     console.log(JSON.stringify(cards));
        //     // }
        // }
        for (let idx in reAllTypes) {
            let fina = reAllTypes[idx];
            this.calcFinaScorePre(fina);
        }
        return reAllTypes;
    }

    checkShape(doshape, cards){
        let checkCards = doshape.cards;
        for (let idx in checkCards) {
            let CC = checkCards[idx];
            if (cards.indexOf(CC) == -1) {
                console.log("出错了 机器人 没有找到对应牌 doshape: " + JSON.stringify(doshape));
                console.log("本来有的牌是 cards: " + JSON.stringify(cards));
                console.log("上个玩家走的牌是" + JSON.stringify(this.owner.preShape));
                return false;
            }
        }
        let preShape = this.owner.preShape;
        if(preShape){
            if(doshape.type === Enum.shape.ZD){
                if(preShape.type === Enum.shape.ZD){
                    if(preShape.num != doshape.num || preShape.power >= doshape.power){
                        console.log("出牌错误le cards: " + JSON.stringify(cards));
                    }
                }
            }else {
                if (preShape.cards.length != checkCards.length || preShape.type != doshape.type || preShape.num != doshape.num || preShape.power >= doshape.power) {
                    let point1s = this.genPoints(preShape.cards);
                    let point2s = this.genPoints(doshape.cards);
                    if(point1s[0] === point2s[0] && preShape.type === Enum.shape.SAN_YI){

                    }else {
                        console.log("出牌错误le cards: " + JSON.stringify(cards));
                    }
                }
            }
        }
        return true;
    }

    /**
     * AI 入口函数
     * @param cards 电脑不会把对子牌拆分成单张单张出 这样组合太多了 增加计算机负担  对于对方出单牌情况 如有需要要单独处理
     * @returns {*}
     */
    selectPai(cards){
        let allTypes = this.subGroup(cards);
        let doShape = null;
        if(this.owner.preShape == null) {
            let allFinaTypes = this.getFinaAllType(allTypes, cards);
            let optType = this.getOptType(allFinaTypes, cards);
            let optCards = this.getOptCards(optType,cards);
            doShape = this.optToShape(cards, optCards);

            if (doShape.type === Enum.shape.SAN_YI) {            // 验证三代
                // console.log("--------" + JSON.stringify(cards) + "---------");
                // console.log(JSON.stringify(doShape));
                // let sans = this.genPoints(doShape.cards);
                // let card0 = sans[0];
                // let sum = CommFuc.numAtArrayCount(sans, card0);
                // // if(sum != 3) {
                // //     console.log(sum);
                // // }
            } else if (doShape.type === Enum.shape.SHUN) {
                // console.log("--------" + JSON.stringify(cards) + "---------");
                // console.log(JSON.stringify(doShape));
            } else if (doShape.type === Enum.shape.DUI && doShape.cards.length == 4) {
                // console.log("--------" + JSON.stringify(cards) + "---------");
                // console.log(JSON.stringify(doShape));
            }
            if(!this.Check103(doShape, cards)){
                return null;
            }
        }else{
            let allFinaTypesPre = this.getFinaAllTypeByPre(allTypes, this.owner.preShape, cards);
            if (allFinaTypesPre.length == 0) {
                // 下面为了测试用
                // console.log("要不起" + JSON.stringify(cards));
                // let list = this.cardsConv(cards);            检测小队子(一个连队)
                // for(let idx in list){
                //     if(list[idx] >= 2 && idx != 2){
                //         console.log("出错了 " + JSON.stringify(cards));
                //     }
                //     if(list[idx] === 4){
                //         console.log("出错了 " + JSON.stringify(cards));
                //     }
                // }
                // let list = this.cardsConv(cards);            // 检测小连子(2个连队)
                // list[13] = list[0];
                // for(let idx = 1; idx < 14; idx++){
                //     if(list[idx] === 4){
                //         if(this.getPowerByRealPai(idx + 1) > preShape.power) {
                //             console.log("出错了 " + JSON.stringify(cards));
                //         }
                //     }
                // }
                return null;
            }
            let optTypePre = this.getOptType(allFinaTypesPre);
            let outInfo = optTypePre.outInfo;
            doShape = this.outToShape(cards, outInfo);
            // console.log("out info: " + JSON.stringify(doShape));
        }
        let check = this.checkShape(doShape, cards);
        if(check === false) return null;
        return doShape;
    }
    /**
     * 获取牌型分<另一个AI 入口函数>
     * @param cards
     * @returns {*}
     */
    getPaiScore(cards) {
        let allTypes = this.subGroup(cards);
        let allFinaTypes = this.getFinaAllType(allTypes, cards);
        let optType = this.getOptType(allFinaTypes);
        if(optType) {
            return {value: optType.value, shou: optType.shou};
        }else{
            return null;
        }
    }
}

module.exports.AI = AI;
// 下面是测试
//
// preShape = {
//     "type": Enum.shape.ZD,
//     "subType": Enum.subShape.NONE,
//     "num": 1,
//     "power": 3,
//     "cards": [103,203,303,403]
// }
// AI = new AI();
// // 发牌测试 电脑不会把对子牌拆分成单张单张出 这样组合太多了 增加计算机负担  对于对方出单牌情况这里需要单独处理
// let cards = [102,202,203,103];
// AI.selectPai(cards);

// // 实际环境测试 出11 22 被 22 33 管起的情况还没测试
// for(let loop = 0; loop < 10; loop++){
//     let data = genCard();
//     for(let idx = 0; idx < 3; idx++){
//         AI.selectPai(data.playerCards[idx]);
//         AI.getPaiScore(data.playerCards[idx]);
//     }
// }
