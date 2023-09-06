import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



// USER TRADING STATUS GET ALL
export async function user_getall_tradingstatus(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/user/trading_status`, data ,{
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
