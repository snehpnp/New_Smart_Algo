const { MongoClient } = require('mongodb');
const axios = require('axios');
const uri = "your_mongodb_connection_string"; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

async function getSourceData(db, source, timeframe, tokensymbol) {
    if (['close', 'open', 'low', 'high'].includes(source)) {
        const sourceVal = await db.collection('BasicMarketData').find().toArray();
        return sourceVal.map(item => item[source]);
    } else {
        const indicatorViewName = `${source}_M${timeframe}_${tokensymbol}_View`;
        const indicatorView = await db.collection(indicatorViewName).find().toArray();
        if (indicatorView.length > 0) {
            return indicatorView.map(item => item.ema);  // Assuming 'ema' field is present
        }
    }
    return [];
}

async function run() {
    try {
        await client.connect();
        const db = client.db('your_database_name'); // Replace with your database name

        const strategyData = await db.collection('StrategyData').find().toArray();

        for (const val of strategyData) {
            const latestMarketData = await db.collection('BasicMarketData').findOne();
            let data = {};

            if (val.condition_source) {
                let condition_source = val.condition_source.split(',');

                for (const source of condition_source) {
                    const sourceVal = await getSourceData(db, source, val.timeframe, val.tokensymbol);
                    if (sourceVal.length > 0) {
                        data[source] = sourceVal;
                    }
                }
            }

            try {
                const condition = eval(val.condition.replace(/(\|\||&&)$/, ''));
                if (condition) {
                    await executeTrade(val, data, latestMarketData);
                } else {
                
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

    // Add your trade execution logic here...
    // e.g., make HTTP request, update database, etc.

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
        .then((response) => {  })
        .catch((error) => {
            console.log('Error in trade execution:', error);
        });
}

run().catch(console.dir);
