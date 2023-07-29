"use strict";
const company = require('../../Models/company_information.model')
const { formattedDateTime } = require('../../Helper/time.helper')
class Company {
    async AddCompany(req, res) {
        try {
          
            company.findById(_id)
            .then((role) => {})

        } catch (error) {
            console.log("Theme error-", error);
        }
    }
}


module.exports = new Company();