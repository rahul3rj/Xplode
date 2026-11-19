const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { userModel } = require("../models/user");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

// ——— Get or create a DM conversation with a user ———
router.post("/conversation/:userId", async (req, res) => {
  const myId = req.user.id;
  const { userId } = req.params;

  try {
    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      kind: "dm",
      participants: { $all: [myId, userId], $size: 2 },
    });

    if (!conversation) {
      // Verify the other user exists and is a friend
      const me = await userModel.findById(myId).lean();
      if (!me.friends?.some((id) => id.toString() === userId)) {
        return res.status(403).json({ message: "You can only chat with friends" });
      }

      conversation = new Conversation({
        participants: [myId, userId],
        kind: "dm",
      });
      await conversation.save();
    }

    // Populate participant info
    const populated = await Conversation.findById(conversation._id)
      .populate("participants", "name username profilePic status lastSeen")
      .lean();

    // Map participant profilePics
    populated.participants = populated.participants.map((p) => ({
      ...p,
      profilePic: p.profilePic?.data
        ? { data: p.profilePic.data.toString("base64"), contentType: p.profilePic.contentType }
        : null,
    }));

    res.json(populated);
  } catch (err) {
    console.error("Get/create conversation error:", err.message);
    res.status(500).json({ message: "Failed to get conversation" });
  }
});

// ——— Get all conversations for the current user ———
router.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "name username profilePic status lastSeen")
      .sort({ updatedAt: -1 })
      .lean();

    // Map profilePics for each participant
    const mapped = conversations.map((conv) => ({
      ...conv,
      participants: conv.participants.map((p) => ({
        ...p,
        profilePic: p.profilePic?.data
          ? { data: p.profilePic.data.toString("base64"), contentType: p.profilePic.contentType }
          : null,
      })),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Get conversations error:", err.message);
    res.status(500).json({ message: "Failed to get conversations" });
  }
});

// ——— Get messages for a conversation ———
router.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const before = req.query.before; // cursor-based pagination

  try {
    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    if (!conversation.participants.some((id) => id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Not a participant" });
    }

    const query = { conversation: conversationId };
    if (before) query.createdAt = { $lt: new Date(before) };

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("sender", "name username")
      .lean();

    // Mark messages as read
    const unreadIds = messages
      .filter((m) => !m.readBy?.some((id) => id.toString() === req.user.id))
      .map((m) => m._id);

    if (unreadIds.length) {
      await Message.updateMany(
        { _id: { $in: unreadIds } },
        { $addToSet: { readBy: req.user.id } }
      );
    }

    res.json(messages.reverse()); // return in chronological order
  } catch (err) {
    console.error("Get messages error:", err.message);
    res.status(500).json({ message: "Failed to get messages" });
  }
});

// ——— Send a message (REST fallback — primary path is Socket.IO) ———
router.post("/messages", async (req, res) => {
  const { conversationId, text, media } = req.body;
  const senderId = req.user.id;

  if (!conversationId || (!text?.trim() && !media)) {
    return res.status(400).json({ message: "conversationId and text or media required" });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    if (!conversation.participants.some((id) => id.toString() === senderId)) {
      return res.status(403).json({ message: "Not a participant" });
    }

    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      text: text?.trim() || "",
      media: media || {},
      readBy: [senderId],
    });
    await message.save();

    // Update last message on conversation
    conversation.lastMessage = {
      text: message.text || (media ? "Media" : ""),
      sender: senderId,
      timestamp: message.createdAt,
    };
    await conversation.save();

    // Populate sender info
    const populated = await Message.findById(message._id)
      .populate("sender", "name username")
      .lean();

    // Emit to all participants via socket
    const io = req.app.get("io");
    if (io) {
      conversation.participants.forEach((pid) => {
        if (pid.toString() !== senderId) {
          io.to(pid.toString()).emit("newMessage", populated);
        }
      });
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error("Send message error:", err.message);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
