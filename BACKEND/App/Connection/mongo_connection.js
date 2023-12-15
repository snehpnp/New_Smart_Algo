// "use strict";




const mongoose = require("mongoose");

const db_connect = process.env.MONGO_URI;

mongoose.connect(db_connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
});

const connection = mongoose.connection;

connection.on("error", (error) => {
  console.error("MongoDB Connection Error:", error);
});

connection.once("open", () => {
  console.log("Connected to MongoDB");
  // Add your logic here for a successful connection
});





// const { connect, connection } = require("mongoose");
// const Role = require('../Models/role.model')
// const company = require('../Models/company_information.model')
// const categorysdata = require('../Models/categorie.model')

// mongodb://SuperAdmin:Super2(&*%5E@180.149.241.128:27017

// const { Role, company, categorysdata } = require('./models');  // Import your mongoose models

// const connectToDatabase = async () => {
//   try {
//     const db_connect = process.env.MONGO_URI;
//     const db_name = process.env.DB_NAME;

//     console.log(db_connect);
//     console.log(db_name);


//     await connect(`${db_connect}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     connection.useDb(db_name)

//   } catch (error) {
//     console.log("MongoDB Error in Connection=", error);
//   }
// };

// // Use the connectToDatabase function
// connectToDatabase();



/*
 * Title:  Login System Advanced 
 * Author:     Sneh Jaiswal
 * Created On: Fri Jun 17 2022 10:56:54 am
 */


// "use strict";

// const { connect, connection } = require("mongoose");

// const db_connect = process.env.MONGO_URI;
//     const db_name = process.env.DB_NAME;

// connect(db_connect, (error) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   connection.useDb(db_name);
//   console.log("Connected to MongoDB");
// });




// ========================================================================================================



    // Role Table Existence Check
    // const roles = await Role.find();
    // if (roles.length !== 4) {
    //   await Role.deleteMany({});
    //   console.log('All roles deleted successfully.');
    //   RoleCreate();  // Role create function
    // }

    // // Company Information Table Check
    // const companies = await company.find();
    // if (companies.length === 0) {
    //   CompanyCreate();
    // }

    // // Categories Data Creation If Not Exist
    // const categories = await categorysdata.find();
    // if (categories.length !== 8) {
    //   await categorysdata.deleteMany({});
    //   console.log('All categories data deleted successfully.');
    //   categorys();
    // }


// Role Create
// const RoleCreate = () => {
//   var arr = [
//     {
//       role: "1",
//       name: 'SUPERADMIN',
//       description: 'SuperAdmin role with full access'
//     },
//     {

//       role: "2",
//       name: 'ADMIN',
//       description: 'Admin role with full access'
//     },
//     {

//       role: "3",
//       name: 'SUBADMIN',
//       description: 'SubAdmin role with only self user access'
//     },
//     {

//       role: "4",
//       name: 'USER',
//       description: 'User role '
//     }
//   ]
//   arr.forEach((role) => {
//     const newRole = new Role(role)
//     return newRole.save();
//   })
// }

// // Create Company information Table 
// const CompanyCreate = () => {
//   const companyData = new company({
//     panel_name: "Demo Comapnyname",
//     panel_key: "panel_key",
//     prefix: "prefix",
//     domain_url: "domain_url",
//     domain_url_https: "domain_url_https",
//     broker_url: "broker_url",
//     theme_id: "64d0c04a0e38c94d0e20ee28",
//     theme_name: "theme_name"

//   })
//   return companyData.save();
// }
// // Create categorys 
// const categorys = async () => {

//   var category = [
//     {
//       category_id: "1",
//       name: 'CASH',
//       segment: 'C',
//       status: 0,
//       CID: "1"
//     },
//     {
//       category_id: "2",
//       name: 'FUTURE',
//       segment: 'F',
//       status: 0,
//       CID: "2"
//     },
//     {
//       category_id: "3",
//       name: 'OPTION',
//       segment: 'O',
//       status: 0,
//       CID: "3"
//     },
//     {
//       category_id: "4",
//       name: 'MCXFUTURE',
//       segment: 'MF',
//       status: 0,
//       CID: "4"
//     },
//     {
//       category_id: "5",
//       name: 'MCXOPTION',
//       segment: 'MO',
//       status: 0,
//       CID: "5"
//     },
//     {
//       category_id: "6",
//       name: 'CURRENCY OPTION',
//       segment: 'CO',
//       status: 0,
//       CID: "6"
//     },
//     {
//       category_id: "7",
//       name: 'CURRENCY FUTURE',
//       segment: 'CF',
//       status: 0,
//       CID: "7"
//     },
//     {
//       category_id: "8",
//       name: 'FUTURE OPTION',
//       segment: 'FO',
//       status: 0,
//       CID: "3"
//     }
//   ]

//   category.forEach(async (data) => {
//     const newCategory = new categorysdata(data)
//     await newCategory.save();
//   })

// }