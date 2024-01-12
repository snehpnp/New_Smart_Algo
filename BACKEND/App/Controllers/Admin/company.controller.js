"use strict";
const db = require('../../Models');
const company_information = db.company_information
const { formattedDateTime } = require('../../Helper/time.helper')

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

            var compantInfo = await company_information.find().select('logo favicon panel_name')
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