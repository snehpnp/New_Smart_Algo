var axios = require("axios");
var qs = require("qs");
const fs = require("fs");
const db = require("../../BACKEND/App/Models");

const BrokerResponse = db.BrokerResponse;

const place_order = async (
  AllClientData,
  signals,
  token,
  filePath,
  signal_req
) => {
  try {
    var dt = signals.DTime;
    var input_symbol = signals.Symbol;
    var type = signals.TType.toUpperCase();
    var tr_price = signals.Tr_Price;
    var limitPrice = signals.Price;
    var sq_value = signals.Sq_Value;
    var sl_value = signals.Sl_Value;
    var tsl = signals.TSL;
    var segment = signals.Segment.toUpperCase();
    var segment1 = signals.Segment.toUpperCase();
    var strike = signals.Strike;
    var option_type = signals.OType;
    var expiry = signals.Expiry;
    var strategy = signals.Strategy;
    var qty_percent = signals.Quntity;
    var client_key = signals.Key;
    var demo = signals.Demo;

    if (token != 0) {
      if (type == "LE" || type == "SE") {
        if (segment.toUpperCase() != "C") {
          const requestPromises = AllClientData.map(async (item) => {
            item.postdata.Token = token[0].instrument_token;

            if (type == "LE" || type == "SX") {
              item.postdata.BS = 1;
            } else if (type == "SE" || type == "LX") {
              item.postdata.BS = 2;
            }

            EntryPlaceOrder(item, filePath, signals, signal_req);
          });

          // Send all requests concurrently using Promise.all
          Promise.all(requestPromises)
            .then((responses) => {})
            .catch((errors) => {
              console.log("errors:", errors);
            });
        } else {
          const requestPromises = AllClientData.map(async (item) => {
            item.postdata.Token = token[0].instrument_token;

            if (type == "LE" || type == "SX") {
              item.postdata.BS = 1;
            } else if (type == "SE" || type == "LX") {
              item.postdata.BS = 2;
            }

            EntryPlaceOrder(item, filePath, signals, signal_req);
          });

          Promise.all(requestPromises)
            .then((responses) => {})
            .catch((errors) => {
              console.log("errors:", errors);
            });
        }
      } else if (type == "SX" || type == "LX") {
        const requestPromises = AllClientData.map(async (item) => {
          if (segment.toUpperCase() != "C") {
            item.postdata.Token = token[0].instrument_token;
          }

          if (type == "LE" || type == "SX") {
            item.postdata.BS = 1;
          } else if (type == "SE" || type == "LX") {
            item.postdata.BS = 2;
          }

          var send_rr = Buffer.from(qs.stringify(item.postdata)).toString(
            "base64"
          );

          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "https://finx.choiceindia.com/api/OpenAPI/NetPosition",

            headers: {
              VendorId: item.api_key,
              VendorKey: item.demat_userid,
              Authorization: "Bearer " + item.access_token,
              "Content-Type": "application/json",
            },
          };
          axios(config)
            .then(async (response) => {
              if (response.data?.Response?.NetPositions.length > 0) {
                fs.appendFile(
                  filePath,
                  "TIME " +
                    new Date() +
                    " Choice POSITION DATA - " +
                    item.UserName +
                    " LENGTH = " +
                    JSON.stringify(
                      response.data?.Response?.NetPositions.length
                    ) +
                    "\n",
                  function (err) {
                    if (err) {
                    }
                  }
                );

                const Exist_entry_order =
                  response.data?.Response?.NetPositions.find(
                    (item1) => item1.Token == token[0].instrument_token
                  );

                if (Exist_entry_order != undefined) {
                  const possition_qty =
                    Exist_entry_order.BuyQty - Exist_entry_order.SellQty;

                  if (possition_qty == 0) {
                    BrokerResponse.create({
                      user_id: item._id,
                      receive_signal: signal_req,
                      strategy: strategy,
                      type: type,
                      symbol: input_symbol,
                      order_status: "Entry Not Exist",
                      reject_reason: "This Script position Empty ",
                      broker_name: "Choice",
                      send_request: send_rr,
                      open_possition_qty: possition_qty,
                    })
                      .then((BrokerResponseCreate) => {})
                      .catch((err) => {
                        try {
                          console.log("Error creating and saving user:", err);
                        } catch (e) {}
                      });
                  } else {
                    if (possition_qty > 0 && type == "LX") {
                      ExitPlaceOrder(
                        item,
                        filePath,
                        possition_qty,
                        signals,
                        signal_req
                      );
                    } else if (possition_qty < 0 && type == "SX") {
                      ExitPlaceOrder(
                        item,
                        filePath,
                        possition_qty,
                        signals,
                        signal_req
                      );
                    }
                  }
                } else {
                  BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: "Entry Not Exist",
                    order_id: "",
                    trading_symbol: "",
                    broker_name: "Choice",
                    send_request: send_rr,
                    reject_reason: "position Not Exist",
                  })
                    .then((BrokerResponseCreate) => {})
                    .catch((err) => {
                      try {
                        console.log("Error creating and saving user:", err);
                      } catch (e) {}
                    });
                }
              } else {
                BrokerResponse.create({
                  user_id: item._id,
                  receive_signal: signal_req,
                  strategy: strategy,
                  type: type,
                  symbol: input_symbol,
                  order_status: "Entry Not Exist",
                  order_id: "",
                  trading_symbol: "",
                  broker_name: "Choice",
                  send_request: send_rr,
                  reject_reason: "All position Empty",
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {}
                  });
              }
            })
            .catch(async (error) => {
              fs.appendFile(
                filePath,
                "TIME " +
                  new Date() +
                  " Choice POSITION DATA ERROR CATCH - " +
                  item.UserName +
                  " ERROR - " +
                  JSON.stringify(error) +
                  "\n",
                function (err) {
                  if (err) {
                    return console.log(err);
                  }
                }
              );

              if (error) {
                const message = JSON.stringify(error.response.data).replace(
                  /["',]/g,
                  ""
                );
                BrokerResponse.create({
                  user_id: item._id,
                  receive_signal: signal_req,
                  strategy: strategy,
                  type: type,
                  symbol: input_symbol,
                  order_status: "position request error",
                  order_id: "",
                  trading_symbol: "",
                  broker_name: "Choice",
                  send_request: send_rr,
                  reject_reason: message,
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {}
                  });
              } else {
                const message = JSON.stringify(error).replace(/["',]/g, "");

                BrokerResponse.create({
                  user_id: item._id,
                  receive_signal: signal_req,
                  strategy: strategy,
                  type: type,
                  symbol: input_symbol,
                  order_status: "position request error",
                  order_id: "",
                  trading_symbol: "",
                  broker_name: "Choice",
                  send_request: send_rr,
                  reject_reason: message,
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {}
                  });
              }
            });
        });
        // Send all requests concurrently using Promise.all
        Promise.all(requestPromises)
          .then((responses) => {})
          .catch((errors) => {
            console.log("errors:", errors);
          });
      }
    } else {
      const requestPromises = AllClientData.map(async (item) => {
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: "",
          order_id: "",
          trading_symbol: "",
          broker_name: "Choice",
          send_request: "",
          reject_reason: "Token not received due to wrong trade",
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {}
          });
      });
      // Send all requests concurrently using Promise.all
      Promise.all(requestPromises)
        .then((responses) => {})
        .catch((errors) => {
          console.log("errors:", errors);
        });
    }
  } catch (error) {
    console.log("error", error);
  }
};

