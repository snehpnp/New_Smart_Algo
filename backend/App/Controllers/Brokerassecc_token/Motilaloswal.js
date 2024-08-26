const sha256 = require('sha256');
var axios = require('axios');
const url = require('url');
var dateTime = require('node-datetime');
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


class Motilaloswal {

    // Get GetAccessToken ANGEL
    async GetAccessTokenMotilaloswal(req, res) {

        try {

            var hosts = req.headers.host;

            var redirect = hosts.split(':')[0];
            var redirect_uri = '';
            if (redirect == "localhost") {
                redirect_uri = "http://localhost:3000"
            } else {
                redirect_uri = `https://${redirect}/`
            }

            var usernamestr = req.query.email;

            var email = usernamestr.split('?authtoken=')[0];
            var authtoken = usernamestr.split('?authtoken=')[1];



            const Get_User = await User.find({ Email: email })

            if (Get_User.length > 0) {

                if (authtoken != '') {
                    let AccessToken = authtoken
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
                            return res.redirect(redirect_uri);
                        }
                    }


                } else { return res.send({ status: false, msg: "Error" }); }

            } else {
                return res.send({ status: false, msg: "User not found" });
            }






        } catch (error) {
            return res.send({ status: false, msg: "Network error" });
        }
    }

    // UPDATE ALL CLIENT BROKER RESPONSE
    async GetOrderFullInformationMotilaloswal(req, res, user_info) {

        try {
            const { user_id } = req.body


            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

            await GetAllBrokerResponse(user_info, res)


        } catch (error) {

            return res.send({ status: false, msg: 'error in Server side', data: error });

        }


    }


    async SingleOrderFullInformationMotilaloswal(req, res, user_info, broker_response_id, order_id) {

        try {

            const { user_id } = req.body
            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }


            var data_order = {
                "clientcode": user_info[0].client_code
            }

            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://openapi.motilaloswal.com/rest/book/v2/getorderbook',
                headers: {
                    'Accept': ' application/json',
                    'ApiKey': user_info[0].api_key,
                    'User-Agent': ' MOSL/V.1.1.0',
                    'vendorinfo': user_info[0].client_code,
                    'SourceId': ' WEB',
                    'MacAddress': ' B8-CA-3A-95-66-72',
                    'ClientLocalIp': ' 192.168.0.47',
                    'ClientPublicIp': ' 255.255.255.0',
                    'osname': ' Windows 10',
                    'osversion': ' 10.0.19041',
                    'devicemodel': ' AHV',
                    'manufacturer': ' DELL',
                    'productname': ' Smart Algo',
                    'productversion': ' 1.1',
                    'browsername': ' Chrome',
                    'browserversion': ' 109.0.5414.120',
                    'Authorization': user_info[0].access_token,

                },
                data: data_order
            };
            axios(config)
                .then(async (response) => {
                    if (response.data.data.length > 0) {

                        if (response.data.data.length > 0) {

                            const result_order = response.data.data.find(item2 => item2.uniqueorderid == order_id);
                            if (result_order != undefined) {

                                var reject_reason;
                                if (result_order.text) {
                                    reject_reason = result_order.text;
                                } else {
                                    reject_reason = '';
                                }

                                const message = (JSON.stringify(result_order));

                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: broker_response_id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.orderstatus,
                                        reject_reason: reject_reason,
                                        order_view_date: message

                                    },
                                    { new: true }
                                )

                                return res.send({ status: true, msg: "broker response updated successfully" })


                            } else {


                                const message = (JSON.stringify(result_order));

                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: broker_response_id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',

                                    },
                                    { new: true }
                                )

                                return res.send({ status: false, msg: 'result order undefined', data: [] });

                            }


                        }


                    } else {
                        return res.send({ status: false, msg: 'No data Available', data: [] });
                    }


                })
                .catch(async (error) => {

                    return res.send({ status: false, msg: 'Order Api Err .', data: [] });
                });



        } catch (error) {

            return res.send({ status: false, msg: 'error in Server side', data: error });

        }


    }








}

const GetAllBrokerResponse = async (user_info, res) => {


    try {
        const objectId = new ObjectId(user_info[0]._id);
        var FindUserBrokerResponse = await BrokerResponse.find({ user_id: objectId, order_view_status: "0" })



        if (FindUserBrokerResponse.length > 0) {
            FindUserBrokerResponse.forEach((data1) => {

                if (data1.order_id != '') {

                    var data_order = {
                        "clientcode": user_info[0].client_code
                    }

                    var config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://openapi.motilaloswal.com/rest/book/v2/getorderbook',
                        headers: {
                            'Accept': ' application/json',
                            'ApiKey': user_info[0].api_key,
                            'User-Agent': ' MOSL/V.1.1.0',
                            'vendorinfo': user_info[0].client_code,
                            'SourceId': ' WEB',
                            'MacAddress': ' B8-CA-3A-95-66-72',
                            'ClientLocalIp': ' 192.168.0.47',
                            'ClientPublicIp': ' 255.255.255.0',
                            'osname': ' Windows 10',
                            'osversion': ' 10.0.19041',
                            'devicemodel': ' AHV',
                            'manufacturer': ' DELL',
                            'productname': ' Smart Algo',
                            'productversion': ' 1.1',
                            'browsername': ' Chrome',
                            'browserversion': ' 109.0.5414.120',
                            'Authorization': user_info[0].access_token,

                        },
                        data: data_order
                    };

                    axios(config)
                        .then(async (response) => {


                            if (response.data.status == "SUCCESS") {
                                if (response.data.data.length > 0) {
                                    const result_order = response.data.data.find(item2 => item2.uniqueorderid == data1.order_id);


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
                                }


                            }


                        })
                        .catch(async (error) => {

                        });
                }





            })
            return res.send({ status: true, msg: "broker response updated successfully" })

        } else {
            return res.send({ status: false, msg: "no user found" })
        }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }


}

module.exports = new Motilaloswal();



