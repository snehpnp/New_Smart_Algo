"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Signals_modal = db.Signals
const user = db.user
const company_information = db.company_information
const Broker_information = db.Broker_information


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
            let total_active_live = await user.find({ Role: "USER", license_type: "2", EndDate: { $gte: today } }).countDocuments()
            let total_expired_live = await user.find({ Role: "USER", license_type: "2", EndDate: { $lt: today } }).countDocuments()


            let total_demo = await user.find({ Role: "USER", license_type: "1" }).countDocuments()
            let total_active_demo = await user.find({ Role: "USER", license_type: "1", EndDate: { $gte: today } }).countDocuments()
            let total_expired_demo = await user.find({ Role: "USER", license_type: "1", EndDate: { $lt: today } }).countDocuments()

            let total_two_days = await user.find({ Role: "USER", license_type: "0" }).countDocuments()
            let total_active_two_days = await user.find({ Role: "USER", license_type: "0", EndDate: { $gte: today } }).countDocuments()
            let total_expired_two_days = await user.find({ Role: "USER", license_type: "0", EndDate: { $lt: today } }).countDocuments()


            let all_licence = await company_information.find()
            const used_licence = await user.aggregate([
                // Match documents based on your criteria (e.g., specific conditions)
                {
                    $match: {
                        license_type: "2",
                    },
                },
                {
                    $group: {
                        _id: null, // Group all documents into a single group
                        totalLicense: {
                            $sum: { $toInt: '$licence' }
                        },
                    },
                },
            ]);
            var used_licences = ""

            if (used_licence.length > 0) {
                used_licences = used_licence[0].totalLicense
            } else {
                used_licences = "0"

            }



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

                    // all_licence: all_licence[0].licenses,
                    // used_licence: used_licences,
                    // remaining_licence:Number(all_licence[0].licenses) - Number(used_licences),


                }
            })
        } catch (error) {
            console.log("get user trading Status error -", error);
        }
    }

    // Broker Information Update
    async update_broker_information(req, res) {
        try {

            Broker_information.findById(_id)
                .then(async (value) => {
                    if (!value) {
                        return res.send({ status: false, msg: 'Id not match', data: [] });
                    }
                    const filter = { _id: _id };
                    const updateOperation = { $set: userdata };
                    const result = await User_model.updateOne(filter, updateOperation);
                    if (!result) {
                        return res.send({ status: false, msg: 'Key not update', data: [] });
                    }

                    return res.send({ status: true, msg: 'Update Keys  Successfully.', data: [] });

                })

        } catch (error) {
            console.log("Error In Broker Informations");
        }
    }

    async add_broker_information(req, res) {
        try {

            var data = {
                "broker_name": "Alice Blue",
                "app_code": "RjFPYeubvHpGtaS",
                "apiSecret": "UvdxLEFFzGyfvhmRNIMiIrialWteBChzLsgVHjXoDzuGVaAmgKeYnjqUpuflPzWDNhBJHFZHTsvHWzNbDrSyncOoIghVkIVSDQPx"
            }
            const Broker_informations = new Broker_information(data)
            return Broker_informations.save();



        } catch (error) {
            console.log("Error In Broker Informations");
        }
    }

}


module.exports = new Dashboard();