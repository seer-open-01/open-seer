/**
 * Created by pander on 2018/5/17.
 */
// ==== 麻将数据 帮助类 =====================================
GameDataMahjong.Helper = {
    /**
     * 手牌对象转换成数组
     * @param jsonObj
     * @returns {Array}
     */
    handCardsObjToArray : function (jsonObj) {
        var array = [];

        for (var key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                for (var i = 0; i < jsonObj[key]; ++i) {
                    array.push(+key);
                }
            }
        }


        return array;
    },
    /**
     * 手牌数组转换成对象
     * @param array
     * @returns {{}}
     */
    handCardsArrayToObj : function (array) {
        var obj = {};

        for (var i = 0; i < array.length; ++i) {
            if (obj.hasOwnProperty(array[i])) {
                obj[array[i]]++;
            } else {
                obj[array[i]] = 1;
            }
        }

        return obj;
    },

    /**
     * 手牌排序
     * @param handCardsArray
     * @param que
     */
    handCardsSort : function (handCardsArray, que) {
        var array = Utils.clone(handCardsArray);
        array.sort(function (a, b) {
            return b - a;
        });

        if (que == undefined || que == null || que == -1) {// 正常排序
            return array;
        }
        var arr1 = [];
        var arr2 = [];
        while (array.length > 0) {
            var value = array.shift();
            if (Math.floor(value / 10) == que) {
                arr2.push(value)
            }else {
                arr1.push(value);
            }
        }
        return arr2.concat(arr1);
    },

    /**
     * 获取单局结算玩家顺序位置图片的路劲 四人麻将
     * @param index     玩家的索引
     */
    getRoundSettlementPlayerSequencePath : function (index) {
        var gameData = game.procedure.Mahjong.getGameData();
        var differ = index - gameData.playerIndex;
        if (gameData.subType == 1) {
            // 二人麻将
            if (differ != 0) {
                differ = 2;
            }
        } else {
            if (differ < -1) {
                differ += 4;
            } else if (differ > 2) {
                differ -= 4;
            }
        }

        // 0 自己 1下家 -1上家 2对家
        switch (differ) {
            case 0 : return "res/Games/Mahjong/Images/Settlement_Who1.png";
            case -1 : return "res/Games/Mahjong/Images/Settlement_Who2.png";
            case 1 : return "res/Games/Mahjong/Images/Settlement_Who3.png";
            case 2 : return "res/Games/Mahjong/Images/Settlement_Who4.png";
            default : return "";
        }
    },

    /**
     * 获取单局结算玩家的方位图片路径  四人麻将
     * @param index
     * @returns {string}
     */
    getRoundSettlementPlayerDirectionPath : function (index) {
        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.subType == 1) {
            // 二人麻将
            switch (index) {
                case 1 : return "res/Games/Mahjong/Images/Settlement_Dir1.png";
                case 2 : return "res/Games/Mahjong/Images/Settlement_Dir3.png";
                default : return "";
            }
        } else {
            switch (index) {
                case 1 : return "res/Games/Mahjong/Images/Settlement_Dir1.png";
                case 2 : return "res/Games/Mahjong/Images/Settlement_Dir4.png";
                case 3 : return "res/Games/Mahjong/Images/Settlement_Dir3.png";
                case 4 : return "res/Games/Mahjong/Images/Settlement_Dir2.png";
                default : return "";
            }
        }

    },

    /**
     * 获取单局结算结算信息
     * @param option
     * @returns {string}
     */
    getRoundSettlementDescribe : function (option) {
        var str = "";
        if (option.isYF) {
            str += "有番 ";
        }else {
            str += "无番 ";
        }

        if (option.isZX) {
            str += " 庄闲"
        }
        if (option.isLZ) {
            str += " 连庄"
        }
        if (option.isZYSG) {
            str += " 自由上噶"
        }
        if (option.isLJSF) {
            str += " 流局算分"
        }
        if (option.isHH) {
            str += " 花胡"
        }
        if (option.isJL) {
            str += " 叫令"
        }
        if (option.isWFP) {
            str += " 无字牌"
        }
        if (option.isBKC) {
            str += " 不可吃"
        }

        return str;
    }
};