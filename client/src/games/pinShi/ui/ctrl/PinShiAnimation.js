/**
 * Created by lyndon on 2018/05/25.
 *  飞金贝动画
 */
var PinShiAnimation = PinShiAnimation || {};

PinShiAnimation.Shell_Path = "res/Common/Images/Com_Coin.png";
PinShiAnimation.shells = [];

PinShiAnimation.playFlyShell = function (node, bPos, ePos, callback) {



    var pos1 = node.convertToNodeSpace(bPos);
    var pos2 = node.convertToNodeSpace(ePos);

    var flyTime = 0.7;      // 金币飞行时间
    var coinNum = 10;        // 金币数量
    var intervalFlyTime = flyTime / coinNum;        // 每颗个金币开始飞行的时间间隔

    for (var i = 0; i < coinNum; ++i) {
        var sprite = new cc.Sprite(this.Shell_Path);
        sprite.setPosition(pos1);
        node.addChild(sprite);
        this._play(sprite, pos2, flyTime, intervalFlyTime * i);
    }

    // 播放整体金币音效
    game.Audio.nnPlayFlyCoin();

    var delay = cc.delayTime(flyTime + coinNum * intervalFlyTime - intervalFlyTime);
    var fun = cc.CallFunc(function () {
        callback && callback();
    }, this);
    node.runAction(cc.sequence(delay, fun));

};
PinShiAnimation._play = function (sprite, pos, flyTime, delayTime) {
    var bPos = sprite.getPosition();
    var bezier = this.getBezierAction(flyTime,bPos,pos);
    var delay = cc.delayTime(delayTime);
    var fun = cc.CallFunc(function () {
        sprite.removeFromParent(true);
    }, this);
    sprite.runAction(cc.sequence(delay, bezier, fun));
};
PinShiAnimation.getBezierAction = function (time, startPosition, endPosition, biased) {
    // 轨迹的直线向量
    var vec1 = cc.p(endPosition.x - startPosition.x, endPosition.y - startPosition.y);

    // 向量的旋转角度
    var angle = Math.floor((Math.random() * 100)) % 15;

    // 余角偏移，角度反转
    if (biased == 1) {
        angle = -angle;
    }

    // 向量的角度转换成弧度
    var radian = angle * Math.PI / 180;

    // 向量旋转后的坐标
    var cosAngle = Math.cos(radian);
    var sinAngle = Math.sin(radian);
    var x = vec1.x * cosAngle - vec1.y * sinAngle;
    var y = vec1.x * sinAngle + vec1.y * cosAngle;

    var random = Math.floor((Math.random() * 100)) % 25 + 25;

    var vec2 = cc.p(Math.floor(x * random * 0.01), Math.floor(y * random * 0.01));
    var controlPoint = cc.p(startPosition.x + vec2.x, startPosition.y + vec2.y);

    var bezierToConfig = [
        controlPoint,                 // 起点控制点
        controlPoint,                 // 终点控制点
        cc.p(endPosition.x, endPosition.y)      // 终点
    ];

    return cc.bezierTo(time, bezierToConfig).easing(cc.easeSineOut());
};