module.exports = function (app) {

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
    const user_logs = db.user_logs;
    const live_price = db.live_price;
    const UserMakeStrategy = db.UserMakeStrategy;
    const Get_Option_Chain_modal = db.option_chain_symbols;
    const company = db.company_information;
    const Roledata = db.role;


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



    // ========================================================================================================

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
        res.send("DONEE")
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
            console.log("SNEH")


            res.send("DONE");
        } catch (error) {
            console.error("Error in /all/tabel route:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    var CreateDataBase = async (data) => {
        const uri = data;
        const databaseName = "TradeTools"
        console.log("uri", uri)

        if(uri){

            if (!databaseName) {
                console.log('Database name is required');
            }
    
            try {
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();
    
                const db = client.db(databaseName);
                await db.createCollection('dummy'); // Create a dummy collection to initialize the database
    
                await client.close();
                console.log(`Database ${databaseName} created successfully`);
            } catch (error) {
                console.error(error);
    
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



    // Role Create
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



    // Create Company information Table 
    const CompanyCreate = (data) => {
        const companyData = new company({
            panel_name: data.panelname,
            panel_key: data.client_key,
            prefix: data.client_key.substring(0, 3),
            domain_url: data.domain,
            domain_url_https: data.backend_rul + '/#/login',
            broker_url: data.backend_rul+'/signal/broker-signals',
            theme_id: "64d0c04a0e38c94d0e20ee28",
            theme_name: "theme_name",
            disclaimer: "Disclaimer: The risk of loss in trading in any financial markets or exchange can be substantial. These are leveraged products that carry a substantial risk of loss up to your invested capital and may not be suitable for everyone. You should therefore carefully consider whether such trading is suitable for you considering your financial condition. Please ensure that you fully understand the risks involved and do not invest money you cannot afford to lose. Past performance does not guarantee future performance. Historical returns, expected returns, and probability projections are provided for informational and illustrative purposes, and may not reflect actual future performance. SKW Investment Adviser does not guarantee returns in any of its products or services.",
            version: "1.0",
            panel_short_name: data.client_key.substring(0, 3),
            licenses: 0


        })
        return companyData.save();
    }



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
            console.error('Error saving broker information:', error);
            // throw error; // Rethrow the error if you want it to be handled by the calling function
            return null
        }
    };


    // Create categorys 
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
            Stock_chain: "NFO|45650#NFO|45691#NFO|64378#NFO|64379#NFO|45802#NFO|45801#NFO|64380#NFO|64381#NFO|45803#NFO|45832#NFO|64391#NFO|64390#NFO|46863#NFO|46864#NFO|64395#NFO|64394#NFO|47636#NFO|47637#NFO|64397#NFO|64396#NFO|47640#NFO|47639#NFO|64407#NFO|64410#NFO|49559#NFO|49560#NFO|64411#NFO|64412#NFO|49569#NFO|49568#NFO|64414#NFO|64413#NFO|49576#NFO|49577#NFO|64417#NFO|64418#NFO|49581#NFO|49580#NFO|71298#NFO|71301#NFO|49582#NFO|49591#NFO|64423#NFO|64425#NFO|51403#NFO|51405#NFO|64426#NFO|64427#NFO|54495#NFO|54496#NFO|64429#NFO|64428#NFO|54497#NFO|54498#NFO|64430#NFO|64431#NFO|54499#NFO|54500#NFO|64433#NFO|64432#NFO|54502#NFO|54501#NFO|64434#NFO|64435#NFO|63912#NFO|63911#NFO|64436#NFO|64437#NFO|63914#NFO|63913#NFO|64439#NFO|64438#NFO|63916#NFO|63915#NFO|64440#NFO|64443#NFO|68967#NFO|68966#NFO|64444#NFO|64445#NFO|53752#NFO|53753#NFO|55208#NFO|55209#NFO|53755#NFO|53754#NFO|55210#NFO|55211#NFO|53757#NFO|53756#NFO|55213#NFO|55212#NFO|53758#NFO|53759#NFO|55215#NFO|55214#NFO|53760#NFO|53761#NFO|55217#NFO|55216#NFO|53762#NFO|53763#NFO|55218#NFO|55219#NFO|53765#NFO|53764#NFO|55225#NFO|55220#NFO|53766#NFO|53767#NFO|55227#NFO|55226#NFO|53768#NFO|53769#NFO|55228#NFO|55229#NFO|53771#NFO|53770#NFO|55230#NFO|55231#NFO|53772#NFO|53773#NFO|55233#NFO|55232#NFO|53774#NFO|53775#NFO|55234#NFO|55235#NFO|53777#NFO|53776#NFO|55236#NFO|55237#NFO|53778#NFO|53781#NFO|55239#NFO|55238#NFO|53782#NFO|53783#NFO|55243#NFO|55240#NFO|53785#NFO|53786#NFO|55244#NFO|55247#NFO|53789#NFO|53788#NFO|55248#NFO|55249#NFO|53790#NFO|53791#NFO|55251#NFO|55250#NFO|53793#NFO|53792#NFO|55252#NFO|55253#NFO|53794#NFO|53795#NFO|55254#NFO|55255#NFO|65886#NFO|65887#NFO|56292#NFO|56293#NFO|65888#NFO|65889#NFO|56294#NFO|56297#NFO|65890#NFO|65891#NFO|56299#NFO|56298#NFO|65894#NFO|65895#NFO|56300#NFO|56303#NFO|65899#NFO|65898#NFO|56305#NFO|56304#NFO|65900#NFO|65923#NFO|56307#NFO|56306#NFO|65925#NFO|65924#NFO|56309#NFO|56308#NFO|65926#NFO|65927#NFO|56310#NFO|56311#NFO|65928#NFO|65929#NFO|56312#NFO|56313#NFO|65943#NFO|65930#NFO|56314#NFO|56315#NFO|65950#NFO|66033#NFO|56317#NFO|56316#NFO|66035#NFO|66034#NFO|56319#NFO|56318#NFO|66036#NFO|66046#NFO|56320#NFO|56321#NFO|66048#NFO|66047#NFO|56323#NFO|56322#NFO|66050#NFO|66049#NFO|56325#NFO|56324#NFO|66052#NFO|66051#NFO|56326#NFO|56327#NFO|66054#NFO|66053#NFO|56329#NFO|56328#NFO|66056#NFO|66055#NFO|56331#NFO|56330#NFO|36314#NFO|36315#NFO|56332#NFO|56333#NFO|66057#NFO|66058#NFO|56335#NFO|56334",



        })
        return live_priceData.save();
    }







    app.post("/add/admin", async (req, res) => {
        const { panelname, client_key } = req.body;

        if (!panelname || !client_key) {
            return res.status(400).send("Panel name and client key are required.");
        }

        const Email = `${panelname}@gmail.com`;

        const UserData = new User({
            FullName: "admin",
            UserName: "admin",
            Email: Email,
            PhoneNo: "9999999999",
            Password: "$2b$08$x3Sm7wmIGOaUPnjxZulVXeYZaZCg8LsRBZQDrvzhui8gqeXEAcJGK",
            Otp: "123456",
            StartDate: new Date("2023-07-10T00:00:00.000Z"),
            EndDate: new Date("2024-07-15T00:00:00.000Z"),
            ActiveStatus: "1",
            Role: "ADMIN",
            AppLoginStatus: "0",
            WebLoginStatus: "1",
            TradingStatus: "off",
            CreateDate: new Date("2023-07-31T08:21:49.854Z"),
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
        });

        const UserData1 = new User({
            FullName: "admin",
            UserName: "admin",
            Email: "PNP@gmail.com",
            PhoneNo: "9999999999",
            Password: "$2b$08$x3Sm7wmIGOaUPnjxZulVXeYZaZCg8LsRBZQDrvzhui8gqeXEAcJGK",
            Otp: "123456",
            StartDate: new Date("2023-07-10T00:00:00.000Z"),
            EndDate: new Date("2024-07-15T00:00:00.000Z"),
            ActiveStatus: "1",
            Role: "ADMIN",
            AppLoginStatus: "0",
            WebLoginStatus: "1",
            TradingStatus: "off",
            CreateDate: new Date("2023-07-31T08:21:49.854Z"),
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
        });
        try {
            const savedUser = await UserData.save();
            const savedUser1 = await UserData1.save();

            res.status(201).send("Admin created successfully");
        } catch (error) {
            console.error("Error saving user:", error);
            res.status(500).send("Error creating admin");
        }
    });



    // =====================================================================================================================


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



        res.send({ status: true })






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
                                    console.error('Error creating and saving user:', err);
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






        res.send({ msg: "okk" })
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



            res.send("Donee")
            return


        } catch (error) {
            console.log("Error Get_Option_All_Token_Chain", error);
        }


















        res.send("Donee")





    })

}


