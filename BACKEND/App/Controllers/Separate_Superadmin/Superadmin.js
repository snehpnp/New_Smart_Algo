"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
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


            const findResult = await company_information.find().project({ licenses: 1 }).

                console.log("findResult", findResult);

            return
            // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            // await client.connect();
            // const db = client.db(process.env.DB_NAME);
            // // const db = db_name;

            // const companies_collection = db.collection('companies');
            // const countLicense_collection = db.collection('count_licenses');

            // const viewName = 'companies';


            // // Specify the query condition for updating
            // const queryCondition = {
            //     // panel_key: getPanelInfo[0].key // Replace with your desired query condition
            //     panel_key: key // Replace with your desired query condition
            // };

            // // Query the view to get the data
            // const findResult = await db.collection(viewName).find().project({ licenses: 1 }).toArray();
            // const newLicensesValue = Number(findResult[0].licenses) + Number(license);



            // const updateOperation = {
            //     $set: {
            //         licenses: newLicensesValue
            //     }
            // };

            // const objectId = new ObjectId("64c76f1d32067577d02310df");

            // // Update documents that match the query condition
            // const updateResult = await companies_collection.updateMany(queryCondition, updateOperation);


            // const newCompany = await countLicense_collection.insertOne({
            //     admin_license: Number(license), user_id: objectId, createdAt: new Date(),
            //     updatedAt: new Date()
            // });



            // // If you want to send the retrieved data as a response
            // return res.send({
            //     status: true,
            //     msg: "Add License",
            //     data: updateResult
            // });


        } catch (error) {
            console.log("Add License error-", error);
        }
    }


}


module.exports = new SuperAdmin();