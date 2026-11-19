import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";
import axios from "../utils/axios";
import { GameLogo } from "./StoreShowcase";
import ArtworkImage from "./ArtworkImage";
import LoadingIndicator from "./LoadingIndicator";
import streams from "../data/liveStreamDemo.json";
import creatorSnapshots from "../data/liveCreatorsSnapshot.json";
import "../pages/live-streams.css";

const compactViewers = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export default function LiveStreams({ vertical = false, limit, exploreTo = "/community/home", hideHeading = false, previewOverlay = false, featuredStream }) {
  const track = useRef(null);
  const [storeGames, setStoreGames] = useState([]);
  const [activePreview, setActivePreview] = useState(null);
  useEffect(() => {
    let active = true;
    axios.get("/games/home").then(({ data }) => { if (active && Array.isArray(data)) setStoreGames(data); }).catch(() => {});
    return () => { active = false; };
  }, []);
  const move = (direction) => track.current?.scrollBy({ left: direction * Math.max(220, track.current.clientWidth * .7), behavior: "smooth" });
  return <section className={`live-strip${vertical ? " live-strip-vertical" : ""}`} aria-label="Live streams">{!hideHeading && <div className="live-strip-heading"><h2>Live streams</h2>{vertical ? <Link className="live-strip-explore" to={exploreTo} aria-label={exploreTo === "/community/streams" ? "See all live streams" : "Explore game communities"}><Plus size={18} /></Link> : <div><button type="button" onClick={() => move(-1)} aria-label="Scroll streams left"><ChevronLeft size={18} /></button><button type="button" onClick={() => move(1)} aria-label="Scroll streams right"><ChevronRight size={18} /></button></div>}</div>}
    <div className="live-strip-track" ref={track} tabIndex={0} aria-label="Streams">{(featuredStream ? [featuredStream] : limit ? streams.slice(0, limit) : [...streams, ...creatorSnapshots]).map((stream, index) => {
      const game = storeGames.find((item) => Number(item.steam_appid || item.appid) === stream.steamAppId && item.category === "sliders") || storeGames.find((item) => Number(item.steam_appid || item.appid) === stream.steamAppId) || { steam_appid: stream.steamAppId, name: stream.game };
      return <LiveStreamCard key={stream.id} stream={stream} game={game} autoStart={index === 0} activePreview={activePreview} setActivePreview={setActivePreview} previewOverlay={previewOverlay} />;
    })}</div>
  </section>;
}

function imageValue(value) {
  if (Array.isArray(value)) return imageValue(value[0]);
  if (typeof value === "string") return value;
  return value?.url || value?.thumb || "";
}

