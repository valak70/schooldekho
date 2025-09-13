const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

async function getTransporter() {
  const { token } = await oauth2Client.getAccessToken();
  if (!token) throw new Error("Failed to fetch access token.");

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: token,
    },
  });
}

async function sendEmail(to, subject, html) {
  const transporter = await getTransporter();
  await transporter.sendMail({
    from: `"SchoolDekho" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

exports.sendOtpEmail = async (to, otp) => {
  const html = `
    <p>Hello,</p>
    <p>Your OTP for email verification is:</p>
    <h2 style="color: blue; letter-spacing: 2px;">${otp}</h2>
    <p>This OTP is valid for <b>10 minutes</b>.</p>
    <p>If you didn’t request this, please ignore this email.</p>
    <p>- The SchoolDekho Team</p>
  `;
  return sendEmail(to, "Your OTP for verification", html);
};
