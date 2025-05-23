var GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userModel } = require("../models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },

    async function (accessToken, refreshToken, profile, cb) {
      try {
        
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new userModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos?.[0]?.value || "",
            username: profile.emails[0].value.split("@")[0], // ✅ Auto-generate username
            phone: "", // ✅ Default empty phone
          });

          await user.save();
        }

        cb(null, user);
      } catch (err) {
        cb(err, false);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  return cb(null, user._id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    let user = await userModel.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

module.exports = passport;
