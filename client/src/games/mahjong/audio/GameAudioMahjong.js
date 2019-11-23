/**
 * 音效
 */
// 播放麻将背景音乐
game.Audio.MahjongPlayBGM = function () {
    if (game.config.BGM_ON)
    this.playMusic("res/Audio/Game/Mahjong/bgm.mp3", true);
};

// 播放麻将出牌消息
game.Audio.MahjongPlayCardEffect = function (sex, cardValue) {
    var gameData = game.procedure.Mahjong.getGameData();
    var gameType = gameData.gameType;
    var path = "res/Audio/Game/Mahjong/Cards/";
    path += sex == 1 ? "Male/" : "Female/";
    path += gameType == 8 ? "c" : "";
    path += cardValue + ".mp3";
    this.playEffect(path, false);
};

// 麻将点击音效
game.Audio.MahjongClickCard = function () {
    var path = "res/Audio/Game/Mahjong/click.mp3";
    this.playEffect(path, false);
};

// 播放麻将花牌音效
game.Audio.MahjongPlayFlowerEffect = function (sex) {
    var path = "res/Audio/Game/Mahjong/Effect/";
    path += sex == 1 ? "Male/" : "Female/";
    path += "hua" + ".mp3";
    this.playEffect(path, false);
};

// 播放麻将吃牌音效
game.Audio.MahjongPlayChiEffect = function (sex) {
    var path = "res/Audio/Game/Mahjong/Effect/";
    path += sex == 1 ? "Male/" : "Female/";
    path += "chi" + ".mp3";
    this.playEffect(path, false);
};

// 播放麻将碰牌音效
game.Audio.MahjongPlayPengEffect = function (sex) {
    var gameData = game.procedure.Mahjong.getGameData();
    var gameType = gameData.gameType;

    var path = "res/Audio/Game/Mahjong/Effect/";
    path += sex == 1 ? "Male/" : "Female/";
    path += gameType == 8 ? "c_" : "";
    path += "peng" + ".mp3";
    this.playEffect(path, false);
};

// 播放麻将杠牌音效
game.Audio.MahjongPlayGangEffect = function (sex, type) {
    var gameData = game.procedure.Mahjong.getGameData();
    var gameType = gameData.gameType;

    var path = "res/Audio/Game/Mahjong/Effect/";
    path += sex == 1 ? "Male/" : "Female/";

    if (gameType == 8) {
        path += "gang_" + type + ".mp3";
    }else {
        path += "gang" + ".mp3";
    }
    this.playEffect(path, false);
};

// 播放麻将胡牌音效 1点炮 2自摸
game.Audio.MahjongPlayHuEffect = function (sex, type) {
    var gameData = game.procedure.Mahjong.getGameData();
    var gameType = gameData.gameType;

    var path = "res/Audio/Game/Mahjong/Effect/";
    path += sex == 1 ? "Male/" : "Female/";
    path += gameType == 8 ? "c_" : "";
    path += type == 1 ? "hu" : "zimo";
    path += ".mp3";
    this.playEffect(path, false);
};

// 播放麻将上噶音效
game.Audio.MahjongPlayGaEffect = function (sex, num) {
    var path = "res/Audio/Game/Mahjong/Effect/";
    path += sex == 1 ? "Male/" : "Female/";
    path += "ga_" + num + ".mp3";
    this.playEffect(path, false);
};

// 播放麻将定缺音效
game.Audio.MahjongPlayDQEffect = function () {
    var path = "res/Audio/Game/Mahjong/dq.mp3";
    this.playEffect(path, false);
};