const nodemailer = require("nodemailer");

//fungsi mengirim otp ke email menggunakan nodemailer
async function sendOtpToEmail(email, otp) {
  // Set up Nodemailer transport
  let transporter = nodemailer.createTransport({
    service: "gmail", // or any other email service provider
    auth: {
      user: process.env.EMAIL_ADDRESS, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password (use app-specific passwords if required)
    },
  });

  // Set up email options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Rusunami The Jarrdin Cihampelas : Kode OTP",
    text: `Kode OTP anda adalah : ${otp}. Silakan gunakan untuk menyelesaikan login Anda.`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Could not send OTP. Please try again.");
  }
}

module.exports = { sendOtpToEmail };
