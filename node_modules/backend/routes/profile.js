const express = require("express");
const { userModel } = require("../models/user");
const upload = require("../config/multerConfig");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.use(verifyToken);

router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      bannerPic: user.bannerPic?.data 
    ? {
        data: user.bannerPic.data.toString("base64"),
        contentType: user.bannerPic.contentType,
      }
    : null,
      username: user.username,

      profilePic: user.profilePic?.data
        ? {
            data: user.profilePic.data.toString("base64"),
            contentType: user.profilePic.contentType,
          }
        : null,
      about: user.about,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post(
  "/edit",
  upload.fields([{ name: "profilePic" }, { name: "bannerPic" }]),
  async (req, res) => {
    try {
      const { name, username, about } = req.body;
      const updateData = { name, username, about };

      if (req.files?.profilePic) {
        updateData.profilePic = {
          data: req.files.profilePic[0].buffer,
          contentType: req.files.profilePic[0].mimetype,
        };
      }

      if (req.files?.bannerPic) {
        updateData.bannerPic = {
          data: req.files.bannerPic[0].buffer,
          contentType: req.files.bannerPic[0].mimetype,
        };
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Profile update failed",
        error: err.message,
      });
    }
  }
);
module.exports = router;
