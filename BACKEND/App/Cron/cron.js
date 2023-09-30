var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const filePath = 'file.txt'; // Replace with the actual path to your text file
const { logger, getIPAddress } = require('../Helper/logger.helper')
var dateTime = require('node-datetime');
var moment = require('moment');
const db = require('../Models')
const User = db.user;
const user_logs = db.user_logs;
const Alice_token = db.Alice_token;




// 1. LOGOUT AND TRADING OFF ALL USER 
cron.schedule('5 2 * * *', () => {
    console.log('Run First Time');
    LogoutAllUsers()
});

// 1.1 LOGOUT AND TRADING OFF ALL USER 
cron.schedule('5 5 * * *', () => {
    console.log('Run Second Time');
    LogoutAllUsers()
});


// 2. SERVICES TOKEN CREATE
cron.schedule('42 12 * * *', () => {
    console.log('running a task every minute');
    service_token_update()
});



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
              const updateValues = {TradingStatus: 'off' };
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


}









// =============================<< HELLO SNEH >>====================================//


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
    const drop = await Alice_token.tru
    //    console.log(drop);
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
            response.data.forEach(function (element) {
                console.log("element");
                //var option_type = element.symbol;
                var option_type = element.symbol.slice(-2);

                if (element.instrumenttype == 'FUTSTK') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');
                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));

                    var option_type = element.symbol.slice(-2);

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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()
                }
                else if (element.instrumenttype == 'FUTIDX') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');


                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    //console.log(element.token);

                    var option_type = element.symbol.slice(-2);


                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    var moth_str = element.expiry.slice(2, 5);

                    const Dat = new Date(element.expiry);
                    // console.log("Dat", Dat)

                    var moth_count = Dat.getMonth() + 1



                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');


                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);

                    var tradesymbol_m_w;

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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                } else if (element.instrumenttype == 'FUTCOM') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');





                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    //console.log(element.token);

                    var option_type = element.symbol.slice(-2);



                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    var moth_str = element.expiry.slice(2, 5);

                    const Dat = new Date(element.expiry);
                    // console.log("Dat", Dat)

                    var moth_count = Dat.getMonth() + 1



                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');


                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);

                    var tradesymbol_m_w;

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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                } else if (element.instrumenttype == 'OPTIDX') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');





                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    //console.log(element.token);

                    var option_type = element.symbol.slice(-2);



                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    var moth_str = element.expiry.slice(2, 5);

                    const Dat = new Date(element.expiry);
                    // console.log("Dat", Dat)

                    var moth_count = Dat.getMonth() + 1



                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');


                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);



                    var tradesymbol_m_w;

                    tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;


                    var moth_str = element.expiry.slice(2, 5);
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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                } else if (element.instrumenttype == 'OPTSTK') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');

                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    // console.log(element.token);

                    var option_type = element.symbol.slice(-2);


                    var moth_str = element.expiry.slice(2, 5);

                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    const Dat = new Date(element.expiry);


                    var moth_count = Dat.getMonth() + 1

                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');


                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);



                    var tradesymbol_m_w;

                    tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                    var moth_str = element.expiry.slice(2, 5);
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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                } else if (element.instrumenttype == 'OPTFUT') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');

                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    // console.log(element.token);

                    var option_type = element.symbol.slice(-2);


                    var moth_str = element.expiry.slice(2, 5);

                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    const Dat = new Date(element.expiry);


                    var moth_count = Dat.getMonth() + 1

                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');


                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);



                    var tradesymbol_m_w;

                    tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                    var moth_str = element.expiry.slice(2, 5);
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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                } else if (element.instrumenttype == 'OPTCOM') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');

                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    // console.log(element.token);

                    var option_type = element.symbol.slice(-2);


                    var moth_str = element.expiry.slice(2, 5);

                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    const Dat = new Date(element.expiry);


                    var moth_count = Dat.getMonth() + 1

                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');


                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);



                    var tradesymbol_m_w;

                    tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                    var moth_str = element.expiry.slice(2, 5);
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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                } else if (element.instrumenttype == 'OPTCUR') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');

                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    // console.log(element.token);

                    var option_type = element.symbol.slice(-2);


                    var moth_str = element.expiry.slice(2, 5);

                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    const Dat = new Date(element.expiry);

                    var moth_count = Dat.getMonth() + 1

                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');

                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);

                    var tradesymbol_m_w;

                    tradesymbol_m_w = element.name + year_end + moth_count + day_start + strike + option_type;

                    var moth_str = element.expiry.slice(2, 5);
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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()
                } else if (element.instrumenttype == 'FUTCUR') {

                    var expiry_s = element.expiry
                    var expiry_s = dateTime.create(expiry_s);
                    var expiry = expiry_s.format('dmY');

                    var strike_s = parseInt(element.strike);
                    var strike = parseInt(strike_s.toString().slice(0, -2));
                    // console.log(element.token);

                    var option_type = element.symbol.slice(-2);

                    var moth_str = element.expiry.slice(2, 5);

                    var day_month = element.expiry.slice(0, -4);

                    var year_end = element.expiry.slice(-2);

                    var day_start = element.expiry.slice(0, 2);

                    const Dat = new Date(element.expiry);

                    var moth_count = Dat.getMonth() + 1

                    var lastWednesd = moment().endOf('month').day('wednesday')
                    var dt = dateTime.create(lastWednesd);
                    var lastWednesday_date = dt.format('dmY');

                    var expiry_month_year = expiry.slice(2);

                    var expiry_date = expiry.slice(0, -6);

                    var tradesymbol_m_w;

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
                        tradesymbol_m_w: tradesymbol_m_w
                    };

                    const Alice_tokens = new Alice_token(user_data)
                    const userinfo = Alice_tokens.save()

                }




            });
        });

    return "test";

}




module.exports = { service_token_update, TokenSymbolUpdate, TruncateTable }