"use strict";
const db = require('../../Models');
const MainSignals_modal = db.MainSignals
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



}


module.exports = new Tradehistory();