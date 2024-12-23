"use strict";
const db = require("../../Models");
const MainSignals_modal = db.MainSignals;
const Signals = db.Signals;

const live_price = db.live_price;
const user_logs = db.user_logs;
const { getIPAddress } = require("../../Helper/logger.helper");

const { formattedDateTime } = require("../../Helper/time.helper");

class Tradehistory {
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

      const page1 = Number(page || 1);
      const limit1 = Number(limit || 1000);

      const client_persnal_key1 =
        type?.toUpperCase() === "ADMIN" ? "" : { $ne: "" };
      const lotMultypaly1 = Number(lotMultypaly || 1);

      const startDateObj = new Date(startDate || new Date());
      const endDateObj = new Date(endDate || new Date());
      endDateObj.setDate(endDateObj.getDate() + 1);

      const strategyWord = strategy?.trim();
      const serIndex =
        serviceIndex === "null" || typeof serviceIndex === "object"
          ? { $exists: true }
          : serviceIndex;
      const stg1 = strategyWord === "null" ? { $exists: true } : strategyWord;
      const ser1 = service === "null" ? { $exists: true } : service;

      const openClose1 =
        openClose === "Open"
          ? { exit_qty_percent: "" }
          : openClose === "Close"
          ? { exit_qty_percent: { $ne: "" } }
          : {};

      const matchStage = {
        createdAt: { $gte: startDateObj, $lte: endDateObj },
        strategy: stg1,
        trade_symbol: ser1,
        symbol: serIndex,
        client_persnal_key: client_persnal_key1,
        ...openClose1,
      };

      // Aggregation pipeline for paginated results
      const filteredSignals = await MainSignals_modal.aggregate([
        {
          $match: matchStage, // Initial filtering
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
            pipeline: [{ $project: { _id: 1 } }],
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
            pipeline: [{ $project: { lotsize: 1, name: 1 } }],
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result" }, 0] },
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result1" }, 0] },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $skip: (page1 - 1) * limit1,
        },
        {
          $limit: limit1,
        },
      ]);

      const totalItems = await MainSignals_modal.countDocuments(matchStage);

      // Calculate TotalProfit/Loss
      let TotalCalculate = 0;
      filteredSignals.forEach((item) => {
        if (item.entry_price && item.exit_price) {
          const lotsize = Number(item.result1[0]?.lotsize || 1);
          const TotalQty = lotsize * lotMultypaly1;

          TotalCalculate +=
            item.entry_type === "LE"
              ? (item.exit_price - item.entry_price) * TotalQty
              : (item.entry_price - item.exit_price) * TotalQty;

          item.entry_qty_percent = Math.ceil(
            (item.entry_qty_percent / 100) * lotsize
          );
          item.exit_qty_percent = Math.ceil(
            (item.exit_qty_percent / 100) * lotsize
          );
          item.entry_qty = TotalQty;
          item.exit_qty = item.exit_qty_percent > 0 ? TotalQty : 1 || 0;
        } else {
          const lotsize = Number(item.result1[0]?.lotsize || 1);
          const TotalQty = lotsize * lotMultypaly1;

          item.entry_qty_percent = Math.ceil(
            (item.entry_qty_percent / 100) * lotsize
          );

          item.entry_qty = TotalQty;
        }
      });

      // Trade symbols for filtering
      const trade_symbols_filter = Array.from(
        new Set(filteredSignals.map((item) => item.trade_symbol))
      );

