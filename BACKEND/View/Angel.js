const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();

const db = client.db(process.env.DB_NAME);

async function createViewAngel() {


  // All Client Trading on view
  try {
    // Replace with your actual database name
    const currentDate = new Date(); // Get the current date and time

    // Define the pipeline to create the view
    const pipeline = [
      {
        $match: {
          broker: "12",
          TradingStatus: 'on',// Condition from the user collection
          $or: [
            { EndDate: { $gte: currentDate } }, // EndDate is today or in the future
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
          web_url: 1
        }
      },
      {
        $addFields: {
          postdata:
          {
            variety: 'NORMAL',

            // trading symbol condition here
            tradingsymbol: {
              $cond: {
                if: {
                  $and:
                    [
                      { $eq: ['$category.segment', 'C'] },
                    ]
                },
                then: "$service.zebu_token",
                else: ""

              }
            },


            // symbol token condition here
            symboltoken: {
              $cond: {
                if: {
                  $and:
                    [
                      { $eq: ['$category.segment', 'C'] },
                    ]
                },
                then: "$service.instrument_token",
                else: ""

              }
            },

            // transaction Type
            transactiontype: 'BUY',

            // exchange condition here
            exchange: {
              $cond: {
                if: { $eq: ['$category.segment', 'C'] }, // Your condition here
                then: 'NSE',
                else: {
                  $cond: {
                    if: {
                      $or: [
                        { $eq: ['$category.segment', 'F'] },
                        { $eq: ['$category.segment', 'O'] },
                        { $eq: ['$category.segment', 'FO'] }
                      ]
                    },
                    then: 'NFO',
                    else: {

                      $cond: {
                        if: {
                          $or: [
                            { $eq: ['$category.segment', 'MF'] },
                            { $eq: ['$category.segment', 'MO'] }
                          ]
                        },
                        then: 'MCX',
                        else: {

                          $cond: {
                            if: {
                              $or: [
                                { $eq: ['$category.segment', 'CF'] },
                                { $eq: ['$category.segment', 'CO'] }
                              ]
                            },
                            then: 'CDS',

                            // all not exist condition 
                            else: "NFO"

                          }

                        }

                      }


                    }

                  }

                }

              }
            },

            // ordertype code condition here
            ordertype: {
              $cond: {
                if: {
                  $and:
                    [
                      { $eq: ['$client_services.order_type', '1'] },
                    ]
                },
                then: 'MARKET',
                else: {
                  $cond: {
                    if: {
                      $and:
                        [
                          { $eq: ['$client_services.order_type', '2'] },
                        ]
                    },
                    then: 'LIMIT',
                    else: {
                      $cond: {
                        if: {
                          $and:
                            [
                              { $eq: ['$client_services.order_type', '3'] },
                            ]
                        },
                        then: 'STOPLOSS_LIMIT',
                        else: {
                          $cond: {
                            if: {
                              $and:
                                [
                                  { $eq: ['$client_services.order_type', '4'] },
                                ]
                            },
                            then: 'STOPLOSS_MARKET',

                            //All condition exist
                            else: "MARKET"

                          }

                        }

                      }

                    }

                  }
                }

              }

            },

            // product code condition here
            producttype: {
              $cond: {
                if: {
                  $and:
                    [
                      { $eq: ['$client_services.product_type', '1'] },
                      {
                        $or: [
                          { $eq: ['$category.segment', 'F'] },
                          { $eq: ['$category.segment', 'O'] },
                          { $eq: ['$category.segment', 'FO'] }
                        ]
                      },
                    ]
                },
                then: 'CARRYFORWARD',
                else: {
                  $cond: {
                    if: {
                      $and:
                        [
                          { $eq: ['$client_services.product_type', '2'] },
                        ]
                    },
                    then: 'INTRADAY',
                    else: {
                      $cond: {
                        if: {
                          $and:
                            [
                              { $eq: ['$client_services.product_type', '3'] },
                            ]
                        },
                        then: 'BO',
                        else: {
                          $cond: {
                            if: {
                              $and:
                                [
                                  { $eq: ['$client_services.product_type', '4'] },
                                ]
                            },
                            then: 'INTRADAY',
                            else: "DELIVERY"

                          }

                        }

                      }

                    }

                  }
                }

              }


            },

            // Duration
            duration: 'DAY',


            triggerprice: 0,
            price: 0,
            squareoff: 0,
            stoploss: 0,
            quantity: "$client_services.quantity",
            trailingStopLoss: '',

          }
        }
      }
    ];

    // Create the view
    await db.createCollection('angelView', { viewOn: 'users', pipeline });

    console.log('View created successfully.');
  } catch (error) {
    console.log('Error:', error);
  } finally {
    client.close();
  }
}


module.exports = { createViewAngel }

