/**
 *  拼十方法
 */
let clone = require("clone");
let CommFuc = require("../../../util/CommonFuc.js");
let Enum = require("./Enum");

function addNumber(obj, k, n) {
    if(obj[k]){
        obj[k] += n
    }else {
        obj[k] = n
    }
}
function eachKeyNum(obj, callback) {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++){
        callback && callback(keys[i], obj[keys[i]])
    }
}

function countObj(obj) {
    return Object.keys(obj).length
}


class Func {

    /**
     * 获取点数
     * @param card
     * @returns {number}
     */
    getPoint (card){
        let point = card % 100

            return point;
    }

    /**
     * 获取花色
     * @param card
     * @returns {number}
     */
    getColor(card) {
        return Math.floor(card / 100)
    }

    /**
     * 是否有斗
     * @param card1
     * @param card2
     * @param card3
     * @returns {boolean}
     */
    hasDou (card1, card2, card3){
        let point1 = this.getPoint(card1);
        let point2 = this.getPoint(card2);
        let point3 = this.getPoint(card3);
        if(point1 > 10){
            point1 = 10
        }
        if(point2 > 10){
            point2 = 10
        }
        if(point3 > 10){
            point3 = 10
        }
        let sum = point1 + point2 + point3;

        return ((sum%10) === 0)
    }

    /**
     * 计算所有普通斗
     * @param cards
     * @returns {Array}
     */
    calcNormalPairs (cards){
        let self = this;
        let result = [];
        for(let i = 0; i < cards.length - 2; i++){
            for (let j = i + 1; j < cards.length - 1; j++){
                for (let k = j + 1; k < cards.length; k++){
                    let flag = self.hasDou(cards[i], cards[j], cards[k])
                    //let flag = false
                    if(flag){
                        let pair = {
                            dou:[],
                            niu:[]
                        };
                        pair.dou.push(cards[i]);
                        pair.dou.push(cards[j]);
                        pair.dou.push(cards[k]);
                        for(let l = 0; l < cards.length; l++){
                            if(pair.dou.indexOf(cards[l]) === -1){
                                pair.niu.push(cards[l])
                            }
                        }
                        result.push(pair)
                    }
                }
            }
        }
        return result
    }


    /**
     * 数组转对象
     * @param cardsArr
     * @returns {{}}
     */
    cardsArrToObj(cardsArr) {
        let obj = {};
        for(let i = 0; i < cardsArr.length; i++){
            addNumber(obj, cardsArr[i],1)
        }
        return obj;
    }

    /**
     * 对象转数组
     * @param arrayObj
     * @returns {Array}
     */
    cardObjToArray(arrayObj) {
        let keys = Object.keys(arrayObj);
        let temp = [];
        keys.forEach(function (v) {
            if (arrayObj[v]) {
                for(let i = 0;i < arrayObj[v];++i)
                    temp.push(+v);
            }
        });
        return temp;
    }

    //同花
    checkFlower(cards) {
        let colors = {};
        for (let c in cards){
            if(cards[+c]){
                let color = this.getColor(c)
                colors[color] = 1
            }
        }
        return (countObj(colors) === 1)
    }

    checkRun(points) {
        let pointsArray = this.cardObjToArray(points);

        pointsArray.sort((a, b)=>{
            return a > b
        })

        for (let i = 1; i < pointsArray.length; i++){
            if(pointsArray[i - 1] !== pointsArray[i] - 1){
                return false
            }
        }

        return true
    }

//顺子
    checkStraight(handCards) {
        let cards = clone(handCards);
        let cardsArray = this.cardObjToArray(cards);

        let points = this.getPointCards(cardsArray);
        if(countObj(points) !== 5){
            return 0
        }
        if(this.checkRun(points)){
            return 1
        }
        if(points[1]){
            points[1] = 0;
            points[13 + 1] = 1;
            if(this.checkRun(points)){
                return 2
            }
        }
        return 0
    }

//葫芦
    checkGourd(cards) {
        let cardsArray = this.cardObjToArray(cards);
        if(cardsArray.length !== 5){
            return false
        }
        let points = this.getPointCards(cardsArray);

        if(countObj(points) !== 2){
            return false
        }
        let flag = false;
        eachKeyNum(points, (c, n) => {
            if(n === 3){
                flag = true
            }
        });
        return flag
    }

