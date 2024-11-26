"use strict";
require("dotenv").config();
// const mongoConnection = require('./App/Connection/mongo_connection')
const { connectToMongoDB } = require("./App/Connection/mongo_connection");

const express = require("express");
const app = express();

// HELLO SNEH JAISWAL
const http = require("http");
const https = require("https");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyparser = require("body-parser");

const db1 = require("./App/Models/index");

const dbTest = db1.dbTest;


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
const server = http.createServer(app);
app.use(express.json());

// REQUIRE File
require("./App/Cron/cron");
// require("./App/Cron/cron_ss");
// Routes all
require("./App/Routes")(app);
// EMERGANCY
require("./Utils/request")(app);

// require("./Teting")(app);

//require("./redisSocketConnect")(app)

// Connect Local backend Socket
const { setIO, getIO } = require("./App/Helper/BackendSocketIo");


const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("help_from_client", (data) => {
    socket.broadcast.emit("test_msg_Response", data);
  });

  socket.on("logout_user_from_other_device_req", (data111) => {
    socket.broadcast.emit("logout_user_from_other_device_res", data111);
  });
});

setIO(io)
  .then(() => {
    getIO()
      .then((ioObject) => {})
      .catch((error) => {});
  })
  .catch((error) => {});

app.get("/pp", (req, res) => {
  io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: "okkkk" });
  res.send("DONE");
});




app.get('/UpdateChannel/:c/:e', async (req, res) => {
  const {  TruncateTableTokenChainAdd_fiveMinute } = require('./App/Cron/cron_ss')
  const { c ,e} = req.params;

  
  TruncateTableTokenChainAdd_fiveMinute()
  return res.send({ status: true, msg: 'Channel Update' });

  const { updateChannelAndSend } = require('./App/Helper/Alice_Socket')
  
   //updateChannelAndSend(c)
});



app.get("/deleteTableAndView",async(req,res)=>{
  await checkAndDrop();
  return res.send({ status: true, msg: 'Table and View Deleted' });
})


async function checkAndDrop() {
  const collections = await dbTest.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);
  console.log("Existing collections/views:", collectionNames);
  let arr =  ['22','3045','2885','6705','10666']
  let arr1 =  ['M_','M3_','M5_','M10_','M15_','M30_','M60_','M1DAY_']
  for (const element of arr) {
    console.log("Dropping collection:", element);
    await dbTest.collection(element).drop();
      for (const element1 of arr1) {

          const collectionName = element1 + element;

          if (collectionNames.includes(collectionName)) {
               await dbTest.collection(collectionName).drop();
          } else {
              console.log("Collection/View not found:", collectionName);
          }
      }
  }
}





const { Alice_Socket } = require("./App/Helper/Alice_Socket");

// Server start
server.listen(process.env.PORT, () => {
  console.log(`Server is running on  http://0.0.0.0:${process.env.PORT}`);
  connectToMongoDB();
  Alice_Socket();
});
