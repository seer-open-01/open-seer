/**
 * Created by Jiyou Mo on 2017/12/11.
 */
// 拼三张游戏音效

/**
 * 背景音乐
 */
game.Audio.PSZPlayBGM = function () {
    if (game.config.BGM_ON)
    this.playMusic("res/Audio/Game/PinSanZhang/bgm1.mp3", true);
};

/**
 * 牌型
 * @param pattern
 * @param gender
 */
game.Audio.PSZPlayPattern = function (pattern, gender) {};

/**
 * 操作
 * @param operation
 * @param gender
 */
game.Audio.PSZPlayOperation = function (operation, gender) {
    var fileName = "res/Audio/Game/PinSanZhang/Operation/";
    fileName += (gender == 1) ? "Male/" : "Female/";
    fileName += operation + ".mp3";
    this.playEffect(fileName);
};

/**
 * 筹码移动音效
 * @param recycle
 */
game.Audio.PSZPlayChipMove = function (recycle) {
    if (recycle) {
        this.playEffect("res/Audio/Game/PinSanZhang/Other/recycleChip.mp3");
    } else {
        this.playEffect("res/Audio/Game/PinSanZhang/Other/addChip.mp3");
    }
};

/**
 * 结算音乐
 * @param win
 */
game.Audio.PSZPlaySettlementBGM = function (win) {
    if (win) {
        this.playMusic("res/Audio/Game/PinSanZhang/gameWin.mp3", false);
    } else {
        this.playMusic("res/Audio/Game/PinSanZhang/gameLose.mp3", false);
    }
};

/**
 * 扑克牌移动音效
 */
game.Audio.PSZPlayCardMove = function () {
    this.playEffect("res/Audio/Game/PinSanZhang/Other/cardMove.mp3");
};
/**
 * 播放轮到玩家回合
 */
game.Audio.PSZPlayTurn = function () {
    this.playEffect("res/Audio/Game/PinSanZhang/Other/turn.mp3");
};
/**
 * 播放倒计时警报
 */
game.Audio.PSZPlayAlarm = function () {
    this.playEffect("res/Audio/Game/PinSanZhang/Other/timeout_warning.mp3");
};

/**
 * 比牌背景音乐
 */
game.Audio.PSZPlayBiPaiBGM = function () {
    this.playMusic("res/Audio/Game/PinSanZhang/Other/bipaiBg.mp3", false);
};

/**
 * 拼三张播放全比音效
 */
game.Audio.PSZPlayAllVS = function () {
   this.playMusic("res/Audio/Game/PinSanZhang/allVS.mp3", false);
};

/**
 * 比牌开始说明音乐
 */
game.Audio.PSZPlayBiPaiTitleSound = function () {
    this.playEffect("res/Audio/Game/PinSanZhang/Other/bipaiGirlSound.mp3");
};

/**
 * 比牌撞击音效
 */
game.Audio.PSZPlayBiPaiZhuangji = function () {
    // this.playEffect("res/Audio/Game/PinSanZhang/Other/bipaiZhuangji.wav");
};

/**
 * 比牌盖章音效
 */
game.Audio.PSZPlayBiPaiGaiZhang = function () {
    this.playEffect("res/Audio/Game/PinSanZhang/Other/bipaiGaiZhang.wav");
};

/**
 * 比牌结果音效
 * @param win       是否赢家音效
 */
game.Audio.PSZPlayBiPaiResult = function (win) {
    if (win) {
        this.playEffect("res/Audio/Game/PinSanZhang/Other/bipaiWin.mp3");
    } else {
        this.playEffect("res/Audio/Game/PinSanZhang/Other/bipaiLose.mp3");
    }
};