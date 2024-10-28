const db = require('../../Models');
const User = db.user;
const company_information = db.company_information;


var firstOptPass = async (data) => {
  try {
    var Companydata = await company_information.find();
    
    if (Companydata[0].panel_name == "darixosolution") {
      return `<!doctype html>
              <html lang="en-US">
              <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Password Reset Confirmation</title>
                <meta name="description" content="Password Reset Email Template." />
              </head>
              <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <table>
                  <tr>
                    <td>
                      <table style="max-width:670px;background:#fff; border-radius:3px; -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px; margin-top: 50px;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom: 30px;">
                            DARIXO SOLUTION
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Dear ${data.FullName},</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="line-height: 25px;">
                              We appreciate your selection of DARIXO SOLUTION for the Algo Platform (API BRIDGE PLATFORM). This message is to notify you that the password for your Algo Platform has been reset. Below are the updated login details:
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="margin: 5px 0px;"><b>Software Details:</b> ${data.user_type}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>Login Details:</b></p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="margin: 5px 0px;"><b>User Email:</b> ${data.Email}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p style="margin: 5px 0px;"><b>Login Password:</b> ${data.Password}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>Note:</b> Please change Your Login Password as per Your Choice.</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>Login Url:</b> <a style="color: #000; text-decoration: none;" href="${Companydata[0].domain_url_https}">${Companydata[0].domain_url_https}</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>INSTRUCTIONS ON USING THE SOFTWARE AND TRAINING:</b></p>
                          </td>
                        </tr>
                        <!-- Add your instructions here -->
                        <tr>
                          <td>
                            <p>Log in precisely at 09:00 AM.</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>The on and off buttons are solely accessible on the client panel for your convenience.</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Exit and close positions upon achieving a small profit.</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Avoid engaging in manual trading.</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Keep your login ID and password confidential.</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Before commencing the use of the software, please take note of the following:</p>
                          </td>
                        </tr>
                        <!-- End of instructions -->
                        <tr>
                          <td>
                            <p>For further details, please refer to our terms and conditions, disclaimer, and privacy policy:</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>Terms & Conditions:</b> <a href="https://darixosolution.com/terms.php">https://darixosolution.com/terms.php</a></p>
                            <p><b>Refund Policy & Disclaimer:</b> <a href="https://darixosolution.com/disclaimer.php">https://darixosolution.com/disclaimer.php</a></p>
                            <p><b>Privacy Policy:</b> <a href="https://darixosolution.com/privacy.php">https://darixosolution.com/privacy.php</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><i>सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं और इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा। यह परिणाम केवल आज के लिए मान्य है।</i></p>
                            <p><i>THIS RESULTS IS VALID FOR TODAY ONLY; WE DO NOT DIRECTLY OR INDIRECTLY MAKE ANY REFERENCE TO THE PAST OR EXPECTED FUTURE RETURN/PERFORMANCE OF THE ALGORITHM.</i></p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>Disclaimer:</b></p>
                            <p>"We do not offer advice, nor do we function as investment advisors. All fees paid for subscriptions to Darixo Solution are non-refundable. Please refrain from sharing your ID and Password with any representative; we cannot be held responsible for any losses or gains. Avoid discussing financial details through chat apps like WhatsApp and refer to the website for all rights reserved information. Kindly note that we exclusively provide software services as a company."</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p><b>किसी व्यक्ति विशेष कार्यकारिणी सदस्य द्वारा बोली गई बातें लॉगिन करने से पहले हमारी वेबसाइट से पढ़ और समझ ले अन्यथा कंपनी द्वारा किसी भी वर्तलाप व्हाट्सएप चैट एसएमएस की जिम्मेदारी नहीं ली जावेगी (कंपनी द्वारा जनहित जारी)"</b></p>
                            <p>Read and understand the things spoken by any particular executive member from our website before login; otherwise, the company will not take responsibility for any WhatsApp chat SMS (public interest issued by the company).</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>`;
    } else if (Companydata[0].panel_name == "INSPIRE ALGO") {
      return `<!DOCTYPE html>
              <html lang="en-US">
              <head>
                <meta charset="UTF-8">
                <title>Password Reset Confirmation</title>
                <meta name="description" content="Password Reset Email Template.">
              </head>
              <body style="margin: 0; background-color: #f2f3f8;">
                <table style="max-width: 670px; background: #fff; border-radius: 3px; box-shadow: 0 6px 18px 0 rgba(0, 0, 0, .06); margin: 50px auto; padding: 30px;">
                  <tr>
                    <td>
                      <p style="font-size: 24px; font-weight: bold; padding-bottom: 30px;">INSPIRE ALGO COMPANY</p>
                      <p>Dear ${data.FullName},</p>
                      <p>We appreciate your selection of INSPIRE ALGO COMPANY for the Algo Platform (API BRIDGE PLATFORM). This message is to notify you that the password for your Algo Platform has been reset. Below are the updated login details:</p>
                      <p><b>Login Details:</b></p>
                      <p><b>User Email: </b> ${data.Email}</p>
                      <p><b>Login Password:</b> ${data.Password}</p>
                      <p><b>Note:</b> Please change your login password as per your choice.</p>
                      <p><b>Login URL:</b> <a href="https://software.inspirealgo.com/#/login" style="color: #000; text-decoration: none;">https://software.inspirealgo.com/#/login</a></p>
                      <p><b>HOW TO WORK WITH SOFTWARE & GET TRAINING:</b></p>
                      <ul>
                        <li>Login sharp at 09:00 AM.</li>
                        <li>The on and off buttons are only accessible on the client panel.</li>
                        <li>If you achieve a small profit, exit and close positions live.</li>
                        <li>Avoid manual trading.</li>
                        <li>Keep your ID and password strictly confidential.</li>
                      </ul>
                      <p>Before using the software, please read and understand:</p>
                      <ul>
                        <li><b>DASHBOARD:</b> Update strategy, quantity, reports, counter selection.</li>
                        <li><b>SIGNALS:</b> Check signals in the panel.</li>
                        <li><b>STRATEGY:</b> Each strategy can be used only once.</li>
                        <li><b>SERVICES:</b> Access all necessary information.</li>
                        <li><b>REPORTS:</b> Get detailed software signal reports regularly.</li>
                        <li><b>TRADE HISTORY:</b> Shows daily performance, subject to variations.</li>
                        <li><b>TRADING STATUS:</b> Provides daily on and off details.</li>
                        <li><b>MESSAGE BROADCAST:</b> Helps in setting exit mechanisms.</li>
                        <li><b>HELP CENTER:</b> Support team available via webpage.</li>
                        <li><b>BROKER RESPONSE:</b> Check connectivity and order status.</li>
                      </ul>
                      <p><b>Disclaimer:</b></p>
                      <p>All subscription fees paid to INSPIRE ALGO COMPANY are nonrefundable. We do not provide trading tips or act as investment advisers. Our service is limited to automated trading application development, deployment, and maintenance.</p>
                      <p>For further details, please refer to our terms and conditions, refund policy, and privacy policy:</p>
                      <ul>
                        <li><a href="https://inspirealgo.com/terms_and_condition">Terms & Conditions</a></li>
                        <li><a href="https://inspirealgo.com/refund_policy">Refund Policy</a></li>
                        <li><a href="https://inspirealgo.com/privacy_policy">Privacy Policy</a></li>
                      </ul>
                      <p>सभी प्रतिभूतियां एल्गो ट्रेडिंग सिस्टम बाजार जोखिमों के अधीन हैं और इस बात का कोई आश्वासन नहीं दिया जा सकता है कि उपयोगकर्ता के उद्देश्यों को आज के प्रदर्शन के आधार पर प्राप्त किया जाएगा।</p>
                      <p><i>THIS RESULT IS VALID FOR TODAY ONLY; WE DO NOT DIRECTLY OR INDIRECTLY MAKE ANY REFERENCE TO THE PAST OR EXPECTED FUTURE RETURN/PERFORMANCE OF THE ALGORITHM.</i></p>
                      <p>किसी व्यक्ति विशेष कार्यकारिणी सदस्य द्वारा बोली गई बातें लॉगिन करने से पहले हमारी वेबसाइट से पढ़ और समझ ले अन्यथा कंपनी द्वारा किसी भी वर्तलाप व्हाट्सएप चैट एसएमएस की जिम्मेदारी नहीं ली जावेगी (कंपनी द्वारा जनहित जारी).</p>
                      <p>Read and understand the things spoken by any particular executive member from our website before login; otherwise, the company will not take responsibility for any WhatsApp chat SMS (public interest issued by the company).</p>
                    </td>
                  </tr>
                </table>
              </body>
              </html>`;
    } else {
      return `<!doctype html> <html lang="en-US"> <head> <meta content="text/html; charset=utf-8" http-equiv="Content-Type" /> <title>PDF</title> <meta name="description" content="Reset Password Email Template."> </head> <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><table> <tr> <td> <table style="max-width:670px;background:#fff; border-radius:3px;  -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); padding: 30px; margin-top: 50px;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"> <tr> <td style="padding-bottom: 30px;"> ${Companydata[0].panel_name} </td> </tr> <tr> <td> <p>Dear ${data.FullName}</p> </td> </tr> <tr> <td><p style="line-height: 25px;">Thank You for choosing <b>${Companydata[0].panel_name}</b> for Algo Platform, We are pleased to inform that the password of your Algo Platform has been resetted as per details below:</p> </td> </tr> <tr> <td><p style="margin: 5px 0px;"><b>Software Details:</b> ${data.user_type}</p> </td> </tr> <tr> <td><p><b>Login Details:-</b></p> </td> </tr> <tr> <td><p style="margin: 5px 0px;"><b>User Email:</b> ${data.Email}</p> </td> </tr> <tr> <td><p style="margin: 5px 0px;"><b>Login Paasword:</b> ${data.Password}</p> </td> </tr> <tr> <td><p><b>Note:</b> Please change Your Login Password as per Your Choice. </p> </td> </tr> <tr> <td><p><b>Login Url:</b> <a style="color: #000; text-decoration: none;" href=${Companydata[0].domain_url_https}>${Companydata[0].domain_url_https}</a></p> </td> </tr> </table> </td> </tr> </table> </body> </html>`;
    }




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

    if (companyData[0].disclaimer_status == 1) {
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
   console.log("Error fetching company information:", error);
    throw error;
  }
};






module.exports = { firstOptPass, disclaimer };
