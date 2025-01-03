const db = require('../App/Models');
const dbTest = db.dbTest;

async function createViewDhan() {

  try {
    const views = await dbTest.listCollections({ name: 'dhanView' }).toArray();

    if (views.length > 0) {
      return;
    } else {
      const currentDate = new Date();

      const pipeline = [
        {
          $match: {
            broker: "20",
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
            web_url: 1
          }
        },
        {
          $addFields: {
            postdata:
            {


              dhanClientId: "$client_code",

              transactionType: "BUY",


              exchangeSegment: {
                $cond: {
                  if: { $eq: ['$category.segment', 'C'] }, // Your condition here
                  then: 'NSE_EQ',
                  else: {
                    $cond: {
                      if: {
                        $or: [
                          { $eq: ['$category.segment', 'F'] },
                          { $eq: ['$category.segment', 'O'] },
                          { $eq: ['$category.segment', 'FO'] }
                        ]
                      },
                      then: 'NSE_FNO',
                      else: {

                        $cond: {
                          if: {
                            $or: [
                              { $eq: ['$category.segment', 'MF'] },
                              { $eq: ['$category.segment', 'MO'] }
                            ]
                          },
                          then: 'MCX_COMM',
                          else: {

                            $cond: {
                              if: {
                                $or: [
                                  { $eq: ['$category.segment', 'CF'] },
                                  { $eq: ['$category.segment', 'CO'] }
                                ]
                              },
                              then: 'NSE_CURRENCY',

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


              productType: {
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
                  then: 'CNC',
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
                              then: 'CO',
                              else: "CNC"

                            }

                          }

                        }

                      }

                    }
                  }

                }


              },



              orderType: {
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
                          then: 'STOP_LOSS',
                          else: {
                            $cond: {
                              if: {
                                $and:
                                  [
                                    { $eq: ['$client_services.order_type', '4'] },
                                  ]
                              },
                              then: 'STOP_LOSS_MARKET',

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

              validity: "DAY",

              securityId: {
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

              quantity: { "$toInt": "$client_services.quantity" },
              price: 0,
              triggerPrice: 0,
              afterMarketOrder: false,
              amoTime: "OPEN",
              boProfitValue: 0,
              boStopLossValue: 0
            }
          }
        }
      ];

      await dbTest.createCollection('dhanView', { viewOn: 'users', pipeline });

      return
    }

  } catch (error) {
    return;
  } 
}

async function dropViewDhan() {
  try {
    await dbTest.dropCollection('dhanView');
    return
  } catch (error) {
    return;
  } 
}

module.exports = { createViewDhan ,dropViewDhan}

