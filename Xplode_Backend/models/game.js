const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, default: 'No summary available' },
  salePrice: { type: Number },
  normalPrice: { type: Number },
  thumb: { type: String },
  cover: { type: String },
  genres: [{ type: String }],
  releaseDate: { type: String, default: 'Unknown' },
  storeID: { type: String },
  isOnSale: { type: Boolean, default: false },
  savings: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('game', gameSchema);
