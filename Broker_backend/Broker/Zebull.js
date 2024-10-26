var axios = require('axios');
var qs = require('qs');
const fs = require('fs');
const db = require('../../BACKEND/App/Models');

const BrokerResponse = db.BrokerResponse;

const place_order = async (AllClientData, signals, token, filePath, signal_req) => {

    console.log("ZEBULL")

    try {

        var dt = signals.DTime;
        var input_symbol = signals.Symbol;
        var type = signals.TType.toUpperCase();
        var tr_price = signals.Tr_Price;
        var prc = signals.Price.toString()
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


                if (segment.toUpperCase() != "C") {

                    const requestPromises = AllClientData.map(async (item) => {

                        var exch_token;

                        if (segment == "C" || segment == "c") {
                            exch_token = "NSE"
                        } else {

                            if (segment == "CE" || segment == "CO") {
                                exch_token = "CDS"
                            }
                            else if (segment == "F" || segment == "O") {
                                exch_token = "NFO"
                            }
                            else if (segment == "MF" || segment == "MO") {
                                exch_token = "MCX"
                            }

                        }

                        var data = { "uid": item.client_code, "exch": exch_token, "token": token[0].instrument_token }
                        var raw = "jData=" + JSON.stringify(data) + "&jKey=" + item.access_token;

                        var config = {
                            method: 'post',
                            url: 'https://go.mynt.in/NorenWClientTP/GetQuotes',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            data: raw
                        };

                        axios(config)
                            .then(function (response) {

                                if (response.data.tsym) {

                                    item.postdata.tsym = response.data.tsym;


                                    if (type == 'LE' || type == 'SX') {
                                        item.postdata.trantype = 'B';
                                    } else if (type == 'SE' || type == 'LX') {
                                        item.postdata.trantype = 'S';
                                    }


                                    item.postdata.prc = prc


                                    EntryPlaceOrder(item, filePath, signals, signal_req);
                                }
                            })


                    });

                    // Send all requests concurrently using Promise.all
                    Promise.all(requestPromises)
                        .then(responses => { })
                        .catch(errors => {
                            console.log("errors:", errors);
                        });


                } else {


                    const requestPromises = AllClientData.map(async (item) => {

                        var exch_token;

                        if (segment == "C" || segment == "c") {
                            exch_token = "NSE"
                        } else {

                            if (segment == "CE" || segment == "CO") {
                                exch_token = "CDS"
                            }
                            else if (segment == "F" || segment == "O") {
                                exch_token = "NFO"
                            }
                            else if (segment == "MF" || segment == "MO") {
                                exch_token = "MCX"
                            }

                        }

                        var data = { "uid": item.client_code, "exch": exch_token, "token": token[0].instrument_token }
                        var raw = "jData=" + JSON.stringify(data) + "&jKey=" + item.access_token;

                        var config = {
                            method: 'post',
                            url: 'https://go.mynt.in/NorenWClientTP/GetQuotes',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            data: raw
                        };

                        axios(config)
                            .then(function (response) {

                                if (response.data.tsym) {
                                    item.postdata.tsym = response.data.tsym
                                    item.postdata.qty = Number(item.postdata.qty);

                                    if (type == 'LE' || type == 'SX') {
                                        item.postdata.trantype = 'B';
                                    } else if (type == 'SE' || type == 'LX') {
                                        item.postdata.trantype = 'S';
                                    }



                                    item.postdata.prc = prc


                                    EntryPlaceOrder(item, filePath, signals, signal_req);
                                }
                            })

                    });


                    Promise.all(requestPromises)
                        .then(responses => { })
                        .catch(errors => {
                            console.log("errors:", errors);
                        });


                }

            }

            else if (type == 'SX' || type == 'LX') {


                const requestPromises = AllClientData.map(async (item) => {

                    var exch_token;

                    if (segment == "C" || segment == "c") {
                        exch_token = "NSE"
                    } else {

                        if (segment == "CE" || segment == "CO") {
                            exch_token = "CDS"
                        }
                        else if (segment == "F" || segment == "O") {
                            exch_token = "NFO"
                        }
                        else if (segment == "MF" || segment == "MO") {
                            exch_token = "MCX"
                        }

                    }

                    var data = { "uid": item.client_code, "exch": exch_token, "token": token[0].instrument_token }
                    var raw = "jData=" + JSON.stringify(data) + "&jKey=" + item.access_token;

                    var config = {
                        method: 'post',
                        url: 'https://go.mynt.in/NorenWClientTP/GetQuotes',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        data: raw
                    };

                    axios(config)
                        .then(function (response1) {

                            if (response1.data.tsym) {


                                item.postdata.tsym = response1.data.tsym



                                if (type == 'LE' || type == 'SX') {
                                    item.postdata.trantype = 'B';
                                } else if (type == 'SE' || type == 'LX') {
                                    item.postdata.trantype = 'S';
                                }



                                item.postdata.prc = prc




                                var send_rr = Buffer.from(qs.stringify(item.postdata)).toString('base64');

                                var data = { uid: item.client_code, actid: item.client_code, ret: "NET" }

                                var raw = "jData=" + JSON.stringify(data) + "&jKey=" + item.access_token;

                                var config = {
                                    method: 'post',
                                    url: 'https://go.mynt.in/NorenWClientTP/PositionBook',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    data: raw
                                };
                                axios(config)
                                    .then(async (response) => {

                                        if (response.data.stat == "Ok") {

                                            fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull POSITION DATA - ' + item.UserName + ' LENGTH = ' + JSON.stringify(response.data) + '\n', function (err) {
                                                if (err) { }
                                            });
                                            if (response.data.data.length > 0) {

                                                const Exist_entry_order = response.data.data.find(item1 => item1.tsym === response1.data.tsym);

                                                if (Exist_entry_order != undefined) {

                                                    const possition_qty = parseInt(Exist_entry_order.daybuyqty) -parseInt(Exist_entry_order.daysellqty)


                                                    if (possition_qty == 0) {
                                                        BrokerResponse.create({
                                                            user_id: item._id,
                                                            receive_signal: signal_req,
                                                            strategy: strategy,
                                                            type: type,
                                                            symbol: input_symbol,
                                                            order_status: "Entry Not Exist",
                                                            reject_reason: "This Script position Empty ",
                                                            broker_name: "Zebull",
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
                                                        broker_name: "Zebull",
                                                        send_request: send_rr,
                                                        reject_reason: "position Not Exist",

                                                    })
                                                        .then((BrokerResponseCreate) => { })
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
                                                    broker_name: "Zebull",
                                                    send_request: send_rr,
                                                    reject_reason: "All position Empty",

                                                })
                                                    .then((BrokerResponseCreate) => { })
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
                                                order_status: response.data.stat,
                                                order_id: '',
                                                trading_symbol: "",
                                                broker_name: "Zebull",
                                                send_request: send_rr,
                                                reject_reason: "All position Empty "+response.data.emsg,

                                            })
                                                .then((BrokerResponseCreate) => { })
                                                .catch((err) => {
                                                    try {
                                                        console.log('Error creating and saving user:', err);
                                                    } catch (e) {
                                                        
                                                    }

                                                });

                                        }




                                    })
                                    .catch(async (error) => {

                                        console.log("error op", error.response.data)
                                        fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull POSITION DATA ERROR CATCH - ' + item.UserName + ' ERROR - ' + JSON.stringify(error) + '\n', function (err) {
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
                                                broker_name: "Zebull",
                                                send_request: send_rr,
                                                reject_reason: message,

                                            })
                                                .then((BrokerResponseCreate) => { })
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
                                                broker_name: "Zebull",
                                                send_request: send_rr,
                                                reject_reason: message,

                                            })
                                                .then((BrokerResponseCreate) => { })
                                                .catch((err) => {
                                                    try {
                                                        console.log('Error creating and saving user:', err);
                                                    } catch (e) {
                                                        
                                                    }

                                                });


                                        }
                                    });
                            }
                        })


                });
                // Send all requests concurrently using Promise.all
                Promise.all(requestPromises)
                    .then(responses => { })
                    .catch(errors => {
                        console.log("errors--", errors.response.data);

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
                    broker_name: "Zebull",
                    send_request: "",
                    reject_reason: "Token not received due to wrong trade",

                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });

            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
                .then(responses => { })
                .catch(errors => {
                    console.log("errors:", errors);

                });
        }

    } catch (error) {

        console.log("error -----", error);
    }

}

