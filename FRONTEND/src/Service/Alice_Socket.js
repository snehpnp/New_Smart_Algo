
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "865803";
var userSession1 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTUyNjc5NDYsImlhdCI6MTY5NTE4MTU2MSwianRpIjoiZDg4N2VkMTYtODNlNy00YzVmLWI4NGQtMDM0OWE4NzRkNjk5IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjdjMjBjZmM4LTJmMWMtNDcxZS05YjY3LTEzMjc3MGVjYWU5MyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjJmMTAyZTFmLWE1NTQtNDc1MS1iNjI0LTM4MzE4MjE5ZjgzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMmYxMDJlMWYtYTU1NC00NzUxLWI2MjQtMzgzMTgyMTlmODNlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6Ijg2NTgwMyIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJSQUtTSEEgU0lOR0giLCJtb2JpbGUiOiI5NDIyNDk3NDg3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiODY1ODAzIiwiZ2l2ZW5fbmFtZSI6IlJBS1NIQSIsImZhbWlseV9uYW1lIjoiU0lOR0giLCJlbWFpbCI6InN1c2hpbGt1bWFyc2luZ2g2QGdtYWlsLmNvbSJ9.ZXk3ffVTN7p6QZadd-WcfciUQp8-95EotSMCqzxJbYyzqz1KXnIvU-fqNnm6h6A0Re4OQysQoPjabsgGcgAhncp7Ln9ES-DKCU1jACWZFrgt91ymDxigDA8vqj1yR2uq9euYtXZ7yn3POHxeBWplESBZciSkpbdKs3WQzKXN4buXZRi7DgWlqj_ok6tbaAiN0BpDNUpRDnOGvw5f4_KRyFrXERpRuL_CfOawjFjaJFwLiXSg6yMURPcgDY-ZNE6ZXj_0aB-u21U0q8Pp1oFdoW3gejsUVzNiKu1i1u2AEM9W9XU6eMNTFNdn17QFqrIa0RydPg791ZyH3RZcBrh1kw";

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

