const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  steam_appid: {
    type: Number,
    required: true,
    index: true,
  },
  gameName: {
    type: String,
    default: "",
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  body: {
    type: String,
    default: "",
    trim: true,
    maxlength: 10000,
  },
  media: {
    type: String,
    default: null,
  },
  mediaType: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    default: null,
    trim: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  comments: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      author: {
        type: String,
        default: "User",
      },
      authorPic: {
        type: Object,
        default: null,
      },
      body: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CommunityPostSchema.index({ steam_appid: 1, createdAt: -1 });
CommunityPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
