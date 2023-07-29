"use strict";
const company = require('../../Models/company_information.model')
// const { formattedDateTime } = require('../../Helper/time.helper')
class Company {
    async AddCompany(req, res) {
        try {
          
            company.find()
            .then((role) => {})

            // THEME CREATE SNEH
            // const AddTheme = new Theme_list({
            //     themeId: lastElement,
            //     theme_name: theme_name,
            //     theme_version: theme_version,
             
            // });
            // AddTheme.save()
            //     .then(async (data) => {
            //         res.send({ status: true, msg: "successfully Add!", data: data });
            //     })



        } catch (error) {
            console.log("Theme error-", error);
        }
    }
}


module.exports = new Theme();