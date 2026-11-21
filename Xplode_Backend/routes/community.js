const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const CommunityGame = require("../models/CommunityGames");
const SearchGames = require("../models/SearchGames");
const GameComment = require("../models/GameComment");
const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");
const User = require("../models/user");
const verifyToken = require("../middlewares/verifyToken");

// ✅ Helper to format user profile picture
const formatProfilePic = (pic) => {
  if (!pic?.data) return null;
  return {
    data: pic.data.toString("base64"),
    contentType: pic.contentType || "image/jpeg",
  };
};

// Optional auth helper to check if caller is logged in without throwing 403
const getUserIdFromAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return decoded.id || decoded._id || null;
  } catch {
    return null;
  }
};

// ✅ GET /api/community/posts - Get public community posts
router.get("/posts", async (req, res) => {
  try {
    const { appid, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (appid && !isNaN(parseInt(appid, 10))) {
      filter.steam_appid = parseInt(appid, 10);
    }

    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const currentUserId = getUserIdFromAuth(req);

    const posts = await CommunityPost.find(filter)
      .populate("user_id", "name username profilePic")
      .populate("comments.user_id", "name username profilePic")
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    const mapped = posts.map((p) => {
      const u = p.user_id || {};
      const likes = Array.isArray(p.likes) ? p.likes : [];
      const dislikes = Array.isArray(p.dislikes) ? p.dislikes : [];
      const userLiked = currentUserId
        ? likes.some((id) => String(id) === String(currentUserId))
        : false;
      const userDisliked = currentUserId
        ? dislikes.some((id) => String(id) === String(currentUserId))
        : false;
      const userVote = userLiked ? 1 : userDisliked ? -1 : 0;

      return {
        id: `post-${p._id}`,
        _id: p._id,
        steam_appid: p.steam_appid,
        communityGameId: String(p.steam_appid),
        gameName: p.gameName || `Game ${p.steam_appid}`,
        author: u.username ? `@${u.username}` : u.name || "Player",
        authorId: u._id,
        authorPic: formatProfilePic(u.profilePic),
        title: p.title,
        body: p.body,
        media: p.media,
        mediaType: p.mediaType,
        link: p.link,
        score: p.score != null ? p.score : likes.length - dislikes.length,
        likesCount: likes.length,
        dislikesCount: dislikes.length,
        vote: userVote,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        comments: (p.comments || []).map((c) => ({
          id: c._id,
          author:
            c.author || c.user_id?.username || c.user_id?.name || "Player",
          authorId: c.user_id?._id,
          authorPic: formatProfilePic(c.user_id?.profilePic || c.authorPic),
          body: c.body,
          createdAt: c.createdAt,
        })),
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error fetching community posts:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/community/posts - Create public community post
router.post("/posts", verifyToken, async (req, res) => {
  try {
    const { steam_appid, gameName, title, body, media, mediaType, link } =
      req.body;
    const appid = parseInt(steam_appid, 10);

    if (isNaN(appid)) {
      return res
        .status(400)
        .json({ message: "A valid game must be selected." });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Post title is required." });
    }

    let resolvedGameName = (gameName || "").trim();
    if (!resolvedGameName) {
      const [searchGame, commGame] = await Promise.all([
        SearchGames.findOne({ steam_appid: appid }).select("name title").lean(),
        CommunityGame.findOne({ steam_appid: appid }).select("title").lean(),
      ]);
      resolvedGameName =
        searchGame?.name ||
        searchGame?.title ||
        commGame?.title ||
        `Game ${appid}`;
    }

    const newPost = new CommunityPost({
      user_id: req.user.id,
      steam_appid: appid,
      gameName: resolvedGameName,
      title: title.trim(),
      body: (body || "").trim(),
      media: media || null,
      mediaType: mediaType || null,
      link: (link || "").trim() || null,
      score: 0,
      likes: [],
      dislikes: [],
      comments: [],
    });

    await newPost.save();
    await newPost.populate("user_id", "name username profilePic");

    const u = newPost.user_id || {};
    const responseData = {
      id: `post-${newPost._id}`,
      _id: newPost._id,
      steam_appid: newPost.steam_appid,
      communityGameId: String(newPost.steam_appid),
      gameName: newPost.gameName,
      author: u.username ? `@${u.username}` : u.name || "Player",
      authorId: u._id,
      authorPic: formatProfilePic(u.profilePic),
      title: newPost.title,
      body: newPost.body,
      media: newPost.media,
      mediaType: newPost.mediaType,
      link: newPost.link,
      score: 0,
      likesCount: 0,
      dislikesCount: 0,
      vote: 0,
      createdAt: newPost.createdAt,
      comments: [],
    };

    const io = req.app.get("io");
    if (io) {
      io.emit("newCommunityPost", responseData);
    }

    res.status(201).json({
      message: "Post published to community successfully",
      post: responseData,
    });
  } catch (error) {
    console.error("Error creating community post:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/community/posts/:postId/vote - Vote on public community post
router.post("/posts/:postId/vote", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { vote } = req.body; // 1 (like), -1 (dislike), or 0 (remove vote)
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = Array.isArray(post.likes) ? post.likes : [];
    const dislikes = Array.isArray(post.dislikes) ? post.dislikes : [];

    post.likes = likes.filter((id) => String(id) !== String(userId));
    post.dislikes = dislikes.filter((id) => String(id) !== String(userId));

    if (vote === 1) {
      post.likes.push(userId);
    } else if (vote === -1) {
      post.dislikes.push(userId);
    }

    post.score = post.likes.length - post.dislikes.length;
    await post.save();

    const voteData = {
      postId: String(post._id),
      score: post.score,
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length,
      userId: String(userId),
      vote: vote || 0,
    };

    const io = req.app.get("io");
    if (io) {
      io.emit("communityPostVote", voteData);
    }

    res.json({
      success: true,
      ...voteData,
    });
  } catch (error) {
    console.error("Error voting on post:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/community/comments/:targetType/:targetId - Get Reddit-style comments (post or review)
router.get("/comments/:targetType/:targetId", async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    if (!["post", "review"].includes(targetType)) {
      return res
        .status(400)
        .json({ message: "Invalid target type. Must be 'post' or 'review'." });
    }
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid target ID." });
    }

    const currentUserId = getUserIdFromAuth(req);

    // Fetch comments from CommunityComment collection
    let comments = await CommunityComment.find({
      targetType,
      targetId,
    })
      .populate("user_id", "name username profilePic")
      .sort({ createdAt: 1 })
      .lean();

    // If target is a post, automatically migrate any unmigrated comments from CommunityPost so they can be voted on
    if (targetType === "post") {
      const post = await CommunityPost.findById(targetId).lean();
      if (post && Array.isArray(post.comments) && post.comments.length > 0) {
        const existingIds = new Set(comments.map((c) => String(c._id)));
        const missing = post.comments.filter(
          (c) => !existingIds.has(String(c._id)),
        );
        if (missing.length > 0) {
          const toInsert = missing.map((c) => ({
            _id: c._id,
            targetType: "post",
            targetId: post._id,
            parentId: null,
            user_id: c.user_id,
            body: c.body,
            likes: [],
            dislikes: [],
            score: 0,
            createdAt: c.createdAt || new Date(),
          }));
          await CommunityComment.insertMany(toInsert, { ordered: false }).catch(
            () => {},
          );
          comments = await CommunityComment.find({
            targetType,
            targetId,
          })
            .populate("user_id", "name username profilePic")
            .sort({ createdAt: 1 })
            .lean();
        }
      }
    }

    const mapped = comments.map((c) => {
      const u = c.user_id || {};
      const likes = Array.isArray(c.likes) ? c.likes : [];
      const dislikes = Array.isArray(c.dislikes) ? c.dislikes : [];
      const userLiked = currentUserId
        ? likes.some((id) => String(id) === String(currentUserId))
        : false;
      const userDisliked = currentUserId
        ? dislikes.some((id) => String(id) === String(currentUserId))
        : false;
      const userVote = userLiked ? 1 : userDisliked ? -1 : 0;

      return {
        _id: c._id,
        targetType: c.targetType,
        targetId: c.targetId,
        parentId: c.parentId || null,
        body: c.isDeleted ? "[deleted]" : c.body,
        isDeleted: Boolean(c.isDeleted),
        author: u.username ? `@${u.username}` : u.name || "Player",
        authorId: u._id,
        authorPic: formatProfilePic(u.profilePic),
        score: c.score != null ? c.score : likes.length - dislikes.length,
        likesCount: likes.length,
        dislikesCount: dislikes.length,
        vote: userVote,
        createdAt: c.createdAt,
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/community/comments/:commentId/vote - Upvote / Downvote Reddit-style comment
router.post("/comments/:commentId/vote", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { vote } = req.body; // 1, -1, or 0
    const userId = req.user.id;

    let comment = null;
    if (mongoose.Types.ObjectId.isValid(commentId)) {
      comment = await CommunityComment.findById(commentId);
      if (!comment) {
        // Fallback: check if comment exists in CommunityPost and migrate on the fly
        const postWithComment = await CommunityPost.findOne({
          "comments._id": commentId,
        });
        if (postWithComment) {
          const subComment = postWithComment.comments.id(commentId);
          if (subComment) {
            comment = new CommunityComment({
              _id: subComment._id,
              targetType: "post",
              targetId: postWithComment._id,
              parentId: null,
              user_id: subComment.user_id || userId,
              body: subComment.body,
              likes: [],
              dislikes: [],
              score: 0,
              createdAt: subComment.createdAt || new Date(),
            });
            await comment.save();
          }
        }
      }
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const likes = Array.isArray(comment.likes) ? comment.likes : [];
    const dislikes = Array.isArray(comment.dislikes) ? comment.dislikes : [];

    comment.likes = likes.filter((id) => String(id) !== String(userId));
    comment.dislikes = dislikes.filter((id) => String(id) !== String(userId));

    if (vote === 1) {
      comment.likes.push(userId);
    } else if (vote === -1) {
      comment.dislikes.push(userId);
    }

    comment.score = comment.likes.length - comment.dislikes.length;
    await comment.save();

    const voteData = {
      commentId: String(comment._id),
      targetId: String(comment.targetId),
      targetType: comment.targetType,
      score: comment.score,
      likesCount: comment.likes.length,
      dislikesCount: comment.dislikes.length,
      userId: String(userId),
      vote: vote || 0,
    };

    const io = req.app.get("io");
    if (io) {
      io.emit("communityCommentVote", voteData);
    }

    res.json({
      success: true,
      ...voteData,
    });
  } catch (error) {
    console.error("Error voting on comment:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/community/comments/:targetType/:targetId - Create top-level or reply comment
router.post(
  "/comments/:targetType/:targetId",
  verifyToken,
  async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const { body, parentId } = req.body;
      const userId = req.user.id;

      if (!["post", "review"].includes(targetType)) {
        return res.status(400).json({
          message: "Invalid target type. Must be 'post' or 'review'.",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(targetId)) {
        return res.status(400).json({ message: "Invalid target ID." });
      }
      if (!body || !body.trim()) {
        return res.status(400).json({ message: "Comment body is required." });
      }

      let validParentId = null;
      if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
        const parentComment = await CommunityComment.findById(parentId);
        if (
          parentComment &&
          String(parentComment.targetId) === String(targetId)
        ) {
          validParentId = parentComment._id;
        }
      }

      const newComment = new CommunityComment({
        targetType,
        targetId,
        parentId: validParentId,
        user_id: userId,
        body: body.trim(),
        likes: [],
        dislikes: [],
        score: 0,
        isDeleted: false,
      });

      await newComment.save();
      await newComment.populate("user_id", "name username profilePic");

      const u = newComment.user_id || {};
      const responseData = {
        _id: newComment._id,
        targetType: newComment.targetType,
        targetId: String(newComment.targetId),
        parentId: newComment.parentId ? String(newComment.parentId) : null,
        body: newComment.body,
        isDeleted: false,
        author: u.username ? `@${u.username}` : u.name || "Player",
        authorId: u._id,
        authorPic: formatProfilePic(u.profilePic),
        score: 0,
        likesCount: 0,
        dislikesCount: 0,
        vote: 0,
        createdAt: newComment.createdAt,
      };

      // Mirror to post if it's a top-level post comment so legacy counters keep sync
      if (targetType === "post") {
        CommunityPost.findByIdAndUpdate(targetId, {
          $push: {
            comments: {
              _id: newComment._id,
              user_id: userId,
              author: responseData.author,
              authorPic: responseData.authorPic,
              body: responseData.body,
              createdAt: responseData.createdAt,
            },
          },
        }).catch(() => {});
      }

      const io = req.app.get("io");
      if (io) {
        io.emit("newCommunityComment", responseData);
      }

      res.status(201).json({
        message: "Comment posted successfully",
        comment: responseData,
      });
    } catch (error) {
      console.error("Error creating comment:", error.message);
      res.status(500).json({ error: error.message });
    }
  },
);

// ✅ DELETE /api/community/comments/:commentId - Delete comment (Reddit-style soft delete if has replies)
router.delete("/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    let comment = null;
    if (mongoose.Types.ObjectId.isValid(commentId)) {
      comment = await CommunityComment.findById(commentId);
      if (!comment) {
        // Fallback: check if comment exists in CommunityPost and migrate on the fly
        const postWithComment = await CommunityPost.findOne({
          "comments._id": commentId,
        });
        if (postWithComment) {
          const subComment = postWithComment.comments.id(commentId);
          if (subComment) {
            comment = new CommunityComment({
              _id: subComment._id,
              targetType: "post",
              targetId: postWithComment._id,
              parentId: null,
              user_id: subComment.user_id || userId,
              body: subComment.body,
              likes: [],
              dislikes: [],
              score: 0,
              createdAt: subComment.createdAt || new Date(),
            });
            await comment.save();
          }
        }
      }
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    if (String(comment.user_id) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments." });
    }

    const hasReplies = await CommunityComment.exists({ parentId: comment._id });
    if (hasReplies) {
      comment.isDeleted = true;
      comment.body = "[deleted]";
      await comment.save();
    } else {
      await CommunityComment.findByIdAndDelete(commentId);
    }

    const deleteData = {
      commentId: String(commentId),
      targetId: String(comment.targetId),
      targetType: comment.targetType,
      isDeleted: hasReplies ? true : "removed",
    };

    const io = req.app.get("io");
    if (io) {
      io.emit("communityCommentDeleted", deleteData);
    }

    res.json({
      success: true,
      ...deleteData,
    });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ error: error.message });
  }
});
router.post("/posts/:postId/comment", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const userId = req.user.id;

    if (!body || !body.trim()) {
      return res.status(400).json({ message: "Comment body is required" });
    }

    const [post, user] = await Promise.all([
      CommunityPost.findById(postId),
      User.findById(userId).select("name username profilePic").lean(),
    ]);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newCommComment = new CommunityComment({
      targetType: "post",
      targetId: post._id,
      parentId: null,
      user_id: userId,
      body: body.trim(),
      likes: [],
      dislikes: [],
      score: 0,
      isDeleted: false,
    });
    await newCommComment.save();

    const newComment = {
      _id: newCommComment._id,
      user_id: userId,
      author: user?.username ? `@${user.username}` : user?.name || "Player",
      authorPic: formatProfilePic(user?.profilePic),
      body: body.trim(),
      createdAt: newCommComment.createdAt,
    };

    post.comments.push(newComment);
    await post.save();

    const responseData = {
      _id: newCommComment._id,
      targetType: "post",
      targetId: String(post._id),
      parentId: null,
      body: newCommComment.body,
      isDeleted: false,
      author: newComment.author,
      authorId: user?._id,
      authorPic: newComment.authorPic,
      score: 0,
      likesCount: 0,
      dislikesCount: 0,
      vote: 0,
      createdAt: newCommComment.createdAt,
    };

    const io = req.app.get("io");
    if (io) {
      io.emit("newCommunityComment", responseData);
    }

    const added = post.comments[post.comments.length - 1];
    res.status(201).json({
      message: "Comment added",
      comment: {
        id: added._id,
        author: added.author,
        authorId: added.user_id,
        authorPic: added.authorPic,
        body: added.body,
        createdAt: added.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding comment to post:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET /api/community/reviews - Get community reviews (optional ?appid=&limit=)
router.get("/reviews", async (req, res) => {
  try {
    const { appid, limit = 25, page = 1 } = req.query;
    const filter = {};
    if (appid && !isNaN(parseInt(appid, 10))) {
      filter.steam_appid = parseInt(appid, 10);
    }

    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 25));
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const currentUserId = getUserIdFromAuth(req);

    const reviews = await GameComment.find(filter)
      .populate("user_id", "name username profilePic")
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    // Unique appids in this set to batch-lookup game names
    const appids = [...new Set(reviews.map((r) => r.steam_appid))];
    const [commGames, searchGames] = await Promise.all([
      CommunityGame.find({ steam_appid: { $in: appids } })
        .select("steam_appid title")
        .lean(),
      SearchGames.find({ steam_appid: { $in: appids } })
        .select("steam_appid name title")
        .lean(),
    ]);

    const gameNameMap = new Map();
    commGames.forEach((g) => gameNameMap.set(g.steam_appid, g.title));
    searchGames.forEach((g) => {
      if (!gameNameMap.has(g.steam_appid)) {
        gameNameMap.set(g.steam_appid, g.name || g.title);
      }
    });

    const mapped = reviews.map((r) => {
      const u = r.user_id || {};
      const likes = Array.isArray(r.likes) ? r.likes : [];
      const dislikes = Array.isArray(r.dislikes) ? r.dislikes : [];
      const userLiked = currentUserId
        ? likes.some((id) => String(id) === String(currentUserId))
        : false;
      const userDisliked = currentUserId
        ? dislikes.some((id) => String(id) === String(currentUserId))
        : false;
      const userVote = userLiked ? 1 : userDisliked ? -1 : 0;

      return {
        _id: r._id,
        steam_appid: r.steam_appid,
        gameName: gameNameMap.get(r.steam_appid) || `Game ${r.steam_appid}`,
        rating: r.rating,
        comment: r.comment,
        likesCount: likes.length,
        dislikesCount: dislikes.length,
        score: r.score != null ? r.score : likes.length - dislikes.length,
        vote: userVote,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        user: {
          _id: u._id,
          name: u.name,
          username: u.username,
          profilePic: u.profilePic?.data
            ? {
                data: u.profilePic.data.toString("base64"),
                contentType: u.profilePic.contentType,
              }
            : null,
        },
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    console.error("Error fetching community reviews:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST /api/community/reviews/:reviewId/vote - Vote on a game review
router.post("/reviews/:reviewId/vote", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { vote } = req.body; // 1, -1, or 0
    const userId = req.user.id;

    const review = await GameComment.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const likes = Array.isArray(review.likes) ? review.likes : [];
    const dislikes = Array.isArray(review.dislikes) ? review.dislikes : [];

    review.likes = likes.filter((id) => String(id) !== String(userId));
    review.dislikes = dislikes.filter((id) => String(id) !== String(userId));

    if (vote === 1) {
      review.likes.push(userId);
    } else if (vote === -1) {
      review.dislikes.push(userId);
    }

    review.score = review.likes.length - review.dislikes.length;
    await review.save();

    const voteData = {
      reviewId: String(review._id),
      steam_appid: review.steam_appid,
      score: review.score,
      likesCount: review.likes.length,
      dislikesCount: review.dislikes.length,
      userId: String(userId),
      vote: vote || 0,
    };

    const io = req.app.get("io");
    if (io) {
      io.emit("communityReviewVote", voteData);
    }

    res.json({
      success: true,
      ...voteData,
    });
  } catch (error) {
    console.error("Error voting on review:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all community games
router.get("/", async (req, res) => {
  try {
    const communityGames = await CommunityGame.find({
      category: "community",
    }).sort({ lastUpdated: -1 });
    res.status(200).json(communityGames);
  } catch (error) {
    console.error("Error fetching community games:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get specific community game by appid
router.get("/:appid", async (req, res) => {
  try {
    const appid = parseInt(req.params.appid, 10);
    if (isNaN(appid)) {
      return res.status(400).json({ message: "Invalid appid" });
    }

    const game = await CommunityGame.findOne({
      steam_appid: appid,
    });

    if (!game) {
      return res.status(404).json({ message: "Community game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching community game:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Trigger route
router.get("/trigger/trigger", (req, res) => {
  res.send("COMMUNITY TRIGGER ROUTE");
});

// ✅ Game name route
router.post("/:name", (req, res) => {
  res.send("community of the game: " + req.params.name);
});

module.exports = router;
