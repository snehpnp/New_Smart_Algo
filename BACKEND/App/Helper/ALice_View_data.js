const db = require('../Models');
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbTradeTools = client.db(process.env.DB_TRADETOOLS);

const ALice_View_data = async (token, response, dbTradeTools) => {
    await connectToDB(response, dbTradeTools, token);
};

async function connectToDB(collectionName, response, dbTradeTools) {
    try {
        const collections = await dbTradeTools.listCollections().toArray();

        // Check if the desired collection exists
        const collectionExists = collections.some(coll => coll.name === collectionName);

        if (collectionExists) {
            const collection = dbTradeTools.collection(collectionName);
            if (response.lp != undefined && response.v != undefined) {
                const customTimestamp = new Date();
                let singleDocument = {
                    _id: customTimestamp,
                    lp: parseFloat(response.lp),
                    v: parseFloat(response.v)
                };
                const insertResult = await collection.insertOne(singleDocument);
            }

            const collectionExistsViews = collections.some(coll => coll.name === 'M3_' + collectionName);
            if (!collectionExistsViews) {
                await createView(collectionName, dbTradeTools);
                await createViewM3(collectionName, dbTradeTools);
                await createViewM5(collectionName, dbTradeTools);
                await createViewM10(collectionName, dbTradeTools);
                await createViewM15(collectionName, dbTradeTools);
                await createViewM30(collectionName, dbTradeTools);
                await createViewM60(collectionName, dbTradeTools);
                await createViewM1DAY(collectionName, dbTradeTools);
            }
        } else {
            await dbTradeTools.createCollection(collectionName);

            const collection = dbTradeTools.collection(collectionName);

            if (response.lp != undefined && response.v != undefined) {
                const customTimestamp = new Date();
                let singleDocument = {
                    _id: customTimestamp,
                    lp: parseFloat(response.lp),
                    v: parseFloat(response.v)
                };
                const insertResult = await collection.insertOne(singleDocument);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function createView(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: '$_id',
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM3(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 3,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M3_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M3_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM5(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 5,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M5_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M5_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM10(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 10,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M10_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M10_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM15(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 15,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M15_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M15_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM30(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 30,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M30_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M30_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM60(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:%M',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 60,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M60_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M60_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function createViewM1DAY(collectionName, dbTradeTools) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: {
                        $toDate: '$_id',
                    },
                    lp: 1,
                    v: 1,
                },
            },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: {
                                $subtract: [
                                    { $toLong: '$_id' },
                                    {
                                        $mod: [
                                            { $toLong: '$_id' },
                                            1000 * 60 * 60 * 24,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    open: { $first: '$lp' },
                    high: { $max: '$lp' },
                    low: { $min: '$lp' },
                    close: { $last: '$lp' },
                    MaxVol: { $max: '$v' },
                    MinVol: { $min: '$v' },
                },
            },
        ];

        const collections = await dbTradeTools.listCollections().toArray();
        const collectionExists = collections.some(coll => coll.name === 'M1DAY_' + collectionName);

        if (!collectionExists) {
            const viewName = 'M1DAY_' + collectionName;
            await dbTradeTools.createCollection(viewName, {
                viewOn: collectionName,
                pipeline: pipeline,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// Create other view functions (createView1, createViewM3, etc.) in a similar way

module.exports = { ALice_View_data };