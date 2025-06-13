const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: `"IX Engineering Login" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "Your One-Time Password (OTP) for Login",
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>IX Engineering Login</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #A100FF;">${otp}</p>
          <p>This OTP is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br>
          <p>Thank you,</p>
          <p><strong>The IX Engineering Team</strong></p>
        </div>
      `,
        });
        console.log(`OTP email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending OTP email to ${to}:`, error);
        throw new Error("Could not send OTP email.");
    }
};

module.exports = { sendOtpEmail };