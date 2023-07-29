"use strict";
const bcrypt = require("bcrypt");
const { User_model } = require('../../Models/user.model')
const Role_model = require('../../Models/role.model')

// OK
// Product CLASS
class Employee {
    async AddEmployee(req, res) {
        try {
            const { FullName, UserName, Email, PhoneNo, StartDate, EndDate, Role } = req.body;

            // IF ROLE NOT EXIST TO CHECK
            const roleCheck = await Role_model.findOne({ name: Role.toUpperCase() });
            if (!roleCheck) {
                return res.status(409).json({ status: false, msg: 'Role Not exists', data: [] });
            }

            // IF USER ALEARDY EXIST       
            const existingUsername = await User_model.findOne({ UserName: UserName });
            if (existingUsername) {
                return res.status(409).json({ status: false, msg: 'Username already exists', data: [] });
            }
            const existingemail = await User_model.findOne({  Email:Email  });
            if (existingemail) {
                return res.status(409).json({ status: false, msg: 'Email already exists', data: [] });
            }
            const existingePhone = await User_model.findOne({  PhoneNo:PhoneNo  });
            if (existingePhone) {
                return res.status(409).json({ status: false, msg: 'Phone Number already exists', data: [] });
            }

            
            const min = 1;
            const max = 1000000;
            const rand = min + Math.random() * (max - min);
            var rand_password = Math.round(rand)
            console.log("rand_password",rand_password);



            const salt = await bcrypt.genSalt(10);
            var ByCryptrand_password = await bcrypt.hash(rand_password.toString(), salt);



            // return
            // Company Information
            const User = new User_model({
                FullName: FullName,
                UserName: UserName,
                Email: Email,
                PhoneNo: PhoneNo,
                // Password: UserName + "@" + PhoneNo.slice(-4),
                Password: ByCryptrand_password,
                Otp: rand_password,
                StartDate: StartDate,
                EndDate: EndDate,
                Role: Role.toUpperCase()
            });

            const userinfo = User.save()
                .then(async (data) => {
                    console.log("data", data);
                    res.send({ status: true, msg: "successfully Add!", data: data })
                })


        }
        catch (error) {
            res.send({ msg: "Error=>", error })
        }

    }




}


module.exports = new Employee();