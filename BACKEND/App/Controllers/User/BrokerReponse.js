"use strict";
const db = require('../../Models');
const BrokerResponse_modal = db.BrokerResponse
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class BrokerReponse {


    // GET ADMIN SIGNALS

    async GetUserBrokerResponse(req, res) {
        try {
            const { _id } = req.body;
            var objectId = new ObjectId(_id);

            try {
                const currentDate = new Date();
                console.log("currentDate", currentDate);
                // Step 1: Check if today is a Saturday (6) or Sunday (0)
                if (currentDate.getDay() === 6 ) {
                    currentDate.setDate(currentDate.getDate() - 1);
                }

                currentDate.setHours(0, 0, 0, 0);
                const endOfDay = new Date(currentDate);
                endOfDay.setHours(23, 59, 59, 999);
                console.log(currentDate);
                console.log(endOfDay);


                const filteredSignals = await BrokerResponse_modal.find({
                    user_id: objectId,
                    createdAt: {
                        $gte: currentDate, // Greater than or equal to the start of the day
                        $lte: endOfDay,    // Less than or equal to the end of the day
                    },
                });

                if (filteredSignals.length === 0) {
                    return res.json({ status: false, msg: 'No Data Found', data: [] });
                }
                return res.status(200).json({ status: true, msg: 'All Broker Response', data: filteredSignals });
            } catch (error) {
                return res.status(500).json({ status: false, msg: 'Error fetching Broker Response.', error: error.message });
            }

        } catch (error) {
            console.log("Theme error-", error);
        }
    }



}


module.exports = new BrokerReponse();