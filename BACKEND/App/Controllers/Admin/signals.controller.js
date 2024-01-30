"use strict";
const db = require('../../Models');
const Signals_modal = db.Signals
const Alice_token = db.Alice_token;
const Get_Option_Chain_modal = db.option_chain_symbols;


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
            console.log("Error Theme error-", error);
        }
    }



    async GetStrickPriceFromSheet() {
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

                        // Map and update specific SYMBOL values
                        sheet_Data.forEach(data => {
                            switch (data.SYMBOL) {
                                case "NIFTY_BANK":
                                    data.SYMBOL = "BANKNIFTY";
                                    break;
                                case "NIFTY_50":
                                    data.SYMBOL = "NIFTY";
                                    break;
                                case "NIFTY_FIN_SERVICE":
                                    data.SYMBOL = "FINNIFTY";
                                    break;
                                // Add more cases if needed
                            }
                        });

                        // Sort the array based on SYMBOL
                        sheet_Data.sort((a, b) => a.SYMBOL.localeCompare(b.SYMBOL));

                        // Use Promise.all to wait for all updates to complete
                        await Promise.all(sheet_Data.map(async (data) => {
                            const result = await Get_Option_Chain_modal.updateOne(
                                { symbol: data.SYMBOL },
                                { $set: { price: data.CPrice } }
                            );
                        }));

                        // return res.json({ status: true, msg: 'Data found', data: sheet_Data });
                    },
                    header: true,
                });
            } catch (error) {
                console.log('Error fetching or parsing CSV:', error.message);
                // res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.log("Error Theme error-", error);
        }
    }



}


module.exports = new Signals();