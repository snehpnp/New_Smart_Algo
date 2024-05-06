module.exports = function (app) {

    const db = require('./App/Models');
    const Alice_token = db.Alice_token;
    var dateTime = require('node-datetime');
    var moment = require('moment');


    const User = db.user;
    const user_logs = db.user_logs;
    const live_price = db.live_price;
    const UserMakeStrategy = db.UserMakeStrategy;
    const Get_Option_Chain_modal = db.option_chain_symbols;


    const { DashboardView } = require('./View/DashboardData')
    const { createView, dropOpenPosition, open_position_excute } = require('./View/Open_position')
    const { createViewAlice } = require('./View/Alice_blue')
    const { createViewUpstox } = require('./View/Upstox')
    const { createViewDhan } = require('./View/dhan')
    const { createViewFyers } = require('./View/fyers')
    const { MainSignalsRemainToken } = require('./App/Cron/cron')



    const { MongoClient } = require('mongodb');

    // Define MongoDB connection details
    const servers = [
        
         "mongodb://pnpinfotech:p%26k56%267GsRy%26vnd%26@193.239.237.136:27017/",
        "mongodb://codingpandit:zsg%26k5sB76%263H%26dk7A%26@185.209.75.31:27017/",
        "mongodb://adonomist:p%26k5H6%267GsRy%26vnd%26@193.239.237.93:27017/",
        "mongodb://adonomist:p%26k5H6%267GsRy%26vnd%26@193.239.237.178:27017/",
        "mongodb://algobullstradingsolutions:p%26ol5Hd%26trad%26i@193.239.237.92:27017/",
        "mongodb://cpandit:im%3DCtv%7BOu%235V9QT%25@45.79.123.122:27017/",
        "mongodb://algokuber:p%26k506%267G%26y%26vnd%26@193.239.237.135:27017/",
        "mongodb://finnshri:p0%26k506%267s9Ry%26vn8d@193.239.237.137:27017/",
        "mongodb://visioniq:%26k%23sA8B%267Gmg%26vn3%237A%26@185.209.75.2:27017/",
        "mongodb://believetechnology:%26k%23sA8B%237Gsq%26vg3%237P%26@185.209.75.5:27017/",
        "mongodb://realbottrading:u%26r5nC86%267Gr%26vn37M%26@185.209.75.8:27017/",
        "mongodb://growskyinfotech:u%26j8gB85%267GN%26vn37m%26@185.209.75.9:27017/",
        "mongodb://corebizinfotech:c%26eaV8N%267KfT%26bc49A%26@185.209.75.10:27017/",
        "mongodb://inspirealgo:n%26pdF7G%265Png%26vn97A%26@185.209.75.11:27017/",
        "mongodb://uniquetechnology:c%26z9yB73%267Fn%26vn98V%26@185.209.75.12:27017/",
        "mongodb://yourstechexpert:sA8k%26n86%267Mv%26fh57B%26@185.209.75.14:27017/",
        "mongodb://alphapulsepro:un%26r4hv93%267Gr%26v%2637P%26@185.209.75.15:27017/",
        "mongodb://sumedhainnovations:p%26k5H6%267GsRy%26vnd@185.209.75.21:27017/",
        "mongodb://tradeonn:pw%26k5H6%267GsRy%26vn@185.209.75.23:27017/",
        "mongodb://vintyaitsolutions:byk%265fD328Pvjn3u7A%26@185.209.75.27:27017/",
        "mongodb://growupalgo:p%26k5H6%267GsRy%26vnd@185.209.75.22:27017/",
        "mongodb://robotexfintech:z43rk%265eF32%267Pcmn9i7B%26@185.209.75.28:27017/",
        "mongodb://metaprogramming:zc%26u9tD828Tnbh3u7A%26@185.209.75.29:27017/",
        "mongodb://fincodify:u%26v5%26bAn6%265Gv%26cn29A%26@185.209.75.30:27017/",
    ];

    

   
   
  //testtt

    // Connect to MongoDB and create views
    async function createViewsAllDatabase() {
        for (const server of servers) {
            const client = new MongoClient(server);

            try {
                await client.connect();
                const database = "test";
                const db = client.db(database);

                const viewName = "open_position_excute";
                const collectionName = "open_position";

                 // Define view pipeline
                const viewPipeline = [
                    {
                        $match: {
                            $or: [
                                // { isLpInRange1: true },
                                { isLpInRangeTarget: true },
                                { isLpInRangeStoploss: true },
                                { isLpInRange: 1 },
                                { isLpInRange: 0 }
                            ]
                        }
                    }
                  ]



                const collectionExists = await db.listCollections({ name: viewName }).hasNext();

                if (!collectionExists) {
                    // Create the view collection
                    await db.createCollection(viewName, { viewOn: collectionName, pipeline: viewPipeline });
                    console.log(`View ${viewName} created in 'test' on '${server}'`);
                } else {
                    console.log(`Collection ${viewName} already exists in 'test' on '${server}'`);
                }
            } 
            
            catch(error){
                console.log(`An error occurred: ${error}`);
            }
            finally {
                await client.close();
            }
        }
    }

    app.get("/AllViewCreate", async (req, res) => {
        //createViewsAllDatabase();
        //deleteViewsAllDatabase();
        RunQueryUpdateAllDatabase()
       // RunQueryAddAllDatabase()
        res.send("okkkk")
    });

    async function deleteViewsAllDatabase() {
        for (const server of servers) {
            const client = new MongoClient(server);
    
            try {
                await client.connect();
                const database = "test";
                const db = client.db(database);

                const viewName = "open_position_excute";
                //const collectionName = "users";
                const collectionExists = await db.listCollections({ name: viewName }).hasNext();
    
                if (collectionExists) {

                    // Drop the existing view collection
                    await db.collection(viewName).drop();
                    console.log(`View '${viewName}' dropped in '${database}' on '${server}'`);
                 }else{
                    console.log(`View '${viewName}' Not exist in '${database}' on '${server}'`);

                }
    


                // Create the view collection
                // await db.createCollection(viewName, { viewOn: collectionName, pipeline: viewPipeline });

              //  console.log(`View '${viewName}' created in '${database}' on '${server}'`);

              
            } 
            
            catch(error){
                console.log(`An error occurred: ${error}`);
            }
            finally {
                await client.close();
            }
        }
    }

    async function RunQueryUpdateAllDatabase() {
        for (const server of servers) {
            const client = new MongoClient(server);
    
            try {
                await client.connect();
                const database = "test";
                const db = client.db(database);

                const collectionName = "mainsignals";

                const fliter = {};

                const updates = {$set:{ exit_time: "0", target: "0" ,stop_loss:"0"} };

                const options = { multi: true };

                const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    
                if (collectionExists) {
                
                // Run the updateMany query
                const result = await db.collection(collectionName).updateMany(fliter,updates,options);
                console.log(`Updated ${result.modifiedCount} documents in 'mainsignals' collection on '${server}'`);

                } else {
                    console.log(`Collection Not exists in 'test' on '${server}'`);
                }
                
               
            } 
            
            catch(error){
                console.log(`An error occurred: ${error}`);
            }
            finally {
                await client.close();
            }
        }
    }


    async function RunQueryAddAllDatabase() {
        for (const server of servers) {
            const client = new MongoClient(server);
    
            try {
                await client.connect();
                const database = "test";
                const db = client.db(database);
                const collectionName = "mainsignals";
    
        
                const documentToInsert = [{ss:"okk" }];
    
                const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    
                if (collectionExists) {
                    // Insert one document into the collection
                    const result = await db.collection(collectionName).insertMany(documentToInsert);
                    console.log(`Inserted 1 document into 'mainsignals' collection on '${server}'`);
                } else {
                    console.log(`Collection does not exist in 'test' on '${server}'`);
                }
            } 
            
            catch(error){
                console.log(`An error occurred: ${error}`);
            }
            finally {
                await client.close();
            }
        }
    }









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
            console.log(`${result.length} expired tokens deleted.`);
        } else {
            console.log('No expired tokens found.');
        }

        res.send({ data: result, count: result.length })
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



                    //  if (element.instrumenttype == 'OPTIDX' && element.exch_seg == "NFO") {

                    //     tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                    //     var moth_str_single = moth_str.slice(0, 1);
                    //     var tradesymbol_zerodha;
                    //     tradesymbol_zerodha = element.name + year_end + moth_str_single + day_start + strike + option_type;

                    //     let exist_token =   await Alice_token.findOne({instrument_token:element.token},{instrument_token:1})  
                    //     if(exist_token == null){
                    //          count++
                    //          console.log("exist_token ",exist_token  , " token - " ,element.token , " count -",count)
                    //         var user_data = {
                    //             symbol: element.name,
                    //             expiry: expiry,
                    //             expiry_month_year: expiry_month_year,
                    //             expiry_date: expiry_date,
                    //             expiry_str: element.expiry,
                    //             strike: strike,
                    //             option_type: option_type,
                    //             segment: "O",
                    //             instrument_token: element.token,
                    //             lotsize: element.lotsize,
                    //             tradesymbol: element.symbol,
                    //             tradesymbol_m_w: tradesymbol_m_w,
                    //             exch_seg: element.exch_seg
                    //         };
                    //         const filter = { instrument_token: element.token };
                    //         var updateOperation = { $set: user_data };
                    //         var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                    //     }



                    // } 






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

                            // const Alice_tokens = new Alice_token(user_data)
                            // // const userinfo = Alice_tokens.save()

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

        res.send({ data: "okk" })
    });



    app.get("/test", (req, res) => {
        MainSignalsRemainToken()
        res.send("DONEE")
    })


    app.get('/dropOpenPosition', async (req, res) => {
        dropOpenPosition()
        res.send({ msg: "Delete Done!!!" })
    })


    app.get('/createView', async (req, res) => {
        createViewFyers();
        // createViewAlice();
        //createView()
        // open_position_excute()
        res.send({ msg: "Create View Done!  !!" })
    })

    app.get('/brokerView', async (req, res) => {
        //createViewUpstox()
        createViewDhan();
        res.send({ msg: "Create View broker!  !!" })
    })


    app.get('/dashboard-view', async (req, res) => {
        DashboardView()
        res.send({ msg: "Dashboard view create Done!!!" })
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
                // console.log(JSON.stringify(response.data));
                const result = await Alice_token.aggregate([
                    {
                        $project: {
                            instrument_token: 1
                        }
                    }

                ])

                result.forEach(async (element) => {

                    const Exist_token = response.data.find(item1 => item1.tk === parseInt(element.instrument_token));

                    //  console.log("Exist tkr ",Exist_token.tkr , "Exist a3tkr ",Exist_token.a3tkr , "Token ",element.instrument_token)



                    const update = {
                        $set: {
                            tkr: Exist_token.tkr,
                            a3tkr: Exist_token.a3tkr,
                        },
                    };

                    const filter = { instrument_token: element.instrument_token };

                    const options = {
                        upsert: true, // If no documents match the query, insert a new document
                    };

                    let Res = await Alice_token.updateMany(filter, update, options);

                    // console.log("Res ", Res)


                });

            })
            .catch((error) => {
                console.log("Error", error);
            });






        res.send({ msg: "okk" })
    })



    app.get("/optionStockData", async (req, res) => {


        try {



            ///const symbols = ["HDFCBANK","ACC"];

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

            console.log("concatenatedArray - ", concatenatedArray)

            // var concatenatedArray1 = concatenatedArray.substring(0, concatenatedArray.length - 1)
            //   const filter = { broker_name: "ALICE_BLUE" };
            //  const updateOperation = { $set: { Stock_chain: concatenatedArray1 } };
            // const Update_Stock_chain = await live_price.updateOne(filter, updateOperation);
            res.send("Donee")
            return


        } catch (error) {
            console.log("Error Get_Option_All_Token_Chain", error);
        }


















        res.send("Donee")





    })

}


