import axios from "axios";
// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



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