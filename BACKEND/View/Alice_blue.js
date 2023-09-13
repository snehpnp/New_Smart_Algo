db.createView("viewName", "userCollection", [
    {
      $match: {
        "TradingStatus": "on", // TradingStatus "on" hona chahiye
      }
    },
    {
      $lookup: {
        from: "otherCollection", // Doosri collection ka naam yahan specify karein
        localField: "_id", // User collection ke field jisse join karna hai
        foreignField: "userId", // Doosri collection ke field jisse join karna hai
        as: "otherData" // As naam, jismein join ki gayi data store hoga
      }
    },
    {
      $match: {
        "otherData.ActiveStatus": "1" // Doosri collection ke ActiveStatus "1" hona chahiye
      }
    },
    {
      $lookup: {
        from: "thirdCollection", // Teesri collection ka naam yahan specify karein
        localField: "_id", // User collection ke field jisse join karna hai
        foreignField: "userId", // Teesri collection ke field jisse join karna hai
        as: "thirdData" // As naam, jismein join ki gayi data store hoga
      }
    },
    {
      $project: {
        // Projection and transformation, agar koi specific fields chahiye
        "FullName": 1,
        "TradingStatus": 1,
        "otherData": 1, // Doosri collection se aayi data
        "thirdData": 1 // Teesri collection se aayi data
      }
    },
    // Other aggregation stages
  ])
  