"use strict";
const db = require('../../Models');
const strategy_model = db.strategy
const strategy_client_model = db.strategy_client
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

class strategy {

    // ADD STRATEGY IN A COLLECTION
    async AddStragegy(req, res) {
        try {
            const { strategy_name, strategy_description, strategy_category, strategy_segment, strategy_indicator, strategy_tester, strategy_amount, strategy_image, strategy_amount_month, strategy_amount_quarterly, strategy_amount_half_early, strategy_amount_early, plans } = req.body;

            const exist_strategy = await strategy_model.findOne({ strategy_name: strategy_name });
            if (exist_strategy) {
                return res.send({ status: false, msg: 'Strategy already exists', data: [] });
            }

            var strategy_Data = new strategy_model({
                strategy_name: strategy_name,
                strategy_description: strategy_description,
                strategy_category: strategy_category,
                strategy_segment: strategy_segment,
                strategy_indicator: strategy_indicator,
                strategy_tester: strategy_tester,
                strategy_amount: strategy_amount,
                strategy_image: strategy_image,
                strategy_amount_month: strategy_amount_month,
                strategy_amount_quarterly: strategy_amount_quarterly,
                strategy_amount_half_early: strategy_amount_half_early,
                strategy_amount_early: strategy_amount_early,
                plans: JSON.stringify(plans)
            })

            strategy_Data.save()
                .then(async (data) => {
                    return res.status(200).json({ status: true, msg: 'Strategy Add successfully!', data: strategy_Data });

                })
                .catch((err) => {
                    console.log(" Error Add Time Error-", err);
                    if (err.keyValue) {
                        return res.send({ status: false, msg: 'Key duplicate', data: err.keyValue });

                    }
                })


        } catch (error) {
            console.log("Error Strategy add error -", error.keyValue);
        }
    }

    // EDIT STRATEGY IN A COLLECTION
    async EditStragegy(req, res) {
        try {
            const { _id, strategy_name, strategy_description, strategy_category, strategy_segment, strategy_indicator, strategy_tester, strategy_amount, strategy_image, strategy_amount_month, strategy_amount_quarterly, strategy_amount_half_early, strategy_amount_early, plans } = req.body;

            const strategy_check = await strategy_model.findOne({ _id: _id });
            if (!strategy_check) {
                return res.send({ status: false, msg: 'Strategy Not exist', data: [] });
            }

            try {
                // CHECK IF SAME STRATEGY AONOTHER STRATEG NAME TO SIMLER MATCH
                const strateg_data = await strategy_model.find({
                    $and: [
                        { strategy_name: strategy_name },
                        { _id: { $ne: _id } }
                    ]
                })


                if (strateg_data.length > 0) {
                    return res.send({ status: false, msg: 'Strategy Name Already Exist', data: [] });
                }

            } catch (error) {
                console.log("Error error", error);
            }



            const filter = { _id: _id };
            const update_strategy = {
                $set: {
                    "strategy_name": strategy_name,
                    "strategy_description": strategy_description,
                    "strategy_category": strategy_category,
                    "strategy_segment": strategy_segment,
                    "strategy_indicator": strategy_indicator,
                    "strategy_tester": strategy_tester,
                    "strategy_amount": strategy_amount,
                    "strategy_image": strategy_image,
                    "strategy_amount_month": strategy_amount_month,
                    "strategy_amount_quarterly": strategy_amount_quarterly,
                    "strategy_amount_half_early": strategy_amount_half_early,
                    "strategy_amount_early": strategy_amount_early,
                    "plans": JSON.stringify(plans)


                }
            };

            // UPDATE STRATEGY INFORMATION
            const result = await strategy_model.updateOne(filter, update_strategy);

            if (!result) {
                return res.send({ status: false, msg: 'Strategy not Edit', data: [] });
            }

            return res.status(200).json({ status: true, msg: 'Strategy Edit successfully!', data: result });


        } catch (error) {
            console.log("Error Strategy Edit error -", error.keyValue);
        }
    }

