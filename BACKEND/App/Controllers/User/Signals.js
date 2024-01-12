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

            var currentDate = new Date();

            currentDate.setHours(0, 0, 0, 0);
            var endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);


            const pipeline = [
                {
                    $match: {
                        user_id: objectId,
                    },
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
                    $lookup: {
                        from: "signals",
                        let: {
                            service_name: '$service.name',
                            strategy_name: '$strategys.strategy_name',
                            currentDate: currentDate,
                            endOfDay: endOfDay,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$symbol', '$$service_name'] },
                                            { $eq: ['$strategy', '$$strategy_name'] },
                                            { $gte: ['$createdAt', '$$currentDate'] },
                                            { $lte: ['$createdAt', '$$endOfDay'] },
                                        ],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    createdAt: -1 // 1 for ascending order, -1 for descending
                                }
                            },
                        ],
                        as: 'signals',
                    },
                },
                {
                    $group: {
                        _id: null,
                        allSignals: { $push: '$signals' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        allSignals: 1,
                    },
                },
            ];

            const GetAllClientServices = await client_services.aggregate(pipeline);



            if (GetAllClientServices[0].allSignals.flat().length > 0) {

                const sortedAndFilteredArray = GetAllClientServices[0].allSignals.flat()
                .sort((a, b) => b.createdAt - a.createdAt);


                return res.send({ status: true, data: sortedAndFilteredArray, msg: "Get Signals" })
            } else {
                res.send({ status: false, data: [], msg: "Data Empty" })
            }


        } catch (error) {
            console.log("Error Signals  error -", error);
        }
    }

}


module.exports = new Signals();