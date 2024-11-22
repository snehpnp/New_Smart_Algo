"use strict";

const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

// Function to connect to MongoDB
const connectToMongoDB = async() => {
  try {
  //  await killAllSessions()
    // Connect to MongoDB using mongoose
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

    // Reconnect if the connection is lost
    connection.on("disconnected", () => {
      console.log("MongoDB connection lost. Reconnecting...");
      connectToMongoDB(); // Reconnect
    });

  } catch (error) {
    console.log("Failed to connect to MongoDB at Time:", new Date(), error);
  }
};

// Function to kill all sessions
const killAllSessions = async () => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Step 1: Fetch and display connection status
    const serverStatus = await client.db().admin().command({ serverStatus: 1 });
    const connections = serverStatus.connections;
    console.log("Connections Status:");
    console.log(`- Current Connections: ${connections.current}`);
    console.log(`- Available Connections: ${connections.available}`);
    console.log(`- Total Connections Created: ${connections.totalCreated}`);
    console.log(`- Active Connections: ${connections.active}`);

    // Step 2: List and kill sessions if applicable
    // const adminDb = client.db().admin();

    // // Using serverStatus to show connections without listSessions
    // const sessions = await adminDb.command({ listSessions: { allUsers: true } });

    // console.log("\nSessions List:");
    // for (const session of sessions.cursor.firstBatch) {
    //   console.log(`- Session ID: ${JSON.stringify(session.id)}`);
    // }

    // Uncomment to kill sessions
    // console.log("\nKilling All Sessions...");
    // for (const session of sessions.cursor.firstBatch) {
    //     await adminDb.command({ killSessions: [session.id] });
    //     console.log(`Killed Session: ${JSON.stringify(session.id)}`);
    // }

    console.log("All Sessions Terminated.");
  } catch (err) {
    console.error("Error during connection check or session termination:", err);
  } finally {
    await client.close();
  }
};

module.exports = { connectToMongoDB, killAllSessions };
