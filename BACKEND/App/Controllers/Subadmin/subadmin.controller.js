"use strict";
const bcrypt = require("bcrypt");
const db = require('../../Models');
const User_model = db.user;
const Role_model = db.role;
const Company_info = db.company_information;
const Subadmin_Permission = db.Subadmin_Permission;
var dateTime = require('node-datetime');
var dt = dateTime.create();


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Product CLASS
class Subadmin {
    // ADD SUBAMDIN
    async AddSubadmin(req, res) {
        try {
            const { FullName, Email, PhoneNo, Role, password, Subadmin_permision_data, parent_id, parent_role } = req.body;


            // IF ROLE NOT EXIST TO CHECK
            const roleCheck = await Role_model.findOne({ name: Role.toUpperCase() });
            if (!roleCheck) {
                return res.send({ status: false, msg: 'Role Not exists', data: [] });
            }

            // IF USER ALEARDY EXIST
            const existingUsername = await User_model.findOne({ UserName: FullName + PhoneNo.slice(-4) });
            if (existingUsername) {
                return res.send({ status: false, msg: 'Username already exists', data: [] });
            }

            const existingemail = await User_model.findOne({ Email: Email });
            if (existingemail) {
                return res.send({ status: false, msg: 'Email already exists', data: [] });
            }

            const existingePhone = await User_model.findOne({ PhoneNo: PhoneNo });
            if (existingePhone) {
                return res.send({ status: false, msg: 'Phone Number already exists', data: [] });
            }

            const salt = await bcrypt.genSalt(10);
            var ByCryptrand_password = await bcrypt.hash(password.toString(), salt);

            // Panel Prifix key Find
            var Panel_key = await Company_info.find()
            if (Panel_key.length == 0) {
                return res.send({ status: false, msg: 'client prifix not exist.', data: [] });
            }

            const mins = 1;
            const maxs = 1000000;
            const rands = mins + Math.random() * (maxs - mins);
            var cli_key = Math.round(rands)

            var ccd = dt.format('ymd');
            var client_key = Panel_key[0].prefix + cli_key + ccd

            // Company Information
            const User = new User_model({
                FullName: FullName + PhoneNo.slice(-4),
                UserName: FullName,
                Email: Email,
                PhoneNo: PhoneNo,
                Password: ByCryptrand_password,
                Otp: password,
                Role: Role.toUpperCase(),
                client_key: client_key,
                parent_role: parent_role,
                parent_id: parent_id,
                Is_First_login: "1"

            });

            const userinfo = User.save()
                .then(async (data) => {

                    const SubadminPermision = new Subadmin_Permission({
                        client_add: Subadmin_permision_data.client_add,
                        Update_Api_Key: Subadmin_permision_data.Update_Api_Key,
                        client_edit: Subadmin_permision_data.client_edit,
                        detailsinfo: Subadmin_permision_data.detailsinfo,
                        license_permision: Subadmin_permision_data.license_permision,
                        go_To_Dashboard: Subadmin_permision_data.go_To_Dashboard,
                        trade_history_old: Subadmin_permision_data.trade_history_old,
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
                                return res.send({ status: false, msg: 'Key duplicate', data: err.keyValue });

                            }
                        })
                })
                .catch((err) => {
                    if (err.keyValue) {
                        return res.send({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }

                })


        }
        catch (error) {
            res.send({ msg: "Error=>", error })
        }

    }

    // EDIT SUBADMIN
    async EditSubadmin(req, res) {
        try {
            const { id, FullName, Email, PhoneNo, Role, password, Subadmin_permision_data, parent_id, parent_role } = req.body;

            // IF ROLE NOT EXIST TO CHECK
            const roleCheck = await Role_model.findOne({ name: Role.toUpperCase() });
            if (!roleCheck) {
                return res.send({ status: false, msg: 'Role Not exists', data: [] });
            }


            // IF USER ALEARDY EXIST
            const existingUsername = await User_model.findOne({ _id: id });
            if (!existingUsername) {
                return res.send({ status: false, msg: 'User Not exists', data: [] });
            }


            const salt = await bcrypt.genSalt(10);
            var ByCryptrand_password = await bcrypt.hash(password.toString(), salt);


            // Company Information
            const User = {
                FullName: FullName,
                Password: ByCryptrand_password,
                Otp: password,
                Role: Role.toUpperCase(),

            };
            let subadminUpdate = await User_model.findByIdAndUpdate(existingUsername._id, User)

            var SubadminPermision = {
                client_add: Subadmin_permision_data.client_add,
                detailsinfo: Subadmin_permision_data.detailsinfo,
                Update_Api_Key: Subadmin_permision_data.Update_Api_Key,
                client_edit: Subadmin_permision_data.client_edit,
                license_permision: Subadmin_permision_data.license_permision,
                go_To_Dashboard: Subadmin_permision_data.go_To_Dashboard,
                trade_history_old: Subadmin_permision_data.trade_history_old,
                strategy: Subadmin_permision_data.strategy,
                group_services: Subadmin_permision_data.group_services,
            }

            const filter = { user_id: existingUsername._id };
            const updateOperation = { $set: SubadminPermision };

            const result = await Subadmin_Permission.updateOne(filter, updateOperation);


            if (result) {
                return res.send({ status: true, msg: "successfully Edit!", data: [] })

            }

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
            console.log("Error getallSubadmin error -", error);
        }
    }

    async getOneSubadmin(req, res) {
        try {

            const { id } = req.body
            var subid = new ObjectId(id)
            // GET LOGIN CLIENTS
            const getAllSubAdmins = await User_model.aggregate([
                {
                    $match: {

                        _id: subid,
                        Role: "SUBADMIN"
                    },
                },
                {
                    $lookup: {
                        from: 'subadmin_permissions',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'subadmin_permissions',
                    },
                },
                {
                    $project: {
                        'subadmin_permissions': 1,
                        FullName: 1,
                        UserName: 1,
                        Email: 1,
                        PhoneNo: 1,
                        Otp: 1,
                        Role: 1,


                    },
                },
            ]);


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
            console.log("Error get Subadmin error -", error);
        }
    }


    async getallSubadminClients(req, res) {
        try {

            // GET LOGIN CLIENTS
            const getAllSubAdmins = await User_model.find({
                parent_role: "SUBADMIN",
                license_type: "2",
                Is_Active: '0'

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
                totalCount: totalCount
            })

        } catch (error) {
            console.log("Error getallSubadmin error -", error);
        }
    }
}


module.exports = new Subadmin();