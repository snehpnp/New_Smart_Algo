const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://snehpnp:snehpnp@newsmartalgo.n5bxaxz.mongodb.net';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function createView() {
    try {
        await client.connect();

        const db = client.db('test'); // Replace with your actual database name
        const currentDate = new Date(); // Get the current date and time

        // Define the pipeline to create the view
        const pipeline = [
            {
                $match: {
                    broker: "2",
                    TradingStatus: 'on',// Condition from the user collection
                    $or: [
                        { EndDate: { $gte: currentDate } }, // EndDate is today or in the future
                        { EndDate: null } // EndDate is not set
                    ]
                }
            },
            {
                $lookup: {
                    from: 'client_services',
                    localField: '_id', // Field from the user collection to match
                    foreignField: 'user_id', // Field from the client_services collection to match
                    as: 'client_services'
                }
            },
            {
                $unwind: '$client_services',
            },
            {
                $lookup: {
                    from: "services",
                    localField: "client_services.service_id",
                    foreignField: "_id",
                    as: "service",
                },
            },
            {
                $unwind: '$service',
            },
            {
                $lookup: {
                    from: "strategies",
                    localField: "client_services.strategy_id",
                    foreignField: "_id",
                    as: "strategys",
                },
            },
            {
                $unwind: '$strategys',
            },
            {
                $project: {
                    "client_services.service_id": 1,
                    'service.name': 1,
                    'service.instrument_token': 1,
                    'service.exch_seg': 1,
                    "strategys.strategy_name": 1,
                    _id: 1,
                    FullName: 1,
                    UserName: 1,
                    Email: 1,
                    EndDate: 1,
                    ActiveStatus: 1,
                    TradingStatus: 1,
                    access_token: 1,
                    api_secret: 1,
                    app_id: 1,
                    client_code: 1,
                    api_key: 1,
                    app_key: 1,
                    api_type: 1,
                    demat_userid: 1
                    // Add other fields you want in the view
                }
            }
        ];

        // Create the view
        await db.createCollection('aliceView', { viewOn: 'users', pipeline });

        console.log('View created successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}


async function dropExistingView() {
    try {
        await client.connect();
        const db = client.db('test'); // Replace with your actual database name
        await db.collection('aliceView').drop();
    } catch (error) {
        // Handle any errors if the view doesn't exist
        console.error('Error:', error);
    }
}

// Call the function 
// createView();
module.exports = { createView, dropExistingView }
