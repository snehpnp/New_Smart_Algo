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
export async function UPDATE_PANEL_THEME(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/panel_theme`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


// CREATE_API_INFORMATION
export async function CREATE_API_INFORMATION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}add/apicreateinfo`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err


    }

}

// UPDATE_API_INFORMATION
export async function UPDATE_API_INFORMATION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/apicreateinfo`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

        return err

    }

}

// GET_API_INFORMATION
export async function GET_API_INFORMATION(data, token) {

    try {
        const res = await axios.post(`${Config.smartAlogUrl}getall/apicreateinfo`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}
// GET_API_INFORMATION 
export async function GET_API_INFORMATION_SUPERADMIN(data, token) {


    try {
        const res = await axios.post(`${Config.base_url}getall/apicreateinfo_super`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// GET PANEL INFORMATION TO DOMAIN FIND
export async function GET_PANEL_INFORMATION(id, token) {
    try {

        const res = await axios.post(`${Config.base_url}get/panel/info`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// FIND ALL PANEL DATA
export async function GET_ALL_ADMIN_CLIENT(id, token) {

    try {

        const res = await axios.post(`${Config.base_url}getall/panel/clients`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// GET ALL SUBADMIN TO ADMIN PANEL
export async function GET_ALL_SUBADMIN_CLIENT(id, token) {
    try {

        const res = await axios.post(`${Config.base_url}getall/panel/subadmins`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// ADD LICENSE TO SUPERADMIN
export async function ADD_LICENCE_TO_COMPANY(id, token) {
    try {

        const res = await axios.post(`${Config.base_url}add/license`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}


// ADD ADJUST MONTH TO SUPERADMIN
export async function ADJUST_MONTH_TO_COMPANY(id, token) {
    try {

        const res = await axios.post(`${Config.base_url}add/adjust_month`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// GET 
export async function GET_ADMIN_HELPS(id, token) {
    try {

        const res = await axios.post(`${Config.base_url}getall/panel/helps`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}


export async function UPDATE_ADMIN_PERMISSION(id, token) {
    try {

        const res = await axios.post(`${Config.smartAlogUrl}update/permission`, id, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}


// GET PANEL INFORMATION TO DOMAIN FIND
export async function GET_PANEL_BROKER(domain) {
    try {

        const res = await axios.post(`${Config.base_url}get/panel/broker`, domain, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}



// CLOSE COMAPNY
export async function CLOSE_ADMIN_PANEL(domain, token) {
    try {

        const res = await axios.post(`${Config.base_url}get/panel/panelclose`, domain, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// GET ALL BROKERS
export async function ALL_BROKERS(domain, token) {
    try {


        const res = await axios.post(`${Config.base_url}getall/brokers`, domain, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}


// GET ALL BROKERS
export async function UPDATE_BROKERS(domain, token) {
    try {

        const res = await axios.post(`${Config.smartAlogUrl}update/panel/broker`, domain, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}


// Add Panel
export async function ADD_PANEL(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}add/panel`, data, {
            headers: header(token),
            data: { data },
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}

// UPDATE_PANEL
export async function UPDATE_PANEL(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}edit/panel`, data, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}



// GET PANEL INFORMATION TO DOMAIN FIND
export async function GET_PANEL_HISTORY(token) {
    try {

        const res = await axios.get(`${Config.base_url}getall/history`, {
            headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return err

    }

}



export async function UPDATE_QUERY(data) {
    try {
        const res = await axios.post(`${Config.base_url}update/query`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {


    }

}


export async function GET_ALL_SIGNAL(data) {
    try {
        const res = await axios.post(`${data.backend_rul}get/signal`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {


    }

}

export async function UPDATE_PRICE(data) {

    try {
        const res = await axios.post(`${data.backend_rul}update/price`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function DELETE_SIGNAL(data) {
    try {
        const res = await axios.post(`${data.backend_rul}signal/delete`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function GET_ALL_DELETED_SIGNAL(data) {
    try {
        const res = await axios.post(`${data.backend_rul}deleted/signal`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {


    }

}

export async function BACKUP_SIGNAL(data) {
    try {
        const res = await axios.post(`${data.backend_rul}backup/signal`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}
export async function GET_ONE_USER(data) {
    try {
        const res = await axios.post(`${data.backend_rul}findUserById`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}
export async function SUPER_UPDATE_USER(data) {
    try {
        const res = await axios.post(`${data.backend_rul}super/update/user`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function USER_DELETE(data) {

    try {
        const res = await axios.post(`${data.backend_rul}user/delete`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function GET_USER(data) {

    try {
        const res = await axios.post(`${data.backend_rul}findOneUser`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}




export async function GET_FAQ_DATA() {

    try {
        // const res = await axios.post(`${Config.smartAlogUrl}getll/faq`, data, {
        const res = await axios.get(`${Config.smartAlogUrl}getll/faq`, {

            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}


export async function DELETE_FAQ_DATA(data) {

    try {
        // const res = await axios.post(`${Config.smartAlogUrl}getll/faq`, data, {
        const res = await axios.post(`${Config.smartAlogUrl}delete/faq`, data,{

            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function ADD_FAQ_DATA(data) {

    try {
        // const res = await axios.post(`${Config.smartAlogUrl}getll/faq`, data, {
        const res = await axios.post(`${Config.smartAlogUrl}add/faq`, data,{

            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {

    }

}

export async function UPDATE_FAQ_DATA(data) {
    
        try {
            // const res = await axios.post(`${Config.smartAlogUrl}getll/faq`, data, {
            const res = await axios.post(`${Config.smartAlogUrl}update/faq`, data,{
    
                // headers: header(token),
                data: {},
            })
            return await res?.data;
        }
        catch (err) {
    
        }
    
    }


    export async function DELETE_LICENSE(data) {
    
        try {
            const res = await axios.post(`${data.backend_rul}delete/license`, data, {
            // const res = await axios.post(`http://localhost:7700/delete/license`, data,{
    
                // headers: header(token),
                data: {},
            })
            return await res?.data;
        }
        catch (err) {
    
        }
    
    }
