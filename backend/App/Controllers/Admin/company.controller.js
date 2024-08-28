"use strict";
const {connectToMongoDB} = require('../../Connection/mongo_connection');
const db = require('../../Models');
const mongoose = require('mongoose')
const company_information = db.company_information
const { formattedDateTime } = require('../../Helper/time.helper')
const ObjectId = mongoose.Types.ObjectId;

class Company {

    // EDIT COMPANY INFORMATION
    async EditCompany(req, res) {
        try {
            var companydata = req.body.data
            var _id = req.body.id;

            company_information.findById(_id)
                .then(async (value) => {
                    if (!value) {
                        return res.send({ status: false, msg: 'Id not match', data: [] });
                    }
                    const filter = { _id: _id };
                    const updateOperation = { $set: companydata };
                    const result = await company_information.updateOne(filter, updateOperation);
                    if (!result) {
                        return res.send({ status: false, msg: 'Company not update', data: [] });
                    }
                    return res.send({ status: true, msg: 'Update Successfully.', data: [] });
                })


        } catch (error) {
            console.log("Error Edit Company Api -", error);
        }
    }

    // update company
    async UpdateDisclaimer(req, res) {
        try {
            const { id, disclaimer, dataArr, disclaimer_status } = req.body;
    
            const findData = await company_information.findOne();
            if (!findData) {
                return res.send({
                    status: false,
                    msg: "Id is not Match",
                    data: []
                });
            }
    
            const filter = { _id: findData._id };
            let updateOperation;
    
            if (disclaimer_status) {
                updateOperation = { $set: { disclaimer_status: disclaimer_status } };
            } else {
                updateOperation = { $set: { disclaimer: disclaimer, dissArr: dataArr } };
            }
    
            const result = await company_information.updateOne(filter, updateOperation);
            if (result.nModified === 0) {
                return res.send({ status: false, msg: 'Company not updated', data: [] });
            }
    
            return res.send({ status: true, msg: 'Update Successfully.', data: [] });
        } catch (error) {
            return res.status(500).send({ status: false, msg: 'Server Error', data: [] });
        }
    }
    

    // GET COMPANY DETALIS
    async GetCompanyInfo(req, res) {
        try {

            var compantInfo = await company_information.find()
            if (!compantInfo) {
                return res.send({ status: false, msg: 'Server issue Not find Company information.', data: [] });
            }
            return res.send({ status: true, msg: 'Done', data: compantInfo });
        } catch (error) {
            console.log("Error Company Information Get -", error);
            connectToMongoDB()
            return
        }
    }

    // GET COMPANY DETALIS
    async GetCompany_logo(req, res) {
        try {

            var compantInfo = await company_information.find().select('logo favicon panel_name loginimage')
            if (!compantInfo) {
                return res.send({ status: false, msg: 'Server issue Not find Company information.', data: [] });
            }

            return res.send({ status: true, msg: 'Done', data: compantInfo });


        } catch (error) {
            console.log("Error Company Logo Get -", error);
            connectToMongoDB()
            return

        }
    }

    // EDIT COMPANY Email INFORMATION
    async EditEmailInfo(req, res) {

        try {
            var companydata = req.body.data
            var _id = req.body.id;


            company_information.findById(_id)
                .then(async (value) => {
                    if (!value) {
                        return res.send({ status: false, msg: 'Id not match', data: [] });
                    }
                    const filter = { _id: _id };
                    const updateOperation = { $set: companydata };
                    const result = await company_information.updateOne(filter, updateOperation);
                    if (!result) {
                        return res.send({ status: false, msg: 'Company not update', data: [] });
                    }

                    return res.send({ status: true, msg: 'Update Successfully.', data: [] });

                })


        } catch (error) {
            console.log("Error Edit Email Information-", error);
        }
    }

}


module.exports = new Company();