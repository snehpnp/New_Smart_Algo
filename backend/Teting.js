module.exports = function (app) {
  const WebSocket = require("ws");
  var CryptoJS = require("crypto-js");

  const db = require("./App/Models");

  const services = db.services;
  const categorie = db.categorie;
  const UserMakeStrategy = db.UserMakeStrategy;
  const Alice_token = db.Alice_token;
  const option_chain_symbols = db.option_chain_symbols;
  const token_chain = db.token_chain;

  const User = db.user;
  const user_logs = db.user_logs;
  const live_price = db.live_price;
  const Get_Option_Chain_modal = db.option_chain_symbols;
  const MainSignals_modal = db.MainSignals;

  const { MongoClient } = require("mongodb");

  //  const uri = "mongodb://localhost:27017/";
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  client.connect();

  const dbTradeTools = client.db(process.env.DB_TRADETOOLS);

  const dbTest = client.db(process.env.DB_NAME);

  // Define MongoDB connection details
  const servers = [
    // "mongodb://pnpinfotech:p%26k56%267GsRy%26vnd%26@193.239.237.136:27017/",
    "mongodb://codingpandit:zsg%26k5sB76%263H%26dk7A%26@185.209.75.31:27017/",
    "mongodb://adonomist:p%26k5H6%267GsRy%26vnd%26@193.239.237.93:27017/",
    "mongodb://adonomist:p%26k5H6%267GsRy%26vnd%26@193.239.237.178:27017/",
    "mongodb://algobullstradingsolutions:p%26ol5Hd%26trad%26i@193.239.237.92:27017/",
    "mongodb://intelfintech:ugh%265rK86%26Fv%26yn37A%26@185.209.75.61:27017/",
    "mongodb://algokuber:p%26k506%267G%26y%26vnd%26@193.239.237.135:27017/",
    "mongodb://finnshri:p0%26k506%267s9Ry%26vn8d@193.239.237.137:27017/",
    "mongodb://visioniq:%26k%23sA8B%267Gmg%26vn3%237A%26@185.209.75.2:27017/",
    "mongodb://believetechnology:%26k%23sA8B%237Gsq%26vg3%237P%26@185.209.75.5:27017/",
    "mongodb://realbottrading:u%26r5nC86%267Gr%26vn37M%26@185.209.75.8:27017/",
    "mongodb://growskyinfotech:u%26j8gB85%267GN%26vn37m%26@185.209.75.9:27017/",
    "mongodb://corebizinfotech:c%26eaV8N%267KfT%26bc49A%26@185.209.75.10:27017/",
    "mongodb://inspirealgo:n%26pdF7G%265Png%26vn97A%26@185.209.75.11:27017/",
    "mongodb://uniquetechnology:c%26z9yB73%267Fn%26vn98V%26@185.209.75.12:27017/",
    "mongodb://yourstechexpert:sA8k%26n86%267Mv%26fh57B%26@185.209.75.14:27017/",
    "mongodb://alphapulsepro:un%26r4hv93%267Gr%26v%2637P%26@185.209.75.15:27017/",
    "mongodb://sumedhainnovations:p%26k5H6%267GsRy%26vnd@185.209.75.21:27017/",
    "mongodb://tradeonn:pw%26k5H6%267GsRy%26vn@185.209.75.23:27017/",
    "mongodb://vintyaitsolutions:byk%265fD328Pvjn3u7A%26@185.209.75.27:27017/",
    "mongodb://growupalgo:p%26k5H6%267GsRy%26vnd@185.209.75.22:27017/",
    "mongodb://robotexfintech:z43rk%265eF32%267Pcmn9i7B%26@185.209.75.28:27017/",
    "mongodb://metaprogramming:zc%26u9tD828Tnbh3u7A%26@185.209.75.29:27017/",
    "mongodb://fincodify:u%26v5%26bAn6%265Gv%26cn29A%26@185.209.75.30:27017/",
    "mongodb://invicontechnology:k56ck%265eF89%267Phjn9i7B%26@185.209.75.62:27017/",
    "mongodb://axcellencetechnology:pw%26k5H6%267GsRy%26vnn@185.209.75.63:27017/",
    "mongodb://sstechnologiess:Apw%26k5RH6%267GsRy%26vnM@185.209.75.64:27017/",
    "mongodb://skwinvestmentadviser:Tapw%26k5R56%267GsRy%26vnTy@185.209.75.65:27017/",
    "mongodb://satviktech:Apw%26k5R6%267GsRy%26vnM@185.209.75.66:27017/",
    "mongodb://thinkaumatictechnology:Aapw%26k5R56%267GsRy%26vnT@185.209.75.67:27017/",
    "mongodb://visionresearchandsolution:Apw%26k5R56%267GsRy%26vn@185.209.75.68:27017/",
    "mongodb://smartwavetechnology:Aapw%26k5R56%267GsRy%26vnTy@185.209.75.69:27017/",
    "mongodb://codinghornet:Tapw%26k5R56%267GsRy%26vn@185.209.75.70:27017/",
    "mongodb://inteltrade:Tapw%26k5R56%267GsRy%26n@185.209.75.180:27017/",
    "mongodb://fintechit:Tapw%26k5R56%267GsRy%26nP@185.209.75.181:27017/",
    "mongodb://thrivinginfotech:TGw%26k5RT56%267GsRy%26nP@185.209.75.182:27017/",
    "mongodb://firstalgo:Taw%26k5RT56%267GsRy%26nP@185.209.75.183:27017/",
    "mongodb://visioncodesoftware:TGw%26k5RT56%267GsRy%26HR@185.209.75.184:27017/",
    "mongodb://brightextech:T5wP%26k5T56%267GsRy%26M@185.209.75.185:27017/",
    "mongodb://shinesofttrade:T5wP%26k56T56%267GsRy%26H@185.209.75.186:27017/",
    "mongodb://algoruns:Tw%26k5RT56%267GsRy%26HR@185.209.75.187:27017/",
    "mongodb://techoceantechnologies:P5wP%26k6T5M%26L7GsRy%26H@185.209.75.189:27017/",
    "mongodb://brillianttechit:T5wP&k5T567GsRy&M@185.209.75.251:27017/",
    "mongodb://newtimetechnologies:H5wP%26k5T567GsRy%26MT@185.209.75.252:27017/",
    "mongodb://darixosolution:M5wP%26k5T567GsRy%26MT@185.209.75.254:27017/",
    "mongodb://magmamultitrade:M5P%26k5T567GsRy%26MT@185.209.75.253:27017/",
    "mongodb://intravisor:M5RP%26k5T567GsRy%26MT@185.209.75.191:27017/",
    "mongodb://procodetechnology:M5RP%26k5T567GRy%26MT@185.209.75.192:27017/",
    "mongodb://unitythesmartalgo:M5RP%26k5T567GsRy%26MT@185.209.75.190:27017/",
    "mongodb://smartstox:MM5RP%26k5T567GRy%26MT@185.209.75.193:27017/",
    "mongodb://visionmatictechnology:MM5P%26k5T567GRy%26MT@185.209.75.194:27017/",
    "mongodb://winwaysoftwares:MM5P%26k5T567Gy%26MT@185.209.75.195:27017/",
    "mongodb://onealgo:MM5P&k5T567Gy&Ma@185.209.75.196:27017/",
    "mongodb://unityhubitsolution:MM5P%26k5T567Gy%26MTa@185.209.75.197:27017/",
    "mongodb://wealthcrafttechnology:M5P%26k5T567Gy%26Ma@185.209.75.199:27017/",
    "mongodb://techelitesolution:MWQ5RP%26k5T567Gy%26Ma@193.239.237.31:27017/",
    "mongodb://algosparks:MW5R%26k5FT567Gy%26Ma@193.239.237.129:27017/",
    "mongodb://ssfintech:MW5RP%26k5T567Gy%26Ma@193.239.237.114:27017/",
    "mongodb://rainfotech:MWQ5RP%26k5T567Gy%26Ma@193.239.237.38:27017/",
    "mongodb://technofin:MWQ5RP%26k5T567Gy%26Ma@193.239.237.44:27017/",
    "mongodb://vittsurge:M5RP%26k5T567Gy%26Ma@193.239.237.128:27017/",
    "mongodb://growwayalgo:MWQ5RP%26kT567Gy%26Maa@185.209.75.87:27017/",
    "mongodb://cashwealth:AMWQ5RP&kT567Gy&Maa@185.209.75.88:27017/",
    "mongodb://growonntechnologies:AaMWQ5RP%26kT567Gy%26Maa@185.209.75.89:27017/",
    "mongodb://tradejockey:AaMWQ5RP%26kT567Gy%26Ma@185.209.75.90:27017/",
  ];
  //testtt

  // Connect to MongoDB and create views
  async function createViewsAllDatabase() {
    for (const server of servers) {
      const client = new MongoClient(server);

      try {
        await client.connect();
        const database = "test";
        const db = client.db(database);

        const viewName = "kotakneoView";
        const collectionName = "users";

        // Define view pipeline
        const viewPipeline = [
          {
            $match: {
              broker: "7",
              TradingStatus: "on", // Condition from the user collection
              $or: [
                { EndDate: { $gte: new Date() } }, // EndDate is today or in the future
                { EndDate: null }, // EndDate is not set
              ],
            },
          },
          {
            $lookup: {
              from: "client_services",
              localField: "_id", // Field from the user collection to match
              foreignField: "user_id", // Field from the client_services collection to match
              as: "client_services",
            },
          },
          {
            $unwind: "$client_services",
          },
          {
            $match: {
              "client_services.active_status": "1",
            },
          },
          {
            $lookup: {
              from: "services",
              localField: "client_services.service_id",
              foreignField: "_id",
              as: "service",
            },
          },
          {
            $unwind: "$service",
          },
          {
            $lookup: {
              from: "categories",
              localField: "service.categorie_id",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $lookup: {
              from: "strategies",
              localField: "client_services.strategy_id",
              foreignField: "_id",
              as: "strategys",
            },
          },
          {
            $unwind: "$strategys",
          },
          {
            $project: {
              client_services: 1,
              "service.name": 1,
              "service.instrument_token": 1,
              "service.exch_seg": 1,
              "strategys.strategy_name": 1,
              "category.segment": 1,
              "service.zebu_token": 1,
              _id: 1,
              FullName: 1,
              UserName: 1,
              Email: 1,
              EndDate: 1,
              ActiveStatus: 1,
              TradingStatus: 1,
              access_token: 1,
              api_secret: 1,
              app_id: 1,
              client_code: 1,
              api_key: 1,
              app_key: 1,
              api_type: 1,
              demat_userid: 1,
              client_key: 1,
              web_url: 1,
              kotakneo_sid: 1,
              kotakneo_auth: 1,
              kotakneo_userd: 1,
              hserverid: 1,
              oneTimeToken: 1,
            },
          },
          {
            $addFields: {
              postdata: {
                am: "NO",
                dq: "0",

                es: {
                  $cond: {
                    if: { $eq: ["$category.segment", "C"] }, // Your condition here
                    then: "nse_cm",
                    else: {
                      $cond: {
                        if: {
                          $or: [
                            { $eq: ["$category.segment", "F"] },
                            { $eq: ["$category.segment", "O"] },
                            { $eq: ["$category.segment", "FO"] },
                          ],
                        },
                        then: "nse_fo",
                        else: {
                          $cond: {
                            if: {
                              $or: [
                                { $eq: ["$category.segment", "MF"] },
                                { $eq: ["$category.segment", "MO"] },
                              ],
                            },
                            then: "mcx_fo",
                            else: {
                              $cond: {
                                if: {
                                  $or: [
                                    { $eq: ["$category.segment", "CF"] },
                                    { $eq: ["$category.segment", "CO"] },
                                  ],
                                },
                                then: "cde_fo",

                                // all not exist condition
                                else: "nse_fo",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                mp: "0",

                // product code condition here
                pc: {
                  $cond: {
                    if: {
                      $and: [
                        { $eq: ["$client_services.product_type", "1"] },
                        {
                          $or: [
                            { $eq: ["$category.segment", "F"] },
                            { $eq: ["$category.segment", "O"] },
                            { $eq: ["$category.segment", "FO"] },
                          ],
                        },
                      ],
                    },
                    then: "NRML",
                    else: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ["$client_services.product_type", "2"] },
                          ],
                        },
                        then: "MIS",
                        else: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: ["$client_services.product_type", "3"] },
                              ],
                            },
                            then: "BO",
                            else: {
                              $cond: {
                                if: {
                                  $and: [
                                    {
                                      $eq: [
                                        "$client_services.product_type",
                                        "4",
                                      ],
                                    },
                                  ],
                                },
                                then: "CO",
                                else: "CNC",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                pf: "N",

                pr: "0",

                pt: {
                  $cond: {
                    if: {
                      $and: [{ $eq: ["$client_services.order_type", "1"] }],
                    },
                    then: "MKT",
                    else: {
                      $cond: {
                        if: {
                          $and: [{ $eq: ["$client_services.order_type", "2"] }],
                        },
                        then: "L",
                        else: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: ["$client_services.order_type", "3"] },
                              ],
                            },
                            then: "SL",
                            else: {
                              $cond: {
                                if: {
                                  $and: [
                                    {
                                      $eq: ["$client_services.order_type", "4"],
                                    },
                                  ],
                                },
                                then: " SL-M",

                                //All condition exist
                                else: "MKT",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                qt: "$client_services.quantity",

                rt: "DAY",

                tp: "0",

                ts: {
                  $cond: {
                    if: {
                      $and: [{ $eq: ["$category.segment", "C"] }],
                    },
                    then: "$service.zebu_token",
                    else: "",
                  },
                },

                tt: "B",
              },
            },
          },
        ];

        const collectionExists = await db
          .listCollections({ name: viewName })
          .hasNext();

        if (!collectionExists) {
          // Create the view collection
          await db.createCollection(viewName, {
            viewOn: collectionName,
            pipeline: viewPipeline,
          });

          console.log(
            `View '${viewName}' Created in '${database}' on '${server}'`
          );
        } else {
          console.log(
            `Collection ${viewName} already exists in 'test' on '${server}'`
          );
        }
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      } finally {
        await client.close();
      }
    }
  }

  app.get("/AllViewCreate", async (req, res) => {
    //  createViewsAllDatabase();
    // deleteViewsAllDatabase();
    //  RunQueryUpdateAllDatabase()
    // RunQueryAddAllDatabase()
    // RunQueryManulTaskAllDatabase(res)
    return res.send("OKK DONE FF");
  });

  async function deleteViewsAllDatabase() {
    for (const server of servers) {
      const client = new MongoClient(server);

      try {
        await client.connect();
        const database = "test";
        const db = client.db(database);

        const viewName = "kotakneoView";
        //const collectionName = "users";
        const collectionExists = await db
          .listCollections({ name: viewName })
          .hasNext();

        if (collectionExists) {
          // Drop the existing view collection
          await db.collection(viewName).drop();
          console.log(
            `View '${viewName}' dropped in '${database}' on '${server}'`
          );
        } else {
          console.log(
            `View '${viewName}' Not exist in '${database}' on '${server}'`
          );
        }
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      } finally {
        await client.close();
      }
    }
  }

  async function RunQueryUpdateAllDatabase() {
    for (const server of servers) {
      const client = new MongoClient(server);
      db.option_chain_symbols.updateOne(
        { symbol: "MIDCPNIFTY" },
        { $set: { price: "12400" } }
      );
      try {
        await client.connect();
        const database = "test";
        const db = client.db(database);

        const collectionName = "option_chain_symbols";

        // const fliter = {};
        const fliter = { symbol: "MIDCPNIFTY" };

        // const updates = { $set: { exit_time: "0", target: "0", stop_loss: "0" } };
        const updates = { $set: { price: "12500" } };

        const options = { multi: true };

        const collectionExists = await db
          .listCollections({ name: collectionName })
          .hasNext();

        if (collectionExists) {
          // Run the updateMany query
          const result = await db
            .collection(collectionName)
            .updateMany(fliter, updates, options);
          console.log(
            `Updated ${result.modifiedCount} documents in ${collectionName} collection on '${server}'`
          );
        } else {
          console.log(`Collection Not exists in 'test' on '${server}'`);
        }
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      } finally {
        await client.close();
      }
    }
  }

  async function RunQueryAddAllDatabase() {
    for (const server of servers) {
      const client = new MongoClient(server);

      try {
        await client.connect();
        const database = "test";
        const db = client.db(database);
        const collectionName = "mainsignals";

        const documentToInsert = [{ ss: "okk" }];

        const collectionExists = await db
          .listCollections({ name: collectionName })
          .hasNext();

        if (collectionExists) {
          // Insert one document into the collection
          const result = await db
            .collection(collectionName)
            .insertMany(documentToInsert);
          console.log(
            `Inserted 1 document into 'mainsignals' collection on '${server}'`
          );
        } else {
          console.log(`Collection does not exist in 'test' on '${server}'`);
        }
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      } finally {
        await client.close();
      }
    }
  }

  async function RunQueryManulTaskAllDatabase(res) {
    for (const server of servers) {
      const client = new MongoClient(server);

      try {
        await client.connect();
        const database = "test";
        const db = client.db(database);
        const collectionName = "all_panels";

        const collectionExists = await db
          .listCollections({ name: collectionName })
          .hasNext();

        if (collectionExists) {
          const pipeline = [
            {
              $project: {
                backend_rul: 1,
              },
            },
          ];
          const cursor = db.collection(collectionName).aggregate(pipeline);

          const all_panelsResult = await cursor.toArray();

          const all_panelsResult1 = all_panelsResult.map((item) => {
            if (item.backend_rul != "http://localhost:7700/") {
              return item.backend_rul;
            } else {
              return "";
            }
          });

          const axios = require("axios");
          const filteredResults = all_panelsResult1.filter((url) =>
            url.includes("/backend/")
          );
          console.log(filteredResults);

          let count = 0;
          if (filteredResults.length > 0) {
            filteredResults.forEach((element) => {
              if (element == "software.invicontechnology.com/backend/") {
                count++;

                let url = element + "addstockExtra";

                let config = {
                  method: "get",
                  maxBodyLength: Infinity,
                  url: url,
                  headers: {},
                };

                axios
                  .request(config)
                  .then((response) => {})
                  .catch((error) => {});
              }
            });
          }

          console.log(`Get Data collection on '${server}'`);
        } else {
          console.log(`Collection does not exist in 'test' on '${server}'`);
        }
      } catch (error) {
        console.log(`An error occurred: ${error}`);
      } finally {
        await client.close();
      }
    }
  }

  app.get("/remain_get_token", async (req, res) => {
    try {
      const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];

      const expiry = "30112023";
      let limit_set = 20;
      let price = 21000;

      var alltokenchannellist;

      const date = new Date(); // Month is 0-based, so 10 represents November
      const currentDate = new Date();
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      const formattedDate = previousDate.toISOString();
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const formattedLastDayOfMonth = lastDayOfMonth.toISOString();

      const final_data = [];

      for (const symbol of symbols) {
        const pipeline = [
          {
            $match: { symbol: symbol },
          },
          {
            $group: {
              _id: "$symbol",
              uniqueExpiryValues: { $addToSet: "$expiry" },
            },
          },
          {
            $unwind: "$uniqueExpiryValues",
          },
          {
            $addFields: {
              expiryDate: {
                $dateFromString: {
                  dateString: "$uniqueExpiryValues",
                  format: "%d%m%Y",
                },
              },
            },
          },
          {
            $match: {
              expiryDate: { $gte: new Date(formattedDate) },
            },
          },
          {
            $addFields: {
              formattedExpiryDate: {
                $dateToString: {
                  date: "$expiryDate",
                  format: "%d%m%Y",
                },
              },
            },
          },
          {
            $sort: { expiryDate: 1 },
          },
          {
            $limit: 5,
          },
        ];

        var data = await Alice_token.aggregate(pipeline);

        const result11 = data.filter((item) => {
          const itemDate = new Date(item.expiryDate);
          return (
            itemDate.getTime() === lastDayOfMonth.getTime() ||
            data.indexOf(item) < 2
          );
        });
        const expiryDatesArray = result11.map(
          (item) => item.uniqueExpiryValues
        );

        const get_symbol_price = await Get_Option_Chain_modal.findOne({
          symbol: symbol,
        });

        if (get_symbol_price != undefined) {
          price = parseInt(get_symbol_price.price);
        }

        const pipeline2 = [
          {
            $match: {
              symbol: symbol,
              segment: "O",
              expiry: { $in: expiryDatesArray },
            },
          },
        ];

        const pipeline3 = [
          {
            $match: {
              symbol: symbol,
              segment: "O",
              expiry: { $in: expiryDatesArray },
            },
          },
          {
            $addFields: {
              absoluteDifference: {
                $abs: {
                  $subtract: [{ $toInt: "$strike" }, price],
                },
              },
            },
          },
          {
            $group: {
              _id: "$strike", // Group by unique values of A
              minDifference: { $min: "$absoluteDifference" }, // Find the minimum absolute difference for each group
              document: { $first: "$$ROOT" }, // Keep the first document in each group
            },
          },
          {
            $sort: {
              minDifference: 1, // Sort by the minimum absolute difference in ascending order
            },
          },
          {
            $limit: limit_set,
          },
          {
            $sort: {
              _id: 1, // Sort by the minimum absolute difference in ascending order
            },
          },
        ];

        const result = await Alice_token.aggregate(pipeline2);
        const resultStrike = await Alice_token.aggregate(pipeline3);

        var channelstr = "";
        if (result.length > 0) {
          resultStrike.forEach((element) => {
            let call_token = "";
            let put_token = "";
            let symbol = "";
            let segment = "";
            result.forEach(async (element1) => {
              if (element.document.strike == element1.strike) {
                if (element1.option_type == "CE") {
                  symbol = element1.symbol;
                  segment = element1.segment;
                  call_token = element1.instrument_token;
                } else if (element1.option_type == "PE") {
                  symbol = element1.symbol;
                  segment = element1.segment;
                  put_token = element1.instrument_token;
                }

                const filter = { _id: element1.instrument_token };
                const update = {
                  $set: {
                    _id: element1.instrument_token,
                    exch: element1.exch_seg,
                  },
                };

                channelstr +=
                  element1.exch_seg + "|" + element1.instrument_token + "#";

                // const update_token = await token_chain.updateOne(filter, update, { upsert: true });
              }
            });
          });

          alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
          final_data.push(alltokenchannellist);
        }
      }

      res.send({ data: final_data });

      var concatenatedArray = "";

      final_data.forEach((data) => {
        concatenatedArray += data + "#";
      });

      // var concatenatedArray1 = concatenatedArray.substring(0, concatenatedArray.length - 1)
      // const filter = { broker_name: "ALICE_BLUE" };
      // const updateOperation = { $set: { Stock_chain: concatenatedArray1 } };
      // const Update_Stock_chain = await live_price.updateOne(filter, updateOperation);
      // return
    } catch (error) {
      console.log("Error Get_Option_All_Token_Chain", error);
    }
  });

  app.get("/pro", async (req, res) => {
    console.log("1");
    const axios = require("axios");

    let postdata = {
      complexty: "regular",
      discqty: "0",
      exch: "NFO",
      pCode: "NRML",
      prctyp: "MKT",
      price: "248.15",
      qty: 40,
      ret: "DAY",
      symbol_id: "67308",
      trading_symbol: "NIFTY23102619700CE",
      transtype: "SELL",
      trigPrice: "",
      orderTag: "order1",
    };

    let post_demat_userid = "438760";

    let post_access_token =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTc2OTk5MTcsImlhdCI6MTY5NzYyNzU1OSwianRpIjoiMzQ0NjIyZWItNjMxOS00ZjgyLTkyOWEtNTNjZmMyN2JiZTkzIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjRkNDJiMTA3LThjY2ItNDIyZC04YzRhLWNmMzc5NDE0MmVkYSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNGQ0MmIxMDctOGNjYi00MjJkLThjNGEtY2YzNzk0MTQyZWRhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.jYnVofPZIWZ9n9H6MvtOa-CpGAgt0BIG3hwbKI0iLiOgdmkVGILCykxL1r54WDK09K4c44eCGk-SrWWH_MHY6-vrfegbGdzpW6cVrOEEz7SpkDyd2nsYUX3SNCL1_1lUrDqjBGso5SgGE_lLLEccjfe5Nj6Qt2NOi6r-pzxuqJPFpLx_sbFcOUM3A1BZM8yFdeaex3UZ3pUzHwhDrHOg-x1VLAW8XCiW4qAzGxsBb2znErgiZTOfff2F-MoUuNbNASh8SMJsjcFpYUuMdS6OLvIIK1rGIy7zOBqP9VbEFHVzbDbQUSCh7DIUZfRdj53TbOJbKcMKz0WEF7ohM9ITM";

    let post_access_token1 =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTc3NzU3OTgsImlhdCI6MTY5NzY4OTU3OSwianRpIjoiMmQxMGRiMWEtMTA1NS00ZDkyLTllNjctYzc3OGI1ZTRkYzYzIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjE2MjU5NTYxLWQ2MmMtNDA1Ni04MWQ2LWQ0NjM0MDAwNGQ2YyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMTYyNTk1NjEtZDYyYy00MDU2LTgxZDYtZDQ2MzQwMDA0ZDZjIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.K2gg4-8VIg73tk16DJ17Nzc1RTewJvlDbfr9dmcp2w4OOBBG2sczlBkaeSAMDDXIecALVX67DDuaVFyI05UTvG3izZ11jEbygpmhV8V3Rt6jywFE4A0OVab-1O-P3d7vEDPoUqP4EuyTj0E0J5y10oIEyES3BKJRAldOSDuHUW9LLJFoVfqUD3FtQUehe6TN8oQ_gp1RxldStKO9mDjxdZOyomNRmXz2fUBbQkqcOsOEH47UerF6_PUObaGy5RF9EMJjl01H8PiIQBKbm9t7EpsHrRUS_cVXyrQCuRjXwitCcHBKwLoyeAk6LR1triCU9RVLIrzXRtFKauHV2ajFDw";

    // An array of request data
    const requestData = [
      {
        data: postdata,
        demat_userid: post_demat_userid,
        access_token: post_access_token1,
        name: "shk1",
      },
      {
        data: postdata,
        demat_userid: post_demat_userid,
        access_token: post_access_token,
        name: "shk2",
      },
      // Add more request data objects as needed
    ];

    const requestPromises = requestData.map(async (item) => {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder",
        headers: {
          Authorization:
            "Bearer " + item.demat_userid + " " + item.access_token,
          "Content-Type": "application/json",
        },
        data: JSON.stringify([item.data]),
      };

      axios(config)
        .then(async (response) => {
          console.log("respose", response.data);
        })
        .catch(async (error) => {
          console.log("Alice Blue Error", error.response);
          console.log("name- ", item.name);
        });
    });

    Promise.all(requestPromises)
      .then((responses) => {})
      .catch((errors) => {
        console.log("errors:", errors);
      });

    return res.send("doneeeee");

    return;

    const requests = [
      {
        demat_userid: "438760",
        access_token:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTc1MzA5NjQsImlhdCI6MTY5NzQ0NDg4MSwianRpIjoiODNhZThkMTgtMjlmZC00NWIwLWFkNzAtY2MwNjhkOTVkZGU4IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjFmOGYxNjVlLWVlNDQtNGU3OC1hNGM0LTYwYWJlNGJhMjUzMyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMWY4ZjE2NWUtZWU0NC00ZTc4LWE0YzQtNjBhYmU0YmEyNTMzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.bBVOW8AbcfthpbePNPpPf0DAR-Llk08OaXpyIqLjlOUl16Vz3LYtJqiduQKnKq8GPf3lG_Tj_gQvyD5TBeslk0gHeNFuIQ8YfQk7jJVbmT5SzPqTpIVZuAFHJQvHL8WyO0JKUWFnLOsQSDI5nPY24YV--CFLq8TjF6qcgfrTCUqvUIR7xWt6A-g0cLrTqzBcWRWd24CxMb6_7QtZ1TNJg-p7noVgwr8fWZn1Uni_eUJ5Z8chPxCaHcx9oykdeF_waDpNakgPL2AmEXB7wv-LXUeWwzx0hr86F63QFS5VSpC7TqwGk6-hhsNQo61wKs2A5gyGHnpO96d1SWio8dcdqg",
      },

      {
        demat_userid: "438760",
        access_token:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTc1MzA5NjQsImlhdCI6MTY5NzQ0NDg4MSwianRpIjoiODNhZThkMTgtMjlmZC00NWIwLWFkNzAtY2MwNjhkOTVkZGU4IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjFmOGYxNjVlLWVlNDQtNGU3OC1hNGM0LTYwYWJlNGJhMjUzMyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMWY4ZjE2NWUtZWU0NC00ZTc4LWE0YzQtNjBhYmU0YmEyNTMzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.bBVOW8AbcfthpbePNPpPf0DAR-Llk08OaXpyIqLjlOUl16Vz3LYtJqiduQKnKq8GPf3lG_Tj_gQvyD5TBeslk0gHeNFuIQ8YfQk7jJVbmT5SzPqTpIVZuAFHJQvHL8WyO0JKUWFnLOsQSDI5nPY24YV--CFLq8TjF6qcgfrTCUqvUIR7xWt6A-g0cLrTqzBcWRWd24CxMb6_7QtZ1TNJg-p7noVgwr8fWZn1Uni_eUJ5Z8chPxCaHcx9oykdeF_waDpNakgPL2AmEXB7wv-LXUeWwzx0hr86F63QFS5VSpC7TqwGk6-hhsNQo61wKs2A5gyGHnpO96d1SWio8dcdqg",
      },

      {
        demat_userid: "438760",
        access_token:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTc1MzA5NjQsImlhdCI6MTY5NzQ0NDg4MSwianRpIjoiODNhZThkMTgtMjlmZC00NWIwLWFkNzAtY2MwNjhkOTVkZGU4IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjFmOGYxNjVlLWVlNDQtNGU3OC1hNGM0LTYwYWJlNGJhMjUzMyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMWY4ZjE2NWUtZWU0NC00ZTc4LWE0YzQtNjBhYmU0YmEyNTMzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.bBVOW8AbcfthpbePNPpPf0DAR-Llk08OaXpyIqLjlOUl16Vz3LYtJqiduQKnKq8GPf3lG_Tj_gQvyD5TBeslk0gHeNFuIQ8YfQk7jJVbmT5SzPqTpIVZuAFHJQvHL8WyO0JKUWFnLOsQSDI5nPY24YV--CFLq8TjF6qcgfrTCUqvUIR7xWt6A-g0cLrTqzBcWRWd24CxMb6_7QtZ1TNJg-p7noVgwr8fWZn1Uni_eUJ5Z8chPxCaHcx9oykdeF_waDpNakgPL2AmEXB7wv-LXUeWwzx0hr86F63QFS5VSpC7TqwGk6-hhsNQo61wKs2A5gyGHnpO96d1SWio8dcdqg",
      },

      {
        demat_userid: "438760",
        access_token:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTc1MzA5NjQsImlhdCI6MTY5NzQ0NDg4MSwianRpIjoiODNhZThkMTgtMjlmZC00NWIwLWFkNzAtY2MwNjhkOTVkZGU4IiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImM5NzMzYTdlLTZjMTMtNDk2YS1iZThkLTliMjc4MGRhMTY5OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjFmOGYxNjVlLWVlNDQtNGU3OC1hNGM0LTYwYWJlNGJhMjUzMyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMWY4ZjE2NWUtZWU0NC00ZTc4LWE0YzQtNjBhYmU0YmEyNTMzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjQzODc2MCIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJTSEFLSVIgSFVTU0FJTiIsIm1vYmlsZSI6Ijc5OTkyOTcyNzUiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI0Mzg3NjAiLCJnaXZlbl9uYW1lIjoiU0hBS0lSIiwiZmFtaWx5X25hbWUiOiJIVVNTQUlOIiwiZW1haWwiOiJzaGFraXJraGFuMTIzODJAZ21haWwuY29tIn0.bBVOW8AbcfthpbePNPpPf0DAR-Llk08OaXpyIqLjlOUl16Vz3LYtJqiduQKnKq8GPf3lG_Tj_gQvyD5TBeslk0gHeNFuIQ8YfQk7jJVbmT5SzPqTpIVZuAFHJQvHL8WyO0JKUWFnLOsQSDI5nPY24YV--CFLq8TjF6qcgfrTCUqvUIR7xWt6A-g0cLrTqzBcWRWd24CxMb6_7QtZ1TNJg-p7noVgwr8fWZn1Uni_eUJ5Z8chPxCaHcx9oykdeF_waDpNakgPL2AmEXB7wv-LXUeWwzx0hr86F63QFS5VSpC7TqwGk6-hhsNQo61wKs2A5gyGHnpO96d1SWio8dcdqg",
      },
    ];

    function makeRequest(item) {
      console.log("2");

      let data = {
        complexty: "regular",
        discqty: "0",
        exch: "NFO",
        pCode: "NRML",
        prctyp: "MKT",
        price: "248.15",
        qty: 4,
        ret: "DAY",
        symbol_id: "67308",
        trading_symbol: "NIFTY23102619700CE",
        transtype: "SELL",
        trigPrice: "",
        orderTag: "order1",
      };

      const axios = require("axios");

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/api/placeOrder/executePlaceOrder",
        headers: {
          Authorization:
            "Bearer " + item.demat_userid + " " + item.access_token,
          "Content-Type": "application/json",
        },
        data: JSON.stringify([data]),
      };

      axios(config)
        .then(async (response) => {})
        .catch(async (error) => {
          console.log("error", error);
        });
    }

    Promise.all(requests.map((item) => makeRequest(item)))
      .then((results) => {
        console.log("All requests completed", results);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    return res.send("okk");
  });

  async function connectToDB(collectionName, response) {
    try {
      const db = dbTradeTools;

      const collections = await db.listCollections().toArray();

      const collectionExists = collections.some(
        (coll) => coll.name === collectionName
      );

      if (collectionExists) {
        const collection = db.collection(collectionName);

        if (response.lp != undefined && response.v != undefined) {
          const customTimestamp = new Date();

          let singleDocument = {
            _id: customTimestamp,
            lp: parseFloat(response.lp),
            v: parseFloat(response.v),
          };

          function evaluateFunction(change) {}

          const insertResult = await collection.insertOne(singleDocument);
        }

        createView(collectionName);
        createViewM3(collectionName);
      } else {
        await db.createCollection(collectionName);

        const collection = db.collection(collectionName);
        // const singleDocument = { name: 'John', age: 30 };

        if (response.lp != undefined && response.v != undefined) {
          const customTimestamp = new Date();

          let singleDocument = {
            _id: customTimestamp,
            lp: parseFloat(response.lp),
            v: parseFloat(response.v),
          };

          const insertResult = await collection.insertOne(singleDocument);
        }
      }
    } catch (err) {
      console.log("Error connecting to MongoDB:", err);
    }
  }

  async function createView(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      const collections = await db.listCollections().toArray();

      const collectionExists = collections.some(
        (coll) => coll.name === "M_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM3(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: { $hour: "$_id" },
                minute: {
                  $subtract: [
                    { $minute: "$_id" },
                    { $mod: [{ $minute: "$_id" }, 3] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M3_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M3_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM5(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: { $hour: "$_id" },
                minute: {
                  $subtract: [
                    { $minute: "$_id" },
                    { $mod: [{ $minute: "$_id" }, 5] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M5_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M5_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM10(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: { $hour: "$_id" },
                minute: {
                  $subtract: [
                    { $minute: "$_id" },
                    { $mod: [{ $minute: "$_id" }, 10] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M10_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M10_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM15(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: { $hour: "$_id" },
                minute: {
                  $subtract: [
                    { $minute: "$_id" },
                    { $mod: [{ $minute: "$_id" }, 15] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M15_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M15_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM30(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: { $hour: "$_id" },
                minute: {
                  $subtract: [
                    { $minute: "$_id" },
                    { $mod: [{ $minute: "$_id" }, 30] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M30_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M30_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM60(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: { $hour: "$_id" },
                minute: {
                  $subtract: [
                    { $minute: "$_id" },
                    { $mod: [{ $minute: "$_id" }, 60] }, // Round to nearest 5 minutes
                  ],
                },
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M60_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M60_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  async function createViewM1DAY(collectionName) {
    try {
      const db = dbTradeTools;

      const pipeline = [
        {
          $project: {
            _id: {
              $toDate: "$_id",
            },
            lp: 1,
            v: 1,
          },
        },
        {
          $addFields: {
            _id: {
              $dateFromParts: {
                year: { $year: "$_id" },
                month: { $month: "$_id" },
                day: { $dayOfMonth: "$_id" },
                hour: 0, // Set the hour to 0 to round to daily intervals
                minute: 0, // Set the minute to 0 to round to daily intervals
                second: 0,
                millisecond: 0,
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$_id",
              },
            },
            open: { $first: "$lp" },
            high: { $max: "$lp" },
            low: { $min: "$lp" },
            close: { $last: "$lp" },
            MaxVol: { $max: "$v" },
            MinVol: { $min: "$v" },
          },
        },
      ];

      // You can now execute this pipeline in your MongoDB aggregation query.

      const collections = await db.listCollections().toArray();
      // Check if the desired collection exists
      const collectionExists = collections.some(
        (coll) => coll.name === "M1DAY_" + collectionName
      );

      if (collectionExists) {
      } else {
        // Create the view with a name (e.g., "myview")
        const viewName = "M1DAY_" + collectionName;
        await db.createCollection(viewName, {
          viewOn: collectionName,
          pipeline: pipeline,
        });

        console.log(`View "${viewName}" created successfully.`);
      }
    } catch (err) {}
  }

  app.get("/testing_socket", function (req, res) {
    //  dropAllCollections();
    // res.send("okkkk");
    // return

    const io = require("socket.io-client");

    // Connect to the server using Socket.IO
    const socket = io("http://180.149.241.128:3001"); // Replace "your_server_address" with your actual server address

    // Listen for the "pankaj_sir" event from the server
    socket.on("testing_data", (response) => {
      if (response.tk) {
        connectToDB(response.tk, response);
      }
    });

    // Handle disconnection (optional)
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Handle errors (optional)
    socket.on("error", (error) => {});

    return res.send("okkkk ");
  });

  async function getTokenStrategy(token) {
    const pipeline1 = [
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userResult",
        },
      },

      {
        $unwind: "$userResult", //
      },
      {
        $match: {
          tokensymbol: token,
          status: "0",
        },
      },
      {
        $project: {
          user_id: 1,
          tokensymbol: 1,
          timeframe: 1,
          indicator: 1,
          price_source: 1,
          period: 1,
          inside_indicator: 1,
          condition: 1,
          buffer_value: 1,
          createdAt: 1,
          updatedAt: 1,
          updatedAt: 1,
          "userResult.UserName": 1,
          "userResult.client_key": 1,
        },
      },
    ];

    const result = await UserMakeStrategy.aggregate(pipeline1);

    if (result.length > 0) {
      result.forEach((element) => {
        callStartegy(element);
      });
      // return res.json({ status: true, msg: 'Get all', data: result });
    } else {
      console.log("No data Available ");

      // return res.json({ status: false, msg: 'An error occurred', data: [] });
    }
  }

  async function callStartegy(element) {
    let id = element._id;
    let user_id = element.user_id;
    let tokensymbol = element.tokensymbol;
    let timeframe = element.timeframe;
    let indicator = element.indicator;
    let price_source = element.price_source;
    let period = element.period;
    let inside_indicator = element.inside_indicator;
    let condition = element.condition;
    let offset = element.offset;
    let buffer_value = element.buffer_value;
    let UserName = element.userResult.UserName;

    const db = dbTradeTools;
    let collectionName = "M" + timeframe + "_" + tokensymbol;

    const collections = await db
      .listCollections({ name: collectionName })
      .toArray();

    if (collections.length > 0) {
      const collection = db.collection(collectionName);

      let incule_field = "";
      if (price_source == "open") {
        incule_field = {
          open: 1, // Include field1
        };
      } else if (price_source == "close") {
        incule_field = {
          close: 1, // Include field1
        };
      } else if (price_source == "high") {
        incule_field = {
          high: 1, // Include field1
        };
      } else if (price_source == "low") {
        incule_field = {
          low: 1, // Include field1
        };
      }

      const projection = incule_field;

      const pipeline = [{ $project: projection }, { $sort: { _id: 1 } }];
      let get_view_data = "";
      if (parseInt(offset) > 0) {
        const get_view = await collection.aggregate(pipeline).toArray();
        const lastIndex = get_view.length - parseInt(offset);
        get_view_data = get_view.slice(0, lastIndex);
      } else {
        get_view_data = await collection.aggregate(pipeline).toArray();
      }

      const pipelineTimeFrameData = [{ $sort: { _id: 1 } }];

      const timeFrameViewData = await collection
        .aggregate(pipelineTimeFrameData)
        .toArray();

      let get_final_data = "";
      if (price_source == "open") {
        get_final_data = get_view_data.map((item) => item.open);
      } else if (price_source == "close") {
        get_final_data = get_view_data.map((item) => item.close);
      } else if (price_source == "high") {
        get_final_data = get_view_data.map((item) => item.high);
      } else if (price_source == "low") {
        get_final_data = get_view_data.map((item) => item.low);
      }

   

      const lastElementTimeFrameViewData =
        timeFrameViewData[timeFrameViewData.length - 1];


      let averageData = "";

      if (indicator == "MA") {
        const MovingAverages = require("moving-averages");
        const MADATA = MovingAverages.ma(get_final_data, period);
        const MovingAveragesValue = MADATA[MADATA.length - 1];
        lastElementTimeFrameViewData.MA = parseFloat(MovingAveragesValue);

        if (inside_indicator == "EMA") {
          averageData = MovingAverages.ema(MADATA, period);
          const EMAValue = averageData[averageData.length - 1];
          lastElementTimeFrameViewData.EMA = parseFloat(EMAValue);
        } else if (inside_indicator == "DMA") {
          averageData = MovingAverages.dma(MADATA, period);
          const DMAValue = averageData[averageData.length - 1];
          lastElementTimeFrameViewData.DMA = parseFloat(DMAValue);
        } else if (inside_indicator == "SMA") {
          averageData = MovingAverages.sma(MADATA, period);
          const SMAValue = averageData[averageData.length - 1];
          lastElementTimeFrameViewData.SMA = parseFloat(SMAValue);
        } else if (inside_indicator == "WMA") {
          averageData = MovingAverages.wma(MADATA, period);
          const WMAValue = averageData[averageData.length - 1];
          lastElementTimeFrameViewData.WMA = parseFloat(WMAValue);
        }
      }

  

      
      const lastElementAverageData = averageData[averageData.length - 1];
    

      if (condition != undefined) {
        const conditionArray = condition.split(/\s*(?:&&|\|\|)\s*/);
      
        if (conditionArray.length > 0) {
        }
      }

      // Sample data for the condition
      // const data = {
      //   close: 485, // Replace with actual values
      //   open: 480,
      //   high: 490,
      //   MA: 482, // Replace with actual moving average value
      //   EMA: 481, // Replace with actual exponential moving average value
      //   SMA: 495 // Replace with actual simple moving average value
      // };

      // Parse and evaluate the condition
      //const conditionString = "close > MA && open < EMA || high < SMA";

      // Split the condition into individual parts based on "&&" and "||"
      const conditions = condition.split(/\s*\|\|\s*/); // Split by "||" first

      // Initialize a result variable to store the final evaluation result
      let result = false;

      // Loop through each condition and evaluate it
      for (const condition of conditions) {
        const andConditions = condition.split(/\s*&&\s*/); // Then split by "&&"
        let andResult = true; // Initialize result for "&&" conditions as true

        for (const andCondition of andConditions) {
          const evaluated = evaluateSingleCondition(
            andCondition,
            lastElementTimeFrameViewData
          );
          andResult = andResult && evaluated; // Combine "&&" conditions
        }

        result = result || andResult; // Combine "||" conditions
      }

      console.log("Condition evaluation result:", result);
      if (result == true) {
        console.log("True condition - ", lastElementTimeFrameViewData);

        const getPricecollection = db.collection(element.tokensymbol);

        const pipelineGetPrice = [
          { $sort: { _id: -1 } },
          { $project: { lp: 1 } },
          { $limit: 1 },
        ];

        const getPriceData = await getPricecollection
          .aggregate(pipelineGetPrice)
          .toArray();

     

        sendSignanl(lastElementTimeFrameViewData, element, getPriceData[0].lp);
      }
    } else {
   
    }
  }

  function evaluateSingleCondition(condition, data) {

    const [variable, operator, value] = condition.split(/\s*(>|<|>=|<=|=)\s*/);

    //const numericValue = parseFloat(value);
    const numericValue = parseFloat(data[value]);
    switch (operator) {
      case ">":
        return data[variable] > numericValue;
      case "<":
        return data[variable] < numericValue;
      case ">=":
        return data[variable] >= numericValue;
      case "<=":
        return data[variable] <= numericValue;
      case "=":
        return data[variable] === numericValue;
      default:
        return false;
    }
  }

  function sendSignanl(lastElementTimeFrameViewData, element, price) {
   
    const dt_date = new Date().getTime();

    let type = "LE";
    if ((element.type = "SELL")) {
      type = "SE";
    }

    let tr_price = "0";

    let sq_value = "0";
    let sl_value = "0";
    let tsl = "0";

    let strike = "0";
    if (element.strike_price != "") {
      strike = element.strike_price;
    }

    let option_type = "CALL";
    if (element.option_type.toUpperCase() == "PE") {
      option_type = "PUT";
    }

    let qty_percent = "100";

    let client_key = "SNE132023";
    if (element.userResult.client_key != undefined) {
      client_key = element.userResult.client_key;
    }

    let request =
      dt_date +
      "|" +
      element.symbol_name +
      "|" +
      type +
      "|" +
      tr_price +
      "|" +
      price.toString() +
      "|" +
      sq_value +
      "|" +
      sl_value +
      "|" +
      tsl +
      "|" +
      element.segment +
      "|" +
      strike +
      "|" +
      option_type +
      "|" +
      element.expiry +
      "|" +
      element.strategy_name +
      "|" +
      qty_percent +
      "|" +
      client_key +
      "|demo";

    var axios = require("axios").default;

    var options = {
      method: "POST",
      url: "http://localhost:8000/broker-signals",
      headers: {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "text/plain",
      },
      data: request,
    };

    axios
      .request(options)
      .then(function (response) {
  
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  app.get("/StrategyBuySellView", async (req, res) => {
    // const pipeline1 = [
    //   {
    //     $group: {
    //       _id: "$tokensymbol",
    //       // AllDocument: { $push: "$$ROOT" },

    //       type : {$push : "$type"}
    //     },
    //   },

    // ];

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userResult",
        },
      },

      {
        $unwind: "$userResult", //
      },
      {
        $match: {
          //tokensymbol : token,
          status: "0",
        },
      },
      {
        $project: {
          user_id: 1,
          tokensymbol: 1,
          symbol_name: 1,
          strategy_name: 1,
          segment: 1,
          strike_price: 1,
          option_type: 1,
          expiry: 1,
          timeframe: 1,
          indicator: 1,
          price_source: 1,
          period: 1,
          inside_indicator: 1,
          condition: 1,
          buffer_value: 1,
          type: 1,
          offset: 1,
          createdAt: 1,
          updatedAt: 1,
          "userResult.UserName": 1,
          "userResult.client_key": 1,
        },
      },
    ];

    const result = await UserMakeStrategy.aggregate(pipeline);


    if (result.length > 0) {
      result.forEach((element) => {
        callStartegy(element);
      });
    }

    return res.send(result);
  });

  async function dropAllCollections() {
    try {
      const db = dbTradeTools;

      const collections = await dbTradeTools.listCollections().toArray();
      // Drop each collection
      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;

        if (collectionName != "system.views") {
          await dbTradeTools.collection(collectionName).drop();
         
        }
      }

    } catch (error) {
      console.log("Error:", error);
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  }

  // Call the function to drop all collections in the database
  async function TriggerCollection(token) {
    const collection = dbTradeTools.collection(token);

    const changeStream = collection.watch();

    changeStream.on("change", (change) => {
      // Handle the change event here
      console.log("Change event : " + token + " : -", change);

      // Implement your custom logic here based on the change event
    });
  }

  app.get("/d-s", async (req, res) => {
    return;
    let array = ["usermakestrategies", "signals", "mainsignals"];

    let col1 = "usermakestrategies";
    await dbTest.collection(col1).drop();

    let col2 = "signals";
    await dbTest.collection(col2).drop();

    let col3 = "mainsignals";
    await dbTest.collection(col3).drop();

    return res.send("okkkk");
  });

  app.get("/socket-api", async (req, res) => {
    dropAllCollections();
    return res.send("okkkk");
    return;
    //connectToDB(collection);

    var BASEURL = "https://ant.aliceblueonline.com/rest/AliceBlueAPIService/";
    let AuthorizationToken;
    let type = "API";
    const url = "wss://ws1.aliceblueonline.com/NorenWS/";
    let socket;
    // let channel = 'NSE|3045#NSE|14366#NFO|59218#NFO|59219';
    let channel = "NFO|67309#NFO|67308";

    let userId = "709913";
    let userSession =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyam9lOFVScGxZU3FTcDB3RDNVemVBQkgxYkpmOE4wSDRDMGVVSWhXUVAwIn0.eyJleHAiOjE2OTcxNjQwOTksImlhdCI6MTY5NzA4MzA1MCwianRpIjoiMjM1MTAxYjItMTMxNi00YWYzLTg0YmMtM2Y0YTJmMzlhNDUzIiwiaXNzIjoiaHR0cHM6Ly9hYjEuYW1vZ2EudGVjaC9hbXNzby9yZWFsbXMvQWxpY2VCbHVlIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjdlZWNhMTY1LWI0Y2UtNDY3MC04ODljLThjODdiNWU4M2FiYSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFsaWNlLWtiIiwic2Vzc2lvbl9zdGF0ZSI6IjhhZGFiMzllLTAxN2YtNDJkNS1hMjRkLWNhNDQxZGQ2NjI3ZiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAyIiwiaHR0cDovL2xvY2FsaG9zdDo1MDUwIiwiaHR0cDovL2xvY2FsaG9zdDo5OTQzIiwiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYWxpY2VibHVla2IiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFsaWNlLWtiIjp7InJvbGVzIjpbIkdVRVNUX1VTRVIiLCJBQ1RJVkVfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiOGFkYWIzOWUtMDE3Zi00MmQ1LWEyNGQtY2E0NDFkZDY2MjdmIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVjYyI6IjcwOTkxMyIsImNsaWVudFJvbGUiOlsiR1VFU1RfVVNFUiIsIkFDVElWRV9VU0VSIl0sIm5hbWUiOiJIRU1BTEkgREFMV0FESSIsIm1vYmlsZSI6Ijk1NzQ4NDUyMzQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI3MDk5MTMiLCJnaXZlbl9uYW1lIjoiSEVNQUxJIiwiZmFtaWx5X25hbWUiOiJEQUxXQURJIiwiZW1haWwiOiJkYWx3YWRpLmhlbWFsaTI3MTFAZ21haWwuY29tIn0.Y7Ut4ubyfJx0rhbBBVC-dAYTn022aJxbfZWJBvNCpOkZg_ox9h5MomFbnf2q2IxO581Pcs9VBgVtF4GctOpvu2IaEi0gGrMc7Zz2hxtEfZaTMVqwy-LGhiCD0abpSynZup3TKPC019befXLThyi4Zat3gcblszApTqN51ScIOUAAs5PvNoBISkm6qL4_4D9ykSArNuboQZEJd9JubuOXP1tA2fMKrouWXgb5biFk5MS7vBqp8Rld5nNeHMMQnA6tWC-JFWgt1dOcpri8EXmGxbC71qLHZITqaSvJ9ZJyUmaQd374F0NxV27q6OVC6_FW584mphCmbwiVxb-5w2O-dw";

    connect(userId, userSession, channel);

    function connect(userId, userSession, token = "") {
      console.log("1");
      socket = new WebSocket(url);
      socket.onopen = function () {
        console.log("2");
        connectionRequest(userId, userSession);
      };
      socket.onmessage = async function (msg) {
        var response = JSON.parse(msg.data);
        console.log("okk socket open  1 ", response);

        if (response.tk) {
          connectToDB(response.tk, response);
        }

        if (response.s == "OK") {
          var channel = token;
          let json = {
            k: channel,
            t: "t",
          };
          socket.send(JSON.stringify(json));
        }
      };
      socket.onclose = function (event) {
        if (event.wasClean) {
          // alert(`1 [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          connect(userId, userSession, token);
          // alert('[close] Connection died');
        }
      };
    }

    function connectionRequest(userId, userSession) {
      console.log("3");
      var encrcptToken = CryptoJS.SHA256(
        CryptoJS.SHA256(userSession).toString()
      ).toString();
      // alert(encrcptToken);
      var initCon = {
        susertoken: encrcptToken,
        t: "c",
        actid: userId + "_" + type,
        uid: userId + "_" + type,
        source: type,
      };
      console.log("initCon", JSON.stringify(initCon));
      try {
        socket.send(JSON.stringify(initCon));
      } catch (error) {
        console.log("Shocket", error);
      }
    }
    return res.send("socket run");
  });

  app.post("/moving_average", async (req, res) => {
    let token = req.body.token;
    let market_status = req.body.market_status;
    let time = parseInt(req.body.time);
    let indicator = req.body.indicator;
    console.log("token", token);
    console.log("market_status", market_status);
    console.log("time", time);
    const db = dbTradeTools;
    let collectionName = "M_" + token;
    const collection = db.collection(collectionName);

    let incule_field = "";
    if (market_status == "open") {
      incule_field = {
        open: 1, // Include field1
      };
    } else if (market_status == "close") {
      incule_field = {
        close: 1, // Include field1
      };
    } else if (market_status == "high") {
      incule_field = {
        high: 1, // Include field1
      };
    } else if (market_status == "low") {
      incule_field = {
        low: 1, // Include field1
      };
    }

    const projection = incule_field;
    const pipeline = [{ $project: projection }, { $sort: { _id: 1 } }];

    const get_view_data = await collection.aggregate(pipeline).toArray();

    let get_final_data = "";
    if (market_status == "open") {
      get_final_data = get_view_data.map((item) => item.open);
    } else if (market_status == "close") {
      get_final_data = get_view_data.map((item) => item.close);
    } else if (market_status == "high") {
      get_final_data = get_view_data.map((item) => item.high);
    } else if (market_status == "low") {
      get_final_data = get_view_data.map((item) => item.low);
    }

    let averageData = "";

    if (indicator == "MA") {
      const MovingAverages = require("moving-averages");
      averageData = MovingAverages.sma(get_final_data, time);
    } else if (indicator == "EMA") {
      // EMA parameters
      const ti = require("technicalindicators");
      const input = {
        values: get_final_data,
        period: time, // EMA period (adjust as needed)
      };
      // Calculate EMA
      averageData = ti.EMA.calculate(input);
    }

    return res.send({
      status: true,
      data: get_final_data.length,
      averageData: averageData.length,
    });
  });

  app.get("/testing_condition", async (req, res) => {
    const math = require("mathjs");

    // const abc = (data, conditionString) => {
    //   try {
    //     // Use eval to dynamically evaluate the condition string
    //     const condition = eval(conditionString);

    //     // Check if the condition is true or false based on the data
    //     if (condition) {
    //       // Your code for when the condition is true
    //       console.log("Condition is true");
    //     } else {
    //       // Your code for when the condition is false
    //       console.log("Condition is false");
    //     }
    //   } catch (error) {
    //     console.log("Error in evaluating the condition:", error);
    //   }
    // };

    // // Example usage:
    // const data1 = {
    //   close: [/* data for close(0) */],
    //   low: [/* data for low(1) */],
    //   high: [/* data for high(2) */],
    // };

    // const conditionString = "(data.close[0] >= data.low[1] || data.high[0] < data.low[2]) && data.close[1] < data.high[2]";

    // abc(data1, conditionString);

    // res.send("okk")
    //return

    // let data = {
    //   a: 8,
    //   b: 7,
    //   c: 9,
    // };

    // // Define the condition as a function
    // const condition = (data) => ((data.a >= data.b || data.c < data.b) && data.b > data.a)||data.b < data.a;

    // let result = condition(data);

    // let data = {
    //   close(0): 480.5,
    //   low(1): 480.5,
    //   low(2): 480.5,
    //   close(1): 480.5,
    //   high(2): 480.5
    // };

    // return

    const pipeline = [
      {
        $match: {
          tokensymbol: "3045",
        },
      },
    ];

    const allStrategyResult = await UserMakeStrategy.aggregate(pipeline);
    if (allStrategyResult.length > 0) {
      for (const val of allStrategyResult) {
        let collectionName = "M" + val.timeframe + "_" + val.tokensymbol;

        const ExistView = await dbTradeTools
          .listCollections({ name: collectionName })
          .toArray();

        if (ExistView.length > 0) {
          // console.log("exist collection if ",collectionName)
          const collection = dbTradeTools.collection(collectionName);
          const get_view_data = await collection
            .aggregate([{ $sort: { _id: 1 } }])
            .toArray();

          let checkData = {};
          if (val.condition_source != null) {
            let condition_source = val.condition_source.split(",");

            if (condition_source.length > 0) {
              for (const source of condition_source) {
                const matches = source.match(/(\w+)\((\d+)\)/);

                if (matches) {
                  const OFFSET_KEY = matches[2]; //

                  const viewSourceValue =
                    get_view_data[
                      get_view_data.length - (parseInt(OFFSET_KEY) + 1)
                    ];

                  // console.log("viewSourceValue",viewSourceValue); // This will output: 'close(1)'
                  // console.log("matches[1]",matches[1]); // This will output: 'close(1)'

                  let sourceVal;
                  if (matches[1] == "close") {
                    sourceVal = get_view_data.map((item) => item.close);
                  } else if (matches[1] == "open") {
                    sourceVal = get_view_data.map((item) => item.open);
                  } else if (matches[1] == "low") {
                    sourceVal = get_view_data.map((item) => item.low);
                  } else if (matches[1] == "high") {
                    sourceVal = get_view_data.map((item) => item.high);
                  }

                  const openValues = get_view_data.map((item) => item.open);

                  // console.log("source" ,matches[1])
                  //   console.log("source value" ,sourceVal)
                  checkData[matches[1]] = sourceVal;
                } else {
                  console.log("No match found");
                }

                //  const key = sourceVal.replace(/[^a-zA-Z0-9]/g, ''); // Extract the key from the string
              }
            }
          }
          // console.log("checkData - ",checkData)
          // console.log("val.condition - ",val.condition)

          // let data = {
          //   a: 8,
          //   b: 7,
          //   c: 9,
          // };

          // Define the condition as a function

          const abc = (data, conditionString) => {
            console.log("data - ", data);
            console.log("conditionString - ", conditionString);
            try {
              // Use eval to dynamically evaluate the condition string
              const condition = eval(conditionString);

              // Check if the condition is true or false based on the data
              if (condition) {
                // Your code for when the condition is true
                // console.log("Condition is true");
              } else {
                // Your code for when the condition is false
                console.log("Condition is false");
              }
            } catch (error) {
              console.log("Error in evaluating the condition:", error);
            }
          };

          // Example usage:
          const data1 = {
            close: [
              /* data for close(0) */
            ],
            low: [
              /* data for low(1) */
            ],
            high: [
              /* data for high(2) */
            ],
            open: [
              /* data for high(2) */
            ],
          };

          const conditionString =
            "(data.close[0] >= data.low[1] || data.high[0] < data.low[2]) && data.close[1] < data.high[2]";

          const conditiostring1 =
            "(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]<data.high[2]";

          abc(checkData, conditiostring1);

          return res.send("okk");
          return;
          const condition = (checkData) => val.condition;

          // Evaluate the condition with the data
          let resultCondition = condition(checkData);
          console.log("get_view_data", resultCondition);
        }

        return res.send("okk done");
        return;
        // Assuming you have some data to use for the condition evaluation
        const data = {
          // close: [480],
          // low: [485],
          // high: [685],
        };

        // let collectionName = 'M' + val.timeframe + '_' + val.tokensymbol;

        // const ExistView = await dbTradeTools.listCollections({ name: collectionName }).toArray();

        // if (ExistView.length > 0) {

        //  // console.log("exist collection if ",collectionName)
        //   const collection = dbTradeTools.collection(collectionName);
        //   const get_view_data = await collection.aggregate([]).toArray();

        // }
      }
    }
    return res.send("okk");
  });

  const getHistoricalPrices = async (collection, period) => {
    const prices = await collection
      .find({})
      .sort({ _id: -1 })
      .limit(period)
      .toArray();
    console.log("prices", prices);
    return prices.map((price) => price.close); // Adjust based on your price structure
  };

  function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    let emaArray = [prices[0]]; // Initialize with the first price

    for (let i = 1; i < prices.length; i++) {
      emaArray.push(prices[i] * k + emaArray[i - 1] * (1 - k));
    }

    return emaArray;
  }

  app.get("/work_startegy", async (req, res) => {
    const pipeline = [
      {
        $match: {
          // tokensymbol:"111435",
          // status: "1"
          name: "SHK64c76f1d32067577d02310dfBUY111435",
        },
      },
    ];

    const allStrategyResult = await UserMakeStrategy.aggregate(pipeline);
    //  console.log("allStrategyResult", allStrategyResult)
    if (allStrategyResult.length > 0) {
      for (const val of allStrategyResult) {
        //console.log("startegy",val.condition)
        console.log("timeframe", val.timeframe);
        console.log("tokensymbol", val.tokensymbol);

        let collectionName = "M" + val.timeframe + "_" + val.tokensymbol;
        console.log("collectionName", collectionName);
        const ExistView = await dbTradeTools
          .listCollections({ name: collectionName })
          .toArray();
        if (ExistView.length > 0) {
          // console.log("exist collection if ",collectionName)
          const collection = dbTradeTools.collection(collectionName);
          const get_view_data = await collection
            .aggregate([{ $sort: { _id: 1 } }])
            .toArray();

          const prices = await getHistoricalPrices(collection, 3); // Adjust the period as needed

          if (prices.length < 3) {
            console.log("Not enough data to calculate EMA");
            continue;
          }

          const ema = calculateEMA(prices, 20); // Adjust the period as needed

          // console.log("get_view_data",get_view_data)

          let checkData = {};
          if (val.condition_source != null) {
            let condition_source = val.condition_source.split(",");
            // console.log("condition_source",condition_source)
            if (condition_source.length > 0) {
              for (const source of condition_source) {
                console.log("condition_source", source);

                const matches = source.match(/(\w+)\((\d+)\)/);

                if (matches) {
                  const OFFSET_KEY = matches[2]; //

                  //  console.log("OFFSET_KEY",OFFSET_KEY)
                  //  console.log("OFFSET_KEY",parseInt(OFFSET_KEY)+1)

                  const viewSourceValue =
                    get_view_data[
                      get_view_data.length - (parseInt(OFFSET_KEY) + 1)
                    ];

                  // console.log("viewSourceValue",viewSourceValue); // This will output: 'close(1)'
                  // console.log("matches[1]",matches[1]); // This will output: 'close(1)'

                  let sourceVal;
                  if (matches[1] == "close") {
                    sourceVal = get_view_data.map((item) => item.close);
                  } else if (matches[1] == "open") {
                    sourceVal = get_view_data.map((item) => item.open);
                  } else if (matches[1] == "low") {
                    sourceVal = get_view_data.map((item) => item.low);
                  } else if (matches[1] == "high") {
                    sourceVal = get_view_data.map((item) => item.high);
                  } else if (matches[1] == "ema") {
                    sourceVal = ema;
                  }

                  checkData[matches[1]] = sourceVal;
                } else {
                  console.log("No match found");
                }
              }
            }
          }

          //console.log("checkData - ",checkData)
          //console.log("val.condition - ",val.condition)

          const conditionString =
            "(data.close[0] >= data.low[1] || data.high[0] < data.low[2]) && data.close[1] < data.high[2]";

          const conditiostring1 =
            "(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]<data.high[2]";

          //  console.log("symbol_name",val.symbol_name)
          abc(checkData, val.condition);
        } else {
          console.log("Collection does not exist.");
        }
      }
    }
    return res.send("okk");
  });

  const abc = (data, conditionString) => {
    console.log("data - ", data);
    console.log("conditionString - ", conditionString);
    try {
      // Use eval to dynamically evaluate the condition string
      const condition = eval(conditionString);

      // Check if the condition is true or false based on the data
      if (condition) {
        // Your code for when the condition is true
      
      } else {
        // Your code for when the condition is false
        console.log("Condition is false");
      }
    } catch (error) {
      console.log("Error in evaluating the condition:", error);
    }
  };

  app.post("/make_startegy", async function (req, res) {
    return;

    let user_id = req.body.user_id;
    let tokensymbol = req.body.tokensymbol;
    let symbol_name = req.body.symbol_name;
    let strategy_name = req.body.strategy_name;
    let segment = req.body.segment;
    let strike_price = req.body.strike_price;
    let option_type = req.body.option_type;
    let expiry = req.body.expiry;
    let timeframe = req.body.timeframe;
    let indicator = req.body.indicator;
    let price_source = req.body.price_source;
    let period = req.body.period;
    let inside_indicator = req.body.inside_indicator;
    let condition = req.body.condition;
    let buffer_value = req.body.buffer_value;
    let type = req.body.type;
    let offset = req.body.offset;
    let condition_source = req.body.condition_source;

    console.log("1");

    // Add Strategy User..
    try {
      console.log("2");
      await UserMakeStrategy.create({
        user_id: user_id,
        tokensymbol: tokensymbol,
        symbol_name: symbol_name,
        strategy_name: strategy_name,
        segment: segment,
        strike_price: strike_price,
        option_type: option_type,
        expiry: expiry,
        timeframe: timeframe,
        indicator: indicator,
        price_source: price_source,
        period: period,
        inside_indicator: inside_indicator,
        condition: condition,
        buffer_value: buffer_value,
        type: type,
        offset: offset,
        condition_source: condition_source,
      })
        .then(async (createUserMakeStrategy) => {
          console.log("3");
          return res.send({
            status: true,
            msg: "successfully Add!",
            data: createUserMakeStrategy,
          });
          return;
          const last_insert_id = createUserMakeStrategy._id;
          const user_id = createUserMakeStrategy.user_id;
          const tokensymbol = createUserMakeStrategy.tokensymbol;
          const timeframe = createUserMakeStrategy.timeframe;
          const indicator = createUserMakeStrategy.indicator;
          const price_source = createUserMakeStrategy.price_source;
          const period = createUserMakeStrategy.period;
          const inside_indicator = createUserMakeStrategy.inside_indicator;
          const condition = createUserMakeStrategy.condition;
          const buffer_value = createUserMakeStrategy.buffer_value;
          const type = createUserMakeStrategy.type;
          const offset = createUserMakeStrategy.offset;

          const fetch_view_collection = "M" + timeframe + "_" + tokensymbol;

          const viewPipeline = [
            {
              $lookup: {
                from: fetch_view_collection, // The name of the 'orders' collection
                localField: "M3_40089", // Field in the 'customers' collection
                foreignField: "M3_40089", // Field in the 'orders' collection
                as: "fetch_view_collection", // Alias for the joined data
              },
            },

            {
              $group: {
                _id: user_id,

                // sma: {
                //  $avg: '$user_id',
                // },
              },
            },
          ];

          const db = client.db(process.env.DB_NAME);
          // Create or replace the view
          await db.createCollection("buy_view", {
            viewOn: "usermakestrategies",
            pipeline: viewPipeline,
          });

          console.log("SMA view created or updated.");
        })
        .catch((err) => {
          console.log("4");
          console.log("Error creating and saving user:", err);
          return res.send({ status: false, msg: err.message });
        });
    } catch (error) {
      console.log("5", error);
    }

    return;

    let collectionName = "M" + timeframe + "_" + tokensymbol;

    //  const collection = db.collection(collectionName);

    return res.send("okkk");
    return;

    let incule_field = "";
    if (price_source == "open") {
      incule_field = {
        open: 1, // Include field1
      };
    } else if (price_source == "close") {
      incule_field = {
        close: 1, // Include field1
      };
    } else if (price_source == "high") {
      incule_field = {
        high: 1, // Include field1
      };
    } else if (price_source == "low") {
      incule_field = {
        low: 1, // Include field1
      };
    }

    const projection = incule_field;

    const pipeline = [{ $project: projection }, { $sort: { _id: 1 } }];

    const get_view_data = await collection.aggregate(pipeline).toArray();
    // console.log('Data with selected fields:', get_view_data);
    let get_final_data = "";
    if (price_source == "open") {
      get_final_data = get_view_data.map((item) => item.open);
    } else if (price_source == "close") {
      get_final_data = get_view_data.map((item) => item.close);
    } else if (price_source == "high") {
      get_final_data = get_view_data.map((item) => item.high);
    } else if (price_source == "low") {
      get_final_data = get_view_data.map((item) => item.low);
    }

    let averageData = "";

    if (indicator == "MA") {
      const MovingAverages = require("moving-averages");
      const MADATA = MovingAverages.ma(get_final_data, period);
      if (inside_indicator == "EMA") {
        averageData = MovingAverages.ema(MADATA, period);
      } else if (inside_indicator == "DMA") {
        averageData = MovingAverages.dma(MADATA, period);
      } else if (inside_indicator == "SMA") {
        averageData = MovingAverages.sma(MADATA, period);
      } else if (inside_indicator == "WMA") {
        averageData = MovingAverages.wma(MADATA, period);
      }
    }

    return res.send(averageData);
  });

  app.get("/crossover", function (req, res) {
    // Function to calculate the Simple Moving Average (SMA) of prices
    function calculateSMA(prices, period) {
      if (prices.length < period) {
        throw new Error("Not enough data points to calculate SMA.");
      }

      const smaValues = [];
      for (let i = period - 1; i < prices.length; i++) {
        const sum = prices
          .slice(i - period + 1, i + 1)
          .reduce((a, b) => a + b, 0);
        const sma = sum / period;
        smaValues.push(sma);
      }

      return smaValues;
    }

    // Function to implement a basic crossover strategy
    function crossoverStrategy(shortSMA, longSMA) {
      const signals = [];

      for (let i = 1; i < shortSMA.length; i++) {
        if (shortSMA[i] > longSMA[i] && shortSMA[i - 1] <= longSMA[i - 1]) {
          signals.push({ action: "Buy", dateIndex: i });
        } else if (
          shortSMA[i] < longSMA[i] &&
          shortSMA[i - 1] >= longSMA[i - 1]
        ) {
          signals.push({ action: "Sell", dateIndex: i });
        }
      }

      return signals;
    }

    // Example usage
    const historicalPrices = [50, 25, 105, 45, 60, 98, 60, 33, 60, 97]; // Replace with your price data
    const shortPeriod = 3; // Adjust the short-term SMA period
    const longPeriod = 8; // Adjust the long-term SMA period

    // Calculate the short and long SMAs
    const shortSMA = calculateSMA(historicalPrices, shortPeriod);
    const longSMA = calculateSMA(historicalPrices, longPeriod);

    console.log("shortSMA:", shortSMA);
    console.log("longSMA:", longSMA);

    // Generate buy/sell signals based on crossovers
    const signals = crossoverStrategy(shortSMA, longSMA);

    // Display the signals
    console.log("Buy/Sell Signals:", signals);
    for (const signal of signals) {
      console.log(
        `${signal.action} at Date Index ${signal.dateIndex}: Price = ${
          historicalPrices[signal.dateIndex]
        }`
      );
    }

    return res.send("OK");
  });

  //Add stoch Api.....
  app.get("/addstock", async function (req, res) {
    const pipeline = [
      {
        $project: {
          // Include fields from the original collection
          segment: 1,
        },
      },
    ];

    const categoryResult = await categorie.aggregate(pipeline);

    var axios = require("axios");
    var config = {
      method: "get",
      url: "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json",
    };

    axios(config).then(async function (response) {
      // res.send(response.data);
      // Using a loop to extract 'name' and 'instrumenttype'

      var unique_key = [];
      let count = 0;
      await response.data.forEach(async (item) => {
        if (
          item.instrumenttype == "FUTSTK" ||
          item.instrumenttype == "FUTIDX" ||
          item.instrumenttype == "FUTCUR" ||
          item.instrumenttype == "FUTCOM" ||
          item.instrumenttype == "OPTSTK" ||
          item.instrumenttype == "OPTIDX" ||
          item.instrumenttype == "OPTCUR" ||
          item.instrumenttype == "OPTFUT" ||
          item.instrumenttype == ""
        ) {
          if (item.instrumenttype == "" && item.exch_seg == "BSE") {
            count++;
            //  console.log('item - CO ' + count + ' ', item)
            const matchingElements = categoryResult.filter(
              (item) => item.segment === "BC"
            );
            const category_id = matchingElements[0]._id;

            // console.log('category_id ',category_id)

            await services
              .create({
                name: item.name,
                instrument_token: item.token,
                zebu_token: item.symbol,
                kotak_token: "",
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                lotsize: item.lotsize,
                categorie_id: category_id,
                unique_column: item.name + "_" + category_id,
              })
              .then((createdServices) => {
                console.log("User created and saved:", createdServices._id);
              })
              .catch((err) => {
                try {
                  console.log("Error creating and saving user:", err);
                } catch (e) {
                  ;
                }
              });
          }

          if (!unique_key.includes(`${item.name}-${item.instrumenttype}`)) {
            unique_key.push(`${item.name}-${item.instrumenttype}`);

            if (item.symbol.slice(-3) == "-EQ") {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "C"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name + "#",
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "#_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    console.log("Error creating and saving user:", err);
                  } catch (e) {
                    ;
                  }
                });
            }

            if (
              item.instrumenttype == "FUTSTK" ||
              item.instrumenttype == "FUTIDX"
            ) {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "F"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    // console.log('Error creating and saving user:', err);
                  } catch (e) {
                    
                  }
                });
            }

            if (
              item.instrumenttype == "OPTSTK" ||
              item.instrumenttype == "OPTIDX"
            ) {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "O"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    // console.log('Error creating and saving user:', err);
                  } catch (e) {
                    
                  }
                });
            }

            if (item.instrumenttype == "OPTFUT") {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "MO"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    // console.log('Error creating and saving user:', err);
                  } catch (e) {
                    
                  }
                });
            }

            if (item.instrumenttype == "FUTCOM") {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "MF"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {})
                .catch((err) => {
                  try {
                  } catch (e) {}
                });
            }

            if (item.instrumenttype == "FUTCUR") {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "CF"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    // console.log('Error creating and saving user:', err);
                  } catch (e) {
                    
                  }
                });
            }

            if (item.instrumenttype == "OPTCUR" && item.exch_seg == "CDS") {
              count++;

              const matchingElements = categoryResult.filter(
                (item) => item.segment === "CO"
              );
              const category_id = matchingElements[0]._id;

              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    // console.log('Error creating and saving user:', err);
                  } catch (e) {
                    
                  }
                });
            }

            if (item.instrumenttype == "FUTSTK" && item.exch_seg == "BFO") {
              count++;
              // console.log('item - CO ' + count + ' ', item)
              const matchingElements = categoryResult.filter(
                (item) => item.segment === "BO"
              );
              const category_id = matchingElements[0]._id;

              await services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: category_id,
                  unique_column: item.name + "_" + category_id,
                })
                .then((createdServices) => {
                  // console.log('User created and saved:', createdServices._id)
                })
                .catch((err) => {
                  try {
                    // console.log('Error creating and saving user:', err);
                  } catch (e) {
                    
                  }
                });
            }

            // else if (item.instrumenttype == 'FUTIDX' && item.exch_seg=="BFO") {
            //   count++
            //   // console.log('item - CO ' + count + ' ', item)
            //   const matchingElements = categoryResult.filter(item => item.segment === "BO");
            //   const category_id = matchingElements[0]._id

            //   await services.create({
            //     name: item.name,
            //     instrument_token: item.token,
            //     zebu_token: item.symbol,
            //     kotak_token: "",
            //     instrumenttype: item.instrumenttype,
            //     exch_seg: item.exch_seg,
            //     lotsize: item.lotsize,
            //     categorie_id: category_id,
            //     unique_column: item.name + '_' + category_id
            //   })
            //     .then((createdServices) => {
            //       console.log('User created and saved:', createdServices._id)
            //     })
            //     .catch((err) => {
            //       try {
            //         console.log('Error creating and saving user:', err);
            //       } catch (e) {
         
            //       }

            //     });

            // }

            if (
              item.instrumenttype == "AMXIDX" ||
              item.instrumenttype == "OPTIRC" ||
              item.instrumenttype == "UNDIRC" ||
              item.instrumenttype == "FUTIRC" ||
              item.instrumenttype == "UNDCUR" ||
              item.instrumenttype == "INDEX" ||
              item.instrumenttype == "COMDTY" ||
              item.instrumenttype == "AUCSO"
            ) {
              count++;
              // console.log('item - OTHER CONTENT '+count+' ',item)
              // const matchingElements = categoryResult.filter(item => item.segment === "C");
              // const category_id = matchingElements[0]._id
              services
                .create({
                  name: item.name,
                  instrument_token: item.token,
                  zebu_token: item.symbol,
                  kotak_token: "",
                  instrumenttype: item.instrumenttype,
                  exch_seg: item.exch_seg,
                  lotsize: item.lotsize,
                  categorie_id: "",
                  unique_column: item.name + "_" + "c9dbdc14a9fefd971c979",
                })
                .then((createdServices) => {
                  console.log("User created and saved:", createdServices._id);
                })
                .catch((err) => {
                  try {
                    console.log("Error creating and saving user:", err);
                  } catch (e) {
                    ;
                  }
                });
            }
          }
        }
      });

      return res.send("okkkkkk");
    });

    //////// super trend logicc////////

    // const calculateATR = (data, period) => {
    //   // Calculate Average True Range (ATR)
    //   let atr = [];

    //   for (let i = 1; i < data.length; i++) {
    //     const high = data[i].high;
    //     const low = data[i].low;
    //     const prevClose = data[i - 1].close;

    //     const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    //     atr.push(tr);
    //   }

    //   // Calculate the average ATR
    //   const atrSum = atr.slice(0, period).reduce((acc, val) => acc + val, 0);
    //   return atrSum / period;
    // };

    // const calculateSuperTrend = (data, atrPeriod, multiplier) => {
    //   let superTrend = [];

    //   for (let i = atrPeriod; i < data.length; i++) {
    //     const prevSuperTrend = superTrend[i - 1] || 0;
    //     const atr = calculateATR(data.slice(i - atrPeriod, i), atrPeriod);

    //     const upperBand = (data[i].high + data[i].low - multiplier * atr);
    //     const lowerBand = (data[i].high + data[i].low - multiplier * atr);

    //     const close = data[i].close;

    //     if (close <= upperBand) {
    //       superTrend.push(upperBand);
    //     } else if (close >= lowerBand) {
    //       superTrend.push(lowerBand);
    //     } else {
    //       superTrend.push(prevSuperTrend);
    //     }
    //   }

    //   return superTrend;
    // };

    // // Sample data (replace with your own dataset)
    // const historicalData = [
    //   { high: 150, low: 140, close: 145 },
    //   { high: 155, low: 145, close: 150 },
    //   // Add more data points
    // ];

    // const atrPeriod = 14; // ATR period
    // const multiplier = 3; // Multiplier value

    // const superTrendValues = calculateSuperTrend(historicalData, atrPeriod, multiplier);

    // // Calculate the average Super Trend
    // const averageSuperTrend = superTrendValues.reduce((acc, val) => acc + val, 0) / superTrendValues.length;

    // console.log('Super Trend Values:', superTrendValues);
    // console.log('Average Super Trend:', averageSuperTrend);

    ////////// END SUper Trend logic///
  });

  app.post("/api/test", async (req, res) => {
    const async = require("async");
    //  console.log(Date.getTime())
    //  return
    const pipeline = [{ $sort: { createdAt: 1 } }, { $limit: 1000 }];

    const result = await Alice_token.aggregate(pipeline);
    // console.log("result",result)

    const usersData = [
      { id: 1, name: "Object 1" },
      { id: 2, name: "Object 2" },
      // Add more objects here...
    ];

    // Sample data (100,000 objects)
    const objects = [];
    for (let i = 1; i <= result.length; i++) {
      objects.push({ _id: i, symbol: `Object ${i}` });
    }

    // Function to perform a task on an object (Simulated asynchronous task)
    function performTaskForObject(obj, callback) {
      setTimeout(() => {
        console.log(`Task perform Time ${performance.now()} : ${obj.symbol}`);
        callback(null, obj);
      }, 0); // Simulating a very short delay
    }

    // Use the async library to process all objects in parallel
    async.eachLimit(objects, 1, performTaskForObject, (err) => {
      if (err) {
        console.log("Error:", err);
      } else {
        console.log("All tasks completed");
      }
    });
    return res.send("okk");

    return;

    // const cluster = require('cluster');
    // const http = require('http');
    // const numCPUs = require('os').cpus().length;

    // // Sample data
    // const objects = [
    //   { id: 1, name: "Object 1" },
    //   { id: 2, name: "Object 2" },
    //   // Add more objects here...
    // ];

    // if (cluster.isMaster) {
    //   // Fork workers for each CPU core
    //   for (let i = 0; i < numCPUs; i++) {
    //     cluster.fork();
    //   }

    //   cluster.on('exit', (worker, code, signal) => {
    //     console.log(`Worker ${worker.process.pid} died`);
    //   });

    //   // Aggregate results from workers
    //   const aggregatedResults = [];

    //   cluster.on('message', (worker, message) => {
    //     aggregatedResults.push(...message);

    //     if (aggregatedResults.length === objects.length) {
    //       console.log("All tasks completed:", aggregatedResults);
    //       // Here you can process the aggregated results as needed
    //       // For example, send them as a response to a client
    //     }
    //   });
    // } else {
    //   // This is the worker process
    //   const workerId = cluster.worker.id;
    //   const workerResults = [];

    //   // Distribute objects among worker processes
    //   for (let i = workerId - 1; i < objects.length; i += numCPUs) {
    //     const obj = objects[i];
    //     // Simulate an asynchronous task
    //     const result = await performTaskForObject(obj);
    //     workerResults.push(result);
    //   }

    //   // Send the worker's results back to the master process
    //   process.send(workerResults);

    //   process.exit(0);
    // }

    // // Sample function to perform a task on an object
    // async function performTaskForObject(obj) {
    //   // Simulate an asynchronous task
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       console.log(`Task performed on object: ${obj.id}`);
    //       resolve(obj);
    //     }, 1000); // Simulating a delay of 1 second
    //   });
    // }

    return res.send("okkk");
  });

  app.get("/getip", (req, res) => {
    const os = require("os");

    // Get network interfaces
    const networkInterfaces = os.networkInterfaces();

    // Iterate through network interfaces and display IP addresses
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      const interfaces = networkInterfaces[interfaceName];
      interfaces.forEach((iface) => {
        if (iface.family === "IPv4") {
          console.log(`IPv4 Address (${interfaceName}): ${iface.address}`);
        }
        if (iface.family === "IPv6") {
          console.log(`IPv6 Address (${interfaceName}): ${iface.address}`);
        }
      });
    });

    return res.send("okk");
  });

  app.get("/tt", async (req, res) => {
    let price = "19300";
    let symbol = "NIFTY";
    let expiry = "26102023";
    let limit_set = 40;

    const pipeline2 = [
      {
        $match: {
          $or: [
            {
              $and: [
                { strike: { $lt: price } },
                { segment: "O" },
                { symbol: symbol },
                { expiry: expiry },
              ],
            },
            {
              $and: [{ strike: price }, { symbol: symbol }, { expiry: expiry }],
            },
            {
              $and: [
                { strike: { $gt: price } },
                { symbol: symbol },
                { expiry: expiry },
              ],
            },
          ],
        },
      },
      {
        $sort: {
          strike: 1,
        },
      },
      {
        $limit: limit_set,
      },
      {
        $project: {
          _id: 0,
          strike: 1,
          option_type: 1,
          exch_seg: 1,
          instrument_token: 1,
          // option_type: 1
        },
      },
    ];

    const pipeline3 = [
      {
        $match: {
          $or: [
            {
              strike: { $lt: price },
              segment: "O",
              symbol: symbol,
              expiry: expiry,
            },
            {
              strike: price,
              segment: "O",
              symbol: symbol,
              expiry: expiry,
            },
            {
              strike: { $gt: price },
              segment: "O",
              symbol: symbol,
              expiry: expiry,
            },
          ],
        },
      },
      {
        $sort: {
          strike: 1,
        },
      },
      {
        $limit: limit_set,
      },
      {
        $group: {
          _id: "$strike",
          symbol: { $first: "$symbol" },
          expiry: { $first: "$expiry" },
          instrument_token: { $first: "$instrument_token" },
          option_type: { $first: "$option_type" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          strike: "$_id",
        },
      },
    ];

    const result = await Alice_token.aggregate(pipeline2);

    const resultStrike = await Alice_token.aggregate(pipeline3);

    const final_data = [];
    var channelstr = "";
    if (result.length > 0) {
      resultStrike.forEach((element) => {
        let call_token = "";
        let put_token = "";
        result.forEach((element1) => {
          if (element.strike == element1.strike) {
            if (element1.option_type == "CE") {
              call_token = element1.instrument_token;
            } else if (element1.option_type == "PE") {
              put_token = element1.instrument_token;
            }

            channelstr +=
              element1.exch_seg + "|" + element1.instrument_token + "#";
          }
        });

        const push_object = {
          symbol: element.symbol,
          strike_price: element.strike,
          call_token: call_token,
          put_token: put_token,
          expiry: element.expiry,
        };

        final_data.push(push_object);
      });
      var alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
      return res.send({
        status: true,
        data: final_data,
        channellist: alltokenchannellist,
      });
    } else {
      return res.send({ status: false, data: [], channellist: "" });
    }
  });

  app.get("/stockPriceupdate", async (req, res) => {
    var axios = require("axios");
    const Papa = require("papaparse");
    const csvFilePath =
      "https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv";
    const { data } = await axios.get(csvFilePath);

    Papa.parse(data, {
      complete: async (result) => {
        let sheet_Data = result.data;
        sheet_Data.forEach(async (element) => {
          let symbol = element.SYMBOL;

          if (symbol == "NIFTY_BANK") {
            symbol = "BANKNIFTY";
          } else if (symbol == "NIFTY_50") {
            symbol = "NIFTY";
          } else if (symbol == "NIFTY_FIN_SERVICE") {
            symbol = "FINNIFTY";
          }

          const filter = { symbol: symbol };
          const update = { $set: { price: element.CPrice } };

          await option_chain_symbols.updateOne(filter, update);
        });
      },
      header: true,
    });

    return res.send("okk");
  });

  app.get("/addstock1", async function (req, res) {
    try {
      const pipeline = [
        {
          $project: {
            segment: 1,
          },
        },
      ];
  
      const categoryResult = await categorie.aggregate(pipeline);
  
      var axios = require("axios");
      var config = {
        method: "get",
        url: "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json",
      };
  
      const response = await axios(config);
      const unique_key = [];
      let count = 0;
  
      for (const item of response.data) {
        if (
          [
            "FUTSTK",
            "FUTIDX",
            "FUTCUR",
            "FUTCOM",
            "OPTSTK",
            "OPTIDX",
            "OPTCUR",
            "OPTFUT",
            "",
          ].includes(item.instrumenttype)
        ) {
          let category_id;
  
          if (item.instrumenttype === "" && item.exch_seg === "BSE") {
            if (item.symbol.slice(-3) === "-EQ") {
              count++;
              category_id = getCategoryId(categoryResult, "BC");
  
              await createService(item, category_id, "#");
            }



        

          }
  
          if (!unique_key.includes(`${item.name}-${item.instrumenttype}`)) {
            unique_key.push(`${item.name}-${item.instrumenttype}`);
  
            if (item.symbol.slice(-3) === "-EQ") {
              count++;
              category_id = getCategoryId(categoryResult, "C");
  
              await createService(item, category_id, "#");
            }
  
            if (["FUTSTK", "FUTIDX"].includes(item.instrumenttype)) {
              count++;
              category_id = getCategoryId(categoryResult, "F");
  
              await createService(item, category_id);
            }
  
            if (["OPTSTK", "OPTIDX"].includes(item.instrumenttype)) {
              count++;
              category_id = getCategoryId(categoryResult, "O");
  
              await createService(item, category_id);
            }
  
            if (item.instrumenttype === "OPTFUT") {
              count++;
              category_id = getCategoryId(categoryResult, "MO");
  
              await createService(item, category_id);
            }
  
            if (item.instrumenttype === "FUTCOM") {
              count++;
              category_id = getCategoryId(categoryResult, "MF");
  
              await createService(item, category_id);
            }
  
            if (item.instrumenttype === "FUTCUR") {
              count++;
              category_id = getCategoryId(categoryResult, "CF");
  
              await createService(item, category_id);
            }
  
            if (item.instrumenttype === "OPTCUR" && item.exch_seg === "CDS") {
              count++;
              category_id = getCategoryId(categoryResult, "CO");
  
              await createService(item, category_id);
            }
  
            if (item.instrumenttype === "FUTSTK" && item.exch_seg === "BFO") {
              count++;
              category_id = getCategoryId(categoryResult, "BO");
  
              await createService(item, category_id);
            }
  
            if (
              [
                "AMXIDX",
                "OPTIRC",
                "UNDIRC",
                "FUTIRC",
                "UNDCUR",
                "INDEX",
                "COMDTY",
                "AUCSO",
              ].includes(item.instrumenttype)
            ) {
              count++;
              category_id = "c9dbdc14a9fefd971c979"; // Placeholder category_id
  
              await createService(item, category_id);
            }
          }
        }
      }
  
      return res.send("okkkkkk");
    } catch (error) {
      console.error("Error processing stocks:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  
  function getCategoryId(categoryResult, segment) {
    const match = categoryResult.find((item) => item.segment === segment);
    return match ? match._id : null;
  }
  
  async function createService(item, category_id, suffix = "") {
    try {
      await services.create({
        name: item.name + suffix,
        instrument_token: item.token,
        zebu_token: item.symbol,
        kotak_token: "",
        instrumenttype: item.instrumenttype,
        exch_seg: item.exch_seg,
        lotsize: item.lotsize,
        categorie_id: category_id,
        unique_column: `${item.name}${suffix}_${category_id}`,
      });
    } catch (err) {
      console.error("Error creating service:", err);
    }
  }


  async function setupChangeStream() {
    //  console.log("runnn trigers")
    return;
    try {
      const collection = dbTest.collection("mainsignals");

      // Set up a change stream on the collection
      const changeStream = collection.watch();

      // Listen for changes
      changeStream.on("change", (change) => {
        console.log("change ", change);
        // Check the type of change and perform actions accordingly
        if (change.operationType === "insert") {
          const insertedDocument = change.fullDocument;
          // Perform actions for insert
          console.log("Document inserted:", insertedDocument);
        } else if (change.operationType === "update") {
          const updatedDocument = change.fullDocument;
          // Perform actions for update
          console.log("Document updated:", updatedDocument);
        }
        // Add conditions or additional checks as needed
      });
    } finally {
      // Ensure the client is closed when you finish
      await client.close();
    }
  }


};


