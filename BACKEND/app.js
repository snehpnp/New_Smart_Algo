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
app.use(bodyparser.json());
const server = http.createServer(app);




// REQUIRE File
require('./App/Cron/cron')




// TEST API 
app.get('/get', async (req, res) => {
  res.send({ msg: "Done!!!" })
})

//Testing Api #Shakir
require("./shakirTeting")(app)



// Routes all
require("./App/Routes")(app)



// Server start
server.listen(process.env.PORT, () =>
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`)
);