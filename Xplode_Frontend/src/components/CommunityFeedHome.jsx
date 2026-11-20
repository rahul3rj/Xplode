import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Gamepad2, MessageCircle, RefreshCw, Search, UserPlus, UserCheck, Clock, X } from "lucide-react";
import { getUserLibrary } from "../utils/addToLibrary";
import axios from "../utils/axios";
import { getCommunityActivity } from "../utils/communityActivity";
import CommunityPost from "./CommunityPost";
import CommunityThread from "./CommunityThread";
import CommunityComposer from "./CommunityComposer";
import CommunityPostPage from "../pages/CommunityPostPage";
import LiveStreamPage, { LiveChat } from "../pages/LiveStreamPage";
import ArtworkImage from "./ArtworkImage";
import LoadingIndicator from "./LoadingIndicator";
import { getDemoPosts, updateDemoPost } from "../utils/communityDemo";
import streams from "../data/liveStreamDemo.json";
import creatorSnapshots from "../data/liveCreatorsSnapshot.json";
import { getStreamFavoriteKey, getFavoriteHomies, STREAM_FAVORITES_CHANGED } from "../utils/streamFavorites";

const idOf = (game) => String(game.steam_appid || game.appid || game.id || "");
const imageUrl = (value) => Array.isArray(value) ? imageUrl(value[0]) : typeof value === "string" ? value : value?.url || value?.thumb || "";
const iconFor = (game) => imageUrl(game.portrait_image) || imageUrl(game.header_image) || imageUrl(game.capsule_image);
const threadUrl = (id) => `/community/${encodeURIComponent(id)}`;
const relativeTime = (time) => {
  const minutes = Math.max(0, Math.floor((Date.now() - time) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
const readPosts = () => {
  const all = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("xplode-community-posts-")) continue;
      try {
        const posts = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(posts)) posts.forEach((post) => all.push({ ...post, communityGameId: key.slice("xplode-community-posts-".length) }));
      } catch { /* Skip malformed entries without hiding the rest of the feed. */ }
    }
  } catch { return getDemoPosts(); }
  return [...all, ...getDemoPosts()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

function GameAvatar({ game }) {
  const [failed, setFailed] = useState(false);
  const icon = iconFor(game);
  return <span className="community-feed-game-avatar">{icon && !failed ? <img src={icon} alt="" onError={() => setFailed(true)} /> : <Gamepad2 size={18} aria-hidden="true" />}</span>;
}

function CommunityPicker({ games, value, onChange, locked }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const selected = games.find((game) => idOf(game) === value);
  const moveFocus = (position) => {
    const options = root.current?.querySelectorAll('[role="option"]');
    if (!options?.length) return;
    options[Math.max(0, Math.min(position, options.length - 1))].focus();
  };
  const onKeyDown = (event) => {
    if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false); root.current?.querySelector(".community-picker-trigger")?.focus(); }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) { if (!locked) { setOpen(true); requestAnimationFrame(() => moveFocus(event.key === "ArrowUp" || event.key === "End" ? games.length - 1 : 0)); } return; }
      const options = [...(root.current?.querySelectorAll('[role="option"]') || [])];
      const index = options.indexOf(document.activeElement);
      moveFocus(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : index + (event.key === "ArrowDown" ? 1 : -1));
    }
  };
  return <div className="community-picker" ref={root} onKeyDown={onKeyDown} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button className="community-picker-trigger" type="button" aria-label={selected ? `Community: ${gameNameFor(selected)}` : "Choose a community"} aria-haspopup="listbox" aria-expanded={open} disabled={locked} onClick={() => setOpen(!open)}><Gamepad2 size={15} aria-hidden="true" /><span>{selected ? `xp/${gameNameFor(selected)}` : "Select game"}</span><ChevronDown size={15} aria-hidden="true" /></button>
    {open && <div className="community-picker-menu" role="listbox" aria-label="Choose a game community">{games.length ? games.map((game) => { const id = idOf(game); return <button key={id} type="button" role="option" aria-selected={id === value} className="community-picker-option" onClick={() => { onChange(id); setOpen(false); root.current?.querySelector(".community-picker-trigger")?.focus(); }}><GameAvatar game={game} /><span>xp/{gameNameFor(game)}</span>{id === value && <span className="community-picker-check" aria-hidden="true">✓</span>}</button>; }) : <p>No communities available.</p>}</div>}
  </div>;
}

