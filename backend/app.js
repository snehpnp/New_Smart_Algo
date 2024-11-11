"use strict";
require("dotenv").config();
// const mongoConnection = require('./App/Connection/mongo_connection')
const { connectToMongoDB } = require("./App/Connection/mongo_connection");

const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();

// HELLO SNEH JAISWAL
const http = require("http");
const https = require("https");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyparser = require("body-parser");
const { Client } = require("ssh2");
const db1 = require("./App/Models/index");
const TttModal = db1.tttModal;
const dbTest = db1.dbTest;


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
const server = http.createServer(app);
app.use(express.json());

// REQUIRE File
require("./App/Cron/cron");
// require("./App/Cron/cron_ss");
// Routes all
require("./App/Routes")(app);
// EMERGANCY
require("./request")(app);

// require("./Teting")(app);

//require("./redisSocketConnect")(app)

// Connect Local backend Socket
const { setIO, getIO } = require("./App/Helper/BackendSocketIo");


const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("help_from_client", (data) => {
    socket.broadcast.emit("test_msg_Response", data);
  });

  socket.on("logout_user_from_other_device_req", (data111) => {
    socket.broadcast.emit("logout_user_from_other_device_res", data111);
  });
});

setIO(io)
  .then(() => {
    getIO()
      .then((ioObject) => {})
      .catch((error) => {});
  })
  .catch((error) => {});

app.get("/pp", (req, res) => {
  io.emit("EXIT_TRADE_GET_NOTIFICATION", { data: "okkkk" });
  res.send("DONE");
});

app.post("/pm2/update", async (req, res) => {
  const { host, password } = req.body;

  if (!password) {
    return res.status(400).send("Password is required");
  }

  const conn = new Client();

  conn
    .on("ready", () => {
      console.log(`Connected to ${host}`);

      // Run pm2 update command
      conn.exec("pm2 update", (err, stream) => {
        if (err) throw err;

        stream
          .on("close", (code, signal) => {
            console.log(`Closed connection to ${host} with code ${code}`);
            conn.end();
          })
          .on("data", (data) => {
            
          })
          .stderr.on("data", (data) => {
          
          });
      });
    })
    .connect({
      host: host,
      port: 22,
      username: "root",
      password: password,
    });

  return res.send({
    status: true,
    msg: "PM2 update initiated on all servers.",
  });
});


app.get('/UpdateChannel/:c/:e', async (req, res) => {
  const {  TruncateTableTokenChainAdd_fiveMinute } = require('./App/Cron/cron_ss')
  const { c ,e} = req.params;

  
  TruncateTableTokenChainAdd_fiveMinute()
  return res.send({ status: true, msg: 'Channel Update' });

  const { updateChannelAndSend } = require('./App/Helper/Alice_Socket')
  
   //updateChannelAndSend(c)
});







app.post("/update-customer-files", async (req, res) => {
  const customerId = req.body.customerId;
  const updatedIdentityProof = req.body.identity_proof;

  if (!updatedIdentityProof || !Array.isArray(updatedIdentityProof)) {
    return res.status(400).json({ success: false, message: "Invalid identity proof data." });
  }

  try {
    const customer = await TttModal.findOne({ customerId: new ObjectId(customerId) });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    const currentIdentityProof = customer.identity_proof || [];
    const currentDocIds = new Set(currentIdentityProof.map(proof => proof.doc_id_number));
    const updatedDocIds = new Set(updatedIdentityProof.map(proof => proof.doc_id_number));

    // 1. Remove identity proofs that are not in the updated list
    await TttModal.updateOne(
      { _id: customer._id },
      { $pull: { identity_proof: { doc_id_number: { $nin: Array.from(updatedDocIds) } } } }
    );

    // 2. Prepare promises for updating or adding identity proofs
    const updatePromises = updatedIdentityProof.map(async (updatedProof) => {
      const docId = updatedProof.doc_id_number;
      
      if (currentDocIds.has(docId)) {
        // If it exists, update the document
        return TttModal.updateOne(
          { _id: customer._id, "identity_proof.doc_id_number": docId },
          { $set: { "identity_proof.$": updatedProof } }
        );
      } else {
        // If it doesn't exist, add (push) the new document
        return TttModal.updateOne(
          { _id: customer._id },
          { $push: { identity_proof: updatedProof } }
        );
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: "Identity proofs updated successfully.",
    });
  } catch (error) {
    console.error("Error updating customer files:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
});


app.get("/deleteTableAndView",async(req,res)=>{
  await checkAndDrop();
  return res.send({ status: true, msg: 'Table and View Deleted' });
})


async function checkAndDrop() {
  const collections = await dbTest.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);
  console.log("Existing collections/views:", collectionNames);
  let arr =  ['22','3045','2885','6705','10666']
  let arr1 =  ['M_','M3_','M5_','M10_','M15_','M30_','M60_','M1DAY_']
  for (const element of arr) {
    console.log("Dropping collection:", element);
    await dbTest.collection(element).drop();
      for (const element1 of arr1) {

          const collectionName = element1 + element;

          if (collectionNames.includes(collectionName)) {
               await dbTest.collection(collectionName).drop();
          } else {
              console.log("Collection/View not found:", collectionName);
          }
      }
  }
}




// Server start
server.listen(process.env.PORT, () => {
  const { Alice_Socket } = require("./App/Helper/Alice_Socket");
  console.log(`Server is running on  http://0.0.0.0:${process.env.PORT}`);
  connectToMongoDB();
  Alice_Socket();
});
