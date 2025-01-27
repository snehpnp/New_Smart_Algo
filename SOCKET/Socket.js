"use strict";
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const WebSocket = require("ws");
const CryptoJS = require("crypto-js");
const Cron = require("node-cron");
const app = express();
const server = http.createServer(app);
let ws; // WebSocket Object
var cron = require("node-cron");

// CORS Configuration
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db_GET_VIEW = client.db("test");
const stock_live_price = db_GET_VIEW.collection('stock_live_price');

// MongoDB Connection
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB Connection Error:", error);
    });

    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Reconnecting...");
      connectToMongoDB();
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

// Mongoose Models
const token_chain = mongoose.model(
  "token_chain",
  new mongoose.Schema({}),
  "token_chain"
);

const live_price = mongoose.model("live_price", new mongoose.Schema({}));

// Utility Functions
const isTimeInRange = (startHour, startMinute, endHour, endMinute) => {
  const indiaOffset = 330; // IST offset in minutes
  const currentMinutes =
    new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + indiaOffset;

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// WebSocket Initialization
const Alice_Socket = async () => {
  try {
    console.log("Initializing WebSocket...");
    const now = new Date();
    const curtime = parseInt(`${now.getHours()}${now.getMinutes()}`);
    if (curtime > 1531) return;

    const brokerInfo = await live_price
      .findOne({ broker_name: "ALICE_BLUE", trading_status: "on" })
      .sort({ _id: -1 })
      .lean();

    if (!brokerInfo) return;

    const tokens = await token_chain.find().lean();

    const channelList = tokens
      .filter((t) => t.exch && t._id)
      .map((t) => `${t.exch}|${t._id}`)
      .join("#");

    const aliceBaseUrl =
      "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/";
    const { user_id: userId, access_token: userSession } = brokerInfo;

    const loginPayload = { loginType: "API" };
    const response = await axios.post(
      `${aliceBaseUrl}/ws/createSocketSess`,
      loginPayload,
      {
        headers: {
          Authorization: `Bearer ${userId} ${userSession}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.stat !== "Ok") return;

    ws = new WebSocket("wss://ws1.aliceblueonline.com/NorenWS/");
    ws.onopen = () => {
      const encryptedToken = CryptoJS.SHA256(
        CryptoJS.SHA256(userSession).toString()
      ).toString();
      ws.send(
        JSON.stringify({
          susertoken: encryptedToken,
          t: "c",
          actid: `${userId}_API`,
          uid: `${userId}_API`,
          source: "API",
        })
      );
    };

    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      if (data.tk && data.lp && data.e && data.ft) {
        const now = new Date();
        const curTime = parseInt(`${now.getHours()}${now.getMinutes()}`);
        if (curTime < 1530) {
          await stock_live_price.updateOne(
            { _id: data.tk },
            { $set: { _id: data.tk, lp: data.lp, exc: data.e, curTime, ft: data.ft } },
            { upsert: true }
          );
        }
      } else if (data.s === "OK") {
        ws.send(JSON.stringify({ k: channelList, t: "t" }));
      }
    };

    ws.onclose = () => {
      if (isTimeInRange(9, 15, 23, 30)) socketRestart();
    };

    ws.onerror = () => socketRestart();
  } catch (error) {
    console.error("Error in Alice_Socket:", error);
  }
};

const socketRestart = async () => {
  console.log("Restarting WebSocket...");
  await Alice_Socket();
};

// Routes
app.get("/restart/socket", (req, res) => {
  console.log("Received request to restart socket");
  Alice_Socket();
  res.send("Socket restart initiated");
});

app.post("/add/token", async (req, res) => {
  try {
    const { token, exchange } = req.body;

    if (!token || !exchange) {
      return res.status(400).json({ error: "Token and exchange are required" });
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ k: `${exchange}|${token}`, t: "t" });
      ws.send(message);
      console.log("Sent message to WebSocket:", message);
      return res.send("Token added and message sent successfully");
    } else {
      console.error("WebSocket is not open");
      return res.status(500).send("WebSocket is not connected");
    }
  } catch (error) {
    console.error("Failed to add token:", error);
    res.status(500).send("Failed to add token");
  }
});

cron.schedule("15,30,45,0 9-14 * * 1-5", async () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
  } else {
    await Alice_Socket();
  }
});

// Server Setup
const PORT = process.env.PORT || 7770;
server.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  connectToMongoDB();
});
