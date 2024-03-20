module.exports = function (app) {

  const db = require('./App/Models');
  const Alice_token = db.Alice_token;

 
const User = db.user;
const user_logs = db.user_logs;
const live_price = db.live_price;
const UserMakeStrategy = db.UserMakeStrategy;
const Get_Option_Chain_modal = db.option_chain_symbols;


  const { DashboardView } = require('./View/DashboardData')
  const { createView ,dropOpenPosition ,open_position_excute} = require('./View/Open_position')
  const { createViewUpstox } = require('./View/Upstox')
  const { createViewDhan } = require('./View/dhan')
  const { MainSignalsRemainToken } = require('./App/Cron/cron')

 
 app.get("/test",(req,res)=>{
  MainSignalsRemainToken()
  res.send("DONEE")
 })


  app.get('/dropOpenPosition', async (req, res) => {
    dropOpenPosition()
    res.send({ msg: "Delete Done!!!" })
  })

  
  app.get('/createView', async (req, res) => {
    createView()
    open_position_excute()
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



  app.get("/optionStockData",async(req,res)=>{
   
   
    try {



      ///const symbols = ["HDFCBANK","ACC"];

      const pipeline_stock_symbol = [
        {
          $match: { token : "1" }
       },
      ]

      const symbols_array =  await Get_Option_Chain_modal.aggregate(pipeline_stock_symbol);

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
      
      console.log("concatenatedArray - ",concatenatedArray)

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


