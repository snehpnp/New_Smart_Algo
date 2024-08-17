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

class Swastika {

    // Get GetAccessToken ANGEL
    async GetAccessTokenSwastika(req, res) {
       
       
        var user_email = req.body.Email;
        var totp = req.body.totp;

         
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

                    if(totp != ""){
                   
                    var client_code = Get_User[0].client_code;
                    var mpin = Get_User[0].app_id;
                   

                    if(client_code==""|| client_code==null){
                        return res.send({ status: false, msg: "Please Update CLIENT CODE in Broker key..."});
                    }
                    if(mpin==""|| mpin==null){
                        return res.send({ status: false, msg: "Please Update MPIN in Broker key..."});
                    }
                    
                    
                    
                    var data = JSON.stringify({
                        "Totp": totp,
                        "ClientCode": client_code,
                        "MPIN": mpin,
                        "GenerationSourceTP": "FTLTP",
                        "IPAddress": "192.168.0.1"
                    })
    
                    var config = {
                        method: "post",
                        // url: 'https://stagingtradingorestapi.swastika.co.in/auth/TOTP/VerifyTotp',
                        url: 'https://tradingorestapi.swastika.co.in/auth/TOTP/VerifyTotp',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                      
                      await axios.request(config)
                      .then(async(response) => {

                       
                       

                        if(response.data.IsError == false){
                           let AccessToken = response.data.Result.Data.AccessToken;
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
                                    return res.send({ status: true, msg: "Trading On SuccessFully"});
                                }
                            }

                           
                        }else{
                            return res.send({ status: false, msg: response.data.ResponseException.ExceptionMessage});
                          
                        }


                      })
                      .catch((error) => {
                  
                        
                     if(error){
                         if(error.response.data.ResponseException.ExceptionMessage != undefined){
                         return res.send({ status: false, msg: error.response.data.ResponseException.ExceptionMessage});
                         } 
                        }else{

                            const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                            return res.send({ status: false, msg: message});
                        }
                      });


                    }else{
                        return res.send({ status: false, msg: "Please Enter TOTP"});
                    }
               
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
     async GetOrderFullInformationSwastika(req, res , user_info) {
       
        try {
            const { user_id } = req.body
            
           
            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

           await GetAllBrokerResponse(user_info,res)
            

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
          
                      let data = JSON.stringify({
                        "Uid": user_info[0].client_code
                      });

                      var config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        // url: 'https://stagingtradingorestapi.swastika.co.in/kb/OrderBook/GetOrderBookList',
                        url: 'https://tradingorestapi.swastika.co.in/kb/OrderBook/GetOrderBookList',
                        headers: { 
                            'Authorization': 'Bearer '+user_info[0].access_token, 
                            'Content-Type': 'application/json'
                        },
                        data : data

                    };

                axios(config)
                    .then(async (response) => {                       
                         if(response.data.IsError != true){
                            const result_order = response.data.Result.Data.find(item2 => item2.norenordno == data1.order_id);
                            if(result_order != undefined){
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

module.exports = new Swastika();



