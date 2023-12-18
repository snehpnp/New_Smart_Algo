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

      //  console.log("get_sources - ",result)
      if (result.length > 0) {
        res.send({ status: true, msg: "Get All Source", data: result });
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

      const pipeline = [
        { $sort: { _id: 1 } }
      ]
      const result = await comparators.aggregate(pipeline)

      //   console.log("get_comparators - ",result)
      if (result.length > 0) {
        res.send({ status: true, msg: "Get All Source", data: result });
      } else {
        res.send({ status: false, msg: "Empty data", data: [] });
      }
    } catch (error) {
      console.log("error-", error);
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  /// get Make startegy
  async GetAllMakeStartegy(req, res) {

    try {

      const pipeline = [
        { $sort: { _id: 1 } }
      ]
      const result = await UserMakeStrategy.aggregate(pipeline)

      //console.log("GetAllMakeStartegy - ",result)
      if (result.length > 0) {
        res.send({ status: true, msg: "Get All make strategy", data: result });
      } else {
        res.send({ status: false, msg: "Empty data", data: [] });
      }
    } catch (error) {
      console.log("error-", error);
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
      console.log("error-", error);
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

   //Delete make strateg Selected
  async DeleteMakeStartegySelected(req, res) {
    try {

      //const objectI = new ObjectId(req.body.ids_array);
      console.log("ids_array - ",req.body.ids_array)
      const result = await UserMakeStrategy.deleteMany({ _id: { $in: req.body.ids_array } });
      if (result.acknowledged == true) {
        return res.send({ status: true, msg: 'Delete successfully ', data: result.acknowledged });
      }
    } catch (error) {
      console.log("error-", error);
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  //EditeMakeStartegy  make strateg
  async EditeMakeStartegy(req, res) {
    try {

      const objectId = new ObjectId(req.body.id);
      const result = await UserMakeStrategy.findOne({ _id: objectId });

      console.log("result edit data -", result)

      if (result != undefined) {
        res.send({ status: true, msg: 'Delete successfully ', data: result });
      } else {
        res.send({ status: false, msg: 'No Data Found', data: {} });
      }

    } catch (error) {
      console.log("error-", error);
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  //Update Strategy..


  async UpdateMakeStartegy(req, res) {
    console.log("req time", req.body)



    let user_panel_key = await user.findOne().select('client_key').lean();
    // console.log("user_panel_key",user_panel_key)
    //   return
    let channelList = "";
    try {
      // console.log("req",req.body) 
      console.log("req time", req.body.timeTradeConddition[0].entry.time)


      // for (const element of req.body.scriptArray) {
      //console.log(element.instrument_token);
      // channelList+=element.exch_seg+'|'+element.instrument_token+"#";

      // res.send({ status: true, msg: "successfully Add!" });
      // let user_id = req.body.user_id;
      let name = req.body.name;
      //let tokensymbol = element.instrument_token;
      // let symbol_name = element.symbol;
      let strategy_name = req.body.strategy_name;
      // let segment = element.segment;
      // let strike_price = element.strike;
      // let option_type = element.option_type;
      //  let expiry = element.expiry;
      // let exch_seg = element.exch_seg;
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



      const objectId_update = new ObjectId(req.body.update_id);
      const filter = { _id: objectId_update };
      const update_make_strategy = {
        $set: {
          name: name,
          // user_id: user_id,
          // tokensymbol: tokensymbol,
          // symbol_name: symbol_name,
          strategy_name: strategy_name,
          //segment: segment,
          // strike_price: strike_price,
          // option_type: option_type,
          // expiry: expiry,
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
          panelKey: panelKey,
          entryTime: entryTime,
          exitTime: exitTime,
          notradeTime: notradeTime,
          condition_array: condition_array,
          //exch_seg:exch_seg,
          timeTradeConddition_array: timeTradeConddition_array,
          target_stoloss_array: target_stoloss_array
        }
      };

      // UPDATE STRATEGY INFORMATION
      const result = await UserMakeStrategy.updateOne(filter, update_make_strategy);

      // }


      res.send({ status: true, msg: "Update successfully!", data: [] });

    } catch (error) {
      console.log("error-", error);
      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  /// Make Startegy
  async AddMakeStartegy(req, res) {
    
   
    // let Random_key = Math.round(new Date());
    // let  suscribe =await Alice_Socket();
    
    let user_panel_key = await user.findOne().select('client_key').lean();
    let channelList = "";
    try {
       console.log("req",req.body)
       
      console.log("req time", req.body.timeTradeConddition[0].entry.time)


      for (const element of req.body.scriptArray) {

        let Strike = element.strike;
        if (element.strike == "NaN") {
          Strike = "100"
        }

        channelList += element.exch_seg + '|' + element.instrument_token + "#";

        // res.send({ status: true, msg: "successfully Add!" });
        let user_id = req.body.user_id;
        let name = req.body.name + req.body.user_id + req.body.type;
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
        let show_strategy = req.body.name;



        console.log("condition_source", condition_source)

        // Add Token token chain
      var get_token_chain = await token_chain.findOne({_id:tokensymbol})
      console.log("get_token_chain",get_token_chain)
      if(get_token_chain == null){
        console.log("token_chain 11 ")
      // const token_chain = await token_chain.insertOne({_id:tokensymbol,exch:exch_seg})
      const filter = { _id:tokensymbol  };
      const update = { $set: { _id:tokensymbol,exch:exch_seg } };
       await token_chain.updateOne(filter, update, { upsert: true });
        console.log("token_chain",token_chain)
      }


        await UserMakeStrategy.create({
          name: req.body.name + req.body.user_id + req.body.type,
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
          panelKey: panelKey,
          entryTime: entryTime,
          exitTime: exitTime,
          notradeTime: notradeTime,
          condition_array: condition_array,
          exch_seg: exch_seg,
          timeTradeConddition_array: timeTradeConddition_array,
          target_stoloss_array: target_stoloss_array,
          show_strategy: show_strategy
        })
          .then(async (createUserMakeStrategy) => {
            console.log("3")
            //res.send({ status: true, msg: "successfully Add!", data: createUserMakeStrategy });

          }).catch((err) => {
            console.log("4")
            console.error('Error creating and saving user:', err);
            return res.send({ status: false, msg: 'Strategy Name Already Exist', data: [] })

          });
      }

      var alltokenchannellist = channelList.substring(0, channelList.length - 1);
      
      // console.log("alltokenchannellist ",alltokenchannellist)
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
const marketEndTime = { hour: 23, minute: 30 };

const isMarketOpen =
  hours > marketStartTime.hour ||
  (hours === marketStartTime.hour && minutes >= marketStartTime.minute);

const isMarketClosed =
  hours > marketEndTime.hour ||
  (hours === marketEndTime.hour && minutes > marketEndTime.minute);

// if (isMarketOpen && !isMarketClosed) {
//   console.log('The stock market is open!');
// } else {
//   console.log('The stock market is closed.');
// }


const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekday = weekdays[currentDateNow.getDay()];


const Holidays = require('date-holidays');
const holidays = new Holidays();
const currentDate = new Date();
let rr = 1
//if (rr) {
async function run() {

  try {

    // Define the function to be executed
    const executeFunction = async () => {
      //  console.log("okkkkkkkk shakirrr ")
      if (!holidays.isHoliday(currentDate) && weekday != 'Sunday' && weekday != 'Saturday') {
        //  console.log('The stock market is open!');

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

            // console.log('currentTime:', currentTime);
            //  console.log('entryTime:', entryTime);
            //  console.log('exitTime:', exitTime);
            // console.log('notradeTime:', notradeTime);
            //  console.log('entryTime:', entryTime);
            // Entry Time less than No trade time OR Exit time
            if (currentTime > entryTime && entryTime < exitTime && entryTime < notradeTime) {
              // console.log('if:', entryTime, " id ", val._id, val.type)

              const currentDate = new Date();
              const milliseconds = currentDate.getTime();

              let collectionName = 'M' + val.timeframe + '_' + val.tokensymbol;
              const ExistView = await dbTradeTools.listCollections({ name: collectionName }).toArray();
              if (ExistView.length > 0) {

                const collection = dbTradeTools.collection(collectionName);
                const get_view_data = await collection.aggregate([{ $sort: { _id: -1 } }]).toArray();

               // console.log("get_view_data ", get_view_data)
                let data = {}
                if (val.condition_source != null) {
                  let condition_source = val.condition_source.split(',');
                  if (condition_source.length > 0) {
                    for (const source of condition_source) {
                      // console.log("condition_source",source)
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

                const conditiostring1 = "(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]<data.high[2]"

                // await abc(data, val.condition, val);

                try {
                  // Use eval to dynamically evaluate the condition string
                 // console.log("data -", data, "condition String - ", val.condition)
                  const condition = eval(val.condition.replace(/(\|\||&&)$/, ''));
                  console.log(" id ", val._id, " Type - ", val.type, "condition ", condition)
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
                        TradeType: "MAKE_STRATEGY",
                      }

                    }

                   // console.log("condition_check_previous_trade ", condition_check_previous_trade)

                    var checkPreviousTrade = await get_open_position_view.findOne(condition_check_previous_trade)

                    const collection_last_price = dbTradeTools.collection(val.tokensymbol);
                    const last_price = await collection_last_price.aggregate([{ $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
                    console.log("last_price",last_price[0].lp)
                  
                    let price_lp = last_price[0].lp
                    

                  //  console.log("checkPreviousTrade", checkPreviousTrade)
                    if (checkPreviousTrade != null) {
                      console.log("checkPreviousTrade ", val.symbol_name);
                      // await PreviousTradeExcuted(checkPreviousTrade,val.panelKey);

                      console.log("EXITTTTTTTTT - ", checkPreviousTrade.entry_type)
                      const currentTimestamp = Math.floor(Date.now() / 1000);
                      // DTime:1698647568|Symbol:NIFTY|TType:LE|Tr_Price:131|Price:50|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:o|Strike:19500|OType:CALL|Expiry:16112023|Strategy:TEST_1|Quntity:100|Key:SNE132023|TradeType:MT_4|Demo:demo

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


                    

                      let req = `DTime:${currentTimestamp}|Symbol:${checkPreviousTrade.symbol}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${checkPreviousTrade.segment}|Strike:${strike}|OType:${option_type}|Expiry:${checkPreviousTrade.expiry}|Strategy:${checkPreviousTrade.strategy}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:${checkPreviousTrade.TradeType}|Demo:demo`

                      console.log("req Exit -- ", req)



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
                          console.log(error);
                        });

                    }


                    // Your code for when the condition is true
                  //  console.log("Condition is true ", val._id, val.symbol_name);
                    const update = {
                      $set: {
                        status: "2",
                      },
                    };

                    const filter = { _id: val._id };
                    let Res = await UserMakeStrategy.updateOne(filter, update);
                    console.log("Res ", Res)



                    // code same trade status update
                    let Check_same_trade_type = "BUY"
                    if (val.type == "BUY") {
                      Check_same_trade_type = "SELL"
                    }

                    const Check_same_trade_data = await UserMakeStrategy.findOne({ show_strategy: val.show_strategy, type: Check_same_trade_type });
                  //  console.log("Check_same_trade_data", Check_same_trade_data)
                    if (Check_same_trade_data) {

                    //  console.log("Check_same_trade_data._id", Check_same_trade_data._id)
                      // const update1 = {
                      //   $set: {
                      //     status: "0",
                      //   },
                      // };
                      // const filter = { name: Check_same_trade_data.name};

                      let Res = await UserMakeStrategy.updateOne({ name: Check_same_trade_data.name }, {
                        $set: {
                          status: "1",
                        },
                      });


                     // console.log("Trueeeeee", Res)
                    }
                    //End code same trade status update




                    //await tradeExcuted(val);
                   // console.log(" ENTRYYYYYYY ", val.type)
                    //console.log("broker url -",process.env.BROKER_URL)

                    // let company_info =  await company_information.findOne().select('broker_url').lean();
                    //  console.log("broker url -",company_info.broker_url , "id -",val._id)

                    const currentTimestamp = Math.floor(Date.now() / 1000);
                    // DTime:1698647568|Symbol:NIFTY|TType:LE|Tr_Price:131|Price:50|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:o|Strike:19500|OType:CALL|Expiry:16112023|Strategy:TEST_1|Quntity:100|Key:SNE132023|TradeType:MT_4|Demo:demo

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

                    // console.log("target -",val.target)
                    // console.log("stoploss -",val.stoploss)
                    // console.log("exitTime -",val.exitTime)

                    const dateObject = new Date(val.exitTime);
                    const hours = ('0' + dateObject.getUTCHours()).slice(-2);
                    const minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
                    const ExitTime = `${hours}-${minutes}`;


                    let req = `DTime:${currentTimestamp}|Symbol:${val.symbol_name}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy_name}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:MAKE_STRATEGY|Target:${val.target}|StopLoss:${val.stoploss}|ExitTime:${ExitTime}|Demo:demo`

                    // console.log("req -- ",req)



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
                        console.log(error);
                      });


                  } else {
                    // Your code for when the condition is false
                    //  console.log("Condition is false ", val._id);

                  }
                } catch (error) {
                  console.error("Error in evaluating the condition:", error);
                }





              }



            } else {
              // console.log('else:', entryTime);

            }

          }
        }

      } else {
        console.log('The stock market is Closed!');
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


const abc = async (data, conditionString, val) => {

  // console.log("data - ",data)
  //  console.log("conditionString - ",conditionString)
  // (data.close[0]==246.5)||(data.low[1]==data.high[4])
  try {
    // Use eval to dynamically evaluate the condition string
    const condition = eval(conditionString.replace(/(\|\||&&)$/, ''));
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
          TradeType: "MAKE_STRATEGY",
        }

      }

      console.log("condition_check_previous_trade ", condition_check_previous_trade)

      var checkPreviousTrade = await get_open_position_view.findOne(condition_check_previous_trade)

      console.log("checkPreviousTrade", checkPreviousTrade)
      if (checkPreviousTrade != null) {
        console.log("checkPreviousTrade ", val.symbol_name);
        await PreviousTradeExcuted(checkPreviousTrade, val.panelKey);
      }
      // Your code for when the condition is true
      console.log("Condition is true ", val._id, val.symbol_name);

      const update = {
        $set: {
          status: "1",
        },
      };

      const options = { upsert: true }; // Set the upsert option to true
      const filter = { _id: val._id };
      let Res = await UserMakeStrategy.updateOne(filter, update, options);
      console.log("Res ", Res)
      await tradeExcuted(val);
    } else {
      // Your code for when the condition is false
      console.log("Condition is false ", val._id);

    }
  } catch (error) {
    console.error("Error in evaluating the condition:", error);
  }
};


const tradeExcuted = async (val) => {


  console.log(" ENTRYYYYYYY ", val.type)
  //console.log("broker url -",process.env.BROKER_URL)

  // let company_info =  await company_information.findOne().select('broker_url').lean();
  //  console.log("broker url -",company_info.broker_url , "id -",val._id)

  const currentTimestamp = Math.floor(Date.now() / 1000);
  // DTime:1698647568|Symbol:NIFTY|TType:LE|Tr_Price:131|Price:50|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:o|Strike:19500|OType:CALL|Expiry:16112023|Strategy:TEST_1|Quntity:100|Key:SNE132023|TradeType:MT_4|Demo:demo

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

  // console.log("target -",val.target)
  // console.log("stoploss -",val.stoploss)
  // console.log("exitTime -",val.exitTime)

  const dateObject = new Date(val.exitTime);
  const hours = ('0' + dateObject.getUTCHours()).slice(-2);
  const minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
  const ExitTime = `${hours}-${minutes}`;


  let req = `DTime:${currentTimestamp}|Symbol:${val.symbol_name}|TType:${type}|Tr_Price:131|Price:${price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy_name}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:MAKE_STRATEGY|Target:${val.target}|StopLoss:${val.stoploss}|ExitTime:${ExitTime}|Demo:demo`

  // console.log("req -- ",req)



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
      console.log(error);
    });


}


const PreviousTradeExcuted = async (val, panelKey) => {

  console.log("EXITTTTTTTTT - ", val.entry_type)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  // DTime:1698647568|Symbol:NIFTY|TType:LE|Tr_Price:131|Price:50|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:o|Strike:19500|OType:CALL|Expiry:16112023|Strategy:TEST_1|Quntity:100|Key:SNE132023|TradeType:MT_4|Demo:demo

  let type = "LX";
  let price = val.stockInfo_bp1;
  if (val.entry_type.toUpperCase() == "SE") {
    type = "SX";
    price = val.stockInfo_sp1;
  }


  let strike = val.strike;
  if (val.strike_price == "NaN") {
    strike = "100"
  }


  let option_type = "CALL"
  if (val.option_type.toUpperCase() == "PUT") {
    option_type = "PUT"
  }


  let Quntity = val.entry_qty_percent;






  let req = `DTime:${currentTimestamp}|Symbol:${val.symbol}|TType:${type}|Tr_Price:131|Price:${price}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy}|Quntity:${Quntity}|Key:${panelKey}|TradeType:${val.TradeType}|Demo:demo`

  console.log("req Exit -- ", req)



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
      console.log(error);
    });
}


run().catch(console.error);




// =================OPEN POSITION ==============================


const exitOpentrade = async () => {
try {
  const viewName = 'open_position_excute';


  var openPosition = await db_GET_VIEW.collection(viewName).find().toArray();


  if (openPosition.length > 0) {
    let panelKey = "SNE132023";
    openPosition && openPosition.map((item) => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      let req = `DTime:${currentTimestamp}|Symbol:${item.symbol}|TType:${item.entry_type == "SE" ? "SX" : "LX"}|Tr_Price:131|Price:${item.stockInfo_bp1}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${item.segment}|Strike:${item.strike}|OType:${item.option_type}|Expiry:${item.expiry}|Strategy:${item.strategy}|Quntity:${item.entry_qty_percent}|Key:${panelKey}|TradeType:${item.TradeType}|Demo:demo`
      console.log(req);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://trade.pandpinfotech.com/signal/broker-signals',
        // url: `${process.env.BROKER_URL}`,
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
          console.log(error.response.data);
        });


    })

  } 
} catch (error) {
  console.log("Error in Open Position",error);
}
 


}



// setInterval(() => {
//   exitOpentrade()
// }, 10000);


module.exports = new MakeStartegy();