import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Heart, Maximize2, Minimize2 } from "lucide-react";
import streams from "../data/liveStreamDemo.json";
import creatorSnapshots from "../data/liveCreatorsSnapshot.json";
import { getStreamFavoriteKey, setStreamFavorite } from "../utils/streamFavorites";
import LoadingIndicator from "../components/LoadingIndicator";
import "./live-streams.css";

let youtubeApiPromise;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;
  youtubeApiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) { script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(script); }
    script.addEventListener("error", () => { youtubeApiPromise = undefined; reject(new Error("YouTube player could not load.")); }, { once: true });
  });
  return youtubeApiPromise;
}

function YouTubePlayer({ stream, onMetadata }) {
  const mount = useRef(null);
  const player = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    loadYouTubeApi().then((YT) => {
      if (!active || !mount.current) return;
      const target = document.createElement("div");
      mount.current.appendChild(target);
      player.current = new YT.Player(target, {
        videoId: stream.videoId,
        playerVars: { origin: window.location.origin, playsinline: 1, controls: 1 },
        events: {
          onReady: (event) => { if (active) { setReady(true); event.target.mute(); event.target.playVideo(); const info = event.target.getVideoData?.(); if (info?.title || info?.author) onMetadata({ title: info.title, creator: info.author }); } },
          onStateChange: (event) => { if (active) { const info = event.target.getVideoData?.(); if (info?.title || info?.author) onMetadata({ title: info.title, creator: info.author }); } },
          onError: () => { if (active) setError("This video can’t be played here. You can watch it on YouTube."); },
        },
      });
    }).catch(() => { if (active) setError("The YouTube player couldn’t load. Please try the link below."); });
    return () => { active = false; player.current?.destroy(); player.current = null; };
  }, [stream.videoId, onMetadata]);
  return <div className="live-player-shell"><div className="live-player-frame"><div ref={mount} className="live-player-mount" /></div>{!ready && !error && <div className="live-player-loading"><LoadingIndicator label="Loading YouTube player" small /></div>}{error && <p className="live-player-error" role="alert">{error}</p>}</div>;
}

export function LiveChat({ streamId, showHeading = true }) {
  const stream = [...streams, ...creatorSnapshots].find((item) => item.id === streamId);
  if (!stream) return <div className="live-chat-empty"><p>Chat is unavailable for this stream.</p></div>;
  const platform = stream.platform || "youtube";
  const channel = encodeURIComponent(stream.channel || "");
  const parent = encodeURIComponent(window.location.hostname);
  const platformName = { youtube: "YouTube", kick: "Kick", twitch: "Twitch" }[platform];
  const chatUrl = platform === "youtube" ? `https://www.youtube.com/live_chat?v=${encodeURIComponent(stream.videoId)}&embed_domain=${parent}&dark_theme=1` : platform === "twitch" ? `https://www.twitch.tv/embed/${channel}/chat?parent=${parent}&darkpopout` : `https://kick.com/popout/${channel}/chat`;
  return <div className="live-chat-panel">{showHeading && <div className="live-chat-heading"><h2>Live chat</h2></div>}<iframe className="live-chat-embed" title={`${platformName} live chat`} src={chatUrl} referrerPolicy="strict-origin-when-cross-origin" /></div>;
}

