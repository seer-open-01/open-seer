/**
 * Author       : lyndon
 * Date         : 2018-08-20
 * Description  : 拼十音效
 */
game.Audio.nnPlayBGM = function(){
    var fileName = "res/Audio/Game/PinShi/bgm.mp3";
    if (game.config.BGM_ON)
    this.playMusic(fileName, true);
};
// 新一局音效
game.Audio.nnPlayNewRound = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/new_round.mp3";
    game.Audio.playEffect(fileName);
};
// 结算音效
game.Audio.nnPlaySettlement= function (win) {
    var fileName = "res/Audio/Game/PinShi/Effect/";
    if (win){
        fileName += "win.mp3";
    }else {
        fileName += "lose.mp3";
    }
    game.Audio.playEffect(fileName);
};
// 飞金币音效
game.Audio.nnPlayFlyCoin = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/coin_fly.mp3";
    game.Audio.playEffect(fileName);
};
// 抢庄音效
game.Audio.nnPlayRobDealer = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/dealer_rob.mp3";
    game.Audio.playEffect(fileName, false);
};
// 定庄音效
game.Audio.nnPlayDealerOk = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/dealer_sure.mp3";
    game.Audio.playEffect(fileName);
};
// 加注音效
game.Audio.nnPlayAddAnte = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/coin_add.mp3";
    game.Audio.playEffect(fileName);
};
// 发牌音效--单张
game.Audio.nnPlayDealCard = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/deal_cards.mp3";
    game.Audio.playEffect(fileName);
};
// 倒计时警报
game.Audio.nnPlayTimeWaring = function(){
    var fileName = "res/Audio/Game/PinShi/Effect/warning.mp3";
    game.Audio.playEffect(fileName);
};
// 牌型音效
game.Audio.nnPlayPattern = function(pattern,sex){
    var fileName = "res/Audio/Game/PinShi/Effect/";
    if(sex == 1){
        fileName += "Male/" + pattern + ".mp3";
    }else{
        fileName += "Female/" + pattern + ".mp3";
    }
    cc.log("拼十牌型音效 ==> " + fileName);
    game.Audio.playEffect(fileName);
};
// 其他音效：1.开始抢庄 2.开始加注
game.Audio.nnPlayOther = function (type) {
    var fileName = "res/Audio/Game/PinShi/Effect/";
    if (type == 1) {
        fileName += "dealer_plz.mp3";
    }else {
        fileName += "start_ante.mp3";
    }
    game.Audio.playEffect(fileName);
};