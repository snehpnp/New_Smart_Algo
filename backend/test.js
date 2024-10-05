var nodemailer = require('nodemailer');




const CommonEmail = async () => {
    var id = 1;
    try {

     

            var transport = nodemailer.createTransport({
                type: "smtp",
                host: "cp-in-16.webhostbox.net",
                port: "465",
                secure: true,
                auth: {
                    user: "info@moneyplatform.co.in",
                    pass: "XS+d4?3OD!!~"
                },
                 tls: {
                rejectUnauthorized: false // Add this option in case of self-signed certificates
            }

            });
            var mailOptions = {
                from: "info@moneyplatform.co.in",
                to: "snehpnp@gmail.com",
                subject: "Test Email",
                cc: "snehpnp@gmail.com",
                bcc: "snehpnp@gmail.com",
                text: "Test Email",
                html: "<h1>Test Email</h1>"

            };



            transport.verify(function (error, success) {
                if (error) {
                    console.log("Error ", error);
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
            transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("Error ", err);
                    // return res.send({ status: 'Failed!!!' })
                } else {
                    console.log("Email has been sent", info.response);
                    // return res.send({ status: 'success', msg: "Mail send successfully", data: info.response })
                }
            });
        



    } catch (error) {
        console.log("Error In Email File :", error);
    }
}


CommonEmail()