const EntryPlaceOrder = async (item, filePath, signals, signal_req) => {
  var dt = signals.DTime;
  var input_symbol = signals.Symbol;
  var type = signals.TType.toUpperCase();
  var tr_price = signals.Tr_Price;
  var limitPrice = signals.Price;
  var sq_value = signals.Sq_Value;
  var sl_value = signals.Sl_Value;
  var tsl = signals.TSL;
  var segment = signals.Segment.toUpperCase();
  var segment1 = signals.Segment.toUpperCase();
  var strike = signals.Strike;
  var option_type = signals.OType;
  var expiry = signals.Expiry;
  var strategy = signals.Strategy;
  var qty_percent = signals.Quntity;
  var client_key = signals.Key;
  var demo = signals.Demo;

  var send_rr = Buffer.from(qs.stringify(item.postdata)).toString("base64");

  fs.appendFile(
    filePath,
    "TIME " +
      new Date() +
      " Choice BEFORE PLACE ORDER USER ENTRY- " +
      item.UserName +
      " REQUEST -" +
      JSON.stringify(item.postdata) +
      "\n",
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://finx.choiceindia.com/api/OpenAPI/NewOrder",

    headers: {
      VendorId: item.api_key,
      VendorKey: item.demat_userid,
      Authorization: "Bearer " + item.access_token,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(item.postdata),
  };
  axios(config)
    .then(async (response) => {
      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " Choice AFTER PLACE ORDER USER ENTRY - " +
          item.UserName +
          " RESPONSE -" +
          JSON.stringify(response.data) +
          "\n",
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );
      console.log("response.data", response.data);
      if (response.data.Status == "Success") {
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: response.data.Status,
          order_id: response.data.Response,
          trading_symbol: "",
          broker_name: "Choice",
          send_request: send_rr,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {}
          });
      }
      if (response.data.Status == "Fail") {
        const message = JSON.stringify(response.data).replace(/["',]/g, "");
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status:response.data.Status,
          order_id: "",
          trading_symbol: "",
          broker_name: "Choice",
          send_request: send_rr,
          reject_reason: message,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {}
          });
      } else {
        const message = JSON.stringify(response.data).replace(/["',]/g, "");
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: 0,
          order_id: "",
          trading_symbol: "",
          broker_name: "Choice",
          send_request: send_rr,
          reject_reason: message,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {}
          });
      }
    })
    .catch(async (error) => {
      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " Choice AFTER PLACE ORDER CATCH ENTRY - " +
          item.UserName +
          " ERROR -" +
          JSON.stringify(error) +
          "\n",
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );

      try {
        if (error) {
          if (error.response) {
            const message = JSON.stringify(error.response.data).replace(
              /["',]/g,
              ""
            );

            BrokerResponse.create({
              user_id: item._id,
              receive_signal: signal_req,
              strategy: strategy,
              type: type,
              symbol: input_symbol,
              order_status: "Error",
              trading_symbol: "",
              broker_name: "Choice",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {}
              });
          } else {
            const message = JSON.stringify(error).replace(/["',]/g, "");

            BrokerResponse.create({
              user_id: item._id,
              receive_signal: signal_req,
              strategy: strategy,
              type: type,
              symbol: input_symbol,
              order_status: "Error",
              trading_symbol: "",
              broker_name: "Choice",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {}
              });
          }
        }
      } catch (e) {
        console.log("error 1", e);
      }
    });
};

const ExitPlaceOrder = async (
  item,
  filePath,
  possition_qty,
  signals,
  signal_req
) => {
  var dt = signals.DTime;
  var input_symbol = signals.Symbol;
  var type = signals.TType.toUpperCase();
  var tr_price = signals.Tr_Price;
  var limitPrice = signals.Price;
  var sq_value = signals.Sq_Value;
  var sl_value = signals.Sl_Value;
  var tsl = signals.TSL;
  var segment = signals.Segment.toUpperCase();
  var segment1 = signals.Segment.toUpperCase();
  var strike = signals.Strike;
  var option_type = signals.OType;
  var expiry = signals.Expiry;
  var strategy = signals.Strategy;
  var qty_percent = signals.Quntity;
  var client_key = signals.Key;
  var demo = signals.Demo;

  var send_rr = Buffer.from(qs.stringify(item.postdata)).toString("base64");

  fs.appendFile(
    filePath,
    "TIME " +
      new Date() +
      " Choice BEFORE PLACE ORDER USER EXIT- " +
      item.UserName +
      " REQUEST -" +
      JSON.stringify(item.postdata) +
      "\n",
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://finx.choiceindia.com/api/OpenAPI/NewOrder",

    headers: {
      VendorId: item.api_key,
      VendorKey: item.demat_userid,
      Authorization: "Bearer " + item.access_token,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(item.postdata),
  };

  axios(config)
    .then(async (response) => {
      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " Choice AFTER PLACE ORDER USER EXIT- " +
          item.UserName +
          " RESPONSE -" +
          JSON.stringify(response.data) +
          "\n",
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );

      if (response.data.Status == "Success") {
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: response.data.Status,
          order_id: response.data.Response,
          trading_symbol: "",
          broker_name: "Choice",
          send_request: send_rr,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {}
          });
      } else {
        const message = JSON.stringify(response.data).replace(/["',]/g, "");
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: 0,
          order_id: "",
          trading_symbol: "",
          broker_name: "Choice",
          send_request: send_rr,
          reject_reason: message,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {}
          });
      }
    })
    .catch(async (error) => {
      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " Choice AFTER PLACE ORDER USER EXIT CATCH- " +
          item.UserName +
          " RESPONSE -" +
          JSON.stringify(error) +
          "\n",
        function (err) {
          if (err) {
            return console.log(err);
          }
        }
      );

      try {
        if (error) {
          if (error.response) {
            const message = JSON.stringify(error.response.data).replace(
              /["',]/g,
              ""
            );

            BrokerResponse.create({
              user_id: item._id,
              receive_signal: signal_req,
              strategy: strategy,
              type: type,
              symbol: input_symbol,
              order_status: "Error",
              trading_symbol: "",
              broker_name: "Choice",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {}
              });
          } else {
            const message = JSON.stringify(error).replace(/["',]/g, "");

            BrokerResponse.create({
              user_id: item._id,
              receive_signal: signal_req,
              strategy: strategy,
              type: type,
              symbol: input_symbol,
              order_status: "Error",
              trading_symbol: "",
              broker_name: "Choice",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {}
              });
          }
        }
      } catch (e) {
        console.log("error 1", e);
      }
    });
};

module.exports = { place_order };
