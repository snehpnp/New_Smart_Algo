import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



// LOGIN-USER

export async function Sign_In_User(data , token) {
    try {
        const res = await axios.post(`${Config.base_url}login`, data ,{

            // headers: header(token),
            data: {},
        })
        console.log("res" ,res);
        return await res?.data;
    }
    catch (err) {
        console.log("error", err);
        // custom error
    }

}
