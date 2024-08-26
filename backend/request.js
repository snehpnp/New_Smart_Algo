module.exports = function (app) {
    const axios = require('axios');
    const db = require('./App/Models');
    const Alice_token = db.Alice_token;
    var dateTime = require('node-datetime');
    var moment = require('moment');
    const { MongoClient } = require('mongodb');
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;
    const User = db.user;
    const services = db.services;
    const categorie = db.categorie;
    const live_price = db.live_price;
    const UserMakeStrategy = db.UserMakeStrategy;
    const Get_Option_Chain_modal = db.option_chain_symbols;
    const company = db.company_information;
    const Roledata = db.role;
    const dbTest = db.dbTest;
    const get_open_position_view = db.open_position;
    const MainSignals = db.MainSignals;




    const Broker_information = db.Broker_information;
    const { DashboardView } = require('./View/DashboardData')
    const { createView, dropOpenPosition, open_position_excute } = require('./View/Open_position')
    const { MainSignalsRemainToken, service_token_update, TokenSymbolUpdate } = require('./App/Cron/cron')
    const { createViewAlice } = require('./View/Alice_blue')
    const { createViewAngel } = require('./View/Angel')
    const { createViewDhan } = require('./View/dhan')
    const { createViewFivepaisa } = require('./View/fivepaisa')
    const { createViewFyers } = require('./View/fyers')
    const { createViewIifl } = require('./View/Iifl')
    const { createViewKotakNeo } = require('./View/KotakNeo')
    const { createViewMarketHub } = require('./View/markethub')
    const { createViewMastertrust } = require('./View/Mastertrust')
    const { createViewMotilalOswal } = require('./View/MotilalOswal')
    const { createViewSwastika } = require('./View/swastika')
    const { createViewUpstox } = require('./View/Upstox')
    const { createViewZebul } = require('./View/Zebul')
    const { createViewZerodha } = require('./View/zerodha')
    const { createViewIcicidirect } = require('./View/Icicidirectview')




    app.get("/runStrategy", async (req, res) => {
        const data = await dbTest.collection('strategyViewNames').find({}).toArray();

        fetchDataFromViews(data);
        res.send({ data: data })
    });


    async function fetchDataFromViews(viewNames) {

        try {
            if (viewNames.length > 0) {
                for (let valView of viewNames) {
                    // const data = await dbTest.collection(valView.viewName).find({ isCondition: true }).toArray();
                    const data = await dbTest.collection(valView.viewName).find({
                        isCondition: true,
                        timeFrameViewData: { $ne: null, $ne: [] }
                    }).toArray();

                    if (data.length > 0) {

                        let val = data[0];

                        let entry_type = 'LE';
                        if (val.type === 'BUY') {
                            entry_type = 'SE';
                        }
                        let condition_check_previous_trade = {
                            strategy: val.strategy_name,
                            symbol: val.symbol_name,
                            entry_type: entry_type,
                            segment: val.segment,
                            client_persnal_key: val.panelKey,
                            MakeStartegyName: val.show_strategy,
                            TradeType: 'MAKE_STRATEGY',
                        };
                        if (['O', 'FO', 'MO', 'CO'].includes(val.segment.toUpperCase())) {
                            let option_type = 'CALL';
                            if (val.option_type === 'PE') {
                                option_type = 'PUT';
                            }
                            condition_check_previous_trade = {
                                strategy: val.strategy_name,
                                symbol: val.symbol_name,
                                entry_type: entry_type,
                                segment: val.segment,
                                strike: val.strike_price,
                                option_type: option_type,
                                expiry: val.expiry,
                                client_persnal_key: val.panelKey,
                                MakeStartegyName: val.show_strategy,
                                TradeType: 'MAKE_STRATEGY',
                            };
                        }
                        else if (['F', 'MF', 'CF'].includes(val.segment.toUpperCase())) {
                            condition_check_previous_trade = {
                                strategy: val.strategy_name,
                                symbol: val.symbol_name,
                                entry_type: entry_type,
                                segment: val.segment,
                                expiry: val.expiry,
                                client_persnal_key: val.panelKey,
                                MakeStartegyName: val.show_strategy,
                                TradeType: 'MAKE_STRATEGY',
                            };
                        }
                        var checkPreviousTrade = await get_open_position_view.findOne(condition_check_previous_trade);
                        const collection_last_price = dbTest.collection(val.tokensymbol);
                        const last_price = await collection_last_price.aggregate([{ $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
                        let price_lp = last_price[0].lp;
                        if (checkPreviousTrade != null) {
                            const currentTimestamp = Math.floor(Date.now() / 1000);
                            let type = 'LX';
                            let price = checkPreviousTrade.stockInfo_bp1;
                            if (checkPreviousTrade.entry_type.toUpperCase() === 'SE') {
                                type = 'SX';
                                price = checkPreviousTrade.stockInfo_sp1;
                            }
                            let strike = checkPreviousTrade.strike;
                            if (checkPreviousTrade.strike_price === 'NaN') {
                                strike = '100';
                            }
                            let option_type = 'CALL';
                            if (checkPreviousTrade.option_type.toUpperCase() === 'PUT') {
                                option_type = 'PUT';
                            }
                            let Quntity = checkPreviousTrade.entry_qty_percent;
                            let req = `DTime:${currentTimestamp}|Symbol:${checkPreviousTrade.symbol}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${checkPreviousTrade.segment}|Strike:${strike}|OType:${option_type}|Expiry:${checkPreviousTrade.expiry}|Strategy:${checkPreviousTrade.strategy}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:${checkPreviousTrade.TradeType}|MakeStartegyName:${val.show_strategy}|Demo:demo`;
                            let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
                                url: `${process.env.BROKER_URL}`,
                                headers: {
                                    'Content-Type': 'text/plain'
                                },
                                data: req
                            };
                            await axios.request(config)
                                .then((response) => {

                                })
                                .catch((error) => {

                                });
                        }
                        const update = {
                            $set: {
                                status: '2',
                            },
                            $inc: {
                                numberOfTrade_count_trade: 1, // Increment by 1, you can change this value based on your requirement
                            },
                        };
                        const filter = { _id: val._id };
                        let Res = await UserMakeStrategy.updateOne(filter, update);
                        let Check_same_trade_type = 'BUY';
                        if (val.type === 'BUY') {
                            Check_same_trade_type = 'SELL';
                        }
                        const Check_same_trade_data = await UserMakeStrategy.findOne({ show_strategy: val.show_strategy, type: Check_same_trade_type });
                        if (Check_same_trade_data) {
                            let Res = await UserMakeStrategy.updateOne({ name: Check_same_trade_data.name }, {
                                $set: {
                                    status: '1',
                                },
                            });
                        }
                        const numberOfTrade_count_trade_count = await UserMakeStrategy.aggregate([
                            {
                                $match: {
                                    show_strategy: val.show_strategy,
                                    numberOfTrade: { $ne: '' }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    totalNumberOfTrade_count_trade: { $sum: '$numberOfTrade_count_trade' },
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    totalNumberOfTrade_count_trade: 1,
                                    anotherField: '$numberOfTrade',
                                    isTotalSmall: { $lt: ['$totalNumberOfTrade_count_trade', parseInt(val.numberOfTrade)] }
                                }
                            }
                        ]);
                        if (numberOfTrade_count_trade_count.length > 0) {
                            if (numberOfTrade_count_trade_count[0].isTotalSmall === false) {
                                const update_trade_off = {
                                    $set: {
                                        status: '2',
                                    },
                                };
                                const filter_trade_off = { show_strategy: val.show_strategy };
                                let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
                            }
                        }
                        const currentTimestamp = Math.floor(Date.now() / 1000);
                        let type = 'LE';
                        if (val.type.toUpperCase() === 'SELL') {
                            type = 'SE';
                        }
                        let price = 0;
                        let strike = val.strike_price;
                        if (val.strike_price === 'NaN') {
                            strike = '100';
                        }
                        let option_type = 'CALL';
                        if (val.option_type.toUpperCase() === 'PE') {
                            option_type = 'PUT';
                        }
                        let Quntity = '100';
                        const dateObject = new Date(val.exitTime);
                        const hours = ('0' + dateObject.getUTCHours()).slice(-2);
                        const minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
                        const ExitTime = `${hours}-${minutes}`;
                        let req = `DTime:${currentTimestamp}|Symbol:${val.symbol_name}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy_name}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:MAKE_STRATEGY|Target:${val.target}|StopLoss:${val.stoploss}|ExitTime:${ExitTime}|MakeStartegyName:${val.show_strategy}|Demo:demo`;
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            // url: 'https://trade.pandpinfotech.com/signal/broker-signals',
                            url: `${process.env.BROKER_URL}`,
                            headers: {
                                'Content-Type': 'text/plain'
                            },
                            data: req
                        };
                        await axios.request(config)
                            .then((response) => { })
                            .catch((error) => { });

                    }
                }

            }

        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }



    app.get("/logicStrategyView", async (req, res) => {

        const pipeline = [

            {
                $match: {
                    status: "1",
                }
            }

        ]
        const result = await UserMakeStrategy.aggregate(pipeline)

        result.forEach(async (ele) => {
            let collectionViewName = "usermakestrategies"
            let arraySource = []
            await ele.condition_array.forEach(async (condition) => {
                ['first_element', 'second_element'].forEach(async (element) => {
                    if (condition[element].source !== 'close' && condition[element].source !== 'open' && condition[element].source !== 'high' && condition[element].source !== 'low' && condition[element].source !== 'number') {

                        if (!arraySource.includes(condition[element].source)) {
                            arraySource.push(condition[element].source)
                        }


                        // await dbTest.collection(viewName).drop();
                        // console.log(`View ${viewName} dropped successfully`);

                        // console.log("ele - id 2", ele._id, "condition[element].source ", condition[element].source)


                        // console.log(`Working on timeframe: ${timeframe}`);
                        // console.log(`Working on tokensymbol: ${tokensymbol}`);
                        // console.log(`Working on source: ${condition[element].source}`);
                        // console.log(`Working on offset: ${condition[element].offset}`);
                        // console.log(`Working on indicator_field: ${condition[element].indicator_field}`);
                        // console.log(`Working on period: ${condition[element].period}`);

                        // let viewName = condition[element].source + '_M' + timeframe + '_' + tokensymbol;
                        // let collectionViewName = 'M' + timeframe + '_' + tokensymbol;
                        // let expMovingAvg = { input: "$" + condition[element].indicator_field, N: parseInt(condition[element].period) }; // Convert period to integer

                        // const pipelineIndicatorView = [
                        //   { $sort: { _id: -1 } }, // Sorting to get the latest prices first
                        //   // { $limit: 2 },         // Limiting to the period (adjust this based on your period)
                        //   {
                        //     $setWindowFields: {   // Window function to calculate EMA
                        //       sortBy: { _id: 1 },
                        //       output: {
                        //         ema: {
                        //           $expMovingAvg: { input: expMovingAvg.input, N: expMovingAvg.N }  // Adjust N based on your period
                        //         }
                        //       }
                        //     }
                        //   },
                        //   { $project: { ema: 1, _id: 1 } } // Projecting only the ema field, excluding _id
                        // ];

                        // try {
                        //   const collections = await dbTest.listCollections().toArray();
                        //   const collectionExists = collections.some(coll => coll.name === viewName);

                        //   if (!collectionExists) {
                        //     await dbTest.createCollection(viewName, {
                        //       viewOn: collectionViewName,
                        //       pipeline: pipelineIndicatorView
                        //     });
                        //     console.log(`View ${viewName} created successfully`);
                        //   }else{
                        //     console.log(`View ${viewName} already exists`);
                        //   }
                        // } catch (error) {
                        //   console.log(`Error creating view ${viewName}:`, error);
                        // }



                    }
                });
            });


            if (arraySource.length > 0) {

                let timeFrameView = 'M' + ele.timeframe + '_' + ele.tokensymbol
                let pipeline = [];

                const conditions = parseConditionString(ele.condition);

                const matchStage = generateMongoCondition(conditions, ele);

                pipeline.push({
                    $match: {
                        status: ele.status,
                        timeframe: ele.timeframe,
                        tokensymbol: ele.tokensymbol,
                        name: ele.name,
                    }
                });

                pipeline.push({
                    $lookup: {
                        from: timeFrameView,
                        pipeline: [
                            {
                                $sort: { _id: -1 }
                            }
                        ],
                        as: "timeFrameViewData"
                    }
                });

                arraySource.forEach(async (source) => {
                    pipeline.push({
                        $lookup: {
                            from: source + '_M' + ele.timeframe + '_' + ele.tokensymbol,
                            pipeline: [
                                {
                                    $sort: { _id: -1 }
                                }
                            ],
                            as: source + 'Data'
                        }
                    });
                });


                pipeline.push({
                    $addFields: {
                        isCondition: matchStage
                    }
                });




                let viewName = 'M' + ele.timeframe + '_' + ele.tokensymbol + '_make_' + ele.name;

                try {
                    const collections = await dbTest.listCollections().toArray();
                    const collectionExists = collections.some(coll => coll.name === viewName);

                    if (!collectionExists) {
                        await dbTest.createCollection(viewName, {
                            viewOn: collectionViewName,
                            pipeline: pipeline
                        });
                        console.log(`View ${viewName} created successfully`);
                    } else {
                        console.log(`View ${viewName} already exists`);
                    }
                } catch (error) {
                    console.log(`Error creating view ${viewName}:`, error);
                }

            } else {

                const conditions = parseConditionString(ele.condition);

                const matchStage = generateMongoCondition(conditions, ele);

                let timeFrameView = 'M' + ele.timeframe + '_' + ele.tokensymbol
                let pipeline = [];

                pipeline.push({
                    $match: {
                        status: ele.status,
                        timeframe: ele.timeframe,
                        tokensymbol: ele.tokensymbol,
                        name: ele.name,
                    }
                });

                pipeline.push({
                    $lookup: {
                        from: timeFrameView,
                        pipeline: [
                            {
                                $sort: { _id: -1 }
                            }
                        ],
                        as: "timeFrameViewData"
                    }
                });

                pipeline.push({
                    $addFields: {
                        isCondition: matchStage
                    }
                });

                let viewName = 'M' + ele.timeframe + '_' + ele.tokensymbol + '_make_' + ele.name;

                try {
                    const collections = await dbTest.listCollections().toArray();
                    const collectionExists = collections.some(coll => coll.name === viewName);

                    if (!collectionExists) {
                        await dbTest.createCollection(viewName, {
                            viewOn: collectionViewName,
                            pipeline: pipeline
                        });
                        console.log(`View ${viewName} created successfully`);
                    } else {
                        console.log(`View ${viewName} already exists`);
                    }
                } catch (error) {
                    console.log(`Error creating view ${viewName}:`, error);
                }
            }

        });

        return res.send({ STAT: "OKKK" })
    });

    app.get("/logicStrategyView1", async (req, res) => {
        // const conditions = [
        //     "(data.close[1]>data.emaclose3[1])&&((data.close[6]<data.emaclose3[2])||(data.close[9]<data.emaclose2[3]))"
        //   ];


        const conditions = parseConditionString("(((data.close[1]>data.emaclose3[1])||(data.close[1]<data.emaclose3[1]))&&(data.close[1]<data.emaclose3[1]))");


        const matchStage = generateMongoCondition(conditions);


        return res.send({ status: true, condition: matchStage });

    })


    app.get("/triggerview", async (req, res) => {

        try {

            const collection = dbTest.collection('usermakestrategies');
            const changeStream = collection.watch();

            changeStream.on('change', async (change) => { });

        } catch (error) {
        }


        res.send("Doneeeeeeeee")
    });

    // function parseConditionString(conditionString) {
    //     const conditionRegex = /data\.(\w+)\[(\d+)\]([><])data\.(\w+)\[(\d+)\]/g;
    //     const conditions = [];
    //     let andFlag = false;

    //     // Handle the && and || parts
    //     const andParts = conditionString.split('&&');
    //     andParts.forEach(part => {
    //         const orParts = part.split('||');
    //         orParts.forEach((subPart, index) => {
    //             let match;
    //             while ((match = conditionRegex.exec(subPart)) !== null) {
    //                 const [_, field1, index1, operator, field2, index2] = match;
    //                 conditions.push({
    //                     operator,
    //                     field1,
    //                     index1: parseInt(index1),
    //                     field2,
    //                     index2: parseInt(index2),
    //                     type: index === 0 && andFlag ? 'and' : 'or'
    //                 });
    //             }
    //         });
    //         andFlag = true;
    //     });

    //     return conditions;
    // }
    function parseConditionString(conditionString) {
        const conditionRegex = /data\.(\w+)\[(\d+)\]([><=]{1,2})data\.(\w+)\[(\d+)\]/g;
        const conditions = [];
        let andFlag = false;

        // Handle the && and || parts
        const andParts = conditionString.split('&&');
        andParts.forEach(part => {
            const orParts = part.split('||');
            orParts.forEach((subPart, index) => {
                let match;
                while ((match = conditionRegex.exec(subPart)) !== null) {
                    const [_, field1, index1, operator, field2, index2] = match;
                    conditions.push({
                        operator: operator.length === 2 ? operator : operator + '=', // Normalize operator
                        field1,
                        index1: parseInt(index1),
                        field2,
                        index2: parseInt(index2),
                        type: index === 0 && andFlag ? 'and' : 'or'
                    });
                }
            });
            andFlag = true;
        });

        return conditions;
    }


    const generateMongoCondition = (conditions, ele) => {
        const andArray = [];
        let orArray = [];

        conditions.forEach(condition => {
            const { operator, field1, index1, field2, index2, type } = condition;
            // const mongoOperator = operator === '>' ? '$gt' : '$lt';

            let mongoOperator;
            switch (operator) {
                case '>':
                    mongoOperator = '$gt';
                    break;
                case '<':
                    mongoOperator = '$lt';
                    break;
                case '>=':
                    mongoOperator = '$gte';
                    break;
                case '<=':
                    mongoOperator = '$lte';
                    break;
                case '==': // Handle equality operator
                case '===': // Handle strict equality operator
                    mongoOperator = '$eq';
                    break;
                default:
                    mongoOperator = '$lt'; // Default to less than
                    break;
            }


            let condition_one
            ['close', 'open', 'high', 'low', 'number'].includes(field1) ?
                condition_one = { $arrayElemAt: [`$timeFrameViewData.${field1}`, index1] }
                : condition_one = { $arrayElemAt: [`$${field1}Data.ema`, index1] }


            let condition_two
            ['close', 'open', 'high', 'low', 'number'].includes(field2) ?
                condition_two = { $arrayElemAt: [`$timeFrameViewData.${field2}`, index2] }
                : condition_two = { $arrayElemAt: [`$${field2}Data.ema`, index2] }



            const conditionObj = {
                [mongoOperator]: [
                    condition_one,
                    condition_two
                ]
            };


            if (type === 'and') {
                if (orArray.length > 0) {
                    andArray.push({ $or: orArray });
                    orArray = []; // Reset orArray after adding it to andArray
                }
                andArray.push(conditionObj);
            } else if (type === 'or') {
                orArray.push(conditionObj);
            }

        });


        const finalExpr = {};
        if (andArray.length > 0 && orArray.length > 0) {
            finalExpr.$and = andArray;
            finalExpr.$or = orArray;
        } else if (andArray.length > 0) {
            finalExpr.$and = andArray;
        } else if (orArray.length > 0) {
            finalExpr.$or = orArray;
        }

        return {
            $cond: {
                if: finalExpr,
                then: true,
                else: false
            }
        };


    };





    // ========================================================================================================



    var CreateDataBase = async (data) => {
        const uri = data;
        const databaseName = "TradeTools"
        if (uri) {

            if (!databaseName) {
                console.log('Database name is required');
            }

            try {
                const client = new MongoClient(uri.db_url, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();

                const db = client.db(databaseName);
                await db.createCollection('dummy');

                await client.close();
                console.log(`Database ${databaseName} created successfully`);
            } catch (error) {
                console.log("Error create data base -", error);

            }
        }
    }

    const DawnloadOptionChainSymbol = async () => {

        var axios = require('axios');
        const Papa = require('papaparse')
        const csvFilePath = 'https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv';
        const { data } = await axios.get(csvFilePath);

        Papa.parse(data, {
            complete: async (result) => {
                let sheet_Data = result.data;
                sheet_Data.forEach(async (element) => {

                    let symbol = element.SYMBOL;


                    if (symbol == "NIFTY_BANK") {
                        symbol = "BANKNIFTY";
                    }
                    else if (symbol == "NIFTY_50") {
                        symbol = "NIFTY";
                    }
                    else if (symbol == "NIFTY_FIN_SERVICE") {
                        symbol = "FINNIFTY";
                    }

                    const filter = { symbol: symbol };
                    const update = { $set: { price: element.CPrice } };

                    await Get_Option_Chain_modal.updateOne(filter, update, { upsert: true });

                });
            },
            header: true,
        });



    }

    const RoleCreate = () => {
        var arr = [
            {
                role: "1",
                name: 'SUPERADMIN',
                description: 'SuperAdmin role with full access'
            },
            {

                role: "2",
                name: 'ADMIN',
                description: 'Admin role with full access'
            },
            {

                role: "3",
                name: 'SUBADMIN',
                description: 'SubAdmin role with only self user access'
            },
            {

                role: "4",
                name: 'USER',
                description: 'User role '
            }
        ]
        arr.forEach((role) => {
            const newRole = new Roledata(role)
            return newRole.save();
        })
    }

    const CompanyCreate = (data) => {

        if (data) {
            const companyData = new company({
                _id: "667d46da608323b39d0ba707",
                panel_name: data.panelname,
                panel_key: data.client_key,
                prefix: data.client_key.substring(0, 3),
                domain_url: data.domain.replace(/^https?:\/\//, ''),
                domain_url_https: `${data.domain}/#/login`,
                broker_url: `${data.domain}/signal/broker-signals`,
                theme_id: "64d0c04a0e38c94d0e20ee28",
                theme_name: "theme_name",
                disclaimer: "Disclaimer: The risk of loss in trading in any financial markets or exchange can be substantial. These are leveraged products that carry a substantial risk of loss up to your invested capital and may not be suitable for everyone. You should therefore carefully consider whether such trading is suitable for you considering your financial condition. Please ensure that you fully understand the risks involved and do not invest money you cannot afford to lose. Past performance does not guarantee future performance. Historical returns, expected returns, and probability projections are provided for informational and illustrative purposes, and may not reflect actual future performance. SKW Investment Adviser does not guarantee returns in any of its products or services.",
                version: "1.0",
                panel_short_name: data.client_key.substring(0, 3),
                licenses: 0,
                disclaimer_status: "0",
            });

            return companyData.save();
        }
    };

    const CreateBrokerinfo = async () => {
        try {
            const Broker_informationData = new Broker_information({
                "broker_name": "Alice Blue",
                "app_code": "",
                "apiSecret": "",
                "createdAt": new Date("2023-10-04T11:57:02.903Z"),
                "updatedAt": new Date("2024-06-19T09:43:10.690Z"),
                "__v": 0,
                "broker_id": "2",
                "api_key": null,
                "client_code": null
            });

            const savedData = await Broker_informationData.save();
            return savedData;
        } catch (error) {
            console.log('Error saving broker information:', error);
            // throw error; // Rethrow the error if you want it to be handled by the calling function
            return null
        }
    };

    const categorys = async () => {
        const categoriesData = [
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c9797"),
                category_id: "1",
                name: 'CASH',
                segment: 'C',
                status: 0,
                CID: "1"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c9798"),
                category_id: "2",
                name: 'FUTURE',
                segment: 'F',
                status: 0,
                CID: "2"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c9799"),
                category_id: "3",
                name: 'OPTION',
                segment: 'O',
                status: 0,
                CID: "3"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c979a"),
                category_id: "4",
                name: 'MCX FUTURE',
                segment: 'MF',
                status: 0,
                CID: "4"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c979b"),
                category_id: "5",
                name: 'MCX OPTION',
                segment: 'MO',
                status: 0,
                CID: "5"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c979c"),
                category_id: "6",
                name: 'CURRENCY OPTION',
                segment: 'CO',
                status: 0,
                CID: "6"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c979d"),
                category_id: "7",
                name: 'CURRENCY FUTURE',
                segment: 'CF',
                status: 0,
                CID: "7"
            },
            {
                _id: new ObjectId("64c9dbdc14a9fefd971c979e"),
                category_id: "8",
                name: 'FUTURE OPTION',
                segment: 'FO',
                status: 0,
                CID: "3"
            }
        ];

        for (const data of categoriesData) {
            await categorie.updateOne(
                { _id: data._id },
                { $set: data },
                { upsert: true }
            );
        }
    };

    const live_price_data_create = async () => {
        const live_priceData = new live_price({
            _id: "667d46da608323b39d0ba707",
            broker_name: "ALICE_BLUE",
            Role: "ADMIN",
            access_token: "",
            trading_status: 'off',
            user_id: '12345',
            broker_id: "2",
            Stock_chain: "NFO|45650#NFO|45691#NFO|64378#NFO|64379#NFO|45802#NFO|45801#NFO|64380#NFO|64381#NFO|45803#NFO|45832#NFO|64391#NFO|64390#NFO|46863#NFO|46864#NFO|64395#NFO|64394#NFO|47636#NFO|47637#NFO|64397#NFO|64396#NFO|47640#NFO|47639#NFO|64407#NFO|64410#NFO|49559#NFO|49560#NFO|64411#NFO|64412#NFO|49569#NFO|49568#NFO|64414#NFO|64413#NFO|49576#NFO|49577#NFO|64417#NFO|64418#NFO|49581#NFO|49580#NFO|71298#NFO|71301#NFO|49582#NFO|49591#NFO|64423#NFO|64425#NFO|51403#NFO|51405#NFO|64426#NFO|64427#NFO|54495#NFO|54496#NFO|64429#NFO|64428#NFO|54497#NFO|54498#NFO|64430#NFO|64431#NFO|54499#NFO|54500#NFO|64433#NFO|64432#NFO|54502#NFO|54501#NFO|64434#NFO|64435#NFO|63912#NFO|63911#NFO|64436#NFO|64437#NFO|63914#NFO|63913#NFO|64439#NFO|64438#NFO|63916#NFO",
            setSocket: null,
        });
        return live_priceData.save();
    };


    app.get("/all/brokerview", (req, res) => {

        createViewAlice()
        createViewAngel()
        createViewDhan()
        createViewFivepaisa()
        createViewFyers()
        createViewIifl()
        createViewKotakNeo()
        createViewMarketHub()
        createViewMastertrust()
        createViewMotilalOswal()
        createViewSwastika()
        createViewUpstox()
        createViewZebul()
        createViewZerodha()
        createViewIcicidirect()
        DashboardView()
        createView()
        open_position_excute()

        return res.send("DONEE")
    })

    app.post("/all/tabel", async (req, res) => {
        try {

            const roles = await Roledata.find();
            if (roles.length !== 4) {
                RoleCreate();
            }


            const companies = await company.find();
            if (companies.length == 0) {
                CompanyCreate(req.body);
            }


            const categories = await categorie.find();
            if (categories.length == 0) {
                categorys();
            }


            const brokers = await Broker_information.find();
            if (brokers.length == 0) {
                CreateBrokerinfo();
            }

            const servicesData = await services.find();
            if (servicesData.length == 0) {
                service_token_update();
            }


            const Alice_tokenData = await Alice_token.find();
            if (Alice_tokenData.length == 0) {
                TokenSymbolUpdate();
            }

            const live_price_data = await live_price.find();
            if (live_price_data.length == 0) {
                live_price_data_create();
            }

            CreateDataBase(req.body)
     

            DawnloadOptionChainSymbol()


            return res.send("DONE");
        } catch (error) {

            return res.status(500).send("Internal Server Error");
        }
    });

    app.post("/add/admin", async (req, res) => {
        const { panelname, client_key } = req.body;

        if (!panelname || !client_key) {
            return res.status(400).send("Panel name and client key are required.");
        }

        const Email = `${panelname}@gmail.com`;

        const commonUserData = {
            FullName: "admin",
            Password: "$2b$08$x3Sm7wmIGOaUPnjxZulVXeYZaZCg8LsRBZQDrvzhui8gqeXEAcJGK",
            Otp: "123456",
            StartDate: new Date(),
            EndDate: new Date("2030-07-15T00:00:00.000Z"),
            ActiveStatus: "1",
            Role: "ADMIN",
            AppLoginStatus: "0",
            WebLoginStatus: "1",
            TradingStatus: "off",
            CreateDate: new Date(),
            reset_password_status: "1",
            web_login_token: "",
            api_key: "",
            api_secret: "",
            api_type: "",
            app_id: "",
            app_key: "null",
            client_code: "",
            demat_userid: "123",
            broker: "2",
            access_token: "",
            web_url: "1",
            qty_type: "1",
            signals_execution_type: "1",
            parent_role: "SUPERADMIN",
            parent_id: "64c76f0b32067577d02310d8",
            Is_Active: "0",
            client_key: client_key,
            Is_First_login: "1"
        };

        const createUserData = (UserName, email, PhoneNo) => {
            return new User({
                ...commonUserData,
                Email: email,
                PhoneNo: PhoneNo,
                UserName: UserName,
            });
        };

        const userData1 = createUserData("admin", Email, "9999999999");
        const userData2 = createUserData("admin1", "PNP@gmail.com", "5499999999");

        try {
            const results = await Promise.allSettled([userData1.save(), userData2.save()]);

            results.forEach((result, index) => {
                if (result.status === "rejected") {
                    console.log(`Error saving user${index + 1}:`, result.reason);
                }
            });

            res.status(201).send("Admin creation attempted. Check logs for details.");
        } catch (error) {
            console.log("Unexpected error:", error);
            res.status(500).send("Unexpected error occurred during admin creation.");
        }
    });

    app.get("/UpdateServicesToken", async (req, res) => {
        TokenSymbolUpdate()
    })

    app.get("/UpdateQty", async (req, res) => {

        const pipeline = [

            {
                $project: {
                    'lotsize': 1,
                    'name': 1,
                },
            },
        ];
        const servicesResult = await services.aggregate(pipeline);
        if (servicesResult.length > 0) {
            servicesResult.forEach(async (element) => {
                const Sid = new ObjectId(element._id);
                // if(element.name == "TITAN"){

                const clsResult = await client_services.find({ service_id: Sid });
                if (clsResult.length > 0) {
                    clsResult.forEach(async (item) => {



                        const filtet = { _id: item._id };
                        const qty = parseInt(item.lot_size) * parseInt(element.lotsize)
                        const updateOperation = { $set: { quantity: qty } };
                        try {
                            const UpdateD = await client_services.updateOne(filtet, updateOperation);

                        } catch (error) {
                            console.log("Error updating documents:", error);
                        }



                    });
                }

                //}


            });

        }



        return res.send({ status: true })






    })

    app.get('/addstockExtra', async function (req, res) {

        const pipeline = [

            {
                $project: {
                    // Include fields from the original collection
                    'segment': 1,
                },
            },
        ];
        const categoryResult = await categorie.aggregate(pipeline);

        var axios = require('axios');
        var config = {
            method: 'get',
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        };

        axios(config)
            .then(function (response) {

                var unique_key = []
                let count = 0
                response.data.forEach((item) => {




                    if (item.symbol.slice(-3) == '-EQ') {
                        count++

                        const matchingElements = categoryResult.filter(item => item.segment === "C");
                        const category_id = matchingElements[0]._id


                        services.create({
                            name: item.name + '#',
                            instrument_token: item.token,
                            zebu_token: item.symbol,
                            kotak_token: "",
                            instrumenttype: item.instrumenttype,
                            exch_seg: item.exch_seg,
                            lotsize: item.lotsize,
                            categorie_id: category_id,
                            unique_column: item.name + '#_' + category_id
                        })
                            .then((createdServices) => { })
                            .catch((err) => {
                                try {
                                    console.log('Error creating and saving user:', err);
                                } catch (e) {
                                }

                            });


                    }






                });






            });



    })

    app.get("/DT", async (req, res) => {

        const pipeline = [
            {
                $addFields: {
                    expiryDate: {
                        $dateFromString: {
                            dateString: {
                                $concat: [
                                    { $substr: ["$expiry", 4, 4] }, // Year
                                    "-",
                                    { $substr: ["$expiry", 2, 2] }, // Month
                                    "-",
                                    { $substr: ["$expiry", 0, 2] } // Day
                                ]
                            },
                            format: "%Y-%m-%d"
                        }
                    }
                }
            },
            {
                $match: {
                    expiryDate: { $lt: new Date() }
                }
            },
            {
                $group: {
                    _id: null,
                    idsToDelete: { $push: "$_id" } // Collecting all matching _id values
                }
            },
            {
                $project: {
                    _id: 0,
                    idsToDelete: 1
                }
            },

        ];
        const result = await Alice_token.aggregate(pipeline)
        if (result.length > 0) {
            const idsToDelete = result.map(item => item._id);
            await Alice_token.deleteMany({ _id: { $in: result[0].idsToDelete } });

        } else {
        }

        return res.send({ data: result, count: result.length })
    });

    app.get("/T-U", async (req, res) => {

        var d = new Date();
        dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
        ].join(':');
        var axios = require('axios');
        var config = {
            method: 'get',
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        };

        axios(config)
            .then(function (response) {

                let count = 0
                response.data.forEach(async (element) => {

                    var option_type = element.symbol.slice(-2);
                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');
                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    var day_month = element.expiry.slice(0, -4);
                    var year_end = element.expiry.slice(-2);
                    var day_start = element.expiry.slice(0, 2);
                    var moth_str = element.expiry.slice(2, 5);
                    const Dat = new Date(element.expiry);
                    var moth_count = Dat.getMonth() + 1
                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');
                    var expiry_month_year = expiry.slice(2);
                    var expiry_date = expiry.slice(0, -6);
                    var tradesymbol_m_w;




                    if (element.instrumenttype == 'FUTSTK' && element.exch_seg == "NFO") {

                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;
                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "F",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };

                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }


                    } else if (element.instrumenttype == 'FUTIDX' && element.exch_seg == "NFO") {

                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {
                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;
                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "F",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };



                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }



                    } else if (element.instrumenttype == 'FUTCOM') {
                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {
                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;
                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "MF",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };


                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    }
                    else if (element.instrumenttype == 'OPTIDX' && element.exch_seg == "NFO") {

                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;
                            var moth_str_single = moth_str.slice(0, 1);
                            var tradesymbol_zerodha;
                            tradesymbol_zerodha = element.name + year_end + moth_str_single + day_start + strike + option_type;


                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "O",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };


                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    }
                    else if (element.instrumenttype == 'OPTSTK' && element.exch_seg == "NFO") {
                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                            var moth_str_single = moth_str.slice(0, 1);
                            var tradesymbol_zerodha;
                            tradesymbol_zerodha = element.name + year_end + moth_str_single + day_start + strike + option_type;

                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "O",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };



                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    } else if (element.instrumenttype == 'OPTFUT') {

                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                            var moth_str_single = moth_str.slice(0, 1);
                            var tradesymbol_zerodha;
                            tradesymbol_zerodha = element.name + year_end + moth_str_single + day_start + strike + option_type;

                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "MO",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };



                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    } else if (element.instrumenttype == 'OPTCOM') {
                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                            var moth_str_single = moth_str.slice(0, 1);
                            var tradesymbol_zerodha;
                            tradesymbol_zerodha = element.name + year_end + moth_str_single + day_start + strike + option_type;

                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "MO",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg

                            };


                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    } else if (element.instrumenttype == 'OPTCUR') {
                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;
                            var moth_str_single = moth_str.slice(0, 1);
                            var tradesymbol_zerodha;
                            tradesymbol_zerodha = element.name + year_end + moth_str_single + day_start + strike + option_type;

                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "CO",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };



                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    } else if (element.instrumenttype == 'FUTCUR') {

                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {

                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "CF",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };



                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }

                    }

                    // ONLY CASH STOCK
                    if (element.symbol.slice(-3) == '-EQ') {
                        let exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 })
                        if (exist_token == null) {
                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                            var user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry_month_year,
                                expiry_date: expiry_date,
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "C",
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg

                            };



                            const filter = { instrument_token: element.token };
                            var updateOperation = { $set: user_data };
                            var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                        }
                    }



                });
            });

        return res.send({ data: "okk" })
    });

    app.get("/test", (req, res) => {
        MainSignalsRemainToken()
        return res.send("DONEE")
    })

    app.get('/dropOpenPosition', async (req, res) => {
        dropOpenPosition()
        return res.send({ msg: "Delete Done!!!" })
    })

    app.get('/dashboard-view', async (req, res) => {
        DashboardView()
        return res.send({ msg: "Dashboard view create Done!!!" })
    })

    app.get('/AccelpixTokenUpdate', async (req, res) => {

        const axios = require('axios');
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://apidata5.accelpix.in/api/hsd/Masters/2?fmt=json',
            headers: {}
        };

        axios.request(config)
            .then(async (response) => {
                const result = await Alice_token.aggregate([
                    {
                        $project: {
                            instrument_token: 1
                        }
                    }

                ])

                result.forEach(async (element) => {

                    const Exist_token = response.data.find(item1 => item1.tk === parseInt(element.instrument_token));




                    const update = {
                        $set: {
                            tkr: Exist_token.tkr,
                            a3tkr: Exist_token.a3tkr,
                        },
                    };

                    const filter = { instrument_token: element.instrument_token };

                    const options = {
                        upsert: true,
                    };

                    let Res = await Alice_token.updateMany(filter, update, options);



                });

            })
            .catch((error) => {
                console.log("Error", error);
            });






        return res.send({ msg: "okk" })
    })

    app.get("/optionStockData", async (req, res) => {
        try {

            const pipeline_stock_symbol = [
                {
                    $match: { token: "1" }
                },
            ]

            const symbols_array = await Get_Option_Chain_modal.aggregate(pipeline_stock_symbol);

            const symbols = symbols_array.map(item => item.symbol)



            const expiry = "30112023";
            let limit_set = 10
            let price = 21000

            var alltokenchannellist

            const date = new Date(); // Month is 0-based, so 10 represents November
            const currentDate = new Date();
            const previousDate = new Date(currentDate);
            previousDate.setDate(currentDate.getDate() - 1);
            const formattedDate = previousDate.toISOString();
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const formattedLastDayOfMonth = lastDayOfMonth.toISOString();

            const final_data = [];

            for (const symbol of symbols) {
                const pipeline = [
                    {
                        $match: { symbol: symbol }
                    },
                    {
                        $group: {
                            _id: "$symbol",
                            uniqueExpiryValues: { $addToSet: "$expiry" }
                        }
                    },
                    {
                        $unwind: "$uniqueExpiryValues"
                    },
                    {
                        $addFields: {
                            expiryDate: {
                                $dateFromString: {
                                    dateString: "$uniqueExpiryValues",
                                    format: "%d%m%Y"
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            expiryDate: { $gte: new Date(formattedDate) }
                        }
                    },
                    {
                        $addFields: {
                            formattedExpiryDate: {
                                $dateToString: {
                                    date: "$expiryDate",
                                    format: "%d%m%Y"
                                }
                            }
                        }
                    },
                    {
                        $sort: { expiryDate: 1 }
                    },
                    {
                        $limit: 5
                    }


                ]

                var data = await Alice_token.aggregate(pipeline);

                const result11 = data.filter(item => {
                    const itemDate = new Date(item.expiryDate);
                    return itemDate.getTime() === lastDayOfMonth.getTime() || data.indexOf(item) < 2;
                });
                const expiryDatesArray = result11.map(item => item.uniqueExpiryValues);

                const get_symbol_price = await Get_Option_Chain_modal.findOne({ symbol: symbol })

                if (get_symbol_price != undefined) {
                    price = parseInt(get_symbol_price.price);
                }

                const pipeline2 = [
                    {
                        $match: {
                            symbol: symbol,
                            segment: 'O',
                            expiry: { $in: expiryDatesArray }
                        }
                    }
                ]

                const pipeline3 = [
                    {
                        $match: {
                            symbol: symbol,
                            segment: 'O',
                            expiry: { $in: expiryDatesArray }
                        }
                    },
                    {
                        $addFields: {
                            absoluteDifference: {
                                $abs: {
                                    $subtract: [{ $toInt: "$strike" }, price]
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$strike", // Group by unique values of A
                            minDifference: { $min: "$absoluteDifference" }, // Find the minimum absolute difference for each group
                            document: { $first: "$$ROOT" } // Keep the first document in each group
                        }
                    },
                    {
                        $sort: {
                            minDifference: 1 // Sort by the minimum absolute difference in ascending order
                        }
                    },
                    {
                        $limit: limit_set
                    },
                    {
                        $sort: {
                            _id: 1 // Sort by the minimum absolute difference in ascending order
                        }
                    }
                ]

                const result = await Alice_token.aggregate(pipeline2);
                const resultStrike = await Alice_token.aggregate(pipeline3);

                var channelstr = ""
                if (result.length > 0) {
                    resultStrike.forEach(element => {
                        let call_token = "";
                        let put_token = "";
                        let symbol = ""
                        let segment = ""
                        result.forEach(async (element1) => {
                            if (element.document.strike == element1.strike) {
                                if (element1.option_type == "CE") {
                                    symbol = element1.symbol
                                    segment = element1.segment
                                    call_token = element1.instrument_token;
                                } else if (element1.option_type == "PE") {
                                    symbol = element1.symbol
                                    segment = element1.segment
                                    put_token = element1.instrument_token;
                                }


                                // const stock_live_price = db_main.collection('token_chain');

                                // const filter = { _id: element1.instrument_token };
                                // const update = {
                                //     $set: { _id: element1.instrument_token, exch: element1.exch_seg },
                                // };

                                channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"

                                // const update_token = await stock_live_price.updateOne(filter, update, { upsert: true });



                            }
                        });


                    });


                    alltokenchannellist = channelstr.substring(0, channelstr.length - 1);
                    final_data.push(alltokenchannellist)

                }

            }
            var concatenatedArray = ""

            final_data.forEach((data) => {
                concatenatedArray += data + "#"
            });



            return res.send("Donee")
            return


        } catch (error) {
            console.log("Error Get_Option_All_Token_Chain", error);
        }


        return res.send("Donee")


    })

    app.get('/update/tradehistory/token', async (req, res) => {

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day
        
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day
        
        let getTradeHistory = await MainSignals.find({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          token:"0"
        });
        
        if (getTradeHistory.length > 0) {
            getTradeHistory.forEach(async (element) => {
          
                let tradeToken = await Alice_token.findOne({ symbol: element.symbol, segment: element.segment, expiry: element.expiry, strike: element.strike });
             

                if (tradeToken != null) {
                    let filter = { _id: element._id };
                    let update = { $set: { token: tradeToken.instrument_token } };
                    let updateTradeToken = await MainSignals.updateOne(filter, update);
                }

            });
        }


      return  res.send({ status: true })

    })


}

