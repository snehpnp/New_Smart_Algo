

const mongoose = require("mongoose");

const db_connect = process.env.MONGO_URI;

mongoose.connect(db_connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
});

const connection = mongoose.connection;

connection.on("error Time-" + new Date(), (error) => {
  console.log("MongoDB Connection Error:", error);
});

connection.once("open", () => {
  console.log("Connected to MongoDB Time-", new Date());
 
});