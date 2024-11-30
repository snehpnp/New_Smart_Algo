import axios from "axios";

// import Files
import * as Config from "../../../Utils/Config";
import { header } from "../../../Utils/ApiHeader";


// GET CATEGORY
export async function GET_ALL_Catagory(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/allCatagory`, data, {  
           // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//getServices data 
export async function GET_ALL_SERVICS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/ServiceByCatagory`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//GET_EXPIRY_BY_SCRIPT data 
export async function GET_EXPIRY_BY_SCRIPT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/getexpirymanualtrade`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}


//GET_ALL_STRIKE_PRICE data 
export async function GET_ALL_STRIKE_PRICE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/getAllStrikePriceApi`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//GET_STRATEGY_DATA data 
export async function GET_STRATEGY_DATA(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/getStrategyData`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//Get Token By socket data 
export async function GET_TOKEN_BY_SOCKET(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/gettokenbysocket`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//Get Token By socket data 
export async function GET_LIVE_DATA_SESSION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/LiveDataSession`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}


//Ad data above below range 
export async function ADD_DATA_MAKECALL_ABR(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/AddDataAboveBelowRange`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}


//Get data above below range 
export async function GET_DATA_MAKECALL_ABR(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/GetDataAboveBelowRange`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//Delete data above below range 
export async function DELETE_DATA_MAKECALL_ABR(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/DeleteDataMakeCall`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

//Updaye data above below range 
export async function UPDATE_DATA_MAKECALL_ABR(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}make/UpdateDataMakeCall`, data, {  
            // data: {},
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}




