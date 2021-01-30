// const { PromiseProvider } = require("mongoose");
// const nodemailer = require("nodemailer");

// const sendEmail = (options) => {
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },

//     // Activate in gmail "less secure app" option
//   });

//   //   2) Define the email options
//   const mailOptions = {
//     from: "Cake Shop<ram>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   //   3) Actually send the email
//   transporter.sendMail(mailOptions);
// };


const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API);
const sendEmail = (options) => {
  const message = {
    to: options.email,
    from: "balaji@handwtech.com",
    subject: options.subject,
    text: options.message,
    html: options.message,
  };
  
  sgMail
  .send(message)
  .then((response) => console.log("Mail sent sucess fully"))
  .catch((error) => console.log(error.msg));
};

module.exports = sendEmail;