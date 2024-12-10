"use strict";

const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    const db_connect = process.env.MONGO_URI;

    // Connect to MongoDB without deprecated options
    mongoose.connect(db_connect, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 50000, // 50 seconds
      socketTimeoutMS: 45000, // 45 seconds for I/O operations
      connectTimeoutMS: 30000, // 30 seconds to establish a connection
    });

    const connection = mongoose.connection;

    connection.on("error", (error) => {
      console.log("MongoDB Connection Error at Time:", new Date(), error);
    });

    connection.once("open", () => {
      console.log("Connected to MongoDB at Time:", new Date());
    });

    // Reconnect if the connection is lost
    connection.on("disconnected", () => {
      console.log("MongoDB connection lost. Reconnecting...");
      connectToMongoDB(); // Reconnect
    });

  } catch (error) {
    console.log("Failed to connect to MongoDB at Time:", new Date(), error);
  }
};

module.exports = { connectToMongoDB };
