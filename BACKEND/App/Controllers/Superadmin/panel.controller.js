"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const { formattedDateTime } = require('../../Helper/time.helper')
class Panel {

    // ADD PANEL IN A COLLECTION
    async AddPanel(req, res) {
        try {
            const { panel_name, domain, port, key, ip_address, theme_id } = req.body

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
                    res.send({ status: true, msg: "successfully Add!", data: data });
                })
                .catch((err) => {
                    console.log(" Add Time Error-", err);
                    if (err.keyValue) {
                        return res.status(409).json({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }

                })


        } catch (error) {
            console.log("Theme error-", error);
        }
    }

    // // GET THEME 
    // async GetAllTheme(req, res) {
    //     try {

    //         const { page, limit } = req.body;
    //         const skip = (page - 1) * limit;

    //         const totalCount = await Theme_list.countDocuments();


    //         // THEME LIST DATA 
    //         // var getAllTheme = await Theme_list.find()
    //         const getAllTheme = await Theme_list
    //             .find({})
    //             .skip(skip)
    //             .limit(Number(limit))


    //         // IF DATA NOT EXIST
    //         if (getAllTheme.length == 0) {
    //             res.send({ status: false, msg: "Empty data", data: getAllTheme })
    //         }

    //         // DATA GET SUCCESSFULLY
    //         res.send({
    //             status: true,
    //             msg: "Get All Theme name",
    //             data: getAllTheme,
    //             page: Number(page),
    //             limit: Number(limit),
    //             totalCount: totalCount,
    //             totalPages: Math.ceil(totalCount / Number(limit)),
    //         })


    //     } catch (error) {
    //         console.log("Get all theme error-", error);
    //     }
    // }


}


module.exports = new Panel();