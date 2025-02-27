const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (email, ticketDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    cc: "venugopal.burli@masaischool.com",
    subject: "Ticket Booking Confirmation",
    text: `Your ticket from ${ticketDetails.from} to ${ticketDetails.to} has been booked.`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendBookingConfirmation;
