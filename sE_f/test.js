const reTurn1 = () => {return 'F'}

const reTurn2 = () => {
    return reTurn1()
    return 'GG'
}

console.log(reTurn2())