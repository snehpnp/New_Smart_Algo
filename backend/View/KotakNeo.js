const db = require('../App/Models');
const dbTest = db.dbTest;

async function createViewKotakNeo() {
  try {

    const views = await dbTest.listCollections({ name: 'kotakneoView' }).toArray();

    if (views.length > 0) {
      return;
    } else {
      const pipeline = [
        {
          $match: {
            broker: "7",
            TradingStatus: 'on',// Condition from the user collection
            $or: [
              { EndDate: { $gte: new Date() } }, // EndDate is today or in the future
              { EndDate: null } // EndDate is not set
            ]
          }
        },
        {
          $lookup: {
            from: 'client_services',
            localField: '_id', // Field from the user collection to match
            foreignField: 'user_id', // Field from the client_services collection to match
            as: 'client_services'
          }
        },
        {
          $unwind: '$client_services',
        },
        {
          $match: {
            'client_services.active_status': '1'
          }
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
          $unwind: '$service',
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
          $unwind: '$category',
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
          $unwind: '$strategys',
        },
        {
          $project: {
            "client_services": 1,
            'service.name': 1,
            'service.instrument_token': 1,
            'service.exch_seg': 1,
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
            oneTimeToken: 1
          }
        },
        {
          $addFields: {
            postdata: {
              am: "NO",
              dq: "0",
      
              es: {
                $cond: {
                  if: { $eq: ["$category.segment", "C"] },
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
                              else: {
                                $cond: {
                                  if: {
                                    $or: [
                                      { $eq: ["$category.segment", "BF"] },
                                      { $eq: ["$category.segment", "BC"] },
                                      { $eq: ["$category.segment", "BO"] },
                                      { $eq: ["$category.segment", "BFO"] }
      
                                    ],
                                  },
                                  then: {
                                    $cond: {
                                      if: { $eq: ["$category.segment", "BF"] },
                                      then: "bse_fo",
                                      else: {
                                        $cond: {
                                          if: { $eq: ["$category.segment", "BC"] },
                                          then: "bse_cm",
                                          else: "bse_fo",
                                        },
                                      },
                                    },
                                  },
                                  else: "nse_fo",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
      
              mp: "0",
      
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
                          { $eq: ["$category.segment", "BO"] },
                          { $eq: ["$category.segment", "BF"] },
                        ],
                      },
                    ],
                  },
                  then: "NRML",
                  else: {
                    $cond: {
                      if: { $eq: ["$client_services.product_type", "2"] },
                      then: "MIS",
                      else: {
                        $cond: {
                          if: { $eq: ["$client_services.product_type", "3"] },
                          then: "BO",
                          else: {
                            $cond: {
                              if: { $eq: ["$client_services.product_type", "4"] },
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
                  if: { $eq: ["$client_services.order_type", "1"] },
                  then: "MKT",
                  else: {
                    $cond: {
                      if: { $eq: ["$client_services.order_type", "2"] },
                      then: "L",
                      else: {
                        $cond: {
                          if: { $eq: ["$client_services.order_type", "3"] },
                          then: "SL",
                          else: {
                            $cond: {
                              if: { $eq: ["$client_services.order_type", "4"] },
                              then: "SL-M",
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
                  if: { $eq: ["$category.segment", "C"] },
                  then: "$service.zebu_token",
                  else: "",
                },
              },
      
              tt: "B",
            },
          },
        },
      ];

      await dbTest.createCollection('kotakneoView', { viewOn: 'users', pipeline });

      console.log('kotakneo View  created successfully.');
      return
    }


  } catch (error) {
    return
  } 
}

// Delete View
async function deleteViewKotakNeo() {
  try {
    await dbTest.collection('kotakneoView').drop();
    console.log('kotakneo View  deleted successfully.');
  } catch (error) {
    return
  }
}


module.exports = { createViewKotakNeo,deleteViewKotakNeo }

