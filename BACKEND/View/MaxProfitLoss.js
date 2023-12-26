const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();

const db = client.db(process.env.DB_NAME); // Replace with your actual database name



async function createViewMaxProfitLoss() {
    

  const collectionName  = 'mainsignals';
  const collection = db.collection(collectionName);
 console.log("okkk createViewMaxProfitLoss")
 
  // All Client Trading on view
  try {

    const currentDate = new Date(); // Get the current date and time
   
    // const Pipeline = [
     
    //   {
    //     $lookup: {
    //       from: 'usermakestrategies',
    //       localField: 'MakeStartegyName',
    //       foreignField: 'show_strategy',
    //       as: 'joinedData'
    //     }
    //   },
    //   {
    //       $unwind: '$joinedData',
    //     },
    // ];
    // const result = await collection.aggregate(Pipeline).toArray();

    // console.log(result);

    const Pipeline = [
      {
        $lookup: {
          from: 'usermakestrategies',
          let: { makeStrategyName: '$MakeStartegyName' }, // Define variables for the local and foreign fields
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$show_strategy', '$$makeStrategyName'] // Match the specified condition
                }
              }
            }
          ],
          as: 'joinedData'
        }
      },

      {
        $unwind: '$joinedData'
      },

      {
        $lookup: {
          from: "alice_tokens",
          localField: "joinedData.tokensymbol",
          foreignField: "instrument_token",
          as: "StockLivePriceData",
        },
      },
     


      {
        $unwind: '$StockLivePriceData'
      },
      
      

     
      {
        $group: {
          _id: '$_id', // Group by the original document's _id
        //  count: { $sum: 1 }, // Example: Count the number of documents in each group
          //avgType: { $avg: '$joinedData.type' } // Example: Calculate the average of 'type' in each group
          
          symbol: { $first: '$symbol' },
          entry_type: { $first: '$entry_type' },
          exit_type: { $first: '$exit_type' },
          entry_price: { $first: '$entry_price' },
          exit_price: { $first: '$exit_price' },
          entry_qty_percent: { $first: '$entry_qty_percent' },
          exit_qty_percent: { $first: '$exit_qty_percent' },
          entry_qty: { $first: '$entry_qty' },
          exit_qty: { $first: '$exit_qty' },
        
          joinedData: { $first: '$joinedData' },
          StockLivePriceData: { $first: '$StockLivePriceData' }
        
        }
      },

      {
        $addFields: {
          price_difference: {
            $subtract: [
              { $toDouble: '$exit_price' },
              { $toDouble: '$entry_price' }
            ]
          },
          multiplied_qty: {
            $multiply: [
              { $toDouble: '$entry_qty' },
              {
                $subtract: [
                  { $toDouble: '$exit_price' },
                  { $toDouble: '$entry_price' }
                ]
              }
            ]
          },
          key_comparison_result: {
            $cond: {
              if: {
                $and: [
                  { $eq:[ '$entry_qty', '$exit_qty'] },
                ]
              },
              then: {
                $multiply: [
                  { $toDouble: '$entry_qty' },
                  {
                    $subtract: [
                      { $toDouble: '$exit_price' },
                      { $toDouble: '$entry_price' }
                    ]
                  }
                ]
              },
              else: 0
            }
            
          }
        }
      },
      
      {
        $project :
        {
        symbol:1,
        entry_type:1,
        exit_type:1,
        entry_price:1,
        exit_price:1,
        entry_qty_percent:1,
        exit_qty_percent:1,
        entry_qty:1,
        exit_qty:1,
       'joinedData.show_strategy':1,
       'joinedData.tokensymbol':1,
       'joinedData.type':1,
       'joinedData.maxProfit':1,
       'joinedData.maxLoss':1,
        price_difference:1,
        multiplied_qty:1,
        key_comparison_result:1,
        'StockLivePriceData.option_type':1,
        'StockLivePriceData.tradesymbol':1,
        'StockLivePriceData.symbol':1,
        
       
        

        }
      },

     

    ];
    
    const result = await collection.aggregate(Pipeline).toArray();
    console.log(result);
    
    

    console.log("okkk done")
      
    


  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}


module.exports = { createViewMaxProfitLoss }

