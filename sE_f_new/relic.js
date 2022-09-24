
//一個裝備有名字、開到的次數、稀有度
class relic {
    constructor(name, rarity) {
        this.name = name
        this.rarity = rarity
        this.times = 0
    }
}
module.exports.relic = relic