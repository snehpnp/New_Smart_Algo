
export const Email_regex = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|example)\.(com|co\.in|in|net|org|edu|gov|uk|us|info|biz|io|...)[a-zA-Z]{0,}$/;
    return emailRegex.test(email);
}


export const Name_regex = (name) => {
    const emailRegex = /^[a-zA-Z ]+$/
    return emailRegex.test(name);
}

export const Stg_regex = (name) => {
    const StgRegex = /^[a-zA-Z ]+$/
    return StgRegex.test(name);
}


export const Mobile_regex = (mobile) => {
    const MobileRegex = /^[0-9]{10}$/
    return MobileRegex.test(mobile);

}

export const No_Negetive_Input_regex = (mobile) => {
    const value = /^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(mobile);
}
export const Monthly_plan_regex =(month)=>{
    const value = /^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(month)
}
export const Quaterly_plan_regex =(quaterly)=>{
    const value = /^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(quaterly)
}
export const Halfyearly_plan_regex =(halfyearly)=>{
    const value = /^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(halfyearly)
}
export const Yearly_plan_regex =(yearly)=>{
    const value = /^(?!0*(\.0*)?$)\d+(\.\d+)?$/
    return value.test(yearly)
}


export const ValidYoutubeUrl = (url) => {
    // Regular expression to match a YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+(&[\w%=]*)?$/

    return youtubeRegex.test(url);
}
