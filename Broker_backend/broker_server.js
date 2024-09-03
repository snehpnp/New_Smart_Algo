
"use strict";
require('dotenv').config();
const {connectToMongoDB} = require('../BACKEND/App/Connection/mongo_connection')
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const axios = require('axios');
// Define a custom format for the timestamp
const customTimestamp = () => {
  return new Date().toLocaleString();
};


const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.printf(({ level, message }) => {
      return `${customTimestamp()} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

// HELLO SNEH
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");
const bodyparser = require('body-parser')
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");



// const db = require('./Models');
const db = require('../BACKEND/App/Models');
const services = db.services;
const Alice_token = db.Alice_token;
const Signals = db.Signals;
const MainSignals = db.MainSignals;
const AliceViewModel = db.AliceViewModel;
const BrokerResponse = db.BrokerResponse;
const live_price = db.live_price;





// CONNECTION FILE IN MONGOODE DATA BASE 
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
const db1 = client.db(process.env.DB_NAME);


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

require('./Helper/cron')(app);

// =======================SOCKET CONNECT AND ADD PRICE =====================

const server = http.createServer(app);
const io = socketIo(server);

let socketObject = null;
let response111 = null;


const ConnectSocket = async (EXCHANGE, instrument_token) => {


  var channel_List = `${EXCHANGE}|${instrument_token}`

  var broker_infor = await live_price.findOne({ broker_name: "ALICE_BLUE", trading_status: "on" });
  console.log(broker_infor);
  if (broker_infor) {

    var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"
    var userid = broker_infor.user_id
    var userSession1 = broker_infor.access_token
    var type = { "loginType": "API" }
    const url = "wss://ws1.aliceblueonline.com/NorenWS/"
    var socket = null
    var channelList = ""

    if (channel_List) {
      channelList = channel_List
    }



    const token_chain_list = db1.collection('token_chain');
    const updateToken = await token_chain_list.updateOne({ _id: instrument_token }, {
      $set: {
        _id: instrument_token,
        exch: EXCHANGE
      },
    }, { upsert: true });


    await axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
      headers: {
        'Authorization': `Bearer ${userid} ${userSession1}`,
        'Content-Type': 'application/json'
      },

    }).then((res) => {


      if (res.data.stat == "Ok") {

        try {
          socket = new WebSocket(url)

          socket.onopen = function () {
            var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
            var initCon = {
              susertoken: encrcptToken,
              t: "c",
              actid: userid + "_" + "API",
              uid: userid + "_" + "API",
              source: "API"
            }
            socket.send(JSON.stringify(initCon))
          }

          // console.log("Connect Socket");
          socket.onmessage = async function (msg) {
            var response = JSON.parse(msg.data);

            if (response.tk) {
              // token_chain

              const currentDate = new Date();
              const hours = currentDate.getHours().toString().padStart(2, '0');
              const minutes = currentDate.getMinutes().toString().padStart(2, '0');

              const stock_live_price = db1.collection('stock_live_price');

              const filter = { _id: response.tk }; // Define the filter based on the token
              if (response.lp != undefined) {
                let bp1 = response.lp
                let sp1 = response.lp

                if (response.bp1 != undefined) {
                  bp1 = response.bp1;
                }

                if (response.sp1 != undefined) {
                  sp1 = response.sp1;
                }

                const update = {
                  $set: {
                    lp: response.lp,
                    exc: response.e,
                    sp1: sp1,
                    bp1: bp1,
                    curtime: `${hours}${minutes}`
                  },
                };
                const result = await stock_live_price.updateOne(filter, update, { upsert: true });
              }




            } else {
              // console.log("else", response);
            }

            if (response.s === 'OK') {
              let json = {
                k: channelList,
                t: 't'
              };
              await socket.send(JSON.stringify(json));

              socketObject = socket;
            }
          }

        } catch (error) {
          //console.log("Error-", error.response);

        }
      }


    }).catch((error) => {
      // console.log("Error -", error.response.data);
      return error.response.data
    })


  } else {
    console.log("Admin Trading off ")
  }

}

app.get('/r', (req, res) => {
  // Request on Socket Server 1
  ConnectSocket()
  res.send('Request sent to Socket Server 2');
});



// ==================================================================================================
// MT_4 , OPTION_CHAIN , MAKE_STG, SQUARE_OFF


// BROKER REQUIRES
const aliceblue = require('./Broker/aliceblue')
const angel = require('./Broker/angel')
const fivepaisa = require('./Broker/fivepaisa')
const zerodha = require('./Broker/zerodha')
const upstox = require('./Broker/upstox')
const dhan = require('./Broker/dhan')
const fyers = require('./Broker/fyers')
const markethub = require('./Broker/markethub')
const swastika = require('./Broker/swastika')
const mastertrust = require('./Broker/mastertrust')
const kotakneo = require('./Broker/kotakneo')
const iiflView = require('./Broker/Iifl')
const Motilaloswal = require('./Broker/Motilaloswal')
const Zebull = require('./Broker/Zebull')
const icicidirect = require('./Broker/icicidirect')







// BROKER SIGNAL
app.post('/broker-signals', async (req, res) => {

  var d = new Date();
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

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;


  var filePath = path.join(__dirname + '/AllPanelTextFile', 'PANELKEY' + process.env.PANEL_KEY + process.env.PANEL_NAME + formattedDate + '.txt');

  var directoryfilePath = path.join(__dirname + '/AllPanelTextFile');
  var paneltxtentry = 0;

  try {

    // IF SIGNEL NOT RECIVED
    if (req.rawBody) {
      const splitArray = req.rawBody.split('|');

      const signals = {};

      splitArray.forEach(pair => {
        const [key, value] = pair.split(':');
        signals[key] = value;
      });


      fs.appendFile(filePath, '\nNEW TRADE TIME ' + new Date() + '\nRECEIVED_SIGNALS ' + splitArray + '\n', function (err) {
        if (err) {
          return console.log(err);
        }
      });

    console.log("signals - ",signals)

      const epochTimestamp = signals.DTime;


      const date = new Date(epochTimestamp * 1000);
      const formattedDate1 = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const parts = formattedDate1.split('/');



      var dt = signals.DTime;
      var input_symbol = signals.Symbol;
      var type = signals.TType;
      var tr_price = signals.Tr_Price;
      var price = signals.Price;
      var sq_value = signals.Sq_Value;
      var sl_value = signals.Sl_Value;
      var tsl = signals.TSL;
      var segment = signals.Segment.toUpperCase();
      var segment1 = signals.Segment.toUpperCase();
      var strike = signals.Strike;
      var option_type = signals.OType;
      var expiry = signals.Expiry;
      var strategy = signals.Strategy;
      var qty_percent = 100;
      var client_key = signals.Key;
      var TradeType = signals.TradeType;




      let ExitStatus = '-'

      let ft_time = ''

      if (signals.ExitStatus != undefined) {
        ExitStatus = signals.ExitStatus
      }

      var sl_status = 0;
      if (signals.sl_status != undefined) {
        sl_status = signals.sl_status;
      }

      var Target = 0;
      if (signals.Target != undefined) {
        Target = signals.Target;
      }

      var StopLoss = 0;
      if (signals.StopLoss != undefined) {
        StopLoss = signals.StopLoss;
      }

      var ExitTime = 0;
      if (signals.ExitTime != undefined) {
        ExitTime = signals.ExitTime.replace(/-/g, ':');
      }

      var MakeStartegyName = ""
      if (signals.MakeStartegyName != undefined) {
        MakeStartegyName = signals.MakeStartegyName
      }


      var demo = signals.Demo;



      if (client_key != undefined) {

        const FIRST3_KEY = client_key.substring(0, 3);

        if (FIRST3_KEY == process.env.PANEL_FIRST_THREE) {

          var signal_req = Buffer.from(JSON.stringify(req.rawBody)).toString('base64');

          if (segment == "FO" || segment == "fo") {
            segment = 'O';
          }

          var Trade_Option_Type;
          if (option_type == "Call" || option_type == "CALL") {
            Trade_Option_Type = "CE";
          } else if (option_type == "Put" || option_type == "PUT") {
            Trade_Option_Type = "PE";
          }

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

          var token = ""
          var instrument_query = { name: input_symbol }
          var EXCHANGE = "NFO";
          var trade_symbol = '';

          let client_persnal_key = "";
          if (process.env.PANEL_KEY == client_key) {
            client_persnal_key = "";
          } else {
            client_persnal_key = client_key
          }

          // MT_4 , OPTION_CHAIN , MAKE_STG, SQUAR_OFF
          var findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: expiry, segment: segment, strategy: strategy, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE", client_persnal_key: "", TradeType: "MT_4" }

          if (segment == 'C' || segment == 'c') {
            instrument_query = { name: input_symbol }
            EXCHANGE = "NSE";
            trade_symbol = input_symbol;
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, segment: segment, strategy: strategy, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE", client_persnal_key: client_persnal_key, TradeType: TradeType }
          } else if (segment == 'F' || segment == 'f') {
            instrument_query = { symbol: input_symbol, segment: "F", expiry: expiry }
            EXCHANGE = "NFO";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + 'FUT';
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE", client_persnal_key: client_persnal_key, TradeType: TradeType }

          } else if (segment == 'O' || segment == 'o' || segment == 'FO' || segment == 'fo') {
            instrument_query = { symbol: input_symbol, segment: "O", expiry: expiry, strike: strike, option_type: Trade_Option_Type }
            EXCHANGE = "NFO";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + strike + Trade_Option_Type;
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE", client_persnal_key: client_persnal_key, TradeType: TradeType, strike: strike }

          } else if (segment == 'MO' || segment == 'mo') {
            instrument_query = { symbol: input_symbol, segment: "MO", expiry: expiry, strike: strike, option_type: Trade_Option_Type }
            EXCHANGE = "MCX";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + strike + Trade_Option_Type;
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE", client_persnal_key: client_persnal_key, TradeType: TradeType, strike: strike }

          } else if (segment == 'MF' || segment == 'mf') {
            instrument_query = { symbol: input_symbol, segment: "MF", expiry: expiry }
            EXCHANGE = "MCX";
            trade_symbol = input_symbol + day_expiry + ex_day_expiry + ex_year_expiry + 'FUT';
            findSignal = { entry_type: "LE", dt_date: dt_date, symbol: input_symbol, expiry: expiry, option_type: option_type, segment: segment, strategy: strategy, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE", client_persnal_key: client_persnal_key, TradeType: TradeType }

          } else if (segment == 'CF' || segment == 'Cf') {
            instrument_query = { symbol: input_symbol, segment: "CF", expiry: expiry, entry_type: type === "LE" || type === "LX" ? 'LE' : type === "SE" || type === "SX" ? "SE" : "LE" }
            EXCHANGE = "CDS";
          }



          if (segment == 'C' || segment == 'c') {
            token = await services.find(instrument_query).maxTimeMS(20000).exec();
          } else {

            token = await Alice_token.find(instrument_query).maxTimeMS(20000).exec();
          }

          var instrument_token = 0
          if (token.length == 0) {
            instrument_token = 0
          } else {
            instrument_token = token[0].instrument_token
          }


          const token_chain1 = db1.collection('token_chain');
          const stock_live_price1 = db1.collection('stock_live_price');


          var find_lot_size = 1
          if (token.length == 0) {
            find_lot_size = 0
          } else {
            find_lot_size = token[0].lotsize
          }


          var tradesymbol1
          if (token.length == 0) {
            tradesymbol1 = ""
          } else {
            if (segment == 'C' || segment == 'c') {
              tradesymbol1 = token[0].zebu_token
            } else {
              tradesymbol1 = token[0].tradesymbol
            }
          }




          fs.appendFile(filePath, 'TIME ' + new Date() + ' RECEIVED_SIGNALS_TOKEN ' + instrument_token + '\n', function (err) {
            if (err) {
              return console.log(err);
            }
          });



          if (segment == 'C' || segment == 'c') {

            price = signals.Price

          } else {


            const price_live_second = await stock_live_price1.find({ _id: instrument_token }).toArray();

            try {
              if (signals.TradeType == "MT_4") {

                if (price_live_second.length > 0) {
                  price = price_live_second[0].lp
                  ft_time = price_live_second[0].ft
                } else {
                  price = signals.Price
                }
              } else {
                if (price_live_second.length > 0) {
                  ft_time = price_live_second[0].ft
                }
              }
            } catch (error) {
              console.log("Error  IN price Update", error);
            }
            if (price == null) {
              price = signals.Price

            }


          }



          let ExistExitSignal = '';
          if (type.toUpperCase() == "LX" || type.toUpperCase() == "SX") {
            const updatedFindSignal = {
              ...findSignal,
              exit_qty_percent: "" // Adding the exit_qty_percent field with an empty string value
            };
            ExistExitSignal = await MainSignals.find(updatedFindSignal)
          }


          if (process.env.PANEL_KEY == client_key) {

            try {
              const AliceBlueCollection = db1.collection('aliceblueView');
              const AliceBluedocuments = await AliceBlueCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE ALL CLIENT LENGTH ' + AliceBluedocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (AliceBluedocuments.length > 0) {
                aliceblue.place_order(AliceBluedocuments, signals, token, filePath, signal_req, ExistExitSignal);
              }

            } catch (error) {
              console.log("Error Get Aliceblue Client In view", error);
            }
            //End Process Alice Blue admin client


            //Process Angel admin client
            try {
              const angelCollection = db1.collection('angelView');
              const angelBluedocuments = await angelCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE ALL CLIENT LENGTH ' + angelBluedocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (angelBluedocuments.length > 0) {
                angel.place_order(angelBluedocuments, signals, token, filePath, signal_req, ExistExitSignal);
              }

            } catch (error) {
              console.log("Error Get ANGEL Client In view", error);
            }
            //End Process Angel admin client


            //Process fivepaisa admin client
            try {
              const fivepaisaCollection = db1.collection('fivepaisaView');
              const fivepaisaBluedocuments = await fivepaisaCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE ALL CLIENT LENGTH ' + fivepaisaBluedocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (fivepaisaBluedocuments.length > 0) {
                fivepaisa.place_order(fivepaisaBluedocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get fivepaisa Client In view", error);
            }
            //End Process fivepaisa admin client



            //Process zerodha admin client
            try {
              const zerodhaCollection = db1.collection('zerodhaView');
              const zerodhaBluedocuments = await zerodhaCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE ALL CLIENT LENGTH ' + zerodhaBluedocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (zerodhaBluedocuments.length > 0) {
                zerodha.place_order(zerodhaBluedocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get zerodha Client In view", error);
            }
            //End Process zerodha admin client



            //Process UPSTOX admin client
            try {
              const upstoxCollection = db1.collection('upstoxView');
              const upstoxdocuments = await upstoxCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' UPSTOX ALL CLIENT LENGTH ' + upstoxdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (upstoxdocuments.length > 0) {
                upstox.place_order(upstoxdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get UPSTOX Client In view", error);
            }
            //End Process UPSTOX admin client




            //Process dhan admin client
            try {
              const dhanCollection = db1.collection('dhanView');
              const dhandocuments = await dhanCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' dhan ALL CLIENT LENGTH ' + dhandocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (dhandocuments.length > 0) {
                dhan.place_order(dhandocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get dhan Client In view", error);
            }
            //End Process dhan admin client



            //Process fyers admin client
            try {
              const fyersCollection = db1.collection('fyersView');
              const fyersdocuments = await fyersCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' fyers ALL CLIENT LENGTH ' + fyersdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (fyersdocuments.length > 0) {
                fyers.place_order(fyersdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get fyers Client In view", error);
            }
            //End Process fyers admin client



            //Process markethub admin client
            try {
              const markethubCollection = db1.collection('markethubView');
              const markethubdocuments = await markethubCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' markethub ALL CLIENT LENGTH ' + markethubdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (markethubdocuments.length > 0) {
                markethub.place_order(markethubdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get markethub Client In view", error);
            }
            //End Process markethub admin client



            //Process swastika admin client
            try {
              const swastikaCollection = db1.collection('swastikaView');
              const swastikadocuments = await swastikaCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' swastika ALL CLIENT LENGTH ' + swastikadocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (swastikadocuments.length > 0) {
                swastika.place_order(swastikadocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get swastika Client In view", error);
            }
            //End Process swastika admin client



            //Process mastertrust admin client
            try {
              const mastertrustCollection = db1.collection('mastertrustView');
              const mastertrustdocuments = await mastertrustCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' mastertrust ALL CLIENT LENGTH ' + mastertrustdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (mastertrustdocuments.length > 0) {
                mastertrust.place_order(mastertrustdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get mastertrust Client In view", error);
            }
            //End Process mastertrust admin client


            //Process kotakneo admin client
            try {
              const kotakneoCollection = db1.collection('kotakneoView');
              const kotakneodocuments = await kotakneoCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' kotakneo ALL CLIENT LENGTH ' + kotakneodocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (kotakneodocuments.length > 0) {
                kotakneo.place_order(kotakneodocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get kotakneo Client In view", error);
            }
            //End Process kotakneo admin client



            //Process IIFL admin client
            try {
              const iiflViewCollection = db1.collection('iiflView');
              const iiflViewdocuments = await iiflViewCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' iiflView ALL CLIENT LENGTH ' + iiflViewdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (iiflViewdocuments.length > 0) {
                iiflView.place_order(iiflViewdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get iiflView Client In view", error);
            }
            //End Process iiflView admin client


            //Process Motilaloswal admin client
            try {
              const MotilaloswalViewCollection = db1.collection('MotilalOswalView');
              const MotilaloswalViewdocuments = await MotilaloswalViewCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' MotilaloswalView ALL CLIENT LENGTH ' + MotilaloswalViewdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (MotilaloswalViewdocuments.length > 0) {
                Motilaloswal.place_order(MotilaloswalViewdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get MotilaloswalView Client In view", error);
            }
            //End Process MotilaloswalView admin client



            //Process Zebull admin client
            try {
              const ZebullViewCollection = db1.collection('ZebulView');
              const ZebullViewdocuments = await ZebullViewCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' ZebullView ALL CLIENT LENGTH ' + ZebullViewdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (ZebullViewdocuments.length > 0) {
                Zebull.place_order(ZebullViewdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get ZebullView Client In view", error);
            }
            //End Process ZebullView admin client




            //Process icicidirect admin client
            try {
              const IciciDirectViewCollection = db1.collection('icicidirectview');
              const IciciDirectViewdocuments = await IciciDirectViewCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, web_url: "1" }).toArray();


              fs.appendFile(filePath, 'TIME ' + new Date() + ' ICICI DIRECT View ALL CLIENT LENGTH ' + IciciDirectViewdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });



              if (IciciDirectViewdocuments.length > 0) {
                icicidirect.place_order(IciciDirectViewdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get Icicidirect Client In view", error);
            }
            //End Process icicidirect admin client














          } else {

            //Process Tading View Client Alice Blue
            try {
              const AliceBlueCollection = db1.collection('aliceblueView');
              const AliceBluedocuments = await AliceBlueCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' ALICE BLUE TRADING VIEW CLIENT LENGTH ' + AliceBluedocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (AliceBluedocuments.length > 0) {
                aliceblue.place_order(AliceBluedocuments, signals, token, filePath, signal_req, ExistExitSignal);
              }

            } catch (error) {
              console.log("Error Get Aliceblue Client In view", error);
            }
            //End Process Tading View Client Alice Blue  


            //Process Tading View Client ANGEL
            try {
              const angelCollection = db1.collection('angelView');
              const angeldocuments = await angelCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' ANGEL TRADING VIEW CLIENT LENGTH ' + angeldocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (angeldocuments.length > 0) {
                angel.place_order(angeldocuments, signals, token, filePath, signal_req, ExistExitSignal);
              }

            } catch (error) {
              console.log("Error Get Angel Client In view", error);
            }
            //End Process Tading View Client ANGEL 



            //Process Tading View Client fivepaisa
            try {
              const fivepaisaCollection = db1.collection('fivepaisaView');
              const fivepaisadocuments = await fivepaisaCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' fivepaisa TRADING VIEW CLIENT LENGTH ' + fivepaisadocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (fivepaisadocuments.length > 0) {
                fivepaisa.place_order(fivepaisadocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get fivepaisa Client In view", error);
            }
            //End Process Tading View Client fivepaisa 


            //Process Tading View Client zerodha
            try {
              const zerodhaCollection = db1.collection('zerodhaView');
              const zerodhadocuments = await zerodhaCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' zerodha TRADING VIEW CLIENT LENGTH ' + zerodhadocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (zerodhadocuments.length > 0) {
                zerodha.place_order(zerodhadocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get zerodha Client In view", error);
            }
            //End Process Tading View Client zerodha 



            //Process Tading View Client UPSTOX
            try {
              const upstoxCollection = db1.collection('upstoxView');
              const upstoxdocuments = await upstoxCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' UPSTOX TRADING VIEW CLIENT LENGTH ' + upstoxdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (upstoxdocuments.length > 0) {
                upstox.place_order(upstoxdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get upstox Client In view", error);
            }
            //End Process Tading View Client UPSTOX  


            //Process Tading View Client DHAN
            try {
              const dhanCollection = db1.collection('dhanView');
              const dhandocuments = await dhanCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' dhan TRADING VIEW CLIENT LENGTH ' + dhandocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (dhandocuments.length > 0) {
                dhan.place_order(dhandocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get dhan Client In view", error);
            }
            //End Process Tading View Client DHAN 


            //Process Tading View Client fyers
            try {
              const fyersCollection = db1.collection('fyersView');
              const fyersdocuments = await fyersCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' fyers TRADING VIEW CLIENT LENGTH ' + fyersdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (fyersdocuments.length > 0) {
                fyers.place_order(fyersdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get fyers Client In view", error);
            }
            //End Process Tading View Client fyers 



            //Process Tading View Client markethub
            try {
              const markethubCollection = db1.collection('markethubView');
              const markethubdocuments = await markethubCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' markethub TRADING VIEW CLIENT LENGTH ' + markethubdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (markethubdocuments.length > 0) {
                markethub.place_order(markethubdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get markethub Client In view", error);
            }
            //End Process Tading View Client markethub 



            //Process Tading View Client swastika
            try {
              const swastikaCollection = db1.collection('swastikaView');
              const swastikadocuments = await swastikaCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' swastika TRADING VIEW CLIENT LENGTH ' + swastikadocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (swastikadocuments.length > 0) {
                swastika.place_order(swastikadocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get swastika Client In view", error);
            }
            //End Process Tading View Client swastika 



            //Process Tading View Client mastertrust
            try {
              const mastertrustCollection = db1.collection('mastertrustView');
              const mastertrustdocuments = await mastertrustCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' mastertrust TRADING VIEW CLIENT LENGTH ' + mastertrustdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (mastertrustdocuments.length > 0) {
                mastertrust.place_order(mastertrustdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get mastertrust Client In view", error);
            }
            //End Process Tading View Client mastertrust 


            //Process Tading View Client kotakneo
            try {
              const kotakneoCollection = db1.collection('kotakneoView');
              const kotakneodocuments = await kotakneoCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' kotakneo TRADING VIEW CLIENT LENGTH ' + kotakneodocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (kotakneodocuments.length > 0) {
                kotakneo.place_order(kotakneodocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get kotakneo Client In view", error);
            }
            //End Process Tading View Client kotakneo 



            //Process Tading View Client iifl
            try {
              const iiflCollection = db1.collection('iiflView');
              const iifldocuments = await iiflCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' iifl TRADING VIEW CLIENT LENGTH ' + iifldocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (iifldocuments.length > 0) {
                iifl.place_order(iifldocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get iifl Client In view", error);
            }
            //End Process Tading View Client iifl 




            //Process Tading View Client Motilaloswal
            try {
              const MotilaloswalCollection = db1.collection('MotilaloswalView');
              const Motilaloswaldocuments = await MotilaloswalCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' Motilaloswal TRADING VIEW CLIENT LENGTH ' + Motilaloswaldocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (Motilaloswaldocuments.length > 0) {
                Motilaloswal.place_order(Motilaloswaldocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get Motilaloswal Client In view", error);
            }
            //End Process Tading View Client Motilaloswal 



            //Process Tading View Client Zebull
            try {
              const ZebullCollection = db1.collection('ZebulView');
              const Zebulldocuments = await ZebullCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' Zebull TRADING VIEW CLIENT LENGTH ' + Zebulldocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (Zebulldocuments.length > 0) {
                Zebull.place_order(Zebulldocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get Zebull Client In view", error);
            }
            //End Process Tading View Client Zebull 






            //Process Tading View Client icicidirect
            try {
              const IciciDirectlCollection = db1.collection('icicidirectview');
              const Icicidirectdocuments = await IciciDirectlCollection.find({ "strategys.strategy_name": strategy, "service.name": input_symbol, "category.segment": segment, client_key: client_key, web_url: "2" }).toArray();

              fs.appendFile(filePath, 'TIME ' + new Date() + ' icicidirect TRADING VIEW CLIENT LENGTH ' + Icicidirectdocuments.length + '\n', function (err) {
                if (err) {
                  return console.log(err);
                }
              });


              if (Icicidirectdocuments.length > 0) {
                icicidirect.place_order(Icicidirectdocuments, signals, token, filePath, signal_req);
              }

            } catch (error) {
              console.log("Error Get icicidirect Client In view", error);
            }
            //End Process Tading View Client icicidirect 


          }

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
          const Filter_user = db1.collection('Cilents_service_stg');
          const pipeline = [
            {
              $match: {
                strategy_name: strategy,
                service_name: input_symbol
              }
            },
            {
              $group: {
                _id: "$user_id"
              }
            }
          ];

          const Filter_users = await Filter_user.aggregate(pipeline).toArray();

          const uniqueUserIds = Filter_users.map(user => user._id);



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
              client_persnal_key: client_persnal_key,
              TradeType: TradeType,
              token: instrument_token,
              lot_size: find_lot_size,
              MakeStartegyName: MakeStartegyName,
              exit_status: ExitStatus,
              ft_time: ft_time,
              users_id: uniqueUserIds ? uniqueUserIds : []
            }

            let Signal_req1 = new Signals(Signal_req)
            var SignalSave = await Signal_req1.save();
          } catch (error) {
            return res.send({ status: false, msg: "Insert signal issue" })

          }

          //console.log("findSignal -- strike",findSignal)

          // ENTRY OR EXIST CHECK
          if (type == "LE" || type == "le" || type == "SE" || type == "Se") {

            // var findMainSignals = await MainSignals.find(findSignal)


            // MainSignals FIND IN COLLECTION
            // if (findMainSignals.length == 0) {

            var Entry_MainSignals_req = {
              symbol: input_symbol,
              entry_type: type,
              exit_type: "",
              entry_price: parseFloat(price),
              exit_price: "",
              entry_qty_percent: parseFloat(qty_percent),
              entry_qty: Number(find_lot_size) * (Math.ceil(Number(qty_percent) / 100)),
              exit_qty: 0,
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
              trade_symbol: trade_symbol + "[" + segment1 + "]",
              client_persnal_key: client_persnal_key,
              TradeType: TradeType,
              signals_id: SignalSave._id,
              token: instrument_token,
              lot_size: find_lot_size,
              target: Target,
              stop_loss: StopLoss,
              exit_time: ExitTime,
              exit_time1: 0,
              complete_trade: 0,
              sl_status: sl_status,
              MakeStartegyName: MakeStartegyName,
              Entry_users_id: uniqueUserIds ? uniqueUserIds : []

            }
            const Entry_MainSignals = new MainSignals(Entry_MainSignals_req)
            await Entry_MainSignals.save();

            // } else {

            //   const entry_qty = Number(findMainSignals[0].entry_qty) || 0; // Use 0 if entry_qty is undefined or null
            //   const lot_size = Number(findMainSignals[0].lot_size) || 0; // Use 0 if lot_size is undefined or null
            //   const qty_percent1 = Number(qty_percent) || 0; // Use 0 if qty_percent is not a valid number
            //   const result = entry_qty + (lot_size * Math.ceil(qty_percent1 / 100));


            //   var updatedData = {
            //     entry_price: (((parseFloat(price) * parseFloat(qty_percent)) + (parseFloat(findMainSignals[0].entry_price) * parseFloat(findMainSignals[0].entry_qty_percent))) / (parseFloat(findMainSignals[0].entry_qty_percent) + parseFloat(qty_percent))),

            //     entry_qty_percent: (parseFloat(qty_percent) + parseFloat(findMainSignals[0].entry_qty_percent)),

            //     entry_qty: result,

            //     entry_dt_date: current_date
            //   }
            //   updatedData.$addToSet = { signals_id: SignalSave._id };

            //   // UPDATE PREVIOUS SIGNAL TO THIS SIGNAL 
            //   const updatedDocument = await MainSignals.findByIdAndUpdate(findMainSignals[0]._id, updatedData)

            // }


          }
          else if (type == "LX" || type == "lx" || type == "SX" || type == "Sx") {

            const updatedFindSignal = {
              ...findSignal,
              exit_qty_percent: "" // Adding the exit_qty_percent field with an empty string value
            };

            //console.log("updatedFindSignal ",updatedFindSignal)


            var ExitMainSignals = await MainSignals.find(updatedFindSignal)

            // // ExitMainSignals  FIND IN COLLECTION
            if (ExitMainSignals.length != 0) {

              const entry_qty = Number(ExitMainSignals[0].exit_qty) || 0; // Use 0 if entry_qty is undefined or null
              const lot_size = Number(ExitMainSignals[0].lot_size) || 0; // Use 0 if lot_size is undefined or null
              const qty_percent1 = Number(qty_percent) || 0; // Use 0 if qty_percent is not a valid number
              const result = entry_qty + (lot_size * Math.ceil(qty_percent1 / 100));


              if ((ExitMainSignals[0].exit_price == "" && ExitMainSignals[0].exit_qty_percent == "") || isNaN(ExitMainSignals[0].exit_price)) {



                var exit_qty_percent1 = 0
                if (parseFloat(ExitMainSignals[0].entry_qty_percent) > parseFloat(qty_percent)) {
                  exit_qty_percent1 = parseFloat(qty_percent)
                } else {
                  exit_qty_percent1 = parseFloat(ExitMainSignals[0].entry_qty_percent)
                }


                // IF EXIST ENTRY OF THIS EXIT TRADE
                var updatedData = {
                  exit_type: type,
                  exit_price: parseFloat(price) + (isNaN(ExitMainSignals[0].exit_price) || ExitMainSignals[0].exit_price === "" ? 0 : parseFloat(ExitMainSignals[0].exit_price)),
                  exit_qty_percent: exit_qty_percent1,
                  exit_qty: result,
                  exit_dt_date: current_date,
                  exit_status: ExitStatus,
                  Exit_users_id: uniqueUserIds ? uniqueUserIds : []
                }
                updatedData.$addToSet = { signals_id: SignalSave._id };


                // UPDATE PREVIOUS SIGNAL TO THIS SIGNAL 
                const updatedDocument = await MainSignals.findByIdAndUpdate(ExitMainSignals[0]._id, updatedData)

              } else {

                console.log("ExitMainSignals", ExitMainSignals)

                if (parseFloat(ExitMainSignals[0].entry_qty_percent) >= (parseFloat(qty_percent) + (isNaN(ExitMainSignals[0].exit_qty_percent) || ExitMainSignals[0].exit_qty_percent === "" ? 0 : parseFloat(ExitMainSignals[0].exit_qty_percent)))) {


                  var updatedData = {
                    exit_type: type,
                    exit_price: (((parseFloat(price) * parseFloat(qty_percent)) + ((isNaN(ExitMainSignals[0].exit_price) || ExitMainSignals[0].exit_price === "" ? 0 : parseFloat(ExitMainSignals[0].exit_price)) * (isNaN(ExitMainSignals[0].exit_qty_percent) || ExitMainSignals[0].exit_qty_percent === "" ? 0 : parseFloat(ExitMainSignals[0].exit_qty_percent)))) / ((isNaN(ExitMainSignals[0].exit_qty_percent) || ExitMainSignals[0].exit_qty_percent === "" ? 0 : parseFloat(ExitMainSignals[0].exit_qty_percent)) + parseFloat(qty_percent))),

                    exit_qty_percent: (parseFloat(qty_percent) + (isNaN(ExitMainSignals[0].exit_qty_percent) || ExitMainSignals[0].exit_qty_percent === "" ? 0 : parseFloat(ExitMainSignals[0].exit_qty_percent))),
                    exit_qty: result,
                    exit_dt_date: current_date,
                    exit_status: ExitStatus,
                    Exit_users_id: uniqueUserIds ? uniqueUserIds : []
                  }
                  updatedData.$addToSet = { signals_id: SignalSave._id };


                  // UPDATE PREVIOUS SIGNAL TO THIS SIGNAL 
                  const updatedDocument = await MainSignals.findByIdAndUpdate(ExitMainSignals[0]._id, updatedData)
                } else {
                  console.log("---------------------EXTRA SIGNAL GET")

                }



              }



            } else {
              console.log("PRIVIOUS SIGNAL UPDATE")

            }
          }


        } else {
          return res.send({ status: false, msg: "Incorrect Signal Key" });
        }

        return res.send({ status: true, msg: client_key });
      } else {

        return res.send({ status: false, msg: "No Signal Key Recevie" });
      }

    } else {
      // console.log('receive signals -', req.body);
      return res.send({ status: false, msg: "req is not correct" });
    }

  } catch (error) {
    console.log("error", error);
  }
})



// Server start
app.listen(process.env.PORT, () => {
  connectToMongoDB();
  // ConnectSocket()
  console.log(`Broker Server is running on http://0.0.0.0:${process.env.PORT}`)

});

