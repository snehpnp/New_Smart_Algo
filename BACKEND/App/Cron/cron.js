var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');


var Promise = require('polyfill-promise');
var Sheets = require('google-sheets-api').Sheets;
const Papa = require('papaparse')


const { logger, getIPAddress } = require('../Helper/logger.helper')
var dateTime = require('node-datetime');
var moment = require('moment');
const db = require('../Models')
const Alice_token = db.Alice_token;
const User = db.user;
const user_logs = db.user_logs;
const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const Get_Option_Chain_modal = db.option_chain_symbols;


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const db_main = client.db(process.env.DB_NAME);




const { DashboardView, deleteDashboard } = require('../../View/DashboardData')

const { createView } = require('../../View/Open_position')


cron.schedule('0 1 * * *', () => {
    console.log('Delte Dashboard Data');
    deleteDashboard()
    dropOpenPosition()
});


cron.schedule('0 6 * * *', () => {
    console.log('Create Dashboard view');
    DashboardView()
    createView()
});


cron.schedule('5 2 * * *', () => {
    console.log('Run First Time');
    LogoutAllUsers()
});

cron.schedule('5 5 * * *', () => {
    console.log('Run Second Time');
    LogoutAllUsers()
});

cron.schedule('0 8 * * *', () => {
    console.log('Run Second Time');
    Get_Option_All_Token_Chain()
});


cron.schedule('1 1 * * *', () => {
    console.log('running a task every minute');
    TruncateTable()
    numberOfTrade_count_trade();
});

// Accelpix Token Update Symbol Update
// cron.schedule('5 6 * * *', () => {
//     console.log('running a task every minute');
//     AccelpixTokenUpdate();
// });

cron.schedule('10 1 * * *', () => {
    console.log('running a task every minute');
    TokenSymbolUpdate()
});


cron.schedule('*/30 * * * *', () => {
    //console.log("okk")
    GetStrickPriceFromSheet();
});


cron.schedule('5 23 * * *', () => {
    console.log('Run Every 1 Second');
    twodaysclient();
});


// =========================================================================================================================

// 1. LOGOUT AND TRADING OFF ALL USER 
const LogoutAllUsers = async () => {

    // APP LOGOUT USERS  
    const AppLoginUser = await User.find({ AppLoginStatus: '1' });


    if (AppLoginUser.length > 0) {
        AppLoginUser.map(async (user) => {

            const updateValues = { AppLoginStatus: '0' };
            const updatedDocument = await User.findByIdAndUpdate(user._id, updateValues, {
                new: true, // To return the updated document
            });

            const user_login = new user_logs({
                user_Id: user._id,
                login_status: "Panel Off In App",
                role: user.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();
        })
    }

    // WEB LOGOUT USERS  
    const WebLoginUser = await User.find({ WebLoginStatus: '1' });
    if (WebLoginUser.length > 0) {
        WebLoginUser.map(async (user) => {
            const updateValues = { WebLoginStatus: '0' };
            const updatedDocument = await User.findByIdAndUpdate(user._id, updateValues, {
                new: true, // To return the updated document
            });

            const user_login = new user_logs({
                user_Id: user._id,
                login_status: "Panel Off In Web",
                role: user.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();
        })
    }


    // TRADING ON ANY USER 
    const TradingOffUser = await User.find({ TradingStatus: 'on' });
    if (TradingOffUser.length > 0) {
        TradingOffUser.map(async (user) => {
            const updateValues = { TradingStatus: 'off', access_token: "" };
            const updatedDocument = await User.findByIdAndUpdate(user._id, updateValues, {
                new: true, // To return the updated document
            });

            const user_login = new user_logs({
                user_Id: user._id,
                login_status: "Trading Off By System",
                role: user.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();
        })
    }


    // ADMIN TRADING OFF
    const updateOperation1 = { $set: { trading_status: 'off', access_token: "" } };
    const result1 = await live_price.updateMany({}, updateOperation1);



}

// SERVICES TOKEN CREATE
const service_token_update = () => {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        headers: {}
    };

    axios.request(config)
        .then((response) => {
            var Cash_stocks = []
            response.data.map(async (item) => {
                if (await item.exch_seg == "NSE") {
                    Cash_stocks.push(item)
                }
            });

            return Cash_stocks;

        })
        .catch((error) => {
            console.log("Error ", error);
        });

}

const TruncateTable = async () => {
    const drop = await Alice_token.deleteMany({});
}

// TOKEN SYMBOL CREATE
const TokenSymbolUpdate = () => {


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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()



                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });


                } else if (element.instrumenttype == 'FUTIDX' && element.exch_seg == "NFO") {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()

                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                } else if (element.instrumenttype == 'FUTCOM') {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()
                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                } else if (element.instrumenttype == 'OPTIDX' && element.exch_seg == "NFO") {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()
                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                } else if (element.instrumenttype == 'OPTSTK' && element.exch_seg == "NFO") {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()

                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                } else if (element.instrumenttype == 'OPTFUT') {

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

                } else if (element.instrumenttype == 'OPTCOM') {

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
                    // const userinfo = Alice_tokens.save()
                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                } else if (element.instrumenttype == 'OPTCUR') {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()

                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                } else if (element.instrumenttype == 'FUTCUR') {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()

                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });

                }

                // ONLY CASH STOCK
                if (element.symbol.slice(-3) == '-EQ') {

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

                    // const Alice_tokens = new Alice_token(user_data)
                    // const userinfo = Alice_tokens.save()

                    const filter = { instrument_token: element.token };
                    var updateOperation = { $set: user_data };
                    var Update_Stock_chain = await Alice_token.updateOne(filter, updateOperation, { upsert: true });
                }



            });
        });

    return "test";

}


