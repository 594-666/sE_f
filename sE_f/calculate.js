const { data } = require('./data')
const { century } = require('./century')

//"good" "flawless" "brilliance"
const priority = "good" //設定優先升級
const detail = false    //設定是否在運算完後log出整個liths

const times = data.length

let wholeTotal = 0, wholeCentury = 0, wholeRelic = 0
let wholeCenturyAve, wholeRelicAve
let voidTraces = 0, upgrade = "complete" //儲存光體跟

let relicList = [{name: "", times: 0, rarity: "", source: ""}]  
//獨立紀錄每個已獲得的的裝備的次數、稀有度、來源

let got = []    //已經得到的裝備，用於檢測一個遺物的裝備是否都被開過
let total = 0, totalCentury = 0, totalRelic = 0   //總開遺物次數

let mostCenturyTimes = 0, mostCentury = ""  //開最多次的遺物
let mostRelic = {name: "", times: 0, source: "", rarity: ""} //開到最多次的遺物
let centuryAverage, objectAverage   //遺物/裝備 開/開到的平均次數
let wieryObject //奇怪欸
const rounds = 5000
let divid = 500
console.time('耗時')
for(let r = 1; r <= rounds; r++) {

    liths = []
    init()
    transform(liths)
    const randomCentury = makeRandom()

    for(let i = 0; i < liths.length; i++) {
        const randC = randomCentury[i]
        let check = true    //是否繼續開(沒有集齊)
        let limit = 6       
        //需要開到的裝備數，因Forma Blueprint不是裝備，當遺物裡可以開到Forma Blueprint則不列入計算

        for(let l = 0; l < 6; l++) {
            if(liths[randC].relics[l].name === "Forma Blueprint") { //若為Forma Blueprint則不計數
                limit = 5
            }
        }
        let count = isCollectAll(liths[randC])
        check = !(count === limit)
        while(check) {
            total++
            randomWithVoidTraces(liths[randC])
            count = isCollectAll(liths[randC])
            check = !(count === limit)
            voidTraces += randomInt(6, 25)
        }
    }


    if(detail) {    //逐項log出liths
        for(let i = 0; i < liths.length; i++) {
            console.log(liths[i])    
        }
    }


    findMostCentury()
    findMostRelic()
    centuryAve()
    objectAve()
    somethingWiery()
    if(rounds < 10) {
console.log(`
第${r}輪，共抽了: ${total}次`
)
console.log(`
最多次裝備:
        名稱:   ${mostRelic.name}
        次數:   ${mostRelic.times}
        稀有度: ${mostRelic.rarity}
        來自:   ${mostRelic.source}`
)
console.log(`
最多次遺物:
        名稱:   ${mostCentury}
        次數:   ${mostCenturyTimes}`
)
console.log(`
平均次數:
        遺物:   ${centuryAverage}
        裝備:   ${objectAverage}`
)
console.log(`
怪東西:
    超過兩次的稀有: ${wieryObject}`
)
    }
    wholeTotal += total

    if(r%divid == 0) {
        console.clear()
        console.log(`已執行${r}次，完成度:${Math.floor((r/rounds)*100)}%`)
    }
}   //for(let r = 1; r <= rounds; r++) {

finalCalc()
console.log(`
=============================
執行${rounds}輪
總共:   ${wholeTotal}次
平均:
    開完:   ${wholeTotal/rounds}
    遺物:   ${wholeCenturyAve}
    裝備:   ${wholeRelicAve}`
)
console.timeLog('耗時')
//因應光體可以提升開到銀賞、金賞的機率，以及使用光的策略
function randomWithVoidTraces(century) {
    const randon = Math.random()*99.999999
    //檔案最上方有儲存priority，對應到option的數值
    const option = {
        "good": 25,
        "flawless": 50,
        "brilliance": 100
    }
    //根據priority及option，使用光體
    if(voidTraces > option[priority]) {
        voidTraces -= option[priority]
        upgrade = priority
    }
    //銅賞、銀賞、金賞在不同等級下的機率
    const gold = {
        "complete": 2,
        "good": 4,
        "flawless": 6,
        "brilliance": 10
    }
    const silver = {
        "complete": 11,
        "good": 13,
        "flawless": 17,
        "brilliance": 20
    }
    const bronze = {
        "complete": 25.33,
        "good": 23.33,
        "flawless": 20.0,
        "brilliance": 16.66
    }
    //計算各裝備的機率
    const rarity = [
        99.99-gold[upgrade],
        99.99-gold[upgrade]-silver[upgrade],
        99.99-gold[upgrade]-silver[upgrade]*2,
        99.99-gold[upgrade]-silver[upgrade]*2-bronze[upgrade],
        99.99-gold[upgrade]-silver[upgrade]*2-bronze[upgrade]*2,
    ]
    if(randon > rarity[0]) {
        recordRelic(century.relics[0], century.name)
    } else if(randon > rarity[1]) {
        recordRelic(century.relics[1], century.name)
    } else if(randon > rarity[2]) {
        recordRelic(century.relics[2], century.name)
    } else if(randon > rarity[3]) {
        recordRelic(century.relics[3], century.name)
    } else if(randon > rarity[4]) {
        recordRelic(century.relics[4], century.name)
    } else {
        recordRelic(century.relics[5], century.name)
    }
    recordCentury(century)  //紀錄遺物
    upgrade = "complete"    //使用掉光體升級，還原成完整
}//randomWithVoidTraces()

