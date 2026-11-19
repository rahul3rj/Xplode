import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, Navigate, useLocation, useMatch } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../utils/axios";
import LoadingIndicator from "../components/LoadingIndicator";
import CommunityFeedHome from "../components/CommunityFeedHome";
import ArtworkImage from "../components/ArtworkImage";
import LiveStreams from "../components/LiveStreams";
import { GameLogo } from "../components/StoreShowcase";
import { storePortraitArtwork } from "../utils/libraryArtwork";
import creatorSnapshots from "../data/liveCreatorsSnapshot.json";
import "./community.css";

const gameId = (game) => game.steam_appid || game.appid || game.id;
const gameName = (game) => game.name || game.title || "Untitled game";
const imageValue = (value) => Array.isArray(value) ? imageValue(value[0]) : typeof value === "string" ? value : value?.url || value?.thumb || "";
const cover = (game) => imageValue(game.portrait_image) || imageValue(game.portraitUrl) || imageValue(game.header_image) || imageValue(game.capsule_image);
const hero = (game) => imageValue(game.hero_image) || imageValue(game.background_raw) || imageValue(game.background) || (gameId(game) ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId(game)}/library_hero_2x.jpg` : "") || imageValue(game.header_image);
const description = (game) => typeof (game.short_description || game.description || game.desc) === "string" ? (game.short_description || game.description || game.desc).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
const communityUrl = (game) => `/community/${encodeURIComponent(gameId(game))}`;
const uniqueGames = (games) => [...new Map(games.filter((game) => gameId(game)).map((game) => [String(gameId(game)), game])).values()];

function GameCard({ game }) {
  const [failed, setFailed] = useState(false);
  const image = failed ? imageValue(game.header_image) || cover(game) : hero(game);
  return <Link className="community-feature-card" to={communityUrl(game)} state={{ communityGame: game }} aria-label={`Visit ${gameName(game)} community`}>{image && <ArtworkImage className="community-feature-image" src={image} alt="" loading="lazy" onError={() => setFailed(true)} />}<span className="community-feature-shade" /><div className="community-feature-content"><GameLogo game={game} variant="wishlist" /><div className="community-feature-bottom"><span className="community-feature-description">{description(game) || `Join the ${gameName(game)} community.`}</span><span className="community-feature-action">View community <ArrowUpRight size={14} aria-hidden="true" /></span></div></div></Link>;
}

function PosterCard({ game }) {
  const [imageIndex, setImageIndex] = useState(0);
  const sources = [...new Set([...storePortraitArtwork(game), gameId(game) ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId(game)}/library_600x900.jpg` : ""].filter(Boolean))];
  return <Link className="community-poster-card" to={communityUrl(game)} state={{ communityGame: game }} aria-label={`Visit ${gameName(game)} community`}><span className="community-poster-art">{sources[imageIndex] ? <ArtworkImage src={sources[imageIndex]} alt="" loading="lazy" onError={() => setImageIndex((index) => index + 1)} /> : <span>{gameName(game)}</span>}</span><span className="community-poster-name">{gameName(game)}</span></Link>;
}

function GameCarousel({ games, title, portrait = false }) {
  const track = useRef(null);
  const headingId = useId();
  const [canScroll, setCanScroll] = useState({ previous: false, next: false });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setCanScroll({ previous: element.scrollLeft > 2, next: element.scrollLeft + element.clientWidth < element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [games]);
  const move = (direction) => {
    const element = track.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * Math.max(element.clientWidth * .75, 250), behavior: reducedMotion ? "auto" : "smooth" });
  };
  return <section className="community-featured-games" aria-labelledby={headingId}><div className="community-featured-games-heading"><h2 id={headingId}>{title}</h2><div className="community-featured-games-controls"><button type="button" onClick={() => move(-1)} disabled={!canScroll.previous} aria-label={`Previous ${title}`}><ChevronLeft size={18} /></button><button type="button" onClick={() => move(1)} disabled={!canScroll.next} aria-label={`Next ${title}`}><ChevronRight size={18} /></button></div></div><div className={`community-featured-games-track${portrait ? " community-poster-track" : ""}`} ref={track} tabIndex={0} aria-label={`Browse ${title}`}>{games.map((game) => portrait ? <PosterCard key={gameId(game)} game={game} /> : <GameCard key={gameId(game)} game={game} />)}</div></section>;
}

function CreatorAvatar({ creator }) {
  const [failed, setFailed] = useState(false);
  return <Link className={`community-live-creator community-live-creator--${creator.platform}`} to={`/community/live/${encodeURIComponent(creator.id)}`} aria-label={`Open ${creator.creator}'s ${creator.platform} stream`}><span className="community-live-avatar">{creator.avatarUrl && !failed ? <img src={creator.avatarUrl} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span aria-hidden="true">{creator.creator.charAt(0).toUpperCase()}</span>}<span className="community-live-platform"><img src={`https://cdn.simpleicons.org/${creator.platform}/ffffff`} alt="" /></span></span><span className="community-live-name">{creator.creator}</span></Link>;
}

