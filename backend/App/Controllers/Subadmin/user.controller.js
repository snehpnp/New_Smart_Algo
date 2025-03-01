"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");
const User_model = db.user;
const user_logs = db.user_logs;
const Role_model = db.role;
const Company_info = db.company_information;
const strategy_client = db.strategy_client;
const groupService_User = db.groupService_User;
const client_services = db.client_services;
const serviceGroup_services_id = db.serviceGroup_services_id;
const count_licenses = db.count_licenses;
const user_activity_logs = db.user_activity_logs;
const strategy = db.strategy;
const serviceGroupName = db.serviceGroupName;
const Subadmin_Permission = db.Subadmin_Permission;

const { CommonEmail } = require("../../Helper/CommonEmail");
const { firstOptPass } = require("../../Helper/Email_formate/first_login");

const {  getIPAddress } = require("../../Helper/logger.helper");

var dateTime = require("node-datetime");
var dt = dateTime.create();

// OK
// Product CLASS
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
        multiple_strategy_select
      } = req.body;


      // Panel Prifix key Find
      var Panel_key = await Company_info.find();

      let Strategies_id_array = [];



      if (multiple_strategy_select == "0") {
        Strategies_id_array.push(Strategies[0].id)


      } else {
        let count = 0
        for (const strategy of Strategies) {

          Strategies_id_array.push(strategy.id)

        }
      }



      var Role = "USER";
      var StartDate1 = "";
      var EndDate1 = "";
      var is_active = "1"
      var ActiveStatus = "1"

      // IF ROLE NOT EXIST TO CHECK
      const roleCheck = await Role_model.findOne({ name: Role.toUpperCase() });
      if (!roleCheck) {
        return res.send({ status: false, msg: "Role Not exists", data: [] });
      }

      // IF USER ALEARDY EXIST
      const existingUsername = await User_model.findOne({ UserName: UserName });
      if (existingUsername) {
        return res.send({
          status: false,
          msg: "Username already exists",
          data: [],
        });
      }

      const existingemail = await User_model.findOne({ Email: Email });
      if (existingemail) {
        return res.send({
          status: false,
          msg: "Email already exists",
          data: [],
        });
      }

      const existingePhone = await User_model.findOne({ PhoneNo: PhoneNo });
      if (existingePhone) {
        return res.send({
          status: false,
          msg: "Phone Number already exists",
          data: [],
        });
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
      if (group_service == "") {
        return res.send({
          status: false,
          msg: "Please Select a one Group",
          data: [],
        });
      }





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


        if ((parseInt(TotalLicense) + parseInt(licence)) > Number(Panel_key[0].licenses || 0)) {

          return res.send({
            status: false,
            msg: "You Dont Have License",
            data: [],
          })
        }

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

        // StartDate1 = start_date;
        StartDate1 = null;


        var UpdateDate = "";
        var StartDate = new Date(start_date);

        UpdateDate = StartDate.setMonth(
          StartDate.getMonth() + parseInt(licence)
        );

        var end_date_2days = dateTime.create(UpdateDate);
        var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

        // EndDate1 = end_date_2days;
        EndDate1 = null;

        ActiveStatus = "0"
        is_active = "0"
      }

      const min = 1;
      const max = 1000000;
      const rand = min + Math.random() * (max - min);
      // var rand_password = Math.round(rand);
      var rand_password = Math.round(123456);

      const salt = await bcrypt.genSalt(10);
      var ByCryptrand_password = await bcrypt.hash(
        rand_password.toString(),
        salt
      );


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

      var user_data = {
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
        licence: license_type == "2" ? '0' : licence,
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
        Is_Active: is_active,
        ActiveStatus: ActiveStatus
      };

      const User = new User_model(user_data);
      const userinfo = User.save()
        .then(async (data) => {
          var User_id = data._id;

          // GROUP SERVICE ADD
          const User_group_service = new groupService_User({
            groupService_id: group_service,
            user_id: User_id,
          });
          User_group_service.save();

          // STRATEGY ADD
          try {
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
          } catch { }


          const group_service_find = await serviceGroup_services_id.aggregate([
            {
              $match: {
                Servicegroup_id: new ObjectId(group_service)
              }
            },
            {
              $lookup: {
                from: "services",
                localField: "Service_id",
                foreignField: "_id",
                as: "serviceInfo"
              }
            },
            {
              $unwind: "$serviceInfo"
            },
            {
              $project: {
                _id: 0, // Exclude the _id field if you don't need it
                Service_id: "$Service_id",
                lotsize: "$serviceInfo.lotsize",
                instrumenttype: "$serviceInfo.instrumenttype",
                product_type: "$product_type"
              }
            }
          ]);

          // CLIENT SERVICES ADD API
          if (group_service_find.length != 0) {
            group_service_find.forEach((data) => {
              const User_client_services = new client_services({
                user_id: User_id,
                group_id: group_service,
                service_id: data.Service_id,
                strategy_id: Strategies_id_array,
                uniqueUserService: User_id + "_" + data.Service_id,
                quantity: data.lotsize,
                lot_size: 1,
                product_type: data.product_type,
              });
              User_client_services.save();
            });
          }

          // LICENSE TABLE ADD USE LICENSE OUR CLIENT
          // if (license_type == "2") {
          //   const count_licenses_add = new count_licenses({
          //     user_id: User_id,
          //     license: licence,
          //   });
          //   count_licenses_add.save();
          // }

          var toEmail = Email;
          var subjectEmail = "User ID and Password";
          var email_data = {
            FullName: FullName,
            Email: Email,
            Password: rand_password,
          };
          var EmailData = await firstOptPass(email_data);

          CommonEmail(toEmail, subjectEmail, EmailData);

      
          return res.send({ status: true, msg: "successfully Add!", data: data });
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
      return res.send({ msg: "Error=>", error });
    }
  }



  // UPDATE USER
  async UpdateUser(req, res) {
    try {
      var req = req.body.req;
      var StartDate1 = "";
      var EndDate1 = "";

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


      if (req.Strategies.length == 0) {
        return res.send({
          status: false,
          msg: "Please Select a one Strategy",
          data: [],
        });
      }

      if (req.group_service == "") {
        return res.send({
          status: false,
          msg: "Please Select a one Group",
          data: [],
        });
      }


      if (req.parent_id == "") {
        return res.send({
          status: false,
          msg: "Please Select parent",
          data: [],
        });
      }

      var TotalMonth = "0";

      var Panel_key = await Company_info.find();

      const totalLicense = await User_model.aggregate([
        {
          $match: {
            license_type: "2",
            licence: { $exists: true, $ne: null, $not: { $type: 10 } },
          },
        },
        {
          $group: {
            _id: null,
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


      if (Number(new_licence) > 0) {


        if ((parseInt(TotalLicense) + parseInt(new_licence)) > Number(Panel_key[0].licenses)) {

          return res.send({
            status: false,
            msg: "You Dont Have License",
            data: [],
          })
        }

      }



      var is_active = "1"
      var ActiveStatus = "1"

      if (existingUsername.license_type != "2") {
        if (req.license_type == "0") {
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
        } else if (req.license_type == "1") {

          StartDate1 = req.fromdate;
          EndDate1 = req.todate;
        } else if (req.license_type == "2") {
          var currentDate = new Date();
          var start_date_2days = dateTime.create(currentDate);
          start_date_2days = start_date_2days.format("Y-m-d H:M:S");
          var start_date = start_date_2days;
          StartDate1 = 0;

          var UpdateDate = "";
          var StartDate = new Date(start_date);

          UpdateDate = StartDate.setMonth(
            StartDate.getMonth() + parseInt(new_licence)
          );

          var end_date_2days = dateTime.create(UpdateDate);
          var end_date_2days = end_date_2days.format("Y-m-d H:M:S");

          EndDate1 = 0;
          TotalMonth = 0;
          is_active = "0"
          ActiveStatus = "0"
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



      const get_user = await Subadmin_Permission.find({ user_id: req.parent_id }).select('strategy')



      try {
        const Strategieclient = await strategy_client.find({
          user_id: existingUsername._id,
        });

        var db_exist_startegy = [];
        Strategieclient.forEach(function (item, index) {
          db_exist_startegy.push(item.strategy_id.toString());
        });

        var insert_startegy = [];
        req.Strategies.forEach(function (item, index) {
          insert_startegy.push(item.id);
        });

        var add_startegy = [];
        insert_startegy.forEach(function (item, index) {
          if (!db_exist_startegy.includes(item)) {
            add_startegy.push(item);
          }
        });

        var delete_startegy = [];
        db_exist_startegy.forEach(function (item, index) {
          if (!insert_startegy.includes(item)) {
            if (get_user[0].strategy.includes(item)) {

              delete_startegy.push(item);
            }
          }
        });




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
              system_ip: getIPAddress(),
              device: req.device,
            });
            await user_activity.save();
          });
        }


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
              system_ip: getIPAddress(),
              device: req.device,
            });
            await user_activity.save();
          });
        }


        if (delete_startegy.length > 0) {
          delete_startegy.forEach(async (data) => {
            var stgId = new ObjectId(data);

            var deleteStrategy = await strategy_client.find({
              user_id: existingUsername._id,
              strategy_id: { $ne: stgId }
            });


            if (req.multiple_strategy_select == 0) {
              if (delete_startegy.length > 0) {

                if (deleteStrategy.length > 0) {
                  var update_services = await client_services.updateMany(
                    { user_id: existingUsername._id, strategy_id: stgId },
                    { $set: { strategy_id: deleteStrategy[0].strategy_id } }
                  );
                } else {
                  var update_services = await client_services.updateMany(
                    { user_id: existingUsername._id, strategy_id: stgId },
                    { $set: { strategy_id: add_startegy[0] } }
                  );
                }


              } else {
                var update_stg = new ObjectId(add_startegy[0]);

                var update_services = await client_services.updateMany(
                  { user_id: existingUsername._id, strategy_id: stgId },
                  { $set: { strategy_id: update_stg } }
                );
              }
            } else {

              if (delete_startegy.length > 0) {

                const deleteStrategyIds = delete_startegy.map(data => new ObjectId(data));

                const updatePromises = deleteStrategyIds.map(data =>
                  client_services.updateMany(
                    { user_id: existingUsername._id },
                    { $pull: { strategy_id: data } }
                  )
                );

                const results = await Promise.all(updatePromises);

              }


            }
          });
        }
      } catch (error) {
      }


      try {
        const GroupServiceId = new ObjectId(req.group_service);

        const user_group_service = await groupService_User.find({
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



          const GroupServices = await serviceGroup_services_id.aggregate([
            {
              $match: {
                Servicegroup_id: GroupServiceId
              }
            },
            {
              $lookup: {
                from: "services",
                localField: "Service_id",
                foreignField: "_id",
                as: "serviceInfo"
              }
            },
            {
              $unwind: "$serviceInfo"
            },
            {
              $project: {
                _id: 0,
                Service_id: "$Service_id",
                product_type:"$product_type",
                lotsize: "$serviceInfo.lotsize",
                instrumenttype: "$serviceInfo.instrumenttype"
              }
            }
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
              product_type: data.product_type
            });

            User_client_services.save();
          });

          const user_activity = new user_activity_logs({
            user_id: existingUsername._id,
            message: "Update Group ",
            Strategy: GroupclientNAme[0].name,
            role: req.Editor_role.toUpperCase(),
            system_ip: getIPAddress(),
            device: req.device,
          });
          await user_activity.save();
        } else {

        }
      } catch (error) {
      }

      var User_update = {
        FullName: req.FullName,
        license_type: req.license_type,
        licence: TotalMonth,
        StartDate: StartDate1 === null ? existingUsername.StartDate : StartDate1 == 0 ? null : StartDate1,
        EndDate: EndDate1 === null ? existingUsername.EndDate : EndDate1 == 0 ? null : EndDate1,
        broker: req.broker,
        parent_id: req.parent_id,
        parent_role: req.parent_role,
        api_secret: req.api_secret,
        app_id: req.app_id,
        client_code: req.client_code,
        api_key: req.api_key,
        app_key: req.app_key,
        api_type: req.api_type,
        demat_userid: req.demat_userid,
        service_given_month: req.service_given_month,
        Is_Active: is_active,
        ActiveStatus: ActiveStatus
      };

      const User_Update = await User_model.updateOne(
        { _id: existingUsername._id },
        { $set: User_update }
      );

      if (existingUsername.license_type == "2") {
        if (req.license_type == "2" || req.license_type == 2) {

          if (Number(new_licence) > 0) {
            const count_licenses_add = new count_licenses({
              user_id: existingUsername._id,
              license: new_licence,
            });
            count_licenses_add.save();
          }
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


  // SUBADMIN CLIENTS ACTIVE INACTIVE STATUS UPDATE
  async UpdateActiveStatus(req, res) {
    try {
      const { id, user_active_status } = req.body;

      const get_user = await User_model.find({ _id: id });

      const totalLicense = await User_model.aggregate([
        {
          $match: {
            license_type: "2",
            licence: { $exists: true, $ne: null, $not: { $type: 10 } }, 
          },
        },
        {
          $group: {
            _id: null, 
            totalLicense: {
              $sum: { $toInt: "$licence" },
            },
          },
        },
      ]);
      var Panel_key = await Company_info.find(
        {},
        { prefix: 1, licenses: 1, _id: 0 }
      ).limit(1);


      if (totalLicense.length > 0) {
        var TotalLicense = totalLicense[0].totalLicense;
      } else {
        var TotalLicense = 0;
      }
      if (
        parseInt(TotalLicense) + parseInt(1) >
        Number(Panel_key[0].licenses)
      ) {
        return res.send({
          status: false,
          msg: "You Dont Have License",
          data: [],
        });
      }


      if (get_user.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: [],
        });
      }


      var StartDate1
      var EndDate1
      var licence = 1
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

      const filter = { _id: id };




      const updateOperation = {
        $set: {
          Is_Active: 1,
          ActiveStatus: 1,
          StartDate: StartDate1,
          EndDate: EndDate1,
          licence: "1"
        }
      };

      const result = await User_model.updateOne(filter, updateOperation);

      const count_licenses_add = new count_licenses({
        user_id: get_user[0]._id,
        license: '1',
      });

      count_licenses_add.save();

      if (result) {
        // STATUS UPDATE SUCCESSFULLY
        var status_msg = user_active_status == "0" ? "DeActivate" : "Activate";


        return res.send({
          status: true,
          msg: "Update Successfully",
          data: result,
        });
      }

    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }


  // GET USER ALL Client
  async getClientBySubadminId(req, res) {
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

      const get_user = await User_model.find({
        parent_id: id,
        parent_role: "SUBADMIN",
      }).select("FullName UserName Email PhoneNo StartDate license_type");

      if (get_user.length == 0) {
        return res.send({ status: false, msg: "No Dat Found", data: [] });
      }

      return res.send({
        status: true,
        msg: "Get Users",
        data: get_user,
      });
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }


  // // GET SUBADMIN PERMISSION
  async Subadmn_Permission(req, res) {
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

      const get_user = await Subadmin_Permission.find({ user_id: userId });

      if (get_user.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: [] });
      }

      return res.send({
        status: true,
        msg: "Get Permission Successfully",
        data: get_user,
      });
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }













  // -------------------------






  // GET ALL GetAllClients
  async GetAllClients(req, res) {
    try {
      const { page, limit, Find_Role, user_ID } = req.body; //LIMIT & PAGE
      const skip = (page - 1) * limit;

      // GET ALL CLIENTS
      var AdminMatch;

      if (Find_Role == "ADMIN") {
        AdminMatch = { Role: "USER" };
      } else if (Find_Role == "SUBADMIN") {
        AdminMatch = { Role: "USER", parent_id: user_ID };
      }

      const getAllClients = await User_model.find(AdminMatch)
        .skip(skip)
        .limit(Number(limit));

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

  // GET ALL LOGIN CLIENTS
  async loginClients(req, res) {
    try {
      // GET LOGIN CLIENTS
      const getAllLoginClients = await User_model.find({
        $or: [{ AppLoginStatus: 1 }, { WebLoginStatus: 1 }],
      });
      const totalCount = getAllLoginClients.length;
      // IF DATA NOT EXIST
      if (getAllLoginClients.length == 0) {
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
        msg: "Get All Login Clients",
        totalCount: totalCount,
        data: getAllLoginClients,
        // page: Number(page),
        // limit: Number(limit),
        // totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (error) {
      console.log("Error loginClients Error-", error);
    }
  }

  // GET ALL TRADING ON  CLIENTS
  async tradingOnClients(req, res) {
    try {
      // GET LOGIN CLIENTS
      const getAllTradingClients = await User_model.find({
        TradingStatus: "on",
      });
      const totalCount = getAllTradingClients.length;

      // IF DATA NOT EXIST
      if (getAllTradingClients.length == 0) {
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
        msg: "Get All trading Clients",
        data: getAllTradingClients,
        // page: Number(page),
        // limit: Number(limit),
        totalCount: totalCount,
        // totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (error) {
      console.log("Error trading Clients Error-", error);
    }
  }

  // GET ALL TRADING ON  CLIENTS
  async GetTradingStatus(req, res) {
    try {
      const { Role } = req.body;
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
          $unwind: "$userinfo",
        },
        {
          $match: {
            "userinfo.Role": Role, // Replace 'desired_role_here' with the role you want to filter by
          },
        },
        {
          $project: {
            "userinfo.FullName": 1,
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
        msg: "Get All user_logs",
        data: GetAlluser_logs,
        // page: Number(page),
        // limit: Number(limit),
        totalCount: totalCount,
        // totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (error) {
      console.log("Error trading status Error-", error);
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
          totalCount: totalCount,
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



}

module.exports = new Employee();
