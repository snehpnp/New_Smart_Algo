var a = (val) => {

    for (var i = 5; i >= 1; i--) {
        var str = ""
        for (var j = 1; j <= i; j++) {
        
            if (j == i) {
                str += "*"
            } else {
                str += " "

            }
        }
        console.log(str)
    }
}
a(5)

