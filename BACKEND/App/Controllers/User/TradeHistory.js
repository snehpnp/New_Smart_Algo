"use strict";
const db = require('../../Models');
const MainSignals = db.MainSignals
const client_services = db.client_services
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class TradeHistory {

    // GET ADMIN SIGNALS
    async GetUserTradeHistory(req, res) {
        try {

           // console.log("req.body ",req.body)
            const { user_id, startDate, endDate , serviceIndex ,selectStrategy} = req.body;

            const objectId = new ObjectId(user_id);

            const pipeline = [
                {
                    $match: {
                        user_id: objectId
                    }
                },
                {
                    $lookup: {
                        from: "services",
                        localField: "service_id",
                        foreignField: "_id",
                        as: "service",
                    },
                },
                {
                    $unwind: '$service',
                },
                {
                    $lookup: {
                        from: "users",
                        localField: 'user_id',
                        foreignField: "_id",
                        as: "users",
                    },
                },
                {
                    $unwind: '$users',
                },
                {
                    $lookup: {
                        from: "strategies",
                        localField: "strategy_id",
                        foreignField: "_id",
                        as: "strategys",
                    },
                },
                {
                    $unwind: '$strategys',
                },

                {
                    $project: {
                        'service.name': 1,
                        'strategys.strategy_name': 1,
                        'users.web_url': 1,
                        'users.client_key': 1,
                        quantity: 1

                    },
                },
            ];

            const GetAllClientServices = await client_services.aggregate(pipeline)


            var abc = [];
            var abc1 = [];
            let serIndex;
            let strategyset;
            if (GetAllClientServices.length > 0) {
                for (const item of GetAllClientServices) {
                    var client_persnal_key1 = ""
                    if (item.users.web_url == '1') {
                        client_persnal_key1 = ""
                    } else if (item.users.web_url == '2') {
                        client_persnal_key1 = item.users.client_key
                    }

                    try {
                        // console.log("client_persnal_key1", item.quantity);


                           if (serviceIndex === "null") {
                            serIndex = item.service.name
                            } else {
                            serIndex = serviceIndex
                            }

                            if (selectStrategy === "null") {
                            strategyset = item.strategys.strategy_name
                            } else {
                            strategyset = selectStrategy
                            }

                          var data = await MainSignals.aggregate([
                            {
                                $match: {
                                   // symbol: item.service.name,
                                    symbol: serIndex,
                                    strategy: strategyset,
                                   // strategy: item.strategys.strategy_name,
                                    dt_date: {
                                        $gte: startDate,
                                        $lte: endDate,
                                    },
                                    client_persnal_key: client_persnal_key1
                                }
                            },
                            {
                                $lookup: {
                                    from: "signals",
                                    localField: "signals_id",
                                    foreignField: "_id",
                                    as: "result",
                                },
                            },
                            {
                                $sort: {
                                    _id: -1 // Sort in ascending order. Use -1 for descending.
                                }
                            }
                          ]);

                          var data1 = await MainSignals.aggregate([
                            {
                                $match: {
                                     symbol: item.service.name,
                                    strategy: item.strategys.strategy_name,
                                    dt_date: {
                                        $gte: startDate,
                                        $lte: endDate,
                                    },
                                    client_persnal_key: client_persnal_key1
                                }
                            },
                            {
                                $lookup: {
                                    from: "signals",
                                    localField: "signals_id",
                                    foreignField: "_id",
                                    as: "result",
                                },
                            },
                            {
                                $sort: {
                                    _id: -1 // Sort in ascending order. Use -1 for descending.
                                }
                            }
                          ]);

                          if (data.length > 0) {
                          //  console.log("data ",data.length)
                            data.forEach(function (item) {
                          
                                var findstg = GetAllClientServices.find((data) => data.service.name == item.symbol && data.strategys.strategy_name == item.strategy)
                               // console.log("findstg ",findstg)
                               //  console.log("item.result ",item.result)
                              if(findstg != undefined){
                                item.result.forEach(function (signal) {

                                    signal.qty_percent = findstg.quantity * (Math.ceil(Number(signal.qty_percent) / 100) * 100) * 0.01

                                });

                                item.entry_qty_percent = findstg.quantity * (Math.ceil(Number(item.entry_qty_percent) / 100) * 100) * 0.01,
                                    item.exit_qty_percent = findstg.quantity * (Math.ceil(Number(item.exit_qty_percent) / 100) * 100) * 0.01
                              }

                            });

                            abc.push(data)
                          }

                          if(data1.length > 0){
                        //    console.log("data1 ",data1.length)
                            abc1.push(data1)
                          }

                    } catch (error) {
                        console.log("Error fetching data:", error);
                    }


                }
            } else {
                res.send({ status: false, data: GetAllClientServices, msg: "Data Empty" })
            }
            
            //console.log("abc.flat()1 ",abc1.flat())
             var trade_strategy_filter
             if(abc1.length >0){

              //  console.log("abc1 ",abc1.flat())

                const groupedDataStrategy = abc1.flat().reduce((acc, curr) => {
                    if (!acc[curr.strategy]) {
                      acc[curr.strategy] = 1;
                    } else {
                      acc[curr.strategy]++;
                    }
                    return acc;
                  }, {});
                  
             trade_strategy_filter = Object.keys(groupedDataStrategy);
             //console.log("trade_strategy_filter ",trade_strategy_filter)
    
             }

            if (abc.length > 0) {
               
                
               // console.log("trade_strategy_filter ",trade_strategy_filter)
                res.send({ status: true, data: abc.flat(), msg: "Get Signals" ,trade_strategy_filter:trade_strategy_filter})
            } else {
                res.send({ status: false, data: [], msg: "Data Empty" })

            }





        } catch (error) {
            console.log("Error get user trading Status error -", error);
        }
    }

}


module.exports = new TradeHistory();