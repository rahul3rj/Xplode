const mongoose = require("mongoose");

const SearchGameSchema = new mongoose.Schema({
  steam_appid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },

  // Steam Details (already existing)
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
  portrait_image: [{ type: String, default: "/default-game-cover.jpg" }],
  hero_image: [
    {
      url: { type: String },
      thumb: { type: String },
    },
  ],
  screenshots: [
    {
      id: { type: String },
      path_thumbnail: { type: String },
    },
  ],

  // --- NEW FIELDS FROM STEAM API ---
  short_description: { type: String, default: "" },
  detailed_description: { type: String, default: "" },
  is_free: { type: Boolean, default: false },
  required_age: { type: Number, default: 0 },
  controller_support: { type: String, default: "" },
  developers: { type: [String], default: [] },
  publishers: { type: [String], default: [] },
  price_overview: { type: Object, default: {} },
  recommendations: { type: Object, default: {} },
  achievements: { type: Object, default: {} },
  ratings: { type: Object, default: {} },
  support_info: { type: Object, default: {} },
  content_descriptors: { type: Object, default: {} },
  categories: { type: Array, default: [] },
  movies: { type: Array, default: [] },
  dlc: { type: Array, default: [] },
  packages: { type: Array, default: [] },
  package_groups: { type: Array, default: [] },
  type: { type: String, default: "game" },

  // --- System Requirements ---
  pc_requirements: { type: Object, default: {} },
  mac_requirements: { type: Array, default: [] },
  linux_requirements: { type: Array, default: [] },

  // Misc
  category: { type: String, default: "" },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SearchGame", SearchGameSchema);
