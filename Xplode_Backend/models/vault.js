const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        gameId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        thumb: { type: String },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("vault", vaultSchema);