const tokenFind = async () => {
    try {

        var findData = await Alice_token.aggregate([
            {
                $match: {
                    $and: [
                        { 'symbol': "NIFTY" },
                        { 'expiry': "26102023" },
                        { 'strike': { $gte: '19250', $lte: '19300' } }
                    ]
                }
            },
            {
                $group: {
                    _id: "$option_type",
                    tokens: { $push: "$$ROOT" }
                }
            }
        ])

        return findData

    } catch (error) {
        console.log("Error ", error);
    }
}

const twodaysclient = async () => {

    const twoDaysClientGet = await User.aggregate(
        [
            {
                $match: {
                    license_type: "0",
                    Is_Active: "1",
                    Role: "USER",
                    $expr: {
                        $gte: [
                            {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: "$EndDate"
                                }
                            },
                            {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: new Date()
                                }
                            }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "broker_responses",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "responses"
                }
            },
            {
                $match: {
                    "responses.order_id": { $ne: "" } // Filter out responses where order_id is not empty
                }
            },
            {
                $group: {
                    _id: 1, // Use a constant value as the _id
                    users: { $push: { _id: "$_id", responses: "$responses" } } // Include _id and responses in the 'users' array
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    users: {
                        $map: {
                            input: "$users",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                responses: {
                                    $map: {
                                        input: "$$user.responses",
                                        as: "response",
                                        in: {
                                            createdAt: {
                                                $dateToString: {
                                                    format: "%Y-%m-%d",
                                                    date: "$$response.createdAt"
                                                }
                                            },
                                            // Include other fields from the response if needed
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ])

    var UniqueDataArr = []

    if (twoDaysClientGet.length > 0) {


        var UserData = twoDaysClientGet[0].users.filter((data) => data.responses.length > 0);

        if (UserData.length > 0) {

            UserData.forEach((data) => {
                const uniqueCreatedAtValues = [...new Set(data.responses.map(item => item.createdAt))];
                UniqueDataArr.push({ user_id: data._id, createdAt: uniqueCreatedAtValues })
            })
        }


    }



    if (UniqueDataArr.length > 0) {

        UniqueDataArr.forEach(async (data) => {
            if (data.createdAt.length >= 2) {

                const filter = { _id: new ObjectId(data.user_id) };
                // Get the current date and time
                const currentDate = new Date();

                // Format the date to 'YYYY-MM-DD'
                const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

                const result = await User.updateOne(
                    filter,
                    { $set: { EndDate: formattedDate } }
                );

            }
        })

    }



    return UniqueDataArr
}


// Update numberOfTrade_count_trade 0
const numberOfTrade_count_trade = async () => {
    const update_trade_off = {
        $set: {
            numberOfTrade_count_trade: 0,
        },

    };

    const filter_trade_off = {};
    let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
}

// Accelpix Token Update
const AccelpixTokenUpdate = async () => {

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
                    upsert: true, // If no documents match the query, insert a new document
                };

                let Res = await Alice_token.updateMany(filter, update, options);

                


            });

        })
        .catch((error) => {
            console.log(error);
        });
}


// Get_Option_All_Token_Chain Function
 const Get_Option_All_Token_Chain = async () => {
    try {
        const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];

        const expiry = "30112023";
        let limit_set = 20
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


                            const stock_live_price = db_main.collection('token_chain');

                            const filter = { _id: element1.instrument_token };
                            const update = {
                                $set: { _id: element1.instrument_token, exch: element1.exch_seg },
                            };

                            channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"

                            const update_token = await stock_live_price.updateOne(filter, update, { upsert: true });



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


        var concatenatedArray1 = concatenatedArray.substring(0, concatenatedArray.length - 1)
        const filter = { broker_name: "ALICE_BLUE" };
        const updateOperation = { $set: { Stock_chain: concatenatedArray1 } };
        const Update_Stock_chain = await live_price.updateOne(filter, updateOperation);

        return

    } catch (error) {
        console.log("Error Get_Option_All_Token_Chain", error);
    }
 }


 // GetStrickPriceFromSheet Function
 const GetStrickPriceFromSheet = async ()=>{

    try {
        const csvFilePath = 'https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv';

        try {
            const { data } = await axios.get(csvFilePath);

            Papa.parse(data, {
                complete: async (result) => {
                    let sheet_Data = result.data;

                    // Remove duplicates based on SYMBOL
                    const uniqueSymbols = [...new Set(sheet_Data.map(item => item.SYMBOL))];
                    sheet_Data = sheet_Data.filter((item, index, self) =>
                        index === self.findIndex(t => t.SYMBOL === item.SYMBOL)
                    );

                    // Map and update specific SYMBOL values
                    sheet_Data.forEach(data => {
                        switch (data.SYMBOL) {
                            case "NIFTY_BANK":
                                data.SYMBOL = "BANKNIFTY";
                                break;
                            case "NIFTY_50":
                                data.SYMBOL = "NIFTY";
                                break;
                            case "NIFTY_FIN_SERVICE":
                                data.SYMBOL = "FINNIFTY";
                                break;
                            // Add more cases if needed
                        }
                    });

                    // Sort the array based on SYMBOL
                    sheet_Data.sort((a, b) => a.SYMBOL.localeCompare(b.SYMBOL));

                    // Use Promise.all to wait for all updates to complete
                    await Promise.all(sheet_Data.map(async (data) => {
                        const result = await Get_Option_Chain_modal.updateOne(
                            { symbol: data.SYMBOL },
                            { $set: { price: data.CPrice } }
                        );
                    }));
                
                    return
                },
                header: true,
            });
        } catch (error) {
            console.log('Error fetching or parsing CSV:', error.message);
            return
        }
    } catch (error) {
        console.log("Error Theme error-", error);
    }
 }



module.exports = { service_token_update, TokenSymbolUpdate, TruncateTable, tokenFind, numberOfTrade_count_trade, AccelpixTokenUpdate ,Get_Option_All_Token_Chain , GetStrickPriceFromSheet }
