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




// REQUIRE File
require('./App/Cron/cron')


const { createView, dropExistingView } = require('./View/Alice_blue')
const { TokenSymbolUpdate ,TruncateTable} = require('./App/Cron/cron')

// TEST API
app.get('/tradesymbol', async (req, res) => {
  TokenSymbolUpdate()
  res.send({ msg: "Done!!!" })
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
app.get('/get1', async (req, res) => {
  dropExistingView()
  res.send({ msg: "Done!!!" })
})

//Testing Api #Shakir
require("./shakirTeting")(app)



// Routes all
require("./App/Routes")(app)


// EMERGANCY
require("./App/Emergency Apis/service")(app)




// Server start
server.listen(process.env.PORT, () =>
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`)
);