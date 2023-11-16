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

        if(token != 0){

        const pattern = token[0].instrument_token
        var filePath_token = "/Zerodha/Zerodha.csv"
        var tradingsymbol;
        const filePath1 = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);

     // const command = `grep ,${pattern}, ${filePath}`;

     //const command = `grep -E ".*(${pattern}).*.*(${input_symbol}).*" ${filePath1}`;
     
       //  const command = `grep -E ".*(${pattern}).*.*(${input_symbol}).*" ${filePath1}`;

         const command = `findstr ,${pattern}, ${filePath1}`;


        console.log("command ", command)



        try {

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }

        const parts = stdout.split(','); // Extract the content inside double quotes

      // console.log("Extracted Part:", parts);

        if (segment && segment.toLowerCase() === 'c') {

            tradingsymbol = token[0].instrument_token

        } else if (segment && (segment.toLowerCase() === 'f' || segment.toLowerCase() === 'o')) {

            tradingsymbol = parts[2];

        } else if (segment && (segment.toLowerCase() === 'cf' || segment.toLowerCase() === 'co')) {

            tradingsymbol = parts[8];

        } else if (segment && (segment.toLowerCase() === 'mf' || segment.toLowerCase() === 'mo')) {

            tradingsymbol = parts[8];

        } else {
            console.error('Invalid segment value');
            return;
        }


        if (type == 'LE' || type == 'SE') {
            // console.log("trade entry")


            const requestPromises = AllClientData.map(async (item) => {

                    if (segment.toUpperCase() != "C") {
                       item.postdata.tradingsymbol = tradingsymbol;
                    } 

                     
                    if (type == 'LE' || type == 'SX') {
                        item.postdata.transaction_type = 'BUY';
                    } else if (type == 'SE' || type == 'LX') {
                        item.postdata.transaction_type = 'SELL';
                    }

                    // console.log("price", price)


                    if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                        item.postdata.price = price
                    }

                    EntryPlaceOrder(item, filePath, signals, signal_req)

                

            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
                .then(responses => {
                    // console.log("Response:", responses.data);

                })
                .catch(errors => {
                    console.log("errors:", errors);

                });

        } else if (type == 'SX' || type == 'LX') {
            const requestPromises = AllClientData.map(async (item) => {

                    // console.log("user id ", item.demat_userid)
                    // console.log("postdata before", item.postdata)

                    if (segment.toUpperCase() != "C") {
                        item.postdata.tradingsymbol = tradingsymbol;
                     } 
 
                      
                     if (type == 'LE' || type == 'SX') {
                         item.postdata.transaction_type = 'BUY';
                     } else if (type == 'SE' || type == 'LX') {
                         item.postdata.transaction_type = 'SELL';
                     }
 
                     // console.log("price", price)
 
 
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
                            // console.log("response", response.data)
                            fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data.length) + '\n', function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });


                            if (response.data.length > 0) {

                                const Exist_entry_order = response.data.body.NetPositionDetail.find(item1 => item1.Token === token[0].instrument_token && item1.Pcode == item.postdata.pCode);

                                if(Exist_entry_order != undefined){
                                    if (segment.toUpperCase() == 'C') {

                                        const possition_qty = parseInt(Exist_entry_order.Bqty) - parseInt(Exist_entry_order.Sqty);
                                        // console.log("possition_qty Cash", possition_qty);
                                        if (possition_qty == 0) {
                                            // console.log("possition_qty Not Available", possition_qty);
                                            BrokerResponse.create({
                                                user_id: item._id,
                                                receive_signal: signal_req,
                                                strategy: strategy,
                                                type: type,
                                                symbol: input_symbol,
                                                order_status: "Entry Not Exist",
                                                reject_reason: "This Script position Empty ",
                                                broker_name: "ZERODHA",
                                                send_request: send_rr,
                                                open_possition_qty: possition_qty,

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


                                        } else {

                                            console.log("possition_qty Cash trade", possition_qty);
                                            if (possition_qty > 0 && type == 'LX') {
                                                ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                            } else if (possition_qty < 0 && type == 'SX') {
                                                ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                            }
                                        }


                                    } else {
                                        const possition_qty = Exist_entry_order.Netqty;
                                        // console.log("possition_qty", possition_qty);

                                        if (possition_qty == 0) {
                                            // console.log("possition_qty Not Available", possition_qty);
                                            BrokerResponse.create({
                                                user_id: item._id,
                                                receive_signal: signal_req,
                                                strategy: strategy,
                                                type: type,
                                                symbol: input_symbol,
                                                order_status: "Entry Not Exist",
                                                reject_reason: "This Script position Empty ",
                                                broker_name: "ZERODHA",
                                                send_request: send_rr,
                                                open_possition_qty: possition_qty,

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


                                        } else {

                                            if (possition_qty > 0 && type == 'LX') {
                                                ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                            } else if (possition_qty < 0 && type == 'SX') {
                                                ExitPlaceOrder(item, filePath, possition_qty, signals, signal_req)
                                            }

                                        }

                                    }
                                }else{

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
                                    broker_name: "ZERODHA",
                                    send_request: send_rr,
                                    reject_reason: "All position Empty",

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

                            fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA POSITION DATA ERROR CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
                                if (err) {
                                    return console.log(err);
                                }
                            });

                            if (error.response) {
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
                                    broker_name: "ZERODHA",
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
                                    broker_name: "ZERODHA",
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
                        });






                

            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
                .then(responses => {
                    // console.log("Response:", responses.data);

                })
                .catch(errors => {
                    console.log("errors:", errors);

                });

        }

            });

        } catch (error) {
            console.log(error);
        }
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
            broker_name: "ZERODHA",
            send_request: send_rr,
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


    } catch (error) {

        console.log("error", error);
    }

}

