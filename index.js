var type = "LE"
var a = type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE"
console.log(a);