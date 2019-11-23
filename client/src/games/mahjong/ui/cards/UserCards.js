/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 组合牌 控件 ==========================================
GameWindowMahjong.UserCards = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _uiIndex            : 0,            // 座位方位

    _specialCards       : [],           // 特殊牌控件对象数组

    ctor : function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        var gameData = game.procedure.Mahjong.getGameData();
        var dirStr = gameData.getDirectionString(this._uiIndex);
        this._node = ccs.load("res/Games/Mahjong/Cards/UserCards" + dirStr + ".json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._specialCards = [];
        for (var i = 1; i < 5; ++i) {
            this._specialCards.push(new GameWindowMahjong.SpecialCards(this._uiIndex, game.findUI(this._node, "" + i)));
        }
    },

    reset : function () {
        this._specialCards.forEach(function (specialCards) {
            specialCards.reset();
        });
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 添加吃牌
     * @param cardsArray
     * @param targetIndex
     */
    addChiCards : function (cardsArray, targetIndex) {
        for (var i = 0; i < this._specialCards.length; ++i) {
            var sc = this._specialCards[i];
            if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.CHI, cardsArray, targetIndex);
                sc.showArrow(targetIndex);
                return;
            }
        }
    },

    /**
     * 添加碰牌
     * @param cardsArray
     * @param targetIndex
     */
    addPengCards : function (cardsArray, targetIndex) {
        for (var i = 0; i < this._specialCards.length; ++i) {
            var sc = this._specialCards[i];
            if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.PENG, cardsArray, targetIndex);
                sc.showArrow(targetIndex);
                return;
            }
        }
    },

    /**
     * 添加杠牌
     * @param cardsArray
     * @param gangType      杠的类型  1 暗杠  2 明杠  3 巴杠
     * @param targetIndex
     */
    addGangCards : function (cardsArray, gangType, targetIndex) {
        if (gangType == 3) {
            // 巴杠特殊处理
            for (var i = 0; i < this._specialCards.length; ++i) {
                var sc = this._specialCards[i];
                var valueArray = sc.getCardsValuesArray();
                if (sc.getType() == GameWindowMahjong.SpecialCards.type.PENG
                    && valueArray[0] == cardsArray[0]) {
                    // 巴杠最上面那张牌为牌背
                    cardsArray[3] = 100;
                    sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.GANG, cardsArray, targetIndex);
                    sc.showArrow(targetIndex);
                    return;
                }
            }
        } else {
            for (i = 0; i < this._specialCards.length; ++i) {
                sc = this._specialCards[i];
                if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                    if (gangType == 1) {
                        // 暗杠的前三张牌为牌背
                        cardsArray[0] = 100;
                        cardsArray[1] = 100;
                        cardsArray[2] = 100;
                    }
                    sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.GANG, cardsArray, targetIndex);
                    return;
                }
            }
        }
    },
    /**
     * 针对重连 巴杠不能用type判断
     * @param cardsArray
     * @param gangType
     * @param targetIndex
     */
    addGangCards2 : function (cardsArray, gangType, targetIndex) {
        if (gangType == 3) {
            // 巴杠特殊处理
            for (var i = 0; i < this._specialCards.length; ++i) {
                var sc = this._specialCards[i];
                if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                    // 巴杠最上面那张牌为牌背
                    cardsArray[3] = 100;
                    sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.GANG, cardsArray, targetIndex);
                    sc.showArrow(targetIndex);
                    return;
                }
            }
        } else {
            for (i = 0; i < this._specialCards.length; ++i) {
                sc = this._specialCards[i];
                if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                    if (gangType == 1) {
                        // 暗杠的前三张牌为牌背
                        cardsArray[0] = 100;
                        cardsArray[1] = 100;
                        cardsArray[2] = 100;
                    }
                    sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.GANG, cardsArray, targetIndex);
                    return;
                }
            }
        }
    },

    /**
     * 结算的吃牌
     * @param cardsArray
     * @param targetIndex
     */
    addChiCardsForSettlement : function (cardsArray, targetIndex) {
        for (var i = 0; i < this._specialCards.length; ++i) {
            var sc = this._specialCards[i];
            if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.CHI, cardsArray, targetIndex);
                sc.showArrow(-1);
                return;
            }
        }
    },

    /**
     * 结算的碰牌
     * @param cardsArray
     * @param targetIndex
     */
    addPengCardsForSettlement : function (cardsArray, targetIndex) {
        for (var i = 0; i < this._specialCards.length; ++i) {
            var sc = this._specialCards[i];
            if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.PENG, cardsArray, targetIndex);
                sc.showArrow(-1);
                return;
            }
        }
    },

    /**
     * 结算的杠牌
     * @param cardsArray
     * @param gangType
     * @param targetIndex
     */
    addGangCardsForSettlement : function (cardsArray, gangType, targetIndex) {
        if (gangType == 3) {
            // 巴杠特殊处理
            for (var i = 0; i < this._specialCards.length; ++i) {
                var sc = this._specialCards[i];
                if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                    // 巴杠最上面那张牌为牌背
                    cardsArray[3] = 100;
                    sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.GANG, cardsArray, targetIndex);
                    sc.showArrow(-1);
                    return;
                }
            }
        } else {
            for (i = 0; i < this._specialCards.length; ++i) {
                sc = this._specialCards[i];
                if (sc.getType() == GameWindowMahjong.SpecialCards.type.NONE) {
                    if (gangType == 1) {
                        // 暗杠的前三张牌为牌背
                        cardsArray[0] = 100;
                        cardsArray[1] = 100;
                        cardsArray[2] = 100;
                    }
                    sc.setTypeAndCardsValues(GameWindowMahjong.SpecialCards.type.GANG, cardsArray, targetIndex);
                    if (gangType == 2) {
                        // 明杠，显示目标的名称
                        sc.showName(targetIndex);
                    }
                    return;
                }
            }
        }
    },

    /**
     * 显示高亮的牌
     * @param value
     */
    showLightCards : function (value) {
        for (var i = 0; i < this._specialCards.length; ++i) {
            var sc = this._specialCards[i];
            if (sc.getType() != GameWindowMahjong.SpecialCards.type.NONE) {
                sc.showLightCards(value);
            }
        }
    },

    /**
     * 隐藏高亮的牌
     */
    hideLightCards : function () {
        for (var i = 0; i < this._specialCards.length; ++i) {
            var sc = this._specialCards[i];
            if (sc.getType() != GameWindowMahjong.SpecialCards.type.NONE) {
                sc.hideLightCards();
            }
        }
    }
});