module.exports = function (app) {
    const db = require('./App/Models');
    const Alice_token = db.Alice_token;
    const stock_live_price = db.stock_live_price;
    const token_chain = db.token_chain;
    const Store_all_redis_key = db.Store_all_redis_key;
    const dbTest = db.dbTest;
    const dateTime = require('node-datetime');
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;
    const WebSocket = require('ws');
    const client_redis = require('./App/Connection/ConnectRedis');
  
    const uri = 'ws://193.239.237.157:6789'; 
  
    let websocket;
  
    async function connect() {

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
            await connectToDB(message)
          } else {
        
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
  
    app.get("/getRedisData", async (req, res) => {
      let t = 56331;
      let tkr = "FINNIFTY2470924000PE";
      let set_redis_token_key = `ST_${tkr}_${t}`;
      const rr = await client_redis.get(set_redis_token_key);
    
      let keyss = await client_redis.keys('*');
      
      return res.send("okkkkkk");
    });
   
  
 
    async function connectToDB(message) {
      try {
          const collections = await dbTest.listCollections().toArray();
          let collectionName = message.token
          // Check if the desired collection exists
          const collectionExists = collections.some(coll => coll.name === collectionName);
  
          if (collectionExists) {
              const collection = dbTest.collection(collectionName);
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
              await dbTest.createCollection(collectionName);
  
              const collection = dbTest.collection(collectionName);
  
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
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M_' + collectionName);
  
  
      if (collectionExists) {
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
  
      }
  
  
  
    } catch (err) {
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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: { $hour: '$_id' },
                minute: {
                  $subtract: [
                    { $minute: '$_id' },
                    { $mod: [{ $minute: '$_id' }, 3] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
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
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M3_' + collectionName);
  
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M3_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
  
  
      }
  
  
  
    } catch (err) {

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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: { $hour: '$_id' },
                minute: {
                  $subtract: [
                    { $minute: '$_id' },
                    { $mod: [{ $minute: '$_id' }, 5] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
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
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M5_' + collectionName);
  
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M5_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  

  
      }
  
  
  
    } catch (err) {

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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: { $hour: '$_id' },
                minute: {
                  $subtract: [
                    { $minute: '$_id' },
                    { $mod: [{ $minute: '$_id' }, 10] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
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
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M10_' + collectionName);
  
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M10_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
        console.log(`View "${viewName}" created successfully.`);
  
      }
  
  
  
    } catch (err) {
  
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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: { $hour: '$_id' },
                minute: {
                  $subtract: [
                    { $minute: '$_id' },
                    { $mod: [{ $minute: '$_id' }, 15] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
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
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M15_' + collectionName);
  
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M15_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
        console.log(`View "${viewName}" created successfully.`);
  
      }
  
  
  
    } catch (err) {

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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: { $hour: '$_id' },
                minute: {
                  $subtract: [
                    { $minute: '$_id' },
                    { $mod: [{ $minute: '$_id' }, 30] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
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
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M30_' + collectionName);
  
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M30_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
        console.log(`View "${viewName}" created successfully.`);
  
      }
  
  
  
    } catch (err) {

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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: { $hour: '$_id' },
                minute: {
                  $subtract: [
                    { $minute: '$_id' },
                    { $mod: [{ $minute: '$_id' }, 60] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
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
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M60_' + collectionName);
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M60_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
        console.log(`View "${viewName}" created successfully.`);
  
      }
  
  
  
    } catch (err) {
 
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
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: '$_id' },
                month: { $month: '$_id' },
                day: { $dayOfMonth: '$_id' },
                hour: 0, // Set the hour to 0 to round to daily intervals
                minute: 0, // Set the minute to 0 to round to daily intervals
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
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
  
  
      // You can now execute this pipeline in your MongoDB aggregation query.
  
  
      const collections = await dbTest.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M1DAY_' + collectionName);
  
  
      if (collectionExists) {
  
  
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M1DAY_' + collectionName;
        await dbTest.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });
  
        console.log(`View "${viewName}" created successfully.`);
  
      }
  
  
  
    } catch (err) {

    }
  
  
  }
  
  
  };