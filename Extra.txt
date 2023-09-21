"use strict";
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const db = require('../../Models');
const User_model = db.user;
const user_logs = db.user_logs;
const Role_model = db.role;
const Company_info = db.company_information;
const strategy_client = db.strategy_client;
const groupService_User = db.groupService_User;
const client_services = db.client_services;
const serviceGroup_services_id = db.serviceGroup_services_id;
const count_licenses = db.count_licenses;



const { logger, logger1, getIPAddress } = require('../../Helper/logger.helper')




var dateTime = require('node-datetime');
var dt = dateTime.create();

// OK
// Product CLASS
class Employee {

    // USER ADD
    async AddEmployee(req, res) {
        try {

            const { FullName, UserName, Email, PhoneNo, license_type, licence, fromdate, Strategies, todate, service_given_month, broker, parent_id, parent_role, api_secret, app_id, client_code, api_key, app_key, api_type, demat_userid, group_service } = req.body;

            var Role = "USER";
            var StartDate1 = "";
            var EndDate1 = "";


            // IF ROLE NOT EXIST TO CHECK
            const roleCheck = await Role_model.findOne({ name: Role.toUpperCase() });
            if (!roleCheck) {
                return res.send({ status: false, msg: 'Role Not exists', data: [] });
            }

            // IF USER ALEARDY EXIST
            const existingUsername = await User_model.findOne({ UserName: UserName });
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

            // IF CHECK STRATEGY NULL
            if (Strategies.length == 0) {
                return res.send({ status: false, msg: 'Please Select a one Strategy', data: [] });
            }

            // IF CHECK GROUP SERVICES NULL
            if (group_service == "") {
                return res.send({ status: false, msg: 'Please Select a one Group', data: [] });
            }

            // USER 2 DAYS LICENSE USE
            if (license_type == '0') {

                var currentDate = new Date();
                var start_date_2days = dateTime.create(currentDate);
                start_date_2days = start_date_2days.format('Y-m-d H:M:S');
                var start_date = start_date_2days;

                // console.log("start_date", start_date);
                StartDate1 = start_date


                var UpdateDate = ""
                var StartDate = new Date(start_date)
                var GetDay = StartDate.getDay()
                if (GetDay == 4) {
                    UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                } else if (GetDay == 5) {
                    UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                } else if (GetDay == 6) {
                    UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                } else if (GetDay == 0) {
                    UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                } else if (GetDay > 0 && GetDay < 4) {
                    UpdateDate = StartDate.setDate(StartDate.getDate() + 2);
                }


                var end_date_2days = dateTime.create(UpdateDate);
                var end_date_2days = end_date_2days.format('Y-m-d H:M:S');

                // console.log("END DATE", end_date_2days);
                EndDate1 = end_date_2days

            } else if (license_type == '1') {
                StartDate1 = fromdate
                EndDate1 = todate
            } else if (license_type == '2') {

                var currentDate = new Date();
                var start_date_2days = dateTime.create(currentDate);
                start_date_2days = start_date_2days.format('Y-m-d H:M:S');
                var start_date = start_date_2days;

                // console.log("start_date", start_date);
                StartDate1 = start_date


                var UpdateDate = ""
                var StartDate = new Date(start_date)

                UpdateDate = StartDate.setMonth(StartDate.getMonth() + parseFloat(licence));

                var end_date_2days = dateTime.create(UpdateDate);
                var end_date_2days = end_date_2days.format('Y-m-d H:M:S');

                // console.log("END DATE", end_date_2days);
                EndDate1 = end_date_2days

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
                return res.send({ status: false, msg: 'client prifix not exist.', data: [] });
            }

            const mins = 1;
            const maxs = 1000000;
            const rands = mins + Math.random() * (maxs - mins);
            var cli_key = Math.round(rands)


            var ccd = dt.format('ymd');
            var client_key = Panel_key[0].prefix + cli_key + ccd

            var user_data = {
                FullName: FullName,
                UserName: UserName,
                Email: Email,
                PhoneNo: PhoneNo,
                // Password: UserName + "@" + PhoneNo.slice(-4),
                Password: ByCryptrand_password,
                Otp: rand_password,
                StartDate: StartDate1,
                EndDate: EndDate1,
                Role: Role.toUpperCase(),
                license_type: license_type,
                licence: licence,
                client_key: client_key,
                parent_id: parent_id,
                parent_role: parent_role,
                api_secret: api_secret,
                app_id: app_id,
                client_code: client_code,
                api_key: api_key,
                app_key: app_key,
                api_type: api_type,
                demat_userid: demat_userid,
                service_given_month: service_given_month
            };

            const User = new User_model(user_data)
            const userinfo = User.save()
                .then(async (data) => {
                    var User_id = data._id



                    // GROUP SERVICE ADD
                    const User_group_service = new groupService_User(
                        {
                            groupService_id: group_service,
                            user_id: User_id
                        })
                    User_group_service.save()



                    // STRATEGY ADD
                    try {
                        if (Strategies.length > 0) {

                            Strategies.forEach((data) => {

                                // STRATEGY ADD
                                const User_strategy_client = new strategy_client(
                                    {
                                        strategy_id: data.id,
                                        user_id: User_id
                                    })
                                User_strategy_client.save()
                            })
                        }
                    } catch { }

                    const group_service_find = await serviceGroup_services_id.find({ Servicegroup_id: group_service })


                    // CLIENT SERVICES ADD API 
                    if (group_service_find.length != 0) {

                        group_service_find.forEach((data) => {
                            const User_client_services = new client_services(
                                {
                                    user_id: User_id,
                                    group_id: group_service,
                                    service_id: data.Service_id,
                                    strategy_id: Strategies[0].id,
                                    uniqueUserService: User_id + "_" + data.Service_id
                                })
                            User_client_services.save()
                        })

                    }



                    // LICENSE TABLE ADD USE LICENSE OUR CLIENT
                    if (license_type == '2') {

                        const count_licenses_add = new count_licenses(
                            {
                                user_id: User_id,
                                license: licence,

                            })
                        count_licenses_add.save()
                    }


                    logger1.info('Add User By Admin', { Email: data.Email, role: data.Role, user_id: data._id });
                    res.send({ status: true, msg: "successfully Add!", data: data })

                })
                .catch((err) => {
                    console.log(" Add Time Error-", err);
                    if (err.keyValue) {

                        return res.send({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }

                })


        }
        catch (error) {
            res.send({ msg: "Error=>", error })
        }

    }

    // UPDATE USER 
    async UpdateUser(req, res) {
        try {

            const { FullName, UserName, Email, PhoneNo, license_type, licence, fromdate, Strategies, todate, service_given_month, broker, parent_id, parent_role, api_secret, app_id, client_code, api_key, app_key, api_type, demat_userid, group_service } = req.body;

            var StartDate1 = "";
            var EndDate1 = "";

            // IF USER ALEARDY EXIST
            const existingUsername = await User_model.findOne({ UserName: UserName });
            if (!existingUsername) {
                return res.send({ status: false, msg: 'Username Not exists', data: [] });
            }


            // IF CHECK STRATEGY NULL
            if (Strategies.length == 0) {
                return res.send({ status: false, msg: 'Please Select a one Strategy', data: [] });
            }

            // IF CHECK GROUP SERVICES NULL
            if (group_service == "") {
                return res.send({ status: false, msg: 'Please Select a one Group', data: [] });
            }


            // PREVIOS CLIENT IS LIVE
            if (existingUsername.license_type != "2") {

                // USER 2 DAYS LICENSE USE
                if (license_type == '0') {

                    var currentDate = new Date();
                    var start_date_2days = dateTime.create(currentDate);
                    start_date_2days = start_date_2days.format('Y-m-d H:M:S');
                    var start_date = start_date_2days;

                    // console.log("start_date", start_date);
                    StartDate1 = start_date


                    var UpdateDate = ""
                    var StartDate = new Date(start_date)
                    var GetDay = StartDate.getDay()
                    if (GetDay == 4) {
                        UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                    } else if (GetDay == 5) {
                        UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                    } else if (GetDay == 6) {
                        UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                    } else if (GetDay == 0) {
                        UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                    } else if (GetDay > 0 && GetDay < 4) {
                        UpdateDate = StartDate.setDate(StartDate.getDate() + 2);
                    }


                    var end_date_2days = dateTime.create(UpdateDate);
                    var end_date_2days = end_date_2days.format('Y-m-d H:M:S');

                    // console.log("END DATE", end_date_2days);
                    EndDate1 = end_date_2days

                } else if (license_type == '1') {
                    StartDate1 = fromdate
                    EndDate1 = todate
                } else if (license_type == '2') {

                    var currentDate = new Date();
                    var start_date_2days = dateTime.create(currentDate);
                    start_date_2days = start_date_2days.format('Y-m-d H:M:S');
                    var start_date = start_date_2days;

                    // console.log("start_date", start_date);
                    StartDate1 = start_date


                    var UpdateDate = ""
                    var StartDate = new Date(start_date)

                    UpdateDate = StartDate.setMonth(StartDate.getMonth() + parseFloat(licence));

                    var end_date_2days = dateTime.create(UpdateDate);
                    var end_date_2days = end_date_2days.format('Y-m-d H:M:S');

                    // console.log("END DATE", end_date_2days);
                    EndDate1 = end_date_2days

                }

            } else {
                if (license_type == '2') {

                    var UserEndDate = new Date(existingUsername.EndDate);
                    var TodaysDate = new Date();


                    if (UserEndDate > TodaysDate) {

                        var currentDate = new Date(existingUsername.EndDate);

                        var start_date_2days = dateTime.create(currentDate);
                        start_date_2days = start_date_2days.format('Y-m-d H:M:S');
                        var start_date = start_date_2days;

                        StartDate1 = existingUsername.StartDate

                        var UpdateDate = ""
                        var StartDate = new Date(start_date)

                        UpdateDate = StartDate.setMonth(StartDate.getMonth() + parseFloat(licence));

                        var end_date_2days = dateTime.create(UpdateDate);
                        var end_date_2days = end_date_2days.format('Y-m-d H:M:S');

                        EndDate1 = end_date_2days

                    } else {
                        var currentDate = new Date();

                        var start_date_2days = dateTime.create(currentDate);
                        start_date_2days = start_date_2days.format('Y-m-d H:M:S');
                        var start_date = start_date_2days;

                        StartDate1 = start_date

                        var UpdateDate = ""
                        var StartDate = new Date(start_date)

                        UpdateDate = StartDate.setMonth(StartDate.getMonth() + parseFloat(licence));

                        var end_date_2days = dateTime.create(UpdateDate);
                        var end_date_2days = end_date_2days.format('Y-m-d H:M:S');

                        EndDate1 = end_date_2days
                    }




                } else {
                    return res.send({ status: false, msg: 'This is Live User', data: [] });
                }
            }

            console.log("StartDate1", StartDate1);
            console.log("EndDate1", EndDate1);


            // CHECK IF PAREND ALREADY ASIGN THIS CLIENT
            // var SubadminId = ""
            // if (parent_id == "") {
            //     console.log("parent_id", parent_id);
            // } else {
            //     console.log("parent_id", parent_id);
            // }



            // STARTEGY ADD AND EDIT
            const Strategieclient = await strategy_client.find({ user_id: existingUsername._id });

            // EXIST STRATEGY RO CONVERT IN STRING AND ID
            var db_exist_startegy = [];
            Strategieclient.forEach(function (item, index) {
                db_exist_startegy.push(item.strategy_id.toString());
            });

            // NEW INSERT STRATEGY TO CONVERT IN STRING AND ID
            var insert_startegy = [];
            Strategies.forEach(function (item, index) {
                insert_startegy.push(item.id);
            });

            // console.log('exist - strtegy ', db_exist_startegy);

            // ADD STRATEGY ARRAY
            var add_startegy = [];
            insert_startegy.forEach(function (item, index) {
                if (!db_exist_startegy.includes(item)) {
                    add_startegy.push(item);
                }
            });
            // console.log('add add_startegy - ', add_startegy);


            // DELETE STRATEGY ARRAY
            var delete_startegy = [];
            db_exist_startegy.forEach(function (item, index) {
                if (!insert_startegy.includes(item)) {
                    delete_startegy.push(item);
                }
            });
            // console.log("delete_startegy", delete_startegy);



            // ADD STRATEGY IN STRATEGY CLIENT
            if (add_startegy.length > 0) {
                add_startegy.forEach(async (data) => {
                    const User_strategy_client = new strategy_client(
                        {
                            strategy_id: data,
                            user_id: existingUsername._id
                        })
                    await User_strategy_client.save()
                })

            }

            // STEP FIRST TO DELTE IN STRATEGY CLIENT TABLE
            if (delete_startegy.length > 0) {

                delete_startegy.forEach(async (data) => {
                    var stgId = new ObjectId(data)
                    var deleteStrategy = await strategy_client.deleteOne({ user_id: existingUsername._id, strategy_id: stgId })
                })
            }

            // STEP FISECONDRST TO DELTE IN CLIENT SERVICES AND UPDATE NEW STRATEGY 
            if (delete_startegy.length > 0) {


                delete_startegy.forEach(async (data) => {
                    var stgId = new ObjectId(data)
                    var deleteStrategy = await strategy_client.find({ user_id: existingUsername._id })


                    var deleteStrategy_clientServices1 = await client_services.updateMany({ user_id: existingUsername._id, strategy_id: stgId }, { $set: { strategy_id: deleteStrategy[0].strategy_id } })
                })

            }



            // GROUP SERVICES ADD EDIT 
            const GroupServiceId = new ObjectId(group_service);

            // CHECK IF GROUP SERVICES ALEAREDY EXIST NO UPDATE
            const user_group_service = await groupService_User.find({ user_id: existingUsername._id, groupService_id: GroupServiceId });
            if (user_group_service.length == 0) {

                // DELETE GROUP SERVICES
                const DELTE_GROUP = await groupService_User.deleteMany({ user_id: existingUsername._id });

                // IF GROUP SERVICES NOT EXIST
                var GroupServices = await serviceGroup_services_id.find({ Servicegroup_id: GroupServiceId });
                if (GroupServices.length == "0") {
                    return res.send({ status: false, msg: 'Your selected Group is not exist ', data: GroupServices });
                }

                var deleteStrategy = await strategy_client.find({ user_id: existingUsername._id })

                GroupServices.forEach((data) => {
                
                    const User_client_services = new client_services(
                        {
                            user_id: existingUsername._id,
                            group_id: GroupServiceId,
                            service_id: data.Service_id,
                            strategy_id: deleteStrategy[0].strategy_id,
                            uniqueUserService: existingUsername._id + "_" + data.Service_id
                        })
                        console.log(User_client_services);
                    User_client_services.save()
                })



            } else {
                console.log("NO CHANGE IN GROUP SERVICES");
            }





            // USER GET ALL TYPE OF DATA
            return res.send({ status: true, msg: 'User Update successfully', data: [] });


        } catch (error) {
            console.log("Error In User Update-", error);
        }
    }

    // GET ALL GetAllClients
    async GetAllClients(req, res) {
        try {

            const { page, limit, Find_Role, user_ID } = req.body;     //LIMIT & PAGE
            const skip = (page - 1) * limit;

            // GET ALL CLIENTS
            var AdminMatch

            if (Find_Role == "ADMIN") {
                AdminMatch = { Role: "USER" }
            } else if (Find_Role == "SUBADMIN") {
                AdminMatch = { Role: "USER", parent_id: user_ID }
            }

            const getAllClients = await User_model.find(AdminMatch).skip(skip)
                .limit(Number(limit));



            const totalCount = getAllClients.length;
            // IF DATA NOT EXIST
            if (getAllClients.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Clients",
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

            const { Role } = req.body
            // var Role = "ADMIN"
            const GetAlluser_logs = await user_logs.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user_Id",
                        foreignField: "_id",
                        as: "userinfo",
                    },
                },
                {
                    $unwind: '$userinfo',
                },
                {
                    $match: {
                        'userinfo.Role': Role, // Replace 'desired_role_here' with the role you want to filter by
                    },
                },
                {
                    $project: {
                        'userinfo.FullName': 1,
                        login_status: 1,
                        trading_status: 1,
                        message: 1,
                        role: 1,
                        system_ip: 1,
                        createdAt: 1,
                    },
                },
            ]);


            // const GetAlluser_logs = await user_logs.find({

            // });
            const totalCount = GetAlluser_logs.length;
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

    // CLIENTS ACTIVE INACTIVE STATUS UPDATE
    async UpdateActiveStatus(req, res) {
        try {
            const { id, user_active_status } = req.body
            // UPDATE ACTTIVE STATUS CLIENT


            const get_user = await User_model.find({ _id: id });
            if (get_user.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }

            const filter = { _id: id };
            const updateOperation = { $set: { ActiveStatus: user_active_status } };

            const result = await User_model.updateOne(filter, updateOperation);


            if (result) {
                // STATUS UPDATE SUCCESSFULLY
                var status_msg = user_active_status == "0" ? "DeActivate" : "Activate"
                logger1.info(`${status_msg} user Successfully`, { Email: get_user[0].Email, role: get_user[0].Role, user_id: get_user[0]._id });

                res.send({
                    status: true,
                    msg: "Update Successfully",
                    data: result,

                })
            }

        } catch (error) {
            console.log("trading status Error-", error);
        }
    }

    // DELETE USER AND USER REGARD SERVICES
    async DeleteUser(req, res) {
        try {
            const { id } = req.body
            // UPDATE ACTTIVE STATUS CLIENT


            const get_user = await User_model.find({ _id: id });
            if (get_user.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [], totalCount: totalCount, })
            }


            var DeleteGroupServices = await groupService_User.deleteOne({ user_id: get_user[0]._id })
            var DeleteStartegyClient = await strategy_client.deleteMany({ user_id: get_user[0]._id })
            var DeleteClient_services = await client_services.deleteMany({ user_id: get_user[0]._id })
            var DeleteUser = await User_model.deleteOne({ _id: get_user[0]._id })


            logger1.info(`Delete User Successfully`, { Email: get_user[0].Email, role: get_user[0].Role, user_id: get_user[0]._id });

            res.send({
                status: true,
                msg: "Delete Successfully",
                data: DeleteUser,


            })
        } catch (error) {
            console.log("trading status Error-", error);
        }
    }




}


module.exports = new Employee();