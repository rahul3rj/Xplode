import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownToLine } from "lucide-react";
import { storePortraitArtwork } from "../utils/libraryArtwork";
import ArtworkImage from "./ArtworkImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const imageValue = (value) => {
  if (Array.isArray(value)) return imageValue(value[0]);
  if (typeof value === "string") return value;
  return value?.url || value?.thumb || "";
};
const gameId = (game) => game.steam_appid || game.appid || game.id;
const prefersGridHero = (game) => [4435490, 4115450, 3357650].includes(Number(gameId(game)));
const gameName = (game) => game.name || game.title || "Game";
const heroImage = (game) => imageValue(game.hero_image) || imageValue(game.background_raw) || imageValue(game.background) || imageValue(game.header_image) || imageValue(game.capsule_image);
const portraitImage = (game) => imageValue(game.portrait_image) || imageValue(game.portraitUrl) || imageValue(game.capsule_image) || imageValue(game.header_image);
const wideImage = (game) => imageValue(game.capsule_image) || heroImage(game) || portraitImage(game);
const description = (game) => (game.short_description || game.description || game.desc || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function Platforms() {
  return <div className="showcase-platforms" aria-label="Platforms"><img src="/New%20Assets/Steam.svg" alt="Steam" /><img src="/New%20Assets/Epic%20Games.svg" alt="Epic Games" /><img src="/New%20Assets/Pirate.svg" alt="Pirate" /></div>;
}

export function GameLogo({ game, variant = "hero" }) {
  const id = gameId(game);
  const apiLogo = imageValue(game.logos) || imageValue(game.logo) || imageValue(game.logo_image);
  const steamLogo = id ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/logo.png` : "";
  const [source, setSource] = useState(apiLogo || steamLogo);
  const [trimmedSource, setTrimmedSource] = useState("");

  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const scale = Math.min(1, 1024 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            if (pixels[(y * canvas.width + x) * 4 + 3] > 8) {
              left = Math.min(left, x); right = Math.max(right, x);
              top = Math.min(top, y); bottom = Math.max(bottom, y);
            }
          }
        }
        if (right < left || bottom < top) return;
        const cropped = document.createElement("canvas");
        cropped.width = right - left + 1;
        cropped.height = bottom - top + 1;
        const croppedContext = cropped.getContext("2d");
        if (!croppedContext) return;
        croppedContext.drawImage(canvas, left, top, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
        if (!cancelled) setTrimmedSource(cropped.toDataURL("image/png"));
      } catch {
        // Some image hosts do not allow canvas access; use the original image.
      }
    };
    image.src = source;
    return () => { cancelled = true; };
  }, [source]);

  if (!source) return variant === "wishlist" ? <h3>{gameName(game)}</h3> : <h1>{gameName(game)}</h1>;
  const frameClass = variant === "wishlist" ? "wishlist-logo-frame" : variant === "details" ? "details-logo-frame" : "store-hero-logo-frame";
  const logoClass = variant === "wishlist" ? "wishlist-logo" : variant === "details" ? "details-logo-image" : "store-hero-logo";
  return <div className={frameClass}><img className={logoClass} src={trimmedSource || source} alt={gameName(game)} onError={() => { setTrimmedSource(""); setSource((current) => steamLogo && current !== steamLogo ? steamLogo : ""); }} /></div>;
}

export function StoreHero({ games }) {
  const [autoplay] = useState(() => localStorage.getItem("xplode-banner-autoplay") !== "false");
  if (!games.length) return null;
  return <section className="store-hero" aria-label="Featured games">
    <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" fadeEffect={{ crossFade: true }} autoplay={autoplay ? { delay: 10000, disableOnInteraction: false } : false} pagination={{ clickable: true }}>
      {games.map((game, index) => <SwiperSlide key={gameId(game) || index}>
        <div className="store-hero-slide">
          <ArtworkImage
            className="store-hero-image"
            src={prefersGridHero(game) ? heroImage(game) : gameId(game) ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId(game)}/library_hero_2x.jpg` : heroImage(game)}
            alt=""
            fetchPriority={index === 0 ? "high" : "auto"}
            onError={(event) => {
              const fallback = prefersGridHero(game) ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${gameId(game)}/library_hero_2x.jpg` : heroImage(game);
              if (fallback && !event.currentTarget.dataset.usedFallback) {
                event.currentTarget.dataset.usedFallback = "true";
                event.currentTarget.src = fallback;
              }
            }}
          />
          <div className="store-hero-shade" />
          <Platforms />
          <div className="store-hero-content">
            <GameLogo key={gameId(game) || index} game={game} />
            <p>{description(game)}</p>
            <Link className="store-pill" to={`/game/${gameId(game)}`}>Download <ArrowDownToLine size={16} strokeWidth={1.7} aria-hidden="true" /></Link>
          </div>
        </div>
      </SwiperSlide>)}
    </Swiper>
  </section>;
}

function DrawerGroup({ games }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <div className="store-drawer">
    {games.map((game, index) => <Link key={gameId(game) || index} to={`/game/${gameId(game)}`} className={`store-drawer-card ${activeIndex === index ? "is-active" : ""}`} onMouseEnter={() => { clearTimeout(timer.current); timer.current = setTimeout(() => setActiveIndex(index), 1000); }} onMouseLeave={() => clearTimeout(timer.current)} onFocus={() => { clearTimeout(timer.current); setActiveIndex(index); }} aria-label={gameName(game)}>
      <DrawerArtwork game={game} variant="wide" />
      <DrawerArtwork game={game} variant="portrait" />
    </Link>)}
  </div>;
}

function DrawerArtwork({ game, variant }) {
  const [index, setIndex] = useState(0);
  const id = gameId(game);
  const battlefield = Number(id) === 2807960;
  const portraitAssets = Array.isArray(game.portrait_image)
    ? game.portrait_image.flatMap((image) => [image?.url, image?.thumb])
    : [imageValue(game.portrait_image)];
  const knownBattlefield = battlefield
    ? variant === "portrait"
      ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/9aa0e12a58caa5b90fc3f9d4d11085a35b1a65e4/library_capsule.jpg"
      : "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2807960/a9052c33c3bc80dc8f55fbfb3d18a62d6d762b2a/capsule_616x353.jpg"
    : "";
  const candidates = variant === "portrait"
    ? storePortraitArtwork(game)
    : [knownBattlefield, wideImage(game), imageValue(game.header_image), heroImage(game), ...portraitAssets];
  const sources = [...new Set(candidates.filter((source) => typeof source === "string" && source && source !== "/default-game-cover.jpg"))];
  if (!sources[index]) return <span className={`drawer-image-fallback drawer-${variant}`} aria-hidden="true">{gameName(game)}</span>;
  return <ArtworkImage className={`drawer-${variant}`} src={sources[index]} alt="" onError={() => setIndex((current) => current + 1)} />;
}

export function StoreDrawer({ games, title }) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState("");
  const pages = Math.ceil(games.length / 6);
  useEffect(() => { setPage((current) => Math.min(current, Math.max(0, pages - 1))); }, [pages]);
  if (!games.length) return null;
  return <section className="store-section"><h2>{title}</h2><div className="store-carousel">
    <button type="button" className="store-arrow prev" disabled={page === 0} onClick={() => { setDirection("previous"); setPage((current) => current - 1); }} aria-label={`Previous ${title}`} />
    <div key={page} className={`store-drawer-page${direction ? ` store-drawer-page--${direction}` : ""}`}>
      <DrawerGroup games={games.slice(page * 6, page * 6 + 6)} />
    </div>
    <button type="button" className="store-arrow next" disabled={page >= pages - 1} onClick={() => { setDirection("next"); setPage((current) => current + 1); }} aria-label={`Next ${title}`} />
    <span className="store-sr-only" aria-live="polite">{title}, page {page + 1} of {pages}</span>
  </div></section>;
}

export function WishlistShowcase({ games }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(games.length / 2);
  useEffect(() => { setPage((current) => Math.min(current, Math.max(0, pages - 1))); }, [pages]);
  if (!games.length) return null;
  return <section className="store-section"><h2>Your Wishlist</h2><div className="store-carousel">
    <button type="button" className="store-arrow prev" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous wishlist games" />
    <div className="wishlist-grid">{games.slice(page * 2, page * 2 + 2).map((game, index) => <article className="wishlist-card" key={gameId(game) || index}>
      <ArtworkImage className="wishlist-image" src={heroImage(game) || wideImage(game)} alt="" loading="lazy" onError={(event) => { const fallback = imageValue(game.header_image); if (fallback && !event.currentTarget.dataset.usedFallback) { event.currentTarget.dataset.usedFallback = "true"; event.currentTarget.src = fallback; } }} /><div className="wishlist-shade" /><Platforms />
      <div className="wishlist-content"><GameLogo key={gameId(game) || index} game={game} variant="wishlist" />
        {description(game) && <p>{description(game)}</p>}
        <div className="wishlist-bottom"><div className="wishlist-genres">{(Array.isArray(game.genres) ? game.genres : []).slice(0, 3).map((genre) => <span key={typeof genre === "string" ? genre : genre.description}>{typeof genre === "string" ? genre : genre.description}</span>)}</div><Link className="store-pill" to={`/game/${gameId(game)}`}>Download <ArrowDownToLine size={14} strokeWidth={1.7} aria-hidden="true" /></Link></div>
      </div>
    </article>)}</div>
    <button type="button" className="store-arrow next" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next wishlist games" />
  </div></section>;
}
