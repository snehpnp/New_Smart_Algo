const { MongoClient } = require('mongodb');
const axios = require('axios');
const uri = "your_mongodb_connection_string"; // Replace with your MongoDB connection string
const client = new MongoClient(uri);


db.createView(
    "LatestMarketData",
    "MarketData",
    [
        { $sort: { _id: -1 } },
        { $limit: 1 }
    ]
);


db.createView(
    "IndicatorData",
    "IndicatorCollection",  // Replace with your actual collection name
    [
        { $sort: { _id: -1 } }
    ]
);

db.createView(
    "StrategyData",
    "UserMakeStrategy",
    [
        { $match: { status: '1' } }  // Example match condition
    ]
);


async function run() {
    try {
        await client.connect();
        const db = client.db('your_database_name'); // Replace with your database name

        const strategyData = await db.collection('StrategyData').find().toArray();

        for (const val of strategyData) {
            const latestMarketData = await db.collection('LatestMarketData').findOne();
            const indicatorData = await db.collection('IndicatorData').find().toArray();

            let data = {};

            if (val.condition_source) {
                let condition_source = val.condition_source.split(',');

                for (const source of condition_source) {
                    if (['close', 'open', 'low', 'high'].includes(source)) {
                        let sourceVal = indicatorData.map(item => item[source]);
                        data[source] = sourceVal;
                    } else {
                        let indicatorCollectionName = source + '_M' + val.timeframe + '_' + val.tokensymbol;
                        const indicatorView = await db.collection(indicatorCollectionName).find().toArray();
                        if (indicatorView.length > 0) {
                            let sourceVal = indicatorView.map(item => item.ema);
                            data[source] = sourceVal;
                        }
                    }
                }
            }

            try {
                const condition = eval(val.condition.replace(/(\|\||&&)$/, ''));
                if (condition) {
                    await executeTrade(val, data, latestMarketData);
                } else {
                    console.log("Condition is false for strategy: ", val._id);
                }
            } catch (error) {
                console.log('Error in evaluating the condition:', error);
            }
        }
    } catch (error) {
        console.log('Error running the process:', error);
    }
}

async function executeTrade(val, data, latestMarketData) {
    // Implement your trade execution logic here, similar to what you have in your isFunction
    // Example:
    let entry_type = val.type === 'BUY' ? 'SE' : 'LE';
    const condition_check_previous_trade = {
        strategy: val.strategy_name,
        symbol: val.symbol_name,
        entry_type: entry_type,
        segment: val.segment,
        client_persnal_key: val.panelKey,
        MakeStartegyName: val.show_strategy,
        TradeType: 'MAKE_STRATEGY',
    };


    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BROKER_URL}`,
        headers: {
            'Content-Type': 'text/plain'
        },
        data: `Your request data here...`
    };

    await axios.request(config)
        .then((response) => {
        
        })
        .catch((error) => {
            console.log('Error in trade execution:', error);
        });
}

run().catch(console.dir);
//////////---------------------///////////


db.createView("M_48123_makeStrategyData", "usermakestrategies",
    [
        {
          $match: {
            status: "1",
            timeframe: "",
            tokensymbol: "48123",
          }
        },
        {
          $lookup: {
            from: "M_48123",
            pipeline: [
            ],
            as: "timeFrameData"
          }
        },
        {
            $lookup: {
              from: "emaclose3_M_48123",
              pipeline: [
              ],
              as: "emaclose3Data"
            }
          }
          
      ]
)    



db.createView("strategyViewNames", "usermakestrategies",
    [
        {
          $match: {
            status: "1",
          }
        },
        {
          $addFields: {
            viewName: { 
              $concat: [
                "M", 
                "$timeframe", 
                "_",
                "$tokensymbol", 
                "_make_", 
                "$name"
              ]
            }
          }
        },
        {
          $project: {
            viewName: 1, 
          }
        }   
      ]
)  



  

// Yahan pe hum $arrayElemAt operator ka use kar rahe hain taaki specific indexes ko access kiya ja sake arrays se.

// {
//     "$match": {
//       "$expr": {
//         "$and": [
//           { "$gt": [ { "$arrayElemAt": ["$timeFrameViewData.close", 1] }, { "$arrayElemAt": ["$timeFrameViewData.emaclose3", 1] } ] },
//           { "$lt": [ { "$arrayElemAt": ["$timeFrameViewData.close", 2] }, { "$arrayElemAt": ["$timeFrameViewData.emaclose3", 2] } ] }
//         ]
//       }
//     }
//   }
  