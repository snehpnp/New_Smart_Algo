"use strict";
const db = require('../../Models');
const mongoose = require('mongoose');
const { format } = require('date-fns');
// const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const ObjectId = mongoose.Types.ObjectId;
const timeFrame = db.timeFrame
const source = db.source
const comparators = db.comparators
const UserMakeStrategy = db.UserMakeStrategy;
const live_price = db.live_price;
const company_information = db.company_information;
const user = db.user;
const token_chain = db.token_chain;
const get_open_position_view = db.open_position;
const open_position_excute = db.open_position_excute;
const dbTradeTools = db.dbTest;
const dbTest = db.dbTest;





const { Alice_Socket, getSocket, updateChannelAndSend } = require('../../Helper/Alice_Socket');

const { Socket_data } = require('../../Helper/Socket_data');

const { getIO } = require('../../Helper/BackendSocketIo');


// const uri = process.env.MONGO_URI
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// const dbTradeTools = client.db(process.env.DB_TRADETOOLS);
// const db_GET_VIEW = client.db(process.env.DB_NAME);
// const get_open_position_view = db_GET_VIEW.collection('open_position');
// const token_chain = db_GET_VIEW.collection('token_chain');

class MakeStartegy {

  async getcandledata(req, res) {

    let timeFrame = req.body.timeframe;
    let tokensymbol = req.body.tokensymbol;
    let collectionName = 'M' + timeFrame + '_' + tokensymbol;

    try {

      const collections = await dbTradeTools.listCollections().toArray();
      const collectionExists = collections.some(coll => coll.name === collectionName);

      if (collectionExists) {
        const collection = dbTradeTools.collection(collectionName);

        const result = await collection.find({}).sort({ _id: -1 }).limit(30).toArray();

        const transformedData = result.map(item => ({
          x: new Date(new Date(item._id).getTime() / 1000),
          y: [item.open, item.high, item.low, item.close],
        }));


        if (result.length > 0) {
          return res.send({ status: true, msg: "Get All time frame", data: transformedData })
        } else {
          return res.send({ status: false, msg: "Empty data", data: [] })
        }


      } else {
        return res.send({ status: false, msg: "Empty data", data: [] })
      }

    } catch (e) {
      return res.send({ status: false, msg: "Empty data", data: [] })
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
        
        {
            $group: {
                _id: "$show_strategy", // Group by show_strategy
                firstDocument: { $first: "$$ROOT" }, // Get the first document in each group
                secondDocument: { $push: "$$ROOT" } // Collect all documents in this group
            }
        },
        {
            $project: {
                _id: "$firstDocument._id",
                user_id: "$firstDocument.user_id",
                name: "$firstDocument.name",
                tokensymbol: "$firstDocument.tokensymbol",
                show_strategy: "$firstDocument.show_strategy",
                symbol_name: "$firstDocument.symbol_name",
                strategy_name: "$firstDocument.strategy_name",
                segment: "$firstDocument.segment",
                strike_price: "$firstDocument.strike_price",
                option_type: "$firstDocument.option_type",
                expiry: "$firstDocument.expiry",
                indicator: "$firstDocument.indicator",
                timeframe: "$firstDocument.timeframe",
                price_source: "$firstDocument.price_source",
                period: "$firstDocument.period",
                inside_indicator: "$firstDocument.inside_indicator",
                condition: "$firstDocument.condition",
                exch_seg: "$firstDocument.exch_seg",
                condition_source: "$firstDocument.condition_source",
                buffer_value: "$firstDocument.buffer_value",
                type: { $arrayElemAt: ["$secondDocument.type", 0] }, // Get the type of the first document
                _id_secondObject: { $arrayElemAt: ["$secondDocument._id", 1] }, // Get the _id of the second document if it exists
                type_secondObject: { $arrayElemAt: ["$secondDocument.type", 1] }, // Get the type of the second document if it exists
                createdAt: "$firstDocument.createdAt",
                updatedAt: "$firstDocument.updatedAt",
            }
        },

        { $sort: { _id: -1 } }
      ];

      const result = await UserMakeStrategy.aggregate(pipeline)
      if (result.length > 0) {
        console.log("result ", result)
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

      const { _id, timeframe, tokensymbol, name, show_strategy, type } = req.body.data;
      const objectId = new ObjectId(_id);
      const exist_view = `M${timeframe}_${tokensymbol}_make_${name}`;

      let checkType = "BUY"
      if (type == "BUY") {
        checkType = "SELL"
      }

      const matchNameStartegy = await UserMakeStrategy.findOne({ type: checkType, show_strategy: show_strategy });

      try {
        const collectionExists = await dbTest.listCollections({ name: exist_view }).hasNext();
        if (collectionExists) {
          await dbTest.collection(exist_view).drop();
        }
      } catch (error) {
      }

      if (matchNameStartegy != null) {
        const matchNameStartegy_exist_view = `M${matchNameStartegy.timeframe}_${matchNameStartegy.tokensymbol}_make_${matchNameStartegy.name}`;
        try {
          const collectionExists = await dbTest.listCollections({ name: matchNameStartegy_exist_view }).hasNext();
          if (collectionExists) {
            await dbTest.collection(matchNameStartegy_exist_view).drop();
          }
        } catch (error) {
        }
        await UserMakeStrategy.deleteOne({ name: matchNameStartegy.name });
      }

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
    let channelList = "";
    try {

      let strategy_name = req.body.strategy_name;

      let timeframe = req.body.timeframe;
      let tokensymbol = req.body.tokensymbol;
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
      const filter_number_of_trade = { show_strategy: req.body.show_strategy };
      const update_make_strategy_number_of_trade = {
        $set: {
          numberOfTrade: req.body.numberOfTrade,
          maxProfit: req.body.maxProfit,
          maxLoss: req.body.maxLoss
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

      let arraySource = []

      condition_array.forEach(async (condition) => {
        ['first_element', 'second_element'].forEach(async (element) => {
          if (condition[element].source !== 'close' && condition[element].source !== 'open' && condition[element].source !== 'high' && condition[element].source !== 'low' && condition[element].source !== 'number') {


            if (!arraySource.includes(condition[element].source)) {
              arraySource.push(condition[element].source)
            }


            let viewName = condition[element].source + '_M' + timeframe + '_' + tokensymbol;
            let collectionViewName = 'M' + timeframe + '_' + tokensymbol;
            let expMovingAvg = { input: "$" + condition[element].indicator_field, N: parseInt(condition[element].period) }; // Convert period to integer

            const pipelineIndicatorView = [
              { $sort: { _id: -1 } }, // Sorting to get the latest prices first
              // { $limit: 2 },         // Limiting to the period (adjust this based on your period)
              {
                $setWindowFields: {   // Window function to calculate EMA
                  sortBy: { _id: 1 },
                  output: {
                    ema: {
                      $expMovingAvg: { input: expMovingAvg.input, N: expMovingAvg.N }  // Adjust N based on your period
                    }
                  }
                }
              },
              { $project: { ema: 1, _id: 1 } } // Projecting only the ema field, excluding _id
            ];

            try {
              const collections = await dbTradeTools.listCollections().toArray();
              const collectionExists = collections.some(coll => coll.name === viewName);

              if (!collectionExists) {
                await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionViewName,
                  pipeline: pipelineIndicatorView
                });
                console.log(`View ${viewName} created successfully`);
              } else {
                console.log(`View ${viewName} already exists`);
              }
            } catch (error) {
              console.log(`Error creating view ${viewName}:`, error);
            }



          }
        });
      });

      let collectionViewName = "usermakestrategies"
      if (arraySource.length > 0) {

        let timeFrameView = 'M' + req.body.timeframe + '_' + req.body.tokensymbol
        let pipeline = [];

        const conditions = await parseConditionString(req.body.condition);

        const matchStage = await generateMongoCondition(conditions);
        console.log("req.body.status ", req.body.status);
        console.log("req.body.timeframe ", req.body.timeframe);
        console.log("req.body.tokensymbol ", req.body.tokensymbol);
        console.log("req.body.name ", req.body.name);
        console.log("req.body.condition ", req.body.condition);


        pipeline.push({
          $match: {
            status: '1',
            timeframe: req.body.timeframe,
            tokensymbol: req.body.tokensymbol,
            name: req.body.name,
          }
        });

        pipeline.push({
          $lookup: {
            from: timeFrameView,
            pipeline: [
              {
                $sort: { _id: -1 }
              }
            ],
            as: "timeFrameViewData"
          }
        });

        arraySource.forEach(async (source) => {
          pipeline.push({
            $lookup: {
              from: source + '_M' + req.body.timeframe + '_' + req.body.tokensymbol,
              pipeline: [
                {
                  $sort: { _id: -1 }
                }
              ],
              as: source + 'Data'
            }
          });
        });


        pipeline.push({
          $addFields: {
            isCondition: matchStage
          }
        });


        let viewName = 'M' + req.body.timeframe + '_' + req.body.tokensymbol + '_make_' + req.body.name;

        let ExistviewName = 'M' + req.body.existtimeframe + '_' + req.body.tokensymbol + '_make_' + req.body.name;

        try {

          await dbTest.collection(ExistviewName).drop();
          const collections = await dbTest.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === viewName);

          if (!collectionExists) {
            await dbTest.createCollection(viewName, {
              viewOn: collectionViewName,
              pipeline: pipeline
            });
            console.log(`View ${viewName} created successfully`);
          } else {
            console.log(`View ${viewName} already exists`);
          }
        } catch (error) {
          console.log(`Error creating view ${viewName}:`, error);
        }

      } else {

        const conditions = await parseConditionString(req.body.condition);

        const matchStage = await generateMongoCondition(conditions);

        let timeFrameView = 'M' + req.body.timeframe + '_' + req.body.tokensymbol
        let pipeline = [];

        pipeline.push({
          $match: {
            status: '1',
            timeframe: req.body.timeframe,
            tokensymbol: req.body.tokensymbol,
            name: req.body.name,
          }
        });

        pipeline.push({
          $lookup: {
            from: timeFrameView,
            pipeline: [
              {
                $sort: { _id: -1 }
              }
            ],
            as: "timeFrameViewData"
          }
        });

        pipeline.push({
          $addFields: {
            isCondition: matchStage
          }
        });

        let viewName = 'M' + req.body.timeframe + '_' + req.body.tokensymbol + '_make_' + req.body.name;

        let ExistviewName = 'M' + req.body.existtimeframe + '_' + req.body.tokensymbol + '_make_' + req.body.name;

        try {
          await dbTest.collection(ExistviewName).drop();
          const collections = await dbTest.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === viewName);

          if (!collectionExists) {
            await dbTest.createCollection(viewName, {
              viewOn: collectionViewName,
              pipeline: pipeline
            });
            console.log(`View ${viewName} created successfully`);
          } else {
            console.log(`View ${viewName} already exists`);
          }
        } catch (error) {
          console.log(`Error creating view ${viewName}:`, error);
        }
      }

      // }


      return res.send({ status: true, msg: "Update successfully!", data: [] });

    } catch (error) {

      res.status(500).send({ status: false, msg: "Internal server error" });
    }
  }

  /// Make Startegy
  async AddMakeStartegy(req, res) {

    var _id = new ObjectId(req.body.user_id);

    let user_panel_key = await user.findOne({ _id: _id }).select('client_key').lean();
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
        var get_token_chain = await token_chain.findOne({ _id: tokensymbol })

        if (get_token_chain == null) {

          // const token_chain = await token_chain.insertOne({_id:tokensymbol,exch:exch_seg})
          const filter = { _id: tokensymbol };
          const update = { $set: { _id: tokensymbol, exch: exch_seg } };
          await token_chain.updateOne(filter, update, { upsert: true });

        }

        var alltokenchannellist = channelList.substring(0, channelList.length - 1);
        updateChannelAndSend(alltokenchannellist)


        await UserMakeStrategy.create({
          name: req.body.name + req.body.user_id + req.body.type + tokensymbol,

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
          show_strategy: req.body.name + '_' + tokensymbol,
          numberOfTrade: numberOfTrade,
          maxProfit: maxProfit,
          maxLoss: maxLoss
        })
          .then(async (createUserMakeStrategy) => {
            console.log("createUserMakeStrategy ", createUserMakeStrategy)

            //console.log('condition_array:', condition_array);

            let arraySource = []
            await condition_array.forEach(async (condition) => {
              ['first_element', 'second_element'].forEach(async (element) => {
                if (condition[element].source !== 'close' && condition[element].source !== 'open' && condition[element].source !== 'high' && condition[element].source !== 'low' && condition[element].source !== 'number') {

                  if (!arraySource.includes(condition[element].source)) {
                    arraySource.push(condition[element].source)
                  }

                  // console.log(`Working on timeframe: ${timeframe}`);
                  // console.log(`Working on tokensymbol: ${tokensymbol}`);
                  // console.log(`Working on source: ${condition[element].source}`);
                  // console.log(`Working on offset: ${condition[element].offset}`);
                  // console.log(`Working on indicator_field: ${condition[element].indicator_field}`);
                  // console.log(`Working on period: ${condition[element].period}`);

                  let viewName = condition[element].source + '_M' + timeframe + '_' + tokensymbol;
                  let collectionViewName = 'M' + timeframe + '_' + tokensymbol;
                  let expMovingAvg = { input: "$" + condition[element].indicator_field, N: parseInt(condition[element].period) }; // Convert period to integer

                  const pipelineIndicatorView = [
                    { $sort: { _id: -1 } }, // Sorting to get the latest prices first
                    // { $limit: 2 },         // Limiting to the period (adjust this based on your period)
                    {
                      $setWindowFields: {   // Window function to calculate EMA
                        sortBy: { _id: 1 },
                        output: {
                          ema: {
                            $expMovingAvg: { input: expMovingAvg.input, N: expMovingAvg.N }  // Adjust N based on your period
                          }
                        }
                      }
                    },
                    { $project: { ema: 1, _id: 1 } } // Projecting only the ema field, excluding _id
                  ];

                  try {
                    const collections = await dbTradeTools.listCollections().toArray();
                    const collectionExists = collections.some(coll => coll.name === viewName);

                    if (!collectionExists) {
                      await dbTradeTools.createCollection(viewName, {
                        viewOn: collectionViewName,
                        pipeline: pipelineIndicatorView
                      });
                      console.log(`View ${viewName} created successfully`);
                    } else {
                      console.log(`View ${viewName} already exists`);
                    }
                  } catch (error) {
                    console.log(`Error creating view ${viewName}:`, error);
                  }



                }
              });
            });
            let collectionViewName = "usermakestrategies"

            if (arraySource.length > 0) {

              let timeFrameView = 'M' + createUserMakeStrategy.timeframe + '_' + createUserMakeStrategy.tokensymbol
              let pipeline = [];

              const conditions = await parseConditionString(createUserMakeStrategy.condition);
              const matchStage = await generateMongoCondition(conditions);

              pipeline.push({
                $match: {
                  status: createUserMakeStrategy.status,
                  timeframe: createUserMakeStrategy.timeframe,
                  tokensymbol: createUserMakeStrategy.tokensymbol,
                  name: createUserMakeStrategy.name,
                }
              });

              pipeline.push({
                $lookup: {
                  from: timeFrameView,
                  pipeline: [
                    {
                      $sort: { _id: -1 }
                    }
                  ],
                  as: "timeFrameViewData"
                }
              });

              arraySource.forEach(async (source) => {
                pipeline.push({
                  $lookup: {
                    from: source + '_M' + createUserMakeStrategy.timeframe + '_' + createUserMakeStrategy.tokensymbol,
                    pipeline: [
                      {
                        $sort: { _id: -1 }
                      }
                    ],
                    as: source + 'Data'
                  }
                });
              });


              // pipeline.push({
              //   $addFields: {
              //     isCondition: matchStage
              //   }
              // });

              pipeline.push({
                $addFields: {
                  isCondition: {
                    $cond: {
                      if: {
                        $eq: [
                          { $size: { $ifNull: ["$" + arraySource[0] + "Data", []] } },  // Check size of dynamic source + 'Data'
                          0
                        ]
                      },
                      then: false,  // If it's empty, set isCondition to false
                      else: matchStage  // Otherwise, use matchStage as isCondition
                    }
                  }
                }
              });


              let viewName = 'M' + createUserMakeStrategy.timeframe + '_' + createUserMakeStrategy.tokensymbol + '_make_' + createUserMakeStrategy.name;

              try {
                const collections = await dbTest.listCollections().toArray();
                const collectionExists = collections.some(coll => coll.name === viewName);

                if (!collectionExists) {
                  await dbTest.createCollection(viewName, {
                    viewOn: collectionViewName,
                    pipeline: pipeline
                  });
                  console.log(`View ${viewName} created successfully`);
                } else {
                  console.log(`View ${viewName} already exists`);
                }
              } catch (error) {
                console.log(`Error creating view ${viewName}:`, error);
              }

            } else {

              const conditions = await parseConditionString(createUserMakeStrategy.condition);

              const matchStage = await generateMongoCondition(conditions);

              let timeFrameView = 'M' + createUserMakeStrategy.timeframe + '_' + createUserMakeStrategy.tokensymbol
              let pipeline = [];

              pipeline.push({
                $match: {
                  status: createUserMakeStrategy.status,
                  timeframe: createUserMakeStrategy.timeframe,
                  tokensymbol: createUserMakeStrategy.tokensymbol,
                  name: createUserMakeStrategy.name,
                }
              });

              pipeline.push({
                $lookup: {
                  from: timeFrameView,
                  pipeline: [
                    {
                      $sort: { _id: -1 }
                    }
                  ],
                  as: "timeFrameViewData"
                }
              });

              // pipeline.push({
              //   $addFields: {
              //     isCondition: matchStage
              //   }
              // });

              pipeline.push({
                $addFields: {
                  isCondition: {
                    $cond: {
                      if: { $eq: [{ $size: "$timeFrameViewData" }, 0] },  // Check if timeFrameViewData is empty
                      then: false,  // If it's empty, set isCondition to false
                      else: matchStage  // Otherwise, use matchStage (the original condition)
                    }
                  }
                }
              });


              let viewName = 'M' + createUserMakeStrategy.timeframe + '_' + createUserMakeStrategy.tokensymbol + '_make_' + createUserMakeStrategy.name;

              try {
                const collections = await dbTest.listCollections().toArray();
                const collectionExists = collections.some(coll => coll.name === viewName);

                if (!collectionExists) {
                  await dbTest.createCollection(viewName, {
                    viewOn: collectionViewName,
                    pipeline: pipeline
                  });
                  console.log(`View ${viewName} created successfully`);
                } else {
                  console.log(`View ${viewName} already exists`);
                }
              } catch (error) {
                console.log(`Error creating view ${viewName}:`, error);
              }
            }
            //res.send({ status: true, msg: "successfully Add!", data: createUserMakeStrategy });

          }).catch((err) => {

            console.log('Error creating and saving user:', err);
            return res.send({ status: false, msg: 'Strategy Name Already Exist', data: [] })

          });
      }


      res.send({ status: true, msg: "successfully Add!", data: [] });
    } catch (e) {
    }
  }

}