    getGourdArray(cards) {
        let cardsArray = this.cardObjToArray(cards);

        let points = this.getPointCards(cardsArray);
        let point = 0;
        eachKeyNum(points, (c, n) => {
            if(n === 3){
                point = c
            }
        });
        let arr = [];
        for(let i = 0; i < cardsArray.length; i++){
            if(this.getPoint(cardsArray[i]) === point){
                arr.push(cardsArray[i])
            }
        }

        return arr

    }

//同花顺
    checkStraightFlower(cards) {
        if(this.checkFlower(cards)){
            return this.checkStraight(cards)
        }
        return 0
    }

//德州
    texasCow(handCardsObj) {
        let all = []
        let isFlower = this.checkFlower(handCardsObj);
        let allCardsArr = this.cardObjToArray(handCardsObj);
        if(isFlower){
            let flower = {
                "pattern": Enum.CardType.TH,
                "selectCards": [],
                "ghost": false,
                "cards": allCardsArr,
                "calcCards": allCardsArr
            }
            all.push(flower)
        }
        if(this.checkGourd(handCardsObj)){
            let gourd = {
                "pattern": Enum.CardType.HL,
                "selectCards": [],
                "ghost": false,
                "cards": allCardsArr,
                "calcCards": allCardsArr
            }
            gourd.selectCards = this.getGourdArray(handCardsObj)
            all.push(gourd)
        }
        let isStraight = this.checkStraight(handCardsObj)
        if(isStraight){
            let straight = {
                "pattern": Enum.CardType.SZ,
                "selectCards": [],
                "ghost": false,
                "cards": allCardsArr,
                "calcCards": {}
            }
            let calcCards = clone(handCardsObj)
            if(isStraight == 2){
                calcCards[1] = 0
                calcCards[13 + 1] = 1
            }
            straight.calcCards = calcCards
            all.push(straight)
        }

        let isStraightFlower = (isFlower && isStraight)
        if(isStraightFlower){
            let straightFlower = {
                "pattern": Enum.CardType.THS,
                "selectCards": [],
                "ghost": false,
                "cards": allCardsArr,
                "calcCards": {}
            }
            let calcCards = clone(handCardsObj)
            if(isStraight == 2){
                calcCards[1] = 0
                calcCards[13 + 1] = 1
            }
            straightFlower.calcCards = calcCards
            all.push(straightFlower)
        }

        return this.getMaxCowWithArray(all)
    }

    calcCow(handCardsObj, option) {
        if(!option){
            option = {}
        }
        let cow = {
            "pattern": 0,
            "selectCards": [],
            "ghost": false,
            "cards": {},
            "pair": {},
            "calcCards": {}
        };
        let cows = [];
        let ghost = 0;
        let isGN = false;
        let otherCards = [];
        let allCards = handCardsObj;
        let allCardsArr = this.cardObjToArray(handCardsObj);

        otherCards = Object.keys(allCards)
        let pointCards = this.getPointCards(otherCards);
        let bomb = 0;
        let whn = 0;
        let wxn = 0;

        for (let point in pointCards){
            point = +point;
            let n = pointCards[point];
            if (n === 4) {
                bomb = 1;
            }
            if(point < 11){
                whn = -1;
            }else if(whn >= 0){
                whn++;
            }
            if(point < 5 && wxn >= 0){
                for(let i = 0; i < n; ++i){
                    wxn += point;
                }
            }else{
                wxn = -1;
            }
        }
        //计算炸弹牛
        if (bomb && option.ZD) {
            let b = {
                "pattern": Enum.CardType.ZD,
                "selectCards": [],
                "ghost": isGN,
                "pair": {},
                "cards": allCardsArr,
                "calcCards": allCardsArr
            };
            cows.push(b);
        }
        //计算五花牛
        if(whn > 0 && option.WH){
            let h = {
                "pattern": Enum.CardType.WH,
                "selectCards": [],
                "ghost": isGN,
                "cards": allCardsArr,
                "pair": {},
                "calcCards": allCardsArr
            };
            cows.push(h);
        }
        //计算五小牛
        if(wxn > 0 && option.WX){
            DEBUG(111145465)
            let xn = wxn + ghost;
            if(xn < 10){
                let x = {
                    "pattern": Enum.CardType.WX,
                    "selectCards": [],
                    "ghost": isGN,
                    "cards": allCardsArr,
                    "pair": {},
                    "calcCards": allCardsArr
                };
                cows.push(x);
            }
        }
        if(option.TEXAS){
            let texas = this.texasCow(handCardsObj);
            if(texas){
                cows.push(texas)
            }
        }
        if(cows.length === 0){
            let normalPairs = this.calcNormalPairs(allCardsArr);
            let allNomalCow = this.getAllNormalCow(normalPairs, allCardsArr);
            let maxNomalCow = this.getMaxCowWithArray(allNomalCow);
            cows.push(maxNomalCow);
        }
        return this.getMaxCowWithArray(cows);
    }

//获取牌组的点数
    getPointCards(cards){
        let pointCards = {};
        for (let i = 0; i < cards.length; i++) {
            addNumber(pointCards, this.getPoint(cards[i]), 1);
        }
        return pointCards;
    }
//获取所有的牛
    getAllNormalCow(selectCardsArr, handCardsArr){
        let allCow = [];
        let cards = handCardsArr;
        let ghost = false;
        if(selectCardsArr.length == 0){
            let wuniu = {
                "pattern": Enum.CardType.P0,
                "selectCards": [],
                "ghost": ghost,
                "cards": cards,
                "ksd": 0,
                "calcCards": cards
            };
            allCow.push(wuniu);
        }
        for(let i = 0; i < selectCardsArr.length; i++){
            let pair = selectCardsArr[i]
            let pattern = this.getCow(pair.niu)
            let cow = {
                "pattern": pattern,
                "selectCards": pair.dou,
                "ghost": ghost,
                "cards": cards,
                "pair": pair,
                "calcCards": cards
            };
            allCow.push(cow);
        }

        return allCow;
    }

//计算2张牌的牛
    getCow(cardArray){
        let point = 0;
        let ghost = 0;
        for(let i = 0; i < cardArray.length; i++){
            let tp = this.getPoint(cardArray[i]);
            if(tp > 10){
                tp = 10
            }
            point += tp;
        }
        let nPoint = point % 10;
        let pattern = Enum.CardType.P0;

        if (nPoint === 0) {
            pattern = Enum.CardType.PN;
        } else {
            pattern = Enum.CardType['P' + nPoint];
        }
        return pattern;
    }
    //获取数组里最大的牛
    getMaxCowWithArray(cowArray){
        let max = null;
        for(let i = 0; i < cowArray.length; i++){
            if(!max || this.compareCow(cowArray[i], max)){
                max = cowArray[i];
            }
        }
        return max;
    }

