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


// CREATE_API_INFORMATION
export async function CREATE_API_INFORMATION(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}add/apicreateinfo`, data ,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

        console.log("error", err);
        // custom error
    }

}

// UPDATE_API_INFORMATION
export async function UPDATE_API_INFORMATION(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}update/apicreateinfo`, data ,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        return err

        // custom error
    }

}

// GET_API_INFORMATION
export async function GET_API_INFORMATION(data ,token) {
    console.log("data", data);
    console.log("token", token);
    
    try {
        const res = await axios.get(`${Config.base_url}getall/apicreateinfo`, data ,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        console.log("error", err);
        // custom error
    }

}
// GET_API_INFORMATION
export async function GET_API_INFORMATION_SUPERADMIN(data ,token) {
    console.log("data", data);
    console.log("token", token);
    
    try {
        const res = await axios.post(`${Config.base_url}getall/apicreateinfo_super`, data ,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        console.log("error", err);
        // custom error
    }

}

// GET PANEL INFORMATION TO DOMAIN FIND
export async function GET_PANEL_INFORMATION(id,token) {
    try {

        const res = await axios.post(`${Config.base_url}get/panel/info`, id,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}

// FIND ALL PANEL DATA
export async function GET_ALL_ADMIN_CLIENT(id,token) {
    try {

        const res = await axios.post(`${Config.base_url}getall/panel/clients`, id,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}

// GET ALL SUBADMIN TO ADMIN PANEL
export async function GET_ALL_SUBADMIN_CLIENT(id,token) {
    try {

        const res = await axios.post(`${Config.base_url}getall/panel/subadmins`, id,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}

// ADD LICENSE TO SUPERADMIN
export async function ADD_LICENCE_TO_COMPANY(id,token) {
    try {

        const res = await axios.post(`${Config.base_url}add/license`, id,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}

// GET 
export async function GET_ADMIN_HELPS(id,token) {
    try {

        const res = await axios.post(`${Config.base_url}getall/panel/helps`, id,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}


export async function UPDATE_ADMIN_PERMISSION(id,token) {
    try {

        const res = await axios.post(`${Config.base_url}update/permission`, id,{
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}


// GET PANEL INFORMATION TO DOMAIN FIND
export async function GET_PANEL_BROKER(domain) {
    try {

        const res = await axios.post(`${Config.base_url}get/panel/broker`, domain,{
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err
        // custom error
    }

}

