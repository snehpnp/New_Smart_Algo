var axios = require("axios");
var qs = require("qs");
var path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const db = require("../../BACKEND/App/Models");
const services = db.services;
const Alice_token = db.Alice_token;
const Signals = db.Signals;
const MainSignals = db.MainSignals;
const AliceViewModel = db.AliceViewModel;
const BrokerResponse = db.BrokerResponse;
var dateTime = require("node-datetime");

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
    var price = signals.Price;
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
        const pattern = token[0].instrument_token;

        var filePath_token = "";
        var tsym;

        if (segment && segment.toUpperCase() === "C") {
          filePath_token = "/shoonya/NSE_symbols.txt";
        } else if (
          segment &&
          (segment.toUpperCase() === "F" ||
            segment.toUpperCase() === "O" ||
            segment.toUpperCase() === "FO")
        ) {
          filePath_token = "/shoonya/NFO_symbols.txt";
        } else if (
          segment &&
          (segment.toUpperCase() === "CF" || segment.toUpperCase() === "CO")
        ) {
          filePath_token = "/shoonya/CDS_symbols.txt";
        } else if (
          segment &&
          (segment.toUpperCase() === "MF" || segment.toUpperCase() === "MO")
        ) {
          filePath_token = "/shoonya/MCX_symbols.txt";
        } else {
          console.log("Invalid segment value");
          return;
        }

        const filePath_shoonya = path.join(
          __dirname,
          "..",
          "AllInstrumentToken",
          filePath_token
        );

        //    const command = `grep ,${pattern}, ${filePath_shoonya}`;
        //    const command = `grep -E ".*,(${pattern}),.*.*(${input_symbol}).*" ${filePath_shoonya}`;
        const command = `findstr ${pattern} ${filePath_shoonya}`;


        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.log(`exec error: ${error}`);
            // return;
          }


          if (stdout) {
            const parts = stdout.split(","); // Extract the content inside double quotes

            if (parts) {
             
              if (segment && segment.toUpperCase() === "C") {
                tsym = parts[4];
              } else if (
                segment &&
                (segment.toUpperCase() === "F" ||
                  segment.toUpperCase() === "O" ||
                  segment.toUpperCase() === "FO")
              ) {
                tsym = parts[4];
              } else if (
                segment &&
                (segment.toUpperCase() === "CF" ||
                  segment.toUpperCase() === "CO")
              ) {
                tsym = parts[6];
              } else if (
                segment &&
                (segment.toUpperCase() === "MF" ||
                  segment.toUpperCase() === "MO")
              ) {
                tsym = parts[5];
              } else {
                console.log("Invalid segment value");

                const requestPromises = AllClientData.map(async (item) => {
                  BrokerResponse.create({
                    user_id: item._id,
                    receive_signal: signal_req,
                    strategy: strategy,
                    type: type,
                    symbol: input_symbol,
                    order_status: 0,
                    order_id: "",
                    trading_symbol: "",
                    broker_name: "SHOONYA",
                    send_request: "",
                    reject_reason: "Invalid segment value",
                  })
                    .then((BrokerResponseCreate) => {})
                    .catch((err) => {
                      try {
                        console.log("Error creating and saving user:", err);
                      } catch (e) {
                        ;
                      }
                    });
                });
                // Send all requests concurrently using Promise.all
                Promise.all(requestPromises)
                  .then((responses) => {
            
                  })
                  .catch((errors) => {
                    console.log("errors:", errors);
                  });

                return;
              }
              const requestPromises = AllClientData.map(async (item) => {
                item.postdata.tsym = tsym;
                // item.postdata.tsym = "BANKNIFTY24APR24P47500";

                if (type == "LE" || type == "SX") {
                  item.postdata.trantype = "B";
                } else if (type == "SE" || type == "LX") {
                  item.postdata.trantype = "S";
                }

                if (
                  item.client_services.order_type == "2" ||
                  item.client_services.order_type == "3"
                ) {
                  item.postdata.Prc = price;
                }

                EntryPlaceOrder(item, filePath, signals, signal_req);
              });
              // Send all requests concurrently using Promise.all
              Promise.all(requestPromises)
                .then((responses) => {
                
                })
                .catch((errors) => {
                  console.log("errors:", errors);
                });
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
                  broker_name: "SHOONYA",
                  send_request: "",
                  reject_reason: "NOT FOUND LIST",
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {
                      ;
                    }
                  });
              });
              // Send all requests concurrently using Promise.all
              Promise.all(requestPromises)
                .then((responses) => {
           
                })
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
                broker_name: "SHOONYA",
                send_request: "",
                reject_reason: "Token not Found",
              })
                .then((BrokerResponseCreate) => {})
                .catch((err) => {
                  try {
                    console.log("Error creating and saving user:", err);
                  } catch (e) {
                    ;
                  }
                });
            });
            // Send all requests concurrently using Promise.all
            Promise.all(requestPromises)
              .then((responses) => {
            
              })
              .catch((errors) => {
           
              });
          }
        });
      } else if (type == "SX" || type == "LX") {
       

        const requestPromises = AllClientData.map(async (item) => {
          if (type == "LE" || type == "SX") {
            item.postdata.trantype = "B";
          } else if (type == "SE" || type == "LX") {
            item.postdata.trantype = "S";
          }

          if (
            item.client_services.order_type == "2" ||
            item.client_services.order_type == "3"
          ) {
            item.postdata.Prc = price;
          }
          var send_rr = Buffer.from(qs.stringify(item.postdata)).toString(
            "base64"
          );



          let data = JSON.stringify(item.postdata);

          let payload = "jData=" + data;
          payload = payload + `&jKey=${item.access_token}`;
          var send_rr = Buffer.from(data).toString("base64");


        
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://api.shoonya.com/NorenWClientTP/PositionBook",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: payload,
          };
          axios(config)
            .then(async (response) => {


                if (response.data.length > 0) {
                fs.appendFile(
                  filePath,
                  "TIME " +
                    new Date() +
                    " SHOONYA POSITION DATA - " +
                    item.UserName +
                    " LENGTH = " +
                    JSON.stringify(response.data.length) +
                    "\n",
                  function (err) {
                    if (err) {
                    }
                  }
                );
                const Exist_entry_order = response.data.find(item1 => item1.token === token[0].instrument_token);
             
                 console.log("Exist_entry_order",Exist_entry_order)

                if (Exist_entry_order != undefined ||      Exist_entry_order.stat == "Ok") {
                  item.postdata.tsym = Exist_entry_order.tsym;
                  const possition_qty =Exist_entry_order.netqty

                  if (possition_qty == 0) {
                    BrokerResponse.create({
                      user_id: item._id,
                      receive_signal: signal_req,
                      strategy: strategy,
                      type: type,
                      symbol: input_symbol,
                      order_status: "Entry Not Exist",
                      reject_reason: "This Script position Empty ",
                      broker_name: "SHOONYA",
                      send_request: send_rr,
                      open_possition_qty: possition_qty,
                    })
                      .then((BrokerResponseCreate) => {})
                      .catch((err) => {
                        try {
                          console.log("Error creating and saving user:", err);
                        } catch (e) {
                          ;
                        }
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
                    broker_name: "SHOONYA",
                    send_request: send_rr,
                    reject_reason: "position Not Exist",
                  })
                    .then((BrokerResponseCreate) => {})
                    .catch((err) => {
                      try {
                        console.log("Error creating and saving user:", err);
                      } catch (e) {
                        ;
                      }
                    });
                }
              } else {
                const message = JSON.stringify(response.data).replace(
                  /["',]/g,
                  ""
                );

                BrokerResponse.create({
                  user_id: item._id,
                  receive_signal: signal_req,
                  strategy: strategy,
                  type: type,
                  symbol: input_symbol,
                  order_status: "Entry Not Exist",
                  order_id: "",
                  trading_symbol: "",
                  broker_name: "SHOONYA",
                  send_request: send_rr,
                  reject_reason: message,
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {
                      ;
                    }
                  });
              }
            })
            .catch(async (error) => {
              fs.appendFile(
                filePath,
                "TIME " +
                  new Date() +
                  " SHOONYA POSITION DATA ERROR CATCH - " +
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
                const message = JSON.stringify(error.response).replace(
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
                  broker_name: "SHOONYA",
                  send_request: send_rr,
                  reject_reason: message,
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {
                      ;
                    }
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
                  broker_name: "SHOONYA",
                  send_request: send_rr,
                  reject_reason: message,
                })
                  .then((BrokerResponseCreate) => {})
                  .catch((err) => {
                    try {
                      console.log("Error creating and saving user:", err);
                    } catch (e) {
                      ;
                    }
                  });
              }
            });
        });
        // Send all requests concurrently using Promise.all
        Promise.all(requestPromises)
          .then((responses) => {
        
          })
          .catch((errors) => {
      
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
          broker_name: "SHOONYA",
          send_request: "",
          reject_reason: "Token not received due to wrong trade",
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {
              ;
            }
          });
      });
      // Send all requests concurrently using Promise.all
      Promise.all(requestPromises)
        .then((responses) => {
  
        })
        .catch((errors) => {
       
        });
    }
  } catch (error) {

  }
};

