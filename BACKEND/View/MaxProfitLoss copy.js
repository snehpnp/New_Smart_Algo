const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');


const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect();

const db = client.db(process.env.DB_NAME); // Replace with your actual database name



async function createViewMaxProfitLoss() {
    

  const collectionName  = 'mainsignals';
  const collection = db.collection(collectionName);
 
  // All Client Trading on view
  try {

    const currentDate = new Date(); // Get the current date and time
   
    

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
          from: "stock_live_price",
          localField: "joinedData.tokensymbol",
          foreignField: "_id",
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
         
          get_exit_live_price: {
            $cond: {
              if: {
                $and: [
                  { $gt: ['$entry_qty', '$exit_qty'] },
                  { $ne: ['$exit_qty', 0] } // Ensure exit_qty is not zero to avoid division by zero
                ]
              },
              then: {
                $divide: [
                  {
                    $add: [
                      {
                        $multiply: [
                          { $toDouble: '$StockLivePriceData.bp1' },
                          { 
                          $subtract: [
                            { $toDouble: '$entry_qty' },
                            { $toDouble: '$exit_qty' }
                          ]
                          }
                        ]
                      },

                      {
                        $multiply: [  
                        {$toDouble: '$exit_price'},
                        {$toDouble: '$exit_qty'}, 
                        ]
                      } // Convert exit_price to numeric type
                    ]
                  },
                  {
                    $add: [
                      { $toDouble: '$exit_qty' }, // Convert exit_qty to numeric type
                      { $subtract: [
                        { $toDouble: '$entry_qty' },
                        { $toDouble: '$exit_qty' }
                      ] }
                    ]
                  }
                ]
              },
              else: 0
            }
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
              else: {
                $cond: {
                  if: {
                    $and: [
                      { $gt: ['$entry_qty', '$exit_qty'] },
                      { $ne: ['$exit_qty', 0] } // Ensure exit_qty is not zero to avoid division by zero
                    ]
                  },
                  then: {
                    $divide: [
                      {
                        $add: [
                          {
                            $multiply: [
                              { $toDouble: '$StockLivePriceData.bp1' },
                              { 
                              $subtract: [
                                { $toDouble: '$entry_qty' },
                                { $toDouble: '$exit_qty' }
                              ]
                              }
                            ]
                          },
    
                          {
                            $multiply: [  
                            {$toDouble: '$exit_price'},
                            {$toDouble: '$exit_qty'}, 
                            ]
                          } // Convert exit_price to numeric type
                        ]
                      },
                      {
                        $add: [
                          { $toDouble: '$exit_qty' }, // Convert exit_qty to numeric type
                          { $subtract: [
                            { $toDouble: '$entry_qty' },
                            { $toDouble: '$exit_qty' }
                          ] }
                        ]
                      }
                    ]
                  },
                  else: 0
                }
              }
            }
            
          },

          
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
        key_comparison_result:1,
        'StockLivePriceData.bp1':1,
        'StockLivePriceData.lp':1,
        'StockLivePriceData.sp1':1,
        get_exit_live_price:1
        

        }
      },
  

    ];
    
    const result = await collection.aggregate(Pipeline).toArray();


  } catch (error) {
    console.log('Error:', error);
  } finally {
    client.close();
  }
}


module.exports = { createViewMaxProfitLoss }

