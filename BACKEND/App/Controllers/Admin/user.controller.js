"use strict";

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
            const existingUser = await User_model.findOne({ $or: [{ UserName }, { Email }, { PhoneNo }] });
            if (existingUser) {
                return res.status(409).json({ status: false, msg: 'User already exists', data: [] });
            }


            // Company Information
            const User = new User_model({
                FullName: FullName,
                UserName: UserName,
                Email: Email,
                PhoneNo: PhoneNo,
                Password: UserName + "@" + PhoneNo.slice(-4),
                // Password: RandomeNum,
                Otp: "123",
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