async function parseConditionString(conditionString) {

  const conditionRegex = /data\.(\w+)\[(\d+)\]([><=]{1,2})data\.(\w+)\[(\d+)\]/g;
  const conditions = [];
  let andFlag = false;

  // Handle the && and || parts
  const andParts = conditionString.split('&&');
  andParts.forEach(part => {
    const orParts = part.split('||');
    orParts.forEach((subPart, index) => {
      let match;
      while ((match = conditionRegex.exec(subPart)) !== null) {
        const [_, field1, index1, operator, field2, index2] = match;
        conditions.push({
          operator: operator.length === 2 ? operator : operator + '=', // Normalize operator
          field1,
          index1: parseInt(index1),
          field2,
          index2: parseInt(index2),
          type: index === 0 && andFlag ? 'and' : 'or'
        });
      }
    });
    andFlag = true;
  });

  return conditions;
}

const generateMongoCondition = async (conditions) => {
  const andArray = [];
  let orArray = [];

  conditions.forEach(condition => {
    const { operator, field1, index1, field2, index2, type } = condition;
    // const mongoOperator = operator === '>' ? '$gt' : '$lt';

    let mongoOperator;
    switch (operator) {
      case '>':
        mongoOperator = '$gt';
        break;
      case '<':
        mongoOperator = '$lt';
        break;
      case '>=':
        mongoOperator = '$gte';
        break;
      case '<=':
        mongoOperator = '$lte';
        break;
      case '==': // Handle equality operator
      case '===': // Handle strict equality operator
        mongoOperator = '$eq';
        break;
      default:
        mongoOperator = '$lt'; // Default to less than
        break;
    }




    // let condition_one
    // ['close','open','high','low','number'].includes(field1) ?
    // condition_one = { $arrayElemAt: [`$timeFrameViewData.${field1}`, index1] }
    // :condition_one = { $arrayElemAt: [`$${field1}Data.${field1}`, index1] }


    // let condition_two
    // ['close','open','high','low','number'].includes(field2) ?
    // condition_two =  { $arrayElemAt: [`$timeFrameViewData.${field2}`, index2] }
    // :condition_two =  { $arrayElemAt: [`$${field2}Data.${field2}`, index2] }


    let condition_one
    ['close', 'open', 'high', 'low', 'number'].includes(field1) ?
      condition_one = { $arrayElemAt: [`$timeFrameViewData.${field1}`, index1] }
      : condition_one = { $arrayElemAt: [`$${field1}Data.ema`, index1] }


    let condition_two
    ['close', 'open', 'high', 'low', 'number'].includes(field2) ?
      condition_two = { $arrayElemAt: [`$timeFrameViewData.${field2}`, index2] }
      : condition_two = { $arrayElemAt: [`$${field2}Data.ema`, index2] }


    // const conditionObj = {
    //     [mongoOperator]: [
    //         { $arrayElemAt: [`$timeFrameViewData.${field1}`, index1] },
    //         { $arrayElemAt: [`$timeFrameViewData.${field2}`, index2] }
    //     ]
    // };

    const conditionObj = {
      [mongoOperator]: [
        condition_one,
        condition_two
      ]
    };

    console.log("conditionObj ", conditionObj)

    // if (type === 'and') {
    //     andArray.push(conditionObj);
    // } else if (type === 'or') {
    //     orArray.push(conditionObj);
    // }

    if (type === 'and') {
      if (orArray.length > 0) {
        andArray.push({ $or: orArray });
        orArray = []; // Reset orArray after adding it to andArray
      }
      andArray.push(conditionObj);
    } else if (type === 'or') {
      orArray.push(conditionObj);
    }

  });

  //     const finalExpr = {};
  //     if (andArray.length > 0) {
  //         finalExpr.$and = andArray;
  //     }
  //     if (orArray.length > 0) {
  //         finalExpr.$or = orArray;
  //     }

  //   //  return { $cond: finalExpr };
  //     return {
  //         $cond: {
  //             if: finalExpr,
  //             then: true,
  //             else: false
  //         }
  //     };



  console.log("andArray ", andArray)
  console.log("orArray ", orArray)
  const finalExpr = {};
  if (andArray.length > 0 && orArray.length > 0) {
    finalExpr.$and = andArray;
    finalExpr.$or = orArray;
  } else if (andArray.length > 0) {
    finalExpr.$and = andArray;
  } else if (orArray.length > 0) {
    finalExpr.$or = orArray;
  }

  return {
    $cond: {
      if: finalExpr,
      then: true,
      else: false
    }
  };


};




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



