var axios = require("axios");
const WebSocket = require("ws");
var CryptoJS = require("crypto-js");
const db = require("../Models");

const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const stock_live_price = db.stock_live_price;
const token_chain = db.token_chain;
const dbTest = db.dbTest;

const currentDate = new Date();
const hours = currentDate.getHours().toString().padStart(2, "0");
const minutes = currentDate.getMinutes().toString().padStart(2, "0");

let socketObject = null;
let reconnectAttempt = 0;
const maxReconnectAttempts = 10;
const reconnectInterval = 5000;

const aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";

let updateQueue = [];
let retryDelay = 1000;
let messageQueue = [];
let processing = false;

const processUpdates = async () => {
  if (updateQueue.length > 0) {
    try {
      await stock_live_price.bulkWrite(updateQueue);
      updateQueue = [];
    } catch (error) {
      console.error("Database update error:", error);
    }
  }
};

setInterval(processUpdates, 1000);

const processMessages = async () => {
  if (!processing && messageQueue.length > 0) {
    processing = true;
    const messages = [...messageQueue];
    messageQueue = [];

    for (const msg of messages) {
      try {
        const { lp, tk, e, ft } = msg;
        if (lp && tk) {
          const now = new Date();
          const curtime = `${now.getHours().toString().padStart(2, "0")}${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          updateQueue.push({
            updateOne: {
              filter: { _id: tk },
              update: { $set: { lp, exc: e, curtime, ft } },
              upsert: true,
            },
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }

    processing = false;
  }
};

setInterval(processMessages, 100);

const isTimeInRange = (hourStart, minuteStart, hourEnd, minuteEnd) => {
  const indiaTimezoneOffset = 330;
  const currentTimeInMinutes =
    new Date().getUTCHours() * 60 +
    new Date().getUTCMinutes() +
    indiaTimezoneOffset;

  const currentHour = Math.floor(currentTimeInMinutes / 60) % 24;
  const currentMinute = currentTimeInMinutes % 60;

  const startMinutes = hourStart * 60 + minuteStart;
  const endMinutes = hourEnd * 60 + minuteEnd;
  const currentMinutes = currentHour * 60 + currentMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// WebSocket Logic
const Alice_Socket = async () => {
  const now = new Date();
  const curtime = `${now.getHours().toString().padStart(2, "0")}${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (curtime > 1531) {
    console.log("Market Closed:", new Date());
    return null;
  }

  const broker_info = await live_price
    .findOne({ broker_name: "ALICE_BLUE", trading_status: "on" })
    .sort({ _id: -1 });

  if (!broker_info) {
    console.log("Broker Trading Off");
    return null;
  }

  const updateToken = await token_chain.find({}).toArray();
  const channelList = updateToken
    .map((data) => (data.exch && data._id ? `${data.exch}|${data._id}` : null))
    .filter(Boolean)
    .join("#");

  if (!channelList) {
    console.log("No tokens found for subscription");
    return;
  }

  const { user_id: userId, access_token: userSession } = broker_info;

  try {
    const response = await axios.post(
      `${aliceBaseUrl}ws/createSocketSess`,
      { loginType: "API" },
      {
        headers: {
          Authorization: `Bearer ${userId} ${userSession}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.stat === "Ok") {
      console.log("Alice Socket Connected:", new Date());

      const ws = new WebSocket("wss://ws1.aliceblueonline.com/NorenWS/");
      socketObject = ws;

      ws.onopen = () => {
        const encryptedToken = CryptoJS.SHA256(
          CryptoJS.SHA256(userSession).toString()
        ).toString();
        const initCon = {
          susertoken: encryptedToken,
          t: "c",
          actid: `${userId}_API`,
          uid: `${userId}_API`,
          source: "API",
        };
        ws.send(JSON.stringify(initCon));
      };

      ws.onmessage = (msg) => {
        const response = JSON.parse(msg.data);
        if (response.tk) {
          messageQueue.push(response);
        } else if (response.s === "OK") {
          const subscriptionMessage = {
            k: channelList,
            t: "t",
          };
          ws.send(JSON.stringify(subscriptionMessage));
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        socketRestart();
      };

      ws.onclose = (event) => {
        console.log(
          `WebSocket closed: Code=${event.code}, Reason=${event.reason}, Clean=${event.wasClean}`
        );
        if (isTimeInRange(9, 15, 23, 30)) {
          socketRestart();
        }
      };
    }
  } catch (error) {
    console.log("Error creating socket session:", error.response.data);
    // socketRestart();
  }
};

// Reconnect Logic with Exponential Backoff
const socketRestart = async () => {
  try {
    if (socketObject) {
      socketObject.close();
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    await Alice_Socket();
    retryDelay = 1000; // Reset delay on success
  } catch (error) {
    retryDelay = Math.min(retryDelay * 2, 30000); // Cap at 30 seconds
    console.error(
      "Reconnect failed, retrying in:",
      retryDelay / 1000,
      "seconds"
    );
    setTimeout(socketRestart, retryDelay);
  }
};

const getSocket = () => socketObject;

// ===============================================================================

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
    const collectionExists = collections.some(
      (coll) => coll.name === collectionName
    );

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
          v: parseFloat(response.v),
        };
        const insertResult = await collection.insertOne(singleDocument);
      }

      const collectionExistsViews = collections.some(
        (coll) => coll.name === "M3_" + collectionName
      );
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
          v: parseFloat(response.v),
        };
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
            $toDate: "$_id",
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M_" + collectionName;
      await dbTest.createCollection(viewName, {
        viewOn: collectionName,
        pipeline: pipeline,
      });
    }
  } catch (err) {}
}

async function createViewM3(collectionName) {
  try {
    const pipeline = [
      {
        $project: {
          _id: {
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
              hour: { $hour: "$_id" },
              minute: {
                $subtract: [
                  { $minute: "$_id" },
                  { $mod: [{ $minute: "$_id" }, 3] }, // Round to nearest 5 minutes
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M3_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M3_" + collectionName;
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
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
              hour: { $hour: "$_id" },
              minute: {
                $subtract: [
                  { $minute: "$_id" },
                  { $mod: [{ $minute: "$_id" }, 5] }, // Round to nearest 5 minutes
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M5_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M5_" + collectionName;
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
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
              hour: { $hour: "$_id" },
              minute: {
                $subtract: [
                  { $minute: "$_id" },
                  { $mod: [{ $minute: "$_id" }, 10] }, // Round to nearest 5 minutes
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M10_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M10_" + collectionName;
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
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
              hour: { $hour: "$_id" },
              minute: {
                $subtract: [
                  { $minute: "$_id" },
                  { $mod: [{ $minute: "$_id" }, 15] }, // Round to nearest 5 minutes
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M15_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M15_" + collectionName;
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
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
              hour: { $hour: "$_id" },
              minute: {
                $subtract: [
                  { $minute: "$_id" },
                  { $mod: [{ $minute: "$_id" }, 30] }, // Round to nearest 5 minutes
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M30_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M30_" + collectionName;
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
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
              hour: { $hour: "$_id" },
              minute: {
                $subtract: [
                  { $minute: "$_id" },
                  { $mod: [{ $minute: "$_id" }, 60] }, // Round to nearest 5 minutes
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
              format: "%Y-%m-%d %H:%M",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M60_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M60_" + collectionName;
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
            $toDate: "$_id",
          },
          lp: 1,
          v: 1,
        },
      },
      {
        $addFields: {
          _id: {
            $dateFromParts: {
              year: { $year: "$_id" },
              month: { $month: "$_id" },
              day: { $dayOfMonth: "$_id" },
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
              format: "%Y-%m-%d",
              date: "$_id",
            },
          },
          open: { $first: "$lp" },
          high: { $max: "$lp" },
          low: { $min: "$lp" },
          close: { $last: "$lp" },
          MaxVol: { $max: "$v" },
          MinVol: { $min: "$v" },
        },
      },
    ];

    // You can now execute this pipeline in your MongoDB aggregation query.

    const collections = await dbTest.listCollections().toArray();
    // Check if the desired collection exists
    const collectionExists = collections.some(
      (coll) => coll.name === "M1DAY_" + collectionName
    );

    if (collectionExists) {
    } else {
      // Create the view with a name (e.g., "myview")
      const viewName = "M1DAY_" + collectionName;
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

module.exports = { Alice_Socket, getSocket };
