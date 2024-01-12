"use strict";
const db = require('../../Models');
const Theme_list = db.theme_list;
const panel_model = db.panel_model;

const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const { formattedDateTime } = require('../../Helper/time.helper')
class Theme {

    // ADD THEME
    async AddTheme(req, res) {
        try {
            const { theme_name, theme_version, primary_col, nav_head_col, header_col, sidebar_col
                , sidebar, header_position, sidebar_position, layout, container, body_font, dashboard, image } = req.body

            const exist_strategy = await Theme_list.findOne({ theme_name: theme_name });
            if (exist_strategy) {
                return res.status(409).json({ status: false, msg: 'Theme Name already exists', data: [] });
            }


            var lastElement;
            // FIND TABLE THEME DATA LAST INDEX
            const theme_list = await Theme_list.find().sort({ themeId: 1 })

            if (theme_list.length != 0) {
                lastElement = (theme_list[theme_list.length - 1]).themeId + 1;
            } else {
                lastElement = 1;
            }

            // THEME CREATE SNEH
            const AddTheme = new Theme_list({
                themeId: lastElement,
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


            AddTheme.save()
                .then(async (data) => {
                    res.send({ status: true, msg: "successfully Add!", data: data });
                })
                .catch((err) => {
                    // console.log("err", err);
                    if (err.keyValue) {
                        res.send({ status: false, msg: "Duplicate data", data: err.keyValue });
                    }

                })



        } catch (error) {
            console.log("Error Theme error-", error);
        }
    }

    // GET THEME
    async GetAllTheme(req, res) {
        try {

            // const { page, limit } = req.body;
            // const skip = (page - 1) * limit;

            const totalCount = await Theme_list.countDocuments();


            // THEME LIST DATA
            // var getAllTheme = await Theme_list.find()
            const getAllTheme = await Theme_list
                .find({})
            // .skip(skip)
            // .limit(Number(limit))


            // IF DATA NOT EXIST
            if (getAllTheme.length == 0) {
                res.send({ status: false, msg: "Empty data", data: getAllTheme })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Theme name",
                data: getAllTheme,
                // page: Number(page),
                // limit: Number(limit),
                // totalCount: totalCount,
                // totalPages: Math.ceil(totalCount / Number(limit)),
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
            res.send({ status: false, msg: "Empty data", data: getAllTheme })
        }

        // DATA GET SUCCESSFULLY
        res.send({
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
            res.send({
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


            // GET LOGIN CLIENTS
            const getAllTradingClients = await panel_model.find({
                _id: req.body.userid
            });


            const totalCount = getAllTradingClients.length;

            // IF DATA NOT EXIST
            if (getAllTradingClients.length == 0) {
                return res.send({ status: false, msg: "Theme Not Found", data: [], totalCount: totalCount, })
            }


            var objectId = new ObjectId(req.body.theme_id);


            var updateValues = { theme_id: objectId, };

            const updatedDocument = await panel_model.findByIdAndUpdate(getAllTradingClients[0]._id, updateValues, {
                new: true, // To return the updated document
            });


            // DATA GET SUCCESSFULLY



            res.send({
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

            // console.log("res ",req.body)
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