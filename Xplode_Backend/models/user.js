const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      minlength: 6,
    },
    profilePic: {
      data: { type: Buffer, default: null }, // ✅ Binary data with default null
      contentType: { type: String, default: null }, // ✅ Image type with default null
    },
    bannerPic: {
      data: { type: Buffer, default: null }, // ✅ Binary data with default null
      contentType: { type: String, default: null }, // ✅ Image type with default null
    },
    phone: {
      type: Number,
      match: /^[0-9]{10}$/,
    },
    vault: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "vault",
    }],
    recent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "recent",
    }],
    username:{
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    about: {
      type: String,
      
    },
    
  },
  { timestamps: true }
);

module.exports = {
  userModel: mongoose.model("user", userSchema),
};
