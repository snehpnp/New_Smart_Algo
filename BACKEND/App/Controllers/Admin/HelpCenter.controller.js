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
            today.setHours(0, 0, 0, 0);

            try {
                const result = await HelpCenter_modal.find({
                    // admin_id: objectId,
                    createdAt: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    },
                })

                if (result.length === 0) {
                    return res.send({ status: false, msg: 'No Msg Found', data: [] });
                }
                return res.send({ status: true, msg: 'All Help Msg', data: result });
            }
            catch (error) {
                return res.send({ status: false, msg: 'Error  to Create Generate Help Response.', error: error.message });
            }
        } catch (error) {
            console.log("Error Help Center error-", error);
        }
    }

}


module.exports = new AdminHelpCenter();