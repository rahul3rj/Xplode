import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Play, Plus, Star, X } from "lucide-react";
import DetailsCommunity from "../components/DetailsCommunity";
import { GameLogo, StoreDrawer, WishlistShowcase } from "../components/StoreShowcase";
import StoreFooter from "../components/StoreFooter";
import LoadingIndicator from "../components/LoadingIndicator";
import ArtworkImage from "../components/ArtworkImage";
import axios from "../utils/axios";
import { addToLibrary, removeFromLibrary, getUserLibrary, addToFavorite, removeFromFavorite, getUserFavorite, requireAuth } from "../utils/addToLibrary";
import "./details.css";

const imageValue = (value) => Array.isArray(value) ? imageValue(value[0]) : typeof value === "string" ? value : value?.url || value?.thumb || "";
const listValue = (value) => Array.isArray(value) ? value.map((item) => typeof item === "string" ? item : item?.description || item?.name).filter(Boolean).join(", ") : typeof value === "string" ? value : "";
const plainText = (html) => {
  if (!html || typeof html !== "string") return "";
  const doc = new DOMParser().parseFromString(html.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/li>/gi, "\n"), "text/html");
  doc.querySelectorAll("video, source, script, style").forEach((el) => el.remove());
  return doc.body.textContent.trim();
};

