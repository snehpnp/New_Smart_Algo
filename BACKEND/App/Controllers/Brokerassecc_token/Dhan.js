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
// const { formattedDateTime } = require('../../Helper/time.helper')

class Dhan {

    // Get GetAccessToken ANGEL
    async GetAccessTokenDhan(req, res) {
       
        console.log("req ",req.body.Email)
       
        var user_email = req.body.Email;
         
        try {

            if(user_email != undefined){

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


                    var AccessToken = Get_User[0].api_key;
                    var ClientId = Get_User[0].client_code;
                    
                    if(ClientId==""|| ClientId==null){
                        return res.send({ status: false, msg: "Please Update CLIENT ID in Broker key..."});
                    }

                    console.log("req ",req.body.Email)
            
                    
                    //check fund Api
                    let config = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: 'https://api.dhan.co/fundlimit',
                        headers: { 
                          'Content-Type': 'application/json', 
                          'access-token': AccessToken
                        }
                      };
                      
                      await axios.request(config)
                      .then(async(response) => {
                       
                        console.log(JSON.stringify(response.data.dhanClientId));

                        if(response.data.dhanClientId == ClientId){
                            
                            let result = await User.findByIdAndUpdate(
                                Get_User[0]._id,
                                {
                                    access_token: AccessToken,
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
                                    return res.send({ status: true, msg: "Trading On SuccessFully"});
                                }
                            }

                           
                        }else{
                            return res.send({ status: false, msg: "Please Update correct CLIENT ID in Broker key..."});
                          
                        }


                      })
                      .catch((error) => {
                        //console.log(error.response.data.errorCode);
                        
                        if(error){
                         if(error.response.data.errorCode == "UNAUTHORIZED"){
                         return res.send({ status: false, msg: "Please Update correct ACCESS TOKEN in Broker key..."});
                         } 
                        }
                      });



                }else{
                    return res.send({ status: false, msg: "User not found"});
                }
    

            }else{
                return res.send({ status: false, msg: "User not found"});
            }

          

        } catch (error) {
            return res.send({ status: false, msg: "Network error"});
        }
    }

      // UPDATE ALL CLIENT BROKER RESPONSE
     async GetOrderFullInformationDhan(req, res , user_info) {
       
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

      //  console.log("GetAllBrokerResponse ",FindUserBrokerResponse)
     
        if (FindUserBrokerResponse.length > 0) {
    
            FindUserBrokerResponse.forEach((data1) => {    
              
                var config = {
                    method: 'get',
                    url: 'https://api.dhan.co/orders/' + data1.order_id,
                    headers: {
                        'access-token': user_info[0].access_token,
                        'Content-Type': 'application/json'
                    },
                };
                axios(config)
                    .then(async (response) => {
                       
                          console.log("response order details ",response.data)

                          const result_order = response.data;

                            if(result_order != undefined){

                                const message = (JSON.stringify(result_order));
    
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: result_order.orderStatus,
                                        reject_reason: result_order.omsErrorDescription
        
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
           res.send({status:true,msg:"broker response updated successfully"})
    
        } else {
            res.send({status:false,msg:"no user found"})
         }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }
    
 
}

module.exports = new Dhan();



