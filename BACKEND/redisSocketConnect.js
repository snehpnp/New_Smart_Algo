module.exports = function (app) {

    const db = require('./App/Models');
    const Alice_token = db.Alice_token;
    const test_redis_price = db.test_redis_price;
    const stock_live_price = db.stock_live_price;
    const token_chain = db.token_chain;
    var dateTime = require('node-datetime');
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;
    
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    

    const WebSocket = require('ws');

    const uri = 'ws://193.239.237.157:6789'; // The WebSocket server URI

let websocket;
function connect() {
    console.log('INSIDE ');
    
    websocket = new WebSocket(uri);

    websocket.on('open', () => {
        console.log('Connected to the server');
    });

    websocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
       console.log('Received message:', message.token);
        try {
            if (message.token != undefined) {
                const filter = { _id: message.token }; 
                const update = {
                    $set: {
                        lp: message.price,
                        ft: message.time,
                        v: message.volume,
                        curtime: `${hours}${minutes}`,
                    },
                };
                await test_redis_price.updateOne(filter, update, { upsert: true });
            } else {
                console.log('Not token'); // Handle strings without a colon
            }
            // const response = JSON.parse(message);
            // console.log('Parsed response:', response);
            // Process the response data here
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    };

    websocket.on('error', (error) => {
        console.log(`WebSocket error: ${error}`);
    });

    websocket.on('close', () => {
        console.log('Disconnected from the server, attempting to reconnect...');
        setTimeout(connect, 15000); 
    });
}

// Initialize the first connection
connect();

}