// async function run() {


//   try {

//     // Define the function to be executed
//     const executeFunction = async () => {
//       console.log("DONEEE executeFunction")
//       const data = await dbTest.collection('strategyViewNames').find({ }).toArray();
//        fetchDataFromViews(data);

//     };

//     const exitOpentrade = async () => {
//       //console.log("DONEEE exitOpentrade")
//       if (weekday != 'Sunday' && weekday != 'Saturday') {
//         try {

//           var openPosition = await open_position_excute.find().toArray();
//           // console.log("openPosition ",openPosition)
//           if (openPosition.length > 0) {

//             openPosition && openPosition.map((item) => {

//               let ExitStatus = 'TS'
//               if (item.isLpInRangeTarget == true) {
//                 ExitStatus = "TARGET"
//               } else if (item.isLpInRangeStoploss == true) {
//                 ExitStatus = "STOPLOSS"
//               } else if (item.isLpInRange == 1) {
//                 ExitStatus = "EXIT TIME"
//               }
//               else if (item.isLpInRange == 0) {
//                 ExitStatus = "EXIT TIME"
//               }

//               const currentTimestamp = Math.floor(Date.now() / 1000);
//               let req = `DTime:${currentTimestamp}|Symbol:${item.symbol}|TType:${item.entry_type == "SE" ? "SX" : "LX"}|Tr_Price:131|Price:${item.stockInfo_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${item.segment}|Strike:${item.strike}|OType:${item.option_type}|Expiry:${item.expiry}|Strategy:${item.strategy}|Quntity:${item.entry_qty_percent}|Key:${item.client_persnal_key}|TradeType:${item.TradeType}|ExitStatus:${ExitStatus}|Demo:demo`




