const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    media: {
      url:  { type: String, default: null },
      type: { type: String, default: null },  // e.g. "image/png", "video/mp4"
      name: { type: String, default: null },
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }],
  },
  { timestamps: true }
);

// Index for fast message lookup within a conversation
messageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
