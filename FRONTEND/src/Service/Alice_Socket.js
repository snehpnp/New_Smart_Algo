
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "468526";
var userSession1 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTQ3NDYzMjUsImlhdCI6MTY5NDY1OTkyNiwianRpIjoiMzY2OGM0NjgtM2MwYS00M2JjLWI0NDQtNjM1OTI3ODQyNTA1IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjgyZjRiNjJkLTZiYmMtNGM0OS05NTFjLTA3MDI4YTNhNDFiYiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6ImMzOWJlMTViLThiNzctNDc2Mi05YThhLTM5MTM3YTY4OGEzMiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiYzM5YmUxNWItOGI3Ny00NzYyLTlhOGEtMzkxMzdhNjg4YTMyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQ2ODUyNiIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTQU5KQVkgU0hJVkFKSSBNT0hBTktBUiIsIm1vYmlsZSI6Ijk4MjIwNjg2MzciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Njg1MjYiLCJnaXZlbl9uYW1lIjoiU0FOSkFZIFNISVZBSkkgTU9IQU5LQVIiLCJlbWFpbCI6InNhbmpheW1vaGFua2FyQGdtYWlsLmNvbSJ9.dghh8i3QHGB3GCqqxBdls17YowfXZyWoj3kZRLqwpr6_BEMORmM4_wZCxK4SChqYrUPkPg8lsZsQ21J9_xu5bAa3CJLlePgXA4CWU_JMJFx20ubvFMH_PtnyrTVx3jH0E0HKa_hOyt5CV9Hd549ffsk1sRjEAfik15DLPxm9yvjy1TX12UO9Rtny-arTPWhDFY-WIXQpFGYtHT2UqtsAUyzOlCLTUa9zBqJJRNsqCjnbtvZZW7FCP-xYw7rLLO04PlZbXkUoBDiYaYCVvE11AvOJwGygAgaphaOlp2RMR5wTFwwAMe1UCyyeyfCDAceM9Ln-8cbNJQkbkSEDHgZZ_A";

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