//               //console.log("req ",req)

//               //console.log("process.env.BROKER_URL ",process.env.BROKER_URL)

//               let config = {
//                 method: 'post',
//                 maxBodyLength: Infinity,
//                 // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
//                 url: `${process.env.BROKER_URL}`,
//                 headers: {
//                   'Content-Type': 'text/plain'
//                 },
//                 data: req
//               };

//               axios.request(config)
//                 .then(async (response) => {

//                   let tradeSymbol;
//                   if (item.segment.toLowerCase() == 'o' || item.segment.toLowerCase() == 'co' || item.segment.toLowerCase() == 'fo' || item.segment.toLowerCase() == 'mo') {
//                     tradeSymbol = item.symbol + "  " + item.expiry + "  " + item.strike + "  " + item.option_type + "  " + " [ " + item.segment + " ] ";
//                   }
//                   else if (item.segment.toLowerCase() == 'f' || item.segment.toLowerCase() == 'cf' || item.segment.toLowerCase() == 'mf') {
//                     tradeSymbol = item.symbol + "  " + item.expiry + "  " + " [ " + item.segment + " ] ";
//                   }
//                   else {
//                     tradeSymbol = item.symbol + "  " + " [ " + item.segment + " ] ";
//                   }
//                   const io = await getIO();
//                   io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: tradeSymbol });

