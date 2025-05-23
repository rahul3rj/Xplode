const express = require("express");
const { userModel } = require("../models/user");
const upload = require("../config/multerConfig");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.use(verifyToken)

router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try{
      const decoded = jwt.verify(token , process.env.JWT_KEY);
      const user = await userModel.findById(decoded.id).select("-password");
      if(!user){
        return res.status(404).json({message : "User not found"});
      }

      res.status(200).json({
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        
        profilePic: user.profilePic?.data
          ? {
              data: user.profilePic.data.toString("base64"),
              contentType: user.profilePic.contentType,
            }
          : null,
      });
    }

  catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});
router.post("/edit", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, username, phone } = req.body;
    const updateData = { name, username, phone };

    if (req.file) {
      updateData.profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
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
      user: {
        name: updatedUser.name,
        username: updatedUser.username, // ✅ Username response me add kiya
        phone: updatedUser.phone, // ✅ Phone response me add kiya
        profilePic: updatedUser.profilePic?.data
          ? {
              data: updatedUser.profilePic.data.toString("base64"),
              contentType: updatedUser.profilePic.contentType,
            }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Profile update failed", error: err.message });
  }
});
module.exports = router;
