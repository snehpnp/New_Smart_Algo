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



const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
// const { formattedDateTime } = require('../../Helper/time.helper')

class AliceBlue {

    // Get GetAccessToken ALICE BLUE
    async GetAccessToken(req, res) {
        try {
            const authCode = req.query.authCode;
            var userId = req.query.userId;

            var broker_infor = await Broker_information.find({ broker_name: "Alice Blue" })
            var apiSecret = broker_infor[0].apiSecret
            console.log("broker_infor", apiSecret);

            var hosts = req.headers.host;

            var redirect = hosts.split(':')[0];
            var redirect_uri = '';
            if (redirect == "localhost") {
                redirect_uri = "http://localhost:3000"
            } else {
                redirect_uri = `https://${redirect}/`
            }

            const Get_User = await User.find({ demat_userid: userId })

            if (Get_User.length > 0) {



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
                                Get_User[0]._id,
                                {
                                    access_token: response.data.userSession,
                                    TradingStatus: "on"
                                })

                            if (result != "") {
                                const user_login = new user_logs({
                                    user_Id: Get_User[0]._id,
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


    // GET ORDER ID TO ORDER FULL DATA
    async GetOrderFullInformation(req, res) {
        try {
            // var OrderId = "23091800155929"
            const { OrderId, user_id } = req.body


            if (!OrderId || !user_id) {
                console.log("Please Fill All Feild");
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });

            }

            const objectId = new ObjectId(user_id);

            var FindUserAccessToken = await User.find({ _id: objectId })
            var FindUserBrokerResponse = await BrokerResponse.find({ user_id: objectId, order_id: OrderId })


            if (FindUserBrokerResponse[0].order_view_status == "0") {

                let data = JSON.stringify({
                    "nestOrderNumber": OrderId
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
                    headers: {
                        'Authorization': "Bearer " + FindUserAccessToken[0].demat_userid + " " + FindUserAccessToken[0].access_token,
                        'Content-Type': 'application/json',
                    },
                    data: data
                };
                console.log("config", config);
                axios(config)
                    .then(async (response) => {
                        console.log(response.data[0]);
                        if (response.data[0]) {

                            const message = (JSON.stringify(response.data[0]));

                            let result = await BrokerResponse.findByIdAndUpdate(
                                { _id: FindUserBrokerResponse[0]._id },
                                {
                                    order_view_date: message,
                                    order_view_status: '1',
                                    order_view_response: response.data[0].Status
                                },
                                { new: true }
                            )
                            if (result) {

                                return res.send({ status: true, msg: 'SuccessFully Update', data: [] });
                            }



                        } else {
                            console.log("NO DATA FOUND");
                        }
                    })
                    .catch(async (error) => {

                        if (error.response.data) {
                            const message = (JSON.stringify(error.response.data));

                            let result = await BrokerResponse.findByIdAndUpdate(
                                { _id: FindUserBrokerResponse[0]._id },
                                {
                                    order_view_date: message,
                                    order_view_status: '1',
                                    order_view_response: "Error"
                                },
                                { new: true }
                            )
                            return res.send({ status: false, msg: 'Error', data: message });

                        } else {
                            const message = (JSON.stringify(error));

                            let result = await BrokerResponse.findByIdAndUpdate(
                                { _id: FindUserBrokerResponse[0]._id },
                                {
                                    order_view_date: message,
                                    order_view_status: '1',
                                    order_view_response: "Error"
                                },
                                { new: true }
                            )
                            return res.send({ status: false, msg: 'Error', data: message });

                        }
                    });
            } else {
                return res.send({ status: false, msg: 'Already Update', data: FindUserBrokerResponse });

            }


        } catch (error) {
            console.log("Some Error In Order information get -", error);
            return res.send({ status: false, msg: 'error in Server side', data: error });

        }
    }


}


module.exports = new AliceBlue();


// try {
//     const authCode = req.query.authCode;
//     var userId = req.query.userId;


//     var hosts = req.headers.host;

//     var redirect = hosts.split(':')[0];
//     var redirect_uri = '';
//     if (redirect == "localhost") {
//         redirect_uri = "http://localhost:3000"
//     } else {
//         redirect_uri = `https://${redirect}/`
//     }
//     console.log("redirect_uri", redirect_uri);




//     var client_key_query = req.query.client_key;


//     var client_key = client_key_query.split('?authCode=')[0];

//     var authCode = client_key_query.split('?authCode=')[1];
//     console.log("authCode", authCode);

//     const Get_User = await User.find({ client_key: client_key })

//     if (Get_User.length > 0) {


//         var user_id = Get_User[0]._id;
//         var apiSecret = Get_User[0].api_secret;

//         var userId = req.query.userId;

//         var Encrypted_data = sha256(userId + authCode + apiSecret);
//         var data = { "checkSum": Encrypted_data }


//         var config = {
//             method: 'post',
//             url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             data: data
//         };

//         axios(config)
//             .then(async function (response) {
//                 if (response.data.userSession) {
//                     let result = await User.findByIdAndUpdate(
//                         user_id,
//                         {
//                             access_token: response.data.userSession,
//                             TradingStatus: "on"
//                         })

//                     if (result != "") {
//                         const user_login = new user_logs({
//                             user_Id: user_id,
//                             login_status: "Trading On",
//                             role: Get_User[0].Role,
//                             device: "WEB",
//                             system_ip: getIPAddress()
//                         })
//                         await user_login.save();
//                         console.log("user_login", user_login);
//                         if (user_login) {
//                             console.log("redirect_uri", redirect_uri);

//                             return res.redirect(redirect_uri);

//                         }
//                     }



//                 } else {
//                     return res.send(redirect_uri);
//                 }



//             })
//             .catch(function (error) {
//                 console.log('access token error ', error);
//             });

//     }






// } catch (error) {
//     console.log("Theme error-", error);
// }