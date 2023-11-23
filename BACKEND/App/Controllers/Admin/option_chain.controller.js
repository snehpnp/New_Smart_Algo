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

        console.log(" req.body.symbol ", req.body.symbol);


        try {
            const symbol = req.body.symbol;

            if (!symbol) {
                return res.status(400).json({ status: false, msg: 'Symbol is required.', data: [] });
            }

            const date = new Date(); // Month is 0-based, so 10 represents November

            const currentDate = new Date();
            const previousDate = new Date(currentDate);
            previousDate.setDate(currentDate.getDate() - 1);
            //  const date = new Date(); // Month is 0-based, so 10 represents November

            const formattedDate = previousDate.toISOString();


            const pipeline = [
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
                        expiryDate: { $gte: new Date(formattedDate) }
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
        let limit_set = 20
         let price = 19000

        const get_symbol_price = await Get_Option_Chain_modal.findOne({symbol:symbol})
         
        console.log("get_symbol_price",get_symbol_price)
        if(get_symbol_price != undefined){
            price = parseInt(get_symbol_price.price); 
        }
        console.log("price",price)
            
            const pipeline2 = [
                {
                    $match: {
                        symbol: symbol,
                        segment: 'O',
                        expiry: expiry
                    }
                }
            ]

            const pipeline3 = [
                {
                    $match: {
                        symbol: symbol,
                        segment: 'O',
                        expiry: expiry
                    }
                },

                {
                    $addFields: {
                        absoluteDifference: {
                            $abs: {
                                $subtract: [{ $toInt: "$strike" }, price]
                            }
                        }
                    }
                },

                {
                    $group: {
                        _id: "$strike", // Group by unique values of A
                        minDifference: { $min: "$absoluteDifference" }, // Find the minimum absolute difference for each group
                        document: { $first: "$$ROOT" } // Keep the first document in each group
                    }
                },
                {
                    $sort: {
                        minDifference: 1 // Sort by the minimum absolute difference in ascending order
                    }
                },
                {
                    $limit: limit_set
                },
                {
                    $sort: {
                        _id: 1 // Sort by the minimum absolute difference in ascending order
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
                        if (element.document.strike == element1.strike) {
                          //  console.log("strike price", element.document.strike)
                            // console.log("segment", element1.strike)


                            if (element1.option_type == "CE") {
                             //   console.log("CALL", element1.option_type)
                              //  console.log("STRIKE", element1.strike)
                                symbol = element1.symbol
                                segment = element1.segment
                                call_token = element1.instrument_token;
                            } else if (element1.option_type == "PE") {
                              //  console.log("PUT", element1.option_type)
                               // console.log("STRIKE", element1.strike)
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
                        strike_price: element.document.strike,
                        call_token: call_token,
                        put_token: put_token,
                        expiry: element.document.expiry
                    }
                    final_data.push(push_object)
                });


                var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
                //  console.log("alltokenchannellist",alltokenchannellist)
                res.send({ status: true, data: final_data, channellist: alltokenchannellist })
            }
            else {
                res.send({ status: false, data: [], channellist: "" })
            }
      
    }

    // GET All ROUND TOKEN
    async Open_Position(req, res) {
        try {

            var GetTrade = await MainSignals_modal.aggregate([
                {
                    $match: {
                        "TradeType": "OPTION_CHAIN",
                        $expr: { $gt: ["$entry_qty_percent", "$exit_qty_percent"] }
                    }
                }
            ]);

            if (!GetTrade) {
                return res.send({ status: false, msg: 'Server issue Not find .', data: [] });
            }

            return res.send({ status: true, msg: 'Done', data: GetTrade });

        } catch (error) {
            console.log("Theme error-", error);
        }
    }

}


module.exports = new OptionChain();