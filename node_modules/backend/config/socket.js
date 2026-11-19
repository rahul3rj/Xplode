const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

module.exports = function setupSocket(io) {
  // ——— Auth middleware: verify JWT on connection ———
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      socket.userId = decoded.id;
      socket.userName = decoded.name;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    console.log(`⚡ Socket connected: ${userId}`);

    // Join personal room (for DMs / notifications)
    socket.join(userId);

    // Set user online
    await userModel.findByIdAndUpdate(userId, { status: "online" });
    // Broadcast to friends
    const user = await userModel.findById(userId).lean();
    if (user?.friends?.length) {
      user.friends.forEach((friendId) => {
        io.to(friendId.toString()).emit("userOnline", { userId });
      });
    }

    // ——— Join all conversation rooms ———
    const conversations = await Conversation.find({ participants: userId }).lean();
    conversations.forEach((conv) => {
      socket.join(`conv:${conv._id}`);
    });

    // ——— Send message via socket ———
    socket.on("sendMessage", async (data, callback) => {
      const { conversationId, text, media } = data;
      if (!conversationId || (!text?.trim() && !media)) {
        return callback?.({ error: "Missing data" });
      }

      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.some((id) => id.toString() === userId)) {
          return callback?.({ error: "Not a participant" });
        }

        const message = new Message({
          conversation: conversationId,
          sender: userId,
          text: text?.trim() || "",
          media: media || {},
          readBy: [userId],
        });
        await message.save();

        conversation.lastMessage = {
          text: message.text || (media ? "Media" : ""),
          sender: userId,
          timestamp: message.createdAt,
        };
        await conversation.save();

        const populated = await Message.findById(message._id)
          .populate("sender", "name username")
          .lean();

        // Emit to all participants in the conversation room
        io.to(`conv:${conversationId}`).emit("newMessage", populated);

        callback?.({ success: true, message: populated });
      } catch (err) {
        console.error("Socket sendMessage error:", err.message);
        callback?.({ error: "Failed to send" });
      }
    });

    // ——— Typing indicator ———
    socket.on("typing", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("userTyping", {
        conversationId,
        userId,
        userName: socket.userName,
      });
    });

    socket.on("stopTyping", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("userStopTyping", {
        conversationId,
        userId,
      });
    });

    // ——— Join a new conversation room (when a new convo is created) ———
    socket.on("joinConversation", ({ conversationId }) => {
      socket.join(`conv:${conversationId}`);
    });

    // ——— Mark messages as read ———
    socket.on("markRead", async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );
        socket.to(`conv:${conversationId}`).emit("messagesRead", {
          conversationId,
          userId,
        });
      } catch (err) {
        console.error("Mark read error:", err.message);
      }
    });

    // ——— Disconnect ———
    socket.on("disconnect", async () => {
      console.log(`💤 Socket disconnected: ${userId}`);
      await userModel.findByIdAndUpdate(userId, {
        status: "offline",
        lastSeen: new Date(),
      });
      // Broadcast offline to friends
      if (user?.friends?.length) {
        user.friends.forEach((friendId) => {
          io.to(friendId.toString()).emit("userOffline", { userId });
        });
      }
    });
  });
};
