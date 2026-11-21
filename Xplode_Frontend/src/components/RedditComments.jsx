import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  CornerDownRight,
  Trash2,
  Send,
  ChevronDown,
  Flame,
  Clock,
  Sparkles,
} from "lucide-react";
import axios from "../utils/axios";
import { getCurrentUserId } from "../utils/streamFavorites";
import {
  COMMUNITY_COMMENT_EVENT,
  COMMUNITY_COMMENT_VOTE_EVENT,
  COMMUNITY_COMMENT_DELETED_EVENT,
  broadcastNewComment,
  broadcastCommentVote,
  broadcastCommentDeleted,
} from "../utils/communitySync";
import "./redditComments.css";

const relativeTime = (timestamp) => {
  if (!timestamp) return "just now";
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export default function RedditComments({
  targetType = "post", // "post" or "review"
  targetId,
  postAuthorId,
  onCommentCountChange,
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("top"); // "top" | "newest" | "oldest"
  const [collapsedSet, setCollapsedSet] = useState(new Set());
  const [replyingToId, setReplyingToId] = useState(null);
  const [topLevelBody, setTopLevelBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentUserId = getCurrentUserId();
  const rawId = String(targetId || "").replace(/^(post|review)-/, "");

  // Load comments from backend
  useEffect(() => {
    if (!rawId) return;
    let active = true;
    setLoading(true);

    axios
      .get(`/community/comments/${targetType}/${rawId}`)
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setComments(list);
        onCommentCountChange?.(list.length);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Could not load comments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [targetType, rawId]);

  // Real-time synchronization
  useEffect(() => {
    if (!rawId) return;

    const handleNewCommentEvent = (event) => {
      const newComment = event.detail;
      if (!newComment) return;
      if (String(newComment.targetId) !== rawId) return;

      setComments((prev) => {
        if (prev.some((c) => String(c._id) === String(newComment._id))) return prev;
        const next = [...prev, newComment];
        onCommentCountChange?.(next.length);
        return next;
      });
    };

    const handleCommentVoteEvent = (event) => {
      const data = event.detail;
      if (!data || !data.commentId) return;

      const normDataTarget = String(data.targetId || "").replace(/^(post|review)-/, "");
      const normRawId = String(rawId || "").replace(/^(post|review)-/, "");
      if (normDataTarget && normRawId && normDataTarget !== normRawId) return;

      const myId = getCurrentUserId();
      const isCaller = Boolean(myId && data.userId && String(data.userId) === String(myId));

      setComments((prev) =>
        prev.map((c) => {
          if (String(c._id || c.id) === String(data.commentId)) {
            return {
              ...c,
              score: data.score != null ? data.score : c.score,
              likesCount: data.likesCount != null ? data.likesCount : c.likesCount,
              dislikesCount: data.dislikesCount != null ? data.dislikesCount : c.dislikesCount,
              vote: isCaller && data.vote !== undefined ? data.vote : c.vote,
            };
          }
          return c;
        })
      );
    };

    const handleCommentDeletedEvent = (event) => {
      const data = event.detail;
      if (!data) return;
      if (String(data.targetId) !== rawId) return;

      setComments((prev) => {
        if (data.isDeleted === true) {
          return prev.map((c) =>
            String(c._id) === String(data.commentId)
              ? { ...c, isDeleted: true, body: "[deleted]" }
              : c
          );
        } else {
          const next = prev.filter((c) => String(c._id) !== String(data.commentId));
          onCommentCountChange?.(next.length);
          return next;
        }
      });
    };

    window.addEventListener(COMMUNITY_COMMENT_EVENT, handleNewCommentEvent);
    window.addEventListener(COMMUNITY_COMMENT_VOTE_EVENT, handleCommentVoteEvent);
    window.addEventListener(COMMUNITY_COMMENT_DELETED_EVENT, handleCommentDeletedEvent);

    return () => {
      window.removeEventListener(COMMUNITY_COMMENT_EVENT, handleNewCommentEvent);
      window.removeEventListener(COMMUNITY_COMMENT_VOTE_EVENT, handleCommentVoteEvent);
      window.removeEventListener(COMMUNITY_COMMENT_DELETED_EVENT, handleCommentDeletedEvent);
    };
  }, [rawId, onCommentCountChange]);

  // Collapse / Expand toggle
  const toggleCollapse = (id) => {
    setCollapsedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Voting on comment
  const handleVote = async (comment, voteValue) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to vote on comments.");
      return;
    }

    const commentId = String(comment._id || comment.id || "");
    if (!commentId) return;

    const prevVote = comment.vote || 0;
    const prevScore = comment.score || 0;
    const currentLikes = comment.likesCount !== undefined ? comment.likesCount : Math.max(0, comment.score || 0);

    let nextLikes = currentLikes;
    if (voteValue === 1 && prevVote !== 1) nextLikes = currentLikes + 1;
    else if (voteValue !== 1 && prevVote === 1) nextLikes = Math.max(0, currentLikes - 1);

    const newScore = prevScore + (voteValue - prevVote);

    // 1. Immediately update local state for instantaneous feedback
    setComments((prev) =>
      prev.map((c) =>
        String(c._id || c.id) === commentId
          ? {
              ...c,
              score: newScore,
              likesCount: nextLikes,
              vote: voteValue,
            }
          : c
      )
    );

    // 2. Optimistic local & window broadcast
    broadcastCommentVote({
      commentId,
      targetId: rawId,
      targetType,
      score: newScore,
      likesCount: nextLikes,
      dislikesCount: comment.dislikesCount || 0,
      userId: currentUserId,
      vote: voteValue,
    });

    try {
      const res = await axios.post(`/community/comments/${commentId}/vote`, {
        vote: voteValue,
      });

      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            String(c._id || c.id) === commentId
              ? {
                  ...c,
                  score: res.data.score,
                  likesCount: res.data.likesCount,
                  dislikesCount: res.data.dislikesCount,
                  vote: res.data.vote,
                }
              : c
          )
        );
        broadcastCommentVote({
          commentId,
          targetId: rawId,
          targetType,
          score: res.data.score,
          likesCount: res.data.likesCount,
          dislikesCount: res.data.dislikesCount,
          userId: currentUserId,
          vote: res.data.vote,
        });
      }
    } catch (err) {
      console.error("Failed to vote on comment:", err);
      // Revert on failure
      setComments((prev) =>
        prev.map((c) =>
          String(c._id || c.id) === commentId
            ? {
                ...c,
                score: prevScore,
                likesCount: currentLikes,
                vote: prevVote,
              }
            : c
        )
      );
      broadcastCommentVote({
        commentId,
        targetId: rawId,
        targetType,
        score: prevScore,
        likesCount: currentLikes,
        dislikesCount: comment.dislikesCount || 0,
        userId: currentUserId,
        vote: prevVote,
      });
      alert(err.response?.data?.message || "Failed to vote on comment.");
    }
  };

  // Submit top-level comment or reply
  const handleSubmitComment = async (body, parentId = null) => {
    if (!body.trim()) return false;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to join the conversation.");
      return false;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`/community/comments/${targetType}/${rawId}`, {
        body: body.trim(),
        parentId,
      });

      if (res.data?.comment) {
        broadcastNewComment(res.data.comment);
        if (parentId) setReplyingToId(null);
        else setTopLevelBody("");
        return true;
      }
      return false;
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post comment.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.delete(`/community/comments/${commentId}`);
      broadcastCommentDeleted(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  // Construct Reddit Hierarchical Tree
  const commentTree = useMemo(() => {
    const map = new Map();
    const roots = [];

    // Clone and prepare children list
    comments.forEach((c) => {
      map.set(String(c._id), { ...c, children: [] });
    });

    // Sort order comparator
    const compare = (a, b) => {
      const aLikes = a.likesCount !== undefined ? a.likesCount : Math.max(0, a.score || 0);
      const bLikes = b.likesCount !== undefined ? b.likesCount : Math.max(0, b.score || 0);
      if (sortBy === "top") return bLikes - aLikes || new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    };

    // Attach children to parents
    comments.forEach((c) => {
      const item = map.get(String(c._id));
      if (c.parentId && map.has(String(c.parentId))) {
        map.get(String(c.parentId)).children.push(item);
      } else {
        roots.push(item);
      }
    });

    // Recursively sort children
    const sortRec = (nodes) => {
      nodes.sort(compare);
      nodes.forEach((node) => {
        if (node.children?.length) sortRec(node.children);
      });
    };

    sortRec(roots);
    return roots;
  }, [comments, sortBy]);

  return (
    <div className="reddit-comment-section">
      {/* Top Header & Sort Options */}
      <div className="reddit-comments-toolbar">
        <div className="reddit-comments-count">
          <MessageSquare size={16} />
          <span>{comments.length} Comments</span>
        </div>

        <div className="reddit-sort-options">
          <span className="reddit-sort-label">Sort by:</span>
          <button
            type="button"
            className={`reddit-sort-btn ${sortBy === "top" ? "active" : ""}`}
            onClick={() => setSortBy("top")}
          >
            <Flame size={13} /> Top
          </button>
          <button
            type="button"
            className={`reddit-sort-btn ${sortBy === "newest" ? "active" : ""}`}
            onClick={() => setSortBy("newest")}
          >
            <Sparkles size={13} /> Newest
          </button>
          <button
            type="button"
            className={`reddit-sort-btn ${sortBy === "oldest" ? "active" : ""}`}
            onClick={() => setSortBy("oldest")}
          >
            <Clock size={13} /> Oldest
          </button>
        </div>
      </div>

      {/* Main Top-Level Composer */}
      <form
        className="reddit-main-composer"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitComment(topLevelBody, null);
        }}
      >
        <textarea
          rows={3}
          value={topLevelBody}
          onChange={(e) => setTopLevelBody(e.target.value)}
          placeholder="What are your thoughts?"
          maxLength={3000}
        />
        <div className="reddit-composer-footer">
          <span className="reddit-char-limit">
            {topLevelBody.length > 0 && `${topLevelBody.length}/3000`}
          </span>
          <button
            type="submit"
            disabled={!topLevelBody.trim() || submitting}
            className="reddit-submit-btn"
          >
            <Send size={14} /> Comment
          </button>
        </div>
      </form>

      {/* Comments List / Tree */}
      {loading ? (
        <div className="reddit-comments-loading">
          <div className="reddit-spinner" />
          <span>Loading discussions...</span>
        </div>
      ) : error ? (
        <p className="reddit-comments-error">{error}</p>
      ) : commentTree.length === 0 ? (
        <div className="reddit-empty-comments">
          <MessageSquare size={32} />
          <h4>No comments yet</h4>
          <p>Be the first to share what you think!</p>
        </div>
      ) : (
        <div className="reddit-comment-tree">
          {commentTree.map((rootComment) => (
            <RedditCommentNode
              key={rootComment._id}
              comment={rootComment}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              collapsedSet={collapsedSet}
              onToggleCollapse={toggleCollapse}
              onVote={handleVote}
              onReplySubmit={handleSubmitComment}
              onDelete={handleDeleteComment}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Recursive Comment Node Component with Reddit Tree Line and Nested Replies
 */
function RedditCommentNode({
  comment,
  postAuthorId,
  currentUserId,
  collapsedSet,
  onToggleCollapse,
  onVote,
  onReplySubmit,
  onDelete,
  replyingToId,
  setReplyingToId,
  depth = 0,
}) {
  const isCollapsed = collapsedSet.has(String(comment._id));
  const isReplying = replyingToId === String(comment._id);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const replyInputRef = useRef(null);

  const isOP = postAuthorId && String(comment.authorId) === String(postAuthorId);
  const isAuthor = currentUserId && String(comment.authorId) === String(currentUserId);
  const displayLikes = comment.likesCount !== undefined ? comment.likesCount : Math.max(0, comment.score || 0);

  useEffect(() => {
    if (isReplying) {
      replyInputRef.current?.focus();
    }
  }, [isReplying]);

  const authorPicUrl = comment.authorPic?.data
    ? `data:${comment.authorPic.contentType || "image/jpeg"};base64,${comment.authorPic.data}`
    : comment.authorAvatar || null;

  // Count total descendants for collapsed label
  const countDescendants = (node) => {
    if (!node.children || !node.children.length) return 0;
    return node.children.reduce((acc, child) => acc + 1 + countDescendants(child), 0);
  };
  const totalDescendants = countDescendants(comment);

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    const ok = await onReplySubmit(replyText, comment._id);
    if (ok) {
      setReplyText("");
      setReplyingToId(null);
    }
    setSubmittingReply(false);
  };

  return (
    <div className={`reddit-comment-node depth-${Math.min(depth, 8)} ${isCollapsed ? "is-collapsed" : ""}`}>
      {/* Vertical Reddit Thread Guide Line */}
      <div
        className="reddit-threadline"
        onClick={() => onToggleCollapse(String(comment._id))}
        title="Click to collapse thread"
      />

      <div className="reddit-comment-content">
        {/* Comment Header */}
        <div className="reddit-comment-header">
          <button
            type="button"
            className="reddit-collapse-pill"
            onClick={() => onToggleCollapse(String(comment._id))}
            aria-label={isCollapsed ? "Expand thread" : "Collapse thread"}
          >
            {isCollapsed ? "[+]" : "[-]"}
          </button>

          <div className="reddit-comment-avatar">
            {authorPicUrl ? (
              <img src={authorPicUrl} alt="" />
            ) : (
              <span>{comment.author ? comment.author.replace(/^@/, "").charAt(0).toUpperCase() : "U"}</span>
            )}
          </div>

          <div className="reddit-author-meta">
            {comment.authorId ? (
              <Link to={`/profile/${comment.authorId}`} className="reddit-author-name">
                {comment.author}
              </Link>
            ) : (
              <span className="reddit-author-name">{comment.author || "Player"}</span>
            )}

            {isOP && <span className="reddit-op-badge" title="Original Poster">OP</span>}

            <span className="reddit-dot">·</span>
            <time className="reddit-timestamp" dateTime={comment.createdAt}>
              {relativeTime(comment.createdAt)}
            </time>
          </div>

          {isCollapsed && (
            <span className="reddit-collapsed-count" onClick={() => onToggleCollapse(String(comment._id))}>
              {totalDescendants > 0 ? `(${totalDescendants} replies hidden)` : "(hidden)"}
            </span>
          )}
        </div>

        {/* When not collapsed: Body & Actions */}
        {!isCollapsed && (
          <>
            <div className={`reddit-comment-body ${comment.isDeleted ? "is-deleted" : ""}`}>
              {comment.body}
            </div>

            {/* Comment Action Bar */}
            <div className="reddit-comment-actions">
              {/* Reddit Upvote / Downvote Pill */}
              <div className="reddit-vote-pill">
                <button
                  type="button"
                  className={`reddit-vote-btn up ${comment.vote === 1 ? "active" : ""}`}
                  aria-label="Upvote comment"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVote(comment, comment.vote === 1 ? 0 : 1);
                  }}
                >
                  <ArrowBigUp size={16} fill={comment.vote === 1 ? "currentColor" : "none"} />
                </button>

                <span className={`reddit-comment-score ${comment.vote === 1 ? "upvoted" : comment.vote === -1 ? "downvoted" : ""}`}>
                  {displayLikes}
                </span>

                <button
                  type="button"
                  className={`reddit-vote-btn down ${comment.vote === -1 ? "active" : ""}`}
                  aria-label="Downvote comment"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVote(comment, comment.vote === -1 ? 0 : -1);
                  }}
                >
                  <ArrowBigDown size={16} fill={comment.vote === -1 ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Reply Button */}
              {!comment.isDeleted && (
                <button
                  type="button"
                  className="reddit-action-btn"
                  onClick={() => setReplyingToId(isReplying ? null : String(comment._id))}
                >
                  <MessageSquare size={13} />
                  <span>Reply</span>
                </button>
              )}

              {/* Delete Button (Author only) */}
              {isAuthor && !comment.isDeleted && (
                <button
                  type="button"
                  className="reddit-action-btn delete-btn"
                  onClick={() => onDelete(comment._id)}
                  title="Delete comment"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {/* Inline Reply Composer Box */}
            {isReplying && (
              <form className="reddit-reply-box" onSubmit={handlePostReply}>
                <div className="reddit-reply-header">
                  <CornerDownRight size={13} />
                  <span>Replying to <strong>{comment.author}</strong></span>
                </div>
                <textarea
                  ref={replyInputRef}
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="What are your thoughts?"
                  maxLength={3000}
                />
                <div className="reddit-reply-actions">
                  <button
                    type="button"
                    className="reddit-btn-cancel"
                    onClick={() => {
                      setReplyText("");
                      setReplyingToId(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || submittingReply}
                    className="reddit-btn-submit"
                  >
                    Reply
                  </button>
                </div>
              </form>
            )}

            {/* Nested Child Replies */}
            {comment.children && comment.children.length > 0 && (
              <div className="reddit-children-container">
                {comment.children.map((child) => (
                  <RedditCommentNode
                    key={child._id}
                    comment={child}
                    postAuthorId={postAuthorId}
                    currentUserId={currentUserId}
                    collapsedSet={collapsedSet}
                    onToggleCollapse={onToggleCollapse}
                    onVote={onVote}
                    onReplySubmit={onReplySubmit}
                    onDelete={onDelete}
                    replyingToId={replyingToId}
                    setReplyingToId={setReplyingToId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
