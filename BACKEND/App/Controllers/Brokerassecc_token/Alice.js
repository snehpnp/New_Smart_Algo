const sha256 = require('sha256');
var axios = require('axios');
var dateTime = require('node-datetime');

"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const user_logs = db.user_logs;

const mongoose = require('mongoose');

const { logger, getIPAddress } = require('../../Helper/logger.helper')
// const { formattedDateTime } = require('../../Helper/time.helper')

class AliceBlue {

    // Get GetAccessToken ALICE BLUE
    async GetAccessToken(req, res) {
        try {

            //  res.send("alce blue")

            var hosts = req.headers.host;

            var redirect = hosts.split(':')[0];
            var redirect_uri = '';
            if (redirect == "localhost") {
                redirect_uri = "http://localhost:3000"
            } else {
                redirect_uri = `https://${redirect}/`
            }
            console.log("redirect_uri", redirect_uri);




            var client_key_query = req.query.client_key;


            var client_key = client_key_query.split('?authCode=')[0];

            var authCode = client_key_query.split('?authCode=')[1];
            console.log("authCode", authCode);

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
                    .then(async function (response) {
                        if (response.data.userSession) {
                            let result = await User.findByIdAndUpdate(
                                user_id,
                                {
                                    access_token: response.data.userSession,
                                    TradingStatus: "on"
                                })

                            if (result != "") {
                                const user_login = new user_logs({
                                    user_Id: user_id,
                                    login_status: "Trading On",
                                    role: Get_User[0].Role,
                                    device: "WEB",
                                    system_ip: getIPAddress()
                                })
                                await user_login.save();
                                console.log("user_login", user_login);
                                if (user_login) {
                                    console.log("redirect_uri", redirect_uri);

                                    return res.redirect(redirect_uri);

                                }
                            }



                        } else {
                            return res.send(redirect_uri);
                        }



                    })
                    .catch(function (error) {
                        console.log('access token error ', error);
                    });

            }

      




        } catch (error) {
            console.log("Theme error-", error);
        }
    }




}


module.exports = new AliceBlue();