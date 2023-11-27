"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const ObjectId = mongoose.Types.ObjectId;
const timeFrame = db.timeFrame
const source = db.source
const comparators = db.comparators
const UserMakeStrategy = db.UserMakeStrategy;
const live_price = db.live_price;

const {Alice_Socket , getSocket}  = require('../../Helper/Alice_Socket');
const {Socket_data}  = require('../../Helper/Socket_data');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const dbTradeTools = client.db('TradeTools');

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
      
      
       
       
      let channelList ="";
  
       try {
           // console.log("req",req.body) 

        for (const element of req.body.scriptArray) {
         //console.log(element.instrument_token);
         channelList+=element.exch_seg+'|'+element.instrument_token+"#";
 
         // res.send({ status: true, msg: "successfully Add!" });
         let user_id = req.body.user_id;
         let tokensymbol = element.instrument_token;
         let symbol_name = element.symbol;
         let strategy_name = req.body.strategy_name;
         let segment = element.segment;
         let strike_price = req.body.strike_price;
         let option_type = element.option_type;
         let expiry = element.expiry;
         let timeframe = req.body.timeframe;
         let indicator = req.body.indicator;
         let price_source = req.body.price_source;
         let period = req.body.period;
         let inside_indicator = req.body.inside_indicator;
         let condition = req.body.condition;
         let buffer_value = req.body.buffer_value;
         let type = req.body.type;
         let offset = req.body.offset;
         let condition_source = req.body.condition_source.toString();
         let target = req.body.target_stoploss.target;
         let stoploss = req.body.target_stoploss.stoploss;
         let tsl = req.body.target_stoploss.tsl;

       
           console.log("condition_source",condition_source)
          
       
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
              //res.send({ status: true, msg: "successfully Add!", data: createUserMakeStrategy });
            
            }).catch((err) => {
              console.log("4")
              console.error('Error creating and saving user:', err);
              return res.send({ status: false, msg: err.message ,data: []})
            
            });

        
        }
        
        var alltokenchannellist = channelList.substring(0, channelList.length - 1);
      //  console.log("alltokenchannellist ",alltokenchannellist)
        const suscribe_token =await Socket_data(alltokenchannellist);

        res.send({ status: true, msg: "successfully Add!", data: [] });
      
        } catch (error) {
            console.log("error-", error);
            res.status(500).send({ status: false, msg: "Internal server error" });
        }
    }
}

setInterval(async () => {
  


  
    console.log("yyyyy");
    const suscribe_token =await Alice_Socket();
   
    return
    const pipeline = [
        {
        $match : {
          //tokensymbol:"67308",
          status:"0"
         }
        }
      ];
    const allStrategyResult = await UserMakeStrategy.aggregate(pipeline)
    
    let array =[2,5,6,4] 
    if(allStrategyResult.length > 0){
      const promises = allStrategyResult.map(val => {
        return new Promise(resolve => {
        setTimeout(async() => {
        const currentDate = new Date();
        const milliseconds = currentDate.getTime();
      //  console.log(`Running Time -- ${new Date()} function with element: ${val}`);
       //  code start runing strategy
       let collectionName = 'M' + val.timeframe + '_' + val.tokensymbol;
       // console.log("collectionName -",collectionName)
    const ExistView = await dbTradeTools.listCollections({ name: collectionName }).toArray();
    if (ExistView.length > 0) {

     // console.log("exist collection if ",collectionName)
      const collection = dbTradeTools.collection(collectionName);
      const get_view_data = await collection.aggregate([{$sort :{_id:1}}]).toArray();
  
   // console.log("get_view_data",get_view_data)

   let checkData = {}
    if(val.condition_source != null){
    let condition_source = val.condition_source.split(',');
    //console.log("condition_source val ",val.condition_source)
  //  console.log("condition_source",condition_source)
    // if(condition_source.length > 0){
    //     for (const source of condition_source) {
    //           console.log("condition source ",source)
    //     }}
     
    if(condition_source.length > 0){
      for (const source of condition_source) {
    
       // console.log("condition_source",source)

        const matches = source.match(/(\w+)\((\d+)\)/);

        if (matches) {
         
          const OFFSET_KEY = matches[2]; //
          
        //  console.log("OFFSET_KEY",OFFSET_KEY)
        //  console.log("OFFSET_KEY",parseInt(OFFSET_KEY)+1)
            
          const viewSourceValue = get_view_data[get_view_data.length - (parseInt(OFFSET_KEY)+1)];

         // console.log("viewSourceValue",viewSourceValue); // This will output: 'close(1)'
         // console.log("matches[1]",matches[1]); // This will output: 'close(1)'
         
           
          let sourceVal
          if(matches[1] == "close"){
            sourceVal = get_view_data.map(item => item.close);
          }else if(matches[1] == "open"){
            sourceVal = get_view_data.map(item => item.open);
          }else if(matches[1] == "low"){
            sourceVal =  get_view_data.map(item => item.low);
          }else if(matches[1] == "high"){
            sourceVal = get_view_data.map(item => item.high);
          }

           checkData[matches[1]] = sourceVal;
        } else {
          console.log("No match found");
        }

  
      }
      }

    }
  
  
   //console.log("checkData - ",checkData)
   //console.log("val.condition - ",val.condition)

    
    const conditionString = "(data.close[0] >= data.low[1] || data.high[0] < data.low[2]) && data.close[1] < data.high[2]";

    const conditiostring1 ="(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]<data.high[2]"


     console.log("symbol_name",val.symbol_name)
    abc(checkData, val.condition);
    }










      // code end strategy...


        resolve();
        }, 0);
        });

        });
        await Promise.all(promises);
    }


},300000);







