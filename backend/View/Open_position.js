const db = require('../App/Models');
const dbTest = db.dbTest;


// OPEN POSITION
async function createView() {
    try {

        const collectionName = 'mainsignals';
        const views = await dbTest.listCollections({ name: 'open_position' }).toArray();
        if (views.length > 0) {
            return; 
          }else{ 
            const pipeline = [

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
                        isLpInRangeTarget: 1,
                        isLpInRangeStoploss: 1,
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
    
            const viewName = 'open_position';
    
            await dbTest.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline
            });
    
          }

      
    } 
    catch (error) {
        return;
    }
}

// open_position_excute
async function dropOpenPosition() {
    try {
       
        await dbTest.collection('open_position').drop();
        await dbTest.collection('open_position_excute').drop();

    } catch (error) {
       return;
    }
}

// open_position_excute
async function dropExistingView1() {
    try {

        await dbTest.collection('open_position_excute').drop();

    } catch (error) {
        return;
    }
}

async function open_position_excute(req, res) {

    try {
        const sourceViewName = 'open_position';
        const destinationViewName = 'open_position_excute';

        const pipeline = [
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
        ];

        // Create the destination view with the specified pipeline
        await dbTest.createCollection(destinationViewName, {
            viewOn: sourceViewName,
            pipeline: pipeline,
        });

       return;

    } catch (error) {
    return;
    } 


}

module.exports = { dropExistingView1, open_position_excute, createView, dropOpenPosition }

//     {
//         $addFields: {
//             target: {
//                 $cond: {
//                     if: {
//                         $or: [

//                             { $eq: ['$target', 0] },
//                             { $eq: ['$target', '0'] },
//                         ],
//                     },
//                     then: 0,
//                     else: {
//                         $add: [{ $toDouble: '$target' }, { $toDouble: '$entry_price' }]

//                     },
//                 },
//             },
//             stop_loss: {
//                 $cond: {
//                     if: {
//                         $or: [
//                             { $eq: ['$stop_loss', 0] },
//                             { $eq: ['$stop_loss', "0"] },
//                             { $eq: ['$stop_loss', '0'] }, // Check if stop_loss is the string "0"
//                         ],
//                     },
//                     then: 0,
//                     else: {
//                         $subtract: [{ $toDouble: '$entry_price' }, { $toDouble: '$stop_loss' }]

//                     },

//                 },
//             },
//             entry_qty_percent: {
//                 $subtract: [
//                     { $toDouble: '$entry_qty_percent' },
//                     {
//                         $cond: {
//                             if: {
//                                 $or: [
//                                     { $eq: ['$exit_qty_percent', 0] },
//                                     { $eq: ['$exit_qty_percent', "0"] },
//                                     { $eq: ['$exit_qty_percent', '0'] }, // Check if stop_loss is the string "0"
//                                     { $eq: ['$exit_qty_percent', ''] }, // Check if stop_loss is the string "0"

//                                 ],
//                             },
//                             then: 0,
//                             else: { $ifNull: [{ $toDouble: '$exit_qty_percent' }, 0] },
//                         },
//                     },
//                 ],
//             },
//         },
//     },
//     {
//         $lookup: {
//             from: 'live_prices',
//             let: {},
//             pipeline: [],
//             as: 'livePrice',
//         }
//     },
//     {
//         $unwind: '$livePrice',
//     },
//     {
//         $match: {
//             $and: [
//                 {
//                     $expr: {
//                         $and: [
//                             {
//                                 $eq: [
//                                     {
//                                         $dateToString: {
//                                             format: '%Y/%m/%d',
//                                             date: new Date(),
//                                         },
//                                     },
//                                     '$dt_date',
//                                 ],
//                             },
//                             { $eq: ['$livePrice.trading_status', 'on'] },
//                             {
//                                 $gt: [
//                                     { $toDouble: '$entry_qty' }, // Convert entry_qty to number
//                                     { $toDouble: '$exit_qty' },  // Convert exit_qty to number
//                                 ]
//                             }
//                         ],
//                     },
//                 },
//             ],
//         },
//     },

