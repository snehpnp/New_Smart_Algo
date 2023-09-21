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



// USER BROKER RESPONSE
export async function GET_BROKER_RESPONSE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/brokeresponse`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}



// USER TRADE HISTORY

export async function GET_TRADE_HISTORY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/tradehistory`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}



// USER SIGNALS

export async function GET_SIGNALS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/signals`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}




// USER STRATEGY_DESCRIPTION

export async function STRATEGY_DESCRIPTION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/strategy`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}



// USER CREATE HELP

export async function CREATE_HELP(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}create/user/help`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}




