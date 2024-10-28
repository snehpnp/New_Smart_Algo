"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const User_model = db.user;
const user_SignUp = db.UserSignUp;
const user_logs = db.user_logs;
const Role_model = db.role;
const BrokerResponse = db.BrokerResponse;
const userReedeem_modal = db.userReedeem_modal;

const Company_info = db.company_information;
const strategy_client = db.strategy_client;
const groupService_User = db.groupService_User;
const client_services = db.client_services;
const serviceGroup_services_id = db.serviceGroup_services_id;
const count_licenses = db.count_licenses;
const user_activity_logs = db.user_activity_logs;
const strategy = db.strategy;
const serviceGroupName = db.serviceGroupName;

const { CommonEmail } = require("../../Helper/CommonEmail");
const { firstOptPass } = require("../../Helper/Email_formate/first_login");

const { logger, logger1, getIPAddress } = require("../../Helper/logger.helper");

var dateTime = require("node-datetime");
var dt = dateTime.create();

class Employee {
  // USER ADD
  async AddEmployee(req, res) {
    try {
      const {
        FullName,
        UserName,
        Email,
        PhoneNo,
        license_type,
        licence,
        fromdate,
        Strategies,
        todate,
        service_given_month,
        broker,
        parent_id,
        parent_role,
        api_secret,
        app_id,
        client_code,
        api_key,
        app_key,
        api_type,
        demat_userid,
        group_service,
        multiple_strategy_select,
        plan_id
      } = req.body;

      var Role = "USER";
      var StartDate1 = "";
      var EndDate1 = "";

      let Strategies_id_array = [];

      if (multiple_strategy_select == "0") {
        Strategies_id_array.push(Strategies[0].id);
      } else {
        let count = 0;
        for (const strategy of Strategies) {
          Strategies_id_array.push(strategy.id);
        }
      }

      const existingUser = await User_model.findOne({
        $or: [{ UserName: UserName }, { Email: Email }, { PhoneNo: PhoneNo }],
      });

      if (existingUser) {
        if (existingUser.UserName === UserName) {
          return res.send({
            status: false,
            msg: "Username already exists",
            data: [],
          });
        }

        if (existingUser.Email === Email) {
          return res.send({
            status: false,
            msg: "Email already exists",
            data: [],
          });
        }

        if (existingUser.PhoneNo === PhoneNo) {
          return res.send({
            status: false,
            msg: "Phone Number already exists",
            data: [],
          });
        }
      }

      // IF CHECK STRATEGY NULL
      if (Strategies.length == 0) {
        return res.send({
          status: false,
          msg: "Please Select a one Strategy",
          data: [],
        });
      }

      // IF CHECK GROUP SERVICES NULL
      if (group_service == "" || group_service == null) {
        return res.send({
          status: false,
          msg: "Please Select a one Group",
          data: [],
        });
      }

      // USER 2 DAYS LICENSE USE
      if (license_type == "0") {
        var currentDate = new Date();
        var start_date_2days = dateTime.create(currentDate);
        start_date_2days = start_date_2days.format("Y-m-d H:M:S");
        var start_date = start_date_2days;

        StartDate1 = start_date;

        var UpdateDate = "";
        var StartDate = new Date(start_date);
        var GetDay = StartDate.getDay();
        if (GetDay == 4) {
          UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
        } else if (GetDay == 5) {
          UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
        } else if (GetDay == 6) {
          UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
        } else if (GetDay == 0) {
          UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
        } else if (GetDay > 0 && GetDay < 4) {
          UpdateDate = StartDate.setDate(StartDate.getDate() + 7);
        }

        var end_date_2days = dateTime.create(UpdateDate);
        var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

        EndDate1 = end_date_2days;
      } else if (license_type == "1") {
        StartDate1 = fromdate;
        EndDate1 = todate;
      } else if (license_type == "2") {
        var currentDate = new Date();
        var start_date_2days = dateTime.create(currentDate);
        start_date_2days = start_date_2days.format("Y-m-d H:M:S");
        var start_date = start_date_2days;

        StartDate1 = start_date;

        var UpdateDate = "";
        var StartDate = new Date(start_date);

        UpdateDate = StartDate.setMonth(
          StartDate.getMonth() + parseInt(licence)
        );

        var end_date_2days = dateTime.create(UpdateDate);
        var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

        EndDate1 = end_date_2days;
      }

      const min = 1;
      const max = 1000000;
      const rand = min + Math.random() * (max - min);
      var rand_password = Math.round(rand);
      // var rand_password = Math.round(123456);

      const salt = await bcrypt.genSalt(10);
      var ByCryptrand_password = await bcrypt.hash(
        rand_password.toString(),
        salt
      );

      // Panel Prifix key Find

      var Panel_key = await Company_info.find(
        {},
        { prefix: 1, licenses: 1, _id: 0 }
      ).limit(1);
      if (Panel_key.length == 0) {
        return res.send({
          status: false,
          msg: "client prifix not exist.",
          data: [],
        });
      }

      const mins = 1;
      const maxs = 1000000;
      const rands = mins + Math.random() * (maxs - mins);
      var cli_key = Math.round(rands);

      var ccd = dt.format("ymd");
      var client_key = Panel_key[0].prefix + cli_key + ccd;

      const totalLicense = await User_model.aggregate([
        // Match documents based on your criteria (e.g., specific conditions)
        {
          $match: {
            license_type: "2",
            licence: { $exists: true, $ne: null, $not: { $type: 10 } }, // Exclude undefined or NaN values
          },
        },
        {
          $group: {
            _id: null, // Group all documents into a single group
            totalLicense: {
              $sum: { $toInt: "$licence" },
            },
          },
        },
      ]);

      if (totalLicense.length > 0) {
        var TotalLicense = totalLicense[0].totalLicense;
      } else {
        var TotalLicense = 0;
      }

      if (Number(licence) > 0) {
        if (
          parseInt(TotalLicense) + parseInt(licence) >
          Number(Panel_key[0].licenses)
        ) {
          return res.send({
            status: false,
            msg: "You Dont Have License",
            data: [],
          });
        }
      }

      User_model.insertMany([
        {
          FullName: FullName,
          UserName: UserName,
          Email: Email,
          PhoneNo: PhoneNo,
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
          broker: broker == null ? 0 : broker,
          api_type: api_type,
          demat_userid: demat_userid,
          service_given_month: service_given_month,
          multiple_strategy_select: multiple_strategy_select,
          plan_id:plan_id
        },
        // Add more documents if needed
      ])
        .then(async (data) => {
          var User_id = data[0]._id;

          // GROUP SERVICE ADD
          const User_group_service = new groupService_User({
            groupService_id: group_service,
            user_id: User_id,
          });
          User_group_service.save();

          // STRATEGY ADD
          if (Strategies.length > 0) {
            Strategies.forEach((data) => {
              // STRATEGY ADD
              const User_strategy_client = new strategy_client({
                strategy_id: data.id,
                user_id: User_id,
              });
              User_strategy_client.save();
            });
          }

          const GroupServiceId = new ObjectId(group_service);

          const group_service_find = await serviceGroup_services_id.aggregate([
            {
              $match: {
                Servicegroup_id: GroupServiceId,
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "Service_id",
                foreignField: "_id",
                as: "serviceInfo",
              },
            },
            {
              $unwind: "$serviceInfo",
            },
            {
              $project: {
                _id: 0, // Exclude the _id field if you don't need it
                Service_id: "$Service_id",
                lotsize: "$serviceInfo.lotsize",
                product_type: 1,
              },
            },
          ]);

          const clientServicesData = [];

          if (group_service_find.length !== 0) {
            if (group_service_find.length != 0) {
              group_service_find.forEach((data) => {
                const clientService = {
                  user_id: User_id,
                  group_id: group_service,
                  service_id: data.Service_id,
                  strategy_id: Strategies_id_array,
                  uniqueUserService: User_id + "_" + data.Service_id,
                  quantity: data.lotsize,
                  lot_size: 1,
                  product_type: data.product_type,
                };

                clientServicesData.push(clientService);
              });
            }

            client_services.insertMany(clientServicesData).then((result) => {});

            if (license_type == "2") {
              const count_licenses_add = new count_licenses({
                user_id: User_id,
                license: licence,
              });
              count_licenses_add.save();
            }

            var toEmail = Email;
            var subjectEmail = "User ID and Password";
            var email_data = {
              FullName: FullName,
              Email: Email,
              Password: rand_password,
              user_type:
                license_type == 2
                  ? "Live Account"
                  : license_type == 0
                  ? "2 Days Free Live Account"
                  : "Free Demo Account",
            };

            const existingUser = await user_SignUp.findOne({
              $or: [
                { UserName: UserName },
                { Email: Email },
                { PhoneNo: PhoneNo },
              ],
            });

            if (existingUser) {
              existingUser.ActiveStatus = "1";
              await existingUser.save();
            }

            var EmailData = await firstOptPass(email_data);
            CommonEmail(toEmail, subjectEmail, EmailData);

            logger1.info("Add User By Admin", {
              Email: data[0].Email,
              role: data[0].Role,
              user_id: data[0]._id,
            });
            res.send({ status: true, msg: "successfully Add!", data: data[0] });
          }
        })
        .catch((err) => {
          if (err.keyValue) {
            return res.send({
              status: false,
              msg: "Key duplicate",
              data: err.keyValue,
            });
          }
        });
    } catch (error) {
      return res.send({ msg: error });
    }
  }

