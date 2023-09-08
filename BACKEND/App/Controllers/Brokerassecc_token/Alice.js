const sha256 = require('sha256');
var axios = require('axios');
var dateTime = require('node-datetime');

"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const mongoose = require('mongoose');

// const { logger, getIPAddress } = require('../../Helper/logger.helper')
// const { formattedDateTime } = require('../../Helper/time.helper')

class AliceBlue {

    // Get GetAccessToken ALICE BLUE
    async GetAccessToken(req, res) {
        try {

            //  res.send("alce blue")

            var hosts = req.headers.host;

            var redirect = hosts.split(':')[0];


            var client_key = req.query.client_key;
            console.log("client_key", client_key);

            var client_key = client_key.split('?authCode=')[0];

            var authCode = client_key.split('?authCode=')[1];


            const Get_User = await User.find({ client_key: client_key })

            if (Get_User.length > 0) {


                var user_id = Get_User[0]._id;
                var apiSecret = Get_User[0].api_secret;

                var userId = req.query.userId;

                var Encrypted_data = sha256(userId + authCode + apiSecret);
                var data = { "checkSum": Encrypted_data }


                var config = {
                    method: 'post',
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };


                axios(config)
                    .then(function (response) {
                        console.log('respons - ', response);
                    })
                    .catch(function (error) {
                        console.log('access token error ', error);
                    });

            }

            res.send({ Get_User: Get_User })




        } catch (error) {
            console.log("Theme error-", error);
        }
    }




}


module.exports = new AliceBlue();