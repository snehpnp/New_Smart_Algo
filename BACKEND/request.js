module.exports = function (app) {

  const db = require('./App/Models');
  const Alice_token = db.Alice_token;


  const { DashboardView } = require('./View/DashboardData')




  app.get('/dashboard-view', async (req, res) => {
    DashboardView()
    res.send({ msg: "Done!!!" })
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

}


