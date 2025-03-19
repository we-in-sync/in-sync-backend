const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   service: "gmail",
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
   auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_APP_PASSWORD,
   },
});

const sendEmail = async (options) => {
   const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
