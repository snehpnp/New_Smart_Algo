module.exports = function (app) {

  const WebSocket = require('ws');
  var CryptoJS = require("crypto-js");

  const db = require('./App/Models');

  const services = db.services;
  const categorie = db.categorie;
  const UserMakeStrategy = db.UserMakeStrategy;

  const { MongoClient } = require('mongodb');

 //  const uri = "mongodb://localhost:27017/";
 const uri = "mongodb+srv://snehpnp:snehpnp@newsmartalgo.n5bxaxz.mongodb.net/";
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  client.connect();
  console.log("Connected to MongoDB successfully!");



  app.get('/shakirTest', async (req, res) => {

    const pipeline = [

      {
        $lookup: {
          from: 'categories',
          localField: 'categorie_id',
          foreignField: '_id',
          as: 'categoryResult'
        }
      },
      {
        $match: {
          'categoryResult.segment': "C",
        }
      },

      // {$project: {



      //  }},
      { $sort: { _id: 1 } },

      {
        $unwind: '$categoryResult', // Unwind the 'categoryResult' array
      },

    ];

    const result = await services.aggregate(pipeline);
    res.send({ status: true, data: result });
    return



  });





  async function connectToDB(collectionName, response) {
    try {



      const db = client.db('TradeTools'); // Replace 'mydb' with your desired database name
      // console.log("db",db);
      //  const collectionName = 'shakir'; // Replace with your desired collection name

      // List all collections in the database
      const collections = await db.listCollections().toArray();

      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === collectionName);

      if (collectionExists) {
        //console.log(`Collection '${collectionName}' exists.`);

        const collection = db.collection(collectionName);

        if (response.lp != undefined && response.v != undefined) {

          const customTimestamp = new Date();

          let singleDocument = {
            _id: customTimestamp,
            lp: parseFloat(response.lp),
            v: parseFloat(response.v)
          }


          const insertResult = await collection.insertOne(singleDocument);
          // console.log('Inserted document:', insertResult.insertedId);
        }

        createView(collectionName);
        createViewM3(collectionName);
        createViewM5(collectionName);
        createViewM10(collectionName)
        createViewM15(collectionName)
        createViewM30(collectionName)
        createViewM60(collectionName)
        createViewM1DAY(collectionName)

      } else {
        // console.log(`Collection '${collectionName}' does not exist.`);
        await db.createCollection(collectionName);
        // console.log(`Collection '${collectionName}' created successfully`);

        const collection = db.collection(collectionName);
        // const singleDocument = { name: 'John', age: 30 };

        if (response.lp != undefined && response.v != undefined) {

          const customTimestamp = new Date();

          let singleDocument = {
            _id: customTimestamp,
            lp: parseFloat(response.lp),
            v: parseFloat(response.v)
          }

          const insertResult = await collection.insertOne(singleDocument);
          //console.log('Inserted document:', insertResult.insertedId);
        }

      }

    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }

  async function createView(collectionName) {
    try {
      const db = client.db('TradeTools');

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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M_' + collectionName);
      // console.log("collectionExists view 1 minute",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      //console.error('Error View Create:', err);
    }


  }
  async function createViewM3(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M3_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M3_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }
  async function createViewM5(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M5_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M5_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }
  async function createViewM10(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M10_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M10_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }
  async function createViewM15(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M15_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M15_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }
  async function createViewM30(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M30_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M30_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }
  async function createViewM60(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M60_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M60_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }
  async function createViewM1DAY(collectionName) {
    try {
      const db = client.db('TradeTools');


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


      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(coll => coll.name === 'M1DAY_' + collectionName);
      // console.log("collectionExists view",collectionExists)
      // console.log("pipeline",pipeline)

      if (collectionExists) {


      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = 'M1DAY_' + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);

      }



    } catch (err) {
      // console.error('Error View Create 5 minute:', err);
    }


  }




  app.get("/testing_socket", function (req, res) {

    const io = require("socket.io-client");

    // Connect to the server using Socket.IO
    const socket = io("http://180.149.241.128:3001"); // Replace "your_server_address" with your actual server address

    // Listen for the "pankaj_sir" event from the server
    socket.on("testing_data", (response) => {
      console.log("Received data ':", response);
      // Do something with the received data here
      if (response.tk) {
        //console.log("response",response)
        connectToDB(response.tk, response);
        // console.log("token --",response.tk);
        getTokenStrategy(response.tk) 
        

      }
    });

    // Handle disconnection (optional)
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Handle errors (optional)
    socket.on("error", (error) => {
      console.error("Socket.IO Error:", error);
    });

    res.send("okkkk ")
  })

  async function getTokenStrategy(token){
    console.log("inside token --",token);

    const pipeline1 = [

      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userResult'
        }
      },

      {
        $unwind: '$userResult', //
      },
      {
        $match: {
          tokensymbol : token,
          status:"0"
        },
      },
      {
        $project: {
      
          user_id:1,
          tokensymbol:1,
          timeframe:1,
          indicator:1,
          price_source:1,
          period:1,
          inside_indicator:1,
          condition:1,
          buffer_value:1,
          createdAt:1,
          updatedAt:1,
         'userResult.UserName': 1, 
    
        }
      }
      
    ];

    const result = await UserMakeStrategy.aggregate(pipeline1);

    if (result.length > 0) {
     // console.log("result ",result)

      result.forEach(element => {
        callStartegy(element)
      });
     // return res.json({ status: true, msg: 'Get all', data: result });

    } else {

      console.log("No data Available ")

     // return res.json({ status: false, msg: 'An error occurred', data: [] });
    }
    

  }

  async function callStartegy(element){
        let id=element._id;
        let user_id=element.user_id;
        let tokensymbol=element.tokensymbol;
        let timeframe=element.timeframe;
        let indicator=element.indicator;
        let price_source=element.price_source;
        let period=element.period;
        let inside_indicator=element.inside_indicator;
        let condition=element.condition;
        let buffer_value=element.buffer_value;
        let UserName=element.userResult.UserName;
        
        console.log("inside tokensymbol ",tokensymbol)
        console.log("inside UserName ",UserName)
        console.log("price_source ",price_source)

        const db = client.db('TradeTools');
        let collectionName = 'M' + timeframe + '_' + tokensymbol;

        const collection = db.collection(collectionName);
        
      
          let incule_field = "";
          if (price_source == "open") {
            incule_field = {
              open: 1, // Include field1
            }
          } else if (price_source == "close") {
            incule_field = {
              close: 1, // Include field1
            }
          }
          else if (price_source == "high") {
            incule_field = {
              high: 1, // Include field1
            }
          }
          else if (price_source == "low") {
            incule_field = {
              low: 1, // Include field1
            }
          }
      
      
          const projection = incule_field;
          
          const pipeline = [
            { $project: projection },
            { $sort: { _id: 1 } }
          ];
          
          const get_view_data = await collection.aggregate(pipeline).toArray();


         const pipelineTimeFrameData = [
          { $sort: { _id: 1 } }
         ];

          const timeFrameViewData = await collection.aggregate(pipelineTimeFrameData).toArray();

          let get_final_data = ""
          if (price_source == "open") {
            get_final_data = get_view_data.map(item => item.open);
          } else if (price_source == "close") {
            get_final_data = get_view_data.map(item => item.close);
          }
          else if (price_source == "high") {
            get_final_data = get_view_data.map(item => item.high);
          }
          else if (price_source == "low") {
            get_final_data = get_view_data.map(item => item.low);
          }
      
      
      
          let averageData = "";
      
          if (indicator == "MA") {
            const MovingAverages = require('moving-averages');
            const MADATA = MovingAverages.ma(get_final_data, period);
            if (inside_indicator == "EMA") {
              averageData = MovingAverages.ema(MADATA, period);
            } else if (inside_indicator == "DMA") {
              averageData = MovingAverages.dma(MADATA, period);
            }
            else if (inside_indicator == "SMA") {
              averageData = MovingAverages.sma(MADATA, period);
            }
            else if (inside_indicator == "WMA") {
              averageData = MovingAverages.wma(MADATA, period);
            }
           
          }


          


        
           

       //  console.log("timeFrameViewData",timeFrameViewData);

         const lastElementTimeFrameViewData = timeFrameViewData[timeFrameViewData.length - 1];
         console.log("Last lastElementTimeFrameViewData:", lastElementTimeFrameViewData.open);
     
      
        // console.log("averageData call strategy",averageData);
         const lastElementAverageData = averageData[averageData.length - 1];
         console.log("Last lastElementAverageData:", lastElementAverageData);









       
    
  }


  async function dropAllCollections() {

    try {

      const db = client.db('TradeTools');

      const collections = await db.listCollections().toArray();
      // Drop each collection
      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        await db.collection(collectionName).drop();
        console.log(`Dropped collection: ${collectionName}`);
      }

      console.log('All collections dropped.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  }

  // Call the function to drop all collections in the database





  app.get('/socket-api', async (req, res) => {
     //const collection = "shakir2";
    // dropAllCollections();
    // res.send("okkkk"); 
    // return
    //connectToDB(collection);

 

    var BASEURL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/";
    let AuthorizationToken;
    let type = "API";
    const url = "wss://ws1.aliceblueonline.com/NorenWS/";
    let socket;
    // let channel = 'NSE|3045#NSE|14366#NFO|59218#NFO|59219';
    let channel = 'NFO|59203#NFO|59204';

    let userId = '438760';
    let userSession = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTUzNTMxMjEsImlhdCI6MTY5NTI3NDIzNCwianRpIjoiYjY3YWE0ZDgtNTQwMS00NzZhLWExZmEtODQzYjNlZTM1ZTk2IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjExMWVhZTA5LWM5NTktNDZlYy04Mjg0LWE0YzViMWU5NDA0MSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMTExZWFlMDktYzk1OS00NmVjLTgyODQtYTRjNWIxZTk0MDQxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.Er0mZxaLAQ0QRYhduVC0ufV6CjpkSnOy8ETDd-_DmZU3u5w22I3FbTpAq9FN_Y6oQMIhSqQ1JGg5kIwd2Wn49wQyRloNoZr8V93uUVmygIKAGWUZjVhuFdfDC-BnzJhIobICYNxOQy6DNe3JU1dIJsNycLHN75hZOpbftX3ljUy-yON8IbvoGw1LGEx1kqRiQx11JvLl_HZxbgyYgyivk9D4dYVDJP_vzZyfQiMadrqcJm6wgO2OV-Byd1PwVf5J-sS6jtvwZU8lOBMROeHJ6lnNwsXrbRVaQ1_6GaXZ8Jb5d5w8x3YKIIIIStqSz1-_Wi43W3n_UxwXdK1_F_lkaA'

    connect(userId, userSession, channel)

    function connect(userId, userSession, token = "") {

      socket = new WebSocket(url);
      socket.onopen = function () {
        connectionRequest(userId, userSession);

      };
      socket.onmessage = async function (msg) {
        var response = JSON.parse(msg.data);
        console.log("okk socket open  1 ", response)

        if (response.tk) {
          //console.log("response",response)
          connectToDB(response.tk, response);
        }



        if (response.s == "OK") {

          var channel = token;
          let json = {
            k: channel,
            t: 't'
          };
          socket.send(JSON.stringify(json))

        }

      };
      socket.onclose = function (event) {
        if (event.wasClean) {

          // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);

        } else {


          connect(userId, userSession, token);
          // alert('[close] Connection died');
        }
      };
    }

    function connectionRequest(userId, userSession) {
      var encrcptToken = CryptoJS.SHA256(
        CryptoJS.SHA256(userSession).toString()
      ).toString();
      // alert(encrcptToken);
      var initCon = {
        susertoken: encrcptToken,
        t: "c",
        actid: userId + "_" + type,
        uid: userId + "_" + type,
        source: type,
      };
      // console.log('initCon', JSON.stringify(initCon));
      try {
        socket.send(JSON.stringify(initCon));
      } catch (error) {
        console.log("Shocket", error);
      }

    }
    res.send("socket run")
  });


  app.post('/moving_average', async (req, res) => {

    let token = req.body.token;
    let market_status = req.body.market_status;
    let time = parseInt(req.body.time);
    let indicator = req.body.indicator;
    console.log("token", token)
    console.log("market_status", market_status)
    console.log("time", time)
    const db = client.db('TradeTools');
    let collectionName = 'M_' + token;
    const collection = db.collection(collectionName);

    let incule_field = "";
    if (market_status == "open") {
      incule_field = {
        open: 1, // Include field1
      }
    }
    else if (market_status == "close") {
      incule_field = {
        close: 1, // Include field1
      }
    }
    else if (market_status == "high") {
      incule_field = {
        high: 1, // Include field1
      }
    }
    else if (market_status == "low") {
      incule_field = {
        low: 1, // Include field1
      }
    }

    const projection = incule_field;
    const pipeline = [
      { $project: projection },
      { $sort: { _id: 1 } }
    ];

    const get_view_data = await collection.aggregate(pipeline).toArray();
    // console.log('Data with selected fields:', get_view_data);
    let get_final_data = ""
    if (market_status == "open") {
      get_final_data = get_view_data.map(item => item.open);
    } else if (market_status == "close") {
      get_final_data = get_view_data.map(item => item.close);
    }
    else if (market_status == "high") {
      get_final_data = get_view_data.map(item => item.high);
    }
    else if (market_status == "low") {
      get_final_data = get_view_data.map(item => item.low);
    }



    let averageData = "";

    if (indicator == "MA") {
      const MovingAverages = require('moving-averages');
      averageData = MovingAverages.sma(get_final_data, time);
    }
    else if (indicator == "EMA") {
      // EMA parameters
      const ti = require('technicalindicators');
      const input = {
        values: get_final_data,
        period: time, // EMA period (adjust as needed)
      };
      // Calculate EMA
      averageData = ti.EMA.calculate(input);
    }


    res.send({ status: true, data: get_final_data.length, averageData: averageData.length });


  });



  app.post("/make_startegy", async function (req, res) {

    // const pipeline1 = [

    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'user_id',
    //       foreignField: '_id',
    //       as: 'userResult'
    //     }
    //   },

    //   {
    //     $unwind: '$userResult', //
    //   },
    //   {
    //     $project: {
      
    //       user_id:1,
    //       tokensymbol:1,
    //       timeframe:1,
    //       indicator:1,
    //       price_source:1,
    //       period:1,
    //       inside_indicator:1,
    //       condition:1,
    //       buffer_value:1,
    //       createdAt:1,
    //       updatedAt:1,
    //      'userResult.UserName': 1, 
       
    
    //     }
    //   }
      
    // ];

    // const result = await UserMakeStrategy.aggregate(pipeline1);

    // if (result.length > 0) {

    //   return res.json({ status: true, msg: 'Get all', data: result });

    // } else {

    //   return res.json({ status: false, msg: 'An error occurred', data: [] });
    // }


  

   return

    let user_id = req.body.user_id;
    let tokensymbol = req.body.tokensymbol;
    let timeframe = req.body.timeframe;
    let indicator = req.body.indicator;
    let price_source = req.body.price_source;
    let period = req.body.period;
    let inside_indicator = req.body.inside_indicator;
    let condition = req.body.condition;
    let buffer_value = req.body.buffer_value;


    const db = client.db('TradeTools');

// Add Strategy User..
  try {

    await UserMakeStrategy.create({
      user_id: user_id,
      tokensymbol: tokensymbol,
      timeframe: timeframe,
      indicator: indicator,
      price_source: price_source,
      period: period,
      inside_indicator: inside_indicator,
      condition: condition,
      buffer_value: buffer_value,
    })
      .then((createUserMakeStrategy) => {
        res.send({ status: true, msg: "successfully Add!", data: createUserMakeStrategy })
      }).catch((err) => {
        //console.error('Error creating and saving user:', err.keyValue.name);
        res.send({ status: false, msg: "Duplicate Value", data: err.keyValue.name })
    
      });
    
  } catch (error) {
    
  }

 
 
 


   
  return




  

  
  
    let collectionName = 'M' + timeframe + '_' + tokensymbol;

  //  const collection = db.collection(collectionName);


    

   


   
   res.send("okkk");
   return;

    let incule_field = "";
    if (price_source == "open") {
      incule_field = {
        open: 1, // Include field1
      }
    } else if (price_source == "close") {
      incule_field = {
        close: 1, // Include field1
      }
    }
    else if (price_source == "high") {
      incule_field = {
        high: 1, // Include field1
      }
    }
    else if (price_source == "low") {
      incule_field = {
        low: 1, // Include field1
      }
    }


    const projection = incule_field;

    const pipeline = [
      { $project: projection },
      { $sort: { _id: 1 } }
    ];

    const get_view_data = await collection.aggregate(pipeline).toArray();
    // console.log('Data with selected fields:', get_view_data);
    let get_final_data = ""
    if (price_source == "open") {
      get_final_data = get_view_data.map(item => item.open);
    } else if (price_source == "close") {
      get_final_data = get_view_data.map(item => item.close);
    }
    else if (price_source == "high") {
      get_final_data = get_view_data.map(item => item.high);
    }
    else if (price_source == "low") {
      get_final_data = get_view_data.map(item => item.low);
    }



    let averageData = "";

    if (indicator == "MA") {
      const MovingAverages = require('moving-averages');
      const MADATA = MovingAverages.ma(get_final_data, period);
      if (inside_indicator == "EMA") {
        averageData = MovingAverages.ema(MADATA, period);
      } else if (inside_indicator == "DMA") {
        averageData = MovingAverages.dma(MADATA, period);
      }
      else if (inside_indicator == "SMA") {
        averageData = MovingAverages.sma(MADATA, period);
      }
      else if (inside_indicator == "WMA") {
        averageData = MovingAverages.wma(MADATA, period);
      }
     
    }

   
     
    
  


    res.send(averageData);







  });


  app.get("/crossover", function (req, res) {


    // Function to calculate the Simple Moving Average (SMA) of prices
    function calculateSMA(prices, period) {
      if (prices.length < period) {
        throw new Error("Not enough data points to calculate SMA.");
      }

      const smaValues = [];
      for (let i = period - 1; i < prices.length; i++) {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        const sma = sum / period;
        smaValues.push(sma);
      }

      return smaValues;
    }

    // Function to implement a basic crossover strategy
    function crossoverStrategy(shortSMA, longSMA) {
      const signals = [];

      for (let i = 1; i < shortSMA.length; i++) {
        if (shortSMA[i] > longSMA[i] && shortSMA[i - 1] <= longSMA[i - 1]) {
          signals.push({ action: "Buy", dateIndex: i });
        } else if (shortSMA[i] < longSMA[i] && shortSMA[i - 1] >= longSMA[i - 1]) {
          signals.push({ action: "Sell", dateIndex: i });
        }
      }

      return signals;
    }

    // Example usage
    const historicalPrices = [50, 25, 105, 45, 60, 98, 60, 33, 60, 97]; // Replace with your price data
    const shortPeriod = 3; // Adjust the short-term SMA period
    const longPeriod = 8; // Adjust the long-term SMA period

    // Calculate the short and long SMAs
    const shortSMA = calculateSMA(historicalPrices, shortPeriod);
    const longSMA = calculateSMA(historicalPrices, longPeriod);

    console.log("shortSMA:", shortSMA);
    console.log("longSMA:", longSMA);

    // Generate buy/sell signals based on crossovers
    const signals = crossoverStrategy(shortSMA, longSMA);

    // Display the signals
    console.log("Buy/Sell Signals:", signals);
    for (const signal of signals) {
      console.log(
        `${signal.action} at Date Index ${signal.dateIndex}: Price = ${historicalPrices[signal.dateIndex]
        }`
      );
    }


    res.send("OK")

  });


  //Add stoch Api.....
  app.get('/addstock', async function (req, res) {

    const pipeline = [

      {
        $project: {
          // Include fields from the original collection
          'segment': 1,
        },
      },
    ];
    const categoryResult = await categorie.aggregate(pipeline);
    //const matchingElements = categoryResult.filter(item => item.segment === "FO");

   var axios = require('axios');

    // console.log('Matching elements:', matchingElements[0]._id);
    res.send("done");
    return
    var axios = require('axios');
   var config = {
      method: 'get',
      url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    };

    axios(config)
      .then(function (response) {

            
          var unique_key = []
          let count = 0
          response.data.forEach((item) => {

        // res.send(response.data);
        // console.log(response.data);



        // Using a loop to extract 'name' and 'instrumenttype'


        var unique_key = []
        let count = 0
        response.data.forEach((item) => {

          //   function findRepeatedElements(array) {
          //     const frequencyMap = {};
          //     const repeatedElements = [];

          //     array.forEach(element => {
          //       if (frequencyMap[element.instrumenttype]) {
          //         frequencyMap[element.instrumenttype]++;
          //         if (frequencyMap[element.instrumenttype] === 2) {
          //           repeatedElements.push(element.instrumenttype);
          //         }
          //       } else {
          //         frequencyMap[element.instrumenttype] = 1;
          //       }
          //     });

          //     return repeatedElements;
          //   }

          //   const inputArray = response.data;
          //   const repeatedElements = findRepeatedElements(inputArray);

          //   console.log('Repeated elements:', repeatedElements);
          //   res.send(repeatedElements)
          // return


          //  if(item.instrumenttype == 'FUTSTK' || item.instrumenttype == 'FUTIDX' || item.instrumenttype == 'FUTCUR'||item.instrumenttype == 'FUTCOM'||item.instrumenttype == 'OPTSTK'||item.instrumenttype == 'OPTIDX'||item.instrumenttype == 'OPTCUR'||item.instrumenttype == 'OPTFUT'){ 



          if (!unique_key.includes(`${item.name}-${item.instrumenttype}`)) {
            unique_key.push(`${item.name}-${item.instrumenttype}`);


            if (item.symbol.slice(-3) == '-EQ') {
              count++

              const matchingElements = categoryResult.filter(item => item.segment === "C");
              const category_id = matchingElements[0]._id


              services.create({
                name: item.name + '#',
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + '#_' + category_id
              })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.error('Error creating and saving user:', err);
                  } catch (e) {
                    console.log("duplicate key")
                  }

                });


            }




            if (item.instrumenttype == 'FUTSTK' || item.instrumenttype == 'FUTIDX') {
              count++
              console.log('item - F ' + count + ' ', item)
              const matchingElements = categoryResult.filter(item => item.segment === "F");
              const category_id = matchingElements[0]._id



              services.create({
                name: item.name,
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + '_' + category_id
              })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.error('Error creating and saving user:', err);
                  } catch (e) {
                    console.log("duplicate key")
                  }

                });




            }



            if (item.instrumenttype == 'OPTSTK' || item.instrumenttype == 'OPTIDX') {
              count++
              console.log('item - O ' + count + ' ', item)
              const matchingElements = categoryResult.filter(item => item.segment === "O");
              const category_id = matchingElements[0]._id

              services.create({
                name: item.name,
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + '_' + category_id
              })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.error('Error creating and saving user:', err);
                  } catch (e) {
                    console.log("duplicate key")
                  }

                });




            }


            if (item.instrumenttype == 'OPTFUT') {
              count++
              console.log('item - MO ' + count + ' ', item)
              const matchingElements = categoryResult.filter(item => item.segment === "MO");
              const category_id = matchingElements[0]._id

              services.create({
                name: item.name,
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + '_' + category_id
              })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.error('Error creating and saving user:', err);
                  } catch (e) {
                    console.log("duplicate key")
                  }

                });




            }


            if (item.instrumenttype == 'FUTCOM') {
              count++
              console.log('item - MF ' + count + ' ', item)
              const matchingElements = categoryResult.filter(item => item.segment === "MF");
              const category_id = matchingElements[0]._id

              services.create({
                name: item.name,
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + '_' + category_id
              })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.error('Error creating and saving user:', err);
                  } catch (e) {
                    console.log("duplicate key")
                  }

                });



            }

            if (item.instrumenttype == 'FUTCUR') {
              count++
              console.log('item - CF ' + count + ' ', item)
              const matchingElements = categoryResult.filter(item => item.segment === "CF");
              const category_id = matchingElements[0]._id


              services.create({
                name: item.name,
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + '_' + category_id
              })
                .then((createdServices) => {
                  console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.error('Error creating and saving user:', err);
                  } catch (e) {
                    console.log("duplicate key")
                  }

                });


            }

            // if(item.instrumenttype == 'AMXIDX'|| item.instrumenttype == 'OPTIRC' || item.instrumenttype == 'UNDIRC' || item.instrumenttype == 'FUTIRC' || item.instrumenttype == 'UNDCUR' || item.instrumenttype == 'INDEX' || item.instrumenttype == 'COMDTY' || item.instrumenttype == 'AUCSO'){
            //       count++
            //       console.log('item - OTHER CONTENT '+count+' ',item)
            //       // const matchingElements = categoryResult.filter(item => item.segment === "C");
            //       // const category_id = matchingElements[0]._id
            //       services.create({
            //         name:item.name,
            //         instrument_token:item.token,
            //         zebu_token:item.symbol,
            //         kotak_token:"",
            //         instrumenttype:item.instrumenttype,
            //         exch_seg:item.exch_seg,
            //         lotsize:item.lotsize,
            //         categorie_id : "",
            //         unique_column : item.name +'_'+'c9dbdc14a9fefd971c979'
            //       })
            //       .then((createdServices) => {
            //         console.log('User created and saved:', createdServices._id)
            //       })
            //       .catch((err) => {
            //         try{
            //         console.error('Error creating and saving user:', err);
            //         }catch(e){
            //          console.log("duplicate key")
            //         }

            //       });


            //       }

          }
          //   }

        });


        return

        function findRepeatedElements(array) {
          const frequencyMap = {};
          const repeatedElements = [];

          array.forEach(element => {
            if (frequencyMap[element.instrumenttype]) {
              frequencyMap[element.instrumenttype]++;
              if (frequencyMap[element.instrumenttype] === 2) {
                repeatedElements.push(element.instrumenttype);
              }
            } else {
              frequencyMap[element.instrumenttype] = 1;
            }
          });

          return repeatedElements;
        }

        const inputArray = response.data;
        const repeatedElements = findRepeatedElements(inputArray);

        console.log('Repeated elements:', repeatedElements);



      });

  });


  //////// super trend logicc////////

  // const calculateATR = (data, period) => {
  //   // Calculate Average True Range (ATR)
  //   let atr = [];

  //   for (let i = 1; i < data.length; i++) {
  //     const high = data[i].high;
  //     const low = data[i].low;
  //     const prevClose = data[i - 1].close;

  //     const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
  //     atr.push(tr);
  //   }

  //   // Calculate the average ATR
  //   const atrSum = atr.slice(0, period).reduce((acc, val) => acc + val, 0);
  //   return atrSum / period;
  // };

  // const calculateSuperTrend = (data, atrPeriod, multiplier) => {
  //   let superTrend = [];

  //   for (let i = atrPeriod; i < data.length; i++) {
  //     const prevSuperTrend = superTrend[i - 1] || 0;
  //     const atr = calculateATR(data.slice(i - atrPeriod, i), atrPeriod);

  //     const upperBand = (data[i].high + data[i].low - multiplier * atr);
  //     const lowerBand = (data[i].high + data[i].low - multiplier * atr);

  //     const close = data[i].close;

  //     if (close <= upperBand) {
  //       superTrend.push(upperBand);
  //     } else if (close >= lowerBand) {
  //       superTrend.push(lowerBand);
  //     } else {
  //       superTrend.push(prevSuperTrend);
  //     }
  //   }

  //   return superTrend;
  // };

  // // Sample data (replace with your own dataset)
  // const historicalData = [
  //   { high: 150, low: 140, close: 145 },
  //   { high: 155, low: 145, close: 150 },
  //   // Add more data points
  // ];

  // const atrPeriod = 14; // ATR period
  // const multiplier = 3; // Multiplier value

  // const superTrendValues = calculateSuperTrend(historicalData, atrPeriod, multiplier);

  // // Calculate the average Super Trend
  // const averageSuperTrend = superTrendValues.reduce((acc, val) => acc + val, 0) / superTrendValues.length;

  // console.log('Super Trend Values:', superTrendValues);
  // console.log('Average Super Trend:', averageSuperTrend);


  ////////// END SUper Trend logic///


})




}