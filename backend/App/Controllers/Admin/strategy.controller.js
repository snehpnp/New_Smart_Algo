"use strict";
const db = require('../../Models');
const strategy_model = db.strategy;
const User = db.user;
const strategy_client_model = db.strategy_client;
const client_services = db.client_services

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
            const getAllstrategy = await strategy_model.find({}).sort({ createdAt: -1 })

            // IF DATA NOT EXIST
            if (getAllstrategy.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: getAllstrategy })
                return
            }

            // DATA GET SUCCESSFULLY
            return res.send({
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
                return res.send({ status: false, msg: "Empty data", data: getAllstrategy })
            }

            // DATA GET SUCCESSFULLY
            return res.send({
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

    // [
    //     {
    //         "_id": "66b0cbce2b5213c4015fad66",
    //         "FullName": "Himanshu Soni",
    //         "UserName": "Himanshu Soni",
    //         "license_type": "1",
    //         "WebLoginStatus": "0",
    //         "AppLoginStatus": "1",
    //         "TradingStatus": "off",
    //         "Email": "himanshusoni034@gmail.com"
    //     }
    // ]




    async ClientsAccordingToStrategy(req, res) {
        try {
            const { _id } = req.body;

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
                        'users.WebLoginStatus': 1,
                        'users.AppLoginStatus': 1,
                        'users.TradingStatus': 1,
                        'users.Email': 1,




                    },
                },
            ];

            const GetAllClientServices = await client_services.aggregate(pipeline)



            // // IF DATA NOT EXIST
            if (GetAllClientServices.length == 0) {
                return res.send({ status: false, msg: "Empty data", data: [] })
            }

            const uniqueUsersArray = [];
            const emailSet = new Set();

            for (const user of GetAllClientServices) {
                if (!emailSet.has(user.users.Email)) {
                    emailSet.add(user.users.Email);
                    uniqueUsersArray.push(user);
                }
            }



            return res.send({
                status: true,
                msg: "Get All Startegy",
                data: uniqueUsersArray,
            })


        } catch (error) {
            console.log("Error Get All Strategy Error-", error);
        }
    }

    // Get Add Remove Strategy
    async GetAddRemoveStrategy(req, res) {

        try {
            const { _id } = req.body;

            const objectId = new ObjectId(_id);

            const pipeline2 = [
                {
                    $lookup: {
                        from: "strategy_clients",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "matched_docs"
                    }
                },
                {
                    $unwind: "$matched_docs"
                },
                {
                    $group: {
                        _id: "$_id",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        count: 1,

                    }
                }
            ];

            const duplicateids = await User.aggregate(pipeline2)




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
                        strategy_id: 1,
                        'users._id': 1,
                        'users.FullName': 1,
                        'users.UserName': 1,
                        'users.license_type': 1,
                        'users.Email': 1,




                    },
                },
            ];

            const GetAllClientStrategy = await strategy_client_model.aggregate(pipeline)



            const pipeline1 = [
                {
                    $project: {

                        _id: 1,
                        FullName: 1,
                        UserName: 1,
                        license_type: 1,
                        Email: 1

                    },
                },

            ];

            const AllClients = await User.aggregate(pipeline1)

            if (AllClients.length > 0) {
                return res.send({ status: true, msg: "Get All data", StrategyClient: GetAllClientStrategy, AllClients: AllClients, duplicateids: duplicateids })
            } else {

                return res.send({ status: false, msg: "Get All data", data: [] })
            }


        } catch (error) {
            console.log("Error Get All Strategy Error-", error);
        }
    }


    // Update Add Remove Strategy
    async UpdateAddRemoveStrategy(req, res) {
        try {
            if (req.body.clientId.length > 0) {

                req.body.clientId.forEach(async (element) => {

                    const strategy_client = new strategy_client_model({
                        strategy_id: req.body.strategyId,
                        user_id: element,
                    });
                    strategy_client.save();

                });

            }

            if (req.body.clientIdDelete.length > 0) {

                req.body.clientIdDelete.forEach(async (element) => {


                    const deleteResult = await strategy_client_model.deleteOne({ strategy_id: req.body.strategyId, user_id: element });


                });
            }


            return res.send({ status: true, msg: "Startegy Update Successfully...." })


        } catch (error) {
            console.log("Error Get All Strategy Error-", error);
            return res.send({ status: false, msg: "Catch Error" })
        }
    }






}


module.exports = new strategy();