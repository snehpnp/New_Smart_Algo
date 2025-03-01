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
  console.log("Sending invoice to " + toEmail)
 

const Userdata = await User.find({ Email: toEmail });


    const email = Userdata[0].Email;
    const amount = Userdata[0].Serivcecharge;
    const received = Userdata[0].Received;
    const pending = amount - received;
    const clientName = Userdata[0].FullName;
    const invoiceNumber = Math.floor(100000 + Math.random() * 900000);




  // Generate HTML content for the invoice
  const invoiceHTML = `
 <!DOCTYPE html>
<html>
<head>
    <title>Invoice</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">

    <div style="max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <!-- Logo -->
        <div style="text-align: center;">
            <img src="./image001.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 10px;">
        </div>

        <h2 style="text-align: center; color: #333;">Invoice</h2>

        <hr style="border: 1px solid #ddd;">

        <!-- Invoice Details -->
        <table style="width: 100%; margin-bottom: 15px;">
            <tr>
                <td style="padding: 5px;"><strong>Invoice#:</strong> 52131</td>
                <td style="padding: 5px; text-align: right;"><strong>Date:</strong> 01 / 02 / 2023</td>
            </tr>
        </table>

        <hr style="border: 1px solid #ddd;">

        <!-- Client Details -->
        <h3 style="color: #333;">Bill To:</h3>
        <p><strong>Client Name:</strong> Sneh Jaiswal</p>
        <p><strong>Email:</strong> snehpnp@gmail.com</p>
        <p><strong>Phone:</strong> 7845124589</p>

        <hr style="border: 1px solid #ddd;">

        <!-- Invoice Items -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background: #f4f4f4;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Items</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Amount</th>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Service (Algo Software With One Month Services)</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">₹50,000</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">Received</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd; color: red;">-₹5,000</td>
            </tr>
        </table>

        <!-- Total Pending -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">TOTAL PENDING:</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd; color: red;">₹45,000</td>
            </tr>
        </table>

        <hr style="border: 1px solid #ddd;">

        <!-- Footer Row -->
        <table style="width: 100%; margin-top: 15px;">
            <tr>
                <td style="text-align: left; font-size: 14px;"><strong>Thank you for your business!</strong></td>
                <td style="text-align: right; font-size: 14px;"><strong>PNP INFOTECH</strong></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: right; font-size: 14px;"><strong>Authorized Signed</strong></td>
            </tr>
        </table>

        <!-- Footer -->
        <div style="background: #007bff; padding: 10px; border-radius: 0 0 10px 10px; margin-top: 10px;">
            <p style="margin: 0; font-size: 14px; color: #fff;">
                📧 <a href="mailto:admin@gmail.com" style="color: #fff; text-decoration: none;">admin@gmail.com</a> | 
                🌐 <a href="https://newpenal.pandpinfotech.com/" target="_blank" style="color: #fff; text-decoration: none;">Visit Our Website</a>
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

console.log("Sending invoice to " + page)


    return res.json({ message: "Invoice sent successfully to " + email });
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

    res.json({ message: "Invoice sent successfully to " + email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating or sending invoice." });
  }
};

module.exports = { SendInvoice };
