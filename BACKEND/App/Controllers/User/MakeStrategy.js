"use strict";
const db = require('../../Models');
const BrokerResponse_modal = db.BrokerResponse
const { formattedDateTime } = require('../../Helper/time.helper')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class MakeStrategy {

    // GET ADMIN SIGNALS
    async GetAllSymbols(req, res) {
        try {
         res.send("ok shk")

        } catch (error) {
            console.log("Error  error-", error);
        }
    }

}


module.exports = new MakeStrategy();