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

        res.send("DONEE")
    })



    app.post("/all/tabel", async (req, res) => {
        try {
     
            const roles = await Roledata.find();
            if (roles.length !== 4) {
                await RoleCreate();
            }

   
            const companies = await company.find();
            if (companies.length === 0) {
                await CompanyCreate(req.body);
            }

         
            const categories = await categorie.find();
            if (categories.length !== 8) {
                console.log("Categories length:", categories.length);
                await categorie.deleteMany({});
                console.log('All categories deleted successfully.');
                await categorys();
            }

   
            const brokers = await Broker_information.find();
            if (brokers.length === 0) {
                await CreateBrokerinfo();
            }

            await service_token_update();
            await TokenSymbolUpdate();
            await DawnloadOptionChainSymbol();

            res.send("DONE");
        } catch (error) {
            console.error("Error in /all/tabel route:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    const DawnloadOptionChainSymbol = async () => {
        console.log("symbolupdate")
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
            // console.log("newRole", newRole);
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
            domain_url_https: "domain_url_https",
            broker_url: data.backend_rul,
            theme_id: "64d0c04a0e38c94d0e20ee28",
            theme_name: "theme_name"

        })
        // console.log("newRole", newRole);
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
            console.log('Broker information saved successfully:', savedData);
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
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c9797"),
                category_id: "1",
                name: 'CASH',
                segment: 'C',
                status: 0,
                CID: "1"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c9798"),
                category_id: "2",
                name: 'FUTURE',
                segment: 'F',
                status: 0,
                CID: "2"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c9799"),
                category_id: "3",
                name: 'OPTION',
                segment: 'O',
                status: 0,
                CID: "3"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c979a"),
                category_id: "4",
                name: 'MCX FUTURE',
                segment: 'MF',
                status: 0,
                CID: "4"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c979b"),
                category_id: "5",
                name: 'MCX OPTION',
                segment: 'MO',
                status: 0,
                CID: "5"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c979c"),
                category_id: "6",
                name: 'CURRENCY OPTION',
                segment: 'CO',
                status: 0,
                CID: "6"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c979d"),
                category_id: "7",
                name: 'CURRENCY FUTURE',
                segment: 'CF',
                status: 0,
                CID: "7"
            },
            {
                _id: mongoose.Types.ObjectId("64c9dbdc14a9fefd971c979e"),
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
            Is_Active: "1",
            client_key: client_key,
            Is_First_login: "1"
        });

        try {
            const savedUser = await UserData.save();
            console.log("newRole", savedUser);
            res.status(201).send("Admin created successfully");
        } catch (error) {
            console.error("Error saving user:", error);
            res.status(500).send("Error creating admin");
        }
    });



    // =====================================================================================================================














    app.get("/UpdateQty", async (req, res) => {

        const pipeline = [

            {
                $project: {
                    // Include fields from the original collection
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
                                    console.log("duplicate key")
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


