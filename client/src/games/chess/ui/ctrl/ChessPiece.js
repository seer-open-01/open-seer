/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋棋子
 */
WindowChess.Piece = cc.Class.extend({
    _parentNode         : null,
    _node               : null,
    
    _pic                : null,         // 棋子图片
    _id                 : -1,           // 棋子Id
    _red                : true,         // 棋子颜色
    _role               : -1,           // 棋子角色 车马炮等

    _point              : cc.p(0, 0),   // 坐标
    _dead               : false,        // 是否死亡
    
    ctor: function (id, node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Chess/Piece/Piece.json").node;
        this._id = id;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._red = ChessHelper.getPieceRed(this._id);
        this._role = ChessHelper.getPieceRole(this._id);

        this._pic = game.findUI(this._node, "ND_Piece");
        this._pic.setTexture(this.getResPath());
    },

    reset: function () {
        this._dead = false;
        this._point = cc.p(-1, -1);
        this.show(false);
    },

    show: function (vis) {
        this._node.setVisible(vis);
    },

    /**
     * 根据棋子的颜色和id获取资源路径
     */
    getResPath: function () {
        var path = "res/Games/Chess/Piece/";
        path += this._red ? "r_" : "b_";
        return path + this._role + ".png";
    },
    /**
     * 设置死亡
     */
    beKilled: function () {
        this._dead = true;
        this.show(false);
        this._point = cc.p(-10, -10);
    },
    /**
     * 设置坐标
     * @param point
     */
    setPoint: function (point) {
        this._point = point;
    },
    /**
     * 获取坐标
     * @returns {{x, y}|*}
     */
    getPoint: function () {
        return this._point;
    },
    /**
     * 动画用于开局棋子的摆放
     * @param point
     */
    setPointWithAction: function (point) {
        this._point = point;
        this._node.runAction(cc.MoveTo(0.2, ChessHelper.ptToPos(point)));
    },
    /**
     * 设置缩放
     * @param scale
     */
    setScale: function (scale) {
        this._node.setScale(scale);
    },
    /**
     * 设置位置
     */
    setPosition: function (x, y) {
        if (y == null || y == undefined) {
            this._node.setPosition(x);
        }else {
            this._node.setPosition(x, y);
        }
    },
    /**
     * 获取位置
     */
    getPosition: function () {
        return this._node.getPosition();
    },
    /**
     * 获取棋子Id
     */
    getId: function () {
        return this._id;
    },
    /**
     * 获取棋子颜色
     * @returns {boolean}
     */
    getRed: function () {
        return this._red;
    },
    /**
     * 走棋算法需要的信息
     * @returns {{}}
     */
    getInfo: function () {
        var info = {};
        info.role = this._role;
        info.point = this._point;
        info.dead = this._dead;
        info.red = this._red;
        return info;
    }
});