function UserAvatar({ user }) {
  const pic = user.profilePic ? `data:${user.profilePic.contentType};base64,${user.profilePic.data}` : null;
  return <span className="community-feed-game-avatar">{pic ? <img src={pic} alt="" style={{ borderRadius: "50%" }} /> : <span style={{ display: "grid", placeItems: "center", width: "100%", height: "100%", borderRadius: "50%", background: "#313131", color: "#fff", fontSize: "13px", fontWeight: 700 }}>{(user.name || "?").charAt(0).toUpperCase()}</span>}</span>;
}

function FriendButton({ userId }) {
  const [status, setStatus] = useState("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get(`/friends/status/${userId}`).then(({ data }) => { if (active) setStatus(data.status); }).catch(() => { if (active) setStatus("none"); });
    return () => { active = false; };
  }, [userId]);

  const send = async () => {
    setBusy(true);
    try {
      const { data } = await axios.post(`/friends/request/${userId}`);
      setStatus(data.status || "request_sent");
    } catch { /* ignore */ }
    setBusy(false);
  };

  const accept = async () => {
    setBusy(true);
    try {
      const { data } = await axios.post(`/friends/accept/${userId}`);
      setStatus(data.status || "friends");
    } catch { /* ignore */ }
    setBusy(false);
  };

  if (status === "loading") return null;
  if (status === "friends") return <span className="community-lookup-friend-badge" title="Friends"><UserCheck size={15} /> Friends</span>;
  if (status === "request_sent") return <span className="community-lookup-friend-badge community-lookup-friend-badge--pending" title="Request sent"><Clock size={14} /> Pending</span>;
  if (status === "request_received") return <button type="button" className="community-lookup-friend-btn" disabled={busy} onClick={accept}><UserPlus size={14} /> Accept</button>;
  return <button type="button" className="community-lookup-friend-btn" disabled={busy} onClick={send}><UserPlus size={14} /> Add</button>;
}

function CommunitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const term = query.trim();

  useEffect(() => {
    let active = true;
    setResults([]); setUserResults([]); setError(false);
    if (!term) { setLoading(false); return () => { active = false; }; }
    setLoading(true);
    const timer = setTimeout(() => {
      // Search both games and users in parallel
      Promise.allSettled([
        axios.get("/games/search", { params: { q: term } }),
        axios.get("/friends/search", { params: { q: term } }),
      ]).then(([gamesRes, usersRes]) => {
        if (!active) return;
        // Games
        if (gamesRes.status === "fulfilled") {
          const unique = new Map();
          (Array.isArray(gamesRes.value.data) ? gamesRes.value.data : []).forEach((game) => { const id = idOf(game); if (id && !unique.has(id)) unique.set(id, game); });
          setResults([...unique.values()]);
        } else { setResults([]); }
        // Users
        if (usersRes.status === "fulfilled") {
          setUserResults(Array.isArray(usersRes.value.data) ? usersRes.value.data : []);
        } else { setUserResults([]); }
      }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    }, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [term]);

  return <div className="community-lookup" onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} onKeyDown={(event) => { if (event.key === "Escape") { setFocused(false); event.currentTarget.querySelector("input")?.blur(); } }}>
    <div className="community-lookup-input"><Search size={16} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games and homies" aria-label="Search games and homies" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear community search"><X size={15} /></button>}</div>
    {focused && term && <div id="community-lookup-results" className="community-lookup-results">
      {loading ? <div className="community-lookup-status"><LoadingIndicator label="Searching games & people" small /></div>
        : error ? <p className="community-lookup-status" role="alert">Could not search. Please try again.</p>
        : <>
          {/* People results */}
          {userResults.length > 0 && <>
            <h3>People</h3>
            {userResults.map((u) => <div key={u._id} className="community-lookup-result community-lookup-result--user">
              <Link to={`/profile/${u._id}`} style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0, textDecoration: "none", color: "inherit" }} onClick={() => { setFocused(false); setQuery(""); }}>
                <UserAvatar user={u} />
                <span className="community-lookup-user-info">
                  <strong>{u.name}</strong>
                  {u.username && <small>@{u.username}</small>}
                </span>
              </Link>
              <FriendButton userId={u._id} />
            </div>)}
          </>}
          {/* Game results */}
          {results.length > 0 && <>
            <h3>Games</h3>
            {results.map((game) => <Link key={idOf(game)} className="community-lookup-result" to={threadUrl(idOf(game))} state={{ communityGame: game }} onClick={() => { setFocused(false); setQuery(""); }}><GameAvatar game={game} /><span>{gameNameFor(game)}</span><ArrowUpRight size={15} aria-hidden="true" /></Link>)}
          </>}
          {/* No results */}
          {!userResults.length && !results.length && <p className="community-lookup-status">No results found.</p>}
        </>}
    </div>}
  </div>;
}

