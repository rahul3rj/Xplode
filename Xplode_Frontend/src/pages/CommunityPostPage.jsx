import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import CommunityPost from "../components/CommunityPost";
import axios from "../utils/axios";
import { getCommunityActivity } from "../utils/communityActivity";
import { getDemoPosts, updateDemoPost } from "../utils/communityDemo";
import "./community.css";

function readLocalPosts(key) {
  const value = JSON.parse(localStorage.getItem(key) || "[]");
  if (!Array.isArray(value)) throw new Error("Invalid post data");
  return value;
}

export default function CommunityPostPage({ gameId, selectedPostId, embedded = false, refreshToken = 0, onPostsChanged }) {
  const params = useParams();
  const name = gameId || params.name;
  const postId = selectedPostId || params.postId;
  return <CommunityPostPageContent key={`${name}-${postId}`} name={name} postId={postId} embedded={embedded} refreshToken={refreshToken} onPostsChanged={onPostsChanged} />;
}

function CommunityPostPageContent({ name, postId, embedded, refreshToken, onPostsChanged }) {
  const location = useLocation();
  const key = `xplode-community-posts-${name}`;
  const demoPost = getDemoPosts().find((item) => item.id === postId && item.communityGameId === name);
  const [post, setPost] = useState(() => {
    try { return demoPost || readLocalPosts(key).find((item) => item.id === postId) || null; }
    catch { return demoPost || null; }
  });
  const [game, setGame] = useState(() => location.state?.communityGame || getCommunityActivity()[name]?.game || { steam_appid: name, name: demoPost?.gameName || "Game community" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (postId?.startsWith("review-")) {
      const dbId = postId.replace(/^review-/, "");
      axios
        .get("/community/reviews", { params: { appid: name } })
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          const found = list.find((r) => String(r._id) === dbId);
          if (found) {
            setPost({
              id: `review-${found._id}`,
              dbId: found._id,
              communityGameId: String(found.steam_appid),
              gameName: found.gameName || game?.name || "Game",
              author: found.user?.username ? `@${found.user.username}` : (found.user?.name || "Player"),
              authorId: found.user?._id,
              authorPic: found.user?.profilePic,
              rating: found.rating,
              isReview: true,
              title: `Player Review: ${found.rating} / 5 Stars`,
              body: found.comment || `Rated ${found.rating} out of 5 stars.`,
              createdAt: found.createdAt,
              score: (found.likes || 0) - (found.dislikes || 0),
              comments: [],
            });
            setError("");
          }
        })
        .catch(() => {
          setError("Could not load this review.");
        });
      return;
    }

    try { setPost(getDemoPosts().find((item) => item.id === postId && item.communityGameId === name) || readLocalPosts(key).find((item) => item.id === postId) || null); }
    catch { setError("Could not load the post saved on this device."); }
  }, [key, name, postId, refreshToken, game?.name]);

  useEffect(() => {
    let active = true;
    axios.get(`/games/game/${encodeURIComponent(name)}`).then(({ data }) => {
      if (active && data && typeof data === "object" && (data.steam_appid || data.appid || data.id)) setGame(data);
    }).catch(() => {});
    return () => { active = false; };
  }, [name]);

  const save = (update) => {
    try {
      if (post.demo) {
        if (!updateDemoPost(post.id, update)) throw new Error("Could not save post");
        setPost(getDemoPosts().find((item) => item.id === post.id && item.communityGameId === name));
      } else {
        const current = readLocalPosts(key);
        if (!current.some((item) => item.id === post.id)) throw new Error("Post not found");
        const next = current.map((item) => item.id === post.id ? update(item) : item);
        localStorage.setItem(key, JSON.stringify(next));
        setPost(next.find((item) => item.id === post.id));
      }
      setError(""); onPostsChanged?.(); return true;
    } catch { setError("Could not save your changes on this device."); return false; }
  };
  const addComment = (_id, body) => save((item) => ({ ...item, comments: [...(item.comments || []), { id: crypto.randomUUID(), body, createdAt: new Date().toISOString() }] }));
  const vote = (_id, value) => save((item) => ({ ...item, vote: value }));
  const communityPath = `/community/${encodeURIComponent(name)}`;
  const requestedReturn = location.state?.returnTo;
  const returnTo = typeof requestedReturn === "string" && requestedReturn.startsWith("/community/") && requestedReturn !== location.pathname ? requestedReturn : "/community/home";
  const backLabel = returnTo.startsWith("/community/live/") ? "Back to stream" : returnTo === "/community/home" ? "Back to feed" : "Back to community";

  const content = <div className={embedded ? "community-post-page community-post-page--embedded" : "community-content community-post-page"}>
    <Link className="community-icon-back" to={returnTo} state={{ communityGame: game }} aria-label={backLabel} title={backLabel}><ArrowLeft size={18} /></Link>
    {post ? <div className="community-post-page-layout"><div className="community-post-page-body"><div className="community-post-page-heading"><span>COMMUNITY DISCUSSION</span><Link to={communityPath} state={{ communityGame: game }}>xp/{game.name || game.title || "Game"} <ArrowUpRight size={15} /></Link></div><CommunityPost key={post.id} post={post} game={game} onComment={addComment} onVote={vote} showComments />{error && <p className="community-error" role="alert">{error}</p>}<p className="community-local-note">Posts and comments are saved only in this browser. Demo comments are examples.</p></div><aside className="community-thread-aside"><h2>About this community</h2><p>Find more discussions about {game.name || game.title || "this game"}.</p><Link to={communityPath} state={{ communityGame: game }}>Visit community <ArrowUpRight size={15} /></Link></aside></div> : <div className="community-state"><h1>Post not found</h1><p>This post may not be available in this browser.</p><Link to={returnTo}>Go back</Link></div>}
  </div>;
  return embedded ? content : <div className="community-page">{content}</div>;
}
