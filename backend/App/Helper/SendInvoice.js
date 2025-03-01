var nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");

const fs = require("fs");
const path = require("path");

const db = require("../Models");
const User = db.user;
const company_information = db.company_information;

const SendInvoice = async (
  toEmail,

  res
) => {
  var Companydata = await company_information.find();

  const Userdata = await User.find({ Email: toEmail });

  const email = Userdata[0].Email;
  const amount = Userdata[0].Serivcecharge;
  const received = Userdata[0].Received;
  const pending = amount - received;
  const clientName = Userdata[0].FullName;
  const invoiceNumber = Math.floor(100000 + Math.random() * 900000);
  const PhoneNo = Userdata[0].PhoneNo;

  // Generate HTML content for the invoice
  const invoiceHTML = `
 <!DOCTYPE html>
<html>
<head>
    <title>Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">

    <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="text-align: center;">
            <img src=${
              Companydata[0]?.logo
            } alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;">
        </div>

        <h2 style="text-align: center; color: #333;">Invoice</h2>

        <hr style="border: 1px solid #ddd;">

        <table style="width: 100%; margin-bottom: 15px;">
            <tr>
                <td style="padding: 5px;"><strong>Invoice#:</strong> ${invoiceNumber}</td>
                <td style="padding: 5px; text-align: right;"><strong>Date:</strong>${new Date().toLocaleDateString()}</td>
            </tr>
        </table>

        <hr style="border: 1px solid #ddd;">

        <h3 style="color: #333;">Bill To:</h3>
        <p><strong>Client Name:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${PhoneNo}</p>

        <hr style="border: 1px solid #ddd;">

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #f4f4f4;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Items</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Amount</th>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Service (Algo Software With One Month Services)</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₹${amount}</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Received</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd; color: red;">-₹${received}</td>
            </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">TOTAL PENDING:</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd; color: red;">₹${pending}</td>
            </tr>
        </table>

        <hr style="border: 1px solid #ddd;">

        <table style="width: 100%; margin-top: 15px;">
            <tr>
                <td style="text-align: left; font-size: 14px;"><strong>Thank you for your business!</strong></td>
                <td style="text-align: right; font-size: 14px;"><strong>${
                  Companydata[0]?.panel_name
                }</strong></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: right; font-size: 14px;"><strong>Authorized Signed</strong></td>
            </tr>
        </table>

        <div style="background: #007bff; padding: 10px; border-radius: 0 0 10px 10px; margin-top: 10px;">
            <p style="margin: 0; font-size: 14px; color: #fff;">
                📧 <a href="mailto:${
                  Companydata[0]?.email
                }" style="color: #fff; text-decoration: none;">${
    Companydata[0]?.email
  }</a> | 
                🌐 <a href=${
                  Companydata[0]?.domain_url
                } target="_blank" style="color: #fff; text-decoration: none;">Visit Our Website</a>
            </p>
        </div>

    </div>

</body>
</html>`;

  try {
    // Launch Puppeteer to generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHTML);
    const pdfPath = path.join(__dirname, "invoice.pdf");
    await page.pdf({ path: pdfPath, format: "A4" });
    await browser.close();

    console.log("Sending invoice to " + page);

    // Configure Nodemailer for sending email
    var transport = nodemailer.createTransport({
      type: "smtp",
      host: Companydata[0].smtphost,
      port: Companydata[0].smtpport,
      secure: true,
      auth: {
        user: Companydata[0].email,
        pass: Companydata[0].smtp_password,
      },
      secureConnection: true,
    });

    var mailOptions = {
      from: Companydata[0].email,
      to: toEmail,
      subject: "Invoice # " + invoiceNumber,
      cc: Companydata[0].cc_mail,
      bcc: Companydata[0].bcc_mail,
      text: `Dear ${clientName},\n\nPlease find your invoice attached.\n\nBest regards,\nCompany Name`,
      attachments: [{ filename: "invoice.pdf", path: pdfPath }],
    };

    // Send Email with PDF
    await transport.sendMail(mailOptions);



    // Delete the PDF after sending
    fs.unlinkSync(pdfPath);
  } catch (error) {
    console.error(error);
    
  }
};

module.exports = { SendInvoice };
