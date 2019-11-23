/**
 * Created by Jiyou Mo on 2017/11/2.
 */
var GameEffectController = GameEffectController || {};

// 特效类型
GameEffectController.gameEffectType = {
    // 斗地主特效
    DDZChunTian             :   1,          // 春天
    DDZFeiJi                :   2,          // 飞机
    DDZLianDui              :   3,          // 连队
    DDZShunZi               :   4,          // 顺子
    DDZWangZha              :   5,          // 王炸
    DDZHuoJian              :   6,          // 火箭
    DDZZhaDan               :   7,          // 炸弹
    DDZMaoZi                :   8,          // 飞帽子特效
    RUNZhaDan               :   9,          // 跑的快炸弹

    // 麻将特效
    MJGang                  :   101,        // 杠
    MJPeng                  :   102,        // 碰
    MJHu                    :   103,        // 胡
    MJChi                   :   104,        // 吃
    MJBuHua                 :   105,        // 补花
    MJWIND                  :   106,        // 风
    MJRAIN                  :   107,        // 雨
    MJDIAN                  :   108,        // 闪电
    MJZiMo                  :   109,        // 自摸

    // 拼三张
    PSZQuanBi               :   201,        // 全比特效

    // 象棋
    ChessChi                :   301,        // 吃特效
    ChessJiang              :   302,        // 将特效

    // 公共部分
    KaiJu                   :   1001,       // 开局
    ShanDian                :   1002        // 闪电
};

/**
 * 播放游戏中的特效
 * @param parentUINode      被添加特效的UI节点  (加载的特效将作为子节点添加到该节点)
 * @param beginPosition     特效开始时候的位置(相对于UI节点的世界坐标)  (如果特效只在一个位置播放，这该位置传null)
 * @param endPosition       特效结束时候的位置(相对于UI节点的世界坐标)  (也是特效真正播放的位置)
 * @param EffectType        特效的类型
 * @param completeCallback  特效播放完毕回调函数
 */
