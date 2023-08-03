"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { logger, getIPAddress } = require('../../Helper/logger.helper')
const { User_model } = require('../../Models/user.model')
const formattedDateTime = require('../../Helper/time.helper')
const  user_logs  = require('../../Models/user_logs.model')


// Login CLASS
class Login {

    // Login User
    async login(req, res) {
        try {
            const { Email, Password, device } = req.body;
            // IF Login Time Email CHECK
            const EmailCheck = await User_model.findOne({ Email: Email });
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }
            // console.log("ipAddress",ipAddress);

            // WHERE LOGIN CHECK
            if (device == "APP") {                  //App Login Check
                if (EmailCheck.AppLoginStatus == 1) {
                    return res.status(409).json({ status: false, msg: 'You are already logged in on the phone.', data: [] });
                }
            } else if (device == "WEB") {          //Web login check
                if (EmailCheck.WebLoginStatus == 1) {
                    return res.status(409).json({ status: false, msg: 'You are already logged in on the Web.', data: [] });
                }
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
            var token = jwt.sign({ id: EmailCheck._id }, 'testsnehissetalogintocheck', {
                expiresIn: 86400 // 24 hours
            });
            var msg = { 'user_id': EmailCheck._id, 'token': token, 'mobile': EmailCheck.PhoneNo, Role: EmailCheck.Role };

            try {
                // ADD USER LOGS COLLECTION DATA
                const user_login = new user_logs({
                    user_Id: EmailCheck._id,
                    login_status:"Panel On",
                    role:EmailCheck.Role,
                    system_ip:getIPAddress
                })

                await user_login.save()

                logger.info('Login Succesfully', { role: EmailCheck.Role, user_id: EmailCheck._id });

                res.send({ status: true, msg: "Login Succesfully", data: msg })


            } catch (error) {
                console.log("Some Error in a login", error);
            }


        }
        catch (error) {
            console.log(error);
            res.send({ status: false, msg: "Server Side error", data: error })
        }

    }

    // Verify user
   async verifyUser(req, res) {
        try {
            const { Email, Otp, Device } = req.body;
            var addData = {}

            // IF Login Time Email CHECK
            const EmailCheck = await User_model.findOne({ Email: Email });
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }

            // CHECK OTP AND VERFIY OUR CLIENTS
            if (EmailCheck.PhoneNo.slice(-4) != Otp) {
                return res.status(409).json({ status: false, msg: 'Otp Not Match', data: [] });
            }



            try {
                // WHERE LOGIN CHECK
                if (Device == "APP") {                  //App Login Check
                    if (EmailCheck.AppLoginStatus == 1) {
                        logger.info('You are already logged in on the phone.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        return res.status(409).json({ status: false, msg: 'You are already logged in on the phone.', data: [] });
                    } else {
                        addData["AppLoginStatus"] = 1;
                    }
                } else if (Device == "WEB") {          //Web login check
                    if (EmailCheck.WebLoginStatus == 1) {
                        logger.info('You are already logged in on the Web.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        return res.status(409).json({ status: false, msg: 'You are already logged in on the Web.', data: [] });
                    } else {
                        addData["WebLoginStatus"] = 1;
                    }
                }

            } catch (error) {
                console.log("Verfiy error", error);
                return res.status(409).json({ status: false, msg: 'Server Issue', data: error });

            }


            // Update Successfully
            const result = await User_model.updateOne(
                { Email: Email },
                { $set: addData }
            );

            // If Not Update User
            if (!result) {
                return res.status(409).json({ status: false, msg: 'Server Side issue.', data: [] });
            }


            logger.info('Login Succesfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
            res.send({ status: true, msg: "Login Successfully", data: [] })


        } catch (error) {

        }
    }


    // Logout User
    async logoutUser(req, res) {
        try {
            const { userId, Device } = req.body;
            var addData = {}

            // IF Login Time Email CHECK
            const EmailCheck = await User_model.findById(userId);
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }


            try {
                // WHERE LOGIN CHECK
                if (Device == "APP") {                  //App Login Check
                    if (EmailCheck.AppLoginStatus == 0) {
                        logger.info('You are already log Out on the phone.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        return res.status(409).json({ status: false, msg: 'You are already log Out on the phone.', data: [] });
                    } else {
                        addData["AppLoginStatus"] = 0;
                    }
                } else if (Device == "WEB") {          //Web login check
                    if (EmailCheck.WebLoginStatus == 0) {
                        logger.info('You are already log Out on the Web.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        return res.status(409).json({ status: false, msg: 'You are already log Out on the Web.', data: [] });
                    } else {
                        addData["WebLoginStatus"] = 0;
                    }
                }

            } catch (error) {
                console.log("Verfiy error", error);
            }


            // Update Successfully
            const result = await User_model.updateOne(
                { Email: EmailCheck.Email },
                { $set: addData }
            );

            // If Not Update User
            if (!result) {
                return res.status(409).json({ status: false, msg: 'Server Side issue.', data: [] });
            }


            logger.info('Logout Succesfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
            res.send({ status: true, msg: "Logout Succesfully", data: [] })


        } catch (error) {

        }
    }

}


module.exports = new Login();