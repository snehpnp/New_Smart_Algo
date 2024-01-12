"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');
const User_model = db.user;
const Role_model = db.role;
const Company_info = db.company_information;
const user_activity_logs = db.user_activity_logs;
const user_logs = db.user_logs;
const Subadmin_Permission = db.Subadmin_Permission;


var dateTime = require('node-datetime');
var dt = dateTime.create();


class User_trading_status {

    // ONE USER GET ALL TRADING STATUS
    async getusertradingStatus(req, res) {
        try {
            const { user_Id } = req.body;
            // GET LOGIN CLIENTS
            const getAllTrading_status = await user_logs.find({
                user_Id: user_Id
            }).sort({createdAt:-1})
            const totalCount = getAllTrading_status.length;

            // IF DATA NOT EXIST
            if (getAllTrading_status.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All trading Status",
                data: getAllTrading_status,
                totalCount: totalCount,
            })
        } catch (error) {
            console.log("Error get user trading Status error -", error);
        }
    }

    // ONE USER GET ALL TRADING STATUS
    async getuserUpdateStatus(req, res) {
        try {


            const { user_Id } = req.body;
            // GET LOGIN CLIENTS

            const today = new Date();   
            today.setHours(0, 0, 0, 0);


            const getAllTrading_status = await user_activity_logs.find({
                user_id: user_Id,
                createdAt: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },

            }).sort({createdAt:-1})
            const totalCount = getAllTrading_status.length;

            // IF DATA NOT EXIST
            if (getAllTrading_status.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All activicty Status",
                data: getAllTrading_status,
                totalCount: totalCount,
            })
        } catch (error) {
            console.log("Error get user trading Status error -", error);
        }
    }

}


module.exports = new User_trading_status();