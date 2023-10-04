"use strict";
const db = require("../../Models");
const Signals_modal = db.Signals;
const user_model = db.user;
const count_licenses = db.count_licenses;
const company_information = db.company_information;

const { formattedDateTime } = require("../../Helper/time.helper");

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
      });

      if (get_user.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: get_user });
      }
      return res.send({ status: true, msg: "Get all Clients", data: get_user });
    } catch (error) {
      console.log("License  error-", error);
    }
  }

  // GET TRANSECTION LICENSE DATA
  async GetTransctionLicense(req, res) {
    try {
      const Transection_license = await count_licenses.aggregate([
        // {
        //   // $match: { admin_license: null }
        // },
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users", // Name of the user collection
            localField: "user_id", // Field in the count_licenses collection that links to users
            foreignField: "_id", // Field in the users collection that links to count_licenses
            as: "user", // Alias for the joined user information
          },
        },
        {
          $unwind: "$user", // Unwind the "user" array created by the $lookup stage
        },
        {
          $match: {
            "user.Role": { $in: ["USER", "ADMIN"] },
          }, // Filter by the user's role
        },
        {
          $project: {
            // _id: 0,
            // count_license: "$$ROOT", // Include the entire count_license document
            license: 1,
            admin_license: 1,
            createdAt: 1,
            "user.FullName": 1, // Extract only the "FullName" field from the "user" subdocument
            "user.UserName": 1, // Extract only the "FullName" field from the "user" subdocument
          },
        },
      ]);

      const total_licence = await company_information.find({});

      console.log("company_information", total_licence[0].licenses);

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
      console.log("License  error-", error);
    }
  }

  // GET SELECTED MONTH LICENCE
  async GetSelectedMonthLicence(req, res) {
    try {
      const companyInformation = await company_information.find({});

      console.log("company_information", companyInformation[0].licenses);
      return;
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
      console.log("License  error-", error);
    }
  }
}

module.exports = new License();
