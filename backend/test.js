// var axios = require('axios');



// const jKey = user_info[0].access_token

// const postData = {
//   uid: user_info[0].demat_userid,
//   actid: user_info[0].demat_userid,
//   norenordno:req.body.order_id,
//   exch:"NFO" 
// };

// let data = JSON.stringify(postData);

// let payload = "jData=" + data;
// payload = payload + `&jKey=${jKey}`;

// var config = {
//   method: "post",
//   maxBodyLength: Infinity,

//   // url: "https://api.shoonya.com/NorenWClientTP/SingleOrdStatus",
//   url: "https://api.shoonya.com/NorenWClientTP/OrderBook",

//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
//   data: payload,
// };

// axios(config)
// .then(async (response) => {
// console.log(response.data)
// })
// .catch((error) => {
//   return res.send({
//     status: false,
//     msg: "error in Server side",
//     data: error,
//   });
// });


const nodemailer = require('nodemailer');

// Create the transporter using SMTP details
let transporter = nodemailer.createTransport({
    host: 'mail.nextalgo.net',
    port: 465, // Port for secure connection
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@nextalgo.net', // Your email address
        pass: 'yourpassword', // Your email password
    },
});

// Define the email options
let mailOptions = {
    from: '"NextAlgo Support" <info@nextalgo.net>', // Sender address
    to: 'snehpnp@gmail.com', // List of recipients
    subject: 'Test Email from NextAlgo', // Subject line
    text: 'Hello! This is a test email from NextAlgo.', // Plain text body
    html: '<b>Hello!</b><br>This is a test email from NextAlgo.', // HTML body content
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error:', error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});
