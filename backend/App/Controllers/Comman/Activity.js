"use strict";
const bcrypt = require("bcrypt");
const db = require("../../Models");
const User_model = db.user;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const user_logs = db.user_logs;
const Activity_logs = db.Activity_logs;
const Activity_category = db.Activity_category;



// Product CLASS
class ActivityLogs {


    async findActivityCategory(req, res) {
        try {
            const { role } = req.body;
            var findData = {}

            if (role == "SUBADMIN") {
                findData = { $or: [{ role: role }] }
            } else if (role == "ADMIN") {
                findData = { $or: [{ role: role },  { role: "RESEARCH" }] }
            } else if (role == "RESEARCH") {
                findData = { $or: [{ role: role },  { role: "SUBADMIN" }] }
            } else {
                findData = { role: role }
            }

            const Activity_logs1 = await Activity_category.find(findData);

            // IF DATA NOT EXIST
            if (Activity_logs1.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [] });
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Activity Name Find",
                data: Activity_logs1,
            });
        } catch (error) {
            console.log("Error get UserInfo error -", error);
        }
    }




    async findActivity(req, res) {
        try {
            const { id, category, endDate, fromDate } = req.body;
            const Activity_logs1 = await Activity_category.find({ activity: category });
    
            if (Activity_logs1.length === 0) {
                return res.send({ status: false, msg: "Category Not Found", data: [] });
            }
    
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const StartDate = fromDate ? new Date(fromDate) : today;
            const EndDate = endDate ? new Date(endDate) : today;
    
    
            const matchConditions = {
                admin_Id: new ObjectId(id),
                category: category,
                createdAt: {
                    $gte: StartDate,
                    $lt: new Date(EndDate.getTime() + 24 * 60 * 60 * 1000)
                }
            };
    
            const projectFields = {
                "UserName": "$userData.UserName",
                "category": 1,
                "admin_Id": 1,
                "message": 1,
                "maker_role": 1,
                "device": 1,
                "system_ip": 1,
                "createdAt": 1,
                _id: 0
            };
    
            if (category === "TARGET-STOPLOSS-TIME") {
                const Activity_logs_data = await Activity_logs.aggregate([
                    { $match: matchConditions },
                    { $sort: { createdAt: -1 } }
                ]);
    
                if (Activity_logs_data.length === 0) {
                    return res.send({ status: false, msg: "Activity Not Found", data: [] });
                }
    
                return res.send({
                    status: true,
                    msg: "Activity Name Found",
                    data: Activity_logs_data,
                });
            } else {
                const Activity_logs_data = await Activity_logs.aggregate([
                    { $match: matchConditions },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_Id",
                            foreignField: "_id",
                            as: "userData"
                        }
                    },
                    { $unwind: "$userData" },
                    { $project: projectFields }
                ]);
    
                if (Activity_logs_data.length === 0) {
                    return res.send({ status: false, msg: "Activity Not Found", data: [] });
                }
    
                return res.send({
                    status: true,
                    msg: "Activity Name Found",
                    data: Activity_logs_data,
                });
            }
        } catch (error) {
            console.log("Error fetching activity data:", error);
            return res.status(500).send({ status: false, msg: "Server Error", error: error.message });
        }
    }
    






}

module.exports = new ActivityLogs();
