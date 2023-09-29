
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "952867";
var userSession1 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTYwNDg0NjIsImlhdCI6MTY5NTk2MjA2NywianRpIjoiMDUyNzQxNDEtMjczNy00ZjQ2LWFlNzctNjgwZjM4NWNlZmNlIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjQ0OWI5ZTE2LWZhY2UtNDkxYy05MGRmLWMyNDc2ODJjNjllNSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjY4NGVlOTdjLTg4NGQtNDBjYi04ZDgzLTU4NDVkNGE1M2Y2MyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNjg0ZWU5N2MtODg0ZC00MGNiLThkODMtNTg0NWQ0YTUzZjYzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6Ijk1Mjg2NyIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTQU5KRUVWIFBBTkRFWSIsIm1vYmlsZSI6Ijk4MTAyMjI1OTEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI5NTI4NjciLCJnaXZlbl9uYW1lIjoiU0FOSkVFViIsImZhbWlseV9uYW1lIjoiUEFOREVZIiwiZW1haWwiOiJzYW5qZWV2cGFuZGV5MjAwMkB5YWhvby5jb20ifQ.Jy0tNrYZVvNq1esh2WMV4lk2adFR1dZkJTQS8YroQ-uBAtV9EcJ8RzR8XrJmdjBNUvH4SH1mNeiemOTICqlFAiyYHfAJCbeM6J0NjWEFLBF-2gkxrtzG-8IWO62D3OkHnnc8pY2G1xqll53WUbcct7RZX8pHDBikwMgAGeyH5Ki2xzFkuUQPKrMvE5sEcxT0V20pol4cVxy8x4l-E7nmH-U2ZzMN_2BLoTklTXOue3VQ3wLSSNn9tuV0NVF3usV2A_PQA8_Wm4Qkh3z6LkhvvIzafaUmsLQOLgsBlqh7tii_H0bZU0c0rTh91yfDf8M3nN3RnAr8chjtejESsOxXZQ";

// var AuthorizationToken = `Bearer${userId}${userSession} `


//  get AliceBlueToken and Seccion Id

export function GetAliceTokenAndID(data) {

    return axios.get(`${Config.base_url}api/alicebluetoken`, Payload, {
        headers: {
            'Content-Type': 'application/json'

        },
        data: {},
    })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            return error.response
        })
}


//  For Create Session
var Payload = { "loginType": "API" }



export function CreateSocketSession(type) {
    // export function CreateSocketSession(userid, userSession1, type) {

    return axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
        headers: {
            // 'Authorization': `Bearer ${userid} ${token}`,
            'Authorization': `Bearer ${userId1} ${userSession1}`,
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


export async function ConnctSocket(onResponse, channelList) {

    const url = "wss://ws1.aliceblueonline.com/NorenWS/"
    let socket;
    socket = new WebSocket(url)
    socket.onopen = function () {
        // var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
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

