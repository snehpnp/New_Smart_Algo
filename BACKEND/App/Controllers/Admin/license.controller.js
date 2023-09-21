"use strict";
const db = require('../../Models');
const Signals_modal = db.Signals
const user_model = db.user;
const count_licenses = db.count_licenses;


const { formattedDateTime } = require('../../Helper/time.helper')

class License {


    // GET Expired Clients
    async GetExpiredclients(req, res) {
        try {

            const currentDate = new Date();

            // Calculate the date 3 days from now
            const endDateThreshold = new Date(currentDate);
            endDateThreshold.setDate(currentDate.getDate() + 3);


            const get_user = await user_model.find({
                Role: "USER",
                EndDate: {
                    $gte: currentDate,
                    $lte: endDateThreshold,
                },
            });
            if (get_user.length == 0) {

                return res.send({ status: false, msg: "Empty data", data: get_user })

            }
            return res.send({ status: true, msg: "Get all Clients", data: get_user })



        } catch (error) {
            console.log("License  error-", error);
        }
    }


    // GET TRANSECTION LICENSE DATA
    async GetTransctionLicense(req, res) {
        try {


            const Transection_license = await count_licenses.find({admin_license:null}).sort({ createdAt: -1 })

            if (Transection_license.length == 0) {

                return res.send({ status: false, msg: "Empty data", data: Transection_license })

            }
            return res.send({ status: true, msg: "Get all Transection license", data: Transection_license })



        } catch (error) {
            console.log("License  error-", error);
        }
    }

}


module.exports = new License();