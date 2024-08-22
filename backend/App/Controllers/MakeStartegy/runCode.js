
async function run() {
  try {
    // Define the function to be executed
    const executeFunction = async () => {
   
      const data = await dbTest.collection('strategyViewNames').find({}).toArray();
      fetchDataFromViews(data);
    };

    // Array to keep track of ongoing operations
    let ongoingOperations = [];

    while (true) {
      // Delay for 1000 milliseconds (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Schedule the execution of the function
      const operation = executeFunction().catch(console.error);

      // Store the ongoing operation
      ongoingOperations.push(operation);

      // Clean up finished operations to prevent memory leaks
      ongoingOperations = ongoingOperations.filter(op => op.isPending());
    }

  } catch (error) {
    console.log(error);
  }
}

async function run() {
  try {
    // Define the function to be executed
    const executeFunction = async () => {
     
      const data = await dbTest.collection('strategyViewNames').find({}).toArray();
      fetchDataFromViews(data);
    };

    // Array to keep track of ongoing operations
    let ongoingOperations = [];

    while (true) {
      // Delay for 1000 milliseconds (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Schedule the execution of the function
      const operation = executeFunction().catch(console.error);

      // Store the ongoing operation
      ongoingOperations.push(operation);

      // Clean up finished operations to prevent memory leaks
      ongoingOperations = ongoingOperations.filter(p => !p.isSettled);

      // Mark completed operations
      Promise.allSettled(ongoingOperations).then(results => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled" || result.status === "rejected") {
            ongoingOperations[index].isSettled = true;
          }
        });
      });
    }

  } catch (error) {
    console.error(error);
  }
}

run().catch(console.error);

async function fetchDataFromViews(viewNames) {

  try {
    if (viewNames.length > 0) {
      for (let valView of viewNames) {
        const data = await dbTest.collection(valView.viewName).find({
          isCondition: true,
          timeFrameViewData: { $ne: null, $ne: [] }
        }).toArray();

        if (data.length > 0) {
          let val = data[0];
          let entry_type = val.type === 'BUY' ? 'SE' : 'LE';

          let condition_check_previous_trade = {
            strategy: val.strategy_name,
            symbol: val.symbol_name,
            entry_type: entry_type,
            segment: val.segment,
            client_persnal_key: val.panelKey,
            MakeStartegyName: val.show_strategy,
            TradeType: 'MAKE_STRATEGY',
          };

          if (['O', 'FO', 'MO', 'CO'].includes(val.segment.toUpperCase())) {
            condition_check_previous_trade = {
              ...condition_check_previous_trade,
              strike: val.strike_price,
              option_type: val.option_type === 'PE' ? 'PUT' : 'CALL',
              expiry: val.expiry,
            };
          } else if (['F', 'MF', 'CF'].includes(val.segment.toUpperCase())) {
            condition_check_previous_trade.expiry = val.expiry;
          }

          var checkPreviousTrade = await get_open_position_view.findOne(condition_check_previous_trade);
       
          const collection_last_price = dbTest.collection(val.tokensymbol);
          const last_price = await collection_last_price.aggregate([{ $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
          let price_lp = last_price[0].lp;

          if (checkPreviousTrade != null) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            let type = checkPreviousTrade.entry_type.toUpperCase() === 'SE' ? 'SX' : 'LX';
            let price = type === 'SE' ? checkPreviousTrade.stockInfo_sp1 : checkPreviousTrade.stockInfo_bp1;
            let strike = checkPreviousTrade.strike_price === 'NaN' ? '100' : checkPreviousTrade.strike;
            let option_type = checkPreviousTrade.option_type.toUpperCase() === 'PUT' ? 'PUT' : 'CALL';
            let Quntity = checkPreviousTrade.entry_qty_percent;

            let req = `DTime:${currentTimestamp}|Symbol:${checkPreviousTrade.symbol}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${checkPreviousTrade.segment}|Strike:${strike}|OType:${option_type}|Expiry:${checkPreviousTrade.expiry}|Strategy:${checkPreviousTrade.strategy}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:${checkPreviousTrade.TradeType}|MakeStartegyName:${val.show_strategy}|Demo:demo`;

            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: `${process.env.BROKER_URL}`,
              headers: {
                'Content-Type': 'text/plain'
              },
              data: req
            };

            await axios.request(config)
              .then((response) => {
    
              })
              .catch((error) => {
              return;
              });
          }

          const update = {
            $set: { status: '2' },
            $inc: { numberOfTrade_count_trade: 1 }
          };
          const filter = { _id: val._id };
          await UserMakeStrategy.updateOne(filter, update);

          const Check_same_trade_type = val.type === 'BUY' ? 'SELL' : 'BUY';
          const Check_same_trade_data = await UserMakeStrategy.findOne({ show_strategy: val.show_strategy, type: Check_same_trade_type });

          if (Check_same_trade_data) {
            await UserMakeStrategy.updateOne({ name: Check_same_trade_data.name }, {
              $set: { status: "1", tsl: "2" }
            });
          }

          const numberOfTrade_count_trade_count = await UserMakeStrategy.aggregate([
            { $match: { show_strategy: val.show_strategy, numberOfTrade: { $ne: '' } } },
            { $group: { _id: null, totalNumberOfTrade_count_trade: { $sum: '$numberOfTrade_count_trade' } } },
            { $project: { _id: 0, totalNumberOfTrade_count_trade: 1, anotherField: '$numberOfTrade', isTotalSmall: { $lt: ['$totalNumberOfTrade_count_trade', parseInt(val.numberOfTrade)] } } }
          ]);

          if (numberOfTrade_count_trade_count.length > 0 && numberOfTrade_count_trade_count[0].isTotalSmall === false) {
            const update_trade_off = { $set: { status: '2' } };
            const filter_trade_off = { show_strategy: val.show_strategy };
            await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
          }

          const currentTimestamp = Math.floor(Date.now() / 1000);
          let type = val.type.toUpperCase() === 'SELL' ? 'SE' : 'LE';
          let strike = val.strike_price === 'NaN' ? '100' : val.strike_price;
          let option_type = val.option_type.toUpperCase() === 'PE' ? 'PUT' : 'CALL';
          let Quntity = '100';
          const dateObject = new Date(val.exitTime);
          const hours = ('0' + dateObject.getUTCHours()).slice(-2);
          const minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
          const ExitTime = `${hours}-${minutes}`;

          let req = `DTime:${currentTimestamp}|Symbol:${val.symbol_name}|TType:${type}|Tr_Price:131|Price:${price_lp}|Sq_Value:0.00|Sl_Value:0.00|TSL:0.00|Segment:${val.segment}|Strike:${strike}|OType:${option_type}|Expiry:${val.expiry}|Strategy:${val.strategy_name}|Quntity:${Quntity}|Key:${val.panelKey}|TradeType:MAKE_STRATEGY|Target:${val.target}|StopLoss:${val.stoploss}|ExitTime:${ExitTime}|MakeStartegyName:${val.show_strategy}|Demo:demo`;

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.BROKER_URL}`,
            headers: {
              'Content-Type': 'text/plain'
            },
            data: req
          };

          await axios.request(config)
            .then((response) => {
            })
            .catch((error) => {
         return;
            });
        }
      }
    } else {
  
    }

  } catch (error) {
    console.log('Error fetching data:', error);
  }
}
