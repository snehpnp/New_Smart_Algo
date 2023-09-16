"use strict";
const db = require('../../Models');
const MainSignals_modal = db.MainSignals
const { formattedDateTime } = require('../../Helper/time.helper')

class Tradehistory {


    // GET ADMIN SIGNALS

    async GetAdminTradeHistory(req, res) {
        try {

            const { startDate, endDate } = req.body;
            let startDateObj = new Date(startDate)
            let endDateObj = new Date(endDate)

            if (startDateObj >= endDateObj) {
                return res.status(400).json({ status: false, msg: 'Start date must be before end date.' });
            }

            // if (!startDate) {
            //     return res.status(200).json({ status: true, msg: 'Can Not Find Date Specific Signals', data: [] });
            // }

            const filteredSignals = await MainSignals_modal.find()
            if (startDate == "" && endDate == "") {
                return res.status(200).json({ status: true, msg: 'All  Tradehistory Date', data: filteredSignals });

            }
            try {
                const filteredSignals = await MainSignals_modal.find({
                    dt_date: { $gte: startDate, $lte: endDate },

                });

                if (filteredSignals.length === 0) {
                    return res.status(409).json({ status: false, msg: 'No signals founddate range.', data: [] });
                }
                return res.status(200).json({ status: true, msg: 'Filtered Tradehistory', data: filteredSignals });
            } catch (error) {
                return res.status(500).json({ status: false, msg: 'Error fetching filtered Trade Hisoty.', error: error.message });
            }

        } catch (error) {
            console.log("Theme error-", error);
        }
    }


}


module.exports = new Tradehistory();