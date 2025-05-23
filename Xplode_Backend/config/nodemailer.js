const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();

const getOtpEmailTemplate = (otpCode) => {
  return `
    <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 40px; border-radius: 12px; max-width: 500px; margin: auto; text-align: center; box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);">
      <h1 style="color: #00ffff; letter-spacing: 2px;">XPLODE</h1>
      <p>Your one-time password (OTP) for login:</p>
      <div style="background: #334155; padding: 20px; border-radius: 8px; border: 1px solid #00ffff; margin: 20px 0;">
        <span style="font-size: 48px; font-weight: bold; color: #00ffff; letter-spacing: 5px;">${otpCode}</span>
      </div>
      <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
      <footer style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</footer>
    </div>
  `;
};


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Secure SSL port (instead of 587)
  secure: false, // SSL enable kar raha hai
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

module.exports = {transporter , getOtpEmailTemplate};