const Strategieclient = [
    {
      _id: new ObjectId("6505468ad2562405524f3e7d"),
      user_id: new ObjectId("65054689d2562405524f3e7a"),
      strategy_id: new ObjectId("64f5b538ff442f7b445917dd"),
      createdAt: "2023-09-16T06:09:14.158Z",
      updatedAt: "2023-09-16T06:09:14.158Z",
      __v: 0,
    },
    {
      _id: new ObjectId("650960ad9445aa7f29d7effa"),
      user_id: new ObjectId("65054689d2562405524f3e7a"),
      strategy_id: new ObjectId("64fe98e9e4f022405674fb78"),
      createdAt: "2023-09-16T06:09:14.158Z",
      updatedAt: "2023-09-16T06:09:14.158Z",
      __v: 0,
    },
  ];
  
  const Strategies = [
    { id: "64f5b538ff442f7b445917dd" },
    { id: "64fe98e9e4f022405674fb78" },
    { id: "newStrategyId1" }, // New strategy ID
    // { id: "strategyIdToRemove" }, // Uncomment this line to simulate a removed strategy
  ];
  
  // Extract the strategy_id values from Strategieclient into a Set for faster lookup
  const existingStrategieclientIds = new Set(
    Strategieclient.map((item) => item.strategy_id.toString())
  );
  
  // Add missing strategies from Strategies to Strategieclient
  Strategies.forEach((strategy) => {
    if (!existingStrategieclientIds.has(strategy.id)) {
      // Add the missing strategy to Strategieclient
      Strategieclient.push({
        strategy_id: strategy.id,
        // Add other properties as needed
      });
    }
  });
  
  // Remove extra strategies from Strategieclient
  Strategieclient.forEach((strategy, index) => {
    if (!Strategies.some((s) => s.id === strategy.strategy_id.toString())) {
      // Remove the extra strategy from Strategieclient
      Strategieclient.splice(index, 1);
    }
  });
  
  console.log("Updated Strategieclient:", Strategieclient);
  