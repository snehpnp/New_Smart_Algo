var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
var Promise = require('polyfill-promise');
var Sheets = require('google-sheets-api').Sheets;
const Papa = require('papaparse')


const { logger, getIPAddress } = require('../Helper/logger.helper')

const { Alice_Socket , updateChannelAndSend } = require("../Helper/Alice_Socket");



const { DashboardView, deleteDashboard } = require('../../View/DashboardData')
const { createView } = require('../../View/Open_position')
// const { logger, getIPAddress } = require('../Helper/logger.helper')
// const { Alice_Socket } = require("../Helper/Alice_Socket11");

var dateTime = require('node-datetime');
var moment = require('moment');
const db = require('../Models')
const Alice_token = db.Alice_token;
const User = db.user;
const user_logs = db.user_logs;
const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const Get_Option_Chain_modal = db.option_chain_symbols;
const MainSignals_modal = db.MainSignals

const token_chain = db.token_chain;
const stock_live_price = db.stock_live_price;





cron.schedule('10 5 * * *', () => { deleteDashboard() });

cron.schedule('15 5 * * *', () => { DashboardView(); createView(); });

cron.schedule('5 4 * * *', () => { LogoutAllUsers() });

cron.schedule('5 5 * * *', () => { LogoutAllUsers() });

cron.schedule('10 1 * * *', () => { numberOfTrade_count_trade(); });

cron.schedule('*/15 * * * *', () => { GetStrickPriceFromSheet(); });

cron.schedule('50 23 * * *', () => { twodaysclient(); });

cron.schedule('30 6 * * *', () => { TruncateTableTokenChain(); });

// cron.schedule('*/10 * * * *', async () => { await TruncateTableTokenChainAdd_fiveMinute() });



cron.schedule('05 23 * * *', () => { DeleteTokenAliceToken() });

// cron.schedule('55 23 * * *', () => { TruncateTable() });

cron.schedule('10 3 * * *', () => { DeleteTokenAliceToken() });

cron.schedule('20 3 * * *', () => { TokenSymbolUpdate() });

cron.schedule('50 8 * * *', () => { TokenSymbolUpdate() });



const MainSignalsRemainToken = async () => {


    const pipeline = [
        {
            $match: {
                $or: [
                    { segment: 'O' },
                    { segment: 'BO' }
                ],
                $expr: {
                    $gt: ["$entry_qty", "$exit_qty"]
                }
            }
        },
        {
            $addFields: {
                expiry_date: {
                    $dateFromString: {
                        dateString: "$expiry",
                        format: "%d%m%Y"
                    }
                },
                exch_seg: {
                    $cond: {
                        if: { $eq: ['$segment', 'C'] }, // Your condition here
                        then: 'NSE',
                        else: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $eq: ['$segment', 'F'] },
                                        { $eq: ['$segment', 'O'] },
                                        { $eq: ['$segment', 'FO'] }
                                    ]
                                },
                                then: 'NFO',
                                else: {

                                    $cond: {
                                        if: {
                                            $or: [
                                                { $eq: ['$segment', 'MF'] },
                                                { $eq: ['$segment', 'MO'] }
                                            ]
                                        },
                                        then: 'MCX',
                                        else: {

                                            $cond: {
                                                if: {
                                                    $or: [
                                                        { $eq: ['$segment', 'CF'] },
                                                        { $eq: ['$segment', 'CO'] }
                                                    ]
                                                },
                                                then: 'CDS',

                                                // all not exist condition 
                                                else: {
                                                    $cond: {
                                                        if: {
                                                            $or: [
                                                                { $eq: ['$segment', 'BF'] },
                                                                { $eq: ['$segment', 'BO'] }
                                                            ]
                                                        },
                                                        then: 'BFO',

                                                        // all not exist condition 
                                                        else: "NFO"

                                                    }
                                                }

                                            }

                                        }

                                    }


                                }

                            }

                        }

                    }
                },
            }
        },
        {
            $match: {
                expiry_date: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)) // Get the current date with time set to midnight
                }
            }
        },

        {
            $sort: {
                _id: -1 // Sort in ascending order. Use -1 for descending.
            }
        },
        {
            $project: {
                _id: 0,
                exch_seg: 1,
                token: 1
            }
        }


    ]



    const result = await MainSignals_modal.aggregate(pipeline)
    if (result.length > 0) {
        result.forEach(async (element) => {
            const filter = { _id: element.token };
            const update = {
                $set: { _id: element.token, exch: element.exch_seg },
            };
            const update_token = await token_chain.updateOne(filter, update, { upsert: true });

        });
    }

    return





}

