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
var sha256 = require("crypto-js/sha256");

const place_order = async (AllClientData, signals, token, filePath, signal_req, ExistExitSignal) => {
    try {
        var input_symbol = signals.Symbol;
        var type = signals.TType.toUpperCase();
        var segment = signals.Segment.toUpperCase();
        var option_type = signals.OType;
        var strategy = signals.Strategy;
        

        if (token != 0) {

            const pattern = token[0].instrument_token;
            var filePath_token = "";
            let command = '';

            if (segment && segment.toLowerCase() === 'c') {
                filePath_token = '/iciciinstrument/NSEScripMaster.txt';
                const filePath1 = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);
                command = `grep -E ".*(${pattern}).*" ${filePath1}`;
            } else if (segment && (segment.toLowerCase() === 'o' || segment.toLowerCase() === 'fo')) {
                filePath_token = '/iciciinstrument/FONSEScripMaster.txt';
                const filePath1 = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);
                var optionType = option_type.toLowerCase() == "put" ? "PE" : "CE";
                command = `grep -E ".*(${pattern}).*.*(OPTION).*.*(${optionType}).*" ${filePath1}`;
            } else if (segment && segment.toLowerCase() === 'f') {
                filePath_token = '/iciciinstrument/FONSEScripMaster.txt';
                const filePath1 = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);
                command = `grep -E ".*(${pattern}).*.*(FUTURE).*" ${filePath1}`;
            } else if (segment && segment.toLowerCase() === 'cf') {
                filePath_token = '/iciciinstrument/CDNSEScripMaster.txt';
                const filePath1 = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);
                command = `grep -E ".*(${pattern}).*.*(FUTURE).*" ${filePath1}`;
            } else if (segment && segment.toLowerCase() === 'co') {
                filePath_token = '/iciciinstrument/CDNSEScripMaster.txt';
                const filePath1 = path.join(__dirname, '..', 'AllInstrumentToken', filePath_token);
                var optionType = option_type.toLowerCase() == "put" ? "PE" : "CE";
                command = `grep -E ".*(${pattern}).*.*(OPTION).*.*(${optionType}).*" ${filePath1}`;
            } else {
                console.log('Invalid segment value');
            }


            exec(command, (error, stdout, stderr) => {

                if (error) {
                    console.log(`exec error: ${error}`);

                }

                if (stdout) {
                    const parts = stdout.split(',');

                    let ShortName;
                    let ExpiryDate
                    let StrikePrice
                    let Rights

                    if (segment.toLowerCase() === 'c') {
                        ShortName = parts[1];
                        ExpiryDate = parts[4];
                        StrikePrice = parts[5];
                        Rights = parts[6];
                    } else {
                        ShortName = parts[2];
                        ExpiryDate = parts[4];
                        StrikePrice = parts[5];
                        Rights = parts[6];

                    }

                    const stock_code = ShortName.replace(/"/g, '').trim();
                    const expiry_date = ExpiryDate.replace(/"/g, '').trim();
                    const strike_price = StrikePrice.replace(/"/g, '').trim();
                    const rightSplit = Rights.replace(/"/g, '').trim();


                    let right;

                    if (rightSplit.includes('PE')) {
                        right = 'put';
                    } else if (rightSplit.includes('CE')) {
                        right = 'call';
                    } else {
                        right = 'others';
                    }

                    function convertToISO8601(dateString) {
                        // Define a mapping from month abbreviation to month number
                        const months = {
                            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                        };

                        // Extract the day, month, and year from the input string
                        const [day, monthAbbr, year] = dateString.split('-');

                        // Create a new Date object using the extracted values
                        const date = new Date(year, months[monthAbbr], day);

                        // Convert the Date object to ISO 8601 format
                        return date.toISOString();
                    }



                    if (type == 'LE' || type == 'SE') {

                        const requestPromises = AllClientData.map(async (item) => {

                            if (segment.toLowerCase() != 'c') {
                                item.postdata.expiry_date = expiry_date ? convertToISO8601(expiry_date) : ""

                            }

                            item.postdata.stock_code = stock_code
                            item.postdata.strike_price = strike_price;
                            item.postdata.right = right;


                            if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                                item.postdata.price = price
                            }

                        

                            EntryPlaceOrder(item, filePath, signals, signal_req)
                        });

                        Promise.all(requestPromises)
                            .then(responses => { })
                            .catch(errors => {
                                console.log("errors:", errors);
                            });


                    }

                    else if (type == 'SX' || type == 'LX') {
  
                        const requestPromises = AllClientData.map(async (item) => {

                            if (segment.toLowerCase() === 'c') {
                                item.postdata.expiry_date = expiry_date ? convertToISO8601(expiry_date) : ""

                            }

                            item.postdata.stock_code = stock_code
                            item.postdata.strike_price = strike_price;
                            item.postdata.right = right;


                            if (item.client_services.order_type == "2" || item.client_services.order_type == "3") {
                                item.postdata.price = price
                            }


                            if (type == 'LE' || type == 'SX') {
                                item.postdata.action = 'buy';
                            } else if (type == 'SE' || type == 'LX') {
                                item.postdata.action = 'sell';
                            }
                            var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');




                            var dataForPositions = {}

                            var currentDateGetPositions = new Date().toISOString().split(".")[0] + '.000Z';
                            let checksumcodeGetPositions = sha256(currentDateGetPositions + JSON.stringify(dataForPositions) + item.api_secret);

                            var config = {
                                method: 'get',
                                url: 'https://api.icicidirect.com/breezeapi/api/v1/portfoliopositions',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Checksum': "token " + checksumcodeGetPositions,
                                    'X-Timestamp': currentDateGetPositions,
                                    'X-AppKey': item.api_key,
                                    'X-SessionToken': item.access_token,
                                },
                                data: dataForPositions
                            };
                            axios(config)
                                .then(async (response) => {

                                    fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data) + '\n', function (err) {
                                        if (err) { }
                                    });


                                    if (response.data.Success != null) {


                                        var Exist_entry_order

                                        if (segment.toUpperCase() == 'C') {
                                            Exist_entry_order = response.data.Success.find(item1 => item1.exchange_code === item.exchange_code);
                                        } else {
                                            Exist_entry_order = response.data.Success.find(item1 => item1.exchange_code === item.exchange_code && item1.product_type.toLowerCase() == product || convertToISO8601(item1.expiry_date) == convertToISO8601(expiry_date));

                                        }



                                        if (Exist_entry_order != undefined) {


                                            if (segment.toUpperCase() == 'C') {

                                                const possition_qty = Exist_entry_order.quantity
                                                if (possition_qty == 0) {

                                                    BrokerResponse.create({
                                                        user_id: item._id,
                                                        receive_signal: signal_req,
                                                        strategy: strategy,
                                                        type: type,
                                                        symbol: input_symbol,
                                                        order_status: "Entry Not Exist",
                                                        reject_reason: "This Script position Empty ",
                                                        broker_name: "ICICI",
                                                        send_request: send_rr,
                                                        open_possition_qty: possition_qty,

                                                    })
                                                        .then((BrokerResponseCreate) => { })
                                                        .catch((err) => {
                                                            try {
                                                                console.log('Error creating and saving user:', err);
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


                                                const possition_qty = Exist_entry_order.quantity;

                                                if (possition_qty == 0) {
                                                    BrokerResponse.create({
                                                        user_id: item._id,
                                                        receive_signal: signal_req,
                                                        strategy: strategy,
                                                        type: type,
                                                        symbol: input_symbol,
                                                        order_status: "Entry Not Exist",
                                                        reject_reason: "This Script position Empty ",
                                                        broker_name: "ICICI",
                                                        send_request: send_rr,
                                                        open_possition_qty: possition_qty,

                                                    })
                                                        .then((BrokerResponseCreate) => { })
                                                        .catch((err) => {
                                                            try {
                                                                console.log('Error creating and saving user:', err);
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
                                                broker_name: "ICICI",
                                                send_request: send_rr,
                                                reject_reason: "position Not Exist",

                                            })
                                                .then((BrokerResponseCreate) => { })
                                                .catch((err) => {
                                                    try {
                                                        console.log('Error creating and saving user:', err);
                                                    } catch (e) {
                                                        console.log("duplicate key")
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
                                            broker_name: "ICICI",
                                            send_request: send_rr,
                                            reject_reason: "All position Empty",

                                        })
                                            .then((BrokerResponseCreate) => { })
                                            .catch((err) => {
                                                try {
                                                    console.log('Error creating and saving user:', err);
                                                } catch (e) {
                                                    console.log("duplicate key")
                                                }

                                            });


                                    }
                                })
                                .catch(async (error) => {

                                    fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI POSITION DATA ERROR CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
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
                                            broker_name: "ICICI",
                                            send_request: send_rr,
                                            reject_reason: message,

                                        })
                                            .then((BrokerResponseCreate) => { })
                                            .catch((err) => {
                                                try {
                                                    console.log('Error creating and saving user:', err);
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
                                            broker_name: "ICICI",
                                            send_request: send_rr,
                                            reject_reason: message,

                                        })
                                            .then((BrokerResponseCreate) => { })
                                            .catch((err) => {
                                                try {
                                                    console.log('Error creating and saving user:', err);
                                                } catch (e) {
                                                    console.log("duplicate key")
                                                }

                                            });

                                    }
                                });






                        });

                        Promise.all(requestPromises)
                            .then(responses => { })
                            .catch(errors => {
                                console.log("errors:", errors);

                            });

                    }

                }


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
                    broker_name: "ICICI",
                    send_request: "",
                    reject_reason: "Token not received due to wrong trade",

                })
                    .then((BrokerResponseCreate) => {
                        
                    })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            console.log("duplicate key")
                        }

                    });

            });
            Promise.all(requestPromises)
                .then(responses => {
                    // console.log("Response:", responses.data);

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

   
    var input_symbol = signals.Symbol;
    var type = signals.TType.toUpperCase();
    var strategy = signals.Strategy;
    
    var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');


    fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI BEFORE PLACE ORDER USER ENTRY- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });


    var currentDateOrder = new Date().toISOString().split(".")[0] + '.000Z';
    let checksumcode = sha256(currentDateOrder + JSON.stringify(item.postdata) + item.api_secret);


    let config = {
        method: 'post',
        url: 'https://api.icicidirect.com/breezeapi/api/v1/order',
        headers: {
            'Content-Type': 'application/json',
            'X-Checksum': "token " + checksumcode,
            'X-Timestamp': currentDateOrder,
            'X-AppKey': item.api_key,
            'X-SessionToken': item.access_token,
        },
        data: item.postdata
    };

    console.log(config);
    axios(config)
        .then(async (response) => {
            console.log("respose ENTRY", response.data)

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI AFTER PLACE ORDER USER ENTRY - ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            if (response.data.Success != null) {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.Success.message,
                    order_id: response.data.Success.order_id,
                    trading_symbol: "",
                    broker_name: "ICICI",
                    send_request: send_rr
                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
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
                    order_status: response.data.Error,
                    order_id: "",
                    trading_symbol: "",
                    broker_name: "ICICI",
                    send_request: send_rr,
                    reject_reason: message,

                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            console.log("duplicate key")
                        }

                    });

            }


        })
        .catch(async (error) => {
            fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI AFTER PLACE ORDER CATCH ENTRY - ' + item.UserName + ' ERROR -' + JSON.stringify(error) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            console.log("ICICI_DIRECT Erroe", error.response.data);

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
                            broker_name: "ICICI",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => { })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
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
                            broker_name: "ICICI",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {
                                
                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
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

   
    var input_symbol = signals.Symbol;
    var type = signals.TType.toUpperCase();
    

    
    
    
    var segment = signals.Segment.toUpperCase();
    
    
    var option_type = signals.OType;
    
    var strategy = signals.Strategy;
    
    
    

    var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');

    fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI BEFORE PLACE ORDER USER EXIT- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    var currentDateOrder = new Date().toISOString().split(".")[0] + '.000Z';
    let checksumcode = sha256(currentDateOrder + JSON.stringify(item.postdata) + item.api_secret);


    let config = {
        method: 'post',
        url: 'https://api.icicidirect.com/breezeapi/api/v1/order',
        headers: {
            'Content-Type': 'application/json',
            'X-Checksum': "token " + checksumcode,
            'X-Timestamp': currentDateOrder,
            'X-AppKey': item.api_key,
            'X-SessionToken': item.access_token,
        },
        data: item.postdata
    };

    axios(config)
        .then(async (response) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI AFTER PLACE ORDER USER EXIT- ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



            if (response.data.Success != null) {
                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.Success.message,
                    order_id: response.data.Success.order_id,
                    trading_symbol: "",
                    broker_name: "ICICI",
                    send_request: send_rr,
                    open_possition_qty: possition_qty,

                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
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
                    broker_name: "ICICI",
                    send_request: send_rr,
                    reject_reason: message,

                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            console.log("duplicate key")
                        }

                    });

            }


        })
        .catch(async (error) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI AFTER PLACE ORDER USER EXIT CATCH- ' + item.UserName + ' RESPONSE -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "ICICI",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {
                                
                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
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
                            broker_name: "ICICI",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => {
                                
                            })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
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
