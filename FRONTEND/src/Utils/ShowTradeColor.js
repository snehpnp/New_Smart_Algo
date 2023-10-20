
import $ from "jquery";


export const ShowColor = (className, value, response) => {
    // console.log("className", className)
    // console.log("value", value)
    // console.log("response", response)



    if (parseFloat(value) < 0) {
        $(`.${className}` + response).css({ "color": "Red" });
        $(`.${className}` + response).append('&#8595;')
    } else if (parseFloat(value) > 0) {
        $(`.${className}` + response).css({ "color": "green" });
        $(`.${className}` + response).append('&#8593;')
    } else {
        $(`.${className}` + response).css({ "color": "black" });
        $(`.${className}` + response).html("-");
    }
}



export const ShowColor1 = (className, value, response, get_Strategy) => {
    if (parseFloat(value) < 0) {
        $(`${className}`).css({ "color": "Red" });
        $(`${className}`).append('&#8595;')
    } else if (parseFloat(value) > 0) {
        $(`${className}`).css({ "color": "green" });
        $(`${className}`).append('&#8593;')
    } else {
        $(`${className}`).css({ "color": "black" });
        // $(`${className}`).html("-");
    }
}


export const ShowColor_Compare_two = (className, value1, value2, response) => {

    // console.log("className", className)
    // console.log("value1", value1)
    // console.log("value2", value2)
    // console.log("response", response)

    if (parseFloat(value1) < parseFloat(value2)) {
        $(`.${className}` + response).css({ "color": "Red" });
        $(`.${className}` + response).append('&#8595;')
    } else if (parseFloat(value1) > parseFloat(value2)) {
        $(`.${className}` + response).css({ "color": "green" });
        $(`.${className}` + response).append('&#8593;')
    } else {
        $(`.${className}` + response).css({ "color": "black" });
        // $(`.${className}` + response).html("-");
    }
}
