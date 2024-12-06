"use strict";
const bcrypt = require("bcrypt");
const db = require("../../Models");
const axios = require('axios');
const User_model = db.user;

const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;


const uri = process.env.MONGO_URI
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db_GET_VIEW = client.db(process.env.DB_NAME);
const makecallabrView_excute_view = db_GET_VIEW.collection('makecallabrView_excute');
const open_position_excute = db_GET_VIEW.collection('open_position_excute');
const makecall_NotradeTime_status_excute = db_GET_VIEW.collection('makecall_NotradeTime_status_excute');
const token_chain = db_GET_VIEW.collection('token_chain');


const ObjectId = mongoose.Types.ObjectId;
const user_logs = db.user_logs;
const subadmin_logs = db.subadmin_activity_logs;
const serviceGroupName = db.serviceGroupName;
const services = db.services;
const serviceGroup_services_id = db.serviceGroup_services_id;
const categorie = db.categorie;
const group_services = db.groupService_User;
const Alice_token = db.Alice_token;
const strategy_model = db.strategy;
const live_price_token = db.live_price_token;
const makecallABR = db.makecallABR;
// const { Alice_Socket } = require("../../Helpers/Alice_Socket");
const {  updateChannelAndSend } = require('../../Helper/Alice_Socket');


// const { getIO } = require('../../Helpers/BackendSocketIo');


const User = db.user;


// Product CLASS
class Makecall {

  //  GetAllCatagory
  async GetallCatagory(req, res) {

    const pipeline = [
      {
        $project: {
          name: 1,
          segment: 1,
        },
      },
    ];

    const result = await categorie.aggregate(pipeline);


    if (result.length > 0) {
      res.send({ status: true, data: result });

    } else {
      res.send({ status: false, data: [] });

    }
    //
  }