function ExpandedGame({ game, activity, inLibrary, onSelect }) {
  const id = idOf(game);
  const [details, setDetails] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    let active = true;
    axios.get(`/games/game/${encodeURIComponent(id)}`).then(({ data }) => { if (active) setDetails(data); }).catch(() => {});
    return () => { active = false; };
  }, [id]);
  const bannerGame = details || game;
  const banner = imageUrl(bannerGame.hero_image) || imageUrl(bannerGame.background_raw) || imageUrl(bannerGame.background) || imageUrl(bannerGame.header_image) || `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_hero_2x.jpg`;
  const launched = (activity.launched || 0) > (activity.opened || 0);
  const time = launched ? activity.launched : activity.opened;
  return <button type="button" className="community-game-expanded" onClick={onSelect} aria-pressed="true" aria-label={`Filter feed by ${gameNameFor(game)}`}>
    {!imageFailed && <ArtworkImage className="community-game-expanded-background" src={banner} alt="" onError={() => setImageFailed(true)} />}
    <span className="community-game-expanded-shade" />
    <span className="community-game-expanded-content"><span className="community-game-expanded-top"><span className="community-game-expanded-name"><GameAvatar game={game} /><strong>{gameNameFor(game)}</strong></span><span className="community-game-expanded-platforms"><img src="/New%20Assets/Steam.svg" alt="Steam" /><img src="/New%20Assets/Epic%20Games.svg" alt="Epic Games" /><img src="/New%20Assets/Pirate.svg" alt="Pirate" /></span></span><span className="community-game-expanded-bottom"><span>{inLibrary ? "In your library" : game.demo ? "Demo community" : "Community"}</span>{time && <span>{launched ? "Launched" : "Opened"} {relativeTime(time)}</span>}</span></span>
  </button>;
}

function HomieRow({ stream, active }) {
  const [imageFailed, setImageFailed] = useState(false);
  const platform = stream.platform || "youtube";
  const platformName = { youtube: "YouTube", kick: "Kick", twitch: "Twitch" }[platform] || platform;
  return <Link className={`community-homie${active ? " is-active" : ""}`} to={`/community/live/${encodeURIComponent(stream.id)}`} aria-current={active ? "page" : undefined}><span className="community-homie-avatar">{stream.avatarUrl && !imageFailed ? <img src={stream.avatarUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} /> : <span aria-hidden="true">{(stream.creator || "?").charAt(0).toUpperCase()}</span>}</span><span className="community-homie-info"><strong>{stream.creator}</strong><small>{platformName}</small></span><img className="community-homie-platform" src={`https://cdn.simpleicons.org/${platform}/ffffff`} alt="" /></Link>;
}

