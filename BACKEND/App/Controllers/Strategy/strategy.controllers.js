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

            if (searchQuery == "") {

                pipeline = [
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
                        $match: {
                            tradesymbol: { $regex: "^" + searchQuery, $options: "i" }
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
                res.send({ status: true, msg: "Get Permission Successfully", data: get_user });
            } else {
                res.send({ status: false, msg: "Empty data", data: [] });
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
                res.send({ status: true, msg: "Get Permission Successfully", data: get_indicator });
            } else {
                res.send({ status: false, msg: "Empty data", data: [] });
            }
        } catch (error) {
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }

}

module.exports = new Strategy();
