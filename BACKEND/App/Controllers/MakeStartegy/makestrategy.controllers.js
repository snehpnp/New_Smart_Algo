"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const ObjectId = mongoose.Types.ObjectId;
const timeFrame = db.timeFrame

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
}


module.exports = new MakeStartegy();