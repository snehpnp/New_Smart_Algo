const db = require('../App/Models');
const dbTest = db.dbTest;


async function createViewIcicidirect() {


    try {
        const views = await dbTest.listCollections({ name: 'icicidirectview' }).toArray();
        if (views.length > 0) {
            return;
        } else {
            const currentDate = new Date();

            const pipeline = [
                {
                    $match: {
                        broker: "25",
                        TradingStatus: 'on',
                        $or: [
                            { EndDate: { $gte: currentDate } },
                            { EndDate: null }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'client_services',
                        localField: '_id',
                        foreignField: 'user_id', // Field from the client_services collection to match
                        as: 'client_services'
                    }
                },
                {
                    $unwind: '$client_services',
                },
                {
                    $match: {
                        'client_services.active_status': '1'
                    }
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
                        from: "categories",
                        localField: "service.categorie_id",
                        foreignField: "_id",
                        as: "category",
                    },
                },
                {
                    $unwind: '$category',
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
                        "client_services": 1,
                        'service.name': 1,
                        'service.instrument_token': 1,
                        'service.exch_seg': 1,
                        "strategys.strategy_name": 1,
                        "category.segment": 1,
                        "service.zebu_token": 1,
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
                        demat_userid: 1,
                        client_key: 1,
                        web_url: 1
                    }
                },
                {
                    $addFields: {



                        postdata:
                        {

                            exchange_code: {
                                $cond: {
                                    if: { $eq: ['$category.segment', 'C'] }, // Your condition here
                                    then: 'NSE',
                                    else: {
                                        $cond: {
                                            if: {
                                                $or: [
                                                    { $eq: ['$category.segment', 'F'] },
                                                    { $eq: ['$category.segment', 'O'] },
                                                    { $eq: ['$category.segment', 'FO'] }
                                                ]
                                            },
                                            then: 'NFO',
                                            else: {

                                                $cond: {
                                                    if: {
                                                        $or: [
                                                            { $eq: ['$category.segment', 'MF'] },
                                                            { $eq: ['$category.segment', 'MO'] }
                                                        ]
                                                    },
                                                    then: 'MCX',
                                                    else: {

                                                        $cond: {
                                                            if: {
                                                                $or: [
                                                                    { $eq: ['$category.segment', 'CF'] },
                                                                    { $eq: ['$category.segment', 'CO'] }
                                                                ]
                                                            },
                                                            then: 'CDS',

                                                            // all not exist condition 
                                                            else: "NFO"

                                                        }

                                                    }

                                                }


                                            }

                                        }

                                    }

                                }
                            },



                            product: {
                                $cond: {
                                    if: { $eq: ['$category.segment', 'C'] }, // Your condition here
                                    then: 'cash',
                                    else: {
                                        $cond: {
                                            if: {
                                                $or: [
                                                    { $eq: ['$category.segment', 'F'] },
                                                    { $eq: ['$category.segment', 'cf'] },
                                                    { $eq: ['$category.segment', 'mf'] }
                                                ]
                                            },
                                            then: 'futures',
                                            else: {

                                                $cond: {
                                                    if: {
                                                        $or: [
                                                            { $eq: ['$category.segment', 'o'] },
                                                            { $eq: ['$category.segment', 'mo'] },
                                                            { $eq: ['$category.segment', 'fo'] },
                                                            { $eq: ['$category.segment', 'co'] }


                                                        ]
                                                    },
                                                    then: 'options',
                                                    else: 'options'

                                                }


                                            }

                                        }

                                    }

                                }
                            },

                            action: 'buy',


                            order_type: {
                                $cond: {
                                    if: {
                                        $and:
                                            [
                                                { $eq: ['$client_services.order_type', '1'] },
                                            ]
                                    },
                                    then: 'market',
                                    else: {
                                        $cond: {
                                            if: {
                                                $and:
                                                    [
                                                        { $eq: ['$client_services.order_type', '2'] },
                                                    ]
                                            },
                                            then: 'limit',
                                            else: {
                                                $cond: {
                                                    if: {
                                                        $and:
                                                            [
                                                                { $eq: ['$client_services.order_type', '3'] },
                                                            ]
                                                    },
                                                    then: 'stoploss',
                                                    else: {
                                                        $cond: {
                                                            if: {
                                                                $and:
                                                                    [
                                                                        { $eq: ['$client_services.order_type', '4'] },
                                                                    ]
                                                            },
                                                            then: 'stoploss',

                                                            else: "market"

                                                        }

                                                    }

                                                }

                                            }

                                        }
                                    }

                                }

                            },


                            stoploss: '',

                            quantity: {
                                $cond: {
                                    if: {
                                        $or: [
                                            { $eq: ['$category.segment', 'MF'] },
                                            { $eq: ['$category.segment', 'MO'] }
                                        ]
                                    },
                                    then: "$client_services.lot_size",
                                    else: "$client_services.quantity"

                                }

                            },


                            price: '',

                            validity: 'DAY',





                        }
                    }
                }
            ];

            // Create the view
            await dbTest.createCollection('icicidirectview', { viewOn: 'users', pipeline });

            console.log('icicidirect View created successfully.');
            return
        }

    } catch (error) {
        return;
    } 
}
async function dropViewIcicidirect() {
    try {
        await dbTest.dropCollection('icicidirectview');
        console.log('icicidirect View dropped successfully.');
    } catch (error) {
        return;
    }
}

module.exports = { createViewIcicidirect,dropViewIcicidirect }

