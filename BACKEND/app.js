"use strict";
require('dotenv').config();
const mongoConnection = require('./App/Connection/mongo_connection')
const express = require("express");
const app = express();

// HELLO SNEH
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");
const cors = require('cors');
const bodyparser = require('body-parser')


const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept", "authorization",
  ],
};
app.use(cors(corsOpts));


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb', extended: true }));

app.use(bodyparser.json());
const server = http.createServer(app);
app.use(express.json());


// REQUIRE File
require('./App/Cron/cron')

const { createView, dropExistingView, TradeHistroy, dashboard_view } = require('./View/Alice_blue')
const { TokenSymbolUpdate, TruncateTable, tokenFind } = require('./App/Cron/cron')

const db = require('../BACKEND/App/Models')
const Alice_token = db.Alice_token;


// TEST API
app.get('/tokenFind', async (req, res) => {
  try {


    // Your request parameters
    const symbol = 'NIFTY';
    const expiry = '26102023';
    const strike = '19300';
    const limit_set = 10;
    const data = await Alice_token.aggregate([
      {
        $match: {
          $and: [
            { symbol: symbol },
            { expiry: expiry },
            { segment: 'O' },
            {
              $or: [{ option_type: 'CE' }, { option_type: 'PE' }],
            },
            {
              $or: [
                { strike: { $gte: (strike - 10) } }, // Get documents with strike 10 or more below
                { strike: { $lte: (strike + 10) } }, // Get documents with strike 10 or more above
              ],
            },
          ],
        },
      },
      // Add the remaining stages as in your original code
      {
        $group: {
          _id: {
            strike: '$strike',
            symbol: '$symbol',
            expiry: '$expiry',
          },
          call_token: {
            $first: {
              $cond: [
                { $eq: ['$option_type', 'CE'] },
                '$instrument_token',
                null,
              ],
            },
          },
          put_token: {
            $first: {
              $cond: [
                { $eq: ['$option_type', 'PE'] },
                '$instrument_token',
                null,
              ],
            },
          },
        },
      },
      {
        $sort: {
          '_id.strike': 1,
        },
      },
      {
        $group: {
          _id: null,
          data: {
            $push: {
              symbol: '$_id.symbol',
              strike_price: '$_id.strike',
              call_token: '$call_token',
              put_token: '$put_token',
              expiry: '$_id.expiry',
            },
          },
          channellist: {
            $push: {
              $concat: [
                'NFO|',
                { $toString: '$call_token' },
                { $toString: '$put_token' },
              ],
            },
          },
        },
      },
    ]);
    


res.send({ data: data,
  channellist: data[0].channellist.join('#')})
    // return findData


  } catch (err) {
    console.log(err);
  }
})

// TEST API
app.get('/tradesymbol', async (req, res) => {
  TokenSymbolUpdate()
  res.send({ msg: "Done!!!" })
})


// TEST API
app.get('/tradehistory/view', async (req, res) => {
  TradeHistroy()
  res.send({ msg: "View Create!!!" })
})

app.get('/tradesymbol1', async (req, res) => {
  TruncateTable()
  res.send({ msg: "Done!!!" })
})


// TEST API
app.get('/get', async (req, res) => {
  createView()
  res.send({ msg: "Done!!!" })
})


app.get('/view-delete', async (req, res) => {
  dropExistingView()
  res.send({ msg: "Done!!!" })
})


app.get('/dashboard-view', async (req, res) => {
  dashboard_view()
  res.send({ msg: "Done!!!" })
})

//Testing Api #Shakir
require("./shakirTeting")(app)

// Routes all
require("./App/Routes")(app)

// EMERGANCY
require("./App/Emergency Apis/service")(app)
require("./App/Emergency Apis/getOptionSymbols")(app)




//  ----------------------------   for help center ------------------
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true
  }
}
);


io.on("connection", (socket) => {
  socket.on("help_from_client", (data) => {
    socket.broadcast.emit("test_msg_Response", data);
  });

  socket.on("logout_user_from_other_device_req", (data111) => {
    socket.broadcast.emit("logout_user_from_other_device_res", data111);
  });


})




//  ----------------------------   for help center ------------------





// Server start
server.listen(process.env.PORT, () =>
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`)
);