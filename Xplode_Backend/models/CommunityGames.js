const mongoose = require('mongoose');

const communityGameSchema = new mongoose.Schema({
  steam_appid: { type: Number, required: true },
  title: { type: String, required: true },
  logo: { type: String },
  image: { type: String },
  description: { type: String },
  plays: { type: String },
  rating: { type: String },
  live: { type: String },
  tags: [{ type: String }],
  platform: [{ type: String }],
  category: { type: String, default: 'community' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityGame', communityGameSchema);