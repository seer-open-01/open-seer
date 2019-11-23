/**
 * Created by lyndon on 2018.07.05.
 */
// 斗地主音效

/**
 * 斗地主背景音乐
 * @param type  0.普通音乐  1.游戏开始后的音乐  2.出过炸弹后的音乐
 */
game.Audio.ddzPlayBGM = function (type) {
    var file = "res/Audio/Game/DouDiZhu/BGM/";
    switch (type) {
        case 0 : file += "normal.mp3"; break;
        case 1 : file += "welcome.mp3"; break;
        case 2 : file += "after_bomb.mp3"; break;
    }
    if (game.config.BGM_ON)
    this.playMusic(file, true)
};

/**
 * 播放结算背景音乐
 * @param win  true 播放赢家音乐  false 播放输家音乐
 */
game.Audio.ddzPlaySettlementBGM = function (win) {
    var file = "res/Audio/Game/DouDiZhu/Effect/";
    file += win ? "win.mp3" : "lose.mp3";
    this.playMusic(file, false);
};

/**
 * 播放其他音效
 * @param type  1.报单音效  2.发牌音效
 */
game.Audio.ddzPlayOtherEffect = function (type) {
    var file = "res/Audio/Game/DouDiZhu/Effect/";
    file += type == 1 ? "baodan.mp3" : "deal_card.mp3";
    this.playEffect(file);
};

/**
 * 播放倒计时警报
 */
game.Audio.ddzPlayAlarm = function () {
    this.playEffect("res/Audio/Game/DouDiZhu/Effect/clock_warning.mp3");
};

/**
 *
 * @param sex
 * @param type 1叫地主 2不叫 3抢地主 4不抢
 */
game.Audio.ddzPlayDealerEffect = function (sex,type) {
    var file = "res/Audio/Game/DouDiZhu/Dealer/";
    file += (sex == 1) ? "Male/" : "Female/";
    var r = Math.round(Math.random() + 1); // 随机播放我抢和抢地主两种音效
    switch (type){
        case 1: file += "jiao.mp3"; break;
        case 2: file += "bujiao.mp3"; break;
        case 3: file += "qiang"+ r +".mp3"; break;
        case 4: file += "buqiang.mp3"; break;
    }
    this.playEffect(file);
};

/**
 *
 * @param sex
 * @param type 0 不加倍   1 加倍
 */
game.Audio.ddzPlayDoubleEffect = function (sex,type) {
    var file = "res/Audio/Game/DouDiZhu/Double/";
    file += (sex == 1) ? "Male/" : "Female/";
    switch (type){
        case 6: file += "jiabei.mp3"; break;
        case 7: file += "bujiabei.mp3"; break;
    }
    this.playEffect(file);
};

/**
 * 出牌音效
 * @param sex
 * @param pattern
 * @param cards
 */
game.Audio.ddzPlayCardEffect = function (sex, pattern, cards) {
    switch (pattern) {
        case DouDiZhuHelper.CardsPattern.SINGLE: this._ddzPlaySingleEffect(sex, cards[0]); break;
        case DouDiZhuHelper.CardsPattern.PAIR: this._ddzPlayPairEffect(sex, cards[0]); break;
        case DouDiZhuHelper.CardsPattern.TRIPLE: this._ddzPlayTripleEffect(sex, cards[0]); break;
        default : this._ddzPlayPatternEffect(sex, pattern); break;
    }
};

/**
 * 管牌音效
 * @param sex
 */
game.Audio.ddzPlayFollowEffect = function (sex) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Pattern/";
    file += (sex == 1) ? "Male/" : "Female/";
    var r = Math.round(Math.random() * 2 + 1); // 随机播放大你 管上 压死
    file += "follow" + r + ".mp3";
    this.playEffect(file);
};

/**
 * 斗地主三条音效
 * @param sex
 * @param card
 * @private
 */
game.Audio._ddzPlayTripleEffect = function (sex, card) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Triple/";
    file += (sex == 1) ? "Male/" : "Female/";
    card = card % 100;
    file += "pokersange" + card + ".mp3";
    this.playEffect(file);
};

/**
 * 斗地主对子音效
 * @param sex
 * @param card
 * @private
 */
game.Audio._ddzPlayPairEffect = function (sex, card) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Pair/";
    file += (sex == 1) ? "Male/" : "Female/";
    card = card % 100;
    file += "pokerdui" + card + ".mp3";
    this.playEffect(file);
};

/**
 * 斗地主单牌音效
 * @param sex
 * @param card
 * @private
 */
game.Audio._ddzPlaySingleEffect = function (sex, card) {
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
 * 斗地主牌型音效
 * @param sex
 * @param pattern
 * @private
 */
game.Audio._ddzPlayPatternEffect = function (sex, pattern) {
    var file = "res/Audio/Game/DouDiZhu/Cards/Pattern/";
    file += (sex == 1) ? "Male/" : "Female/";
    file += pattern + ".mp3";
    this.playEffect(file);
};