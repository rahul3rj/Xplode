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
      data: { type: Buffer, default: null },
      contentType: { type: String, default: null },
    },
    bannerPic: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: null },
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
    username: {
      type: String,
      unique: true,
      sparse: true,       // allows multiple nulls while enforcing uniqueness on set values
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,  // alphanumeric + underscores only
    },
    about: {
      type: String,
    },

    // ——— Friend system ———
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }],
    friendRequests: {
      sent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }],
      received: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }],
    },

    // ——— Presence ———
    status: {
      type: String,
      enum: ["online", "offline", "away", "in-game"],
      default: "offline",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index username for fast search
userSchema.index({ username: 1 });

module.exports = {
  userModel: mongoose.model("user", userSchema),
};
