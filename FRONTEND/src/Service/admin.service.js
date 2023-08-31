import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
import { header } from "../Utils/ApiHeader";


// ALL CLIENTS
export async function ALL_CLIENTS(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/clients`, data ,{
             headers: header(token),
            data: {
                
                    "page": "5",
                    "limit": "1"
                  
            },
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}

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


// GET COMPNAY INFORMATION
export async function GET_COMPANY_INFO(data , token) {
    try {
        const res = await axios.get(`${Config.base_url}get/company`, data ,{
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


// ALL ADD_GROUP_SERVICES
export async function ADD_GROUP_SERVICES(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}addgroupservice`, data ,{
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

// ALL GET_ALL_STRATEGY
export async function GET_ALL_STRATEGY(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/strategy`, data ,{
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


// ALL GET_STRATEGY_BY_ID
export async function GET_STRATEGY_BY_ID(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}get/strategy`, data ,{
             headers: header(token),
            data: {data},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// ALL REMOVE_STRATEGY_BY_ID
export async function REMOVE_STRATEGY_BY_ID(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}delete/strategy`, data ,{
             headers: header(token),
            data: {data},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// ALL ADD_STRATEGY
export async function ADD_STRATEGY(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}add/strategy`, data ,{
             headers: header(token),
            data: {data},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// GET ALL TRADING STATUS
export async function GET_ALL_TRADINGSTATUS(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/tadingstatus`, data ,{
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