//確認是裝備是否集齊
function isCollectAll(century) {
    let count = 0
    for(let i = 0; i < 6; i++) {
        for(let e = 0; e < got.length; e++) {
            if(got[e] === century.relics[i].name && century.relics[i].name !== "Forma Blueprint"){
                count++
                // break;
            }
        }
    }
    return count
}

//紀錄遺物開出的裝備的名稱、次數、稀有度、來源
function recordRelic(relic, source) {
    relic.times++
    let shouldAddGot = true
    for(let i = 0; i < got.length; i++) {
        if(got[i] === relic.name) {
            shouldAddGot = false
            break;
        }
    }
    if(shouldAddGot) {
        got.push(relic.name)
    }

    let shouldAddList = true
    const todo = relicList.length
    for(let i = 0; i < todo; i++) {
        if(relicList[i].name === relic.name) {
            relicList[i].times++
            if(!relicList[i].source.includes(source)) {
                relicList[i].source = relicList[i].source.concat(", ", source)
            }
            shouldAddList = false
            break
        }
    }
    
    if(shouldAddList) {
        relicList.push({
            name: relic.name,
            times: 1,
            rarity: relic.rarity,
            source: source
        })
    }
}

//紀錄遺物
function recordCentury(century) {
    century.times++
}

//找出開最多次的遺物
function findMostCentury() {
    mostCenturyTimes = 0
    mostCentury = ""
    liths.map(century => {
        if(century.times > mostCenturyTimes) {
            mostCenturyTimes = century.times
            mostCentury = century.name
        }
    })
}

//找出開到最多次的裝備
function findMostRelic() {
    let todo = relicList.length
    
    for(let i = 0; i < todo; i++) {
        if(mostRelic.times < relicList[i].times && relicList[i].name !== 'Forma Blueprint') {
            mostRelic = relicList[i]
        }
    }
}

//計算平均開多少次可以集齊一個遺物的所有裝備
function centuryAve() {
    let centuryTotal = 0.0
    liths.map(century => {
        centuryTotal += century.times
    })
    centuryAverage = centuryTotal/liths.length

    wholeCentury += centuryTotal
}

//計算平均開幾次可以收集一個新裝備
function objectAve() {
    let objectTotal = 0.0
    liths.map(century => {
        century.relics.map(object => {
            objectTotal += object.times
        })
    })
    objectAverage = objectTotal/(liths.length*6)

    wholeRelic += objectTotal
}


//整理最後資訊
function finalCalc() {
    wholeCenturyAve = wholeCentury/(data.length*rounds)

    wholeRelicAve = wholeRelic/(data.length*6*rounds)
}

//找到開出超過一次的金賞
function somethingWiery() {
    wieryObject = []
    liths.map(century => {
        if(century.relics[0].times > 1 && century.relics[0].name !== "Forma Blueprint") {
            wieryObject.push(century.relics[0].name)
        }
    })
}

//產生隨機整數(可選範圍，ex:randomInt(6, 25)，則產生6~25的整數)
function randomInt(min, max) {
    return Math.floor((max - min + 1) * Math.random()) + min
}

function init() {//歸零
    voidTraces = 0, upgrade = "complete"
    relicList = [{name: "", times: 0, rarity: "", source: ""}]
    got = []
    total = 0, totalCentury = 0, totalRelic = 0
    mostCenturyTimes = 0, mostCentury = ""
    mostRelic = {name: "", times: 0, source: "", rarity: ""}
    centuryAverage = 0, objectAverage = 0
    wieryObject = []
}



//初始化data，轉成由century組成的陣列
function transform(liths) {
    for(let i = 0; i < times; i++) {
        const key = data[i]
        liths.push(
            new century(key[0], key[1], key[2], key[3], key[4], key[5], key[6])
        )
    }
}

function makeRandom() {//產生隨機且不重複數字的陣列，陣列長度=data長度，數字範圍0~data長度-1
    let randomArr = []
    for(let i = 0; i < times; i++) {
        let num = randomInt(0, times-1)
        let ableToAdd = true
        while(ableToAdd) {
            for(let j = 0; j < randomArr.length; j++) {
                if(randomArr[j] == num) {
                    num = randomInt(0, times-1)
                    break
                }
            }
            ableToAdd = false
        }
        randomArr.push(num)
    }

    return randomArr
}