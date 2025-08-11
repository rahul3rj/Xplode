const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();

const getOtpEmailTemplate = (otpCode) => {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1f0033, #000000); color: #fff; padding: 40px; border-radius: 16px; max-width: 550px; margin: auto; text-align: center; box-shadow: 0 0 40px #A641FF80;">
  <h1 style="color: #D85FFF; letter-spacing: 3px; font-size: 32px;">XPLODE</h1>
  <p style="font-size: 18px; color: #CCCCCC;">Your one-time password (OTP) for login:</p>

  <div style="background: #0F001F; padding: 20px 30px; border-radius: 12px; border: 2px dashed #A641FF; margin: 30px 0; display: inline-block;">
    <span style="font-size: 48px; font-weight: bold; color: #D85FFF; letter-spacing: 8px;">${otpCode}</span>
  </div>

  <p style="font-size: 15px; color: #888;">This OTP is valid for <strong style="color: #fff;">5 minutes</strong>. Please do not share it with anyone.</p>

  <hr style="margin: 30px auto; border: none; height: 1px; background: linear-gradient(to right, transparent, #A641FF, transparent);" />

  <p style="font-size: 13px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
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