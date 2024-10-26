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
var dateTime = require('node-datetime');

const place_order = async (AllClientData, signals, token, filePath, signal_req) => {

    try {

        var dt = signals.DTime;
        var input_symbol = signals.Symbol;
        var type = signals.TType.toUpperCase();
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


        if (token != 0) {

            if (type == 'LE' || type == 'SE') {

                const pattern = token[0].instrument_token
                var filePath_token = ""
                var symbol;

                if (segment && segment.toUpperCase() === 'C') {
                    filePath_token = '/Fyers/FYERS_NSE.csv';
                } else if (segment && (segment.toUpperCase() === 'F' || segment.toUpperCase() === 'O')) {
                    filePath_token = '/Fyers/FYERS_NFO.csv';
                } else if (segment && (segment.toUpperCase() === 'CF' || segment.toUpperCase() === 'CO')) {
                    filePath_token = '/Fyers/FYERS_CDS.csv';
                } else if (segment && (segment.toUpperCase() === 'MF' || segment.toUpperCase() === 'MO')) {
                    filePath_token = '/Fyers/FYERS_MCX.csv';
                } else {

                    console.log('Invalid segment value');
                }

                const filePath_fyers = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);

                const command = `grep ,${pattern}, ${filePath_fyers}`;


                exec(command, (error, stdout, stderr) => {

                    if (error) {
                        console.log(`exec error: ${error}`);
                        // return;
                    }

                    if (stdout) {

                        const parts = stdout.split(','); 
                        if (segment && segment.toUpperCase() === 'C') {
                            symbol = parts[9]
                        } else if (segment && (segment.toUpperCase() === 'F' || segment.toUpperCase() === 'O')) {
                            symbol = parts[9]
                        } else if (segment && (segment.toUpperCase() === 'CF' || segment.toUpperCase() === 'CO')) {
                            symbol = parts[9]
                        } else if (segment && (segment.toUpperCase() === 'MF' || segment.toUpperCase() === 'MO')) {
                            symbol = parts[9]
                        } else {
                            console.log('Invalid segment value');

                            const requestPromises = AllClientData.map(async (item) => {



                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: 0,
                                    order_id: "",
                                    trading_symbol: "",
                                    broker_name: "FYERS",
                                    send_request: "",
                                    reject_reason: "Invalid segment value",

                                })
                                    .then((BrokerResponseCreate) => {

                                    })
                                    .catch((err) => {
                                        try {
                                            console.log('Error creating and saving user:', err);
                                        } catch (e) {
                                            
                                        }

                                    });


                            });
                            // Send all requests concurrently using Promise.all
                            Promise.all(requestPromises)
                                .then(responses => {
                            
                                })
                                .catch(errors => {
                                    console.log("errors:", errors);
                                });

                            return;
                        }





                        const requestPromises = AllClientData.map(async (item) => {

                            item.postdata.symbol = symbol;


                            if (type == 'LE' || type == 'SX') {
                                item.postdata.side = 1;
                            } else if (type == 'SE' || type == 'LX') {
                                item.postdata.side = -1;
                            }

                   

                            if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                                item.postdata.limitPrice = price
                            }



                            EntryPlaceOrder(item, filePath, signals, signal_req)


                        });
                       
                        Promise.all(requestPromises)
                            .then(responses => {
                           
                            })
                            .catch(errors => {
                                console.log("errors:", errors);
                            });


                    } else {

                        const requestPromises = AllClientData.map(async (item) => {

                            BrokerResponse.create({
                                user_id: item._id,
                                receive_signal: signal_req,
                                strategy: strategy,
                                type: type,
                                symbol: input_symbol,
                                order_status: "",
                                order_id: "",
                                trading_symbol: "",
                                broker_name: "FYERS",
                                send_request: "",
                                reject_reason: "Token not Found",

                            })
                                .then((BrokerResponseCreate) => {

                                })
                                .catch((err) => {
                                    try {
                                        console.log('Error creating and saving user:', err);
                                    } catch (e) {
                                        
                                    }

                                });

                        });
                        // Send all requests concurrently using Promise.all
                        Promise.all(requestPromises)
                            .then(responses => {
                               

                            })
                            .catch(errors => {
                                console.log("errors:", errors);

                            });

                    }



                });



            }

            else if (type == 'SX' || type == 'LX') {
              


                const pattern = token[0].instrument_token
                var filePath_token = ""
                var symbol;

                if (segment && segment.toUpperCase() === 'C') {
                    filePath_token = '/Fyers/FYERS_NSE.csv';
                } else if (segment && (segment.toUpperCase() === 'F' || segment.toUpperCase() === 'O')) {
                    filePath_token = '/Fyers/FYERS_NFO.csv';
                } else if (segment && (segment.toUpperCase() === 'CF' || segment.toUpperCase() === 'CO')) {
                    filePath_token = '/Fyers/FYERS_CDS.csv';
                } else if (segment && (segment.toUpperCase() === 'MF' || segment.toUpperCase() === 'MO')) {
                    filePath_token = '/Fyers/FYERS_MCX.csv';
                } else {

                    console.log('Invalid segment value');
                }

                const filePath_fyers = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);

                const command = `grep ,${pattern}, ${filePath_fyers}`;

                exec(command, (error, stdout, stderr) => {

                    if (error) {
                        console.log(`exec error: ${error}`);
                      
                    }

                    if (stdout) {

                        const parts = stdout.split(','); 
                        if (segment && segment.toUpperCase() === 'C') {
                            symbol = parts[9]
                        } else if (segment && (segment.toUpperCase() === 'F' || segment.toUpperCase() === 'O')) {
                            symbol = parts[9]
                        } else if (segment && (segment.toUpperCase() === 'CF' || segment.toUpperCase() === 'CO')) {
                            symbol = parts[9]
                        } else if (segment && (segment.toUpperCase() === 'MF' || segment.toUpperCase() === 'MO')) {
                            symbol = parts[9]
                        } else {
                            console.log('Invalid segment value');

                            const requestPromises = AllClientData.map(async (item) => {



                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: 0,
                                    order_id: "",
                                    trading_symbol: "",
                                    broker_name: "FYERS",
                                    send_request: "",
                                    reject_reason: "Invalid segment value",

                                })
                                    .then((BrokerResponseCreate) => {

                                    })
                                    .catch((err) => {
                                        try {
                                            console.log('Error creating and saving user:', err);
                                        } catch (e) {
                                            
                                        }

                                    });


                            });
                            // Send all requests concurrently using Promise.all
                            Promise.all(requestPromises)
                                .then(responses => {
                                
                                })
                                .catch(errors => {
                                    console.log("errors:", errors);
                                });


                        }




                        const requestPromises = AllClientData.map(async (item) => {

                           
                            item.postdata.symbol = symbol;


                            if (type == 'LE' || type == 'SX') {
                                item.postdata.side = 1;
                            } else if (type == 'SE' || type == 'LX') {
                                item.postdata.side = -1;
                            }

                            if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                                item.postdata.limitPrice = price
                            }



                            var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');


                            var config = {
                                method: 'get',
                                url: 'https://api.fyers.in/api/v2/positions',
                                headers: {
                                    'Authorization': item.app_id + ':' + item.access_token,
                                },
                            };
                            axios(config)
                                .then(async (response) => {
                                 
                                    if (response) {

                                        if (Array.isArray(response.data.netPositions)) {

                                            fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data) + '\n', function (err) {
                                                if (err) {
                                                    //  return console.log(err);
                                                }
                                            });

                                            const Exist_entry_order = response.data.netPositions.find(item1 => item1.symbol == symbol);

                                            if (Exist_entry_order != undefined) {

                                                const possition_qty = parseInt(Exist_entry_order.buyQty) - parseInt(Exist_entry_order.sellQty);
                                               
                                                if (possition_qty == 0) {
                                                  
                                                    BrokerResponse.create({
                                                        user_id: item._id,
                                                        receive_signal: signal_req,
                                                        strategy: strategy,
                                                        type: type,
                                                        symbol: input_symbol,
                                                        order_status: "Entry Not Exist",
                                                        reject_reason: "This Script position Empty ",
                                                        broker_name: "FYERS",
                                                        send_request: send_rr,
                                                        open_possition_qty: possition_qty,

                                                    })
                                                        .then((BrokerResponseCreate) => { })
                                                        .catch((err) => {
                                                            try {
                                                                console.log('Error creating and saving user:', err);
                                                            } catch (e) {
                                                                
                                                            }

                                                        });


                                                } else {


                                                    if (possition_qty > 0 && type == 'LX') {
                                                        ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                                    } else if (possition_qty < 0 && type == 'SX') {
                                                        ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                                    }
                                                }



                                            } else {

                                                BrokerResponse.create({
                                                    user_id: item._id,
                                                    receive_signal: signal_req,
                                                    strategy: strategy,
                                                    type: type,
                                                    symbol: input_symbol,
                                                    order_status: "Entry Not Exist",
                                                    order_id: "",
                                                    trading_symbol: "",
                                                    broker_name: "FYERS",
                                                    send_request: send_rr,
                                                    reject_reason: "position Not Exist",

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








                                        } else {

                                            BrokerResponse.create({
                                                user_id: item._id,
                                                receive_signal: signal_req,
                                                strategy: strategy,
                                                type: type,
                                                symbol: input_symbol,
                                                order_status: "Entry Not Exist",
                                                order_id: "",
                                                trading_symbol: "",
                                                broker_name: "FYERS",
                                                send_request: send_rr,
                                                reject_reason: "All position Empty",

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

                                    } else {
                                        BrokerResponse.create({
                                            user_id: item._id,
                                            receive_signal: signal_req,
                                            strategy: strategy,
                                            type: type,
                                            symbol: input_symbol,
                                            order_status: "Entry Not Exist",
                                            order_id: "",
                                            trading_symbol: "",
                                            broker_name: "FYERS",
                                            send_request: send_rr,
                                            reject_reason: "Possition Not Available",

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

                                    fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS POSITION DATA ERROR CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                    });

                                    if (error) {
                                        const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');
                                        BrokerResponse.create({
                                            user_id: item._id,
                                            receive_signal: signal_req,
                                            strategy: strategy,
                                            type: type,
                                            symbol: input_symbol,
                                            order_status: "position request error",
                                            order_id: "",
                                            trading_symbol: "",
                                            broker_name: "FYERS",
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
                                            order_status: "position request error",
                                            order_id: "",
                                            trading_symbol: "",
                                            broker_name: "FYERS",
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
                                });











                        });
                        // Send all requests concurrently using Promise.all
                        Promise.all(requestPromises)
                            .then(responses => {
                          
                            })
                            .catch(errors => {
                                console.log("errors:", errors);
                            });




                    } else {

                        const requestPromises = AllClientData.map(async (item) => {

                            BrokerResponse.create({
                                user_id: item._id,
                                receive_signal: signal_req,
                                strategy: strategy,
                                type: type,
                                symbol: input_symbol,
                                order_status: "",
                                order_id: "",
                                trading_symbol: "",
                                broker_name: "FYERS",
                                send_request: "",
                                reject_reason: "Token not Found",

                            })
                                .then((BrokerResponseCreate) => {

                                })
                                .catch((err) => {
                                    try {
                                        console.log('Error creating and saving user:', err);
                                    } catch (e) {
                                        
                                    }

                                });

                        });
                        // Send all requests concurrently using Promise.all
                        Promise.all(requestPromises)
                            .then(responses => {
                              

                            })
                            .catch(errors => {
                                console.log("errors:", errors);

                            });

                    }




                });



            }


        } else {

            const requestPromises = AllClientData.map(async (item) => {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: "",
                    order_id: "",
                    trading_symbol: "",
                    broker_name: "FYERS",
                    send_request: "",
                    reject_reason: "Token not received due to wrong trade",

                })
                    .then((BrokerResponseCreate) => {

                    })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });

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
    var type = signals.TType.toUpperCase();
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


    fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS BEFORE PLACE ORDER USER ENTRY- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    let config = {
        method: 'post',
        url: 'https://api.fyers.in/api/v2/orders',
        headers: {
            'Authorization': item.app_id + ':' + item.access_token,
        },
        data: item.postdata

    };
    // console.log(config);
    axios(config)
        .then(async (response) => {
            fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS AFTER PLACE ORDER USER ENTRY - ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            if (response.data.s == "ok") {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.s,
                    order_id: response.data.id,
                    reject_reason: response.data.message,
                    trading_symbol: "",
                    broker_name: "FYERS",
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
                    broker_name: "FYERS",
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
            fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS AFTER PLACE ORDER CATCH ENTRY - ' + item.UserName + ' ERROR -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "FYERS",
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
                            broker_name: "FYERS",
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
    var type = signals.TType.toUpperCase();
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

    fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS BEFORE PLACE ORDER USER EXIT- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    let config = {
        method: 'post',
        url: 'https://api.fyers.in/api/v2/orders',
        headers: {
            'Authorization': item.app_id + ':' + item.access_token,
        },
        data: item.postdata

    };

    axios(config)
        .then(async (response) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS AFTER PLACE ORDER USER EXIT- ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



            if (response.data.s == "ok") {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.s,
                    order_id: response.data.id,
                    reject_reason: response.data.message,
                    trading_symbol: "",
                    broker_name: "FYERS",
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
                    broker_name: "FYERS",
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

            fs.appendFile(filePath, 'TIME ' + new Date() + ' FYERS AFTER PLACE ORDER USER EXIT CATCH- ' + item.UserName + ' RESPONSE -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "FYERS",
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
                            broker_name: "FYERS",
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


module.exports = { place_order }
