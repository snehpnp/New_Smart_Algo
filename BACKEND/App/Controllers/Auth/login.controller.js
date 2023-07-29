"use strict";
const bcrypt = require("bcrypt");

const { User_model } = require('../../Models/user.model')
const formattedDateTime = require('../../Helper/time.helper')

// OK
// Product CLASS
class Login {
    async login(req, res) {
        try {
            const { Email, Password, device } = req.body;
            // IF Login Time Email CHECK
            const EmailCheck = await User_model.findOne({ Email: Email });
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }

            // WHERE LOGIN CHECK
            if (device == "APP") {                  //App Login Check
                if (EmailCheck.AppLoginStatus == 1) {
                    return res.status(409).json({ status: false, msg: 'You are already logged in on the phone.', data: [] });
                }
            } else if (device == "WEB") {          //Web login check
                if (EmailCheck.WebLoginStatus == 1) {
                    return res.status(409).json({ status: false, msg: 'You are already logged in on the Web.', data: [] });
                }
            } else {
                return res.status(409).json({ status: false, msg: 'Server Side issue', data: [] });

            }


            // PASSWORD LENGTH CHECK
            if (Password.length < 4) {
                return res.status(409).json({ status: false, msg: 'please Enter More Than 4 Digits ', data: [] });
            }

            // Password Check
            const validPassword = await bcrypt.compare(Password, EmailCheck.Password);
            if (validPassword == false) {
                return res.status(409).json({ status: false, msg: 'Password Not Match', data: [] });
            }


            // User active Status
            if (EmailCheck.ActiveStatus == 0) {
                return res.status(409).json({ status: false, msg: 'please contact admin you are inactive.', data: [] });
            }



            // USER EXPIRY CHECK
            if (new Date(EmailCheck.EndDate) <= new Date()) {
                return res.status(409).json({ status: false, msg: 'your service is terminated please contact to admin', data: [] });
              } 

            // JWT TOKEN CREATE 
            var token = jwt.sign({ id: result[0].id }, 'testsnehissetalogintocheck', {
                expiresIn: 86400 // 24 hours
            });
            // console.log("token",token);

            var msg = { 'user_id': EmailCheck._id, 'token': token, 'mobile': EmailCheck.PhoneNo };

            res.send({ status: true, msg: "Login Succesfully", data: msg })



        }
        catch (error) {
            res.send({ msg: "Login Error", error })
        }

    }




}


module.exports = new Login();