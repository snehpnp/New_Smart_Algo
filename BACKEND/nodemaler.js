const nodemailer = require('nodemailer');

// Email account credentials
const email = 'email-contact@invicontechnology.com';
const password = 'Kul@928997';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: 'mail.invicontechnology.com',
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
        user: email,
        pass: password
    },
});

// Email details
const mailOptions = {
    from: email,
    to: 'snehpnp@gmail.com',
    subject: 'Test Email using Node.js',
    text: 'Hello from Node.js!'
};

// Sending email
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log('Error occurred:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
