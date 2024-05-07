module.exports = function (app) {

    const db = require('./App/Models');
    const Alice_token = db.Alice_token;
    var dateTime = require('node-datetime');
    var moment = require('moment');


    const User = db.user;
    const services = db.services;
    const categorie = db.categorie;
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
   
      //Add stoch Api.....
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
    //const matchingElements = categoryResult.filter(item => item.segment === "FO");

    // console.log('Matching elements:', matchingElements[0]._id);
    // res.send("done");
    // return
    var axios = require('axios');
    var config = {
      method: 'get',
      url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
    };

    axios(config)
      .then(function (response) {

        // res.send(response.data);
        // console.log(response.data);
        // Using a loop to extract 'name' and 'instrumenttype'


        var unique_key = []
        let count = 0
        response.data.forEach((item) => {

          //   function findRepeatedElements(array) {
          //     const frequencyMap = {};
          //     const repeatedElements = [];

          //     array.forEach(element => {
          //       if (frequencyMap[element.instrumenttype]) {
          //         frequencyMap[element.instrumenttype]++;
          //         if (frequencyMap[element.instrumenttype] === 2) {
          //           repeatedElements.push(element.instrumenttype);
          //         }
          //       } else {
          //         frequencyMap[element.instrumenttype] = 1;
          //       }
          //     });

          //     return repeatedElements;
          //   }

          //   const inputArray = response.data;
          //   const repeatedElements = findRepeatedElements(inputArray);

          //   console.log('Repeated elements:', repeatedElements);
          //   res.send(repeatedElements)
          // return


          //  if(item.instrumenttype == 'FUTSTK' || item.instrumenttype == 'FUTIDX' || item.instrumenttype == 'FUTCUR'||item.instrumenttype == 'FUTCOM'||item.instrumenttype == 'OPTSTK'||item.instrumenttype == 'OPTIDX'||item.instrumenttype == 'OPTCUR'||item.instrumenttype == 'OPTFUT'){ 


          //  if (item.instrumenttype == 'OPTCUR' && item.exch_seg=="CDS") {
          //     count++
          //     console.log('item - CO ' + count + ' ', item)
          //     const matchingElements = categoryResult.filter(item => item.segment === "CO");
          //     const category_id = matchingElements[0]._id


          //     services.create({
          //       name: item.name,
          //       instrument_token: item.token,
          //       zebu_token: item.symbol,
          //       kotak_token: "",
          //       instrumenttype: item.instrumenttype,
          //       exch_seg: item.exch_seg,
          //       lotsize: item.lotsize,
          //       categorie_id: category_id,
          //       unique_column: item.name + '_' + category_id
          //     })
          //       .then((createdServices) => {
          //         console.log('User created and saved:', createdServices._id)
          //       })
          //       .catch((err) => {
          //         try {
          //           console.error('Error creating and saving user:', err);
          //         } catch (e) {
          //           console.log("duplicate key")
          //         }

          //       });


          //   }



          //   if (!unique_key.includes(`${item.name}-${item.instrumenttype}`)) {
          //  unique_key.push(`${item.name}-${item.instrumenttype}`);


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
              .then((createdServices) => {
                console.log('User created and saved:', createdServices._id)
              })
              .catch((err) => {
                try {
                  console.error('Error creating and saving user:', err);
                } catch (e) {
                  console.log("duplicate key")
                }

              });


          }




          // if (item.instrumenttype == 'FUTSTK' || item.instrumenttype == 'FUTIDX') {
          //   count++
          //   console.log('item - F ' + count + ' ', item)
          //   const matchingElements = categoryResult.filter(item => item.segment === "F");
          //   const category_id = matchingElements[0]._id



          //   services.create({
          //     name: item.name,
          //     instrument_token: item.token,
          //     zebu_token: item.symbol,
          //     kotak_token: "",
          //     instrumenttype: item.instrumenttype,
          //     exch_seg: item.exch_seg,
          //     lotsize: item.lotsize,
          //     categorie_id: category_id,
          //     unique_column: item.name + '_' + category_id
          //   })
          //     .then((createdServices) => {
          //       console.log('User created and saved:', createdServices._id)
          //     })
          //     .catch((err) => {
          //       try {
          //         console.error('Error creating and saving user:', err);
          //       } catch (e) {
          //         console.log("duplicate key")
          //       }

          //     });




          // }



          // if (item.instrumenttype == 'OPTSTK' || item.instrumenttype == 'OPTIDX') {
          //   count++
          //   console.log('item - O ' + count + ' ', item)
          //   const matchingElements = categoryResult.filter(item => item.segment === "O");
          //   const category_id = matchingElements[0]._id

          //   services.create({
          //     name: item.name,
          //     instrument_token: item.token,
          //     zebu_token: item.symbol,
          //     kotak_token: "",
          //     instrumenttype: item.instrumenttype,
          //     exch_seg: item.exch_seg,
          //     lotsize: item.lotsize,
          //     categorie_id: category_id,
          //     unique_column: item.name + '_' + category_id
          //   })
          //     .then((createdServices) => {
          //       console.log('User created and saved:', createdServices._id)
          //     })
          //     .catch((err) => {
          //       try {
          //         console.error('Error creating and saving user:', err);
          //       } catch (e) {
          //         console.log("duplicate key")
          //       }

          //     });




          // }


          // if (item.instrumenttype == 'OPTFUT') {
          //   count++
          //   console.log('item - MO ' + count + ' ', item)
          //   const matchingElements = categoryResult.filter(item => item.segment === "MO");
          //   const category_id = matchingElements[0]._id

          //   services.create({
          //     name: item.name,
          //     instrument_token: item.token,
          //     zebu_token: item.symbol,
          //     kotak_token: "",
          //     instrumenttype: item.instrumenttype,
          //     exch_seg: item.exch_seg,
          //     lotsize: item.lotsize,
          //     categorie_id: category_id,
          //     unique_column: item.name + '_' + category_id
          //   })
          //     .then((createdServices) => {
          //       console.log('User created and saved:', createdServices._id)
          //     })
          //     .catch((err) => {
          //       try {
          //         console.error('Error creating and saving user:', err);
          //       } catch (e) {
          //         console.log("duplicate key")
          //       }

          //     });




          // }


          // if (item.instrumenttype == 'FUTCOM') {
          //   count++
          //   console.log('item - MF ' + count + ' ', item)
          //   const matchingElements = categoryResult.filter(item => item.segment === "MF");
          //   const category_id = matchingElements[0]._id

          //   services.create({
          //     name: item.name,
          //     instrument_token: item.token,
          //     zebu_token: item.symbol,
          //     kotak_token: "",
          //     instrumenttype: item.instrumenttype,
          //     exch_seg: item.exch_seg,
          //     lotsize: item.lotsize,
          //     categorie_id: category_id,
          //     unique_column: item.name + '_' + category_id
          //   })
          //     .then((createdServices) => {
          //       console.log('User created and saved:', createdServices._id)
          //     })
          //     .catch((err) => {
          //       try {
          //         console.error('Error creating and saving user:', err);
          //       } catch (e) {
          //         console.log("duplicate key")
          //       }

          //     });



          // }

          // if (item.instrumenttype == 'FUTCUR') {
          //   count++
          //   console.log('item - CF ' + count + ' ', item)
          //   const matchingElements = categoryResult.filter(item => item.segment === "CF");
          //   const category_id = matchingElements[0]._id


          //   services.create({
          //     name: item.name,
          //     instrument_token: item.token,
          //     zebu_token: item.symbol,
          //     kotak_token: "",
          //     instrumenttype: item.instrumenttype,
          //     exch_seg: item.exch_seg,
          //     lotsize: item.lotsize,
          //     categorie_id: category_id,
          //     unique_column: item.name + '_' + category_id
          //   })
          //     .then((createdServices) => {
          //       console.log('User created and saved:', createdServices._id)
          //     })
          //     .catch((err) => {
          //       try {
          //         console.error('Error creating and saving user:', err);
          //       } catch (e) {
          //         console.log("duplicate key")
          //       }

          //     });


          // }


          //  if (item.instrumenttype == 'OPTCUR' && item.exch_seg=="CDS") {
          //   count++
          //   console.log('item - CO ' + count + ' ', item)
          //   const matchingElements = categoryResult.filter(item => item.segment === "CO");
          //   const category_id = matchingElements[0]._id


          //   services.create({
          //     name: item.name,
          //     instrument_token: item.token,
          //     zebu_token: item.symbol,
          //     kotak_token: "",
          //     instrumenttype: item.instrumenttype,
          //     exch_seg: item.exch_seg,
          //     lotsize: item.lotsize,
          //     categorie_id: category_id,
          //     unique_column: item.name + '_' + category_id
          //   })
          //     .then((createdServices) => {
          //       console.log('User created and saved:', createdServices._id)
          //     })
          //     .catch((err) => {
          //       try {
          //         console.error('Error creating and saving user:', err);
          //       } catch (e) {
          //         console.log("duplicate key")
          //       }

          //     });


          // }










          // if(item.instrumenttype == 'AMXIDX'|| item.instrumenttype == 'OPTIRC' || item.instrumenttype == 'UNDIRC' || item.instrumenttype == 'FUTIRC' || item.instrumenttype == 'UNDCUR' || item.instrumenttype == 'INDEX' || item.instrumenttype == 'COMDTY' || item.instrumenttype == 'AUCSO'){
          //       count++
          //       console.log('item - OTHER CONTENT '+count+' ',item)
          //       // const matchingElements = categoryResult.filter(item => item.segment === "C");
          //       // const category_id = matchingElements[0]._id
          //       services.create({
          //         name:item.name,
          //         instrument_token:item.token,
          //         zebu_token:item.symbol,
          //         kotak_token:"",
          //         instrumenttype:item.instrumenttype,
          //         exch_seg:item.exch_seg,
          //         lotsize:item.lotsize,
          //         categorie_id : "",
          //         unique_column : item.name +'_'+'c9dbdc14a9fefd971c979'
          //       })
          //       .then((createdServices) => {
          //         console.log('User created and saved:', createdServices._id)
          //       })
          //       .catch((err) => {
          //         try{
          //         console.error('Error creating and saving user:', err);
          //         }catch(e){
          //          console.log("duplicate key")
          //         }

          //       });


          //       }

          // }
          //   }

        });






      });


    //////// super trend logicc////////

    // const calculateATR = (data, period) => {
    //   // Calculate Average True Range (ATR)
    //   let atr = [];

    //   for (let i = 1; i < data.length; i++) {
    //     const high = data[i].high;
    //     const low = data[i].low;
    //     const prevClose = data[i - 1].close;

    //     const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    //     atr.push(tr);
    //   }

    //   // Calculate the average ATR
    //   const atrSum = atr.slice(0, period).reduce((acc, val) => acc + val, 0);
    //   return atrSum / period;
    // };

    // const calculateSuperTrend = (data, atrPeriod, multiplier) => {
    //   let superTrend = [];

    //   for (let i = atrPeriod; i < data.length; i++) {
    //     const prevSuperTrend = superTrend[i - 1] || 0;
    //     const atr = calculateATR(data.slice(i - atrPeriod, i), atrPeriod);

    //     const upperBand = (data[i].high + data[i].low - multiplier * atr);
    //     const lowerBand = (data[i].high + data[i].low - multiplier * atr);

    //     const close = data[i].close;

    //     if (close <= upperBand) {
    //       superTrend.push(upperBand);
    //     } else if (close >= lowerBand) {
    //       superTrend.push(lowerBand);
    //     } else {
    //       superTrend.push(prevSuperTrend);
    //     }
    //   }

    //   return superTrend;
    // };

    // // Sample data (replace with your own dataset)
    // const historicalData = [
    //   { high: 150, low: 140, close: 145 },
    //   { high: 155, low: 145, close: 150 },
    //   // Add more data points
    // ];

    // const atrPeriod = 14; // ATR period
    // const multiplier = 3; // Multiplier value

    // const superTrendValues = calculateSuperTrend(historicalData, atrPeriod, multiplier);

    // // Calculate the average Super Trend
    // const averageSuperTrend = superTrendValues.reduce((acc, val) => acc + val, 0) / superTrendValues.length;

    // console.log('Super Trend Values:', superTrendValues);
    // console.log('Average Super Trend:', averageSuperTrend);


    ////////// END SUper Trend logic///


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


