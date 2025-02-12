module.exports = function (app) {
  const db = require("../App/Models");
  const mongoose = require("mongoose");

  const databaseURIss = [
    "mongodb://pnpinfotech:p%26k56%267GsRy%26vnd%26@217.145.69.45:27017/",
  ];

  // Function to update services collection in all databases
  async function updateLotSizeInDatabases(databaseURIs) {
    const failedDatabases = []; // Store URIs of failed connections
    const results = []; // Store results of successful connections

    for (const uri of databaseURIs) {
      let connection;

      try {
        connection = await mongoose.createConnection(uri).asPromise();
        console.log(`✅ Connected to ${uri}`);

        const all_panels = connection.model(
          "all_panels",
          new mongoose.Schema({}, { strict: false })
        );
        const all_panelsServiceFind = await all_panels
          .find({ is_active: 0 })
          .exec();

        if (all_panelsServiceFind && all_panelsServiceFind.length > 0) {
          all_panelsServiceFind.forEach(async (element) => {
            console.log("element", element?.db_url);
          });
        }
      } catch (error) {
        console.error(`❌ Failed to update ${uri}:`, error.message);
        failedDatabases.push(uri); // Add failed URI to the list
      } finally {
        if (connection) {
          await connection.close();
          console.log(`🔌 Connection closed for ${uri}`);
        }
      }
    }

    if (failedDatabases.length > 0) {
      console.warn(
        `⚠️ Failed to update the following databases:`,
        failedDatabases
      );
    }
    if (results.length > 0) {
      console.log(results);
    }
  }

  // API Endpoint to trigger updates
  app.get("/superadmin/update", async (req, res) => {
    try {
      await updateLotSizeInDatabases(databaseURIss);
      return res.send({
        status: true,
        message: " updated across all accessible databases",
      });
    } catch (error) {
      console.error("❌ Update failed:", error.message);
      return res
        .status(500)
        .send({ status: false, message: "Failed to update " });
    }
  });
};
