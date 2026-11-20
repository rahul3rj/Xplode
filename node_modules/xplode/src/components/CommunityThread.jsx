import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import axios from "../utils/axios";
import LoadingIndicator from "./LoadingIndicator";
import CommunityPost from "./CommunityPost";
import ArtworkImage from "./ArtworkImage";
import { recordCommunityActivity } from "../utils/communityActivity";
import { getDemoPosts, updateDemoPost } from "../utils/communityDemo";
import { addSessionVisitedGame } from "../utils/sessionVisitedGames";
import { getCurrentUserId } from "../utils/streamFavorites";
import {
  COMMUNITY_VOTE_EVENT,
  COMMUNITY_POST_EVENT,
  COMMUNITY_REVIEW_EVENT,
  broadcastVoteUpdate,
} from "../utils/communitySync";

const gameId = (game) => game.steam_appid || game.appid || game.id;
const gameName = (game) => game.name || game.title || "Untitled game";
const imageValue = (value) => Array.isArray(value) ? imageValue(value[0]) : typeof value === "string" ? value : value?.url || value?.thumb || "";
const hero = (game) => imageValue(game.hero_image) || imageValue(game.background_raw) || imageValue(game.background) || imageValue(game.header_image) || (gameId(game) ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId(game)}/library_hero_2x.jpg` : "");
export default function CommunityThread({ routeName, embedded = false, onBack, initialGame = null, composer = null, refreshToken = 0, onPostsChanged }) {
  const [game, setGame] = useState(initialGame);
  const [loading, setLoading] = useState(!initialGame);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [storageError, setStorageError] = useState("");
  const [demoPosts, setDemoPosts] = useState(getDemoPosts);
  const [backendReviews, setBackendReviews] = useState([]);
  const [backendPosts, setBackendPosts] = useState([]);
  useEffect(() => { setDemoPosts(getDemoPosts()); }, [refreshToken]);
  useEffect(() => {
    let active = true;
    setGame(initialGame); setLoading(!initialGame); setError("");
    const request = /^\d+$/.test(routeName) ? axios.get(`/games/game/${encodeURIComponent(routeName)}`) : axios.get("/games/search", { params: { q: routeName } });
    request.then(({ data }) => {
      if (!active) return;
      const found = Array.isArray(data) ? data.find((item) => gameName(item).toLowerCase() === routeName.toLowerCase()) : data;
      if (found && typeof found === "object" && gameId(found)) {
        setGame(found);
        recordCommunityActivity(found, "opened");
        addSessionVisitedGame(found);
      }
      else if (!initialGame) setError("We couldn't find this game.");
    }).catch(() => { if (active && !initialGame) setError("Could not load this game. Please try again."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [routeName]);
  const key = game ? `xplode-community-posts-${gameId(game)}` : null;
  useEffect(() => {
    if (!key) return;
    try { const data = JSON.parse(localStorage.getItem(key) || "[]"); setPosts(Array.isArray(data) ? data : []); setStorageError(""); }
    catch { setPosts([]); setStorageError("Could not load posts saved on this device."); }
    setTitle(""); setBody("");
  }, [key, refreshToken]);

  useEffect(() => {
    const gid = game ? gameId(game) : null;
    if (!gid) return;
    let active = true;
    Promise.allSettled([
      axios.get("/community/posts", { params: { appid: gid } }),
      axios.get("/community/reviews", { params: { appid: gid } }),
    ])
      .then(([postsRes, reviewsRes]) => {
        if (!active) return;
        if (postsRes.status === "fulfilled" && Array.isArray(postsRes.value.data)) {
          setBackendPosts(postsRes.value.data);
        }
        if (reviewsRes.status === "fulfilled" && Array.isArray(reviewsRes.value.data)) {
          const reviews = reviewsRes.value.data;
          const mapped = reviews.map((r) => ({
            id: `review-${r._id}`,
            dbId: r._id,
            _id: r._id,
            communityGameId: String(r.steam_appid),
            gameName: r.gameName || gameName(game),
            author: r.user?.username ? `@${r.user.username}` : (r.user?.name || "Player"),
            authorId: r.user?._id,
            authorPic: r.user?.profilePic,
            rating: r.rating,
            isReview: true,
            title: `Player Review: ${r.rating} / 5 Stars`,
            body: r.comment || `Rated ${r.rating} out of 5 stars.`,
            createdAt: r.createdAt,
            score: r.score != null ? r.score : ((r.likesCount || 0) - (r.dislikesCount || 0)),
            likesCount: r.likesCount != null ? r.likesCount : (Array.isArray(r.likes) ? r.likes.length : (typeof r.likes === "number" ? r.likes : 0)),
            dislikesCount: r.dislikesCount != null ? r.dislikesCount : (Array.isArray(r.dislikes) ? r.dislikes.length : (typeof r.dislikes === "number" ? r.dislikes : 0)),
            vote: r.vote || 0,
            comments: [],
          }));
          setBackendReviews(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load community data for thread:", err);
      });
    return () => {
      active = false;
    };
  }, [game, refreshToken]);

  // Real-time vote listener (syncs middle panel with right panel and Socket.IO)
  useEffect(() => {
    const handleVoteEvent = (event) => {
      const data = event.detail;
      if (!data) return;

      const myId = getCurrentUserId();
      const isCaller = myId && String(data.userId) === String(myId);

      if (data.isReview) {
        const targetId = String(data.reviewId || data.id);
        setBackendReviews((prev) =>
          prev.map((r) => {
            const rId = String(r.dbId || r._id || r.id).replace(/^review-/, "");
            if (rId === targetId) {
              return {
                ...r,
                score: data.score,
                likesCount: data.likesCount,
                dislikesCount: data.dislikesCount,
                vote: isCaller ? data.vote : r.vote,
              };
            }
            return r;
          })
        );
      } else {
        const targetId = String(data.postId || data.id);
        setBackendPosts((prev) =>
          prev.map((p) => {
            const pId = String(p._id || p.id).replace(/^post-/, "");
            if (pId === targetId) {
              return {
                ...p,
                score: data.score,
                likesCount: data.likesCount,
                dislikesCount: data.dislikesCount,
                vote: isCaller ? data.vote : p.vote,
              };
            }
            return p;
          })
        );
      }
    };

    const handleNewPostEvent = (event) => {
      const newPost = event.detail;
      if (!newPost) return;
      const gid = game ? gameId(game) : null;
      if (gid && String(newPost.steam_appid) !== String(gid)) return;
      setBackendPosts((prev) => {
        const pId = String(newPost._id || newPost.id);
        if (prev.some((p) => String(p._id || p.id) === pId)) return prev;
        return [newPost, ...prev];
      });
    };

    const handleNewReviewEvent = (event) => {
      const r = event.detail;
      if (!r) return;
      const gid = game ? gameId(game) : null;
      if (gid && String(r.steam_appid) !== String(gid)) return;
      setBackendReviews((prev) => {
        const rId = String(r._id || r.id);
        if (prev.some((item) => String(item.dbId || item._id || item.id).replace(/^review-/, "") === rId)) return prev;
        const mapped = {
          id: `review-${r._id}`,
          dbId: r._id,
          _id: r._id,
          communityGameId: String(r.steam_appid),
          gameName: r.gameName || gameName(game),
          author: r.user?.username ? `@${r.user.username}` : (r.user?.name || "Player"),
          authorId: r.user?._id,
          authorPic: r.user?.profilePic,
          rating: r.rating,
          isReview: true,
          title: `Player Review: ${r.rating} / 5 Stars`,
          body: r.comment || `Rated ${r.rating} out of 5 stars.`,
          createdAt: r.createdAt,
          score: r.score != null ? r.score : 0,
          likesCount: r.likesCount != null ? r.likesCount : 0,
          dislikesCount: r.dislikesCount != null ? r.dislikesCount : 0,
          vote: 0,
          comments: [],
        };
        return [mapped, ...prev];
      });
    };

    window.addEventListener(COMMUNITY_VOTE_EVENT, handleVoteEvent);
    window.addEventListener(COMMUNITY_POST_EVENT, handleNewPostEvent);
    window.addEventListener(COMMUNITY_REVIEW_EVENT, handleNewReviewEvent);
    return () => {
      window.removeEventListener(COMMUNITY_VOTE_EVENT, handleVoteEvent);
      window.removeEventListener(COMMUNITY_POST_EVENT, handleNewPostEvent);
      window.removeEventListener(COMMUNITY_REVIEW_EVENT, handleNewReviewEvent);
    };
  }, [game]);

  const save = (next) => {
    try { localStorage.setItem(key, JSON.stringify(next)); setPosts(next); setStorageError(""); onPostsChanged?.(); return true; }
    catch { setStorageError("Could not save. Check your browser storage and try again."); return false; }
  };
  const createPost = async (event) => {
    event.preventDefault();
    if (!title.trim() || !game) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setStorageError("Please log in to publish a community post.");
      return;
    }
    try {
      await axios.post(
        "/community/posts",
        {
          steam_appid: gameId(game),
          gameName: gameName(game),
          title: title.trim(),
          body: body.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      setBody("");
      setStorageError("");
      onPostsChanged?.();
    } catch (err) {
      setStorageError(err.response?.data?.message || "Could not publish your post.");
    }
  };
  const updateDemo = (postId, update) => {
    if (updateDemoPost(postId, update)) { setDemoPosts(getDemoPosts()); setStorageError(""); onPostsChanged?.(); return true; }
    setStorageError("Could not save. Check your browser storage and try again."); return false;
  };
  const addComment = (postId, text) => demoPosts.some((post) => post.id === postId) ? updateDemo(postId, (post) => ({ ...post, comments: [...(post.comments || []), { id: crypto.randomUUID(), body: text, createdAt: new Date().toISOString() }] })) : save(posts.map((post) => post.id === postId ? { ...post, comments: [...(post.comments || []), { id: crypto.randomUUID(), body: text, createdAt: new Date().toISOString() }] } : post));
  const vote = (postId, value) => demoPosts.some((post) => post.id === postId) ? updateDemo(postId, (post) => ({ ...post, vote: value })) : save(posts.map((post) => post.id === postId ? { ...post, vote: value } : post));

  const handleVote = async (post, value) => {
    const isReview = post.isReview || String(post.id || "").startsWith("review-");
    const token = localStorage.getItem("token");
    const myId = getCurrentUserId();

    if (isReview) {
      const reviewId = String(post.dbId || post._id || post.id).replace(/^review-/, "");
      if (token && reviewId) {
        const prevVote = post.vote || 0;
        const currentLikes = post.likesCount !== undefined ? post.likesCount : Math.max(0, post.score || 0);
        let nextLikes = currentLikes;
        if (value === 1 && prevVote !== 1) nextLikes = currentLikes + 1;
        else if (value !== 1 && prevVote === 1) nextLikes = Math.max(0, currentLikes - 1);

        // Optimistically sync both panels instantly
        broadcastVoteUpdate({
          reviewId,
          isReview: true,
          score: (post.score || 0) + (value - prevVote),
          likesCount: nextLikes,
          dislikesCount: post.dislikesCount || 0,
          userId: myId,
          vote: value,
        });

        try {
          const res = await axios.post(`/community/reviews/${reviewId}/vote`, { vote: value });
          broadcastVoteUpdate({
            reviewId,
            isReview: true,
            score: res.data.score,
            likesCount: res.data.likesCount,
            dislikesCount: res.data.dislikesCount,
            userId: myId,
            vote: res.data.vote,
          });
        } catch (err) {
          console.error("Failed to vote on review in thread:", err);
          broadcastVoteUpdate({
            reviewId,
            isReview: true,
            score: post.score || 0,
            likesCount: currentLikes,
            dislikesCount: post.dislikesCount || 0,
            userId: myId,
            vote: prevVote,
          });
        }
      }
      return;
    }

    const postId = String(post._id || post.id || "").replace(/^post-/, "");
    if (postId) {
      if (!token) return;
      const prevVote = post.vote || 0;
      const currentLikes = post.likesCount !== undefined ? post.likesCount : Math.max(0, post.score || 0);
      let nextLikes = currentLikes;
      if (value === 1 && prevVote !== 1) nextLikes = currentLikes + 1;
      else if (value !== 1 && prevVote === 1) nextLikes = Math.max(0, currentLikes - 1);

      // Optimistically sync both panels instantly
      broadcastVoteUpdate({
        postId,
        isReview: false,
        score: (post.score || 0) + (value - prevVote),
        likesCount: nextLikes,
        dislikesCount: post.dislikesCount || 0,
        userId: myId,
        vote: value,
      });

      try {
        const res = await axios.post(`/community/posts/${postId}/vote`, { vote: value });
        broadcastVoteUpdate({
          postId,
          isReview: false,
          score: res.data.score,
          likesCount: res.data.likesCount,
          dislikesCount: res.data.dislikesCount,
          userId: myId,
          vote: res.data.vote,
        });
      } catch {
        broadcastVoteUpdate({
          postId,
          isReview: false,
          score: post.score || 0,
          likesCount: currentLikes,
          dislikesCount: post.dislikesCount || 0,
          userId: myId,
          vote: prevVote,
        });
      }
    } else {
      vote(post.id, value);
    }
  };

  const handleComment = async (post, text) => {
    const postId = post._id || (String(post.id).startsWith("post-") ? post.id.replace(/^post-/, "") : null);
    if (postId) {
      const token = localStorage.getItem("token");
      if (!token) return false;
      try {
        const res = await axios.post(`/community/posts/${postId}/comment`, { body: text }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.comment) {
          setBackendPosts((prev) => prev.map((p) => (String(p._id) === String(postId) || String(p.id) === String(post.id) ? { ...p, comments: [...(p.comments || []), res.data.comment] } : p)));
          return true;
        }
      } catch { return false; }
    } else {
      return addComment(post.id, text);
    }
  };

  if (loading) return <div className="community-state"><LoadingIndicator label="Loading community" /></div>;
  if (error || !game) return <div className="community-state" role="alert"><p>{error}</p><Link to="/community">Back to communities</Link></div>;
  const allPosts = [...backendPosts, ...backendReviews, ...posts, ...demoPosts.filter((post) => post.communityGameId === String(gameId(game)))].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return <div className={embedded ? "community-thread--embedded" : undefined}>
    {embedded ? <button type="button" className="community-icon-back" onClick={onBack} aria-label="Back to community home" title="Back to community home"><ArrowLeft size={18} /></button> : <Link className="community-icon-back" to="/community/home" aria-label="Back to community home" title="Back to community home"><ArrowLeft size={18} /></Link>}
    <div className="community-thread-hero">{hero(game) && <ArtworkImage src={hero(game)} alt="" />}<div className="community-thread-title"><p>GAME COMMUNITY</p><h1>{gameName(game)}</h1><span>Talk about everything {gameName(game)}.</span></div><Link className="community-thread-view-game" to={`/game/${encodeURIComponent(gameId(game))}`}>View game <ArrowUpRight size={15} /></Link></div>
    <div className="community-thread-layout"><div className="community-feed">
      {composer || <form className="community-compose" onSubmit={createPost}><h3>Start a discussion</h3><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a title" aria-label="Post title" maxLength={200} required /><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What would you like to talk about?" aria-label="Post text (optional)" maxLength={5000} /><div><button type="submit" disabled={!title.trim()}>Post</button></div></form>}
      {storageError && <p className="community-error" role="alert">{storageError}</p>}{allPosts.length ? <div className="community-post-list">{allPosts.map((post) => <CommunityPost key={post.id || post._id} post={post} game={game} clickable onComment={(postId, body) => handleComment(post, body)} onVote={(postId, val) => handleVote(post, val)} />)}</div> : <div className="community-empty"><MessageCircle size={22} /><h3>No discussions yet</h3><p>Start the first conversation about this game.</p></div>}
    </div></div>
  </div>;
}

