"use strict";
const db = require('../../Models');
const Signals_modal = db.Signals
const { formattedDateTime } = require('../../Helper/time.helper')

class Signals {


    // GET ADMIN SIGNALS

    async GetAdminSignals(req, res) {
        try {

            const { startDate } = req.body;

            if (!startDate) {
                return res.status(200).json({ status: true, msg: 'Can Not Find Date Specific Signals', data: [] });
            }

            try {
                const filteredSignals = await Signals_modal.find({
                    dt_date: startDate,
                });

                if (filteredSignals.length === 0) {
                    return res.status(409).json({ status: false, msg: 'No signals founddate range.', data: [] });
                }
                return res.status(200).json({ status: true, msg: 'Filtered Signals', data: filteredSignals });
            } catch (error) {
                return res.status(500).json({ status: false, msg: 'Error fetching filtered signals.', error: error.message });
            }

        } catch (error) {
            console.log("Theme error-", error);
        }
    }


}


module.exports = new Signals();