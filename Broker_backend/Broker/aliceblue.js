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
const place_order = async (item, splitArray, bro_res_last_id, token) => {

    try {
        console.log("ALICE BLUE BROKER");

        if (token != undefined) {

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

            var exch;
            if (segment == 'C' || segment == 'c') {
                exch = "NSE";
            } else if (segment == 'F' || segment == 'f' || segment == 'O' || segment == 'o' || segment == 'FO' || segment == 'fo') {
                exch = "NFO";
            } else if (segment == 'MF' || segment == 'mf' || segment == 'MO' || segment == 'mo') {
                exch = "MCX";
            }
            else if (segment == 'CF' || segment == 'cf' || segment == 'CO' || segment == 'co') {
                exch = "CDS";
            }


            var transtype;
            if (type == 'LE' || type == 'SX') {
                transtype = 'BUY';
            } else if (type == 'SE' || type == 'LX') {
                transtype = 'SELL';
            }



            var complexty
            var discqty = "0";
            var pCode;
            var prctyp;
            var price = "0";
            var qty = item.client_services.quantity;
            var ret = "DAY";
            var stopLoss = "";
            var symbol_id = token[0].instrument_token
            var target = "0";
            var trading_symbol;

            trading_symbol = "";
            var trailing_stop_loss = "0";
            var trigPrice = "";


            if (segment == 'C' || segment == 'c') {
                trading_symbol = token[0].zebu_token;
            }


            if (segment == 'O' || segment == 'o' || segment == 'F' || segment == 'f') {
                trading_symbol = token[0].tradesymbol_m_w;
            }

            try {

                var signal_sy = "[symbol : " + input_symbol + " , Expiry : " + expiry + " , TradeSymbol : " + trading_symbol + " , Token : " + token[0].instrument_token + "]";
                var signal_req_sy = Buffer.from(JSON.stringify(signal_sy)).toString('base64');

                let result = await BrokerResponse.findByIdAndUpdate(
                    bro_res_last_id,
                    {
                        broker_name: "Alice Blue",
                        signal: signal_req_sy,
                        trading_symbol: trading_symbol == "" ? "" : trading_symbol
                    },
                    { new: true }
                )


            } catch (e) {

            }




            if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '1' && item.client_services.product_type == '1') {

                prctyp = 'MKT';
                pCode = 'CNC';
                complexty = "regular";

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '1' && item.client_services.product_type == '1') {
                prctyp = 'MKT';
                pCode = 'CNC';
                complexty = "regular";
            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '2' && item.client_services.product_type == '1') {
                prctyp = 'L';
                price = price;
                pCode = 'CNC';
                complexty = "regular";

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '2' && item.client_services.product_type == '1') {
                prctyp = 'L';
                price = price;
                pCode = 'CNC';
                complexty = "regular";

            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '3' && item.client_services.product_type == '1') {
                prctyp = 'SL';
                price = price;
                pCode = 'CNC';
                trigPrice = tr_price;
                complexty = "regular";

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '3' && item.client_services.product_type == '1') {
                prctyp = 'SL';
                price = price;
                pCode = 'CNC';
                trigPrice = tr_price;
                complexty = "regular";

            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '4' && item.client_services.product_type == '1') {

                prctyp = 'SL-M';
                price = price;
                pCode = 'CNC';
                trigPrice = tr_price;
                complexty = "regular";
            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '4' && item.client_services.product_type == '1') {

                prctyp = 'SL-M';
                price = price;
                pCode = 'CNC';
                trigPrice = tr_price;
                complexty = "regular";
            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '1' && item.client_services.product_type == '2') {
                prctyp = 'MKT';
                pCode = 'MIS';
                complexty = "regular";

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '1' && item.client_services.product_type == '2') {
                prctyp = 'MKT';
                pCode = 'MIS';
                complexty = "regular";

            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '2' && item.client_services.product_type == '2') {

                prctyp = 'L';
                price = price;
                pCode = 'MIS';
                complexty = "regular";
            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '2' && item.client_services.product_type == '2') {

                prctyp = 'L';
                price = price;
                pCode = 'MIS';
                complexty = "regular";
            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '3' && item.client_services.product_type == '2') {
                prctyp = 'SL';
                price = price;
                pCode = 'MIS';
                trigPrice = tr_price;
                complexty = "regular";

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '3' && item.client_services.product_type == '2') {
                prctyp = 'SL';
                price = price;
                pCode = 'MIS';
                trigPrice = tr_price;
                complexty = "regular";

            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '4' && item.client_services.product_type == '2') {

                prctyp = 'SL-M';
                price = price;
                pCode = 'MIS';
                trigPrice = tr_price;
                complexty = "regular";

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '4' && item.client_services.product_type == '2') {

                prctyp = 'SL-M';
                price = price;
                pCode = 'MIS';
                trigPrice = tr_price;
                complexty = "regular";

            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '1' && item.client_services.product_type == '4') {
                prctyp = 'MKT';
                pCode = 'CO';
                complexty = "co";
            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '1' && item.client_services.product_type == '4') {
                prctyp = 'MKT';
                pCode = 'CO';
                complexty = "co";
            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '2' && item.client_services.product_type == '4') {
                prctyp = 'L';
                pCode = 'CO';
                price = price;
                trigPrice = tr_price;
                complexty = "co";
            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '2' && item.client_services.product_type == '4') {
                prctyp = 'L';
                pCode = 'CO';
                price = price;
                trigPrice = tr_price;
                complexty = "co";
            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '2' && item.client_services.product_type == '3') {

                // console.log('order BO')
                prctyp = 'L';
                price = price;
                pCode = 'MIS';
                complexty = 'bo';
                stopLoss = sl_value;
                target = sq_value;
                trailing_stop_loss = tsl;
            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '2' && item.client_services.product_type == '3') {
                prctyp = 'L';
                price = price;
                pCode = 'MIS';
                complexty = 'bo';
                stopLoss = sl_value;
                target = sq_value;
                trailing_stop_loss = tsl;
            }
            else if ((type == 'LE' || type == 'SX') && item.client_services.order_type == '3' && item.client_services.product_type == '3') {

                prctyp = 'SL';
                price = price;
                pCode = 'MIS';
                complexty = 'bo';
                trigPrice = tr_price;
                stopLoss = sl_value;
                target = sq_value;
                trailing_stop_loss = tsl;

            }
            else if ((type == 'LX' || type == 'SE') && item.client_services.order_type == '3' && item.client_services.product_type == '3') {

                prctyp = 'SL';
                price = price;
                pCode = 'MIS';
                complexty = 'bo';
                trigPrice = tr_price;
                stopLoss = sl_value;
                target = sq_value;
                trailing_stop_loss = tsl;

            }


            if (item.client_services.product_type == '1') {
                if (segment == 'F' || segment == 'f' || segment == 'O' || segment == 'o' || segment == 'FO' || segment == 'fo') {
                    pCode = "NRML";
                }
            }



            if (type == 'LE' || type == 'SE') {
                let data;


                if (item.client_services.product_type == '3') {
                    data = {
                        "complexty": complexty,
                        "discqty": discqty,
                        "exch": exch,
                        "pCode": pCode,
                        "prctyp": prctyp,
                        "price": price,
                        "qty": qty,
                        "ret": ret,
                        "stopLoss": stopLoss,
                        "symbol_id": symbol_id,
                        "target": target,
                        "trading_symbol": trading_symbol,
                        "trailing_stop_loss": trailing_stop_loss,
                        "transtype": transtype,
                        "trigPrice": trigPrice
                    };
                } else {
                    data = {
                        "complexty": complexty,
                        "discqty": "0",
                        "exch": exch,
                        "pCode": pCode,
                        "prctyp": prctyp,
                        "price": price,
                        "qty": qty,
                        "ret": ret,
                        "stopLoss": stopLoss,
                        "symbol_id": symbol_id,
                        "trading_symbol": trading_symbol,
                        "trailing_stop_loss": trailing_stop_loss,
                        "transtype": transtype,
                        "trigPrice": trigPrice
                    };
                }


                try {

                    if (data !== undefined) {
                        var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                            headers: {
                                'Authorization': "Bearer " + item.client_code + " " + item.access_token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify([data])

                        };


                        axios(config)
                            .then(async (response) => {


                                if (response.data[0].stat == "Ok") {

                                    let result = await BrokerResponse.findByIdAndUpdate(
                                        bro_res_last_id,
                                        {
                                            symbol: input_symbol,
                                            send_request: send_rr,
                                            order_id: response.data[0].NOrdNo,
                                            order_status: response.data[0].stat
                                        },
                                        { new: true }
                                    )

                                } else {

                                    const message = (JSON.stringify(response.data)).replace(/["',]/g, '');


                                    let result = await BrokerResponse.findByIdAndUpdate(
                                        bro_res_last_id,
                                        {
                                            symbol: input_symbol,
                                            send_request: send_rr,
                                            order_id: response.data[0].NOrdNo,
                                            order_status: "Error",
                                            reject_reason: message
                                        },
                                        { new: true }
                                    )

                                }

                            })
                            .catch(async (error) => {

                                try {

                                    console.log("error.response", error);
                                    if (error) {
                                        if (error.response) {
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
                                    }

                                } catch (e) {
                                    console.log("error 1", e);
                                }



                            });
                    }

                } catch (e) {
                    console.log("place order Entry Catch", e);
                }


            }
            else if (type == 'SX' || type == 'LX') {

                var data_possition = {
                    "ret": "NET"
                }
                var config = {
                    method: 'post',
                    url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/positionAndHoldings/positionBook',
                    headers: {
                        'Authorization': 'Bearer ' + item.client_code + ' ' + item.access_token,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data_possition)
                };

                axios(config)
                    .then(async (response) => {

                        if (response.data) {

                            response.data.forEach(async (item1, index) => {
                                var possition_qty = item1.Bqty - item1.Sqty;

                                if (item1.Token == symbol_id) {

                                    if (segment == 'C' || segment == 'c') {

                                        var possition_qty = item1.Bqty - item1.Sqty;

                                        let result = await BrokerResponse.findByIdAndUpdate(
                                            bro_res_last_id,
                                            {
                                                open_possition_qty: possition_qty,
                                            },
                                            { new: true }
                                        )



                                        if ((item1.Bqty - item1.Sqty) > 0 && signal.type == 'LX') {


                                            if (item.client_services.product_type == '3') {
                                                data11 = {
                                                    "complexty": complexty,
                                                    "discqty": discqty,
                                                    "exch": exch,
                                                    "pCode": pCode,
                                                    "prctyp": prctyp,
                                                    "price": price,
                                                    "qty": qty,
                                                    "ret": ret,
                                                    "stopLoss": stopLoss,
                                                    "symbol_id": symbol_id,
                                                    "target": target,
                                                    "trading_symbol": trading_symbol,
                                                    "trailing_stop_loss": trailing_stop_loss,
                                                    "transtype": transtype,
                                                    "trigPrice": trigPrice
                                                };
                                            } else {
                                                data11 = {
                                                    "complexty": complexty,
                                                    "discqty": discqty,
                                                    "exch": exch,
                                                    "pCode": pCode,
                                                    "prctyp": prctyp,
                                                    "price": price,
                                                    "qty": qty,
                                                    "ret": ret,
                                                    "stopLoss": stopLoss,
                                                    "symbol_id": symbol_id,
                                                    "target": target,
                                                    "trading_symbol": trading_symbol,
                                                    "trailing_stop_loss": trailing_stop_loss,
                                                    "transtype": transtype,
                                                    "trigPrice": trigPrice
                                                };
                                            }



                                            var send_rr = Buffer.from(qs.stringify(data11)).toString;

                                            var config = {
                                                method: 'post',
                                                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',


                                                headers: {
                                                    'Authorization': 'Bearer ' + item.client_code + ' ' + item.access_token,
                                                    'Content-Type': 'application/json'
                                                },
                                                data: JSON.stringify([data11])
                                            };

                                            console.log("config ==>", config);

                                            axios(config)
                                                .then(function (response) {
                                                    var datetime = new Date();

                                                    var send_rr1 = Buffer.from(qs.stringify(data11)).toString('base64');

                                                    if (response.data[0].stat == "Ok") {

                                                        var data_order = {
                                                            "nestOrderNumber": response.data[0].NOrdNo,
                                                        }
                                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr1 + '",`order_id`="' + response.data[0].NOrdNo + '" ,`order_status`="' + response1.data[0].Status + '" ,`reject_reason`="' + response1.data[0].rejectionreason + '" WHERE `id`=' + bro_res_last_id, (err4444, result) => {
                                                            // console.log("err4444", err4444);
                                                        });




                                                    } else {



                                                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                            //console.log("err", err);
                                                        });


                                                    }



                                                })
                                                .catch(function (error) {

                                                    try {
                                                        if (error) {
                                                            if (error.response) {

                                                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });
                                                            } else {
                                                                const message = (JSON.stringify(error)).replace(/["',]/g, '');

                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });
                                                            }
                                                        }
                                                    } catch (error) {
                                                        console.log("Error");
                                                    }

                                                });

                                        }


                                    }
                                    else {

                                        var possition_qty = item1.Netqty;
                                        //  console.log('possition_qty ',possition_qty);

                                        connection.query('UPDATE `broker_response` SET `open_possition_qty`="' + possition_qty + '" WHERE `id`=' + bro_res_last_id, (err11, result_p) => {
                                            // console.log("possition broker_response ", err11);
                                        });


                                        if (item1.Netqty > 0 && signal.type == 'LX') {

                                            if (item.client_services.product_type == '3') {
                                                data11 = {
                                                    "complexty": complexty,
                                                    "discqty": discqty,
                                                    "exch": exch,
                                                    "pCode": pCode,
                                                    "prctyp": prctyp,
                                                    "price": price,
                                                    "qty": qty,
                                                    "ret": ret,
                                                    "stopLoss": stopLoss,
                                                    "symbol_id": symbol_id,
                                                    "target": target,
                                                    "trading_symbol": trading_symbol,
                                                    "trailing_stop_loss": trailing_stop_loss,
                                                    "transtype": transtype,
                                                    "trigPrice": trigPrice
                                                };
                                            } else {
                                                data11 = {
                                                    "complexty": complexty,
                                                    "discqty": discqty,
                                                    "exch": exch,
                                                    "pCode": pCode,
                                                    "prctyp": prctyp,
                                                    "price": price,
                                                    "qty": qty,
                                                    "ret": ret,
                                                    "stopLoss": stopLoss,
                                                    "symbol_id": symbol_id,
                                                    "target": target,
                                                    "trading_symbol": trading_symbol,
                                                    "trailing_stop_loss": trailing_stop_loss,
                                                    "transtype": transtype,
                                                    "trigPrice": trigPrice
                                                };
                                            }
                                            var send_rr = Buffer.from(qs.stringify(data11)).toString;

                                            var config = {
                                                method: 'post',
                                                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',


                                                headers: {
                                                    'Authorization': 'Bearer ' + item.client_code + ' ' + item.access_token,
                                                    'Content-Type': 'application/json'
                                                },
                                                data: JSON.stringify([data11])
                                            };

                                            axios(config)
                                                .then(function (response) {
                                                    var datetime = new Date();

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - ' + new Date() + ' AFTER ALice Blue Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response.data) + "\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });

                                                    var send_rr1 = Buffer.from(qs.stringify(data11)).toString('base64');

                                                    if (response.data[0].stat == "Ok") {
                                                        var data_order = {
                                                            "nestOrderNumber": response.data[0].NOrdNo,
                                                        }

                                                        var config1 = {
                                                            method: 'post',
                                                            url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
                                                            headers: {
                                                                'Authorization': 'Bearer ' + item.client_code + ' ' + item.access_token,
                                                                'Content-Type': 'application/json'
                                                            },
                                                            data: JSON.stringify(data_order)
                                                        };
                                                        axios(config1)
                                                            .then(function (response1) {

                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr1 + '",`order_id`="' + response.data[0].NOrdNo + '" ,`order_status`="' + response1.data[0].Status + '" ,`reject_reason`="' + response1.data[0].rejectionreason + '" WHERE `id`=' + bro_res_last_id, (err4444, result) => {
                                                                    // console.log("err4444", err4444);
                                                                });


                                                            })
                                                            .catch(function (error_broker) {
                                                                // console.log('error_broker -', error_broker);
                                                            });


                                                    } else {


                                                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                            //console.log("err", err);
                                                        });


                                                    }



                                                })
                                                .catch(function (error) {

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nALice Blue Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Entry catch -' + JSON.stringify(error) + "\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });
                                                    try {
                                                        if (error) {
                                                            if (error.response) {

                                                                const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });
                                                            } else {
                                                                const message = (JSON.stringify(error)).replace(/["',]/g, '');

                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });
                                                            }
                                                        }
                                                    } catch (error) {
                                                        console.log("Error");
                                                    }

                                                });




                                        }
                                        else if (item1.Netqty < 0 && signal.type == 'SX') {

                                            if (item.client_services.product_type == '3') {
                                                data11 = {
                                                    "complexty": complexty,
                                                    "discqty": discqty,
                                                    "exch": exch,
                                                    "pCode": pCode,
                                                    "prctyp": prctyp,
                                                    "price": price,
                                                    "qty": qty,
                                                    "ret": ret,
                                                    "stopLoss": stopLoss,
                                                    "symbol_id": symbol_id,
                                                    "target": target,
                                                    "trading_symbol": trading_symbol,
                                                    "trailing_stop_loss": trailing_stop_loss,
                                                    "transtype": transtype,
                                                    "trigPrice": trigPrice
                                                };
                                            } else {
                                                data11 = {
                                                    "complexty": complexty,
                                                    "discqty": discqty,
                                                    "exch": exch,
                                                    "pCode": pCode,
                                                    "prctyp": prctyp,
                                                    "price": price,
                                                    "qty": qty,
                                                    "ret": ret,
                                                    "stopLoss": stopLoss,
                                                    "symbol_id": symbol_id,
                                                    "target": target,
                                                    "trading_symbol": trading_symbol,
                                                    "trailing_stop_loss": trailing_stop_loss,
                                                    "transtype": transtype,
                                                    "trigPrice": trigPrice
                                                };
                                            }

                                            var send_rr = Buffer.from(qs.stringify(data11)).toString;

                                            var config = {
                                                method: 'post',
                                                url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',


                                                headers: {
                                                    'Authorization': 'Bearer ' + item.client_code + ' ' + item.access_token,
                                                    'Content-Type': 'application/json'
                                                },
                                                data: JSON.stringify([data11])
                                            };


                                            axios(config)
                                                .then(function (response) {

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\n Time - ' + new Date() + ' AFTER  ALice Blue Place Oredr Exit  =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit -' + JSON.stringify(response) + "\n\n", function (err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                    });


                                                    var datetime = new Date();
                                                    var send_rr1 = Buffer.from(qs.stringify(data11)).toString;

                                                    if (response.data[0].stat == "Ok") {

                                                        var data_order = {
                                                            "nestOrderNumber": response.data[0].NOrdNo,
                                                        }

                                                        var config1 = {
                                                            method: 'post',
                                                            url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory',
                                                            headers: {
                                                                'Authorization': 'Bearer ' + item.client_code + ' ' + item.access_token,
                                                                'Content-Type': 'application/json'
                                                            },
                                                            data: JSON.stringify(data_order)
                                                        };
                                                        axios(config1)
                                                            .then(function (response1) {

                                                                var send_rr = Buffer.from(qs.stringify(data11)).toString('base64');

                                                                connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_id`="' + response.data[0].NOrdNo + '" ,`order_status`="' + response1.data[0].Status + '" ,`reject_reason`="' + response1.data[0].response1.data[0].rejectionreason + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                    //console.log("err", err);
                                                                });



                                                            })
                                                            .catch(function (error) {
                                                                //console.log('error_broker -', error_broker);
                                                            });

                                                    } else {


                                                        const message = (JSON.stringify(response.data)).replace(/["',]/g, '');

                                                        connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                            //console.log("err", err);
                                                        });

                                                    }

                                                })
                                                .catch(function (error) {

                                                    fs.appendFile(filePath, '_______________________________________________________________________________________________________________________  \n\nALice Blue Place Oredr Exit Catch =   client Username - ' + item.username + '  client id - ' + item.id + ' Place Oredr Exit Catch -' + JSON.stringify(error) + "\n\n", function (err) {
                                                        if (err) {
                                                            // return console.log(err);
                                                        }
                                                    });

                                                    if (error) {
                                                        if (error.response) {
                                                            // console.log("error.response", error.response.data);
                                                            const message = (JSON.stringify(error.response.data)).replace(/["',]/g, '');

                                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                //console.log("err", err);
                                                            });
                                                        } else {
                                                            const message = (JSON.stringify(error)).replace(/["',]/g, '');

                                                            connection.query('UPDATE `broker_response` SET `signal_id`="' + signal.id + '",`symbol`="' + signal.input_symbol + '" ,`send_request`="' + send_rr + '",`order_status`="Error" ,`reject_reason`="' + message + '" WHERE `id`=' + bro_res_last_id, (err, result) => {
                                                                //console.log("err", err);
                                                            });
                                                        }
                                                    }
                                                });



                                        }


                                    }


                                } else {

                                }
                            })


                        }

                    })
                    .catch((error) => {



                    });



            }

        }


    } catch (error) {

        console.log("error", error);
    }

}



module.exports = { place_order }