export default function LiveStreamPage({ streamId: embeddedStreamId, embedded = false, onToggleFullscreen, isFullscreen = false }) {
  const params = useParams();
  const location = useLocation();
  const streamId = embeddedStreamId || params.streamId;
  const [metadata, setMetadata] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [actionError, setActionError] = useState("");
  const playerStage = useRef(null);
  const stream = [...streams, ...creatorSnapshots].find((item) => item.id === streamId);
  const requestedReturn = location.state?.returnTo;
  const returnTo = typeof requestedReturn === "string" && requestedReturn.startsWith("/community/") && !requestedReturn.startsWith("/community/live/") ? requestedReturn : "/community/home";
  const returnState = location.state?.returnState || null;
  const favoriteKey = stream ? getStreamFavoriteKey(stream) : null;
  useEffect(() => { setMetadata(null); }, [streamId]);
  useEffect(() => { try { setFavorite(!!favoriteKey && localStorage.getItem(favoriteKey) === "true"); } catch { setFavorite(false); } setActionError(""); }, [favoriteKey]);
  if (!stream) return <div className={`live-page${embedded ? " live-page--embedded" : ""}`}><div className="live-page-content"><Link className="live-back" to={returnTo} state={returnState} aria-label="Go back" title="Go back"><ArrowLeft size={18} /></Link><div className="live-not-found"><h1>Stream not found</h1><p>This preview is no longer available.</p><Link to={returnTo} state={returnState}>Go back</Link></div></div></div>;

  const platform = stream.platform || "youtube";
  const channel = encodeURIComponent(stream.channel || "");
  const parent = encodeURIComponent(window.location.hostname);
  const platformName = { youtube: "YouTube", kick: "Kick", twitch: "Twitch" }[platform];
  const playerUrl = platform === "kick" ? `https://player.kick.com/${channel}?autoplay=true&muted=true` : `https://player.twitch.tv/?channel=${channel}&parent=${parent}&autoplay=true&muted=true`;
  const streamOrder = [streams[0], ...creatorSnapshots.filter((item) => !item.videoId || item.videoId !== streams[0]?.videoId)].filter(Boolean);
  let streamIndex = streamOrder.findIndex((item) => item.id === streamId || (stream.videoId && item.platform === stream.platform && item.videoId === stream.videoId));
  if (streamIndex < 0) { streamOrder.push(stream); streamIndex = streamOrder.length - 1; }
  const previous = streamIndex > 0 ? streamOrder[streamIndex - 1] : null;
  const next = streamIndex >= 0 ? streamOrder[streamIndex + 1] : null;
  const toggleFavorite = () => {
    const value = !favorite;
    try { setStreamFavorite(stream, value); setFavorite(value); setActionError(""); }
    catch { setActionError("Could not save your favorite on this device."); }
  };
  const fullscreen = async () => {
    try { if (onToggleFullscreen) await onToggleFullscreen(); else { if (!playerStage.current?.requestFullscreen) throw new Error("Fullscreen unavailable"); await playerStage.current.requestFullscreen(); } setActionError(""); }
    catch { setActionError("Fullscreen is unavailable in this browser."); }
  };

  return <div className={`live-page${embedded ? " live-page--embedded" : ""}`}><div className="live-page-content"><div className="live-stream-toolbar"><Link className="live-back" to={returnTo} state={returnState} aria-label="Go back" title="Go back"><ArrowLeft size={18} /></Link><div className="live-stream-toolbar-actions"><button type="button" className="live-stream-icon-button" onClick={fullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen with chat"} title={isFullscreen ? "Exit fullscreen" : "Fullscreen with chat"}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>{previous ? <Link className="live-stream-icon-button" to={`/community/live/${encodeURIComponent(previous.id)}`} state={{ returnTo, returnState }} aria-label={`Previous stream: ${previous.creator}`} title="Previous stream"><ChevronUp size={19} /></Link> : <button type="button" className="live-stream-icon-button" disabled aria-label="No previous stream"><ChevronUp size={19} /></button>}{next ? <Link className="live-stream-icon-button" to={`/community/live/${encodeURIComponent(next.id)}`} state={{ returnTo, returnState }} aria-label={`Next stream: ${next.creator}`} title="Next stream"><ChevronDown size={19} /></Link> : <button type="button" className="live-stream-icon-button" disabled aria-label="No next stream"><ChevronDown size={19} /></button>}</div></div><div className="live-layout"><section className="live-video-section" aria-label={`${platformName} video`}>
    <div ref={playerStage} className="live-player-stage">{platform === "youtube" ? <YouTubePlayer key={stream.id} stream={stream} onMetadata={setMetadata} /> : <div className="live-player-frame"><iframe className="live-platform-player" title={`${platformName} stream from ${stream.creator}`} src={playerUrl} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>}</div>
    <div className="live-page-heading"><h1>{metadata?.title || stream.title}</h1><div className="live-page-creator"><p>{metadata?.creator || stream.creator}{stream.game !== platformName && ` · ${stream.game}`}</p><button type="button" className={`live-stream-favorite${favorite ? " is-favorite" : ""}`} onClick={toggleFavorite} aria-pressed={favorite} aria-label={favorite ? "Remove from My Homies" : "Add to My Homies"} title={favorite ? "Remove from My Homies" : "Add to My Homies"}><Heart size={16} fill={favorite ? "currentColor" : "none"} aria-hidden="true" /><span>Fav Homie</span></button></div>{actionError && <p className="live-action-error" role="alert">{actionError}</p>}</div>
    <aside className="live-ad-placeholder" aria-label="Advertisement"><span>Advertisement</span></aside>
  </section>{!embedded && <LiveChat streamId={streamId} />}</div></div></div>;
}
