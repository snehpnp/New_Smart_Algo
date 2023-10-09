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
    async GetLicenseDetails(req, res) {
        try {
            const { id } = req.body
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
            const users_collection = db.collection('users');

            // DATA GET SUCCESSFULLY
            return res.send({
                status: true,
                msg: "Get All Api Info",
                data: getPanelInfo,
            })


        } catch (error) {
            console.log("Get all Info error-", error);
        }
    }



    // Get All APi Infor
    async GetAllClients(req, res) {
        try {
            const { id } = req.body;
            const objectId = new ObjectId(id);

            // GET PANEL INFO
            const getPanelInfo = await panel_model.find({ _id: objectId });

            // IF DATA NOT EXIST
            if (getPanelInfo.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getPanelInfo });
            }

            const uri = getPanelInfo[0].db_url;
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            await client.connect();
            const db = client.db(getPanelInfo[0].db_name);
            const users_collection = db.collection('users');

            const query = { Role: "USER"};
            const foundUsers = await users_collection.find(query).toArray(); // await ka istemal kiya hai yahan

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Api Info",
                data: foundUsers,
            });
            // Client ko band karein ya connection ko release karein jab aapka kaam ho gaya ho
            client.close();

        } catch (error) {
            console.log("Get all Info error-", error);
        }
    }



}


module.exports = new Panel();