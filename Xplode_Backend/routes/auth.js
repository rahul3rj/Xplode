const express = require("express");
const router = express.Router();
const passport = require("passport");
const { userModel } = require("../models/user");
const jwt = require('jsonwebtoken');

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.log("No user found after authentication!");
        return res.redirect("/login");
      }

      // Check if user already exists
      let user = await userModel.findOne({ email: req.user.email });

      if (!user) {
        // Register user if not found
        user = new userModel({
          name: req.user.displayName,
          email: req.user.email,
        });
        await user.save();
      }

      // Use DB user _id for token
      const token = jwt.sign(
        { id: user._id, email: user.email ,name: user.name },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      
      // Redirect to React frontend with token
      res.redirect(`${process.env.CLIENT_ORIGIN}/login?token=${token}` || `http://localhost:5173/login?token=${token}`);
    } catch (err) {
      console.error("Error during Google OAuth:", err);
      res.redirect("/login");
    }
  }
);



router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
