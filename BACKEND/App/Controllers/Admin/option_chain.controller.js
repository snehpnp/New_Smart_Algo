"use strict";
const db = require('../../Models');
const Get_Option_Chain_modal = db.option_chain_symbols;
const Alice_token = db.Alice_token;



class OptionChain {

    // Get Token Symboll
    async Get_Option_Symbol(req, res) {
        try {

            var symbols = await Get_Option_Chain_modal.find().select('symbol token price')
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
        try {
            const symbol = req.body.symbol;

            if (!symbol) {
                return res.status(400).json({ status: false, msg: 'Symbol is required.', data: [] });
            }

            const pipeline = [
                {
                    $match: { symbol: req.body.symbol }
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
                    $sort: { expiryDate: 1 } // Sort ascending
                },
                {
                    $limit: 6 // Limit to the first 6 values
                }
            ];

            const result = await Alice_token.aggregate(pipeline);
            if (result.length === 0) {
                return res.json({ status: false, msg: 'Symbol not found.', data: [] });
            }
            return res.json({ status: true, msg: 'Data found', data: result });

        } catch (error) {
            console.log("Error:", error);
            return res.status(500).json({ status: false, msg: 'Server error', data: [] });
        }

    }

}


module.exports = new OptionChain();