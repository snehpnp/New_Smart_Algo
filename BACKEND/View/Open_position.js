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
        // Connect to the MongoDB server
        await client.connect();

        // Database and view names
        const dbName = process.env.DB_NAME;
        const sourceViewName = 'open_position';
        const destinationViewName = 'open_position_excute';


        const pipeline = [
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
                    stockInfo: { $arrayElemAt: ['$stockInfo', 0] }, // Extract the first element from the array
                    stockInfo_lp_int: { $toInt: '$stockInfo.lp' }, // Convert stockInfo.lp to integer
                },
            },
            {
                $match: {
                    stockInfo_lp_int: { $gt: '$target' },
                },
            },
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
//       $addFields: {
//         target: {
//           $add: [
//             { $toDouble: '$entry_price' },
//             { $ifNull: [{ $toDouble: '$target' }, 0] },
//           ],
//         },
//         stop_loss: {
//           $subtract: [
//             { $toDouble: '$entry_price' },
//             { $ifNull: [{ $toDouble: '$stop_loss' }, 0] },
//           ],
//         },
//         // Add exit_time with ":00" added at the end
//         exit_time: {
//           $concat: ['$exit_time', ':00'],
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 1, // Include the _id field if needed
// symbol:1,
// entry_type:1,
// entry_price:1,
// entry_qty_percent:1,
// exit_qty_percent:1,
// exchange:1,
// strategy:1,
// segment:1,
// trade_symbol:1,
// client_persnal_key:1,
// TradeType:1,
// token:1,
// lot_size:1,
// complete_trade:1,
// option_type:1,
// dt_date:1,
// strike:1,
// expiry:1,
// target: 1,
// stop_loss: 1,
// exit_time: 1,
//         // Include other fields you want to keep in the view
//       },
//     },
//     // Additional pipeline stages if needed
//   ]);


