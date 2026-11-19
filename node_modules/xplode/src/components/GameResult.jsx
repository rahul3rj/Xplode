import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownToLine, Star } from "lucide-react";
import ArtworkImage from "./ArtworkImage";

const platformIcons = [
  ["Steam", "/New Assets/Steam.svg"],
  ["Epic Games", "/New Assets/Epic Games.svg"],
  ["Xbox", "/Slider/Xbox.svg"],
  ["Pirate", "/New Assets/Pirate.svg"],
];

export default function GameResult({ game }) {
  const id = game.steam_appid || game.appid;
  const name = game.name || game.title || "Game";
  const genres = Array.isArray(game.genres) ? game.genres.map((item) => typeof item === "string" ? item : item?.description || item?.name).filter(Boolean) : [];
  const developer = Array.isArray(game.developers) ? game.developers.join(", ") : game.developer || game.developers || "";
  const [imageFailed, setImageFailed] = useState(false);
  let rating = null;
  try {
    const saved = JSON.parse(localStorage.getItem(`xplode-review-${id}`) || "null");
    if (Number.isInteger(saved?.rating) && saved.rating >= 1 && saved.rating <= 5) rating = saved.rating;
  } catch { /* A malformed local review should not prevent search results from loading. */ }
  return <article className="search-game">
    <Link className="search-game-image" to={`/game/${id}`} aria-label={`View ${name}`}>
      {!imageFailed && (game.header_image || game.capsule_image) ? <ArtworkImage src={game.header_image || game.capsule_image} alt="" loading="lazy" onError={() => setImageFailed(true)} /> : <span>{name}</span>}
    </Link>
    <div className="search-game-info">
      {game.matchType && <span className="search-game-match">{game.matchType}</span>}
      <div><Link className="search-game-title" to={`/game/${id}`}>{name}</Link>{developer && <p className="search-game-developer">{developer}</p>}<div className="search-game-genres">{genres.slice(0, 4).map((genre) => <span key={genre}>{genre}</span>)}</div></div>
      <div className="search-game-meta"><div className="search-game-platforms" aria-label="Download options">{platformIcons.map(([label, src]) => <img key={label} src={src} alt={label} title={label} />)}</div><div className="search-game-rating"><Star size={16} fill={rating ? "currentColor" : "none"} aria-hidden="true" /><span>{rating ? `${rating}.0 / 5 · Your rating` : "Not rated yet"}</span></div></div>
    </div>
    <Link className="search-game-download" to={`/game/${id}`}><ArrowDownToLine size={16} /> Download</Link>
  </article>;
}
