"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const ApiCreateInfo = db.api_create_info;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
class Panel {

    // ADD PANEL IN A COLLECTION
    async AddPanel(req, res) {
        try {
            const { panel_name, domain, port, key, ip_address, theme_id, parent_id } = req.body

            // FIND PANEL NAME DUPLICATE
            const panel_data = await panel_model.findOne({ panel_name: panel_name });
            if (panel_data) {
                return res.status(409).json({ status: false, msg: 'Panel Name already exists', data: [] });
            }

            // THEME CREATE SNEH
            const AddPanel = new panel_model({
                panel_name: panel_name,
                domain: domain,
                port: port,
                key: key,
                ip_address: ip_address,
                theme_id: theme_id
            });
            AddPanel.save()
                .then(async (data) => {
                    logger.info('Panel Add successfully', { role: "SUPERADMIN", user_id: parent_id });
                    res.send({ status: true, msg: "successfully Add!", data: data });
                })
                .catch((err) => {
                    // console.log(" Add Time Error-", err);
                    if (err.keyValue) {
                        logger.error('Key duplicate', { role: "SUPERADMIN", user_id: parent_id });
                        return res.status(409).json({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }

                })


        } catch (error) {
            // console.log("Theme error-", error);
            logger.error('Server Error', { role: "SUPERADMIN", user_id: parent_id });

        }
    }

    // ADD PANEL IN A COLLECTION
    async EditPanel(req, res) {
        try {
            const { _id, parent_id, panle_data } = req.body

            panel_model.findById(_id)
                .then(async (value) => {
                    if (!value) {
                        return res.status(409).json({ status: false, msg: 'Id not match', data: [] });
                    }
                    const filter = { _id: _id };
                    const updateOperation = { $set: panle_data };
                    const result = await panel_model.updateOne(filter, updateOperation);
                    if (!result) {
                        return res.status(409).json({ status: false, msg: 'Company not update', data: [] });
                    }
                    logger.info('Update Successfully', { role: "SUPERADMIN", user_id: parent_id });
                    return res.status(200).json({ status: true, msg: 'Update Successfully.', data: result });

                })

        } catch (error) {
            // console.log("Theme error-", error);
            logger.error('Server Error', { role: "SUPERADMIN", user_id: parent_id });

        }
    }


    // USER PROFILE TO GET USER
    async UserProfile(req, res) {
        try {
            const { id } = req.body

            // FIND PANEL NAME DUPLICATE
            const EmailCheck = await User.findOne({ _id: id })
            // .select('UserName Email PhoneNo StartDate EndDate ActiveStatus Role AppLoginStatus WebLoginStatus TradingStatus client_key parent_id parent_role broker web_url qty_type signals_execution_type Is_Active')

            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get User", data: EmailCheck })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }

    // GET ONE PANEL AND HIS THEME INFORMATION
    async GetPanleinformation(req, res) {
        try {
            const { domain } = req.body

            var domain1= "http://localhost:3000"

            if( domain == "sneh.com" || domain== "https://trade.pandpinfotech.com") {
                domain1 = "http://localhost:3000"
            }else{
                domain1 = domain
            }
            // console.log(domain1);
            // FIND PANEL NAME DUPLICATE
            // const Panle_information = await panel_model.findOne({ _id: id })
            const desiredDomain = 'your_desired_domain_value'; // Replace with the desired domain value

            const Panle_information = await panel_model.aggregate([
                {
                    '$match': {
                        'domain': domain1
                    }
                },
                {
                    '$lookup': {
                        'from': 'theme_lists',
                        'localField': 'theme_id',
                        'foreignField': '_id',
                        'as': 'theme_data'
                    }
                }
            ]);



            // CHECK IF PANEL EXIST OR NOT
            if (!Panle_information) {
                return res.status(409).json({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get Panel Information", data: Panle_information })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }


    // GET All Panel
    async GetAllPanel(req, res) {
        try {

            const { page, limit } = req.body;     //LIMIT & PAGE
            const skip = (page - 1) * limit;

            const totalCount = await panel_model.countDocuments();

            // THEME LIST DATA
            const getAllpanel = await panel_model
                .find({})
                .skip(skip)
                .limit(Number(limit))


            // IF DATA NOT EXIST
            if (getAllpanel.length == 0) {
                res.send({ status: false, msg: "Empty data", data: getAllpanel })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Panels name",
                data: getAllpanel,
                page: Number(page),
                limit: Number(limit),
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / Number(limit)),
            })


        } catch (error) {
            console.log("Get all Panels error-", error);
        }
    }



    // Create APi Infor
    async CreateAPiInfo(req, res) {
        try {
            const { title, description, steponeurl, imageone, steptwourl, imagetwo, stepthree, imagethree, note, youtubeurl } = req.body;
            // const images = req.files.map((file) => file.buffer.toString('base64'));

            // Create a new entry in your MongoDB collection
            let a = new ApiCreateInfo({
                title,
                description,
                steponeurl,
                imageone,
                steptwourl,
                imagetwo,
                stepthree,
                imagethree,
                note,
                youtubeurl,
            })
            var ass = a.save()
                .then((data) => {

                    // console.log("data", data)
                    if (data) {
                        res.status(200).send({ status: true, msg: 'Api Create successfully' });

                    }
                })
                .catch((err) => {
                    // console.log("wrro", err)
                    if (err.keyValue) {
                        res.send({ status: false, msg: `name already exists`, error: err.keyValue });
                    } else {
                        res.send({ status: false, msg: 'Internal server error', error: err });

                    }
                })


        } catch (error) {
            // console.error(error.keyValue);
            res.send({ status: false, msg: 'Internal server error', error: error.keyValue });
        }
    }



    // Get All APi Infor
    async GetAllAPiInfo(req, res) {
        try {
            // THEME LIST DATA
            const getAllpanel = await ApiCreateInfo
                .find({})

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



    // Update APi Info
    async UpdateAPiInfo(req, res) {
        try {
            // const {  data } = req.body


            ApiCreateInfo.findById(req.body._id)
                .then(async (value) => {
                    if (!value) {
                        return res.status(409).json({ status: false, msg: 'Id not match', data: [] });
                    }

                    const filter = { _id: req.body._id };
                    const updateOperation = { $set: req.body };
                    const result = await ApiCreateInfo.updateOne(filter, updateOperation);

                    if (!result) {
                        return res.status(409).json({ status: false, msg: 'Company not update', data: [] });
                    }
                    // logger.info('Update Successfully', { role: "SUPERADMIN", user_id: parent_id });
                    return res.status(200).json({ status: true, msg: 'Update Successfully.', data: result });

                })

        } catch (error) {
            console.log("APi Info error-", error);
            // logger.error('Server Error', { role: "SUPERADMIN", user_id: parent_id });

        }
    }



    // GET ONE PANEL AND HIS 
    async GetPanlebroker(req, res) {
        try {
            const { domain } = req.body

            // FIND PANEL NAME DUPLICATE
            var domain1= "http://localhost:3000"

            if( domain == "sneh.com" || domain== "https://trade.pandpinfotech.com") {
                domain1 = "http://localhost:3000"
            }else{
                domain1 = domain
            }
            console.log(domain1);

            const Panel_information = await panel_model.findOne({ domain:domain1 }, 'broker_id');

            // CHECK IF PANEL EXIST OR NOT
            if (!Panel_information) {
                return res.status(409).json({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get Panel Broker", data: Panel_information })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }

}


module.exports = new Panel();