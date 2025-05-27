const mongoose = require('mongoose');

const HomeGameSchema = new mongoose.Schema({
  appid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  portraitUrl: { type: String },
  header_image: { type: String },
  price: { type: String },
  genres: { type: [String] },

  // NEW FIELDS from Steam API 👇
  description: { type: String },
  release_date: { type: String },
  platforms: {
    type: Object,
    default: {}
  },
  supported_languages: { type: String },
  website: { type: String },
  about_the_game: { type: String },
  pc_requirements: {
    type: Object,
    default: {}
  },
  mac_requirements: {
    type: Object,
    default: {}
  },

  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeGame', HomeGameSchema);
