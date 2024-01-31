var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");
const db = require('../Models');

const live_price = db.live_price;
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;



const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db_main = client.db(process.env.DB_NAME);
const dbTradeTools = client.db(process.env.DB_TRADETOOLS);

const ALice_View_data = async (token,response,dbTradeTools) => {
  connectToDB(token,response,dbTradeTools);
}

async function connectToDB(collectionName, response,dbTradeTools) {
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

        createView(collectionName,dbTradeTools);
        createView1(collectionName,dbTradeTools);
        createViewM3(collectionName,dbTradeTools);
        createViewM5(collectionName,dbTradeTools);
        createViewM10(collectionName,dbTradeTools)
       createViewM15(collectionName,dbTradeTools)
        createViewM30(collectionName,dbTradeTools)
       createViewM60(collectionName,dbTradeTools)
      createViewM1DAY(collectionName,dbTradeTools)

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

  async function createView(collectionName,dbTradeTools) {
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
      //console.error('Error View Create:', err);
    }


  }

  async function createView1(collectionName,dbTradeTools) {
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
      //console.error('Error View Create:', err);
    }


  }

  async function createViewM3(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }

  async function createViewM5(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }

  async function createViewM10(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }

  async function createViewM15(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }

  async function createViewM30(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }

  async function createViewM60(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }

  async function createViewM1DAY(collectionName,dbTradeTools) {
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
      // console.log('Error View Create 5 minute:', err);
    }


  }
module.exports = { ALice_View_data }
