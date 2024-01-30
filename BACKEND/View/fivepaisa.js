const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
const db = client.db(process.env.DB_NAME);

async function createViewFivepaisa() {


  // All Client Trading on view
  try {

    const currentDate = new Date(); // Get the current date and time

    // Define the pipeline to create the view
    const pipeline = [
      {
        $match: {
          broker: "14",
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

            head: {
              key: "$api_key",
            },
            body: {
              ClientCode: "$client_code",

              Exchange: {
                $cond: {
                  if: { $eq: ['$category.segment', 'C'] }, // Your condition here
                  then: 'N',
                  else: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ['$category.segment', 'F'] },
                          { $eq: ['$category.segment', 'O'] },
                          { $eq: ['$category.segment', 'FO'] }
                        ]
                      },
                      then: 'N',
                      else: {

                        $cond: {
                          if: {
                            $or: [
                              { $eq: ['$category.segment', 'MF'] },
                              { $eq: ['$category.segment', 'MO'] }
                            ]
                          },
                          then: 'M',
                          else: {

                            $cond: {
                              if: {
                                $or: [
                                  { $eq: ['$category.segment', 'CF'] },
                                  { $eq: ['$category.segment', 'CO'] }
                                ]
                              },
                              then: 'N',

                              // all not exist condition 
                              else: "N"

                            }

                          }

                        }


                      }

                    }

                  }

                }
              },


              ExchangeType: {
                $cond: {
                  if: { $eq: ['$category.segment', 'C'] }, // Your condition here
                  then: 'C',
                  else: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ['$category.segment', 'F'] },
                          { $eq: ['$category.segment', 'O'] },
                          { $eq: ['$category.segment', 'FO'] }
                        ]
                      },
                      then: 'D',
                      else: {

                        $cond: {
                          if: {
                            $or: [
                              { $eq: ['$category.segment', 'MF'] },
                              { $eq: ['$category.segment', 'MO'] }
                            ]
                          },
                          then: 'D',
                          else: {

                            $cond: {
                              if: {
                                $or: [
                                  { $eq: ['$category.segment', 'CF'] },
                                  { $eq: ['$category.segment', 'CO'] }
                                ]
                              },
                              then: 'U',

                              // all not exist condition 
                              else: "D"

                            }

                          }

                        }


                      }

                    }

                  }

                }
              },



              Qty: "$client_services.quantity",
              Price: "0",
              OrderType: "Buy",

              ScripCode: {
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


              IsIntraday: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.product_type', '2'] },
                      ]
                  },
                  then: true,
                  else: false,

                }
              },

              DisQty: 0,
              StopLossPrice: 0,
              IsStopLossOrder: false
            }

          }
        }
      }
    ];

    // Create the view
    await db.createCollection('fivepaisaView', { viewOn: 'users', pipeline });

    console.log('View created successfully.');
  } catch (error) {
    console.log('Error:', error);
  } finally {
    client.close();
  }
}


module.exports = { createViewFivepaisa }

