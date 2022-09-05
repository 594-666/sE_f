const { relic } = require('./relic')

//century由名字、開的次數、六個裝備組成的陣列組成
class century{
    constructor(name, g, s1, s2, b1, b2, b3) {
        this.name = name
        this.times = 0
        this.relics = [
            new relic(g, "rare"),
            new relic(s1, "uncommon"),
            new relic(s2, "uncommon"),
            new relic(b1, "common"),
            new relic(b2, "common"),
            new relic(b3, "common")
        ]
    }
}


module.exports.century = century