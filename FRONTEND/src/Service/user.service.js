import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
import { header } from "../Utils/ApiHeader";



// USER TRADING STATUS GET ALL
export async function user_getall_tradingstatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/trading_status`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}


// USER DASHBOARD
export async function USER_DASHBOARD(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/clientServices`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}

