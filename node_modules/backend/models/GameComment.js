const mongoose = require("mongoose");

const GameCommentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  steam_appid: { type: Number, required: true },
  comment: { type: String, default: "", trim: true, maxlength: 1000 },
  rating: { type: Number, min: 1, max: 5, default: 5, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  is_edited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// One review per user per game (for atomic upsert)
GameCommentSchema.index({ user_id: 1, steam_appid: 1 }, { unique: true });
GameCommentSchema.index({ steam_appid: 1, createdAt: -1 });

module.exports = mongoose.model("GameComment", GameCommentSchema);
