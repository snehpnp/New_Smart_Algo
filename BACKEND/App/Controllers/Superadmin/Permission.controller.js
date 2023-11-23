"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const MongoClient = require('mongodb').MongoClient;
const ApiCreateInfo = db.api_create_info;
const count_licenses = db.count_licenses;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { formattedDateTime } = require('../../Helper/time.helper')





class Panel {

    // Get All APi Infor
    async GetPanelDetails(req, res) {
        try {
            const { id, db_name, db_url } = req.body

            const uri = db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db('test');

            const viewName = 'dashboard_data';


            // Query the view to get the data
            const result = await db.collection(viewName).find().limit(100).toArray();

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
            const { id, db_name, db_url } = req.body;
    
            const uri = db_url;
    
            // Use a connection pool to reuse connections
            var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db('test');
    
            const collectionName = 'users';
    
            // Create an index for the 'Role' field if it's frequently used in queries
            await db.collection(collectionName).createIndex({ Role: 1 });
    
            // Use projection to fetch only the necessary fields
            const result = await db.collection(collectionName).find({ Role: "USER" }, { projection: { /* Specify your projected fields here */ } }).toArray();
    
            // If you want to send the retrieved data as a response
            return res.send({
                status: true,
                msg: "Get All Users",
                data: result
            });
    
        } catch (error) {
            console.log("Get all User error-", error);
        } finally {
            // Close the connection after use to release resources
            await client.close();
        }
    }
    

    // GET ALL SUBADMINS
    async GetAllSubadmins(req, res) {
        try {
            const { id, db_name, db_url } = req.body
            const uri = db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(db_name);

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
            // const { id, license } = req.body
            const { id, db_name, db_url, license, key } = req.body

            // console.log(typeof license);
            // console.log(license);

            const uri = db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db('test');
            // const db = db_name;

            const companies_collection = db.collection('companies');
            const countLicense_collection = db.collection('count_licenses');

            const viewName = 'companies';


            // Specify the query condition for updating
            const queryCondition = {
                // panel_key: getPanelInfo[0].key // Replace with your desired query condition
                panel_key: key // Replace with your desired query condition
            };

            // Query the view to get the data
            const findResult = await db.collection(viewName).find().project({ licenses: 1 }).toArray();
            const newLicensesValue = Number(findResult[0].licenses) + Number(license);
       

        
            const updateOperation = {
                $set: {
                    licenses: newLicensesValue
                }
            };

            const objectId = new ObjectId("64c76f1d32067577d02310df");

            // Update documents that match the query condition
            const updateResult = await companies_collection.updateMany(queryCondition, updateOperation);
            
            // const newCompany = new countLicense_collection({ admin_license: Number(license), user_id: objectId });
            // newCompany.save()

            const newCompany =   await countLicense_collection.insertOne({ admin_license: Number(license), user_id: objectId,  createdAt: new Date(),
                updatedAt: new Date() });
           
            // const newCompany = await countLicense_collection.create({
            //     admin_license: Number(license),
            //     user_id: objectId
            //   });
            
            
            console.log(newCompany);
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

    // GET ALL Help Center
    async GetAllAdminHelps(req, res) {
        try {
            // const { id } = req.body
            const { id, db_name, db_url, startdate, enddate } = req.body

            const uri = db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(db_name);

            const viewName = 'helpcenters';

            const startDate = new Date(startdate);
            const endDate = new Date(enddate);

            // Query the view to get the data
            const result = await db.collection(viewName).find({}).toArray();

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

    // Admin Sidebar Permission
    async GetAll_Broker_details(req, res) {
        try {
            // THEME LIST DATA
            const getAllpanel = await ApiCreateInfo
                .find({}).select("title  broker_id _id ")

            // IF DATA NOT EXIST
            if (getAllpanel.length == 0) {
                res.send({ status: false, msg: "Empty data", data: getAllpanel })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Api Info",
                data: getAllpanel,
            })


        } catch (error) {
            console.log("Get all Info error-", error);
        }
    }

    // ADMIN PERMISSIONS
    async Admin_Permissions(req, res) {
        try {
            // const { id, license } = req.body
            const { id, db_name, db_url, license, key } = req.body

            const uri = db_url;

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(db_name);
            // const db = db_name;

            const companies_collection = db.collection('companies');
            const viewName = 'companies';


            // Specify the query condition for updating
            const queryCondition = {
                // panel_key: getPanelInfo[0].key // Replace with your desired query condition
                panel_key: key // Replace with your desired query condition
            };

            // Query the view to get the data
            const findResult = await db.collection(viewName).find().project({ licenses: 1 }).toArray();

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
            console.log("Add License error-", error);path
        }
    }

    // PANEL PERMISSION GET 
    async GetPanlePermistion(req, res) {
        try {
            const { domain } = req.body

            var domain1= "http://localhost:3000"

            if( domain == "sneh.com" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "http://localhost:3000"
            }else{
                domain1 = domain
            }
            // console.log(domain1);

            const Panle_information = await panel_model.find({ domain:domain1 }).select('broker_id Create_Strategy Option_chain Strategy_plan')




            // CHECK IF PANEL EXIST OR NOT
            if (!Panle_information) {
                return res.status(409).json({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get Panel Permissions", data: Panle_information })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }
}


module.exports = new Panel();