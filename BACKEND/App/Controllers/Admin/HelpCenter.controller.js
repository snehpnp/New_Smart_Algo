"use strict";
const db = require('../../Models');
const HelpCenter_modal = db.HelpCenter

const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class AdminHelpCenter {

    // GET ADD HELP
    async GetAllMsges(req, res) {
        try {

            const { _id } = req.body;
            const objectId = new ObjectId(_id);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999); // End of the day

            try {
                const result = await HelpCenter_modal.find({
                    admin_id: objectId,
                    createdAt: { $gte: today, $lte: endOfDay }
                })

                if (result.length === 0) {
                    return res.status(409).json({ status: false, msg: 'No Msg Found', data: [] });
                }
                return res.status(200).json({ status: true, msg: 'All Help Msg', data: result });
            }
            catch (error) {
                return res.status(500).json({ status: false, msg: 'Error  to Create Generate Help Response.', error: error.message });
            }
        } catch (error) {
            console.log("Help- Center error-", error);
        }
    }

}


module.exports = new AdminHelpCenter();