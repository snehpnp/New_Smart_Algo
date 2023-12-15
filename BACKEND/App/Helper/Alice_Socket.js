var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");

const db = require('../Models');

const { ALice_View_data } = require('./ALice_View_data');

const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;


const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
client.connect();

const db_main = client.db(process.env.DB_NAME);
const dbTradeTools = client.db(process.env.DB_TRADETOOLS);


let socketObject = null;

const Alice_Socket = async () => {

    console.log("ALICE SOCKET");

    var rr = 0;
    const url = "wss://ws1.aliceblueonline.com/NorenWS/"
    var socket = null
    var broker_infor = await live_price.findOne({ broker_name: "ALICE_BLUE" });

    const stock_live_price = db_main.collection('token_chain');
    const updateToken = await stock_live_price.find({}).toArray();

    var channelstr = ""
    if (updateToken.length > 0) {
        updateToken.forEach((data) => {
            if (data.exch != null && data._id != null) {

                channelstr += data.exch + "|" + data._id + "#"
            }
        })
    }
    // Display fetched documents

    var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);

    // console.log(alltokenchannellist);
    var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"
    var userid = broker_infor.user_id
    var userSession1 = broker_infor.access_token
    var channelList = alltokenchannellist
   // var channelList = "NSE|14366#NFO|43227"
    var type = { "loginType": "API" }

    //  Step -1
    try {

        await axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
            headers: {
                'Authorization': `Bearer ${userid} ${userSession1}`,
                'Content-Type': 'application/json'
            },

        }).then(res => {

            // const url = "wss://ws1.aliceblueonline.com/NorenWS/"
            // var socket;

            if (res.data.stat == "Ok") {

                try {
                    socket = new WebSocket(url)

                    socket.onopen = function () {
                        var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
                        var initCon = {
                            susertoken: encrcptToken,
                            t: "c",
                            actid: userid + "_" + "API",
                            uid: userid + "_" + "API",
                            source: "API"
                        }
                        socket.send(JSON.stringify(initCon))
                    }
                    socket.onmessage = async function (msg) {

                        var response = JSON.parse(msg.data)

                     //console.log("okk response", response)

                        if (response.tk) {

                            const Make_startegy_token = await UserMakeStrategy.findOne({tokensymbol:response.tk},{_id:1});
                            // --- Start Conver data view function  ----//
                            if(Make_startegy_token){
                               // console.log("okk response inside view", response)
                            ALice_View_data(response.tk, response);
                            }
                            // --- End Conver data view function  ----//

                            const currentDate = new Date();

                            // Extract hours and minutes from the time string
                            const hours = currentDate.getHours().toString().padStart(2, '0');
                            const minutes = currentDate.getMinutes().toString().padStart(2, '0');

                            const stock_live_price = db_main.collection('stock_live_price');

                            const filter = { _id: response.tk }; // Define the filter based on the token

                            const update = {
                                $set: {
                                    lp: response.lp,
                                    exc: response.e,
                                    sp1: response.sp1,
                                    bp1: response.bp1,
                                    curtime: `${hours}${minutes}`
                                },
                            };

                            const options = { upsert: true }; // Set the upsert option to true

                            const result = await stock_live_price.updateOne(filter, update, { upsert: true });
                            // console.log("newCompany", result);

                        } else {
                            // console.log("else", response)
                        }

                        if (response.s === 'OK') {
                            // var channel = await channelList;
                            let json = {
                                k: channelList,
                                t: 't'
                            };
                            await socket.send(JSON.stringify(json))

                            socketObject = socket

                        }
                    }

                } catch (error) {
                    console.log("Shocket", error);

                }
            }
        })
            .catch(error => {
                return error.response
            })


    } catch (error) {
        console.log("createSocketSess", error);
    }




}

const getSocket = () => {
    return socketObject;
};



module.exports = { Alice_Socket, getSocket }