function ReviewSection({ appid }) {
  const storageKey = `xplode-review-${appid}`;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      setSaved(stored && stored.rating >= 1 && stored.rating <= 5 ? stored : null);
      setRating(stored?.rating || 0);
      setReview(stored?.review || "");
    } catch { setSaved(null); setRating(0); setReview(""); }
    setMessage("");
  }, [storageKey]);

  const save = (event) => {
    event.preventDefault();
    if (!rating) { setMessage("Choose a star rating first."); return; }
    const entry = { rating, review: review.trim() };
    try { localStorage.setItem(storageKey, JSON.stringify(entry)); setSaved(entry); setMessage("Your review was saved on this device."); }
    catch { setMessage("Your review could not be saved on this device."); }
  };

  return <section className="details-reviews" id="reviews" aria-labelledby="reviews-title">
    <div className="details-section-head"><h2 id="reviews-title">Reviews</h2><span>Your rating</span></div>
    <div className="details-review-layout">
      <div className="details-review-summary"><span className="details-review-number">{saved ? `${saved.rating}.0` : "—"}</span><div><div className="details-stars" aria-label={saved ? `${saved.rating} out of 5 stars` : "No rating yet"}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={19} fill={saved?.rating >= n ? "currentColor" : "none"} />)}</div><p>{saved ? "Your saved rating" : "No rating yet"}</p></div></div>
      <form className="details-review-form" onSubmit={save}>
        <label>Your rating</label><div className="details-rating-input" role="radiogroup" aria-label="Your star rating">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} ${n === 1 ? "star" : "stars"}`} onClick={() => { setRating(n); setMessage(""); }}><Star size={24} fill={rating >= n ? "currentColor" : "none"} /></button>)}</div>
        <label htmlFor="game-review">Your review <span>optional</span></label><textarea id="game-review" value={review} maxLength={1000} onChange={(e) => setReview(e.target.value)} placeholder="Share your experience with this game" />
        <div className="details-review-footer"><p>Saved only on this device. Reviews are not shared yet.</p><button type="submit">{saved ? "Update review" : "Save review"}</button></div>{message && <p className="details-review-message" role="status">{message}</p>}
      </form>
    </div>
    {saved?.review && <div className="details-saved-review"><div><strong>Your review</strong><span>{saved.rating} / 5</span></div><p>{saved.review}</p></div>}
  </section>;
}

function MediaGallery({ game }) {
  const screenshots = Array.isArray(game.screenshots) ? game.screenshots.map((item) => ({ type: "image", src: item.path_full || item.path_thumbnail || item.url, thumb: item.path_thumbnail || item.path_full || item.url })).filter((item) => item.src) : [];
  const movies = Array.isArray(game.movies) ? game.movies.map((item) => ({ type: "video", src: item.webm?.max || item.webm?.["480"] || item.mp4?.max || item.mp4?.["480"], thumb: item.thumbnail })).filter((item) => item.src) : [];
  const items = [...movies, ...screenshots];
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const current = items[active] || items[0];
  useEffect(() => {
    if (!viewerOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") setViewerOpen(false);
      if (event.key === "ArrowRight" && items.length > 1) setActive((index) => (index + 1) % items.length);
      if (event.key === "ArrowLeft" && items.length > 1) setActive((index) => (index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerOpen, items.length]);
  if (!items.length) return null;
  return <div className="details-media" aria-label="Screenshots and videos">
    <div className="details-media-heading"><span>Screenshots &amp; videos</span><span>{items.length}</span></div>
    <div className="details-media-thumbs">{items.map((item, i) => <button key={`${item.src}-${i}`} type="button" onClick={() => { setActive(i); setViewerOpen(true); }} aria-label={`Open ${item.type === "video" ? "video" : "screenshot"} ${i + 1}`}>
      {item.thumb && <ArtworkImage src={item.thumb} alt="" loading="lazy" />}{item.type === "video" && <span className="details-media-play"><Play size={16} fill="currentColor" aria-hidden="true" /></span>}
    </button>)}</div>
    {viewerOpen && current && createPortal(<div className="details-media-overlay" role="dialog" aria-modal="true" aria-label={`${game.name} media viewer`} onClick={() => setViewerOpen(false)}>
      <button className="details-media-close" type="button" onClick={() => setViewerOpen(false)} aria-label="Close media viewer"><X size={22} /></button>
      <div className="details-media-viewer" onClick={(event) => event.stopPropagation()}>
        {current.type === "video" ? <video key={current.src} controls autoPlay poster={current.thumb} src={current.src} /> : <ArtworkImage src={current.src} alt={`${game.name} screenshot ${active + 1}`} />}
        {items.length > 1 && <><button className="details-media-nav is-previous" type="button" onClick={() => setActive((active - 1 + items.length) % items.length)} aria-label="Previous media"><ChevronLeft size={24} /></button><button className="details-media-nav is-next" type="button" onClick={() => setActive((active + 1) % items.length)} aria-label="Next media"><ChevronRight size={24} /></button></>}
        <span className="details-media-count">{active + 1} / {items.length}</span>
      </div>
    </div>, document.body)}
  </div>;
}

function AboutGame({ game }) {
  const [expanded, setExpanded] = useState(false);
  const text = plainText(game.about_the_game) || plainText(game.description) || "No description available.";
  let preview = text.slice(0, 500).split("\n").slice(0, 6).join("\n");
  if (preview.length === 500 && /\S/.test(text[500] || "")) preview = preview.replace(/\s+\S*$/, "");
  const truncated = preview.length < text.length;
  const display = truncated && !expanded ? `${preview.trimEnd()}…` : text;

  return <section className="details-about"><div className="details-section-head"><h2>About this game</h2></div><p id="about-game-text">{display}</p>{truncated && <button type="button" className="details-about-toggle" aria-expanded={expanded} aria-controls="about-game-text" onClick={() => setExpanded((value) => !value)}>{expanded ? "Show less" : "Show more"}<ChevronDown size={15} aria-hidden="true" /></button>}</section>;
}

function RecommendedGames() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    let active = true;
    axios.get("/games/home").then((response) => {
      if (active) setGames(Array.isArray(response.data) ? response.data : []);
    }).catch((error) => console.error("Failed to fetch recommended games:", error));
    return () => { active = false; };
  }, []);

  const wishlistGames = [4115450, 4435490, 3357650, 2358720].map((id) =>
    games.find((game) => Number(game.steam_appid) === id && game.category === "sliders") || games.find((game) => Number(game.steam_appid) === id)
  ).filter(Boolean);
  return <div className="details-recommendations">
    <StoreDrawer title="Trending Games" games={games.filter((game) => game.category?.trim() === "trending")} />
    <WishlistShowcase games={wishlistGames} />
    <StoreDrawer title="Top Games" games={games.filter((game) => game.category?.trim() === "top_games")} />
  </div>;
}

export default function DetailsPage() {
  const { appid } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [library, setLibrary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [heroFailed, setHeroFailed] = useState(false);

  useEffect(() => {
    let active = true;
    document.querySelector(".game-details-scroll")?.scrollTo({ top: 0 });
    setLoading(true); setError(""); setGame(null); setHeroFailed(false);
    axios.get(`/games/game/${appid}`).then((res) => { if (active) setGame(res.data); }).catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load this game."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [appid]);
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    let active = true;
    Promise.allSettled([getUserLibrary(), getUserFavorite()]).then(([owned, wished]) => {
      if (!active) return;
      if (owned.status === "fulfilled" && Array.isArray(owned.value)) setLibrary(owned.value);
      if (wished.status === "fulfilled" && Array.isArray(wished.value)) setFavorites(wished.value);
    });
    return () => { active = false; };
  }, []);

  const id = game?.steam_appid || game?.appid || appid;
  const inLibrary = library.some((item) => String(item.steam_appid) === String(id));
  const inFavorites = favorites.some((item) => String(item.steam_appid) === String(id));
  const toggle = async (kind) => {
    if (!requireAuth() || busy) return;
    const isLibrary = kind === "library";
    const present = isLibrary ? inLibrary : inFavorites;
    if (present && !window.confirm(`Remove this game from your ${isLibrary ? "library" : "wishlist"}?`)) return;
    const data = { steam_appid: id, name: game.name || game.title, portrait_image: game.portrait_image || game.capsule_image || game.header_image, hero_image: { url: imageValue(game.hero_image) || game.background_raw || game.background || game.header_image, thumb: imageValue(game.hero_image) || game.background || game.header_image }, developers: game.developers || game.developer, publishers: game.publishers || [game.publisher].filter(Boolean), categories: game.categories || [], movies: game.movies || [] };
    setBusy(kind);
    try {
      const setList = isLibrary ? setLibrary : setFavorites;
      if (present) { await (isLibrary ? removeFromLibrary(id) : removeFromFavorite(id)); setList((previous) => previous.filter((item) => String(item.steam_appid) !== String(id))); }
      else { const result = await (isLibrary ? addToLibrary(data) : addToFavorite(data)); setList((previous) => [...previous, result.game || data]); }
    } catch (err) { window.alert(err?.message || (typeof err === "string" ? err : "Unable to update your collection.")); }
    finally { setBusy(""); }
  };

  if (loading) return <div className="details-state"><LoadingIndicator label="Loading game" /></div>;
  if (error || !game) return <div className="details-state"><p>{error || "Game not found."}</p><button onClick={() => navigate(-1)}>Go back</button></div>;
  const name = game.name || game.title || "Game";
  const hero = imageValue(game.hero_image) || game.background_raw || game.background || game.header_image;
  const genres = Array.isArray(game.genres) ? game.genres.map((g) => typeof g === "string" ? g : g.description || g.name).filter(Boolean) : [];
  const downloads = [
    { name: "Steam", icon: "/New Assets/Steam.svg", href: `https://store.steampowered.com/app/${id}/` },
    { name: "Epic Games", icon: "/New Assets/Epic Games.svg", href: `https://store.epicgames.com/en-US/browse?q=${encodeURIComponent(name)}` },
    { name: "Xbox", icon: "/Slider/Xbox.svg", href: `https://www.xbox.com/en-us/search?q=${encodeURIComponent(name)}` },
    { name: "Pirate", icon: "/New Assets/Pirate.svg" },
  ];
  const requirements = game.pc_requirements || {};
  return <div className="game-details-page">
    <section className="details-hero">
      {!heroFailed && <ArtworkImage className="details-hero-image" src={hero || `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_hero_2x.jpg`} alt="" fetchPriority="high" onError={() => setHeroFailed(true)} />}
      <div className="details-hero-content"><div className="details-logo"><GameLogo key={id} game={game} variant="details" /></div><div className="details-genres">{genres.slice(0, 3).map((genre) => <span key={genre}>{genre}</span>)}</div><p>{plainText(game.description || game.short_description)}</p><div className="details-hero-actions"><button className="details-action-primary" type="button" disabled={!!busy} onClick={() => toggle("library")}>{inLibrary ? <Check size={17} /> : <Plus size={17} />}{inLibrary ? "In library" : "Add game"}</button><button className="details-action-secondary" type="button" disabled={!!busy} onClick={() => toggle("wishlist")}><Heart size={17} fill={inFavorites ? "currentColor" : "none"} />{inFavorites ? "Wishlisted" : "Wishlist"}</button><a className="details-action-secondary" href="#reviews"><Star size={17} /> Rate</a></div></div>
      <MediaGallery key={appid} game={game} />
    </section>
    <div className="details-body">
    <div className="details-information"><section className="details-downloads"><div className="details-section-head"><h2>Download options</h2></div><div className="details-download-list">{downloads.map((option) => <div className="details-download-row" key={option.name}><div><img src={option.icon} alt="" /><span>{option.name}</span></div>{option.href ? <a href={option.href} target="_blank" rel="noopener noreferrer">Visit store <ArrowUpRight size={15} /></a> : <span className="details-unavailable">Unavailable</span>}</div>)}</div></section><section className="details-metadata"><div className="details-section-head"><h2>Game details</h2></div><dl>{[["Release date", typeof game.release_date === "object" ? game.release_date?.date : game.release_date], ["Developer", listValue(game.developers || game.developer)], ["Publisher", listValue(game.publishers || game.publisher)], ["Genres", genres.join(", ")]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not available"}</dd></div>)}</dl></section></div>
    <ReviewSection key={appid} appid={appid} />
    <div className="h-[50svh] w-full flex justify-start items-start mb-15"><DetailsCommunity game={game} appid={game.steam_appid} /></div>
    <AboutGame key={appid} game={game} />
    {(requirements.minimum || requirements.recommended) && <section className="details-requirements"><div className="details-section-head"><h2>System requirements</h2></div><div>{[["Minimum", requirements.minimum], ["Recommended", requirements.recommended]].filter(([, value]) => value).map(([label, value]) => <article key={label}><h3>{label}</h3><p>{plainText(value)}</p></article>)}</div></section>}
    <RecommendedGames />
    <StoreFooter />
    </div>
  </div>;
}