GameEffectController.playGameEffect = function (parentUINode, beginPosition, endPosition, EffectType, completeCallback) {
    if (!parentUINode) {
        cc.log("游戏特效播放的父节点参数无效");
        return;
    }

    if (!endPosition) {
        cc.log("游戏特效播放的endPosition参数无效");
        return;
    }

    switch (EffectType) {
        case this.gameEffectType.DDZChunTian :     // 斗地主 春天特效
            this._playSpringEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.DDZFeiJi :        // 斗地主 飞机特效
            this._playAircraftEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.DDZLianDui :      // 斗地主 连队特效
            this._playLianDuiEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.DDZShunZi :       // 斗地主 顺子特效
            this._playStraightEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.DDZWangZha :      // 斗地主 王炸特效
            this._playRocketEffect(parentUINode, endPosition, completeCallback);
            this._playKingBombTextEffect(parentUINode, endPosition);
            break;
        case this.gameEffectType.DDZHuoJian :      // 斗地主 火箭特效
            this._playRocketEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.DDZZhaDan :       // 斗地主 炸弹特效
            this._playBombEffect(parentUINode, beginPosition, endPosition, completeCallback);
            this._playBombWordEffect(parentUINode, endPosition);
            break;
        case this.gameEffectType.RUNZhaDan :       // 斗地主 炸弹特效
            this._playBomb2Effect(parentUINode, beginPosition, endPosition, completeCallback);
            this._playBombWordEffect(parentUINode, endPosition);
            break;
        case this.gameEffectType.DDZMaoZi :       // 斗地主 帽子飞
            this._playHatFlyEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJGang :          // 麻将 杠
            this._playGangEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJHu :             // 麻将 胡
            this._playHuEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJPeng :           // 麻将 碰
            this._playPengWordEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJChi :            // 麻将 吃
            this._playChiEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJBuHua :          // 麻将 补花
            this._playBuHuaEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJWIND :          // 麻将 风
            this._playWindEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJRAIN :          // 麻将 雨
            this._playRainEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJDIAN :          // 麻将 闪电
            this._playDianEffect(parentUINode, endPosition, completeCallback);
            this._playDian2Effect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.MJZiMo :          // 麻将 自摸
            this._playZiMoEffect(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.PSZQuanBi :        // 拼三张 全比
            this._playQuanBi(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.ChessChi:          // 象棋吃特效
            this._playChessChi(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.ChessJiang:        // 象棋将特效
            this._playChessJiang(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.KaiJu :            // 公用 开局
            this._playKaiJu(parentUINode, endPosition, completeCallback);
            break;
        case this.gameEffectType.ShanDian :         // 公用 闪电
            this._playShanDian(parentUINode, endPosition, completeCallback);
            break;
        default : cc.log("未知类型的游戏特效类型:" + EffectType); break;
    }
};

/**
 * 麻将 吃特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playChiEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffChi/eff_chi.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 麻将 补花特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playBuHuaEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffBuHua/eff_buhua.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 麻将 刮风
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playWindEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffWind/Eff_LJF.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);

    game.Audio.playGameEffectSound(this.gameEffectType.MJWIND);
};

/**
 * 麻将 下雨
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playRainEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffRain/Rain.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);

    game.Audio.playGameEffectSound(this.gameEffectType.MJRAIN);
};

/**
 * 麻将 下雨
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playDianEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffHuPaiShanDian/EffShanDianA.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
    }.bind(this));

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

GameEffectController._playDian2Effect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffHuPaiShanDian/EffShanDianB.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 麻将 碰文字特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playPengWordEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffPeng/eff_peng.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 麻将 胡特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playHuEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffHu/eff_hu.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 麻将 自摸特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playZiMoEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffZiMo/EffZiMo.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 麻将 杠特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playGangEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffMaJiang/EffGang/eff_gang.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

// ====== 斗地主 ===================================================================================
GameEffectController._playHatFlyEffect = function (uiNode, endPos, callback) {
    var beginPos = uiNode.convertToNodeSpace(cc.p(640, 460));
    endPos = uiNode.convertToNodeSpace(endPos);
    // beginPos = cc.pAdd(beginPos, cc.p(0, -120));

    var json = ccs.load("res/Animations/EffDouDiZhu/EffHat/EffHat.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(beginPos);
    uiNode.addChild(effectNode);

    var hatSprite = cc.Sprite("res/Games/DouDiZhu/Image/IMG_DiZhu.png");
    hatSprite.setPosition(beginPos);
    hatSprite.setScale(0);
    uiNode.addChild(hatSprite);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        hatSprite.setScale(1);
        hatSprite.runAction(cc.Sequence(cc.MoveTo(0.8, endPos), cc.CallFunc(function () {
            hatSprite.stopAllActions();
            hatSprite.removeFromParent(true);
            callback && callback();
        }, this)))
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};
/**
 * 斗地主 炸弹文字特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playBombWordEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffZhaDan/EffZhaDan.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(cc.pAdd(position, cc.p(0, -120)));
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 斗地主 炸弹特效
 * @param uiNode        特效父节点
 * @param beginPosition     特效开始播放的位置
 * @param endPosition       特效结束播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playBombEffect = function (uiNode, beginPosition, endPosition, callback) {
    beginPosition = uiNode.convertToNodeSpace(beginPosition);
    endPosition = uiNode.convertToNodeSpace(endPosition);

    var bombSprite = new cc.Sprite("res/Animations/EffDouDiZhu/EffZhaDan/DDZZhaDan2.png");
    bombSprite.setPosition(beginPosition);
    // bombSprite.setScale(1.5);
    uiNode.addChild(bombSprite);

    var rotate = cc.rotateBy(0.3, 720);
    var move = cc.MoveTo(0.3, endPosition);
    var callFun = cc.CallFunc(function () {
        bombSprite.stopAllActions();
        bombSprite.removeFromParent(true);
        var json = ccs.load("res/Animations/EffDouDiZhu/EffZhaDan/EffBaoZha.json");
        var effectNode = json.node;
        var effectAction = json.action;
        // effectNode.setScale(1.5, 1.5);
        effectNode.setPosition(endPosition);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
            callback && callback();
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
        game.Audio.playGameEffectSound(this.gameEffectType.DDZZhaDan);
    }.bind(this));

    var spawn = cc.spawn(rotate, move);
    bombSprite.runAction(cc.sequence(spawn, callFun));
};

GameEffectController._playBomb2Effect = function (uiNode, beginPosition, endPosition, callback) {
    beginPosition = uiNode.convertToNodeSpace(beginPosition);
    endPosition = uiNode.convertToNodeSpace(endPosition);

    var bombSprite = new cc.Sprite("res/Animations/EffDouDiZhu/EffZhaDan/DDZZhaDan2.png");
    bombSprite.setPosition(beginPosition);
    uiNode.addChild(bombSprite);

    var rotate = cc.rotateBy(0.3, 720);
    var move = cc.MoveTo(0.3, endPosition);
    var callFun = cc.CallFunc(function () {
        bombSprite.stopAllActions();
        bombSprite.removeFromParent(true);
        var json = ccs.load("res/Animations/EffDouDiZhu/EffZhaDan/EffBaoZha.json");
        var effectNode = json.node;
        var effectAction = json.action;
        game.findUI(json.node, "Node_1").setVisible(false);
        effectNode.setPosition(endPosition);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
            callback && callback();
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
        game.Audio.playGameEffectSound(this.gameEffectType.DDZZhaDan);
    }.bind(this));

    var spawn = cc.spawn(rotate, move);
    bombSprite.runAction(cc.sequence(spawn, callFun));
};

/**
 * 斗地主 火箭特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playRocketEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffWangZha/EffHuoJian01.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        this._playKingBombEffect(uiNode, position, callback);
    }.bind(this));

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.DDZWangZha);
};

/**
 * 斗地主 王炸特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playKingBombEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffWangZha/EffHuoJian02.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};

/**
 * 斗地主 王炸特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playKingBombTextEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffWangZha/EffWangZha.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(cc.pAdd(position, cc.p(0, -120)));
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};
/**
 * 斗地主 顺子特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playStraightEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffShunZi/EffShunZi.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.DDZShunZi);
};

/**
 * 斗地主 连队特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playLianDuiEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffLianDui/EffLianDui.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.DDZLianDui);
};

/**
 * 斗地主 飞机特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      特效完毕回调
 * @private
 */
GameEffectController._playAircraftEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffFeiJi/EffFeiJi.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.DDZFeiJi);
};

/**
 * 斗地主 春天特效
 * @param uiNode        特效父节点
 * @param position      特效播放的位置
 * @param callback      播放完毕回调
 * @private
 */
GameEffectController._playSpringEffect = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffDouDiZhu/EffChunTian/EffChunTian.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.6);
    uiNode.addChild(effectNode);

    // 此函数有问题，如果动画漏帧，则不会触发此函数
    // effectAction.addFrameEndCallFunc(60, "animation0", function () {
    //     effectNode.stopAllActions();
    //     effectNode.removeFromParent(true);
    //     callback && callback();
    // });
    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.DDZChunTian);
};

