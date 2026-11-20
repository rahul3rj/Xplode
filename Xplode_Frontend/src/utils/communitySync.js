export const COMMUNITY_VOTE_EVENT = "xplode-community-vote-updated";
export const COMMUNITY_POST_EVENT = "xplode-community-new-post";
export const COMMUNITY_REVIEW_EVENT = "xplode-community-new-review";
export const COMMUNITY_COMMENT_EVENT = "xplode-community-comment-added";
export const COMMUNITY_COMMENT_VOTE_EVENT = "xplode-community-comment-vote";
export const COMMUNITY_COMMENT_DELETED_EVENT = "xplode-community-comment-deleted";

/**
 * Broadcast a vote update across all active community components in the browser.
 */
export function broadcastVoteUpdate(data) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMUNITY_VOTE_EVENT, { detail: data }));
  }
}

/**
 * Broadcast a newly published community post.
 */
export function broadcastNewPost(post) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMUNITY_POST_EVENT, { detail: post }));
  }
}

/**
 * Broadcast a newly published game review.
 */
export function broadcastNewReview(review) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMUNITY_REVIEW_EVENT, { detail: review }));
  }
}

/**
 * Broadcast a newly created Reddit-style comment or reply.
 */
export function broadcastNewComment(comment) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMUNITY_COMMENT_EVENT, { detail: comment }));
  }
}

/**
 * Broadcast an upvote/downvote on a Reddit-style comment.
 */
export function broadcastCommentVote(voteData) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMUNITY_COMMENT_VOTE_EVENT, { detail: voteData }));
  }
}

/**
 * Broadcast a deleted comment.
 */
export function broadcastCommentDeleted(data) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMUNITY_COMMENT_DELETED_EVENT, { detail: data }));
  }
}
