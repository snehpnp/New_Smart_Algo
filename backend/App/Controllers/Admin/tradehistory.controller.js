"use strict";
const db = require("../../Models");
const MainSignals_modal = db.MainSignals;
const live_price = db.live_price;
const user_logs = db.user_logs;
const { logger, getIPAddress } = require("../../Helper/logger.helper");

const { formattedDateTime } = require("../../Helper/time.helper");

class Tradehistory {
  // GET ADMIN SIGNALS
  // async GetAdminTradeHistory(req, res) {
  //   try {
  //     const { startDate, endDate, strategy, service, type, serviceIndex, lotMultypaly } = req.body;

  //     var client_persnal_key1 = ""
  //     if (type != undefined || type != 'undefined') {
  //       if (type.toUpperCase() == "ADMIN") {
  //         client_persnal_key1 = ""
  //       } else {
  //         client_persnal_key1 = { $ne: "" }
  //       }
  //     }

  //     var lotMultypaly1 = 1

  //     if (lotMultypaly == undefined || lotMultypaly == 'undefined') {
  //       lotMultypaly1 = 1
  //     } else {
  //       lotMultypaly1 = Number(lotMultypaly)
  //     }

  //     let startDateObj = new Date(startDate ? startDate : new Date())
  //     let endDateObj = new Date(endDate ? endDate : new Date())
  //     let stg1
  //     let ser1
  //     let serIndex
  //     //  For Strategy

  //     const strategyWord = strategy.trim();

  //     if (typeof serviceIndex === "object" || serviceIndex == "null") {
  //       serIndex = { $exists: true };
  //     } else {
  //       serIndex = serviceIndex;
  //     }

  //     if (strategyWord === "null") {
  //       stg1 = { $exists: true }

  //     } else {
  //       stg1 = strategyWord
  //     }

  //     if (service === "null") {
  //       ser1 = { $exists: true }
  //     } else {
  //       ser1 = service
  //     }

  //     if (startDate == startDate) {

  //       endDateObj.setDate(endDateObj.getDate() + 1);
  //     }

