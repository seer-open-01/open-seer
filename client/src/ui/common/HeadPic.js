// ==== 头像 =====================================================

game.ui.HeadPic = cc.Class.extend({

    //>> 控件&变量
    _image: null,           // 头像
    _btn: null,             // 按钮
    _clickedHandler: null,  // 点击事件处理程序
    shader: null,
    //<< 控件&变量结束

    ctor : function(node) {
        this._image = game.findUI(node, "ND_Image");
        this._btn   = game.findUI(node, "ND_Btn");
        this._btn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._clickedHandler && this._clickedHandler();
            }
        }, this);

        // cc.log("round rect");
        // this.roundRect();
    },

    setSwallowTouches : function () {
        this._btn.setSwallowTouches(false);
    },

    roundRect : function() {
        //圆角层实现代码
        var sprite = new cc.Sprite("res/Common/Images/ComHeadPicMask.png");
        sprite.setScale(this._image.getContentSize().width / sprite.getContentSize().width);
        sprite.x = this._image.getContentSize().width * 0.5;
        sprite.y = this._image.getContentSize().height * 0.5;
        var clippingPanel = new cc.ClippingNode(sprite);
        clippingPanel.alphaThreshold = 0.02;

        clippingPanel.x = this._image.getPosition().x - this._image.getContentSize().width * 0.5;
        clippingPanel.y = this._image.getPosition().y - this._image.getContentSize().height * 0.5;
        this._image.getParent().addChild(clippingPanel, this._image.getLocalZOrder());
        this._image.removeFromParent();
        clippingPanel.addChild(this._image);
        this._image.x = this._image.getContentSize().width * 0.5;
        this._image.y = this._image.getContentSize().height * 0.5;
    },

    /**
     * 设置信息
     * @param url  信息
     */
    setHeadPic : function(url) {
        if (url && url != "") {
            this._setHeadPic(url);
        }else {
            this._image.setTexture(game.ui.HeadPic.DEFAULT_IMAGE)
        }
    },

    /**
     * 设置点击处理程序
     * @param callback
     */
    setClickedHandler : function(callback) {
        this._clickedHandler = callback;
    },

    /**
     * 设置头像
     * @param url
     * @private
     */
    _setHeadPic : function(url) {
        if (url && url != "") {
            cc.log("==> load headPic : " + url);
            cc.textureCache.addImageAsync(url, function(tex){
                this._image.setTexture(tex);
                if(this._image) {
                    this._image.setScale(0.89);
                }
            }.bind(this), this);
        }
    }
});

// 默认头像
game.ui.HeadPic.DEFAULT_IMAGE = "res/Common/Images/Com_HeadpicDef.png";