      // Response
      return res.send({
        status: true,
        msg: "Filtered Trade history",
        data: filteredSignals,
        trade_symbols_filter,
        pagination: {
          page: page1,
          limit: limit1,
          totalItems,
          totalPages: Math.ceil(totalItems / limit1),
        },
        TotalCalculate,
      });
    } catch (error) {
      console.log("Error in Trade History:", error);
      return res
        .status(500)
        .send({ status: false, msg: "Internal Server Error" });
    }
  }

  async GetAdminTradeHistoryCal(req, res) {
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

      const page1 = Number(page || 1);
      const limit1 = Number(limit || 1000);

      const client_persnal_key1 =
        type?.toUpperCase() === "ADMIN" ? "" : { $ne: "" };
      const lotMultypaly1 = Number(lotMultypaly || 1);

      const startDateObj = new Date(startDate || new Date());
      const endDateObj = new Date(endDate || new Date());
      endDateObj.setDate(endDateObj.getDate() + 1);

      const strategyWord = strategy?.trim();
      const serIndex =
        serviceIndex === "null" || typeof serviceIndex === "object"
          ? { $exists: true }
          : serviceIndex;
      const stg1 = strategyWord === "null" ? { $exists: true } : strategyWord;
      const ser1 = service === "null" ? { $exists: true } : service;

      const openClose1 = { exit_qty_percent: { $ne: "" } };

      const matchStage = {
        createdAt: { $gte: startDateObj, $lte: endDateObj },
        strategy: stg1,
        trade_symbol: ser1,
        symbol: serIndex,
        client_persnal_key: client_persnal_key1,
        ...openClose1,
      };

      // Aggregation pipeline for paginated results
      const filteredSignals = await MainSignals_modal.aggregate([
        {
          $match: matchStage, // Initial filtering
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
            pipeline: [{ $project: { _id: 1 } }],
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
            pipeline: [{ $project: { lotsize: 1, name: 1 } }],
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result" }, 0] },
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result1" }, 0] },
          },
        },
      ]);

      const totalItems = await MainSignals_modal.countDocuments(matchStage);

      // Calculate TotalProfit/Loss
      let TotalCalculate = 0;

      filteredSignals.forEach((item) => {
        const entryPrice = Number(item.entry_price);
        const exitPrice = Number(item.exit_price);

        if (Number.isFinite(entryPrice) && Number.isFinite(exitPrice)) {
          const lotsize = Number(item.result1?.[0]?.lotsize || 1);
          const TotalQty = lotsize * (lotMultypaly1 || 1);

          TotalCalculate +=
            item.entry_type === "LE"
              ? (item.exit_price - item.entry_price) * TotalQty
              : (item.entry_price - item.exit_price) * TotalQty;

          item.entry_qty_percent = Math.ceil(
            (Number(item.entry_qty_percent || 0) / 100) * lotsize
          );
          item.exit_qty_percent = Math.ceil(
            (Number(item.exit_qty_percent || 0) / 100) * lotsize
          );
          item.entry_qty = TotalQty;
          item.exit_qty = item.exit_qty_percent > 0 ? TotalQty : 1 || 0;
        } else {
          const lotsize = Number(item.result1?.[0]?.lotsize || 1);
          const TotalQty = lotsize * (lotMultypaly1 || 1); // Ensure lotMultypaly1 has a valid value

          item.entry_qty_percent = Math.ceil(
            (Number(item.entry_qty_percent || 0) / 100) * lotsize
          );

          item.entry_qty = TotalQty;
        }
      });

      // ========================================CHANGE TO CODE=======================================
      const matchStage1 = {
        createdAt: { $gte: startDateObj, $lte: endDateObj },
        strategy: stg1,
        symbol: serIndex,
      };

      const filteredSignals1 = await MainSignals_modal.aggregate([
        {
          $match: matchStage1, // Initial filtering
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
            pipeline: [{ $project: { _id: 1 } }],
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
            pipeline: [{ $project: { lotsize: 1, name: 1 } }],
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result" }, 0] },
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result1" }, 0] },
          },
        },
      ]);

      // Trade symbols for filtering
      const trade_symbols_filter = Array.from(
        new Set(filteredSignals1.map((item) => item.trade_symbol))
      );

      // Response
      return res.send({
        status: true,
        msg: "Filtered Trade history",
        data: [],
        trade_symbols_filter: trade_symbols_filter,
        pagination: {
          page: page1,
          limit: limit1,
          totalItems,
          totalPages: Math.ceil(totalItems / limit1),
        },
        TotalCalculate,
      });
    } catch (error) {
      console.log("Error in Trade History:", error);
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

      const page1 = page || 1;
      const limit1 = limit || 1000;

      const client_persnal_key1 =
        type && type.toUpperCase() !== "ADMIN" ? { $ne: "" } : "";

      const lotMultypaly1 = lotMultypaly ? Number(lotMultypaly) : 1;

      const startDateObj = new Date(startDate || new Date());
      const endDateObj = new Date(endDate || new Date());
      endDateObj.setDate(endDateObj.getDate() + 1);

      const strategyWord = strategy?.trim();
      const serIndex =
        typeof serviceIndex === "object" || serviceIndex === "null"
          ? { $exists: true }
          : serviceIndex;
      const stg1 = strategyWord === "null" ? { $exists: true } : strategyWord;
      const ser1 = service === "null" ? { $exists: true } : service;

      const matchStage = {
        createdAt: { $gte: startDateObj, $lte: endDateObj },
        strategy: stg1,
        trade_symbol: ser1,
        symbol: serIndex,
        client_persnal_key: client_persnal_key1,
      };

      const pipeline = [
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
        { $match: { $expr: { $gt: [{ $size: "$result" }, 0] } } },
        { $match: { $expr: { $gt: [{ $size: "$result1" }, 0] } } },
        { $skip: (page1 - 1) * limit1 },
        { $limit: limit1 },
        // { $sort: { _id: -1 } },
      ];

      const [filteredSignals, totalItems] = await Promise.all([
        MainSignals_modal.aggregate(pipeline),
        MainSignals_modal.countDocuments(matchStage),
      ]);

      const tradeSymbolsFilter = [
        ...new Set(filteredSignals.map((item) => item.trade_symbol)),
      ];

      let totalCalculate = 0;
      let totalTrade = filteredSignals.map((signal) => {
        if (signal.result && signal.result.length > 0) {
          if (signal.result.length > 1) {
            const firstResult = signal.result.find(
              (item) => item.type === "LE" || item.type === "SE"
            );
            const secondResult = signal.result.find(
              (item) => item.type === "LX" || item.type === "SX"
            );

            const firstPrice = parseFloat(firstResult.price) || 0;
            const secondPrice = parseFloat(secondResult.price) || 0;

            let firstLotSize;

            if (firstResult.lot_size == 0) {
              if (firstResult.symbol == "NIFTY") {
                firstLotSize = 25;
              } else if (firstResult.symbol == "BANKNIFTY") {
                firstLotSize = 15;
              } else {
                firstLotSize = parseFloat(firstResult.lot_size) || 1;
              }
            } else {
              firstLotSize = parseFloat(firstResult.lot_size) || 1;
            }

            firstResult.lot_size = firstLotSize * lotMultypaly1;
            secondResult.lot_size = firstLotSize * lotMultypaly1;

            const cal =
              secondResult.type === "LX" || secondResult.type === "SX"
                ? (secondPrice - firstPrice) *
                  (firstLotSize === 0 ? 1 : firstLotSize * lotMultypaly1)
                : "-";
            totalCalculate += cal;

            return [firstResult, { ...secondResult, cal }];
          } else {
            return [signal.result[0]];
          }
        }
        return [];
      });

      return res.send({
        status: true,
        msg: "Filtered Trade history",
        data: totalTrade.flat(),
        trade_symbols_filter: tradeSymbolsFilter,
        pagination: {
          page: Number(page1),
          limit: Number(limit1),
          totalItems,
          totalPages: Math.ceil(totalItems / limit1),
        },
        TotalCalculate: totalCalculate,
      });
    } catch (error) {
      console.log("Error Trade History Error-", error);
      return res
        .status(500)
        .send({ status: false, msg: "Internal Server Error" });
    }
  }

  async GetSignalsAdmin(req, res) {
    try {
      var SignalsIds = req.body.signal_id;

      if (SignalsIds.length == 0) {
        return res.send({ status: false, msg: "Empty Data" });
      } else {
        var GetSinglas = await Signals.find({ _id: { $in: SignalsIds } });

        if (GetSinglas.length == 0) {
          return res.send({ status: false, msg: "Empty Data" });
        }
        return res.send({
          status: true,
          msg: "Get All Data",
          data: GetSinglas,
        });
      }
    } catch (error) {
      console.log("Error Get All Trade History Data-", error);
    }
  }

  async GetAdminHoldings(req, res) {
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

      const page1 = Number(page || 1);
      const limit1 = Number(limit || 1000);

      const client_persnal_key1 =
        type?.toUpperCase() === "ADMIN" ? "" : { $ne: "" };
      const lotMultypaly1 = Number(lotMultypaly || 1);

      const startDateObj = new Date(startDate || new Date());
      const endDateObj = new Date(endDate || new Date());
      endDateObj.setDate(endDateObj.getDate() + 1);

      const strategyWord = strategy?.trim();
      const serIndex =
        serviceIndex === "null" || typeof serviceIndex === "object"
          ? { $exists: true }
          : serviceIndex;
      const stg1 = strategyWord === "null" ? { $exists: true } : strategyWord;
      const ser1 = service === "null" ? { $exists: true } : service;

      const openClose1 =
        openClose === "Open"
          ? { exit_qty_percent: "" }
          : openClose === "Close"
          ? { exit_qty_percent: { $ne: "" } }
          : {};

      // const matchStage = {
      //   strategy: stg1,
      //   trade_symbol: ser1,
      //   symbol: serIndex,
      //   client_persnal_key: client_persnal_key1,
      //   ...openClose1,
      // };

      var d = new Date();
      var current_date =
        [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("/") +
        " " +
        [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

      var dt_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("/");


      const matchStage = {
        TradeType: "MAKECALL",
        strategy: stg1,
        symbol: serIndex,

        exit_type: "",
        dt_date: {$ne : dt_date},
      };

      // Aggregation pipeline for paginated results
      const filteredSignals = await MainSignals_modal.aggregate([
        {
          $match: matchStage, // Initial filtering
        },
        {
          $lookup: {
            from: "signals",
            localField: "signals_id",
            foreignField: "_id",
            as: "result",
            pipeline: [{ $project: { _id: 1 } }],
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "symbol",
            foreignField: "name",
            as: "result1",
            pipeline: [{ $project: { lotsize: 1, name: 1 } }],
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result" }, 0] },
          },
        },
        {
          $match: {
            $expr: { $gt: [{ $size: "$result1" }, 0] },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $skip: (page1 - 1) * limit1,
        },
        {
          $limit: limit1,
        },
      ]);

      const totalItems = await MainSignals_modal.countDocuments(matchStage);

      // Calculate TotalProfit/Loss
      let TotalCalculate = 0;
      filteredSignals.forEach((item) => {
        if (item.entry_price && item.exit_price) {
          const lotsize = Number(item.result1[0]?.lotsize || 1);
          const TotalQty = lotsize * lotMultypaly1;

          TotalCalculate +=
            item.entry_type === "LE"
              ? (item.exit_price - item.entry_price) * TotalQty
              : (item.entry_price - item.exit_price) * TotalQty;

          item.entry_qty_percent = Math.ceil(
            (item.entry_qty_percent / 100) * lotsize
          );
          item.exit_qty_percent = Math.ceil(
            (item.exit_qty_percent / 100) * lotsize
          );
          item.entry_qty = TotalQty;
          item.exit_qty = item.exit_qty_percent > 0 ? TotalQty : 1 || 0;
        } else {
          const lotsize = Number(item.result1[0]?.lotsize || 1);
          const TotalQty = lotsize * lotMultypaly1;

          item.entry_qty_percent = Math.ceil(
            (item.entry_qty_percent / 100) * lotsize
          );

          item.entry_qty = TotalQty;
        }
      });

      // Trade symbols for filtering
      const trade_symbols_filter = Array.from(
        new Set(filteredSignals.map((item) => item.trade_symbol))
      );

      // Response
      return res.send({
        status: true,
        msg: "Filtered Trade history",
        data: filteredSignals,
        trade_symbols_filter,
        pagination: {
          page: page1,
          limit: limit1,
          totalItems,
          totalPages: Math.ceil(totalItems / limit1),
        },
        TotalCalculate,
      });
    } catch (error) {
      console.log("Error in Trade History:", error);
      return res
        .status(500)
        .send({ status: false, msg: "Internal Server Error" });
    }
  }
}

module.exports = new Tradehistory();
