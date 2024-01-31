"use strict";
const db = require('../../Models');
const MainSignals_modal = db.MainSignals
const live_price = db.live_price
const user_logs = db.user_logs


const { formattedDateTime } = require('../../Helper/time.helper')

class Tradehistory {

    // GET ADMIN SIGNALS
    async GetAdminTradeHistory(req, res) {
        try {

            const { startDate, endDate, strategy, service, type } = req.body;

            var client_persnal_key1 = ""
            if (type != undefined || type != 'undefined') {
                if (type.toUpperCase() == "ADMIN") {
                    client_persnal_key1 = ""
                } else {
                    client_persnal_key1 = { $ne: "" }
                }
            }


            let startDateObj = new Date(startDate)
            let endDateObj = new Date(endDate)
            let stg1
            let ser1
            //  For Strategy
            if (strategy === "null") {
                stg1 = { $exists: true }

            } else {
                stg1 = strategy
            }

            //  For Service
            if (service === "null") {
                ser1 = { $exists: true }
            } else {
                ser1 = service
            }


            const filteredSignals = await MainSignals_modal.aggregate([
                {
                  $match: {
                    dt_date: {
                      $gte: startDate,
                      $lte: endDate,
                    },
                    strategy: stg1,
                    trade_symbol: ser1,
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
                {
                  $sort: {
                    _id: -1,
                  },
                },
                {
                  $match: {
                    $expr: {
                      $gt: [
                        { $size: "$result" },
                        0
                      ],
                    },
                  },
                },
                {
                  $match: {
                    $expr: {
                      $gt: [
                        { $size: "$result1" },
                        0
                      ],
                    },
                  },
                },
              ]);
              


            if (filteredSignals.length > 0) {

                filteredSignals.filter(function (item) {

                    item.entry_qty_percent = Number(item.result1[0].lotsize) * (Math.ceil(Number(item.entry_qty_percent) / 100)),
                        item.exit_qty_percent = Number(item.result1[0].lotsize) * (Math.ceil(Number(item.exit_qty_percent) / 100))

                });

            }


            if (filteredSignals.length === 0) {
                return res.send({ status: false, msg: 'No signals founddate range.', data: [] });
            }
            return res.send({ status: true, msg: 'Filtered Tradehistory', data: filteredSignals });


        } catch (error) {
            console.log("Error Trade History Error-", error);
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

                    }
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
                        _id: -1 // Sort in ascending order. Use -1 for descending.
                    }
                },
                {
                    $match: {
                      $expr: {
                        $gt: [
                          { $size: "$result" },
                          0
                        ],
                      },
                    },
                  },
                  {
                    $match: {
                      $expr: {
                        $gt: [
                          { $size: "$result1" },
                          0
                        ],
                      },
                    },
                  }
            ]);



            if (filteredSignals.length > 0) {

                filteredSignals.filter(function (item) {

                    item.entry_qty_percent = Number(item.result1[0].lotsize) * (Math.ceil(Number(item.entry_qty_percent) / 100)),
                        item.exit_qty_percent = Number(item.result1[0].lotsize) * (Math.ceil(Number(item.exit_qty_percent) / 100))

                });

            }


            var tradeArr = []
            filteredSignals.forEach((data) => {
                var entry_qty_percent1 = data.entry_qty_percent ? Number(data.entry_qty_percent) : 0
                var exit_qty_percent1 = data.exit_qty_percent ? Number(data.exit_qty_percent) : 0

                // console.log( entry_qty_percent1 ,"-", exit_qty_percent1);

                if (entry_qty_percent1 > exit_qty_percent1) {
                    data.entry_qty_percent = entry_qty_percent1 - exit_qty_percent1
                    tradeArr.push(data)
                }

            })


            if (tradeArr.length == 0) {
                res.send({ status: false, data: tradeArr, msg: "Empty Data" })
            }

            res.send({ status: true, data: tradeArr, msg: "Get All Data" })


        } catch (error) {
            console.log("Error Get All Trade History Data-", error);
        }
    }

    // ADMIN TRADING STATUS GET
    async AdminTradingStatus(req, res) {
        try {
            const { broker_name } = req.body

            var Admin_information = await live_price.find({ broker_name: "ALICE_BLUE" });

            if (Admin_information.length == 0) {
                return res.send({ status: false, msg: 'User Not exists', data: [] });
            }

            if (Admin_information[0].trading_status == "off") {
                return res.send({ status: false, msg: 'Already Trading Off', data: false });
            }


            return res.send({ status: true, msg: "Trading status get", data: true });


        } catch (error) {
            console.log("Error error", error);
        }
    }


    // ADMIN TRADING OFF
    async AdminTradingOff(req, res) {
        try {
            const { broker_name, device } = req.body

            var Admin_information = await live_price.find({ broker_name: broker_name });

            if (Admin_information.length == 0) {
                return res.send({ status: false, msg: 'User Not exists', data: [] });
            }

            if (Admin_information[0].trading_status == "off") {
                return res.send({ status: false, msg: 'Already Trading Off', data: [] });

            }

            const User_Update = await live_price.updateOne({ broker_name: broker_name }, { $set: { trading_status: "off", access_token: "" } });

            const user_login = new user_logs({
                user_Id: Admin_information[0].user_id,
                login_status: "Trading off",
                role: "ADMIN",
                // system_ip: getIPAddress()
                device: device
            })
            await user_login.save();

            return res.send({ status: true, msg: 'Trading Off successfully', data: [] });


        } catch (error) {
            console.log("Error error", error);
        }
    }

}


module.exports = new Tradehistory();