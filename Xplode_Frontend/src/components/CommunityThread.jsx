import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import axios from "../utils/axios";
import LoadingIndicator from "./LoadingIndicator";
import CommunityPost from "./CommunityPost";
import ArtworkImage from "./ArtworkImage";
import { recordCommunityActivity } from "../utils/communityActivity";
import { getDemoPosts, updateDemoPost } from "../utils/communityDemo";

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
  useEffect(() => { setDemoPosts(getDemoPosts()); }, [refreshToken]);
  useEffect(() => {
    let active = true;
    setGame(initialGame); setLoading(!initialGame); setError("");
    const request = /^\d+$/.test(routeName) ? axios.get(`/games/game/${encodeURIComponent(routeName)}`) : axios.get("/games/search", { params: { q: routeName } });
    request.then(({ data }) => {
      if (!active) return;
      const found = Array.isArray(data) ? data.find((item) => gameName(item).toLowerCase() === routeName.toLowerCase()) : data;
      if (found && typeof found === "object" && gameId(found)) { setGame(found); recordCommunityActivity(found, "opened"); }
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
  const save = (next) => {
    try { localStorage.setItem(key, JSON.stringify(next)); setPosts(next); setStorageError(""); onPostsChanged?.(); return true; }
    catch { setStorageError("Could not save. Check your browser storage and try again."); return false; }
  };
  const createPost = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    const post = { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), createdAt: new Date().toISOString(), comments: [] };
    if (save([post, ...posts])) { setTitle(""); setBody(""); }
  };
  const updateDemo = (postId, update) => {
    if (updateDemoPost(postId, update)) { setDemoPosts(getDemoPosts()); setStorageError(""); onPostsChanged?.(); return true; }
    setStorageError("Could not save. Check your browser storage and try again."); return false;
  };
  const addComment = (postId, text) => demoPosts.some((post) => post.id === postId) ? updateDemo(postId, (post) => ({ ...post, comments: [...(post.comments || []), { id: crypto.randomUUID(), body: text, createdAt: new Date().toISOString() }] })) : save(posts.map((post) => post.id === postId ? { ...post, comments: [...(post.comments || []), { id: crypto.randomUUID(), body: text, createdAt: new Date().toISOString() }] } : post));
  const vote = (postId, value) => demoPosts.some((post) => post.id === postId) ? updateDemo(postId, (post) => ({ ...post, vote: value })) : save(posts.map((post) => post.id === postId ? { ...post, vote: value } : post));
  if (loading) return <div className="community-state"><LoadingIndicator label="Loading community" /></div>;
  if (error || !game) return <div className="community-state" role="alert"><p>{error}</p><Link to="/community">Back to communities</Link></div>;
  const allPosts = [...posts, ...demoPosts.filter((post) => post.communityGameId === String(gameId(game)))].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return <div className={embedded ? "community-thread--embedded" : undefined}>
    {embedded ? <button type="button" className="community-icon-back" onClick={onBack} aria-label="Back to community home" title="Back to community home"><ArrowLeft size={18} /></button> : <Link className="community-icon-back" to="/community/home" aria-label="Back to community home" title="Back to community home"><ArrowLeft size={18} /></Link>}
    <div className="community-thread-hero">{hero(game) && <ArtworkImage src={hero(game)} alt="" />}<div className="community-thread-title"><p>GAME COMMUNITY</p><h1>{gameName(game)}</h1><span>Talk about everything {gameName(game)}.</span></div><Link className="community-thread-view-game" to={`/game/${encodeURIComponent(gameId(game))}`}>View game <ArrowUpRight size={15} /></Link></div>
    <div className="community-thread-layout"><div className="community-feed">
      {composer || <form className="community-compose" onSubmit={createPost}><h3>Start a discussion</h3><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a title" aria-label="Post title" maxLength={200} required /><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What would you like to talk about?" aria-label="Post text (optional)" maxLength={5000} /><div><button type="submit" disabled={!title.trim()}>Post</button></div></form>}
      {storageError && <p className="community-error" role="alert">{storageError}</p>}{allPosts.length ? <div className="community-post-list">{allPosts.map((post) => <CommunityPost key={post.id} post={post} game={game} clickable onComment={addComment} onVote={vote} />)}</div> : <div className="community-empty"><MessageCircle size={22} /><h3>No discussions yet</h3><p>Start the first conversation about this game.</p></div>}
    </div></div>
  </div>;
}

