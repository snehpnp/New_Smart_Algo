var axios = require('axios');
const WebSocket = require('ws');
var CryptoJS = require("crypto-js");
const db = require('../Models');

const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const stock_live_price = db.stock_live_price;
const token_chain = db.token_chain;
const dbTest = db.dbTest;
const MainSignals_modal = db.MainSignals;
const Alice_token = db.Alice_token;
const Get_Option_Chain_modal = db.option_chain_symbols;

const currentDate = new Date();
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');

let socketObject = null;
let reconnectAttempt = 0;
const maxReconnectAttempts = 10;
const reconnectInterval = 5000; // Initial reconnect interval in ms

let ws;
const url = "wss://ws1.aliceblueonline.com/NorenWS/"


const Alice_Socket = async () => {
  var rr = 0;
  // console.log("INSIDEE")
  let channelstradd = "";
  const uniqueTokens = new Set();
  //Main SignalS code
  const pipeline = [
    {
      $match: {
        $or: [
          { segment: 'C' },
          { segment: 'O' },
          { segment: 'BO' }
        ],
        $expr: {
          $gt: [{ $toInt: "$entry_qty" }, { $toInt: "$exit_qty" }]
        }
      }
    },
    {
      $addFields: {
        expiry_date: {
          $dateFromString: {
            dateString: "$expiry",
            format: "%d%m%Y"
          }
        },
        exch_seg: {
          $cond: {
            if: { $eq: ['$segment', 'C'] }, // Your condition here
            then: 'NSE',
            else: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ['$segment', 'F'] },
                    { $eq: ['$segment', 'O'] },
                    { $eq: ['$segment', 'FO'] }
                  ]
                },
                then: 'NFO',
                else: {

                  $cond: {
                    if: {
                      $or: [
                        { $eq: ['$segment', 'MF'] },
                        { $eq: ['$segment', 'MO'] }
                      ]
                    },
                    then: 'MCX',
                    else: {

                      $cond: {
                        if: {
                          $or: [
                            { $eq: ['$segment', 'CF'] },
                            { $eq: ['$segment', 'CO'] }
                          ]
                        },
                        then: 'CDS',

                        // all not exist condition 
                        else: {
                          $cond: {
                            if: {
                              $or: [
                                { $eq: ['$segment', 'BF'] },
                                { $eq: ['$segment', 'BO'] }
                              ]
                            },
                            then: 'BFO',

                            // all not exist condition 
                            else: "NFO"

                          }
                        }

                      }

                    }

                  }


                }

              }

            }

          }
        },
      }
    },
    {
      $match: {
        // expiry_date: {
        //     $gte: new Date(new Date().setHours(0, 0, 0, 0)) 
        // }       
        $or: [
          { segment: 'C' },
          {
            segment: { $ne: 'C' },
            expiry_date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        ]
      }
    },

    {
      $sort: {
        _id: -1 // Sort in ascending order. Use -1 for descending.
      }
    },
    {
      $project: {
        _id: 0,
        exch_seg: 1,
        token: 1
      }
    }


  ]
  const result = await MainSignals_modal.aggregate(pipeline)
  // console.log("result MainSignals_modal ", result)
  if (result.length > 0) {
   
    const resultString = result.reduce((acc, { token, exch_seg }) => {
      if (!uniqueTokens.has(token)) {
        uniqueTokens.add(token); 
        acc += `${exch_seg}|${token}#`; 
      }
      return acc;
    }, '');
    channelstradd += resultString;
    // channelstradd += resultString.slice(0, -1);
  }

 

 //Make Startegy code
  const pipelineMakeStrategy = [
    {
      $match: {
        $or: [
          { statusOnOff: '1' }
        ],
      }
    },
    {
      $addFields: {
        expiry_date: {
          $toDate: "$expiry" 
        }
      }
    },
    {
      $match: {
              
        $or: [
          { segment: 'C' },
          {
            segment: { $ne: 'C' },
            expiry_date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
          }
        ]
      }
    },

    {
      $sort: {
        _id: -1 // Sort in ascending order. Use -1 for descending.
      }
    },

    {
      $group: {
          _id: { tokensymbol: "$tokensymbol", exch_seg: "$exch_seg" }, 
          tokensymbol: { $first: "$tokensymbol" }, 
          exch_seg: { $first: "$exch_seg" } 
      }
  },
    {
      $project: {
        _id: 0,
        exch_seg: 1,
        tokensymbol: 1
      }
    }

  ]
  const resultMakeStrategy = await UserMakeStrategy.aggregate(pipelineMakeStrategy) 
  if (resultMakeStrategy.length > 0) {
    const resultStringMakeStrategy = resultMakeStrategy.reduce((acc, { tokensymbol, exch_seg }) => {
      if (!uniqueTokens.has(tokensymbol)) {
        uniqueTokens.add(tokensymbol); 
        acc += `${exch_seg}|${tokensymbol}#`; 
      }
      return acc;
    }, '');
    channelstradd += resultStringMakeStrategy;
  }

  // NFO SET TOKEN
  const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
  const expiry = "30112023";
  let limit_set = 20
  let price = 21000

  const date = new Date(); // Month is 0-based, so 10 represents November
  const currentDate = new Date();
  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);
  const formattedDate = previousDate.toISOString();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const formattedLastDayOfMonth = lastDayOfMonth.toISOString();

  for (const symbol of symbols) {
    const pipeline = [
      { $match: { symbol } },
      { $group: { _id: "$symbol", uniqueExpiryValues: { $addToSet: "$expiry" } } },
      { $unwind: "$uniqueExpiryValues" },
      { $addFields: { expiryDate: { $dateFromString: { dateString: "$uniqueExpiryValues", format: "%d%m%Y" } } } },
      { $match: { expiryDate: { $gte: new Date(formattedDate) } } },
      { $addFields: { formattedExpiryDate: { $dateToString: { date: "$expiryDate", format: "%d%m%Y" } } } },
      { $sort: { expiryDate: 1 } },
      { $limit: 5 }
    ];

    const data = await Alice_token.aggregate(pipeline);
    const expiryDatesArray = data
      .filter(item => item.expiryDate.getTime() === lastDayOfMonth.getTime() || data.indexOf(item) < 2)
      .map(item => item.uniqueExpiryValues);

    const get_symbol_price = await Get_Option_Chain_modal.findOne({ symbol });
    const price = get_symbol_price ? parseInt(get_symbol_price.price) : 0;

    const commonMatch = { symbol, segment: 'O', expiry: { $in: expiryDatesArray } };

    const [result, resultStrike] = await Promise.all([
      Alice_token.aggregate([{ $match: commonMatch }]),
      Alice_token.aggregate([
        { $match: commonMatch },
        { $addFields: { absoluteDifference: { $abs: { $subtract: [{ $toInt: "$strike" }, price] } } } },
        { $group: { _id: "$strike", minDifference: { $min: "$absoluteDifference" }, document: { $first: "$$ROOT" } } },
        { $sort: { minDifference: 1 } },
        { $limit: limit_set },
        { $sort: { _id: 1 } }
      ])
    ]);


    if (result.length > 0) {
      for (const element of resultStrike) {
        const matchedElements = result.filter(element1 => element.document.strike == element1.strike);
        for (const element1 of matchedElements) {
          const tokenType = element1.option_type === "CE" ? "call" : "put";
          const instrumentToken = element1.instrument_token;
          if (!uniqueTokens.has(instrumentToken)) {
           uniqueTokens.add(instrumentToken); 
           channelstradd += `${element1.exch_seg}|${instrumentToken}#`;
          }
        }
      }
    }
  }

