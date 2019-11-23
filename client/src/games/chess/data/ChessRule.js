/**
 * Author       : lyndon
 * Date         : 2018-07-24
 * Description  : 象棋走棋算法
 */
var ChessRule = ChessRule || {};

ChessRule.width = 8;
ChessRule.height = 9;
ChessRule.redKillPos = [];
ChessRule.blackKillPos = [];
ChessRule.chessMap = [];

ChessRule.init = function () {

};
/**
 * 检测超出边界
 * @param x
 * @param y
 * @returns {boolean}
 */
ChessRule.checkPosOut = function (x, y) {
    var tempX = x;
    var tempY = y;
    return (tempX >= 0 && tempX <= this.width && tempY >= 0 && tempY <= this.height);
};
/**
 * 通过坐标拿到棋子
 * @param pt
 * @returns {*}
 */
ChessRule.getChessByPoint = function (pt) {
    for (var i = 0; i < this.chessMap.length; ++i) {
        if (this.ptEqualPt(this.chessMap[i].point, pt)) {
            return this.chessMap[i];
        }
    }
    return null;
};
/**
 * 更新棋盘所有棋子信息
 * @param id
 * @param info
 */
ChessRule.updateChessMap = function (id, info) {
    for (var i = 0; i < this.chessMap.length; ++i) {
        if (id == i) {
            this.chessMap[id] = info;
        }
    }
    cc.log("=== ChessMap update " + JSON.stringify(ChessRule.chessMap));
};

ChessRule.updateRedKillMap = function () {

};

ChessRule.updateBlackKillMap = function () {

};
/**
 * 判断是否可以移动
 * @param id
 * @param pt
 * @returns {boolean}
 */
ChessRule.canMove = function (id, pt) {
    var role = ChessHelper.getPieceRole(id);
    switch (role) {
        case ChessHelper.pieceRole.JIANG:
            break;
        case ChessHelper.pieceRole.SHI:
            break;
        case ChessHelper.pieceRole.XIANG:
            break;
        case ChessHelper.pieceRole.JU:
            break;
        case ChessHelper.pieceRole.MA:
            break;
        case ChessHelper.pieceRole.PAO:
            break;
        case ChessHelper.pieceRole.ZU:
            break;
    }

    return false;
};
/**
 * 点击棋子后提示棋子可以走的路径
 * @param chessInfo
 * @returns {*}
 */
ChessRule.getPath = function (chessInfo) {
    var role = chessInfo.role;
    var pt = chessInfo.point;
    cc.log("当前角色是 " + role);
    cc.log("当前坐标是 " + JSON.stringify(pt));
    var arr = null;

    switch (role) {
        case ChessHelper.pieceRole.JIANG:
            arr = this.getJiangPath(pt);
            break;
        case ChessHelper.pieceRole.SHI:
            arr = this.getShiPath(pt);
            break;
        case ChessHelper.pieceRole.XIANG:
            arr = this.getXiangPath(pt);
            break;
        case ChessHelper.pieceRole.JU:
            arr = this.getJuPath(pt);
            break;
        case ChessHelper.pieceRole.MA:
            arr = this.getMaPath(pt);
            break;
        case ChessHelper.pieceRole.PAO:
            arr = this.getPaoPath(pt);
            break;
        case ChessHelper.pieceRole.ZU:
            arr = this.getZuPath(pt);
            break;
    }

    return arr;
};
/**
 * 获取车可以走的位置
 * @param pt
 */
ChessRule.getJuPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-1, 0, 1, 0];
    var offY = [0, 1, 0, -1];
    var chess = this.getChessByPoint(pt);
    for (var i = 0; i < 4; ++i) {
        var tempX = x;
        var tempY = y;
        for (; this.checkPosOut(tempX, tempY); tempX += offX[i],tempY += offY[i]) {
            var tempPos = cc.p(tempX, tempY);
            if (this.ptEqualPt(tempPos, pt)) {
                continue;
            }
            var tempChess = this.getChessByPoint(tempPos);
            if (tempChess) {
                if (tempChess.red != chess.red) {
                    path.push(tempPos);
                    break;
                }else {
                    break;
                }
            }else {
                path.push(tempPos);
            }
        }
    }
    return path;
};
/**
 * 获取马可以走的位置
 * @param pt
 */
