var axios = require('axios');
var qs = require('qs');
var path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const db = require('../../BACKEND/App/Models');
const services = db.services;
const Alice_token = db.Alice_token;
const Signals = db.Signals;
const MainSignals = db.MainSignals;
const AliceViewModel = db.AliceViewModel;
const BrokerResponse = db.BrokerResponse;
const position_data_store = db.position_data_store;
var dateTime = require('node-datetime');

const place_order = async (AllClientData, signals, token, filePath, signal_req, ExistExitSignal) => {
    try {

        var dt = signals.DTime;
        var input_symbol = signals.Symbol;
        var type = signals.TType;
        var tr_price = signals.Tr_Price;
        var price = signals.Price;
        var sq_value = signals.Sq_Value;
        var sl_value = signals.Sl_Value;
        var tsl = signals.TSL;
        var segment = signals.Segment.toUpperCase();
        var segment1 = signals.Segment.toUpperCase();
        var strike = signals.Strike;
        var option_type = signals.OType;
        var expiry = signals.Expiry;
        var strategy = signals.Strategy;
        var qty_percent = signals.Quntity;
        var client_key = signals.Key;
        var demo = signals.Demo;


        if (type == 'LE' || type == 'SE') {


            const requestPromises = AllClientData.map(async (item) => {

                if (token != 0) {


                    if (segment.toUpperCase() != "C") {


                        item.postdata.symboltoken = token[0].instrument_token;

                        item.postdata.tradingsymbol = token[0].tradesymbol;


                        if (type == 'LE' || type == 'SX') {
                            item.postdata.transactiontype = 'BUY';
                        } else if (type == 'SE' || type == 'LX') {
                            item.postdata.transactiontype = 'SELL';
                        }

             

                        if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                            item.postdata.price = price
                        }



                        EntryPlaceOrder(item, filePath, signals, signal_req)

                    } else {
                    

                        if (type == 'LE' || type == 'SX') {
                            item.postdata.transactiontype = 'BUY';
                        } else if (type == 'SE' || type == 'LX') {
                            item.postdata.transactiontype = 'SELL';
                        }

                        if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                            item.postdata.price = price
                        }

                        EntryPlaceOrder(item, filePath, signals, signal_req);

                    }



                } else {

                    BrokerResponse.create({
                        user_id: item._id,
                        receive_signal: signal_req,
                        strategy: strategy,
                        type: type,
                        symbol: input_symbol,
                        order_status: "",
                        order_id: "",
                        trading_symbol: "",
                        broker_name: "ANGEL",
                        send_request: "",
                        reject_reason: "Token not received due to wrong trade -"+token,

                    })
                        .then((BrokerResponseCreate) => {

                        })
                        .catch((err) => {
                            try {
                                console.log('Error creating and saving user:', err);
                            } catch (e) {
                                
                            }

                        });

                }

            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
                .then(responses => {
                   

                })
                .catch(errors => {
                    console.log("errors:", errors);

                });

        } else if (type == 'SX' || type == 'LX') {

            const requestPromises = AllClientData.map(async (item) => {
                if (token != 0) {

                    if (segment.toUpperCase() != "C") {
                        item.postdata.symboltoken = token[0].instrument_token;
                        item.postdata.tradingsymbol = token[0].tradesymbol;
                    }


                    if (type == 'LE' || type == 'SX') {
                        item.postdata.transactiontype = 'BUY';
                    } else if (type == 'SE' || type == 'LX') {
                        item.postdata.transactiontype = 'SELL';
                    }

                    if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                        item.postdata.price = price
                    }

                    var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');

                    var keyStatus = 0;


                   

                    try {
                        var config = {
                            method: 'get',
                            url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition',
                            headers: {
                                'Authorization': 'Bearer ' + item.access_token,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-UserType': 'USER',
                                'X-SourceID': 'WEB',
                                'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                                'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                                'X-MACAddress': 'MAC_ADDRESS',
                                'X-PrivateKey': item.api_key
                            },
                        };

                        // const response = await axios(config);
                        axios(config)
                            .then(async (response) => {
                               
                                // add code position again run
                                const filter = { user_id: item._id };
                                const update = {
                                    $set: {
                                        data: {
                                            response: JSON.stringify(response.data),
                                            item: item,
                                            token: token,
                                            signal_req: signal_req,
                                            strategy: strategy,
                                            type: type,
                                            input_symbol: input_symbol,
                                            send_rr: send_rr,
                                            filePath: filePath,
                                            signals: signals,
                                            ExistExitSignal: ExistExitSignal,
                                            segment: segment
                                        }
                                    },

                                };
                                await position_data_store.updateOne(filter, update, { upsert: true });
                                /////////////

                                fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data) + '\n', function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });

                                if (response.data.data != null && response.data.message == "SUCCESS") {
                                    const Exist_entry_order = response.data.data.find(item1 => item1.symboltoken === token[0].instrument_token);

                                    if (Exist_entry_order !== undefined) {
                                        let possition_qty;
                                        if (segment.toUpperCase() === 'C') {
                                            possition_qty = parseInt(Exist_entry_order.buyqty) - parseInt(Exist_entry_order.sellqty);
                                        } else {
                                            possition_qty = Exist_entry_order.netqty;
                                        }

                                        if (possition_qty === 0) {

                                            await BrokerResponse.create({
                                                user_id: item._id,
                                                receive_signal: signal_req,
                                                strategy: strategy,
                                                type: type,
                                                symbol: input_symbol,
                                                order_status: "Entry Not Exist",
                                                reject_reason: "This Script position Empty",
                                                broker_name: "ANGEL",
                                                send_request: send_rr,
                                                open_possition_qty: possition_qty,
                                            });

                                            await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

                                        } else {

                                            if ((possition_qty > 0 && type === 'LX') || (possition_qty < 0 && type === 'SX')) {
                                                await ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req);
                                            }
                                        }
                                    } else {

                                        await BrokerResponse.create({
                                            user_id: item._id,
                                            receive_signal: signal_req,
                                            strategy: strategy,
                                            type: type,
                                            symbol: input_symbol,
                                            order_status: "Entry Not Exist",
                                            order_id: "",
                                            trading_symbol: "",
                                            broker_name: "ANGEL",
                                            send_request: send_rr,
                                            reject_reason: "This symbol's position does not exist.",
                                        });

                                        await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

                                    }
                                } else {

                                    await BrokerResponse.create({
                                        user_id: item._id,
                                        receive_signal: signal_req,
                                        strategy: strategy,
                                        type: type,
                                        symbol: input_symbol,
                                        order_status: "Entry Not Exist",
                                        order_id: "",
                                        trading_symbol: "",
                                        broker_name: "ANGEL",
                                        send_request: send_rr,
                                        reject_reason: "All position Empty",
                                    });

                                    await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

                                }
                            })
                            .catch(async (error) => {
                              
                                const ExistUserPositionData = await position_data_store.findOne({ user_id: item._id });
                                

                                fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION AFTER API CATCH ExistUserPositionData - ' + item.UserName + ' ERROR - ' + JSON.stringify(ExistUserPositionData) + '\n', function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });
                                
                               
                                if (ExistUserPositionData != undefined) {
                                    
                                    // await PositionAgainProcess(ExistUserPositionData.data.response,
                                    //     ExistUserPositionData.data.item,
                                    //     ExistUserPositionData.data.token,
                                    //     ExistUserPositionData.data.signal_req,
                                    //     ExistUserPositionData.data.strategy,
                                    //     ExistUserPositionData.data.type,
                                    //     ExistUserPositionData.data.input_symbol,
                                    //     ExistUserPositionData.data.send_rr,
                                    //     ExistUserPositionData.data.filePath,
                                    //     ExistUserPositionData.data.signals,
                                    //     ExistUserPositionData.data.ExistExitSignal,
                                    //     ExistUserPositionData.data.segment
                                    //  )
                                    
                                    try {
                                        await PositionAgainProcess(ExistUserPositionData.data.response, ExistUserPositionData.data.item,token, signal_req, strategy, type, input_symbol, send_rr, filePath, signals, ExistExitSignal, segment
                                        )
                                    } catch (error) {
                                       
                                         
                                    }
                                }

                                fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION DATA API ERROR CATCH POSITION API - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });
        
                                // const message = error.response ? JSON.stringify(error.response.data).replace(/["',]/g, '') : JSON.stringify(error).replace(/["',]/g, '');
        
                                // await BrokerResponse.create({
                                //     user_id: item._id,
                                //     receive_signal: signal_req,
                                //     strategy: strategy,
                                //     type: type,
                                //     symbol: input_symbol,
                                //     order_status: "position request error",
                                //     order_id: "",
                                //     trading_symbol: "",
                                //     broker_name: "ANGEL",
                                //     send_request: send_rr,
                                //     reject_reason: message,
                                // });
        
                                // await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

                            });


                    } catch (error) {

                        const ExistUserPositionData = await position_data_store.findOne({ user_id: item._id });

                        
                        fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION AFTER API TRY CATCH ExistUserPositionData - ' + item.UserName + ' ERROR - ' + JSON.stringify(ExistUserPositionData) + '\n', function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                               
                        if (ExistUserPositionData != undefined) {
                            
                            // await PositionAgainProcess(ExistUserPositionData.data.response,
                            //     ExistUserPositionData.data.item,
                            //     ExistUserPositionData.data.token,
                            //     ExistUserPositionData.data.signal_req,
                            //     ExistUserPositionData.data.strategy,
                            //     ExistUserPositionData.data.type,
                            //     ExistUserPositionData.data.input_symbol,
                            //     ExistUserPositionData.data.send_rr,
                            //     ExistUserPositionData.data.filePath,
                            //     ExistUserPositionData.data.signals,
                            //     ExistUserPositionData.data.ExistExitSignal,
                            //     ExistUserPositionData.data.segment 
                            //  )

                           

                             await PositionAgainProcess(ExistUserPositionData.data.response, ExistUserPositionData.data.item,token, signal_req, strategy, type, input_symbol, send_rr, filePath, signals, ExistExitSignal, segment
                             )



                        }

                        fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION DATA ERROR TRY CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });



                        // const message = error.response ? JSON.stringify(error.response.data).replace(/["',]/g, '') : JSON.stringify(error).replace(/["',]/g, '');

                        // await BrokerResponse.create({
                        //     user_id: item._id,
                        //     receive_signal: signal_req,
                        //     strategy: strategy,
                        //     type: type,
                        //     symbol: input_symbol,
                        //     order_status: "position request error",
                        //     order_id: "",
                        //     trading_symbol: "",
                        //     broker_name: "ANGEL",
                        //     send_request: send_rr,
                        //     reject_reason: message,
                        // });

                        // await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);


                    }


                    // const checkPosition = async (item, token, signal_req, strategy, type, input_symbol, send_rr, filePath, signals, ExistExitSignal, segment) => {
                    //     try {
                    //         var config = {
                    //             method: 'get',
                    //             url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition',
                    //             headers: {
                    //                 'Authorization': 'Bearer ' + item.access_token,
                    //                 'Content-Type': 'application/json',
                    //                 'Accept': 'application/json',
                    //                 'X-UserType': 'USER',
                    //                 'X-SourceID': 'WEB',
                    //                 'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                    //                 'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                    //                 'X-MACAddress': 'MAC_ADDRESS',
                    //                 'X-PrivateKey': item.api_key
                    //             },
                    //         };

                    //         const response = await axios(config);
                    //         if (keyStatus == 2) {
                    //             fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data) + '\n', function (err) {
                    //                 if (err) {
                    //                     return console.log(err);
                    //                 }
                    //             });
                    //         }
                    //         if (response.data.data != null && response.data.message == "SUCCESS" ) {
                    //             const Exist_entry_order = response.data.data.find(item1 => item1.symboltoken === token[0].instrument_token);

                    //             if (Exist_entry_order !== undefined) {
                    //                 let possition_qty;
                    //                 if (segment.toUpperCase() === 'C') {
                    //                     possition_qty = parseInt(Exist_entry_order.buyqty) - parseInt(Exist_entry_order.sellqty);
                    //                 } else {
                    //                     possition_qty = Exist_entry_order.netqty;
                    //                 }

                    //                 if (possition_qty === 0) {
                    //                     keyStatus += 1;

                    //                     if (keyStatus === 2) {
                    //                         await BrokerResponse.create({
                    //                             user_id: item._id,
                    //                             receive_signal: signal_req,
                    //                             strategy: strategy,
                    //                             type: type,
                    //                             symbol: input_symbol,
                    //                             order_status: "Entry Not Exist",
                    //                             reject_reason: "This Script position Empty",
                    //                             broker_name: "ANGEL",
                    //                             send_request: send_rr,
                    //                             open_possition_qty: possition_qty,
                    //                         });

                    //                         await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);
                    //                     }
                    //                 } else {
                    //                     keyStatus = 2;
                    //                     if ((possition_qty > 0 && type === 'LX') || (possition_qty < 0 && type === 'SX')) {
                    //                         await ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req);
                    //                     }
                    //                 }
                    //             } else {
                    //                 keyStatus += 1;
                    //                 if (keyStatus == 2) {
                    //                     await BrokerResponse.create({
                    //                         user_id: item._id,
                    //                         receive_signal: signal_req,
                    //                         strategy: strategy,
                    //                         type: type,
                    //                         symbol: input_symbol,
                    //                         order_status: "Entry Not Exist",
                    //                         order_id: "",
                    //                         trading_symbol: "",
                    //                         broker_name: "ANGEL",
                    //                         send_request: send_rr,
                    //                         reject_reason: "This symbol's position does not exist.",
                    //                     });

                    //                     await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);
                    //                 }
                    //             }
                    //         } else {
                    //             keyStatus += 1;
                    //             if (keyStatus == 2) {
                    //                 await BrokerResponse.create({
                    //                     user_id: item._id,
                    //                     receive_signal: signal_req,
                    //                     strategy: strategy,
                    //                     type: type,
                    //                     symbol: input_symbol,
                    //                     order_status: "Entry Not Exist",
                    //                     order_id: "",
                    //                     trading_symbol: "",
                    //                     broker_name: "ANGEL",
                    //                     send_request: send_rr,
                    //                     reject_reason: "All position Empty",
                    //                 });

                    //                 await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);
                    //             }
                    //         }
                    //     } catch (error) {
                    //         fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION DATA ERROR CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
                    //             if (err) {
                    //                 return console.log(err);
                    //             }
                    //         });

                    //         const message = error.response ? JSON.stringify(error.response.data).replace(/["',]/g, '') : JSON.stringify(error).replace(/["',]/g, '');
                    //         keyStatus += 1;


                    //         if (keyStatus == 2) {
                    //             await BrokerResponse.create({
                    //                 user_id: item._id,
                    //                 receive_signal: signal_req,
                    //                 strategy: strategy,
                    //                 type: type,
                    //                 symbol: input_symbol,
                    //                 order_status: "position request error",
                    //                 order_id: "",
                    //                 trading_symbol: "",
                    //                 broker_name: "ANGEL",
                    //                 send_request: send_rr,
                    //                 reject_reason: message,
                    //             });

                    //             await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);
                    //         }

                    //     }
                    // };

                    // // Main logic to check position
                    // (async () => {
                    //     for (let i = 0; i < 2; i++) {
                    //         await checkPosition(item, token, signal_req, strategy, type, input_symbol, send_rr, filePath, signals, ExistExitSignal, segment);

                    //         if (keyStatus === 2) {
                    //             break; // Exit the loop if position is not zero or any other condition met
                    //         }
                    //     }
                    // })();




                } else {

                    BrokerResponse.create({
                        user_id: item._id,
                        receive_signal: signal_req,
                        strategy: strategy,
                        type: type,
                        symbol: input_symbol,
                        order_status: 0,
                        order_id: "",
                        trading_symbol: "",
                        broker_name: "ANGEL",
                        send_request: send_rr,
                        reject_reason: "Token not received due to wrong trade -"+token,

                    })
                        .then((BrokerResponseCreate) => {

                        })
                        .catch((err) => {
                            try {
                                console.log('Error creating and saving user:', err);
                            } catch (e) {
                                
                            }

                        });

                }




            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
                .then(responses => {
                    

                })
                .catch(errors => {
                    console.log("errors:", errors);

                });

        }


    } catch (error) {

        console.log("error", error);
    }

}

