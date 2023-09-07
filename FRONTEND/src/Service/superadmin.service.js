import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
import { header } from "../Utils/ApiHeader";



// LOGIN-USER
export async function GET_ALL_PANELS_LIST(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/panels`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }

}


// UPDATE_PANEL_THEME

export async function UPDATE_PANEL_THEME(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}update/panel_theme`, data ,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}