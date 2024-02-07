
var axios = require('axios');

const db = require('../Models');
const { ALice_View_data } = require('./ALice_View_data');
const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
client.connect();

const db_main = client.db(process.env.DB_NAME);
const dbTradeTools = client.db(process.env.DB_TRADETOOLS);
 

let socketObject = null;






const ioClient = require('socket.io-client');
// Replace with the actual IP address of Server 1
const server1URL = 'http://193.239.237.136:7700';
// Create a new Socket.IO client
const socket = ioClient(server1URL);

// Connect event
socket.on('connect', () => {
  console.log('Connected to Server 1');

  socket.on('shk', async (data) => {
   console.log("Received data from 'shk':", data.data);
   
   var response = data.data 
   
   console.log("response token", response.tk);
  
   if (response.tk) {

    const Make_startegy_token = await UserMakeStrategy.findOne({ tokensymbol: response.tk }, { _id: 1 });
  
    // if (Make_startegy_token) {
    //     ALice_View_data(response.tk, response,dbTradeTools);
    // }

    ALice_View_data(response.tk, response,dbTradeTools);


    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const stock_live_price = db_main.collection('stock_live_price');
    const filter = { _id: response.tk }; 


    if (response.lp != undefined) {
        let bp1 = response.lp
        let sp1 = response.lp

        if (response.bp1 != undefined) {
            bp1 = response.bp1;
        }

        if (response.sp1 != undefined) {
            sp1 = response.sp1;
        }

        const update = {
            $set: {
                lp: response.lp,
                exc: response.e,
                sp1: sp1,
                bp1: bp1,
                curtime: `${hours}${minutes}`
            },
        };
        const result = await stock_live_price.updateOne(filter, update, { upsert: true });
    }







   }


    
  });
});

// Disconnect event
socket.on('disconnect', () => {
  console.log('Disconnected from Server 1');
});

// Error event
socket.on('error', (error) => {
  console.error(`Error: ${error}`);
});