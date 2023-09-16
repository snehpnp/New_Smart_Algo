"use strict";
const db = require('../../Models');
const MainSignals_modal = db.MainSignals
const { formattedDateTime } = require('../../Helper/time.helper')

class BrokerReponse {


    // GET ADMIN SIGNALS

    async GetUserBrokerResponse(req, res) {
        try {

            const { _id } = req.body;


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


module.exports = new BrokerReponse();