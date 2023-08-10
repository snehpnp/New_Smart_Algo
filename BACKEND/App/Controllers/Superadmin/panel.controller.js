"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;

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

     // ADD PANEL IN A COLLECTION
     async EditPanel(req, res) {
        try {
            const { _id,panle_data } = req.body

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

                return res.status(200).json({ status: true, msg: 'Update Successfully.', data:result });

            })

        } catch (error) {
            console.log("Theme error-", error);
        }
    }


    // USER PROFILE TO GET USER 
    async UserProfile(req, res) {
        try {
            const { userId } = req.body

            // FIND PANEL NAME DUPLICATE
            const EmailCheck = await User.findOne({ _id: userId })

            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get User", data: EmailCheck })

        } catch (error) {
            console.log("Theme error-", error);
        }
    }

     // GET ONE PANEL AND HIS THEME INFORMATION
     async GetPanleinformation(req, res) {
        try {
            const { id } = req.body

            // FIND PANEL NAME DUPLICATE
            // const Panle_information = await panel_model.findOne({ _id: id })
            const Panle_information = await panel_model.aggregate(

                [
                    {
                      '$lookup': {
                        'from': 'theme_lists', 
                        'localField': 'theme_id', 
                        'foreignField': '_id', 
                        'as': 'theme_data'
                      }
                    }
                    // ,
                    // {
                    //     '$lookup': {
                    //       'from': 'companies', 
                    //       'localField': 'theme_id', 
                    //       'foreignField': 'theme_id', 
                    //       'as': 'compnay_data'
                    //     }
                    //   },
                  ]
            )


            if (!Panle_information) {
                return res.status(409).json({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get User", data: Panle_information })

        } catch (error) {
            console.log("Theme error-", error);
        }
    }

    // GET All Panel  
    async GetAllPanel(req, res) {
        try {

            const { page, limit } = req.body;
            const skip = (page - 1) * limit;

            const totalCount = await panel_model.countDocuments();


            // THEME LIST DATA
            // var getAllTheme = await Theme_list.find()
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



}


module.exports = new Panel();