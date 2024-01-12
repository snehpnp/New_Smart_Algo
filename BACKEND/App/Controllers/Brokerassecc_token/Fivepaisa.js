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




const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
// const { formattedDateTime } = require('../../Helper/time.helper')

class Fivepaisa {

    // Get GetAccessToken 5 PAISA
    async GetAccessTokenFivepaisa(req, res) {
        try {

            const RequestToken = req.query.RequestToken;

            const state_client_key = req.query.state;

            var hosts = req.headers.host;

            var redirect = hosts.split(':')[0];
            var redirect_uri = '';
            if (redirect == "localhost") {
                redirect_uri = "http://localhost:3000"
            } else {
                redirect_uri = `https://${redirect}/`
            }



            if (RequestToken != undefined) {
                const Get_User = await User.find({ client_key: state_client_key }).limit(1)



                if (Get_User.length > 0) {

                    var data = {
                        "head": {
                            "Key": Get_User[0].api_key
                        },
                        "body": {
                            "RequestToken": RequestToken,
                            "EncryKey": Get_User[0].api_secret,
                            "UserId": Get_User[0].app_id
                        }
                    };

                    var config = {
                        method: 'post',
                        url: 'https://openapi.5paisa.com/VendorsAPI/Service1.svc/GetAccessToken',
                        data: data
                    };

                    axios(config)
                        .then(async function (response) {


                            var access_token = response.data.body.AccessToken;
                            var ClientCode = response.data.body.ClientCode;


                            if (access_token != '') {

                                let result = await User.findByIdAndUpdate(
                                    Get_User[0]._id,
                                    {
                                        access_token: access_token,
                                        TradingStatus: "on",
                                        client_code: ClientCode
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
                                    if (user_login) {
                                        return res.redirect(redirect_uri);
                                    }
                                } else {
                                    return res.send(redirect_uri);
                                }

                            } else {
                                return res.send(redirect_uri);
                            }

                        })
                        .catch(function (error) {
                        });


                } else {
                    return res.send(redirect_uri);

                }

            } else {
                return res.send(redirect_uri);
            }




          



        } catch (error) {
            console.log("Error Theme error-", error);
        }
    }

    // UPDATE ALL CLIENT BROKER RESPONSE
    async GetOrderFullInformationFivepaisa(req, res, user_info) {

        try {
            const { user_id } = req.body

            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

            GetAllBrokerResponse(user_info, res)


        } catch (error) {
            console.log("Error Some Error In Order information get -", error);
            return res.send({ status: false, msg: 'error in Server side', data: error });

        }


    }

}


const GetAllBrokerResponse = async (user_info, res) => {
   
    try {
        const objectId = new ObjectId(user_info[0]._id);

        var FindUserBrokerResponse = await BrokerResponse.find({ user_id: objectId, order_view_status: "0" })


        if (FindUserBrokerResponse.length > 0) {

            var data_order = {

                "head": {
                    "key": user_info[0].api_key
                },
                "body": {
                    "ClientCode": user_info[0].client_code
                }

            }
            await FindUserBrokerResponse.forEach((data1) => {

                var config = {
                    method: 'post',
                    url: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc/V2/OrderBook',
                    headers: {
                        'Authorization': 'Bearer ' + user_info[0].access_token,
                        'Content-Type': 'application/json'
                    },

                    data: JSON.stringify(data_order)

                };
                axios(config)
                    .then(async (response) => {
                        if (response) {
                            const result_order = response.data.body.OrderBookDetail.find(item2 => parseInt(item2.BrokerOrderId) === parseInt(data1.order_id));

                            if (result_order != undefined) {

                                const message = (JSON.stringify(result_order));

                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.OrderStatus,
                                        reject_reason: result_order.Reason

                                    },
                                    { new: true }
                                )

                            } else {


                                const message = (JSON.stringify(result_order));

                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',

                                    },
                                    { new: true }
                                )

                            }


                        } else {
                        }


                    })
                    .catch(async (error) => {

                    });



            })
            res.send({ status: true, msg: "broker response updated successfully" })

        } else {
            res.send({ status: false, msg: "no user found" })
        }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }


}

module.exports = new Fivepaisa();