ChessRule.getMaPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-2,-1,1,2,2,1,-1,-2];
    var offY = [1,2,2,1,-1,-2,-2,-1];
    var stopX = [-1,0,0,1,1,0,0,-1];
    var stopY = [0,1,1,0,0,-1,-1,0];
    var chess = this.getChessByPoint(pt);
    for (var i = 0; i < 8; ++i){
        var tempX = x + offX[i];
        var tempY = y + offY[i];
        var tempPos = cc.p(tempX, tempY);
        var tempStopX = x + stopX[i];
        var tempStopY = y + stopY[i];
        if(!this.checkPosOut(tempStopX, tempStopY)){
            continue;
        }
        var stopPos = cc.p(tempStopX, tempStopY);
        var stopChess = this.getChessByPoint(stopPos);
        // cc.log("============================stopChess " + JSON.stringify(stopChess) );
        if(stopChess){
            continue;
        }
        if(!this.checkPosOut(tempX, tempY)){
            continue;
        }
        var tempChess = this.getChessByPoint(tempPos);
        // cc.log("============================tempChess " + JSON.stringify(tempChess) );
        if (tempChess) {
            if(tempChess.red != chess.red){
                path.push(tempPos);
            }
        }else {
            path.push(tempPos);
        }
    }
    return path;
};
/**
 * 获取炮的可走路径
 * @param pt
 * @returns {Array}
 */
ChessRule.getPaoPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-1,0,1,0];
    var offY = [0,1,0,-1];
    var chess = this.getChessByPoint(pt);
    for (var i = 0; i < 4; ++i){
        var tempX = x;
        var tempY = y;
        var flag = true;
        for (; this.checkPosOut(tempX, tempY); tempX += offX[i], tempY += offY[i]){
            var tempPos = cc.p(tempX, tempY);
            var tempChess = this.getChessByPoint(tempPos);
            if(this.ptEqualPt(tempPos, pt)){
                continue;
            }
            if(tempChess){
                if(flag){
                    flag = false;
                } else {
                    if(tempChess.red != chess.red){
                        path.push(tempPos);
                    }
                    break;
                }
            }else {
                if (flag) {
                    path.push(tempPos);
                }
            }
        }
    }
    return path;
};
/**
 * 获取象可以走的路径
 * @param pt
 * @returns {Array}
 */
ChessRule.getXiangPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-2,2,2,-2];
    var offY = [2,2,-2,-2];
    var stopOffX = [-1,1,1,-1];
    var stopOffY = [1,1,-1,-1];
    var chess = this.getChessByPoint(pt);
    // cc.log("============================stopChess " + JSON.stringify(chess) );
    for (var i = 0; i < 4; ++i){
        var tempX = x + offX[i];
        var tempY = y + offY[i];
        var tempStopX = x + stopOffX[i];
        var tempStopY = y + stopOffY[i];
        var tempPos = cc.p(tempX, tempY);
        var stopPos = cc.p(tempStopX, tempStopY);

        if(!this.checkPosOut(tempX, tempY)){
            continue;
        }
        var stopChess = this.getChessByPoint(stopPos);
        if (stopChess) {
            continue;
        }

        //象不能过河
        if(chess.red){
            if(tempY >= this.height * 0.5){
                continue;
            }
        }else{
            if(tempY < this.height * 0.5){
                continue;
            }
        }

        var tempChess = this.getChessByPoint(tempPos);
        // cc.log("============================tempChess " + JSON.stringify(tempChess) );
        if (tempChess) {
            if (tempChess.red != chess.red) {
                path.push(tempPos);
            }
        }else {
            path.push(tempPos);
        }
    }
    return path;
};
/**
 * 获取士可以走的路径
 * @param pt
 * @returns {Array}
 */
