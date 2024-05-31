"use strict";
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
   
            const { id, disclaimer, disclaimer1, disclaimer2, disclaimer3, disclaimer4, disclaimer5 } = req.body


            const findData = await company_information.findOne({ _id: new ObjectId(id) })
            if (!findData) {
                return res.send({
                    status: false,
                    msg: "Id is not Match",
                    data: []
                })
            }

            const filter = { _id: id };
            const updateOperation = { $set: { disclaimer: disclaimer , disclaimer1 : disclaimer1, disclaimer2 :disclaimer2, disclaimer3 :disclaimer3, disclaimer4 : disclaimer4, disclaimer5 : disclaimer5 } };
            const result = await company_information.updateOne(filter, updateOperation);
            if (!result) {
                return res.send({ status: false, msg: 'Company not update', data: [] });
            }
            return res.send({ status: true, msg: 'Update Successfully.', data: [] });

        } catch (error) {
            console.log("Error Edit Company Api -", error);
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