function LiveCreators() {
  const list = useRef(null);
  const browseCreators = () => {
    const element = list.current;
    if (!element) return;
    const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2;
    element.scrollTo({ left: atEnd ? 0 : element.scrollWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <section className="community-live-creators" aria-labelledby="community-live-creators-heading"><div className="community-live-creators-heading"><h2 id="community-live-creators-heading">Live Now</h2><button type="button" onClick={browseCreators} aria-label="Browse all creators">View all <ArrowUpRight size={14} aria-hidden="true" /></button></div><div ref={list} className="community-live-creators-list" tabIndex={0} aria-label="Browse creators">{creatorSnapshots.map((creator) => <CreatorAvatar key={creator.id} creator={creator} />)}</div></section>;
}

function CommunityHome() {
  const [homeGames, setHomeGames] = useState([]);
  const [genreGames, setGenreGames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    axios.get("/games/home").then(({ data }) => {
      if (!active) return;
      setHomeGames(Array.isArray(data) ? data : []);
    }).catch(() => { if (active) setError("Could not load games. Please try again later."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    const genres = ["Action", "RPG", "Adventure", "Strategy", "Simulation", "Racing"];
    Promise.allSettled(genres.map((genre) => axios.get("/games/search/by-genres", { params: { genres: genre, limit: 18 } }))).then((results) => {
      if (!active) return;
      setGenreGames(Object.fromEntries(genres.map((genre, index) => [genre, results[index].status === "fulfilled" && Array.isArray(results[index].value.data) ? results[index].value.data : []])));
    });
    return () => { active = false; };
  }, []);
  const allGames = useMemo(() => uniqueGames(homeGames), [homeGames]);
  const wideRows = useMemo(() => {
    const preferred = [["sliders", "Featured communities"], ["trending", "Trending communities"], ["top_games", "Popular communities"]];
    const rows = preferred.map(([category, title]) => ({ title, games: uniqueGames(homeGames.filter((game) => game.category?.trim() === category)) })).filter((row) => row.games.length);
    if (!rows.length && allGames.length) rows.push({ title: "Game communities", games: allGames.slice(0, 8) });
    if (rows.length < 2 && allGames.length > 8) rows.push({ title: "More communities", games: allGames.slice(8, 16) });
    if (rows.length < 3 && allGames.length > 16) rows.push({ title: "Discover more games", games: allGames.slice(16, 24) });
    return rows;
  }, [homeGames, allGames]);
  const genreRows = useMemo(() => ["Action", "RPG", "Adventure", "Strategy", "Simulation", "Racing"].map((genre) => {
    const matching = allGames.filter((game) => Array.isArray(game.genres) && game.genres.some((item) => String(typeof item === "string" ? item : item?.description || item?.name || "").toLowerCase().includes(genre.toLowerCase())));
    return { title: `${genre} games`, games: uniqueGames([...matching, ...(genreGames[genre] || [])]) };
  }).filter((row) => row.games.length), [allGames, genreGames]);
  const rows = [];
  for (let index = 0; index < Math.max(wideRows.length, genreRows.length); index++) {
    if (wideRows[index]) rows.push({ ...wideRows[index], portrait: false });
    if (genreRows[index]) rows.push({ ...genreRows[index], portrait: true });
  }
  return <div className="community-discovery">
    <LiveStreams vertical limit={1} hideHeading previewOverlay featuredStream={creatorSnapshots.find((creator) => creator.id === "ishowspeed-youtube")} />
    <LiveCreators />
    {loading ? <div className="community-state"><LoadingIndicator label="Finding games" /></div> : error && !rows.length ? <div className="community-state" role="alert">{error}</div> : rows.length ? rows.map((row) => <GameCarousel key={row.title} title={row.title} games={row.games} portrait={row.portrait} />) : <div className="community-state">No games available right now.</div>}</div>
  ;
}

export default function Community() {
  const { pathname } = useLocation();
  const postMatch = useMatch("/community/:name/post/:postId");
  const gameMatch = useMatch("/community/:name");
  const liveMatch = useMatch("/community/live/:streamId");
  const explorer = pathname === "/community/home";
  const name = explorer ? undefined : postMatch?.params.name || gameMatch?.params.name;
  if (pathname === "/community" || pathname === "/community/" || pathname === "/community/trigger" || pathname === "/community/streams") return <Navigate to="/community/home" replace />;
  return <div className="community-page community-page--hub"><div className="community-content community-content--hub"><CommunityFeedHome initialCommunity={name} postId={postMatch?.params.postId} liveId={liveMatch?.params.streamId} explorer={explorer ? <CommunityHome /> : null} /></div></div>;
}
