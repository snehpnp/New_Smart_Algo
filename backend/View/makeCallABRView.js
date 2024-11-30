const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = process.env.DB_NAME;


// OPEN POSITION
async function makecallabrView() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db(dbName);
        const collectionName = 'makecallabrs';
        const viewName = 'makecall_a_b_r';

        const pipeline = [

            {
                $match: {
                    status: 0
                }

            },

            {
                $addFields: {
                    above_price: {
                        $cond: {
                            if: {
                                $and: [

                                    { $eq: ['$ABR_TYPE', "above"] },
                                ],
                            },
                            then: { $toDouble: '$Price' },
                            else: {

                                $add: null

                            },
                        },
                    },
                    below_price: {
                        $cond: {
                            if: {
                                $and: [

                                    { $eq: ['$ABR_TYPE', "below"] },
                                ],
                            },
                            then: { $toDouble: '$Price' },
                            else: {

                                $add: null

                            },
                        },
                    },

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
                $match: {
                    stockInfo: { $ne: [] } // Filter documents where 'stockInfo' array is not empty
                }
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


                    isAbove: {
                        $cond: {
                            if: {
                                $and: [

                                    { $eq: ['$ABR_TYPE', "above"] },
                                    {
                                        $gte: [
                                            {
                                                $ifNull: [
                                                    { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                    0
                                                ]
                                            },
                                            { $toDouble: '$Price' },
                                        ],
                                    },

                                ],

                            },
                            then: true,
                            else: false

                        },
                    },

                    isBelow: {
                        $cond: {
                            if: {
                                $and: [

                                    { $eq: ['$ABR_TYPE', "below"] },
                                    {
                                        $lte: [
                                            {
                                                $ifNull: [
                                                    { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                    0
                                                ]
                                            },
                                            { $toDouble: '$Price' },
                                        ],
                                    },

                                ],

                            },
                            then: true,
                            else: false

                        },
                    },

                    isRange: {
                        $cond: {
                            if: {
                                $and: [

                                    { $eq: ['$ABR_TYPE', "range"] },
                                    {
                                        $gt: [
                                            {
                                                $ifNull: [
                                                    { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                    0
                                                ]
                                            },
                                            { $toDouble: '$EntryPriceRange_one' },
                                        ],
                                    },
                                    {
                                        $lt: [
                                            {
                                                $ifNull: [
                                                    { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                    0
                                                ]
                                            },
                                            { $toDouble: '$EntryPriceRange_two' },
                                        ],
                                    },

                                ],

                            },
                            then: true,
                            else: false

                        },
                    },

                },
            },

            {
                $project: {

                    user_id: 1,
                    Symbol: 1,
                    TType: 1,
                    Tr_Price: 1,
                    Price: 1,
                    EntryPrice: 1,
                    Sq_Value: 1,
                    Sl_Value: 1,
                    TSL: 1,
                    Segment: 1,
                    Strike: 1,
                    OType: 1,
                    Expiry: 1,
                    Strategy: 1,
                    Quntity: 1,
                    Key: 1,
                    TradeType: 1,
                    Target: 1,
                    StopLoss: 1,
                    ExitTime: 1,
                    ExitTime_dt: 1,
                    sl_status: 1,
                    token: 1,
                    EntryPriceRange_one: 1,
                    EntryPriceRange_two: 1,
                    ABR_TYPE: 1,
                    status: 1,
                    marketTimeAmo: 1,
                    above_price: 1,
                    below_price: 1,
                    stockInfo_curtime: 1,
                    stockInfo_lp: 1,
                    isAbove: 1,
                    isBelow: 1,
                    isRange: 1

                },
            }


        ]



        await database.createCollection(viewName, {
            viewOn: collectionName,
            pipeline: pipeline
        });

        console.log(`View "${viewName}" created successfully.`);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

async function makecallabrView_excute(req, res) {

    try {
        const sourceViewName = 'makecall_a_b_r';
        const destinationViewName = 'makecallabrView_excute';

        const pipeline = [
            {
                $match: {
                    $or: [
                        { isAbove: true },
                        { isBelow: true },
                        { isRange: true }
                    ]
                }
            }
        ];

        // Create the destination view with the specified pipeline
        await client.db(dbName).createCollection(destinationViewName, {
            viewOn: sourceViewName,
            pipeline: pipeline,
        });

        console.log('Destination view created successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Ensure the client is closed even if an error occurs
        await client.close();
    }


}


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
            $match: {
                $and: [
                    {
                        $expr: {
                            $and: [

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
                                { $toInt: '$exit_time' },
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
                    { isLpInRange: 1 },
                    { isLpInRange: 0 }
                ]
            }
        }
    ]
)


db.createView("makecall_a_b_r", "makecallabrs",
    [

        // {
        //   $match : {
        //      status :0
        //   }

        // },

        {
            $match: {
                $and: [
                    { status: 0 },
                    { ABR_TYPE: { $ne: "at" } }
                ]
            }
        },

        {
            $addFields: {
                above_price: {
                    $cond: {
                        if: {
                            $and: [

                                { $eq: ['$ABR_TYPE', "above"] },
                            ],
                        },
                        then: { $toDouble: '$Price' },
                        else: {

                            $add: null

                        },
                    },
                },
                below_price: {
                    $cond: {
                        if: {
                            $and: [

                                { $eq: ['$ABR_TYPE', "below"] },
                            ],
                        },
                        then: { $toDouble: '$Price' },
                        else: {

                            $add: null

                        },
                    },
                },

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
            $match: {
                stockInfo: { $ne: [] } // Filter documents where 'stockInfo' array is not empty
            }
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


                isAbove: {
                    $cond: {
                        if: {
                            $and: [

                                { $eq: ['$ABR_TYPE', "above"] },
                                {
                                    $gte: [
                                        {
                                            $ifNull: [
                                                { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                0
                                            ]
                                        },
                                        { $toDouble: '$Price' },
                                    ],
                                },

                            ],

                        },
                        then: true,
                        else: false

                    },
                },

                isBelow: {
                    $cond: {
                        if: {
                            $and: [

                                { $eq: ['$ABR_TYPE', "below"] },
                                {
                                    $lte: [
                                        {
                                            $ifNull: [
                                                { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                0
                                            ]
                                        },
                                        { $toDouble: '$Price' },
                                    ],
                                },

                            ],

                        },
                        then: true,
                        else: false

                    },
                },

                isRange: {
                    $cond: {
                        if: {
                            $and: [

                                { $eq: ['$ABR_TYPE', "range"] },
                                {
                                    $gt: [
                                        {
                                            $ifNull: [
                                                { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                0
                                            ]
                                        },
                                        { $toDouble: '$EntryPriceRange_one' },
                                    ],
                                },
                                {
                                    $lt: [
                                        {
                                            $ifNull: [
                                                { $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } },
                                                0
                                            ]
                                        },
                                        { $toDouble: '$EntryPriceRange_two' },
                                    ],
                                },

                            ],

                        },
                        then: true,
                        else: false

                    },
                },

            },
        },

        {
            $project: {

                user_id: 1,
                Symbol: 1,
                TType: 1,
                Tr_Price: 1,
                Price: 1,
                EntryPrice: 1,
                Sq_Value: 1,
                Sl_Value: 1,
                TSL: 1,
                Segment: 1,
                Strike: 1,
                OType: 1,
                Expiry: 1,
                Strategy: 1,
                Quntity: 1,
                Key: 1,
                TradeType: 1,
                Target: 1,
                StopLoss: 1,
                ExitTime: 1,
                ExitTime_dt: 1,
                sl_status: 1,
                token: 1,
                EntryPriceRange_one: 1,
                EntryPriceRange_two: 1,
                ABR_TYPE: 1,
                status: 1,
                marketTimeAmo: 1,
                above_price: 1,
                below_price: 1,
                stockInfo_curtime: 1,
                stockInfo_lp: 1,
                isAbove: 1,
                isBelow: 1,
                isRange: 1,
                WiseTypeDropdown: 1

            },
        }


    ]
)

db.createView("makecallabrView_excute", "makecall_a_b_r",
    [
        {
            $match: {
                $or: [
                    { isAbove: true },
                    { isBelow: true },
                    { isRange: true }
                ]
            }
        }
    ]
)

//Notrade Time trade View
db.createView("makecall_NotradeTime_status", "makecallabrs",
    [

        {
            $match: {
                status: 0
            }

        },
        {
            "$addFields": {
                "ISTOffset": 19800000 // Offset for Indian Standard Time (19800000 milliseconds = 5 hours 30 minutes)
            }
        },
        {
            "$addFields": {
                "currentTime": {
                    "$let": {
                        "vars": {
                            "currentTime": {
                                "$add": ["$$NOW", "$ISTOffset"]
                            }
                        },
                        "in": {
                            "$concat": [
                                {
                                    "$cond": {
                                        "if": { "$lt": [{ "$hour": "$$currentTime" }, 10] },
                                        "then": { "$concat": ["0", { "$toString": { "$hour": "$$currentTime" } }] },
                                        "else": { "$toString": { "$hour": "$$currentTime" } }
                                    }
                                },
                                {
                                    "$cond": {
                                        "if": { "$lt": [{ "$minute": "$$currentTime" }, 10] },
                                        "then": { "$concat": ["0", { "$toString": { "$minute": "$$currentTime" } }] },
                                        "else": { "$toString": { "$minute": "$$currentTime" } }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project:
            {
                currentTime: 1,
                token: 1,
                NoTradeTime: 1,
                isLpInRange: {
                    $cond: {
                        if: {
                            $or: [
                                { $eq: ['$NoTradeTime', "0"] },
                                { $eq: ['$NoTradeTime', ""] },
                            ],
                        },
                        then: -1,
                        else: {
                            $cmp: [
                                { $toInt: '$currentTime' },
                                { $toInt: '$NoTradeTime' },
                            ],
                        },
                    },
                },
            }
        }

    ]
)

db.createView("makecall_NotradeTime_status", "makecallabrs",
    [

        {
            $match: {
                status: 0
            }

        },
        {
            "$addFields": {
                "ISTOffset": 19800000 // Offset for Indian Standard Time (19800000 milliseconds = 5 hours 30 minutes)
            }
        },
        {
            "$addFields": {
                "currentTime": {
                    "$let": {
                        "vars": {
                            "currentTime": {
                                "$add": ["$$NOW", "$ISTOffset"]
                            }
                        },
                        "in": {
                            "$concat": [
                                {
                                    "$cond": {
                                        "if": { "$lt": [{ "$hour": "$$currentTime" }, 10] },
                                        "then": { "$concat": ["0", { "$toString": { "$hour": "$$currentTime" } }] },
                                        "else": { "$toString": { "$hour": "$$currentTime" } }
                                    }
                                },
                                {
                                    "$cond": {
                                        "if": { "$lt": [{ "$minute": "$$currentTime" }, 10] },
                                        "then": { "$concat": ["0", { "$toString": { "$minute": "$$currentTime" } }] },
                                        "else": { "$toString": { "$minute": "$$currentTime" } }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project:
            {
                currentTime: 1,
                token: 1,
                NoTradeTime: 1,
                Key: 1,
                Strategy: 1,
                ABR_TYPE: 1,
                Symbol: 1,
                Segment: 1,
                OType: 1,
                Expiry: 1,
                Strike: 1,
                isLpInRange: {
                    $cond: {
                        if: {
                            $or: [
                                { $eq: ['$NoTradeTime', "0"] },
                                { $eq: ['$NoTradeTime', ""] },
                            ],
                        },
                        then: -1,
                        else: {
                            $cmp: [
                                { $toInt: '$currentTime' },
                                { $toInt: '$NoTradeTime' },
                            ],
                        },
                    },
                },
            }
        }

    ]
)

//Notrade Time trade Excuted set status 1
db.createView("makecall_NotradeTime_status_excute", "makecall_NotradeTime_status",
    [
        {
            $match: {
                $or: [
                    { isLpInRange: 1 },
                    { isLpInRange: 0 }
                ]
            }
        }
    ]
)





module.exports = { makecallabrView_excute, makecallabrView }

