db.dashboard_data_subadmin.drop();
db.createView('dashboard_data_subadmin', 'users', [
    {
        $match: {
            Role: "SUBADMIN",
            Is_Active: "1" // Optionally, you may add more conditions here
        }
    },
    {
        $addFields: {
            converted_id: { $toString: "$_id" } // Convert _id to string
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "converted_id",
            foreignField: "parent_id",
            as: "child_users"
        }
    },
    {
        $project: {
            _id: "$converted_id", // Assign the converted _id to _id
            licence: {
                $cond: {
                    if: { $isArray: "$licence" },
                    then: "$licence",
                    else: "$licence"
                }
            },
            total_client: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] }
                            ]
                        }
                    }
                }
            },
            total_active_client: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $gte: ["$$childUser.EndDate", new Date()] },
                                { $ne: ["$$childUser.EndDate", null] }

                            ]
                        }
                    }
                }
            },
            total_expired_client: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $lt: ["$$childUser.EndDate", new Date()] },
                                { $ne: ["$$childUser.EndDate", null] }

                            ]
                        }
                    }
                }
            },

            total_live_client: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "2"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                            ]
                        }
                    }
                }
            },
            total_active_live: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "2"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                                {
                                    $gte: [
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: "$$childUser.EndDate"
                                            }
                                        },
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: new Date()
                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    }
                }
            },

            total_expired_live: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "2"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                                {
                                    $lt: [
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: "$$childUser.EndDate"
                                            }
                                        },
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: new Date()
                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    }
                }
            },
            total_demo_client: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "1"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                            ]
                        }
                    }
                }
            },

            total_active_demo: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "1"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                                {
                                    $gte: [
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: "$$childUser.EndDate"
                                            }
                                        },
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: new Date()
                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    }
                }
            },

            total_expired_demo: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "1"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                                {
                                    $lt: [
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: "$$childUser.EndDate"
                                            }
                                        },
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: new Date()
                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    }
                }
            },

            total_two_days: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "0"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                            ]
                        }
                    }
                }
            },

            total_active_two_days: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "0"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                                {
                                    $gte: [
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: "$$childUser.EndDate"
                                            }
                                        },
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: new Date()
                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    }
                }
            },

            total_expired_two_days: {
                $size: {
                    $filter: {
                        input: "$child_users",
                        as: "childUser",
                        cond: {
                            $and: [
                                { $eq: ["$$childUser.Role", "USER"] },
                                { $eq: ["$$childUser.license_type", "0"] },
                                { $eq: ["$$childUser.Is_Active", "1"] },

                                {
                                    $lt: [
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: "$$childUser.EndDate"
                                            }
                                        },
                                        {
                                            $dateToString: {
                                                format: "%Y-%m-%d",
                                                date: new Date()
                                            }
                                        }
                                    ]
                                },

                            ]
                        }
                    }
                }
            },


            used_licence: {
                $sum: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$child_users",
                                as: "childUser",
                                cond: {
                                    $and: [
                                        { $eq: ["$$childUser.Role", "USER"] },
                                        { $eq: ["$$childUser.license_type", "2"] }
                                    ]
                                }
                            }
                        },
                        as: "user",
                        in: { $toInt: { $ifNull: ["$$user.licence", "0"] } }
                    }
                }
            }


        }
    },
    {
        $project: {
            _id: 1,
            total_client: "$total_client",
            total_active_client: "$total_active_client",
            total_expired_client: "$total_expired_client",
            total_live_client: "$total_live_client",
            total_active_live: "$total_active_live",
            total_expired_live: "$total_expired_live",
            total_demo_client: "$total_demo_client",
            total_active_demo: "$total_active_demo",
            total_expired_demo: "$total_expired_demo",
            total_two_days: "$total_two_days",
            total_active_two_days: "$total_active_two_days",
            total_expired_two_days: "$total_expired_two_days",
            licence: { $ifNull: ["$licence", 0] },
            used_licence: "$used_licence",
            remaining_license: {
                $subtract: [
                    { $toDouble: { $ifNull: ["$licence", "0"] } },
                    { $toDouble: "$used_licence" }
                ]
            }
        }
    }
    
]);
