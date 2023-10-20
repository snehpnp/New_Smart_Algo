db.createView("dashboard_data", "users", [

    {
        $group: {
            _id: null,
            total_client: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                               
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            admin_client: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$parent_role", "ADMIN"] },
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            subadmin_client: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$parent_role", "SUBADMIN"] },
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_Subadmin: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "SUBADMIN"] }
                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_live: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "2"] },
                                { $eq: ["$Is_Active", "1"] }


                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_active_live: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "2"] },
                                { $gt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_expired_live: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "2"] },
                                { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_demo: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "1"] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_active_demo: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "1"] },
                                { $gt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_expired_demo: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "1"] },
                                { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_two_days: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "0"] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_active_two_days: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "0"] },
                                { $gt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            total_expired_two_days: {
                $sum: {
                    $cond: [
                        {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "0"] },
                                { $lt: [{ $subtract: ["$EndDate", new Date()] }, 0] },
                                { $eq: ["$Is_Active", "1"] }

                            ]
                        },
                        1,
                        0
                    ]
                }
            },
            // used_licence: { $sum: { $toInt: "$licence" } }

            used_licence: {
                $sum: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$Role", "USER"] },
                                { $eq: ["$license_type", "2"] }

                            ]
                        },
                        then: { $toInt: "$licence" },
                        else: 0
                    }
                }
            }
        }
    },
    {
        $lookup: {
            from: "companies",
            pipeline: [],
            as: "company_info"
        }
    },
    {
        $unwind: "$company_info"
    },
    {
        $project: {
            total_client: 1,
            admin_client: 1,
            subadmin_client: 1,
            total_Subadmin: 1,
            licenses: "$company_info.licenses",
            total_live: 1,
            total_active_live: 1,
            total_expired_live: 1,
            total_demo: 1,
            total_active_demo: 1,
            total_expired_demo: 1,
            total_two_days: 1,
            total_active_two_days: 1,
            total_expired_two_days: 1,
            // <<<<<<< HEAD
            // used_licence: { $toInt: "$used_licence" }, // Convert used_licence to integer
            used_licence: 1,
            remaining_license: {
                $subtract: [
                    { $toInt: "$company_info.licenses" }, // Convert licenses to integer
                    { $toInt: "$used_licence" } // Convert used_licence to integer
                ]
            }
            // =======
            //  used_licence: { $toInt: "$used_licence" }, // Convert used_licence to integer

            // remaining_license: {
            //     $subtract: [
            //         { $toInt: "$company_info.licenses" }, // Convert licenses to integer
            //         { $toInt: "$used_licence" } // Convert used_licence to integer
            //     ]
            // }
            // >>>>>>> 68964591b01effa2222d61b11da9f179596795a7
        }
    }

]);
