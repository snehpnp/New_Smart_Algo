"use strict";
const { connectToMongoDB } = require("../../Connection/mongo_connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { logger, getIPAddress } = require("../../Helper/logger.helper");
const { CommonEmail } = require("../../Helper/CommonEmail");
const {
  firstOptPass,
  disclaimer,
} = require("../../Helper/Email_formate/first_login");

const db = require("../../Models");
const company_information = db.company_information;
const User = db.user;
const Subadmin_Permission = db.Subadmin_Permission;
const user_SignUp = db.UserSignUp;
const userReedeem_modal = db.userReedeem_modal;

const formattedDateTime = require("../../Helper/time.helper");
const user_logs = require("../../Models/user_logs.model");

// Login CLASS
class Login {
  // Login User
  async login(req, res) {
    try {
      const { Email, Password, device, network_ip } = req.body;
      // IF Login Time Email CHECK

      const EmailCheck = await User.findOne({ Email: Email });
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      if (EmailCheck.Role == "USER" && EmailCheck.license_type == "2") {
        // WHERE LOGIN CHECKgetIPAddress
        if (device == "APP") {
          //App Login Check
          if (EmailCheck.AppLoginStatus == 1) {
            return res.json({
              status: false,
              msg: "You are already logged in on the phone.",
              data: [],
            });
          }
        } else if (device == "WEB") {
          //Web login check
          if (EmailCheck.WebLoginStatus == 1) {
            return res.send({
              status: false,
              msg: "You are already logged in on the Web.",
              data: [],
            });
          }
        }
      }

      // Password Check
      const validPassword = await bcrypt.compare(Password, EmailCheck.Password);
      if (validPassword == false) {
        return res.send({ status: false, msg: "Password Not Match", data: [] });
      }

      if (EmailCheck.Role == "USER") {
        // User active Status
        if (EmailCheck.ActiveStatus == 0) {
          return res.send({
            status: false,
            msg: "please contact admin you are inactive.",
            data: [],
          });
        }

        // USER EXPIRY CHECK
        if (new Date(EmailCheck.EndDate) <= new Date()) {
          return res.send({
            status: false,
            msg: "your service is terminated please contact to admin",
            data: [],
          });
        }

        // USER EXPIRY CHECK
        if (new Date(EmailCheck.StartDate) >= new Date()) {
          return res.send({
            status: false,
            msg: "your service is Not Started please contact to admin",
            data: [],
          });
        }
      }

      if (EmailCheck.Role == "SUBADMIN") {
        // User active Status
        if (EmailCheck.ActiveStatus == 0) {
          return res.send({
            status: false,
            msg: "please contact admin you are inactive.",
            data: [],
          });
        }
      }

      // JWT TOKEN CREATE
      var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
        expiresIn: 36000, // 10 hours
      });

      if (EmailCheck.Role == "SUBADMIN") {
        var SubadminPermision = await Subadmin_Permission.find({
          user_id: EmailCheck._id,
        });
        var msg = {
          Email: EmailCheck.Email,
          user_id: EmailCheck._id,
          token: token,
          mobile: EmailCheck.PhoneNo,
          Role: EmailCheck.Role,
          Subadmin_permision: SubadminPermision,
          broker: EmailCheck.broker,
          UserName: EmailCheck.UserName,
        };
      } else {
        var msg = {
          Email: EmailCheck.Email,
          user_id: EmailCheck._id,
          token: token,
          mobile: EmailCheck.PhoneNo,
          Role: EmailCheck.Role,
          broker: EmailCheck.broker,
          type: EmailCheck.license_type,
          UserName: EmailCheck.UserName,
        };
      }

      var token_query;
      if (device == "APP") {
        token_query = { app_login_token: token };
      } else {
        token_query = { web_login_token: token };
      }

      let result11 = await User.findByIdAndUpdate(EmailCheck._id, token_query, {
        new: true,
      });

      try {
        return res.send({ status: true, msg: "Login Succesfully", data: msg });
      } catch (error) {
        console.log("Error Some Error in a login", error);
      }
    } catch (error) {
      return res.send({ status: false, msg: "Server Side error", data: error });
    }
  }

  // Show User Data
  async showuserdata(req, res) {
    try {
      const result = await user_SignUp.find();
      if (result.length > 0) {
        return res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        return res.status(200).json({
          status: false,
          data: "No user is found",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
  }

  // DELETE SIGNUP CLIENT DATA
  async deletesignupclients(req, res) {
    try {
      const { id } = req.body;

      const get_user = await user_SignUp.find({ _id: id });

      if (user_SignUp.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: [] });
      }
      var DeleteUser = await user_SignUp.deleteOne({ _id: get_user[0]._id });

      return res.send({
        status: true,
        msg: "Delete Successfully",
        data: DeleteUser,
      });
    } catch (error) {
      console.log("Error trading status Error-", error);
    }
  }

  // User SignUp
  async signup(req, res) {
    try {
      const { UserName, FullName, Email, PhoneNo, refer_code } = req.body;

      // Fetch company information
      const companyInfo = await company_information.findOne();
      const referPoints = companyInfo?.refer_points || 0;

      // Combined query to check for existing users in both collections
      const searchQuery = {
        $or: [{ UserName }, { Email }, { PhoneNo }],
      };

      // Check for existing users in both collections
      const [existingUser, existingSignupUser] = await Promise.all([
        User.findOne(searchQuery),
        user_SignUp.findOne(searchQuery),
      ]);

      // Collect error messages if any existing user is found
      const errorMsg = [];
      if (existingUser || existingSignupUser) {
        if (
          (existingUser && existingUser.UserName === UserName) ||
          (existingSignupUser && existingSignupUser.UserName === UserName)
        ) {
          errorMsg.push("Username already exists");
        }
        if (
          (existingUser && existingUser.Email === Email) ||
          (existingSignupUser && existingSignupUser.Email === Email)
        ) {
          errorMsg.push("Email already exists");
        }
        if (
          (existingUser && existingUser.PhoneNo === PhoneNo) ||
          (existingSignupUser && existingSignupUser.PhoneNo === PhoneNo)
        ) {
          errorMsg.push("Phone Number already exists");
        }

        if (errorMsg.length > 0) {
          return res.status(400).json({
            status: false,
            msg: errorMsg.join(", "),
            data: errorMsg,
          });
        }
      }

      // Create new user if no existing user is found
      const newUser = new user_SignUp({
        UserName,
        FullName,
        Email,
        PhoneNo,
        refer_code,
        refer_points: referPoints,
      });

      await newUser.save();

      const referUser = await User.findOne({ UserName: refer_code });

      return res.status(201).json({ status: true, msg: "Sign Up successful!" });
    } catch (error) {
      console.log("Error during signup process:", error);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
  }

  // Verify user
  async verifyUser(req, res) {
    try {
      const { Email, Otp, Device, network_ip } = req.body;
      var addData = {};

      // IF Login Time Email CHECK
      const EmailCheck = await User.findOne({ Email: Email });
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      // CHECK OTP AND VERFIY OUR CLIENTS
      if (EmailCheck.PhoneNo.slice(-4) != Otp) {
        return res.send({ status: false, msg: "Otp Not Match", data: [] });
      }

      try {
        if (EmailCheck.Role == "USER" && EmailCheck.license_type == "2") {
          // WHERE LOGIN CHECK
          if (Device.toUpperCase() == "APP") {
            //App Login Check
            if (EmailCheck.AppLoginStatus == 1) {
              return res.send({
                status: false,
                msg: "You are already logged in on the phone.",
                data: [],
              });
            } else {
              addData["AppLoginStatus"] = 1;
            }
          } else if (Device.toUpperCase() == "WEB") {
            //Web login check
            if (EmailCheck.WebLoginStatus == 1) {
              return res.send({
                status: false,
                msg: "You are already logged in on the Web.",
                data: [],
              });
            } else {
              addData["WebLoginStatus"] = 1;
            }
          }
        } else {
          // WHERE LOGIN CHECK
          if (Device.toUpperCase() == "APP") {
            //App Login Check

            addData["AppLoginStatus"] = 1;
          } else if (Device.toUpperCase() == "WEB") {
            //Web login check

            addData["WebLoginStatus"] = 1;
          }
        }
      } catch (error) {
        return res.send({ status: false, msg: "Server Issue", data: error });
      }

      if (EmailCheck.Is_First_login == "0") {
        var disclaimerData = await disclaimer();

        var toEmail = EmailCheck.Email;
        var subjectEmail = "disclaimer";
        CommonEmail(toEmail, subjectEmail, disclaimerData);
      }

      addData["Is_First_login"] = 1;
      // Update Successfully
      const result = await User.updateOne({ Email: Email }, { $set: addData });

      // If Not Update User
      if (!result) {
        return res.send({ status: false, msg: "Server Side issue.", data: [] });
      }

      // ADD USER LOGS COLLECTION DATA
      const user_login = new user_logs({
        user_Id: EmailCheck._id,
        login_status: "Panel On " + Device,
        role: EmailCheck.Role,
        device: Device,
        system_ip: network_ip,
      });
      await user_login.save();

      return res.send({
        status: true,
        msg: "Login Successfully",
        data: [],
        firstlogin: EmailCheck.Is_First_login,
      });
    } catch (error) {}
  }

  // Logout User
  async logoutUser(req, res) {
    try {
      const { userId, Device } = req.body;
      var addData = {};

      // IF Login Time Email CHECK
      const EmailCheck = await User.findById(userId);
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      try {
        // WHERE LOGIN CHECK
        if (Device.toUpperCase() == "APP") {
          //App Login Check
          if (EmailCheck.AppLoginStatus == 0) {
          } else {
            addData["AppLoginStatus"] = 0;
          }
        } else if (Device.toUpperCase() == "WEB") {
          //Web login check
          if (EmailCheck.WebLoginStatus == 0) {
            // return res.send({ status: false, msg: 'You are already log Out on the Web.', data: [] });
          } else {
            addData["WebLoginStatus"] = 0;
          }
        }
      } catch (error) {
        console.log("Error Verfiy error", error);
      }

      // Update Successfully
      const result = await User.updateOne(
        { Email: EmailCheck.Email },
        { $set: addData }
      );

      const user_login = new user_logs({
        user_Id: EmailCheck._id,
        login_status: "Panel Logout " + Device,
        role: EmailCheck.Role,
        system_ip: getIPAddress(),
      });
      await user_login.save();

      if (EmailCheck.TradingStatus == "on") {
        const result1 = await User.updateOne(
          { Email: EmailCheck.Email },
          {
            $set: {
              TradingStatus: "off",
              access_token: "",
            },
          }
        );

        const user_login = new user_logs({
          user_Id: EmailCheck._id,
          login_status: "Trading off Because of Logout "+Device,
          role: EmailCheck.Role,
          system_ip: getIPAddress(),
        });
        await user_login.save();
      }

      if (!result) {
        return res.send({ status: false, msg: "Server Side issue.", data: [] });
      }

      return res.send({ status: true, msg: "Logout Succesfully", data: [] });
    } catch (error) {}
  }

  //  Forget Password
  async ForgetPassword(req, res) {
    try {
      const { Email, Device } = req.body;

      var EmailCheck = await User.findOne({ Email: Email });
      var CompanyInformation = await company_information.findOne();

      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      var userid = Buffer.from(JSON.stringify(EmailCheck._id)).toString(
        "base64"
      );
      var redirectUrl = `https://${CompanyInformation.domain_url}/#/update/${userid}`;

      var toEmail = Email;
      var subjectEmail = "Forget Password";
      var htmlEmail = "URL - " + redirectUrl;
      CommonEmail(toEmail, subjectEmail, htmlEmail);
    } catch (error) {
      console.log("Error in Login controller", error);
    }

    return res.send({
      status: true,
      msg: "Mail send successfully",
      data: redirectUrl,
    });
  }

  // Update Password
  async UpdatePassword(req, res) {
    try {
      const { userid, newpassword, confirmpassword } = req.body;
      const EmailCheck = await User.findById(userid);

      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      if (newpassword !== confirmpassword) {
        return res.send({
          status: false,
          msg: "New Password and Confirm Password Not Match",
          data: [],
        });
      }

      const hashedPassword = await bcrypt.hash(newpassword, 8);
      let result = await User.findByIdAndUpdate(
        EmailCheck._id,
        {
          Password: hashedPassword,
          Otp: newpassword,
        },
        { new: true }
      );

      // If Not Update User
      if (!result) {
        return res.send({ status: false, msg: "Server Side issue.", data: [] });
      }

      return res.send({ status: true, msg: "Password Update Successfully" });
    } catch (error) {}
  }

  // Reset Password

  async ResetPassword(req, res) {
    try {
      const { userid, newpassword, oldpassword } = req.body;

      const EmailCheck = await User.findById(userid);

      // return
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      const validPassword = await bcrypt.compare(
        oldpassword.toString(),
        EmailCheck.Password.toString()
      );

      // return
      if (!validPassword) {
        res
          .status(409)
          .send({ success: "false", message: "old Password Not Match" });
        return;
      } else {
        const hashedPassword = await bcrypt.hash(newpassword, 8);
        await User.findByIdAndUpdate(
          EmailCheck._id,
          {
            Password: hashedPassword,
            Otp: newpassword,
          },
          { new: true }
        );
      }

      return res.send({
        status: true,
        message: "Password Update Successfully",
      });

      // res.send({ status: true, message: "Password Update Successfully" });
    } catch (error) {}
  }

  // GO TO DASHBOARD
  async goToDashboard(req, res) {
    try {
      const { Email } = req.body;
      // IF Login Time Email CHECK
      const EmailCheck = await User.findOne({ Email: Email });
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }
      // JWT TOKEN CREATE
      var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
        expiresIn: 3600, // 10 hours
      });
      var msg = {
        gotodashboard: true,
        Email: EmailCheck.Email,
        user_id: EmailCheck._id,
        token: token,
        mobile: EmailCheck.PhoneNo,
        Role: EmailCheck.Role,
        UserName: EmailCheck.UserName,
      };

      try {
        return res.send({
          status: true,
          msg: "Go To Dashboard Succesfully",
          data: msg,
        });
      } catch (error) {
        console.log("Error Some Error in a login", error);
      }
    } catch (error) {
      res.send({ status: false, msg: "Server Side error", data: error });
      connectToMongoDB();
      return;
    }
  }

  // session clear
  async sessionClearmail(req, res) {
    try {
      const { Email, device } = req.body;
      // IF Login Time Email CHECK
      const EmailCheck = await User.findOne({ Email: Email });
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }

      var PhoneOtp = EmailCheck.PhoneNo;

      var indexPositions = [1, 3, 5, 7];

      var OTP = "";

      for (var i = 0; i < indexPositions.length; i++) {
        OTP += PhoneOtp.charAt(indexPositions[i]);
      }

      var toEmail = Email;
      var subjectEmail = "Logut And Re-Login Email";
      var htmlEmail = "otp - " + OTP;
      var textEmail = "otp - " + OTP;

      CommonEmail(toEmail, subjectEmail, htmlEmail, textEmail);

      return res.send({
        status: true,
        msg: "Send mail Successfully",
        data: OTP,
      });
    } catch (error) {
      return res.send({ status: false, msg: "Server Side error", data: error });
    }
  }

  async logout_other_device(req, res) {
    try {
      const { Email, otp, device } = req.body;
      // IF Login Time Email CHECK
      const EmailCheck = await User.findOne({ Email: Email });
      if (!EmailCheck) {
        return res.send({ status: false, msg: "User Not exists", data: [] });
      }
      var PhoneOtp = EmailCheck.PhoneNo;

      var indexPositions = [1, 3, 5, 7];

      var OTP = "";

      for (var i = 0; i < indexPositions.length; i++) {
        OTP += PhoneOtp.charAt(indexPositions[i]);
      }

      if (otp != OTP) {
        return res.send({ status: false, msg: "Otp Not Match", data: [] });
      }

      // JWT TOKEN CREATE
      var token = jwt.sign({ id: EmailCheck._id }, process.env.SECRET, {
        expiresIn: 36000, // 10 hours
      });

      if (EmailCheck.Role == "SUBADMIN") {
        var SubadminPermision = await Subadmin_Permission.find({
          user_id: EmailCheck._id,
        });

        var msg = {
          Email: EmailCheck.Email,
          user_id: EmailCheck._id,
          token: token,
          mobile: EmailCheck.PhoneNo,
          Role: EmailCheck.Role,
          Subadmin_permision: SubadminPermision,
        };
      } else {
        var msg = {
          Email: EmailCheck.Email,
          user_id: EmailCheck._id,
          token: token,
          mobile: EmailCheck.PhoneNo,
          Role: EmailCheck.Role,
        };
      }

      var token_query;
      var addData = {};

      if (device.toUpperCase() == "APP") {
        token_query = { app_login_token: token };
        addData["AppLoginStatus"] = 1;
      } else {
        token_query = { web_login_token: token };
        addData["WebLoginStatus"] = 1;
      }

      // Update Successfully
      const result = await User.updateOne(
        { Email: EmailCheck.Email },
        { $set: addData }
      );

      const user_login = new user_logs({
        user_Id: EmailCheck._id,
        login_status: "Panel On",
        role: EmailCheck.Role,
        message: "The user was logged in and then logged out somewhere else. ",
        device: device.toUpperCase(),
        system_ip: getIPAddress(),
      });
      await user_login.save();

      try {
        return res.send({ status: true, msg: "Login Succesfully", data: msg });
      } catch (error) {
        console.log("Error Some Error in a login", error);
      }
    } catch (error) {
      return res.send({ status: false, msg: "Server Side error", data: error });
    }
  }

  async DisclaimerMailSend(req, res) {
    try {
      var disclaimerData = await disclaimer();

      var toEmail = "snehpnp@gmail.com";
      var subjectEmail = "disclaimer";
      CommonEmail(toEmail, subjectEmail, disclaimerData);
    } catch (error) {
      return res.send({ status: false, msg: "Server Side error", data: error });
    }
  }

  async reedeemRequest(req, res) {
    try {
      const { user_id, reedeem_points } = req.body;

      // Validate input
      if (!user_id || !reedeem_points) {
        return res.status(400).send({
          status: false,
          msg: "user_id and reedeem_points are required",
        });
      }

      // Check if user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).send({
          status: false,
          msg: "User not found",
        });
      }

      // Check if user has enough points to redeem
      if (user.refer_points < reedeem_points) {
        return res.status(400).send({
          status: false,
          msg: "Insufficient points to redeem",
        });
      }

      // Deduct points from user's account
      // user.refer_points -= reedeem_points;
      // await user.save();

      // Save redeem request
      const redeemRequest = new userReedeem_modal({
        user_id,
        reedeem_points,
      });
      await redeemRequest.save();

      return res.send({
        status: true,
        msg: "Redeem request processed successfully",
        data: {
          user_id,
          reedeem_points,
        },
      });
    } catch (error) {
      console.log("Error in reedeemRequest controller", error);
      return res.status(500).send({
        status: false,
        msg: "Internal Server Error",
      });
    }
  }

  async GetreedeemRequest(req, res) {
    try {
      const { Role, user_id } = req.body;

      // Construct match condition based on Role
      let matchCondition = {};
      if (Role === "USER") {
        matchCondition = { user_id: new ObjectId(user_id) };
      }

      // Aggregation pipeline to lookup and fetch the necessary details
      const redeemRequests = await userReedeem_modal.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: "users", // Collection name for users
            localField: "user_id",
            foreignField: "_id",
            as: "user_details",
          },
        },
        { $unwind: "$user_details" },
        {
          $addFields: {
            UserName: "$user_details.UserName",
          },
        },
        {
          $project: {
            _id: 1,
            reedeem_points: 1,
            user_id: 1,
            createdAt: 1,
            UserName: 1,
            ActiveStatus: 1,
          },
        },
      ]);

      if (redeemRequests.length === 0) {
        return res.send({
          status: false,
          msg: "No redeem requests found",
          data: [],
        });
      }

      return res.send({
        status: true,
        msg: "Redeem requests fetched successfully",
        data: redeemRequests,
      });
    } catch (error) {
      console.log("Error in GetreedeemRequest controller", error);
      return res.status(500).send({
        status: false,
        msg: "Internal Server Error",
      });
    }
  }

  async updatereedeemRequest(req, res) {
    try {
      const { user_id, id, reedeem_points, status } = req.body;

      // Validate input
      if (!user_id || !id || !status) {
        return res.status(400).send({
          status: false,
          msg: "user_id, id, and status are required",
        });
      }

      // Check if user exists
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).send({
          status: false,
          msg: "User not found",
        });
      }

      // Check if redeem request exists
      const user_reedeem = await userReedeem_modal.findById(id);
      if (!user_reedeem) {
        return res.status(404).send({
          status: false,
          msg: "Redeem request not found",
        });
      }

      if (status == 1) {
        user_reedeem.ActiveStatus = 1;
        await user_reedeem.save();
      } else if (status == 2) {
        if (user.refer_points < reedeem_points) {
          return res.status(400).send({
            status: false,
            msg: "Insufficient points to redeem",
          });
        }

        user_reedeem.ActiveStatus = 2;
        await user_reedeem.save();

        var UserRemainPoint = (user.refer_points =
          user.refer_points - reedeem_points);

        await User.updateOne(
          { _id: user._id },
          { $set: { refer_points: UserRemainPoint } }
        );
      }

      return res.send({
        status: true,
        msg: "Redeem request processed successfully",
        data: {
          user_id,
          reedeem_points,
        },
      });
    } catch (error) {
      console.log("Error in reedeemRequest controller", error);
      return res.status(500).send({
        status: false,
        msg: "Internal Server Error",
      });
    }
  }
}

module.exports = new Login();
