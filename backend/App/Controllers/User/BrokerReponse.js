"use strict";
const db = require("../../Models");
const BrokerResponse_modal = db.BrokerResponse;
const { formattedDateTime } = require("../../Helper/time.helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const user_logs = db.user_logs;

class BrokerReponse {
  // GET ADMIN SIGNALS
  async GetUserBrokerResponse(req, res) {
    try {
      const { _id } = req.body;
      var objectId = new ObjectId(_id);

      try {
        const currentDate = new Date();

        currentDate.setHours(0, 0, 0, 0);

        // const filteredSignals = await BrokerResponse_modal.find({
        //     user_id: objectId,
        //     createdAt: {
        //         $gte: currentDate, // Greater than or equal to the start of the day
        //         // $lte: endOfDay,    // Less than or equal to the end of the day
        //     },
        // }).sort({ createdAt: -1 });

        const filteredSignals = await BrokerResponse_modal.aggregate([
          {
            $match: {
              user_id: objectId,
              createdAt: {
                $gte: new Date(currentDate),
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $unwind: "$userDetails",
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $project: {
              _id: 1,
              createdAt: 1,
              signalDetails: 1,
              user_id: 1,
              symbol: 1,
              type: 1,
              trading_symbol: 1,
              strategy: 1,
              broker_name: 1,
              send_request: 1,
              order_status: 1,
              reject_reason: 1,
              receive_signal: 1,
              order_id: 1,
              order_view_status: 1,
              order_view_response: 1,
              order_view_date: 1,
              "userDetails.UserName": 1,
            },
          },
        ]);

        const GetTradingStatus = await user_logs
        .find({ user_Id: objectId, login_status: "Trading On" })
        .sort({ createdAt: -1 });


      var tradingStatus =
        GetTradingStatus.length > 0 &&
        GetTradingStatus[0];
        

        if (filteredSignals.length === 0) {
          return res.json({ status: false, msg: "No Data Found", data: [] });
        }
        return res.status(200).json({
          status: true,
          msg: "All Broker Response",
          data: filteredSignals.map((data, index) => ({
            ...data,
            TradingTime: tradingStatus.createdAt,
          })),
        });
      } catch (error) {
        return res.status(500).json({
          status: false,
          msg: "Error fetching Broker Response.",
          error: error.message,
        });
      }
    } catch (error) {
      console.log("Error Theme error-", error);
    }
  }
}

module.exports = new BrokerReponse();
