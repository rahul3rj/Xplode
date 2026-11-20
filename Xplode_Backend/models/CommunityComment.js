const mongoose = require("mongoose");

const CommunityCommentSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ["post", "review"],
    required: true,
    index: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunityComment",
    default: null,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000,
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
  score: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
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

CommunityCommentSchema.index({ targetId: 1, createdAt: 1 });
CommunityCommentSchema.index({ targetId: 1, parentId: 1 });

module.exports = mongoose.model("CommunityComment", CommunityCommentSchema);
