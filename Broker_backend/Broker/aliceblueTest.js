var axios = require('axios');
var qs = require('qs');
const fs = require('fs');
const db = require('../../BACKEND/App/Models');
const services = db.services;
const Alice_token = db.Alice_token;
const Signals = db.Signals;
const MainSignals = db.MainSignals;
const AliceViewModel = db.AliceViewModel;
const BrokerResponse = db.BrokerResponse;


var dateTime = require('node-datetime');
const place_order = async (AllClientData, splitArray,token,filePath,signal_req) => {


    try {
        console.log("ALICE BLUE BROKER TEST FILE - ");
        
           
      
            var dt = splitArray[0]
            var input_symbol = splitArray[1]
            var type = splitArray[2]
            var tr_price = splitArray[3]
            var price = splitArray[4]
            var sq_value = splitArray[5]
            var sl_value = splitArray[6]
            var tsl = splitArray[7]
            var segment = splitArray[8]
            var strike = splitArray[9]
            var option_type = splitArray[10]
            var expiry = splitArray[11]
            var strategy = splitArray[12]
            var qty_percent = splitArray[13]
            var client_key = splitArray[14]
            var demo = splitArray[15]


            if(type == 'LE' || type == 'SE'){

                const requestPromises = AllClientData.map(async(item) => {

                    if(token != 0){
        
        
                        console.log("user id ", item.demat_userid)
                        console.log("postdata before", item.postdata)
                        
                        
                        if (segment.toUpperCase() != "C") {
                            item.postdata.symbol_id = token[0].instrument_token;
                        }
        
        
                        if (type == 'LE' || type == 'SX') {
                            item.postdata.transtype = 'BUY';
                        } else if (type == 'SE' || type == 'LX') {
                            item.postdata.transtype = 'SELL';
                        }
        
                        console.log("price", price)
                        console.log("item.client_services.order_type", item.client_services.order_type)
        
                        if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                            item.postdata.price = price
                        }
        
                        // console.log("postdata After", item.postdata)
                        var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');
        
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                            headers: {
                                'Authorization': "Bearer " + item.demat_userid + " " + item.access_token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify([item.postdata])
                        
                        };
                        
                        axios(config)
                            .then(async (response) => {
                                console.log("respose",response.data)
                                if (response.data[0].stat == "Ok") {
                    
                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: response.data[0].stat,
                                    order_id: response.data[0].NOrdNo,
                                    trading_symbol: "",
                                    broker_name: "ALICE BLUE",
                                    send_request: send_rr,
                                    reject_reason: "",
                                    
                                    })
                                .then((BrokerResponseCreate) => {
                                    // console.log('User created and saved:', BrokerResponseCreate._id)
                                })
                                .catch((err) => {
                                    try {
                                    console.error('Error creating and saving user:', err);
                                    } catch (e) {
                                    console.log("duplicate key")
                                    }
                
                                });
        
        
                                }else{
                                
                                const message = (JSON.stringify(response.data)).replace(/["',]/g, '');
                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: 0,
                                    order_id: "",
                                    trading_symbol: "",
                                    broker_name: "ALICE BLUE",
                                    send_request: send_rr,
                                    reject_reason: message,
                                    
                                    })
                                .then((BrokerResponseCreate) => {
                                    // console.log('User created and saved:', BrokerResponseCreate._id)
                                })
                                .catch((err) => {
                                    try {
                                    console.error('Error creating and saving user:', err);
                                    } catch (e) {
                                    console.log("duplicate key")
                                    }
                
                                });
        
                                }
        
        
                            })
                            .catch(async (error) => {
                            console.log("Alice Blue Error",error.response)
        
                            BrokerResponse.create({
                                user_id: item._id,
                                receive_signal: signal_req,
                                strategy: strategy,
                                type: type,
                                symbol: input_symbol,
                                order_status: 0,
                                order_id: "",
                                trading_symbol: "",
                                broker_name: "ALICE BLUE",
                                send_request: "",
                                reject_reason: "",
                                receive_signal: ""
                                })
                            .then((BrokerResponseCreate) => {
                                console.log('User created and saved:', BrokerResponseCreate._id)
                            })
                            .catch((err) => {
                                try {
                                console.error('Error creating and saving user:', err);
                                } catch (e) {
                                console.log("duplicate key")
                                }
        
                            });
                            
                            });
                        
                    
                    
                        }else{
                        
                        BrokerResponse.create({
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type,
                            symbol: input_symbol,
                            order_status: 0,
                            order_id: "",
                            trading_symbol: "",
                            broker_name: "",
                            send_request: "",
                            reject_reason: "Token not received due to wrong trade",
                            
                            })
                        .then((BrokerResponseCreate) => {
                            // console.log('User created and saved:', BrokerResponseCreate._id)
                        })
                        .catch((err) => {
                            try {
                            console.error('Error creating and saving user:', err);
                            } catch (e) {
                            console.log("duplicate key")
                            }
        
                        });
        
                    }
        
                    });
                    // Send all requests concurrently using Promise.all
                    Promise.all(requestPromises)
                    .then(responses => {
                    console.log("Response:", responses.data);
                        
                    })
                    .catch(errors => {
                    console.log("errors:", errors);
                    
                    });  

            }else if(type == 'SX' || type == 'LX'){
                  
                const requestPromises = AllClientData.map(async(item) => {

                    var data_possition = {
                        "ret": "NET"
                    }
                    var config = {
                        method: 'post',
                        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/positionBook',
                        headers: {
                            'Authorization': 'Bearer ' + item.demat_userid + ' ' + item.access_token,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(data_possition)
                    };
                    axios(config)
                        .then(async (response) => {
                        })
                        .catch(async (error) => {
    
                            if (error.response.data) {
                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    bro_res_last_id,
                                    {
                                        symbol: input_symbol,
                                        send_request: send_rr,
                                        order_status: "Error",
                                        reject_reason: message
                                    },
                                    { new: true }
                                )
                            } else {
                                const message = (JSON.stringify(error)).replace(/["',]/g, '');
    
    
                                let result = await BrokerResponse.findByIdAndUpdate(
                                    bro_res_last_id,
                                    {
                                        symbol: input_symbol,
                                        send_request: send_rr,
                                        order_status: "Error",
                                        reject_reason: message
                                    },
                                    { new: true }
                                )
                            }
                        });

       



                    if(token != 0){
        
        
                        console.log("user id ", item.demat_userid)
                        console.log("postdata before", item.postdata)
                        
                        
                        if (segment.toUpperCase() != "C") {
                            item.postdata.symbol_id = token[0].instrument_token;
                        }
        
        
                        if (type == 'LE' || type == 'SX') {
                            item.postdata.transtype = 'BUY';
                        } else if (type == 'SE' || type == 'LX') {
                            item.postdata.transtype = 'SELL';
                        }
        
                        console.log("price", price)
                        console.log("item.client_services.order_type", item.client_services.order_type)
        
                        if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                            item.postdata.price = price
                        }
        
                        // console.log("postdata After", item.postdata)
                        var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');
        
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                            headers: {
                                'Authorization': "Bearer " + item.demat_userid + " " + item.access_token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify([item.postdata])
                        
                        };
                        
                        axios(config)
                            .then(async (response) => {
                                console.log("respose",response.data)
                                if (response.data[0].stat == "Ok") {
                    
                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: response.data[0].stat,
                                    order_id: response.data[0].NOrdNo,
                                    trading_symbol: "",
                                    broker_name: "ALICE BLUE",
                                    send_request: send_rr,
                                    reject_reason: "",
                                    
                                    })
                                .then((BrokerResponseCreate) => {
                                    // console.log('User created and saved:', BrokerResponseCreate._id)
                                })
                                .catch((err) => {
                                    try {
                                    console.error('Error creating and saving user:', err);
                                    } catch (e) {
                                    console.log("duplicate key")
                                    }
                
                                });
        
        
                                }else{
                                
                                const message = (JSON.stringify(response.data)).replace(/["',]/g, '');
                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: 0,
                                    order_id: "",
                                    trading_symbol: "",
                                    broker_name: "ALICE BLUE",
                                    send_request: send_rr,
                                    reject_reason: message,
                                    
                                    })
                                .then((BrokerResponseCreate) => {
                                    // console.log('User created and saved:', BrokerResponseCreate._id)
                                })
                                .catch((err) => {
                                    try {
                                    console.error('Error creating and saving user:', err);
                                    } catch (e) {
                                    console.log("duplicate key")
                                    }
                
                                });
        
                                }
        
        
                            })
                            .catch(async (error) => {
                            console.log("Alice Blue Error",error.response)
        
                            BrokerResponse.create({
                                user_id: item._id,
                                receive_signal: signal_req,
                                strategy: strategy,
                                type: type,
                                symbol: input_symbol,
                                order_status: 0,
                                order_id: "",
                                trading_symbol: "",
                                broker_name: "ALICE BLUE",
                                send_request: "",
                                reject_reason: "",
                                receive_signal: ""
                                })
                            .then((BrokerResponseCreate) => {
                                console.log('User created and saved:', BrokerResponseCreate._id)
                            })
                            .catch((err) => {
                                try {
                                console.error('Error creating and saving user:', err);
                                } catch (e) {
                                console.log("duplicate key")
                                }
        
                            });
                            
                            });
                        
                    
                    
                        }else{
                        
                        BrokerResponse.create({
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type,
                            symbol: input_symbol,
                            order_status: 0,
                            order_id: "",
                            trading_symbol: "",
                            broker_name: "",
                            send_request: "",
                            reject_reason: "Token not received due to wrong trade",
                            
                            })
                        .then((BrokerResponseCreate) => {
                            // console.log('User created and saved:', BrokerResponseCreate._id)
                        })
                        .catch((err) => {
                            try {
                            console.error('Error creating and saving user:', err);
                            } catch (e) {
                            console.log("duplicate key")
                            }
        
                        });
        
                    }



        
                    });
                    // Send all requests concurrently using Promise.all
                    Promise.all(requestPromises)
                    .then(responses => {
                    console.log("Response:", responses.data);
                        
                    })
                    .catch(errors => {
                    console.log("errors:", errors);
                    
                    });

            }
           
         


    } catch (error) {

        console.log("error", error);
    }

}


module.exports = { place_order }
