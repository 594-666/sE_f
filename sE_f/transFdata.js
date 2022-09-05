const { data } = require('./data')
const { century } = require('./century')


const times = data.length

let liths = []

//初始化data，轉成由century組成的陣列
function transform() {
    for(let i = 0; i < times; i++) {
        const key = data[i]
        liths.push(
            new century(key[0], key[1], key[2], key[3], key[4], key[5], key[6])
        )
    }
}



module.exports = {
    liths: liths,
    times: times,
    transform: transform
}