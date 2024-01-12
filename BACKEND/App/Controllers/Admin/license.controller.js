"use strict";
const db = require("../../Models");
const Signals_modal = db.Signals;
const user_model = db.user;
const count_licenses = db.count_licenses;
const company_information = db.company_information;


class License {

  // GET Expired Clients
  async GetExpiredclients(req, res) {
    try {
      const currentDate = new Date();

      // Calculate the date 3 days from now
      const endDateThreshold = new Date(currentDate);
      endDateThreshold.setDate(currentDate.getDate() + 3);

      const get_user = await user_model.find({
        Role: "USER",
        EndDate: {
          $gte: currentDate,
          $lte: endDateThreshold,
        },
      }).select("UserName Email PhoneNo StartDate EndDate")

      if (get_user.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: get_user });
      }
      return res.send({ status: true, msg: "Get all Clients", data: get_user });
    } catch (error) {
      console.log("Error Get Expiry Client-", error);
    }
  }

  // GET TRANSECTION LICENSE DATA
  async GetTransctionLicense(req, res) {
    try {
      const Transection_license = await count_licenses.aggregate([

        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.Role": { $in: ["USER", "ADMIN"] },
          },
        },
        {
          $project: {

            license: 1,
            admin_license: 1,
            createdAt: 1,
            "user.FullName": 1,
            "user.UserName": 1,
          },
        },
      ]);

      const total_licence = await company_information.find({});

      if (Transection_license.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: Transection_license,
        });
      }
      return res.send({
        status: true,
        msg: "Get all Transection license",
        data: Transection_license,
        total_licence: total_licence[0].licenses,
      });
    } catch (error) {
      console.log("Error Get All Transction License -", error);
    }
  }

  // GET SELECTED MONTH LICENCE
  async GetSelectedMonthLicence(req, res) {
    try {
      const companyInformation = await company_information.find({});

      if (Transection_license.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          //   data: Transection_license,
        });
      }
      return res.send({
        status: true,
        msg: "Get all Transection license",
        // data: Transection_license,
      });
    } catch (error) {
      console.log("Error License  error-", error);
    }
  }

}

module.exports = new License();
