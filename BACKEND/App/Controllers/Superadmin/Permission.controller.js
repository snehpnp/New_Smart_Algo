"use strict";
const db = require('../../Models');
const panel_model = db.panel_model;
const User = db.user;
const MongoClient = require('mongodb').MongoClient;
const ApiCreateInfo = db.api_create_info;
const count_licenses = db.count_licenses;
const Superadmin_History = db.Superadmin_History;


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { formattedDateTime } = require('../../Helper/time.helper')

const axios = require('axios');


class Panel {

    // Get All APi Infor
    async GetPanelDetails(req, res) {
        try {
            const { id, } = req.body


            const Find_panelInfo = await panel_model.find({ _id: id })

            if (!Find_panelInfo) {
                return res.status(409).send({ status: false, msg: 'Panel Not Exist', data: [] });
            }


            let config = {
                method: 'post',
                url: Find_panelInfo[0].backend_rul + 'get/dashboard/count',
                data: {
                    "user_Id": "64c76f1d32067577d02310df"
                }
            };


            axios(config)
                .then(async (response) => {

                    if (response.data.status) {
                        return res.send({ status: true, msg: 'Get Data', data: response.data });
                    } else {
                        return res.send({ status: false, msg: 'User Not Get', data: response.data });
                    }


                })
                .catch((error) => {
                    try {

                        console.log("Error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });


                    } catch (error) {
                        console.log("Error error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });

                    }

                });

          


        } catch (error) {
            console.log("Error Get all Info error-", error);
        }
    }

    // Get All APi Infor
    async GetAllClients(req, res) {
        try {
            const { id, db_name, db_url } = req.body;



            const Find_panelInfo = await panel_model.find({ _id: id })

            if (!Find_panelInfo) {
                return res.status(409).send({ status: false, msg: 'Panel Not Exist', data: [] });
            }


            let config = {
                method: 'post',
                url: Find_panelInfo[0].backend_rul + 'clients/get',
                data: {
                    "Find_Role": "USER"
                }
            };
            axios(config)
                .then(async (response) => {

                    if (response.data.status) {

                        return res.send({ status: true, msg: 'Get Data', data: response.data });

                    } else {
                        return res.send({ status: false, msg: 'User Not Get', data: response.data });
                    }

                })
                .catch((error) => {
                    try {

                        console.log("Error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });


                    } catch (error) {
                        console.log("Error error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });

                    }

                });



        } catch (error) {
            console.log("Error Get all User error-", error);
        }
    }


    // GET ALL SUBADMINS
    async GetAllSubadmins(req, res) {
        try {
            const { id } = req.body
         

            const Find_panelInfo = await panel_model.find({ _id: id })

            if (!Find_panelInfo) {
                return res.status(409).send({ status: false, msg: 'Panel Not Exist', data: [] });
            }


            let config = {
                method: 'post',
                url: Find_panelInfo[0].backend_rul + 'subadmin/get',
                data: {
                    "Find_Role": "SUBADMIN"
                }
            };

            axios(config)
                .then(async (response) => {

                    if (response.data.status) {

                        return res.send({ status: true, msg: 'Get Data', data: response.data });

                    } else {
                        return res.send({ status: false, msg: 'User Not Get', data: response.data });
                    }

                })
                .catch((error) => {
                    try {

                        console.log("Error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });


                    } catch (error) {
                        console.log("error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });

                    }

                });


        } catch (error) {
            console.log("Error Get all Subadmins error-", error);
        }
    }

    // ADD LICENSE
    async AddLicensePanle(req, res) {
        try {
            // const { id, license } = req.body
            const { id, db_name, db_url, license, key, Name } = req.body


            const Find_panelInfo = await panel_model.find({ _id: id })

            if (!Find_panelInfo) {
                return res.status(409).send({ status: false, msg: 'Panel Not Exist', data: [] });
            }



            let config = {
                method: 'post',
                url: Find_panelInfo[0].backend_rul + '/license/add',
                data: {
                    "license": license
                }
            };

            axios(config)
                .then(async (response) => {

                    if (response.data.status) {

                        const filter = { panal_name: "111" };
                        const update = {
                            $set: {
                                superadmin_name: Name,
                                panal_name: Find_panelInfo[0].panel_name,
                                client_id: null,
                                msg: "License Add " + license
                            }
                        };

                        const options = { upsert: true };

                        await Superadmin_History.updateOne(filter, update, options);
                        return res.send({ status: true, msg: 'License Add Successfully', data: [] });



                    } else {

                        return res.send({ status: false, msg: 'License Not Add', data: response.data });

                    }


                })
                .catch((error) => {
                    try {

                        console.log("Error", error);
                        return res.send({ status: false, msg: 'License Not Add', data: error });


                    } catch (error) {
                        console.log("Error error", error);
                        return res.send({ status: false, msg: 'License Not Add', data: error });

                    }

                });



        } catch (error) {
            console.log("Error Add License error-", error);
        }
    }


    // GET ALL Help Center
    async GetAllAdminHelps(req, res) {
        try {
            // const { id } = req.body
            const { id} = req.body

            const Find_panelInfo = await panel_model.find({ _id: id })

            if (!Find_panelInfo) {
                return res.status(409).send({ status: false, msg: 'Panel Not Exist', data: [] });
            }


            let config = {
                method: 'post',
                url: Find_panelInfo[0].backend_rul + 'help/get',
                data: {
                    "Find_Role": "SUBADMIN"
                }
            };

            axios(config)
                .then(async (response) => {

                    if (response.data.status) {

                        return res.send({ status: true, msg: 'Get Data', data: response.data });

                    } else {
                        return res.send({ status: false, msg: 'User Not Get', data: response.data });
                    }

                })
                .catch((error) => {
                    try {

                        console.log("Error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });


                    } catch (error) {
                        console.log("Error error", error);
                        return res.send({ status: false, msg: 'User Not Get', data: error });

                    }

                });


        } catch (error) {
            console.log("Error Get all Subadmins error-", error);
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
            console.log("Error Get all Info error-", error);
        }
    }

    // ADMIN PERMISSIONS
    async Admin_Permissions(req, res) {
        try {

           // console.log("req body check sidebar codition ",req.body)
            // const { id, license } = req.body
            const { db_name, db_url, key, domain, Create_Strategy, Option_chain, Strategy_plan } = req.body



            var domain1 = "http://localhost:3000"

            if (domain == "http://localhost:3000" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "https://trade.pandpinfotech.com"
            } else {
                domain1 = domain
            }

            const getAllpanel = await panel_model.find({ domain: domain1 })

            if (getAllpanel.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getAllpanel })
            }

            const filter = { domain: domain1 };
            const update = {
                $set: {
                    Create_Strategy: Create_Strategy,
                    Option_chain: Option_chain,
                    Strategy_plan: Strategy_plan

                },
            };

            const update_token = await panel_model.updateOne(filter, update);




            // If you want to send the retrieved data as a response
            return res.send({
                status: true,
                msg: "Update Permission Successfully",
                data: update_token
            });


        } catch (error) {
            console.log("Update Permission error-", error);
        }
    }

    // PANEL PERMISSION GET 
    async GetPanlePermistion(req, res) {
        try {
            const { domain } = req.body

            var domain1 = "http://localhost:3000"

            if (domain == "http://localhost:3000" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "https://trade.pandpinfotech.com"
            } else {
                domain1 = domain
            }

            const Panle_information = await panel_model.find({ domain: domain1 }).select('broker_id Create_Strategy Option_chain Strategy_plan , is_active')




            // CHECK IF PANEL EXIST OR NOT
            if (!Panle_information) {
                return res.status(409).json({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Get Panel Permissions", data: Panle_information })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }

    // Panel Close
    async CloseThePanel(req, res) {

        try {
            const { domain, status } = req.body

            var domain1 = "http://localhost:3000"

            if (domain == "http://localhost:3000" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "https://trade.pandpinfotech.com"
            } else {
                domain1 = domain
            }


            const filter = { domain: domain1 };

            const update = {
                $set: { is_active: status },
            };

            const update_token = await panel_model.updateOne(filter, update, { upsert: true });



            // CHECK IF PANEL EXIST OR NOT
            if (!update_token) {
                return res.status(409).json({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Close Panel SuccessFully", data: update_token })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }

    async updateBrokerPermission(req, res) {
        try {
            const { domain, data } = req.body
            var domain1 = "http://localhost:3000"
            if (domain == "http://localhost:3000" || domain == "https://trade.pandpinfotech.com") {
                domain1 = "https://trade.pandpinfotech.com"
            } else {
                domain1 = domain
            }

            const filter = { domain: domain1 };
            const update = {
                $set: { broker_id: data },
            };

            const update_token = await panel_model.updateOne(filter, update);

            // CHECK IF PANEL EXIST OR NOT
            if (!update_token) {
                return res.send({ status: false, msg: 'Panle Not exist Not exists', data: [] });
            }
            res.send({ status: true, msg: "Broker Update SuccessFully", data: update_token })

        } catch (error) {
            // console.log("Theme error-", error);
        }
    }


}


module.exports = new Panel();