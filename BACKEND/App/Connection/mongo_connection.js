"use strict";
const { connect, connection } = require("mongoose");
const Role = require('../Models/role.model')
const company = require('../Models/company_information.model')
const categorysdata = require('../Models/categorie.model')



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

        // categorys data Create If not Exist 
        categorysdata.find()
          .then(async (role) => {
            if (role.length != 8) {
              console.log("role.length", role.length);
              await categorysdata.deleteMany({});
              console.log('All data deleted successfully.');
              categorys()
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
const RoleCreate = () => {
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
const CompanyCreate = () => {
  const companyData = new company({
    panel_name: "Demo Comapnyname",
    panel_key: "panel_key",
    prefix: "prefix",
    domain_url: "domain_url",
    domain_url_https: "domain_url_https",
    broker_url: "broker_url",
    theme_id: "12",
    theme_name: "theme_name"

  })
  // console.log("newRole", newRole);
  return companyData.save();
}
// Create categorys 
const categorys = async () => {

  var category = [
    {
      category_id: "1",
      name: 'CASH',
      segment: 'C',
      status: 0,
      CID: "1"
    },
    {
      category_id: "2",
      name: 'FUTURE',
      segment: 'F',
      status: 0,
      CID: "2"
    },
    {
      category_id: "3",
      name: 'OPTION',
      segment: 'O',
      status: 0,
      CID: "3"
    },
    {
      category_id: "4",
      name: 'MCXFUTURE',
      segment: 'MF',
      status: 0,
      CID: "4"
    },
    {
      category_id: "5",
      name: 'MCXOPTION',
      segment: 'MO',
      status: 0,
      CID: "5"
    },
    {
      category_id: "6",
      name: 'CURRENCY OPTION',
      segment: 'CO',
      status: 0,
      CID: "6"
    },
    {
      category_id: "7",
      name: 'CURRENCY FUTURE',
      segment: 'CF',
      status: 0,
      CID: "7"
    },
    {
      category_id: "8",
      name: 'FUTURE OPTION',
      segment: 'FO',
      status: 0,
      CID: "3"
    }
  ]

  category.forEach(async (data) => {
    const newCategory = new categorysdata(data)
    // console.log("newCategory", newCategory);
    await newCategory.save();
  })

}