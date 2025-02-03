const db = require('../App/Models');
const dbTest = db.dbTest;

async function createViewChoice() {

  try {
  
    const views = await dbTest.listCollections({ name: 'choiceView' }).toArray();

    if (views.length > 0) {
      console.log('View already exists.');
      return; 
    }else{
      
    const currentDate = new Date(); 

    // Define the pipeline to create the view
    const pipeline = [
        {
          $match: {
            broker: "28",
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
          },
        },
        {
          $addFields: {
            postdata: {
              SegmentId: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ["$category.segment", "C"] },
                      { $eq: ["$category.segment", "c"] },
                    ],
                  },
                  then: 1,
                  else: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ["$category.segment", "F"] },
                          { $eq: ["$category.segment", "f"] },
                          { $eq: ["$category.segment", "O"] },
                          { $eq: ["$category.segment", "o"] },
                          { $eq: ["$category.segment", "FO"] },
                          { $eq: ["$category.segment", "fo"] },
                        ],
                      },
                      then: 2,
                      else: {
                        $cond: {
                          if: {
                            $or: [
                              { $eq: ["$category.segment", "MF"] },
                              { $eq: ["$category.segment", "mf"] },
                              { $eq: ["$category.segment", "MO"] },
                              { $eq: ["$category.segment", "mo"] },
                            ],
                          },
                          then: 5,
                          else: {
                            $cond: {
                              if: {
                                $or: [
                                  { $eq: ["$category.segment", "CF"] },
                                  { $eq: ["$category.segment", "cf"] },
                                  { $eq: ["$category.segment", "CO"] },
                                  { $eq: ["$category.segment", "co"] },
                                ],
                              },
                              then: 13,
                              else: 0, // Default value agar koi condition match nahi hoti
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              Token: {
                $cond: {
                  if: {
                    $and: [{ $eq: ["$category.segment", "C"] }],
                  },
                  then: "$service.instrument_token",
                  else: "",
                },
              },
              OrderType: {
                $cond: {
                  if: {
                    $and: [{ $eq: ["$client_services.order_type", "1"] }],
                  },
                  then: "RL_MKT",
                  else: {
                    $cond: {
                      if: {
                        $and: [{ $eq: ["$client_services.order_type", "2"] }],
                      },
                      then: "RL_LIMIT",
                      else: {
                        $cond: {
                          if: {
                            $and: [{ $eq: ["$client_services.order_type", "3"] }],
                          },
                          then: "SL_LIMIT",
                          else: {
                            $cond: {
                              if: {
                                $and: [{ $eq: ["$client_services.order_type", "4"] }],
                              },
                              then: "SL_MKT",
      
                              //All condition exist
                              else: "RL_MKT",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              BS: "",
              Qty: "$client_services.quantity",
              DisclosedQty: 0,
              Price: 0,
              TriggerPrice: 0,
              Validity: 1,
              ProductType: {
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
                  then: "D",
                  else: {
                    $cond: {
                      if: {
                        $and: [{ $eq: ["$client_services.product_type", "2"] }],
                      },
                      then: "M",
                      else: {
                        $cond: {
                          if: {
                            $and: [{ $eq: ["$client_services.product_type", "3"] }],
                          },
                          then: "BO",
                          else: {
                            $cond: {
                              if: {
                                $and: [
                                  { $eq: ["$client_services.product_type", "4"] },
                                ],
                              },
                              then: "M",
                              else: "D",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              IsEdisReq: true,
            },
          },
        },
      ];

    // Create the view
    await dbTest.createCollection('choiceView', { viewOn: 'users', pipeline });

    console.log('Choice View created successfully.');
    return
    }


  } catch (error) {
  return;
  } 
}
async function dropViewChoice() {
  try {
    await dbTest.dropCollection('choiceView');
    console.log('choiceView View dropped successfully.');
  } catch (error) {
    return;
  }
}

module.exports = { createViewChoice ,dropViewChoice}

