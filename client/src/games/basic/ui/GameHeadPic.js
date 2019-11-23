/**
 * Created by Jiyou Mo on 2017/11/7.
 */
// 游戏中的玩家头像
GameWindowBasic.GameHeadPic = cc.Class.extend({

    _headImg            : null,             // 头像
    _headBtn            : null,             // 按钮
    _clickedHandler     : null,             // 点击事件处理程序

    ctor : function (node) {
        this._headImg = game.findUI(node, "ND_HeadImg");
        this._headImg.retain();
        // this.roundRect();
        this._headBtn = game.findUI(node, "ND_HeadBtn");
        this._headBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._clickedHandler && this._clickedHandler();
            }
        }, this);

        return true;
    },

    /**
     * 对头像图片进行圆角处理
     */
    roundRect : function () {
        //圆角层实现代码
        var sprite = new cc.Sprite("res/Common/Images/ComHeadPicMask.png");
        sprite.setScale(this._headImg.getContentSize().width / sprite.getContentSize().width);
        sprite.x = this._headImg.getContentSize().width / 2;
        sprite.y = this._headImg.getContentSize().height / 2;
        var clippingPanel = new cc.ClippingNode(sprite);
        clippingPanel.alphaThreshold = 0.02;

        clippingPanel.x = this._headImg.getPosition().x - this._headImg.getContentSize().width / 2;
        clippingPanel.y = this._headImg.getPosition().y - this._headImg.getContentSize().height / 2;
        this._headImg.getParent().addChild(clippingPanel, this._headImg.getLocalZOrder());
        this._headImg.removeFromParent(false);
        clippingPanel.addChild(this._headImg);
        this._headImg.x = this._headImg.getContentSize().width / 2;
        this._headImg.y = this._headImg.getContentSize().height / 2;
    },


    /**
     * 设置信息
     * @param headPic  头像路径
     */
    setHeadPic : function(headPic) {
        if (headPic && headPic != "") {
            cc.textureCache.addImageAsync(headPic, function(tex) {
                this._headImg.setTexture(tex);
                if(this._headImg) {
                    this._headImg.setScale(0.89, 0.88);
                }
            }.bind(this), this);
        } else {
            this._headImg.setTexture("res/Games/Com/Head/HeadDefaultImg.png");
        }
    },
    /**
     * 更换默认头像图片
     * @param url
     */
    setDefaultImg: function (url) {
        this._headImg.setTexture(url);
    },
    /**
     * 设置点击处理程序
     * @param callback
     */
    setClickedHandler : function(callback) {
        this._clickedHandler = callback;
    }
});