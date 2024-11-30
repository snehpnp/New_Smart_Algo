import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";


// LOGIN-USER
export async function GetProfile(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}company/get`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


export async function GetUserInfo(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/userinfo`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

export async function TRADING_OFF_BTN(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}tradingoff`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


   ///  profile 


export async function ProfileData(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}ProfileImagedata`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


//update api for profile

export async function updateprofiledata(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}updateProfile`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}



// match profileinfo data
export async function ProfileuserId(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}profileId`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

//profile for status 


export async function ProfileActive(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}Profilestatus`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

export async function UpdateUserBrokerInfo(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}user/update/brokerinfo`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}
