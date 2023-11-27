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



db.createView('open_position', 'mainsignals', [
    {
        $set: {
            current_date: {
                $dateToString: {
                    format: '%Y-%m-%d',
                    date: new Date(),
                    timezone: 'Asia/Kolkata'
                }
            }
        }
    },
    {
        $addFields: {
            target: {
                $add: [
                    { $toDouble: '$entry_price' },
                    { $ifNull: [{ $toDouble: '$target' }, 0] },
                ],
            },
            stop_loss: {
                $subtract: [
                    { $toDouble: '$entry_price' },
                    { $ifNull: [{ $toDouble: '$stop_loss' }, 0] },
                ],
            },
        
            exit_time: {
                $toDate: {
                    $concat: ['$current_date', 'T', '$exit_time', ':00'],
                }
            },
        },
    },
    {
        $project: {
            _id: 1, 
            symbol: 1,
            entry_type: 1,
            entry_price: 1,
            entry_qty_percent: 1,
            exit_qty_percent: 1,
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
            // exit_time11: {
            //     $dateToString: {
            //         format: '%Y-%m-%dT%H:%M:%S.%LZ',
            //         date: new Date(),
            //         timezone: 'UTC',
            //     },
            // },
            exit_time: {
                $dateToString: {
                    format: '%Y-%m-%dT%H:%M:%S.%LZ',
                    date: {
                        $subtract: [
                            '$exit_time',
                            19800000  // 5 hours and 30 minutes in milliseconds
                        ]
                    },
                    timezone: 'UTC',
                },
            },
         
        },
    },
]);


