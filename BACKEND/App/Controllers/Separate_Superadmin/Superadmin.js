"use strict";
const db = require('../../Models');
const user = db.user;
const count_licenses = db.count_licenses;
const company_information = db.company_information;
const HelpCenter_modal = db.HelpCenter



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
            console.log("Error Add License error-", error);
            return res.send({
                status: false,
                msg: "Add License",
                data: error
            });
        }
    }


    async GetAllClients(req, res) {
        try {

            const getAllClients = await user.find({ Role: "USER" }).sort({ createdAt: -1 });

            if (getAllClients.length == 0) {
                return res.send({
                    status: false,
                    msg: "Empty data",
                    data: [],
                });
            }

            // DATA GET SUCCESSFULLY
            return res.send({
                status: true,
                msg: "Get All Clients",
                data: getAllClients,

            });
        } catch (error) {
            return res.send({
                status: false,
                msg: "Empty data",
                data: [],
            });
        }
    }


    async getallSubadmin(req, res) {
        try {

            // GET LOGIN CLIENTS
            const getAllSubAdmins = await user.find({
                Role: "SUBADMIN"
            });

            // IF DATA NOT EXIST
            if (getAllSubAdmins.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Subadmins",
                data: getAllSubAdmins,
            })
        } catch (error) {
            console.log("Error getallSubadmin error -", error);
        }
    }

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


module.exports = new SuperAdmin();