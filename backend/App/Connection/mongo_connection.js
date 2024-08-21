const mongoose = require("mongoose");

const db_connect = process.env.MONGO_URI;

mongoose.connect(db_connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
});

const connection = mongoose.connection;

connection.on("error", (error) => {
  console.log("MongoDB Connection Error at Time:", new Date(), error);
});

connection.once("open", () => {
  console.log("Connected to MongoDB at Time:", new Date());
});
