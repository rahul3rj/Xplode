const mongoose = require('mongoose');

const HomeGameSchema = new mongoose.Schema({
  rawgId: { type: Number },
  steam_appid: { type: Number, required: true },
  name: { type: String, required: true },

  // Steam Details
  description: { type: String, default: "No description available" },
  release_date: { type: String, default: "Unknown" },
  price: { type: String, default: "Free" },
  platforms: { type: Object, default: {} },
  genres: { type: [String], default: ["No genre"] },
  header_image: { type: String, default: "/default-game-cover.jpg" },
  background: { type: String, default: "/default-game-cover.jpg" },
  background_raw: { type: String, default: "/default-game-cover.jpg" },
  capsule_image: { type: String, default: "/default-game-cover.jpg" },
  supported_languages: { type: String, default: "Unknown" },
  website: { type: String, default: "No website available" },
  about_the_game: { type: String, default: "No details available" },

  // SteamGrid Image
  portrait_image: { type: String, default: "/default-game-cover.jpg" },

  // Misc
  category: {
    type: String,
    enum: ["special", "popular", "new", "coming", "trending", "top_games", "top_records"],
    required: true
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeGame', HomeGameSchema);
