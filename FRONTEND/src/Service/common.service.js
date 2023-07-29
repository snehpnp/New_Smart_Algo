import React, { useState } from 'react'
import axios from "axios";

// import Files
import * as Config from "../Utils/Config";
// import { header } from "../Utils/api_header";



// Admin Dashboard
// export async function admin_dashboard(data , token) {
//     try {
//         const res = await axios.post(`${Config.base_url}admin/dashboard`, data ,{
//             headers: header(token),
//             data: {},
//         })
//         return await res?.data;
//     }
//     catch (err) {
//         console.log("error", err);
//         // custom error
//     }

// }
