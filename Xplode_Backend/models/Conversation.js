const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }],
    lastMessage: {
      text: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      timestamp: { type: Date, default: Date.now },
    },
    kind: {
      type: String,
      enum: ["dm", "group"],
      default: "dm",
    },
    groupName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for fast lookup of a user's conversations
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
