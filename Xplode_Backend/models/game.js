const mongoose = require('mongoose');

const HomeGameSchema = new mongoose.Schema({
  appid: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  portraitUrl: { 
    type: String, 
    required: true, // Make portraitUrl mandatory
    validate: {
      validator: function(v) {
        return v !== null && v !== undefined;
      },
      message: 'Portrait URL cannot be null'
    }
  },
  header_image: { type: String },
  price: { type: String },
  genres: { type: [String] },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeGames', HomeGameSchema);