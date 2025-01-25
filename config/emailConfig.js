import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // SMTP host
  port: parseInt(process.env.EMAIL_PORT, 10), // SMTP port
  secure: process.env.EMAIL_PORT === "465", // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
  tls: {
    rejectUnauthorized: true, // Ensures secure connection
    minVersion: "TLSv1.2", // Use at least TLS 1.2
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error.message);
  } else {
    console.log("SMTP Server Ready");
  }
});

export default transporter;
