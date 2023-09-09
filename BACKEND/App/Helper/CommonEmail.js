var nodemailer = require('nodemailer');

const db = require('../Models');
const User = db.user;

const CommonEmail = (toEmail, subjectEmail, htmlEmail, textEmail, res) => {
    var id = 1;
    try {

        var companyDetails = result[0]
        const transport = nodemailer.createTransport({
            type: "smtp",
            host: companyDetails.smtphost,
            port: companyDetails.smtpport,
            // ignoreTLS: false,
            secure: true,
            // secure: false,
            // requireTLS: true,
            auth: {
                user: companyDetails.email,
                pass: companyDetails.smtp_password
            },
            secureConnection: true

        });
        var mailOptions = {
            from: companyDetails.email,
            to: toEmail,
            subject: subjectEmail,
            cc: companyDetails.cc_mail,
            bcc: companyDetails.bcc_mail,
            text: textEmail,
            html: htmlEmail

        };


        console.log("CheckEail")
        transport.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
        transport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.send({ status: 'Failed!!!' })
            } else {
                console.log("Email has been sent", info.response);
                return res.send({ status: 'success', msg: "Mail send successfully" })
            }
        });


    } catch (error) {

        console.log("Error In Email File :", error);
    }

}





module.exports = { CommonEmail }