// app.get("/work_startegy",async(req,res)=>{
//     const pipeline = [
//       {
//       $match : {
//         //tokensymbol:"67308",
//         status:"0"
//        }
//       }
//     ];
  
  
//     const allStrategyResult = await UserMakeStrategy.aggregate(pipeline)
//    if(allStrategyResult.length > 0){
//     for (const val of allStrategyResult) {
//       //console.log("startegy",val.condition)
//       //console.log("timeframe",val.timeframe)
//      // console.log("tokensymbol",val.tokensymbol)
  
//       //console.log("condition_source",val.condition_source.split(','))
      
//       let collectionName = 'M' + val.timeframe + '_' + val.tokensymbol;
  
//       const ExistView = await dbTradeTools.listCollections({ name: collectionName }).toArray();
  
//       if (ExistView.length > 0) {
  
//        // console.log("exist collection if ",collectionName)
//         const collection = dbTradeTools.collection(collectionName);
//         const get_view_data = await collection.aggregate([{$sort :{_id:1}}]).toArray();
  
  
//      // console.log("get_view_data",get_view_data)
  
    
  
//      let checkData = {}
//       if(val.condition_source != null){
//       let condition_source = val.condition_source.split(',');
//      // console.log("condition_source",condition_source)
//       if(condition_source.length > 0){
//         for (const source of condition_source) {
      
//          // console.log("condition_source",source)
  
//           const matches = source.match(/(\w+)\((\d+)\)/);
  
        
          
          
//           if (matches) {
           
//             const OFFSET_KEY = matches[2]; //
            
//           //  console.log("OFFSET_KEY",OFFSET_KEY)
//           //  console.log("OFFSET_KEY",parseInt(OFFSET_KEY)+1)
              
//             const viewSourceValue = get_view_data[get_view_data.length - (parseInt(OFFSET_KEY)+1)];
  
//            // console.log("viewSourceValue",viewSourceValue); // This will output: 'close(1)'
//            // console.log("matches[1]",matches[1]); // This will output: 'close(1)'
           
             
//             let sourceVal
//             if(matches[1] == "close"){
//               sourceVal = get_view_data.map(item => item.close);
//             }else if(matches[1] == "open"){
//               sourceVal = get_view_data.map(item => item.open);
//             }else if(matches[1] == "low"){
//               sourceVal =  get_view_data.map(item => item.low);
//             }else if(matches[1] == "high"){
//               sourceVal = get_view_data.map(item => item.high);
//             }
  
        
            
//              checkData[matches[1]] = sourceVal;
         
  
//           } else {
//             console.log("No match found");
//           }
  
     
  
//         }
//         }
  
//       }
    
    
//      //console.log("checkData - ",checkData)
//      //console.log("val.condition - ",val.condition)
  
      
//       const conditionString = "(data.close[0] >= data.low[1] || data.high[0] < data.low[2]) && data.close[1] < data.high[2]";
  
//       const conditiostring1 ="(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]<data.high[2]"
  
  
//        console.log("symbol_name",val.symbol_name)
//       abc(checkData, val.condition);
//       }
  
  
//      }
//     }
//     res.send("okk")
//   })
  
  const abc = (data, conditionString) => {
    console.log("data - ",data)
    console.log("conditionString - ",conditionString)
    // (data.close[0]==246.5)||(data.low[1]==data.high[4])
    try {
      // Use eval to dynamically evaluate the condition string
      const condition = eval(conditionString);
  
      // Check if the condition is true or false based on the data
      if (condition) {
        // Your code for when the condition is true
        console.log("Condition is true");
      } else {
        // Your code for when the condition is false
        console.log("Condition is false");
      }
    } catch (error) {
      console.error("Error in evaluating the condition:", error);
    }
  };







module.exports = new MakeStartegy();