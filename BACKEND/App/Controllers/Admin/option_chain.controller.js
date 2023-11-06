"use strict";
const db = require('../../Models');
const Get_Option_Chain_modal = db.option_chain_symbols;
const MainSignals_modal = db.MainSignals


const Alice_token = db.Alice_token;



class OptionChain {

    // Get Token Symboll
    async Get_Option_Symbol(req, res) {
        try {

            var symbols = await Get_Option_Chain_modal.find().select('symbol token price').sort({ symbol: 1 });
            if (!symbols) {
                return res.send({ status: false, msg: 'Server issue Not find .', data: [] });
            }

            return res.send({ status: true, msg: 'Done', data: symbols });

        } catch (error) {
            console.log("Theme error-", error);
        }
    }

    // GET SYMBOLL EXPIRY
    async Get_Option_Symbol_Expiry(req, res) {
     
        console.log(" req.body.symbol ",req.body.symbol);


        try {
            const symbol = req.body.symbol;

            if (!symbol) {
                return res.status(400).json({ status: false, msg: 'Symbol is required.', data: [] });
            }

          
            const date = new Date(); // Month is 0-based, so 10 represents November

            const formattedDate = date.toISOString();


            const pipeline =    [
                {
                $match: { symbol: symbol }
                },
                {
                $group: {
                _id: "$symbol",
                uniqueExpiryValues: { $addToSet: "$expiry" }
                }
                },
                {
                $unwind: "$uniqueExpiryValues"
                },
                {
                $addFields: {
                expiryDate: {
                $dateFromString: {
                dateString: "$uniqueExpiryValues",
                format: "%d%m%Y"
                }
                }
                }
                },
                {
                $match: {
                expiryDate: { $gte:new Date(formattedDate) }
                
                
                }
                
                
                },
                
                
                {
                
                
                $addFields: {
                
                
                formattedExpiryDate: {
                
                
                $dateToString: {
                
                
                date: "$expiryDate",
                
                
                format: "%d%m%Y"
                
                
                }
                
                
                }
                
                
                }
                
                
                },
                
                
                {
                
                
                $sort: { expiryDate: 1 }
                
                
                },
                
                
                {
                
                
                $limit: 4
                
                
                }
                
                
                ]

            const result = await Alice_token.aggregate(pipeline);

          //  console.log(" result -",result)
            if (result.length === 0) {
                return res.json({ status: false, msg: 'Symbol not found.', data: [] });
            }
            return res.json({ status: true, msg: 'Data found', data: result });

        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({ status: false, msg: 'Server error', data: [] });
        }

    }


    // GET All ROUND TOKEN

    async Get_Option_All_Round_Token(req, res) {


        const symbol = req.body.symbol;
        const expiry = req.body.expiry;

        // let price = "19300"
        // let symbol = "NIFTY"
        // let expiry = "26102023"

        let limit_set = 60
        if (symbol == "FINNIFTY" || symbol == "BANKNIFTY" || symbol == "NIFTY" || symbol == "MIDCPNIFTY") {
            let price = ""
            let price_symbol = ""
            if (symbol == "FINNIFTY") {
                price = "19500"
                price_symbol = "Nifty Financial Services";
            } else if (symbol == "BANKNIFTY") {
                price = "44500"
                price_symbol = "Nifty Bank";
            } else if (symbol == "NIFTY") {
                price_symbol = "NIFTY 50";
                price = "19500"
            } else if (symbol == "MIDCPNIFTY") {
                price_symbol = "NIFTY Midcap 100";
            }


            console.log("symbol", symbol)
            console.log("expiry", expiry)
            console.log("price", price)



            const pipeline2 = [
                {
                    $match: {
                        $or: [
                            {
                                $and: [
                                    { strike: { $lt: price } },
                                    { segment: "O" },
                                    { symbol: symbol },
                                    { expiry: expiry }
                                ]
                            },
                            {
                                $and: [
                                    { strike: price },
                                    { symbol: symbol },
                                    { expiry: expiry }
                                ]
                            },
                            {
                                $and: [
                                    { strike: { $gt: price } },
                                    { symbol: symbol },
                                    { expiry: expiry }
                                ]
                            }
                        ]
                    }
                },
                {
                    $sort: {
                        strike: 1
                    }
                },
                {
                    $limit: limit_set
                },
                {
                    $project: {
                        _id: 0,
                        strike: 1,
                        option_type: 1,
                        exch_seg: 1,
                        instrument_token: 1,
                        symbol: 1,
                        segment: 1,
                        // option_type: 1
                    }
                }
            ]

            const pipeline3 = [
                {
                    $match: {
                        $or: [
                            {
                                strike: { $lt: price },
                                segment: "O",
                                symbol: symbol,
                                expiry: expiry,
                            },
                            {
                                strike: price,
                                segment: "O",
                                symbol: symbol,
                                expiry: expiry,
                            },
                            {
                                strike: { $gt: price },
                                segment: "O",
                                symbol: symbol,
                                expiry: expiry,
                            },
                        ],
                    },
                },
                {
                    $sort: {
                        strike: 1
                    }
                },
                {
                    $limit: limit_set
                },
                {
                    $group: {
                        _id: "$strike",
                        symbol: { $first: "$symbol" },
                        expiry: { $first: "$expiry" },
                        instrument_token: { $first: "$instrument_token" },
                        option_type: { $first: "$option_type" }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        strike: "$_id",
                    }
                }
            ]

            const result = await Alice_token.aggregate(pipeline2);
            const resultStrike = await Alice_token.aggregate(pipeline3);




            const final_data = [];
            var channelstr = ""
            if (result.length > 0) {
                resultStrike.forEach(element => {

                    let call_token = "";
                    let put_token = "";
                    let symbol = ""
                    let segment = ""
                    result.forEach(element1 => {
                        if (element.strike == element1.strike) {
                            console.log("symbol", element.strike)
                            console.log("segment", element1.strike)


                            if (element1.option_type == "CE") {
                                symbol = element1.symbol
                                segment = element1.segment
                                call_token = element1.instrument_token;
                            } else if (element1.option_type == "PE") {
                                symbol = element1.symbol
                                segment = element1.segment
                                put_token = element1.instrument_token;
                            }
                            channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"
                        }
                    });

                    const push_object = {
                        symbol: symbol,
                        segment: segment,
                        strike_price: element.strike,
                        call_token: call_token,
                        put_token: put_token,
                        expiry: element.expiry
                    }
                    final_data.push(push_object)
                });

                var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
                res.send({ status: true, data: final_data, channellist: alltokenchannellist })
            }
            else {
                res.send({ status: false, data: [], channellist: "" })
            }
        }
    }

    // GET All ROUND TOKEN

    async Open_Position(req, res) {
        try {

            var symbols = await MainSignals_modal.find({ "TradeType": "OPTION_CHAIN", });
            if (!symbols) {
                return res.send({ status: false, msg: 'Server issue Not find .', data: [] });
            }

            return res.send({ status: true, msg: 'Done', data: symbols });

        } catch (error) {
            console.log("Theme error-", error);
        }
    }

}


module.exports = new OptionChain();