  //     const filteredSignals = await MainSignals_modal.aggregate([
  //       {
  //         $match: {
  //           createdAt: {
  //             $gte:  new Date(startDateObj),
  //             $lte:  new Date(endDateObj),
  //           },
  //           strategy: stg1,
  //           trade_symbol: ser1,
  //           symbol: serIndex,
  //           client_persnal_key: client_persnal_key1,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "signals",
  //           localField: "signals_id",
  //           foreignField: "_id",
  //           as: "result",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "services",
  //           localField: "symbol",
  //           foreignField: "name",
  //           as: "result1",
  //         },
  //       },
  //       {
  //         $sort: {
  //           _id: -1,
  //         },
  //       },
  //       {
  //         $match: {
  //           $expr: {
  //             $gt: [
  //               { $size: "$result" },
  //               0
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $match: {
  //           $expr: {
  //             $gt: [
  //               { $size: "$result1" },
  //               0
  //             ],
  //           },
  //         },
  //       },
  //     ]);

  //     const filteredSignals_tradesymbols = await MainSignals_modal.aggregate([
  //       {
  //         $match: {
  //           createdAt: {
  //             $gte:  new Date(startDateObj),
  //             $lte:  new Date(endDateObj),
  //           },
  //           client_persnal_key: client_persnal_key1,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "signals",
  //           localField: "signals_id",
  //           foreignField: "_id",
  //           as: "result",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "services",
  //           localField: "symbol",
  //           foreignField: "name",
  //           as: "result1",
  //         },
  //       },
  //       {
  //         $sort: {
  //           _id: -1,
  //         },
  //       },
  //       {
  //         $match: {
  //           $expr: {
  //             $gt: [
  //               { $size: "$result" },
  //               0
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $match: {
  //           $expr: {
  //             $gt: [
  //               { $size: "$result1" },
  //               0
  //             ],
  //           },
  //         },
  //       },
  //     ]);

  //     const groupedData = filteredSignals_tradesymbols.reduce((acc, curr) => {
  //       if (!acc[curr.trade_symbol]) {
  //         acc[curr.trade_symbol] = 1;
  //       } else {
  //         acc[curr.trade_symbol]++;
  //       }
  //       return acc;
  //     }, {});

  //     const trade_symbols_filter = Object.keys(groupedData);

  //     if (filteredSignals.length > 0) {

  //       filteredSignals.filter(function (item) {

  //         item.entry_qty_percent = Number(item.result1[0].lotsize) * (Math.ceil(Number(item.entry_qty_percent) / 100)),
  //           item.exit_qty_percent = Number(item.result1[0].lotsize) * (Math.ceil(Number(item.exit_qty_percent) / 100)),

  //           item.entry_qty = Number(item.result1[0].lotsize) * lotMultypaly1 || 1,
  //           item.exit_qty = item.exit_qty_percent == "" ? 0 : Number(item.result1[0].lotsize) * lotMultypaly1 || 1
  //       });

  //     }

  //     if (filteredSignals.length === 0) {
  //       return res.send({ status: false, msg: 'No signals founddate range.', data: [] });
  //     }
  //     return res.send({ status: true, msg: 'Filtered Tradehistory', data: filteredSignals, trade_symbols_filter: trade_symbols_filter });

  //   } catch (error) {
  //     console.log("Error Trade History Error-", error);
  //   }
  // }

  async GetAdminTradeHistory(req, res) {
    try {
      const {
        startDate,
        endDate,
        strategy,
        service,
        type,
        serviceIndex,
        lotMultypaly,
        page,
        limit,
        openClose,
      } = req.body;

      var page1 = page || 1;
      var limit1 = limit || 1000;

      var client_persnal_key1 = "";
      if (type != undefined || type != "undefined") {
        if (type.toUpperCase() == "ADMIN") {
          client_persnal_key1 = "";
        } else {
          client_persnal_key1 = { $ne: "" };
        }
      }

      var lotMultypaly1 =
        lotMultypaly === undefined || lotMultypaly === "undefined"
          ? 1
          : Number(lotMultypaly);

      let startDateObj = new Date(startDate ? startDate : new Date());
      let endDateObj = new Date(endDate ? endDate : new Date());

      const strategyWord = strategy.trim();

      let serIndex =
        typeof serviceIndex === "object" || serviceIndex === "null"
          ? { $exists: true }
          : serviceIndex;
      let stg1 = strategyWord === "null" ? { $exists: true } : strategyWord;
      let ser1 = service === "null" ? { $exists: true } : service;

      if (startDate == startDate) {
        endDateObj.setDate(endDateObj.getDate() + 1);
      }


      let openClose1 = { exit_qty_percent: "" };
      if (openClose === "Open") {
        openClose1 = { exit_qty_percent: "" };
      } else if (openClose === "Close") {
        openClose1 = { exit_qty_percent: { $ne: "" } };
      } else {
        openClose1 = {};
      }

      const matchStage = {
        createdAt: {
          $gte: new Date(startDateObj),
          $lte: new Date(endDateObj),
        },
        strategy: stg1,
        trade_symbol: ser1,
        symbol: serIndex,
        client_persnal_key: client_persnal_key1,
        ...openClose1,
      };


      const filteredSignals = await MainSignals_modal.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        { $sort: { _id: -1 } },
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
        { $skip: (page1 - 1) * limit1 },
        { $limit: limit1 },
      ]);

      const totalItems = await MainSignals_modal.countDocuments(matchStage);

      const groupedData = await MainSignals_modal.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDateObj),
              $lte: new Date(endDateObj),
            },
            client_persnal_key: client_persnal_key1,
          },
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        { $sort: { _id: -1 } },
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
      ]);

      const trade_symbols_filter = Object.keys(
        groupedData.reduce((acc, curr) => {
          if (!acc[curr.trade_symbol]) {
            acc[curr.trade_symbol] = 1;
          } else {
            acc[curr.trade_symbol]++;
          }
          return acc;
        }, {})
      );

      if (filteredSignals.length > 0) {
        filteredSignals.forEach((item) => {
          item.entry_qty_percent =
            Number(item.result1[0].lotsize) *
            Math.ceil(Number(item.entry_qty_percent) / 100);
          item.exit_qty_percent =
            Number(item.result1[0].lotsize) *
            Math.ceil(Number(item.exit_qty_percent) / 100);
          item.entry_qty = Number(item.result1[0].lotsize) * lotMultypaly1 || 1;
          item.exit_qty =
            item.exit_qty_percent == "" || "" || 0
              ? 0
              : Number(item.result1[0].lotsize) * lotMultypaly1 || "";
        });
      }

      const filteredSignals1 = await MainSignals_modal.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        { $sort: { _id: -1 } },
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
      ]);

      let TotalCalculate = 0;
      if (filteredSignals1.length > 0) {
        filteredSignals1.forEach((item) => {
          if (item.entry_price != "" && item.exit_price != "") {
            var TotalQty = Number(item.result1[0].lotsize) * lotMultypaly1 || 1;

            item.entry_qty_percent =
              Number(item.result1[0].lotsize) *
              Math.ceil(Number(item.entry_qty_percent) / 100);
            item.exit_qty_percent =
              Number(item.result1[0].lotsize) *
              Math.ceil(Number(item.exit_qty_percent) / 100);
            item.entry_qty =
              Number(item.result1[0].lotsize) * lotMultypaly1 || 1;
            item.exit_qty =
              item.exit_qty_percent == "" || "" || 0
                ? 0
                : Number(item.result1[0].lotsize) * lotMultypaly1 || "";

                TotalCalculate += (item.entry_type === "LE") 
                ? (item.exit_price - item.entry_price) * TotalQty
                : (item.entry_price - item.exit_price) * TotalQty;
          }
        });
      }

      return res.send({
        status: true,
        msg: "Filtered Trade history",
        data: filteredSignals,
        trade_symbols_filter: trade_symbols_filter,
        pagination: {
          page: Number(page1),
          limit: Number(limit1),
          totalItems,
          totalPages: Math.ceil(totalItems / limit1),
        },
        TotalCalculate: TotalCalculate ? TotalCalculate : 0,
      });
    } catch (error) {
      console.log("Error Trade History Error-", error);
      return res
        .status(500)
        .send({ status: false, msg: "Internal Server Error" });
    }
  }

  // GET ADMIN SIGNALS
  async GetAdminsevenTradeHistory(req, res) {
    try {
      const today = new Date(); // Aaj ki date
      const sevenDaysAgo = new Date(today); // Aaj ki date se 7 din pehle ki date
      sevenDaysAgo.setDate(today.getDate() - 7);

      const filteredSignals = await MainSignals_modal.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sevenDaysAgo, // Aaj se pichle 7 din se greater than or equal
              $lte: today, // Aaj se less than or equal
            },
          },
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        {
          $sort: {
            _id: -1, // Sort in ascending order. Use -1 for descending.
          },
        },
        {
          $match: {
            $expr: {
              $gt: [{ $size: "$result" }, 0],
            },
          },
        },
        {
          $match: {
            $expr: {
              $gt: [{ $size: "$result1" }, 0],
            },
          },
        },
      ]);

      if (filteredSignals.length > 0) {
        filteredSignals.filter(function (item) {
          (item.entry_qty_percent =
            Number(item.result1[0].lotsize) *
            Math.ceil(Number(item.entry_qty_percent) / 100)),
            (item.exit_qty_percent =
              Number(item.result1[0].lotsize) *
              Math.ceil(Number(item.exit_qty_percent) / 100));
        });
      }

      var tradeArr = [];
      filteredSignals.forEach((data) => {
        var entry_qty_percent1 = data.entry_qty_percent
          ? Number(data.entry_qty_percent)
          : 0;
        var exit_qty_percent1 = data.exit_qty_percent
          ? Number(data.exit_qty_percent)
          : 0;

        if (entry_qty_percent1 > exit_qty_percent1) {
          data.entry_qty_percent = entry_qty_percent1 - exit_qty_percent1;
          tradeArr.push(data);
        }
      });

      if (tradeArr.length == 0) {
        return res.send({ status: false, data: tradeArr, msg: "Empty Data" });
      }

      return res.send({ status: true, data: tradeArr, msg: "Get All Data" });
    } catch (error) {
      console.log("Error Get All Trade History Data-", error);
    }
  }

  // ADMIN TRADING STATUS GET
  async AdminTradingStatus(req, res) {
    try {
      const { broker_name } = req.body;

      var Admin_information = await live_price.find({
        broker_name: "ALICE_BLUE",
      });

      if (Admin_information.length == 0) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      if (Admin_information[0].trading_status == "off") {
        return res.send({
          status: false,
          msg: "Already Trading Off",
          data: false,
        });
      }

      return res.send({ status: true, msg: "Trading status get", data: true });
    } catch (error) {
      console.log("Error error", error);
    }
  }

  async AdminTradingOff(req, res) {
    try {
      const { broker_name, device } = req.body;

      var Admin_information = await live_price.find({
        broker_name: broker_name,
      });

      if (Admin_information.length == 0) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      if (Admin_information[0].trading_status == "off") {
        return res.send({
          status: false,
          msg: "Already Trading Off",
          data: [],
        });
      }

      const User_Update = await live_price.updateOne(
        { broker_name: broker_name },
        { $set: { trading_status: "off", access_token: "" } }
      );

      const user_login = new user_logs({
        user_Id: Admin_information[0].user_id,
        trading_status: "Admin Trading off",
        role: "ADMIN",
        system_ip: getIPAddress(),
        device: device,
      });
      await user_login.save();

      return res.send({
        status: true,
        msg: "Admin Trading Off successfully",
        data: [],
      });
    } catch (error) {
      console.log("Error error", error);
    }
  }

  async AdminTradingStatusGet(req, res) {
    try {
      // Calculate the date 3 days ago from today
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const mongoose = require("mongoose");
      const ObjectId = mongoose.Types.ObjectId;

      var Admin_information = await user_logs
        .find({
          // user_Id: new ObjectId(req.body.id),
          trading_status: { $in: ["Admin Trading On", "Admin Trading off"] },
          createdAt: { $gte: threeDaysAgo },
        })
        .sort({ createdAt: -1 });

      return res.send({
        status: true,
        msg: "Trading status get",
        data: Admin_information,
      });
    } catch (error) {
      console.log("Error error", error);
      return res.status(500).send({
        status: false,
        msg: "Error getting trading status",
        error: error.message,
      });
    }
  }

  async GetAdminTradeHistory1(req, res) {
    try {
      const {
        startDate,
        endDate,
        strategy,
        service,
        type,
        serviceIndex,
        lotMultypaly,
        page,
        limit,
      } = req.body;

      var page1 = page || 1;
      var limit1 = limit || 1000;

      var client_persnal_key1 = "";
      if (type != undefined || type != "undefined") {
        if (type.toUpperCase() == "ADMIN") {
          client_persnal_key1 = "";
        } else {
          client_persnal_key1 = { $ne: "" };
        }
      }

      var lotMultypaly1 =
        lotMultypaly === undefined || lotMultypaly === "undefined"
          ? 1
          : Number(lotMultypaly);

      let startDateObj = new Date(startDate ? startDate : new Date());
      let endDateObj = new Date(endDate ? endDate : new Date());

      const strategyWord = strategy.trim();

      let serIndex =
        typeof serviceIndex === "object" || serviceIndex === "null"
          ? { $exists: true }
          : serviceIndex;
      let stg1 = strategyWord === "null" ? { $exists: true } : strategyWord;
      let ser1 = service === "null" ? { $exists: true } : service;

      if (startDate == startDate) {
        endDateObj.setDate(endDateObj.getDate() + 1);
      }

      const matchStage = {
        createdAt: {
          $gte: new Date(startDateObj),
          $lte: new Date(endDateObj),
        },
        strategy: stg1,
        trade_symbol: ser1,
        symbol: serIndex,
        client_persnal_key: client_persnal_key1,
      };

      const filteredSignals = await MainSignals_modal.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        // { $sort: { _id: -1 } },
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
        { $skip: (page1 - 1) * limit1 },
        { $limit: limit1 },
      ]);

      const totalItems = await MainSignals_modal.countDocuments(matchStage);

      const groupedData = await MainSignals_modal.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDateObj),
              $lte: new Date(endDateObj),
            },
            client_persnal_key: client_persnal_key1,
          },
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        { $sort: { _id: -1 } },
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
      ]);

      const trade_symbols_filter = Object.keys(
        groupedData.reduce((acc, curr) => {
          if (!acc[curr.trade_symbol]) {
            acc[curr.trade_symbol] = 1;
          } else {
            acc[curr.trade_symbol]++;
          }
          return acc;
        }, {})
      );

      if (filteredSignals.length > 0) {
        filteredSignals.forEach((item) => {
          item.entry_qty_percent =
            Number(item.result1[0].lotsize) *
            Math.ceil(Number(item.entry_qty_percent) / 100);
          item.exit_qty_percent =
            Number(item.result1[0].lotsize) *
            Math.ceil(Number(item.exit_qty_percent) / 100);
          item.entry_qty = Number(item.result1[0].lotsize) * lotMultypaly1 || 1;
          item.exit_qty =
            item.exit_qty_percent == "" || "" || 0
              ? 0
              : Number(item.result1[0].lotsize) * lotMultypaly1 || "";
        });
      }

      const filteredSignals1 = await MainSignals_modal.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
          },
        },
        // { $sort: { _id: -1 } },
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
      ]);

      let TotalCalculate = 0;
      if (filteredSignals1.length > 0) {
        filteredSignals1.forEach((item) => {
          if (item.entry_price != "" && item.exit_price != "") {
            var TotalQty = Number(item.result1[0].lotsize) * lotMultypaly1 || 1;

            item.entry_qty_percent =
              Number(item.result1[0].lotsize) *
              Math.ceil(Number(item.entry_qty_percent) / 100);
            item.exit_qty_percent =
              Number(item.result1[0].lotsize) *
              Math.ceil(Number(item.exit_qty_percent) / 100);
            item.entry_qty =
              Number(item.result1[0].lotsize) * lotMultypaly1 || 1;
            item.exit_qty =
              item.exit_qty_percent == "" || "" || 0
                ? 0
                : Number(item.result1[0].lotsize) * lotMultypaly1 || "";

                 // Correct the ternary condition and assignment
                 TotalCalculate += (item.entry_type === "LE") 
                 ? (item.exit_price - item.entry_price) * TotalQty
                 : (item.entry_price - item.exit_price) * TotalQty;
          }
        });
      }
      var TotalTrade = [];

      if (filteredSignals.length > 0) {
        filteredSignals.forEach((item) => {
          if (item.result.length > 0) {
            item.result.forEach((item1) => {
              if (item1.type === "LX" || item1.type === "SX") {
                var cal = (item.exit_price - item.entry_price) * item.entry_qty;

                TotalTrade.push({
                  ...item1,
                  cal: cal,
                });
              } else {
                TotalTrade.push({ ...item1, cal: "-" });
              }
            });
          }
        });
      }


      return res.send({
        status: true,
        msg: "Filtered Trade history",
        data: TotalTrade,
        trade_symbols_filter: trade_symbols_filter,
        pagination: {
          page: Number(page1),
          limit: Number(limit1),
          totalItems,
          totalPages: Math.ceil(totalItems / limit1),
        },
        TotalCalculate: TotalCalculate ? TotalCalculate : 0,
      });
    } catch (error) {
      console.log("Error Trade History Error-", error);
      return res
        .status(500)
        .send({ status: false, msg: "Internal Server Error" });
    }
  }
}

module.exports = new Tradehistory();
