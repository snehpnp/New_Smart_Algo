import axios from "axios";
// import Files
import * as Config from "../Utils/Config";
import { header } from "../Utils/ApiHeader";



// FORGET PASSWORD
export async function USER_PROFILE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/profile`, data, {
            // headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        return err
    }
}



// GET ALL SERVICE FOR CLIENTS
export async function GET_ALL_SERVICE_FOR_CLIENTS(data, token) {
    try {
        const res = await axios.get(`${Config.base_url}getall/strategy_for_add_client`, data, {
            headers: header(token),
            data: {},
        })
        // console.log("res", res);
        return await res?.data;
    }
    catch (err) {
        return err
    }
}

 


// -----------------------------------   FOR GET OPTIONS CHAIN -------------------------------



// GET OPTION SYMBOLS

export async function GET_OPTION_SYMBOLS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/option_symbols`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// GET OPTION SYMBOLS EXPIRY

export async function GET_OPTION_SYMBOLS_EXPIRY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/option_symbol_expiry`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// GET OPTION SYMBOLS EXPIRY

export async function GET_OPTION_ALL_ROUND_TOKEN(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/all_round_token`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// GET_PANEL_KEY

export async function GET_PANEL_KEY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/panel_key`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// GET_PANEL_KEY

export async function GET_OPEN_POSITION(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}get/open_position`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}


// UPDATE OPTIONS SIGNALS
export async function UPDATE_SIGNALS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}update/signal`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}



// FIND BROKER RESPONSE BY ID
export async function GET_MESSAGE_BROD(id) {
    try {
        const res = await axios.post(`${Config.base_url}get/messagebrodcast`, id, {
            // headers: header(token),

        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}

//----------------------------Make Strategy--------------------------------------------//


// Get Time Frame
export async function GET_INSTRUMENT(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}add/getservicename`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

//GET_CANDLE_DATA
// Get Time Frame
export async function GET_CANDLE_DATA(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}get/candledata`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Get Time Frame
export async function GET_TIMEFRAME(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}get/getAlltimeframe`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Get All  Source
export async function GET_SOURCE(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}get_sources`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Get All  Source
export async function GET_COMPARATORS(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}get_comparators`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Add Make strategy
export async function ADD_MAKE_STRATEGY(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}AddMakeStartegy`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}


export async function GET_ALL_MAKE_STRATEGY(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}GetAllMakeStartegy`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Delete make Startegy
export async function DELETE_MAKE_STRATEGY(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}DeleteMakeStartegy`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Edit make Startegy
export async function EDIT_MAKE_STRATEGY(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}EditeMakeStartegy`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Update strategy
export async function UPDATE_MAKE_STRATEGY(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}UpdateMakeStartegy`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}

// Delete make Startegy delete selected
export async function DELETE_MAKE_STRATEGY_SELECTED(data, token) {

    try {
        const res = await axios.post(`${Config.base_url}DeleteMakeStartegySelected`, data, {

            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
        
    }
}









