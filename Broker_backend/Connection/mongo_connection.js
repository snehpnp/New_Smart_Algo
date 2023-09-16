"use strict";
const { connect, connection } = require("mongoose");
const mongoose = require("mongoose");



const connectToDatabase = async () => {
  try {
    connect(process.env.MONGO_URI)
      .then(() => {
        connection.useDb(process.env.DB_NAME);
        console.log("Connected to MongoDB BROKER SERVER " + process.env.DB_NAME);


      })
      .catch((err) => {
        console.log("MongoDB Error in Connection ", err);
      });
  } catch (error) {
    console.log("error in mongo connection", error);
  }
}
connectToDatabase()