  // UPDATE USER
  async UpdateUser(req, res) {
    try {
      var req = req.body.req;

      var StartDate1 = "";
      var EndDate1 = "";

      var PID = new ObjectId(req.parent_id);

      const existingUsername = await User_model.findOne({
        UserName: req.UserName,
      });
      if (!existingUsername) {
        return res.send({
          status: false,
          msg: "Username Not exists",
          data: [],
        });
      }

      // IF CHECK STRATEGY NULL
      if (req.Strategies.length == 0) {
        return res.send({
          status: false,
          msg: "Please Select a one Strategy",
          data: [],
        });
      }

      // IF CHECK GROUP SERVICES NULL
      if (req.group_service == "") {
        return res.send({
          status: false,
          msg: "Please Select a one Group",
          data: [],
        });
      }

      // IF CHECK GROUP SERVICES NULL
      if (req.parent_id == "") {
        return res.send({
          status: false,
          msg: "Please Select parent id",
          data: [],
        });
      }

      var TotalMonth = "0";

      var Panel_key = await Company_info.find(
        {},
        { prefix: 1, licenses: 1, _id: 0 }
      ).limit(1);

      const totalLicense = await User_model.aggregate([
        {
          $match: {
            Role: "USER",
            license_type: "2",
            licence: { $exists: true, $ne: null, $not: { $type: 10 } }, // Exclude undefined or NaN values
          },
        },
        {
          $group: {
            _id: null, // Group all documents into a single group
            totalLicense: {
              $sum: { $toInt: "$licence" },
            },
          },
        },
      ]);

      console.log("totalLicense", totalLicense);

      if (totalLicense.length > 0) {
        var TotalLicense = totalLicense[0].totalLicense;
      } else {
        var TotalLicense = 0;
      }

      var new_licence = 0;
      if (
        req.licence1 === "" ||
        req.licence1 === undefined ||
        req.licence1 === null ||
        req.licence1 === "null"
      ) {
        new_licence = 0;
      } else {
        new_licence = req.licence1;
      }

      console.log("new_licence", new_licence);
      console.log("TotalLicense", TotalLicense);
      console.log("Panel_key[0].licenses", Panel_key[0].licenses);


      if (Number(new_licence) > 0) {
        if (
          parseInt(TotalLicense) + parseInt(new_licence) >
          Number(Panel_key[0].licenses)
        ) {
          return res.send({
            status: false,
            msg: "You Dont Have License",
            data: [],
          });
        }
      }

      // PREVIOS CLIENT IS LIVE
      if (existingUsername.license_type != "2") {
        if (req.license_type == "0") {
          if (existingUsername.license_type != "0") {
            var currentDate = new Date();
            var start_date_2days = dateTime.create(currentDate);
            start_date_2days = start_date_2days.format("Y-m-d H:M:S");
            var start_date = start_date_2days;

            StartDate1 = start_date;

            var UpdateDate = "";
            var StartDate = new Date(start_date);
            var GetDay = StartDate.getDay();
            if (GetDay == 4) {
              UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
            } else if (GetDay == 5) {
              UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
            } else if (GetDay == 6) {
              UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
            } else if (GetDay == 0) {
              UpdateDate = StartDate.setDate(StartDate.getDate() + 8);
            } else if (GetDay > 0 && GetDay < 4) {
              UpdateDate = StartDate.setDate(StartDate.getDate() + 7);
            }

            var end_date_2days = dateTime.create(UpdateDate);
            var end_date_2days = end_date_2days.format("Y-m-d H:M:S");
            EndDate1 = end_date_2days;
          }
        } else if (req.license_type == "1") {
          StartDate1 = req.fromdate;
          EndDate1 = req.todate;
        } else if (req.license_type == "2" && new_licence > 0) {
          var currentDate = new Date();
          var start_date_2days = dateTime.create(currentDate);
          start_date_2days = start_date_2days.format("Y-m-d H:M:S");
          var start_date = start_date_2days;
          StartDate1 = start_date;

          var UpdateDate = "";
          var StartDate = new Date(start_date);

          UpdateDate = StartDate.setMonth(
            StartDate.getMonth() + parseInt(new_licence)
          );

          var end_date_2days = dateTime.create(UpdateDate);
          var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

          EndDate1 = end_date_2days;
          TotalMonth = new_licence;
        }
      } else {
        if (req.license_type == "2") {
          var UserEndDate = new Date(existingUsername.EndDate);
          var TodaysDate = new Date();

          if (Number(new_licence) > 0) {
            if (UserEndDate > TodaysDate) {
              var currentDate = new Date(existingUsername.EndDate);

              var start_date_2days = dateTime.create(currentDate);
              start_date_2days = start_date_2days.format("Y-m-d H:M:S");
              var start_date = start_date_2days;

              StartDate1 = existingUsername.StartDate;

              var UpdateDate = "";
              var StartDate = new Date(start_date);

              UpdateDate = StartDate.setMonth(
                StartDate.getMonth() + parseInt(new_licence)
              );

              var end_date_2days = dateTime.create(UpdateDate);
              var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

              EndDate1 = end_date_2days;
              TotalMonth =
                parseInt(new_licence) + parseInt(existingUsername.licence);
            } else {
              var currentDate = new Date();

              var start_date_2days = dateTime.create(currentDate);
              start_date_2days = start_date_2days.format("Y-m-d H:M:S");
              var start_date = start_date_2days;

              StartDate1 = start_date;

              var UpdateDate = "";
              var StartDate = new Date(start_date);

              UpdateDate = StartDate.setMonth(
                StartDate.getMonth() + parseInt(new_licence)
              );

              var end_date_2days = dateTime.create(UpdateDate);
              var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

              EndDate1 = end_date_2days;
              TotalMonth =
                parseInt(new_licence) + parseInt(existingUsername.licence);
            }
          } else {
            StartDate1 = existingUsername.StartDate;
            EndDate1 = existingUsername.EndDate;
            TotalMonth = req.licence;
          }
        } else {
          return res.send({
            status: false,
            msg: "This is Live User",
            data: [],
          });
        }
      }

      const Strategieclient = await strategy_client.find({
        user_id: existingUsername._id,
      });

      // EXIST STRATEGY RO CONVERT IN STRING AND ID
      var db_exist_startegy = [];
      Strategieclient.forEach(function (item, index) {
        db_exist_startegy.push(item.strategy_id.toString());
      });

      // NEW INSERT STRATEGY TO CONVERT IN STRING AND ID
      var insert_startegy = [];
      req.Strategies.forEach(function (item, index) {
        insert_startegy.push(item.id);
      });

      // ADD STRATEGY ARRAY
      var add_startegy = [];
      insert_startegy.forEach(function (item, index) {
        if (!db_exist_startegy.includes(item)) {
          add_startegy.push(item);
        }
      });

      // DELETE STRATEGY ARRAY
      var delete_startegy = [];
      db_exist_startegy.forEach(function (item, index) {
        if (!insert_startegy.includes(item)) {
          delete_startegy.push(item);
        }
      });

      // ADD STRATEGY IN STRATEGY CLIENT
      if (add_startegy.length > 0) {
        add_startegy.forEach(async (data) => {
          const User_strategy_client = new strategy_client({
            strategy_id: data,
            user_id: existingUsername._id,
          });
          await User_strategy_client.save();

          var stgId = new ObjectId(data);

          const Strategieclient = await strategy.find({ _id: stgId });
          const user_activity = new user_activity_logs({
            user_id: existingUsername._id,
            message: "Strategy Add",
            Strategy: Strategieclient[0].strategy_name,
            role: req.Editor_role,
            system_ip: req.network_ip,
            device: req.device,
          });
          await user_activity.save();
        });
      }

      // STEP FIRST TO DELTE IN STRATEGY CLIENT TABLE
      if (delete_startegy.length > 0) {
        delete_startegy.forEach(async (data) => {
          var stgId = new ObjectId(data);
          var deleteStrategy = await strategy_client.deleteOne({
            user_id: existingUsername._id,
            strategy_id: stgId,
          });

          const Strategieclient = await strategy.find({ _id: stgId });

          const user_activity = new user_activity_logs({
            user_id: existingUsername._id,
            message: "Strategy Delete",
            Strategy: Strategieclient[0].strategy_name,
            role: req.Editor_role,
            system_ip: req.network_ip,
            device: req.device,
          });
          await user_activity.save();
        });
      }

      // STEP FISECONDRST TO DELTE IN CLIENT SERVICES AND UPDATE NEW STRATEGY
      if (delete_startegy.length > 0) {
        delete_startegy.forEach(async (data) => {
          var stgId = new ObjectId(data);
          var deleteStrategy = await strategy_client.find({
            user_id: existingUsername._id,
            strategy_id: { $ne: stgId },
          });

          if (req.multiple_strategy_select == 0) {
            if (deleteStrategy.length > 0) {
              var update_services = await client_services.updateMany(
                { user_id: existingUsername._id, strategy_id: stgId },
                { $set: { strategy_id: deleteStrategy[0].strategy_id } }
              );
            } else {
              var update_stg = new ObjectId(add_startegy[0]);

              var update_services = await client_services.updateMany(
                { user_id: existingUsername._id, strategy_id: stgId },
                { $set: { strategy_id: update_stg } }
              );
            }
          } else {
            if (delete_startegy.length > 0) {
              const deleteStrategyIds = delete_startegy.map(
                (data) => new ObjectId(data)
              );

              const updatePromises = deleteStrategyIds.map((data) =>
                client_services.updateMany(
                  { user_id: existingUsername._id },
                  { $pull: { strategy_id: data } }
                )
              );

              // Wait for all update operations to complete
              const results = await Promise.all(updatePromises);
            }
          }
        });
      }

      try {
        // GROUP SERVICES ADD EDIT
        const GroupServiceId = new ObjectId(req.group_service);

        // CHECK IF GROUP SERVICES ALEAREDY EXIST NO UPDATE
        var user_group_service = await groupService_User.find({
          user_id: existingUsername._id,
          groupService_id: GroupServiceId,
        });

        if (user_group_service.length == 0) {
          const result = await groupService_User.updateOne(
            { user_id: existingUsername._id },
            { $set: { groupService_id: new ObjectId(req.group_service) } }
          );

          var GrpId = new ObjectId(req.group_service);

          const GroupclientNAme = await serviceGroupName.find({ _id: GrpId });

          const user_activity = new user_activity_logs({
            user_id: existingUsername._id,
            message: "Update Group ",
            Strategy: GroupclientNAme[0].name,
            role: req.Editor_role.toUpperCase(),
            system_ip: req.network_ip,
            device: req.device,
          });
          await user_activity.save();

          // IF GROUP SERVICES NOT EXIST
          const GroupServices = await serviceGroup_services_id.aggregate([
            {
              $match: {
                Servicegroup_id: GroupServiceId,
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "Service_id",
                foreignField: "_id",
                as: "serviceInfo",
              },
            },
            {
              $unwind: "$serviceInfo",
            },
            {
              $project: {
                _id: 0, // Exclude the _id field if you don't need it
                Service_id: "$Service_id",
                lotsize: "$serviceInfo.lotsize",
                product_type: 1,
              },
            },
          ]);

          if (GroupServices.length == "0") {
            return res.send({
              status: false,
              msg: "Your selected Group is not exist ",
              data: GroupServices,
            });
          }

          var strategFind = await strategy_client.find({
            user_id: existingUsername._id,
          });

          var client_servicesDelete = await client_services.deleteMany({
            user_id: existingUsername._id,
          });

          GroupServices.forEach((data) => {
            const User_client_services = new client_services({
              user_id: existingUsername._id,
              group_id: GroupServiceId,
              service_id: data.Service_id,
              strategy_id: strategFind[0].strategy_id,
              uniqueUserService: existingUsername._id + "_" + data.Service_id,
              quantity: data.lotsize,
              lot_size: 1,
              product_type: data.product_type,
            });
            User_client_services.save();
          });
        }
      } catch (error) {}

      var User_update = {
        FullName: req.FullName,
        license_type: req.license_type,
        licence: TotalMonth,
        StartDate:
          StartDate1 == null || StartDate1 == ""
            ? existingUsername.StartDate
            : StartDate1,
        EndDate:
          EndDate1 == null || EndDate1 == ""
            ? existingUsername.EndDate
            : EndDate1,
        broker: req.broker,
        parent_id: req.parent_id,
        parent_role: existingUsername.Role,
        api_secret: req.api_secret,
        app_id: req.app_id,
        client_code: req.client_code,
        api_key: req.api_key,
        app_key: req.app_key,
        api_type: req.api_type,
        demat_userid: req.demat_userid,
        service_given_month: req.service_given_month,
        multiple_strategy_select: req.multiple_strategy_select,
        Is_Active: "1",
        plan_id:req.plan_id
      };

      const User_Update = await User_model.updateOne(
        { _id: existingUsername._id },
        { $set: User_update }
      );

      if (req.license_type == "2" || req.license_type == 2) {
        if (Number(new_licence) > 0) {
          const count_licenses_add = new count_licenses({
            user_id: existingUsername._id,
            license: new_licence,
          });
          count_licenses_add.save();
        }
      }

      if (
        req.multiple_strategy_select == 0 &&
        existingUsername.multiple_strategy_select == 1
      ) {
        var multy_stgfind = await client_services
          .find({
            user_id: existingUsername._id,
          })
          .select("strategy_id");

        if (multy_stgfind.length > 0) {
          multy_stgfind.forEach(async (data) => {
            if (data.strategy_id.length > 1) {
              const filter = { _id: data._id };
              const updateOperation = {
                $set: { strategy_id: [data.strategy_id[0]] },
              };

              const result = await client_services.updateOne(
                filter,
                updateOperation
              );
            }
          });
        }
      }

      if (
        req.multiple_strategy_select == 1 &&
        existingUsername.multiple_strategy_select == 0
      ) {
        var strategFind = await strategy_client.find({
          user_id: existingUsername._id,
        });

        var multy_stgfind = await client_services
          .find({
            user_id: existingUsername._id,
          })
          .select("strategy_id");

        if (multy_stgfind.length > 0) {
          multy_stgfind.forEach(async (data) => {
            if (data.strategy_id.length == 0) {
              const filter = { _id: data._id };
              const updateOperation = {
                $set: { strategy_id: [strategFind[0].strategy_id] },
              };
              const result = await client_services.updateOne(
                filter,
                updateOperation
              );
            }
          });
        }
      }

      if (
        req.multiple_strategy_select == 1 &&
        existingUsername.multiple_strategy_select == 1
      ) {
        var strategFind = await strategy_client.find({
          user_id: existingUsername._id,
        });

        var multy_stgfind = await client_services
          .find({
            user_id: existingUsername._id,
          })
          .select("strategy_id");

        if (multy_stgfind.length > 0) {
          multy_stgfind.forEach(async (data) => {
            if (data.strategy_id.length == 0) {
              const filter = { _id: data._id };
              const updateOperation = {
                $set: { strategy_id: [strategFind[0].strategy_id] },
              };
              const result = await client_services.updateOne(
                filter,
                updateOperation
              );
            }
          });
        }
      }

      // USER GET ALL TYPE OF DATA
      return res.send({
        status: true,
        msg: "User Update successfully",
        data: [],
      });
    } catch (error) {
      console.log("Error In User Update-", error);
    }
  }

