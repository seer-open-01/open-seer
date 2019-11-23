/**
 * Created by Jiyou Mo on 2017/12/6.
 */
// 游戏中礼物 (互动表情)
var GameGift = GameGift || {};

// 类型
GameGift.Type = {
    QinZui      : 1,        // 亲嘴
    YeZi        : 2,        // 椰子
    Hua         : 3,        // 花
    ZhaDan      : 4,        // 炸弹
    DaoJiu      : 5         // 倒酒
};

// 消耗
GameGift.Consume = {};
GameGift.Consume[GameGift.Type.QinZui] = 0;     // 亲嘴消耗
GameGift.Consume[GameGift.Type.YeZi] = 0;       // 椰子消耗
GameGift.Consume[GameGift.Type.Hua] = 0;        // 花消耗
GameGift.Consume[GameGift.Type.ZhaDan] = 0;     // 炸弹消耗
GameGift.Consume[GameGift.Type.DaoJiu] = 0;     // 倒酒消耗

/**
 * 播放礼品效果
 * @param uiNode            效果被添加的父节点
 * @param beginPosition     开始播放的位置 (世界坐标)
 * @param endPosition       结束播放的位置 (世界坐标)
 * @param giftType          播放的类型
 */
GameGift.playGiftEffect = function (uiNode, beginPosition, endPosition, giftType) {
    switch (giftType) {
        case this.Type.QinZui   : this._playQinZui(uiNode, beginPosition, endPosition); break;
        case this.Type.YeZi     : this._playYeZi(uiNode, beginPosition, endPosition); break;
        case this.Type.Hua      : this._playHua(uiNode, beginPosition, endPosition); break;
        case this.Type.ZhaDan   : this._playZhaDan(uiNode, beginPosition, endPosition); break;
        case this.Type.DaoJiu   : this._playDaoJiu(uiNode, beginPosition, endPosition); break;
        default                 : cc.log("===> 位置类型的礼物互动表情" + giftType); break;
    }
};

/**
 * 播放亲嘴效果
 * @param uiNode
 * @param beginPosition
 * @param endPosition
 * @private
 */
GameGift._playQinZui = function (uiNode, beginPosition, endPosition) {
    beginPosition = uiNode.convertToNodeSpace(beginPosition);
    endPosition = uiNode.convertToNodeSpace(endPosition);

    var sp = new cc.Sprite("res/Games/ComWindow/PlayerInfo/GameComPlayerInfo_BTNQinZuiN.png");
    sp.setPosition(beginPosition);
    uiNode.addChild(sp);
    var move = cc.moveTo(0.5, endPosition);
    var fun = cc.CallFunc(function () {
        sp.removeFromParent(true);
        var json = ccs.load("res/Games/ComWindow/PlayerInfo/Emoji/Kiss/EffKiss.json");
        var effectNode = json.node;
        var effectAction = json.action;
        effectNode.setPosition(endPosition);
        effectNode.setScale(1.5, 1.5);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
        game.Audio.playGameGiftSound(GameGift.Type.QinZui);
    });

    sp.runAction(cc.sequence(move, fun));
};

/**
 * 播放椰子特效
 * @param uiNode
 * @param beginPosition
 * @param endPosition
 * @private
 */
GameGift._playYeZi = function (uiNode, beginPosition, endPosition) {
    var sp = new cc.Sprite("res/Games/ComWindow/PlayerInfo/GameComPlayerInfo_BTNYeZiN.png");
    sp.setPosition(beginPosition);
    uiNode.addChild(sp);
    var move = cc.moveTo(0.5, endPosition);
    var rotate = cc.rotateBy(0.5, 360);
    var fun = cc.CallFunc(function () {
        sp.removeFromParent(true);
        var json = ccs.load("res/Games/ComWindow/PlayerInfo/Emoji/YeZi/EffYeZi.json");
        var effectNode = json.node;
        var effectAction = json.action;
        effectNode.setPosition(endPosition);
        effectNode.setScale(1.5, 1.5);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
    });

    sp.runAction(cc.sequence(cc.spawn(move, rotate), fun));
    game.Audio.playGameGiftSound(GameGift.Type.YeZi);
};

/**
 * 播放花特效
 * @param uiNode
 * @param beginPosition
 * @param endPosition
 * @private
 */
GameGift._playHua = function (uiNode, beginPosition, endPosition) {
    var sp = new cc.Sprite("res/Games/ComWindow/PlayerInfo/GameComPlayerInfo_BTNHuaN.png");
    sp.setPosition(beginPosition);
    uiNode.addChild(sp);
    var move = cc.moveTo(0.5, endPosition);
    var fun = cc.CallFunc(function () {
        sp.removeFromParent(true);
        var json = ccs.load("res/Games/ComWindow/PlayerInfo/Emoji/Rose/EffRose.json");
        var effectNode = json.node;
        var effectAction = json.action;
        effectNode.setPosition(endPosition);
        effectNode.setScale(1.5, 1.5);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
    });

    sp.runAction(cc.sequence(move, fun));
    game.Audio.playGameGiftSound(GameGift.Type.Hua);
};

/**
 * 播放炸弹特效
 * @param uiNode
 * @param beginPosition
 * @param endPosition
 * @private
 */
GameGift._playZhaDan = function (uiNode, beginPosition, endPosition) {
    var sp = new cc.Sprite("res/Games/ComWindow/PlayerInfo/GameComPlayerInfo_BTNZhaDanN.png");
    sp.setPosition(beginPosition);
    uiNode.addChild(sp);
    var move = cc.moveTo(0.5, endPosition);
    var fun = cc.CallFunc(function () {
        sp.removeFromParent(true);
        var json = ccs.load("res/Games/ComWindow/PlayerInfo/Emoji/Bomb/EffBomb.json");
        var effectNode = json.node;
        var effectAction = json.action;
        effectNode.setPosition(endPosition);
        effectNode.setScale(1.0, 1.0);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
        setTimeout(function () {
            game.Audio.playGameGiftSound(GameGift.Type.ZhaDan);
        }, 400);
    });

    sp.runAction(cc.sequence(move, fun));
};

/**
 * 播放倒酒特效
 * @param uiNode
 * @param beginPosition
 * @param endPosition
 * @private
 */
GameGift._playDaoJiu = function (uiNode, beginPosition, endPosition) {
    var sp = new cc.Sprite("res/Games/ComWindow/PlayerInfo/GameComPlayerInfo_BTNDaoJiuN.png");
    sp.setPosition(beginPosition);
    sp.setScale(0.5, 0.5);
    uiNode.addChild(sp);
    var move = cc.moveTo(0.5, endPosition);
    var fun = cc.CallFunc(function () {
        sp.removeFromParent(true);
        var json = ccs.load("res/Games/ComWindow/PlayerInfo/Emoji/DaoJiu/DaoJiu.json");
        var effectNode = json.node;
        var effectAction = json.action;
        effectNode.setPosition(endPosition);
        effectNode.setScale(0.5, 0.5);
        uiNode.addChild(effectNode);

        effectAction.setLastFrameCallFunc(function () {
            effectNode.stopAllActions();
            effectNode.removeFromParent(true);
        });

        effectNode.runAction(effectAction);
        effectAction.play("animation0", false);
    });

    sp.runAction(cc.sequence(move, fun));
    game.Audio.playGameGiftSound(GameGift.Type.DaoJiu);
};
