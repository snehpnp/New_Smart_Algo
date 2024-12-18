var cron = require("node-cron");
const db = require("./Models");
const company_information = db.company_information;
const axios = require("axios");


cron.schedule("*/10 9-15 * * *", () => {
    // console.log("Running a task every 10 minutes from 9 AM to 3:30 PM");
    //  UpdatePrice();
   });
   
   
   
   let UpdatePrice = async () => {
     let UrlFind = await company_information.find({}).select("domain_url");
     let UrlCreate =  `https://${UrlFind[0].domain_url}/backend/restart/socket`;
   
   
     if (UrlCreate) {
       axios
         .get(UrlCreate)
         .then((response) => {
          console.log(UrlCreate, " => ", response.data);
         })
         .catch((error) => {
           console.log(error.response);
         });
     }
   };