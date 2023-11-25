const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function dropExistingView1() {


    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME); // Replace with your actual database name
        await db.collection('open_position_excute').drop();
        console.log("Dobne");
    } catch (error) {
        // Handle any errors if the view doesn't exist
        console.error('Error:', error);
    }
}


// async function Open_Position1(req, res) {

//     try {
//         // Connect to the MongoDB server
//         await client.connect();

//         // Database and view names
//         const dbName = process.env.DB_NAME;
//         const sourceViewName = 'open_position';
//         const destinationViewName = 'open_position_excute';


//         const pipeline = [];
//         const options = { cursor: { batchSize: 1 } };

//         const result = await client
//             .db(dbName)
//             .collection(sourceViewName)
//             .aggregate(pipeline, options)
//             .toArray();

//         // Check if the aggregation was successful
//         if (result.length > 0) {
//             // Create the destination view with the result's cursor
//             await client.db(dbName).createCollection(destinationViewName, {
//                 viewOn: sourceViewName,
//                 pipeline: pipeline,
//             });

//             console.log('Destination view created successfully');
//         } else {
//             console.error('Error in aggregation:', result);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         // Ensure the client is closed even if an error occurs
//         await client.close();
//     }
// }


async function Open_Position1(req, res) {

    try {
        // Connect to the MongoDB server
        await client.connect();

        const db = client.db(process.env.DB_NAME);
   
   
   
        const pipeline = [
            {
                $addFields: {
                    entry_price: { $toDouble: '$entry_price' },
                    target: {
                        $add: [
                            { $ifNull: [{ $toDouble: '$target' }, 0] },
                            { $toDouble: '$entry_price' },
                        ],
                    },
                },
            },
            {
                $addFields: {
                    target_1: {
                        $cond: {
                            if: { $eq: ['$target', null] },
                            then: 0, // Default value if 'target' is not present
                            else: '$target',
                        },
                    },
                },
            },
            // Other pipeline stages as needed
        ];
        
        // Perform the aggregation and store the result in a new collection
        const result = await db.collection('mainsignals').aggregate(pipeline).toArray();
        await db.createCollection('open_position', { viewOn: 'mainsignals' });
        
        


        console.log("Done");
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Ensure the client is closed even if an error occurs
        await client.close();
    }
}




module.exports = { dropExistingView1, Open_Position1 }

