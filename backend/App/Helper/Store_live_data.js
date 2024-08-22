
var axios = require('axios');

const db = require('../Models');
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

  socket.on('LiVE_DATA', async (data) => {

   
   var response = data.data 
   
  
   if (response.tk) {

    /////------------------- STORE DATA LIVE PRICE COLLECTION ----------------------//////
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
     
     /////------------------- END STORE DATA LIVE PRICE COLLECTION ----------------------//////
     
     


     /////-------------------  STORE LIVE DATA MAKE VIEW  COLLECTION --------------------//////
     ///↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
   const Make_startegy_token = await UserMakeStrategy.findOne({ tokensymbol: response.tk }, { _id: 1 });

   if (Make_startegy_token) {
   await connectToDB(response.tk, response);
   }

  async function connectToDB(collectionName, response) {
    try {

     
      const collections = await dbTradeTools.listCollections().toArray();

      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === collectionName);

      if (collectionExists) {
        const collection = dbTradeTools.collection(collectionName);
        if (response.lp != undefined && response.v != undefined) {
          const customTimestamp = new Date();
          let singleDocument = {
            _id: customTimestamp,
            lp: parseFloat(response.lp),
            v: parseFloat(response.v)
          }

         
          const insertResult = await collection.insertOne(singleDocument);
        }

      await  createView(collectionName);
      await  createView1(collectionName);
      await  createViewM3(collectionName);
      await  createViewM5(collectionName);
      await  createViewM10(collectionName)
      await  createViewM15(collectionName)
      await  createViewM30(collectionName)
      await  createViewM60(collectionName)
      await  createViewM1DAY(collectionName)

      } else {
         
        await dbTradeTools.createCollection(collectionName);
        

        const collection = dbTradeTools.collection(collectionName);
        // const singleDocument = { name: 'John', age: 30 };

        if (response.lp != undefined && response.v != undefined) {

          const customTimestamp = new Date();

          let singleDocument = {
            _id: customTimestamp,
            lp: parseFloat(response.lp),
            v: parseFloat(response.v)
          }

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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M_' + collectionName);
     

      if (collectionExists) {

      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        
      }



    } catch (err) {
  
    }


  }

  async function createView1(collectionName) {
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
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M1_' + collectionName);
      

      if (collectionExists) {

      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M1_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M3_' + collectionName);
     

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M3_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M5_' + collectionName);
  

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M5_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M10_' + collectionName);
      

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M10_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M15_' + collectionName);
      

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M15_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M30_' + collectionName);
    

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M30_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M60_' + collectionName);

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M60_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
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


      const collections = await dbTradeTools.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M1DAY_' + collectionName);
 

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M1DAY_' + collectionName;
        await dbTradeTools.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
     
    }


  }
    



  /////------------------- END STORE LIVE DATA MAKE VIEW  COLLECTION ----------------------//////


   }


    
  });
});

// Disconnect event
socket.on('disconnect', () => {
  console.log('Disconnected from Server 1');
});

// Error event
socket.on('error', (error) => {
 console.log(`Error: ${error}`);
});