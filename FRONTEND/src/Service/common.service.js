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



