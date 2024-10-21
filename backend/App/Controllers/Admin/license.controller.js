"use strict";
const db = require("../../Models");
const Signals_modal = db.Signals;
const user_model = db.user;
const count_licenses = db.count_licenses;
const company_information = db.company_information;


class License {

  // GET Expired Clients
  async GetExpiredclients(req, res) {
    try {
      const currentDate = new Date();

      // Calculate the date 3 days from now
      const endDateThreshold = new Date(currentDate);
      endDateThreshold.setDate(currentDate.getDate() + 3);

      const get_user = await user_model.find({
        Role: "USER",
        EndDate: {
          $gte: currentDate,
          $lte: endDateThreshold,
        },
      }).select("UserName Email PhoneNo StartDate EndDate")

      if (get_user.length == 0) {
        return res.send({ status: false, msg: "Empty data", data: get_user });
      }
      return res.send({ status: true, msg: "Get all Clients", data: get_user });
    } catch (error) {
      console.log("Error Get Expiry Client-", error);
    }
  }

  // GET TRANSECTION LICENSE DATA
  async GetTransctionLicense(req, res) {

   
   
    try {


      const pip = [

        {
          $match: {
            $and: [
              { Role: "USER" }
            ]
          }
        },
  
        {
          $lookup: {
            from: 'companies',
            let: { endDate: "$EndDate" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$$endDate" } }, // User_model's EndDate
                      { $dateToString: { format: "%Y-%m-%d", date: "$month_ago_date" } } // Ensure $month_ago_date exists in companies
                    ]
                  }
                }
              }
            ],
            as: 'companyData'
          }
        },
        {
          $unwind: "$companyData"
        },
        {
          $group: {
            _id: null,
            used_licence: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$Role", "USER"] },
                      { $eq: ["$license_type", "2"] }
                    ]
                  },
                  { $toInt: { $ifNull: ["$licence", "0"] } },
                  0
                ]
              }
            }
  
  
          }
        },
  
        {
          $lookup: {
            from: "companies",
            pipeline: [],
            as: "company_info"
          }
        },
        {
          $unwind: "$company_info"
        },
        {
          $lookup: {
            from: 'count_licenses',
            let: { month_ago_date: "$company_info.month_ago_date" },
            pipeline: [],
           
            as: 'licenseData'
          }
        },
        {
          $unwind: "$licenseData"
        },
  
        {
          $group: {
            _id: "$_id",
  
            total_used_licence: {
              $sum: {
                $toInt: "$licenseData.license"
              }
            },
            used_licence: { $first: "$used_licence" },
            total_admin_licence: { $first: "$company_info.licenses" }
  
          }
        },
        {
          $project: {
            total_admin_license: 1,
            total_admin_licence: 1,
            total_used_licence: 1,
            used_licence: 1,
            licenses:
            {
              $toInt: {
                $subtract: [
                  "$total_admin_licence",
             
                  {
                    $subtract: [
                      "$total_used_licence",
                      "$used_licence"
                    ]
                  },
  
                ]
                
              }
            },
            remaining_license: {
              $toInt: {
                $subtract: [
                  {
                    $toInt: {
                      $subtract: [
                        "$total_admin_licence",
                   
                        {
                          $subtract: [
                            "$total_used_licence",
                            "$used_licence"
                          ]
                        },
        
                      ]
                      
                    }
                  },
                  "$used_licence"
                ]
                
              }
            },
  
          }
        }
  
      ]
  
      const resultLicence = await user_model.aggregate(pip);
  


      const Transection_license = await count_licenses.aggregate([
       
        // {
        //   $sort: { createdAt: -1 },
        // },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.Role": { $in: ["USER", "ADMIN"] },
          },
        },

        {
          $lookup: {
            from: 'companies',
            let: { endDate: "$user.EndDate" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $gt: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$$endDate" } }, // User_model's EndDate
                      { $dateToString: { format: "%Y-%m-%d", date: "$month_ago_date" } } // Ensure $month_ago_date exists in companies
                    ]
                  }
                }
              }
            ],
            as: 'companyData'
          }
        },
        {
          $unwind: "$companyData"
        },
        
        {
          $project: {

            license: 1,
            admin_license: 1,
            createdAt: 1,
            "user.FullName": 1,
            "user.UserName": 1,
          },
        },
      ]);

    

 
      if (Transection_license.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          data: Transection_license,
        });
      }
   

     let ExistMonthRemoveLicence = resultLicence.length > 0 ? parseInt(resultLicence[0].total_admin_licence ) -  parseInt(resultLicence[0].licenses ):0;
   
      const updatedArr = Transection_license.map((item) => {
        if (item.admin_license) {
            if(ExistMonthRemoveLicence > 0){
            if(parseInt(item.admin_license) > ExistMonthRemoveLicence){
             item.admin_license = parseInt(item.admin_license) - ExistMonthRemoveLicence;
             ExistMonthRemoveLicence = 0
              return item;
            }else{
             ExistMonthRemoveLicence = ExistMonthRemoveLicence - parseInt(item.admin_license)
             item.admin_license = parseInt(item.admin_license) - parseInt(item.admin_license);
             return item; 
            }
           }
        }
         return item;
      }).filter((item) => item.admin_license !== 0);

      updatedArr.reverse();

      if(resultLicence.length > 0){
        return res.send({
          status: true,
          msg: "Get all Transection license",
          data: updatedArr,
          total_licence: resultLicence[0].licenses,
          used_licence:resultLicence[0].used_licence  != 0  || resultLicence[0].used_licence != undefined ?   resultLicence[0].used_licence : 0
        });

      }else{
        return res.send({
          status: true,
          msg: "Get all Transection license",
          data: updatedArr,
          total_licence: 0,
          used_licence:0
        });
      }


     
    } catch (error) {
      console.log("Error Get All Transction License -", error);
    }
  }

  // GET SELECTED MONTH LICENCE
  async GetSelectedMonthLicence(req, res) {
    try {
      const companyInformation = await company_information.find({});

      if (Transection_license.length == 0) {
        return res.send({
          status: false,
          msg: "Empty data",
          //   data: Transection_license,
        });
      }
      return res.send({
        status: true,
        msg: "Get all Transection license",
        // data: Transection_license,
      });
    } catch (error) {
      console.log("Error License  error-", error);
    }
  }

}

module.exports = new License();
