"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const ApiCreateInfo = db.api_create_info;
const Superadmin_History = db.Superadmin_History;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { formattedDateTime } = require('../../Helper/time.helper')

class Panel {

    // ADD PANEL IN A COLLECTION
    async AddPanel(req, res) {
        try {
            const { panel_name, domain, port, key, ip_address, theme_id, backend_rul,parent_id, Create_Strategy, Option_chain, Strategy_plan, broker_id } = req.body.req


            // FIND PANEL NAME DUPLICATE
            const panel_data = await panel_model.findOne({ panel_name: panel_name });
            if (panel_data) {
                return res.status(409).send({ status: false, msg: 'Panel Name already exists', data: [] });
            }

            // THEME CREATE SNEH
            const AddPanel = new panel_model({
                panel_name: panel_name,
                domain: domain,
                port: port,
                key: key,
                ip_address: ip_address,
                theme_id: theme_id,
                Create_Strategy: Create_Strategy,
                Option_chain: Option_chain,
                Strategy_plan: Strategy_plan,
                broker_id: broker_id,
                backend_rul:backend_rul
            });
            AddPanel.save()
                .then(async (data) => {
                    logger.info('Panel Add successfully', { role: "SUPERADMIN", user_id: parent_id });
                    return res.send({ status: true, msg: "successfully Add!", data: data });
                })
                .catch((err) => {
                    if (err.keyValue) {
                        logger.error('Key duplicate', { role: "SUPERADMIN", user_id: parent_id });
                        return res.status(409).send({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }

                })


        } catch (error) {
            logger.error('Server Error', { role: "SUPERADMIN", user_id: parent_id });

        }
    }

    // ADD PANEL IN A COLLECTION
    async EditPanel(req, res) {
        try {
            const { _id, panel_name, domain, port, key, ip_address, theme_id, db_url,backend_rul, db_name, broker_id, Create_Strategy, Option_chain, Strategy_plan } = req.body


            var panle_data = {
                panel_name: panel_name,
                domain: domain,
                port: port,
                key: key,
                ip_address: ip_address,
                theme_id: theme_id,
                db_url: db_url,
                db_name: db_name,
                broker_id: broker_id.filter((data) => data.checked == true),
                Create_Strategy: Create_Strategy,
                Option_chain: Option_chain,
                Strategy_plan: Strategy_plan,
                backend_rul:backend_rul
            }

            var objectId = new ObjectId(_id);

            const panel_data = await panel_model.find({ _id: objectId });

            if (!panel_data) {
                return res.send({ status: false, msg: 'Panel Not exists', data: [] });
            }




            const filter = { _id: _id };
            const updateOperation = { $set: panle_data };
            const result = await panel_model.updateOne(filter, updateOperation);
            if (!result) {
                return res.status(409).send({ status: false, msg: 'Company not update', data: [] });
            }
            // logger.info('Update Successfully', { role: "SUPERADMIN", user_id: parent_id });
            return res.status(200).send({ status: true, msg: 'Update Successfully.', data: result });


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

            if (!EmailCheck) {
                return res.status(409).send({ status: false, msg: 'User Not exists', data: [] });
            }
            return res.send({ status: true, msg: "Get User", data: EmailCheck })

        } catch (error) {
        }
    }

    // GET ONE PANEL AND HIS THEME INFORMATION
    async GetPanleinformation(req, res) {
        try {
            const { domain } = req.body

            var domain1 = "http://localhost:3000"

            if (domain == "sneh.com" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "http://localhost:3000"
            } else {
                domain1 = domain
            }
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
                return res.status(409).send({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            return res.send({ status: true, msg: "Get Panel Information", data: Panle_information })

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
                return res.send({ status: false, msg: "Empty data", data: getAllpanel })
            }

            // DATA GET SUCCESSFULLY
            return res.send({
                status: true,
                msg: "Get All Panels name",
                data: getAllpanel,
                page: Number(page),
                limit: Number(limit),
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / Number(limit)),
            })


        } catch (error) {
            console.log("Error Get all Panels error-", error);
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

                    if (data) {
                        return res.status(200).send({ status: true, msg: 'Api Create successfully' });

                    }
                })
                .catch((err) => {
                    if (err.keyValue) {
                        return res.send({ status: false, msg: `name already exists`, error: err.keyValue });
                    } else {
                        return res.send({ status: false, msg: 'Internal server error', error: err });

                    }
                })


        } catch (error) {
        
            return res.send({ status: false, msg: 'Internal server error', error: error.keyValue });
        }
    }



