"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');
const User_model = db.user;
const user_logs = db.user_logs;

const Role_model = db.role;
const Company_info = db.company_information;
var dateTime = require('node-datetime');
var dt = dateTime.create();

// OK
// Product CLASS
class Employee {

    // USER ADD 
    async AddEmployee(req, res) {
        try {
            const { FullName, UserName, Email, PhoneNo, StartDate, EndDate, Role,parent_id,parent_role } = req.body;

            // IF ROLE NOT EXIST TO CHECK
            const roleCheck = await Role_model.findOne({ name: Role.toUpperCase() });
            if (!roleCheck) {
                return res.status(409).json({ status: false, msg: 'Role Not exists', data: [] });
            }

            // IF USER ALEARDY EXIST       
            const existingUsername = await User_model.findOne({ UserName: UserName });
            if (existingUsername) {
                return res.status(409).json({ status: false, msg: 'Username already exists', data: [] });
            }
            const existingemail = await User_model.findOne({ Email: Email });
            if (existingemail) {
                return res.status(409).json({ status: false, msg: 'Email already exists', data: [] });
            }
            const existingePhone = await User_model.findOne({ PhoneNo: PhoneNo });
            if (existingePhone) {
                return res.status(409).json({ status: false, msg: 'Phone Number already exists', data: [] });
            }


            const min = 1;
            const max = 1000000;
            const rand = min + Math.random() * (max - min);
            var rand_password = Math.round(rand);

            const salt = await bcrypt.genSalt(10);
            var ByCryptrand_password = await bcrypt.hash(rand_password.toString(), salt);

            // Panel Prifix key Find 
            var Panel_key = await Company_info.find()
            if (Panel_key.length == 0) {
                return res.status(409).json({ status: false, msg: 'client prifix not exist.', data: [] });
            }

            const mins = 1;
            const maxs = 1000000;
            const rands = mins + Math.random() * (maxs - mins);
            var cli_key = Math.round(rands)


            var ccd = dt.format('ymd');
            var client_key = Panel_key[0].prefix + cli_key + ccd
            // console.log("Panel_key", client_key);


            // Company Information
            const User = new User_model({
                FullName: FullName,
                UserName: UserName,
                Email: Email,
                PhoneNo: PhoneNo,
                // Password: UserName + "@" + PhoneNo.slice(-4),
                Password: ByCryptrand_password,
                Otp: rand_password,
                StartDate: StartDate,
                EndDate: EndDate,
                Role: Role.toUpperCase(),
                client_key: client_key,
                parent_id:parent_id,
                parent_role:parent_role

            });

            const userinfo = User.save()
                .then(async (data) => {
                    res.send({ status: true, msg: "successfully Add!", data: data })

                })
                .catch((err) => {
                    console.log(" Add Time Error-", err);
                    if (err.keyValue) {
                        return res.status(409).json({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }

                })


        }
        catch (error) {
            res.send({ msg: "Error=>", error })
        }

    }

    // GET ALL GetAllClients
    async GetAllClients(req, res) {
        try {

            const { page, limit } = req.body;     //LIMIT & PAGE
            const skip = (page - 1) * limit;

            // GET ALL CLIENTS
            const getAllClients = await User_model.find({
                $or: [
                    { Role: "USER" }
                ]
            }).skip(skip)
                .limit(Number(limit));

            const totalCount = getAllClients.length;
            // IF DATA NOT EXIST
            if (getAllClients.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All  Clients",
                totalCount: totalCount,
                data: getAllClients,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(totalCount / Number(limit)),
            })
        } catch (error) {
            console.log("loginClients Error-", error);
        }
    }

    // GET ALL LOGIN CLIENTS
    async loginClients(req, res) {
        try {

            // GET LOGIN CLIENTS
            const getAllLoginClients = await User_model.find({
                $or: [
                    { AppLoginStatus: 1 },
                    { WebLoginStatus: 1 }
                ]
            });
            const totalCount = getAllLoginClients.length;
            // IF DATA NOT EXIST
            if (getAllLoginClients.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Login Clients",
                totalCount: totalCount,
                data: getAllLoginClients,
                // page: Number(page),
                // limit: Number(limit),
                // totalPages: Math.ceil(totalCount / Number(limit)),
            })
        } catch (error) {
            console.log("loginClients Error-", error);
        }
    }

    // GET ALL TRADING ON  CLIENTS
    async tradingOnClients(req, res) {
        try {

            // GET LOGIN CLIENTS
            const getAllTradingClients = await User_model.find({
                TradingStatus: "on"
            });
            const totalCount = getAllTradingClients.length;
            // console.log("totalCount", totalCount);
            // IF DATA NOT EXIST
            if (getAllTradingClients.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All trading Clients",
                data: getAllTradingClients,
                // page: Number(page),
                // limit: Number(limit),
                totalCount: totalCount,
                // totalPages: Math.ceil(totalCount / Number(limit)),
            })
        } catch (error) {
            console.log("trading Clients Error-", error);
        }
    }

     // GET ALL TRADING ON  CLIENTS
     async GetTradingStatus(req, res) {
        try {

            // GET LOGIN CLIENTS
            const GetAlluser_logs = await user_logs.find({
                
            });
            const totalCount = GetAlluser_logs.length;
            // console.log("totalCount", totalCount);
            // IF DATA NOT EXIST
            if (GetAlluser_logs.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All user_logs",
                data: GetAlluser_logs,
                // page: Number(page),
                // limit: Number(limit),
                totalCount: totalCount,
                // totalPages: Math.ceil(totalCount / Number(limit)),
            })
        } catch (error) {
            console.log("trading status Error-", error);
        }
    }
}


module.exports = new Employee();