const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function dropExistingView1() {


    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME); // Replace with your actual database name
        await db.collection('open_position').drop();
console.log("Dobne");
    } catch (error) {
        // Handle any errors if the view doesn't exist
        console.error('Error:', error);
    }
}


async function Open_Position1(req, res) {
    try {


        await client.connect();
        const db = client.db(process.env.DB_NAME);

       console.log("run");

       const today = new Date();
       today.setHours(0, 0, 0, 0);

        const pipeline = [
            {
              $match: {
                createdAt: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
                sl_status: '1',
              
              }
            },
         
      
            // {
            //   $lookup: {
            //     from: "strategies",
            //     localField: "client_services.strategy_id",
            //     foreignField: "_id",
            //     as: "strategys",
            //   },
            // },
            // {
            //   $unwind: '$strategys',
            // },
            // {
            //   $project: {
              
            //     _id: 1,
            //     FullName: 1,
            //     UserName: 1,
            //     Email: 1,
            //     EndDate: 1,
            //     ActiveStatus: 1,
            //     TradingStatus: 1,
            //     access_token: 1,
            //     api_secret: 1,
            //     app_id: 1,
            //     client_code: 1,
            //     api_key: 1,
            //     app_key: 1,
            //     api_type: 1,
            //     demat_userid: 1,
            //     client_key: 1,
            //     web_url: 1
            //   }
            // }
           
          ];





        // Create the view
        await db.createCollection('open_position', { viewOn: 'mainsignals', pipeline });

        console.log('View created successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}




module.exports = { dropExistingView1, Open_Position1 }

