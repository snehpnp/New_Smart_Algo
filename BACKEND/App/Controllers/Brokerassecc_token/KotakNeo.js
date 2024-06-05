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
const jwt = require('jsonwebtoken');




const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
// const { formattedDateTime } = require('../../Helper/time.helper')

class KotakNeo {

    // Get GetkotakGetToken
    async GetkotakGetToken(req, res) {
       
       
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


                    

                    const qs = require('qs');
                    const apiUrl = 'https://napi.kotaksecurities.com/oauth2/token';
                    // const dematepassword = Get_User[0].app_id;
                    const consumerKey = Get_User[0].api_key;
                    const consumerSecret = Get_User[0].api_secret;
                    const username = Get_User[0].client_code;
                    const password = Get_User[0].api_type; //trade Api pass
                    const authString = `${consumerKey}:${consumerSecret}`;
                    const authHeaderValue = `Basic ${Buffer.from(authString).toString('base64')}`;
                    const requestData = {
                        grant_type: 'password',
                        username: username,
                        password: password
                    };

                  //  return res.send({ status: true });

                //   console.log("consumerKey ",consumerKey)
                //   console.log("consumerSecret ",consumerSecret)
                //   console.log("username ",username)
                //   console.log("password ",password)
                //   console.log("authString ",authString)
                //   console.log("authHeaderValue ",authHeaderValue)
                //   console.log("requestData ",requestData)


                    if(consumerKey==""|| consumerKey==null){
                        return res.send({ status: false, msg: "Please Update Consumer Key in Broker key..."});
                    }
                    if(username==""|| username==null){
                        return res.send({ status: false, msg: "Please Update User Name in Broker key..."});
                    }
                    // if(dematepassword==""|| dematepassword==null){
                    //     return res.send({ status: false, msg: "Please Update Demat Password in Broker key..."});
                    // }
                    if(consumerSecret==""|| consumerSecret==null){
                        return res.send({ status: false, msg: "Please Update Consumer Secret in Broker key..."});
                    }
                    if(password==""|| password==null){
                        return res.send({ status: false, msg: "Please Update Trade Api Password in Broker key..."});
                    }
                    
                    
                    //console.log("req ",req.body.Email)

                    const url = 'https://napi.kotaksecurities.com/oauth2/token';
                    const data = 'grant_type=client_credentials';
                    const headers = {
                        'Authorization': authHeaderValue
                    };
                    axios.post(url, data, { headers })
                    .then((response) => {
    
                            var access_token = response.data.access_token
                            if (response.data.access_token) {
    
                                var data5 = JSON.stringify({
                                    "mobileNumber": Get_User[0].PhoneNo.includes("+91") ? Get_User[0].PhoneNo : "+91" + Get_User[0].PhoneNo,
                                    "password": password
                                });
    
    
                                var config = {
                                    method: 'post',
                                    maxBodyLength: Infinity,
                                    url: 'https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate',
                                    headers: {
                                        'accept': '*/*',
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + access_token,
                                    },
                                    data: data5
                                };
                                console.log("config", config);
    
    
                                axios(config)
                                    .then(function (response) {
    
                                        console.log("response.data v2/validate", response.data);
                                        // console.log("control on 69 ",response.data);
                                        // return
                                        var stepOneToken = response.data.data.token
                                        var stepOneSID = response.data.data.sid
                                        var stepHsServerId = response.data.data.hsServerId
                                        var decodeAccessToken = jwt.decode(response.data.data.token)
                                     
                                        if (response.data.data.token) {
                                            
                                            
                                            var data1 = JSON.stringify({
                                                "userId": decodeAccessToken.sub,
                                                "sendEmail": true,
                                                "isWhitelisted": true
                                            });
                                            var config1 = {
                                                method: 'post',
                                                maxBodyLength: Infinity,
                                                url: 'https://gw-napi.kotaksecurities.com/login/1.0/login/otp/generate',
                                                headers: {
                                                    'accept': '*/*',
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer ' + access_token,
                                                },
                                                data: data1
                                            };
                                            // return
                                            axios(config1)
                                                .then(async function (response) {
                                                     console.log("OTP APIIIII", response);
                                                    // return
                                                    if (response.status == 201) {
    
                                                        // connection1.query('UPDATE `client` SET `oneTimeToken`="' + access_token + '" , `kotakneo_sid`="' + stepOneSID + '", `kotakneo_auth`="' + stepOneToken + '", `kotakneo_userd`="' + decodeAccessToken.sub + '", `hserverid`="' + stepHsServerId + '" WHERE email="' + req.body.email + '"', (err, result1) => {
    
                                                        //     res.send({ status: true });
                                                        // });


                                                        let result = await User.findByIdAndUpdate(
                                                            Get_User[0]._id,
                                                            {
                                                                oneTimeToken: access_token,
                                                                kotakneo_sid: stepOneSID,
                                                                kotakneo_auth: stepOneToken,
                                                                kotakneo_userd: decodeAccessToken.sub,
                                                                hserverid: stepHsServerId,
                                                                
                                                              
                                                            })

                                                            if (result != "") {
                                                                return res.send({ status: true });
                                                            }else{
                                                            return  res.send({ status: false, msg: "process Again" })       
                                                            } 


    
                                                    } else {
                                                        const message = (JSON.stringify(response)).replace(/["',]/g, '');
                                                        return  res.send({ status: false, msg: message })
                                                        
                                                    }
    
    
                                                })
                                                .catch(function (error) {
                                                    if (error) {
                                                        if (error.response) {
    
                                                            if (error.response.data.error != undefined) {
                                                             const message = (JSON.stringify(error.response.data.error[0].message)).replace(/["',]/g, '');

                                                              return  res.send({ status: false, msg: message })
                                                            } else {
                                                                

                                                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                                                              return  res.send({ status: false, msg: message })
                                                            }
                                                        }
                                                    }
                                                });
                                        } else {
                                            
                                            const message = (JSON.stringify(response.data)).replace(/["',]/g, '');
                                            res.send({ status: false, msg: message })
                                        }
    
                                    })
                                    .catch(function (error) {
    
                                        if (error.response.data.error != undefined) {
                                        
                                            const message = (JSON.stringify(error.response.data.error[0])).replace(/["',]/g, '');

                                            res.send({ status: false, msg: message })
                                        } else {
                                           
                                            const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                                            res.send({ status: false, msg: message })
                                        }
    
    
                                    });
                            } else {
                                console.log("oauth2/token1", response.data);
                                const message = (JSON.stringify(response.data)).replace(/["',]/g, '');
                                return res.send({ status: false, msg: message })
    
                            }
    
                        })
                        .catch(error => {

                            //console.log(" error -237 ",error)
                            if (error.response != undefined) {
                              // console.log(" error -237 IFFF ",error.response.data)
 
                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                return res.send({ status: false, msg: message })
                            } else {
                               // console.log("oauth2/token1", error.response.data);
                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                                return res.send({ status: false, msg: message })
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

    // Get GetkotakGetSession
    async GetkotakGetSession(req, res) {
       
        console.log("req ",req.body)
       
        var user_email = req.body.Email;
        var otp = req.body.otp;

          
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

                    if(otp != ""){
                   
                   
    
                    var data2 = JSON.stringify({
                        "userId": Get_User[0].kotakneo_userd,
                        "otp": req.body.otp
                    });
                    //console.log("req ",req.body.Email)
                    var config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://gw-napi.kotaksecurities.com/login/1.0/login/v2/validate',
                        headers: {
                            'accept': '*/*',
                            'sid': Get_User[0].kotakneo_sid,
                            'Auth': Get_User[0].kotakneo_auth,
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + Get_User[0].oneTimeToken
                        },
                        data: data2
                    };
                      
                      await axios.request(config)
                      .then(async(response) => {

                        //console.log("req ",response.data.data.token)
                        if(response.status == 201){
                           let AccessToken = response.data.data.token;
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
                             
                            const message = (JSON.stringify(response)).replace(/["',]/g, '');
                            return res.send({ status: false, msg: message});
                          
                        }


                      })
                      .catch((error) => {
                    // console.log("error -- 378",error.response.data);
                        
                     if(error){
                         
                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                        return res.send({ status: false, msg: message});


                        }else{

                            const message = (JSON.stringify(error)).replace(/["',]/g, '');
                            return res.send({ status: false, msg: message});
                        }
                      });


                    }else{
                        return res.send({ status: false, msg: "Please Enter OTP"});
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
     async GetOrderFullInformationKotakNeo(req, res , user_info) {
       
        try {
            const { user_id } = req.body
            
           
            if (!user_id) {
                return res.send({ status: false, msg: 'Please Fill All Feild', data: [] });
            }

           await GetAllBrokerResponse(user_info,res)
            

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
                         // console.log("response order details ",response.data.status)
                         if(response.data.IsError != true){
                            const result_order = response.data.Result.Data.find(item2 => item2.norenordno === data1.order_id);
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
           res.send({status:true,msg:"broker response updated successfully"})
    
        } else {
            res.send({status:false,msg:"no user found"})
         }

    } catch (error) {
        console.log("Error in broker response in order Id".error);
    }
    
 
}

module.exports = new KotakNeo();



