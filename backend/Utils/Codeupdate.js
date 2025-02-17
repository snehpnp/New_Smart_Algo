module.exports = function (app) {
  const db = require("../App/Models");
  const mongoose = require("mongoose");

  let uri =
    "mongodb://pnpinfotech:p%26k56%267GsRy%26vnd%26@217.145.69.45:27017/";

  // Function to update services collection in all databases
  async function updateLotSizeInDatabases() {
    const failedDatabases = []; // Store URIs of failed connections
    const results = []; // Store results of successful connections

    let connection;

    try {
      connection = await mongoose.createConnection(uri).asPromise();
      console.log(`✅ Connected to ${uri}`);

      const all_panels = connection.model(
        "all_panels",
        new mongoose.Schema({}, { strict: false })
      );
      // const all_panelsServiceFind = await all_panels.find({}).exec();
      const theme_lists_modal = connection.model(
        "theme_lists",
        new mongoose.Schema({}, { strict: false })
      );

      const all_panelsServiceFind = await all_panels
        .aggregate([
          {
            $match: { panel_name: "NEW_PNPTRADE" },
          },
          {
            $lookup: {
              from: "theme_lists",
              localField: "theme_id",
              foreignField: "_id",
              as: "theme_lists",
            },
          },
          {
            $unwind: { path: "$theme_lists", preserveNullAndEmptyArrays: true },
          },
        ])
        .exec();

       
      

      if (all_panelsServiceFind && all_panelsServiceFind.length > 0) {
        all_panelsServiceFind.forEach(async (element) => {
          if (!element?.db_url) return;

          let connection1;
          try {
            connection1 = await mongoose
              .createConnection(element?.db_url)
              .asPromise();
            console.log(`✅ Connected to ${element?.db_url}`);

            const admin_permissions = connection1.model(
              "admin_permissions",
              new mongoose.Schema({}, { strict: false })
            );
            // await admin_permissions.deleteMany({ });


              let { __v, theme_lists, ...rest } = element;
          
              if (theme_lists) {
                  let { _id, __v, ...rest1 } = theme_lists;
                  console.log("all_panelsServiceFind", rest.panel_name );

                  let UpdateRes = await admin_permissions.updateMany(
                    { panel_name: rest.panel_name },
                    { $set: {...rest,...rest1} },
                    { upsert: true }
                  );
                  console.log("UpdateRes", UpdateRes);


              } else {
                  console.log("theme_lists is undefined or empty");
              }
          


            

       
          } catch (error) {
            console.error(
              `❌ Failed to update ${element?.db_url}:`,
              error.message
            );
            failedDatabases.push(element?.db_url); // Add failed URI to the list
          } finally {
            if (connection1) {
              await connection1.close();
              console.log(`🔌 Connection closed for ${element?.db_url}`);
            }
          }
        });
      }
    } catch (error) {
    } finally {
      if (connection) {
        await connection.close();
        console.log(`🔌 Connection closed for ${uri}`);
      }
    }

    if (failedDatabases.length > 0) {
      console.warn(
        `⚠️ Failed to update the following databases:`,
        failedDatabases
      );
    }
  }

  // API Endpoint to trigger updates
  app.get("/superadmin/update", async (req, res) => {
    try {
      await updateLotSizeInDatabases();
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
