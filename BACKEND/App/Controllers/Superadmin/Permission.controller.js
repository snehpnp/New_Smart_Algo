"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { formattedDateTime } = require('../../Helper/time.helper')





class Panel {

    // Get All APi Infor
    async GetPanelDetails(req, res) {
        try {
            const { id } = req.body

            if (!id) {
                return res.send({ status: false, msg: "Enter Panel Id", data: [] })
            }

            const objectId = new ObjectId(id);

            // GET PANEL INFO
            const getPanelInfo = await panel_model.find({ _id: objectId })

            // IF DATA NOT EXIST
            if (getPanelInfo.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getPanelInfo })
            }


            // const uri = getPanelInfo[0].db_url;
            const uri = getPanelInfo[0].db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(getPanelInfo[0].db_name);

            const viewName = 'dashboard_data';

            // Query the view to get the data
            const result = await db.collection(viewName).find().toArray();

            // If you want to send the retrieved data as a response
            return res.send({
                status: true,
                msg: "Get All Api Info",
                data: result
            });


        } catch (error) {
            console.log("Get all Info error-", error);
        }
    }



    // Get All APi Infor
    async GetAllClients(req, res) {
        try {
            const { id } = req.body

            if (!id) {
                return res.send({ status: false, msg: "Enter Panel Id", data: [] })
            }

            const objectId = new ObjectId(id);

            // GET PANEL INFO
            const getPanelInfo = await panel_model.find({ _id: objectId })

            // IF DATA NOT EXIST
            if (getPanelInfo.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getPanelInfo })
            }


            // const uri = getPanelInfo[0].db_url;
            const uri = getPanelInfo[0].db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(getPanelInfo[0].db_name);

            const viewName = 'users';

            // Query the view to get the data
            const result = await db.collection(viewName).find({ Role: "USER" }).toArray();

            // If you want to send the retrieved data as a response
            return res.send({
                status: true,
                msg: "Get All Users",
                data: result
            });


        } catch (error) {
            console.log("Get all User error-", error);
        }
    }
    // GET ALL SUBADMINS
    async GetAllSubadmins(req, res) {
        try {
            const { id } = req.body

            if (!id) {
                return res.send({ status: false, msg: "Enter Panel Id", data: [] })
            }

            const objectId = new ObjectId(id);

            // GET PANEL INFO
            const getPanelInfo = await panel_model.find({ _id: objectId })

            // IF DATA NOT EXIST
            if (getPanelInfo.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getPanelInfo })
            }


            // const uri = getPanelInfo[0].db_url;
            const uri = getPanelInfo[0].db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(getPanelInfo[0].db_name);

            const viewName = 'users';

            // Query the view to get the data
            const result = await db.collection(viewName).find({ Role: "SUBADMIN" }).toArray();

            // If you want to send the retrieved data as a response
            return res.send({
                status: true,
                msg: "Get All Subadmins",
                data: result
            });


        } catch (error) {
            console.log("Get all Subadmins error-", error);
        }
    }


    // ADD LICENSE
    async AddLicensePanle(req, res) {
        try {
            const { id, license } = req.body

            if (!id) {
                return res.send({ status: false, msg: "Enter Panel Id", data: [] })
            }

            const objectId = new ObjectId(id);

            // GET PANEL INFO
            const getPanelInfo = await panel_model.find({ _id: objectId })

            // IF DATA NOT EXIST
            if (getPanelInfo.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getPanelInfo })
            }

            const uri = getPanelInfo[0].db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(getPanelInfo[0].db_name);
            
            const companies_collection = db.collection('companies');
            const viewName = 'companies';


            // Specify the query condition for updating
            const queryCondition = {
                panel_key: getPanelInfo[0].key // Replace with your desired query condition
            };


            // Query the view to get the data
            const findResult = await db.collection(viewName).find().project({ licenses: 1}).toArray();

            const newLicensesValue = findResult[0].licenses + license;

            const updateOperation = {
                $set: {
                    licenses: newLicensesValue
                }
            };

            // Update documents that match the query condition
            const updateResult = await companies_collection.updateMany(queryCondition, updateOperation);



            // If you want to send the retrieved data as a response
            return res.send({
                status: true,
                msg: "Add License",
                data: updateResult
            });


        } catch (error) {
            console.log("Add License error-", error);
        }
    }

}


module.exports = new Panel();