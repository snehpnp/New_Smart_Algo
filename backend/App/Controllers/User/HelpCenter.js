"use strict";
const db = require('../../Models');
const HelpCenter_modal = db.HelpCenter

const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class HelpCenter {

    async AddHelp(req, res) {
        try {

            const { username, fullname, email, mobile, helpmsg, admin_id, user_id } = req.body;
            try {

                var Req = req.body.req
                var adminid = new ObjectId(Req.admin_id)
                var userid = new ObjectId(Req.user_id)



                const Help = new HelpCenter_modal({
                    user_id: Req.user_id,
                    admin_id: Req.admin_id,
                    help_msg: Req.helpmsg,
                    mobile: Req.mobile,
                    fullname: Req.fullname,
                    username: Req.username,
                    email: Req.email

                })
                
                Help.save()
                    .then(async (data) => {
                        return res.status(200).json({ status: true, msg: 'Message Send SuccessFully', data: [] });
                    })
            }
            catch (error) {
                return res.status(500).json({ status: false, msg: 'Error  to Create Generate Help Response.', error: error.message });
            }

        } catch (error) {
            console.log("Error Help- Center error-", error);
        }
    }

}


module.exports = new HelpCenter();