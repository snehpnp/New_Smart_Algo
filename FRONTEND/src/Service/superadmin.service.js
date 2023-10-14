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

export async function GET_API_INFORMATION(token) {
    try {
        const res = await axios.get(`${Config.base_url}getall/apicreateinfo`, {
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
        console.log("error", err);
        // custom error
    }

}