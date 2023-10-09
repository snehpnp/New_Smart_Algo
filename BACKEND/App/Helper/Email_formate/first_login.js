const db = require('../../Models');
const User = db.user;
const company_information = db.company_information;

var firstOptPass = async (data) => {
    // console.log("data", data);
    try {
        var Companydata = await company_information.find();
        
        return `<!doctype html> <html lang="en-US"> <head> <meta content="text/html; charset=utf-8" http-equiv="Content-Type" /> <title>PDF</title> <meta name="description" content="Reset Password Email Template."> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"> <!--100% body table--> <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"> <tr> <td> <table style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px; margin-top: 120px;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="text-align:center; padding-bottom: 30px;"> <img width="250" src="https://software.pandpinfotech.com/images/pnplogo16740321596981692447134191.png" title="logo" alt="logo"> </td> </tr> <tr> <td> <p><b>Welcome To ${Companydata[0].panel_name}</b></p> </td> </tr> <tr> <td> <p><b>Email:</b>${data.Email}</p> </td> </tr> <tr> <td> <p><b>Password:</b>${data.Password}</p> </td> </tr> <tr> <td> <p style="font-size: 15px; border-radius: 500px; color: #fff; background-color: #001c6b; padding: 13px; width: 20%; margin: 10px auto;"><span><b> <a style="color: #fff; text-decoration: none;" href=${Companydata[0].domain_url_https}>Back To Panel</a></b></span></p> </td> </tr> </table> </td> </tr> </table> <!--/100% body table--> </body> </html>`;













    } catch (error) {
        console.error("Error fetching company information:", error);
        // Handle the error as needed
        throw error;
    }
}

module.exports = { firstOptPass };
