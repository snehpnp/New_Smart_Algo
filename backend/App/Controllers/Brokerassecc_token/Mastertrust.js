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


class Mastertrust {

    // Get GetAccessToken 
    async GetAccessTokenMastertrust(req, res) {
         

        var tokenCode = req.query.code;
        var user_email = req.query.state;

         
        try {

            if(tokenCode != undefined){

                var hosts = req.headers.host;
    
                var redirect = hosts.split(':')[0];
                var redirect_uri = '';
                if (redirect == "localhost") {
                    redirect_uri = "http://localhost:3000"
                } else {
                    redirect_uri = `https://${redirect}/`
                }
    
                const Get_User = await User.find({ Email: user_email })
    
                if (Get_User.length > 0) {


                    var app_id = Get_User[0].app_id;
                    var apiSecret = Get_User[0].api_secret;
            
                
                    // var data = qs.stringify({
                    //     'grant_type': 'authorization_code',
                    //     'code': req.query.code,
                    //     'client_id': result[0].app_id,
                    //     'client_secret_post': result[0].api_secret,
                    //     'redirect_uri': `https://${hosts}/mastertrust/access_token`,
                    //     'authorization_response': 'authorization_response'
        
                    // });
            
                    // Define the URL and headers
                    var data = qs.stringify({
                        grant_type: 'authorization_code',
                        code: tokenCode,
                        client_id: app_id,
                        client_secret: apiSecret,
                        redirect_uri: `https://${hosts}/backend/mastertrust`,
                        authorization_response : 'authorization_response'
                      });

                    var config = {
                        method: 'post',
                        url: 'https://masterswift-beta.mastertrust.co.in/oauth2/token',
                        auth: {
                            username: app_id,
                            password: apiSecret
                        },
                        data: data
                    };
        
                    axios(config)
                    .then(async function(response) {
                        const accessToken = response.data.access_token;
                      if (accessToken !== undefined) {
            
                            let result = await User.findByIdAndUpdate(
                                Get_User[0]._id,
                                {
                                    access_token: accessToken,
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
            
                        } else {
                          return res.redirect(redirect_uri);
                        }
            
                      })
                      .catch(error => {
         
                        return res.redirect(redirect_uri);
                      });


    
                    
    
                }else{
                    return res.redirect(redirect_uri);   
                }
    

            }else{

                return res.redirect(redirect_uri);

            }

          

        } catch (error) {
            console.log("Error Theme error-", error);
        }
    }

      // UPDATE ALL CLIENT BROKER RESPONSE
      async GetOrderFullInformationMastertrust(req, res , user_info) {
       
        try {
            const { user_id } = req.body

            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

            GetAllBrokerResponse(user_info,res)


        } catch (error) {

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
                    url: 'https://masterswift-beta.mastertrust.co.in/api/v1/order/' + data1.order_id + '/history?client_id=' + user_info[0].app_id,
                    headers: {
                         Authorization: 'Bearer ' + user_info[0].access_token 
                        },
                };
                axios(config)
                    .then(async (response) => {
                       

                          const result_order = response.data.data[0];
                        
                             if(result_order != undefined){

                                const message = (JSON.stringify(result_order));
    
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.status,
                                        reject_reason: result_order.reject_reason
        
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
           

                       
                    })
                    .catch(async (error) => {
    
                    });
    
    
    
            })
            return res.send({status:true,msg:"broker response updated successfully"})
    
        } else {
            return  res.send({status:false,msg:"no user found"})
         }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }
    
 
}

module.exports = new Mastertrust();