    // GET ONE STRATEGY IN A COLLECTION
    async GetOneStragegy(req, res) {
        try {
            const { _id } = req.body;

            const exist_strategy = await strategy_model.findOne({ _id: _id });
            if (!exist_strategy) {
                return res.send({ status: false, msg: 'Strategy Not exists', data: [] });
            }

            return res.status(200).json({ status: true, msg: 'Strategy Get successfully!', data: exist_strategy });


        } catch (error) {
            console.log("Error Strategy Get One error -", error.keyValue);
        }
    }

    // GET ALL STRATEGYS
    async GetAllStrategy(req, res) {
        try {

            const { page, limit } = req.body;
            const skip = (page - 1) * limit;

            // var getAllTheme = await strategy_model.find()
            const getAllstrategy = await strategy_model.find({}).sort({createdAt:-1})
           
            // IF DATA NOT EXIST
            if (getAllstrategy.length == 0) {
                res.send({ status: false, msg: "Empty data", data: getAllstrategy })
                return
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Startegy",
                data: getAllstrategy,

            })


        } catch (error) {
            console.log("Error Get All Strategy Error-", error);
        }
    }

    // GET ALL STRATEGYS FOR CLIENT
    async GetAllStrategyForClient(req, res) {
        try {


            const totalCount = await strategy_model.countDocuments();


            // THEME LIST DATA
            // var getAllTheme = await strategy_model.find()
            const getAllstrategy = await strategy_model
                .find({}, '_id strategy_name')



            // IF DATA NOT EXIST
            if (getAllstrategy.length == 0) {
                res.send({ status: false, msg: "Empty data", data: getAllstrategy })
            }

            // DATA GET SUCCESSFULLY
            res.send({
                status: true,
                msg: "Get All Startegy",
                data: getAllstrategy,
            })


        } catch (error) {
            console.log("Error Get All Strategy Error-", error);
        }
    }

    // DELETE STRATEGY IN A COLLECTION
    async DeleteStragegy(req, res) {
        try {
            const { _id } = req.body;

            // CHECK IF STRATEGY EXISTS
            const strategy_check = await strategy_model.findOne({ _id: _id });
            if (!strategy_check) {
                return res.send({ status: false, msg: 'Strategy does not exist', data: [] });
            }

            // CHECK IF STRATEGY EXISTS IN STRATEGY CLIENT
            const strategy_client_check = await strategy_client_model.findOne({ strategy_id: _id });
            if (strategy_client_check) {
                return res.send({ status: false, msg: 'It cannot be deleted because it is assigned to a client.', data: [] });
            }

            // Delete the strategy
            const deleteResult = await strategy_model.deleteOne({ _id: _id });
            if (deleteResult.deletedCount === 1) {
                return res.status(200).send({ status: true, msg: 'Strategy deleted successfully!', data: [] });
            } else {
                return res.status(500).send({ status: false, msg: 'Error deleting strategy', data: [] });
            }

        } catch (error) {
            console.log("Error Delete Strategy Error:", error);
            return res.status(500).send({ status: false, msg: 'An error occurred', data: [] });
        }
    }

    // GET ALL STRATEGYS FOR CLIENT
    async ClientsAccordingToStrategy(req, res) {

        try {


            const { _id } = req.body;
            // GET LOGIN CLIENTS
            const objectId = new ObjectId(_id);
            const pipeline = [
                {
                    $match: {
                        strategy_id: objectId
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "users",
                    },
                },
                {
                    $unwind: '$users',
                },

                {
                    $project: {
                        'users.FullName': 1,
                        'users.UserName': 1,
                        'users.license_type': 1,

                    },
                },
            ];

            const GetAllClientServices = await strategy_client_model.aggregate(pipeline)


            // // IF DATA NOT EXIST
            if (GetAllClientServices.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [] })
            }

            return res.send({
                status: true,
                msg: "Get All Startegy",
                data: GetAllClientServices,
            })


        } catch (error) {
            console.log("Error Get All Strategy Error-", error);
        }
    }


}


module.exports = new strategy();