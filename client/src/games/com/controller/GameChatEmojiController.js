/**
 * Created by Jiyou Mo on 2017/11/8.
 */
// 聊天表情播放控件
var GameChatEmojiController = GameChatEmojiController || {};

/**
 * 获取特效表情动画
 * @param id
 * @return {*}
 * @private
 */
GameChatEmojiController._getEmoji = function (id) {
    return ccs.load(this.RES_PATH + id + ".json");
};

/**
 * 播放表情
 * @param uiNode        // 用于播放的节点
 * @param id            // 播放表情的id
 * @param position          // 播放表情的位置 世界坐标
 * @param completeCallback          // 动画完成回调函数
 */
GameChatEmojiController.playEmoji = function (uiNode, id, position, completeCallback) {
    position = position || cc.p(0, 0);
    var json = this._getEmoji(id);
    var emojiNode = json.node;
    var emojiAction = json.action;
    emojiNode.setPosition(position);
    emojiNode.setScale(1.0, 1.0);
    uiNode.addChild(emojiNode);

    // emojiAction.setLastFrameCallFunc(function () {
    //     emojiNode.stopAllActions();
    //     emojiNode.removeFromParent(true);
    //     completeCallback && completeCallback();
    // });

    emojiNode.runAction(emojiAction);
    emojiAction.play("animation0", true);

    // 所有的表情都只播3秒
    emojiNode.runAction(cc.sequence(cc.delayTime(3), cc.CallFunc(function () {
        emojiNode.stopAllActions();
        emojiNode.removeFromParent(true);
        completeCallback && completeCallback();
    })));
};

GameChatEmojiController.RES_PATH = "res/Games/ComWindow/ChatWindow/ChatFaceEmoji/Emoji_";