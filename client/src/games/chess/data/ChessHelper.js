/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋帮助类
 */
var ChessHelper = ChessHelper || {};

ChessHelper.ORG_POS = cc.p(374, 50);
// 黑方玩家翻转坐标 (374 + 69 * 8, 50 + 69 * 9)
ChessHelper.ORG_POS_T = cc.p(926, 671);
ChessHelper.DELTA_X = 69;
ChessHelper.DELTA_Y = 69;

/**
 * 将位置转换成坐标
 * @param x
 * @param y
 * @returns {{x, y}}
 */
ChessHelper.posToPt = function (x, y) {
    var gameData = game.procedure.Chess.getGameData();
    if (gameData.isCreator()) {
        var xx = Math.round((x - this.ORG_POS.x) / this.DELTA_X);
        var yy = Math.round((y - this.ORG_POS.y) / this.DELTA_Y);
    } else {
        xx = Math.round((this.ORG_POS_T.x - x) / this.DELTA_X);
        yy = Math.round((this.ORG_POS_T.y - y) / this.DELTA_Y);
    }

    return cc.p(xx, yy);
};
/**
 * 判断两点是否重合
 * @param pt1
 * @param pt2
 * @returns {boolean}
 */
ChessHelper.ptEqualPt = function (pt1, pt2) {
    var tempPt1 = pt1;
    var tempPt2 = pt2;
    return tempPt1.x == tempPt2.x && tempPt1.y == tempPt2.y
};
/**
 * 坐标点转换位置
 * @param point
 * @returns {{x, y}}
 */
ChessHelper.ptToPos = function (point) {
    var gameData = game.procedure.Chess.getGameData();
    if (gameData.isCreator()) {
        var xx = this.ORG_POS.x + this.DELTA_X * point.x;
        var yy = this.ORG_POS.y + this.DELTA_Y * point.y;
    } else {
        xx = this.ORG_POS.x + this.DELTA_X * (8 - point.x);
        yy = this.ORG_POS.y + this.DELTA_Y * (9 - point.y);
    }

    return cc.p(xx, yy)
};

/**
 * 提示点的锚点和棋子有偏差
 * 因此单独用一个转换位置的接口
 * @param point
 */
ChessHelper.getTipPointPos = function (point) {
    var gameData = game.procedure.Chess.getGameData();
    if (gameData.isCreator()) {
        var x = 376 + point.x * 69.1;
        var y = 58 + point.y * 68.5;
    } else {
        x = 376 + 69.1 * (8 - point.x);
        y = 58 + 68.5 * (9 - point.y);
    }

    return cc.p(x, y);
};
/**
 * 黑方玩家坐标转换
 * @param point
 * @returns {{x, y}}
 */
ChessHelper.transformXY = function (point) {
    return cc.p(8 - point.x, 9 - point.y);
};
/**
 * 通过id获取棋子的角色
 * @param id
 * @returns {number}
 */
ChessHelper.getPieceRole = function (id) {
    var map = this.pieceMap;
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            if (map[key].indexOf(id) > -1) {
                return +key;
            }
        }
    }

    return -1;
};
/**
 * 通过id获取棋子颜色
 * @param id
 */
ChessHelper.getPieceRed = function (id) {
    return id < 16;
};
/**
 * 棋子初始位置
 */
ChessHelper.initPoint = [
    cc.p(0, 0), cc.p(1, 0), cc.p(2, 0), cc.p(3, 0),
    cc.p(4, 0),
    cc.p(5, 0), cc.p(6, 0), cc.p(7, 0), cc.p(8, 0),
    cc.p(1, 2), cc.p(7, 2),
    cc.p(0, 3), cc.p(2, 3), cc.p(4, 3), cc.p(6, 3), cc.p(8, 3),

    cc.p(0, 6), cc.p(2, 6), cc.p(4, 6), cc.p(6, 6), cc.p(8, 6),
    cc.p(1, 7), cc.p(7, 7),
    cc.p(0, 9), cc.p(1, 9), cc.p(2, 9), cc.p(3, 9),
    cc.p(4, 9),
    cc.p(5, 9), cc.p(6, 9), cc.p(7, 9), cc.p(8, 9)
];
/**
 * 棋子角色映射
 */
ChessHelper.pieceRole = {
    JIANG: 0,
    SHI: 1,
    XIANG: 2,
    JU: 3,
    MA: 4,
    PAO: 5,
    ZU: 6
};
/**
 * 棋子角色和id的映射
 */
ChessHelper.pieceMap = {
    0: [4, 27],         // 将
    1: [3, 5, 26, 28],  // 士
    2: [2, 6, 25, 29],  // 象
    3: [0, 8, 23, 31],  // 车
    4: [1, 7, 24, 30],  // 马
    5: [9, 10, 21, 22], // 炮
    6: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] // 卒
};
