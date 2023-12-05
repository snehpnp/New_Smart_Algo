// var timeDt = "12:02:00";

// // Current date and time
// var currentDate = new Date();

// // Given time
// var givenTime = new Date();
// var timeComponents = timeDt.split(":");
// givenTime.setHours(parseInt(timeComponents[0]));
// givenTime.setMinutes(parseInt(timeComponents[1]));
// givenTime.setSeconds(parseInt(timeComponents[2]));

// // Adding the time to the current date
// var resultingDate = new Date(currentDate);
// resultingDate.setHours(givenTime.getHours());
// resultingDate.setMinutes(givenTime.getMinutes());
// resultingDate.setSeconds(givenTime.getSeconds());

// console.log( resultingDate);


// Provided time in UTC
const providedTimeUTC = new Date('2023-11-27T10:00:02.596+00:00').getTimezoneOffset()

// Convert to Indian Standard Time (IST)
// const indianTimeOptions = { timeZone: 'Asia/Kolkata' };
// const indianTime = providedTimeUTC.toLocaleString('en-US', indianTimeOptions);

// console.log( providedTimeUTC);
// 2023-11-27T15:59:00.000+00:00
// db.createView('open_position', 'mainsignals', [
//     {
//         $set: {
//             current_date: {
//                 $dateToString: {
//                     format: '%Y-%m-%d',
//                     date: new Date(),
//                     timezone: 'Asia/Kolkata'
//                 }
//             }
//         }
//     },
//     {
//         $addFields: {
//             target: {
//                 $add: [
//                     { $toDouble: '$entry_price' },
//                     { $ifNull: [{ $toDouble: '$target' }, 0] },
//                 ],
//             },
//             stop_loss: {
//                 $subtract: [
//                     { $toDouble: '$entry_price' },
//                     { $ifNull: [{ $toDouble: '$stop_loss' }, 0] },
//                 ],
//             },

//             exit_time: {
//                $concat: ['$current_date', 'T', '$exit_time',':00'],
//             },
//         },
//     },
//     {
//         $project: {
//             _id: 1, // Include the _id field if needed
//             symbol: 1,
//             entry_type: 1,
//             entry_price: 1,
//             entry_qty_percent: 1,
//             exit_qty_percent: 1,
//             exchange: 1,
//             strategy: 1,
//             segment: 1,
//             trade_symbol: 1,
//             client_persnal_key: 1,
//             TradeType: 1,
//             token: 1,
//             lot_size: 1,
//             complete_trade: 1,
//             option_type: 1,
//             dt_date: 1,
//             strike: 1,
//             expiry: 1,
//             target: 1,
//             stop_loss: 1,
//             exit_time: 1,
//             // combinedTime:1
//             // combinedTime: {
//             //     $concat: ['$current_date', 'T', '$exit_time']
//             // }
//         },
//     },
//     // Additional pipeline stages if needed
// ]);





// Assuming date is in UTC
// const utcDate = new Date('2023-11-27T16:10:00.000+00:00'); // Replace with your UTC date

// // Convert to IST
// const istDate = utcDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

// console.log('UTC Date:', utcDate.toISOString());
// console.log('IST Date:', istDate);



// db.createView('open_position', 'mainsignals', [
//     {
//         $set: {
//             current_date: {
//                 $dateToString: {
//                     format: '%Y-%m-%d',
//                     date: new Date(),
//                     timezone: 'Asia/Kolkata'
//                 }
//             }
//         }
//     },
//     {
//         $addFields: {
//             target: {
//                 $add: [
//                     { $toDouble: '$entry_price' },
//                     { $ifNull: [{ $toDouble: '$target' }, 0] },
//                 ],
//             },
//             stop_loss: {
//                 $subtract: [
//                     { $toDouble: '$entry_price' },
//                     { $ifNull: [{ $toDouble: '$stop_loss' }, 0] },
//                 ],
//             },

//             exit_time: {
//                 $toDate: {
//                     $concat: ['$current_date', 'T', '$exit_time', ':00'],
//                 }
//             },
//         },
//     },
//     {
//         $project: {
//             _id: 1, 
//             symbol: 1,
//             entry_type: 1,
//             entry_price: 1,
//             entry_qty_percent: 1,
//             exit_qty_percent: 1,
//             exchange: 1,
//             strategy: 1,
//             segment: 1,
//             trade_symbol: 1,
//             client_persnal_key: 1,
//             TradeType: 1,
//             token: 1,
//             lot_size: 1,
//             complete_trade: 1,
//             option_type: 1,
//             dt_date: 1,
//             strike: 1,
//             expiry: 1,
//             target: 1,
//             stop_loss: 1,
//             exit_time: 1,

//             exit_time_test: {
//                 $dateFromString: {
//                   dateString: {
//                     $dateToString: {
//                       format: '%Y-%m-%dT%H:%M:%S.%LZ',
//                       date: {
//                         $subtract: [
//                           '$exit_time',
//                           19800000  // 5 hours and 30 minutes in milliseconds
//                         ]
//                       },
//                       timezone: 'UTC',
//                     },
//                   },
//                   format: '%Y-%m-%dT%H:%M:%S.%LZ',
//                   timezone: 'UTC',
//                 },
//               }


//         },
//     },
// ]);


db.createView('open_position', 'mainsignals', [

    {
        $addFields: {
            target: {
                $add: [
                    { $toDouble: '$entry_price' },
                    {
                        $cond: {
                            if: {
                                $or: [
                                 
                                    { $eq: ['$target', "0"] },
                                    { $eq: ['$target', '0'] }, // Check if target is the string "0"
                                ],
                            },
                            then: 0,
                            else: { $ifNull: [{ $toDouble: '$target' }, 0] },
                        },
                    },
                ],
            },
            stop_loss: {
                $subtract: [
                    { $toDouble: '$entry_price' },
                    {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$stop_loss', 0] },
                                    { $eq: ['$stop_loss', "0"] },
                                    { $eq: ['$stop_loss', '0'] }, // Check if stop_loss is the string "0"
                                ],
                            },
                            then: 0,
                            else: { $ifNull: [{ $toDouble: '$stop_loss' }, 0] },
                        },
                    },
                ],
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
        $match: {
            $expr: {
                $ne: ['$entry_qty_percent', 0]
            }
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
            isLpInRange1: {
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
        $project: {
            _id: 1,
            symbol: 1,
            entry_type: 1,
            entry_price: 1,
            entry_qty_percent: 1,
            exchange: 1,
            strategy: 1,
            segment: 1,
            trade_symbol: 1,
            client_persnal_key: 1,
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
            stockInfo_lp:1,
            stockInfo_sp1:1,
            stockInfo_bp1:1,
            isLpInRange1:1,
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
    },
]);



db.createView('channel_list', 'token_chain', [])