const EntryPlaceOrder = async (item, filePath, signals, signal_req) => {

    // var dt = splitArray[0]
    // var input_symbol = splitArray[1]
    // var type = splitArray[2]
    // var tr_price = splitArray[3]
    // var price = splitArray[4]
    // var sq_value = splitArray[5]
    // var sl_value = splitArray[6]
    // var tsl = splitArray[7]
    // var segment = splitArray[8]
    // var strike = splitArray[9]
    // var option_type = splitArray[10]
    // var expiry = splitArray[11]
    // var strategy = splitArray[12]
    // var qty_percent = splitArray[13]
    // var client_key = splitArray[14]
    // var demo = splitArray[15]

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

    console.log("item.postdata -",item.postdata)


   const data = 'tradingsymbol=' + item.postdata.tradingsymbol + '&exchange=' + item.postdata.exchange + '&transaction_type=' + item.postdata.transaction_type + '&quantity=' + item.postdata.quantity + '&order_type=' + item.postdata.order_type + '&product=' + item.postdata.product + '&price=' + item.postdata.price + '&trigger_price=' + item.postdata.trigger_price + '&validity=' + item.postdata.validity;

    console.log("data request ",data)

    return
    

    var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');


    fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA BEFORE PLACE ORDER USER ENTRY- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
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
            // console.log("respose ENTRY", response.data)
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA AFTER PLACE ORDER USER ENTRY - ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
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
                    broker_name: "ZERODHA",
                    send_request: send_rr,


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
                    broker_name: "ZERODHA",
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
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA AFTER PLACE ORDER CATCH ENTRY - ' + item.UserName + ' ERROR -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "ZERODHA",
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
                            broker_name: "ZERODHA",
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
                }

            } catch (e) {
                console.log("error 1", e);
            }

        });



}

const ExitPlaceOrder = async (item, filePath, possition_qty, signals, signal_req) => {

    // console.log("INSIDE EXIT FUNCTION")
    // console.log("INSIDE EXIT FUNCTION possition_qty",possition_qty)

    // var dt = splitArray[0]
    // var input_symbol = splitArray[1]
    // var type = splitArray[2]
    // var tr_price = splitArray[3]
    // var price = splitArray[4]
    // var sq_value = splitArray[5]
    // var sl_value = splitArray[6]
    // var tsl = splitArray[7]
    // var segment = splitArray[8]
    // var strike = splitArray[9]
    // var option_type = splitArray[10]
    // var expiry = splitArray[11]
    // var strategy = splitArray[12]
    // var qty_percent = splitArray[13]
    // var client_key = splitArray[14]
    // var demo = splitArray[15]

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

    fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA BEFORE PLACE ORDER USER EXIT- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
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
            // console.log("respose Exit", response.data)

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA AFTER PLACE ORDER USER EXIT- ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
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
                    broker_name: "ZERODHA",
                    send_request: send_rr,
                    open_possition_qty: possition_qty,

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
                    broker_name: "ZERODHA",
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

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ZERODHA AFTER PLACE ORDER USER EXIT CATCH- ' + item.UserName + ' RESPONSE -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "ZERODHA",
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
                            broker_name: "ZERODHA",
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
                }

            } catch (e) {
                console.log("error 1", e);
            }

        });


}


module.exports = { place_order }
