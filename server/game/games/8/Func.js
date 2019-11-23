let CommFuc = require("../../../util/CommonFuc.js");
let Enum    = require("./Enum.js");
/**
 * 胡牌判定
 * @param handCards
 * @returns {*}
 */
function huPai(handCards) {
    handCards.JP = null;
    if(handCards.isHaveDQCard()){
        return null;
    }
    //对对胡
    let dui = isDui(handCards);
    if (dui != null) {
        return dui;
    }
    //平胡
    let ping = isPinghu(handCards);
    if (ping != null) {
        return ping;
    }
    return null;
}
/**
 * 是否对胡
 * @param handCards
 * @returns {*}
 */
function isDui(handCards) {
    let duiCount = 0;
    let TDW = handCards.mjs;
    for (let typeIndex = 0; typeIndex < 3; typeIndex++) {
        for (let numIndex = 0; numIndex < 9; numIndex++) {
            let count = TDW[typeIndex][numIndex];
            if (count > 0) {
                if (count == 2) {
                    duiCount++;
                } else if (count == 4) {
                    duiCount += 2;
                }else{
                    return null;
                }
            }
        }
    }
    if (duiCount == 7) {
        return Enum.HuType.QI_XIAO_DUI;
    }
    return null;
}
/**
 * 是否平胡
 * @param handCards
 * @returns {*}
 */
function isPinghu(handCards) {
    let TDW = handCards.mjs;
    let maxMult = 0;
    let tempJP = null;
    for (let typeIndex = 0; typeIndex < 3; typeIndex++) {
        for (let numIndex = 0; numIndex < 9; numIndex++) {
            if (TDW[typeIndex][numIndex] > 1) {
                let CTDW = CommFuc.cpMj(TDW);
                let typeMjs = CTDW[typeIndex];
                handCards.JP = (typeIndex + 1) * 10 + numIndex + 1;
                typeMjs[numIndex] -= 2;
                if (threeGroupAble(typeMjs) && threeGroupAble(CTDW[(typeIndex + 1) % 3]) && threeGroupAble(CTDW[(typeIndex + 2) % 3])) {
                    let mult = handCards.calcHuFan();
                    if(maxMult < mult) {
                        tempJP = (typeIndex + 1) * 10 + numIndex + 1;
                    }
                }
            }
        }
    }
    handCards.JP = tempJP;
    if(tempJP){
        return Enum.HuType.PING;
    }
    return null;
}
/**
 * 移除顺刻
 * @param typeMjs
 * @returns {boolean}
 */
function threeGroupAble(typeMjs) {
    for (let numIndex = 0; numIndex < 9; numIndex++) {
        if (!threeGroupAbl(typeMjs, numIndex)) {
            return false;
        }
    }
    return true;
}

/**
 * 同种麻将是否满足3n(3顺和3刻)
 * @param typeMjs
 * @param numIndex
 * @returns {*}
 */
function threeGroupAbl(typeMjs, numIndex) {
    let count = typeMjs[numIndex];
    if (count == 1) {
        return removeShun(typeMjs, numIndex);
    } else if (count == 2) {
        return removeShun(typeMjs, numIndex) && removeShun(typeMjs, numIndex);
    } else if (count == 3) {
        return removeKe(typeMjs, numIndex);
    } else if (count == 4) {
        let shunAble = removeShun(typeMjs, numIndex);
        if(shunAble){
            return removeKe(typeMjs, numIndex)
        }
    }
    return true;
}
/**
 * 获取数组中的最大值
 * @param Array
 * @returns {*}
 */
function getArrayMax(Array) {
    let max = Array[0];
    for(let i = 1; i < Array.length; i++){
        if( max < Array[i] ){
            max = Array[i];
        }
    }
    return max;
}
/**
 * 获取数组中的最大下标
 * @param Array
 * @param Exclude
 * @returns {number}
 */
function getArrayMax_idx(Array, Exclude) {
    let max = -1;
    let max_idx = -1;
    for(let i = 0; i < Array.length; i++){
        if(max <= Array[i] && Array[i] != 0){
            if(Exclude.indexOf(i) == -1){
                max = Array[i];
                max_idx = i;
            }
        }
    }
    return max_idx;
}
/**
 * 移除三顺
 * @param typeMjs
 * @param numIndex
 * @returns {boolean}
 */
function removeShun(typeMjs, numIndex) {
    if (numIndex > 6 || typeMjs[numIndex] == 0 || typeMjs[numIndex + 1] == 0 || typeMjs[numIndex + 2] == 0) {
        return false;
    }
    typeMjs[numIndex]--;
    typeMjs[numIndex + 1]--;
    typeMjs[numIndex + 2]--;
    return true;
}

/**
 * 移除刻
 * @param typeMjs
 * @param numIndex
 * @returns {boolean}
 */
function removeKe(typeMjs, numIndex) {
    if (typeMjs[numIndex] < 3) {
        return false;
    }
    typeMjs[numIndex] -= 3;
    return true;
}

/**
 * 移除对
 * @param typeMjs
 * @param numIndex
 * @returns {boolean}
 */
function removeDui(typeMjs, numIndex) {
    if (typeMjs[numIndex] < 2) {
        return false;
    }
    typeMjs[numIndex] -= 2;
    return true;
}
/**
 * 数组减少某些牌
 * @param Array
 * @param mjId
 * @param type
 */
function reduceArray(Array, mjId, type) {
    for(let i = 0; i < Array.length; i++){
        if(i+(100*type) == mjId){
            Array[i] -= 2;
        }
    }
}


exports.huPai = huPai;
exports.getArrayMax = getArrayMax;
exports.getArrayMax_idx = getArrayMax_idx;
exports.removeShun = removeShun;
exports.removeKe = removeKe;
exports.reduceArray = reduceArray;
exports.removeDui = removeDui;
