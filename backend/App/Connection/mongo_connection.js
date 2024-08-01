"use strict";

const mongoose = require("mongoose");

const db_connect = process.env.MONGO_URI;



mongoose.connect(db_connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10, // Increase the pool size if necessary
});

const connection = mongoose.connection;

connection.on("error", (error) => {
  console.error("MongoDB Connection Error:", error);
  // Retry logic can be implemented here if needed
  setTimeout(() => {
    mongoose.connect(db_connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME,
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Increase the pool size if necessary
    });
  }, 5000); // Retry after 5 seconds
});

connection.once("open", () => {
  console.log("Connected to MongoDB");

});

// Handling disconnection
connection.on("disconnected", () => {
  console.warn("MongoDB disconnected!");
  // Retry connection
  mongoose.connect(db_connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
    connectTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    maxPoolSize: 10, // Increase the pool size if necessary
  });
});

// Handling reconnection
connection.on("reconnected", () => {
  console.log("MongoDB reconnected!");
});
