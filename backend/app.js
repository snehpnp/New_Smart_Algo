"use strict";
require("dotenv").config();
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




// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("help_from_client", (data) => {
//     socket.broadcast.emit("test_msg_Response", data);
//   });

//   socket.on("logout_user_from_other_device_req", (data111) => {
//     socket.broadcast.emit("logout_user_from_other_device_res", data111);
//   });
// });

// setIO(io)
//   .then(() => {
//     getIO()
//       .then((ioObject) => {})
//       .catch((error) => {});
//   })
//   .catch((error) => {});



app.get("/pp", (req, res) => {
  io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: "okkkk" });
  res.send("DONE");
});



// Server start
server.listen(process.env.PORT, () => {
  console.log(`Server is running on  http://0.0.0.0:${process.env.PORT}`);
  const { Alice_Socket } = require("./App/Helper/Alice_Socket");
  connectToMongoDB();
  // Alice_Socket();
});
