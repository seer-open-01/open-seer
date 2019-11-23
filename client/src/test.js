/**
 * 查找object的name属性为"XXX"的子对象
 */
// var hah = {
//     aaa: {
//         name: "AAA",
//         bbb: {
//             name: "BBB"
//         },
//         ccc: {
//             name: "CCC"
//         }
//     },
//     ddd: {
//         name: "DDD"
//     },
//     eee: {
//         name: "EEE"
//     }
// };
//
// function findObj(obj, name) {
//     var value = name;
//     var count = 0;
//     var ret = null;
//
//     function _find(o) {
//         if (typeof o == 'object') {
//             for (var key in o) {
//                 if (ret != null) break;
//                 count++;
//                 if (o.hasOwnProperty(key)) {
//                     var _v = o[key];
//                     if (_v == value) {
//                         console.log("==>get " + count);
//                         ret = o;
//                         break;
//                     } else {
//                         _find(_v);
//                     }
//                 }
//             }
//         }
//     }
//     _find(obj);
//
//     console.log("==>end " + count);
//     return ret;
// }
//
// function formatCoin(coin) {
//     var result = coin;
//     if (coin >= 10000) {
//         result = coin / 10000 + "w";
//     }
//     return result;
// }
//
// console.log("==> " + formatCoin(100001));
// console.log("==> " + formatCoin(10000));
// console.log("==> " + formatCoin(9999.99));
// console.log("==> " + JSON.stringify(findObj(hah, "CCC")));

// var cards = [11, 12, 13, 31, 32, 33, 34, 35, 14, 21, 22, 22, 24, 36];
// var handCardsSort = function (handCardsArray, que) {
//     var array = JSON.parse(JSON.stringify(handCardsArray));
//     array.sort(function (a, b) {
//         return b - a;
//     });
//
//     if (que == undefined || que == null) {// 正常排序
//         return array;
//     }
//     var arr1 = [];
//     var arr2 = [];
//     while (array.length > 0) {
//         var value = array.shift();
//         if (Math.floor(value / 10) == que) {
//             arr2.push(value)
//         }else {
//             arr1.push(value);
//         }
//     }
//     return arr1.concat(arr2);
// };
//
// console.log("==> " + handCardsSort(cards));
// console.log("==> " + handCardsSort(cards, 3));


// console.log(1.235.toFloor(2));
// console.log(1.2350001.toFixed(2));