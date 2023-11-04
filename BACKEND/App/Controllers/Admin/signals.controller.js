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


}


module.exports = new Signals();