const mongoose = require("mongoose");

const GameCommentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  steam_appid: { type: Number, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  is_edited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GameComment", GameCommentSchema);