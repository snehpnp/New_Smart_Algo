"use strict";
const { connect, connection } = require("mongoose");
const Role = require('../Models/role.model')
const company = require('../Models/company_information.model')


const connectToDatabase = async () => {
  try {
    connect(process.env.MONGO_URI)
      .then(() => {
        connection.useDb(process.env.DB_NAME);
        console.log("Connected to MongoDB " + process.env.DB_NAME);

        // Role Tabel Exist or not check
        Role.find()
          .then((role) => {
            if (role.length != 4) {
              RoleCreate()  //Role create function
            }
            return role;

          })

          // Company Information table check
          company.find()
          .then((role) => {
            if (role.length == 0) {
            console.log("Run");
            CompanyCreate()
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


// ========================================================================================================


// Role Create
const RoleCreate = ()=>{
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

// Create Company information Table 
const CompanyCreate = ()=>{
  const companyData = new company({
    panel_name:"Demo Comapnyname",
    panel_key:"panel_key",
    prefix:"prefix",
    domain_url:"domain_url",
    domain_url_https:"domain_url_https",
    broker_url:"broker_url",
    theme_name:"theme_name"
    
  })
  // console.log("newRole", newRole);
  return companyData.save();
}