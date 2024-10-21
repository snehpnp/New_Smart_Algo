"use strict";
const { connectToMongoDB } = require("../../Connection/mongo_connection");
const db = require("../../Models");
const panel_model = db.panel_model;
const User = db.user;
const ApiCreateInfo = db.api_create_info;
const Superadmin_History = db.Superadmin_History;
const SuperadminHistoryBackup = db.SuperadminHistoryBackup;
const Plansmodel = db.Plansmodel;
const Faq_Data = db.Faq_Data;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");
const { formattedDateTime } = require("../../Helper/time.helper");
const axios = require("axios");
class Panel {
  // ADD PANEL IN A COLLECTION
  async AddPanel(req, res) {
    try {
      const {
        panel_name,
        domain,
        port,
        key,
        ip_address,
        theme_id,
        backend_rul,
        parent_id,
        Create_Strategy,
        Option_chain,
        Strategy_plan,
        broker_id,
        UserName,
        db_url,
      } = req.body.req;

      // FIND PANEL NAME DUPLICATE
      const panel_data = await panel_model.findOne({ panel_name: panel_name });
      if (panel_data) {
        return res
          .status(409)
          .send({ status: false, msg: "Panel Name already exists", data: [] });
      }

      // THEME CREATE SNEH
      const AddPanel = new panel_model({
        panel_name: panel_name,
        domain: domain,
        port: port,
        key: key,
        ip_address: ip_address,
        theme_id: theme_id,
        Create_Strategy: Create_Strategy,
        Option_chain: Option_chain,
        Strategy_plan: Strategy_plan,
        broker_id: broker_id,
        backend_rul: backend_rul,
        is_active: 0,
        db_url: db_url,
        live_price: 1,
        Two_day_client: 1,
      });
      AddPanel.save()
        .then(async (data) => {
          const filter = { panal_name: "111" };
          const update = {
            $set: {
              superadmin_name: UserName,
              panal_name: panel_name,
              client_id: null,
              msg: "Add Panel",
            },
          };

          const options = { upsert: true };

          await Superadmin_History.updateOne(filter, update, options);

          const fetchBrokerView = async () => {
            try {
              const response = await axios.get(backend_rul + "all/brokerview");
              return response.data;
            } catch (error) {
              throw error;
            }
          };

          const fetchBrokerView1 = async () => {
            try {
              let data = JSON.stringify({
                panelname: panel_name,
                client_key: key,
                backend_rul: backend_rul,
                domain: domain,
                db_url: db_url,
              });

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: backend_rul + "all/tabel",
                headers: {
                  "Content-Type": "application/json",
                },
                data: data,
              };
              axios
                .request(config)
                .then((response) => {})
                .catch((error) => {});
            } catch (error) {
              throw error;
            }
          };

          const AdminAdd = async () => {
            try {
              let data = JSON.stringify({
                panelname: panel_name,
                client_key: key,
              });

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: backend_rul + "add/admin",
                headers: {
                  "Content-Type": "application/json",
                },
                data: data,
              };
              axios
                .request(config)
                .then((response) => {})
                .catch((error) => {});
            } catch (error) {
              throw error;
            }
          };

          fetchBrokerView();
          fetchBrokerView1();
          AdminAdd();

          return res.send({
            status: true,
            msg: "successfully Add!",
            data: data,
          });
        })
        .catch((err) => {
          if (err.keyValue) {
            logger.error("Key duplicate", {
              role: "SUPERADMIN",
              user_id: parent_id,
            });
            return res
              .status(409)
              .send({
                status: false,
                msg: "Key duplicate",
                data: err.keyValue,
              });
          }
        });
    } catch (error) {
      logger.error("Server Error", { role: "SUPERADMIN", user_id: parent_id });
    }
  }

  // ADD PANEL IN A COLLECTION
  async EditPanel(req, res) {
    try {
      const {
        _id,
        panel_name,
        domain,
        port,
        key,
        ip_address,
        theme_id,
        db_url,
        backend_rul,
        db_name,
        broker_id,
        Create_Strategy,
        Option_chain,
        Strategy_plan,
        UserName,
      } = req.body;

      var panle_data = {
        panel_name: panel_name,
        domain: domain,
        port: port,
        key: key,
        ip_address: ip_address,
        theme_id: theme_id,
        db_url: db_url,
        db_name: db_name,
        broker_id: broker_id.filter((data) => data.checked == true),
        Create_Strategy: Create_Strategy,
        Option_chain: Option_chain,
        Strategy_plan: Strategy_plan,
        backend_rul: backend_rul,
      };

      var objectId = new ObjectId(_id);

      const panel_data = await panel_model.find({ _id: objectId });

      if (!panel_data) {
        return res.send({ status: false, msg: "Panel Not exists", data: [] });
      }

      const filter = { _id: _id };
      const updateOperation = { $set: panle_data };
      const result = await panel_model.updateOne(filter, updateOperation);
      if (!result) {
        return res
          .status(409)
          .send({ status: false, msg: "Company not update", data: [] });
      }

      const update = {
        $set: {
          superadmin_name: UserName,
          panal_name: panel_name,
          client_id: null,
          msg: "Edit Panel",
        },
      };

      const options = { upsert: true };

      await Superadmin_History.updateOne(
        { panal_name: "111" },
        update,
        options
      );

      return res
        .status(200)
        .send({ status: true, msg: "Update Successfully.", data: result });
    } catch (error) {}
  }

  // USER PROFILE TO GET USER
  async UserProfile(req, res) {
    try {
      const { id } = req.body;
  
      // FIND USER BY ID
      let EmailCheck = await User.findOne({ _id: id });
  
      if (!EmailCheck) {
        return res
          .status(409)
          .send({ status: false, msg: "User Not exists", data: [] });
      }
  

     
      // Try to get the PlanName
      let PlanName;
      try {
        const plan = await Plansmodel.findOne({ _id: EmailCheck.plan_id });
        PlanName = plan ? plan.name : "";
      } catch (planError) {
        PlanName = ""; 
      }
  
      return res.send({
        status: true,
        msg: "Get User",
        data: EmailCheck,
        PlanName: PlanName,
      });
    } catch (error) {
      connectToMongoDB();
      return res
        .status(500)
        .send({ status: false, msg: "Server Error", data: [] });
    }
  }
  

  // GET ONE PANEL AND HIS THEME INFORMATION
  async GetPanleinformation(req, res) {
    try {
      const { domain } = req.body;

      const desiredDomain = "your_desired_domain_value";

      const Panle_information = await panel_model.aggregate([
        {
          $match: {
            domain: domain,
          },
        },
        {
          $lookup: {
            from: "theme_lists",
            localField: "theme_id",
            foreignField: "_id",
            as: "theme_data",
          },
        },
      ]);

      // CHECK IF PANEL EXIST OR NOT
      if (!Panle_information) {
        return res
          .status(409)
          .send({ status: false, msg: "Panle Not exist Not exists", data: [] });
      }
      return res.send({
        status: true,
        msg: "Get Panel Information",
        data: Panle_information,
      });
    } catch (error) {}
  }

  // GET All Panel
  async GetAllPanel(req, res) {
    try {
      const { page, limit } = req.body; // LIMIT & PAGE
      const skip = (page - 1) * limit;

      const totalCount = await panel_model.countDocuments();

      const getAllpanel = await panel_model.aggregate([
        {
          $lookup: {
            from: "theme_lists",
            localField: "theme_id",
            foreignField: "_id",
            as: "theme_info",
          },
        },
        {
          $unwind: {
            path: "$theme_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            panel_name: 1,
            domain: 1,
            key: 1,
            is_active: 1,
            is_expired: 1,
            theme_id: 1,
            theme_name: { $ifNull: ["$theme_info.theme_name", ""] },
            broker_id: 1,
            Two_day_client: 1,
            live_price: 1,
            backend_rul: 1,
            Strategy_plan: 1,
            Option_chain: 1,
            Create_Strategy: 1,
            db_url: 1,
            Refer_Earn: 1,
            ip_address: 1,
            month_ago_date: 1,
            month_ago_number: 1,
            Plans: 1,
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);

      // IF DATA NOT EXIST
      if (getAllpanel.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: getAllpanel,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Panels name",
        data: getAllpanel,
        page: Number(page),
        limit: Number(limit),
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (error) {
      return res
        .status(500)
        .send({ status: false, msg: "Internal Server Error" });
    }
  }

  // Create APi Infor
  async CreateAPiInfo(req, res) {
    try {
      const {
        title,
        description,
        steponeurl,
        imageone,
        steptwourl,
        imagetwo,
        stepthree,
        imagethree,
        note,
        youtubeurl,
      } = req.body;
      // const images = req.files.map((file) => file.buffer.toString('base64'));

      // Create a new entry in your MongoDB collection
      let a = new ApiCreateInfo({
        title,
        description,
        steponeurl,
        imageone,
        steptwourl,
        imagetwo,
        stepthree,
        imagethree,
        note,
        youtubeurl,
      });
      var ass = a
        .save()
        .then((data) => {
          if (data) {
            return res
              .status(200)
              .send({ status: true, msg: "Api Create successfully" });
          }
        })
        .catch((err) => {
          if (err.keyValue) {
            return res.send({
              status: false,
              msg: `name already exists`,
              error: err.keyValue,
            });
          } else {
            return res.send({
              status: false,
              msg: "Internal server error",
              error: err,
            });
          }
        });
    } catch (error) {
      return res.send({
        status: false,
        msg: "Internal server error",
        error: error.keyValue,
      });
    }
  }

  // Get All APi Infor
  async GetAllAPiInfo(req, res) {
    try {
      if (req.body.key == 1) {
        const panel_data = await panel_model
          .find({ domain: req.body.url })
          .select("broker_id");
        if (!panel_data) {
          return res.send({ status: false, msg: "Panel Not exists", data: [] });
        }

        var objectIds = panel_data[0].broker_id.map((data) => data.id);

        var tt;
        if (req.body.brokerId == -1) {
          tt = { $in: objectIds };
        } else {
          tt = req.body.brokerId;
        }

        // Find documents with matching ids
        const getAllpanel = await ApiCreateInfo.find({ broker_id: tt }).select(
          "title broker_id"
        );

        // IF DATA NOT EXIST
        if (getAllpanel.length == 0) {
          return res.send({
            status: false,
            msg: "Empty data",
            data: getAllpanel,
          });
        }

        // DATA GET SUCCESSFULLY
        return res.send({
          status: true,
          msg: "Get All Api Info",
          data: getAllpanel,
        });
      } else {
        const panel_data = await panel_model
          .find({ domain: req.body.url })
          .select("broker_id");
        if (!panel_data) {
          return res.send({ status: false, msg: "Panel Not exists", data: [] });
        }

        var objectIds = panel_data[0].broker_id.map((data) => data.id);

        var tt;
        if (req.body.brokerId == -1) {
          tt = { $in: objectIds };
        } else {
          tt = req.body.brokerId;
        }

        // Find documents with matching ids
        const getAllpanel = await ApiCreateInfo.find({ broker_id: tt });

        // IF DATA NOT EXIST
        if (getAllpanel.length == 0) {
          return res.send({
            status: false,
            msg: "Empty data",
            data: getAllpanel,
          });
        }

        // DATA GET SUCCESSFULLY
        return res.send({
          status: true,
          msg: "Get All Api Info",
          data: getAllpanel,
        });
      }
    } catch (error) {}
  }

  // Get All APi Infor
  async GetAllAPiInfo_Super(req, res) {
    try {
      const panel_data = await panel_model
        .find({ domain: req.body.url })
        .select("broker_id");
      if (!panel_data) {
        return res
          .status(409)
          .send({ status: false, msg: "Panel Not exists", data: [] });
      }

      // THEME LIST DATA
      const getAllpanel = await ApiCreateInfo.find({});

      // IF DATA NOT EXIST
      if (getAllpanel.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: getAllpanel,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Api Info",
        data: getAllpanel,
      });
    } catch (error) {
      console.log("Error Get all Info error-", error);
    }
  }

  // Update APi Info
  async UpdateAPiInfo(req, res) {
    try {
      // const {  data } = req.body

      ApiCreateInfo.findById(req.body._id).then(async (value) => {
        if (!value) {
          return res
            .status(409)
            .send({ status: false, msg: "Id not match", data: [] });
        }

        const filter = { _id: req.body._id };
        const updateOperation = { $set: req.body };
        const result = await ApiCreateInfo.updateOne(filter, updateOperation);

        if (!result) {
          return res
            .status(409)
            .send({ status: false, msg: "Company not update", data: [] });
        }
        // logger.info('Update Successfully', { role: "SUPERADMIN", user_id: parent_id });
        return res
          .status(200)
          .send({ status: true, msg: "Update Successfully.", data: result });
      });
    } catch (error) {
      console.log("Error APi Info error-", error);
      // logger.error('Server Error', { role: "SUPERADMIN", user_id: parent_id });
    }
  }

  // GET ONE PANEL AND HIS
  async GetPanlebroker(req, res) {
    try {
      const { domain } = req.body;

      const Panel_information = await panel_model.findOne(
        { domain: domain },
        "broker_id"
      );

      // CHECK IF PANEL EXIST OR NOT
      if (!Panel_information) {
        return res
          .status(409)
          .send({ status: false, msg: "Panle Not exist Not exists", data: [] });
      }
      return res.send({
        status: true,
        msg: "Get Panel Broker",
        data: Panel_information,
      });
    } catch (error) {}
  }

  // GET SUPER ADMIN HISTORY
  async GetHistoryData(req, res) {
    try {
      const { page, limit } = req.body; //LIMIT & PAGE
      const skip = (page - 1) * limit;

      const totalCount = await Superadmin_History.countDocuments();

      // THEME LIST DATA
      const getAllHistory = await Superadmin_History.find({})
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      // IF DATA NOT EXIST
      if (getAllHistory.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: getAllHistory,
        });
      }

      // DATA GET SUCCESSFULLY
      return res.send({
        status: true,
        msg: "Get All Panels name",
        data: getAllHistory,
        page: Number(page),
        limit: Number(limit),
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit)),
      });
    } catch (error) {
      console.log("Error Get all Panels error-", error);
    }
  }

  // UPDAYE QUERY IN ALL PANEL
  async updateQuery(req, res) {
    try {
      const { collection_name, query } = req.body;
      const { MongoClient } = require("mongodb");

      const Panel_information = await panel_model.find().select("db_url");

      var ErrorArray = [];

      // Your update query
      const updateQuery = { $set: query };

      // Function to update documents in a given database
      async function updateDocuments(url) {
        const client = new MongoClient(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        try {
          await client.connect();
          const database = client.db();
          const result = await database
            .collection(collection_name)
            .updateMany({}, updateQuery);
        } finally {
          await client.close();
        }
      }

      // Loop through each database URL and update documents
      Panel_information.forEach((url) => {
        if (url.db_url != "") {
          updateDocuments(url.db_url).catch((error) =>
            ErrorArray.push(
              `Error updating documents for ${url.db_url}: ${error.message}`
            )
          );
        }
      });

      // CHECK IF PANEL EXIST OR NOT
      if (!Panel_information) {
        return res
          .status(409)
          .send({ status: false, msg: "Panle Not exist Not exists", data: [] });
      }
      return res.send({
        status: true,
        msg: "Get Panel Broker",
        data: Panel_information,
        Error: ErrorArray,
      });
    } catch (error) {}
  }

  async createView(req, res) {
    try {
      const { your_view_name, collection_name, pipeline } = req.body;
      const { MongoClient } = require("mongodb");

      const panelInformation = await panel_model.find().select("db_url");

      const errorArray = [];
      const successResults = [];

      await Promise.all(
        panelInformation.map(async (url) => {
          const view = {
            $unionWith: {
              coll: `${collection_name}_${url.db_url}`,
              pipeline: pipeline,
            },
          };

          const client = new MongoClient(url.db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

          try {
            await client.connect();
            const database = client.db();

            // Create a new collection or view
            const result = await database.command({
              create: your_view_name,
              viewOn: collection_name,
              pipeline: [view], // Ensure pipeline is an array of objects
            });

            // Check if view creation was successful
            if (result.ok === 1) {
              successResults.push({ db_url: url.db_url, status: "success" });
            } else {
              errorArray.push({
                db_url: url.db_url,
                status: "failed",
                error: result,
              });
            }
          } catch (error) {
            errorArray.push({
              db_url: url.db_url,
              status: "failed",
              error: error.message,
            });
          } finally {
            await client.close();
          }
        })
      );

      return res.send({
        status: true,
        msg: "View creation completed",
        successResults: successResults,
        errorResults: errorArray,
      });
    } catch (error) {
      res.status(500).send({ status: false, msg: "Internal Server Error" });
    }
  }

  async AddFaq(req, res) {
    try {
      const { question, answer, answer1, type, image1, image2 } = req.body;

      const AddPanel = new Faq_Data({
        question,
        answer,
        answer1,
        type,
        img1: image1,
        img2: image2,
      });

      const savedData = await AddPanel.save();
      res
        .status(201)
        .json({
          status: true,
          msg: "FAQ successfully added!",
          data: savedData,
        });
    } catch (error) {
      if (error.code === 11000) {
        res
          .status(409)
          .json({ status: false, msg: "Duplicate key error", error });
      } else {
        console.log("Error adding FAQ:", error);
        res.status(500).json({ status: false, msg: "Server error", error });
      }
    }
  }

  async GetAllFaq(req, res) {
    try {
      const faqData = await Faq_Data.find();

      res
        .status(200)
        .json({
          status: true,
          msg: "FAQs retrieved successfully",
          data: faqData,
        });
    } catch (error) {
      console.log("Error retrieving FAQs:", error);
      res.status(500).json({ status: false, msg: "Server error", error });
    }
  }

  async DeleteFaq(req, res) {
    const { faqId } = req.body; // Assuming you get the FAQ ID from request parameters

    try {
      const deletedFaq = await Faq_Data.findByIdAndDelete(faqId);

      if (!deletedFaq) {
        return res.status(404).json({ status: false, msg: "FAQ not found" });
      }

      res
        .status(200)
        .json({
          status: true,
          msg: "FAQ deleted successfully",
          data: deletedFaq,
        });
    } catch (error) {
      console.log("Error deleting FAQ:", error);
      res.status(500).json({ status: false, msg: "Server error", error });
    }
  }

  async UpdateFaq(req, res) {
    const { id, question, answer, answer1, type, image1, image2 } = req.body;

    try {
      const existingFaq = await Faq_Data.findById(new ObjectId(id));

      if (!existingFaq) {
        return res.status(404).json({ status: false, msg: "FAQ not found" });
      }

      if (question) existingFaq.question = question;
      if (answer) existingFaq.answer = answer;
      if (answer1) existingFaq.answer1 = answer1;
      if (type) existingFaq.type = type;
      if (image1) existingFaq.img1 = image1;
      if (image2) existingFaq.img2 = image2;

      const updatedFaq = await existingFaq.save();

      res
        .status(200)
        .json({
          status: true,
          msg: "FAQ updated successfully",
          data: updatedFaq,
        });
    } catch (error) {
      console.log("Error updating FAQ:", error);
      res.status(500).json({ status: false, msg: "Server error", error });
    }
  }
}

module.exports = new Panel();
