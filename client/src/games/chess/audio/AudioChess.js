/**
 * Author       : lyndon
 * Date         : 2018-08-01
 * Description  : 象棋音效
 */

/**
 * 背景音乐
 */
game.Audio.chessPlayBGM = function () {
    var file = "res/Audio/Game/Chess/Sound/bgm.mp3";
    if (game.config.BGM_ON)
    this.playMusic(file, true)
};
/**
 * 走棋音效
 */
game.Audio.chessPlayMove = function () {
    var file = "res/Audio/Game/Chess/Effect/move.mp3";
    this.playEffect(file);
};
/**
 * 选棋音效
 */
game.Audio.chessPlaySelect = function () {
    var file = "res/Audio/Game/Chess/Effect/select.mp3";
    this.playEffect(file);
};
/**
 * 吃音效
 */
game.Audio.chessPlayChi = function (sex) {
    var file = "res/Audio/Game/Chess/Effect/";
    file += sex == 1 ? "Female/chi.mp3" : "Male/chi.mp3";
    this.playEffect(file);
};
/**
 * 将音效
 */
game.Audio.chessPlayJiang = function (sex) {
    var file = "res/Audio/Game/Chess/Effect/";
    file += sex == 1 ? "Female/jiang.mp3" : "Male/jiang.mp3";
    this.playEffect(file);
};
/**
 * 结算音效 1胜2输3平
 * @param type
 */
game.Audio.chessPlaySettle = function (type) {
    var file = "res/Audio/Game/Chess/Sound/";
    switch (type) {
        case 1:
            file += "win.mp3";
            break;
        case 2:
            file += "lose.mp3";
            break;
        case 3:
            file += "draw.mp3";
            break;
    }
    this.playMusic(file, false);
};