function showDupes(arr) {
    return [...new Set(arr.filter((elem, idx, arr) => arr.indexOf(elem) !== idx))]
  }
const arr=[1,1,2,2,3,3,4,5,6,1]; 
console.log(showDupes(arr))

