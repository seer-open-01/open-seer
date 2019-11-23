let CommFuc     = require("../../../util/CommonFuc.js");
let Enum        = require("./Enum.js");

//=====================================机器人AI================================================
function AI(owner) {
    this.owner = owner
}
/**
 * AI 通用函数
 * @type {{}}
 */
AI.prototype = {
    /**
     * 计算无关牌
     * @param cards
     * @returns {Array}
     */
    getWGP: function (cards) {
        let alone = [];
        if (cards.indexOf(614) >= 0) {
            alone.push(614)
        }
        if (cards.indexOf(514) >= 0) {
            alone.push(514)
        }
        let list = cardsConv(cards);
        list[13] = list[0];
        list[14] = list[1];
        for (let idx = 2; idx < 15; idx++) {      // 3 到 A
            if (idx != 14) {
                if (list[idx] > 0) {
                    if (idx - 1 >= 2 && list[idx - 1] > 0) {
                        continue;
                    }
                    if (idx + 1 <= 13 && list[idx + 1] > 0) {
                        continue;
                    }
                    if (idx == 13) {
                        alone.push(1);
                    } else {
                        alone.push(idx + 1);
                    }
                }
            } else {                      // 2
                if (list[idx] > 0) {
                    alone.push(2);
                }
            }
        }
        return alone;
    },
    /**
     * 牌型分组
     * @param cards
     * @param wg
     * @returns {{ygSet: Array, wgSet: Array}}
     */
    groupSet: function (cards, wg) {
        let ygSet = [], wgSet = [];
        for (let idx in cards) {
            let card = cards[idx];
            let pai = card % 100;
            if (card > 500) {
                pai = card;
            }
            if (wg.indexOf(pai) == -1) {
                ygSet.push(card);
            } else {
                wgSet.push(card);
            }
        }
        return {ygSet: ygSet, wgSet: wgSet};
    },
    /**
     * 设置集合
     * @param cards
     * @returns {*}
     */
    subGroup: function (cards) {
        let list = this.owner.cardsConv(cards);
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
    },
    /**
     * 获取所有组合
     * @param set
     * @returns {Array}
     */
    getAllGroup: function (set) {
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
    },
    /**
     * 计算牌的权值
     */
    calcValue: function (tPai, cards) {
        let allTypes = [];
        for (let tIdx in tPai) {
            let curTypes = {dan: [], dui: [], san: [], four: [], shun: []};
            if (tIdx == 0) {
                let tt = 0;
            }
            let cpCards = CommFuc.copyArray(cards);
            let list = this.owner.cardsConv(cpCards);
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
            for (let idx = 2; idx < 14; idx++) {      // 3-A 判断顺子
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
                            }
                        }
                    }
                }
            }
            let sLen = shun.length;
            if (sLen > 0) {
                for (let idx = 2; idx < 14; idx++) {
                    if (list[idx] > 0) {
                        for (let sIdx in shun) {
                            let start = shun[sIdx].start;
                            let num = shun[sIdx].num;
                            if (idx + 1 == start + num && list[idx] > 0) {
                                shun[sIdx].num++;
                                list[idx]--;
                            }
                        }
                    }
                }
                if (shun.length == 2) {
                    if (shun[0].start + shun[0].num == shun[1].start) {
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
        }
        return allTypes;
    },
    /**
     * 加入无关牌
     * @param allTypes
     * @param cards
     * @param wgCards
     */
    addWgToAllTypes: function (allTypes, cards, wgCards) {
        if (cards.indexOf(514) >= 0 && cards.indexOf(614) >= 0) {
            let cpAllType1 = clone(allTypes);
            for (let idx in cpAllType1) {
                let oneType = cpAllType1[idx];
                oneType.dan.push({start: 514, num: 1});
                oneType.dan.push({start: 614, num: 1});
            }
            let cpAllType2 = clone(allTypes);
            for (let idx in cpAllType2) {
                let oneType = cpAllType2[idx];
                oneType.four.push({start: 514, num: 1});
            }
            allTypes = [];
            allTypes.push.apply(allTypes, cpAllType1);
            allTypes.push.apply(allTypes, cpAllType2);
        } else if (cards.indexOf(514) >= 0 && cards.indexOf(614) == -1) {
            for (let idx in allTypes) {
                let oneType = allTypes[idx];
                oneType.dan.push({start: 514, num: 1});
            }
        } else if (cards.indexOf(614) >= 0 && cards.indexOf(514) == -1) {
            for (let idx in allTypes) {
                let oneType = allTypes[idx];
                oneType.dan.push({start: 614, num: 1});
            }
        }
        this.addWgCard(wgCards, allTypes);
        return allTypes;
    },
    /**
     * @param allTypes
     * @param set
        */
    getFinaAllType: function (allTypes, cards) {
        let allFina = [];
        for (let idx in allTypes) {
            let oneType = allTypes[idx];
            // 检测函数
            // let maxNum = this.calcNum(oneType);
            // if (maxNum !== cards.length) {
            //     console.log("errror -- 1-- " + idx);
            //     console.log(JSON.stringify(cards));
            //     console.log(JSON.stringify(oneType));
            // }
            oneType.dui = this.reLian(oneType.dui, 2);
            oneType.san = this.reLian(oneType.san, 3);
            //console.log(JSON.stringify(oneType));
            // 检测函数
            // maxNum = this.calcNum(oneType);
            // if (maxNum !== cards.length) {
            //     console.log("errror -- 2-- " + idx);
            //     console.log(JSON.stringify(cards));
            //     console.log(JSON.stringify(oneType));
            // }
            let fina = this.getFinaType(oneType);
            // 检测函数
            // maxNum = this.calcFinaNum(fina);
            // if (maxNum !== cards.length) {
            //     console.log("error ---3--" + idx);
            //     console.log(JSON.stringify(cards));
            //     console.log(JSON.stringify(fina));
            // }
            this.calcFinaScore(fina);
            allFina.push(fina);
        }
        return allFina;
    },
    /**
     * 增加无关牌
     */
    addWgCard: function (wgCards, allTypes) {
        let list = this.owner.cardsConv(wgCards);
        for (let idx in allTypes) {
            let oneType = allTypes[idx];
            for (let pIdx = 0; pIdx < 13; pIdx++) {
                if (list[pIdx] == 1) {
                    oneType.dan.push({start: pIdx + 1, num: 1});
                } else if (list[pIdx] == 2) {
                    oneType.dui.push({start: pIdx + 1, num: 1});
                } else if (list[pIdx] == 3) {
                    oneType.san.push({start: pIdx + 1, num: 1});
                } else if (list[pIdx] == 4) {
                    oneType.four.push({start: pIdx + 1, num: 1});
                }
            }
        }
    },
    /**
     * 获取最优方案 1069 0691 0365 788 219724
     */
    getOptType: function (allTypes) {
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
            //console.log("error ---4----");
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
    },
    /**
     * 获取最优的出牌
     * @param oneType
     * @returns {*}
     */
    getOptCards: function (oneType) {
        let outDSS = this.getOptDuiSanShun(oneType);
        let outDD = this.getOptDanDui(oneType);
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
        //console.log("error，请检查代码 是否错误");
    },
    /**
     * 获取最小连队、三带、顺子、最小的最小牌 作为优先要出的牌 顺子会偏移2个位置
     * @param oneType
     * @returns {*}
     */
    getOptDuiSanShun: function (oneType) {
        let min = 999;
        let minCards = [];
        let type = null;
        let ldNum = 0;
        let dai = null;
        for (let idx in oneType.dui) {
            let ld = oneType.dui[idx].ld;
            let start = oneType.dui[idx].start;
            let startPower = this.getPowerByPai(start);
            if (ld >= 3) {
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
            let startPower = this.getPowerByPai(start);
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
                    dai = oneType.san[idx].dai;
                }
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
    },
    /**
     * 出最优的单排和对牌
     * @param oneType
     * @returns {*}
     */
    getOptDanDui: function (oneType) {
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
                let startPower = this.getPowerByPai(start);
                if (startPower < min) {
                    min = startPower;
                    minCards.push(start);
                    type = Enum.shape.DAN;
                }
                if(startPower >= maxDanPower && danNum !== 1){          // 一定要出单牌
                    outDan = true;
                }
            }
        }
        if(outDan === false) {                          // 不一定要出单牌
            if (duiNum > 0) {
                for (let idx = 0; idx < duiNum; idx++) {
                    let start = oneType.dui[idx].start;
                    let ld = oneType.dui[idx].ld;
                    if (ld == 1) {
                        let startPower = this.getPowerByPai(start);
                        if (startPower < min) {
                            min = startPower;
                            minCards = [];
                            minCards.push(start, start);
                            type = Enum.shape.DUI;
                        }
                        if(startPower >= maxDuiPower && duiNum !== 1){
                            outDui = true;
                        }
                    }
                }
                if(outDui){
                    min = 999;
                    for (let idx = 0; idx < duiNum; idx++) {
                        let start = oneType.dui[idx].start;
                        let ld = oneType.dui[idx].ld;
                        if (ld == 1) {
                            let startPower = this.getPowerByPai(start);
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
    },
    /**
     * 获取最优炸弹
     * @param oneType
     * @returns {*}
     */
    getOptBoom: function (oneType) {
        let boomNum = oneType.four.length;
        let min = 999;
        let minCards = [];
        if (boomNum > 0) {
            for (let idx = 0; idx < boomNum; idx++) {
                let start = oneType.four[idx].start;
                let startPower = this.getPowerByPai(start);
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
    },
    /**
     * 获取能炸上一家的最好牌
     * @param oneType
     * @param prePower
     * @returns {*}
     */
    getBoomByPre: function (oneType, prePower) {
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
    },
    /**
     * 获取power 理论上不让单独出大王和小王 所以这里的值设置的很高
     * @param number
     * @returns {number}
     */
    getPowerByPai: function (number) {
        number = +number;
        if (number == 1) {
            return 14;
        } else if (number == 2) {
            return 15;
        } else if (number == 514) {
            return 514;
        } else if (number == 614) {
            return 614;
        }
        return number;
    },
    /**
     * 获取真实的炸弹
     * @param pai
     * @returns {number}
     */
    getPowerByRealPai: function (pai) {
        let number = +pai;
        if (number == 1) {
            return 14;
        } else if (number == 2) {
            return 15;
        } else if (number == 514) {
            return 16;
        } else if (number == 614) {
            return 17;
        }
        return number;
    },
    /**
     * 上家有牌的情况出牌
     * @param allTypes
     * @param preShape
     * @param cards
     * @returns {Array}
     */
    getFinaAllTypeByPre: function (allTypes, preShape, cards) {
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
            } else if (preShape.type == Enum.shape.SI_ER) {
                newTypes = this.outSI(oneType, preShape);
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
    },
    /**
     * 出单牌
     * @param oneType
     */
    outDan: function (oneType, preShape) {
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
    },
    /**
     * 走对子
     */
    outDui: function (oneType, preShape) {
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
                    let maxCard = startCard + duiNum - 1;
                    if (maxCard == 14) {
                        maxCard = 1;
                    } else if (maxCard == 15) {
                        maxCard = 2;
                    }
                    let realMaxPower = this.getPowerByRealPai(maxCard);
                    // 从没有连队的牌开始选
                    if (preLd == 1) {
                        if (duiNum == 1) {
                            if (realMaxPower > prePower) {
                                let newTbl = clone(oneType);
                                let outInfo = {mainArray: {start: startCard, num: duiNum, type: "dui"}};
                                newTbl.outInfo = outInfo;
                                newTbls.push(newTbl);
                            }
                        }
                    } else {
                        if (preLd >= 3) {
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
    },
    /**
     * 走三带
     */
    outSan: function (oneType, preShape) {
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
    },
    /**
     * 出顺牌
     * @param oneType
     * @param preShape
     * @returns {*}
     */
    outShun: function (oneType, preShape) {
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
    },
    /**
     * 对方出四代二 统一出炸弹干掉
     * @param oneType
     * @returns {*}
     */
    outSI: function (oneType) {
        let newTbl = clone(oneType);
        let outInfo = this.getBoomByPre(oneType);
        if (outInfo) {
            newTbl.outInfo = outInfo;
            return [newTbl];
        } else {
            return null;
        }
    },
    /**
     * 对方出炸弹
     * @param oneType
     * @param preShape
     */
    outZD: function (oneType, preShape) {
        let newTbl = clone(oneType);
        let prePower = preShape.power;
        let outInfo = this.getBoomByPre(oneType, prePower);
        if (outInfo) {
            newTbl.outInfo = outInfo;
            return [newTbl];
        } else {
            return null;
        }
    },
    /**
     * 移除出牌
     * @param types
     */
    removeOutCards: function (types) {
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
                    for (let i = onLen - 1; i >= 0; i--) {
                        if (oneType[daiType][i].start == daiStart) {
                            oneType[daiType].splice(i, 1);
                            break;
                        }
                    }
                }
            }
            //console.log("去除要出的牌后 牌型为: " + JSON.stringify(oneType));
        }
    },
    /**
     * 获取带牌
     * @param type
     * @param ld
     * @param oneType
     * @returns {Array}
     */
    getDaiByPre: function (type, ld, oneType) {
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
                            dai.push({start: reDui[idx].start, num: 1, type: "dui"});
                            break;
                        }
                    }
                } else {
                    for (let idx = 0; idx < ld; idx++) {
                        dai.push({start: duiArray[idx].start, num: 1, type: "dui"});
                    }
                }
            }
        } else if (type == Enum.subShape.DAN) {
            // 优先带单牌 但是不带王(从经验判断很少有人带王, 如果三连和单牌一起冲突了，不能三代他自己)
            let count = ld * type;
            for (let idx = 0; idx < danLen; idx++) {
                let card = danArray[idx].start;
                if (card > 500) {
                    continue;
                }
                if(sanCards.indexOf(card) >= 0){
                    continue;
                }
                dai.push({start: card, num: 1, type: "dan"});
                count--;
                if (count == 0) {
                    break;
                }
            }
            // 对子要拆就拆完 要么就不拆 这里最多按 飞机带翅膀算
            if (count > 0 && duiLen > 0) {
                if (count % 2 == 0) {
                    if (duiLen * 2 >= count) {
                        let reDui = this.reLian(duiArray, 2);
                        for (let idx = 0; idx < reDui.length; idx++) {
                            if (reDui[idx].num == 1) {
                                dai.push({start: reDui[idx].start, num: 1, type: "dui"});
                                count -= 2;
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
    },
    /**
     * 重组连队
     */
    reLian: function (originArray, type) {
        let array = clone(originArray);
        let newArray = [];
        this.typeSort(array);
        if (type == 2) {
            if (array.length < 3) {
                return clone(array);
            }
        } else if (type == 3) {
            if (array.length < 2) {
                return clone(array);
            }
        } else {
            return;
        }
        let minL = type == 2 ? 3 : 2;
        let maxI = type == 2 ? 12 : 13;
        if (array[0].start == 1) {
            array.splice(0, 1);
            array.push({start: 14, num: 1});
        }
        let aLen = array.length;
        for (let idx = 0; idx < aLen;) {
            let oneType = array[idx];
            let count = 1;
            if (oneType.start >= 3 && oneType.start <= maxI) {
                let find = true;
                for (let loop = 0; loop < aLen; loop++) {
                    if (array[idx + 1 + loop]) {
                        if (array[idx + 1 + loop].start != oneType.start + loop + 1) {
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
        if (newArray[newArray.length - 1].start == 14) {
            newArray.pop();
            newArray.push({start: 1, num: 1});
            this.typeSort(newArray);
        }
        return newArray;
    },
    /**
     * 计算牌的分值
     * @param oneType
     */
    getFinaType: function (oneType) {
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
                    if (LD <= danNum) {
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
    },
    /**
     * 计算最终的分值
     * @param fina
     */
    calcFinaScore: function (fina) {
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
        fina.shou = shou;
        fina.value = value;
    },
    /**
     * 计算最终的分值(有上家牌)
     * @param fina
     */
    calcFinaScorePre: function (fina) {
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
    },
    /**
     * 获取带牌集合
     */
    getDaiSet: function (oneType) {
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
    },
    /**
     * 重组三代1 不连
     * @param daiSet
     * @param finaCards
     * @param card
     */
    compSanOne: function (daiSet, finaCards, card) {
        let daiFlag = false;
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
                    let daiArray = [daiCard];
                    if (type == 2) {
                        daiArray.push(daiCard);
                    }
                    daiFlag = true;
                    finaCards.san.push({start: card, ld: 1, dai: daiArray});
                    daiSet[idx].use = true;
                    break;
                }
            }
            if (!daiFlag) {
                finaCards.san.push({start: card, ld: 1, dai: []});
            }
        } else {
            finaCards.san.push({start: card, ld: 1, dai: []});
        }
    },
    /**
     * 重组三代1 连
     * @param daiSet
     * @param finaCards
     * @param card
     * @param LD
     * @param type
     */
    compSan: function (daiSet, finaCards, card, LD, type) {
        let daiArray = [];
        let uses = [];
        let dai = false;
        for (let sIdx = 0; sIdx < LD; sIdx++) {
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
    },
    /**
     * 数组排序
     * @param tbl
     */
    typeSort: function (tbl) {
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
    },
    /**
     * 权值排序
     * @param array
     */
    valueSort: function (tbl) {
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
    },
    /**
     * 验证函数
     */
    calcNum: function (oneType) {
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
    },
    /**
     * 验证函数
     * @param fina
     * @returns {number}
     */
    calcFinaNum: function (fina) {
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
    },
    /**
     * 验证函数
     * @param fina
     * @returns {number}
     */
    calcPreTypeNum: function (fina) {
        let num = 0;
        for (let idx in fina.dan) {
            num += fina.dan[idx].num * 1;
        }
        for (let idx in fina.dui) {
            num += fina.dui[idx].num * 2;
        }
        for (let idx in fina.san) {
            num += fina.san[idx].num * 3;
        }
        for (let idx in fina.four) {
            if (fina.four[idx].start < 500) {
                num += fina.four[idx].num * 4;
            } else {
                num += fina.four[idx].num * 2;
            }
        }
        for (let idx in fina.shun) {
            num += fina.shun[idx].num * 1;
        }
        let outInfo = fina.outInfo;
        let outType = outInfo.mainArray.type;
        if (outType == "dan") {
            num += outInfo.mainArray.num;
        } else if (outType == "dui") {
            num += outInfo.mainArray.num * 2;
        } else if (outType == "san") {
            num += outInfo.mainArray.num * 3;
        } else if (outType == "four") {
            if (outInfo.mainArray.start > 500) {
                num += outInfo.mainArray.num * 2;
            } else {
                num += outInfo.mainArray.num * 4;
            }
        } else if (outType == "shun") {
            num += outInfo.mainArray.num * 1;
        }
        let daiArray = outInfo.daiArray;
        if (daiArray) {
            for (let idx in daiArray) {
                let daiType = daiArray[idx].type;
                if (daiType == "dan") {
                    num += daiArray[idx].num;
                } else if (daiType == "dui") {
                    num += daiArray[idx].num * 2;
                }
            }
        }
        return num;
    },
    /**
     * 转化为客户端需要的牌型
     * @param cards
     * @param opts
     * @returns {{type, subType: number, num, power: number, cards: Array}}
     */
    optToShape: function (cards, opts) {
        let realPower = 0;
        let realCards = [];
        let num = opts.num;
        let type = opts.type;
        let simCards = opts.minCards;
        let simLen = simCards.length;
        let subType = Enum.subShape.NONE;
        if (type == Enum.shape.DAN) {
            let simCard = simCards[0];
            realPower = this.getPowerByRealPai(simCard);
            let paiInfo = this.owner.getPaiCount(cards, simCard, 1);
            realCards.push(paiInfo[0]);
        } else if (type == Enum.shape.DUI) {
            let maxPower = 0;
            for (let idx = 0; idx < simLen; idx++) {
                let simCard = simCards[idx];
                let curPower = this.getPowerByRealPai(simCard);
                if (curPower > maxPower) {
                    maxPower = curPower;
                }
                let paiInfo = this.owner.getPaiCount(cards, simCard, 2);
                for (let paiIdx = 0; paiIdx < paiInfo.length; paiIdx++) {
                    let pai = paiInfo[paiIdx];
                    if (realCards.indexOf(pai) == -1) {
                        realCards.push(pai);
                    }
                }
            }
            realPower = maxPower;
        } else if (type == Enum.shape.SAN_YI) {
            let maxPower = 0;
            for (let idx = 0; idx < simLen; idx++) {
                let simCard = simCards[idx];
                let curPower = this.getPowerByRealPai(simCard);
                if (curPower > maxPower) {
                    maxPower = curPower;
                }
                let paiInfo = this.owner.getPaiCount(cards, simCard, 3);
                for (let pIdx in paiInfo) {
                    let pai = paiInfo[pIdx];
                    if (realCards.indexOf(pai) == -1) {
                        realCards.push(pai);
                    }
                }
            }
            realPower = maxPower;
            let dai = opts.dai;
            if (dai.length > 0) {
                let daiLen = dai.length;
                subType = Enum.subShape.DAN;
                if (daiLen > Math.floor(simLen / 3)) {
                    subType = Enum.subShape.DUI;
                }
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
            let maxPower = 0;
            for (let idx = 0; idx < simLen; idx++) {
                let simCard = simCards[idx];
                let curPower = this.getPowerByRealPai(simCard);
                if (curPower > maxPower) {
                    maxPower = curPower;
                }
                let paiInfo = this.owner.getPaiCount(cards, simCard, 1);
                realCards.push.apply(realCards, paiInfo);
            }
            realPower = maxPower;
        } else if (type == Enum.shape.SI_ER) {
            //console.log("AI没有四代二");
        } else if (type == Enum.shape.ZD) {
            let simCard = simCards[0];
            realPower = this.getPowerByRealPai(simCard);
            if (simCard > 500) {
                realCards = [514, 614];
                realPower = this.getPowerByRealPai(614);
            } else {
                let paiInfo = this.owner.getPaiCount(cards, simCard, 4);
                realCards = paiInfo;
            }
        }
        let data = {type: type, subType: subType, num: num, power: realPower, cards: realCards};
        return data;
    },
    /**
     * 上一次家的出牌转化为通用牌型
     * @param cards
     * @param outInfo
     * @returns {{type: string, subType: (number|*), num: number, power: number, cards: Array}}
     */
    outToShape: function (cards, outInfo) {
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
                let paiInfo = this.owner.getPaiCount(cards, start, 1);
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
                    let paiInfo = this.owner.getPaiCount(cards, card, 2);
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
                    let paiInfo = this.owner.getPaiCount(cards, card, 3);
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
                            let paiInfo = this.owner.getPaiCount(cards, dStart, 1);
                            realCards.push.apply(realCards, paiInfo);
                        } else if (dType == "dui") {
                            let paiInfo = this.owner.getPaiCount(cards, dStart, 2);
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
                    let paiInfo = this.owner.getPaiCount(cards, start, 4);
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
                    let paiInfo = this.owner.getPaiCount(cards, card, 1);
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
    },
    /**
     * 检测函数
     * @param doshape
     * @param cards
     */
    checkShape: function (doshape, cards) {
        let checkCards = doshape.cards;
        for (let idx in checkCards) {
            let CC = checkCards[idx];
            if (cards.indexOf(CC) == -1) {
                ERROR("出错了 机器人 没有找到对应牌 doshape: " + JSON.stringify(doshape));
                ERROR("本来有的牌是 cards: " + JSON.stringify(cards));
                ERROR("上个玩家走的牌是" + JSON.stringify(this.owner.preShape));
                return false;
            }
        }
        return true;
    },
    /**
     * 出牌规则
     * @param preShape
     * @returns {boolean}
     */
    outRule:function(player, preShape) {
        if(preShape.type == Enum.shape.ZD){
            return false;
        }
        if(preShape.type == Enum.shape.SI_ER){
            return false;
        }
        let cLen = player.handCards.cards.length;
        if(preShape.type == Enum.shape.DUI && cLen == 4){
            return true;
        }
        if(preShape.type == Enum.shape.DAN && cLen == 2){
            return true;
        }
        if(preShape.type == Enum.shape.SAN_YI && cLen <= preShape.subType + 3 + 2){
            return true;
        }
        if(preShape.type == Enum.shape.SHUN && cLen <= preShape.num + 2){
            return true;
        }
        if(preShape.power >= 13){
            return false;
        }
        return true;
    },

    /**
     * 计算是否后续出牌
     * @param curPlayer
     */
    calcAfter:function(doShape, playerIndex){
        if(this.owner.prePlayer === 0){
            return true;
        }
        let curPlayer = this.owner.players[playerIndex];
        let prePlayer = this.owner.players[this.owner.prePlayer];
        let cLen = curPlayer.handCards.cards.length;   // 当前玩家有多少张牌
        let pLen = prePlayer.handCards.cards.length;
        if(cLen - doShape.cards.length <= 2){          // 自己走完只剩下1张或者2张牌就一定走牌
            return true;
        }
        if(playerIndex === prePlayer.index){           // 该自己走牌
            return true;
        }else {
            if(playerIndex === this.owner.farmer){     // 走牌的是地主
                if (doShape.type === Enum.shape.ZD) {  // 走的是炸弹
                    if (pLen <= 5){                    // 上个出牌的玩家牌少于5张 炸
                        return true;
                    }
                    if(cLen - doShape.cards.length <= 5){   // 自己炸了之后剩余牌小于5张 炸
                        return true;
                    }
                    return false;
                }else if(doShape.type === Enum.shape.DAN){  // 走的牌是张单牌
                    if(doShape.power === 614){
                        if (pLen < 8){                     // 上个出牌的玩家牌多于10张就走
                            return true;
                        }
                        if(cLen < 6){                       // 自己少于于8张 也不炸
                            return true;
                        }
                        return false;
                    }else if(doShape.power === 514){
                        if (pLen < 10){                    // 上个出牌的玩家牌多于10张就走
                            return true;
                        }
                        if(cLen < 8){                       // 自己少于于8张 也不炸
                            return true;
                        }
                        return false;
                    }
                    return true;
                }
                return true;
            }else{
                if (this.owner.prePlayer === this.owner.farmer) { // 上家走牌的是地主
                    if (doShape.type === Enum.shape.ZD) {         // 自己摸的是炸弹
                        if (cLen - doShape.cards.length <= 5) {
                            return true;
                        }
                        if (pLen < 8) {
                            return true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    let preShape = this.owner.preShape;
                    if (prePlayer == null || preShape == null) {
                        return true;
                    }
                    if (pLen == 1 || pLen == 2) {     // 对家只剩下1、2张牌的时候自己不出
                        return false;
                    }
                    if (preShape.type === Enum.shape.SHUN && preShape.power >= 10) {                              // 顺在且威力大于10 自己不出
                        return false;
                    }
                    if (preShape.type === Enum.shape.SAN_YI && preShape.power >= 10) {                            // 三代一威力大于10 自己不出
                        return false;
                    }
                    if (doShape.type === Enum.shape.ZD) {                                                         // 理论上不炸对家的牌
                        return false;
                    }
                    if (doShape.type === Enum.shape.DUI && doShape.power >= 12) {
                        return false;
                    }
                    return true;
                }
            }
        }
    },
    /**
     * 计算是否需要管住上家的牌
     */
    calcIsOut:function (curPlayer) {
        let preShape = this.owner.preShape;
        if(preShape == null){
            return true;
        }
        let player = this.owner.players[curPlayer];
        if(curPlayer == this.owner.farmer){                 // 出牌人是地主
            return true;
        }else{
            if(this.owner.prePlayer == this.owner.farmer){
                return true;
            }else{
                return this.outRule(player, preShape);
            }
        }
    },
    /**
     *
     * @param originCards       // 原来的牌
     * @param outCards          // 现在的牌
     * @param prePaiScore       // 没出之前的牌型分
     */
    getPlusPaiScoreIsOut(originCards, outCards, prePaiScore){
        let cards = [];
        for(let idx in originCards){
            let card = originCards[idx];
            if(outCards.indexOf(card) === -1){
                cards.push(card);
            }
        }
        let afterPaiScore = this.getPaiScore(cards);
        if(afterPaiScore && prePaiScore){
            if(afterPaiScore.shou <= prePaiScore.shou + 1){
                return true;
            }else{
                return false;
            }
        }
        return true;
    },
    /**
     * AI 入口函数
     * @param cards
     */
    selectPai: function (curPlayer) {
        let player = this.owner.players[curPlayer];
        let cards = player.handCards.cards;
        // let cards = [103,203,303,109,110,111,112,113];
        let out = this.calcIsOut(curPlayer);
        if(!out){
            return null;
        }
        let prePaiScore = this.getPaiScore(cards);
        let doShape = null;
        // 方案一 优化无关牌 但是会造成不会拆 3连的无关牌
        /**
         let wg = this.getWGP(cards);
         let sets = this.groupSet(cards, wg);
         let allTypes = this.subGroup(sets.ygSet);
         allTypes = this.addWgToAllTypes(allTypes, cards, sets.wgSet);
         */
        // 方案二 会拆所有牌 但是牌型会比方案一多很多类型的牌
        let allTypes = this.subGroup(cards);
        allTypes = this.addWgToAllTypes(allTypes, cards, []);
        if (this.owner.preShape == null) {
            let allFinaTypes = this.getFinaAllType(allTypes, cards);
            let optType = this.getOptType(allFinaTypes);
            let optCards = this.getOptCards(optType);
            doShape = this.optToShape(cards, optCards);
        } else {
            let allFinaTypesPre = this.getFinaAllTypeByPre(allTypes, this.owner.preShape, cards);
            if (allFinaTypesPre.length == 0) {
                //console.log("要不起");
                return null;
            }
            let optTypePre = this.getOptType(allFinaTypesPre);
            let outInfo = optTypePre.outInfo;
            doShape = this.outToShape(cards, outInfo);
        }
        let check = this.checkShape(doShape, cards);
        if(check === false) return null;
        let isOut = this.calcAfter(doShape, curPlayer);
        if(isOut) {
            if(this.getPlusPaiScoreIsOut(cards, doShape.cards, prePaiScore)){
                return doShape;
            }
        }
        return null;
    },
    /**
     * 获取牌型分
     */
    getPaiScore:function (cards) {
        let allTypes = this.subGroup(cards);
        allTypes = this.addWgToAllTypes(allTypes, cards, []);
        let allFinaTypes = this.getFinaAllType(allTypes, cards);
        let optType = this.getOptType(allFinaTypes);
        if(optType) {
            return {value: optType.value, shou: optType.shou};
        }else{
            return null;
        }
    }
};

exports.AI = AI;
