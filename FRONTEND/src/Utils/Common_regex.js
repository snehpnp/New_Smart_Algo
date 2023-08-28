
export const Email_regex = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
}


export const Mobile_regex = (mobile) => {
    const MobileRegex = /^[0-9]{10}$/
    return MobileRegex.test(mobile);

}

export const No_Negetive_Input_regex = (mobile) => {
    const value =/^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(mobile);
}