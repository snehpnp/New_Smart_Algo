"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const ObjectId = mongoose.Types.ObjectId;
const timeFrame = db.timeFrame
const source = db.source
const comparators = db.comparators


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

class MakeStartegy {

    async gettimeFrame(req, res) {
        const pipeline =[
            { $sort: { _id: 1 } }
        ]
        const result =  await timeFrame.aggregate(pipeline)
        
        // DATA GET SUCCESSFULLY
        if(result.length > 0){
            res.send({status: true, msg: "Get All time frame", data: result })
        }else{
            res.send({ status: false, msg: "Empty data", data: [] })
        }
    }

   /// get source
    async get_sources(req, res) {
        try {

            const pipeline =[
                { $sort: { _id: 1 } }
            ]
            const result =  await source.aggregate(pipeline)

           //  console.log("get_sources - ",result)
            if (result .length > 0) {
                res.send({ status: true, msg: "Get All Source", data: result   });
            } else {
                res.send({ status: false, msg: "Empty data", data: [] });
            }
        } catch (error) {
            console.log("error-", error);
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }

     /// get comparators
     async get_comparators(req, res) {
        try {

            const pipeline =[
                { $sort: { _id: 1 } }
            ]
            const result =  await comparators.aggregate(pipeline)

          //   console.log("get_comparators - ",result)
            if (result .length > 0) {
                res.send({ status: true, msg: "Get All Source", data: result   });
            } else {
                res.send({ status: false, msg: "Empty data", data: [] });
            }
        } catch (error) {
            console.log("error-", error);
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }
}


module.exports = new MakeStartegy();