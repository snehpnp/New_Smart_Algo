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
            const { user_id, startDate, endDate, serviceIndex, selectStrategy, getType } = req.body;
            const objectId = new ObjectId(user_id);

            const pipeline = [
                {
                    $match: { user_id: objectId }
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "service_id",
                        foreignField: "_id",
                        as: "service",
                    },
                },
                { $unwind: '$service' },
                {
                    $lookup: {
                        from: "categories",
                        localField: "service.categorie_id",
                        foreignField: "_id",
                        as: "categories",
                    },
                },
                { $unwind: '$categories' },
                {
                    $lookup: {
                        from: "users",
                        localField: 'user_id',
                        foreignField: "_id",
                        as: "users",
                    },
                },
                { $unwind: '$users' },
                {
                    $lookup: {
                        from: "strategies",
                        localField: "strategy_id",
                        foreignField: "_id",
                        as: "strategys",
                    },
                },
                { $unwind: '$strategys' },
                {
                    $project: {
                        'service.name': 1,
                        'strategys.strategy_name': 1,
                        'users.web_url': 1,
                        'users.client_key': 1,
                        'categories.segment':1,

                        quantity: 1
                    },
                },
            ];

            const GetAllClientServices = await client_services.aggregate(pipeline);

            if (GetAllClientServices.length === 0) {
                return res.send({ status: false, data: GetAllClientServices, msg: "Data Empty" });
            }

            let abc = [];
            let abc1 = [];

            for (const item of GetAllClientServices) {
                console.log("item",item)

                const client_persnal_key1 = item.users.web_url === '2' ? item.users.client_key : "";

                const serIndex = serviceIndex === "null" ? item.service.name : serviceIndex;
                const strategyset = selectStrategy === "null" ? item.strategys.strategy_name : selectStrategy;

                const MatchPipeline = {
                    symbol: serIndex,
                    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
                    client_persnal_key: client_persnal_key1,
                    segment: item.categories.segment

                };

                if (getType !== "Trade") {
                    MatchPipeline.strategy = strategyset;
                } else {
                    MatchPipeline.$or = [{ Entry_users_id: objectId }];
                }

                try {
                    const data = await MainSignals.aggregate([
                        { $match: MatchPipeline },
                        {
                            $lookup: {
                                from: "signals",
                                localField: "signals_id",
                                foreignField: "_id",
                                as: "result",
                            },
                        },
                        { $sort: { _id: -1 } }
                    ]);

                    if (data.length > 0) {
                        data.map((item1) => {
                            const findstg = GetAllClientServices.find(data => data.service.name == item1.symbol && data.strategys.strategy_name == item1.strategy);
                            if (findstg) {

                                item1.result.forEach(signal => {
                                    signal.qty_percent = findstg.quantity * (Math.ceil(Number(signal.qty_percent) / 100) * 100) * 0.01;
                                });


                                item1.entry_qty_percent = findstg.quantity * (Math.ceil(Number(item1.entry_qty_percent) / 100) * 100) * 0.01;
                                item1.exit_qty_percent = findstg.quantity * (Math.ceil(Number(item1.exit_qty_percent) / 100) * 100) * 0.01;

                            }


                            if (Array.isArray(item1.Exit_users_id) && !item1.Exit_users_id.some(id => id.equals(objectId)) && getType === "Trade") {
                                item1.exit_type = "";
                                item1.exit_price = "";
                                item1.exit_qty_percent = "";
                                item1.exit_qty = "";
                                item1.exit_dt_date = "";
                            }
                        });
                        abc.push(data);
                    }

                    if (data.length > 0) {
                        abc1.push(data);
                    }

                } catch (error) {
                    console.log("Error fetching data:", error);
                }
            }


            if (abc1.length > 0) {


                const groupedDataStrategy = abc1.flat().reduce((acc, curr) => {
                    if (!acc[curr.strategy]) {
                        acc[curr.strategy] = 1;
                    } else {
                        acc[curr.strategy]++;
                    }
                    return acc;
                }, {});

                const trade_strategy_filter = Object.keys(groupedDataStrategy);
                if (abc.length > 0) {
                    return res.send({ status: true, data: abc.flat(), msg: "Get Signals", trade_strategy_filter: trade_strategy_filter });
                }
            }

            return res.send({ status: false, data: [], msg: "Data Empty" });

        } catch (error) {

            return res.status(500).send({ status: false, msg: "Internal Server Error" });
        }
    }


}


module.exports = new TradeHistory();