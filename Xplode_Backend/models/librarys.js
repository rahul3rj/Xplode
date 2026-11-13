
const mongoose = require("mongoose");

const LibrarySchema = new mongoose.Schema({
  steam_appid: { type: Number, required: true },
  name: { type: String, required: true },
  portrait_image: [{
      url: { type: String },
      thumb: { type: String },
    },],
  hero_image: {
    url: { type: String },
    thumb: { type: String },
  },
  developers: { type: [String], default: [] },
  publishers: { type: [String], default: [] },
  categories: { type: Array, default: [] },
  movies: { type: Array, default: [] },
  addedAt: { type: Date, default: Date.now },
  // Add user reference to associate games with specific users
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  verified: { type: Boolean, default: false },
});

// Create compound index to ensure each user can only have a game once
LibrarySchema.index({ user: 1, steam_appid: 1 }, { unique: true });

module.exports = mongoose.model("Library", LibrarySchema);