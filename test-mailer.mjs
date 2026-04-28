import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sendEmail = async () => {
  console.log("Attempting to send email with:", process.env.SMTP_EMAIL);
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"iSoftware Lab Academy" <${process.env.SMTP_EMAIL}>`,
    to: "sirzanchaudhary143@gmail.com", // Send to a known email to test
    subject: "Test Email from Node Script",
    html: "<p>This is a test email.</p>",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

sendEmail();
