// const mongoose = require("mongoose");

// const db_connect = process.env.MONGO_URI;

// mongoose.connect(db_connect, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   dbName: process.env.DB_NAME,
//   serverSelectionTimeoutMS: 50000, // 50 seconds
//   socketTimeoutMS: 45000, // 45 seconds for I/O operations
//   connectTimeoutMS: 30000, // 30 seconds to establish a connection
// });

// const connection = mongoose.connection;

// connection.on("error", (error) => {

// });

// connection.once("open", () => {

// });

const mongoose = require("mongoose");

const connectToMongoDB =  () => {
  try {
     const db_connect = process.env.MONGO_URI;
      mongoose.connect(db_connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
  } catch (error) {
    console.log("Failed to connect to MongoDB at Time:", new Date(), error);
  }
};

module.exports = {connectToMongoDB};
