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

            company.findById(_id)
                .then(async (value) => {
                if (!value) {
                        return res.status(409).json({ status: false, msg: 'Id not match', data: [] });
                    }
                    console.log("value", value);

                    const filter = { _id: ObjectId(_id) };
                    const updateOperation = { $set: companydata };

                    const result = await collection.updateOne(filter, updateOperation);
                })


        } catch (error) {
            console.log("Theme error-", error);
        }
    }

    // GET COMPANY DETALIS
    async GetCompanyInfo(req, res) {
        try {

            var compantInfo = await company.find()
            if (!compantInfo) {
                return res.status(409).json({ status: false, msg: 'Server issue Not find Company information.', data: [] });
            }

            console.log("compantInfo", compantInfo);

            return res.status(409).json({ status: true, msg: 'Done', data: compantInfo });


        } catch (error) {
            console.log("Comany Get Error -", error);
        }
    }
}


module.exports = new Company();