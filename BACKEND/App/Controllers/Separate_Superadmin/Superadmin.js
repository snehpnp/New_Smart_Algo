"use strict";
const db = require('../../Models');
const user = db.user;
const count_licenses = db.count_licenses;
const company_information = db.company_information;



const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { formattedDateTime } = require('../../Helper/time.helper')

class SuperAdmin {
    async AddLicenseinPanle(req, res) {
        try {
            // const { id, license } = req.body
            const { license } = req.body

            const findResult = await company_information.find().select('licenses')
            const findAdmin = await user.find({ Role: "ADMIN" }).select('_id client_key')


            const newLicensesValue = Number(findResult[0].licenses) + Number(license);


            const updateOperation = {
                $set: {
                    licenses: newLicensesValue
                }
            };

            const objectId = findAdmin[0]._id

            const queryCondition = {
                panel_key: findAdmin[0].client_key // Replace with your desired query condition
            };

            const updateResult = await company_information.updateMany(queryCondition, updateOperation);

            const filter = { createdAt: new Date() }; // Specify the filter based on createdAt

            const result = await count_licenses.updateOne(filter, {
                $setOnInsert: {
                    admin_license: Number(license),
                    user_id: objectId,
                    createdAt: new Date(),

                }
            }, {
                upsert: true
            });

            return res.send({
                status: true,
                msg: "Add License",
                data: updateResult
            });


        } catch (error) {
            console.log("Add License error-", error);
        }
    }


}


module.exports = new SuperAdmin();