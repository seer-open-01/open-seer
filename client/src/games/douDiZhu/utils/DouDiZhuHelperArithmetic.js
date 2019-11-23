/**
 * Created by Jiyou Mo on 2017/10/25.
 */

// 提供给外部的访问接口

/**
 * checkCards
 * 作用:检测当前传入的牌是否符合当前规则
 * 参数是牌值数组，如[401,101,202,305]
 */

/**
 * checkCardsWithOtherCards
 * 作用:根据指定的牌检测当前传入的牌是否符合当前规则，并且比指定牌更大
 * 第一个参数是牌值数组，如[401,101,202,305]
 * 第二个参数是当前定义格式的牌的对象数组
 * 数组的单个元素是以下形式的对象
 * obj = {
 *     originValue  : 402       //原始值
 *     replaceValue : 402       //替换值
 *     compareValue : 32        //比牌值
 *     id           : 2         //不算花色的值
 *     color        : 4         //花色
 *     isLaizi      : false     //是否是癞子牌
 *  }
 */

/**
 * checkTip
 * 作用:根据当前持有的手牌检测是否有符合当前规则的牌
 * 参数是牌值数组，如[401,101,202,305]
 */

/**
 * checkTipWithOtherCards
 * 作用:根据指定的牌检测当前传入的牌是否符合当前规则，并且比指定牌更大
 * 第一个参数是牌值数组，如[401,101,202,305]
 * 第二个参数是当前定义格式的出牌结果
 * 格式如下
 * obj = {
 *      cards:[
 *          {
 *          originValue  : 1         //原始值
 *          replaceValue : 102       //替换值
 *          compareValue : 32        //比牌值
 *          id           : 2         //不算花色的值
 *          color        : 4         //花色
 *          isLaizi      : false     //是否是癞子牌
 *          }
 *          ......
 *      ]
 *      laiziNum,           //癞子牌数量
 *      cardsCount,         //牌的总数量
 *      cardNum,            //普通牌数量
 *      type,               //牌型
 *      maxCard,            //指向cards中compareValue值最大的元素
 *  }
 */


/**
 * 说明:以上四个API的返回值均为数组
 * 数组中的单个元素格式如下
 * obj = {
 *      cards:[
 *          {
 *          originValue  : 402       //原始值
 *          replaceValue : 402       //替换值
 *          compareValue : 32        //比牌值
 *          id           : 2         //不算花色的值
 *          color        : 4         //花色
 *          isLaizi      : false     //是否是癞子牌
 *          }
 *          ......
 *      ]
 *      laiziNum,           //癞子牌数量
 *      cardsCount,         //牌的总数量
 *      cardNum,            //普通牌数量
 *      type,               //牌型
 *      maxCard,            //指向cards中compareValue值最大的元素
 *  }
 */

