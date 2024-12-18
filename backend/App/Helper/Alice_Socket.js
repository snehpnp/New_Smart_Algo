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

let ws;
const url = "wss://ws1.aliceblueonline.com/NorenWS/"

const Alice_Socket = async () => {
  const now1 = new Date();
  const curtime1 = `${now1.getHours().toString().padStart(2, "0")}${now1
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (curtime1 > 1531) {
    console.log("Market Close " + new Date());
    return null;
  }

  const url = "wss://ws1.aliceblueonline.com/NorenWS/";
  let broker_infor = await live_price
    .findOne({ broker_name: "ALICE_BLUE", trading_status: "on" })
    .sort({ _id: -1 });

  if (!broker_infor) {
    console.log("Broker Trading Off");
    return null;
  }

  const updateToken = await token_chain.find({}).toArray();
  let channelstr = "";
  if (updateToken.length > 0) {
    updateToken.forEach((data) => {
      if (data.exch != null && data._id != null) {
        channelstr += data.exch + "|" + data._id + "#";
      }
    });
  }

  let alltokenchannellist = channelstr.substring(0, channelstr.length - 1);

  let aliceBaseUrl =
    "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";
  let userid = broker_infor.user_id;
  let userSession1 = broker_infor.access_token;
  let channelList = alltokenchannellist;
  let type = { loginType: "API" };

  if (
    broker_infor.user_id !== undefined &&
    broker_infor.access_token !== undefined &&
    broker_infor.trading_status == "on"
  ) {
    try {
      await axios
        .post(`${aliceBaseUrl}ws/createSocketSess`, type, {
          headers: {
            Authorization: `Bearer ${userid} ${userSession1}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.stat == "Ok") {
            console.log("Alice Socket Connected ", new Date());

            try {

              openSocketConnection(channelList, userid, userSession1)


              // const ws = new WebSocket(url);
              // ws.onopen = function () {
              //   var encrcptToken = CryptoJS.SHA256(
              //     CryptoJS.SHA256(userSession1).toString()
              //   ).toString();
              //   var initCon = {
              //     susertoken: encrcptToken,
              //     t: "c",
              //     actid: userid + "_" + "API",
              //     uid: userid + "_" + "API",
              //     source: "API",
              //   };
              //   ws.send(JSON.stringify(initCon));
              //   reconnectAttempt = 0;
              // };

              // ws.onmessage = async function (msg) {
              //   const response = JSON.parse(msg.data);

              //   if (response.tk) {
              //     try {
              //       if (
              //         response.lp !== undefined &&
              //         response.e !== undefined &&
              //         response.ft !== undefined
              //       ) {
              //         const now = new Date();
              //         const curtime = `${now
              //           .getHours()
              //           .toString()
              //           .padStart(2, "0")}${now
              //           .getMinutes()
              //           .toString()
              //           .padStart(2, "0")}`;

              ws.onclose = async function () {
                console.log(
                  "WebSocket is closed. Reconnect will be attempted in 1 second.",
                  new Date()
                );

                const isTimeInRange = (
                  hourStart,
                  minuteStart,
                  hourEnd,
                  minuteEnd
                ) => {
                  const indiaTimezoneOffset = 330;
                  const currentTimeInMinutes =
                    new Date().getUTCHours() * 60 +
                    new Date().getUTCMinutes() +
                    indiaTimezoneOffset;

                  const currentHour =
                    Math.floor(currentTimeInMinutes / 60) % 24;
                  const currentMinute = currentTimeInMinutes % 60;

                  const startMinutes = hourStart * 60 + minuteStart;
                  const endMinutes = hourEnd * 60 + minuteEnd;
                  const currentMinutes = currentHour * 60 + currentMinute;

                  return (
                    currentMinutes >= startMinutes &&
                    currentMinutes <= endMinutes
                  );
                };

                if (isTimeInRange(9, 15, 15, 30)) {
                  const result = checkExchangeSegment(channelList, "NFO");
                  if (result === true) {
                    await socketRestart();
                    return;
                  }
                }

                if (isTimeInRange(9, 15, 23, 30)) {
                  const result = checkExchangeSegment(channelList, "MCX");
                  if (result === true) {
                    await socketRestart();
                    return;
                  }
                }
              };
            } catch (error) {
              console.log("Error Shocket", new Date() + error);
              socketRestart();
            }
          }
        })
        .catch((error) => {
          socketRestart();
          return "error";
        });
    } catch (error) {
      console.log("Error createSocketSess", error);
    }
  }
};


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

    if (response.tk) {

      // const Make_startegy_token = await UserMakeStrategy.findOne({ tokensymbol: response.tk });
      // if (Make_startegy_token) {

      //   await connectToDB(response.tk, response)
      // }

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
    // console.log("Channel list sent:", channelList);
  } else {
    console.log("WebSocket is not open. Cannot send channel list.");
  }
}


// Function to dynamically update the channelList and send it
function updateChannelAndSend(newChannel) {

  sendChannelList(newChannel);  // Send updated channel list
}


const getSocket = () => {
  return socketObject;
};

const socketRestart = async () => {
  await Alice_Socket();
};

function checkExchangeSegment(input, exchange) {
  if (input.includes(exchange)) {
    return true;
  } else {
    return false;
  }
}

module.exports = { Alice_Socket, getSocket };
