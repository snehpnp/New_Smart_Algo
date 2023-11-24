"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const ObjectId = mongoose.Types.ObjectId;
const timeFrame = db.timeFrame
const source = db.source
const comparators = db.comparators
const UserMakeStrategy = db.UserMakeStrategy;


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


     /// Make Startegy
     async AddMakeStartegy(req, res) {
        try {
         console.log("req",req.body)
         let symol_info = req.body.scriptArray[0];
         
         
        // res.send({ status: true, msg: "successfully Add!" });
         
         let user_id = req.body.user_id;
         let tokensymbol = req.body.symol_info.instrument_token;
         let symbol_name = req.body.symol_info.symbol;
         let strategy_name = req.body.strategy_name;
         let segment = req.body.symol_info.segment;
         let strike_price = req.body.strike_price;
         let option_type = req.body.symol_info.option_type;
         let expiry = req.body.symol_info.expiry;
         let timeframe = req.body.timeframe;
         let indicator = req.body.indicator;
         let price_source = req.body.price_source;
         let period = req.body.period;
         let inside_indicator = req.body.inside_indicator;
         let condition = req.body.condition;
         let buffer_value = req.body.buffer_value;
         let type = req.body.type;
         let offset = req.body.offset;
         let condition_source = req.body.condition_source;
         let target = req.body.target_stoploss.target;
         let stoploss = req.body.target_stoploss.stoploss;
         let tsl = req.body.target_stoploss.tsl;


          return
         await UserMakeStrategy.create({
            user_id: user_id,
            tokensymbol: tokensymbol,
            symbol_name: symbol_name,
            strategy_name: strategy_name,
            segment: segment,
            strike_price: strike_price,
            option_type: option_type,
            expiry: expiry,
            timeframe: timeframe,
            indicator: indicator,
            price_source: price_source,
            period: period,
            inside_indicator: inside_indicator,
            condition: condition,
            buffer_value: buffer_value,
            type: type,
            offset: offset,
            condition_source: condition_source,
            target:target,
            stoploss:stoploss,
            tsl:tsl
           })
            .then(async (createUserMakeStrategy) => {
              console.log("3")
              res.send({ status: true, msg: "successfully Add!", data: createUserMakeStrategy });
            
            }).catch((err) => {
              console.log("4")
              console.error('Error creating and saving user:', err);
              return res.send({ status: false, msg: err.message ,data: []})
            
            });

           
        } catch (error) {
            console.log("error-", error);
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }
}


module.exports = new MakeStartegy();