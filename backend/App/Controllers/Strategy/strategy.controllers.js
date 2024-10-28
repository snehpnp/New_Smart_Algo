"use strict";
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../../Models");

const Alice_token = db.Alice_token;
const indicator = db.indicator;

var dateTime = require("node-datetime");
var dt = dateTime.create();


const { MongoClient } = require('mongodb');

//  const uri = "mongodb://localhost:27017/";
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect();

const db1 = client.db(process.env.DB_NAME);



// Product CLASS
class Strategy {

    // GET SUBADMIN PERMISSION
    async get_servicename(req, res) {


        try {
            const searchQuery = req.body.searchQuery || "";
            const page = 1;
            const pageSize = 10;
            var pipeline = ""
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

            if (searchQuery == "") {


                pipeline = [
                    {
                        $addFields: {
                            expiry: {
                                $dateFromString: {
                                    dateString: {
                                        $concat: [
                                            { $substr: ["$expiry", 4, 4] }, // Year (YYYY)
                                            "-",
                                            { $substr: ["$expiry", 2, 2] }, // Month (MM)
                                            "-",
                                            { $substr: ["$expiry", 0, 2] }  // Day (DD)
                                        ]
                                    },
                                    format: "%Y-%m-%d"
                                }
                            }
                        }
                    },

                    {
                        $match: {
                            $or: [
                                { segment: 'C' },
                                { segment: 'F' },
                                { segment: 'MF' },
                                { exch_seg: { $ne: 'NCO' } },
                            ],
                        },
                        expiry: {
                            $gte: startOfMonth,
                            $lt: startOfNextMonth
                        },
                        exch_seg: { $ne: 'NCO' }
                    },
                    {
                        $skip: (page - 1) * pageSize
                    },
                    {
                        $limit: pageSize
                    }
                ];

            } else {


                pipeline = [

                    {
                        $addFields: {
                            expiry: {
                                $dateFromString: {
                                    dateString: {
                                        $concat: [
                                            { $substr: ["$expiry", 4, 4] }, // Year (YYYY)
                                            "-",
                                            { $substr: ["$expiry", 2, 2] }, // Month (MM)
                                            "-",
                                            { $substr: ["$expiry", 0, 2] }  // Day (DD)
                                        ]
                                    },
                                    format: "%Y-%m-%d"
                                }
                            }
                        }
                    },
                    {  
                        
                        $match: {
                            tradesymbol: { $regex: "^" + searchQuery, $options: "i" },
                            $or: [
                                { segment: 'C' },
                                { segment: 'F' },
                                { segment: 'MF' }
                            ],
                            expiry: {
                                $gte: startOfMonth,
                                $lt: startOfNextMonth
                            },
                           exch_seg: { $ne: 'NCO' } 
                        }
                    },
                    {
                        $skip: (page - 1) * pageSize
                    },
                    {
                        $limit: pageSize
                    }
                ];

            }



            const get_user = await Alice_token.aggregate(pipeline);

            if (get_user.length > 0) {
                return res.send({ status: true, msg: "Get Permission Successfully", data: get_user });
            } else {
                return res.send({ status: false, msg: "Empty data", data: [] });
            }
        } catch (error) {
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }

    async get_indicators(req, res) {
        try {


            const collection = db1.collection('indicators');
            const get_indicator = await collection.aggregate([]).toArray();

            if (get_indicator.length > 0) {
                return res.send({ status: true, msg: "Get Permission Successfully", data: get_indicator });
            } else {
                return res.send({ status: false, msg: "Empty data", data: [] });
            }
        } catch (error) {
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }

}

module.exports = new Strategy();
