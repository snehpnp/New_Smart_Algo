// Angel
db.createView("angelView", "users",
[
    {
      $match: {
        broker: "12",
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
  ]
)

//Alce Blue
db.createView("aliceblueView", "users",
[
    {
      $match: {
        broker: "2",
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
          complexty: 'REGULAR',
          discqty: '0',

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



          // product code condition here
          pCode: {
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
              then: 'NRML',
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.product_type', '2'] },
                      ]
                  },
                  then: 'MIS',
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



          // ordertype code condition here
          prctyp: {
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
                  then: 'L',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.order_type', '3'] },
                          ]
                      },
                      then: 'SL',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: 'SL-M',

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

          price: '0',
         // qty: "$client_services.quantity",

          qty: {  
            $cond: {
              if: {
                $or: [
                  { $eq: ['$category.segment', 'MF'] },
                  { $eq: ['$category.segment', 'MO'] }
                ]
              },
              then: "$client_services.lot_size",
              else:  "$client_services.quantity"

            }

          },


          ret: 'DAY',

          // symbol id token condition here
          symbol_id: {
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


          // trading symbol condition here
          trading_symbol: {
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


          transtype: 'BUY',
          trigPrice: '',
          orderTag: 'order1',

        }
      }
    }
  ]
)

//dhanView
db.createView("dhanView", "users",
[
    {
      $match: {
        broker: "20",
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

         
          dhanClientId : "$client_code",

          transactionType : "BUY",

         
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

          validity : "DAY",

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
         
          // product code condition here
         

        
          price: 0,
          
          triggerPrice :0,

          afterMarketOrder : false ,

          amoTime : "OPEN" ,

          boProfitValue : 0 ,

          boStopLossValue : 0

        }
      }
    }
  ]
)


//fivepaisaView
db.createView("fivepaisaView", "users",
[
    {
      $match: {
        broker: "14",
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
  ]
)

//upstoxView
db.createView("upstoxView", "users",
[
    {
      $match: {
        broker: "19",
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

          //quantity: "$client_services.quantity",

          quantity: { "$toInt": "$client_services.quantity" },
         
          // product code condition here
          product: {
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
                  then: 'I',
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
                          else: "D"

                        }

                      }

                    }

                  }

                }
              }

            }


          },

          validity : "DAY",
          price: '0',
          

           // symbol id token condition here
          instrument_token: "",

          // ordertype code condition here
          order_type: {
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
                      then: 'SL',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: 'SL-M',

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

          transaction_type: 'BUY',

          disclosed_quantity : 0,

          trigger_price : 0 ,

          is_amo : false

        }
      }
    }
  ]
)

//zerodhaView
db.createView("zerodhaView", "users",
[
    {
      $match: {
        broker: "15",
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


          // tradingsymbol condition here
          tradingsymbol: {
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


          // transaction Type
          transaction_type: 'BUY',

          // quantity
          quantity: "$client_services.quantity",


          // order_type code condition here
          order_type: {
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
                      then: 'SL',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: 'SL-M',

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
          product: {
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
              then: 'NRML',
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.product_type', '2'] },
                      ]
                  },
                  then: 'MIS',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.product_type', '3'] },
                          ]
                      },
                      then: 'MIS',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.product_type', '4'] },
                              ]
                          },
                          then: 'MIS',
                          else: "CNC"

                        }

                      }

                    }

                  }

                }
              }

            }


          },

          //price
          price: 0,

          // trigger_price
          trigger_price: 0,

          // validity
          validity: "DAY"

        }
      }
    }
  ]
)

