const axios = require("axios");
const WebSocket = require("ws");
const CryptoJS = require("crypto-js");
const db = require("./Models");
const { live_price, stock_live_price, token_chain } = db;

const aliceBaseUrl = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";
const url = "wss://ws1.aliceblueonline.com/NorenWS/";
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let ws; // WebSocket instance
let isSocketConnected = false; // Flag to track WebSocket connection status

// Function to create socket session
const createSocketSession = async (userId, userSession) => {
  try {
    const response = await axios.post(`${aliceBaseUrl}ws/createSocketSess`, { loginType: "API" }, {
      headers: {
        Authorization: `Bearer ${userId} ${userSession}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.stat === "Ok") {
      console.log("Alice Socket Connected ", new Date());
      return true;
    }
  } catch (error) {
    console.log("Error creating socket session:", error);
    return false;
  }
};

// Function to handle WebSocket events
const handleWebSocket = async (userSession, userId, channelList) => {
  try {
    ws = new WebSocket(url);

    ws.onopen = () => {
      const encrcptToken = CryptoJS.SHA256(CryptoJS.SHA256(userSession).toString()).toString();
      const initCon = {
        susertoken: encrcptToken,
        t: "c",
        actid: `${userId}_API`,
        uid: `${userId}_API`,
        source: "API",
      };
      ws.send(JSON.stringify(initCon));
      isSocketConnected = true; // Set connection status to true when WebSocket is connected
    };

    ws.onmessage = async (msg) => {
      const response = JSON.parse(msg.data);

      if (response.tk) {
        await processStockPrice(response);
      } else if (response.s === "OK") {
        const json = {
          k: channelList,
          t: "t",
        };
        ws.send(JSON.stringify(json));
      }
    };

    ws.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
      socketRestart();
    };

    ws.onclose = async () => {
      console.log("WebSocket closed. Attempting reconnect...");
      isSocketConnected = false; // Set connection status to false when WebSocket is closed
      await socketRestart();
    };

  } catch (error) {
    console.log("WebSocket connection failed:", error);
    isSocketConnected = false;
    await socketRestart();
  }
};

// Function to process stock live price data
const processStockPrice = async (response) => {
  try {
    if (response.lp !== undefined && response.e !== undefined && response.ft !== undefined) {
      const now = new Date();
      const curtime = `${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;
      
      if (curtime < 1530) {
        await stock_live_price.updateOne(
          { _id: response.tk },
          {
            $set: {
              lp: response.lp,
              exc: response.e,
              curtime: curtime,
              ft: response.ft,
            },
          },
          { upsert: true }
        );
      }
    }
  } catch (error) {
    console.log("Error processing stock price:", error);
  }
};

// Function to restart socket connection
const socketRestart = async () => {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log("Reconnecting WebSocket...");
    await Alice_Socket();
  } else {
    console.log("Max reconnect attempts reached.");
  }
};

// Main function to connect to Alice Blue WebSocket
const Alice_Socket = async () => {
  // Check if the socket is already connected
  if (isSocketConnected) {
    console.log("WebSocket is already connected. Ignoring connect request.");
    return;
  }

  const broker_infor = await live_price.findOne({ broker_name: "ALICE_BLUE", trading_status: "on" }).sort({ _id: -1 });

  if (!broker_infor) {
    console.log("Broker Trading Off");
    return;
  }

  const now = new Date();
  const curtime = `${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;

  if (curtime > 1531) {
    console.log("Market Close");
    return;
  }

  const updateToken = await token_chain.find({}).toArray();
  let channelList = updateToken.map(data => (data.exch && data._id) ? `${data.exch}|${data._id}` : "").join("#");

  if (broker_infor.user_id && broker_infor.access_token && broker_infor.trading_status === "on") {
    const userId = broker_infor.user_id;
    const userSession = broker_infor.access_token;

    const sessionCreated = await createSocketSession(userId, userSession);

    if (sessionCreated) {
      await handleWebSocket(userSession, userId, channelList);
    } else {
      console.log("Error creating socket session.");
    }
  } else {
    console.log("Broker Trading Off");
  }
};



module.exports = { Alice_Socket };
