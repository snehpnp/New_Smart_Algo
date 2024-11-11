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

const place_order = async (AllClientData, signals, token, filePath, signal_req ,ExistExitSignal) => {
     
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

     
     if(token != 0){
     
      if (type == 'LE' || type == 'SE') {
         
       if (segment.toUpperCase() != "C") {
        const pattern = token[0].instrument_token
        var filePath_token = ""
        var trading_symbol;
        if (segment && segment.toUpperCase() === 'C') {
            filePath_token = '/Aliceblue/ALICE_NSE.csv';
        } else if (segment && (segment.toUpperCase() === 'F' || segment.toUpperCase() === 'O')) {
            filePath_token = '/Aliceblue/ALICE_NFO.csv';
        } else if (segment && (segment.toUpperCase() === 'CF' || segment.toUpperCase() === 'CO')) {
            filePath_token = '/Aliceblue/ALICE_CDS.csv';
        } else if (segment && (segment.toUpperCase() === 'MF' || segment.toUpperCase() === 'MO')) {
            filePath_token = '/Aliceblue/ALICE_MCX.csv';
        } else {


            console.log('Invalid segment value');
            return;
        }

        const filePath_aliceblue = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);

       const command = `grep ,${pattern}, ${filePath_aliceblue}`;
    
        exec(command, (error, stdout, stderr) => {

            if (error) {
                console.log(`exec error: ${error}`);
               // return;
            }

             if(stdout){

            const parts = stdout.split(','); 
        
            if (segment && segment.toUpperCase() === 'C') {
                trading_symbol = token[0].instrument_token
            } else if (segment && (segment.toUpperCase() === 'F' || segment.toUpperCase() === 'O')) {
                trading_symbol = parts[9];
            } else if (segment && (segment.toUpperCase() === 'CF' || segment.toUpperCase() === 'CO')) {
                trading_symbol = parts[8];
            } else if (segment && (segment.toUpperCase() === 'MF' || segment.toUpperCase() === 'MO')) {
                trading_symbol = parts[8];
            } else {
               
                
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
                        broker_name: "",
                        send_request: "",
                        reject_reason: "Invalid segment value",
            
                    })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }
        
                    }); 
                });
            
                Promise.all(requestPromises)
                .then(responses => {  })
                .catch(errors => {
                    console.log("errors:", errors);
                  });
                    
                return;
            }

        
            const requestPromises = AllClientData.map(async (item) => {

            item.postdata.symbol_id = token[0].instrument_token;

            item.postdata.trading_symbol = trading_symbol;


            if (type == 'LE' || type == 'SX') {
                item.postdata.transtype = 'BUY';
            } else if (type == 'SE' || type == 'LX') {
                item.postdata.transtype = 'SELL';
            }


            if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                item.postdata.price = price
            }

            EntryPlaceOrder(item, filePath, signals, signal_req)


           });
       
          Promise.all(requestPromises)
          .then(responses => {})
          .catch(errors => {
              console.log("errors:", errors);
          });
             }else{
                
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
                        broker_name: "ALICE BLUE",
                        send_request: "",
                        reject_reason: "Token not Found",
            
                    })
                        .then((BrokerResponseCreate) => {  })
                        .catch((err) => {
                            try {
                                console.log('Error creating and saving user:', err);
                            } catch (e) {
                                
                            }
            
                        });
            
                      });
                 
                        Promise.all(requestPromises)
                        .then(responses => {
                          
            
                        })
                        .catch(errors => {
                            console.log("errors:", errors);
            
                        });

             }



        });

       }else{



        const requestPromises = AllClientData.map(async (item) => {

        if (type == 'LE' || type == 'SX') {
            item.postdata.transtype = 'BUY';
        } else if (type == 'SE' || type == 'LX') {
            item.postdata.transtype = 'SELL';
        }



        if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
            item.postdata.price = price
        }

        EntryPlaceOrder(item, filePath, signals, signal_req);
        
       });
      // Send all requests concurrently using Promise.all
        Promise.all(requestPromises)
        .then(responses => {
          
        })
        .catch(errors => {
            console.log("errors:", errors);
        });





       }

      }

      else if (type == 'SX' || type == 'LX') {
      
      
        const requestPromises = AllClientData.map(async (item) => {
    
                if (segment.toUpperCase() != "C") {
                    item.postdata.symbol_id = token[0].instrument_token;
                }
    
    
                if (type == 'LE' || type == 'SX') {
                    item.postdata.transtype = 'BUY';
                } else if (type == 'SE' || type == 'LX') {
                    item.postdata.transtype = 'SELL';
                }
    
    
                if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                    item.postdata.price = price
                }
    
    
    
                var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');
    
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
             
                       
    
    
                        if (Array.isArray(response.data)) {
    
                            fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data) + '\n', function (err) {
                                if (err) {
                                 
                                }
                            });
    
                            const Exist_entry_order = response.data.find(item1 => item1.Token === token[0].instrument_token && item1.Pcode == item.postdata.pCode);
    
                            if(Exist_entry_order != undefined){
                                if (segment.toUpperCase() == 'C') {
    
                                    const possition_qty = parseInt(Exist_entry_order.Bqty) - parseInt(Exist_entry_order.Sqty);
                                 
                                    if (possition_qty == 0) {
                                    
                                        BrokerResponse.create({
                                            user_id: item._id,
                                            receive_signal: signal_req,
                                            strategy: strategy,
                                            type: type,
                                            symbol: input_symbol,
                                            order_status: "Entry Not Exist",
                                            reject_reason: "This Script position Empty ",
                                            broker_name: "ALICE BLUE",
                                            send_request: send_rr,
                                            open_possition_qty: possition_qty,
    
                                        })
                                            .then((BrokerResponseCreate) => {})
                                            .catch((err) => {
                                                try {
                                                    console.log('Error creating and saving user:', err);
                                                } catch (e) {
                                                    
                                                }
    
                                            });

                                            PendingOrderCancel(ExistExitSignal,token ,item ,filePath, signals, signal_req)
    
    
                                    } else {
    
                                        if (possition_qty > 0 && type == 'LX') {
                                            ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                        } else if (possition_qty < 0 && type == 'SX') {
                                            ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                        }
                                    }
    
    
                                } else {
                                    item.postdata.trading_symbol = Exist_entry_order.Tsym;
                                    const possition_qty = Exist_entry_order.Netqty;                         
                                    if (possition_qty == 0) {
                                         
                                        BrokerResponse.create({
                                            user_id: item._id,
                                            receive_signal: signal_req,
                                            strategy: strategy,
                                            type: type,
                                            symbol: input_symbol,
                                            order_status: "Entry Not Exist",
                                            reject_reason: "This Script position Empty ",
                                            broker_name: "ALICE BLUE",
                                            send_request: send_rr,
                                            open_possition_qty: possition_qty,
    
                                        })
                                            .then((BrokerResponseCreate) => {  })
                                            .catch((err) => {
                                                try {
                                                    console.log('Error creating and saving user:', err);
                                                } catch (e) {
                                                    
                                                }
    
                                            });
                                      
                                            PendingOrderCancel(ExistExitSignal,token ,item ,filePath, signals, signal_req)
    
    
                                    } else {
    
                                        if (possition_qty > 0 && type == 'LX') {
                                            ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                        } else if (possition_qty < 0 && type == 'SX') {
                                            ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                        }
    
                                    }
    
                                }
                            }else{

                               

                                BrokerResponse.create({
                                    user_id: item._id,
                                    receive_signal: signal_req,
                                    strategy: strategy,
                                    type: type,
                                    symbol: input_symbol,
                                    order_status: "Entry Not Exist",
                                    order_id: "",
                                    trading_symbol: "",
                                    broker_name: "ALICE BLUE",
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

                                    PendingOrderCancel(ExistExitSignal,token ,item ,filePath, signals, signal_req)
    
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
                                broker_name: "ALICE BLUE",
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

                                PendingOrderCancel(ExistExitSignal,token ,item ,filePath, signals, signal_req)
    
                        }
    
    
    
    
                    })
                    .catch(async (error) => {
                        
                        fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE POSITION DATA ERROR CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
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
                                broker_name: "ALICE BLUE",
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

                                PendingOrderCancel(ExistExitSignal,token ,item ,filePath, signals, signal_req)

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
                                broker_name: "ALICE BLUE",
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
                                PendingOrderCancel(ExistExitSignal,token ,item ,filePath, signals, signal_req)
    
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

      }else{

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
            broker_name: "ALICE BLUE",
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


    fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE BEFORE PLACE ORDER USER ENTRY- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });


    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
        headers: {
            'Authorization': 'Bearer ' + item.demat_userid + ' ' + item.access_token,

            'Content-Type': 'application/json',
        },
        data: JSON.stringify([item.postdata])

    };
    // console.log(config);
    axios(config)
        .then(async (response) => {
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE AFTER PLACE ORDER USER ENTRY - ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

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
                    broker_name: "ALICE BLUE",
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
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE AFTER PLACE ORDER CATCH ENTRY - ' + item.UserName + ' ERROR -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "ALICE BLUE",
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
                            broker_name: "ALICE BLUE",
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

    fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE BEFORE PLACE ORDER USER EXIT- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

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
     
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE AFTER PLACE ORDER USER EXIT- ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



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
                    broker_name: "ALICE BLUE",
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

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE AFTER PLACE ORDER USER EXIT CATCH- ' + item.UserName + ' RESPONSE -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "ALICE BLUE",
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
                            broker_name: "ALICE BLUE",
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

const PendingOrderCancel = async(ExistExitSignal,token ,item ,filePath, signals, signal_req)=>{
   
if(ExistExitSignal != ''){
  if(ExistExitSignal.length > 0){

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/fetchOrderBook',
  headers: {
    'Authorization': 'Bearer ' + item.demat_userid + ' ' + item.access_token,

    'Content-Type': 'application/json',
},
};

axios.request(config)
.then((response) => {

  if (Array.isArray(response.data)) {
    if(response.data.length){
        
       
        const Exist_open_trade = response.data.find(item1 => item1.token === token[0].instrument_token && parseFloat(item1.Prc) == parseFloat(ExistExitSignal[0].entry_price)); 
       
        if(Exist_open_trade != undefined && Exist_open_trade.Status == "open"){



            const axios = require('axios');
            let data = JSON.stringify({
              "exch":item.postdata.exch,
              "nestOrderNumber": Exist_open_trade.Nstordno,
              "trading_symbol": Exist_open_trade.Trsym
            });
            
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/cancelOrder',
              headers: {
                'Authorization': 'Bearer ' + item.demat_userid + ' ' + item.access_token,
    
                'Content-Type': 'application/json',
            },
              data : data
            };
            
            axios.request(config)
            .then((response) => {
           
            })
            .catch((error) => {
              console.log(error);
            });
            


            
        }
        
        
    }
  }


//   {
//     Prc: '2.00',
//     RequestID: '1',
//     Cancelqty: 0,
//     discQtyPerc: 'NA',
//     customText: 'NA',
//     Mktpro: 'NA',
//     defmktproval: '',
//     optionType: 'CE',
//     usecs: 'NA',
//     mpro: '',
//     Qty: 15,
//     ordergenerationtype: '--',
//     Unfilledsize: 0,
//     orderAuthStatus: '',
//     Usercomments: 'NA',
//     ticksize: '0.05',
//     Prctype: 'L',
//     Status: 'open',
//     Minqty: 0,
//     orderCriteria: 'NA',
//     Exseg: 'nse_fo',
//     Sym: 'BANKNIFTY',
//     multiplier: '1',
//     ExchOrdID: '1600000031390394',
//     ExchConfrmtime: '24-May-2024 10:13:45',
//     Pcode: 'NRML',
//     SyomOrderId: '',
//     Dscqty: 0,
//     Exchange: 'NFO',
//     Ordvaldate: 'NA',
//     accountId: '438760',
//     exchangeuserinfo: 'NA',
//     Avgprc: '0.00',
//     Trgprc: '00.00',
//     Trantype: 'B',
//     bqty: '15',
//     Trsym: 'BANKNIFTY29MAY24C48700',
//     Fillshares: 0,
//     AlgoCategory: 'NA',
//     sipindicator: 'NA',
//     strikePrice: '48700',
//     reporttype: 'NA',
//     AlgoID: 'NA',
//     noMktPro: '',
//     BrokerClient: '--',
//     OrderUserMessage: '--',
//     decprec: 'NA',
//     ExpDate: '29 May, 2024',
//     COPercentage: 0,
//     marketprotectionpercentage: '--',
//     Nstordno: '24052400089584',
//     ExpSsbDate: 'NA',
//     OrderedTime: '24/05/2024 10:13:45',
//     RejReason: '--',
//     modifiedBy: '--',
//     Scripname: 'BANKNIFTY29MAY24C48700',
//     stat: 'Ok',
//     orderentrytime: 'May 24 2024 10:13:45',
//     PriceDenomenator: '1',
//     panNo: 'NA',
//     RefLmtPrice: 0,
//     PriceNumerator: '1',
//     token: '56651',
//     ordersource: 'NA',
//     Validity: 'DAY',
//     GeneralDenomenator: '1',
//     series: '',
//     InstName: 'OPTIDX',
//     GeneralNumerator: '1',
//     user: '438760',
//     remarks: '--',
//     iSinceBOE: 0
//   }
})
.catch((error) => {
  console.log(error);
});


  }
}
  

}


module.exports = { place_order }
