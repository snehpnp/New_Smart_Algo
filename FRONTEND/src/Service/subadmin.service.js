import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
import { header } from "../Utils/ApiHeader";



// Admin Dashboard
export async function GETALL_SUB_ADMINS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/subadmin`, data, {
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
export async function GETALL_SUB_ADMINS_CLIENTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/subadmin/clients`, data, {
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

// GET SUBADMINS PERMISSIONS
export async function GET_SUB_ADMINS_PERMISSIONS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}sub/get/permissions`, data, {
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





//  ------------------------


// ADD USER
export async function ADD_CLIENT(data, token) {
    console.log(data);
    try {
        const res = await axios.post(`${Config.base_url}sub/add/employee`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error =", err);
        return err
        // custom error
    }

}



// DELTE USER
export async function DELETE_USERAND_ALLSERVICES(data, token) {
    console.log(data);
    try {
        const res = await axios.post(`${Config.base_url}delete/user`, data, {
            //  headers: header(token),
            data: { data },
        })
        return await res?.data;

    }
    catch (err) {
        console.log("error =", err);
        return err
        // custom error
    }

}



// ALL CLIENTS
export async function ALL_CLIENTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/clients`, data, {
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


// FIND ONE CLIENT BY ID
export async function FIND_ONE_USER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getall/userinfo`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// UPDATE CLIENT BY ID
export async function UPDATE_USER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}sub/update/employee`, data, {
            headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}