  // GET ALL EXPIRED USERS
  async GetAllExpiredClients(req, res) {
    try {
      const { page, limit, Find_Role, user_ID } = req.body; //LIMIT & PAGE
      const skip = (page - 1) * limit;

      // GET ALL CLIENTS
      var AdminMatch;

      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10); // Sirf date part extract karo

      if (Find_Role == "ADMIN") {
        AdminMatch = {
          Role: "USER",
          Is_Active: "1",
          EndDate: { $lt: new Date(formattedDate) },
        };
      } else if (Find_Role == "SUBADMIN") {
        AdminMatch = { Role: "USER", parent_id: user_ID };
      }

      // const getAllClients = await User_model.find(AdminMatch)
      //   .skip(skip)
      //   .limit(Number(limit))
      //   .sort({ createdAt: -1 });

      const getAllClients = await User_model.aggregate([
        {
          $match: AdminMatch,
        },
        {
          $lookup: {
            from: "companies",
            let: {
              endDate: "$EndDate", // User_model ki EndDate ko use karenge
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$$endDate",
                        },
                      }, // User_model ki EndDate
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$month_ago_date",
                        },
                      }, // companyData ki month_ago_date
                    ],
                  },
                },
              },
            ],
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $sort: { CreateDate: -1 },
        },
        {
          $project: {
            companyData: 0,
          },
        },
      ]);

      const totalCount = getAllClients.length;
      // IF DATA NOT EXIST
      if (getAllClients.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          totalCount: totalCount,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Clients",
        totalCount: totalCount,
        data: getAllClients,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (error) {
      console.log("Error loginClients Error-", error);
    }
  }

  // GET ALL GetAllClients
  async GetAllClients(req, res) {
    try {
      const { page, limit, Find_Role, user_ID } = req.body; //LIMIT & PAGE

      // GET ALL CLIENTS
      var AdminMatch;

      if (Find_Role == "ADMIN") {
        AdminMatch = { Role: "USER",
          Is_Active: "1" };
      } else if (Find_Role == "SUBADMIN") {
        AdminMatch = { Role: "USER", parent_id: user_ID };
      }

      const getAllClients = await User_model.aggregate([
        {
          $match: AdminMatch,
        },
        {
          $lookup: {
            from: "companies",
            let: {
              endDate: "$EndDate", // endDate field
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$$endDate", null] }, // Handle null endDate
                      {
                        $gt: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: "$$endDate",
                            },
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: "$month_ago_date",
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $sort: { CreateDate: -1 },
        },
        {
          $project: {
            companyData: 0,
          },
        },
      ]);
      
      // IF DATA NOT EXIST
      if (getAllClients.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          // totalCount: totalCount,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Clients",
        data: getAllClients,
      });
    } catch (error) {
      return res.send({
        status: false,
        msg: "Empty data",
        data: [],
        // totalCount: totalCount,
      });
    }
  }

  // GET ALL LOGIN CLIENTS
  async loginClients(req, res) {
    try {
      // const getAllLoginClients = await User_model.find({
      //   $or: [{ AppLoginStatus: 1 }, { WebLoginStatus: 1 }],
      // });

      const getAllLoginClients = await User_model.aggregate([
        {
          $match: {
            $or: [{ AppLoginStatus: 1 }, { WebLoginStatus: 1 }],
          },
        },
        {
          $lookup: {
            from: "companies",
            let: {
              endDate: "$EndDate", // User_model ki EndDate ko use karenge
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$$endDate",
                        },
                      }, // User_model ki EndDate
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$month_ago_date",
                        },
                      }, // companyData ki month_ago_date
                    ],
                  },
                },
              },
            ],
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $sort: { CreateDate: -1 },
        },
        {
          $project: {
            companyData: 0,
          },
        },
      ]);

      if (getAllLoginClients.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      return res.send({
        status: true,
        msg: "Get All Login Clients",
        data: getAllLoginClients,
      });
    } catch (error) {
      console.log("Error loginClients Error-", error);
    }
  }

  // GET ALL TRADING ON  CLIENTS
  async tradingOnClients(req, res) {
    try {
      // GET LOGIN CLIENTS
      // const getAllTradingClients = await User_model.find({
      //   TradingStatus: "on",
      // });

      const getAllTradingClients = await User_model.aggregate([
        {
          $match: {
            TradingStatus: "on",
          },
        },
        {
          $lookup: {
            from: "companies",
            let: {
              endDate: "$EndDate", // User_model ki EndDate ko use karenge
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$$endDate",
                        },
                      }, // User_model ki EndDate
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$month_ago_date",
                        },
                      }, // companyData ki month_ago_date
                    ],
                  },
                },
              },
            ],
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $sort: { CreateDate: -1 },
        },
        {
          $project: {
            companyData: 0,
          },
        },
      ]);

      // IF DATA NOT EXIST
      if (getAllTradingClients.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          // totalCount: totalCount,
        });
      }

      return res.send({
        status: true,
        msg: "Get All trading Clients",
        data: getAllTradingClients,
      });
    } catch (error) {
      console.log("Error trading Clients Error-", error);
    }
  }

  // GET ALL TRADING ON  CLIENTS
  async GetTradingStatus(req, res) {
    try {
      const { Role } = req.body;
      const currentDate = new Date(); // Get the current date

      const GetAlluser_logs = await User_model.aggregate([
        {
          $match: {
            Role: "USER",
            $or: [{ license_type: "2" }, { license_type: "0" }],
            TradingStatus: Role,
            EndDate: { $gt: currentDate },
          },
        },
        {
          $lookup: {
            from: "companies",
            let: {
              endDate: "$EndDate",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$$endDate",
                        },
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$month_ago_date",
                        },
                      },
                    ],
                  },
                },
              },
            ],
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $sort: { CreateDate: -1 },
        },
        {
          $project: {
            Email: 1,
            FullName: 1,
            EndDate: 1,
            TradingStatus: 1,
            UserName: 1,
            PhoneNo: 1,
          },
        },
      ]);

      if (GetAlluser_logs.length === 0) {
        return res.status(200).json({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      return res.status(200).json({
        status: true,
        msg: "Get All user_logs",
        data: GetAlluser_logs,
      });
    } catch (error) {
      console.error("Error trading status Error-", error);
      return res.status(500).json({
        status: false,
        msg: "Internal server error",
      });
    }
  }

  // CLIENTS ACTIVE INACTIVE STATUS UPDATE
  async UpdateActiveStatus(req, res) {
    try {
      const { id, user_active_status, network_ip } = req.body;

      // Retrieve the user
      const get_user = await User_model.find({ _id: id });
      if (get_user.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          totalCount: 0,
        });
      }

      const filter = { _id: id };
      let updateOperation = {
        $set: {
          ActiveStatus: user_active_status,
          AppLoginStatus: "0",
          WebLoginStatus: "0",
          web_login_token: null,
          app_login_token: null,
        },
      };

      if (get_user[0].TradingStatus == "on" && user_active_status == 0) {
        updateOperation.$set.TradingStatus = "off";
        updateOperation.$set.access_token = "";
      }

      const result = await User_model.updateOne(filter, updateOperation);

      if (get_user[0].TradingStatus == "on" && user_active_status == 0) {
        const user_login1 = new user_logs({
          user_Id: new ObjectId(id),
          login_status: "Trading Off By System you are Inactive by admin",
          role: "USER",
          system_ip: network_ip,
        });
        await user_login1.save();
      }

      const user_login = new user_logs({
        user_Id: new ObjectId(id),
        login_status:
          "Admin " +
          (user_active_status == 0 ? "InActive" : "Active") +
          " User",
        role: "USER",
        device: "",
        system_ip: network_ip,
      });
      await user_login.save();

      if (result) {
        const status_msg =
          user_active_status == "0" ? "DeActivate" : "Activate";
        return res.send({
          status: true,
          msg: "Update Successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.send({
        status: false,
        msg: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // DELETE USER AND USER REGARD SERVICES
  async DeleteUser(req, res) {
    try {
      const { id } = req.body;
      // UPDATE ACTTIVE STATUS CLIENT

      const get_user = await User_model.find({ _id: id });
      if (get_user.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: [] });
      }

      var DeleteGroupServices = await groupService_User.deleteOne({
        user_id: get_user[0]._id,
      });
      var DeleteStartegyClient = await strategy_client.deleteMany({
        user_id: get_user[0]._id,
      });
      var DeleteClient_services = await client_services.deleteMany({
        user_id: get_user[0]._id,
      });
      var count_licenses_delete = await count_licenses.deleteMany({
        user_id: get_user[0]._id,
      });

      var DeleteUser = await User_model.deleteOne({ _id: get_user[0]._id });

      logger1.info(`Delete User Successfully`, {
        Email: get_user[0].Email,
        role: get_user[0].Role,
        user_id: get_user[0]._id,
      });

      return res.send({
        status: true,
        msg: "Delete Successfully",
        data: DeleteUser,
      });
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }

  // GET USER ALL INFORMATION
  async GetUserInfo(req, res) {
    try {
      const { id } = req.body;
      // UPDATE ACTTIVE STATUS CLIENT

      if (!id) {
        return res.send({
          status: false,
          msg: "Please Entrer User Id",
          data: [],
        });
      }
      var userId = new ObjectId(id);

      const get_user = await User_model.find({ _id: userId });

      if (get_user.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          // totalCount: totalCount,
        });
      }

      const pipeline = [
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: "groupservices_clients",
            localField: "_id",
            foreignField: "user_id",
            as: "groupservices_clients",
          },
        },
        {
          $unwind: "$groupservices_clients",
        },
        {
          $project: {
            "groupservices_clients.groupService_id": 1,
            _id: 1,
            FullName: 1,
            UserName: 1,
            Email: 1,
            PhoneNo: 1,
            StartDate: 1,
            EndDate: 1,
            license_type: 1,
            licence: 1,
            parent_id: 1,
            parent_role: 1,
            service_given_month: 1,
            api_secret: 1,
            app_id: 1,
            client_code: 1,
            api_key: 1,
            app_key: 1,
            api_type: 1,
            demat_userid: 1,
            broker: 1,
            multiple_strategy_select: 1,
            plan_id:1
          },
        },
      ];

      const GetAllClientServices = await User_model.aggregate(pipeline);

      const userSTG = await strategy_client.find({ user_id: userId });

      return res.send({
        status: true,
        msg: "Get User Successfully",
        data: GetAllClientServices,
        strategy: userSTG,
      });
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }

  async Update_Broker_Keys(req, res) {
    try {
      var userdata = req.body.data;
      var _id = req.body.id;

      User_model.findById(_id).then(async (value) => {
        if (!value) {
          return res.send({ status: false, msg: "Id not match", data: [] });
        }
        const filter = { _id: _id };
        const updateOperation = { $set: userdata };
        const result = await User_model.updateOne(filter, updateOperation);
        if (!result) {
          return res.send({ status: false, msg: "Key not update", data: [] });
        }

        return res.send({
          status: true,
          msg: "Update Keys  Successfully.",
          data: [],
        });
      });
    } catch (error) {
      console.log("Error Theme error-", error);
    }
  }

  // GET ONLY CLIENT KEY
  async GetclientKey(req, res) {
    try {
      const { id } = req.body;
      var _id = new ObjectId(id);
      const Client_key = await User_model.findOne({ _id }, "client_key");
      // CHECK IF PANEL EXIST OR NOT

      if (!Client_key) {
        return res
          .status(409)
          .json({ status: false, msg: "Client Not exists", data: [] });
      }
      return res.send({
        status: true,
        msg: "Get Client key",
        data: Client_key,
      });
    } catch (error) {}
  }

  // Duplicate Data
  async GetDuplicateData(req, res) {
    try {
      const Client_key = await User_model.aggregate([
        { $match: { license_type: "2" } },
        {
          $lookup: {
            from: "count_licenses",
            localField: "_id",
            foreignField: "user_id",
            as: "license_details",
          },
        },
        {
          $addFields: {
            total_licenses: {
              $sum: {
                $map: {
                  input: "$license_details.license",
                  as: "license",
                  in: { $toInt: "$$license" },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: "$UserName",
            licence: { $first: "$licence" },
            total_licenses: { $first: "$total_licenses" },
          },
        },
        {
          $match: {
            $or: [
              { licence: { $exists: false } },
              { total_licenses: { $exists: false } },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            UserName: "$_id",
            licence: 1,
            total_licenses: 1,
          },
        },
      ]);

      return res.send({
        status: true,
        msg: "Get Client key",
        data: Client_key,
      });
    } catch (error) {}
  }

  // Duplicate Data
  async DawnloadStatusandResponse(req, res) {
    try {
      const { id, key } = req.body;

      if (!id || !key) {
        return res
          .status(400)
          .json({ status: false, msg: "ID and key are required" });
      }
      let data;
      if (key == 1) {
        data = await user_logs.find({ user_Id: id });
      } else {
        data = await BrokerResponse.find({ user_id: id });
      }

      if (key == 1) {
        data = data.map((item, index) => {
          return {
            id: index + 1,
            Loginstatus: item.login_status,
            trading_status: item.trading_status,
            message: item.message,
            system_ip: item.system_ip,
            createdAt: new Date(item.createdAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
        });
      } else {
        data = data.map((item, index) => {
          return {
            id: index + 1,
            symbol: item.symbol,
            type: item.type,
            trading_symbol: item.trading_symbol,
            strategy: item.strategy,
            broker_name: item.broker_name,
            order_status: item.order_status,
            order_id: item.order_id,
            order_view_date: item.order_view_date,
            OrderStatus: item.order_view_response,
            reject_reason: item.reject_reason,
            createdAt: new Date(item.createdAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          };
        });
      }

      return res.status(200).json({
        status: true,
        msg: "Data retrieved successfully",
        data: data,
      });
    } catch (error) {
      console.log("Error in DawnloadStatusandResponse:", error);
      return res
        .status(500)
        .json({ status: false, msg: "Internal Server Error", error });
    }
  }

  async GetAllStarClients(req, res) {
    try {
      const { Find_Role, user_ID } = req.body;

      // GET ALL CLIENTS
      var AdminMatch;

      if (Find_Role == "ADMIN") {
        AdminMatch = { Role: "USER", starClient: "1" };
      } else if (Find_Role == "SUBADMIN") {
        AdminMatch = { Role: "USER", parent_id: user_ID, starClient: "1" };
      }

      // const getAllClients = await User_model.find(AdminMatch).sort({
      //   CreateDate: -1,
      // });

      const getAllClients = await User_model.aggregate([
        {
          $match: AdminMatch,
        },
        {
          $lookup: {
            from: "companies",
            let: {
              endDate: "$EndDate", // User_model ki EndDate ko use karenge
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$$endDate",
                        },
                      }, // User_model ki EndDate
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$month_ago_date",
                        },
                      }, // companyData ki month_ago_date
                    ],
                  },
                },
              },
            ],
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $sort: { CreateDate: -1 },
        },
        {
          $project: {
            companyData: 0,
          },
        },
      ]);

      // IF DATA NOT EXIST
      if (getAllClients.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
          // totalCount: totalCount,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Clients",
        data: getAllClients,
      });
    } catch (error) {
      console.log("Error loginClients Error-", error);
      return res.send({
        status: false,
        msg: "Empty data",
        data: [],
        // totalCount: totalCount,
      });
    }
  }

  // CLIENTS ACTIVE INACTIVE STATUS UPDATE
  async UpdateStarStatus(req, res) {
    try {
      const { id, StarStatus } = req.body;

      // Retrieve the user
      const getUser = await User_model.findById(id);
      if (!getUser) {
        return res.status(404).send({
          status: false,
          msg: "User not found",
          data: [],
          totalCount: 0,
        });
      }

      const filter = { _id: new ObjectId(id) };
      const updateOperation = {
        $set: {
          starClient: StarStatus,
        },
      };

      const result = await User_model.updateOne(filter, updateOperation);

      return res.send({
        status: true,
        msg: "Update Successfully",
        data: [],
      });
    } catch (error) {
      return res.status(500).send({
        status: false,
        msg: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async GetAllReferalClients(req, res) {
    try {
      const { Find_Role, username } = req.body;

      const AdminMatch =
        Find_Role === "ADMIN"
          ? { refer_code: { $ne: null, $ne: "" } }
          : { refer_code: username };

      let getAllClients = await user_SignUp
        .find(AdminMatch)
        .sort({ CreateDate: -1 });

      if (getAllClients.length > 0) {
        const updatePromises = getAllClients.map(async (data) => {
          const GetUser = await User_model.findOne({
            UserName: data.UserName,
          }).select("license_type refer_points");
          if (GetUser) {
            let updatestatus = 0;

            if (GetUser.license_type == 1 || GetUser.license_type == 0) {
              updatestatus = 1;
            } else if (GetUser.license_type == 2) {
              const GetUserSignup = await user_SignUp.findOne({
                UserName: data.UserName,
              });
              if (GetUserSignup.ActiveStatus == 2) {
                updatestatus = 2;
              } else {
                const refer_pointsData = await User_model.findOne({
                  UserName: data.refer_code,
                }).select("refer_points");

                updatestatus = 2;

                await User_model.updateOne(
                  { _id: refer_pointsData._id },
                  {
                    $set: {
                      refer_points:
                        refer_pointsData.refer_points + data.refer_points,
                    },
                  }
                );
              }
            }

            await user_SignUp.updateOne(
              { _id: data._id },
              { $set: { ActiveStatus: updatestatus } }
            );
          }
        });

        // Await all update operations
        await Promise.all(updatePromises);

        // Fetch all clients again after the update
        getAllClients = await user_SignUp
          .find(AdminMatch)
          .sort({ CreateDate: -1 });
      }

      if (getAllClients.length > 0) {
        getAllClients = getAllClients.filter((data) => {
          return (
            data.refer_code !== null &&
            data.refer_code !== "null" &&
            data.refer_code !== ""
          );
        });
      }

      if (getAllClients.length === 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }

      if (Find_Role === "USER") {
        const GetUser = await User_model.findOne({ UserName: username }).select(
          "license_type refer_points"
        );
        const UserReedeemPoint = await userReedeem_modal
          .find({ user_id: GetUser._id, ActiveStatus: "0" })
          .select("reedeem_points ActiveStatus");

        const sumReedeemPoints = UserReedeemPoint.reduce(
          (total, item) => total + item.reedeem_points,
          0
        );

        var AllPoints = GetUser.refer_points - sumReedeemPoints;

        if (AllPoints < 0) {
          AllPoints = 0;
        }

        return res.send({
          status: true,
          msg: "Get All Clients",
          data: getAllClients,
          data1: AllPoints,
        });
      } else {
        return res.send({
          status: true,
          msg: "Get All Clients",
          data: getAllClients,
        });
      }
    } catch (error) {
      console.log("Error in GetAllReferalClients:", error);
      return res.status(500).send({
        status: false,
        msg: "Internal Server Error",
        data: [],
      });
    }
  }

  async GetLastUserName(req, res) {
    try{

      let lastUser = await User_model.findOne({}).sort({ _id: -1 }).select("UserName");
      
      return res.send({
        status: true,
        msg: "Get Last User Name",
        data: lastUser,
      });

    }catch(error){
      console.log("Error in GetLastUserName:", error);
      return res.status(500).send({
        status: false,
        msg: "Internal Server Error",
        data: [],
      });
    }
  }

}

module.exports = new Employee();
