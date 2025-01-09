"use strict";
require("dotenv").config();
const {
  connectToMongoDB,
} = require("../BACKEND/App/Connection/mongo_connection");
const express = require("express");
const app = express();


// HELLO SNEH
const http = require("http");
const https = require("https");
const socketIo = require("socket.io");
const bodyparser = require("body-parser");
const WebSocket = require("ws");
var CryptoJS = require("crypto-js");

// const db = require('./Models');
const db = require("../BACKEND/App/Models");
const live_price = db.live_price;

// CONNECTION FILE IN MONGOODE DATA BASE
const MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect();
const db1 = client.db(process.env.DB_NAME);

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};
app.use(bodyparser.json({ verify: rawBodySaver }));
app.use(bodyparser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyparser.raw({ verify: rawBodySaver, type: "*/*" }));
var cors = require("cors");

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));


// =======================SOCKET CONNECT AND ADD PRICE =====================

const server = http.createServer(app);
const io = socketIo(server);

const ConnectSocket = async (EXCHANGE, instrument_token) => {
  const channel_List = `${EXCHANGE}|${instrument_token}`;

  const broker_infor = await live_price.findOne({
    broker_name: "ALICE_BLUE",
    trading_status: "on",
  });

  if (broker_infor) {
    const aliceBaseUrl =
      "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";
    const userid = broker_infor.user_id;
    const userSession1 = broker_infor.access_token;
    const type = { loginType: "API" };
    const url = "wss://ws1.aliceblueonline.com/NorenWS/";

    try {
      const token_chain_list = db1.collection("token_chain");
      await token_chain_list.updateOne(
        { _id: instrument_token },
        {
          $set: {
            _id: instrument_token,
            exch: EXCHANGE,
          },
        },
        { upsert: true }
      );

      const res = await axios.post(`${aliceBaseUrl}ws/createSocketSess`, type, {
        headers: {
          Authorization: `Bearer ${userid} ${userSession1}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.stat === "Ok") {
        return new Promise((resolve, reject) => {
          const socket = new WebSocket(url);

          socket.onopen = function () {
            const encrcptToken = CryptoJS.SHA256(
              CryptoJS.SHA256(userSession1).toString()
            ).toString();

            const initCon = {
              susertoken: encrcptToken,
              t: "c",
              actid: userid + "_" + "API",
              uid: userid + "_" + "API",
              source: "API",
            };

            socket.send(JSON.stringify(initCon));
          };

          socket.onmessage = async function (msg) {
            try {
              const response = JSON.parse(msg.data);

              if (response.tk) {
                const currentDate = new Date();
                const hours = currentDate
                  .getHours()
                  .toString()
                  .padStart(2, "0");
                const minutes = currentDate
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");

                const stock_live_price = db1.collection("stock_live_price");
                const filter = { _id: response.tk };

                if (response.lp !== undefined) {
                  let bp1 = response.bp1 || response.lp;
                  let sp1 = response.sp1 || response.lp;

                  const update = {
                    $set: {
                      lp: response.lp,
                      exc: response.e,
                      sp1: sp1,
                      bp1: bp1,
                      curtime: `${hours}${minutes}`,
                    },
                  };

                  await stock_live_price.updateOne(filter, update, {
                    upsert: true,
                  });
                }

                socket.close();
                resolve(response); // Send the price data back to the function caller
              }

              if (response.s === "OK") {
                const json = {
                  k: channel_List,
                  t: "t",
                };
                socket.send(JSON.stringify(json));
              }
            } catch (error) {
              console.error("Error in onmessage:", error);
              reject(error);
            }
          };

          socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            reject(error);
          };

          socket.onclose = () => {
            console.log("Socket closed");
          };
        });
      }
    } catch (error) {
      console.error("Error in Socket Session:", error);
      throw error;
    }
  } else {
    throw new Error("Trading is turned off by admin.");
  }
};

// API Route Example
app.get("/connect-socket", async (req, res) => {
  try {
    const CurrentPrice = await ConnectSocket("NFO", 133887);

    res.json({ success: true, data: CurrentPrice });
  } catch (error) {
    console.error("Failed to fetch price:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================================================================================================




// Server start
app.listen(process.env.PORT || 5000, () => {
  console.log(`Broker Server is running on http://0.0.0.0:${process.env.PORT || 5000}`);
  connectToMongoDB();
});
