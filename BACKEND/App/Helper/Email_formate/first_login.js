const db = require('../../Models');
const User = db.user;
const company_information = db.company_information;


var firstOptPass = async (data) => {
    try {
        var Companydata = await company_information.find();


        return `<!doctype html> <html lang="en-US"> <head> <meta content="text/html; charset=utf-8" http-equiv="Content-Type" /> <title>PDF</title> <meta name="description" content="Reset Password Email Template."> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table> <tr> <td> <table style="max-width:670px;background:#fff; border-radius:3px;  -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px; margin-top: 50px;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="padding-bottom: 30px;"> ${Companydata[0].panel_name} </td> </tr> <tr> <td> <p>Dear ${data.FullName}</p> </td> </tr> <tr> <td><p style="line-height: 25px;">Thank You for choosing <b>${Companydata[0].panel_name}</b> for Algo Platform, We are pleased to inform that the password of your Algo Platform has been resetted as per details below:</p> </td> </tr> <tr> <td><p style="margin: 5px 0px;"><b>Software Details:</b> ${data.user_type}</p> </td> </tr> <tr> <td><p><b>Login Details:-</b></p> </td> </tr> <tr> <td><p style="margin: 5px 0px;"><b>User Email:</b> ${data.Email}</p> </td> </tr> <tr> <td><p style="margin: 5px 0px;"><b>Login Paasword:</b> ${data.Password}</p> </td> </tr> <tr> <td><p><b>Note:</b> Please change Your Login Password as per Your Choice. </p> </td> </tr> <tr> <td><p><b>Login Url:</b> <a style="color: #000; text-decoration: none;" href=${Companydata[0].domain_url_https}>${Companydata[0].domain_url_https}</a></p> </td> </tr> </table> </td> </tr> </table> </body> </html>`;



    } catch (error) {
        console.log("Error fetching company information:", error);
        // Handle the error as needed
        throw error;
    }
}

const disclaimer = async () => {
    try {
        const Companydata = await company_information.find();

        if (Companydata.length === 0) {
            throw new Error("No company data found");
        }

        const a1 = `
        <!doctype html>
        <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>${Companydata[0].panel_name} - Disclaimer</title>
            <meta name="description" content="Disclaimer Email Template.">
        </head>
        <body style="margin: 0px; background-color: #f2f3f8;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <!-- Header -->
                        <table width="670px" border="0" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:3px; padding: 30px;">
                            <tr>
                                <td align="center">
                                    <img src="data:image/png;base64,${Companydata[0].logo}" alt="${Companydata[0].panel_name}" style="max-width: 150px;">
                                    <h2>${Companydata[0].panel_name}</h2>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <!-- Body -->
                        <table width="670px" border="0" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px;">
                            <tr>
                                <td>
                                    <h3>Welcome To ${Companydata[0].panel_name}</h3>
                                    <p style="line-height: 25px;">${Companydata[0].disclaimer}</p>
                                    ${Companydata[0].dissArr.map((item) => `<p style="line-height: 25px;">${item.value}</p>`).join('')}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

        return a1;

    } catch (error) {
        console.error("Error fetching company information:", error);
        throw error;
    }
};





module.exports = { firstOptPass, disclaimer };
