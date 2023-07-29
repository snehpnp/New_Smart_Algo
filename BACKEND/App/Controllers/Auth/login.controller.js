"use strict";

const { User_model } = require('../../Models/user.model')
const formattedDateTime = require('../../Helper/time.helper')

// OK
// Product CLASS
class Login {
    async login(req, res) {
        try {
            const { Email, Password } = req.body;

            // IF Login Time Email CHECK
            const EmailCheck = await User_model.findOne({ Email: Email });
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'Email Not exists', data: [] });
            }








        }
        catch (error) {
            res.send({ msg: "Login Error", error })
        }

    }




}


module.exports = new Login();