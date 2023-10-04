
import * as Config from "../Utils/Config";
import axios from "axios";
var CryptoJS = require("crypto-js");

var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"


var userId1 = "242501";
var userSession1 = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTY0NzcxODcsImlhdCI6MTY5NjM5MDg0NCwianRpIjoiNDkzMTJiNDAtMGFlMi00MzJkLTkwNDMtMGQ4M2UzYzZhNjNjIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjhiMjg1MWI4LTc4N2EtNDBiMS04NmQ5LWM0ZGIyYmMyNDg5NSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6ImVmZjIxMTllLTFlMDktNDgzZC04MTQzLWMzYTcxMWRiZDkyNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiZWZmMjExOWUtMWUwOS00ODNkLTgxNDMtYzNhNzExZGJkOTI1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjI0MjUwNyIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiIwIC4iLCJtb2JpbGUiOiI3OTg3NDAyMzk5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiMjQyNTA3IiwiZ2l2ZW5fbmFtZSI6IjAiLCJmYW1pbHlfbmFtZSI6Ii4iLCJlbWFpbCI6ImFzaHdpbl9hZ3J3QHlhaG9vLmNvbSJ9.RK0eWOqxFob0yJzSfNWqjFqMP1yhTKp6FyrkXK-jvQ14A-ejyJPek37rNb1Ym8ysP_nalFXOxI_G3rXKs0MQlFYP1ip_ELrDQ9SvNz_RR2lp_4n3krPcuEZO6v4Ky_zG6z-jstKuTjfQARjQ1nGMJr3qKjkU55DQiN9UbW1jaxaNtj79idz5DM9mo2bLv7_fpVF3tS2dqJXJvWAML-6s3P-kmSRIh8ClGYkoNn07G_gH_HlRTfBhaZmnvsdI9ka1GqxyTMFEgadCPgYEhj8sXb_qMinUcvVUxODA5O1r90Z5SAMja7TEijttyRcTrbZSjR5zUmpsC7ktgfXwGaWrJw";

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