const TruncateTableTokenChainAdd_fiveMinute = async () => {
    // const filter = { _id: c };
    // const update = {
    //     $set: { _id: c , exch: e },
    // };
    // const update_token = await token_chain.updateOne(filter, update, { upsert: true });
  
    // updateChannelAndSend(e+"|"+c)
   
    const indiaTimezoneOffset = 330;
    const currentTimeInMinutes = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + indiaTimezoneOffset;

    const currentHour = Math.floor(currentTimeInMinutes / 60) % 24;
    const currentMinute = currentTimeInMinutes % 60;
   
    if (currentHour >= 9 || currentMinute >= 15 && currentHour <= 23 || currentMinute <= 30) {

    
        
        const AliceToken = await Alice_token.find();
        if (AliceToken.length > 60000) {
             
            const drop = await token_chain.deleteMany({});

            await Get_Option_All_Token_Chain()

            await Get_Option_All_Token_Chain_stock()

            await MainSignalsRemainToken()

            const updateTokenAfter = await token_chain.find({}).toArray();
            const unmatchedTokenChannel = updateTokenAfter.map(item => `${item.exch}|${item._id}`).join('#');
           
           // updateChannelAndSend(unmatchedTokenChannel)
             //updateChannelAndSend("NSE|2885")
            //await Alice_Socket();

            return;
        }
    }else{
     
    }


    return;

}

const TruncateTableTokenChainAdd = async () => {
    const AliceToken = await Alice_token.find();
    if (AliceToken.length > 60000) {
        const drop = await token_chain.deleteMany({});

        await Get_Option_All_Token_Chain()

        await Get_Option_All_Token_Chain_stock()

        await Alice_Socket();

        return;
    }
    return;


}

const TruncateTableTokenChain = async () => {

    const drop = await token_chain.deleteMany({});

    const drop1 = await stock_live_price.deleteMany({});

    const AliceToken = await Alice_token.find();
    if (AliceToken.length > 60000) {

        await Get_Option_All_Token_Chain()

        await Get_Option_All_Token_Chain_stock()

        return;
    }
    return;


}