const EntryPlaceOrder = async (item, filePath, signals, signal_req) => {

    var dt = signals.DTime;
    var input_symbol = signals.Symbol;
    var type = signals.TType.toUpperCase();
    var tr_price = signals.Tr_Price;
    var prc = signals.Price.toString()
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


    fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull BEFORE PLACE ORDER USER ENTRY- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    var raw = "jData=" + JSON.stringify(item.postdata) + "&jKey=" + item.access_token;
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://go.mynt.in/NorenWClientTP/PlaceOrder',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: raw

    };


    axios(config)
        .then(async (response) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull AFTER PLACE ORDER USER ENTRY - ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            if (response.data.stat == "Ok") {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.stat,
                    order_id: response.data.norenordno,
                    trading_symbol: "",
                    broker_name: "Zebull",
                    send_request: send_rr,


                })
                    .then((BrokerResponseCreate) => { })
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
                    order_status: response.data.stat,
                    order_id: response.data.norenordno,
                    trading_symbol: "",
                    broker_name: "Zebull",
                    send_request: send_rr,
                    reject_reason: message,

                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });

            }


        })
        .catch(async (error) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull AFTER PLACE ORDER CATCH ENTRY - ' + item.UserName + ' ERROR -' + JSON.stringify(error) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



            try {
                console.log("error", error.response.data)

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
                            broker_name: "Zebull",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => { })
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
                            broker_name: "Zebull",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => { })
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
    var prc = signals.Price.toString()
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

    fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull BEFORE PLACE ORDER USER EXIT- ' + item.UserName + ' REQUEST -' + JSON.stringify(item.postdata) + '\n', function (err) {
        if (err) {
            return console.log(err);
        }
    });

    var raw = "jData=" + JSON.stringify(item.postdata) + "&jKey=" + item.access_token;
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://go.mynt.in/NorenWClientTP/PlaceOrder',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: raw

    };

    axios(config)
        .then(async (response) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull AFTER PLACE ORDER USER EXIT- ' + item.UserName + ' RESPONSE -' + JSON.stringify(response.data) + '\n', function (err) {
                if (err) {
                    return console.log(err);
                }
            });



            if (response.data.stat == "Ok") {

                BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: response.data.stat,
                    order_id: response.data.norenordno,
                    trading_symbol: "",
                    broker_name: "Zebull",
                    send_request: send_rr,


                })
                    .then((BrokerResponseCreate) => { })
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
                    order_status: response.data.stat,
                    order_id: response.data.norenordno,
                    trading_symbol: "",
                    broker_name: "Zebull",
                    send_request: send_rr,
                    reject_reason: message,

                })
                    .then((BrokerResponseCreate) => { })
                    .catch((err) => {
                        try {
                            console.log('Error creating and saving user:', err);
                        } catch (e) {
                            
                        }

                    });

            }


        })
        .catch(async (error) => {

            fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull AFTER PLACE ORDER USER EXIT CATCH- ' + item.UserName + ' RESPONSE -' + JSON.stringify(error) + '\n', function (err) {
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
                            broker_name: "Zebull",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => { })
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
                            broker_name: "Zebull",
                            send_request: send_rr,
                            reject_reason: message,
                        })
                            .then((BrokerResponseCreate) => { })
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
