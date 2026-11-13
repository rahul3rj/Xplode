const mongoose = require("mongoose");

const UserLikeDislikeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  steam_appid: { type: Number, required: true },
  reaction: { type: String, enum: ['like', 'dislike'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Composite unique key - ek user ek game pe ek hi reaction de sakta hai
UserLikeDislikeSchema.index({ user_id: 1, steam_appid: 1 }, { unique: true });
module.exports = mongoose.model("UserLikeDislike", UserLikeDislikeSchema);