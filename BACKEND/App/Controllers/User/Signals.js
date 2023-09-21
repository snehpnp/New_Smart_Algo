"use strict";
const db = require('../../Models');
const Signals_modal = db.Signals
const client_services = db.client_services
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class Signals {

    // GET ADMIN SIGNALS

    async GetUserTradeSignals(req, res) {
        try {
            const { user_id } = req.body;

            const objectId = new ObjectId(user_id);

            const pipeline = [
                {
                    $match: {
                        user_id: objectId
                    }
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "service_id",
                        foreignField: "_id",
                        as: "service",
                    },
                },
                {
                    $unwind: '$service',
                },
                {
                    $lookup: {
                        from: "strategies",
                        localField: "strategy_id",
                        foreignField: "_id",
                        as: "strategys",
                    },
                },
                {
                    $unwind: '$strategys',
                },
                {
                    $project: {
                        'service.name': 1,
                        'strategys.strategy_name': 1,
                    },
                },
            ];

            const GetAllClientServices = await client_services.aggregate(pipeline)

            var abc = [];

            var currentDate = new Date();

            currentDate.setHours(0, 0, 0, 0);
            var endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);

            if (GetAllClientServices.length > 0) {

                for (const item of GetAllClientServices) {
                    try {
                        let data = await Signals_modal.find({
                            symbol: item.service.name,
                            strategy: item.strategys.strategy_name,
                            createdAt: {
                                $gte: currentDate,
                                $lte: endOfDay,
                            },
                        });

                        if (data.length > 0) {
                            abc.push(data)
                        }
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }
            } else {
                res.send({ status: false, data: GetAllClientServices, msg: "Data Empty" })
            }

            if(abc.length > 0 ){
                res.send({ status: true, data: abc.flat(),msg:"Get Signals" })
            }else{
                res.send({ status: false, data: [], msg: "Data Empty" })
            }





        } catch (error) {
            console.log("get user trading Status error -", error);
        }
    }


}


module.exports = new Signals();