const EntryPlaceOrder = async (item, filePath, signals, signal_req) => {


    var dt = signals.DTime;
    var input_symbol = signals.Symbol;
    var type = signals.TType;
    var tr_price = signals.Tr_Price;
    var price = signals.Price;
    var sq_value = signals.Sq_Value;
    var sl_value = signals.Sl_Value;
    var tsl = signals.TSL;
    var segment = signals.Segment.toUpperCase();
    var segment1 = signals.Segment.toUpperCase();
    var strike = signals.Strike;
    var option_type = signals.OType;
    var expiry = signals.Expiry;
    var strategy = signals.Strategy;
    var qty_percent = signals.Quntity;
    var client_key = signals.Key;
    var demo = signals.Demo;

    var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');


    fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL BEFORE PLACE ORDER USER ENTRY- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });


    var config = {
        method: 'post',
        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
        headers: {
            'Authorization': 'Bearer ' + item.access_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': item.api_key
        },
        data: JSON.stringify(item.postdata)

    };
    // console.log(config);
    axios(config)
        .then(async (response) => {
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL AFTER PLACE ORDER USER ENTRY - ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
              
              
                if (err) {
                    return console.log(err);
                }
            });

            if (response.data.message == 'SUCCESS') {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.message,
                    order_id: response.data.data.orderid,
                    trading_symbol: "",
                    broker_name: "ANGEL",
                    send_request: send_rr,


                })
                    .then((BrokerResponseCreate) => {

                    })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });


            } else {

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
                    broker_name: "ANGEL",
                    send_request: send_rr,
                    reject_reason: message,

                })
                    .then((BrokerResponseCreate) => {

                    })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });

            }


        })
        .catch(async (error) => {
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL AFTER PLACE ORDER CATCH ENTRY - ' + item.UserName + ' ERROR -' + JSON.stringify(error) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



            try {

                if (error) {
                    if (error.response) {
                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                        BrokerResponse.create({
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type,
                            symbol: input_symbol,
                            order_status: "Error",
                            trading_symbol: "",
                            broker_name: "ANGEL",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {

                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
                                } catch (e) {
                                    
                                }

                            });


                    } else {
                        const message = (JSON.stringify(error)).replace(/["',]/g, '');

                        BrokerResponse.create({
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type,
                            symbol: input_symbol,
                            order_status: "Error",
                            trading_symbol: "",
                            broker_name: "ANGEL",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {

                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
                                } catch (e) {
                                    
                                }

                            });


                    }
                }

            } catch (e) {
                console.log("error 1", e);
            }

        });



}

const ExitPlaceOrder = async (item, filePath, possition_qty, signals, signal_req) => {


    var dt = signals.DTime;
    var input_symbol = signals.Symbol;
    var type = signals.TType;
    var tr_price = signals.Tr_Price;
    var price = signals.Price;
    var sq_value = signals.Sq_Value;
    var sl_value = signals.Sl_Value;
    var tsl = signals.TSL;
    var segment = signals.Segment.toUpperCase();
    var segment1 = signals.Segment.toUpperCase();
    var strike = signals.Strike;
    var option_type = signals.OType;
    var expiry = signals.Expiry;
    var strategy = signals.Strategy;
    var qty_percent = signals.Quntity;
    var client_key = signals.Key;
    var demo = signals.Demo;

    var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');

    fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL BEFORE PLACE ORDER USER EXIT- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    var config = {
        method: 'post',
        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
        headers: {
            'Authorization': 'Bearer ' + item.access_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-UserType': 'USER',
            'X-SourceID': 'WEB',
            'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
            'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
            'X-MACAddress': 'MAC_ADDRESS',
            'X-PrivateKey': item.api_key
        },
        data: JSON.stringify(item.postdata)

    };
    axios(config)
        .then(async (response) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL AFTER PLACE ORDER USER EXIT- ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



            if (response.data.message == 'SUCCESS') {
                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.message,
                    order_id: response.data.data.orderid,
                    trading_symbol: "",
                    broker_name: "ANGEL",
                    send_request: send_rr,
                    open_possition_qty: possition_qty,

                })
                    .then((BrokerResponseCreate) => {

                    })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });


            } else {

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
                    broker_name: "ANGEL",
                    send_request: send_rr,
                    reject_reason: message,

                })
                    .then((BrokerResponseCreate) => {

                    })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });

            }


        })
        .catch(async (error) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL AFTER PLACE ORDER USER EXIT CATCH- ' + item.UserName + ' RESPONSE -' + JSON.stringify(error) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            try {

                if (error) {
                    if (error.response) {
                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                        BrokerResponse.create({
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type,
                            symbol: input_symbol,
                            order_status: "Error",
                            trading_symbol: "",
                            broker_name: "ANGEL",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {

                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
                                } catch (e) {
                                    
                                }

                            });


                    } else {
                        const message = (JSON.stringify(error)).replace(/["',]/g, '');

                        BrokerResponse.create({
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type,
                            symbol: input_symbol,
                            order_status: "Error",
                            trading_symbol: "",
                            broker_name: "ANGEL",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {

                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
                                } catch (e) {
                                    
                                }

                            });


                    }
                }

            } catch (e) {
                console.log("error 1", e);
            }

        });


}

