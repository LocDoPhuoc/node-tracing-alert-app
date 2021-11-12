const nodemailer = require("nodemailer");
const config = require("../config");

module.exports = async (email, message, title, type) => {
  //sendEmail
  try {
    // const smtpEndpoint = "smtp.mailtrap.io";
    const smtpEndpoint = "smtp.gmail.com";

    // const port = 2525;
    const port = 587;

    const senderAddress = `${config.NAME} <${config.EMAIL_ADDRESS}>`;

    var toAddress = email;

    const smtpUsername = config.SENDER_USERNAME;

    const smtpPassword = config.SENDER_PASSWORD;

    var subject = title;

    var body_html = `<html>
    <p>${message}</p>
    </html>`;

    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
      tls: {
        ciphers:'SSLv3'
      }
    });

    // Specify the fields in the email.
    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: body_html,
    };

    await transporter.sendMail(mailOptions);

    console.log(`${new Date().toLocaleString()} Send ${type} to ${toAddress}`);

    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Couldn't send email",
    };
  }
};
