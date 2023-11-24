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




// USER CREATE HELP

export async function UPDATE_DAHBOARD_DATA(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/clientServices`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}



// USER ACTIVICTY LOGS

export async function USER_ACTIVICTY_LOGS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/update_somthing_status`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}

// UPDATE BROKER KEYS

export async function UPDATE_BROKER_KEYS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/brokerkeys`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}


// TRADING OFF

export async function TRADING_OFF(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}trading/logout`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}




// 
export async function Update_broker_response(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}aliceblue/get/orderinfo`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}




// 
export async function MODIFY_DETAILS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/modify_details`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}




// 
export async function GET_PERMISSION(data, token) {
    try {
        const res = await axios.post(`${Config.smartAlogUrl}get/panel/permission`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}


// 
export async function GET_ALL_BROKER_RESPONSE(user_id) {
    try {
        const res = await axios.post(`${Config.base_url}getall/order/info`, user_id, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}



// 
export async function GET_USER_BROKER_INFO(user_id, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/user_api_create`, user_id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err
    }

}