//                   console.log("response Trade Excuted - ", response.data)

//                 })
//                 .catch((error) => {
//                   // console.log(error.response.data);
//                 });


//             })

//           } else {
//             return
//           }
//         } catch (error) {
//           console.log("Error in Open Position", error);
//         }

//       } else {
//         //console.log('The stock market is Closed!');
//       }



//     }


//     // Run the function initially
//     // await executeFunction();

//     // Use a while loop with setTimeout for a delay
//     while (true) {
//       // Delay for 1000 milliseconds (1 second)
//       await new Promise(resolve => setTimeout(resolve, 1000));
//        await executeFunction();
//       //await exitOpentrade()
//     }

//     // setInterval(async () => {
//     //   await executeFunction();
//     // }, 1000);

//   } finally {
//     // Close the client when you're done
//   }

// }

async function run() {
  try {
    // Define the function to be executed
    const executeFunction = async () => {
      // console.log("DONEEE executeFunction");
      const data = await dbTest.collection('strategyViewNames').find({}).toArray();
      await fetchDataFromViews(data);
    };

    const exitOpentrade = async () => {
      //   console.log("DONEEE exitOpentrade")


      if (weekday != 'Sunday' && weekday != 'Saturday') {
        try {

          var openPosition = await open_position_excute.find().toArray();
          // console.log("openPosition ",openPosition)
          if (openPosition.length > 0) {

            openPosition && openPosition.map((item) => {

              let ExitStatus = 'TS'
              if (item.isLpInRangeTarget == true) {
                ExitStatus = "TARGET"
              } else if (item.isLpInRangeStoploss == true) {
                ExitStatus = "STOPLOSS"
              } else if (item.isLpInRange == 1) {
                ExitStatus = "EXIT TIME"
              }
              else if (item.isLpInRange == 0) {
                ExitStatus = "EXIT TIME"
              }

              const currentTimestamp = Math.floor(Date.now() / 1000);
              let req = `DTime:${currentTimestamp}|Symbol:${item.symbol}|TType:${item.entry_type == "SE" ? "SX" : "LX"}|Tr_Price:131|Price:${item.stockInfo_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${item.segment}|Strike:${item.strike}|OType:${item.option_type}|Expiry:${item.expiry}|Strategy:${item.strategy}|Quntity:${item.entry_qty_percent}|Key:${item.client_persnal_key}|TradeType:${item.TradeType}|ExitStatus:${ExitStatus}|Demo:demo`




              //console.log("req ",req)

              //console.log("process.env.BROKER_URL ",process.env.BROKER_URL)

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
                .then(async (response) => {

                  let tradeSymbol;
                  if (item.segment.toLowerCase() == 'o' || item.segment.toLowerCase() == 'co' || item.segment.toLowerCase() == 'fo' || item.segment.toLowerCase() == 'mo') {
                    tradeSymbol = item.symbol + "  " + item.expiry + "  " + item.strike + "  " + item.option_type + "  " + " [ " + item.segment + " ] ";
                  }
                  else if (item.segment.toLowerCase() == 'f' || item.segment.toLowerCase() == 'cf' || item.segment.toLowerCase() == 'mf') {
                    tradeSymbol = item.symbol + "  " + item.expiry + "  " + " [ " + item.segment + " ] ";
                  }
                  else {
                    tradeSymbol = item.symbol + "  " + " [ " + item.segment + " ] ";
                  }
                  const io = await getIO();
                  io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: tradeSymbol });

                  console.log("response Trade Excuted - ", response.data)

                })
                .catch((error) => {
                  // console.log(error.response.data);
                });


            })

          } else {
            return
          }
        } catch (error) {
          console.log("Error in Open Position", error);
        }

      } else {
        //console.log('The stock market is Closed!');
      }



    }

    // Array to keep track of ongoing operations
    let ongoingOperations = [];

    // while (true) {
    //   // Delay for 1000 milliseconds (1 second)
    //   await new Promise(resolve => setTimeout(resolve, 1000));

    //   // Schedule the execution of the function
    //  // const operation = executeFunction().catch(console.error);
    //   const operation = exitOpentrade().catch(console.error);


    //   // Store the ongoing operation
    //   ongoingOperations.push(operation);

    //   // Clean up finished operations to prevent memory leaks
    //   ongoingOperations = ongoingOperations.filter(p => !p.isSettled);

    //   // Mark completed operations
    //   Promise.allSettled(ongoingOperations).then(results => {
    //     results.forEach((result, index) => {
    //       if (result.status === "fulfilled" || result.status === "rejected") {
    //         ongoingOperations[index].isSettled = true;
    //       }
    //     });
    //   });
    // }

    while (true) {
      // Delay for 1000 milliseconds (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // await executeFunction();

      // Open Position Function Evey Second
      const indiaTimezoneOffset = 330;
      const currentTimeInMinutes = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + indiaTimezoneOffset;
      const currentHour = Math.floor(currentTimeInMinutes / 60) % 24;
      const currentMinute = currentTimeInMinutes % 60;
      // if (currentHour >= 9 && currentMinute >= 14 && currentHour <= 15 && currentMinute <= 31) {
      await exitOpentrade()
      // }

    }


  } catch (error) {
    console.log(error);
  }
}



