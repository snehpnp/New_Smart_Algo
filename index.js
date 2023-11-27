db.createView('open_position', 'mainsignals', [
    {
      $addFields: {
        target: {
          $add: [
            { $toDouble: '$entry_price' },
            { $ifNull: [{ $toDouble: '$target' }, 0] },
          ],
        },
        stop_loss: {
          $subtract: [
            { $toDouble: '$entry_price' },
            { $ifNull: [{ $toDouble: '$stop_loss' }, 0] },
          ],
        },
        // Add exit_time with ":00" added at the end
        exit_time: {
          $concat: ['$exit_time', ':00'],
        },
      },
    },
    {
      $project: {
        _id: 1, // Include the _id field if needed
        symbol:1,
        entry_type:1,
        entry_price:1,
        entry_qty_percent:1,
        exit_qty_percent:1,
        exchange:1,
        strategy:1,
        segment:1,
        trade_symbol:1,
        client_persnal_key:1,
        TradeType:1,
        token:1,
        lot_size:1,
        complete_trade:1,
        option_type:1,
        dt_date:1,
        strike:1,
        expiry:1,
        target: 1,
        stop_loss: 1,
        exit_time: 1,
        // Include other fields you want to keep in the view
      },
    },
    // Additional pipeline stages if needed
  ]);
  