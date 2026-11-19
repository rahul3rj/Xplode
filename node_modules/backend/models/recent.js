const mongoose = require("mongoose");

const recentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    gameId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    publishers: { type: String, default: "No publishers available" },
    salePrice: { type: Number },
    normalPrice: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("recent", recentSchema);
