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

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");
const { Alice_Socket } = require("../../Helper/Alice_Socket");

class AliceBlue {
  // Get GetAccessToken ALICE BLUE
  async GetAccessToken(req, res) {
    try {
      const authCode = req.query.authCode;
      var userId = req.query.userId;

      var broker_infor = await Broker_information.find({
        broker_name: "Alice Blue",
      });
      var apiSecret = broker_infor[0].apiSecret;

      var hosts = req.headers.host;

      var redirect = hosts.split(":")[0];
      var redirect_uri = "";

      const Get_User = await User.find({ demat_userid: userId });

      if (Get_User.length > 0) {
        if (redirect == "localhost") {
          redirect_uri = "http://localhost:3000";
        } else {
          if (Get_User[0].Role == "ADMIN") {
            redirect_uri = `https://${redirect}/#/admin/tradehistory?type=admin`;
          } else {
            redirect_uri = `https://${redirect}/#/client/dashboard`;
          }
        }

        var Encrypted_data = sha256(userId + authCode + apiSecret);
        var data = { checkSum: Encrypted_data };

        var config = {
          method: "post",
          url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/sso/getUserDetails",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then(async function (response) {
            if (response.data.userSession) {
              if (Get_User[0].Role == "ADMIN") {
                const filter = { broker_name: "ALICE_BLUE" };
                const updateOperation = {
                  $set: {
                    user_id: userId,
                    access_token: response.data.userSession,
                    trading_status: "on",
                    Role: "ADMIN",
                  },
                };

                const result = await live_price.updateOne(
                  filter,
                  updateOperation
                );

                const user_login = new user_logs({
                  user_Id: Get_User[0]._id,
                  trading_status: "Admin Trading On",
                  role: "ADMIN",
                  device: "WEB",
                  system_ip: getIPAddress(),
                });
                await user_login.save();

                Alice_Socket();

                return res.redirect(redirect_uri);
              } else {
                UpdateProfile(userId, response.data.userSession);

                let result = await User.findByIdAndUpdate(Get_User[0]._id, {
                  access_token: response.data.userSession,
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
              }
            } else {
              return res.send(redirect_uri);
            }
          })
          .catch(function (error) {
            return res.send(redirect_uri);
          });
      }
    } catch (error) {
      console.log("Error Alice Login error-", error);
    }
  }

  // GET ORDER ID TO ORDER FULL DATA
  async GetOrderFullInformation(req, res) {
    try {
      const { OrderId, user_id } = req.body;

      if (!OrderId || !user_id) {
        return res.send({
          status: false,
          msg: "Please Fill All Feild",
          data: [],
        });
      }

      const objectId = new ObjectId(user_id);

      var FindUserAccessToken = await User.find({ _id: objectId });
      var FindUserBrokerResponse = await BrokerResponse.find({
        user_id: objectId,
        order_id: OrderId,
      });

      if (FindUserBrokerResponse[0].order_view_status == "0") {
        let data = JSON.stringify({
          nestOrderNumber: OrderId,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory",
          headers: {
            Authorization:
              "Bearer " +
              FindUserAccessToken[0].demat_userid +
              " " +
              FindUserAccessToken[0].access_token,
            "Content-Type": "application/json",
          },
          data: data,
        };
        axios(config)
          .then(async (response) => {
            if (response.data[0]) {
              const message = JSON.stringify(response.data[0]);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: FindUserBrokerResponse[0]._id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: response.data[0].Status,
                },
                { new: true }
              );
              if (result) {
                return res.send({
                  status: true,
                  msg: "SuccessFully Update",
                  data: [],
                });
              }
            }
          })
          .catch(async (error) => {
            if (error.response.data) {
              const message = JSON.stringify(error.response.data);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: FindUserBrokerResponse[0]._id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: "Error",
                },
                { new: true }
              );
              return res.send({ status: false, msg: "Error", data: message });
            } else {
              const message = JSON.stringify(error);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: FindUserBrokerResponse[0]._id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: "Error",
                },
                { new: true }
              );
              return res.send({ status: false, msg: "Error", data: message });
            }
          });
      } else {
        return res.send({
          status: false,
          msg: "Already Update",
          data: FindUserBrokerResponse,
        });
      }
    } catch (error) {
      return res.send({
        status: false,
        msg: "error in Server side",
        data: error,
      });
    }
  }

  async GetLivePrice(req, res) {
    try {
      const Get_live_price = await live_price.find({
        broker_name: "ALICE_BLUE",
      });

      if (Get_live_price.length > 0) {
        return res.send({
          status: true,
          data: Get_live_price,
          msg: "Get Data",
        });
      } else {
        // Data not found, insert the default document
        const defaultDocument = {
          broker_name: "ALICE_BLUE",
          Role: "ADMIN",
          access_token: "",
          trading_status: "off",
          updatedAt: new Date(), // current date and time
          user_id: "",
          broker_id: "2",
          Stock_chain:
            "NFO|45803#NFO|45832#NFO|35773#NFO|35772#NFO|46863#NFO|46864#NFO|35777#NFO|35776#NFO|47636#NFO|47637#NFO|35781#NFO|35780#NFO|47639#NFO|47640#NFO|35784#NFO|35782#NFO|49559#NFO|49560#NFO|35786#NFO|35785#NFO|49568#NFO|49569#NFO|35787#NFO|35788#NFO|49577#NFO|49576#NFO|35795#NFO|35796#NFO|49581#NFO|49580#NFO|35804#NFO|35803#NFO|49582#NFO|49591#NFO|35806#NFO|35805#NFO",
        };

        const new_live_price = new live_price(defaultDocument);
        await new_live_price.save();

        return res.send({
          status: true,
          data: [new_live_price],
          msg: "Default Data Added and Returned",
        });
      }
    } catch (error) {
      return res.send({
        status: false,
        data: error,
        msg: "Error In get live price data",
      });
    }
  }

  // CANCEL ORDER API
  async Cancel_order(req, res) {
    try {
      // var OrderId = "23091800155929"
      const { OrderId, user_id } = req.body;

      if (!OrderId || !user_id) {
        return res.send({
          status: false,
          msg: "Please Fill All Feild",
          data: [],
        });
      }

      const objectId = new ObjectId(user_id);

      var FindUserAccessToken = await User.find({ _id: objectId });
      var FindUserBrokerResponse = await BrokerResponse.find({
        user_id: objectId,
        order_id: OrderId,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api//placeOrder/cancelOrder",
        headers: {
          Authorization:
            "Bearer " +
            FindUserAccessToken[0].demat_userid +
            " " +
            FindUserAccessToken[0].access_token,
          "Content-Type": "application/json",
        },
        data: {
          exch: "NSE",
          nestOrderNumber: OrderId,
          trading_symbol: FindUserBrokerResponse[0].trading_symbol,
        },
      };

      axios(config)
        .then(async (response) => {
          if (response.data) {
            if (response.data.stat == "Ok") {
              GetAllBrokerResponse(user_id, res);
              return res.send({
                status: true,
                msg: "Order Cancel Successfully",
                data: response.data,
              });
            } else {
              return res.send({
                status: false,
                msg: "Order Cancel Error",
                data: [],
              });
            }
          } else {
            return res.send({
              status: false,
              msg: "Order Cancel Error",
              data: error,
            });
          }
        })
        .catch(async (error) => {
          return res.send({
            status: false,
            msg: "Order Cancel Error",
            data: error,
          });
        });
    } catch (error) {
      return res.send({
        status: false,
        msg: "error in Server side",
        data: error,
      });
    }
  }

  // UPDATE ALL CLIENT BROKER RESPONSE
  async GetOrderFullInformationAll(req, res) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.send({
          status: false,
          msg: "Please Fill All Feild",
          data: [],
        });
      }

      GetAllBrokerResponse(user_id, res);
    } catch (error) {
      return res.send({
        status: false,
        msg: "error in Server side",
        data: error,
      });
    }
  }

  async backendRunSocket(req, res) {
    // Alice_Socket();
    return res.send({ status: true, msg: "backend run socket" });
  }

  // UPDATE SINGLE CLIENT BROKER RESPONSE
  async SingleOrderFullInformationAlice(
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

      let data = JSON.stringify({
        nestOrderNumber: order_id,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory",
        headers: {
          Authorization:
            "Bearer " +
            user_info[0].demat_userid +
            " " +
            user_info[0].access_token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios(config)
        .then(async (response) => {
          if (response.data[0]) {
            const message = JSON.stringify(response.data[0]);

            let result = await BrokerResponse.findByIdAndUpdate(
              { _id: broker_response_id },
              {
                order_view_date: message,
                order_view_status: "1",
                order_view_response: response.data[0].Status,
                reject_reason: response.data[0].rejectionreason,
              },
              { new: true }
            );

            return res.send({
              status: true,
              msg: "broker response updated successfully",
            });
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

const GetAllBrokerResponse = async (user_id, res) => {
  try {
    const objectId = new ObjectId(user_id);
    var FindUserAccessToken = await User.find({ _id: objectId });
    var FindUserBrokerResponse = await BrokerResponse.find({
      user_id: objectId,
    });
    //
    if (FindUserBrokerResponse.length > 0) {
      FindUserBrokerResponse.forEach((data1) => {
        let data = JSON.stringify({
          nestOrderNumber: data1.order_id,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/orderHistory",
          headers: {
            Authorization:
              "Bearer " +
              FindUserAccessToken[0].demat_userid +
              " " +
              FindUserAccessToken[0].access_token,
            "Content-Type": "application/json",
          },
          data: data,
        };
        axios(config)
          .then(async (response) => {
            if (response.data[0]) {
              const message = JSON.stringify(response.data[0]);

              let result = await BrokerResponse.findByIdAndUpdate(
                { _id: data1._id },
                {
                  order_view_date: message,
                  order_view_status: "1",
                  order_view_response: response.data[0].Status,
                  reject_reason: response.data[0].rejectionreason,
                },
                { new: true }
              );
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

const UpdateProfile = async (userId, token) => {
  if (!userId || !token) {
    console.error("Invalid userId or token provided");
    return;
  }

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/limits/getRmsLimits",
    headers: {
      Authorization: "Bearer " + userId + " " + token,
    },
  };

  try {
    // Make the API request
    const response = await axios(config);



    if (response.data && response.data.length > 0) {
    

      try {
        let data1 = await User.findOne({ demat_userid: userId });

        if (data1) {
          let result = await User.updateOne(
            { _id: data1._id },
            { Profile_fund: response.data[0].net },
            { new: true }
          );

        } else {
          console.error(
            "User not found with the provided demat_userid:",
            userId
          );
        }
      } catch (dbError) {
        console.error("Database error occurred:", dbError.message);
      }
    } else {
      console.error("No valid response data received from API.");
    }
  } catch (apiError) {
    console.error("Error making API request:", apiError.message);
  }
};

module.exports = new AliceBlue();
