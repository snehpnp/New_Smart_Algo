"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const ObjectId = mongoose.Types.ObjectId;
const timeFrame = db.timeFrame
const source = db.source
const comparators = db.comparators
const UserMakeStrategy = db.UserMakeStrategy;
const live_price = db.live_price;
const company_information = db.company_information;
const user = db.user;



const { Alice_Socket, getSocket } = require('../../Helper/Alice_Socket');
const { Socket_data } = require('../../Helper/Socket_data');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbTradeTools = client.db(process.env.DB_TRADETOOLS);
const db_GET_VIEW = client.db(process.env.DB_NAME);
const get_open_position_view = db_GET_VIEW.collection('open_position');
const token_chain = db_GET_VIEW.collection('token_chain');

class MakeStartegy {

  async getcandledata(req, res) {

    let timeFrame = req.body.timeframe;
    let tokensymbol = req.body.tokensymbol;
     let collectionName = 'M'+timeFrame+'_'+tokensymbol;

    
     try{

      const collections = await dbTradeTools.listCollections().toArray();
      const collectionExists = collections.some(coll => coll.name === collectionName);

      if (collectionExists) {
        const collection = dbTradeTools.collection(collectionName);
            
      const  result = await collection.find({}).sort({ _id: -1 }).limit(30).toArray();

      const transformedData = result.map(item => ({
        x: new Date(new Date(item._id).getTime() / 1000),
        y: [item.open, item.high, item.low, item.close],
      }));
      
    
        if (result.length > 0) {
          res.send({ status: true, msg: "Get All time frame", data: transformedData })
        } else {
          res.send({ status: false, msg: "Empty data", data: [] })
        }

        
      }else{
        res.send({ status: false, msg: "Empty data", data: [] })
      }

     }catch(e){

     }

   
  }


  async gettimeFrame(req, res) {
    const pipeline = [
      { $sort: { _id: 1 } }
    ]
    const result = await timeFrame.aggregate(pipeline)

    // DATA GET SUCCESSFULLY
    if (result.length > 0) {
      res.send({ status: true, msg: "Get All time frame", data: result })
    } else {
      res.send({ status: false, msg: "Empty data", data: [] })
    }
  }

