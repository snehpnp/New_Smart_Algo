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

            const { startDate, endDate } = req.body;
            let startDateObj = new Date(startDate)
            let endDateObj = new Date(endDate)


            const filteredSignals = await MainSignals_modal.aggregate([
                {
                    $match: {
                        dt_date: {
                            $gte: startDate,
                            $lte: endDate
                        }
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
                    $sort: {
                        "result.createdAt": -1 // Sort in ascending order. Use -1 for descending.
                    }
                }

            ]);


            if (filteredSignals.length === 0) {
                return res.send({ status: false, msg: 'No signals founddate range.', data: [] });
            }
            return res.send({ status: true, msg: 'Filtered Tradehistory', data: filteredSignals });


        } catch (error) {
            console.log("Theme error-", error);
        }
    }

    // GET ADMIN SIGNALS
    async GetAdminsevenTradeHistory(req, res) {
        try {
            const today = new Date(); // Aaj ki date
            const sevenDaysAgo = new Date(today); // Aaj ki date se 7 din pehle ki date
            sevenDaysAgo.setDate(today.getDate() - 7);

            const filteredSignals = await MainSignals_modal.find({
                createdAt: {
                    $gte: sevenDaysAgo, // Aaj se pichle 7 din se greater than or equal
                    $lte: today, // Aaj se less than or equal
                },
                exit_price: ""
            });

            if (filteredSignals.length == 0) {
                res.send({ status: false, data: filteredSignals, msg: "Empty Data" })
            }

            res.send({ status: true, data: filteredSignals, msg: "Get All Data" })


        } catch (error) {
            console.log("Theme error-", error);
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
            console.log("error", error);
        }
    }

}


module.exports = new Tradehistory();