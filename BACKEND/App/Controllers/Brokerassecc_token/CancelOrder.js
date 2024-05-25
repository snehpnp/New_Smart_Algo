const sha256 = require('sha256');
var axios = require('axios');
var dateTime = require('node-datetime');

"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const user_logs = db.user_logs;
const BrokerResponse = db.BrokerResponse;
const Broker_information = db.Broker_information;
const live_price = db.live_price;
const aliceblueView = db.aliceblueView;


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')


class CancelOrder {

    // Get GetAccessToken ALICE BLUE
    async CancelorderByAdmin(req, res) {
        try {
            // running task
            console.log("req -",req.body)
            const AllLiveClients = await User.find({Role:"USER" , TradingStatus : "on" , $and: [
                { access_token: { $ne: '' } },
                { access_token: { $ne: null } }
            ]});

          console.log("AllLiveClients - ",AllLiveClients.length)



            if(AllLiveClients.length > 0){

            
            const requestPromises = AllLiveClients.map(async (item) => {

               console.log("item ",item)

            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
            .then(responses => {
                // console.log("Response:", responses.data);
            })
            .catch(errors => {
                console.log("errors:", errors);
              });
         
            return res.send({ status: true, msg: "Ok" })

            }else{
            return res.send({ status: false, msg: "Not Ok" })
            }

        } catch (error) {
            console.log("Error Alice Login error-", error)
        }
    }
 }




module.exports = new CancelOrder();



