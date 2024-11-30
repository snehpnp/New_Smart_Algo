"use strict";
const bcrypt = require("bcrypt");
const db = require("../../Models");
const User_model = db.user;

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const user_logs = db.user_logs;
const subadmin_logs = db.subadmin_activity_logs;


// Product CLASS
class Optionchain {



    async getBrokerCredential(req, res) {
        try {
            const { id } = req.body
            var Get_User = await User_model.find({ _id: id }).select('TradingStatus parent_id  Role api_secret access_token demat_userid client_key');
            if (Get_User.length == 0) {
                return res.send({ status: false, msg: "Id Wrong" });
            }

            return res.send({ status: true, msg: "Data Get", data: Get_User });



        } catch (error) {
            console.log("Error Alice Login error-", error)
        }
    }


}

module.exports = new Optionchain();
