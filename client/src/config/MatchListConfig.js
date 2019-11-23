/**
 * gameType     游戏类型
 * subType      游戏子类型     例如海南麻将中的四人麻将和二人麻将的区分
 * baseBean     底豆
 * enterBean    入场限制豆数
 * maxBean      封顶豆子数量
 * matchName    匹配场场次名称id
 * isOpen       是否开放   1开放  0不开放
 * matchId      匹配场id
 * headCount    场次中的人数    场次中的人数
 * opts         扩展参数
 */
// ==== 游戏匹配场次数据配置 ===================================================================================
var MatchListConfig = MatchListConfig || {};
/**
 * 根据游戏类型获取游戏字符串名称
 * @param gameType
 * @returns {*}
 */
MatchListConfig.getGameNameStringByGameType = function (gameType) {
    var str = "";
    switch (gameType) {
        case GameTypeConfig.type.HNMJ : str = "海南麻将"; break;
        case GameTypeConfig.type.DDZ : str = "斗地主"; break;
        case GameTypeConfig.type.NN : str = "拼十"; break;
        case GameTypeConfig.type.PSZ : str = "拼三张"; break;
        case GameTypeConfig.type.XQ : str = "象棋"; break;
        default : str = "配置错误"; break;
    }

    return str;
};

/**
 * 根据游戏的 matchId 来获取游戏字符串名称
 * @param matchId
 * @returns {*}
 */
MatchListConfig.getGameNameStringByMatchId = function (matchId) {
    return this.getGameNameStringByGameType(this[matchId].gameType);
};

/**
 * 根据游戏的 matchName来获取场次字符串名称
 * @param matchName
 * @returns {*}
 */
MatchListConfig.getMatchNameStringByMatchName = function (matchName) {
    var str = "";
    switch (matchName) {
        case 1 : str = "新手场"; break;
        case 2 : str = "平民场"; break;
        case 3 : str = "小资场"; break;
        case 4 : str = "龟丞相场"; break;
        case 5 : str = "龙太子场"; break;
        case 6 : str = "龙王场"; break;
        case 0 : str = "新手场"; break;
    }
    return str;
};

/**
 * 根据游戏的 matchId 来获取场次的字符串名称
 * @param matchId
 * @returns {*}
 */
MatchListConfig.getMatchNameStringByMatchId = function (matchId) {
    return this.getMatchNameStringByMatchName(this[matchId].matchName);
};

/**
 * 根据游戏的 gameType subType来获取游戏的描述
 * @param gameType
 * @param subType
 * @returns {*}
 */
MatchListConfig.getGameDescribeByGameType = function (gameType, subType) {
    var str = "";
    switch (gameType) {
        case GameTypeConfig.type.HNMJ :
            if(subType == 1){
                str = " 庄闲 连庄 上噶 花胡 叫令 不可吃";
            }else if (subType == 2) {
                str = " 庄闲 连庄 上噶 花胡 叫令";
            }
            break;
        case GameTypeConfig.type.PSZ :
            if (subType == 1) {
                str = " 经典玩法 必闷三轮";
            }else if (subType == 2) {
                str = " 去掉2-8 保留9-A 必闷三轮";
            }
            break;
        case GameTypeConfig.type.DDZ :
            if (subType == 1) {
                str = " 经典玩法 叫地主 抢地主";
            }else if (subType == 2) {
                str = " 有较高几率获得好牌";
            }
            break;
        case GameTypeConfig.type.NN :
            str = " 普通牌型 特殊牌型";
            break;
        case GameTypeConfig.type.RUN:
            str = "有大必出 放走包赔";
            break;
        case GameTypeConfig.type.CDMJ:
            str = "自摸加番 点杠花当自摸 换三张 门清中张 天地胡 幺九将对";
            break;
        default : str = "";
            break;
    }

    return str;
};

/**
 * 根据游戏的 matchId 来获取游戏的描述
 * @param matchId
 * @returns {*}
 */
MatchListConfig.getGameDescribeByMatchId = function (matchId) {
    return this.getGameDescribeByGameType(this[matchId].gameType);
};