// console.log("channelstradd  ", channelstradd)

  var socket = null
  var broker_infor = await live_price.findOne({ broker_name: "ALICE_BLUE" });

  if (!broker_infor) {
    return null
  }


  // var channelstr = ""
  // if (updateToken.length > 0) {
  //   updateToken.forEach((data) => {
  //     if (data.exch != null && data._id != null) {

  //       channelstr += data.exch + "|" + data._id + "#"
  //     }
  //   })
  // }
  // Display fetched documents
  var alltokenchannellist = channelstradd.substring(0, channelstradd.length - 1);


  // console.log("alltokenchannellist ", alltokenchannellist)
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
          openSocketConnection(channelList, userid, userSession1)
        }
      }).catch((error) => {
        return "error"
      })


    } catch (error) {
      console.log("Error createSocketSess", error);
    }

  } else {
    console.log("Alice Socket Not Connected")
  }

}


function openSocketConnection(channelList, userid, userSession1) {
  ws = new WebSocket(url);
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
    sendChannelList(channelList);
    // reconnectAttempt = 0; // Reset reconnect attempts on successful connection
  };

  ws.onmessage = async function (msg) {
    const response = JSON.parse(msg.data)
    //console.log("response -",response)
    if (response.tk) {
      //  console.log("response -",response.tk)
      const Make_startegy_token = await UserMakeStrategy.findOne({ tokensymbol: response.tk });
      if (Make_startegy_token) {
        // console.log("IFFFFF - ", response.tk)
        await connectToDB(response.tk, response)
      }

      if (response.lp != undefined) {
        await stock_live_price.updateOne({ _id: response.tk }
          , {
            $set: {
              lp: response.lp,
              exc: response.e,
              // sp1: response.sp1 != undefined ? response.sp1: response.lp,
              // bp1: response.bp1 != undefined ? response.bp1: response.lp,
              curtime: `${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
              ft: response.ft
            },
          },
          { upsert: true });

      }
    } else {
      // console.log("else", response)
    }


  };

  ws.onerror = function (error) {
    console.log(`WebSocket error: ${error}`);
  };

  ws.onclose = async function () {
    await socketRestart()
  };

}



// Function to send the current channel list
function sendChannelList(channelList) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const json = {
      k: channelList,
      t: 't'
    };
    ws.send(JSON.stringify(json));  // Send channel list to server
    console.log("Channel list sent:", channelList);
  } else {
    console.log("WebSocket is not open. Cannot send channel list.");
  }
}


// Function to dynamically update the channelList and send it
function updateChannelAndSend(newChannel) {
  // channelList += newChannel;  // Add the new channel to the existing list
  console.log("Updated channelList:", newChannel);
  sendChannelList(newChannel);  // Send updated channel list
}

const getSocket = () => {
  return socketObject;
};

const socketRestart = async () => {
  //console.log("socketRestart")
  await Alice_Socket()
};


function checkExchangeSegment(input, exchange) {
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

async function connectToDB(collectionName, response) {
  try {

    const collections = await dbTest.listCollections().toArray();
    // let collectionName = message.token
    // Check if the desired collection exists
    const collectionExists = collections.some(coll => coll.name === collectionName);

    if (collectionExists) {
      const collection = dbTest.collection(collectionName);
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
    console.log("Alice Socket", err);
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


module.exports = { Alice_Socket, getSocket, updateChannelAndSend }
