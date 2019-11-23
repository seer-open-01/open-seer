/**
 * Created by Jiyou Mo on 2017/11/6.
 */
ChatWindow.ChatText = cc.Class.extend({

    _node           : null,         // 本节点

    _textContent    : null,         // 类容文本
    _btnText        : null,         // 按钮

    ctor : function () {
        // 加载UI控件
        this._node = ccs.load("res/Games/ComWindow/ChatWindow/ChatText.json").node;
        this._init();
        return true;
    },

    _init : function () {
        this._btnText = game.findUI(this._node, "BTN_Text");
        this._textContent = game.findUI(this._btnText, "TXT_Content");
    },

    reset : function () {},

    /**
     * 设置信息
     * @param id            短语的编号
     * @param text          短语的内容
     * @param callback      按钮点击回调
     */
    setInfo : function (id, text, callback) {
        this._textContent.setString(text);
        this._btnText.id = id;                                  // 短语对应的id
        this._btnText.type = ChatWindow.ChatType.PHRASE;        // 短语类型
        this._btnText.addTouchEventListener(callback);
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    }
});

ChatWindow.ChatFace = cc.Class.extend({

    _node           : null,         // 本节点

    _imgContent     : null,         // 类容图片
    _btnFace        : null,         // 按钮

    ctor : function () {
        // 加载UI控件
        this._node = ccs.load("res/Games/ComWindow/ChatWindow/ChatFace.json").node;
        this._init();
        return true;
    },

    _init : function () {
        this._btnFace = game.findUI(this._node, "BTN_Face");
        this._imgContent = game.findUI(this._btnFace, "IMG_Content");
    },

    reset : function () {},

    /**
     * 设置信息
     * @param id            短语的编号
     * @param callback      按钮点击回调
     */
    setInfo : function (id, callback) {
        this._imgContent.loadTexture(ChatWindow.ChatFace.FACERES_PATH + "FaceImage/" + id + ".png");
        this._btnFace.id = id;                                // 短语对应的id
        this._btnFace.type = ChatWindow.ChatType.FACE;        // 短语类型
        this._btnFace.addTouchEventListener(callback);
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    }
});

ChatWindow.ChatFace.FACERES_PATH = "res/Games/ComWindow/ChatWindow/";