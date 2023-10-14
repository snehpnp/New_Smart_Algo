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

            console.log({
                dt: splitArray[0],
            input_symbol: splitArray[1],
            type: splitArray[2],
            tr_price: splitArray[3],    
            price: splitArray[4],
            sq_value: splitArray[5],
            sl_value: splitArray[6],
            tsl: splitArray[7],
            segment: splitArray[8],
            strike: splitArray[9],
            option_type: splitArray[10],
            expiry: splitArray[11],
            strategy: splitArray[12],
            qty_percent: splitArray[13],
            client_key: splitArray[14],
            demo: splitArray[15],
            });

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


            console.log(token);
            var complexty
            var discqty = "0";
            var pCode;
            var prctyp;
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
                console.log("price",price);

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

            // SET PRODUCT TYPE / CODE
            if (item.client_services.product_type == '1') {
                if (segment == 'F' || segment == 'f' || segment == 'O' || segment == 'o' || segment == 'FO' || segment == 'fo') {
                    pCode = "NRML";
                }
            }



            // REQUEST CREATE
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
                    "trigPrice": trigPrice,
                    "orderTag": "order1"
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
                    "symbol_id": symbol_id,
                    "trading_symbol": trading_symbol,
                    "transtype": transtype,
                    "trigPrice": trigPrice,
                    "orderTag": "order1"
                };
            }

            console.log("data", data);





            if (type == 'LE' || type == 'SE') {

                try {

                    if (data !== undefined) {

                        logger.info(' ALICE BLUE BEFORE PLACE ORDER USER- '+item.UserName+' REQUEST -'+data);
                        
                        var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                            headers: {
                                'Authorization': "Bearer " + item.demat_userid + " " + item.access_token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify([data])

                        };

                        axios(config)
                            .then(async (response) => {
                             logger.info(' ALICE BLUE AFTER PLACE ORDER USER ENTRY - '+item.UserName+' RESPONSE -'+response.data);
                             

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
                                            reject_reason: response.data
                                        },
                                        { new: true }
                                    )

                                }

                            })
                            .catch(async (error) => {
                             logger.info(' ALICE BLUE AFTER PLACE ORDER CATCH ENTRY - '+item.UserName+' ERROR -'+error);
                              
                                try {

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
                        'Authorization': 'Bearer ' + item.demat_userid + ' ' + item.access_token,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data_possition)
                };
                axios(config)
                    .then(async (response) => {
                        console.log("run=====");
                        console.log(response.data);

                        if (response.data.length > 0) {

                            response.data.forEach(async (item1, index) => {
                                console.log("item1.Token", item1.Token);
                                console.log("symbol_id", symbol_id);


                                if (item1.Token == symbol_id) {

                                    if (segment == 'C' || segment == 'c') {

                                        var possition_qty = item1.Bqty - item1.Sqty;
                                        // console.log("possition_qty", possition_qty);

                                        let result = await BrokerResponse.findByIdAndUpdate(
                                            bro_res_last_id,
                                            {
                                                open_possition_qty: possition_qty,
                                            },
                                            { new: true }
                                        )

                                        if ((item1.Bqty - item1.Sqty) > 0 && type == 'LX') {

                                            try {

                                                if (data !== undefined) {
                                                    var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                                                    let config = {
                                                        method: 'post',
                                                        maxBodyLength: Infinity,
                                                        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                                                        headers: {
                                                            'Authorization': "Bearer " + item.demat_userid + " " + item.access_token,
                                                            'Content-Type': 'application/json'
                                                        },
                                                        data: JSON.stringify([data])

                                                    };

                                                    axios(config)
                                                        .then(async (response) => {

                                                            console.log(response);
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
                                                                        reject_reason: response.data
                                                                    },
                                                                    { new: true }
                                                                )

                                                            }

                                                        })
                                                        .catch(async (error) => {

                                                            try {

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
                                                console.log("place order Exit Lx Catch", e);
                                            }



                                        } else if ((item1.Bqty - item1.Sqty) < 0 && type == 'SX') {
                                            try {

                                                if (data !== undefined) {
                                                    var send_rr = Buffer.from(qs.stringify(data)).toString('base64');

                                                    let config = {
                                                        method: 'post',
                                                        maxBodyLength: Infinity,
                                                        url: 'https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder',
                                                        headers: {
                                                            'Authorization': "Bearer " + item.demat_userid + " " + item.access_token,
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
                                                                        reject_reason: response.data
                                                                    },
                                                                    { new: true }
                                                                )

                                                            }

                                                        })
                                                        .catch(async (error) => {

                                                            try {

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
                                                console.log("place order Exit SX Catch", e);
                                            }

                                        }

                                    } else {
                                        var possition_qty = item1.Netqty;
                                        console.log("possition_qty", possition_qty);
                                        let result = await BrokerResponse.findByIdAndUpdate(
                                            bro_res_last_id,
                                            {
                                                symbol: input_symbol,
                                                send_request: send_rr,
                                                open_possition_qty: possition_qty
                                            },
                                            { new: true }
                                        )


                                        if (item1.Netqty > 0 && type == 'LX') {

                                        } else if (item1.Netqty < 0 && type == 'SX') {

                                        }


                                    }


                                } else {
                                    let result = await BrokerResponse.findByIdAndUpdate(
                                        bro_res_last_id,
                                        {
                                            symbol: input_symbol,
                                            send_request: send_rr,
                                            order_status: "Entry Npot Exist",
                                            reject_reason: "This Symbol position Empty "
                                        },
                                        { new: true }
                                    )
                                }
                            })


                        } else {
                            let result = await BrokerResponse.findByIdAndUpdate(
                                bro_res_last_id,
                                {
                                    symbol: input_symbol,
                                    send_request: send_rr,
                                    order_status: "Position Error",
                                    reject_reason: "Position Error "
                                },
                                { new: true }
                            )
                        }

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



            }

        }


    } catch (error) {

        console.log("error", error);
    }

}



module.exports = { place_order }