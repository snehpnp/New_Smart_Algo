"use strict";
require("dotenv").config();
const { connectToMongoDB } = require("./App/Connection/mongo_connection");
const express = require("express");
const app = express();

const axios = require("axios");

const http = require("http");
const https = require("https");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyparser = require("body-parser");
const db1 = require("./App/Models/index");

const { setIO, getIO } = require("./App/Helper/BackendSocketIo");

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],

  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept",
    "authorization",
  ],
};

app.use(cors(corsOpts));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: "10mb", extended: true }));
app.use(bodyparser.json());
app.use(express.json());

const server = http.createServer(app);

require("./App/Cron/cron");
require("./App/Routes")(app);
require("./Utils/request")(app);


// Server start
server.listen(process.env.PORT, () => {
  console.log(`Server is running on  http://0.0.0.0:${process.env.PORT}`);
  connectToMongoDB();
  
});
