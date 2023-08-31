"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { logger, getIPAddress } = require('../../Helper/logger.helper')

const db = require('../../Models');
const User = db.user;

const formattedDateTime = require('../../Helper/time.helper')
const user_logs = require('../../Models/user_logs.model')


// Login CLASS
class Login {

    // Login User
    async login(req, res) {
        try {
            const { Email, Password, device } = req.body;
            // IF Login Time Email CHECK
            const EmailCheck = await User.findOne({ Email: Email });
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }
            console.log(EmailCheck);

            // WHERE LOGIN CHECKgetIPAddress
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

            if (EmailCheck.Role == "USER") {

                // User active Status
                if (EmailCheck.ActiveStatus == 0) {
                    return res.status(409).json({ status: false, msg: 'please contact admin you are inactive.', data: [] });
                }

                // USER EXPIRY CHECK
                if (new Date(EmailCheck.EndDate) <= new Date()) {
                    return res.status(409).json({ status: false, msg: 'your service is terminated please contact to admin', data: [] });
                }
            }



            // JWT TOKEN CREATE
            var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
                expiresIn: 36000 // 10 hours
            });
            var msg = {
                'Email': EmailCheck.Email,
                'user_id': EmailCheck._id,
                'token': token,
                'mobile': EmailCheck.PhoneNo, Role: EmailCheck.Role
            };

            try {
                logger.info('Login Succesfully', { Email: EmailCheck.Email, role: EmailCheck.Role, user_id: EmailCheck._id });
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
            const EmailCheck = await User.findOne({ Email: Email });
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }

            // CHECK OTP AND VERFIY OUR CLIENTS
            if (EmailCheck.PhoneNo.slice(-4) != Otp) {
                return res.status(409).json({ status: false, msg: 'Otp Not Match', data: [] });
            }

            try {
                // WHERE LOGIN CHECK
                if (Device.toUpperCase() == "APP") {                  //App Login Check
                    if (EmailCheck.AppLoginStatus == 1) {
                        logger.info('You are already logged in on the phone.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        return res.status(409).json({ status: false, msg: 'You are already logged in on the phone.', data: [] });
                    } else {
                        addData["AppLoginStatus"] = 1;
                    }
                } else if (Device.toUpperCase() == "WEB") {          //Web login check
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

            console.log("addData", addData);
            // Update Successfully
            const result = await User.updateOne(
                { Email: Email },
                { $set: addData }
            );
            console.log("addData", result);

            // If Not Update User
            if (!result) {
                return res.status(409).json({ status: false, msg: 'Server Side issue.', data: [] });
            }

            // ADD USER LOGS COLLECTION DATA
            const user_login = new user_logs({
                user_Id: EmailCheck._id,
                login_status: "Panel On",
                role: EmailCheck.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();

            logger.info('Very Succesfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
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
            const EmailCheck = await User.findById(userId);
            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }


            try {
                // WHERE LOGIN CHECK
                if (Device.toUpperCase() == "APP") {                  //App Login Check
                    if (EmailCheck.AppLoginStatus == 0) {
                        logger.info('You are already log Out on the phone.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        // return res.status(409).json({ status: false, msg: 'You are already log Out on the phone.', data: [] });
                    } else {
                        addData["AppLoginStatus"] = 0;
                    }
                } else if (Device.toUpperCase() == "WEB") {          //Web login check
                    if (EmailCheck.WebLoginStatus == 0) {
                        logger.info('You are already log Out on the Web.', { role: EmailCheck.Role, user_id: EmailCheck._id });
                        // return res.status(409).json({ status: false, msg: 'You are already log Out on the Web.', data: [] });
                    } else {
                        addData["WebLoginStatus"] = 0;
                    }
                }

            } catch (error) {
                console.log("Verfiy error", error);
            }


            // Update Successfully
            const result = await User.updateOne(
                { Email: EmailCheck.Email },
                { $set: addData }
            );

            const user_login = new user_logs({
                user_Id: EmailCheck._id,
                login_status: "Panel off",
                role: EmailCheck.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();

            // If Not Update User
            if (!result) {
                return res.status(409).json({ status: false, msg: 'Server Side issue.', data: [] });
            }


            logger.info('Logout Succesfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
            res.send({ status: true, msg: "Logout Succesfully", data: [] })


        } catch (error) {

        }
    }


    //  Forget Password
    async ForgetPassword(req, res) {
        try {

            const { Email, Device } = req.body;

            // // IF Login Time Email CHECK
            var EmailCheck = await User.findOne({ Email: Email })

            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }


            var userid = Buffer.from(JSON.stringify(EmailCheck._id)).toString('base64');
            var redirectUrl = 'http://localhost:3000/#/update/' + userid
            // res.status(200).json({ status: false, msg: redirectUrl, data: [] });


        } catch (error) {

        }

        logger.info('Mail send successfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
        res.send({ status: true, msg: "Mail send successfully", data: redirectUrl })
    }


    // Update Password
    async UpdatePassword(req, res) {
        try {
            const { userid, newpassword, confirmpassword } = req.body;
            // // IF Login Time Email CHECK
            const EmailCheck = await User.findById(userid);

            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }

            if (newpassword !== confirmpassword) {
                return res.status(409).json({ status: false, msg: 'New Password and Confirm Password Not Match', data: [] });
            }

            const hashedPassword = await bcrypt.hash(newpassword, 8);
            let result = await User.findByIdAndUpdate(
                EmailCheck._id,
                {
                    Password: hashedPassword,
                    Otp: newpassword
                },
                { new: true }
            )

            // If Not Update User
            if (!result) {
                return res.status(409).json({ status: false, msg: 'Server Side issue.', data: [] });
            }


            logger.info('Password Update Successfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
            res.send({ status: true, msg: "Password Update Successfully" });
        } catch (error) {

        }
    }

    // Reset Password

    async ResetPassword(req, res) {
        try {
            const { userid, newpassword, oldpassword } = req.body;
            // // IF Login Time Email CHECK
            const EmailCheck = await User.findById(userid);

            console.log("EmailCheck", EmailCheck)


            // return

            if (!EmailCheck) {
                return res.status(409).json({ status: false, msg: 'User Not exists', data: [] });
            }

            const validPassword = await bcrypt.compare(oldpassword.toString(), EmailCheck.Password.toString());

            // return
            if (!validPassword) {
                res.status(409).send({ success: 'false', message: 'old Password Not Match' });
                return
            } else {
                const hashedPassword = await bcrypt.hash(newpassword, 8);
                await User.findByIdAndUpdate(
                    EmailCheck._id,
                    {
                        Password: hashedPassword,
                        Otp: newpassword
                    },
                    { new: true }
                );


                res.send({ status: true, message: "Password Update Successfully" });

            }
            // If Not Update User
            if (!result) {
                return res.status(409).json({ status: false, msg: 'Server Side issue.', data: [] });
            }

            logger.info('Password Update Successfully', { role: EmailCheck.Role, user_id: EmailCheck._id });
            // res.send({ status: true, message: "Password Update Successfully" });
        } catch (error) {

        }
    }
}


module.exports = new Login();