module.exports = function (app) {
    const db = require('./App/Models');
    const Alice_token = db.Alice_token;
    const stock_live_price = db.stock_live_price;
    const token_chain = db.token_chain;
    const StoreAllRedisKey = db.StoreAllRedisKey;
    const dbTradeTools = db.dbTradeTools;
    const dateTime = require('node-datetime');
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;
    const WebSocket = require('ws');
    const client_redis = require('./App/Connection/ConnectRedis');
  
    const uri = 'ws://193.239.237.157:6789'; // The WebSocket server URI
  
    let websocket;
  
    async function connect() {
      console.log('INSIDE ');
      console.log('URI:', await abc());
      websocket = new WebSocket(uri);
  
      websocket.on('open', () => {
        console.log('Connected to the server');
      });
  
      websocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
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
            await connectToDB(message)
          } else {
            console.log('Not token'); // Handle strings without a colon
          }
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
  
    app.get("/getRedisData", async (req, res) => {
      let t = 56331;
      let tkr = "FINNIFTY2470924000PE";
      let set_redis_token_key = `ST_${tkr}_${t}`;
      const rr = await client_redis.get(set_redis_token_key);
      console.log('rr:', rr);
      let keyss = await client_redis.keys('*');
      console.log('All keyss:', keyss);
      return res.send("okkkkkk");
    });
   
  
    //Create All View
    async function abc() {
      return "okkkkkk";
    }
  
    async function connectToDB(message) {
      try {
          const collections = await dbTradeTools.listCollections().toArray();
          // lp: message.price.toString(),
          //       ft: message.time.toString(),
          //       v: message.volume.toString(),
  
          let collectionName = message.token
          let price = message.price
          let volume = message.volume
          let time = message.time
          // Check if the desired collection exists
          const collectionExists = collections.some(coll => coll.name === collectionName);
  
          if (collectionExists) {
              const collection = dbTradeTools.collection(collectionName);
              if (message.price != undefined && message.volume != undefined) {
                  const customTimestamp = new Date();
                  let singleDocument = {
                      _id: customTimestamp,
                      lp: parseFloat(message.price),
                      v: parseFloat(message.volume)
                  };
                  const insertResult = await collection.insertOne(singleDocument);
              }
  
              const collectionExistsViews = collections.some(coll => coll.name === 'M3_' + collectionName);
              if (!collectionExistsViews) {
                  await createView(collectionName);
                  await createViewM3(collectionName);
                  await createViewM5(collectionName);
                  await createViewM10(collectionName);
                  await createViewM15(collectionName);
                  await createViewM30(collectionName);
                  await createViewM60(collectionName);
                  await createViewM1DAY(collectionName);
              }
          } else {
              await dbTradeTools.createCollection(collectionName);
  
              const collection = dbTradeTools.collection(collectionName);
  
              if (message.price != undefined && message.volume != undefined) {
                  const customTimestamp = new Date();
                  let singleDocument = {
                      _id: customTimestamp,
                      lp: parseFloat(message.price),
                      v: parseFloat(message.volume)
                  };
                  const insertResult = await collection.insertOne(singleDocument);
              }
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createView(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: '$_id',
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM3(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 3,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M3_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M3_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM5(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 5,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M5_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M5_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM10(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 10,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M10_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M10_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM15(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 15,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M15_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M15_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM30(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 30,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M30_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M30_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM60(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d %H:%M',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 60,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M60_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M60_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  async function createViewM1DAY(collectionName) {
      try {
          const pipeline = [
              {
                  $project: {
                      _id: {
                          $toDate: '$_id',
                      },
                      lp: 1,
                      v: 1,
                  },
              },
              { $sort: { _id: 1 } },
              {
                  $group: {
                      _id: {
                          $dateToString: {
                              format: '%Y-%m-%d',
                              date: {
                                  $subtract: [
                                      { $toLong: '$_id' },
                                      {
                                          $mod: [
                                              { $toLong: '$_id' },
                                              1000 * 60 * 60 * 24,
                                          ],
                                      },
                                  ],
                              },
                          },
                      },
                      open: { $first: '$lp' },
                      high: { $max: '$lp' },
                      low: { $min: '$lp' },
                      close: { $last: '$lp' },
                      MaxVol: { $max: '$v' },
                      MinVol: { $min: '$v' },
                  },
              },
          ];
  
          const collections = await dbTradeTools.listCollections().toArray();
          const collectionExists = collections.some(coll => coll.name === 'M1DAY_' + collectionName);
  
          if (!collectionExists) {
              const viewName = 'M1DAY_' + collectionName;
              await dbTradeTools.createCollection(viewName, {
                  viewOn: collectionName,
                  pipeline: pipeline,
              });
          }
      } catch (err) {
          console.error(err);
      }
  }
  
  };