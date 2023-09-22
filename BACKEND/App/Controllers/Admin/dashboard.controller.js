"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Signals_modal = db.Signals
const user = db.user
const { formattedDateTime } = require('../../Helper/time.helper')

class Dashboard {

    // ONE USER GET ALL TRADING STATUS

    async AdminDashboard(req, res) {
        try {
            const { user_Id } = req.body;

            let today = new Date()


            let total_client = await user.find({ Role: "USER" }).countDocuments()
            let admin_client = await user.find({ parent_role: "ADMIN", Role: "USER" }).countDocuments()
            let subadmin_client = await user.find({ parent_role: "SUBADMIN" }).countDocuments()
            let total_Subadmin = await user.find({ Role: "SUBADMIN" }).countDocuments()

            let total_live = await user.find({ Role: "USER", license_type: "2", }).countDocuments()  
            let total_active_live = await user.find({ Role: "USER", license_type: "2",EndDate: { $gte: today } }).countDocuments() //
            let total_expired_live = await user.find({ Role: "USER", license_type: "2", }).countDocuments()  //




            let total_demo = await user.find({ Role: "USER", license_type: "1" }).countDocuments()
            let total_active_demo = await user.find({ Role: "USER", license_type: "1" }).countDocuments()  //
            let total_expired_demo = await user.find({ Role: "USER", license_type: "1" }).countDocuments()  //

            let total_two_days = await user.find({ Role: "USER", license_type: "0" }).countDocuments()
            let total_active_two_days = await user.find({ Role: "USER", license_type: "0" }).countDocuments()   //
            let total_expired_two_days = await user.find({ Role: "USER", license_type: "0" }).countDocuments() //


            let all_licence = await user.find({ Role: "USER", license_type: "0" }).countDocuments() //
            let used_licence = await user.find({ Role: "USER", license_type: "0" }).countDocuments()   //
            let remaining_licence = await user.find({ Role: "USER", license_type: "0" }).countDocuments()  //

            // // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get Dashboard Data",
                totalCount: {
                    total_client: total_client,
                    admin_client: admin_client,
                    subadmin_client: subadmin_client,
                    total_Subadmin: total_Subadmin,
                    total_live: total_live,
                    total_active_live: total_active_live,
                    total_expired_live: total_expired_live,
                    total_demo: total_demo,
                    total_active_demo: total_active_demo,
                    total_expired_demo: total_expired_demo,
                    total_two_days: total_two_days,
                    total_active_two_days: total_active_two_days,
                    total_expired_two_days: total_expired_two_days,
                    all_licence: all_licence,
                    used_licence: used_licence,
                    remaining_licence: remaining_licence,


                }
            })
        } catch (error) {
            console.log("get user trading Status error -", error);
        }
    }


}


module.exports = new Dashboard();