const Get_Option_All_Token_Chain = async () => {

    try {
        // const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY", "SENSEX", "BANKEX", "MIDCPNIFTY"];
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



                            const filter = { _id: element1.instrument_token };
                            const update = {
                                $set: { _id: element1.instrument_token, exch: element1.exch_seg },
                            };

                            channelstr += element1.exch_seg + "|" + element1.instrument_token + "#"

                            const update_token = await token_chain.updateOne(filter, update, { upsert: true });



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
    return
}

const Get_Option_All_Token_Chain_stock = async () => {

    try {
        // const symbols = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
        const pipeline_stock_symbol = [
            {
                $match: { token: "1" }
            },
        ]

        const symbols_array = await Get_Option_Chain_modal.aggregate(pipeline_stock_symbol);

        const symbols = symbols_array.map(item => item.symbol)

        const expiry = "30112023";
        let limit_set = 11
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


                            const stock_live_price = token_chain;

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


        // var concatenatedArray1 = concatenatedArray.substring(0, concatenatedArray.length - 1)
        // const filter = { broker_name: "ALICE_BLUE" };
        // const updateOperation = { $set: { Stock_chain: concatenatedArray1 } };
        // const Update_Stock_chain = await live_price.updateOne(filter, updateOperation);
        return


    } catch (error) {
        console.log("Error Get_Option_All_Token_Chain", error);
    }
    return
}

// =========================================================================================================================

// 1. LOGOUT AND TRADING OFF ALL USER 
const LogoutAllUsers = async () => {

    // APP LOGOUT USERS  
    const AppLoginUser = await User.find({ AppLoginStatus: '1' });


    if (AppLoginUser.length > 0) {
        AppLoginUser.map(async (user) => {

            const updateValues = { AppLoginStatus: '0', app_login_token: null };
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
            const updateValues = { WebLoginStatus: '0', web_login_token: null };
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
            console.log("Error Angel brokeing  cron ", error);
        });

}

const TruncateTable = async () => {
    const drop = await Alice_token.deleteMany({});
}

const DeleteTokenAliceToken = async () => {
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
       
        return
    } else {
        console.log('No expired tokens found.');
    }

    return ""
}

// TOKEN SYMBOL CREATE

function createUserDataArray(data, segment) {
    let count = 0
    return data.map(element => {
        //   count++
       
        // if (!element.name) {
      
        //     return null;
        // }
        const option_type = element.symbol.slice(-2);
        const expiry_s = dateTime.create(element.expiry);
        const expiry = expiry_s.format('dmY');
        const strike_s = parseInt(element.strike);
        const strike = parseInt(strike_s.toString().slice(0, -2));
        const day_start = element.expiry.slice(0, 2);
        const moth_str = element.expiry.slice(2, 5);
        const year_end = element.expiry.slice(-2);
        const Dat = new Date(element.expiry);
        const moth_count = Dat.getMonth() + 1;

        const tradesymbol_m_w = `${element.name}${year_end}${moth_count}${day_start}${strike}${option_type}`;

        return {
            symbol: element.name,
            expiry: expiry,
            expiry_month_year: expiry.slice(2),
            expiry_date: expiry.slice(0, -6),
            expiry_str: element.expiry,
            strike: strike,
            option_type: option_type,
            segment: segment,  // Default segment
            instrument_token: element.token,
            lotsize: element.lotsize,
            tradesymbol: element.symbol,
            tradesymbol_m_w: tradesymbol_m_w,
            exch_seg: element.exch_seg
        };
    });
}

async function insertData(dataArray) {

    try {
        const existingTokens = await Alice_token.distinct("instrument_token", {});
        const filteredDataArray = dataArray.filter(userData => {
            return !existingTokens.includes(userData.instrument_token);
        });

        await Alice_token.insertMany(filteredDataArray);
    } catch (error) {
        console.log("Error in insertData:", error)
    }

}

const TokenSymbolUpdate = async () => {


    try {
        var filePath = path.join(__dirname + '/checkTest.txt'); // Adjust the file path as needed
       
        fs.appendFile(filePath, "-----TokenSymbolUpdate  - " + new Date() + "----- ***\\n\n", function (err) {
            if (err) {
                console.log("err filePath", err);
            }
        });
    } catch (error) {
        console.log("err filePath Try catch", error);
    }


    try {
       

        const config = {
            method: 'get',
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        };

        const response = await axios(config);
        if (response.data.length > 0) {


            const filteredDataO = response.data.filter(element =>
                (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
                element.exch_seg === "NFO" && element.name != ""
            );
            const filteredDataF = response.data.filter(element =>
                (element.instrumenttype === 'FUTSTK' || element.instrumenttype === 'FUTIDX') &&
                element.exch_seg === "NFO" && element.name != ""
            );

            const filteredDataMF = response.data.filter(element =>
                element.instrumenttype === 'FUTCOM' && element.name != ""
            );
            const filteredDataMO = response.data.filter(element =>
                (element.instrumenttype === 'OPTFUT' || element.instrumenttype === 'OPTCOM') && element.name != ""
            );
            const filteredDataCO = response.data.filter(element =>
                element.instrumenttype === 'OPTCUR' && element.name != ""
            );
            const filteredDataCF = response.data.filter(element =>
                element.instrumenttype === 'FUTCUR' && element.name != ""
            );
            const filteredDataC = response.data.filter(element =>
                element.symbol.slice(-3) === '-EQ' && element.name != ""
            );

            const filteredDataBO = response.data.filter(element =>
                (element.instrumenttype === 'OPTIDX' || element.instrumenttype === 'OPTSTK') &&
                element.exch_seg === "BFO" && element.name != ""
            );

            const filteredDataBF = response.data.filter(element =>
                (element.instrumenttype === 'FUTSTK' || element.instrumenttype === 'FUTIDX') &&
                element.exch_seg === "BFO" && element.name != ""
            );
            const filteredDataBC = response.data.filter(element =>
                element.instrumenttype === "" && element.exch_seg === "BSE" && element.name != ""
            );


            // Segment O -OPTION
            const userDataSegment_O = await createUserDataArray(filteredDataO, "O");
            await insertData(userDataSegment_O);
    
            // Segment F - FUTURE
            const userDataSegment_F = await createUserDataArray(filteredDataF, "F");
            await insertData(userDataSegment_F);
            console.log("F")
            // Segment C -CASH
            const userDataSegment_C = await createUserDataArray(filteredDataC, "C");
            await insertData(userDataSegment_C);
            console.log("C")


            // Segment MF MCX FUTURE
            const userDataSegment_MF = await createUserDataArray(filteredDataMF, "MF");
            await insertData(userDataSegment_MF);
            console.log("MF")
            // Segment MO  MCX OPTION
            const userDataSegment_MO = createUserDataArray(filteredDataMO, "MO");
            await insertData(userDataSegment_MO);
            console.log("MO")




            // Segment CO CURRENCY OPTION
            const userDataSegment_CO = await createUserDataArray(filteredDataCO, "CO");
            await insertData(userDataSegment_CO);
            console.log("CO")

            // Segment CF  CURRENCY FUTURE
            const userDataSegment_CF = await createUserDataArray(filteredDataCF, "CF");
            await insertData(userDataSegment_CF);
            console.log("CF")

            // Segment BF
            const userDataSegment_BF = await createUserDataArray(filteredDataBF, "BF");
            await insertData(userDataSegment_BF);
            console.log("BF")
            // Segment BO
            const userDataSegment_BO = await createUserDataArray(filteredDataBO, "BO");
            await insertData(userDataSegment_BO);
            console.log("BO")

            // Segment BC
            const userDataSegment_BC = await createUserDataArray(filteredDataBC, "BC");
            await insertData(userDataSegment_BC);
            console.log("BC")
            

            try {
                var filePath = path.join(__dirname + '/checkTest.txt'); // Adjust the file path as needed
                console.log("filePath", filePath)
                fs.appendFile(filePath, "-----TokenSymbolUpdate End - " + new Date() + "----- ***\\n\n", function (err) {
                    if (err) {
                        console.log("err filePath", err);
                    }

                });
            } catch (error) {
                console.log("err filePath Try catch", error);
            }
            console.log("TokenSymbolUpdate End:", " TIME ", new Date());
            return
        } else {
            return
        }
    } catch (error) {
        console.log("Error TokenSymbolUpdate Try catch", " TIME ", new Date(), error);
    }
}


const TokenSymbolUpdate1 = async () => {


    try {
        var filePath = path.join(__dirname + '/checkTest.txt'); // Adjust the file path as needed
        console.log("filePath", filePath)
        fs.appendFile(filePath, "-----TokenSymbolUpdate  - " + new Date() + "----- ***\\n\n", function (err) {
            if (err) {
                console.log("err filePath", err);
            }
        });
    } catch (error) {
        console.log("err filePath Try catch", error);
    }


    try {
        console.log("TokenSymbolUpdate Start", " TIME ", new Date());

        const config = {
            method: 'get',
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        };

        const response = await axios(config);
        if (response.data.length > 0) {

            for (const element of response.data) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1)); // 1 millisecond delay
                    const option_type = element.symbol.slice(-2);
                    const expiry_s = dateTime.create(element.expiry);
                    const expiry = expiry_s.format('dmY');
                    const strike_s = parseInt(element.strike);
                    const strike = parseInt(strike_s.toString().slice(0, -2));
                    const day_start = element.expiry.slice(0, 2);
                    const moth_str = element.expiry.slice(2, 5);
                    const year_end = element.expiry.slice(-2);
                    const Dat = new Date(element.expiry);
                    const moth_count = Dat.getMonth() + 1;

                    let tradesymbol_m_w;

                    // Check existing token
                    if (element.token != undefined) {
                        const exist_token = await Alice_token.findOne({ instrument_token: element.token }, { instrument_token: 1 });
                        if (exist_token == null) {
                            tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                            const user_data = {
                                symbol: element.name,
                                expiry: expiry,
                                expiry_month_year: expiry.slice(2),
                                expiry_date: expiry.slice(0, -6),
                                expiry_str: element.expiry,
                                strike: strike,
                                option_type: option_type,
                                segment: "F",  // Default segment, this will be changed based on condition
                                instrument_token: element.token,
                                lotsize: element.lotsize,
                                tradesymbol: element.symbol,
                                tradesymbol_m_w: tradesymbol_m_w,
                                exch_seg: element.exch_seg
                            };

                            // Adjust segment based on instrument type
                            if ((element.instrumenttype == 'FUTSTK' || element.instrumenttype == 'FUTIDX') && element.exch_seg == "NFO") {
                                user_data.segment = "F";
                            } else if (element.instrumenttype == 'FUTCOM') {
                                user_data.segment = "MF";
                            } else if ((element.instrumenttype == 'OPTIDX' || element.instrumenttype == 'OPTSTK') && element.exch_seg == "NFO") {
                                user_data.segment = "O";
                            } else if (element.instrumenttype == 'OPTFUT' || element.instrumenttype == 'OPTCOM') {
                                user_data.segment = "MO";
                            } else if (element.instrumenttype == 'OPTCUR') {
                                user_data.segment = "CO";
                            } else if (element.instrumenttype == 'FUTCUR') {
                                user_data.segment = "CF";
                            } else if (element.symbol.slice(-3) == '-EQ') {
                                user_data.segment = "C";
                            }
                            else if ((element.instrumenttype == 'OPTIDX' || element.instrumenttype == 'OPTSTK') && element.exch_seg == "BFO") {
                                user_data.segment = "BO";
                            }
                            else if ((element.instrumenttype == 'FUTSTK' || element.instrumenttype == 'FUTIDX') && element.exch_seg == "BFO") {
                                user_data.segment = "BF";
                            }
                            else if (element.instrumenttype == '' && element.exch_seg == "BSE") {
                                user_data.segment = "BC";
                            }


                            // Insert or update token data
                            const filter = { instrument_token: element.token };
                            await Alice_token.updateOne(filter, { $set: user_data }, { upsert: true });
                        }
                    }

                } catch (dbError) {
                    console.log("Database Error during TokenSymbolUpdate loop:", dbError, " TIME ", new Date(), dbError);
                    break; // Break the loop if a database error occurs
                    return
                }


            }

            try {
                var filePath = path.join(__dirname + '/checkTest.txt'); // Adjust the file path as needed
                console.log("filePath", filePath)
                fs.appendFile(filePath, "-----TokenSymbolUpdate End - " + new Date() + "----- ***\\n\n", function (err) {
                    if (err) {
                        console.log("err filePath", err);
                    }
                });
            } catch (error) {
                console.log("err filePath Try catch", error);
            }
            console.log("TokenSymbolUpdate End:", " TIME ", new Date());
            return
        } else {
            return
        }
    } catch (error) {
        console.log("Error TokenSymbolUpdate Try catch", " TIME ", new Date(), error);
    }
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

