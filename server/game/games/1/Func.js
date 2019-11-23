let CommFuc = require("../../../util/CommonFuc.js");
let Enum    = require("./Enum.js");
/**
 * 是否能胡牌
 * @param handCards
 * @returns {boolean}
 */
function isCanHu(handCards) {
    let playNum = handCards.owner.owner.playNum;
    // 门清
    if(handCards.menQing){
        return true;
    }
    // 自摸胡牌
    if(handCards.zmHu){
        return true;
    }
    // 有眼
    if((handCards.JP % 10 == 2 || handCards.JP % 10 == 5 || handCards.JP % 10 == 8) && handCards.JP < 40){
        return true;
    }
    // 只吃不碰
    if(Object.keys(handCards.peng_mjs).length == 0 && Object.keys(handCards.gang_mjs).length == 0){
        if(!(handCards.JP == Enum.Id2Winds[playNum][handCards.owner.index] || handCards.JP == 51 || handCards.JP == 52 || handCards.JP == 53)){
            if(isAllShun(handCards)) {
                return true;
            }
        }
    }
    // 箭刻牌
    for(let idx = 0; idx < 3; idx++){
        if(handCards.mjs_ZFB[idx] >= 3){
            return true;
        }
        if(handCards.peng_mjs[51 + idx] || handCards.gang_mjs[51 + idx]){
            return true;
        }
    }
    // 风刻牌
    let card = Enum.Id2Winds[playNum][handCards.owner.index];
    if(handCards.mjs_DNXB[handCards.owner.index - 1] >= 3 || handCards.peng_mjs[card] || handCards.gang_mjs[card]){
        return true;
    }
    // 令牌
    let season = handCards.owner.owner.season;
    if(season != -1){
        card = season + 41;
        if(handCards.mjs_DNXB[season] >= 3 || handCards.peng_mjs[card] || handCards.gang_mjs[card]){
            return true;
        }
    }
    // 混一色
    if(handCards.isHunYiSe()){
        return true;
    }
    // 翻花对位
    let index = handCards.owner.index;
    let cards = Enum.Id2Huas[playNum][index];
    for(let idx = 0; idx < handCards.flowered.length; idx++){
        let card = handCards.flowered[idx];
        if(cards.indexOf(card) != -1){
            return true;
        }
    }
    // 有杠
    if(Object.keys(handCards.gang_mjs).length > 0){
        return true;
    }
    if(handCards.isPengPengHu()){
        return true;
    }
    return false;
}
/**
 * 是否抢杠胡
 * @param handCards
 * @returns {boolean}
 */
function isGrabGH(handCards) {
    // 无番
    if(!handCards.owner.owner.opts.isYF){
        return true;
    }
    if(handCards.owner.owner.calcGangHuing){
        return true;
    }
    // 过路杠
    if(handCards.owner.owner.grabPassRoad){
        return true;
    }
    return false;
}
/**
 * 检测牌是否全为顺牌
 * @param handCards
 * @param JP
 * @returns {boolean}
 */
function isAllShun(handCards) {
    let CTDW = CommFuc.cpMj(handCards.mjs_TDW);
    let CDNXB = CommFuc.copyArray(handCards.mjs_DNXB);
    let CZFB = CommFuc.copyArray(handCards.mjs_ZFB);
    removeJP(CTDW, CDNXB, CZFB, handCards.JP);
    for (let typeIndex = 0; typeIndex < 3; typeIndex++) {
        for (let numIndex = 0; numIndex < 9; numIndex++) {
            let count = CTDW[typeIndex][numIndex];
            for(let loop = 0; loop < count; loop++) {
                removeShun(CTDW[typeIndex], numIndex);
            }
        }
    }
    for (let typeIndex = 0; typeIndex < 3; typeIndex++) {
        for (let numIndex = 0; numIndex < 9; numIndex++) {
            if(CTDW[typeIndex][numIndex] >= 3){
                return false;
            }
        }
    }
    for(let idx = 0; idx < 4; idx++){
        if(CDNXB[idx] >= 3){
            return false;
        }
    }
    for(let idx = 0; idx < 3; idx++){
        if(CZFB[idx] >= 3){
            return false;
        }
    }
    return true;
}
/**
 * 移除将牌
 * @param CTDW
 * @param CDNXB
 * @param CZFB
 * @param JP
 */
function removeJP(CTDW, CDNXB, CZFB, JP) {
    for(let iType  = 0; iType < 3; iType++){
        for(let iNum = 0; iNum < 9; iNum++){
            let mjId = (iType + 1) * 10 + iNum + 1;
            if(mjId == JP){
                CTDW[iType][iNum] -= 2;
                return;
            }
        }
    }
    for(let iNum = 0; iNum < 4; iNum++){
        let mjId = 40 + iNum + 1;
        if(mjId == JP){
            CDNXB[iNum] -= 2;
            return;
        }
    }
    for(let iNum = 0; iNum < 3; iNum++){
        let mjId = 50 + iNum + 1;
        if(mjId == JP){
            CZFB[iNum] -= 2;
            return;
        }
    }
}
/**
 * 胡牌判定
 * @param handCards
 * @returns {*}
 */
