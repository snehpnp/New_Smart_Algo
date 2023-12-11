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

const db = require('../BACKEND/App/Models')
const Alice_token = db.Alice_token;
const UserMakeStrategy = db.UserMakeStrategy;


// REQUIRE File
require('./App/Cron/cron')

const { createView, dashboard_view } = require('./View/Alice_blue')
const { createViewAngel } = require('./View/Angel')
const { createViewFivepaisa } = require('./View/fivepaisa')
const { createViewZerodha } = require('./View/zerodha')

// TEST API
app.get('/get', async (req, res) => {
 // createViewZerodha()
  // createViewFivepaisa()
  // createViewAngel()
  //createView()
  res.send({ msg: "Done!!!" })
});

app.get('/ok',async (req,res)=>{

  res.send("okk")
})



//Testing Api #Shakir
require("./shakirTeting")(app)

// Routes all
require("./App/Routes")(app)

// EMERGANCY
require("./App/Emergency Apis/service")(app)
require("./App/Emergency Apis/getOptionSymbols")(app)

require("./request")(app)




const { Alice_Socket } = require('./App/Helper/Alice_Socket')


app.get('/token/dd', async (req, res) => {
  Alice_Socket()
  res.send({ msg: "Done!!!" })
})



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





// Server start
server.listen(process.env.PORT, () =>{

  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`)
  Alice_Socket()
});