//     {
//         $lookup: {
//             from: 'stock_live_price',
//             localField: 'token',
//             foreignField: '_id',
//             as: 'stockInfo',
//         },
//     },
//     {
//         $addFields: {
//             stockInfo: {
//                 $ifNull: [
//                     { $arrayElemAt: ['$stockInfo', 0] },
//                     { curtime: 0, lp: 0, bp1: 0, sp1: 0 }
//                 ]
//             },
//             stockInfo_lp: {
//                 $ifNull: [
//                     { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
//                     0
//                 ]
//             },
//             stockInfo_bp1: {
//                 $ifNull: [
//                     { $toDouble: { $arrayElemAt: ['$stockInfo.bp1', 0] } },
//                     0
//                 ]
//             },
//             stockInfo_sp1: {
//                 $ifNull: [
//                     { $toDouble: { $arrayElemAt: ['$stockInfo.sp1', 0] } },
//                     0
//                 ]
//             },
//             stockInfo_curtime: {
//                 $ifNull: [
//                     { $arrayElemAt: ['$stockInfo.curtime', 0] },
//                     0
//                 ]
//             },
//             isLpInRange1: {
//                 $cond: {
//                     if: {
//                         $or: [
//                             { $eq: ['$target', 0] },
//                             { $eq: ['$stop_loss', 0] },
//                             {
//                                 $eq: [
//                                     {
//                                         $ifNull: [
//                                             { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
//                                             0
//                                         ]
//                                     },
//                                     0
//                                 ],
//                             },
//                         ],

//                     },
//                     then: false,
//                     else: {
//                         $or: [
//                             {
//                                 $gte: [
//                                     {
//                                         $ifNull: [
//                                             { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
//                                             0
//                                         ]
//                                     },
//                                     '$target',
//                                 ],
//                             },
//                             {
//                                 $lte: [
//                                     {
//                                         $ifNull: [
//                                             { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
//                                             0
//                                         ]
//                                     },
//                                     '$stop_loss',
//                                 ],
//                             },
//                         ],
//                     },
//                 },
//             },
//         },
//     },

//     {
//         $addFields: {
//             exit_time_test: {
//                 $concat: [
//                     { $substr: ["$exit_time", 0, 2] },
//                     { $substr: ["$exit_time", 3, 2] }
//                 ]
//             }
//         }
//     },

//     {
//         $lookup: {
//             from: 'companies',
//             let: {},
//             pipeline: [],
//             as: 'companyData'
//         }
//     },
//     {
//         $project: {
//             _id: 1,
//             symbol: 1,
//             entry_type: 1,
//             exit_type: 1,
//             entry_price: 1,
//             exit_price: 1,
//             entry_qty_percent: 1,
//             exit_qty_percent: 1,
//             entry_qty: 1,
//             exit_qty: 1,
//             exchange: 1,
//             strategy: 1,
//             segment: 1,
//             trade_symbol: 1,
//             client_persnal_key: {
//                 $cond: {
//                     if: {
//                         $or: [
//                             { $eq: ["$client_persnal_key", ""] },
//                             { $eq: ["$client_persnal_key", null] },
//                         ],
//                     },
//                     then: { $arrayElemAt: ['$companyData.panel_key', 0] },
//                     else: '$client_persnal_key' // Keep the existing value if not empty or null
//                 }
//             },

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
//             exit_time_test: 1,
//             stockInfo_curtime: 1,
//             stockInfo_lp: 1,
//             MakeStartegyName: 1,

//             isLpInRange1: 1,
//             isLpInRange: {
//                 $cond: {
//                     if: {
//                         $or: [
//                             { $eq: ['$exit_time_test', "0"] },
//                             { $eq: ['$exit_time_test', '0'] },
//                             { $eq: ['$exit_time_test', 0] },
//                         ],
//                     },
//                     then: -1,
//                     else: {
//                         $cmp: [
//                             { $toInt: '$stockInfo.curtime' },
//                             { $toInt: '$exit_time_test' },
//                         ],
//                     },
//                 },
//             },
//         },
//     }


// ]);