// 斗地主 算法
DouDiZhuHelper.Arithmetic = {

    maxHandCardsNum             : null,         // 最大手牌数量
    minCard                     : null,         // 最小的单牌
    maxCard                     : null,         // 最大的单牌
    minCardForStraight          : null,         // 可以组成顺子的最小的牌
    maxCardForStraight          : null,         // 可以组成顺子的最大的牌
    laiziCards                  : null,         // 癞子牌
    laiziMaxNum                 : null,         // 癞子牌最大数量
    cardsTotalNum               : null,         // 扑克牌的总数
    minCardsNumWithStraight     : null,         // 顺子起连的最小牌数
    maxCardsNumWithStraight     : null,         // 顺子的最大张数
    minStrPairNum               : null,         // 连对要求的最小对子数量
    minZhaDan                   : null,         // 最小的炸弹类型
    initFlag                    : false,        // 是否已初始化的标志

    // 牌值比较时的大小，不算花色
    // 对应牌对象中的compareValue
    cardValue : {
        "AdPoker"       : 1,
        "BigPoker"      : 34,
        "SmallPoker"    : 33,
        "2"             : 32,
        "A"             : 14,
        "1"             : 14,
        "K"             : 13,
        "13"            : 13,
        "Q"             : 12,
        "12"            : 12,
        "J"             : 11,
        "11"            : 11,
        "10"            : 10,
        "9"             : 9,
        "8"             : 8,
        "7"             : 7,
        "6"             : 6,
        "5"             : 5,
        "4"             : 4,
        "3"             : 3
    },

    fullFormatCards : {
        "3"     : { cardName : "3" },
        "4"     : { cardName : "4" },
        "5"     : { cardName : "5" },
        "6"     : { cardName : "6" },
        "7"     : { cardName : "7" },
        "8"     : { cardName : "8" },
        "9"     : { cardName : "9" },
        "10"    : { cardName : "10" },
        "11"    : { cardName : "J" },
        "12"    : { cardName : "Q" },
        "13"    : { cardName : "K" },
        "14"    : { cardName : "A" },
        "32"    : { cardName : "2" },
        "33"    : { cardName : "SmallPoker" },
        "34"    : { cardName : "BigPoker" },
        "1"     : { cardName : "AdPoker" }
    },

    // 牌的id，不算花色,根据服务器定义
    // 对应牌对象中的id
    cardId : {
        "AdPoker"       : 1,
        "BigPoker"      : 3,
        "SmallPoker"    : 2,
        "2"             : 2,
        "A"             : 1,
        "1"             : 1,
        "K"             : 13,
        "13"            : 13,
        "Q"             : 12,
        "12"            : 12,
        "J"             : 11,
        "11"            : 11,
        "10"            : 10,
        "9"             : 9,
        "8"             : 8,
        "7"             : 7,
        "6"             : 6,
        "5"             : 5,
        "4"             : 4,
        "3"             : 3
    },

    // 花色顺序    根据服务器的定义,红桃为1，黑桃为2，方块为3，梅花为4
    // 对应牌对象中的color
    cardColor:{
        "HeiTao"        : 2,
        "HongTao"       : 1,
        "MeiHua"        : 4,
        "FangKuai"      : 3,
        "1"             : 3,
        "2"             : 4,
        "3"             : 1,
        "4"             : 2
    },

    // 标准扑克花色顺序
    cardStandardColor:{
        "HeiTao"        : 1,
        "HongTao"       : 2,
        "MeiHua"        : 3,
        "FangKuai"      : 4
    },

    // 牌型
    cardType : {
        NONE            : 0,            // 无效牌
        SINGLE          : 1,            // 单张
        PAIR            : 2,            // 对子
        STRAIGHT        : 3,            // 顺子
        STRPAIR         : 4,            // 连对
        TRIPLE          : 5,            // 三条
        TRIPLE_ONE      : 6,            // 三带一
        TRIPLE_PAIR     : 7,            // 三带二
        RUN_TRIPLE      : 8,            // 三顺
        AIRPLANE        : 9,            // 飞机
        AIRPLANE_TWO    : 10,           // 飞机带对
        FOUR_TWO        : 11,           // 四带二
        FOUR_TWO_PAIR   : 12,           // 四带两对
        SPEC_BOMB       : 13,           // 特殊炸
        BOMB            : 14,           // 炸弹
        KING_BOMB       : 15            // 王炸
    },

    /**
     * 设置牌对应的比牌值
     * @param name
     * @param value
     */
    setCardValue : function (name, value) {
        if (name && value) {
            this.cardValue[name] = value;
        }
    },

    /**
     * 设置牌对应的id
     * @param name
     * @param id
     */
    setCardId : function (name, id) {
        if(name && id) {
            this.cardId[name] = id;
        }
    },

    /**
     * 设置最大的单牌
     * @param id
     */
    setMaxCard : function (id) {
        if(id) {
            this.maxCard = this.cardValue[id];
        }
    },

    /**
     * 设置最小的单牌
     * @param id
     */
    setMinCard : function (id) {
        if (id) {
            this.minCard = this.cardValue[id];
        }
    },

    /**
     * 设置参与计算顺子的最大单张
     * @param id
     */
    setMaxCardForStraight : function (id) {
        if (id) {
            this.maxCardForStraight = this.cardValue[id];
        }
    },

    /**
     * 设置参与计算顺子的最小单张
     * @param id
     */
    setMinCardForStraight : function (id) {
        if (id) {
            this.minCardForStraight = this.cardValue[id];
        }
    },

    /**
     * 设置计算顺子的最小数量
     * @param num
     */
    setMinCardsNumWithStraight : function (num) {
        if (!isNaN(num)) {
            this.minCardsNumWithStraight = num;
        }
    },

    /**
     * 设置计算顺子的最小数量
     * @param num
     */
    setMaxCardsNumWithStraight : function (num) {
        if (!isNaN(num)) {
            this.maxCardsNumWithStraight = num;
        }
    },

    /**
     * 设置癞子牌
     * @param cards
     */
    setLaiziCards : function(cards) {
        this.laiziCards = [];
        if (cards && Array.isArray(cards)) {
            for (var i = 0 ; i < cards.length; ++i) {
                this.laiziCards.push(cards[i]);
            }
        }
    },

    /**
     * 添加癞子牌
     * @param cards
     */
    addLaiziCards : function (cards) {
        if (cards && Array.isArray(cards)) {
            for (var i = 0 ; i < cards.length; ++i) {
                this.laiziCards.push(cards[i]);
            }
        }
    },

    /**
     * 获取癞子牌的最大数量
     */
    getLaiziMaxNum : function () {
        return this.laiziCards.length;
    },

    /**
     * 转换花色，不建议外部访问
     * @param card
     * @return {number|*}
     * @private
     */
    _transformColorToStandardColor : function (card) {
        var id = card % 100;
        var color = Math.floor(card * 0.01);
        for (var index in this.cardColor) {
            if (this.cardColor.hasOwnProperty(index)) {
                if (color == this.cardColor(index)) {
                    color = this.cardStandardColor(index);
                }
            }
        }
        card = id + color * 100;
        return card;
    },

    /**
     * 转换花色，提供外部访问
     * @param cards
     * @return {Array}
     */
    transformColorToStandardColor : function (cards) {
        var array = [];
        if (cards && Array.isArray(cards)) {
            for (var i = 0 ; i < cards.length; ++i) {
                array.push(this._transformColorToStandardColor(cards[i]));
            }
        }
        return array;
    },

    /**
     * 设置扑克牌的总数
     * @param num
     */
    setCardsTotalNum : function (num) {
        if(undefined == num || null == num) {
            return;
        }
        this.cardsTotalNum = num;
    },

    /**
     * 设置检测牌型的规则
     * @param ruleName
     * @param functionName
     * @param callback
     * @param rValue
     */
    setRule : function (ruleName, functionName, callback, rValue) {
        if (undefined === ruleName || null == ruleName) {
            this.printLog("设置牌型规则失败, 参数 \"" + ruleName + "\" 是错误的");
            return;
        }
        if (undefined === functionName || null == functionName) {
            this.printLog("设置牌型规则失败, 参数 \"" + functionName + "\" 是错误的");
            return;
        }

        if (undefined === callback || null == callback) {
            this.printLog("设置牌型规则失败, 参数 \"" + callback + "\" 是错误的");
            return;
        }

        if (undefined === rValue || null == rValue) {
            this.printLog("设置牌型规则失败, 参数 \"" + rValue + "\" 是错误的");
            return;
        }

        var isModify = false;
        for (var index in this.rules) {
            if (this.rules.hasOwnProperty(index)) {
                var rules = this.rules[ruleName];
                for (var i = 0; i < rules.length; ++i) {
                    if (functionName == rules[i].cbName) {
                        rules[i].callback = callback;
                        rules[i].rValue = rValue;
                        isModify = true;
                    }
                }
            }
        }

        if (!isModify) {
            if (this.rules.hasOwnProperty(ruleName)) {
                var tmp = {};
                tmp.callback = callback;
                tmp.cbName = functionName;
                tmp.rValue = rValue;
                this.rules[ruleName].push(tmp);
            }
        }
    },

    /**
     * 添加检测牌型的规则
     * @param ruleName
     * @param functionName
     * @param callback
     * @param rValue
     */
    addRule : function (ruleName, functionName, callback, rValue) {
        if (undefined === ruleName || null == ruleName) {
            this.printLog("添加牌型规则失败, 参数 \"" + ruleName + "\" 是错误的");
            return;
        }

        if (undefined === functionName || null == functionName) {
            this.printLog("添加牌型规则失败, 参数 \"" + functionName + "\" 是错误的");
            return;
        }

        if (undefined === callback || null == callback) {
            this.printLog("添加牌型规则失败, 参数 \"" + callback + "\" 是错误的");
            return;
        }

        if (undefined === rValue || null == rValue) {
            this.printLog("添加牌型规则失败, 参数 \"" + rValue + "\" 是错误的");
            return;
        }

        var tmp = {};
        tmp.callback = callback;
        tmp.cbName = functionName;
        tmp.rValue = rValue;
        if (undefined === this.rules[ruleName] || null == this.rules[ruleName]) {
            this.printLog("添加规则 " + ruleName + " 失败, 规则 \"" + ruleName + "\" 不存在");
            this.printLog("目前,已有的规则 :");
            for (var index in this.rules) {
                if (this.rules.hasOwnProperty(index)) {
                    this.printLog("rule name : " + index);
                }
            }
        } else {
            this.rules[ruleName].push(tmp);
        }
    },

    /**
     * 移除指定规则名的规则
     * @param ruleName
     */
    removeRuleWithRuleName : function (ruleName) {
        if(this.rules.hasOwnProperty(ruleName)) {
            delete this.rules[ruleName];
        }
    },

    /**
     * 移除指定function名字的规则
     * @param functionName
     */
    removeRuleWithFunctionName : function (functionName) {
        for (var index in this.rules) {
            if (this.rules.hasOwnProperty(index) && this.rules[index]) {
                var rules = this.rules[index];
                for (var i = 0; i < rules.length; ++i) {
                    if (functionName == rules[i].cbName) {
                        rules.splice(i, 1);
                    }
                }
            }
        }
    },

    /**
     * 重置规则,清空
     */
    resetRule : function () {
        for (var index in this.rules) {
            if(this.rules.hasOwnProperty(index) && this.rules[index]) {
                this.rules[index] = [];
            }
        }
    },

    /**
     * 初始化规则
     */
    initRule : function () {
        this.rules = {};
        this.rules["any"] = [];
        for (var i = 1; i <= this.maxHandCardsNum; ++i) {
            this.rules["" + i] = [];
        }

        this.addRule("any", "rule_lianDui", this.rule_lianDui.bind(this), this.cardType.STRPAIR);
        this.addRule("any", "rule_shunZi", this.rule_shunZi.bind(this), this.cardType.STRAIGHT);
        this.addRule("any", "rule_feiJi", this.rule_feiJi.bind(this), this.cardType.AIRPLANE);
        this.addRule("any", "rule_zhaDan", this.rule_zhaDan.bind(this), this.cardType.BOMB);
        this.addRule("1", "rule_danPai", this.rule_danPai.bind(this), this.cardType.SINGLE);
        this.addRule("2", "rule_duiZi", this.rule_duiZi.bind(this), this.cardType.PAIR);
        this.addRule("5", "rule_sanDaiYiDui", this.rule_sanDaiYiDui.bind(this), this.cardType.TRIPLE_PAIR);
        this.addRule("any", "rule_sanShun", this.rule_sanShun.bind(this), this.cardType.RUN_TRIPLE);
        this.addRule("any", "rule_feiJiDaiDui", this.rule_feiJiDaiDui.bind(this), this.cardType.AIRPLANE_TWO);
        //this.addRule("8", "rule_siDaiLiangDui", this.rule_siDaiLiangDui.bind(this), this.cardType.FOUR_TWO_PAIR);
        this.addRule("2", "rule_wangZha", this.rule_wangZha.bind(this), this.cardType.KING_BOMB);
        this.addRule("3", "rule_sanTiao", this.rule_sanTiao.bind(this), this.cardType.TRIPLE);
        this.addRule("4", "rule_sanDaiYi", this.rule_sanDaiYi.bind(this), this.cardType.TRIPLE_ONE);
        this.addRule("6", "rule_siDaiEr", this.rule_siDaiEr.bind(this), this.cardType.FOUR_TWO);
    },

    /**
     * 添加校验规则
     * @param ruleName
     * @param functionName
     * @param callback
     * @param rValue
     */
    addVerifyRule : function(ruleName, functionName, callback, rValue) {
        var tmp = {};
        tmp.callback = callback;
        tmp.cbName = functionName;
        tmp.rValue = rValue;
        if(undefined === this.verifyRules[ruleName] || null == this.verifyRules[ruleName]) {
            this.printLog("添加校验规则 到 " + ruleName + " 失败, 规则 \"" + ruleName + "\" 不存在");
            this.printLog("目前,已经有的规则:");
            for(var index in this.verifyRules)
            {
                if(this.verifyRules.hasOwnProperty(index))
                {
                    this.printLog("rule name : " + index);
                }
            }
        } else {
            this.verifyRules[ruleName].push(tmp);
        }
    },

    /**
     * 初始化校验规则
     */
    initVerifyRule : function () {
        this.verifyRules = {};
        this.verifyRules["any"] = [];
        for (var i = 1; i <= this.maxHandCardsNum; ++i) {
            this.verifyRules["" + i] = [];
        }

        this.addVerifyRule("any", "verify_shunZi", this.verify_shunZi.bind(this), this.cardType.STRAIGHT);
        this.addVerifyRule("any", "verify_lianDui", this.verify_lianDui.bind(this), this.cardType.STRPAIR);
        this.addVerifyRule("any", "verify_feiJi", this.verify_feiJi.bind(this), this.cardType.AIRPLANE);
        this.addVerifyRule("any", "verify_zhaDan", this.verify_zhaDan.bind(this), this.cardType.BOMB);
        this.addVerifyRule("1", "verify_danPai", this.verify_danPai.bind(this), this.cardType.SINGLE);
        this.addVerifyRule("2", "verify_duiZi", this.verify_duiZi.bind(this), this.cardType.PAIR);
        this.addVerifyRule("5", "verify_sanDaiYiDui", this.verify_sanDaiYiDui.bind(this), this.cardType.TRIPLE_PAIR);
        this.addVerifyRule("any", "verify_sanShun", this.verify_sanShun.bind(this), this.cardType.RUN_TRIPLE);
        this.addVerifyRule("any", "verify_feiJiDaiDui", this.verify_feiJiDaiDui.bind(this), this.cardType.AIRPLANE_TWO);
        //this.addVerifyRule("8", "verify_siDaiLiangDui", this.verify_siDaiLiangDui.bind(this), this.cardType.FOUR_TWO_PAIR);
        this.addVerifyRule("2", "verify_wangZha", this.verify_wangZha.bind(this), this.cardType.KING_BOMB);
        this.addVerifyRule("3", "verify_sanTiao", this.verify_sanTiao.bind(this), this.cardType.TRIPLE);
        this.addVerifyRule("4", "verify_sanDaiYi", this.verify_sanDaiYi.bind(this), this.cardType.TRIPLE_ONE);
        this.addVerifyRule("6", "verify_siDaiEr", this.verify_siDaiEr.bind(this), this.cardType.FOUR_TWO);
    },

    /**
     * 添加规则
     * @param type
     * @param functionName
     * @param callback
     */
    addCheckRule : function (type, functionName, callback) {
        var tmp = {};
        var ruleName = "type_" + type;
        tmp.ruleName = "type_" + type;
        tmp.callback = callback;
        tmp.cbName = functionName;
        tmp.rValue = type;

        this.checkRules[ruleName] = tmp;
    },

    /**
     * 初始化检测牌型规则
     */
    initCheckRule : function() {
        this.checkRules = {};
        this.addCheckRule(this.cardType.SINGLE, "check_danPai", this.check_danPai.bind(this));
        this.addCheckRule(this.cardType.PAIR, "check_duiZi", this.check_duiZi.bind(this));
        this.addCheckRule(this.cardType.TRIPLE_PAIR, "check_sanDaiYiDui", this.check_sanDaiYiDui.bind(this));
        this.addCheckRule(this.cardType.RUN_TRIPLE, "check_sanShun", this.check_sanShun.bind(this));
        this.addCheckRule(this.cardType.AIRPLANE_TWO, "check_feiJiDaiDui", this.check_feiJiDaiDui.bind(this));
        //this.addCheckRule(this.cardType.FOUR_TWO_PAIR, "check_siDaiLiangDui", this.check_siDaiLiangDui.bind(this));
        this.addCheckRule(this.cardType.TRIPLE, "check_sanTiao", this.check_sanTiao.bind(this));
        this.addCheckRule(this.cardType.TRIPLE_ONE, "check_sanDaiYi", this.check_sanDaiYi.bind(this));
        this.addCheckRule(this.cardType.STRAIGHT, "check_shunZi", this.check_shunZi.bind(this));
        this.addCheckRule(this.cardType.STRPAIR, "check_lianDui", this.check_lianDui.bind(this));
        this.addCheckRule(this.cardType.AIRPLANE, "check_feiJi", this.check_feiJi.bind(this));
        this.addCheckRule(this.cardType.FOUR_TWO, "check_siDaiEr", this.check_siDaiEr.bind(this));
        this.addCheckRule(this.cardType.BOMB, "check_zhaDan", this.check_zhaDan.bind(this));
        this.addCheckRule(this.cardType.KING_BOMB, "check_wangZha", this.check_wangZha.bind(this));
    },

    /**
     * 初始化函数
     */
    init : function () {
        this.maxHandCardsNum = 20;
        this.setMaxCard("2");
        this.setMinCard("3");
        this.setMinCardForStraight("3");
        this.setMaxCardForStraight("A");
        this.setMinCardsNumWithStraight(5);
        this.setMaxCardsNumWithStraight(+(this.maxCardForStraight - this.minCardForStraight) + 1);
        this.minStrPairNum = 3;
        this.minZhaDan = this.cardType.BOMB;
        // this.setCardsTotalNum(55);
        // this.setLaiziCards([this.cardId["AdPoker"],this.cardId["SmallPoker"],this.cardId["BigPoker"]]);
        this.setLaiziCards([]);
        this.result = null;
        this.tipResult = null;
        this.initRule();
        this.initVerifyRule();
        this.initCheckRule();
        this.initFlag = true;
    },

    /**
     * 释放算法资源
     */
    release : function () {
        this.resetRule();
        this.rules = {};
        this.verifyRules = {};
        this.checkRules = {};
        this.initFlag = false;
    },

    /**
     * 获取结果
     * @return {Array|null}
     */
    getCheckResult : function() {
        return this.result;
    },

    _getStandardCard : function (card) {
        var tmp = {};
        tmp.isLaizi = false;
        tmp.originValue = card;             //原始值
        tmp.replaceValue = tmp.originValue; //替换的值
        // 判断是否是癞子牌
        for (var k = 0; k < this.laiziCards.length; ++k) {
            if(tmp.originValue == this.laiziCards[k]) {
                tmp.isLaizi = true;
                break;
            }
        }

        if (tmp.isLaizi) {  // 是癞子牌
            tmp.id = 0;
            tmp.compareValue = 0;
            tmp.color = 0;
        } else {    // 普通牌
            tmp.id = tmp.originValue % 100;     // 牌的id，除开花色的数字
            switch (+tmp.originValue) {
                case 1 : tmp.compareValue = this.cardValue.AdPoker; break;
                case 2 :tmp.compareValue = this.cardValue.SmallPoker; break;
                case 3 :tmp.compareValue = this.cardValue.BigPoker; break;
                default :tmp.compareValue = this.cardValue["" + tmp.id]; break;
            }

            //花色
            tmp.color = this.cardColor["" + Math.floor(tmp.originValue * 0.01)];
        }

        return tmp;
    },

    /**
     * 转换标准牌，不建议外部访问
     * @param cards
     * @return {{}}
     * @private
     */
    _transformStandardCards : function (cards) {
        var checkCards = {};
        checkCards.cards = [];
        checkCards.laiziNum = 0;    // 癞子牌数量
        checkCards.cardsCount = cards.length;   // 所有牌的数量
        checkCards.cardNum = 0;     // 普通牌数量
        checkCards.type = 0;        // 牌型

        for (var i = 0; i < cards.length; ++i) {
            var tmp = this._getStandardCard(cards[i]);
            if (tmp.isLaizi) {
                checkCards.laiziNum++;
            } else {
                checkCards.cardNum++;
            }
            checkCards.cards.push(tmp);
        }

        //排序
        checkCards.cards.sort(function(a, b) {
                if (0 == a.compareValue - b.compareValue) {
                    return b.color - a.color;
                }
                // return a.compareValue - b.compareValue;
                return b.compareValue - a.compareValue;
            });

        return checkCards;
    },

    /**
     * 将牌值数组转换当前定义格式的牌对象数组
     * @param cards
     * @return {*|{}}
     */
    getStandardFormatCardsObj : function(cards) {
        return this._transformStandardCards(cards);
    },

    /**
     * 将定义格式的牌对象转换成数组
     * @param standardFormatCardsObj
     * @return {Array}
     */
    getCardsArray : function (standardFormatCardsObj) {
        var array = [];
        for (var i = 0; i < standardFormatCardsObj.length; ++i) {
            array.push(standardFormatCardsObj[i].originValue);
        }
        return array;
    },

    _copyCardsValue : function() {
        var cardsValue = [];
        var tmp = null;
        var i;
        for (i = 1; i <= 13; ++i) {
            var index = "" + i;
            if (this.cardValue.hasOwnProperty(index)) {
                if (this.minCardForStraight <= this.cardValue[index]
                    && this.cardValue[index] <= this.maxCardForStraight) {
                    tmp = {};
                    tmp.compareValue = this.cardValue[index];
                    tmp.originValue = (+index) + 100;   //注:该属性用于癞子做替换时取的值
                    tmp.num = 0;
                    cardsValue.push(tmp);
                }
            }
        }

        cardsValue.sort(function(a, b) { return a.compareValue - b.compareValue; });

        return cardsValue;
    },

    _addResult : function(checkCards, result) {
        var cards = checkCards.cards;
        var card = 0;
        for (var i = 0; i < cards.length; ++i) {
            card = this.cardValue[cards[i].replaceValue % 100];
            if (cards[i].replaceValue != cards[i].originValue) {
                cards[i].compareValue = card;
            }
        }

        checkCards.cards.sort(function(a, b) {return a.compareValue - b.compareValue; });

        if(checkCards.type == this.cardType.STRPAIR || checkCards.type == this.cardType.STRAIGHT) {
            checkCards.maxCard = checkCards.cards[checkCards.cards.length - 1];
        }

        if(result) {
            result.push(checkCards);
        } else {
            this.result.push(checkCards);
        }
    },

    /**
     * 检测出牌是否符合规则
     * @param standardFormatCards
     * @return {null|Array}
     * @private
     */
    _checkCards : function (standardFormatCards) {
        var doRuleCall = function (rules) {
            for (var i = 0; i < rules.length; ++i) {
                var ruleCall = rules[i].callback;
                var rValue = rules[i].rValue;
                var checkCards = this.clone(standardFormatCards);
                ruleCall(checkCards, rValue);
            }
        }.bind(this);

        var cards = standardFormatCards.cards;
        var len = cards.length;
        doRuleCall(this.rules["" + len]);
        var isNeedCheckAny = true;
        // for (var i = 0; i < this.result.length; ++i) {
        //     //如果检测出癞子炸弹则不再检测顺子
        //     if (this.cardType.TWOLZ == this.result[i].type || this.cardType.THREELZBOOM == this.result[i].type) {
        //         isNeedCheckAny = false;
        //         break;
        //     }
        // }

        if(isNeedCheckAny) {
            doRuleCall(this.rules["any"]);
        }

        return this.result;
    },

    /**
     * 检测是否初始化
     * @return {boolean}
     * @private
     */
    _checkIsInit : function() {
        if (!this.initFlag) {
            this.printLog("斗地主算法 规则需要初始化,请调用算法的函数 \"init()\"");
            return false;
        }
        return true;
    },

    /**
     * 校验类型
     * @param verifiedCards
     * @private
     */
    _verifyType : function(verifiedCards) {
        var doRuleCall = function(rules) {
            for (var i = 0; i < rules.length; ++i) {
                var ruleCall = rules[i].callback;
                var rValue = rules[i].rValue;
                ruleCall(verifiedCards, rValue);
                if (0 != verifiedCards.type) {
                    return;
                }
            }
        };

        var ruleName = "" + verifiedCards.cardsCount;
        var rules = null;
        if (this.verifyRules.hasOwnProperty(ruleName) && this.verifyRules[ruleName]) {
            rules = this.verifyRules[ruleName];
            doRuleCall(rules);
        }

        if(0 == verifiedCards.type) {
            rules = this.verifyRules["any"];
            doRuleCall(rules);
        }
    },

    /**
     * 校验已确定牌值的牌型
     * @param cards
     * @param pattern
     * @return {*}
     */
    getTypeWithVerifiedCards : function (cards, pattern) {
        if (!Array.isArray(cards) || cards.length == 0) {
            this.printLog("斗地主算法 参数 \"cards\" 不是数组 或者素组长度为0，不能计算牌型");
            return null;
        }
        var verifiedCards = {};
        verifiedCards.cards = cards;
        verifiedCards.cards.sort(function (a, b) { return a.compareValue - b.compareValue; });

        // this.printLog("校验牌型");
        // this.printCards(verifiedCards.cards);

        verifiedCards.cardsCount = cards.length;
        verifiedCards.laiziNum = 0;
        verifiedCards.cardNum = 0;
        verifiedCards.type = 0;
        for (var i = 0; i < verifiedCards.cards.length; ++i) {
            for (var k = 0; k < this.laiziCards.length; ++k) {
                if (verifiedCards.cards[i].originValue == this.laiziCards[k]) {
                    verifiedCards.cards[i].isLaizi = true;
                    break;
                }
            }

            if (verifiedCards.cards[i].isLaizi) {
                verifiedCards.laiziNum++;
            } else {
                verifiedCards.cardNum++;
            }
        }

        this._verifyType(verifiedCards);

        // cc.log("服务器检测牌型是:" + pattern);
        // cc.log("客户端检测出牌型是:" + verifiedCards.type);
        // cc.log("客户端检测最大牌originValue是:" + verifiedCards.maxCard.originValue);
        // cc.log("客户端检测最大牌compareValue是:" + verifiedCards.maxCard.compareValue);

        // 若客户端检测牌型和服务端检测牌型不一样 则使用服务端牌型
        if (pattern && pattern != verifiedCards.type) {
            // cc.log("服务器检测牌型和客户端检测牌型不一致");
            // cc.log("服务器检测牌型是:" + pattern);
            // cc.log("客户端检测出牌型是:" + verifiedCards.type);
            // cc.log("以服务器的检测为准");
            verifiedCards.type = pattern;
            // cc.log("客户端检测最大牌originValue是:" + verifiedCards.maxCard.originValue);
            // cc.log("客户端检测最大牌compareValue是:" + verifiedCards.maxCard.compareValue);
        }
        // 得到顺子和连对的最大牌
        if (this.cardType.STRAIGHT == verifiedCards.type || this.cardType.STRPAIR == verifiedCards.type) {
            verifiedCards.maxCard = verifiedCards.cards[verifiedCards.cards.length - 1];
        }
        return verifiedCards;
    },

    /**
     * 与指定牌比较大小,不建议外部访问
     * @param myCards
     * @param otherCards
     * @return {boolean}
     * @private
     */
    _compareCards : function (myCards, otherCards) {
        if (myCards.type >= this.minZhaDan && myCards.type > otherCards.type) {
            return true;
        } else if (myCards.type == otherCards.type) {
            // 顺子、连对、飞机比较
            if (myCards.type == this.cardType.STRAIGHT || myCards.type == this.cardType.STRPAIR
                || (myCards.type >= this.cardType.RUN_TRIPLE && myCards.type <= this.cardType.AIRPLANE_TWO)) {
                if (myCards.cardsCount == otherCards.cardsCount &&
                    myCards.maxCard.compareValue > otherCards.maxCard.compareValue) {
                    return true;
                }
            } else if (myCards.maxCard.compareValue > otherCards.maxCard.compareValue) {
                return true;
            }
        }
        return false;
    },

    /**
     * 与指定牌比较大小,提供外部访问
     * @param myCards
     * @param otherCards
     * @return {*|boolean}
     */
    compareCards : function(myCards, otherCards) {
        return this._compareCards(myCards, otherCards);
    },

    _getAllCombine : function(cards, result, tmpArray, num, count, n, start) {
        for (var i = start; i <= count - num + n; ++i) {
            tmpArray.push(cards[i]);
            if (n == num - 1) {
                var tmp = this.clone(tmpArray);
                result.push(tmp);
            } else if (n < num - 1) {
                this._getAllCombine(cards, result, tmpArray, num, count, n + 1, i + 1);
            }
            tmpArray.splice(tmpArray.length - 1, 1);
        }
    },

    /**
     * 从任意张牌中选出所有组合的结果
     * @param cards
     * @param result
     * @return {*}
     */
    getAllCombine : function (cards, result) {
        if (undefined == result || null == result || !Array.isArray(result)) {
            result = [];
        }

        if (Array.isArray(cards)) {
            var tmp = [];
            var count = cards.length;
            // for (var i = 1; i <= count; ++i) {
            //     this._getAllCombine(cards, result, tmp, i, count, 0, 0);
            // }
            this._getAllCombine(cards, result, tmp, 1, count, 0, 0);
        }
        return result;
    },

    /**
     * 从任意张牌中选出指定张数的结果
     * @param cards
     * @param num
     * @param result
     * @return {*}
     */
    getAllCombineForNum : function(cards, num, result) {
        if (undefined == result || null == result || !Array.isArray(result)) {
            result = [];
        }

        if (Array.isArray(cards) && (num > 0 && num <= cards.length)) {
            var tmp = [];
            var count = cards.length;
            this._getAllCombine(cards, result, tmp, num, count, 0, 0);
        }
        return result;
    },

    _getBaseFullFormatCards : function () {
        var myCards = {};
        for (var index in this.fullFormatCards) {
            if (this.fullFormatCards.hasOwnProperty(index)) {
                myCards[index] = {};
                var tmp = myCards[index];
                tmp.cardName = this.fullFormatCards[index].cardName;
                tmp.cards = [];
                tmp.num = 0;
                tmp.index = index;
            }
        }
        myCards.OneCards = [];
        myCards.TwoCards = [];
        myCards.ThreeCards = [];
        myCards.FourCards = [];
        return myCards;
    },

    getFullFormatCards : function (cards) {
        if (!this._checkIsInit()) {
            return null;
        }
        var baseFullFormatCards = this._getBaseFullFormatCards();
        baseFullFormatCards.cardsCount = cards.length;
        baseFullFormatCards.cards = cards;
        for (var i = 0; i < cards.length; ++i) {
            var originValue = cards[i];
            var card = +originValue;
            switch (card) {
                case 1 : {
                    baseFullFormatCards["" + this.cardValue["AdPoker"]].cards.push(card);
                    break;
                }
                case 2 : {
                    baseFullFormatCards["" + this.cardValue["SmallPoker"]].cards.push(card);
                    break;
                }
                case 3 : {
                    baseFullFormatCards["" + this.cardValue["BigPoker"]].cards.push(card);
                    break;
                }
                default : {
                    var id = originValue % 100;
                    baseFullFormatCards["" + this.cardValue["" + id]].cards.push(card);
                    break;
                }
            }
        }

        for (var index in baseFullFormatCards) {
            if (baseFullFormatCards.hasOwnProperty(index)) {
                var someCard = baseFullFormatCards[index];
                if (someCard.cardName) {
                    someCard.num = someCard.cards.length;
                    if (1 == someCard.num) {
                        baseFullFormatCards.OneCards.push(someCard.cards);
                    } else if (2 == someCard.num) {
                        baseFullFormatCards.TwoCards.push(someCard.cards);
                    } else if (3 == someCard.num) {
                        baseFullFormatCards.ThreeCards.push(someCard.cards);
                    } else if (4 == someCard.num) {
                        baseFullFormatCards.FourCards.push(someCard.cards);
                    }
                }
            }
        }

        return baseFullFormatCards;
    },

    /**
     * 作用:检测当前传入的牌是否符合当前规则
     * 参数是牌值数组，如[401,101,202,305]
     * @param cards
     * @return {*|null|Array}
     */
    checkCards : function (cards) {
        if (!this._checkIsInit()) {
            return [];
        }

        if (cards.length > this.maxHandCardsNum) {
            this.printLog("需要检测的牌张数不对");
            return [];
        }

        this.result = [];
        var standardFormatCards = this._transformStandardCards(cards);
        return this._checkCards(standardFormatCards);
    },

    /**
     * 作用:根据指定的牌检测当前传入的牌是否符合当前规则，并且比指定牌更大
     * 第一个参数是牌值数组，如[401,101,202,305]
     * 第二个参数是当前定义格式的牌的对象数组
     * 数组的单个元素是以下形式的对象
     * obj = {
     *     originValue  : 402       //原始值
     *     replaceValue : 402       //替换值
     *     compareValue : 32        //比牌值
     *     id           : 2         //不算花色的值
     *     color        : 4         //花色
     *     isLaizi      : false     //是否是癞子牌
     *  }
     * @param cards
     * @param otherCards
     * @return {Array}
     */
    checkCardsWithOtherCards : function (cards, otherCards) {
        if(!this._checkIsInit()) {
            return [];
        }
        this.checkCards(cards);
        var compareResultArray = [];
        var compareResultFlag = false;
        for (var i = 0; i < this.result.length; ++i) {
            // this.printCards(this.result[i].cards);
            compareResultFlag = this._compareCards(this.result[i], otherCards);
            if (compareResultFlag) {
                compareResultArray.push(this.result[i]);
            }
        }
        return compareResultArray;
    },

    _checkTip : function (cards) {
        if (!this._checkIsInit()) {
            return [];
        }
        // cc.log("需要检测的牌 = " + cards);
        var fullFormatCards = this.getFullFormatCards(cards);
        var rule = null;
        this.result = [];
        for (var index in this.checkRules) {
            if (this.checkRules.hasOwnProperty(index)) {
                rule = this.checkRules[index];
                var callback = rule.callback;
                var rValue = rule.rValue;
                // this.printLog("检测类型 = " + rValue);
                callback && callback(fullFormatCards, rValue);
                // this.printLog("检测结果数量 = " + this.result.length);
            }
        }
        // this.printLog("checkTip合法牌型数量 = " + this.result.length);
        return this.result;
    },

    /**
     * 作用:根据当前持有的手牌检测是否有符合当前规则的牌
     * 参数是牌值数组，如[401,101,202,305]
     * @param cards
     * @return {Array|null}
     */
    checkTip : function (cards) {
        this._checkTip(cards);
        this.result.sort(function(a, b) {
            if (a.type == b.type) {
                if (a.maxCard.compareValue != b.maxCard.compareValue) {
                    return a.maxCard.compareValue - b.maxCard.compareValue;
                } else {
                    return a.maxCard.color - b.maxCard.color;
                }
            } else {
                return a.type - b.type;
            }
        });
        return this.result;
    },

    /**
     * 作用:根据当前持有的手牌检测是否有符合当前规则和牌型的牌
     * 参数是牌值数组，如[401,101,202,305]
     * @param cards
     * @param pattern
     * @return {Array|null}
     */
    checkTipWithPattern : function (cards, pattern) {
        if(!this._checkIsInit()) {
            return [];
        }
        this._checkTip(cards);
        var resultArray = [];
        for (var i = 0; i < this.result.length; ++i) {
            // this.printCards(this.result[i].cards);
            if (this.result[i].type == pattern) {       // 牌型相同放入
                resultArray.push(this.result[i]);
            }
        }

        resultArray.sort(function(a, b) {
            if (a.cards.length != b.cards.length) {
                return a.cards.length - b.cards.length;
            } else {
                if (a.maxCard.compareValue != b.maxCard.compareValue) {
                    return a.maxCard.compareValue - b.maxCard.compareValue;
                } else {
                    return a.maxCard.color - b.maxCard.color;
                }
            }
        });
        return resultArray;
    },

    /**
     * 作用:根据指定的牌检测当前传入的牌中是否有符合当前规则的牌组合，并且比指定牌更大
     * 第一个参数是牌值数组，如[401,101,202,305]
     * 第二个参数是当前定义格式的出牌结果
     * 格式如下
     * obj = {
     *      cards : [
     *          {
     *              originValue  : 1         //原始值
     *              replaceValue : 102       //替换值
     *              compareValue : 32        //比牌值
     *              id           : 2         //不算花色的值
     *              color        : 4         //花色
     *              isLaizi      : false     //是否是癞子牌
     *          },
     *          ......
     *      ]
     *      laiziNum,           //癞子牌数量
     *      cardsCount,         //牌的总数量
     *      cardNum,            //普通牌数量
     *      type,               //牌型
     *      maxCard,            //指向cards中compareValue值最大的元素
     *  }
     * @param cards
     * @param otherCards
     * @return {Array}
     */
    checkTipWithOtherCards : function (cards, otherCards) {
        if (!this._checkIsInit()) {
            return [];
        }

        this._checkTip(cards);
        this.tipResult = this.result;
        // var tmpCards = null;
        // for (var i = 0; i < this.tipResult.length; ++i) {
        //     tmpCards = [];
        //     var __tmp = this.tipResult[i].cards;
        //     for (var j = 0; j < __tmp.length; ++j) {
        //         tmpCards.push(__tmp[j].originValue);
        //     }
        //     this.printLog("第" + i + "个组合" + tmpCards);
        //     this.printLog("type = " + this.tipResult[i].type);
        //     this.printLog("最大牌是" + this.tipResult[i].maxCard.originValue);
        // }

        var compareResult = [];

        for (var i = 0; i < this.tipResult.length; ++i) {
            if (this._compareCards(this.tipResult[i], otherCards)) {
                compareResult.push(this.tipResult[i]);
            }
        }

        this.printLog("checkTipWithOtherCards合法牌型数量 = " + compareResult.length);
        compareResult.sort(function(a, b) {
            if (a.type == b.type) {
                if (a.maxCard.compareValue != b.maxCard.compareValue) {
                    return a.maxCard.compareValue - b.maxCard.compareValue;
                } else {
                    return a.maxCard.color - b.maxCard.color;
                }
            } else {
                return a.type - b.type;
            }
        });
        return compareResult;
    },

    /**
     * 克隆对象
     * @param obj
     */
    clone : function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    //封装打印函数
    printLog : function (str) {
        cc.log(str);
    },

    printObj : function (obj) {
        cc.log(JSON.stringify(obj));
    },

    printFullCards : function (fullCards) {
        for (var index in fullCards) {
            if (fullCards.hasOwnProperty(index)) {
                var someCards = fullCards[index];
                if (someCards.cardName) {
                    this.printLog(someCards.cardName + "有" + someCards.num + "张");
                    var tmp = [];
                    for (var i = 0; i < someCards.cards.length; ++i) {
                        tmp.push(someCards.cards[i]);
                    }

                    if (tmp.length > 0) {
                        this.printLog("分别是:" + tmp);
                    }
                } else if (someCards.length && index != "cards") {
                    this.printLog(index + "有" + someCards.length + "种");
                    if (someCards.length > 0) {
                        this.printLog("分别是:");
                        for (i = 0; i < someCards.length; ++i) {
                            tmp = [];
                            var __cards = someCards[i];
                            for (var k = 0; k < __cards.length; ++k) {
                                tmp.push(__cards[k]);
                            }
                            this.printLog(tmp);
                        }
                    }
                }
            }
        }
    },

    printCards : function(cards) {
        for (var i = 0; i < cards.length; ++i) {
            this.printLog("cards[" + i + "].originValue = " + cards[i].originValue);
            this.printLog("cards[" + i + "].replaceValue = " + cards[i].replaceValue);
            this.printLog("cards[" + i + "].compareValue = " + cards[i].compareValue);
        }
    }

};