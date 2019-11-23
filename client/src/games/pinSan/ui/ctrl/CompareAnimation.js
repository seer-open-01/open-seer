/**
 * Created by Jiyou Mo on 2017/12/7.
 */
// 比牌动画
GameWindowPinSan.CompareAnimation = cc.Class.extend({
    _node               : null,         // 本节点

    _node_V             : null,         // V方数据
    _node_S             : null,         // S方数据

    _imgFire            : null,         // 火花图片
    _spHead_V           : null,         // V方玩家头像
    _headOriginalPos_V  : null,         // V方玩家头像原来的位置
    _spHead_S           : null,         // S方玩家头像
    _headOriginalPos_S  : null,         // S方玩家头像原来的位置
    // _imgLose_V          : null,         // V方失败图片
    // _imgLose_S          : null,         // S方失败图片
    _effLose_V          : null,         // V方失败特效
    _effLose_S          : null,         // S方失败特效
    _imgWin_V           : null,         // V方获胜图片
    _imgWin_S           : null,         // S方获胜图片

    _uiNode             : null,         // 游戏主界面
    _winIndex           : -1,           // 获胜方索引
    _loseIndex          : -1,           // 失败方索引
    _sourceIndex        : -1,           // 发起方索引
    _targetIndex        : -1,           // 目标方索引
    _completeCallback   : null,         // 动画执行完毕回调函数

    ctor : function () {
        this._node = ccs.load("res/Games/PinSan/CompareAnimation/CompareAnimation.json").node;
        this._node.retain();
        this._init();
        return true;
    },

    _init : function () {
        this._node_V = new GameWindowPinSan.CompareAnimationVS(game.findUI(this._node, "ND_V"));
        this._node_S = new GameWindowPinSan.CompareAnimationVS(game.findUI(this._node, "ND_S"));

        this._imgFire = game.findUI(this._node, "IMG_Fire");
        this._spHead_V = game.findUI(this._node, "SP_V_HeadPic");
        this._headOriginalPos_V = this._spHead_V.getPosition();
        this._spHead_S = game.findUI(this._node, "SP_S_HeadPic");
        this._headOriginalPos_S = this._spHead_S.getPosition();
        // this._imgLose_V = game.findUI(this._node, "IMG_V_Lose");
        // this._imgLose_S = game.findUI(this._node, "IMG_S_Lose");
        this._imgWin_V = game.findUI(this._node, "IMG_V_Win");
        this._imgWin_S = game.findUI(this._node, "IMG_S_Win");

        this._action = ccs.load("res/Animations/EffPinSan/EffBiPai/EffHuaHen.json").action;
        this._effLose_V = game.findUI(this._node, "Effect_V_Lose");
        this._effLose_S = game.findUI(this._node, "Effect_S_Lose");

    },

    reset : function () {
        this._node.setOpacity(255);
        this._node_V.reset();
        this._node_V.setPosition(cc.p(-700, 0));
        this._node_S.reset();
        this._node_S.setPosition(cc.p(700, 0));
        this._imgFire.setVisible(false);
        this._spHead_V.setScale(1.0);
        this._spHead_S.setScale(1.0);
        // this._imgLose_V.setVisible(false);
        // this._imgLose_S.setVisible(false);
        this._effLose_V.setVisible(false);
        this._effLose_S.setVisible(false);
        this._imgWin_V.setVisible(false);
        this._imgWin_S.setVisible(false);

        this._uiNode = null;
        this._winIndex = -1;
        this._loseIndex = -1;
        this._sourceIndex = -1;
        this._targetIndex = -1;
        this._completeCallback = null;
    },

    /**
     * 设置必要的信息
     * @param winIndex
     * @param loseIndex
     * @param sourceIndex
     * @param targetIndex
     * @param completeCallback
     */
    setInfo : function (winIndex, loseIndex, sourceIndex, targetIndex, completeCallback) {
        this._winIndex = winIndex;
        this._loseIndex = loseIndex;
        this._sourceIndex = sourceIndex;
        this._targetIndex = targetIndex;
        this._completeCallback = completeCallback;

        var gameData = game.procedure.PinSan.getGameData();
        var VPlayer = gameData.players[this._sourceIndex];
        var SPlayer = gameData.players[this._targetIndex];
        var VUiPlayer = this._uiNode.getPlayer(this._sourceIndex);
        var SUiPlayer = this._uiNode.getPlayer(this._targetIndex);
        var VHeadPos = this._node.convertToNodeSpace(VUiPlayer.getGiftWorldPos());
        var SHeadPos = this._node.convertToNodeSpace(SUiPlayer.getGiftWorldPos());
        this._spHead_V.setPosition(VHeadPos);
        this._spHead_S.setPosition(SHeadPos);
        if (VPlayer) {
            this._loadTexture(this._spHead_V, VPlayer.headPic);
        }
        if (SPlayer) {
            this._loadTexture(this._spHead_S, SPlayer.headPic);
        }
        this._node_V.setInfo(VPlayer);
        this._node_S.setInfo(SPlayer);
    },

    /**
     * 开始播放动画
     */
    play : function () {
        game.Audio.PSZPlayBiPaiTitleSound();
        game.Audio.PSZPlayBiPaiBGM();
        this._runAction0();
    },

    /**
     * 第零阶段的动画  比牌玩家的头像弹出
     * @private
     */
    _runAction0 : function () {
        var scaleBig = cc.scaleTo(0.5, 3.0);
        this._spHead_V.runAction(scaleBig.clone());
        var fun = cc.CallFunc(this._runAction1, this);
        this._spHead_S.runAction(cc.sequence(cc.delayTime(0.3), scaleBig.clone(), fun));
    },

    /**
     * 第一阶段动画  比牌面板撞击到一起
     * @private
     */
    _runAction1 : function () {
        this._node_S.moveToOriginalPosition(0.5, true);
        this._node_V.moveToOriginalPosition(0.5, false, this._runAction2.bind(this));
    },

    /**
     * 第二阶段的动画 头像移动到指定位置
     * @private
     */
    _runAction2 : function () {
        // 撞击音效
        game.Audio.PSZPlayBiPaiZhuangji();
        this._imgFire.setVisible(true);
        var moveToV = cc.moveTo(0.3, this._headOriginalPos_V);
        var moveToS = cc.moveTo(0.3, this._headOriginalPos_S);
        var scale = cc.ScaleTo(0.3, 1.0);
        var spawnV = cc.spawn(moveToV, scale.clone());
        var spawnS = cc.spawn(moveToS, scale.clone());
        this._spHead_V.runAction(spawnV);
        var fun = cc.CallFunc(this._runAction3, this);
        this._spHead_S.runAction(cc.sequence(cc.delayTime(0.5), spawnS, fun));
    },

    /**
     * 第三阶段的动画 展示内容
     * @private
     */
    _runAction3 : function () {
        this._node_S.showContent(true);
        this._node_V.showContent(true);

        var delay = cc.delayTime(0.25);
        var fun = cc.CallFunc(this._runAction4, this);
        this._node.runAction(cc.sequence(delay, fun))
    },

    /**
     * 第四阶段动画  闪电
     * @private
     */
    _runAction4 : function () {
        GameEffectController.playGameEffect(this._node, null, cc.p(640, 360), GameEffectController.gameEffectType.ShanDian, function () {
            this._runAction5();
        }.bind(this));
    },

    /**
     * 第五阶段动画 盖章
     * @private
     */
    _runAction5 : function () {
        var scale = cc.scaleTo(0.5, 1.0).easing(cc.easeBackInOut());
        var scale2 = cc.scaleTo(0.15, 1.5);
        var scale3 = cc.scaleTo(0.15, 1.0);
        // var fun = cc.CallFunc(this._runAction6, this);
        var action = ccs.load("res/Animations/EffPinSan/EffBiPai/EffHuaHen.json").action;
        action.setLastFrameCallFunc(this._runAction6.bind(this));
        if (this._loseIndex == this._sourceIndex) {
            // this._imgLose_V.setScale(5.0);
            // this._imgLose_V.setVisible(true);
            // this._imgLose_V.runAction(cc.sequence(scale, scale2.clone(), scale3.clone(), scale2.clone(), scale3.clone(), fun));
            this._effLose_V.setVisible(true);
            this._effLose_V.runAction(action);
            action.play("animation0", false);

            this._imgWin_S.setScale(5.0);
            this._imgWin_S.setVisible(true);
            this._imgWin_S.runAction(cc.sequence(scale, scale2.clone(), scale3.clone(), scale2.clone(), scale3.clone()));
        } else {
            // this._imgLose_S.setScale(5.0);
            // this._imgLose_S.setVisible(true);
            // this._imgLose_S.runAction(cc.sequence(scale, scale2.clone(), scale3.clone(), scale2.clone(), scale3.clone(), fun));
            this._effLose_S.setVisible(true);
            this._effLose_S.runAction(action);
            action.play("animation0", false);

            this._imgWin_V.setScale(5.0);
            this._imgWin_V.setVisible(true);
            this._imgWin_V.runAction(cc.sequence(scale, scale2.clone(), scale3.clone(), scale2.clone(), scale3.clone()));
        }
    },

    /**
     * 第六阶段动画 下落结束
     * @private
     */
    _runAction6 : function () {
        var gameData = game.procedure.PinSan.getGameData();
        // 只有赢家和输家才能听到结果音效
        if (this._loseIndex == gameData.playerIndex) {
            game.Audio.PSZPlayBiPaiResult(false);
        } else if (this._winIndex == gameData.playerIndex) {
            game.Audio.PSZPlayBiPaiResult(true);
        } else {
            game.Audio.PSZPlayBiPaiGaiZhang();
        }
        var delay = cc.delayTime(0.8);
        var move = cc.moveBy(0.2, cc.p(0, -200));
        var fadeOut = cc.fadeOut(0.2);
        var fun = cc.CallFunc(function () {
            this._node.removeFromParent(false);
            this._completeCallback && this._completeCallback();
        }, this);

        this._node.runAction(cc.sequence(delay, cc.spawn(move, fadeOut), fun));
    },

    /**
     * 给精灵异步加载图片
     * @param sprite
     * @param url
     * @private
     */
    _loadTexture : function (sprite, url) {
        if (url && url != "") {
            cc.textureCache.addImageAsync(url, function(tex) {
                sprite.setTexture(tex);
            });
        } else {
            sprite.setTexture("res/Games/Com/Head/HeadDefaultImg.png");
        }
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 将对象添加的用于显示的节点
     * @param uiNode
     * @param position
     */
    addToNode : function (uiNode, position) {
        this._uiNode = uiNode;
        position = uiNode.convertToNodeSpace(position);
        this._node.setPosition(position);
        uiNode.addChild(this._node);
    }
});

GameWindowPinSan.CompareAnimation._instance = null;

/**
 * 播放比牌动画
 * @param uiNode            动画需要添加的节点 (必须是游戏的主界面)
 * @param position          动画开始的位置 (世界坐标)
 * @param winIndex          赢家索引
 * @param loseIndex         输家索引
 * @param sourceIndex       发起者索引
 * @param targetIndex       目标者索引
 * @param completeCallback  动画完成回调
 */
GameWindowPinSan.CompareAnimation.playAnimation = function (uiNode,
                                                                 position,
                                                                 winIndex,
                                                                 loseIndex,
                                                                 sourceIndex,
                                                                 targetIndex,
                                                                 completeCallback) {
    if (this._instance == null) {
        this._instance = new GameWindowPinSan.CompareAnimation();
    }
    this._instance.reset();
    this._instance.addToNode(uiNode, position);
    this._instance.setInfo(winIndex, loseIndex, sourceIndex, targetIndex, completeCallback);
    this._instance.play();
};