const EntryPlaceOrder = async (item, filePath, signals, signal_req) => {
  var dt = signals.DTime;
  var input_symbol = signals.Symbol;
  var type = signals.TType.toUpperCase();
  var tr_price = signals.Tr_Price;
  var price = signals.Price;
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
      " SHOONYA BEFORE PLACE ORDER USER ENTRY- " +
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


  let data = JSON.stringify(item.postdata);

  let payload = "jData=" + data;
  payload = payload + `&jKey=${item.access_token}`;
  var send_rr = Buffer.from(data).toString("base64");

  axios
    .post("https://api.shoonya.com/NorenWClientTP/PlaceOrder", payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    .then(async (response) => {

      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " SHOONYA AFTER PLACE ORDER USER ENTRY - " +
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

      if (response.data.stat == "Ok") {
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: response.data.stat,
          order_id: response.data.norenordno,
          trading_symbol: "",
          broker_name: "SHOONYA",
          send_request: send_rr,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {
              ;
            }
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
          broker_name: "SHOONYA",
          send_request: send_rr,
          reject_reason: message,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {
              ;
            }
          });
      }
    })
    .catch(async (error) => {
      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " SHOONYA AFTER PLACE ORDER CATCH ENTRY - " +
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
              broker_name: "SHOONYA",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {
                  ;
                }
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
              broker_name: "SHOONYA",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {
                  ;
                }
              });
          }
        }
      } catch (e) {
     
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
  var price = signals.Price;
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
      " SHOONYA BEFORE PLACE ORDER USER EXIT- " +
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

  let data = JSON.stringify(item.postdata);

  let payload = "jData=" + data;
  payload = payload + `&jKey=${item.access_token}`;

  var config = {
    method: "post",
    maxBodyLength: Infinity,

    url: "https://api.shoonya.com/NorenWClientTP/PlaceOrder",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: payload,
  };

  axios(config)
    .then(async (response) => {


      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " SHOONYA AFTER PLACE ORDER USER EXIT- " +
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

      if (response.data.stat == "Ok") {
        BrokerResponse.create({
          user_id: item._id,
          receive_signal: signal_req,
          strategy: strategy,
          type: type,
          symbol: input_symbol,
          order_status: response.data.stat,
          order_id: response.data.norenordno,
          trading_symbol: "",
          broker_name: "SHOONYA",
          send_request: send_rr,
          open_possition_qty: possition_qty,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {
              ;
            }
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
          broker_name: "SHOONYA",
          send_request: send_rr,
          reject_reason: message,
        })
          .then((BrokerResponseCreate) => {})
          .catch((err) => {
            try {
              console.log("Error creating and saving user:", err);
            } catch (e) {
              ;
            }
          });
      }
    })
    .catch(async (error) => {
      fs.appendFile(
        filePath,
        "TIME " +
          new Date() +
          " SHHONYA AFTER PLACE ORDER USER EXIT CATCH- " +
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
              broker_name: "SHOONYA",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {
                  ;
                }
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
              broker_name: "SHOONYA",
              send_request: send_rr,
              reject_reason: message,
            })
              .then((BrokerResponseCreate) => {})
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {
                  ;
                }
              });
          }
        }
      } catch (e) {
        console.log("error 1", e);
      }
    });
};

module.exports = { place_order };
