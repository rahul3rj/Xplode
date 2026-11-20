const express = require("express");
const mongoose = require("mongoose");
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
      _id: user._id,
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
      favHomies: user.favHomies || [],
      friendsCount: user.friends?.length || 0,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ——— Get current user's favorite homies ———
router.get("/homies", async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("favHomies");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.favHomies || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch homies", error: err.message });
  }
});

// ——— Toggle favorite homie for authenticated user ———
router.post("/homies/toggle", async (req, res) => {
  try {
    const { id, creator, platform, avatarUrl, channel, videoId, game, title } = req.body;
    if (!id || !creator) {
      return res.status(400).json({ message: "id and creator are required" });
    }

    const userId = req.user.id;
    const user = await userModel.findById(userId).select("favHomies");
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = (user.favHomies || []).some((h) => h.id === id);

    let updatedUser;
    let isFavorite = false;

    if (exists) {
      // Atomically remove from MongoDB
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { favHomies: { id } } },
        { new: true }
      ).select("favHomies");
      isFavorite = false;
    } else {
      // Atomically add to MongoDB
      const newHomie = {
        id,
        creator,
        platform: platform || "youtube",
        avatarUrl: avatarUrl || "",
        channel: channel || "",
        videoId: videoId || "",
        game: game || "",
        title: title || "",
        addedAt: new Date(),
      };
      updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { favHomies: newHomie } },
        { new: true }
      ).select("favHomies");
      isFavorite = true;
    }

    res.status(200).json({
      success: true,
      isFavorite,
      favHomies: updatedUser?.favHomies || [],
    });
  } catch (err) {
    console.error("Toggle fav homie error:", err.message);
    res.status(500).json({ message: "Failed to toggle favorite homie", error: err.message });
  }
});

// ——— View another user's public profile ———
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let targetUser;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      targetUser = await userModel.findById(userId).select("-password");
    } else {
      targetUser = await userModel.findOne({ username: userId }).select("-password");
    }

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: targetUser._id,
      name: targetUser.name,
      username: targetUser.username,
      about: targetUser.about,
      profilePic: targetUser.profilePic?.data
        ? {
            data: targetUser.profilePic.data.toString("base64"),
            contentType: targetUser.profilePic.contentType,
          }
        : null,
      bannerPic: targetUser.bannerPic?.data
        ? {
            data: targetUser.bannerPic.data.toString("base64"),
            contentType: targetUser.bannerPic.contentType,
          }
        : null,
      favHomies: targetUser.favHomies || [],
      friendsCount: targetUser.friends?.length || 0,
      isSelf: req.user?.id === targetUser._id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user profile", error: err.message });
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
