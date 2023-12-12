const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();



async function dropExistingView1() {
    try {
        // await client.connect();
        const db = client.db(process.env.DB_NAME); // Replace with your actual database name
        await db.collection('open_position_excute').drop();
        console.log("Dobne");
    } catch (error) {
        // Handle any errors if the view doesn't exist
        console.error('Error:', error);
    }
}


async function Open_Position1(req, res) {

    try {
      
        var dbName = process.env.DB_NAME;
        const sourceViewName = 'open_position';
        const destinationViewName = 'open_position_excute';

        const pipeline = [
            {
              $match: {
                $or: [
                  { isLpInRange1: true },
                  { isLpInRange: 1 }
                ]
              }
            }
          ];
          
        const options = { cursor: { batchSize: 1 } };
        const result = await client
            .db(dbName)
            .collection(sourceViewName)
            .aggregate(pipeline, options)
            .toArray();
        // Check if the aggregation was successful
        if (result.length > 0) {
            // Create the destination view with the result's cursor
            await client.db(dbName).createCollection(destinationViewName, {
                viewOn: sourceViewName,
                pipeline: pipeline,
            });

            console.log('Destination view created successfully');
        } else {
            console.error('Error in aggregation:', result);
        }


    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Ensure the client is closed even if an error occurs
        await client.close();
    }
}

module.exports = { dropExistingView1, Open_Position1 }



// db.createView('open_position', 'mainsignals', [

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
//         $match: {
//             $expr: {
//                 $ne: ['$entry_qty_percent', 0]
//             }
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
//         $project: {
//             _id: 1,
//             symbol: 1,
//             entry_type: 1,
//             entry_price: 1,
//             entry_qty_percent: 1,
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
//             exit_time_test: 1,
//             stockInfo_curtime: 1,
//             stockInfo_lp: 1,
            
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
//     },
// ]);