// const twodaysclient = async () => {

//     const twoDaysClientGet = await User.aggregate(
//         [
//             {
//                 $match: {
//                     license_type: "0",
//                     Is_Active: "1",
//                     Role: "USER",
//                     $expr: {
//                         $gte: [
//                             {
//                                 $dateToString: {
//                                     format: "%Y-%m-%d",
//                                     date: "$EndDate"
//                                 }
//                             },
//                             {
//                                 $dateToString: {
//                                     format: "%Y-%m-%d",
//                                     date: new Date()
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "broker_responses",
//                     localField: "_id",
//                     foreignField: "user_id",
//                     as: "responses"
//                 }
//             },
//             {
//                 $match: {
//                     "responses.order_id": { $ne: "" } // Filter out responses where order_id is not empty
//                 }
//             },
//             {
//                 $group: {
//                     _id: 1, // Use a constant value as the _id
//                     users: { $push: { _id: "$_id", responses: "$responses" } } // Include _id and responses in the 'users' array
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0, // Exclude the _id field
//                     users: {
//                         $map: {
//                             input: "$users",
//                             as: "user",
//                             in: {
//                                 _id: "$$user._id",
//                                 responses: {
//                                     $map: {
//                                         input: "$$user.responses",
//                                         as: "response",
//                                         in: {
//                                             createdAt: {
//                                                 $dateToString: {
//                                                     format: "%Y-%m-%d",
//                                                     date: "$$response.createdAt"
//                                                 }
//                                             },
//                                             // Include other fields from the response if needed
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         ])