  /// get source
  async get_sources(req, res) {
    try {

      const pipeline = [
        { $sort: { _id: 1 } }
      ]
      const result = await source.aggregate(pipeline)

   
      if (result.length > 0) {
        res.send({ status: true, msg: "Get All Source", data: result });
      } else {
        res.send({ status: false, msg: "Empty data", data: [] });
      }
    } catch (error) {
   
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  /// get comparators
  async get_comparators(req, res) {
    try {

      const pipeline = [
        { $sort: { _id: 1 } }
      ]
      const result = await comparators.aggregate(pipeline)

   
      if (result.length > 0) {
        res.send({ status: true, msg: "Get All Source", data: result });
      } else {
        res.send({ status: false, msg: "Empty data", data: [] });
      }
    } catch (error) {
  
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  /// get Make startegy
  async GetAllMakeStartegy(req, res) {

    try {

      const pipeline = [
        { $sort: { _id: -1 } }
      ]
      const result = await UserMakeStrategy.aggregate(pipeline)

 
      if (result.length > 0) {
        res.send({ status: true, msg: "Get All make strategy", data: result });
      } else {
        res.send({ status: false, msg: "Empty data", data: [] });
      }
    } catch (error) {
 
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  //Delete make strateg
  async DeleteMakeStartegy(req, res) {
    try {
      const objectId = new ObjectId(req.body.id);
      const result = await UserMakeStrategy.deleteOne({ _id: objectId });
      if (result.acknowledged == true) {
        return res.send({ status: true, msg: 'Delete successfully ', data: result.acknowledged });
      }
    } catch (error) {
    
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

   //Delete make strateg Selected
  async DeleteMakeStartegySelected(req, res) {
    try {

      
      const result = await UserMakeStrategy.deleteMany({ _id: { $in: req.body.ids_array } });
      if (result.acknowledged == true) {
        return res.send({ status: true, msg: 'Delete successfully ', data: result.acknowledged });
      }
    } catch (error) {
      
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  //EditeMakeStartegy  make strateg
  async EditeMakeStartegy(req, res) {
    try {

      const objectId = new ObjectId(req.body.id);
      const result = await UserMakeStrategy.findOne({ _id: objectId });
 

      if (result != undefined) {
        res.send({ status: true, msg: 'Delete successfully ', data: result });
      } else {
        res.send({ status: false, msg: 'No Data Found', data: {} });
      }

    } catch (error) {
  
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }




  //Update Strategy..
  async UpdateMakeStartegy(req, res) {

    // console.log("user_panel_key",user_panel_key)
     
    let channelList = "";
    try {
       
      let strategy_name = req.body.strategy_name;
       
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
      let entryTime = new Date(`1970-01-01T${req.body.timeTradeConddition[0].entry.time == "" ? "01:01" : req.body.timeTradeConddition[0].entry.time}:00.000Z`);
      let exitTime = new Date(`1970-01-01T${req.body.timeTradeConddition[0].exit.time == "" ? "01:01" : req.body.timeTradeConddition[0].exit.time}:00.000Z`);
      let notradeTime = new Date(`1970-01-01T${req.body.timeTradeConddition[0].notrade.time == "" ? "01:01" : req.body.timeTradeConddition[0].notrade.time}:00.000Z`);
      let condition_array = req.body.condition_array
      let timeTradeConddition_array = req.body.timeTradeConddition;
      let target_stoloss_array = req.body.target_stoloss_array
      let maxProfit = req.body.maxProfit;
      let maxLoss = req.body.maxLoss;
    


      // Update Number Of Trade
      const filter_number_of_trade = { show_strategy : req.body.show_strategy };
      const update_make_strategy_number_of_trade = {
        $set: {
          numberOfTrade:req.body.numberOfTrade,
          maxProfit:req.body.maxProfit,
          maxLoss:req.body.maxLoss
        }
      };
      const result_number_of_trade = await UserMakeStrategy.updateMany(filter_number_of_trade, update_make_strategy_number_of_trade);
     



      const objectId_update = new ObjectId(req.body.update_id);
      const filter = { _id: objectId_update };


      const update_make_strategy = {
        $set: {
           
          strategy_name: strategy_name,
         
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
          target: target,
          stoploss: stoploss,
          tsl: tsl,
          entryTime: entryTime,
          exitTime: exitTime,
          notradeTime: notradeTime,
          condition_array: condition_array,
          //exch_seg:exch_seg,
          timeTradeConddition_array: timeTradeConddition_array,
          target_stoloss_array: target_stoloss_array,
         
        }
      };
      // UPDATE STRATEGY INFORMATION
      const result = await UserMakeStrategy.updateOne(filter, update_make_strategy);

      // }


      res.send({ status: true, msg: "Update successfully!", data: [] });

    } catch (error) {
     
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  /// Make Startegy
  async AddMakeStartegy(req, res) {
 
    var _id = new ObjectId(req.body.user_id);

    let user_panel_key = await user.findOne({_id:_id}).select('client_key').lean();
    let channelList = "";
    try {
      

      for (const element of req.body.scriptArray) {

        let Strike = element.strike;
        if (element.strike == "NaN") {
          Strike = "100"
        }

        channelList += element.exch_seg + '|' + element.instrument_token + "#";

        // res.send({ status: true, msg: "successfully Add!" });
        let user_id = req.body.user_id;
      
        let tokensymbol = element.instrument_token;
        let symbol_name = element.symbol;
        let strategy_name = req.body.strategy_name;
        let segment = element.segment;
        let strike_price = Strike;
        let option_type = element.option_type;
        let expiry = element.expiry;
        let exch_seg = element.exch_seg;
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
        let panelKey = user_panel_key.client_key;
        let entryTime = new Date(`1970-01-01T${req.body.timeTradeConddition[0].entry.time == "" ? "01:01" : req.body.timeTradeConddition[0].entry.time}:00.000Z`);
        let exitTime = new Date(`1970-01-01T${req.body.timeTradeConddition[0].exit.time == "" ? "01:01" : req.body.timeTradeConddition[0].exit.time}:00.000Z`);
        let notradeTime = new Date(`1970-01-01T${req.body.timeTradeConddition[0].notrade.time == "" ? "01:01" : req.body.timeTradeConddition[0].notrade.time}:00.000Z`);
        let condition_array = req.body.condition_array
        let timeTradeConddition_array = req.body.timeTradeConddition;
        let target_stoloss_array = req.body.target_stoloss_array
        let numberOfTrade = req.body.numberOfTrade;
        let maxProfit = req.body.maxProfit;
        let maxLoss = req.body.maxLoss;
        



        

        // Add Token token chain
      var get_token_chain = await token_chain.findOne({_id:tokensymbol})
     
      if(get_token_chain == null){
     
      // const token_chain = await token_chain.insertOne({_id:tokensymbol,exch:exch_seg})
      const filter = { _id:tokensymbol  };
      const update = { $set: { _id:tokensymbol,exch:exch_seg } };
       await token_chain.updateOne(filter, update, { upsert: true });
        
      }


        await UserMakeStrategy.create({
          name: req.body.name + req.body.user_id + req.body.type+tokensymbol,
          
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
          target: target,
          stoploss: stoploss,
          tsl: tsl,
          panelKey: user_panel_key.client_key,
          entryTime: entryTime,
          exitTime: exitTime,
          notradeTime: notradeTime,
          condition_array: condition_array,
          exch_seg: exch_seg,
          timeTradeConddition_array: timeTradeConddition_array,
          target_stoloss_array: target_stoloss_array,
          show_strategy: req.body.name+'_'+tokensymbol,
          numberOfTrade:numberOfTrade,
          maxProfit:maxProfit,
          maxLoss:maxLoss
        })
          .then(async (createUserMakeStrategy) => {
        
            //res.send({ status: true, msg: "successfully Add!", data: createUserMakeStrategy });

          }).catch((err) => {
      
            console.log('Error creating and saving user:', err);
            return res.send({ status: false, msg: 'Strategy Name Already Exist', data: [] })

          });
      }

      var alltokenchannellist = channelList.substring(0, channelList.length - 1);
      
   
      const suscribe_token = await Socket_data(alltokenchannellist);
      res.send({ status: true, msg: "successfully Add!", data: [] });
    } catch (e) {
    }
  }

}

//-------------------Strategy Run Code ---------------------------------------------//

const currentDateNow = new Date();
const options = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // Set to true for 12-hour format
  timeZone: 'Asia/Kolkata', // Adjust the time zone as needed
};

const currentTimeNow = currentDateNow.toLocaleString('en-IN', options);

const [hours, minutes] = currentTimeNow.split(':').map(Number);

const marketStartTime = { hour: 9, minute: 15 };

const marketEndTimeEquity = { hour: 15, minute: 30 };

const marketEndTimeCurrency = { hour: 4, minute: 59 };

const marketEndTimeMCX = { hour: 11, minute: 29 };

  const isMarketOpen =
  hours > marketStartTime.hour ||
  (hours === marketStartTime.hour && minutes >= marketStartTime.minute);

  const isMarketClosedEquity =
  hours > marketEndTimeEquity.hour ||
  (hours === marketEndTimeEquity.hour && minutes > marketEndTimeEquity.minute);

  const isMarketClosedCurrency =
  hours > marketEndTimeCurrency.hour ||
  (hours === marketEndTimeCurrency.hour && minutes > marketEndTimeCurrency.minute);

  const isMarketClosedMCX =
  hours > marketEndTimeMCX.hour ||
  (hours === marketEndTimeMCX.hour && minutes > marketEndTimeMCX.minute);

 


const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekday = weekdays[currentDateNow.getDay()];


const Holidays = require('date-holidays');
const holidays = new Holidays();
const currentDate = new Date();
let rr = 1

async function run() {
 
  try {

    // Define the function to be executed
    const executeFunction = async () => {
    
      
    //  if (rr) {
      if (holidays.isHoliday(currentDate) && weekday != 'Sunday' && weekday != 'Saturday') {
     

        const pipeline = [
          {
            $match: {
              //tokensymbol:"67308",
              status: "1"
            }
          }
        ];
        const allStrategyResult = await UserMakeStrategy.aggregate(pipeline)
        if (allStrategyResult.length > 0) {
          for (let index = 0; index < allStrategyResult.length; index++) {
         
            const val = allStrategyResult[index];

     
            const currentDate = new Date();

            const options = {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false, // Set to true for 12-hour format
              timeZone: 'Asia/Kolkata', // Adjust the time zone as needed
            };
            const currentTime = currentDate.toLocaleString('en-IN', options);

            const options1 = {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false, // Set to true for 12-hour format
              timeZone: 'UTC', // Adjust the time zone as needed
            };

            const entryTime = val.entryTime.toLocaleTimeString('en-US', options1);
            const exitTime = val.exitTime.toLocaleTimeString('en-US', options1);
            const notradeTime = val.notradeTime.toLocaleTimeString('en-US', options1);

          
            // Entry Time less than No trade time OR Exit time
        
            if((val.segment.toUpperCase()=="O"||val.segment.toUpperCase()=="F"||val.segment.toUpperCase()=="C") && (isMarketOpen && isMarketClosedEquity)){
         
             return
            }else if((val.segment.toUpperCase()=="CO"||val.segment.toUpperCase()=="CO") && (isMarketOpen && isMarketClosedCurrency)){
          
             return
            }else if((val.segment.toUpperCase()=="MO"||val.segment.toUpperCase()=="MF") && (isMarketOpen && isMarketClosedMCX)){
             
             return
            }else{
            

             // EXCUTED RUN CODE INSIDE TIME

             if (currentTime > entryTime && entryTime < exitTime && entryTime < notradeTime) {
       

              const currentDate = new Date();
              const milliseconds = currentDate.getTime();

              let collectionName = 'M' + val.timeframe + '_' + val.tokensymbol;
              const ExistView = await dbTradeTools.listCollections({ name: collectionName }).toArray();
              if (ExistView.length > 0) {

                const collection = dbTradeTools.collection(collectionName);
                const get_view_data = await collection.aggregate([{ $sort: { _id: -1 } }]).toArray();

      
                let data = {}
                if (val.condition_source != null) {
                  let condition_source = val.condition_source.split(',');
                  if (condition_source.length > 0) {
                    for (const source of condition_source) {
                  
                      const matches = source.match(/(\w+)\((\d+)\)/);
                      if (matches) {
                        const OFFSET_KEY = matches[2];
                        const viewSourceValue = get_view_data[get_view_data.length - (parseInt(OFFSET_KEY) + 1)];

                        let sourceVal
                        if (matches[1] == "close") {
                          sourceVal = get_view_data.map(item => item.close);
                        } else if (matches[1] == "open") {
                          sourceVal = get_view_data.map(item => item.open);
                        } else if (matches[1] == "low") {
                          sourceVal = get_view_data.map(item => item.low);
                        } else if (matches[1] == "high") {
                          sourceVal = get_view_data.map(item => item.high);
                        }

                        data[matches[1]] = sourceVal;
                      } else {
                        console.log("No match found");
                      }


                    }
                  }

                }

                
                try {
                  // Use eval to dynamically evaluate the condition string
                
                  const condition = eval(val.condition.replace(/(\|\||&&)$/, ''));
                   
                  // Check if the condition is true or false based on the data
                  if (condition) {

                    let entry_type = "LE";
                    if (val.type == "BUY") {
                      entry_type = "SE"
                    }

                    let condition_check_previous_trade = {
                      strategy: val.strategy_name,
                      symbol: val.symbol_name,
                      entry_type: entry_type,
                      segment: val.segment,
                      client_persnal_key:val.panelKey,
                      MakeStartegyName:val.show_strategy,
                      TradeType: "MAKE_STRATEGY",
                    }

                    if (val.segment.toUpperCase() == "O" || val.segment.toUpperCase() == "FO" || val.segment.toUpperCase() == "MO" || val.segment.toUpperCase() == "CO") {

                      let option_type = "CALL";
                      if (val.option_type == "PE") {
                        option_type = "PUT"
                      }

                      condition_check_previous_trade = {
                        strategy: val.strategy_name,
                        symbol: val.symbol_name,
                        entry_type: entry_type,
                        segment: val.segment,
                        strike: val.strike_price,
                        option_type: option_type,
                        expiry: val.expiry,
                        client_persnal_key:val.panelKey,
                        MakeStartegyName:val.show_strategy,
                        TradeType: "MAKE_STRATEGY",
                      }

                    }

                    if (val.segment.toUpperCase() == "F" || val.segment.toUpperCase() == "MF" || val.segment.toUpperCase() == "CF") {

                      condition_check_previous_trade = {
                        strategy: val.strategy_name,
                        symbol: val.symbol_name,
                        entry_type: entry_type,
                        segment: val.segment,
                        expiry: val.expiry,
                        client_persnal_key:val.panelKey,
                        MakeStartegyName:val.show_strategy,
                        TradeType: "MAKE_STRATEGY",
                      }

                    }

                 

                    var checkPreviousTrade = await get_open_position_view.findOne(condition_check_previous_trade)

                    const collection_last_price = dbTradeTools.collection(val.tokensymbol);
                    const last_price = await collection_last_price.aggregate([{ $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
                  
                  
                    let price_lp = last_price[0].lp
 
                    if (checkPreviousTrade != null) {
                 
                      const currentTimestamp = Math.floor(Date.now() / 1000);
                      let type = "LX";
                      let price = checkPreviousTrade.stockInfo_bp1;
                      if (checkPreviousTrade.entry_type.toUpperCase() == "SE") {
                        type = "SX";
                        price = checkPreviousTrade.stockInfo_sp1;
                      }


                      let strike = checkPreviousTrade.strike;
                      if (checkPreviousTrade.strike_price == "NaN") {
                        strike = "100"
                      }


                      let option_type = "CALL"
                      if (checkPreviousTrade.option_type.toUpperCase() == "PUT") {
                        option_type = "PUT"
                      }


                      let Quntity = checkPreviousTrade.entry_qty_percent;
   
                      let req = `DTime:${currentTimestamp}|Symbol:${checkPreviousTrade.symbol}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${checkPreviousTrade.segment}|Strike:${strike}|OType:${option_type}|Expiry:${checkPreviousTrade.expiry}|Strategy:${checkPreviousTrade.strategy}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:${checkPreviousTrade.TradeType}|MakeStartegyName:${val.show_strategy}|Demo:demo`

                  
                      let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
                        url: `${process.env.BROKER_URL}`,
                        headers: {
                          'Content-Type': 'text/plain'
                        },
                        data: req
                      };

                      await axios.request(config)
                        .then((response) => {

                          // console.log("response Trade Excuted - ",response)

                        })
                        .catch((error) => {
                          console.log("Error ",error);
                        });

                    }

                    // Your code for when the condition is true
                  
                    const update = {
                      $set: {
                        status: "2",
                      },
                      $inc: {
                        numberOfTrade_count_trade: 1, // Increment by 1, you can change this value based on your requirement
                      },
                    };

                    const filter = { _id: val._id };
                    let Res = await UserMakeStrategy.updateOne(filter, update);




                  
                    // code same trade status update
                    let Check_same_trade_type = "BUY"
                    if (val.type == "BUY") {
                      Check_same_trade_type = "SELL"
                    }

                    const Check_same_trade_data = await UserMakeStrategy.findOne({ show_strategy: val.show_strategy, type: Check_same_trade_type });


                 
                    if (Check_same_trade_data) {
                  
                      
                      let Res = await UserMakeStrategy.updateOne({ name: Check_same_trade_data.name }, {
                        $set: {
                          status: "1",
                        },
                      });


                     
                    }
                    //End code same trade status update



                    // START NUMBER OF TRADE CODE UPDATE
                    const numberOfTrade_count_trade_count = await UserMakeStrategy.aggregate([
                      {
                        $match: {
                          show_strategy: val.show_strategy,
                          numberOfTrade: { $ne: "" }
                        }
                      },
                      
                      {
                        $group: {
                          _id: null,
                          totalNumberOfTrade_count_trade: { $sum: '$numberOfTrade_count_trade' },
                        
                        }
                      },
                      {
                        $project: {
                          _id: 0,
                          
                          totalNumberOfTrade_count_trade: 1,
                          anotherField: '$numberOfTrade',
                          isTotalSmall: { $lt: ['$totalNumberOfTrade_count_trade',parseInt(val.numberOfTrade)] }
                         
                        }
                      }
                    ])
                    
                   if(numberOfTrade_count_trade_count.length > 0){
                    if(numberOfTrade_count_trade_count[0].isTotalSmall == false){
                     
                    const update_trade_off = {
                     $set: {
                       status: "2",
                     },
                    
                   };
               
                   const filter_trade_off = { show_strategy: val.show_strategy };
                   let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
                    }
                   }
                    // END NUMBER OF TRADE CODE UPDATE
                    

                    const currentTimestamp = Math.floor(Date.now() / 1000);
                   
                    let type = "LE";
                    if (val.type.toUpperCase() == "SELL") {
                      type = "SE"
                    }

                    let price = 0;

                    let strike = val.strike_price;
                    if (val.strike_price == "NaN") {
                      strike = "100"
                    }


                    let option_type = "CALL"
                    if (val.option_type.toUpperCase() == "PE") {
                      option_type = "PUT"
                    }

                    let Quntity = "100"

                     
                    const dateObject = new Date(val.exitTime);
                    const hours = ('0' + dateObject.getUTCHours()).slice(-2);
                    const minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
                    const ExitTime = `${hours}-${minutes}`;


                    let req = `DTime:${currentTimestamp}|Symbol:${val.symbol_name}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy_name}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:MAKE_STRATEGY|Target:${val.target}|StopLoss:${val.stoploss}|ExitTime:${ExitTime}|MakeStartegyName:${val.show_strategy}|Demo:demo`

                   
                    let config = {
                      method: 'post',
                      maxBodyLength: Infinity,
                      // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
                      url: `${process.env.BROKER_URL}`,
                      headers: {
                        'Content-Type': 'text/plain'
                      },
                      data: req
                    };

                    await axios.request(config)
                      .then((response) => {
                        // console.log("response Trade Excuted - ", response)

                      })
                      .catch((error) => {
                        console.log("Error ",error);
                      });


                  } else {
                    // Your code for when the condition is false
                    //  console.log("Condition is false ", val._id);
                  }
                } catch (error) {
                  console.log("Error in evaluating the condition:", error);
                }

              }

            } else {
              // console.log('else:', entryTime);
            }

            // END EXCUTED RUN CODE INSIDE TIME
            }

          }
        }

      } else {
       // console.log('The stock market is Closed!');
      }


    };

    // Run the function initially
    await executeFunction();

    // Use a while loop with setTimeout for a delay
    while (true) {
      // Delay for 1000 milliseconds (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      await executeFunction();
    }
  } finally {
    // Close the client when you're done

  }

}


run().catch(console.error);



const exitOpentrade = async () => {
  try {
    const viewName = 'open_position_excute';
  
  
    var openPosition = await db_GET_VIEW.collection(viewName).find().toArray();
  
  
    if (openPosition.length > 0) {
  
      openPosition && openPosition.map((item) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        let req = `DTime:${currentTimestamp}|Symbol:${item.symbol}|TType:${item.entry_type == "SE" ? "SX" : "LX"}|Tr_Price:131|Price:${item.stockInfo_bp1}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${item.segment}|Strike:${item.strike}|OType:${item.option_type}|Expiry:${item.expiry}|Strategy:${item.strategy}|Quntity:${item.entry_qty_percent}|Key:${item.client_persnal_key}|TradeType:${item.TradeType}|Demo:demo`
      
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
          url: `${process.env.BROKER_URL}`,
          headers: {
            'Content-Type': 'text/plain'
          },
          data: req
        };
  
        axios.request(config)
          .then((response) => {
  
            // console.log("response Trade Excuted - ", response.data)
  
          })
          .catch((error) => {
            // console.log(error.response.data);
          });
  
  
      })
  
    } 
  } catch (error) {
    console.log("Error in Open Position",error);
  }
   
  
  
  }
  
  
  
  setInterval(() => {
    exitOpentrade()
  }, 10000);



module.exports = new MakeStartegy();