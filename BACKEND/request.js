module.exports = function (app) {


  const { createView, dashboard_view } = require('./View/Alice_blue')
  const { createViewAngel } = require('./View/Angel')
  const { createViewFivepaisa } = require('./View/fivepaisa')
  const { createViewZerodha } = require('./View/zerodha')

  const { dropExistingView, TradeHistroy } = require('./View/TradeHistory')
  const { TokenSymbolUpdate, TruncateTable, tokenFind } = require('./App/Cron/cron')
 

  // TEST API
  app.get('/tokenFind', async (req, res) => {
    try {


      // Your request parameters
      const symbol = 'NIFTY';
      const expiry = '26102023';
      const strike = '19300';
      const limit_set = 10;
      const data = await Alice_token.aggregate([
        {
          $match: {
            $and: [
              { symbol: symbol },
              { expiry: expiry },
              { segment: 'O' },
              {
                $or: [{ option_type: 'CE' }, { option_type: 'PE' }],
              },
              {
                $or: [
                  { strike: { $gte: (strike - 10) } }, // Get documents with strike 10 or more below
                  { strike: { $lte: (strike + 10) } }, // Get documents with strike 10 or more above
                ],
              },
            ],
          },
        },
        // Add the remaining stages as in your original code
        {
          $group: {
            _id: {
              strike: '$strike',
              symbol: '$symbol',
              expiry: '$expiry',
            },
            call_token: {
              $first: {
                $cond: [
                  { $eq: ['$option_type', 'CE'] },
                  '$instrument_token',
                  null,
                ],
              },
            },
            put_token: {
              $first: {
                $cond: [
                  { $eq: ['$option_type', 'PE'] },
                  '$instrument_token',
                  null,
                ],
              },
            },
          },
        },
        {
          $sort: {
            '_id.strike': 1,
          },
        },
        {
          $group: {
            _id: null,
            data: {
              $push: {
                symbol: '$_id.symbol',
                strike_price: '$_id.strike',
                call_token: '$call_token',
                put_token: '$put_token',
                expiry: '$_id.expiry',
              },
            },
            channellist: {
              $push: {
                $concat: [
                  'NFO|',
                  { $toString: '$call_token' },
                  { $toString: '$put_token' },
                ],
              },
            },
          },
        },
      ]);



      res.send({
        data: data,
        channellist: data[0].channellist.join('#')
      })
      // return findData


    } catch (err) {
      console.log(err);
    }
  })

  // TEST API
  app.get('/tradesymbol', async (req, res) => {
    TokenSymbolUpdate()
    res.send({ msg: "Done!!!" })
  })


  // TEST API
  app.get('/tradehistory/view', async (req, res) => {
    TradeHistroy(req, res)
    res.send({ msg: "View Create!!!" })
  })

  app.get('/tradesymbol1', async (req, res) => {
    TruncateTable()
    res.send({ msg: "Done!!!" })
  })


  // OPEN POSITION
  const { dropExistingView1, Open_Position1 } = require('./View/Open_position')

  app.get('/run/test', async (req, res) => {
    Open_Position1()
  })

  app.get('/run/test1', async (req, res) => {
    dropExistingView1()
  })


  // TEST API
  app.get('/get', async (req, res) => {
    createViewZerodha()
    // createViewFivepaisa()
    // createViewAngel()
    //createView()
    res.send({ msg: "Done!!!" })
  })


  app.get('/view-delete', async (req, res) => {
    dropExistingView()
    res.send({ msg: "Done!!!" })
  })


  app.get('/dashboard-view', async (req, res) => {
    dashboard_view()
    res.send({ msg: "Done!!!" })
  })
}