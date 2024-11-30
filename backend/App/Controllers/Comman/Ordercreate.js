"use strict";
const bcrypt = require("bcrypt");
const db = require("../../Models");
const User_model = db.user;
const strategy_Order_modal = db.strategy_Order
const company_information = db.company_information
const strategy_model = db.Strategies;
const researcher_strategy = db.researcher_strategy;

const User_strategy_Order = db.User_strategy_Order
const SubAdminCompanyInfo = db.SubAdminCompanyInfo
const strategy_client = db.strategy_client
const strategy_transaction = db.strategy_transaction;
const Activity_logs = db.Activity_logs;
const Stg_Collaborators = db.Stg_Collaborators;





const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const user_logs = db.user_logs;

const Razorpay = require('razorpay');


var dateTime = require("node-datetime");
var dt = dateTime.create();

// Product CLASS
class Ordercreate {

    // CREATE ORDER
    async CreateOder(req, res) {


        const companyInformation = await company_information.aggregate([
            {
                $project: {
                    razor_payment_key: 1,
                    panel_name: 1,
                    razor_payment_secretKey: 1,
                    _id: 0
                }
            },
            {
                $limit: 1
            }
        ]);

        let razorpay = new Razorpay({
            key_id: companyInformation[0].razor_payment_key,
            key_secret: companyInformation[0].razor_payment_secretKey,
        });


        const { strategy_name, user_id, admin_id, strategy_id, type, amount, currency, receipt } = req.body;

        const options = {
            amount: amount, // in paise
            currency: currency,
            receipt: receipt,
        };

        try {
            const response = await razorpay.orders.create(options);

            var strategy_Order = new strategy_Order_modal({
                strategy_name: strategy_name,
                plan_name: type,
                user_id: user_id,
                admin_id: admin_id,
                strategy_id: strategy_id,
                order_id: response.id,
                User_data: "",
                amount: parseInt(amount) / 100, // in paise
                receipt: receipt,
                razorpay_order_id: "",
                razorpay_payment_id: "",

            })

            var order_data = await strategy_Order.save()
            var data1 = {

                key: companyInformation[0].razor_payment_key,
                name: companyInformation[0].panel_name,
            }

            res.send({ status: true, data: order_data, data1: data1, msg: "Msg Done" });

        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).send({ status: false, data: error, msg: "Request not good" });
        }

    }


    async UpdateOrder(req, res) {
        try {
            const { strategy_id, user_id, type, id } = req.body;

            // Find the strategy by ID
            const strategy = await researcher_strategy.findOne({ _id: strategy_id });

            // Get the current date
            const currentDate = new Date();

            // Add one month to the current date
            const nextMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

            // Format the date as needed (e.g., YYYY-MM-DD)
            const formattedDate = nextMonthDate.toISOString().split('T')[0];
            var Amount = req.body.Amount

            // Update Collaborators collection
            // Find if a collaborator record already exists

            if(type !== "monthlyPlan"){

                const collaboratorFilter = { Collaborators_id: user_id, researcher_id: strategy.maker_id };
                const existingCollaborator = await Stg_Collaborators.findOne(collaboratorFilter);

                // Calculate the new total amount
                let newTotalAmount = Amount;
                if (existingCollaborator) {
                    newTotalAmount += existingCollaborator.total_amount;
                }

                // Update or insert the collaborator record
                const collaboratorUpdate = {
                    $set: {
                        researcher_id: strategy.maker_id,
                        Collaborators_id: user_id,
                        total_amount: type !== "monthlyPlan" ? newTotalAmount : 0
                    }
                };
                await Stg_Collaborators.updateOne(collaboratorFilter, collaboratorUpdate, { upsert: true });

                const updateCollaborator = await Stg_Collaborators.updateOne(collaboratorFilter, collaboratorUpdate, { upsert: true });
            }

            // Create a new strategy document based on the found strategy
            const newStrategy = new strategy_model({
                stgname_adminid: `${strategy.strategy_name}_${user_id}`,
                strategy_name: strategy.strategy_name,
                strategy_description: strategy.strategy_description,
                strategy_demo_days: strategy.strategy_demo_days,
                strategy_category: strategy.strategy_category,
                strategy_segment: strategy.strategy_segment,
                strategy_indicator: strategy.strategy_indicator,
                strategy_tester: strategy.strategy_tester,
                strategy_image: strategy.strategy_image,
                maker_id: user_id,
                max_trade: strategy.max_trade || null,
                strategy_percentage: strategy.strategy_percentage || null,
                researcher_id: strategy.maker_id,
                purchase_type: type,
                research_strategy_percentage: strategy.strategy_percentage || 0,
                End_Date: type === "monthlyPlan" ? formattedDate : null
            });

            // Save the new strategy document
            await newStrategy.save();

            // Update collaboration_id in researcher_strategy collection
            const strategyFilter = { _id: strategy._id };
            const strategyUpdate = { $push: { collaboration_id: user_id } };
            const updateStrategy = await researcher_strategy.updateOne(strategyFilter, strategyUpdate);

            // Update strategy_Order_modal collection
            const orderFilter = { _id: id };
            const orderUpdate = { $set: req.body };
            const updateOrder = await strategy_Order_modal.updateOne(orderFilter, orderUpdate, { upsert: true });

            res.send({ status: true, data: updateOrder, msg: "Update successful" });
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).send({ status: false, data: error, msg: "Update failed" });
        }
    }



    // GET ORDER DATA
    async GetResearcheOrder(req, res) {
        try {

            const { id } = req.body;

            const GetResearcherData = await strategy_Order_modal.aggregate([
                {
                    $match: { admin_id: new ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "admin_id",
                        foreignField: "_id",
                        as: "userData"
                    }
                },
                {
                    $unwind: "$userData"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "userData1"
                    }
                },
                {
                    $unwind: "$userData1"
                },

                {
                    $project: {
                        _id: 0,
                        Admin_name: "$userData.UserName",
                        User_name: "$userData1.UserName",
                        plan_name: 1,
                        strategy_name: 1,
                        order_id: 1,
                        amount: 1,
                        receipt: 1,
                        razorpay_order_id: 1,
                        razorpay_payment_id: 1,
                        razorpay_signature: 1,
                        order_status: 1,
                        createdAt: 1,
                        updatedAt: 1

                    }
                }
            ]);



            if (!GetResearcherData) {
                return res.send({ status: false, data: [], msg: "Empty Data" });

            }

            return res.send({ status: true, data: GetResearcherData, msg: "Reacher Data" });
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).send({ status: false, data: error, msg: "Update failed" });
        }
    }






    // CREATE ORDER USER
    async CreateOderStg(req, res) {
        const { strategy_name, user_id, admin_id, strategy_id, type, amount, currency, receipt } = req.body;


        const companyInformation = await SubAdminCompanyInfo.aggregate([
            {
                $match: { maker_id: new ObjectId(admin_id) }
            }
            , {
                $project: {
                    razor_payment_key: 1,
                    panel_name: 1,
                    razor_payment_secretKey: 1,
                    _id: 0
                }
            },
            {
                $limit: 1
            }
        ]);


        let razorpay = new Razorpay({
            key_id: companyInformation[0].razor_payment_key,
            key_secret: companyInformation[0].razor_payment_secretKey,
        });



        const options = {
            amount: amount, // in paise
            currency: currency,
            receipt: receipt,
        };

        try {
            const response = await razorpay.orders.create(options);

            var strategy_Order = new strategy_Order_modal({
                strategy_name: strategy_name,
                plan_name: type,
                user_id: user_id,
                admin_id: admin_id,
                strategy_id: strategy_id,
                order_id: response.id,
                User_data: "",
                amount: parseInt(amount) / 100, // in paise
                receipt: receipt,
                razorpay_order_id: "",
                razorpay_payment_id: "",

            })

            var order_data = await strategy_Order.save()
            var data1 = {

                key: companyInformation[0].razor_payment_key,
                name: companyInformation[0].panel_name,
            }

            res.send({ status: true, data: order_data, data1: data1, msg: "Msg Done" });

        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).send({ status: false, data: error, msg: "Request not good" });
        }

    }


    // UPDATE ORDER
    async UpdateOrderstg(req, res) {
        try {

            const { strategy_id, user_id, type, id } = req.body;

            const matchedStrategy = await strategy_model.findOne({ _id: strategy_id }).select(
                'strategy strategy_demo_days security_fund_month security_fund_quarterly security_fund_half_early security_fund_early Service_Type fixed_amount_per_trade_early fixed_amount_per_trade_half_early fixed_amount_per_trade_quarterly fixed_amount_per_trade_month maker_id'
            );

            const ParentData = await User_model.findOne({ _id: new ObjectId(matchedStrategy.maker_id) }).select(
                'Balance subadmin_service_type strategy_Percentage'
            );

            let price_stg = 0;
            let daysforstg = 0;
            let trade_charge = 0;
            var plan_id = 0

            switch (type) {
                case "monthlyPlan":
                    plan_id = "1"
                    price_stg = matchedStrategy.security_fund_month;
                    daysforstg = 1;
                    trade_charge = matchedStrategy.fixed_amount_per_trade_month;
                    break;
                case "quarterly":
                    plan_id = "2"
                    price_stg = matchedStrategy.security_fund_quarterly;
                    daysforstg = 3;
                    trade_charge = matchedStrategy.fixed_amount_per_trade_quarterly;
                    break;
                case "half_early":
                    plan_id = "3"
                    price_stg = matchedStrategy.security_fund_half_early;
                    daysforstg = 6;
                    trade_charge = matchedStrategy.fixed_amount_per_trade_half_early;
                    break;
                case "yearly":
                    plan_id = "4"
                    price_stg = matchedStrategy.security_fund_early;
                    daysforstg = 12;
                    trade_charge = matchedStrategy.fixed_amount_per_trade_early;
                    break;
                default:
                    plan_id = "0"
                    daysforstg = 0;
                    price_stg = 0;
                    trade_charge = 0;
            }

            const currentDate = new Date();
            const start_date_2days = dateTime.create(currentDate).format("Y-m-d H:M:S");
            const StartDate1 = start_date_2days;

            const StartDate = new Date(start_date_2days);
            const UpdateDate = new Date(StartDate.setMonth(StartDate.getMonth() + parseInt(daysforstg)));
            const EndDate1 = dateTime.create(UpdateDate).format("Y-m-d H:M:S");

            // STRATEGY ADD
            const User_strategy_client = new strategy_client({
                strategy_id: matchedStrategy._id,
                plan_id: plan_id,
                user_id: user_id,
                admin_id: matchedStrategy.maker_id,
                Start_Date: StartDate1,
                End_Date: EndDate1,
                uniqueUserStrategy: `${user_id}_${matchedStrategy._id}`,
                trade_charge: trade_charge
            });
            await User_strategy_client.save();

            const Activity_logsData = new Activity_logs({
                user_Id: user_id,
                admin_Id: matchedStrategy.maker_id,
                category: "EDIT-USER",
                message: `${matchedStrategy.strategy} Strategy Add`,
                maker_role: "SUBADMIN",
                device: "web",
                system_ip: ""
            });
            await Activity_logsData.save();

            const Admin_charge_percentage = parseInt(ParentData.strategy_Percentage) / 100;
            const Admin_charge1 = Admin_charge_percentage * parseInt(price_stg);

            const strategy_transactionData = new strategy_transaction({
                strategy_id: matchedStrategy._id,
                user_id: user_id,
                admin_id: matchedStrategy.maker_id,
                plan_id: plan_id,
                Start_Date: StartDate1,
                End_Date: EndDate1,
                stg_charge: price_stg,
                Admin_charge: Admin_charge1
            });
            await strategy_transactionData.save();

            // Update strategy_Order_modal collection
            const filter = { _id: id };
            const update = { $set: req.body };
            const update_token = await User_strategy_Order.updateOne(filter, update, { upsert: true });

            res.send({ status: true, data: update_token, msg: "Update successful" });

        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).send({ status: false, data: error, msg: "Update failed" });
        }
    }



}

module.exports = new Ordercreate();
