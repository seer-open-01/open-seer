/**
 * Author       : lyndon
 * Date         : 2019-05-21
 * Description  : 跑得快音效
 */

/**
 * 跑得快背景音乐
 */
game.Audio.runPlayBGM = function () {
    var file = "res/Audio/Run.mp3";
    if (game.config.BGM_ON)
    this.playMusic(file, true)
};

/**
 * 播放结算背景音乐
 * @param win  true 播放赢家音乐  false 播放输家音乐
 */
game.Audio.runPlaySettlementBGM = function (win) {
    var file = "res/Audio/";
    file += win ? "Run_Win.mp3" : "Run_Lose.mp3";
    this.playMusic(file, false);
};

/**
 * 播放其他音效
 * @param type  1.报单音效  2.发牌音效
 */
game.Audio.runPlayOtherEffect = function (type) {
    var file = "res/Audio/Game/DouDiZhu/Effect/";
    file += type == 1 ? "baodan.mp3" : "deal_card.mp3";
    this.playEffect(file);
};

/**
 * 播放倒计时警报
 */
game.Audio.runPlayAlarm = function () {
    this.playEffect("res/Audio/Game/DouDiZhu/Effect/clock_warning.mp3");
};

/**
 * 出牌音效
 * @param sex
 * @param pattern
 * @param cards
 */
game.Audio.runPlayCardEffect = function (sex, pattern, cards) {
    switch (pattern) {
        case RunHelper.CardsPattern.SINGLE: this._runPlaySingleEffect(sex, cards[0]); break;
        case RunHelper.CardsPattern.PAIR: this._runPlayPairEffect(sex, cards[0]); break;
        case RunHelper.CardsPattern.TRIPLE: this._runPlayTripleEffect(sex, cards[0]); break;
        default : this._runPlayPatternEffect(sex, pattern); break;
    }
};

/**
 * 管牌音效
 * @param sex
 */
game.Audio.runPlayFollowEffect = function (sex) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Pattern/";
    file += (sex == 1) ? "Male/" : "Female/";
    var r = Math.round(Math.random() * 2 + 1); // 随机播放大你 管上 压死
    file += "follow" + r + ".mp3";
    this.playEffect(file);
};

/**
 * 跑得快三条音效
 * @param sex
 * @param card
 * @private
 */
game.Audio._runPlayTripleEffect = function (sex, card) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Triple/";
    file += (sex == 1) ? "Male/" : "Female/";
    card = card % 100;
    file += "pokersange" + card + ".mp3";
    this.playEffect(file);
};

/**
 * 跑得快对子音效
 * @param sex
 * @param card
 * @private
 */
game.Audio._runPlayPairEffect = function (sex, card) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Pair/";
    file += (sex == 1) ? "Male/" : "Female/";
    card = card % 100;
    file += "pokerdui" + card + ".mp3";
    this.playEffect(file);
};

/**
 * 跑得快单牌音效
 * @param sex
 * @param card
 * @private
 */
game.Audio._runPlaySingleEffect = function (sex, card) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Single/";
    file += (sex == 1) ? "Male/" : "Female/";
    if (card == 514) {
        card = "xiaowang";
    }else if (card == 614) {
        card = "dawang";
    }else {
        card = card % 100;
    }
    file += "poker" + card + ".mp3";
    this.playEffect(file);
};

/**
 * 跑得快牌型音效
 * @param sex
 * @param pattern
 * @private
 */
game.Audio._runPlayPatternEffect = function (sex, pattern) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Pattern/";
    file += (sex == 1) ? "Male/" : "Female/";
    file += pattern + ".mp3";
    this.playEffect(file);
};