run().catch(console.log);



async function fetchDataFromViews(viewNames) {
  // console.log("viewNames - ", viewNames.length)
  try {
    if (viewNames.length > 0) {
      for (let valView of viewNames) {
        // const data = await dbTest.collection(valView.viewName).find({ isCondition: true }).toArray();
        const data = await dbTest.collection(valView.viewName).find({
          isCondition: true,
          timeFrameViewData: { $ne: null, $ne: [] }
        }).toArray();

        //console.log(`Data from view ${valView.viewName}:`, data);
        if (data.length > 0) {
          //console.log(`Data from view ${valView.viewName}:`, data);
          let val = data[0];

          const date = new Date(val.expiry);
          val.expiry = format(date, 'ddMMyyyy');

          let entry_type = 'LE';
          if (val.type === 'BUY') {
            entry_type = 'SE';
          }
          let condition_check_previous_trade = {
            strategy: val.strategy_name,
            symbol: val.symbol_name,
            entry_type: entry_type,
            segment: val.segment,
            client_persnal_key: val.panelKey,
            MakeStartegyName: val.show_strategy,
            TradeType: 'MAKE_STRATEGY',
          };
          if (['O', 'FO', 'MO', 'CO'].includes(val.segment.toUpperCase())) {
            let option_type = 'CALL';
            if (val.option_type === 'PE') {
              option_type = 'PUT';
            }
            condition_check_previous_trade = {
              strategy: val.strategy_name,
              symbol: val.symbol_name,
              entry_type: entry_type,
              segment: val.segment,
              strike: val.strike_price,
              option_type: option_type,
              expiry: val.expiry,
              client_persnal_key: val.panelKey,
              MakeStartegyName: val.show_strategy,
              TradeType: 'MAKE_STRATEGY',
            };
          }
          else if (['F', 'MF', 'CF'].includes(val.segment.toUpperCase())) {
            condition_check_previous_trade = {
              strategy: val.strategy_name,
              symbol: val.symbol_name,
              entry_type: entry_type,
              segment: val.segment,
              expiry: val.expiry,
              client_persnal_key: val.panelKey,
              MakeStartegyName: val.show_strategy,
              TradeType: 'MAKE_STRATEGY',
            };
          }

          // console.log("condition_check_previous_trade",condition_check_previous_trade)
          var checkPreviousTrade = await get_open_position_view.findOne(condition_check_previous_trade);

          // console.log("checkPreviousTrade ",checkPreviousTrade)

          const collection_last_price = dbTest.collection(val.tokensymbol);
          const last_price = await collection_last_price.aggregate([{ $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
          let price_lp = last_price[0].lp;
          if (checkPreviousTrade != null) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            let type = 'LX';
            let price = checkPreviousTrade.stockInfo_bp1;
            if (checkPreviousTrade.entry_type.toUpperCase() === 'SE') {
              type = 'SX';
              price = checkPreviousTrade.stockInfo_sp1;
            }
            let strike = checkPreviousTrade.strike;
            if (checkPreviousTrade.strike_price === 'NaN') {
              strike = '100';
            }
            let option_type = 'CALL';
            if (checkPreviousTrade.option_type.toUpperCase() === 'PUT') {
              option_type = 'PUT';
            }
            let Quntity = checkPreviousTrade.entry_qty_percent;
            let req = `DTime:${currentTimestamp}|Symbol:${checkPreviousTrade.symbol}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${checkPreviousTrade.segment}|Strike:${strike}|OType:${option_type}|Expiry:${checkPreviousTrade.expiry}|Strategy:${checkPreviousTrade.strategy}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:${checkPreviousTrade.TradeType}|MakeStartegyName:${val.show_strategy}|Demo:demo`;
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

              })
              .catch((error) => {
                console.log('Error ', error);
              });
          }
          const update = {
            $set: {
              status: '2',
            },
            $inc: {
              numberOfTrade_count_trade: 1, // Increment by 1, you can change this value based on your requirement
            },
          };
          const filter = { _id: val._id };
          let Res = await UserMakeStrategy.updateOne(filter, update);
          let Check_same_trade_type = 'BUY';
          if (val.type === 'BUY') {
            Check_same_trade_type = 'SELL';
          }
          const Check_same_trade_data = await UserMakeStrategy.findOne({ show_strategy: val.show_strategy, type: Check_same_trade_type });
          if (Check_same_trade_data) {


            let Res = await UserMakeStrategy.updateOne({ name: Check_same_trade_data.name }, {
              $set: {
                status: "1",
                tsl: "2"
              },
            });

            console.log("Res", Res)
          }
          const numberOfTrade_count_trade_count = await UserMakeStrategy.aggregate([
            {
              $match: {
                show_strategy: val.show_strategy,
                numberOfTrade: { $ne: '' }
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
                isTotalSmall: { $lt: ['$totalNumberOfTrade_count_trade', parseInt(val.numberOfTrade)] }
              }
            }
          ]);
          if (numberOfTrade_count_trade_count.length > 0) {
            if (numberOfTrade_count_trade_count[0].isTotalSmall === false) {
              const update_trade_off = {
                $set: {
                  status: '2',
                },
              };
              const filter_trade_off = { show_strategy: val.show_strategy };
              let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
            }
          }
          const currentTimestamp = Math.floor(Date.now() / 1000);
          let type = 'LE';
          if (val.type.toUpperCase() === 'SELL') {
            type = 'SE';
          }
          let price = 0;
          let strike = val.strike_price;
          if (val.strike_price === 'NaN') {
            strike = '100';
          }
          let option_type = 'CALL';
          if (val.option_type.toUpperCase() === 'PE') {
            option_type = 'PUT';
          }
          let Quntity = '100';
          const dateObject = new Date(val.exitTime);
          const hours = ('0' + dateObject.getUTCHours()).slice(-2);
          const minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
          const ExitTime = `${hours}-${minutes}`;
          let req = `DTime:${currentTimestamp}|Symbol:${val.symbol_name}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy_name}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:MAKE_STRATEGY|Target:${val.target}|StopLoss:${val.stoploss}|ExitTime:${ExitTime}|MakeStartegyName:${val.show_strategy}|Demo:demo`;
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
              console.log('Error ', error);
            });

        }
      }

    } else {
      // console.log("No view names provided");
    }

  } catch (error) {
    console.log('Error fetching data:', error);
  }
}







module.exports = new MakeStartegy();