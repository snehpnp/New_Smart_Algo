import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



// ADD THEME
export async function ADD_THEME(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}add/theme`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}



// GET ALL THEME
export async function GET_ALL_THEME(data, token) {
    try {
        const res = await axios.get(`${Config.smartAlogUrl}getall/theme`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        return err
    }

}


// GET ALL THEME
export async function GET_ALL_THEME_NAME(data, token) {
    try {
        const res = await axios.get(`${Config.smartAlogUrl}getall/theme/name`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        return err
    }

}

