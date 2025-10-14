const express = require("express");
const router = express.Router();
const { userModel, validateUser } = require("../models/user");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { transporter, getOtpEmailTemplate } = require("../config/nodemailer");
const bcrypt = require("bcrypt");


router.post("/login", async (req, res) => {
  const {email , password} = req.body;
  try{
    if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required!",
    });
  }
  const user = await userModel.findOne({ email })
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
  const token = jwt.sign({id: user._id, email: user.email ,name: user.name}, process.env.JWT_KEY, { expiresIn: "1h" });
  res.json({ success: true, token });
}
catch(err){
  console.error(err);
  res.status(500).json({ success: false,   message: "Invalid Credentials" });
}
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required!" });
  }

  const otpCode = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    const existingUser = await userModel.findOne({email})
    if(existingUser){
      console.log(existingUser)
      return res.status(400).json({ success: false, message: "User already registered" });
    }
    await OTP.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const mailOptions = {
      from: `"Xplode" <${process.env.EMAIL}>`,
      to: email,
      subject: "Your OTP for XPLODE Login",
      html: getOtpEmailTemplate(otpCode),
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp, name, password } = req.body;

  try {
    const otpEntry = await OTP.findOne({ email });

    if (!otpEntry || otpEntry.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    let user = await userModel.findOne({ email });

    // ✅ Agar user nahi mila, toh naya user create kar do
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new userModel({ email, name, password: hashedPassword });
      await user.save();
    }

    await OTP.deleteOne({ email });

    const token = jwt.sign({ id: user._id, email: user.email ,name: user.name}, process.env.JWT_KEY, { expiresIn: "1h" });

    res.status(200).json({ success: true, message: "OTP verified and user registered!", token });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ success: false, message: "Invalid Credentials , please try again" });
  }
});


router.post("/register", async (req, res) => {
  const { email , name ,password} = req.body;

  if (!email ||!name || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and name required!",
    });
  }

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered!" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user = new userModel({ email ,name , password:hashedPassword});
    await user.save();


    const token = jwt.sign({ id: user._id, email: user.email ,name: user.name }, process.env.JWT_KEY, { expiresIn: "1h" });


    res.json({
      success: true,
      message: "User registered successfully!",
      token,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully!" });
});

module.exports = router;