export default function CommunityFeedHome({ initialCommunity, postId, liveId, explorer }) {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState(readPosts);
  const [activity] = useState(getCommunityActivity);
  const [favoriteCreators, setFavoriteCreators] = useState([]);
  const [selectedGame, setSelectedGame] = useState(initialCommunity || "all");
  const [linkedGame, setLinkedGame] = useState(() => {
    if (!initialCommunity) return null;
    const linked = location.state?.communityGame || getCommunityActivity()[initialCommunity]?.game;
    if (linked && idOf(linked) === initialCommunity) return linked;
    const demo = getDemoPosts().find((post) => post.communityGameId === initialCommunity);
    return demo ? { steam_appid: initialCommunity, name: demo.gameName, demo: true } : /^\d+$/.test(initialCommunity) ? { steam_appid: initialCommunity, name: "Game community" } : null;
  });
  const [linkedError, setLinkedError] = useState("");
  const [postError, setPostError] = useState("");
  const [feedRefreshing, setFeedRefreshing] = useState(false);
  const [threadVersion, setThreadVersion] = useState(0);
  const [rightPanel, setRightPanel] = useState(liveId ? "chat" : "feed");
  const [chatRefreshVersion, setChatRefreshVersion] = useState(0);
  const [streamFullscreen, setStreamFullscreen] = useState(false);
  const [panelWidths, setPanelWidths] = useState({});
  const [draggingDivider, setDraggingDivider] = useState(null);
  const hubRef = useRef(null);
  const gamesRef = useRef(null);
  const dragRef = useRef(null);
  const feedRef = useRef(null);
  const feedScrollRef = useRef(null);
  const refreshTimer = useRef(null);
  const mainRef = useRef(null);
  useEffect(() => {
    let active = true;
    const updateFavorites = (event) => {
      if (event?.detail?.homies) {
        setFavoriteCreators(event.detail.homies);
      } else {
        getFavoriteHomies(true).then((list) => {
          if (active) setFavoriteCreators(Array.isArray(list) ? list : []);
        });
      }
    };
    getFavoriteHomies(true).then((list) => {
      if (active) setFavoriteCreators(Array.isArray(list) ? list : []);
    });
    window.addEventListener(STREAM_FAVORITES_CHANGED, updateFavorites);
    return () => {
      active = false;
      window.removeEventListener(STREAM_FAVORITES_CHANGED, updateFavorites);
    };
  }, []);
  useEffect(() => {
    const syncFullscreen = () => setStreamFullscreen(document.fullscreenElement === hubRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  useEffect(() => { if (!liveId && document.fullscreenElement === hubRef.current) document.exitFullscreen().catch(() => {}); }, [liveId]);
  useEffect(() => () => clearTimeout(refreshTimer.current), []);
  useEffect(() => { setRightPanel(liveId ? "chat" : "feed"); }, [liveId]);
  useEffect(() => { mainRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, [location.pathname]);
  useEffect(() => {
    let active = true;
    getUserLibrary().then((games) => { if (active) setLibrary(Array.isArray(games) ? games : []); }).catch(() => { if (active) setError("Could not load your library games."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!initialCommunity) { setSelectedGame("all"); setLinkedGame(null); setLinkedError(""); return; }
    setSelectedGame(initialCommunity);
    setLinkedError("");
    const linked = location.state?.communityGame || getCommunityActivity()[initialCommunity]?.game;
    const demo = getDemoPosts().find((post) => post.communityGameId === initialCommunity);
    setLinkedGame(linked && idOf(linked) === initialCommunity ? linked : demo ? { steam_appid: initialCommunity, name: demo.gameName, demo: true } : /^\d+$/.test(initialCommunity) ? { steam_appid: initialCommunity, name: "Game community" } : null);
    let active = true;
    const request = /^\d+$/.test(initialCommunity) ? axios.get(`/games/game/${encodeURIComponent(initialCommunity)}`) : axios.get("/games/search", { params: { q: initialCommunity } });
    request.then(({ data }) => {
      if (!active) return;
      const game = Array.isArray(data) ? data.find((item) => gameNameFor(item).toLowerCase() === initialCommunity.toLowerCase()) : data;
      if (game && typeof game === "object" && idOf(game)) { setLinkedGame(game); setSelectedGame(idOf(game)); setLinkedError(""); }
      else if (!/^\d+$/.test(initialCommunity)) setLinkedError("Could not find this game community.");
    }).catch(() => { if (active && !/^\d+$/.test(initialCommunity)) setLinkedError("Could not load this game community."); });
    return () => { active = false; };
  }, [initialCommunity, location.state?.communityGame]);
  useEffect(() => { if (!postId) setPosts(readPosts()); }, [postId]);
  const games = useMemo(() => {
    const result = new Map();
    library.forEach((game) => { if (idOf(game)) result.set(idOf(game), game); });
    Object.entries(activity).forEach(([id, item]) => { if (!result.has(id) && item.game) result.set(id, item.game); });
    getDemoPosts().forEach((post) => { if (!result.has(post.communityGameId)) result.set(post.communityGameId, { steam_appid: post.communityGameId, name: post.gameName, demo: true }); });
    return [...result.values()].sort((a, b) => {
      const aActivity = activity[idOf(a)] || {}; const bActivity = activity[idOf(b)] || {};
      return Math.max(bActivity.opened || 0, bActivity.launched || 0) - Math.max(aActivity.opened || 0, aActivity.launched || 0);
    });
  }, [library, activity]);
  const gameMap = useMemo(() => new Map(games.map((game) => [idOf(game), game])), [games]);
  useEffect(() => {
    const sidebar = gamesRef.current;
    const sections = sidebar?.querySelector(".community-sidebar-sections");
    const list = sidebar?.querySelector(".community-game-list");
    const heading = sidebar?.querySelector("#community-games-heading");
    const homiesHeading = sidebar?.querySelector("#community-homies-heading");
    if (!sections || !list || !heading || !homiesHeading) return;
    const updateSplit = () => {
      const available = sections.clientHeight;
      if (!available) return;
      const headingHeight = heading.getBoundingClientRect().height;
      const target = available / 2;
      const rowHeight = list.querySelector(".community-game-filter")?.getBoundingClientRect().height || 62;
      const rowsHeight = Math.max(0, Math.floor((target - headingHeight) / rowHeight)) * rowHeight;
      const maxGamesHeight = Math.max(0, available - homiesHeading.getBoundingClientRect().height - 44);
      const gamesHeight = Math.round(Math.min(maxGamesHeight, rowsHeight ? headingHeight + rowsHeight : target));
      const value = `${gamesHeight}px`;
      if (sections.style.getPropertyValue("--community-games-height") !== value) sections.style.setProperty("--community-games-height", value);
    };
    updateSplit();
    const observer = new ResizeObserver(updateSplit);
    observer.observe(sections);
    observer.observe(heading);
    observer.observe(homiesHeading);
    list.querySelectorAll(":scope > .community-game-filter, :scope > .community-game-expanded").forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [games, loading, selectedGame]);
  const visiblePosts = posts;
  const syncPosts = () => setPosts((previous) => {
    const latest = readPosts();
    const keyFor = (post) => `${post.communityGameId}:${post.id}`;
    const byKey = new Map(latest.map((post) => [keyFor(post), post]));
    const ordered = previous.flatMap((post) => { const key = keyFor(post); const updated = byKey.get(key); byKey.delete(key); return updated ? [updated] : []; });
    return [...byKey.values(), ...ordered];
  });
  const savePost = (gameId, postId, update) => {
    if (posts.some((post) => post.id === postId && post.demo)) {
      if (updateDemoPost(postId, update)) { syncPosts(); setThreadVersion((version) => version + 1); setPostError(""); return true; }
      setPostError("Could not save your changes on this device."); return false;
    }
    const key = `xplode-community-posts-${gameId}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(data)) throw new Error("Invalid posts");
      localStorage.setItem(key, JSON.stringify(data.map((post) => post.id === postId ? update(post) : post)));
      syncPosts(); setThreadVersion((version) => version + 1); setPostError(""); return true;
    } catch { setPostError("Could not save your changes on this device."); return false; }
  };
  const changeGame = (id) => {
    setSelectedGame(id);
    const target = id === "all" ? "/community/home" : threadUrl(id);
    if (location.pathname !== target) navigate(target, { state: id === "all" ? null : { communityGame: gameMap.get(id) || linkedGame } });
    if (id !== "all") {
      mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  };
  const refreshFeed = () => {
    clearTimeout(refreshTimer.current);
    setFeedRefreshing(true); setPostError("");
    refreshTimer.current = setTimeout(() => {
      setPosts((previous) => {
        const shuffled = readPosts();
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        if (shuffled.length > 1 && shuffled.length === previous.length && shuffled.every((post, index) => post.id === previous[index].id && post.communityGameId === previous[index].communityGameId)) shuffled.push(shuffled.shift());
        return shuffled;
      });
      setFeedRefreshing(false);
    }, 450);
    const feed = feedRef.current;
    feedScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    const page = feed?.closest(".community-page");
    if (page) {
      const top = Math.max(0, page.scrollTop + feed.getBoundingClientRect().top - page.getBoundingClientRect().top - 100);
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      page.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };
  const selected = gameMap.get(selectedGame) || (linkedGame && idOf(linkedGame) === selectedGame ? linkedGame : null);
  const composerGames = selected && !gameMap.has(selectedGame) ? [...games, selected] : games;
  const onPostCreated = () => { setPosts(readPosts()); setThreadVersion((version) => version + 1); };
  const toggleStreamFullscreen = async () => {
    if (document.fullscreenElement === hubRef.current) { await document.exitFullscreen(); return; }
    if (!hubRef.current?.requestFullscreen) throw new Error("Fullscreen unavailable");
    setRightPanel("chat");
    await hubRef.current.requestFullscreen();
  };
  const chatStreamId = liveId || creatorSnapshots.find((creator) => creator.id === "ishowspeed-youtube")?.id || streams[0]?.id;
  const resizePanel = (side, width) => {
    const hub = hubRef.current;
    if (!hub || !gamesRef.current || !feedRef.current) return;
    const gap = parseFloat(getComputedStyle(hub).columnGap) || 0;
    const otherWidth = (side === "left" ? feedRef.current : gamesRef.current).getBoundingClientRect().width;
    const min = side === "left" ? 200 : 280;
    const max = Math.max(min, hub.clientWidth - 2 * gap - otherWidth - 280);
    setPanelWidths((current) => ({ ...current, [side]: Math.round(Math.max(min, Math.min(width, max))) }));
  };
  const divider = (side, label) => <div className={`community-divider community-divider--${side}`} role="separator" aria-label={label} aria-orientation="vertical" tabIndex={0}
    onPointerDown={(event) => { if (event.button !== 0) return; const panel = side === "left" ? gamesRef.current : feedRef.current; dragRef.current = { side, x: event.clientX, width: panel.getBoundingClientRect().width }; setDraggingDivider(side); event.currentTarget.setPointerCapture(event.pointerId); event.preventDefault(); }}
    onPointerMove={(event) => { const drag = dragRef.current; if (drag?.side === side) resizePanel(side, drag.width + (event.clientX - drag.x) * (side === "left" ? 1 : -1)); }}
    onPointerUp={() => { dragRef.current = null; setDraggingDivider(null); }}
    onPointerCancel={() => { dragRef.current = null; setDraggingDivider(null); }}
    onLostPointerCapture={() => { dragRef.current = null; setDraggingDivider(null); }}
    onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); const panel = side === "left" ? gamesRef.current : feedRef.current; const direction = event.key === "ArrowRight" ? 1 : -1; resizePanel(side, panel.getBoundingClientRect().width + direction * (side === "left" ? 1 : -1) * (event.shiftKey ? 40 : 10)); }} />;
  return <div className={`community-hub${draggingDivider ? " is-resizing" : ""}`} ref={hubRef} style={{ ...(panelWidths.left != null ? { "--community-left-width": `${panelWidths.left}px` } : {}), ...(panelWidths.right != null ? { "--community-feed-width": `${panelWidths.right}px` } : {}) }}>
    <aside ref={gamesRef} className="community-game-sidebar" aria-label="My communities and homies"><CommunitySearch /><div className="community-sidebar-sections"><section className="community-sidebar-section" aria-labelledby="community-games-heading"><div className="community-sidebar-heading"><h2 id="community-games-heading" className="community-games-heading">My Communities</h2><button type="button" className="community-sidebar-heading-button" aria-label="My Communities options" title="My Communities options"><ArrowUpRight size={15} aria-hidden="true" /></button></div><div className="community-game-list">{loading ? <div className="community-side-loading"><LoadingIndicator label="Loading your games" small /></div> : <>{error && <p className="community-side-message" role="alert">{error}</p>}{games.length ? games.map((game) => { const id = idOf(game); const item = activity[id] || {}; const launched = (item.launched || 0) > (item.opened || 0); const time = launched ? item.launched : item.opened; return selectedGame === id ? <ExpandedGame key={id} game={game} activity={item} inLibrary={library.some((entry) => idOf(entry) === id)} onSelect={() => changeGame(id)} /> : <button type="button" key={id} className="community-game-filter" onClick={() => changeGame(id)} aria-pressed="false"><GameAvatar game={game} /><span><strong>{gameNameFor(game)}</strong><small>{time ? `${launched ? "Launched" : "Community opened"} · ${relativeTime(time)}` : game.demo ? "Demo community" : "In your library"}</small></span></button>; }) : <p className="community-side-message">Your library games and opened communities will appear here.</p>}</>}</div></section><section className="community-sidebar-section community-homies-section" aria-labelledby="community-homies-heading"><div className="community-sidebar-heading"><h2 id="community-homies-heading" className="community-games-heading">My Homies</h2><button type="button" className="community-sidebar-heading-button" aria-label="My Homies options" title="My Homies options"><ArrowUpRight size={15} aria-hidden="true" /></button></div><div className="community-homies-list">{favoriteCreators.length ? favoriteCreators.map((stream) => <HomieRow key={getStreamFavoriteKey(stream)} stream={stream} active={liveId === stream.id || !!liveId && getStreamFavoriteKey([...streams, ...creatorSnapshots].find((item) => item.id === liveId) || {}) === getStreamFavoriteKey(stream)} />) : <p className="community-side-message">Favorite a streamer to see them here.</p>}</div></section></div></aside>
    {divider("left", "Resize My Communities and live streams")}
    <main className="community-main-view" ref={mainRef} aria-label="Community content">
      <div className={`community-main-content community-main-content--home${liveId ? " community-main-content--live" : ""}`}>
        {liveId ? <LiveStreamPage streamId={liveId} embedded onToggleFullscreen={toggleStreamFullscreen} isFullscreen={streamFullscreen} /> : explorer ? explorer : postId && initialCommunity ? <CommunityPostPage gameId={initialCommunity} selectedPostId={postId} embedded refreshToken={threadVersion} onPostsChanged={onPostCreated} /> : selected ? <CommunityThread key={selectedGame} routeName={selectedGame} initialGame={selected} embedded composer={<CommunityComposer key={selectedGame} user={user} games={composerGames} fixedGame={selectedGame} Picker={CommunityPicker} onCreated={onPostCreated} />} refreshToken={threadVersion} onPostsChanged={onPostCreated} onBack={() => { changeGame("all"); refreshFeed(); }} /> : initialCommunity && selectedGame !== "all" ? <div className="community-state" role={linkedError ? "alert" : undefined}>{linkedError || <LoadingIndicator label="Loading community" />}</div> : null}
      </div>
    </main>
    {divider("right", "Resize live streams and feed")}
    <aside className="community-hub-main" ref={feedRef} aria-label="Community feed">
      <div className="community-fullscreen-chat-label">Live chat</div>
      {chatStreamId && <div className="community-panel-toolbar"><div className="community-panel-switch" role="group" aria-label="Right panel"><button type="button" className={rightPanel === "feed" ? "is-active" : ""} aria-pressed={rightPanel === "feed"} onClick={() => { if (rightPanel === "feed") refreshFeed(); else setRightPanel("feed"); }}>Feed</button><button type="button" className={rightPanel === "chat" ? "is-active" : ""} aria-pressed={rightPanel === "chat"} onClick={() => { if (rightPanel === "chat") setChatRefreshVersion((version) => version + 1); else setRightPanel("chat"); }}>Live chat</button></div><button type="button" className="community-panel-refresh" aria-label={rightPanel === "feed" ? "Refresh feed" : "Refresh live chat"} title={rightPanel === "feed" ? "Refresh feed" : "Refresh live chat"} onClick={() => { if (rightPanel === "feed") refreshFeed(); else setChatRefreshVersion((version) => version + 1); }}><RefreshCw size={16} aria-hidden="true" /></button></div>}
      {chatStreamId && <div className="community-stream-chat" hidden={rightPanel !== "chat"}><LiveChat key={`${chatStreamId}-${chatRefreshVersion}`} streamId={chatStreamId} showHeading={false} /></div>}
      <div className="community-feed-scroll" ref={feedScrollRef} role="region" aria-label="Feed posts" tabIndex={0} hidden={!!chatStreamId && rightPanel !== "feed"}>
      {postError && <p className="community-error" role="alert">{postError}</p>}
      {visiblePosts.length ? <div className="community-hub-posts">{visiblePosts.map((post) => { const id = post.communityGameId; const game = gameMap.get(id) || { steam_appid: id, name: post.gameName || `Game ${id}` }; return <CommunityPost key={`${id}-${post.id}`} game={game} post={post} clickable onComment={(postId, body) => savePost(id, postId, (item) => ({ ...item, comments: [...(item.comments || []), { id: crypto.randomUUID(), body, createdAt: new Date().toISOString() }] }))} onVote={(postId, vote) => savePost(id, postId, (item) => ({ ...item, vote }))} />; })}</div> : <div className="community-hub-empty"><MessageCircle size={25} /><h3>No posts here yet</h3><p>Explore a game community to start a discussion.</p><Link to="/community/home">Explore games <ArrowUpRight size={15} /></Link></div>}
      </div>
      <div className="community-feed-composer-dock" hidden={!!chatStreamId && rightPanel !== "feed"}>
        <CommunityComposer user={user} games={composerGames} Picker={CommunityPicker} onCreated={onPostCreated} />
      </div>
      {feedRefreshing && rightPanel === "feed" && <div className="community-feed-refresh-overlay"><LoadingIndicator label="Refreshing feed" /></div>}
    </aside>
  </div>;
}

function gameNameFor(game) { return game.name || game.title || "Game"; }
