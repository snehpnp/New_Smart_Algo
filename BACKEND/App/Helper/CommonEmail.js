var nodemailer = require('nodemailer');

const db = require('../Models');
const User = db.user;
const company_information = db.company_information;


const CommonEmail = async(toEmail, subjectEmail, htmlEmail, textEmail, res) => {
    var id = 1;
    try {
        
        var Companydata= await company_information.find()

        if(Companydata){

            var transport = nodemailer.createTransport({
                type: "smtp",
                host: Companydata[0].smtphost,
                port: Companydata[0].smtpport,
                // ignoreTLS: false,
                secure: true,
                // secure: false,
                // requireTLS: true,
                auth: {
                    user: Companydata[0].email,
                    pass: Companydata[0].smtp_password
                },
                secureConnection: true
    
            });
            var mailOptions = {
                from:  Companydata[0].email,
                to: toEmail,
                subject: subjectEmail,
                cc:  Companydata[0].cc_mail,
                bcc:  Companydata[0].bcc_mail,
                text: textEmail,
                html: htmlEmail
    
            };
    

            
            transport.verify(function (error, success) {
                if (error) {
                    console.log("Error ",error);
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
            transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("Error ",err);
                    return res.send({ status: 'Failed!!!' })
                } else {
                    // console.log("Email has been sent", info.response);
                    return res.send({ status: 'success', msg: "Mail send successfully" ,data:info.response })
                }
            });
        }



    } catch (error) {
        console.log("Error In Email File :", error);
    }

}





module.exports = { CommonEmail }
