var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");

const db = require('../Models');
const live_price = db.live_price;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
const Alice_Socket = async () => {
    var broker_infor = await live_price.findOne({ broker_name: "ALICE_BLUE" });



    var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"
    var userid = broker_infor.user_id
    var userSession1 = broker_infor.access_token
    var channelList = broker_infor.Stock_chain

    var type = { "loginType": "API" }

    //  Step -1

    await axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
        headers: {
            'Authorization': `Bearer ${userid} ${userSession1}`,
            'Content-Type': 'application/json'
        },

    }).then(res => {

        const url = "wss://ws1.aliceblueonline.com/NorenWS/"
        var socket;

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

                    if (response.tk) {
                        const db = client.db('Signals_db'); // Replace 'mydb' with your desired database name

                        const collections = await db.listCollections().toArray();

                        // Check if the desired collection exists
                        const collectionExists = collections.some(coll => coll.name === response.tk);
                        if (collectionExists) {
                            if (response.lp) {
                                const collection = db.collection(response.tk);
                                let filter = { token: response.tk }; // Assuming 'lp' is a unique identifier for your document
                                let update = {
                                    $set: {
                                        lp: response.lp,
                                        exc: response.e,
                                        token: response.tk,
                                        sp1: response.sp1,
                                        bp1: response.bp1,
                                    }
                                };

                                const insertResult = await collection.updateOne(filter, update);
                            }

                        } else {
                            if (response.lp) {
                                await db.createCollection(response.tk);
                                const collection = db.collection(response.tk);
                                let data = {
                                    lp: response.tk,
                                    exc: response.e,
                                    token: response.tk,
                                    sp1: response.sp1,
                                    bp1: response.bp1,
                                }
                                const insertResult = await collection.insertOne(data);
                            }
                        }
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

}
module.exports = { Alice_Socket }
