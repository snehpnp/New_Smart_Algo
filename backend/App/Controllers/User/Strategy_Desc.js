"use strict";
const db = require('../../Models');
const strategy_client_modal = db.strategy_client
const strategy_modal = db.strategy

const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class StrategyDesc {

    // GET ADMIN SIGNALS
    async GetUserStrategy(req, res) {
        try {

            const { user_id } = req.body;
            var objectId = new ObjectId(user_id);

            const pipeline1 = [
                {
                    $match: {
                        user_id: objectId
                    }
                },
                {
                    $lookup: {
                        from: "strategies",
                        localField: "strategy_id",
                        foreignField: "_id",
                        as: "result"
                    },
                },

                {
                    $unwind: '$result',
                },
                {
                    $project: {
                        'result': 1,
                    },
                },

            ];
            const GetAllClientStrategy = await strategy_client_modal.aggregate(pipeline1);

            if (GetAllClientStrategy.length === 0) {
                return res.json({ status: false, msg: 'No Strategy Found', data: [] });
            }
            return res.status(200).json({ status: true, msg: ' Client All Strategy Response', data: GetAllClientStrategy });
        } catch (error) {
            return res.status(500).json({ status: false, msg: 'Error fetching Strategy Response.', error: error.message });
        }

    }

}



module.exports = new StrategyDesc();