// ======== 拼三张部分 ===============================================================
GameEffectController._playQuanBi = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffPinSan/EffQuanBi/EffQuanBi.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};
// ======== 象棋部分 ===============================================================
GameEffectController._playChessChi = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffChess/EffChessChi.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);
    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });
    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};
GameEffectController._playChessJiang = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffChess/EffChessJiang.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    uiNode.addChild(effectNode);
    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });
    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
};
// ======== 游戏公用部分 =============================================================
/**
 * 播放游戏开局特效
 * @param uiNode
 * @param position
 * @param callback
 * @private
 */
GameEffectController._playKaiJu = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffGameCom/EffStart/EffStart.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.KaiJu);
};

/**
 * 播放游戏闪电特效
 * @param uiNode
 * @param position
 * @param callback
 * @private
 */
GameEffectController._playShanDian = function (uiNode, position, callback) {
    position = uiNode.convertToNodeSpace(position);
    var json = ccs.load("res/Animations/EffPinSan/EffBiPai/EffShanDian.json");
    var effectNode = json.node;
    var effectAction = json.action;
    effectNode.setPosition(position);
    effectNode.setScale(1.0, 1.0);
    uiNode.addChild(effectNode);

    effectAction.setLastFrameCallFunc(function () {
        effectNode.stopAllActions();
        effectNode.removeFromParent(true);
        callback && callback();
    });

    effectNode.runAction(effectAction);
    effectAction.play("animation0", false);
    game.Audio.playGameEffectSound(this.gameEffectType.ShanDian);
};