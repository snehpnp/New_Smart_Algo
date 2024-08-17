const sha256 = require('sha256');
var axios = require('axios');
var dateTime = require('node-datetime');

"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const BrokerResponse = db.BrokerResponse;
const Broker_information = db.Broker_information;
const live_price = db.live_price;
const aliceblueView = db.aliceblueView;


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



class CancelOrder {

    // Get GetAccessToken ALICE BLUE
    async CancelorderByAdmin(req, res) {
        try {
            // running task
            const AllLiveClients = await User.find({Role:"USER" , TradingStatus : "on" , $and: [
                { access_token: { $ne: '' } },
                { access_token: { $ne: null } }
            ]});




            if(AllLiveClients.length > 0){

            
            const requestPromises = AllLiveClients.map(async (item) => {

               let broker = item.broker;

               // Market Hub   -  1
            // if (broker == 1) {
            //     CancelOrderMarketHub(item);
            // }
            // ALICE BLUE   -  2
             if (broker == 2) {
                CancelOrderAliceBlue(item);
            }
        
            // MASTER TRUST   -  3
            // else if (broker == 3) {
            //     CancelOrderAliceBlue(item);
            // }
        
            // // KotakNeo  - 7
            // else if (broker == 7) {
            //     CancelOrderAliceBlue(item);
            // }
            // // ANGEL   -  12
            // else if (broker == 12) {
            //     CancelOrderAliceBlue(item);
            // }
        
            // // 5 PAISA   -  13
            // else if (broker == 13) {
            //     CancelOrderAliceBlue(item);
            // }
        
            // // 5 PAISA   -  14
            // else if (broker == 14) {
            //     CancelOrderAliceBlue(item);
            // }
        
            // // ZERODHA   -  15
            // else if (broker == 15) {
            //     CancelOrderAliceBlue(item);
            // }
        
            // // UPSTOX   -  19
            // else if (broker == 19) {
            //     CancelOrderAliceBlue(item);
            // }
            // // DHAN   -  20
            // else if (broker == 20) {
            //     CancelOrderAliceBlue(item);
            // }
            // // Swastika   -  21
            // else if (broker == 21) {
            //     CancelOrderAliceBlue(item);
            // }
            else {
                return  res.send({ status: false, msg: "broker not found" });
            }



            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
            .then(responses => {  })
            .catch(errors => {});
         
            return res.send({ status: true, msg: "Ok" })

            }else{
            return res.send({ status: false, msg: "Not Ok" })
            }

        } catch (error) {
            console.log("Error Alice Login error-", error)
        }
    }
 }


 const CancelOrderAliceBlue = (item) => {

 }



module.exports = new CancelOrder();



