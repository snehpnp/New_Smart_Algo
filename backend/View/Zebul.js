const db = require('../App/Models');
const dbTest = db.dbTest;

async function createViewZebul() {
  try {
    const views = await dbTest.listCollections({ name: 'ZebulView' }).toArray();

    if (views.length > 0) {
      return;
    } else {
      const currentDate = new Date();
      const pipeline = [
        {
          $match: {
            broker: "5",
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

              uid: "$client_code",
              actid: "$client_code",
              tsym: "",

              qty: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ['$category.segment', 'MF'] },
                      { $eq: ['$category.segment', 'MO'] }
                    ]
                  },
                  then: "$client_services.lot_size",
                  else: "$client_services.quantity"

                }

              },

              mkt_protection: 'MKT',
              ret: 'DAY',


              prc: "0",
              trgprc: "0",
              dscqty: "0",

              // product code condition here
              prctyp: {
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
                  then: 'MKT',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.product_type', '2'] },
                          ]
                      },
                      then: 'LMT',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.product_type', '3'] },
                              ]
                          },
                          then: 'SL-LMT',
                          else: {
                            $cond: {
                              if: {
                                $and:
                                  [
                                    { $eq: ['$client_services.product_type', '4'] },
                                  ]
                              },
                              then: 'SL-MKT',
                              else: "MKT"

                            }

                          }

                        }

                      }

                    }
                  }

                }


              },

              // ordertype code condition here
              prd: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.order_type', '1'] },
                      ]
                  },
                  then: 'M',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.order_type', '2'] },
                          ]
                      },
                      then: 'I',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '3'] },
                              ]
                          },
                          then: 'B',
                          else: {
                            $cond: {
                              if: {
                                $and:
                                  [
                                    { $eq: ['$client_services.order_type', '4'] },
                                  ]
                              },
                              then: 'H',

                              else: "C"

                            }

                          }

                        }

                      }

                    }
                  }

                }

              },
              ordersource: 'WEB',


              // exchange condition here
              exch: {
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
              trantype: 'BUY',

            }
          }
        }
      ];

      // Create the view
      await dbTest.createCollection('ZebulView', { viewOn: 'users', pipeline });

      console.log('Zebul View created successfully.');
      return
    }


  } catch (error) {
    return
  } 
}

async function dropViewZebul() {
  try {
    await dbTest.dropCollection('ZebulView');
    console.log('Zebul View dropped successfully.');
  } catch (error) {
    return
  } 
}


module.exports = { createViewZebul,dropViewZebul }

