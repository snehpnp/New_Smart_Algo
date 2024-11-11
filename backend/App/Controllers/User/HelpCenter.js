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
                        return res.json({ status: true, msg: 'Message Send SuccessFully', data: [] });
                    })
            }
            catch (error) {
                return res.son({ status: false, msg: 'Error  to Create Generate Help Response.', error: error.message });
            }

        } catch (error) {
            console.log("Error Help- Center error-", error);
        }
    }

    async GetAllHelp(req, res) {
        try {
            const { user_id } = req.body;
            
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0); 

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            try {
    
                const Help = await HelpCenter_modal.find({
                    user_id: user_id,
                    createdAt: {
                        $gte: startOfDay,  
                        $lte: endOfDay   
                    }
                }).sort({ createdAt: -1 });

                return res.json({ status: true, msg: 'Help Center Data', data: Help });
            } catch (error) {
                return res.son({ status: false, msg: 'Error retrieving Help Center data.', error: error.message });
            }

        } catch (error) {
            console.log("Error Help- Center error-", error);
        }
    }


}


module.exports = new HelpCenter();