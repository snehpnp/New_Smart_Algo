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



}


module.exports = new Signals();