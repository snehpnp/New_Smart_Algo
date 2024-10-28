const sha256 = require("sha256");
var axios = require("axios");
const url = require("url");
var dateTime = require("node-datetime");
const qs = require("querystring");

("use strict");
const db = require("../../Models");
const panel_model = db.panel_model;
const User = db.user;
const user_logs = db.user_logs;
const BrokerResponse = db.BrokerResponse;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");

class Upstox {
  // Get GetAccessToken ANGEL
  async GetAccessTokenUpstox(req, res) {
    var tokenCode = req.query.code;
    var user_email = req.query.state;


    try {
      if (tokenCode != undefined) {
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
          var apiKey = Get_User[0].api_key;
          var apiSecret = Get_User[0].api_secret;


          // Define the request data
          const requestData = {
            code: tokenCode,
            client_id: apiKey,
            client_secret: apiSecret,
            redirect_uri: `https://${hosts}/backend/upstox`,
            grant_type: "authorization_code",
          };

          // Define the URL and headers
          const url = "https://api-v2.upstox.com/login/authorization/token";
          const headers = {
            accept: "application/json",
            "Api-Version": "2.0",
            "Content-Type": "application/x-www-form-urlencoded",
          };

          // Make the POST request
          axios
            .post(url, qs.stringify(requestData), { headers })
            .then(async (response) => {
              const accessToken = response.data.access_token;


              if (accessToken !== undefined) {
                let result = await User.findByIdAndUpdate(Get_User[0]._id, {
                  access_token: accessToken,
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
                    return res.redirect(redirect_uri);
                  }
                }
              } else {
                return res.redirect(redirect_uri);
              }
            })
            .catch((error) => {
             
              return res.redirect(redirect_uri);
            });
        } else {
          return res.redirect(redirect_uri);
        }
      } else {
        return res.redirect(redirect_uri);
      }
    } catch (error) {
      console.log("Error Theme error-", error);
    }
  }

  // UPDATE ALL CLIENT BROKER RESPONSE
  async GetOrderFullInformationUpstox(req, res, user_info) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.send({
          status: false,
          msg: "Please Fill All Feild",
          data: [],
        });
      }

      GetAllBrokerResponse(user_info, res);
    } catch (error) {
      return res.send({
        status: false,
        msg: "error in Server side",
        data: error,
      });
    }
  }

  async SingleOrderFullInformationUpstox(
    req,
    res,
    user_info,
    broker_response_id,
    order_id
  ) {
    try {
      const { user_id } = req.body;
      if (!user_id) {
        return res.send({
          status: false,
          msg: "Please Fill All Feild",
          data: [],
        });
      }

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api-v2.upstox.com/order/history?order_id=" + order_id,
        headers: {
          accept: " application/json",
          "Api-Version": " 2.0",
          Authorization: "Bearer " + user_info[0].access_token,
        },
      };

      axios(config)
        .then(async (response) => {
          if (response.data.data.length > 0) {
            const result_order =
              response.data.data[response.data.data.length - 1];

            if (result_order != undefined) {
              const message = JSON.stringify(result_order);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: broker_response_id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: result_order.status,
                  reject_reason: result_order.status_message,
                },
                { new: true }
              );
              return res.send({
                status: true,
                msg: "broker response updated successfully",
              });
            } else {
              const message = JSON.stringify(result_order);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: broker_response_id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                },
                { new: true }
              );
              return res.send({
                status: false,
                msg: "result order undefined",
                data: [],
              });
            }
          } else {
            return res.send({
              status: false,
              msg: "No data Available",
              data: [],
            });
          }
        })
        .catch(async (error) => {
          return res.send({ status: false, msg: "Order Api Err .", data: [] });
        });
    } catch (error) {
      return res.send({
        status: false,
        msg: "error in Server side",
        data: error,
      });
    }
  }
}

const GetAllBrokerResponse = async (user_info, res) => {
  try {
    const objectId = new ObjectId(user_info[0]._id);
    // var FindUserAccessToken = await User.find({ _id: objectId }).limit(1);
    var FindUserBrokerResponse = await BrokerResponse.find({
      user_id: objectId,
      order_view_status: "0",
    });

    if (FindUserBrokerResponse.length > 0) {
      FindUserBrokerResponse.forEach((data1) => {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url:
            "https://api-v2.upstox.com/order/history?order_id=" +
            data1.order_id,
          headers: {
            accept: " application/json",
            "Api-Version": " 2.0",
            Authorization: "Bearer " + user_info[0].access_token,
          },
        };
        axios(config)
          .then(async (response) => {
            const result_order =
              response.data.data[response.data.data.length - 1];

            if (result_order != undefined) {
              const message = JSON.stringify(result_order);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: data1._id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: result_order.status,
                  reject_reason: result_order.status_message,
                },
                { new: true }
              );
            } else {
              const message = JSON.stringify(result_order);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: data1._id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                },
                { new: true }
              );
            }
          })
          .catch(async (error) => {});
      });
      return res.send({
        status: true,
        msg: "broker response updated successfully",
      });
    } else {
      return res.send({ status: false, msg: "no user found" });
    }
  } catch (error) {
    console.log("Error in broker response in order Id".error);
  }
};

module.exports = new Upstox();
