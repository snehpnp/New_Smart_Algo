const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');


const uri = 'mongodb+srv://snehpnp:snehpnp@newsmartalgo.n5bxaxz.mongodb.net';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// async function createView() {
//     try {
//         await client.connect();

//         const db = client.db('test'); // Replace with your actual database name
//         const currentDate = new Date(); // Get the current date and time

//         // Define the pipeline to create the view
//         const pipeline = [
//             {
//                 $match: {
//                     broker: "2",
//                     TradingStatus: 'on',// Condition from the user collection
//                     $or: [
//                         { EndDate: { $gte: currentDate } }, // EndDate is today or in the future
//                         { EndDate: null } // EndDate is not set
//                     ]
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'client_services',
//                     localField: '_id', // Field from the user collection to match
//                     foreignField: 'user_id', // Field from the client_services collection to match
//                     as: 'client_services'
//                 }
//             },
//             {
//                 $unwind: '$client_services',
//             },
//             {
//                 $lookup: {
//                     from: "services",
//                     localField: "client_services.service_id",
//                     foreignField: "_id",
//                     as: "service",
//                 },
//             },
//             {
//                 $unwind: '$service',
//             },
//             {
//                 $lookup: {
//                     from: "strategies",
//                     localField: "client_services.strategy_id",
//                     foreignField: "_id",
//                     as: "strategys",
//                 },
//             },
//             {
//                 $unwind: '$strategys',
//             },
//             {
//                 $project: {
//                     "client_services": 1,
//                     'service.name': 1,
//                     'service.instrument_token': 1,
//                     'service.exch_seg': 1,
//                     "strategys.strategy_name": 1,
//                     _id: 1,
//                     FullName: 1,
//                     UserName: 1,
//                     Email: 1,
//                     EndDate: 1,
//                     ActiveStatus: 1,
//                     TradingStatus: 1,
//                     access_token: 1,
//                     api_secret: 1,
//                     app_id: 1,
//                     client_code: 1,
//                     api_key: 1,
//                     app_key: 1,
//                     api_type: 1,
//                     demat_userid: 1
//                 }
//             }
//         ];

//         // Create the view
//         await db.createCollection('aliceView', { viewOn: 'users', pipeline });

//         console.log('View created successfully.');
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         client.close();
//     }
// }


async function dropExistingView() {
    try {
        await client.connect();
        const db = client.db('test'); // Replace with your actual database name
        await db.collection('trade_history').drop();
    } catch (error) {
        // Handle any errors if the view doesn't exist
        console.error('Error:', error);
    }
}

// ==========================================================================================


async function TradeHistroy() {
    try {
        await client.connect();
        const db = client.db('test');

        // Define the pipeline to create the view
        const pipeline = [
            {
                $addFields: {
                    entry_type: { $ifNull: ["$entry_type", null] },
                    exit_type: { $ifNull: ["$exit_type", null] },
                    entry_price: { $ifNull: ["$entry_price", null] },
                    exit_price: { $ifNull: ["$exit_price", null] },
                    entry_qty_percent: { $ifNull: ["$entry_qty_percent", null] },
                    exit_qty_percent: { $ifNull: ["$exit_qty_percent", null] }
                }
            },
            {
                $project: {
                    symbol: 1,
                    type:1,
                    price:1,
                    qty_percent:1,
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
                    entry_price: 1,
                    exit_price: 1,
                    entry_qty_percent: 1,
                    exit_qty_percent: 1
                }
            }
        ];
        

        // Create the view
        await db.createCollection('trade_history', { viewOn: 'signals', pipeline });

        console.log('View created successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}
// module.exports = { createView, dropExistingView,TradeHistroy }
module.exports = { dropExistingView, TradeHistroy }

