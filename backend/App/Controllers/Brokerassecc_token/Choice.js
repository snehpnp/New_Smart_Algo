const sha256 = require("sha256");
var axios = require("axios");
var dateTime = require("node-datetime");

("use strict");
const db = require("../../Models");
const panel_model = db.panel_model;
const User = db.user;
const user_logs = db.user_logs;
const BrokerResponse = db.BrokerResponse;
const Broker_information = db.Broker_information;
const live_price = db.live_price;
const crypto = require("crypto");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");

class Choice {
  // Get GetAccessToken ANGEL
  async GetAccessTokenChoice(req, res) {
    var user_email = req.body.Email;

    try {
      if (user_email != undefined) {
        var hosts = req.headers.host;

        var redirect = hosts.split(":")[0];
        var redirect_uri = "";
        if (redirect == "localhost") {
          redirect_uri = "http://localhost:3000";
        } else {
          redirect_uri = `https://${redirect}/`;
        }

        const Get_User = await User.find({ Email: user_email });

        if (Get_User.length > 0) {
          const algorithm = "aes-256-cbc";
          const EncryptionIV = Get_User[0].app_key;

          const password = Get_User[0].api_secret;
          const EncryptionSecretKey = Get_User[0].app_id;

          const cipher = crypto.createCipheriv(
            algorithm,
            EncryptionSecretKey,
            EncryptionIV
          );

          let encryptedData = cipher.update(password, "utf-8", "base64");
          encryptedData += cipher.final("base64");
          console.log("encryptedData Password -", encryptedData);

          var data = JSON.stringify({
            UserId: Get_User[0].client_code,
            Pwd: encryptedData,
          });

          console.log("USERID- ", Get_User[0].client_code);
          console.log("Pwd- ", encryptedData);

          //check fund Api
          var config = {
            method: "post",
            url: "https://finx.choiceindia.com/api/OpenAPI/Login",
            headers: {
              VendorId: Get_User[0].api_key,
              VendorKey: Get_User[0].demat_userid,
              "Content-Type": "application/json",
            },
            data: data,
          };
          console.log("config", config);

          await axios
            .request(config)
            .then(async (response) => {
              if (response.data.Status == "Success") {
                let result = await User.findByIdAndUpdate(Get_User[0]._id, {
                  access_token: response.data.Response.SessionId,
                  TradingStatus: "on",
                });

                if (result != "") {
                  const user_login = new user_logs({
                    user_Id: Get_User[0]._id,
                    login_status: "Trading On",
                    role: Get_User[0].Role,
                    device: "WEB",
                    system_ip: getIPAddress(),
                  });
                  await user_login.save();
                  if (user_login) {
                    return res.send({
                      status: true,
                      msg: "Trading On SuccessFully",
                    });
                  }
                }
              } else {
                return res.send({
                  status: false,
                  msg: "Please Update correct CLIENT ID in Broker key...",
                });
              }
            })
            .catch((error) => {
              if (error) {
                console.log("error", error.response.data);
                if (error.response.data) {
                  return res.send({
                    status: false,
                    msg: error.response.data,
                  });
                } else {
                  return res.send({
                    status: false,
                    msg: "Please Update correct ACCESS TOKEN in Broker key...",
                  });
                }
              }
            });
        } else {
          return res.send({ status: false, msg: "User not found" });
        }
      } else {
        return res.send({ status: false, msg: "User not found" });
      }
    } catch (error) {
      return res.send({ status: false, msg: "Network error" });
    }
  }
}

module.exports = new Choice();
