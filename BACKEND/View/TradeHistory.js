const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
const db = client.db(process.env.DB_NAME);

async function dropExistingView() {


    try {
        // Replace with your actual database name
        await db.collection('trade_history').drop();

    } catch (error) {
        // Handle any errors if the view doesn't exist
        console.log('Error:', error);
    }
}


async function TradeHistroy(req, res) {


    try {

        // Define the pipeline to create the view
        // const pipeline = [
        //     {
        //         $addFields: {
        //             entry_type: { $ifNull: ["$entry_type", null] },
        //             exit_type: { $ifNull: ["$exit_type", null] },
        //             entry_price: { $ifNull: ["$entry_price", null] },
        //             exit_price: { $ifNull: ["$exit_price", null] },
        //             entry_qty_percent: { $ifNull: ["$entry_qty_percent", null] },
        //             exit_qty_percent: { $ifNull: ["$exit_qty_percent", null] },
        //             createdAt: { $toDate: "$createdAt" },
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 symbol: "$symbol",
        //                 strategy: "$strategy",
        //                 strike: "$dt_date"
        //             },

        //             signal_id: { $push: "$_id" },
        //             symbol: { $first: "$symbol" },
        //             exchange: { $first: "$exchange" },
        //             strategy: { $first: "$strategy" },
        //             strike: { $first: "$strike" },
        //             option_type: { $first: "$option_type" },
        //             segment: { $first: "$segment" },

        //             // minCreatedAtLE: {
        //             //     $min: {
        //             //         $cond: [{ $eq: ["$type", "LE"] }, "$createdAt", null]
        //             //     }
        //             // },

        //             MinCreateLE: {
        //                 $ifNull: [
        //                     {
        //                         $min: {
        //                             $cond: [{ $eq: ["$type", "LE"] }, "$createdAt", null]
        //                         }
        //                     },
        //                     new Date(0) // Provide a default value if minCreatedAtLE is null
        //                 ]
        //             },

        //             entry_type: {
        //                 $max: {
        //                     $cond: [
        //                         { $eq: ["$type", "LE"] },
        //                         "LE",
        //                         null
        //                     ]
        //                 }
        //             },
        //             exit_type: {
        //                 $max: {
        //                     $cond: [
        //                         {
        //                             $and: [
        //                                 { $eq: ["$type", "LX"] },
        //                                 {
        //                                     $gt: [
        //                                         "$createdAt",
        //                                         {
        //                                             $ifNull: [
        //                                                 {
        //                                                     $min: {
        //                                                         $cond: [{ $eq: ["$type", "LE"] }, "$createdAt", null]
        //                                                     }
        //                                                 },
        //                                                 new Date(0) // Provide a default value if minCreatedAtLE is null
        //                                             ]
        //                                         }
        //                                     ]
        //                                 }
        //                             ],
        //                         },
        //                         "LX",
        //                         null
        //                     ]
        //                 }
        //             },
        //             entry_price: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$type", "LE"] },
        //                         { $toDouble: "$price" }, // Convert string to number
        //                         0,
        //                     ],
        //                 },
        //             },
        //             exit_price: {
        //                 $sum: {
        //                     $cond: [
        //                         {
        //                             $and: [
        //                                 { $eq: ["$type", "LX"] },
        //                                 {
        //                                     $gt: [
        //                                         "$createdAt",
        //                                         {
        //                                             $ifNull: [
        //                                                 {
        //                                                     $min: {
        //                                                         $cond: [{ $eq: ["$type", "LE"] }, "$createdAt", null]
        //                                                     }
        //                                                 },
        //                                                 new Date(0) // Provide a default value if minCreatedAtLE is null
        //                                             ]
        //                                         }
        //                                     ]
        //                                 }
        //                             ],
        //                         },
        //                         { $toDouble: "$price" }, // Convert string to number
        //                         0,
        //                     ],
        //                 },
        //             },
        //             entry_qty_percent: {
        //                 $sum: {
        //                     $cond: [
        //                         { $eq: ["$type", "LE"] },
        //                         { $toDouble: "$qty_percent" }, // Convert string to number
        //                         0,
        //                     ],
        //                 },
        //             },
        //             exit_qty_percent: {
        //                 $sum: {
        //                     $cond: [
        //                         {
        //                             $and: [
        //                                 { $eq: ["$type", "LX"] },
        //                                 {
        //                                     $gt: [
        //                                         "$createdAt",
        //                                         {
        //                                             $ifNull: [
        //                                                 {
        //                                                     $min: {
        //                                                         $cond: [{ $eq: ["$type", "LE"] }, "$createdAt", null]
        //                                                     }
        //                                                 },
        //                                                 new Date(0) // Provide a default value if minCreatedAtLE is null
        //                                             ]
        //                                         }
        //                                     ]
        //                                 }
        //                             ],
        //                         },
        //                         { $toDouble: "$qty_percent" }, // Convert string to number
        //                         0,
        //                     ],
        //                 },
        //             },

        //             trade_symbol: { $first: "$trade_symbol" },
        //             client_persnal_key: { $first: "$client_persnal_key" },
        //             token: { $first: "$token" },


        //         }
        //     },

        //     {
        //         $project: {
        //             _id: 0,
        //             symbol: 1,
        //             exchange: 1,
        //             strategy: 1,
        //             strike: 1,
        //             option_type: 1,
        //             segment: 1,
        //             trade_symbol: 1,
        //             client_persnal_key: 1,
        //             token: 1,
        //             entry_type: 1,
        //             exit_type: 1,
        //             entry_price: 1,
        //             exit_price: 1,
        //             entry_qty_percent: 1,
        //             exit_qty_percent: 1,
        //             signal_id: 1,
        //             MinCreateLE: 1,
        //         }
        //     }
        // ];


        const pipeline = [
            {
                $addFields: {
                    entry_type: { $ifNull: ["$entry_type", null] },
                    exit_type: { $ifNull: ["$exit_type", null] },
                    entry_price: { $ifNull: ["$entry_price", null] },
                    exit_price: { $ifNull: ["$exit_price", null] },
                    entry_qty_percent: { $ifNull: ["$entry_qty_percent", null] },
                    exit_qty_percent: { $ifNull: ["$exit_qty_percent", null] },
                    
                }
            },
           
            {
                $group: {

                    typeLeMax: {
                        $max: {
                            $cond: [
                                { $eq: ["$type", "LE"] },
                                "$createdAt",
                                null
                            ]
                        }
                    },
                    typeLxMax: {
                        $max: {
                            $cond: [
                                { $eq: ["$type", "LX"] },
                                "$createdAt",
                                null
                            ]
                        }
                    },
                     
                    _id: {

                        symbol: "$symbol",
                        strategy: "$strategy",
                        dt_date: "$dt_date",
                        strike: "$strike",
                        segment: "$segment",
                        TradeType: "$TradeType",
                        exchange: "$exchange",
                       

                    },
                    signal_id: { $push: "$_id" },
                    symbol: { $first: "$symbol" },
                    exchange: { $first: "$exchange" },
                    strategy: { $first: "$strategy" },
                    strike: { $first: "$strike" },
                    option_type: { $first: "$option_type" },
                    segment: { $first: "$segment" },

                

                    totalQuantityLE: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$type", "LE"] }, // Replace "your_condition" with your actual condition
                                then: { $toInt: "$qty_percent" },
                                else: 0 // Use 0 or the desired value for non-matching documents
                            }
                        }
                    },
                    totalPriceLE: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$type", "LE"] },
                                then: {
                                    $multiply: [
                                        { $toDouble: "$price" }, // Convert "price" to a double
                                        { $toInt: "$qty_percent" } // Convert "qty" to an integer
                                    ]
                                },
                                else: 0

                            }
                        }
                    },

                    totalQuantityLX: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$type", "LX"] }, // Replace "your_condition" with your actual condition
                                then: { $toInt: "$qty_percent" },
                                else: 0 // Use 0 or the desired value for non-matching documents
                            }
                        }
                    },
                    totalPriceLX: {
                        $sum: {
                            $cond: {
                                if: { $eq: ["$type", "LX"] },
                                then: {
                                    $multiply: [
                                        { $toDouble: "$price" }, // Convert "price" to a double
                                        { $toInt: "$qty_percent" } // Convert "qty" to an integer
                                    ]
                                },
                                else: 0

                            }
                        }
                    },
                    entry_type: {
                        $max: {
                            $cond: [
                                { $eq: ["$type", "LE"] },
                                "LE",
                                null
                            ]
                        }
                    },

                    exit_type: {
                        $max: {
                            $cond: [
                                { $eq: ["$type", "LX"] },
                                "LX",
                                null
                            ]
                        }
                    },

                    entry_qty_percent: {

                        $sum: {

                            $cond: [

                                { $eq: ["$type", "LE"] },

                                { $toDouble: "$qty_percent" }, // Convert string to number

                                0

                            ]

                        }

                    },

                    exit_qty_percent: {

                        $sum: {

                            $cond: [

                                { $eq: ["$type", "LX"] },

                                { $toDouble: "$qty_percent" }, // Convert string to number

                                0

                            ]

                        }

                    },

                    trade_symbol: { $first: "$trade_symbol" },
                    client_persnal_key: { $first: "$client_persnal_key" },
                    token: { $first: "$token" },
                }
            },
            {
                $project: {
                    _id: 0,
                    symbol: 1,
                    exchange: 1,
                    strategy: 1,
                    strike: 1,
                    option_type: 1,
                    segment: 1,
                    trade_symbol: 1,
                    client_persnal_key: 1,
                    token: 1,
                    entry_type: 1,
                    exit_type: 1,
                    entry_price: {
                        $cond: {
                            if: { $eq: ["$totalQuantityLE", 0] }, // Handle division by zero
                            then: 0,
                            else: {
                                $divide: ["$totalPriceLE", "$totalQuantityLE"]
                            }
                        }
                    },
                    exit_price: {
                        $cond: {
                            if: { $eq: ["$totalQuantityLX", 0] }, // Handle division by zero
                            then: 0,
                            else: {
                                $divide: ["$totalPriceLX", "$totalQuantityLX"]
                            }
                        }
                    },
                    entry_qty_percent: 1,
                    exit_qty_percent: 1,
                    signal_id: 1,
                    lot_size: 1,
                    TradeType:1,
                    typeLeMax: 1,
                    typeLxMax: 1
                    //  totalQuantity: 1,
                    // totalPrice:1

                }

            }

        ];





        // Create the view
        await db.createCollection('trade_history', { viewOn: 'signals', pipeline });

        console.log('View created successfully.');
    } catch (error) {
        console.log('Error:', error);
    } finally {
        client.close();
    }
}




module.exports = { dropExistingView, TradeHistroy }

