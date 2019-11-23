/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋棋盘
 */
WindowChess.ChessBoard = cc.Layer.extend({

    _parentNode         : null,             // 父节点

    _location           : cc.p(0, 0),       // 点击的位置
    _pieces             : [],               // 棋子
    _tipPts             : [],               // 路径提示点

    _tagSelect          : null,             // 选中框
    _tagMove            : null,             // 移动框

    _redTurn            : true,             // 红方回合还是黑方回合
    _selectId           : -1,               // 当前被选中的棋子

    _canTouch           : false,            // 棋盘是否可以被点击
    _lastTime           : 0,                // 最后的请求时间限制频繁请求

    ctor: function (node) {
        this._super();
        this._parentNode = node;
        this._init();
        this._parentNode.addChild(this);
        return true;
    },

    _init: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }, this);

        // 初始化棋子
        this._pieces = [];
        for (var i = 0; i < 32; ++i) {
            var piece = new WindowChess.Piece(i, this);
            piece.reset();
            this._pieces.push(piece);
        }

        // 创建18个点等待备用
        this._tipPts = [];
        for (i = 0; i < 18; ++i) {
            var tipPt = new cc.Sprite("res/Games/Chess/Image/IMG_TipPoint.png");
            tipPt.setPosition(ChessHelper.getTipPointPos(cc.p(-10, -10)));
            tipPt.setLocalZOrder(10);
            this.addChild(tipPt);tipPt.setVisible(false);
            this._tipPts.push(tipPt);
        }

        // 初始化选择框和移动框
        this._tagSelect = new cc.Sprite("res/Games/Chess/Image/IMG_TagRed.png");
        this._tagSelect.setVisible(false);this.addChild(this._tagSelect);
        this._tagMove = new cc.Sprite("res/Games/Chess/Image/IMG_TagBlack.png");
        this._tagMove.setVisible(false);this.addChild(this._tagMove);

    },
    /**
     * 重置棋盘 1隐藏所有棋子 2隐藏提示路径 3成员变量初始化
     */
    reset: function () {
        for (var i = 0; i < this._pieces.length; ++i) {
            this._pieces[i].reset();
        }

        this.hideTipPoint();
        this._selectId = -1;
        this._tagMove.setVisible(false);
        this._tagSelect.setVisible(false);

        this._redTurn = true;
        this._canTouch = false;
    },
    /**
     * 开局重新摆棋子带动画
     */
    initForNewRound: function () {
        for (var i = 0; i < this._pieces.length; ++i) {
            var piece = this._pieces[i];
            var initPoint = ChessHelper.initPoint[i];
            var rx = Math.random() * 1280;
            var ry = Math.random() * 720;
            piece.setPosition(rx, ry);
            piece.setPointWithAction(initPoint);
            piece.show(true);
        }
    },
    /**
     * 摆棋子 重连使用
     * @param chessMap 存活棋子信息的数组
     */
    initChess: function (chessMap) {
        for (var i = 0; i < this._pieces.length; ++i) {
            this._pieces[i].reset();
        }
        for (var j = 0; j < chessMap.length; ++j) {
            var chessInfo = chessMap[j];
            var piece = this._pieces[+chessInfo.id];
            piece.setPoint(cc.p(chessInfo.x, chessInfo.y));
            piece.setPosition(ChessHelper.ptToPos(cc.p(chessInfo.x, chessInfo.y)));
            piece.show(true);
        }
    },
    /**
     * 点击事件
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchBegan: function (touch, event) {
        // cc.log("=== TouchBegan ===");

        if (!this._canTouch) {
            cc.log("不是你的回合！！");
            return false;
        }

        var target = event.getCurrentTarget();
        var location = target.convertToNodeSpace(touch.getLocation());
        var rect = cc.rect(360, 30, 600, 680);
        if (cc.rectContainsPoint(rect, location)) {
            this._location = ChessHelper.posToPt(location.x, location.y);
            cc.log("点击棋盘的位置 " + JSON.stringify(this._location));
            cc.log("选择棋子的ID " + this.getPiece());
            var clickId = this.getPiece();
            // 返回棋子的id不为-1；该颜色的回合；没有其他棋子被选中
            if (this._selectId == -1) {
                this.reqSelect(clickId, this._location);
            }else {
                this.reqMove(this._selectId, clickId, this._location);
            }

            return true;
        }

        return false;
    },
    
    onTouchMoved: function (touch, event) {
        // cc.log("=== TouchMoved ===");
    },
    
    onTouchEnded: function (touch, event) {
        // cc.log("=== TouchEnded ===");
        var target = event.getCurrentTarget();
        var location = target.convertToNodeSpace(touch.getLocation());
        var rect = cc.rect(360, 30, 600, 680);
        if (cc.rectContainsPoint(rect, location)) {

        }
    },
    /**
     * 获取点击的棋子
     * @returns {*}
     */
    getPiece: function () {
        for(var i=0; i < 32; ++i) {
            var piece = this._pieces[i];
            if (ChessHelper.ptEqualPt(piece.getPoint(), this._location)) {
                return piece.getId();
            }
        }
        return -1;
    },
    /**
     * 请求选中的棋子
     */
    reqSelect: function (id, point) {
        if (id == -1) {
            return;
        }
        // cc.log("ccc " + this._pieces[id].getRed());
        // cc.log("ddd " + this._redTurn);
        // 不是你的棋子
        if (this._pieces[id].getRed() != this._redTurn) {
            cc.log("不是你的棋子!");
            return;
        }

        if (!this.canReq()) {
            cc.log("请求过去频繁！");
            return;
        }

        game.gameNet.sendMessage(protocol.ProtoID.XQ_SELECT_CHESS, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            selectId: id,
            x: point.x, y: point.y
        });

        //==== 单机选棋逻辑 =====================================================
        // _selectId为选中的棋子的id
        // this._selectId = id;
        // cc.log("eee " + id);
        // cc.log("fff " + this._selectId);
        // this._pieces[this._selectId].setScale(1.1);
        // var path = ChessRule.getPath(this._pieces[this._selectId].getInfo());
        // cc.log("棋子可以走的坐标 " + JSON.stringify(path));
        // this.showTipPoint(path);
        // this._tagSelect.setPosition(this._pieces[id].getPosition());
        // this._tagSelect.setVisible(true);
    },
    /**
     * 选棋外部调用
     * @param selectId 选择的棋子Id
     * @param index 选棋的玩家索引
     * @param path 选棋后提示的可走路径
     */
    selectPiece: function (selectId, index, path) {
        this._selectId = selectId;
        var gameData = game.procedure.Chess.getGameData();
        if (index == gameData.playerIndex) {
            var piece = this._pieces[this._selectId];
            piece.setScale(1.1);

            var pos = ChessHelper.ptToPos(piece.getPoint());
            this._tagSelect.setPosition(pos);
            this._tagSelect.setVisible(true);
            this.showTipPoint(path);

            // 选择棋子的音效
            game.Audio.chessPlaySelect();
        }
    },
    /**
     * 请求移动棋子
     * @param moveId 要移动的棋子
     * @param killId 杀死的棋子
     * @param point  点击的位置
     */
    reqMove: function (moveId, killId, point) {

        // cc.log("aaa " + this._pieces[moveId].getRed());
        // cc.log("bbb " + this._pieces[killId].getRed());

        //killId != -1表示触摸点的位置上有一个棋子
        //_pieces[moveId]->getRed() == _pieces[killId]->getRed()表示触摸点上的棋子和走棋的棋子的颜色相同
        if (killId != -1 && this._pieces[moveId].getRed() == this._pieces[killId].getRed()) {
            // 切换选择棋子 恢复棋子大小 隐藏路径提示 重新设置选择的棋子和提示路径
            this._pieces[moveId].setScale(1);
            this.hideTipPoint();
            this.reqSelect(killId, point);
            return;
        }

        if (!this.canReq()) {
            cc.log("请求过去频繁！");
            return;
        }

        var cPoint = this._pieces[moveId].getPoint();
        game.gameNet.sendMessage(protocol.ProtoID.XQ_MOVE_CHESS, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            chessId: moveId,
            killId: killId,
            cx: cPoint.x, cy: cPoint.y,
            x: point.x, y: point.y
        });

        // ==== 单机逻辑 ===========================================
        // // 根据id判断是否符合走棋规则
        // if (!ChessRule.canMove(moveId, point)) {
        //     return;
        // }
        //
        // // 设置棋子的坐标
        // this._pieces[moveId].setPoint(point);
        // ChessRule.updateChessMap(moveId, this._pieces[moveId].getInfo());

        // // 棋子走动
        // var pos = ChessHelper.ptToPos(point);
        // var node = this._pieces[moveId]._node;
        // node.setLocalZOrder(node.getLocalZOrder() + 1);
        // var call = cc.CallFunc(this.moveComplete(node, killId), this);
        // node.runAction(cc.Sequence(cc.MoveTo(0.3, pos).easing(cc.easeIn(0.3)),call, this));
    },
    /**
     * 移动棋子外部调用
     * @param index 玩家索引
     * @param moveId 移动棋子的Id
     * @param killId 杀死棋子的Id
     * @param movePt 当前坐标
     * @param toPt   走的坐标
     */
    movePiece: function (index, moveId, killId, movePt, toPt) {

        // 设置棋子的坐标
        var piece = this._pieces[moveId];
        piece.setPoint(toPt);

        // 显示上一步的标记
        //var gameData = game.procedure.Chess.getGameData();
        //if (index == gameData.playerIndex) {
            this._tagMove.setPosition(ChessHelper.ptToPos(movePt));
            this._tagMove.setVisible(true);
        //}

        var endPos = ChessHelper.ptToPos(toPt);
        var node = piece._node;
        node.setLocalZOrder(node.getLocalZOrder() + 1);
        var call = cc.CallFunc(this.moveComplete(node, killId), this);
        node.runAction(cc.Sequence(cc.MoveTo(0.3, endPos).easing(cc.easeIn(0.3)),call, this));
    },
    /**
     * 棋子移动完毕回调
     * @param node
     * @param killId
     */
    moveComplete: function (node, killId) {
        // 移动的位置上有棋子杀死该棋子
        if (killId != -1) {
            this._pieces[killId].beKilled();
        }
        // 恢复棋子的状态
        node.setScale(1);
        node.setLocalZOrder(node.getLocalZOrder() - 1);

        // 移动棋子的音效
        game.Audio.chessPlayMove();

        // 隐藏提示路径和框选
        this.hideTipPoint();
        this._tagSelect.setVisible(false);
    },
    /**
     * 显示提示路径
     * @param path
     */
    showTipPoint: function (path) {
        if (path.length < 1) {
            return;
        }
        for (var i = 0; i < path.length; ++i) {
            this._tipPts[i].setPosition(ChessHelper.getTipPointPos(path[i]));
            this._tipPts[i].setVisible(true);
        }
    },
    /**
     * 隐藏提示路径
     */
    hideTipPoint: function () {
        for (var i = 0; i < this._tipPts.length; ++i) {
            this._tipPts[i].setPosition(ChessHelper.getTipPointPos(cc.p(-10, -10)));
            this._tipPts[i].setVisible(false);
        }
    },
    /**
     * 开启棋盘触摸
     * @param bool
     */
    setTouch: function (bool) {
        this._canTouch = bool;
    },
    /**
     * 设置回合
     * @param bool
     */
    setRedTurn: function (bool) {
        this._redTurn = bool;
    },
    /**
     * 设置选择的棋子Id
     */
    setSelectId: function (id) {
        this._selectId = id;
    },
    /**
     * 限制请求时间间隔
     * @returns {boolean}
     */
    canReq: function () {
        var now = new Date();
        var isCan = true;
        if (now - this._lastTime < 300) {
            isCan = false;
        }
        this._lastTime = now;
        return isCan;
    }
});