"use strict";
require("dotenv").config();
const { connectToMongoDB } = require("./App/Connection/mongo_connection");
const express = require("express");
const app = express();

const axios = require("axios");
// HELLO SNEH JAISWAL
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


app.get("/pp", (req, res) => {
  io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: "okkkk" });
  res.send("DONE");
});

const { Alice_Socket } = require("./App/Helper/Alice_Socket");



app.get('/UpdateChannel/:c/:e', async (req, res) => {
  const {  TruncateTableTokenChainAdd_fiveMinute } = require('./App/Cron/cron_ss')
  const { c ,e} = req.params;
  
  TruncateTableTokenChainAdd_fiveMinute()
  return res.send({ status: true, msg: 'Channel Update' });

});




app.get("/deleteTableAndView",async(req,res)=>{
  await checkAndDrop();
  return res.send({ status: true, msg: 'Table and View Deleted' });
})


async function checkAndDrop() {
  const collections = await dbTest.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);
  
  // let arr =  ['22','3045','2885','6705','10666']
  let arr =  ['426307','429116','437992','437993']
  let arr1 =  ['M_','M3_','M5_','M10_','M15_','M30_','M60_','M1DAY_']
  for (const element of arr) {
   
    if (collectionNames.includes(element)) {
      await dbTest.collection(element).drop();
      for (const element1 of arr1) {

          const collectionName = element1 + element;

          if (collectionNames.includes(collectionName)) {
               await dbTest.collection(collectionName).drop();
          }
      }
    }

   
  }
}


app.get("/restart/socket", (req, res) => {
  Alice_Socket();
  res.send("DONE");
});


app.get("/all/socket/restart", (req, res) => {
  let UrlArr = [
    "https://software.tradeonn.com/backend/restart/socket",
    "https://software.corebizinfotech.com/backend/restart/socket",
    "https://newpenal.pandpinfotech.com/backend/restart/socket",
    "https://software.sumedhainn.com/backend/restart/socket",
  ];

  UrlArr.forEach((url) => {
    axios
      .get(url)
      .then((response) => {
      })
      .catch((error) => {
      });
  });

  return res.send("DONE");
});

// Server start
server.listen(process.env.PORT, () => {
  console.log(`Server is running on  http://0.0.0.0:${process.env.PORT}`);
  connectToMongoDB();
  Alice_Socket();
});
