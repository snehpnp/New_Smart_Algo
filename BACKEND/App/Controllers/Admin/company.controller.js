"use strict";
const company = require('../../Models/company_information.model')
const { formattedDateTime } = require('../../Helper/time.helper')
class Company {
    async EditCompany(req, res) {
        try {


            var _id = req.body.id;

            company.findById(_id)
                .then((value) => {
                  
                    if (!value) {
                        return res.status(409).json({ status: false, msg: 'Id not match', data: [] });
                    }


                    console.log("value", value);



                })


            company.findById(_id)
            .then((role) => {})


        } catch (error) {
            console.log("Theme error-", error);
        }
    }
}


module.exports = new Company();