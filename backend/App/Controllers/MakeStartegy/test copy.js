const { MongoClient } = require('mongodb');
const assert = require('assert');

// Connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'yourDatabaseName';

// Create a MongoDB client and connect to the server
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(conditionString) {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('yourCollectionName');

    // Example condition string
    // const conditionString = '(data.close[1]>data.emaclose3[1])&&(data.close[2]<data.emaclose3[2])';

    // Parse the condition string to extract array indexes and field names
    const matches = conditionString.match(/data\.(\w+)\[(\d+)\]/g);
    if (!matches) {
      throw new Error('Invalid condition string format');
    }

    // Build the $match stage dynamically
    const matchStage = {
      $match: {
        $expr: {
          $and: []
        }
      }
    };

    matches.forEach(match => {
      const parts = match.match(/data\.(\w+)\[(\d+)\]/);
      const fieldName = parts[1]; // e.g., 'close', 'emaclose3'
      const arrayIndex = parseInt(parts[2]); // e.g., 1, 2

      // Add conditions to $and array
      if (fieldName && arrayIndex >= 0) {
        matchStage.$match.$expr.$and.push({
          $gt: [
            { $arrayElemAt: [`$timeFrameViewData.${fieldName}`, arrayIndex] },
            { $arrayElemAt: [`$timeFrameViewData.${fieldName}`, arrayIndex] }
          ]
        });
      }
    });

    // Example: Execute aggregation pipeline with the dynamically built match stage
    const cursor = await collection.aggregate([ matchStage ]);

    // Iterate over the cursor to process results
    await cursor.forEach(doc => {
  
    });

  } finally {
    // Close the client
    await client.close();
  }
}

// Example usage:
const conditionString = '(data.close[1]>data.emaclose3[1])&&(data.close[2]<data.emaclose3[2])';
run(conditionString)
  .catch(err => console.log(err));