//fyersView
  db.createView("fyersView", "users",
  [
    {
      $match: {
        broker: "13",
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

          symbol : "",

          qty : "$client_services.quantity",
          // type 
          type : {
            $cond: {
              if: {
                $and:
                  [
                    { $eq: ['$client_services.order_type', '1'] },
                  ]
              },
              then: 2,
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.order_type', '2'] },
                      ]
                  },
                  then: 1,
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.order_type', '3'] },
                          ]
                      },
                      then: 4,
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: 3,

                          //All condition exist
                          else: 2

                        }

                      }

                    }

                  }

                }
              }

            }

          },

          side : 1,
           // product code condition here
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
                        { $eq: ['$category.segment', 'FO'] } ,
                        { $eq: ['$category.segment', 'MO'] } ,
                        { $eq: ['$category.segment', 'MF'] } ,
                      ]
                    },
                  ]
              },
              then: 'MARGIN',
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
          
          limitPrice : 0 ,

          stopPrice : 0 ,

          validity : "DAY",

          disclosedQty : 0 ,

          offlineOrder : "False",

          stopLoss : 0 ,

          takeProfit : 0 ,


        }
      }
    }
  ]
  )


  //MarketHubView
  db.createView("markethubView", "users",
  [
    {
      $match: {
        broker: "1",
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

          // exchange condition here
          exchange: {
            $cond: {
              if: { $eq: ['$category.segment', 'C'] }, // Your condition here
              then: 'NseCm',
              else: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ['$category.segment', 'F'] },
                      { $eq: ['$category.segment', 'O'] },
                      { $eq: ['$category.segment', 'FO'] }
                    ]
                  },
                  then: 'NseFO',
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
                          then: 'NseCD',

                          // all not exist condition 
                          else: "NseFO"

                        }

                      }

                    }


                  }

                }

              }

            }
          },


          // Toke token condition here
          token: {
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


          // ordertype code condition here
          book_type: {
            $cond: {
              if: {
                $and:
                  [
                    { $eq: ['$client_services.order_type', '1'] },
                  ]
              },
              then: 'RL',
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.order_type', '2'] },
                      ]
                  },
                  then: 'RL',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.order_type', '3'] },
                          ]
                      },
                      then: 'SL',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: 'SL',

                          //All condition exist
                          else: "RL"

                        }

                      }

                    }

                  }

                }
              }

            }

          },

          
          side: 'Buy',

          quantity: "$client_services.quantity",

          price: '0',
        
          disclosed_quantity: '0',
        
          trigger_price: '0',
        
          market_protection_percent: '2',
         
          validity: 'Day',

          // product type condition here
          product: {
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
              then: 'Normal',
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.product_type', '2'] },
                      ]
                  },
                  then: 'Intraday',
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

          client_id : "$client_code",
         
          sender_order_id : "1500",
      


        }
      }
    }
  ]
  )

  //SWASTIKA
  db.createView("swastikaView", "users",
  [
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
  ]
  )

  //KotakNew
  db.createView("kotakneoView", "users",
  [
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
        web_url: 1
      }
    },
    {
      $addFields: {
        postdata:
        {
          


          am : "NO",
          dq : "0",

          es: {
            $cond: {
              if: { $eq: ['$category.segment', 'C'] }, // Your condition here
              then: 'nse_cm',
              else: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ['$category.segment', 'F'] },
                      { $eq: ['$category.segment', 'O'] },
                      { $eq: ['$category.segment', 'FO'] }
                    ]
                  },
                  then: 'nse_fo',
                  else: {

                    $cond: {
                      if: {
                        $or: [
                          { $eq: ['$category.segment', 'MF'] },
                          { $eq: ['$category.segment', 'MO'] }
                        ]
                      },
                      then: 'mcx_fo',
                      else: {

                        $cond: {
                          if: {
                            $or: [
                              { $eq: ['$category.segment', 'CF'] },
                              { $eq: ['$category.segment', 'CO'] }
                            ]
                          },
                          then: 'cde_fo',

                          // all not exist condition 
                          else: "nse_fo"

                        }

                      }

                    }


                  }

                }

              }

            }
          },

          mp: "0",

          // product code condition here
          pc: {
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
              then: 'NRML',
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.product_type', '2'] },
                      ]
                  },
                  then: 'MIS',
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
           
          pf : "N",

          pr : "0",
          

          pt: {
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
                  then: 'L',
                  else: {
                    $cond: {
                      if: {
                        $and:
                          [
                            { $eq: ['$client_services.order_type', '3'] },
                          ]
                      },
                      then: 'SL',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: ' SL-M',

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

          qt : "$client_services.quantity",

          rt : "DAY",

          tp : "0" ,

          ts: {
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

          tt : "B",
         
        }
      }
    }
  ]
  )

  //MASTER TRUST
  db.createView("mastertrustView", "users",
  [
    {
      $match: {
        broker: "3",
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

          order_type: {
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
                      then: 'SL',
                      else: {
                        $cond: {
                          if: {
                            $and:
                              [
                                { $eq: ['$client_services.order_type', '4'] },
                              ]
                          },
                          then: 'SLM',

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

          // instrument  token condition here
          instrument_token: {
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

          //quantity: "$client_services.quantity",
          quantity: { "$toInt": "$client_services.quantity" },

          disclosed_quantity : 0,

          price : 0,

          order_side : "BUY",

          trigger_price : 0,

          validity : 'DAY',

          // product code condition here
          product: {
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
              then: 'NRML',
              else: {
                $cond: {
                  if: {
                    $and:
                      [
                        { $eq: ['$client_services.product_type', '2'] },
                      ]
                  },
                  then: 'MIS',
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

          client_id : "$app_id",

          user_order_id : 10002,

          market_protection_percentage : 0,

          device : 'WEB'



        }
      }
    }
  ]
  )







/// Dashboard Data
db.createView("dashboard_data", "users",
[
  {
      $group: {
          _id: null,
          total_client: {
              $sum: {
                  $cond: [
                      {
                          $and: [

                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_active_client: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              // { $eq: ["$license_type", "2"] },
                              { $gt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_expired_client: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_live_client: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "2"] },
                              { $eq: ["$Is_Active", "1"] }


                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_active_live: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "2"] },
                              {
                                  $gte: [
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: "$EndDate"
                                          }
                                      },
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: new Date()
                                          }
                                      }
                                  ]
                              },
                              { $eq: ["$Is_Active", "1"] }
                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_expired_live: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "2"] },
                              { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_demo_client: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "1"] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_active_demo: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "1"] },
                              {
                                  $gte: [
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: "$EndDate"
                                          }
                                      },
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: new Date()
                                          }
                                      }
                                  ]
                              },
                              { $eq: ["$Is_Active", "1"] }
                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_expired_demo: {

              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "1"] },
                              {
                                  $lt: [
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: "$EndDate"
                                          }
                                      },
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: new Date()
                                          }
                                      }
                                  ]
                              },
                              { $eq: ["$Is_Active", "1"] }
                          ]
                      },
                      1,
                      0
                  ]
              }

          },
          total_two_days: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "0"] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },
          total_active_two_days: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "0"] },
                              {
                                  $gte: [
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: "$EndDate"
                                          }
                                      },
                                      {
                                          $dateToString: {
                                              format: "%Y-%m-%d",
                                              date: new Date()
                                          }
                                      }
                                  ]
                              },
                              { $eq: ["$Is_Active", "1"] }
                          ]
                      },
                      1,
                      0
                  ]
              }
          },

          total_expired_two_days: {
              $sum: {
                  $cond: [
                      {
                          $and: [
                              { $eq: ["$Role", "USER"] },
                              { $eq: ["$license_type", "0"] },
                              { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                              { $eq: ["$Is_Active", "1"] }

                          ]
                      },
                      1,
                      0
                  ]
              }
          },

          used_licence: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$Role", "USER"] },
                      { $eq: ["$license_type", "2"] }
                    ]
                  },
                  { $toInt: { $ifNull: ["$licence", "0"] } }, 
                  0
                ]
              }
            }
            

      }
  },

  {
      $lookup: {
          from: "companies",
          pipeline: [],
          as: "company_info"
      }
  },
  {
      $unwind: "$company_info"
  },
  {
      $project: {
          total_client: 1,
          total_active_client: 1,
          total_expired_client: 1,
          total_live_client: 1,
          total_active_live: 1,
          total_expired_live: 1,
          total_demo_client: 1,
          total_active_demo: 1,
          total_expired_demo: 1,
          total_two_days: 1,
          total_active_two_days: 1,
          total_expired_two_days: 1,
          used_licence: 1,
          licenses: "$company_info.licenses",
          remaining_license: {
              $subtract: [
                  "$company_info.licenses",
                  "$used_licence"
              ]
          }
      }
  }

]
)