function huPai(handCards) {
    handCards.JP = null;
    //特殊牌型十三幺
    let shiSanYao = isShiSanYao(handCards);
    if(shiSanYao){
        return shiSanYao;
    }
    //对对胡
    let dui = isDui(handCards);
    if (dui != null) {
       return dui;
    }
    //平胡
    let ping = isPinghu(handCards);
    if (ping != null) {
        if(isCanHu(handCards) || isGrabGH(handCards)){
            return ping;
        }
    }
    return null;
}
/**
 * 十三幺
 * @param handCards
 * @returns {*}
 */
function isShiSanYao(handCards) {
    let TDW = handCards.mjs_TDW;
    for(let typeIndex = 0; typeIndex < 3; typeIndex++){
        for(let numberIndex = 0; numberIndex < 2; numberIndex++){
            if(!(TDW[typeIndex][numberIndex * 8] == 1 || TDW[typeIndex][numberIndex * 8] == 2)){
                return null;
            }
        }
        for(let i = 1; i < 8; i++){
            if(TDW[typeIndex][i]){
                return null;
            }
        }
    }
    let DNXB = handCards.mjs_DNXB;
    for(let numberIndex = 0; numberIndex < 4; numberIndex++){
        if(!(DNXB[numberIndex] == 1 || DNXB[numberIndex] == 2)){
            return null;
        }
    }
    let ZFB = handCards.mjs_ZFB;
    for(let numberIndex = 0; numberIndex < 3; numberIndex++){
        if(!(ZFB[numberIndex] == 1 || ZFB[numberIndex] == 2)){
            return null;
        }
    }
    return Enum.HuType.SHI_SAN_YAO;
}
/**
 * 是否对胡
 * @param handCards
 * @returns {*}
 */
function isDui(handCards) {
    let duiCount = 0;
    let DNXB = handCards.mjs_DNXB;
    let TDW = handCards.mjs_TDW;
    let ZFB = handCards.mjs_ZFB;
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
    for (let idx = 0; idx < 4; idx++) {
        let count = DNXB[idx];
        if(count > 0) {
            if (count == 2) {
                duiCount++;
            } else if (count == 4) {
                duiCount += 2;
            }else{
                return null;
            }
        }
    }
    for(let idx = 0; idx < 3; idx++) {
        let count = ZFB[idx];
        if(count > 0) {
            if (count == 2) {
                duiCount++;
            } else if (count == 4) {
                duiCount += 2;
            }else{
                return null;
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
    let TDW = handCards.mjs_TDW;
    let DNXB = handCards.mjs_DNXB;
    let ZFB = handCards.mjs_ZFB;
    for (let typeIndex = 0; typeIndex < 3; typeIndex++) {
        for (let numIndex = 0; numIndex < 9; numIndex++) {
            if (TDW[typeIndex][numIndex] > 1) {
                let CTDW = CommFuc.cpMj(TDW);
                let typeMjs = CTDW[typeIndex];
                handCards.JP = (typeIndex + 1) * 10 + numIndex + 1;
                typeMjs[numIndex] -= 2;
                if (threeGroupAble(typeMjs) && threeGroupAble(CTDW[(typeIndex + 1) % 3]) && threeGroupAble(CTDW[(typeIndex + 2) % 3]) && windAble(DNXB) && wordAble(ZFB)) {
                    return Enum.HuType.PING;
                }
            }
        }
        for(let numIndex = 0; numIndex < 4; numIndex++){
            if(DNXB[numIndex] > 1){
                let CDNXB = CommFuc.copyArray(DNXB);
                let CTDW = CommFuc.cpMj(TDW);
                handCards.JP = 41 + numIndex;
                CDNXB[numIndex] -= 2;
                if (threeGroupAble(CTDW[0]) && threeGroupAble(CTDW[1]) && threeGroupAble(CTDW[2]) && windAble(CDNXB) && wordAble(ZFB)) {
                    return Enum.HuType.PING;
                }
            }
        }
        for(let numIndex = 0; numIndex < 3; numIndex++){
            if(ZFB[numIndex] > 1){
                let CZFB = CommFuc.copyArray(ZFB);
                let CTDW = CommFuc.cpMj(TDW);
                handCards.JP = 51 + numIndex;
                CZFB[numIndex] -= 2;
                if (threeGroupAble(CTDW[0]) && threeGroupAble(CTDW[1]) && threeGroupAble(CTDW[2]) && windAble(DNXB) && wordAble(CZFB)) {
                    return Enum.HuType.PING;
                }
            }
        }
    }
    return null;
}
/**
 * 是否风牌
 * @param typeMjs
 * @returns {boolean}
 */
function windAble(typeMjs) {
    for (let idx = 0; idx < 4; idx++){
        let count = typeMjs[idx];
        if(count == 1 ||  count == 2 || count == 4){
            return false;
        }
    }
    return true;
}
/**
 * 自否自牌
 * @param typemjs
 * @returns {boolean}
 */
function wordAble(typemjs) {
    for(let idx = 0; idx < 3; idx++){
        let count = typemjs[idx];
        if(count == 1 ||  count == 2 || count == 4){
            return false;
        }
    }
    return true;
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
exports.isCanHu = isCanHu;
