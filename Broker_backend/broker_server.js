
"use strict";
require('dotenv').config();
const connectToDatabase = require('../BACKEND/App/Connection/mongo_connection')
const express = require("express");
const app = express();

// HELLO SNEH
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");
const bodyparser = require('body-parser')

const db = require('../BACKEND/App/Models');
const services = db.services;
const Alice_token = db.Alice_token;
const Signals = db.Signals;
const MainSignals = db.MainSignals;
const AliceViewModel = db.AliceViewModel;
const BrokerResponse = db.BrokerResponse;

// const { logger, getIPAddress } = require('./Helper/logger')

// logger1.info('Add User By Admin', { Email: data.Email, role: data.Role, user_id: data._id });
                   

const aliceblue = require('./Broker/aliceblue')


// CONNECTION FILE IN MONGOODE DATA BASE 
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://snehpnp:snehpnp@newsmartalgo.n5bxaxz.mongodb.net';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}
app.use(bodyparser.json({ verify: rawBodySaver }));
app.use(bodyparser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyparser.raw({ verify: rawBodySaver, type: '*/*' }))
var cors = require('cors');
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
app.use(cors(corsOpts));

var d = new Date;
var current_date = [d.getFullYear(),
d.getMonth() + 1,
d.getDate(),
].join('/') + ' ' + [d.getHours(),
d.getMinutes(),
d.getSeconds()
].join(':');

var dt_date = [d.getFullYear(),
d.getMonth() + 1,
d.getDate(),
].join('/');



// BROKER REQUIRES
const AliceBlue = require('./Broker/aliceblue')



