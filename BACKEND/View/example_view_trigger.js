const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017/your_database';

// Database Name
const dbName = 'your_database';

async function createViewAndMonitor() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db(dbName);
    const viewName = 'your_view';
  //  const viewPipeline = [...]; // Your aggregation pipeline here

    // Create or update the view
    await database.createCollection(viewName, { viewOn: 'your_source_collection', pipeline: viewPipeline });

    // Create a change stream on the view
    const changeStream = database.collection(viewName).watch();

    // Listen for changes
    changeStream.on('change', (change) => {
      if (change.operationType === 'update' && change.updateDescription.updatedFields.status_return === true) {
        // Trigger your event or update the relevant collection
        console.log('Status_return is true. Trigger your event here.');
      }
    });

    // Keep the application running
    await new Promise((resolve) => setInterval(resolve, 1000));
  } finally {
    await client.close();
  }
}

createViewAndMonitor();
