
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "1016172";
var userSession1 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTQ2NjAwNjUsImlhdCI6MTY5NDU3MzY4MCwianRpIjoiNDg1YTViOWUtYzFjMC00NTk0LTlkYTgtMWU4OWMwNzMwN2U4IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjgzNjFhZTg3LTYwZjEtNGMxNS1iYjU5LWZiNTYwZjZhY2JhMiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjViZTEzNmQ3LWNmYjEtNGM5My05YTBmLTY2MzFiZTA0NTBmZiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNWJlMTM2ZDctY2ZiMS00YzkzLTlhMGYtNjYzMWJlMDQ1MGZmIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjEwMTYxNzIiLCJjbGllbnRSb2xlIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdLCJuYW1lIjoiRElORVNIIEtVTUFSIiwibW9iaWxlIjoiNzAxMTI1MjMwMyIsInByZWZlcnJlZF91c2VybmFtZSI6IjEwMTYxNzIiLCJnaXZlbl9uYW1lIjoiRElORVNIIiwiZmFtaWx5X25hbWUiOiJLVU1BUiIsImVtYWlsIjoiZGtzZGluZXNoMjExMUBnbWFpbC5jb20ifQ.FYHmkPhglIizM2UKhMBTsT6R2MuT6qdekQI75ullhGIXUwqcW91XTAGzg3D9mmLzhIVcaUa-8U09BcCRdlOuo_PFwYmKn8XymtMwBN3s4P4_SCLbqSZhGq3VEpZ3Ja3TnEY_SqowgQUzKKrsZxwrpo0noCUTFHtWqXTszbG3oK53LXwcvVbf2xLT9JmzXjn8MO8SWlzZApnUbo4d3z5E7qp0FCjclHx76NQaV4k7W7kWJL350Z_lFSYpRTg4zlls0eiBJXNbIsPxfyonbADTAgvaA-vvQgNXQ0CoSYsGfgDr1wb0UfhDcxlaFvh9DN4HmiyF-m5W1x2CWzfi4_Yn8w";

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

