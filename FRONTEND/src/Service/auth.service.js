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
        console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
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
        console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


