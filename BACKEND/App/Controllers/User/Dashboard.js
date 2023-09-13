"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');
const User_model = db.user;
const Role_model = db.role;
const Company_info = db.company_information;
const user_logs = db.user_logs;
const client_services = db.client_services;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Subadmin_Permission = db.Subadmin_Permission;
var dateTime = require('node-datetime');
var dt = dateTime.create();

// OK
// Product CLASS
class Dashboard {

    // ONE USER GET ALL TRADING STATUS
    async getClientServices(req, res) {
        try {
            const { user_Id } = req.body;
            // GET LOGIN CLIENTS
            const objectId = new ObjectId(user_Id);
            const pipeline = [
                {
                    $match: {
                        user_id: objectId
                    }
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "service_id",
                        foreignField: "_id",
                        as: "service",
                    },
                },
                {
                    $unwind: '$service',
                },
                {
                    $lookup: {
                        from: "strategies",
                        localField: "strategy_id",
                        foreignField: "_id",
                        as: "strategys",
                    },
                },
                {
                    $unwind: '$strategys',
                },
                {
                    $project: {
                        'service.name': 1,
                        'strategys.strategy_name': 1,


                        _id: 1,
                        user_id: 1,
                        // group_id: 1,
                        // service_id: 1,
                        active_status: 1,
                        quantity: 1,
                        product_type: 1,
                        order_type: 1,
                        createdAt: 1,
                    },
                },
            ];
            // const GetAllClientServices = await client_services.find({
            //     user_id: user_Id
            // });
            const GetAllClientServices = await client_services.aggregate(pipeline)
               
            const totalCount = GetAllClientServices.length;

            // IF DATA NOT EXIST
            if (GetAllClientServices.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Client Services ",
                data: GetAllClientServices,
                // page: Number(page),
                // limit: Number(limit),
                totalCount: totalCount
                // totalPages: Math.ceil(totalCount / Number(limit)),
            })
        } catch (error) {
            console.log("get user trading Status error -", error);
        }
    }


}


module.exports = new Dashboard();