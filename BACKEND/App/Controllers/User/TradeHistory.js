"use strict";
const db = require('../../Models');
const MainSignals = db.MainSignals
const client_services = db.client_services
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class TradeHistory {


    // GET ADMIN SIGNALS
    async GetUserTradeHistory(req, res) {
        try {
            const { user_id, startDate, endDate } = req.body;

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
                        from: "users",
                        localField: 'user_id',
                        foreignField: "_id",
                        as: "users",
                    },
                },
                {
                    $unwind: '$users',
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
                        'users.web_url': 1,
                        'users.client_key': 1

                    },
                },
            ];

            const GetAllClientServices = await client_services.aggregate(pipeline)

            var abc = [];

            if (GetAllClientServices.length > 0) {
                for (const item of GetAllClientServices) {
                    console.log("item", item.users);
                    if (item.users.web_url == '1') {
                        try {

                            var data = await MainSignals.aggregate([
                                {
                                    $match: {
                                        symbol: item.service.name,
                                        strategy: item.strategys.strategy_name,
                                        dt_date: {
                                            $gte: startDate,
                                            $lte: endDate,
                                        },
                                        client_persnal_key: ""

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
                                        _id: -1 // Sort in ascending order. Use -1 for descending.
                                    }
                                }

                            ]);


                            if (data.length > 0) {
                                abc.push(data)
                            }
                        } catch (error) {
                            console.error("Error fetching data:", error);
                        }
                    } else if (item.users.web_url == '2') {
                        try {

                            var data = await MainSignals.aggregate([
                                {
                                    $match: {
                                        symbol: item.service.name,
                                        strategy: item.strategys.strategy_name,
                                        dt_date: {
                                            $gte: startDate,
                                            $lte: endDate,
                                        },
                                        client_persnal_key: item.users.client_key

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
                                        _id: -1 // Sort in ascending order. Use -1 for descending.
                                    }
                                }

                            ]);




                            if (data.length > 0) {
                                abc.push(data)
                            }
                        } catch (error) {
                            console.error("Error fetching data:", error);
                        }
                    }

                }
            } else {
                res.send({ status: false, data: GetAllClientServices, msg: "Data Empty" })
            }

            if (abc.length > 0) {
                res.send({ status: true, data: abc.flat(), msg: "Get Signals" })
            } else {
                res.send({ status: false, data: [], msg: "Data Empty" })

            }





        } catch (error) {
            console.log("get user trading Status error -", error);
        }
    }



}


module.exports = new TradeHistory();