"use strict";
const { connectToMongoDB } = require("../../Connection/mongo_connection");
const db = require("../../Models");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

const ObjectId = mongoose.Types.ObjectId;
const user = db.user;
const company_information = db.company_information;
const Broker_information = db.Broker_information;
const dashboard_data = db.dashboard_data;

class Dashboard {
  // ADMIN DASHBOARD
  async AdminDashboard(req, res) {
    try {
  
      const result = await dashboard_data.find().toArray();


      if ((result.length > 0)) {
        return res.send({
          status: true,
          msg: "Get Dashboard Data",
          totalCount: {
            total_client: result[0].total_client,
            total_active_client: result[0].total_active_client,
            total_expired_client: result[0].total_expired_client,
            total_live_client: result[0].total_live_client,
            total_active_live: result[0].total_active_live,
            total_expired_live: result[0].total_expired_live,
            total_demo_client: result[0].total_demo_client,
            total_active_demo: result[0].total_active_demo,
            total_expired_demo: result[0].total_expired_demo,
            total_two_days: result[0].total_two_days,
            total_active_two_days: result[0].total_active_two_days,
            total_expired_two_days: result[0].total_expired_two_days,
            all_licence: result[0].licenses,
            used_licence: result[0].used_licence,
            remaining_licence: result[0].remaining_license,
          },
        });
      } else {
        return res.send({
          status: true,
          msg: "Get Dashboard Data",
          totalCount: {
            total_client: 0,
            total_active_client: 0,
            total_expired_client: 0,
            total_live_client: 0,
            total_active_live: 0,
            total_expired_live: 0,
            total_demo_client: 0,
            total_active_demo: 0,
            total_expired_demo: 0,
            total_two_days: 0,
            total_active_two_days: 0,
            total_expired_two_days: 0,
            all_licence: 0,
            used_licence: 0,
            remaining_licence: 0,
          },
        });
      }

    } catch (error) {
      console.log("Error Get Admin Dashboard data -", error);
      connectToMongoDB();
      return;
    }
  }

  // ADD BROKER INFORMATION
  async add_broker_information(req, res) {
    try {
      var data = {
        broker_name: "Alice Blue",
        app_code: "RjFPYeubvHpGtaS",
        apiSecret:
          "UvdxLEFFzGyfvhmRNIMiIrialWteBChzLsgVHjXoDzuGVaAmgKeYnjqUpuflPzWDNhBJHFZHTsvHWzNbDrSyncOoIghVkIVSDQPx",
      };
      const Broker_informations = new Broker_information(data);
      return Broker_informations.save();
    } catch (error) {
      console.log("Error In Broker Informations", error);
    }
  }

  // Broker Information Update
  async update_broker_information(req, res) {
    try {
      const { id, broker_data } = req.body;

      Broker_information.findById(id).then(async (value) => {
        if (!value) {
          return res.send({ status: false, msg: "Not match", data: [] });
        }
        const filter = { _id: new ObjectId(id) };
        const updateOperation = { $set: broker_data };

        const result = await Broker_information.updateOne(
          filter,
          updateOperation
        );
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
      console.log("Error In Update Broker Informations", error);
    }
  }

  // GET BROKER INFORMATION
  async getall_broker_information(req, res) {
    try {
      var BrokerInformation = await Broker_information.find();

      if (BrokerInformation.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: [] });
      }

      return res.send({
        status: true,
        msg: "Get All Data",
        data: BrokerInformation,
      });
    } catch (error) {
      console.log("Error In Get All Broker Informations", error);
    }
  }

  // GET ONE BROKER INFORMATION
  async get_broker_information(req, res) {
    try {
      const { id } = req.body;
      Broker_information.findById(id).then(async (value) => {
        if (!value) {
          return res.send({ status: false, msg: "Not match", data: [] });
        }

        return res.send({
          status: true,
          msg: "Get Data Successfully.",
          data: value,
        });
      });
    } catch (error) {
     
    }
  }
}

module.exports = new Dashboard();