/// Open possition
db.createView("open_position", "mainsignals",
[

  {
      $addFields: {
          target: {
              $cond: {
                  if: {
                      $or: [

                          { $eq: ['$target', 0] },
                          { $eq: ['$target', "0"] },
                          { $eq: ['$target', '0'] },
                      ],
                  },
                  then: 0,
                  else: {
                      
                      //$add: [{ $toDouble: '$target' }, { $toDouble: '$entry_price' }]
                      $add: [{ $toDouble: '$target' }]

                  },
              },
          },
          stop_loss: {
              $cond: {
                  if: {
                      $or: [
                          { $eq: ['$stop_loss', 0] },
                          { $eq: ['$stop_loss', "0"] },
                          { $eq: ['$stop_loss', '0'] }, // Check if stop_loss is the string "0"
                      ],
                  },
                  then: 0,
                  else: {

                      // $subtract: [{ $toDouble: '$entry_price' }, { $toDouble: '$stop_loss' }]

                      $add: [{ $toDouble: '$stop_loss' }]

                  },

              },
          },
          entry_qty_percent: {
              $subtract: [
                  { $toDouble: '$entry_qty_percent' },
                  {
                      $cond: {
                          if: {
                              $or: [
                                  { $eq: ['$exit_qty_percent', 0] },
                                  { $eq: ['$exit_qty_percent', "0"] },
                                  { $eq: ['$exit_qty_percent', '0'] }, // Check if stop_loss is the string "0"
                                  { $eq: ['$exit_qty_percent', ''] }, // Check if stop_loss is the string "0"

                              ],
                          },
                          then: 0,
                          else: { $ifNull: [{ $toDouble: '$exit_qty_percent' }, 0] },
                      },
                  },
              ],
          },
      },
  },
  {
      $lookup: {
          from: 'live_prices',
          let: {},
          pipeline: [],
          as: 'livePrice',
      }
  },
  {
      $unwind: '$livePrice',
  },

  



  {
      $match: {
          $and: [
              {
                  $expr: {
                      $and: [
                          // {
                          //     $eq: [
                          //         {
                          //             $dateToString: {
                          //                 format: '%Y/%m/%d',
                          //                 date: new Date(),
                          //             },
                          //         },
                          //         '$dt_date',
                          //     ],
                          // },
                          { $eq: ['$livePrice.trading_status', 'on'] },
                          {
                              $gt: [
                                  { $toDouble: '$entry_qty' }, // Convert entry_qty to number
                                  { $toDouble: '$exit_qty' },  // Convert exit_qty to number
                              ]
                          }
                      ],
                  },
              },
          ],
      },
  },

  {
      $lookup: {
          from: 'stock_live_price',
          localField: 'token',
          foreignField: '_id',
          as: 'stockInfo',
      },
  },
  {
      $addFields: {
          stockInfo: {
              $ifNull: [
                  { $arrayElemAt: ['$stockInfo', 0] },
                  { curtime: 0, lp: 0, bp1: 0, sp1: 0 }
              ]
          },
          stockInfo_lp: {
              $ifNull: [
                  { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                  0
              ]
          },
          stockInfo_bp1: {
              $ifNull: [
                  { $toDouble: { $arrayElemAt: ['$stockInfo.bp1', 0] } },
                  0
              ]
          },
          stockInfo_sp1: {
              $ifNull: [
                  { $toDouble: { $arrayElemAt: ['$stockInfo.sp1', 0] } },
                  0
              ]
          },
          stockInfo_curtime: {
              $ifNull: [
                  { $arrayElemAt: ['$stockInfo.curtime', 0] },
                  0
              ]
          },
       
          isLpInRangeTarget: {
              $cond: {
                  if: {
                      $or: [
                          { $eq: ['$target', 0] },
                          {
                              $eq: [
                                  {
                                      $ifNull: [
                                          { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                          0
                                      ]
                                  },
                                  0
                              ],
                          },
                      ],

                  },
                  then: false,
                  else: {
                      $or: [
                          {
                              $gte: [
                                  {
                                      $ifNull: [
                                          { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                          0
                                      ]
                                  },
                                  '$target',
                              ],
                          },
                        
                      ],
                  },
              },
          },

          isLpInRangeStoploss: {
              $cond: {
                  if: {
                      $or: [
                          { $eq: ['$stop_loss', 0] },
                          {
                              $eq: [
                                  {
                                      $ifNull: [
                                          { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                          0
                                      ]
                                  },
                                  0
                              ],
                          },
                      ],

                  },
                  then: false,
                  else: {
                      $or: [
                          {
                              $lte: [
                                  {
                                      $ifNull: [
                                          { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                          0
                                      ]
                                  },
                                  '$stop_loss',
                              ],
                          },
                        
                      ],
                  },
              },
          },
      },
  },

  {
      $addFields: {
          exit_time_test: {
              $concat: [
                  { $substr: ["$exit_time", 0, 2] },
                  { $substr: ["$exit_time", 3, 2] }
              ]
          }
      }
  },

  {
      $lookup: {
          from: 'companies',
          let: {},
          pipeline: [],
          as: 'companyData'
      }
  },
  {
      $project: {
          _id: 1,
          symbol: 1,
          entry_type: 1,
          exit_type: 1,
          entry_price: 1,
          exit_price: 1,
          entry_qty_percent: 1,
          exit_qty_percent: 1,
          entry_qty: 1,
          exit_qty: 1,
          exchange: 1,
          strategy: 1,
          segment: 1,
          trade_symbol: 1,
          client_persnal_key: {
              $cond: {
                  if: {
                      $or: [
                          { $eq: ["$client_persnal_key", ""] },
                          { $eq: ["$client_persnal_key", null] },
                      ],
                  },
                  then: { $arrayElemAt: ['$companyData.panel_key', 0] },
                  else: '$client_persnal_key' // Keep the existing value if not empty or null
              }
          },

          TradeType: 1,
          token: 1,
          lot_size: 1,
          complete_trade: 1,
          option_type: 1,
          dt_date: 1,
          strike: 1,
          expiry: 1,
          target: 1,
          stop_loss: 1,
          exit_time: 1,
          exit_time_test: 1,
          stockInfo_curtime: 1,
          stockInfo_lp: 1,
          MakeStartegyName: 1,

         // isLpInRange1: 1,
          isLpInRangeTarget:1,
          isLpInRangeStoploss:1,
          isLpInRange: {
              $cond: {
                  if: {
                      $or: [
                          { $eq: ['$exit_time_test', "0"] },
                          { $eq: ['$exit_time_test', '0'] },
                          { $eq: ['$exit_time_test', 0] },
                      ],
                  },
                  then: -1,
                  else: {
                      $cmp: [
                          { $toInt: '$stockInfo.curtime' },
                          { $toInt: '$exit_time_test' },
                      ],
                  },
              },
          },
      },
  }


]
)


/// Open possition Excuted Trade
db.createView("open_position_excute", "open_position",
[
  {
      $match: {
          $or: [
              // { isLpInRange1: true },
              { isLpInRangeTarget: true },
              { isLpInRangeStoploss: true },
              { isLpInRange: 1 }
          ]
      }
  }
]
)





// Delete View Command



try {
    db.runCommand({ drop: "angelView" });

    print("View 'angelView' dropped successfully.");
} catch (e) {
    if (e.code === 26) {
        print("View angelView doesn't exist.");
    } else {
        print("An error occurred while dropping the view: " + e);
    }
}


try {
  
    db.runCommand({ drop: "aliceblueView" });
 
    print("View 'aliceblueView' dropped successfully.");
} catch (e) {
    if (e.code === 26) {
        print("View aliceblueView doesn't exist.");
    } else {
        print("An error occurred while dropping the view: " + e);
    }
}


try {
   
    db.runCommand({ drop: "dhanView" });
 
    print("View 'dhanView' dropped successfully.");
} catch (e) {
    if (e.code === 26) {
        print("View dhanView doesn't exist.");
    } else {
        print("An error occurred while dropping the view: " + e);
    }
}


try {
 
    db.runCommand({ drop: "fivepaisaView" });
    
    print("View 'fivepaisaView' dropped successfully.");
} catch (e) {
    if (e.code === 26) {
        print("View fivepaisaView doesn't exist.");
    } else {
        print("An error occurred while dropping the view: " + e);
    }
}


try {
  
    db.runCommand({ drop: "upstoxView" });

    print("View 'upstoxView' dropped successfully.");
} catch (e) {
    if (e.code === 26) {
        print("View upstoxView doesn't exist.");
    } else {
        print("An error occurred while dropping the view: " + e);
    }
}


try {
    db.runCommand({ drop: "zerodhaView" });
    print("View 'zerodhaView' dropped successfully.");
} catch (e) {
    if (e.code === 26) {
        print("View zerodhaView doesn't exist.");
    } else {
        print("An error occurred while dropping the view: " + e);
    }
}

