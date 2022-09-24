const calc = require('./calc');
const fs = require('fs')

const execute = (times, rounds) => {
    let record = [];
    for(let i = 0; i < times; i++) {
        record.push(calc(rounds))
    }
    fs.writeFileSync('record.json', JSON.stringify(record))
}

execute(1, 100);