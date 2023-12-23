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


// MODAL REQUIRE
require('../BACKEND/App/Models')

// REQUIRE File
require('./App/Cron/cron')

// Routes all

require("./App/Routes")(app)


require("./shakirTeting")(app)

// EMERGANCY
require("./App/Emergency Apis/service")(app)
require("./App/Emergency Apis/getOptionSymbols")(app)
require("./request")(app)





//  ----------------------------   for help center ------------------
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true
  }
}
);

io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);

  
  socket.on("help_from_client", (data) => {
    socket.broadcast.emit("test_msg_Response", data);
  });

  socket.on("logout_user_from_other_device_req", (data111) => {
    socket.broadcast.emit("logout_user_from_other_device_res", data111);
  });

})


const { Alice_Socket } = require('./App/Helper/Alice_Socket')


// Server start
server.listen(process.env.PORT, () =>{

  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`)
  Alice_Socket()
});