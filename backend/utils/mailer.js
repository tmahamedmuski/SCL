import nodemailer from 'nodemailer';

export const sendOTPEmail = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Simal Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Your OTP Code for Password Reset',
      text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP code is: <b>${otp}</b>. It is valid for 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
