const db = require('../App/Models');
const dbTest = db.dbTest;

async function createViewSwastika() {

  try {
    const views = await dbTest.listCollections({ name: 'swastikaView' }).toArray();

    if (views.length > 0) {
      return; 
    }else{

      const currentDate = new Date(); 
      const pipeline = [
        {
          $match: {
            broker: "21",
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
            web_url: 1
          }
        },
        {
          $addFields: {
            postdata:
            {
  
             
              Uid : "$client_code",
              Actid : "$client_code",
              Exch: {
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
              Tsym : "",
              Qty : "$client_services.quantity",
              Prc : "0",
              Trgprc : "0",
              Dscqty : "0",
              Prd: {
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
                  then: 'M',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.product_type', '2'] },
                          ]
                      },
                      then: 'I',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.product_type', '3'] },
                              ]
                          },
                          then: 'B',
                          else: {
                            $cond: {
                              if: {
                                $and:
                                  [
                                    { $eq: ['$client_services.product_type', '4'] },
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
              Trantype : "B",
  
              Prctyp: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.order_type', '1'] },
                      ]
                  },
                  then: 'MKT',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.order_type', '2'] },
                          ]
                      },
                      then: 'LMT',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '3'] },
                              ]
                          },
                          then: 'SL-LMT',
                          else: {
                            $cond: {
                              if: {
                                $and:
                                  [
                                    { $eq: ['$client_services.order_type', '4'] },
                                  ]
                              },
                              then: ' SL-MKT',
  
                              //All condition exist
                              else: "MKT"
  
                            }
  
                          }
  
                        }
  
                      }
  
                    }
                  }
  
                }
  
              },
  
              Ret : "DAY",
              Remarks:"QRSTP"
            }
          }
        }
      ];
     
  
      await dbTest.createCollection('swastikaView', { viewOn: 'users', pipeline });
  
      console.log('swastika View created successfully.');

      return
    }


  } catch (error) {
    return;
  } 
}

async function dropViewSwastika() {
  try {
    await dbTest.collection('swastikaView').drop();
    console.log('swastika View dropped successfully.');
    return
  } catch (error) {
    return;
  }
}

module.exports = { createViewSwastika ,dropViewSwastika}