// TEST API
app.post('/broker-signals', async (req, res) => {
  try {

    // IF SIGNEL NOT RECIVED
    if (req.rawBody) {
      const splitArray = req.rawBody.split('|');

      var dt = splitArray[0]
      var input_symbol = splitArray[1]
      var type = splitArray[2]
      var tr_price = splitArray[3]
      var price = splitArray[4]
      var sq_value = splitArray[5]
      var sl_value = splitArray[6]
      var tsl = splitArray[7]
      var segment = splitArray[8]
      var strike = splitArray[9]
      var option_type = splitArray[10]
      var expiry = splitArray[11]
      var strategy = splitArray[12]
      var qty_percent = splitArray[13]
      var client_key = splitArray[14]
      var demo = splitArray[15]

      // IF CLIENT KEY UNDEFINED
      if (client_key != undefined) {

        const FIRST3_KEY = client_key.substring(0, 3);

        // IF SIGNEL KEY NOT MATCH CHECK
        if (FIRST3_KEY == process.env.PANEL_FIRST_THREE) {


          // SIGNEL REQUEST
          var signal_req = Buffer.from(JSON.stringify(req.rawBody)).toString('base64');



          // TOKEN CREATE 
          if (segment == "FO" || segment == "fo") {
            segment = 'O';
          }

          // SET OPTION TYPE
          var Trade_Option_Type;
          if (option_type == "Call" || option_type == "CALL") {
            Trade_Option_Type = "CE";
          } else if (option_type == "Put" || option_type == "PUT") {
            Trade_Option_Type = "PE";
          }





          // DATE MONTH SET
          const day_expiry = expiry.substr(0, 2);
          var dateHash = {
            'Jan': '01',
            'Feb': '02',
            'Mar': '03',
            'Apr': '04',
            'May': '05',
            'Jun': '06',
            'Jul': '07',
            'Aug': '08',
            'Sep': '09',
            'Oct': '10',
            'Nov': '11',
            'Dec': '12'
          }; // 2009-11-10
          const month_expiry = expiry.substr(2, 2);

          function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] == value);
          }
          const ex_day_expiry = getKeyByValue(dateHash, month_expiry).toUpperCase();
          const ex_year_expiry = expiry.substr(-2);




          //  TOKEN  CREATE FUNCTION
          var token = ""
          var instrument_query = { name: input_symbol }
          var EXCHANGE = "NFO";
          var trade_symbol = '';
          var findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: expiry, segment: segment, strategy: strategy }

          if (segment == 'C' || segment == 'c') {
            instrument_query = { name: input_symbol }
            EXCHANGE = "NSE";
            trade_symbol = input_symbol;
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, segment: segment, strategy: strategy }

          } else if (segment == 'F' || segment == 'f') {
            instrument_query = { symbol: input_symbol, segment: "F", expiry: expiry }
            EXCHANGE = "NFO";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + 'FUT';
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy }

          } else if (segment == 'O' || segment == 'o' || segment == 'FO' || segment == 'fo') {
            instrument_query = { symbol: input_symbol, segment: "O", expiry: expiry, strike: strike, option_type: Trade_Option_Type }
            EXCHANGE = "NFO";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + strike + is_CE_val_option;
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy, strike: strike }

          } else if (segment == 'MO' || segment == 'mo') {
            instrument_query = { symbol: input_symbol, segment: "MO", expiry: expiry, strike: strike, option_type: Trade_Option_Type }
            EXCHANGE = "MCX";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + strike + is_CE_val_option;
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy }

          } else if (segment == 'MF' || segment == 'mf') {
            instrument_query = { symbol: input_symbol, segment: "MF", expiry: expiry }
            EXCHANGE = "MCX";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + 'FUT';
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy }

          } else if (segment == 'CF' || segment == 'Cf') {
            instrument_query = { symbol: input_symbol, segment: "CF", expiry: expiry }
            EXCHANGE = "CDS";
          }

          // TOKEN SET IN TOKEN
          if (segment == 'C' || segment == 'c') {
            token = await services.find(instrument_query).maxTimeMS(20000).exec();
          } else {
            token = await Alice_token.find(instrument_query).maxTimeMS(20000).exec();
          }

          // IF CHECK SIGNEL KET IS PANEL OR CLIENT
          if (process.env.PANEL_KEY == client_key) {

            option_type = option_type.toUpperCase();

            var is_CE_val_option = 'PE';
            if (option_type == 'CALL') {
              is_CE_val_option = 'CE';
            }


            // IF SQ_PRICE
            var sq_value;
            if (sq_value == undefined) { sq_value = "0" } else { sq_value = sq_value }

            // IF SL_PRICE
            var sl_value;
            if (sl_value == undefined) { sl_value = "0" } else { sl_value = sl_value }

            // IF TR_PRICE
            var tr_price;
            if (tr_price == undefined) { tr_price = "0" } else { tr_price = tr_price }

            // IF TSL
            var tsl;
            if (tsl == undefined) { tsl = "0" } else { tsl = tsl }

            // STRICK
            var strike;
            if (strike == undefined || strike == '') { strike = "0" } else { strike = strike }

            try {
              var Signal_req = {
                symbol: input_symbol,
                type: type,
                price: price,
                qty_percent: qty_percent,
                exchange: EXCHANGE,
                sq_value: sq_value,
                sl_value: sl_value,
                tsl: tsl,
                tr_price: tr_price,
                dt: Math.round(+new Date() / 1000),
                dt_date: dt_date,
                strategy: strategy,
                option_type: option_type,
                strike: strike,
                expiry: expiry,
                segment: segment,
                trade_symbol: trade_symbol,
                client_persnal_key: "",
                token: token[0].instrument_token
              }
              let Signal_req1 = new Signals(Signal_req)
              var SignalSave = await Signal_req1.save();
            } catch (error) {
              return res.send("ok")
            }

            // ENTRY OR EXIST CHECK
            if (type == "LE" || type == "le") {

              var findMainSignals = await MainSignals.find(findSignal)

              // MainSignals FIND IN COLLECTION
              if (findMainSignals.length == 0) {

                var Entry_MainSignals_req = {
                  symbol: input_symbol,
                  entry_type: type,
                  exit_type: "",
                  entry_price: price,
                  exit_price: "",
                  entry_qty_percent: qty_percent,
                  exit_qty_percent: "",
                  entry_dt_date: current_date,
                  exit_dt_date: "",
                  dt: Math.round(+new Date() / 1000),
                  dt_date: dt_date,
                  exchange: EXCHANGE,
                  strategy: strategy,
                  option_type: option_type,
                  strike: strike,
                  expiry: expiry,
                  segment: segment,
                  trade_symbol: trade_symbol,
                  client_persnal_key: "",
                  signals_id: SignalSave._id,
                  token: token[0].instrument_token
                }
                const Entry_MainSignals = new MainSignals(Entry_MainSignals_req)
                await Entry_MainSignals.save();

              } else {
                var updatedData = {
                  entry_price: (parseFloat(price) + parseFloat(findMainSignals[0].entry_price) / 2).toString(),
                  entry_qty_percent: (parseFloat(qty_percent) + parseFloat(findMainSignals[0].entry_qty_percent)).toString(),
                  entry_dt_date: current_date
                }
                updatedData.$addToSet = { signals_id: SignalSave._id };

                // UPDATE PREVIOUS SIGNAL TO THIS SIGNAL 
                const updatedDocument = await MainSignals.findByIdAndUpdate(findMainSignals[0]._id, updatedData)

              }


            } else
              // START FOR EXIST SIGNAL UPDATE
              if (type == "LX" || type == "lx") {

                var ExitMainSignals = await MainSignals.find(findSignal)

                // // ExitMainSignals  FIND IN COLLECTION
                if (ExitMainSignals.length != 0) {

                  // IF EXIST ENTRY OF THIS EXIT TRADE
                  var updatedData = {
                    exit_type: type,
                    exit_price: price,
                    exit_qty_percent: qty_percent,
                    exit_dt_date: current_date
                  }
                  updatedData.$addToSet = { signals_id: SignalSave._id };

                  // UPDATE PREVIOUS SIGNAL TO THIS SIGNAL 
                  const updatedDocument = await MainSignals.findByIdAndUpdate(ExitMainSignals[0]._id, updatedData)

                } else {

                  console.log("PRIVIOUS SEGNAL UPDATE")

                }
              }



            // HIT TRADE IN BROKER SERVER
            await client.connect();

            const db = client.db(); // Access the default database or specify a database name here
            const collection = db.collection('aliceView');

            var query = { "strategys.strategy_name": strategy, "service.name": input_symbol }

            console.log("query",query);
            // Example: Find all documents in the collection

            try {
              getAllDocuments();
              async function getAllDocuments() {
                const documents = await collection.find(query).toArray();
                // console.log("All documents:", documents);

                if (documents.length > 0) {

                  async function runFunctionWithArray(array) {

                    // Run a function with the four elements of the array simultaneously

                    const promises = array.map((item) => {

                      return new Promise((resolve) => {

                        // Simulate an asynchronous task (replace with your own function)

                        setTimeout(async () => {

                          const currentDate = new Date();

                          const milliseconds = currentDate.getTime();

                          console.log(`Running Time -- ${new Date()} function with element: ${item._id}`);


                          var brokerResponse = {
                            user_id: item._id,
                            receive_signal: signal_req,
                            strategy: strategy,
                            type: type
                          };

                          const newCategory = new BrokerResponse(brokerResponse)
                          var brokerResponse = await newCategory.save()
                            .then((data) => {

                              var bro_res_last_id = data._id;
                              aliceblue.place_order(item, splitArray, bro_res_last_id, token);
                            })


                          resolve();

                        }, 0);

                      });

                    });


                    await Promise.all(promises);

                  }

                  runFunctionWithArray(documents);
                } else {
                  console.log("Client Not Exit");
                }

              }

            } catch (error) {
              console.log("Error In Broker response", error);
            }





          } else {
            console.log("IF SIGNEL KEY LIKE CLIENT KEY IN TRADING VIEW")
          }

          return res.send({ msg: FIRST3_KEY })

        } else {
          return res.send('Incorrect Signal Key');
        }


      } else {
        console.log('No Signal Key Recevie');
        return res.send("No Signal Key Recevie");
      }

    } else {
      console.log('receive signals -', req.body);
    }

  } catch (error) {
    console.log("error", error);
  }
})





// Server start
app.listen(process.env.PORT, () =>
  console.log(`Broker Server is running on http://0.0.0.0:${process.env.PORT}`)
);

