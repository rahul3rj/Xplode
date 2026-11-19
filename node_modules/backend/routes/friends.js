const express = require("express");
const router = express.Router();
const { userModel } = require("../models/user");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

// ——— Search users by username ———
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q || q.length < 2) return res.json([]);

  try {
    const users = await userModel
      .find({
        _id: { $ne: req.user.id }, // exclude self
        username: { $regex: q, $options: "i" },
      })
      .limit(10)
      .select("name username profilePic status lastSeen")
      .lean();

    // Map results — send profilePic as base64 so frontend can display it
    const results = users.map((u) => ({
      _id: u._id,
      name: u.name,
      username: u.username,
      status: u.status || "offline",
      lastSeen: u.lastSeen,
      profilePic: u.profilePic?.data
        ? {
            data: u.profilePic.data.toString("base64"),
            contentType: u.profilePic.contentType,
          }
        : null,
    }));

    res.json(results);
  } catch (err) {
    console.error("User search error:", err.message);
    res.status(500).json({ message: "Search failed" });
  }
});

// ——— Send friend request ———
router.post("/request/:userId", async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  if (userId === myId) return res.status(400).json({ message: "Cannot add yourself" });

  try {
    const [me, target] = await Promise.all([
      userModel.findById(myId),
      userModel.findById(userId),
    ]);

    if (!target) return res.status(404).json({ message: "User not found" });
    if (me.friends.includes(userId)) return res.status(400).json({ message: "Already friends" });
    if (me.friendRequests.sent.includes(userId)) return res.status(400).json({ message: "Request already sent" });

    // If the other person already sent us a request, auto-accept
    if (me.friendRequests.received.includes(userId)) {
      me.friends.push(userId);
      target.friends.push(myId);
      me.friendRequests.received = me.friendRequests.received.filter((id) => id.toString() !== userId);
      target.friendRequests.sent = target.friendRequests.sent.filter((id) => id.toString() !== myId);
      await Promise.all([me.save(), target.save()]);

      // Notify via socket
      const io = req.app.get("io");
      if (io) {
        io.to(userId).emit("friendAccepted", { userId: myId, name: me.name, username: me.username });
      }

      return res.json({ message: "Friend added (mutual request)", status: "friends" });
    }

    me.friendRequests.sent.push(userId);
    target.friendRequests.received.push(myId);
    await Promise.all([me.save(), target.save()]);

    // Notify target via socket
    const io = req.app.get("io");
    if (io) {
      io.to(userId).emit("friendRequest", {
        from: { _id: myId, name: me.name, username: me.username },
      });
    }

    res.json({ message: "Friend request sent", status: "request_sent" });
  } catch (err) {
    console.error("Friend request error:", err.message);
    res.status(500).json({ message: "Failed to send request" });
  }
});

// ——— Accept friend request ———
router.post("/accept/:userId", async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  try {
    const [me, requester] = await Promise.all([
      userModel.findById(myId),
      userModel.findById(userId),
    ]);

    if (!requester) return res.status(404).json({ message: "User not found" });
    if (!me.friendRequests.received.includes(userId)) {
      return res.status(400).json({ message: "No pending request from this user" });
    }

    me.friends.push(userId);
    requester.friends.push(myId);
    me.friendRequests.received = me.friendRequests.received.filter((id) => id.toString() !== userId);
    requester.friendRequests.sent = requester.friendRequests.sent.filter((id) => id.toString() !== myId);
    await Promise.all([me.save(), requester.save()]);

    // Notify via socket
    const io = req.app.get("io");
    if (io) {
      io.to(userId).emit("friendAccepted", { userId: myId, name: me.name, username: me.username });
    }

    res.json({ message: "Friend request accepted", status: "friends" });
  } catch (err) {
    console.error("Accept friend error:", err.message);
    res.status(500).json({ message: "Failed to accept request" });
  }
});

// ——— Reject / Cancel friend request ———
router.post("/reject/:userId", async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  try {
    const [me, other] = await Promise.all([
      userModel.findById(myId),
      userModel.findById(userId),
    ]);

    if (!other) return res.status(404).json({ message: "User not found" });

    // Could be rejecting an incoming request or cancelling our outgoing one
    me.friendRequests.received = me.friendRequests.received.filter((id) => id.toString() !== userId);
    me.friendRequests.sent = me.friendRequests.sent.filter((id) => id.toString() !== userId);
    other.friendRequests.sent = other.friendRequests.sent.filter((id) => id.toString() !== myId);
    other.friendRequests.received = other.friendRequests.received.filter((id) => id.toString() !== myId);

    await Promise.all([me.save(), other.save()]);
    res.json({ message: "Request removed" });
  } catch (err) {
    console.error("Reject friend error:", err.message);
    res.status(500).json({ message: "Failed to reject request" });
  }
});

// ——— Remove friend ———
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  try {
    await Promise.all([
      userModel.findByIdAndUpdate(myId, { $pull: { friends: userId } }),
      userModel.findByIdAndUpdate(userId, { $pull: { friends: myId } }),
    ]);

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("Remove friend error:", err.message);
    res.status(500).json({ message: "Failed to remove friend" });
  }
});

// ——— Get friends list ———
router.get("/", async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("friends", "name username profilePic status lastSeen")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const friends = (user.friends || []).map((f) => ({
      _id: f._id,
      name: f.name,
      username: f.username,
      status: f.status || "offline",
      lastSeen: f.lastSeen,
      profilePic: f.profilePic?.data
        ? { data: f.profilePic.data.toString("base64"), contentType: f.profilePic.contentType }
        : null,
    }));

    res.json(friends);
  } catch (err) {
    console.error("Get friends error:", err.message);
    res.status(500).json({ message: "Failed to get friends" });
  }
});

// ——— Get pending friend requests ———
router.get("/requests", async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("friendRequests.received", "name username profilePic")
      .populate("friendRequests.sent", "name username profilePic")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const mapUser = (u) => ({
      _id: u._id,
      name: u.name,
      username: u.username,
      profilePic: u.profilePic?.data
        ? { data: u.profilePic.data.toString("base64"), contentType: u.profilePic.contentType }
        : null,
    });

    res.json({
      received: (user.friendRequests?.received || []).map(mapUser),
      sent: (user.friendRequests?.sent || []).map(mapUser),
    });
  } catch (err) {
    console.error("Get requests error:", err.message);
    res.status(500).json({ message: "Failed to get requests" });
  }
});

// ——— Get friend status with a specific user ———
router.get("/status/:userId", async (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  try {
    const me = await userModel.findById(myId).lean();
    if (!me) return res.status(404).json({ message: "User not found" });

    if (me.friends?.some((id) => id.toString() === userId)) {
      return res.json({ status: "friends" });
    }
    if (me.friendRequests?.sent?.some((id) => id.toString() === userId)) {
      return res.json({ status: "request_sent" });
    }
    if (me.friendRequests?.received?.some((id) => id.toString() === userId)) {
      return res.json({ status: "request_received" });
    }
    res.json({ status: "none" });
  } catch (err) {
    console.error("Friend status error:", err.message);
    res.status(500).json({ message: "Failed to get status" });
  }
});

module.exports = router;