  // get service by category
  async GetServiceByCatagory(req, res) {


    
    if (req.body.category_id == '' || req.body.category_id == null) {
      return res.send({ status: false, msg: "Category not fount service", data: [] })
    }

    const CategoryObjectId = new ObjectId(req.body.category_id);

    const categorySegment = await categorie.findById(CategoryObjectId).select('segment')

    if (categorySegment.segment == "FO") {

      const categorySegmentId = await categorie.findOne({ segment: "F" }).select('_id');


      const pipeline = [
        {
          $lookup: {
            from: 'categories',
            localField: 'categorie_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category', // Unwind the 'categoryResult' array
        },
        {
          $match: {
            categorie_id: categorySegmentId._id
          },
        },
        {
          $sort: {
            name: 1, // 1 for ascending order, -1 for descending order
          },
        },
        {
          $project: {
            'category.segment': 1,
            'category.name': 1,
            name: 1,
            lotsize: 1

          },
        },
      ];
      const result = await services.aggregate(pipeline);
      if (result.length > 0) {
        return res.send({ status: true, msg: "Get Succefully", data: result })
      } else {
        return res.send({ status: false, msg: "Some Error in get", data: [] })
      }

    } else {

      const pipeline = [
        {
          $lookup: {
            from: 'categories',
            localField: 'categorie_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category', // Unwind the 'categoryResult' array
        },
        {
          $match: {
            categorie_id: CategoryObjectId
          },
        },
        {
          $sort: {
            name: 1, // 1 for ascending order, -1 for descending order
          },
        },
        {
          $project: {
            'category.segment': 1,
            'category.name': 1,
            name: 1,
            lotsize: 1

          },
        },
      ];
      const result = await services.aggregate(pipeline);
      if (result.length > 0) {
        return res.send({ status: true, msg: "Get Succefully", data: result })
      } else {
        return res.send({ status: false, msg: "Some Error in get", data: [] })
      }


    }

  }


  //get expiry
  async Getgetexpirymanualtrade(req, res) {


    try {

      if (req.body.category_id == '' || req.body.symbol == '') {
        return res.send({ status: false, msg: "script not fount service", data: [] })
      }

      const CategoryObjectId = new ObjectId(req.body.category_id);
      const symbol = req.body.symbol;

      if (!symbol) {
        return res.status(400).json({ status: false, msg: 'Symbol is required.', data: [] });
      }


      const date = new Date(); // Month is 0-based, so 10 represents November
      const currentDate = new Date();
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      //  const date = new Date(); // Month is 0-based, so 10 represents November
      const formattedDate = previousDate.toISOString();

      const categorySegment = await categorie.findById(CategoryObjectId).select('segment')

      if (categorySegment.segment == "FO") {


        const categorySegmentId = await categorie.findOne({ segment: "O" }).select('_id');


        const pipeline_category = [
          {
            $match: {
              _id: categorySegmentId._id
            },
          },
          {
            $project: {
              segment: 1,
              _id: 0,
            },
          },
        ];

        const category_details = await categorie.aggregate(pipeline_category);

        const pipeline = [
          {
            $match: {
              symbol: symbol,
              segment: category_details[0].segment
            }
          },
          {
            $group: {
              _id: "$symbol",
              uniqueExpiryValues: { $addToSet: "$expiry" }
            }
          },
          {
            $unwind: "$uniqueExpiryValues"
          },
          {
            $addFields: {
              expiryDate: {
                $dateFromString: {
                  dateString: "$uniqueExpiryValues",
                  format: "%d%m%Y"
                }
              }
            }
          },

          {
            $addFields: {
              formattedExpiryDate: {
                $dateToString: {
                  date: "$expiryDate",
                  format: "%d%m%Y"
                }
              }
            }
          },
          {
            $sort: { expiryDate: 1 }
          },
          {
            $limit: 4
          }


        ]

        const result = await Alice_token.aggregate(pipeline);
        if (result.length > 0) {
          return res.send({ status: true, msg: "Get Succefully", data: result })
        } else {
          return res.send({ status: false, msg: "Some Error in get", data: [] })
        }

      } else {

        const pipeline_category = [
          {
            $match: {
              _id: CategoryObjectId
            },
          },
          {
            $project: {
              segment: 1,
              _id: 0,
            },
          },
        ];

        const category_details = await categorie.aggregate(pipeline_category);

        const pipeline = [
          {
            $match: {
              symbol: symbol,
              segment: category_details[0].segment
            }
          },
          {
            $group: {
              _id: "$symbol",
              uniqueExpiryValues: { $addToSet: "$expiry" }
            }
          },
          {
            $unwind: "$uniqueExpiryValues"
          },
          {
            $addFields: {
              expiryDate: {
                $dateFromString: {
                  dateString: "$uniqueExpiryValues",
                  format: "%d%m%Y"
                }
              }
            }
          },

          {
            $addFields: {
              formattedExpiryDate: {
                $dateToString: {
                  date: "$expiryDate",
                  format: "%d%m%Y"
                }
              }
            }
          },
          {
            $sort: { expiryDate: 1 }
          },
          {
            $limit: 4
          }


        ]

        const result = await Alice_token.aggregate(pipeline);
        if (result.length > 0) {
          return res.send({ status: true, msg: "Get Succefully", data: result })
        } else {
          return res.send({ status: false, msg: "Some Error in get", data: [] })
        }

      }




    } catch (error) {
      return res.status(500).json({ status: false, msg: 'Server error', data: [] });
    }








  }



  //get expiry
  async GetgetAllStrikePriceApi(req, res) {


    try {

      if (req.body.category_id == '' || req.body.symbol == '') {
        return res.send({ status: false, msg: "script not fount service", data: [] })
      }

      const symbol = req.body.symbol;

      if (!symbol) {
        return res.status(400).json({ status: false, msg: 'Symbol is required.', data: [] });
      }

      const date = new Date();
      const currentDate = new Date();
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      const formattedDate = previousDate.toISOString();


      const CategoryObjectId = new ObjectId(req.body.category_id);

      const expiry = req.body.expiry;
      const segment = req.body.segment;



      const pipeline = [
        {
          $match: {
            $and: [
              { option_type: { $in: ["CE", "PE"] } },
              { segment: segment },
              { symbol: symbol },
              { expiry: expiry }
            ]
          }
        },
        {
          $group: {
            _id: "$strike",
            strike: { $first: "$strike" }
          }
        },
        {
          $sort: { strike: -1 }
        }
      ];


      const result = await Alice_token.aggregate(pipeline);




      if (result.length > 0) {
        return res.send({ status: true, msg: "Get Succefully", data: result })
      } else {
        return res.send({ status: false, msg: "Some Error in get", data: [] })
      }

    } catch (error) {
      return res.status(500).json({ status: false, msg: 'Server error', data: [] });
    }


  }



  //get Strategy Data
  async GetgetStrategyData(req, res) {

   console.log("req.body",req.body)
    try {
      // const { user_id } = req.body;
      // const findUser = await User.find({ _id: user_id }).select('prifix_key Role')
      // const prefix = findUser[0].prifix_key.substring(0, 3); // Extracting first 3 characters from prefix_key
      // if (findUser[0].Role == "SUBADMIN") {
      //   const getAllstrategy = await strategy_model.find(
      //     { strategy_name: { $regex: '^' + prefix } } // Using regex to match the starting 3 letters
      //   )
      //     .sort({ createdAt: -1 })
      //     .select('_id strategy_name Service_Type');
      //   // IF DATA NOT EXIST
      //   if (getAllstrategy.length == 0) {
      //     res.send({ status: false, msg: "Empty data", data: getAllstrategy });
      //     return;
      //   }
      //   // DATA GET SUCCESSFULLY
      //   return res.send({
      //     status: true,
      //     msg: "Get All Startegy",
      //     data: getAllstrategy,
      //   });
      // } else if (findUser[0].Role == "RESEARCH") {
      //   const getAllstrategy = await researcher_strategy.find(
      //     { maker_id: findUser[0]._id }
      //   )
      //     .sort({ createdAt: -1 })
      //     .select('_id strategy_name');



      //   // IF DATA NOT EXIST
      //   if (getAllstrategy.length == 0) {
      //     res.send({ status: false, msg: "Empty data", data: getAllstrategy });
      //     return;
      //   }

      //   // DATA GET SUCCESSFULLY
      //   return res.send({
      //     status: true,
      //     msg: "Get All Startegy",
      //     data: getAllstrategy,
      //   });
      // }

      const { page, limit } = req.body;
      const skip = (page - 1) * limit;

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
      return res.send({ status: false, msg: "Server Error" });
    }


  }


  //get token by socket Data
  async Getgettokenbysocket(req, res) {


    try {


      let segment = req.body.segment
      let symbol = req.body.symbol

      //Cash Token get
      if (req.body.segment == "C") {

        const result = await services.findOne({ name: symbol }).select('instrument_token exch_seg');

        if (result != null) {
          return res.send({ status: true, token: result.instrument_token, exchange: result.exch_seg })
        } else {
          return res.send({ status: false, msg: "Data not found", token: "" })
        }

      }

      if (req.body.segment == "FO") {

        const result = await services.findOne({ name: symbol }).select('instrument_token exch_seg');

        if (result != null) {
          return res.send({ status: true, token: result.instrument_token, exchange: result.exch_seg })
        } else {
          return res.send({ status: false, msg: "Data not found", token: "" })
        }

      }



      //Futer Token get
      else if (req.body.segment == "F" || req.body.segment == "MF" || req.body.segment == "CF") {

        let expiry = req.body.expiry;

        const result = await Alice_token.findOne({ symbol: symbol, segment: segment, expiry: expiry }).select('instrument_token exch_seg');

        if (result != null) {
          return res.send({ status: true, token: result.instrument_token, exchange: result.exch_seg })
        } else {
          return res.send({ status: false, msg: "Data not found", token: "" })
        }

      }


      //Option Token get
      else if (req.body.segment == "O" || req.body.segment == "MO" || req.body.segment == "CO") {

        let expiry = req.body.expiry;
        let strike_price = req.body.strike_price;
        let option_type = "CE";

        if (req.body.option_type.toUpperCase() == "PUT") {
          option_type = "PE"
        }

        const result = await Alice_token.findOne({ symbol: symbol, segment: segment, expiry: expiry, strike: strike_price, option_type: option_type }).select('instrument_token exch_seg');

        if (result != null) {
          return res.send({ status: true, token: result.instrument_token, exchange: result.exch_seg })
        } else {
          return res.send({ status: false, msg: "Data not found", token: "" })
        }

      }



    } catch (error) {
      return res.send({ status: false, msg: "Server Error" });
    }


  }

  //get token by socket Data
  async GetLiveDataSession(req, res) {

    try {


      let result = null

      if (req.body.exist_user == "none") {
        result = await live_price_token.findOne().limit(1).select('demate_user_id access_token trading_status');
      } else {
        // result = await live_price_token.findOne({demate_user_id:req.body.exist_user}).limit(1).select('demate_user_id access_token');

        result = await live_price_token.findOne({
          _id: { $gt: req.body.exist_user_details._id } // Assuming result is the previously found document
        }).select('demate_user_id access_token trading_status').limit(1);


      }


      if (result != null) {
        return res.send({ status: true, msg: "Data Get", data: result });
      } else {
        return res.send({ status: false, msg: "Id Wrong" });
      }



    } catch (error) {
      return res.send({ status: false, msg: "Server Error" });
    }


  }



  //Add data above beleow range
  async AddDataAboveBelowRange(req, res) {

    try {


      const {
        user_id,
        Symbol,
        TType,
        Tr_Price,
        Price,
        EntryPrice,
        Sq_Value,
        Sl_Value,
        TSL,
        Segment,
        Strike,
        OType,
        Strategy,
        Quntity,
        Key,
        TradeType,
        Target,
        StopLoss,
        ExitTime,
        NoTradeTime,
        sl_status,
        token,
        EntryPriceRange_one,
        EntryPriceRange_two,
        ABR_TYPE,
        marketTimeAmo,
        WiseTypeDropdown
      } = req.body;

      console.log("Segment",Segment)
      
      let Expiry = req.body.Expiry
    
      if(Segment.toUpperCase() == "C"){
       Expiry = "10102050"
      }


      //crete data
      const makecallABR_insert = new makecallABR({
        user_id: user_id,
        Symbol: Symbol,
        TType: TType,
        Tr_Price: Tr_Price,
        Price: Price,
        EntryPrice: EntryPrice,
        Sq_Value: Sq_Value,
        Sl_Value: Sl_Value,
        TSL: TSL,
        Segment: Segment,
        Strike: Strike,
        OType: OType,
        Expiry: Expiry,
        Strategy: Strategy,
        Quntity: Quntity,
        Key: Key,
        TradeType: TradeType,
        Target: Target,
        StopLoss: StopLoss,
        ExitTime: ExitTime.replace(":", ""),
        NoTradeTime: NoTradeTime.replace(":", ""),
        sl_status: sl_status,
        token: token,
        EntryPriceRange_one: EntryPriceRange_one,
        EntryPriceRange_two: EntryPriceRange_two,
        ABR_TYPE: ABR_TYPE,
        marketTimeAmo: marketTimeAmo,
        WiseTypeDropdown: WiseTypeDropdown
      });

      // Save new user and count licenses



      const result = await makecallABR_insert.save();

      if (result != null) {

        let exch = "NFO"

        if (Segment == "C") {
          exch = "NSE"
        }
        else if (Segment == "MO" || Segment == "MF") {
          exch = "MCX"
        }
        else if (Segment == "CO" || Segment == "CF") {
          exch = "CDS"
        }
 

        const tokenExisst = await token_chain.findOne({ _id: token })
      
        if (tokenExisst != null) {
          return res.send({ status: true, msg: "Data Add Successfully....", data: result });

        } else {
          const filter = { _id: token };
          const update = { $set: { _id: token, exch: exch } };
          await token_chain.updateOne(filter, update, { upsert: true });

      
          console.log("token",token)
          console.log("exch",exch)
          
          let channelList = exch + '|' + token;
          updateChannelAndSend(channelList);
         // Alice_Socket()
          return res.send({ status: true, msg: "Data Add Successfully....", data: result });

        }



      } else {
        return res.send({ status: false, msg: "Id Wrong" });
      }



    } catch (error) {
      console.log(error);
      return res.send({ status: false, msg: "Server Error" });
    }


  }


  //Get data above beleow range
  async GetDataAboveBelowRange(req, res) {


    try {
      const { user_id, ABR } = req.body;
      const UserId = new ObjectId(user_id)
      const pipeline = [
        {
          $match: {
            user_id: UserId,
            ABR_TYPE: ABR,
            $or: [
              { status: 0 },
              { status: 2 }
            ]
          },
        },
      ];

      const result = await makecallABR.aggregate(pipeline);

      if (result.length > 0) {
        return res.send({ status: true, msg: "Data Add Successfully....", data: result });
      } else {
        return res.send({ status: false, msg: "Id Wrong" });
      }



    } catch (error) {

      return res.send({ status: false, msg: "Server Error" });
    }


  }


  //Delete data above beleow range
  async DeleteDataMakeCall(req, res) {


    try {

      const AllIds = req.body.row.map(item => new ObjectId(item._id))

      const result = await makecallABR.deleteMany({ _id: { $in: AllIds } })
      return res.send({ status: true, msg: "Data Delete Successfully...." });




    } catch (error) {
      return res.send({ status: false, msg: "Server Error" });
    }


  }

  //Update data above beleow range
  async UpdateDataMakeCall(req, res) {

    console.log("req.body",req.body)

    try {

      // let ExstToken = []
      // for (let index = 0; index < req.body.token.length; index++) {
      //   const val = req.body.token[index];
         
      //   let exch = "NFO"

      //   if (val.Segment == "C") {
      //     exch = "NSE"
      //   }
      //   else if (val.Segment == "MO" || val.Segment == "MF") {
      //     exch = "MCX"
      //   }
      //   else if (val.Segment == "CO" || val.Segment == "CF") {
      //     exch = "CDS"
      //   }
 

      //   const tokenExisst = await token_chain.findOne({ _id: val.token })
      
      //   if (tokenExisst != null) {
            
      //   } else {
      //     ExstToken.push(val.token)
      //     const filter = { _id: val.token };
      //     const update = { $set: { _id: val.token, exch: exch } };
      //     await token_chain.updateOne(filter, update, { upsert: true });
      //   }
    
      // }

   


      
      for (let id in req.body.row) {
        const updates = req.body.row[id];

       // console.log("req.body.row",req.body.row)
        const filter = { _id: new ObjectId(id) };
        const update = { $set: updates };

        await makecallABR.updateOne(filter, update)
        // Perform any operation you need with the ID and updates
      }


      // if(ExstToken.length > 0){
      //   Alice_Socket()
      // }



      return res.send({ status: true, msg: "Data Update Successfully...." });


    } catch (error) {
      console.error("error",error);
      return res.send({ status: false, msg: "server Error" });
    }

  }




}







//////////////////----- makecallabrView_excute_run --//////////////////////////////
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

async function run() {

  try {

    const makecallabrView_excute_run = async () => {
      // console.log("makecallabrView_excute_run")
      try {

        let rr = true
        if (rr) {
          // if (holidays.isHoliday(currentDate) && weekday != 'Sunday' && weekday != 'Saturday') {

          // const viewName = 'open_position_excute';
          let makecallabrView_excute_result = await makecallabrView_excute_view.find().toArray();

         

     
          if (makecallabrView_excute_result.length > 0) {



            // [
            //   {
            //     _id: new ObjectId('66335258559fd8cbfd6aa184'),
            //     user_id: new ObjectId('662b6ec4e8a32c05bc0ae639'),
            //     Symbol: 'BANKNIFTY',
            //     TType: 'LE',
            //     Tr_Price: '0.00',
            //     Price: '0',
            //     EntryPrice: '',
            //     Sq_Value: '0.00',
            //     Sl_Value: '0.00',
            //     TSL: '0.00',
            //     Segment: 'O',
            //     Strike: '49200',
            //     OType: 'CALL',
            //     Expiry: '08052024',
            //     Strategy: 'SHK_DEMO',
            //     Quntity: '100',
            //     Key: 'SHK796872240426',
            //     TradeType: 'MAKECALL',
            //     Target: '10.00',
            //     StopLoss: '0',
            //     ExitTime: '15:25',
            //     sl_status: '1',
            //     token: '43763',
            //     EntryPriceRange_one: '445',
            //     EntryPriceRange_two: '480',
            //     ABR_TYPE: 'range',
            //     marketTimeAmo: '1',
            //     WiseTypeDropdown: '1',
            //     status: 0,
            //     above_price: null,
            //     below_price: null,
            //     stockInfo_lp: 451.15,
            //     stockInfo_curtime: '1416',
            //     isAbove: false,
            //     isBelow: false,
            //     isRange: true
            //   }
            // ]



            makecallabrView_excute_result && makecallabrView_excute_result.map(async (item) => {

              let Target = 0
              let StopLoss = 0
              if (item.sl_status == "1") {

                if (item.WiseTypeDropdown == '1') {
                  if (item.Target != "0") {
                    let percent_value = parseFloat(item.stockInfo_lp) * (item.Target / 100)
                    Target = parseFloat(item.stockInfo_lp) + parseFloat(percent_value)
                  }
                  if (item.StopLoss != '0') {
                    let percent_value = parseFloat(item.stockInfo_lp) * (item.StopLoss / 100)
                    StopLoss = parseFloat(item.stockInfo_lp) - parseFloat(percent_value)

                  }

                }

                else if (item.WiseTypeDropdown == '2') {
                  if (item.Target != "0") {
                    Target = parseFloat(item.stockInfo_lp) + parseFloat(item.Target)
                  }
                  if (item.StopLoss != '0') {
                    StopLoss = parseFloat(item.stockInfo_lp) - parseFloat(item.StopLoss)
                  }

                }

              }

             

              const currentTimestamp = Math.floor(Date.now() / 1000);
              let req = `DTime:${currentTimestamp}|Symbol:${item.Symbol}|TType:${item.TType}|Tr_Price:${item.Tr_Price}|Price:${item.stockInfo_lp}|Sq_Value:${item.Sq_Value}|Sl_Value:${item.Sl_Value}|TSL:${item.TSL}|Segment:${item.Segment}|Strike:${item.Strike}|OType:${item.OType}|Expiry:${item.Expiry}|Strategy:${item.Strategy}|Quntity:${item.Quntity}|Key:${item.Key}|TradeType:${item.TradeType}|Target:${Target}|StopLoss:${StopLoss}|ExitTime:${item.ExitTime}|sl_status:${item.sl_status}|ExitStatus:${item.ABR_TYPE}|Demo:demo`

              const resultUpdateId = await makecallABR.updateMany(
                { _id: item._id }, // Condition: IDs from the view
                { $set: { status: 1 } } // Update operation
              );


              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.BROKER_URL}`,
                headers: {
                  'Content-Type': 'text/plain'
                },
                data: req
              };

             await axios.request(config)
                .then(async (response) => {
                   
                    // console.log("response makecall abr ", response.data)
                //  const io = await getIO();
                //  io.emit("TRADE_NOTIFICATION", { data: item ,type : "MAKECALL" , type_makecall : "TRADE"});


                })
                .catch((error) => {

                  console.log("Error makecall abr ", error)
                });


            })


            makecallabrView_excute_result = null
            return

          } else {
          }


        } else {
        }

      } catch (error) {
        console.log("Error in makecallabrView_excute_run loop", error);
      }



    }

    const noTradeTimeExcuteSetStatus = async () => {
      try {

        let NotradeTimeExucuted = await makecall_NotradeTime_status_excute.find().toArray();

        if (NotradeTimeExucuted.length > 0) {
          const items = NotradeTimeExucuted.map(item => item)
          const ids = NotradeTimeExucuted.map(item => item._id)
          const result = await makecallABR.updateMany(
            { _id: { $in: ids } },
            { $set: { status: 2 } }
          );

          // const io = await getIO();
          // io.emit("TRADE_NOTIFICATION", { data: items ,type : "MAKECALL" , type_makecall : "NO_TRADE"});

          NotradeTimeExucuted = null

          return

        } else {
          return
        }
      } catch (error) {
        console.log("Error in Open Position", error);
      }

    }


    

    // Use a while loop with setTimeout for a delay
    while (true) {
      // Delay for 1000 milliseconds (1 second)
      await new Promise(resolve => setTimeout(resolve, 500));
      await noTradeTimeExcuteSetStatus();
      // Run the function initially
      await makecallabrView_excute_run();

    }
  } finally {
    // Close the client when you're done
  }

}


 //run().catch(console.error);


//////////////////----- makecallabrView_excute_run --/////////////////////////


module.exports = new Makecall();
