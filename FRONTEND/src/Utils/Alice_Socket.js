
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "1229188";
var userSession21 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE3MTg0MzMxNDAsImlhdCI6MTcxMzI0OTI0MSwianRpIjoiNmIxMzhkOGEtNjYzOC00Y2ExLTk5NTItNDEwNGUyN2YwODMyIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImU3ZTQ2NDI4LWE3ODAtNGY1OS1iMzAxLTdjOGViMTZkMjRjYiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjA3NzRmNGViLTk3ZTctNDU5MC04Zjc2LTYwYTZkMGNhZTgzNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMDc3NGY0ZWItOTdlNy00NTkwLThmNzYtNjBhNmQwY2FlODM1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjEyMjkxODgiLCJjbGllbnRSb2xlIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdLCJuYW1lIjoiQVZJU0hFRSBHVVBUQSIsIm1vYmlsZSI6IjgxMjA1MzczNjAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIxMjI5MTg4IiwiZ2l2ZW5fbmFtZSI6IkFWSVNIRUUgR1VQVEEiLCJlbWFpbCI6ImF2aXNoZWVndXB0YTEyM0BnbWFpbC5jb20ifQ.NaJfM4-j4gsbmEWVC8SrNV1p0KpDyff5if6KWX66LH3pg0L6CN_qxFbm5pkJkyfECMcQIX2W8Q99iDEvsgo_G6B9iD-oddLQHwt-sycdAZTOKRwOWhD9svvBEiQCYzRzmGThsO5ug3jGUlqKqNVqAiyuY489H8_twVD8HrEgTRgxYI3Fe35dfFiYhjr0VdTsQCmOUI8EA1Dg0ZaRkPdecQfWVpL1BDiqB1c_tL0gmjRFpoCamsUxXPBO6SZtHR0xZ59ktJ3CIofxyliwaUnqQShbxSL2z5SlaoSt_dzs36A4kSwJ-APHgdFSSDtXAs-mma7d5DLAGBzBuvgoDxGPZw";



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




export async function CreateSocketSession(type, userid, userSession1) {
      try {
        
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
        
      } catch (error) {
         return
      }

      
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
            actid: userId1 + "_" + "API",
            uid: userId1 + "_" + "API",
            source: "API"
        }

        socket.send(JSON.stringify(initCon))
    }
    socket.onmessage = async function (msg) {
        var response = JSON.parse(msg.data)
        await onResponse(response,socket)

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


export async function ConnctSocket_user(userId1, userSession1) {
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
    
        return socket
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

