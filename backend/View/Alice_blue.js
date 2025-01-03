const db = require('../App/Models');
const dbTest = db.dbTest;

async function createViewAlice() {
  try {
    
    const views = await dbTest.listCollections({ name: 'aliceblueView' }).toArray();

    if (views.length > 0) {
      console.log('View already exists.');
      return;
    }else{

      const currentDate = new Date();

      const pipeline = [
        {
          $match: {
            broker: "2",
            TradingStatus: 'on',
            $or: [
              { EndDate: { $gte: currentDate } },
              { EndDate: null }
            ]
          }
        },
        {
          $lookup: {
            from: 'client_services',
            localField: '_id',
            foreignField: 'user_id',
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
            postdata: {
              complexty: 'REGULAR',
              discqty: '0',
              exch: {
                $cond: {
                  if: { $eq: ['$category.segment', 'C'] },
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
                              else: "NFO"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              pCode: {
                $cond: {
                  if: {
                    $and: [
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
                  then: 'NRML',
                  else: {
                    $cond: {
                      if: { $eq: ['$client_services.product_type', '2'] },
                      then: 'MIS',
                      else: {
                        $cond: {
                          if: { $eq: ['$client_services.product_type', '3'] },
                          then: 'BO',
                          else: {
                            $cond: {
                              if: { $eq: ['$client_services.product_type', '4'] },
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
              prctyp: {
                $cond: {
                  if: { $eq: ['$client_services.order_type', '1'] },
                  then: 'MKT',
                  else: {
                    $cond: {
                      if: { $eq: ['$client_services.order_type', '2'] },
                      then: 'L',
                      else: {
                        $cond: {
                          if: { $eq: ['$client_services.order_type', '3'] },
                          then: 'SL',
                          else: {
                            $cond: {
                              if: { $eq: ['$client_services.order_type', '4'] },
                              then: 'SL-M',
                              else: "MKT"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              price: '0',
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
              ret: 'DAY',
              symbol_id: {
                $cond: {
                  if: { $eq: ['$category.segment', 'C'] },
                  then: "$service.instrument_token",
                  else: ""
                }
              },
              trading_symbol: {
                $cond: {
                  if: { $eq: ['$category.segment', 'C'] },
                  then: "$service.zebu_token",
                  else: ""
                }
              },
              transtype: 'BUY',
              trigPrice: '',
              orderTag: 'order1',
            }
          }
        }
      ];
  
      // Create the view
      await dbTest.createCollection('aliceblueView', { viewOn: 'users', pipeline });
  
      console.log('Alice View created successfully.');
    }

  } catch (error) {
   return;
  } 
}

async function dropViewAlice() {
  try {
    await dbTest.dropCollection('aliceblueView');
    console.log('Alice View dropped successfully.');
  } catch (error) {
    return;
  }
}

module.exports = { createViewAlice,dropViewAlice };
