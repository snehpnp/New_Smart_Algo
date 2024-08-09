"use strict";
const db = require('../../Models');
const Theme_list = db.theme_list;
const panel_model = db.panel_model;
const Superadmin_History = db.Superadmin_History;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class Theme {

    // ADD THEMEcdccddcfdfdfkdl;gmdklgmdmsl;kdmsklfmdk
    async AddTheme(req, res) {
        try {
            const {
                theme_name, theme_version, primary_col, nav_head_col, header_col, sidebar_col,
                sidebar, header_position, sidebar_position, layout, container, body_font,
                dashboard, image
            } = req.body;

            // Check if theme name already exists
            const existingTheme = await Theme_list.findOne({ theme_name: theme_name });
            if (existingTheme) {
                return res.status(409).json({ status: false, msg: 'Theme Name already exists', data: [] });
            }

            // Get the last theme ID and increment it
            const themeList = await Theme_list.find().sort({ themeId: 1 });
            const newThemeId = themeList.length !== 0 ? themeList[themeList.length - 1].themeId + 1 : 1;

            // Create a new theme
            const newTheme = new Theme_list({
                themeId: newThemeId,
                theme_name: theme_name,
                theme_version: theme_version,
                primary_col: primary_col,
                nav_head_col: nav_head_col,
                header_col: header_col,
                sidebar_col: sidebar_col,
                layout: layout,
                sidebar: sidebar,
                header_position: header_position,
                sidebar_position: sidebar_position,
                container: container,
                body_font: body_font,
                dashboard: dashboard,
                image: image,
            });

            // Save the new theme
            const savedTheme = await newTheme.save();
            return res.send({ status: true, msg: "Theme successfully added!", data: savedTheme });

        } catch (error) {
            console.log("Error in AddTheme:", error);
            return res.status(500).json({ status: false, msg: "Internal Server Error", data: error });
        }
    }

    
    // GET THEME
    async GetAllTheme(req, res) {
        try {

            const totalCount = await Theme_list.countDocuments();

            const getAllTheme = await Theme_list
                .find({})


            // IF DATA NOT EXIST
            if (getAllTheme.length == 0) {
              return  res.send({ status: false, msg: "Empty data", data: getAllTheme })
            }

            // DATA GET SUCCESSFULLY
            return res.send({
                status: true,
                msg: "Get All Theme name",
                data: getAllTheme,
            })


        } catch (error) {
            console.log("Error Get all theme error-", error);
        }
    }

    // GET THEME
    async GetAllThemeName(req, res) {
        try {



            const getAllTheme = await Theme_list
                .find({}).select('theme_name')



            // IF DATA NOT EXIST
            if (getAllTheme.length == 0) {
                return({ status: false, msg: "Empty data", data: getAllTheme })
            }

            // DATA GET SUCCESSFULLY
            return res.send({
                status: true,
                msg: "Get All Theme name",
                data: getAllTheme,

            })


        } catch (error) {
            console.log("Error Get all theme error-", error);
        }
    }

    // GET ALL TRADING ON  CLIENTS
    async GetThemeByIdThemeId(req, res) {
        try {


            const getAllTradingClients = await Theme_list.find({
                _id: req.body._id
            });
            const totalCount = getAllTradingClients.length;

            // IF DATA NOT EXIST
            if (getAllTradingClients.length == 0) {
                return res.send({ status: false, msg: "Theme Not Found", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            return  res.send({
                status: true,
                msg: "Get Your Theme",
                data: getAllTradingClients,

            })
        } catch (error) {
            console.log("Error trading Clients Error-", error);
        }
    }


    // UPDATE COMPANY THEME
    async UpdatePanelTheme(req, res) {
        try {


            const getAllTradingClients = await panel_model.find({
                _id: req.body.userid
            });

            const totalCount = getAllTradingClients.length;

            if (getAllTradingClients.length == 0) {
                return res.send({ status: false, msg: "Theme Not Found", data: [], totalCount: totalCount, })
            }

            var objectId = new ObjectId(req.body.theme_id);
            var updateValues = { theme_id: objectId, };

            const updatedDocument = await panel_model.findByIdAndUpdate(getAllTradingClients[0]._id, updateValues, {
                new: true, 
            });

            const filter = { panal_name: "111" };
            const update = {
                $set: {
                    superadmin_name: req.body.UserName,
                    panal_name: getAllTradingClients[0].panel_name,
                    client_id: null,
                    msg: "Theme Change"
                }
            };

            const options = { upsert: true };

            await Superadmin_History.updateOne(filter, update, options);


           return res.send({
                status: true,
                msg: "Theme Update Successfully",
                data: updatedDocument,

            })
        } catch (error) {
            console.log("Error trading Clients Error-", error);
        }
    }


    // UPDATE THEME IMAGE
    async UpdatetThemeImage(req, res) {
        try {

            var objectId = new ObjectId(req.body.theme_id);


            // GET LOGIN CLIENTS
            const getAllTradingClients = await Theme_list.find({
                _id: objectId
            });

            const totalCount = getAllTradingClients.length;

            // IF DATA NOT EXIST
            if (getAllTradingClients.length == 0) {
                return res.send({ status: false, msg: "Theme Not Found", data: [], totalCount: totalCount, })
            }




            const filter = { _id: req.body.theme_id };
            const updateOperation = { $set: { image: req.body.image } };


            const result = await Theme_list.updateOne(filter, updateOperation);

            if (!result) {
                return res.send({ status: false, msg: 'Theme not update', data: [] });
            }
            return res.send({ status: true, msg: 'Update Successfully.', data: [] });


        } catch (error) {
            console.log("Error trading Clients Error-", error);
        }
    }


}


module.exports = new Theme();