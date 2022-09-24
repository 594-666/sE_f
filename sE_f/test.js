let arr = [1,2,3,4]
let arrr = [5, 6, 7 ,8]

arrr.push(arr.splice(2, 1)[0])

console.log(arrr)