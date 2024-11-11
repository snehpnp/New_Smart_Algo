module.exports = function (app) {

    const db = require('../Models');
    const Alice_token = db.Alice_token;
    // const test_redis_price = db.test_redis_price;
    const stock_live_price = db.stock_live_price;
    const token_chain = db.token_chain;
    var dateTime = require('node-datetime');
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;

    //r = redis.Redis(host='193.239.237.157', port=6379, password='Accelpix2(*&', db=0)
    
    const redis = require('redis');
    const client_redis = redis.createClient({
        host: '193.239.237.157',
        port: 6379,
        password: "'Accelpix2(*&', db=0)"
      });
    // Connect to Redis
    client_redis.on('connect', function () {
        console.log('Connected to Redis');
    });

    client_redis.connect();

    

    const WebSocket = require('ws');

    const uri = 'ws://193.239.237.157:6789'; // The WebSocket server URI

        let websocket;
        function connect() {
            
            websocket = new WebSocket(uri);

            websocket.on('open', () => {
                console.log('Connected to the server');
            });

            websocket.onmessage = async (event) => {
                const message = JSON.parse(event.data);
         
                try {
                    if (message.token != undefined) {
                        const currentDate = new Date();
                        const hours = currentDate.getHours().toString().padStart(2, '0');
                        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
                        const filter = { _id: message.token }; 
                        const update = {
                            $set: {
                                lp: message.price.toString(),
                                ft: message.time.toString(),
                                v: message.volume.toString(),
                                curtime: `${hours}${minutes}`,
                            },
                        };
                        await stock_live_price.updateOne(filter, update, { upsert: true });
                    } else {
                        console.log('Not token'); // Handle strings without a colon
                    }
                  
                } catch (error) {
                    console.log('Error parsing JSON:', error);
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

   app.get("/getRedisData",async(req,res)=>{
   res.send("okkkkkk")
   })

}


