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

class Angel {

    // Get GetAccessToken ANGEL
    async GetAccessTokenAngel(req, res) {

        try {

            var keystr = req.query.key;

            if(keystr != undefined){
    
    
                var key = keystr.split('?auth_token=')[0]; 
           
                var auth_token = keystr.split('?auth_token=')[1]; 
                


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
    
                    let result = await User.findByIdAndUpdate(
                        Get_User[0]._id,
                        {
                            access_token: auth_token,
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
                        if (user_login) {

                            return res.redirect(redirect_uri);

                        }
                    }
    
                }else{
                    return res.send(redirect_uri);   
                }
    

            }else{

                return res.send(redirect_uri);

            }

          

        } catch (error) {
            console.log("Error Theme error-", error);
        }
    }

      // UPDATE ALL CLIENT BROKER RESPONSE
      async GetOrderFullInformationAngel(req, res , user_info) {
       
        try {
            const { user_id } = req.body

            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

            GetAllBrokerResponse(user_info,res)


        } catch (error) {
            console.log("Error Some Error In Order information get -", error);
            return res.send({ status: false, msg: 'error in Server side', data: error });

        }


    }

}

const GetAllBrokerResponse = async (user_info,res) => {
    try {
        const objectId = new ObjectId(user_info[0]._id);
       // var FindUserAccessToken = await User.find({ _id: objectId }).limit(1);
        var FindUserBrokerResponse = await BrokerResponse.find({ user_id: objectId , order_view_status : "0" })
     
        if (FindUserBrokerResponse.length > 0) {
    
            FindUserBrokerResponse.forEach((data1) => {    
                var config = {
                    method: 'get',
                    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                    headers: {
                        'Authorization': 'Bearer ' + user_info[0].access_token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-UserType': 'USER',
                        'X-SourceID': 'WEB',
                        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                        'X-MACAddress': 'MAC_ADDRESS',
                        'X-PrivateKey': user_info[0].api_key
                    },
                };
                axios(config)
                    .then(async (response) => {
                       
                        if(response.data.data.length > 0){
                            
                            const result_order = response.data.data.find(item2 => item2.orderid === data1.order_id);
                            if(result_order != undefined){

                                    var reject_reason;
                                    if (result_order.text) {
                                        reject_reason = result_order.text;
                                    } else {
                                        reject_reason = '';
                                    }

                                const message = (JSON.stringify(result_order));
    
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.status,
                                        reject_reason: reject_reason
        
                                    },
                                    { new: true }
                                )

                              }else{


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
                          
                          
                        }else{
                            // console.log("NO DATA FOUND");
                        }

                       
                    })
                    .catch(async (error) => {
    
                    });
    
    
    
            })
           res.send({status:true,msg:"broker response updated successfully"})
    
        } else {
            res.send({status:false,msg:"no user found"})
         }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }
    
 
}

module.exports = new Angel();



