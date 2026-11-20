import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThumbsDown, ThumbsUp, MessageCircle, Share2, Star } from "lucide-react";
import ArtworkImage from "./ArtworkImage";
import RedditComments from "./RedditComments";

export default function CommunityPost({ post, game, onComment, onVote, clickable = false, showComments = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;
  const postState = { returnTo, communityGame: game };
  const [open, setOpen] = useState(showComments);
  const [commentsCount, setCommentsCount] = useState(
    Array.isArray(post.comments) ? post.comments.length : (post.commentsCount || 0)
  );
  const [shareMessage, setShareMessage] = useState("");
  const [imageStage, setImageStage] = useState(0);
  const postUrl = `/community/${encodeURIComponent(game.steam_appid || game.appid || game.id)}/post/${encodeURIComponent(post.id)}`;
  const share = async () => {
    const url = `${window.location.origin}${postUrl}`;
    try {
      if (navigator.share) await navigator.share({ title: post.title, url });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); setShareMessage("Post link copied"); }
      else setShareMessage("Copy the post link from the address bar");
    } catch (error) { if (error.name !== "AbortError") setShareMessage("Could not share the post link"); }
  };

  const authorPicUrl = post.authorPic?.data
    ? `data:${post.authorPic.contentType || "image/jpeg"};base64,${post.authorPic.data}`
    : post.authorAvatar || null;

  const displayLikes = post.likesCount !== undefined ? post.likesCount : Math.max(0, post.score || 0);

  return <article className={`community-post${clickable ? " community-post--clickable" : ""}`} onClick={(event) => { if (clickable && !event.target.closest("a, button, input, textarea, video, .reddit-comment-section") && !window.getSelection()?.toString()) navigate(postUrl, { state: postState }); }}><div className="community-post-author community-post-header"><span className="community-avatar">{authorPicUrl ? <img src={authorPicUrl} alt="" style={{ borderRadius: "50%", width: "100%", height: "100%", objectFit: "cover" }} /> : (post.author ? post.author.replace(/^@/, "").charAt(0).toUpperCase() : "Y")}</span><span className="community-post-identity"><Link className="community-post-game" to={`/community/${encodeURIComponent(game.steam_appid || game.appid || game.id)}`} state={{ communityGame: game }}>xp/{game.name || game.title || "Game"}</Link><span className="community-post-meta">{post.authorId ? <Link to={`/profile/${post.authorId}`} style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>{post.author || "You"}</Link> : (post.author || "You")} <span aria-hidden="true">·</span> <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString()}</time></span></span>{post.isReview ? <span className="community-demo-badge" style={{ background: "rgba(234, 179, 8, 0.15)", color: "#facc15", borderColor: "rgba(234, 179, 8, 0.35)", display: "inline-flex", alignItems: "center", gap: "4px" }}><Star size={11} fill="currentColor" /> {post.rating} / 5 Review</span> : post.demo && <span className="community-demo-badge">Demo</span>}</div><h3>{clickable ? <Link className="community-post-title-link" to={postUrl} state={postState}>{post.title}</Link> : post.title}</h3>{post.isReview && post.rating && <div style={{ display: "flex", gap: "2px", color: "#facc15", margin: "4px 0 8px" }}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} fill={post.rating >= n ? "currentColor" : "none"} />)}</div>}{post.body && <p className="community-post-body">{post.body}</p>}{post.image && imageStage < 2 && <ArtworkImage className="community-post-image" src={imageStage === 0 ? post.image : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid || game.appid || game.id}/header.jpg`} alt={`${game.name || game.title || "Game"} artwork`} loading="lazy" onError={() => setImageStage((stage) => stage + 1)} />}{post.demo && post.sourceUrl && <a className="community-post-source" href={post.sourceUrl} target="_blank" rel="noreferrer">Reddit inspiration <span aria-hidden="true">↗</span></a>}
    {post.media && (post.mediaType?.startsWith("video/") ? <video className="community-post-image" src={post.media} controls preload="metadata" aria-label="Post video" /> : <ArtworkImage className="community-post-image" src={post.media} alt="Post attachment" loading="lazy" />)}
    {post.streamId && <Link className="community-stream-post-link" to={`/community/live/${encodeURIComponent(post.streamId)}`} state={{ returnTo, returnState: location.state }}>Watch stream <span aria-hidden="true">↗</span></Link>}
    {post.link && /^https?:\/\//i.test(post.link) && <a className="community-post-source" href={post.link} target="_blank" rel="noopener noreferrer">{post.link} <span aria-hidden="true">↗</span></a>}
    <div className="community-post-actions"><div className="community-votes"><button type="button" aria-label="Like post" aria-pressed={post.vote === 1} onClick={() => onVote?.(post.id, post.vote === 1 ? 0 : 1)}><ThumbsUp size={16} /></button><span>{displayLikes}</span><button type="button" aria-label="Dislike post" aria-pressed={post.vote === -1} onClick={() => onVote?.(post.id, post.vote === -1 ? 0 : -1)}><ThumbsDown size={16} /></button></div><button className="community-action" type="button" onClick={(e) => { e.stopPropagation(); setOpen(!open); }} aria-expanded={open}><MessageCircle size={16} /> {commentsCount}</button><button className="community-action" type="button" onClick={share}><Share2 size={16} /> Share</button></div>{shareMessage && <p className="community-share-message" role="status">{shareMessage}</p>}
    {open && (
      <RedditComments
        targetType={post.isReview ? "review" : "post"}
        targetId={post.dbId || post._id || post.id}
        postAuthorId={post.authorId}
        onCommentCountChange={(count) => setCommentsCount(count)}
      />
    )}
  </article>;
}
