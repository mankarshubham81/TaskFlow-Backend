import transporter from "../config/emailConfig.js";
import EmailVerificationModel from "../models/EmailVerification.js";
const sendEmailVerificationOTP = async (req, user) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000); // More secure than Math.random()
    
  // Save OTP in Database
  await new EmailVerificationModel({ userId: user._id, otp: otp }).save();


  //  OTP Verification Link
  const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

  const verificationUrl = new URL(`${process.env.FRONTEND_HOST}/verify-email`);
    verificationUrl.searchParams.set('userId', user._id);
    verificationUrl.searchParams.set('otp', otp);

    const mailOptions = {
      from: `"TaskFlow Support" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Verify Your TaskFlow Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to TaskFlow, ${user.name}!</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p style="margin-top: 2rem; color: #6b7280;">
            This code expires in 15 minutes. If you didn't request this, please 
            <a href="mailto:support@taskflow.com">contact our support team</a>.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return otp

  } catch (error) {
    console.error(`Email Error [${user.email}]:`, error);
    throw new Error('Failed to send verification email');
  }
};

export default sendEmailVerificationOTP