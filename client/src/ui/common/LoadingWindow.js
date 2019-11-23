/**
 * @author  Jiyou Mo
 */
// ==== 加载界面 ===========================================================================
game.ui.LoadingWindow = game.ui.PopupWindow.extend({

    _node               : null,         // UI层

    _spLoading          : null,         // 加载旋转框
    _spPeach            : null,         // 中间的桃子

    ctor : function () {
        this._super();

        // 加载UI控件
        this._node = ccs.load("res/Loading/Loading.json").node;
        this.addChild(this._node);

        var colorLayer = new cc.LayerColor(cc.color(0, 0, 0, 62));
        colorLayer.setName("ND_Mask");
        colorLayer.setLocalZOrder(-1);
        this.addChild(colorLayer);

        this._spLoading = game.findUI(this._node, "SP_Loading");
        this._spPeach = game.findUI(this._node, "SP_Peach");
        this._spHintWord = game.findUI(this._node,"SP_HintWord");
        this._spHintWord.setString("请稍后...");
        return true;
    },

    playAnimations : function () {
        var action = cc.rotateBy(1.5, 360);
        this._spLoading.stopAllActions();
        this._spLoading.runAction(action.repeatForever());

        action = cc.sequence(cc.scaleTo(1.5, -1, 1), cc.scaleTo(1.5, 1, 1));
        this._spPeach.stopAllActions();
        this._spPeach.runAction(action.repeatForever());
    },
    setTipValue:function(tip){
        if(tip == null || tip == undefined ){
            this._spHintWord.setString("请稍后...");
        }
        else{
            this._spHintWord.setString(tip);
        }
    },
    update : function (dt) {}
});
