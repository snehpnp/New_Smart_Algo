"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');
const User_model = db.user;
const Role_model = db.role;
const Company_info = db.company_information;
const Subadmin_Permission = db.Subadmin_Permission;
var dateTime = require('node-datetime');
var dt = dateTime.create();

// OK
// Product CLASS
class Subadmin {
    async AddSubadmin(req, res) {
        try {
            const { FullName, UserName, Email, PhoneNo, Role, password, Subadmin_permision_data } = req.body;


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


            const salt = await bcrypt.genSalt(10);
            var ByCryptrand_password = await bcrypt.hash(password.toString(), salt);

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

            // Company Information
            const User = new User_model({
                FullName: FullName,
                UserName: UserName,
                Email: Email,
                PhoneNo: PhoneNo,
                // Password: UserName + "@" + PhoneNo.slice(-4),
                Password: ByCryptrand_password,
                Otp: password,
                // StartDate: "00-00-00",
                // EndDate: "00-00-00",
                Role: Role.toUpperCase(),
                client_key: client_key

            });

            const userinfo = User.save()
                .then(async (data) => {

                    const SubadminPermision = new Subadmin_Permission({
                        client_add: Subadmin_permision_data.client_add,
                        go_To_Dashboard: Subadmin_permision_data.go_To_Dashboard,
                        trade_history_old: Subadmin_permision_data.trade_history_old,
                        client_activation: Subadmin_permision_data.client_activation,
                        strategy: Subadmin_permision_data.strategy,
                        group_services: Subadmin_permision_data.group_services,
                        user_id: data._id
                    })
                    const SuperadminInfo = SubadminPermision.save()
                        .then(async (data) => {
                            return res.send({ status: true, msg: "successfully Add!", data: data })
                        })
                        .catch((err) => {

                            if (err.keyValue) {
                                return res.status(409).json({ status: false, msg: 'Key duplicate', data: err.keyValue });

                            }
                        })
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

    async getallSubadmin(req, res) {
        try {

            // GET LOGIN CLIENTS
            const getAllSubAdmins = await User_model.find({
                Role: "SUBADMIN"
            });
            const totalCount = getAllSubAdmins.length;

            // IF DATA NOT EXIST
            if (getAllSubAdmins.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Subadmins",
                data: getAllSubAdmins,
                // page: Number(page),
                // limit: Number(limit),
                totalCount: totalCount,
                // totalPages: Math.ceil(totalCount / Number(limit)),
            })
        } catch (error) {
            console.log("getallSubadmin error -", error);
        }
    }

    async getOneSubadmin(req, res) {
        try {

            // GET LOGIN CLIENTS
            const getAllSubAdmins = await User_model.find({
                Role: "SUBADMIN"
            });
            const totalCount = getAllSubAdmins.length;

            // IF DATA NOT EXIST
            if (getAllSubAdmins.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [] })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get  Subadmins",
                data: getAllSubAdmins,

            })
        } catch (error) {
            console.log("get Subadmin error -", error);
        }
    }
}


module.exports = new Subadmin();