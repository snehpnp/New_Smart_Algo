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

class Markethub {

    // Get GetAccessToken ANGEL
    async GetAccessTokenMarkethub(req, res) {
       
   
       
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


                    var client_id = Get_User[0].client_code;
                    var Password_Code = Get_User[0].app_id;
                    var Verification_Code = Get_User[0].api_secret;

                
                    if(client_id==""|| client_id==null){
                        return res.send({ status: false, msg: "Please Update CLIENT ID in Broker key..."});
                    }
                    if(Verification_Code==""|| Verification_Code==null){
                        return res.send({ status: false, msg: "Please Update Verification Code in Broker key..."});
                    }
                    if(Password_Code==""|| Password_Code==null){
                        return res.send({ status: false, msg: "Please Update Password Code in Broker key..."});
                    }

                     
            

                    
                    //check fund Api
                   var config = {
                        method: 'get',
                        url: 'http://trdapi.markethubonline.com:27005/api1/token?client_id='+client_id+'&password='+Password_Code+'&verification='+Verification_Code
                    };
                      
                      await axios.request(config)
                      .then(async(response) => {

                       

                        if(response.data.token != undefined){
                           let AccessToken = response.data.token;
                            let result = await User.findByIdAndUpdate(
                                Get_User[0]._id,
                                {
                                    access_token: AccessToken,
                                    TradingStatus: "on",
                                    client_code: client_id
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
                            return res.send({ status: false, msg: "Please Update correct credentials in Broker key..."});
                          
                        }


                      })
                      .catch((error) => {
                  
                        
                        if(error){
                         if(error.response.data == ""){
                         return res.send({ status: false, msg: "Please Update correct credentials in Broker key..."});
                         } 
                        }else{
                            return res.send({ status: false, msg: "unauthorized..."});
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
     async GetOrderFullInformationMarkethub(req, res , user_info) {
       
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
              
               
                var config = {
                    method: 'get',
                    url: 'http://trdapi.markethubonline.com:27005/api1/orderstatus?client_id='+user_info[0].client_code+'&user_order_number='+data1.order_id,
                          headers: 
                          { 
                          "token": user_info[0].access_token,
                          "content-type": "application/json" 
                          },
                     
                      };
                axios(config)
                    .then(async (response) => {
                       

                          const result_order = response.data;

                            if(result_order != undefined){

                                const message = (JSON.stringify(result_order));
    
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    { _id: data1._id },
                                    {
                                        order_view_date: message,
                                        order_view_status: '1',
                                        order_view_response: response.data.data[0].status,
                                        reject_reason: response.data.data[0].reason
        
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

module.exports = new Markethub();



