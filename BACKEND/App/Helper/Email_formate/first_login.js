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
        const companyData = await company_information.find();

        if (companyData.length === 0) {
            throw new Error("No company data found");
        }


        let emailTemplate;

        if (companyData[0].disclaimer) {
            emailTemplate = `
                <!doctype html>
                <html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>${companyData[0].panel_name} - Disclaimer</title>
                    <meta name="description" content="Disclaimer Email Template.">
                </head>
                <body style="margin: 0px; background-color: #f2f3f8;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table width="670px" border="0" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:3px; padding: 30px;">
                                    <tr>
                                        <td align="center">
                                            <img src="data:image/png;base64,${companyData[0].logo}" alt="${companyData[0].panel_name}" style="max-width: 150px;">
                                            <h2>${companyData[0].panel_name}</h2>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table width="670px" border="0" cellspacing="0" cellpadding="0" style="background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px;">
                                    <tr>
                                        <td>
                                            <h3>Welcome To ${companyData[0].panel_name}</h3>
                                            <p style="line-height: 25px;">${companyData[0].disclaimer}</p>
                                            ${companyData[0].dissArr.map(item => `<p style="line-height: 25px;">${item.value}</p>`).join('')}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>`;
        } else {
            emailTemplate = `
                <!doctype html>
                <html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>${companyData[0].panel_name} - Disclaimer</title>
                    <meta name="description" content="Disclaimer Email Template.">
                </head>
                <body style="margin: 0px; background-color: #f2f3f8;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="padding: 20px 0;">
                                <table style="max-width:670px;background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px; margin-top: 50px;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 30px;">${companyData[0].panel_name}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h3>Welcome To ${companyData[0].panel_name}</h3>
                                            <p style="line-height: 25px;">
                                                All subscription fees paid to <b>${companyData[0].panel_name}</b> are Non-refundable. We do not provide trading tips nor are we investment advisers. Our service is solely restricted to automated trading application development, deployment, and maintenance. All algorithms are based on backtested data but we do not provide any guarantee for their performance in the future. The algorithm running in an automated system is agreed upon with the user prior to deployment and we do not take any liability for any loss generated by the same. Past performance of advice/strategy/model does not indicate the future performance of any current or future strategy/model or advice by <b>${companyData[0].panel_name}</b>. Trades and actual returns may differ significantly from those depicted herein due to various factors including but not limited to impact costs, expense charged, timing of entry/exit, timing of additional flows/redemptions, individual client mandates, specific portfolio construction characteristics, etc. There is no assurance or guarantee that the objectives of any strategy/model or advice provided by <b>${companyData[0].panel_name}</b> will be achieved. <b>${companyData[0].panel_name}</b> or any of its partners or principal officers/employees do not assure/give guarantee for any return on the investment in strategies/models/advice given to the Investor. The value of investment can go up/down depending on factors and forces affecting securities markets. <b>${companyData[0].panel_name}</b> or its associates are not liable or responsible for any loss or shortfall arising from operations and affected by the market condition.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>`;
        }

        return emailTemplate;
    } catch (error) {
        console.error("Error fetching company information:", error);
        throw error;
    }
};






module.exports = { firstOptPass, disclaimer };