function LiveStreamCard({ stream, game, autoStart, activePreview, setActivePreview, previewOverlay }) {
  const cardRef = useRef(null);
  const hoverTimer = useRef(null);
  const [autoPreview, setAutoPreview] = useState(false);
  const preview = autoStart ? autoPreview : activePreview?.id === stream.id;
  const autoPlaying = autoStart && autoPreview;
  const [visible, setVisible] = useState(false);
  const [showIntroLoader, setShowIntroLoader] = useState(() => autoStart && previewOverlay);
  const artwork = imageValue(game.hero_image) || imageValue(game.background_raw) || imageValue(game.background) || imageValue(game.header_image) || (stream.videoId ? `https://i.ytimg.com/vi/${stream.videoId}/hqdefault.jpg` : stream.steamAppId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${stream.steamAppId}/library_hero_2x.jpg` : stream.avatarUrl);
  const [failedArtwork, setFailedArtwork] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const fallback = stream.videoId ? `https://i.ytimg.com/vi/${stream.videoId}/hqdefault.jpg` : stream.steamAppId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${stream.steamAppId}/header.jpg` : stream.avatarUrl;
  const logoKey = imageValue(game.logos) || imageValue(game.logo) || imageValue(game.logo_image) || "steam";
  const platform = stream.platform || "youtube";
  const platformName = { youtube: "YouTube", kick: "Kick", twitch: "Twitch" }[platform];
  const channel = encodeURIComponent(stream.channel || "");
  const parent = encodeURIComponent(window.location.hostname);
  const previewUrl = platform === "youtube" ? `https://www.youtube.com/embed/${encodeURIComponent(stream.videoId)}?autoplay=1&mute=${autoPlaying ? 0 : 1}&controls=${autoPlaying ? 1 : 0}&playsinline=1&origin=${encodeURIComponent(window.location.origin)}` : platform === "kick" ? `https://player.kick.com/${channel}?autoplay=true&muted=${autoPlaying ? "false" : "true"}` : `https://player.twitch.tv/?channel=${channel}&parent=${parent}&autoplay=true&muted=${autoPlaying ? "false" : "true"}`;
  useEffect(() => {
    if (!autoStart || !previewOverlay) return;
    const timer = setTimeout(() => setShowIntroLoader(false), 6000);
    return () => clearTimeout(timer);
  }, [autoStart, previewOverlay]);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  useEffect(() => {
    if (!autoStart) return;
    const frame = requestAnimationFrame(() => {
      const bounds = cardRef.current?.getBoundingClientRect();
      const largeEnough = bounds && (platform !== "youtube" || (bounds.width >= 200 && bounds.height >= 200)) && (platform !== "twitch" || (bounds.width >= 400 && bounds.height >= 300));
      if (largeEnough) setAutoPreview(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [autoStart, platform]);
  useEffect(() => {
    if (!preview || !cardRef.current) { setVisible(false); return; }
    const keepPlayingOffscreen = autoStart && previewOverlay;
    const updateVisibility = (entries) => setVisible((wasVisible) => document.visibilityState === "visible" && ((wasVisible && (keepPlayingOffscreen || entries[0].intersectionRatio > 0)) || entries[0].intersectionRatio >= .6));
    const observer = new IntersectionObserver(updateVisibility, { threshold: [0, .6, 1] });
    observer.observe(cardRef.current);
    const hideWhenBackgrounded = () => {
      if (document.visibilityState !== "visible") {
        setVisible(false);
        if (!autoStart) setActivePreview((current) => current?.id === stream.id ? null : current);
      } else if (cardRef.current) {
        observer.disconnect();
        observer.observe(cardRef.current);
      }
    };
    document.addEventListener("visibilitychange", hideWhenBackgrounded);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hideWhenBackgrounded); };
  }, [preview, autoStart, previewOverlay, setActivePreview, stream.id]);
  const startPreview = () => {
    if (autoStart) return;
    clearTimeout(hoverTimer.current);
    if (window.innerWidth < 900 || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds || (platform === "youtube" && (bounds.width < 200 || bounds.height < 200)) || (platform === "twitch" && (bounds.width < 400 || bounds.height < 300))) return;
    hoverTimer.current = setTimeout(() => setActivePreview((current) => current?.id === stream.id ? current : { id: stream.id, auto: false }), 500);
  };
  const stopPreview = () => {
    if (autoStart) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => { if (!cardRef.current?.matches(":hover")) setActivePreview((current) => current?.id === stream.id ? null : current); }, 100);
  };
  return <div ref={cardRef} className={`live-card-host${preview ? " live-card-host--preview" : ""}`} onMouseEnter={startPreview} onMouseLeave={stopPreview}>
    {preview ? <div className="live-card-preview">{visible && <iframe src={previewUrl} title={`${platformName} stream preview from ${stream.creator}`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}{previewOverlay && <Link className="live-preview-overlay" to={`/community/live/${encodeURIComponent(stream.id)}`} aria-label={`Open ${platformName} stream from ${stream.creator}`}><span className="live-preview-overlay-content"><span>STREAM PREVIEW</span><span className="live-preview-title-row"><strong>Watch stream</strong><span className="live-card-platform live-preview-platform" aria-hidden="true"><img src="/New%20Assets/favicon-white.svg" alt="" /><span>×</span><img src={`https://cdn.simpleicons.org/${platform}/ffffff`} alt="" /></span></span><span className="live-preview-overlay-action">Open stream <ArrowUpRight size={15} aria-hidden="true" /></span></span></Link>}</div> : <Link className="wishlist-card live-strip-card" to={`/community/live/${encodeURIComponent(stream.id)}`} aria-label={`Watch test stream from the ${stream.game} card`}>
    <ArtworkImage className="wishlist-image" src={failedArtwork === artwork ? fallback : artwork} alt="" loading="lazy" onError={() => setFailedArtwork(artwork)} />
    <span className="wishlist-shade" />
    <span className="live-card-viewers" aria-label={Number.isFinite(stream.viewerCount) ? `${stream.viewerCount.toLocaleString()} sample viewers` : "Viewer count unavailable"}><Eye size={15} aria-hidden="true" />{Number.isFinite(stream.viewerCount) ? compactViewers.format(stream.viewerCount) : "—"}</span>
    <div className="wishlist-content"><GameLogo key={`${stream.steamAppId}-${logoKey}`} game={game} variant="wishlist" /><div className="wishlist-bottom live-card-bottom"><div className="live-card-creator" aria-label={stream.creator}>{stream.avatarUrl && !avatarFailed ? <img src={stream.avatarUrl} alt="" loading="lazy" onError={() => setAvatarFailed(true)} /> : <span className="live-card-avatar-fallback" aria-hidden="true">{stream.creator?.charAt(0).toUpperCase()}</span>}<p className="live-card-title">{stream.title}</p></div><span className="live-card-platform" aria-label={`Xplode and ${platformName}`}><img src="/New%20Assets/favicon-white.svg" alt="" /><span aria-hidden="true">×</span><img src={`https://cdn.simpleicons.org/${platform}/ffffff`} alt="" /></span></div></div>
  </Link>}{showIntroLoader && <div className="live-preview-intro-loader"><LoadingIndicator label="Loading stream preview" /></div>}</div>;
}
