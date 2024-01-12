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

class Zerodha {

    // Get GetAccessToken Zerodha
    async GetAccessTokenZerodha(req, res) {

        try {

            var keystr = req.query.key;
            if (keystr != undefined) {

                const key = keystr.split('?request_token=')[0];
                const request_token = req.query.request_token;


                var hosts = req.headers.host;

                var redirect = hosts.split(':')[0];
                var redirect_uri = '';
                if (redirect == "localhost") {
                    redirect_uri = "http://localhost:3000"
                } else {
                    redirect_uri = `https://${redirect}/`
                }

                const Get_User = await User.find({ client_key: key })

                if (Get_User.length > 0) {

                    let api_key = Get_User[0].api_key;
                    let api_secret = Get_User[0].api_secret;
                    let checksum = sha256(api_key + request_token + api_secret);
                    let data = 'api_key=' + api_key + '&request_token=' + request_token + '&checksum=' + checksum;


                    var config = {
                        method: 'post',
                        url: 'https://api.kite.trade/session/token',
                        headers: {
                            'X-Kite-Version': '3'
                        },
                        data: data
                    };
                    axios(config)
                        .then(async function (response) {

                            if (response.data.status == "success") {

                                let result = await User.findByIdAndUpdate(
                                    Get_User[0]._id,
                                    {
                                        access_token: response.data.data.access_token,
                                        TradingStatus: "on",
                                        client_code: response.data.data.public_token
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
    async GetOrderFullInformationZerodha(req, res, user_info) {

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
        // var FindUserAccessToken = await User.find({ _id: objectId }).limit(1);
        var FindUserBrokerResponse = await BrokerResponse.find({ user_id: objectId, order_view_status: "0" })

        if (FindUserBrokerResponse.length > 0) {

            await FindUserBrokerResponse.forEach(async (data1) => {
                var config = {
                    method: 'get',
                    url: 'https://api.kite.trade/orders/' + data1.order_id,
                    headers: {
                        'Authorization': 'token ' + user_info[0].api_key + ':' + user_info[0].access_token
                    }
                };
                await axios(config)
                    .then(async (response) => {

                        if (response) {

                            let result_order = response.data.data[response.data.data.length - 1];

                            if (result_order != undefined) {

                                const message = (JSON.stringify(result_order));

                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.status,
                                        reject_reason: result_order.status_message

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
                            // console.log("NO DATA FOUND");
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

module.exports = new Zerodha();