//     var UniqueDataArr = []

//     if (twoDaysClientGet.length > 0) {
//         var UserData = twoDaysClientGet[0].users.filter((data) => data.responses.length > 0);
//         console.log("UserData ",UserData)
//         if (UserData.length > 0) {

//             UserData.forEach((data) => {
//                 const uniqueCreatedAtValues = [...new Set(data.responses.map(item => item.createdAt))];
//                 UniqueDataArr.push({ user_id: data._id, createdAt: uniqueCreatedAtValues })
//             })
//         }
//     }

//     if (UniqueDataArr.length > 0) {

//         UniqueDataArr.forEach(async (data) => {
//             if (data.createdAt.length >= 2) {
//                 const filter = { _id: new ObjectId(data.user_id) };
//                 // Get the current date and time
//                 const currentDate = new Date();

//                 // Format the date to 'YYYY-MM-DD'
//                 const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

//                 const result = await User.updateOne(
//                     filter,
//                     { $set: { EndDate: formattedDate } }
//                 );

//             }
//         })

//     }

//     return UniqueDataArr
// }

const twodaysclient = async () => {
    try {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];

        const twoDaysClientGet = await User.aggregate([
            {
                $match: {
                    license_type: "0",
                    Is_Active: "1",
                    Role: "USER",
                    $expr: {
                        $gte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$EndDate" } },
                            formattedToday
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
            { $match: { "responses.order_id": { $ne: "" } } },
            {
                $project: {
                    _id: 0,
                    users: {
                        $filter: {
                            input: {
                                $map: {
                                    input: "$responses",
                                    as: "response",
                                    in: { createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$$response.createdAt" } } }
                                }
                            },
                            as: "response",
                            cond: { $gte: [{ $size: "$$response" }, 2] }
                        }
                    }
                }
            }
        ]);

        if (twoDaysClientGet.length === 0) return [];

        const updates = twoDaysClientGet[0].users.map(async ({ _id }) => {
            return User.updateOne({ _id: new ObjectId(_id) }, { $set: { EndDate: formattedToday } });
        });

        await Promise.all(updates);

        return twoDaysClientGet[0].users;
    } catch (error) {
        console.error("Error occurred:", error);
        return [];
    }
};

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
    return
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

const GetStrickPriceFromSheet = async () => {



    try {
     const indiaTimezoneOffset = 330;
    const currentTimeInMinutes = new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + indiaTimezoneOffset;

    const currentHour = Math.floor(currentTimeInMinutes / 60) % 24;
    const currentMinute = currentTimeInMinutes % 60;

    if (currentHour >= 9  && currentHour <= 24) {
            const csvFilePath = 'https://docs.google.com/spreadsheets/d/1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU/export?format=csv';
            const { data } = await axios.get(csvFilePath);

            Papa.parse(data, {
                complete: async (result) => {
                    let sheet_Data = result.data;

                    const uniqueSymbols = [...new Set(sheet_Data.map(item => item.SYMBOL))];
                    sheet_Data = sheet_Data.filter((item, index, self) =>
                        index === self.findIndex(t => t.SYMBOL === item.SYMBOL)
                    );

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
                           
                        }
                    });

                    sheet_Data.sort((a, b) => a.SYMBOL.localeCompare(b.SYMBOL));

                    await Promise.all(sheet_Data.map(async (data) => {
                        if(data.CPrice != undefined && data.CPrice != "" && data.CPrice != "#N/A"){
                        const result = await Get_Option_Chain_modal.updateOne(
                            { symbol: data.SYMBOL },
                            { $set: { price: data.CPrice } },
                            { upsert: true }
                        );
                    }
                    }));

                    return
                },
                header: true,
            });
        }

    } catch (error) {
        console.log('Error fetching or parsing CSV:', error.message);
        return
    }

}



module.exports = { service_token_update, TokenSymbolUpdate, TruncateTable, tokenFind, numberOfTrade_count_trade, AccelpixTokenUpdate, GetStrickPriceFromSheet, TruncateTableTokenChain, TruncateTableTokenChainAdd, MainSignalsRemainToken, DeleteTokenAliceToken ,TruncateTableTokenChainAdd_fiveMinute}