ChessRule.getShiPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-1,1,1,-1];
    var offY = [1,1,-1,-1];
    var chess = this.getChessByPoint(pt);
    for (var i = 0; i < 4; ++i){
        var tempX = x + offX[i];
        var tempY = y + offY[i];
        var tempPos = cc.p(tempX, tempY);
        if(!this.checkPosOut(tempX, tempY)){
            continue;
        }
        //士不能出家
        if(tempX > 5 || tempX < 3){
            continue;
        }
        if(chess.red){
            if(tempY > 2){
                continue;
            }
        }else{
            if(tempY < this.height - 2){
                continue;
            }
        }
        var tempChess = this.getChessByPoint(tempPos);
        if (tempChess) {
            if(tempChess.red != chess.red){
                path.push(tempPos);
            }
        } else {
            path.push(tempPos);
        }

    }
    return path;
};
/**
 * 获取将可以走的路径
 * @param pt
 * @returns {Array}
 */
ChessRule.getJiangPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-1,0,1,0];
    var offY = [0,1,0,-1];
    var chess = this.getChessByPoint(pt);
    for (var i = 0; i < 4; ++i){
        var tempX = x + offX[i];
        var tempY = y + offY[i];
        var tempPos = cc.p(tempX, tempY);

        if(!this.checkPosOut(tempX, tempY)){
            continue;
        }

        // 帅不能出家
        if(tempX > 5 || tempX < 3){
            continue;
        }
        if (chess.red) {
            if (tempY > 2) {
                continue;
            }
        }else {
            if (tempY < 7) {
                continue
            }
        }

        // TODO:帅不能走死路


        // 帅将不能见面
        var flag = false;
        if (chess.red) {
            for (var j = tempY + 1; j < this.height; ++j) {
                var stopPos = cc.p(tempX, j);
                var stopChess = this.getChessByPoint(stopPos);
                if (stopChess) {
                    if (stopChess.role == ChessHelper.pieceRole.JIANG) {
                        flag = true;
                    }
                    break;
                }
            }
        }else {
            for (j = tempY - 1; j >= 0; --j) {
                stopPos = cc.p(tempX, j);
                stopChess = this.getChessByPoint(stopPos);
                if (stopChess) {
                    if (stopChess.role == ChessHelper.pieceRole.JIANG) {
                        flag = true;
                    }
                    break;
                }
            }
        }
        if (flag) {
            continue;
        }

        var tempChess = this.getChessByPoint(tempPos);
        if (tempChess) {
            if(tempChess.red != chess.red){
                path.push(tempPos);
            }
        } else {
            path.push(tempPos);
        }
    }
    return path;
};
/**
 * 获取卒可以走的路径
 * @param pt
 * @returns {Array}
 */
ChessRule.getZuPath = function (pt) {
    var path = [];
    var x = pt.x;
    var y = pt.y;
    var offX = [-1,0,1,0];
    var offY = [0,1,0,-1];
    var chess = this.getChessByPoint(pt);
    // cc.log("============================chess " + JSON.stringify(chess));
    for (var i = 0; i < 4; ++i){
        var tempX = x + offX[i];
        var tempY = y + offY[i];
        var tempPos = cc.p(tempX, tempY);

        if(!this.checkPosOut(tempX, tempY)){
            continue;
        }

        // 过河才能左右
        if (offX[i] != 0) {
            if (chess.red) {
                if (y <= 4) {
                    continue;
                }
            }else {
                if (y > 4) {
                    continue;
                }
            }
        }

        //兵不能后退
        if(chess.red){
            if(offY[i] < 0){
                continue;
            }
        }else{
            if(offY[i] > 0){
                continue;
            }
        }

        var tempChess = this.getChessByPoint(tempPos);
        // cc.log("============================tempChess " + JSON.stringify(tempChess));
        if (tempChess) {
            if(tempChess.red != chess.red){
                path.push(tempPos)
            }
        }else {
            path.push(tempPos)
        }

    }
    return path;
};