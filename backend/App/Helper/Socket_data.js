var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");

const {Alice_Socket , getSocket}  = require('./Alice_Socket');
const db = require('../Models');

const live_price = db.live_price;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;



const Socket_data = async (channelList) => {

    const socket = await getSocket();
    if(socket == null){
       // const socket11 = await Alice_Socket();
    }
      if (socket) {
      let json = {
        k: channelList,
        t: 't'
     };
     socket.send(JSON.stringify(json));

    }


}
module.exports = { Socket_data }
