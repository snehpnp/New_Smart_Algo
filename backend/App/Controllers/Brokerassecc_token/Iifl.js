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
const Broker_information = db.Broker_information;
const live_price = db.live_price;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");
// const { formattedDateTime } = require('../../Helper/time.helper')

class Iifl {
  // Get GetAccessToken ANGEL
  async GetAccessTokenIifl(req, res) {
    var user_email = req.body.Email;

    try {
      if (user_email != undefined) {
        const Get_User = await User.find({ Email: user_email });

        if (Get_User.length > 0) {
          var user_id = Get_User[0].id;

          const appkey = Get_User[0].api_key;
          const secretkey = Get_User[0].api_secret;

          var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://ttblaze.iifl.com:4000/HostLookUp",
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              accesspassword: "2021HostLookUpAccess",
              version: "interactive_1.0.1",
            },
          };

          await axios(config)
            .then(async (response) => {

              if (response.data.result != undefined) {
                var accesspassword = response.data.result.uniqueKey;
                var connectionString = response.data.result.connectionString;

                var config1 = {
                  method: "post",
                  maxBodyLength: Infinity,
                  url: connectionString + "/user/session",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: {
                    secretKey: secretkey,
                    appKey: appkey,
                    uniqueKey: accesspassword,
                    source: "WebAPI",
                  },
                };

                axios(config1)
                  .then(async (response1) => {
                    if (response1.data.type == "success") {
                      let AccessToken = response1.data.result.token;
                      let result = await User.findByIdAndUpdate(
                        Get_User[0]._id,
                        {
                          access_token: AccessToken,
                          TradingStatus: "on",
                          api_type: connectionString,
                        }
                      );

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
                    }
                  })
                  .catch((error) => {
                    if (error) {
                      if (error.response.data != undefined) {
                        return res.send({
                          status: false,
                          msg: error.response.data,
                        });
                      }
                    } else {
                      const message = JSON.stringify(error).replace(
                        /["',]/g,
                        ""
                      );
                      return res.send({ status: false, msg: message });
                    }
                  });
              } else {
                return res.send({ status: false, msg: "Please Try Again" });
              }
            })
            .catch((error) => {
              if (error) {
                if (error.response.data != undefined) {
                  return res.send({ status: false, msg: error.response.data });
                }
              } else {
                const message = JSON.stringify(error).replace(/["',]/g, "");
                return res.send({ status: false, msg: message });
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





  // UPDATE ALL CLIENT BROKER RESPONSE
  async GetOrderFullInformationIifl(req, res, user_info) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.send({
          status: false,
          msg: "Please Fill All Feild",
          data: [],
        });
      }

      await GetAllBrokerResponse(user_info, res);
    } catch (error) {
      return res.send({
        status: false,
        msg: "error in Server side",
        data: error,
      });
    }
  }

  async SingleOrderFullInformationIIfl(
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

      var config = {
        method: "get",
        maxBodyLength: Infinity,
        url: user_info[0].api_type + "/orders",

        headers: {
          authorization: user_info[0].access_token,
          "Content-Type": "application/json",
        },
      };
      axios(config)
        .then(async (response) => {
          if (response.data.type == "success") {
            const result_order = response.data.result.find(
              (item2) => item2.AppOrderID == order_id
            );

            if (result_order != undefined) {
              const message = JSON.stringify(result_order);
              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: broker_response_id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: result_order.OrderStatus,
                  reject_reason: result_order.CancelRejectReason,
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
              msg: "Order Api Err .",
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
      order_status: "success",
    });

    if (FindUserBrokerResponse.length > 0) {
      FindUserBrokerResponse.forEach((data1) => {
        var config = {
          method: "get",
          maxBodyLength: Infinity,
          url: user_info[0].api_type + "/orders",

          headers: {
            authorization: user_info[0].access_token,
            "Content-Type": "application/json",
          },
        };
        axios(config)
          .then(async (response) => {
            if (response.data.type == "success") {
              const result_order = response.data.result.find(
                (item2) => item2.AppOrderID == data1.order_id
              );

              if (result_order != undefined) {
                const message = JSON.stringify(result_order);
                let result = await BrokerResponse.findByIdAndUpdate(
                  { _id: data1._id },
                  {
                    order_view_date: message,
                    order_view_status: "1",
                    order_view_response: result_order.OrderStatus,
                    reject_reason: result_order.CancelRejectReason,
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
            } else {
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

module.exports = new Iifl();
