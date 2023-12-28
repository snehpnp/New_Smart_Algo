var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const filePath = 'file.txt'; // Replace with the actual path to your text file
const { logger, getIPAddress } = require('../Helper/logger.helper')
var dateTime = require('node-datetime');
var moment = require('moment');
const db = require('../Models')
const Alice_token = db.Alice_token;
const User = db.user;
const user_logs = db.user_logs;
const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const { Get_Option_All_Token_Chain } = require('../../App/Controllers/Admin/option_chain.controller')
const { GetStrickPriceFromSheet } = require('../Controllers/Admin/signals.controller')
const { DashboardView, deleteDashboard } = require('../../View/DashboardData')


cron.schedule('0 1 * * *', () => {
    console.log('Delte Dashboard Data');
    deleteDashboard()
});


cron.schedule('0 6 * * *', () => {
    console.log('Create Dashboard view');
    DashboardView()
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

cron.schedule('10 1 * * *', () => {
    console.log('running a task every minute');
    TokenSymbolUpdate()
});


cron.schedule('*/30 * * * *', () => {
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
            console.log(error);
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
        console.log(error);
    }
}

//market holidays cron
const market_holiday_redis = async () => {
    console.log("okkk run code ");

    const axios = require('axios');

    let config1 = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www.nseindia.com/api/holiday-master?type=trading',
        headers: {

        }
    };

    await axios.request(config1)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });





    return





    var config = {
        method: 'get',
        url: 'https://www.nseindia.com/api/holiday-master?type=trading',
    };

    axios(config)
        .then(async function (response) {
            //  console.log("rr-----",JSON.stringify(response.data));
            var holiday_date = [];
            response.data.CM.forEach(element => {

                //   console.log("check date --",element.tradingDate);

                const originalDateString = element.tradingDate;
                const dateParts = originalDateString.split('-');

                // Create a new Date object with the year, month, and day
                const dateObj = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);

                // Use the Date object's methods to format the date as "YYYY-MM-DD"
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const formattedDateString = `${year}-${month}-${day}`;

                //  console.log("convert data -",formattedDateString);

                holiday_date.push(formattedDateString)


            });

            console.log("all -result", holiday_date);
            //      const market_holiday_redis = await client_redis.get('market_holiday_redis');
            //      console.log("market_holiday_redis",market_holiday_redis);

            //      if(market_holiday_redis == null){
            //        await client_redis.set('market_holiday_redis', JSON.stringify(holiday_date));

            //        console.log("market_holiday_redis-",market_holiday_redis); 

            //    }else{
            //        console.log("market_holiday_redis",market_holiday_redis);
            //        await client_redis.set('market_holiday_redis', JSON.stringify(holiday_date));
            //      }


        })
        .catch(function (error) {
            console.log(error);
        });



}

const twodaysclient = async () => {
    console.log("twodaysclient");
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
const numberOfTrade_count_trade =async ()=>{
    const update_trade_off = {
        $set: {
          numberOfTrade_count_trade: 0,
        },
       
      };
  
      const filter_trade_off = {};
      let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
}


module.exports = { service_token_update, TokenSymbolUpdate, TruncateTable, tokenFind ,twodaysclient,numberOfTrade_count_trade }

