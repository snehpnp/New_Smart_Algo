"use strict";
const db = require('../../Models');
const Get_Option_Chain_modal = db.option_chain_symbols;
const MainSignals_modal = db.MainSignals
const Alice_token = db.Alice_token;
const live_price = db.live_price;
const stock_live_price = db.stock_live_price
const token_chain_collection = db.token_chain;
const Store_all_redis_key = db.Store_all_redis_key;

const client_redis = require('../../Connection/ConnectRedis');

const { TruncateTableTokenChainAdd } = require("../../Cron/cron");


class OptionChain {

    // Get Token Symboll
    async Get_Option_Symbol(req, res) {
        try {

            // var symbols = await Get_Option_Chain_modal.find().select('symbol token price').sort({ symbol: 1 });

            var symbols1 = await Get_Option_Chain_modal.find({ symbol: { $in: ["NIFTY", "BANKNIFTY", "FINNIFTY"] } })
                .select('symbol token price')
                .sort({ symbol: 1 });

            var otherSymbols = await Get_Option_Chain_modal.find({ symbol: { $nin: ["NIFTY", "BANKNIFTY", "FINNIFTY"] } })
                .select('symbol token price');


            var symbols = symbols1.concat(otherSymbols);


            if (!symbols) {
                return res.send({ status: false, msg: 'Server issue Not find .', data: [] });
            }

            return res.send({ status: true, msg: 'Done', data: symbols });

        } catch (error) {
            console.log("Error Get Option symbol-", error);
        }
    }

