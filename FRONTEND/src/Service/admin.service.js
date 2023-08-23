import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";





// ALL SERVICES

export async function ALL_SERVICES(data , token) {
    try {
        const res = await axios.get(`${Config.base_url}getAllService`, data ,{
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}





// ALL CATAGORY

export async function ALL_CATAGORY(data , token) {
    try {
        const res = await axios.get(`${Config.base_url}allCatagory`, data ,{
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}




// ALL SERVICE_BY_CATAGORY

export async function SERVICE_BY_CATAGORY(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}ServiceByCatagory`, data ,{
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}



// ALL ALL_GROUP_SERVICES

export async function ALL_GROUP_SERVICES(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/groupservices`, data ,{
            //  headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}
