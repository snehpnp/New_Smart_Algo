"use strict";
const db = require('../../Models');
const company_information = db.company_information
const { formattedDateTime } = require('../../Helper/time.helper')
class Company {
    async EditCompany(req, res) {
        try {


            var _id = req.body.id;

            company_information.findById(_id)
                .then((value) => {
                  
                    if (!value) {
                        return res.status(409).json({ status: false, msg: 'Id not match', data: [] });
                    }


                    console.log("value", value);



                })


            company_information.findById(_id)
            .then((role) => {})


        } catch (error) {
            console.log("Theme error-", error);
        }
    }
}


module.exports = new Company();