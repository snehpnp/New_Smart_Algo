"use strict";
const { connect, connection } = require("mongoose");
const Role = require('../Models/role.model')

const connectToDatabase = async () => {
  try {
    connect(process.env.MONGO_URI)
      .then(() => {
        connection.useDb(process.env.DB_NAME);
        console.log("Connected to MongoDB " + process.env.DB_NAME);

        Role.find()
          .then((role) => {
            if (role.length != 4) {

              var arr = [
                {
                  role: "1",
                  name: 'SUPERADMIN',
                  description: 'SuperAdmin role with full access'
                },
                {

                  role: "2",
                  name: 'ADMIN',
                  description: 'Admin role with full access'
                },
                {

                  role: "3",
                  name: 'SUBADMIN',
                  description: 'SubAdmin role with only self user access'
                },
                {

                  role: "4",
                  name: 'USER',
                  description: 'User role '
                }
              ]
              arr.forEach((role) => {
                const newRole = new Role(role)
                // console.log("newRole", newRole);
                return newRole.save();
              })
            }
            return role;

          })



      })
      .catch((err) => {
        console.log("MongoDB Error in Connection ", err);
      });
  } catch (error) {
    console.log("error in mongo connection", error);
  }
}
connectToDatabase()

