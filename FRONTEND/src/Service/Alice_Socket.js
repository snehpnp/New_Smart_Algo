
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "438760";
var userSession21 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTcxNzA5ODksImlhdCI6MTY5NzA4NDYzMywianRpIjoiYTE1ZjFkZWMtYjBhYi00M2Q2LTg0NzYtY2NlM2M0YzA5MmVhIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjhlODNkNWNjLTg4OTQtNDUxNi1hMzZiLTgzNzA1NzkyMDhmNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiOGU4M2Q1Y2MtODg5NC00NTE2LWEzNmItODM3MDU3OTIwOGY3IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.XZFi8txC1hAzsgSS0L8eakVPwlZwZKmhqjTx8aXvnJXAvKgcYfTo8MO4ITfdTp5jSfSnu2DiYeM74-WSJWDUQKndDzZFJcuZhOCg9myjdeuT1FqZJ-vsH4c2liqvd4eVMIQFK5AhpSfmsoeB8PdfWGFvTKHvPwEla5d297ZAXe3_YbNO96aIU4d2893d4xzrWuM6exi2Mq1FHgxxQw4p5QiwPEe1EdP0YVLaDWPgqWC-6WRT0O9FCrJdldqhf9fLJEjbx-DN-JXYhXp7k-d9i0qv6gpQ7H9qQdCDAZdirBT6WafmE1U3YYmD12pseF_cah_5zb27veg79tq73v9mIg";



export async function GetAccessToken(data) {
    try {
        const res = await axios.post(`${Config.base_url}get/token`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}



// // export function CreateSocketSession(type) {
// export async function CreateSocketSession(type, userid, userSession1) {

//     return axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
//         headers: {
//             // 'Authorization': `Bearer ${userid} ${token}`,
//             // 'Authorization': `Bearer ${userId1} ${userSession1}`,
//             'Authorization': `Bearer ${userid} ${userSession1}`,
//             // 'Authorization': Payload,
//             // 'Access-Control-Allow-Origin' : "*",
//             'Content-Type': 'application/json'
//         },

//     })
//         .then(res => {
//             return res;
//         })
//         .catch(error => {
//             return error.response
//         })
// }


// export async function ConnctSocket(onResponse, channelList, userId1, userSession1) {
//     const url = "wss://ws1.aliceblueonline.com/NorenWS/"
//     let socket;
//     socket = new WebSocket(url)
//     socket.onopen = function () {
//         // var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
//         var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
//         var initCon = {
//             susertoken: encrcptToken,
//             t: "c",
//             // actid: userId + "_" + "API",
//             // uid: userId + "_" + "API",
//             actid: userId1 + "_" + "API",
//             uid: userId1 + "_" + "API",
//             source: "API"
//         }

//         socket.send(JSON.stringify(initCon))
//     }
//     socket.onmessage = async function (msg) {
//         var response = JSON.parse(msg.data)
//         await onResponse(response)

//         if (response.s === 'OK') {
//             // var channel = await channelList;
//             let json = {
//                 k: channelList,
//                 t: 't'
//             };
//             await socket.send(JSON.stringify(json))


//         }
//     }



// }



// export function CreateSocketSession(type) {
    
export async function CreateSocketSession(type, userid, userSession1) {

    return axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
        headers: {
            // 'Authorization': `Bearer ${userid} ${token}`,
            'Authorization': `Bearer ${userid} ${userSession1}`,
            // 'Authorization': `Bearer ${userid} ${userSession1}`,
            // 'Authorization': Payload,
            // 'Access-Control-Allow-Origin' : "*",
            'Content-Type': 'application/json'
        },

    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}


export async function ConnctSocket(onResponse, channelList, userId1, userSession1) {
    const url = "wss://ws1.aliceblueonline.com/NorenWS/"
    let socket;
    socket = new WebSocket(url)
    socket.onopen = function () {
        // var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession21).toString()).toString();
        var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
        var initCon = {
            susertoken: encrcptToken,
            t: "c",
            // actid: userId + "_" + "API",
            // uid: userId + "_" + "API",
            actid: userId1 + "_" + "API",
            uid: userId1 + "_" + "API",
            source: "API"
        }

        socket.send(JSON.stringify(initCon))
    }
    socket.onmessage = async function (msg) {
        var response = JSON.parse(msg.data)
        await onResponse(response)

        if (response.s === 'OK') {
            // var channel = await channelList;
            let json = {
                k: channelList,
                t: 't'
            };
            await socket.send(JSON.stringify(json))


        }
    }



}


export async function BackendRunSocket(data) {
    try {
        const res = await axios.get(`${Config.base_url}backendRunSocket`, data, {
            // headers: header(token),
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;

    }
}

