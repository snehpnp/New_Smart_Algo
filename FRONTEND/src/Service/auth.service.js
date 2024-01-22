import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



// LOGIN-USER
export async function SIGN_IN_USER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}login`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}

// SIGNUP USER

export async function SIGN_UP_USER(data, token) {
    


    try {
        const res = await axios.post(`${Config.base_url}signup`, data, {
            // headers: header(token),
            data: {},
        })
       
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// VARIFY DEVICE OF A USER
export async function VARIFY_USER_DEVICE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}verifyUser`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data
    }
    catch (err) {
        return err.response.data
    }

}


// LOGOUT USER
export async function LOG_OUT_USER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}logoutUser`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}


// FORGET PASSWORD
export async function FORGET_PASSWORD(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}forgetpassword`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        return err
    }

}


// UPDATE  PASSWORD
export async function UPDATE_PASSWORD(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        return err

        // console.log("error", err);/
        // custom error
    }

}


// RESET PASSWORD
export async function RESET_PASSWORD(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}resetpassword`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}


// GET COMPANY AND THEME DETAILS
export async function SET_THEME_DETAILS(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}get/company`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}




// GET_PANEL_INFORMATION
export async function GET_PANEL_INFORMATION(data, token) {
    try {
        const res = await axios.post(`${Config.smartAlogUrl}get/panelinformation`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}


// SESSION CLEAR MAIL OTP SEND (USE HERE)
export async function OTP_SEND_USEHERE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}session/clear`, data, {
            // headers: header(token),
            data: {data},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}




// LOGOUT FROM OTHER DEVICE

export async function LOGOUT_FROM_OTHER_DEVICE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}logout/other/device`, data, {
            // headers: header(token),
            data: {data},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}






