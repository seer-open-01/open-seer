/**
 * Created by Jiyou Mo on 2017/10/25.
 */

// 规则具体算法
//所有规则中的myCheckCards.cards 都是经过按 compareValue 升序排序的


// === 有癞子的算法 ===========================================================
/**
 * 单牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_danPai = function(myCheckCards, rValue) {
    if (1 != myCheckCards.cardsCount) {
        return;
    }

    if (0 == myCheckCards.laiziNum) {
        myCheckCards.type = rValue;
        myCheckCards.maxCard = myCheckCards.cards[0];
        this._addResult(myCheckCards);
    }
};

/**
 * 对子
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_duiZi = function(myCheckCards, rValue) {
    if (2 != myCheckCards.cardsCount) {
        return;
    }

    if (2 != myCheckCards.laiziNum) {
        var cards = myCheckCards.cards;
        var isMatch = false;
        if (1 == myCheckCards.laiziNum) {
            // this.printLog("癞对子");
            cards[0].replaceValue = cards[1].originValue;
            isMatch = true;
        } else if (0 == myCheckCards.laiziNum) {
            if (cards[0].compareValue == cards[1].compareValue) {
                // this.printLog("普通对子");
                isMatch = true;
            }
        }

        if (isMatch) {
            myCheckCards.maxCard = myCheckCards.cards[1];
            myCheckCards.type = rValue;
            this._addResult(myCheckCards);
        }
    }
};

/**
 * 王炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_wangZha = function(myCheckCards, rValue) {
    if (2 != myCheckCards.cardsCount) {
        return;
    }

    var cards = myCheckCards.cards;
    if (cards[1].originValue == 2 && cards[0].originValue == 3) {
        myCheckCards.maxCard = myCheckCards.cards[1];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 三条
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_sanTiao = function(myCheckCards, rValue) {
    if (3 != myCheckCards.cardsCount || 3 == myCheckCards.laiziNum) {
        return;
    }

    var cards = myCheckCards.cards;
    var isMatch = false;
    if (2 == myCheckCards.laiziNum) {
        cards[0].replaceValue = cards[2].originValue;
        cards[1].replaceValue = cards[2].originValue;
        isMatch = true;
    } else if (1 == myCheckCards.laiziNum) {
        if (cards[1].compareValue == cards[2].compareValue) {
            cards[0].replaceValue = cards[1].originValue;
            isMatch = true;
        }
    } else if (0 == myCheckCards.laiziNum) {
        if (cards[1].compareValue == cards[0].compareValue
            && cards[1].compareValue == cards[2].compareValue) {
            isMatch = true;
        }
    }

    if (isMatch) {
        myCheckCards.maxCard = myCheckCards.cards[2];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 三带一
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_sanDaiYi = function(myCheckCards, rValue) {
    if (4 != myCheckCards.cardsCount || 3 <= myCheckCards.laiziNum) {
        return;
    }

    var cards = myCheckCards.cards;
    var isMatch = false;
    var backupCheckCards = null;

    if (2 == myCheckCards.laiziNum && cards[3].compareValue != cards[2].compareValue) {
        backupCheckCards = this.clone(myCheckCards);
        cards[0].replaceValue = cards[2].originValue;
        cards[1].replaceValue = cards[2].originValue;
        myCheckCards.maxCard = myCheckCards.cards[2];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);

        cards = backupCheckCards.cards;
        cards[0].replaceValue = cards[3].originValue;
        cards[1].replaceValue = cards[3].originValue;
        backupCheckCards.maxCard = backupCheckCards.cards[3];
        backupCheckCards.type = rValue;
        this._addResult(backupCheckCards);
        return;
    } else if (1 == myCheckCards.laiziNum) {
        if (cards[1].compareValue == cards[2].compareValue && cards[2].compareValue != cards[3].compareValue) {
            cards[0].replaceValue = cards[2].originValue;
            myCheckCards.maxCard = myCheckCards.cards[2];
            isMatch = true;
        } else if (cards[1].compareValue != cards[2].compareValue && cards[2].compareValue == cards[3].compareValue) {
            cards[0].replaceValue = cards[2].originValue;
            myCheckCards.maxCard = myCheckCards.cards[2];
            isMatch = true;
        }
    } else if (0 == myCheckCards.laiziNum) {
        if (cards[0].compareValue == cards[1].compareValue
                && cards[1].compareValue == cards[2].compareValue
                && cards[2].compareValue != cards[3].compareValue) {
            myCheckCards.maxCard = myCheckCards.cards[2];
            isMatch = true;
        } else if (cards[3].compareValue == cards[2].compareValue
                && cards[2].compareValue == cards[1].compareValue
                && cards[1].compareValue != cards[0].compareValue) {
            myCheckCards.maxCard = myCheckCards.cards[3];
            isMatch = true;
        }
    }

    if (isMatch) {
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 双癞炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_shuangLaiZha = function(myCheckCards, rValue) {
    if (2 != myCheckCards.cardsCount) {
        return;
    }

    if (2 == myCheckCards.laiziNum) {
        // this.printLog("双癞炸");
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 三癞炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_sanLaiZha = function(myCheckCards, rValue) {
    if (3 != myCheckCards.cardsCount) {
        return;
    }

    if (3 == myCheckCards.laiziNum) {
        // this.printLog("三癞炸");
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 三张炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_sanZhangZha = function(myCheckCards, rValue) {
    this.rule_zhaDan(myCheckCards, rValue);
};

/**
 * 四张炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_siZhangZha = function(myCheckCards, rValue) {
    this.rule_zhaDan(myCheckCards,rValue);
};

/**
 * 五张炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_wuZhangZha = function(myCheckCards, rValue) {
    this.rule_zhaDan(myCheckCards,rValue);
};

/**
 * 六张炸
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_liuZhangZha = function(myCheckCards, rValue) {
    this.rule_zhaDan(myCheckCards, rValue);
};

// === 无癞子的算法 ===========================================================

/**
 * 三带一对
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_sanDaiYiDui = function(myCheckCards, rValue) {
    if (5 != myCheckCards.cardsCount) {
        return;
    }
    var cards = myCheckCards.cards;
    //前三张一样，后两张一样
    var isSanTiao = (cards[0].compareValue == cards[1].compareValue && cards[1].compareValue == cards[2].compareValue);
    var isDuiZi = (cards[2].compareValue != cards[3].compareValue && cards[3].compareValue == cards[4].compareValue);
    if (isSanTiao && isDuiZi) {
        myCheckCards.type = rValue;
        myCheckCards.maxCard = cards[2];
        this._addResult(myCheckCards);
        return;
    }

    //前两张一样，后三张一样
    isSanTiao = (cards[2].compareValue == cards[3].compareValue && cards[3].compareValue == cards[4].compareValue);
    isDuiZi = (cards[2].compareValue != cards[1].compareValue && cards[0].compareValue == cards[1].compareValue);
    if (isSanTiao && isDuiZi) {
        myCheckCards.type = rValue;
        myCheckCards.maxCard = cards[2];
        this._addResult(myCheckCards);
    }
};

/**
 * 检测四带二，适用于无癞子的牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_siDaiEr = function(myCheckCards, rValue) {
    if (myCheckCards.cardsCount != 6) {
        return;
    }
    var cards = myCheckCards.cards;
    var isMatch = false;
    for (var i = 0; i <= cards.length - 4; ++i) {
        isMatch = true;
        for (var j = i ; j < i + 3; ++j) {
            if (cards[j].compareValue != cards[j + 1].compareValue) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            myCheckCards.maxCard = myCheckCards.cards[i];
            break;
        }
    }

    if (isMatch) {
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

// === 以下是任意张数量的牌型规则 ===========================================================
/**
 * 三顺
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_sanShun = function(myCheckCards, rValue) {
    if (myCheckCards.cardsCount < 6 || 0 != myCheckCards.cardsCount % 3) {
        return;
    }

    var cards = myCheckCards.cards;
    var count = 0;
    var cardsValue = this._copyCardsValue();
    var checkFeiJi = myCheckCards.cardsCount / 3;   //检测组成飞机的三条的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
            }
        }
    }

    for (i = 0 ; i <= cardsValue.length - checkFeiJi; ++i) {
        count = 0;
        for (k = i; k < i + checkFeiJi; ++k) {
            if (3 <= cardsValue[k].num) {
                count += 3;
                if (count == checkFeiJi * 3) {
                    for (var n = 0; n < cards.length; ++n) {
                        if (cards[n].compareValue == cardsValue[k].compareValue) {
                            myCheckCards.maxCard = myCheckCards.cards[n];
                            myCheckCards.type = rValue;
                            this._addResult(myCheckCards);
                            return;
                        }
                    }
                }
            }
        }
        //this.printLog("当前检测到 " + cardsValue[i].compareValue);
        //this.printLog("有效牌数量 = " + count);
    }
};

/**
 * 检测飞机，适用于任意张数量且无癞子的牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_feiJi = function(myCheckCards, rValue) {
    if (myCheckCards.cardsCount < 8 || 0 != myCheckCards.cardsCount % 4) {
        return;
    }

    var cards = myCheckCards.cards;
    var count = 0;
    var cardsValue = this._copyCardsValue();
    var checkFeiJi = Math.floor(myCheckCards.cardsCount * 0.25);   //检测组成飞机的三条的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
            }
        }
    }

    for (i = 0; i <= cardsValue.length - checkFeiJi; ++i) {
        count = 0;
        for (k = i; k < i + checkFeiJi; ++k) {
            if (3 <= cardsValue[k].num) {
                count += 3;
                if (count == checkFeiJi * 3) {
                    for (var n = 0; n < cards.length; ++n) {
                        if (cards[n].compareValue == cardsValue[k].compareValue) {
                            myCheckCards.maxCard = myCheckCards.cards[n];
                            myCheckCards.type = rValue;
                            this._addResult(myCheckCards);
                            return;
                        }
                    }
                }
            }
        }
        //this.printLog("当前检测到 " + cardsValue[i].compareValue);
        //this.printLog("有效牌数量 = " + count);
    }
};

/**
 * 飞机带队 三带二
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_feiJiDaiDui = function(myCheckCards, rValue) {
    if (myCheckCards.cardsCount < 10 || 0 != myCheckCards.cardsCount % 5) {
        return;
    }

    var tCount = 0;
    var backupCheckCards = this.clone(myCheckCards);
    var cards = backupCheckCards.cards;
    var cardsValue = this._copyCardsValue();
    var checkFeiJi = Math.floor(backupCheckCards.cardsCount * 0.2);   //检测组成飞机的三条的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
            }
        }
    }

    var maxValue = 0;
    var pCount = 0;
    for (i = 0 ; i < cardsValue.length; ++i) {
        if (2 == cardsValue[i].num || 4 == cardsValue[i].num) {
            pCount += Math.floor(cardsValue[i].num * 0.5);
        }
    }

    //检测是否有2
    var num2 = 0;
    for (i = 0; i < cards.length; ++i) {
        if (this.cardValue["2"] == cards[i].compareValue) {
            num2++;
        }
    }

    if (2 == num2 || 4 == num2) {
        pCount += Math.floor(num2 * 0.5);
    }

    for (i = 0 ; i <= cardsValue.length - checkFeiJi; ++i) {
        tCount = 0;
        maxValue = 0;
        for (k = i; k < i + checkFeiJi; ++k) {
            if (3 == cardsValue[k].num) {
                tCount += 1;
                maxValue = cardsValue[k].compareValue;
            }
        }

        if (tCount == pCount && tCount == checkFeiJi) {
            for (var n = 0; n < cards.length; ++n) {
                if (cards[n].compareValue == maxValue) {
                    backupCheckCards.maxCard = backupCheckCards.cards[n];
                    backupCheckCards.type = rValue;
                    this._addResult(backupCheckCards);
                    //this.printLog("当前检测到 " + cardsValue[i].compareValue);
                    //this.printLog("有效牌数量 = " + count);
                    return;
                }
            }
        }
    }
};

/**
 * 四带两对
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_siDaiLiangDui = function(myCheckCards, rValue) {
    if (myCheckCards.cardsCount != 8) {
        return;
    }

    var tmpCards = [];
    var cards = myCheckCards.cards;
    for (var i = 0; i < cards.length; ++i) {
        tmpCards.push(cards[i].originValue);
    }

    var fullFormatCards = this.getFullFormatCards(tmpCards);
    var twoCards = fullFormatCards.TwoCards;
    var fourCards = fullFormatCards.FourCards;
    var fc = 0;
    var maxValue = 0;
    if (2 == twoCards.length && 1 == fourCards.length) {
        fc = fourCards[0];
        maxValue = fc[3];
        for (var k = 0; k < cards.length; ++k) {
            if (maxValue == cards[k].originValue) {
                myCheckCards.maxCard = myCheckCards.cards[k];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
                break;
            }
        }
    } else if (2 == fourCards.length) {
        fc = fourCards[1];
        maxValue = fc[3];
        for (k = 0; k < cards.length; ++k) {
            if (maxValue == cards[k].originValue) {
                myCheckCards.maxCard = myCheckCards.cards[k];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
                break;
            }
        }
    }
};

/**
 * 检测顺子，适用于任意张数量的牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_shunZi = function (myCheckCards, rValue) {
    if (myCheckCards.cardsCount < this.minCardsNumWithStraight || 1 == myCheckCards.cardNum) {
        return;
    }

    var cards = myCheckCards.cards;
    var cardsValue = this._copyCardsValue();
    var checkShunZiNum = myCheckCards.cardsCount;
    var backupCheckCards = null;
    for(var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                //this.printLog("牌" + cardsValue[i].compareValue + "].originValue = " + cardsValue[i].originValue);
                cardsValue[i].num++;
                if (cardsValue[i].num > 1) {
                    return;
                }
            }
        }
    }

    // 检测有效牌数量
    for (i = 0 ; i <= cardsValue.length - checkShunZiNum; ++i) {
        var count = 0;      //有效牌数量
        backupCheckCards = this.clone(myCheckCards);
        cards = backupCheckCards.cards;
        for (k = i ; k < i + checkShunZiNum; ++k) {
            count += cardsValue[k].num;
        }
        // this.printLog("当前检测到 " + cardsValue[i].compareValue);
        // this.printLog("有效牌数量 = " + count);
        if (count + backupCheckCards.laiziNum == backupCheckCards.cardsCount) {
            var suffix = 0;
            for (k = i ; k < i + checkShunZiNum; ++k) {
                if (cardsValue[k].num == 0) {
                    cards[suffix++].replaceValue = cardsValue[k].originValue;
                }

                if(suffix > backupCheckCards.laiziNum) {
                    break;
                }
            }
            //this.printLog("顺子");
            backupCheckCards.type = rValue;
            this._addResult(backupCheckCards);
        }
    }
};

/**
 * 检测连对，适用于任意张数量的牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_lianDui = function(myCheckCards, rValue) {
    if(1 == myCheckCards.cardsCount % 2 || myCheckCards.cardsCount / 2 < this.minStrPairNum) {
        return;
    }

    var cards = myCheckCards.cards;
    var cardsValue = this._copyCardsValue();
    var checkLianDui = myCheckCards.cardsCount / 2;   //检测连对的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
                if (cardsValue[i].num > 2) {
                    return;
                }
            }
        }
    }

    for (i = 0 ; i <= cardsValue.length - checkLianDui; ++i) {
        var count = 0;
        for (k = i; k < i + checkLianDui; ++k) {
            count += cardsValue[k].num;
        }
        // this.printLog("当前检测到 " + cardsValue[i].compareValue);
        // this.printLog("有效牌数量 = " + count);
        if (myCheckCards.laiziNum + count == myCheckCards.cardsCount) {
            var suffix = 0;
            var backupCheckCards = this.clone(myCheckCards);
            cards = backupCheckCards.cards;
            for (k = i; k < i + checkLianDui; ++k) {
                if (0 == cardsValue[k].num) {
                    cards[suffix++].replaceValue = cardsValue[k].originValue;
                    cards[suffix++].replaceValue = cardsValue[k].originValue;
                } else if (1 == cardsValue[k].num) {
                    cards[suffix++].replaceValue = cardsValue[k].originValue;
                }

                if(suffix >= backupCheckCards.laiziNum) {
                    break;
                }
            }
            // this.printLog("连对");
            backupCheckCards.type = rValue;
            this._addResult(backupCheckCards);
        }
    }
};

/**
 * 检测纯癞子炸弹，适用于任意癞子数量的牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_laiziZha = function(myCheckCards, rValue) {
    if (myCheckCards.laiziNum == myCheckCards.cardsCount) {
        // this.printLog("纯癞子炸");
        myCheckCards.type = rValue;
        myCheckCards.maxCard = myCheckCards.cards[myCheckCards.cards.length - 1];
        this._addResult(myCheckCards);
    }
};

/**
 * 检测非纯癞子炸弹，适用于任意癞子数量的牌
 * @param myCheckCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.rule_zhaDan = function(myCheckCards,rValue) {
    if (0 == myCheckCards.cardNum || myCheckCards.cardsCount < 4) {
        return;
    }

    var cards = myCheckCards.cards;
    var isMatch = true;
    var refCard = cards[cards.length - 1];
    for (var i = cards.length - 2; i >= myCheckCards.laiziNum; --i) {
        if (cards[i].compareValue != refCard.compareValue) {
            isMatch = false;
            return;
        }
    }

    if (isMatch) {
        for (i = 0; i < myCheckCards.laiziNum; ++i) {
            cards[i].replaceValue = refCard.originValue;
        }
        // this.printLog("炸弹");
        myCheckCards.type = rValue;
        myCheckCards.maxCard = myCheckCards.cards[myCheckCards.cards.length - 1];
        this._addResult(myCheckCards);
    }
};



// === 以下是校验规则 ============================================================
/**
 * 顺子校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_shunZi = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    var isMatch = true;
    var cards = verifiedCards.cards;
    for(var i = 1; i < cards.length; ++i) {
        if (1 != cards[i].compareValue - cards[i - 1].compareValue) {
            isMatch = false;
            break;
        }
    }

    if (isMatch) {
        this.printLog("verify_shunZi, 顺子");
        verifiedCards.type = rValue;
    }
};

/**
 * 连对校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_lianDui = function(verifiedCards, rValue) {
    if (0 != verifiedCards.cardsCount % 2 || verifiedCards.cardsCount < this.minStrPairNum * 2) {
        verifiedCards.type = 0;
        return;
    }

    var isMatch = true;
    var cards = verifiedCards.cards;
    var refCard = cards[0];
    for (var i = 0; i < cards.length; i += 2) {
        if (cards[i].compareValue != cards[i + 1].compareValue) {
            isMatch = false;
            break;
        }

        if (i > 1) {
            if (1 != cards[i].compareValue - refCard.compareValue) {
                isMatch = false;
                break;
            }
            refCard = cards[i];
        }
    }

    if (isMatch) {
        this.printLog("verify_lianDui,连对");
        verifiedCards.type = rValue;
    } else {
        verifiedCards.type = 0;
    }
};

/**
 * 单牌校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_danPai = function(verifiedCards, rValue) {
    if (1 == verifiedCards.cardsCount && 1 != verifiedCards.laiziNum) {
        this.printLog("verify_danPai, 单牌");
        verifiedCards.type = rValue;
        verifiedCards.maxCard = verifiedCards.cards[0];
    } else {
        verifiedCards.type = 0;
    }
};

/**
 * 对子校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_duiZi = function(verifiedCards, rValue) {
    if (2 == verifiedCards.cardsCount && 2 != verifiedCards.laiziNum
            && (verifiedCards.cards[0].compareValue == verifiedCards.cards[1].compareValue)) {
        this.printLog("verify_duiZi, 普通对子");
        verifiedCards.type = rValue;
        verifiedCards.maxCard = verifiedCards.cards[1];
    } else {
        verifiedCards.type = 0;
    }
};

/**
 * 癞子炸校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_laiziZha = function(verifiedCards, rValue) {
    if (verifiedCards.laiziNum == verifiedCards.cardsCount) {
        this.printLog("纯癞子炸");
        verifiedCards.type = rValue;
    } else {
        verifiedCards.type = 0;
    }
};

/**
 * 炸弹校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_zhaDan = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (verifiedCards.cardsCount > 3 && verifiedCards.laiziNum != verifiedCards.cardsCount) {
        var isMatch = true;
        var cards = verifiedCards.cards;
        var refCard = cards[0];
        for (var i = 1; i < cards.length; ++i) {
            if (cards[i].compareValue != refCard.compareValue) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            this.printLog("verify_zhaDan, 炸弹");
            verifiedCards.maxCard = verifiedCards.cards[cards.length - 1];
            verifiedCards.type = rValue;
        }
    }
};

/**
 * 王炸校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_wangZha = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (2 != verifiedCards.cardsCount) {
        return;
    }

    if (verifiedCards.cards[0].originValue == 2
            && verifiedCards.cards[1].originValue == 3) {
        this.printLog("verify_wangZha,王炸");
        verifiedCards.maxCard = verifiedCards.cards[1];
        verifiedCards.type = rValue;
    }
};

/**
 * 三条校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_sanTiao = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (3 != verifiedCards.cardsCount) {
        return;
    }

    if(verifiedCards.cards[0].compareValue == verifiedCards.cards[1].compareValue
            && verifiedCards.cards[1].compareValue == verifiedCards.cards[2].compareValue) {
        this.printLog("verify_sanTiao,三不带");
        verifiedCards.maxCard = verifiedCards.cards[2];
        verifiedCards.type = rValue;
    }
};

/**
 * 三带一校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_sanDaiYi = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (4 != verifiedCards.cardsCount) {
        return;
    }

    var cards = verifiedCards.cards;
    if(cards[0].compareValue == cards[1].compareValue
            && cards[1].compareValue == cards[2].compareValue
            && cards[2].compareValue != cards[3].compareValue) {
        this.printLog("verify_sanDaiYi,三带一");
        verifiedCards.maxCard = verifiedCards.cards[2];
        verifiedCards.type = rValue;
    } else if (cards[0].compareValue != cards[1].compareValue
            && cards[1].compareValue == cards[2].compareValue
            && cards[2].compareValue == cards[3].compareValue) {
        this.printLog("verify_sanDaiYi,三带一");
        verifiedCards.maxCard = verifiedCards.cards[2];
        verifiedCards.type = rValue;
    }
};

/**
 * 三带一对校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_sanDaiYiDui = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if(5 != verifiedCards.cardsCount) {
        return;
    }

    var cards = verifiedCards.cards;
    if(cards[0].compareValue == cards[1].compareValue
            && cards[1].compareValue == cards[2].compareValue
            && cards[2].compareValue != cards[3].compareValue
            && cards[3].compareValue == cards[4].compareValue) {
        this.printLog("verify_sanDaiYiDui,三带一对");
        verifiedCards.maxCard = verifiedCards.cards[2];
        verifiedCards.type = rValue;
    } else if (cards[0].compareValue == cards[1].compareValue
            && cards[1].compareValue != cards[2].compareValue
            && cards[2].compareValue == cards[3].compareValue
            && cards[3].compareValue == cards[4].compareValue) {
        this.printLog("verify_sanDaiYiDui,三带一对");
        verifiedCards.maxCard = verifiedCards.cards[2];
        verifiedCards.type = rValue;
    }
};

/**
 * 四带二校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_siDaiEr = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (verifiedCards.cardsCount != 6) {
        return;
    }
    var cards = verifiedCards.cards;
    var isMatch = false;
    for (var i = 0; i <= cards.length - 4; ++i) {
        isMatch = true;
        for (var j = i ; j < i + 3; ++j) {
            if (cards[j].compareValue != cards[j + 1].compareValue) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            this.printLog("verify_siDaiEr,四带二");
            verifiedCards.maxCard = verifiedCards.cards[i];
            verifiedCards.type = rValue;
            break;
        }
    }
};

/**
 * 四带两对校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_siDaiLiangDui = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (verifiedCards.cardsCount != 8) {
        return;
    }

    var tmpCards = [];
    var cards = verifiedCards.cards;
    for (var i = 0; i < cards.length; ++i) {
        tmpCards.push(cards[i].originValue);
    }
    var fullFormatCards = this.getFullFormatCards(tmpCards);
    var twoCards = fullFormatCards.TwoCards;
    var fourCards = fullFormatCards.FourCards;
    var fc = 0;
    var maxValue = 0;
    if (2 == twoCards.length && 1 == fourCards.length) {
        fc = fourCards[0];
        maxValue = fc[3];
        for (var k = 0; k < cards.length; ++k) {
            if (maxValue == cards[k].originValue) {
                verifiedCards.maxCard = verifiedCards.cards[k];
                verifiedCards.type = rValue;
                this.printLog("verify_siDaiEr,四带两对");
                break;
            }
        }
    } else if(2 == fourCards.length) {
        fc = fourCards[1];
        maxValue = fc[3];
        for (k = 0; k < cards.length; ++k) {
            if (maxValue == cards[k].originValue) {
                verifiedCards.maxCard = verifiedCards.cards[k];
                verifiedCards.type = rValue;
                this.printLog("verify_siDaiEr,四带两对");
                break;
            }
        }
    }
};

/**
 * 三顺校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_sanShun = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (verifiedCards.cardsCount < 6 || 0 != verifiedCards.cardsCount % 3) {
        return;
    }
    var cards = verifiedCards.cards;
    var cardsValue = this._copyCardsValue();
    var checkFeiJi = verifiedCards.cardsCount / 3;   //检测组成飞机的三条的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
            }
        }
    }

    for (i = 0 ; i <= cardsValue.length - checkFeiJi; ++i) {
        var count = 0;
        for (k = i; k < i + checkFeiJi; ++k) {
            if (3 == cardsValue[k].num) {
                count += 3;
                if (count == checkFeiJi * 3) {
                    for (var n = 0; n < cards.length; ++n) {
                        if (cards[n].compareValue == cardsValue[k].compareValue) {
                            this.printLog("verify_sanShun,三顺");
                            verifiedCards.maxCard = verifiedCards.cards[n];
                            verifiedCards.type = rValue;
                            return;
                        }
                    }
                }
            }
        }
    }
};

/**
 * 飞机校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_feiJi = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (verifiedCards.cardsCount < 8 || 0 != verifiedCards.cardsCount % 4) {
        return;
    }

    var cards = verifiedCards.cards;
    var cardsValue = this._copyCardsValue();
    var checkFeiJi = verifiedCards.cardsCount / 4;   //检测组成飞机的三条的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
            }
        }
    }

    for (i = 0 ; i <= cardsValue.length - checkFeiJi; ++i) {
        var count = 0;
        for (k = i; k < i + checkFeiJi; ++k) {
            if (3 <= cardsValue[k].num) {
                count += 3;
                if (count == checkFeiJi * 3) {
                    for (var n = 0; n < cards.length; ++n) {
                        if (cards[n].compareValue == cardsValue[k].compareValue) {
                            this.printLog("verify_feiJi,飞机");
                            verifiedCards.maxCard = verifiedCards.cards[n];
                            verifiedCards.type = rValue;
                            return;
                        }
                    }
                }
            }
        }
    }
};

/**
 * 飞机带队
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_feiJiDaiDui = function(verifiedCards, rValue) {
    verifiedCards.type = 0;
    if (verifiedCards.cardsCount < 10 || 0 != verifiedCards.cardsCount % 5) {
        return;
    }

    var cards = verifiedCards.cards;
    var cardsValue = this._copyCardsValue();
    var checkFeiJi = verifiedCards.cardsCount / 5;   //检测组成飞机的三条的数量
    for (var i = 0; i < cardsValue.length; ++i) {
        for (var k = 0; k < cards.length; ++k) {
            if (cardsValue[i].compareValue == cards[k].compareValue) {
                cardsValue[i].num++;
            }
        }
    }

    var pCount = 0;
    for (i = 0 ; i < cardsValue.length; ++i) {
        if (2 == cardsValue[i].num || 4 == cardsValue[i].num ) {
            pCount += cardsValue[i].num / 2;
        }
    }

    //检测是否有2
    var num2 = 0;
    for (i = 0; i < cards.length; ++i) {
        if (this.cardValue["2"] == cards[i].compareValue) {
            num2++;
        }
    }

    if (2 == num2 || 4 == num2) {
        pCount += num2 / 2;
    }

    var maxValue = 0;
    for (i = 0 ; i <= cardsValue.length - checkFeiJi; ++i) {
        var tCount = 0;
        maxValue = 0;
        for (k = i; k < i + checkFeiJi; ++k) {
            if (3 == cardsValue[k].num) {
                tCount += 1;
                maxValue = cardsValue[k].compareValue;
            }
        }

        if (tCount == pCount && tCount == checkFeiJi) {
            for (var n = 0; n < cards.length; ++n) {
                if (cards[n].compareValue == maxValue) {
                    this.printLog("verify_feiJiDaiDui,飞机带对");
                    verifiedCards.maxCard = verifiedCards.cards[n];
                    verifiedCards.type = rValue;
                    //this.printLog("当前检测到 " + cardsValue[i].compareValue);
                    //this.printLog("有效牌数量 = " + count);
                    return;
                }
            }
        }
    }
};


/**
 * 六张炸校验
 * @param verifiedCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.verify_liuZhangZha = function(verifiedCards, rValue) {
    this.verify_zhaDan(verifiedCards, rValue);
};

// == 牌型检测 ======================================

/**
 * 单牌检测
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_danPai = function(fullFormatCards, rValue) {
    // this.printLog("检测单牌");
    var cards = null;
    var myCheckCards = null;
    var oneCards = fullFormatCards.OneCards;
    var twoCards = fullFormatCards.TwoCards;
    var threeCards = fullFormatCards.ThreeCards;

    // 三种牌分开拆 四张(炸弹)不拆 可以直接炸
    for (var i = 0; i < oneCards.length; ++i) {
        cards = [oneCards[i][0]];
        myCheckCards = this._transformStandardCards(cards);
        myCheckCards.maxCard = myCheckCards.cards[0];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }

    for (i = 0; i < twoCards.length; ++i) {
        cards = [twoCards[i][0]];
        myCheckCards = this._transformStandardCards(cards);
        myCheckCards.maxCard = myCheckCards.cards[0];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }

    for (i = 0; i < threeCards.length; ++i) {
        cards = [threeCards[i][0]];
        myCheckCards = this._transformStandardCards(cards);
        myCheckCards.maxCard = myCheckCards.cards[0];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 对子检测
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_duiZi = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var twoCards = fullFormatCards.TwoCards;
    var cards = null;
    for (var i = 0; i < twoCards.length; ++i) {
        myCheckCards = this._transformStandardCards(twoCards[i]);
        myCheckCards.maxCard = myCheckCards.cards[1];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }

    var threeCards = fullFormatCards.ThreeCards;
    for (i = 0; i < threeCards.length; ++i) {
        cards = threeCards[i];
        myCheckCards = this._transformStandardCards([cards[0], cards[1]]);
        myCheckCards.maxCard = myCheckCards.cards[1];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 三条检测
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_sanTiao = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var threeCards = fullFormatCards.ThreeCards;
    for (var i = 0; i < threeCards.length; ++i) {
        myCheckCards = this._transformStandardCards(threeCards[i]);
        myCheckCards.maxCard = myCheckCards.cards[2];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 检测三带一
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_sanDaiYi = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var threeCards = fullFormatCards.ThreeCards;
    var oneCards = fullFormatCards.OneCards;
    var twoCards = fullFormatCards.TwoCards;
    var cards = null;
    for (var i = 0; i < threeCards.length; ++i) {
        var tc = threeCards[i];
        for (var k = 0; k < oneCards.length; ++k) {
            cards = [tc[0], tc[1], tc[2]];
            cards.push(oneCards[k][0]);
            myCheckCards = this._transformStandardCards(cards);
            myCheckCards.maxCard = myCheckCards.cards[2];
            myCheckCards.type = rValue;
            this._addResult(myCheckCards);
        }

        // 加入对牌检测
        if (oneCards.length < 1) {
            for (k = 0; k < twoCards.length; ++k) {
                cards = [tc[0], tc[1], tc[2]];
                cards.push(twoCards[k][0]);
                myCheckCards = this._transformStandardCards(cards);
                myCheckCards.maxCard = myCheckCards.cards[2];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
            }
        }

        // 加入三张牌检测
        if (oneCards.length < 1 && twoCards.length < 1) {
            for (k = 0; k < threeCards.length; ++k) {
                if (k != i) {
                    cards = [tc[0], tc[1], tc[2]];
                    cards.push(threeCards[k][0]);
                    myCheckCards = this._transformStandardCards(cards);
                    myCheckCards.maxCard = myCheckCards.cards[2];
                    myCheckCards.type = rValue;
                    this._addResult(myCheckCards);
                }
            }
        }
    }
};

/**
 * 检测三带一对
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_sanDaiYiDui = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var threeCards = fullFormatCards.ThreeCards;
    var twoCards = fullFormatCards.TwoCards;
    var cards = null;
    for (var i = 0; i < threeCards.length; ++i) {
        var tc = threeCards[i];
        for (var k = 0; k < twoCards.length; ++k) {
            cards = [tc[0], tc[1], tc[2]];
            cards.push(twoCards[k][0]);
            cards.push(twoCards[k][1]);
            myCheckCards = this._transformStandardCards(cards);
            myCheckCards.maxCard = myCheckCards.cards[2];
            myCheckCards.type = rValue;
            this._addResult(myCheckCards);
        }

        // 加入三张牌检测
        if (twoCards.length < 1) {
            for (k = 0; k < threeCards.length; ++k) {
                if (k != i) {
                    cards = [tc[0], tc[1], tc[2]];
                    cards.push(threeCards[k][0]);
                    cards.push(threeCards[k][1]);
                    myCheckCards = this._transformStandardCards(cards);
                    myCheckCards.maxCard = myCheckCards.cards[2];
                    myCheckCards.type = rValue;
                    this._addResult(myCheckCards);
                }
            }
        }
    }
};

/**
 * 检测顺子
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_shunZi = function(fullFormatCards, rValue) {
    var maxNum = null;
    var cards = null;
    var myCheckCards = null;
    var index = null;
    var isMatch = null;
    // 顺子最小牌到最大牌
    for (var i = this.minCardForStraight; i < this.maxCardForStraight; ++i) {
        maxNum = this.maxCardForStraight - i + 1;
        // 最小张数到最大张数
        for (var num = this.minCardsNumWithStraight; num <= maxNum; ++num) {
            isMatch = true;
            cards = [];
            for (var k = i; k < i + num; ++k) {
                index = "" + k;
                if (fullFormatCards[index].num > 0) {
                    cards.push(fullFormatCards[index].cards[0]);
                } else {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                myCheckCards = this._transformStandardCards(cards);
                myCheckCards.maxCard = myCheckCards.cards[myCheckCards.cards.length - 1];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
            }
        }
    }
};

/**
 * 检测连队
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_lianDui = function(fullFormatCards, rValue) {
    var maxNum = null;
    var cards = null;
    var myCheckCards = null;
    var index = null;
    var isMatch = null;
    // 连对最小牌到最大牌
    for (var i = this.minCardForStraight; i < this.maxCardForStraight; ++i) {
        maxNum = this.maxCardForStraight - i + 1;
        //最小张数到最大张数
        for (var num = this.minStrPairNum; num <= maxNum; ++num) {
            isMatch = true;
            cards = [];
            for (var k = i; k < i + num; ++k) {
                index = "" + k;
                if (fullFormatCards[index].num > 1) {
                    cards.push(fullFormatCards[index].cards[0]);
                    cards.push(fullFormatCards[index].cards[1]);
                } else {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                myCheckCards = this._transformStandardCards(cards);
                myCheckCards.maxCard = myCheckCards.cards[myCheckCards.cards.length - 1];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
            }
        }
    }
};

/**
 * 检测三顺
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_sanShun = function(fullFormatCards, rValue) {
    var maxNum = null;
    var cards = null;
    var myCheckCards = null;
    var index = null;
    var isMatch = null;
    // 最小牌到最大牌
    for (var i = this.minCardForStraight; i < this.maxCardForStraight; ++i) {
        maxNum = 6;
        // 最小张数到最大张数
        for (var num = 2; num <= maxNum; ++num) {
            if (i + num - 1 > this.maxCardForStraight) {
                break;
            }

            isMatch = true;
            cards = [];

            for (var k = i; k < i + num; ++k) {
                index = "" + k;
                if (fullFormatCards[index].num >= 3) {
                    cards.push(fullFormatCards[index].cards[0]);
                    cards.push(fullFormatCards[index].cards[1]);
                    cards.push(fullFormatCards[index].cards[2]);
                } else {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                var maxValue = cards[cards.length - 1];
                myCheckCards = this._transformStandardCards(cards);
                for (var n = 0; n < myCheckCards.cards.length; ++n) {
                    if (maxValue == myCheckCards.cards[n].originValue) {
                        myCheckCards.maxCard = myCheckCards.cards[n];
                        myCheckCards.type = rValue;
                        this._addResult(myCheckCards);
                        break;
                    }
                }
            }
        }
    }
};

/**
 * 检测飞机
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_feiJi = function(fullFormatCards, rValue) {
    var maxNum = null;
    var cards = null;
    var myCheckCards = null;
    var index = null;
    var isMatch = null;
    // 飞机最小牌到最大牌
    for(var i = this.minCardForStraight; i < this.maxCardForStraight; ++i) {
        maxNum = 5;
        //最小张数到最大张数
        for (var num = 2; num <= maxNum; ++num) {
            if (i + num - 1 > this.maxCardForStraight) {
                break;
            }
            isMatch = true;
            cards = [];
            for(var k = i; k < i + num; ++k) {
                index = "" + k;
                if (fullFormatCards[index].num >= 3) {
                    cards.push(fullFormatCards[index].cards[0]);
                    cards.push(fullFormatCards[index].cards[1]);
                    cards.push(fullFormatCards[index].cards[2]);
                } else {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                var oneCards = fullFormatCards.OneCards;
                var twoCards = fullFormatCards.TwoCards;
                if (oneCards.length + twoCards.length * 2 >= num) {
                    var maxValue = cards[cards.length - 1];
                    this.printLog("check_feiJi maxValue = " + maxValue);
                    for (var n = 0; n < oneCards.length; ++n) {
                        if (n >= num) {
                            break;
                        }
                        cards.push(oneCards[n][0]);
                    }
                    // 飞机拆对子
                    for (var m = 0; m < twoCards.length; m++) {
                        if (n >= num) {
                            break;
                        }
                        cards.push(twoCards[m][0]);
                        n += 1;
                        if (n >= num) {
                            break;
                        }
                        cards.push(twoCards[m][1]);
                        n += 1;
                    }

                    myCheckCards = this._transformStandardCards(cards);
                    for (n = 0; n < myCheckCards.cards.length; ++n) {
                        if (maxValue == myCheckCards.cards[n].originValue) {
                            myCheckCards.maxCard = myCheckCards.cards[n];
                            myCheckCards.type = rValue;
                            this._addResult(myCheckCards);
                            break;
                        }
                    }
                }
            }
        }
    }
};

/**
 * 检测飞机带队
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_feiJiDaiDui = function(fullFormatCards, rValue) {
    var maxNum = null;
    var cards = null;
    var myCheckCards = null;
    var index = null;
    var isMatch = null;
    // 飞机最小牌到最大牌
    for (var i = this.minCardForStraight; i < this.maxCardForStraight; ++i) {
        maxNum = 4;
        // 最小张数到最大张数
        for (var num = 2; num <= maxNum; ++num) {
            if (i + num - 1 > this.maxCardForStraight) {
                break;
            }
            isMatch = true;
            cards = [];
            for (var k = i; k < i + num; ++k) {
                index = "" + k;
                if (fullFormatCards[index].num >= 3) {
                    cards.push(fullFormatCards[index].cards[0]);
                    cards.push(fullFormatCards[index].cards[1]);
                    cards.push(fullFormatCards[index].cards[2]);
                } else {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                var twoCards = fullFormatCards.TwoCards;
                if (twoCards.length >= num) {
                    var maxValue = cards[cards.length - 1];
                    for (var n = 0; n < num; ++n) {
                        cards.push(twoCards[n][0]);
                        cards.push(twoCards[n][1]);
                    }
                    myCheckCards = this._transformStandardCards(cards);
                    for (n = 0; n < myCheckCards.cards.length; ++n) {
                        if (maxValue == myCheckCards.cards[n].originValue) {
                            myCheckCards.maxCard = myCheckCards.cards[n];
                            myCheckCards.type = rValue;
                            this._addResult(myCheckCards);
                            break;
                        }
                    }
                }
            }
        }
    }
};

/**
 * 检测四带二
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_siDaiEr = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var fourCards = fullFormatCards.FourCards;
    var oneCards = fullFormatCards.OneCards;
    var twoCards = fullFormatCards.TwoCards;
    var threeCards = fullFormatCards.ThreeCards;
    var cards = null;
    for(var i = 0; i < fourCards.length; ++i) {
        var fc = fourCards[i];
        if (oneCards.length > 1) {
            for (var k = 0; k < oneCards.length - 1; ++k) {
                cards = [fc[0], fc[1], fc[2], fc[3]];
                cards.push(oneCards[k][0]);
                cards.push(oneCards[k + 1][0]);
                myCheckCards = this._transformStandardCards(cards);
                myCheckCards.maxCard = myCheckCards.cards[2];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
            }
        }

        if (twoCards.length > 0) {
            for (k = 0; k < twoCards.length; ++k) {
                cards = [fc[0], fc[1], fc[2], fc[3]];
                cards.push(twoCards[k][0]);
                cards.push(twoCards[k][1]);
                myCheckCards = this._transformStandardCards(cards);
                myCheckCards.maxCard = myCheckCards.cards[2];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
            }
        }

        if (threeCards.length > 0) {
            for (k = 0; k < threeCards.length; ++k) {
                cards = [fc[0], fc[1], fc[2], fc[3]];
                cards.push(threeCards[k][0]);
                cards.push(threeCards[k][1]);
                myCheckCards = this._transformStandardCards(cards);
                myCheckCards.maxCard = myCheckCards.cards[2];
                myCheckCards.type = rValue;
                this._addResult(myCheckCards);
            }
        }
    }
};

/**
 * 检测四带两对
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_siDaiLiangDui = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var fourCards = fullFormatCards.FourCards;
    var twoCards = fullFormatCards.TwoCards;
    var threeCards = fullFormatCards.ThreeCards;
    var cards = null;
    var maxValue = 0;
    for (var i = 0; i < fourCards.length; ++i) {
        var fc = fourCards[i];
        if (twoCards.length > 1) {
            for (var k = 0; k < twoCards.length - 1; ++k) {
                cards = [fc[0], fc[1], fc[2], fc[3]];
                maxValue = fc[3];
                cards.push(twoCards[k][0]);
                cards.push(twoCards[k][1]);
                cards.push(twoCards[k + 1][0]);
                cards.push(twoCards[k + 1][1]);
                myCheckCards = this._transformStandardCards(cards);

                for (var n = 0; n < myCheckCards.cards.length; ++n) {
                    if (maxValue == myCheckCards.cards[n].originValue) {
                        myCheckCards.maxCard = myCheckCards.cards[n];
                        myCheckCards.type = rValue;
                        this._addResult(myCheckCards);
                        break;
                    }
                }
            }
        } else if (threeCards.length > 1) {
            for (k = 0; k < threeCards.length - 1; ++k) {
                cards = [fc[0], fc[1], fc[2], fc[3]];
                maxValue = fc[3];
                cards.push(threeCards[k][0]);
                cards.push(threeCards[k][1]);
                cards.push(threeCards[k + 1][0]);
                cards.push(threeCards[k + 1][1]);
                myCheckCards = this._transformStandardCards(cards);

                for (n = 0; n < myCheckCards.cards.length; ++n) {
                    if (maxValue == myCheckCards.cards[n].originValue) {
                        myCheckCards.maxCard = myCheckCards.cards[n];
                        myCheckCards.type = rValue;
                        this._addResult(myCheckCards);
                        break;
                    }
                }
            }
        }
    }
};

/**
 * 检测炸弹
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_zhaDan = function(fullFormatCards, rValue) {
    var myCheckCards = null;
    var fourCards = fullFormatCards.FourCards;
    for (var i = 0; i < fourCards.length; ++i) {
        myCheckCards = this._transformStandardCards(fourCards[i]);
        myCheckCards.maxCard = myCheckCards.cards[2];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};

/**
 * 检测王炸
 * @param fullFormatCards
 * @param rValue
 */
DouDiZhuHelper.Arithmetic.check_wangZha = function(fullFormatCards, rValue) {
    var cards = fullFormatCards.cards;
    var tmp = [];
    for (var i = 0; i < cards.length; ++i) {
        // 2是小王,3是大王
        if(2 == cards[i] || 3 == cards[i]) {
            tmp.push(cards[i]);
        }
    }

    if (tmp.length == 2) {
        var myCheckCards = this._transformStandardCards(tmp);
        myCheckCards.maxCard = myCheckCards.cards[1];
        myCheckCards.type = rValue;
        this._addResult(myCheckCards);
    }
};
