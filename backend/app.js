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
const { Client } = require("ssh2");
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
require("./request")(app);

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


app.post("/pm2/update", async (req, res) => {
  const { host, password } = req.body;

  if (!host || !password) {
    return res.status(400).send("Host and Password are required");
  }

  const conn = new Client();

  conn
    .on("ready", () => {
      console.log(`Connected to ${host}`);

      // Step 1: Restart MongoDB
      conn.exec("systemctl restart mongod", (err, stream) => {
        if (err) {
          console.error("Error restarting MongoDB:", err);
          conn.end();
          return res.status(500).send({ status: false, msg: "MongoDB restart failed" });
        }

        stream
          .on("close", (code, signal) => {
            console.log(`MongoDB restarted on ${host}. Exit code: ${code}`);
            
            // Step 2: Update PM2
            conn.exec("pm2 update", (err, stream) => {
              if (err) {
                console.error("Error updating PM2:", err);
                conn.end();
                return res.status(500).send({ status: false, msg: "PM2 update failed" });
              }

              stream
                .on("close", (code, signal) => {
                  console.log(`PM2 updated on ${host}. Exit code: ${code}`);
                  conn.end();
                  return res.send({ status: true, msg: "Commands executed successfully" });
                })
                .on("data", (data) => {
                  console.log(`PM2 update output: ${data}`);
                })
                .stderr.on("data", (data) => {
                  console.error(`PM2 update error: ${data}`);
                });
            });
          })
          .on("data", (data) => {
            console.log(`MongoDB restart output: ${data}`);
          })
          .stderr.on("data", (data) => {
            console.error(`MongoDB restart error: ${data}`);
          });
      });
    })
    .on("error", (err) => {
      console.error(`Connection error: ${err}`);
      return res.status(500).send({ status: false, msg: "SSH Connection Failed" });
    })
    .connect({
      host: host,
      port: 22,
      username: "root",
      password: password,
    });
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
