import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



// Admin Dashboard
export async function GETALL_SUB_ADMINS(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/subadmin`, data ,{
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
// Admin Dashboard
export async function GETALL_SUB_ADMINS_CLIENTS(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/subadmin/clients`, data ,{
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


