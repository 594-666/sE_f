const { data } = require('./data')
const { century } = require('./century')

const fs = require('fs')

const calc = (rounds) => {
    let TOTAL = [];
    for (let i = 0; i < rounds; i++) {
        let liths = [], done = [], got = []
        transform(liths);
        let rTO = { //runTimeObjects
            voiceTrace: 0,
            target: 2, //0 => complete, 1 => good, 2 => flawless, 3 => brilliance
            upgrade: 0, //0 => complete, 1 => good, 2 => flawless, 3 => brilliance
            // times: liths.length,
        }

        while (liths.length > 0) {
            const current = randomInt(0, liths.length - 1)
            if (collectedAll(liths[current], got)) {
                done.push(liths.splice(current, 1)[0]);
            } else {
                randomWithVoidTraces(liths[current], rTO, got);
            }
        }
        TOTAL.push(settle(done, got.length));
    }

    return TOTAL
}

function collectedAll(century, relicList) {
    let got = 0, hasFormaBlueprint = false;
    for (let i = 0; i < 6; i++) {
        if (century.relics[i].name == 'Forma Blueprint') {
            hasFormaBlueprint = true;
        } else if (relicList.includes(century.relics[i].name)) {
            got++;
        }
    }

    return hasFormaBlueprint ? got == 5 : got == 6
}

function recordRelic(century, relic, got) {
    century.times++;
    century.relics[relic].times++;
    if (!got.includes(century.relics[relic].name))
        got.push(century.relics[relic].name)
}

function randomWithVoidTraces(century, rTO, got) {
    const randon = Math.random() * 99.999999
    //檔案最上方有儲存priority，對應到option的數值
    const option = [25, 50, 100];
    //根據priority及option，使用光體
    if (rTO.voiceTrace > option[rTO.priority]) {
        rTO.voiceTrace -= option[rTO.priority];
        rTO.upgrade = priority;
    }
    //銅賞、銀賞、金賞在不同等級下的機率
    const gold = [2, 4, 6, 10];
    const silver = [11, 13, 17, 20];
    const bronze = [25.33, 23.33, 20.0, 16.66];
    //計算各裝備的機率
    const rarity = [
        99.99 - gold[rTO.upgrade],
        99.99 - gold[rTO.upgrade] - silver[rTO.upgrade],
        99.99 - gold[rTO.upgrade] - silver[rTO.upgrade] * 2,
        99.99 - gold[rTO.upgrade] - silver[rTO.upgrade] * 2 - bronze[rTO.upgrade],
        99.99 - gold[rTO.upgrade] - silver[rTO.upgrade] * 2 - bronze[rTO.upgrade] * 2,
    ]
    if (randon > rarity[0]) {
        recordRelic(century, 0, got);
    } else if (randon > rarity[1]) {
        recordRelic(century, 1, got);
    } else if (randon > rarity[2]) {
        recordRelic(century, 2, got);
    } else if (randon > rarity[3]) {
        recordRelic(century, 3, got);
    } else if (randon > rarity[4]) {
        recordRelic(century, 4, got);
    } else {
        recordRelic(century, 5, got);
    }
    // recordCentury(century);  //紀錄遺物
    rTO.upgrade = 0;    //使用掉光體升級，還原成完整
}//randomWithVoidTraces()

function settle(done, amount) {
    let total = 0, getRelic = 0;
    for (let i = 0; i < data.length; i++) {
        total += done[i].times;
        for(let r = 0; r < 6; r++) {
            if(done[i].relics[r].name !== 'Forma Blueprint') {
                getRelic += done[i].relics[r].times
            }
        }
    }
    // console.log(total)
    // fs.writeFileSync('dons.json', JSON.stringify(done))
    return {
        total: total,
        getRelicAvg: getRelic/data.length/6
    }
}

function transform(liths) {
    for (let i = 0; i < data.length; i++) {
        const key = data[i];
        liths.push(
            new century(key[0], key[1], key[2], key[3], key[4], key[5], key[6])
        )
    }

}

function randomInt(min, max) {
    return Math.floor((max - min + 1) * Math.random()) + min
}

module.exports = calc