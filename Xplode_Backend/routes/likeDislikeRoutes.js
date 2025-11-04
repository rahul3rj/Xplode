const express = require("express");
const router = express.Router();
const UserLikeDislike = require("../models/UserLikeDislike");
const GameComment = require("../models/GameComment");
const verifyToken = require("../middlewares/verifyToken");

// ✅ Like/Dislike a game
router.post("/:appid/reaction", verifyToken, async (req, res) => {
  try {
    const { appid } = req.params;
    const { reaction } = req.body; // 'like' or 'dislike'
    const user_id = req.user.id;

    if (!['like', 'dislike'].includes(reaction)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    // Check if user already reacted
    const existingReaction = await UserLikeDislike.findOne({
      user_id,
      steam_appid: appid
    });

    if (existingReaction) {
      if (existingReaction.reaction === reaction) {
        // Remove reaction if same reaction clicked again
        await UserLikeDislike.deleteOne({ _id: existingReaction._id });
        return res.json({ 
          message: "Reaction removed", 
          reaction: null,
          action: "removed"
        });
      } else {
        // Update reaction if different reaction
        existingReaction.reaction = reaction;
        await existingReaction.save();
        return res.json({ 
          message: "Reaction updated", 
          reaction,
          action: "updated"
        });
      }
    }

    // Create new reaction
    const newReaction = new UserLikeDislike({
      user_id,
      steam_appid: parseInt(appid),
      reaction
    });

    await newReaction.save();

    res.status(201).json({
      message: "Reaction added",
      reaction,
      action: "added"
    });

  } catch (error) {
    console.error("Reaction error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get user's reaction for a game
router.get("/:appid/my-reaction", verifyToken, async (req, res) => {
  try {
    const { appid } = req.params;
    const user_id = req.user.id;

    const reaction = await UserLikeDislike.findOne({
      user_id,
      steam_appid: appid
    });

    res.json({ reaction: reaction ? reaction.reaction : null });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get like/dislike counts for a game
router.get("/:appid/stats", async (req, res) => {
  try {
    const { appid } = req.params;

    const likes = await UserLikeDislike.countDocuments({
      steam_appid: appid,
      reaction: 'like'
    });

    const dislikes = await UserLikeDislike.countDocuments({
      steam_appid: appid,
      reaction: 'dislike'
    });

    res.json({
      likes,
      dislikes,
      total: likes + dislikes
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Add comment
router.post("/:appid/comments", verifyToken, async (req, res) => {
  try {
    const { appid } = req.params;
    const { comment, rating = 5 } = req.body;
    const user_id = req.user.id;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const newComment = new GameComment({
      user_id,
      steam_appid: parseInt(appid),
      comment: comment.trim(),
      rating
    });

    await newComment.save();
    await newComment.populate('user_id', 'username profile_picture');

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get comments for a game
router.get("/:appid/comments", async (req, res) => {
  try {
    const { appid } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await GameComment.find({ steam_appid: appid })
      .populate('user_id', 'username profile_picture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GameComment.countDocuments({ steam_appid: appid });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalComments: total
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update comment
router.put("/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const user_id = req.user.id;

    const existingComment = await GameComment.findOne({
      _id: commentId,
      user_id
    });

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    existingComment.comment = comment;
    existingComment.is_edited = true;
    existingComment.updatedAt = new Date();

    await existingComment.save();

    res.json({
      message: "Comment updated successfully",
      comment: existingComment
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Delete comment
router.delete("/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const user_id = req.user.id;

    const comment = await GameComment.findOneAndDelete({
      _id: commentId,
      user_id
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;