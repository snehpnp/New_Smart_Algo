"use strict";
require('dotenv').config();
// const mongoConnection = require('./App/Connection/mongo_connection')
const {connectToMongoDB} = require('./App/Connection/mongo_connection');


const express = require("express");
const app = express();

// HELLO SNEH JAISWAL
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");
const cors = require('cors');
const bodyparser = require('body-parser')
const { Client } = require('ssh2');


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

// Routes all
require("./App/Routes")(app)



// EMERGANCY

require("./request")(app)
// require("./shakirTeting")(app)
// require("./redisSocketConnect")(app)


// Connect Local backend Socket
const { setIO ,getIO} = require('./App/Helper/BackendSocketIo');



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



setIO(io).then(() => {
   
   getIO().then(ioObject => {
   }).catch(error => {
   });
 
 }).catch((error) => {

 });


 app.get("/pp",(req,res)=>{
  io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: "okkkk" });
  res.send("DONE")
 });





 app.post('/pm2/update', async (req, res) => {
  const { host, password } = req.body;

  if (!password) {
    return res.status(400).send('Password is required');
  }

  const conn = new Client();

  conn.on('ready', () => {
    console.log(`Connected to ${host}`);

    // Run pm2 update command
    conn.exec('pm2 update', (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Closed connection to ${host} with code ${code}`);
        conn.end();
      }).on('data', (data) => {
        console.log(`STDOUT: ${data}`);
      }).stderr.on('data', (data) => {
        console.log(`STDERR: ${data}`);
      });
    });
  }).connect({
    host: host,
    port: 22,
    username: 'root',
    password: password
  });


  return res.send({ status: true, msg: 'PM2 update initiated on all servers.' });
});



// Server start
server.listen(process.env.PORT, () =>{
   connectToMongoDB();
  const { Alice_Socket } = require('./App/Helper/Alice_Socket')
  console.log(`Server is running on  http://0.0.0.0:${process.env.PORT}`)
   Alice_Socket()
});