    // Get All APi Infor
    async GetAllAPiInfo(req, res) {
        try {


            const panel_data = await panel_model.find({ domain: req.body.url }).select('broker_id')
            if (!panel_data) {
                return res.status(409).send({ status: false, msg: 'Panel Not exists', data: [] });
            }

            var objectIds = panel_data[0].broker_id.map((data) => data.id);

            var tt
            if (req.body.brokerId == -1) {
                tt = { $in: objectIds }
            } else {
                tt = req.body.brokerId
            }

                
            // Find documents with matching ids
            const getAllpanel = await ApiCreateInfo.find({ broker_id: tt })


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
            console.log("Error Get all Info error-", error);
        }
    }


    // Get All APi Infor
    async GetAllAPiInfo_Super(req, res) {
        try {


            const panel_data = await panel_model.find({ domain: req.body.url }).select('broker_id')
            if (!panel_data) {
                return res.status(409).send({ status: false, msg: 'Panel Not exists', data: [] });
            }



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
            console.log("Error Get all Info error-", error);
        }
    }


    // Update APi Info
    async UpdateAPiInfo(req, res) {
        try {
            // const {  data } = req.body


            ApiCreateInfo.findById(req.body._id)
                .then(async (value) => {
                    if (!value) {
                        return res.status(409).send({ status: false, msg: 'Id not match', data: [] });
                    }

                    const filter = { _id: req.body._id };
                    const updateOperation = { $set: req.body };
                    const result = await ApiCreateInfo.updateOne(filter, updateOperation);

                    if (!result) {
                        return res.status(409).send({ status: false, msg: 'Company not update', data: [] });
                    }
                    // logger.info('Update Successfully', { role: "SUPERADMIN", user_id: parent_id });
                    return res.status(200).send({ status: true, msg: 'Update Successfully.', data: result });

                })

        } catch (error) {
            console.log("Error APi Info error-", error);
            // logger.error('Server Error', { role: "SUPERADMIN", user_id: parent_id });

        }
    }



    // GET ONE PANEL AND HIS 
    async GetPanlebroker(req, res) {
        try {
            const { domain } = req.body

            // FIND PANEL NAME DUPLICATE
            var domain1 = "http://localhost:3000"

            if (domain == "http://localhost:3000" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "https://trade.pandpinfotech.com"
            } else {
                domain1 = domain
            }

            const Panel_information = await panel_model.findOne({ domain: domain1 }, 'broker_id');

            // CHECK IF PANEL EXIST OR NOT
            if (!Panel_information) {
                return res.status(409).send({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get Panel Broker", data: Panel_information })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }


    // GET SUPER ADMIN HISTORY     
    async GetHistoryData(req, res) {
        try {


            const { page, limit } = req.body;     //LIMIT & PAGE
            const skip = (page - 1) * limit;

            const totalCount = await Superadmin_History.countDocuments();

            // THEME LIST DATA
            const getAllHistory = await Superadmin_History
                .find({})
                .skip(skip)
                .limit(Number(limit))


            // IF DATA NOT EXIST
            if (getAllHistory.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getAllHistory })
            }

            // DATA GET SUCCESSFULLY
            return res.send({
                status: true,
                msg: "Get All Panels name",
                data: getAllHistory,
                page: Number(page),
                limit: Number(limit),
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / Number(limit)),
            })


        } catch (error) {
            console.log("Error Get all Panels error-", error);
        }
    }

}


module.exports = new Panel();