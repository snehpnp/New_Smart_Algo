const db = require("../App/Models");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGO_URI; // Make sure this is set in your .env file
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbTest = client.db(process.env.DB_NAME);
const dashboard_data = db.dashboard_data;

async function DashboardView() {
  try {
    await client.connect();

    const views = await dbTest
      .listCollections({ name: "dashboard_data" })
      .toArray();

    // If the view exists, exit the function
    if (views.length > 0) {

      return;
    }

    const pipeline = [
      {
        $match: {
          $and: [{ Role: "USER" }],
        },
      },

      {
        $lookup: {
          from: "companies",
          let: { endDate: "$EndDate" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $cond: {
                    if: { $eq: ["$$endDate", null] }, // Check if endDate is null
                    then: true, // If null, return true (valid verify condition)
                    else: {
                      $gt: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$$endDate",
                          },
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$month_ago_date",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
          as: "companyData",
        },
      },
      {
        $unwind: "$companyData",
      },

      {
        $group: {
          _id: null,
          total_client: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_active_client: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    // { $eq: ["$license_type", "2"] },
                    { $gt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_expired_client: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_live_client: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "2"] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_active_live: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "2"] },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$EndDate",
                          },
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: new Date(),
                          },
                        },
                      ],
                    },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_expired_live: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "2"] },
                    { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_demo_client: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "1"] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_active_demo: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "1"] },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$EndDate",
                          },
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: new Date(),
                          },
                        },
                      ],
                    },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_expired_demo: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "1"] },
                    {
                      $lt: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$EndDate",
                          },
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: new Date(),
                          },
                        },
                      ],
                    },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_two_days: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "0"] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          total_active_two_days: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "0"] },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$EndDate",
                          },
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: new Date(),
                          },
                        },
                      ],
                    },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },

          total_expired_two_days: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "0"] },
                    { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                    { $eq: ["$Is_Active", "1"] },
                  ],
                },
                1,
                0,
              ],
            },
          },

          used_licence: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$Role", "USER"] },
                    { $eq: ["$license_type", "2"] },
                  ],
                },
                { $toInt: { $ifNull: ["$licence", "0"] } },
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: "companies",
          pipeline: [],
          as: "company_info",
        },
      },
      {
        $unwind: "$company_info",
      },
      {
        $lookup: {
          from: "count_licenses",
          let: { month_ago_date: "$company_info.month_ago_date" },
          pipeline: [],

          as: "licenseData",
        },
      },
      {
        $unwind: "$licenseData",
      },

      {
        $group: {
          _id: "$_id",

          total_used_licence: {
            $sum: {
              $toInt: "$licenseData.license",
            },
          },

          total_client: { $first: "$total_client" },
          total_active_client: { $first: "$total_active_client" },
          total_expired_client: { $first: "$total_expired_client" },
          total_live_client: { $first: "$total_live_client" },
          total_active_live: { $first: "$total_active_live" },
          total_expired_live: { $first: "$total_expired_live" },
          total_demo_client: { $first: "$total_demo_client" },
          total_active_demo: { $first: "$total_active_demo" },
          total_expired_demo: { $first: "$total_expired_demo" },
          total_two_days: { $first: "$total_two_days" },
          total_active_two_days: { $first: "$total_active_two_days" },
          total_expired_two_days: { $first: "$total_expired_two_days" },
          used_licence: { $first: "$used_licence" },
          total_admin_licence: { $first: "$company_info.licenses" },
        },
      },
      {
        $project: {
          total_client: 1,
          total_active_client: 1,
          total_expired_client: 1,
          total_live_client: 1,
          total_active_live: 1,
          total_expired_live: 1,
          total_demo_client: 1,
          total_active_demo: 1,
          total_expired_demo: 1,
          total_two_days: 1,
          total_active_two_days: 1,
          total_expired_two_days: 1,
          total_admin_license: 1,
          total_admin_licence: 1,
          total_used_licence: 1,
          used_licence: 1,
          licenses: {
            $toInt: {
              $subtract: [
                "$total_admin_licence",

                {
                  $subtract: ["$total_used_licence", "$used_licence"],
                },
              ],
            },
          },

          remaining_license: {
            $toInt: {
              $subtract: [
                {
                  $toInt: {
                    $subtract: [
                      "$total_admin_licence",

                      {
                        $subtract: ["$total_used_licence", "$used_licence"],
                      },
                    ],
                  },
                },
                "$used_licence",
              ],
            },
          },
        },
      },
    ];

    await dbTest.createCollection("dashboard_data", {
      viewOn: "users",
      pipeline,
    });
    
    return;
  } catch (error) {
    console.log("Error dashboard_data Create:", error);
  }
}

async function deleteDashboard() {
  try {
    // Drop the view if it exists
    await dashboard_data.drop();
 
  } catch (error) {
    console.log("Error dashboard_data Delete:", error);
  }
}

module.exports = { DashboardView, deleteDashboard };
