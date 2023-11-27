var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");

const {Alice_Socket , getSocket}  = require('./Alice_Socket');
const db = require('../Models');

const live_price = db.live_price;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;



const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
const Socket_data = async (channelList) => {
    console.log("requestttttt")
    const socket = await getSocket();
    console.log("socket ",typeof socket)
    if(socket == null){
        console.log("socket ifffff")
       // const socket11 = await Alice_Socket();
    }
      if (socket) {
      // You can now use the 'socket' instance here
      //socket.send('Hello from OtherFile!');
      let json = {
        k: channelList,
        t: 't'
     };
     socket.send(JSON.stringify(json));

    //  socket.onmessage = async function (msg) {
  
    //   var response = JSON.parse(msg.data)

    //   console.log("okk response sssss   finallll  ",response)

     
    //   }

    }


}
module.exports = { Socket_data }
