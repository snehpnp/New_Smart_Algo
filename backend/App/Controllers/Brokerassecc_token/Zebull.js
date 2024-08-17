const sha256 = require('sha256');
var axios = require('axios');
const qs = require('querystring');

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

class Zebull {

    // Get GetAccessToken ANGEL
    async GetAccessTokenZebull(req, res) {


        var user_email = req.body.Email;

        try {
            if (user_email != undefined) {


                const Get_User = await User.find({ Email: user_email })

                if (Get_User.length > 0) {

                    var password = Get_User[0].app_id;
                    var appkey = Get_User[0].app_key;
                    var DOB = Get_User[0].api_secret;
                    var uid = Get_User[0].client_code;



                    var pwd_sha256 = sha256(password);
                    var appkey_sha256 = sha256(uid + "|" + appkey);


                    var data = { uid: uid, pwd: pwd_sha256, factor2: DOB, apkversion: '1.0.8', imei: '', vc: uid, appkey: appkey_sha256, source: 'API' }
                    var raw = "jData=" + JSON.stringify(data);



                    var config = {
                        method: 'post',
                        url: 'https://go.mynt.in/NorenWClientTP/QuickAuth',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: raw
                    };

                    await axios.request(config)
                        .then(async (response) => {



                            if (response.data.stat == "Ok") {
                                let AccessToken = response.data.susertoken
                                let result = await User.findByIdAndUpdate(
                                    Get_User[0]._id,
                                    {
                                        access_token: AccessToken,
                                        TradingStatus: "on",

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
                                        return res.send({ status: true, msg: "Trading On SuccessFully" });
                                    }
                                }


                            } else {
                                return res.send({ status: false, msg: response.data });

                            }


                        })
                        .catch((error) => {

                            if (error) {
                                if (error.response.data.emsgd) {
                                    return res.send({ status: false, msg: error.response.data.emsg });
                                }
                            } else {

                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                                return res.send({ status: false, msg: message });
                            }
                        });




                } else {
                    return res.send({ status: false, msg: "User not found" });
                }



            } else {
                return res.send({ status: false, msg: "User not found" });
            }



        } catch (error) {
            return res.send({ status: false, msg: "Network error" });
        }
    }

    // UPDATE ALL CLIENT BROKER RESPONSE
    async GetOrderFullInformationZebull(req, res, user_info) {

        try {
            const { user_id } = req.body


            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

            await GetAllBrokerResponse(user_info, res)


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
            FindUserBrokerResponse.forEach((data1) => {

                let data = JSON.stringify({
                    "Uid": user_info[0].client_code
                });

                var config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    // url: 'https://stagingtradingorestapi.swastika.co.in/kb/OrderBook/GetOrderBookList',
                    url: 'https://tradingorestapi.swastika.co.in/kb/OrderBook/GetOrderBookList',
                    headers: {
                        'Authorization': 'Bearer ' + user_info[0].access_token,
                        'Content-Type': 'application/json'
                    },
                    data: data

                };

                axios(config)
                    .then(async (response) => {
                        if (response.data.IsError != true) {
                            const result_order = response.data.Result.Data.find(item2 => item2.norenordno == data1.order_id);
                            if (result_order != undefined) {
                                const message = (JSON.stringify(result_order));
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.status,
                                        reject_reason: result_order.Rejreason

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
            return  res.send({ status: true, msg: "broker response updated successfully" })

        } else {
            return  res.send({ status: false, msg: "no user found" })
        }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }


}

module.exports = new Zebull();



