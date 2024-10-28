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

class Shoonya {
  async GetAccessTokenShoonya(req, res) {
    const user_email = req.body.Email;
    const totp = req.body.totp;

    try {
      if (!user_email) {
        return res.send({ status: false, msg: "Email is required" });
      }

      const Get_User = await User.find({ Email: user_email });

      if (Get_User.length === 0) {
        return res.send({ status: false, msg: "User not found" });
      }

      const user = Get_User[0];

      const params = {
        userid: user.demat_userid,
        password: user.app_id,
        twoFA: user.app_key,
        vendor_code: user.client_code,
        api_secret: user.api_secret,
        imei: user.api_secret,
      };

      const pwd = sha256(params.password).toString();
      const u_app_key = `${params.userid}|${user.api_key}`;
      const app_key = sha256(u_app_key).toString();

      const authparams = {
        source: "API",
        apkversion: "js:1.0.0",
        uid: params.userid,
        pwd: pwd,
        factor2: params.twoFA,
        vc: params.vendor_code,
        appkey: app_key,
        imei: params.imei,
      };

      const payload = "jData=" + JSON.stringify(authparams);

      const response = await axios.post(
        "https://api.shoonya.com/NorenWClientTP/QuickAuth",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const responseData = response.data;

      if (responseData.stat === "Ok") {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: user._id },
          {
            access_token: responseData.susertoken,
            TradingStatus: "on",
          },
          { new: true }
        );

        const user_logsData = new user_logs({
          user_Id: user._id,
          trading_status: "Trading On",
          role: "USER",
          device: "WEB",
          system_ip: getIPAddress(),
        });

        await user_logsData.save();

        return res.send({
          status: true,
          data: updatedUser,
          msg: "Trading On Successfully",
        });
      } else {
        const user_logs1 = new user_logs({
          user_Id: user._id,
          trading_status: responseData.emsg,
          role: "USER",
          device: "WEB",
          system_ip: getIPAddress(),
        });

        await user_logs1.save();

        return res.send({
          status: false,
          data: [],
          msg: "Trading On Try Feild " + responseData.emsg,
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.response) {
        return res.send({
          status: false,
          data: error.response.data || error.response,
          msg: "API Error occurred",
        });
      }

      return res.send({
        status: false,
        data: error,
        msg: "Network error",
      });
    }
  }

  // UPDATE ALL CLIENT BROKER RESPONSE
  async GetOrderFullInformationShoonya(req, res, user_info) {
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

  async SingleOrderFullInformationShoonya(
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

      const jKey = user_info[0].access_token;

      const postData = {
        uid: user_info[0].demat_userid,
        actid: user_info[0].demat_userid,
        norenordno: req.body.order_id,
        exch: "NFO",
      };

      let data = JSON.stringify(postData);

      let payload = "jData=" + data;
      payload = payload + `&jKey=${jKey}`;

      var config = {
        method: "post",
        maxBodyLength: Infinity,

        // url: "https://api.shoonya.com/NorenWClientTP/SingleOrdStatus",
        url: "https://api.shoonya.com/NorenWClientTP/OrderBook",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: payload,
      };

      axios(config)
        .then(async (response) => {
          if (response.data.length > 0) {
            const FindTrade = response.data.find(
              (item) => item.norenordno == order_id
            );

            const message = JSON.stringify(FindTrade);

            let result = await BrokerResponse.findByIdAndUpdate(
              { _id: broker_response_id },
              {
                order_view_date: message,
                order_view_status: "1",
                order_view_response: FindTrade.status,
                reject_reason: FindTrade.rejreason,
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

          if (error.response.data.stat == "NotOk") {
            return res.send({
              status: false,
              msg: error.response.data.emsg,
              data: [],
            });
          } else {
            return res.send({
              status: false,
              msg: "Order Api Err .",
              data: [],
            });
          }
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
        let data = JSON.stringify({
          Uid: user_info[0].client_code,
        });

        const jKey = user_info[0].access_token;

        const postData = {
          uid: user_info[0].demat_userid,
        };

        const params = new URLSearchParams();
        params.append("jData", JSON.stringify(postData));
        params.append("jKey", jKey);

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.shoonya.com/NorenWClientTP/SingleOrdStatus",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: params.toString(),
        };

        axios(config)
          .then(async (response) => {
        

            // if (response.data.IsError != true) {
            //   const result_order = response.data.Result.Data.find(
            //     (item2) => item2.norenordno == data1.order_id
            //   );
            //   if (result_order != undefined) {
            //     const message = JSON.stringify(result_order);
            //     let result = await BrokerResponse.findByIdAndUpdate(
            //       { _id: data1._id },
            //       {
            //         order_view_date: message,
            //         order_view_status: "1",
            //         order_view_response: result_order.status,
            //         reject_reason: result_order.Rejreason,
            //       },
            //       { new: true }
            //     );
            //   } else {
            //     const message = JSON.stringify(result_order);
            //     let result = await BrokerResponse.findByIdAndUpdate(
            //       { _id: data1._id },
            //       {
            //         order_view_date: message,
            //         order_view_status: "1",
            //       },
            //       { new: true }
            //     );
            //   }
            // } else {
            // }
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

module.exports = new Shoonya();
