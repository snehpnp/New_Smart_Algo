
    // let val_type = "BUY";
                 
    // let _id = "65867b6ef8e2ccb25eae4295";
    
    // let show_strategy = "SHK_14366";

    const update_trade_off = {
      $set: {
        numberOfTrade_count_trade: 0,
      },
     
    };

    const filter_trade_off = {};
    let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);


    



    const pipeline = [
      {
        $match: {
          //tokensymbol:"67308",
          status: "2"
        }
      }
    ];
    const allStrategyResult = await UserMakeStrategy.aggregate(pipeline)

    allStrategyResult.forEach(async(val) => {
      const update = {
        $set: {
          status: "2",
        },
        $inc: {
          numberOfTrade_count_trade: 1, // Increment by 1, you can change this value based on your requirement
        },
      };

      const filter = { _id:val._id };
      let Res = await UserMakeStrategy.updateOne(filter, update);


      let Check_same_trade_type = "BUY"
      if (val.type == "BUY") {
        Check_same_trade_type = "SELL"
      }


      const Check_same_trade_data = await UserMakeStrategy.findOne({ show_strategy: val.show_strategy, type: Check_same_trade_type });

    //  const check_count_trade_data = await UserMakeStrategy.find({ show_strategy: show_strategy });

      const numberOfTrade_count_trade_count = await UserMakeStrategy.aggregate([
       {
         $match: {
          show_strategy: val.show_strategy,
          numberOfTrade: { $ne: "" }
         }
       },
       
       {
         $group: {
           _id: null,
           totalNumberOfTrade_count_trade: { $sum: '$numberOfTrade_count_trade' },
         
         }
       },
       {
         $project: {
           _id: 0,
           
           totalNumberOfTrade_count_trade: 1,
           anotherField: '$numberOfTrade',
           isTotalSmall: { $lt: ['$totalNumberOfTrade_count_trade',parseInt(val.numberOfTrade)] }
          
         }
       }
     ])
     console.log("numberOfTrade_count_trade_count -",numberOfTrade_count_trade_count) 
     console.log("numberOfTrade_count_trade_count -",numberOfTrade_count_trade_count.length) 
    if(numberOfTrade_count_trade_count.length > 0){
     if(numberOfTrade_count_trade_count[0].isTotalSmall == false){
     console.log("gggg")
     const update_trade_off = {
      $set: {
       // status: "5",
      },
     
    };

    const filter_trade_off = { show_strategy: val.show_strategy };
    let Res = await UserMakeStrategy.updateMany(filter_trade_off, update_trade_off);
     }
    }
     
    });
