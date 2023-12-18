"use strict";
const db = require('../../Models');
const Signals_modal = db.Signals
const Alice_token = db.Alice_token;

const { formattedDateTime } = require('../../Helper/time.helper')


// Hello Ganpat
var fs = require('fs');
var axios = require('axios');
var Promise = require('polyfill-promise');
var Sheets = require('google-sheets-api').Sheets;
const Papa = require('papaparse')



class Signals {


    // GET ADMIN SIGNALS

    async GetAdminSignals(req, res) {
        try {

            const { startDate } = req.body;

            if (!startDate) {
                return res.status(200).json({ status: true, msg: 'Can Not Find Date Specific Signals', data: [] });
            }

            try {

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const filteredSignals = await Signals_modal.find({
                    createdAt: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                }).sort({ createdAt: -1 })

                if (filteredSignals.length === 0) {
                    return res.send({ status: false, msg: 'No signals founddate range.', data: [] });
                }
                return res.status(200).json({ status: true, msg: 'Filtered Signals', data: filteredSignals });
            } catch (error) {
                return res.status(500).json({ status: false, msg: 'Error fetching filtered signals.', error: error.message });
            }

        } catch (error) {
            console.log("Theme error-", error);
        }
    }


    async GetStrickPriceFromSheet(req, res) {
        try {
            const csvFilePath = 'https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv';

            try {
                const { data } = await axios.get(csvFilePath);

                Papa.parse(data, {
                    complete: async (result) => {
                        let sheet_Data = result.data;

                        // Remove duplicates based on SYMBOL
                        const uniqueSymbols = [...new Set(sheet_Data.map(item => item.SYMBOL))];
                        sheet_Data = sheet_Data.filter((item, index, self) =>
                            index === self.findIndex(t => t.SYMBOL === item.SYMBOL)
                        );


                        const pipeline1 = [
                            {
                                $match: {
                                    symbol: { $in: sheet_Data.map(item => item.SYMBOL) },
                                    segment: "O"
                                }
                            },
                            {
                                $addFields: {
                                    CPrice: {
                                        $cond: {
                                            if: {
                                                $in: ["$symbol", sheet_Data.map(item => item.SYMBOL)]
                                            },
                                            then: {
                                                $arrayElemAt: [
                                                    sheet_Data.map(item => ({ symbol: item.SYMBOL, CPrice: item.CPrice })),
                                                    {
                                                        $indexOfArray: [sheet_Data.map(item => item.SYMBOL), "$symbol"]
                                                    }
                                                ]
                                            },
                                            else: null  // Replace null with the default value if CPrice is not found
                                        }
                                    },
                                    // Add other fields from sheet_Data if needed
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    symbol: 1,
                                    CPrice: 1
                                    // Add other fields you want to retrieve
                                }
                            }
                        ];



                        // Execute the pipeline

                        const getdata = await Alice_token.aggregate(pipeline1);
                        console.log(getdata);

                        if (getdata.length === 0) {
                            return res.json({ status: false, msg: 'Symbol not found.', data: [] });
                        }

                        return res.json({ status: true, msg: 'Data found', data: getdata });
                    },
                    header: true,
                });
            } catch (error) {
                console.error('Error fetching or parsing CSV:', error.message);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.log("Theme error-", error);
        }

    }


    // async GetStrickPriceFromSheet(req, res) {


        // try {
        //     const csvFilePath = 'https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv';

        //     try {
        //         const { data } = await axios.get(csvFilePath);

        //         Papa.parse(data, {
        //             complete: async (result) => {
        //                 let sheet_Data = result.data;
        //                 sheet_Data.map((item) => {


        //                     const symbol = item.SYMBOL;
        //                     // const expiry = item.expiry;

        //                     // let price = "19300"
        //                     // let symbol = "NIFTY"
        //                     // let expiry = "26102023"

        //                     let limit_set = 60
        //                     if (symbol == "FINNIFTY" || symbol == "BANKNIFTY" || symbol == "NIFTY" || symbol == "MIDCPNIFTY") {
        //                         let price = ""
        //                         let price_symbol = ""
        //                         if (symbol == "FINNIFTY") {
        //                             price = "19500"
        //                             price_symbol = "Nifty Financial Services";
        //                         } else if (symbol == "BANKNIFTY") {
        //                             price = "44500"
        //                             price_symbol = "Nifty Bank";
        //                         } else if (symbol == "NIFTY") {
        //                             price_symbol = "NIFTY 50";
        //                             price = "19500"
        //                         } else if (symbol == "MIDCPNIFTY") {
        //                             price_symbol = "NIFTY Midcap 100";
        //                         }


        //                         const pipeline2 = [
        //                             {
        //                                 $match: {
        //                                     $or: [
        //                                         {
        //                                             $and: [
        //                                                 { strike: { $lt: price } },
        //                                                 { segment: "O" },
        //                                                 { symbol: symbol },
        //                                                 { expiry: expiry }
        //                                             ]
        //                                         },
        //                                         {
        //                                             $and: [
        //                                                 { strike: price },
        //                                                 { symbol: symbol },
        //                                                 { expiry: expiry }
        //                                             ]
        //                                         },
        //                                         {
        //                                             $and: [
        //                                                 { strike: { $gt: price } },
        //                                                 { symbol: symbol },
        //                                                 { expiry: expiry }
        //                                             ]
        //                                         }
        //                                     ]
        //                                 }
        //                             },
        //                             {
        //                                 $sort: {
        //                                     strike: 1
        //                                 }
        //                             },
        //                             {
        //                                 $limit: limit_set
        //                             },
        //                             {
        //                                 $project: {
        //                                     _id: 0,
        //                                     strike: 1,
        //                                     option_type: 1,
        //                                     exch_seg: 1,
        //                                     instrument_token: 1,
        //                                     symbol: 1,
        //                                     segment: 1,
        //                                     // option_type: 1
        //                                 }
        //                             }
        //                         ]

        //                         const pipeline3 = [
        //                             {
        //                                 $match: {
        //                                     $or: [
        //                                         {
        //                                             strike: { $lt: price },
        //                                             segment: "O",
        //                                             symbol: symbol,
        //                                             expiry: expiry,
        //                                         },
        //                                         {
        //                                             strike: price,
        //                                             segment: "O",
        //                                             symbol: symbol,
        //                                             expiry: expiry,
        //                                         },
        //                                         {
        //                                             strike: { $gt: price },
        //                                             segment: "O",
        //                                             symbol: symbol,
        //                                             expiry: expiry,
        //                                         },
        //                                     ],
        //                                 },
        //                             },
        //                             {
        //                                 $sort: {
        //                                     strike: 1
        //                                 }
        //                             },
        //                             {
        //                                 $limit: limit_set
        //                             },
        //                             {
        //                                 $group: {
        //                                     _id: "$strike",
        //                                     symbol: { $first: "$symbol" },
        //                                     expiry: { $first: "$expiry" },
        //                                     instrument_token: { $first: "$instrument_token" },
        //                                     option_type: { $first: "$option_type" }
        //                                 }
        //                             },
        //                             {
        //                                 $sort: {
        //                                     _id: 1
        //                                 }
        //                             },
        //                             {
        //                                 $project: {
        //                                     _id: 0,
        //                                     strike: "$_id",
        //                                 }
        //                             }
        //                         ]

        //                         const result = await Alice_token.aggregate(pipeline2);
        //                         const resultStrike = await Alice_token.aggregate(pipeline3);




        //                         const final_data = [];
        //                         var channelstr = ""
        //                         if (result.length > 0) {
        //                             resultStrike.forEach(element => {

        //                                 let call_token = "";
        //                                 let put_token = "";
        //                                 let symbol = ""
        //                                 let segment = ""
        //                                 result.forEach(element1 => {
        //                                     if (element.strike == element1.strike) {
        //                                         // console.log("symbol", element.strike)
        //                                         // console.log("segment", element1.strike)


        //                                         if (element1.option_type == "CE") {
        //                                             symbol = element1.symbol
        //                                             segment = element1.segment
        //                                             call_token = element1.instrument_token;
        //                                         } else if (element1.option_type == "PE") {
        //                                             symbol = element1.symbol
        //                                             segment = element1.segment
        //                                             put_token = element1.instrument_token;
        //                                         }
        //                                         channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"
        //                                     }
        //                                 });

        //                                 const push_object = {
        //                                     symbol: symbol,
        //                                     segment: segment,
        //                                     strike_price: element.strike,
        //                                     call_token: call_token,
        //                                     put_token: put_token,
        //                                     expiry: element.expiry
        //                                 }
        //                                 final_data.push(push_object)
        //                             });

        //                             var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
        //                             res.send({ status: true, data: final_data, channellist: alltokenchannellist })
        //                         }
        //                         else {
        //                             res.send({ status: false, data: [], channellist: "" })
        //                         }
        //                     }

        //                 })




        //             },
        //             header: true,
        //         });
        //     } catch (error) {
        //         console.error('Error fetching or parsing CSV:', error.message);
        //         res.status(500).json({ error: 'Internal Server Error' });
        //     }
        // } catch (error) {
        //     console.log("Theme error-", error);
        // }









        // const symbol = req.body.symbol;
        // const expiry = req.body.expiry;

        // // let price = "19300"
        // // let symbol = "NIFTY"
        // // let expiry = "26102023"

        // let limit_set = 60
        // if (symbol == "FINNIFTY" || symbol == "BANKNIFTY" || symbol == "NIFTY" || symbol == "MIDCPNIFTY") {
        //     let price = ""
        //     let price_symbol = ""
        //     if (symbol == "FINNIFTY") {
        //         price = "19500"
        //         price_symbol = "Nifty Financial Services";
        //     } else if (symbol == "BANKNIFTY") {
        //         price = "44500"
        //         price_symbol = "Nifty Bank";
        //     } else if (symbol == "NIFTY") {
        //         price_symbol = "NIFTY 50";
        //         price = "19500"
        //     } else if (symbol == "MIDCPNIFTY") {
        //         price_symbol = "NIFTY Midcap 100";
        //     }


        //     console.log("symbol", symbol)
        //     console.log("expiry", expiry)
        //     console.log("price", price)



        //     const pipeline2 = [
        //         {
        //             $match: {
        //                 $or: [
        //                     {
        //                         $and: [
        //                             { strike: { $lt: price } },
        //                             { segment: "O" },
        //                             { symbol: symbol },
        //                             { expiry: expiry }
        //                         ]
        //                     },
        //                     {
        //                         $and: [
        //                             { strike: price },
        //                             { symbol: symbol },
        //                             { expiry: expiry }
        //                         ]
        //                     },
        //                     {
        //                         $and: [
        //                             { strike: { $gt: price } },
        //                             { symbol: symbol },
        //                             { expiry: expiry }
        //                         ]
        //                     }
        //                 ]
        //             }
        //         },
        //         {
        //             $sort: {
        //                 strike: 1
        //             }
        //         },
        //         {
        //             $limit: limit_set
        //         },
        //         {
        //             $project: {
        //                 _id: 0,
        //                 strike: 1,
        //                 option_type: 1,
        //                 exch_seg: 1,
        //                 instrument_token: 1,
        //                 symbol: 1,
        //                 segment: 1,
        //                 // option_type: 1
        //             }
        //         }
        //     ]

        //     const pipeline3 = [
        //         {
        //             $match: {
        //                 $or: [
        //                     {
        //                         strike: { $lt: price },
        //                         segment: "O",
        //                         symbol: symbol,
        //                         expiry: expiry,
        //                     },
        //                     {
        //                         strike: price,
        //                         segment: "O",
        //                         symbol: symbol,
        //                         expiry: expiry,
        //                     },
        //                     {
        //                         strike: { $gt: price },
        //                         segment: "O",
        //                         symbol: symbol,
        //                         expiry: expiry,
        //                     },
        //                 ],
        //             },
        //         },
        //         {
        //             $sort: {
        //                 strike: 1
        //             }
        //         },
        //         {
        //             $limit: limit_set
        //         },
        //         {
        //             $group: {
        //                 _id: "$strike",
        //                 symbol: { $first: "$symbol" },
        //                 expiry: { $first: "$expiry" },
        //                 instrument_token: { $first: "$instrument_token" },
        //                 option_type: { $first: "$option_type" }
        //             }
        //         },
        //         {
        //             $sort: {
        //                 _id: 1
        //             }
        //         },
        //         {
        //             $project: {
        //                 _id: 0,
        //                 strike: "$_id",
        //             }
        //         }
        //     ]

        //     const result = await Alice_token.aggregate(pipeline2);
        //     const resultStrike = await Alice_token.aggregate(pipeline3);




        //     const final_data = [];
        //     var channelstr = ""
        //     if (result.length > 0) {
        //         resultStrike.forEach(element => {

        //             let call_token = "";
        //             let put_token = "";
        //             let symbol = ""
        //             let segment = ""
        //             result.forEach(element1 => {
        //                 if (element.strike == element1.strike) {
        //                     // console.log("symbol", element.strike)
        //                     // console.log("segment", element1.strike)


        //                     if (element1.option_type == "CE") {
        //                         symbol = element1.symbol
        //                         segment = element1.segment
        //                         call_token = element1.instrument_token;
        //                     } else if (element1.option_type == "PE") {
        //                         symbol = element1.symbol
        //                         segment = element1.segment
        //                         put_token = element1.instrument_token;
        //                     }
        //                     channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"
        //                 }
        //             });

        //             const push_object = {
        //                 symbol: symbol,
        //                 segment: segment,
        //                 strike_price: element.strike,
        //                 call_token: call_token,
        //                 put_token: put_token,
        //                 expiry: element.expiry
        //             }
        //             final_data.push(push_object)
        //         });

        //         var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
        //         res.send({ status: true, data: final_data, channellist: alltokenchannellist })
        //     }
        //     else {
        //         res.send({ status: false, data: [], channellist: "" })
        //     }
        // }
    // }



}


module.exports = new Signals();