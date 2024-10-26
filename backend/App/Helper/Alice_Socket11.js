var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");
const db = require('../Models');

const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const stock_live_price = db.stock_live_price;
const token_chain = db.token_chain;
const dbTest = db.dbTest;

const currentDate = new Date();
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');

let socketObject = null;
let reconnectAttempt = 0;
const maxReconnectAttempts = 10;
const reconnectInterval = 5000; // Initial reconnect interval in ms




const Alice_Socket = async () => {
    var rr = 0;
    const url = "wss://ws1.aliceblueonline.com/NorenWS/"
    var socket = null
    var broker_infor = await live_price.findOne({ broker_name: "ALICE_BLUE" });
    if (!broker_infor) {
        return null
    }
  
    
    const updateToken = await token_chain.find({}).toArray();
    var channelstr = ""
    if (updateToken.length > 0) {
        updateToken.forEach((data) => {
            if (data.exch != null && data._id != null) {

                channelstr += data.exch + "|" + data._id + "#"
            }
        })
    }

    var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);

    var aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/"
    var userid = broker_infor.user_id
    var userSession1 = broker_infor.access_token
    var trading_status = broker_infor.trading_status
    var channelList = alltokenchannellist
    var type = { "loginType": "API" }

    if (broker_infor.user_id !== undefined && broker_infor.access_token !== undefined && broker_infor.trading_status == "on") {
   
        try {
          
            await axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
                headers: {
                    'Authorization': `Bearer ${userid} ${userSession1}`,
                    'Content-Type': 'application/json'
                },

            }).then(res => {


                if (res.data.stat == "Ok") {

                    try {
                      const ws = new WebSocket(url);
                      ws.onopen = function () {
                        var encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession1).toString()).toString();
                        var initCon = {
                          susertoken: encrcptToken,
                          t: "c",
                          actid: userid + "_" + "API",
                          uid: userid + "_" + "API",
                          source: "API"
                        }
                        ws.send(JSON.stringify(initCon))
                        reconnectAttempt = 0; 
                      };
                      
                      ws.onmessage = async function (msg) {
                        const response = JSON.parse(msg.data)
                        if (response.tk) {
                          // console.log("Alice Socket - ", response.tk)
                          // const Make_startegy_token = await UserMakeStrategy.findOne({ tokensymbol: response.tk });
                          // if (Make_startegy_token) {
                          //   console.log("IFFFFF - ", response.tk)
                          //   await connectToDB(response.tk, response)
                          // } else {
                          //   // console.log("ELSEEEEE - ")
                          // }
                         
                          try {
                            if (response.lp !== undefined && response.e !== undefined && response.ft !== undefined) {
                              const now = new Date();
                              const curtime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
                              
                              await stock_live_price.updateOne(
                                { _id: response.tk },
                                {
                                  $set: {
                                    lp: response.lp,
                                    exc: response.e,
                                    curtime: curtime,
                                    ft: response.ft
                                  }
                                },
                                { upsert: true }
                              );
                            }
                          } catch (error) {
                         
                          }
                          
                          
                        } else 
                      
                        if (response.s === 'OK') {
                          let json = {
                            k: channelList,
                            t: 't'
                          };
                          await ws.send(JSON.stringify(json))
                          socketObject = ws
                        }
                      };
                      
                      ws.onerror = function (error) {
                        console.log(`WebSocket error: ${error}`);
                      };
                      
                      ws.onclose =async function () {
                      

                        const indiaTimezoneOffset = 330; 
                        const currentTimeInMinutes = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + indiaTimezoneOffset;
                        
                        const currentHour = Math.floor(currentTimeInMinutes / 60) % 24;
                        const currentMinute = currentTimeInMinutes % 60;
                      
                        if (currentHour >= 9 && currentMinute >= 15 && currentHour <= 15 && currentMinute <= 30) {
                          const result = checkExchangeSegment(channelList , "NFO");
                          if(result == true){
          
                            await  socketRestart()
                            return
                          }
                        } 

                        if (currentHour >= 9 && currentMinute >= 15 && currentHour <= 23 && currentMinute <= 30) {
                          const result = checkExchangeSegment(channelList , "MCX");
                          if(result == true){
                           
                            await  socketRestart()
                            return
                          }
                        } 

                        
                  
                      };

                    } catch (error) {
                        console.log("Error Shocket", error);

                    }
                }
            })
                .catch((error) => {
                    return "error"
                })


        } catch (error) {
            console.log("Error createSocketSess", error);
        }

    }

}

const getSocket = () => {
  return socketObject;
};

const socketRestart = async () => {
  //console.log("socketRestart")
  await Alice_Socket()
};

function checkExchangeSegment(input , exchange) {
  if (input.includes(exchange)) {
      return true;
  } else {
      return false;
  }
}

const attemptReconnect = () => {
  if (reconnectAttempt < maxReconnectAttempts) {
      reconnectAttempt++;
      setTimeout(() => {
          console.log(`Reconnection attempt #${reconnectAttempt}`);
          Alice_Socket();
      }, reconnectInterval * reconnectAttempt); // Exponential backoff
  } else {
      console.log("Maximum reconnection attempts reached. Giving up.");
  }
};

async function connectToDB(collectionName,response) {
    try {
   

        const collections = await dbTest.listCollections().toArray();
        // let collectionName = message.token
        // Check if the desired collection exists
        const collectionExists = collections.some(coll => coll.name === collectionName);

        if (collectionExists) {
            const collection = dbTest.collection(collectionName);
            // if (message.price != undefined && message.volume != undefined) {
            //     const customTimestamp = new Date();
            //     let singleDocument = {
            //         _id: customTimestamp,
            //         lp: parseFloat(message.price),
            //         v: parseFloat(message.volume)
            //     };
            //     const insertResult = await collection.insertOne(singleDocument);
            // }
            if (response.lp != undefined && response.v != undefined) {
            
                const customTimestamp = new Date();
                let singleDocument = {
                  _id: customTimestamp,
                  lp: parseFloat(response.lp),
                  v: parseFloat(response.v)
                }
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

            // if (message.price != undefined && message.volume != undefined) {
            //     const customTimestamp = new Date();
            //     let singleDocument = {
            //         _id: customTimestamp,
            //         lp: parseFloat(message.price),
            //         v: parseFloat(message.volume)
            //     };
            //     const insertResult = await collection.insertOne(singleDocument);
            // }
            if (response.lp != undefined && response.v != undefined) {
              console.log("IFFF ELSE ",collectionName)
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
        console.log("Alice Socket",err);
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
    // console.log('Error View Create 5 minute:', err);
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

      console.log(`View "${viewName}" created successfully.`);

    }



  } catch (err) {
    // console.log('Error View Create 5 minute:', err);
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
    // console.log('Error View Create 5 minute:', err);
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
    // console.log('Error View Create 5 minute:', err);
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
    // console.log('Error View Create 5 minute:', err);
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
    // console.log('Error View Create 5 minute:', err);
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
    // console.log('Error View Create 5 minute:', err);
  }


}







module.exports = { Alice_Socket, getSocket }