const PendingOrderCancel = async (ExistExitSignal, token, item, filePath, signals, signal_req) => {

    if (ExistExitSignal != '') {
        if (ExistExitSignal.length > 0) {

            var config = {
                method: 'get',
                url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getOrderBook',
                headers: {
                    'Authorization': 'Bearer ' + item.access_token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-UserType': 'USER',
                    'X-SourceID': 'WEB',
                    'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                    'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                    'X-MACAddress': 'MAC_ADDRESS',
                    'X-PrivateKey': item.api_key
                },
            };
            axios(config)
                .then(async (response) => {
                    if (Array.isArray(response.data.data)) {
                        if (response.data.data.length > 0) {



                        }
                    }


                })
                .catch(async (error) => {

                });


        }
    }


}

const PositionAgainProcess = async (data, item, token, signal_req, strategy, type, input_symbol, send_rr, filePath, signals, ExistExitSignal, segment) => {

    fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION AFTER PositionAgainProcess  INSIDE- ' + item.UserName + ' ERROR - ' + JSON.stringify(data) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    const response = JSON.parse(data);
    if (response.data.data != null && response.data.message == "SUCCESS") {

        fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL POSITION AFTER PositionAgainProcess  INSIDE- IFF ' + item.UserName + ' ERROR - ' + JSON.stringify(response.data.data) + '\n', function (err) {
            if (err) {
                return console.log(err);
            }
        });

        const Exist_entry_order = response.data.data.find(item1 => item1.symboltoken === token[0].instrument_token);

        if (Exist_entry_order !== undefined) {
            let possition_qty;
            if (segment.toUpperCase() === 'C') {
                possition_qty = parseInt(Exist_entry_order.buyqty) - parseInt(Exist_entry_order.sellqty);
            } else {
                possition_qty = Exist_entry_order.netqty;
            }

            if (possition_qty === 0) {

                await BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: "Entry Not Exist",
                    reject_reason: "This Script position Empty",
                    broker_name: "ANGEL",
                    send_request: send_rr,
                    open_possition_qty: possition_qty,
                });

                await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

            } else {

                if ((possition_qty > 0 && type === 'LX') || (possition_qty < 0 && type === 'SX')) {
                    await ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req);
                }
            }
        } else {

            await BrokerResponse.create({
                user_id: item._id,
                receive_signal: signal_req,
                strategy: strategy,
                type: type,
                symbol: input_symbol,
                order_status: "Entry Not Exist",
                order_id: "",
                trading_symbol: "",
                broker_name: "ANGEL",
                send_request: send_rr,
                reject_reason: "This symbol's position does not exist.",
            });

            await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

        }
    } else {

        await BrokerResponse.create({
            user_id: item._id,
            receive_signal: signal_req,
            strategy: strategy,
            type: type,
            symbol: input_symbol,
            order_status: "Entry Not Exist",
            order_id: "",
            trading_symbol: "",
            broker_name: "ANGEL",
            send_request: send_rr,
            reject_reason: "All position Empty",
        });

        await PendingOrderCancel(ExistExitSignal, token, item, filePath, signals, signal_req);

    }
}


module.exports = { place_order }



