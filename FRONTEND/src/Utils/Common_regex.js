
export const Email_regex = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|example)\.(com|co\.in|in|net|org|edu|gov|uk|us|info|biz|io|...)[a-zA-Z]{0,}$/;
    return emailRegex.test(email);
}


export const Name_regex = (name) => {
    const emailRegex = /^[a-zA-Z ]+$/
    return emailRegex.test(name);
}


export const Mobile_regex = (mobile) => {
    const MobileRegex = /^[0-9]{10}$/
    return MobileRegex.test(mobile);

}

export const No_Negetive_Input_regex = (mobile) => {
    const value = /^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(mobile);
}