    compareCard(card1, card2) {
        let point1 = this.getPoint(card1);
        let point2 = this.getPoint(card2);

        if (point1 === point2) {
            let color1 = this.getColor(card1);
            let color2 = this.getColor(card2);
            return color1 < color2;
        } else {
            return point1 > point2;
        }
    }

    cardSort(card1, card2){
        let point1 = this.getPoint(card1);
        let point2 = this.getPoint(card2);

        if (point1 === point2) {
            let color1 = this.getColor(card1);
            let color2 = this.getColor(card2);
            return color1 > color2;
        } else {
            return point1 < point2;
        }
    }

    cardNumSort(a, b){
        if(this.cardSort(a, b)){
            return 1
        }else if(this.cardSort(b, a)){
            return -1
        }else {
            return 0
        }
    }

    typeSort(cards, cow){
        if(cow.selectCards.length > 0){
            let tempCards = []

            cow.pair.dou.sort((a, b) => {
                return this.cardNumSort(a, b)
            })
            cow.pair.dou.forEach((card) => {
                tempCards.push(card)
            })

            cow.pair.niu.sort((a, b) => {
                return this.cardNumSort(a, b)
            })
            cow.pair.niu.forEach((card) => {
                tempCards.push(card)
            })
            DEBUG("sort1")
            return tempCards
        }else {

            DEBUG("sort2")
            return cards.sort((a, b)=>{
                return this.cardNumSort(a,b)
            })
        }
    }

    getMaxCard(cardsArr) {
        let maxCard = 0;
        cardsArr.forEach((card) => {
            //if (selectCards && selectCards.indexOf(card) == -1) {
            if (!maxCard || this.compareCard(card, maxCard)) {
                maxCard = card;
            }
            // }
        });
        return maxCard;
    }

    compareCow(cow1, cow2){
        if(cow1.pattern > cow2.pattern){
            return true;
        }else if(cow1.pattern === cow2.pattern){
            let cow1Arr = cow1.cards;
            let cow2Arr = cow2.cards;
            let c1 = this.getMaxCard(cow1Arr);
            let c2 = this.getMaxCard(cow2Arr);
            return this.compareCard(c1, c2);
        }
        return false;
    }

    combination (args, num, context) {
        if(!context){
            context = {};
            context.result = [];
            context.current = 0;
            context.pos = 0;
        }
        let tempArray = [];
        if(context.current >= args.length){
            return
        }else{
            tempArray.push(args[context.current]);
            for(let i = context.current; i < args.length; i++){
                tempArray.push(args[i])
            }
            this.combination(args, num, context);
        }

        return tempArray;
    }

};

module.exports = new Func();