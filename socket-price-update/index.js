"use strict"


require("dotenv").config();
const { connectToMongoDB } = require("./Connection");


const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");

const corsOpts = {
    origin: "*",
    methods: ["GET", "POST"],
  
    allowedHeaders: [
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
      "authorization",
    ],
  };

app.use(cors(corsOpts));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: "10mb", extended: true }));
app.use(bodyparser.json());
app.use(express.json());

require("./Cron")

const {Alice_Socket} = require("./Alicesocket");


app.get("/connect/socket", (req, res) => {
    Alice_Socket()
    console.log("Socket Connected");
    res.send("Socket Connected");
})



let port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectToMongoDB(); 
  });



