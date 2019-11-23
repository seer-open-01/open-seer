/**
 * Created by fuyang on 2018/10/13.
 */

//游戏中的任务宝箱
GameWindowBasic.TreasureBox = cc.Class.extend({

    _tipImg   :  null,                // 提示有奖的飘带
    _btnOpen  :  null,                // 打开宝箱的按钮
    _close    :  null,                // 宝箱关闭的样子图片
    _openImg  :  null,                // 宝箱打开的样子图片

    _cliekedHandler       : null,     // 打开按钮点击回调

    _parentNode           : null,     // 父节点

    _isInGameOpenBox      : false,    // 是否在游戏中打开任务宝箱的标识符


    ctor:function(node){

        this._parentNode = node;
        this._node = ccs.load("res/Games/Com/Box/Box.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },
    _init : function () {

        this._tipImg = game.findUI(this._node,"PIC_Img");
        this._close = game.findUI(this._node,"Img_Close");
        this._openImg = game.findUI(this._node,"Img_Open");
        this._btnOpen = game.findUI(this._node,"Btn_Open");
        this.__isInGameOpenBox = true;
        this._btnOpen.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED){
                cc.log("游戏类点击任务宝箱按钮");
                game.Audio.playBtnClickEffect();
                game.ui.TaskWindow.popup(function(haveReward){
                this._setImgShow(haveReward);
                }.bind(this),this.__isInGameOpenBox);
            }
        },this);

        this._setImgShow(game.DataKernel.haveTaskReward);
    },
    //设置图片对应显示
    _setImgShow :function(show){

        this._tipImg.setVisible(show);
        this._openImg.setVisible(show);
        this._close.setVisible(!show);
    },
    //重置状态
    reset:function(){
        this._tipImg.setVisible(false);
        this._openImg.setVisible(false);
        this._close.setVisible(false);
    },
    //外部调用，当玩家领取奖励以后，更新显示
    updateTaskBox:function(show){
        this.reset();
        this._setImgShow(show);
    }
});