    // GET SYMBOLL EXPIRY
    async Get_Option_Symbol_Expiry(req, res) {
      
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

            if (result.length === 0) {
                return res.json({ status: false, msg: 'Symbol not found.', data: [] });
            }


         
            var expiryDatesArray = result.map(item => item.expiryDate >= new Date(formattedDate) ? item : null).filter(item => item !== null);
          


            return res.json({ status: true, msg: 'Data found', data: expiryDatesArray });

        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({ status: false, msg: 'Server error', data: [] });
        }

    }

    // Upadte Stock option status
    async update_option_symbols_status(req, res) {

        try {
            const symbol = req.body.symbol;

            if (symbol.length == 0) {
                return res.json({ status: false, msg: 'stock is required.' });
            }

            const filter1 = {};
            const updateOperation1 = {
                $set: { token: "null" },

            };
            const result1 = await Get_Option_Chain_modal.updateMany(filter1, updateOperation1);




            const filter = { symbol: { $in: symbol } };
            const updateOperation = {
                $set: { token: "1" },

            };
            const result = await Get_Option_Chain_modal.updateMany(filter, updateOperation);


            if (result.acknowledged) {
                await TruncateTableTokenChainAdd()
                return res.json({ status: true, msg: 'Update successful!', data: result });

            } else {
                return res.json({ status: false, msg: 'Update failed.', data: result });

            }

        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({ status: false, msg: 'Server error', data: [] });
        }

    }

    // GET All ROUND TOKEN
    async Get_Option_All_Round_Token(req, res) {

        try {
            const symbol = req.body.symbol;
            const expiry = req.body.expiry;

            let limit_set = 41

            let price = 19000

            const get_symbol_price = await Get_Option_Chain_modal.findOne({ symbol: symbol })


            if (get_symbol_price != undefined) {
                price = parseInt(get_symbol_price.price);
            }


            const pipeline2 = [
                {
                    $match: {
                        symbol: symbol,
                        // segment: 'O',
                        expiry: expiry,
                        $or: [
                            { segment: 'O' },
                            { segment: 'BO' }
                        ]
                    }
                }
            ]

            const pipeline3 = [
                {
                    $match: {
                        symbol: symbol,
                        // segment: 'O',
                        expiry: expiry,
                        $or: [
                            { segment: 'O' },
                            { segment: 'BO' }
                        ]
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
                        strike_price: element.document.strike,
                        call_token: call_token,
                        put_token: put_token,
                        expiry: element.document.expiry
                    }

                    final_data.push(push_object)
                });


                var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);

                return res.send({ status: true, data: final_data, channellist: alltokenchannellist })
            }
            else {
                return res.send({ status: false, data: [], channellist: "" })
            }

        } catch (error) {
            console.log("Error Get_Option_All_Round_Token", error);
            return res.send({ status: false, data: [], channellist: "" , message: "An error occurred while processing data.", error: error.message })
        }
    }

    // GET All ROUND TOKEN
    async Open_Position(req, res) {
        try {

            var today = new Date();
            var formattedDate = today.getFullYear() + '/' + (today.getMonth() + 1).toString() + '/' + today.getDate().toString();

            // var GetTrade = await MainSignals_modal.aggregate([
            //     {
            //         $addFields: {
            //             entry_qty_percent_int: { $toInt: "$entry_qty_percent" },
            //             exit_qty_percent_int: {
            //                 $cond: {
            //                     if: {
            //                         $or: [
            //                             { $eq: ["$exit_qty_percent", ""] },
            //                             { $eq: ["$exit_qty_percent", null] },
            //                         ],
            //                     },
            //                     then: 0,
            //                     else: { $toInt: "$exit_qty_percent" },
            //                 },
            //             },
            //         },
            //     },
            //     {
            //         $match: {
            //             $expr: {
            //                 $and: [
            //                     { $gt: ["$entry_qty_percent_int", "$exit_qty_percent_int"] },
            //                     { $eq: ["$dt_date", formattedDate] }
            //                 ]
            //             }
            //         }
            //     }

            // ]);

            var GetTrade = await MainSignals_modal.aggregate([

                {
                    $match: {
                        $expr: {
                            $and: [
                                { $gt: [{ $toInt: "$entry_qty" }, { $toInt: "$exit_qty" }] },
                                { $eq: ["$dt_date", formattedDate] }
                            ]
                        }
                    }
                }

            ]);



            if (GetTrade.length > 0) {
                return res.send({ status: true, msg: 'Done', data: GetTrade });
            } else {

                return res.send({ status: false, msg: 'Server issue Not find .', data: [] });
            }

        } catch (error) {
            console.log("Error Get Open Position data-", error);
        }
    }

    async Get_Option_All_Token_Chain(req, res) {

        try {
            const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];

            const expiry = "30112023";
            let limit_set = 20
            let price = 21000

            var alltokenchannellist

            const date = new Date(); // Month is 0-based, so 10 represents November
            const currentDate = new Date();
            const previousDate = new Date(currentDate);
            previousDate.setDate(currentDate.getDate() - 1);
            const formattedDate = previousDate.toISOString();
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const formattedLastDayOfMonth = lastDayOfMonth.toISOString();

            const final_data = [];

            for (const symbol of symbols) {
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
                        $limit: 5
                    }


                ]

                var data = await Alice_token.aggregate(pipeline);

                const result11 = data.filter(item => {
                    const itemDate = new Date(item.expiryDate);
                    return itemDate.getTime() === lastDayOfMonth.getTime() || data.indexOf(item) < 2;
                });
                const expiryDatesArray = result11.map(item => item.uniqueExpiryValues);

                const get_symbol_price = await Get_Option_Chain_modal.findOne({ symbol: symbol })

                if (get_symbol_price != undefined) {
                    price = parseInt(get_symbol_price.price);
                }

                const pipeline2 = [
                    {
                        $match: {
                            symbol: symbol,
                            segment: 'O',
                            expiry: { $in: expiryDatesArray }
                        }
                    }
                ]

                const pipeline3 = [
                    {
                        $match: {
                            symbol: symbol,
                            segment: 'O',
                            expiry: { $in: expiryDatesArray }
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

                var channelstr = ""
                if (result.length > 0) {
                    resultStrike.forEach(element => {
                        let call_token = "";
                        let put_token = "";
                        let symbol = ""
                        let segment = ""
                        result.forEach(async (element1) => {
                            if (element.document.strike == element1.strike) {
                                if (element1.option_type == "CE") {
                                    symbol = element1.symbol
                                    segment = element1.segment
                                    call_token = element1.instrument_token;
                                } else if (element1.option_type == "PE") {
                                    symbol = element1.symbol
                                    segment = element1.segment
                                    put_token = element1.instrument_token;
                                }

                                const filter = { _id: element1.instrument_token };
                                const update = {
                                    $set: { _id: element1.instrument_token, exch: element1.exch_seg },
                                };

                                channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"

                                const update_token = await token_chain_collection.updateOne(filter, update, { upsert: true });



                            }
                        });


                    });


                    alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
                    final_data.push(alltokenchannellist)

                }

            }
            var concatenatedArray = ""

            final_data.forEach((data) => {
                concatenatedArray += data + "#"
            });


            var concatenatedArray1 = concatenatedArray.substring(0, concatenatedArray.length - 1)
            const filter = { broker_name: "ALICE_BLUE" };
            const updateOperation = { $set: { Stock_chain: concatenatedArray1 } };
            const Update_Stock_chain = await live_price.updateOne(filter, updateOperation);

            return res.send({ status: true, msg: "Done" })

        } catch (error) {
            console.log("Error Get_Option_All_Token_Chain", error);
        }
    }

    async update_stop_loss(req, res) {
        try {

            const { data } = req.body;
            let tokens = []
           
            if(data.length > 0){
             tokens = data.map(tk => ({
                token : tk.token,
                exchange : tk.exchange,
             }));

            await data.forEach(async (signal) => {
                const filter = { _id: signal._id };
                const updateOperation = { $set: signal };
                const result = await MainSignals_modal.updateOne(filter, updateOperation);

             })
            }
            
            if(tokens.length > 0){
                
                const bulkOps = tokens.map(val => ({
                    updateOne: {
                        filter: { _id: val.token },
                        update: { $set: { exch: val.exchange } },  // _id is already in the filter, so no need to set it again
                        upsert: true
                    }
                }));
                
                try {
                    const result = await token_chain_collection.bulkWrite(bulkOps);
                 
                } catch (error) {
                    console.error("Error updating tokens:", error);
                }
            }

            return res.send({ status: true, msg: 'Update SuccessFully', data: [] });

        } catch (error) {
            return res.send({ status: false, msg: 'error ', data: error });

        }
    }

    async Stock_chain(req, res) {
        try {


            const updateToken = await token_chain_collection.find({}).toArray();

            var channelstr = ""
            if (updateToken.length > 0) {
                updateToken.forEach((data) => {
                    if (data.exch != null && data._id != null) {

                        channelstr += data.exch + "|" + data._id + "#"
                    }
                })
            }

            var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);

            return res.send({ status: true, channellist: alltokenchannellist })
        } catch (error) {
            return res.send({ status: false, msg: 'error ', data: error });

        }
    }

    async subscribr_token(req, res) {
        try {
            const data = req.body.data;

            if (!Array.isArray(data) || data.length === 0) {
                return res.status(400).send({ status: false, msg: "Invalid input: expected an array of objects." });
            }
            const updatePromises = data.map(async (item) => {
                const { token, segment } = item;

                //  Redis key set Start
                const value = await client_redis.hGet('alltokenopp', token);
                if (value) {
                    let set_redis_token_key = "ST_" + value + "_" + token;
                    const exists_redis_token_key = await client_redis.get(set_redis_token_key);
                    if (exists_redis_token_key == null) {
                        await client_redis.set(set_redis_token_key, "true");
                    }

                    const filter_redis_key = { token: token };
                    const update_redis_key = {
                        $set: { token: token, key_symbol: set_redis_token_key },
                    };
                    const Update_redis_key = await Store_all_redis_key.updateOne(filter_redis_key, update_redis_key, { upsert: true });

                }
                //  Redis key set End





                // Token Chain Update token
                let exch_seg = 'NSE';
                switch (segment) {
                    case 'O':
                    case 'F':
                    case 'FO':
                        exch_seg = 'NFO';
                        break;
                    case 'MO':
                    case 'MF':
                        exch_seg = 'MCX';
                        break;
                    case 'CO':
                    case 'CF':
                        exch_seg = 'CDS';
                        break;
                    default:
                        exch_seg = 'NSE';
                        break;
                }


                if (!token || !exch_seg) {
                    throw new Error("Missing required fields: token or exch_seg");
                }

                const filter = { _id: token };
                const update = {
                    $set: { _id: token, exch: exch_seg },
                };

                return token_chain_collection.updateOne(filter, update, { upsert: true });
            });

            await Promise.all(updatePromises);
            return res.send({ status: true, msg: "Done" });
        } catch (error) {
            return res.status(500).send({ status: false, msg: 'Error', data: error.message });
        }

    }

}


module.exports = new OptionChain();